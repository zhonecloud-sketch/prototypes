# ATTK installation, running and removal

Updated: 14 October 2026.

Game title: **A Tale of the Three Kingdoms**.

This guide covers the independent `attk` folder next to `rtk2`.
The intended Windows path is `C:\automation\prototypes\attk`.

## What this build proves

The Rust server serves the complete game through HTTP. Compiled Rust
WebAssembly supplies equipment, combat power, casualty, flee, training
and food-relief arithmetic. JavaScript preserves RNG sequencing and
coordinates battles, campaigns, AI, rendering, animations, sound and saves.

This is a working incremental Rust port, not a full Rust rewrite.
Each desktop OS needs its own server binary. The same WebAssembly file
runs in the supported desktop and phone browsers.

The game prioritises the existing compact landscape phone layout.
Portrait phones show rotation guidance. Native iOS/Android packages,
touchscreen certification and app-store releases are not included.

The authoring session cannot access your Windows filesystem or operate
your computer. CI builds and tests do not establish that the game has
already run on your particular PC. Complete the local acceptance steps
below to confirm that.

## Choose a route

- Prebuilt package: no Rust, C++ tools, Python or Node needed to play.
- Source build: install Rust and the host linker, then run the build script.
- Development tests: additionally install Node.js 24 LTS and use npm.
- Phone testing: run a desktop server and open it over private Wi-Fi.

Rust is pinned to 1.90.0 in `rust-toolchain.toml`. Both Rust crates use
only the standard library. There are no downloaded Cargo dependencies,
wasm-bindgen, wasm-pack, Python server or native webview requirements.
The Windows build statically links its C runtime. CI inspects the actual
executable's normal and delayed DLL imports to verify that property.

Build outputs live in `attk/target`, `attk/bin`, `attk/wasm` and
`attk/dist`. These are ignored by Git.

## Get the project into the existing Windows clone

1. Save ongoing work in your existing clone. Do not discard local changes.
2. Open PowerShell in VS Code or from the Windows Start menu.
3. Run:

```powershell
cd C:\automation\prototypes
git status
git pull --ff-only
cd attk
```

The repository now has both `rtk2` and `attk`. If Git reports a conflict,
dirty tracked files or diverged branches, stop and resolve that condition.
Do not use reset, clean or forced replacement to proceed.

This fork uses a private copy of js-yaml in `attk/vendor`. The original
sibling `lib` and the original `rtk2` files are unchanged.

## Prebuilt installation: simplest first test

1. Sign in to GitHub and open [ATTK builds][builds].
2. Open a completed successful run for the commit you have checked out.
3. For an existing checkout, download the small runtime-only artifact:
   - `attk-windows-x64-runtime`: Windows 10/11, 64-bit Intel/AMD.
   - `attk-macos-arm64-runtime`: Apple Silicon Mac.
   - `attk-macos-x64-runtime`: Intel Mac.
   - `attk-linux-x64-runtime`: 64-bit Linux with compatible glibc.
4. Extract it directly into your matching `attk` checkout. Its root
   contains `bin`, `wasm` and `RUNTIME-INFO.json`.
5. Inspect RUNTIME-INFO.json for commit, runtime sizes and SHA-256 hashes.
   Do not mix runtime outputs with source from another commit.
6. If you have no checkout, choose the full artifact without `-runtime`.
   Extract its complete `attk` folder into a user-writable location.
   BUILD-INFO.json records that full package's file hashes.

The small runtime artifact avoids downloading the artwork/music again.
Full packages include assets and source for a standalone folder.

Artifacts are compiled build outputs, delivered by GitHub's artifact
download mechanism. They are not a replacement for normal Git source
updates. Artifacts can expire; rebuild from source when necessary.

Builds are unsigned test outputs. Windows or macOS may show a warning.
Verify the source and download before choosing an OS-specific exception.
Do not disable protection globally. Public signed distribution is separate.

On Windows, double-click `start-game.bat`, or use:

```powershell
cd C:\automation\prototypes\attk
.\start-game.bat
```

The server binds first, then opens your default browser at:

```text
http://127.0.0.1:8765/index.html
```

Open the same URL in Brave to test that browser. Leave the console open.
Ctrl+C stops the server. No background service, registry entry, startup
task, system browser change or firewall rule is installed by the launcher.

Do not double-click index.html. Browser module/data security requires
HTTP for this game; the launcher opens that exact file through the server.

## Source installation on Windows

