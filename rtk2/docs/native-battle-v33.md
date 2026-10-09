# Native battle and local governance verification — v33

The supplied English `main.exe` supersedes the Python reconstruction. Its SHA-256 is `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. All addresses below are **unpacked load-image offsets**, not packed-file offsets or relocated DOS addresses. No executable is distributed with this game.

## Evidence and reproduction

`tools/verify-original.py <original-file-directory> docs/original-v33-checks.json` verifies 115 frozen byte witnesses, including the original captive menus, hostility write, local AI dispatch tables and ambush/flight paths. The supplied scenario file still gives Liu Bei exactly three officers in 189; that investigation remains closed.

Install optional Python `unicorn`, then run `python tools/verify-native-battle.py <main.exe> docs/native-battle-vectors-v33.json`. This runs **812 controlled native cases**: 240 ambush, 240 flight, 160 Train, 160 Give and 12 movement/ambush geometry cases. Arithmetic executes unchanged in a bounded 16-bit emulator; UI, ownership tests and random draws use controlled hooks. It does not run DOS or establish complete game parity. `node tests/v33-tests.mjs` compares the remaster to those recorded results. V32's separate 1,300 normal-melee/domestic cases remain valid.

## Captured ruler

`0xA212` is the distinct ruler-captive handler. It displays `1.Set free 2.Behead` via the DS `0x46A9` string, then requests a choice in the range 1–2. The ordinary captive handler uses DS `0x46E5`, `1.Recruit 2.Set free 3.Behead`, and defers the ruler until after other captives. **No remaining-province count gate was found in that ruler menu**: v33 consequently prohibits ruler recruitment even when their realm is landless. This is stronger than the requested surviving-province restriction and follows the observed menu.

Execution at `0x9AFA` invokes ruler removal/succession; `0x9B81` writes 100 to the successor realm's hostility toward the killer and records the enemy. Existing clan-destruction and heir artwork/event handling is retained. If no successor exists, the clan destruction path applies.

## Automatic ambush

`0x24938` checks three cells selected by the direction table at DS `0xB5FE`. These are hexes in the entering unit's forward arc, **not all eight surrounding square cells**. `0x239D6` tests for an occupied hostile jungle cell. `0x247C6` computes the ambush; `0x2488D` protects targets with INT ≥90. The ambusher spends neither its daily order nor mobility. Movement, taunt and charge landing use the same trigger geometry.

Let `P = 3 × (WAR + Lu Bu bonus 20) + training + min(100, floor(100 × weapons / men))`. For the moving unit's terrain divisor `T` from v32 and integer roll `R` in 0–299:

`raw = trunc(trunc(10 × (P_mover − P_ambusher − min(ambusher men, R)) / T) / D)`

`loss = min(mover men, 3 × (raw < 0 ? −raw : integer roll 1–30))`

`D` is difficulty when a human ambusher attacks an AI moving unit; otherwise 1. Weapons fall proportionally to pre-hit equipment percentage. No counterattack occurs. INT ≥90 consumes no loss RNG and takes zero loss. A zero-men victim leaves the field and emits a capture status. Native concealment flags, secret-pact distinctions and the complete surrounding tactical UI are not fully reconstructed.

## Voluntary flight and commander withdrawal

`0x25566` first checks horse flag `0x40`: a horse guarantees escape. For other officers it restores mobility using native activation, then computes:

`chance = min(100, floor((10 × mobility + WAR + training + floor(men / 100)) / (adjacent hostile units + 2)) + ruler bonus 20 + Lu Bu bonus 20 + integer roll 0–9)`

A subsequent roll in 0–99 must be strictly less than chance. **INT is absent**. Native destination routine `0x25810` accepts adjacent same-owner or unoccupied provinces. A defender cannot flee into the hostile invading source, but can flee to another friendly neighbour. The remaster reserves empty destinations to prevent conflicting ownership across individual withdrawals/save-load.

Commander Flee confirms whole-army defeat (`0x2CE9C`/`0x2CF0F`), then each officer chooses a destination and attempts escape separately (`0x2CDEA`/`0x25670`). V33 implements this for voluntary withdrawal and reports success or capture. Zero destinations prevent a voluntary withdrawal. **Compulsory post-defeat retreats** (`0x2CFBE`) and AI destination selection (`0x2574C`) are distinct paths: their complete UI/settlement integration remains outstanding. The previous post-battle reserve capture approximation is explicitly not validated by these flight tests.

## Train and Give

Train (`0x10FDE`) sums `floor(men / 100)` separately for every army with training below 100. `gain = floor(2 × trainer WAR / isqrt(1 + sum))`; the update at `0x1102E` applies to every officer, including zero-men officers, capped at 100. Fully trained armies do not dilute the denominator.

Give (`0x106A0`) uses **local governor CHA**, not a distant ruler:

`gain = floor(floor((governor CHA + acting officer CHA) / 2) × isqrt(food) / ((6 + difficulty) × isqrt(floor(population / 100)))) & 255`

The native helper returns 65535 for a zero denominator; its low byte is 255. An already fully loyal province cannot use Give. Numeric forecast values use this corrected arithmetic; advisor availability, cached monthly confidence and advice logic are unchanged.

## Local governance priorities

`mjs/native-governance-priority.mjs` centralizes the recovered tables and retry logic; `mjs/ai-governance.mjs` invokes it after the existing strategic prelude. This is a port of **local dispatch ordering**, not a claim that every eligibility test or strategic action is native.

| Table / group | Native order |
| --- | --- |
| DS A2E6: military | Train, Hire, Reassign, Buy weapons |
| DS A2F6: personnel | Reward, Recruit free officers, Search, Teach writings |
| DS A306: domestic | Give, Cultiv, Flood, Sell food, Buy horses |
| DS A31A: policy 0 | Domestic, Personnel, Domestic, Military, Movement/supply |
| DS A31A: policy 1 | Domestic, Military, Movement/supply, Personnel, Military |
| DS A31A: policy 2 | Personnel, Domestic, Personnel, Military, Movement/supply |

The last domestic handler (`0x1FE68`) increments province byte +0x19 (horse inventory), costing 100 gold per horse; it is **not fort construction**. `0x1C26C` selects policy 0 for governor ambition <80 and random policy 1 or 2 otherwise. Group handlers choose a random start and advance cyclically until success: military tries `floor(difficulty / 2) + 2`; personnel/domestic try `difficulty + 1`. Domestic Cultiv/Flood eligibility and investment recovered at `0x2011C`/`0x2016A` use investment `floor(isqrt(gold)/2)` with a minimum of `4 × difficulty`, plus the native attribute-dependent chance.

Remaining work includes native strategic war/diplomacy prelude, actor sorting probabilities, complete eligibility/investment for other local orders, movement/supply internals, delegated-policy flag mapping, compulsory retreat UI, capture/recruit coefficients, duel equations, abstract combat and event scheduling. Existing human advisor behavior is intentionally preserved. The scope must not be described as all battle/governance mechanics matching DOS.

## Release validation

All 328 regression checks (`npm test`) and the raster interface suite (`npm run test:ui`) pass. The interface suite covers delayed field-result playback, separate general/commander flight, commander flag marking, unchanged governance navigation, Hard spectator continuation, mounted messenger decisions and saved battle restoration. These are automated DOM/Canvas checks; physical handset appearance and audible music need device review.
