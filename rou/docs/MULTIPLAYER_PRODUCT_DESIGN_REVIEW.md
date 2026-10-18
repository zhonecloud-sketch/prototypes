# Multiplayer design review: chips and play-style analysis

Prepared: 18 October 2026 | Asia/Kuala_Lumpur

## Usage and expected result

Read this proposal beside the [playbook][L1] and [accepted decisions][L2].
Use the decision sheet near the end to accept or change the recommendations.
The expected result is a smaller first commercial release with two clear
products: optional chip purchases and paid personal analysis.

Updated after the owner authorized coding on 18 October 2026. The first
local implementation is now available: Shop, collectible ownership and
showcase, chip/Insights test checkout, and personal analysis since reset.
Run it using [the implementation guide][L7]. This is a local product preview;
shared multiplayer tables and real billing are subsequent backend work.

Two additional owner decisions are confirmed: the attached Bias Calculator
must determine the required sample size for either direction of advantage,
and the 160-million-chip item is a **luxury golf course**. Nine realistic
collectible images have been generated and connected to the catalogue [L8].
Earlier accepted answers remain intact; unresolved commercial choices below
remain proposals. Coding authorization supersedes this review's previous
instruction to stop before implementation.

## Recommended direction

**Keep Atelier's current table and wheel. Add a social layer, a visible
collection, and one paid Insights product.**

The owner has now specified two income sources: chips and play-style
analysis. Chips support larger play balances and virtual luxury purchases.
Insights explains the player's own results, uncertainty, and playing habits.
Luxury items remain bought with chips, within the same chip revenue stream.

The owner's clarification defines **inverted advantage** as unusually poor
results relative to the applicable odds: for example, a 30% hit rate in a
nominally 50:50 game. It does not request an opposite-bet recommendation.
Use this meaning throughout the product and phase specifications.

Keep the confirmed rules: six total seats, 10,000 starting chips, the
existing 2,500-chip bankruptcy replenishment, optional purchases, closed-loop
credits, and non-transferable virtual collectibles. Preserve the current
bet types and visual identity [L1, L2, L3].

[INFERRED] The strongest commercial proposition is the combination of social
display and understandable personal feedback. There is no user research or
sales evidence yet establishing conversion, retention, or the right price.
The recommendations below are proposals to test, not revenue forecasts.

## What the review found

| Evidence | Finding | Proposed change |
| --- | --- | --- |
| Current table, `index.html:103–125` [L3] | The felt, wheel, chip chooser and Statistics entry already provide the main interaction. | Extend these surfaces; avoid a new dashboard around the table. |
| Q03.01 and Q03.07–08 [L1] | Multiplayer has technical seating rules but little detail about the social experience. | Quick Join, a compact six-seat strip and one showcased item per player. |
| Q05.02 and Phase 05 [L1] | Payments cover chips; paid analysis access and its lifecycle are absent. | Two product types sharing checkout: chips and Insights access. |
| Phase map and Q08.08–09 [L1] | Analysis comes after several other features and is primarily client-side. | Design Insights early; calculate authoritative summaries on the server. |
| Q08.02; current 222-spin view [L1, L3] | Several windows compete with the owner's required since-reset view. | Make the whole current record the default and the basis of headline claims. |
| Q02.12 [L1] | A proposed 12-month raw-history limit may truncate a longer current record. | Agree retention that can support the entire current record before selling it. |
| Q00.04 and Q00.08 [L2] | The smallest pack is 100,000 chips; the cheapest listed collectible is 200,000. | Give the entry pack an achievable collection use, as proposed below. |
| Q07.06 versus accepted reset answers [L1, L2] | An older recommendation would preserve current profit/EV scores after reset. | Current profit/EV records restart; resolve finalized historical boards explicitly. |
| All phase-start prompts [L1] | Prompts point to the OneDrive workbook, rather than this reviewed repository copy. | Use the repository workbook and decision record as the canonical pair. |

The original published desktop table and the new local implementation were
visually inspected as a guest. Shop and Insights were also checked at a
390-by-844 CSS-pixel viewport. This does not exercise a physical phone's
orientation and touch behavior. Screenshots and the precise verification
scope are recorded in the implementation guide [L7]. No usability-study
result or production-readiness claim is made.

