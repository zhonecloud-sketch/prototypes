# Validate personal combat

Run from `attk` after installing the pinned Node dependencies:

```powershell
node tests/personal-combat-tests.mjs
node tests/visual-interval-tests.mjs
npm run test:personal-combat:ui
npm run test:personal-combat:browser
```

The browser command needs Playwright, already used by the existing browser
validation job. On Windows it uses installed Edge; elsewhere it uses
Playwright Chromium. It does not install a browser. See the test scripts
for their exact inputs and assertions.

Expected output: ten combat groups, seven interval groups, five mounted UI
groups and three actual browser viewport cases pass. An assertion or nonzero
process
exit fails the corresponding command. Browser screenshots are written to
`dist/screenshots/personal-combat-*.png`.

To repeat the original executable witnesses, set `PYTHONPATH` to an
existing Unicorn installation and run:

```text
python tools/verify-native-duel.py MAIN.EXE OUTPUT.json
```

Expected output: `PASS 106 native personal-combat witnesses`. The verifier
checks SHA-256 before execution. It exports numerical observations rather
than executable or original image bytes. Its recorded output is
[native-personal-combat.json][witnesses].

## Behavior and evidence

The earlier implementation placed the human command inside Menu → Battle
controls and used two WAR ±10 rolls. It did not offer personal combat after
deployment or draw a mounted duel. Evidence: the parent revision of
`mjs/app.mjs`, `battleControlsDialog` and `challengeDialog`, and
`mjs/battle.mjs`, `answerChallenge`.

The corrected opening runs after both armies deploy and before daily
orders. The defender receives the first opportunity, then the attacker.
Human players can select any deployed general, including WAR below 80.
Ambitious subordinates can volunteer before that choice. Evidence: native
297B6, 28FD6, 28E30 and 28F04; witness rules `opening-order`,
`human-opening-no-war-threshold` and `volunteer`.

AI selection follows the recovered opening thresholds rather than the
remaster's later daily-order challenge policy. Evidence: native 28AA0 and
the `ai-candidate` witnesses. Existing saves that already reached daily
combat retain their old manual day-one entry; new openings cannot repeat.
Implementation: `mjs/battle.mjs`, `openingDuelCandidate` and `finishOpening`.

Combat strength starts at each general's WAR, falls through at most ten
rounds and can reach a draw. A single defeated general is captured; a draw
returns both generals. A weaker victor's WAR becomes the rounded-up mean
of the two original WAR values. Refusal removes 5–9% of each responding
unit's soldiers and weapons, with one roll per unit. Evidence: native
293AA, 29304, 294D6 and 296EA; the corresponding witness groups.

The mounted presentation reads the resolved trace without changing state
or consuming randomness. Defender information is left; attacker information
is right. Challenge, initiator-win and initiator-loss scenes use independent
1983 × 793 images, matching the existing event assets. Each card lasts three
seconds.
Evidence: `tests/personal-combat-tests.mjs`,
`tests/personal-combat-ui-tests.mjs` and the [art manifest][art].

The current presentation follows the October 15 visual-interval correction.
`VISUAL_INTERVAL` is 3000 milliseconds. Four complete 1983 x 793 combat
scenes replace the runtime sprite atlas and background. Each image lasts
three seconds and loops; strength updates once per Game Speed interval.
Playback ends immediately at the final strength result, even mid-image.
The outcome card and subsequent capture notice each last three seconds.
Evidence: `mjs/message-playback.mjs`, `mjs/personal-combat.mjs`,
`tests/personal-combat-tests.mjs` and the mounted four-frame case.

The native timing remains historical evidence in the witness file: 32
single-BIOS-tick waits followed by an 11-tick hold. BIOS means Basic
Input/Output System; its timer tick is 65536/1193182 seconds. These old
presentation delays no longer control this remaster. Native combat
arithmetic and RNG draw order remain covered by the witness comparisons.
Evidence: native 250F8/250AE, 29396, 581E and the ordinary/covert vectors.

Run the charge/ambush renderer checks with:

