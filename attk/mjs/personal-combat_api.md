# Personal combat API

```js
import {resolvePersonalCombat} from './personal-combat.mjs';
const duel = resolvePersonalCombat(
  {war: 100}, {war: 50}, () => 0.5
);
console.log(duel.winner, duel.rounds.length);
```

Expected output: `defend 5`. Each round records remaining defender and
attacker combat strength. These counters do not reduce permanent WAR.
Evidence: `../docs/native-personal-combat.json`, ordinary 100/50 case.

`resolvePersonalCombat(defender, attacker, random, compromised = false)`
accepts two objects with integer `war` in 0–100 and a function returning
values in [0, 1). The fourth argument selects the native covert-participant
damage bounds. The returned object has `initial`, `bounds`, `rounds`,
`winner` and `loser`. Side names are `defend` and `attack`; a draw returns
null for both outcome fields. Both damage calls occur in every round,
including the final one. Bounds below two do not consume randomness.
Evidence: `personal-combat.mjs`, the native 4B38 small-bound witnesses;
native entries 293AA and 29304 in the witness file above.

`personalCombatDuration(duel, roundMs)` returns milliseconds for the recorded
rounds at the supplied Game Speed. `personalCombatFrame(duel, elapsed,
roundMs)` returns `{round, pose, strength}`. Strength updates once per
`roundMs`; the four poses loop with each pose lasting `VISUAL_INTERVAL`
(3000 ms). The final recorded result ends playback immediately, including
mid-pose. Evidence: `tests/personal-combat-tests.mjs`, timing cases.

The native timing remains recorded in the witness file. The requested
presentation uses the independent clocks above. Evidence: native
250F8/250AE, 29396 and 581E, recorded `delays` arrays; the user's October 15
visual-interval correction.

Use the frame and duration helpers for playback. Do not call the resolver
again while animating: doing so would consume new campaign randomness.
Sound-enabled DOS hardware timing and the full native graphics introduction
are outside the bounded timing witness; see the [validation note][note].

[note]: ../docs/personal-combat.md
