# Training the game AI

Training update 49 · 11 October 2026

The game now supports optional AI profiles for governance and detailed battlefield orders. A profile is a small JSON file containing numerical priorities. You train it outside the game, compare it with Legacy, and enable it through HUD → AI. **Legacy remains the default.** The engine still applies the same legal orders, movement costs, casualties, turn consumption and victory rules.

These extensions are appropriate for this project because they are inspectable, run locally, and preserve a comparison with the existing design. They do not guarantee a stronger opponent. Training uses seeded numerical search over simulations, not a neural network, an online service, or a language model. Increasing training time can also produce a policy that overfits its practice situations.

## 1. Understand the four parts

| Part | Plain meaning | Files |
| --- | --- | --- |
| Game engine | Enforces the rules and changes the campaign after an order. | Existing `mjs/strategy.mjs`, `mjs/battle.mjs` and order modules |
| Policy adapter | Lists possible officer/order pairs and scores short simulated continuations. | `mjs/ai-planner-governance.mjs`, `mjs/ai-planner-battlefield.mjs` |
| Training engine | Tries different numerical weights and retains a better candidate on the practice cases. | `tools/ai-training-engine.mjs` |
| Profile | Stores learned weights, compatibility identity and training results. | JSON produced by `tools/train-ai.mjs` |

The same training engine serves both modes. The adapters translate the current game into candidates, features and measurable outcomes. When the game design changes, you can reuse the optimizer; new orders or changed APIs may require adapter changes before retraining.

**For the current governance project, use the conquest curriculum in section 10.** It works backward from uniting all 41 provinces and disables detailed battlefield actions during training. The progress trainer remains available. Current compatible example profiles and the conquest profile are linked in the v49 fixes note; v44/v45 reports remain as historical evidence.

A **feature** is a measured property, such as food reserves or soldiers surviving. A **weight** says how strongly the planner values that feature. A **seed** makes simulated random events repeatable. An **episode** is one practice campaign segment or battle. A **holdout** is a separate set of episodes reserved for evaluation, never used to choose the weights.

## 2. Prepare your computer

Use the editable source checkout, not only a hosted browser session. Open a terminal in `dist/rtk2/`, the folder containing `package.json`, `mjs/`, `config/` and `tools/`. Do not delete `dist/`: it contains this project's source.

Install Node.js 24.15 or newer in the 24.x line, then check:

```sh
node --version
node tools/ai-rules.mjs --check
```

The training commands use Node's built-in modules. They need no GPU, external account or npm dependency installation. For the full interface tests, separately run `npm ci` to install the existing test dependencies.

Training can take minutes or longer. Leave the terminal running until it prints the output directory and holdout results. Ctrl+C cancels a run. Use a new output directory for every attempt; completed runs are never overwritten.

## 3. Train governance priorities

Start with a small run across all six scenario families:

```sh
node tools/train-ai.mjs --domain governance --seed 1001 --holdout-seed 700001 --generations 3 --population 4 --episodes 6 --holdout-episodes 6 --months 2 --out training/governance-run-001
```

Governance training runs the actual campaign for two months. One faction uses the candidate policy; its opponents use Legacy. The fixed training objective rewards territory, officers, effective army strength, development, flood protection, loyalty, reserves and border safety. That objective stays fixed while the candidate weights change, so candidates cannot win simply by inflating their own scoring weights.

The planner jointly chooses a province, officer and order. It samples two outcomes and considers a second order. Supported candidates include cultivation, flood control, relief, province-wide training, hiring, food and weapon purchases, recruitment, settlement by movement, gold rewards and invasions. Existing readiness, costs and limits still apply.

This first extension does not optimize every political, marriage, covert or adviser choice. Legacy handles phases or situations where the planner supplies no order. A trained ruler may favor its supported orders and use those other strategies less often. Governance training uses the existing abstract resolver for unwatched battles; tactical weights do not affect that resolver.

## 4. Train battlefield priorities

```sh
node tools/train-ai.mjs --domain battlefield --seed 2001 --holdout-seed 800001 --generations 3 --population 4 --episodes 6 --holdout-episodes 6 --out training/battlefield-run-001
```

The generated cases use actual invasions and existing deployment. Each starting battle is played twice: the candidate controls the attacker once and the defender once, against Legacy. Six starting positions therefore produce twelve episodes.

The tactical planner compares ready units and orders together. It considers Wait, movement, Normal, Charge, Simultaneous, Fireball and reinforcement. It samples three outcomes, a friendly follow-up and one Legacy enemy reply. Winning or losing dominates its short-horizon score. Training measures final victory/draw/loss and relative survivors, independently of the candidate's weights.