## GUI: a small number of familiar destinations

### Launch page

Keep the existing Atelier branding. Give the page one dominant action,
**Join a table**, with **Play solo** as the secondary choice. Returning
players see **Return to table** while they still have a reserved seat.

Below those actions, place three quiet links: **Shop**, **Insights**, and
**Hall of Fame**. The avatar opens Profile and Settings. Put source selection
and feed details here, as already requested. Label the multiplayer sources
**Live draws** and **Recorded replay**, with a short explanation [L2].

Quick Join should fill an available compatible table before creating another.
A separate large lobby, table tiers and VIP rooms can wait. Solo remains a
low-friction guest entry; an account connects multiplayer records, purchases
and cross-device ownership, consistent with the existing recommendation.

### Playing table

Preserve the grid, Classic/French controls, chip chooser, Undo, Clear,
Repeat, Double, and the wheel presentation. Add:

- A compact row of six avatars, including a clearly marked **You**.
- A **+ Chips** action beside the wallet.
- **Insights** in the existing Statistics entry position.
- **Menu** returning to the launch page, with login and accepted bets intact.

Each seat shows a short name, connection/betting state, and one small
collectible badge. Tapping it opens a profile sheet. Keep exact opponent
bet positions, private analysis, payment history and bankroll off the table.
Show a brief round result by the avatar after settlement. This makes the
shared round visible without covering the player's betting grid.

Conceptual placement; this is not a pixel or device specification:

```text
ATELIER       Menu                 125,000 chips  [+]

[You]  [Player]  [Player]  [Player]  [Open]  [Open]

          EXISTING CLASSIC / FRENCH BETTING GRID
          EXISTING CHIP CHOOSER AND BET ACTIONS

Recent spins                Insights >      Wheel >
```

On phones, preserve the existing landscape table approach. Seat labels may
shorten, but tap targets and bet cells must remain usable. Open Shop and
Insights on the same compact landscape surface as launch, wagering and wheel
views, with a clear return action. Use the existing 1120-pixel logical width,
scale it to the phone and rotate it when the phone is held in portrait. Keep
the collection in three columns, chip packs in five, and analysis controls
and headline figures in three. Purchase confirmations follow the same
orientation. Keep Back accessible while scrolling longer content. Avoid
adding a permanent multi-item navigation bar over the betting surface.

Opening another page does not pause a shared round. Show a small round-status
line and retain accepted wagers. Do not automatically repeat bets while the
player is shopping, reading analysis, disconnected, or in the background.
Purchases and analysis should never take over the screen during betting.

### Shop and collection

Use two tabs in one shop: **Chips** and **Collection**.

The Chips tab initially shows three package cards, with **More packs** for
the larger amounts. Each shows the USD charge, exact chips, any actual bonus,
and a purchase button. Retain all accepted package prices unless the owner
changes them. Explain pending, completed and failed orders in the same sheet.

The Collection tab shows a small catalogue, owned items, chip price, and
**Show at table**. Use attractive item artwork, a short description and one
confirmation. Keep the existing luxury catalogue; start with simple images
and badges, rather than separate 3D environments or a property-management game.

Let a player select one collection goal. Show the goal and chip balance in
the shop/profile. Do not interrupt play with recurring purchase prompts.

**Entry-pack proposal:** add one optional cosmetic badge at 50,000 chips.
This is a new item proposal, not a change to the accepted luxury prices.
The 100,000-chip entry pack then buys something visible and leaves chips
for play. At present even the 10,000 starting chips plus that pack cannot
buy the 200,000-chip watch [L2].

[INFERRED] The accepted 7-million sale pack at USD 9.90 could make the usual
1-million pack at the same price feel unattractive. It delivers seven times
the chips. Keep sales occasional and clearly dated if retained; measure
their effect before building a more elaborate promotion system.

## Gameplay: shared entertainment with individual balances

Use one shared live result stream initially, with six-seat tables acting as
social groups. Each player keeps their own wallet and accepted wagers. This
matches Q03.05's proposed architecture and avoids requiring separate wheel
logic for each table [L1]. Display the same round outcome to everyone.

