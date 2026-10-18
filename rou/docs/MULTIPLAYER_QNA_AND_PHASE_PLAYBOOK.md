# European Roulette: multiplayer Q&A and phase playbook

Version: 1.2 | Prepared: 16 October 2026 | Timezone: Asia/Kuala_Lumpur

## How to use this file

Read [Phase 00 owner decisions](PHASE_00_DECISIONS.md) together with this
workbook. The owner's Phase 00 answers have been recorded. Those explicit
answers override conflicting recommendations elsewhere in this workbook;
unanswered details remain unresolved. Every later phase must read both files.

1. Answer Phase 00 first. Write `Accept` to accept a recommendation, or write
   your replacement. `Defer` means the decision remains unresolved.
2. Answer the questions for the next phase before beginning that phase. You
   do not need to answer the entire document at once.
3. Use the answer template below to send answers by question ID. You can
   answer in this file or paste the template into chat.
4. Copy the appropriate phase-start prompt near the end into a new chat.
   It instructs the agent to read this file and implement only that phase.
5. Save the phase's completion report and carry it into the following phase.

Expected result: a recorded set of product decisions and independently
reviewable releases, with acceptance evidence for each completed phase.

Recommendations are proposals, not answers already approved by the owner.
An empty answer is unresolved. A deferred decision blocks only work that
depends on it. Continue independent, authorized work.

This document is planning material. Creating or reading it does not authorize
application changes, commits, pushes, deployment, account creation, purchases,
live payment processing, or messages to third parties. A copied phase-start
prompt explicitly authorizes the local implementation described in it.

Do not paste passwords, payment secrets, private keys, or real card details
into the answer sheet. Supply required secrets through the chosen secret store.

### Answer template

```text
Project: European Roulette multiplayer
Phase: 00
Decision date:

Accept all recommendations in this phase: YES / NO
Exceptions and explicit answers:
Q00.01 =
Q00.02 =
...
Deferred decisions and the phases they affect:

For questions requiring my own information, such as budget, countries,
provider, credentials, or package prices, unanswered fields remain unresolved.

Implementation now authorized: NO
Local commits authorized: NO
Git push authorized: NO
Deployment authorized: NO
Live payments authorized: NO
```

When starting implementation, use a phase-start prompt and change the relevant
authorization lines explicitly. Earlier authorization in the same chat remains
valid; do not ask for it repeatedly.

## Confirmed scope and current evidence

### Confirmed by the owner

- Credits cannot be withdrawn or transferred between players.
- Luxury items are virtual collectibles, not redeemable physical goods.
- A table displays the player and at most five other players: six total.
- The intended product includes registration, portraits, retained bankrolls,
  raw analysis data, credit purchases, a luxury shop, rankings, daily wealth
  compilation, weekly data preparation, and statistical analysis.
- Payments need real and simulated modes. Developer stress tests are required.
- This stage is planning; application implementation has not been authorized.
- The owner supplied Phase 00 answers, including USD credit packages,
  collectible prices, retained bankruptcy replenishment, three leaderboard
  types, record resets, phone-first design, and launch-page navigation.
  See `PHASE_00_DECISIONS.md` for accepted details and open definitions.
- Follow-up answers confirm net roulette profit, profit minus theoretical
  expected profit plus a separate risk-adjusted EV score, and a last-settled-
  wager inactivity clock. Inactivity resets profit/EV records, preserving
  account and wealth. Roulette Royale is a product-experience reference.

Recommendations below remain proposals unless accepted by the owner. Some
original recommendations are superseded by the recorded Phase 00 answers.

### Verified project facts

| Evidence | Finding |
| --- | --- |
| [S1] | App folder is `C:\automation\prototypes\rou`. |
| [S2] | Git root is `C:\automation\prototypes`. |
| [S2] | Remote is `https://github.com/zhonecloud-sketch/prototypes.git`. |
| [S2] | Push dry run succeeded on 14 October 2026; recheck before pushing. |
| [S3] | Main 3D frontend currently handles wagers and settlement locally. |
| [S3] | Frontend starts with 10,000 credits and has a 2,500 bankruptcy grant. |
| [S3] | Its statistics retain the latest 222 completed spins. |
| [S3] | Guest saves use local storage; Google saves use Drive app data. |
| [S4] | Node.js backend already broadcasts rounds through WebSockets. |
| [S4] | Backend balances are in memory and tied to a socket connection. |
| [S4] | Backend defaults differ from the main frontend's timing and bankroll. |
| [S5] | Backend does not yet cover all frontend inside/called bet types. |
| [S6] | `real.html` declares 21,600 output records at 30-second intervals. |
| [S6] | Its metadata declares a source with 2,000,000 records. |
| [S7] | `assets/2m-rng.txt` exists and starts with one number per line. |

These describe the files inspected, not proof that every existing behavior
passes tests. Reinspect the current repository at each implementation phase.

### Important distinctions to preserve

- **Registered account:** identity shared across devices and connections.
- **Available credits:** credits the player can spend immediately.
- **Committed credits:** accepted stakes awaiting settlement.
- **Roulette profit:** total settled returns, including returned stakes,
  minus all settled stakes, including losses, since the record began. Credit
  purchases, replenishment grants, and collectible spending are not wagers
  or roulette winnings.
- **EV performance:** actual net roulette profit minus theoretical expected
  net profit, with a separate score adjusted for bet risk. This direction
  is accepted; exact normalization and ranking eligibility remain to specify.
- **Inactivity:** time since the player's last settled wager. Crossing the
  agreed three-month threshold resets profit/EV records, not wealth or the
  account. Calendar arithmetic and historical-board treatment remain open.
- **Wealth:** the chosen valuation of available credits, committed stakes,
  and owned collectibles. It is game wealth, not withdrawable money.
- **Fresh draw:** a result generated by the live server for that round.
- **Replay draw:** a result drawn from an existing recorded sequence.
- **Record reset:** restarts profit and EV records, including their ranking
  basis, while preserving wealth. Its effect on finalized historical boards
  and deletion versus a new record boundary remains to be answered. Account
  erasure is a separate owner-requested operation requiring confirmation.
- **Payment simulator:** an internal fake provider for automated/stress tests.
- **Provider sandbox:** a payment company's test environment.
- **Live payment:** an actual monetary charge.

## Phase map and dependency order

| Phase | Deliverable | Depends on | Release value |
| --- | --- | --- | --- |
| 00 | Product rules and decision record | None | Agreed scope |
| 01 | Hosting, database, environments | Relevant Phase 00 answers | Foundation |
| 02 | Accounts, profiles, persistent ledger | 01 | Persistent players |
| 03 | Six-seat multiplayer and durable rounds | 02 | First playable beta |
| 04 | Continuous weekly replay preparation | 03 | Recorded-data mode |
| 05 | Simulator and approved provider sandbox | 02, 03 | Test purchases |
| 06 | Luxury shop and ownership | 02, 05 simulator | Complete test economy |
| 07 | Wealth snapshots and hall of fame | 03, 04, 06 | Competition views |
| 08 | Raw-data access and client analysis | 03, 04 | Analysis release |
| 09 | Recovery, load tests, invited beta | 03 through 08 | Release candidate |
| 10 | Live-payment launch | 05, 09 and launch decisions | Paid release |

