import { WebSocketServer } from 'ws';
import { encode, decode } from './../protocol.js';

const log = (...a) => console.log('[ws]', ...a);

/**
 * Minimal, read-only broadcast transport.
 *
 * A client receives the round snapshot on connect (`hello`) and then only
 * incremental messages. The server never waits on a client, never queues
 * per-socket buffers beyond one in-flight frame, and pushes to every ready
 * socket in O(n) with no polling.
 */
export function attachWebSocket(server, engine, config, ledger) {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    maxPayload: config.maxPayloadBytes,
    // Compression buys ~nothing on messages this small and costs CPU plus
    // per-connection memory, so it is deliberately off.
    perMessageDeflate: false,
    // Trust the proxy's X-Forwarded-For when present so per-IP limits are
    // meaningful behind a load balancer.
    verifyClient: ({ origin, req }, done) => {
      if (config.allowedOrigins.length && origin && !config.allowedOrigins.includes(origin)) {
        return done(403, 'origin not allowed');
      }
      done(true);
    },
  });

  const perIp = new Map();
  let connections = 0;
  let playerSeq = 0;

  const ipOf = (req) => {
    const fwd = req.headers['x-forwarded-for'];
    if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
    return req.socket.remoteAddress ?? 'unknown';
  };

  wss.on('connection', (ws, req) => {
    const ip = ipOf(req);

    // --- Connection budget -------------------------------------------------
    const existing = perIp.get(ip) ?? 0;
    if (existing >= config.maxConnsPerIp || connections >= config.maxConnections) {
      ws.close(1013, 'try again later');
      return;
    }
    perIp.set(ip, existing + 1);
    connections += 1;
    // Each connection gets an identity for the betting ledger. In production
    // this would be an authenticated session id; here it is derived per socket,
    // so a reconnect starts a fresh player (and a fresh 1000 credits).
    ws.__playerId = `p${++playerSeq}`;
    const playerId = ws.__playerId;
    ledger.player(playerId); // create up front so `hello` can carry the balance

    ws.__isAlive = true;
    ws.__remote = ip;
    log(`+ ${ip} (${connections} open)`);

    // --- Resume: hand the client the current state immediately --------------
    const snapshot = engine.current;
    if (snapshot) {
      send(ws, encode.hello({
        ...snap(config, engine, snapshot),
        balance: ledger.balanceOf(playerId),
      }));
    }

    ws.on('pong', () => { ws.__isAlive = true; });

    ws.on('message', (raw) => {
      const msg = decode(raw.toString());
      if (!msg) return; // ignore garbage silently; do not amplify
      if (msg.t === 'ping') return send(ws, encode.pong());
      if (msg.t === 'bye') return ws.close(1000, 'bye');
      if (msg.t === 'bet') return handleBet(ws, playerId, msg);
      // Everything else is intentionally ignored: the feed is otherwise
      // read-only, so there is no attack surface in accepting more verbs.
    });

    const cleanup = () => {
      connections -= 1;
      perIp.set(ip, Math.max(0, (perIp.get(ip) ?? 1) - 1));
      if (perIp.get(ip) === 0) perIp.delete(ip);
      // A client that vanishes mid-betting never sees the result, so its stake
      // on the round in flight is refunded rather than silently lost. Guarded
      // against double-execution: `close` and `error` can both fire.
      if (!ws.__refunded) {
        ws.__refunded = true;
        const live = engine.current;
        if (live) ledger.refundPlayerRound(playerId, live.roundId);
      }
      log(`- ${ip} (${connections} open)`);
    };
    ws.on('close', cleanup);
    ws.on('error', cleanup);
  });

  // --- Heartbeat -----------------------------------------------------------
  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.__isAlive === false) { ws.terminate(); continue; }
      ws.__isAlive = false;
      try { ws.ping(); } catch { /* socket already gone */ }
    }
  }, config.heartbeatMs);
  heartbeat.unref?.();

  /**
   * Place a bet.
   *
   * Order matters, and it is the security of this feature:
   *   1. check the betting window FIRST (server clock, authoritative), then
   *   2. check the round id matches (stale bet), then
   *   3. validate and debit via the ledger.
   *
   * The window check must come before the ledger: a bet arriving a millisecond
   * late must be refused, and consulting the ledger first would debit a player
   * for a bet the server then refuses to honour.
   */
  function handleBet(ws, playerId, msg) {
    if (!engine.isBettingOpen(msg.r)) {
      return send(ws, encode.betNo('betting_closed', ledger.balanceOf(playerId)));
    }
    const result = ledger.place(playerId, msg.r, {
      kind: msg.k,
      selection: msg.v,
      stake: msg.s,
    });
    if (!result.ok) return send(ws, encode.betNo(result.reason, result.balance));
    send(ws, encode.betOk(result));
  }

  // --- Engine -> socket fan-out -------------------------------------------
  // One handler set, three tiny messages. No per-connection timer is created,
  // so 10k idle clients cost one interval, not 10k timers.
  engine.on('draw', (round) => {
    // The public result goes to everyone...
    broadcast(wss, encode.draw(snap(config, engine, round)));
    // ...but the payout is private. Settle first, then deliver only to the
    // sockets belonging to players who actually had money at stake. Doing this
    // here (rather than in the engine) keeps balances out of the broadcast path
    // entirely, so one player's winnings can never leak into another's feed.
    for (const result of ledger.settle(round.roundId, round.number)) {
      const payload = encode.settle({ roundId: round.roundId, number: round.number, ...result });
      for (const ws of wss.clients) {
        if (ws.__playerId === result.playerId) send(ws, payload);
      }
    }
  });
  engine.on('phase', (round) => broadcast(wss, encode.close(snap(config, engine, round))));
  engine.on('round', (round) => {
    // A newly opened round always starts in `betting`, so it is a phase change
    // like any other and reuses the `close` frame. Emitting unconditionally
    // (rather than checking the phase) keeps this correct if the opening phase
    // ever changes.
    broadcast(wss, encode.close(snap(config, engine, round)));
  });

  wss.on('close', () => clearInterval(heartbeat));
  return wss;
}

/** Build the wire snapshot for a round, with live-relative countdown. */
export function snap(config, engine, round) {
  return {
    roundId: round.roundId,
    number: round.number,
    phase: round.phase,
    hash: round.hash,
    seed: round.revealed ? round.seed : undefined,
    deadline: round.deadline,
    msLeft: Math.max(0, round.deadline - Date.now()),
    heartbeatMs: config.heartbeatMs,
  };
}

function broadcast(wss, payload) {
  // Serialise once, then push the same immutable string to every socket. String
  // is `send`'s native input, so there is no per-client encoding cost.
  const frame = JSON.stringify(payload);
  for (const ws of wss.clients) send(ws, frame);
}

/**
 * Send one frame. Objects are serialised here, at the wire boundary, so no
 * caller has to remember to do it -- getting that wrong previously made
 * `ws.send()` throw a TypeError that was silently swallowed, and `hello` never
 * reached any client.
 *
 * Errors are logged, never swallowed: a silent send failure looks identical to
 * a quiet server from the client's point of view.
 */
function send(ws, payload) {
  if (ws.readyState !== ws.OPEN) return false;
  try {
    ws.send(typeof payload === 'string' ? payload : JSON.stringify(payload));
    return true;
  } catch (err) {
    log(`send failed for ${ws.__remote}: ${err.message}`);
    return false;
  }
}