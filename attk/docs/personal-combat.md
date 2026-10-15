# Validate personal combat

Run from `attk` after installing the pinned Node dependencies:

```powershell
node tests/personal-combat-tests.mjs
npm run test:personal-combat:ui
npm run test:personal-combat:browser
```

The browser command needs Playwright, already used by the existing browser
validation job. On Windows it uses installed Edge; elsewhere it uses
Playwright Chromium. It does not install a browser. See the test scripts
for their exact inputs and assertions.

Expected output: ten engine/playback groups, four mounted UI groups and
three actual browser viewport cases pass. An assertion or nonzero process
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
1983 × 793 images, matching the existing event assets. Image duration uses
Game Speed. Evidence: `tests/personal-combat-tests.mjs`,
`tests/personal-combat-ui-tests.mjs` and the [art manifest][art].

Each animated round preserves the sound-disabled native sequence: 32
single-BIOS-tick waits followed by an 11-tick counter hold. One BIOS
(Basic Input/Output System) timer tick is 65536/1193182 seconds. Evidence:
250F8/250AE, 29396 and 581E, executed by the verifier. Native sound-enabled
hardware delays and the full DOS tile relocation introduction are not
certified by these bounded probes. Mounted horse poses are new artwork.

## Bug-to-test mapping

- PC-01, missing human opening: defender/attacker offers, low WAR,
  commander targeting, volunteers, refusal, no repeat and save/load.
  Cases: `personal-combat-tests.mjs` and mounted UI initiation cases.
- PC-02, missing challenge event: image, initiator/ruler names and
  opposing commander. Cases: engine event metadata and both mounted sides.
- PC-03, missing mounted duel: native counters and RNG traces, left/right
  order, pause, cancellation and fixed native round duration. Cases:
  native comparison, deterministic clock and mounted Canvas playback.
- PC-04, missing result event: initiator-relative win/loss, both ruler
  affiliations, separate images, draw handling and speed-based expiry.
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
normalized only the inherited SVG checkout line endings. All 56 commands
from `npm test` then passed against the final engine. The inherited v56
mounted suite also passed its three groups after equivalent path, temporary
directory and vendored-YAML adaptations in that copy. The 24 inherited
Charge-arrival raster cases passed directly with an explicit app path.
These adaptations are validation-environment changes, not claimed fixes
to the retained source tests. Summary: [verification record][verification].

[witnesses]: native-personal-combat.json
[art]: artwork/personal-combat-manifest.json
[verification]: verification-personal-combat.json
