# Workspace guide

## Start here

There is one editable source checkout: `/workspace/sites/rtk2-remastered` in this session. Open its root `README.md` first. All relative paths below start at that checkout unless stated otherwise.

The current game release is **v44**, recorded in `dist/rtk2/config/release.json`. V44 adds optional trained governance/battlefield policies, HUD comparison and reusable offline training tools. Legacy remains the default; start with [the training manual](ai-training-manual.md). V43 updates fire timing/transparency, portrait inspection, deployment confirmation, movement costs and attack playback. See `docs/native-turns-v43.md` for original-rule verification. The cleanup was a maintenance change on top of v38. The v39 update adds HUD AI inspection overlays. V40 fixes battlefield status sizing and turn announcements, restores defender-first combat and adds the root AGENTS.md coding rules. V41 fixes Fireball targeting and mobile placement cards, and closes HUD after an AI action. V42 adds automatic ready-unit selection, synchronized three-cycle attacks, clearer fire, recovered fire-escape priorities and visibility-limited route planning. Downloadable packaging remains undecided.

## What each folder contains

| Location | Purpose | Keep? |
| --- | --- | --- |
| `dist/rtk2/index.html`, `style.css`, `mjs/` | Game page, layout and JavaScript source | Yes; this is the editable game. |
| `dist/rtk2/config/` | Scenarios, province terrain, geography, AI settings and release identity | Yes. |
| `dist/rtk2/assets/` | Images and audio, including fallback and regression reference art | Yes; a version in a filename does not mean a file is unused. |
| `dist/lib/js-yaml.js` | Local reader for `game-config.yaml` | Yes; the game and launcher need it. |
| `dist/index.html` | Redirect from the site root to the game | Yes. |
| `dist/rtk2/tests/` | Automated gameplay, save, artwork and interface checks | Yes, including older `vNN-tests.mjs` files. They still run in `npm test`. |
| `dist/rtk2/tools/` | Local launcher, asset builders, original-game verifiers and existing packaging utility | Yes; these explain how to reproduce the project. |
| `dist/rtk2/docs/` | Editing guides, differences, native evidence, artwork provenance, native evidence and license notices | Yes. |
| `dist/rtk2/package.json`, `package-lock.json` | Test commands and exact development dependency versions | Yes. |
| `dist/rtk2/start-game.*`, `START-HERE.html`, `RELEASE.txt` | Existing launch instructions and release description | Yes. |
| Git history and hosting configuration | Recovery history and existing Site identity | Yes; preserve them during maintenance. |
| `node_modules/`, `__pycache__/` | Installed development dependencies and Python caches | Recreate when needed; excluded from the cleaned workspace. |
| Generated ZIP/TAR files and exported copies of `differences.md` | Delivery outputs from an earlier release | Recreate after deciding the next package; keep the source report in `docs/`. |

`dist/` often means disposable build output in other projects. Here the HTML and modules run directly in the browser, and this folder is the source of truth. There is no `src/` copy to recover from if you delete it.

## What was removed

The cleanup removed these confirmed nonessential files:

- `rtk2-remastered-source.zip`, `rtk2-site.tar.gz`, `rtk2-site-complete.tar.gz` and duplicate exported `differences.md` from the session's `v38/` folder.
- Downloaded Library transfer helpers and their cache in the session workspace.
- Installed `node_modules/` and Python bytecode caches after verification. Their inputs remain in the source tree.
- The retired `mjs/world.mjs` and `mjs/province-world.mjs` WebGL renderers, and their unused `dist/lib/three.module.js` and `three-core.js` dependencies. The active renderer is `mjs/raster-world.mjs`.

All game images/audio, map prompts, native evidence, licenses, package definitions and regression tests remain. No gameplay logic was rewritten. The original supplied DOS executable is not bundled in this checkout; the verification tools take original inputs supplied separately.

## Run the game locally

Install Python 3, then run this from the repository root:

```sh
python3 dist/rtk2/tools/serve-game.py --open
```

Open `http://localhost:8080/rtk2/` if a browser does not open automatically. Stop the server with Ctrl+C. Keep `rtk2/` and `lib/` beside each other. Opening the page as a `file://` URL will not load the fetched configuration reliably.

This is a local preview, not a publication. It does not need Node or the test dependencies.

## Run the checks

Use Node.js 24.15 or newer in the 24.x line. The installed test dependencies also declare support for Node 22.22.2+ and 26+; the cleanup was verified with Node 24.19.

```sh
cd dist/rtk2
npm ci
npm test
npm run test:ui
```

`npm ci` restores the exact dependencies in the lockfile; it needs npm registry access or an existing npm cache. The game itself uses local runtime assets and does not need this installation to play.

`npm test` includes campaigns, save validation, combat, AI and artwork checks. `npm run test:ui` checks mounted interface behavior and raster rendering in an emulated browser. It does not verify a physical phone, device wake-lock behavior or audible sound quality.

## Work on one change at a time

From the repository root, check `git status`, then create a branch such as `git switch -c ai-training-experiment`. A branch is a named line of changes; it makes experiments easier to review and undo.

1. Read [the AI guide](ai-editing-guide.md) and pick the smallest relevant file.
2. Change one setting or decision. Keep a note of the expected behavior.
3. Run the focused check listed in the guide, then the full suites before a release.
4. Read `git diff` to see exactly what changed.
5. Commit the verified change. A commit is a saved checkpoint of the source.

Use the [maintenance handoff](maintenance.md) when starting a new chat. It identifies the event, messenger and treasure paths that previously regressed.

## Packaging remains undecided

No new archive was produced by this cleanup. Possible next deliverables are:

| Option | Intended reader | Contents to consider |
| --- | --- | --- |
| Playable game | Someone who only wants to play | Runtime page/modules, config, active and fallback assets, `lib/js-yaml.js`, launcher and required notices. |
| Developer handoff | Someone who will edit the game | Playable game plus all tests, tools, dependency definitions and guides. |
| Research/artwork handoff | Someone auditing fidelity or regenerating art | Developer handoff plus all evidence, historical art references and active painting provenance. |

These are options, not finalized file lists. A playable-only package needs a dependency audit and its own launch check before removing references. The existing `tools/package-source.py` makes the established `rtk2/` source pack and deliberately excludes shared `lib/`; it is not yet a standalone all-in-one player package. Do not assume it implements the table above.

## Cleanup verification — 10 October 2026

Both `npm test` and `npm run test:ui` passed after removing the retired rendering files. The interface run passed all 49 reported groups. Active artwork and all 41 terrain-guide hashes match the release manifest, remaining module imports resolve, and documentation links resolve. The AI configuration, active gameplay modules, tests and asset bytes are unchanged from the v38 baseline.

Generated copies, temporary helpers, installed dependencies and retired renderer files accounted for approximately **280 MB** of removed working files. Development dependencies were removed after the successful checks; run `npm ci` before the next test session. The source checkout and Git recovery history remain, with a session-folder shortcut pointing to the same checkout rather than a second copy. No new release archive or deployment was made.
