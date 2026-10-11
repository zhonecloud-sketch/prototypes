# Governance conquest training · v45

11 October 2026 · Experimental profile · Legacy remains the default

The trainer now works backward from **sole ownership of all 41 provinces**: Finish, then Expand, then original Opening positions. Conquest success takes priority over completion time; capped supporting measurements reward sufficient commanders, combat strength, food, gold, production and loyalty. Actual losses and shortages reduce unfinished scores. Detailed battlefield decisions are disabled throughout training and evaluation.

This first bounded experiment won **5/6 synthetic Finish cases**, compared with 1/6 for Legacy and 5/6 for the preserved v44 profile. Mean time among those wins was 2.80 campaign months, versus 3.20 for v44. The new profile won **0/6 Expand cases and 0/6 original Opening cases** within the six-month deadline. These results do not establish reliable conquest from an original opening or faster training than the previous objective.

[Download the experimental governance profile](../config/ai-profiles/governance-conquest-v45.json) · [Full machine-readable report](ai-training-v45-governance.json) · [Training manual](ai-training-manual.html) · [Preserved v44 profile](../config/ai-profiles/governance-v44.json)

## Independent evaluation

There are **18 starting cases**, six per stage, each evaluated with three fixed policies: **54 campaign runs**. These are paired comparisons on the same starts, not 54 independent cases. The six cases per stage cover all six original scenario families and existing variations. All opponents use Legacy. No weights change during this evaluation.

| Start | Policy | Wins / 6 | Eliminated | Unfinished | Win months | Capped months | Final provinces | Shortage province-months |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Finish · synthetic, 38 owned | Conquest v45 | 5/6 | 0 | 1 | 2.80 | 3.50 | 40.67 | 16 |
| Finish · synthetic, 38 owned | Legacy | 1/6 | 0 | 5 | 4.00 | 6.50 | 38.67 | 89 |
| Finish · synthetic, 38 owned | Governance v44 | 5/6 | 0 | 1 | 3.20 | 3.83 | 40.50 | 21 |
| Expand · synthetic, 24 owned | Conquest v45 | 0/6 | 0 | 6 | — | 7.00 | 24.33 | 78 |
| Expand · synthetic, 24 owned | Legacy | 0/6 | 0 | 6 | — | 7.00 | 23.00 | 85 |
| Expand · synthetic, 24 owned | Governance v44 | 0/6 | 0 | 6 | — | 7.00 | 25.17 | 80 |
| Opening · original scenarios | Conquest v45 | 0/6 | 0 | 6 | — | 7.00 | 17.33 | 129 |
| Opening · original scenarios | Legacy | 0/6 | 2 | 4 | — | 7.00 | 8.17 | 131 |
| Opening · original scenarios | Governance v44 | 0/6 | 0 | 6 | — | 7.00 | 12.67 | 130 |

“Win months” averages only completed victories. “Capped months” assigns every failed or unfinished case seven months, one beyond this run's six-month deadline, so early defeat never looks fast. Victory during the starting campaign month counts as one month. Final provinces includes unfinished campaigns. Shortages count province-months with rice or wage shortages; one campaign month may contribute several affected provinces. There is no conquest time to report for a policy with zero wins in a stage.

Finish and Expand are synthetic legal positions. They reassign ownership and existing generals, place spare generals at two fronts, adjust supplies, include bottleneck variants, and disable historical scripts. They demonstrate behavior at those positions, not that the policy built those realms from an opening. The Opening cases preserve the existing original scenarios and shortage variants. The full report includes per-case initial holdings, losses, resources and results rather than only an aggregate score.

The new profile's late-game win count matched v44, with a modest speed improvement in this small sample. In Expand, v44 retained more provinces on average (25.17) than v45 (24.33). The result therefore does not justify automatically replacing v44. With six cases per stage and 18 overall, no mean confidence interval is presented. Fresh, longer opening campaigns are needed to assess general conquest performance.

## Training settings and reproducibility

The run started from the unchanged v44 governance weights. It used two practice cases per stage, three-month practice deadlines, two generations and three candidates per generation. Each stage retained its predecessors: 2, then 4, then 6 cumulative cases. Including each stage's initial evaluation, the search performed **84 practice episode evaluations**. Final evaluation used distinct seeds and six-month deadlines. The recorded run took 28.6 minutes on this shared runtime, including training and comparison.

Reproduce the settings from `dist/rtk2/`, choosing a new output directory:

```sh
node tools/train-governance.mjs --seed 11001 --holdout-seed 910001 --generations 2 --population 3 --episodes 2 --holdout-episodes 6 --months 3 --evaluation-months 6 --from config/ai-profiles/governance-v44.json --out training/governance-conquest-001
```

Practice covered two scenario families per stage; evaluation covered all six. The report records the seeds and engine fingerprint. The command uses the repository's original scenario files and checks the engine fingerprint before and after the run. Outcome measurements are reproducible with unchanged code; decision timing and total runtime depend on the machine. This is not an equal-budget comparison of backward training against the old training objective, so it does not prove improved training efficiency.

| Planner weight | Starting v44 | Conquest v45 |
| --- | --- | --- |
| territory | 2.4057 | 2.0203 |
| officers | 2.0000 | 2.0000 |
| army | 1.5000 | 1.5000 |
| land | 1.0000 | 1.0000 |
| flood | 0.6000 | 0.9276 |
| loyalty | 0.8000 | 0.6257 |
| gold | 0.6014 | 0.6403 |
| food | 2.0000 | 2.7824 |
| safety | 3.0000 | 5.1118 |

The objective rewards useful, supplied armies rather than unlimited stockpiling. The existing planner still considers its existing legal candidates with two-order lookahead. Changing the objective does not add friendly supply transfer orders, deeper planning or other unsupported candidates. This scope can limit expansion even when supporting weights improve.

## Governance-only battle resolution and validation

| Policy | Abstract battles | Immediate outcomes | Detailed orders | Mean governance decision |
| --- | --- | --- | --- | --- |
| Conquest v45 | 2467 | 19 | 0 | 68.16 ms |
| Legacy | 2592 | 9 | 0 | 1.43 ms |
| Governance v44 | 2867 | 4 | 0 | 62.44 ms |

Battle counts cover all factions. Immediate outcomes include zero-soldier garrisons defeated before a battle mode starts; the game may label those records “tactical,” but no detailed orders execute. The guard rejects actual detailed battle decisions. Invasions, casualties, capture, food costs and ownership changes still use the existing abstract game rules.

Mean decision time weights each measured decision equally and includes the acting faction's existing step work. The new profile took slightly longer per decision than v44 and much longer than Legacy. Faster conquest in campaign months does not mean faster computation. This is a runtime comparison here, not a browser or handset performance measurement. Tactical battle strength and real-device behavior were not evaluated.

**408 regression checks and 58 mounted interface checks passed.** Checks include unchanged engine compatibility and v44 profiles, valid repeatable curriculum states, exact original Opening construction, strict all-41 victory, elimination handling, capped resource guidance, disabled detailed orders and safe profile import. Engine rules, original campaigns and existing battlefield training were preserved.

## Try the profile

Before importing, select **Legacy for Governance globally and in any ruler overrides**. Then download the profile and choose **HUD → AI → Import profile**. Import preserves the selected policy; if Governance is already Trained, the new weights become active immediately. Inspect the profile, then choose Trained explicitly. Battlefield can remain Legacy. Use the same starting campaign when comparing with the preserved v44 profile; the HUD stores one imported profile per domain.

The experiment does not change active campaigns or player battle-view preferences. Legacy remains the default. Game download packaging remains deferred.