1. Install [Microsoft C++ Build Tools][windows].
2. In Visual Studio Installer, select Desktop development with C++.
   Include MSVC x64/x86 tools and a Windows SDK.
3. Install Rust using the official [Rust installer][rust].
   Accept the MSVC host toolchain for normal Windows development.
4. Close and reopen your terminal after installation.
5. Verify the tools:

```powershell
rustup --version
cargo --version
rustc --version
```

6. In the parallel project, compile the server and browser engine:

```powershell
cd C:\automation\prototypes\attk
.\build.bat
.\start-game.bat
```

Rustup installs the pinned toolchain and WASM target when first needed.
The first build requires network access. Subsequent unchanged launches
use the existing executable and WASM without recompiling.

After source changes, stop the server and run `build.bat` again.
Build failure stops the launcher instead of opening an unverified server.
An occupied port also fails clearly; close your earlier instance or use:

```powershell
.\start-game.bat --port 8766
```

## macOS installation

For a prebuilt package, choose your CPU architecture and extract it.
Open Terminal in the `attk` folder and run:

```sh
chmod +x start-game.command bin/attk-server
sh start-game-macos.sh
```

After setting the executable permission, `start-game.command` can be
opened from Finder. If macOS blocks an unsigned download, review the
specific item in Privacy & Security. Source builds avoid download
quarantine on the generated executable.

For a source build:

1. Install Git if needed and obtain the full prototypes clone.
2. Install Xcode Command Line Tools:

```sh
xcode-select --install
```

3. Install Rust from its official installer:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

4. Reopen Terminal, navigate to `attk`, then run:

```sh
cargo --version
sh build.sh
sh start-game-macos.sh
```

Test the launcher URL in both Safari and Brave. Full Xcode is unnecessary
for this browser/server build; it is needed for a future native iOS build.

## Linux installation

Use the Linux package on a matching x64 system, or build locally for your
architecture and distribution. The CI package is built on Ubuntu 24.04;
older glibc systems may need a local build. No universal Linux binary
compatibility is claimed.

For an Ubuntu/Debian source build:

```sh
sudo apt update
sudo apt install build-essential curl git
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Reopen the terminal in the project folder:

```sh
sh build.sh
sh start-game-linux.sh
```

If no browser opener is installed, the server prints the URL so that
you can paste it into a browser. A headless server needs no browser.

## iOS and Android browser testing

A phone does not execute a Windows .bat or desktop server binary.
The phone runs the compiled Rust WASM engine in its browser, using the
desktop computer only to serve the game files.

1. Connect computer and phone to the same private Wi-Fi.
2. Start the computer in LAN mode:

```powershell
.\start-game-lan.bat
```

On macOS/Linux:

```sh
sh start-game-lan.sh
```

3. Find the computer's private IPv4 address.
   On Windows, run `ipconfig` and read the active Wi-Fi adapter.
   On macOS, use System Settings > Wi-Fi > Details > TCP/IP.
   On Linux, run `hostname -I`.
4. If the computer address is 192.168.1.23, open this on the phone:

```text
http://192.168.1.23:8765/index.html
```

5. Optional entry pages in the same folder:
   - `http://192.168.1.23:8765/start-game-ios.html`
   - `http://192.168.1.23:8765/start-game-android.html`
6. These compact pages provide an address form. They do not start a
   server on the phone. Use the server URL, not a local Files preview.
7. Turn the phone sideways. Tap New Game before judging audio playback.
8. On iOS, test both Safari and Brave. On Android, test available browsers.
9. Keep the desktop console running throughout phone testing.

If prompted by Windows Firewall, allow only the private network for this
test executable. On other systems, inspect the corresponding firewall.
Do not port-forward your router or expose this development server publicly.
Guest Wi-Fi/client isolation can prevent devices from reaching each other.

The LAN URL uses HTTP. Browser features requiring a secure context,
including some wake-lock/fullscreen behavior, need a separate HTTPS test.
This LAN test does not certify those features. No native phone install or
phone-side Rust toolchain is required.

## Local acceptance checklist

For each browser/device, record OS, browser version, viewport and result.

1. Confirm the title is A Tale of the Three Kingdoms.
2. Open Developer Tools on desktop and run:

```js
globalThis[Symbol.for('attk.rust.kernel.v1')].kernel_version()
```

The result must be `1`. A missing WASM file must produce a startup error,
not silently switch the browser to the old calculation engine.