For the complete product, finish 04 before 05. Work limited to the internal
payment simulator can proceed independently once the ledger is stable.
Phase 08 needs raw events recorded from Phases 02 and 03; do not defer data
capture until the analytics screens are built.

Recommended implementation: one Node.js application, PostgreSQL, object
storage, WebSockets, and restart-safe scheduled jobs. Start with one draw
authority, rather than several independent servers generating the same table.
This is a proposed architecture, not a measured capacity claim.

## Phase 00: product and economy rules

**Q00.01 — What is the first playable release?**

Recommendation: account login, persistent test credits, the existing 3D game,
six-seat tables, shared results, and reconnect recovery. Payments, shops,
rankings, and advanced analytics follow in their own phases.

Your answer: yes

**Q00.02 — Which countries, operator entity, currency, and audience apply?**

Recommendation: owner supplies the operator's country/entity, intended player
countries, age policy, and charging currency. Do not infer these from the
owner's timezone. Real-payment eligibility depends on the actual product and
territories; closed-loop status alone does not settle it. See [E1].

Your answer: this is not gambling but rather an amusement game. Confirm the
definition by its gameplay and players' country law. Currency is in USD only.

**Q00.03 — How are free credits issued?**

Recommendation: preserve 10,000 starting test credits for the first beta;
disable automatic repeated bankruptcy grants in the future competitive/live
economy until a grant policy is chosen. Record every grant. Decide its amount,
frequency, eligibility, and whether free grants remain in the paid release.

Your answer: yes to 10k initial credits. Retain the existing bankruptcy 
replenishment regardless of single or multiplayer mode. Only record the grant
in multiplayer mode through each result of each wager. Credit purchases are
for the players who wish to enjoy in-game luxury purchases or to experience 
high-stake wagering strategies.

**Q00.04 — What are the credit packages and prices?**

Recommendation: owner supplies currency, package IDs, monetary prices, credit
amounts, and any bonus credits. Use fixed packages initially. Show price and
credits before checkout. Do not invent production prices.

Your answer: 4.90 USD for 100k chips, 9.90 USD for 1M chips, 49.90 for 50M 
chips, 99.90 for 500M chips, 499.90 for 5B chips, 
9.90 USD for 7M chips (reserved for sale period).

**Q00.05 — What determines the hall of fame?**

Recommendation: separate net roulette-profit and total-wealth boards, each
with daily, weekly, monthly, and all-time periods. Purchased credits count
toward wealth, never toward roulette profit. Keep replay and fresh-draw
competitions distinct. Add ROI rankings later if desired.

Your answer: there shall be 3 types of hall of fame: wealth, profits and
Expected Value. Players can always choose to reset the records, or server
shall reset the records if players have been inactive for more than 3 months.
Purchased credits, luxury items all count towards wealth. Profits are the
positive stream of cash players have made since the start of their records.
Expected value hall of fame tracks the profits against the odds players
played for.

**Q00.06 — What does a player's reset change?**

Recommendation: reset personal analysis by starting a new analysis epoch.
Preserve bankroll, purchases, daily wealth records, and competition history.
Provide separate choices for deleting personal analysis records and deleting
an account, subject to the agreed retention policy. Do not treat reset as
permission to rewrite accounting history.

Your answer: resetting records will affect profits and expected value, not 
wealth. If players choose to erase account, then everything is wiped off.
Confirmation is required before each execution.

**Q00.07 — What calendar defines periods?**

Recommendation: use Asia/Kuala_Lumpur; day begins 00:00, week begins Sunday
00:00, month begins on its first day. Store timestamps in UTC and retain the
calendar policy used for each finalized period. All-time starts at production
launch, excluding test activity.

Your answer: Yes

**Q00.08 — What do luxury items do?**

Recommendation: virtual collectibles with a fixed acquisition valuation,
profile display, and selected table decorations. No resale, rental income,
depreciation, upkeep, or player transfers in the initial version.

Your answer: Luxury items are luxury watch 200k, pendant 400k, Limo 500k,
yacht 25M, mansion 80M, gold course 160m, private jet 300m, island 500m,
shuttle 5b. No to resale, rental, depreciation, upkeep and transferable.

**Q00.09 — Which result sources belong in each economy?**

Recommendation: fresh server draws for the primary competitive economy;
recorded replay for a separate analysis/test economy and separate boards.
The public `2m-rng.txt` sequence can be analysed in advance. Hiding a weekly
export does not make that existing public sequence unpredictable. If replay
must use purchased credits, decide that explicitly and disclose its nature.

Your answer: real.html is the weekly extracted sequence from 2m-rng. The 
records must ensure seamless connection of number sequence from past week.
We shall perform a perlim analysis to decide if the numbers are bias, or not.

**Q00.10 — What are the initial stake and balance limits?**

Recommendation: owner chooses minimum stake, per-target/per-round limits,
maximum wallet balance, and package limits. Enforce integer credits and
safe arithmetic through maximum possible returns, not just the stake.
The backend remains authoritative even if the browser is modified.

Your answer: Yes

**Q00.11 — What actions may the agent take during each phase?**

Recommendation: copied start prompts authorize local implementation and
appropriate tests. Commit, push, deployment, external account setup, and live
charging remain explicit fields. A phase authorization is not permission to
modify unrelated prototypes in the parent repository.

Your answer: yes

**Q00.12 — What are the budget, deadline, and scope exclusions?**

Recommendation: owner supplies monthly hosting budget and any target date.
Initially defer chat, friends, trading, native mobile apps, AI advice,
collectible income, and a Rust migration. Add optional features through a
separate scope decision rather than an unbounded 'others' requirement.

Your answer: This is designed for mobile phone users and hence the
architecture and GUI design must take care of the compact hardware and 
screen sizes. We shall defer chat, friends, trading, AI advice, colletible
income and RUST migration for now.

Q00.13 - move  Spin Source peseduo- cleint RNG/Real-life recorded feed - feed details to launch page.

Q00.14 - menu button shall always return the GUI to launch page, not Google Account setup details

### Phase 00 completion check

- Confirmed and unresolved decisions are recorded separately.
- Missing owner-specific values have not been fabricated.
- Each unresolved decision identifies the work it blocks.
- Phase order, release boundaries, and next-phase scope are agreed.

## Phase 01: infrastructure and environments

**Q01.01 — Keep Node.js or rewrite in Rust?**

Recommendation: keep Node.js and extend the existing backend. Revisit Rust
only if measured CPU, latency, or memory constraints justify migration.

Your answer:

**Q01.02 — Where should the backend run?**

Recommendation: choose a host that supports a persistent Node.js process and
secure WebSockets, near the intended players. Owner approves provider,
region, plan, and budget. Sites remains an alternative architecture requiring
a Workers adaptation; do not assume the current server deploys unchanged.

Your answer:

**Q01.03 — What database and media storage should be used?**

Recommendation: managed PostgreSQL for durable structured records and
private object storage for uploaded originals. Serve approved portrait
derivatives through controlled public URLs. Keep database credentials on the
server. Owner chooses accounts/providers within budget.

Your answer:

**Q01.04 — Where does the frontend live?**

Recommendation: retain the present GitHub Pages URL initially and configure
its backend endpoint. Explicitly allow that origin. Use HTTPS/WSS. Validate
cross-site authentication/cookie behavior before committing to this layout;
a shared app/API domain may simplify deployment later.

Your answer:

**Q01.05 — How are environments separated?**

