# RTK2 Rust development, testing and delivery

Beginner guide for macOS, Windows and the available iOS browsers.
Prepared 13 October 2026. Commands are examples for you to run locally;
this documentation task has not installed Rust or migrated the engine.

## 1. Choose the primary repository

Use [the GitHub repository][repo] as the primary development repository.
Keep RTK2 changes inside rtk2/ and preserve the sibling lib/ directory and
the other prototypes. Local clones are working copies of that repository.

Use the services for these separate purposes:

| Service | Purpose |
| --- | --- |
| GitHub repository | Source, history, reviews and documentation |
| Local VS Code | Editing, debugging and interactive testing |
| GitHub Actions | Automated tests, compilation and packaging |
| GitHub Pages | Public static game delivery |
| OpenAI Sites | Optional preview or explicitly requested hosting |

The existing [public game address][game] is a GitHub Pages project site.
Your GitHub repository currently contains the recent asset and prompt
maintenance. Its existing validation workflow runs the JavaScript core,
asset and mounted v56 UI/raster checks.

Sites is active at version 56 at [its separate address][site]. There is
no established automatic synchronization between these two repositories.
The Sites version number is not a GitHub commit identifier.

The public Pages URL could not be fetched during this audit. The repo
reports Pages enabled; this guide does not certify the exact commit
currently served at the public address.

Recommended direction:

1. Start every task from the latest GitHub branch.
2. Edit and test a local working copy, or a temporary coding environment.
3. Commit reviewed changes to GitHub.
4. Deliver the compiled web output through GitHub Pages.
5. When you explicitly want a Sites preview, update Sites from that
   reviewed GitHub state using its supported source/deployment workflow.

Do not independently edit both main branches. An intentional Sites
experiment should be compared and merged into GitHub before it becomes
a release. Source changes do not automatically transfer between hosts.

## 2. What Rust changes, and what it does not

The current repository has no Cargo.toml, Rust source or Tauri config.
Today it is still the HTML/JavaScript/Canvas game.

Rust can compile shared logic to native machine code and WebAssembly.
It does not turn a Windows executable into a macOS executable. Build for
each operating system and CPU architecture separately.

Recommended progression:

1. Establish the current local game and tests.
2. Learn Rust/WebAssembly in a separate feature branch.
3. Package the existing Canvas game in Tauri.
4. Move selected engine calculations to a shared Rust library only after
   preserving the existing behavior with differential regression tests.

Keep rendering, interface and browser audio in the current frontend.
A future shared WebAssembly engine can run in both the public browser
game and Tauri's desktop webview. Desktop-specific file access belongs
in a small adapter, not inside the portable equations.

Sites can remain an editing/preview environment when its current runtime
supports the required tools. Do not depend on it for native Windows/macOS
builds, code signing or hardware testing. No Rust compiler capability
was established for the current Sites execution environment in this audit.

Start with the Mac as your main interactive development machine if that
is convenient: it gives you both Safari and Brave. Use Windows to verify
the Windows browser and, later, the Windows desktop package.

## 3. Install the common tools

Install these from their official sources:

- [VS Code][vscode]: the editor.
- [Git][git]: clone, commit and synchronize source.
- [Node.js 24 LTS][node]: current JavaScript validation dependencies.
- [Python 3][python]: the project's existing local HTTP server.
- [Rust via rustup][rust]: rustc, Cargo and toolchain management.
- The rust-analyzer VS Code extension: Rust editor support.

The optional Rust library uses wasm-bindgen for the JS boundary. Add
serialization crates such as Serde only when the engine's data contract
requires them. Python Unicorn, Pillow, NumPy and ffmpeg belong to
specialist native-evidence or asset workflows, not this basic setup.

Node/Python/Rust are development tools. Browser players do not install
them. Desktop players use the packaged app and its platform prerequisites.

Use GitHub Desktop or VS Code's browser-based GitHub sign-in if you want
to avoid configuring Git credentials manually. Use your GitHub account
authorization; never put a password or token in source files.

Keep rust-analyzer as the Rust extension; the older Rust extension is
deprecated. VS Code is optional: the same commands work in an ordinary
terminal, and Actions can run them without your computer being open.

### macOS installation

1. Install VS Code, Git, Node 24 LTS and Python 3.
2. Open Terminal and install Apple's compiler/linker tools:

```sh
xcode-select --install
```

3. Install Rust using its official rustup installer:

```sh
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

4. Select the default stable installation. Close and reopen Terminal.
5. In VS Code, open Extensions and install rust-analyzer.
6. Check the installation:

```sh
git --version
node --version
npm --version
python3 --version
rustup --version
rustc -vV
cargo --version
```

Expected: every command prints a version. Node should be in the 24.x
line. rustc -vV also identifies your host architecture.

For desktop Tauri work, Xcode Command Line Tools are sufficient.
A future native iOS app needs full Xcode and additional Apple setup;
testing the website in iOS browsers does not require an iOS app build.

### Windows installation

1. Install VS Code, Git for Windows, Node 24 LTS and Python 3.
2. Install Microsoft Visual Studio Build Tools. Select the workload
   "Desktop development with C++", including the Windows SDK and compiler
   tools matching your PC architecture.
3. Install Rust using rustup from the official Rust installation page.
   Choose the MSVC host toolchain offered for your PC.
4. Reopen PowerShell and VS Code after installation.
5. Install rust-analyzer in VS Code.
6. Check the installation:

```powershell
git --version
node --version
npm.cmd --version
py -3 --version
rustup --version
rustc -vV
cargo --version
```

If the Python launcher py is absent, use python instead after verifying
that python --version selects Python 3.

PowerShell can block npm.ps1. The examples use npm.cmd on Windows so you
do not need to change the execution policy just to run npm.

For future Tauri desktop work, ensure the WebView2 Runtime is available.
Use the official Tauri prerequisites page for the installer details.
Brave is your browser test target; Tauri on Windows uses WebView2 instead.

## 4. Clone and open the existing game

Choose a folder for development. Clone the whole repository so lib/
remains beside rtk2/. Do not download only the rtk2 subfolder.

macOS Terminal:

```sh
mkdir -p ~/Developer
cd ~/Developer
git clone https://github.com/zhonecloud-sketch/prototypes.git
cd prototypes
code .
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\Developer"
Set-Location "$env:USERPROFILE\Developer"
git clone https://github.com/zhonecloud-sketch/prototypes.git
Set-Location prototypes
code .
```

If code is not recognized, open VS Code and use File > Open Folder to
select prototypes. On macOS the Command Palette can install the code
command into PATH.

If you already have a clone, use that clone instead of cloning again.
Open its terminal, confirm your work is committed or safely retained,
then update main and create a feature branch:

```sh
git status
git switch main
git pull --ff-only
git switch -c rtk2/rust-learning
```

Expected: the terminal reports the new branch. Paths below assume the
repository root is the prototypes folder.

Read rtk2/AGENTS.md before editing. Authored documentation must stay
within 80 source characters per line.

## 5. Run the current game before introducing Rust

Open a VS Code terminal at the repository root.

macOS:

```sh
python3 rtk2/tools/serve-game.py --open
```

Windows:

```powershell
py -3 rtk2/tools/serve-game.py --open
```

Open http://localhost:8080/rtk2/ in your installed browsers.

Expected: the launch menu loads, then a campaign can start. Network
requests for modules, configuration, images and sound should not fail.
Keep this terminal running; Ctrl+C stops the server.

Use HTTP rather than double-clicking index.html. Modules, fetch requests
and WebAssembly loading need the appropriate hosting environment.

### Test on your iPhone/iPad

For the simplest release test, use the existing HTTPS [game URL][game].
For a local development test:

1. Connect the computer and iOS device to the same trusted private LAN.
2. Restart the server with LAN binding.

macOS:

```sh
python3 rtk2/tools/serve-game.py --bind 0.0.0.0
```

Windows:

```powershell
py -3 rtk2/tools/serve-game.py --bind 0.0.0.0
```

3. Find the computer's LAN IPv4 address in macOS Network settings or
   Windows ipconfig. Suppose it is 192.168.1.23; replace this example
   with your actual address.
4. On iOS, open http://192.168.1.23:8080/rtk2/ in Safari and Brave.
5. Allow Python through the computer firewall on the private network
   if the device cannot connect. Stop the server when testing ends.

localhost on the phone refers to the phone, not your computer. Do not
forward this development server to the public internet.

LAN HTTP is useful for layout and basic play. Recheck secure-context
features, persistence and media behavior on the real HTTPS game URL.
An HTTPS-only browser setting can also affect a local HTTP test.

## 6. Run the existing validation scripts

Open a second terminal at the repository root, then enter rtk2.

macOS:

```sh
cd rtk2
npm ci
npm test
npm run test:v56:ui
```

Windows:

```powershell
Set-Location rtk2
npm.cmd ci
npm.cmd test
npm.cmd run test:v56:ui
```

Expected: PASS messages and a successful process exit. A failure is not
a passed test just because the game opens. Read the first failing case.

Run npm ci after dependency inputs change or in a fresh clone; it need
not be repeated for every source edit. Use affected tests during a fix
and the appropriate complete checks before release.

The older npm run test:ui suite remains available, but has recorded
timing limitations. A passing current v56 suite does not certify that
older suite or real hardware. See [test_spec.md](test_spec.md).

JSDOM and native Canvas checks do not replace browser playback, touch,
storage, fullscreen or real iOS tests. Each reported bug needs a
behavioral regression or an explicit exceptional pending test design.

Do not run train:ai or train:governance as routine validation. Existing
small training-related test fixtures do not authorize renewal of the
production AI profiles.

## 7. Understand what GitHub can run

GitHub Pages is static hosting. It serves HTML, JS, WebAssembly, images
and sound; it does not execute Cargo, test scripts or a Rust backend.

GitHub Actions is a separate service with runners. It can:

- Run the existing JavaScript tests.
- Compile and test Rust.
- Build WebAssembly into static output.
- Build Windows and macOS packages on matching runners.
- Publish tested static output to Pages or retain build artifacts.

Therefore local VS Code is recommended for editing and interactive
debugging, not required as the only place tests or packaging can run.

The current repository already has RTK2 validation in:

```text
.github/workflows/rtk2-validation.yml
```

It currently runs on an Ubuntu runner and has no Rust/Tauri build job.
After creating Rust code, add Rust checks and a WebAssembly build job.
Add Windows/macOS package jobs only when the desktop setup works.

On GitHub, open the Actions tab, select a run and inspect its steps.
A runner build success is not a real Brave/Safari/iOS test certificate.

## 8. Optional isolated Rust/WebAssembly learning exercise

This section creates new files on your feature branch. It is not a
migration of the live game's combat or AI.

Start in the rtk2 directory. Prepare portable Rust support:

```sh
rustup component add rustfmt clippy
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --locked
cargo new rust/engine --lib --name rtk2_engine
```

Use rust/engine rather than rust/core. This repository's root ignore
rules contain core for crash dumps, which would also ignore a directory
named core.

In VS Code create rtk2/rust/Cargo.toml with:

```toml
[workspace]
members = ["engine"]
resolver = "2"