3. Start a campaign, place units, move, attack, charge and use simultaneous
   attack. Check dialogs, result messages and audio after a user gesture.
4. Check governance orders and messenger animation/galloping audio.
5. Check all visible controls on your smallest landscape phone viewport.
6. Export a save before stopping. Relaunch and verify saved progress.
7. On iOS/Android, background the page and return; check input and audio.
8. Stop the server with Ctrl+C, then confirm the URL stops responding.

Only your device tests can confirm Brave, Safari and actual phone behavior.
Automated desktop Chromium/WebKit tests are useful coverage, not that proof.

## Development validation

Node is optional for playing or compiling Rust. Install Node.js 24 LTS
only if you want the inherited JavaScript/UI regression tests.

From the `attk` directory on Windows:

```powershell
.\build.bat
cargo test --locked --workspace
npm.cmd ci
npm.cmd run test:rust
$env:NODE_OPTIONS='--import=./tests/rust-preload.mjs'
npm.cmd test
Remove-Item Env:NODE_OPTIONS
```

On macOS/Linux:

```sh
sh build.sh
cargo test --locked --workspace
npm ci
npm run test:rust
NODE_OPTIONS='--import=./tests/rust-preload.mjs' npm test
```

The current mounted v56 UI/raster tests run in Linux CI because they use
Linux temporary paths. They do not become Windows-compatible by installing
VS Code. See `docs/attk-test-spec.md` for platform limits and pending cases.

No launch/build/test step retrains AI. The ATTK engine fingerprint changes
because source modules changed. Existing profile files and weights remain
untouched; normal compatibility checks can reject older profiles.

## Remove generated setup only

1. Export saves you want to keep.
2. Stop every running ATTK server with Ctrl+C.
3. Windows: run `uninstall.bat`.
4. macOS/Linux: run `sh uninstall.sh`.
5. Type REMOVE when asked.

This deletes only ATTK's `target`, `bin`, `wasm` and `dist` outputs.
It keeps source, assets, docs, the RTK2 project, shared tools and saves.
The folder can be rebuilt later.

Remove `attk/node_modules` separately if you installed test dependencies.
That directory contains only the project's npm installation.

## Dispose of the whole experiment

After exporting saves and stopping the server, delete only the
`C:\automation\prototypes\attk` folder with File Explorer.
On macOS/Linux, remove only the corresponding `attk` folder in Finder
or the file manager. Do not delete `prototypes`, `rtk2` or `lib`.

The repository still tracks the ATTK source. Git reports those local
deletions; do not commit them unless you intend to remove ATTK from the
repository. A later checkout can restore it. A disposable separate clone
or branch is preferable if you want no local deletion state in this clone.

Browser saves use `attk-campaign-v1`, isolated from RTK2's key.
Each browser profile and each hostname/port has separate local storage.
To erase just ATTK's save, open its game origin and run:

```js
localStorage.removeItem('attk-campaign-v1')
```

Do this separately for the loopback/LAN origins and browsers you used.
Deleting the application folder does not erase browser storage.

## Remove development tools, if no other project needs them

These tools are shared system installations. The cleanup scripts leave
them installed intentionally.

- Rust: `rustup self uninstall` removes the user's Rustup toolchains.
  Use this only if you want to remove Rust for every project using it.
- Windows C++ tools: use Visual Studio Installer to modify/remove the
  Build Tools workload installed for this experiment.
- Node.js: uninstall through the same installer/package manager used.
- macOS CLTools: use Apple's current removal guidance only after checking
  other developer tools. Do not remove shared Xcode/CLTools blindly.
- Linux tools: remove only packages you added and no longer need, using
  your package manager. Build tools and Git may serve other projects.
- VS Code/rust-analyzer: remove the extension or editor through its normal
  UI if it was added solely for this experiment.
- Any manually added firewall rule: remove the specific ATTK rule in the
  OS firewall. The game does not create such a rule automatically.

No account service, subscription, scheduled AI training, registry entry or
startup service needs removal.

## References

- [Rust installation][rust]
- [Windows Rust prerequisites][windows]
- [GitHub build workflow][builds]
- [Rust WebAssembly target][wasm]

[builds]: https://github.com/zhonecloud-sketch/prototypes/actions
[rust]: https://rust-lang.org/tools/install/
[windows]: https://learn.microsoft.com/en-us/windows/dev-environment/rust/setup
[wasm]: https://doc.rust-lang.org/rustc/platform-support.html
