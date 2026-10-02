import http from 'node:http';
import { config, isProd } from './config.js';
import { RouletteEngine } from './roulette.js';
import { BetLedger } from './ledger.js';
import { attachWebSocket } from './transport/websocket.js';
import { createRequestHandler } from './http-api.js';

const log = (...args) => console.log(`[rou ${new Date().toISOString()}]`, ...args);

/**
 * Composition root.
 *
 * Note what is *not* here: no game rules, no protocol strings, no socket code
 * in the engine, and no engine code in the transport. Swapping WebSocket for
 * SSE, MQTT or a managed pub/sub service is a new `transport/*.js` plus one
 * line below — the round timing and fairness maths are untouched.
 */
const engine = new RouletteEngine({ roundMs: config.roundMs, bettingMs: config.bettingMs });

/** Bounded audit trail for /api/history and /api/verify. Swap for Redis/Postgres
 *  when you need history that outlives the process or spans replicas. */
const history = [];
engine.on('draw', (round) => {
  history.push({
    roundId: round.roundId,
    number: round.number,
    seed: round.seed,
    hash: round.hash,
    settledAt: Date.now(),
  });
  if (history.length > config.historyLimit) history.shift();
});

const server = http.createServer(createRequestHandler(engine, config, history));

/** Play-money balances. In-memory and per-connection; see README limitations. */
const ledger = new BetLedger({ startingBalance: config.startingBalance, maxStake: config.maxStake });

const wss = attachWebSocket(server, engine, config, ledger);

engine.on('draw', (round) => log(`round ${round.roundId} -> ${round.number}`));

server.listen(config.port, config.host, () => {
  // Log localhost, not 0.0.0.0: the bind address is not a URL you can open.
  const shown = config.host === '0.0.0.0' || config.host === '::' ? 'localhost' : config.host;
  log(`listening on http://${shown}:${config.port}`);
  log(`  demo client →  http://${shown}:${config.port}`);
  log(`  websocket    →  ws://${shown}:${config.port}/ws  (round=${config.roundMs / 1000}s, betting=${config.bettingMs / 1000}s)`);
  if (!isProd && !config.token) log('WARNING: WS_TOKEN unset — no client authentication (dev only)');
  if (!isProd && config.allowedOrigins.length === 0) log('WARNING: ALLOWED_ORIGINS unset — any origin may connect (dev only)');
});

// A busy port is the single most common first-run failure, and the raw
// EADDRINUSE stack trace gives no hint that a second copy is already running.
// `ws` attaches its own listener to the underlying http server, so the error
// surfaces on whichever emitter gets there first -- handle both, or this runs
// after an unhandled 'error' event has already killed the process.
for (const emitter of [server, wss]) {
  emitter.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      log(`ERROR: port ${config.port} is already in use.`);
      log('       Another copy is probably still running — stop it with:');
      log(`         lsof -ti:${config.port} | xargs kill -9`);
      log(`       …or start this one on another port:  PORT=8081 npm start`);
    } else {
      log(`ERROR: ${err.message}`);
    }
    process.exit(1);
  });
}

engine.start();

// --- Graceful shutdown -----------------------------------------------------
// Mobile networks drop sockets constantly; a clean drain stops the engine
// mid-round and lets clients resume from `hello` on reconnect.
let closing = false;
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (closing) return;
    closing = true;
    log(`${signal} received, shutting down`);
    engine.stop();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5_000).unref();
  });
}