# rou — roulette draw server

Broadcasts one roulette number every 30 seconds over WebSocket, with a
provably-fair commit–reveal scheme and a deliberately tiny wire format.

```bash
npm install
npm test           # 66 tests, no network required
npm run demo       # open 3 headless clients and watch the broadcast
```

## Usage

The backend serves the web client, so **one command runs both** — there is no
separate frontend build or dev server.

### Start the backend

```bash
cd rou
npm install        # first run only — installs `ws`
npm start
```

Expected output:

```
[rou …] listening on http://localhost:8080
[rou …]   demo client →  http://localhost:8080
[rou …]   websocket    →  ws://localhost:8080/ws  (round=30s, betting=24s)
[rou …] WARNING: WS_TOKEN unset — no client authentication (dev only)
[rou …] WARNING: ALLOWED_ORIGINS unset — any origin may connect (dev only)
```

Those two `WARNING`s are expected locally. **Set `WS_TOKEN` and
`ALLOWED_ORIGINS` before exposing this to anyone else.**

### Open the frontend

Paste this into your browser:

```
http://localhost:8080
```

That is the whole frontend. You should see a live number, the phase
(`betting` → `closed` → `settling`), a countdown bar, recent results, and a
green **✓ round N independently verified** line each time a draw settles.

> Use `http://localhost:8080`, **not** `file://`. Opening `public/index.html`
> directly will not work — the page needs the server for both the WebSocket and
> `/api/history`, and browsers block those from `file://` origins.

### Connect a client directly

Point any WebSocket client at `ws://localhost:8080/ws` and you will receive a
`hello` snapshot immediately, then one message per event. To watch a draw
without writing any code:

```bash
npx wscat -c ws://localhost:8080/ws
```

`npx` downloads `wscat` on first run, which can take a few seconds and may
appear to hang. If you want it always available, `npm i -g wscat` and then just
run `wscat -c ws://localhost:8080/ws`.

You should see the live feed:

```
{"t":"hello","r":5,"ph":"betting","d":…,"ms":4044,"h":"254d00…","hb":20000}
{"t":"close","r":5,"ph":"closed","d":…,"ms":0}
{"t":"draw","r":5,"n":32,"d":…,"ms":0,"h":"254d00…","sv":"22d41e…"}
```

Useful checks:

```bash
curl http://localhost:8080/healthz                  # {"ok":true,…}
curl 'http://localhost:8080/api/history?limit=5'     # last 5 draws
curl http://localhost:8080/api/verify/1              # {"fair":true,…}
```

`/api/history` and `/api/verify` only know about rounds that have already
settled, so they are empty for the first 30 seconds on a fresh start — wait for
one draw, or start with `ROUND_MS=5000` to see them populate quickly.

### Run multiple clients

The server is a broadcast hub: it draws **one** number per round and pushes the
**same frame** to every connected client. There is no polling and no per-client
work — 10,000 idle clients cost the same as 10.

**Option A — multiple browser tabs (easiest).** Open
`http://localhost:8080` in two or more tabs, or in a normal window plus a
private/incognito window. Each tab is an independent client with its own
1000-credit bankroll, and all of them will show the same number at the same
instant. Tabs also have independent betting state, which is what makes this the
quickest way to see that settlement is per-player and the draw is not.

**Option B — headless clients (shows the wire traffic).** A script opens N
sockets, each places a bet, and prints what arrives:

```bash
node demo/clients.mjs 4                    # 4 clients against localhost:8080
node demo/clients.mjs 10 ws://host:8080/ws # 10 clients against another host
```

Output looks like this — note that every `DRAW` line is identical across
clients, while each `settled` line differs:

```
client 01 hello  round=1 phase=betting balance=1000
client 02 hello  round=1 phase=betting balance=1000
client 03 hello  round=1 phase=betting balance=1000
client 04 hello  round=1 phase=betting balance=1000
  client 01 bet accepted balance=999
  client 02 bet accepted balance=995
  client 03 bet accepted balance=975
  client 04 bet accepted balance=900
DRAW #1 round=1 number=2 hash=07c529cb9750…     <- identical for every client
  client 02 settled n=2 staked=5 returned=180 net=+175 balance=1175
  client 03 settled n=2 staked=25 returned=0 net=-25 balance=975
new round 2 open for betting
```

