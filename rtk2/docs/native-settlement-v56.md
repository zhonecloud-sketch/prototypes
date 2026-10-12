# Native abstract settlement and ordinary captive recruitment — v56

88 executed witnesses PASS against the private English `main.exe`, SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Reproduce with:

```
PYTHONPATH=/path/to/unicorn python tools/verify-native-settlement-v56.py /private/main.exe native-settlement-v56.json
```

The portable script unpacks the original in memory, exports no executable bytes, has no repository imports, and asserts actual native ownership, loyalty and officer linked-list writes.

## Report 6: auto-resolved defender retreat

This is a real remaster discrepancy. In v55 `strategy.mjs` `resolveBattle()` builds `emptyRetreats` and restricts defeated defender `lost()` settlement to those unclaimed candidates, even when occupied friendly provinces are adjacent.

The original abstract entry `0x21418` calls `0x20DAC`, whose losing-party loop calls `0x20CAE`. For the defending main party at DS `0xCB72`, mode2 calls neighbor selector `0x20C26`. That selector makes two passes over the original six directional neighbors:

1. First pass skips empty/unoccupied provinces and returns the first occupied province whose owner equals the defeated party ruler.
2. Only if no such occupied friendly neighbor exists, the second pass permits the first unclaimed neighbor. Hostile occupied provinces remain excluded.
3. No eligible neighbor returns null and the officer becomes a captive; there is no escape roll when no destination exists.

`0x20CAE` retains each officer's next link, chooses a destination, invokes escape predicate `0x20B8C`, and places successful escapees with native `0x5F9E`. Failed escapees enter the victorious party's captive list through `0x20AE8`. A successfully used unclaimed destination is marked via DS `0xCA98` and redraw `0x4F44`; the next escape predicate receives the native +50 bonus.

The escape predicate is separate from the remaster generic `captureChance()`:

```
D = 5 + randomInteger(0, 2)
N = WAR + INT + training + floor(men / 10) + randomInteger(0, 49)
threshold = floor(N / D)
if DS:CA98 != 0: threshold += 50
if officer is ruler OR portrait ID == 0xA3: threshold += 20
escape if randomInteger(0, 99) < threshold
```

The native threshold is not clamped to100. It naturally guarantees escape when above99. These are the actually executed arithmetic instructions, with controlled integer RNG; loyalty is absent from the escape equation. Do not confuse abstract escape with field compulsory retreat `0x25670`/`0x2574C`.

Twelve witnesses vary candidate order, friendly presence and success/failure. They retain owner lookup `0x529A`, empty predicate `0x55E2`, selector passes, escape arithmetic and actual province linked-list placement. Nine additional exact-predicate cases cover threshold endpoints, denominator/RNG endpoints, ruler+20, portrait0xA3+20 and prior-unclaimed+50. One no-refuge case captures with no escape RNG and preserves hostile rosters. Two further witnesses enter the complete `0x21418` controller, fixing combat outcome to attacker victory while retaining every abstract settlement call through `0x20DAC`/`0x20CAE`/`0x20C26`. The destination result and final abstract-result flags are asserted.

## Report 7: loyalty>=90 captive recruitment

The premise that ordinary *captured* generals at loyalty90 must refuse is not supported by this main.exe. Captive recruitment and persuading an officer still serving another ruler are different operations.

The full ordinary captive-list controller `0xA2DE` reaches human menu `DS:46E5`, `1.Recruit 2.Set free 3.Behead`, and dispatches choice1 directly to `0xA0F8`. There is no acceptance percentage, old loyalty gate, shared-blood protection, hostility gate or charisma acceptance calculation on this path. It initializes the officer's new service via `0x5BFE` and places them with `0x5F9E`.

For a normal officer (not the separate covert return-to-patron branch), new loyalty is:

```
newLoyalty = 100
 - integerSquareRoot(abs(officerCompatibility - victoriousRulerLeaderCompatibility)
                     * floor(oldLoyalty / 2))
 - randomInteger(0, 4)
```

