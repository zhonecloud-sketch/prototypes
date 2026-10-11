# Battle turns, fire and movement — v43

These findings come from the supplied English `main.exe`. The nine controlled checks in [native-turns-v43.json](native-turns-v43.json) execute the original instructions in a bounded 16-bit emulator. The verifier checks the executable's SHA-256 first. This is evidence for the listed rules, not a complete DOS playthrough.

## What changes when

| Event | Fire damage or movement rule |
| --- | --- |
| Successful fireball ignites a unit's tile | Immediate random loss below 5% of that unit's men. |
| A unit finishes an order and remains on fire | Random loss below 30%. Human and AI use the same rule. |
| Inspect a unit | No daily order spent; no fire check. |
| Army control changes | No extra blanket damage. AI orders may execute immediately after the handoff. |
| Finish army orders with unused units | Those units Wait; burning units receive their after-order check. |
| Rain begins at the day update | Clear fire before the spread update. Orders already completed under the previous weather retain their losses. |
| Move with 5 MP | Can cross plain (2 MP) then jungle (3 MP) in one order. Enemy contact or other movement restrictions can stop the path sooner. |
| Simultaneous attack | Participating friendly units consume their current daily order. Other friendly units remain available. The opposing unit receives its own army's normal turn. |

Damage can be zero. A burning unit with fewer than 100 men is killed by the original damage routine. Weapon losses use the integer armed percentage. Neither visual fire flicker nor repeated attack animation rolls damage again.

The original Move routine actually traversed `(6,4) → (6,5) → (6,6)` in the controlled plain/jungle case, spending all five MP. The remaster retains its existing multi-tile Move behavior and now writes total route costs on reachable human tiles.

## Original AI deployment

The original has priorities rather than a single “closest to palace” rule:

1. Place the first defender in the empty palace.
2. With sufficient supplies, consider a forward position next to the palace, facing the approach. Troop strength and WAR affect whether the unit holds that position.
3. The fallback defender selector scans legal zone cells using a movement-cost field from the approach. Lower cost wins; a tied cost prefers the higher terrain code, with scan order resolving remaining ties.
4. Attacker placement uses a random available cell in the allowed approach zone.

The executable checks establish the empty-palace branch, a controlled cost-field/terrain tie, and a controlled attacker random choice. The cost field is supplied by a hook in the tie test; that test does **not** establish the entire native path-field calculation or advanced deployment sequence.

The remaster still uses its simpler closest-palace placement for both armies. Its first defender normally takes the palace, but the later deployment strategy is **not fully equivalent**. This verification request does not silently replace that policy with an incompletely reconstructed version.

## Controls and visual checks

Deployment confirmation is at bottom right. **Yes** confirms a fully placed army. **No** clears only the current army's deployment so it can be placed again; the previously confirmed opposing army stays placed.

Friendly portraits open unit information immediately. Hostile portraits ask whether to spend **100 gold**; Yes charges once and opens the information, No returns without charging. Inspection preserves mobility and order flags. The extra View unit button has been removed from the portrait picker.

The gold active hex and blinking soldier sprite use the same selected AI actor as automatic HUD diagnostics. HUD's explicit unit picker can still preview another unit. Human movement highlights show total path costs in MP. Clicking a tile shows terrain type, movement cost and combat effects; a reachable tile still performs the selected Move order.

Terrain defence numbers compare the native melee casualty divisors with plain ground. For example, hill's divisor 12 versus plain's 10 gives about ×0.83 incoming losses before integer rounding. Damage depends on both armies' WAR, training, equipment and random draws too. Terrain has no separate flat attack bonus; the target's cover determines its losses. Palace assault uses a special divisor 5 for the attacker’s counterattack exposure.

Fire imagery is 50% opaque and continuously changes size until extinguished. Normal and Simultaneous attack animate all involved units for **five 600 ms cycles**; Charge uses **ten**. Status follows the animation. Game rules resolve the attack once.

## Captive-count investigation

No five-versus-three loss of decisions was reproduced. The regression scenario reports five captured generals, stores five pending decisions, preserves all five through save/load and lets the human resolve each one. The victory screen now names the captured generals and shows how many decisions await the winner. This makes a remaining discrepancy identifiable; no capture formula was changed without a reproduced defect.

## Re-run the checks

From `dist/rtk2`, with optional Python `unicorn` installed:

```sh
python tools/verify-native-turns.py /path/to/main.exe /tmp/native-turns.json
node tests/v43-tests.mjs
npm test
npm run test:ui
```

Native entries: Move `0x25BA8`; fire arithmetic `0x24752`; after-order fire `0x2297C`/`0x22E58`; fireball ignition `0x2671A`; rain/fire update `0x22C68`; simultaneous friendly action-flag clearing `0x261C5`; deployment `0x26D58`. The native day update changes weather before its fire update at `0x23330`.

UI, input, lookup, combat-result, eligibility and selected cost-field hooks keep the native cases bounded. Physical handset rendering remains a separate device check. Other differences, including remaster fire lifetime/spread probabilities and advanced deployment, remain documented approximations.