Keep the proposed 30-second round: 20 seconds betting, seven seconds wheel
presentation and three seconds results. Server deadlines and settlement are
authoritative. A player joining mid-spin waits for the next betting window;
they can watch immediately. Retain the proposed 60-second reconnect grace.

The simple play loop is:

```text
Join a table -> place bets -> share the wheel result
    -> view personal progress -> showcase a collectible -> return to play
```

Purchased chips allow larger balances and collectible purchases. They do
not improve outcome probabilities, change payouts, reserve a favourable
source, or alter the statistical evidence threshold. Insights purchases
unlock explanation and detail using the same outcomes and rules.

Preserve the free replenishment. A bankrupt player can continue the game;
the commercial reasons to pay are larger-scale play, collection goals and
analysis. No additional streak rewards, missions, tournaments, chat, gifts,
loot boxes, or additional currencies are needed for this release.

For the first commercial release, recommend live server draws. Keep the
recorded source as a clearly labelled practice/research mode with separate
results and competition eligibility. The existing source is public and can
be predicted when its position is known, even though its statistical audits
found no significant bias [L4, L5]. The mode/economy choice remains a proposal.

## Two products and a clear reason to buy each

| Product | Value to the player | Recommended initial offer |
| --- | --- | --- |
| Chip packs | Larger play balance and visible virtual collectibles. | Existing approved USD packages; optional goal-linked shop entry. |
| Insights | Explain outcomes, play style, risk and strength of statistical evidence across the whole current record. | One 30-day access pass, purchased directly in USD. |

Recommend a **non-renewing 30-day Insights pass** for the first paid beta.
It has one price and an explicit expiry, with no subscription tiers or
per-spin/per-report charges. Recurring renewal can be considered after
players demonstrate that they return for the analysis. A renewable monthly
subscription is an alternative owner choice, not an additional launch product.

[INFERRED] USD 4.90 per 30 days is a starting price hypothesis to test, not an
approved price or a market benchmark. Validate willingness to pay before
introducing annual plans. Buying more chips should not be required to use
Insights, and chips should not be an indirect payment route for Insights.

| Always available | Paid Insights detail |
| --- | --- |
| Current-record start date and eligible sample count. | Complete bet-type, stake-size and time breakdowns within that record. |
| Stake, returns, net result and theoretical expected result. | Return-versus-expectation chart, drawdown and stake-variation analysis. |
| Plain evidence status: insufficient, ordinary, unusually high or unusually low. | Effect size, uncertainty, relevant probabilities and sample-size sensitivity. |
| Existing recent-spin statistics. | Pocket, common bet-group and named-sector evidence with explanations. |
| Reset controls and access to the player's underlying records. | A readable downloadable analysis report and saved report snapshots. |

The basic status must be truthful before purchase. The paid offer is
**understand your record**, including an ordinary record. Do not sell a
teaser claiming a hidden advantage that disappears after checkout. A free
example report can demonstrate the depth using clearly labelled sample data.

Keep account/privacy data export available independently of a paid formatted
analysis report. Keep all accepted current-record events available to the
analysis service regardless of pass ownership. Buying the pass immediately
opens that existing record; it does not start evidence collection from zero.

A successful paid order grants access exactly once. Repurchasing extends
from the later of now or the current expiry. Pending or failed orders grant
nothing; refunds adjust access according to the agreed policy. Expiry
removes premium access while ordinary play and basic summaries continue.
Resetting a record neither cancels nor extends a paid pass.

For the beta, measure shop-to-purchase conversion, repeat chip purchases,
Insights purchase/renewal, report usage and refunds. Track the two income
streams separately, including payment fees and operating cost. Do not set
revenue targets from invented conversion assumptions.

Especially check whether players return to Insights when their results are
ordinary. If the only appealing content is a rare bias alert, the product
needs better everyday explanations before adding more paid tiers.

## Insights: explain the result before showing the equations

Use **Your play** with an expandable **Wheel patterns** section to keep the
first screen small. The window for both is **Since last reset**, with its
date, source and sample count always visible.
The 222-spin view stays a recent summary and cannot determine the headline.

The Your play page starts with one verdict card, then three numbers: **Net
result**, **Expected result**, and **Difference**. Below it, show one chart
and a short explanation of which bet types and stake sizes contributed.