Deployment and pending challenges continue through Legacy. The first version does not learn new deployment, duel, bribery or retreat policies. Battles suspended after thirty days count as draws in this benchmark; they are not treated as completed campaign victories.

The planner sees its own field units and currently visible enemies. It excludes concealed enemy coordinates and previous hidden action coordinates, and uses independent simulated random draws. This prevents previews from knowing the live game's next random result. It retains only previously observed enemy coordinates for blind jungle attacks; a hidden move does not update that memory. It does not learn a probability distribution over suspected enemies.

## 5. Read the outputs before importing

Each successful run creates:

- `governance-profile.json` or `battlefield-profile.json`: import this into the game.
- `report.json`: keep this as the evidence for the run. It records seeds, settings, weight-search history, paired results and decision times.

| Setting | What it controls |
| --- | --- |
| `--generations` | Number of search rounds; default 3. |
| `--population` | Weight variants tried per round; default 4. Two weights are perturbed per variant. |
| `--episodes` | Generated starting cases; default 6. Battlefield doubles these into paired roles. |
| `--holdout-episodes` | Separate evaluation cases; default 6. |
| `--months` | Governance horizon, 1–12 months; default 2. Ignored for battlefield play. |
| `--seed`, `--holdout-seed` | Repeatable training and evaluation randomness; they must differ and not overlap. |
| `--from` | Previous profile whose weights provide a starting point. |
| `--saves`, `--holdout-saves` | Directories of your own saved positions, replacing generated cases. |
| `--out` | New or empty directory for this run. |

`meanDifference` is trained score minus Legacy score on the same starting cases. Positive favors the candidate on that metric; negative favors Legacy. Governance reports also include territory, soldiers, resources and development. Battlefield reports include wins, losses, draws and `scoreRate`, where a draw counts as half a win. A decisive win rate excludes draws and can be misleading when nearly every battle is a draw.

Reports group paired battlefield roles by seed when estimating mean uncertainty. They only show an approximate 95% interval with at least thirty independent seeds. They omit the usual per-match win-rate interval for paired roles. Even a positive interval is evidence about these scenarios and this opponent, not every strategy or player.

Read both training and holdout results. If practice improves while holdout worsens, the candidate has not earned promotion. Do not repeatedly adjust weights against the same holdout and continue calling it independent. Reserve fresh seeds and saved positions for the final comparison.

The current v49 examples are **experimental**, from one search round with two variants and six starting cases. Results and full reports are linked in [the v49 fixes note](fixes-v49.html). They demonstrate the workflow, not established superiority. Load examples leaves Legacy selected. Import replaces a domain’s stored profile, so first select Legacy if that domain is already Trained. The v44/v45 profiles are archived and cannot be activated against the changed v49 rules.

## 6. Compare and enable in the game

1. Open **HUD → AI**. Opening HUD pauses AI.
2. Click **Load examples**, or **Import profile** and select your generated JSON. Files must match the current engine and contain valid bounded weights.
3. Leave both policy selectors on **Legacy AI** initially. Importing a profile does not change the selected policy.
4. Click **Compare orders**. It previews Legacy's next order and the trained recommendation on copied state. No live order, gold, mobility or random draw is spent. Scores rank candidate orders; they are not victory probabilities.
5. Use the existing **Edit** selector to choose the global policy or one ruler. Governance and battlefield can be switched independently. A ruler can use **Use global choice**, or explicitly override it with Legacy/Trained.
6. Select **Trained** for the desired mode. Use **One AI action** to advance one real AI order. It closes HUD and leaves AI paused. Reopen HUD to inspect the result. **Resume AI** closes HUD and resumes playback.
7. Select **Legacy AI** to roll back. Profiles and selections travel with saved campaigns; old saves with no extension settings use Legacy.

**Compare recommendations while AI plays** records both recommendations before a real AI step. The selected policy still controls execution. Reopen HUD to see the latest comparison; this is observation, not a second order. It adds simulation work and may slow playback. Turn it off during normal play if necessary.

Human-controlled factions still require human orders. The trained battlefield policy only runs detailed battles: choose **Menu → Battle view → All battles** when evaluating tactical AI. The existing Planned path/Jungle scores overlays continue to explain the original route and lane heuristics; **Compare orders** is the trained planner's order preview. Automatic AI unit highlighting follows the selected policy's actor.

## 7. Test difficult positions and fresh seeds

