# v56 concealed-target / empty-hex native audit

Binary: user-supplied English main.exe, SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Original load-image offsets below refer to its unpacked image. The portable script unpacks in memory and writes witness JSON; it never copies executable bytes to a deliverable.

Run:

```
PYTHONPATH=<unicorn dependency directory> python tools/verify-native-concealed-v56.py <main.exe> <output.json>
```

**30 passing actual native witnesses:** 6 occupied-jungle dispatcher cases, 12 empty-cell dispatcher cases, 9 complete human command-controller cases and 3 friendly-jungle rejection cases.

## Findings

1. **Charge is legal against a concealed enemy in adjacent jungle.** Human attack submenu `0x26980` selects mode 4; adjacent direction and actual occupancy lookup in `0x26804` reach dispatcher `0x265AE`, which calls the original Charge body `0x26318`. Revealed ready flags132 and concealed ready flags148 both reach the combat exchange at `0x24C58`. There is no jungle/concealment rejection in these paths. Normal (mode1) and Simultaneous (mode2) likewise reach their original handlers. The Simultaneous cases resolve two eligible participants with original adjacency/army lookup retained.

2. **A missed attack on an empty guessed hex spends the attacker's own daily command, including Charge.** The dispatcher tests the selected occupancy nibble, then calls `0x262C2` and prints its empty-target message. `0x262C2` writes DS `0xB8E2=1` at `0x2630F`. Actual human linked-list controller `0x226A0` sees the completed-command flag at `0x22730`, processes the end-of-order hook and advances to the next officer at `0x22740`. All three modes advance from actor9000 to next officer9200 exactly once. This is stronger than inspecting a cell's readiness bit in isolation.

3. **Empty misses do not spend mobility.** Each unit starts with7 MP and retains7. No combat exchange or casualty RNG is reached. A missed Normal/Simultaneous leaves the actor's cell ready-bit128 set; it nevertheless consumes the officer's own daily command through B8E2. This agrees with the earlier native linked-list/readiness audit: cell readiness and own-turn completion must not be conflated. The current remaster Normal/Simultaneous guessed miss already marks its initiator ordered and retains mobility; Charge must gain the same branch.

4. **Friendly occupancy is rejected, preserving the daily command and mobility.** Native hostile-side check `0x23A50` returnsfalse before dispatch. These fixtures place the target in the real friendly linked list, rather than merely changing its tile flag. No effect/flash/exchange is reached. An invalid friendly selection is different from a valid empty guessed attack.

5. **The empty dispatcher itself does not reject terrain.** Its direct probes return completed-command for empty plain0, jungle1, mountain3 and water4. These are boundary observations about `0x265AE`, not evidence that every such hex is offered by the full tactical interface. The complete human controller witnesses establish adjacent empty jungle only. They do not justify expanding the remaster's current deliberate suspected-jungle input policy to arbitrary empty terrain.

## Surgical implementation recommendation

Allow the existing suspected adjacent jungle `q/r` targeting path to include Charge, preserving rejection of direct concealed enemy IDs. Resolve actual occupancy only after the command. If no enemy is there, consume only the initiator's daily command, retain its MP, produce an empty-hex miss cue/status, and run the normal one-time after-order burning/outcome processing. Reject friendly occupancy without spending an order. Do not add new casualty equations or reveal hidden unit positions when merely preparing the command.

Audit all UI/planner legality and raster targeting gates for the same `['attack','simultaneous']` omission; changing only battle.mjs leaves Charge inaccessible through the mounted interface. Native charge equations/overrun/landing are not replaced by this audit.

## Required remaster integration cases

- `BUG56-01-CHARGE-CONCEALED-JUNGLE`: human `q/r` Charge on occupied hidden adjacent jungle resolves combat; command target selection offers the suspected hex without exposing the unit; direct concealed ID remains rejected.
- `BUG56-02-GUESSED-MISS-SPENDS-TURN`: Normal, Simultaneous and Charge on empty suspected jungle each set ordered/orderDay, retain MP, use no casualty RNG, resolve no exchanges and consume only initiator's own daily order. Simultaneous helpers retain their own daily orders.
- `BUG56-02-MISS-BURN-ONCE`: a burning initiator's missed guessed command performs exactly one normal after-order fire damage application; replay/animation does not resolve it again. This consequence is suppressed in the native controller witnesses and needs an engine integration fixture.
- `BUG56-01-FRIENDLY-GUESS-REJECTED`: suspected target containing a friendly unit rejects without modifying orderDay, MP, soldiers or RNG.

## Hooks and limits

Native geometry, cell occupancy lookup, actual army linked lists, allegiance/same-side tests, submenu mode selection, normal/simultaneous/charge handler routing, own-command completion and daily linked-list progression execute unchanged. Keyboard characters/direction are controlled. Unit activation's native maximum helper is replaced by mathematically equivalent max(a,b). Graphics, UI delays/printing, generic key redraw and end-of-order fire/outcome processing are suppressed. Occupied cases replace combat casualties with terminal status1 without soldier mutation; these witnesses establish legal reachable exchanges, not damage equations, depletion/capture, breakthrough/occupation or audiovisual playback. Existing native damage witnesses and new remaster integration cases must supply those consequences. No complete DOS simulation or broad parity is claimed.
