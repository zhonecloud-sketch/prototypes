# Interaction performance review — 22 October 2026

## Reproduce the checks

From `C:\automation\prototypes\rou`, run:

```powershell
node --test --test-force-exit test/*.test.js
node --test sites-server/test/rust-performance.test.mjs
node tools/preview-integration.mjs --insights-fixture
```

Open the local preview at:

```text
http://127.0.0.1:8768/rou/index.html?phone&profile
```

Choose **Enter as Guest**, then **Measure next 5 seconds**. Repeat from the
launch menu after returning there with the cog button. The measurement button
is injected by the local preview; it is absent from the published game. [1]

For Rust validation, use the project's configured Rust toolchain, then run
`cargo test --manifest-path rust/Cargo.toml` and `npm run test:rust` from
`sites-server`. The build requires the existing wasm-bindgen tool. [4]

## Expected output and measured results

The browser measurements below are five-second samples in the local in-app
browser at its 1280-pixel viewport, with the phone layout enabled. These are
workload measurements, not end-to-end input latency, phone hardware benchmarks
or hosted capacity measurements. Timing varies with hardware and spin phase.
`renderMs` measures JavaScript time inside wheel updates, including submitting
rendering work; it does not measure total GPU execution time. [1]

| Work in five seconds | Before | After |
| --- | ---: | ---: |
| Guest table wheel renders | 844 | 120 |
| Time inside wheel updates | 3,250 ms | 256 ms |
| Interface timer updates | 97 | 40 |
| Observed interface DOM mutations | 2,725 | 155 |
| Launch menu wheel renders | 1,054 | 0 |

The tested table preview's drawing buffer fell from 556,768 to 121,344 pixels.
The full wheel retains its original resolution when visible. Both browser
samples reported zero tasks exceeding the browser's long-task threshold;
the issue was sustained unnecessary work, rather than one long task. [1, 2]

The actual Rust/Wasm service with the in-memory SQLite fixture produced:

| Request | Before statements | After statements |
| --- | ---: | ---: |
| Ordinary room refresh | 17 | 9 |
| Add a wager | 20 | 11 |
| First room join, including housekeeping and creating a draw | 25 | 20 |

The first request in a visitor's new minute bucket performs four additional
cleanup statements. Creating a draw and settling accepted wagers also require
additional work. These counts exclude HTTP preflight requests. SQLite fixture
timings do not predict the hosted database's network latency. [3, 4]

## Changes and reasons

- Render the visible full wheel at up to 60 frames per second and its small
  table preview at 24. Stop rendering behind the launch page, account pages,
  statistics, dialogs and hidden tabs. Presentation resumes from the game
  clock, preserving the selected outcome and settlement timing. [2]
- Use a drawing buffer with a maximum dimension of 512 pixels for the small
  preview. Restore full resolution when the wheel comes into view. Cache the
  preview's dimensions through the resize observer, rather than measuring
  layout during every frame. [2]
- Run one periodic interface update loop. Change labels and button states only
  when their values change. Rebuild room seats, history and bet markers only
  when their data changes. Build the statistics chart when it is displayed.
  These changes reduce repeated layout, painting and DOM allocation. [2]
- Give wagers priority over background room refreshes. A refresh no longer
  disables betting. Cancel its response before submitting a wager, and prevent
  a cancelled response from publishing an older player balance. Wagers remain
  confirmed by the server; overlapping wallet mutations remain blocked. [2]
- Avoid rebuilding an unchanged account page after its session refresh. Reuse
  completed Insights analysis when its records, player, reset epoch and filters
  match. Refresh server records and pass entitlement; new records or changed
  filters still trigger analysis in the worker. [2]
- Reuse authenticated player and seat data in Rust room processing. Fetch one
  final player snapshot for the response and its wager details. Prune expired
  authentication records once per visitor's minute bucket. Authentication still
  checks expiry on every access, and rate limits remain enforced. [3, 4]

## Verification and implications

The regression checks cover rendering budgets on a simulated 240 Hz callback
stream, zero rendering under covered pages, betting during a pending refresh,
discarding cancelled responses, and reusing analysis while invalidating it on
filter or reset changes. Rust checks cover the nine-statement refresh budget,
session expiry, and retrying a wager without charging twice. [2, 4]

Existing checks also passed for registration and recovery, concurrent wallet
mutations, six-seat room allocation, room isolation, full-room settlement,
personal analysis, purchases, reset behavior and Rust migration compatibility.
Browser checks exercised guest placement, undo, double and clear at 896 by 414,
account login, multiplayer admission, and personal Insights containing 400
disposable fixture records. [1–4]

Refresh the published game once to load the versioned client modules. Network
round trips still apply to multiplayer confirmations. If delays remain on a
particular device, repeat the local measurement and record the affected view
and browser; the figures above are a baseline for comparison, not a promise
that every device has identical response time.

Sources:

1. `tools/performance-probe.js`, `tools/preview-integration.mjs`, and the local
   browser observations recorded during this review. The Insights fixture is
   synthetic and local only.
2. `index.html`, `client/game-account.js`, `client/multiplayer.js`,
   `client/account-api.js`, `client/account.js`, `client/server-insights.js`,
   and `test/performance.test.js`.
3. `sites-server/rust/src/room.rs` and `rust/src/service.rs`.
4. `sites-server/test/rust-fixture.mjs`, `test/rust-performance.test.mjs`,
   existing Rust parity/integration tests and their test output.