**Option C — several servers on one machine** (e.g. testing the client against
two backends). Use different ports; each server runs its own independent round
loop and will *not* agree with the other:

```bash
PORT=8081 ROUND_MS=5000 npm start    # terminal 1
PORT=8082 ROUND_MS=5000 npm start    # terminal 2
```

Then point a client at each with `node demo/clients.mjs 2 ws://localhost:8081/ws`.

> Two servers = two separate games with separate seeds. If you want several
> clients to share **one** game, they must all connect to the **same** server
> instance. To scale past one machine you would move the engine behind a shared
> store or a pub/sub service (see the recommendation below).

### How the broadcast works

```
                        ┌──────────────────────────────┐
   client 1 ─┐          │  RouletteEngine              │
   client 2 ─┤  sockets │   emits 'draw' once per round │
   client 3 ─┤ ───────► │                              │
   client N ─┘          │  transport/websocket.js      │
                        │   broadcast() → every socket  │
                        └──────────────────────────────┘
```

- The engine emits a single `draw` event per round, no matter how many clients
  are attached.
- `broadcast()` serialises the frame **once** and pushes that same string to
  every open socket — one encode, N sends, no per-client payload.
- A client that connects mid-round gets a `hello` snapshot immediately, so it
  never has to wait for the next draw to render.
- The broadcast contains **only** the public result. Balances and settlements are
  sent privately to the sockets that actually bet, so one player's winnings can
  never appear in another's feed.

This is asserted rather than merely described — `test/integration.test.js`
connects five clients and requires the raw draw frames to be
byte-for-byte identical, and requires a non-betting client to receive no
settlement at all.

### Betting

During the betting window the demo client shows a full roulette table: pick a
chip value (1 / 5 / 25 / 100), then tap a number or an outside bet (dozens,
columns, red/black, odd/even, low/high). Bets lock when the window closes, and
the server rejects anything that arrives late — the betting clock is checked on
the server, never trusted from the client.

Credits are play money; there is no real currency anywhere in this system.
Balances are per-connection and in memory, so **a page reload starts you again
at 1000**. A real deployment would key balances to an authenticated session and
persist them.

### Faster rounds while developing

A 30-second wait makes testing tedious. Shorten it with an env var:

```bash
ROUND_MS=5000 BETTING_MS=3000 npm start
```

The page self-calibrates to the real cadence, so the progress bar stays
correct. Other common overrides:

```bash
PORT=8081 npm start                                  # if 8080 is taken
HOST=127.0.0.1 npm start                             # local interfaces only
ROUND_MS=60000 BETTING_MS=45000 npm start            # one draw a minute
```

### Auto-restart on edit

```bash
npm run dev        # node --watch — restarts the server when a file changes
```

The browser still needs a manual reload; the client reconnects on its own, but
there is no live-reload injection.

### Stop it

`Ctrl-C` in the terminal. A graceful shutdown drains the sockets and stops the
engine mid-round, so clients resume cleanly from `hello` on reconnect.

### If the port is already in use

```
[rou …] ERROR: port 8080 is already in use.
[rou …]        Another copy is probably still running — stop it with:
[rou …]          lsof -ti:8080 | xargs kill -9
[rou …]        …or start this one on another port:  PORT=8081 npm start
```

## The feed

`ws://localhost:8080/ws`. On connect the server sends a `hello` snapshot, then
one small message per event. A typical 30s cycle:

```
{"t":"hello","r":1,"ph":"betting","d":...,"ms":17157,"h":"c2ee05…","hb":20000}   145 B
{"t":"close","r":1,"ph":"closed","d":...,"ms":3891}                             61 B
{"t":"close","r":1,"ph":"settling","d":...,"ms":1875}                           63 B
{"t":"draw","r":1,"n":26,"d":...,"ms":0,"h":"c2ee05…","sv":"9a2db2…"}           193 B
```

**~460 bytes per 30-second round.** At 10,000 clients that is ~9 kB/s egress
total — one draw message, not 10,000 hand-rolled per-socket timers.

### Why the payload looks the way it does

