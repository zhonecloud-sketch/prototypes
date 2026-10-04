/**
 * Wire protocol for the roulette feed.
 *
 * Design rule: the socket carries *facts*, never *presentation*. Anything a
 * client can derive from the number it already has (colour, odd/even, halves,
 * dozens, columns, neighbours) is deliberately NOT sent. That is what keeps
 * the broadcast small enough to fit a 30-second tick with room to spare and
 * makes the payload identical for web, Android and iOS clients.
 *
 * Every message is a JSON object with a 1-char `t` discriminator. Keys are
 * short because the feed is bandwidth-sensitive; this table is the contract.
 *
 *   t      type      meaning
 *   -----  --------  ---------------------------------------------------
 *   r      roundId   monotonic integer, identifies the round
 *   n      number    pocket 0-36 (0 = green, single-zero wheel)
 *   ph     phase     'betting' | 'closed' | 'settling'
 *   d      deadline  epoch ms of the next phase transition
 *   ms     msLeft    ms until `d`, so clients need no clock sync
 *   h      hash      sha256(serverSeed) hex — the commitment
 *   sv     seed      revealed serverSeed hex (only after settle)
 *   hb     hb        heartbeat interval ms
 *   k      kind      bet type: straight|dozen|column|low|high|odd|even|red|black
 *   v      sel       bet selection (number for straight, 0-2 for dozen/column)
 *   s      stake     bet amount (integer credits)
 *   b      bal       player's credit balance
 *   tot    total     total staked by this player on the round
 *   rt     returned  gross returned on settlement
 *   net    net       profit (may be negative)
 *   win    wins      [{k, v, rt}] winning bets
 *   why    reason    machine-readable rejection code
 *
 * Server -> client
 *   {t:'hello', r, ph, d, ms, h, hb, b}      snapshot on connect, resume point
 *   {t:'draw',   r, n, d, ms, h, sv}         settled result (+ audit material)
 *   {t:'close',  r, ph, d, ms}               phase change (open / close / settle)
 *
 * The three above are BROADCAST -- identical bytes to every client, and the
 * only frames that are. The two below are PRIVATE, sent only to the socket that
 * placed a bet, so a player's money can never leak into another player's feed.
 *
 *   {t:'bet',    ok:1, b, tot}               bet accepted
 *   {t:'bet',    ok:0, why, b}               bet rejected, with the reason
 *   {t:'settle', r, n, st, rt, net, b, win}  per-player result (bets only)
 *
 * Client -> server (everything except `bet` and `ping` is optional)
 *   {t:'bet', r, k, v, s}                    place a bet on round r
 *   {t:'ping'}                               app-level ping (WS ping frames are used too)
 *   {t:'bye'}                                graceful disconnect
 */
export const PHASE = Object.freeze({
  BETTING: 'betting',
  CLOSED: 'closed',
  SETTLING: 'settling',
});

/** Compact wire encoders. Kept in one file so the contract has one home. */
export const encode = {
  hello: (s) => ({
    t: 'hello', r: s.roundId, ph: s.phase, d: s.deadline, ms: s.msLeft,
    h: s.hash, hb: s.heartbeatMs, b: s.balance,
  }),
  draw: (s) => ({ t: 'draw', r: s.roundId, n: s.number, d: s.deadline, ms: s.msLeft, h: s.hash, ...(s.seed ? { sv: s.seed } : {}) }),
  close: (s) => ({ t: 'close', r: s.roundId, ph: s.phase, d: s.deadline, ms: s.msLeft }),

  /** Bet accepted: new balance and the running total on this round. */
  betOk: (b) => ({ t: 'bet', ok: 1, b: b.balance, tot: b.total }),
  /** Bet refused. `why` is machine-readable; the client maps it to a message. */
  betNo: (why, balance) => ({ t: 'bet', ok: 0, why, b: balance }),

  /** Per-player result. Sent only to players who actually had money at stake. */
  settle: (s) => ({
    t: 'settle', r: s.roundId, n: s.number, st: s.staked, rt: s.returned,
    net: s.net, b: s.balance,
    win: s.winners.map((w) => ({ k: w.kind, v: w.selection, rt: w.gross })),
  }),

  pong: () => ({ t: 'pong' }),
};

/** Minimal safe parser: never throws, rejects anything that is not a small object. */
export function decode(raw) {
  if (typeof raw !== 'string' || raw.length > 512) return null;
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    return null;
  }
  if (msg === null || typeof msg !== 'object' || Array.isArray(msg)) return null;
  return msg;
}