[profile.release]
opt-level = "s"
lto = "thin"
codegen-units = 1
strip = "symbols"
panic = "abort"
```

Replace rtk2/rust/engine/Cargo.toml with:

```toml
[package]
name = "rtk2_engine"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
```

Replace rtk2/rust/engine/src/lib.rs with:

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn setup_message() -> String {
    String::from("Rust and WebAssembly are ready")
}
```

This smoke function verifies the bridge. It implements no game rule.

From rtk2, compile the native library and run the Cargo test harness:

```sh
cargo test --manifest-path rust/Cargo.toml
cargo fmt --manifest-path rust/Cargo.toml --all -- --check
cargo clippy --manifest-path rust/Cargo.toml --all-targets -- -D warnings
```

Expected: successful compilation and checks. Zero game tests at this
stage means no game behavior has been validated by Rust yet.

Build WebAssembly from its crate directory:

```sh
cd rust/engine
wasm-pack build --target web --release --out-dir ../../wasm
cd ../..
```

Expected: generated files under rtk2/wasm/, including rtk2_engine.js and
rtk2_engine_bg.wasm. --target web supplies browser ES-module bindings;
it does not mean a server-side Rust program.

Create rtk2/wasm-smoke.html with:

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>RTK2 Rust setup check</title>
<p id="result">Loading WebAssembly...</p>
<script type="module">
import init, { setup_message } from "./wasm/rtk2_engine.js";
await init();
document.getElementById("result").textContent = setup_message();
</script>
</html>
```

With the development server running, visit:

```text
http://localhost:8080/rtk2/wasm-smoke.html
```

Expected: "Rust and WebAssembly are ready". Repeat in macOS Safari,
macOS Brave, Windows Brave and the two iOS browsers.

Do not make the live app depend on this generated module until the
Pages build pipeline also produces and deploys it. Pushing Rust source
does not cause Pages to compile WebAssembly.

Add generated outputs to rtk2/.gitignore, without replacing its existing
rules:

```gitignore
target/
build/
wasm/
```

Commit Cargo.toml, the Rust source and the workspace Cargo.lock.
Do not commit target/, node_modules or local packaging output.

Record and later pin the tested Rust version in rust-toolchain.toml.
Keep Cargo.lock and package-lock.json so CI uses reproducible dependency
versions. A library dependency is different from an installed CLI tool;
record the wasm-pack and Tauri CLI versions used for releases too.

## 9. Plan the future engine boundary

A useful shared engine boundary accepts commands and validated state,
then returns new state and explicit events. UI animation and sound
consume events without applying casualties or drawing engine RNG.

Keep these concerns outside the portable rules crate:

- DOM, Canvas and audio calls.
- Browser storage versus desktop filesystem access.
- Network requests and platform permissions.
- Wall-clock timing, which belongs to presentation.

Before moving an equation, compare existing JS and Rust/WASM results
over the retained native vectors and edge cases. Preserve integer
widths, signed operations, rounding, overflow policy and RNG draw order.
Retain save compatibility or provide a tested migration.

Use one authoritative RNG state. Do not silently substitute a browser
random generator or Rust thread_rng and expect native fidelity.

Start with single-threaded wasm32. Shared-memory worker designs need
cross-origin-isolation planning and compatible host headers. No such
setup was established for this Pages deployment. It is unnecessary for
the first portable engine version.

## 10. Optional Tauri desktop packaging baseline

Complete the current web tests first. This is a local packaging exercise,
not an instruction to publish an installer.

Install the Tauri 2 CLI after the platform prerequisites:

```sh
cargo install tauri-cli --version "^2" --locked
```

From rtk2, create a separate desktop folder.

macOS:

```sh
mkdir -p desktop
cd desktop
cargo tauri init
```

Windows:

```powershell
New-Item -ItemType Directory -Force desktop
Set-Location desktop
cargo tauri init
```

Use these values during initialization:

- Application name: RTK2 Remastered.
- Development URL: http://localhost:8080/rtk2/.
- Web asset directory: ../../build/web.
- Development command: leave empty; start the Python server separately.
- Build command: node stage-web.mjs.

Tauri creates desktop/src-tauri/. Keep the generated Rust/config files
in source control. Review generated permissions before adding native
filesystem or shell features.

The following baseline staging helper avoids copying the entire
prototypes repository into the desktop app. It deliberately keeps the
current docs so existing help/license references remain available.

Create rtk2/desktop/stage-web.mjs:

```js
import {
  cpSync, existsSync, mkdirSync, rmSync, writeFileSync
} from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = fileURLToPath(new URL("../", import.meta.url));
const root = fileURLToPath(new URL("../../", import.meta.url));
const out = join(app, "build", "web");
const game = join(out, "rtk2");