The socket carries **facts, never presentation**. Colour, odd/even, halves,
dozens, columns and neighbours are all pure functions of the number, so the
client computes them locally. That keeps frames small and makes the payload
*identical* for web, Android and iOS clients — no per-platform negotiation, no
version skew.

REST is the durable path the socket complements:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/history?limit=20` | recent draws, newest first — cold start, reconnect, disputes |
| `GET /api/verify/:roundId` | re-derive a number server-side; returns `{fair: bool}` |
| `GET /healthz` | liveness + current round |

A socket alone cannot answer "what were the last 20 results?" after a cold
start, and a poll-only client cannot animate. Both paths read the same engine,
so the two views can never disagree.

## Provable fairness

Per round the server:

1. generates a 32-byte seed and publishes `hash = SHA-256(seed)` **before** betting closes;
2. derives the number as `HMAC-SHA256(seed, "r<roundId>:a0")`, consuming 32-bit big-endian words with **rejection sampling** at the largest multiple of 37 below 2³² (plain `digest % 37` would bias the low pockets);
3. reveals the seed on settle, so any client can recompute and check.

The demo client does exactly that in the browser via WebCrypto and prints
`✓ round N independently verified`. `test/client-parity.test.js` guards the
client/server agreement — it already caught two real encoding bugs where the
server hashed the seed's *hex text* while the browser hashed the *raw bytes*.

**Known limitation (deliberate):** the seed is not committed to in advance across
rounds, so a malicious operator could in principle cancel a round and re-draw
with a new seed. Closing that needs a published seed-chain or a third-party
commitment service. For a self-hosted feed with no real-money stakes this is
sufficient; for a regulated product it is not.

## Architecture — built to be replaced

```
server/
  roulette.js        engine: round timing + provable fairness. No HTTP, no sockets.
  betting.js         paytable & bet validation. Pure functions, no state.
  ledger.js          balances, outstanding bets, settlement
  protocol.js        the wire contract, in one file
  transport/
    websocket.js     the only file that imports `ws`
  http-api.js        REST + static files (node:http, no framework)
  index.js           composition root
demo/
  clients.mjs        opens N headless clients to watch the broadcast
