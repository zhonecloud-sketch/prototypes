# Changing the AI: a beginner's guide

## What “AI” means in this game

Legacy AI is ordinary JavaScript choosing actions from game state. V44 also supports optional policies whose numerical priorities can be trained offline; see [the training manual](ai-training-manual.md). Legacy remains the default. Neither policy uses a language-model prompt. Governance AI chooses province orders; battlefield AI chooses a unit's next action. The game engine decides whether an action is legal and applies its effects.

Think of three layers:

| Layer | Example | Where to start |
| --- | --- | --- |
| Settings | “Seek training below 85 instead of 70.” | `config/ai-config.json` |
| Decision logic, also called policy | “Prefer an interception jungle over a river bank.” | `mjs/ai-governance.mjs`, `mjs/ai-politics.mjs`, `mjs/ai-battle.mjs` |
| Game rules | “How many soldiers does an ambush kill?” | `mjs/battle.mjs`, `mjs/native-combat.mjs`, province order modules |

For a strategy improvement, start in the first two layers. Changing a damage equation changes the rules for everyone; it is a separate fidelity task requiring original-game evidence. Advisor behavior is also separate from AI strategy.

## A few words used in the code

| Term | Plain meaning |
| --- | --- |
| Module / `.mjs` file | One JavaScript file that can share functions with other files. |
| Function | A named operation, such as `aiGovernance(g)`. |
| State | The current campaign or battle data. `g.s` is campaign state; `b` commonly means its active battle. |
| `g` / `game` | The game object, which provides legal actions such as `execute`. |
| `p`, `o`, `u` | Usually a province, officer and battlefield unit. |
| `q`, `r` | A hex's column and row, starting at zero. A terrain entry is `b.terrain[r * 13 + q]`. |
| Threshold | A boundary used in a comparison, such as training below 70. |
| Score | A number used to compare candidate actions or positions. Higher can mean more desirable. |
| Regression test | A repeatable check that catches a previously working behavior breaking. |
| Seed | The saved starting point for reproducible random choices. |

Some current functions are compressed into long lines. Use your editor's search and word wrapping to find the named function or condition. Avoid reformatting unrelated modules while changing behavior; that makes the real change harder to review.

## Where AI steps start

`mjs/app.mjs` loads and validates `config/ai-config.json` at startup. Its timer calls `game.aiStep()` in `mjs/strategy.mjs`. That method pauses for required human decisions and dispatches the next action:

| Situation | Code used |
| --- | --- |
| Human response, result review or other required decision is pending | `aiStep()` pauses or handles the relevant decision flow. |
| Governance turn belongs to an AI ruler | `runAIExtension(game, 'governance')` selects Legacy `aiGovernance(game)` or the optional trained planner. |
| A detailed battle belongs to an AI-controlled side | `runAIExtension(game, 'battlefield')` selects Legacy `aiBattle` or the optional trained planner. |
| A battle is outside the selected detailed view | `resolveAbstractBattle(game, b)` in `auto-battle.mjs`. |

**Changing tactical AI does not change unwatched battles.** For tactical experiments, select the game's battle-view option for all battles. `game.s.settings.battleView = 'all'` is the equivalent in a test fixture.

`game.s.player` is the faction whose turn is running; it does not always mean a human player. `game.isHuman()` checks that distinction.

## Inspect routes and jungle scores with HUD (v39)

Set Menu → Battle view to **All battles**, complete placement, then open **HUD → AI**. The **Planned path** and **Jungle scores** buttons toggle independently and use the same centered command dimensions as the other HUD actions. Choose **Next AI unit** for the current side's next eligible unit, or select a named unit to keep inspecting it.

- **Planned path:** cyan shows the inspected route; its dashed portion exceeds the current movement budget. The HUD reports total route cost. A holding guard or adjacent attack is described instead of displaying a misleading movement promise. This is a policy preview; challenges, fire and other orders can take priority.
- **Jungle scores:** forest hexes show the actual weighted `ambushLaneScore` between 0.00 and 1.00. Dotted gold lines are the visible attackers' forecast approaches to the palace. A gold outline marks preferred cover when the tactical-position policy has a cover goal. `×` marks an occupied or burning forest.
- **One AI action:** advances one real action and refreshes the overlays. The HUD closes automatically; AI stays paused. Reopen HUD to step or change the inspected unit. **Resume AI** clears both overlays and resumes normal playback.

