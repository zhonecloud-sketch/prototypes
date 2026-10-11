# V44 AI training evaluation

11 October 2026. These are experimental examples, not promoted replacements. Legacy remains the game's default.

Both examples use one generation and two mutated candidates per generation, plus the initial candidate. Training retains the candidate with the best fixed outcome objective on its training set. Its holdout is evaluated afterward and never used to select weights. Both modes cover the six scenario families; generated governance cases control their first active ruler, while each battlefield position is tested in both roles against Legacy.

| Holdout measurement | Governance example | Battlefield example |
| --- | --- | --- |
| Independent starting seeds | 6 | 6 |
| Episodes | 6 two-month campaign segments | 12 battles, paired attacker/defender roles |
| Trained mean fixed objective | 30.059 | 4.687 |
| Legacy mean fixed objective | 2.450 | 5.000 |
| Trained minus Legacy | +27.609 | −0.313 |
| Battle wins / losses / draws | Not the governance objective | Trained: 1 / 2 / 9; Legacy: 1 / 1 / 10 |
| Battle score rate, draw = half | Not applicable | Trained: 45.8%; Legacy: 50.0% |
| General superiority established? | No | No; this small holdout favors Legacy |

The two domains use different objectives and scales; their numerical scores cannot be compared with each other. No mean confidence interval is reported with only six independent seeds. Paired battle roles share a position, so the report does not pretend there are twelve independent cases or present an ordinary per-match win-rate interval.

The governance training-set difference was +37.661. Its holdout improved on average, but one of the six cases worsened by 20.876 points. A separate fresh-seed, one-month CLI smoke comparison also worsened by 5.570 points. That smoke test verifies the benchmark workflow; a single case with a different horizon is not a strength estimate. Together these observations argue for testing more positions and horizons before enabling the policy broadly.

The battlefield training-set difference was −0.305 and its holdout difference was −0.313. The optimizer did not find a candidate stronger than Legacy in this bounded run. Nine draws suggest the generated cases need more varied, curated positions with actual contact, palace danger, fire and resource pressure. Do not increase search rounds and assume that alone will fix the evaluation coverage.

On this container, governance holdout mean decision times by episode ranged from about 97–200 ms for the trained policy and 0.7–1.9 ms for Legacy. Battlefield averaged about 38 ms per trained decision and 0.1 ms for Legacy across the holdout episodes. These are headless development measurements, not phone performance. Copied-state lookahead costs substantially more than the existing heuristics; shadow comparison adds that cost even when Legacy executes.

The full runs took about 344 seconds for governance and 430 seconds for battlefield. Reproduction can differ in elapsed time and floating-point timing fields. Outcomes, seeds and weights should reproduce with unchanged source and configuration.

## Reproduce these examples

From `dist/rtk2/`, choose new output directories:

```sh
node tools/train-ai.mjs --domain governance --seed 3001 --holdout-seed 900001 --generations 1 --population 2 --episodes 6 --holdout-episodes 6 --months 2 --out training/reproduce-v44-governance
node tools/train-ai.mjs --domain battlefield --seed 4001 --holdout-seed 950001 --generations 1 --population 2 --episodes 6 --holdout-episodes 6 --out training/reproduce-v44-battlefield
```

The release copies give the profiles an “Experimental” display name. Their weights, IDs and holdout metrics are unchanged. The release reports include the matching rules fingerprint and profile ID for provenance.

- [Governance profile](../config/ai-profiles/governance-v44.json)
- [Battlefield profile](../config/ai-profiles/battlefield-v44.json)
- [Full governance results](ai-training-v44-governance.json)
- [Full battlefield results](ai-training-v44-battlefield.json)
- [Fresh-seed CLI smoke checks](ai-training-v44-smoke.json)

## Verification and limits

Warm-start CLI testing also successfully retrained an obsolete-rules profile into a current compatible profile. Both governance and battlefield benchmark commands completed against fresh seeds.

The gameplay regression suite and fourteen AI-extension regression groups passed. They cover Legacy dispatch/state equivalence, no automatic activation, independent global/ruler choices, bounded imports, outdated-rules save fallback, no live RNG/order consumption during previews, food shortage response, joint officer/order selection, immediate palace victory, hidden-position/action-coordinate invariance, engine-only execution and paired-role uncertainty reporting.

Mounted HUD/raster checks cover profile loading, Legacy defaults, policy inheritance, stale-file rejection, read-only comparison and existing button dimensions alongside the earlier battle controls. This environment cannot verify a physical browser or handset; device performance and visual layout remain to be checked there. The manual is available as [readable HTML](ai-training-manual.html) and [Markdown](ai-training-manual.md).

These are simulated game outcomes against one opponent policy. They do not establish original-executable AI parity, long campaign strength, performance against human play, or a learned strategy for every order. Deployment, pending challenges and unsupported planner situations retain Legacy handling. Training and import do not change the underlying game rules.
