# ATTK Rust test specification

Each test below has explicit inputs, behavior checks and success criteria.
The original `docs/test_spec.md` still describes the inherited v56 suite.

## Rust engine unit tests

- Script: `cargo test --locked --workspace`.
- Source: `rust/engine/src/lib.rs`.
- Inputs: empty/partially equipped armies, casualty truncation boundaries,
  horse escape, training square-root boundary and zero food divisor.
- Method: call exported arithmetic directly in native Rust.
- Output: Cargo's named test pass/fail report.
- Success: every expected value matches, with no failing unit test.
- Scope: arithmetic only; these cases do not render the game.

## Rust server unit tests

- Script: `cargo test --locked --workspace`.
- Source: `rust/server/src/main.rs`.
- Inputs: encoded traversal, backslashes, NUL, Windows paths, source paths,
  prefix rules and closed/open/suffix/multiple audio ranges.
- Method: call request-path and byte-range parsers directly.
- Output: Cargo's named test pass/fail report.
- Success: unsafe/source paths fail; valid ranges return exact bounds.

## Compiled WASM differential tests

- Script: `node tests/attk-rust-tests.mjs`.
- Inputs: the actual release WASM, v56 reference functions and 10,000
  deterministic generated army pairs; all terrain/divisor entries,
  factors, empty armies and INT 89/90/100 ambush boundaries.
- Method: instantiate WebAssembly and compare equipment, power,
  casualties, flee, training, food relief, melee and ambush results.
  Separate RNG traces compare both results and draw counts.
- Output: number of successful equality/trace checks, or an assertion
  naming the mismatching function.
- Success: exact Number/object equality and identical RNG consumption.
- Limit: covers validated nonnegative finite gameplay input domains;
  arbitrary malformed records are handled by existing save validation.

## Real HTTP server integration

- Script: `node tests/attk-server-tests.mjs`.
- Inputs: the platform executable, a dynamic local port and actual
  index, media, js-yaml and WASM files.
- Method: run the actual desktop launcher with --no-open, wait for its
  listening URL, make HTTP
  requests, instantiate the served WASM and inspect byte-range content.
- Cases: readiness, index title, WASM MIME, blocked source/traversal,
  GET/HEAD, rejected POST, first audio bytes, invalid audio range,
  suffix range and vendored dependency.
- Output: a pass line or an assertion; the owned child server is stopped.
- Success: exact status/body/MIME behavior with successful kernel loading.
- Platforms: Windows, Apple Silicon Mac, Intel Mac and Linux CI.
- Limit: the --open OS/browser handoff is checked locally by the user;
  CI does not open the user's default Brave/Safari browser.

## Inherited game mechanics under Rust

- Script: `npm test` with the Rust preloader.
- Preloader: `tests/rust-preload.mjs`.
- Inputs: original game scenarios, fixtures and compiled release WASM.
- Method: each Node test process loads the actual WASM before importing
  game modules. The existing battle/governance/AI tests then exercise
  the new arithmetic through their normal public game APIs.
- Output: inherited named regression pass/fail reports.
- Success: every existing core/asset regression still passes.
- Existing cases cover concealed targets, charge arrivals and ambush,
  simultaneous attacks, turn order, recruitment and audio cue mapping.
- Limit: inherited tests still have uneven coverage; passing them is not
  proof that every main.exe mechanism is implemented.

## Mounted v56 UI and raster cases

- Script: `npm run test:v56:ui` with the Rust preloader.
- Inputs: v56 mounted UI fixtures, Canvas raster adapter and media.
- Method: use the existing UI/raster harness. The symbol-based engine
  remains available when the harness copies modules into its temporary
  folder. Mechanics calls therefore still use Rust.
- Output: existing named UI/raster pass/fail reports.
- Success: all v56 integration assertions pass.
- Platform: Linux CI. The inherited temporary paths are Linux-specific.

## Actual compact browser boot