The lane number measures route proximity, not an ambush probability or the entire tactical position score. Other terrain/risk/distance terms affect the chosen cover; native forward-hex geometry and INT ≥90 immunity still determine an actual ambush. The overlays do not issue orders, consume RNG or become part of a save. They are unavailable during placement, results and unwatched battles.

## First experiment: change a setting

Suppose the AI should train its armies further before considering them sufficiently trained.

1. Open `config/ai-config.json`.
2. Find `trainingTarget` in the `governance` section.
3. Change its value from `70` to `85`.

The single line becomes:

```json
"trainingTarget": 85
```

This is one line inside the existing file, not a complete replacement file. JSON requires double quotes and commas between entries. It does not allow comments or a comma after the final entry.

4. Save, then fully reload the game page; settings are loaded at startup. A loaded old save uses the current policy configuration.
5. Observe an AI province with an available officer and soldiers. The training order becomes eligible below 85; the original priority sequence can still choose another order first.
6. From `dist/rtk2`, run the focused checks, then both full suites before keeping the change:

```sh
node tests/v33-tests.mjs
npm test
npm run test:ui
```

The actual training gain remains unchanged. Its equation is in the rule layer, not `trainingTarget`.

Other useful first experiments:

| Goal | Setting | Example and effect |
| --- | --- | --- |
| Smart AI should demand a larger advantage before invading | `governance.attackStrengthRatio` | `1.25` → `1.4`; requires estimated strength greater than 1.4 times the chosen defender's strength. |
| Increase emphasis on predicted interception lanes | `battle.routeAmbushWeight` | `12` → `18`; increases the route term in terrain scoring. It does not change ambush damage or geometry. |
| AI should carry a larger planned war food reserve | `governance.warProvisionDays` | `75` → `90`; requests a larger food target, capped by source stock. |
| Reduce attempted politics | `governance.politicsChance` | `0.12` → `0.06`; lowers the probability of entering that policy when its other conditions are met. |

These are illustrative choices, not balance recommendations or changes made in this cleanup.

### Two kinds of intelligence

HUD → AI sets global or per-ruler **AI intelligence** and **aggression**, each 0–100. `game.aiFor()` merges global values with ruler overrides. AI intelligence selects smarter decision branches; aggression affects invasion attempts. An aggression value of zero stops this policy from initiating invasions.

An officer or battlefield unit also has an `int` attribute. It can affect game rules and action eligibility, such as fire and native ambush immunity. Raising the HUD's AI intelligence does not raise an officer's INT. The `smartIntelligence` and `expertIntelligence` configuration thresholds compare against the controller's AI intelligence.

## Governance: changing which order is chosen

Start at **`mjs/ai-governance.mjs` → `aiGovernance(g)`**. One call normally performs one successful action or marks an officer finished; repeated scheduler steps complete the faction turn.

The current sequence is:

1. Find provinces owned by the active faction and officers for whom `g.ready(p, id)` succeeds.
2. Prefer a high-INT available officer for smart AI; less intelligent AI chooses randomly.
3. Consider the existing marriage, politics, diplomacy and invasion branches.
4. If none acts, choose a local order policy from the governor's ambition and try its groups in native order.
5. Each candidate order's `attempt(order)` checks its conditions and calls `g.execute(...)`.
6. If no candidate succeeds, finish the selected officer's action. When no province has an available officer, finish the faction turn.

### Which file to edit

