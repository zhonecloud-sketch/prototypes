// Roulette feed client.
//
// Mirrors what an Android/iOS client must also do: connect, trust nothing,
// re-derive the result locally, and reconnect indefinitely with backoff.

const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const colorOf = (n) => (n === 0 ? 'green' : RED.has(n) ? 'red' : 'black');

/** Must match server/roulette.js SAMPLING_BOUND for verification to agree. */
const SAMPLING_BOUND = 0x100000000 - (0x100000000 % 37);

const $ = (id) => document.getElementById(id);
const els = {
  status: $('status'), statusText: $('statusText'), phase: $('phase'), number: $('number'),
  countdown: $('countdown'), bar: $('bar'), round: $('round'), hash: $('hash'),
  strip: $('strip'), verify: $('verify'),
  betting: $('betting'), bank: $('bank'), chips: $('chips'), felt: $('felt'),
  dozens: $('dozens'), halves: $('halves'), columns: $('columns'),
  evenMoney: $('evenMoney'), note: $('note'),
};

/* ---------------------------------------------------------------- betting --- */

/** Key identifying a bet target; mirrors the server's (kind, selection). */
const betKey = (kind, sel) => `${kind}:${sel ?? ''}`;

let stake = 5;
let balance = null;
/** Bet totals keyed by betKey, for the current round only (display convenience).
 *  The server holds the authoritative list; this is just what to highlight. */
let placed = new Map();
let bettingOpen = false;

/** Build the number grid and every outside bet button once, at startup. */
function buildTable() {
  // Felt: column-major like a real table — 1,2,3 across the top row.
  const frag = document.createDocumentFragment();
  for (let col = 0; col < 12; col++) {
    for (let row = 0; row < 3; row++) {
      const n = row * 12 + col + 1; // 1..36
      frag.append(makeCell('straight', n, String(n), colorOf(n)));
    }
  }
  els.felt.append(frag);

  // 0 sits alone on the left, spanning the full height of the grid.
  els.felt.prepend(makeCell('straight', 0, '0', 'green', 'zero'));

  for (const [i, label] of [[0, '1st 12'], [1, '2nd 12'], [2, '3rd 12']]) {
    els.dozens.append(makeCell('dozen', i, label, '', '2:1'));
  }
  els.halves.append(makeCell('low', '', '1–18', ''), makeCell('high', '', '19–36', ''));
  for (const i of [0, 1, 2]) els.columns.append(makeCell('column', i, '2:1', ''));
  els.evenMoney.append(
    makeCell('even', '', 'EVEN', ''),
    makeCell('odd', '', 'ODD', ''),
    makeCell('red', '', 'RED', 'red'),
    makeCell('black', '', 'BLACK', 'black')
  );

  // The red/black buttons share one 2-column row.
  els.evenMoney.style.gridTemplateColumns = 'repeat(4, 1fr)';
}

/** One tappable betting target. */
function makeCell(kind, sel, label, color, extraClass = '') {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = extraClass.startsWith('zero') ? 'cell zero' : (kind === 'straight' ? 'cell' : 'ob');
  if (color) el.dataset.color = color;
  // data-key lets the highlight, the settlement flash and the click handler all
  // refer to a target the same way, without a second lookup table.
  el.dataset.kind = kind;
  el.dataset.key = betKey(kind, sel);
  el.textContent = label;
  el.title = `${kind}${sel === '' ? '' : ` ${sel}`}`;
  el.addEventListener('click', () => placeBet(kind, sel));
  return el;
}

function placeBet(kind, sel) {
  if (!bettingOpen) return note('betting is closed', 'bad');
  if (balance !== null && stake > balance) return note('not enough credits', 'bad');
  // Optimistic highlight, then let the server's reply correct it. The delay
  // between tap and confirmation is a few ms on localhost, so waiting for the
  // round trip would make the table feel unresponsive.
  const key = betKey(kind, sel);
  placed.set(key, (placed.get(key) ?? 0) + stake);
  refreshPlaced();
  send({ t: 'bet', r: currentRound, k: kind, v: sel, s: stake });
}

function note(text, kind = '') {
  els.note.className = `note ${kind}`;
  els.note.textContent = text;
}

/**
 * Highlight the targets that carry a bet and update the staked total.
 *
 * Only updates the note when something is currently staked, so a transient
 * message (a rejection, a settlement) is not immediately overwritten.
 */
function refreshPlaced() {
  for (const el of els.betting.querySelectorAll('[data-hit]')) delete el.dataset.hit;
  for (const key of placed.keys()) {
    for (const el of els.betting.querySelectorAll(`[data-key="${CSS.escape(key)}"]`)) {
      el.dataset.hit = '1';
    }
  }
  const total = [...placed.values()].reduce((a, b) => a + b, 0);
  if (total > 0) {
    els.note.className = 'note';
    els.note.textContent = `${total} staked this round`;
  }
}

/** Toggle whether the table accepts taps. */
function setBettingOpen(open) {
  bettingOpen = open;
  els.betting.dataset.open = open ? '1' : '0';
}

