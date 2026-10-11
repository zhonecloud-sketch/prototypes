# Fire escape and palace decisions — v42

A burning palace guard now considers escape before its ordinary “hold the palace” decision. The original executable does not always sacrifice an army to keep the palace occupied.

## What the supplied executable establishes

`tools/verify-native-fire.py` runs the unchanged goal-selection branch at unpacked offset `0x2AD8A`. The twelve recorded cases (six situations in both opposing native army slots) are in [native-fire-v42.json](native-fire-v42.json). The verifier checks the supplied executable's SHA-256 before running it.

| Situation | Recovered priority | Remaster action |
| --- | --- | --- |
| Burning unit has more than 3,000 men; an adjacent enemy commander has fewer than 1,000 | Keep the current goal and target that commander | Normal attack from the current tile |
| Palace is empty, dry, and its terrain cost is affordable | Set the palace as the goal | Take an affordable dry neighbouring step toward it |
| A dry, unoccupied, affordable neighbour remains adjacent to the palace | Prefer that ground | Move one tile, retaining a position beside the palace |
| Another dry, unoccupied, affordable neighbour exists | Escape to dry ground | Move one tile |
| No such neighbour exists | Fall through to later native decisions | Wait; fire damage still applies normally |

Exactly **3,000** friendly soldiers and exactly **1,000** enemy soldiers do not meet the commander exception. The controlled native cases also show a burning palace unit choosing dry neighbouring ground. A nearby strong enemy does not establish a blanket “stay in fire to save the palace” rule in this branch.

## Evidence and limits

The fire check at `0x2396A` reads bit `0x20` of the battlefield cell flags. The escape-cell check at `0x2C2F4` rejects unaffordable terrain, fire and occupied cells. `0x2BCDE` tries the palace and then ground neighbouring palace terrain; `0x2AC54` tries other neighbouring cells. The commander exception is at `0x2AE20–0x2AE85`.

These are bounded executable checks using Unicorn, with hooks for unit lookup, direction ordering and UI/mobility bookkeeping. They establish **goal priorities**, not a full DOS battle simulation. The remaster still uses its own route tie-breaking, visible-enemy information and legal action resolver. Waiting when escape is blocked is a remaster fallback; the complete later native attack/retreat branch has not been reproduced here.

To reproduce the native checks, install Python's optional `unicorn` package, then run from `dist/rtk2`:

```sh
python tools/verify-native-fire.py /path/to/main.exe /tmp/native-fire-check.json
node tests/v42-tests.mjs
```

The original executable remains a separate input and is not included in the game.