Illustrative copy, not a calculated player's result:

```text
YOUR PLAY                         Since reset: 18 October

No reliable advantage detected
1,240 distinct wagered rounds | Live draws

Net result        Expected result        Difference
-1,800 chips      -2,703 chips            +903 chips

You finished above the usual expectation for 100,000 chips
staked. The numbers alone do not establish a repeatable advantage.

[ View breakdown ]                [ How is this calculated? ]
```

These illustrative rounded amounts use `-100000/37` as the expected result.
An actual verdict also requires the wager portfolio and its risk; the three
displayed amounts alone cannot generate a significance conclusion.

### The four evidence states

| Status | Meaning and presentation |
| --- | --- |
| Not enough evidence yet | Show what is observed, its uncertainty and the size of effect the sample could detect. |
| Within expected variation | No reliable departure detected under the specified test; this does not prove perfect fairness. |
| Unusually favourable results | Significant positive deviation from the applicable baseline for this record. |
| Unusually unfavourable results | Significant negative deviation: the owner's intended inverted advantage. |

Use **inverted advantage** in the explanation, with **unusually unfavourable
results** as the plain headline. Describe the record, not an inherent trait
of the person. Keep the assessment private; do not badge someone as an
unlucky player at the table or sell an item that claims to change their luck.

If a pattern recurs in later, prospectively specified observations, show
that validation separately. A past rare result is evidence about that sample;
it does not establish that the same person will remain unlucky or that a
future bet is predictable. There are no player wager records supplied with
this review from which to identify such a group now.

Across many players, some unusually low records will occur by chance. A
search for a group of unlucky players needs its own correction for searching
across accounts and prospective validation. A private per-record test does
not establish that such a persistent population subgroup exists.

### The owner's 30:70 example

For a fixed sample and a specified binary event, reuse the calculator's
inclusive doubled-tail binomial equation [L6]:

```text
X ~ Binomial(N, p0)
p = min(1, 2 * min(P(X <= wins), P(X >= wins)))
```

Computed examples, before correction for selecting patterns or checking
repeatedly:

| Model | Observed hits | Raw two-sided p | Interpretation |
| --- | ---: | ---: | --- |
| Exactly 50:50 | 3 of 10 | 0.343750 | A 30% rate in this small sample is ordinary. |
| Exactly 50:50 | 30 of 100 | 0.0000785014 | Much stronger evidence against the specified 50:50 model. |
| Single-zero red/black, `p0 = 18/37` | 3 of 10 | 0.389887 | Too little evidence for an unusual personal record. |
| Single-zero red/black, `p0 = 18/37` | 30 of 100 | 0.000231645 | Strong unadjusted evidence; the complete monitoring protocol still applies. |

Zero means a standard red or black bet has a 48.6486% win probability, not
50%. A probability of net profit on a round containing several different
bets must be calculated from the combined payoffs, not assumed to be 50%.
Thirty wins out of 100 and thirty winning bet entries are not interchangeable.

With the calculator's Beta(1,1) prior, 30 hits in 100 produces Beta(31,71),
with a central 95% interval of approximately 21.90% to 39.61% [L6]. That is
a model-based interval for a stable event probability, not a probability
that a person possesses a permanent unlucky characteristic.

### Performance, bias and a profitable expectation are different questions

**Personal performance:** did the accepted bets do unusually well or badly
against their fair conditional expectations? This is the main paid story.

**Wheel patterns:** are result pockets or sectors unusually frequent in
the relevant source sample? This is a property of observed draws, shared
by all players using them. A source-level pattern is not personal luck.

**Estimated profitable expectation:** would a specified, prospectively
evaluated betting rule have an expected net return above zero under a
supported probability model? This needs evidence beyond being above the
normal negative roulette expectation. It is not a launch-screen promise.

For example, a single-number hit probability of 2.75% is above `1/37`, but
the usual 35:1 net payout gives `36 * 0.0275 - 1 = -1%` per unit staked.
The break-even probability is `1/36`, or approximately 2.7778%. Even a real
frequency increase need not provide positive expected profit.

## Calculation rules behind the simple screen

### Correct personal record and sample

