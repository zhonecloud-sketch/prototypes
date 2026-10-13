# RTK2 Remastered — current overview

The current game is **v56**, a playable HTML5 / Canvas 2D strategy game for landscape phones and desktop browsers. `config/release.json` identifies the release and active event artwork. The RTK2 README and development-workflow.md are the entry points for development.

## Guides

[Beginner Rust and local setup](rust-development-setup.md) covers macOS,
Windows, browser testing, GitHub Actions and future desktop packaging.

[Saved generation prompts](prompts/README.md) include original production
requests, source-image edits and the complete province 1 terrain brief.

Use [changes.md](changes.md) for all release history, [native_sound.md](native_sound.md) for original/current sound routing, and [test_spec.md](test_spec.md) for the complete validation catalogue. Media is grouped under assets/artwork, assets/sounds and assets/music; [asset-manifest.json](asset-manifest.json) records the cleanup.


[V56 mechanics and delivery notes](changes.md#record-fixes-v56) cover this release. [Development and delivery policy](development-workflow.md) records GitHub delivery, ZIP-on-request and no automatic AI training. [V55 audio fixes and licence findings](changes.md#record-fixes-v55) remain available. Earlier [V54 native findings](changes.md#record-fixes-v54) remain available.

[V53 fixes](changes.md#record-fixes-v53), [reported bug coverage](bug-validation.md) and [pending test designs](pending-test-case-design.md) describe the current corrections and verification limits.

[V48 display and battle animation fixes](changes.md#record-battle-presentation-v48) describe message timing, governor visibility and charge/ambush presentation.

| Read this | For |
| --- | --- |
| [Workspace guide](workspace-guide.md) | Folder purposes, cleanup scope, local launch, tests and future package choices. |
| [Beginner AI editing guide](ai-editing-guide.md) | Step-by-step changes to governance and battlefield decisions. |
| [AI settings reference](ai-tuning.md) | Exact configuration names, defaults and current consumers. |
| [Maintenance handoff](maintenance.md) | Event, messenger and treasure paths that previously regressed. |
| [Original-game differences](changes.md#record-differences) | Verified equations and limits, executable evidence and remaining approximations. |
| [Native combat and orders](changes.md#record-native-battle-v33) | Ambush, voluntary flight, Train, Give and local governance priority evidence. |
| [Defeated field withdrawal](changes.md#record-compulsory-retreat-v34) | Compulsory retreat/capture and pending-decision save behavior. |
| [AI training manual](ai-training-manual.md) | Optional profiles, offline training, Legacy comparison and retraining after rule changes. |
| [AI training evaluation](changes.md#record-ai-training-v44-results) | Reproducible experimental example results and limits. |
| [Battle turns, fire, movement and deployment](changes.md#record-native-turns-v43) | Original executable findings, requested controls and known limits. |
| [Fire escape and palace decisions](changes.md#record-native-fire-v42) | Recovered fire-goal priorities, executable checks and remaining limits. |
| [Combat equations](changes.md#record-battle-equations-v32) | Native melee, equipment and palace-assault arithmetic. |
| [Ambush AI proposal](changes.md#record-ai-ambush-proposal-v33) | A discussion of more precise interception policy; not an implemented new strategy. |
| [Artwork overview](ARTWORK.md) and [v36 history artwork](changes.md#record-artwork-v36) | Generation provenance and current standalone history images. |

Older versioned tests and evidence are retained because current checks still use them. For release history, use `changes.md#record-differences` and Git history; this overview describes the current entry points instead of repeating old behavior.

## Play locally

From the repository root:

```sh
python3 rtk2/tools/serve-game.py --open
```

Visit `http://localhost:8080/rtk2/`. The neighboring `lib/js-yaml.js` is required. There is no build step. For the GitHub checkout, keep `rtk2/` and the existing `lib/` together, then use `start-game.bat` (Windows) or `sh start-game.sh` (macOS/Linux) with Python 3 installed. Do not rebuild or upload library helpers; the existing library is already tracked.

## Main controls

HUD → AI includes optional policy import and Legacy/Trained comparison; see [the training manual](ai-training-manual.md). Legacy stays the default. It also includes **Planned path** and **Jungle scores** inspection toggles. See [the AI guide](ai-editing-guide.md#inspect-routes-and-jungle-scores-with-hud-v39).

Choose an era and up to twelve human rulers, or no human rulers for a spectator campaign. Governance uses Events / Province / Orders. Menu contains settings, saves, checkpoints and screen-dimming preference; HUD pauses automation while inspecting or editing bounded values. HUD → AI provides controller intelligence, aggression and single-step controls.

Battle commands include Move, Attack, Wait, View, Strategy and Flee. Detailed AI battles use legal hex actions; unwatched battles use a separate aggregate resolver. Battle results and required human decisions complete before governance resumes. Read the fidelity report for the verified rule details and remaining differences rather than inferring original-game parity from a UI label.

Across China includes current reports and the latest completed AI round, not an accumulating historical archive. Province events remain separate where appropriate. Screen dimming is disabled by default through a browser wake-lock request when supported.

## Development checks

From `rtk2`, with Node 24.15+ in the 24.x line:

```sh
npm ci
npm test
npm run test:ui
```

The tests cover gameplay, AI, campaign/save invariants, original-equation vectors, artwork and emulated interface/raster behavior. A versioned test is still active when listed in `package.json`; do not remove it just because a later release exists. Interface checks do not substitute for physical handset or audible playback checks.

## Data, artwork and credits

Romance of the Three Kingdoms II is a Koei title. This is an independent remaster prototype, not an official Koei release. Supplied original data informed the campaign/terrain and fidelity work. The original DOS executable is not distributed here; verifiers expect separately supplied original inputs.

Gameplay graphics are Canvas 2D raster artwork generated for this project. The retired THREE.js renderer and its unused library files were removed in the workspace cleanup. Existing license notices remain for provenance. js-yaml retains its MIT notice in [YAML-LICENSE.txt](YAML-LICENSE.txt); the earlier THREE.js notice remains in [THREE-LICENSE.txt](THREE-LICENSE.txt). No new license is assigned to upstream game data whose source declares no license.

Geography uses [Natural Earth land](https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-land/) and [rivers](https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-rivers-lake-centerlines/) under its [public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/). Historical circuit naming was cross-checked against the [Book of the Later Han, Treatise 18](https://zh.wikisource.org/wiki/後漢書/卷118). Representative seat locations are a remaster layer, not recovered original-game coordinates.

The [Koei RTK II NES instruction booklet](https://www.digitpress.com/library/manuals/nes/Romance%20of%20the%20Three%20Kingdoms%20II.pdf) is an additional reference, not proof of DOS parity. The supplied English executable and documented controlled arithmetic checks take precedence for recovered DOS mechanics.

Asset builders in `tools/` retain their required external-input instructions. Audio builders use NumPy and ffmpeg; native arithmetic verifiers need the supplied binary and optionally Unicorn. These are optional development tasks, not requirements for ordinary play.

The [v54 report](changes.md#record-fixes-v54) links the [verification record](verification-v54.json), [human joint audit](changes.md#record-native-joint-findings-v54), [AI joint audit](changes.md#record-native-ai-joint-findings-v54) and [native captive/audio audit](changes.md#record-native-captive-audio-v54).

[V55 audio fixes](changes.md#record-fixes-v55) replace the requested clips. [Commercial audio conditions](changes.md#record-audio-licenses-v55) apply to finished-game distribution; the private source archive must not be redistributed with the Mixkit sound.