rmSync(out, { recursive: true, force: true });
mkdirSync(game, { recursive: true });

for (const name of ["index.html", "style.css", "mjs", "config", "docs"]) {
  cpSync(join(app, name), join(game, name), { recursive: true });
}
cpSync(join(app, "assets"), join(game, "assets"), {
  recursive: true,
  filter: source => !/^native-music-\d+\.mp3$/.test(basename(source))
});
mkdirSync(join(out, "lib"), { recursive: true });
cpSync(join(root, "lib", "js-yaml.js"), join(out, "lib", "js-yaml.js"));

if (existsSync(join(app, "wasm"))) {
  cpSync(join(app, "wasm"), join(game, "wasm"), { recursive: true });
}
writeFileSync(join(out, "index.html"),
  '<meta http-equiv="refresh" content="0;url=./rtk2/index.html">');
console.log("Staged desktop web files in", out);
```

The native-music exclusion reflects the audited v56 runtime, which uses
the three remaster BGM files. If audio routing changes, re-audit this
filter. Retain native media in the repository for its existing tests.

This is a dependable first packaging layout, not a measured minimum
package. A later runtime asset allowlist can omit more reference art and
docs after verifying every dynamic runtime URL and help link.

Inspect desktop/src-tauri/tauri.conf.json. Its build section should be:

```json
{
  "build": {
    "beforeDevCommand": "",
    "devUrl": "http://localhost:8080/rtk2/",
    "beforeBuildCommand": "node stage-web.mjs",
    "frontendDist": "../../build/web"
  }
}
```

This is a partial configuration. Replace only the build section; retain
the generated identifier, window, security and bundle settings.

In a separate terminal, run the Python server from prototypes. Then,
from rtk2/desktop:

```sh
cargo tauri dev
```

Expected: a desktop window opens the existing game. Test inside that
window: it is a different host from Brave even when the frontend matches.
Check native-window help links, save export/import, audio unlock and
fullscreen as well as gameplay; browser success alone is insufficient.

For a local optimized package:

```sh
cargo tauri build
```

Expected: platform-specific bundle output under desktop/src-tauri/target
for the default standalone Cargo setup. Environment overrides can
change the target location. Cargo output identifies the actual artifact.
An unsigned local build is a development artifact, not a release-ready
signed package.

With the Python server stopped, launch the packaged app and check that
it still loads the local assets. An app that only works while the dev
server is running has not been packaged correctly.

For public distribution, plan code signing and macOS notarization.
Building a native iOS app is a separate Apple/Xcode distribution project.
Your current iOS browser tests do not require that project.

## 11. Keep Pages and desktop packaging separate

Before changing Pages deployment, check GitHub > Settings > Pages:
identify the configured source branch or Actions workflow.

The repository contains many other prototypes. A Pages deployment is
for the whole site, not just one subfolder. Replacing its artifact with
only RTK2 could remove the other published applications.

For future WebAssembly delivery, use a Pages build artifact that
preserves the existing publication root and all required sibling apps.
Keep rtk2/ and lib/ as siblings within that artifact.

Do not use the desktop-only staging helper above to deploy the entire
GitHub Pages site; it intentionally excludes unrelated prototypes.

A proposed future pipeline is:

1. Check out source and install locked dependencies.
2. Run the JS and Rust regressions.
3. Build WebAssembly.
4. Stage the full public site without build caches or private inputs.
5. Validate the /prototypes/rtk2/ and sibling /prototypes/lib/ paths.
6. Deploy that static artifact after checks pass.
7. Build desktop packages separately on Windows and macOS runners.

Keep browser module/asset paths relative to their game entry page.
Avoid root paths such as /assets/ or /wasm/ for this project site.

The local WebAssembly smoke exercise is not deployed by the current
validation workflow. Configuring a production Rust/Pages pipeline is
a separate implementation step.

## 12. Use your available test platforms

| Platform | Browsers | Manual coverage |
| --- | --- | --- |
| macOS | Brave and Safari | Desktop input and two engines |
| iOS | Brave and Safari | Real touch, audio and mobile lifecycle |
| Windows | Brave | Windows input, downloads and Chromium |
| macOS app | Future Tauri build | WKWebView and packaged resources |
| Windows app | Future Tauri build | WebView2 and packaged resources |

Brave's official documentation identifies desktop Brave as Chromium
based and iOS Brave as WebKit based. Keep both iOS browser runs: browser
policies, privacy settings, storage and media behavior can still differ.

For each release, record the Git commit, OS/browser version, device and
viewport/orientation. Check:

- Launch and campaign setup; all artwork and terrain load.
- Normal, Simultaneous, Charge, Fireball and ambush behavior.
- Turn announcement, commander orders and loss summaries.
- Messenger outward/intercepted/released return animation and gallop.
- Sound unlock after tapping; independent music/effect settings.
- Background/foreground, screen lock and audio interruption.
- Touch targets, compact dialogs, drag, pinch and landscape orientation.
- Save, reload, export/import and persistence after closing the browser.
- Published path, stale caches and missing resource requests.
- WebAssembly smoke initialization once the engine branch adds it.

Test with normal Brave Shields first. If a failure disappears with a
different setting, record that setting and investigate the dependency;
do not tell all players to disable protection.

Later CI can run Chromium/WebKit automation through Playwright.
Playwright's WebKit is not the branded Safari application, and mobile
emulation is not a physical iOS test. These checks supplement your
available hardware; they do not certify untested platforms.

There is currently no physical Linux/Android/Firefox coverage in your
listed test set. Mark those platforms unverified until there is evidence.

## 13. Daily workflow and cost control

For routine changes:

1. Pull the latest GitHub main into a clean working copy.
2. Create or reuse a feature branch.
3. Edit the smallest relevant module.
4. Add a behavioral test for each reported bug.
5. Run affected checks and the required pre-release suite.
6. Review the diff and push the feature branch.
7. Inspect Actions and perform the relevant real-browser checks.
8. Merge only the reviewed passing state into main.

Example commands, from prototypes:

```sh
git status
git diff
git add rtk2/docs/rust-development-setup.md
git commit -m "Document the development setup"
git push -u origin rtk2/rust-learning
```

The git add example stages one document. Select the actual changed
source files when implementing a feature; do not stage build caches.

Use incremental development builds; reserve optimized packaging for
release candidates. Keep runner dependency caches keyed to lockfiles.
Recompile Rust only when Rust sources/dependencies change.

Do not regenerate assets, renew AI training, construct source ZIPs or
rebuild Library transfer helpers during normal development. Git stores
the change; tests and packaging use the retained dependencies.

Measure code, runtime assets, installer overhead and optional webview
runtime separately. Rust does not shrink existing WebP/MP3 bytes.
The retained assets total about 81.1 MB; reference-only native music
accounts for about 27.6 MB. Packaging exclusions reduce shipped size,
not repository test coverage.

Compiler settings are a starting point, not proof of minimum size.
Compare size, startup time and AI/turn performance before choosing
"s", "z", thin LTO or full LTO. panic=abort means unrecoverable Rust
panics terminate execution; ordinary invalid orders should return errors.

Packaging portability does not resolve the existing asset/data rights
questions. Use the [commercial assessment][rights] before selling a build.

## 14. Common setup problems

### Cargo.toml not found

The current main branch has no Rust project. Complete the optional
learning exercise, or run Cargo from the Rust package/workspace path.
Do not run cargo tauri until the desktop project has been initialized.

### Rust/linker not found after installation

Restart the terminal. On Windows check the C++ workload and MSVC host.
On macOS complete xcode-select installation and check rustc -vV.

### Missing lib/js-yaml.js or images

Serve the repository root with the supplied server. In a package,
preserve the rtk2/lib sibling structure shown by the staging helper.
Check the browser Network panel for the failing relative URL.

### Wasm cannot load

Confirm the .js and .wasm files exist, the HTTP server is running and
the request path is correct. Use application/wasm for the .wasm MIME
type. Check that an HTML error page was not served at the module URL.

### iOS cannot reach the local server

Use the computer's LAN address, not localhost. Check LAN binding, Wi-Fi,
private-network firewall permission and HTTPS-only browser settings.
Use the actual HTTPS Pages site for final release behavior.

### Public Pages does not show the expected change

Inspect Settings > Pages and the corresponding deployment run. Confirm
the serving build before blaming application code or relying on a
cache-cleared local test. A source push and a successful validation run
are different from a successful Pages deployment.

### MSI packaging fails

Consult Tauri's Windows prerequisites. Some MSI toolchains require the
Windows VBScript optional feature. Do not change broad system settings
without identifying the actual reported installer error.

## 15. Official references and project records

Setup guidance was checked against the official sources below.
The sample new-project commands have not been executed in this
disconnected workspace; confirm their versions and output on your
own Mac/Windows toolchains.

- [Rust installation][rust].
- [VS Code Rust tooling][vscode-rust].
- [Tauri prerequisites][tauri-pre].
- [Tauri configuration][tauri-config].
- [Tauri app size guidance][tauri-size].
- [wasm-pack build options][wasm-pack].
- [GitHub Actions Rust builds][actions-rust].
- [GitHub Pages documentation][pages].
- [Playwright browser limits][playwright].
- [Brave platform/engine information][brave].
- [Current validation specification](test_spec.md).
- [Delivery policy](development-workflow.md).
- [Generation prompts](prompts/README.md).

[repo]: https://github.com/zhonecloud-sketch/prototypes
[game]: https://zhonecloud-sketch.github.io/prototypes/rtk2/
[site]: https://rtk2-remastered.zhonecloud.chatgpt.site
[vscode]: https://code.visualstudio.com/
[git]: https://git-scm.com/downloads
[node]: https://nodejs.org/en/download
[python]: https://www.python.org/downloads/
[rust]: https://rust-lang.org/tools/install/
[vscode-rust]: https://code.visualstudio.com/docs/languages/rust
[tauri-pre]: https://v2.tauri.app/start/prerequisites/
[tauri-config]: https://v2.tauri.app/reference/config/
[tauri-size]: https://v2.tauri.app/concept/size/
[wasm-pack]: https://wasm-bindgen.github.io/wasm-pack/
[actions-rust]: https://docs.github.com/en/actions
[pages]: https://docs.github.com/en/pages
[playwright]: https://playwright.dev/docs/browsers
[brave]: https://brave.com/about/
[rights]: changes.md#record-commercial-rights-audit-v56
