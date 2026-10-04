import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { createServer } from 'node:http';
import { RouletteEngine, numberFrom } from '../server/roulette.js';
import { BetLedger } from '../server/ledger.js';
import { attachWebSocket } from '../server/transport/websocket.js';
import { createRequestHandler } from '../server/http-api.js';

/**
 * Integration test: a real HTTP server, a real `ws` client, a real draw.
 * This catches wiring mistakes unit tests structurally cannot, e.g. a snapshot
 * that serialises `undefined`, or a transport that forgets to fan out `draw`.
 */
const ROUND_MS = 300;
const BETTING_MS = 200;

async function startTestServer(t) {
  const engine = new RouletteEngine({ roundMs: ROUND_MS, bettingMs: BETTING_MS });
  const history = [];
  engine.on('draw', (r) => history.push({
    roundId: r.roundId, number: r.number, seed: r.seed, hash: r.hash, settledAt: Date.now(),
  }));

  // Raised above the 10 sockets the fan-out test opens, otherwise the per-IP
  // ceiling would (correctly) reject some of them.
  const config = {
    publicDir: new URL('../public', import.meta.url).pathname,
    historyLimit: 20, heartbeatMs: 5_000, maxPayloadBytes: 1024,
    maxConnsPerIp: 25, maxConnections: 100, token: '', allowedOrigins: [],
    startingBalance: 1000, maxStake: 100,
  };
  const ledger = new BetLedger({ startingBalance: config.startingBalance, maxStake: config.maxStake });
  const server = createServer(createRequestHandler(engine, config, history));
  attachWebSocket(server, engine, config, ledger);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  engine.start();

  t.after(() => { engine.stop(); server.close(); });
  return { server, engine, history, ledger, port: server.address().port };
}

/**
 * A tiny message queue per socket.
 *
 * `hello` is pushed by the server the instant a connection is established, so a
 * naive "await open, then attach a listener" races and loses it. This buffers
 * from the first frame and hands out messages in order, so tests never depend on
 * timing. Note the single dispatcher: `ws.on('message')` hands over the raw
 * Buffer, so parsing has to happen exactly once, here.
 */
const open = (port) => new Promise((resolve, reject) => {
  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  const queue = [];
  const waiting = [];

  // Hand a message to the oldest waiter whose predicate accepts it. Messages
  // that nobody wants yet stay queued. Respecting the predicate on *both*
  // paths matters: delivering unconditionally would hand a `close` frame to a
  // test waiting for `draw`.
  const dispatch = () => {
    for (let i = 0; i < waiting.length; i++) {
      const idx = queue.findIndex(waiting[i].predicate);
      if (idx === -1) continue;
      const [msg] = queue.splice(idx, 1);
      const [waiter] = waiting.splice(i, 1);
      waiter.resolve(msg);
      return true;
    }
    return false;
  };

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    queue.push(msg);
    dispatch();
  });

  ws.next = (predicate = () => true) => new Promise((res, rej) => {
    const onResolve = (msg) => { clearTimeout(timer); res(msg); };
    const timer = setTimeout(() => {
      const i = waiting.findIndex((w) => w.resolve === onResolve);
      if (i !== -1) waiting.splice(i, 1);
      rej(new Error('timed out waiting for message'));
    }, 5_000);

    const idx = queue.findIndex(predicate);
    if (idx !== -1) { clearTimeout(timer); return res(queue.splice(idx, 1)[0]); }
    waiting.push({ predicate, resolve: onResolve });
  });

  // Resolve on open; record a close if the server refuses the connection
  // (e.g. the per-IP ceiling) instead of rejecting, so tests can assert on the
  // refusal rather than seeing an unhandled rejection.
  ws.once('open', () => resolve(ws));
  ws.on('error', () => {});
  ws.once('close', (code) => { ws.__closeCode = code; });
});

test('client receives hello then a draw within one round', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);

  const hello = await ws.next((m) => m.t === 'hello');
  assert.equal(hello.ph, 'betting');
  assert.ok(hello.hb > 0, 'heartbeat interval must be advertised');
  assert.equal(hello.h?.length, 64, 'commitment hash must be published up front');
  assert.equal(hello.n, undefined, 'an unrevealed round must not leak a number');

  const draw = await ws.next((m) => m.t === 'draw');
  assert.ok(Number.isInteger(draw.n) && draw.n >= 0 && draw.n <= 36);
  // The draw may be for the round that was already in flight when we connected,
  // so it can share a round id with `hello` -- but it must never be older.
  assert.ok(draw.r >= hello.r, 'a client must never receive a stale round');
  ws.close();
});

