# RTK2 Remastered — current overview

The current game is **v56**, a playable HTML5 / Canvas 2D strategy game for landscape phones and desktop browsers. `config/release.json` identifies the release and active event artwork. The RTK2 README and development-workflow.md are the entry points for development.

## Guides

[V56 mechanics and delivery notes](fixes-v56.html) cover this release. [Development and delivery policy](development-workflow.md) records GitHub delivery, ZIP-on-request and no automatic AI training. [V55 audio fixes and licence findings](fixes-v55.html) remain available. Earlier [V54 native findings](fixes-v54.html) remain available.

[V53 fixes](fixes-v53.html), [reported bug coverage](bug-validation.md) and [pending test designs](pending-test-case-design.md) describe the current corrections and verification limits.

[V48 display and battle animation fixes](battle-presentation-v53.md) describe message timing, governor visibility and charge/ambush presentation.

| Read this | For |
| --- | --- |
| [Workspace guide](workspace-guide.md) | Folder purposes, cleanup scope, local launch, tests and future package choices. |
| [Beginner AI editing guide](ai-editing-guide.md) | Step-by-step changes to governance and battlefield decisions. |
| [AI settings reference](ai-tuning.md) | Exact configuration names, defaults and current consumers. |
| [Maintenance handoff](maintenance.md) | Event, messenger and treasure paths that previously regressed. |
| [Original-game differences](differences.md) | Verified equations and limits, executable evidence and remaining approximations. |
| [Native combat and orders](native-battle-v33.md) | Ambush, voluntary flight, Train, Give and local governance priority evidence. |
| [Defeated field withdrawal](compulsory-retreat-v34.md) | Compulsory retreat/capture and pending-decision save behavior. |
| [AI training manual](ai-training-manual.md) | Optional profiles, offline training, Legacy comparison and retraining after rule changes. |
| [AI training evaluation](ai-training-v44-results.md) | Reproducible experimental example results and limits. |
| [Battle turns, fire, movement and deployment](native-turns-v43.md) | Original executable findings, requested controls and known limits. |
| [Fire escape and palace decisions](native-fire-v42.md) | Recovered fire-goal priorities, executable checks and remaining limits. |
| [Combat equations](battle-equations-v32.md) | Native melee, equipment and palace-assault arithmetic. |
| [Ambush AI proposal](ai-ambush-proposal-v33.md) | A discussion of more precise interception policy; not an implemented new strategy. |
| [Artwork overview](ARTWORK.md) and [v36 history artwork](artwork-v36.md) | Generation provenance and current standalone history images. |

Older versioned tests and evidence are retained because current checks still use them. For release history, use `differences.md` and Git history; this overview describes the current entry points instead of repeating old behavior.

## Play locally

From the repository root:

```sh
python3 dist/rtk2/tools/serve-game.py --open
```

Visit `http://localhost:8080/rtk2/`. The neighboring `lib/js-yaml.js` is required. There is no build step. For the complete v55 download, unzip both `rtk2/` and `lib/` together, then use `start-game.bat` (Windows) or `sh start-game.sh` (macOS/Linux) with Python 3 installed. The required local library is included.

## Main controls

HUD → AI includes optional policy import and Legacy/Trained comparison; see [the training manual](ai-training-manual.md). Legacy stays the default. It also includes **Planned path** and **Jungle scores** inspection toggles. See [the AI guide](ai-editing-guide.md#inspect-routes-and-jungle-scores-with-hud-v39).

Choose an era and up to twelve human rulers, or no human rulers for a spectator campaign. Governance uses Events / Province / Orders. Menu contains settings, saves, checkpoints and screen-dimming preference; HUD pauses automation while inspecting or editing bounded values. HUD → AI provides controller intelligence, aggression and single-step controls.

Battle commands include Move, Attack, Wait, View, Strategy and Flee. Detailed AI battles use legal hex actions; unwatched battles use a separate aggregate resolver. Battle results and required human decisions complete before governance resumes. Read the fidelity report for the verified rule details and remaining differences rather than inferring original-game parity from a UI label.

Across China includes current reports and the latest completed AI round, not an accumulating historical archive. Province events remain separate where appropriate. Screen dimming is disabled by default through a browser wake-lock request when supported.

## Development checks

From `dist/rtk2`, with Node 24.15+ in the 24.x line:

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

The [v54 report](fixes-v54.html) links the [verification record](verification-v54.json), [human joint audit](native-joint-findings-v54.md), [AI joint audit](native-ai-joint-findings-v54.md) and [native captive/audio audit](native-captive-audio-v54.md).

[V55 audio fixes](fixes-v55.html) replace the requested clips. [Commercial audio conditions](audio-licenses-v55.md) apply to finished-game distribution; the private source archive must not be redistributed with the Mixkit sound.