- Script: `node tests/attk-browser-tests.mjs`.
- Inputs: Rust server, Chromium and WebKit through Playwright.
- Viewports: 667x375, 844x390, 915x412 and 1280x720, plus 390x844 portrait.
- Method: load the real HTTP index, await the launch screen, confirm the
  live WASM ABI, inspect title and overflow, click New Game, then inspect
  setup controls. Scroll scenario content and verify the footer stays
  visible (BUG-ATTK-01), then complete setup and start a campaign.
  Portrait checks verify rotation guidance.
- Output: per-browser/viewport pass lines and setup screenshots.
- Success: no page errors; engine ABI is 1; menu/setup controls fit;
  no horizontal document overflow; rotation guidance is visible.
- Limit: desktop Chromium is not Brave certification; desktop WebKit is
  not branded Safari or a physical iOS device. No native APK/IPA is tested.

## Package integrity

- Script: `node tools/package-attk.mjs PLATFORM`.
- Inputs: source snapshot, compiled host executable and compiled WASM.
- Method: copy a self-contained folder with source, assets and vendored
  js-yaml; exclude intermediate/npm outputs; hash every packaged file.
- Output: platform artifact with BUILD-INFO.json, hashes and byte sizes.
- Success: packaging finishes; native executable/WASM are present and
  server integration has passed for that same host build.
- Limit: artifacts are unsigned test packages, not signed installers.

## Pending test-case designs

### P-ATTK-01: real Windows launcher and browser handoff

- Gap: this session has no access to C:\automation or the user's desktop.
- Design: from that path, run start-game.bat; verify the console URL,
  default browser opening, Rust ABI 1 and Ctrl+C stop.
- Success: first run starts the bound server before opening the game.
- Suggested solution: user's manual local acceptance, recorded with OS
  and Brave version; later an opt-in self-hosted Windows test runner.

### P-ATTK-02: physical iOS/Android gameplay and audio

- Gap: no physical phone is connected to CI.
- Design: use the LAN URL; exercise deployment, move, charge, simultaneous
  attacks, messenger audio, gestures, save/reload and background return.
- Success: compact controls remain reachable; gestures and audio work.
- Suggested solution: complete the installation guide's device checklist.
  Add real-device automation later if maintenance cost is justified.

### P-ATTK-03: safe uninstall on installed devices

- Gap: cleanup scripts must not erase a developer's shared system setup.
- Design: in a disposable copy, create only generated directories, run
  cleanup with REMOVE, verify source and siblings remain unchanged.
- Success: only target/bin/wasm/dist disappear; saves remain untouched.
- Suggested solution: a local disposable-copy acceptance test before
  uninstall; scripts refuse linked top-level output directories.

### P-ATTK-04: full campaign rendered in browser automation

- Gap: the browser test starts a campaign, not every gameplay screen.
- Design: seed a public game state fixture through a test-only entry,
  then exercise deployment, dialogs, attacks, messenger and save flows
  at the smallest supported viewport without shipping the test entry.
- Success: action effects, animation, audio cues and visible controls agree.
- Suggested solution: reuse v56 scenario fixtures with deterministic
  browser inputs; do not infer this coverage from launch screenshots.

### P-ATTK-05: older OS and other CPU architectures

- Gap: prebuilt packages target the four named CI environments.
- Design: test Windows ARM, older macOS/Linux and Linux ARM on actual hosts.
- Success: binaries start and the browser passes the same game checklist.
- Suggested solution: build locally for that host until it has its own
  validated artifact. iOS/Android use browser WASM in the current design.

## Inherited fixture stability correction

The v28 treasure/local-report routing case now starts with empty injected
report ledgers. Previously it cleared log entries but kept random startup
monthly reports; unrelated events could fail its empty-province assertion.
Its event-routing assertions are retained, without changing game behavior.

## Windows standalone-runtime dependency check

- Script: `node tools/check-windows-runtime.mjs`.
- Inputs: the actual release PE executable from build.bat.
- Method: parse PE sections, normal imports and delayed imports.
- Output: the Windows DLL import list, or a failed dependency assertion.
- Success: no external Visual C++/UCRT runtime DLL is required.
- Scope: standard Windows OS libraries remain necessary.
