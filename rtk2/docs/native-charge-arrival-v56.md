# v56 bounded charge-arrival audit

Original English `main.exe` SHA-256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are offsets in its unpacked image. The executable was kept outside the repository; no original executable/image bytes are exported by these witnesses.

## Result

The reported missing overrun ambush could not be reproduced in the existing v55 rule-to-raster path with an ongoing battle. **48 native charge-controller cases**, **48 engine comparisons**, and **24 mounted raster queue cases** passed. Mere adjacency is insufficient under the original: only the three forward cells selected by the actual entry direction trigger automatic ambush. Changing this to every adjacent jungle enemy would introduce a new rule.

A separate terminal-arrival mismatch was confirmed with **24 additional native full-capture cases**: defeating the defending commander ends the battle before occupation's ambush check. Existing v55 `act` calls occupation ambush before checking its own outcome, so it can apply extra casualties/animation after a commander defeat has already ended the battle. This causes an excess ambush rather than the reported missing ambush.

## Ongoing charge arrival

Original charge controller `0x26318` retains the initial direction (`bp+0xC`, native directions LL,D,LR,UL,U,UR, numbered 1–6 at entry). It computes the tile beyond the defender using actual offset-column geometry (`0x23BEA`). After combat:

- Defeated defender: `0x2644C` relocates the charging unit into the defeated target's hex using `0x225B8`; `0x23866` transfers occupancy. At `0x26482` the controller checks battle-ended flag DS:`B8D5`; only value255 reaches `0x24938` at `0x2649A`.
- Surviving defender: beyond tile must pass native terrain, bounds and occupancy predicates at `0x264C4–26501`, then the actor's WAR chance `0x589C`. Successful relocation occurs at `0x26516–2653E`; `0x2658F–265A5` invokes `0x24938` at that beyond tile with the unchanged charge direction.
- Blocked destination or failed WAR roll: actor remains at its origin; no arrival ambush is called.

Automatic trigger `0x24938` reads three direction entries from DS:`B5FE`, tests hostile occupied jungle with `0x239D6`, obtains the unit using `0x237EA`, skips the explicitly supplied unit pointer, and calls `0x247C6`. It does not require a unit's own daily order to remain available. It stops subsequent ambushes when the ambush casualty body signals terminal victim defeat.

The48 fixtures span occupation, successful breakthrough, failed chance and mountain-blocked breakthrough, each in six directions and both column parities. All six neighbours at the landing are populated where they do not overlap original actor/target; thus the tests include jungle units already adjacent at origin and jungle units that become newly adjacent. Current `ambushCells(chargeStart, landing)` produces **the exact same three ambusher cells in the same order**, not merely the same number. Confirmed negative branches produce no ambush.

Bounds: first48 native cases retain original charge controller/relocation/geometry/occupancy/hostile-jungle lookup, but hook exchange arithmetic/capture-result processing, RNG, drawing and ambush casualties. Their occupation comparisons are explicitly **ongoing-battle** cases, with a different surviving defender commander. They do not claim terminal capture fidelity; the separate24 cases below cover that consequence.

## Terminal commander defeat

`native-charge-terminal-v56.py` retains the actual native melee handler `0x24C58`, both casualty/equipment equations, zero-men capture handling `0x24C2A → 0x25364`, and army linked-list removal `0x2514A`. It does not fabricate the battle-ended flag.

The target begins with one man/one weapon and low WAR/training; original damage exceeds its men. The same jungle ambusher exists one tile beyond the target. Two linked-list setups vary only the defending commander role:

- Target is an ordinary unit after the defending commander: capture removes this ordinary officer, DS:`B8D5` stays255; the actor occupies the target tile and that jungle unit ambushes.
- Target is the defending army's list head (commander), with another defender surviving behind it: the real removal branch at `0x251FE–25236` sets winner0/reason5 via `0x25138`. The charging actor still occupies the target tile, but `0x26482` bypasses the ambush. The surviving jungle unit does not attack.

Twelve direction/parity pairs execute each role:24 native cases. Renderer/text/pause, RNG and ambush casualty body are controlled. Commander identification, actual capture mutation, service/army-list removal, terminal winner/reason, occupation, geometry and jungle eligibility remain original. This proves the commander-defeat terminal exception; it does **not** establish that every remaster ruler/palace/food outcome can safely be treated as identical to this particular native path. A correction should respect confirmed terminal outcomes without claiming equivalence for unexamined branches.

## Raster integration

`charge-arrival-raster-v56.mjs` instantiates the release's actual `createRasterWorld` under JSDOM/native Canvas and executes `act('charge')` after the world already exists. It calls `world.update` and advances the real frame queue. Twenty-four ongoing occupation/breakthrough cases cover all directions/parities.

Every case plays Charge first, followed by three separate Ambush animations. All three produce eight native-style cue cycles (24 ambush cues total), and `afterCombat` completes only after the whole queue. Playback leaves engine soldiers/equipment and RNG-call count unchanged. This reproduces the actual raster queue, not a constructed array comparison; it does not certify a complete app-button/dialog lifecycle, phone layout, browser throttling or physical sound/visibility perception.

## Reproduction / integration designs

Native scripts are self-contained and accept `MAIN.EXE OUTPUT.json`; use optional Python Unicorn. Engine and raster scripts accept `APP_ROOT NATIVE_VECTORS.json OUTPUT.json`; raster optionally takes a fourth dependency-project directory (otherwise uses APP_ROOT devDependencies).

Required named regressions suggested for root implementation:

1. `BUG-56-03-CHARGE-BREAKTHROUGH-ARRIVAL-ARC`: all6 directions ×2 parities, exact native ambusher ordering, both origin-adjacent/newly-adjacent cells.
2. `BUG-56-03-CHARGE-OCCUPATION-ARRIVAL-ARC`: same matrix with an ordinary target and surviving distinct defender commander.
3. `BUG-56-03-OUTSIDE-FORWARD-ARC-NO-AMBUSH`: hostile jungle in each of the other3 neighbouring cells causes no damage/cue.
4. `BUG-56-03-FAILED-OR-BLOCKED-CHARGE-NO-ARRIVAL`: no displacement, no ambush.
5. `BUG-56-03-CHARGE-THEN-AMBUSH-QUEUE`: mounted actual raster, eight cues each, no repeated RNG/damage, completion after final ambush.
6. `BUG-56-03-COMMANDER-CAPTURE-ENDS-BEFORE-AMBUSH`: ordinary and commander target differ only by role; occupation retained, commander case suppresses later ambush.

No AI training ran. No repository files were edited by this audit.