Recommendation: local development, isolated hosted staging, and production;
separate databases, media prefixes/buckets, secrets, payment credentials,
test wallets, and ranking namespaces. Display a staging indicator.

Your answer:

**Q01.06 — How much recovery is required?**

Recommendation: automated backups plus a tested restore. Proposed initial
goals: at most 15 minutes of database loss after a disaster and restoration
within four hours, subject to provider support and budget. Owner confirms
these goals or chooses different ones. Normal process crashes must not lose
committed bets or balances.

Your answer:

**Q01.07 — How are jobs and deployments managed?**

Recommendation: versioned database migrations, a restart-safe job runner,
one active round owner per table, health endpoints, structured logs, and an
explicit rollback procedure. Scheduled work must be safe to retry.

Your answer:

**Q01.08 — What traffic must the first deployment support?**

Recommendation: define a measurable target before buying infrastructure.
Proposed test tiers: six players, 60 players, then 600 connected players.
These are test targets, not promised capacity. Owner supplies the intended
launch load, bets per second, latency target, and spend ceiling.

Your answer:

### Phase 01 completion check

- A local backend and database start from documented commands.
- Staging and production configuration cannot accidentally share test funds.
- Database migrations and a restore drill succeed.
- Deployment requirements, endpoint layout, and operational costs are known.
- No public deployment or cloud purchase occurs without its authorization.

## Phase 02: accounts, profiles, and persistent credits

**Q02.01 — Which registration methods are required first?**

Recommendation: Google login first, with server-verified identity and an
internal account ID. Do not use a display name, email text supplied by the
browser, or socket ID as proof of identity. Add other methods only if needed.

Your answer:

**Q02.02 — May guests play multiplayer?**

Recommendation: retain a clearly labelled guest/demo experience if desired,
but require registered accounts for persistent competitive play, purchases,
and the hall of fame. Never place fake guests in live seats without labelling
them as test bots.

Your answer:

**Q02.03 — What profile information is stored and public?**

Recommendation: store account ID, provider identity, display name, portrait,
created date, account status, and consent/version records as needed. Show
only display name, approved portrait, and selected public achievements.
Keep login email and payment details private.

Your answer:

**Q02.04 — How can portraits and display names be changed?**

Recommendation: provider portrait or uploaded image, default avatar fallback,
controlled image size/type, sanitized names, and an administrator removal
path. Proposed upload limit: 2 MB, with a resized image derivative. Decide
name uniqueness, change frequency, and moderation policy.

Your answer:

**Q02.05 — How do multiple tabs and devices behave?**

Recommendation: one account wallet shared across devices, with serialized
financial changes. Initially permit one active betting seat per account;
another device may observe or explicitly take over. Reconnect restores the
same account and accepted wagers.

Your answer:

**Q02.06 — What happens to existing guest and Google Drive balances?**

Recommendation: keep existing saves as legacy/demo records. Start the new
server economy from an explicit grant. Any migration grant is labelled and
recorded; client-provided bankrolls are not imported as trusted funds.

Your answer:

**Q02.07 — What is the source of truth for credits?**

Recommendation: a persistent transaction ledger linked to the account.
Record source and destination accounts for grants, bets, payouts, purchases,
and adjustments so movements reconcile. A cached balance is updated in the
same database transaction; it is not the only evidence of ownership.

Your answer:

**Q02.08 — What number formats are used?**

Recommendation: integer credits; monetary orders use integer minor units
plus currency. Define limits and a wire format that avoid JavaScript
precision loss. Never calculate wallet balances with floating-point money.

Your answer:

**Q02.09 — How are repeated requests handled?**

Recommendation: every balance-changing request has a stable operation ID.
Database uniqueness and transactions prevent repeated requests from causing
multiple grants, spends, or payouts. A retry returns the existing outcome.

Your answer:

**Q02.10 — What raw data is retained from the start?**

Recommendation: permanent IDs, server times, result-source/version, round
outcomes, accepted bet definitions, grouped wagers, stakes, returned credits,
wallet transactions, purchase references, and reset boundaries. Keep result
records independent of how many players observed or bet on them.

Your answer:

**Q02.11 — What does deleting or resetting analysis data mean?**

Recommendation: a new epoch resets the normal personal dashboard. Offer
deletion of a separate personal analytics copy if desired. Explain which
minimal accounting/competition records remain and for how long. A personal
reset must not silently change the public result sample or other players'
records. Account deletion is a separate workflow.

Your answer:

**Q02.12 — What retention and access rules apply?**

Recommendation: define policies by record type and jurisdiction before live
launch. Proposed beta policy: retain personal raw analysis for 12 months,
allow authorized export, and keep required accounting evidence separately.
The owner confirms final durations, deletion behavior, and staff access.
Do not assume indefinite retention is required or permitted.

Your answer:

### Phase 02 completion check

- Registration/login, logout, expired sessions, and account recovery behave
  as specified for the chosen identity provider.
- Reload/reconnect/restart preserves committed wallet changes.
- Concurrent purchases/bets cannot overspend the same balance.
- Duplicate operation IDs cannot issue duplicate credits.
- Account A cannot access account B's private records.
- Legacy saves and test grants cannot masquerade as paid credits.
- Profile upload/name validation and the agreed reset semantics are checked.

## Phase 03: multiplayer gameplay and the table GUI

**Q03.01 — How do players find a table?**

Recommendation: a simple lobby with quick join and a table list showing
mode and occupied seats. Add invite-only tables later unless needed now.

Your answer:

**Q03.02 — What is the seating rule?**

Recommendation: exactly six betting seats per table, including the player.
Reserve/release seats on the server. A full table offers another table.
Observers do not occupy seats; decide whether observing is needed initially.

Your answer:

**Q03.03 — What happens when someone disconnects?**

Recommendation: hold their seat for a proposed 60-second grace period.
Their accepted bets still settle. Reconnect restores their seat when it is
still reserved; otherwise restore their wallet and outstanding results.
Leaving must not refund an already accepted wager merely due to disconnect.

Your answer:

**Q03.04 — Which round schedule is authoritative?**

Recommendation: use the main frontend's 30-second cycle: 20 seconds betting,
seven seconds spin presentation, three seconds payout presentation. The
server supplies deadlines; device-clock changes do not reopen betting.
Choose precisely when result and settlement messages are delivered.

Your answer:

**Q03.05 — Are draws shared across tables?**

Recommendation: initially share one authoritative schedule/result stream
among tables using the same mode/feed version. Seats form social groups;
wallets and bets remain individual. Never let each process independently
generate a result for the same shared round. Independent table wheels are
a separate option if the owner wants them.

Your answer:

**Q03.06 — Which existing bet actions remain available?**

Recommendation: support all current inside, outside, and French called bets,
including grouped placement, repeat, double, undo, and clear during the open
window. A called bet succeeds completely or fails completely. Cancellation
after the deadline is rejected. Shared rules eliminate frontend/backend
paytable differences.

Your answer:

**Q03.07 — What can other players see?**

Recommendation: portrait, display name, seat state, selected collectible,
and current round's total stake. Exact target chips and bankroll visibility
are separate choices. Hide email, payment history, and private analysis.

Your answer:

**Q03.08 — What layout and platforms must be preserved?**

Recommendation: preserve the existing wheel and table styling, desktop use,
and phone landscape behavior. Add six compact seat displays with a clear
self marker. Provide reduced-motion behavior and readable connection state.
Owner supplies any mandatory device/browser targets.