function setBalance(b) {
  if (typeof b !== 'number') return;
  balance = b;
  els.bank.textContent = b;
}

/** Send a frame if the socket is open; silently ignore when it is not. */
function send(msg) {
  if (ws?.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(msg));
}

/** Human-readable text for each server rejection reason. */
const BET_ERRORS = {
  betting_closed: 'betting closed — too late for this round',
  insufficient_funds: 'not enough credits',
  above_maximum: 'bet is over the per-bet limit',
  below_minimum: 'bet is under the minimum',
  unknown_bet: 'unknown bet type',
  bad_stake: 'invalid bet amount',
  bad_selection: 'invalid selection',
};

/**
 * Show the result of the round the player had money in: flash the winning
 * pockets, then state the money. Money is stated first because that is what
 * the player actually came to see.
 */
function flashResult(msg) {
  // Clear last round's marks, then mark anything that just paid.
  for (const el of els.betting.querySelectorAll('[data-win]')) delete el.dataset.win;
  for (const w of msg.win ?? []) {
    const key = betKey(w.k, w.v === null || w.v === undefined ? '' : w.v);
    for (const el of els.betting.querySelectorAll(`[data-key="${CSS.escape(key)}"]`)) {
      el.dataset.win = '1';
    }
  }

  const delta = msg.net;
  const sign = delta > 0 ? '+' : '';
  const cls = delta > 0 ? 'ok' : delta < 0 ? 'bad' : '';
  note(`${msg.n} · ${sign}${delta} credits (returned ${msg.rt})`, cls);

  // Clear this round's bets, but keep the settlement note on screen: it is the
  // answer to "did I win?", and wiping it a frame later would be confusing.
  for (const el of els.betting.querySelectorAll('[data-hit]')) delete el.dataset.hit;
  placed = new Map();
}

/** Wire the chip selector. */
function initChips() {
  els.chips.addEventListener('click', ({ target }) => {
    const btn = target.closest('.chip-btn');
    if (!btn) return;
    stake = Number(btn.dataset.stake);
    for (const b of els.chips.querySelectorAll('.chip-btn')) {
      b.setAttribute('aria-pressed', String(b === btn));
    }
  });
}

let ws = null;
let attempt = 0;
let roundStart = 0;
let history = [];
/** Round the client believes it is betting on. Every bet carries it, so the
 *  server can reject a bet aimed at a round that has already closed. */
let currentRound = null;
/**
 * Length of one round, used to drive the progress bar. The server sends `ms`
 * (time left) rather than the round length, so a client joining mid-round can
 * still show an accurate countdown; the total is derived from consecutive
 * observations rather than hardcoded, so a server-side ROUND_MS change is
 * picked up automatically.
 */
let roundMs = 30_000;
let lastDrawAt = 0;

function setStatus(state, text) {
  els.status.dataset.state = state;
  els.statusText.textContent = text;
}

function show(n, roundId, hash) {
  els.number.textContent = n;
  els.number.dataset.color = colorOf(n);
  els.round.textContent = roundId ?? '-';
  els.hash.textContent = hash ? `${hash.slice(0, 10)}…` : '-';
}

function connect() {
  const url = new URL('/ws', location.href);
  url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  setStatus('connecting', attempt ? `reconnecting…` : 'connecting');

  ws = new WebSocket(url);

  ws.onopen = () => { attempt = 0; setStatus('live', 'live'); };

  ws.onmessage = ({ data }) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }

    switch (msg.t) {
      case 'hello':
        // Resume point: everything needed to render immediately, so a cold
        // start or a reconnect shows the live round with no waiting.
        currentRound = msg.r ?? null;
        setBalance(msg.b);
        if (msg.ph) els.phase.textContent = msg.ph;
        els.round.textContent = msg.r ?? '-';
        els.hash.textContent = msg.h ? `${msg.h.slice(0, 10)}…` : '-';
        setBettingOpen(msg.ph === 'betting');
        applyDeadline(msg.d, msg.ms);
        break;

      case 'close':
        els.phase.textContent = msg.ph;
        currentRound = msg.r ?? currentRound;
        // Betting locks the moment the window closes, regardless of what the
        // clock still shows -- the server has already stopped accepting bets.
        setBettingOpen(msg.ph === 'betting');
        if (msg.ph === 'betting') { placed = new Map(); refreshPlaced(); }
        applyDeadline(msg.d, msg.ms);
        break;

      case 'bet':
        // The server is authoritative on whether a bet landed, so the client
        // only reflects the outcome it is told about.
        setBalance(msg.b);
        if (msg.ok) {
          note('bet placed', 'ok');
        } else {
          note(BET_ERRORS[msg.why] ?? `bet rejected: ${msg.why}`, 'bad');
        }
        break;

      case 'settle':
        setBalance(msg.b);
        flashResult(msg);
        break;

      case 'draw': {
        els.phase.textContent = 'settled';
        setBettingOpen(false);
        // Self-calibrate the round length from the wall-clock gap between
        // consecutive draws, so a server-side ROUND_MS change shows up in the
        // progress bar with no client release.
        const now = Date.now();
        if (lastDrawAt) {
          const observed = now - lastDrawAt;
          if (observed > 1_000 && observed < 10 * 60_000) roundMs = observed;
        }
        lastDrawAt = now;

        show(msg.n, msg.r, msg.h);
        applyDeadline(msg.d, msg.ms);
        pushHistory(msg.n, msg.r);
        if (msg.sv) verifyRound(msg.r, msg.n, msg.h, msg.sv);
        break;
      }
    }
  };

  ws.onclose = () => {
    setStatus('offline', 'offline');
    scheduleReconnect();
  };

  ws.onerror = () => ws?.close(); // let onclose drive the retry
}