Generated battle cases can produce many draws. Include meaningful saved positions: palace danger, several adjacent opponents, low food, fire, jungle uncertainty, different terrain and unequal armies. Include governance shortages, weak borders, disloyal officers and later campaign economies.

Use **Menu → Save Game** to export each position. Put governance saves outside active battles, journeys and victory reviews. Put battlefield saves in combat after placement, with no pending challenge or outcome. Use different positions in separate folders, for example `training-saves/governance/` and `holdout-saves/governance/`.

```sh
node tools/train-ai.mjs --domain governance --saves training-saves/governance --holdout-saves holdout-saves/governance --seed 1001 --holdout-seed 700001 --months 3 --out training/governance-saved-001
```

When save directories are supplied, every JSON file in them is used; generated episode counts no longer choose the number of positions. The tool checks separate paths and seeds, but cannot detect a copied duplicate save under another filename. You must keep the situations separate. Do not put profiles or reports in these folders.

Evaluate a finished candidate against Legacy on a fresh, larger set:

```sh
node tools/benchmark-ai.mjs --profile training/governance-run-001/governance-profile.json --seed 1200001 --episodes 30 --months 3 --out training/governance-fresh-benchmark.json
node tools/benchmark-ai.mjs --profile training/battlefield-run-001/battlefield-profile.json --seed 1400001 --episodes 30 --out training/battlefield-fresh-benchmark.json
```

For curated positions, add `--saves fresh-test-saves/battlefield` or the governance equivalent. Thirty cases are a starting point for reporting uncertainty, not a magic pass mark. Test more diverse positions and different horizons. Both policies receive the same initial state, rules and seed; their different orders can naturally cause later random draws to diverge.

Before a release, decide concrete acceptance goals: no illegal orders or stalls, no hidden-position dependence, improved holdout outcomes without unacceptable losses of territory/resources, and acceptable decision time on target devices. Observe failures as carefully as wins. Keep Legacy available even after promotion.

## 8. Retrain after the game advances

Each profile records `rulesId`, a hash of engine/policy modules and relevant scenario, terrain and configuration files. Interface-only edits and asset changes do not invalidate it. Rule or policy changes do. Imports with an outdated rules identity are rejected; profiles with an outdated rules identity already in a save are retained for reference and fall back to Legacy.

1. Implement and test the new game design through the existing rule modules.
2. If order APIs or useful features changed, update the two planner adapters and `tools/ai-training-game.mjs`. The generic optimizer can stay unchanged. If feature keys or their meanings change, update `AI_POLICY_VERSION`, the weights/schema validation and existing-save migration in `mjs/ai-profile.mjs`.
3. Regenerate the compatibility identity, then run the checks:

```sh
node tools/ai-rules.mjs --write
npm test
npm run test:ui
```

4. Train new profiles using fresh train/holdout sets. If the old weight keys still fit the new policy version, use them as a starting point:

```sh
node tools/train-ai.mjs --domain governance --from training/governance-run-001/governance-profile.json --seed 3001 --holdout-seed 900001 --out training/governance-new-rules-001
```

`--from` allows an old rules identity only as a warm start. The new run must simulate the current engine and produce a current compatible profile. It does not bypass schema or policy-version validation. Do not manually edit an old profile's `rulesId` to make it appear retrained.

5. Benchmark, inspect in HUD, and explicitly choose whether to enable the candidate. For bundled example updates, copy compatible profiles into `config/ai-profiles/governance-v49.json` and `battlefield-v49.json`, update their evidence note, and verify the Load examples control. Use the corresponding release filenames if a later release changes them.

The fingerprint check runs at the start and end of training. Keep source and configuration unchanged during a run. `npm test` also detects a stale fingerprint. The offline adapter reads the same flat numeric monthly settings and AI JSON configuration as this release; if the configuration format changes, update its loader alongside the game loader.

## 9. Find the smallest file to change

| Goal | Edit |
| --- | --- |
| Add a legal candidate or change planner features/lookahead | `mjs/ai-planner-governance.mjs` or `mjs/ai-planner-battlefield.mjs` |
| Change the training objective or construct richer episodes | `tools/ai-training-game.mjs` |
| Train governance backward from conquest | `tools/governance-conquest.mjs`, `tools/train-governance.mjs` |
| Change weight search for both modes | `tools/ai-training-engine.mjs` |
| Change profile fields, bounds or compatibility version | `mjs/ai-profile.mjs` |
| Change import, policy selection or comparison display | The AI extension functions in `mjs/app.mjs` |
| Verify isolation, compatibility and behavior | `tests/v44-tests.mjs`, `tests/v45-tests.mjs`, then the full suites |