This is loyalty *after* unconditional joining, not an acceptance chance. Example oldloyalty100, compatibilitydifference100, jitter4 produces loyalty26. Oldloyalty90, same difference, jitter4 produces29. The native service initializer also sets service count1 and clears covert/service flags, and `0xA0F8` removes the former advisor reference.

The native AI controller also has no loyalty acceptance roll. `0xA2BE` tests INT+WAR: total>=70 selects Recruit; below70 selects Behead. (The remaster currently uses90, a refusal roll, and release fallback.) Captured rulers remain the distinct `0xA212` Set free/Behead handler and must not be added to this ordinary path.

64 full-controller cases vary human/AI ownership, oldloyalty0/90/99/100, compatibilitydifference0/100, jitter0/4 and INT+WAR69/70. Human Recruit always joins. AI decisions follow the70 boundary. Actual service owner, newloyalty, destination officer links and former-advisor removal are asserted. Actual integer square root/compatibility arithmetic executes. Only fixed menu input, rendering/music and random jitter are hooked; the AI terminal Behead call is recorded rather than destructive removal.

Governance recruiting a *serving* general does have loyalty100/shared-blood protection at `0x12EA8`, but those predicates do not apply here. Applying them to captives would create another divergence. The correct response to the user's requested native conformance is to remove the invented captive refusal equation, not invent a loyalty90 rejection.

## Regression designs and bounded gaps

- `BUG-56-06 occupied friendly refuge before unclaimed`: mount an actual abstract attacker victory with both neighbors, successful controlled escape, assert defender general remains with original owner in friendly destination, and assert unclaimed neighbor owner and roster remain unchanged. Reverse candidate order; same friendly result. Ensure chronology says retreat rather than capture.
- `BUG-56-06 unclaimed native fallback`: remove occupied friendly destinations; assert successful escape uses unclaimed. With only hostile neighbors assert captivity without destination writes. Assert forced retreat does not reuse a reserved hostile war destination, and saved settlement roundtrips.
- `BUG-56-06 abstract escape equations`: replay native fixture RNG endpoints and resulting destination/capture lists; cover ruler+20 and first unclaimed escape+50 for the next officer. The modifiers are dynamically established by the exact-predicate witnesses; their sequential multi-officer settlement lifecycle still needs an integration sub-test.
- `BUG-56-07 captured ordinary recruits at loyalty90/99/100`: choose Recruit after abstract defeat, assert true acceptance for each, no acceptance RNG draw, exactly one jitter draw0..4, exact native newloyalty, formeradvisor removal and correct single province membership. Include compatibility0/100, former hostility100 and shared blood; none is a captive refusal gate. Verify save/load and war chronicle.
- `BUG-56-07 AI ordinary selection threshold`: INT+WAR69 vs70, high oldloyalty100; AI selects native Behead vs Recruit. Keep captured ruler menu unchanged.
- `BUG-56-07 serving general distinction`: the ordinary governance serving-general Recruit must continue to reject absolute loyalty100/shared family protection; captive changes must not weaken that separate operation.

Hook limits: original combat roster setup/build `0x20FB4` and fighting `0x21138` are fixed in the two full-entry cases, so those cases certify settlement, not abstract combat casualty coefficients. The original neighbor-coordinate enumerator `0x5C78` is replaced with candidate indices to isolate settlement selection; geography ordering is native first eligible among its direction enumeration and requires an integration mapping check. Redraw `0x4F44` and all portrait/text/music calls are suppressed. AI Behead `0x6062` is recorded, not executed; this audit certifies decision selection rather than beheading consequences. Complete ruler exile/faction retirement, covert return-to-patron initializer, serving-general Recruit equation and DOS UI remain outside this bounded witness set. The read-only native audit changed no runtime files. V56 integration is covered by tests/v56-tests.mjs; no AI training ran.
