# Test specification — RTK2 v56

This is a source-derived catalogue of every validation entry point in this
checkout. It records declared test cases and parameterized groups, not a claimed
execution count. Run the scripts to expand seeded, roster, region, viewport and
native-vector loops. Every assertion in the linked source is part of the success
contract; source links identify the exact assertion expressions. Display
excerpts are wrapped at 80 source columns; consult the linked code for
execution. Setup excerpts identify case-specific inputs; shared helpers and full
input mutation sequences are accessible at the linked line range. No validation
script was removed during this maintenance.

## Running and interpreting results

Run from the `rtk2/` directory after `npm ci` with Node 24 (jsdom 30 requires a
compatible modern Node). `npm test` runs the engine fingerprint check plus the
core/versioned suites. `npm run test:ui` includes the older UI suites; `npm run
test:v56:ui` runs the 24-vector mounted raster comparison and current UI
regression suite; `npm run test:audio:ui` is the v55 UI suite. `node
tests/asset-layout-tests.mjs` checks the maintenance manifest, media bytes,
grouped directory references and retired-file absence. Native Python probes are
separate: they require legally supplied private DOS inputs, Python and Unicorn
and are not run by npm test.

A case succeeds only if all assertions execute and pass; a thrown assertion or
nonzero process exit fails the script. Named helpers print PASS/FAIL plus their
group summary; straight-line scripts print their listed PASS checkpoints. Some
helpers collect failures until completion; absence of a crash or existence of an
output JSON alone is not sufficient. Native comparison files must have the
expected case count and all pass flags true. Raster tests validate canvas calls
and state/RNG stability, not physical screen layout or human hearing.

The previous v56 verification records remain
[verification-v56.json](verification-v56.json). They describe the earlier
checkout; the current asset-move validation must use the new CI run. The older
all-UI suite has recorded fixed-delay/timing limitations and is not certified by
a v56-only UI pass. Existing nine AI profile files are retained unchanged. Tests
of tiny optimizer/curriculum fixtures are validation code, not authorization to
renew production profiles; no `train:ai` or `train:governance` command is run by
maintenance.

## Retention review and coverage limits

Do not infer that a script never caught a bug merely because its filename is
old. [bug-validation.md](bug-validation.md) connects reported bugs to behavioral
coverage; [pending-test-case-design.md](pending-test-case-design.md) records
exceptional missing tests. The v56 before/after commander-capture witnesses and
the driver-export truncation report are positive historical detection evidence.
Where no historical failure record exists, detection history is unknown, not
“never caught”.

Candidates for later review include v9/v28/v29 artwork snapshot/file-size
checks, v36 synthetic disaster-file existence checks even where native cues now
play, overlapping audio observer suites and older copied UI suites. They remain
intact until their behavioral and integration assertions are separated from
obsolete asset checks. All 21 native music exports are retained because
audio-v50 verifies their bytes and driver capture, despite being inactive BGM.
These checks cannot establish original hardware waveform parity, complete
original caller coverage, real browser autoplay behavior, physical-phone
sound/layout, commercial permissions, or unobserved native AI branches.

## Script index

---

**Script**

[tests/artwork-tests.mjs](#tests-artwork-tests-mjs)

**Invocation**

```text
`node tests/artwork-tests.mjs`
```

**Declared groups / checkpoints**

4

**Shared inputs and dependencies**

```text
assets/artwork/portraits.webp, assets/artwork/events.webp,
assets/artwork/weather.webp, assets/artwork/disasters.webp,
assets/artwork/omens.webp, assets/artwork/stories.webp,
assets/artwork/officers-historic-v30.webp,
assets/artwork/officers-custom-v49.webp, assets/artwork/officers${i}.webp,
assets/artwork/${key}-v9.webp, assets/artwork/courier.webp; node:assert/strict,
node:fs, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/asset-layout-tests.mjs](#tests-asset-layout-tests-mjs)

**Invocation**

```text
`node tests/asset-layout-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
docs/asset-manifest.json, battlefields/province-41-v17.webp,
/music/council-music.mp3, /sounds/audiomass-horse_gallop.mp3, /charge-shout.mp3,
config/release.json; node:fs, node:path, node:assert/strict, node:crypto,
node:url
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/audio-v50-tests.mjs](#tests-audio-v50-tests-mjs)

**Invocation**

```text
`node tests/audio-v50-tests.mjs`
```

**Declared groups / checkpoints**

7

**Shared inputs and dependencies**

```text
../assets/sounds/native-effect-${id}.mp3, ./assets/sounds/march.mp3,
./assets/sounds/freesound_community-sword-battle-jingle-loop-96983.mp3,
./assets/sounds/message.mp3, ./assets/sounds/order.mp3,
../assets/music/native-music-${id}.mp3, ./assets/music/council-music.mp3,
./assets/music/battle-music-v17.mp3, ./assets/music/triumph-music.mp3,
../docs/native-opl-driver-v50.json; node:assert/strict, node:fs, node:crypto
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/audio-v52-tests.mjs](#tests-audio-v52-tests-mjs)

**Invocation**

```text
`node tests/audio-v52-tests.mjs`
```

**Declared groups / checkpoints**

6

**Shared inputs and dependencies**

```text
./assets/music/council-music.mp3, ./assets/music/battle-music-v17.mp3,
./assets/music/triumph-music.mp3, audiomass-charge_scream.mp3,
freesound_community-sword-battle-jingle-loop-96983.mp3, /fire.mp3, /trade.mp3,
./assets/sounds/trade.mp3; node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/audio-v53-tests.mjs](#tests-audio-v53-tests-mjs)

**Invocation**

```text
`node tests/audio-v53-tests.mjs`
```

**Declared groups / checkpoints**

3

**Shared inputs and dependencies**

```text
audiomass-horse_gallop.mp3; node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/audio-v55-tests.mjs](#tests-audio-v55-tests-mjs)

**Invocation**

```text
`node tests/audio-v55-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
freesound_community-sword-battle-jingle-loop-96983.mp3,
audiomass-charge_scream.mp3, audiomass-horse_gallop.mp3, /native-effect-13.mp3,
/fire.mp3, ./assets/music/council-music.mp3,
./assets/music/battle-music-v17.mp3, ./assets/music/triumph-music.mp3;
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/audio-v56-tests.mjs](#tests-audio-v56-tests-mjs)

**Invocation**

```text
`node tests/audio-v56-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
audiomass-horse_gallop.mp3; node:assert/strict, node:url
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/battle-tests.mjs](#tests-battle-tests-mjs)

**Invocation**

```text
`node tests/battle-tests.mjs`
```

**Declared groups / checkpoints**

55

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/completion-tests.mjs](#tests-completion-tests-mjs)

**Invocation**

```text
`node tests/completion-tests.mjs`
```

**Declared groups / checkpoints**

16

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:assert/strict, node:fs
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/decisions-tests.mjs](#tests-decisions-tests-mjs)

**Invocation**

```text
`node tests/decisions-tests.mjs`
```

**Declared groups / checkpoints**

13

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:assert/strict,
node:fs
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/expansion-tests.mjs](#tests-expansion-tests-mjs)

**Invocation**

```text
`node tests/expansion-tests.mjs`
```

**Declared groups / checkpoints**

17

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/fidelity-tests.mjs](#tests-fidelity-tests-mjs)

**Invocation**

```text
`node tests/fidelity-tests.mjs`
```

**Declared groups / checkpoints**

19

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/mobile-layout-tests.mjs](#tests-mobile-layout-tests-mjs)

**Invocation**

```text
`node tests/mobile-layout-tests.mjs`
```

**Declared groups / checkpoints**

7

**Shared inputs and dependencies**

```text
style.css, index.html; node:fs, node:assert/strict, jsdom
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/monthly-tests.mjs](#tests-monthly-tests-mjs)

**Invocation**

```text
`node tests/monthly-tests.mjs`
```

**Declared groups / checkpoints**

12

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/province-tests.mjs](#tests-province-tests-mjs)

**Invocation**

```text
`node tests/province-tests.mjs`
```

**Declared groups / checkpoints**

24

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/strategy-tests.mjs](#tests-strategy-tests-mjs)

**Invocation**

```text
`node tests/strategy-tests.mjs`
```

**Declared groups / checkpoints**

15

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/tests.mjs](#tests-tests-mjs)

**Invocation**

```text
`node tests/tests.mjs`
```

**Declared groups / checkpoints**

15

**Shared inputs and dependencies**

```text
../config/scenarios.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/ui-tests.mjs](#tests-ui-tests-mjs)

**Invocation**

```text
`node tests/ui-tests.mjs`
```

**Declared groups / checkpoints**

64

**Shared inputs and dependencies**

```text
package.json, index.html, style.css, ./assets/artwork/fire-v42.webp, -v31.webp,
-v30.webp, config/province-terrain.json, .json, external-campaign.json,
before-enemy-move.json, before-fireball.json, before-end-turn.json,
before-charge.json, before-retreat.json, slow-governance.json,
tests/fixtures/v19-hard-second-battle.json, hard-second-battle.json,
config/scenarios.json, -audience.json, forced-retreat.json, combat-v42.json,
/freesound_community-sword-battle-jingle-loop-96983.mp3,
/audiomass-charge_scream.mp3, /fire.mp3, tile-v48.json, double-ambush-v48.json,
display-v47.json, conceal-v53.json, interception-v53.json; node:fs, node:path,
node:assert/strict, jsdom, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v15-tests.mjs](#tests-v15-tests-mjs)

**Invocation**

```text
`node tests/v15-tests.mjs`
```

**Declared groups / checkpoints**

11

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json, /battle-music-v17.mp3;
node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v16-tests.mjs](#tests-v16-tests-mjs)

**Invocation**

```text
`node tests/v16-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:assert/strict,
node:fs, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v17-tests.mjs](#tests-v17-tests-mjs)

**Invocation**

```text
`node tests/v17-tests.mjs`
```

**Declared groups / checkpoints**

3

**Shared inputs and dependencies**

```text
config/battlefield-paintings.json, config/province-terrain.json,
assets/music/battle-music-v17.mp3, assets/music/triumph-music.mp3,
assets/artwork/triumph-v17.webp; node:assert/strict, node:fs, node:crypto,
@napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v18-tests.mjs](#tests-v18-tests-mjs)

**Invocation**

```text
`node tests/v18-tests.mjs`
```

**Declared groups / checkpoints**

4

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v19-tests.mjs](#tests-v19-tests-mjs)

**Invocation**

```text
`node tests/v19-tests.mjs`
```

**Declared groups / checkpoints**

4

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v20-tests.mjs](#tests-v20-tests-mjs)

**Invocation**

```text
`node tests/v20-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json,
tests/fixtures/v19-hard-second-battle.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v21-tests.mjs](#tests-v21-tests-mjs)

**Invocation**

```text
`node tests/v21-tests.mjs`
```

**Declared groups / checkpoints**

7

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v22-tests.mjs](#tests-v22-tests-mjs)

**Invocation**

```text
`node tests/v22-tests.mjs`
```

**Declared groups / checkpoints**

6

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v23-tests.mjs](#tests-v23-tests-mjs)

**Invocation**

```text
`node tests/v23-tests.mjs`
```

**Declared groups / checkpoints**

7

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json, config/ai-config.json;
node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v24-tests.mjs](#tests-v24-tests-mjs)

**Invocation**

```text
`node tests/v24-tests.mjs`
```

**Declared groups / checkpoints**

10

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v25-tests.mjs](#tests-v25-tests-mjs)

**Invocation**

```text
`node tests/v25-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v26-tests.mjs](#tests-v26-tests-mjs)

**Invocation**

```text
`node tests/v26-tests.mjs`
```

**Declared groups / checkpoints**

7

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v27-tests.mjs](#tests-v27-tests-mjs)

**Invocation**

```text
`node tests/v27-tests.mjs`
```

**Declared groups / checkpoints**

8

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v28-tests.mjs](#tests-v28-tests-mjs)

**Invocation**

```text
`node tests/v28-tests.mjs`
```

**Declared groups / checkpoints**

7

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../assets/artwork/history-v28.webp; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v29-tests.mjs](#tests-v29-tests-mjs)

**Invocation**

```text
`node tests/v29-tests.mjs`
```

**Declared groups / checkpoints**

10

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
assets/artwork/events.webp, -v29.webp,
assets/artwork/officers-historic-v29.webp,
assets/artwork/officers-historic-v16.webp; node:fs, node:assert/strict,
@napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v30-tests.mjs](#tests-v30-tests-mjs)

**Invocation**

```text
`node tests/v30-tests.mjs`
```

**Declared groups / checkpoints**

9

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../assets/artwork/${name}-v30.webp; node:fs, node:assert/strict, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v31-tests.mjs](#tests-v31-tests-mjs)

**Invocation**

```text
`node tests/v31-tests.mjs`
```

**Declared groups / checkpoints**

13

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json, -v31.webp,
config/release.json, assets/artwork/omens-v30.webp; node:fs, node:assert/strict,
node:crypto, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v32-tests.mjs](#tests-v32-tests-mjs)

**Invocation**

```text
`node tests/v32-tests.mjs`
```

**Declared groups / checkpoints**

9

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json,
docs/native-equation-vectors-v32.json, docs/deployment-v32.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v33-tests.mjs](#tests-v33-tests-mjs)

**Invocation**

```text
`node tests/v33-tests.mjs`
```

**Declared groups / checkpoints**

12

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json,
docs/native-battle-vectors-v33.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v34-tests.mjs](#tests-v34-tests-mjs)

**Invocation**

```text
`node tests/v34-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v35-tests.mjs](#tests-v35-tests-mjs)

**Invocation**

```text
`node tests/v35-tests.mjs`
```

**Declared groups / checkpoints**

9

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v36-tests.mjs](#tests-v36-tests-mjs)

**Invocation**

```text
`node tests/v36-tests.mjs`
```

**Declared groups / checkpoints**

3

**Shared inputs and dependencies**

```text
.mp3, ./assets/sounds/audiomass-horse_gallop.mp3; node:fs, node:assert/strict,
node:crypto, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v38-tests.mjs](#tests-v38-tests-mjs)

**Invocation**

```text
`node tests/v38-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json,
./assets/sounds/audiomass-horse_gallop.mp3; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v39-tests.mjs](#tests-v39-tests-mjs)

**Invocation**

```text
`node tests/v39-tests.mjs`
```

**Declared groups / checkpoints**

7

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; node:assert/strict, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v42-tests.mjs](#tests-v42-tests-mjs)

**Invocation**

```text
`node tests/v42-tests.mjs`
```

**Declared groups / checkpoints**

9

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../docs/native-fire-v42.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v43-tests.mjs](#tests-v43-tests-mjs)

**Invocation**

```text
`node tests/v43-tests.mjs`
```

**Declared groups / checkpoints**

10

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../docs/native-turns-v43.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v44-tests.mjs](#tests-v44-tests-mjs)

**Invocation**

```text
`node tests/v44-tests.mjs`
```

**Declared groups / checkpoints**

14

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v45-tests.mjs](#tests-v45-tests-mjs)

**Invocation**

```text
`node tests/v45-tests.mjs`
```

**Declared groups / checkpoints**

11

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
config/ai-profiles/battlefield-v44.json; node:fs, node:assert/strict,
node:child_process
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v47-tests.mjs](#tests-v47-tests-mjs)

**Invocation**

```text
`node tests/v47-tests.mjs`
```

**Declared groups / checkpoints**

2

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../docs/native-display-v47.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v48-tests.mjs](#tests-v48-tests-mjs)

**Invocation**

```text
`node tests/v48-tests.mjs`
```

**Declared groups / checkpoints**

4

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v49-tests.mjs](#tests-v49-tests-mjs)

**Invocation**

```text
`node tests/v49-tests.mjs`
```

**Declared groups / checkpoints**

16

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v50-battle-tests.mjs](#tests-v50-battle-tests-mjs)

**Invocation**

```text
`node tests/v50-battle-tests.mjs`
```

**Declared groups / checkpoints**

11

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../docs/native-combat-v50.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v50-governance-tests.mjs](#tests-v50-governance-tests-mjs)

**Invocation**

```text
`node tests/v50-governance-tests.mjs`
```

**Declared groups / checkpoints**

6

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v50-presentation-tests.mjs](#tests-v50-presentation-tests-mjs)

**Invocation**

```text
`node tests/v50-presentation-tests.mjs`
```

**Declared groups / checkpoints**

4

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v52-tests.mjs](#tests-v52-tests-mjs)

**Invocation**

```text
`node tests/v52-tests.mjs`
```

**Declared groups / checkpoints**

5

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json; node:fs,
node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v53-tests.mjs](#tests-v53-tests-mjs)

**Invocation**

```text
`node tests/v53-tests.mjs`
```

**Declared groups / checkpoints**

14

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../docs/native-battle-witness-v53.json; node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v54-tests.mjs](#tests-v54-tests-mjs)

**Invocation**

```text
`node tests/v54-tests.mjs`
```

**Declared groups / checkpoints**

6

**Shared inputs and dependencies**

```text
../config/scenarios.json, ../config/province-terrain.json,
../docs/native-joint-witness-v54.json, ../docs/native-ai-joint-witness-v54.json;
node:fs, node:assert/strict
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v54-ui-tests.mjs](#tests-v54-ui-tests-mjs)

**Invocation**

```text
`node tests/v54-ui-tests.mjs`
```

**Declared groups / checkpoints**

4

**Shared inputs and dependencies**

```text
package.json, index.html, style.css, ./assets/artwork/fire-v42.webp, -v31.webp,
-v30.webp, config/scenarios.json, config/province-terrain.json, v54.json;
node:fs, node:path, node:assert/strict, jsdom, @napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v55-ui-tests.mjs](#tests-v55-ui-tests-mjs)

**Invocation**

```text
`node tests/v55-ui-tests.mjs`
```

**Declared groups / checkpoints**

2

**Shared inputs and dependencies**

```text
package.json, index.html, style.css, ./assets/artwork/fire-v42.webp, -v31.webp,
-v30.webp, config/scenarios.json, config/province-terrain.json, v55.json,
audiomass-charge_scream.mp3,
freesound_community-sword-battle-jingle-loop-96983.mp3, native-effect-13.mp3,
/audiomass-horse_gallop.mp3; node:fs, node:path, node:assert/strict, jsdom,
@napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v56-tests.mjs](#tests-v56-tests-mjs)

**Invocation**

```text
`node tests/v56-tests.mjs`
```

**Declared groups / checkpoints**

11

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json, .json, -v56.json,
docs/native-settlement-v56.json; node:assert/strict, node:fs,
node:child_process, node:os, node:path
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tests/v56-ui-tests.mjs](#tests-v56-ui-tests-mjs)

**Invocation**

```text
`node tests/v56-ui-tests.mjs`
```

**Declared groups / checkpoints**

2

**Shared inputs and dependencies**

```text
package.json, index.html, style.css, ./assets/artwork/fire-v42.webp, -v31.webp,
-v30.webp, config/scenarios.json, config/province-terrain.json, v56.json,
audiomass-horse_gallop.mp3; node:fs, node:path, node:assert/strict, jsdom,
@napi-rs/canvas
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tools/ai-rules.mjs](#tools-ai-rules-mjs)

**Invocation**

```text
`node tools/ai-rules.mjs`
```

**Declared groups / checkpoints**

1

**Shared inputs and dependencies**

```text
config/scenarios.json, config/province-terrain.json, config/ai-config.json,
config/game-config.yaml; node:fs, node:path, node:crypto, node:url
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tools/verify-charge-arrival-raster-v56.mjs](#tools-verify-charge-arrival-raster
-v56-mjs)

**Invocation**

```text
`node tools/verify-charge-arrival-raster-v56.mjs`
```

**Declared groups / checkpoints**

1

**Shared inputs and dependencies**

```text
package.json, docs/native-charge-arrival-v56.json,
/tmp/charge-arrival-raster-v56.json; node:fs, node:assert/strict, node:path,
node:url, node:module
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tools/verify-charge-arrival-remaster-v56.mjs](#tools-verify-charge-arrival-rema
ster-v56-mjs)

**Invocation**

```text
`node tools/verify-charge-arrival-remaster-v56.mjs`
```

**Declared groups / checkpoints**

1

**Shared inputs and dependencies**

```text
docs/native-charge-arrival-v56.json, /tmp/charge-arrival-remaster-v56.json;
node:fs, node:path, node:url
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tools/verify-charge-terminal-remaster-v56.mjs](#tools-verify-charge-terminal-re
master-v56-mjs)

**Invocation**

```text
`node tools/verify-charge-terminal-remaster-v56.mjs`
```

**Declared groups / checkpoints**

1

**Shared inputs and dependencies**

```text
docs/native-charge-terminal-v56.json, /tmp/charge-terminal-remaster-v56.json;
node:fs, node:path, node:url
```

**Outputs**

Console checkpoints / failure exit

---

**Script**

[tools/verify-deployment.py](#tools-verify-deployment-py)

**Invocation**

```text
`python tools/verify-deployment.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
docs/deployment-v32.json, config/province-terrain.json, config/scenarios.json;
pathlib, argparse, hashlib, json
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-ai-joint-v54.py](#tools-verify-native-ai-joint-v54-py)

**Invocation**

```text
`python tools/verify-native-ai-joint-v54.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; node:fs, node:path, node:url,
argparse,hashlib,json,struct,subprocess, pathlib, unicorn, unicorn.x86_const, fs
from 'node:fs';import path from 'node:path';import {pathToFileURL} from
'node:url';
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-audio-v50.py](#tools-verify-native-audio-v50-py)

**Invocation**

```text
`python tools/verify-native-audio-v50.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib, argparse, hashlib,
importlib.util, json, struct, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-battle-v53.py](#tools-verify-native-battle-v53-py)

**Invocation**

```text
`python tools/verify-native-battle-v53.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
/workspace/scratch/7c8707393eee/native-battle-witness-v53.json; pathlib,
sys,json
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-battle.py](#tools-verify-native-battle-py)

**Invocation**

```text
`python tools/verify-native-battle.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; argparse, hashlib, importlib.util,
json, math, random, struct, pathlib, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-captive-audio-v54.py](#tools-verify-native-captive-audio-v5
4-py)

**Invocation**

```text
`python tools/verify-native-captive-audio-v54.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib,
argparse,hashlib,json,struct,math, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-charge-arrival-v56.py](#tools-verify-native-charge-arrival-
v56-py)

**Invocation**

```text
`python tools/verify-native-charge-arrival-v56.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib,
argparse,hashlib,json,struct,math, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-charge-terminal-v56.py](#tools-verify-native-charge-termina
l-v56-py)

**Invocation**

```text
`python tools/verify-native-charge-terminal-v56.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib,
argparse,hashlib,json,struct,math, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-combat-v50.py](#tools-verify-native-combat-v50-py)

**Invocation**

```text
`python tools/verify-native-combat-v50.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib,
argparse,hashlib,importlib.util,struct,json, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-concealed-v56.py][test-source-1]

**Invocation**

```text
`python tools/verify-native-concealed-v56.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; argparse,hashlib,json,struct,
pathlib, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-display.py](#tools-verify-native-display-py)

**Invocation**

```text
`python tools/verify-native-display.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; argparse, hashlib, importlib.util,
json, pathlib
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-economy-v49.py](#tools-verify-native-economy-v49-py)

**Invocation**

```text
`python tools/verify-native-economy-v49.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; argparse, hashlib, importlib.util,
json, struct, pathlib, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-equations.py](#tools-verify-native-equations-py)

**Invocation**

```text
`python tools/verify-native-equations.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers;
sys,struct,json,random,importlib.util,argparse, pathlib, unicorn,
unicorn.x86_const, hashlib
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-fire.py](#tools-verify-native-fire-py)

**Invocation**

```text
`python tools/verify-native-fire.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; argparse, hashlib, importlib.util,
json, struct, pathlib, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-joint-v54.py](#tools-verify-native-joint-v54-py)

**Invocation**

```text
`python tools/verify-native-joint-v54.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; node:fs, node:path, node:url,
argparse,hashlib,json,struct,subprocess, pathlib, unicorn, unicorn.x86_const, fs
from 'node:fs';import path from 'node:path';import {pathToFileURL} from
'node:url';
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-messenger-exemption-v53.py](#tools-verify-native-messenger-
exemption-v53-py)

**Invocation**

```text
`python tools/verify-native-messenger-exemption-v53.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
/workspace/scratch/7c8707393eee/messenger-exemption-v53.json; pathlib, sys,json
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-messenger-v53.py][test-source-2]

**Invocation**

```text
`python tools/verify-native-messenger-v53.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
/workspace/scratch/7c8707393eee/messenger-witness-v53.json; pathlib, sys,json
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-reward-v50.py](#tools-verify-native-reward-v50-py)

**Invocation**

```text
`python tools/verify-native-reward-v50.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; argparse, hashlib, importlib.util,
json, struct, pathlib, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-settlement-v56.py][test-source-3]

**Invocation**

```text
`python tools/verify-native-settlement-v56.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib,
argparse,hashlib,json,struct,math, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-tactical-v49.py](#tools-verify-native-tactical-v49-py)

**Invocation**

```text
`python tools/verify-native-tactical-v49.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib,
argparse,hashlib,importlib.util,json,struct, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-treasures.py](#tools-verify-native-treasures-py)

**Invocation**

```text
`python tools/verify-native-treasures.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers;
argparse,importlib.util,json,struct,hashlib, pathlib
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-turn-v52.py](#tools-verify-native-turn-v52-py)

**Invocation**

```text
`python tools/verify-native-turn-v52.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers; pathlib, sys,json
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-native-turns.py](#tools-verify-native-turns-py)

**Invocation**

```text
`python tools/verify-native-turns.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
Inline fixture/state and imported helpers;
argparse,hashlib,importlib.util,json,struct, pathlib, unicorn, unicorn.x86_const
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified

---

**Script**

[tools/verify-original.py](#tools-verify-original-py)

**Invocation**

```text
`python tools/verify-original.py <arguments listed below>`
```

**Declared groups / checkpoints**

```text
Native/static assertion matrix
```

**Shared inputs and dependencies**

```text
main.exe; argparse, hashlib, json, struct, pathlib
```

**Outputs**

Console checkpoints / failure exit and report JSON when specified


<a id="tests-artwork-tests-mjs"></a>
## tests/artwork-tests.mjs

Source: [tests/artwork-tests.mjs](../tests/artwork-tests.mjs). Purpose: full
portrait, event and weather atlas cells preserve their ratio in thirty wide and
tall frames, with centred letterboxing; all 352 officer cells contain distinct
raster images and retain their ratio in the battle portrait frame; five new
full-dimension artworks and every formation/capital cell scale uniformly; all
eight frames retain alpha and distinct content; additional cases below.

Shared inputs: `assets/artwork/portraits.webp`, `assets/artwork/events.webp`,
`assets/artwork/weather.webp`, `assets/artwork/disasters.webp`,
`assets/artwork/omens.webp`, `assets/artwork/stories.webp`,
`assets/artwork/officers-historic-v30.webp`,
`assets/artwork/officers-custom-v49.webp`, `assets/artwork/officers${i}.webp`,
`assets/artwork/${key}-v9.webp`, `assets/artwork/courier.webp`.
Dependencies/entry points: `node:assert/strict`, `node:fs`, `@napi-rs/canvas`,
`../mjs/artwork.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [full portrait, event and weather atlas cells preserve their ratio in thirty
wide and tall frames, with centred
letterboxing][test-source-4]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const sheets={portraits:await
loadImage('assets/artwork/portraits.webp'),events:await
loadImage('assets/artwork/events.webp'),weather:await
loadImage('assets/artwork/weather.webp'),disasters:await
loadImage('assets/artwork/disasters.webp'),omens:await
loadImage('assets/artwork/omens.webp'),stories:await
loadImage('assets/artwork/stories.webp')}; const
dest=process.env.RTK2_QA_ARTIFACT_DIR;if(dest)fs.mkdirSync(dest,{recursive:true}
); for(const [key,image] of Object.entries(sheets))for(const [w,h] of
[[100,120],[510,140],[145,190],[320,200],[720,280]]){ const
canvas=createCanvas(1,1);canvas.getBoundingClientRect=()=>({width:w,height:h});c
onst columns=key==='portraits'?4:2,cell=key==='portraits … (complete
input/procedure at linked L1–19)
```

**Required output / success criteria**

```text
assert(Math.abs(rect.width/rect.height-image.width/image.height)<1e-9,`${key}
distorted in ${w}×${h}`)
assert(rect.width<=canvas.width&&rect.height<=canvas.height)
assert(Math.abs(rect.x*2+rect.width-canvas.width)<1e-9)
assert(Math.abs(rect.y*2+rect.height-canvas.height)<1e-9)
assert.equal(pixel(Math.floor(canvas.width/2),Math.floor(canvas.height/2)),255)
assert.equal(pixel(0,Math.floor(canvas.height/2)),0)
assert.equal(pixel(Math.floor(canvas.width/2),0),0)
```

---

**Case / what it tests**

2. [all 352 officer cells contain distinct raster images and retain their ratio
in the battle portrait frame][test-source-5]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const {createHash}=await import('node:crypto'),{OFFICER_ROSTER}=await
import('../mjs/officer-roster.mjs'),{portraitFrame}=await
import('../mjs/portraits.mjs'); const historicSheet=await
loadImage('assets/artwork/officers-historic-v30.webp'),customSheet=await
loadImage('assets/artwork/officers-custom-v49.webp'); const officerSheets=await
Promise.all(Array.from({length:22},(_,i)=>loadImage(`assets/artwork/officers${i}
.webp`))),hashes=new Set; for(const officer of OFFICER_ROSTER){const
{atlas,cell}=portraitFrame(officer),im=atlas==='officersCustom'?customSheet:atla
s==='officersHistoric'?historicSheet:officerSheets[Number(atlas.slice(8))];;cons
t canvas=createCanvas(1,1);canvas.getBoundingClien … (complete input/procedure
at linked L19–25)
```

**Required output / success criteria**

```text
assert(im)
assert(Math.abs(rect.width/rect.height-im.width/im.height)<1e-9)
assert.equal(canvas.getContext('2d').getImageData(Math.floor(canvas.width/2),Mat
h.floor(canvas.height/2),1,1).data[3],255)
assert(!hashes.has(hash),`Duplicate face for ${officer.name}`)
assert.equal(hashes.size,352)
```

---

**Case / what it tests**

3. [five new full-dimension artworks and every formation/capital cell scale
uniformly; all eight frames retain alpha and distinct
content][test-source-6]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
v9={launch:[1,1],terrain:[4,2],army:[4,2],'china-relief':[1,1],capitals:[4,2]};
for(const [key,[columns,rows]] of Object.entries(v9)){ const image=await
loadImage(`assets/artwork/${key}-v9.webp`),alpha=key==='army'||key==='capitals',
frames=new Set; for(let cell=0;cell<columns*rows;cell++)for(const [width,height]
of [[115,51],[590,393]]){ const
canvas=createCanvas(1,1);canvas.getBoundingClientRect=()=>({width,height});const
rect=paintAtlas(canvas,image,columns,rows,cell,1.5),ratio=image.width/columns/(i
mage.height/rows); ; const
pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data
;; if(alpha){const sw=image.width/columns,sh=image.height/rows,cellCanvas=crea …
(complete input/procedure at linked L25–39)
```

**Required output / success criteria**

```text
assert(Math.abs(rect.width/rect.height-ratio)<1e-9,`${key} frame ${cell} must
scale uniformly`)
assert(pixels.some((v,i)=>i%4===3&&v>0),`${key} frame ${cell} must contain
visible artwork`)
assert(pixel.some((v,i)=>i%4===3&&v===0),`${key} retains transparency`)
assert.equal(frames.size,8,`${key} cells are different poses/capitals`)
```

---

**Case / what it tests**

4. [four transparent mounted courier poses remain distinct and preserve the
native frame ratio][test-source-7]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const courier=await loadImage('assets/artwork/courier.webp'),courierFrames=new
Set; for(let cell=0;cell<4;cell++){const
canvas=createCanvas(1,1);canvas.getBoundingClientRect=()=>({width:170,height:95}
);const rect=paintAtlas(canvas,courier,4,1,cell,1.5);;const
pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data
;;;courierFrames.add(createHash('sha256').update(pixels).digest('hex'));};
```

**Required output / success criteria**

```text
assert(Math.abs(rect.width/rect.height-courier.width/4/courier.height)<1e-9)
assert(pixels.some((v,i)=>i%4===3&&v>0))
assert(pixels.some((v,i)=>i%4===3&&v===0))
assert.equal(courierFrames.size,4)
```


<a id="tests-asset-layout-tests-mjs"></a>
## tests/asset-layout-tests.mjs

Source: [tests/asset-layout-tests.mjs](../tests/asset-layout-tests.mjs).
Purpose: retired media absent; all retained artwork/audio grouped and
byte-identical to original Git blobs; real raster loader and all standalone
history scenes resolve grouped artwork paths; real AudioBus music, native cue
IDs and supported custom effects resolve; silent retired cues request no file;
additional cases below.

Shared inputs: `docs/asset-manifest.json`, `battlefields/province-41-v17.webp`,
`/music/council-music.mp3`, `/sounds/audiomass-horse_gallop.mp3`,
`/charge-shout.mp3`, `config/release.json`. Dependencies/entry points:
`node:fs`, `node:path`, `node:assert/strict`, `node:crypto`, `node:url`,
`../mjs/raster-world.mjs`, `../mjs/history-art.mjs`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [retired media absent; all retained artwork/audio grouped and byte-identical
to original Git blobs][test-source-8]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const root=fileURLToPath(new
URL('../',import.meta.url)),manifest=JSON.parse(fs.readFileSync(path.join(root,'
docs/asset-manifest.json'))); const
walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?wa
lk(path.join(dir,e.name)):[path.join(dir,e.name)]); const exists=p=>; for(const
row of manifest.relocated){exists(row.to);;const
data=fs.readFileSync(path.join(root,row.to));;const
blob=crypto.createHash('sha1').update('blob
'+data.length+'\0').update(data).digest('hex');;} for(const row of
manifest.retired); const
media=walk(path.join(root,'assets')).map(p=>path.relative(root,p).replaceAll(pat
h.sep,'/')).sort();;
```

**Required output / success criteria**

```text
assert(fs.existsSync(path.join(root,p)),p)
assert(!fs.existsSync(path.join(root,row.from)),row.from)
assert.equal(data.length,row.bytes,row.to)
assert.equal(blob,row.gitBlob,row.to)
assert(!fs.existsSync(path.join(root,row.path)),row.path)
assert.deepEqual(media,manifest.relocated.map(r=>r.to).sort())
assert(media.every(p=>/^assets\/(artwork|sounds|music)\//.test(p)));
assert.equal(manifest.totals.retiredBytes,manifest.retired.reduce((n,r)=>n+r.byt
es,0));assert.equal(manifest.totals.relocatedFiles,manifest.relocated.length);
assert.equal(manifest.totals.retiredBytes,manifest.retired.reduce((n,r)=>n+r.byt
es,0))
assert.equal(manifest.totals.relocatedFiles,manifest.relocated.length)
```

---

**Case / what it tests**

2. [real raster loader and all standalone history scenes resolve grouped artwork
paths][test-source-9]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const requests=[];globalThis.Image=class{set
src(value){requests.push(value);queueMicrotask(()=>this.onload());}};await
loadRasterAssets(); for(const year of
HISTORY_YEARS)requests.push(historyArtworkFile('history'+year));requests.push(hi
storyArtworkFile('historyDefault')); for(const url of
requests)exists(url.replace(/^\.\//,''));;;
```

**Required output / success criteria**

```text
assert(requests.some(p=>p.includes('battlefields/province-41-v17.webp')))
assert.equal(requests.filter(p=>p.includes('battlefields/')).length,41)
```

---

**Case / what it tests**

3. [real AudioBus music, native cue IDs and supported custom effects resolve;
silent retired cues request no file][test-source-10]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};
const
audio=[];globalThis.Audio=class{constructor(src){this.src=src;audio.push(src);}p
lay(){return Promise.resolve();}pause(){}}; const bus=new
AudioBus();bus.unlock();bus.setActive(true);for(let
id=0;id<16;id++)bus.playNative(id);for(const cue of
['order','fire','month','message','gallop','flood','locust','typhoon','epidemic'
,'uprising','meteor','death','march','train','trade','recruit','retreat','charge
-shout','sword-attack'])bus.play(cue); const
count=audio.length;bus.play('select');bus.play('battle');;bus.destroy();for(cons
t url of audio)exists(url.replace(/^\.\//,'').split('?')[0]);;;
```

**Required output / success criteria**

```text
assert.equal(audio.length,count)
assert(audio.some(u=>u.includes('/music/council-music.mp3')))
assert(audio.some(u=>u.includes('/sounds/audiomass-horse_gallop.mp3')))
```

---

**Case / what it tests**

4. [concrete source media URLs and release pointers resolve after
relocation][test-source-11]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const dir of ['mjs','tests','tools','config'])for(const file of
walk(path.join(root,dir)).filter(p=>/\.(mjs|py|json|yaml)$/.test(p)&&!p.endsWith
('generate-test-spec.mjs'))){const text=fs.readFileSync(file,'utf8');for(const
match of
text.matchAll(/(?:\.\.\/|\.\/)?assets\/[A-Za-z0-9_./-]+\.(?:webp|png|svg|mp3)/g)
){const
logical=match[0].replace(/^(?:\.\.\/|\.\/)/,'');if(file.endsWith('build-charge-a
udio.py')&&logical.endsWith('/charge-shout.mp3'))continue; // Historical
generator output, not an input. exists(logical);}} const
release=JSON.parse(fs.readFileSync(path.join(root,'config/release.json')));const
checkRefs=v=>{if(typeof
v==='string'&&/^(?:assets|docs)\//.test(v))exists(v.split(' … (complete
input/procedure at linked L18–22)
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

5. [one consolidated version history, unique record anchors and current
sound/test documentation][test-source-12]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
changes=fs.readFileSync(path.join(root,'docs/changes.md'),'utf8'),anchors=[...ch
anges.matchAll(/<a id="([^"]+)"><\/a>/g)].map(m=>m[1]);; for(const file of
walk(path.join(root,'docs')))if(!file.startsWith(path.join(root,'docs','prompts'
)+path.sep)); for(const row of manifest.documentationMigrated){;;;}
;;exists('docs/native_sound.md');exists('docs/test_spec.md');
```

**Required output / success criteria**

```text
assert.equal(anchors.length,new Set(anchors).size)
assert(!/v\d+[^/]*\.(md|html)$/.test(file),file)
assert(!fs.existsSync(path.join(root,row.from)),row.from)
assert(changes.includes(row.gitBlob),row.from)
assert(anchors.includes(row.to.split('#')[1]),row.to)
assert(changes.includes('original Git blob'))
assert(changes.includes('record-fixes-v56'))
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(media.every(p=>/^assets\/(artwork|sounds|music)\//.test(p)));
assert.equal(manifest.totals.retiredBytes,manifest.retired.reduce((n,r)=>n+r.byt
es,0));assert.equal(manifest.totals.relocatedFiles,manifest.relocated.length);
console.log('PASS retired media absent; all retained artwork/audio grouped and
byte-identical to original Git blobs');
const requests=[];globalThis.Image=class{set
src(value){requests.push(value);queueMicrotask(()=>this.onload());}};await
loadRasterAssets();
for(const year of
HISTORY_YEARS)requests.push(historyArtworkFile('history'+year));requests.push(hi
storyArtworkFile('historyDefault'));
for(const url of
requests)exists(url.replace(/^\.\//,''));assert(requests.some(p=>p.includes('bat
tlefields/province-41-v17.webp')));assert.equal(requests.filter(p=>p.includes('b
attlefields/')).length,41);
console.log('PASS real raster loader and all standalone history scenes resolve
grouped artwork paths');
globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};
const
audio=[];globalThis.Audio=class{constructor(src){this.src=src;audio.push(src);}p
lay(){return Promise.resolve();}pause(){}};
const bus=new AudioBus();bus.unlock();bus.setActive(true);for(let
id=0;id<16;id++)bus.playNative(id);for(const cue of
['order','fire','month','message','gallop','flood','locust','typhoon','epidemic'
,'uprising','meteor','death','march','train','trade','recruit','retreat','charge
-shout','sword-attack'])bus.play(cue);
const
count=audio.length;bus.play('select');bus.play('battle');assert.equal(audio.leng
th,count);bus.destroy();for(const url of
audio)exists(url.replace(/^\.\//,'').split('?')[0]);assert(audio.some(u=>u.inclu
des('/music/council-music.mp3')));assert(audio.some(u=>u.includes('/sounds/audio
mass-horse_gallop.mp3')));
console.log('PASS real AudioBus music, native cue IDs and supported custom
effects resolve; silent retired cues request no file');
for(const dir of ['mjs','tests','tools','config'])for(const file of
walk(path.join(root,dir)).filter(p=>/\.(mjs|py|json|yaml)$/.test(p)&&!p.endsWith
('generate-test-spec.mjs'))){const text=fs.readFileSync(file,'utf8');for(const
match of
text.matchAll(/(?:\.\.\/|\.\/)?assets\/[A-Za-z0-9_./-]+\.(?:webp|png|svg|mp3)/g)
){const
logical=match[0].replace(/^(?:\.\.\/|\.\/)/,'');if(file.endsWith('build-charge-a
udio.py')&&logical.endsWith('/charge-shout.mp3'))continue; // Historical
generator output, not an input.
exists(logical);}}
const
release=JSON.parse(fs.readFileSync(path.join(root,'config/release.json')));const
checkRefs=v=>{if(typeof
v==='string'&&/^(?:assets|docs)\//.test(v))exists(v.split('#')[0]);else
if(Array.isArray(v))v.forEach(checkRefs);else if(v&&typeof
v==='object')Object.values(v).forEach(checkRefs);};checkRefs(release);
console.log('PASS concrete source media URLs and release pointers resolve after
relocation');
const
changes=fs.readFileSync(path.join(root,'docs/changes.md'),'utf8'),anchors=[...ch
anges.matchAll(/<a
id="([^"]+)"><\/a>/g)].map(m=>m[1]);assert.equal(anchors.length,new
Set(anchors).size);
for(const file of
walk(path.join(root,'docs')))if(!file.startsWith(path.join(root,'docs','prompts'
)+path.sep))assert(!/v\d+[^/]*\.(md|html)$/.test(file),file);
for(const row of
manifest.documentationMigrated){assert(!fs.existsSync(path.join(root,row.from)),
row.from);assert(changes.includes(row.gitBlob),row.from);assert(anchors.includes
(row.to.split('#')[1]),row.to);}
assert(changes.includes('original Git
blob'));assert(changes.includes('record-fixes-v56'));exists('docs/native_sound.m
d');exists('docs/test_spec.md');
console.log('PASS one consolidated version history, unique record anchors and
current sound/test documentation');
```

<a id="tests-audio-v50-tests-mjs"></a>
## tests/audio-v50-tests.mjs

Source: [tests/audio-v50-tests.mjs](../tests/audio-v50-tests.mjs). Purpose: all
16 catalogued native effect replacements exist and route by bounded ID; province
orders use semantic cues independently of dialogue flow; governance events match
verified native effect IDs and AI council/order semantic cues; additional cases
below.

Shared inputs: `../assets/sounds/native-effect-${id}.mp3`,
`./assets/sounds/march.mp3`,
`./assets/sounds/freesound_community-sword-battle-jingle-loop-96983.mp3`,
`./assets/sounds/message.mp3`, `./assets/sounds/order.mp3`,
`../assets/music/native-music-${id}.mp3`, `./assets/music/council-music.mp3`,
`./assets/music/battle-music-v17.mp3`, `./assets/music/triumph-music.mp3`,
`../docs/native-opl-driver-v50.json`. Dependencies/entry points:
`node:assert/strict`, `node:fs`, `node:crypto`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [all 16 catalogued native effect replacements exist and route by bounded
ID][test-source-13]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const
media=[];globalThis.Audio=class{constructor(src){this.src=src;this.paused=true;t
his.currentTime=0;media.push(this);}play(){this.paused=false;return
Promise.resolve();}pause(){this.paused=true;}}; let
listener;globalThis.document={hidden:false,addEventListener(type,fn){if(type==='
visibilitychange')listener=fn;},removeEventListener(){}}; const bus=new
AudioBus();bus.setActive(true);bus.unlock(); for(let
id=0;id<NATIVE_EFFECT_COUNT;id++){bus.playNative(id);;;} ;const
beforeInvalid=media.length;bus.playNative(16);;
```

**Required output / success criteria**

```text
assert.equal(media.at(-1).src,`./assets/sounds/native-effect-${id}.mp3?v=56`)
assert(fs.statSync(new
URL(`../assets/sounds/native-effect-${id}.mp3`,import.meta.url)).size>1000)
assert.equal(NATIVE_EFFECT_COUNT,16)
assert.equal(media.length,beforeInvalid)
```

---

**Case / what it tests**

2. [province orders use semantic cues independently of dialogue
flow][test-source-14]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const [type,sound]of
[['trainArmy','train'],['trade','trade'],['recruitMethod','recruit'],['moveParty
','march'],['selfExile','retreat'],['diplomaticMission','message'],['relief','or
der']]){;bus.playOrder(type,{});;}
```

**Required output / success criteria**

```text
assert.equal(orderSound(type),'native-effect-14')
assert.equal(media.at(-1).src,'./assets/sounds/native-effect-14.mp3?v=56')
```

---

**Case / what it tests**

3. [governance events match verified native effect IDs and AI council/order
semantic cues][test-source-15]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const [kind,id]of
[['locust',0],['epidemic',1],['typhoon',2],['flood',2],['riot',3],['meteor',4],[
'rebellion',5],['settlement',6],['betrayal',7],['duel',8]]); ;;; for(const
[text,sound]of [['trained the army','train'],['enlisted 500
troops','train'],['bought 400 weapons','trade'],['sold 1000
rice','trade'],['moved to province 4','march'],['searched for
talent','recruit'],['formed an alliance','message'],['rewarded the
governor','order'],['cultivated the fields','order'],['went into
exile','retreat']])for(const kind of ['council','order']);
```

**Required output / success criteria**

```text
assert.equal(eventSound({kind}),`native-effect-${id}`)
assert.equal(eventSound({kind:'war',text:'Yellow Turban rebels
attacked.'}),'native-effect-12')
assert.equal(eventSound({kind:'month',text:'Cao Cao has settled in Province
9.'}),'native-effect-6')
assert.equal(eventSound({kind:'month',text:'The people are
rioting!'}),'native-effect-3')
assert.equal(eventSound({kind,text}),'native-effect-14')
```

---

**Case / what it tests**

4. [same AI/human observer suppresses duplicate action audio; charge flashes do
not replay the order cry; each ambush retains its
cue][test-source-16]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
b={lastAction:{type:'move',sequence:1,messageSerial:1},messages:[{serial:1,text:
'Officer moved to 3,4.'}]};bus.playBattle(b,0);;const
count=media.length;bus.playBattle(b,0);;b.lastAction={type:'attack',sequence:2,m
essageSerial:2,combatUnits:[{id:1}]};b.messages.push({serial:2,text:'Officer
attacked.'});bus.playBattle(b,1,true);;bus.playCombat(b.lastAction,1);; const
start=media.length;for(let
cycle=1;cycle<=80;cycle++)bus.playCombat({type:'charge'},cycle);;bus.playCombat(
{type:'ambush'},1);bus.playCombat({type:'ambush'},1);; ;;;
b.messages.push({serial:3,text:'Cao Cao inspected for 100
gold.'});bus.playBattle(b,2);;b.messages.push({serial:4,text:'Deployment reset.
Place this army aga … (complete input/procedure at linked L16–21)
```

**Required output / success criteria**

```text
assert.equal(media.at(-1).src,'./assets/sounds/march.mp3')
assert.equal(media.length,count)
assert.equal(media.length,count)
assert.equal(media.at(-1).src,'./assets/sounds/freesound_community-sword-battle-
jingle-loop-96983.mp3')
assert.equal(media.length-start,0)
assert.equal(media.length-start,2)
assert.equal(battleSound({type:'withdrawArmy'}),'retreat')
assert.equal(battleSound({type:'fireball'}),'fire')
assert.equal(battleSound({type:'challenge'}),'native-effect-8')
assert.equal(media.at(-1).src,'./assets/sounds/message.mp3')
assert.equal(media.at(-1).src,'./assets/sounds/order.mp3')
assert.equal(media.length,stale)
```

---

**Case / what it tests**

5. [independent music/sound, hidden-page stop, courier restart and exit
cleanup][test-source-17]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
bus.setCourierMoving(true);;document.hidden=true;listener();;;;document.hidden=f
alse;listener();;;bus.configure({sound:false,music:true});;;;let
n=media.length;bus.playCombat({type:'ambush'},1);;bus.setCourierMoving(false);bu
s.configure({sound:true,music:false});;bus.playEvent({art:'locust'});;bus.stop()
;;
```

**Required output / success criteria**

```text
assert(bus.courierEffect)
assert(bus.track.paused)
assert.equal(bus.effects.size,0)
assert.equal(bus.courierEffect,null)
assert(!bus.track.paused)
assert(bus.courierEffect)
assert.equal(bus.effects.size,0)
assert.equal(bus.courierEffect,null)
assert(!bus.track.paused)
assert.equal(media.length,n)
assert(bus.track.paused)
assert.equal(media.length,n+1)
assert.equal(bus.effects.size,0)
```

---

**Case / what it tests**

6. [all 21 extracted songs exist; native songs remain archived and the original
council/battle/triumph music is restored without restarting unchanged
music][test-source-18]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const regionIds=[6,6,6,2,2,2,2,5,2,2,4,4,3,5];for(const [region,id]of
regionIds.entries()){;;};;;; for(let id=0;id<NATIVE_MUSIC_COUNT;id++);
bus.setActive(true);bus.configure({sound:true,music:true});bus.setTheme('council
',{region:12});;const
same=bus.track;bus.setTheme('council',{region:12});;bus.setTheme('battle',{regio
n:12});;;;bus.setTheme('triumph',null,false);;;bus.setTheme('triumph');;bus.setT
heme('triumph',null,true);;bus.setTheme('clan');;;bus.stop();
```

**Required output / success criteria**

```text
assert.equal(nativeMusicFor('council',region),id)
assert.equal(nativeMusicFor('battle',region),id+5)
assert.equal(nativeMusicFor('triumph',0,true),15)
assert.equal(nativeMusicFor('triumph',0,false),16)
assert.equal(nativeMusicFor('clan'),14)
assert.equal(NATIVE_MUSIC_COUNT,21)
assert(fs.statSync(new
URL(`../assets/music/native-music-${id}.mp3`,import.meta.url)).size>1000)
assert.equal(bus.track.src,'./assets/music/council-music.mp3')
assert.equal(bus.track,same)
assert(same.paused)
assert.equal(bus.track.src,'./assets/music/battle-music-v17.mp3')
assert(bus.track.loop)
assert.equal(bus.track.src,'./assets/music/triumph-music.mp3')
assert(!bus.track.loop)
assert.equal(bus.track.src,'./assets/music/triumph-music.mp3')
assert.equal(bus.track.src,'./assets/music/triumph-music.mp3')
assert.equal(bus.track.src,'./assets/music/council-music.mp3')
assert(bus.track.loop)
```

---

**Case / what it tests**

7. [all driver-rendered assets match complete-duration, non-silent decoded media
and SHA-256 provenance without invented loop
endpoints][test-source-19]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const driver=JSON.parse(fs.readFileSync(new
URL('../docs/native-opl-driver-v50.json',import.meta.url),'utf8'));;;;;for(const
row of driver.media){const data=fs.readFileSync(new
URL('../assets/'+(row.file.startsWith('native-music-')?'music/':'sounds/')+row.f
ile,import.meta.url));;;;;;}
```

**Required output / success criteria**

```text
assert.equal(driver.driver.signature,'OPLDRV')
assert.equal(driver.media.length,37)
assert.equal(driver.checks.originalMusicIdsCaptured,21)
assert.equal(driver.checks.originalEffectIdsCaptured,16)
assert.equal(data.length,row.bytes)
assert.equal(crypto.createHash('sha256').update(data).digest('hex'),row.sha256)
assert(Math.abs(row.captureSeconds-row.decodedSeconds)<.03)
assert(row.decodedPeak>0&&row.decodedRms>0)
assert.equal(row.loopSamples,null)
```


<a id="tests-audio-v52-tests-mjs"></a>
## tests/audio-v52-tests.mjs

Source: [tests/audio-v52-tests.mjs](../tests/audio-v52-tests.mjs). Purpose:
restored remaster governance/battle loops are stable across province regions;
combat without queued animation plays once instead of silently deferring
forever; successful/failed fireballs and animated melee use the unlocked cached
sound session; additional cases below.

Shared inputs: `./assets/music/council-music.mp3`,
`./assets/music/battle-music-v17.mp3`, `./assets/music/triumph-music.mp3`,
`audiomass-charge_scream.mp3`,
`freesound_community-sword-battle-jingle-loop-96983.mp3`, `/fire.mp3`,
`/trade.mp3`, `./assets/sounds/trade.mp3`. Dependencies/entry points:
`node:assert/strict`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [restored remaster governance/battle loops are stable across province
regions][test-source-20]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const flush=async()=>{for(let n=0;n<8;n++)await Promise.resolve();}; const
listeners=new Map(),media=[],sources=[],chunks=new Map(),fetches=[];let
notices=[];
globalThis.document={hidden:false,addEventListener(type,fn){listeners.set(type,f
n);},removeEventListener(type){listeners.delete(type);}};
globalThis.Audio=class{constructor(src){this.src=src;this.paused=true;this.curre
ntTime=0;media.push(this);}play(){this.paused=false;return
Promise.resolve();}pause(){this.paused=true;}};
globalThis.AudioContext=class{constructor(){this.state='suspended';this.destinat
ion={};}resume(){this.state='running';return
Promise.resolve();}close(){this.state='closed';return
Promise.resolve();}decodeAudioData(da … (complete input/procedure at linked
L1–10)
```

**Required output / success criteria**

```text
assert.equal(bus.track.src,'./assets/music/council-music.mp3')
assert.equal(bus.track,council)
assert(council.paused)
assert.equal(bus.track.src,'./assets/music/battle-music-v17.mp3')
assert(bus.track.loop)
assert.equal(bus.track.src,'./assets/music/triumph-music.mp3')
assert(!bus.track.loop)
assert.equal(bus.track.src,'./assets/music/council-music.mp3')
```

---

**Case / what it tests**

2. [combat without queued animation plays once instead of silently deferring
forever][test-source-21]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const type of ['attack','simultaneous','charge']){const
b={lastAction:{type,sequence:1,messageSerial:1,combatUnits:[{id:1}]},messages:[{
serial:1,text:'Resolved
combat'}]},before=sources.length;bus.playBattle(b,0,false);await
flush();;;bus.playBattle(b,0,false);await flush();;}
```

**Required output / success criteria**

```text
assert.equal(sources.length,before+1)
assert(sources.slice(before).some(s=>s.buffer.src.includes(type==='charge'?'audi
omass-charge_scream.mp3':'freesound_community-sword-battle-jingle-loop-96983.mp3
')))
assert.equal(sources.length,before+1)
```

---

**Case / what it tests**

3. [successful/failed fireballs and animated melee use the unlocked cached sound
session][test-source-22]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const result of ['success','failed']){const
b={lastAction:{type:'fireball',sequence:1,messageSerial:1},messages:[{serial:1,t
ext:'Fireball '+result}]},before=sources.length;bus.playBattle(b,0,true);await
flush();;;} const
b={lastAction:{type:'attack',sequence:1,messageSerial:1,combatUnits:[{id:1}]},me
ssages:[{serial:1,text:'Attacked'}]},before=sources.length;bus.playBattle(b,0,tr
ue);await flush();;bus.playCombat(b.lastAction,1);await flush();;;
```

**Required output / success criteria**

```text
assert.equal(sources.length,before+1)
assert(sources.at(-1).buffer.src.endsWith('/fire.mp3'))
assert.equal(sources.length,before)
assert.equal(sources.length,before+1)
assert.equal(fetches.filter(url=>url.includes('freesound_community-sword-battle-
jingle-loop-96983.mp3')).length,1)
```

---

**Case / what it tests**

4. [overlapping combat voices stay bounded while decoding each asset only
once][test-source-23]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const repeated=sources.length;for(let
n=0;n<20;n++)bus.playCombat({type:'simultaneous'},1);await flush();;;;
```

**Required output / success criteria**

```text
assert.equal(sources.length,repeated+8)
assert(bus.effects.size<=8)
assert(sources.slice(0,repeated).every(s=>s.stopped))
```

---

**Case / what it tests**

5. [muted/hidden/stopped pending effects cannot start late and playback failures
are visible][test-source-24]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; let resolveTrade;globalThis.fetch=url=>url.endsWith('/trade.mp3')?new
Promise(resolve=>{resolveTrade=resolve;}):Promise.resolve({ok:false});const
pending=sources.length;bus.play('trade');bus.configure({sound:false,music:true})
;const trade=new
ArrayBuffer(4);chunks.set(trade,'./assets/sounds/trade.mp3');resolveTrade({ok:tr
ue,arrayBuffer:async()=>trade});await
flush();;;bus.configure({sound:true,music:false});;bus.play('fire');document.hid
den=true;listeners.get('visibilitychange')();await
flush();;document.hidden=false;listeners.get('visibilitychange')();bus.play('rec
ruit');await flush();;;bus.destroy();;
```

**Required output / success criteria**

```text
assert.equal(sources.length,pending)
assert.equal(bus.effects.size,0)
assert(bus.track.paused)
assert.equal(sources.length,pending)
assert.equal(notices.length,1)
assert(bus.audioError)
assert.equal(bus.context.state,'closed')
```

---

**Case / what it tests**

6. [HTML audio fallback reports blocked playback instead of silently swallowing
errors][test-source-25]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; delete globalThis.AudioContext;globalThis.fetch=async()=>({ok:false});const
oldPlay=globalThis.Audio.prototype.play;globalThis.Audio.prototype.play=function
(){if(this.src.includes('native-effect-13'))return
Promise.reject(Object.assign(Error('Blocked'),{name:'NotAllowedError'}));return
oldPlay.call(this);};const fallback=new
AudioBus();notices=[];fallback.notice=text=>notices.push(text);fallback.unlock()
;fallback.setActive(true);fallback.playNative(13);await
flush();;;fallback.destroy();
```

**Required output / success criteria**

```text
assert.equal(notices.length,1)
assert.equal(fallback.audioError,'NotAllowedError')
```


<a id="tests-audio-v53-tests-mjs"></a>
## tests/audio-v53-tests.mjs

Source: [tests/audio-v53-tests.mjs](../tests/audio-v53-tests.mjs). Purpose:
BUG-53-02 Charge adds one distinct supplied cry; Normal uses the supplied sword
clip without duplicates; BUG-53-08 outbound and returning messenger motion use
supplied gallop; stationary motion stops and loops cannot duplicate; BUG-53-08
supplied messenger stops when muted, hidden or destroyed.

Shared inputs: `audiomass-horse_gallop.mp3`. Dependencies/entry points:
`node:assert/strict`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-53-02 Charge adds one distinct supplied cry; Normal uses the supplied
sword clip without duplicates][test-source-26]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const flush=async()=>{for(let n=0;n<8;n++)await Promise.resolve();}; const
listeners=new Map(),media=[],sources=[],chunks=new Map(),fetches=[];let
notices=[];
globalThis.document={hidden:false,addEventListener(type,fn){listeners.set(type,f
n);},removeEventListener(type){listeners.delete(type);}};
globalThis.Audio=class{constructor(src){this.src=src;this.paused=true;this.curre
ntTime=0;media.push(this);}play(){this.paused=false;return
Promise.resolve();}pause(){this.paused=true;}};
globalThis.AudioContext=class{constructor(){this.state='suspended';this.destinat
ion={};}resume(){this.state='running';return
Promise.resolve();}close(){this.state='closed';return
Promise.resolve();}decodeAudioData(da … (complete input/procedure at linked
L1–11)
```

**Required output / success criteria**

```text
assert.equal(sources.length,before+(type==='charge'?1:0))
assert(sources.at(-1).buffer.src.includes('audiomass-charge_scream'))
assert(sources.at(-1).buffer.src.includes(type==='charge'?'audiomass-charge_scre
am':'freesound_community-sword-battle-jingle-loop-96983'))
assert.equal(sources.length,count)
```

---

**Case / what it tests**

2. [BUG-53-08 outbound and returning messenger motion use supplied gallop;
stationary motion stops and loops cannot
duplicate][test-source-27]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const direction of ['outbound','return']){bus.setCourierMoving(true);const
loop=bus.courierEffect;;;bus.setCourierMoving(true);;bus.setCourierMoving(false)
;;;}
```

**Required output / success criteria**

```text
assert(loop.src.includes('audiomass-horse_gallop.mp3'))
assert(loop.loop&&!loop.paused)
assert.equal(bus.courierEffect,loop)
assert(loop.paused)
assert.equal(bus.courierEffect,null)
```

---

**Case / what it tests**

3. [BUG-53-08 supplied messenger stops when muted, hidden or
destroyed][test-source-28]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; bus.setCourierMoving(true);const
loop=bus.courierEffect;document.hidden=true;listeners.get('visibilitychange')();
;document.hidden=false;listeners.get('visibilitychange')();;bus.configure({sound
:false,music:true});;bus.destroy();
```

**Required output / success criteria**

```text
assert(loop.paused&&!bus.courierEffect)
assert(bus.courierEffect)
assert(!bus.courierEffect)
```


<a id="tests-audio-v55-tests-mjs"></a>
## tests/audio-v55-tests.mjs

Source: [tests/audio-v55-tests.mjs](../tests/audio-v55-tests.mjs). Purpose:
BUG-55-01 Normal/Simultaneous use supplied sword file through fallback and every
animated participant, without replay; BUG-55-02 supplied charge cry plays once
per order; 80 charge flashes and re-observation add no old hits; BUG-55-03
supplied gallop loops only during outward/return movement and stops for
stationary, mute, hide and exit; additional cases below.

Shared inputs: `freesound_community-sword-battle-jingle-loop-96983.mp3`,
`audiomass-charge_scream.mp3`, `audiomass-horse_gallop.mp3`,
`/native-effect-13.mp3`, `/fire.mp3`, `./assets/music/council-music.mp3`,
`./assets/music/battle-music-v17.mp3`, `./assets/music/triumph-music.mp3`.
Dependencies/entry points: `node:assert/strict`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-55-01 Normal/Simultaneous use supplied sword file through fallback and
every animated participant, without
replay][test-source-29]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-55-01 Normal/Simultaneous use supplied sword file through fallback and
every animated participant, without replay',async bus=>{ for(const type of
['attack','simultaneous']){const
b={lastAction:{type,sequence:1,messageSerial:1,combatUnits:[{id:1},{id:2}]},mess
ages:[{serial:1,text:'Resolved'}]},before=sources.length;bus.playBattle(b,0,true
);await flush();;for(let
i=0;i<(type==='simultaneous'?3:1);i++){bus.playCombat(b.lastAction,1);await
flush();;const once=sources.length;for(let
cycle=2;cycle<=8;cycle++)bus.playCombat(b.lastAction,cycle);await
flush();;}const end=sources.length;bus.playBattle(b,0,true);await flush();;const
fallback={lastAction:{type,sequence:1,messageSerial:1},messa … (complete
input/procedure at linked L11–14)
```

**Required output / success criteria**

```text
assert.equal(sources.length,before)
assert(sources.at(-1).buffer.src.endsWith('/'+sword))
assert.equal(sources.length,once)
assert.equal(sources.length,end)
assert(sources.at(-1).buffer.src.endsWith('/'+sword))
assert.equal(fetches.filter(url=>url.endsWith('/'+sword)).length,1)
```

---

**Case / what it tests**

2. [BUG-55-02 supplied charge cry plays once per order; 80 charge flashes and
re-observation add no old hits][test-source-30]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-55-02 supplied charge cry plays once per order; 80 charge flashes and
re-observation add no old hits',async bus=>{ for(const animated of
[true,false]){const
b={lastAction:{type:'charge',sequence:1,messageSerial:1,combatUnits:[{id:1},{id:
2}],exchanges:10},messages:[{serial:1,text:'Charged'}]},before=sources.length;bu
s.playBattle(b,0,animated);await flush();;;for(let
cycle=1;cycle<=80;cycle++)bus.playCombat(b.lastAction,cycle);bus.playBattle(b,0,
animated);await flush();;} })
```

**Required output / success criteria**

```text
assert.equal(sources.length,before+1)
assert(sources.at(-1).buffer.src.endsWith('/'+charge))
assert.equal(sources.length,before+1)
```

---

**Case / what it tests**

3. [BUG-55-03 supplied gallop loops only during outward/return movement and
stops for stationary, mute, hide and exit][test-source-31]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-55-03 supplied gallop loops only during outward/return movement and
stops for stationary, mute, hide and exit',async bus=>{ for(const leg of
['outbound','return']){bus.setCourierMoving(true);const
a=bus.courierEffect;;;bus.setCourierMoving(true);;bus.playCombat({type:'attack'}
,1);await flush();;;bus.setCourierMoving(false);;}
bus.setCourierMoving(true);const
a=bus.courierEffect;bus.configure({sound:false,music:true});;bus.configure({soun
d:true,music:false});;document.hidden=true;listeners.get('visibilitychange')();;
document.hidden=false;listeners.get('visibilitychange')();;bus.stop();; })
```

**Required output / success criteria**

```text
assert(a.src.endsWith('/'+horse),leg)
assert(a.loop&&!a.paused)
assert.equal(bus.courierEffect,a)
assert.equal(bus.courierEffect,a)
assert(!a.paused)
assert(a.paused&&!bus.courierEffect)
assert(a.paused&&!bus.courierEffect)
assert(bus.track.paused&&bus.courierEffect)
assert(!bus.courierEffect)
assert(bus.courierEffect)
assert(!bus.courierEffect&&bus.effects.size===0)
```

---

**Case / what it tests**

4. [BUG-55-01/02 unrelated Ambush, Fireball, silent menus and original remaster
BGM retain their routes][test-source-32]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-55-01/02 unrelated Ambush, Fireball, silent menus and original
remaster BGM retain their routes',async bus=>{
bus.playCombat({type:'ambush'},1);await
flush();;bus.playBattle({lastAction:{type:'fireball',sequence:1,messageSerial:1}
,messages:[{serial:1,text:'Fireball failed'}]},0,true);await flush();;const
n=sources.length;bus.play('select');await flush();;;;; })
```

**Required output / success criteria**

```text
assert(sources.at(-1).buffer.src.includes('/native-effect-13.mp3'))
assert(sources.at(-1).buffer.src.endsWith('/fire.mp3'))
assert.equal(sources.length,n)
assert.equal(bus.tracks.council.src,'./assets/music/council-music.mp3')
assert.equal(bus.tracks.battle.src,'./assets/music/battle-music-v17.mp3')
assert.equal(bus.tracks.triumph.src,'./assets/music/triumph-music.mp3')
```

---

**Case / what it tests**

5. [BUG-55-01/02 supplied combat clips also route through HTML audio when Web
Audio is unavailable][test-source-33]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-55-01/02 supplied combat clips also route through HTML audio when Web
Audio is unavailable',async bus=>{ for(const [type,file]of
[['attack',sword],['simultaneous',sword],['charge',charge]]){bus.playBattle({las
tAction:{type,sequence:1,messageSerial:1},messages:[{serial:1,text:'Resolved'}]}
,0,false);await flush();;} })
```

**Required output / success criteria**

```text
assert(media.at(-1).src.endsWith('/'+file))
```


<a id="tests-audio-v56-tests-mjs"></a>
## tests/audio-v56-tests.mjs

Source: [tests/audio-v56-tests.mjs](../tests/audio-v56-tests.mjs). Purpose:
BUG-56-05 unlocked Web Audio plays exact gallop loop even when delayed HTML
playback is denied; BUG-56-05 outward/return moving animation clock starts loop
and stops at 650ms, interception, proposal, stale route and exit; BUG-56-05
delayed decode cannot start after motion cancelled or page hidden; additional
cases below.

Shared inputs: `audiomass-horse_gallop.mp3`. Dependencies/entry points:
`node:assert/strict`, `node:url`, `../mjs/courier-motion.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-56-05 unlocked Web Audio plays exact gallop loop even when delayed HTML
playback is denied][test-source-34]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-05 unlocked Web Audio plays exact gallop loop even when delayed
HTML playback is denied',async bus=>{const
before=media.filter(a=>a.src.endsWith(horse)).reduce((n,a)=>n+a.plays,0);bus.set
CourierMoving(true);await flush();const
s=sources.at(-1);;;;;bus.setCourierMoving(true);await
flush();;bus.setCourierMoving(false);;})
```

**Required output / success criteria**

```text
assert(s?.buffer.src.endsWith(horse))
assert(s.loop)
assert.equal(s.gain.gain.value,1)
assert.equal(media.filter(a=>a.src.endsWith(horse)).reduce((n,a)=>n+a.plays,0),b
efore)
assert.equal(sources.at(-1),s)
assert(s.stopped)
```

---

**Case / what it tests**

2. [BUG-56-05 outward/return moving animation clock starts loop and stops at
650ms, interception, proposal, stale route and
exit][test-source-35]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-05 outward/return moving animation clock starts loop and stops at
650ms, interception, proposal, stale route and exit',async bus=>{for(const phase
of ['outbound','return']){const
g={s:{journey:{phase,legs:[{route:[9,8],index:1}],leg:0}},journeyMotion:{from:9,
to:8,start:1000}};for(const [time,moving]of
[[999,false],[1000,true],[1325,true],[1649,true],[1650,false]]){const
motion=courierMotion(g,time);;bus.setCourierMoving(motion.moving);await
flush();;}for(const flag of
['interception','proposal']){g.s.journey[flag]={};;delete
g.s.journey[flag];}g.s.journey.legs[0].index=0;;g.s.journey=null;;}bus.setCourie
rMoving(true);await flush();const s=sources.at(-1);bus.stop();;})
```

**Required output / success criteria**

```text
assert.equal(motion.moving,moving)
assert.equal(!!bus.courierEffect,moving)
assert(!courierMotion(g,1200).moving)
assert(!courierMotion(g,1200).moving)
assert(!courierMotion(g,1200).moving)
assert(s.stopped&&!bus.courierEffect)
```

---

**Case / what it tests**

3. [BUG-56-05 delayed decode cannot start after motion cancelled or page
hidden][test-source-36]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-05 delayed decode cannot start after motion cancelled or page
hidden',async bus=>{;const
before=sources.length;bus.setCourierMoving(true);bus.setCourierMoving(false);dec
odeReady();await
flush();;bus.setCourierMoving(true);document.hidden=true;listeners.get('visibili
tychange')();await flush();;})
```

**Required output / success criteria**

```text
assert(decodeReady)
assert.equal(sources.length,before)
assert.equal(sources.length,before)
```

---

**Case / what it tests**

4. [BUG-56-05 decode/fetch failure clears pending loop and permits retry without
duplicate voices][test-source-37]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-05 decode/fetch failure clears pending loop and permits retry
without duplicate voices',async
bus=>{bus.buffers.delete('gallop');failFetch=true;bus.setCourierMoving(true);awa
it flush();;bus.setCourierMoving(true);await flush();;const
s=bus.courierEffect.source;bus.configure({sound:false,music:true});;})
```

**Required output / success criteria**

```text
assert.equal(bus.courierEffect,null)
assert(bus.courierEffect?.source?.loop)
assert(s.stopped)
```

---

**Case / what it tests**

5. [BUG-56-05 HTML fallback uses exact moving gallop; mute/background/destroy
pause it][test-source-38]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-05 HTML fallback uses exact moving gallop; mute/background/destroy
pause it',async bus=>{bus.setCourierMoving(true);const
a=media.at(-1);;bus.configure({sound:false});;bus.configure({sound:true});const
next=media.at(-1);document.hidden=true;listeners.get('visibilitychange')();;docu
ment.hidden=false;listeners.get('visibilitychange')();const
final=media.at(-1);bus.destroy();;})
```

**Required output / success criteria**

```text
assert(a.src.endsWith(horse)&&a.loop&&!a.paused)
assert(a.paused)
assert(next.paused)
assert(final.paused)
```


<a id="tests-battle-tests-mjs"></a>
## tests/battle-tests.mjs

Source: [tests/battle-tests.mjs](../tests/battle-tests.mjs). Purpose: Hex
geometry provides six vertical and diagonal directions for both column parities;
All 41 original province terrain layouts are retained exactly; Deployment
highlights passable edge hexes for attackers and rejects illegal placements
atomically; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `../mjs/geography.mjs`,
`../mjs/battle-presentation.mjs`, `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Hex geometry provides six vertical and diagonal directions for both column
parities][test-source-39]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hex geometry provides six vertical and diagonal directions for both column
parities',()=>{for(const q of [5,6]){const ns=neighbors(q,6);;;for(const n of
ns);};})
```

**Required output / success criteria**

```text
assert.equal(ns.length,6)
assert.deepEqual(ns,DIRECTIONS.map((_,i)=>direction(q,6,i)))
assert.equal(distance({q,r:6},n),1)
assert.equal(distance({q:6,r:6},{q:7,r:7}),2)
```

---

**Case / what it tests**

2. [All 41 original province terrain layouts are retained
exactly][test-source-40]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All 41 original province terrain layouts are retained exactly',()=>{const
g=fresh();for(const p of g.s.provinces){const
source=g.province(p.neighbors[0]);if(source.owner===255)source.owner=0;if(p.owne
r===255)p.owner=1;const id=source.officers[0]??0;;}})
```

**Required output / success criteria**

```text
assert.deepEqual(spawnBattle(g,source,p,[id],20000,terrains[p.id-1]).terrain,ter
rains[p.id-1])
```

---

**Case / what it tests**

3. [Deployment highlights passable edge hexes for attackers and rejects illegal
placements atomically][test-source-41]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Deployment highlights passable edge hexes for attackers and rejects
illegal placements atomically',()=>{const
g=begin(fresh(),[0,34],false),b=g.s.battle,u=b.units[0],before=JSON.stringify(b)
;;;for(const cell of placementCells(b,'attack')){;;};;;const
cell=placementCells(b,'attack')[0];g.battleAction('place',{unit:u.id,...cell});;
;validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert.equal(b.phase,'deployment')
assert(b.units.every(u=>!u.placed&&u.mobility===dailyMobility(g.officer(u.id).tr
aining)))
assert(entryEdge(cell.q,cell.r,b.entryDirection,b.target))
assert(Number.isFinite(terrainCost(b.terrain[cell.r*13+cell.q])))
assert.throws(()=>g.battleAction('place',{unit:u.id,q:6,r:6}))
assert.throws(()=>g.battleAction('deploy'))
assert.equal(JSON.stringify(b),before)
assert(u.placed)
assert.equal(u.mobility,dailyMobility(g.officer(u.id).training))
```

---

**Case / what it tests**

4. [Both armies finish placement before defender-first combat; deployment saves
restore][test-source-42]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Both armies finish placement before defender-first combat; deployment
saves restore',()=>{const
g=begin(fresh(),[0,34],false);while(g.s.battle.phase==='deployment'&&g.s.battle.
side==='attack')aiBattle(g,60);;;;const h=new
Game(validateSave(g.s,scenarios,g.terrains),{},g.terrains);;while(g.s.battle.pha
se==='deployment')aiBattle(g,60);;;;;})
```

**Required output / success criteria**

```text
assert.equal(g.s.battle.side,'defend')
assert.equal(g.s.battle.phase,'deployment')
assert.equal(g.s.battle.messages.at(-1).text,'Defender’s turn')
assert.deepEqual(h.s.battle,g.s.battle)
assert.equal(g.s.battle.day,1)
assert.equal(g.s.battle.side,'defend')
assert.equal(g.s.battle.messages.at(-1).text,'Defender’s turn')
assert(g.s.battle.units.every(u=>u.placed))
```

---

**Case / what it tests**

5. [Defender-first days update stores, fire and weather only after both armies
finish][test-source-43]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defender-first days update stores, fire and weather only after both armies
finish',()=>{ const
g=begin(),b=g.s.battle,u=b.units[0];b.food={attack:1000000,defend:1000000};b.wea
ther='sunny';b.fire={[u.r*13+u.q]:3};b.wind=0;g.random=()=>.5; const
food={...b.food},men=u.soldiers;g.battleAction('end');;;;;;;;
g.battleAction('end');;;;;;;;;;validateSave(g.s,scenarios,g.terrains); })
```

**Required output / success criteria**

```text
assert.equal(b.side,'attack')
assert.equal(b.day,1)
assert.equal(b.completedDays,0)
assert.deepEqual(b.food,food)
assert.equal(u.soldiers,men)
assert.equal(b.fire[u.r*13+u.q],3)
assert.equal(b.messages.at(-1).text,'Attacker’s turn')
assert.equal(b.side,'defend')
assert.equal(b.day,2)
assert.equal(b.completedDays,1)
assert(b.food.attack<food.attack&&b.food.defend<food.defend)
assert(u.soldiers<men)
assert.equal(b.fire[u.r*13+u.q],2)
assert.equal(b.messages.at(-1).text,'Defender’s turn')
assert(living(b).filter(u=>u.side==='defend').every(u=>!u.ordered))
assert(living(b).filter(u=>u.side==='attack').every(u=>u.ordered))
```

---

**Case / what it tests**

6. [Defender-first warfare suspends after 30 full days and resumes with the
defender][test-source-44]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defender-first warfare suspends after 30 full days and resumes with the
defender',()=>{ const
g=begin(),b=g.s.battle;b.food={attack:1000000,defend:1000000};g.s.monthlyReview=
null;g.random=()=>.5; for(let
day=1;day<=30;day++){;;g.battleAction('end');;;;g.battleAction('end');}
;;;b.resumeMonth=g.s.year*12+g.s.month-1;;;;;;validateSave(g.s,scenarios,g.terra
ins); })
```

**Required output / success criteria**

```text
assert.equal(b.side,'defend')
assert.equal(b.day,day)
assert.equal(b.side,'attack')
assert.equal(b.day,day)
assert(!b.suspended)
assert(b.suspended)
assert.equal(b.completedDays,30)
assert.equal(g.s.battle,null)
assert(g.resumeWars())
assert.equal(b.side,'defend')
assert.equal(b.day,1)
assert.equal(b.completedDays,0)
assert(living(b).every(u=>!u.ordered))
```

---

**Case / what it tests**

7. [Mid-combat legacy saves retain their attacker-first cycle; invalid turn
order is rejected][test-source-45]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Mid-combat legacy saves retain their attacker-first cycle; invalid turn
order is rejected',()=>{ const {g,b}=arena();delete b.firstSide;const h=new
Game(validateSave(g.s,scenarios,g.terrains),{},g.terrains);h.battleAction('end')
;;;h.battleAction('end');;;validateSave(h.s,scenarios,h.terrains);const
bad=structuredClone(h.s);bad.battle.firstSide='unknown';; })
```

**Required output / success criteria**

```text
assert.equal(h.s.battle.side,'defend')
assert.equal(h.s.battle.day,1)
assert.equal(h.s.battle.side,'attack')
assert.equal(h.s.battle.day,2)
assert.throws(()=>validateSave(bad,scenarios,h.terrains),/turn order/)
```

---

**Case / what it tests**

8. [Read-only status playback names the acting general before action and
casualty messages][test-source-46]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Read-only status playback names the acting general before action and
casualty messages',()=>{ const
{g,b,u,v}=arena();Object.assign(u,{q:6,r:5,int:89});Object.assign(v,{q:6,r:7});b
.terrain[v.r*13+v.q]=1;const
serial=b.eventSerial;g.random=()=>.5;g.battleAction('move',{unit:u.id,q:6,r:6});
const
before=JSON.stringify(g.s),items=battleStatusMessages(b,serial,id=>g.officer(id)
.name);;;;;; const next=b.eventSerial;g.battleAction('end');const
ended=battleStatusMessages(b,next,id=>g.officer(id).name,true);for(const m of
b.messages.filter(m=>m.serial>next&&m.turnUnit!==undefined)){const
index=ended.findIndex(x=>x.text===m.text);;};; const
rejected=JSON.stringify(g.s);;; })
```

**Required output / success criteria**

```text
assert.equal(items[0].text,g.officer(u.id).name+'’s turn')
assert(items.some(x=>x.text.includes('ambushed')))
assert(items.some(x=>x.text.includes('moved')))
assert.equal(JSON.stringify(g.s),before)
assert.deepEqual(battleStatusMessages(b,b.eventSerial,id=>g.officer(id).name),[]
)
assert.equal(ended[index-1].text,g.officer(m.turnUnit).name+'’s turn')
assert.equal(ended.at(-2).text,'Defender’s turn')
assert.equal(ended.at(-1).text,g.officer(b.selected).name+'’s turn')
assert.throws(()=>g.battleAction('move',{unit:b.selected,q:-1,r:-1}))
assert.equal(JSON.stringify(g.s),rejected)
```

---

**Case / what it tests**

9. [Personal challenge status announces the responding general before the
result][test-source-47]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Personal challenge status announces the responding general before the
result',()=>{ const {g,b,u,v}=arena();u.war=100;const
serial=b.eventSerial;g.battleAction('challenge',{unit:u.id,target:v.id});;const
response=b.eventSerial;g.battleAction('challengeResponse',{accept:false});; })
```

**Required output / success criteria**

```text
assert.equal(battleStatusMessages(b,serial,id=>g.officer(id).name)[0].text,g.off
icer(u.id).name+'’s turn')
assert.equal(battleStatusMessages(b,response,id=>g.officer(id).name)[0].text,g.o
fficer(v.id).name+'’s turn')
```

---

**Case / what it tests**

10. [AI status names the policy-selected general without announcing a different
selected unit][test-source-48]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI status names the policy-selected general without announcing a different
selected unit',()=>{ const opening=begin(),start=opening.s.battle;; const
{g,b,u,f}=arena();u.war=20;f.war=100;b.selected=u.id;const
serial=b.eventSerial;aiBattle(g,90);;const
snapshot=JSON.stringify(g.s),items=battleStatusMessages(b,serial,id=>g.officer(i
d).name,false);;; })
```

**Required output / success criteria**

```text
assert.deepEqual(battleStatusMessages(start,start.eventSerial-1,id=>opening.offi
cer(id).name,false).map(x=>x.text),['Defender’s turn'])
assert.equal(b.lastAction.unit,f.id)
assert.equal(items[0].text,g.officer(f.id).name+'’s turn')
assert.equal(JSON.stringify(g.s),snapshot)
```

---

**Case / what it tests**

11. [Terrain costs match the requested mobility table and mountains are
impassable][test-source-49]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Terrain costs match the requested mobility table and mountains are
impassable',()=>{;;const {b,u}=arena();u.mobility=100;for(let
r=0;r<12;r++)b.terrain[r*13+8]=3;;})
```

**Required output / success criteria**

```text
assert.deepEqual([0,1,2,4,5,6].map(terrainCost),[2,3,3,5,3,3])
assert.equal(terrainCost(3),Infinity)
assert(!reachable(b,u).some(p=>p.q>8))
```

---

**Case / what it tests**

12. [Normal movement consumes the actual terrain cost and only one daily
order][test-source-50]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Normal movement consumes the actual terrain cost and only one daily
order',()=>{const
{g,b,u}=arena(),move=reachable(b,u).find(p=>p.q===6&&p.r===5);;g.battleAction('m
ove',{unit:u.id,...move});;;const before=JSON.stringify(b);;;})
```

**Required output / success criteria**

```text
assert(move)
assert.equal(u.mobility,0)
assert(u.ordered)
assert.throws(()=>g.battleAction('wait',{unit:u.id}))
assert.equal(JSON.stringify(b),before)
```

---

**Case / what it tests**

13. [Wait holds position, banks one mobility and enables three-point terrain on
the next turn][test-source-51]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Wait holds position, banks one mobility and enables three-point terrain on
the next turn',()=>{const
{g,b,u}=arena();b.terrain[5*13+6]=1;;g.battleAction('wait',{unit:u.id});;;g.batt
leAction('end');g.battleAction('end');;;;})
```

**Required output / success criteria**

```text
assert(!reachable(b,u).some(p=>p.q===6&&p.r===5))
assert.equal(u.mobility,3)
assert.deepEqual({q:u.q,r:u.r},{q:6,r:6})
assert.equal(u.mobility,3)
assert(!u.ordered)
assert(reachable(b,u).some(p=>p.q===6&&p.r===5))
```

---

**Case / what it tests**

14. [Finishing orders makes uncommanded units wait once, without doubling a
chosen Wait][test-source-52]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Finishing orders makes uncommanded units wait once, without doubling a
chosen Wait',()=>{const
{g,b,u,f}=arena();g.battleAction('wait',{unit:u.id});g.battleAction('end');;;;g.
battleAction('end');;;})
```

**Required output / success criteria**

```text
assert.equal(u.mobility,3)
assert.equal(f.mobility,3)
assert.equal(b.day,1)
assert.equal(b.day,2)
assert.equal(u.mobility,3)
```

---

**Case / what it tests**

15. [Attacks use only six adjacent hexes; charge trades larger damage for larger
own losses][test-source-53]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Attacks use only six adjacent hexes; charge trades larger damage for
larger own losses',()=>{const
n=arena(),c=arena();n.g.random=()=>.5;c.g.random=()=>.5;n.g.battleAction('attack
',{unit:n.u.id,target:n.v.id});c.g.battleAction('charge',{unit:c.u.id,target:c.v
.id});;;const x=arena();x.v.q=7;x.v.r=7;;})
```

**Required output / success criteria**

```text
assert(c.v.soldiers<n.v.soldiers)
assert(c.u.soldiers<n.u.soldiers)
assert.throws(()=>x.g.battleAction('attack',{unit:x.u.id,target:x.v.id}))
```

---

**Case / what it tests**

16. [Simultaneous attacks consume the initiator order and preserve each helper
own order][test-source-54]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Simultaneous attacks consume the initiator order and preserve each helper
own order',()=>{const
{g,u,f,v}=arena(),troops=v.soldiers;g.battleAction('simultaneous',{unit:u.id,tar
get:v.id});;;;})
```

**Required output / success criteria**

```text
assert(v.soldiers<troops)
assert(u.ordered&&!f.ordered)
assert.equal(u.mobility,2)
```

---

**Case / what it tests**

17. [Successful and failed fireballs spend only the acting general’s
order][test-source-55]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Successful and failed fireballs spend only the acting general’s
order',()=>{for(const success of [true,false]){const
{g,b,u,f}=arena();b.firstSide='defend';g.random=()=>success?0:.99;const
others=JSON.stringify(b.units.filter(v=>v!==u)),food={...b.food},day=b.day;g.bat
tleAction('fireball',{unit:u.id,q:6,r:5});;;;;;;;g.battleAction('wait',{unit:f.i
d});;;}})
```

**Required output / success criteria**

```text
assert.equal(!!b.fire[5*13+6],success)
assert(u.ordered)
assert.equal(u.orderDay,day)
assert.equal(JSON.stringify(b.units.filter(v=>v!==u)),others)
assert.deepEqual(b.food,food)
assert.equal(b.side,'attack')
assert.equal(b.day,day)
assert(f.ordered)
assert.equal(f.orderDay,day)
```

---

**Case / what it tests**

18. [Simultaneous attacks include helpers that already completed an own
order][test-source-56]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Simultaneous attacks include helpers that already completed an own
order',()=>{const
{g,b,u,f,v}=arena();f.ordered=true;f.orderDay=b.day;g.battleAction('simultaneous
',{unit:u.id,target:v.id});;;;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.exchanges,2)
assert(f.ordered&&f.orderDay===b.day)
assert.throws(()=>g.battleAction('wait',{unit:f.id}))
```

---

**Case / what it tests**

19. [Move enemy moves the actor and may draw an adjacent enemy into the vacated
hex without spending enemy mobility][test-source-57]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Move enemy moves the actor and may draw an adjacent enemy into the vacated
hex without spending enemy mobility',()=>{const
{g,b,u,v}=arena();Object.assign(u,{q:6,r:4,int:90,mobility:5});Object.assign(v,{
q:7,r:4,int:70});g.random=()=>0;const
enemyMP=v.mobility;g.battleAction('moveEnemy',{unit:u.id,target:v.id,q:6,r:5});;
;;;;})
```

**Required output / success criteria**

```text
assert.equal(u.mobility,3)
assert.equal(v.mobility,enemyMP)
assert.equal(v.q,6)
assert.equal(v.r,4)
assert(u.ordered)
```

---

**Case / what it tests**

20. [Friendly View is free; each enemy inspection spends 100 from the field
purse][test-source-58]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Friendly View is free; each enemy inspection spends 100 from the field
purse',()=>{const
{g,b,u,v}=arena(),bank=b.gold,gold=bank.attack;g.battleAction('view',{target:u.i
d});;g.battleAction('view',{target:v.id});g.battleAction('view',{target:v.id});;
;bank.attack=99;const before=JSON.stringify(g.s);;;})
```

**Required output / success criteria**

```text
assert.equal(bank.attack,gold)
assert.equal(bank.attack,gold-200)
assert(!u.ordered)
assert.throws(()=>g.battleAction('view',{target:v.id}))
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

21. [Day-one personal challenge requires the configurable war threshold and
cannot repeat][test-source-59]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Day-one personal challenge requires the configurable war threshold and
cannot repeat',()=>{const
{g,b,u,v}=arena();u.war=79;;u.war=80;b.day=2;b.completedDays=1;;b.day=1;b.comple
tedDays=0;g.battleAction('challenge',{unit:u.id,target:v.id});;;;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.battleAction('challenge',{unit:u.id,target:v.id}))
assert.throws(()=>g.battleAction('challenge',{unit:u.id,target:v.id}))
assert(b.challenge)
assert(u.ordered)
assert.throws(()=>g.battleAction('end'))
```

---

**Case / what it tests**

22. [Refusing a personal challenge causes five-percent desertion across the
responding army][test-source-60]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Refusing a personal challenge causes five-percent desertion across the
responding army',()=>{const
{g,b,u,v,king}=arena();g.battleAction('challenge',{unit:u.id,target:v.id});g.bat
tleAction('challengeResponse',{accept:false});;;;;})
```

**Required output / success criteria**

```text
assert.equal(v.soldiers,4750)
assert.equal(king.soldiers,4750)
assert.equal(u.soldiers,5000)
assert.equal(b.challenge,null)
```

---

**Case / what it tests**

23. [Challenge control passes to the responding human and accepted combat
captures the loser][test-source-61]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Challenge control passes to the responding human and accepted combat
captures the loser',()=>{const
{g,b,u,v}=arena();g.s.humanRulers=[b.attacker,b.defender];u.war=100;v.war=50;g.b
attleAction('challenge',{unit:u.id,target:v.id});;;;validateSave(g.s,scenarios,g
.terrains);g.battleAction('challengeResponse',{accept:true});;;})
```

**Required output / success criteria**

```text
assert.equal(g.battleOwner(),b.defender)
assert(g.battleHuman())
assert.equal(g.aiStep(),false)
assert(v.captured)
assert.equal(g.battleOwner(),b.attacker)
```

---

**Case / what it tests**

24. [Accepted duellists do not receive a second daily order when their army
phase starts][test-source-62]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Accepted duellists do not receive a second daily order when their army
phase starts',()=>{const
{g,b,f,v}=arena();f.war=80;v.war=100;g.battleAction('challenge',{unit:f.id,targe
t:v.id});g.battleAction('challengeResponse',{accept:true});;g.battleAction('end'
);;;})
```

**Required output / success criteria**

```text
assert(v.ordered)
assert.equal(b.side,'defend')
assert(v.ordered)
```

---

**Case / what it tests**

25. [Individual Flee withdraws one unit; commander flight requires confirmation
and withdraws all][test-source-63]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Individual Flee withdraws one unit; commander flight requires confirmation
and withdraws all',()=>{const
{g,b,u,f}=arena(),before=JSON.stringify(b);;;g.random=()=>0;g.battleAction('flee
',{unit:f.id,province:b.source});;;;g.battleAction('flee',{unit:u.id,confirmArmy
:true});;;;validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert.throws(()=>g.battleAction('flee',{unit:u.id}))
assert.equal(JSON.stringify(b),before)
assert(f.fled)
assert(!u.fled)
assert(g.s.battle)
assert(!g.s.battle)
assert.equal(g.s.lastBattle.winner,'defend')
assert(b.units.filter(v=>v.side==='attack').every(v=>v.fled))
```

---

**Case / what it tests**

26. [Palace occupation wins immediately without siege or wall
damage][test-source-64]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Palace occupation wins immediately without siege or wall
damage',()=>{const
{g,b,u}=arena();u.q=12;u.r=10;u.mobility=3;g.battleAction('move',{unit:u.id,q:12
,r:11});;;;validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert.equal(g.s.battle,null)
assert.equal(g.s.lastBattle.reason,'The palace was occupied.')
assert.equal(g.province(b.target).owner,b.attacker)
```

---

**Case / what it tests**

27. [Capturing the ruler wins even when another enemy unit still has
soldiers][test-source-65]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Capturing the ruler wins even when another enemy unit still has
soldiers',()=>{const
{g,b,u,v,king}=arena();Object.assign(king,{q:6,r:5,soldiers:1,war:0});;g.battleA
ction('attack',{unit:u.id,target:king.id});;;;;validateSave(g.s,scenarios,g.terr
ains);})
```

**Required output / success criteria**

```text
assert(v.soldiers>0)
assert(!g.s.battle)
assert.equal(g.s.lastBattle.reason,'The opposing ruler was captured.')
assert.equal(g.officer(king.id).owner,255)
assert.equal(g.officer(king.id).prisonerOf,b.attacker)
```

---

**Case / what it tests**

28. [An army with no soldiers loses; unresolved day 30 suspends warfare without
awarding victory][test-source-66]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An army with no soldiers loses; unresolved day 30 suspends warfare without
awarding victory',()=>{const
x=arena();x.v.soldiers=0;x.king.soldiers=0;x.g.battleAction('wait',{unit:x.u.id}
);;const
{g,b}=arena();b.day=30;b.completedDays=29;g.battleAction('end');;g.battleAction(
'end');;;;;validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert.equal(x.g.s.lastBattle.winner,'attack')
assert(g.s.battle)
assert.equal(g.s.battle,null)
assert.equal(g.s.wars.length,1)
assert.equal(g.s.lastBattle,undefined)
assert.equal(b.day,30)
```

---

**Case / what it tests**

29. [Burning units lose soldiers after their own order, equally for human and
AI][test-source-67]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Burning units lose soldiers after their own order, equally for human and
AI',()=>{const
{g,b,u}=arena();g.random=()=>.5;b.fire[u.r*13+u.q]=3;b.side='defend';g.battleAct
ion('end');;g.battleAction('wait',{unit:u.id});;g.battleAction('end');g.battleAc
tion('end');;g.battleAction('wait',{unit:u.id});;})
```

**Required output / success criteria**

```text
assert.equal(u.soldiers,5000)
assert.equal(u.soldiers,4250)
assert.equal(u.soldiers,4250)
assert.equal(u.soldiers,3613)
```

---

**Case / what it tests**

30. [Legacy strength cannot multiply fire spread beyond the adjacent downwind
hex][test-source-68]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Legacy strength cannot multiply fire spread beyond the adjacent downwind
hex',()=>{const
{g,b}=arena();b.fire={68:3};b.wind=2;b.windStrength=3;b.side='defend';g.random=(
)=>.1;g.int=()=>2;g.battleAction('end');;;;})
```

**Required output / success criteria**

```text
assert(b.fire[55])
assert(!b.fire[42]&&!b.fire[29])
assert.equal(Object.keys(b.fire).length,2)
```

---

**Case / what it tests**

31. [Directional fire does not fan into flank or opposite hexes for either
column parity][test-source-69]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Directional fire does not fan into flank or opposite hexes for either
column parity',()=>{const cycle=[0,1,2,5,4,3];for(const q of [5,6])for(let
i=0;i<6;i++){const
{g,b}=arena(),origin={q,r:5};b.fire={[origin.r*13+origin.q]:3};b.wind=i+1;b.wind
Strength=3;b.side='defend';g.int=()=>i+1;g.battleAction('end');const
c=cycle.indexOf(i),forward=direction(origin.q,origin.r,i);;for(const offset of
[-1,1,3]){const flank=direction(origin.q,origin.r,cycle[(c+offset+6)%6]);;}}})
```

**Required output / success criteria**

```text
assert(b.fire[forward.r*13+forward.q])
assert(!b.fire[flank.r*13+flank.q])
```

---

**Case / what it tests**

32. [Wind uses all six absolute directions; calm and map edges never wrap
fire][test-source-70]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Wind uses all six absolute directions; calm and map edges never wrap
fire',()=>{for(let i=0;i<6;i++){const
{g,b}=arena(),origin={q:3,r:3},index=origin.r*13+origin.q;b.fire={[index]:3};b.w
ind=i+1;b.windStrength=1;b.side='defend';g.int=()=>i+1;g.battleAction('end');con
st cell=direction(origin.q,origin.r,i);;}const
{g,b}=arena();b.fire={38:3};b.wind=6;b.windStrength=3;b.side='defend';g.int=()=>
6;g.battleAction('end');;})
```

**Required output / success criteria**

```text
assert(b.fire[cell.r*13+cell.q])
assert(!b.fire[39])
```

---

**Case / what it tests**

33. [Rain clears every fire immediately and rejects ignition
atomically][test-source-71]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rain clears every fire immediately and rejects ignition
atomically',()=>{const
{g,b,u}=arena();b.fire={12:3,44:2,100:1};g.cheat('battle',u.id,{weather:'rain'})
;;const before=JSON.stringify(g.s);;;validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert.deepEqual(b.fire,{})
assert.throws(()=>g.battleAction('fireball',{unit:u.id,q:6,r:5}))
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

34. [A rainy new day extinguishes the complete fire
map][test-source-72]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A rainy new day extinguishes the complete fire map',()=>{const
{g,b}=arena();b.fire={12:3,44:2,100:1};b.side='defend';g.random=()=>.99;g.battle
Action('end');;;})
```

**Required output / success criteria**

```text
assert.equal(b.weather,'rain')
assert.deepEqual(b.fire,{})
```

---

**Case / what it tests**

35. [Jungle ambush covers the native three forward hexes for both column
parities][test-source-73]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Jungle ambush covers the native three forward hexes for both column
parities',()=>{for(const q of [5,6])for(let d=0;d<6;d++){const
{g,b,u,f,v,king}=arena();const
start={q,r:5},dest=direction(q,5,d),forest=ambushCells(start,dest).find(p=>dista
nce(p,start)>1);;Object.assign(u,start,{mobility:20});Object.assign(v,forest,{mo
bility:0,ordered:true});Object.assign(f,{q:0,r:0});Object.assign(king,{q:0,r:1})
;b.terrain[v.r*13+v.q]=1;const
troops=u.soldiers;g.battleAction('move',{unit:u.id,...dest});;;;;}})
```

**Required output / success criteria**

```text
assert(forest)
assert(u.soldiers<troops)
assert.equal(v.mobility,0)
assert(v.ordered)
assert(b.events.some(t=>t.includes('ambushed')))
```

---

**Case / what it tests**

36. [Ambush fires while traversing a path toward a jungle
defender][test-source-74]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Ambush fires while traversing a path toward a jungle defender',()=>{const
{g,b,u,f,v,king}=arena();Object.assign(u,{q:1,r:5,mobility:20});Object.assign(v,
{q:5,r:5});Object.assign(f,{q:0,r:0});Object.assign(king,{q:0,r:1});b.terrain[v.
r*13+v.q]=1;const
move=reachable(b,u).find(p=>p.path.length>1&&p.path.some(step=>ambushAdjacent(st
ep,v)));;g.battleAction('move',{unit:u.id,...move});;})
```

**Required output / success criteria**

```text
assert(move)
assert.equal(b.events.filter(t=>t.includes('ambushed')).length,1)
```

---

**Case / what it tests**

37. [Reinforcements spend reserve rice, enter legally and settle officers in the
victorious province][test-source-75]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Reinforcements spend reserve rice, enter legally and settle officers in
the victorious province',()=>{const {g,b,u}=arena();const
support=g.province(6);support.owner=b.attacker;for(const id of
support.officers)Object.assign(g.officer(id),{owner:b.attacker,acted:false,soldi
ers:1000});g.normalize();const option=reinforcementOptions(g)[0];;const
bank=g.province(option.province),rice=bank.food,armyRice=b.food.attack;g.battleA
ction('reinforce',{unit:u.id,...option,food:1000});const
unit=b.units.find(v=>v.id===option.officer);;;;;;;validateSave(g.s,scenarios,g.t
errains);b.side='defend';;b.outcome={winner:'attack',reason:'Defending commander
defeated'};g.resolveBattle();;;validateSave(g.s,sce … (complete input/procedure
at linked L66–66)
```

**Required output / success criteria**

```text
assert(option)
assert(unit.placed)
assert(entryEdge(unit.q,unit.r,provinceDirection(g.province(b.target),bank),b.ta
rget))
assert.equal(unit.mobility,2)
assert.equal(bank.food,rice-1000)
assert.equal(b.food.attack,armyRice+1000)
assert(g.officer(unit.id).acted)
assert.throws(()=>g.battleAction('retreat'),/retreat province/)
assert(g.province(b.target).officers.includes(unit.id))
assert(!bank.officers.includes(unit.id))
```

---

**Case / what it tests**

38. [Successful and failed bribes spend gold; successful allegiance survives
settlement][test-source-76]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Successful and failed bribes spend gold; successful allegiance survives
settlement',()=>{const
x=arena(),bank=x.b.gold,gold=bank.attack;x.g.battleAction('bribe',{unit:x.u.id,t
arget:x.v.id,gold:100});;;validateSave(x.g.s,scenarios,x.g.terrains);x.b.side='d
efend';x.b.outcome={winner:'attack',reason:'Defending commander
defeated'};x.g.resolveBattle();;;validateSave(x.g.s,scenarios,x.g.terrains);cons
t y=arena();y.g.random=()=>.999;const
before=y.b.gold.attack;y.g.battleAction('bribe',{unit:y.u.id,target:y.v.id,gold:
100});;;})
```

**Required output / success criteria**

```text
assert.equal(bank.attack,gold-100)
assert.equal(x.v.side,'attack')
assert.equal(x.g.officer(x.v.id).owner,x.b.attacker)
assert(x.g.province(x.b.target).officers.includes(x.v.id))
assert.equal(y.v.side,'defend')
assert.equal(y.b.gold.attack,before-100)
```

---

**Case / what it tests**

39. [Bribery rejects rulers and reinforcement failures leave campaign resources
unchanged][test-source-77]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Bribery rejects rulers and reinforcement failures leave campaign resources
unchanged',()=>{const {g,b,u,king}=arena();const
before=JSON.stringify(g.s);;;;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.battleAction('bribe',{unit:u.id,target:king.id,gold:100}))
assert.throws(()=>g.battleAction('reinforce',{unit:u.id,province:9,officer:34,fo
od:1000}))
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

40. [Viewing defaults resolve remote wars but retain personal defense and All
battles][test-source-78]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Viewing defaults resolve remote wars but retain personal defense and All
battles',()=>{const personal=begin();;const
remote=begin(fresh(),[34],false);;validateSave(remote.s,scenarios,remote.terrain
s);const defend=new
Game(createCampaign(scenarios[1],[0]),{},terrains),target=defend.province(11),so
urce=target.neighbors.map(id=>defend.province(id)).find(p=>p.owner!==255&&p.owne
r!==0&&p.officers.length>1&&p.officers.some(id=>defend.officer(id).soldiers>0));
defend.s.player=source.owner;defend.ruler().alliances=[];source.food=50000;defen
d.invade({province:source.id,target:11,officers:[source.officers.find(id=>defend
.officer(id).soldiers)],food:20000});;;validateSave(defend.s,scenarios,terrai …
(complete input/procedure at linked L69–69)
```

**Required output / success criteria**

```text
assert(personal.battleDetailed())
assert(!remote.s.battle)
assert(!defend.s.battle)
assert(defend.s.lastBattle)
```

---

**Case / what it tests**

41. [All default AI scenarios resolve wars automatically with valid
checkpoints][test-source-79]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All default AI scenarios resolve wars automatically with valid
checkpoints',()=>{let reports=0;for(const scenario of scenarios){const g=new
Game(createCampaign(scenario,[]),{},terrains);g.s.ai.aggression=100;g.s.seed=42;
let last;for(let
i=0;i<500;i++){;;if(g.s.lastBattle!==last){last=g.s.lastBattle;reports++;;}}vali
dateSave(g.s,scenarios,terrains);};})
```

**Required output / success criteria**

```text
assert(g.aiStep())
assert(!g.s.battle)
assert(last.day<=30)
assert(reports>0)
```

---

**Case / what it tests**

42. [Legacy square checkpoints migrate to hex mobility and relocate mountain
positions][test-source-80]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Legacy square checkpoints migrate to hex mobility and relocate mountain
positions',()=>{const
g=begin(),raw=structuredClone(g.s);raw.battle.rulesVersion=2;delete
raw.battle.phase;delete
raw.battle.deployment;raw.battle.city=raw.battle.palace;raw.battle.walls=1000;ra
w.battle.wind=8;for(const u of raw.battle.units){u.ap=2;delete u.mobility;delete
u.placed;}const
mountain=raw.battle.terrain.indexOf(3);if(mountain>=0){raw.battle.units[0].q=mou
ntain%13;raw.battle.units[0].r=Math.floor(mountain/13);}const
loaded=validateSave(raw,scenarios,terrains);;;;const
corrupt=structuredClone(loaded);corrupt.battle.day=31;;const
corruptMap=structuredClone(loaded);corruptMap.battle.terrain[0]=(corruptMap …
(complete input/procedure at linked L71–71)
```

**Required output / success criteria**

```text
assert.equal(loaded.battle.rulesVersion,6)
assert.equal(loaded.battle.wind,6)
assert(loaded.battle.units.every(u=>Number.isFinite(terrainCost(loaded.battle.te
rrain[u.r*13+u.q]))&&u.mobility===2))
assert.throws(()=>validateSave(corrupt,scenarios,terrains))
assert.throws(()=>validateSave(corruptMap,scenarios,terrains))
```

---

**Case / what it tests**

43. [Every original province link chooses the opposite approach and legal
directional edge][test-source-81]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every original province link chooses the opposite approach and legal
directional edge',()=>{const g=fresh(),opposites=[5,4,3,2,1,0];for(const p of
g.s.provinces)for(const id of p.neighbors){const
source=g.province(id),entry=provinceDirection(p,source);;const
b={target:p.id,terrain:terrains[p.id-1],fire:{},units:[],entryDirection:entry};;
;for(const c of placementCells(b,'attack'));}})
```

**Required output / success criteria**

```text
assert.equal(entry,opposites[provinceDirection(source,p)])
assert.equal(b.entryDirection,entry)
assert(placementCells(b,'attack').length)
assert(entryEdge(c.q,c.r,entry,p.id))
```

---

**Case / what it tests**

44. [Charge occupies the defeated enemy hex without consuming normal-move
mobility][test-source-82]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Charge occupies the defeated enemy hex without consuming normal-move
mobility',()=>{const {g,b,u,v}=arena();v.soldiers=1;const
target={q:v.q,r:v.r},mp=u.mobility;g.battleAction('charge',{unit:u.id,target:v.i
d});;;;;validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert.equal(v.soldiers,0)
assert.deepEqual({q:u.q,r:u.r},target)
assert.equal(u.mobility,mp)
assert(u.ordered)
```

---

**Case / what it tests**

45. [Surviving enemies allow a probabilistic straight charge breakthrough in all
six directions][test-source-83]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Surviving enemies allow a probabilistic straight charge breakthrough in
all six directions',()=>{for(const q of [5,6])for(let i=0;i<6;i++){const
{g,b,u,f,v,king}=arena();Object.assign(u,{q,r:6});Object.assign(f,{q:0,r:0});Obj
ect.assign(king,{q:0,r:1});Object.assign(v,direction(u.q,u.r,i));const
beyond=direction(v.q,v.r,i);g.random=()=>0;g.battleAction('charge',{unit:u.id,ta
rget:v.id});;;validateSave(g.s,scenarios,g.terrains);}})
```

**Required output / success criteria**

```text
assert(v.soldiers>0&&!v.routed)
assert.deepEqual({q:u.q,r:u.r},beyond)
```

---

**Case / what it tests**

46. [Charge does not land beyond the enemy on failure, occupied hexes, mountains
or outside the map][test-source-84]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Charge does not land beyond the enemy on failure, occupied hexes,
mountains or outside the map',()=>{for(const blocked of
['chance','friendly','enemy','mountain','outside']){const
{g,b,u,f,v,king}=arena();if(blocked==='chance')g.random=()=>.99;if(blocked==='fr
iendly')Object.assign(f,{q:8,r:7});if(blocked==='enemy')Object.assign(king,{q:8,
r:7});if(blocked==='mountain')b.terrain[7*13+8]=3;if(blocked==='outside'){Object
.assign(u,{q:11,r:6});Object.assign(v,{q:12,r:7});}const
start={q:u.q,r:u.r};g.battleAction('charge',{unit:u.id,target:v.id});;;}})
```

**Required output / success criteria**

```text
assert(v.soldiers>0)
assert.deepEqual({q:u.q,r:u.r},start,blocked)
```

---

**Case / what it tests**

47. [Charge landings trigger jungle ambush and immediate palace
occupation][test-source-85]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Charge landings trigger jungle ambush and immediate palace
occupation',()=>{const
a=arena();Object.assign(a.f,{q:0,r:0});Object.assign(a.king,{q:8,r:8});a.b.terra
in[8*13+8]=1;a.g.battleAction('charge',{unit:a.u.id,target:a.v.id});;const
x=arena();x.v.soldiers=1;x.b.terrain[x.b.palace.r*13+x.b.palace.q]=0;x.b.palace=
{q:x.v.q,r:x.v.r};x.b.terrain[x.v.r*13+x.v.q]=6;x.g.battleAction('charge',{unit:
x.u.id,target:x.v.id});;})
```

**Required output / success criteria**

```text
assert(a.b.events.some(t=>t.includes('ambushed')))
assert.equal(x.g.s.lastBattle.reason,'The palace was occupied.')
```

---

**Case / what it tests**

48. [Old all-edge deployment saves migrate and forged directional placement is
rejected][test-source-86]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Old all-edge deployment saves migrate and forged directional placement is
rejected',()=>{const
g=begin(fresh(),[0,34],false),b=g.s.battle,u=b.units[0];const wrong=[];for(let
r=0;r<12;r++)for(let
q=0;q<13;q++)if((q===0||q===12||r===0||r===11)&&!entryEdge(q,r,b.entryDirection,
b.target)&&Number.isFinite(terrainCost(b.terrain[r*13+q])))wrong.push({q,r});;Ob
ject.assign(u,{...wrong[0],placed:true});;b.rulesVersion=3;delete
b.entryDirection;const loaded=validateSave(g.s,scenarios,g.terrains);;;const
forged=structuredClone(loaded);forged.battle.entryDirection=(forged.battle.entry
Direction+1)%6;;})
```

**Required output / success criteria**

```text
assert(wrong.length)
assert.throws(()=>validateSave(g.s,scenarios,g.terrains))
assert.equal(loaded.battle.rulesVersion,6)
assert.equal(loaded.battle.units[0].placed,false)
assert.throws(()=>validateSave(forged,scenarios,g.terrains))
```

---

**Case / what it tests**

49. [Personal units cannot override the approach in a saved
deployment][test-source-87]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Personal units cannot override the approach in a saved
deployment',()=>{const
g=begin(fresh(),[0,34],false),b=g.s.battle,u=b.units[0];let spot,entry;for(let
dir=0;dir<6;dir++){spot=placementCells(b,'attack',null,dir).find(c=>!entryEdge(c
.q,c.r,b.entryDirection));if(spot){entry=dir;break;}};Object.assign(u,{...spot,p
laced:true,entryDirection:entry});;})
```

**Required output / success criteria**

```text
assert(spot)
assert.throws(()=>validateSave(g.s,scenarios,g.terrains),/deployment direction/)
```

---

**Case / what it tests**

50. [Forged allegiance and remote origins cannot be restored; legitimate bribery
still can][test-source-88]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Forged allegiance and remote origins cannot be restored; legitimate
bribery still can',()=>{for(const field of ['betrayed','side','origin']){const
{g,b,v}=arena();if(field==='betrayed')v.betrayed='yes';else
if(field==='side')v.side='attack';else{const
remote=g.s.provinces.find(p=>p.id!==b.target&&!g.province(b.target).neighbors.in
cludes(p.id)&&p.officers.length);remote.owner=b.attacker;for(const id of
remote.officers)g.officer(id).owner=b.attacker;g.normalize();v.origin=remote.id;
v.id=remote.officers[0];v.side=v.originalSide='attack';};}const
{g,u,v}=arena();g.battleAction('bribe',{unit:u.id,target:v.id,gold:100});;})
```

**Required output / success criteria**

```text
assert.throws(()=>validateSave(g.s,scenarios,g.terrains),field==='origin'?/conne
cted province/:field==='side'?/betrayal record/:/allegiance/)
assert.equal(validateSave(g.s,scenarios,g.terrains).battle.units.find(x=>x.id===
v.id).betrayed,true)
```

---

**Case / what it tests**

51. [A defeated charge target is occupied in every direction even when
breakthrough would fail][test-source-89]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A defeated charge target is occupied in every direction even when
breakthrough would fail',()=>{for(const q of [5,6])for(let i=0;i<6;i++){const
{g,b,u,f,v,king}=arena();Object.assign(u,{q,r:6,war:0});Object.assign(f,{q:0,r:0
});Object.assign(king,{q:0,r:1});Object.assign(v,{...direction(q,6,i),soldiers:1
});const
dest={q:v.q,r:v.r};g.random=()=>.999;g.battleAction('charge',{unit:u.id,target:v
.id});;;validateSave(g.s,scenarios,g.terrains);}})
```

**Required output / success criteria**

```text
assert.equal(v.soldiers,0)
assert.deepEqual({q:u.q,r:u.r},dest)
```

---

**Case / what it tests**

52. [A surviving-defender breakthrough uses attacker War rather than a fixed
fifty-percent roll][test-source-90]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A surviving-defender breakthrough uses attacker War rather than a fixed
fifty-percent roll',()=>{for(const war of [0,100]){const
{g,u,v}=arena(),start={q:u.q,r:u.r},i=DIRECTIONS.findIndex((_,i)=>{const
x=direction(u.q,u.r,i);return
x.q===v.q&&x.r===v.r;}),beyond=direction(v.q,v.r,i);u.war=war;g.random=()=>.75;g
.battleAction('charge',{unit:u.id,target:v.id});;;}})
```

**Required output / success criteria**

```text
assert(v.soldiers>0)
assert.deepEqual({q:u.q,r:u.r},war===100?beyond:start)
```

---

**Case / what it tests**

53. [Army equipment changes actual combat losses and purchasing equips a
recipient without creating soldiers][test-source-91]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Army equipment changes actual combat losses and purchasing equips a
recipient without creating soldiers',()=>{ const
bare=arena(),armed=arena(),partial=arena();bare.u.weapons=0;partial.u.weapons=25
00; for(const x of
[bare,partial,armed]){x.g.random=()=>.5;x.g.battleAction('attack',{unit:x.u.id,t
arget:x.v.id});} ;; const
g=fresh(),p=g.province(9),buyer=g.officer(34),recipient=g.officer(33);g.s.monthl
yReview=null;p.merchant=true;buyer.acted=false;recipient.weapons=0;const
men=recipient.soldiers,gold=p.gold;
g.execute('trade',{province:p.id,officer:buyer.id,recipient:recipient.id,mode:'a
rms',amount:17}); ;;;;validateSave(g.s,scenarios,terrains); })
```

**Required output / success criteria**

```text
assert(bare.v.soldiers>partial.v.soldiers)
assert(partial.v.soldiers>armed.v.soldiers)
assert.equal(p.gold,gold-17)
assert.equal(recipient.weapons,1700)
assert.equal(recipient.soldiers,men)
assert(buyer.acted)
```

---

**Case / what it tests**

54. [Battle HUD weapons validate atomically and persist through settlement and
suspended wars][test-source-92]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Battle HUD weapons validate atomically and persist through settlement and
suspended wars',()=>{ const
x=arena();x.g.cheat('battle',x.u.id,{weapons:1234});;const
before=JSON.stringify(x.g.s);;; const
y=arena();y.u.weapons=2345;y.b.suspended=true;y.g.suspendBattle();;; const
z=arena();z.u.weapons=3456;z.b.outcome={winner:'attack',reason:'Test
victory'};z.g.resolveBattle();;validateSave(z.g.s,scenarios,z.g.terrains); })
```

**Required output / success criteria**

```text
assert.equal(x.u.weapons,1234)
assert.throws(()=>x.g.cheat('battle',x.u.id,{weapons:10001}))
assert.equal(JSON.stringify(x.g.s),before)
assert.equal(y.g.officer(y.u.id).weapons,2345)
assert.equal(validateSave(y.g.s,scenarios,y.g.terrains).wars[0].units.find(u=>u.
id===y.u.id).weapons,2345)
assert.equal(z.g.officer(z.u.id).weapons,3456)
```

---

**Case / what it tests**

55. [A terminal commander charge keeps the occupation coordinate in the victory
report][test-source-93]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A terminal commander charge keeps the occupation coordinate in the victory
report',()=>{ const
{g,b,u,f,v,king}=arena();Object.assign(f,{q:0,r:0});Object.assign(v,{q:0,r:2});O
bject.assign(king,{q:7,r:6,soldiers:1});b.leaders.defend=king.id;const
target={q:king.q,r:king.r};
g.battleAction('charge',{unit:u.id,target:king.id});;;;;;;validateSave(g.s,scena
rios,g.terrains); })
```

**Required output / success criteria**

```text
assert.equal(king.soldiers,0)
assert.deepEqual({q:u.q,r:u.r},target)
assert.equal(g.s.battle,null)
assert(g.s.triumph)
assert.equal(g.s.lastBattle.chargeLanding.kind,'occupation')
assert.deepEqual({q:g.s.lastBattle.chargeLanding.q,r:g.s.lastBattle.chargeLandin
g.r},target)
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(v&&king)
```

<a id="tests-completion-tests-mjs"></a>
## tests/completion-tests.mjs

Source: [tests/completion-tests.mjs](../tests/completion-tests.mjs). Purpose:
Custom ruler/follower use separate stable IDs; historical officers and source
scenarios remain unchanged after load; All four delegation policies and
supply/attack targets persist; unused generals follow the selected policy;
Province Rest preserves the faction until its remaining directly ruled provinces
finish; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:assert/strict`, `node:fs`,
`../mjs/strategy.mjs`, `../mjs/campaign-completion.mjs`,
`../mjs/province-rules.mjs`, `../mjs/advice-topics.mjs`,
`../mjs/ai-politics.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Custom ruler/follower use separate stable IDs; historical officers and
source scenarios remain unchanged after
load][test-source-94]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Custom ruler/follower use separate stable IDs; historical officers and
source scenarios remain unchanged after load',()=>{const
raw=structuredClone(scenarios[0]),original=JSON.stringify(scenarios[0]),p=raw.pr
ovinces.find(p=>p.owner===255),id=createCustomRuler(raw,{province:p.id,name:'Ast
er',follower:'Jun',age:30,sex:'female',int:85,war:70,charm:85}),g=new
Game(createCampaign(raw,[id]),{},terrains);;;;;;})
```

**Required output / success criteria**

```text
assert.equal(g.ruler().name,'Aster')
assert.deepEqual(g.province(p.id).officers,[255,256])
assert.equal(valid(g).officers[255].name,'Aster')
assert.equal(JSON.stringify(scenarios[0]),original)
assert.throws(()=>createCustomRuler(structuredClone(scenarios[0]),{province:p.id
,name:'A',int:100,war:100,charm:100}))
```

---

**Case / what it tests**

2. [All four delegation policies and supply/attack targets persist; unused
generals follow the selected policy][test-source-95]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All four delegation policies and supply/attack targets persist; unused
generals follow the selected policy',()=>{for(const policy of
['full','internal','military','personnel']){const
g=fresh();g.execute('moveParty',{province:9,target:17,officers:[33,34],gold:300,
food:6000});g.officer(33).acted=false;g.officer(34).acted=false;g.execute('deleg
ateRealm',{province:9,target:17,mode:'self',policy,supply:9,attack:0});;;runDele
gated(g,0);;valid(g);}})
```

**Required output / success criteria**

```text
assert.equal(valid(g).provinces[16].delegation.policy,policy)
assert.throws(()=>g.execute('search',{province:17,officer:33}),/direct rule/)
assert(g.province(17).officers.some(id=>g.officer(id).acted))
```

---

**Case / what it tests**

3. [Province Rest preserves the faction until its remaining directly ruled
provinces finish][test-source-96]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Province Rest preserves the faction until its remaining directly ruled
provinces finish',()=>{const
g=fresh();g.execute('moveParty',{province:9,target:17,officers:[34],gold:0,food:
0});g.restProvince(9);;;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(g.s.player,0)
assert.equal(g.s.selected,17)
assert.throws(()=>g.execute('search',{province:9,officer:33}),/finished/)
```

---

**Case / what it tests**

4. [Human ally can refuse or pledge selected units, with separate saved
provincial supplies][test-source-97]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human ally can refuse or pledge selected units, with separate saved
provincial supplies',()=>{for(const accept of [false,true]){const
g=fresh(),ally=g.ruler(10);g.ruler().alliances.push(10);ally.alliances.push(0);g
.s.humanRulers.push(10);g.s.allyDecisions.push({kind:'joint',owner:10,requester:
0,province:8});const
p=g.province(16),ids=p.officers.filter(id=>g.officer(id).soldiers).slice(0,1),tr
ust=ally.trust;;answerAlly(g,accept,{officers:ids,food:1000,gold:50});if(accept)
{;;}else ;valid(g);}})
```

**Required output / success criteria**

```text
assert(ids.length)
assert.deepEqual(g.s.jointPlans[0].officers,ids)
assert.equal(g.s.jointPlans[0].food,1000)
assert.equal(ally.trust,trust-5)
```

---

**Case / what it tests**

5. [Defensive allied support uses a saved mounted request and enters from the
ally’s connected edge][test-source-98]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defensive allied support uses a saved mounted request and enters from the
ally’s connected edge',()=>{const g=fresh();g.s.settings.battleView='all';const
defender=g.ruler(12),ally=g.ruler(10);defender.alliances.push(10);ally.alliances
.push(12);g.s.humanRulers.push(10);g.invade({province:9,target:8,governor:33,off
icers:[0],food:20000,gold:500});while(g.s.battle.phase==='deployment')aiBattle(g
);g.s.battle.side='defend';g.requestBattleAlly(10);const
x=g.s.allyDecisions[0];;valid(g);x.index=x.route.length-1;const
p=g.province(16),id=p.officers.find(id=>g.officer(id).soldiers),gold=p.gold;g.an
swerAlly(true,{officers:[id],food:1000,gold:50});const
u=g.s.battle.units.find(u=>u.id===id);;;;val … (complete input/procedure at
linked L14–14)
```

**Required output / success criteria**

```text
assert(x.route.length>1)
assert.equal(u.allyOwner,10)
assert(u.placed)
assert.equal(p.gold,gold-50)
```

---

**Case / what it tests**

6. [Supply convoy deducts cargo at departure, loses only carried goods to
bandits and delivers the remainder after
save/load][test-source-99]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Supply convoy deducts cargo at departure, loses only carried goods to
bandits and delivers the remainder after save/load',()=>{const
g=fresh();g.execute('moveParty',{province:9,target:17,officers:[34],gold:0,food:
0});g.random=()=>0;const
source=g.province(9),dest=g.province(17),gold=source.gold,before=dest.gold;g.exe
cute('transport',{province:9,target:17,officer:33,gold:100,food:1000});;g.s=vali
d(g);g.advanceJourney();;g.random=()=>.999;travel(g);;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(source.gold,gold-100)
assert.equal(g.s.journey.cargo.gold,90)
assert.equal(g.province(17).gold,before+90)
assert.equal(g.province(9).gold,gold-100)
```

---

**Case / what it tests**

7. [Captured messenger cargo is seized once and a refused gift returns to its
source][test-source-100]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Captured messenger cargo is seized once and a refused gift returns to its
source',()=>{const g=fresh();g.s.humanRulers.push(3);const
source=g.province(9),gold=source.gold;g.random=()=>0;g.execute('diplomaticMissio
n',{province:9,officer:34,mode:'gift',target:3,amount:100});while(g.s.journey&&!
g.s.journey.interception)g.advanceJourney();const
x=g.s.journey.interception,p=g.province(x.province),before=p.gold;g.interceptJou
rney('capture');;;;valid(g);const
h=fresh(),beforeGold=h.province(9).gold;h.random=()=>.999;h.execute('diplomaticM
ission',{province:9,officer:34,mode:'gift',target:3,amount:100});travel(h);;vali
d(h);})
```

**Required output / success criteria**

```text
assert.equal(source.gold,gold-100)
assert.equal(p.gold,before+100)
assert.equal(g.s.journey,null)
assert.equal(h.province(9).gold,beforeGold)
```

---

**Case / what it tests**

8. [Submitting ruler joins while unwilling subordinates become free without
leaving invalid governors][test-source-101]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Submitting ruler joins while unwilling subordinates become free without
leaving invalid governors',()=>{const
g=fresh(),target=g.ruler(12),ids=[...g.province(8).officers];g.random=()=>.999;s
urrenderRealm(g,target,g.officer(33));g.normalize();;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(g.officer(target.leader).owner,0)
assert(ids.some(id=>id!==target.leader&&g.officer(id).owner===255))
```

---

**Case / what it tests**

9. [Protect/plunder and unique item recipient decisions persist and cannot
repeat rewards][test-source-102]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Protect/plunder and unique item recipient decisions persist and cannot
repeat rewards',()=>{for(const mode of ['protect','plunder']){const
g=fresh(),p=g.province(9),trust=g.ruler().trust,war=g.officer(34).war;g.s.spoils
=[{owner:0,province:9,item:'luminous'}];g.s=valid(g);g.random=()=>.375;g.decideS
poils(mode,34);;;;;;;valid(g);}})
```

**Required output / success criteria**

```text
assert.equal(g.officer(34).war,Math.min(100,war+8))
assert.equal(g.officer(34).loyalty,100)
assert.equal(g.s.items.length,1)
assert.equal(g.s.spoils.length,0)
assert.equal(g.ruler().trust,mode==='protect'?Math.min(100,trust+1):Math.max(0,t
rust-10))
assert.throws(()=>g.decideSpoils(mode,34))
```

---

**Case / what it tests**

10. [Travelling visitors move only one fixed connection; repeated monthly checks
do not reroll them][test-source-103]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Travelling visitors move only one fixed connection; repeated monthly
checks do not reroll them',()=>{const
g=fresh(),v=structuredClone(g.s.visitors);g.s.month++;const
moved=structuredClone(updateVisitors(g));for(const k of
['huaTuo','scholar','critic']);;})
```

**Required output / success criteria**

```text
assert([v[k],...g.province(v[k]).neighbors].includes(moved[k]))
assert.deepEqual(updateVisitors(g),moved)
```

---

**Case / what it tests**

11. [War, officer, spy and visitor advice is cached independently without
charging general actions][test-source-104]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('War, officer, spy and visitor advice is cached independently without
charging general actions',()=>{const
g=fresh(),p=g.province(9);g.ruler().advisor=33;g.officer(33).int=100;g.s.monthly
Advice.intelligence[33]=100;for(const topic of
['war','officers','spy','visitors']){const
message=adviceTopic(g,p,topic);g.random=()=>.999;;};valid(g);})
```

**Required output / success criteria**

```text
assert.equal(adviceTopic(g,p,topic),message)
assert(!g.officer(33).acted)
```

---

**Case / what it tests**

12. [State-changing historical bequest requires both surviving realms and does
not run in Fiction mode or repeat][test-source-105]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('State-changing historical bequest requires both surviving realms and does
not run in Fiction mode or repeat',()=>{const
g=fresh(),tao=g.s.rulers.find(r=>r.name==='Tao
Qian'),liu=g.s.rulers.find(r=>r.name==='Liu
Bei'),ids=g.s.provinces.filter(p=>p.owner===tao.id).map(p=>p.id),report={events:
[],details:[]};g.s.year=194;g.s.historyMode='fiction';conditionalHistory(g,repor
t);;g.s.historyMode='historic';conditionalHistory(g,report);;g.normalize();const
length=report.events.length;conditionalHistory(g,report);;valid(g);})
```

**Required output / success criteria**

```text
assert(ids.every(id=>g.province(id).owner===tao.id))
assert(ids.every(id=>g.province(id).owner===liu.id))
assert.equal(report.events.length,length)
```

---

**Case / what it tests**

13. [AI political repertoire dispatches real saved missions rather than
text-only reports][test-source-106]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI political repertoire dispatches real saved missions rather than
text-only reports',()=>{const
g=fresh();g.s.humanRulers=[];g.random=()=>0;;;valid(g);})
```

**Required output / success criteria**

```text
assert(aiPolitics(g,g.province(9),g.province(9).officers.map(id=>g.officer(id)),
{intelligence:90}))
assert(g.s.journey)
```

---

**Case / what it tests**

14. [Malformed delegation, treasure, custom officer and allied route state is
rejected][test-source-107]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Malformed delegation, treasure, custom officer and allied route state is
rejected',()=>{for(const change of
[s=>s.items=[{item:'unknown',officer:0}],s=>s.provinces[8].delegation={policy:'m
ilitary',supply:9,attack:41},s=>s.customOfficers=[{id:0}],s=>s.allyDecisions=[{k
ind:'battle',owner:10,requester:0,province:8,side:'attack',route:[9,41],index:0}
]]){const s=structuredClone(fresh().s);change(s);;}})
```

**Required output / success criteria**

```text
assert.throws(()=>validateSave(s,scenarios,terrains))
```

---

**Case / what it tests**

15. [Bribery is commander-only, and one opening duel can improve a weaker
victorious duellist][test-source-108]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Bribery is commander-only, and one opening duel can improve a weaker
victorious duellist',()=>{const
g=fresh();g.s.settings.battleView='all';g.invade({province:9,target:8,governor:3
3,officers:[0,34],food:20000,gold:500});while(g.s.battle.phase==='deployment')ai
Battle(g);g.battleAction('end');const
b=g.s.battle,u=b.units.find(u=>u.id===0),f=b.units.find(u=>u.id===34),v=b.units.
find(u=>u.side==='defend'&&u.id!==b.leaders.defend);;atomic(g,()=>g.battleAction
('bribe',{unit:f.id,target:v.id,gold:100}));u.war=80;v.war=85;let
rolls=0;g.int=()=>rolls++===0?10:-10;g.battleAction('challenge',{unit:u.id,targe
t:v.id});g.battleAction('challengeResponse',{accept:true});;;f.war=100;atomic(g,
()=>g.bat … (complete input/procedure at linked L24–24)
```

**Required output / success criteria**

```text
assert(v)
assert.equal(u.war,81)
assert.equal(g.officer(u.id).war,81)
```

---

**Case / what it tests**

16. [A general fleeing through hostile control can be captured while the rest of
the army keeps fighting][test-source-109]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A general fleeing through hostile control can be captured while the rest
of the army keeps fighting',()=>{const
g=fresh();g.s.settings.battleView='all';g.invade({province:9,target:8,governor:3
3,officers:[0,34],food:20000,gold:500});while(g.s.battle.phase==='deployment')ai
Battle(g);g.battleAction('end');const
b=g.s.battle,f=b.units.find(u=>u.id===34),v=b.units.find(u=>u.side==='defend'&&u
.id!==b.leaders.defend),used=new
Set(b.units.filter(u=>u!==f&&u!==v).map(u=>u.r*13+u.q));let pair;for(let
i=0;i<156&&!pair;i++)if(b.terrain[i]===0&&!used.has(i)){const
near=neighbors(i%13,Math.floor(i/13)).find(x=>b.terrain[x.r*13+x.q]===0&&!used.h
as(x.r*13+x.q));if(near)pair=[{q:i%13,r:Math.floor(i/13) … (complete
input/procedure at linked L25–25)
```

**Required output / success criteria**

```text
assert(pair)
assert(f.captured&&!f.fled)
assert(g.s.battle)
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert.throws(fn);
assert.equal(JSON.stringify(g.s),state);
assert(++n<200)
```

<a id="tests-decisions-tests-mjs"></a>
## tests/decisions-tests.mjs

Source: [tests/decisions-tests.mjs][test-source-110]. Purpose: No empty adjacent
province captures every defending officer, including ruler/governor; checkpoint
retains decisions; With an empty escape province, native WAR/training/mobility
distinguish strong and weak field escape; Native ordinary captive recruitment
completes once; beheading another captive removes membership permanently;
additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `node:assert/strict`, `node:fs`,
`../mjs/strategy.mjs`, `../mjs/terrain-mask.mjs`, `../mjs/geography.mjs`,
`../mjs/campaign-decisions.mjs`, `../mjs/game-ui.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [No empty adjacent province captures every defending officer, including
ruler/governor; checkpoint retains
decisions][test-source-111]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('No empty adjacent province captures every defending officer, including
ruler/governor; checkpoint retains decisions',()=>{ const {g,ids}=win();;;;;
const restored=new
Game(validateSave(g.s,scenarios,terrain),{},terrain);;check(restored); })
```

**Required output / success criteria**

```text
assert.deepEqual(new Set(g.s.captiveDecisions.map(c=>c.officer)),new Set(ids))
assert(g.s.captiveDecisions.some(c=>c.role==='Ruler'))
assert.equal(g.s.battle,null)
assert.throws(()=>g.finishFactionTurn(),/captives/)
assert.deepEqual(restored.s.captiveDecisions,g.s.captiveDecisions)
```

---

**Case / what it tests**

2. [With an empty escape province, native WAR/training/mobility distinguish
strong and weak field escape][test-source-112]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('With an empty escape province, native WAR/training/mobility distinguish
strong and weak field escape',()=>{ const
strong=win(true,true),weak=win(true,false);;; ;check(strong.g);check(weak.g); })
```

**Required output / success criteria**

```text
assert.equal(strong.g.s.captiveDecisions.length,0)
assert.equal(weak.g.s.captiveDecisions.length,weak.ids.length)
assert(strong.ids.every(id=>strong.g.s.provinces.some(p=>p.id!==8&&p.officers.in
cludes(id))))
```

---

**Case / what it tests**

3. [Native ordinary captive recruitment completes once; beheading another
captive removes membership permanently][test-source-113]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native ordinary captive recruitment completes once; beheading another
captive removes membership permanently',()=>{ const
{g,ids}=win(),ordinary=ids.filter(id=>g.s.captiveDecisions.find(c=>c.officer===i
d).role!=='Ruler');g.random=()=>.999;;;; const id=ordinary[1];;;;;check(g); })
```

**Required output / success criteria**

```text
assert.equal(g.decideCaptive(ordinary[0],'recruit'),true)
assert.equal(g.officer(ordinary[0]).prisonerOf,undefined)
assert.throws(()=>g.decideCaptive(ordinary[0],'recruit'),/already/)
assert(g.decideCaptive(id,'behead'))
assert(g.officer(id).dead)
assert(!g.s.provinces.some(p=>['officers','hidden','unclaimed'].some(k=>p[k].inc
ludes(id))))
assert.throws(()=>g.decideCaptive(id,'free'),/already/)
```

---

**Case / what it tests**

4. [A captured ruler cannot be recruited and rejection does not spend RNG or
alter the campaign][test-source-114]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A captured ruler cannot be recruited and rejection does not spend RNG or
alter the campaign',()=>{ const {g}=win();const
c=g.s.captiveDecisions.find(c=>c.role==='Ruler'),before=JSON.stringify(g.s);;;g.
decideCaptive(c.officer,'free');check(g); })
```

**Required output / success criteria**

```text
assert.throws(()=>g.decideCaptive(c.officer,'recruit'),/only be set free or
beheaded/)
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

5. [A released landless ruler continues in exile, moves through connected
provinces and settles][test-source-115]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A released landless ruler continues in exile, moves through connected
provinces and settles',()=>{ const
{g,former}=win();g.s.humanRulers.push(former);for(const c of
[...g.s.captiveDecisions])g.decideCaptive(c.officer,'free');const
party=g.s.roaming.find(p=>p.owner===former);;;check(g);
g.s.player=former;g.s.selected=party.province;const
empty=g.s.provinces.find(p=>p.owner===255);;for(const id of
realmRoute(g,party.province,empty.id).slice(1))g.roam('move',id);g.roam('settle'
);;;check(g); })
```

**Required output / success criteria**

```text
assert(party)
assert(activeRulers(g.s).some(r=>r.id===former))
assert(empty)
assert.equal(g.province(empty.id).owner,former)
assert.equal(g.roaming(),undefined)
```

---

**Case / what it tests**

6. [Defeated human realms relinquish control after decisions; the last human
gets a clear ended campaign][test-source-116]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defeated human realms relinquish control after decisions; the last human
gets a clear ended campaign',()=>{ for(const last of [false,true]){const
{g,former}=win();g.s.humanRulers=last?[former]:[0,former];g.s.player=former;cons
t
c=g.s.captiveDecisions.find(c=>c.role==='Ruler');g.decideCaptive(c.officer,'behe
ad');for(const next of
[...g.s.captiveDecisions])g.decideCaptive(next.officer,'free');;if(last){;;}else
{;;}check(g);} })
```

**Required output / success criteria**

```text
assert(!g.s.humanRulers.includes(former))
assert(g.s.campaignEnded&&g.s.paused)
assert.equal(g.aiStep(),false)
assert(!g.s.campaignEnded)
assert.notEqual(g.s.player,former)
```

---

**Case / what it tests**

7. [A dispatched gift has no early effect, blocks extra orders and resumes after
save/load][test-source-117]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A dispatched gift has no early effect, blocks extra orders and resumes
after save/load',()=>{ const
g=trip(),gold=g.province(9).gold,other=g.province(g.ruler(3).home).gold,seed=g.s
.seed;g.execute('diplomaticMission',{province:9,mode:'gift',target:3,officer:34,
amount:100});;;;;;; const loaded=new
Game(validateSave(g.s,scenarios,terrain),{},terrain);loaded.random=()=>0;let
steps=0;while(loaded.s.journey){if(loaded.s.journey.proposal)loaded.answerPropos
al(true);else
if(loaded.s.journey.interception)loaded.interceptJourney('free');else
loaded.advanceJourney();;check(loaded);};;;check(loaded); })
```

**Required output / success criteria**

```text
assert(g.s.journey)
assert.equal(g.province(9).gold,gold-100)
assert.equal(g.province(g.ruler(3).home).gold,other)
assert.equal(g.s.seed,seed)
assert(g.officer(34).acted&&g.officer(34).inTransit)
assert.throws(()=>g.execute('develop',{province:9,officer:33,amount:10}),/journe
y/)
assert(++steps<150)
assert.equal(loaded.province(9).gold,gold-100)
assert.equal(loaded.province(loaded.ruler(3).home).gold,other+100)
assert(!loaded.officer(34).inTransit)
```

---

**Case / what it tests**

8. [Intercepted envoy can be captured or beheaded; cancelled missions transfer
no gift and clear transit][test-source-118]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Intercepted envoy can be captured or beheaded; cancelled missions transfer
no gift and clear transit',()=>{ for(const choice of ['capture','behead']){const
g=trip(),gold=g.province(9).gold;g.execute('diplomaticMission',{province:9,mode:
'gift',target:3,officer:34,amount:100});for(let
n=0;n<40&&!g.s.journey.interception;n++)g.advanceJourney();;g.interceptJourney(c
hoice);;;;if(choice==='behead');else ;check(g);} })
```

**Required output / success criteria**

```text
assert(g.s.journey.interception)
assert.equal(g.s.journey,null)
assert.equal(g.province(9).gold,gold-100)
assert(!g.officer(34).inTransit)
assert(g.officer(34).dead)
assert(g.s.captiveDecisions.some(c=>c.officer===34))
```

---

**Case / what it tests**

9. [Invalid dispatch and invalid saved route reject
atomically][test-source-119]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Invalid dispatch and invalid saved route reject atomically',()=>{ const
g=trip(),before=JSON.stringify(g.s);;;g.execute('diplomaticMission',{province:9,
mode:'gift',target:3,officer:34,amount:100});const
broken=structuredClone(g.s);broken.journey.legs[0].route=[9,41];; })
```

**Required output / success criteria**

```text
assert.throws(()=>g.execute('diplomaticMission',{province:9,mode:'gift',target:3
,officer:34,amount:99}))
assert.equal(JSON.stringify(g.s),before)
assert.throws(()=>validateSave(broken,scenarios,terrain),/route/)
```

---

**Case / what it tests**

10. [Six-direction masks distinguish connected terrain and ownership polygons
meet without overlapping][test-source-120]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Six-direction masks distinguish connected terrain and ownership polygons
meet without overlapping',()=>{ const
tiles=Array(156).fill(4);;tiles[5*13+6]=0;;;; const
cells=ownershipCells([{x:-10,z:0},{x:10,z:0}],[-20,-20,20,20]);;; })
```

**Required output / success criteria**

```text
assert.equal(terrainMask(tiles,6,6),63)
assert.equal(terrainMask(tiles,6,6),61)
assert.notEqual(terrainVariant(tiles,6,6).key,terrainVariant(tiles,7,6).key)
assert.equal(terrainVariant(tiles,6,6).edges.length,1)
assert(cells[0].every(p=>p.x<=.000001))
assert(cells[1].every(p=>p.x>=-.000001))
```

---

**Case / what it tests**

11. [Numbered city seals remain distinct in dense mobile China
views][test-source-121]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Numbered city seals remain distinct in dense mobile China views',()=>{
for(const [width,height] of [[340.8,393],[266.8,375]]){const
scale=Math.min(width/144,(height-24)/130)*.92,cs=Math.max(9,Math.min(24,scale*3.
2))*1.65,anchors=scenarios[0].provinces.map(p=>{const a=pointFor(p);return
{id:p.id,x:width/2+a.x*scale,y:height/2+(a.z-7)*scale-cs*.55};}),labels=[...layo
utCityBadges(anchors,width,height).values()];;for(let
i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++);} })
```

**Required output / success criteria**

```text
assert.equal(labels.length,41)
assert(Math.abs(labels[i].x-labels[j].x)>=24||Math.abs(labels[i].y-labels[j].y)>
=24,'Province seals overlap')
```

---

**Case / what it tests**

12. [Relevant abilities and local intelligent-advisor forecasts do not consume
RNG][test-source-122]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Relevant abilities and local intelligent-advisor forecasts do not consume
RNG',()=>{ const
g=fresh();g.ruler().advisor=33;g.officer(33).int=95;g.s.monthlyAdvice.intelligen
ce[33]=100;const seed=g.s.seed;;;;;;;g.ruler().advisor=null;; })
```

**Required output / success criteria**

```text
assert(orderInsight(g,'Cultivate',34).includes('Best affordable result this
order'))
assert(orderInsight(g,'Recruit',34,{target:g.province(9).unclaimed[0]??40}).incl
udes('chance'))
assert.equal(g.s.seed,seed)
assert(relevantAttributes('Train').includes('war'))
assert(orderInsight(g,'Spy · Forged letter',34,{target:40}).includes('chance'))
assert.equal(g.s.seed,seed)
assert.equal(orderInsight(g,'Search',34),'')
```

---

**Case / what it tests**

13. [Northern ownership caps lower provinces 1,2,3,4,15 without moving cities or
changing other sectors][test-source-123]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Northern ownership caps lower provinces 1,2,3,4,15 without moving cities
or changing other sectors',()=>{const
points=scenarios[0].provinces.map(p=>({...pointFor(p),id:p.id})),cells=ownership
Cells(points),plain=ownershipCells(points.map(({x,z})=>({x,z})));for(let
i=0;i<41;i++){if([1,2,3,4,15].includes(i+1)){;;;}else ;}})
```

**Required output / success criteria**

```text
assert(cells[i].length>=3)
assert(cells[i].every(v=>v.z>=ownershipNorth(points[i])-1e-8))
assert(cells[i].some(v=>Math.abs(v.z-ownershipNorth(points[i]))<1e-8))
assert.deepEqual(cells[i],plain[i])
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(validateSave(g.s,scenarios,terrain));
assert(g.s.triumph)
```

<a id="tests-expansion-tests-mjs"></a>
## tests/expansion-tests.mjs

Source: [tests/expansion-tests.mjs](../tests/expansion-tests.mjs). Purpose:
General retreat requires a valid choice and rejects occupied, remote and missing
destinations atomically; Empty neighbour retreat reserves the province and
settles surviving troops after restored defeat; Defenders exclude the attacker
source and can settle an empty connected province after conquest; additional
cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle.mjs`, `../mjs/monthly-events.mjs`,
`../mjs/officer-roster.mjs`, `../mjs/portraits.mjs`, `../mjs/events.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [General retreat requires a valid choice and rejects occupied, remote and
missing destinations atomically][test-source-124]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('General retreat requires a valid choice and rejects occupied, remote and
missing destinations atomically',()=>{const {g,b,f}=arena();const
before=JSON.stringify(g.s);for(const province of
[undefined,b.target,36]){;;}g.battleAction('flee',{unit:f.id,province:b.source})
;;;;const s=validateSave(g.s,scenarios,g.terrains);;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.battleAction('flee',{unit:f.id,province}))
assert.equal(JSON.stringify(g.s),before)
assert(f.fled)
assert.equal(f.retreatProvince,b.source)
assert(!b.units.find(x=>x.id===b.leaders.attack).fled)
assert.equal(s.battle.units.find(x=>x.id===f.id).retreatProvince,b.source)
```

---

**Case / what it tests**

2. [Empty neighbour retreat reserves the province and settles surviving troops
after restored defeat][test-source-125]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Empty neighbour retreat reserves the province and settles surviving troops
after restored defeat',()=>{const
{g,b,u,f,v}=arena(),p=neutral(g,b);g.battleAction('flee',{unit:f.id,province:p.i
d});;const saved=validateSave(g.s,scenarios,g.terrains),loaded=new
Game(saved,{},g.terrains);loaded.battleAction('flee',{unit:u.id,confirmArmy:true
});;;;;validateSave(loaded.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert(!retreatOptions(g,v).some(q=>q.id===p.id))
assert.equal(loaded.province(p.id).owner,b.attacker)
assert(loaded.province(p.id).officers.includes(f.id))
assert.equal(loaded.officer(f.id).soldiers,5000)
assert.equal(loaded.province(p.id).governor,f.id)
```

---

**Case / what it tests**

3. [Defenders exclude the attacker source and can settle an empty connected
province after conquest][test-source-126]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defenders exclude the attacker source and can settle an empty connected
province after conquest',()=>{const
{g,b,v,king}=arena(),p=neutral(g,b);b.side='defend';;;;g.battleAction('flee',{un
it:v.id,province:p.id});g.battleAction('flee',{unit:king.id,confirmArmy:true});;
;;validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert(!retreatOptions(g,v).some(q=>q.id===b.source))
assert(retreatOptions(g,v).some(q=>q.id===p.id))
assert.throws(()=>g.battleAction('flee',{unit:v.id,province:b.source}))
assert.equal(g.province(p.id).owner,b.defender)
assert(g.province(p.id).officers.includes(v.id))
assert.equal(g.province(b.target).owner,b.attacker)
```

---

**Case / what it tests**

4. [Forged retreat reservations and destinations cannot be
restored][test-source-127]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Forged retreat reservations and destinations cannot be
restored',()=>{const
{g,b,f}=arena();f.fled=true;f.retreatProvince=b.target;;f.retreatProvince=b.sour
ce;f.fled=false;;})
```

**Required output / success criteria**

```text
assert.throws(()=>validateSave(g.s,scenarios,g.terrains))
assert.throws(()=>validateSave(g.s,scenarios,g.terrains))
```

---

**Case / what it tests**

5. [Four weather states preserve native dry-weather parity and rain blocks
fire][test-source-128]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Four weather states preserve native dry-weather parity and rain blocks
fire',()=>{;;;;for(const weather of Object.keys(WEATHER)){const
{g,b,u}=arena();g.random=()=>.65;setWeather(b,weather);if(weather==='rain'){b.fi
re={3:2};setWeather(b,weather);;const
before=JSON.stringify(b);;;}else{g.battleAction('fireball',{unit:u.id,q:6,r:4});
;}}})
```

**Required output / success criteria**

```text
assert.deepEqual(Object.values(WEATHER),['Clear','Few clouds','Cloudy','Rain'])
assert.equal(fireChance(80,'sunny'),fireChance(80,'fewclouds'))
assert.equal(fireChance(80,'fewclouds'),fireChance(80,'cloudy'))
assert.equal(fireChance(100,'rain'),0)
assert.deepEqual(b.fire,{})
assert.throws(()=>g.battleAction('fireball',{unit:u.id,q:6,r:4}))
assert.equal(JSON.stringify(b),before)
assert.equal(!!b.fire[4*13+6],true)
```

---

**Case / what it tests**

6. [Old stormy battlefield saves migrate to cloudy while retaining wind and
units][test-source-129]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Old stormy battlefield saves migrate to cloudy while retaining wind and
units',()=>{const
{g,b}=arena();b.rulesVersion=4;b.weather='stormy';b.wind=6;b.windStrength=3;cons
t s=validateSave(g.s,scenarios,g.terrains);;;;;;})
```

**Required output / success criteria**

```text
assert.equal(s.battle.rulesVersion,6)
assert.equal(s.battle.weather,'cloudy')
assert.equal(s.battle.wind,6)
assert.equal(s.battle.windStrength,1)
assert.deepEqual(s.battle.units,b.units)
```

---

**Case / what it tests**

7. [Native locust losses preserve stored gold; remaster famine income expires
after a year][test-source-130]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native locust losses preserve stored gold; remaster famine income expires
after a year',()=>{const
g=fresh(),p=g.province(9),gold=p.gold,food=p.food;disaster(g,p,'locust',report()
);;;;g.s.year++;g.s.month++;;})
```

**Required output / success criteria**

```text
assert.equal(p.gold,gold)
assert(p.food>=Math.floor(food*.5)&&p.food<=Math.floor(food*.7))
assert.equal(incomeFactor(g.s,p),.75)
assert.equal(incomeFactor(g.s,p),1)
```

---

**Case / what it tests**

8. [Random typhoons stay in Jiao/Yang, floods in the Yellow River
regions][test-source-131]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Random typhoons stay in Jiao/Yang, floods in the Yellow River
regions',()=>{const g=fresh();g.s.month=5;for(const p of
g.s.provinces)p.flood=0;g.random=()=>.05;const
r=report();runMonthlyEvents(g,r);const
affected=r.details.filter(e=>['typhoon','flood'].includes(e.art));;;for(const e
of affected){const
region=g.province(e.province).region;;}validateSave(g.s,scenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert(affected.some(e=>e.art==='typhoon'))
assert(affected.some(e=>e.art==='flood'))
assert((e.art==='typhoon'?[11,13]:[1,2,3,4,5,6,7,9]).includes(region))
```

---

**Case / what it tests**

9. [Uprising and plague reduce loyalty; each has its matching
scene][test-source-132]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Uprising and plague reduce loyalty; each has its matching
scene',()=>{for(const type of ['uprising','epidemic']){const
g=fresh(),p=g.province(9),loyalty=p.loyalty,pop=p.population,r=report();g.random
=()=>0;disaster(g,p,type,r);;;;;}})
```

**Required output / success criteria**

```text
assert(p.loyalty<loyalty)
assert(p.population<pop)
assert.equal(r.details[0].art,type)
assert.equal(eventFrame(r.details[0]).atlas,type==='uprising'?'disasters':'omens
')
```

---

**Case / what it tests**

10. [Hua Tuo book changes three-month sickness and injury to one month and
persists][test-source-133]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hua Tuo book changes three-month sickness and injury to one month and
persists',()=>{for(const key of ['sick','injured']){const
ordinary=fresh(),medical=fresh();for(const g of
[ordinary,medical]){g.officer(34)[key]=true;g.officer(34).illMonths=3;}const
r=report();;;;const saved=validateSave(medical.s,scenarios,terrains);;for(let
month=2;month<=4;month++){for(const g of
[ordinary,medical]){g.s.month=month;runMonthlyEvents(g,report());};;}}})
```

**Required output / success criteria**

```text
assert(triggerEvent(medical,'medical',r,{officer:34}))
assert.equal(medical.officer(34).illMonths,1)
assert.equal(r.details[0].art,'medical')
assert(saved.officers[34].medicalBook)
assert.equal(!!medical.officer(34)[key],false)
assert.equal(!!ordinary.officer(34)[key],month<4)
```

---

**Case / what it tests**

11. [an unaffiliated officer still recovers after leaving
service][test-source-134]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('an unaffiliated officer still recovers after leaving service',()=>{const
g=fresh(),o=g.officer(34),p=g.s.provinces.find(p=>p.officers.includes(o.id));p.o
fficers=p.officers.filter(id=>id!==o.id);p.unclaimed.push(o.id);o.owner=255;o.in
jured=true;o.medicalBook=true;o.illMonths=1;g.s.month=2;runMonthlyEvents(g,repor
t());;;})
```

**Required output / success criteria**

```text
assert.equal(o.injured,false)
assert.equal(o.illMonths,0)
```

---

**Case / what it tests**

12. [A named comet omen persists, can cause an actual death and repairs officer
references][test-source-135]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A named comet omen persists, can cause an actual death and repairs officer
references',()=>{const
g=fresh(),o=g.officer(34),r=report();;;;;g.s.month=2;g.random=()=>0;const
next=report();runMonthlyEvents(g,next);;;;g.normalize();validateSave(g.s,scenari
os,terrains);})
```

**Required output / success criteria**

```text
assert(triggerEvent(g,'meteor',r,{officer:o.id}))
assert(r.details[0].text.includes(o.name))
assert.equal(r.details[0].art,'meteor')
assert(validateSave(g.s,scenarios,terrains).monthlyState.omens.some(x=>x.officer
===o.id))
assert(o.dead)
assert(next.details.some(e=>e.art==='death'&&e.officer===o.id))
assert(!g.s.provinces.some(p=>p.officers.includes(o.id)))
```

---

**Case / what it tests**

13. [Named ruler death creates a valid successor rather than stranding a
realm][test-source-136]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Named ruler death creates a valid successor rather than stranding a
realm',()=>{const g=fresh(),sun=g.s.officers.find(o=>o.name==='Sun
Jian'),r=g.ruler(sun.owner),result=report();;;;;g.normalize();validateSave(g.s,s
cenarios,terrains);})
```

**Required output / success criteria**

```text
assert(officerDeath(g,sun.id,result))
assert(sun.dead)
assert.notEqual(r.leader,sun.id)
assert(result.details.some(e=>e.art==='death'&&e.text.includes('Sun Jian')))
```

---

**Case / what it tests**

14. [Xun Yu stratagem raises rival hostility and Diaochan chain lowers
subordinate loyalty][test-source-137]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Xun Yu stratagem raises rival hostility and Diaochan chain lowers
subordinate loyalty',()=>{const g=fresh(1),r=report();;;;;const
z=fresh(),dong=z.s.officers.find(o=>o.name==='Dong
Zhuo'),ids=z.s.provinces.filter(p=>p.owner===dong.owner).flatMap(p=>p.officers).
filter(id=>id!==dong.id),c=report(),wang=z.s.officers.find(o=>o.name==='Wang
Yun');for(const p of z.s.provinces)for(const key of
['officers','hidden','unclaimed'])p[key]=p[key].filter(id=>id!==wang.id);wang.ow
ner=dong.owner;z.province(10).officers.push(wang.id);ids.push(wang.id);const
before=ids.map(id=>z.officer(id).loyalty);;;ids.forEach((id,i)=>);z.normalize();
validateSave(z.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert(triggerEvent(g,'tiger',r))
assert.equal(r.details[0].art,'tiger')
assert(r.details[0].text.includes('Xun Yu'))
assert(r.details[0].text.includes('mutual hostility'))
assert(triggerEvent(z,'chain',c))
assert.equal(c.details[0].art,'chain')
assert.equal(z.officer(id).loyalty,Math.max(0,before[i]-20))
```

---

**Case / what it tests**

15. [352 distinct officer identities map bijectively to352 unique portrait cells
across six scenarios][test-source-138]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('352 distinct officer identities map bijectively to352 unique portrait
cells across six scenarios',()=>{;const seen=new Set,frames=new Set;for(const s
of scenarios)for(const o of
s.officers)if(o.name!=='Unnamed'){;seen.add(o.rosterId);const
f=portraitFrame(o);;frames.add(f.atlas+':'+f.cell);};;for(const s of
scenarios);})
```

**Required output / success criteria**

```text
assert.equal(OFFICER_ROSTER.length,352)
assert.equal(portraitIndex(o),o.rosterId)
assert(f.cell>=0&&f.cell<16)
assert.equal(seen.size,352)
assert.equal(frames.size,352)
assert.equal(new
Set(s.officers.filter(o=>o.name!=='Unnamed').map(o=>o.rosterId)).size,s.officers
.filter(o=>o.name!=='Unnamed').length)
```

---

**Case / what it tests**

16. [Recovered late officers enter only at their original arrival date and older
saves upgrade safely][test-source-139]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Recovered late officers enter only at their original arrival date and
older saves upgrade safely',()=>{const
g=fresh(5),o=g.s.officers.find(o=>o.name==='Jiang
Wei');;;g.s.year=o.appearanceYear-1;g.s.month=12;runMonthlyEvents(g,report());;g
.s.year++;g.s.month=1;const
r=report();runMonthlyEvents(g,r);;;;validateSave(g.s,scenarios,terrains);const
old=createCampaign(scenarios[0],[0]);for(const t of
scenarios[0].officers.filter(o=>o.pendingArrival))Object.assign(old.officers[t.i
d],{name:'Unnamed',int:0,war:0,charm:0,birth:0});const
loaded=validateSave(old,scenarios,terrains);;})
```

**Required output / success criteria**

```text
assert(o.pendingArrival)
assert(!g.s.provinces.some(p=>p.officers.includes(o.id)||p.hidden.includes(o.id)
||p.unclaimed.includes(o.id)))
assert(o.pendingArrival)
assert(!o.pendingArrival)
assert(g.province(o.arrivalProvince).unclaimed.includes(o.id))
assert(r.details.some(e=>e.officer===o.id))
assert(loaded.officers.find(o=>o.name==='Bao Xin').pendingArrival)
```

---

**Case / what it tests**

17. [Each event including clan destruction and succession has a separate artwork
frame and real occupation reports retain
it][test-source-140]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Each event including clan destruction and succession has a separate
artwork frame and real occupation reports retain it',()=>{;;const
g=fresh(),p=g.s.provinces.find(p=>p.owner===0&&p.officers.length>1&&p.neighbors.
some(id=>g.province(id).owner===255)),target=g.province(p.neighbors.find(id=>g.p
rovince(id).owner===255));g.execute('move',{province:p.id,officer:p.officers.fin
d(id=>id!==g.ruler().leader),target:target.id,gold:0,food:0});;;const
loaded=validateSave(g.s,scenarios,terrains);;})
```

**Required output / success criteria**

```text
assert.equal(Object.keys(EVENT_ART).length,14)
assert.equal(new Set(Object.values(EVENT_ART).map(([a,c])=>a+':'+c)).size,14)
assert.equal(g.s.lastEvent.art,'occupation')
assert.equal(target.owner,0)
assert.equal(loaded.lastEvent.art,'occupation')
```


<a id="tests-fidelity-tests-mjs"></a>
## tests/fidelity-tests.mjs

Source: [tests/fidelity-tests.mjs](../tests/fidelity-tests.mjs). Purpose: All
412 future records have canonical identities and valid province/year fields;
Every future identity appears once in every scenario and survives save/load
without overwriting native officers; Future arrivals respect their dates and
never resurrect a deceased identity; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/future-officers.mjs`,
`../mjs/campaign-fidelity.mjs`, `../mjs/monthly-events.mjs`,
`../mjs/battle.mjs`, `../mjs/geography.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [All 412 future records have canonical identities and valid province/year
fields][test-source-141]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All 412 future records have canonical identities and valid province/year
fields',()=>{;for(const rows of FUTURE_OFFICERS)for(const r of rows){;;;}})
```

**Required output / success criteria**

```text
assert.deepEqual(FUTURE_OFFICERS.map(x=>x.length),[161,104,75,42,21,9])
assert(r.rosterId>=0&&r.rosterId<352)
assert(r.arrivalProvince>=1&&r.arrivalProvince<=41)
assert(r.appearanceYear>=189&&r.appearanceYear<300)
```

---

**Case / what it tests**

2. [Every future identity appears once in every scenario and survives save/load
without overwriting native officers][test-source-142]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every future identity appears once in every scenario and survives
save/load without overwriting native officers',()=>{for(let n=0;n<6;n++){const
g=fresh(n),native=g.s.officers.map(o=>[o.name,o.rosterId]),r=report();g.s.year=M
ath.max(...FUTURE_OFFICERS[n].map(o=>o.appearanceYear));processArrivals(g,r);for
(const record of FUTURE_OFFICERS[n]);for(let i=0;i<255;i++);const
length=g.s.officers.length;processArrivals(g,r);;valid(g);}})
```

**Required output / success criteria**

```text
assert.equal(g.s.officers.filter(o=>o.rosterId===record.rosterId).length,1,recor
d.name)
assert.deepEqual([g.s.officers[i].name,g.s.officers[i].rosterId],native[i])
assert.equal(g.s.officers.length,length)
```

---

**Case / what it tests**

3. [Future arrivals respect their dates and never resurrect a deceased
identity][test-source-143]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Future arrivals respect their dates and never resurrect a deceased
identity',()=>{const
g=fresh(),record=FUTURE_OFFICERS[0].find(r=>!g.s.officers.some(o=>o.rosterId===r
.rosterId));g.s.year=record.appearanceYear-1;processArrivals(g,report());;g.s.ye
ar=record.appearanceYear;processArrivals(g,report());const
o=g.s.officers.find(o=>o.rosterId===record.rosterId);o.dead=true;for(const p of
g.s.provinces)p.unclaimed=p.unclaimed.filter(id=>id!==o.id);processArrivals(g,re
port());;valid(g);})
```

**Required output / success criteria**

```text
assert(!g.s.officers.some(o=>o.rosterId===record.rosterId))
assert(o.dead)
```

---

**Case / what it tests**

4. [Corrected native service and personality fields include the Liu Bei
trio][test-source-144]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Corrected native service and personality fields include the Liu Bei
trio',()=>{const s=scenarios[0],p=s.provinces[3];;for(const id of
p.officers){const o=s.officers[id];;;;}})
```

**Required output / success criteria**

```text
assert.equal(p.officers.length,3)
assert.equal(o.serviceSince,189)
assert(Number.isInteger(o.blood))
assert(o.benevolence>=0&&o.benevolence<=100)
```

---

**Case / what it tests**

5. [Both exile decisions are required; taking all local generals preserves their
troops, resources and human control][test-source-145]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Both exile decisions are required; taking all local generals preserves
their troops, resources and human control',()=>{const
g=fresh(),p=g.province(9),ids=[...p.officers],gold=p.gold,food=p.food;atomic(g,(
)=>g.execute('selfExile',{province:9,confirm:true}));g.execute('selfExile',{prov
ince:9,confirm:true,takeAll:true});;;;;;valid(g);})
```

**Required output / success criteria**

```text
assert.deepEqual(g.roaming().officers,ids)
assert.equal(g.roaming().gold,gold)
assert.equal(g.roaming().food,food)
assert(g.s.humanRulers.includes(0))
assert(!g.s.campaignEnded)
```

---

**Case / what it tests**

6. [Ruler-only exile carries the ruler and permits settlement after
load][test-source-146]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Ruler-only exile carries the ruler and permits settlement after
load',()=>{const
g=fresh();g.execute('selfExile',{province:9,confirm:true,takeAll:false});;g.s=va
lid(g);const
empty=g.province(9).neighbors.find(id=>g.province(id).owner===255);;g.roam('move
',empty);g.roam('settle');;;valid(g);})
```

**Required output / success criteria**

```text
assert.deepEqual(g.roaming().officers,[0])
assert(empty)
assert.equal(g.province(empty).governor,0)
assert(!g.roaming())
```

---

**Case / what it tests**

7. [Human succession offers an eligible choice and a sole ruler can die without
becoming immortal][test-source-147]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human succession offers an eligible choice and a sole ruler can die
without becoming immortal',()=>{const
g=fresh(),p=g.province(9),r=g.ruler(),candidate=p.officers.find(id=>id!==r.leade
r);;;valid(g);chooseSuccessor(g,0,candidate);;;valid(g);const
h=fresh();h.execute('selfExile',{province:9,confirm:true,takeAll:false});h.roam(
'move',h.province(9).neighbors.find(id=>h.province(id).owner===255));h.roam('set
tle');;h.reconcileControl();;valid(h);})
```

**Required output / success criteria**

```text
assert(officerDeath(g,r.leader,report()))
assert.equal(g.s.successorDecisions.length,1)
assert.equal(r.leader,candidate)
assert.equal(p.governor,candidate)
assert(officerDeath(h,0,report()))
assert(h.s.campaignEnded)
```

---

**Case / what it tests**

8. [Month-long warfare saves field positions, purses and force commitments, then
resumes after strategic rollover][test-source-148]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Month-long warfare saves field positions, purses and force commitments,
then resumes after strategic rollover',()=>{const
{g,b}=battle();b.day=30;b.completedDays=29;g.battleAction('end');g.battleAction(
'end');;;atomic(g,()=>g.execute('search',{province:9,officer:34}));g.s=valid(g);
g.s.monthlyState.omens=[{officer:b.leaders.attack,due:g.s.year*12+g.s.month}];g.
endMonth();;;g.s.monthlyReview=null;;;;;;valid(g);})
```

**Required output / success criteria**

```text
assert(!g.s.battle)
assert.equal(g.s.wars.length,1)
assert(!g.officer(b.leaders.attack).dead)
assert(g.s.monthlyState.omens.some(x=>x.officer===b.leaders.attack))
assert(g.resumeWars())
assert.equal(g.s.battle.day,1)
assert.equal(g.s.battle.elapsedDays,30)
assert.equal(g.s.battle.gold.attack,500)
assert.equal(g.s.wars.length,0)
```

---

**Case / what it tests**

9. [A ruler outside a suspended army can die and succession synchronizes the
saved war without replacing its commander][test-source-149]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A ruler outside a suspended army can die and succession synchronizes the
saved war without replacing its commander',()=>{const
g=fresh(1);g.s.settings.battleView='all';const
source=g.province(g.ruler().home),target=source.neighbors.map(id=>g.province(id)
).find(p=>p.owner!==255&&p.owner!==0),officer=source.officers.find(id=>id!==g.ru
ler().leader&&g.officer(id).soldiers);;g.invade({province:source.id,target:targe
t.id,officers:[officer],food:20000,gold:100});while(g.s.battle.phase==='deployme
nt')aiBattle(g);const
b=g.s.battle;b.food={attack:1000000,defend:1000000};b.day=30;b.completedDays=29;
g.battleAction('end');g.battleAction('end');const
old=g.ruler().leader;;g.syncWarRulers();;;valid( … (complete input/procedure at
linked L23–23)
```

**Required output / success criteria**

```text
assert(target&&officer!==undefined)
assert(officerDeath(g,old,report()))
assert.equal(g.s.wars[0].rulers.attack,g.ruler().leader)
assert.equal(g.s.wars[0].leaders.attack,officer)
```

---

**Case / what it tests**

10. [Field gold is separate from the source treasury and remains at the
battlefield after retreat][test-source-150]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Field gold is separate from the source treasury and remains at the
battlefield after retreat',()=>{const
g=fresh(),gold=g.province(9).gold;g.invade({province:9,target:8,governor:33,offi
cers:[0,34],food:20000,gold:500});;while(g.s.battle.phase==='deployment')aiBattl
e(g);g.battleAction('end');g.battleAction('retreat');;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(g.province(9).gold,gold-500)
assert.equal(g.province(9).gold,gold-500)
assert(g.province(8).gold>=500)
```

---

**Case / what it tests**

11. [Commander defeat and zero food settle battles
immediately][test-source-151]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Commander defeat and zero food settle battles immediately',()=>{const
a=battle();a.b.units.find(u=>u.id===a.b.leaders.attack).captured=true;a.g.battle
Action('end');;const z=battle();z.b.food.defend=0;z.g.battleAction('end');;})
```

**Required output / success criteria**

```text
assert.equal(a.g.s.lastBattle.winner,'defend')
assert.equal(z.g.s.lastBattle.winner,'attack')
```

---

**Case / what it tests**

12. [Jungle concealment applies to rendering and inspection until combat reveals
the enemy][test-source-152]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Jungle concealment applies to rendering and inspection until combat
reveals the enemy',()=>{const
{g,b}=battle(),u=b.units.find(x=>x.side==='attack'),v=b.units.find(x=>x.side==='
defend');u.q=0;u.r=0;v.q=6;v.r=6;b.terrain[v.r*13+v.q]=1;;atomic(g,()=>g.battleA
ction('view',{target:v.id}));u.q=6;u.r=5;;v.revealedTo=['attack'];;})
```

**Required output / success criteria**

```text
assert(!visibleUnit(b,v,'attack'))
assert(!visibleUnit(b,v,'attack'))
assert(visibleUnit(b,v,'attack'))
```

---

**Case / what it tests**

13. [Multi-general movement requires an abandonment decision and preserves both
provincial governors][test-source-153]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Multi-general movement requires an abandonment decision and preserves both
provincial governors',()=>{const
g=fresh(),p=g.province(9),target=p.neighbors.find(id=>g.province(id).owner===255
),ids=[...p.officers];;atomic(g,()=>g.execute('moveParty',{province:9,target,off
icers:ids,gold:0,food:0}));g.execute('moveParty',{province:9,target,officers:ids
,gold:100,food:1000,abandon:true});;;;valid(g);})
```

**Required output / success criteria**

```text
assert(target)
assert.equal(g.province(9).owner,255)
assert.equal(g.province(target).governor,0)
assert.deepEqual(g.province(target).officers,ids)
```

---

**Case / what it tests**

14. [Remote appointment, adviser demotion and ruler-only gates preserve officer
membership][test-source-154]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Remote appointment, adviser demotion and ruler-only gates preserve officer
membership',()=>{const
g=fresh(),empty=g.province(9).neighbors.find(id=>g.province(id).owner===255);g.e
xecute('moveParty',{province:9,target:empty,officers:[34],gold:0,food:0});const
q=g.province(empty);g.execute('appointRealm',{province:9,target:q.id,officer:q.o
fficers[0],role:'governor'});;atomic(g,()=>g.execute('appointRealm',{province:q.
id,target:9,officer:0,role:'governor'}));const
advisor=g.ruler().advisor;g.execute('demoteAdvisor',{province:9});;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(q.governor,q.officers[0])
assert.equal(g.ruler().advisor,null)
assert.equal(g.officer(advisor).owner,0)
```

---

**Case / what it tests**

15. [Every recruitment method is a saved messenger mission; gold and horses are
spent only on their matching method][test-source-155]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every recruitment method is a saved messenger mission; gold and horses are
spent only on their matching method',()=>{for(const method of
['attention','horse','gold','letter']){const
g=fresh(),p=g.province(9),target=g.s.provinces.filter(q=>q.owner!==255&&q.owner!
==0).flatMap(q=>q.officers.filter(id=>id!==g.ruler(q.owner).leader)).find(id=>!g
.officer(id).dead&&g.officer(id).loyalty<100&&g.officer(id).blood===0);;p.horses
=2;const
gold=p.gold;g.execute('recruitMethod',{province:9,officer:33,target,method,amoun
t:100});;g.s=valid(g);travel(g);;;;valid(g);}})
```

**Required output / success criteria**

```text
assert(target!==undefined)
assert(g.s.journey)
assert.equal(g.officer(target).owner,0)
assert.equal(g.province(9).gold,gold-(method==='gold'?100:0))
assert.equal(g.province(9).horses,method==='horse'?1:2)
```

---

**Case / what it tests**

16. [Merchant trades consume a selected actor; exact multiples pay floor
division plus one][test-source-156]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Merchant trades consume a selected actor; exact multiples pay floor
division plus one',()=>{const
g=fresh(),p=g.province(9);p.merchant=true;p.ricePrice=40;const
gold=p.gold;g.execute('trade',{province:9,officer:33,mode:'buy',amount:80});;;at
omic(g,()=>g.execute('trade',{province:9,officer:33,mode:'buy',amount:1}));atomi
c(g,()=>g.execute('trade',{province:9,officer:34,mode:'sell',amount:1}));valid(g
);})
```

**Required output / success criteria**

```text
assert.equal(p.gold,gold-3)
assert(g.officer(33).acted)
```

---

**Case / what it tests**

17. [Gift refusal leaves the recipient treasury unchanged and consumes the envoy
action][test-source-157]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Gift refusal leaves the recipient treasury unchanged and consumes the
envoy action',()=>{const
g=fresh(),gold=g.province(9).gold,other=g.province(g.ruler(3).home),before=other
.gold;g.random=()=>.999;g.execute('diplomaticMission',{province:9,officer:33,mod
e:'gift',target:3,amount:100});travel(g);;;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(g.province(9).gold,gold)
assert.equal(other.gold,before)
assert(g.officer(33).acted)
```

---

**Case / what it tests**

18. [Fort construction validates terrain and persists into battlefield terrain
without mutating the shared base map][test-source-158]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Fort construction validates terrain and persists into battlefield terrain
without mutating the shared base map',()=>{const
g=fresh(),p=g.province(9),base=[...g.terrains[8]],i=base.findIndex(t=>t===0);g.e
xecute('buildFort',{province:9,officer:33,q:i%13,r:Math.floor(i/13)});;;g.s=vali
d(g);;atomic(g,()=>g.execute('buildFort',{province:9,officer:34,q:i%13,r:Math.fl
oor(i/13)}));})
```

**Required output / success criteria**

```text
assert.equal(provinceTerrain(p,base)[i],5)
assert.equal(g.terrains[8][i],0)
assert(g.province(9).forts.includes(i))
```

---

**Case / what it tests**

19. [Historic/Fiction and date-sensitive place names survive checkpoint
validation][test-source-159]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Historic/Fiction and date-sensitive place names survive checkpoint
validation',()=>{const g=fresh();g.s.historyMode='fiction';;;;;;})
```

**Required output / success criteria**

```text
assert.equal(valid(g).historyMode,'fiction')
assert(provinceLabel(g.province(17),220).startsWith('Xu county'))
assert(provinceLabel(g.province(17),221).startsWith('Xuchang'))
assert(provinceLabel(g.province(25),211).startsWith('Moling'))
assert(provinceLabel(g.province(25),212).startsWith('Jianye'))
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert.throws(fn);
assert.equal(JSON.stringify(g.s),old);
assert(++steps<200)
```

<a id="tests-mobile-layout-tests-mjs"></a>
## tests/mobile-layout-tests.mjs

Source: [tests/mobile-layout-tests.mjs](../tests/mobile-layout-tests.mjs).
Purpose: desktop governor is displayed with the ruler-summary font; battlefield
status has content height and no frame, including result playback; AI overlay
controls retain centred shared dimensions and mobile typography; additional
cases below.

Shared inputs: `style.css`, `index.html`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `jsdom`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [desktop governor is displayed with the ruler-summary
font][test-source-160]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const cssText=fs.readFileSync('style.css','utf8'),dom=new
JSDOM(fs.readFileSync('index.html','utf8')),d=dom.window.document; const
css=d.createElement('style');css.textContent=cssText;d.head.append(css); ;;
```

**Required output / success criteria**

```text
assert.notEqual(dom.window.getComputedStyle(d.querySelector('#governor')).displa
y,'none')
assert.equal(dom.window.getComputedStyle(d.querySelector('#governor')).fontFamil
y,dom.window.getComputedStyle(d.querySelector('#rulerName')).fontFamily)
```

---

**Case / what it tests**

2. [battlefield status has content height and no frame, including result
playback][test-source-161]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
mobile=d.createElement('style');mobile.textContent=[...css.sheet.cssRules].filte
r(r=>r.conditionText?.match(/max-height:\s*600px/)).flatMap(r=>[...r.cssRules].m
ap(x=>x.cssText)).join('\n');mobile.textContent+='\n'+cssText.slice(cssText.inde
xOf('/* v36:'));d.head.append(mobile);
d.querySelector('#game').classList.add('battle-active');
d.querySelector('#battleOrders').innerHTML='<div id="panelBody"><div
class="battle-actions
primary-battle">'+['Move','Attack','Wait','View','Strategy','Flee','End
turn'].map(x=>'<button>'+x+'</button>').join('')+'</div></div>';
d.querySelector('#battleComparison').innerHTML='<div class="army-column
army-labels"><span>Men</span><span>F/R</span></div>'; co … (complete
input/procedure at linked L4–13)
```

**Required output / success criteria**

```text
assert.equal(s.top,'auto')
assert.equal(s.height,'auto')
assert.equal(s.minHeight,'0px')
assert.equal(s.borderTopWidth,'0px')
assert.equal(s.boxShadow,'none')
assert.equal(s.paddingTop,'4px')
assert.equal(s.paddingBottom,'4px')
assert.equal(style(status).top,'50%')
assert.equal(style(status).height,'auto')
assert.equal(style(status).borderTopWidth,'0px')
```

---

**Case / what it tests**

3. [AI overlay controls retain centred shared dimensions and mobile
typography][test-source-162]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const selector of
['#date','#season','#provinceName','#rulerName','#governor','#eventTitle','#even
tText','#battleMenu','#battleHUD','#cheatToggle','#dialogTitle','#hudTabs
button','.primary-battle button','.province-label']){
if(selector==='.province-label'){const
badge=d.createElement('button');badge.className='province-label';d.querySelector
('#world').append(badge);} for(const node of d.querySelectorAll(selector)){;;} }
for(const selector of
['#menu','#cheatToggle','#battleMenu','#battleHUD','#closeHud','#hudTabs
button','#singleAIStep','#resumeHud','.primary-battle button'])for(const node of
d.querySelectorAll(selector)){;} ;;; const
bounds=mobile.textContent.match(/--command-height … (complete input/procedure at
linked L13–34)
```

**Required output / success criteria**

```text
assert.equal(style(node).fontSize,baseline.fontSize,selector+' font size')
assert.equal(style(node).fontFamily,baseline.fontFamily,selector+' font family')
assert.equal(style(node).height,'var(--command-height)',selector+' height')
assert.equal(style(d.querySelector('.battle-actions')).gridTemplateColumns,'repe
at(3,minmax(0,1fr))')
assert.equal(style(d.querySelector('#battleOrders')).overflow,'hidden')
assert.equal(style(d.querySelector('#panelBody')).overflow,'hidden')
assert(bounds)
assert(height*3+2*3+4<=h*.3,'Three command rows fit at '+h+'px landscape
height')
assert.equal(style(d.querySelector('.primary-battle button')).lineHeight,'1')
assert.equal(style(d.querySelector('.primary-battle
button')).overflowWrap,'anywhere')
assert.equal(style(d.querySelector('#portraitButton')).height,'100%')
assert.equal(style(d.querySelector('#expandEvent')).height,'100%')
assert.equal(style(footer).display,'flex')
assert.equal(style(footer).justifyContent,'center')
assert.equal(style(b).width,'var(--dialog-command-width)')
assert.equal(style(b).maxWidth,'var(--dialog-command-width)')
assert.equal(style(b).height,'var(--command-height)')
assert.equal(style(footer).justifyContent,'center')
assert.equal(style(footer.firstChild).flexGrow,'0')
assert.equal(style(card).height,'auto')
assert.equal(style(card).alignItems,'flex-start')
assert.equal(style(card).whiteSpace,'normal')
assert.equal(style(card.querySelector('span')).lineHeight,'1.5')
assert.equal(style(card.querySelector('canvas')).height,'38.39px')
assert.equal(d.querySelector('#toast').parentElement.id,'world')
assert.equal(style(d.querySelector('#hudTabs')).gridTemplateColumns,'repeat(4,mi
nmax(0,1fr))')
assert.equal(style(d.querySelector('.legend-color.neutral')).marginLeft,'0px')
assert.equal(style(d.querySelector('#provinceConnections')).bottom,'calc(14px +
var(--command-height))')
assert.equal(style(debugRow).justifyContent,'center')
assert.equal(style(debugRow).display,'flex')
assert.equal(style(b).width,'var(--dialog-command-width)')
assert.equal(style(b).height,'var(--command-height)')
assert.equal(style(b).flexGrow,'0')
assert.equal(style(b).fontSize,baseline.fontSize)
assert.equal(style(b).fontFamily,baseline.fontFamily)
```

---

**Case / what it tests**

4. [centred equal-width single/multiple actions and content-sized event
cards][test-source-163]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

5. [mobile typography, command targets, retained artwork frames and three-row
height budget (270–600px)][test-source-164]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

6. [all three governor summary rows fit the shortest mobile panel without
reducing the shared font][test-source-165]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; ;; ; for(const h of [270,320,375,393,500,600]){const
heading=Math.max(+bounds[1],Math.min(h*+bounds[2]/100,+bounds[3]));;}
```

**Required output / success criteria**

```text
assert.equal(style(d.querySelector('.province-summary')).marginTop,'1px')
assert.equal(style(d.querySelector('.province-summary')).lineHeight,'1.1')
assert.equal(style(d.querySelector('.province-heading')).minHeight,'var(--comman
d-height)')
assert(14+heading+1+3*12*1.1<=h*.3,'Governor summary fits at '+h+'px landscape
height')
```

---

**Case / what it tests**

7. [mobile governor is displayed, including legacy short-screen
rules][test-source-166]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; ;
```

**Required output / success criteria**

```text
assert.notEqual(style(d.querySelector('#governor')).display,'none')
```


<a id="tests-monthly-tests-mjs"></a>
## tests/monthly-tests.mjs

Source: [tests/monthly-tests.mjs](../tests/monthly-tests.mjs). Purpose: New
campaigns begin with a dated historical council and a restorable review; Every
month resolves its council before the new factions begin; Applying the same
monthly events twice does not charge or damage anything twice; additional cases
below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/monthly-events.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [New campaigns begin with a dated historical council and a restorable
review][test-source-167]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('New campaigns begin with a dated historical council and a restorable
review',()=>{const g=fresh();;;const
loaded=validateSave(g.s,scenarios,terrains);;;})
```

**Required output / success criteria**

```text
assert.equal(g.s.lastReport.details[0].kind,'history')
assert.equal(g.s.monthlyReview.month,1)
assert.deepEqual(loaded.monthlyReview,g.s.monthlyReview)
assert.deepEqual(loaded.lastReport,g.s.lastReport)
```

---

**Case / what it tests**

2. [Every month resolves its council before the new factions
begin][test-source-168]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every month resolves its council before the new factions begin',()=>{const
g=fresh();g.random=()=>.99;for(let
month=2;month<=12;month++){g.s.completed=g.s.rulers.map(r=>r.id).filter(id=>id!=
=g.s.player);const
r=g.finishFactionTurn();;;;;validateSave(g.s,scenarios,terrains);}})
```

**Required output / success criteria**

```text
assert(r)
assert.equal(r.month,month)
assert.equal(g.s.monthlyReview.month,month)
assert(r.details.length)
```

---

**Case / what it tests**

3. [Applying the same monthly events twice does not charge or damage anything
twice][test-source-169]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Applying the same monthly events twice does not charge or damage anything
twice',()=>{const
g=fresh();g.s.month=5;g.random=()=>0;runMonthlyEvents(g,report());const
snapshot=JSON.stringify(g.s);runMonthlyEvents(g,report());;})
```

**Required output / success criteria**

```text
assert.equal(JSON.stringify(g.s),snapshot)
```

---

**Case / what it tests**

4. [Historical cards occur once and preserve the campaign
ownership][test-source-170]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Historical cards occur once and preserve the campaign
ownership',()=>{const g=fresh();g.s.year=192;g.s.month=1;g.random=()=>.99;const
owners=g.s.provinces.map(p=>p.owner),r=report();runMonthlyEvents(g,r);;;const
next=report();g.s.month=2;runMonthlyEvents(g,next);;})
```

**Required output / success criteria**

```text
assert(r.details.some(e=>e.title.includes('192')))
assert.deepEqual(g.s.provinces.map(p=>p.owner),owners)
assert(!next.details.some(e=>e.kind==='history'))
```

---

**Case / what it tests**

5. [Hidden adults remain searchable; young historical generals come of age in
January][test-source-171]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hidden adults remain searchable; young historical generals come of age in
January',()=>{const
g=fresh(),p=g.s.provinces.find(p=>p.hidden.length),id=p.hidden[0],adult=p.hidden
[1];g.officer(id).birth=175;g.s.year=190;g.s.month=1;g.random=()=>.99;const
r=report();runMonthlyEvents(g,r);;;if(adult!==undefined);;validateSave(g.s,scena
rios,terrains);})
```

**Required output / success criteria**

```text
assert(p.unclaimed.includes(id))
assert(!p.hidden.includes(id))
assert(p.hidden.includes(adult))
assert(r.details.some(e=>e.officer===id))
```

---

**Case / what it tests**

6. [Old generals can die and rulers pass to a valid saved
successor][test-source-172]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Old generals can die and rulers pass to a valid saved
successor',()=>{const
g=fresh(),r=g.ruler(),old=g.officer(r.leader);old.birth=100;g.s.year=190;g.s.mon
th=1;g.random=()=>0;runMonthlyEvents(g,report());;;g.normalize();validateSave(g.
s,scenarios,terrains);;})
```

**Required output / success criteria**

```text
assert(old.dead)
assert.notEqual(r.leader,old.id)
assert(g.s.provinces.some(p=>p.owner===r.id&&p.officers.includes(r.leader)))
```

---

**Case / what it tests**

7. [Flood losses are mitigated by dikes and remain in
range][test-source-173]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Flood losses are mitigated by dikes and remain in range',()=>{const
a=fresh(),z=fresh(),p=a.province(9),q=z.province(9);p.flood=0;q.flood=100;const
old=p.food,protectedRice=q.food;a.random=z.random=()=>0;disaster(a,p,'flood',rep
ort());disaster(z,q,'flood',report());;;;a.normalize();validateSave(a.s,scenario
s,terrains);})
```

**Required output / success criteria**

```text
assert.equal(p.food,old)
assert.equal(q.food,protectedRice)
assert(p.population<q.population)
```

---

**Case / what it tests**

8. [Locusts, typhoons, epidemics and uprisings affect the specified campaign
attributes][test-source-174]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Locusts, typhoons, epidemics and uprisings affect the specified campaign
attributes',()=>{for(const type of
['locust','typhoon','epidemic','uprising']){const
g=fresh(),p=g.province(9),before=structuredClone(p),soldiers=g.officer(0).soldie
rs,r=report();g.random=()=>0;disaster(g,p,type,r);;if(type==='locust'||type==='u
prising');if(type==='epidemic'||type==='uprising');if(type==='typhoon');g.normal
ize();validateSave(g.s,scenarios,terrains);}})
```

**Required output / success criteria**

```text
assert(r.details[0].title.includes(p.name))
assert(p.food<before.food)
assert(g.officer(0).soldiers<soldiers)
assert(p.land<before.land)
```

---

**Case / what it tests**

9. [Seasonal swarms spread only to fixed neighbouring provinces and disappear by
winter][test-source-175]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Seasonal swarms spread only to fixed neighbouring provinces and disappear
by winter',()=>{const
g=fresh();g.random=()=>0;disaster(g,g.province(9),'locust',report());g.s.month=4
;const r=report();runMonthlyEvents(g,r);for(const id of
g.province(9).neighbors);g.s.month=10;runMonthlyEvents(g,report());;})
```

**Required output / success criteria**

```text
assert(r.details.some(e=>e.province===id&&e.title.includes('Locust')))
assert(!g.s.monthlyState.disasters.some(d=>d.type==='locust'))
```

---

**Case / what it tests**

10. [Imprisoned officers remain in their province while free generals may
wander][test-source-176]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Imprisoned officers remain in their province while free generals may
wander',()=>{const
g=fresh(),p=g.s.provinces.find(p=>p.hidden.length),id=p.hidden.shift();p.unclaim
ed.push(id);g.officer(id).prisonerOf=0;g.random=()=>0;g.s.month=2;runMonthlyEven
ts(g,report());;validateSave(g.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert(p.unclaimed.includes(id))
```

---

**Case / what it tests**

11. [Rebellion updates officer lists and governor references with a valid
save][test-source-177]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rebellion updates officer lists and governor references with a valid
save',()=>{const
g=fresh(),p=g.province(10),ids=[...p.officers],r=report();disaster(g,p,'rebellio
n',r);g.normalize();;;;;;g.s.player=p.owner;validateSave(g.s,scenarios,terrains)
;})
```

**Required output / success criteria**

```text
assert.notEqual(p.owner,0)
assert.notEqual(p.owner,255)
assert.equal(g.ruler(p.owner).leader,p.governor)
assert(ids.every(id=>p.officers.includes(id)||p.unclaimed.includes(id)))
assert.equal(g.officer(p.governor).owner,p.owner)
```

---

**Case / what it tests**

12. [Invalid council checkpoints and active-disaster records are
rejected][test-source-178]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Invalid council checkpoints and active-disaster records are
rejected',()=>{const
g=fresh(),a=structuredClone(g.s);a.monthlyReview.index=900;;const
b=structuredClone(g.s);b.monthlyState.disasters=[{province:42,type:'locust',born
:0,lastSpread:0}];;})
```

**Required output / success criteria**

```text
assert.throws(()=>validateSave(a,scenarios,terrains))
assert.throws(()=>validateSave(b,scenarios,terrains))
```


<a id="tests-province-tests-mjs"></a>
## tests/province-tests.mjs

Source: [tests/province-tests.mjs](../tests/province-tests.mjs). Purpose: Hire
uses hundreds, original population reserve and shared capacity; resources and
assignments are conserved; Reassignment rejects unconfirmed remaining men and
overspending, then returns confirmed disbands to population; Train improves
every local army and consumes only the chosen instructor action; additional
cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `../mjs/ruler-family.mjs`, `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/province-rules.mjs`,
`../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Hire uses hundreds, original population reserve and shared capacity;
resources and assignments are conserved][test-source-179]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hire uses hundreds, original population reserve and shared capacity;
resources and assignments are conserved',()=>{const
g=fresh(),p=g.province(9),cap=hireCapacity(g,p),gold=p.gold,food=p.food,pop=p.po
pulation,alloc=assignments(g,p);;alloc[34]+=100;g.execute('hireArmy',{province:9
,officer:33,hundreds:1,allocations:alloc});;;;;;valid(g);const
h=fresh();h.province(9).population=50000;;atomic(h,()=>h.execute('hireArmy',{pro
vince:9,officer:33,hundreds:1,allocations:assignments(h,h.province(9))}));})
```

**Required output / success criteria**

```text
assert(cap>=1)
assert.equal(p.gold,gold-10)
assert.equal(p.food,food-100)
assert.equal(p.population,pop-100)
assert.equal(g.officer(34).soldiers,2100)
assert(g.officer(33).acted)
assert.equal(hireCapacity(h,h.province(9)),0)
```

---

**Case / what it tests**

2. [Reassignment rejects unconfirmed remaining men and overspending, then
returns confirmed disbands to population][test-source-180]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Reassignment rejects unconfirmed remaining men and overspending, then
returns confirmed disbands to population',()=>{const
g=fresh(),p=g.province(9),pop=p.population,alloc=assignments(g,p);alloc[34]-=100
;atomic(g,()=>g.execute('reassignArmy',{province:9,officer:33,allocations:alloc}
));const
p2=g.province(9);g.execute('reassignArmy',{province:9,officer:33,allocations:all
oc,disband:true});;;valid(g);const
h=fresh(),a=assignments(h,h.province(9));a[34]=10001;atomic(h,()=>h.execute('rea
ssignArmy',{province:9,officer:33,allocations:a,disband:true}));})
```

**Required output / success criteria**

```text
assert.equal(p2.population,pop+100)
assert.equal(g.officer(34).soldiers,1900)
```

---

**Case / what it tests**

3. [Train improves every local army and consumes only the chosen instructor
action][test-source-181]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Train improves every local army and consumes only the chosen instructor
action',()=>{const
g=fresh(),p=g.province(9),before=p.officers.map(id=>g.officer(id).training);g.ex
ecute('trainArmy',{province:9,officer:34});p.officers.forEach((id,i)=>);;;valid(
g);})
```

**Required output / success criteria**

```text
assert(g.officer(id).training>before[i])
assert(g.officer(34).acted)
assert(!g.officer(33).acted)
```

---

**Case / what it tests**

4. [Reward respects a ready governor; horse and writings alter stock, loyalty
and INT without gold for horse or writings][test-source-182]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Reward respects a ready governor; horse and writings alter stock, loyalty
and INT without gold for horse or writings',()=>{for(const kind of
['rewardGold','rewardHorse','rewardWritings']){const
g=fresh(),p=g.province(9);p.gold=1000;p.horses=2;g.ruler().advisor=33;g.officer(
33).int=95;g.s.monthlyAdvice.intelligence[33]=100;g.officer(34).int=60;g.officer
(34).loyalty=70;g.execute(kind,{province:9,officer:34,amount:50});;;if(kind==='r
ewardHorse'){;;}if(kind==='rewardWritings');else
;valid(g);g.officer(0).acted=true;atomic(g,()=>g.execute(kind,{province:9,office
r:34,amount:1}));}})
```

**Required output / success criteria**

```text
assert.equal(p.gold,kind==='rewardGold'?950:1000)
assert(g.officer(p.governor).acted)
assert.equal(p.horses,1)
assert(!g.officer(34).hasHorse)
assert.equal(g.officer(34).int,61)
assert(g.officer(34).loyalty>70)
```

---

**Case / what it tests**

5. [Advice requires a local advisor, caches one intelligence roll, and
rumours/healing require travelling
visitors][test-source-183]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Advice requires a local advisor, caches one intelligence roll, and
rumours/healing require travelling visitors',()=>{const
g=fresh(),p=g.province(9);g.ruler().advisor=33;g.officer(33).int=100;g.s.monthly
Advice.intelligence[33]=100;p.food=1;;const
seed=g.s.seed;;;g.s.visitors={month:g.s.year*12+g.s.month-1,huaTuo:9,scholar:9,c
ritic:1};;g.officer(34).sick=true;g.officer(34).illMonths=3;g.execute('healing',
{province:9});;;valid(g);g.s.month++;g.random=()=>.99;covertUpkeep(g);;})
```

**Required output / success criteria**

```text
assert(provinceAdvice(g,p).includes('only 1 food'))
assert.equal(provinceAdvice(g,p),provinceAdvice(g,p))
assert.equal(g.s.seed,seed)
assert(provinceRumours(g,p).startsWith('Sima Hui:'))
assert(!g.officer(34).sick)
assert.equal(g.officer(34).illMonths,0)
assert.equal(updateVisitors(g).month,g.s.year*12+g.s.month-1)
```

---

**Case / what it tests**

6. [Alliance, gift, marriage and cancellation change reciprocal diplomatic state
and preserve save invariants][test-source-184]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Alliance, gift, marriage and cancellation change reciprocal diplomatic
state and preserve save invariants',()=>{const
g=fresh(),p=g.province(9),r=g.ruler(3);g.execute('diplomaticMission',{province:9
,mode:'alliance',target:3,officer:33});;;const
gold=p.gold;g.execute('diplomaticMission',{province:9,mode:'gift',target:3,offic
er:34,amount:100});;g.execute('diplomaticMission',{province:9,mode:'marriage',ta
rget:3,officer:35});;;g.execute('diplomaticMission',{province:9,mode:'cancel',ta
rget:3});;;valid(g);})
```

**Required output / success criteria**

```text
assert(g.ruler().alliances.includes(3))
assert(r.alliances.includes(0))
assert.equal(p.gold,gold-100)
assert.equal(g.ruler().daughterGivenTo,3)
assert(r.daughtersReceived.includes(0))
assert(!g.ruler().alliances.includes(3))
assert(!r.alliances.includes(0))
```

---

**Case / what it tests**

7. [Refused missions consume the envoy action, but invalid targets and gifts are
atomic][test-source-185]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Refused missions consume the envoy action, but invalid targets and gifts
are atomic',()=>{const
g=fresh();atomic(g,()=>g.execute('diplomaticMission',{province:9,mode:'gift',tar
get:3,officer:34,amount:99}));g.random=()=>.99;g.execute('diplomaticMission',{pr
ovince:9,mode:'alliance',target:3,officer:34});;;valid(g);})
```

**Required output / success criteria**

```text
assert(g.officer(34).acted)
assert(!g.ruler().alliances.includes(3))
```

---

**Case / what it tests**

8. [Joint invasion requires an ally, brings their formations from their own
approach and returns survivors to their
realm][test-source-186]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Joint invasion requires an ally, brings their formations from their own
approach and returns survivors to their realm',()=>{const
g=fresh();atomic(g,()=>g.execute('diplomaticMission',{province:9,mode:'joint',ta
rget:10,enemy:8,officer:33}));g.execute('diplomaticMission',{province:9,mode:'al
liance',target:10,officer:33});g.execute('diplomaticMission',{province:9,mode:'j
oint',target:10,enemy:8,officer:34});g.invade({province:9,target:8,governor:33,o
fficers:[0,35],food:10000});const
b=g.s.battle,allies=b.units.filter(u=>u.allyOwner===10);;;;valid(g);while(b.phas
e==='deployment')aiBattle(g);g.battleAction('end');g.battleAction('flee',{unit:b
.leaders.attack,confirmArmy:true});for(const u of  … (complete input/procedure
at linked L19–19)
```

**Required output / success criteria**

```text
assert.equal(allies.length,2)
assert(allies.every(u=>u.placed&&u.origin===16&&unitOwner(b,u)===10))
assert.equal(g.s.jointPlans.length,0)
assert.equal(g.officer(u.id).owner,10)
assert(g.province(16).officers.includes(u.id))
```

---

**Case / what it tests**

9. [An impossible invasion restores allied provisions, actions, plans and RNG
atomically][test-source-187]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An impossible invasion restores allied provisions, actions, plans and RNG
atomically',()=>{const
g=fresh();g.ruler().alliances.push(10);g.ruler(10).alliances.push(0);g.s.jointPl
ans=[{ruler:0,ally:10,enemy:8,expires:g.s.year*12+g.s.month}];g.terrains[7]=Arra
y(156).fill(3);g.terrains[7][80]=6;atomic(g,()=>g.invade({province:9,target:8,go
vernor:33,officers:[0,34],food:10000}));valid(g);})
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

10. [Betrayal and forged letters lower subordinate loyalty; a saved valid pact
switches sides during invasion][test-source-188]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Betrayal and forged letters lower subordinate loyalty; a saved valid pact
switches sides during invasion',()=>{const
g=fresh(),target=g.officer(115),loy=target.loyalty;g.execute('spyMission',{provi
nce:9,mode:'betrayal',officer:33,target:115});;;g.execute('spyMission',{province
:9,mode:'forged',officer:34,target:125});valid(g);g.invade({province:9,target:8,
governor:33,officers:[0,35],food:10000});;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(target.betrayalFor,0)
assert(target.loyalty<loy)
assert(g.s.battle.units.find(u=>u.id===115).betrayed)
assert.equal(g.s.battle.units.find(u=>u.id===115).side,'attack')
```

---

**Case / what it tests**

11. [Expired betrayal and joint plans cannot affect later
wars][test-source-189]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Expired betrayal and joint plans cannot affect later wars',()=>{const
g=fresh(),month=g.s.year*12+g.s.month-1;g.officer(115).betrayalFor=0;g.officer(1
15).betrayalUntil=month-1;g.s.jointPlans=[{ruler:0,ally:10,enemy:8,expires:month
-1}];covertUpkeep(g);;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(g.officer(115).betrayalFor,undefined)
assert.equal(g.s.jointPlans.length,0)
```

---

**Case / what it tests**

12. [Infiltration moves a fully loyal subordinate as a free general, then
undermines the enemy once recruited][test-source-190]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Infiltration moves a fully loyal subordinate as a free general, then
undermines the enemy once recruited',()=>{const
g=fresh(),o=g.officer(34);o.loyalty=100;g.execute('spyMission',{province:9,mode:
'infiltrate',officer:34,target:8});;;;g.s.player=12;g.execute('recruit',{provinc
e:8,officer:12,target:34});;const
before=g.officer(115).loyalty;covertUpkeep(g);;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(o.owner,255)
assert(g.province(8).unclaimed.includes(34))
assert(!g.province(9).officers.includes(34))
assert.equal(o.owner,12)
assert(g.officer(115).loyalty<before)
```

---

**Case / what it tests**

13. [Rival tigers uses two messengers and creates hostility between
rivals][test-source-191]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rival tigers uses two messengers and creates hostility between
rivals',()=>{const
g=fresh(),before=g.ruler(3).relations[10]??50;g.execute('spyMission',{province:9
,mode:'rival',target:3,other:10,officer:33,second:34});;;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(g.ruler(3).relations[10],Math.min(100,before+20))
assert(g.officer(33).acted&&g.officer(34).acted)
```

---

**Case / what it tests**

14. [Tiger and wolf creates an independent realm for a rival
governor][test-source-192]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Tiger and wolf creates an independent realm for a rival
governor',()=>{const
g=fresh(),p=g.province(16);p.governor=87;g.officer(87).loyalty=1;g.execute('spyM
ission',{province:9,mode:'wolf',officer:33,target:87});;;;valid(g);})
```

**Required output / success criteria**

```text
assert.notEqual(p.owner,10)
assert.notEqual(p.owner,255)
assert.equal(g.ruler(p.owner).leader,87)
```

---

**Case / what it tests**

15. [Only the ready ruler can delegate another own province; direct and self
rule persist][test-source-193]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Only the ready ruler can delegate another own province; direct and self
rule persist',()=>{const
g=fresh();g.execute('move',{province:9,target:17,officer:34,gold:0,food:0});cons
t
p=g.province(17);g.execute('delegateRealm',{province:9,target:17,mode:'self'});;
valid(g);atomic(g,()=>g.execute('delegateRealm',{province:9,target:17,mode:'dire
ct'}));g.officer(0).acted=false;g.execute('delegateRealm',{province:9,target:17,
mode:'direct'});;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(p.delegate,'domestic')
assert.equal(g.province(17).delegate,'manual')
```

---

**Case / what it tests**

16. [Dismiss conceals a subordinate nearby; self-exile requires both choices and
preserves campaign control][test-source-194]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Dismiss conceals a subordinate nearby; self-exile requires both choices
and preserves campaign control',()=>{const
g=fresh();g.execute('dismiss',{province:9,officer:34});;;valid(g);atomic(g,()=>g
.execute('selfExile',{province:9}));atomic(g,()=>g.execute('selfExile',{province
:9,confirm:true}));g.execute('selfExile',{province:9,confirm:true,takeAll:false}
);;;;;valid(g);atomic(g,()=>g.execute('search',{province:9,officer:33}));})
```

**Required output / success criteria**

```text
assert.equal(g.officer(34).owner,255)
assert(g.province(9).neighbors.some(id=>g.province(id).hidden.includes(34)))
assert(!g.s.campaignEnded)
assert(g.s.humanRulers.includes(0))
assert(g.roaming())
assert(!g.s.provinces.some(p=>p.owner===0))
```

---

**Case / what it tests**

17. [Forged covert, visitor and marriage save fields are
rejected][test-source-195]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Forged covert, visitor and marriage save fields are
rejected',()=>{for(const corrupt of
[g=>g.officer(115).spyFor=99,g=>g.s.visitors.huaTuo=42,g=>g.ruler().marriedTo=3]
){const g=fresh();corrupt(g);;}})
```

**Required output / success criteria**

```text
assert.throws(()=>valid(g))
```

---

**Case / what it tests**

18. [Accepted threats transfer a rival realm, while source service years advance
and new recruitment starts at one][test-source-196]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Accepted threats transfer a rival realm, while source service years
advance and new recruitment starts at one',()=>{const
g=fresh(),since=g.officer(34).serviceSince;;g.s.year++;;g.execute('diplomaticMis
sion',{province:9,mode:'threat',target:12,officer:33});;;;valid(g);})
```

**Required output / success criteria**

```text
assert(Number.isInteger(since))
assert.equal(g.s.year-since+1,scenarios[0].year-since+2)
assert.equal(g.province(8).owner,0)
assert.equal(g.officer(12).owner,0)
assert(!g.s.provinces.some(p=>p.owner===12))
```

---

**Case / what it tests**

19. [Actual faction rollover expires covert pacts and refreshes travelling
visitors once per month][test-source-197]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Actual faction rollover expires covert pacts and refreshes travelling
visitors once per month',()=>{const
g=fresh(),month=g.s.year*12+g.s.month-1;g.officer(115).betrayalFor=0;g.officer(1
15).betrayalUntil=month;g.s.jointPlans=[{ruler:0,ally:10,enemy:8,expires:month}]
;let safety=0;while(g.s.month===1){g.finishFactionTurn();;};;;valid(g);})
```

**Required output / success criteria**

```text
assert(++safety<=20)
assert.equal(g.officer(115).betrayalFor,undefined)
assert.equal(g.s.jointPlans.length,0)
assert.equal(g.s.visitors.month,month+1)
```

---

**Case / what it tests**

20. [Joint invasion rejects allies of either partner before consuming an action
or provisions][test-source-198]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Joint invasion rejects allies of either partner before consuming an action
or provisions',()=>{for(const partner of [0,10]){const
g=fresh();g.ruler().alliances.push(10);g.ruler(10).alliances.push(0);g.ruler(par
tner).alliances.push(12);g.ruler(12).alliances.push(partner);atomic(g,()=>g.exec
ute('diplomaticMission',{province:9,mode:'joint',target:10,enemy:8,officer:33}))
;;;valid(g);}})
```

**Required output / success criteria**

```text
assert(!g.officer(33).acted)
assert.equal(g.s.jointPlans.length,0)
```

---

**Case / what it tests**

21. [A new alliance cancels pending joint plans against that realm without
charging the invasion][test-source-199]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A new alliance cancels pending joint plans against that realm without
charging the invasion',()=>{const
g=fresh();g.execute('diplomaticMission',{province:9,mode:'alliance',target:10,of
ficer:33});g.execute('diplomaticMission',{province:9,mode:'joint',target:10,enem
y:8,officer:34});;g.execute('diplomaticMission',{province:9,mode:'alliance',targ
et:12,officer:35});;valid(g);})
```

**Required output / success criteria**

```text
assert.equal(g.s.jointPlans.length,1)
assert.equal(g.s.jointPlans.length,0)
```

---

**Case / what it tests**

22. [Self-exile remains playable through rest, saved movement and
settlement][test-source-200]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Self-exile remains playable through rest, saved movement and
settlement',()=>{const
g=fresh();g.execute('selfExile',{province:9,confirm:true,takeAll:true});const
party=g.roaming();;valid(g);const
target=g.province(9).neighbors.find(id=>g.province(id).owner===255);if(target){g
.roam('move',target);g.roam('settle');;}else g.roam('rest');valid(g);})
```

**Required output / success criteria**

```text
assert(party.officers.includes(g.ruler().leader))
assert.equal(g.province(target).owner,0)
```

---

**Case / what it tests**

23. [Native daughter availability survives saves and blocks marriage atomically
when absent or already married][test-source-201]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native daughter availability survives saves and blocks marriage atomically
when absent or already married',()=>{const
g=fresh(),r=g.ruler();;r.hasDaughter=false;const
before=JSON.stringify(g.s);;;;valid(g);g.ruler().hasDaughter=true;g.execute('dip
lomaticMission',{province:9,mode:'marriage',target:3,officer:35});;valid(g);;con
st loaded=validateSave(structuredClone(g.s),scenarios,terrains);;})
```

**Required output / success criteria**

```text
assert.deepEqual(daughterStatus(r),{count:1,eligible:true,marriedTo:null})
assert.throws(()=>g.execute('diplomaticMission',{province:9,mode:'marriage',targ
et:3,officer:35}),/no daughters/)
assert.equal(JSON.stringify(g.s),before)
assert.equal(daughterStatus(g.ruler()).count,0)
assert.deepEqual(daughterStatus(g.ruler()),{count:1,eligible:false,marriedTo:3})
assert.throws(()=>g.execute('diplomaticMission',{province:9,mode:'marriage',targ
et:4,officer:33}),/one daughter/)
assert.equal(daughterStatus(loaded.rulers[0]).eligible,false)
```

---

**Case / what it tests**

24. [Malformed daughter flags are rejected and receiving a daughter leaves your
own daughter available][test-source-202]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Malformed daughter flags are rejected and receiving a daughter leaves your
own daughter available',()=>{const g=fresh();g.ruler().hasDaughter='yes';;const
h=fresh();h.execute('diplomaticMission',{province:9,mode:'marriage',target:3,off
icer:35});;valid(h);})
```

**Required output / success criteria**

```text
assert.throws(()=>valid(g),/daughter/)
assert(daughterStatus(h.ruler(3)).eligible)
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert.throws(fn)
```

<a id="tests-strategy-tests-mjs"></a>
## tests/strategy-tests.mjs

Source: [tests/strategy-tests.mjs](../tests/strategy-tests.mjs). Purpose: Launch
supports zero, twelve distinct humans and scenario-specific limits; All six
legacy scenarios migrate without losing domestic progress; Hotseat visits every
faction once before monthly upkeep; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/engine.mjs`, `../mjs/portraits.mjs`,
`../mjs/events.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Launch supports zero, twelve distinct humans and scenario-specific
limits][test-source-203]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Launch supports zero, twelve distinct humans and scenario-specific
limits',()=>{for(const s of scenarios){const
ids=activeRulers(s).map(r=>r.id).slice(0,12);;validateSave(createCampaign(s,ids)
,scenarios,terrains);};;;})
```

**Required output / success criteria**

```text
assert.equal(createCampaign(s,[]).humanRulers.length,0)
assert.equal(createCampaign(scenarios[0],activeRulers(scenarios[0]).slice(0,12).
map(r=>r.id)).humanRulers.length,12)
assert.throws(()=>createCampaign(scenarios[5],[0,0]))
assert.throws(()=>createCampaign(scenarios[5],[14]))
```

---

**Case / what it tests**

2. [All six legacy scenarios migrate without losing domestic
progress][test-source-204]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All six legacy scenarios migrate without losing domestic
progress',()=>{for(const s of scenarios){const
old=oldCreate(s,activeRulers(s)[0].id);old.provinces[8].gold=1234;const
migrated=validateSave(old,scenarios,terrains);;;;;}})
```

**Required output / success criteria**

```text
assert.equal(migrated.version,2)
assert.deepEqual(migrated.humanRulers,[old.player])
assert.equal(migrated.provinces[8].gold,1234)
assert(migrated.provinces.every(p=>p.geo.length===2&&!/ \d+$/.test(p.name)))
```

---

**Case / what it tests**

3. [Hotseat visits every faction once before monthly
upkeep][test-source-205]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hotseat visits every faction once before monthly upkeep',()=>{const
g=fresh([0,1]),count=activeRulers(g.s).length,month=g.s.month;;const
seen=[];for(let
i=0;i<count;i++){;seen.push(g.s.player);g.finishFactionTurn();if(i<count-1);};;v
alidateSave(g.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert(!g.aiStep())
assert(!seen.includes(g.s.player))
assert.equal(g.s.month,month)
assert.equal(g.s.month,month+1)
assert.deepEqual(g.s.completed,[])
```

---

**Case / what it tests**

4. [Intelligence changes actual officer choices and aggression can suppress
war][test-source-206]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Intelligence changes actual officer choices and aggression can suppress
war',()=>{const high=fresh([]),low=fresh([]);for(const g of
[high,low]){g.s.seed=123;g.s.ai.aggression=0;}high.s.ai.intelligence=100;low.s.a
i.intelligence=0;high.aiStep();low.aiStep();const
a=high.s.officers.find(o=>o.acted),b=low.s.officers.find(o=>o.acted);;;;})
```

**Required output / success criteria**

```text
assert(a&&b)
assert.notEqual(a.id,b.id)
assert(!high.s.battle&&!low.s.battle)
```

---

**Case / what it tests**

5. [Invasions validate before costs, reserve commanders and restore battle
saves][test-source-207]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Invasions validate before costs, reserve commanders and restore battle
saves',()=>{const
g=fresh(),before=JSON.stringify(g.s);;;begin(g);;;;validateSave(g.s,scenarios,te
rrains);const h=new
Game(validateSave(g.s,scenarios,terrains),{},terrains);;const
corrupt=structuredClone(g.s);corrupt.battle.units[0].q=99;;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.invade({province:9,target:4,officers:[0],food:20000}))
assert.equal(JSON.stringify(g.s),before)
assert(g.s.battle)
assert.equal(g.province(9).food,20000)
assert(g.officer(0).acted)
assert.deepEqual(h.s.battle,g.s.battle)
assert.throws(()=>validateSave(corrupt,scenarios,terrains))
```

---

**Case / what it tests**

6. [Hex movement respects mobility, terrain, occupancy and atomic
rejection][test-source-208]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hex movement respects mobility, terrain, occupancy and atomic
rejection',()=>{const g=begin(),b=g.s.battle,u=b.units[0];u.mobility=6;const
moves=reachable(b,u);;for(const m of moves){;;}const
bad=JSON.stringify(b);;;g.battleAction('move',{unit:u.id,...moves[0]});;;;})
```

**Required output / success criteria**

```text
assert(moves.length)
assert(m.cost<=6)
assert(!at(b,m.q,m.r))
assert.throws(()=>g.battleAction('move',{unit:u.id,q:99,r:99}))
assert.equal(JSON.stringify(b),bad)
assert.equal(u.mobility,6-moves[0].cost)
assert(u.ordered)
assert.equal(neighbors(6,6).length,6)
```

---

**Case / what it tests**

7. [Wait banks mobility and rain prevents fireballs without using the daily
order][test-source-209]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Wait banks mobility and rain prevents fireballs without using the daily
order',()=>{const
g=begin(),b=g.s.battle,u=b.units[0];g.battleAction('wait',{unit:u.id});;;u.order
ed=false;b.weather='rain';const before=JSON.stringify(b);const
dry=neighbors(u.q,u.r).find(p=>![3,4].includes(b.terrain[p.r*13+p.q]));;;})
```

**Required output / success criteria**

```text
assert.equal(u.mobility,3)
assert(u.ordered)
assert.throws(()=>g.battleAction('fireball',{unit:u.id,...dry}))
assert.equal(JSON.stringify(b),before)
```

---

**Case / what it tests**

8. [Retreat and conquest settle armies and ownership with valid
governors][test-source-210]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Retreat and conquest settle armies and ownership with valid
governors',()=>{const
retreat=begin(),rice=retreat.province(9).food;retreat.battleAction('retreat');;;
validateSave(retreat.s,scenarios,terrains);const
g=begin(),target=g.s.battle.target;g.s.battle.side='defend';g.battleAction('retr
eat');;;;;validateSave(g.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert(!retreat.s.battle)
assert.equal(retreat.province(9).food,rice)
assert.equal(g.province(target).owner,0)
assert(g.province(target).officers.includes(0))
assert(!g.province(9).officers.includes(0))
assert.equal(g.ruler(0).home,target)
```

---

**Case / what it tests**

9. [Cheat edits are bounded, atomic, affect AI and preserve
ownership][test-source-211]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Cheat edits are bounded, atomic, affect AI and preserve
ownership',()=>{const
g=fresh();g.cheat('ai','global',{intelligence:100,aggression:0});;g.cheat('ai',1
,{intelligence:10});;g.cheat('officer',0,{war:100,acted:true});g.cheat('province
',9,{gold:30000,food:900000,resetActions:false});;g.cheat('province',9,{resetAct
ions:true});;const
before=JSON.stringify(g.s);;;g.cheat('province',9,{owner:1});;validateSave(g.s,s
cenarios,terrains);})
```

**Required output / success criteria**

```text
assert.deepEqual(g.aiFor(),{intelligence:100,aggression:0})
assert.equal(g.aiFor(1).intelligence,10)
assert(g.officer(0).acted)
assert(!g.officer(0).acted)
assert.throws(()=>g.cheat('province',9,{gold:100,land:999}))
assert.equal(JSON.stringify(g.s),before)
assert(g.province(9).officers.every(id=>g.officer(id).owner===1))
```

---

**Case / what it tests**

10. [Battle HUD resolves routing and blocks conflicting campaign
edits][test-source-212]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Battle HUD resolves routing and blocks conflicting campaign
edits',()=>{const
g=begin(),b=g.s.battle,before=JSON.stringify(g.s);;;g.cheat('battle',b.units[0].
id,{morale:80,mobility:5,weather:'rain',attackFood:1000});;validateSave(g.s,scen
arios,terrains);})
```

**Required output / success criteria**

```text
assert.throws(()=>g.cheat('officer',0,{soldiers:1}))
assert.equal(JSON.stringify(g.s),before)
assert.equal(g.s.battle.weather,'rain')
```

---

**Case / what it tests**

11. [AI attacking a human pauses for the defending human
army][test-source-213]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI attacking a human pauses for the defending human army',()=>{const
g=begin();g.s.settings.battleView='all';g.s.humanRulers=[g.s.battle.defender];g.
s.battle.side='defend';;const before=JSON.stringify(g.s);;;})
```

**Required output / success criteria**

```text
assert(g.battleHuman())
assert.equal(g.aiStep(),false)
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

12. [All scenario AI campaigns survive 6,000 actions each with valid
checkpoints][test-source-214]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All scenario AI campaigns survive 6,000 actions each with valid
checkpoints',()=>{let wars=0,months=0;for(const s of scenarios){const g=new
Game(createCampaign(s,[]),{},terrains);g.s.seed=42;g.s.settings.battleView='all'
;g.s.ai.aggression=80;for(let
i=0;i<6000;i++){if(g.s.battle)wars++;g.aiStep();if(i%1000===0)validateSave(g.s,s
cenarios,terrains);}validateSave(g.s,scenarios,terrains);;months+=g.s.turn;};con
sole.log('Simulation:',wars,'battle actions;',months,'combined campaign
turns');})
```

**Required output / success criteria**

```text
assert(g.s.turn>1)
assert(wars>0)
```

---

**Case / what it tests**

13. [Named portraits and reserved frames cover all officer
slots][test-source-215]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Named portraits and reserved frames cover all officer slots',()=>{const
g=fresh();;;for(const o of g.s.officers);;})
```

**Required output / success criteria**

```text
assert.equal(portraitIndex(g.officer(0)),0)
assert(portraitAssigned(g.officer(0)))
assert(portraitIndex(o)>=0&&portraitIndex(o)<=352)
assert.equal(portraitIndex({name:'Unassigned officer'}),352)
```

---

**Case / what it tests**

14. [Audio settings and real events survive save/load; previews remain
transient][test-source-216]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Audio settings and real events survive save/load; previews remain
transient',()=>{const
g=fresh();g.s.settings.sound=false;g.s.settings.music=true;g.execute('develop',{
province:9,officer:0,amount:100});;;g.s.eventPreview={kind:'prison',title:'Previ
ew',text:'No campaign change'};;const
loaded=validateSave(g.s,scenarios,terrains);;;;;const
corrupt=structuredClone(loaded);corrupt.lastEvent.kind='unrecognized';;})
```

**Required output / success criteria**

```text
assert(g.s.lastEvent.text.includes('cultivated'))
assert.equal(eventCell(eventFor(g).kind),3)
assert(eventFor(g).preview)
assert.equal(loaded.settings.sound,false)
assert.equal(loaded.settings.music,true)
assert(!loaded.eventPreview)
assert(loaded.lastEvent.text.includes('cultivated'))
assert.throws(()=>validateSave(corrupt,scenarios,terrains))
```

---

**Case / what it tests**

15. [Battle action records supply a raster animation cue without changing rule
outcomes][test-source-217]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Battle action records supply a raster animation cue without changing rule
outcomes',()=>{const g=begin(),u=g.s.battle.units[0];u.mobility=6;const
m=reachable(g.s.battle,u)[0];g.battleAction('move',{unit:u.id,...m});;;;validate
Save(g.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert.equal(g.s.battle.lastAction.type,'move')
assert.equal(g.s.battle.lastAction.unit,u.id)
assert(g.s.battle.lastAction.sequence>1)
```


<a id="tests-tests-mjs"></a>
## tests/tests.mjs

Source: [tests/tests.mjs](../tests/tests.mjs). Purpose: Every playable ruler in
all six scenarios can save and load; Province adjacency is symmetric and has no
invalid destinations; Source cultivation and dike formulas, resource costs, and
action limits; additional cases below.

Shared inputs: `../config/scenarios.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/engine.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Every playable ruler in all six scenarios can save and
load][test-source-218]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every playable ruler in all six scenarios can save and
load',()=>{for(const s of scenarios)for(const r of
s.rulers){if(s.provinces.some(p=>p.owner===r.id))validateSave(createCampaign(s,r
.id),scenarios);}})
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

2. [Province adjacency is symmetric and has no invalid
destinations][test-source-219]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Province adjacency is symmetric and has no invalid
destinations',()=>{for(const p of scenarios[0].provinces)for(const n of
p.neighbors){;;}})
```

**Required output / success criteria**

```text
assert(n>=1&&n<=41)
assert(scenarios[0].provinces[n-1].neighbors.includes(p.id))
```

---

**Case / what it tests**

3. [Source cultivation and dike formulas, resource costs, and action
limits][test-source-220]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Source cultivation and dike formulas, resource costs, and action
limits',()=>{const
g=fresh(),p=g.province(9),o=g.officer(p.governor),old=p.land,expected=g.preview(
'develop',9,o.id,100),gold=p.gold;g.execute('develop',{province:9,officer:o.id,a
mount:100});;;const snap=JSON.stringify(g.s);;;})
```

**Required output / success criteria**

```text
assert.equal(p.land,old+expected)
assert.equal(p.gold,gold-100)
assert.throws(()=>g.execute('flood',{province:9,officer:o.id,amount:100}))
assert.equal(JSON.stringify(g.s),snap)
```

---

**Case / what it tests**

4. [Invalid orders and insufficient resources are
atomic][test-source-221]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Invalid orders and insufficient resources are atomic',()=>{for(const args
of [{amount:100.5},{amount:-10},{amount:101},{amount:'NaN'}]){const
g=fresh(),before=JSON.stringify(g.s);;;}const
g=fresh();g.province(9).gold=0;const before=JSON.stringify(g.s);;;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.execute('develop',{province:9,officer:0,...args}))
assert.equal(JSON.stringify(g.s),before)
assert.throws(()=>g.execute('reward',{province:9,officer:33,amount:10}))
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

5. [Relief formula increases loyalty and consumes
rice][test-source-222]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Relief formula increases loyalty and consumes rice',()=>{const
g=fresh(),p=g.province(9);p.loyalty=50;const
gain=g.preview('relief',9,0,3000),food=p.food;g.execute('relief',{province:9,off
icer:0,amount:3000});;;})
```

**Required output / success criteria**

```text
assert.equal(p.loyalty,50+gain)
assert.equal(p.food,food-3000)
```

---

**Case / what it tests**

6. [Rice trade does not create free rice or exceed
storage][test-source-223]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rice trade does not create free rice or exceed storage',()=>{const
g=fresh(),p=g.province(9);p.merchant=true;const
before=p.gold,food=p.food;g.execute('trade',{province:9,mode:'buy',amount:1});;;
p.gold=30000;;})
```

**Required output / success criteria**

```text
assert.equal(p.gold,before-1)
assert.equal(p.food,food+1)
assert.throws(()=>g.execute('trade',{province:9,mode:'sell',amount:100}))
```

---

**Case / what it tests**

7. [Rewards charge resources and teaching cannot exceed adviser
intelligence][test-source-224]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rewards charge resources and teaching cannot exceed adviser
intelligence',()=>{const
g=fresh(),p=g.province(9),o=g.officer(33);o.loyalty=50;const
gold=p.gold;g.execute('reward',{province:9,officer:33,amount:50});;;g.officer(p.
governor).acted=false;g.execute('advisor',{province:9,officer:33});const
pupil=g.officer(p.officers[2]);const
before=pupil.int;g.execute('book',{province:9,officer:pupil.id});;;})
```

**Required output / success criteria**

```text
assert.equal(p.gold,gold-50)
assert(g.officer(p.governor).acted)
assert.equal(pupil.int,before+1)
assert.throws(()=>g.execute('book',{province:9,officer:pupil.id}))
```

---

**Case / what it tests**

8. [Peaceful settlement, transport route, and governor
consistency][test-source-225]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Peaceful settlement, transport route, and governor consistency',()=>{const
g=fresh(),p=g.province(9),target=p.neighbors.find(id=>g.province(id).owner===255
);;const
o=p.officers[2];g.execute('move',{province:9,officer:o,target,gold:100,food:1000
});;;;;g.execute('transport',{province:9,officer:p.officers[3],target,gold:50,fo
od:500});;validateSave(g.s,scenarios);})
```

**Required output / success criteria**

```text
assert(target)
assert.equal(g.province(target).owner,0)
assert.equal(g.province(target).governor,o)
assert(!p.officers.includes(o))
assert.deepEqual(g.route(9,target),[9,target])
assert.equal(g.province(target).gold,scenarios[0].provinces[target-1].gold+150)
```

---

**Case / what it tests**

9. [Tax applies loyalty and trust penalties and blocks repeat and summer
collection][test-source-226]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Tax applies loyalty and trust penalties and blocks repeat and summer
collection',()=>{const
g=fresh(),p=g.province(9),loyalty=p.loyalty,trust=g.ruler().trust;g.execute('tax
',{province:9});;;;const h=fresh();h.s.month=7;;})
```

**Required output / success criteria**

```text
assert.equal(p.loyalty,Math.max(0,loyalty-10))
assert.equal(g.ruler().trust,trust-5)
assert.throws(()=>g.execute('tax',{province:9}))
assert.throws(()=>h.execute('tax',{province:9}))
```

---

**Case / what it tests**

10. [Recruitment and diplomacy complete without duplicate
officers][test-source-227]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Recruitment and diplomacy complete without duplicate officers',()=>{const
g=fresh(),p=g.province(9),id=p.hidden[0];if(id!==undefined){p.hidden.shift();p.u
nclaimed.push(id);g.execute('recruit',{province:9,officer:0,target:id});}g.execu
te('diplomacy',{province:9,officer:p.officers[2],target:1,amount:100,mode:'gift'
});;validateSave(g.s,scenarios);})
```

**Required output / success criteria**

```text
assert.equal(g.ruler(0).relations[1],g.ruler(1).relations[0])
```

---

**Case / what it tests**

11. [Garrison recruitment checks capacity, spends resources, and
trains][test-source-228]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Garrison recruitment checks capacity, spends resources, and
trains',()=>{const g=fresh(),p=g.province(9),o=g.officer(p.officers[2]);const
before=o.soldiers;p.population=900000;g.execute('enlist',{province:9,officer:o.i
d,amount:100});;g.endMonth();g.execute('train',{province:9,officer:o.id});;})
```

**Required output / success criteria**

```text
assert.equal(o.soldiers,before+100)
assert(o.acted)
```

---

**Case / what it tests**

12. [Exile preserves governor, adviser and officer-location invariants and
rejects ruler dismissal atomically][test-source-229]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Exile preserves governor, adviser and officer-location invariants and
rejects ruler dismissal atomically',()=>{const
g=fresh(),p=g.province(9),o=g.officer(p.officers[1]);const
before=JSON.stringify(g.s);;;p.governor=o.id;g.ruler().advisor=o.id;const
pop=p.population,soldiers=o.soldiers;g.execute('exile',{province:p.id,officer:o.
id});;;;;;;;validateSave(g.s,scenarios);const
remaining=p.officers.slice(1);for(const id of
remaining){p.officers=p.officers.filter(n=>n!==id);p.unclaimed.push(id);g.office
r(id).owner=255;}const last=JSON.stringify(g.s);;;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.execute('exile',{province:p.id,officer:g.ruler().leader}))
assert.equal(JSON.stringify(g.s),before)
assert(!p.officers.includes(o.id))
assert(p.unclaimed.includes(o.id))
assert(p.officers.includes(p.governor))
assert.equal(g.ruler().advisor,null)
assert.equal(o.owner,255)
assert.equal(o.soldiers,0)
assert.equal(p.population,Math.min(3000000,pop+soldiers))
assert.throws(()=>g.execute('exile',{province:p.id,officer:p.officers[0]}))
assert.equal(JSON.stringify(g.s),last)
```

---

**Case / what it tests**

13. [Monthly year rollover, new actions, and seasonal
income][test-source-230]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Monthly year rollover, new actions, and seasonal income',()=>{const
g=fresh();g.s.month=12;g.officer(0).acted=true;const
before=g.province(9).gold;g.endMonth();;;;;g.s.month=6;;})
```

**Required output / success criteria**

```text
assert.equal(g.s.month,1)
assert.equal(g.s.year,190)
assert(!g.officer(0).acted)
assert(g.province(9).gold>before)
assert(g.endMonth().events.some(v=>v.includes('harvested')))
```

---

**Case / what it tests**

14. [Ten years of all scenario simulations preserve save and resource
invariants][test-source-231]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Ten years of all scenario simulations preserve save and resource
invariants',()=>{for(const scenario of scenarios){const g=new
Game(createCampaign(scenario,0));for(let
n=0;n<120;n++)g.endMonth();validateSave(g.s,scenarios);}})
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

15. [Malformed save data and duplicate officers are
rejected][test-source-232]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Malformed save data and duplicate officers are rejected',()=>{const
g=fresh();g.s.provinces[0].officers.push(0);;const
h=fresh();h.s.officers[0].int=200;;})
```

**Required output / success criteria**

```text
assert.throws(()=>validateSave(g.s,scenarios))
assert.throws(()=>validateSave(h.s,scenarios))
```


<a id="tests-ui-tests-mjs"></a>
## tests/ui-tests.mjs

Source: [tests/ui-tests.mjs](../tests/ui-tests.mjs). Purpose: live renderer
loads corrected Liu Bei portrait and all common event atlases; original launch
menu appears before a campaign; six scenarios, era limits, twelve distinct
humans and AI choice in order; additional cases below.

Shared inputs: `package.json`, `index.html`, `style.css`,
`./assets/artwork/fire-v42.webp`, `-v31.webp`, `-v30.webp`,
`config/province-terrain.json`, `.json`, `external-campaign.json`,
`before-enemy-move.json`, `before-fireball.json`, `before-end-turn.json`,
`before-charge.json`, `before-retreat.json`, `slow-governance.json`,
`tests/fixtures/v19-hard-second-battle.json`, `hard-second-battle.json`,
`config/scenarios.json`, `-audience.json`, `forced-retreat.json`,
`combat-v42.json`, `/freesound_community-sword-battle-jingle-loop-96983.mp3`,
`/audiomass-charge_scream.mp3`, `/fire.mp3`, `tile-v48.json`,
`double-ambush-v48.json`, `display-v47.json`, `conceal-v53.json`,
`interception-v53.json`. Dependencies/entry points: `../mjs/raster-world.mjs`,
`../mjs/original-deployment.mjs`, `../mjs/geography.mjs`, `node:fs`,
`node:path`, `node:assert/strict`, `jsdom`, `@napi-rs/canvas`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [live renderer loads corrected Liu Bei portrait and all common event
atlases][test-source-233]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const waitUntil=async(predicate,timeout=15000)=>{const
end=Date.now()+timeout;while(!predicate()){if(Date.now()>end)throw Error('Timed
out waiting for presentation');await new Promise(r=>setTimeout(r,25));}}; const
source=new
URL('../',import.meta.url).pathname,tmp=fs.mkdtempSync('/tmp/rtk2-interface-');f
s.writeFileSync(path.join(tmp,'package.json'),JSON.stringify({type:'module'}));f
or(const folder of
['mjs','config'])fs.cpSync(path.join(source,folder),path.join(tmp,folder),{recur
sive:true}); const dom=new
JSDOM(fs.readFileSync(path.join(source,'index.html'),'utf8'),{url:'https://rtk2.
test/',pretendToBeVisual:true,runScripts:'outside-only'}),win=dom.window;
for(const k of ['window','document … (complete input/procedure at linked L1–28)
```

**Required output / success criteria**

```text
assert(el,'Missing '+selector)
assert(!el.disabled,'Disabled '+selector)
assert(window.rtk2,'Initialisation:
'+document.getElementById('loadStatus').textContent)
assert(document.getElementById('loading').hidden)
assert(rasterFiles.includes('./assets/artwork/'+file+'-v31.webp'))
assert(rasterFiles.includes('./assets/artwork/'+file+'-v30.webp'))
```

---

**Case / what it tests**

2. [original launch menu appears before a
campaign][test-source-234]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;;;;
```

**Required output / success criteria**

```text
assert.equal(document.querySelectorAll('#launchMenu button').length,3)
assert(!window.rtk2.state)
assert(document.getElementById('game').hidden)
```

---

**Case / what it tests**

3. [six scenarios, era limits, twelve distinct humans and AI choice in
order][test-source-235]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
click('#newGame');;click('[data-scenario="5"]');click('#wizardNext');;click('#wi
zardBack');click('[data-scenario="0"]');click('#wizardNext');click('[data-count=
"12"]');click('#wizardNext');click('#wizardNext');;for(let
i=0;i<12;i++){click(`[data-ruler="${i}"]`);click('#wizardNext');if(i<11);}click(
'[data-level="2"]');click('#wizardNext');await wait(120);;;;;;
```

**Required output / success criteria**

```text
assert.equal(document.querySelectorAll('[data-scenario]').length,6)
assert(document.querySelector('[data-count="12"]').disabled)
assert(document.getElementById('launchError').textContent.includes('Select'))
assert(document.querySelector(`[data-ruler="${i}"]`).disabled)
assert.equal(window.rtk2.state.humanRulers.length,12)
assert.equal(window.rtk2.state.ai.intelligence,90)
assert.equal(window.rtk2.diagnostics.webgl,false)
assert.equal(window.rtk2.diagnostics.renderer,'Canvas 2D raster')
assert.equal(document.querySelectorAll('.province-label').length,41)
```

---

**Case / what it tests**

4. [visible named governor and all 41 solid province badges preserve the
native-derived owner colour, including selected
headquarters][test-source-236]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;;;for(const badge of document.querySelectorAll('.province-label')){const
p=state().provinces[Number(badge.textContent)-1],color=ownershipColor(p.owner);;
;};;
```

**Required output / success criteria**

```text
assert.equal(document.getElementById('governor').textContent,'Cao Cao')
assert.notEqual(win.getComputedStyle(document.getElementById('governor')).displa
y,'none')
assert.equal(badge.style.backgroundColor,badge.style.borderColor)
assert.equal(badge.style.getPropertyValue('--owner-color'),color)
assert.equal(win.getComputedStyle(document.querySelector('.province-summary')).m
arginRight,'0px')
assert.equal(win.getComputedStyle(document.getElementById('governor')).fontFamil
y,win.getComputedStyle(document.getElementById('rulerName')).fontFamily)
```

---

**Case / what it tests**

5. [China route buttons match the original selected province
connections][test-source-237]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;;
```

**Required output / success criteria**

```text
assert.deepEqual([...document.querySelectorAll('#provinceConnections
button')].map(b=>Number(b.dataset.connection)),state().provinces[state().selecte
d-1].neighbors)
```

---

**Case / what it tests**

6. [governance province-map taps never show battlefield hex
information][test-source-238]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
exitGame=()=>{click(window.rtk2.state.battle?'#battleMenu':'#menu');click('#exit
Game');},goOrders=()=>{const
pane=document.getElementById('provincePanel');if(pane.dataset.screen!=='orders')
click('#provinceNavigation
[data-screen=orders]');},openHUD=()=>click(window.rtk2.state.battle?'#battleHUD'
:'#cheatToggle'); const
readMonthly=async()=>{state().speed=state().settings.messageSpeed=500;let
n=0;while(state().monthlyReview){;if(document.getElementById('acceptTurn'))click
('#acceptTurn');await
wait(50);;}if(document.getElementById('acceptTurn'))click('#acceptTurn');};;;;;;
;;await readMonthly();;const
mobileText=win.getComputedStyle(document.getElementById('eventText'));for(const
id of [ … (complete input/procedure at linked L29–33)
```

**Required output / success criteria**

```text
assert(!document.getElementById('nextMonthlyEvent'))
assert(++n<1800)
assert(!document.querySelector('.panel-foot'))
assert(!document.getElementById('quickSave'))
assert(window.rtk2.state.monthlyReview)
assert(document.getElementById('eventTitle').textContent.includes('Historical'))
assert.equal(document.getElementById('eventArtwork').dataset.atlas,'history189')
assert.equal(document.getElementById('eventArtwork').dataset.cell,'0')
assert.equal(win.getComputedStyle(document.getElementById('eventText')).textAlig
n,'left')
assert.equal(document.getElementById('eventTitle').textContent,'Governance')
assert.equal(win.getComputedStyle(document.getElementById(id)).fontSize,mobileTe
xt.fontSize)
assert.equal(win.getComputedStyle(document.getElementById(id)).fontFamily,mobile
Text.fontFamily)
assert.equal(document.getElementById('eventArtwork').dataset.atlas,'events')
assert.equal(document.getElementById('eventArtwork').dataset.cell,'3')
assert.equal(win.getComputedStyle(document.getElementById('provinceNavigation'))
.gridTemplateColumns,'repeat(3,minmax(0,1fr))')
assert(canvas._canvas)
assert(pixels.some((v,i)=>i%4!==3&&v>40))
assert(document.getElementById('battleTileDetails').hidden)
assert.equal(document.getElementById('toast').textContent,governanceToast)
```

---

**Case / what it tests**

7. [same-size number toggle hides city badges and leader lines with either
ownership setting][test-source-239]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
numberToggle=document.getElementById('numbersToggle'),zoomOut=document.getElemen
tById('zoomOut');;;; click('#numbersToggle');await
wait(70);;;;click('#ownershipToggle');await
wait(70);;saveMap('china-without-numbers');click('#numbersToggle');await
wait(70);;click('#ownershipToggle');
```

**Required output / success criteria**

```text
assert.equal(numberToggle.previousElementSibling,zoomOut)
assert.equal(win.getComputedStyle(numberToggle).width,win.getComputedStyle(zoomO
ut).width)
assert.equal(win.getComputedStyle(numberToggle).height,win.getComputedStyle(zoom
Out).height)
assert.equal(state().settings.showNumbers,false)
assert.equal(numberToggle.getAttribute('aria-label'),'Show province numbers')
assert([...document.querySelectorAll('.province-label')].every(b=>b.style.displa
y==='none'))
assert([...document.querySelectorAll('.province-label')].every(b=>b.style.displa
y==='none'))
assert([...document.querySelectorAll('.province-label')].some(b=>b.style.display
==='block'))
```

---

**Case / what it tests**

8. [equal map buttons, menu-only four speeds, HUD-only Resume AI and ruler
daughter eligibility][test-source-240]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; ;;;; ;;; ; ; const
provinceHeader=()=>document.getElementById('generalFrame').textContent+':'+docum
ent.getElementById('generalPortrait').dataset.cell,initialHeader=provinceHeader(
); ; click('#provinceNavigation [data-screen=province]');;;; goOrders();;;
;;;click('#ownershipToggle');;;click('#ownershipToggle');; ;;; const
mapButton=win.getComputedStyle(document.getElementById('mapMode')),ownerButton=w
in.getComputedStyle(document.getElementById('ownershipToggle'));;;;;
click('#menu');;;for(const speed of
[3000,2000,1000,500]){click(`[data-speed="${speed}"]`);;;};;click('#menuClose');
click('#portraitButton');click('#rulerFamily');;;;click('#closeFamily');
openHUD();;;click('#resumeHud');;;
```

**Required output / success criteria**

```text
assert(document.getElementById('generalFrame'))
assert(document.getElementById('eventFrame'))
assert(document.getElementById('instructionFrame'))
assert(document.getElementById('generalPortrait').getAttribute('aria-label').inc
ludes('Cao Cao'))
assert.equal(document.querySelector('#game header'),null)
assert.equal(document.getElementById('exitGame'),null)
assert.equal(document.getElementById('date').closest('section').id,'world')
assert.equal(win.getComputedStyle(document.querySelector('#game
main')).gridTemplateColumns,'minmax(0,2fr) minmax(0,3fr)')
assert.equal(win.getComputedStyle(document.getElementById('provincePanel')).grid
TemplateRows,'minmax(0,30fr) minmax(0,50fr) minmax(0,20fr)')
assert.equal(document.querySelector('.province-label.current-capital').getAttrib
ute('aria-label'),'Select
'+window.rtk2.state.provinces[window.rtk2.state.rulers[0].home-1].name+',
ruler’s headquarters')
assert.equal(win.getComputedStyle(document.getElementById('provinceNavigation'))
.gridTemplateColumns,'repeat(3,minmax(0,1fr))')
assert.equal(provinceHeader(),initialHeader)
assert.deepEqual([...document.querySelectorAll('.province-attributes
dt')].map(n=>n.textContent),['Pop','Men','Generals','Free
Gen','Gold','Food','Rate','Horses','Loy','Land','Flood','Forts'])
assert.equal(provinceHeader(),initialHeader)
assert.deepEqual([...document.querySelectorAll('[data-command]
span')].map(n=>n.textContent),['Rest','Move','Send','War','Milit','Person','Dipl
om','Spy','View','Cultiv','Flood','Reward','Give','Merch','Tax','Map','Deleg','E
xile','Advice'])
assert([...document.querySelectorAll('.province-label')].every(n=>/^\d+$/.test(n
.textContent)))
assert(document.querySelector('.orientation-phone img'))
assert(document.querySelector('.orientation-preview img'))
assert.equal(window.rtk2.state.settings.ownership,false)
assert.equal(document.getElementById('ownershipToggle').getAttribute('aria-press
ed'),'false')
assert.equal(window.rtk2.state.settings.ownership,true)
assert.equal(document.getElementById('pauseAI'),null)
assert.equal(document.getElementById('aiSpeed'),null)
assert.equal(document.getElementById('endTurn'),null)
assert.equal(mapButton.width,ownerButton.width)
assert.equal(mapButton.height,ownerButton.height)
assert.equal(mapButton.width,'108px')
assert.equal(mapButton.height,'var(--command-height)')
assert.deepEqual([...document.querySelectorAll('#gameSpeed
button')].map(b=>b.textContent),['Slow','Normal','Fast','Very Fast'])
assert(!document.getElementById('messageSpeed'))
assert.equal(state().speed,speed)
assert.equal(state().settings.messageSpeed,speed)
assert(!document.getElementById('provincePicker'))
assert.deepEqual([...document.querySelectorAll('#provinceNavigation
button')].map(b=>b.textContent),['Events','Province','Orders'])
assert(document.getElementById('dialogBody').textContent.includes('Princes /
Princesses0 / 1'))
assert(document.getElementById('dialogBody').textContent.includes('Age 18'))
assert(document.getElementById('dialogBody').textContent.includes('Available for
royal marriage'))
assert.equal(document.getElementById('resumeHud').closest('aside').id,'cheatHud'
)
assert(window.rtk2.state.paused)
assert(document.getElementById('cheatHud').hidden)
assert.equal(window.rtk2.state.paused,false)
```

---

**Case / what it tests**

9. [AI profile import stays Legacy, mode inheritance survives HUD renders, stale
files are rejected atomically, comparison is read-only and extension buttons
share existing dimensions][test-source-241]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; openHUD();click('[data-hud=ai]');change('hudEntity','global'); ;;; const
beforeOldExamples=JSON.stringify(state());click('#loadAIExamples');await
waitUntil(()=>document.getElementById('aiExtensionNotice').textContent.includes(
'rules'));; const {AI_WEIGHTS,AI_POLICY_VERSION}=await
import('../mjs/ai-profile.mjs'),{AI_RULES_ID}=await
import('../mjs/ai-rules-id.mjs');const
fixtureProfiles=['governance','battlefield'].map(domain=>({schema:1,policyVersio
n:AI_POLICY_VERSION,id:'ui-fixture-'+domain,name:'UI
fixture',domain,rulesId:AI_RULES_ID,weights:structuredClone(AI_WEIGHTS[domain])}
));const
fixtureFile=document.getElementById('aiProfileFile');Object.defineProperty(fixtu
reFile,'files',{configur … (complete input/procedure at linked L51–64)
```

**Required output / success criteria**

```text
assert.equal(document.getElementById('hudPolicy_governance').value,'legacy')
assert.equal(document.getElementById('hudPolicy_battlefield').value,'legacy')
assert(document.querySelector('#hudPolicy_governance
option[value=trained]').disabled)
assert.equal(JSON.stringify(state()),beforeOldExamples)
assert(state().aiExtensions?.profiles.battlefield)
assert.equal(state().aiExtensions.defaults.governance,'legacy')
assert.equal(state().aiExtensions.defaults.battlefield,'legacy')
assert.equal(document.getElementById('hudPolicy_governance').value,'legacy')
assert.equal(JSON.stringify(state()),compareState)
assert(document.getElementById('aiOrderComparison').textContent.includes('Legacy
:'))
assert(document.getElementById('aiOrderComparison').textContent.includes('Traine
d:'))
assert.equal(state().aiExtensions.defaults.governance,'trained')
assert.equal(state().aiExtensions.defaults.battlefield,'legacy')
assert.equal(document.getElementById('hudPolicy_governance').value,'inherit')
assert.equal(state().aiExtensions.rulers[0].governance,'legacy')
assert.equal(document.getElementById('hudPolicy_governance').value,'legacy')
assert.deepEqual(state().aiExtensions.rulers[0],{})
assert.equal(document.getElementById('hudPolicy_governance').value,'trained')
assert.equal(JSON.stringify(state()),beforeBadImport)
assert(document.getElementById('aiExtensionNotice').textContent.includes('rules'
))
assert.equal(state().aiExtensions.profiles.governance.name,'Imported UI test')
assert.equal(document.getElementById('hudPolicy_governance').value,'legacy')
assert(button.closest('.dialog-buttons'))
assert.equal(win.getComputedStyle(button).height,win.getComputedStyle(document.g
etElementById('hudPlannedPath')).height)
assert.equal(win.getComputedStyle(button).minHeight,win.getComputedStyle(documen
t.getElementById('hudPlannedPath')).minHeight)
assert.equal(manualLink.getAttribute('href'),'./docs/ai-training-manual.html')
assert(fs.existsSync(path.join(source,'docs/ai-training-manual.html')))
assert(state().aiExtensions.shadow)
```

---

**Case / what it tests**

10. [chronology message/art replay returns automatically at Message
Speed][test-source-242]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; click('#menu');click('#chronicle');const
replay=document.querySelector('[data-chronicle]'),replayText=replay.querySelecto
r('span').textContent;replay.click();;;;await wait(600);;
```

**Required output / success criteria**

```text
assert(document.getElementById('dialogBody').textContent.includes(replayText))
assert(document.querySelector('.event-image'))
assert(document.getElementById('dialogFooter').hidden)
assert(!document.getElementById('dialog').open)
```

---

**Case / what it tests**

11. [A–Z and # list every city with its number, name and ruler in the requested
order][test-source-243]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; goOrders();click('[data-command=view]');click('[data-suborder=other]');await
wait(20);const cityBoard=document.querySelector('#orderValue + .choice-initials
+ .choice-board'),cityModes=[...document.querySelectorAll('#orderValue +
.choice-initials button')];;cityModes[0].click();let
cityCards=[...cityBoard.children];const
cityNames=cityCards.map(c=>state().provinces[Number(c.dataset.province)-1].name)
;;;cityModes[1].click();const
cityNumbers=[...cityBoard.children].map(c=>Number(c.dataset.province));;;click('
#cancelOrder');
```

**Required output / success criteria**

```text
assert.deepEqual(cityModes.map(b=>b.textContent),['A–Z','#'])
assert.deepEqual(cityNames,[...cityNames].sort((a,b)=>a.localeCompare(b,'en')))
assert(cityCards.every(c=>c.textContent.includes('#')&&c.textContent.includes(st
ate().rulers.find(r=>r.id===state().provinces[Number(c.dataset.province)-1].owne
r)?.name||'Unclaimed')))
assert.deepEqual(cityNumbers,cityCards.map(c=>Number(c.dataset.province)))
assert([...cityBoard.children].every(c=>c.textContent.startsWith('#')))
```

---

**Case / what it tests**

12. [Recruit All/initial groups sort generals alphabetically; # groups by
alphabetically ordered numbered provinces with
portraits][test-source-244]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
goOrders();click('[data-command=personnel]');click('[data-suborder=recruit]');aw
ait wait(20);const recruitBoard=document.querySelector('#orderValue +
.choice-initials +
.choice-board'),recruitFilters=[...document.querySelectorAll('#orderValue +
.choice-initials button')];;for(const filter of
recruitFilters.slice(0,5)){filter.click();const
names=[...recruitBoard.children].filter(b=>!b.hidden).map(b=>state().officers[Nu
mber(b.dataset.officer)].name);;if(filter.textContent!=='All');}recruitFilters[5
].click();const
located=[...recruitBoard.children].map(b=>({province:state().provinces[Number(b.
dataset.location)-1].name,name:state().officers[Number(b.dataset.officer)].name}
));;;click('#cancelOr … (complete input/procedure at linked L69–70)
```

**Required output / success criteria**

```text
assert.deepEqual(recruitFilters.map(b=>b.textContent),['All','A–F','G–L','M–R','
S–Z','#'],document.getElementById('dialogBody').innerHTML)
assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b,'en',{sensitivit
y:'base'})))
assert(names.every(name=>new
RegExp('^['+filter.textContent.replace('–','-').toLowerCase()+']','i').test(name
)))
assert.deepEqual(located,[...located].sort((a,b)=>a.province.localeCompare(b.pro
vince,'en')||a.name.localeCompare(b.name,'en')))
assert([...recruitBoard.children].every(b=>b.querySelector('canvas')&&/#\d+/.tes
t(b.textContent)))
```

---

**Case / what it tests**

13. [fort construction is under Milit, opens battlefield placement and is absent
from monthly events][test-source-245]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; click('#provinceNavigation [data-screen=events]');const
historyRow=document.querySelector('.strategic-chronology
.chronology-art')?.parentElement.querySelector('span');;;;goOrders();click('[dat
a-command=military]');click('[data-suborder=fort]');await
wait(20);;click('#placeFort');;;const
fortProvince=state().provinces[state().selected-1],fortGold=fortProvince.gold,fo
rtOfficer=Number(document.getElementById('fortBuilder')?.value??0),fortActed=sta
te().officers[fortOfficer].acted,fortsBefore=[...(fortProvince.forts||[])];const
terrainForFort=JSON.parse(fs.readFileSync(path.join(source,'config/province-terr
ain.json')))[fortProvince.id-1],fortCell=terrainForFort.findIndex(t=>t===0||t===
2),fortQ … (complete input/procedure at linked L70–72)
```

**Required output / success criteria**

```text
assert(historyRow)
assert.equal(win.getComputedStyle(historyRow).textAlign,'left')
assert(!document.getElementById('buildProvinceFort'))
assert(document.querySelector('.general-choice'))
assert(document.getElementById('cancelFortPlacement'))
assert.equal(document.getElementById('provincePanel').dataset.screen,'map')
assert(document.getElementById('confirmFort'))
assert.equal(fortProvince.gold,fortGold)
assert.deepEqual(fortProvince.forts||[],fortsBefore)
assert.equal(document.getElementById('provincePanel').dataset.screen,'orders')
assert.equal(fortProvince.gold,fortGold-100)
assert(fortProvince.forts.includes(fortCell))
```

---

**Case / what it tests**

14. [numbered city labels, ownership toggle, illustrated rotation prompt and
themed general cards with adviser forecasts][test-source-246]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
choiceRuler=window.rtk2.state.rulers.find(r=>r.id===0),oldAdvisor=choiceRuler.ad
visor,oldInt=window.rtk2.state.officers[33].int;choiceRuler.advisor=33;window.rt
k2.state.officers[33].int=95;window.rtk2.state.monthlyAdvice.intelligence[33]=10
0;click('[data-command=develop]');await
wait(10);;;;click('.general-choice[data-value="34"]');;;click('#cancelOrder');ch
oiceRuler.advisor=oldAdvisor;window.rtk2.state.officers[33].int=oldInt;
```

**Required output / success criteria**

```text
assert.equal(win.getComputedStyle(document.getElementById('orderValue')).display
,'none')
assert(document.querySelector('.general-choice .relevant-stat'))
assert(document.querySelector('.general-choice').textContent.includes('MEN'))
assert.equal(document.getElementById('orderValue').value,'34')
assert(document.querySelector('.advisor-insight').textContent.includes('Best
affordable result this order'))
```

---

**Case / what it tests**

15. [unavailable monthly orders remain clickable and explain the reason; map and
order fonts share one size][test-source-247]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const steps=(values={})=>{let
safety=0;while(document.getElementById('dialog').open&&document.querySelector('[
data-step]')){const
key=document.querySelector('[data-step]').dataset.step;if(key==='confirm'){;;}el
se if(key in values)input('orderValue',values[key]);click('#confirmOrder');;;}};
click('[data-command=military]');;click('[data-suborder=reassign]');steps({offic
er:34});;const
troops=window.rtk2.state.officers[34].soldiers;change('allocationOfficer',34);in
put('allocationMen',troops-100);click('#applyAllocation');;const
allocatingState=JSON.stringify(window.rtk2.state);;;;;click('#closeDialog');;cli
ck('#returnAllocation');change('allocationOfficer',34);input('allocationMen',tro
ops);cl … (complete input/procedure at linked L73–82)
```

**Required output / success criteria**

```text
assert(!document.getElementById('orderValue'),'Confirmation uses buttons
directly')
assert(!document.querySelector('#dialogBody .choice-board'))
assert.equal(document.getElementById('orderError')?.textContent||'','')
assert(++safety<20)
assert.deepEqual([...document.querySelectorAll('[data-suborder]')].map(n=>n.text
Content),['Hire','Reassign','Train','Build fort'])
assert(document.getElementById('remainingMen'))
assert.equal(document.getElementById('remainingMen').textContent,'100')
assert.throws(()=>tools.get('select_rtk2_province').execute({province:17}),/reas
signment/)
assert.throws(()=>tools.get('stage_rtk2_order').execute({province:9,order:'devel
op'}),/reassignment/)
assert.equal(JSON.stringify(window.rtk2.state),allocatingState)
assert(document.getElementById('remainingMen'))
assert(document.getElementById('confirmDisband'))
assert.equal(window.rtk2.state.officers[34].soldiers,troops)
assert(window.rtk2.state.officers[34].acted)
assert.deepEqual([...document.querySelectorAll('[data-suborder]')].map(n=>n.text
Content),['Hide / Infiltrate','Rival tigers','Tiger and wolf','Betrayal','Forged
letter','Verify','Withdraw'])
assert.deepEqual([...document.querySelectorAll('[data-suborder]')].map(n=>n.text
Content),['Advice','Rumours','Healing'])
assert.deepEqual([...document.querySelectorAll('[data-suborder]')].map(n=>n.text
Content),['Alliance','Joint invasion','Royal marriage','Gift','Cancel
alliance','Threaten','Court marriage','Royal Family'])
assert.equal(document.querySelector('[data-step]').dataset.step,'target')
assert.equal(document.querySelector('[data-step]').dataset.step,'officer')
assert.equal(document.getElementById('orderValue').min,'100')
assert.equal(document.querySelector('[data-step]').dataset.step,'target')
assert(document.querySelector('[data-moving]'))
assert.equal(document.querySelector('[data-step]').dataset.step,'gold')
assert.equal(document.getElementById('orderValue').min,'0')
assert.equal(document.querySelector('[data-step]').dataset.step,'food')
assert.deepEqual([...document.querySelectorAll('[data-suborder]')].map(n=>n.text
Content),['Other provinces','Generals','Summary 1','Summary 2','Territory','Data
order'])
assert(document.querySelector('.province-table').textContent.includes('INT'))
assert(document.querySelector('.province-table').textContent.includes('Weapons')
)
assert(unavailableReward.classList.contains('order-unavailable'))
assert(!unavailableReward.disabled)
assert(document.getElementById('toast').textContent.includes('already acted'))
assert(availabilityGovernor.acted)
assert.equal(win.getComputedStyle(document.querySelector('[data-command=move]'))
.fontSize,win.getComputedStyle(document.querySelector('.province-label')).fontSi
ze)
```

---

**Case / what it tests**

16. [keyboard-free numeric sliders, exact unit buttons, hold repeat and Min/Max
limits][test-source-248]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; click('[data-command=develop]');click('#confirmOrder');await wait(10);const
quantityInput=document.getElementById('orderValue');;;const
quantityBar=quantityInput.nextElementSibling;;const
quantityButtons=quantityBar.querySelectorAll('button');quantityButtons[3].click(
);;quantityButtons[1].click();;quantityButtons[0].click();;;quantityButtons[2].c
lick();;quantityButtons[2].dispatchEvent(new win.Event('pointerdown'));await
wait(620);quantityButtons[2].dispatchEvent(new
win.Event('pointerup'));;click('#cancelOrder');;
```

**Required output / success criteria**

```text
assert.equal(quantityInput.type,'range')
assert(!quantityInput.hasAttribute('inputmode'))
assert(quantityBar.classList.contains('quantity-adjustment'))
assert.equal(quantityInput.value,quantityInput.max)
assert.equal(Number(quantityInput.value),Number(quantityInput.max)-1)
assert.equal(quantityInput.value,quantityInput.min)
assert(quantityButtons[1].disabled)
assert.equal(Number(quantityInput.value),Number(quantityInput.min)+1)
assert(Number(quantityInput.value)>Number(quantityInput.min)+1)
assert.equal(document.querySelectorAll('input[type=number],input[inputmode=numer
ic]').length,0)
```

---

**Case / what it tests**

17. [War shows real governor candidates without a placeholder tile, gates March
on selection, and exposes Break alliance only for
allies][test-source-249]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; { const
p=state().provinces[8],r=state().rulers.find(r=>r.id===p.owner),oldAlliance=[...
r.alliances],oldReady={acted:state().officers[0].acted,sick:state().officers[0].
sick,injured:state().officers[0].injured};
Object.assign(state().officers[0],{acted:false,sick:false,injured:false});goOrde
rs();click('[data-command=war]'); const
target=Number(document.getElementById('enemyProvince').value),enemy=state().prov
inces[target-1].owner;r.alliances=r.alliances.filter(id=>id!==enemy);change('ene
myProvince',target);;
r.alliances.push(enemy);change('enemyProvince',target);;r.alliances=oldAlliance;
const
commander=document.querySelector('input[name=commander][value="0"]');commander.c
hecked=true;comman … (complete input/procedure at linked L83–94)
```

**Required output / success criteria**

```text
assert(document.getElementById('breakAlliance').hidden)
assert(!document.getElementById('breakAlliance').hidden)
assert(!document.getElementById('warGovernor').hidden)
assert.equal(document.querySelector('#warGovernorChoices [data-value=""]'),null)
assert.equal(document.querySelectorAll('#warGovernorChoices
.general-choice').length,p.officers.length-1)
assert(document.getElementById('launchInvasion').disabled)
assert(!document.getElementById('launchInvasion').disabled)
assert.equal(p.governor,governor)
assert.equal(state().seed,seed)
```

---

**Case / what it tests**

18. [staged Move/Diplom flows, military allocation close guard, Advice/Spy
menus, live Reward advice and officer summaries][test-source-250]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
gold=window.rtk2.state.provinces[8].gold;click('[data-command=develop]');steps({
officer:33,amount:100});;;; const
advisorId=state().provinces[8].officers.find(id=>id!==0&&id!==34);;state().ruler
s.find(r=>r.id===0).advisor=advisorId;state().officers[advisorId].int=100;state(
).monthlyAdvice.intelligence[advisorId]=100;state().officers[0].acted=false;goOr
ders();click('[data-command=reward]');click('[data-suborder=gold]');;;click('#co
nfirmOrder');;document.getElementById('orderValue').value=50;document.getElement
ById('orderValue').dispatchEvent(new win.Event('input'));;click('#cancelOrder');
```

**Required output / success criteria**

```text
assert.equal(window.rtk2.state.provinces[8].gold,gold-100)
assert(document.getElementById('eventText').textContent.includes('cultivated'))
assert.equal(provinceHeader(),initialHeader)
assert(advisorId!==undefined)
assert.equal(document.querySelector('[data-step]').dataset.step,'officer')
assert(/loyal|loyalty/.test(document.getElementById('selectionAdvice').textConte
nt))
assert.equal(document.querySelector('[data-step]').dataset.step,'amount')
assert(document.getElementById('selectionAdvice').textContent.includes('Costs 50
gold'))
```

---

**Case / what it tests**

19. [three equal navigation columns on turn, Province and Orders
screens][test-source-251]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const screen of ['province','orders']){click(`#provinceNavigation
[data-screen=${screen}]`);;;}
```

**Required output / success criteria**

```text
assert.equal(win.getComputedStyle(document.getElementById('provinceNavigation'))
.gridTemplateColumns,'repeat(3,minmax(0,1fr))')
assert.deepEqual([...document.querySelectorAll('#provinceNavigation
[data-screen]')].map(b=>b.textContent),['Events','Province','Orders'])
```

---

**Case / what it tests**

20. [Horse and Writings have recipient/advice then confirmation and work without
gold; cancelling leaves state unchanged][test-source-252]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
rewardP=state().provinces[8],rewardGovernor=state().officers[rewardP.governor],r
ewardRecipient=state().officers[34],rewardSnapshot={gold:rewardP.gold,horses:rew
ardP.horses,acted:rewardGovernor.acted,loyalty:rewardRecipient.loyalty,int:rewar
dRecipient.int};rewardP.gold=0;rewardP.horses=2;rewardGovernor.acted=false;rewar
dRecipient.loyalty=50;rewardRecipient.int=60;goOrders();click('[data-command=rew
ard]');click('[data-suborder=horse]');;input('orderValue',34);click('#confirmOrd
er');;;;click('#confirmOrder');;;;rewardGovernor.acted=false;goOrders();click('[
data-command=reward]');click('[data-suborder=writings]');;input('orderValue',34)
;click('#confirmOrder');;;click('#cancelOrder');;rew … (complete input/procedure
at linked L97–98)
```

**Required output / success criteria**

```text
assert.equal(document.querySelector('[data-step]').dataset.step,'officer')
assert.equal(document.querySelector('[data-step]').dataset.step,'confirm')
assert(document.getElementById('dialogBody').textContent.includes('No gold'))
assert.equal(rewardP.horses,2)
assert.equal(rewardP.gold,0)
assert.equal(rewardP.horses,1)
assert(rewardGovernor.acted)
assert.equal(document.querySelector('[data-step]').dataset.step,'officer')
assert.equal(document.querySelector('[data-step]').dataset.step,'confirm')
assert(document.getElementById('dialogBody').textContent.includes('inventory
book'))
assert.equal(rewardRecipient.int,60)
```

---

**Case / what it tests**

21. [ruler self-appointment confirms and displays a nonempty governor, including
officer ID zero][test-source-253]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
goOrders();click('[data-command=personnel]');click('[data-suborder=appoint]');cl
ick('[data-suborder=governor]');input('orderValue',9);click('#confirmOrder');;;c
lick('#confirmOrder');;click('#confirmOrder');;;;;click('#provinceNavigation
[data-screen=province]');;await
waitUntil(()=>document.getElementById('eventTitle').textContent==='Governance');
click('#provinceNavigation [data-screen=province]');;goOrders();
```

**Required output / success criteria**

```text
assert.equal(document.querySelector('[data-step]').dataset.step,'officer')
assert.equal(document.getElementById('orderValue').value,'0')
assert.equal(document.querySelector('[data-step]').dataset.step,'confirm')
assert.equal(state().provinces[8].governor,0)
assert.equal(document.getElementById('governor').textContent,'Cao Cao')
assert.notEqual(win.getComputedStyle(document.getElementById('governor')).displa
y,'none')
assert.equal(document.getElementById('provincePanel').dataset.screen,'province')
assert.equal(document.getElementById('provincePanel').dataset.screen,'turn')
assert.equal(document.getElementById('provincePanel').dataset.screen,'province')
```

---

**Case / what it tests**

22. [compact strategic chronology and all numbered cities with right-aligned
current rulers][test-source-254]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; click('#provinceNavigation [data-screen=events]');;;;; ;;for(const card of
document.querySelectorAll('.province-event')){const
p=state().provinces[Number(card.querySelector('button').dataset.eventProvince)-1
];;;};
```

**Required output / success criteria**

```text
assert.equal(document.querySelectorAll('.province-event:not(.realm-event)').leng
th,41)
assert.equal(document.querySelectorAll('.province-event.controlled').length,wind
ow.rtk2.state.provinces.filter(p=>p.owner===window.rtk2.state.player).length)
assert.equal(document.querySelectorAll('.province-event.current-capital').length
,1)
assert(document.getElementById('panelBody').textContent.includes('cultivated'))
assert(document.getElementById('panelBody').textContent.includes('Across China
(current)'))
assert(document.getElementById('panelBody').textContent.includes('Provinces
(current)'))
assert(card.textContent.includes('#'+p.id+', '+p.name))
assert.equal(win.getComputedStyle(card.querySelector('.province-event-owner')).t
extAlign,'right')
assert(document.getElementById('panelBody').textContent.includes('No event'))
```

---

**Case / what it tests**

23. [historical thumbnail/replay and two independently marked epidemic
provinces][test-source-255]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; ;click('[data-realm-event]');;;click('#closeDialog');const
savedReport=state().lastReport;state().lastReport={year:state().year,month:state
().month,details:[{kind:'month',title:'Epidemic',text:'Epidemic struck
Hedong.',province:6,art:'epidemic'},{kind:'month',title:'Epidemic',text:'Epidemi
c struck Cangwu.',province:41,art:'epidemic'}]};click('#provinceNavigation
[data-screen=province]');click('#provinceNavigation [data-screen=events]');await
wait(100);for(const id of
[6,41]){;;;}state().lastReport=savedReport;click('#provinceNavigation
[data-screen=province]');click('#provinceNavigation [data-screen=events]');
```

**Required output / success criteria**

```text
assert(document.querySelector('.chronology-art[data-atlas=history189]'))
assert.equal(document.querySelector('#dialogBody
canvas').dataset.atlas,'history189')
assert.equal((document.getElementById('dialogBody').textContent.match(/189
AD:/g)||[]).length,1)
assert(document.querySelector(`[data-event-province="${id}"]`).parentElement.tex
tContent.includes('Epidemic'))
assert(document.querySelectorAll('.province-label.has-event').length>=2)
assert.equal(document.querySelector('.province-label[data-connections="'+state()
.provinces[id-1].neighbors.join(',')+'"]')?.dataset.eventCount,'1')
```

---

**Case / what it tests**

24. [headerless 40/60 layout, 30/50/20 sections, unchanged province header,
twelve attributes, nineteen commands and marked monthly
events][test-source-256]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; click('#provinceNavigation
[data-screen=province]');goOrders();click('[data-command=personnel]');;click('#c
ancelOrder');click('[data-command=view]');click('[data-suborder=generals]');clic
k('[data-view-officer="0"]');;click('#officerClose');;
```

**Required output / success criteria**

```text
assert.deepEqual([...document.querySelectorAll('[data-suborder]')].map(n=>n.text
Content),['Recruit','Search','Appoint','Dismiss'])
assert(document.querySelector('.dialog-portrait'))
assert.equal(provinceHeader(),initialHeader)
```

---

**Case / what it tests**

25. [independent sound/music toggles and live playback
control][test-source-257]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; click('#menu');;const
dimming=document.getElementById('dimmingToggle');dimming.checked=true;dimming.di
spatchEvent(new
win.Event('change'));;dimming.checked=false;dimming.dispatchEvent(new
win.Event('change'));;;;;let
fullscreenCalls=0;document.documentElement.requestFullscreen=async()=>{fullscree
nCalls++;};click('#fullscreen');await
wait(5);;click('#chronicle');;click('#closeDialog');click('#menu');const
sound=document.getElementById('soundToggle'),music=document.getElementById('musi
cToggle');sound.checked=false;sound.dispatchEvent(new
win.Event('change'));;;;music.checked=false;music.dispatchEvent(new
win.Event('change'));;sound.checked=true;sound.dispatchEvent(new
win.Event('change'));;; … (complete input/procedure at linked L105–106)
```

**Required output / success criteria**

```text
assert.equal(document.getElementById('dimmingToggle').checked,false)
assert.equal(state().settings.allowScreenDimming,true)
assert.equal(state().settings.allowScreenDimming,false)
assert(document.getElementById('saveStatus').textContent.includes('Saved'))
assert(document.getElementById('chronicle'))
assert(document.getElementById('exitGame').closest('#dialogBody'))
assert.equal(fullscreenCalls,1)
assert(document.getElementById('dialogTitle').textContent.includes('Current
events'))
assert.equal(window.rtk2.state.settings.sound,false)
assert.equal(window.rtk2.state.settings.music,true)
assert.equal(window.rtk2.diagnostics.audio.playing,true)
assert.equal(window.rtk2.diagnostics.audio.playing,false)
assert.equal(window.rtk2.state.settings.music,false)
assert.equal(window.rtk2.diagnostics.audio.playing,false)
assert.equal(window.rtk2.diagnostics.audio.playing,true)
assert(document.getElementById('rulerName').textContent.includes('曹操'))
```

---

**Case / what it tests**

26. [restricted file picker falls back to download; cancellation stays
cancelled][test-source-258]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; let savedText='',written=false;win.showSaveFilePicker=async options=>{;return
{name:'external-campaign.json',createWritable:async()=>({write:async
text=>{savedText=text;},close:async()=>{written=true;}})};};click('#exportSave')
;await wait(30);;;;let downloads=[];const
originalAnchorClick=win.HTMLAnchorElement.prototype.click;win.HTMLAnchorElement.
prototype.click=function(){downloads.push(this.download);};URL.createObjectURL=(
)=>
'blob:test-campaign';URL.revokeObjectURL=()=>{};win.showSaveFilePicker=async()=>
{const e=new Error('Restricted picker');e.name='SecurityError';throw
e;};click('#exportSave');await wait(20);;;win.showSaveFilePicker=async()=>{const
e=new Error('Cancelled');e.name='Ab … (complete input/procedure at linked
L106–107)
```

**Required output / success criteria**

```text
assert(options.suggestedName.endsWith('.json'))
assert(written)
assert.equal(JSON.parse(savedText).humanRulers.length,12)
assert.equal(JSON.parse(savedText).settings.music,true)
assert.equal(downloads.length,1)
assert(downloads[0].endsWith('.json'))
assert.equal(downloads.length,1)
```

---

**Case / what it tests**

27. [external path save/load, Esc to launch, audio stop and state
restoration][test-source-259]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;click('#menuClose');window.dispatchEvent(new
win.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));;;;win.showOpenFilePic
ker=async()=>[{getFile:async()=>({name:'external-campaign.json',size:savedText.l
ength,text:async()=>savedText})}];click('#loadGame');click('#readSave');await
wait(120);;;
```

**Required output / success criteria**

```text
assert(!document.getElementById('launch').hidden)
assert.equal(window.rtk2.diagnostics.audio.playing,false)
assert.equal(tools.size,0)
assert(!document.getElementById('game').hidden)
assert.equal(window.rtk2.state.humanRulers.length,12)
```

---

**Case / what it tests**

28. [WebMCP tools retain the real campaign and
forms][test-source-260]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
read=tools.get('read_rtk2_campaign');;;tools.get('select_rtk2_province').execute
({province:9});const
before=JSON.stringify(window.rtk2.state);;;click('#cancelOrder');
```

**Required output / success criteria**

```text
assert.equal(read.execute({}).year,189)
assert.throws(()=>read.execute({bad:1}))
assert.equal(tools.get('stage_rtk2_order').execute({province:9,order:'flood'}).s
taged,'flood')
assert.equal(JSON.stringify(window.rtk2.state),before)
```

---

**Case / what it tests**

29. [monthly council precedes orders and resumes from a saved
event][test-source-261]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
current=window.rtk2.state,oldMonth=current.month;current.seed=42;current.complet
ed=current.rulers.filter(r=>r.id!==current.player&&current.provinces.some(p=>p.o
wner===r.id)).map(r=>r.id);current.paused=true;goOrders();click('[data-command=r
est]');click('#advanceMonth');;;;;const
council=JSON.stringify(current.monthlyReview);exitGame();click('#loadGame');clic
k('#loadCheckpoint');await wait(100);;await readMonthly();;;;goOrders();;
```

**Required output / success criteria**

```text
assert.equal(current.month,oldMonth+1)
assert(current.monthlyReview)
assert(document.querySelectorAll('[data-order]').length===0)
assert(!document.querySelector('[data-screen=orders]'))
assert.equal(JSON.stringify(window.rtk2.state.monthlyReview),council)
assert(!window.rtk2.state.monthlyReview)
assert.equal(document.getElementById('provincePanel').dataset.screen,'turn')
assert.equal(window.rtk2.state.selected,window.rtk2.state.rulers.find(r=>r.id===
window.rtk2.state.player).home)
assert.equal(document.querySelectorAll('[data-command]').length,19)
```

---

**Case / what it tests**

30. [75/25 field/panel, 20/50/30 sections, live army comparison, edge placement
and replacement Move/Attack submenus][test-source-262]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const {reachable,placementCells,distance,living,direction}=await
import(path.join(source,'mjs/battle.mjs')); const
openBattleControls=()=>{click('#battleMenu');click('#menuBattleControls');};
const
rootOrders=()=>{if(document.getElementById('battleBack'))click('#battleBack');};
const useHex=async
cell=>{openBattleControls();input('hexQ',cell.q+1);input('hexR',cell.r+1);click(
'#targetHex');await wait(100);}; const
acceptArmy=()=>{if(document.getElementById('acceptArmy'))click('#acceptArmy');};
const
tweak=(unit,values={})=>{openHUD();click('[data-hud=battle]');change('hudEntity'
,unit);for(const [key,value] of
Object.entries(values)){if(key==='ordered')document.getElementById('hudOrdered')
.c … (complete input/procedure at linked L109–124)
```

**Required output / success criteria**

```text
assert.equal(document.getElementById('hudError').textContent,'Applied.')
assert(document.getElementById('eventTitle').textContent.includes('preview'))
assert(document.getElementById('eventText').textContent.includes('has not
changed'))
assert(!state().eventPreview)
assert(document.getElementById('hud_flood'))
assert(document.querySelector('label[for="hud_flood"]').textContent.includes('Fl
ood protection'))
assert.equal(document.querySelectorAll('[data-approach]').length,state().provinc
es[state().selected-1].neighbors.length)
assert(document.getElementById('warGovernorSelect'))
assert(document.getElementById('launchInvasion').disabled)
assert(!battle())
assert(document.getElementById('warGovernorAdvice').textContent.includes('loyalt
y')||document.getElementById('warGovernorAdvice').textContent.includes('LOY'))
assert.equal(state().provinces[8].governor,33)
assert(battle())
assert.equal(battle().phase,'deployment')
assert(document.getElementById('game').classList.contains('battle-active'))
assert.equal(win.getComputedStyle(document.getElementById('provincePanel')).disp
lay,'none')
assert.equal(document.getElementById('panelBody').parentElement.id,'battleOrders
')
assert.equal(win.getComputedStyle(document.querySelector('#game
main')).gridTemplateColumns,'minmax(0,3fr) minmax(0,1fr)')
assert.equal(win.getComputedStyle(document.getElementById('battlePanel')).gridTe
mplateRows,'auto minmax(0,1fr)')
assert.equal(win.getComputedStyle(document.getElementById('battleComparison')).d
isplay,'none')
assert.equal(win.getComputedStyle(document.getElementById('battleQuickUnit')).di
splay,'block')
assert(document.getElementById('deploymentDetails'))
assert.equal(document.querySelector('#battleQuickUnit + .choice-board'),null)
assert.equal(document.getElementById('toast').parentElement.id,'world')
assert.equal(win.getComputedStyle(document.getElementById('mapTip')).display,'no
ne')
assert.equal(win.getComputedStyle(document.getElementById('battleComparison')).g
ridTemplateColumns,'repeat(3,minmax(0,1fr))')
assert.equal(document.getElementById('battleQuickUnit').value,String(battle().se
lected))
assert(document.getElementById('confirmDeployment').disabled)
assert(placementCells(battle(),'attack').every(p=>ATTACKER_ZONES[battle().target
-1][battle().entryDirection].some(([q,r])=>p.q===q&&p.r===r)))
assert.equal(document.getElementById('scene').width,Math.round(viewport.width*.7
5*1.5))
assert.deepEqual([...document.querySelectorAll('#battleComparison
[data-side]')].map(n=>n.dataset.side),['defend','attack'])
assert.equal(nodes.querySelector('[data-army-stat=generals]').textContent,(side=
=='attack'?members.filter(u=>u.placed&&u.origin===b.source).length:members.lengt
h)+'/'+(side==='attack'?members.filter(u=>u.placed&&u.origin!==b.source).length:
remaining))
assert.equal(nodes.querySelector('[data-army-stat=men]').getAttribute('aria-labe
l'),members.reduce((n,u)=>n+u.soldiers,0).toLocaleString('en-GB')+' soldiers')
assert.equal(Number(nodes.querySelector('[data-army-leader]').dataset.armyLeader
),b.leaders[side])
assert.equal(nodes.querySelector('[data-army-stat=gold]').getAttribute('aria-lab
el'),b.gold[side].toLocaleString('en-GB')+' gold')
assert.equal(nodes.querySelector('[data-army-stat=food]').getAttribute('aria-lab
el'),b.food[side].toLocaleString('en-GB')+' rice')
assert(document.getElementById('battleDate').textContent.includes('Day '+b.day))
assert.equal(JSON.stringify(battle()),deploymentCheckpoint)
assert(deploymentUnit.placed)
assert.equal(document.getElementById('confirmDeployment').textContent,'Yes')
assert.equal(document.getElementById('resetDeployment').textContent,'No')
assert.equal(yesStyle.width,noStyle.width)
assert.equal(yesStyle.height,noStyle.height)
assert.equal(win.getComputedStyle(document.querySelector('.deployment-confirmati
on')).alignSelf,'flex-end')
assert(living(battle()).filter(u=>u.side===battle().side).every(u=>!u.placed))
assert(u.placed)
assert.equal(document.getElementById('toast').textContent,'Defender’s turn')
assert.equal(battle().day,1)
assert(battle().units.every(u=>u.mobility===2))
assert.equal(document.querySelectorAll('.primary-battle
[data-battle]').length,6)
assert.deepEqual([...document.querySelectorAll('.primary-battle
button')].map(el=>el.textContent),['Move','Attack','Wait','View','Strategy','Fle
e','End turn'])
assert([...document.querySelectorAll('.army-labels>span')].some(n=>n.textContent
==='F/R'))
assert.equal(win.getComputedStyle(node).fontSize,statText.fontSize)
assert.equal(win.getComputedStyle(node).fontFamily,statText.fontFamily)
assert.equal(win.getComputedStyle(document.getElementById('battleEndTurn')).heig
ht,rootSize.height)
assert.equal(win.getComputedStyle(document.querySelector('.primary-battle')).gri
dTemplateColumns,'repeat(3,minmax(0,1fr))')
assert.equal(document.querySelectorAll('[data-direction]').length,7)
assert.equal(document.querySelectorAll('.primary-battle
[data-battle]').length,0)
assert.deepEqual([...document.querySelectorAll('[data-tactic]')].map(el=>el.text
Content),['Normal','Simul\u00adtaneous','Fireball','Charge'])
assert.equal(win.getComputedStyle(document.querySelector('.battle-submenu')).gri
dTemplateColumns,'repeat(3,minmax(0,1fr))')
assert.equal(win.getComputedStyle(document.getElementById('battleBack')).height,
rootSize.height)
assert.equal(document.querySelectorAll('.primary-battle
[data-battle]').length,0)
assert.deepEqual([...document.querySelectorAll('[data-tactic]')].map(el=>el.text
Content),['Normal move','Move enemy'])
```

---

**Case / what it tests**

31. [placement announces defender-first combat, then attacker and
selected-general turns in order][test-source-263]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; ; const turnName=id=>{const o=state().officers[id];return
state().settings.names==='chinese'?(o.zh||o.name):o.name;}; await
waitUntil(()=>document.getElementById('toast').textContent===turnName(battle().s
elected)+'’s turn'); await
waitUntil(()=>!document.getElementById('toast').classList.contains('show'));
const statusStyle=win.getComputedStyle(document.getElementById('toast'));;;;;
click('#battleEndTurn');acceptArmy();;; await
waitUntil(()=>document.getElementById('toast').textContent==='Attacker’s
turn',20000); await
waitUntil(()=>document.getElementById('toast').textContent===turnName(battle().s
elected)+'’s turn'); await
waitUntil(()=>!document.getElementById('toast').classList.contains … (complete
input/procedure at linked L124–134)
```

**Required output / success criteria**

```text
assert.equal(battle().side,'defend')
assert.equal(statusStyle.top,'auto')
assert.equal(statusStyle.height,'auto')
assert.equal(statusStyle.borderTopWidth,'0px')
assert.equal(statusStyle.boxShadow,'none')
assert.equal(battle().side,'attack')
assert.equal(battle().day,1)
```

---

**Case / what it tests**

32. [Move enemy explains selection, spends no selection MP, then moves the
acting unit without spending enemy MP][test-source-264]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
beforeEnemyMove=JSON.stringify(state()),mb=battle(),ma=mb.units.find(u=>u.id===m
b.selected),me=living(mb).find(u=>u.side!==mb.side); const
occupied=(q,r)=>living(mb).some(u=>u!==ma&&u!==me&&u.q===q&&u.r===r); let
cellsForPull; for(let r=1;r<11&&!cellsForPull;r++)for(let
q=1;q<12&&!cellsForPull;q++){ const
old={q,r},near=[0,1,2,3,4,5].map(i=>direction(q,r,i)).filter(p=>p.q>=0&&p.q<13&&
p.r>=0&&p.r<12&&!occupied(p.q,p.r)&&!(p.q===mb.palace.q&&p.r===mb.palace.r));
if(!occupied(q,r)&&!(q===mb.palace.q&&r===mb.palace.r)&&near.length>=2)cellsForP
ull=[old,near[0],near[1]]; }
;Object.assign(ma,cellsForPull[0],{int:100,mobility:6,ordered:false});Object.ass
ign(me,cellsForPull[1],{int:0,mobility … (complete input/procedure at linked
L134–147)
```

**Required output / success criteria**

```text
assert(cellsForPull)
assert(document.querySelector('.battle-notice').textContent.includes('Selection
costs no MP'))
assert.equal(ma.mobility,6)
assert.equal(me.mobility,4)
assert.equal(state().seed,selectionSeed)
assert.equal(mb.eventSerial,selectionSerial)
assert(document.querySelector('.battle-notice').textContent.includes('Enemy
selected'))
assert.equal(ma.q,cellsForPull[2].q)
assert.equal(ma.r,cellsForPull[2].r)
assert(ma.mobility<6)
assert.equal(me.mobility,4)
```

---

**Case / what it tests**

33. [successful and failed Fireball leave other generals ready and allow
selecting their next order][test-source-265]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const fireballCheckpoint=JSON.stringify(state()); for(const success of
[true,false]){ const
b=battle(),u=b.units.find(u=>u.id===b.selected),next=living(b).find(v=>v.side===
b.side&&v.id!==u.id&&!v.ordered),others=JSON.stringify(b.units.filter(v=>v!==u))
,day=b.day,food=JSON.stringify(b.food);
;b.weather='sunny';u.int=100;state().seed=success?0:10; const
target=[0,1,2,3,4,5].map(i=>direction(u.q,u.r,i)).find(p=>p.q>=0&&p.q<13&&p.r>=0
&&p.r<12&&![3,4,9,99].includes(b.terrain[p.r*13+p.q])&&!b.units.some(v=>v.placed
&&v.q===p.q&&v.r===p.r));;b.terrain[target.r*13+target.q]=0;
click('[data-battle=attack]');click('[data-tactic=fireball]');await
useHex(target); ;;;;;; await wait(750);const label=[... … (complete
input/procedure at linked L147–158)
```

**Required output / success criteria**

```text
assert(next)
assert(target)
assert.equal(!!b.fire[target.r*13+target.q],success)
assert(u.ordered)
assert.equal(JSON.stringify(b.units.filter(v=>v!==u)),others)
assert.equal(b.day,day)
assert.equal(b.side,'attack')
assert.equal(JSON.stringify(b.food),food)
assert(label)
assert.equal(b.selected,next.id,'A completed fireball must allow selecting the
next general')
assert(!next.ordered)
assert(next.ordered)
```

---

**Case / what it tests**

34. [One AI action closes HUD on a human turn and presents its explanation on
the battlefield][test-source-266]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; openHUD();const
waitingUnits=JSON.stringify(battle().units),waitingSeed=state().seed;click('#sin
gleAIStep');;;;;;await
waitUntil(()=>document.getElementById('toast').textContent.includes('Waiting for
a human'));await
waitUntil(()=>!document.getElementById('toast').classList.contains('show'));
```

**Required output / success criteria**

```text
assert(document.getElementById('cheatHud').hidden)
assert.equal(win.getComputedStyle(document.getElementById('cheatHud')).display,'
none')
assert(state().paused)
assert.equal(JSON.stringify(battle().units),waitingUnits)
assert.equal(state().seed,waitingSeed)
```

---

**Case / what it tests**

35. [independent equal-size AI overlays, explicit unit inspection, paused
full-field view and unchanged save/RNG][test-source-267]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; openHUD();click('[data-hud=ai]'); const
inspectionState=JSON.stringify(state()),inspectionSeed=state().seed; ;;;
for(const id of ['hudPlannedPath','hudJungleScores']){const
b=document.getElementById(id),base=document.getElementById('resumeHud');const
a=win.getComputedStyle(b),z=win.getComputedStyle(base);;;;}
click('#hudPlannedPath');;; click('#hudJungleScores');;;
change('hudDebugUnit',battle().units.find(u=>u.placed).id);; ;;; await
wait(40);click('#closeHud');;; openHUD();click('#hudPlannedPath');;;
click('#resumeHud');;;;;;
```

**Required output / success criteria**

```text
assert(document.getElementById('hudPlannedPath'))
assert(document.getElementById('hudJungleScores'))
assert(!document.getElementById('hudPlannedPath').disabled)
assert.equal(a.width,z.width)
assert.equal(a.height,z.height)
assert.equal(a.flexGrow,'0')
assert.equal(window.rtk2.diagnostics.aiOverlay.paths,true)
assert.equal(window.rtk2.diagnostics.aiOverlay.jungles,false)
assert.equal(window.rtk2.diagnostics.aiOverlay.jungles,true)
assert(window.rtk2.diagnostics.aiOverlay.forestHexes>0)
assert.equal(window.rtk2.diagnostics.aiOverlay.unit,Number(document.getElementBy
Id('hudDebugUnit').value))
assert.equal(JSON.stringify(state()),inspectionState)
assert.equal(state().seed,inspectionSeed)
assert.equal(document.getElementById('hudPlannedPath').getAttribute('aria-presse
d'),'true')
assert(window.rtk2.diagnostics.aiOverlay)
assert(state().paused)
assert.equal(window.rtk2.diagnostics.aiOverlay.paths,false)
assert.equal(window.rtk2.diagnostics.aiOverlay.jungles,true)
assert(document.getElementById('cheatHud').hidden)
assert.equal(win.getComputedStyle(document.getElementById('cheatHud')).display,'
none')
assert.equal(state().paused,false)
assert.equal(window.rtk2.diagnostics.aiOverlay,null)
assert(!state().paused)
```

---

**Case / what it tests**

36. [visible battlefield End turn advances both armies and the day without
opening Menu][test-source-268]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; ;;;for(const side of ['attack','defend']);const
endTurnCheckpoint=JSON.stringify(state());const
turnDay=battle().day;click('#battleEndTurn');acceptArmy();;click('#battleEndTurn
');acceptArmy();;;exitGame();win.showOpenFilePicker=async()=>[{getFile:async()=>
({name:'before-end-turn.json',size:endTurnCheckpoint.length,text:async()=>endTur
nCheckpoint})}];click('#loadGame');click('#readSave');await
wait(100);rootOrders();
```

**Required output / success criteria**

```text
assert(document.getElementById('battleEndTurn'))
assert.equal(document.getElementById('battleEndTurn').closest('#panelBody').id,'
panelBody')
assert.equal(document.getElementById('battleEndTurn').textContent,'End turn')
assert(document.querySelector(`[data-side=${side}] [data-army-stat=weapons]`))
assert.equal(battle().side,'defend')
assert.equal(battle().side,'attack')
assert.equal(battle().day,turnDay+1)
```

---

**Case / what it tests**

37. [actual Charge order and battlefield label occupy a zero-soldier defender’s
hex][test-source-269]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
chargeCheckpoint=JSON.stringify(state()),chargeBattle=battle(),charging=chargeBa
ttle.units.find(u=>u.side==='attack'&&u.id===chargeBattle.rulers.attack),chargeT
arget=chargeBattle.units.find(u=>u.side==='defend'&&u.id!==chargeBattle.leaders.
defend&&u.id!==chargeBattle.rulers.defend);;const safe=[];for(let
r=0;r<12;r++)for(let
q=0;q<13;q++)if([0,1,2,4,5].includes(chargeBattle.terrain[r*13+q]))safe.push({q,
r});const
pair=safe.flatMap(p=>[0,1,2,3,4,5].map(d=>({from:p,to:direction(p.q,p.r,d)}))).f
ind(p=>safe.some(t=>t.q===p.to.q&&t.r===p.to.r));const
remaining=safe.filter(p=>!(p.q===pair.from.q&&p.r===pair.from.r)&&!(p.q===pair.t
o.q&&p.r===pair.to.r));for(const unit of chargeBattle.units) … (complete
input/procedure at linked L173–174)
```

**Required output / success criteria**

```text
assert(charging&&chargeTarget)
assert.equal(chargeTarget.soldiers,0)
assert.deepEqual({q:charging.q,r:charging.r},pair.to)
assert.equal(battle().lastChargeLanding.kind,'occupation')
assert.deepEqual(window.rtk2.diagnostics.combatAnimation.units,[charging.id,char
geTarget.id])
assert.equal(window.rtk2.diagnostics.combatAnimation.phase,'march')
assert(!document.getElementById('toast').textContent.includes('enemy losses'))
assert(attacker.getAttribute('aria-label').includes(state().officers[charging.id
].name))
assert(![...document.querySelectorAll('.unit-label')].some(n=>n.getAttribute('ar
ia-label').includes(state().officers[chargeTarget.id].name+',')))
assert.deepEqual([...chargeCycles],Array.from({length:8*(battle().lastAction.exc
hanges??10)},(_,i)=>i+1))
assert(chargedLabel?.getAttribute('aria-label').includes('hex '+(pair.to.q+1)+',
'+(pair.to.r+1)))
```

---

**Case / what it tests**

38. [Strategy replacement submenu, general retreat destination prompt,
cancellation and source-province withdrawal][test-source-270]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const beforeRetreatCampaign=JSON.stringify(state());const
retreating=battle().units.find(u=>u.side==='attack'&&u.id!==battle().leaders.att
ack);openBattleControls();change('battleUnit',retreating.id);click('#closeBattle
Controls');rootOrders();click('[data-battle=strategy]');;rootOrders();click('[da
ta-battle=flee]');;;const
beforeFlight=JSON.stringify(battle());click('#stayBattle');;click('[data-battle=
flee]');change('retreat_'+retreating.id,battle().source);state().officers[retrea
ting.id].hasHorse=true;click('#confirmUnitRetreat');await
wait(100);;;exitGame();win.showOpenFilePicker=async()=>[{getFile:async()=>({name
:'before-retreat.json',size:beforeRetreatCampaign.length,text:async()=>befor …
(complete input/procedure at linked L174–177)
```

**Required output / success criteria**

```text
assert.deepEqual([...document.querySelectorAll('[data-strategy]')].map(el=>el.te
xtContent),['Reinforce','Bribe'])
assert(document.getElementById('retreat_'+retreating.id))
assert([...document.querySelectorAll('#retreat_'+retreating.id+'
option')].some(el=>Number(el.value)===battle().source))
assert.equal(JSON.stringify(battle()),beforeFlight)
assert(retreating.fled)
assert.equal(retreating.retreatProvince,battle().source)
assert(battle().units.every(u=>!u.fled))
```

---

**Case / what it tests**

39. [Wait banks mobility, enemy View charges on every inspection and friendly
View is free][test-source-271]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
leader=battle().units.find(u=>u.id===0),held={q:leader.q,r:leader.r};await
wait(50);const
activeLabel=document.querySelector('.unit-label.active-turn');;;;;;;;;const
firstOpacity=activeLabel.style.opacity;await wait(180);;await
waitUntil(()=>!document.getElementById('toast').classList.contains('show'));;cli
ck('[data-battle=wait]');await wait(100);;await
waitUntil(()=>document.getElementById('toast').textContent===turnName(battle().s
elected)+'’s turn');await wait(50);;;;;;;;; const
enemy=battle().units.find(u=>u.side==='defend'),treasury={get gold(){return
battle().gold.attack;}};for(let i=0;i<2;i++){const
gold=treasury.gold;click('[data-battle=view]');change('inspectTarget',enemy.id)
… (complete input/procedure at linked L177–179)
```

**Required output / success criteria**

```text
assert(activeLabel.textContent.includes(leader.soldiers.toLocaleString()))
assert(!activeLabel.textContent.includes(state().officers[leader.id].name))
assert(activeLabel.classList.contains('commander'))
assert(!activeLabel.textContent.includes('★'))
assert([...document.querySelectorAll('.army-flag.commander')].some(f=>f.textCont
ent.startsWith('★ ')))
assert([...document.querySelectorAll('.army-flag')].some(f=>f.getAttribute('aria
-label')===`${state().officers[leader.id].name} army flag`))
assert(activeLabel)
assert.equal(document.querySelectorAll('.unit-label.active-turn').length,1)
assert.notEqual(activeLabel.style.opacity,firstOpacity)
assert.equal(document.getElementById('toast').textContent,turnName(leader.id)+'’
s turn')
assert(document.getElementById('toast').textContent.includes('waited without
moving'))
assert.equal(document.querySelectorAll('.unit-label.active-turn').length,1)
assert.equal(battle().selected,34)
assert.equal(leader.mobility,3)
assert(leader.ordered)
assert.equal(document.querySelectorAll('[data-tactic]').length,0)
assert.deepEqual({q:leader.q,r:leader.r},held)
assert(!document.querySelector('[data-battle=move]').disabled)
assert(!document.querySelector('[data-battle=move]').classList.contains('order-u
navailable'))
assert.equal(treasury.gold,gold-100)
assert.equal(document.querySelectorAll('[data-tactic]').length,0)
assert(document.getElementById('dialogBody').textContent.includes('Mobility'))
assert.equal(treasury.gold,inspectedGold)
assert.equal(treasury.gold,portraitGold)
assert.equal(treasury.gold,portraitGold)
assert.equal(treasury.gold,portraitGold-100)
assert.equal(treasury.gold,portraitGold-100)
assert.equal(document.getElementById('hud_weapons').type,'range')
assert(!document.getElementById('dialog').open)
assert.equal(battle().selected,readyAfterView.id)
assert.deepEqual(battle().units.map(u=>[u.id,u.ordered,u.mobility]),viewOrders)
assert(document.querySelector('[data-tactic=move]'))
```

---

**Case / what it tests**

40. [actual terrain costs, six-direction weather HUD and personal challenge
response handoff/desertion][test-source-272]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const [weather,cell] of
[['sunny','0'],['fewclouds','1'],['cloudy','2'],['rain','3']]){tweak(leader.id,{
weather});;}tweak(leader.id,{mobility:12,ordered:false,weather:'cloudy',wind:6,w
ar:95,challengeWar:80});;;;;assertArmies();openBattleControls();change('battleUn
it',leader.id);click('#closeBattleControls');rootOrders();click('[data-battle=mo
ve]');click('[data-tactic=move]');const
moving=reachable(battle(),leader).find(m=>distance(m,battle().palace)>0);;const
startingMP=leader.mobility;await useHex(moving);;;;;;await
wait(100);saveMap('battle-raster');
tweak(leader.id,{ordered:false});openBattleControls();click('#personalChallenge'
);change('challengeTarget',enemy.id);const deserters=ba … (complete
input/procedure at linked L179–181)
```

**Required output / success criteria**

```text
assert.equal(document.getElementById('battleWeatherImage').dataset.cell,cell)
assert.equal(battle().wind,6)
assert.equal(battle().windStrength,1)
assert.equal(document.getElementById('battleWeatherImage').dataset.cell,'2')
assert(document.getElementById('battleWind').textContent.includes('↘ Lower
right'))
assert(moving)
assert.equal(leader.mobility,startingMP-moving.cost)
assert(!document.getElementById('battleTileDetails').hidden)
assert(document.getElementById('battleTileDetails').textContent.includes('counte
rattack coefficient'))
assert(document.getElementById('battleTileDetails').textContent.includes('Move:'
))
assert(leader.ordered)
assert(battle().challenge)
assert(document.getElementById('refuseChallenge'))
assert.equal(battle().challenge,null)
assert.equal(battle().units.find(u=>u.id===id).soldiers,troops-Math.ceil(troops*
.05))
```

---

**Case / what it tests**

41. [strategy submenus, ruler bribery exclusion and actual reinforcement/rice
transfer][test-source-273]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
tweak(leader.id,{ordered:false});click('[data-battle=strategy]');click('[data-st
rategy=bribe]');;;click('#cancelBribe');rootOrders();const
friendlySupport=state().provinces[5],formerSupportRuler=state().rulers.find(r=>r
.id===friendlySupport.owner);friendlySupport.owner=battle().attacker;formerSuppo
rtRuler.advisor=null;for(const id of
friendlySupport.officers)Object.assign(state().officers[id],{owner:battle().atta
cker,acted:false,sick:false,injured:false,illMonths:0,soldiers:1000,weapons:1000
});click('[data-battle=strategy]');click('[data-strategy=reinforce]');;const
[reserveProvince,reserveOfficer]=document.getElementById('reinforceOfficer').val
ue.split(':').map(Number),riceBefore=state(). … (complete input/procedure at
linked L181–182)
```

**Required output / success criteria**

```text
assert(document.getElementById('bribeTarget'))
assert(![...document.getElementById('bribeTarget').options].some(o=>Number(o.val
ue)===battle().rulers.defend))
assert(!document.getElementById('chooseReinforceHex').disabled)
assert(document.getElementById('cancelReinforcement'))
assert(battle().units.some(u=>u.id===reserveOfficer&&u.placed))
assert.equal(state().provinces[reserveProvince-1].food,riceBefore-1000)
assert.equal(battle().food.attack,suppliesBefore+1000)
```

---

**Case / what it tests**

42. [revised battle checkpoint, cancelling commander flight and confirmed
whole-army withdrawal][test-source-274]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; exitGame();const
checkpoint=JSON.stringify(battle());click('#loadGame');click('#loadCheckpoint');
await
wait(100);;tweak(leader.id,{ordered:false});openBattleControls();change('battleU
nit',0);click('#closeBattleControls');rootOrders();click('[data-battle=flee]');;
const
beforeCancel=JSON.stringify(battle());click('#stayBattle');;click('[data-battle=
flee]');for(const u of
battle().units)state().officers[u.id].hasHorse=true;click('#confirmRetreat');awa
it wait(100);;;await
waitUntil(()=>document.getElementById('toast').classList.contains('battle-result
'));;;await waitUntil(()=>!battle());;await
waitUntil(()=>document.getElementById('continueTriumph')||document.getElementByI
d('freeCaptive')||!st … (complete input/procedure at linked L182–183)
```

**Required output / success criteria**

```text
assert.equal(JSON.stringify(battle()),checkpoint)
assert(document.getElementById('dialogBody').textContent.includes('each
general'))
assert.equal(JSON.stringify(battle()),beforeCancel)
assert(battle()?.awaitingResult)
assert(document.getElementById('game').classList.contains('battle-active'))
assert(document.getElementById('toast').textContent.includes('won'))
assert(battle())
assert.equal(state().lastBattle.winner,'defend')
assert(document.getElementById('dialogTitle').textContent.includes('Attack
defeated'))
assert(document.querySelector('.commander-fate').textContent.includes('Losing
commander'))
assert(document.getElementById('triumphArtwork')._canvas)
assert(!document.getElementById('game').classList.contains('battle-active'))
assert.equal(document.getElementById('panelBody').parentElement.id,'eventFrame')
assert.equal(document.getElementById('provincePanel').dataset.screen,'turn')
```

---

**Case / what it tests**

43. [non-ruler invasion skips tactical view and battle viewing preference
persists][test-source-275]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
state().humanRulers=[0];tools.get('select_rtk2_province').execute({province:9});
openHUD();click('[data-hud=province]');document.getElementById('hudReset').check
ed=true;;;input('hud_flood','77');input('hud_food','80000');click('#applyHud');c
lick('#closeHud');goOrders();for(const id of
[0,34])Object.assign(state().officers[id],{sick:false,injured:false,illMonths:0,
acted:false});click('[data-command=war]');change('enemyProvince',8);state().prov
inces[7].food=1;const
chosenCommander=document.querySelector('input[name=commander][value="34"]');chos
enCommander.checked=true;chosenCommander.dispatchEvent(new
win.Event('change',{bubbles:true}));;;click('#launchInvasion');;;;;await
wait(5);;const triu … (complete input/procedure at linked L183–184)
```

**Required output / success criteria**

```text
assert(document.getElementById('hud_flood'))
assert(document.querySelector('label[for="hud_flood"]').textContent.includes('Fl
ood protection'))
assert(document.getElementById('warProvisions').textContent.includes('30-day
month'))
assert(document.getElementById('warProvisions').textContent.includes('days at
full strength'))
assert(!battle())
assert(state().lastBattle.day<=30)
assert(!document.getElementById('battleUnit'))
assert(document.getElementById('eventText').textContent.includes('won'))
assert(document.getElementById('continueTriumph'))
assert(triumphCanvas?._canvas)
assert(document.getElementById('dialogBody').textContent.includes('Attacker'))
assert(document.getElementById('dialogBody').textContent.includes('defender'))
assert(document.querySelector('.commander-fate').textContent.includes('Losing
commander'))
assert.equal(win.getComputedStyle(document.querySelector('.triumph-copy')).posit
ion,'relative')
assert.equal(win.getComputedStyle(document.getElementById('dialogBody')).overflo
w,'auto')
assert(triumphPixels.some((v,i)=>i%4!==3&&v>80))
assert(!document.getElementById('recruitCaptive'))
assert.equal(document.getElementById('battleView').value,'personal')
assert.equal(state().settings.battleView,'all')
```

---

**Case / what it tests**

44. [voluntary exile keeps human control and retains menu
exit][test-source-276]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;while(state().captiveDecisions?.some(c=>state().humanRulers.includes(c.owner))|
|document.getElementById('dialog').open&&document.getElementById('triumphArtwork
')){if(document.getElementById('dialog').open&&document.getElementById('triumphA
rtwork')){;click('#continueTriumph');await
wait(10);continue;}document.getElementById('dialog').close();click('#reviewCapti
ves');;;click('#beheadCaptive');;click('#cancelExecution');click('#freeCaptive')
;await
wait(10);}if(document.getElementById('protectProvince')){click('#protectProvince
');await wait(10);}for(const flag of
['sick','injured'])state().officers[0][flag]=false;state().officers[0].illMonths
=0;tools.get('select_rtk2_province').execute({provinc … (complete
input/procedure at linked L184–184)
```

**Required output / success criteria**

```text
assert(document.querySelector('.commander-fate').textContent.includes('released'
))
assert(document.getElementById('freeCaptive'))
assert(document.querySelector('.captive-card
.general-stats').textContent.includes('WAR'))
assert(document.getElementById('confirmExecution'))
assert.equal(document.querySelector('[data-step]')?.dataset.step,'confirm')
assert(window.rtk2.state.roaming.length)
assert(!window.rtk2.state.campaignEnded)
assert(window.rtk2.state.humanRulers.includes(0))
```

---

**Case / what it tests**

45. [Quit and relaunch](../tests/ui-tests.mjs#L184-L184)

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;exitGame();click('#quitGame');;;click('#returnLaunch');
```

**Required output / success criteria**

```text
assert.equal(closeCalls,1)
assert(!document.getElementById('quitScreen').hidden)
```

---

**Case / what it tests**

46. [mounted courier animation, numbered route, interception choices and
delivery after travel][test-source-277]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
click('#newGame');click('#wizardNext');click('[data-count="1"]');click('#wizardN
ext');click('[data-ruler="0"]');click('#wizardNext');click('[data-level="1"]');c
lick('#wizardNext');await
wait(80);window.rtk2.state.paused=true;window.rtk2.state.humanRulers=window.rtk2
.state.rulers.slice(0,12).map(r=>r.id);await
readMonthly();window.rtk2.state.seed=0;goOrders();const
giftStart=window.rtk2.state.provinces[8].gold;click('[data-command=diplomacy]');
click('[data-suborder=gift]');steps({target:3,officer:34,amount:100});await
wait(10);;;;const courierFrames=new Set;for(let
sample=0;sample<8&&courierFrames.size<2;sample++){courierFrames.add(document.que
rySelector('.courier-animation').dataset.cell); … (complete input/procedure at
linked L184–185)
```

**Required output / success criteria**

```text
assert(window.rtk2.state.journey)
assert(document.querySelector('.courier-animation'))
assert.equal(window.rtk2.state.provinces[8].gold,giftStart-100)
assert.equal(courierFrames.size,1,'A messenger stopped at a province must not
gallop')
assert(document.querySelector('.courier-animation').classList.contains('stationa
ry'))
assert(document.getElementById('refuseProposal'))
assert(document.getElementById('dialogBody').textContent.includes('decides'))
assert(document.getElementById('captureMessenger'))
assert(document.getElementById('beheadMessenger'))
assert(++journeySteps<150)
assert([giftStart,giftStart-100].includes(window.rtk2.state.provinces[8].gold))
assert(!window.rtk2.state.officers[34].inTransit)
```

---

**Case / what it tests**

47. [aligned live general columns, actual treasure gains and four HUD
tabs][test-source-278]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
sender=state().rulers.find(r=>r.id===0),ally=state().rulers.find(r=>r.id===10);i
f(!sender.alliances.includes(10))sender.alliances.push(10);if(!ally.alliances.in
cludes(0))ally.alliances.push(0);state().allyDecisions.push({kind:'joint',owner:
10,requester:0,province:8});tools.get('select_rtk2_province').execute({province:
9});await wait(10);;;const alliedTrust=ally.trust;click('#refuseAlly');;await
wait(10);
state().spoils.push({owner:0,province:9,item:'luminous'});tools.get('select_rtk2
_province').execute({province:9});await
wait(10);;change('treasureRecipient',33);const
beforeTreasure=state().officers[33].war;click('#protectProvince');const
treasureGain=state().items.find(x=>x.officer= … (complete input/procedure at
linked L185–187)
```

**Required output / success criteria**

```text
assert(document.getElementById('refuseAlly'))
assert(document.querySelectorAll('input[name=allyCommander]').length)
assert.equal(ally.trust,Math.max(0,alliedTrust-5))
assert(document.getElementById('treasureRecipient'))
assert(treasureGain>=0&&treasureGain<=12)
assert.equal(state().officers[33].war,Math.min(100,beforeTreasure+treasureGain))
assert.equal(state().officers[33].loyalty,100)
assert(state().items.some(x=>x.officer===33&&x.item==='luminous'))
assert.deepEqual([...document.querySelectorAll('.general-view-header>span')].map
(x=>x.textContent),['','General','Position','INT','WAR','CHA'])
assert.equal(win.getComputedStyle(row).gridTemplateColumns,win.getComputedStyle(
document.querySelector('.general-view-header')).gridTemplateColumns)
assert.equal(row.querySelector('[data-general-stat=int]').textContent,String(o.i
nt))
assert(document.getElementById('dialogBody').textContent.includes('WAR
+'+treasureGain))
assert.equal(win.getComputedStyle(document.getElementById('hudTabs')).gridTempla
teColumns,'repeat(4,minmax(0,1fr))')
```

---

**Case / what it tests**

48. [themed allied consent and post-victory treasure recipient
flows][test-source-279]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

49. [Historic/Fiction setup, both exile decisions, saved party, four orders and
confirmed settlement][test-source-280]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;exitGame();
click('#newGame');click('[data-family=original]');;click('[data-family=expanded]
');;click('[data-history=fiction]');;;click('#wizardNext');click('#wizardNext');
click('[data-ruler="0"]');click('#wizardNext');click('#wizardNext');await
readMonthly();;goOrders();const
exileHome=window.rtk2.state.selected,exileIds=[...window.rtk2.state.provinces[ex
ileHome-1].officers];click('[data-command=exile]');steps({confirm:1,takeAll:1});
;;;click('#exileOrders');;exitGame();click('#loadGame');click('#loadCheckpoint')
;await wait(100);;click('#exileOrders');click('[data-exile-order=move]');const
emptyExile=window.rtk2.state.provinces[exileHome-1].neighbors.find(id=>window.rt
k2.state.provinces[id- … (complete input/procedure at linked L187–188)
```

**Required output / success criteria**

```text
assert.equal(document.querySelector('[data-family=original]').getAttribute('aria
-pressed'),'true')
assert.equal(document.querySelector('[data-family=expanded]').getAttribute('aria
-pressed'),'true')
assert.equal(document.querySelector('[data-history=fiction]').getAttribute('aria
-pressed'),'true')
assert.equal(document.querySelector('[data-history=historic]').getAttribute('ari
a-pressed'),'false')
assert.equal(window.rtk2.state.historyMode,'fiction')
assert.equal(window.rtk2.state.roaming.length,1)
assert.deepEqual(window.rtk2.state.roaming[0].officers,exileIds)
assert(window.rtk2.state.humanRulers.includes(0))
assert.deepEqual([...document.querySelectorAll('[data-exile-order]')].map(b=>b.t
extContent),['Move','View','Settle','Rest'])
assert.equal(window.rtk2.state.roaming.length,1)
assert(emptyExile)
assert.equal(window.rtk2.state.roaming.length,0)
assert.equal(window.rtk2.state.provinces[emptyExile-1].owner,0)
```

---

**Case / what it tests**

50. [custom-ruler portrait tile fills the final row beside Liu Yao, with shared
frame and typography][test-source-281]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;exitGame();
click('#newGame');click('#wizardNext');click('[data-count="1"]');click('#wizardN
ext');const
customTile=document.getElementById('createCustomRuler'),liuYao=document.querySel
ector('[data-ruler="14"]'),wangLang=document.querySelector('[data-ruler="13"]');
;;;;const
customPortrait=customTile.querySelector('.portrait-mini'),rulerPortrait=liuYao.q
uerySelector('.portrait-mini');for(const key of
['width','height','display']);for(const key of
['fontFamily','fontSize','minHeight','padding']);;;
```

**Required output / success criteria**

```text
assert.equal(customTile.parentElement.className,'ruler-grid')
assert.equal(customTile.previousElementSibling,wangLang)
assert.equal(customTile.nextElementSibling,liuYao)
assert.equal(document.getElementById('wizardBody').firstElementChild,customTile.
parentElement)
assert.equal(win.getComputedStyle(customPortrait)[key],win.getComputedStyle(rule
rPortrait)[key],key)
assert.equal(win.getComputedStyle(customTile)[key],win.getComputedStyle(liuYao)[
key],key)
assert.equal(customTile.getAttribute('aria-haspopup'),'dialog')
assert(customPortrait.src.endsWith('/assets/artwork/custom-ruler-silhouette.svg'
))
```

---

**Case / what it tests**

51. [themed custom ruler/follower creation and saved campaign
restoration][test-source-282]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;click('#createCustomRuler');await wait(10);;;click('#customName');const
namePad=document.getElementById('customName').nextElementSibling;;namePad.queryS
electorAll('button')[28].click();namePad.querySelectorAll('button')[0].click();;
namePad.querySelectorAll('button')[29].click();;input('customName','Aster');inpu
t('customFollower','Jun');input('customAge',30);input('customint',85);input('cus
tomwar',70);input('customcharm',85);;;change('customSex','female');;;click('[dat
a-custom-portrait="6"]');;click('#confirmCustom');;click('#wizardNext');click('#
wizardNext');await
readMonthly();;;;;;exitGame();click('#loadGame');click('#loadCheckpoint');await
wait(100);;;
```

**Required output / success criteria**

```text
assert(document.getElementById('customName').readOnly)
assert.equal(document.getElementById('customName').getAttribute('inputmode'),'no
ne')
assert(!namePad.hidden)
assert.equal(document.getElementById('customName').value,'A')
assert(namePad.hidden)
assert.equal(document.querySelectorAll('[data-custom-portrait]').length,4)
assert([...document.querySelectorAll('[data-custom-portrait]')].every(b=>Number(
b.dataset.customPortrait)<4))
assert.equal(document.querySelectorAll('[data-custom-portrait]').length,4)
assert([...document.querySelectorAll('[data-custom-portrait]')].every(b=>Number(
b.dataset.customPortrait)>=4))
assert(document.querySelector('[data-custom-portrait="6"]').getAttribute('aria-p
ressed')==='true')
assert(document.querySelector('[data-ruler="15"]'))
assert.equal(state().rulers.find(r=>r.id===state().player).name,'Aster')
assert.equal(state().customOfficers.length,2)
assert.equal(state().officers[255].sex,'female')
assert.equal(state().officers[255].customPortrait,6)
assert.equal(state().officers[256].customPortrait,8)
assert.equal(state().officers[255].name,'Aster')
assert.equal(state().officers[255].customPortrait,6)
```

---

**Case / what it tests**

52. [zero players skips rulers and runs AI with chosen
intelligence][test-source-283]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;exitGame();
click('#newGame');click('#wizardNext');click('[data-count="0"]');click('#wizardN
ext');;;click('[data-level="2"]');click('#wizardNext');;;openHUD();;click('#clos
eHud');click('#menu');click('[data-speed="500"]');click('[data-speed="500"]');ch
ange('battleView','all');click('#menuClose');;const
aiBefore=JSON.stringify(window.rtk2.state);openHUD();click('#resumeHud');for(let
attempt=0;attempt<100&&window.rtk2.state.monthlyReview;attempt++)await
wait(100);;await wait(150);;openHUD();click('#closeHud');exitGame();;
```

**Required output / success criteria**

```text
assert(document.getElementById('wizardTitle').textContent.includes('AI
intelligence'))
assert.equal(document.querySelectorAll('[data-ruler]').length,0)
assert.equal(window.rtk2.state.humanRulers.length,0)
assert.equal(window.rtk2.state.ai.intelligence,90)
assert(window.rtk2.state.paused)
assert.equal(state().settings.battleView,'all')
assert(!window.rtk2.state.monthlyReview)
assert.notEqual(JSON.stringify(window.rtk2.state),aiBefore)
assert(!document.getElementById('launch').hidden)
```

---

**Case / what it tests**

53. [Unified Slow speed holds governance messages for three seconds without
hidden battle UI][test-source-284]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;
click('#newGame');click('#wizardNext');click('[data-count="0"]');click('#wizardN
ext');click('[data-level="2"]');click('#wizardNext');openHUD();click('#closeHud'
);click('#menu');click('[data-speed="500"]');click('[data-speed="500"]');change(
'battleView','personal');click('#menuClose');openHUD();click('#resumeHud');await
readMonthly();openHUD();click('#closeHud');click('#menu');click('[data-speed="30
00"]');;click('#menuClose');const
slowSave=JSON.stringify(state());exitGame();win.showOpenFilePicker=async()=>[{ge
tFile:async()=>({name:'slow-governance.json',size:slowSave.length,text:async()=>
slowSave})}];click('#loadGame');Object.defineProperty(document.getElementById('s
aveFile'),'files',{conf … (complete input/procedure at linked L190–192)
```

**Required output / success criteria**

```text
assert.equal(state().settings.messageSpeed,3000,'Menu must select Slow')
assert.equal(state().settings.messageSpeed,3000,document.getElementById('importE
rror')?.textContent||'Loaded speed')
assert.notEqual(reportKey(state().log[0]),reportBefore)
assert.equal(reportKey(state().log[0]),heldReport,'Slow governance report must
not be replaced after one second')
assert.equal(document.getElementById('eventText').textContent,heldText)
assert.equal(document.getElementById('toast').textContent,heldToast)
assert(!document.getElementById('game').classList.contains('battle-active'))
assert(document.getElementById('battlePanel').hidden)
assert(!document.getElementById('toast').classList.contains('show')||document.ge
tElementById('toast').textContent!==heldToast||reportKey(state().log[0])!==heldR
eport,'Playback must finish or advance after the full three-second report')
```

---

**Case / what it tests**

54. [One AI action closes HUD, executes one AI step and keeps subsequent orders
paused][test-source-285]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
stalledAI=JSON.parse(fs.readFileSync(path.join(source,'tests/fixtures/v19-hard-s
econd-battle.json'),'utf8'));stalledAI.paused=true;stalledAI.speed=100;const
stalledText=JSON.stringify(stalledAI);win.showOpenFilePicker=async()=>[{getFile:
async()=>({name:'hard-second-battle.json',size:stalledText.length,text:async()=>
stalledText})}];click('#loadGame');click('#readSave');await wait(100);;;;;;const
oldSecondBattle=battle();const
fixedComparison=document.getElementById('battleComparison'),fixedDefender=fixedC
omparison.querySelector('[data-side=defend]'),fixedMen=fixedDefender.querySelect
or('[data-army-stat=men]'),fixedWeather=document.getElementById('battleWeatherIm
age');fixedComparison.s … (complete input/procedure at linked L192–193)
```

**Required output / success criteria**

```text
assert.equal(state().humanRulers.length,0)
assert.equal(state().ai.intelligence,90)
assert.equal(state().settings.battleView,'all')
assert.equal(battle().day,1)
assert(battle().challengeIssued.length)
assert(document.getElementById('cheatHud').hidden)
assert.equal(win.getComputedStyle(document.getElementById('cheatHud')).display,'
none')
assert(state().paused)
assert(oldSecondBattle.eventSerial>singleSerial)
assert.equal(JSON.stringify(oldSecondBattle),singleState,'One AI action must
stay paused after closing HUD')
```

---

**Case / what it tests**

55. [AI summary nodes stay mounted, reset unwanted scroll and update all army
values after consecutive AI actions][test-source-286]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;openHUD();click('#resumeHud');for(let
attempt=0;attempt<300&&battle()===oldSecondBattle&&battle().day===1;attempt++)aw
ait wait(100);;;;;;;;;;assertArmies();
```

**Required output / success criteria**

```text
assert(!state().paused,document.getElementById('toast').textContent)
assert(battle()!==oldSecondBattle||battle().day>1,'Visible second AI battle must
advance without human orders')
assert.equal(oldSecondBattle.challengeIssued.length,1)
assert.equal(document.getElementById('battleComparison'),fixedComparison)
assert.equal(fixedComparison.querySelector('[data-side=defend]'),fixedDefender)
assert.equal(fixedDefender.querySelector('[data-army-stat=men]'),fixedMen)
assert.equal(document.getElementById('battleWeatherImage'),fixedWeather)
assert.equal(fixedComparison.scrollTop,0)
assert.equal(win.getComputedStyle(fixedComparison).overflow,'hidden')
```

---

**Case / what it tests**

56. [watched all-battles spectator result appears in Events as a compact summary
and retains cause internally][test-source-287]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;battle().food.defend=0;for(let n=0;n<300&&battle()===oldSecondBattle;n++)await
wait(100);;openHUD();click('#closeHud');;click('#provinceNavigation
[data-screen=events]');;;;state().turn++;tools.get('select_rtk2_province').execu
te({province:state().selected});;
```

**Required output / success criteria**

```text
assert(!battle(),'Food exhaustion must settle the watched battle')
assert.equal(document.getElementById('provincePanel').dataset.screen,'turn')
assert(!document.querySelector('.strategic-chronology').textContent.includes('Re
sult:'))
assert(document.querySelector('.strategic-chronology').textContent.includes('Won
.'))
assert(state().lastBattle.reason.includes('food'))
assert.equal(document.getElementById('provincePanel').dataset.screen,'turn')
```

---

**Case / what it tests**

57. [actual scheduler resumes the saved second Hard AI-to-AI battle past day one
with no human involvement][test-source-288]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;exitGame();
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```

---

**Case / what it tests**

58. [incoming human alliance, marriage and joint proposals wait for actual
response, including the separate allied-force
choice][test-source-289]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const {Game,createCampaign}=await
import(path.join(source,'mjs/strategy.mjs')),scenarioData=JSON.parse(fs.readFile
Sync(path.join(source,'config/scenarios.json'))),terrainData=JSON.parse(fs.readF
ileSync(path.join(source,'config/province-terrain.json'))); for(const mode of
['alliance','marriage','joint']){const g=new
Game(createCampaign(scenarioData[0],[1]),{},terrainData);g.s.monthlyReview=null;
g.s.player=0;g.s.selected=9;g.s.paused=true;g.s.speed=g.s.settings.messageSpeed=
500;g.random=()=>.99;const
p=g.province(g.ruler(0).home),target=g.ruler(1),sender=g.ruler(0);if(mode==='joi
nt'){sender.alliances=[1];target.alliances=[0];}g.execute('diplomaticMission',{p
rovince:p.id,officer:p.officers.fi … (complete input/procedure at linked
L193–196)
```

**Required output / success criteria**

```text
assert(++n<100)
assert(document.getElementById('acceptProposal'))
assert(document.getElementById('refuseProposal'))
assert(document.getElementById('dialogBody').textContent.includes('Liu Bei
decides'))
assert(!state().journey.delivered)
assert.equal(JSON.stringify(state().journey),pending)
assert(!state().rulers[0].alliances.includes(1))
assert.equal(state().rulers[0].daughterGivenTo,1)
assert(document.getElementById('refuseAlly'))
assert.equal(state().allyDecisions.length,1)
assert.equal(state().allyDecisions.length,0)
```

---

**Case / what it tests**

59. [defeated human generals choose separately after victory display; escape
messages finish before governance][test-source-290]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
defeatedSave=JSON.parse(beforeRetreatCampaign);defeatedSave.humanRulers=[0];defe
atedSave.settings.battleView='all';defeatedSave.speed=defeatedSave.settings.mess
ageSpeed=500;defeatedSave.battle.outcome={winner:'defend',reason:'The invading
army exhausted its food.'};for(const u of
defeatedSave.battle.units.filter(u=>u.side==='attack'))defeatedSave.officers[u.i
d].hasHorse=true;const
defeatedPayload=JSON.stringify(defeatedSave);win.showOpenFilePicker=async()=>[{g
etFile:async()=>({name:'forced-retreat.json',size:defeatedPayload.length,text:as
ync()=>defeatedPayload})}];click('#loadGame');click('#readSave');await
waitUntil(()=>document.getElementById('confirmDefeatedRetreat'));;;exitGame() …
(complete input/procedure at linked L196–197)
```

**Required output / success criteria**

```text
assert(battle())
assert(battle().resultReviewed)
assert(!document.getElementById('launch').hidden)
assert(!document.getElementById('dialog').open)
assert(battle().resultReviewed)
assert.equal(state().lastBattle?.reason==='The invading army exhausted its
food.',false)
assert(previousButton&&document.getElementById('dialog').open)
assert(!battle())
assert.equal(state().lastBattle.winner,'defend')
assert.equal(state().lastBattle.reason,'The invading army exhausted its food.')
```

---

**Case / what it tests**

60. [normal/simultaneous sounds follow every participant, prior-order helpers
animate, HUD pauses cues, fireball sounds play and throttled charge frames
preserve a single order cry][test-source-291]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
;exitGame(); for(const action of ['attack','simultaneous','fireball','charge']){
const
payload=beforeRetreatCampaign;win.showOpenFilePicker=async()=>[{getFile:async()=
>({name:'combat-v42.json',size:payload.length,text:async()=>payload})}];click('#
loadGame');click('#readSave');await wait(100);rootOrders(); const
b=battle(),u=b.units.find(v=>v.id===0),ally=b.units.find(v=>v.id===34),target=b.
units.find(v=>v.side==='defend'&&v.id!==b.leaders.defend);b.terrain=Array(156).f
ill(0);b.terrain[b.palace.r*13+b.palace.q]=6;let row=0;for(const v of
b.units)Object.assign(v,{q:0,r:row++,ordered:false,routed:false,fled:false,captu
red:false,soldiers:5000,mobility:10});Object.assign(u,{q:6,r:6});Object.assig …
(complete input/procedure at linked L197–208)
```

**Required output / success criteria**

```text
assert.equal(b.selected,ally.id)
assert(blinking.getAttribute('aria-label').includes(state().officers[ally.id].na
me))
assert(blinking.classList.contains('selected'))
assert(fireDraws.length>3)
assert(fireDraws.every(x=>Math.abs(x.alpha-.5)<1/255))
assert(new Set(fireDraws.map(x=>x.args[3].toFixed(2))).size>1)
assert(fireDraws.every(x=>x.args[3]>=36))
assert(rasterFiles.includes('./assets/artwork/fire-v42.webp'))
assert(!hidden||hidden.style.display==='none')
assert.equal(b.lastAction.type,'fireball')
assert.equal(firePlays(),fireBefore+1)
assert(!window.rtk2.diagnostics.combatAnimation)
assert.equal(b.lastAction.type,'charge')
assert.equal(combatPlays()-cueBefore,1)
assert.deepEqual(window.rtk2.diagnostics.combatAnimation.units,ids)
assert.equal(JSON.stringify(window.rtk2.diagnostics.combatAnimation),pausedAnima
tion)
assert.equal(combatPlays(),pausedSound)
assert.equal(node.dataset.attacking,'true')
assert.equal(Number(node.dataset.attackFrame),a.frame)
assert(!document.getElementById('toast').textContent.includes('enemy losses'))
assert.equal(combatPlays()-cueBefore,action==='simultaneous'?b.lastAction.exchan
ges:1)
assert(ally.ordered&&ally.orderDay===b.day)
assert(b.lastAction.lossRows.some(row=>row.unit===ally.id))
assert.deepEqual([...cycles],[1,2,3,4,5,6,7,8])
assert.deepEqual([...frames].sort(),[0,1])
assert.deepEqual([...pairs],action==='simultaneous'?b.lastAction.combatUnits.fil
ter(v=>v.id!==target.id).slice(0,b.lastAction.exchanges).map(v=>v.id+','+target.
id):[u.id+','+target.id])
assert.equal(JSON.stringify(b.units),resolved)
assert.equal(state().seed,seed)
assert(fireDraws.length>burningDraws)
assert.equal(fireDraws.length,extinguished)
```

---

**Case / what it tests**

61. [battlefield hex information expires at each game speed in spectator and
human modes][test-source-292]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const humans of [[],[0]]){ const
fixture=JSON.parse(beforeRetreatCampaign);fixture.humanRulers=humans;fixture.set
tings.battleView='all';fixture.paused=true;fixture.monthlyReview=null;const
payload=JSON.stringify(fixture);win.showOpenFilePicker=async()=>[{getFile:async(
)=>({name:'tile-v48.json',size:payload.length,text:async()=>payload})}];click('#
loadGame');click('#readSave');await wait(100); for(const speed of
[500,1000,2000,3000]){state().speed=state().settings.messageSpeed=speed;const
unit=[...document.querySelectorAll('.unit-label')].find(n=>n.style.display!=='no
ne');;unit.click();;await wait(speed-150);;await
waitUntil(()=>document.getElementById('battleTileDetails').hidden,500);} …
(complete input/procedure at linked L208–215)
```

**Required output / success criteria**

```text
assert(unit)
assert(!document.getElementById('battleTileDetails').hidden)
assert(!document.getElementById('battleTileDetails').hidden)
```

---

**Case / what it tests**

62. [two concealed ambushers play separate attack animations without repeating
damage or RNG][test-source-293]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; { const
payload=beforeRetreatCampaign;win.showOpenFilePicker=async()=>[{getFile:async()=
>({name:'double-ambush-v48.json',size:payload.length,text:async()=>payload})}];c
lick('#loadGame');click('#readSave');await wait(100);rootOrders(); const
{ambushCells}=await
import('../mjs/battle.mjs'),b=battle(),u=b.units.find(v=>v.id===0),friend=b.unit
s.find(v=>v.id===34),enemies=b.units.filter(v=>v.side==='defend').slice(0,2),fro
m={q:6,r:5},to=direction(from.q,from.r,0),cells=ambushCells(from,to).filter(p=>d
istance(from,p)>1);b.units=[u,friend,...enemies];b.side='attack';b.selected=u.id
;b.terrain=Array(156).fill(0);b.terrain[155]=6;b.palace={q:12,r:11};b.weather='s
unny';b.fire={};state().paused=true;  … (complete input/procedure at linked
L215–223)
```

**Required output / success criteria**

```text
assert(animation.units.includes(u.id))
assert([...document.querySelectorAll('.unit-label[data-attacking=true]')].some(n
=>n.getAttribute('aria-label').includes(state().officers[id].name+',')))
assert.equal(seen.length,2)
assert.deepEqual([...cycles],[1,2,3,4,5,6,7,8])
assert.deepEqual(new Set(seen),new Set(enemies.map(v=>v.id)))
assert.equal(JSON.stringify(b.units),resolved)
assert.equal(state().seed,seed)
```

---

**Case / what it tests**

63. [BUG-53-04 mounted human attacker and defender never see hidden AI sprites,
labels, flags or selection overlays during AI
turns][test-source-294]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const {Game:DisplayGame,createCampaign:displayCampaign}=await
import('../mjs/strategy.mjs'); const
displayScenarios=JSON.parse(fs.readFileSync(path.join(source,'config/scenarios.j
son'))),displayTerrains=JSON.parse(fs.readFileSync(path.join(source,'config/prov
ince-terrain.json'))); for(const humans of [[],[0]])for(const viewing of
['personal','all'])for(const winner of ['attack','defend']){ const model=new
DisplayGame(displayCampaign(displayScenarios[0],humans),{},structuredClone(displ
ayTerrains));model.s.settings.battleView='all';model.invade({province:9,target:8
,governor:33,officers:[0,34],food:20000});model.random=()=>0;model.s.battle.outc
ome={winner,reason:'Interface result fixture'};mo … (complete input/procedure at
linked L223–237)
```

**Required output / success criteria**

```text
assert.equal(document.getElementById('dialogTitle').textContent,winner==='attack
'?'Attack victorious':'Attack defeated')
assert(copy.includes(record.attacker.name))
assert(copy.includes(record.defender.name))
assert(copy.includes('#8'))
assert(copy.includes(record.commanders[winner==='attack'?'defend':'attack'].name
))
assert(document.querySelector('.commander-fate'))
assert(art._canvas)
assert(art._canvas.getContext('2d').getImageData(0,0,art.width,art.height).data.
some((v,i)=>i%4!==3&&v>80))
assert(!document.getElementById('continueTriumph'))
assert(document.getElementById('dialogFooter').hidden)
assert(state().battleResultReviews?.length)
assert(hidden.length>=b.units.filter(u=>u.side!==humanSide).length)
assert(!hostileNames.some(name=>node.getAttribute('aria-label')?.includes(name))
)
assert(b.units.filter(u=>u.side===humanSide).some(u=>[...document.querySelectorA
ll('.unit-label')].some(n=>n.getAttribute('aria-label').includes(fixture.officer
s[u.id].name))))
```

---

**Case / what it tests**

64. [BUG-53-09 and BUG-53-10 mounted compact sender/relationship/consequence GUI
and capture-release native-sounding animated
return][test-source-295]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; { const model=new
DisplayGame(displayCampaign(displayScenarios[0],[0,1]),{},structuredClone(displa
yTerrains));model.s.monthlyReview=null;model.s.paused=true;model.random=()=>.99;
model.execute('diplomaticMission',{province:9,officer:34,target:1,mode:'gift',am
ount:100});const
j=model.s.journey,leg=j.legs[0];leg.index=leg.route.length-1;j.interception={own
er:1,province:leg.route[leg.index],officer:34};const
payload=JSON.stringify(model.s);win.showOpenFilePicker=async()=>[{getFile:async(
)=>({name:'interception-v53.json',size:payload.length,text:async()=>payload})}];
click('#loadGame');click('#readSave');await wait(100);const
context=document.querySelector('.messenger-context');;;;;;;;;;click('# …
(complete input/procedure at linked L237–241)
```

**Required output / success criteria**

```text
assert(context)
assert(context.textContent.includes('Sender: Cao Cao'))
assert(context.textContent.includes('From #9'))
assert(context.textContent.includes('Hostility: sender → Liu Bei'))
assert(context.textContent.includes('/100'))
assert(document.querySelector('#freeMessenger
small').textContent.includes('Continue mission'))
assert.equal(win.getComputedStyle(document.getElementById('dialogFooter')).flexW
rap,'wrap')
assert.equal(win.getComputedStyle(document.querySelector('#captureMessenger
small')).whiteSpace,'normal')
assert(!document.getElementById('captureMessenger').disabled)
assert(document.getElementById('freeCaptive'))
assert(document.querySelector('.messenger-context').textContent.includes('Sender
: Cao Cao'))
assert(document.querySelector('#freeCaptive small').textContent.includes('Return
to sender'))
assert.equal(state().journey.type,'messengerReturn')
assert.equal(state().journey.phase,'return')
assert.equal(state().officers[34].owner,0)
assert(media.some(a=>a.src.includes('audiomass-horse_gallop')&&!a.paused))
assert(document.getElementById('scene')._canvas)
assert(++n<80)
assert(!state().officers[34].inTransit)
```


<a id="tests-v15-tests-mjs"></a>
## tests/v15-tests.mjs

Source: [tests/v15-tests.mjs](../tests/v15-tests.mjs). Purpose: War monthly
estimate follows actual daily deductions and adjusts for selected troop
strength; Victory persists before captive decisions and blocks orders until
acknowledged; Original saves retain their one-slot rules; Expanded seeds only
the native gameplay daughter; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`/battle-music-v17.mp3`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/ruler-family.mjs`,
`../mjs/game-ui.mjs`, `../mjs/war-provisions.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [War monthly estimate follows actual daily deductions and adjusts for
selected troop strength][test-source-296]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('War monthly estimate follows actual daily deductions and adjusts for
selected troop strength',()=>{ const
g=fresh(false);g.s.settings.battleView='all';g.invade({province:9,target:8,gover
nor:33,officers:[0,34],food:30000,gold:500});while(g.s.battle.phase==='deploymen
t')aiBattle(g);const
b=g.s.battle,men=living(b).filter(u=>u.side==='attack').reduce((n,u)=>n+u.soldie
rs,0),before=b.food.attack,e=warProvisions(men,before);g.battleAction('end');g.b
attleAction('end');;;;; })
```

**Required output / success criteria**

```text
assert.equal(b.food.attack,before-e.daily)
assert.equal(e.monthly,e.daily*30)
assert.equal(warProvisions(20000,30000).days,45)
assert.equal(warProvisions(0,1000).monthly,0)
```

---

**Case / what it tests**

2. [Victory persists before captive decisions and blocks orders until
acknowledged][test-source-297]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Victory persists before captive decisions and blocks orders until
acknowledged',()=>{ const
g=fresh(false);g.s.settings.battleView='all';g.invade({province:9,target:8,gover
nor:33,officers:[0,34],food:30000,gold:500});g.s.battle.outcome={winner:'attack'
,reason:'Enemy army defeated'};g.resolveBattle();;;const
saved=valid(g);;;;g.acknowledgeTriumph();;;valid(g); })
```

**Required output / success criteria**

```text
assert(g.s.triumph)
assert(g.s.captiveDecisions.length)
assert.deepEqual(saved.triumph,g.s.triumph)
assert.throws(()=>g.execute('search',{province:8,officer:34}),/victory screen/)
assert.throws(()=>g.finishFactionTurn(),/victory screen/)
assert.equal(g.s.triumph,null)
assert(g.s.captiveDecisions.length)
```

---

**Case / what it tests**

3. [Original saves retain their one-slot rules; Expanded seeds only the native
gameplay daughter][test-source-298]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Original saves retain their one-slot rules; Expanded seeds only the native
gameplay daughter',()=>{ const
g=fresh(false);;;g.s.familyMode='expanded';initializeRoyalFamilies(g.s);const
f=g.ruler().family;;;;;valid(g); })
```

**Required output / success criteria**

```text
assert.equal(g.s.familyMode,'original')
assert(!g.ruler().family)
assert.equal(f.children.length,1)
assert.equal(childAge(g.s,f.children[0]),18)
assert(f.children[0].nativeSlot)
assert.equal(g.s.officers.length,255)
```

---

**Case / what it tests**

4. [Court marriage consumes the ruler action and exactly 100 gold, and cannot be
duplicated][test-source-299]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Court marriage consumes the ruler action and exactly 100 gold, and cannot
be duplicated',()=>{ const
g=fresh(),p=g.province(9),before=p.gold;g.execute('courtMarriage',{province:9});
;;;const state=JSON.stringify(g.s);;;valid(g); })
```

**Required output / success criteria**

```text
assert.equal(p.gold,before-100)
assert.equal(g.ruler().family.spouse.kind,'court')
assert(g.officer(g.ruler().leader).acted)
assert.throws(()=>g.execute('courtMarriage',{province:9}))
assert.equal(JSON.stringify(g.s),state)
```

---

**Case / what it tests**

5. [Royal proposals enforce age 16, ruler sex, unmarried recipient, and
reciprocal family links][test-source-300]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Royal proposals enforce age 16, ruler sex, unmarried recipient, and
reciprocal family links',()=>{ const
g=fresh(),r=g.ruler(),target=g.ruler(3),child=r.family.children[0];child.birthMo
nth=g.s.year*12+g.s.month-1-15*12;;child.birthMonth-=12;;acceptRoyalProposal(g,r
,target,child.id);;;;valid(g); const
h=fresh(),source=h.ruler(),woman=h.ruler(3);h.officer(woman.leader).sex='female'
;;const
id=source.family.nextChild++,prince={id:source.family.id+'-c'+id,name:'Prince
Test',sex:'male',birthMonth:h.s.year*12+h.s.month-1-16*12,marriedTo:null,married
Leader:null,eligibleNotified:true};source.family.children.push(prince);acceptRoy
alProposal(h,source,woman,prince.id);;valid(h); })
```

**Required output / success criteria**

```text
assert.throws(()=>checkRoyalProposal(g,r,target,child.id),/16/)
assert.equal(checkRoyalProposal(g,r,target,child.id),child)
assert.equal(target.family.spouse.child,child.id)
assert.equal(eligibleRoyalChildren(g.s,r).length,0)
assert.throws(()=>checkRoyalProposal(g,r,target,child.id),/unmarried/)
assert.throws(()=>checkRoyalProposal(h,source,woman,source.family.children[0].id
))
assert.equal(woman.family.spouse.sex,'male')
```

---

**Case / what it tests**

6. [Royal births use saved gestation, cooldown and gender; offspring do not
inflate the officer roster][test-source-301]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Royal births use saved gestation, cooldown and gender; offspring do not
inflate the officer roster',()=>{ const
g=fresh();g.execute('courtMarriage',{province:9});g.random=()=>0;const
start=g.s.year*12+g.s.month-1,first=report();royalFamilyUpkeep(g,first);;g.s=val
id(g);setMonth(g.s,start+8);royalFamilyUpkeep(g,report());;setMonth(g.s,start+9)
;const
birth=report();royalFamilyUpkeep(g,birth);;;;;royalFamilyUpkeep(g,report());;set
Month(g.s,start+20);royalFamilyUpkeep(g,report());;setMonth(g.s,start+21);royalF
amilyUpkeep(g,report());;valid(g); })
```

**Required output / success criteria**

```text
assert.equal(g.ruler().family.pregnancy.due,start+9)
assert.equal(g.ruler().family.children.length,1)
assert.equal(g.ruler().family.children.length,2)
assert.equal(birth.details[0].title,'A royal child is born')
assert.equal(g.ruler().family.children[1].sex,'female')
assert.equal(g.s.officers.length,255)
assert.equal(g.ruler().family.pregnancy,null)
assert.equal(g.ruler().family.pregnancy,null)
assert(g.ruler().family.pregnancy)
```

---

**Case / what it tests**

7. [An actual monthly council includes a royal birth and survives save
validation][test-source-302]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An actual monthly council includes a royal birth and survives save
validation',()=>{const
g=fresh();g.execute('courtMarriage',{province:9});g.ruler().family.pregnancy={du
e:g.s.year*12+g.s.month,sex:'male'};const result=g.endMonth();;;})
```

**Required output / success criteria**

```text
assert(result.details.some(e=>e.title==='A royal child is born'))
assert(valid(g).lastReport.details.some(e=>e.title==='A royal child is born'))
```

---

**Case / what it tests**

8. [Coming-of-age notices occur once; no expected birth for unmarried or
age-ineligible families][test-source-303]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Coming-of-age notices occur once; no expected birth for unmarried or
age-ineligible families',()=>{ const
g=fresh(),f=g.ruler().family,c=f.children[0],stamp=g.s.year*12+g.s.month-1;c.bir
thMonth=stamp-16*12;c.eligibleNotified=false;g.random=()=>0;const
a=report();royalFamilyUpkeep(g,a);;;const
b=report();royalFamilyUpkeep(g,b);;g.execute('courtMarriage',{province:9});f.spo
use.birthMonth=stamp-46*12;royalFamilyUpkeep(g,report());;valid(g); })
```

**Required output / success criteria**

```text
assert.equal(a.details.length,1)
assert.equal(f.pregnancy,null)
assert.equal(b.details.length,0)
assert.equal(f.pregnancy,null)
```

---

**Case / what it tests**

9. [Ruler retirement preserves genealogy and frees their royal spouse for
remarriage][test-source-304]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Ruler retirement preserves genealogy and frees their royal spouse for
remarriage',()=>{ const
g=fresh(),parent=g.ruler(),target=g.ruler(3),child=parent.family.children[0];acc
eptRoyalProposal(g,parent,target,child.id);retireRulerFamily(g.s,target);;;;targ
et.leader=g.province(target.home).officers.find(id=>id!==target.leader);target.n
ame=g.officer(target.leader).name;initializeRoyalFamilies(g.s);;;; })
```

**Required output / success criteria**

```text
assert.equal(child.marriedTo,null)
assert(child.widowed)
assert(g.s.familyArchives.length)
assert.equal(target.family.spouse,null)
assert.equal(g.s.familyArchives[0].children.length,1)
assert(eligibleRoyalChildren(g.s,parent).includes(child))
```

---

**Case / what it tests**

10. [Family validation rejects malformed age, pregnancy, duplicate child and
marriage links][test-source-305]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Family validation rejects malformed age, pregnancy, duplicate child and
marriage links',()=>{ for(const mutate of
[s=>s.rulers[0].family.children[0].birthMonth=s.year*12+100,s=>s.rulers[0].famil
y.pregnancy={due:s.year*12+100,sex:'female'},s=>s.rulers[0].family.children.push
(structuredClone(s.rulers[0].family.children[0])),s=>s.rulers[0].family.children
[0].marriedTo=3]){const g=fresh();mutate(g.s);;} })
```

**Required output / success criteria**

```text
assert.throws(()=>valid(g))
```

---

**Case / what it tests**

11. [Advisor reward estimates identify useless gold, full loyalty, horse stock,
and writings prerequisites][test-source-306]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Advisor reward estimates identify useless gold, full loyalty, horse stock,
and writings prerequisites',()=>{ const
g=fresh(false),p=g.province(9);g.ruler().advisor=33;g.officer(33).int=100;g.s.mo
nthlyAdvice.intelligence[33]=100;g.officer(0).charm=80;g.officer(34).loyalty=50;
;;g.officer(34).loyalty=100;;g.officer(34).loyalty=50;p.horses=0;;g.officer(34).
int=99;;g.officer(34).int=60;;; })
```

**Required output / success criteria**

```text
assert(orderInsight(g,'Reward · Gold',34,{amount:1}).includes('Best affordable
result this order'))
assert(orderInsight(g,'Reward · Gold',34,{amount:50}).includes('50 → 60–61'))
assert(orderInsight(g,'Reward · Gold',34,{amount:50}).includes('already has
loyalty 100'))
assert(orderInsight(g,'Reward · Horse',34,{amount:1}).includes('no horse'))
assert(orderInsight(g,'Reward · Writings',34,{amount:1}).includes('two fewer'))
assert(orderInsight(g,'Reward · Writings',34,{amount:1}).includes('60 → 61'))
assert(orderInsight(g,'Give food to the
people',34,{amount:1000}).includes('Popular loyalty'))
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(council.paused);
assert(bus.track.src.endsWith('/battle-music-v17.mp3'));
assert.equal(bus.track.currentTime,3);
assert(!bus.track.loop);
assert(bus.track.paused)
```

<a id="tests-v16-tests-mjs"></a>
## tests/v16-tests.mjs

Source: [tests/v16-tests.mjs](../tests/v16-tests.mjs). Purpose: Captured field
commander is last for either winning side and remains last after saving; Monthly
order availability accounts for governor, ruler, season, visitors, and ready
officers without changing the campaign; Map numbers default on in old saves and
persist independently of ownership; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:assert/strict`, `node:fs`, `@napi-rs/canvas`,
`../mjs/strategy.mjs`, `../mjs/order-availability.mjs`,
`../mjs/battle-presentation.mjs`, `../mjs/portraits.mjs`,
`../mjs/officer-roster.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Captured field commander is last for either winning side and remains last
after saving][test-source-307]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Captured field commander is last for either winning side and remains last
after saving',()=>{ for(const winner of ['attack','defend']){ const
g=fresh();g.invade({province:9,target:8,governor:33,officers:[0,34],food:30000,g
old:500});g.s.humanRulers.push(g.s.battle.defender);const
b=g.s.battle,loser=winner==='attack'?'defend':'attack',leader=b.leaders[loser];
if(winner==='defend')for(const u of
b.units.filter(u=>u.side==='attack'))u.captured=true;
b.outcome={winner,reason:'Enemy commander defeated'};g.resolveBattle();const
owner=winner==='attack'?b.attacker:b.defender,queue=g.s.captiveDecisions.filter(
c=>c.owner===owner);;;; const saved=validateSave(g.s,scenarios,terrains);; } })
```

**Required output / success criteria**

```text
assert(queue.length>1)
assert.equal(queue.at(-1).officer,leader)
assert.equal(g.s.lastBattle.captured.at(-1),leader)
assert.equal(saved.captiveDecisions.filter(c=>c.owner===owner).at(-1).officer,le
ader)
```

---

**Case / what it tests**

2. [Monthly order availability accounts for governor, ruler, season, visitors,
and ready officers without changing the
campaign][test-source-308]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Monthly order availability accounts for governor, ruler, season, visitors,
and ready officers without changing the campaign',()=>{ const
g=fresh(),p=g.province(9);const before=JSON.stringify(g.s);;;
g.officer(p.governor).acted=true;;;;;g.officer(p.governor).acted=false;
g.s.month=7;;g.s.month=1;p.merchant=false;; for(const id of
p.officers)g.officer(id).acted=true;;;;; g.s.provinceCompleted.push(p.id);; })
```

**Required output / success criteria**

```text
assert.equal(orderUnavailable(g,p,'develop'),null)
assert.equal(JSON.stringify(g.s),before)
assert.match(orderUnavailable(g,p,'reward'),/already acted/)
assert.match(orderUnavailable(g,p,'tax'),/already acted/)
assert.match(orderUnavailable(g,p,'exile'),/already acted/)
assert.equal(orderUnavailable(g,p,'develop'),null)
assert.match(orderUnavailable(g,p,'tax'),/July/)
assert.match(orderUnavailable(g,p,'trade'),/merchant/)
assert.match(orderUnavailable(g,p,'develop'),/available/)
assert.equal(orderUnavailable(g,p,'view'),null)
assert.equal(orderUnavailable(g,p,'map'),null)
assert.equal(orderUnavailable(g,p,'rest'),null)
assert.match(orderUnavailable(g,p,'develop'),/finished/)
```

---

**Case / what it tests**

3. [Map numbers default on in old saves and persist independently of
ownership][test-source-309]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Map numbers default on in old saves and persist independently of
ownership',()=>{ const g=fresh();; for(const ownership of
[false,true]){g.s.settings.ownership=ownership;g.s.settings.showNumbers=false;co
nst s=validateSave(g.s,scenarios,terrains);;;} })
```

**Required output / success criteria**

```text
assert.equal(validateSave(g.s,scenarios,terrains).settings.showNumbers,true)
assert.equal(s.settings.showNumbers,false)
assert.equal(s.settings.ownership,ownership)
```

---

**Case / what it tests**

4. [Only the selected living, unspent unit on the acting side blinks;
unavailable tactics explain why][test-source-310]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Only the selected living, unspent unit on the acting side blinks;
unavailable tactics explain why',()=>{ const
b={phase:'battle',side:'attack',selected:4,weather:'rain'},u={id:4,side:'attack'
,placed:true,ordered:false,soldiers:500};; for(const patch of
[{id:5},{side:'defend'},{ordered:true},{soldiers:0},{routed:true},{fled:true},{p
laced:false}]); ;;;;; })
```

**Required output / success criteria**

```text
assert(activeBattleUnit(b,u))
assert(!activeBattleUnit(b,{...u,...patch}))
assert(!activeBattleUnit({...b,phase:'deployment'},u))
assert(!activeBattleUnit({...b,outcome:{winner:'attack'}},u))
assert.match(battleOrderUnavailable(b,{...u,ordered:true},'wait'),/already/)
assert.match(battleOrderUnavailable(b,u,'fireball'),/rain/)
assert.equal(battleOrderUnavailable(b,{...u,ordered:true},'view'),null)
```

---

**Case / what it tests**

5. [Fifteen historical identity overrides retain 352 unique assignments and date
the Xiahou Dun eye injury][test-source-311]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Fifteen historical identity overrides retain 352 unique assignments and
date the Xiahou Dun eye injury',()=>{ const seen=new
Set(OFFICER_ROSTER.map(o=>JSON.stringify(portraitFrame(o,189))));; for(const
name of HISTORIC_PORTRAITS){const
officer=OFFICER_ROSTER.find(o=>o.name===name);;;} const
dun=OFFICER_ROSTER.find(o=>o.name==='Xiahou Dun');;; })
```

**Required output / success criteria**

```text
assert.equal(seen.size,352)
assert(officer)
assert.equal(portraitFrame(officer).atlas,'officersHistoric')
assert.equal(portraitFrame(dun,197).cell,15)
assert.equal(portraitFrame(dun,198).cell,5)
```


<a id="tests-v17-tests-mjs"></a>
## tests/v17-tests.mjs

Source: [tests/v17-tests.mjs](../tests/v17-tests.mjs). Purpose: all 41 unique
paintings load, retain aspect ratio and match the original terrain identity and
renderer registration; battlefield rendering has no terrain autotiling or
texture blending path; the faster battlefield composition and separately
preloaded victory artwork are present.

Shared inputs: `config/battlefield-paintings.json`,
`config/province-terrain.json`, `assets/music/battle-music-v17.mp3`,
`assets/music/triumph-music.mp3`, `assets/artwork/triumph-v17.webp`.
Dependencies/entry points: `node:assert/strict`, `node:fs`, `node:crypto`,
`@napi-rs/canvas`, `../mjs/battlefield-art.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [all 41 unique paintings load, retain aspect ratio and match the original
terrain identity and renderer registration][test-source-312]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const sha=data=>crypto.createHash('sha256').update(data).digest('hex'); const
manifest=JSON.parse(fs.readFileSync('config/battlefield-paintings.json')); const
terrains=JSON.parse(fs.readFileSync('config/province-terrain.json')); ;; const
hashes=new Set(); for(const map of manifest.maps){ const
bytes=fs.readFileSync(map.asset);;;hashes.add(map.sha256); ;; ;; const
image=await loadImage(bytes);;;; const
screen=p=>({x:p.x*10+100,y:p.z*10+104}),rect=paintingRect(image,10,screen); ;;;
const
canvas=createCanvas(200,220),ctx=canvas.getContext('2d');paintBattlefield(ctx,im
age,10,screen);const pixels=ctx.getImageData(0,0,200,220).data; ; }
```

**Required output / success criteria**

```text
assert.equal(manifest.maps.length,41)
assert.deepEqual(manifest.maps.map(m=>m.province),Array.from({length:41},(_,i)=>
i+1))
assert.equal(sha(bytes),map.sha256)
assert(!hashes.has(map.sha256))
assert.deepEqual(map.terrain,terrains[map.province-1])
assert.equal(map.terrainSha256,sha(Buffer.from(terrains[map.province-1])))
assert.equal(map.asset,'assets/artwork/'+battlefieldFile(map.province))
assert.equal(battlefieldKey(map.province),'battlefield'+String(map.province).pad
Start(2,'0'))
assert.equal(image.width,map.width)
assert.equal(image.height,map.height)
assert(Math.abs(image.width/image.height-1024/1109)<.002)
assert(Math.abs(rect.width/rect.height-image.width/image.height)<1e-12)
assert.equal(rect.x,0)
assert.equal(rect.y,screen({x:0,z:BATTLEFIELD_BOUNDS.top}).y)
assert(pixels.some((v,i)=>i%4!==3&&v>70))
```

---

**Case / what it tests**

2. [battlefield rendering has no terrain autotiling or texture blending
path][test-source-313]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const code=fs.readFileSync('mjs/raster-world.mjs','utf8');;;; ;
```

**Required output / success criteria**

```text
assert(!code.includes('createTerrainPainter'))
assert(!code.includes('terrainVariant'))
assert(code.includes('paintBattlefield'))
assert(!fs.existsSync('mjs/terrain-art.mjs'))
```

---

**Case / what it tests**

3. [the faster battlefield composition and separately preloaded victory artwork
are present][test-source-314]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const audio=fs.readFileSync('tools/build-battle-audio.py','utf8');;;; const
victory=await loadImage('assets/artwork/triumph-v17.webp');;
```

**Required output / success criteria**

```text
assert(audio.includes('BATTLE_BPM=144'))
assert(fs.statSync('assets/music/battle-music-v17.mp3').size>100000)
assert(fs.statSync('assets/music/triumph-music.mp3').size>100000)
assert.equal(victory.width/victory.height,16/9)
```


<a id="tests-v18-tests-mjs"></a>
## tests/v18-tests.mjs

Source: [tests/v18-tests.mjs](../tests/v18-tests.mjs). Purpose: March requires a
remaining governor, rejects invalid choices atomically and preserves appointment
through battle save/load; Candidate advice changes with loyalty and describes
military/economic risk without consuming RNG; Province 9 map routes share the
native graph with War/Move and exclude visually close Province 18; additional
cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/game-ui.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [March requires a remaining governor, rejects invalid choices atomically and
preserves appointment through battle save/load][test-source-315]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const
scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrains=JSON.par
se(fs.readFileSync('config/province-terrain.json')),fresh=()=>new
Game(createCampaign(scenarios[0],[0]),{},terrains); const
g=fresh(),args={province:9,target:8,officers:[0,34],food:20000,gold:500},before=
JSON.stringify(g.s); ;;;;g.invade({...args,governor:35});;;const h=new
Game(validateSave(g.s,scenarios,terrains),{},terrains);h.normalize();;h.s.battle
.outcome={winner:'defend',reason:'Withdrawn'};h.resolveBattle();;
```

**Required output / success criteria**

```text
assert.throws(()=>g.invade(args),/Choose who will govern/)
assert.equal(JSON.stringify(g.s),before)
assert.throws(()=>g.invade({...args,governor:34}),/remains/)
assert.equal(JSON.stringify(g.s),before)
assert.equal(g.province(9).governor,35)
assert(!g.officer(35).acted)
assert.equal(h.province(9).governor,35)
assert.equal(h.province(9).governor,0)
```

---

**Case / what it tests**

2. [Candidate advice changes with loyalty and describes military/economic risk
without consuming RNG][test-source-316]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
a=fresh();a.ruler().advisor=33;a.officer(33).int=95;a.s.monthlyAdvice.intelligen
ce[33]=100;const o=a.officer(35);o.loyalty=35;o.soldiers=0;const
seed=a.s.seed,low=orderInsight(a,'Appoint governor',35);;;;o.loyalty=99;const
high=orderInsight(a,'Appoint governor',35);;;;
```

**Required output / success criteria**

```text
assert(low.includes('defection/rebellion'))
assert(low.includes('LOY 35'))
assert(low.includes('vulnerable'))
assert(high.includes('Strong loyalty'))
assert.notEqual(high,low)
assert.equal(a.s.seed,seed)
```

---

**Case / what it tests**

3. [Province 9 map routes share the native graph with War/Move and exclude
visually close Province 18][test-source-317]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const p=a.province(9);;;;const
code=fs.readFileSync('mjs/raster-world.mjs','utf8');;;
```

**Required output / success criteria**

```text
assert.deepEqual([...p.neighbors].sort((x,y)=>x-y),[6,7,8,10,16,17])
assert.deepEqual(p.neighbors.filter(id=>[255,p.owner].includes(a.province(id).ow
ner)),[17])
assert(!p.neighbors.includes(18))
assert(code.includes('new Set(selectedProvince.neighbors)'))
assert(code.includes('connected.has(p.id)'))
```

---

**Case / what it tests**

4. [Rival Tigers uses distinct envoys and destinations; malformed assignments
are rejected and diplomacy uses one envoy][test-source-318]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
r=fresh(),raw=JSON.stringify(r.s),mission={province:9,mode:'rival',target:3,othe
r:10,officer:33};;;r.execute('spyMission',{...mission,second:34});const
j=r.s.journey;;;;;validateSave(r.s,scenarios,terrains);const
bad=structuredClone(r.s);bad.journey.legs.pop();;const
s=fresh();s.execute('diplomaticMission',{province:9,mode:'alliance',target:3,off
icer:33});;
```

**Required output / success criteria**

```text
assert.throws(()=>r.execute('spyMission',{...mission,second:33}))
assert.equal(JSON.stringify(r.s),raw)
assert.equal(j.legs.length,2)
assert.deepEqual(j.legs.map(l=>l.officer),[33,34])
assert.equal(j.legs[0].route.at(-1),r.ruler(3).home)
assert.equal(j.legs[1].route.at(-1),r.ruler(10).home)
assert.throws(()=>validateSave(bad,scenarios,terrains),/messenger/)
assert.equal(s.s.journey.legs.length,1)
```


<a id="tests-v19-tests-mjs"></a>
## tests/v19-tests.mjs

Source: [tests/v19-tests.mjs](../tests/v19-tests.mjs). Purpose: every order is
rolled before presentation, INT80 has independent available/unavailable orders
and retries/save-load preserve decisions without RNG; changing candidates,
amounts or midmonth intelligence cannot reroll an unavailable order; council
advice shares the same monthly gate; monthly rollover refreshes capability,
INT100/0 are exact and malformed decisions reject while old saves migrate;
additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/monthly-advice.mjs`, `../mjs/game-ui.mjs`,
`../mjs/province-rules.mjs`, `../mjs/advice-topics.mjs`,
`../mjs/province-choice.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [every order is rolled before presentation, INT80 has independent
available/unavailable orders and retries/save-load preserve decisions without
RNG][test-source-319]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const
scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrains=JSON.par
se(fs.readFileSync('config/province-terrain.json'));const
s=createCampaign(scenarios[0],[0]),g=new
Game(s,{},terrains),r=g.ruler(),a=g.officer(33);r.advisor=33;s.monthlyAdvice.int
elligence[33]=80;a.int=80; const rolls=s.monthlyAdvice.rolls[r.id];;const
good=ADVICE_ORDERS.find(k=>rolls[k]<.8),bad=ADVICE_ORDERS.find(k=>rolls[k]>=.8);
;;;const frozen=JSON.stringify(s.monthlyAdvice),seed=s.seed; for(let
i=0;i<20;i++){;;};;const restored=new
Game(validateSave(s,scenarios,terrains),{},terrains);;;
```

**Required output / success criteria**

```text
assert.deepEqual(Object.keys(rolls),ADVICE_ORDERS)
assert(good&&bad)
assert(canAdvise(s,r,a,good))
assert(!canAdvise(s,r,a,bad))
assert(!canAdvise(s,r,a,bad))
assert(canAdvise(s,r,a,good))
assert.equal(JSON.stringify(s.monthlyAdvice),frozen)
assert.equal(s.seed,seed)
assert.equal(JSON.stringify(restored.s.monthlyAdvice),frozen)
assert(!canAdvise(restored.s,restored.ruler(),restored.officer(33),bad))
```

---

**Case / what it tests**

2. [changing candidates, amounts or midmonth intelligence cannot reroll an
unavailable order; council advice shares the same monthly
gate][test-source-320]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; s.monthlyAdvice.rolls[r.id].cultivate=.9;const
unavailable=orderInsight(g,'Cultivate',34,{amount:10});;;a.int=100;;s.monthlyAdv
ice.rolls[r.id].general=.9;s.monthlyAdvice.rolls[r.id].war=.9;;;
```

**Required output / success criteria**

```text
assert(unavailable.includes(ADVICE_UNAVAILABLE))
assert(orderInsight(g,'Cultivate',35,{amount:90}).includes(ADVICE_UNAVAILABLE))
assert(orderInsight(g,'Cultivate',34).includes(ADVICE_UNAVAILABLE))
assert(provinceAdvice(g,g.province(9)).includes(ADVICE_UNAVAILABLE))
assert(adviceTopic(g,g.province(9),'war').includes(ADVICE_UNAVAILABLE))
```

---

**Case / what it tests**

3. [monthly rollover refreshes capability, INT100/0 are exact and malformed
decisions reject while old saves migrate][test-source-321]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
oldMonth=s.monthlyAdvice.month;g.endMonth();;;;s.monthlyAdvice.intelligence[33]=
0;;const broken=structuredClone(s);broken.monthlyAdvice.rolls[0].war=2;;const
legacy=structuredClone(s);delete legacy.monthlyAdvice;;
```

**Required output / success criteria**

```text
assert.equal(s.monthlyAdvice.month,oldMonth+1)
assert.equal(s.monthlyAdvice.intelligence[33],100)
assert(ADVICE_ORDERS.every(k=>canAdvise(s,r,a,k)))
assert(ADVICE_ORDERS.every(k=>!canAdvise(s,r,a,k)))
assert.throws(()=>validateSave(broken,scenarios,terrains),/advice/)
assert(validateSave(legacy,scenarios,terrains).monthlyAdvice)
```

---

**Case / what it tests**

4. [province choice metadata and both sort labels preserve city numbers, names
and rulers][test-source-322]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; ;;;;for(const p of s.provinces){const choice=provinceChoice(g,p);;;;;;}
```

**Required output / success criteria**

```text
assert.equal(adviceOrder('Reward · Gold'),'reward:gold')
assert.equal(adviceOrder('Cultivate'),'cultivate')
assert.equal(adviceOrder('War invasion'),'war')
assert.equal(adviceOrder('Spy · Rival tigers'),'spy:rival')
assert.equal(choice[2].province,p.id)
assert(choice[1].includes('#'+p.id))
assert(choice[1].includes(p.name))
assert(choice[1].includes(p.owner===255?'Unclaimed':g.ruler(p.owner).name))
assert(provinceLabel(g,p,true).startsWith(p.name))
```


<a id="tests-v20-tests-mjs"></a>
## tests/v20-tests.mjs

Source: [tests/v20-tests.mjs](../tests/v20-tests.mjs). Purpose: Hard AI crosses
a distant mountain gap, including initial sideways/away steps, and reaches the
palace; Route planning respects mountains, active fires and occupied hexes,
returning no route for a sealed destination; Defender plans toward reachable
enemy contact rather than trying to enter an occupied enemy hex; additional
cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`tests/fixtures/v19-hard-second-battle.json`. Dependencies/entry points:
`node:fs`, `node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Hard AI crosses a distant mountain gap, including initial sideways/away
steps, and reaches the palace][test-source-323]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const
scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrains=JSON.par
se(fs.readFileSync('config/province-terrain.json')); const fresh=()=>{const
state=createCampaign(scenarios[0],[],3);state.seed=6;state.ai={intelligence:90,a
ggression:75};state.settings.battleView='all';state.familyMode='expanded';return
new Game(state,{},structuredClone(terrains));}; function arena(){const
g=fresh();g.invade({province:9,target:8,officers:[0,34],governor:33,food:20000})
;while(g.s.battle.phase==='deployment')aiBattle(g,60);const
b=g.s.battle,u=b.units.find(u=>u.id===0);b.terrain=Array(156).fill(0);b.palace={
q:8,r:2};b.terrain[2*13+8]=6;b.weather='sunny';b.fire={};b.challengeIssued=[34];
b.food … (complete input/procedure at linked L1–7)
```

**Required output / success criteria**

```text
assert(route)
assert(route.path.some(p=>p.q===4&&p.r===11))
assert(route.path.every(p=>b.terrain[p.r*13+p.q]!==3))
assert.equal(b.lastAction.type,'move')
assert(distance(u,b.palace)>=before,'First detour step must not need to reduce
straight-line distance')
assert.equal(u.q,b.palace.q)
assert.equal(u.r,b.palace.r)
```

---

**Case / what it tests**

2. [Route planning respects mountains, active fires and occupied hexes,
returning no route for a sealed destination][test-source-324]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; } { const {b,u}=arena();for(let
r=0;r<12;r++)b.terrain[r*13+4]=3;b.units=b.units.filter(v=>v.side===u.side);;for
(const n of neighbors(u.q,u.r))b.fire[n.r*13+n.q]=3;;const x=arena();const
ally=x.b.units.find(v=>v.side===x.u.side&&v!==x.u);Object.assign(ally,{q:4,r:2})
;x.b.fire[3*13+4]=3;const route=planBattleRoute(x.b,x.u);;;;
```

**Required output / success criteria**

```text
assert.equal(planBattleRoute(b,u),null)
assert.equal(planBattleRoute(b,u),null)
assert(route)
assert(route.path.every(p=>!x.b.fire[p.r*13+p.q]&&at(x.b,p.q,p.r)?.id!==ally.id)
)
assert(reachable(x.b,x.u).some(p=>p.q===route.path[0].q&&p.r===route.path[0].r))
```

---

**Case / what it tests**

3. [Defender plans toward reachable enemy contact rather than trying to enter an
occupied enemy hex][test-source-325]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; } { const {g,b,u}=arena();const
enemy=b.units.find(v=>v.side!==u.side);Object.assign(enemy,{q:4,r:2});b.side='de
fend';for(const v of
b.units.filter(v=>v.side==='defend'))Object.assign(v,{ordered:true});Object.assi
gn(enemy,{ordered:false,mobility:2,war:79});const
route=planBattleRoute(b,enemy);;;;
```

**Required output / success criteria**

```text
assert(route)
assert.equal(distance(route, u),1)
assert(route.path.every(p=>at(b,p.q,p.r)?.id!==u.id))
```

---

**Case / what it tests**

4. [V19 second-battle Hard checkpoint advances past day one without attempting
another challenge, including save/load][test-source-326]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; } { const
raw=JSON.parse(fs.readFileSync('tests/fixtures/v19-hard-second-battle.json')),g=
new
Game(validateSave(raw,scenarios,terrains),{},terrains),b=g.s.battle;;;;;;;for(le
t
n=0;n<80&&g.s.battle===b&&b.day===1;n++);;;validateSave(g.s,scenarios,terrains);
```

**Required output / success criteria**

```text
assert.equal(g.s.difficulty,3)
assert.deepEqual(g.s.humanRulers,[])
assert.equal(g.s.ai.intelligence,90)
assert.equal(g.s.settings.battleView,'all')
assert.equal(b.day,1)
assert(b.challengeIssued.length)
assert(g.aiStep())
assert(!g.s.battle||g.s.battle!==b||b.day>1,'Previously stalled second battle
must advance beyond day one')
assert.equal(b.challengeIssued.length,1)
```

---

**Case / what it tests**

5. [Zero-player Hard/all-battles campaigns complete 15,000 actions across six
scenarios (${completed} battle starts) with valid saves and no tactical
exceptions][test-source-327]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; } { let completed=0,days=0;for(const scenario of scenarios){const
state=createCampaign(scenario,[],3);state.seed=6;state.ai={intelligence:90,aggre
ssion:75};state.settings.battleView='all';state.familyMode='expanded';const
g=new Game(state,{},terrains);let previous=null,seen=0;for(let
i=0;i<2500;i++){if(g.s.battle&&g.s.battle!==previous){previous=g.s.battle;seen++
;}g.aiStep();if(g.s.battle?.day>1)days++;if(i%500===0)validateSave(g.s,scenarios
,terrains);}validateSave(g.s,scenarios,terrains);;completed+=seen;};
```

**Required output / success criteria**

```text
assert(seen>=2,'Every scenario must exercise consecutive visible AI battles')
assert(days>0)
```


<a id="tests-v21-tests-mjs"></a>
## tests/v21-tests.mjs

Source: [tests/v21-tests.mjs](../tests/v21-tests.mjs). Purpose: Lone defender
holds the palace against multiple distant attackers at every AI level; Palace
guard attacks adjacent enemies in place and does not charge onto a defeated
noncommander tile; Defender prioritises a guaranteed attacking-commander kill
and wins without abandoning palace; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Lone defender holds the palace against multiple distant attackers at every
AI level][test-source-328]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Lone defender holds the palace against multiple distant attackers at every
AI level',()=>{for(const intelligence of [25,60,90]){const
{g,b,guard}=arena();for(let
day=0;day<8;day++){guard.ordered=false;b.side='defend';aiBattle(g,intelligence);
;;;}}})
```

**Required output / success criteria**

```text
assert.deepEqual({q:guard.q,r:guard.r},b.palace)
assert.equal(b.lastAction.type,'wait')
assert.equal(palaceGuard(b).id,guard.id)
```

---

**Case / what it tests**

2. [Palace guard attacks adjacent enemies in place and does not charge onto a
defeated noncommander tile][test-source-329]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Palace guard attacks adjacent enemies in place and does not charge onto a
defeated noncommander tile',()=>{const
{g,b,f,guard}=arena();Object.assign(f,direction(guard.q,guard.r,5),{soldiers:100
});Object.assign(guard,{soldiers:10000,weapons:10000,war:99});aiBattle(g,90);;;;
;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.type,'attack')
assert.equal(f.soldiers,0)
assert.deepEqual({q:guard.q,r:guard.r},b.palace)
assert.equal(at(b,b.palace.q,b.palace.r).id,guard.id)
```

---

**Case / what it tests**

3. [Defender prioritises a guaranteed attacking-commander kill and wins without
abandoning palace][test-source-330]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defender prioritises a guaranteed attacking-commander kill and wins
without abandoning palace',()=>{const
{g,b,u,f,guard}=arena();Object.assign(u,direction(guard.q,guard.r,5),{soldiers:1
});Object.assign(f,direction(guard.q,guard.r,2),{soldiers:1});;;aiBattle(g,90);;
;;})
```

**Required output / success criteria**

```text
assert.equal(minimumStrikeLoss(b,guard,u),u.soldiers)
assert.equal(aiAttackTarget(b,guard,[f,u]).id,u.id)
assert.equal(u.soldiers,0)
assert.equal(b.outcome.winner,'defend')
assert.deepEqual({q:guard.q,r:guard.r},b.palace)
```

---

**Case / what it tests**

4. [Multiple defenders retain a palace garrison while another unit intercepts
approaching enemies][test-source-331]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Multiple defenders retain a palace garrison while another unit intercepts
approaching enemies',()=>{const
{g,b,u,f,guard,reserve}=arena(true);guard.ordered=true;Object.assign(u,{q:6,r:2}
);Object.assign(f,{q:0,r:1});aiBattle(g,90);;;;;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.unit,reserve.id)
assert.equal(b.lastAction.type,'move')
assert.equal(at(b,b.palace.q,b.palace.r).id,guard.id)
assert(distance(reserve,u)<5)
```

---

**Case / what it tests**

5. [An out-of-position sole defender returns toward an empty palace instead of
pursuing distant attackers][test-source-332]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An out-of-position sole defender returns toward an empty palace instead of
pursuing distant attackers',()=>{const
{g,b,guard}=arena();Object.assign(guard,{q:6,r:8});aiBattle(g,90);;;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.type,'move')
assert(distance(guard,b.palace)<2)
```

---

**Case / what it tests**

6. [Attackers advance on an empty palace and prioritise its guard over unrelated
weak neighbours][test-source-333]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Attackers advance on an empty palace and prioritise its guard over
unrelated weak neighbours',()=>{const
{g,b,u,f,guard}=arena();b.side='attack';guard.placed=true;Object.assign(guard,{q
:12,r:11});aiBattle(g,90);;;const
x=arena(true);x.b.side='attack';Object.assign(x.u,{q:5,r:6});Object.assign(x.res
erve,direction(x.u.q,x.u.r,4),{soldiers:1});;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.type,'move')
assert(distance(u,b.palace)<distance({q:0,r:0},b.palace))
assert.equal(aiAttackTarget(x.b,x.u,[x.reserve,x.guard]).id,x.guard.id)
```

---

**Case / what it tests**

7. [Palace guard refuses uncertain personal combat but can challenge a commander
it is certain to defeat][test-source-334]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Palace guard refuses uncertain personal combat but can challenge a
commander it is certain to defeat',()=>{const
{g,b,u,guard}=arena();b.day=1;b.completedDays=0;Object.assign(u,{war:95});Object
.assign(guard,{war:95});b.challenge={challenger:u.id,target:guard.id};b.challeng
eIssued=[u.id];aiBattle(g,90);;;;const
x=arena();x.b.day=1;x.b.completedDays=0;x.u.war=50;x.guard.war=90;aiBattle(x.g,9
0);;})
```

**Required output / success criteria**

```text
assert.equal(b.challenge,null)
assert(!guard.captured)
assert.deepEqual({q:guard.q,r:guard.r},b.palace)
assert.equal(x.b.challenge.target,x.u.id)
```


<a id="tests-v22-tests-mjs"></a>
## tests/v22-tests.mjs

Source: [tests/v22-tests.mjs](../tests/v22-tests.mjs). Purpose: Outnumbered
palace guard uses safe fire without abandoning palace; Fire refuses rain and
wind spreading into own commander; Defender selects nearby jungle concealment
and holds an ambush; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Outnumbered palace guard uses safe fire without abandoning
palace][test-source-335]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Outnumbered palace guard uses safe fire without abandoning
palace',()=>{const
{g,b,f,guard}=arena();b.wind=0;b.windStrength=0;Object.assign(guard,{soldiers:10
00,weapons:1000});Object.assign(f,direction(guard.q,guard.r,5));aiBattle(g,90);;
;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.type,'fireball')
assert.deepEqual({q:guard.q,r:guard.r},b.palace)
```

---

**Case / what it tests**

2. [Fire refuses rain and wind spreading into own
commander][test-source-336]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Fire refuses rain and wind spreading into own commander',()=>{const
{b,f,guard}=arena();Object.assign(f,direction(guard.q,guard.r,5));b.weather='rai
n';;b.weather='sunny';for(const c of
neighbors(guard.q,guard.r))b.terrain[c.r*13+c.q]=4;b.terrain[f.r*13+f.q]=0;b.win
d=Array.from({length:6},(_,i)=>i).find(i=>distance(direction(f.q,f.r,i),guard)==
=0)+1;b.windStrength=3;;})
```

**Required output / success criteria**

```text
assert.equal(safeFireTarget(b,guard,[f]),null)
assert.equal(safeFireTarget(b,guard,[f]),null)
```

---

**Case / what it tests**

3. [Defender selects nearby jungle concealment and holds an
ambush][test-source-337]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defender selects nearby jungle concealment and holds an ambush',()=>{const
{b,u,reserve}=arena(true);Object.assign(u,{q:5,r:2});const
c={q:5,r:4};b.terrain[c.r*13+c.q]=1;reserve.mobility=6;const
choice=tacticalPosition(b,reserve,[u],[c],true);;;;Object.assign(reserve,c);;})
```

**Required output / success criteria**

```text
assert(choice)
assert.equal(choice.q,c.q)
assert.equal(choice.r,c.r)
assert.equal(tacticalPosition(b,reserve,[u],[],true).wait,true)
```

---

**Case / what it tests**

4. [Weak attacker selects dry river bank, never water, and resumes after bounded
waiting][test-source-338]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Weak attacker selects dry river bank, never water, and resumes after
bounded waiting',()=>{const
{b,u,guard}=arena();b.side='attack';Object.assign(u,{q:3,r:3});Object.assign(gua
rd,{q:6,r:3});b.terrain[3*13+5]=4;const
c={q:4,r:3};;Object.assign(u,c);;b.day=3;;})
```

**Required output / success criteria**

```text
assert.equal(tacticalPosition(b,u,[guard],[c],true).q,4)
assert.equal(tacticalPosition(b,u,[guard],[],true).wait,true)
assert.equal(tacticalPosition(b,u,[guard],[],true),null)
```

---

**Case / what it tests**

5. [Attacking commander refuses uncertain duel with army still
intact][test-source-339]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Attacking commander refuses uncertain duel with army still
intact',()=>{const
{g,b,u,guard}=arena();b.day=1;b.completedDays=0;b.side='defend';u.war=90;guard.w
ar=89;b.challenge={challenger:guard.id,target:u.id};b.challengeIssued=[guard.id]
;aiBattle(g,90);;;})
```

**Required output / success criteria**

```text
assert(!u.captured)
assert.equal(b.challenge,null)
```

---

**Case / what it tests**

6. [Remaining soldiers do not disguise morale routing as empty
army][test-source-340]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Remaining soldiers do not disguise morale routing as empty
army',()=>{const {b}=arena();for(const v of
b.units.filter(v=>v.side==='defend')){v.routed=true;v.morale=0;};})
```

**Required output / success criteria**

```text
assert.match(outcome(b).reason,/remaining soldiers/)
```


<a id="tests-v23-tests-mjs"></a>
## tests/v23-tests.mjs

Source: [tests/v23-tests.mjs](../tests/v23-tests.mjs). Purpose: Every Message
Speed lasts exactly 3, 2, 1 or 0.5 seconds without dropped queued messages;
Message pause retains unread time, resume does not restart it and cancellation
prevents stale callbacks; AI tuning validates and merges partial groups while
preserving default battlefield policy; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`config/ai-config.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle.mjs`,
`../mjs/ai-parameters.mjs`, `../mjs/message-playback.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Every Message Speed lasts exactly 3, 2, 1 or 0.5 seconds without dropped
queued messages][test-source-341]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every Message Speed lasts exactly 3, 2, 1 or 0.5 seconds without dropped
queued messages',()=>{for(const [ms]of MESSAGE_SPEEDS){const
c=clock(),seen=[],done=[];const
p=createMessagePlayer({clock:c,duration:()=>messageDuration({settings:{messageSp
eed:ms}}),show:x=>seen.push(x.text),hide:x=>done.push(x.text)});p.enqueue('first
');p.enqueue('second');;c.tick(ms-1);;c.tick(1);;c.tick(ms);;;}})
```

**Required output / success criteria**

```text
assert.deepEqual(seen,['first'])
assert.deepEqual(done,[])
assert.deepEqual(seen,['first','second'])
assert.deepEqual(done,['first','second'])
assert(!p.busy)
```

---

**Case / what it tests**

2. [Message pause retains unread time, resume does not restart it and
cancellation prevents stale callbacks][test-source-342]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Message pause retains unread time, resume does not restart it and
cancellation prevents stale callbacks',()=>{const
c=clock(),seen=[],p=createMessagePlayer({clock:c,duration:()=>2000,show:x=>seen.
push(x.text)});p.enqueue({text:'monthly',onDone:()=>seen.push('orders')});c.tick
(800);p.pause();c.tick(9000);;p.resume();c.tick(1199);;c.tick(1);;p.enqueue({tex
t:'old save',onDone:()=>});p.clear();c.tick(3000);;})
```

**Required output / success criteria**

```text
assert(p.busy)
assert.deepEqual(seen,['monthly'])
assert.deepEqual(seen,['monthly','orders'])
assert.fail('Stale timer')
assert(!p.busy)
```

---

**Case / what it tests**

3. [AI tuning validates and merges partial groups while preserving default
battlefield policy][test-source-343]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI tuning validates and merges partial groups while preserving default
battlefield policy',()=>{;const
t=validateAIConfig({battle:{outnumberedPowerRatio:.95}});;;;;;;})
```

**Required output / success criteria**

```text
assert.deepEqual(validateAIConfig(JSON.parse(fs.readFileSync('config/ai-config.j
son'))),DEFAULT_AI)
assert.equal(t.battle.outnumberedPowerRatio,.95)
assert.equal(t.battle.safeDuelWarMargin,20)
assert.throws(()=>validateAIConfig({battle:{ambushAdvanceEveryDays:0}}))
assert.throws(()=>validateAIConfig({governance:{maxInvaders:11}}))
assert.throws(()=>validateAIConfig({governance:{politicsChance:1.1}}))
assert.throws(()=>validateAIConfig({unknown:{}}))
```

---

**Case / what it tests**

4. [Both armies lose immediately at zero food while their morale and soldiers
remain high][test-source-344]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Both armies lose immediately at zero food while their morale and soldiers
remain high',()=>{for(const side of ['attack','defend']){const
{b}=arena();b.food[side]=0;const
men=living(b).filter(u=>u.side===side).reduce((n,u)=>n+u.soldiers,0);;;;;}})
```

**Required output / success criteria**

```text
assert(men>0)
assert(living(b).filter(u=>u.side===side).every(u=>u.morale===100))
assert.equal(outcome(b).winner,side==='attack'?'defend':'attack')
assert.match(b.outcome.reason,/food/)
```

---

**Case / what it tests**

5. [Food input accepts all available province stock through 3,000,000 and
rejects excess atomically][test-source-345]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Food input accepts all available province stock through 3,000,000 and
rejects excess atomically',()=>{const
s=createCampaign(scenarios[0],[0]);s.settings.battleView='all';const g=new
Game(s,{},terrains);g.s.monthlyReview=null;g.province(9).food=3000000;const
before=JSON.stringify(g.s);;;g.invade({province:9,target:8,officers:[0,34],gover
nor:33,food:3000000});;;const zero=new
Game(createCampaign(scenarios[0],[0]),{},terrains);zero.s.monthlyReview=null;zer
o.s.settings.battleView='all';zero.invade({province:9,target:8,officers:[0,34],g
overnor:33,food:0});;zero.s.battle.phase='battle';;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.invade({province:9,target:8,officers:[0,34],governor:33,food
:3000001}))
assert.equal(JSON.stringify(g.s),before)
assert.equal(g.s.battle.food.attack,3000000)
assert.equal(g.province(9).food,0)
assert.equal(zero.s.battle.food.attack,0)
assert.equal(outcome(zero.s.battle).winner,'defend')
```

---

**Case / what it tests**

6. [Fire success/failure and simultaneous attacks identify initiating generals
and retain ordered event serials][test-source-346]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Fire success/failure and simultaneous attacks identify initiating generals
and retain ordered event serials',()=>{for(const fail of [false,true]){const
{g,b,u,defender}=arena();g.random=()=>fail?.99:0;const
t=g.battleAction('fireball',{unit:u.id,q:defender.q,r:defender.r});;;;}const
{g,b,u,v,defender}=arena();Object.assign(v,direction(defender.q,defender.r,1));c
onst text=g.battleAction('simultaneous',{unit:u.id,target:defender.id});;;;const
restored=validateSave(g.s,scenarios,g.terrains);;})
```

**Required output / success criteria**

```text
assert(t.includes(g.officer(u.id).name))
assert.match(t,fail?/failed/:/success/)
assert.equal(b.messages.at(-1).text,t)
assert(text.includes(g.officer(u.id).name))
assert.match(text,/simultaneous/)
assert(b.messages.every((m,i)=>!i||m.serial>b.messages[i-1].serial))
assert.deepEqual(restored.battle.messages,b.messages)
```

---

**Case / what it tests**

7. [Legacy saves receive Message Speed from their former speed and malformed
message queues are rejected][test-source-347]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Legacy saves receive Message Speed from their former speed and malformed
message queues are rejected',()=>{for(const [old,ms]of
[[1200,3000],[600,2000],[300,1000],[100,500]]){const
s=createCampaign(scenarios[0],[0]);delete
s.settings.messageSpeed;s.speed=old;;}const
{g,b}=arena();b.messages.push({serial:b.eventSerial+1,text:'future',day:2});;})
```

**Required output / success criteria**

```text
assert.equal(validateSave(s,scenarios,terrains).settings.messageSpeed,ms)
assert.throws(()=>validateSave(g.s,scenarios,g.terrains),/battle messages/)
```


<a id="tests-v24-tests-mjs"></a>
## tests/v24-tests.mjs

Source: [tests/v24-tests.mjs](../tests/v24-tests.mjs). Purpose: Native
daily/monthly rations use floor division by thirty with a minimum of one for an
army; AI carries food based on actual troops and refuses less than a full month
plus one reserve; Defending undeployed reserves eat alongside the field army
while the attacker source garrison does not; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/ai-governance.mjs`, `../mjs/battle.mjs`,
`../mjs/ai-parameters.mjs`, `../mjs/war-provisions.mjs`,
`../mjs/message-playback.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Native daily/monthly rations use floor division by thirty with a minimum of
one for an army][test-source-348]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native daily/monthly rations use floor division by thirty with a minimum
of one for an army',()=>{for(const [men,daily]of
[[0,0],[1,1],[29,1],[30,1],[31,1],[2999,99],[3000,100],[3872,129],[10000,333]]){
;;};})
```

**Required output / success criteria**

```text
assert.equal(battleDailyFood(men),daily)
assert.equal(warProvisions(men).monthly,daily*30)
assert.equal(warProvisions(3872,242).days,1)
```

---

**Case / what it tests**

2. [AI carries food based on actual troops and refuses less than a full month
plus one reserve][test-source-349]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI carries food based on actual troops and refuses less than a full month
plus one reserve',()=>{;;;const
g=fresh();g.s.ai.aggression=100;g.s.ai.intelligence=100;g.random=()=>.99;g.s.jou
rney=null;g.s.familyMode='original';g.s.player=0;const p=g.province(9);for(const
id of
p.officers){g.officer(id).soldiers=10000;g.officer(id).training=0;g.officer(id).
acted=false;}p.food=100000;let
chosen=null;g.invade=args=>{chosen=args;};g.random=()=>.5;aiGovernance(g);;const
men=chosen.officers.reduce((n,id)=>n+g.officer(id).soldiers,0);;;})
```

**Required output / success criteria**

```text
assert.equal(invasionFoodPlan(10000,100000),333*75+1)
assert.equal(invasionFoodPlan(10000,9990),null)
assert.equal(invasionFoodPlan(10000,9991),9991)
assert(chosen)
assert.equal(chosen.food,invasionFoodPlan(men,100000,g.rules.ai.governance))
assert(chosen.food>warProvisions(men).monthly)
```

---

**Case / what it tests**

3. [Defending undeployed reserves eat alongside the field army while the
attacker source garrison does not][test-source-350]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defending undeployed reserves eat alongside the field army while the
attacker source garrison does not',()=>{const
g=pending(),b=g.s.battle,def=b.units.filter(u=>u.side==='defend').reduce((n,u)=>
n+u.soldiers,0),att=b.units.filter(u=>u.side==='attack').reduce((n,u)=>n+u.soldi
ers,0);;const
reserve=g.province(b.target).officers.find(id=>!b.units.some(u=>u.id===id));if(r
eserve!==undefined){g.officer(reserve).soldiers=9000;;}else{const
id=g.province(b.source).officers.find(id=>!b.units.some(u=>u.id===id));g.provinc
e(b.source).officers=g.province(b.source).officers.filter(v=>v!==id);g.province(
b.target).officers.push(id);g.officer(id).owner=b.defender;g.officer(id).soldier
s=9000;;}})
```

**Required output / success criteria**

```text
assert.equal(battleRationMen(g,b,'attack'),att)
assert(battleRationMen(g,b,'defend')>=def+9000)
assert.equal(battleRationMen(g,b,'defend'),def+9000)
```

---

**Case / what it tests**

4. [Spectator personal-only invasion resolves by equation with no tactical
actions, placement or suspended war][test-source-351]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Spectator personal-only invasion resolves by equation with no tactical
actions, placement or suspended war',()=>{const
g=fresh();g.invade({province:9,target:8,officers:[0,34],food:20000});;;;;;valida
teSave(g.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert.equal(g.s.battle,null)
assert.equal(g.s.lastBattle.resolution,'equation')
assert(g.s.lastBattle.abstractRounds<=6)
assert.equal(g.s.wars.length,0)
assert(!g.s.log.some(x=>/moved to|Day \d+:|waited as army/.test(x.text)))
```

---

**Case / what it tests**

5. [Loading an active hidden battle and resuming a suspended hidden war never
exposes a tactical step][test-source-352]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Loading an active hidden battle and resuming a suspended hidden war never
exposes a tactical step',()=>{const g=pending(),b=g.s.battle;const
initial=b.actionSerial;g.s.settings.battleView='personal';const loaded=new
Game(validateSave(g.s,scenarios,terrains),{},terrains);;;;const
other=pending(),war=other.s.battle;while(war.phase==='deployment')aiBattle(other
);war.suspended=true;other.s.monthlyReview=null;other.s.settings.battleView='per
sonal';other.s.battle=null;war.resumeMonth=other.s.year*12+other.s.month-1;other
.s.wars.push(war);const
serial=war.actionSerial;;;;;;validateSave(other.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert.equal(loaded.s.battle,null)
assert.equal(loaded.s.lastBattle.resolution,'equation')
assert.equal(b.actionSerial,initial)
assert(other.resumeWars())
assert.equal(other.s.battle,null)
assert.equal(other.s.wars.length,0)
assert.equal(war.actionSerial,serial)
assert.equal(other.s.lastBattle.resolution,'equation')
```

---

**Case / what it tests**

6. [All-battles mode retains real tactical deployment and human
personally-present battles remain detailed][test-source-353]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All-battles mode retains real tactical deployment and human
personally-present battles remain detailed',()=>{const g=pending();;;const
b=g.s.battle;g.s.humanRulers=[0];g.s.settings.battleView='personal';;;;})
```

**Required output / success criteria**

```text
assert(g.s.battle)
assert(g.battleDetailed())
assert(g.battleDetailed())
assert(!g.resolveUnwatchedBattle())
assert.equal(g.s.battle,b)
```

---

**Case / what it tests**

7. [Changing Message Speed retimes the current message, including a paused
council report][test-source-354]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Changing Message Speed retimes the current message, including a paused
council report',()=>{let now=0,timer=null,id=0,ms=1000,done=0;const
clock={now:()=>now,setTimeout:(fn,delay)=>(timer={fn,at:now+delay},++id),clearTi
meout:()=>{timer=null;}};const
p=createMessagePlayer({clock,duration:()=>ms,show:()=>{},onIdle:()=>done++});p.e
nqueue('report');now=400;p.pause();ms=3000;p.retime();now=9000;;p.resume();;now=
11600;timer.fn();;p.enqueue('action');now=11700;ms=500;p.retime();;})
```

**Required output / success criteria**

```text
assert.equal(done,0)
assert.equal(timer.at,11600)
assert.equal(done,1)
assert.equal(timer.at,12100)
```

---

**Case / what it tests**

8. [Governance messages survive atomic rollback cloning without duplicating old
Chronicle entries][test-source-355]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Governance messages survive atomic rollback cloning without duplicating
old Chronicle entries',()=>{const
old=[{year:189,month:1,turn:1,type:'order',text:'prior'}],fresh={year:189,month:
1,turn:1,type:'order',text:'new'};;;;})
```

**Required output / success criteria**

```text
assert.deepEqual(newLogEntries(old,[fresh,...structuredClone(old)]),[fresh])
assert.deepEqual(newLogEntries(old,structuredClone(old)),[])
assert.equal(newLogEntries(old,[...structuredClone(old),...structuredClone(old)]
).length,1)
```

---

**Case / what it tests**

9. [Local defending reinforcements cannot duplicate committed food; reserve days
require positive integers][test-source-356]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Local defending reinforcements cannot duplicate committed food; reserve
days require positive integers',()=>{const
g=pending(),b=g.s.battle,p=g.province(b.target);const
id=g.province(b.source).officers.find(id=>!b.units.some(u=>u.id===id));;g.provin
ce(b.source).officers=g.province(b.source).officers.filter(v=>v!==id);p.officers
.push(id);Object.assign(g.officer(id),{owner:b.defender,acted:false,soldiers:900
0});const option=reinforcementOptions(g,'defend').find(o=>o.officer===id);;;;;})
```

**Required output / success criteria**

```text
assert.notEqual(id,undefined)
assert(option)
assert.equal(option.food,0)
assert.throws(()=>validateAIConfig({governance:{warProvisionDays:0}}))
assert.throws(()=>validateAIConfig({governance:{warProvisionDays:1.5}}))
```

---

**Case / what it tests**

10. [Saved unified speed survives loading and overrides a conflicting legacy
Message Speed][test-source-357]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Saved unified speed survives loading and overrides a conflicting legacy
Message Speed',()=>{for(const messageSpeed of [500,1000,2000,3000]){const
g=fresh();g.s.speed=messageSpeed;g.s.settings.messageSpeed=500;;}})
```

**Required output / success criteria**

```text
assert.equal(validateSave(g.s,scenarios,terrains).settings.messageSpeed,messageS
peed)
```


<a id="tests-v25-tests-mjs"></a>
## tests/v25-tests.mjs

Source: [tests/v25-tests.mjs](../tests/v25-tests.mjs). Purpose: A spent move
restores two next turn; Wait then banks three, four and up to six; Water costs
five points in reachability and the actual Move order; Native training allowance
has correct thresholds and retains banked mobility; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle.mjs`, `../mjs/message-playback.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [A spent move restores two next turn; Wait then banks three, four and up to
six][test-source-358]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A spent move restores two next turn; Wait then banks three, four and up to
six',()=>{const {g,b,u}=arena();const
move=reachable(b,u).find(p=>p.q===u.q&&p.r===u.r-1);g.battleAction('move',{unit:
u.id,...move});;g.battleAction('end');g.battleAction('end');;for(const expected
of
[3,4,5,6,6]){g.battleAction('wait',{unit:u.id});;g.battleAction('end');g.battleA
ction('end');;}})
```

**Required output / success criteria**

```text
assert.equal(u.mobility,0)
assert.equal(u.mobility,2)
assert.equal(u.mobility,expected)
assert.equal(u.mobility,expected)
```

---

**Case / what it tests**

2. [Water costs five points in reachability and the actual Move
order][test-source-359]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Water costs five points in reachability and the actual Move
order',()=>{const
{g,b,u}=arena();b.terrain[(u.r-1)*13+u.q]=4;u.mobility=4;;u.mobility=5;const
move=reachable(b,u).find(p=>p.q===u.q&&p.r===u.r-1);;g.battleAction('move',{unit
:u.id,...move});;;})
```

**Required output / success criteria**

```text
assert(!reachable(b,u).some(p=>p.q===u.q&&p.r===u.r-1))
assert(move)
assert.equal(u.mobility,0)
assert.equal(terrainCost(4),5)
```

---

**Case / what it tests**

3. [Native training allowance has correct thresholds and retains banked
mobility][test-source-360]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native training allowance has correct thresholds and retains banked
mobility',()=>{;})
```

**Required output / success criteria**

```text
assert.deepEqual([0,1,20,21,40,41,80,81,100].map(dailyMobility),[2,2,2,3,3,4,5,6
,6])
```

---

**Case / what it tests**

4. [Native fire is random below thirty percent, without mandatory hundred or
morale damage][test-source-361]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native fire is random below thirty percent, without mandatory hundred or
morale damage',()=>{;;;;const
{g,b,u}=arena();b.fire[u.r*13+u.q]=3;b.side='attack';g.random=()=>.5;g.battleAct
ion('end');;;})
```

**Required output / success criteria**

```text
assert.equal(fireLoss(5000,0),0)
assert.equal(fireLoss(5000,.5),750)
assert.equal(fireLoss(5000,.999999),1499)
assert.equal(fireLoss(99,0),99)
assert.equal(u.soldiers,4250)
assert.equal(u.morale,100)
```

---

**Case / what it tests**

5. [One saved speed controls scheduler and message durations, including legacy
migration][test-source-362]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('One saved speed controls scheduler and message durations, including legacy
migration',()=>{for(const speed of [500,1000,2000,3000]){const
s=createCampaign(scenarios[0],[]);s.speed=speed;s.settings.messageSpeed=1000;con
st v=validateSave(s,scenarios,terrains);;;;}})
```

**Required output / success criteria**

```text
assert.equal(v.speed,speed)
assert.equal(messageDuration(v),speed)
assert.equal(v.settings.messageSpeed,speed)
```


<a id="tests-v26-tests-mjs"></a>
## tests/v26-tests.mjs

Source: [tests/v26-tests.mjs](../tests/v26-tests.mjs). Purpose: Horse and
writings need no gold, consume only the appropriate resource and use governor
action; Native small gold accepts both random outcomes, deducts amount once and
caps loyalty; Reward failure is atomic and study requires a two-point INT gap;
additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/order-availability.mjs`,
`../mjs/province-rules.mjs`, `../mjs/move-forecast.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Horse and writings need no gold, consume only the appropriate resource and
use governor action][test-source-363]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Horse and writings need no gold, consume only the appropriate resource and
use governor action',()=>{for(const kind of
['rewardHorse','rewardWritings']){const
g=fresh(),p=g.province(9);p.gold=0;p.horses=2;g.ruler().advisor=33;g.officer(33)
.int=95;g.officer(34).int=60;g.officer(34).loyalty=50;;g.execute(kind,{province:
9,officer:34});;;if(kind==='rewardHorse'){;;;}else{;;;}validateSave(structuredCl
one(g.s),scenarios,terrains);}})
```

**Required output / success criteria**

```text
assert.equal(orderUnavailable(g,p,kind==='rewardHorse'?'reward:horse':'reward:wr
itings'),null)
assert.equal(p.gold,0)
assert(g.officer(p.governor).acted)
assert.equal(p.horses,1)
assert.equal(g.officer(34).loyalty,50+Math.floor(g.officer(0).charm*100/400))
assert(!g.officer(34).hasHorse)
assert.equal(p.horses,2)
assert.equal(g.officer(34).int,61)
assert.equal(g.officer(34).loyalty,50)
```

---

**Case / what it tests**

2. [Native small gold accepts both random outcomes, deducts amount once and caps
loyalty][test-source-364]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native small gold accepts both random outcomes, deducts amount once and
caps loyalty',()=>{for(const rng of [0,.999]){const
g=fresh(),p=g.province(9);g.random=()=>rng;g.officer(0).charm=80;g.officer(34).l
oyalty=50;const
gold=p.gold;g.execute('rewardGold',{province:9,officer:34,amount:1});;;}const
g=fresh();g.officer(34).loyalty=99;g.execute('rewardHorse',{province:9,officer:3
4});;})
```

**Required output / success criteria**

```text
assert.equal(p.gold,gold-1)
assert.equal(g.officer(34).loyalty,rng?51:50)
assert.equal(g.officer(34).loyalty,100)
```

---

**Case / what it tests**

3. [Reward failure is atomic and study requires a two-point INT
gap][test-source-365]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Reward failure is atomic and study requires a two-point INT
gap',()=>{const
g=fresh();g.ruler().advisor=33;g.officer(33).int=81;g.officer(34).int=80;const
before=JSON.stringify(g.s);;;})
```

**Required output / success criteria**

```text
assert.throws(()=>g.execute('rewardWritings',{province:9,officer:34}),/two
more/)
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

4. [Hire capacity is independent of actor attributes and rounds native partial
army room upward][test-source-366]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hire capacity is independent of actor attributes and rounds native partial
army room upward',()=>{const
g=fresh(),p=g.province(9),before=hireCapacity(g,p);for(const id of
p.officers)Object.assign(g.officer(id),{war:1,int:1,charm:1});;for(const id of
p.officers)g.officer(id).soldiers=10000;g.officer(34).soldiers=9999;p.gold=30000
;p.food=3000000;p.population=3000000;;})
```

**Required output / success criteria**

```text
assert.equal(hireCapacity(g,p),before)
assert.equal(hireCapacity(g,p),1)
```

---

**Case / what it tests**

5. [Move estimate includes all destination generals and troops through the July
payment][test-source-367]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Move estimate includes all destination generals and troops through the
July payment',()=>{const
g=fresh(),p=g.province(9),dest=g.province(17);dest.officers=[];dest.gold=0;dest.
food=0;g.s.month=6;let
estimate=moveForecast(g,p,dest,[34]);;;;g.s.month=7;;dest.gold=10000;dest.food=3
000000;estimate=moveForecast(g,p,dest,[34]);;;})
```

**Required output / success criteria**

```text
assert.equal(estimate.payroll,3+Math.floor(g.officer(34).soldiers/200))
assert.equal(estimate.months,1)
assert.equal(estimate.food,Math.floor(g.officer(34).soldiers/3))
assert.equal(moveForecast(g,p,dest,[34]).months,12)
assert.equal(estimate.goldNeeded,0)
assert.equal(estimate.foodNeeded,0)
```

---

**Case / what it tests**

6. [Move team advice obeys the saved monthly gate and reflects destination
condition][test-source-368]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Move team advice obeys the saved monthly gate and reflects destination
condition',()=>{const
g=fresh(),p=g.province(9),dest=g.province(17);g.ruler().advisor=33;g.officer(33)
.int=100;g.s.monthlyAdvice.intelligence[33]=100;dest.land=10;dest.flood=10;dest.
loyalty=10;;g.s.monthlyAdvice.rolls[0].move=.9;g.s.monthlyAdvice.intelligence[33
]=80;;;})
```

**Required output / success criteria**

```text
assert(moveTeamInsight(g,p,dest,[34]).includes('needs attention'))
assert(moveTeamInsight(g,p,dest,[34]).includes('more info this month'))
assert.equal(moveTeamInsight(g,p,dest,[34]),moveTeamInsight(g,p,dest,[34]))
```

---

**Case / what it tests**

7. [Ruler ID zero is governor after self appointment, normalization and
reload][test-source-369]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Ruler ID zero is governor after self appointment, normalization and
reload',()=>{const
g=fresh();g.execute('appointRealm',{province:9,target:9,officer:0,role:'governor
'});;g.normalize();g.s=validateSave(structuredClone(g.s),scenarios,terrains);;})
```

**Required output / success criteria**

```text
assert.equal(g.province(9).governor,0)
assert.equal(g.officer(g.province(9).governor).name,'Cao Cao')
```


<a id="tests-v27-tests-mjs"></a>
## tests/v27-tests.mjs

Source: [tests/v27-tests.mjs](../tests/v27-tests.mjs). Purpose: A war has one
dated summary even after hundreds of tactical messages; Extended January is
replaced by the current February result for the same war; Legacy refused captive
can join; final disposition updates once and survives load; additional cases
below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/event-chronicle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [A war has one dated summary even after hundreds of tactical
messages][test-source-370]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A war has one dated summary even after hundreds of tactical
messages',()=>{const g=battle(),row=g.s.warChronicle[0];for(let
i=0;i<250;i++)g.record(`Day ${i%30+1}: Defending army’s orders.`,'war');;;;;})
```

**Required output / success criteria**

```text
assert.equal(g.s.log.length,160)
assert.equal(acrossChinaChronology(g).filter(e=>e.text.includes('attacked')).len
gth,1)
assert(warReportText(g.s,row).includes('Jan 189 AD: Cao Cao #9 attacked Kong
Rong #8. In progress.'))
assert.equal(beginWarReport(g,g.s.battle),row)
```

---

**Case / what it tests**

2. [Extended January is replaced by the current February result for the same
war][test-source-371]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Extended January is replaced by the current February result for the same
war',()=>{const
g=battle(),b=g.s.battle;extendWarReport(g,b);g.s.month=2;beginWarReport(g,b);;;b
.outcome={winner:'attack',reason:'Palace occupied'};g.resolveBattle();;;;})
```

**Required output / success criteria**

```text
assert.equal(g.s.warChronicle.length,1)
assert.equal(g.s.warChronicle[0].month,2)
assert.equal(g.s.warChronicle.length,1)
assert.equal(g.s.warChronicle[0].status,'won')
assert(acrossChinaChronology(g)[0].text.startsWith('Feb 189 AD:'))
```

---

**Case / what it tests**

3. [Legacy refused captive can join; final disposition updates once and survives
load][test-source-372]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Legacy refused captive can join; final disposition updates once and
survives load',()=>{const
g=victory(),row=g.s.warChronicle[0];;g.acknowledgeTriumph();const
c=g.s.captiveDecisions.find(c=>c.role!=='Ruler');;c.recruitTried=true;g.random=(
)=>.999;;;;;const restored=new
Game(validateSave(g.s,scenarios,terrain),{},terrain);;})
```

**Required output / success criteria**

```text
assert(row.fates.length)
assert(c)
assert.equal(g.decideCaptive(c.officer,'recruit'),true)
assert.equal(row.fates.filter(f=>f.officer===c.officer).length,1)
assert.equal(row.fates.find(f=>f.officer===c.officer).action,'recruit')
assert(warReportText(g.s,row).includes('recruited: '+g.officer(c.officer).name))
assert.deepEqual(restored.s.warChronicle,g.s.warChronicle)
```

---

**Case / what it tests**

4. [Recruit, behead and ruler release are distinct, including snapshots after
succession][test-source-373]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Recruit, behead and ruler release are distinct, including snapshots after
succession',()=>{const g=victory();g.acknowledgeTriumph();const
row=g.s.warChronicle[0],ruler=g.s.captiveDecisions.find(c=>c.role==='Ruler'),oth
ers=g.s.captiveDecisions.filter(c=>c.role!=='Ruler');;g.random=()=>0;g.decideCap
tive(others[0].officer,'recruit');g.decideCaptive(others[1].officer,'behead');g.
decideCaptive(ruler.officer,'free');const text=warReportText(g.s,row);;;;const
names=[row.attacker.name,row.defender.name];g.ruler(row.defender.id).name='Chang
ed ruler';;validateSave(g.s,scenarios,terrain);})
```

**Required output / success criteria**

```text
assert(ruler&&others.length>=2)
assert(text.includes('opposing ruler was set free'))
assert(text.includes('recruited: '+g.officer(others[0].officer).name))
assert(text.includes('beheaded — '+g.officer(others[1].officer).name))
assert(names.every(name=>warReportText(g.s,row).includes(name)))
```

---

**Case / what it tests**

5. [A defeated invasion reports an unharmed returning ruler without pretending
they were captured][test-source-374]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A defeated invasion reports an unharmed returning ruler without pretending
they were captured',()=>{const
g=battle();g.s.battle.outcome={winner:'defend',reason:'Invaders
withdrew'};g.resolveBattle();const
text=warReportText(g.s,g.s.warChronicle[0]);;;;;})
```

**Required output / success criteria**

```text
assert(text.includes('Defeated. The attacking ruler returned unharmed.'))
assert(!text.includes('generals were recruited'))
assert(!text.includes('none'))
assert(!text.includes('Result:'))
```

---

**Case / what it tests**

6. [Current province list has all 41 live provinces, local events only, and no
battle/captive spam][test-source-375]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Current province list has all 41 live provinces, local events only, and no
battle/captive spam',()=>{const g=battle();g.record('Chen Deng moved to 8,5,
spending 3 mobility.','war');g.record('Mi Zhu: set
free.','prison',{battleOutcome:true,province:17});g.record(g.province(9).name+':
cultivated land.');const
list=provinceCurrentEvents(g);;;;;g.province(17).owner=0;;})
```

**Required output / success criteria**

```text
assert.equal(list.length,41)
assert.equal(list[8].events.length,1)
assert(list[8].events[0].text.includes('cultivated'))
assert.equal(list[16].events.length,0)
assert.equal(provinceCurrentEvents(g)[16].province.owner,0)
```

---

**Case / what it tests**

7. [Legacy tactical logs are hidden, and old suspended battles migrate only
known dates and provinces][test-source-376]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Legacy tactical logs are hidden, and old suspended battles migrate only
known dates and provinces',()=>{const
g=battle(),b=g.s.battle;b.suspended=true;g.suspendBattle();delete
b.chronicleWar;delete g.s.warChronicle;delete g.s.warSerial;g.s.month=2;const
restored=new Game(g.s,{},terrain);;;;g.record('Tao Qian refused recruitment.
Decide whether to set them free or behead them.','prison');;})
```

**Required output / success criteria**

```text
assert.equal(restored.s.warChronicle[0].month,2)
assert.equal(restored.s.warChronicle[0].status,'ongoing')
assert.equal(restored.s.warChronicle[0].source,9)
assert(!acrossChinaChronology(g).some(x=>x.text.includes('refused')))
```

---

**Case / what it tests**

8. [Malformed history, duplicate outcomes and forged captive links reject during
save validation][test-source-377]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Malformed history, duplicate outcomes and forged captive links reject
during save validation',()=>{const g=victory();for(const mutate of
[s=>s.warChronicle[0].month=13,s=>s.warChronicle.push(structuredClone(s.warChron
icle[0])),s=>s.warChronicle[0].fates.push(structuredClone(s.warChronicle[0].fate
s[0])),s=>s.captiveDecisions[0].warId=9999]){const
s=structuredClone(g.s);mutate(s);;}validateWarHistory(g.s);})
```

**Required output / success criteria**

```text
assert.throws(()=>validateSave(s,scenarios,terrain),/chronicle/)
```


<a id="tests-v28-tests-mjs"></a>
## tests/v28-tests.mjs

Source: [tests/v28-tests.mjs](../tests/v28-tests.mjs). Purpose: Every scheduled
historical entry has its own artwork, including legacy cards; Two epidemics
retain both province numbers and independent current reports; Treasure awards
are national; plunder, alliance refusals and courier reports retain province
cards; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../assets/artwork/history-v28.webp`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/monthly-events.mjs`,
`../mjs/events.mjs`, `../mjs/event-chronicle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Every scheduled historical entry has its own artwork, including legacy
cards][test-source-378]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every scheduled historical entry has its own artwork, including legacy
cards',()=>{const frames=new Set();for(const [year] of HISTORY){const
g=fresh();g.s.year=year;g.s.monthlyState.applied=null;g.s.monthlyState.history=[
];const
report={details:[],events:[]};runMonthlyEvents(g,report,{initial:true});const
e=report.details.find(e=>e.kind==='history');;const
f=eventFrame(e);;;frames.add(f.atlas);;validateSave(g.s,scenarios,terrain);};;})
```

**Required output / success criteria**

```text
assert(e)
assert.equal(f.atlas,'history'+year)
assert.equal(f.cell,0)
assert.deepEqual(eventFrame(presentEvent(g,{kind:'history',title:`Historical
chronicle · ${year}`,text:'Legacy'})),f)
assert.equal(frames.size,15)
assert(fs.statSync(new
URL('../assets/artwork/history-v28.webp',import.meta.url)).size>10000)
```

---

**Case / what it tests**

2. [Two epidemics retain both province numbers and independent current
reports][test-source-379]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Two epidemics retain both province numbers and independent current
reports',()=>{const
g=fresh(),report={details:[],events:[],year:g.s.year,month:g.s.month};for(const
id of
[6,41])disaster(g,g.province(id),'epidemic',report);g.s.lastReport=report;g.reco
rd('A new month begins. '+report.events.join(' '),'month');const
cards=provinceCurrentEvents(g);for(const id of [6,41]){const
epidemic=cards[id-1].events.filter(e=>e.art==='epidemic');;const
e=epidemic[0];;;;;;};})
```

**Required output / success criteria**

```text
assert.equal(epidemic.length,1)
assert.equal(e.province,id)
assert(!e.text.startsWith('#'))
assert(!e.text.includes('瘟疫'))
assert(e.text.includes('Impact:'))
assert.equal(eventFrame(e).atlas,'omens')
assert(!acrossChinaChronology(g).some(e=>e.text.startsWith('A new month')))
```

---

**Case / what it tests**

3. [Treasure awards are national; plunder, alliance refusals and courier reports
retain province cards][test-source-380]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Treasure awards are national; plunder, alliance refusals and courier
reports retain province cards',()=>{const g=fresh();g.s.log=[];for(const
[text,type]of [['Province 3: Han Fu received Black Lightning; mounted mobility
+1.','war'],['Province 19: The army plundered 500 gold and 20000 food. Popular
loyalty fell by 20; trust fell by 10.','war'],[g.province(10).name+': Liu Bei
refused Li Ru’s alliance proposal.','diplomacy'],['Li Ru departed from Province
10 on horseback.','diplomacy'],['Province 31: The victorious army protected the
inhabitants. Gao Pei received Luminous sword; WAR +8.','war'],['Yuan Shang was
captured in Province 28. The mission was cancelled.','prison']])g.record(text …
(complete input/procedure at linked L11–11)
```

**Required output / success criteria**

```text
assert.equal(acrossChinaChronology(g).length,2)
assert(acrossChinaChronology(g).every(e=>e.text.includes('received')))
assert(list[id-1].events.length)
assert.equal(list[2].events.length,0)
assert.equal(list[30].events.length,0)
assert(list[9].events.some(e=>e.text.includes('as a messenger')))
assert(acrossChinaChronology(g).some(e=>e.text.includes('Luminous sword')))
assert.equal(provinceCurrentEvents(g)[15].events.length,0)
```

---

**Case / what it tests**

4. [Dated war messages render exactly one date in both short and full month
formats][test-source-381]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Dated war messages render exactly one date in both short and full month
formats',()=>{for(const text of ['Jan 189 AD: Yuan Shu #19 attacked Sun Jian
#21. Won.','January 189 AD: Jan 189 AD: Yuan Shu #19 attacked Sun Jian #21.
Won.']){const t=datedEventText({year:189,month:1,text});;;}})
```

**Required output / success criteria**

```text
assert.equal((t.match(/189 AD:/g)||[]).length,1)
assert(t.startsWith('Jan 189 AD: Yuan Shu'))
```

---

**Case / what it tests**

5. [A defending ruler without a fighting unit still counts as present; all
subordinate roles are generals][test-source-382]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A defending ruler without a fighting unit still counts as present; all
subordinate roles are generals',()=>{const
g=fresh(),p=g.province(21),b={source:19,target:21,attacker:g.province(19).owner,
defender:p.owner,rulers:{attack:4,defend:2},units:[{id:4,side:'attack'}],outcome
:{winner:'attack'}};;const row=beginWarReport(g,b);;finishWarReport(g,b,[],new
Map());;row.fates=[{officer:54,name:'Cheng
Pu',zh:'程普',formerOwner:row.losingOwner,role:'Governor',action:'free'},{officer:
55,name:'Sun
Ce',zh:'孫策',formerOwner:row.losingOwner,role:'General',action:'recruit'}];;;row.
rulerResult='absent';;})
```

**Required output / success criteria**

```text
assert(p.officers.includes(2))
assert(row.rulerPresent.defend)
assert(warReportText(g.s,row).includes('opposing ruler returned unharmed'))
assert(warReportText(g.s,row).includes('generals were set free — Cheng Pu'))
assert(warReportText(g.s,row).includes('generals were recruited: Sun Ce'))
assert(!warReportText(g.s,row).includes('not personally present'))
```

---

**Case / what it tests**

6. [Real Yuan Shu invasion captures or returns Sun Jian rather than reporting
him absent][test-source-383]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Real Yuan Shu invasion captures or returns Sun Jian rather than reporting
him absent',()=>{const
g=fresh();g.s.player=4;g.s.humanRulers=[4];g.s.settings.battleView='all';g.rando
m=()=>0;g.invade({province:19,target:21,officers:[4,60],governor:43,food:20000})
;;;g.s.battle.outcome={winner:'attack',reason:'Palace
occupied'};g.resolveBattle();const
row=g.s.warChronicle[0];;;validateSave(g.s,scenarios,terrain);})
```

**Required output / success criteria**

```text
assert(g.s.battle)
assert(g.s.warChronicle[0].rulerPresent.defend)
assert.notEqual(row.rulerResult,'absent')
assert(!warReportText(g.s,row).includes('not personally present'))
```

---

**Case / what it tests**

7. [New messenger departures identify mission, origin and destination without an
exile ambiguity][test-source-384]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('New messenger departures identify mission, origin and destination without
an exile ambiguity',()=>{const
g=fresh();g.execute('diplomaticMission',{province:9,mode:'alliance',target:3,off
icer:33});const e=g.s.log[0];;;;;;;})
```

**Required output / success criteria**

```text
assert(e.text.includes('as messengers for alliance proposal'))
assert(e.text.includes('#9'))
assert(e.text.includes('#'+g.ruler(3).home))
assert.equal(e.province,9)
assert(!acrossChinaChronology(g).some(x=>x.text===e.text))
assert(provinceCurrentEvents(g)[8].events.some(x=>x.text===e.text))
```


<a id="tests-v29-tests-mjs"></a>
## tests/v29-tests.mjs

Source: [tests/v29-tests.mjs](../tests/v29-tests.mjs). Purpose: A non-ruler
commander returns unharmed without putting the ruler on two fronts; A province
defended by a governor reports that commander, not an absent ruler; Old reports
replace unsupported absent-ruler wording without inventing commander identities;
additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`assets/artwork/events.webp`, `-v29.webp`,
`assets/artwork/officers-historic-v29.webp`,
`assets/artwork/officers-historic-v16.webp`. Dependencies/entry points:
`node:fs`, `node:assert/strict`, `@napi-rs/canvas`, `../mjs/battle.mjs`,
`../mjs/strategy.mjs`, `../mjs/campaign-decisions.mjs`,
`../mjs/campaign-fidelity.mjs`, `../mjs/fidelity-orders.mjs`,
`../mjs/event-chronicle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [A non-ruler commander returns unharmed without putting the ruler on two
fronts][test-source-385]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A non-ruler commander returns unharmed without putting the ruler on two
fronts',()=>{const
g=fresh();g.invade({province:9,target:8,officers:[33,34],food:20000});;;g.s.batt
le.outcome={winner:'defend',reason:'Invaders withdrew'};g.resolveBattle();const
row=g.s.warChronicle[0],text=warReportText(g.s,row);;;validateSave(g.s,scenarios
,terrain);})
```

**Required output / success criteria**

```text
assert.equal(g.s.warChronicle[0].commanders.attack.id,33)
assert.equal(g.s.warChronicle[0].rulerPresent.attack,false)
assert(text.includes('The attacking commander returned unharmed.'))
assert(!text.includes('attacking ruler'))
```

---

**Case / what it tests**

2. [A province defended by a governor reports that commander, not an absent
ruler][test-source-386]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A province defended by a governor reports that commander, not an absent
ruler',()=>{const
g=fresh(),target=g.province(8),lord=g.ruler(target.owner).leader,home=g.s.provin
ces.find(p=>p.owner===255);target.officers=target.officers.filter(id=>id!==lord)
;home.owner=target.owner;home.officers=[lord];home.governor=lord;g.ruler(target.
owner).home=home.id;target.governor=target.officers[0];g.invade({province:9,targ
et:8,officers:[0,34],governor:33,food:20000});const
b=g.s.battle,commander=b.leaders.defend;b.outcome={winner:'attack',reason:'Palac
e occupied'};const row=finishWarReport(g,b,[],new
Map([[commander,{province:home,owner:b.defender}]]));;;;;})
```

**Required output / success criteria**

```text
assert(!row.rulerPresent.defend)
assert.equal(row.commanders.defend.id,commander)
assert(warReportText(g.s,row).includes('The opposing commander was not
captured.'))
assert(!warReportText(g.s,row).includes('opposing ruler'))
```

---

**Case / what it tests**

3. [Old reports replace unsupported absent-ruler wording without inventing
commander identities][test-source-387]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Old reports replace unsupported absent-ruler wording without inventing
commander identities',()=>{const
g=fresh(),row={year:189,month:1,source:11,target:20,attacker:{name:'Dong
Zhuo'},defender:{name:'Liu
Biao'},status:'defeated',rulerResult:'absent',losingOwner:3,losingRuler:3,fates:
[]};;row.status='won';;row.rulerResult='free';row.rulerPresent={attack:true,defe
nd:true};;})
```

**Required output / success criteria**

```text
assert(warReportText(g.s,row).includes('attacking commander returned unharmed'))
assert(warReportText(g.s,row).includes('opposing commander was not captured'))
assert(warReportText(g.s,row).includes('opposing ruler was set free'))
```

---

**Case / what it tests**

4. [Rice shortage and unpaid wages are local, numbered, independently
deduplicated province reports][test-source-388]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rice shortage and unpaid wages are local, numbered, independently
deduplicated province reports',()=>{const
g=fresh(),p=g.s.provinces.find(p=>p.name==='Jiangxia');g.s.month=3;g.s.lastRepor
t={year:189,month:3,details:[{kind:'month',text:`Rice shortage in ${p.name}.
Population and garrison declined.`,province:null},{kind:'month',text:`${p.name}
cannot cover wages; officer loyalty fell.`,province:null}]};for(const e of
g.s.lastReport.details)g.record(e.text,'month');;;;})
```

**Required output / success criteria**

```text
assert.equal(provinceCurrentEvents(g)[p.id-1].events.length,2)
assert(provinceCurrentEvents(g)[p.id-1].events.every(e=>e.province===p.id&&!e.te
xt.startsWith('#')))
assert(!acrossChinaChronology(g).some(e=>/shortage|cannot cover
wages/.test(e.text)))
```

---

**Case / what it tests**

5. [All live event atlas cells exactly match events.webp dimensions and
aspect][test-source-389]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All live event atlas cells exactly match events.webp dimensions and
aspect',async()=>{const base=await loadImage(new
URL('assets/artwork/events.webp',root).pathname);for(const [key,n]of
[['disasters',2],['omens',2],['stories',2],['history',4]]){const im=await
loadImage(new URL('assets/artwork/'+key+'-v29.webp',root).pathname);;;}const
portrait=await loadImage(new
URL('assets/artwork/officers-historic-v29.webp',root).pathname),old=await
loadImage(new
URL('assets/artwork/officers-historic-v16.webp',root).pathname);;;;})
```

**Required output / success criteria**

```text
assert.equal(im.width/n,base.width/2)
assert.equal(im.height/n,base.height/2)
assert.equal(portrait.width,old.width)
assert.equal(portrait.height,old.height)
assert.notDeepEqual(fs.readFileSync(new
URL('assets/artwork/officers-historic-v29.webp',root)),fs.readFileSync(new
URL('assets/artwork/officers-historic-v16.webp',root)))
```

---

**Case / what it tests**

6. [Guan Yu and Zhang Fei join as ordinary captives; loyalty/family protection
applies to serving recruitment only][test-source-390]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Guan Yu and Zhang Fei join as ordinary captives; loyalty/family protection
applies to serving recruitment only',()=>{for(const name of ['Guan Yu','Zhang
Fei']){const
g=fresh(),o=g.s.officers.find(o=>o.name===name);;;takeCaptive(g,o.id,0,9,1,'batt
le','General');;;;validateSave(g.s,scenarios,terrain);}})
```

**Required output / success criteria**

```text
assert.equal(o.loyalty,100)
assert.equal(recruitmentProtection(g.s,o),'absolute loyalty')
assert.equal(g.decideCaptive(o.id,'recruit'),true)
assert.equal(o.owner,0)
assert.equal(o.prisonerOf,undefined)
```

---

**Case / what it tests**

7. [Every hostile recruit method honours zero, including large gold bonuses;
free recruitment remains separate][test-source-391]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every hostile recruit method honours zero, including large gold bonuses;
free recruitment remains separate',()=>{for(const method of
['attention','horse','letter','gold']){const
g=fresh(),o=g.s.officers.find(o=>o.name==='Zhang
Fei'),p=g.province(9);p.horses=5;p.gold=30000;;fidelityOrder(g,'recruitMethod',{
province:9,officer:33,target:o.id,method,amount:30000});;g.officer(33).acted=fal
se;o.loyalty=99;;}const g=fresh(),o=g.s.officers.find(o=>o.name==='Guan
Yu');o.owner=255;;})
```

**Required output / success criteria**

```text
assert.equal(recruitMethodChance(g,p,g.officer(33),o,method),0)
assert.equal(o.owner,1)
assert(recruitMethodChance(g,p,g.officer(33),o,method)>0)
assert.equal(recruitmentProtection(g.s,o),null)
```

---

**Case / what it tests**

8. [Shared blood blocks recruitment at low loyalty; native immunity is
attribute-based][test-source-392]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Shared blood blocks recruitment at low loyalty; native immunity is
attribute-based',()=>{const g=fresh(),o=g.s.officers.find(o=>o.name==='Zhang
Fei');o.loyalty=20;o.blood=g.officer(g.ruler(1).leader).blood;;o.blood=0;;})
```

**Required output / success criteria**

```text
assert.equal(recruitmentProtection(g.s,o),'shared family allegiance')
assert.equal(recruitmentProtection(g.s,o),null)
```

---

**Case / what it tests**

9. [Battlefield bribes cannot switch a fully loyal subordinate on a perfect
roll][test-source-393]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Battlefield bribes cannot switch a fully loyal subordinate on a perfect
roll',()=>{const
g=fresh(),target=8;g.invade({province:9,target,officers:[0,34],governor:33,food:
20000,gold:1000});while(g.s.battle.phase==='deployment')aiBattle(g,60);const
b=g.s.battle,u=b.units.find(u=>u.id===0),v=b.units.find(u=>u.side==='defend'&&u.
id!==b.rulers.defend);;g.officer(v.id).loyalty=100;b.side='attack';const
gold=b.gold.attack;g.battleAction('bribe',{unit:u.id,target:v.id,gold:100});;;va
lidateSave(g.s,scenarios,terrain);})
```

**Required output / success criteria**

```text
assert(v)
assert.equal(v.side,'defend')
assert.equal(b.gold.attack,gold-100)
```

---

**Case / what it tests**

10. [Actual monthly shortages retain province IDs in council playback and after
save/load][test-source-394]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Actual monthly shortages retain province IDs in council playback and after
save/load',()=>{const
g=fresh(),p=g.province(9);g.s.month=2;p.gold=0;p.food=0;g.s.completed=g.s.rulers
.map(r=>r.id).filter(id=>id!==0);g.finishFactionTurn();const
local=g.s.lastReport.details.filter(e=>e.province===p.id&&/Rice shortage|cannot
cover wages/.test(e.text));;;const loaded=new
Game(validateSave(g.s,scenarios,terrain),{},terrain);;;})
```

**Required output / success criteria**

```text
assert(local.length>=2)
assert(local.every(e=>e.province===p.id))
assert(!acrossChinaChronology(loaded).some(e=>/Rice shortage|cannot cover
wages/.test(e.text)))
assert(provinceCurrentEvents(loaded)[8].events.some(e=>e.text.includes('Rice
shortage')))
```


<a id="tests-v30-tests-mjs"></a>
## tests/v30-tests.mjs

Source: [tests/v30-tests.mjs](../tests/v30-tests.mjs). Purpose: Typhoon reports
actual land/control losses and zero resource casualties using native
coefficients; Native flood retains stores, scales casualties with control and
reports exact six-field deltas; Native locust changes food and land without
inventing gold, population or soldier losses; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../assets/artwork/${name}-v30.webp`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `@napi-rs/canvas`, `../mjs/strategy.mjs`,
`../mjs/monthly-events.mjs`, `../mjs/event-impact.mjs`, `../mjs/events.mjs`,
`../mjs/event-chronicle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Typhoon reports actual land/control losses and zero resource casualties
using native coefficients][test-source-395]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Typhoon reports actual land/control losses and zero resource casualties
using native coefficients',()=>{const
g=fresh(),p=g.province(28);Object.assign(p,{population:100000,food:30000,gold:10
00,land:80,flood:40,loyalty:80});const
before=provinceSnapshot(g,p),r=report(g);disaster(g,p,'typhoon',r);;;;;for(const
k of ['people','soldiers','food','gold']);for(const k of IMPACT_KEYS);;})
```

**Required output / success criteria**

```text
assert.equal(p.land,58)
assert.equal(p.flood,24)
assert.equal(p.loyalty,72)
assert.deepEqual(r.details[0].impact,provinceImpact(g,p,before))
assert.equal(r.details[0].impact[k],0)
assert(r.details[0].text.includes(k==='flood'?'flood control':k))
assert(!/[#\u3400-\u9fff]/.test(r.details[0].text))
```

---

**Case / what it tests**

2. [Native flood retains stores, scales casualties with control and reports
exact six-field deltas][test-source-396]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native flood retains stores, scales casualties with control and reports
exact six-field deltas',()=>{const
g=fresh(),p=g.province(8);Object.assign(p,{population:100000,food:30000,gold:100
0,land:80,flood:40,loyalty:80});for(const id of
p.officers)g.officer(id).soldiers=1000;const
before=provinceSnapshot(g,p),r=report(g);disaster(g,p,'flood',r);;;;;;;;;;valida
teSave(g.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert.equal(p.population,83100)
assert.equal(p.land,52)
assert.equal(p.flood,30)
assert.equal(p.loyalty,58)
assert(p.officers.every(id=>g.officer(id).soldiers===800))
assert.deepEqual(r.details[0].impact,provinceImpact(g,p,before))
assert.equal(p.food,30000)
assert.equal(p.gold,1000)
assert.equal(p.ricePrice,40)
```

---

**Case / what it tests**

3. [Native locust changes food and land without inventing gold, population or
soldier losses][test-source-397]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native locust changes food and land without inventing gold, population or
soldier losses',()=>{const
g=fresh(),p=g.province(9),before=provinceSnapshot(g,p),r=report(g);disaster(g,p,
'locust',r);;;;;;})
```

**Required output / success criteria**

```text
assert.equal(p.food,Math.floor(before.food/2))
assert.equal(p.land,Math.floor(before.land*.5))
assert.equal(p.gold,before.gold)
assert.equal(p.population,before.people)
assert.equal(r.details[0].impact.soldiers,0)
```

---

**Case / what it tests**

4. [Illness onset and recovery are separate local events, preserved through
save/load][test-source-398]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Illness onset and recovery are separate local events, preserved through
save/load',()=>{const g=fresh(),p=g.province(9);g.random=()=>.25;for(const id of
p.officers){g.officer(id).sick=false;g.officer(id).injured=false;}const
r=report(g);disaster(g,p,'epidemic',r);const
illnesses=r.details.filter(e=>e.title.startsWith('Illness'));;;g.s.lastReport=r;
const loaded=new
Game(validateSave(g.s,scenarios,terrains),{},terrains);;;loaded.random=()=>.99;l
oaded.s.month=2;const
next=report(loaded);runMonthlyEvents(loaded,next);;validateSave(loaded.s,scenari
os,terrains);})
```

**Required output / success criteria**

```text
assert.equal(illnesses.length,p.officers.length)
assert(illnesses.every(e=>e.province===9&&e.text.includes('fell
ill')&&e.text.includes('1 month')))
assert.equal(provinceCurrentEvents(loaded)[8].events.filter(e=>e.text.includes('
fell ill')).length,p.officers.length)
assert(!acrossChinaChronology(loaded).some(e=>e.text.includes('fell ill')))
assert(next.details.some(e=>e.province===9&&e.text.includes('recovered')))
```

---

**Case / what it tests**

5. [Good local events explicitly report unchanged resources and legacy messages
lose duplicate prefixes][test-source-399]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Good local events explicitly report unchanged resources and legacy
messages lose duplicate prefixes',()=>{const g=fresh(),r=report(g);;;;const
e=presentEvent(g,{kind:'month',province:8,title:'#8 · 房子泡湯了 · Flood',text:'#8 ·
房子泡湯了 · Flood struck Linzi. 3,062 people lost.'});;;})
```

**Required output / success criteria**

```text
assert(triggerEvent(g,'medical',r,{officer:34}))
assert.deepEqual(r.details[0].impact,Object.fromEntries(IMPACT_KEYS.map(k=>[k,0]
)))
assert(r.details[0].text.includes('food 0 unchanged'))
assert.equal(e.title,'Flood')
assert.equal(e.text,'Flood struck Linzi. 3,062 people lost.')
```

---

**Case / what it tests**

6. [Native uprising population displacement is reported as a gain in its
connected destination][test-source-400]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native uprising population displacement is reported as a gain in its
connected destination',()=>{const g=fresh(),p=g.province(9),r=report(g);const
before=provinceSnapshot(g,p);disaster(g,p,'uprising',r);;const
arrival=r.details.find(e=>e.title.startsWith('Refugees'));;;;;validateSave(g.s,s
cenarios,terrains);})
```

**Required output / success criteria**

```text
assert.equal(p.population,(Math.floor(Math.floor(before.people/100)*.6)+1)*100)
assert(arrival)
assert(p.neighbors.includes(arrival.province))
assert.equal(arrival.impact.people,-r.details[0].impact.people)
assert(arrival.text.includes('gained'))
```

---

**Case / what it tests**

7. [Battle injuries record their onset at the final province without replacing
the victory announcement][test-source-401]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Battle injuries record their onset at the final province without replacing
the victory announcement',()=>{const
g=fresh();g.s.settings.battleView='all';g.invade({province:9,target:8,officers:[
0,34],governor:33,food:20000});const
b=g.s.battle,u=b.units.find(u=>u.id===34);u.soldiers=Math.floor(u.startSoldiers/
3);b.outcome={winner:'attack',reason:'Test victory'};g.resolveBattle();;const
injury=g.s.log.find(e=>e.event?.officer===34&&e.text.includes('was
injured'));;;;;;validateSave(g.s,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert(g.officer(34).injured)
assert(injury)
assert.equal(injury.province,8)
assert(injury.text.includes('3 months'))
assert(!g.s.lastEvent.text.includes('was injured'))
assert(provinceCurrentEvents(g)[7].events.some(e=>e.text.includes('was
injured')))
```

---

**Case / what it tests**

8. [New event ledgers reject malformed deltas without rejecting legacy
reports][test-source-402]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('New event ledgers reject malformed deltas without rejecting legacy
reports',()=>{const
g=fresh(),r=report(g);disaster(g,g.province(8),'flood',r);g.s.lastReport=r;valid
ateSave(g.s,scenarios,terrains);const
bad=structuredClone(g.s);bad.lastReport.details[0].impact.people='unknown';;dele
te bad.lastReport.details[0].impact;validateSave(bad,scenarios,terrains);})
```

**Required output / success criteria**

```text
assert.throws(()=>validateSave(bad,scenarios,terrains))
```

---

**Case / what it tests**

9. [Every replacement event cell fills its frame instead of containing a flat
matte strip][test-source-403]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every replacement event cell fills its frame instead of containing a flat
matte strip',async()=>{for(const [name,n]of
[['history',4],['disasters',2],['omens',2],['stories',2]]){const image=await
loadImage(new
URL(`../assets/artwork/${name}-v30.webp`,import.meta.url).pathname);;;const
c=createCanvas(100*n,40*n),ctx=c.getContext('2d');ctx.drawImage(image,0,0,c.widt
h,c.height);for(let row=0;row<n;row++)for(let col=0;col<n;col++)for(const side
of [0,99]){const d=ctx.getImageData(col*100+side,row*40+3,1,34).data,colors=new
Set();for(let
i=0;i<d.length;i+=4)colors.add(`${d[i]>>3},${d[i+1]>>3},${d[i+2]>>3}`);;}}})
```

**Required output / success criteria**

```text
assert.equal(image.width/n,991.5)
assert.equal(image.height/n,396.5)
assert(colors.size>5,`${name} ${col},${row} has a flat side strip`)
```


<a id="tests-v31-tests-mjs"></a>
## tests/v31-tests.mjs

Source: [tests/v31-tests.mjs](../tests/v31-tests.mjs). Purpose: Execution with
surviving realm installs a blood-related successor and hostility100 only toward
killer; Human successor choice keeps vengeance at100 and persists the pending
council; No heir execution emits exactly one clan event, while freeing
dispossessed ruler permits exile; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`-v31.webp`, `config/release.json`, `assets/artwork/omens-v30.webp`.
Dependencies/entry points: `node:fs`, `node:assert/strict`, `node:crypto`,
`@napi-rs/canvas`, `../mjs/strategy.mjs`, `../mjs/campaign-decisions.mjs`,
`../mjs/campaign-completion.mjs`, `../mjs/monthly-events.mjs`,
`../mjs/ai-battle.mjs`, `../mjs/battle-summary.mjs`, `../mjs/battle.mjs`,
`../mjs/events.mjs`, `../mjs/event-chronicle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Execution with surviving realm installs a blood-related successor and
hostility100 only toward killer][test-source-404]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Execution with surviving realm installs a blood-related successor and
hostility100 only toward killer',()=>{const
g=fresh(),r=g.ruler(1),old=r.leader,home=g.province(r.home),candidate=home.offic
ers.find(id=>id!==old);;g.officer(candidate).blood=g.officer(old).blood||1;g.off
icer(old).blood=g.officer(candidate).blood;takeCaptive(g,old,0,9,1,'battle','Rul
er');g.decideCaptive(old,'behead');;;;const
event=g.s.log.find(x=>x.event?.art==='heir');;;;valid(g);})
```

**Required output / success criteria**

```text
assert(candidate!==undefined)
assert(g.officer(old).dead)
assert.equal(r.leader,candidate)
assert.equal(r.relations[0],100)
assert(event)
assert.equal(eventFrame(event.event).atlas,'heir')
assert(acrossChinaChronology(g).some(x=>x.text===event.text))
```

---

**Case / what it tests**

2. [Human successor choice keeps vengeance at100 and persists the pending
council][test-source-405]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human successor choice keeps vengeance at100 and persists the pending
council',()=>{const
g=fresh([0,1]),r=g.ruler(1),old=r.leader;takeCaptive(g,old,0,9,1);g.decideCaptiv
e(old,'behead');;const pendingState=JSON.stringify(g.s);;;const
s=valid(g),loaded=new
Game(s,{},terrains),x=loaded.s.successorDecisions.find(x=>x.owner===1);loaded.ch
ooseSuccessor(1,x.candidates.at(-1));;;valid(loaded);})
```

**Required output / success criteria**

```text
assert(g.s.successorDecisions.some(x=>x.owner===1))
assert.equal(g.aiStep(),false)
assert.equal(JSON.stringify(g.s),pendingState)
assert.equal(loaded.ruler(1).relations[0],100)
assert.equal(loaded.s.successorDecisions.length,0)
```

---

**Case / what it tests**

3. [No heir execution emits exactly one clan event, while freeing dispossessed
ruler permits exile][test-source-406]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('No heir execution emits exactly one clan event, while freeing dispossessed
ruler permits exile',()=>{for(const action of ['behead','free']){const
g=fresh(),r=g.ruler(1),old=r.leader;for(const p of
g.s.provinces.filter(p=>p.owner===1)){for(const id of
p.officers){g.officer(id).owner=255;p.unclaimed.push(id);}p.officers=[];p.owner=
255;p.governor=null;}takeCaptive(g,old,0,9,1);g.decideCaptive(old,action);g.reco
ncileControl();g.reconcileControl();const
events=g.s.log.filter(x=>x.event?.art==='clan');;if(action==='free');valid(g);}}
)
```

**Required output / success criteria**

```text
assert.equal(events.length,action==='behead'?1:0)
assert(g.s.roaming.some(x=>x.owner===1))
```

---

**Case / what it tests**

4. [Diplomatic surrender retires realm and reports clan destruction; natural
succession does not invent a killer][test-source-407]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Diplomatic surrender retires realm and reports clan destruction; natural
succession does not invent a killer',()=>{const
g=fresh(),r=g.ruler(1);surrenderRealm(g,r,g.officer(0));g.normalize();;;valid(g)
;const
h=fresh(),rr=h.ruler(1),relations=structuredClone(rr.relations),report={events:[
],details:[]};;;;h.normalize();valid(h);})
```

**Required output / success criteria**

```text
assert.equal(r.extinct,true)
assert(g.s.log.some(x=>x.event?.art==='clan'))
assert(officerDeath(h,rr.leader,report))
assert.deepEqual(rr.relations,relations)
assert(report.details.some(x=>x.title==='A new ruler'))
```

---

**Case / what it tests**

5. [Human incoming alliance and marriage always pause, save and obey choice
rather than rerolling][test-source-408]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human incoming alliance and marriage always pause, save and obey choice
rather than rerolling',async()=>{for(const mode of
['alliance','marriage'])for(const accept of [false,true]){const g=await
proposal(mode,accept);;valid(g);}})
```

**Required output / success criteria**

```text
assert.equal(mode==='alliance'?g.ruler(0).alliances.includes(1):g.ruler(0).daugh
terGivenTo===1,accept)
```

---

**Case / what it tests**

6. [Human joint invasion pauses before assent and then requires a separate force
commitment][test-source-409]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human joint invasion pauses before assent and then requires a separate
force commitment',async()=>{const declined=await
proposal('joint',false);;;valid(declined);const accepted=await
proposal('joint',true);;;;valid(accepted);accepted.answerAlly(false);;;valid(acc
epted);})
```

**Required output / success criteria**

```text
assert.equal(declined.s.allyDecisions.length,0)
assert.equal(declined.s.jointPlans.length,0)
assert.equal(accepted.s.allyDecisions.length,1)
assert.equal(accepted.s.allyDecisions[0].owner,1)
assert.equal(accepted.s.jointPlans.length,0)
assert.equal(accepted.s.allyDecisions.length,0)
assert.equal(accepted.s.jointPlans.length,0)
```

---

**Case / what it tests**

7. [An actual battlefield death announces extinction or surviving succession
without treating army depletion as death][test-source-410]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An actual battlefield death announces extinction or surviving succession
without treating army depletion as death',()=>{for(const survives of
[false,true]){const
g=fresh(),p=g.province(9),target=g.province(8),owner=target.owner,r=g.ruler(owne
r),old=r.leader;if(survives){const q=g.province(16);q.owner=owner;for(const id
of
q.officers)g.officer(id).owner=owner;q.governor=q.officers[0];}g.normalize();con
st
b=spawnBattle(g,p,target,[0,34],20000,terrains[7]);b.gold={attack:0,defend:0};b.
outcome={winner:'attack',reason:'The opposing commander was
killed.'};g.s.battle=b;const
leader=b.units.find(u=>u.id===old);;leader.killed=true;leader.soldiers=0;g.resol
veBattle();;;;;if(survives){;;}else ;v … (complete input/procedure at linked
L14–14)
```

**Required output / success criteria**

```text
assert(leader)
assert(g.officer(old).dead)
assert.equal(g.officer(old).deathReason,'battle')
assert(!g.s.captiveDecisions.some(x=>x.officer===old))
assert(g.s.log.some(x=>x.event?.art===(survives?'heir':'clan')))
assert.notEqual(r.leader,old)
assert.equal(r.relations[0],100)
assert(r.extinct)
```

---

**Case / what it tests**

8. [Human surrender demand requires a response; spectator alliances
auto-resolve][test-source-411]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human surrender demand requires a response; spectator alliances
auto-resolve',async()=>{const g=await proposal('threat',false);;;const
h=fresh([]),p=h.province(9);h.random=()=>0;h.execute('diplomaticMission',{provin
ce:9,officer:33,target:1,mode:'alliance'});let
n=0;while(h.s.journey){if(h.s.journey.interception)h.interceptJourney('free');el
se h.advanceJourney();;;};valid(h);})
```

**Required output / success criteria**

```text
assert(g.s.provinces.some(p=>p.owner===1))
assert(!g.ruler(1).extinct)
assert(!h.s.journey?.proposal)
assert(++n<100)
assert(h.ruler(0).alliances.includes(1))
```

---

**Case / what it tests**

9. [Initial invasion rejects6 atomically; defender initial field has10 and
additional generals remain reserves][test-source-412]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Initial invasion rejects6 atomically; defender initial field has10 and
additional generals remain reserves',()=>{const
g=fresh();g.s.settings.battleView='all';let
p=g.province(9),target=g.province(8);while(p.officers.length<7){const
q=g.s.provinces.find(q=>q.id!==9&&q.owner===0&&q.officers.length>1);const
id=q.officers.pop();p.officers.push(id);g.officer(id).soldiers=1000;}g.normalize
();const
before=JSON.stringify(g.s);;;p=g.province(9);target=g.province(8);while(target.o
fficers.length<12){const
q=g.s.provinces.find(q=>q.id!==8&&q.officers.length>1);const
id=q.officers.find(id=>id!==q.governor);q.officers=q.officers.filter(x=>x!==id);
g.officer(id).owner=target.owner;g.officer(id).soldi … (complete input/procedure
at linked L16–16)
```

**Required output / success criteria**

```text
assert.throws(()=>g.invade({province:9,target:8,officers:p.officers.slice(0,6),f
ood:20000}))
assert.equal(JSON.stringify(g.s),before)
assert.equal(living(b).filter(u=>u.side==='attack').length,5)
assert.equal(living(b).filter(u=>u.side==='defend').length,10)
assert.equal(info.remaining,2)
assert.equal(info.generals,10)
```

---

**Case / what it tests**

10. [Original source cannot grow the main invasion beyond five; defender field
caps at ten][test-source-413]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Original source cannot grow the main invasion beyond five; defender field
caps at ten',()=>{const
g=fresh(),source=g.province(9),target=g.province(8);while(source.officers.length
<7){const
donor=g.s.provinces.find(q=>![9,8].includes(q.id)&&q.officers.length>1);const
id=donor.officers.find(id=>id!==donor.governor);donor.officers=donor.officers.fi
lter(x=>x!==id);source.officers.push(id);Object.assign(g.officer(id),{owner:sour
ce.owner,soldiers:1000,acted:false});}g.normalize();const
b=spawnBattle(g,source,target,source.officers.slice(0,5),20000,terrains[7]);b.go
ld={attack:0,defend:0};g.s.battle=b;while(b.phase==='deployment')aiBattle(g);con
st u=b.units.find(u=>u.id===b.leaders.attack),extr … (complete input/procedure
at linked L17–17)
```

**Required output / success criteria**

```text
assert.throws(()=>g.battleAction('reinforce',{unit:u.id,province:source.id,offic
er:extra,food:0}))
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

11. [Defender forecasts north-to-palace lanes and prefers middle jungle over
off-route forest][test-source-414]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defender forecasts north-to-palace lanes and prefers middle jungle over
off-route forest',()=>{const
terrain=Array(156).fill(0);terrain[11*13+6]=6;terrain[5*13+6]=1;terrain[5*13+1]=
1;for(let r=1;r<11;r++){terrain[r*13+3]=3;terrain[r*13+9]=3;}const
a={id:1,side:'attack',q:6,r:0,soldiers:5000,placed:true,morale:100},a2={...a,id:
2,q:7},d={...a,id:3,side:'defend',q:6,r:7,soldiers:2000,mobility:6};const
b={units:[a,a2,d],terrain,fire:{},palace:{q:6,r:11},leaders:{attack:1,defend:4},
day:1};const routes=projectedAttackRoutes(b,[a,a2]);;;;;const
result=tacticalPosition(b,d,[a,a2],[{q:6,r:5,cost:6},{q:1,r:5,cost:6}],true);;;}
)
```

**Required output / success criteria**

```text
assert.equal(routes.length,2)
assert(routes.every(x=>x.path.every(p=>terrain[p.r*13+p.q]!==3)))
assert(ambushLaneScore({q:6,r:5},routes)>.6)
assert.equal(ambushLaneScore({q:1,r:5},routes),0)
assert.equal(result.ambushGoal?.q??result.q,6)
assert.notEqual(result.q,1)
```

---

**Case / what it tests**

12. [Wind says No wind once or one direction, and legacy strength cannot survive
validation][test-source-415]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Wind says No wind once or one direction, and legacy strength cannot
survive validation',()=>{;for(let n=1;n<=6;n++){;;}const
g=fresh();g.s.settings.battleView='all';g.invade({province:9,target:8,officers:[
0,34],governor:33,food:20000});g.s.battle.wind=6;g.s.battle.windStrength=3;;})
```

**Required output / success criteria**

```text
assert.equal(windDescription(0),'No wind')
assert(windDescription(n).startsWith('Wind ·'))
assert(!/Breeze|Strong|Gale|Calm/.test(windDescription(n)))
assert.equal(valid(g).battle.windStrength,1)
```

---

**Case / what it tests**

13. [New clan/heir art are full-frame individual panoramas and v30 active
atlases are in manifest][test-source-416]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('New clan/heir art are full-frame individual panoramas and v30 active
atlases are in manifest',async()=>{for(const name of
['clan-destroyed','heir-vows-vengeance']){const im=await
loadImage('assets/artwork/'+name+'-v31.webp');;}const
release=JSON.parse(fs.readFileSync('config/release.json'));;for(const asset of
release.activeEventArt){;;};})
```

**Required output / success criteria**

```text
assert(Math.abs(im.width/im.height-2.5)<.005)
assert(release.version>=31)
assert(fs.existsSync(asset.file))
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(asset.file)).dig
est('hex'),asset.sha256)
assert(release.activeEventArt.some(x=>x.file==='assets/artwork/omens-v30.webp'))
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(enemy,'Joint fixture needs an enemy bordering both allies.');
assert(g.s.journey?.proposal);
assert.equal(g.s.journey.delivered,undefined);
assert.deepEqual(g.s,before);
assert(!clone.s.journey.proposal);
assert.equal(clone.s.journey.phase,'return')
```

<a id="tests-v32-tests-mjs"></a>
## tests/v32-tests.mjs

Source: [tests/v32-tests.mjs](../tests/v32-tests.mjs). Purpose: All 1300
isolated native vectors agree with production domestic, power and casualty
arithmetic; All 186 directed approaches in 41 provinces have exactly their
native five cells; defenders use twenty; Water attacking palace pays native
assault penalty; counterattack uses intact pre-exchange force; additional cases
below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`docs/native-equation-vectors-v32.json`, `docs/deployment-v32.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/native-combat.mjs`,
`../mjs/original-deployment.mjs`, `../mjs/battle.mjs`, `../mjs/geography.mjs`,
`../mjs/event-chronicle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [All 1300 isolated native vectors agree with production domestic, power and
casualty arithmetic][test-source-417]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All 1300 isolated native vectors agree with production domestic, power and
casualty arithmetic',()=>{ const
vectors=JSON.parse(fs.readFileSync('docs/native-equation-vectors-v32.json')),g=f
resh(); for(const v of
vectors.development){g.s.difficulty=v.difficulty;for(const field of
['land','flood']);} for(const v of vectors.power); for(const v of
vectors.casualties); ; })
```

**Required output / success criteria**

```text
assert.equal(g.development({[field]:v.value},v,v.gold,field),v.gain)
assert.equal(combatPower(v),v.power)
assert.equal(nativeCasualty(v.ownPower,v.otherPower,v.otherMen,v.palaceAssault?7
:v.terrain,v.factor,v.random300,v.random30),v.loss)
assert.equal(vectors.development.length+vectors.power.length+vectors.casualties.
length,1300)
```

---

**Case / what it tests**

2. [All 186 directed approaches in 41 provinces have exactly their native five
cells; defenders use twenty][test-source-418]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All 186 directed approaches in 41 provinces have exactly their native five
cells; defenders use twenty',()=>{ const
g=fresh(),audit=JSON.parse(fs.readFileSync('docs/deployment-v32.json'));;
for(const p of g.s.provinces){;for(const source of p.neighbors){const
entry=provinceDirection(p,g.province(source)),b={target:p.id,terrain:terrains[p.
id-1],fire:{},units:[],entryDirection:entry};const
actual=placementCells(b,'attack').map(c=>[c.q,c.r]);;;;}} })
```

**Required output / success criteria**

```text
assert.equal(audit.approaches.length,186)
assert.equal(DEFENDER_ZONES[p.id-1].length,20)
assert.deepEqual(actual,ATTACKER_ZONES[p.id-1][entry])
assert.deepEqual(actual,audit.approaches.find(a=>a.target===p.id&&a.source===sou
rce).slots)
assert.equal(placementCells(b,'defend').length,20)
```

---

**Case / what it tests**

3. [Water attacking palace pays native assault penalty; counterattack uses
intact pre-exchange force][test-source-419]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Water attacking palace pays native assault penalty; counterattack uses
intact pre-exchange force',()=>{ const a=unit('attack'),d=unit('defend');const
hit=meleeExchange(a,d,4,6,()=>.5); ; const
land=meleeExchange(a,d,0,0,()=>.5);;;;; })
```

**Required output / success criteria**

```text
assert.deepEqual(hit,{loss:75,reply:300,attackerWeapons:300,defenderWeapons:75})
assert.equal(land.loss,150)
assert.equal(land.reply,150)
assert.equal(a.soldiers,5000)
assert.equal(d.soldiers,5000)
```

---

**Case / what it tests**

4. [A native single exchange can wipe 1000 weak men in water without a fixed
1000-man minimum][test-source-420]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A native single exchange can wipe 1000 weak men in water without a fixed
1000-man minimum',()=>{ const
strong={...unit('attack'),war:100,combatWarBonus:20},weak={...unit('defend',1000
),war:0,training:0,weapons:0}; ; ; })
```

**Required output / success criteria**

```text
assert.equal(meleeExchange(strong,weak,0,4,()=>.999).loss,1000)
assert.equal(meleeExchange(unit('attack'),unit('defend'),0,0,()=>0).loss,1)
```

---

**Case / what it tests**

5. [Equipment coverage and casualties update both armies; legacy morale alone
cannot end a battle][test-source-421]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Equipment coverage and casualties update both armies; legacy morale alone
cannot end a battle',()=>{ ; const
b={units:[unit('attack'),unit('defend')],phase:'battle',food:{attack:1000,defend
:1000},leaders:{attack:0,defend:1},rulers:{attack:0,defend:1},terrain:Array(156)
.fill(0),palace:{q:12,r:11}}; ;; b.food.defend=0;;;; })
```

**Required output / success criteria**

```text
assert.equal(equipmentPercent({soldiers:1000,weapons:300}),30)
assert.equal(outcome(b),null)
assert.equal(living(b).length,2)
assert.equal(outcome(b).winner,'attack')
assert.match(b.outcome.reason,/defending.*food/)
assert.equal(b.units[1].soldiers,5000)
```

---

**Case / what it tests**

6. [Cultiv and Flood use the same native gain, spend gold and saturate
at100][test-source-422]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Cultiv and Flood use the same native gain, spend gold and saturate
at100',()=>{ for(const type of ['develop','flood']){const
g=fresh(),p=g.province(9),o=g.officer(34),field=type==='develop'?'land':'flood';
p[field]=99;p.gold=1000;Object.assign(o,{acted:false,int:100,charm:100});const
gain=g.preview(type,9,o.id,100);g.execute(type,{province:9,officer:o.id,amount:1
00});;;;;} })
```

**Required output / success criteria**

```text
assert.equal(p[field],99+gain)
assert.equal(p.gold,900)
assert(o.acted)
assert.equal(g.development({[field]:100},o,100,field),0)
```

---

**Case / what it tests**

7. [All-battles spectator outcomes survive tactical-log eviction and save/load
with a retained internal reason][test-source-423]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All-battles spectator outcomes survive tactical-log eviction and save/load
with a retained internal reason',()=>{ for(const winner of
['attack','defend']){const
g=fresh([]);g.invade({province:9,target:8,officers:[0,34],governor:33,food:20000
});const
b=g.s.battle;;while(b.phase==='deployment')aiBattle(g);b.outcome={winner,reason:
winner==='attack'?'The defending army exhausted its food.':'The attacking
commander fled.'};g.resolveBattle();for(let i=0;i<200;i++)g.record(`Day
${i%30+1}: Defending army’s orders.`,'war');const
rows=acrossChinaChronology(g).filter(x=>x.text.includes('attacked'));;;;;;const
restored=new Game(validateSave(g.s,scenarios,g.terrains),{},g.terrains);;} })
```

**Required output / success criteria**

```text
assert(g.battleDetailed())
assert.equal(rows.length,1)
assert(rows[0].text.includes(winner==='attack'?'Won.':'Defeated.'))
assert(!rows[0].text.includes('Result:'))
assert.equal(g.s.warChronicle.find(x=>x.war===b.chronicleWar).reason,b.outcome.r
eason)
assert.equal(g.s.lastBattle.reason,b.outcome.reason)
assert(acrossChinaChronology(restored).some(x=>x.text===rows[0].text))
```

---

**Case / what it tests**

8. [An invading main contingent at five cannot pull extra units from its source
or a friendly neighbor][test-source-424]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An invading main contingent at five cannot pull extra units from its
source or a friendly neighbor',()=>{ const
g=fresh(),p=g.province(9);while(p.officers.length<7){const
q=g.s.provinces.find(q=>q.id!==9&&q.officers.length>1),id=q.officers.find(id=>id
!==q.governor);q.officers=q.officers.filter(x=>x!==id);p.officers.push(id);Objec
t.assign(g.officer(id),{owner:p.owner,soldiers:1000,acted:false});}g.normalize()
;g.invade({province:9,target:8,officers:p.officers.filter(id=>id!==p.governor).s
lice(0,5),food:20000});while(g.s.battle.phase==='deployment')aiBattle(g);;; })
```

**Required output / success criteria**

```text
assert.equal(reinforcementOptions(g,'attack').length,0)
assert.equal(living(g.s.battle).filter(u=>u.side==='attack').length,5)
```

---

**Case / what it tests**

9. [Old broad-zone deployment and unsupported morale routes migrate without
altering a fighting army’s coordinates][test-source-425]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Old broad-zone deployment and unsupported morale routes migrate without
altering a fighting army’s coordinates',()=>{ const
g=fresh();g.invade({province:9,target:8,officers:[0,34],governor:33,food:20000})
;while(g.s.battle.phase==='deployment')aiBattle(g);const
raw=structuredClone(g.s),u=raw.battle.units[0];raw.battle.rulesVersion=5;u.moral
e=0;u.routed=true;const
position=[u.q,u.r],restored=validateSave(raw,scenarios,g.terrains);;;; })
```

**Required output / success criteria**

```text
assert.equal(restored.battle.rulesVersion,6)
assert.equal(restored.battle.units[0].routed,false)
assert.deepEqual([restored.battle.units[0].q,restored.battle.units[0].r],positio
n)
```


<a id="tests-v33-tests-mjs"></a>
## tests/v33-tests.mjs

Source: [tests/v33-tests.mjs](../tests/v33-tests.mjs). Purpose: 812 controlled
native vectors agree with ambush, flight, Train, Give and hex trigger geometry;
Native local governance table selects ambition policy and rotates with original
retry counts; Rulers have two captive options; execution announces an heir and
100 hostility toward the killer; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`docs/native-battle-vectors-v33.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`,
`../mjs/native-governance-priority.mjs`, `../mjs/native-combat.mjs`,
`../mjs/battle.mjs`, `../mjs/campaign-decisions.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [812 controlled native vectors agree with ambush, flight, Train, Give and hex
trigger geometry][test-source-426]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('812 controlled native vectors agree with ambush, flight, Train, Give and
hex trigger geometry',()=>{ for(const v of vectors.ambush){const
rolls=[(v.random300+.1)/300,(v.random30+.1)/30];;} for(const v of
vectors.flight){;;} for(const v of vectors.training); for(const v of
vectors.give); for(const v of vectors.geometry); ; })
```

**Required output / success criteria**

```text
assert.deepEqual(ambushExchange(v.mover,v.ambusher,v.terrain,()=>rolls.shift(),v
.factor),{loss:v.loss,weapons:v.weapons})
assert.equal(fleeChance({...v.unit,mobility:v.mobility},v.enemies,v.ruler,v.rand
om10),v.chance)
assert.equal(v.unit.hasHorse||v.roll100<v.chance,v.escaped)
assert.equal(trainingGain({war:v.war},v.armies),v.gain)
assert.equal(giveFoodGain(v.population,v.governorCharm,v.officerCharm,v.food,v.d
ifficulty),v.gain)
assert.deepEqual(ambushCells({q:v.fromCell[0],r:v.fromCell[1]},{q:v.toCell[0],r:
v.toCell[1]}).map(p=>[p.q,p.r]),v.cells)
assert.equal(Object.values(vectors).reduce((n,x)=>n+x.length,0),812)
```

---

**Case / what it tests**

2. [Native local governance table selects ambition policy and rotates with
original retry counts][test-source-427]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native local governance table selects ambition policy and rotates with
original retry counts',()=>{ ;;; ; ; ; ; const attempts=[];;; })
```

**Required output / success criteria**

```text
assert.equal(nativePolicy(79,()=>{throw Error('Unneeded policy RNG');}),0)
assert.equal(nativePolicy(80,()=>0),1)
assert.equal(nativePolicy(100,()=>.999),2)
assert.deepEqual(NATIVE_POLICIES[0],['domestic','personnel','domestic','military
','movement'])
assert.deepEqual(NATIVE_GROUPS.domestic,['relief','develop','flood','sellFood','
buyHorses'])
assert.deepEqual(nativeGroupOrders('military',3,()=>.75),['buyWeapons','trainArm
y','hireArmy'])
assert.deepEqual(nativeGroupOrders('personnel',3,()=>.5),['search','rewardWritin
gs','reward','recruit'])
assert(runNativePriority(1,3,()=>0,x=>{attempts.push(x);return
x==='trainArmy';}))
assert.deepEqual(attempts,['relief','develop','flood','sellFood','trainArmy'])
```

---

**Case / what it tests**

3. [Rulers have two captive options; execution announces an heir and 100
hostility toward the killer][test-source-428]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rulers have two captive options; execution announces an heir and 100
hostility toward the killer',()=>{ const
g=fresh(),r=g.ruler(0),old=r.leader;takeCaptive(g,old,12,8,0,'battle','Ruler');c
onst c=g.s.captiveDecisions[0];;;const
before=JSON.stringify(g.s);;;g.decideCaptive(old,'behead');;;;;;validateSave(g.s
,scenarios,g.terrains); })
```

**Required output / success criteria**

```text
assert(g.s.provinces.some(p=>p.owner===0))
assert.deepEqual(captiveActions(g,c),['free','behead'])
assert.throws(()=>g.decideCaptive(old,'recruit'))
assert.equal(JSON.stringify(g.s),before)
assert.notEqual(r.leader,old)
assert.equal(r.relations[12],100)
assert.equal(r.enemy,12)
assert(g.s.log.some(e=>e.event?.art==='heir'))
assert(g.s.successorDecisions.some(d=>d.owner===0))
```

---

**Case / what it tests**

4. [Moving beside a waiting forest defender automatically ambushes; INT 90
evades without consuming RNG][test-source-429]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Moving beside a waiting forest defender automatically ambushes; INT 90
evades without consuming RNG',()=>{ for(const intelligence of [89,90]){const
{g,b,u,v}=arena();u.int=intelligence;v.ordered=true;v.mobility=0;const
before=u.soldiers,mp=v.mobility;g.battleAction('move',{unit:u.id,q:6,r:6});;;;;;
} let calls=0;const a={soldiers:1000,weapons:1000,war:80,int:90,training:50};;;
})
```

**Required output / success criteria**

```text
assert.equal(u.soldiers<before,intelligence===89)
assert(b.events.some(t=>t.includes('ambushed')))
assert.equal(v.mobility,mp)
assert(v.ordered)
assert.equal(v.soldiers,5000)
assert.equal(ambushExchange(a,a,0,()=>{calls++;return .5;}).loss,0)
assert.equal(calls,0)
```

---

**Case / what it tests**

5. [Zero-men melee victims leave the field immediately and emit a capture
status][test-source-430]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Zero-men melee victims leave the field immediately and emit a capture
status',()=>{const
{g,b,u,v}=arena();Object.assign(v,direction(u.q,u.r,4),{soldiers:1,int:90});g.ba
ttleAction('charge',{unit:u.id,target:v.id});;;;;;})
```

**Required output / success criteria**

```text
assert.equal(v.soldiers,0)
assert(!living(b).some(x=>x.id===v.id))
assert(v.captured)
assert(b.messages.some(m=>m.text.includes('army depleted to 0; captured')))
assert.deepEqual({q:u.q,r:u.r},{q:v.q,r:v.r})
```

---

**Case / what it tests**

6. [Adjacent friendly provinces are retreat destinations for either side;
hostile provinces are excluded][test-source-431]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Adjacent friendly provinces are retreat destinations for either side;
hostile provinces are excluded',()=>{const
{g,b,u,v}=arena(),p=g.province(g.province(b.target).neighbors.find(id=>id!==b.so
urce));p.owner=b.defender;for(const id of
p.officers)g.officer(id).owner=b.defender;g.normalize();;;;;})
```

**Required output / success criteria**

```text
assert(g.province(8).neighbors.includes(p.id))
assert(retreatOptions(g,v).some(q=>q.id===p.id))
assert(!retreatOptions(g,u).some(q=>q.id===p.id))
assert(!retreatOptions(g,v).some(q=>q.id===b.source))
```

---

**Case / what it tests**

7. [Flight restores training mobility, can fail even without contact, and horses
guarantee success][test-source-432]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Flight restores training mobility, can fail even without contact, and
horses guarantee success',()=>{for(const mounted of [false,true]){const
{g,b}=arena(),u=b.units.find(x=>x.side==='attack'&&x.id!==b.leaders.attack);Obje
ct.assign(u,{war:0,training:0,mobility:0,soldiers:100});g.officer(u.id).hasHorse
=mounted;g.random=()=>.99;g.battleAction('flee',{unit:u.id,province:b.source});;
;;if(!mounted);}})
```

**Required output / success criteria**

```text
assert.equal(u.fled,mounted)
assert.equal(u.captured,!mounted)
assert(b.messages.some(m=>m.text.includes(mounted?'fled successfully':'tried to
flee — captured')))
assert.equal(u.mobility,2)
```

---

**Case / what it tests**

8. [Watched results retain the field, pause AI and survive save/load until
acknowledgement][test-source-433]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Watched results retain the field, pause AI and survive save/load until
acknowledgement',()=>{const {g,b,u}=arena({reviewBattleResult:true});for(const x
of
b.units)g.officer(x.id).hasHorse=true;g.battleAction('flee',{unit:u.id,confirmAr
my:true});;;;const h=new
Game(validateSave(g.s,scenarios,g.terrains),{},g.terrains,{reviewBattleResult:tr
ue});;;;;;})
```

**Required output / success criteria**

```text
assert.equal(g.s.battle,b)
assert(b.awaitingResult)
assert.equal(g.aiStep(),false)
assert(h.s.battle.awaitingResult)
assert.equal(h.acknowledgeBattleResult(),true)
assert.equal(h.s.battle,null)
assert.equal(h.s.lastBattle.winner,'defend')
assert.equal(h.acknowledgeBattleResult(),false)
```

---

**Case / what it tests**

9. [Unwatched and headless results settle immediately without introducing a
result queue][test-source-434]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Unwatched and headless results settle immediately without introducing a
result queue',()=>{const {g,b,u}=arena();for(const x of
b.units)g.officer(x.id).hasHorse=true;g.battleAction('flee',{unit:u.id,confirmAr
my:true});;const
a=arena({reviewBattleResult:true});a.g.s.humanRulers=[];a.g.s.settings.battleVie
w='personal';a.b.outcome={winner:'attack',reason:'Unwatched
result'};a.g.finishBattle();;})
```

**Required output / success criteria**

```text
assert.equal(g.s.battle,null)
assert.equal(a.g.s.battle,null)
```

---

**Case / what it tests**

10. [Train excludes full-training armies and includes zero-men officers in the
resulting training update][test-source-435]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Train excludes full-training armies and includes zero-men officers in the
resulting training update',()=>{const g=fresh(),p=g.province(9);for(const id of
p.officers)Object.assign(g.officer(id),{soldiers:0,training:20,acted:false});con
st
trainer=g.officer(p.officers[0]),trained=g.officer(p.officers[1]);trained.soldie
rs=10000;trained.training=100;const
trainee=g.officer(p.officers[2]);trainee.soldiers=101;trainer.war=50;g.execute('
trainArmy',{province:9,officer:trainer.id});;;;})
```

**Required output / success criteria**

```text
assert.equal(trainer.training,100)
assert.equal(trainee.training,100)
assert.equal(trained.training,100)
```

---

**Case / what it tests**

11. [Give uses the local governor rather than a distant ruler for the loyalty
gain][test-source-436]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Give uses the local governor rather than a distant ruler for the loyalty
gain',()=>{const
g=fresh(),p=g.province(9),actor=g.officer(34);p.governor=33;g.officer(33).charm=
20;g.officer(g.ruler().leader).charm=100;actor.charm=20;;})
```

**Required output / success criteria**

```text
assert.equal(g.relief(p,actor,10000),giveFoodGain(p.population,20,20,10000,3))
```

---

**Case / what it tests**

12. [Battle HUD edits training and each army gold store within their native
capacities][test-source-437]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Battle HUD edits training and each army gold store within their native
capacities',()=>{const
{g,b,u}=arena();g.cheat('battle',u.id,{training:88,attackGold:12000,defendGold:2
2000});;;;})
```

**Required output / success criteria**

```text
assert.equal(u.training,88)
assert.deepEqual(b.gold,{attack:12000,defend:22000})
assert.throws(()=>g.cheat('battle',u.id,{defendGold:30001}))
```


<a id="tests-v34-tests-mjs"></a>
## tests/v34-tests.mjs

Source: [tests/v34-tests.mjs](../tests/v34-tests.mjs). Purpose: Defeated humans
choose individually after result; cancellation/invalid destinations do not roll
or mutate; Compulsory field retreat can fail without adjacent enemies, using
native flight rather than INT capture chance; No exit causes capture without
RNG, even for a mounted officer; friendly neighbours permit retreat; additional
cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/monthly-events.mjs`, `../mjs/battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Defeated humans choose individually after result; cancellation/invalid
destinations do not roll or mutate][test-source-438]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defeated humans choose individually after result; cancellation/invalid
destinations do not roll or mutate',()=>{const
{g,b}=battle();g.finishBattle();;;;const first=g.defeatedWithdrawal()[0];;const
before=JSON.stringify(g.s);;;g.officer(first.id).hasHorse=true;g.retreatDefeated
Unit(first.id,b.source);;;;validateSave(g.s,scenarios,g.terrains);const h=new
Game(validateSave(g.s,scenarios,g.terrains),{},g.terrains,{reviewBattleResult:tr
ue});const
next=h.defeatedWithdrawal()[0];h.officer(next.id).hasHorse=true;h.retreatDefeate
dUnit(next.id,b.source);;;;;validateSave(h.s,scenarios,h.terrains);})
```

**Required output / success criteria**

```text
assert(b.awaitingResult)
assert.equal(g.acknowledgeBattleResult(),false)
assert(b.resultReviewed)
assert(first)
assert.throws(()=>g.retreatDefeatedUnit(first.id,b.target))
assert.equal(JSON.stringify(g.s),before)
assert(first.fled)
assert(first.retreatProvince===b.source)
assert(g.defeatedWithdrawal().length===1)
assert(!h.defeatedWithdrawal().length)
assert(h.acknowledgeBattleResult())
assert(h.province(b.source).officers.includes(first.id))
assert(h.province(b.source).officers.includes(next.id))
```

---

**Case / what it tests**

2. [Compulsory field retreat can fail without adjacent enemies, using native
flight rather than INT capture chance][test-source-439]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Compulsory field retreat can fail without adjacent enemies, using native
flight rather than INT capture chance',()=>{const
{g,b}=battle();g.s.humanRulers=[];for(const u of
b.units.filter(u=>u.side==='attack'))Object.assign(u,{war:0,training:0,mobility:
0,soldiers:100,int:100});g.random=()=>.99;g.finishBattle();;;;validateSave(g.s,s
cenarios,g.terrains);})
```

**Required output / success criteria**

```text
assert(b.units.filter(u=>u.side==='attack').every(u=>u.captured&&!u.fled))
assert(b.messages.some(x=>x.text.includes('tried to flee — captured')))
assert(g.acknowledgeBattleResult())
```

---

**Case / what it tests**

3. [No exit causes capture without RNG, even for a mounted officer; friendly
neighbours permit retreat][test-source-440]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('No exit causes capture without RNG, even for a mounted officer; friendly
neighbours permit retreat',()=>{const {g,b}=battle();for(const id of
g.province(b.target).neighbors){const
p=g.province(id);p.owner=b.defender;for(const x of
p.officers)g.officer(x).owner=b.defender;}g.normalize();for(const u of
b.units.filter(u=>u.side==='attack'))g.officer(u.id).hasHorse=true;g.random=()=>
{throw Error('No escape roll without destination');};g.finishBattle();;;})
```

**Required output / success criteria**

```text
assert(b.units.filter(u=>u.side==='attack').every(u=>u.captured))
assert(b.messages.some(x=>x.text.includes('no adjacent')))
```

---

**Case / what it tests**

4. [Automatic field withdrawal prefers the original friendly province and does
not reroll on repeated finish/save-load][test-source-441]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Automatic field withdrawal prefers the original friendly province and does
not reroll on repeated finish/save-load',()=>{const
{g,b}=battle();g.s.humanRulers=[];for(const u of
b.units.filter(u=>u.side==='attack'))g.officer(u.id).hasHorse=true;g.finishBattl
e();;const before=JSON.stringify(b);g.random=()=>{throw Error('Disposed troops
must not roll again');};g.finishBattle();;new
Game(validateSave(g.s,scenarios,g.terrains),{},g.terrains,{reviewBattleResult:tr
ue});})
```

**Required output / success criteria**

```text
assert(b.units.filter(u=>u.side==='attack').every(u=>u.fled&&u.retreatProvince==
=b.source))
assert.equal(JSON.stringify(b),before)
```

---

**Case / what it tests**

5. [Governor rebellion cannot recycle the ruler ID of an active exile
party][test-source-442]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Governor rebellion cannot recycle the ruler ID of an active exile
party',()=>{const {g}=battle(false);g.s.battle=null;const
retired=g.ruler(12);for(const q of
g.s.provinces.filter(p=>p.owner===retired.id)){q.owner=255;q.officers=[];q.gover
nor=null;}for(let
id=0;id<16;id++)if(!g.ruler(id))g.s.rulers.push({id,leader:1,name:'Retired',alli
ances:[]});g.s.roaming.push({owner:retired.id,province:9,officers:[retired.leade
r],gold:0,food:0});const
leader=retired.leader,p=g.province(9);p.governor=33;disaster(g,p,'rebellion',{ev
ents:[],details:[]});;;})
```

**Required output / success criteria**

```text
assert.equal(g.ruler(retired.id).leader,leader)
assert.notEqual(p.owner,retired.id)
```


<a id="tests-v35-tests-mjs"></a>
## tests/v35-tests.mjs

Source: [tests/v35-tests.mjs](../tests/v35-tests.mjs). Purpose: Attacker F/R
counts original deployed units and arrived outside reinforcements only; Defender
F/R retains field units and undeployed local reserves; Governance art restores
instead of displaying an expired last event; previews and monthly events still
work; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle-summary.mjs`, `../mjs/battle.mjs`,
`../mjs/event-chronicle.mjs`, `../mjs/events.mjs`,
`../mjs/screen-wake-lock.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Attacker F/R counts original deployed units and arrived outside
reinforcements only][test-source-443]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Attacker F/R counts original deployed units and arrived outside
reinforcements only',()=>{ const
g=fresh();g.invade({province:9,target:8,officers:[0,34],governor:33,food:20000})
;const b=g.s.battle; ;; while(b.phase==='deployment')aiBattle(g); const
outside=g.province(9).neighbors.map(id=>g.province(id)).find(p=>p.id!==8&&p.offi
cers.length); const
arrived=newUnit(g,outside.officers[0],'attack',outside.id);arrived.placed=true;b
.units.push(arrived); const
enRoute=newUnit(g,outside.officers[1]??outside.officers[0],'attack',outside.id);
b.units.push(enRoute); let info=armySummary(g,b,'attack');;;
arrived.fled=true;info=armySummary(g,b,'attack');; const
reserves=g.province(9).officers.filter( … (complete input/procedure at linked
L11–21)
```

**Required output / success criteria**

```text
assert.equal(armySummary(g,b,'attack').generals,0)
assert.equal(armySummary(g,b,'attack').remaining,0)
assert.equal(info.generals,2)
assert.equal(info.remaining,1)
assert.equal(info.remaining,0)
assert(reserves.length)
assert.equal(info.remaining,0)
```

---

**Case / what it tests**

2. [Defender F/R retains field units and undeployed local
reserves][test-source-444]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Defender F/R retains field units and undeployed local reserves',()=>{
const
g=fresh();g.invade({province:9,target:8,officers:[0],governor:33,food:20000});co
nst b=g.s.battle,info=armySummary(g,b,'defend'); ;; })
```

**Required output / success criteria**

```text
assert.equal(info.generals,b.units.filter(u=>u.side==='defend').length)
assert.equal(info.remaining,g.province(8).officers.filter(id=>!b.units.some(u=>u
.id===id)).length)
```

---

**Case / what it tests**

3. [Governance art restores instead of displaying an expired last event;
previews and monthly events still work][test-source-445]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Governance art restores instead of displaying an expired last event;
previews and monthly events still work',()=>{ const
g=fresh();g.s.lastEvent={kind:'prison',title:'Old
interception',text:'Yesterday'}; ;;
g.s.eventPreview={kind:'war',title:'Preview',text:'Test'};;delete
g.s.eventPreview;
g.s.monthlyReview={index:0};g.s.lastReport={details:[{kind:'history',title:'Hist
orical event',text:'Current'}]};; })
```

**Required output / success criteria**

```text
assert.equal(eventFor(g).title,'Governance')
assert.deepEqual(eventFrame(eventFor(g)),{atlas:'events',cell:3})
assert.equal(eventFor(g).preview,true)
assert.equal(eventFor(g).kind,'history')
```

---

**Case / what it tests**

4. [Past nationwide and local logs are removed from checkpoints; current reports
survive reload][test-source-446]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Past nationwide and local logs are removed from checkpoints; current
reports survive reload',()=>{ const g=fresh();g.record('Old
history','history');g.s.month=2;g.record('Current history','history'); ;;
g.s.log.push({year:189,month:1,type:'history',text:'Legacy history'}); const
loaded=validateSave(g.s,scenarios,terrains);;; })
```

**Required output / success criteria**

```text
assert(g.s.log.every(x=>x.month===2))
assert(acrossChinaChronology(g).every(x=>x.month===2))
assert(loaded.log.every(x=>x.month===2))
assert(loaded.log.some(x=>x.text==='Current history'))
```

---

**Case / what it tests**

5. [Extended wars carry current report and valid war ID into the next month
without saving old history][test-source-447]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Extended wars carry current report and valid war ID into the next month
without saving old history',()=>{ const
g=fresh();g.invade({province:9,target:8,officers:[0],governor:33,food:20000});co
nst b=g.s.battle;extendWarReport(g,b);const war=b.chronicleWar;
g.s.month=2;prunePastEvents(g.s);;;;validateWarHistory(g.s);
g.s.battle=null;g.s.month=3;prunePastEvents(g.s);; })
```

**Required output / success criteria**

```text
assert.equal(g.s.warChronicle.length,1)
assert.equal(g.s.warChronicle[0].war,war)
assert.equal(g.s.warChronicle[0].month,2)
assert.equal(g.s.warChronicle.length,0)
```

---

**Case / what it tests**

6. [Dimming is disabled by default and explicit Menu preference survives
save/load][test-source-448]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Dimming is disabled by default and explicit Menu preference survives
save/load',()=>{ const g=fresh();;g.s.settings.allowScreenDimming=true;; delete
g.s.settings.allowScreenDimming;; })
```

**Required output / success criteria**

```text
assert.equal(g.s.settings.allowScreenDimming,false)
assert.equal(validateSave(g.s,scenarios,terrains).settings.allowScreenDimming,tr
ue)
assert.equal(validateSave(g.s,scenarios,terrains).settings.allowScreenDimming,fa
lse)
```

---

**Case / what it tests**

7. [Wake lock coalesces requests, releases when dimming is enabled and
reacquires after visibility loss][test-source-449]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Wake lock coalesces requests, releases when dimming is enabled and
reacquires after visibility loss',async()=>{ const
document={visibilityState:'visible'},locks=[],messages=[];let requests=0; const
navigator={wakeLock:{async request(type){;requests++;const
lock={released:false,listener:null,addEventListener(_,fn){this.listener=fn;},asy
nc release(){this.released=true;this.listener?.();}};locks.push(lock);return
lock;}}}; const
wake=createScreenWakeLock({navigator,document,onChange:x=>messages.push(x)});
await Promise.all([wake.setEnabled(true),wake.setEnabled(true)]);;;
document.visibilityState='hidden';await wake.setEnabled(true);;;
document.visibilityState='visible';await wake.setEnab … (complete
input/procedure at linked L47–55)
```

**Required output / success criteria**

```text
assert.equal(type,'screen')
assert.equal(requests,1)
assert(wake.active)
assert(locks[0].released)
assert(!wake.active)
assert.equal(requests,2)
assert(wake.active)
assert(locks[1].released)
assert(!wake.active)
assert.equal(messages.at(-1),'Screen dimming allowed.')
```

---

**Case / what it tests**

8. [A pending wake request is released if game exits before it
resolves][test-source-450]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A pending wake request is released if game exits before it
resolves',async()=>{ let resolve;const lock={released:false,async
release(){this.released=true;},addEventListener(){}}; const
wake=createScreenWakeLock({navigator:{wakeLock:{request:()=>new
Promise(r=>resolve=r)}},document:{visibilityState:'visible'}}); const
request=wake.setEnabled(true);await wake.setEnabled(false);resolve(lock);await
request;;; })
```

**Required output / success criteria**

```text
assert(lock.released)
assert(!wake.active)
```

---

**Case / what it tests**

9. [Unsupported or refused wake locks fail gracefully and permit a later gesture
retry][test-source-451]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Unsupported or refused wake locks fail gracefully and permit a later
gesture retry',async()=>{ const
messages=[],document={visibilityState:'visible'};const
unsupported=createScreenWakeLock({navigator:{},document,onChange:x=>messages.pus
h(x)});await unsupported.setEnabled(true);;; let requests=0;const
wake=createScreenWakeLock({navigator:{wakeLock:{async request(){requests++;throw
Error('Battery saver');}}},document,onChange:x=>messages.push(x)}); await
wake.setEnabled(true);await wake.setEnabled(true);;; })
```

**Required output / success criteria**

```text
assert(!unsupported.active)
assert(messages.at(-1).includes('unavailable'))
assert.equal(requests,2)
assert(messages.at(-1).includes('declined'))
```


<a id="tests-v36-tests-mjs"></a>
## tests/v36-tests.mjs

Source: [tests/v36-tests.mjs](../tests/v36-tests.mjs). Purpose: Campaign
summaries retain actual fates and omit empty categories and redundant cause;
Every historical scene is distinct, native high-resolution and uses the whole
image; Bad omen and gallop effects route through sound preferences and
visibility.

Shared inputs: `.mp3`, `./assets/sounds/audiomass-horse_gallop.mp3`.
Dependencies/entry points: `node:fs`, `node:assert/strict`, `node:crypto`,
`@napi-rs/canvas`, `../mjs/events.mjs`, `../mjs/history-art.mjs`,
`../mjs/artwork.mjs`, `../mjs/event-chronicle.mjs`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Campaign summaries retain actual fates and omit empty categories and
redundant cause][test-source-452]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Campaign summaries retain actual fates and omit empty categories and
redundant cause',()=>{ const
s={settings:{names:'english'}},row={year:189,month:1,source:9,target:10,attacker
:{name:'Cao Cao'},defender:{name:'Dong
Zhuo'},status:'won',rulerResult:'free',losingOwner:1,losingRuler:1,rulerPresent:
{defend:true},reason:'The opposing ruler was
captured.',fates:[{officer:2,name:'Jia
Xu',formerOwner:1,action:'recruit'},{officer:3,name:'Li
Ru',formerOwner:1,action:'recruit'},{officer:4,name:'Hu
Zhen',formerOwner:1,action:'free'}]}; ; row.fates.push({officer:5,name:'Niu
Fu',formerOwner:1,action:'behead'});;row.fates.push({officer:6,name:'Xu
Rong',formerOwner:1,action:'pending'});;; })
```

**Required output / success criteria**

```text
assert.equal(warReportText(s,row),'Jan 189 AD: Cao Cao #9 attacked Dong Zhuo
#10. Won. The opposing ruler was set free. The opposing generals were recruited:
Jia Xu, Li Ru. The opposing generals were set free — Hu Zhen.')
assert(warReportText(s,row).includes('beheaded — Niu Fu.'))
assert(warReportText(s,row).includes('Awaiting decisions — Xu Rong.'))
assert.equal(row.reason,'The opposing ruler was captured.')
```

---

**Case / what it tests**

2. [Every historical scene is distinct, native high-resolution and uses the
whole image][test-source-453]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every historical scene is distinct, native high-resolution and uses the
whole image',async()=>{ const hashes=new Set();for(const year of
[...HISTORY_YEARS,'Default']){ const
frame=eventFrame({kind:'history',historyYear:year}),file=historyArtworkFile(fram
e.atlas);;; const im=await
loadImage(file);;;hashes.add(crypto.createHash('sha256').update(fs.readFileSync(
file)).digest('hex')); const
c=createCanvas(600,200);c.getBoundingClientRect=()=>({width:600,height:200});con
st rect=paintAtlas(c,im,1,1,0);;;;; };;; })
```

**Required output / success criteria**

```text
assert(file)
assert.equal(frame.cell,0)
assert.equal(im.width,1983)
assert.equal(im.height,793)
assert.equal(rect.height,200)
assert(Math.abs(rect.width/rect.height-im.width/im.height)<1e-9)
assert(rect.x>0)
assert.equal(rect.y,0)
assert.equal(hashes.size,16)
assert.equal(historyArtworkFile('history1900'),null)
assert.equal(historyArtworkFile('portraits'),null)
```

---

**Case / what it tests**

3. [Bad omen and gallop effects route through sound preferences and
visibility][test-source-454]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Bad omen and gallop effects route through sound preferences and
visibility',()=>{ const
oldAudio=globalThis.Audio,oldDocument=globalThis.document,media=[];
globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};
globalThis.Audio=class{constructor(src){this.src=src;this.plays=0;media.push(thi
s);}play(){this.plays++;return Promise.resolve();}pause(){this.paused=true;}};
try{const bus=new
AudioBus();bus.setActive(true);bus.play('gallop');;bus.unlock(); for(const cue
of
['flood','locust','typhoon','epidemic','uprising','meteor','death']){bus.playEve
nt({kind:'month',art:cue});const
native={flood:2,locust:0,typhoon:2,epidemic:1,meteor:4};;;}
bus.play('gallop');;const … (complete input/procedure at linked L21–30)
```

**Required output / success criteria**

```text
assert.equal(media.length,3)
assert.equal(media.at(-1).src,'./assets/sounds/'+(cue in
native?'native-effect-'+native[cue]+'.mp3?v=56':cue+'.mp3'))
assert(fs.statSync('assets/sounds/'+cue+'.mp3').size>30000)
assert.equal(media.at(-1).src,'./assets/sounds/audiomass-horse_gallop.mp3')
assert.equal(media.length,n)
assert([...bus.effects].length===0)
assert.equal(media.length,n)
assert.equal(media.length,n)
```


<a id="tests-v38-tests-mjs"></a>
## tests/v38-tests.mjs

Source: [tests/v38-tests.mjs](../tests/v38-tests.mjs). Purpose: AI domestic
reports survive short-log eviction, monthly rollover and reload; only one
completed round is retained; A real AI governance action is logged nationally
with its actual faction; Li Su treasure is national, raises loyalty to 100 and
INT by the actual native capped gain; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`./assets/sounds/audiomass-horse_gallop.mp3`. Dependencies/entry points:
`node:fs`, `node:assert/strict`, `../mjs/strategy.mjs`,
`../mjs/event-chronicle.mjs`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [AI domestic reports survive short-log eviction, monthly rollover and reload;
only one completed round is retained][test-source-455]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI domestic reports survive short-log eviction, monthly rollover and
reload; only one completed round is retained',()=>{ const
g=fresh();g.s.log=[];g.s.currentReports=[];g.s.player=1;g.random=()=>.99;const
p=g.s.provinces.find(p=>p.owner===1),o=g.officer(p.governor);o.acted=false;p.lan
d=50;const message=g.execute('develop',{province:p.id,officer:o.id,amount:100});
;; for(let i=0;i<250;i++)g.record('Day '+(i%30+1)+': orders.','war');;;
g.endMonth();;;; const h=new
Game(validateSave(g.s,scenarios,terrain),{},terrain);;h.endMonth();;;; })
```

**Required output / success criteria**

```text
assert(acrossChinaChronology(g).some(e=>e.text===message))
assert(provinceCurrentEvents(g)[p.id-1].events.some(e=>e.text===message))
assert(!g.s.log.some(x=>x.text===message))
assert(acrossChinaChronology(g).some(e=>e.text===message))
assert.equal(g.s.month,2)
assert(acrossChinaChronology(g).some(e=>e.text===message&&e.month===1))
assert(provinceCurrentEvents(g)[p.id-1].events.some(e=>e.text===message))
assert(acrossChinaChronology(h).some(e=>e.text===message))
assert(!acrossChinaChronology(h).some(e=>e.text===message))
assert(!provinceCurrentEvents(h)[p.id-1].events.some(e=>e.text===message))
assert(!JSON.stringify(h.s).includes(message))
```

---

**Case / what it tests**

2. [A real AI governance action is logged nationally with its actual
faction][test-source-456]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A real AI governance action is logged nationally with its actual
faction',()=>{const g=fresh();g.s.player=1;g.s.ai.aggression=0;for(let
i=0;i<40&&!acrossChinaChronology(g).some(e=>e.ai);i++)g.aiStep();;})
```

**Required output / success criteria**

```text
assert(acrossChinaChronology(g).some(e=>e.ai&&e.actor===1))
```

---

**Case / what it tests**

3. [Li Su treasure is national, raises loyalty to 100 and INT by the actual
native capped gain][test-source-457]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Li Su treasure is national, raises loyalty to 100 and INT by the actual
native capped gain',()=>{ for(const roll of [0,.999]){const
g=fresh();g.s.player=8;g.s.humanRulers=[8];const
o=g.s.officers.find(x=>x.name==='Li
Su'),p=g.s.provinces.find(p=>p.officers.includes(o.id)),before=o.int;g.s.spoils=
[{owner:8,province:p.id,item:'heavenbook'}];g.random=()=>roll;const
text=g.decideSpoils('protect',o.id);;;;;;const
s=validateSave(g.s,scenarios,terrain);;;} const
g=fresh(),o=g.officer(34);o.int=98;g.s.spoils=[{owner:0,province:9,item:'heavenb
ook'}];g.random=()=>.999;g.decideSpoils('protect',34);;; })
```

**Required output / success criteria**

```text
assert.equal(o.loyalty,100)
assert.equal(o.int,before+(roll===0?5:9))
assert(text.includes('INT +'+(o.int-before)))
assert(acrossChinaChronology(g).some(e=>e.text===text))
assert(!provinceCurrentEvents(g)[p.id-1].events.some(e=>e.text===text))
assert.equal(s.officers[o.id].int,o.int)
assert.equal(s.items[0].gain,o.int-before)
assert.equal(o.int,100)
assert.equal(g.s.items[0].gain,2)
```

---

**Case / what it tests**

4. [Outbound capture is checked; a released messenger travels back without
capture or capture RNG][test-source-458]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Outbound capture is checked; a released messenger travels back without
capture or capture RNG',()=>{ const
g=fresh();g.s.humanRulers=g.s.rulers.map(r=>r.id);g.execute('diplomaticMission',
{province:9,mode:'gift',target:3,officer:34,amount:100});g.random=()=>0;let
captured=0; for(let
i=0;i<60&&g.s.journey?.phase==='outbound';i++){if(g.s.journey.interception){capt
ured++;;g.interceptJourney('free');}else
if(g.s.journey.proposal)g.answerProposal(true);else g.advanceJourney();} ;;const
seed=g.s.seed;g.random=()=>{throw Error('Return trip must not roll for
interception');};for(let i=0;i<60&&g.s.journey;i++){g.advanceJourney();;};; })
```

**Required output / success criteria**

```text
assert(!g.journeyMotion)
assert(captured>0)
assert.equal(g.s.journey.phase,'return')
assert(!g.s.journey?.interception)
assert(!g.s.journey)
assert.equal(g.s.seed,seed)
```

---

**Case / what it tests**

5. [Gallop starts once for motion, stops for detention/rest, and respects
mute/visibility][test-source-459]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Gallop starts once for motion, stops for detention/rest, and respects
mute/visibility',()=>{ const
oldAudio=globalThis.Audio,oldDocument=globalThis.document,media=[];globalThis.do
cument={hidden:false,addEventListener(){},removeEventListener(){}};globalThis.Au
dio=class{constructor(src){this.src=src;media.push(this);}play(){this.played=tru
e;return Promise.resolve();}pause(){this.paused=true;}}; try{const bus=new
AudioBus;bus.setActive(true);bus.unlock();bus.setCourierMoving(false);;bus.setCo
urierMoving(true);const
first=media.at(-1);;;bus.setCourierMoving(true);;bus.setCourierMoving(false);;;b
us.setCourierMoving(true);const
second=media.at(-1);document.hidden=true;bus.sync();;document.hi … (complete
input/procedure at linked L25–28)
```

**Required output / success criteria**

```text
assert.equal(media.length,3)
assert.equal(first.src,'./assets/sounds/audiomass-horse_gallop.mp3')
assert(first.loop)
assert.equal(media.length,4)
assert(first.paused)
assert(!bus.courierEffect)
assert(second.paused)
assert(!bus.courierEffect)
```


<a id="tests-v39-tests-mjs"></a>
## tests/v39-tests.mjs

Source: [tests/v39-tests.mjs](../tests/v39-tests.mjs). Purpose: Inspection
chooses the next eligible unit and preserves campaign bytes and RNG; Jungle
diagnostics use real weighted lanes and mark the preferred middle forest; Hidden
invaders cannot appear in forest forecasts or inflate lane scores; additional
cases below.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `node:assert/strict`, `@napi-rs/canvas`,
`../mjs/ai-diagnostics.mjs`, `../mjs/battle.mjs`, `../mjs/ai-parameters.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Inspection chooses the next eligible unit and preserves campaign bytes and
RNG][test-source-460]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Inspection chooses the next eligible unit and preserves campaign bytes and
RNG',()=>{ const
g=fixture(),before=JSON.stringify(g.s),d=battleAIDiagnostics(g);;;
g.s.battle.units[2].ordered=true;;; })
```

**Required output / success criteria**

```text
assert.equal(d.unit.id,3)
assert.equal(JSON.stringify(g.s),before)
assert.equal(battleAIDiagnostics(g).unit.id,4)
assert.equal(battleAIDiagnostics(g,'1').unit.id,1)
```

---

**Case / what it tests**

2. [Jungle diagnostics use real weighted lanes and mark the preferred middle
forest][test-source-461]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Jungle diagnostics use real weighted lanes and mark the preferred middle
forest',()=>{ const
d=battleAIDiagnostics(fixture(),3),middle=d.jungles.find(c=>c.q===6&&c.r===5),of
f=d.jungles.find(c=>c.q===1&&c.r===5); ;;;;; })
```

**Required output / success criteria**

```text
assert(middle.lane>.6)
assert.equal(off.lane,0)
assert.deepEqual(d.goal,{q:6,r:5})
assert(d.route.path.length)
assert(d.affordable.length<=d.route.path.length)
```

---

**Case / what it tests**

3. [Hidden invaders cannot appear in forest forecasts or inflate lane
scores][test-source-462]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hidden invaders cannot appear in forest forecasts or inflate lane
scores',()=>{ const
g=fixture(),u=g.s.battle.units[1];u.q=11;u.r=0;g.s.battle.terrain[u.r*13+u.q]=1;
const d=battleAIDiagnostics(g,3);; })
```

**Required output / success criteria**

```text
assert.deepEqual(d.forecasts.map(x=>x.unit.id),[1])
```

---

**Case / what it tests**

4. [Route overlay follows a distant mountain gap and highlights only affordable
hexes][test-source-463]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Route overlay follows a distant mountain gap and highlights only
affordable hexes',()=>{ const
g=fixture(),b=g.s.battle;b.side='attack';b.terrain=Array(156).fill(0);b.palace={
q:10,r:2};b.terrain[2*13+10]=6;
Object.assign(b.units[0],{q:3,r:4});Object.assign(b.units[1],{q:2,r:0});Object.a
ssign(b.units[2],{q:11,r:8});Object.assign(b.units[3],b.palace); for(let
r=0;r<11;r++)b.terrain[r*13+5]=3; const d=battleAIDiagnostics(g,1);;;; ;; })
```

**Required output / success criteria**

```text
assert(d.route)
assert(d.route.path.some(c=>c.q===5&&c.r===11))
assert(d.route.path.every(c=>b.terrain[c.r*13+c.q]!==3))
assert(d.route.path.length>d.affordable.length)
assert(d.affordable.reduce((n,c)=>n+terrainCost(b.terrain[c.r*13+c.q]),0)<=6)
```

---

**Case / what it tests**

5. [Palace holding and adjacent attacks are described instead of claiming a
move][test-source-464]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Palace holding and adjacent attacks are described instead of claiming a
move',()=>{ const g=fixture();let d=battleAIDiagnostics(g,4);;;
Object.assign(g.s.battle.units[0],{q:6,r:6});; d=battleAIDiagnostics(g,3);;; })
```

**Required output / success criteria**

```text
assert.equal(d.route,null)
assert.match(d.reason,/Palace guard/)
assert.equal(distance(g.s.battle.units[0],g.s.battle.units[2]),1)
assert.equal(d.route,null)
assert.match(d.reason,/Adjacent attack/)
```

---

**Case / what it tests**

6. [Inspection is unavailable during placement/results, and blocked forests
remain identified][test-source-465]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Inspection is unavailable during placement/results, and blocked forests
remain identified',()=>{ const g=fixture();g.s.battle.fire[5*13+6]=2;;
g.s.battle.phase='deployment';;;
g.s.battle.phase='battle';g.s.battle.outcome={winner:'attack'};; })
```

**Required output / success criteria**

```text
assert(battleAIDiagnostics(g,3).jungles.find(c=>c.q===6&&c.r===5).blocked)
assert.deepEqual(diagnosticUnits(g),[])
assert.equal(battleAIDiagnostics(g),null)
assert.equal(battleAIDiagnostics(g),null)
```

---

**Case / what it tests**

7. [Real canvas draws independent overlays at landscape sizes without changing
diagnostic data][test-source-466]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Real canvas draws independent overlays at landscape sizes without changing
diagnostic data',()=>{ const
d=battleAIDiagnostics(fixture(),3),before=JSON.stringify(d); for(const
[width,height]of [[640,393],[426,270],[1100,700]])for(const
[showPaths,showJungles]of [[true,false],[false,true],[true,true]]){ const
canvas=createCanvas(width,height),ctx=canvas.getContext('2d'),scale=Math.min((wi
dth-32)/20,(height-62)/22),screen=p=>({x:width/2+p.x*scale,y:height/2+p.z*scale}
);
drawAIDiagnostics(ctx,{...d,showPaths,showJungles},{screen,scale,width,height});
; } ; })
```

**Required output / success criteria**

```text
assert(canvas.toBuffer('image/png').length>1000)
assert.equal(JSON.stringify(d),before)
```


<a id="tests-v42-tests-mjs"></a>
## tests/v42-tests.mjs

Source: [tests/v42-tests.mjs](../tests/v42-tests.mjs). Purpose: A spent human
order selects the next ready general; inspection preserves every order and
mobility; Normal, Charge and simultaneous cues retain all involved units at
their pre-combat positions; A defeated target remains in the visual cue without
resolving combat again; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../docs/native-fire-v42.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle.mjs`,
`../mjs/ai-diagnostics.mjs`, `../mjs/ai-battle.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [A spent human order selects the next ready general; inspection preserves
every order and mobility][test-source-467]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A spent human order selects the next ready general; inspection preserves
every order and mobility',()=>{const
{g,b,u,f,v}=arena();g.battleAction('wait',{unit:u.id});;const
orders=b.units.map(x=>[x.id,x.ordered,x.mobility,x.orderDay]);for(const target
of
[u.id,f.id,v.id])g.battleAction('view',{target});;;g.battleAction('wait',{unit:f
.id});;})
```

**Required output / success criteria**

```text
assert.equal(b.selected,f.id)
assert.equal(b.selected,f.id)
assert.deepEqual(b.units.map(x=>[x.id,x.ordered,x.mobility,x.orderDay]),orders)
assert(f.ordered)
```

---

**Case / what it tests**

2. [Normal, Charge and simultaneous cues retain all involved units at their
pre-combat positions][test-source-468]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Normal, Charge and simultaneous cues retain all involved units at their
pre-combat positions',()=>{for(const action of
['attack','charge','simultaneous']){const
{g,b,u,f,v}=arena(),before=b.units.map(x=>({id:x.id,q:x.q,r:x.r,side:x.side,sold
iers:x.soldiers}));g.battleAction(action,{unit:u.id,target:v.id});const
ids=action==='simultaneous'?[u.id,f.id,v.id]:[u.id,v.id];;validateSave(g.s,scena
rios,g.terrains);}})
```

**Required output / success criteria**

```text
assert.deepEqual(b.lastAction.combatUnits,ids.map(id=>before.find(x=>x.id===id))
)
```

---

**Case / what it tests**

3. [A defeated target remains in the visual cue without resolving combat
again][test-source-469]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A defeated target remains in the visual cue without resolving combat
again',()=>{const
{g,b,u,v}=arena();v.soldiers=1;g.battleAction('attack',{unit:u.id,target:v.id});
;;;})
```

**Required output / success criteria**

```text
assert(v.routed)
assert.equal(b.lastAction.combatUnits.find(x=>x.id===v.id).soldiers,1)
assert.equal(b.lastAction.combatUnits.length,2)
```

---

**Case / what it tests**

4. [Hidden jungle positions do not alter routes, movement previews or route
forecasts][test-source-470]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Hidden jungle positions do not alter routes, movement previews or route
forecasts',()=>{const
{g,b,u,f,v,king}=arena();Object.assign(u,{q:0,r:0});Object.assign(f,{q:0,r:1});O
bject.assign(king,{q:12,r:11});b.terrain[4*13]=b.terrain[8*13+8]=1;Object.assign
(v,{q:0,r:4});;const
route=planBattleRoute(b,u),moves=reachable(b,u),forecast=projectedAttackRoutes(b
,[v]),diagnostic=battleAIDiagnostics(g,u.id);Object.assign(v,{q:8,r:8});;;;;;;})
```

**Required output / success criteria**

```text
assert(!visibleUnit(b,v,u.side))
assert(!visibleUnit(b,v,u.side))
assert.deepEqual(planBattleRoute(b,u),route)
assert.deepEqual(reachable(b,u),moves)
assert.deepEqual(projectedAttackRoutes(b,[v]),forecast)
assert.deepEqual(battleAIDiagnostics(g,u.id),diagnostic)
assert.deepEqual(planBattleRoute(b,u,[v]),route)
```

---

**Case / what it tests**

5. [An attempted route stops when movement reveals a jungle enemy; it never
walks over that enemy][test-source-471]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An attempted route stops when movement reveals a jungle enemy; it never
walks over that enemy',()=>{const
{g,b,u,f,v,king}=arena();Object.assign(f,{q:0,r:0});Object.assign(king,{q:12,r:1
1});Object.assign(v,{q:6,r:4});b.terrain[v.r*13+v.q]=1;u.int=100;;const
move=reachable(b,u).find(c=>c.q===6&&c.r===3);;g.battleAction('move',{unit:u.id,
q:move.q,r:move.r});;;;})
```

**Required output / success criteria**

```text
assert(!visibleUnit(b,v,u.side))
assert(move)
assert.equal(distance(u,v),1)
assert(visibleUnit(b,v,u.side))
assert.notDeepEqual({q:u.q,r:u.r},{q:move.q,r:move.r})
```

---

**Case / what it tests**

6. [A revealed jungle enemy is attacked from equal/better cover and avoided from
water][test-source-472]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A revealed jungle enemy is attacked from equal/better cover and avoided
from water',()=>{for(const terrain of [0,2,4,5,6]){const
{g,b,u,f,v}=arena();Object.assign(f,{q:0,r:0});b.terrain[u.r*13+u.q]=terrain;b.t
errain[v.r*13+v.q]=1;;v.revealedTo=[u.side];;const
held={q:u.q,r:u.r},men=v.soldiers;aiBattle(g,60);;;;}})
```

**Required output / success criteria**

```text
assert(!visibleUnit(b,v,u.side))
assert(visibleUnit(b,v,u.side))
assert.equal(b.lastAction.type,terrain===4?'wait':'attack')
assert.deepEqual({q:u.q,r:u.r},held)
assert.equal(v.soldiers===men,terrain===4)
```

---

**Case / what it tests**

7. [Recovered fire priorities escape a burning palace, approach a dry palace, or
finish a weak commander][test-source-473]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Recovered fire priorities escape a burning palace, approach a dry palace,
or finish a weak commander',()=>{const native=JSON.parse(fs.readFileSync(new
URL('../docs/native-fire-v42.json',import.meta.url)));for(const c of
native.cases){const
{b,u,f,v,king}=arena();Object.assign(u,{q:c.at[0],r:c.at[1],soldiers:c.men});Obj
ect.assign(f,{q:0,r:0});Object.assign(king,{q:12,r:11});Object.assign(v,c.enemy?
{q:c.enemy.at[0],r:c.enemy.at[1],soldiers:c.enemy.men}:{q:11,r:10});const
side=c.nativeArmySlot===0?'defend':'attack',other=side==='attack'?'defend':'atta
ck';u.side=f.side=b.side=side;v.side=king.side=other;b.leaders[other]=v.id;b.lea
ders[side]=u.id;b.terrain=Array(156).fill(0);b.palace={q:c.p … (complete
input/procedure at linked L15–15)
```

**Required output / success criteria**

```text
assert.equal(order.action,c.fireFallback?'wait':c.target?'attack':'move',c.name)
assert.equal(distance(u,order),1)
assert(!b.fire[order.r*13+order.q])
assert.equal(distance(order,b.palace),c.name.includes('empty')?0:1)
assert.equal(order.target,v.id)
```

---

**Case / what it tests**

8. [Fire escape precedes ordinary palace holding and jungle wait
decisions][test-source-474]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Fire escape precedes ordinary palace holding and jungle wait
decisions',()=>{const
{g,b,u,f,v}=arena();Object.assign(f,{q:0,r:0});b.fire={[u.r*13+u.q]:3};b.terrain
[u.r*13+u.q]=4;b.terrain[v.r*13+v.q]=1;aiBattle(g,60);;;const
defended=arena();defended.b.side='defend';defended.b.selected=defended.king.id;d
efended.king.war=100;defended.b.palace={q:defended.king.q,r:defended.king.r};def
ended.b.terrain[155]=0;defended.b.terrain[defended.king.r*13+defended.king.q]=6;
defended.b.fire={[defended.king.r*13+defended.king.q]:3};aiBattle(defended.g,60)
;;;;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.type,'move')
assert(!b.fire[u.r*13+u.q])
assert.equal(defended.b.lastAction.unit,defended.king.id)
assert.equal(defended.b.lastAction.type,'move')
assert(!defended.b.fire[defended.king.r*13+defended.king.q])
```

---

**Case / what it tests**

9. [HUD explains blocked fire escape instead of replacing it with a generic
route message][test-source-475]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('HUD explains blocked fire escape instead of replacing it with a generic
route message',()=>{const
{g,b,u,f,v}=arena();Object.assign(f,{q:0,r:0});Object.assign(v,{q:11,r:10});b.fi
re={[u.r*13+u.q]:3};for(const n of neighbors(u.q,u.r))b.fire[n.r*13+n.q]=3;;})
```

**Required output / success criteria**

```text
assert.equal(battleAIDiagnostics(g,u.id).reason,'No affordable dry neighbour;
waiting in fire.')
```


<a id="tests-v43-tests-mjs"></a>
## tests/v43-tests.mjs

Source: [tests/v43-tests.mjs](../tests/v43-tests.mjs). Purpose: Native fire
ignition is below 5%, later burning orders below 30%, equally for both
controllers; Inspection and army handoff never trigger fire damage; Wait on
burning ground does; Rain at day change extinguishes fire before spread;
preceding orders still suffer fire; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../docs/native-turns-v43.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle.mjs`,
`../mjs/ai-battle.mjs`, `../mjs/ai-diagnostics.mjs`,
`../mjs/battle-presentation.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Native fire ignition is below 5%, later burning orders below 30%, equally
for both controllers][test-source-476]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native fire ignition is below 5%, later burning orders below 30%, equally
for both controllers',()=>{;;for(const human of [[],[0],[1]]){const
{g,b,u,v}=arena();g.s.humanRulers=human;u.int=100;let
ignitionRolls=[.5,.5,0,.5];g.random=()=>ignitionRolls.shift()??.5;g.battleAction
('fireball',{unit:u.id,q:v.q,r:v.r});;;;g.battleAction('end');;g.battleAction('w
ait',{unit:v.id});;;}})
```

**Required output / success criteria**

```text
assert.equal(fireLoss(5000,.5,1),125)
assert.equal(fireLoss(5000,.5),750)
assert.equal(v.soldiers,4875)
assert.equal(v.weapons,4875)
assert(b.fire[v.r*13+v.q])
assert.equal(v.soldiers,4875)
assert.equal(v.soldiers,4144)
assert(b.messages.some(m=>m.text.includes('after the order')))
```

---

**Case / what it tests**

2. [Inspection and army handoff never trigger fire damage; Wait on burning
ground does][test-source-477]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Inspection and army handoff never trigger fire damage; Wait on burning
ground does',()=>{const {g,b,u}=arena();b.fire[u.r*13+u.q]=3;const
before=u.soldiers;g.battleAction('view',{target:u.id});;g.battleAction('wait',{u
nit:u.id});;g.battleAction('end');;})
```

**Required output / success criteria**

```text
assert.equal(u.soldiers,before)
assert.equal(u.soldiers,4250)
assert.equal(u.soldiers,4250)
```

---

**Case / what it tests**

3. [Rain at day change extinguishes fire before spread; preceding orders still
suffer fire][test-source-478]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rain at day change extinguishes fire before spread; preceding orders still
suffer fire',()=>{const
{g,b,u,v}=arena();b.fire[u.r*13+u.q]=b.fire[v.r*13+v.q]=3;g.random=()=>.9;g.batt
leAction('end');;;g.battleAction('end');;;;g.battleAction('wait',{unit:u.id});;}
)
```

**Required output / success criteria**

```text
assert.equal(u.soldiers,3650)
assert.equal(v.soldiers,5000)
assert.equal(v.soldiers,3650)
assert.equal(b.weather,'rain')
assert.deepEqual(b.fire,{})
assert.equal(u.soldiers,3650)
```

---

**Case / what it tests**

4. [Five banked mobility points traverse plain and jungle in one order; four
cannot][test-source-479]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Five banked mobility points traverse plain and jungle in one order; four
cannot',()=>{const
{g,b,u,v}=arena();Object.assign(v,{q:12,r:10});b.terrain[6*13+6]=1;u.mobility=4;
;u.mobility=5;const
move=reachable(b,u).find(p=>p.q===6&&p.r===6);;;g.battleAction('move',{unit:u.id
,q:6,r:6});;;})
```

**Required output / success criteria**

```text
assert(!reachable(b,u).some(p=>p.q===6&&p.r===6))
assert.equal(move.cost,5)
assert.equal(move.path.length,2)
assert.equal(u.mobility,0)
assert.equal(u.r,6)
```

---

**Case / what it tests**

5. [Deployment No resets only the current army and Yes still requires every unit
placed][test-source-480]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Deployment No resets only the current army and Yes still requires every
unit placed',()=>{const
{g,b}=arena();b.phase='deployment';b.deployment={attack:true,defend:false};b.sid
e='defend';const
attackers=structuredClone(b.units.filter(u=>u.side==='attack'));g.battleAction('
resetDeployment');;;;while(b.phase==='deployment')aiBattle(g);;;})
```

**Required output / success criteria**

```text
assert(b.units.filter(u=>u.side==='defend').every(u=>!u.placed&&u.q===null&&u.r=
==null))
assert.deepEqual(b.units.filter(u=>u.side==='attack'),attackers)
assert.throws(()=>g.battleAction('deploy'))
assert.equal(b.side,'defend')
assert.equal(b.phase,'battle')
```

---

**Case / what it tests**

6. [AI action and auto HUD use the same strongest ready general without spending
RNG][test-source-481]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI action and auto HUD use the same strongest ready general without
spending RNG',()=>{const {g,b,u,f}=arena();u.war=10;f.war=100;const
seed=g.s.seed;;g.s.ai.intelligence=90;;;aiBattle(g,90);;;})
```

**Required output / success criteria**

```text
assert.equal(nextAIUnit(g,90).id,f.id)
assert.equal(battleAIDiagnostics(g).unit.id,f.id)
assert.equal(g.s.seed,seed)
assert.equal(b.lastAction.unit,f.id)
assert(f.ordered)
```

---

**Case / what it tests**

7. [Simultaneous helpers and target retain their own orders under the corrected
native controller audit][test-source-482]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Simultaneous helpers and target retain their own orders under the
corrected native controller audit',()=>{const
{g,b,u,f,v}=arena();Object.assign(f,{q:7,r:3});g.battleAction('simultaneous',{un
it:u.id,target:v.id});;;;g.battleAction('wait',{unit:f.id});;g.battleAction('end
');;;})
```

**Required output / success criteria**

```text
assert(u.ordered&&!f.ordered&&!v.ordered)
assert.equal(u.orderDay,b.day)
assert.equal(f.orderDay,0)
assert(f.ordered)
assert.equal(b.side,'defend')
assert(!v.ordered)
```

---

**Case / what it tests**

8. [Recorded native fire arithmetic remains equal to the executable
witness][test-source-483]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Recorded native fire arithmetic remains equal to the executable
witness',()=>{const native=JSON.parse(fs.readFileSync(new
URL('../docs/native-turns-v43.json',import.meta.url)));for(const c of
native.cases.filter(c=>c.rule==='Fire damage'));})
```

**Required output / success criteria**

```text
assert.equal(fireLoss(c.men,c.randomFraction,c.mode),c.loss)
```

---

**Case / what it tests**

9. [Requested animation duration depends on attack type and never changes battle
arithmetic][test-source-484]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Requested animation duration depends on attack type and never changes
battle arithmetic',()=>{for(const [type,cycles]of
[['attack',8],['simultaneous',8],['charge',80]]){;;}})
```

**Required output / success criteria**

```text
assert.equal(combatAnimationCycles({type}),cycles)
assert.equal(combatAnimationDuration({type}),cycles*(type==='charge'?75:375)+(ty
pe==='charge'?1300:0))
```

---

**Case / what it tests**

10. [Every reported captive has a pending decision; five reported captives
receive five decisions through save/load][test-source-485]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Every reported captive has a pending decision; five reported captives
receive five decisions through save/load',()=>{const {g,b}=arena();const
target=g.province(b.target),extra=g.s.officers.filter(o=>!o.dead&&!b.units.some(
u=>u.id===o.id)&&!g.s.rulers.some(r=>r.leader===o.id)&&!target.officers.includes
(o.id)).slice(0,2);for(const o of extra){for(const p of g.s.provinces)for(const
key of
['officers','unclaimed','hidden'])p[key]=p[key].filter(id=>id!==o.id);o.owner=b.
defender;target.officers.push(o.id);}g.normalize();;for(const u of
b.units.filter(u=>u.side==='defend')){u.captured=true;u.routed=true;}g.random=()
=>0;b.outcome={winner:'attack',reason:'Test palace victory'};g.resolveBattle( …
(complete input/procedure at linked L19–19)
```

**Required output / success criteria**

```text
assert.equal(target.officers.length,5)
assert.deepEqual(new Set(g.s.lastBattle.captured),new
Set(g.s.captiveDecisions.map(c=>c.officer)))
assert.equal(g.s.triumph.captured,g.s.captiveDecisions.length)
assert.equal(g.s.triumph.captured,5)
assert.equal(restored.s.captiveDecisions.length,5)
assert.equal(restored.s.captiveDecisions.length,0)
```


<a id="tests-v44-tests-mjs"></a>
## tests/v44-tests.mjs

Source: [tests/v44-tests.mjs](../tests/v44-tests.mjs). Purpose: Without
extensions, governance and battlefield dispatch preserve Legacy state and random
draws exactly; Importing weights never activates them; global/ruler overrides
and Legacy rollback are independent; Schema, unknown domains, executable-looking
data, weight bounds and obsolete rules cannot be imported; additional cases
below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/ai-governance.mjs`, `../mjs/ai-battle.mjs`,
`../mjs/ai-profile.mjs`, `../mjs/ai-extensions.mjs`, `../mjs/ai-simulation.mjs`,
`../mjs/ai-planner-governance.mjs`, `../mjs/ai-planner-battlefield.mjs`,
`../tools/ai-training-engine.mjs`, `../tools/ai-training-game.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Without extensions, governance and battlefield dispatch preserve Legacy
state and random draws exactly][test-source-486]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Without extensions, governance and battlefield dispatch preserve Legacy
state and random draws exactly',()=>{for(const domain of
['governance','battlefield']){const
g=domain==='governance'?fresh():arena().g,a=forkAI(g),b=forkAI(g);if(domain==='g
overnance')aiGovernance(a);else aiBattle(a,90);runAIExtension(b,domain,90);;;}})
```

**Required output / success criteria**

```text
assert.deepEqual(a.s,b.s)
assert(!g.s.aiExtensions)
```

---

**Case / what it tests**

2. [Importing weights never activates them; global/ruler overrides and Legacy
rollback are independent][test-source-487]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Importing weights never activates them; global/ruler overrides and Legacy
rollback are independent',()=>{const
g=fresh();importAIProfiles(g,{schema:1,profiles:[profile('governance'),profile('
battlefield')]});;setAIMode(g,'governance','trained');;setAIMode(g,'governance',
'legacy',0);;;setAIMode(g,'governance','inherit',0);;setAIMode(g,'governance','l
egacy');;})
```

**Required output / success criteria**

```text
assert.equal(aiMode(g,'governance'), 'legacy')
assert.equal(aiMode(g,'governance',0),'trained')
assert.equal(aiMode(g,'governance',0),'legacy')
assert.equal(aiMode(g,'battlefield',0),'legacy')
assert.equal(aiMode(g,'governance',0),'trained')
assert.equal(aiMode(g,'governance',0),'legacy')
```

---

**Case / what it tests**

3. [Schema, unknown domains, executable-looking data, weight bounds and obsolete
rules cannot be imported][test-source-488]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Schema, unknown domains, executable-looking data, weight bounds and
obsolete rules cannot be imported',()=>{const
g=fresh(),before=JSON.stringify(g.s);for(const edit of
[p=>p.rulesId='0'.repeat(64),p=>p.schema=99,p=>p.domain='__proto__',p=>p.weights
.food='run()',p=>p.weights.food=Infinity,p=>p.weights.food=13,p=>p.weights.extra
=1]){const p=profile('governance');edit(p);;;}})
```

**Required output / success criteria**

```text
assert.throws(()=>importAIProfiles(g,p))
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

4. [Outdated profiles in a saved campaign fall back to Legacy without losing the
campaign][test-source-489]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Outdated profiles in a saved campaign fall back to Legacy without losing
the campaign',()=>{const
g=fresh();importAIProfiles(g,profile('governance'));setAIMode(g,'governance','tr
ained');g.s.aiExtensions.profiles.governance.rulesId='0'.repeat(64);const
save=validateSave(g.s,scenarios,terrains);;;;})
```

**Required output / success criteria**

```text
assert.equal(save.aiExtensions.defaults.governance,'legacy')
assert.equal(save.provinces[8].gold,g.s.provinces[8].gold)
assert.equal(save.aiExtensions.profiles.governance.rulesId,'0'.repeat(64))
```

---

**Case / what it tests**

5. [Shadow comparisons and planner previews preserve all campaign bytes, order
flags and live randomness][test-source-490]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Shadow comparisons and planner previews preserve all campaign bytes, order
flags and live randomness',()=>{for(const domain of
['governance','battlefield']){const
g=domain==='governance'?fresh():arena().g;importAIProfiles(g,profile(domain));co
nst before=JSON.stringify(g.s);let calls=0;g.random=()=>{calls++;return
.1;};const
c=compareAI(g,domain);;aiPlan(g,domain);;;g.s.aiExtensions.shadow=true;const
a=forkAI(g),b=forkAI(g);delete
a.s.aiExtensions;runAIExtension(a,domain,90);runAIExtension(b,domain,90);delete
b.s.aiExtensions;;}})
```

**Required output / success criteria**

```text
assert(c.trained&&c.legacy)
assert.equal(calls,0)
assert.equal(JSON.stringify(g.s),before)
assert.deepEqual(b.s,a.s)
```

---

**Case / what it tests**

6. [Governance lookahead buys scarce food rather than spending the reserve on
unrelated development][test-source-491]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Governance lookahead buys scarce food rather than spending the reserve on
unrelated development',()=>{const
g=fresh(),p=g.province(9),model=profile('governance');p.neighbors=[];p.food=1000
;p.gold=1000;p.merchant=true;p.land=p.flood=p.loyalty=100;p.unclaimed=[];for(con
st id of p.officers){const
o=g.officer(id);o.training=o.loyalty=100;o.weapons=o.soldiers;}model.weights.foo
d=12;model.weights.gold=.05;const plan=planGovernance(g,model);;;const
before=p.food;g.execute(plan.order.action,plan.order.args);;;})
```

**Required output / success criteria**

```text
assert.equal(plan.order.action,'trade')
assert.equal(plan.order.args.mode,'buy')
assert(p.food>before)
assert(p.gold<1000)
```

---

**Case / what it tests**

7. [Governance selects the officer/order pair with the greater actual
province-wide training gain][test-source-492]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Governance selects the officer/order pair with the greater actual
province-wide training gain',()=>{const
g=fresh(),p=g.province(9);p.neighbors=[];p.gold=0;p.merchant=false;p.food=10000;
p.unclaimed=[];p.land=p.flood=p.loyalty=100;for(const id of p.officers){const
o=g.officer(id);o.loyalty=100;o.training=20;o.acted=id!==0&&id!==34;}Object.assi
gn(g.officer(0),{int:100,war:1,charm:1});Object.assign(g.officer(34),{int:1,war:
100,charm:100});const plan=planGovernance(g,profile('governance'));;;})
```

**Required output / success criteria**

```text
assert.equal(plan.order.action,'trainArmy')
assert.equal(plan.order.args.officer,34)
```

---

**Case / what it tests**

8. [A low-WAR unit can take an immediate palace win before a stronger teammate;
highlight follows the planned actor][test-source-493]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A low-WAR unit can take an immediate palace win before a stronger
teammate; highlight follows the planned actor',()=>{const
{g,b,u,f}=arena();Object.assign(f,{q:12,r:10,war:1,mobility:3});u.war=100;import
AIProfiles(g,profile('battlefield'));setAIMode(g,'battlefield','trained');const
plan=aiPlan(g,'battlefield');;;;runAIExtension(g,'battlefield',90);;;})
```

**Required output / success criteria**

```text
assert.equal(plan.order.action,'move')
assert.equal(plan.order.args.unit,f.id)
assert.equal(policyBattleUnit(g).id,f.id)
assert.equal(g.s.lastBattle.winner,'attack')
assert.equal(g.s.lastBattle.reason,'The palace was occupied.')
```

---

**Case / what it tests**

9. [Concealed positions and previous hidden action coordinates cannot change the
trained plan or its sample seed][test-source-494]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Concealed positions and previous hidden action coordinates cannot change
the trained plan or its sample seed',()=>{const
{g,b,v}=arena();Object.assign(v,{q:0,r:10});b.terrain[10*13]=b.terrain[10*13+12]
=1;b.lastAction={type:'move',unit:v.id,q:0,r:10};const
p=profile('battlefield'),a=battlefieldObservation(g),plan=planBattlefield(g,p);O
bject.assign(v,{q:12,r:10});b.lastAction.q=12;;;})
```

**Required output / success criteria**

```text
assert.deepEqual(battlefieldObservation(g),a)
assert.deepEqual(planBattlefield(g,p),plan)
```

---

**Case / what it tests**

10. [A trained battle order applies the identical engine outcome once, including
simultaneous participant costs][test-source-495]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A trained battle order applies the identical engine outcome once,
including simultaneous participant costs',()=>{const
{g}=arena();importAIProfiles(g,profile('battlefield'));setAIMode(g,'battlefield'
,'trained');const
plan=aiPlan(g,'battlefield'),expected=forkAI(g);expected.battleAction(plan.order
.action,plan.order.args);runAIExtension(g,'battlefield',90);;})
```

**Required output / success criteria**

```text
assert.deepEqual(g.s,expected.s)
```

---

**Case / what it tests**

11. [The game-independent trainer is reproducible, learns from fixed outcome
feedback and reports small samples honestly][test-source-496]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('The game-independent trainer is reproducible, learns from fixed outcome
feedback and reports small samples honestly',()=>{const
adapter={weights:{a:1,b:1},evaluate:(w,e)=>({score:-(((w?.a??1)-e.target)**2)})}
,episodes=[{target:2},{target:2.5}],options={seed:123,generations:4,population:4
,episodes};const
a=trainWeights(adapter,options),b=trainWeights(adapter,options);;;const
report=comparisonReport(a.evaluation,evaluateWeights(adapter,null,episodes));;;}
)
```

**Required output / success criteria**

```text
assert.deepEqual(a,b)
assert(a.evaluation.score>evaluateWeights(adapter,adapter.weights,episodes).scor
e)
assert.equal(report.approximateMean95,null)
assert(report.interpretation.includes('Small'))
```

---

**Case / what it tests**

12. [Reusable adapters construct real, reproducible scenario episodes and paired
battlefield roles][test-source-497]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Reusable adapters construct real, reproducible scenario episodes and
paired battlefield roles',()=>{for(const domain of
['governance','battlefield']){const
options={seed:987,count:2,months:1},a=buildTrainingEpisodes(domain,options),b=bu
ildTrainingEpisodes(domain,options);;;;;}})
```

**Required output / success criteria**

```text
assert.deepEqual(a,b)
assert.equal(a.length,domain==='battlefield'?4:2)
assert(a.every(e=>e.state.humanRulers.length===0))
assert(TRAINING_ADAPTERS[domain].evaluate)
```

---

**Case / what it tests**

13. [Trained shadow execution retains both recommendations and no extra live
order][test-source-498]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Trained shadow execution retains both recommendations and no extra live
order',()=>{const
{g}=arena();importAIProfiles(g,profile('battlefield'));setAIMode(g,'battlefield'
,'trained');g.s.aiExtensions.shadow=true;const
expected=forkAI(g),plan=aiPlan(g,'battlefield');expected.battleAction(plan.order
.action,plan.order.args);runAIExtension(g,'battlefield',90);;;;})
```

**Required output / success criteria**

```text
assert(g.aiComparison.legacy)
assert(g.aiComparison.trained)
assert.deepEqual(g.s,expected.s)
```

---

**Case / what it tests**

14. [Paired battlefield roles count once for uncertainty and never manufacture a
narrow per-match interval][test-source-499]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Paired battlefield roles count once for uncertainty and never manufacture
a narrow per-match interval',()=>{const
trained={score:2,results:Array.from({length:40},(_,i)=>({seed:Math.floor(i/2),sc
ore:2,result:i%2?0:1}))},legacy={score:1,results:trained.results.map(r=>({...r,s
core:1}))},report=comparisonReport(trained,legacy);;;;;})
```

**Required output / success criteria**

```text
assert.equal(report.episodes,40)
assert.equal(report.independentSeeds,20)
assert.equal(report.approximateMean95,null)
assert.equal(report.battles.decisiveWinRate95,null)
```


<a id="tests-v45-tests-mjs"></a>
## tests/v45-tests.mjs

Source: [tests/v45-tests.mjs](../tests/v45-tests.mjs). Purpose: Backward finish
and expansion states are valid, repeatable, cover all six scenarios and preserve
source data; Opening curriculum retains precisely the existing campaign
scenarios and their shortage variants; Governance simulations ignore All
battles, never call detailed orders and preserve the input save and RNG;
additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`config/ai-profiles/battlefield-v44.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `node:child_process`, `../mjs/strategy.mjs`,
`../mjs/ai-profile.mjs`, `../tools/ai-training-game.mjs`,
`../tools/governance-conquest.mjs`, `../tools/ai-training-engine.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Backward finish and expansion states are valid, repeatable, cover all six
scenarios and preserve source data][test-source-500]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Backward finish and expansion states are valid, repeatable, cover all six
scenarios and preserve source data',()=>{const
original=JSON.stringify(scenarios);for(const [stage,count]of
[['finish',38],['expand',24]]){const
options={stage,seed:11001,count:6,months:1},a=buildConquestEpisodes(options),b=b
uildConquestEpisodes(options);;for(const e of
a){;;;validateSave(e.state,scenarios,terrains);;;}};})
```

**Required output / success criteria**

```text
assert.deepEqual(a,b)
assert.equal(e.state.provinces.filter(p=>p.owner===e.owner).length,count)
assert.equal(e.state.provinces.filter(p=>p.owner===255).length,1)
assert(e.state.provinces.some(p=>p.owner!==e.owner&&p.owner!==255))
assert.equal(e.state.settings.battleView,'personal')
assert.equal(e.state.humanRulers.length,0)
assert.equal(JSON.stringify(scenarios),original)
```

---

**Case / what it tests**

2. [Opening curriculum retains precisely the existing campaign scenarios and
their shortage variants][test-source-501]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Opening curriculum retains precisely the existing campaign scenarios and
their shortage variants',()=>{const
options={seed:13001,count:6,months:1},old=buildTrainingEpisodes('governance',opt
ions),next=buildConquestEpisodes({...options,stage:'opening'});;})
```

**Required output / success criteria**

```text
assert.deepEqual(next.map(({stage,...e})=>e),old)
```

---

**Case / what it tests**

3. [Governance simulations ignore All battles, never call detailed orders and
preserve the input save and RNG][test-source-502]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Governance simulations ignore All battles, never call detailed orders and
preserve the input save and RNG',()=>{const
e=buildConquestEpisodes({stage:'expand',seed:11001,count:1,months:1})[0];e.state
.settings.battleView='all';const
original=JSON.stringify(e),a=evaluateConquest(null,e),b=evaluateConquest(null,e)
;;;for(const r of [a,b])delete r.meanDecisionMs;;;})
```

**Required output / success criteria**

```text
assert.equal(a.detailedActions,0)
assert(a.abstractBattles>0)
assert.deepEqual(a,b)
assert.equal(JSON.stringify(e),original)
```

---

**Case / what it tests**

4. [An invasion of a zero-soldier garrison is an instant result, not a detailed
battlefield][test-source-503]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An invasion of a zero-soldier garrison is an instant result, not a
detailed battlefield',()=>{const
e=buildConquestEpisodes({stage:'opening',seed:33566239,count:1,months:1})[0];for
(const p of e.state.provinces.filter(p=>p.owner!==e.owner))for(const id of
p.officers)e.state.officers[id].soldiers=0;const
r=evaluateConquest(AI_WEIGHTS.governance,e);;;;})
```

**Required output / success criteria**

```text
assert(r.instantBattles>0)
assert.equal(r.detailedActions,0)
assert.equal(conquestSummary([r]).instantBattles,r.instantBattles)
```

---

**Case / what it tests**

5. [All 41 provinces must be united to claim success; a strong unfinished empire
receives no win][test-source-504]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All 41 provinces must be united to claim success; a strong unfinished
empire receives no win',()=>{const
e=buildConquestEpisodes({stage:'finish',seed:10001,count:1,months:1})[0],unfinis
hed=evaluateConquest(null,e);;;const s=structuredClone(e.state);for(const p of
s.provinces){p.owner=e.owner;delete
p.delegation;p.delegate='manual';if(!p.officers.length){const
donor=s.provinces.find(q=>q.officers.length>1&&q.id!==p.id),id=donor.officers.fi
nd(id=>id!==s.rulers[0].leader);donor.officers=donor.officers.filter(n=>n!==id);
p.officers=[id];p.governor=id;}for(const id of
p.officers)s.officers[id].owner=e.owner;}for(const r of
s.rulers)if(r.advisor!==null&&s.officers[r.advisor].owner!==r.id)r.ad …
(complete input/procedure at linked L13–13)
```

**Required output / success criteria**

```text
assert.equal(unfinished.won,false)
assert.equal(unfinished.cappedMonths,2)
assert.equal(result.won,true)
assert.equal(result.lost,false)
assert.equal(result.metrics.provinces,41)
assert.equal(result.elapsedMonths,0)
assert(result.score>unfinished.score)
```

---

**Case / what it tests**

6. [Early elimination cannot masquerade as a quick
conquest][test-source-505]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Early elimination cannot masquerade as a quick conquest',()=>{const
e=buildConquestEpisodes({stage:'opening',seed:11001,count:1,months:3})[0];for(co
nst p of e.state.provinces.filter(p=>p.owner===e.owner)){p.owner=1;for(const id
of
p.officers)e.state.officers[id].owner=1;}e.state.rulers[0].advisor=null;e.state.
rulers[0].extinct=true;const r=evaluateConquest(null,e);;;;;})
```

**Required output / success criteria**

```text
assert.equal(r.won,false)
assert.equal(r.lost,true)
assert.equal(r.cappedMonths,4)
assert.equal(r.score,-1000)
```

---

**Case / what it tests**

7. [Conquest ranking prioritizes success, then capped completion time, ahead of
any supporting score][test-source-506]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Conquest ranking prioritizes success, then capped completion time, ahead
of any supporting score',()=>{const
row=(won,months,score)=>({won,lost:false,elapsedMonths:months,cappedMonths:won?m
onths:13,score,metrics:{provinces:won?41:38},shortageMonths:0,abstractBattles:0,
detailedActions:0}),a={score:-1000,results:[row(true,12,-1000)]},b={score:999999
,results:[row(false,0,999999)]};;;;;})
```

**Required output / success criteria**

```text
assert(compareConquest(a,b)>0)
assert(compareConquest({score:-100,results:[row(true,2,-100)]},a)>0)
assert.equal(conquestSummary(b.results).meanMonthsToVictory,null)
assert.equal(conquestSummary(b.results).unfinished,1)
```

---

**Case / what it tests**

8. [The shared numerical optimizer obeys conquest ranking without changing its
default scalar behavior][test-source-507]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('The shared numerical optimizer obeys conquest ranking without changing its
default scalar behavior',()=>{const
row=(wins,score)=>({won:wins,lost:false,elapsedMonths:1,cappedMonths:wins?1:4,sc
ore,metrics:{provinces:wins?41:1},shortageMonths:0,abstractBattles:0,detailedAct
ions:0}),adapter={weights:{army:1},evaluate:(w)=>row(w.army!==1,w.army===1?9999:
-9999),compare:compareConquest},r=trainWeights(adapter,{seed:1,generations:1,pop
ulation:1,episodes:[{}]});;;})
```

**Required output / success criteria**

```text
assert.notEqual(r.weights.army,1)
assert.equal(r.evaluation.results[0].won,true)
```

---

**Case / what it tests**

9. [Supply and production guidance saturate; disconnected hoards do not increase
readiness without an army][test-source-508]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Supply and production guidance saturate; disconnected hoards do not
increase readiness without an army',()=>{const
e=buildConquestEpisodes({stage:'opening',seed:11001,count:1,months:1})[0],g=game
For(e.state),p=g.province(g.ruler(e.owner).home);for(const id of
p.officers)g.officer(id).soldiers=0;for(const q of
g.s.provinces.filter(q=>q.owner===e.owner)){q.gold=30000;q.food=3000000;}const
a=conquestFeatures(g,e.owner);p.gold=15000;p.food=1500000;const
b=conquestFeatures(g,e.owner);;;;for(const v of Object.values(a));})
```

**Required output / success criteria**

```text
assert.equal(a.sustainability,1)
assert.equal(b.sustainability,1)
assert.equal(a.readiness,b.readiness)
assert(Number.isFinite(v))
```

---

**Case / what it tests**

10. [Conquest profiles reuse the existing safe import and keep both policy
choices on Legacy][test-source-509]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Conquest profiles reuse the existing safe import and keep both policy
choices on Legacy',()=>{const
e=buildConquestEpisodes({stage:'opening',seed:11001,count:1,months:1})[0],g=game
For(e.state),p=profileFor('governance',AI_WEIGHTS.governance,'Conquest
test');p.training={objective:'governance-conquest-v1',battleResolution:'abstract
',automaticActivation:false};validateAIProfile(p);importAIProfiles(g,p);;;})
```

**Required output / success criteria**

```text
assert.equal(aiMode(g,'governance'),'legacy')
assert.equal(aiMode(g,'battlefield'),'legacy')
```

---

**Case / what it tests**

11. [Conquest CLI rejects overlapping seeds, invalid horizons and battlefield
warm starts before training][test-source-510]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Conquest CLI rejects overlapping seeds, invalid horizons and battlefield
warm starts before training',()=>{for(const extra of
[['--seed','1','--holdout-seed','1'],['--months','0'],['--from','config/ai-profi
les/battlefield-v44.json']]){const
r=spawnSync(process.execPath,['tools/train-governance.mjs','--out','/tmp/rtk2-in
valid-conquest','--generations','0','--episodes','1','--holdout-episodes','1',..
.extra],{encoding:'utf8'});;;}})
```

**Required output / success criteria**

```text
assert.notEqual(r.status,0)
assert(!fs.existsSync('/tmp/rtk2-invalid-conquest'))
```


<a id="tests-v47-tests-mjs"></a>
## tests/v47-tests.mjs

Source: [tests/v47-tests.mjs](../tests/v47-tests.mjs). Purpose: all 16 ownership
fills match the native ruler table, without modulo colour collisions; captured,
released, executed, recruited, killed, returned and unknown commander fates,
including Chinese names and follow-up reviews.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../docs/native-display-v47.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle-summary.mjs`,
`../mjs/raster-world.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [all 16 ownership fills match the native ruler table, without modulo colour
collisions][test-source-511]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const scenarios=JSON.parse(fs.readFileSync(new
URL('../config/scenarios.json',import.meta.url))),terrains=JSON.parse(fs.readFil
eSync(new URL('../config/province-terrain.json',import.meta.url))); const
native=JSON.parse(fs.readFileSync(new
URL('../docs/native-display-v47.json',import.meta.url))); ;;;;
```

**Required output / success criteria**

```text
assert.deepEqual(ownershipPalette,native.colors.map(row=>row.solidColor))
assert.equal(new Set(ownershipPalette).size,16)
assert.equal(ownershipColor(255),'#a0aaa4')
assert.equal(ownershipColor(16),'#a0aaa4')
```

---

**Case / what it tests**

2. [captured, released, executed, recruited, killed, returned and unknown
commander fates, including Chinese names and follow-up
reviews][test-source-512]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const human of [[],[0]])for(const view of ['personal','all'])for(const
winner of ['attack','defend']){ const
s=createCampaign(scenarios[0],human);s.seed=1;const g=new
Game(s,{},structuredClone(terrains));g.s.settings.battleView='all';g.invade({pro
vince:9,target:8,governor:33,officers:[0,34],food:20000});const
b=g.s.battle;g.s.settings.battleView=view;g.random=()=>0;b.outcome={winner,reaso
n:'Controlled display regression'};g.resolveBattle(); const
row=pendingBattleResult(g);;const
before=JSON.stringify(g.s),copy=battleResultCopy(g,row);;;;;if(g.s.triumph);
reviewBattleResult(g,row);;; if(g.s.triumph)g.acknowledgeTriumph();
console.log(`PASS ${human.length?'human':'spectator'} / ${view}  … (complete
input/procedure at linked L7–18)
```

**Required output / success criteria**

```text
assert(row)
assert.equal(JSON.stringify(g.s),before)
assert(copy.outcome.includes(row.attacker.name)&&copy.outcome.includes(row.defen
der.name))
assert(copy.commander.includes(row.commanders[winner==='attack'?'defend':'attack
'].name))
assert.equal(copy.title,winner==='attack'?'Attack victorious':'Attack defeated')
assert.equal(triumphBattleResult(g),row)
assert.equal(pendingBattleResult(g),null)
assert.deepEqual(validateSave(g.s,scenarios,terrains).battleResultReviews,g.s.ba
ttleResultReviews)
assert.equal(pendingBattleResult(g),row)
assert(battleResultCopy(g,row).commander.includes(word))
assert.equal(pendingBattleResult(g),null)
assert(battleResultCopy(g,row).outcome.includes('曹操'))
assert(battleResultCopy(g,row).commander.includes('李傕'))
```


<a id="tests-v48-tests-mjs"></a>
## tests/v48-tests.mjs

Source: [tests/v48-tests.mjs](../tests/v48-tests.mjs). Purpose: two concealed
jungle enemies both apply native ambush loss and produce separate animations in
all six directions and both column parities; charge marches through offset
hexes, plays eight flashes per charge exchange on the defender tile, returns on
failure and follows resolved occupation or breakthrough; a real failed charge
retains its source tile and its animation returns to that same tile; additional
cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle.mjs`, `../mjs/native-combat.mjs`,
`../mjs/battle-presentation.mjs`, `../mjs/events.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [two concealed jungle enemies both apply native ambush loss and produce
separate animations in all six directions and both column
parities][test-source-513]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const scenarios=JSON.parse(fs.readFileSync(new
URL('../config/scenarios.json',import.meta.url))),terrains=JSON.parse(fs.readFil
eSync(new URL('../config/province-terrain.json',import.meta.url))); function
arena(){const g=new
Game(createCampaign(scenarios[0],[0]),{},structuredClone(terrains));g.s.settings
.battleView='all';g.invade({province:9,target:8,governor:33,officers:[0,34],food
:20000});while(g.s.battle.phase==='deployment')aiBattle(g,60);const
b=g.s.battle,u=b.units.find(u=>u.id===0),f=b.units.find(u=>u.id===34),enemies=b.
units.filter(u=>u.side==='defend');b.units=[u,f,...enemies.slice(0,2)];b.side='a
ttack';b.selected=u.id;b.terrain=Array(156).fill(0);b.terrain[155]=6;b.palace={q
:12,r:11 … (complete input/procedure at linked L1–15)
```

**Required output / success criteria**

```text
assert(cells.length>=2)
assert.equal(visibleUnit(b,v),false)
assert.equal(u.soldiers,expected.soldiers)
assert.equal(u.weapons,expected.weapons)
assert.equal(animations.length,2)
assert.deepEqual(new Set(animations.map(a=>a.unit)),new
Set(enemies.map(v=>v.id)))
assert(enemies.every(v=>!v.ordered&&v.mobility===10))
assert.equal(combatAnimationDuration(a),3000)
assert.equal(JSON.stringify(g.s),state)
assert.equal(g.s.seed,seed)
```

---

**Case / what it tests**

2. [charge marches through offset hexes, plays eight flashes per charge exchange
on the defender tile, returns on failure and follows resolved occupation or
breakthrough][test-source-514]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const from of [{q:6,r:4},{q:7,r:4}])for(let d=0;d<6;d++){ const
target=direction(from.q,from.r,d),action={type:'charge',unit:1,target:2,combatUn
its:[{id:1,...from},{id:2,...target}],landing:{...from}}; ;;const
middle=chargePosition(action,{id:1},325),a=tilePoint(from.q,from.r),z=tilePoint(
target.q,target.r);;; for(let cycle=0;cycle<80;cycle++){;;;}
;action.landing={...target};;action.landing=direction(target.q,target.r,d);; }
```

**Required output / success criteria**

```text
assert.equal(combatAnimationDuration(action),7300)
assert.deepEqual(chargePosition(action,{id:1},0),{...tilePoint(from.q,from.r),wa
lk:true})
assert.equal(middle.x,(a.x+z.x)/2)
assert.equal(middle.z,(a.z+z.z)/2)
assert.equal(combatAnimationPhase(action,650+cycle*75).cycle,cycle+1)
assert.equal(combatAnimationPhase(action,688+cycle*75).frame,1)
assert.deepEqual(chargePosition(action,{id:1},650+cycle*75),{...z,walk:false})
assert.deepEqual(chargePosition(action,{id:1},7300),{...a,walk:true})
assert.deepEqual(chargePosition(action,{id:1},7300),{...z,walk:false})
assert.deepEqual(chargePosition(action,{id:1},7300),{...tilePoint(action.landing
.q,action.landing.r),walk:true})
```

---

**Case / what it tests**

3. [a real failed charge retains its source tile and its animation returns to
that same tile][test-source-515]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; { const
{g,b,u,enemies}=arena(),target=enemies[0];Object.assign(u,{q:6,r:4,war:0});Objec
t.assign(target,{q:7,r:4,war:0});Object.assign(enemies[1],{q:0,r:11});act(g,'cha
rge',{unit:u.id,target:target.id});;;;const
action={...b.lastAction,landing:{q:u.q,r:u.r}};; }
```

**Required output / success criteria**

```text
assert(target.soldiers>0&&u.soldiers>0)
assert.deepEqual({q:u.q,r:u.r},{q:6,r:4})
assert(!b.lastChargeLanding)
assert.deepEqual(chargePosition(action,u,7300),{...tilePoint(6,4),walk:true})
```

---

**Case / what it tests**

4. [injury presentation keeps recovery information and removes redundant zero
impacts without changing the saved event][test-source-516]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const g=new
Game(createCampaign(scenarios[0],[0]),{},terrains),injury={kind:'month',art:'med
ical',title:'Battle injury · Chenliu',province:9,text:'Cao Hong was injured in
battle. Recovery expected in 3 months. Impact: people 0 unchanged; soldiers 0
unchanged; gold 0 unchanged; food 0 unchanged; land 0 unchanged; flood control 0
unchanged.',impact:{people:0,soldiers:0,gold:0,food:0,land:0,flood:0}}; const
before=JSON.stringify(injury);;;;
```

**Required output / success criteria**

```text
assert.equal(presentEvent(g,injury).text,'Cao Hong was injured in battle.
Recovery expected in 3 months.')
assert.equal(JSON.stringify(injury),before)
assert(presentEvent(g,{...injury,art:'flood',title:'Flood'}).text.includes('Impa
ct:'))
```


<a id="tests-v49-tests-mjs"></a>
## tests/v49-tests.mjs

Source: [tests/v49-tests.mjs](../tests/v49-tests.mjs). Purpose: Both outcomes
land remaining field food/gold at the battlefield; winning armies carry their
own equipment; Native treasury caps apply to combined stores after either
result; Weapons purchases are INT-independent and allow a final partially filled
lot; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `../mjs/war-provisions.mjs`, `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle.mjs`,
`../mjs/ai-battle.mjs`, `../mjs/ai-planner-battlefield.mjs`,
`../mjs/ai-profile.mjs`, `../mjs/order-availability.mjs`,
`../mjs/ai-planner-governance.mjs`, `../mjs/game-ui.mjs`,
`../mjs/advice-topics.mjs`, `../mjs/battle-presentation.mjs`,
`../mjs/officer-roster.mjs`, `../mjs/portraits.mjs`,
`../mjs/campaign-completion.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Both outcomes land remaining field food/gold at the battlefield; winning
armies carry their own equipment][test-source-517]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Both outcomes land remaining field food/gold at the battlefield; winning
armies carry their own equipment',()=>{for(const winner of
['attack','defend']){const
{g,b,u}=arena(),source=g.province(b.source),target=g.province(b.target),before={
gold:source.gold,food:source.food};b.food={attack:12345,defend:54321};b.outcome=
{winner,reason:'Test
settlement'};g.resolveBattle();;;;;if(winner==='attack'){;;;;}validateSave(g.s,s
cenarios,terrains);}})
```

**Required output / success criteria**

```text
assert.equal(source.gold,before.gold)
assert.equal(source.food,before.food)
assert.equal(target.gold,579)
assert.equal(target.food,66666)
assert(target.officers.includes(u.id))
assert.equal(g.officer(u.id).weapons,4000)
assert.equal(g.officer(u.id).soldiers,5000)
assert.equal(g.officer(u.id).training,52)
```

---

**Case / what it tests**

2. [Native treasury caps apply to combined stores after either
result][test-source-518]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native treasury caps apply to combined stores after either
result',()=>{for(const winner of ['attack','defend']){const
{g,b}=arena();b.gold={attack:25000,defend:25000};b.food={attack:2000000,defend:2
000000};b.outcome={winner,reason:'Test caps'};g.resolveBattle();;;}})
```

**Required output / success criteria**

```text
assert.equal(g.province(8).gold,30000)
assert.equal(g.province(8).food,3000000)
```

---

**Case / what it tests**

3. [Weapons purchases are INT-independent and allow a final partially filled
lot][test-source-519]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Weapons purchases are INT-independent and allow a final partially filled
lot',()=>{for(const int of [0,40,80,100])for(const weapons of
[0,9899,9900,9999]){const
g=fresh(),p=g.province(9),actor=g.officer(34),recipient=g.officer(33);p.merchant
=true;actor.int=int;recipient.weapons=weapons;const
before=p.gold,max=100-Math.floor(weapons/100),message=g.execute('trade',{provinc
e:9,officer:34,recipient:33,mode:'arms',amount:max});;;;}})
```

**Required output / success criteria**

```text
assert.equal(recipient.weapons,10000)
assert.equal(p.gold,before-max)
assert(message.includes(String(10000-weapons)))
```

---

**Case / what it tests**

4. [Merchant availability and trained candidates admit the native final partial
weapons lot][test-source-520]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Merchant availability and trained candidates admit the native final
partial weapons lot',()=>{const
g=fresh(),p=g.province(9);g.s.monthlyReview=null;p.merchant=true;for(const id of
p.officers)Object.assign(g.officer(id),{weapons:10000,soldiers:0});const
o=g.officer(34);Object.assign(o,{soldiers:10000,weapons:9999,war:100,training:10
0});;;o.weapons=10000;;})
```

**Required output / success criteria**

```text
assert.equal(orderUnavailable(g,p,'trade:arms'),null)
assert(governanceCandidates(g,AI_WEIGHTS.governance).some(c=>c.action==='trade'&
&c.args.mode==='arms'&&c.args.recipient===34&&c.args.amount===1))
assert(orderUnavailable(g,p,'trade:arms'))
```

---

**Case / what it tests**

5. [Give and development advice find the cheapest native capped maximum under
the selected actor][test-source-521]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Give and development advice find the cheapest native capped maximum under
the selected actor',()=>{const
g=fresh(),p=g.province(9);g.ruler().advisor=33;g.officer(33).int=100;g.s.monthly
Advice.intelligence[33]=100;p.loyalty=99;p.population=100000;p.food=10000;const
best=bestOrderSpend(g,'Give',34);;;for(let
amount=1;amount<best.amount;amount++);;p.land=99;const
development=bestOrderSpend(g,'Cultivate',34);;;p.loyalty=100;;})
```

**Required output / success criteria**

```text
assert.equal(best.gain,1)
assert(best.amount<10000)
assert(g.preview('relief',9,34,amount)<best.gain)
assert(orderInsight(g,'Give food to the people',34).includes('using
'+best.amount.toLocaleString()+' food'))
assert.equal(development.gain,1)
assert(orderInsight(g,'Cultivate',34,{amount:100}).includes('smaller amount'))
assert(orderInsight(g,'Give',34).includes('give no food'))
```

---

**Case / what it tests**

6. [Gold advice preserves random bonus and cap, and council text refreshes after
loyalty changes][test-source-522]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Gold advice preserves random bonus and cap, and council text refreshes
after loyalty changes',()=>{const
g=fresh(),p=g.province(9);g.ruler().advisor=33;g.officer(33).int=100;g.s.monthly
Advice.intelligence[33]=100;for(const id of
p.officers)g.officer(id).loyalty=100;g.officer(34).loyalty=99;const
best=bestOrderSpend(g,'Reward',34);;;const text=orderInsight(g,'Reward ·
Gold',34,{amount:100});;;;g.officer(34).loyalty=100;;const
spy=adviceTopic(g,p,'spy');;;})
```

**Required output / success criteria**

```text
assert.equal(best.gain,1)
assert(best.amount<100)
assert(text.includes('99 → 100–100'))
assert(text.includes('smaller recommended amount'))
assert(!adviceTopic(g,p,'officers').includes('dependable'))
assert(adviceTopic(g,p,'officers').includes('all subordinates have loyalty
100'))
assert(!spy.includes('loyalty is strong'))
assert(spy.includes('does not lower loyalty'))
```

---

**Case / what it tests**

7. [Jungle relocation cannot reveal a new position to Legacy routes or trained
observations/plans][test-source-523]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Jungle relocation cannot reveal a new position to Legacy routes or trained
observations/plans',()=>{const
{g,b,u,v}=arena();Object.assign(v,{q:7,r:4});b.terrain[4*13+7]=b.terrain[5*13+7]
=1;b.lastKnown.attack[v.id]={q:7,r:4};;const
model={schema:1,policyVersion:AI_POLICY_VERSION,id:'v49-test',name:'v49',domain:
'battlefield',rulesId:AI_RULES_ID,weights:structuredClone(AI_WEIGHTS.battlefield
)},before=JSON.stringify(g.s),observation=battlefieldObservation(g),route=planBa
ttleRoute(b,u),moves=reachable(b,u),plan=planBattlefield(g,model);;Object.assign
(v,{q:7,r:5});;;;;;;})
```

**Required output / success criteria**

```text
assert(!visibleUnit(b,v,'attack'))
assert.equal(JSON.stringify(g.s),before)
assert(!visibleUnit(b,v,'attack'))
assert.deepEqual(battlefieldObservation(g),observation)
assert.deepEqual(planBattleRoute(b,u),route)
assert.deepEqual(reachable(b,u),moves)
assert.deepEqual(planBattlefield(g,model),plan)
assert.deepEqual(blindAttackOrder(b,u),{action:'attack',q:7,r:4})
```

---

**Case / what it tests**

8. [Blind jungle attack can miss the remembered hex and spends an order without
harming the relocated enemy][test-source-524]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Blind jungle attack can miss the remembered hex and spends an order
without harming the relocated enemy',()=>{const
{g,b,u,v}=arena();b.terrain[4*13+7]=b.terrain[5*13+7]=1;b.lastKnown.attack[v.id]
={q:7,r:4};Object.assign(v,{q:7,r:5});const men=v.soldiers;const
message=act(g,'attack',{unit:u.id,q:7,r:4});;;;;;})
```

**Required output / success criteria**

```text
assert(message.includes('no enemy was there'))
assert.equal(v.soldiers,men)
assert(u.ordered)
assert(!visibleUnit(b,v,u.side))
assert.equal(b.lastKnown.attack[v.id],undefined)
```

---

**Case / what it tests**

9. [Blind attack at an occupied hidden jungle reveals only the contacted enemy
and uses normal combat][test-source-525]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Blind attack at an occupied hidden jungle reveals only the contacted enemy
and uses normal combat',()=>{const
{g,b,u,v}=arena();b.terrain[v.r*13+v.q]=1;;act(g,'attack',{unit:u.id,q:v.q,r:v.r
});;;;})
```

**Required output / success criteria**

```text
assert(!visibleUnit(b,v,u.side))
assert(visibleUnit(b,v,u.side))
assert(u.ordered)
assert(v.soldiers<5000)
```

---

**Case / what it tests**

10. [Human pull uses actor movement MP, accepts equal INT, and leaves enemy MP
untouched even after failure][test-source-526]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human pull uses actor movement MP, accepts equal INT, and leaves enemy MP
untouched even after failure',()=>{for(const roll of [0,.5]){const
{g,u,v}=arena();g.random=()=>roll;const
mp=v.mobility;act(g,'moveEnemy',{unit:u.id,target:v.id,q:6,r:5});;;;;;}})
```

**Required output / success criteria**

```text
assert.deepEqual({q:u.q,r:u.r},{q:6,r:5})
assert.equal(u.mobility,3)
assert.equal(v.mobility,mp)
assert.deepEqual({q:v.q,r:v.r},roll===0?{q:6,r:4}:{q:7,r:4})
assert(u.ordered)
```

---

**Case / what it tests**

11. [AI ordinary movement opportunistically pulls strictly lower INT enemies,
never equals or palace occupants][test-source-527]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('AI ordinary movement opportunistically pulls strictly lower INT enemies,
never equals or palace occupants',()=>{for(const [enemyINT,palace,success]of
[[69,false,true],[70,false,false],[69,true,false]]){const
{g,b,u,v}=arena();g.s.humanRulers=[];v.int=enemyINT;if(palace){b.palace={q:v.q,r
:v.r};b.terrain[v.r*13+v.q]=6;}const
mp=v.mobility;act(g,'move',{unit:u.id,q:6,r:5});;;}})
```

**Required output / success criteria**

```text
assert.deepEqual({q:v.q,r:v.r},success?{q:6,r:4}:{q:7,r:4})
assert.equal(v.mobility,mp)
```

---

**Case / what it tests**

12. [Invalid enemy selection costs no MP and does not change
state][test-source-528]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Invalid enemy selection costs no MP and does not change state',()=>{const
{g,b,u,v}=arena();v.q=10;const before=JSON.stringify(b);;;})
```

**Required output / success criteria**

```text
assert.throws(()=>act(g,'moveEnemy',{unit:u.id,target:v.id,q:6,r:5}))
assert.equal(JSON.stringify(b),before)
```

---

**Case / what it tests**

13. [An empty burning palace destroys 30% defender stores daily; rain cancels
the penalty][test-source-529]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An empty burning palace destroys 30% defender stores daily; rain cancels
the penalty',()=>{for(const rain of [false,true]){const {g,b}=arena();for(const
u of
b.units)u.ordered=true;b.fire[155]=3;b.food={attack:200000,defend:200000};b.gold
={attack:999,defend:999};const
ration=battleDailyFood(battleRationMen(g,b,'defend'));g.random=()=>rain?.9:.1;ac
t(g,'end');;;;;}})
```

**Required output / success criteria**

```text
assert.equal(b.gold.defend,rain?999:699)
assert.equal(b.gold.attack,999)
assert.equal(b.food.defend,rain?200000-ration:Math.floor((200000-ration)*70/100)
)
assert.equal(g.province(8).population,scenarios[0].provinces[7].population)
```

---

**Case / what it tests**

14. [A ready adjacent replacement reoccupies the dry palace before attacking;
trained and Legacy agree][test-source-530]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A ready adjacent replacement reoccupies the dry palace before attacking;
trained and Legacy agree',()=>{const
{g,b,u,v,king}=arena();b.side='defend';b.palace={q:6,r:5};b.terrain[5*13+6]=6;Ob
ject.assign(v,{q:7,r:4,ordered:false});king.ordered=true;const
order=palaceReturnOrder(b);;;;const
model={weights:AI_WEIGHTS.battlefield};;aiBattle(g,90);;;;})
```

**Required output / success criteria**

```text
assert.equal(order.unit,v.id)
assert.equal(order.q,6)
assert.equal(order.r,5)
assert.deepEqual(planBattlefield(g,model).order.args,{unit:v.id,q:6,r:5})
assert.equal(v.q,6)
assert.equal(v.r,5)
assert.equal(b.lastAction.type,'move')
```

---

**Case / what it tests**

15. [Tile description compares actual adjacent jungle, hill and water and
explains Charge equivalence][test-source-531]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Tile description compares actual adjacent jungle, hill and water and
explains Charge equivalence',()=>{const
{b}=arena();b.terrain[4*13+6]=2;for(const [i,terrain]of
[[0,1],[1,2],[2,4]]){const
cell=direction(6,4,i);b.terrain[cell.r*13+cell.q]=terrain;}const
text=tileCombatInfo(b,6,4);for(const word of
['Jungle','Hill','Water','1–10','same equation']);;})
```

**Required output / success criteria**

```text
assert(text.includes(word))
assert(!text.includes('vs plain'))
```

---

**Case / what it tests**

16. [All historical faces remain unique, iconic exceptions persist, and custom
names cannot borrow a historic face][test-source-532]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('All historical faces remain unique, iconic exceptions persist, and custom
names cannot borrow a historic face',()=>{const
keys=OFFICER_ROSTER.map(o=>{const f=portraitFrame(o);return
f.atlas+':'+f.cell;});;;;;for(const choice of CUSTOM_PORTRAITS){const
s=structuredClone(scenarios[0]),province=s.provinces.find(p=>p.owner===255).id;c
onst ruler=createCustomRuler(s,{province,name:'Cao
Cao',sex:choice.sex,customPortrait:choice.cell});const
o=s.officers[s.rulers.find(r=>r.id===ruler).leader];;;;}})
```

**Required output / success criteria**

```text
assert.equal(new Set(keys).size,352)
assert.deepEqual(portraitFrame(OFFICER_ROSTER.find(o=>o.name==='Liu
Bei')),{atlas:'officersHistoric',cell:2})
assert.deepEqual(portraitFrame(OFFICER_ROSTER.find(o=>o.name==='Taishi
Ci')),{atlas:'officersCustom',cell:12})
assert.deepEqual(portraitFrame(OFFICER_ROSTER.find(o=>o.name==='Cao
Pi')),{atlas:'officersCustom',cell:13})
assert.deepEqual(portraitFrame(o),{atlas:'officersCustom',cell:choice.cell})
assert.equal(s.customOfficers[0].customPortrait,choice.cell)
assert.notDeepEqual(portraitFrame(s.customOfficers[1]),portraitFrame(o))
```


<a id="tests-v50-battle-tests-mjs"></a>
## tests/v50-battle-tests.mjs

Source: [tests/v50-battle-tests.mjs](../tests/v50-battle-tests.mjs). Purpose:
Simultaneous status identifies each participating and defending general with
actual men lost; Visible and concealed jungle targets accept simultaneous
attacks with every unit loss reported; A remembered jungle position can be
attacked jointly but a hidden move remains unknown and misses; additional cases
below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../docs/native-combat-v50.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle.mjs`,
`../mjs/ai-battle.mjs`, `../mjs/ai-planner-battlefield.mjs`,
`../mjs/ai-profile.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Simultaneous status identifies each participating and defending general with
actual men lost][test-source-533]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Simultaneous status identifies each participating and defending general
with actual men lost',()=>{const {g,b,u,f,v}=arena(),before=new
Map([u,f,v].map(z=>[z.id,z.soldiers]));act(g,'simultaneous',{unit:u.id,target:v.
id});;for(const row of b.lastAction.lossRows){;;};;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.lossRows.length,3)
assert.equal(row.loss,before.get(row.unit)-b.units.find(z=>z.id===row.unit).sold
iers)
assert(b.events[0].includes(row.name+' lost '+row.loss+' men'))
assert(!v.ordered)
assert.equal(v.orderDay,0)
```

---

**Case / what it tests**

2. [Visible and concealed jungle targets accept simultaneous attacks with every
unit loss reported][test-source-534]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Visible and concealed jungle targets accept simultaneous attacks with
every unit loss reported',()=>{for(const hidden of [false,true]){const
{g,b,u,f,v}=arena();b.terrain[v.r*13+v.q]=1;v.revealedTo=hidden?[]:['attack'];;;
if(!hidden);act(g,'simultaneous',{unit:u.id,...(hidden?{q:v.q,r:v.r}:{target:v.i
d})});;;;;;}})
```

**Required output / success criteria**

```text
assert.equal(jointAttackers(b,u,v).length,2)
assert.equal(visibleUnit(b,v,u.side),!hidden)
assert(battlefieldCandidates(g,AI_WEIGHTS.battlefield).some(o=>o.action==='simul
taneous'&&o.args.target===v.id))
assert.equal(b.lastAction.type,'simultaneous')
assert.equal(b.lastAction.lossRows.length,3)
assert(b.lastAction.lossRows.some(row=>row.unit===v.id&&row.loss>0))
assert(u.ordered&&!f.ordered)
assert(visibleUnit(b,v,u.side))
```

---

**Case / what it tests**

3. [A remembered jungle position can be attacked jointly but a hidden move
remains unknown and misses][test-source-535]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A remembered jungle position can be attacked jointly but a hidden move
remains unknown and misses',()=>{const
{g,b,u,f,v}=arena();b.terrain[v.r*13+v.q]=1;b.lastKnown.attack[v.id]={q:v.q,r:v.
r};;const
old={...b.lastKnown.attack[v.id]};Object.assign(v,{q:9,r:8});b.terrain[v.r*13+v.
q]=1;const
men=b.units.map(z=>z.soldiers),seed=g.s.seed;;act(g,'simultaneous',{unit:u.id,..
.old});;;;;;;})
```

**Required output / success criteria**

```text
assert.equal(blindAttackOrder(b,u).action,'simultaneous')
assert.deepEqual(blindAttackOrder(b,u),{action:'simultaneous',...old})
assert.deepEqual(b.units.map(z=>z.soldiers),men)
assert.equal(g.s.seed,seed)
assert(b.events[0].includes('no enemy was there'))
assert(u.ordered)
assert(!f.ordered)
assert(!visibleUnit(b,v,u.side))
```

---

**Case / what it tests**

4. [Insufficient support and direct concealed IDs reject without state changes
or random draws][test-source-536]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Insufficient support and direct concealed IDs reject without state changes
or random draws',()=>{const {g,b,u,f,v}=arena();b.terrain[v.r*13+v.q]=1;const
before=JSON.stringify(g.s);;;Object.assign(f,{q:0,r:0});const
solo=JSON.stringify(g.s);;;})
```

**Required output / success criteria**

```text
assert.throws(()=>act(g,'simultaneous',{unit:u.id,target:v.id}),/visible/)
assert.equal(JSON.stringify(g.s),before)
assert.throws(()=>act(g,'simultaneous',{unit:u.id,q:v.q,r:v.r}),/two friendly/)
assert.equal(JSON.stringify(g.s),solo)
```

---

**Case / what it tests**

5. [Initiator attacks first and helpers that never exchange damage retain
readiness][test-source-537]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Initiator attacks first and helpers that never exchange damage retain
readiness',()=>{const
{g,b,u,f,v}=arena();b.units=[f,u,v,...b.units.filter(z=>![f,u,v].includes(z))];;
v.soldiers=1;act(g,'simultaneous',{unit:u.id,target:v.id});;;;})
```

**Required output / success criteria**

```text
assert.equal(jointAttackers(b,u,v)[0].id,u.id)
assert(u.ordered)
assert(!f.ordered)
assert.equal(b.lastAction.lossRows.find(row=>row.unit===f.id).loss,0)
```

---

**Case / what it tests**

6. [Native local flight decisions match all bounded attacker and defender
witness inputs][test-source-538]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native local flight decisions match all bounded attacker and defender
witness inputs',()=>{for(const row of
native.cases.filter(row=>row.rule==='Native AI local flight decision')){const
{g,b,u,f,v,king}=arena(),side=row.side>=2?'attack':'defend',actor=side==='attack
'?u:v,enemy=side==='attack'?v:u;Object.assign(actor,{q:6,r:4,soldiers:row.men});
Object.assign(enemy,{q:7,r:4,soldiers:row.adjacentEnemyMen});Object.assign(f,{q:
0,r:0});Object.assign(king,{q:0,r:11});b.leaders[side]=row.commander?actor.id:si
de==='attack'?f.id:king.id;g.random=()=>row.randomSuccess?0:.999;const
bank=g.province(b.target).neighbors.map(id=>g.province(id)).find(p=>p.id!==b.sou
rce);bank.owner=b[side==='attack'?'at … (complete input/procedure at linked
L15–15)
```

**Required output / success criteria**

```text
assert.equal(!!aiFlightOrder(g,actor),row.withdraw,JSON.stringify(row))
```

---

**Case / what it tests**

7. [Visible local peril prompts flight; concealed jungle locations cannot alter
that choice][test-source-539]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Visible local peril prompts flight; concealed jungle locations cannot
alter that choice',()=>{const
{g,b,u,v}=arena();u.soldiers=499;b.terrain[v.r*13+v.q]=1;;;v.revealedTo=['attack
'];;})
```

**Required output / success criteria**

```text
assert(!visibleUnit(b,v,u.side))
assert.equal(aiFlightOrder(g,u),null)
assert.equal(aiFlightOrder(g,u)?.action,'flee')
```

---

**Case / what it tests**

8. [Both battle sides execute voluntary flight instead of repeatedly waiting or
attacking][test-source-540]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Both battle sides execute voluntary flight instead of repeatedly waiting
or attacking',()=>{for(const side of ['attack','defend']){const
{g,b,u,f,v}=arena(),actor=side==='attack'?f:v;b.side=side;actor.soldiers=99;for(
const z of
b.units.filter(z=>z.side===side&&z!==actor))z.ordered=true;g.officer(actor.id).h
asHorse=true;const
bank=g.province(b.target).neighbors.map(id=>g.province(id)).find(p=>p.id!==b.sou
rce);bank.owner=b[side==='attack'?'attacker':'defender'];aiBattle(g,90);;;}})
```

**Required output / success criteria**

```text
assert(actor.fled)
assert.equal(b.lastAction.type,'flee')
```

---

**Case / what it tests**

9. [Trained withdrawal previews preserve live save data and random
state][test-source-541]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Trained withdrawal previews preserve live save data and random
state',()=>{const {g,b,u}=arena();u.soldiers=99;const
before=JSON.stringify(g.s),plan=planBattlefield(g,{weights:AI_WEIGHTS.battlefiel
d});;;})
```

**Required output / success criteria**

```text
assert.equal(plan.order.action,'flee')
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

10. [A burning stranded unit withdraws while a unit with an affordable dry exit
continues fighting][test-source-542]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A burning stranded unit withdraws while a unit with an affordable dry exit
continues fighting',()=>{const
{g,b,u,v,f}=arena();u.soldiers=2000;b.fire[u.r*13+u.q]=3;for(const cell of
neighbors(u.q,u.r))b.terrain[cell.r*13+cell.q]=3;Object.assign(v,{q:0,r:10});Obj
ect.assign(f,{q:0,r:0});;b.terrain[3*13+6]=0;;})
```

**Required output / success criteria**

```text
assert.equal(aiFlightOrder(g,u)?.action,'flee')
assert.equal(aiFlightOrder(g,u),null)
```

---

**Case / what it tests**

11. [Retreat destinations are reserved across simultaneous suspended wars for
their recorded owner][test-source-543]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Retreat destinations are reserved across simultaneous suspended wars for
their recorded owner',()=>{const
{g,b,u}=arena(),dest=g.province(b.target).neighbors.map(id=>g.province(id)).find
(p=>p.id!==b.source);dest.owner=255;dest.officers=[];g.s.wars=[{attacker:b.defen
der,defender:b.attacker,units:[{id:100,side:'attack',originalSide:'attack',fled:
true,retreatProvince:dest.id}]}];;g.s.wars[0].attacker=b.attacker;;})
```

**Required output / success criteria**

```text
assert(!retreatOptions(g,u).some(p=>p.id===dest.id))
assert(retreatOptions(g,u).some(p=>p.id===dest.id))
```


<a id="tests-v50-governance-tests-mjs"></a>
## tests/v50-governance-tests.mjs

Source: [tests/v50-governance-tests.mjs](../tests/v50-governance-tests.mjs).
Purpose: Native governor self rewards: Gold, Horse and Writings work without a
visiting ruler; Self reward uses the governor monthly action; repeating any
reward is rejected atomically; Acted and recovering recipients can be rewarded
by a ready governor; their action is not spent; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/order-availability.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Native governor self rewards: Gold, Horse and Writings work without a
visiting ruler][test-source-544]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Native governor self rewards: Gold, Horse and Writings work without a
visiting ruler',()=>{for(const type of
['rewardGold','rewardHorse','rewardWritings']){const
{g,p}=province(),governor=g.officer(p.governor),gold=p.gold,horses=p.horses;;;g.
execute(type,{province:p.id,officer:governor.id,amount:40});;;;;;;;}})
```

**Required output / success criteria**

```text
assert(!p.officers.includes(g.ruler().leader))
assert.equal(orderUnavailable(g,p,{rewardGold:'reward:gold',rewardHorse:'reward:
horse',rewardWritings:'reward:writings'}[type]),null)
assert.equal(governor.loyalty,type==='rewardWritings'?50:type==='rewardGold'?58:
70)
assert.equal(governor.int,type==='rewardWritings'?41:40)
assert.equal(p.gold,gold-(type==='rewardGold'?40:0))
assert.equal(p.horses,horses-(type==='rewardHorse'?1:0))
assert(governor.acted)
assert(!g.officer(g.ruler().leader).acted)
assert(!g.officer(g.ruler().advisor).acted)
```

---

**Case / what it tests**

2. [Self reward uses the governor monthly action; repeating any reward is
rejected atomically][test-source-545]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Self reward uses the governor monthly action; repeating any reward is
rejected atomically',()=>{for(const type of
['rewardGold','rewardHorse','rewardWritings']){const
{g,p}=province();g.execute(type,{province:p.id,officer:p.governor,amount:40});co
nst before=JSON.stringify(g.s);;;;}})
```

**Required output / success criteria**

```text
assert.throws(()=>g.execute(type,{province:p.id,officer:p.governor,amount:40}),/
already acted/)
assert.equal(JSON.stringify(g.s),before)
assert.match(orderUnavailable(g,p,'reward'),/already acted/)
```

---

**Case / what it tests**

3. [Acted and recovering recipients can be rewarded by a ready governor; their
action is not spent][test-source-546]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Acted and recovering recipients can be rewarded by a ready governor; their
action is not spent',()=>{for(const type of
['rewardGold','rewardHorse','rewardWritings'])for(const condition of
['acted','sick','injured']){const
{g,p}=province(),target=g.officer(35);g.ruler().advisor=34;Object.assign(target,
{loyalty:50,int:40,acted:false,sick:0,injured:0,[condition]:condition==='acted'?
true:2});g.execute(type,{province:p.id,officer:target.id,amount:40});;;;;}})
```

**Required output / success criteria**

```text
assert(g.officer(p.governor).acted)
assert.equal(target.acted,condition==='acted')
assert.equal(target[condition],condition==='acted'?true:2)
assert.equal(target.int,type==='rewardWritings'?41:40)
```

---

**Case / what it tests**

4. [An unavailable governor blocks the reward despite ready recipients and a
ready ruler elsewhere][test-source-547]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('An unavailable governor blocks the reward despite ready recipients and a
ready ruler elsewhere',()=>{for(const condition of
['acted','sick','injured']){const
{g,p}=province();g.officer(p.governor)[condition]=condition==='acted'?true:2;con
st before=JSON.stringify(g.s);;;;}})
```

**Required output / success criteria**

```text
assert.throws(()=>g.execute('rewardGold',{province:p.id,officer:34,amount:40}))
assert.equal(JSON.stringify(g.s),before)
assert(orderUnavailable(g,p,'reward:gold'))
```

---

**Case / what it tests**

5. [Rulers remain ineligible recipients, including when governing the issuing
province][test-source-548]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Rulers remain ineligible recipients, including when governing the issuing
province',()=>{for(const type of
['rewardGold','rewardHorse','rewardWritings']){const g=new
Game(createCampaign(scenarios[0],[0]),{},structuredClone(terrains)),p=g.province
(9);g.ruler().advisor=33;g.officer(33).int=100;g.officer(0).int=40;const
before=JSON.stringify(g.s);;;}})
```

**Required output / success criteria**

```text
assert.throws(()=>g.execute(type,{province:p.id,officer:0,amount:40}),/subordina
te/)
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

6. [Reward Horse removes stock and increases loyalty without silently granting
personal equipment][test-source-549]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Reward Horse removes stock and increases loyalty without silently granting
personal equipment',()=>{const
{g,p}=province(),target=g.officer(35);target.loyalty=50;delete
target.hasHorse;g.execute('rewardHorse',{province:p.id,officer:target.id});;})
```

**Required output / success criteria**

```text
assert.equal(target.hasHorse,undefined)
```


<a id="tests-v50-presentation-tests-mjs"></a>
## tests/v50-presentation-tests.mjs

Source: [tests/v50-presentation-tests.mjs](../tests/v50-presentation-tests.mjs).
Purpose: simultaneous status shows one readable loss message per friendly and
hostile participant; structured ambush animations preserve both participants
independently of text or living roster; charge repeats eight native flashes for
each actual resolved exchange, with finite march and return; additional cases
below.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `node:assert/strict`,
`../mjs/battle-presentation.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [simultaneous status shows one readable loss message per friendly and hostile
participant][test-source-550]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const names={0:'Cao Cao',34:'Cao Hong',66:'Zhang
Yang'},rows=[{unit:0,side:'attack',loss:23},{unit:34,side:'attack',loss:71},{uni
t:66,side:'defend',loss:127}]; const
battle={phase:'battle',side:'attack',selected:0,units:[],lastAction:{type:'simul
taneous',unit:0,messageSerial:1,lossRows:rows},messages:[{serial:1,text:'Cao Cao
initiated a simultaneous attack: 127 enemy losses, 94 own losses. Each unit: Cao
Cao lost 23 men; Cao Hong lost 71 men; Zhang Yang lost 127 men.'}]}; const
messages=battleStatusMessages(battle,0,id=>names[id],false); ; ;
```

**Required output / success criteria**

```text
assert.deepEqual(messages.slice(-3).map(m=>m.text),['Cao Cao: 23 men lost
(attacker).','Cao Hong: 71 men lost (attacker).','Zhang Yang: 127 men lost
(defender).'])
assert(!messages[1].text.includes('Each unit'))
```

---

**Case / what it tests**

2. [structured ambush animations preserve both participants independently of
text or living roster][test-source-551]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
ambush={unit:66,target:0,combatUnits:[{id:66,q:6,r:4,side:'defend',soldiers:2000
},{id:0,q:6,r:5,side:'attack',soldiers:4000}]};
battle.messages=[{serial:4,text:'Localised ambush
text',ambush},{serial:5,text:'Localised second ambush
text',ambush:{...ambush,unit:34}}]; const
before=JSON.stringify(battle),animations=ambushAnimations(battle,{messageSerial:
4},id=>names[id]);;;;;;;
```

**Required output / success criteria**

```text
assert.equal(animations.length,2)
assert.equal(animations[0].target,0)
assert.equal(animations[0].combatUnits.length,2)
assert.equal(JSON.stringify(battle),before)
assert.equal(combatAnimationCycles(animations[0]),8)
assert.equal(combatAnimationDuration(animations[0]),3000)
```

---

**Case / what it tests**

3. [charge repeats eight native flashes for each actual resolved exchange, with
finite march and return][test-source-552]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; for(const exchanges of [1,3,10]){const action={type:'charge',exchanges};;;;}
```

**Required output / success criteria**

```text
assert.equal(combatAnimationCycles(action),8*exchanges)
assert.equal(combatAnimationDuration(action),600*exchanges+1300)
assert.equal(combatAnimationPhase(action,650+600*exchanges).phase,'return')
```

---

**Case / what it tests**

4. [simultaneous flashes sequential attacker-target pairs only for actual
exchanges][test-source-553]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
; const
joint={type:'simultaneous',unit:0,target:66,exchanges:2,combatUnits:[{id:0},{id:
34},{id:66}]}; const pairs=combatAnimations(joint);;;;
```

**Required output / success criteria**

```text
assert.deepEqual(pairs.map(a=>a.combatUnits.map(u=>u.id)),[[0,66],[34,66]])
assert.equal(pairs.reduce((n,a)=>n+combatAnimationCycles(a),0),16)
assert.equal(combatAnimations({...joint,exchanges:1}).length,1)
```


<a id="tests-v52-tests-mjs"></a>
## tests/v52-tests.mjs

Source: [tests/v52-tests.mjs](../tests/v52-tests.mjs). Purpose: Move, Wait and
Fireball helpers still exchange damage, animate and retain their completed own
order; A helper that has not acted keeps its own available order after
simultaneous assistance; Human attacking commander targeted by defender
simultaneous attack can act when the army changes; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`.
Dependencies/entry points: `node:fs`, `node:assert/strict`,
`../mjs/strategy.mjs`, `../mjs/battle.mjs`, `../mjs/battle-presentation.mjs`,
`../mjs/ai-planner-battlefield.mjs`, `../mjs/ai-profile.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [Move, Wait and Fireball helpers still exchange damage, animate and retain
their completed own order][test-source-554]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Move, Wait and Fireball helpers still exchange damage, animate and retain
their completed own order',()=>{for(const order of
['move','wait','fireball']){const
{g,b,u,f,v}=arena();if(order==='move'){Object.assign(f,{q:5,r:5});act(g,order,{u
nit:f.id,q:6,r:5});}else act(g,order,{unit:f.id,q:v.q,r:v.r});;const
day=f.orderDay;;;act(g,'simultaneous',{unit:u.id,target:v.id});;;;;}})
```

**Required output / success criteria**

```text
assert(f.ordered)
assert.equal(jointAttackers(b,u,v).length,2)
assert(battlefieldCandidates(g,AI_WEIGHTS.battlefield).some(o=>o.action==='simul
taneous'&&o.args.unit===u.id))
assert(b.lastAction.lossRows.find(z=>z.unit===f.id).loss>0)
assert.deepEqual(combatAnimations(b.lastAction).map(a=>a.unit),[u.id,f.id])
assert(f.ordered&&f.orderDay===day)
assert.throws(()=>act(g,'wait',{unit:f.id}),/already completed/)
```

---

**Case / what it tests**

2. [A helper that has not acted keeps its own available order after simultaneous
assistance][test-source-555]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('A helper that has not acted keeps its own available order after
simultaneous assistance',()=>{const
{g,b,u,f,v}=arena();act(g,'simultaneous',{unit:u.id,target:v.id});;act(g,'wait',
{unit:f.id});;;})
```

**Required output / success criteria**

```text
assert(u.ordered&&!f.ordered&&!v.ordered)
assert(f.ordered)
assert.throws(()=>act(g,'wait',{unit:u.id}),/already completed/)
```

---

**Case / what it tests**

3. [Human attacking commander targeted by defender simultaneous attack can act
when the army changes][test-source-556]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Human attacking commander targeted by defender simultaneous attack can act
when the army changes',()=>{const
{g,b,u,f,v,king}=arena();b.side='defend';Object.assign(v,{q:6,r:4});Object.assig
n(king,{q:6,r:5});Object.assign(u,{q:7,r:4});Object.assign(f,{q:0,r:0});act(g,'s
imultaneous',{unit:v.id,target:u.id});;;act(g,'end');;;;act(g,'move',{unit:u.id,
q:8,r:4});;;})
```

**Required output / success criteria**

```text
assert(!u.ordered)
assert(!king.ordered)
assert.equal(b.side,'attack')
assert.equal(b.day,1)
assert.equal(b.selected,u.id)
assert.equal(u.q,8)
assert(u.ordered)
```

---

**Case / what it tests**

4. [Automatic ambush preserves both available and previously completed own
orders][test-source-557]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Automatic ambush preserves both available and previously completed own
orders',()=>{for(const already of [false,true]){const
{g,b,u,f,v,king}=arena();b.side='defend';const
from={q:5,r:5},to=direction(from.q,from.r,2),cell=ambushCells(from,to)[0];Object
.assign(v,from,{int:89});Object.assign(u,cell,{ordered:already,orderDay:already?
b.day:0});Object.assign(f,{q:0,r:0});Object.assign(king,{q:0,r:11});b.terrain[ce
ll.r*13+cell.q]=1;act(g,'move',{unit:v.id,...to});;;;if(!already){act(g,'end');;
act(g,'wait',{unit:u.id});;}}})
```

**Required output / success criteria**

```text
assert.equal(ambushAnimations(b,b.lastAction,id=>g.officer(id).name).length,1)
assert.equal(u.ordered,already)
assert.equal(u.orderDay,already?b.day:0)
assert.equal(b.side,'attack')
assert(u.ordered)
```

---

**Case / what it tests**

5. [Own orders renew after both army phases for either native first-side
sequence][test-source-558]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('Own orders renew after both army phases for either native first-side
sequence',()=>{for(const first of ['attack','defend']){const
{g,b}=arena();b.side=b.firstSide=first;act(g,'end');;;act(g,'end');;;;}})
```

**Required output / success criteria**

```text
assert.equal(b.day,1)
assert(b.units.filter(z=>z.side!==first).every(z=>!z.ordered))
assert.equal(b.day,2)
assert.equal(b.side,first)
assert(b.units.filter(z=>z.side===first).every(z=>!z.ordered))
```


<a id="tests-v53-tests-mjs"></a>
## tests/v53-tests.mjs

Source: [tests/v53-tests.mjs](../tests/v53-tests.mjs). Purpose: BUG-53-03 palace
defenders and low-intelligence commanders choose joint attacks when available;
BUG-53-04 human display conceals hostile jungle units throughout both army
turns; BUG-53-05 forced enemy movement invokes arrival ambush without spending
helper or target orders; additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../docs/native-battle-witness-v53.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `../mjs/strategy.mjs`, `../mjs/battle.mjs`,
`../mjs/battle-presentation.mjs`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-53-03 palace defenders and low-intelligence commanders choose joint
attacks when available][test-source-559]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-03 palace defenders and low-intelligence commanders choose joint
attacks when available',()=>{for(const intelligence of [1,60]){const
{g,b,u,f,v,king}=arena();b.side='defend';b.day=2;Object.assign(king,{q:6,r:4,war
:80});Object.assign(v,{q:6,r:5,war:50});Object.assign(u,{q:7,r:4});Object.assign
(f,{q:0,r:0});b.palace={q:6,r:4};b.terrain[4*13+6]=6;aiBattle(g,intelligence);;;
;}})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.type,'simultaneous')
assert.equal(b.lastAction.lossRows.length,3)
assert(!b.units.find(z=>z.side===b.side&&z.id!==b.lastAction.unit).ordered)
```

---

**Case / what it tests**

2. [BUG-53-04 human display conceals hostile jungle units throughout both army
turns][test-source-560]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-04 human display conceals hostile jungle units throughout both army
turns',()=>{const {g,b,u,v}=arena();b.terrain[v.r*13+v.q]=1;for(const side of
['attack','defend']){b.side=side;const
visible=battle.viewedUnit?battle.viewedUnit(g,v):battle.visibleUnit(b,v);;;}v.re
vealedTo=['attack'];if(battle.viewedUnit);g.s.humanRulers=[b.defender];;;})
```

**Required output / success criteria**

```text
assert.equal(visible,false,side)
assert.equal(battle.viewedUnit?battle.viewedUnit(g,u):battle.visibleUnit(b,u),tr
ue)
assert(!battle.viewedUnit(g,v),'Surviving jungle sprite is concealed after
combat')
assert(battle.viewedUnit(g,v))
assert(!battle.viewedUnit(g,{...u,q:v.q,r:v.r}))
```

---

**Case / what it tests**

3. [BUG-53-05 forced enemy movement invokes arrival ambush without spending
helper or target orders][test-source-561]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-05 forced enemy movement invokes arrival ambush without spending
helper or target orders',()=>{const {g,b,u,f,v,king}=arena();const
from={q:6,r:4},old=direction(from.q,from.r,2),to=direction(from.q,from.r,4),cell
=ambushCells(old,from).find(c=>c.q!==to.q||c.r!==to.r);Object.assign(u,from,{int
:90});Object.assign(v,old,{int:50});Object.assign(f,cell,{int:90});Object.assign
(king,{q:0,r:11});b.terrain[cell.r*13+cell.q]=1;g.random=()=>.25;const
soldiers=v.soldiers;act(g,'moveEnemy',{unit:u.id,target:v.id,...to});;;;;})
```

**Required output / success criteria**

```text
assert.deepEqual({q:v.q,r:v.r},from)
assert(v.soldiers<soldiers)
assert.equal(ambushAnimations(b,b.lastAction,id=>g.officer(id).name).length,1)
assert(!f.ordered&&!v.ordered)
```

---

**Case / what it tests**

4. [BUG-53-07 fire probability matches native terrain and opposed intelligence
vectors][test-source-562]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-07 fire probability matches native terrain and opposed intelligence
vectors',()=>{const evidence=JSON.parse(fs.readFileSync(new
URL('../docs/native-battle-witness-v53.json',import.meta.url)));const
vectors=evidence.cases.filter(c=>c.test==='FIRE-CHANCE-NATIVE-TERRAIN-INT-WEATHE
R');;for(const c of vectors){;}})
```

**Required output / success criteria**

```text
assert(vectors.length>0)
assert.equal(fireChance(c.actorINT,['sunny','fewclouds','cloudy','rain'][c.weath
er],c.terrain,c.targetINT,()=>.999),c.chance/100)
```

---

**Case / what it tests**

5. [BUG-53-07 original mountain fire terrain can ignite and survive a
checkpoint][test-source-563]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-07 original mountain fire terrain can ignite and survive a
checkpoint',()=>{const {g,b,u}=arena();const
cell=direction(u.q,u.r,1);b.terrain[cell.r*13+cell.q]=3;g.terrains[b.target-1]=[
...b.terrain];g.random=()=>0;act(g,'fireball',{unit:u.id,...cell});;;})
```

**Required output / success criteria**

```text
assert(b.fire[cell.r*13+cell.q])
assert.equal(validateSave(g.s,scenarios,g.terrains).battle.fire[cell.r*13+cell.q
],3)
```

---

**Case / what it tests**

6. [BUG-53-07 successful reburn damages again, failed reburn leaves men and old
fire unchanged][test-source-564]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-07 successful reburn damages again, failed reburn leaves men and
old fire unchanged',()=>{const {g,b,u,f,v}=arena();u.int=f.int=100;v.int=0;let
rolls=[0,0,0,.5];g.random=()=>rolls.shift()??0;act(g,'fireball',{unit:u.id,q:v.q
,r:v.r});;rolls=[0,0,0,.5];act(g,'fireball',{unit:f.id,q:v.q,r:v.r});;u.ordered=
false;const
before=v.soldiers;b.fire[v.r*13+v.q]=2;u.int=0;v.int=100;g.random=()=>.99;act(g,
'fireball',{unit:u.id,q:v.q,r:v.r});;;})
```

**Required output / success criteria**

```text
assert.equal(v.soldiers,4875)
assert.equal(v.soldiers,4754)
assert.equal(v.soldiers,before)
assert.equal(b.fire[v.r*13+v.q],2)
```

---

**Case / what it tests**

7. [BUG-53-09 transport passage and capture show native directed relationship
changes][test-source-565]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-09 transport passage and capture show native directed relationship
changes',()=>{for(const allied of [false,true])for(const choice of
['free','capture']){const
{g,j}=courier();j.type='transport';j.args={province:9,officer:34,target:j.legs[0
].route.at(-1),gold:100,food:0};const
sender=g.ruler(0),host=g.ruler(1);sender.relations[1]=50;host.relations[0]=63;ho
st.trust=50;if(allied)sender.alliances=[1];g.interceptJourney(choice);;;;}})
```

**Required output / success criteria**

```text
assert.equal(sender.relations[1],choice==='free'?47:allied?58:60)
assert.equal(host.relations[0],63)
assert.equal(host.trust,choice==='free'?(allied?53:50):(allied?45:50))
```

---

**Case / what it tests**

8. [BUG-53-09 native allied hostile-mission exemption preserves trust and
changes both directed relations][test-source-566]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-09 native allied hostile-mission exemption preserves trust and
changes both directed relations',()=>{for(const type of
['wolf','betrayal','forged','recruitMethod','joint']){const
{g,j}=courier();g.ruler(0).alliances=[1];g.ruler(0).relations[1]=50;g.ruler(1).r
elations[0]=60;g.ruler(1).trust=80;if(type==='recruitMethod')j.type=type;else
if(type==='joint'){j.args.mode='joint';j.args.enemy=j.legs[0].route.at(-1);}else
{j.type='spyMission';j.args.mode=type;}g.interceptJourney('capture');;;;}})
```

**Required output / success criteria**

```text
assert.equal(g.ruler(0).relations[1],58)
assert.equal(g.ruler(1).relations[0],63)
assert.equal(g.ruler(1).trust,80)
```

---

**Case / what it tests**

9. [BUG-53-10 intercepted let-pass completes once then traverses every reversed
route edge][test-source-567]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-10 intercepted let-pass completes once then traverses every
reversed route edge',()=>{const {g,j}=courier();const
route=[...j.legs[0].route];g.interceptJourney('free');let
n=0;while(j.phase==='outbound'){if(j.proposal)g.answerProposal(true);else
g.advanceJourney();;};;const
motion=[];while(g.s.journey){if(j.legs[0].index<j.legs[0].route.length-1){const
i=j.legs[0].index;g.advanceJourney();motion.push([g.journeyMotion.from,g.journey
Motion.to]);;;}else g.advanceJourney();;};;})
```

**Required output / success criteria**

```text
assert(++n<80)
assert(j.delivered)
assert.deepEqual(j.legs[0].route,[...route].reverse())
assert.equal(j.legs[0].index,i+1)
assert(!j.interception)
assert(++n<160)
assert.equal(motion.length,route.length-1)
assert(!g.officer(34).inTransit)
```

---

**Case / what it tests**

10. [BUG-53-10 capture then release restores sender service and animates return
without delivery or cargo refund][test-source-568]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-10 capture then release restores sender service and animates return
without delivery or cargo refund',()=>{const {g,j,leg}=courier();const
home=j.source,origin=leg.route[leg.index],gold=g.province(home).gold;g.intercept
Journey('capture');;g.decideCaptive(34,'free');;;;;;;validateSave(g.s,scenarios,
terrains);let
n=0;while(g.s.journey){g.advanceJourney();if(g.s.journey)validateSave(g.s,scenar
ios,terrains);;};;;})
```

**Required output / success criteria**

```text
assert(!g.s.journey)
assert.equal(g.officer(34).owner,0)
assert(g.officer(34).inTransit)
assert.equal(g.s.journey.type,'messengerReturn')
assert.equal(g.s.journey.phase,'return')
assert.equal(g.s.journey.legs[0].route[0],origin)
assert.equal(g.s.journey.legs[0].route.at(-1),home)
assert(++n<80)
assert(g.province(home).officers.includes(34))
assert.equal(g.province(home).gold,gold)
assert(!g.officer(34).inTransit)
```

---

**Case / what it tests**

11. [BUG-53-08 verified governance opening/completion/prison contexts use
original effects][test-source-569]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-08 verified governance opening/completion/prison contexts use
original effects',()=>{;;;})
```

**Required output / success criteria**

```text
assert.equal(orderSound('trainArmy'),'native-effect-14')
assert.equal(eventSound({kind:'prison'}),'native-effect-7')
assert.equal(eventSound({kind:'diplomacy'}),'native-effect-14')
```

---

**Case / what it tests**

12. [BUG-53-05 human and AI pulls cover six movement directions, both column
parities and burning arrival][test-source-570]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-05 human and AI pulls cover six movement directions, both column
parities and burning arrival',()=>{for(const ai of [false,true])for(const q of
[6,7])for(let d=0;d<6;d++){const
{g,b,u,f,v,king}=arena();if(ai)g.s.humanRulers=[];const
from={q,r:5},old=direction(q,5,d),cell=ambushCells(old,from).find(c=>battle.dist
ance(c,from)===1),to=battle.neighbors(q,5).find(c=>battle.distance(c,old)>0&&bat
tle.distance(c,cell)>0);Object.assign(u,from,{int:90});Object.assign(v,old,{int:
50});Object.assign(f,cell,{int:90});Object.assign(king,{q:0,r:11});b.terrain[cel
l.r*13+cell.q]=1;if(!ai)b.fire[from.r*13+from.q]=3;g.random=()=>.25;const
mp=v.mobility;act(g,ai?'move':'moveEnemy',{unit:u.id,target: … (complete
input/procedure at linked L24–24)
```

**Required output / success criteria**

```text
assert.deepEqual({q:v.q,r:v.r},from)
assert.equal(v.mobility,mp)
assert(b.messages.some(m=>m.text.includes('on ignition')))
assert(ambushAnimations(b,b.lastAction,id=>g.officer(id).name).length>=1)
assert(!f.ordered&&!v.ordered)
```

---

**Case / what it tests**

13. [BUG-53-05 death on forced fire entry suppresses the later
ambush][test-source-571]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-05 death on forced fire entry suppresses the later
ambush',()=>{const
{g,b,u,f,v,king}=arena(),from={q:6,r:4},old=direction(6,4,2),to=direction(6,4,4)
,cell=ambushCells(old,from)[0];Object.assign(v,old,{int:0,soldiers:99});Object.a
ssign(u,from,{int:100});Object.assign(f,cell);Object.assign(king,{q:0,r:11});b.t
errain[cell.r*13+cell.q]=1;b.fire[from.r*13+from.q]=3;g.random=()=>0;act(g,'move
Enemy',{unit:u.id,target:v.id,...to});;;;})
```

**Required output / success criteria**

```text
assert(v.killed&&v.routed)
assert.equal(v.soldiers,0)
assert.equal(ambushAnimations(b,b.lastAction,id=>g.officer(id).name).length,0)
```

---

**Case / what it tests**

14. [BUG-53-10 released messenger redirects to remaining sender land when the
original home was lost][test-source-572]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-53-10 released messenger redirects to remaining sender land when the
original home was lost',()=>{const
{g,j}=courier();g.interceptJourney('capture');const
c=g.s.captiveDecisions.find(c=>c.officer===34);c.source=8;g.decideCaptive(34,'fr
ee');;;;const bad=structuredClone(g.s);bad.journey.phase='outbound';;})
```

**Required output / success criteria**

```text
assert.equal(g.officer(34).owner,0)
assert.equal(g.province(g.s.journey.source).owner,0)
assert.notEqual(g.s.journey.source,8)
assert.throws(()=>validateSave(bad,scenarios,terrains),/released messenger/)
```


<a id="tests-v54-tests-mjs"></a>
## tests/v54-tests.mjs

Source: [tests/v54-tests.mjs](../tests/v54-tests.mjs). Purpose: BUG-54-01 native
captive ruler remains Set free/Behead with zero, one or two provinces at every
hostility; BUG-54-02 every native joint loss, equipment mutation and stop branch
matches; helper order ignores roster insertion; BUG-54-02 AI joint native
equations, human-target difficulty and geometric order match every exchange sum;
additional cases below.

Shared inputs: `../config/scenarios.json`, `../config/province-terrain.json`,
`../docs/native-joint-witness-v54.json`,
`../docs/native-ai-joint-witness-v54.json`. Dependencies/entry points:
`node:fs`, `node:assert/strict`, `../mjs/strategy.mjs`,
`../mjs/campaign-decisions.mjs`, `../mjs/battle.mjs`,
`../mjs/battle-presentation.mjs`, `../mjs/audio.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-54-01 native captive ruler remains Set free/Behead with zero, one or two
provinces at every hostility][test-source-573]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-54-01 native captive ruler remains Set free/Behead with zero, one or
two provinces at every hostility',()=>{for(const count of [0,1,2])for(const
hostility of [0,50,80,100]){const g=new
Game(createCampaign(scenarios[0],[0]),{},structuredClone(terrains)),former=g.rul
er(3),id=former.leader;if(count===2){const
destination=g.s.provinces.find(p=>p.owner===255),donor=g.s.provinces.find(p=>p.o
fficers.includes(34));donor.officers=donor.officers.filter(id=>id!==34);destinat
ion.owner=3;destination.governor=34;destination.officers=[34];g.officer(34).owne
r=3;}for(const p of
g.s.provinces.filter(p=>p.owner===3).slice(count)){p.owner=0;for(const id of
p.officers)g.officer(id).owner=0;}takeCaptive … (complete input/procedure at
linked L5–5)
```

**Required output / success criteria**

```text
assert.equal(g.s.provinces.filter(p=>p.owner===3).length,count)
assert.deepEqual(captiveActions(g,c),['free','behead'])
assert.throws(()=>decideCaptive(g,id,'recruit'),/only be set free or beheaded/)
assert.equal(JSON.stringify(g.s),before)
```

---

**Case / what it tests**

2. [BUG-54-02 every native joint loss, equipment mutation and stop branch
matches; helper order ignores roster insertion][test-source-574]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-54-02 every native joint loss, equipment mutation and stop branch
matches; helper order ignores roster insertion',()=>{;for(const f of
fixtures)for(const shuffled of [false,true]){const r=replay(f,shuffled);;;;;}})
```

**Required output / success criteria**

```text
assert(fixtures.length>0)
assert.deepEqual(r.final,f.final,f.name)
assert.equal(r.targetLoss,f.targetLossSum.reduce((n,x)=>n+x,0))
assert.equal(r.rngIndex,f.rng.length)
assert.equal(r.b.lastAction.exchanges,f.exchanges.length)
```

---

**Case / what it tests**

3. [BUG-54-02 AI joint native equations, human-target difficulty and geometric
order match every exchange sum][test-source-575]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-54-02 AI joint native equations, human-target difficulty and geometric
order match every exchange sum',()=>{;for(const f of aiFixtures)for(const
shuffled of [false,true]){const r=replay(f,shuffled);;;;;;}})
```

**Required output / success criteria**

```text
assert(aiFixtures.some(f=>f.humanTarget&&f.difficulty===5))
assert.deepEqual(r.final,f.final,f.name)
assert.equal(r.targetLoss,f.targetLossSum.reduce((n,x)=>n+x,0),f.name)
assert.equal(r.b.lastAction.exchangeRows.reduce((n,x)=>n+x.loss,0),r.targetLoss,
f.name)
assert.equal(r.rngIndex,f.rng.length,f.name)
assert.equal(r.b.lastAction.exchanges,f.exchanges.length,f.name)
```

---

**Case / what it tests**

4. [BUG-54-02 simultaneous status retains contribution arithmetic and displays
one neutral summary plus individuals][test-source-576]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-54-02 simultaneous status retains contribution arithmetic and displays
one neutral summary plus individuals',()=>{const
f=fixtures.find(c=>c.name.includes('mixed')&&c.attackers.length===2),{g,b,target
Loss}=replay(f);;;const
messages=battleStatusMessages(b,0,id=>g.officer(id).name,false,false);;;for(cons
t id of [1,2,10]);;})
```

**Required output / success criteria**

```text
assert.equal(b.lastAction.exchangeRows.reduce((n,row)=>n+row.loss,0),targetLoss)
assert(b.lastAction.exchangeRows.every(row=>row.target===10))
assert.equal(messages.filter(m=>m.text.startsWith('Simultaneous
attack:')).length,1)
assert(messages[0].text.includes('Defender lost '+targetLoss))
assert.equal(messages.filter(m=>m.text.startsWith(g.officer(id).name+':')).lengt
h,1)
assert(!messages.some(m=>m.text.includes('’s turn')))
```

---

**Case / what it tests**

5. [BUG-54-04 turn cue is shown before highlight; AI cannot resolve until the
announcement finishes][test-source-577]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-54-04 turn cue is shown before highlight; AI cannot resolve until the
announcement finishes',async()=>{const {createBattleTurnCue}=await
import('../mjs/battle-turn-cue.mjs');const events=[],frames=[];let done;const
cue=createBattleTurnCue({announce:(u,human,end)=>{events.push('turn
'+u.id);done=end;},highlight:id=>events.push('highlight
'+id),frame:fn=>frames.push(fn)}),b={side:'attack',day:1},u={id:1};cue.begin(b,u
,false);;;frames.shift()();;;done();;events.push('order');events.push('impact');
;cue.begin(b,{id:2},false);cue.clear();frames.shift()();done();;})
```

**Required output / success criteria**

```text
assert.equal(cue.ready(b,u),false)
assert.deepEqual(events,['highlight null','turn 1'])
assert.deepEqual(events,['highlight null','turn 1','highlight 1'])
assert.equal(cue.ready(b,u),false)
assert(cue.ready(b,u))
assert.deepEqual(events.slice(1),['turn 1','highlight 1','order','impact'])
assert(!cue.ready(b,{id:2}))
```

---

**Case / what it tests**

6. [BUG-54-05 plain button/selector sound is silent while explicit native
feedback remains available][test-source-578]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-54-05 plain button/selector sound is silent while explicit native
feedback remains available',()=>{const
media=[];globalThis.document={hidden:false,addEventListener(){},removeEventListe
ner(){}};globalThis.Audio=class{constructor(src){this.src=src;}play(){media.push
(this.src);return Promise.resolve();}pause(){}};const bus=new
AudioBus();bus.unlock();bus.setActive(true);const
before=media.length;bus.play('select');;bus.playNative(10);;bus.playNative(14);;
bus.destroy();})
```

**Required output / success criteria**

```text
assert.equal(media.length,before)
assert(media.at(-1).includes('native-effect-10'))
assert(media.at(-1).includes('native-effect-14'))
```


<a id="tests-v54-ui-tests-mjs"></a>
## tests/v54-ui-tests.mjs

Source: [tests/v54-ui-tests.mjs](../tests/v54-ui-tests.mjs). Purpose: BUG-54-05
mounted Events/Province/Orders, Rest/View and order menus stay silent; BUG-54-03
selected deployment unit exposes live read-only combat stats and compact
selector; BUG-54-04 mounted AI step announces, highlights, resolves once, then
presents impact; additional cases below.

Shared inputs: `package.json`, `index.html`, `style.css`,
`./assets/artwork/fire-v42.webp`, `-v31.webp`, `-v30.webp`,
`config/scenarios.json`, `config/province-terrain.json`, `v54.json`.
Dependencies/entry points: `../mjs/raster-world.mjs`,
`../mjs/original-deployment.mjs`, `../mjs/geography.mjs`, `node:fs`,
`node:path`, `node:assert/strict`, `jsdom`, `@napi-rs/canvas`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-54-05 mounted Events/Province/Orders, Rest/View and order menus stay
silent][test-source-579]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-54-05 mounted Events/Province/Orders, Rest/View and order menus stay
silent',async()=>{await load(fresh());const before=cuePlays();for(const screen
of ['events','province','orders'])click('#provinceNavigation
[data-screen='+screen+']');click('[data-command=rest]');click('#keepPlaying');cl
ick('[data-command=view]');click('#provinceNavigation
[data-screen=orders]');click('[data-command=military]');click('#cancelOrder');;l
eave();})
```

**Required output / success criteria**

```text
assert.equal(cuePlays(),before)
```

---

**Case / what it tests**

2. [BUG-54-03 selected deployment unit exposes live read-only combat stats and
compact selector][test-source-580]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-54-03 selected deployment unit exposes live read-only combat stats
and compact selector',async()=>{const
g=fresh();g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000})
;await load(g);const
unit=battle().units.find(u=>u.id===battle().selected),summary=document.getElemen
tById('deploymentDetails');;;for(const [key,value] of
[['men',unit.soldiers],['weapons',unit.weapons],['training',unit.training],['war
',unit.war],['int',unit.int],['mobility',unit.mobility]]);const
beforeUnits=JSON.stringify(battle().units);;const
other=battle().units.find(u=>u.side===battle().side&&u.id!==unit.id);change('bat
tleQuickUnit',other.id);;;;;leave();})
```

**Required output / success criteria**

```text
assert(summary,'Missing deployment unit summary')
assert(summary.textContent.includes(state().officers[unit.id].name))
assert.equal(Number(summary.querySelector('[data-deploy-stat='+key+']').dataset.
value),value)
assert.equal(summary.querySelectorAll('input').length,0)
assert.equal(JSON.stringify(battle().units),beforeUnits)
assert(document.getElementById('deploymentDetails').textContent.includes(state()
.officers[other.id].name))
assert.equal(win.getComputedStyle(document.getElementById('battleQuickUnit')).di
splay,'block')
assert.equal(win.getComputedStyle(document.getElementById('deploymentDetails')).
overflow,'auto')
```

---

**Case / what it tests**

3. [BUG-54-04 mounted AI step announces, highlights, resolves once, then
presents impact][test-source-581]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-54-04 mounted AI step announces, highlights, resolves once, then
presents impact',async()=>{const
g=fresh();g.s.humanRulers=[];g.invade({province:9,target:8,governor:33,officers:
[0,34],food:20000});while(g.s.battle.phase==='deployment')aiBattle(g);g.s.battle
.day=2;g.s.battle.completedDays=1;g.s.speed=g.s.settings.messageSpeed=1000;const
events=[];const observer=new win.MutationObserver(()=>{const
text=document.getElementById('toast').textContent;if(document.getElementById('to
ast').classList.contains('show')&&text.includes('’s
turn')&&!events.includes('turn'))events.push('turn');if(document.querySelector('
.unit-label.active-turn')&&events.includes('turn')&&!events.includes('highlig …
(complete input/procedure at linked L39–39)
```

**Required output / success criteria**

```text
assert(document.getElementById('toast').textContent.includes('’s turn'))
assert(document.querySelector('.unit-label.active-turn'))
assert.equal(b.eventSerial,serial,'AI resolved before its announcement
finished')
assert.deepEqual(events.slice(0,4),['turn','highlight','order','impact'])
assert.equal(JSON.stringify(b.units),resolved)
assert(!document.getElementById('toast').textContent.includes('’s turn'))
```

---

**Case / what it tests**

4. [BUG-54-04 human unit selection announces before highlight and defers an
immediate Wait exactly once][test-source-582]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-54-04 human unit selection announces before highlight and defers an
immediate Wait exactly once',async()=>{const
g=fresh();g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000})
;while(g.s.battle.phase==='deployment')aiBattle(g);g.s.battle.side='attack';awai
t load(g);const
b=battle(),other=b.units.find(u=>u.side==='attack'&&u.id!==b.selected),node=[...
document.querySelectorAll('.unit-label')].find(n=>n.getAttribute('aria-label').i
ncludes(state().officers[other.id].name+', '));;const
serial=b.eventSerial;node.click();;;click('[data-battle=wait]');;await
waitUntil(()=>other.ordered,2000);;;const seed=state().seed;await
wait(150);;;leave();})
```

**Required output / success criteria**

```text
assert(node)
assert.equal(document.getElementById('toast').textContent,state().officers[other
.id].name+'’s turn')
assert(!document.querySelector('.unit-label.active-turn')||!document.querySelect
or('.unit-label.active-turn').getAttribute('aria-label').includes(state().office
rs[other.id].name))
assert.equal(b.eventSerial,serial)
assert.equal(b.eventSerial,serial+1)
assert(document.getElementById('toast').textContent.includes('waited'))
assert.equal(b.eventSerial,serial+1)
assert.equal(state().seed,seed)
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(el,'Missing '+selector);
assert(!el.disabled,'Disabled '+selector);
assert(window.rtk2,'Initialisation:
'+document.getElementById('loadStatus').textContent);
assert(document.getElementById('loading').hidden);
assert(rasterFiles.includes('./assets/artwork/'+file+'-v31.webp'));
assert(rasterFiles.includes('./assets/artwork/'+file+'-v30.webp'));
assert.equal(document.querySelectorAll('#launchMenu button').length,3);
assert(!window.rtk2.state);
assert(document.getElementById('game').hidden)
```

<a id="tests-v55-ui-tests-mjs"></a>
## tests/v55-ui-tests.mjs

Source: [tests/v55-ui-tests.mjs](../tests/v55-ui-tests.mjs). Purpose:
BUG-55-01/02 mounted '+type+' plays supplied recording with stable damage/RNG;
BUG-55-03 mounted capture-release return plays supplied moving gallop and exits
cleanly.

Shared inputs: `package.json`, `index.html`, `style.css`,
`./assets/artwork/fire-v42.webp`, `-v31.webp`, `-v30.webp`,
`config/scenarios.json`, `config/province-terrain.json`, `v55.json`,
`audiomass-charge_scream.mp3`,
`freesound_community-sword-battle-jingle-loop-96983.mp3`,
`native-effect-13.mp3`, `/audiomass-horse_gallop.mp3`. Dependencies/entry
points: `../mjs/raster-world.mjs`, `../mjs/original-deployment.mjs`,
`../mjs/geography.mjs`, `node:fs`, `node:path`, `node:assert/strict`, `jsdom`,
`@napi-rs/canvas`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-55-01/02 mounted '+type+' plays supplied recording with stable
damage/RNG][test-source-583]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-55-01/02 mounted '+type+' plays supplied recording with stable
damage/RNG',async()=>{ const
g=fresh();g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000})
;while(g.s.battle.phase==='deployment')aiBattle(g);g.s.battle.side='attack';g.s.
battle.selected=0;await load(g); const
b=battle(),u=b.units.find(v=>v.id===0),friend=b.units.find(v=>v.id===34),target=
b.units.find(v=>v.side==='defend'&&v.id!==b.leaders.defend);;b.terrain=Array(156
).fill(0);b.terrain[155]=6;b.palace={q:12,r:11};b.weather='sunny';b.fire={};let
r=0;for(const v of
b.units)Object.assign(v,{q:0,r:r++,soldiers:10000,weapons:10000,war:100,training
:100,mobility:10,ordered:false,routed:false,fled:false,capt … (complete
input/procedure at linked L37–41)
```

**Required output / success criteria**

```text
assert(target)
assert(node)
assert.equal(b.lastAction.type,type)
assert.equal(plays(file)-before,type==='simultaneous'?b.lastAction.exchanges:1)
assert.equal(plays('native-effect-13.mp3'),oldNative)
assert.equal(JSON.stringify(b.units),resolved)
assert.equal(state().seed,seed)
assert.equal(b.actionSerial,serial)
```

---

**Case / what it tests**

2. [BUG-55-03 mounted capture-release return plays supplied moving gallop and
exits cleanly][test-source-584]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-55-03 mounted capture-release return plays supplied moving gallop and
exits cleanly',async()=>{ const
g=fresh();g.s.humanRulers=[0,1];g.random=()=>.99;g.execute('diplomaticMission',{
province:9,officer:34,target:1,mode:'gift',amount:100});const
j=g.s.journey,leg=j.legs[0];leg.index=leg.route.length-1;j.interception={owner:1
,province:leg.route[leg.index],officer:34};await
load(g);click('#captureMessenger');await
waitUntil(()=>document.getElementById('freeCaptive'));click('#freeCaptive');awai
t waitUntil(()=>state().journey?.type==='messengerReturn');;let
movingObserved=false,n=0; while(state().journey){const
before=state().journey.legs[0].index;click('#continueJourney');await wait(10 …
(complete input/procedure at linked L42–46)
```

**Required output / success criteria**

```text
assert.equal(state().journey.phase,'return')
assert(++n<80)
assert(movingObserved)
assert(media.filter(a=>a.src.includes('/audiomass-horse_gallop.mp3')).every(a=>a
.paused))
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(el,'Missing '+selector);
assert(!el.disabled,'Disabled '+selector);
assert(window.rtk2,'Initialisation:
'+document.getElementById('loadStatus').textContent);
assert(document.getElementById('loading').hidden);
assert(rasterFiles.includes('./assets/artwork/'+file+'-v31.webp'));
assert(rasterFiles.includes('./assets/artwork/'+file+'-v30.webp'));
assert.equal(document.querySelectorAll('#launchMenu button').length,3);
assert(!window.rtk2.state);
assert(document.getElementById('game').hidden)
```

<a id="tests-v56-tests-mjs"></a>
## tests/v56-tests.mjs

Source: [tests/v56-tests.mjs](../tests/v56-tests.mjs). Purpose: BUG-56-01
concealed jungle accepts coordinate Charge; direct hidden identity and friendly
guesses reject atomically; BUG-56-02 empty jungle Normal/Simultaneous/Charge
spend one daily order, preserve MP/RNG and select next ready general; BUG-56-03
48 native charge arrival and 24 real capture/commander terminal vectors match
actual engine; additional cases below.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`, `.json`,
`-v56.json`, `docs/native-settlement-v56.json`. Dependencies/entry points:
`../mjs/native-settlement.mjs`, `node:assert/strict`, `node:fs`,
`node:child_process`, `node:os`, `node:path`, `../mjs/battle.mjs`,
`../mjs/battle-presentation.mjs`, `../mjs/strategy.mjs`,
`../mjs/campaign-decisions.mjs`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-56-01 concealed jungle accepts coordinate Charge; direct hidden identity
and friendly guesses reject atomically][test-source-585]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-01 concealed jungle accepts coordinate Charge; direct hidden
identity and friendly guesses reject atomically',()=>{const
f=fixture();act(f.g,'charge',{unit:0,q:7,r:6});;;;for(const friendly of
[false,true]){const f=fixture();if(friendly)f.b.units[1].side='attack';const
before=JSON.stringify(f.b);;;;}})
```

**Required output / success criteria**

```text
assert.equal(f.b.lastAction.target,1)
assert(f.b.units[0].ordered)
assert.equal(f.b.units[0].mobility,7)
assert.throws(()=>act(f.g,'charge',friendly?{unit:0,q:7,r:6}:{unit:0,target:1}))
assert.equal(JSON.stringify(f.b),before)
assert.equal(f.calls(),0)
```

---

**Case / what it tests**

2. [BUG-56-02 empty jungle Normal/Simultaneous/Charge spend one daily order,
preserve MP/RNG and select next ready general][test-source-586]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-02 empty jungle Normal/Simultaneous/Charge spend one daily order,
preserve MP/RNG and select next ready general',()=>{for(const action of
['attack','simultaneous','charge']){const
f=fixture();Object.assign(f.b.units[1],{q:10,r:9});const
men=f.b.units.map(u=>u.soldiers);act(f.g,action,{unit:0,q:7,r:6});;;;;;;;;}})
```

**Required output / success criteria**

```text
assert(f.b.units[0].ordered)
assert.equal(f.b.units[0].orderDay,1)
assert.equal(f.b.selected,2)
assert.equal(f.b.units[0].mobility,7)
assert.equal(f.calls(),0)
assert.deepEqual(f.b.units.map(u=>u.soldiers),men)
assert(!f.b.lastAction.combatUnits)
assert.throws(()=>act(f.g,action,{unit:0,q:7,r:6}),/completed/)
```

---

**Case / what it tests**

3. [BUG-56-03 48 native charge arrival and 24 real capture/commander terminal
vectors match actual engine][test-source-587]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-03 48 native charge arrival and 24 real capture/commander terminal
vectors match actual engine',()=>{const
tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rtk2-v56-'));try{for(const
[tool,native,count]of
[['charge-arrival-remaster','native-charge-arrival',48],['charge-terminal-remast
er','native-charge-terminal',24]]){const
out=path.join(tmp,tool+'.json');execFileSync(process.execPath,[path.join(app,'to
ols/verify-'+tool+'-v56.mjs'),app,path.join(app,'docs/'+native+'-v56.json'),out]
);const
rows=JSON.parse(fs.readFileSync(out));;;}}finally{fs.rmSync(tmp,{recursive:true,
force:true});}})
```

**Required output / success criteria**

```text
assert.equal(rows.length,count)
assert(rows.every(r=>r.pass),JSON.stringify(rows.filter(r=>!r.pass)))
```

---

**Case / what it tests**

4. [BUG-56-04 simultaneous status has one neutral both-camp summary followed by
each individual once; stale action never
repeats][test-source-588]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-04 simultaneous status has one neutral both-camp summary followed
by each individual once; stale action never repeats',()=>{for(const side of
['attack','defend']){const
f=fixture();f.b.terrain.fill(0);if(side==='defend'){f.b.side=side;for(const u of
f.b.units)u.side=u.side==='attack'?'defend':'attack';}act(f.g,'simultaneous',{un
it:0,target:1});const
rows=f.b.lastAction.lossRows,status=battleStatusMessages(f.b,0,id=>f.g.officer(i
d).name,false,false),summary=status.filter(m=>m.text.startsWith('Simultaneous
attack:'));;for(const camp of ['attack','defend']);for(const row of
rows);;f.b.messages.push({serial:++f.b.eventSerial,text:'Next order
completed.',day:1});const later=battleSta … (complete input/procedure at linked
L10–10)
```

**Required output / success criteria**

```text
assert.equal(summary.length,1)
assert(summary[0].text.includes((camp==='attack'?'Attacker':'Defender')+' lost
'+rows.filter(r=>r.side===camp).reduce((n,r)=>n+r.loss,0).toLocaleString()))
assert.equal(status.filter(m=>m.text.startsWith('General
'+row.unit+':')).length,1)
assert.equal(status.length,1+rows.length)
assert(!later.some(m=>m.text.startsWith('Simultaneous attack:')))
```

---

**Case / what it tests**

5. [BUG-56-04 terminal simultaneous capture shows neutral and individual losses
before extra capture status][test-source-589]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-04 terminal simultaneous capture shows neutral and individual
losses before extra capture status',()=>{const
f=fixture();f.b.terrain.fill(0);Object.assign(f.b.units[1],{soldiers:1,weapons:1
,war:0,training:0});act(f.g,'simultaneous',{unit:0,target:1});const
status=battleStatusMessages(f.b,0,id=>f.g.officer(id).name,false,false);;for(let
i=0;i<f.b.lastAction.lossRows.length;i++);;})
```

**Required output / success criteria**

```text
assert(status[0].text.startsWith('Simultaneous attack:'))
assert(status[i+1].text.startsWith('General
'+f.b.lastAction.lossRows[i].unit+':'))
assert(status.at(-1).text.includes('captured'))
```

---

**Case / what it tests**

6. [BUG-56-07 all 64 native ordinary captive human/AI decisions and loyalty
initializers match, including loyalty 90/99/100][test-source-590]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-07 all 64 native ordinary captive human/AI decisions and loyalty
initializers match, including loyalty 90/99/100',()=>{const
vectors=read('docs/native-settlement-v56.json').cases.filter(v=>'oldLoyalty'in
v);;for(const v of vectors){const
g=fresh(),id=34,former=g.officer(id).owner;g.officer(id).loyalty=v.oldLoyalty;g.
officer(id).compatibility=v.compatibilityDifference;g.officer(g.ruler(1).leader)
.compatibility=0;g.officer(id).int=35;g.officer(id).war=v.intPlusWar-35;g.ruler(
former).advisor=id;g.ruler(former).relations[1]=100;takeCaptive(g,id,1,g.ruler(1
).home,former);let draws=0;g.random=()=>{draws++;return
(v.jitter+.01)/5;};g.s.humanRulers=v.human?[1]:[0];if(v.human);else resol …
(complete input/procedure at linked L13–13)
```

**Required output / success criteria**

```text
assert.equal(vectors.length,64)
assert(decideCaptive(g,id,'recruit'))
assert.equal(g.officer(id).owner===1,v.recruited)
assert.equal(draws,v.recruited?1:0)
assert.equal(g.officer(id).loyalty,v.newLoyalty)
assert.equal(g.s.provinces.filter(p=>p.officers.includes(id)).length,1)
assert(g.officer(id).dead)
assert.notEqual(g.ruler(former).advisor,id)
```

---

**Case / what it tests**

7. [BUG-56-07 legacy refused ordinary captive remains recruitable;
serving-general loyalty protection remains
separate][test-source-591]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-07 legacy refused ordinary captive remains recruitable;
serving-general loyalty protection remains separate',()=>{const
g=fresh();takeCaptive(g,34,1,g.ruler(1).home,0);g.s.captiveDecisions[0].recruitT
ried=true;;g.random=()=>0;;})
```

**Required output / success criteria**

```text
assert(captiveActions(g,g.s.captiveDecisions[0]).includes('recruit'))
assert(decideCaptive(g,34,'recruit'))
```

---

**Case / what it tests**

8. [BUG-56-02 burning jungle miss processes post-order fire once, then survives
an actual battle save/load][test-source-592]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-02 burning jungle miss processes post-order fire once, then
survives an actual battle save/load',()=>{for(const action of
['attack','simultaneous','charge']){const
g=fresh();g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000})
;while(g.s.battle.phase==='deployment')aiBattle(g);const
b=g.s.battle;b.side='attack';b.selected=0;b.weather='sunny';const
target=b.terrain.map((t,i)=>({t,q:i%13,r:Math.floor(i/13)})).find(p=>p.t===1&&ne
ighbors(p.q,p.r).filter(c=>[0,1,2,5].includes(b.terrain[c.r*13+c.q])).length>=2)
,[actorCell,friendCell]=neighbors(target.q,target.r).filter(c=>[0,1,2,5].include
s(b.terrain[c.r*13+c.q]));const u=b.units.find(u=>u.id===0),friend=b.units.find(
… (complete input/procedure at linked L15–15)
```

**Required output / success criteria**

```text
assert.equal(draws,1)
assert.equal(u.soldiers,before-fireLoss(before,.5))
assert.equal(b.messages.filter(m=>m.text.includes('after the order')).length,1)
assert.equal(u.mobility,mp)
assert.equal(b.selected,34)
assert(restored.s.battle.units.find(v=>v.id===0).ordered)
assert.throws(()=>act(restored,action,{unit:0,q:target.q,r:target.r}),/completed
/)
```

---

**Case / what it tests**

9. [BUG-56-06 nine native abstract escape thresholds and exact RNG order
match][test-source-593]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-06 nine native abstract escape thresholds and exact RNG order
match',()=>{const
vectors=read('docs/native-settlement-v56.json').cases.filter(v=>'threshold'in
v);;for(const v of vectors){const
queue=[v.denominatorRoll/3+.0001,v.bonusRoll/50+.0001,v.finalRoll/100+.0001];;;}
})
```

**Required output / success criteria**

```text
assert.equal(vectors.length,9)
assert.equal(abstractEscape({war:80,int:80,training:80,soldiers:1000},()=>{asser
t(queue.length);return
queue.shift();},{special:v.ruler||v.portraitA3,priorUnclaimedEscape:v.priorUncla
imedEscape}),v.escaped)
assert(queue.length)
assert.equal(queue.length,0)
```

---

**Case / what it tests**

10. [BUG-56-06 actual abstract settlement prefers friendly occupied neighbor
over unclaimed in both candidate orders; chronology and save
agree][test-source-594]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-06 actual abstract settlement prefers friendly occupied neighbor
over unclaimed in both candidate orders; chronology and save
agree',()=>{for(const reverse of [false,true]){const
{g,ids,friendly,empty}=abstractVictory('friendly',reverse),before=JSON.stringify
(empty);g.random=()=>0;g.resolveBattle();;;;;;;validateSave(g.s,scenarios,terrai
ns);}})
```

**Required output / success criteria**

```text
assert(ids.every(id=>friendly.officers.includes(id)))
assert.equal(JSON.stringify(empty),before)
assert.equal(g.s.captiveDecisions.length,0)
assert.equal(g.s.lastBattle.resolution,'native')
assert.equal(g.s.warChronicle[0].commanderResult,'returned')
assert.equal(g.s.warChronicle[0].fates.length,0)
```

---

**Case / what it tests**

11. [BUG-56-06 unclaimed fallback claims the destination and applies subsequent
+50; no eligible refuge captures with no escape
RNG][test-source-595]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
test('BUG-56-06 unclaimed fallback claims the destination and applies subsequent
+50; no eligible refuge captures with no escape RNG',()=>{const
f=abstractVictory('empty');const
defenders=f.b.units.filter(u=>u.side==='defend');;for(const u of
defenders)Object.assign(u,{war:80,int:80,training:80,soldiers:1000,weapons:1000}
);let draws=0;f.g.random=()=>{const
draw=draws++,index=draw%3;if(draw>=defenders.length*3)return .99;return
index===2?(draw<3?.5:.99):0;};f.g.resolveBattle();;;; // one separate spoils
draw validateSave(f.g.s,scenarios,terrains);const n=abstractVictory('none');let
noRefugeDraws=0;n.g.random=()=>{noRefugeDraws++;return
.99;};n.g.resolveBattle();; // only spoils, no escape RNG … (complete
input/procedure at linked L19–21)
```

**Required output / success criteria**

```text
assert(defenders.length>=2)
assert(defenders.every(u=>f.g.officer(u.id).owner===f.b.defender))
assert(defenders.every(u=>f.g.s.provinces.some(p=>p.id!==8&&p.officers.includes(
u.id))))
assert.equal(draws,defenders.length*3+1)
assert.equal(noRefugeDraws,1)
assert.deepEqual(new Set(n.g.s.captiveDecisions.map(c=>c.officer)),new
Set(n.ids))
```


Additional setup/helper or post-suite assertions (also required; parameterized
helper assertions execute per call):

```js
assert(id!==undefined)
```

<a id="tests-v56-ui-tests-mjs"></a>
## tests/v56-ui-tests.mjs

Source: [tests/v56-ui-tests.mjs](../tests/v56-ui-tests.mjs). Purpose: BUG-56-05
actual captured messenger return animates with Web Audio gallop despite denied
HTML autoplay; BUG-56-01/04 mounted concealed Charge or neutral Simultaneous
summary and individual rows.

Shared inputs: `package.json`, `index.html`, `style.css`,
`./assets/artwork/fire-v42.webp`, `-v31.webp`, `-v30.webp`,
`config/scenarios.json`, `config/province-terrain.json`, `v56.json`,
`audiomass-horse_gallop.mp3`. Dependencies/entry points:
`../mjs/raster-world.mjs`, `../mjs/original-deployment.mjs`,
`../mjs/geography.mjs`, `node:fs`, `node:path`, `node:assert/strict`, `jsdom`,
`@napi-rs/canvas`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [BUG-56-05 actual captured messenger return animates with Web Audio gallop
despite denied HTML autoplay][test-source-596]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-56-05 actual captured messenger return animates with Web Audio gallop
despite denied HTML autoplay',async()=>{ const
g=fresh();g.s.humanRulers=[0,1];g.random=()=>.99;g.execute('diplomaticMission',{
province:9,officer:34,target:1,mode:'gift',amount:100});const
j=g.s.journey,leg=j.legs[0];leg.index=leg.route.length-1;j.interception={owner:1
,province:leg.route[leg.index],officer:34};await
load(g);click('#captureMessenger');await
waitUntil(()=>document.getElementById('freeCaptive'));click('#freeCaptive');awai
t waitUntil(()=>state().journey?.type==='messengerReturn');; for(let
n=0;n<2;n++){const before=sources.length;click('#continueJourney');await
waitUntil(()=>window.rtk2.diagnostics. … (complete input/procedure at linked
L36–40)
```

**Required output / success criteria**

```text
assert.equal(state().journey.phase,'return')
assert.equal(loops.length,1)
assert(loops[0].loop)
assert.equal(media.filter(a=>a.src.endsWith(horse)).reduce((n,a)=>n+a.plays,0),0
)
assert(sources.filter(s=>s.buffer.src.endsWith('/'+horse)).every(s=>s.stopped))
```

---

**Case / what it tests**

2. [BUG-56-01/04 mounted concealed Charge or neutral Simultaneous summary and
individual rows][test-source-597]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
check('BUG-56-01/04 mounted concealed Charge or neutral Simultaneous summary and
individual rows',async()=>{ const
g=fresh();g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000})
;while(g.s.battle.phase==='deployment')aiBattle(g);g.s.battle.side='attack';g.s.
battle.selected=0;await load(g); const
b=battle(),u=b.units.find(v=>v.id===0),friend=b.units.find(v=>v.id===34),target=
b.units.find(v=>v.side==='defend'&&v.id!==b.leaders.defend);;b.terrain=Array(156
).fill(0);b.terrain[155]=6;b.palace={q:12,r:11};b.weather='sunny';b.fire={};let
r=0;for(const v of
b.units)Object.assign(v,{q:0,r:r++,soldiers:10000,weapons:10000,war:80,training:
80,mobility:10,ordered:false,routed:false,fled: … (complete input/procedure at
linked L41–49)
```

**Required output / success criteria**

```text
assert(target)
assert(node)
assert.equal(b.lastAction.type,type)
assert.equal(texts.filter(t=>t.startsWith('Simultaneous attack:')).length,1)
assert(summary.includes('Attacker lost')&&summary.includes('Defender lost'))
assert(!texts.some(t=>t.includes('initiated a simultaneous attack')))
assert.equal(texts.filter(t=>t.startsWith(state().officers[row.unit].name+':')).
length,1)
assert.equal(JSON.stringify(b.units),resolved)
assert.equal(state().seed,seed)
```


<a id="tools-ai-rules-mjs"></a>
## tools/ai-rules.mjs

Source: [tools/ai-rules.mjs](../tools/ai-rules.mjs). Purpose: All assertion
blocks / parameterized vector matrix.

Shared inputs: `config/scenarios.json`, `config/province-terrain.json`,
`config/ai-config.json`, `config/game-config.yaml`. Dependencies/entry points:
`node:fs`, `node:path`, `node:crypto`, `node:url`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [All assertion blocks / parameterized vector
matrix][test-source-598]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const root=fileURLToPath(new URL('../',import.meta.url)); const ui=new
Set(['app.mjs','raster-world.mjs','ai-diagnostics.mjs','artwork.mjs','portraits.
mjs','events.mjs','game-ui.mjs','province-ui.mjs','province-choice.mjs','message
-playback.mjs','screen-wake-lock.mjs','audio.mjs','battle-turn-cue.mjs','battle-
presentation.mjs','courier-motion.mjs','battle-summary.mjs','ai-rules-id.mjs']);
export function currentAIRulesId(){const
hash=crypto.createHash('sha256'),files=fs.readdirSync(path.join(root,'mjs')).fil
ter(n=>n.endsWith('.mjs')&&!ui.has(n)).map(n=>'mjs/'+n).concat(['config/scenario
s.json','config/province-terrain.json','config/ai-config.json','config/game-conf
ig.yaml']).sort();for(const … (complete input/procedure at linked L1–9)
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```


<a id="tools-verify-charge-arrival-raster-v56-mjs"></a>
## tools/verify-charge-arrival-raster-v56.mjs

Source: [tools/verify-charge-arrival-raster-v56.mjs][test-source-599]. Purpose:
All assertion blocks / parameterized vector matrix.

Shared inputs: `package.json`, `docs/native-charge-arrival-v56.json`,
`/tmp/charge-arrival-raster-v56.json`. Dependencies/entry points: `node:fs`,
`node:assert/strict`, `node:path`, `node:url`, `node:module`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [All assertion blocks / parameterized vector
matrix][test-source-600]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const app=path.resolve(process.argv[2]||new
URL('../',import.meta.url).pathname),require=createRequire(path.join(process.arg
v[5]?path.resolve(process.argv[5]):app,'package.json')); const
{JSDOM}=require('jsdom'),canvasLib=require('@napi-rs/canvas'); const
{act,direction,distance}=await
import(pathToFileURL(path.join(app,'mjs/battle.mjs'))); const
{createRasterWorld}=await
import(pathToFileURL(path.join(app,'mjs/raster-world.mjs'))); const dom=new
JSDOM('<div id="world"><canvas id="scene"></canvas><div
id="labels"></div></div>',{pretendToBeVisual:true});globalThis.document=dom.wind
ow.document;globalThis.ResizeObserver=class{constructor(cb){this.cb=cb;}observe(
){this.cb();}disconnect(){}}; dom … (complete input/procedure at linked L1–22)
```

**Required output / success criteria**

```text
assert(done)
assert.deepEqual(seen.map(x=>x.type),['charge','ambush','ambush','ambush'])
assert.equal(cues.filter(x=>x[0]==='ambush').length,24)
assert.equal(JSON.stringify(b.units),state)
assert.equal(calls,rng)
```


<a id="tools-verify-charge-arrival-remaster-v56-mjs"></a>
## tools/verify-charge-arrival-remaster-v56.mjs

Source: [tools/verify-charge-arrival-remaster-v56.mjs][test-source-601].
Purpose: All assertion blocks / parameterized vector matrix.

Shared inputs: `docs/native-charge-arrival-v56.json`,
`/tmp/charge-arrival-remaster-v56.json`. Dependencies/entry points: `node:fs`,
`node:path`, `node:url`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [All assertion blocks / parameterized vector
matrix][test-source-602]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const app=path.resolve(process.argv[2]||new
URL('../',import.meta.url).pathname); const
{act,direction,ambushCells,distance}=await
import(pathToFileURL(path.join(app,'mjs/battle.mjs'))); const
{ambushAnimations,combatAnimations}=await
import(pathToFileURL(path.join(app,'mjs/battle-presentation.mjs'))); const
vectors=JSON.parse(fs.readFileSync(process.argv[3]||path.join(app,'docs/native-c
harge-arrival-v56.json'))).cases.filter(v=>v.branch!=='occupation-ended'),result
s=[]; for(const v of vectors){ const
b={phase:'battle',side:'attack',selected:0,day:1,eventSerial:0,actionSerial:0,me
ssages:[],events:[],terrain:Array(156).fill(0),fire:{},weather:'sunny',units:[],
attacker:0,defender:1,rulers:{att … (complete input/procedure at linked L1–21)
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```


<a id="tools-verify-charge-terminal-remaster-v56-mjs"></a>
## tools/verify-charge-terminal-remaster-v56.mjs

Source: [tools/verify-charge-terminal-remaster-v56.mjs][test-source-603].
Purpose: All assertion blocks / parameterized vector matrix.

Shared inputs: `docs/native-charge-terminal-v56.json`,
`/tmp/charge-terminal-remaster-v56.json`. Dependencies/entry points: `node:fs`,
`node:path`, `node:url`.

Outputs: each listed PASS/group or script summary on success; thrown assertions
or collected failures give a failing process exit. All loop iterations in each
row must pass. Asset/source assertions inspect files; state/RNG assertions
inspect engine outcomes; Audio/JSDOM/Canvas fixtures inspect integration calls.

---

**Case / what it tests**

1. [All assertion blocks / parameterized vector
matrix][test-source-604]

**Inputs and procedure (source excerpt; shared helpers above)**

```text
const app=path.resolve(process.argv[2]||new
URL('../',import.meta.url).pathname),{act}=await
import(pathToFileURL(path.join(app,'mjs/battle.mjs'))),{ambushAnimations}=await
import(pathToFileURL(path.join(app,'mjs/battle-presentation.mjs'))); const
vectors=JSON.parse(fs.readFileSync(process.argv[3]||path.join(app,'docs/native-c
harge-terminal-v56.json'))).cases,rows=[]; for(const v of vectors){ const
b={phase:'battle',side:'attack',selected:0,day:1,eventSerial:0,actionSerial:0,me
ssages:[],events:[],terrain:Array(156).fill(0),fire:{},weather:'sunny',units:[],
attacker:0,defender:1,rulers:{attack:99,defend:98},leaders:{attack:0,defend:v.ta
rgetCommander?1:2},palace:{q:12,r:11},food:{attack:10000,d … (complete
input/procedure at linked L1–13)
```

**Required output / success criteria**

```text
This checkpoint logs completion; assertions may be shared with preceding setup.
Use the full linked block when judging independent coverage.
```


<a id="tools-verify-deployment-py"></a>
## tools/verify-deployment.py

Source: [tools/verify-deployment.py](../tools/verify-deployment.py). Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: `docs/deployment-v32.json`, `config/province-terrain.json`,
`config/scenarios.json`. Dependencies/entry points: `pathlib`, `argparse,
hashlib, json`.

### Inputs, procedure and expected outputs

Verify all 41 original terrain/zone maps against the committed deployment audit.

CLI, input identity and report writes (literal source):

```python
parser.add_argument('hexdata', type=Path)
args = parser.parse_args()
print('41 terrain/defender-zone maps and 186 five-cell attacker approaches match
original Hexdata.dat.')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L16
for p in provinces:
# L21
    for source in p['neighbors']:
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[11](../tools/verify-deployment.py#L11)

**Required assertion / subcase oracle**

```text
assert hashlib.sha256(data).hexdigest() == audit['resourceSha256'], 'Different
resource edition or bytes'
```

---

**Source line**

[14](../tools/verify-deployment.py#L14)

**Required assertion / subcase oracle**

```text
assert len(terrain) == len(provinces) == 41
```

---

**Source line**

[18](../tools/verify-deployment.py#L18)

**Required assertion / subcase oracle**

```text
assert list(data[start:start + 156]) == terrain[p['id'] - 1], p['id']
```

---

**Source line**

[20](../tools/verify-deployment.py#L20)

**Required assertion / subcase oracle**

```text
assert sum(z == p['id'] for z in zones) == 20, p['id']
```

---

**Source line**

[23](../tools/verify-deployment.py#L23)

**Required assertion / subcase oracle**

```text
assert len(cells) == 5, (p['id'], source)
```

---

**Source line**

[24](../tools/verify-deployment.py#L24)

**Required assertion / subcase oracle**

```text
assert all(terrain[p['id'] - 1][r * 13 + q] not in [3, 9, 99] for q, r in cells)
```

---

**Source line**

[27](../tools/verify-deployment.py#L27)

**Required assertion / subcase oracle**

```text
assert expected == actual and len(actual) == 186
```


<a id="tools-verify-native-ai-joint-v54-py"></a>
## tools/verify-native-ai-joint-v54.py

Source: [tools/verify-native-ai-joint-v54.py][test-source-605]. Purpose: bounded
original-executable or deployment/geometry verification; the source's hook
boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `node:fs`, `node:path`, `node:url`,
`argparse,hashlib,json,struct,subprocess`, `pathlib`, `unicorn`,
`unicorn.x86_const`, `fs from 'node:fs';import path from 'node:path';import
{pathToFileURL} from 'node:url';`.

### Inputs, procedure and expected outputs

Portable bounded native simultaneous casualty witness.
Usage: PYTHONPATH=<unicorn-dependencies> python this.py main.exe output.json
--repo <rtk2 root>
Runs original joint assembly, power, casualty, equipment, mutation and stop
branches;
rendering/UI/DOS captive processing are suppressed. No AI training.

CLI, input identity and report writes (literal source):

```python
Usage: PYTHONPATH=<unicorn-dependencies> python this.py main.exe output.json
--repo <rtk2 root>
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Pa
th);p.add_argument('output',type=Path);p.add_argument('--repo',type=Path,require
d=True);a=p.parse_args()
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60
order_fixture=json.loads(json.dumps(next(f for f in fixtures if
f['name']=='3-attackers-0-terrain-mixed')))
order_four=json.loads(json.dumps(next(f for f in fixtures if
f['name']=='4-attackers-6-terrain-mixed')))

v=json.loads(json.dumps(f));v.update(name=f['name']+f'-humanTarget{human}-diffic
ulty{difficulty}',humanTarget=human,difficulty=difficulty);expanded.append(v)
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results),inden
t=2)+'\n')
print(len(results),'native AI grouped casualty witnesses passed')
 output.push({name:fixture.name,final,targetLoss:fixture.defender.soldiers-defen
der.soldiers,exchanges:b.lastAction.exchanges,lossRows:b.lastAction.lossRows,rng
Used:rngIndex,text});
node_run=subprocess.run(['node','--input-type=module','-e',node_source,str(a.rep
o.resolve())],input=json.dumps(results),text=True,capture_output=True,check=True
)
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results),inden
t=2)+'\n')
print(len(results),'native AI/remaster casualty, equipment, RNG and exchange
counts matched, including shuffled rosters and human-target difficulty')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L12
def unpack(data):
# L30
for count in [3,4]:
# L31
 for terrain in [0,6]:
# L32
  for power in
['equal','mixed','low-equipment','early-defender-zero','early-attacker-zero']:
# L35
    for i,v in
enumerate(attackers):v.update(war=[45,99,82,63][i],training=[30,85,60,90][i],wea
pons=[1000,5000,2500,3400][i],combatWarBonus=20 if i==1 else 0)
# L38
    for i,v in
enumerate(attackers):v.update(weapons=[25,1000,900,2700][i],war=[92,65,55,83][i]
)
# L53
for f in fixtures:
# L54
 for human,difficulty in [(False,1),(True,1),(True,3),(True,5)]:
# L58
def run(fixture):
# L60
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L61
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L63
 def stats(ptr):return dict(soldiers=word(ptr+0x12),weapons=word(ptr+0x14))
# L64
 def snapshot():return {hex(ptr):stats(ptr) for ptr in allptrs}
# L66
 for i,(ptr,v) in
enumerate(zip(allptrs,fixture['attackers']+[fixture['defender']])):
# L71
 def return_hook(value):
# L73
 def hook(u,at,size,data):
# L95
 for i,x in enumerate(exchanges):
# L120
for native,current in zip(results,node_results):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[13](../tools/verify-native-ai-joint-v54.py#L13)

**Required assertion / subcase oracle**

```text
h=struct.unpack_from('<14H',data);assert h[0]==0x5a4d and h[3]==0
```

---

**Source line**

[14](../tools/verify-native-ai-joint-v54.py#L14)

**Required assertion / subcase oracle**

```text
packed=data[h[4]*16:];stub=h[11]*16;assert packed[stub+14:stub+16]==b'RB'
```

---

**Source line**

[18](../tools/verify-native-ai-joint-v54.py#L18)

**Required assertion / subcase oracle**

```text
opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert
count<=dst+1
```

---

**Source line**

[24](../tools/verify-native-ai-joint-v54.py#L24)

**Required assertion / subcase oracle**

```text
assert src==dst
```

---

**Source line**

[27](../tools/verify-native-ai-joint-v54.py#L27)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60
```

---

**Source line**

[92](../tools/verify-native-ai-joint-v54.py#L92)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,trace[-30:]
```

---

**Source line**

[94](../tools/verify-native-ai-joint-v54.py#L94)

**Required assertion / subcase oracle**

```text
assert targetloss==sum(parts)
```

---

**Source line**

[96](../tools/verify-native-ai-joint-v54.py#L96)

**Required assertion / subcase oracle**

```text
assert x['factor']==len(ptrs)
```

---

**Source line**

[97](../tools/verify-native-ai-joint-v54.py#L97)

**Required assertion / subcase oracle**

```text
assert x['effectiveAttackerLossDivisor']==len(ptrs)+(fixture['difficulty']-1 if
fixture['humanTarget'] else 0)
```

---

**Source line**

[98](../tools/verify-native-ai-joint-v54.py#L98)

**Required assertion / subcase oracle**

```text
if i:assert x['before'][hex(defptr)]==exchanges[i-1]['after'][hex(defptr)]
```

---

**Source line**

[122](../tools/verify-native-ai-joint-v54.py#L122)

**Required assertion / subcase oracle**

```text
assert native['targetLoss']==current['targetLoss'],native['name']
```

---

**Source line**

[123](../tools/verify-native-ai-joint-v54.py#L123)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterSoldiersMatch'],native['name']
```

---

**Source line**

[124](../tools/verify-native-ai-joint-v54.py#L124)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterWeaponsMatch'],native['name']
```

---

**Source line**

[125](../tools/verify-native-ai-joint-v54.py#L125)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterRngCountMatch'],native['name']
```

---

**Source line**

[126](../tools/verify-native-ai-joint-v54.py#L126)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterExchangeCountMatch'],native['name']
```


<a id="tools-verify-native-audio-v50-py"></a>
## tools/verify-native-audio-v50.py

Source: [tools/verify-native-audio-v50.py](../tools/verify-native-audio-v50.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`, `argparse, hashlib, importlib.util, json,
struct`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Catalogue and execute all 16 native effect sequences against a mocked OPLDRV
boundary.
No DOS/synthesizer or sound-driver waveform parity is claimed. Original bytes
stay private.
Requires Unicorn. Supply the original packed English executable as the first
argument.

CLI, input identity and report writes (literal source):

```python
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args()
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
out={'originalSha256':original.EXPECTED,'unpackedSha256':hashlib.sha256(image).h
exdigest(),'imageBytes':len(image),'driverSignature':'OPLDRV','effectCount':16,'
musicAcceptedIds':list(range(21)),'effects':entries,'staticFarCallCandidates':re
fs,'checks':checks,'checkCount':len(checks),'limits':['External OPLDRV and
original song data are absent; no original waveforms or BGM melodies were
recovered.','Driver interrupt and waits are hooked; the native dispatch and
effect sequences execute unchanged.','Effect labels come from call-site strings
and controlled native routines; ID15 use remains unresolved.','Static far-call
candidates can include data and are not an exhaustive dynamically reachable call
graph.']}
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps
(out,indent=2)+'\n');print(json.dumps({'effects':len(entries),'checks':len(check
s),'originalSha256':out['originalSha256'],'unpackedSha256':out['unpackedSha256']
}))
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L16
def run(start,arg,sound=True,driver=True,music=True):
# L18
 for reg,val in
[(UC_X86_REG_DS,DS//16),(UC_X86_REG_SS,DS//16),(UC_X86_REG_SP,0xff00),(UC_X86_RE
G_CS,0x6eb),(UC_X86_REG_IP,start-0x6eb0)]:u.reg_write(reg,val)
# L19
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L20
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L22
 def hook(u,at,size,data):
# L39
for i in range(16):
# L45
 for sound,driver in [(False,True),(True,False)]:
# L48
for i in range(22):
# L52
for sound,driver,music in [(True,True,False),(True,False,True)]:
# L57
for at in range(DS-4):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[11](../tools/verify-native-audio-v50.py#L11)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
```

---

**Source line**

[13](../tools/verify-native-audio-v50.py#L13)

**Required assertion / subcase oracle**

```text
assert image[DS+0x342a:DS+0x3431]==b'OPLDRV\x00'
```

---

**Source line**

[27](../tools/verify-native-audio-v50.py#L27)

**Required assertion / subcase oracle**

```text
assert
word(sp+4)==0x66;packet=word(sp+6);op=u.mem_read(DS+packet+1,1)[0];item={'comman
d':op,'argument':u.mem_read(DS+packet,1)[0]}
```

---

**Source line**

[35](../tools/verify-native-audio-v50.py#L35)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000
```

---

**Source line**

[41](../tools/verify-native-audio-v50.py#L41)

**Required assertion / subcase oracle**

```text
calls=run(0x73a0,i);assert calls[0]['command']==5 and
calls[0]['patchOffset']==hex(0x3970+i*22)
```

---

**Source line**

[42](../tools/verify-native-audio-v50.py#L42)

**Required assertion / subcase oracle**

```text
assert any(c.get('command')==6 for c in calls)
```

---

**Source line**

[46](../tools/verify-native-audio-v50.py#L46)

**Required assertion / subcase oracle**

```text
calls=run(0x73a0,i,sound=sound,driver=driver);assert not any('command' in c for
c in calls)
```

---

**Source line**

[50](../tools/verify-native-audio-v50.py#L50)

**Required assertion / subcase oracle**

```text
assert play==([{'command':1,'argument':i+1}] if i<21 else [])
```

---

**Source line**

[53](../tools/verify-native-audio-v50.py#L53)

**Required assertion / subcase oracle**

```text
assert not any(c.get('command')==1 for c in
run(0x6f46,2,sound,driver,music));checks.append({'rule':'Music independently
gated','driver':driver,'music':music})
```


<a id="tools-verify-native-battle-v53-py"></a>
## tools/verify-native-battle-v53.py

Source:
[tools/verify-native-battle-v53.py](../tools/verify-native-battle-v53.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: `/workspace/scratch/7c8707393eee/native-battle-witness-v53.json`.
Dependencies/entry points: `pathlib`, `sys,json`.

### Inputs, procedure and expected outputs

from pathlib import Path
import sys,json
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+'
ORIGINAL_MAIN_EXE OUTPUT_JSON')
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in
[89,90]:')[0].replace("Path(__file__).with_name('verify-original.py')","Path(__f
ile__).with_name('verify-original.py')"))
results=[]
for side in [0,2]:
 for leader in [False,True]:
  for palace in [False,True]:
   for difficulty in [1,5]:

CLI, input identity and report writes (literal source):

```python
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+'
ORIGINAL_MAIN_EXE OUTPUT_JSON')
Path('/workspace/scratch/7c8707393eee/native-battle-witness-v53.json').write_tex
t(json.dumps(dict(originalSha256=original.EXPECTED,cases=results),indent=2)+'\n'
)
print(len(results),'native v53 witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L7
for side in [0,2]:
# L8
 for leader in [False,True]:
# L9
  for palace in [False,True]:
# L10
   for difficulty in [1,5]:
# L11
    def setup(u,w):
# L15
     for ptr,(q,r),flag in [(0x9000,(6,7),129 if side==0 else
132),(0x9100,(7,7),1 if side==0 else 4),(0x9200,(7,6),4 if side==0 else
1)]:w(ptr+0x18,'B',(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L17
    def target(u,w,word,byte,sp,seen):w(0xb8e4,'H',0x9200)
# L18
    def
exchange(u,w,word,byte,sp,seen):seen.append(dict(attacker=hex(word(sp+4)),defend
er=hex(word(sp+6)),factor=word(sp+8)));return 255
# L23

results.append(dict(test='AI-JOINT-PALACE-PRIORITY',nativeSide=side,commander=le
ader,sourcePalace=palace,difficulty=difficulty,selectedMode=2,exchangeCalls=seen
,limits='Target selection, leader identity, charge predicate and strategic
commander-risk predicate controlled; original attack selection, original
adjacency and original joint exchange assembly execute unchanged.'))
# L25
for sideflag in [1,4]:
# L26
 for before in [0,16,128,144]:
# L27
  def
setup(u,w):arena(u,w);w(0xb9d0+4*13+7,'B',1);w(0xba6c+4*13+7,'B',sideflag|before
)
# L28
  def
redraw(u,w,word,byte,sp,seen):seen.append(dict(terrainOnly=[word(sp+4)&255,word(
sp+6)&255]))
# L31

results.append(dict(test='JUNGLE-DRAW-NO-TURN-EXCEPTION',ownSideFlag=sideflag,fl
agsBefore=sideflag|before,flagsAfter=byte(0xba6c+4*13+7),calls=seen,limits='Exec
utes original draw branch; establishes terrain-only redraw in jungle, not
complete visibility state machine.'))
# L33
for men in [99,100,101,1000,9999]:
# L34
 for burning in [False,True]:
# L35
  def setup(u,w):arena(u,w);w(0x9112,'H',men);w(0xba6c+4*13+7,'B',4|(32 if
burning else 0))
# L36
  def
rng(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4)));return
max(0,word(sp+4)-1)
# L37
  def
depletion(u,w,word,byte,sp,seen):seen.append(dict(fireDeath=hex(word(sp+4))));re
turn 0
# L41

results.append(dict(test='FIRE-REIGNITE-NATIVE-5PERCENT',menBefore=men,alreadyBu
rning=burning,loss=loss,menAfter=0 if men<100 else
word(0x9112),flagsAfter=byte(0xba6c+4*13+7),calls=seen,limits='Ignition +
immediate native casualty arithmetic run unchanged; rendering, death processing,
proportional weapon mutation and RNG are hooked.'))
# L43
for terrain in [0,1,2,3,4,5,6]:
# L44
 for actorINT,targetINT in [(60,60),(90,60),(60,90)]:
# L45
  for weather in [0,1,2,3]:
# L47
   def
setup(u,w):arena(u,w);w(0x9004,'B',actorINT);w(0x9104,'B',targetINT);w(0xb9d0+4*
13+7,'B',terrain);w(0xcaad,'B',weather)
# L48
   def rng(u,w,word,byte,sp,seen):draws.append(word(sp+4));return
max(0,word(sp+4)-1)
# L49
   def
chance(u,w,word,byte,sp,seen):seen.append(dict(chance=word(sp+4)&255));return 1
# L54

results.append(dict(test='FIRE-CHANCE-NATIVE-TERRAIN-INT-WEATHER',terrain=terrai
n,actorINT=actorINT,targetINT=targetINT,weather=weather,chance=expected,rngBound
s=draws))
# L55
for controller in ['human','AI']:
# L56
 for ambushers in [0,1,2]:
# L57
  def setup(u,w):
# L60
   for index,ptr,(q,r) in [(1,0x9200,(5,3)),(2,0x9300,(6,3))]:
# L62
  def
ambushed(u,w,word,byte,sp,seen):seen.append(dict(victim=[word(sp+4)&255,word(sp+
6)&255],ambusher=[word(sp+8)&255,word(sp+10)&255]));return 0
# L68

results.append(dict(test='PULL-ENEMY-AUTOAMBUSH',controller=controller,oldEnemyH
ex=[7,4],newEnemyHex=[6,4],enemyMobilityUnchanged=7,ambushers=ambushers,calls=se
en,limits='Actual original pull eligibility, relocation, movement direction,
skip-puller, forward arc and jungle checks run unchanged; RNG, render and ambush
casualty body hooked.'))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[21](../tools/verify-native-battle-v53.py#L21)

**Required assertion / subcase oracle**

```text
assert byte(0xb8d6)==2,(side,leader,palace,difficulty,seen,byte(0xb8d6))
```

---

**Source line**

[22](../tools/verify-native-battle-v53.py#L22)

**Required assertion / subcase oracle**

```text
assert
seen==[dict(attacker='0x9000',defender='0x9200',factor=2),dict(attacker='0x9100'
,defender='0x9200',factor=2)],seen
```

---

**Source line**

[30](../tools/verify-native-battle-v53.py#L30)

**Required assertion / subcase oracle**

```text
assert seen==[dict(terrainOnly=[7,4])] and byte(0xba6c+4*13+7)==sideflag|144
```

---

**Source line**

[40](../tools/verify-native-battle-v53.py#L40)

**Required assertion / subcase oracle**

```text
assert loss==expected,(men,burning,seen,loss,expected)
```

---

**Source line**

[53](../tools/verify-native-battle-v53.py#L53)

**Required assertion / subcase oracle**

```text
assert seen==([] if expected is None else
[dict(chance=expected)]),(terrain,actorINT,targetINT,weather,seen,expected)
```

---

**Source line**

[66](../tools/verify-native-battle-v53.py#L66)

**Required assertion / subcase oracle**

```text
assert byte(0x9118)==0x64 and byte(0x9117)==7
```

---

**Source line**

[67](../tools/verify-native-battle-v53.py#L67)

**Required assertion / subcase oracle**

```text
assert seen==[dict(victim=[6,4],ambusher=p) for p in ([[5,3]] if ambushers==1
else [[5,3],[6,3]] if ambushers==2 else [])],(controller,ambushers,seen)
```


<a id="tools-verify-native-battle-py"></a>
## tools/verify-native-battle.py

Source: [tools/verify-native-battle.py](../tools/verify-native-battle.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse, hashlib, importlib.util, json, math,
random, struct`, `pathlib`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

v33 bounded native ambush, flight, Train and Give vectors (optional unicorn).
UI, ownership and random calls have controlled hooks; arithmetic runs unchanged.
This is not DOS execution or a full native battle simulation.

CLI, input identity and report writes (literal source):

```python
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Pa
th);p.add_argument('output',type=Path);a=p.parse_args()
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps
(out,separators=(',',':'))+'\n')
print(f'{sum(map(len,out.values()))} controlled native v33 vectors passed;
arithmetic unchanged, bounded UI/RNG/ownership hooks')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L13
def write(u,at,fmt,*values):u.mem_write(DS+at,struct.pack(fmt,*values))
# L14
def execute(start,args,setup,rolls=(),hooks=None):
# L18
    def hook(u,at,size,data):
# L31
def unit(u,ptr,x):
# L34
def readword(u,at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L37
for i in range(240):
# L40
    def setup(u):
# L42
    def lookup(u,sp,o):return 0x9000 if readword(u,sp+4)&255==5 else 0x9100
# L43
    def humanhook(u,sp,o):return int(human and readword(u,sp+4)==0x9100)
# L48
for i in range(240):
# L51
    def setup(u):unit(u,0x9000,x)
# L52
    def probability(u,sp,o):
# L60
for i in range(160):
# L62
    def setup(u):
# L64
        for j,x in enumerate(armies):write(u,0x9100+48*j,'H',0x9100+48*(j+1) if
j+1<len(armies) else
0);write(u,0x9112+48*j,'H',x['soldiers']);write(u,0x9116+48*j,'B',x['training'])
# L68
for i in range(160):
# L70
    def
setup(u):write(u,0x339a,'H',0x9000);write(u,0x9002,'H',0x9100);write(u,0x900e,'H
',population//100);write(u,0x9017,'B',50);write(u,0x9106,'B',governor);write(u,0
x9206,'B',actor);write(u,0x33b3,'B',D)
# L74
for q in [5,6]:
# L75
    for d in range(6):
# L76
        def setup(u):write(u,0x9000,'BB',q,5)
# L81
        for direction in arcs:
# L82
            def setup(u):write(u,0x9000,'BB',*to)
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[11](../tools/verify-native-battle.py#L11)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
```

---

**Source line**

[23](../tools/verify-native-battle.py#L23)

**Required assertion / subcase oracle**

```text
assert 0<=value<bound or bound==0,(at,value,bound)
```

---

**Source line**

[29](../tools/verify-native-battle.py#L29)

**Required assertion / subcase oracle**

```text
u.emu_start(start,0x60001,count=100000);assert u.reg_read(UC_X86_REG_CS)==0x6000
```

---

**Source line**

[58](../tools/verify-native-battle.py#L58)

**Required assertion / subcase oracle**

```text
assert chance==expected,(chance,expected,x)
```

---

**Source line**

[66](../tools/verify-native-battle.py#L66)

**Required assertion / subcase oracle**

```text
assert gain==2*war//math.isqrt(1+sum(x['soldiers']//100 for x in armies if
x['training']!=100))
```

---

**Source line**

[72](../tools/verify-native-battle.py#L72)

**Required assertion / subcase oracle**

```text
gain&=255;assert
gain==((governor+actor)//2*math.isqrt(food)//((6+D)*math.isqrt(population//100))
)&255
```

---

**Source line**

[79](../tools/verify-native-battle.py#L79)

**Required assertion / subcase oracle**

```text
assert direction&255==d
```


<a id="tools-verify-native-captive-audio-v54-py"></a>
## tools/verify-native-captive-audio-v54.py

Source: [tools/verify-native-captive-audio-v54.py][test-source-606]. Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`, `argparse,hashlib,json,struct,math`,
`unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Bounded English main.exe captive and keyboard/audio witnesses.
Run: PYTHONPATH=/path/to/unicorn python native-captive-audio-v54.py MAIN.EXE
OUTPUT.json
No repo imports, no original bytes are exported. Each case describes suppressed
paths.

CLI, input identity and report writes (literal source):

```python
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps
(dict(originalSha256=EXPECTED,unpackedSha256=hashlib.sha256(IMAGE).hexdigest(),c
ases=cases,count=len(cases)),indent=2)+'\n');print(len(cases),'native v54
captive/audio witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L23
def run(start,cs,args,setup,hooks):
# L25
 for reg,val in
[(UC_X86_REG_DS,DS//16),(UC_X86_REG_SS,DS//16),(UC_X86_REG_SP,0xff00)]:u.reg_wri
te(reg,val)
# L26
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L27
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L28
 def byte(at):return u.mem_read(DS+at,1)[0]
# L30
 def hook(u,at,size,data):
# L42
for surviving in [0,1,2]:
# L43
 for hostility in [0,50,80,100]:
# L44
  def setup(u,w):
# L47
   for i in range(41):w(0x2dc4+i*0x23+0x10,'B',1 if i<surviving else 255)
# L48
  def
printed(u,w,word,byte,sp,seen):seen.append(dict(textOffset=hex(word(sp+4))))
# L49
  def
choice(u,w,word,byte,sp,seen):seen.append(dict(choiceRange=[word(sp+4),word(sp+6
)]));return 1
# L50
  def
release(u,w,word,byte,sp,seen):seen.append(dict(released=hex(word(sp+4))));retur
n 0
# L51
  def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
# L54
  cases.append(dict(rule='Human captured ruler menu remains Set free/Behead
independent of surviving province count and
hostility',survivingProvinces=surviving,hostility=hostility,events=seen,suppress
ed=['portrait/text renderer','input return uses Set free1','release
settlement9FC6: witness proves invocation only','effect dispatcher records cue7
without audio']))
# L56
for surviving in [0,1]:
# L57
 def setup(u,w):
# L61
  for i in range(41):w(0x2dc4+i*0x23+0x10,'B',1 if i<surviving else 255)
# L62
 def
printed(u,w,word,byte,sp,seen):seen.append(dict(textOffset=hex(word(sp+4))))
# L63
 def
choice(u,w,word,byte,sp,seen):seen.append(dict(choiceRange=[word(sp+4),word(sp+6
)]));return 1
# L64
 def
release(u,w,word,byte,sp,seen):seen.append(dict(released=hex(word(sp+4))));retur
n 0
# L65
 def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
# L68
 cases.append(dict(rule='Full native captive list defers ruler and uses special
menu even with zero
provinces',survivingProvinces=surviving,events=seen,suppressed=['governance
music598A','portrait/text render8C26/8CFC/4DE0/45D8','input chooses
release1','release consequence9FC6','sound dispatcher73A0 recorded']))
# L70
for hostility in [0,80,100]:
# L71
 def setup(u,w):
# L74
 def
join(u,w,word,byte,sp,seen):seen.append(dict(joinRuler=hex(word(sp+6)),officer=h
ex(word(sp+4))));return 0
# L75
 def
place(u,w,word,byte,sp,seen):seen.append(dict(placeProvince=hex(word(sp+4)),offi
cer=hex(word(sp+6))));return 0
# L79
 cases.append(dict(rule='Ordinary captive Recruit transfers service without
acceptance roll or hostility
test',hostility=hostility,events=seen,suppressed=['service loyalty
initialization5BFE recorded only','province linked-list mutation5F9E recorded
only']))
# L81
for oldLoyalty in [70,100]:
# L82
 for difference in [0,20,100]:
# L83
  for jitter in [0,4]:
# L84
   def setup(u,w):
# L87
   def
random(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4)&255,value=
jitter));return jitter
# L91
   cases.append(dict(rule='Authentic ordinary captive service change assigns
loyalty without hostility
gate',oldLoyalty=oldLoyalty,compatibilityDifference=difference,jitter=jitter,new
Loyalty=byte(LEADER+0xb),events=seen,suppressed=['random jitter58BA controlled;
owner, compatibility, integer square root, loyalty writes and advisor removal
retained']))
# L93
for charisma,hostility,year,roll in
[(80,0,189,0),(80,100,189,39),(80,100,189,40),(0,100,189,0),(100,100,189,49),(10
0,100,189,50),(80,0,200,0)]:
# L94
 def
setup(u,w):w(PARTY,'H',FORMER);w(0x40e4,'H',WINNER);w(FORMER+0xe,'B',hostility);
w(LEADER+6,'B',charisma);w(0x44,'H',year);w(WINNER+0xf,'B',80)
# L95
 def
chance(u,w,word,byte,sp,seen):prob=word(sp+4)&255;seen.append(dict(releaseChance
=prob,roll=roll));return int(roll<prob)
# L98
 cases.append(dict(rule='AI release decision permits positive chance even at100
hostility; no native high-hostility recruit
cutoff',charisma=charisma,hostility=hostility,year=year,roll=roll,events=seen,de
clinesRelease=bool(expected),suppressed=['random percentage589C controlled at
requested roll']))
# L100
for key in [0x31,0x32,0x1b]:
# L101
 def setup(u,w):w(0x3530,'HH',0,0)
# L104
 cases.append(dict(rule='Original ordinary keyboard selection has no effect
dispatch',key=key,effects=seen,suppressed=['cursor/text display','BIOS key/poll
returns controlled key','optional callbacks3530 null']))
# L106
for keys,expected in
[([0x31,13],1),([0x32,13],2),([0x33,13],3),([0x34,13,0x31,13],1)]:
# L108
 def setup(u,w):w(0x3530,'HH',0,0);w(0x3432,'HH',0,0)
# L109
 def key(u,w,word,byte,sp,seen):return queue.pop(0)
# L110
 def printchar(u,w,word,byte,sp,seen):w(0x3432,'H',word(0x3432)+1)
# L111
 def erase(u,w,word,byte,sp,seen):w(0x3432,'H',word(0x3432)-1)
# L112
 def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
# L115
 cases.append(dict(rule='Original valid and retry numeric-order selection is
silent',keys=keys,result=expected,effects=seen,suppressed=['cursor/character
rendering only','BIOS key/poll returns provided keys','callbacks3530 null']))
# L117
for start,effect in [(0x58e6,10),(0x591e,14)]:
# L118
 def setup(u,w):w(0x352c,'H',1);w(0x33b4,'B',1)
# L119
 def dispatch(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
# L122
 cases.append(dict(rule='Explicit result notification helper invokes native cue
separately from key input',entry=hex(start),effects=seen,suppressed=['final
message wait/style58CC','sound dispatch recorded without playback']))
# L124
for success in [0,1]:
# L125
 for rulerEnvoy in [0,1]:
# L126
  def setup(u,w):
# L128
  def
text(u,w,word,byte,sp,seen):seen.append(dict(textArgument=hex(word(sp+6))))
# L129
  def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
# L133
  cases.append(dict(rule='Native Recruit success message uses14 and refusal
message10; neither is ordinary keypress
sound',success=bool(success),rulerEnvoy=bool(rulerEnvoy),events=seen,suppressed=
['text buffer append/display recorded','final timed message pause58CC','effect
dispatch recorded without playback']))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[10](../tools/verify-native-captive-audio-v54.py#L10)

**Required assertion / subcase oracle**

```text
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
```

---

**Source line**

[11](../tools/verify-native-captive-audio-v54.py#L11)

**Required assertion / subcase oracle**

```text
h=struct.unpack_from('<14H',raw);assert h[0]==0x5a4d and
h[3]==0;packed=raw[h[4]*16:];stub=h[11]*16;assert
packed[stub+14:stub+16]==b'RB';end=struct.unpack_from('<H',packed,stub+12)[0]*16
```

---

**Source line**

[15](../tools/verify-native-captive-audio-v54.py#L15)

**Required assertion / subcase oracle**

```text
opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert
count<=dst+1
```

---

**Source line**

[17](../tools/verify-native-captive-audio-v54.py#L17)

**Required assertion / subcase oracle**

```text
elif opcode in [0xb2,0xb3]:assert
count<=src+1;image[dst-count+1:dst+1]=packed[src-count+1:src+1];src-=count
```

---

**Source line**

[21](../tools/verify-native-captive-audio-v54.py#L21)

**Required assertion / subcase oracle**

```text
assert src==dst;image[:src+1]=packed[:src+1];IMAGE=bytes(image);DS=0x2fa60
```

---

**Source line**

[39](../tools/verify-native-captive-audio-v54.py#L39)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-25:]);return
u,seen,word,byte
```

---

**Source line**

[53](../tools/verify-native-captive-audio-v54.py#L53)

**Required assertion / subcase oracle**

```text
assert
seen==[dict(textOffset='0x46a9'),dict(effect=7),dict(choiceRange=[1,2]),dict(rel
eased=hex(LEADER))],seen
```

---

**Source line**

[67](../tools/verify-native-captive-audio-v54.py#L67)

**Required assertion / subcase oracle**

```text
assert
seen==[dict(textOffset='0x46a9'),dict(effect=7),dict(choiceRange=[1,2]),dict(rel
eased=hex(LEADER))],seen
```

---

**Source line**

[77](../tools/verify-native-captive-audio-v54.py#L77)

**Required assertion / subcase oracle**

```text
assert
seen==[dict(joinRuler=hex(WINNER),officer=hex(LEADER)),dict(placeProvince='0x940
0',officer=hex(LEADER))]
```

---

**Source line**

[78](../tools/verify-native-captive-audio-v54.py#L78)

**Required assertion / subcase oracle**

```text
assert byte(LEADER+0xa)==0 and word(FORMER+4)==0
```

---

**Source line**

[90](../tools/verify-native-captive-audio-v54.py#L90)

**Required assertion / subcase oracle**

```text
assert byte(LEADER+0xa)==0 and byte(LEADER+0xb)==expected and
byte(LEADER+0xc)==1 and word(FORMER+4)==0
```

---

**Source line**

[97](../tools/verify-native-captive-audio-v54.py#L97)

**Required assertion / subcase oracle**

```text
expected=int(not(roll<(charisma+100-hostility)//2 and year<200));assert
u.reg_read(UC_X86_REG_AX)==expected
```

---

**Source line**

[103](../tools/verify-native-captive-audio-v54.py#L103)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_AX)==key and seen==[]
```

---

**Source line**

[114](../tools/verify-native-captive-audio-v54.py#L114)

**Required assertion / subcase oracle**

```text
assert not queue and u.reg_read(UC_X86_REG_AX)==expected and seen==[]
```

---

**Source line**

[121](../tools/verify-native-captive-audio-v54.py#L121)

**Required assertion / subcase oracle**

```text
assert seen==[dict(effect=effect)]
```

---

**Source line**

[131](../tools/verify-native-captive-audio-v54.py#L131)

**Required assertion / subcase oracle**

```text
assert seen[-1]==dict(effect=14 if success else 10)
```

---

**Source line**

[132](../tools/verify-native-captive-audio-v54.py#L132)

**Required assertion / subcase oracle**

```text
assert any(x.get('textArgument')==hex(0x7110 if rulerEnvoy else 0x712a) for x in
seen) if success else any(x.get('textArgument')==hex(0x7144 if rulerEnvoy else
0x715e) for x in seen)
```


<a id="tools-verify-native-charge-arrival-v56-py"></a>
## tools/verify-native-charge-arrival-v56.py

Source: [tools/verify-native-charge-arrival-v56.py][test-source-607]. Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`, `argparse,hashlib,json,struct,math`,
`unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Bounded native v56 charge-arrival witnesses; no original bytes are exported.
Run: python SCRIPT.py /outside/repository/main.exe /tmp/results.json
Requires Unicorn; self-contained unpacker, no repository imports.

CLI, input identity and report writes (literal source):

```python
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
a.output.write_text(json.dumps(dict(originalSHA256=EXPECTED,cases=results),inden
t=2)+'\n')
print(len(results),'passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L24
def run(start,cs,args,setup,hooks):
# L26
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L27
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L28
 def byte(at):return u.mem_read(DS+at,1)[0]
# L30
 def hook(u,at,size,data):
# L43
def arena(u,w):
# L46
 for ptr,(q,r),flag in
[(0x9000,(6,4),129),(0x9100,(7,4),132),(0x9200,(7,5),132)]:w(ptr+4,'BB',89,80);w
(ptr+0x12,'HHBBB',5000,5000,80,7,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L48
def lookup(u,w,word,byte,sp,seen):return 0x9000 if word(sp+4)&255==6 else 0x9100
# L52
def adjacent(p,d):
# L55
for branch in ['occupation','breakthrough','failed-chance','blocked']:
# L56
 for q in [6,7]:
# L57
  for d in range(6):
# L59
   def setup(u,w):
# L61
    for ptr,p,side in
[(0x9000,origin,129),(0x9100,target,132)]:w(ptr+4,'BB',80,100);w(ptr+0x12,'HHBBB
',5000,5000,80,7,(p[0]<<4)|p[1]);w(0xba6c+p[1]*13+p[0],'B',side)
# L65
    for i,(ptr,p) in enumerate(units):w(ptr,'H',units[i+1][0] if i+1<len(units)
else
0);w(ptr+4,'BB',80,100);w(ptr+0x12,'HHBBB',5000,5000,80,7,(p[0]<<4)|p[1]);w(0xba
6c+p[1]*13+p[0],'B',148);w(0xb9d0+p[1]*13+p[0],'B',1)
# L67
   def exchange(u,w,word,byte,sp,seen):
# L71
   def
ambushed(u,w,word,byte,sp,seen):seen.append(dict(ambushVictim=[word(sp+4)&255,wo
rd(sp+6)&255],ambusher=[word(sp+8)&255,word(sp+10)&255]));return 0
# L72
   def
chance(u,w,word,byte,sp,seen):seen.append(dict(chance=word(sp+4)&255));return 0
if branch=='failed-chance' else 1
# L80

results.append(dict(test='NATIVE-CHARGE-ARRIVAL',branch=branch,start=list(origin
),target=list(target),landing=end,nativeDirection=d,calls=seen,limits='Original
full charge controller, relocation, cell occupancy transfer, six-direction
geometry, forward ambush arc, jungle/hostile lookup execute unchanged. Combat
damage/capture-result body, drawing, RNG, casualty body hooked; no strategic AI
charge selection claim.'))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[10](../tools/verify-native-charge-arrival-v56.py#L10)

**Required assertion / subcase oracle**

```text
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
```

---

**Source line**

[11](../tools/verify-native-charge-arrival-v56.py#L11)

**Required assertion / subcase oracle**

```text
h=struct.unpack_from('<14H',raw);assert h[0]==0x5a4d and
h[3]==0;packed=raw[h[4]*16:];stub=h[11]*16;assert
packed[stub+14:stub+16]==b'RB';end=struct.unpack_from('<H',packed,stub+12)[0]*16
```

---

**Source line**

[15](../tools/verify-native-charge-arrival-v56.py#L15)

**Required assertion / subcase oracle**

```text
opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert
count<=dst+1
```

---

**Source line**

[17](../tools/verify-native-charge-arrival-v56.py#L17)

**Required assertion / subcase oracle**

```text
elif opcode in [0xb2,0xb3]:assert
count<=src+1;image[dst-count+1:dst+1]=packed[src-count+1:src+1];src-=count
```

---

**Source line**

[21](../tools/verify-native-charge-arrival-v56.py#L21)

**Required assertion / subcase oracle**

```text
assert src==dst;image[:src+1]=packed[:src+1];IMAGE=bytes(image);DS=0x2fa60
```

---

**Source line**

[39](../tools/verify-native-charge-arrival-v56.py#L39)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-30:])
```

---

**Source line**

[77](../tools/verify-native-charge-arrival-v56.py#L77)

**Required assertion / subcase oracle**

```text
assert end==expectedEnd,(branch,q,d,end,expectedEnd,seen)
```

---

**Source line**

[78](../tools/verify-native-charge-arrival-v56.py#L78)

**Required assertion / subcase oracle**

```text
if branch in ['occupation','breakthrough']:assert
len(calls)==3,(branch,q,d,calls)
```

---

**Source line**

[79](../tools/verify-native-charge-arrival-v56.py#L79)

**Required assertion / subcase oracle**

```text
else:assert not calls,(branch,q,d,calls)
```


<a id="tools-verify-native-charge-terminal-v56-py"></a>
## tools/verify-native-charge-terminal-v56.py

Source: [tools/verify-native-charge-terminal-v56.py][test-source-608]. Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`, `argparse,hashlib,json,struct,math`,
`unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Bounded native v56 charge-arrival witnesses; no original bytes are exported.
Run: python SCRIPT.py /outside/repository/main.exe /tmp/results.json
Requires Unicorn; self-contained unpacker, no repository imports.

CLI, input identity and report writes (literal source):

```python
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
print(len(results),'passed');a.output.write_text(json.dumps(dict(originalSHA256=
EXPECTED,cases=results,limits='Unchanged native full charge controller, both
casualty/equipment equations, zero-men capture, service removal, army
linked-list commander recognition, terminal winner/reason writes, occupation and
jungle eligibility execute. Only native RNG, drawing/text/pause, and ambush
casualty body are controlled. No UI, strategic AI target selection or recruit
outcome claim.'),indent=2)+'\n')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L24
def run(start,cs,args,setup,hooks):
# L26
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L27
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L28
 def byte(at):return u.mem_read(DS+at,1)[0]
# L30
 def hook(u,at,size,data):
# L43
def arena(u,w):
# L46
 for ptr,(q,r),flag in
[(0x9000,(6,4),129),(0x9100,(7,4),132),(0x9200,(7,5),132)]:w(ptr+4,'BB',89,80);w
(ptr+0x12,'HHBBB',5000,5000,80,7,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L48
def lookup(u,w,word,byte,sp,seen):return 0x9000 if word(sp+4)&255==6 else 0x9100
# L52
def adjacent(p,d):
# L54
for q in [6,7]:
# L55
 for d in range(6):
# L56
  for commander in [False,True]:
# L58
   def setup(u,w):
# L61
    for ptr,p,flags in
[(0x9000,origin,129),(0x9100,target,132),(0x9200,hidden,148)]:w(ptr+0x18,'B',(p[
0]<<4)|p[1]);w(0xba6c+p[1]*13+p[0],'B',flags)
# L63
   def
ambushed(u,w,word,byte,sp,seen):seen.append(dict(ambushVictim=[word(sp+4)&255,wo
rd(sp+6)&255],ambusher=[word(sp+8)&255,word(sp+10)&255]));return 0
# L64
   def
capture(u,w,word,byte,sp,seen):seen.append(dict(captureMessage=hex(word(sp+4))))
;return 0
# L68

results.append(dict(start=origin,target=target,jungle=hidden,nativeDirection=d,t
est='FULL-CHARGE-CAPTURE-TERMINAL-GATE',targetCommander=commander,winner=byte(0x
b8d5),reason=byte(0xcb67),actorFinal=[byte(0x9018)>>4,byte(0x9018)&15],targetFin
alMen=word(0x9112),targetFinalHex=hex(byte(0x9118)),calls=seen))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[10](../tools/verify-native-charge-terminal-v56.py#L10)

**Required assertion / subcase oracle**

```text
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
```

---

**Source line**

[11](../tools/verify-native-charge-terminal-v56.py#L11)

**Required assertion / subcase oracle**

```text
h=struct.unpack_from('<14H',raw);assert h[0]==0x5a4d and
h[3]==0;packed=raw[h[4]*16:];stub=h[11]*16;assert
packed[stub+14:stub+16]==b'RB';end=struct.unpack_from('<H',packed,stub+12)[0]*16
```

---

**Source line**

[15](../tools/verify-native-charge-terminal-v56.py#L15)

**Required assertion / subcase oracle**

```text
opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert
count<=dst+1
```

---

**Source line**

[17](../tools/verify-native-charge-terminal-v56.py#L17)

**Required assertion / subcase oracle**

```text
elif opcode in [0xb2,0xb3]:assert
count<=src+1;image[dst-count+1:dst+1]=packed[src-count+1:src+1];src-=count
```

---

**Source line**

[21](../tools/verify-native-charge-terminal-v56.py#L21)

**Required assertion / subcase oracle**

```text
assert src==dst;image[:src+1]=packed[:src+1];IMAGE=bytes(image);DS=0x2fa60
```

---

**Source line**

[39](../tools/verify-native-charge-terminal-v56.py#L39)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-30:])
```

---

**Source line**

[67](../tools/verify-native-charge-terminal-v56.py#L67)

**Required assertion / subcase oracle**

```text
assert byte(0xb8d5)==(0 if commander else 255);assert len(seen)==(0 if commander
else 1);assert word(0x9112)==0
```


<a id="tools-verify-native-combat-v50-py"></a>
## tools/verify-native-combat-v50.py

Source:
[tools/verify-native-combat-v50.py](../tools/verify-native-combat-v50.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`,
`argparse,hashlib,importlib.util,struct,json`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

from pathlib import Path
import argparse,hashlib,importlib.util,struct,json
from unicorn import *
from unicorn.x86_const import *
parser=argparse.ArgumentParser(description='Bounded v50 combat animation,
action-readiness and local AI flight
witnesses.');parser.add_argument('main_exe',type=Path);parser.add_argument('outp
ut',type=Path);args=parser.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name(
'verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loade
r.exec_module(original)
RAW=args.main_exe.read_bytes();assert
hashlib.sha256(RAW).hexdigest()==original.EXPECTED;IMAGE=bytes(original.unpack(R
AW)[0]);DS=0x2fa60
cases=[]
def run(start,cs,args,setup,hooks):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,IMAGE);u.reg_w
rite(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_
REG_SP,0xff00)

CLI, input identity and report writes (literal source):

```python
parser=argparse.ArgumentParser(description='Bounded v50 combat animation,
action-readiness and local AI flight
witnesses.');parser.add_argument('main_exe',type=Path);parser.add_argument('outp
ut',type=Path);args=parser.parse_args()
RAW=args.main_exe.read_bytes();assert
hashlib.sha256(RAW).hexdigest()==original.EXPECTED;IMAGE=bytes(original.unpack(R
AW)[0]);DS=0x2fa60
args.output.write_text(json.dumps({'originalSha256':hashlib.sha256(RAW).hexdiges
t(),'cases':cases,'limits':['Bounded Unicorn branches with controlled input,
rendering, occupancy, army status and RNG hooks; no full DOS
simulation.','Flight witnesses establish local low-men threat and fire branches;
original strategic whole-army withdrawal flags remain untraced.','The remaster
intentionally excludes concealed hostile positions from AI threat
assessment.']},indent=2)+'\n');print(len(cases),'bounded witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L9
def run(start,cs,args,setup,hooks):
# L11
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L12
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L13
 def byte(at):return u.mem_read(DS+at,1)[0]
# L15
 def hook(u,at,size,data):
# L28
def arena(u,w):
# L31
 for ptr,(q,r),flag in
[(0x9000,(6,4),129),(0x9100,(7,4),132),(0x9200,(7,5),132)]:w(ptr+4,'BB',89,80);w
(ptr+0x12,'HHBBB',5000,5000,80,7,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L33
def lookup(u,w,word,byte,sp,seen):return 0x9000 if word(sp+4)&255==6 else 0x9100
# L34
for intel in [89,90]:
# L35
 def setup(u,w):arena(u,w);w(0x9004,'B',intel);w(0xb9d0+4*13+7,'B',1)
# L36
 def
animate(u,w,word,byte,sp,seen):seen.append({'flash':[word(sp+4)&255,word(sp+6)&2
55,word(sp+8)&255,word(sp+10)&255]})
# L39
 cases.append(dict(rule='Ambush spends ambusher readiness before casualty even
INT90
evasion',entry='0x247C6',moverINT=intel,ambusherFlagsBefore=132,ambusherFlagsAft
er=byte(0xba6c+4*13+7),ambusherMPAfter=byte(0x9117),calls=seen))
# L40
for ambusherFlags in [4,132]:
# L41
 def setup(u,w):
# L43
 def
intercept(u,w,word,byte,sp,seen):seen.append([word(sp+4)&255,word(sp+6)&255,word
(sp+8)&255,word(sp+10)&255]);return 0
# L46
 cases.append(dict(rule='Native forward ambush trigger does not require unused
daily order',entry='0x24938/0x239D6',ambusherFlags=ambusherFlags,calls=seen))
# L48
def frame(u,w,word,byte,sp,seen):seen.append([byte(0xb8df),byte(0xb8e0)])
# L51
cases.append(dict(rule='Shared combat flash
sequence',entry='0x250F8/0x250AE',cycles=8,tileFrames=seen))
# L54
for side in [0,1,2,3]:
# L55
 for men,enemy,leader,roll,expected in
[(99,100,False,1,True),(99,100,False,0,False),(99,100,True,0,False),(499,1500,Fa
lse,1,True),(500,1501,False,1,False),(799,2400,True,1,True),(800,2401,True,1,Fal
se),(499,1497,False,1,False)]:
# L56
  def
setup(u,w):arena(u,w);w(0x9012,'H',men);w(0x9112,'H',enemy);w(0xb8d0,'BBBB',0,0,
0,0)
# L57
  def
chance(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255});return roll
# L58
  def eligibility(u,w,word,byte,sp,seen):return int((word(sp+4)&255)==5)
# L62
  cases.append(dict(rule='Native AI local flight
decision',entry='0x2B18A/0x2AB5E',side=side,men=men,adjacentEnemyMen=enemy,comma
nder=leader,randomSuccess=roll,withdraw=result,calls=seen))
# L63
def simultaneous(u,w):
# L65
def eligibility(u,w,word,byte,sp,seen):return int(word(sp+4)<2)
# L68
cases.append(dict(rule='Completed simultaneous attack spends attacker and target
readiness',entry='0x26072',attackerFlagsBefore=[129,129],attackerFlagsAfter=[byt
e(0xba6c+7*13+q) for q in
[6,7]],enemyFlagsBefore=132,enemyFlagsAfter=byte(0xba6c+6*13+7)))
# L69
for side in [0,1,2,3]:
# L70
 for men,fire,trapped,noExit,expected in
[(2999,True,True,False,True),(3000,True,True,False,False),(2999,True,False,False
,False),(99,False,True,True,False)]:
# L71
  def
setup(u,w):arena(u,w);w(0x9012,'H',men);w(0xb8d0,'BBBB',0,0,0,0);w(0xcae7,'B',0)
# L75
  cases.append(dict(rule='Native AI trapped fire / no province exit flight
gate',entry='0x2B18A',side=side,men=men,burning=fire,noAffordableHex=trapped,noP
rovinceExit=noExit,withdraw=result))
# L76
for terrain in [0,1]:
# L77
 def setup(u,w):arena(u,w);w(0xb8d6,'B',2);w(0xb9d0+4*13+7,'B',terrain)
# L78
 def
dispatch(u,w,word,byte,sp,seen):seen.append(dict(routine='0x26072',target=hex(wo
rd(sp+4)),q=word(sp+6)&255,r=word(sp+8)&255))
# L81
 cases.append(dict(rule='Native human simultaneous dispatcher accepts occupied
jungle as well as
plain',entry='0x265AE',terrain=terrain,mode=2,accepted=True,calls=seen))
# L82
for terrain in [0,1]:
# L83
 for enemyFlags in [132,148]:
# L85
  def setup(u,w):
# L87
   for ptr,(q,r),flag in
[(0x9000,(6,7),129),(0x9100,(7,7),129),(0x9200,(7,6),enemyFlags)]:w(ptr+0x18,'B'
,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L89
  def
exchange(u,w,word,byte,sp,seen):seen.append(dict(attacker=hex(word(sp+4)),defend
er=hex(word(sp+6)),factor=word(sp+8)));return 255
# L90
  def
animate(u,w,word,byte,sp,seen):flashes.append([word(sp+4)&255,word(sp+6)&255,wor
d(sp+8)&255,word(sp+10)&255])
# L94
  cases.append(dict(rule='Native simultaneous handler performs both exchanges
against jungle
target',entry='0x26072',terrain=terrain,enemyFlags=enemyFlags,actualEligibilityA
ndLookup=True,calls=seen,flashCalls=flashes))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[7](../tools/verify-native-combat-v50.py#L7)

**Required assertion / subcase oracle**

```text
RAW=args.main_exe.read_bytes();assert
hashlib.sha256(RAW).hexdigest()==original.EXPECTED;IMAGE=bytes(original.unpack(R
AW)[0]);DS=0x2fa60
```

---

**Source line**

[24](../tools/verify-native-combat-v50.py#L24)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-30:])
```

---

**Source line**

[38](../tools/verify-native-combat-v50.py#L38)

**Required assertion / subcase oracle**

```text
assert byte(0xba6c+4*13+7)==4 and byte(0x9117)==7 and
seen==[{'flash':[6,4,7,4]}]
```

---

**Source line**

[45](../tools/verify-native-combat-v50.py#L45)

**Required assertion / subcase oracle**

```text
assert seen==[[6,4,7,4]],(ambusherFlags,seen)
```

---

**Source line**

[50](../tools/verify-native-combat-v50.py#L50)

**Required assertion / subcase oracle**

```text
assert seen==sum(([[6,4]]*2+[[7,4]]*2 for _ in range(8)),[])
```

---

**Source line**

[61](../tools/verify-native-combat-v50.py#L61)

**Required assertion / subcase oracle**

```text
expected=expected or men<100 and
side>=2;result=bool(u.reg_read(UC_X86_REG_AX));assert
result==expected,(side,men,enemy,leader,roll,result)
```

---

**Source line**

[67](../tools/verify-native-combat-v50.py#L67)

**Required assertion / subcase oracle**

```text
assert byte(0xba6c+6*13+7)==4 and [byte(0xba6c+7*13+q) for q in [6,7]]==[1,1]
```

---

**Source line**

[74](../tools/verify-native-combat-v50.py#L74)

**Required assertion / subcase oracle**

```text
result=bool(u.reg_read(UC_X86_REG_AX));assert
result==expected,(side,men,fire,trapped,noExit,result)
```

---

**Source line**

[80](../tools/verify-native-combat-v50.py#L80)

**Required assertion / subcase oracle**

```text
assert seen==[dict(routine='0x26072',target='0x9100',q=7,r=4)] and
u.reg_read(UC_X86_REG_AX)==1
```

---

**Source line**

[92](../tools/verify-native-combat-v50.py#L92)

**Required assertion / subcase oracle**

```text
assert
seen==[dict(attacker='0x9000',defender='0x9200',factor=2),dict(attacker='0x9100'
,defender='0x9200',factor=2)],seen
```

---

**Source line**

[93](../tools/verify-native-combat-v50.py#L93)

**Required assertion / subcase oracle**

```text
assert flashes==[[6,7,7,6],[7,7,7,6]],flashes
```


<a id="tools-verify-native-concealed-v56-py"></a>
## tools/verify-native-concealed-v56.py

Source: [tools/verify-native-concealed-v56.py][test-source-609]. Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse,hashlib,json,struct`, `pathlib`, `unicorn`,
`unicorn.x86_const`.

### Inputs, procedure and expected outputs

Portable bounded main.exe concealed-target and empty-hex command witnesses.
Usage: PYTHONPATH=<unicorn> python native-concealed-v56.py main.exe output.json
Rendering, UI input and casualty resolution hooks are listed with every witness.
No source binary is copied, no AI training is run, no full DOS parity is
claimed.

CLI, input identity and report writes (literal source):

```python
Usage: PYTHONPATH=<unicorn> python native-concealed-v56.py main.exe output.json
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Pa
th);p.add_argument('output',type=Path);a=p.parse_args()
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results,limits
=['No full DOS simulation; graphics/sound not played','Combat consequence
details suppressed in occupied-target legality cases; use existing native
joint/casualty witnesses for equations','Empty-terrain dispatcher probes do not
establish broad game input policy for visible empty
ground']),indent=2)+'\n');print(len(results),'native concealed/empty target
witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L12
def unpack(data):
# L27
def run(start,cs,args,setup,hooks):
# L29
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L30
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L31
 def byte(at):return u.mem_read(DS+at,1)[0]
# L33
 def hook(u,at,size,data):
# L46
def arena(u,w):
# L47
 for offset,length in
[(0xb9d0,156),(0xba6c,156),(0xcb72,40),(0x9000,0x80),(0x9100,0x80),(0x9200,0x80)
]:u.mem_write(DS+offset,bytes(length))
# L49
 for ptr,(q,r),flag in
[(0x9000,(6,4),129),(0x9100,(7,4),148),(0x9200,(7,5),129)]:w(ptr+4,'BB',70,70);w
(ptr+0x12,'HHBBB',5000,4000,80,7,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L52
def
flash(u,w,word,byte,sp,seen):seen.append(dict(kind='flash',source=[word(sp+4)&25
5,word(sp+6)&255],target=[word(sp+8)&255,word(sp+10)&255]))
# L53
def
exchange(u,w,word,byte,sp,seen):seen.append(dict(kind='exchange',attacker=hex(wo
rd(sp+4)),defender=hex(word(sp+6)),factor=word(sp+8)));return 1
# L56
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
# L57
 for flags in [132,148]:
# L58
  def setup(u,w):arena(u,w);w(0xb8d6,'B',mode);w(0xba6c+4*13+7,'B',flags)
# L62

results.append(dict(test='CONCEALED-JUNGLE-'+name.upper(),entry='0x265AE',mode=m
ode,targetTerrain=1,targetFlags=flags,accepted=True,dailyOrderComplete=bool(byte
(0xb8e2)),mobilityAfter=byte(0x9017),calls=seen,hooks=['Combat flashes/UI/redraw
intercepted','Combat casualty body returns terminal status1 without mutating
soldiers','RNG controlled zero','Native occupancy lookup, hostile-side
predicate, controller dispatch and handler branches retained']))
# L63
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
# L64
 for terrain in [0,1,3,4]:
# L65
  def
setup(u,w):arena(u,w);w(0xb8d6,'B',mode);w(0xba6c+4*13+7,'B',0);w(0x9118,'B',0x8
4);w(0xb9d0+4*13+7,'B',terrain)
# L68

results.append(dict(test='EMPTY-HEX-'+name.upper(),entry='0x265AE',mode=mode,tar
getTerrain=terrain,accepted=True,dailyOrderComplete=True,mobilityAfter=byte(0x90
17),initiatorCellFlagsAfter=byte(0xba6c+4*13+6),calls=seen,hooks=['Combat
flashes/UI intercepted; charge actor redraw intercepted','No casualty or RNG
helper reached','Native empty-cell and dailyOrderComplete write
retained'],limits=['This dispatcher accepts empty cells irrespective of terrain;
legality of hypothetical input preceding this dispatcher is separately witnessed
for an adjacent jungle cell.']))
# L71
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
# L72
 for flags in [0,132,148]:
# L74
  def setup(u,w):
# L78
  def input(u,w,word,byte,sp,seen):
# L82
  def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
# L87
  results.append(dict(test=('OCCUPIED' if flags else
'EMPTY')+'-JUNGLE-'+name.upper()+'-ADVANCES-HUMAN-CONTROLLER',entry='0x226A0
->0x26980 ->0x26804
->0x265AE',mode=mode,targetTerrain=1,targetFlags=flags,activatedUnits=activated,
keyboardStages=keys,mobilityAfter=[byte(0x9017),byte(0x9217)],calls=seen,hooks=[
'Keyboard characters and adjacent direction input controlled','Rendering,
generic key redraw, end-of-order fire/outcome processing suppressed','Native
activation mobility maximum uses equivalent max helper','Original attack
submenu, geometry, occupancy, allegiance/same-side checks, dispatch and
linked-list progression retained','Occupied case casualty helper returns
terminal status1 without soldier mutation'],limits=['After-order fire processing
is suppressed; remaster integration must separately cover burning miss fire
casualties exactly once.','Occupied controller witnesses demonstrate reachable
command/exchange, not casualty consequences.']))
# L90
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
# L91
 def setup(u,w):
# L95
 results.append(dict(test='FRIENDLY-JUNGLE-'+name.upper()+'-REJECTED',entry='0x2
65AE',mode=mode,targetTerrain=1,targetFlags=129,accepted=False,dailyOrderComplet
e=False,mobilityAfter=7,calls=seen,hooks=['Same UI/combat hooks as preceding
dispatcher probes; none reached','Actual native lookup and hostile-side
predicate retained']))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[13](../tools/verify-native-concealed-v56.py#L13)

**Required assertion / subcase oracle**

```text
h=struct.unpack_from('<14H',data);assert h[0]==0x5a4d and h[3]==0
```

---

**Source line**

[14](../tools/verify-native-concealed-v56.py#L14)

**Required assertion / subcase oracle**

```text
packed=data[h[4]*16:];stub=h[11]*16;assert packed[stub+14:stub+16]==b'RB'
```

---

**Source line**

[18](../tools/verify-native-concealed-v56.py#L18)

**Required assertion / subcase oracle**

```text
opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert
count<=dst+1
```

---

**Source line**

[24](../tools/verify-native-concealed-v56.py#L24)

**Required assertion / subcase oracle**

```text
assert src==dst;output[:src+1]=packed[:src+1];return bytes(output)
```

---

**Source line**

[25](../tools/verify-native-concealed-v56.py#L25)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60
```

---

**Source line**

[42](../tools/verify-native-concealed-v56.py#L42)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-30:])
```

---

**Source line**

[60](../tools/verify-native-concealed-v56.py#L60)

**Required assertion / subcase oracle**

```text
calls=[x for x in seen if x['kind']=='exchange'];assert len(calls)==(2 if
mode==2 else 1),(mode,flags,seen)
```

---

**Source line**

[61](../tools/verify-native-concealed-v56.py#L61)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_AX)==1 and byte(0xb8e2)==1 and byte(0x9017)==7
```

---

**Source line**

[67](../tools/verify-native-concealed-v56.py#L67)

**Required assertion / subcase oracle**

```text
assert not any(x['kind']=='exchange' for x in seen) and byte(0xb8e2)==1 and
byte(0x9017)==7 and byte(0xba6c+4*13+6)==129
```

---

**Source line**

[85](../tools/verify-native-concealed-v56.py#L85)

**Required assertion / subcase oracle**

```text
assert activated==['0x9000','0x9200'] and byte(0x9017)==7 and
byte(0x9217)==7,(mode,activated,keys,seen)
```

---

**Source line**

[86](../tools/verify-native-concealed-v56.py#L86)

**Required assertion / subcase oracle**

```text
calls=[x for x in seen if x['kind']=='exchange'];assert len(calls)==((2 if
mode==2 else 1) if flags else 0),(mode,flags,calls)
```

---

**Source line**

[94](../tools/verify-native-concealed-v56.py#L94)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_AX)==0 and byte(0xb8e2)==0 and byte(0x9017)==7 and
not seen
```


<a id="tools-verify-native-display-py"></a>
## tools/verify-native-display.py

Source: [tools/verify-native-display.py](../tools/verify-native-display.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse, hashlib, importlib.util, json`, `pathlib`.

### Inputs, procedure and expected outputs

Verify governor text and derive solid ownership colours from supplied main.exe.

No DOS execution or original assets are distributed. The solid colours are
nearest (ties-to-even) means of each native 8 x 2 map pattern.

CLI, input identity and report writes (literal source):

```python
parser.add_argument('main_exe',type=Path)
parser.add_argument('output',type=Path)
args=parser.parse_args()
data=args.main_exe.read_bytes();assert
hashlib.sha256(data).hexdigest()==original.EXPECTED
args.output.write_text(json.dumps({'sha256':original.EXPECTED,'governor':'Provin
ce serving-head pointer +2, officer name +28; formatted Governor:
%s.','ownerLookup':'DS:0048, fill patterns DS:3ad0, palette DS:3484, planes
0/2/1','colors':rows},indent=2)+'\n')
print('PASS native governor formatter, ruler-index lookup and 16 distinct solid
ownership colours')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L23
def rgb(register):
# L28
for owner,index in enumerate(indexes):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[15](../tools/verify-native-display.py#L15)

**Required assertion / subcase oracle**

```text
data=args.main_exe.read_bytes();assert
hashlib.sha256(data).hexdigest()==original.EXPECTED
```

---

**Source line**

[17](../tools/verify-native-display.py#L17)

**Required assertion / subcase oracle**

```text
assert
image[0x13965:0x13965+20].hex()=='8b5e068b4702051c0050b87e62509ae806ef0383'
```

---

**Source line**

[18](../tools/verify-native-display.py#L18)

**Required assertion / subcase oracle**

```text
assert image[ds+0x627e:ds+0x627e+20]==b'\x1bC1\x01Governor: \x1bC0\x01%s'
```

---

**Source line**

[19](../tools/verify-native-display.py#L19)

**Required assertion / subcase oracle**

```text
assert
image[0x4fec:0x4fec+41].hex()=='ff76069a4a00250583c402509a0600250583c4028ad82aff
8a8748002ae48bc8d1e003c1d1e005d03a'
```

---

**Source line**

[20](../tools/verify-native-display.py#L20)

**Required assertion / subcase oracle**

```text
assert image[0x4c0a:0x4c0a+8].hex()=='b88434509aed0000'
```

---

**Source line**

[21](../tools/verify-native-display.py#L21)

**Required assertion / subcase oracle**

```text
indexes=list(image[ds+0x48:ds+0x58]);assert sorted(indexes)==list(range(16))
```

---

**Source line**

[22](../tools/verify-native-display.py#L22)

**Required assertion / subcase oracle**

```text
registers=list(image[ds+0x3484:ds+0x3484+16]);assert
registers==[0,17,18,19,20,21,22,23,16,17,18,19,20,21,22,23]
```

---

**Source line**

[34](../tools/verify-native-display.py#L34)

**Required assertion / subcase oracle**

```text
assert len({row['solidColor'] for row in rows})==16
```


<a id="tools-verify-native-economy-v49-py"></a>
## tools/verify-native-economy-v49.py

Source:
[tools/verify-native-economy-v49.py](../tools/verify-native-economy-v49.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse, hashlib, importlib.util, json, struct`,
`pathlib`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Bounded 16-bit witnesses from the supplied English main.exe, not DOS gameplay.

Weapons maximum, weapons purchase arithmetic, treasury settlement and a
successful
flight are run unchanged. UI, destination lookup, and officer-list presentation
have explicit bounded hooks. No arithmetic is replaced.

CLI, input identity and report writes (literal source):

```python
parser.add_argument('main_exe',type=Path)
parser.add_argument('output',type=Path)
parser.add_argument('--verifier',type=Path,default=Path(__file__).with_name('ver
ify-original.py'))
args=parser.parse_args()
raw=args.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
output={'sha256':original.EXPECTED,'weaponsMaximum':[],'weaponsPurchase':[],'set
tlement':[],'flight':[]}
args.output.parent.mkdir(parents=True,exist_ok=True)
args.output.write_text(json.dumps(output,separators=(',',':'))+'\n')
print(f"PASS {sum(len(output[k]) for k in
['weaponsMaximum','weaponsPurchase','settlement','flight'])} native economy
witnesses; bounded UI hooks, no arithmetic replaced")
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L24
def write(u,at,fmt,*values):u.mem_write(DS+at,struct.pack('<'+fmt,*values))
# L25
def word(u,at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L26
def long(u,at):return struct.unpack('<I',u.mem_read(DS+at,4))[0]
# L27
def execute(start,setup,stop=0x60000,segment=None,hooks=None):
# L33
    def hook(u,at,size,data):
# L51
for intelligence in [0,40,80,100]:
# L52
    for equipment in [0,1,50,9900,9951,9999,10000]:
# L53
        for gold in [0,1,5,100,30000]:
# L54
            def setup(u):
# L63
            for lots in sorted(set([1,maximum])):
# L64
                def setup(u):
# L73
for winner,status in [('attack',1),('defend',5)]:
# L74
    for attackGold,defendGold,attackFood,defendFood in
[(500,700,20000,30000),(20000,22000,2000000,2200000),(0,1,0,1)]:
# L75
        def setup(u):
# L90
for fieldCode in [1,4,255]:
# L92
    def setup(u):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[19](../tools/verify-native-economy-v49.py#L19)

**Required assertion / subcase oracle**

```text
raw=args.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
```

---

**Source line**

[21](../tools/verify-native-economy-v49.py#L21)

**Required assertion / subcase oracle**

```text
assert image[0x08bc1:0x08bc6].hex()=='9a5c04c208' # unconditional native
settlement call
```

---

**Source line**

[22](../tools/verify-native-economy-v49.py#L22)

**Required assertion / subcase oracle**

```text
assert
image[0x1900e:0x19030].hex()=='8b46fe8b1e9a33294708b9102751b96400f7e1508b4606051
400508bf09a8c009c04'
```

---

**Source line**

[45](../tools/verify-native-economy-v49.py#L45)

**Required assertion / subcase oracle**

```text
assert
observed['stopped'],(hex(start),hex(u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X
86_REG_IP)))
```

---

**Source line**

[60](../tools/verify-native-economy-v49.py#L60)

**Required assertion / subcase oracle**

```text
assert maximum==min(gold,100-equipment//100)
```

---

**Source line**

[70](../tools/verify-native-economy-v49.py#L70)

**Required assertion / subcase oracle**

```text
assert actualGold==gold-lots and actualWeapons==min(10000,equipment+100*lots)
```

---

**Source line**

[82](../tools/verify-native-economy-v49.py#L82)

**Required assertion / subcase oracle**

```text
assert provinceGold==min(30000,attackGold+defendGold)
```

---

**Source line**

[83](../tools/verify-native-economy-v49.py#L83)

**Required assertion / subcase oracle**

```text
assert provinceFood==min(3000000,attackFood+defendFood)
```

---

**Source line**

[84](../tools/verify-native-economy-v49.py#L84)

**Required assertion / subcase oracle**

```text
assert word(u,0x9108)==1234 and long(u,0x910a)==56789
```

---

**Source line**

[100](../tools/verify-native-economy-v49.py#L100)

**Required assertion / subcase oracle**

```text
assert bytes(u.mem_read(DS+0xcaa1,12))==stores
```

---

**Source line**

[101](../tools/verify-native-economy-v49.py#L101)

**Required assertion / subcase oracle**

```text
assert word(u,0x9108)==1234 and long(u,0x910a)==56789
```

---

**Source line**

[102](../tools/verify-native-economy-v49.py#L102)

**Required assertion / subcase oracle**

```text
assert word(u,0x9408)==777 and long(u,0x940a)==88888
```

---

**Source line**

[103](../tools/verify-native-economy-v49.py#L103)

**Required assertion / subcase oracle**

```text
assert word(u,0x9012)==5000 and word(u,0x9014)==4900
```

---

**Source line**

[104](../tools/verify-native-economy-v49.py#L104)

**Required assertion / subcase oracle**

```text
assert word(u,0x9402)==0x9000
```


<a id="tools-verify-native-equations-py"></a>
## tools/verify-native-equations.py

Source: [tools/verify-native-equations.py](../tools/verify-native-equations.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `sys,struct,json,random,importlib.util,argparse`,
`pathlib`, `unicorn`, `unicorn.x86_const`, `hashlib`.

### Inputs, procedure and expected outputs

v32 native formula regression vectors. RNG calls are replaced with controlled
rolls; all arithmetic instructions run unchanged.

CLI, input identity and report writes (literal source):

```python
parser=argparse.ArgumentParser(description='Isolated 16-bit native
domestic/combat calculations; requires optional unicorn package. No DOS OS or
game
execution.');parser.add_argument('main_exe',type=Path);parser.add_argument('outp
ut',type=Path);args=parser.parse_args()
data=args.main_exe.read_bytes();assert
hashlib.sha256(data).hexdigest()==original.EXPECTED
args.output.write_text(json.dumps(results,separators=(',',':'))+'\n')
print('1300 isolated native equation vectors passed (controlled RNG hooks, no
DOS runtime)')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L12
def run(start,args,setup,rolls=[]):
# L17
 def hook(u,address,size,data):
# L26
def write(u,at,fmt,*v):u.mem_write(DS+at,struct.pack(fmt,*v))
# L29
for i in range(500):
# L31
 def init(u):write(u,0x9004,'BBB',I,50,C);write(u,0x33b3,'B',D)
# L37
for terrain in range(7):
# L38
 for special in [False,True]:
# L39
  for i in range(50):
# L41
   def init(u):
# L48
for i in range(100):
# L50
 def
init(u):write(u,0x9005,'B',war);write(u,0x9012,'HHB',men,arms,training);write(u,
0x901a,'H',face)
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[9](../tools/verify-native-equations.py#L9)

**Required assertion / subcase oracle**

```text
data=args.main_exe.read_bytes();assert
hashlib.sha256(data).hexdigest()==original.EXPECTED
```

---

**Source line**

[21](../tools/verify-native-equations.py#L21)

**Required assertion / subcase oracle**

```text
assert 0<=value<bound or bound==0,(value,bound)
```

---

**Source line**

[24](../tools/verify-native-equations.py#L24)

**Required assertion / subcase oracle**

```text
u.emu_start(start,0x60001,count=100000);assert u.reg_read(UC_X86_REG_CS)==0x6000
```

---

**Source line**

[35](../tools/verify-native-equations.py#L35)

**Required assertion / subcase oracle**

```text
assert out==expected,(out,expected,I,C,gold,value,D)
```

---

**Source line**

[46](../tools/verify-native-equations.py#L46)

**Required assertion / subcase oracle**

```text
assert result==expected,(result,expected)
```

---

**Source line**

[52](../tools/verify-native-equations.py#L52)

**Required assertion / subcase oracle**

```text
assert out==expected,(out,expected)
```


<a id="tools-verify-native-fire-py"></a>
## tools/verify-native-fire.py

Source: [tools/verify-native-fire.py](../tools/verify-native-fire.py). Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse, hashlib, importlib.util, json, struct`,
`pathlib`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Bounded main.exe fire-goal checks; optional unicorn, no DOS/UI simulation.

Execute the recovered AI goal branch unchanged. Hooks control direction order,
unit lookup and UI/mobility bookkeeping. Movement/combat resolution is outside
this witness, so these checks establish priorities rather than full AI fidelity.

CLI, input identity and report writes (literal source):

```python
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Pa
th);p.add_argument('output',type=Path);a=p.parse_args()
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
out=dict(originalSha256=original.EXPECTED,unpackedSha256=hashlib.sha256(image).h
exdigest(),entry='0x2AD8A',cases=[run(case,camp) for camp in [0,2] for case in
cases])
a.output.write_text(json.dumps(out,indent=2)+'\n');print(f"{len(out['cases'])}
bounded native fire-goal checks passed")
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L24
def run(case,camp):
# L27
    def write(at,fmt,*values):u.mem_write(DS+at,struct.pack(fmt,*values))
# L28
    def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L38
    def hook(u,at,size,data):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[14](../tools/verify-native-fire.py#L14)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
```

---

**Source line**

[50](../tools/verify-native-fire.py#L50)

**Required assertion / subcase oracle**

```text
assert reached_fallback or u.reg_read(UC_X86_REG_CS)==0x6000
```

---

**Source line**

[52](../tools/verify-native-fire.py#L52)

**Required assertion / subcase oracle**

```text
if case['blocked']:assert reached_fallback
```

---

**Source line**

[53](../tools/verify-native-fire.py#L53)

**Required assertion / subcase oracle**

```text
elif case['enemy'] and case['men']>3000 and case['enemy']['men']<1000:assert
goal==case['at'] and target==0x9100
```

---

**Source line**

[54](../tools/verify-native-fire.py#L54)

**Required assertion / subcase oracle**

```text
else:assert goal!=case['at'] and not target
```


<a id="tools-verify-native-joint-v54-py"></a>
## tools/verify-native-joint-v54.py

Source: [tools/verify-native-joint-v54.py](../tools/verify-native-joint-v54.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `node:fs`, `node:path`, `node:url`,
`argparse,hashlib,json,struct,subprocess`, `pathlib`, `unicorn`,
`unicorn.x86_const`, `fs from 'node:fs';import path from 'node:path';import
{pathToFileURL} from 'node:url';`.

### Inputs, procedure and expected outputs

Portable bounded native simultaneous casualty witness.
Usage: PYTHONPATH=<unicorn-dependencies> python this.py main.exe output.json
--repo <rtk2 root>
Runs original joint assembly, power, casualty, equipment, mutation and stop
branches;
rendering/UI/DOS captive processing are suppressed. No AI training.

CLI, input identity and report writes (literal source):

```python
Usage: PYTHONPATH=<unicorn-dependencies> python this.py main.exe output.json
--repo <rtk2 root>
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Pa
th);p.add_argument('output',type=Path);p.add_argument('--repo',type=Path,require
d=True);a=p.parse_args()
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60
order_fixture=json.loads(json.dumps(next(f for f in fixtures if
f['name']=='3-attackers-0-terrain-mixed')))
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results),inden
t=2)+'\n')
print(len(results),'native human simultaneous casualty witnesses passed')
 output.push({name:fixture.name,final,targetLoss:fixture.defender.soldiers-defen
der.soldiers,exchanges:b.lastAction.exchanges,lossRows:b.lastAction.lossRows,rng
Used:rngIndex,text});
node_run=subprocess.run(['node','--input-type=module','-e',node_source,str(a.rep
o.resolve())],input=json.dumps(results),text=True,capture_output=True,check=True
)
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results),inden
t=2)+'\n')
print(len(results),'native/remaster casualty, equipment, RNG and exchange counts
matched; including shuffled helper order')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L12
def unpack(data):
# L30
for count in [2,3]:
# L31
 for terrain in [0,6]:
# L32
  for power in
['equal','mixed','low-equipment','early-defender-zero','early-attacker-zero']:
# L35
    for i,v in
enumerate(attackers):v.update(war=[45,99,82][i],training=[30,85,60][i],weapons=[
1000,5000,2500][i],combatWarBonus=20 if i==1 else 0)
# L38
    for i,v in
enumerate(attackers):v.update(weapons=[25,1000,900][i],war=[92,65,55][i])
# L49
def run(fixture):
# L51
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L52
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L54
 def stats(ptr):return dict(soldiers=word(ptr+0x12),weapons=word(ptr+0x14))
# L55
 def snapshot():return {hex(ptr):stats(ptr) for ptr in allptrs}
# L57
 for i,(ptr,v) in
enumerate(zip(allptrs,fixture['attackers']+[fixture['defender']])):
# L62
 def return_hook(value):
# L64
 def hook(u,at,size,data):
# L83
 for i,x in enumerate(exchanges):
# L107
for native,current in zip(results,node_results):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[13](../tools/verify-native-joint-v54.py#L13)

**Required assertion / subcase oracle**

```text
h=struct.unpack_from('<14H',data);assert h[0]==0x5a4d and h[3]==0
```

---

**Source line**

[14](../tools/verify-native-joint-v54.py#L14)

**Required assertion / subcase oracle**

```text
packed=data[h[4]*16:];stub=h[11]*16;assert packed[stub+14:stub+16]==b'RB'
```

---

**Source line**

[18](../tools/verify-native-joint-v54.py#L18)

**Required assertion / subcase oracle**

```text
opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert
count<=dst+1
```

---

**Source line**

[24](../tools/verify-native-joint-v54.py#L24)

**Required assertion / subcase oracle**

```text
assert src==dst
```

---

**Source line**

[27](../tools/verify-native-joint-v54.py#L27)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60
```

---

**Source line**

[80](../tools/verify-native-joint-v54.py#L80)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,trace[-30:]
```

---

**Source line**

[82](../tools/verify-native-joint-v54.py#L82)

**Required assertion / subcase oracle**

```text
assert targetloss==sum(parts)
```

---

**Source line**

[84](../tools/verify-native-joint-v54.py#L84)

**Required assertion / subcase oracle**

```text
assert x['factor']==len(ptrs)
```

---

**Source line**

[85](../tools/verify-native-joint-v54.py#L85)

**Required assertion / subcase oracle**

```text
if i:assert x['before'][hex(defptr)]==exchanges[i-1]['after'][hex(defptr)]
```

---

**Source line**

[109](../tools/verify-native-joint-v54.py#L109)

**Required assertion / subcase oracle**

```text
assert native['targetLoss']==current['targetLoss'],native['name']
```

---

**Source line**

[110](../tools/verify-native-joint-v54.py#L110)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterSoldiersMatch'],native['name']
```

---

**Source line**

[111](../tools/verify-native-joint-v54.py#L111)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterWeaponsMatch'],native['name']
```

---

**Source line**

[112](../tools/verify-native-joint-v54.py#L112)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterRngCountMatch'],native['name']
```

---

**Source line**

[113](../tools/verify-native-joint-v54.py#L113)

**Required assertion / subcase oracle**

```text
assert native['nativeRemasterExchangeCountMatch'],native['name']
```


<a id="tools-verify-native-messenger-exemption-v53-py"></a>
## tools/verify-native-messenger-exemption-v53.py

Source: [tools/verify-native-messenger-exemption-v53.py][test-source-610].
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: `/workspace/scratch/7c8707393eee/messenger-exemption-v53.json`.
Dependencies/entry points: `pathlib`, `sys,json`.

### Inputs, procedure and expected outputs

from pathlib import Path
import sys,json
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+'
ORIGINAL_MAIN_EXE OUTPUT_JSON')
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in
[89,90]:')[0].replace("Path(__file__).with_name('verify-original.py')","Path(__f
ile__).with_name('verify-original.py')"))
SENDER=0x2b34;INTERCEPTOR=0x2b34+0x29;cases=[]
for mode in range(13):
 for destinationOwner in [1,2]:
  for jointOwner in [1,2]:
   expected=7<=mode<=11 and destinationOwner==1 or mode==1 and jointOwner==1

CLI, input identity and report writes (literal source):

```python
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+'
ORIGINAL_MAIN_EXE OUTPUT_JSON')
Path('/workspace/scratch/7c8707393eee/messenger-exemption-v53.json').write_text(
json.dumps(dict(originalSha256=original.EXPECTED,cases=cases,limits=['52
predicate cases execute native predicate, owner lookup, owner-ID and clamped
hostility modifiers without hooks.','32 outer imprisonment cases keep authentic
predicate and relation/trust arithmetic, but stub is-ruler test, escape decision
and render follow-up.','Native officer flag0x20 side effect on mode8 is
recorded; its broader meaning is outside this bounded audit.']),indent=2)+'\n')
print(len(cases),'native messenger exemption witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L7
for mode in range(13):
# L8
 for destinationOwner in [1,2]:
# L9
  for jointOwner in [1,2]:
# L11
   def setup(u,w):
# L17
   cases.append(dict(rule='Authentic exemption predicate retains original owner
lookup and relation
modifier',mode=mode,destinationOwner=destinationOwner,jointTargetOwner=jointOwne
r,exemption=bool(actual),interceptorHostility=byte(INTERCEPTOR+0xe),targetOffice
rFlags=byte(0x9202)))
# L18
for mode in [0,1,7,8,9,10,11,12]:
# L19
 for allied in [0,1]:
# L20
  for targetMatches in [0,1]:
# L22
   def setup(u,w):
# L29
   cases.append(dict(rule='Authentic imprisonment branch exempts allied
trustminus5 only when mission targets
interceptor',mode=mode,allied=bool(allied),targetMatches=bool(targetMatches),tru
stExempt=expected,interceptorTrust=byte(INTERCEPTOR+6),senderHostility=byte(SEND
ER+0xf),interceptorHostility=byte(INTERCEPTOR+0xe)))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[16](../tools/verify-native-messenger-exemption-v53.py#L16)

**Required assertion / subcase oracle**

```text
assert actual==expected and byte(INTERCEPTOR+0xe)==(53 if expected else 50) and
byte(0x9202)==(0x22 if mode==8 and expected else 0x02)
```

---

**Source line**

[28](../tools/verify-native-messenger-exemption-v53.py#L28)

**Required assertion / subcase oracle**

```text
assert byte(INTERCEPTOR+6)==(70 if expected or not allied else 65) and
byte(SENDER+0xf)==(58 if allied else 60) and byte(INTERCEPTOR+0xe)==(53 if
expected else 50)
```


<a id="tools-verify-native-messenger-v53-py"></a>
## tools/verify-native-messenger-v53.py

Source: [tools/verify-native-messenger-v53.py][test-source-611]. Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: `/workspace/scratch/7c8707393eee/messenger-witness-v53.json`.
Dependencies/entry points: `pathlib`, `sys,json`.

### Inputs, procedure and expected outputs

from pathlib import Path
import sys,json
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+'
ORIGINAL_MAIN_EXE OUTPUT_JSON')
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in
[89,90]:')[0].replace("Path(__file__).with_name('verify-original.py')","Path(__f
ile__).with_name('verify-original.py')"))
results=[]
# Courier interpolation executes its actual sprite routine and sound dispatch.
for driver,sound in [(1,1),(1,0),(0,1)]:
 def setup(u,w):
  w(0x9000+0x1c,'HH',30,40);w(0x9100+0x1c,'HH',90,60)

CLI, input identity and report writes (literal source):

```python
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+'
ORIGINAL_MAIN_EXE OUTPUT_JSON')
Path('/workspace/scratch/7c8707393eee/messenger-witness-v53.json').write_text(js
on.dumps(dict(originalSha256=original.EXPECTED,cases=results,limits=['Courier
routine retains actual sprite and interpolation instructions;
graphics/waits/sound dispatcher are hooked, so no waveform proof.','Set-free
branches retain actual byte-clamped trust and hostility arithmetic; owner-ID
helper is bounded to0.','Journey controller retains original routing decisions
and forward/reverse loops; route builder, interception decision, mission
resolver and render calls are bounded hooks.']),indent=2)+'\n')
print(len(results),'messenger witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L8
for driver,sound in [(1,1),(1,0),(0,1)]:
# L9
 def setup(u,w):
# L12
 def effect(u,w,word,byte,sp,seen):seen.append(word(sp+4)&255)
# L15
 results.append(dict(rule='Native courier movement dispatches effect11 each
interpolation frame',driver=driver,sound=sound,calls=seen))
# L17
for alliance in [0,1]:
# L18
 def setup(u,w):
# L22
 results.append(dict(rule='Native transport Set free continues outbound and
lowers sender hostility3; allied interceptor trust
rises3',alliance=bool(alliance),routeStatus=byte(0xca86),senderHostility=byte(0x
900e),interceptorTrust=byte(0x9106)))
# L24
for alliance in [0,1]:
# L25
 def setup(u,w):
# L29
 results.append(dict(rule='Native imprisonment attempt changes sender hostility8
allied10 nonallied and allied interceptor trustminus5 before
escape',alliance=bool(alliance),senderHostility=byte(0x900e),interceptorTrust=by
te(0x9106)))
# L31
for choice in [1,2]:
# L32
 def setup(u,w):
# L36
 results.append(dict(rule='Native secret-letter permission/seizure route
outcomes
differ',choice=choice,routeStatus=byte(0xca86),senderHostility=byte(0x900e)))
# L38
for mode,status in [(0,1),(12,0)]:
# L39
 def setup(u,w):
# L41
 def route(u,w,word,byte,sp,seen):w(word(sp+4),'HHH',0x9000,0x9100,0x9200)
# L42
 def
move(u,w,word,byte,sp,seen):seen.append(dict(fromProvince=hex(word(sp+4)),toProv
ince=hex(word(sp+6))))
# L43
 def encounter(u,w,word,byte,sp,seen):return int(word(sp+4)==0x9100)
# L44
 def choice(u,w,word,byte,sp,seen):w(0xca86,'B',status)
# L45
 def
mission(u,w,word,byte,sp,seen):seen.append(dict(missionResolved=True));w(0xcea0,
'B',0)
# L49
 results.append(dict(rule='Native controller renders release return with
original segment routine; transport release first finishes outward
route',mode=mode,status=status,events=seen))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[14](../tools/verify-native-messenger-v53.py#L14)

**Required assertion / subcase oracle**

```text
assert seen==([11,11,11] if driver and sound else [])
```

---

**Source line**

[21](../tools/verify-native-messenger-v53.py#L21)

**Required assertion / subcase oracle**

```text
assert byte(0xca86)==0 and byte(0x900e)==47 and byte(0x9106)==(73 if alliance
else 70)
```

---

**Source line**

[28](../tools/verify-native-messenger-v53.py#L28)

**Required assertion / subcase oracle**

```text
assert byte(0x900e)==(58 if alliance else 60) and byte(0x9106)==(65 if alliance
else 70)
```

---

**Source line**

[35](../tools/verify-native-messenger-v53.py#L35)

**Required assertion / subcase oracle**

```text
assert byte(0xca86)==choice
```

---

**Source line**

[48](../tools/verify-native-messenger-v53.py#L48)

**Required assertion / subcase oracle**

```text
assert seen==expected,(mode,seen)
```


<a id="tools-verify-native-reward-v50-py"></a>
## tools/verify-native-reward-v50.py

Source:
[tools/verify-native-reward-v50.py](../tools/verify-native-reward-v50.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse, hashlib, importlib.util, json, struct`,
`pathlib`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Bounded v50 reward witnesses from the supplied English main.exe.

Runs the native candidate builder, reward arithmetic, action mark and deduction.
Officer-menu input, confirmation, presentation and random draws are controlled;
these hooks do not change officer or province stores. This is not DOS gameplay.

CLI, input identity and report writes (literal source):

```python
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Pa
th);p.add_argument('output',type=Path);a=p.parse_args()
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
output={'sha256':original.EXPECTED,'checks':{n:hex(o) for n,(o,_) in
checks.items()},'candidates':[],'awards':[],'aiAwards':[]}
a.output.write_text(json.dumps(output,indent=2)+'\n');print(f'{len(checks)}
native byte checks, {len(output["candidates"])} candidate cases and
{len(output["awards"])} reward cases and {len(output["aiAwards"])} AI reward
cases passed.')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L16
for name,(offset,value) in checks.items():assert
image[offset:offset+len(bytes.fromhex(value))]==bytes.fromhex(value),name
# L18
def w(u,off,fmt,*v):u.mem_write(DS+off,struct.pack('<'+fmt,*v))
# L19
def read(u,off,fmt):return
struct.unpack('<'+fmt,u.mem_read(DS+off,struct.calcsize('<'+fmt)))[0]
# L20
def execute(start,setup,args=(),hooks=None):
# L23
    for i,value in enumerate(args):w(u,0xfc04+i*2,'H',value)
# L25
    def hook(u,at,size,data):
# L32
def setup(u,home=False,acted=False,sick=False):
# L37
    for off in [0x9100,0x9200,0x9300]:
# L42
for home in [False,True]:
# L43
    for acted,sick in [(False,False),(True,False),(False,True)]:
# L49
for kind,menuChoice in [('gold',1),('horse',2),('writings',3)]:
# L50
    for roll in [0,1]:
# L51
        def selected(u,sp):
# L55
        def rng(u,sp):assert read(u,sp+4,'H')&255==2;return roll
# L56
        def number(u,sp):
# L67
for difficulty in [1,2,3]:
# L68
    for bonusRoll in range(difficulty):
# L69
        for horse in [False,True]:
# L71
            def aiSetup(u):setup(u);w(u,0x33b3,'B',difficulty);w(u,0x9019,'B',3
if horse else 0)
# L72
            def aiRng(u,sp):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[13](../tools/verify-native-reward-v50.py#L13)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
```

---

**Source line**

[16](../tools/verify-native-reward-v50.py#L16)

**Required assertion / subcase oracle**

```text
for name,(offset,value) in checks.items():assert
image[offset:offset+len(bytes.fromhex(value))]==bytes.fromhex(value),name
```

---

**Source line**

[30](../tools/verify-native-reward-v50.py#L30)

**Required assertion / subcase oracle**

```text
assert
observed['stopped'],hex(u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X86_REG_IP));
return u,observed
```

---

**Source line**

[45](../tools/verify-native-reward-v50.py#L45)

**Required assertion / subcase oracle**

```text
assert entries==([0x9300] if home else [0x9100,0x9300]);assert 0x9200 not in
entries
```

---

**Source line**

[52](../tools/verify-native-reward-v50.py#L52)

**Required assertion / subcase oracle**

```text
assert read(u,sp+4,'H')==(1 if kind=='writings' else 5)
```

---

**Source line**

[53](../tools/verify-native-reward-v50.py#L53)

**Required assertion / subcase oracle**

```text
assert read(u,0xceb2,'H')==0x9100 # native full entry rebuilt this reward list.
```

---

**Source line**

[55](../tools/verify-native-reward-v50.py#L55)

**Required assertion / subcase oracle**

```text
def rng(u,sp):assert read(u,sp+4,'H')&255==2;return roll
```

---

**Source line**

[57](../tools/verify-native-reward-v50.py#L57)

**Required assertion / subcase oracle**

```text
prompt=read(u,sp+4,'H');assert prompt in [0x87a2,0x875b];return menuChoice if
prompt==0x87a2 else 40
```

---

**Source line**

[61](../tools/verify-native-reward-v50.py#L61)

**Required assertion / subcase oracle**

```text
assert acted&1
```

---

**Source line**

[62](../tools/verify-native-reward-v50.py#L62)

**Required assertion / subcase oracle**

```text
assert loyalty==({'gold':58+roll,'horse':70+roll,'writings':50}[kind]);assert
intelligence==(41 if kind=='writings' else 40);assert gold==(460 if kind=='gold'
else 500);assert horses==(2 if kind=='horse' else 3)
```

---

**Source line**

[63](../tools/verify-native-reward-v50.py#L63)

**Required assertion / subcase oracle**

```text
assert read(u,0x9302,'B')==0 and read(u,0x9202,'B')==0
```

---

**Source line**

[76](../tools/verify-native-reward-v50.py#L76)

**Required assertion / subcase oracle**

```text
assert draws==[2,difficulty], (difficulty,horse,draws,obs)
```

---

**Source line**

[77](../tools/verify-native-reward-v50.py#L77)

**Required assertion / subcase oracle**

```text
loyalty=read(u,0x910b,'B');assert loyalty==71+bonusRoll
```

---

**Source line**

[78](../tools/verify-native-reward-v50.py#L78)

**Required assertion / subcase oracle**

```text
assert read(u,0x9102,'B')&1 and not read(u,0x9202,'B')&1
```

---

**Source line**

[79](../tools/verify-native-reward-v50.py#L79)

**Required assertion / subcase oracle**

```text
assert read(u,0x9008,'H')==(500 if horse else 400);assert read(u,0x9019,'B')==(2
if horse else 0)
```


<a id="tools-verify-native-settlement-v56-py"></a>
## tools/verify-native-settlement-v56.py

Source: [tools/verify-native-settlement-v56.py][test-source-612]. Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`, `argparse,hashlib,json,struct,math`,
`unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Bounded English main.exe abstract retreat and captive service witnesses.
Run: PYTHONPATH=/path/to/unicorn python native-settlement-v56.py MAIN.EXE
OUTPUT.json
No repo imports, no original bytes are exported. Each case describes suppressed
paths.

CLI, input identity and report writes (literal source):

```python
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,unpackedSha256=hashl
ib.sha256(IMAGE).hexdigest(),cases=cases,count=len(cases)),indent=2)+'\n');print
(len(cases),'native settlement v56 witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L23
def run(start,cs,args,setup,hooks):
# L25
 for reg,val in
[(UC_X86_REG_DS,DS//16),(UC_X86_REG_SS,DS//16),(UC_X86_REG_SP,0xff00)]:u.reg_wri
te(reg,val)
# L26
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L27
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L28
 def byte(at):return u.mem_read(DS+at,1)[0]
# L30
 def hook(u,at,size,data):
# L46
def base(u,w):
# L48
 for i in range(41):w(P0+0x23*i+0x10,'BB',255,255)
# L57
def direction_for(candidate_ids):
# L58
 def enum(u,w,word,byte,sp,seen):
# L62
for candidate_order in [(0,1,2),(1,0,2),(0,2,1)]:
# L63
 for friendly in [True,False]:
# L64
  for success in [True,False]:
# L65
   def setup(u,w):
# L68
   def random(u,w,word,byte,sp,seen):
# L76
   cases.append(dict(rule='Abstract defeated defender selects occupied own
province before unclaimed; failed escape becomes
captive',candidateOrder=candidate_order,friendlyPresent=friendly,escapeSuccess=s
uccess,selectedProvinceIndex=(expected-P0)//0x23,joinedDestination=bool(actual),
captiveList=word(0xcb8c),events=seen,suppressed=['neighbor enumeration5C78
returns provided candidate indices; native two-pass owner/empty selection
retained','random4B38 controlled to allow/refuse escape; probability arithmetic
retained','province redraw4F44 suppressed; actual5F9E linked-list placement
retained']))
# L78
for friendly in [True,False]:
# L79
 def setup(u,w):
# L81
 def
random(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4),value=0));
return 0
# L84
 cases.append(dict(rule='Full abstract entry21418 reaches real defeated defender
selection and writes; supplied combat outcome
only',friendlyPresent=friendly,selectedProvinceIndex=1 if friendly else
0,events=seen,suppressed=['combat roster/build20FB4 returns present and
combat21138 outcome fixed attacker victory0','neighbor enumeration5C78 and
RNG4B38 controlled','redraw4F44; actual21418→20DAC→20CAE→20C26 and5F9Ewrites
retained']))
# L86
for denominatorRoll,bonusRoll,ruler,portrait,occupiedNew in
[(0,0,False,False,False),(2,49,False,False,False),(0,0,True,False,False),(0,0,Fa
lse,True,False),(0,0,False,False,True)]:
# L88
 for finalRoll in ([threshold-1,threshold] if threshold<=99 else [99]):
# L89
  def setup(u,w):
# L92
  def
random(u,w,word,byte,sp,seen):value=queue.pop(0);seen.append(dict(randomBound=wo
rd(sp+4),value=value));return value
# L95
  cases.append(dict(rule='Native abstract escape exact equation and
ruler/portrait/unclaimed
bonuses',denominatorRoll=denominatorRoll,bonusRoll=bonusRoll,ruler=ruler,portrai
tA3=portrait,priorUnclaimedEscape=occupiedNew,threshold=threshold,finalRoll=fina
lRoll,escaped=bool(u.reg_read(UC_X86_REG_AX)),events=seen,suppressed=['only
random4B38 controlled; exact arithmetic, ruler identification55F8 and portrait
comparison retained']))
# L97
def setup(u,w):
# L99
def noRng(u,w,word,byte,sp,seen):raise AssertionError('No destination must not
roll escape')
# L102
cases.append(dict(rule='No abstract refuge captures without escape
RNG',events=seen,suppressed=['candidate enumeration5C78; captive injury
duration58BA fixed0; native capture list20AE8 retained']))
# L104
for human in [True,False]:
# L105
 for oldLoyalty in [0,90,99,100]:
# L106
  for difference in [0,100]:
# L107
   for jitter in [0,4]:
# L108
    for strength in [69,70]:
# L109
     def setup(u,w):
# L112
     def
menu(u,w,word,byte,sp,seen):seen.append(dict(inputRange=[word(sp+4),word(sp+6)],
choice=1));return 1
# L113
     def
random(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4)&255,value=
jitter));return jitter
# L114
     def
terminal(u,w,word,byte,sp,seen):seen.append(dict(beheaded=word(sp+4)));return 0
# L119
     cases.append(dict(rule='Full native ordinary captive Recruit is
unconditional for human; AI recruits at INT+WAR>=70 otherwise
beheads',human=human,oldLoyalty=oldLoyalty,compatibilityDifference=difference,ji
tter=jitter,intPlusWar=strength,recruited=joins,newLoyalty=byte(OFF+0xb),events=
seen,suppressed=['music598A and render8C26/8CFC/4DE0/45D8','human menu4888
chooses Recruit1','loyalty jitter58BA controlled; native
owner/initializer/integer-square-root/5F9Eplacement retained','terminal6062
recorded instead of removing officer']))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[10](../tools/verify-native-settlement-v56.py#L10)

**Required assertion / subcase oracle**

```text
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==EXPECTED
```

---

**Source line**

[11](../tools/verify-native-settlement-v56.py#L11)

**Required assertion / subcase oracle**

```text
h=struct.unpack_from('<14H',raw);assert h[0]==0x5a4d and
h[3]==0;packed=raw[h[4]*16:];stub=h[11]*16;assert
packed[stub+14:stub+16]==b'RB';end=struct.unpack_from('<H',packed,stub+12)[0]*16
```

---

**Source line**

[15](../tools/verify-native-settlement-v56.py#L15)

**Required assertion / subcase oracle**

```text
opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert
count<=dst+1
```

---

**Source line**

[17](../tools/verify-native-settlement-v56.py#L17)

**Required assertion / subcase oracle**

```text
elif opcode in [0xb2,0xb3]:assert
count<=src+1;image[dst-count+1:dst+1]=packed[src-count+1:src+1];src-=count
```

---

**Source line**

[21](../tools/verify-native-settlement-v56.py#L21)

**Required assertion / subcase oracle**

```text
assert src==dst;image[:src+1]=packed[:src+1];IMAGE=bytes(image);DS=0x2fa60
```

---

**Source line**

[39](../tools/verify-native-settlement-v56.py#L39)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-25:]);return
u,seen,word,byte
```

---

**Source line**

[74](../tools/verify-native-settlement-v56.py#L74)

**Required assertion / subcase oracle**

```text
assert (actual if success else
word(0xcb8c)==OFF),(candidate_order,friendly,success,seen,word(0xcb8c),word(P0+2
),word(0x9600))
```

---

**Source line**

[75](../tools/verify-native-settlement-v56.py#L75)

**Required assertion / subcase oracle**

```text
assert byte(OFF+0xa)==1 and byte(OFF+0xb)==90
```

---

**Source line**

[83](../tools/verify-native-settlement-v56.py#L83)

**Required assertion / subcase oracle**

```text
assert (word(0x9600)==OFF if friendly else word(P0+2)==OFF) and word(0xcb76)==0
and byte(0xcb67)==128 and byte(0xcae7)==0
```

---

**Source line**

[94](../tools/verify-native-settlement-v56.py#L94)

**Required assertion / subcase oracle**

```text
assert not queue and [e['randomBound'] for e in seen]==[3,50,100] and
u.reg_read(UC_X86_REG_AX)==int(finalRoll<threshold)
```

---

**Source line**

[101](../tools/verify-native-settlement-v56.py#L101)

**Required assertion / subcase oracle**

```text
assert word(0xcb8c)==OFF and word(P0+2)==0x9600 and
word(P1+2)==0x9700,(word(0xcb8c),seen)
```

---

**Source line**

[117](../tools/verify-native-settlement-v56.py#L117)

**Required assertion / subcase oracle**

```text
if joins:assert byte(OFF+0xa)==0 and byte(OFF+0xb)==expected and
word(DUMMY)==OFF and
word(FORMER+4)==0,(human,oldLoyalty,difference,jitter,strength,seen,byte(OFF+0xa
),word(DUMMY))
```

---

**Source line**

[118](../tools/verify-native-settlement-v56.py#L118)

**Required assertion / subcase oracle**

```text
else:assert byte(OFF+0xa)==1 and seen==[dict(beheaded=OFF)]
```


<a id="tools-verify-native-tactical-v49-py"></a>
## tools/verify-native-tactical-v49.py

Source: [tools/verify-native-tactical-v49.py][test-source-613]. Purpose: bounded
original-executable or deployment/geometry verification; the source's hook
boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`,
`argparse,hashlib,importlib.util,json,struct`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

from pathlib import Path
import argparse,hashlib,importlib.util,json,struct
from unicorn import Uc,UC_ARCH_X86,UC_MODE_16,UC_HOOK_CODE
from unicorn.x86_const import *
parser=argparse.ArgumentParser(description='Bounded native tactical witnesses;
not a full DOS
simulation.');parser.add_argument('main_exe',type=Path);parser.add_argument('out
put',type=Path);args=parser.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name(
'verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loade
r.exec_module(original)
RAW=args.main_exe.read_bytes();IMAGE=bytes(original.unpack(RAW)[0]);DS=0x2fa60
assert
hashlib.sha256(RAW).hexdigest()=='25f92228309660160cbd6b5cd55098b26b8ece266899aa
9f262848c017b1efd8'
CASES=[]
def run(start,cs,args,setup,hooks=None,stop_at=None):

CLI, input identity and report writes (literal source):

```python
parser=argparse.ArgumentParser(description='Bounded native tactical witnesses;
not a full DOS
simulation.');parser.add_argument('main_exe',type=Path);parser.add_argument('out
put',type=Path);args=parser.parse_args()
args.output.write_text(json.dumps(OUT,indent=2)+'\n');print(json.dumps(OUT,inden
t=2))
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L9
CASES=[]
# L10
def run(start,cs,args,setup,hooks=None,stop_at=None):
# L12
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
# L13
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L14
 def byte(at):return u.mem_read(DS+at,1)[0]
# L16
 def hook(u,at,size,data):
# L29
def arena(u,w,actor=(6,4),enemy=(7,4),ai=90,ei=60,terrain=0):
# L32
 for ptr,(q,r),intel,flag,mp in
[(0x9000,actor,ai,1,5),(0x9100,enemy,ei,4,7)]:w(ptr+4,'BB',intel,80);w(ptr+0x12,
'HHBBB',5000,5000,80,mp,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L35
for ai,ei,terrain,roll in
[(90,60,0,1),(60,60,0,1),(59,60,0,1),(90,60,6,1),(90,60,0,0)]:
# L36
 def setup(u,w):arena(u,w,ai=ai,ei=ei,terrain=terrain)
# L37
 def
random(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255,'result':roll
});return roll
# L40
 CASES.append(dict(rule='Human Move enemy
eligibility',entry='0x25956',actorINT=ai,enemyINT=ei,enemyTerrain=terrain,accept
ed=bool(accepted),chanceCalls=seen))
# L42
def
input_direction(u,w,word,byte,sp,seen):seen.append({'directionPrompt':word(sp+4)
,'showMobility':word(sp+6)});return 2
# L43
for roll in [0,1]:
# L44
 def
random(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255,'result':roll
});return roll
# L48
 CASES.append(dict(rule='Human actor moves down and tries adjacent enemy
pull',entry='0x25BA8',actorStart=[6,4],actorEnd=[6,5],actorMobilityBefore=5,acto
rMobilityAfter=byte(0x9017),enemyStart=[7,4],enemyEnd=[byte(0x9118)>>4,byte(0x91
18)&15],enemyMobilityBefore=7,enemyMobilityAfter=byte(0x9117),calls=seen))
# L50
for ai,ei,terrain,roll in
[(90,60,0,1),(60,60,0,1),(59,60,0,1),(90,60,6,1),(90,60,0,0)]:
# L51
 def
setup(u,w):arena(u,w,actor=(6,5),enemy=(7,4),ai=ai,ei=ei,terrain=terrain);w(0xba
6c+4*13+6,'B',0)
# L52
 def
random(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255,'result':roll
});return roll
# L55
 CASES.append(dict(rule='AI opportunistic enemy pull after
moving',entry='0x2D432',actorINT=ai,enemyINT=ei,enemyTerrain=terrain,enemyEnd=[b
yte(0x9118)>>4,byte(0x9118)&15],enemyMobilityAfter=byte(0x9117),pulled=accepted,
chanceCalls=seen))
# L57
for actor in [(6,6),(7,5),(8,6)]:
# L58
 def
setup(u,w):arena(u,w,actor=actor,enemy=(0,0));w(0xb8d7,'BB',7,6);w(0xb9d0+6*13+7
,'B',6);w(0xb8d1,'B',0)
# L61
 CASES.append(dict(rule='Native defender returns goal to empty
palace',entry='0x2A94A',actorAt=list(actor),palace=[7,6],goal=[byte(0xb8db),byte
(0xb8dc)],target=word(0xb8e4)))
# L63
def
empty_palace(u,w):arena(u,w,actor=(6,4),enemy=(0,0));w(0xb9d0+6*13+7,'B',6);w(0x
b8d7,'BB',7,6);u.mem_write(DS+0xe000,bytes([i%256 for i in
range(512)]));w(0xca9a,'H',0xe000)
# L64
def emptylookup(u,w,word,byte,sp,seen):assert
[word(sp+4),word(sp+6)]==[7,6];return 0
# L68
CASES.append(dict(rule='Burning unoccupied
palace',entry='0x266BC',fireFlag=byte(0xba6c+6*13+7),provinceBytesUnchanged=512,
menLoss=0))
# L70
for actor in [(6,4),(0,0)]:
# L71
 def setup(u,w):arena(u,w,actor=actor,enemy=(7,4),terrain=1)
# L74
 CASES.append(dict(rule='Native jungle draw sets concealed/order flags
irrespective of
adjacency',entry='0x24466',actorAt=list(actor),enemyAt=[7,4],flagsBefore=4,flags
After=byte(0xba6c+4*13+7)))
# L77
for terrain in [0,1]:
# L78
 def setup(u,w):arena(u,w,terrain=terrain);w(0xba6c+4*13+7,'B',20 if terrain==1
else 4);w(0xcae7,'B',0);w(0x33b3,'B',1);u.mem_write(DS+0xca8e,bytes(range(6)))
# L81
 CASES.append(dict(rule='Native AI target selector sees neighbouring jungle
occupancy',entry='0x2C166',enemyTerrain=terrain,enemyFlags=byte(0xba6c+4*13+7),t
arget=hex(word(0xb8e4))))
# L84
for gold,food,burn in
[(1000,20000,True),(1,1,True),(1,2,True),(999,12345,True),(1000,20000,False)]:
# L85
 def setup(u,w):
# L92
 CASES.append(dict(rule='Daily burning empty palace destroys defender
stores',entry='0x22DFC/0x22D76',burning=burn,goldBefore=gold,goldAfter=fg,foodBe
fore=food,foodAfter=ff,attackerStoresUnchanged=True))
# L95
def key_move_enemy(u,w,word,byte,sp,seen):return 50
# L96
def
select_enemy(u,w,word,byte,sp,seen):seen.append(dict(directionPrompt=word(sp+4)&
255,showMobility=word(sp+6),actorMobility=byte(0x9017),enemyMobility=byte(0x9117
)));return 3
# L97
def
normal_move_boundary(u,w,word,byte,sp,seen):seen.append(dict(nextRoutine='0x25BA
8',selectedEnemyDirection=word(sp+4)&255,actorMobility=byte(0x9017),enemyMobilit
y=byte(0x9117)));return 0
# L100
CASES.append(dict(rule='Human Move enemy direction selection costs zero
MP',entry='0x25CF8',actorMobilityUnchanged=5,enemyMobilityUnchanged=7,calls=seen
))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[8](../tools/verify-native-tactical-v49.py#L8)

**Required assertion / subcase oracle**

```text
assert
hashlib.sha256(RAW).hexdigest()=='25f92228309660160cbd6b5cd55098b26b8ece266899aa
9f262848c017b1efd8'
```

---

**Source line**

[25](../tools/verify-native-tactical-v49.py#L25)

**Required assertion / subcase oracle**

```text
assert u.reg_read(UC_X86_REG_CS)==0x6000 or
(u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X86_REG_IP))==stop_at,(hex(start),tr
ace[-25:])
```

---

**Source line**

[39](../tools/verify-native-tactical-v49.py#L39)

**Required assertion / subcase oracle**

```text
accepted=u.reg_read(UC_X86_REG_AX);assert accepted==int(ei<=ai and terrain!=6
and bool(roll))
```

---

**Source line**

[46](../tools/verify-native-tactical-v49.py#L46)

**Required assertion / subcase oracle**

```text
assert byte(0x9018)==0x65 and byte(0x9017)==3 and byte(0x9117)==7
```

---

**Source line**

[47](../tools/verify-native-tactical-v49.py#L47)

**Required assertion / subcase oracle**

```text
assert byte(0x9118)==(0x64 if roll else 0x74)
```

---

**Source line**

[54](../tools/verify-native-tactical-v49.py#L54)

**Required assertion / subcase oracle**

```text
accepted=byte(0x9118)==0x64;assert accepted==int(ei<ai and terrain!=6 and
bool(roll));assert byte(0x9117)==7
```

---

**Source line**

[60](../tools/verify-native-tactical-v49.py#L60)

**Required assertion / subcase oracle**

```text
assert [byte(0xb8db),byte(0xb8dc)]==[7,6]
```

---

**Source line**

[64](../tools/verify-native-tactical-v49.py#L64)

**Required assertion / subcase oracle**

```text
def emptylookup(u,w,word,byte,sp,seen):assert
[word(sp+4),word(sp+6)]==[7,6];return 0
```

---

**Source line**

[66](../tools/verify-native-tactical-v49.py#L66)

**Required assertion / subcase oracle**

```text
assert byte(0xba6c+6*13+7)==32
```

---

**Source line**

[67](../tools/verify-native-tactical-v49.py#L67)

**Required assertion / subcase oracle**

```text
assert bytes(u.mem_read(DS+0xe000,512))==bytes([i%256 for i in range(512)])
```

---

**Source line**

[73](../tools/verify-native-tactical-v49.py#L73)

**Required assertion / subcase oracle**

```text
assert byte(0xba6c+4*13+7)==0x94
```

---

**Source line**

[80](../tools/verify-native-tactical-v49.py#L80)

**Required assertion / subcase oracle**

```text
assert word(0xb8e4)==0x9100
```

---

**Source line**

[90](../tools/verify-native-tactical-v49.py#L90)

**Required assertion / subcase oracle**

```text
assert fg==(gold*70//100 if burn else gold) and ff==(food*70//100 if burn else
food)
```

---

**Source line**

[91](../tools/verify-native-tactical-v49.py#L91)

**Required assertion / subcase oracle**

```text
assert word(0xcaa3)==2000 and word(0xcaa9)+(word(0xcaab)<<16)==30000
```

---

**Source line**

[99](../tools/verify-native-tactical-v49.py#L99)

**Required assertion / subcase oracle**

```text
assert byte(0x9017)==5 and byte(0x9117)==7 and any(c.get('showMobility')==0 for
c in seen)
```


<a id="tools-verify-native-treasures-py"></a>
## tools/verify-native-treasures.py

Source: [tools/verify-native-treasures.py](../tools/verify-native-treasures.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse,importlib.util,json,struct,hashlib`,
`pathlib`.

### Inputs, procedure and expected outputs

Bounded v38 treasure arithmetic from the supplied English executable.
Runs native award instructions with UI and RNG controlled; not a DOS simulation.

CLI, input identity and report writes (literal source):

```python
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument(
'output',type=Path);a=p.parse_args()
data=a.main_exe.read_bytes();assert
hashlib.sha256(data).hexdigest()==native.EXPECTED
 a.output.write_text(json.dumps({'sha256':native.EXPECTED,'checks':{n:hex(o) for
n,(o,_) in checks.items()},'arithmeticStatus':'Not run: optional unicorn
dependency is unavailable.','limitations':['Static bytes and disassembly
establish allegiance=100, random(0, bonus-1)+5 and cap=100.','Acquisition
probability, recipient AI, compatibility change and messenger interception
probability are not verified.']},indent=2)+'\n');print(f'{len(checks)} native
byte checks passed; arithmetic execution unavailable.');raise SystemExit(0)
a.output.write_text(json.dumps({'sha256':native.EXPECTED,'checks':{n:hex(o) for
n,(o,_) in checks.items()},'vectors':vectors,'limitations':['Snippet ends before
stat-store and presentation helpers; gain and loyalty instructions are
native.','Treasure acquisition probability, recipient AI, compatibility changes
and return-trip interception probability are not established by these
checks.']},indent=2)+'\n');print(f'{len(checks)} native byte checks and
{len(vectors)} bounded treasure cases passed.')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L11
for name,(off,hexbytes) in checks.items():assert
image[off:off+len(bytes.fromhex(hexbytes))]==bytes.fromhex(hexbytes),name
# L18
for stat in range(3):
# L19
 for old in [0,47,90,98,100]:
# L20
  for roll in range(5):
# L22
   def w(off,fmt,*v):u.mem_write(DS+off,struct.pack(fmt,*v))
# L24
   def hook(u,address,size,data):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[8](../tools/verify-native-treasures.py#L8)

**Required assertion / subcase oracle**

```text
data=a.main_exe.read_bytes();assert
hashlib.sha256(data).hexdigest()==native.EXPECTED
```

---

**Source line**

[11](../tools/verify-native-treasures.py#L11)

**Required assertion / subcase oracle**

```text
for name,(off,hexbytes) in checks.items():assert
image[off:off+len(bytes.fromhex(hexbytes))]==bytes.fromhex(hexbytes),name
```

---

**Source line**

[27](../tools/verify-native-treasures.py#L27)

**Required assertion / subcase oracle**

```text
sp=u.reg_read(UC_X86_REG_SP);ip,cs,bound=struct.unpack('<3H',u.mem_read(DS+sp,6)
);assert
bound==5;u.reg_write(UC_X86_REG_AX,roll);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_w
rite(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
```

---

**Source line**

[29](../tools/verify-native-treasures.py#L29)

**Required assertion / subcase oracle**

```text
gain=u.mem_read(DS+0xeffc,1)[0];loyalty=u.mem_read(DS+0x900b,1)[0];assert
gain==min(100-old,5+roll);assert
loyalty==100;vectors.append({'stat':stat,'old':old,'roll':roll,'gain':gain,'loya
lty':loyalty})
```


<a id="tools-verify-native-turn-v52-py"></a>
## tools/verify-native-turn-v52.py

Source: [tools/verify-native-turn-v52.py](../tools/verify-native-turn-v52.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `pathlib`, `sys,json`.

### Inputs, procedure and expected outputs

from pathlib import Path
import sys,json
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in [89,90]:')[0])
results=[]
simulations=[]
for helperFlags in [1,129]:
 for enemyFlags in [4,132,20,148]:
  flashes=[]
  def setup(u,w):

CLI, input identity and report writes (literal source):

```python
args.output.write_text(json.dumps(dict(originalSha256=original.EXPECTED,cases=re
sults,limits=['Original geometry, ownership, lookup and eligibility are retained
in simultaneous witnesses; only rendering and exchange arithmetic are
intercepted.','Human controller witness retains original activation and
linked-list iteration; input, rendering, command body and outcome checks are
bounded hooks.']),indent=2)+'\n')
print(len(results),'bounded native v52 witnesses passed')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L7
for helperFlags in [1,129]:
# L8
 for enemyFlags in [4,132,20,148]:
# L10
  def setup(u,w):
# L12
   for ptr,(q,r),flag in
[(0x9000,(6,7),129),(0x9100,(7,7),helperFlags),(0x9200,(7,6),enemyFlags)]:w(ptr+
0x18,'B',(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
# L14
  def
exchange(u,w,word,byte,sp,seen):seen.append(dict(attacker=hex(word(sp+4)),defend
er=hex(word(sp+6)),factor=word(sp+8)));return 255
# L15
  def
animate(u,w,word,byte,sp,seen):flashes.append([word(sp+4)&255,word(sp+6)&255,wor
d(sp+8)&255,word(sp+10)&255])
# L19
  results.append(dict(rule='Full native simultaneous ignores helper and target
cell bit128 in
eligibility',helperFlagsBefore=helperFlags,enemyFlagsBefore=enemyFlags,helperFla
gsAfter=byte(0xba6c+7*13+7),enemyFlagsAfter=byte(0xba6c+6*13+7),calls=seen,flash
es=flashes))
# L22
for unitFlags in [1,129,4,132,20,148]:
# L23
 def setup(u,w):
# L26
 def input(u,w,word,byte,sp,seen):seen.append(hex(word(0xb8e6)));return 0x32
# L27
 def order(u,w,word,byte,sp,seen):w(0xb8e2,'B',1);return 0
# L28
 def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
# L31
 results.append(dict(rule='Native human own daily order follows linked-list
activation independently of cell
bit128',cellFlags=unitFlags,actualController='0x226A0',activatedUnits=seen))
# L34
for helperFlags,enemyFlags,memory in simulations:
# L35
 for role,ptr in [('helper',0x9100),('target',0x9200)]:
# L36
  def followup(u,w):
# L38
  def input(u,w,word,byte,sp,seen):seen.append(hex(word(0xb8e6)));return 0x32
# L39
  def order(u,w,word,byte,sp,seen):w(0xb8e2,'B',1);return 0
# L40
  def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
# L43
  results.append(dict(rule='Native simultaneous participant retains later own
army
activation',role=role,helperFlagsBefore=helperFlags,enemyFlagsBefore=enemyFlags,
activatedUnits=seen))
# L46
for intel in [89,90]:
# L47
 def setup(u,w):arena(u,w);w(0x9004,'B',intel);w(0xb9d0+4*13+7,'B',1)
# L50
 def followup(u,w):
# L52
 def input(u,w,word,byte,sp,seen):seen.append(hex(word(0xb8e6)));return 0x32
# L53
 def order(u,w,word,byte,sp,seen):w(0xb8e2,'B',1);return 0
# L54
 def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
# L57
 results.append(dict(rule='Native ambusher retains later own army
activation',moverINT=intel,ambusherFlagsAfterAmbush=4,activatedUnits=seen))
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[17](../tools/verify-native-turn-v52.py#L17)

**Required assertion / subcase oracle**

```text
assert
seen==[dict(attacker='0x9000',defender='0x9200',factor=2),dict(attacker='0x9100'
,defender='0x9200',factor=2)]
```

---

**Source line**

[30](../tools/verify-native-turn-v52.py#L30)

**Required assertion / subcase oracle**

```text
assert seen==['0x9000','0x9100'],(unitFlags,seen)
```

---

**Source line**

[42](../tools/verify-native-turn-v52.py#L42)

**Required assertion / subcase oracle**

```text
assert seen==[hex(ptr)]
```

---

**Source line**

[49](../tools/verify-native-turn-v52.py#L49)

**Required assertion / subcase oracle**

```text
assert byte(0xba6c+4*13+7)==4
```

---

**Source line**

[56](../tools/verify-native-turn-v52.py#L56)

**Required assertion / subcase oracle**

```text
assert seen==['0x9100']
```


<a id="tools-verify-native-turns-py"></a>
## tools/verify-native-turns.py

Source: [tools/verify-native-turns.py](../tools/verify-native-turns.py).
Purpose: bounded original-executable or deployment/geometry verification; the
source's hook boundaries are part of the specification.

Shared inputs: inline fixtures and helper arguments defined in this script.
Dependencies/entry points: `argparse,hashlib,importlib.util,json,struct`,
`pathlib`, `unicorn`, `unicorn.x86_const`.

### Inputs, procedure and expected outputs

Original movement, fire, deployment and simultaneous flags; optional Unicorn.
Arithmetic/branches run unchanged; controlled UI, input, eligibility and
cost-field
hooks keep these cases bounded. Full deployment and DOS parity are not claimed.

CLI, input identity and report writes (literal source):

```python
p=argparse.ArgumentParser(description='Bounded native battle rule checks;
UI/input/lookup hooks, no DOS
simulation.');p.add_argument('main_exe',type=Path);p.add_argument('output',type=
Path);a=p.parse_args()
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
image=bytes(original.unpack(raw)[0]);DS=0x2fa60;out={'originalSha256':original.E
XPECTED,'cases':[]}
a.output.write_text(json.dumps(out,indent=2)+'\n');print(f"{len(out['cases'])}
bounded native battle rule checks passed")
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L14
def run(start,args,setup,hooks):
# L16
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack(fmt,*v))
# L17
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
# L20
 def hook(u,at,size,data):
# L29
def setup(u,w):
# L34
for mode in [0,1]:
# L39
def simultaneous(u,w):
# L41
def lookup(u,w,word,sp,seen):return 0x9000 if (word(sp+4)&255)==6 else 0x9100
# L46
def deploy(u,w):
# L51
def occupied(u,w):
# L59
def rainy(u,w):
# L64
def burning(u,w):
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[11](../tools/verify-native-turns.py#L11)

**Required assertion / subcase oracle**

```text
raw=a.main_exe.read_bytes();assert
hashlib.sha256(raw).hexdigest()==original.EXPECTED
```

---

**Source line**

[25](../tools/verify-native-turns.py#L25)

**Required assertion / subcase oracle**

```text
u.hook_add(UC_HOOK_CODE,hook);cs=0x258b if 0x258b0<=start<0x269c0 else 0x269c if
0x269c0<=start<0x277e0 else 0x228d if 0x228d0<=start<0x2333c else
0x2475;u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,start-cs*16);u.em
u_start(start,0x60001,count=200000);assert
u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),hex(u.reg_read(UC_X86_REG_CS)*16+u
.reg_read(UC_X86_REG_IP)))
```

---

**Source line**

[32](../tools/verify-native-turns.py#L32)

**Required assertion / subcase oracle**

```text
assert list(u.mem_read(DS+0x9017,2))==[0,0x66]
```

---

**Source line**

[36](../tools/verify-native-turns.py#L36)

**Required assertion / subcase oracle**

```text
lost=5000-struct.unpack('<H',u.mem_read(DS+0x9012,2))[0];assert
lost==[750,125][mode]
```

---

**Source line**

[43](../tools/verify-native-turns.py#L43)

**Required assertion / subcase oracle**

```text
flags=[u.mem_read(DS+0xba6c+7*13+q,1)[0] for q in [6,7]];assert flags==[1,1]
```

---

**Source line**

[49](../tools/verify-native-turns.py#L49)

**Required assertion / subcase oracle**

```text
assert u.mem_read(DS+0x9018,1)[0]==0x66
```

---

**Source line**

[54](../tools/verify-native-turns.py#L54)

**Required assertion / subcase oracle**

```text
assert u.mem_read(DS+0x9018,1)[0]==0x63
```

---

**Source line**

[57](../tools/verify-native-turns.py#L57)

**Required assertion / subcase oracle**

```text
assert u.mem_read(DS+0x9018,1)[0]==0x53
```

---

**Source line**

[62](../tools/verify-native-turns.py#L62)

**Required assertion / subcase oracle**

```text
assert u.mem_read(DS+0xba6c+4*13+6,1)[0]==1
```

---

**Source line**

[67](../tools/verify-native-turns.py#L67)

**Required assertion / subcase oracle**

```text
assert seen==[dict(unit=0x9000,mode=0)]
```


<a id="tools-verify-original-py"></a>
## tools/verify-original.py

Source: [tools/verify-original.py](../tools/verify-original.py). Purpose:
bounded original-executable or deployment/geometry verification; the source's
hook boundaries are part of the specification.

Shared inputs: `main.exe`. Dependencies/entry points: `argparse, hashlib, json,
struct`, `pathlib`.

### Inputs, procedure and expected outputs

Static v34 checks on supplied packed English main.exe and scenario.dat.
Unpacks the binary's own backwards RLE stream in memory. Does not execute DOS,
modify inputs or redistribute executable bytes. Offsets are unpacked load-image
offsets.

CLI, input identity and report writes (literal source):

```python
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'

parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('inputs'
,type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
    assert sha==EXPECTED,'This verifier applies to the supplied English binary
only.'

args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json
.dumps(result,indent=2)+'\n')
    print(f'{len(checks)} binary checks passed; Liu Bei 189: {len(names)}
officers. {args.output}')
```

Subcases are expanded by these functions/matrices; parameters and branch labels
are preserved rather than reported as a single claimed case:

```python
# L8
def unpack(data):
# L29
def main():
# L131
    for name,(offset,hexbytes) in checks.items():
```

Success criteria: every executable assertion below and successful completion of
the report-writing path. Hooks/mocks can bypass graphics, keyboard, RNG or other
native routines; full DOS parity is not established. Running requires the
private source input, never a committed DOS binary.

---

**Source line**

[10](../tools/verify-original.py#L10)

**Required assertion / subcase oracle**

```text
assert header[0]==0x5a4d and header[3]==0
```

---

**Source line**

[12](../tools/verify-original.py#L12)

**Required assertion / subcase oracle**

```text
assert packed[stub+14:stub+16]==b'RB'
```

---

**Source line**

[18](../tools/verify-original.py#L18)

**Required assertion / subcase oracle**

```text
assert count<=dst+1
```

---

**Source line**

[21](../tools/verify-original.py#L21)

**Required assertion / subcase oracle**

```text
assert count<=src+1
```

---

**Source line**

[26](../tools/verify-original.py#L26)

**Required assertion / subcase oracle**

```text
assert src==dst
```

---

**Source line**

[32](../tools/verify-original.py#L32)

**Required assertion / subcase oracle**

```text
assert sha==EXPECTED,'This verifier applies to the supplied English binary
only.'
```

---

**Source line**

[132](../tools/verify-original.py#L132)

**Required assertion / subcase oracle**

```text
expected=bytes.fromhex(hexbytes);assert
image[offset:offset+len(expected)]==expected,name
```

---

**Source line**

[136](../tools/verify-original.py#L136)

**Required assertion / subcase oracle**

```text
assert names==['Liu Bei','Guan Yu','Zhang Fei']
```


## Build, training and support tools (not independent validation cases)

These scripts are not silently executed by this catalogue. Builders can replace
artwork/media/data; optimizer and benchmark commands have their own
inputs/outputs and do not substitute for regression tests. Run production
training only on explicit instruction. Historical fallback audio generators must
not overwrite driver-rendered native exports or the user's supplied clips.

- [tools/ai-training-engine.mjs](../tools/ai-training-engine.mjs)
- [tools/ai-training-game.mjs](../tools/ai-training-game.mjs)
- [tools/benchmark-ai.mjs](../tools/benchmark-ai.mjs)
- [tools/build-audio.py](../tools/build-audio.py)
- [tools/build-battle-audio.py](../tools/build-battle-audio.py)
- [tools/build-charge-audio.py](../tools/build-charge-audio.py)
- [tools/build-event-audio.py](../tools/build-event-audio.py)
- [tools/build-fidelity-data.py](../tools/build-fidelity-data.py)
- [tools/build-geography.py](../tools/build-geography.py)
- [tools/build-native-audio-v50.py](../tools/build-native-audio-v50.py)
- [tools/build-service-records.py](../tools/build-service-records.py)
- [tools/decode-reference.py](../tools/decode-reference.py)
- [tools/extract-native-opl-v50.py](../tools/extract-native-opl-v50.py)
- [tools/governance-conquest.mjs](../tools/governance-conquest.mjs)
- [tools/install-painted-maps.py](../tools/install-painted-maps.py)
- [tools/native-opl/render.py](../tools/native-opl/render.py)
- [tools/normalize-event-art.mjs](../tools/normalize-event-art.mjs)
- [tools/package-source.py](../tools/package-source.py)
- [tools/serve-game.py](../tools/serve-game.py)
- [tools/train-ai.mjs](../tools/train-ai.mjs)
- [tools/train-governance.mjs](../tools/train-governance.mjs)

## Keeping this document current

Run `node tools/generate-test-spec.mjs` after changing a test, then review the
generated case input excerpts, dynamic matrices and assertions against the
source. Cases are identified by their declared labels or PASS checkpoints; one
matrix row may expand to many executions. Generation does not run tests, create
training profiles or certify a pass. Add every new reported bug to a behavioral
case or record the exceptional missing design in pending-test-case-design.md.

[test-source-1]: #tools-verify-native-concealed-v56-py
[test-source-2]: #tools-verify-native-messenger-v53-py
[test-source-3]: #tools-verify-native-settlement-v56-py
[test-source-4]: ../tests/artwork-tests.mjs#L1-L19
[test-source-5]: ../tests/artwork-tests.mjs#L19-L25
[test-source-6]: ../tests/artwork-tests.mjs#L25-L39
[test-source-7]: ../tests/artwork-tests.mjs#L39-L42
[test-source-8]: ../tests/asset-layout-tests.mjs#L1-L10
[test-source-9]: ../tests/asset-layout-tests.mjs#L10-L14
[test-source-10]: ../tests/asset-layout-tests.mjs#L14-L18
[test-source-11]: ../tests/asset-layout-tests.mjs#L18-L22
[test-source-12]: ../tests/asset-layout-tests.mjs#L22-L27
[test-source-13]: ../tests/audio-v50-tests.mjs#L1-L10
[test-source-14]: ../tests/audio-v50-tests.mjs#L10-L12
[test-source-15]: ../tests/audio-v50-tests.mjs#L12-L16
[test-source-16]: ../tests/audio-v50-tests.mjs#L16-L21
[test-source-17]: ../tests/audio-v50-tests.mjs#L21-L23
[test-source-18]: ../tests/audio-v50-tests.mjs#L23-L27
[test-source-19]: ../tests/audio-v50-tests.mjs#L27-L29
[test-source-20]: ../tests/audio-v52-tests.mjs#L1-L10
[test-source-21]: ../tests/audio-v52-tests.mjs#L10-L12
[test-source-22]: ../tests/audio-v52-tests.mjs#L12-L15
[test-source-23]: ../tests/audio-v52-tests.mjs#L15-L17
[test-source-24]: ../tests/audio-v52-tests.mjs#L17-L19
[test-source-25]: ../tests/audio-v52-tests.mjs#L19-L21
[test-source-26]: ../tests/audio-v53-tests.mjs#L1-L11
[test-source-27]: ../tests/audio-v53-tests.mjs#L11-L13
[test-source-28]: ../tests/audio-v53-tests.mjs#L13-L15
[test-source-29]: ../tests/audio-v55-tests.mjs#L11-L14
[test-source-30]: ../tests/audio-v55-tests.mjs#L15-L17
[test-source-31]: ../tests/audio-v55-tests.mjs#L18-L21
[test-source-32]: ../tests/audio-v55-tests.mjs#L22-L24
[test-source-33]: ../tests/audio-v55-tests.mjs#L26-L28
[test-source-34]: ../tests/audio-v56-tests.mjs#L9-L9
[test-source-35]: ../tests/audio-v56-tests.mjs#L10-L10
[test-source-36]: ../tests/audio-v56-tests.mjs#L12-L12
[test-source-37]: ../tests/audio-v56-tests.mjs#L13-L13
[test-source-38]: ../tests/audio-v56-tests.mjs#L15-L15
[test-source-39]: ../tests/battle-tests.mjs#L11-L11
[test-source-40]: ../tests/battle-tests.mjs#L12-L12
[test-source-41]: ../tests/battle-tests.mjs#L13-L13
[test-source-42]: ../tests/battle-tests.mjs#L14-L14
[test-source-43]: ../tests/battle-tests.mjs#L15-L19
[test-source-44]: ../tests/battle-tests.mjs#L20-L24
[test-source-45]: ../tests/battle-tests.mjs#L25-L27
[test-source-46]: ../tests/battle-tests.mjs#L28-L32
[test-source-47]: ../tests/battle-tests.mjs#L33-L35
[test-source-48]: ../tests/battle-tests.mjs#L36-L39
[test-source-49]: ../tests/battle-tests.mjs#L40-L40
[test-source-50]: ../tests/battle-tests.mjs#L41-L41
[test-source-51]: ../tests/battle-tests.mjs#L42-L42
[test-source-52]: ../tests/battle-tests.mjs#L43-L43
[test-source-53]: ../tests/battle-tests.mjs#L44-L44
[test-source-54]: ../tests/battle-tests.mjs#L45-L45
[test-source-55]: ../tests/battle-tests.mjs#L46-L46
[test-source-56]: ../tests/battle-tests.mjs#L47-L47
[test-source-57]: ../tests/battle-tests.mjs#L48-L48
[test-source-58]: ../tests/battle-tests.mjs#L49-L49
[test-source-59]: ../tests/battle-tests.mjs#L50-L50
[test-source-60]: ../tests/battle-tests.mjs#L51-L51
[test-source-61]: ../tests/battle-tests.mjs#L52-L52
[test-source-62]: ../tests/battle-tests.mjs#L53-L53
[test-source-63]: ../tests/battle-tests.mjs#L54-L54
[test-source-64]: ../tests/battle-tests.mjs#L55-L55
[test-source-65]: ../tests/battle-tests.mjs#L56-L56
[test-source-66]: ../tests/battle-tests.mjs#L57-L57
[test-source-67]: ../tests/battle-tests.mjs#L58-L58
[test-source-68]: ../tests/battle-tests.mjs#L59-L59
[test-source-69]: ../tests/battle-tests.mjs#L60-L60
[test-source-70]: ../tests/battle-tests.mjs#L61-L61
[test-source-71]: ../tests/battle-tests.mjs#L62-L62
[test-source-72]: ../tests/battle-tests.mjs#L63-L63
[test-source-73]: ../tests/battle-tests.mjs#L64-L64
[test-source-74]: ../tests/battle-tests.mjs#L65-L65
[test-source-75]: ../tests/battle-tests.mjs#L66-L66
[test-source-76]: ../tests/battle-tests.mjs#L67-L67
[test-source-77]: ../tests/battle-tests.mjs#L68-L68
[test-source-78]: ../tests/battle-tests.mjs#L69-L69
[test-source-79]: ../tests/battle-tests.mjs#L70-L70
[test-source-80]: ../tests/battle-tests.mjs#L71-L71
[test-source-81]: ../tests/battle-tests.mjs#L72-L72
[test-source-82]: ../tests/battle-tests.mjs#L73-L73
[test-source-83]: ../tests/battle-tests.mjs#L74-L74
[test-source-84]: ../tests/battle-tests.mjs#L75-L75
[test-source-85]: ../tests/battle-tests.mjs#L76-L76
[test-source-86]: ../tests/battle-tests.mjs#L77-L77
[test-source-87]: ../tests/battle-tests.mjs#L78-L78
[test-source-88]: ../tests/battle-tests.mjs#L79-L79
[test-source-89]: ../tests/battle-tests.mjs#L80-L80
[test-source-90]: ../tests/battle-tests.mjs#L81-L81
[test-source-91]: ../tests/battle-tests.mjs#L83-L90
[test-source-92]: ../tests/battle-tests.mjs#L91-L95
[test-source-93]: ../tests/battle-tests.mjs#L96-L99
[test-source-94]: ../tests/completion-tests.mjs#L10-L10
[test-source-95]: ../tests/completion-tests.mjs#L11-L11
[test-source-96]: ../tests/completion-tests.mjs#L12-L12
[test-source-97]: ../tests/completion-tests.mjs#L13-L13
[test-source-98]: ../tests/completion-tests.mjs#L14-L14
[test-source-99]: ../tests/completion-tests.mjs#L15-L15
[test-source-100]: ../tests/completion-tests.mjs#L16-L16
[test-source-101]: ../tests/completion-tests.mjs#L17-L17
[test-source-102]: ../tests/completion-tests.mjs#L18-L18
[test-source-103]: ../tests/completion-tests.mjs#L19-L19
[test-source-104]: ../tests/completion-tests.mjs#L20-L20
[test-source-105]: ../tests/completion-tests.mjs#L21-L21
[test-source-106]: ../tests/completion-tests.mjs#L22-L22
[test-source-107]: ../tests/completion-tests.mjs#L23-L23
[test-source-108]: ../tests/completion-tests.mjs#L24-L24
[test-source-109]: ../tests/completion-tests.mjs#L25-L25
[test-source-110]: ../tests/decisions-tests.mjs
[test-source-111]: ../tests/decisions-tests.mjs#L18-L21
[test-source-112]: ../tests/decisions-tests.mjs#L22-L25
[test-source-113]: ../tests/decisions-tests.mjs#L26-L29
[test-source-114]: ../tests/decisions-tests.mjs#L30-L32
[test-source-115]: ../tests/decisions-tests.mjs#L33-L36
[test-source-116]: ../tests/decisions-tests.mjs#L37-L39
[test-source-117]: ../tests/decisions-tests.mjs#L41-L44
[test-source-118]: ../tests/decisions-tests.mjs#L45-L47
[test-source-119]: ../tests/decisions-tests.mjs#L48-L50
[test-source-120]: ../tests/decisions-tests.mjs#L51-L54
[test-source-121]: ../tests/decisions-tests.mjs#L55-L57
[test-source-122]: ../tests/decisions-tests.mjs#L58-L60
[test-source-123]: ../tests/decisions-tests.mjs#L61-L61
[test-source-124]: ../tests/expansion-tests.mjs#L10-L10
[test-source-125]: ../tests/expansion-tests.mjs#L11-L11
[test-source-126]: ../tests/expansion-tests.mjs#L12-L12
[test-source-127]: ../tests/expansion-tests.mjs#L13-L13
[test-source-128]: ../tests/expansion-tests.mjs#L14-L14
[test-source-129]: ../tests/expansion-tests.mjs#L15-L15
[test-source-130]: ../tests/expansion-tests.mjs#L16-L16
[test-source-131]: ../tests/expansion-tests.mjs#L17-L17
[test-source-132]: ../tests/expansion-tests.mjs#L18-L18
[test-source-133]: ../tests/expansion-tests.mjs#L19-L19
[test-source-134]: ../tests/expansion-tests.mjs#L20-L20
[test-source-135]: ../tests/expansion-tests.mjs#L21-L21
[test-source-136]: ../tests/expansion-tests.mjs#L22-L22
[test-source-137]: ../tests/expansion-tests.mjs#L23-L23
[test-source-138]: ../tests/expansion-tests.mjs#L24-L24
[test-source-139]: ../tests/expansion-tests.mjs#L25-L25
[test-source-140]: ../tests/expansion-tests.mjs#L26-L26
[test-source-141]: ../tests/fidelity-tests.mjs#L15-L15
[test-source-142]: ../tests/fidelity-tests.mjs#L16-L16
[test-source-143]: ../tests/fidelity-tests.mjs#L17-L17
[test-source-144]: ../tests/fidelity-tests.mjs#L18-L18
[test-source-145]: ../tests/fidelity-tests.mjs#L19-L19
[test-source-146]: ../tests/fidelity-tests.mjs#L20-L20
[test-source-147]: ../tests/fidelity-tests.mjs#L21-L21
[test-source-148]: ../tests/fidelity-tests.mjs#L22-L22
[test-source-149]: ../tests/fidelity-tests.mjs#L23-L23
[test-source-150]: ../tests/fidelity-tests.mjs#L24-L24
[test-source-151]: ../tests/fidelity-tests.mjs#L25-L25
[test-source-152]: ../tests/fidelity-tests.mjs#L26-L26
[test-source-153]: ../tests/fidelity-tests.mjs#L27-L27
[test-source-154]: ../tests/fidelity-tests.mjs#L28-L28
[test-source-155]: ../tests/fidelity-tests.mjs#L29-L29
[test-source-156]: ../tests/fidelity-tests.mjs#L30-L30
[test-source-157]: ../tests/fidelity-tests.mjs#L31-L31
[test-source-158]: ../tests/fidelity-tests.mjs#L32-L32
[test-source-159]: ../tests/fidelity-tests.mjs#L33-L33
[test-source-160]: ../tests/mobile-layout-tests.mjs#L1-L4
[test-source-161]: ../tests/mobile-layout-tests.mjs#L4-L13
[test-source-162]: ../tests/mobile-layout-tests.mjs#L13-L34
[test-source-163]: ../tests/mobile-layout-tests.mjs#L34-L35
[test-source-164]: ../tests/mobile-layout-tests.mjs#L35-L36
[test-source-165]: ../tests/mobile-layout-tests.mjs#L36-L40
[test-source-166]: ../tests/mobile-layout-tests.mjs#L40-L42
[test-source-167]: ../tests/monthly-tests.mjs#L10-L10
[test-source-168]: ../tests/monthly-tests.mjs#L11-L11
[test-source-169]: ../tests/monthly-tests.mjs#L12-L12
[test-source-170]: ../tests/monthly-tests.mjs#L13-L13
[test-source-171]: ../tests/monthly-tests.mjs#L14-L14
[test-source-172]: ../tests/monthly-tests.mjs#L15-L15
[test-source-173]: ../tests/monthly-tests.mjs#L16-L16
[test-source-174]: ../tests/monthly-tests.mjs#L17-L17
[test-source-175]: ../tests/monthly-tests.mjs#L18-L18
[test-source-176]: ../tests/monthly-tests.mjs#L19-L19
[test-source-177]: ../tests/monthly-tests.mjs#L20-L20
[test-source-178]: ../tests/monthly-tests.mjs#L21-L21
[test-source-179]: ../tests/province-tests.mjs#L12-L12
[test-source-180]: ../tests/province-tests.mjs#L13-L13
[test-source-181]: ../tests/province-tests.mjs#L14-L14
[test-source-182]: ../tests/province-tests.mjs#L15-L15
[test-source-183]: ../tests/province-tests.mjs#L16-L16
[test-source-184]: ../tests/province-tests.mjs#L17-L17
[test-source-185]: ../tests/province-tests.mjs#L18-L18
[test-source-186]: ../tests/province-tests.mjs#L19-L19
[test-source-187]: ../tests/province-tests.mjs#L20-L20
[test-source-188]: ../tests/province-tests.mjs#L21-L21
[test-source-189]: ../tests/province-tests.mjs#L22-L22
[test-source-190]: ../tests/province-tests.mjs#L23-L23
[test-source-191]: ../tests/province-tests.mjs#L24-L24
[test-source-192]: ../tests/province-tests.mjs#L25-L25
[test-source-193]: ../tests/province-tests.mjs#L26-L26
[test-source-194]: ../tests/province-tests.mjs#L27-L27
[test-source-195]: ../tests/province-tests.mjs#L28-L28
[test-source-196]: ../tests/province-tests.mjs#L29-L29
[test-source-197]: ../tests/province-tests.mjs#L30-L30
[test-source-198]: ../tests/province-tests.mjs#L31-L31
[test-source-199]: ../tests/province-tests.mjs#L32-L32
[test-source-200]: ../tests/province-tests.mjs#L33-L33
[test-source-201]: ../tests/province-tests.mjs#L34-L34
[test-source-202]: ../tests/province-tests.mjs#L35-L35
[test-source-203]: ../tests/strategy-tests.mjs#L3-L3
[test-source-204]: ../tests/strategy-tests.mjs#L4-L4
[test-source-205]: ../tests/strategy-tests.mjs#L5-L5
[test-source-206]: ../tests/strategy-tests.mjs#L6-L6
[test-source-207]: ../tests/strategy-tests.mjs#L7-L7
[test-source-208]: ../tests/strategy-tests.mjs#L8-L8
[test-source-209]: ../tests/strategy-tests.mjs#L9-L9
[test-source-210]: ../tests/strategy-tests.mjs#L10-L10
[test-source-211]: ../tests/strategy-tests.mjs#L11-L11
[test-source-212]: ../tests/strategy-tests.mjs#L12-L12
[test-source-213]: ../tests/strategy-tests.mjs#L13-L13
[test-source-214]: ../tests/strategy-tests.mjs#L14-L14
[test-source-215]: ../tests/strategy-tests.mjs#L15-L15
[test-source-216]: ../tests/strategy-tests.mjs#L16-L16
[test-source-217]: ../tests/strategy-tests.mjs#L17-L17
[test-source-218]: ../tests/tests.mjs#L4-L4
[test-source-219]: ../tests/tests.mjs#L5-L5
[test-source-220]: ../tests/tests.mjs#L6-L6
[test-source-221]: ../tests/tests.mjs#L7-L7
[test-source-222]: ../tests/tests.mjs#L8-L8
[test-source-223]: ../tests/tests.mjs#L9-L9
[test-source-224]: ../tests/tests.mjs#L10-L10
[test-source-225]: ../tests/tests.mjs#L11-L11
[test-source-226]: ../tests/tests.mjs#L12-L12
[test-source-227]: ../tests/tests.mjs#L13-L13
[test-source-228]: ../tests/tests.mjs#L14-L14
[test-source-229]: ../tests/tests.mjs#L15-L15
[test-source-230]: ../tests/tests.mjs#L16-L16
[test-source-231]: ../tests/tests.mjs#L17-L17
[test-source-232]: ../tests/tests.mjs#L18-L18
[test-source-233]: ../tests/ui-tests.mjs#L1-L28
[test-source-234]: ../tests/ui-tests.mjs#L28-L28
[test-source-235]: ../tests/ui-tests.mjs#L28-L29
[test-source-236]: ../tests/ui-tests.mjs#L29-L29
[test-source-237]: ../tests/ui-tests.mjs#L29-L29
[test-source-238]: ../tests/ui-tests.mjs#L29-L33
[test-source-239]: ../tests/ui-tests.mjs#L33-L35
[test-source-240]: ../tests/ui-tests.mjs#L35-L51
[test-source-241]: ../tests/ui-tests.mjs#L51-L64
[test-source-242]: ../tests/ui-tests.mjs#L64-L66
[test-source-243]: ../tests/ui-tests.mjs#L66-L69
[test-source-244]: ../tests/ui-tests.mjs#L69-L70
[test-source-245]: ../tests/ui-tests.mjs#L70-L72
[test-source-246]: ../tests/ui-tests.mjs#L72-L73
[test-source-247]: ../tests/ui-tests.mjs#L73-L82
[test-source-248]: ../tests/ui-tests.mjs#L82-L83
[test-source-249]: ../tests/ui-tests.mjs#L83-L94
[test-source-250]: ../tests/ui-tests.mjs#L94-L96
[test-source-251]: ../tests/ui-tests.mjs#L96-L97
[test-source-252]: ../tests/ui-tests.mjs#L97-L98
[test-source-253]: ../tests/ui-tests.mjs#L98-L99
[test-source-254]: ../tests/ui-tests.mjs#L99-L102
[test-source-255]: ../tests/ui-tests.mjs#L102-L103
[test-source-256]: ../tests/ui-tests.mjs#L103-L105
[test-source-257]: ../tests/ui-tests.mjs#L105-L106
[test-source-258]: ../tests/ui-tests.mjs#L106-L107
[test-source-259]: ../tests/ui-tests.mjs#L107-L107
[test-source-260]: ../tests/ui-tests.mjs#L107-L108
[test-source-261]: ../tests/ui-tests.mjs#L108-L109
[test-source-262]: ../tests/ui-tests.mjs#L109-L124
[test-source-263]: ../tests/ui-tests.mjs#L124-L134
[test-source-264]: ../tests/ui-tests.mjs#L134-L147
[test-source-265]: ../tests/ui-tests.mjs#L147-L158
[test-source-266]: ../tests/ui-tests.mjs#L158-L160
[test-source-267]: ../tests/ui-tests.mjs#L160-L172
[test-source-268]: ../tests/ui-tests.mjs#L172-L173
[test-source-269]: ../tests/ui-tests.mjs#L173-L174
[test-source-270]: ../tests/ui-tests.mjs#L174-L177
[test-source-271]: ../tests/ui-tests.mjs#L177-L179
[test-source-272]: ../tests/ui-tests.mjs#L179-L181
[test-source-273]: ../tests/ui-tests.mjs#L181-L182
[test-source-274]: ../tests/ui-tests.mjs#L182-L183
[test-source-275]: ../tests/ui-tests.mjs#L183-L184
[test-source-276]: ../tests/ui-tests.mjs#L184-L184
[test-source-277]: ../tests/ui-tests.mjs#L184-L185
[test-source-278]: ../tests/ui-tests.mjs#L185-L187
[test-source-279]: ../tests/ui-tests.mjs#L187-L187
[test-source-280]: ../tests/ui-tests.mjs#L187-L188
[test-source-281]: ../tests/ui-tests.mjs#L188-L189
[test-source-282]: ../tests/ui-tests.mjs#L189-L189
[test-source-283]: ../tests/ui-tests.mjs#L189-L190
[test-source-284]: ../tests/ui-tests.mjs#L190-L192
[test-source-285]: ../tests/ui-tests.mjs#L192-L193
[test-source-286]: ../tests/ui-tests.mjs#L193-L193
[test-source-287]: ../tests/ui-tests.mjs#L193-L193
[test-source-288]: ../tests/ui-tests.mjs#L193-L193
[test-source-289]: ../tests/ui-tests.mjs#L193-L196
[test-source-290]: ../tests/ui-tests.mjs#L196-L197
[test-source-291]: ../tests/ui-tests.mjs#L197-L208
[test-source-292]: ../tests/ui-tests.mjs#L208-L215
[test-source-293]: ../tests/ui-tests.mjs#L215-L223
[test-source-294]: ../tests/ui-tests.mjs#L223-L237
[test-source-295]: ../tests/ui-tests.mjs#L237-L241
[test-source-296]: ../tests/v15-tests.mjs#L10-L12
[test-source-297]: ../tests/v15-tests.mjs#L13-L15
[test-source-298]: ../tests/v15-tests.mjs#L16-L18
[test-source-299]: ../tests/v15-tests.mjs#L19-L21
[test-source-300]: ../tests/v15-tests.mjs#L22-L25
[test-source-301]: ../tests/v15-tests.mjs#L26-L28
[test-source-302]: ../tests/v15-tests.mjs#L29-L29
[test-source-303]: ../tests/v15-tests.mjs#L30-L32
[test-source-304]: ../tests/v15-tests.mjs#L33-L35
[test-source-305]: ../tests/v15-tests.mjs#L36-L38
[test-source-306]: ../tests/v15-tests.mjs#L39-L41
[test-source-307]: ../tests/v16-tests.mjs#L13-L20
[test-source-308]: ../tests/v16-tests.mjs#L21-L27
[test-source-309]: ../tests/v16-tests.mjs#L28-L31
[test-source-310]: ../tests/v16-tests.mjs#L32-L36
[test-source-311]: ../tests/v16-tests.mjs#L37-L41
[test-source-312]: ../tests/v17-tests.mjs#L1-L21
[test-source-313]: ../tests/v17-tests.mjs#L21-L24
[test-source-314]: ../tests/v17-tests.mjs#L24-L27
[test-source-315]: ../tests/v18-tests.mjs#L1-L4
[test-source-316]: ../tests/v18-tests.mjs#L4-L5
[test-source-317]: ../tests/v18-tests.mjs#L5-L6
[test-source-318]: ../tests/v18-tests.mjs#L6-L7
[test-source-319]: ../tests/v19-tests.mjs#L1-L4
[test-source-320]: ../tests/v19-tests.mjs#L4-L5
[test-source-321]: ../tests/v19-tests.mjs#L5-L6
[test-source-322]: ../tests/v19-tests.mjs#L6-L7
[test-source-323]: ../tests/v20-tests.mjs#L1-L7
[test-source-324]: ../tests/v20-tests.mjs#L7-L10
[test-source-325]: ../tests/v20-tests.mjs#L10-L13
[test-source-326]: ../tests/v20-tests.mjs#L13-L16
[test-source-327]: ../tests/v20-tests.mjs#L16-L19
[test-source-328]: ../tests/v21-tests.mjs#L4-L4
[test-source-329]: ../tests/v21-tests.mjs#L5-L5
[test-source-330]: ../tests/v21-tests.mjs#L6-L6
[test-source-331]: ../tests/v21-tests.mjs#L7-L7
[test-source-332]: ../tests/v21-tests.mjs#L8-L8
[test-source-333]: ../tests/v21-tests.mjs#L9-L9
[test-source-334]: ../tests/v21-tests.mjs#L10-L10
[test-source-335]: ../tests/v22-tests.mjs#L5-L5
[test-source-336]: ../tests/v22-tests.mjs#L6-L6
[test-source-337]: ../tests/v22-tests.mjs#L7-L7
[test-source-338]: ../tests/v22-tests.mjs#L8-L8
[test-source-339]: ../tests/v22-tests.mjs#L9-L9
[test-source-340]: ../tests/v22-tests.mjs#L10-L10
[test-source-341]: ../tests/v23-tests.mjs#L9-L9
[test-source-342]: ../tests/v23-tests.mjs#L10-L10
[test-source-343]: ../tests/v23-tests.mjs#L11-L11
[test-source-344]: ../tests/v23-tests.mjs#L12-L12
[test-source-345]: ../tests/v23-tests.mjs#L13-L13
[test-source-346]: ../tests/v23-tests.mjs#L14-L14
[test-source-347]: ../tests/v23-tests.mjs#L15-L15
[test-source-348]: ../tests/v24-tests.mjs#L11-L11
[test-source-349]: ../tests/v24-tests.mjs#L12-L12
[test-source-350]: ../tests/v24-tests.mjs#L13-L13
[test-source-351]: ../tests/v24-tests.mjs#L14-L14
[test-source-352]: ../tests/v24-tests.mjs#L15-L15
[test-source-353]: ../tests/v24-tests.mjs#L16-L16
[test-source-354]: ../tests/v24-tests.mjs#L17-L17
[test-source-355]: ../tests/v24-tests.mjs#L18-L18
[test-source-356]: ../tests/v24-tests.mjs#L19-L19
[test-source-357]: ../tests/v24-tests.mjs#L20-L20
[test-source-358]: ../tests/v25-tests.mjs#L8-L8
[test-source-359]: ../tests/v25-tests.mjs#L9-L9
[test-source-360]: ../tests/v25-tests.mjs#L10-L10
[test-source-361]: ../tests/v25-tests.mjs#L11-L11
[test-source-362]: ../tests/v25-tests.mjs#L12-L12
[test-source-363]: ../tests/v26-tests.mjs#L9-L9
[test-source-364]: ../tests/v26-tests.mjs#L10-L10
[test-source-365]: ../tests/v26-tests.mjs#L11-L11
[test-source-366]: ../tests/v26-tests.mjs#L12-L12
[test-source-367]: ../tests/v26-tests.mjs#L13-L13
[test-source-368]: ../tests/v26-tests.mjs#L14-L14
[test-source-369]: ../tests/v26-tests.mjs#L15-L15
[test-source-370]: ../tests/v27-tests.mjs#L9-L9
[test-source-371]: ../tests/v27-tests.mjs#L10-L10
[test-source-372]: ../tests/v27-tests.mjs#L11-L11
[test-source-373]: ../tests/v27-tests.mjs#L12-L12
[test-source-374]: ../tests/v27-tests.mjs#L13-L13
[test-source-375]: ../tests/v27-tests.mjs#L14-L14
[test-source-376]: ../tests/v27-tests.mjs#L15-L15
[test-source-377]: ../tests/v27-tests.mjs#L16-L16
[test-source-378]: ../tests/v28-tests.mjs#L9-L9
[test-source-379]: ../tests/v28-tests.mjs#L10-L10
[test-source-380]: ../tests/v28-tests.mjs#L11-L11
[test-source-381]: ../tests/v28-tests.mjs#L12-L12
[test-source-382]: ../tests/v28-tests.mjs#L13-L13
[test-source-383]: ../tests/v28-tests.mjs#L14-L14
[test-source-384]: ../tests/v28-tests.mjs#L15-L15
[test-source-385]: ../tests/v29-tests.mjs#L5-L5
[test-source-386]: ../tests/v29-tests.mjs#L6-L6
[test-source-387]: ../tests/v29-tests.mjs#L7-L7
[test-source-388]: ../tests/v29-tests.mjs#L8-L8
[test-source-389]: ../tests/v29-tests.mjs#L9-L9
[test-source-390]: ../tests/v29-tests.mjs#L10-L10
[test-source-391]: ../tests/v29-tests.mjs#L11-L11
[test-source-392]: ../tests/v29-tests.mjs#L12-L12
[test-source-393]: ../tests/v29-tests.mjs#L13-L13
[test-source-394]: ../tests/v29-tests.mjs#L14-L14
[test-source-395]: ../tests/v30-tests.mjs#L5-L5
[test-source-396]: ../tests/v30-tests.mjs#L6-L6
[test-source-397]: ../tests/v30-tests.mjs#L7-L7
[test-source-398]: ../tests/v30-tests.mjs#L8-L8
[test-source-399]: ../tests/v30-tests.mjs#L9-L9
[test-source-400]: ../tests/v30-tests.mjs#L10-L10
[test-source-401]: ../tests/v30-tests.mjs#L11-L11
[test-source-402]: ../tests/v30-tests.mjs#L12-L12
[test-source-403]: ../tests/v30-tests.mjs#L13-L13
[test-source-404]: ../tests/v31-tests.mjs#L4-L4
[test-source-405]: ../tests/v31-tests.mjs#L5-L5
[test-source-406]: ../tests/v31-tests.mjs#L6-L6
[test-source-407]: ../tests/v31-tests.mjs#L7-L7
[test-source-408]: ../tests/v31-tests.mjs#L12-L12
[test-source-409]: ../tests/v31-tests.mjs#L13-L13
[test-source-410]: ../tests/v31-tests.mjs#L14-L14
[test-source-411]: ../tests/v31-tests.mjs#L15-L15
[test-source-412]: ../tests/v31-tests.mjs#L16-L16
[test-source-413]: ../tests/v31-tests.mjs#L17-L17
[test-source-414]: ../tests/v31-tests.mjs#L18-L18
[test-source-415]: ../tests/v31-tests.mjs#L19-L19
[test-source-416]: ../tests/v31-tests.mjs#L20-L20
[test-source-417]: ../tests/v32-tests.mjs#L11-L17
[test-source-418]: ../tests/v32-tests.mjs#L18-L21
[test-source-419]: ../tests/v32-tests.mjs#L23-L27
[test-source-420]: ../tests/v32-tests.mjs#L28-L32
[test-source-421]: ../tests/v32-tests.mjs#L33-L38
[test-source-422]: ../tests/v32-tests.mjs#L39-L41
[test-source-423]: ../tests/v32-tests.mjs#L42-L44
[test-source-424]: ../tests/v32-tests.mjs#L45-L47
[test-source-425]: ../tests/v32-tests.mjs#L48-L50
[test-source-426]: ../tests/v33-tests.mjs#L11-L18
[test-source-427]: ../tests/v33-tests.mjs#L19-L26
[test-source-428]: ../tests/v33-tests.mjs#L27-L29
[test-source-429]: ../tests/v33-tests.mjs#L31-L34
[test-source-430]: ../tests/v33-tests.mjs#L35-L35
[test-source-431]: ../tests/v33-tests.mjs#L36-L36
[test-source-432]: ../tests/v33-tests.mjs#L37-L37
[test-source-433]: ../tests/v33-tests.mjs#L38-L38
[test-source-434]: ../tests/v33-tests.mjs#L39-L39
[test-source-435]: ../tests/v33-tests.mjs#L40-L40
[test-source-436]: ../tests/v33-tests.mjs#L41-L41
[test-source-437]: ../tests/v33-tests.mjs#L42-L42
[test-source-438]: ../tests/v34-tests.mjs#L8-L8
[test-source-439]: ../tests/v34-tests.mjs#L9-L9
[test-source-440]: ../tests/v34-tests.mjs#L10-L10
[test-source-441]: ../tests/v34-tests.mjs#L11-L11
[test-source-442]: ../tests/v34-tests.mjs#L12-L12
[test-source-443]: ../tests/v35-tests.mjs#L11-L21
[test-source-444]: ../tests/v35-tests.mjs#L22-L25
[test-source-445]: ../tests/v35-tests.mjs#L26-L31
[test-source-446]: ../tests/v35-tests.mjs#L32-L37
[test-source-447]: ../tests/v35-tests.mjs#L38-L42
[test-source-448]: ../tests/v35-tests.mjs#L43-L46
[test-source-449]: ../tests/v35-tests.mjs#L47-L55
[test-source-450]: ../tests/v35-tests.mjs#L56-L60
[test-source-451]: ../tests/v35-tests.mjs#L61-L65
[test-source-452]: ../tests/v36-tests.mjs#L9-L13
[test-source-453]: ../tests/v36-tests.mjs#L14-L20
[test-source-454]: ../tests/v36-tests.mjs#L21-L30
[test-source-455]: ../tests/v38-tests.mjs#L8-L14
[test-source-456]: ../tests/v38-tests.mjs#L15-L15
[test-source-457]: ../tests/v38-tests.mjs#L16-L19
[test-source-458]: ../tests/v38-tests.mjs#L20-L24
[test-source-459]: ../tests/v38-tests.mjs#L25-L28
[test-source-460]: ../tests/v39-tests.mjs#L15-L18
[test-source-461]: ../tests/v39-tests.mjs#L19-L22
[test-source-462]: ../tests/v39-tests.mjs#L23-L26
[test-source-463]: ../tests/v39-tests.mjs#L27-L33
[test-source-464]: ../tests/v39-tests.mjs#L34-L38
[test-source-465]: ../tests/v39-tests.mjs#L39-L43
[test-source-466]: ../tests/v39-tests.mjs#L44-L51
[test-source-467]: ../tests/v42-tests.mjs#L9-L9
[test-source-468]: ../tests/v42-tests.mjs#L10-L10
[test-source-469]: ../tests/v42-tests.mjs#L11-L11
[test-source-470]: ../tests/v42-tests.mjs#L12-L12
[test-source-471]: ../tests/v42-tests.mjs#L13-L13
[test-source-472]: ../tests/v42-tests.mjs#L14-L14
[test-source-473]: ../tests/v42-tests.mjs#L15-L15
[test-source-474]: ../tests/v42-tests.mjs#L16-L16
[test-source-475]: ../tests/v42-tests.mjs#L17-L17
[test-source-476]: ../tests/v43-tests.mjs#L10-L10
[test-source-477]: ../tests/v43-tests.mjs#L11-L11
[test-source-478]: ../tests/v43-tests.mjs#L12-L12
[test-source-479]: ../tests/v43-tests.mjs#L13-L13
[test-source-480]: ../tests/v43-tests.mjs#L14-L14
[test-source-481]: ../tests/v43-tests.mjs#L15-L15
[test-source-482]: ../tests/v43-tests.mjs#L16-L16
[test-source-483]: ../tests/v43-tests.mjs#L17-L17
[test-source-484]: ../tests/v43-tests.mjs#L18-L18
[test-source-485]: ../tests/v43-tests.mjs#L19-L19
[test-source-486]: ../tests/v44-tests.mjs#L17-L17
[test-source-487]: ../tests/v44-tests.mjs#L18-L18
[test-source-488]: ../tests/v44-tests.mjs#L19-L19
[test-source-489]: ../tests/v44-tests.mjs#L20-L20
[test-source-490]: ../tests/v44-tests.mjs#L21-L21
[test-source-491]: ../tests/v44-tests.mjs#L22-L22
[test-source-492]: ../tests/v44-tests.mjs#L23-L23
[test-source-493]: ../tests/v44-tests.mjs#L24-L24
[test-source-494]: ../tests/v44-tests.mjs#L25-L25
[test-source-495]: ../tests/v44-tests.mjs#L26-L26
[test-source-496]: ../tests/v44-tests.mjs#L27-L27
[test-source-497]: ../tests/v44-tests.mjs#L28-L28
[test-source-498]: ../tests/v44-tests.mjs#L29-L29
[test-source-499]: ../tests/v44-tests.mjs#L30-L30
[test-source-500]: ../tests/v45-tests.mjs#L9-L9
[test-source-501]: ../tests/v45-tests.mjs#L10-L10
[test-source-502]: ../tests/v45-tests.mjs#L11-L11
[test-source-503]: ../tests/v45-tests.mjs#L12-L12
[test-source-504]: ../tests/v45-tests.mjs#L13-L13
[test-source-505]: ../tests/v45-tests.mjs#L14-L14
[test-source-506]: ../tests/v45-tests.mjs#L15-L15
[test-source-507]: ../tests/v45-tests.mjs#L16-L16
[test-source-508]: ../tests/v45-tests.mjs#L17-L17
[test-source-509]: ../tests/v45-tests.mjs#L18-L18
[test-source-510]: ../tests/v45-tests.mjs#L19-L19
[test-source-511]: ../tests/v47-tests.mjs#L1-L7
[test-source-512]: ../tests/v47-tests.mjs#L7-L18
[test-source-513]: ../tests/v48-tests.mjs#L1-L15
[test-source-514]: ../tests/v48-tests.mjs#L15-L22
[test-source-515]: ../tests/v48-tests.mjs#L22-L26
[test-source-516]: ../tests/v48-tests.mjs#L26-L29
[test-source-517]: ../tests/v49-tests.mjs#L19-L19
[test-source-518]: ../tests/v49-tests.mjs#L20-L20
[test-source-519]: ../tests/v49-tests.mjs#L21-L21
[test-source-520]: ../tests/v49-tests.mjs#L22-L22
[test-source-521]: ../tests/v49-tests.mjs#L23-L23
[test-source-522]: ../tests/v49-tests.mjs#L24-L24
[test-source-523]: ../tests/v49-tests.mjs#L25-L25
[test-source-524]: ../tests/v49-tests.mjs#L26-L26
[test-source-525]: ../tests/v49-tests.mjs#L27-L27
[test-source-526]: ../tests/v49-tests.mjs#L28-L28
[test-source-527]: ../tests/v49-tests.mjs#L29-L29
[test-source-528]: ../tests/v49-tests.mjs#L30-L30
[test-source-529]: ../tests/v49-tests.mjs#L31-L31
[test-source-530]: ../tests/v49-tests.mjs#L32-L32
[test-source-531]: ../tests/v49-tests.mjs#L33-L33
[test-source-532]: ../tests/v49-tests.mjs#L34-L34
[test-source-533]: ../tests/v50-battle-tests.mjs#L10-L10
[test-source-534]: ../tests/v50-battle-tests.mjs#L11-L11
[test-source-535]: ../tests/v50-battle-tests.mjs#L12-L12
[test-source-536]: ../tests/v50-battle-tests.mjs#L13-L13
[test-source-537]: ../tests/v50-battle-tests.mjs#L14-L14
[test-source-538]: ../tests/v50-battle-tests.mjs#L15-L15
[test-source-539]: ../tests/v50-battle-tests.mjs#L16-L16
[test-source-540]: ../tests/v50-battle-tests.mjs#L17-L17
[test-source-541]: ../tests/v50-battle-tests.mjs#L18-L18
[test-source-542]: ../tests/v50-battle-tests.mjs#L19-L19
[test-source-543]: ../tests/v50-battle-tests.mjs#L20-L20
[test-source-544]: ../tests/v50-governance-tests.mjs#L7-L7
[test-source-545]: ../tests/v50-governance-tests.mjs#L8-L8
[test-source-546]: ../tests/v50-governance-tests.mjs#L9-L9
[test-source-547]: ../tests/v50-governance-tests.mjs#L10-L10
[test-source-548]: ../tests/v50-governance-tests.mjs#L11-L11
[test-source-549]: ../tests/v50-governance-tests.mjs#L12-L12
[test-source-550]: ../tests/v50-presentation-tests.mjs#L1-L7
[test-source-551]: ../tests/v50-presentation-tests.mjs#L7-L10
[test-source-552]: ../tests/v50-presentation-tests.mjs#L10-L11
[test-source-553]: ../tests/v50-presentation-tests.mjs#L11-L14
[test-source-554]: ../tests/v52-tests.mjs#L9-L9
[test-source-555]: ../tests/v52-tests.mjs#L10-L10
[test-source-556]: ../tests/v52-tests.mjs#L11-L11
[test-source-557]: ../tests/v52-tests.mjs#L12-L12
[test-source-558]: ../tests/v52-tests.mjs#L13-L13
[test-source-559]: ../tests/v53-tests.mjs#L11-L11
[test-source-560]: ../tests/v53-tests.mjs#L12-L12
[test-source-561]: ../tests/v53-tests.mjs#L13-L13
[test-source-562]: ../tests/v53-tests.mjs#L14-L14
[test-source-563]: ../tests/v53-tests.mjs#L15-L15
[test-source-564]: ../tests/v53-tests.mjs#L16-L16
[test-source-565]: ../tests/v53-tests.mjs#L18-L18
[test-source-566]: ../tests/v53-tests.mjs#L19-L19
[test-source-567]: ../tests/v53-tests.mjs#L20-L20
[test-source-568]: ../tests/v53-tests.mjs#L21-L21
[test-source-569]: ../tests/v53-tests.mjs#L22-L22
[test-source-570]: ../tests/v53-tests.mjs#L24-L24
[test-source-571]: ../tests/v53-tests.mjs#L25-L25
[test-source-572]: ../tests/v53-tests.mjs#L26-L26
[test-source-573]: ../tests/v54-tests.mjs#L5-L5
[test-source-574]: ../tests/v54-tests.mjs#L10-L10
[test-source-575]: ../tests/v54-tests.mjs#L12-L12
[test-source-576]: ../tests/v54-tests.mjs#L13-L13
[test-source-577]: ../tests/v54-tests.mjs#L14-L14
[test-source-578]: ../tests/v54-tests.mjs#L15-L15
[test-source-579]: ../tests/v54-ui-tests.mjs#L37-L37
[test-source-580]: ../tests/v54-ui-tests.mjs#L38-L38
[test-source-581]: ../tests/v54-ui-tests.mjs#L39-L39
[test-source-582]: ../tests/v54-ui-tests.mjs#L40-L40
[test-source-583]: ../tests/v55-ui-tests.mjs#L37-L41
[test-source-584]: ../tests/v55-ui-tests.mjs#L42-L46
[test-source-585]: ../tests/v56-tests.mjs#L7-L7
[test-source-586]: ../tests/v56-tests.mjs#L8-L8
[test-source-587]: ../tests/v56-tests.mjs#L9-L9
[test-source-588]: ../tests/v56-tests.mjs#L10-L10
[test-source-589]: ../tests/v56-tests.mjs#L11-L11
[test-source-590]: ../tests/v56-tests.mjs#L13-L13
[test-source-591]: ../tests/v56-tests.mjs#L14-L14
[test-source-592]: ../tests/v56-tests.mjs#L15-L15
[test-source-593]: ../tests/v56-tests.mjs#L16-L16
[test-source-594]: ../tests/v56-tests.mjs#L18-L18
[test-source-595]: ../tests/v56-tests.mjs#L19-L21
[test-source-596]: ../tests/v56-ui-tests.mjs#L36-L40
[test-source-597]: ../tests/v56-ui-tests.mjs#L41-L49
[test-source-598]: ../tools/ai-rules.mjs#L1-L9
[test-source-599]: ../tools/verify-charge-arrival-raster-v56.mjs
[test-source-600]: ../tools/verify-charge-arrival-raster-v56.mjs#L1-L22
[test-source-601]: ../tools/verify-charge-arrival-remaster-v56.mjs
[test-source-602]: ../tools/verify-charge-arrival-remaster-v56.mjs#L1-L21
[test-source-603]: ../tools/verify-charge-terminal-remaster-v56.mjs
[test-source-604]: ../tools/verify-charge-terminal-remaster-v56.mjs#L1-L13
[test-source-605]: ../tools/verify-native-ai-joint-v54.py
[test-source-606]: ../tools/verify-native-captive-audio-v54.py
[test-source-607]: ../tools/verify-native-charge-arrival-v56.py
[test-source-608]: ../tools/verify-native-charge-terminal-v56.py
[test-source-609]: ../tools/verify-native-concealed-v56.py
[test-source-610]: ../tools/verify-native-messenger-exemption-v53.py
[test-source-611]: ../tools/verify-native-messenger-v53.py
[test-source-612]: ../tools/verify-native-settlement-v56.py
[test-source-613]: ../tools/verify-native-tactical-v49.py