test('the round id strictly advances across successive draws', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  const a = await ws.next((m) => m.t === 'draw');
  const b = await ws.next((m) => m.t === 'draw');
  assert.equal(b.r, a.r + 1, 'each draw must be exactly one round later');
  ws.close();
});

test('a late joiner can resume mid-round from the hello snapshot', async (t) => {
  const { port } = await startTestServer(t);
  const first = await open(port);
  await first.next((m) => m.t === 'draw'); // let a round settle

  // A brand-new socket must be immediately usable, with no waiting.
  const late = await open(port);
  const hello = await late.next((m) => m.t === 'hello');
  assert.ok(Number.isInteger(hello.r));
  assert.ok(hello.ms >= 0 && hello.ms <= ROUND_MS, 'msLeft must be within the round');
  assert.ok(hello.d > Date.now() - 1_000, 'deadline must be a sane wall-clock time');
  first.close();
  late.close();
});

test('broadcast draws are independently verifiable from the revealed seed', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  const draw = await ws.next((m) => m.t === 'draw');

  // The whole point of commit-reveal: the client can check us.
  assert.ok(draw.sv, 'seed must be revealed after settling');
  assert.equal(numberFrom(draw.sv, draw.r), draw.n, 'number must be re-derivable from the seed');
  ws.close();
});
test('history endpoint serves newest-first and survives reconnect', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  await ws.next((m) => m.t === 'draw');
  await ws.next((m) => m.t === 'draw');
  ws.close();

  const res = await fetch(`http://127.0.0.1:${port}/api/history?limit=5`);
  const { rounds } = await res.json();
  assert.ok(rounds.length >= 2, 'history should contain the settled rounds');
  assert.ok(rounds[0].roundId > rounds[1].roundId, 'history must be newest-first');
  for (const r of rounds) assert.ok(r.seed, 'audit material must be retained');
});

test('verify endpoint agrees with the derivation', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  const draw = await ws.next((m) => m.t === 'draw');
  ws.close();

  const res = await fetch(`http://127.0.0.1:${port}/api/verify/${draw.r}`);
  const body = await res.json();
  assert.equal(body.fair, true);
  assert.equal(body.derived, draw.n);

  const missing = await fetch(`http://127.0.0.1:${port}/api/verify/999999`);
  assert.equal(missing.status, 404);
});

test('static client and health endpoint are served', async (t) => {
  const { port } = await startTestServer(t);
  const page = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.match(await page.text(), /Roulette Feed/);

  const health = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal((await health.json()).ok, true);
});

test('path traversal is blocked', async (t) => {
  const { port } = await startTestServer(t);
  const res = await fetch(`http://127.0.0.1:${port}/..%2f..%2fpackage.json`, { redirect: 'manual' });
  assert.ok(res.status === 403 || res.status === 404, `expected a block, got ${res.status}`);
  assert.ok(!(await res.text()).includes('"dependencies"'), 'must not leak files outside public/');
});

test('malformed client frames are ignored, not fatal', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  await ws.next((m) => m.t === 'hello');

  ws.send('not json at all');
  ws.send(JSON.stringify(['array']));
  ws.send(JSON.stringify({ t: 'ping' }));

  // The connection must survive abuse and still deliver the next draw.
  const pong = await ws.next((m) => m.t === 'pong');
  assert.equal(pong.t, 'pong');
  const draw = await ws.next((m) => m.t === 'draw');
  assert.ok(Number.isInteger(draw.n));
  ws.close();
});

test('all clients get byte-identical draw frames', async (t) => {
  const { port } = await startTestServer(t);
  const sockets = await Promise.all(Array.from({ length: 5 }, () => open(port)));

  // Collect the raw text of every draw each client receives, then compare. Raw
  // frames, not parsed objects: the claim under test is that the server pushes
  // one identical payload to everyone, which a parsed comparison would blur.
  const rawDraws = sockets.map((ws) => {
    const seen = [];
    ws.__raw = [];
    ws.on('message', (buf) => {
      const text = buf.toString();
      if (text.includes('"t":"draw"')) seen.push(text);
    });
    return seen;
  });

  await Promise.all(sockets.map((ws) => ws.next((m) => m.t === 'draw')));
  await new Promise((r) => setTimeout(r, 250));

  for (const seen of rawDraws) {
    assert.equal(seen.length, 1, 'each client should receive exactly one draw frame');
    assert.equal(seen[0], rawDraws[0][0], 'every client must receive the identical draw frame');
  }
  for (const ws of sockets) ws.close();
});