Your answer:

**Q03.09 — What happens on server restart or a failed round?**

Recommendation: persist round identity, deadlines, accepted stakes, and
required outcome data. Resume or settle the recorded round once. If a round
cannot be completed, apply an explicit recorded cancellation/refund policy;
never silently generate a replacement outcome for accepted wagers.

Your answer:

**Q03.10 — How is visual synchronization defined?**

Recommendation: all clients agree on round ID, phases, result, and settlement.
Animations use server timestamps and catch up after backgrounding. Reuse a
shared visual seed if matching wheel motion is desired. Pixel-identical
animation on every device is not required.

Your answer:

**Q03.11 — What proof of draw integrity is shown?**

Recommendation: preserve commit/reveal verification for fresh draws, while
documenting its limits. A replay checksum proves dataset identity, not a
fresh unpredictable draw. Keep the two explanations distinct.

Your answer:

**Q03.12 — What is excluded from the first table release?**

Recommendation: no chat, voice, friends, gifts, player-to-player transfers,
or unlabelled bots. These can be scoped later without delaying core play.

Your answer:

### Phase 03 completion check

- Six browser sessions share matching round IDs/results and separate wallets.
- Concurrent joins never overfill a six-seat table.
- The seventh player receives the agreed full-table behavior.
- All supported bet types match the agreed paytable.
- Called bets, double, undo, and clear are atomic and deadline-controlled.
- Late, duplicated, malformed, and insufficient-funds bets are handled.
- Disconnect/reconnect, multiple devices, background tabs, clock changes,
  and restart during a wagered round cannot duplicate or avoid settlement.
- Private player events are not broadcast to other players.

## Phase 04: weekly recorded-data preparation

**Q04.01 — What is the provenance of `2m-rng.txt`?**

Recommendation: owner supplies its origin, rights to use it, and whether
it is physical-wheel observations or generated RNG output. Until established,
describe it as a replay dataset; the filename alone does not prove provenance.

Your answer:

**Q04.02 — What does 'continuous weekly data' mean?**

Recommendation: consecutive, non-overlapping source rows, in original order,
with the next week beginning immediately after the previous week's last row.
No random offsets, shuffling, or weekly restart at row one unless requested.

Your answer:

**Q04.03 — What is the exact weekly size and calendar?**

Recommendation: 20,160 results at 30-second spacing for seven days. Use
the Phase 00 timezone/week boundary. Reconcile the current 21,600-row export
through an explicit migration rather than silently dropping live rounds.

Your answer:

**Q04.04 — What is the initial source cursor and anchor date?**

Recommendation: owner selects whether to begin at source row one or continue
an existing verified cursor. Record the start week, source index convention,
and first activation timestamp. Do not infer consumed source rows from a
browser's incomplete history.

Your answer:

**Q04.05 — When is each week generated?**

Recommendation: prepare the next week a day before activation, validate it,
and activate at the exact boundary. Generation and activation are separate
restart-safe jobs. A retry produces the same artifact and cursor movement.

Your answer:

**Q04.06 — What happens at source exhaustion or a partial last week?**

Recommendation: alert well in advance and stop replay at exhaustion unless
a replacement source is approved. Do not silently wrap or label repeated
data as new observations. Owner chooses stop, explicit cycle, or replacement.

Your answer:

**Q04.07 — What is retained to reproduce a replay week?**

Recommendation: source checksum, validated row count/range, start/end cursor,
week ID, activation timestamps, interval, generator version, artifact hash,
and provenance. Preserve original input separately from generated exports.

Your answer:

**Q04.08 — Who may download the full source and future output?**

Recommendation: replay-analysis datasets may be downloadable as a deliberate
feature, with advance predictability disclosed. Fresh competitive draws
must not expose future results or secrets. Restricting new exports cannot
undo prior publication of the existing source.

Your answer:

**Q04.09 — What happens if preparation or activation fails?**

Recommendation: preserve the last known state, alert the operator, and show
the mode as unavailable when its schedule has no valid result. Refund only
under the agreed failed-round policy. Do not silently switch to fresh RNG.

Your answer:

**Q04.10 — How are replay modes separated in analysis and rankings?**

Recommendation: attach source/version/mode to every round and bet; separate
replay wallets or explicitly segregate their effects. Detect repeated source
rows so replays do not inflate the count of independent observations.

Your answer:

### Phase 04 completion check

- Validate actual input rows, integers 0 through 36, and handling of malformed
  rows; do not rely only on existing metadata claiming two million rows.
- Generate adjacent weeks without unintended overlap or gaps.
- Test a week boundary, a restart, repeated job execution, a missed job,
  partial final input, and full exhaustion.
- Round IDs and timestamps map to the intended source row.
- Frontend source labels and competition eligibility match the agreed rules.

## Phase 05: purchases, simulation, and provider sandbox

**Q05.01 — Which payment provider will support this exact product?**

Recommendation: owner selects a provider after describing the closed-loop
roulette economy, territories, and virtual items accurately. Do not assume
Stripe or another generic card provider accepts the model. Simulator work
can proceed without provider selection. See [E1].

Your answer:

**Q05.02 — What should the credit-purchase GUI show?**

Recommendation: package selector, currency price, credit/bonus amount,
confirmation, hosted card checkout, pending status, receipt/order history,
failure/retry state, and support reference. Prices come from the server.

Your answer:

**Q05.03 — Who handles card details?**

Recommendation: provider-hosted checkout or approved hosted fields. The app
stores provider IDs and minimal receipt/status information, not card numbers
or CVC. Follow the chosen provider's actual integration requirements.

Your answer:

**Q05.04 — What confirms credit issuance?**

Recommendation: verified server-side payment status and provider callbacks,
with a unique order/provider-payment reference. Check paid amount, currency,
package version, environment, and owner. Browser success screens alone do
not issue credits. Repeated callbacks and reconciliation use one fulfillment
operation. Stripe's fulfillment guidance illustrates this pattern [E2].

Your answer:

**Q05.05 — How do the three modes differ?**

Recommendation: internal simulator for stress/failure tests; provider sandbox
for integration tests; live mode only after Phase 10 authorization. The
server selects allowed mode/environment. Test orders cannot fulfill into
production wallets, and a developer GUI cannot grant live credits.

Your answer:

**Q05.06 — What failures should the simulator support?**

Recommendation: success, decline, pending, cancellation, timeout, delayed
notification, duplicate/out-of-order notification, refund, dispute, and
provider outage. Include developer-only controls and deterministic test
scenarios. Do not load-test a real provider sandbox unless its terms permit
it; use the internal simulator instead [E3].

Your answer:

**Q05.07 — What refund and dispute policy applies after credits are spent?**

Recommendation: owner agrees the customer policy with provider requirements
before live launch. Track reversible credit grants and related adjustments;
do not silently rewrite historical bets. Decide whether insufficient credits
create a restricted account, debt balance, or manual review. Keep this
policy explicit and testable.

Your answer:

**Q05.08 — How are bonuses, tax, fees, and receipts handled?**

Recommendation: version packages and preserve original price/credit terms
on each order. Owner supplies tax and receipt requirements for the operator
and target countries. Keep provider fees separate from credits granted;
do not infer tax treatment or reduce a package after payment.

Your answer:

**Q05.09 — How are missing notifications recovered?**