Record every accepted wager and settlement from the reset boundary, including
losses and rounds where the player is disconnected. Use authoritative round
and source IDs. The current implementation blocks a reset while a wager is outstanding.
After settlement, confirmation creates a new record boundary. Keep this
simple rule unless the owner later requests a queued reset.

Keep two explicitly labelled sample counts:

- **Your play:** distinct settled wagered rounds within the selected
  constant-probability bet profile. Also show all wagered rounds separately.
- **Wheel patterns:** distinct completed source draws in the selected
  source's since-reset time interval, including available draws while the
  player was offline. Any gaps must be shown; do not imply complete coverage.

Six players on one shared spin do not create six independent source draws.
Several bets on that spin remain correlated. Repeated replay rows are not
new independent observations. Keep live and replay analyses separate, and
show a new source/version boundary when it changes [L1, L4, L5].

Guest/local records can have descriptive analysis, but should be labelled
as local and unverified. Official scores and paid account records use
server-owned events. Access starts from the current reset boundary, not the
last login, last payment, latest 222 spins, or a favourable date selection.

### Profit and expectation

For round `t`, let `S_t` be total accepted stake and `R_t(j)` be the gross
return if pocket `j` wins, including returned stakes. Use the complete round
portfolio, including overlaps between French and other bets:

```text
g_t(j) = R_t(j) - S_t
actual net = sum_t g_t(observed pocket)
fair expected net = sum_t [sum_j g_t(j) / 37]
performance difference = actual net - fair expected net
v_t = sum_j (g_t(j) - fair mean for round t)^2 / 37
descriptive risk score = performance difference / sqrt(sum_t v_t)
```

For standard single-zero payouts the fair expected net simplifies to
`-sum_t S_t / 37`. Grants, purchases and collectible spending are excluded.
The formula automatically accounts for within-round correlation. Do not sum
individual-bet variances as though overlapping bets were independent.

The risk score is descriptive; it is not a normal-test p-value or the
advantage classification. For zero variance show **Not applicable**. A
favourable win-rate signal is also not a claim of positive future monetary
EV: profitable-round frequency and the sizes of wins/losses are different.

For the owner's calculator, define a win as a round's net result greater
than zero. Compute the full payoff on all 37 pockets before selecting the
observed result. If exactly `m` pockets produce net profit, use `p0 = m/37`.
Combine only rounds with the same `m`; show the selected profile and count.
Overlapping or French called bets still produce one observation per draw.
A deterministic profile with no profitable pockets has financial totals
but no eligible binomial sample. Source modes stay separate [L9].

Changing the selection of pockets between rounds is compatible with this
fair-wheel baseline when the chosen portfolio precedes an independent draw
and its conditional probability stays `m/37`. Looking across profiles or
choosing when to stop can still create selection effects. Do not shuffle
outcomes against an adaptive bet sequence and call that an exact test.

### Continuous updates using the owner's Bias Calculator

The owner chose the mathematical model in `bias_calc/index.html` [L6]. Copy
its numerical kernel, retain a model version, and test parity rather than
substituting a different sequential test. Current settings are:

| Setting | Initial value | Use |
| --- | ---: | --- |
| Single-evaluation alpha | 0.05 | Calculator's frequentist view. |
| Monitoring alpha | 0.001 | Default per-check evaluation as play continues. |
| Detection power | 0.80 | Calculator sample-size target; adjustable in details. |
| Bayesian prior | Beta(1,1) | Posterior interval and directional probabilities. |

For `wins` among `N` eligible rounds, use the inclusive doubled-tail
binomial p-value above. The Beta posterior is `Beta(wins+1, N-wins+1)`.
Display its central 95% interval as a model interval for the event
probability, never a probability that a person is inherently lucky.

A personal signal requires **both** `N >= calculator required N` and
`p < selected alpha`. The direction comes from `wins/N - p0`: positive is
an advantage signal; negative is an inverted-advantage signal. Otherwise
show insufficient evidence or expected variation. Purchasing Insights
changes the available detail, never these inputs or the verdict [L9].

This is a per-check evaluation. The calculator's alpha of 0.001 is not a
guaranteed total error rate over unlimited looks, many players, selected
profiles or repeated resets. The earlier anytime-valid proposal is not the
implemented model. A future lifetime-confirmation claim would require its
own validated monitoring method [E1]; it cannot be inferred from this UI.

