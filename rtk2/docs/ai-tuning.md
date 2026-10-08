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

Battle parameters include smart/expert intelligence thresholds, safe duel WAR margin, outnumbered power ratio, minimum fire intelligence, reinforcement and charge ratios, terrain search radius, jungle/bank weights and bounded ambush waiting. Governance parameters cover maximum invading generals, war strength and food thresholds, loyalty, hiring and equipment/training targets, development spending and political/diplomatic probabilities. Chances range from 0 to 1; day/radius/count settings require positive integers. Defaults preserve the v22 policy.

Change a small group at a time and run `npm test` plus `npm run test:ui` from the game folder. The v20 long campaign and v21/v22 tactical cases test mountain routing, repeated battles, palace guards, safe fire and bounded waiting. Configuration changes must not bypass legal orders or combat outcomes. The original DOS zero-food defeat rule remains independent of tuning. Native AI equations have not been recovered.

## V24 provisioning and hidden battle tuning

`governance.warProvisionDays` defaults to 75 and must be a positive integer. Invasion food is based on actual selected soldiers: native daily rations are `max(1, floor(men / 30))`. AI requires 30 days plus one rice, targets 75 days plus one and at least `minimumCarriedFood`, capped by available source stock. AI allies use the same helper in `mjs/war-provisions.mjs`. Defending province reserves also consume food.

`mjs/auto-battle.mjs` is the separate hidden-battle equation resolver, with six exchanges and native abstract ration accounting. Combat coefficients there remain explicit remaster approximations. `mjs/ai-battle.mjs` controls watched tactical battles; it is not invoked for hidden battles.
