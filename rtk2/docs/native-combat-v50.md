**Current v52 correction:** [v52 findings](fixes-v52.html) restore remaster music and supersede earlier claims that simultaneous helpers/targets or automatic ambushers spend their own daily orders. The original cell flags are independent of the native own-order controller.

# Native combat audit — v50

The supplied English `main.exe` has SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are offsets in its unpacked load image. [native-combat-v50.json](native-combat-v50.json) records **60 executable bounded witnesses**; this count excludes static instruction inspection. The original executable is not distributed with the remaster.

## Verified changes

| Mechanic | Original evidence | Remaster correction |
| --- | --- | --- |
| Simultaneous losses | `0x26072` calls the exchange routine for each participating unit, beginning with the initiating unit. | The result lists actual men lost by every participating general and the opposing general, including zero losses for unused helpers. |
| Simultaneous readiness | The completed native loop clears the target's ready bit. Attacker readiness is cleared when that attacker exchanges damage. | Completed simultaneous attacks spend the target's order too. Helpers that never strike retain their order. |
| Ambush readiness | `0x247C6` calls the flash renderer before resolving casualties, then clears the ambusher's ready bit at `0x2484F`. This also occurs when mover INT ≥90 prevents losses. Its mobility remains unchanged. | Ambush consumes the ambusher's daily order and retains MP. Structured message metadata preserves attacker and victim snapshots for animation, even when the victim is captured. |
| Repeated ambush | `0x24938` calls ambush for enemy jungle occupancy with flags 4 and132 alike. Its actual geometry, lookup, occupancy and ownership code execute in both witnesses. | An already-ordered enemy in the forward jungle arc can still ambush another entering unit. |
| Combat animation | Shared renderer `0x250F8` runs eight source/target cycles. `0x250AE` redraws each tile twice: source, source, target, target. Simultaneous and Charge call this renderer per actual combat exchange. | Normal and Ambush use eight alternating cycles. Simultaneous and Charge use eight cycles per actual exchange; visual playback never rolls combat damage again. |
| Local AI flight | `0x2B18A`/`0x2AB5E` contain low-men, adjacent-threat and trapped-fire withdrawal branches. The previous remaster policy never selected voluntary Flee. | Legacy and trained AI now choose voluntary flight on both army sides using the recovered local tests and existing escape/commander withdrawal settlement. |

The low-men branch withdraws attackers below 100 men; defenders below 100 use a 50% chance. The adjacent-threat branch requires men below `adjacent hostile count × (800 for commander, 500 otherwise)` and at least one adjacent hostile unit with more than three times the actor's men. A unit below 3000 men on fire can withdraw if it has no affordable dry neighbouring escape. The native province-exit check gates flight before these tests.

The remaster uses visible opponents for local threat assessment, preserving the intentional v49 restriction against AI knowledge of concealed locations. A commander withdraws through the existing whole-army Flee path; every remaining officer needs a legal retreat destination.

## Jungle simultaneous attacks: requested difference

The original does **not** support the claimed blanket prohibition. The human dispatcher `0x265AE` accepts mode 2 against an occupied jungle tile and calls `0x26072`. Four additional witnesses execute the full simultaneous handler's original eligibility, geometry, lookup, occupancy and ownership predicates with two distinct attackers. Both Plain 0 and Jungle 1 targets, with revealed flags 132 and concealed flags 148, reach **two actual calls** to the combat exchange helper, each with factor 2. Each participant first receives its own call to the eight-cycle flash renderer; the recorded sequence is initiating attacker→target, then helper→target. Only rendering and exchange arithmetic are intercepted in these four cases.

The resumed v50 removes the mistaken jungle prohibition. Human, Legacy and planner legality accept simultaneous attacks into jungle. Human players can select a suspected adjacent jungle hex with two ready friendly units; concealed occupancy is resolved only after the order. A remembered hex can be attacked jointly, but moving to another concealed hex does not update the opponent’s memory. An empty suspected hex misses and spends the initiator’s order. Direct hidden-unit IDs remain unavailable, preserving the existing v49 visibility policy.

## Retreat reservations

Enabling voluntary AI flight exposed a deferred-settlement defect: an officer could reserve a friendly retreat province, a different suspended war could capture it, and the first war's saved retreat became invalid. Ongoing-war guards now include recorded retreat destinations across invasion, movement, delegated and trained governance choices, rebellion events and subsequent flight destinations. Opposing owners cannot reuse a reserved destination; its recorded owner can.

This protects the remaster's existing deferred officer settlement. It does not establish the original DOS settlement timing. Six scenarios, each run for 6000 AI actions with strict checkpoints, pass after this correction.

## Remaining differences and evidence limits

These witnesses establish the listed branches, not complete battlefield parity. Native strategic whole-army withdrawal decisions involving food and army-status flags (`0x279B6`, DS `0xB8D0`/`0xCAE7`) remain incompletely reconstructed. The local Flee implementation does not claim to reproduce those strategic decisions. Original advanced deployment priorities, compulsory post-defeat retreat integration, AI bribe choices and broader AI ordering remain separate audit work. Existing combat coefficient and capture witnesses retain their previously documented bounds.

The verifier uses controlled input, rendering, RNG and selected army-status hooks. Local threat witnesses use controlled adjacency/lookup; the new full jungle-handler and repeated-ambush witnesses retain those original predicates. No complete DOS playthrough or audible/device rendering check is implied.

## Reproduction

From `dist/rtk2`, with optional Python `unicorn` installed:

```sh
python tools/verify-native-combat-v50.py /path/to/main.exe /tmp/native-combat-v50.json
node tests/v50-battle-tests.mjs
node tests/battle-tests.mjs
node tests/v48-tests.mjs
node tests/v49-tests.mjs
node tests/strategy-tests.mjs
```

The focused v50 suite covers named loss rows, initiator ordering and unused helper readiness, visible/concealed jungle attacks, insufficient-support rejection and vacated-hex misses, all 32 recorded local flight inputs, hidden threat fairness, flight on both sides, mutation-free trained previews, trapped fire and cross-war destination reservation. The bounded native witness breakdown is 2 ambush readiness, 2 repeated-ambush trigger, 1 flash sequence, 32 local flight, 1 simultaneous readiness, 16 fire/exit gates, 2 human simultaneous dispatch and 4 full simultaneous handlers.