Keep wheel patterns to 37 pockets, 12 outside groups and four named sectors.
The preview shows Holm-adjusted p-values across these 53 categories at each
look [E2, L9]. Repeated looks remain exploratory. Do not introduce the
1,332-arc search into this initial paid screen; its prior adjusted audit
p-value was about 0.436 [L5]. These are source observations, not independent
evidence of a persistent group of unlucky players.

The local preview captures observations continuously and runs analysis in a
Web Worker when Insights is open, after settlement or when settings change.
It reads the complete current record, with no 222-spin cap. The commercial
backend should maintain summaries incrementally and reconcile them against
authoritative raw events. Local IndexedDB history is device-specific and
cannot claim complete offline or cross-device coverage [L7, L9].

### Sample size comes from the calculator

Set `p1 = wins/N` and call the calculator's
`requiredN(p1, p0, alpha, power)`. It initializes a search with its normal
approximation, then evaluates power using its binomial critical region.
Preserve that algorithm, including its discrete search behavior. Describe
the output as the **calculator's required N**, not a proven globally
smallest sample over every possible discrete size [L6, L9].

There is no fixed 100-, 222- or 1,000-round qualification rule. Show eligible
rounds, required N, observed rate, baseline and remaining observations at
the current observed rate. Recalculate as observations accumulate. The
progress display is evidence coverage, not a promise that more play will
reveal an advantage. Required N uses the observed effect and is a planning
reference; it is not independent confirmation of that effect.

For example, 30 wins in 100 trials gives required N = 107 for `p0=0.5`,
alpha 0.001 and power 0.80. With roulette's `p0=18/37`, the calculator
returns 123. Both examples therefore remain below the sample requirement
even though their raw p-values pass alpha. These values were recomputed
with the extracted calculator kernel [L9].

Equal observed and expected rates have no finite target for a nonzero
effect. The preview also bounds planning at 100 million observations to
avoid pathological computation when the difference is tiny. It displays
an unsupported/no-finite-target state, never an arbitrary smaller fallback.
The guard is outside the unchanged calculator kernel and is tested [L9].

To investigate recurrence, freeze the identified event and evaluation rule
before collecting a later validation block. Keep the whole-record dashboard
since reset, and show the later block as a separate validation result. This
does not create another user-selectable reset or silently discard old losses.

## Rankings, resets and data access

Keep the accepted Wealth, Profit and EV boards. In explanations call EV
**performance versus expectation**, and show its risk-adjusted companion
score. None of these is a certification of skill or a profitable strategy.
Wealth includes purchases; absolute chip profit also depends on stake scale.
State those facts on the corresponding boards [L1, L2].

Rankings are recognition only. Do not publish private inverted-performance
labels. A minimum participation rule controls board eligibility; it cannot
serve as a universal statistical-confidence threshold. The proposed ten
wagered rounds in Q07.05 is inadequate for a claim of proven advantage.

Manual reset confirmation must state: current profit/EV and personal analysis
restart; wallet, collection and paid access remain. Preserve the accepted
automatic rule based on more than three months since the last settled wager.
Its calendar arithmetic, confirmation behavior and finalized historical-board
treatment are still unresolved in the existing decision record [L2].

Retain the data needed to reconstruct the current record, with a documented
retention/deletion policy. A rolling 12-month summary must not be sold as
“everything since reset” if that record is older. Archive/paginate history
server-side; do not require a phone to download it all. Record resets and
account erasure remain distinct operations, with their actual effects stated.

## Small implementation plan

Keep Node.js, the proposed durable database and the existing frontend. This
review provides no measured reason for a Rust rewrite or extra services.
One backend can own accounts, rounds, purchases and incremental summaries.
An Insights entitlement and analysis-method version are the main additions
missing from the existing suggested record groups [L1].

The owner has authorized implementation. A local subset of milestone C
has now been implemented first so the products are reviewable. Production
milestones B and D are still required before accepting real purchases.
The following is the proposed commercial release order.