| Desired change | File / search term |
| --- | --- |
| Available officer choice, invasion target or local order eligibility | `ai-governance.mjs`, `aiGovernance`, `attempt` |
| Political proposals, recruitment interference or envoy choice | `ai-politics.mjs`, `aiPolitics` |
| Existing local group sequence, randomized start and retry counts | `native-governance-priority.mjs`, `NATIVE_POLICIES`, `NATIVE_GROUPS`, `runNativePriority` |
| Invasion food planning | `war-provisions.mjs`, `invasionFoodPlan` |
| Order cost, success equation or validation | `engine.mjs`, `province-rules.mjs`, `fidelity-orders.mjs`, depending on the order |
| End-of-month delegated province work | `campaign-completion.mjs`, `runDelegated`; not the same path as `aiGovernance` |

The native priority file contains recovered original-game tables. Strategic invasion/diplomacy decisions and some eligibility checks around those tables remain remaster policies. Changing the tables means departing from verified priority behavior; record that explicitly in `differences.md` if you decide to do it.

### Read a real condition

The current training branch includes:

```js
if (!o.soldiers || o.training >= tuning.trainingTarget) return false;
g.execute('trainArmy', args);
```

This means “skip this candidate if the officer has no soldiers or has reached the target; otherwise ask the game to train.” `false` lets the priority dispatcher try another order. A successful attempt returns `true` after the legal action.

To add a preference, change the candidate's eligibility or selection here, then continue using `g.execute`. Do not write `o.training += 10` in the policy: that bypasses the training equation, costs, action limits and reporting.

For development orders, the current policy calculates spending with `Math.min(100, Math.floor(Math.sqrt(p.gold) / 2))`. **`governance.developmentGold` is still accepted by the config validator but is unused in v38.** Editing it will not alter spending. Wire a new policy to it explicitly only if you decide to change that behavior; do not assume every accepted setting affects the game.

### Catching mistakes in governance logic

Several candidate branches catch rejected orders and move on. A new invalid order can therefore look like “the AI never chooses it” rather than showing an error. Check available officers, money/food, targets and `g.execute` arguments first. During an isolated debug session, inspect the caught error with your debugger; remove temporary logging before committing.

Do not consume extra random numbers just to print information. That changes subsequent choices. Use the campaign's `g.random()` or `g.int(...)` for policy randomness, rather than `Math.random()`, so saves and seeded tests remain reproducible.

## Battlefield: changing the next tactical action

Start at **`mjs/ai-battle.mjs` → `aiBattle(game, intelligence)`**. It selects a legal action and sends it to `act(game, action, args)` in `mjs/battle.mjs`.

Branch order matters: an earlier branch that returns prevents later branches from running. The current policy handles challenges and deployment first, then selects an unordered living unit. It considers fire escape first, then unfavorable jungle contact, an opening duel, safe fire, adjacent attacks, reinforcement, palace holding, terrain positioning, route movement and finally Wait.

Smart units generally act in descending WAR order. Less intelligent non-guard units may choose a random reachable cell. A designated palace guard normally holds the palace and attacks from it. Fire escape takes priority over that holding rule; raising the jungle weight alone does not make the guard leave.

| Function | What it decides |
| --- | --- |
| `fireEscapeOrder(b, u, enemies)` | Escape burning ground, prefer palace-related dry ground, or target a weak adjacent commander. |
| `palaceGuard(b)` | Which defender protects the palace. |
| `aiAttackTarget(b, u, adjacent)` | Which adjacent enemy to attack, including decisive commander and palace priorities. |
| `safeFireTarget(b, u, enemies)` | Whether a fire target avoids friendly units and the defending palace. |
| `projectedAttackRoutes(b, enemies)` | Likely terrain-cost routes from visible attackers to the palace. |
| `ambushLaneScore(cell, routes)` | A forest/bank's proximity to expected passing troops. |
| `tacticalPosition(b, u, enemies, moves, weak, tuning)` | A useful jungle/bank to move toward or whether to wait there. |
| `planBattleRoute(b, u, enemies, goals)` | A route across the full map; movement uses only the affordable legal part today. |

`reachable(b, u)` and `placementCells(...)` come from the rule layer. Use them to find allowed actions. Terrain codes include plain 0, jungle 1, hill 2, mountain 3, water 4, castle 5 and palace 6. Movement costs and native deployment zones are not policy weights.

### Improve ambush positioning without changing ambush rules