```

### What each file is for

Every file is part of the product; nothing here is scaffolding left over from
development. To be precise about which is which:

**Runs the app — required** (13 files, ~1,700 lines). Deleting any one of these
breaks the server or the page:

| File | Role |
| --- | --- |
| `server/index.js` | entry point; wires everything together |
| `server/roulette.js` | round timing, provable fairness |
| `server/betting.js` | paytable, bet validation |
| `server/ledger.js` | balances and settlement |
| `server/protocol.js` | the wire message contract |
| `server/transport/websocket.js` | sockets, heartbeat, broadcast, bet gate |
| `server/http-api.js` | REST endpoints + static file serving |
| `server/config.js` | environment configuration |
| `public/index.html` | the demo page markup and table styling |
| `public/app.js` | the demo page logic |
| `package.json`, `package-lock.json`, `.gitignore` | dependency lock and ignores |

**Verifies the app — not needed at runtime** (7 files, ~1,100 lines). These are
the automated checks, not dead code: they are what caught the three encoding and
fan-out bugs during development, and they run in about five seconds.

| File | Verifies |
| --- | --- |
| `test/roulette.test.js` | fairness, uniformity, round scheduling |
| `test/betting.test.js` | paytable, coverage, 2.70% house edge |
| `test/ledger.test.js` | debiting, settlement, refunds, isolation |
| `test/protocol.test.js` | message size, seed withholding, malformed input |
| `test/integration.test.js` | real sockets: broadcast, betting window, limits |
| `test/client-parity.test.js` | browser and server agree on the number |
| `demo/clients.mjs` | manual multi-client demo (also a handy load generator) |

The server runs correctly with `test/` and `demo/` deleted — you can verify that
by copying the folder, removing those two directories and running `npm start`.
They are kept in the repository because deleting the tests to save a few hundred
kilobytes is a bad trade: they are the fastest way to confirm a change did not
reintroduce a payout or fairness bug.

**Documentation** — `README.md`.

The engine emits events (`round`, `phase`, `draw`) and knows nothing about
transports. **Changing push technology means adding one `transport/*.js` and one
line in `index.js` — no game logic changes, no client changes.**

Betting is split the same way: `betting.js` holds the paytable as pure
functions (so the house edge can be unit-tested without a server), `ledger.js`
owns money, and only `transport/websocket.js` decides *when* a bet is legal —
against the server's clock, never the client's.
## Recommendation for Android / iOS

**Do not change the protocol. WebSocket (RFC 6455) is already fully native on
both platforms** — `OkHttp` on Android, `URLSessionWebSocketTask` on iOS — with
no third-party dependency, and it is the only option that survives every
corporate proxy. The maturity gap is not the wire format; it is **operations at
scale**. WebSocket tells you nothing about reconnection, presence or multi-region
fan-out, and you would otherwise rebuild all three.

| Option | Verdict |
| --- | --- |
| **Raw WebSocket (now)** | Correct default. Smallest payload, zero deps, native everywhere. Fine to ~50k connections on one box. |
| **Socket.IO** | Good if you want managed reconnect + rooms *and* accept its custom framing (undermines the minimal-payload goal, adds a browser-side lib). |
| **Managed realtime (Ably, Pusher)** | **Recommended at real scale.** Global edge fan-out, presence, automatic reconnect, mature Android/iOS SDKs. Keep the engine; replace the transport. |
| **MQTT (EMQX/HiveMQ)** | Best if draws are pushed to *devices* (kiosks, tablets) or fan-in from many edge sources. |
| **SSE / gRPC** | Wrong shape here: one-way HTTP streaming is throttled by some carriers, and gRPC needs HTTP/2 that corporate proxies block. |

**My recommendation: ship on raw WebSocket now and plan the seam for a managed
pub/sub layer (Ably or Pusher).** This repo already *is* that seam —
`transport/websocket.js` is the only file coupled to `ws`. Swapping in Ably later
is a contained change and the engine, protocol and clients stay untouched.

Whatever you pick, these apply to all of them and are already implemented here:

- **REST recovery on every cold start** — an app backgrounded for 10 minutes
  misses draws; history is how it catches up.
- **Exponential backoff with jitter** — without jitter, every client dropped by a
  deploy retries in lockstep and re-synchronises the server against itself.
- **Heartbeats + per-connection state** — carriers silently drop idle sockets; the
  server pings every 20s and terminates dead ones.
- **Client-verify, don't client-trust** — the fairness check runs on-device, so a
  tampered client is detectable rather than authoritative.

## Configuration

| Env | Default | Notes |
| --- | --- | --- |
| `PORT` / `HOST` | `8080` / `0.0.0.0` | |
| `ROUND_MS` | `30000` | broadcast cadence |
| `BETTING_MS` | `24000` | betting window; tail is close + settle |
| `HEARTBEAT_MS` | `20000` | ping interval |
| `MAX_CONNS_PER_IP` | `8` | over the limit → close `1013` |
| `MAX_CONNECTIONS` | `10000` | global ceiling |
| `MAX_PAYLOAD_BYTES` | `4096` | inbound frame cap |
| `HISTORY_LIMIT` | `120` | rounds retained for audit |
| `STARTING_BALANCE` | `1000` | play-money bankroll per client |
| `MAX_STAKE` | `100` | per-bet ceiling |
| `WS_TOKEN` | *(unset)* | **set in production**; unset = no auth |
| `ALLOWED_ORIGINS` | *(unset)* | comma-separated; unset = any origin |

The server warns on startup when `WS_TOKEN` or `ALLOWED_ORIGINS` are unset and
`NODE_ENV !== 'production'`.

## Tests

66 tests, no network access, ~5s.

```bash
npm test
```

- `roulette.test.js` — determinism, uniformity, phase scheduling, stall recovery
- `betting.test.js` — coverage of every bet type, the paytable, and a check that
  the house edge is exactly 2.70% everywhere
- `ledger.test.js` — debiting, settlement, double-settlement, refunds, isolation
- `protocol.test.js` — frame size, seed-withholding, malformed input, no presentation data on the wire
- `integration.test.js` — real HTTP + real WebSocket clients: connect, resume, broadcast, betting window, private settlement, auth limits, traversal
- `client-parity.test.js` — browser and server derive identical numbers