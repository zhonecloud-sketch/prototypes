# AI settings reference

Start with [the beginner guide](ai-editing-guide.md) for examples and the distinction between decisions and rules. This reference describes the **current v39 consumers**, not recovered original strategy equations.

Edit `config/ai-config.json`, then fully reload. `mjs/ai-parameters.mjs` holds matching defaults and `validateAIConfig`. Missing values use defaults; unknown keys, nonnumeric values and values outside 0–100000 are rejected. Names ending in `Chance` must be 0–1. The count/day/radius keys matched by the validator require positive integers, and `maxInvaders` cannot exceed five. Follow the meaning of each setting, not only the broad numeric validation range.

Loaded saves use the configuration loaded at startup. HUD AI intelligence/aggression are separate global/per-ruler values saved with the campaign. Game Speed schedules actions; Message Speed controls playback pauses. Neither changes combat equations.

## Governance settings

| Key under `governance` | Default | Current use |
| --- | --- | --- |
| `smartIntelligence` | 50 | Controller intelligence needed for high-INT officer selection and smarter invasion/diplomacy branches. |
| `maxInvaders` | 5 | Upper limit on selected initial invaders, also constrained by available officers and the retained governor. |
| `courtMarriageChance` | 0.02 | Chance to consider the expanded-family court-marriage branch when eligible. |
| `diplomacyChance` | 0.07 | Chance for the smart ruler's additional diplomacy branch when eligible. |
| `attackStrengthRatio` | 1.25 | Smart AI requires estimated invading strength above this multiple of the chosen defender's strength. |
| `basicAttackStrengthRatio` | 0.65 | Corresponding threshold for less intelligent AI. |
| `minimumWarFood` | 5000 | Source stock must exceed this for invasion; also gates relief. Actual carried-food legality is checked separately. |
| `minimumCarriedFood` | 6000 | Minimum desired carried-food target, capped by available source stock. |
| `warProvisionDays` | 75 | Desired duration of carried supplies; must be a positive integer. |
| `loyaltyTarget` | 65 | Consider relief below this popular-loyalty level. |
| `reliefAmount` | 3000 | Relief food amount, capped by stock. |
| `recruitTargetMen` | 4000 | Selected officer's recruiting/reassignment target. |
| `hireHundreds` | 10 | Maximum groups of 100 recruits considered by the hiring branch. |
| `weaponsCoverageTarget` | 0.8 | Consider buying arms below this weapons-to-soldiers ratio when a merchant is present. |
| `trainingTarget` | 70 | Consider Train when the selected officer's troops are below this training. |
| `developmentGold` | 100 | **Unused by current v39 policy**, despite being accepted. Spending is calculated in `ai-governance.mjs`. |
| `politicsChance` | 0.12 | Chance to enter the political-action selector when its other gates pass. |
| `politicsMinimumIntelligence` | 40 | Minimum controller intelligence for that selector. |
| `battleAllyChance` | 0.05 | Chance to ask an eligible ally during the detailed defender-side battle step in `strategy.mjs`. |

`ai-governance.mjs` chooses province/officer candidates, considers strategic branches, and then calls the original local dispatch tables in `native-governance-priority.mjs`. `ai-politics.mjs` chooses diplomatic/covert actions. Both use validated game orders. The priority tables are recovered native behavior; the surrounding strategic choices and some eligibility adapters remain remaster policies.

`war-provisions.mjs` uses daily rations `max(1, floor(men / 30))`. Invasion planning requires at least 30 days plus one rice, targets `warProvisionDays` plus one and `minimumCarriedFood`, and caps carried stock at availability. Defending reserves also consume food. Changing this target does not change ration or defeat equations.

## Detailed battlefield settings

| Key under `battle` | Default | Current use |
| --- | --- | --- |
| `smartIntelligence` | 50 | Controller intelligence threshold for WAR ordering, simultaneous attacks and tactical positioning. |
| `expertIntelligence` | 75 | Threshold for opening challenges, safe fire, charge and reinforcement consideration. |
| `safeDuelWarMargin` | 20 | Required WAR advantage in challenge selection/acceptance comparisons. |
| `outnumberedPowerRatio` | 0.85 | Army is considered weak when own estimated power is below visible enemy power times this value. |
| `fireMinimumIntelligence` | 60 | Minimum acting **unit INT** for the expert fire branch. |
| `reinforceMenRatio` | 0.7 | Reinforcement consideration when own men are below visible hostile men times this value. |
| `chargeMenRatio` | 1.5 | Troop advantage required by the expert charge branch; other commander/weakness conditions still apply. |
| `reinforceFood` | 5000 | Maximum food considered for that reinforcement order, further capped by source and storage. |
| `ambushAdvanceEveryDays` | 3 | Attacker's bounded terrain-wait rhythm; defenders may hold useful cover. |
| `terrainSearchRadius` | 4 | Local terrain-search distance; route-relevant defender cover can be considered farther away. |
| `jungleWeight` | 7 | Base preference score for relevant jungle cover. |
| `riverBankWeight` | 6 | Base preference score for relevant dry river-bank positions. |
| `routeAmbushWeight` | 12 | Extra defender score for terrain near predicted attacker lanes. |

Main policy: `mjs/ai-battle.mjs`. Its `projectedAttackRoutes` forecasts terrain-cost paths to the palace from visible attackers. `ambushLaneScore` weights proximity by expected passing troops, with extra commander weight. `tacticalPosition` chooses useful cover and can plan toward a jungle beyond today's movement budget. `planBattleRoute` follows passable, legal routes; one palace guard retains the defensive objective.

The route-lane heuristic does not yet score every movement step's exact native ambush arc. The stronger proposal in [changes.md#record-ai-ambush-proposal-v33](changes.md#record-ai-ambush-proposal-v33) remains discussion. Native automatic ambush is independently enforced by `battle.mjs` and `native-combat.mjs`.

## Unwatched battles

`mjs/auto-battle.mjs` is separate. It runs up to six aggregate exchanges with native abstract ration accounting; its strength/casualty coefficients remain explicit approximations. It does not call `ai-battle.mjs`, so the tactical settings above do not alter its jungle placement or routes.

## HUD inspection (v39)

HUD → AI has independent **Planned path** and **Jungle scores** toggles plus an inspected-unit selector. Route previews show the affordable prefix; forests show the real lane score (0–1), and visible-attacker forecasts are dotted gold. Inspection is read-only and pauses with the existing HUD. Close HUD to see the full field; One AI action refreshes it and Resume AI clears it. See [the beginner guide](ai-editing-guide.md#inspect-routes-and-jungle-scores-with-hud-v39) for usage and interpretation.

## Verify edits

Run from `dist/rtk2`: `npm test` and `npm run test:ui`, with focused checks chosen from the beginner guide. Tests for v20–v22 cover routing, palace guards, safe fire and waiting; v31 covers route-aware forest selection; v33 covers native local priority tables; v38 protects AI event reporting. Configuration changes must still pass legal order validation and must preserve combat outcomes' rule path and advisor behavior.
