import crypto from 'node:crypto';
import { EventEmitter } from 'node:events';
import { PHASE } from './protocol.js';

/** Pockets 0-36 (single-zero wheel). 0 is green, 1-36 are red/black. */
export const POCKET_COUNT = 37;
const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

/** Tail of a round reserved for "no more bets" plus settling the result. */
export const SETTLE_MS = 2_000;

/**
 * Largest multiple of POCKET_COUNT that fits in 32 bits. Words at or above this
 * are rejected and redrawn, so every pocket is exactly equally likely.
 * Exported so tests can assert the divisor property directly.
 */
export const SAMPLING_BOUND = 2 ** 32 - (2 ** 32 % POCKET_COUNT);

/** Colour is a pure function of the number, so it is never sent on the wire. */
export const colorOf = (n) => (n === 0 ? 'green' : RED.has(n) ? 'red' : 'black');

/**
 * The public commitment: SHA-256 over the seed's RAW bytes.
 *
 * Deliberately hashes decoded bytes rather than the hex text. The seed is hex on
 * the wire for readability, but the commitment must have one portable
 * definition -- a browser verifying with WebCrypto naturally hashes the decoded
 * bytes, so hashing text here would make every client-side verification fail.
 */
export function commit(seed) {
  const key = Buffer.from(seed, 'hex');
  if (key.length === 0) throw new TypeError('seed must be hex-encoded bytes');
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Derive the winning pocket from (seed, roundId). Deterministic and public:
 * anyone holding the seed can recompute the result, which is what makes the
 * commit-reveal scheme auditable.
 *
 * The digest is consumed as consecutive 32-bit words and mapped with rejection
 * sampling. Plain `digest % 37` would bias the low pockets, because 2^32 is not
 * a multiple of 37; words landing in the ragged remainder are discarded and the
 * next word is tried. The rejection rate here is 7/2^32, so it terminates on the
 * first word in practice.
 */
export function numberFrom(seed, roundId) {
  // The seed is transmitted as hex for auditability, but is used here as RAW
  // BYTES. That matters: keying the HMAC on the hex *text* would make the
  // result depend on that encoding choice, and the browser's WebCrypto path
  // (which imports the decoded bytes) would then disagree with the server.
  // Raw bytes are the unambiguous, portable definition.
  const key = Buffer.from(seed, 'hex');
  if (key.length === 0) throw new TypeError('seed must be hex-encoded bytes');

  for (let attempt = 0; attempt < 128; attempt++) {
    const digest = crypto
      .createHmac('sha256', key)
      .update(`r${roundId}:a${attempt}`)
      .digest();
    for (let i = 0; i < 8; i++) {
      const candidate = digest.readUInt32BE(i * 4); // 4-byte stride: no gaps, no overlap
      if (candidate < SAMPLING_BOUND) return candidate % POCKET_COUNT;
    }
  }
  /* c8 ignore next -- unreachable short of a broken CSPRNG */
  throw new Error('rejection sampling failed to terminate');
}

/**
 * The draw engine. Owns round timing and provable fairness, and knows nothing
 * about HTTP, WebSockets or clients — it just emits events.
 *
 * Commit–reveal per round:
 *   1. a 32-byte seed is generated and its SHA-256 published while betting is
 *      still open, so the commitment predates the result;
 *   2. the number is derived deterministically from that seed + round id;
 *   3. the seed is revealed on settle, letting any client recompute the number
 *      and confirm the result was fixed in advance.
 *
 * The HMAC (rather than a bare digest) stops a client grinding seeds cheaply,
 * and rejection sampling removes the modulo bias of a naive `digest % 37`.
 *
 * That separation is what lets the same engine drive a WebSocket feed today and
 * an MQTT/gRPC/SSE transport tomorrow without touching a line of game logic.
 *
 * Emits:
 *   'round'  (round)  a round opened, with its published commitment
 *   'phase'  (round)  betting -> closed -> settling
 *   'draw'   (round)  settled result; round.seed is now revealed
 */
export class RouletteEngine extends EventEmitter {
  #roundMs;
  #bettingMs;
  #now;
  #timer = null;
  #roundId = 0;
  #round = null;

  constructor({ roundMs = 30_000, bettingMs = 24_000, now = Date.now } = {}) {
    super();
    if (!(roundMs > 0)) throw new Error('roundMs must be positive');
    if (!(bettingMs > 0 && bettingMs < roundMs)) throw new Error('bettingMs must be 0 < bettingMs < roundMs');
    this.#roundMs = roundMs;
    this.#bettingMs = bettingMs;
    this.#now = now;
  }

  get roundMs() { return this.#roundMs; }
  get bettingMs() { return this.#bettingMs; }

  /** Current round snapshot, or null before the engine is started. */
  get current() { return this.#round; }

  /**
   * Is the betting window open *right now*, for `roundId`?
   *
   * This is the authoritative gate for accepting bets. It deliberately checks
   * the wall clock rather than trusting the cached `phase`, because the phase
   * only advances on a tick: a bet arriving in that gap would otherwise be
   * accepted after the deadline. `roundId` must also match, so a bet built
   * against a stale round (a slow client, or one reconnecting mid-round) is
   * rejected rather than silently moved into the current one.
   */
  isBettingOpen(roundId) {
    const round = this.#round;
    if (!round) return false;
    if (roundId !== undefined && roundId !== round.roundId) return false;
    return round.phase === PHASE.BETTING && this.#now() < round.deadline;
  }

  start() {
    if (this.#timer) return this;
    this.#openRound();
    // Tick frequently enough that a phase change is noticed promptly, but the
    // schedule itself is absolute-deadline based (see #tick), so a coarse tick
    // costs accuracy only at the moment of transition, never drift over a round.
    // The timer is unref'd so it never keeps the process alive on its own.
    const period = Math.min(250, Math.max(25, this.#roundMs / 20));
    this.#timer = setInterval(() => this.#tick(), period);
    this.#timer.unref?.();
    return this;
  }

  stop() {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
    return this;
  }

  /** Exposed for tests: run one scheduling pass immediately, without waiting
   *  for the internal interval. Never called by the transport. */
  tickForTest() {
    this.#tick();
  }

  /** A fresh seed per round, so later rounds are independent of earlier ones. */
  #openRound() {
    const seed = crypto.randomBytes(32).toString('hex');
    this.#round = {
      roundId: ++this.#roundId,
      seed,
      hash: commit(seed),
      number: null,
      phase: PHASE.BETTING,
      openedAt: this.#now(),
      deadline: this.#now() + this.#bettingMs,
      revealed: false,
    };
    this.emit('round', this.#round);
    return this.#round;
  }

  #setPhase(phase, deadline) {
    const round = this.#round;
    if (!round || round.phase === phase) return;
    round.phase = phase;
    round.deadline = deadline;
    this.emit('phase', round);
  }

  /**
   * Absolute-deadline scheduling.
   *
   * Every phase deadline is derived from `openedAt` on a fixed grid rather than
   * from "now + interval". That is what keeps the round boundary aligned to the
   * wall clock after a process suspend, a slow GC pause or an NTP step, and it
   * makes `msLeft` mean the same thing on the server and on every client. A
   * self-rearming interval would drift; this cannot.
   */
  #tick() {
    let guard = 0;
    while (guard++ < 1_000) {
      const round = this.#round;
      if (!round) return;
      const now = this.#now();
      if (now < round.deadline) return;

      if (round.phase === PHASE.BETTING) {
        this.#setPhase(PHASE.CLOSED, round.openedAt + this.#roundMs - SETTLE_MS);
      } else if (round.phase === PHASE.CLOSED) {
        this.#setPhase(PHASE.SETTLING, round.openedAt + this.#roundMs);
      } else {
        this.#settle();
      }
    }
    /* c8 ignore next -- 1000 catch-up rounds means a >8h stall */
    console.warn('[roulette] tick guard tripped; resynchronising');
    this.#openRound();
  }

  #settle() {
    const round = this.#round;
    round.number = numberFrom(round.seed, round.roundId);
    round.revealed = true;
    this.emit('draw', round);
    this.#openRound();
  }
}