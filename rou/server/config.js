import path from 'node:path';
import { fileURLToPath } from 'node:url';

const int = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) throw new Error(`${name} must be an integer, got ${raw}`);
  return n;
};

const here = path.dirname(fileURLToPath(import.meta.url));

const roundMs = int('ROUND_MS', 30_000);
const defaultBettingMs = 24_000;
// Scale the betting window with the round unless it was set explicitly.
// Shortening ROUND_MS alone (the obvious thing to do while testing) would
// otherwise leave BETTING_MS longer than the round and fail validation.
const bettingMs = int('BETTING_MS', Math.min(defaultBettingMs, Math.round(roundMs * 0.8)));

if (!(roundMs > 0)) throw new Error(`ROUND_MS must be positive, got ${roundMs}`);
if (!(bettingMs > 0 && bettingMs < roundMs)) {
  throw new Error(
    `BETTING_MS (${bettingMs}) must be > 0 and < ROUND_MS (${roundMs}).\n` +
    `       Shortening the round? Lower the betting window too, e.g.\n` +
    `         ROUND_MS=${roundMs} BETTING_MS=${Math.round(roundMs * 0.8)} npm start`
  );
}

export const config = {
  host: process.env.HOST ?? '0.0.0.0',
  port: int('PORT', 8080),

  /** Broadcast cadence, per the spec. */
  roundMs,
  /** How long bets stay open inside a round; the tail is close + settle. */
  bettingMs,

  /** WebSocket liveness. Mobile networks silently drop idle sockets, so we
   *  ping proactively and drop peers that stop answering. */
  heartbeatMs: int('HEARTBEAT_MS', 20_000),
  /** Cap on a single inbound frame. Clients only ever send tiny control
   *  messages; anything larger is abuse or a bug. */
  maxPayloadBytes: int('MAX_PAYLOAD_BYTES', 4 * 1024),
  /** Per-IP concurrent connection ceiling. */
  maxConnsPerIp: int('MAX_CONNS_PER_IP', 8),
  /** Global ceiling so one bad actor cannot exhaust memory. */
  maxConnections: int('MAX_CONNECTIONS', 10_000),
  /** Payout / history persistence budget. */
  historyLimit: int('HISTORY_LIMIT', 120),

  /** Play-money bankroll for each player. Credits only -- there is no real
   *  currency anywhere in this system. */
  startingBalance: int('STARTING_BALANCE', 1000),
  /** Per-bet ceiling, so one mistaken tap cannot wipe out a bankroll. */
  maxStake: int('MAX_STAKE', 100),

  /**
   * Optional shared secret. Clients must present it as a query param or the
   * `Sec-WebSocket-Protocol` token. Empty disables auth (local prototype only).
   */
  token: process.env.WS_TOKEN ?? '',

  /** Allowed Origin values for browsers. Empty disables the check. */
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean),

  publicDir: path.join(here, '..', 'public'),
  logLevel: process.env.LOG_LEVEL ?? 'info',
};

export const isProd = process.env.NODE_ENV === 'production';