Recommendation: a periodic reconciliation job checks unresolved orders with
the provider and issues any missing fulfillment once. Give administrators
order/event traceability and retry tools with recorded reasons.

Your answer:

**Q05.10 — What can developers do in the test payment screen?**

Recommendation: approved test users can trigger scenarios, create labelled
test orders, inspect event traces, and run bounded stress tests. Require
server-side role checks; do not depend on hiding a button. No production
funding or access to another user's private payment details.

Your answer:

### Phase 05 completion check

- Simulator passes all agreed scenarios under concurrent requests.
- Duplicate fulfillment cannot produce duplicate credits.
- Changed package prices cannot alter an already created order's terms.
- Cancelled or unpaid orders do not grant credits.
- A paid order survives app failure and reconciles correctly.
- Sandbox transactions cannot touch live wallets or production rankings.
- Provider sandbox is checked if eligibility/access is available; otherwise
  report it as unverified and complete the independent simulator work.
- Live charging stays disabled.

## Phase 06: luxury shop and collectible ownership

**Q06.01 — What is the initial catalogue?**

Recommendation: a small owner-approved set across plazas, private jets,
jewellery, and sports cars. Supply names, descriptions, credit prices,
images, and ownership rules. Prefer generic designs unless rights to real
brands/assets are established. Do not invent final prices.

Your answer:

**Q06.02 — Can the same item be bought more than once?**

Recommendation: one copy per player per unique collectible in the first
release, unless a quantity-based item is explicitly designated. Enforce the
rule in the database, including simultaneous requests.

Your answer:

**Q06.03 — What value contributes to wealth?**

Recommendation: the credit price actually paid at acquisition, fixed for
that owned item. Later catalogue price changes do not rewrite historical
wealth. Free rewards have an explicit valuation policy. No implied resale
or cash value exists.

Your answer:

**Q06.04 — Is there limited stock or scarcity?**

Recommendation: unlimited catalogue availability initially. Add limited
editions later only with an agreed stock-allocation and reservation policy.

Your answer:

**Q06.05 — Where are owned items displayed?**

Recommendation: personal collection page, public profile selection, and
one compact table badge/showcase. Do not obscure bets or wheel results.
Owner chooses whether other players may view the complete collection.

Your answer:

**Q06.06 — Can purchases be cancelled or reversed?**

Recommendation: no self-service resale in version one. Define correction
and refund rules explicitly; any reversal records both item and ledger
changes. A stale browser cannot buy at an obsolete price without confirmation.

Your answer:

**Q06.07 — What is atomic during a purchase?**

Recommendation: balance check, price/version check, credit deduction,
ownership grant, and operation result commit together. Any failure leaves
both wallet and inventory unchanged.

Your answer:

**Q06.08 — Are income, upkeep, depreciation, upgrades, or gifts required now?**

Recommendation: defer all initially. Confirmed scope excludes player
transfers. New economy mechanics require their own balance/ranking rules.

Your answer:

### Phase 06 completion check

- Shop, confirmation, insufficient-funds, ownership, and collection views work.
- Simultaneous purchases cannot overspend or bypass ownership restrictions.
- Network retries and stale prices cannot create unintended purchases.
- Catalogue edits preserve acquisition values and historical transactions.
- Item images/layout work on the agreed phone and desktop targets.

## Phase 07: wealth snapshots and hall of fame

**Q07.01 — What is the wealth formula?**

Recommendation: available credits + committed unsettled stakes + agreed
collectible acquisition value. A stake temporarily moves between available
and committed categories; an item purchase moves value into ownership.
Exclude test wallets and any separately defined replay economy.

Your answer:

**Q07.02 — Does daily wealth include offline players?**

Recommendation: yes, snapshot all eligible registered accounts, including
offline players. Decide public visibility and opt-out presentation rules
separately from maintaining private accounting records.

Your answer:

**Q07.03 — What do period wealth rankings measure?**

Recommendation: end-of-period wealth for finalized daily/weekly/monthly
boards; current wealth for an all-time wealth board, with historical period
winners retained. If 'wealth growth' is desired, make it a separate metric
that explains purchases and grants.

Your answer:

**Q07.04 — How is roulette profit assigned to periods?**

Recommendation: settled return minus settled stake, assigned by the round's
authoritative settlement timestamp. Cancelled/refunded rounds are excluded.
Credit purchases, free grants, and luxury spending do not alter this metric.

Your answer:

**Q07.05 — What determines eligibility and tie handling?**

Recommendation: exclude staff, bots, simulator/sandbox activity, and accounts
restricted under an agreed policy. For profit rankings, propose at least ten
settled wagered rounds per period. Equal scores share a displayed rank;
stable account IDs provide deterministic pagination, not a hidden advantage.

Your answer:

**Q07.06 — How do resets affect hall-of-fame history?**

Recommendation: personal analysis resets do not change period totals,
all-time competition records, or finalized awards. Define account-deletion
presentation, such as anonymizing a retained historical entry, separately.
Do not silently choose this if the owner wants a different reset policy.

Your answer:

**Q07.07 — What happens at midnight and while jobs are delayed?**

Recommendation: snapshots use the agreed event-time cutoff, not the current
balance at the later job's run time. Define ordering for events exactly at
the cutoff and retain the data needed to reconstruct balances/holdings.
Finalize only after all rounds belonging to the period are accounted for.

Your answer:

**Q07.08 — How are missing jobs, corrections, and refunds handled?**

Recommendation: keyed jobs can backfill each missing date once. Corrections
append traceable adjustments; finalized boards have versions and correction
notes. Define whether a refund affects its occurrence period or restates an
earlier wealth snapshot. Do not silently change an awarded winner.

Your answer:

**Q07.09 — What does the hall-of-fame GUI show?**

Recommendation: metric, mode, period selector, provisional/finalized status,
portrait/name/rank/score, own position, tie display, and past winners.
Explain the metric and purchase effects. Decide leaderboard page size,
public visibility, and any minimum-participation message.

Your answer:

**Q07.10 — Are there prizes?**

Recommendation: recognition badges only initially, without material prizes
or transferable value. Any bonus-credit awards are a separately approved
grant policy; do not introduce prizes implicitly.

Your answer:

### Phase 07 completion check

- Wealth components reconcile to wallet and ownership records.
- Stakes crossing midnight do not disappear or count twice.
- Purchases increase wealth as defined and never become roulette profit.
- Period boundaries, ties, offline users, account/reset handling, replay
  separation, and eligibility behave as specified.
- Missed jobs backfill reproducibly without duplicate snapshots/awards.
- Historical boards can be reconstructed from retained records.

## Phase 08: raw-data access and client statistics

**Q08.01 — Which datasets may the client analyse?**

Recommendation: personal accepted bets/settlements, public completed draw
history, and explicitly permitted replay datasets. Never expose other
players' private wagers/payment records or future fresh-draw secrets.

Your answer:

**Q08.02 — Which analysis windows are required?**

Recommendation: keep the existing 222-spin view as a quick summary and add
custom dates, since last personal reset, daily/weekly/monthly, and available
all-time history. Show count, source, filters, and retention limits.

Your answer:

**Q08.03 — What does 'expected value' mean in the UI?**

Recommendation: show theoretical expected net credits for the actual stakes,
observed net return, and estimated return from a selected dataset separately.
For standard single-zero bets paying the usual odds, theoretical net EV is
-stake/37, approximately -2.70% of stake. Do not describe an observed winning
streak as a change in theoretical odds.

