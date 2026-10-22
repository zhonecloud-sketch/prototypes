# Rust backend migration

Updated: 22 October 2026 | Asia/Kuala_Lumpur

## Use the migrated release

Open the [game][game] or [developer controls][admin] using HTTPS. The
frontend and account controls use the same URLs and credentials. Existing
sessions continue to work. No account recreation or database import is
required. Developer controls still require the game account and original
private operator key. [E1, E2]

Expected: accounts, multiplayer, purchases and developer requests are
processed by Rust on the existing Sites backend. The session response
contains `backend: "rust"`; API responses include
`X-Atelier-Backend: rust`. GitHub continues hosting the frontend. [E1]

## What moved to Rust

| Area | Rust implementation |
| --- | --- |
| Accounts | Registration, codes, login, sessions, recovery and deletion. |
| Security | Validation, origins, limits and operator authorization. |
| Wallet | Optimistic updates, orders, retry protection and wealth. |
| Collection | Repeat acquisitions, ownership and showcase selection. |
| Multiplayer | Six seats, shared clock, draw selection and settlement. |
| Developer | User maintenance, Start/Stop, RNG import and playback. |

The Rust source is in `rou/sites-server/rust/`, in the backend's separate
Sites source repository. Its modules are `src/model.rs`, `service.rs`,
`room.rs` and `admin.rs`. [E1]

Sites runs the compiled Rust WebAssembly module. A small JavaScript bridge
provides HTTP serialization, D1 access, secure random bytes, asynchronous
scrypt and email transport. Rust owns application validation, SQL, routing,
authorization and business rules. The existing Vinext/Sites hosting
integration is preserved. [E1, E3]

The existing scrypt format and parameters remain compatible:
`scrypt-v1:<hex salt>:<derived hash>`, N=32768, r=8, p=3, 32 output bytes.
The salt is the existing ASCII hex string. The hosting crypto primitive
performs derivation; Rust manages validation, formatting and constant-time
comparison. Existing passwords work without being reset. [E1, E2]

## Database and operational continuity

The same Sites project, D1 binding, tables, migration files and runtime
secrets are reused. Profiles, raw game records, balances, collectibles,
pending orders, sessions and operator authorization retain their formats.
There is no new schema migration. The game Start/Stop setting and selected
RNG source remain stored in the existing database. [E1, E2]

Sites continues serving requests on demand. Shared rounds follow the
existing 30-second clock, and due wagers settle on relevant requests.
The migration does not introduce background scheduling or change the
existing test payment and email modes. Full paid multiplayer Insights
remains separate unfinished product work. [E1]

The older JavaScript implementation is retained for compatibility tests
and the previous deployment. It is absent from the production account
route. The older root Node/WebSocket prototype also remains a legacy demo;
it is separate from the active Sites backend. [E1, E4]

## Build and verify

From `rou/sites-server/`, with Rust and wasm-bindgen on PATH:

```powershell
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.117 --locked
cargo test --manifest-path rust/Cargo.toml
npm run build
npm run test:rust
```

Expected: four native Rust checks, 16 API contract checks and one
cutover/rollback check pass. The production build emits a WebAssembly
module plus its hosting adapter. The initial migration used Rust 1.99.1.
The Rust dependency lockfile and wasm-bindgen 0.2.117 are retained. [E2]

For the isolated compiler installed during this task, set `CARGO_HOME`,
`RUSTUP_HOME`, PATH and `WASM_BINDGEN_BIN` to the installations under the
local European Roulette workspace's `rust-tools/` folder. Machine-wide
PATH was not changed. Generated `rust/target/` and `rust/pkg/` are ignored
by Git. [E2]

The backend README at `rou/sites-server/rust/README.md` describes the
request/host boundary and runtime checks. The local disposable preview
`tools/preview-integration.mjs` now loads the same Rust module; build the
backend before using that preview. [E1, E4]

Checks completed on 22 October:

- All 16 existing backend contract tests run against compiled Rust.
- Four Rust checks cover account validation, wallet limits, purchase
  idempotency and roulette bet groups.
- A populated database switches from JavaScript to Rust with an existing
  session, two collectible copies, a pending order and an unsettled wager.
  It settles once, preserves the record epoch and works after rollback.
- Accounts created by Rust also log in through the old implementation.
- Type checking, the production build and Worker deployment validation
  succeed. The actual local Worker serves Rust responses.
- Local and live smoke checks create two disposable accounts, test
  simulated purchase retries and repeat ownership, share a draw, settle
  once and remove their own test accounts.
- The existing operator account logs in on Rust using its existing
  password and original private operator key. [E2]

## Deployment and rollback

Published backend version: **7**. [E3]

- Project: `appgprj_6ad4b4b6cfc08191a69da6579543d29c`.
- Backend source: `f501cd3dfce9e27cd32922165590c360404ea8e7`.
- Saved version suffix: `appgver_b95dbcb9ea0481919f3836c3ec2b2980`.
- Existing API origin: [Atelier test backend][api].

To roll back, deploy the existing saved version 6 using Sites tools while
preserving its database and environment. Its source is
`adfe7cef5db9cfef49c0863b275aae8e029bbaaa`; its saved version suffix is
`appgver_edc0a2fc49048191b016b05d26d1a6e4`.
The migration test verifies that data written by Rust remains compatible
with that version. [E2, E3]

No performance gain is claimed without a measured comparison.

## Evidence

- E1: backend `rust/src/*.rs`, `rust/service.mjs`, `rust/worker.mjs`,
  `app/api/account/[action]/route.ts` and unchanged `drizzle/*.sql`.
- E2: `rust/src/model.rs`, `scripts/test-rust-parity.mjs`,
  `test/rust-migration.test.mjs`, `scripts/smoke-rust-worker.mjs`;
  local build/runtime outputs and live checks on 22 October 2026.
- E3: successful Sites publication of version 7, environment revision 2;
  live session response and Rust backend header.
- E4: `tools/preview-integration.mjs` and retained legacy server sources.

[game]: https://zhonecloud-sketch.github.io/prototypes/rou/
[admin]: https://zhonecloud-sketch.github.io/prototypes/rou/admin.html
[api]: https://atelier-roulette-test.zhonecloud.chatgpt.site