Keep policy changes separate from game-rule changes. The existing [AI editing guide](ai-editing-guide.md) explains Legacy and the original HUD overlays. Downloadable packaging remains a separate decision.

## 10. Train governance backward from conquest

The target is **be the sole ruler owning all 41 provinces, reliably and quickly**. Building the largest army is a supporting choice, not the victory condition. Soldiers only help when they have capable commanders, training, weapons, supplies and a useful position.

This is a separate training objective named `governance-conquest-v1`. The game still executes the existing legal orders. Legacy remains available and the detailed battlefield trainer remains separate. All policies use the current game engine.

### How the curriculum works

| Stage, in training order | Starting situation | What the policy practises |
| --- | --- | --- |
| Finish | 38 owned provinces, two enemy provinces and one unclaimed province | Finish conquest and settlement without losing the existing realm. |
| Expand | 24 owned provinces, 16 enemy provinces and one unclaimed province | Prepare invasions, maintain supplies and retain gains. |
| Opening | The original six scenario families and existing shortage variants | Choose early investments that support later expansion. |

Finish and Expand are **synthetic practice positions**, not recovered historical campaigns or evidence that a policy reached those positions from an opening. They redistribute existing serving generals and ownership, place spare generals at two fronts, and validate the resulting save against the game. Interior provinces carry the existing internal delegation settings. No new soldiers are created by the setup; practice supplies are adjusted and some cases have food or gold shortages. Historical scripted events are disabled in these synthetic positions. Original openings retain their existing history settings and armies.

Each stage retains all earlier practice cases. For example, Opening training also revisits Finish and Expand so a useful early-game change cannot freely discard end-game performance. The first two cases in each stage cover two scenario families; use six or more to include all six families. More seeds add repetitions and variations, not automatically new strategic situations.

### What counts as better

The optimizer compares candidates in this order:

1. Higher conquest success rate on the practice set.
2. Lower average capped time to conquest, when success rates match.
3. Fewer eliminated realms, when success and capped time match.
4. Higher fixed supporting score, when the earlier measurements match.

Every failed or unfinished case receives its deadline **plus one month** for capped time. An early defeat cannot look like a fast victory. Victory during the starting campaign month counts as one month; a position already united at the start counts as zero. Actual unfinished durations, losses and remaining provinces are also recorded. Only an engine-confirmed victory owning all 41 provinces is a success.

The supporting score rewards territory and net expansion, then measures the backward dependencies:

| Supporting measurement | Beginner explanation |
| --- | --- |
| Frontier readiness | Can an army with a general left to govern, useful combat strength and food make progress toward an adjacent target? Unclaimed provinces need spare generals and settlement supplies. |
| Sustainability | Can each province pay wages until the next tax and feed its garrison until the next harvest? The weaker of food and gold coverage limits this score. |
| Production | Does estimated annual food and gold production cover annual upkeep? This is an approximate planning signal; episodes still apply the actual economy rules. |
| Stability | Are the people and serving generals loyal enough to retain the gains? |
| Pullbacks | Actual province losses, officer losses and province-months with food or wage shortages reduce unfinished scores. Officer losses include captures and deaths; this is not a pure defection count. |

Coverage ratios stop improving at “enough.” Extra stockpiles therefore do not earn endless supporting credit. Spending gold or food is not automatically a penalty: an investment can improve readiness or future production. The fixed unfinished score is bounded below any victory score. The optimizer's explicit comparison order, rather than a large reward constant alone, gives conquest success priority across multiple cases.

This trainer searches numerical weights; it is not a neural network and does not learn separately after each order. The live governance planner retains its existing candidates and two-order lookahead. Supply transfers between friendly provinces and other unsupported candidate orders still require a separately reviewed planner extension. The new objective does not make those actions available by itself.

### Detailed battlefield is disabled for these runs

The trainer copies each campaign, clears human controllers and forces the existing non-detailed battle setting **before constructing the simulation**. Invasions use the existing abstract battle resolver. An additional guard rejects any detailed battle order, and reports record `detailedActions: 0` plus the abstract battle count. Zero-soldier garrisons can produce an immediate outcome before either battle mode begins; those are counted separately as `instantBattles`, even though the existing game labels those records “tactical.” Both counts cover all factions in the episode.

Battles, casualties, capture, invasion costs and province changes still occur. Only detailed tactical decision-making and battlefield animation are excluded. The player's current battle-view setting and active campaign are untouched. These results establish governance behavior under the remaster's abstract resolver, not strength in watched tactical battles.

### Run training

From `dist/rtk2/`, start a new directory for each run:

