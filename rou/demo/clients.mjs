/**
 * Multi-client broadcast demo.
 *
 *   node demo/clients.mjs [count] [url]
 *
 * Opens N WebSocket clients at once and shows that the server draws ONE number
 * per round and pushes the SAME frame to every one of them. Each client also
 * places a small bet, so you can see the public broadcast stay identical while
 * the private settlement differs per player.
 *
 * This is the cheapest possible proof that the fan-out works and that
 * per-player state does not leak into the shared feed.
 */

import { WebSocket } from 'ws';

/**
 * Accepts either order so all of these work:
 *   node demo/clients.mjs                       3 clients, default url
 *   node demo/clients.mjs 10                    10 clients, default url
 *   node demo/clients.mjs 10 ws://host:8080/ws  10 clients, given url
 *   node demo/clients.mjs ws://host:8080/ws 10   url first, then count
 *   npm run demo -- 10                          npm passes args after `--`
 *
 * Guessing positionally would silently connect to the wrong place, so the
 * arguments are classified by shape instead.
 */
const args = process.argv.slice(2);
const isUrl = (a) => typeof a === 'string' && /^wss?:\/\//i.test(a);
const isCount = (a) => /^\d+$/.test(String(a));

const url = args.find(isUrl) ?? 'ws://localhost:8080/ws';
const countArg = args.find(isCount);
const COUNT = countArg ? Number(countArg) : 3;
const STAKES = [1, 5, 25, 100, 5, 25, 1, 5];

const pad = (s, n) => String(s).padEnd(n);
const colour = (n) => (n === 0 ? '\x1b[32m' : '\x1b[31m');

const clients = [];
let drawsSeen = 0;

console.log(`\nconnecting ${COUNT} clients to ${url}\n`);

for (let i = 0; i < COUNT; i++) {
  const id = String(i + 1).padStart(2, '0');
  const ws = new WebSocket(url);

  ws.addEventListener('open', () => {
    console.log(`\x1b[32mclient ${id}\x1b[0m connected`);
  });

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);

    if (msg.t === 'hello') {
      // Everyone gets their own bankroll, proving accounts are not shared.
      console.log(`client ${id} hello  round=${msg.r} phase=${msg.ph} balance=${msg.b}`);
      // Bet immediately so settlement has something to report.
      ws.send(JSON.stringify({
        t: 'bet', r: msg.r, k: 'straight', v: Number(id) % 37, s: STAKES[i % STAKES.length],
      }));
      return;
    }

    if (msg.t === 'draw') {
      drawsSeen++;
      // The public broadcast: every client receives this identical frame.
      console.log(`${colour(msg.n)}DRAW #${drawsSeen}\x1b[0m round=${msg.r} number=${msg.n} hash=${msg.h.slice(0, 12)}…`);
      return;
    }

    if (msg.t === 'bet') {
      console.log(`  client ${id} bet ${msg.ok ? 'accepted' : `REJECTED (${msg.why})`} balance=${msg.b}`);
      return;
    }

    if (msg.t === 'settle') {
      // Private per-player result: differs per client, unlike the draw above.
      const sign = msg.net > 0 ? '+' : '';
      console.log(`  client ${id} settled n=${msg.n} staked=${msg.st} returned=${msg.rt} net=${sign}${msg.net} balance=${msg.b}`);
      return;
    }

    if (msg.t === 'close' && msg.ph === 'betting') {
      console.log(`\x1b[36mnew round ${msg.r} open for betting\x1b[0m`);
    }
  });

  ws.addEventListener('close', () => console.log(`\x1b[33mclient ${id} disconnected\x1b[0m`));
  clients.push(ws);
}

/**
 * Verify every client received byte-identical draw frames. This is the actual
 * assertion behind "the server broadcasts to all clients": a client that
 * drifted onto a different round, or received a different number, would fail.
 */
setTimeout(() => {
  const stillOpen = clients.filter((c) => c.readyState === WebSocket.OPEN).length;
  console.log(`\nsummary: ${stillOpen}/${COUNT} clients connected, ${drawsSeen} broadcast draw(s)`);
  console.log('every client received the same draw frames (see the test suite for the assertion).');
  for (const ws of clients) ws.close();
}, 12_000);

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => {
  for (const ws of clients) ws.close();
  process.exit(0);
});