Your answer:

**Q08.04 — Which result distributions are analysed?**

Recommendation: all 37 pockets, colours, parity, low/high, dozens, columns,
and wheel sectors. Include zero correctly. Optional later: transition,
serial-dependence, and run-length analysis with explicitly stated assumptions.

Your answer:

**Q08.05 — What does 'bias confirmation' promise?**

Recommendation: use 'evidence of deviation' with confidence intervals,
effect size, test assumptions, and sample count. Do not claim a small sample
proves a fair or biased wheel. Use a documented overall goodness-of-fit test
and suitable per-pocket estimates. NIST describes chi-square assumptions
and sensitivity to binning/sample treatment [E4].

Your answer:

**Q08.06 — How are repeated testing and small samples treated?**

Recommendation: set an overall significance level, proposed 5%, and control
multiple comparisons when flagging individual pockets/groups. Label
exploratory results and insufficient samples; consider an exact/simulation
method where approximation assumptions fail. Rechecking each incoming spin
also needs a defined sequential-testing policy, not repeated unadjusted
'confirmed bias' alerts.

Your answer:

**Q08.07 — What counts as one observation?**

Recommendation: one completed source draw, regardless of player count.
Distinguish observed game rounds from distinct replay-source rows. Do not
treat the same repeated dataset as additional independent evidence or mix
unrelated source versions without explicitly grouping them.

Your answer:

**Q08.08 — What personal performance metrics are required?**

Recommendation: total stake, returns, net profit, observed return/stake,
number of wagered rounds, bet-type breakdown, expected loss, and deviation
from expectation. Define a 'win' clearly. If showing probability intervals
for portfolio profit, account for correlated bets within the same round.

Your answer:

**Q08.09 — Which processing stays in the browser?**

Recommendation: interactive calculations/plots run in the client, using a
background worker for large data where needed. Server provides authorized,
paginated/versioned raw data and optional aggregates. Never load unlimited
history into the page or trust client calculations for public rankings.

Your answer:

**Q08.10 — What export/import formats are required?**

Recommendation: CSV and JSON exports with schema/version, UTC timestamps,
display timezone, source IDs, filters, and reset boundaries. Treat imports
as local analysis only; they cannot issue credits or change official history.
Define spreadsheet-safe text handling for exported user-controlled names.

Your answer:

**Q08.11 — How are resets and deletions shown?**

Recommendation: confirmation explains the exact analysis-only effect and
offers export first. After reset, default views begin at the new epoch.
If true deletion is requested, follow the separately agreed data policy;
do not present a filter reset as deletion.

Your answer:

**Q08.12 — What validates the statistical calculations?**

Recommendation: independently calculated reference cases, known fair and
deliberately biased synthetic samples, zero-heavy inputs, sparse data,
duplicate replay rows, missing data, and mixed-source filters. Avoid tests
that merely repeat the implementation's own formulas without an independent
expected result.

Your answer:

### Phase 08 completion check

- Reference results agree for expected value, profit, distributions, and
  selected inferential tests.
- All charts expose the relevant sample/window/source context.
- Small samples and repeated comparisons do not produce false certainty.
- Shared draws are not multiplied by player count.
- Large authorized histories are paginated and processed responsively.
- Reset, export, optional import, and privacy boundaries behave as agreed.

## Phase 09: operations, recovery, load testing, and invited beta

**Q09.01 — Which administration tools are essential?**

Recommendation: account lookup/status, order/event lookup, catalogue
management, scheduled-job status/retry, recorded manual adjustments, and
round incident inspection. Restrict roles and record actor, time, and reason.

Your answer:

**Q09.02 — What monitoring and alerts are needed?**

Recommendation: connection health, bet acceptance latency/errors, settlement
lag, ledger reconciliation, payment fulfillment delay, job failures, source
exhaustion, and database/storage health. Owner supplies recipients/channels;
do not send external messages without authorization.

Your answer:

**Q09.03 — What load test defines success?**

Recommendation: exercise the Phase 01 targets with realistic bet rates,
table joins, reconnect storms, and a settlement boundary. Proposed initial
application goals: p95 bet acknowledgement under 500 ms and settlement
notification within two seconds after authoritative settlement, measured
from an agreed region. Confirm targets before testing; report actual limits.

Your answer:

**Q09.04 — Which outage scenarios must be demonstrated?**

Recommendation: process crash during betting/settlement, database outage,
duplicate/delayed callbacks, failed daily/weekly jobs, media failures, stale
sessions, and interrupted deployment. Include backup restore and ledger
reconciliation after recovery.

Your answer:

**Q09.05 — How are roles and private data tested?**

Recommendation: explicit player/developer/admin permissions, object-level
authorization, session expiry/revocation, origin settings, input/rate limits,
and sensitive-log review. Developer simulator endpoints must not fund live
wallets, even when called directly.

Your answer:

**Q09.06 — Who participates in the invited beta?**

Recommendation: owner chooses testers and access policy. Begin with test
credits only; provide a visible test label, issue-reporting route, and a
clear statement on whether beta accounts/records migrate to production.

Your answer:

**Q09.07 — What is the production migration and rollback policy?**

Recommendation: no automatic conversion of simulator balances or beta
rankings into live records. Preserve chosen identity/profile information if
approved. Use migration backups and a rollback procedure that accounts for
committed financial events, rather than reverting a database blindly.

Your answer:

**Q09.08 — What makes the beta complete?**

Recommendation: agreed critical flows pass, recovery drill succeeds,
measured load meets accepted targets, no unresolved balance/settlement/
authorization defects remain, and the owner reviews known limitations.
Cosmetic work may be deferred explicitly.

Your answer:

### Phase 09 completion check

- Produce a scenario/results report with exact commands or reproducible steps.
- Record latency, error rates, reconciliation results, and tested limits.
- Demonstrate backup recovery, delayed-job backfill, and interrupted payments.
- Separate passed checks, failed checks, and unverified external dependencies.
- Complete the invited beta under its authorized hosting/access policy.
- Keep live charging disabled until Phase 10 is explicitly started.

## Phase 10: live-payment release

**Q10.01 — Is the live commercial/payment setup established?**

Recommendation: record operator/entity/countries, selected provider's
acceptance of the actual model, account readiness, applicable age/access
rules, and agreed customer terms/refund policy. Recheck current provider
requirements before launch. Do not infer approval from sandbox access.

Your answer:

**Q10.02 — Are final packages and production records ready?**

Recommendation: review currency, prices, credits, bonuses, catalogue values,
receipts, support route, data policies, initial grants, and ranking start
date. Confirm test activity is excluded and production balances reconcile.

Your answer:

**Q10.03 — Which live systems may be enabled?**

Recommendation: owner identifies target URL/environment, approved release
version, rollout audience, and exact live-payment authorization. Store live
secrets outside source control. Define an operator switch that stops new
purchases without losing accepted bets or paid-order reconciliation.

Your answer:

**Q10.04 — How is the rollout verified?**

Recommendation: release to the agreed audience, verify real order/status
paths according to provider-approved procedures, and monitor reconciliation,
errors, and support reports. Do not make a real charge or use live card data
merely as an unauthorized test. Record any permitted live verification scope.

Your answer:

**Q10.05 — Who owns ongoing operation?**