```sh
node tools/train-governance.mjs --seed 11001 --holdout-seed 910001 --generations 2 --population 3 --episodes 2 --holdout-episodes 6 --months 3 --evaluation-months 6 --from config/ai-profiles/governance-v49.json --out training/governance-conquest-001
```

This bounded first run uses two practice cases per stage, three-month practice segments and six independent evaluation cases per stage with six-month deadlines. The curriculum has 2, then 4, then 6 cumulative practice cases. Final evaluation has 18 cases, kept separate by stage and compared against **Legacy and the current compatible governance profile**. It is an experiment, not proof of reliable full-campaign conquest.

| Option | Meaning |
| --- | --- |
| `--episodes` | Practice cases per stage; default 6. |
| `--holdout-episodes` | Evaluation cases per stage; default 6. |
| `--months` | Practice deadline, 1–120 months; default 3. |
| `--evaluation-months` | Independent evaluation deadline, 1–120 months; default 12. |
| `--generations`, `--population` | Search rounds and weight variants per round; defaults 2 and 3. |
| `--from` | Compatible governance profile used as the starting weights; otherwise the original default weights. |
| `--compare` | Prior governance weights reevaluated under the current rules; defaults to the compatible v49 governance profile. |
| `--seed`, `--holdout-seed` | Independent practice and evaluation randomness. Overlap is rejected. |
| `--out` | New or empty output directory. Existing results are never overwritten. |

The command writes `governance-profile.json` and `report.json` only after all stages and comparisons finish. After each completed practice stage it saves `checkpoint-profile.json`, clearly labelled unfinished. If a later stage fails or you cancel with Ctrl+C, use that checkpoint as `--from` in a new output directory to retain its weights; the curriculum then runs again from Finish. Checkpoints are not evaluated release profiles. The command checks the engine fingerprint at the beginning and end. Keep the source unchanged while training.

Read **the Opening results separately**. Success in an artificial near-victory position does not establish that the policy can build that realm from scratch. Reports show wins, elimination, unfinished cases, province counts, shortages, completion time, detailed-action count and results against both baselines. With fewer than 30 independent cases, the existing comparison report does not present a mean confidence interval.

To evaluate a fixed profile on fresh seeds without tuning it, use zero generations:

```sh
node tools/train-governance.mjs --generations 0 --from training/governance-conquest-001/governance-profile.json --seed 21001 --holdout-seed 1910001 --holdout-episodes 12 --evaluation-months 24 --out training/governance-conquest-fresh-evaluation
```

The emitted profile has the same weights in this evaluation-only run. Longer deadlines cost more simulation time and still may leave campaigns unfinished. Keep fresh evaluation seeds for final assessment; do not repeatedly tune against those results and call them independent.

### Import, compare and retrain

The [v49 fixes note](fixes-v49.html) links the current conquest profile and full report. The v45 results note remains archived. Before importing, select **Legacy for Governance globally and for any ruler overrides**. Download the profile, then use **HUD → AI → Import profile**. Import preserves your selected policy: if Governance was already Trained, importing would replace its active weights immediately. Choose Trained explicitly after inspection; Battlefield can remain Legacy. To compare against the current progress profile, select Legacy again, import governance-v49.json and use the same starting campaign. The current HUD keeps one imported profile per domain, so it does not display two governance profiles simultaneously.

Changing training objectives or practice scenarios alone does not alter the live game rules. The v49 fixes changed those rules, so all current examples were actually retrained and the archived v44/v45 profiles retain their old compatibility identity. If game rules or the planner later change, follow section 8 to regenerate the fingerprint and retrain. The generic numerical search is shared; the conquest adapter owns the objective and curriculum. For regression checks, run:

```sh
node tests/v45-tests.mjs
npm test
```

Legacy remains the default. The new profile is experimental until diverse fresh opening campaigns show improved conquest success and time without unacceptable losses or decision cost.

## Current v50 examples

The rules fingerprint changed for local withdrawal, simultaneous readiness and retreat reservations. Archived v49 files remain available for warm starts, but cannot activate under v50. HUD → AI → Load examples loads the separately retrained governance-v50.json and battlefield-v50.json; the backward conquest example is governance-conquest-v50.json. All stay experimental and require explicit selection.

Compatibility smoke training used two governance practice/holdout cases, two battlefield positions in both roles (four episodes each), and one conquest case per backward stage with a one-month horizon. These small reports are not evidence of improved AI or a full-campaign conquest. Governance conquest runs recorded zero detailed battlefield actions. [Release findings](fixes-v50.html) link the current verification, native evidence and retained differences.