The current defender predicts routes and values jungles on or beside them. `ambushLaneScore` measures distance to route cells. It does **not** yet score the exact native forward ambush arc for each movement step.

A more precise experiment would be:

1. Keep the route prediction limited to visible attackers; do not read hidden units' intentions.
2. For each jungle candidate, walk each predicted route as consecutive `(from, to)` steps.
3. Ask `ambushCells(from, to)` from `battle.mjs` whether that jungle can ambush the step. Use this rule helper instead of inventing square adjacency.
4. Give more score to plausible routes carrying more soldiers. Account for targets with INT ≥90, which avoid native ambush loss.
5. Choose a legal reachable move toward the best useful jungle, or Wait if already well positioned. Retain the palace guard.
6. Reassess on the next legal defender activation. Do not move a defender during the opponent's phase just because an automatic ambush fired.

This is a documented proposal, not implemented by the cleanup. See [the ambush discussion](ai-ambush-proposal-v33.md) for the fuller policy.

Automatic ambush itself is in `battle.mjs` (`ambush`, `moveAlong`, `ambushCells`) and its arithmetic is in `native-combat.mjs` (`ambushExchange`). The native trigger checks three direction-dependent forward hexes, not every neighboring tile. It does not spend the ambusher's order or mobility; a subsequent move still must pass ordinary turn/order checks.

### Reinforcement, withdrawal and unwatched battles

Use `reinforcementOptions(...)` and `placementCells(...)` when choosing reinforcement. A policy setting cannot make an illegal extra contingent legal. The initial/main invading contingent and allied field capacity are enforced in the rule layer; read the current evidence and caveats in `differences.md`.

Voluntary Flee and compulsory withdrawal after defeat have different flows. `battle.mjs`, `native-combat.mjs` and `battle-withdrawal.mjs` apply their rules; `strategy.mjs` handles result review and settlement. The existing tactical `aiBattle` policy does not currently choose a voluntary Flee branch. Changing a flee threshold elsewhere will not add one.

`auto-battle.mjs` resolves unwatched battles without hex movement, tactical orders or jungle positioning. Its aggregate strength/casualty coefficients remain documented approximations. Test it separately if your goal includes unwatched battles; do not copy tactical ambush behavior into that resolver without deciding what an abstract battle should model.

## Visibility and attack versus Wait — v42

`visibleUnit(b, enemy, side)` is the shared visibility rule: jungle conceals an enemy until any friendly unit is next to it. An adjacent jungle enemy is therefore revealed to both the player and the AI. This game has no separate blind-attack order.

Route planning, reachable-cell previews, forest occupancy marks and attack-route forecasts now omit concealed enemies. Previously, occupied cells and enemy contact could leak hidden positions into planning. A planned movement can still encounter a hidden enemy: the actual movement stops when the enemy is revealed, and the existing ambush rule can apply. A preview is a plan based on current knowledge.

When all adjacent enemies are in jungle, a unit in water waits and banks mobility because water gives worse protection. A unit on plain, jungle, hill, castle or palace ground can attack from equal or better cover. This is the requested terrain preference, not a prediction that the attack will win: soldier count, WAR, training and weapons still determine casualties. Fire escape takes priority.

The AI still reads the attributes of visible enemies when choosing duels, tactics and targets; it does not pay the human enemy-inspection fee. Removing hidden-position leaks does not make those information rules identical. HUD is an inspection/cheat tool and its unit picker can inspect either army.

To check the new behavior, place a visible enemy in adjacent jungle, compare a water unit with a hill unit, and use HUD → AI → One AI action. Inspect Wait/mobility or the attack report. Moving the concealed enemy between distant jungle cells should leave the planned route unchanged. `node tests/v42-tests.mjs` covers those cases and the recovered fire priorities. See [fire evidence](native-fire-v42.md) for exactly what was recovered from `main.exe`.

## Turns, fire and movement — v43

An **order** is one unit's action. An **army turn** is all that army's orders. A **battle day** includes both armies. These are different checkpoints.