Recommendation: owner assigns incident response, backups, payment disputes,
catalogue changes, feed replacement/exhaustion, and periodic policy review.
Decide recurring monitoring separately; this document does not schedule
automations or send notifications by itself.

Your answer:

### Phase 10 completion check

- Exact deployed version and target URL are recorded.
- Provider eligibility/setup and live authorization are established.
- Live/test boundaries, purchase fulfillment, and reconciliation are verified
  to the extent permitted by the approved verification procedure.
- Launch monitoring, support, incident response, and purchase-disable control
  have assigned owners.
- Remaining limitations are stated without claiming unperformed checks passed.

## Suggested first-version data records

This is a review checklist, not a requirement for one table per noun.
Choose the smallest schema that preserves the agreed behavior.

| Record group | Essential purpose |
| --- | --- |
| Accounts and profiles | Permanent identity, public profile, status |
| Auth sessions/roles | Login lifecycle and permissions |
| Wallet accounts and journal entries | Auditable movements and balances |
| Tables and seat reservations | Six-seat capacity and reconnect ownership |
| Rounds and result sources | Stable outcome/deadline/source identity |
| Bets and grouped operations | Accepted stakes and atomic called bets |
| Orders, payment attempts/events | Purchase fulfillment and reconciliation |
| Catalogue and owned items | Versioned prices and acquisition values |
| Feed versions and cursor | Reproducible, continuous replay weeks |
| Wealth snapshots | Event-time daily/period valuations |
| Ranking periods/results | Rebuildable provisional/final scores |
| Analysis epochs | User reset boundaries |
| Jobs and audit records | Retry tracking and operator actions |

Persist operation outcomes with financial changes. If a notification fails
after a database commit, clients must recover from durable state; WebSocket
delivery alone is not evidence that a financial event did or did not occur.

## Cross-phase scenarios that must not be overlooked

1. Two devices try to spend the same wallet simultaneously.
2. A retry arrives after the original operation committed but its reply failed.
3. A player disconnects after placing a losing wager.
4. A server restarts after choosing a result but before notifying clients.
5. A grouped French bet runs out of funds midway through validation.
6. A cancellation and the betting deadline occur nearly simultaneously.
7. Seven players compete for the last available seat.
8. A paid order's callback is duplicated, delayed, or arrives out of order.
9. A payment is disputed after its credits funded wagers and a collectible.
10. An item price changes while its purchase screen is open.
11. A daily snapshot runs late after new transactions already occurred.
12. A stake crosses midnight or a weekly boundary.
13. A player resets analysis after losses but remains on an official board.
14. The weekly preparation job retries after already advancing its cursor.
15. The last source section is shorter than one week.
16. Multiple tables observe one draw; analysis counts it once.
17. The same replay-source row is served again and is mistaken for fresh data.
18. Browser-supplied bankroll, price, role, result, or timestamp is modified.
19. A sandbox callback is sent to a production endpoint.
20. A backup is restored and unresolved provider payments need reconciliation.

## Copy-and-paste phase-start prompts

Each prompt is standalone in this workspace: it names the workbook and app.
Replace authorization placeholders before sending. A new chat elsewhere
needs access to this file and the previous completion report; paths alone
do not transfer files or conversation history.

An unreplaced authorization placeholder is not permission. Treat it as NO
for that action, while continuing explicitly authorized local work. When
editing an answer, enter it beneath `Your answer:`; keep the recommendation
visible so a later chat can distinguish the proposal from your decision.

### Start Phase 00: answer and consolidate decisions

```text
Read this planning workbook:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md

Project folder: C:\automation\prototypes\rou
Do Phase 00 only. Do not change application code.
My answers follow:
[PASTE ANSWERS BY Q00.xx ID]

Record accepted answers separately from proposals, identify contradictions,
and list only decisions that block Phase 01. Preserve confirmed closed-loop
credits, non-transferable virtual collectibles, and six total table seats.
You may update planning documents locally. Do not commit, push, deploy,
create external accounts, or enable payments.
Finish with the resolved rulebook and Phase 01 readiness status.
```

### Start Phase 01: infrastructure foundation

```text
Read the workbook and its accepted Phase 00/01 answers:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 01 only, following applicable repository instructions.
Inspect current files and previous completion evidence first. Implement the
agreed local infrastructure/configuration, migrations, health checks, and
environment separation. Continue independent work if external credentials
are unavailable; report the dependent verification accurately.
My additional answers: [PASTE Q01.xx ANSWERS]
Local implementation/tests: authorized.
Local commits: [YES/NO]. Push: [YES/NO, TARGET].
Deployment or cloud purchases: NO unless explicitly authorized below.
[OPTIONAL EXACT HOSTING/DEPLOYMENT AUTHORIZATION]
Use the phase-report format in the workbook. Do not start Phase 02.
```

### Start Phase 02: accounts and credit ledger

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 02 only. Verify Phase 01 prerequisites. Build the agreed
registration/profile flow, persistent account wallet/journal, authorization,
operation deduplication, legacy-save policy, and analysis-reset boundaries.
Record the raw events needed by later phases. Test concurrency, retries,
restart persistence, and isolation between accounts.
My additional answers: [PASTE Q02.xx ANSWERS]
Local implementation/tests: authorized.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
No real charging, external purchases, or unrelated feature work.
Use the workbook's phase-report format. Do not start Phase 03.
```

### Start Phase 03: first playable multiplayer release

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 03 only. Connect the existing 3D game to durable server-owned
rounds/bets. Preserve its visual design, agreed timing, bet types, and phone
behavior. Add lobby, six-seat tables, presence, and reconnect recovery.
Accepted bets settle after disconnect; client state cannot decide balances.
Verify full-table behavior, grouped bets, deadlines, retries, and restart
recovery with multiple independent clients.
My additional answers: [PASTE Q03.xx ANSWERS]
Local implementation/tests: authorized. Use test credits only.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
Use the workbook's phase-report format. Do not start Phase 04.
```

### Start Phase 04: weekly recorded replay

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 04 only. Validate actual 2m-rng.txt contents/provenance and
build the agreed continuous weekly replay preparation/activation workflow.
Use 20,160 draws per seven-day week at 30 seconds unless an accepted answer
changes that rule. Reconcile the current 21,600-row export explicitly.
Persist cursor, version, checksum, and activation state. Test retries,
boundaries, missed jobs, partial final input, and exhaustion. Do not claim
that public prerecorded data is an unpredictable fresh draw.
My additional answers: [PASTE Q04.xx ANSWERS]
Local implementation/tests: authorized.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
Report completion using the workbook. Do not start Phase 05.
```

### Start Phase 05: test purchases and sandbox integration

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 05 only. Build credit packages/orders and the purchase GUI,
internal payment simulator, durable one-time fulfillment, reconciliation,
and approved-provider sandbox integration where access is available.
Complete independent simulator work if provider selection/access is pending.
Use provider-hosted card collection. Stress-test the internal simulator,
not a provider's API unless expressly permitted. Separate test/live wallets,
orders, credentials, roles, and ranking eligibility. Keep live charging off.
My additional answers: [PASTE Q05.xx ANSWERS]
Local implementation/tests: authorized.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
Use the workbook's phase-report format. Do not start Phase 06.
```