test('a bet is settled privately and never broadcast', async (t) => {
  const { port } = await startTestServer(t);
  const bettor = await open(port);
  const bystander = await open(port);
  await Promise.all([bettor.next((m) => m.t === 'hello'), bystander.next((m) => m.t === 'hello')]);

  // Bet every number so settlement is guaranteed to return something.
  const round = await bettor.next((m) => m.t === 'close' && m.ph === 'betting');
  for (let n = 0; n <= 36; n++) {
    bettor.send(JSON.stringify({ t: 'bet', r: round.r, k: 'straight', v: n, s: 1 }));
  }

  const settle = await bettor.next((m) => m.t === 'settle');
  assert.equal(typeof settle.net, 'number', 'the bettor must receive a private settlement');
  assert.equal(settle.rt, 36, '37 straights @1 => the winner returns 36');

  // The bystander bet nothing, so it must never be told about money.
  const leaked = await Promise.race([
    bystander.next((m) => m.t === 'settle' || m.b !== undefined).then(() => true),
    new Promise((r) => setTimeout(() => r(false), 400)),
  ]);
  assert.equal(leaked, false, 'a player who did not bet must not receive a settlement');

  bettor.close();
  bystander.close();
});

test('bets are refused once the betting window closes', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  const closed = await ws.next((m) => m.t === 'close' && m.ph !== 'betting');

  ws.send(JSON.stringify({ t: 'bet', r: closed.r, k: 'straight', v: 1, s: 5 }));
  const rejected = await ws.next((m) => m.t === 'bet');
  assert.equal(rejected.ok, 0);
  assert.equal(rejected.why, 'betting_closed');
  assert.equal(rejected.b, 1000, 'a refused bet must not touch the bankroll');
  ws.close();
});

test('a bet aimed at a stale round is refused', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  await ws.next((m) => m.t === 'hello');

  // Round 999 never existed; the client must not be able to bet into it.
  ws.send(JSON.stringify({ t: 'bet', r: 999, k: 'straight', v: 1, s: 5 }));
  const rejected = await ws.next((m) => m.t === 'bet');
  assert.equal(rejected.ok, 0);
  assert.equal(rejected.why, 'betting_closed');
  ws.close();
});

test('a player who disconnects mid-betting is refunded', async (t) => {
  const { port, ledger } = await startTestServer(t);
  const ws = await open(port);
  const round = await ws.next((m) => m.t === 'close' && m.ph === 'betting');

  ws.send(JSON.stringify({ t: 'bet', r: round.r, k: 'straight', v: 5, s: 100 }));
  const accepted = await ws.next((m) => m.t === 'bet');
  assert.equal(accepted.ok, 1);
  assert.equal(accepted.b, 900);

  // The socket drops before the round settles. That player can never see the
  // result, so their stake must come back rather than silently vanishing.
  ws.terminate();
  await new Promise((r) => setTimeout(r, 250));

  assert.deepEqual(ledger.pendingRounds(), [], 'no round should still hold this player\'s stake');
});

test('players cannot overdraw their bankroll', async (t) => {
  const { port } = await startTestServer(t);
  const ws = await open(port);
  const round = await ws.next((m) => m.t === 'close' && m.ph === 'betting');

  for (let i = 0; i < 20; i++) {
    ws.send(JSON.stringify({ t: 'bet', r: round.r, k: 'straight', v: i % 37, s: 100 }));
  }
  // Drain until the ledger refuses something.
  const refused = await ws.next((m) => m.t === 'bet' && m.ok === 0);
  assert.ok(refused.why, 'expected a rejection reason');
  assert.ok(['insufficient_funds', 'above_maximum'].includes(refused.why));
  assert.ok(refused.b >= 0, 'the balance must never go negative');
  ws.close();
});
test('per-IP connection ceiling is enforced', async (t) => {
  const { port } = await startTestServer(t);
  // The server allows 25 per IP; the 26th must be refused rather than silently
  // accepted, which is what stops one client from exhausting server memory.
  const sockets = [];
  for (let i = 0; i < 26; i++) sockets.push(await open(port));

  const outcomes = await Promise.all(sockets.map((ws) => new Promise((resolve) => {
    if (ws.readyState === WebSocket.CLOSED) return resolve(ws.__closeCode);
    ws.once('close', (code) => resolve(code));
    setTimeout(() => resolve(null), 1_000);
  })));

  assert.ok(
    outcomes.includes(1013),
    `expected a 1013 "try again later" close, got ${JSON.stringify(outcomes)}`
  );
  for (const ws of sockets) ws.close();
});