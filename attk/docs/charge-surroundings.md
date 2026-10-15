# Verify charge landing ambushes

Run from the project root with the pinned Node dependencies installed:

```powershell
node tests/charge-surrounding-tests.mjs
npm run test:battle-feedback:browser
```

Expected: 16 two-jungle engine/Canvas cases and the negative controls pass.
The browser performs a real Charge on the original province 8 map, records
two separate ambush animations and 16 flash callbacks, and checks that
playback repeats neither casualties nor random draws. It also checks the
Battle day and Challenge war sliders align at three landscape viewports.
Sources: the two test scripts above.

To reproduce the original executable evidence with an existing Unicorn
installation, run:

```text
python tools/verify-native-charge-surroundings.py MAIN.EXE OUTPUT.json
```

Expected: the baseline harness reports 48 passes, followed by 48 isolated
witnesses. The recorded output is [native-charge-surroundings.json][native].
The tool checks the executable hash through the baseline harness before
executing the bounded original controller. It exports observations, not
original executable bytes. See the output's limits for controlled helpers.

## Root cause and earlier coverage gap

The published engine called `ambushCells(from, mover)` after Charge. That
returns only three forward cells. Jungle enemies beside or behind the
landing could therefore produce no event, casualty or animation. The
renderer consumes resolved ambush events; it cannot animate an absent
event. Sources: `mjs/battle.mjs` at commit `370a911`, `ambush` and both
charge landing branches; `mjs/raster-world.mjs`, `update`.

The earlier tests put enemies around the landing but required exactly
three ambushes. They checked the three-forward rule and did not isolate
the two excluded positions. The new test puts only two hostile jungle
units at those side/rear positions. Against `370a911` it fails with actual
`[]` versus expected `[3, 2]`; against the correction it passes. Sources:
the earlier `verify-charge-arrival-raster-v56.mjs`, the new
`charge-surrounding-tests.mjs`, and the before/after command outputs.

The supplied `main.exe` also uses a three-entry scan at `0x24938`. Its loop
compares the scan index with three at `0x249CD`. Charge calls it after
occupation and breakthrough at `0x2649A` and `0x265A0`. The isolated native
probes put two jungle enemies forward, then two beside/behind, for both
column parities and all six directions. The original triggers the forward
pair and skips the side/rear pair. Sources: the original executable,
`tools/verify-native-charge-surroundings.py` and [its observations][native].

The user's explicit all-adjacent landing requirement is consequently a
change from that supplied binary's scan boundary. The correction follows
that requirement while preserving native ambush damage and the existing
forward scan order. Other adjacent hostile jungle units follow, once each.
Ordinary movement keeps its directional check. Sources: `mjs/battle.mjs`,
`ambush`, `moveAlong`, `pullEnemy` and both Charge landing branches.

The charge path still uses the existing staggered six-direction grid.
The user confirmed the coordinates were illustrative. The literal test
uses a valid approach to landing 5,6 and hostile jungles at 6,6 and 5,5,
with displayed coordinates starting at one. The real browser test uses
unmodified province 8 terrain. Sources: the two new regression fixtures.

## Coverage after the correction

- Two isolated side/rear enemies: both camps, occupation and breakthrough,
  all four Game Speeds. Each case has exactly two ambushes and 16 cues.
- Friendly, empty and non-jungle neighbours; failed breakthrough; a
  surviving charged enemy in jungle; capture stopping later ambushes.
- The 48 inherited landing vectors retain the original landing and native
  forward prefix, then add the requested surrounding enemies. These are
  explicitly recorded as additional ambushes, rather than native matches.
- The 24 terminal/capture vectors still match their original observations.
- The 96 all-surrounding Canvas cases now require five ambush animations
  and 40 cues each, with no repeated state changes or random draws.

Sources: `tests/charge-surrounding-tests.mjs`,
`tools/verify-charge-arrival-remaster-v56.mjs`,
`tools/verify-charge-terminal-remaster-v56.mjs` and
`tools/verify-charge-arrival-raster-v56.mjs`.

## Adjacent UI observation

At 640 x 360, the commander labels in the browser fixture overlap, and the
friendly label intercepts a centre tap on the enemy label. An uncovered
part remains available. The test locates and taps that visible part using
ordinary pointer events. Label layout is outside this change and remains
unchanged. Source: the Playwright click failure and the final browser test.

Physical phone checks remain pending. Desktop Edge viewport tests do not
establish physical iOS Safari or Android Chrome behaviour.

[native]: native-charge-surroundings.json
