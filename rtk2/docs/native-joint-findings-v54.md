# v54 simultaneous attack casualty audit

Original SHA256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are unpacked-image offsets. The executable remains outside the repository.

Reproduce with optional Python Unicorn installed:

```sh
python native-joint-witness-v54.py /path/to/main.exe /tmp/native-joint-witness-v54.json --repo /path/to/rtk2
```

## Result

The v53 remaster **already subtracts the sum of all executed participants' inflicted casualties** from the target. Twenty original-handler/actual-equation witnesses matched the current `act('simultaneous')` result for every surviving soldier count, equipment count, number of exchanges and casualty RNG calls. These cover two/three attackers, plain/palace targets, equal/mixed combat power, poor equipment, an early defeated target and an early defeated attacker. No dropped target-damage accumulation defect was found in these cases.

Example with two mixed-power attackers named Dong Zhuo and Lu Bu in the comparison fixture: Cao Cao loses11 in the first exchange and172 in the second, for183 total. With a third attacker inflicting6, the total is189. Each attacker's own losses are different numbers: they represent counterattack casualties, not the damage inflicted on Cao Cao. The current `lossRows` contains each army's own losses plus Cao Cao's aggregate losses; it does not explicitly display inflicted casualties per attacker. Showing both columns would make the arithmetic directly inspectable without changing damage rules.

One additional witness found a **helper ordering mismatch**, described below. This can alter exact totals, but is separate from summing or omitting contributions.

## Original native execution

The human joint handler `0x26072` counts eligible units around the target at `0x260A0..0x260E6`. It executes the selected initiator in its first pass and other eligible surrounding units in the second pass. For each participant:

1. Load that participant's terrain into DS:B8DD; target terrain is DS:B8DE.
2. Call shared exchange `0x24C58` with participant pointer, target pointer and total participant count.
3. Call result redraw `0x24BAA`.
4. Stop if the shared exchange returns status0 (defender defeated), status2 (both defeated) or the global battle-ending condition. Status1 (current attacker defeated) still allows later helpers to attack.

The exchange calls original power `0x23702` for the participant and target, then native casualty `0x2375A` twice. Both calculations use the armies' **pre-exchange** men/equipment/power. Proportional equipment deductions occur before the men writes. Once the exchange completes, the next helper sees the target's **remaining** men and equipment. Target power is recomputed; it is not a cached initial target power.

The participant-count factor divides the casualty expression for **the attacker's own counterattack losses**. It is not a multiplier applied to each helper's damage against the target. Native difficulty can further adjust that factor in human/AI classification cases; this bounded suite fixes ownership classification as nonhuman on both sides.

Casualty random draws execute in this order for every exchange:

- Attacker own-loss roll in0..299, then an additional0..29 fallback only if its raw casualty expression is nonnegative.
- Target-loss roll in0..299, then an additional0..29 fallback only if its raw casualty expression is nonnegative.

Actual target losses are capped by remaining soldiers. An early-defeat witness has20 remaining defenders and native calculated loss677: actual loss is20, the handler stops, and later helpers cause no damage. The remaster matches that behavior. Summing uncapped theoretical losses would be wrong.

## Genuine helper ordering mismatch

Original native directions around the target are `LL,D,LR,UL,U,UR`. The initiator always goes first; other helpers follow that geometric scan order. The remaster's `jointAttackers` sorts the initiator first, then preserves `b.units` insertion order for other helpers.

The21st witness intentionally reverses the two helpers' linked-list/insertion order. Original still executes pointers9000,9200,9100 according to their hexes. The remaster executes9000,9100,9200. Under the controlled replay the native target total is189 while current remaster total is304; casualty RNG consumption differs9 versus8 because swapping participants changes which fallback branches execute. This confirms an ordering mismatch, not failure to sum losses. Exact production totals depend on the game's random stream; those example values are deterministic witness values.

A surgical native-fidelity correction is to preserve initiator first and sort other helpers by direction from **target to helper**, using remaster direction indices `[3,4,5,0,1,2]`. Do not change `meleeExchange` or multiply damage again.

Regression names:

- `V54-02-TARGET-LOSS-EQUALS-EXCHANGE-SUM`: verify target before/after equals summed actual inflicted damage for2/3 participants.
- `V54-02-PER-ATTACKER-INFLICTED-AND-OWN-LOSS`: verify displayed inflicted/received figures correspond to each actual exchange.
- `V54-02-TARGET-EARLY-DEFEAT-STOPS`: cap actual loss by remaining men and suppress later exchanges.
- `V54-02-ATTACKER-EARLY-DEFEAT-CONTINUES-HELPERS`: later helpers still engage.
- `V54-02-PALACE-SEQUENTIAL-EQUIPMENT`: native special terrain and equipment updates remain compatible.
- `V54-02-HELPER-ORDER-INDEPENDENT-OF-UNIT-ARRAY`: reorder underlying units; native geometry still determines helper exchange order and seeded result.

## Hooks and limits

The witness runs unchanged original joint eligibility, hex geometry, unit lookup, combat power, casualty equations, equipment equations, men/equipment mutations and joint terminal branches. It never hooks `0x24C58`, `0x23702`, `0x2375A`, `0x235A8` or equipment-percent helper `0x533E`.

RNG is replaced with controlled integer values, recorded with their requested bounds. Rendering, treasury/food counter UI and human-controller classification are bounded hooks. Depletion executes original soldier/equipment clearing instructions `0x25364..0x2537C`, then bypasses DOS captive/province/officer bookkeeping. The suite therefore does not certify downstream captivity settlement, human difficulty adjustment, secret pacts, whole-battle termination bookkeeping or DOS graphics. Those need separate integration tests or entries in pending-test-case design.

The Node comparison executes the current game `act` function, not a duplicate damage implementation. It reports each native exchange's pre/post state, native calculated loss, actual target loss and RNG interval in the JSON. Scripts neither run nor renew AI training and include no executable data.

## Final v54 result

Helpers now scan LL,D,LR,UL,U,UR after the initiator, independent of roster insertion. All21 native/remaster cases match soldiers, weapons, RNG calls and exchange count, including the previously mismatched shuffled case. `exchangeRows` records actual inflicted and received casualties per resolved participant; the displayed target sum equals the actual aggregate. Native equations and early-stop behavior are unchanged. Reproduce with `python tools/verify-native-joint-v54.py /private/main.exe /tmp/joint-v54.json --repo /path/to/rtk2`.

## AI-handler follow-up

The additional [AI audit](native-ai-joint-findings-v54.md) executes 88 native grouped-attack cases, including human targets at difficulty 1/3/5, three/four attackers and shuffled rosters. All final soldiers, equipment, RNG and exchange counts match. Strategic commander-risk eligibility and target selection remain bounded separately; this is damage/order evidence once the group is eligible. `tests/v54-tests.mjs` replays all 109 human/AI arithmetic fixtures with both roster orders.
