# v53 bounded native battlefield audit

Original SHA256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.
Addresses below refer to the unpacked image. Executable stays outside the repository.

Reproduce with Python/Unicorn installed: `python tools/verify-native-battle-v53.py /outside-repository/main.exe /tmp/native-battle-v53.json`. Supply your own original executable; do not add it to the repository.

124 controlled native witnesses passed. They are executable branch witnesses rather than complete DOS/UI simulations. Each JSON case names its test and bounded hooks.

## Defender normal versus simultaneous attack (#3)

Original AI attack selector `0x2B306` takes its ordinary melee fallback at `0x2B45A`: writes attack mode2 and calls `0x28020`, the wrapper around native joint handler `0x27D9E`. It does so for commanders and ordinary units, from palace or plain, without the remaster's smart-intelligence threshold. The base attack handler counts surrounding friends: one participant produces one normal exchange; multiple valid participants produce grouped exchanges with participant count as damage factor.

16 witnesses cover both army sides, commander/noncommander, palace/plain and difficulty1/5. The original adjacency predicate and original joint assembly execute; controlled target choice avoids claiming that all six target-ranking paths are native. The actor has exactly3000 men, intentionally keeping the optional charge branch out. Commander identity, strategic commander risk, the charge predicate, UI and casualty bodies are bounded hooks. Two friendly units receive two damage exchanges factor2.

Current remaster `ai-battle.mjs` explicitly returns normal attack when `holding` before checking joint; also only considers joint above `smartIntelligence`. Those are remaster choices, not native holding rules. Move joint selection ahead of ordinary normal fallback and remove the intelligence threshold for the base melee path. Preserve separately verified fire/flight priorities. Do not claim native always chooses joint: optional charge/fire branches and strategic commander-risk exclusions exist.

Named regression cases: `V53-03-PALACE-DEFENDER-JOINT`, `V53-03-LOW-INTELLIGENCE-JOINT`, `V53-03-SINGLE-ATTACKER-NORMAL`, `V53-03-ALREADY-ORDERED-SUPPORT`.

## Jungle visibility during AI turns (#4)

Native unit redraw `0x24466` first checks jungle terrain. Jungle immediately sets cell bits0x90 and invokes terrain-only redraw `0x24648`, then returns. It does not consult active side or current controller. Eight witnesses show terrain-only redraw for both camp flags and all combinations of existing0x10/0x80 flags. No daily-order meaning is inferred from those display bits.

Combat flashing `0x250F8/0x250AE` draws generic marker `0x2361E`, rather than turning the army sprite visible. Normal/joint survivor redraw `0x24BAA` calls `0x24466`, so surviving jungle sprites become concealed again. The ambush routine clears0x80 on the ambusher but preserves preexisting concealment0x10. Moving transfers the low occupancy bits through `0x23866`, clears the old cell to fire-only, then redraws at the destination; jungle redraw hides again.

The remaster's `visibleUnit` defaults to `b.side`. If UI code uses that default while the AI is active, it sees the active AI's own units as friendly and displays their jungle positions. A fixed human observer perspective must govern renderer, HUD, hit testing and movement/selection overlays, with temporary combat markers separately managed. Engine AI querying its own side remains legitimate. The native does not establish the remaster's permanent reveal-after-attack list; action-specific concealment cases should validate persistent state versus temporary animation.

Named regression cases: `V53-04-HUMAN-ATTACKER-AI-JUNGLE-TURN`, `V53-04-HUMAN-DEFENDER-AI-JUNGLE-TURN`, `V53-04-HIDDEN-HUD-HITTEST`, `V53-04-JUNGLE-MOVE-REHIDE`, `V53-04-COMBAT-FLASH-DOES-NOT-PERSIST`.

## Forced movement auto-ambush (#5)

Both the native human pull routine `0x25998` and AI pull routine `0x2D432` relocate the hostile unit into the puller's vacated hex, preserve that hostile unit's mobility, then compute direction from the hostile's old hex to its new hex using `0x24E00`. They call automatic ambush routine `0x24938`, passing the puller pointer as skip. The native three-cell forward arc and hostile jungle predicate therefore apply to the displaced enemy too. A successful forced move onto fire applies mode1 ignition damage before ambush and exits if that damage kills the unit.

