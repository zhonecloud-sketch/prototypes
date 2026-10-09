# Defending AI ambush proposal — discussion only

No new battle AI policy is implemented in v33. The current policy remains in `mjs/ai-battle.mjs`; its knobs remain in `mjs/ai-parameters.mjs` and `config/ai-config.json`. Native automatic ambush is a rule in `mjs/battle.mjs`, independent of the tactical policy.

1. Predict several plausible attacker routes to the palace using the existing terrain-aware pathfinder. Mountains are impassable; water costs five; occupied cells and fire constrain the route. Consider routes around blockers rather than one shortest geometric line. Use visible enemy positions; do not read hidden enemy intentions.
2. For each jungle hex, score predicted movement steps `(from, to)` where that jungle occurs in `ambushCells(from, to)`. The native rule tests three forward hexes on entering a tile. Simply standing beside any route tile is insufficient. Weight routes by plausibility, expected losses, attacker strength and palace risk; INT ≥90 targets receive no ambush loss.
3. If already in a useful jungle, Wait. Otherwise choose the nearest reachable **useful** jungle, rather than the nearest jungle regardless of route. Keep the palace guard in place unless another officer can maintain the defence.
4. After an ambush, recalculate on the next legal defender activation. Ambush itself spends no order or mobility, but movement still needs an unused daily order and enough mobility. Do not grant a free move during the enemy's phase. Moving again into hostile adjacency may stop movement or expose the unit.
5. Reposition to a second interception jungle only if its predicted benefit exceeds staying, it is reachable without unsafe water/fire exposure, and the palace remains protected. Otherwise hold, attack a nearby threat, or retreat normally.

An expected-loss score can compare jungle candidates using the verified ambush equation averaged over its finite random rolls. The AI's route beliefs, risk weights and reposition policy are remaster strategy choices, not recovered original-game equations. Tuning should stay in the dedicated AI module/config; rule arithmetic and the advisor system should remain separate.

Suggested validation: north-to-south advance through the middle jungle; a mountain detour; equal routes on either side of a river; an INT-90 attacker; an occupied interception jungle; and an exhausted defender that ambushes but must wait until the next activation to reposition.