```powershell
node tools/verify-charge-arrival-raster-v56.mjs . `
  docs/native-charge-arrival-v56.json `
  node_modules/visual-interval-arrival.json
```

Expected output: 96 mounted raster queue cases pass. The 24 native landing
cases each run at four Game Speeds. Each resolved landing ambush follows
Charge, with eight flashes over one Game Speed interval. Playback neither
repeats casualties nor draws randomness. Evidence: the verifier's phase,
cue count, duration and state assertions.

Capture notices for rulers, commanders and generals last three seconds.
Fireball success/failure messages also last three seconds, followed by a
separate three-second ignition loss report on success. Fire damage still
resolves at its original engine step; only message order and timing change.
Evidence: `tests/visual-interval-tests.mjs` and `tests/v23-tests.mjs`.

The subsequent loss-message correction applies the same three-second
interval to men, training and weapons loss reports, including normal and
simultaneous summaries, charge, ambush, post-order fire and desertion.
Ordinary attribute messages retain Game Speed. The timing policy reads
existing messages without changing battle state or RNG. Current training
loss wording is covered by a presentation fixture; the engine does not
currently emit a separate training-loss notice or reduce training in
combat. Evidence: `mjs/battle-presentation.mjs`, `mjs/battle.mjs` and the
last two `visual-interval-tests.mjs` groups.

Run `npm run test:battle-feedback:browser` to check the actual fast-speed
loss toast. Expected: a 500 ms Game Speed battle displays its loss report
for about 3000 ms, without repeating a casualty or random draw. The same
command verifies that Edge decodes the requested effect-9 replacement.

## Bug-to-test mapping

- PC-01, missing human opening: defender/attacker offers, low WAR,
  commander targeting, volunteers, refusal, no repeat and save/load.
  Cases: `personal-combat-tests.mjs` and mounted UI initiation cases.
- PC-02, missing challenge event: image, initiator/ruler names and
  opposing commander. Cases: engine event metadata and both mounted sides.
- PC-03, missing mounted duel: native counters and RNG traces, left/right
  order, pause, cancellation and independent image/counter clocks. Cases:
  native comparison, deterministic clock and mounted Canvas playback.
- PC-04, missing result event: initiator-relative win/loss, both ruler
  affiliations, separate images, draw handling and fixed three-second expiry.
  Cases: result metadata, message queue and mounted result sequences.

These cases are wired into `npm test` and the existing `test:v56:ui` CI
entry. Existing trained profiles become incompatible when the engine
fingerprint changes and fall back to Legacy; no training was performed.
Evidence: `package.json`, `tools/ai-rules.mjs` and `mjs/ai-profile.mjs`.

## Remaining verification

Real Edge passed at 568 × 270, 640 × 360 and 844 × 390, including actual
deployment controls, selection, scenes and results. Source:
`tests/personal-combat-browser-tests.mjs` and its screenshot outputs.

Physical iOS Safari and Android Chrome remain pending. On each device,
exercise both human sides, pause/background during a duel, change Game
Speed between scenes, and reload an opening save. Success means readable
names, reachable controls, correct counter order and no duplicate order or
random draw. No physical phone was connected for this validation.

Four inherited Windows assumptions prevent a raw full-suite pass here:
v29/v30 load `/C:/...` image paths, v56 joins that path as `C:\C:\...`, and
the asset ledger expects LF-only SVG byte counts after CRLF checkout.
Evidence: the regression run's respective stack traces; these unrelated
source tests were retained. Other inherited suites and the new combat
cases passed using the actual Rust WebAssembly engine.

An ignored verification copy adapted those three Windows URL paths and
normalized only the inherited SVG checkout line endings. All 57 commands
from `npm test` then passed against the final engine. The inherited v56
mounted suite also passed its three groups after equivalent path, temporary
directory and vendored-YAML adaptations in that copy. The 96 charge/ambush
renderer cases passed directly with an explicit app path.
These adaptations are validation-environment changes, not claimed fixes
to the retained source tests. Summary: [verification record][verification].

[witnesses]: native-personal-combat.json
[art]: artwork/personal-combat-manifest.json
[verification]: verification-personal-combat.json