| Milestone | Scope and playbook mapping | Acceptance outcome |
| --- | --- | --- |
| A. Agree the small product | Phase 00 additions; GUI specifications for Shop and Insights. | Decisions and sample screens describe both paid products without changing the table's main interaction. |
| B. Playable social game | Phases 01–03, including raw analysis capture and reset IDs. | Six players share rounds; balances, bets and reconnects survive restarts. |
| C. Demonstrate paid value | Phase 06 catalogue; bring core Phase 08 forward; Phase 05 simulator for both product types. | A tester can buy chips, acquire/show an item, unlock Insights, and inspect an honest current-record report. |
| D. Launch the two products | Approved provider sandbox, relevant Phase 09 checks, then explicitly authorized Phase 10. | Entitlements and chips reconcile; analytics calibration passes; the compact phone flows work. |
| E. Complete remaining modes and boards | Phases 04 and 07, plus later analysis refinements. | Continuous replay and all agreed Hall of Fame periods are delivered without holding up validation of paid value. |

Milestone E is staged delivery of already requested features, not cancellation.
If replay and the complete boards are mandatory at the first paid launch,
place E before D. Choose that release boundary explicitly. Full arbitrary
sector scans, numerous analysis filters and automatic statistical advice can
wait; named sectors and plain personal explanations cover the first release.

Essential checks for the first commercial version:

1. The table remains usable at agreed phone sizes; added seats do not shrink
   betting targets below the agreed usability standard.
2. Duplicate payment notifications never duplicate chips or access time;
   test activity cannot reach production wallets or entitlements.
3. Insights includes all eligible rounds since reset across logout/reconnect,
   and includes grants only as separate wallet events, never as profit.
4. Independent known cases validate payout vectors, overlaps, the 30:70
   examples, zero, sparse samples, duplicate replay rows and source changes.
5. Validate calculator parity and both directions of detection. Simulated
   fair histories, repeated looks and adaptive betting must quantify the
   limitations before commercial claims are approved; do not promise a
   lifetime error rate from the per-check threshold.
6. Reset, expiry and purchase failures have clear screens; an ordinary or
   insufficient record receives the same truthful verdict before payment.

## Changes to make in the playbook after decisions

- Add the two revenue streams and the clarified inverted-advantage definition
  to the confirmed scope. Preserve existing package and collectible answers.
- Change Q03.01, Q03.07 and Q03.08 to the Quick Join and compact-seat design
  if accepted; preserve Menu and source-selection decisions.
- Extend Phase 05 with analysis-product orders, access expiry, extension,
  refund handling and server-side entitlement checks.
- Resolve Q02.12 against whole-current-record analysis; extend Q02.10 with
  the evidence method/version and reproducible summary boundary.
- Make Q08.02's default the complete current record. Move authoritative
  verdicts and paid-access enforcement to the server under Q08.09; keep
  client chart interaction. Specify continuous monitoring in Q08.06.
- Reconcile Q07.06 with accepted current-record resets. Do not silently
  resolve the still-open treatment of finalized historical boards.
- Add the two completed RNG reports to the evidence links. Their conclusion
  is no significant departure detected in the tested properties, not proof
  of fairness or a detected personal advantage [L4, L5].
- Update the phase map if the proposed commercial release order is accepted.
  Replace all 11 prompt paths with the repository workbook path and explicitly
  include the accepted decision record, avoiding the older OneDrive copy.

## Entertainment positioning and country reach

Use a clear product description: **“Social roulette with play chips, virtual
collectibles and personal play analysis. No cash-out or player transfers.”**
Keep collectibles non-redeemable and prizes without material value. Sell
analysis of game records, without promising real-money earnings or changed
odds. These are concrete product properties consistent with the owner's
entertainment intent.

The entertainment description alone does not establish availability in
every country. Britain's Gambling Commission discusses social casino games
without money-or-money's-worth prizes separately from licensed gambling, and
identifies conversion/trading of virtual items as relevant [E3, E4]. That is
a jurisdiction-specific example, not a worldwide determination. Stripe's
policy separately describes product and territorial restrictions [E5].

Confirm the operator and initial player countries, applicable age/access
rules and provider acceptance before enabling live sales. Keep this as a
launch decision; it need not expand the everyday game interface or prevent
local product work. Neither country clearance nor provider approval was
obtained in this review.

