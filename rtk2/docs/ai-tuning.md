# AI tuning

The AI uses deterministic policies and the campaign random generator, rather than a trained model. Edit `config/ai-config.json`, then reload the game. Unspecified values use defaults; invalid or unknown settings are rejected. Old saves use the currently loaded configuration. Game Speed controls scheduling; Message Speed controls how long reports remain visible and delays AI while messages are queued.

| File | Responsibility |
|---|---|
| `mjs/ai-battle.mjs` | Terrain-aware routes, palace defence, attacks, safe fire, jungle and river-bank positioning, challenges and reinforcement decisions. |
| `mjs/ai-governance.mjs` | Monthly province orders, hiring, equipment, training, development and invasion selection. |
| `mjs/ai-politics.mjs` | Diplomatic and political choices. |
| `config/ai-config.json` | Main thresholds, probabilities and spending limits. |
| `mjs/ai-parameters.mjs` | Defaults and validation. |
| `mjs/strategy.mjs` | Turn scheduling and legal order execution; `mjs/battle.mjs` retains combat rules. |

Battle parameters include smart/expert intelligence thresholds, safe duel WAR margin, outnumbered power ratio, minimum fire intelligence, reinforcement and charge ratios, terrain search radius, jungle/bank weights and bounded ambush waiting. Governance parameters cover maximum invading generals, war strength and food thresholds, loyalty, hiring and equipment/training targets, development spending and political/diplomatic probabilities. Chances range from 0 to 1; day/radius/count settings require positive integers. Defaults include the v31 route-aware defence policy.

Change a small group at a time and run `npm test` plus `npm run test:ui` from the game folder. The v20 long campaign and v21/v22 tactical cases test mountain routing, repeated battles, palace guards, safe fire and bounded waiting. Configuration changes must not bypass legal orders or combat outcomes. The original DOS zero-food defeat rule remains independent of tuning. Native AI equations have not been recovered.

## V24 provisioning and hidden battle tuning

`governance.warProvisionDays` defaults to 75 and must be a positive integer. Invasion food is based on actual selected soldiers: native daily rations are `max(1, floor(men / 30))`. AI requires 30 days plus one rice, targets 75 days plus one and at least `minimumCarriedFood`, capped by available source stock. AI allies use the same helper in `mjs/war-provisions.mjs`. Defending province reserves also consume food.

`mjs/auto-battle.mjs` is the separate hidden-battle equation resolver, with six exchanges and native abstract ration accounting. Combat coefficients there remain explicit remaster approximations. `mjs/ai-battle.mjs` controls watched tactical battles; it is not invoked for hidden battles.

## V31 route-aware jungle interception

Edit `mjs/ai-battle.mjs` for the policy, or `battle.routeAmbushWeight` in `config/ai-config.json` (default **12**) for its emphasis. The main functions are:

| Function | Role |
| --- | --- |
| `projectedAttackRoutes(b, enemies)` | Dijkstra forecasts from each visible invading unit to the palace, using terrain mobility costs, fire exclusions and a traffic penalty. It does not stop after today's movement budget. |
| `ambushLaneScore(cell, routes)` | Weights exact route cells and adjacent ambush positions by expected passing soldiers; the attacking commander's route has extra weight. |
| `tacticalPosition(b, unit, enemies, moves, weak, tuning)` | Rejects off-route defender forests, scores likely interception cover, then plans a legal route to a worthwhile forest anywhere on the field. It advances the affordable prefix or waits to bank mobility. |
| `palaceGuard(b)` | Keeps one defender responsible for the palace; that unit does not leave to seek jungle cover. |

For a northern entry and southern palace, the projected north-to-south paths give the middle forest a higher score than a western forest no attacker is expected to pass. Water still costs five and mountains remain impassable. Existing contact/occupancy rules constrain the defender's actual route. A forest already containing an ally is unavailable, and hidden attackers are excluded from prediction. Increasing routeAmbushWeight strengthens lane selection but cannot override a blocked route or permit an illegal movement.

`tests/v31-tests.mjs` includes the middle-versus-off-route forest fixture. The v20/v21/v22 cases still cover mountain detours, consecutive battles, palace guards, safe fire and waiting behavior. These are heuristic forecasts, not a recovered original AI equation.