### Start Phase 06: luxury shop

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 06 only: approved luxury catalogue, purchase/confirmation
GUI, atomic credit deduction plus ownership, collection/profile display,
and acquisition valuation. Respect the accepted duplicate/refund policy.
Items are non-transferable virtual collectibles. Do not add resale, income,
upkeep, or depreciation unless explicitly accepted in the answers.
Test concurrent purchases, retries, stale prices, and insufficient funds.
My additional answers/catalogue: [PASTE Q06.xx ANSWERS]
Local implementation/tests: authorized. Live charging remains off.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
Use the workbook's phase-report format. Do not start Phase 07.
```

### Start Phase 07: wealth and hall of fame

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 07 only: daily wealth snapshots and the agreed daily,
weekly, monthly, and all-time rankings with the hall-of-fame GUI. Keep
wealth and roulette profit distinct as accepted. Handle committed stakes,
offline players, event-time cutoffs, missed jobs, ties, corrections, and
reset/account-deletion presentation. Exclude test activity. Verify that
records can reconstruct historical snapshots and boards.
My additional answers: [PASTE Q07.xx ANSWERS]
Local implementation/tests: authorized. Live charging remains off.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
Use the workbook's phase-report format. Do not start Phase 08.
```

### Start Phase 08: statistical analysis

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement Phase 08 only: authorized raw-data access, browser analysis,
expected-value/performance views, frequency and bias-evidence views,
analysis resets, and agreed exports. Preserve distinctions between
theoretical EV, observed returns, and estimates. Address sparse samples,
multiple/sequential comparisons, within-round bet correlation, and replay
duplicates. Count each source draw once. Validate with independent cases.
My additional answers: [PASTE Q08.xx ANSWERS]
Local implementation/tests: authorized. Live charging remains off.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
Use the workbook's phase-report format. Do not start Phase 09.
```

### Start Phase 09: recovery and invited beta

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Implement and verify Phase 09 only: agreed administration/monitoring,
recovery drills, simulator-based stress tests, authorization checks,
production migration plan, and invited-beta readiness. Run only tests
against systems I control and have authorized. Report measured limits;
do not claim capacity from unrun tests. Do not message/invite people unless
explicitly authorized. Keep real payments disabled.
My answers/traffic targets: [PASTE Q09.xx ANSWERS]
Local implementation/tests: authorized.
Local commits: [YES/NO]. Push: [YES/NO, TARGET]. Deployment: [NO/EXACT TARGET].
Beta audience/access authorization: [DETAILS OR NOT YET AUTHORIZED].
Use the workbook's phase-report format. Do not start Phase 10.
```

### Start Phase 10: prepare or activate live payments

```text
Read the workbook, accepted decisions, and prior phase report:
C:\Users\zhone\OneDrive\Documents\ChatGPT\European Roulette\MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md
App: C:\automation\prototypes\rou

Handle Phase 10 only. Verify prior acceptance evidence, provider eligibility
for this actual closed-loop roulette model, package/receipt/refund rules,
live/test separation, backups, monitoring, and incident ownership. Prepare
the concrete release and report any remaining launch blockers.
My launch answers: [PASTE Q10.xx ANSWERS]
Local implementation/tests: authorized.
Local commits: [YES/NO]. Push: [YES/NO, TARGET].
Production deployment: [NO/YES, EXACT ENVIRONMENT AND RELEASE].
Live-payment activation: [NO/YES, EXACT AUDIENCE AND RELEASE].
Real-charge verification: [NOT AUTHORIZED/EXACT APPROVED PROCEDURE].
If an authorization is NO or unresolved, complete independent preparation
but do not perform that action. Do not treat elapsed time as approval.
Use the workbook's phase-report format and identify the deployed version
only if deployment actually succeeded.
```

## Required phase-completion report

Each implementation phase should update an accompanying decision/completion
record locally. Use a dedicated project document, not this Q&A's unanswered
fields, to describe implementation evidence.

```text
Phase:
Date/time and timezone:
Accepted decisions used:
Unresolved decisions and dependent work:

Delivered behavior:
Files changed:
Database/data changes:
Configuration/secrets needed (names only, never values):

Acceptance checks:
- Check / exact command or steps / observed result / PASS, FAIL, or NOT RUN

Concurrency/retry/recovery evidence relevant to this phase:
External integrations verified or still unverified:
Known limitations and material risks:

Commit SHA, if a commit was authorized and created:
Push target/result, if authorized and performed:
Deployment URL/version/result, if authorized and performed:
Live-payment state:

Rollback/recovery instructions:
Next phase prerequisites:
Phase status: COMPLETE / PARTIAL / NEEDS OWNER DECISION
```

Use COMPLETE only when all agreed phase requirements are delivered and its
required checks pass. Keep unsupported integrations and unrun checks visible.
Do not automatically begin the next phase after reporting completion.

## Decision log template

| Date | Question ID | Accepted answer | Replaces | Affected phases |
| --- | --- | --- | --- | --- |
| | | | | |

Version decisions when they change. Explain whether the change applies only
to future rounds/orders or requires a data migration. Never silently change
past package terms, settled results, or finalized ranking rules.

## Sources and verification notes

Local observations were inspected on 16 October 2026 except the Git access
check, which was performed on 14 October 2026. Recheck current state before
implementation. Line references identify the inspected version.

- [S1] Folder inspection: `C:\automation\prototypes\rou`.
- [S2] Commands: `git rev-parse --show-toplevel`, `git remote -v`,
  `git status --short --branch`, and `git push --dry-run` from that folder.
  Remote authentication/authorization can change after the check.
- [S3] [Main frontend](C:/automation/prototypes/rou/index.html), especially
  configuration near line 150, betting near 199, statistics near 231,
  settlement near 238, and persistence near 469-473.
- [S4] [Backend composition](C:/automation/prototypes/rou/server/index.js),
  [ledger](C:/automation/prototypes/rou/server/ledger.js),
  [transport](C:/automation/prototypes/rou/server/transport/websocket.js),
  and [configuration](C:/automation/prototypes/rou/server/config.js).
- [S5] [Server bet types](C:/automation/prototypes/rou/server/betting.js).
- [S6] [Existing replay export](C:/automation/prototypes/rou/real.html),
  `spins` metadata at line 5. Its claimed source count is metadata; validate
  the input file's actual valid row count in Phase 04.
- [S7] [Input dataset](C:/automation/prototypes/rou/assets/2m-rng.txt).
- [E1] [Stripe prohibited and restricted businesses](https://stripe.com/legal/restricted-businesses).
  This is an example provider's policy, not a legal determination or proof
  that the proposed product is accepted. Recheck the chosen provider and
  applicable requirements before live processing.
- [E2] [Stripe fulfillment guidance](https://docs.stripe.com/checkout/fulfillment).
  Provider-specific behavior must be verified when selecting an integration.
- [E3] [Stripe testing guidance](https://docs.stripe.com/testing).
  Distinguishes test payments from live payments and directs load tests away
  from the testing API.
- [E4] [NIST chi-square goodness-of-fit guidance](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35f.htm).
  Relevant to selecting and explaining an appropriate statistical test;
  it is not evidence that this dataset is fair or biased.

The weekly-size calculation is 7 * 24 * 60 * 60 / 30 = 20,160.
The standard roulette expectation follows from usual single-zero payouts:
gross expected return is 36/37 of stake, giving net EV of -1/37 of stake.
Different payout or special-rule choices require a new calculation.