Six witnesses exercise human/AI pull, zero/one/two forward jungle ambushers. They retain original eligibility, relocation, direction, skip-puller, forward arc and jungle eligibility; only RNG, drawing and ambush casualty body are hooked. The moved unit is attacked once per qualifying jungle unit. Current remaster `pullEnemy` changes position, resets reveal state and returns without calling `ambush` or applying burning-tile entry damage. This is a mechanics omission, not animation-only.

Named regression cases: `V53-05-HUMAN-PULL-ONE-AMBUSH`, `V53-05-AI-PULL-TWO-AMBUSHES`, `V53-05-PULL-ALL-DIRECTIONS-PARITIES`, `V53-05-PULL-OUTSIDE-ARC-NO-AMBUSH`, `V53-05-PULL-FIRE-ENTRY-THEN-AMBUSH`, `V53-05-PULLER-SKIPPED`.

## Why the previous audits missed #4 and #5 (#6)

The earlier forced-movement witnesses in `verify-native-tactical-v49.py` replaced `0x24938` with a zero-return hook. They proved displacement and MP behavior while suppressing exactly the post-movement ambush branch reported here. No integrated native-to-remaster witness tested that consequence.

The earlier jungle witness proved that the native draw branch sets concealment bits, but did not exercise the remaster's renderer/HUD while `b.side` changes to the AI under a human observer. The missing cross-layer test let the UI use the AI's own visibility perspective. Bounded arithmetic and branch checks alone cannot establish full battle fidelity. Native witness limits should list every bypassed consequential branch and link to an integration regression or a pending test design.

## Reburning already-burning occupied hex (#7)

Native ignition `0x266BC` unconditionally ORs fire0x20 and calls occupied-unit fire damage `0x24752` with mode1; there is no prior-fire test. Thus each successful hostile fireball re-applies ignition damage even if already burning. Ten witnesses cover initial/repeated fire at99/100/101/1000/9999 soldiers. Below100 soldiers the native immediately invokes fire death. Otherwise damage is a uniform integer in `0..floor(5*men/100)-1`, and equipment is deducted proportionally by the shared helper. This differs from post-order mode0 fire's30% loss bound. The remaster already reapplies mode1 casualties on successful reburn; preserving that behavior is necessary.

However the current remaster success probability differs from native. Native `0x24B2C` uses terrain-specific fire chances from DS:B36E: plain80, jungle90, hill70, mountain60, water0, castle50, palace20. Except water, add a random integer0..9. Rain always fails; sunny/fewclouds/cloudy have no separate probability multiplier in this branch. For occupied hexes, use:

`chance = min(100, floor((101 - target.INT) * terrainChance / 100) + floor(randomInteger(0 .. max(0, actor.INT-target.INT)-1) / 2))`

The zero-range random helper returns0. A second integer draw0..99 must be strictly less than chance. On unoccupied hexes the terrain chance is used directly (values are below100). 84 unchanged native equation witnesses cover7 terrain types,3 attacker/targetINT pairs and4 weathers. Current `.25 + actorINT/150` multiplied by weather is not that equation. Original mechanism/equation claim requires correcting targetINT and terrain handling too.

Named regression cases: `V53-07-REBURN-REPEATS-IGNITION`, `V53-07-REBURN-USES-REMAINING-MEN`, `V53-07-SUB100-FIRE-DEATH`, `V53-07-IGNITION-NOT-POSTORDER-30PERCENT`, `V53-07-TERRAIN-TARGET-INT-CHANCE`, `V53-07-RAIN-NO-IGNITION`.

## Evidence limitations / pending designs

- Full native AI target ordering/strategic commander-risk policy is not reproduced by the16 priority witnesses. Extend the witness to run unhooked `0x2C166/0x27D1E` with varied occupied targets, army strengths and strategic state; retain user-observation tests separately.
- Full DOS screen capture after all9 battle orders is not available. Build deterministic human-observer integration cases for each order/animation transition and optionally compare emulator captures.
- Forced movement death/capture and weapon deduction are hooked in this bounded witness. Engine regressions must independently verify both fire and ambush equipment loss, fire death suppressing subsequent ambush, and unchanged forced-target mobility.
- Native fire chance was directly executed; this report does not certify unrelated wind-spread, extinguishing, weather-transition or AI fire target-choice rules.