## Short decision sheet

The two income sources, inverted-advantage definition, calculator-based
sample requirement, golf-course name and authorization to start coding are
confirmed. The local preview uses a non-renewing 30-day test pass. Live
pricing, billing approval and other items below are still proposals:

```text
PRODUCT DESIGN REVIEW — decisions

1. Keep current table; Quick Join; six compact avatars;
   Shop/Insights outside the betting surface: ACCEPT / CHANGE

2. One paid Insights product; complete record since reset;
   basic truthful evidence status free, detailed explanation paid:
   ACCEPT / CHANGE

3. Insights billing: recommended 30-day non-renewing pass,
   or one recurring monthly membership: [CHOOSE]
   Price: [OWNER PRICE; USD 4.90 is only a test hypothesis]

4. Add a 50,000-chip starter cosmetic; retain existing luxury prices:
   ACCEPT / CHANGE

5. First paid release uses live draws; replay/full Hall of Fame follow:
   ACCEPT / REQUIRE THEM BEFORE PAID LAUNCH

6. Incorporate this review into the repository playbook:
   ACCEPT / CHANGE

Continue to resolve the existing operator/country/provider decisions
and reset/history definitions before the dependent implementation.
```

For the next backend phase, use this scoped prompt:

```text
Read these files in C:\automation\prototypes\rou\docs:
MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
PHASE_00_DECISIONS.md
MULTIPLAYER_PRODUCT_DESIGN_REVIEW.md

IMPLEMENTATION_01_COLLECTION_AND_INSIGHTS.md

My remaining product decisions follow: [PASTE ANSWERS]

Continue from the existing Shop and Insights preview. Implement the durable
account, wallet and round ledger needed for six-player shared tables.
Persist accepted wagers and settlements, current-record boundaries,
collectibles, orders and analysis access. Preserve the current table.
Use the attached Bias Calculator for required N and both directions of
personal evidence. Test reconnects, restart recovery, duplicate settlement
and isolated test purchases before connecting real payment providers.
Keep unresolved countries, live pricing and historical-board decisions
explicit. Do not activate live billing or deploy during this phase.
```

## Evidence and review verification

- Reviewed the repository workbook (version 1.2), accepted Phase 00 decisions,
  local interface source and both saved RNG analysis reports [L1–L5].
- Visually inspected the published table as a guest. No real payment,
  account sign-in, multiplayer load test or real-phone test was performed.
- Recomputed the illustrative binomial and Beta values with SciPy 1.18.1
  using the calculator's documented inclusive-tail definition [L6]. These
  examples are not a new analysis of any player's records.
- Application behavior now includes the first local implementation [L7].
  All 80 Node tests pass, including calculator parity, payout portfolios,
  duplicate replay observations, checkout and the existing server tests.
  Two Windows test-harness issues were corrected: shell glob quoting and
  a file-URL-to-path conversion. The backend's behavior was not changed.
- Browser checks covered local test checkout, ownership/showcase, one real
  local round's analysis, the reset guard and narrow Shop/Insights layouts.
  Detailed steps, coverage limits and screenshots are in [L7].
- External sources were consulted on 18 October 2026. Recheck applicable
  provider and territorial requirements when the actual launch is selected.

[L1]: MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
[L2]: PHASE_00_DECISIONS.md
[L3]: ../index.html
[L4]: 2M_RNG_ANALYSIS.md
[L5]: 2M_RNG_SECTOR_ANALYSIS.md
[L6]: ../../bias_calc/index.html
[L7]: IMPLEMENTATION_01_COLLECTION_AND_INSIGHTS.md
[L8]: ../assets/collectibles/manifest.json
[L9]: ../client/insights-model.js
[E1]: https://arxiv.org/abs/1810.08240
[E2]: https://www.itl.nist.gov/div898/handbook/prc/section4/prc473.htm
[E3]: https://www.gamblingcommission.gov.uk/consultation-response/changes-to-the-licence-conditions-and-codes-of-practice-on-age-and-identity/av-ci-consultation-responses-summary-av-proposed-changes-to-social
[E4]: https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/digital-and-virtual-currencies
[E5]: https://stripe.com/legal/restricted-businesses