`battle.mjs` owns the rules. A successful fireball on a unit applies immediate damage below 5%. `burnUnit` checks the acting unit after its order and applies damage below 30% if it is still burning. Both human and AI call this code. An AI often acts as soon as control changes; a human must issue an order, so looking only at the handoff can suggest unequal damage. View has no order cost or fire check. End turn makes unused units Wait. Rain extinguishes fire before the next day-end spread.

`reachable(b, unit)` returns each legal destination, its **total MP cost** and its path. Five MP can pay for a plain tile (2) followed by jungle (3), unless contact, occupancy or another restriction stops the route. The map displays these costs for a human's active unit. Tap a tile to see terrain details; a reachable tile still executes the selected Move order.

`nextAIUnit` in `ai-battle.mjs` is the shared choice for the AI action, automatic HUD preview and active-unit display. If you change actor priority, change it here so the highlight stays truthful. Display-only attack cycles are in `battle-presentation.mjs`: five for Normal/Simultaneous, ten for Charge. Never put damage or random rolls into animation frames.

Original deployment does more than pick the nearest palace tile. The remaster's current placement branch is still simplified; read [the recovered priorities and boundaries](native-turns-v43.md) before describing a new deployment policy as original-game behavior. `node tests/v43-tests.mjs` checks fire timing, mobility, deployment reset, AI actor consistency, participant order costs and five-captive settlement.

## Verify that your change does what you intended

First define an observable outcome: “a defender chooses the middle jungle on the north-to-south route” is more useful than “the defender is smarter.”

| Change | Focused existing checks, run from `dist/rtk2` |
| --- | --- |
| Governance groups, native Train/Give, advisor preservation | `node tests/v33-tests.mjs` |
| Diplomacy and proposal responses | `node tests/decisions-tests.mjs` and `node tests/v31-tests.mjs` |
| Long campaign and movement routing | `node tests/strategy-tests.mjs` and `node tests/v20-tests.mjs` |
| Palace holding, safe fire and bounded waiting | `node tests/v21-tests.mjs` and `node tests/v22-tests.mjs` |
| Interception forest selection | `node tests/v31-tests.mjs` |
| Combat legality and native arithmetic | `node tests/battle-tests.mjs`, `node tests/v32-tests.mjs`, `node tests/v33-tests.mjs` |
| Retreat after defeat and save/load | `node tests/v34-tests.mjs` |
| AI reporting and completed-round retention | `node tests/v38-tests.mjs` |
| Unwatched resolution and provisions | `node tests/v24-tests.mjs` |

For a new behavior, add a small scenario-based check to the relevant test file: arrange a specific map/state, run one AI step, assert its legal action or outcome, and validate the save when appropriate. Existing `arena()` helpers in tactical tests are useful examples. Use fixed seeds to compare strategies, and several scenarios for balance judgments.

Then run `npm test` and `npm run test:ui`. Review changes with `git diff`; update `differences.md` if native behavior was intentionally changed. Keep publication and package generation as explicit later steps.

## Common reasons a change appears ineffective

| Symptom | Check |
| --- | --- |
| The new config value has no visible effect | Fully reload; confirm the key is used, that the intelligence branch applies, and that the relevant order/position is eligible. |
| Jungle tuning has no effect on an AI battle | Make sure it is watched/detailed, not resolved by `auto-battle.mjs`. |
| No AI action occurs | Check a human proposal, monthly review, result, captive or ally decision is not blocking progress. HUD single-step reports when a human action is required. |
| The defender refuses to leave the palace | It may be the designated holding guard. |
| A unit cannot reach the chosen jungle today | Whole-map prediction and today's mobility are different. Use an affordable legal route prefix or Wait. |
| A new order is silently skipped | Inspect its eligibility and caught validation error; do not bypass the engine. |
| Changing priorities breaks an evidence check | Determine whether you accidentally altered a recovered native rule. Do not rewrite the expected result merely to get a green test. |

The advisor modules `monthly-advice.mjs`, `advice-topics.mjs` and `order-availability.mjs` are not strategy-tuning targets. Preserve the advisor mechanism while experimenting with AI decisions.