function scheduleReconnect() {
  // Exponential backoff with jitter. Jitter matters: without it, every client
  // dropped by a deploy would retry in lockstep and re-synchronise the server.
  const base = Math.min(30_000, 500 * 2 ** attempt++);
  const delay = base * (0.5 + Math.random() * 0.5);
  setTimeout(connect, delay);
}

/**
 * Drive the countdown from the server's absolute deadline rather than from
 * message arrival time, so the bar stays correct even if a message is late.
 */
function applyDeadline(deadline, msLeft) {
  const now = Date.now();
  const remaining = msLeft ?? Math.max(0, deadline - now);
  roundStart = performance.now() - (roundMs - remaining);
  tick();
}

function pushHistory(n, roundId) {
  history.unshift({ n, roundId });
  history = history.slice(0, 18);
  els.strip.replaceChildren(
    ...history.map((h) => {
      const el = document.createElement('div');
      el.className = 'chip';
      el.dataset.color = colorOf(h.n);
      el.textContent = h.n;
      el.title = `round ${h.roundId}`;
      return el;
    })
  );
}

/**
 * Rebuild the number from the revealed seed, mirroring the server's
 * `numberFrom` exactly: HMAC-SHA256(seed, "r<id>:a0"), consumed as 32-bit
 * big-endian words with rejection sampling at SAMPLING_BOUND.
 */
async function deriveNumber(seed, roundId) {
  const key = await crypto.subtle.importKey(
    'raw', hexToBytes(seed), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`r${roundId}:a0`));
  const view = new DataView(sig);
  for (let i = 0; i < 8; i++) {
    const word = view.getUint32(i * 4);
    if (word < SAMPLING_BOUND) return word % 37;
  }
  throw new Error('rejection sampling did not terminate');
}

const hexToBytes = (hex) =>
  new Uint8Array((hex.match(/../g) ?? []).map((b) => parseInt(b, 16)));

/**
 * Independently re-derive the number from the revealed seed.
 *
 * This is the client-side half of provable fairness: the server's claim that it
 * committed before betting closed can be checked without trusting the server.
 */
async function verifyRound(roundId, declared, hash, seed) {
  els.verify.className = 'verify';
  els.verify.textContent = 'verifying…';
  try {
    const derived = await deriveNumber(seed, roundId);
    const digestHex = [...new Uint8Array(
      await crypto.subtle.digest('SHA-256', hexToBytes(seed))
    )].map((b) => b.toString(16).padStart(2, '0')).join('');

    const numberOk = derived === declared;
    const commitOk = digestHex === hash;
    const ok = numberOk && commitOk;

    els.verify.className = `verify ${ok ? 'ok' : 'bad'}`;
    els.verify.textContent = ok
      ? `✓ round ${roundId} independently verified`
      : `✗ round ${roundId} failed`
        + (!commitOk ? ' (seed does not match published commitment)' : ` (derived ${derived}, declared ${declared})`);
  } catch (err) {
    els.verify.className = 'verify bad';
    els.verify.textContent = `verification error: ${err.message}`;
  }
}

/** Countdown + progress bar. Driven by the deadline, not by message arrival. */
function tick() {
  const elapsed = performance.now() - roundStart;
  const left = Math.max(0, roundMs - elapsed);
  els.countdown.textContent = left > 0 ? `next draw in ${(left / 1000).toFixed(1)}s` : 'settling…';
  els.bar.style.transform = `scaleX(${Math.min(1, elapsed / roundMs)})`;
  requestAnimationFrame(tick);
}

// Pause the animation loop when the tab is hidden; a mobile app backgrounded
// for a minute should not burn frames.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) requestAnimationFrame(tick);
});

// Recover history over REST on cold start, so the page shows the last result
// immediately instead of waiting up to 30s for the first draw. This REST
// fallback is exactly what native apps need after a cold start or a long
// background suspend, where the socket was dead and draws were missed.
fetch('/api/history?limit=18')
  .then((r) => r.json())
  .then(({ rounds }) => {
    if (!rounds?.length) return;
    for (const r of [...rounds].reverse()) pushHistory(r.number, r.roundId);
    const latest = rounds[0]; // newest first
    show(latest.number, latest.roundId, latest.hash);
  })
  .catch(() => { /* offline is fine; the socket will fill this in */ });

// Build the table and wire the chip selector before the first socket opens, so
// the felt is interactive the instant `hello` says betting is live.
buildTable();
initChips();

connect();