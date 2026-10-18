# Phase 00: owner decisions and remaining definitions

Recorded: 16 October 2026 | Timezone: Asia/Kuala_Lumpur

Updated with the owner's profit, EV, inactivity, and reference-game answers
on the same date. Follow-up decisions override the earlier unresolved notes.

## Usage and next action

**18 October 2026 amendment:** the owner subsequently authorized coding,
required the attached Bias Calculator to determine sample size, and
confirmed the luxury golf-course name. See the updated
[product review](MULTIPLAYER_PRODUCT_DESIGN_REVIEW.md) and
[implementation record](IMPLEMENTATION_01_COLLECTION_AND_INSIGHTS.md).
The original no-code answer below is retained as historical context and
is superseded by that later authorization. Live billing and deployment
remain separate, unapproved steps.

Read this record with
[the Q&A workbook](MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md).
Answer the open items below using their `D00.xx` IDs, then answer the
Phase 01 questions before authorizing that phase's implementation.

```text
Phase 00 follow-up answers
D00.01 =
D00.02 =
D00.03 =
D00.04 =
D00.05 =
D00.06 = RESOLVED: all settled returns minus all settled stakes, including losses.
D00.07 = ACCEPTED DIRECTION: profit minus expected profit; separate risk score.
D00.08 =
D00.09 = LAST SETTLED WAGER; month arithmetic and reset repetition still open.
D00.10 =
D00.11 =
D00.12 = RESOLVED: luxury golf course, 160,000,000 chips.
D00.13 =
D00.14 =

Phase 01 answers: [Q01.01 through Q01.08, as ready]
Begin application implementation now: NO
Commit/push this planning update: [YES/NO]
```

Expected result: an accurate rulebook that distinguishes owner decisions
from unanswered details. `Accept` can approve a proposed answer; it cannot
fill in missing owner-specific information such as country or budget.

These answers refine the plan. They do not start implementation. Application
code, cloud deployment, real charging, and external communications have not
been authorized by this answer submission. No new commit or push is implied
by submitting answers to a previously pushed document.

## Source and decision precedence

Source: the owner's pasted Phase 00 response supplied with this chat, and
the matching answers already entered in the repository workbook. The source
contains Q00.01 through Q00.12 plus new instructions Q00.13 and Q00.14.
The follow-up chat answers below are additional owner decisions; the
original pasted answers remain preserved in the workbook.

### Follow-up owner answers, 16 October 2026

- Profit/EV: `net returns - all stakes including losses` and `EV, yes`.
  This accepts the question's recommendation to show actual profit minus
  theoretical expected profit and a separate risk-adjusted score.
- Inactive reset: `the three months reset only reset records, not erase
  player account. So, wealth score is not affected, profits and EV scores
  are reset. Correct definition for inactivity.`
- Inactivity event, in a separate explicit answer:
  `A settled wager (recommended)`.
- Desired reference experience:
  `Ideally it shall work similarly like Roulette Royale - Casino ..`

The reference-game answer identifies the desired product experience. It
does not supply the operator country, hosting budget, or preferred host.

The owner's answers take precedence over the workbook's recommendations.
In particular, do not reintroduce these rejected or modified proposals:

- Disabling the existing bankruptcy replenishment.
- Limiting the hall of fame to only wealth and net roulette profit.
- Making profit/EV competition records immune to a player's record reset.
- Treating recorded replay as excluded from all purchased-credit play
  without an owner decision on source/economy eligibility.
- Making account setup the destination of the Menu button.

Keep original recommendations visible as historical proposals. Do not
interpret a general `yes` as supplying a missing numerical limit, formula,
operator country, hosting budget, or provider approval.

## Recorded decisions

### Q00.01 — first playable release: accepted

The owner accepted account login, persistent test credits, the existing 3D
game, six total seats, shared results, and reconnect recovery. Payments,
collectibles, rankings, and advanced analysis remain later deliverables.

### Q00.02 — amusement-game intent and USD: partly resolved

- Owner describes the product as an amusement game rather than gambling.
- Purchase currency is USD only.
- Owner requests classification to be checked against actual gameplay and
  applicable player-country law.
- Operator entity/country, intended player countries, and audience/age policy
  have not been supplied.

The amusement description is recorded as the owner's intended product
positioning, not a completed legal determination. No jurisdictional
classification has been confirmed. See D00.01 and D00.02. This review depends
on the relevant territories; it does not block independent local planning.

### Q00.03 — starting credits and replenishment: accepted

- Starting bankroll: 10,000 credits.
- Retain existing bankruptcy replenishment in both single-player and
  multiplayer modes.
- Record multiplayer replenishment in the wager/round result history.
- Do not add server grant recording for standalone single-player solely
  because multiplayer requires an audit trail.
- Credit purchases let players acquire virtual luxury items or experience
  high-stake wagering strategies; buying credits is optional.

The inspected implementation uses a 2,500-credit replenishment when the
settled round has a negative net return and the resulting bankroll is at or
below zero. See [L1]. Preserving the existing behavior therefore means
preserving that amount and trigger unless the owner changes them.

The exact accounting granularity for a round containing several wager
entries is still open under D00.04. Do not issue the 2,500-credit grant once
per losing bet within the same settled round.

### Q00.04 — credit packages: accepted prices and quantities

| Availability | Price in USD | Credit quantity | USD minor units |
| --- | ---: | ---: | ---: |
| Standard | 4.90 | 100,000 | 490 |
| Standard | 9.90 | 1,000,000 | 990 |
| Standard | 49.90 | 50,000,000 | 4,990 |
| Standard | 99.90 | 500,000,000 | 9,990 |
| Standard | 499.90 | 5,000,000,000 | 49,990 |
| Sale period only | 9.90 | 7,000,000 | 990 |

Source: owner's Q00.04 answer. Minor-unit values are exact USD conversions.
Production package IDs, sale dates/eligibility, purchase limits, and tax/
receipt treatment have not yet been supplied. See D00.05 and Phase 05.

### Q00.05 — three types of hall of fame: accepted direction

1. Wealth.
2. Profits.
3. Expected Value, tracking profits against the odds of the bets played.

Purchased credits and owned luxury items count toward wealth. The existing
requirement for daily, weekly, monthly, and all-time views remains in scope.
The owner did not remove those periods.

The follow-up defines profit as all settled returns, including returned
stakes, minus all settled stakes, including losses, since the player's
record began. Do not subtract stakes twice by interpreting 'net returns'
as already-net profit. Purchases and grants are separate credit movements.

The owner accepted EV performance as actual net profit minus theoretical
expected net profit, with a separate risk-adjusted score. Exact score
normalization and minimum-sample rules remain to specify in Phase 08.
See D00.06 and D00.07. Avoid calling game credits withdrawable cash.

Players may reset their records. The server also resets profit/EV records
after more than three months since the last settled wager. The account,
wealth, and owned items remain. Calendar arithmetic, reset confirmation,
and treatment of historical boards remain open under D00.08 through D00.10.

### Q00.06 — reset, wealth preservation, and account erasure

- Resetting records affects profit and EV records/ranking basis.
- Resetting records does not reset wealth.
- An inactivity reset preserves the player account; it is not account erasure.
- Settled wagers restart the inactivity clock. Login alone does not.
- Owner requests account erasure to wipe everything belonging to the account.
- Confirmation is required before each reset/erasure execution.

Do not retain identifiable profiles, inventories, or personal analytics by
default after account erasure under an assumption that accounting always
overrides deletion. Specify data categories and verified external retention
obligations before promising an immediate universal wipe. Provider-managed
records and backup deletion also require explicit lifecycle handling.

This is a scope-design question, not a rejection of the owner's deletion
request. See D00.10 and D00.11. No account deletion is being executed now.

### Q00.07 — calendar: accepted

- Display/report calendar: Asia/Kuala_Lumpur.
- Daily boundary: 00:00.
- Weekly boundary: Sunday 00:00.
- Monthly boundary: first day of the month at 00:00.
- Persist event timestamps in UTC and retain the calendar rules used.
- Production all-time history begins at launch; test activity is excluded.

How an individual's reset changes the all-time profit/EV view remains open.
The general production-launch boundary does not remove that reset feature.

### Q00.08 — luxury catalogue and restrictions

| Owner-specified item | Credit price |
| --- | ---: |
| Luxury watch | 200,000 |
| Pendant | 400,000 |
| Limo | 500,000 |
| Yacht | 25,000,000 |
| Mansion | 80,000,000 |
| Luxury golf course — name confirmed 18 October 2026 | 160,000,000 |
| Private jet | 300,000,000 |
| Island | 500,000,000 |
| Shuttle | 5,000,000,000 |

Source: owner's Q00.08 answer and explicit 18 October 2026 clarification:
'Yes — a luxury golf course'. The price is unchanged.

No resale, rental, depreciation, upkeep, or player transfer is permitted.
Items remain non-redeemable virtual collectibles under the previously
confirmed closed-loop model. Duplicate ownership, wealth valuation, images,
and profile/table display are still addressed by Phase 06 questions.

### Q00.09 — weekly sequence and preliminary analysis

- `real.html` is a weekly extraction from `2m-rng.txt`.
- Each week must continue seamlessly from the preceding source section.
- Perform preliminary analysis of the source for evidence of bias.
- Do not implement a fresh random selection, shuffle, or restart at the
  first source row each week under the name of continuous extraction.

No source analysis has been performed as part of recording these answers.
Dataset provenance and the analysis protocol remain to be agreed. A
statistical result must state its assumptions, sample, and limitations;
do not promise that one test definitively proves absence or presence of bias.

The current export declares 21,600 rows; seven days at 30-second intervals
requires 20,160. The continuity and migration rule must be resolved before
weekly automation. Full source/competition eligibility is open in D00.13.

### Q00.10 — integer arithmetic accepted; numerical limits outstanding

The owner answered `yes` to integer-credit, safe-arithmetic, server-authority
principles. The answer did not specify actual minimum/maximum stakes,
per-round caps, wallet maximum, or purchase limits. See D00.14.

A valid implementation must accommodate the accepted 5-billion-credit
package and collectible price. Those values are not a chosen wallet cap;
multiple purchases and possible payouts also need safe limits.

### Q00.11 — phase execution and authorization policy: accepted

Copied phase-start prompts authorize their stated implementation scope.
Commit/push/deployment/account setup/live-charging permissions remain
explicit fields. Do not modify unrelated parent-repository prototypes.

This answer submission itself does not copy a phase-start prompt or direct
the agent to begin Phase 01. Continue planning only.

### Q00.12 — phone-first architecture and deferred work

- Phone users are the primary audience.
- Architecture and GUI must account for limited screen size and device
  resources. Preserve the game's intended phone use through each phase.
- Defer chat, friends, trading, AI advice, collectible income, and Rust
  migration for now.
- Monthly hosting budget and target date remain unspecified.
- The answer does not authorize a new native Android/iOS application.
  The current browser game remains the existing implementation baseline.

### Q00.13 — spin-source controls and feed details on launch page

Move spin-source selection and its feed details to the launch page. Preserve
the owner's distinction between the current client pseudo-RNG option and
recorded-feed option. This is a planned UI requirement, not a code change
already made.

For shared multiplayer draws, source authority and whether the RNG option
is relabelled as server RNG need resolution under D00.13. Do not give each
player an independent client-generated outcome in one shared round.

### Q00.14 — Menu returns to launch page

The Menu button must return the GUI to the launch page, rather than Google
Account setup details. Keep account settings accessible through an explicit
account/settings action if needed. Do not interpret Menu navigation as an
automatic logout, record reset, or cancellation of accepted bets.

The additional settings route is a proposed design detail, not a new
owner-approved feature. Navigation implementation belongs to Phase 03.

### Product reference — Roulette Royale

The owner's desired reference is `Roulette Royale - Casino`.
[INFERRED] The likely current store listing is **Roulette Royale - Grand
Casino**, identified by Android package `com.mw.rouletteroyale` and Apple
app ID `443369563`. The owner has not separately confirmed the exact listing.
See [R1] and [R2].

The developer's store description presents a simulated roulette game with
single-player/online play, optional purchases, virtual-item shopping,
personal statistics, and leaderboards, without real-money payouts [R1].
These support using it as a product-experience reference alongside the
owner's already specified closed-loop economy and phone-first interface.

It does not establish this project's country-specific classification,
operator details, server language, infrastructure provider, or hosting cost.
Those are still decisions for this project. The store is also not evidence
that a particular card provider will accept this web implementation.

Do not automatically add all features of the reference app, such as another
wheel type or tournaments, to the agreed first release. The existing 3D
design and owner's explicit features remain the scope. Matching a reference
experience is not a requirement to copy its branding, artwork, or code.

## Open definitions and owner follow-ups

### D00.01 — operator and target countries

Supply the operator entity/country and intended player countries. These are
needed for the requested country-specific classification and provider
eligibility checks. A timezone is not evidence of either jurisdiction.

Blocks: jurisdictional conclusions and live-payment eligibility, not local
account/round design. Region choice also informs hosted infrastructure.

Answer:

### D00.02 — audience, hosting budget, and deadline

Supply audience/age policy, monthly hosting budget, and any target date.
If there is no deadline, say so. Choose the host/region in Phase 01 rather
than treating an earlier recommendation as approved.

Blocks: costed hosting selection and the relevant launch/access rules;
independent local planning can continue.

Answer:

### D00.03 — phone/browser targets and launch-page session behavior

Which phone/browser combinations must be supported? Confirm whether Menu
returns to launch while preserving the login session and whether an active
multiplayer seat remains reserved there. Existing accepted bets must retain
their settlement behavior when the player navigates.

Proposed: preserve the session; present account controls separately; apply
the agreed seat-reservation policy. Do not equate a page change with a reset.

Blocks: final navigation behavior and device acceptance tests in Phase 03.

Answer:

### D00.04 — replenishment event granularity

Does 'through each result of each wager' mean a server round-settlement
record with all wager entries and a separately identified 2,500-credit grant,
or a distinct grant field repeated on each wager row?

Proposed: one grant per qualifying settled round, linked to its wager/result
records and wallet transaction. Repeated fields, if shown, are references
to that grant rather than multiple grants. Preserve single-player behavior.

Blocks: final multiplayer settlement/grant data model in Phases 02 and 03.

Answer:

### D00.05 — sale package operation

When is the USD 9.90 / 7,000,000-credit sale active? Is it available to all
players? During that period, does it replace or sit beside the normal
USD 9.90 / 1,000,000-credit package? Are there per-account purchase limits?

Proposed: an explicitly scheduled, server-controlled sale replaces the
same-price standard package during its active period. This is not approved
until answered. Production package IDs are implementation details once
the commercial rules are accepted.

Blocks: final production package catalogue in Phase 05.

Answer:

### D00.06 — exact profit calculation: resolved

Accepted formula:

```text
Net roulette profit = sum(all settled returns) - sum(all settled stakes)
```

Settled returns include any returned stake. Losing stakes count in full.
Credit purchases, replenishment, and collectible transactions are separate
from settled roulette returns/stakes. Cancelled-wager refunds are not wins.

For example, a 100-credit straight bet that wins returns 3,600 credits,
giving 3,500 net gain. A subsequent lost 100-credit bet produces:
net profit 3,400. Neither positive-gains-only nor gross-return scoring is
the selected rule. Summing every wager or summing round totals yields the
same net profit when every accepted stake/return is counted once.

Answer: owner's explicit net-profit definition accepted. No further product
clarification is needed for this formula.

### D00.07 — EV performance: direction accepted; scoring details remain

The owner accepted displaying actual net game profit minus theoretical
expected net profit, with a separate score adjusted for the risk of the bets.
Show actual profit and theoretical expectation separately as context.

```text
Performance above expectation = actual net profit - theoretical net EV
```

Implement the agreed direction rather than reopening whether losses count
or replacing it with raw gross returns. Before scoring is finalized, specify
the risk-normalization formula, minimum sample/turnover, ranking direction,
and handling of zero variance/insufficient data. Evaluate joint outcomes of
bets within one round because their returns may be correlated. The owner
has accepted risk adjustment, not a particular unpresented formula.

For usual single-zero payouts, theoretical net EV is negative stake/37.
Do not divide profit by that negative expectation and label the resulting
ratio as a meaningful score without an agreed definition.

Remaining work: present and document exact normalization/eligibility during
the Phase 07/08 design. This does not block Phase 01 infrastructure.

Answer: `EV, yes` to the question's two-part recommendation.

### D00.08 — resetting current versus finalized competition history

Confirmed follow-up: resets affect profit/EV records, preserve wealth, and
do not erase the account. The remaining question concerns historical boards.

Does a player reset remove their profit/EV entries from previously finalized
daily, weekly, and monthly boards, or restart only their current record and
current/all-time scores? Wealth is preserved in either case.

Also decide whether reset means deleting personal profit/EV raw records or
starting a new record boundary. Do not implement the earlier proposal that
resets have no effect on profit/EV rankings: the owner has overridden it.

Blocks: profit/EV ranking history and reset data lifecycle in Phases 02,
07, and 08.

Answer:

### D00.09 — three-month inactivity rule

Accepted inactivity event: the player's last settled wager. A login or
profile edit alone does not restart that clock. The three-month job resets
profit/EV records and scores while preserving account and wealth.

Still to specify: calendar months versus 90 days; treatment of accounts
that have never settled a wager; and whether the inactive record is reset
only once until gameplay resumes. Proposed defaults are calendar months,
registration as the initial baseline until a settled wager exists, and one
reset per inactive record. These defaults are not owner-confirmed.

Remaining work: settle those boundary cases before automatic reset execution
in Phases 02, 07, and 09. The clock event itself is resolved.

Answer: `A settled wager (recommended)`.

### D00.10 — confirmation versus automatic inactive reset

The owner requests both automatic resets after inactivity and confirmation
before each execution. How should these work together?

Options: prior opt-in to the automatic policy; pending confirmation on next
return; or a specified notification/confirmation procedure before reset.
No option is assumed. Manual reset and account erasure require confirmation
as already instructed; inactivity alone does not authorize erasing accounts.

Blocks: automatic reset execution and its UI. Does not block manual-reset
confirmation design.

Answer:

### D00.11 — account erasure lifecycle

Confirm the desired deletion scope and timing for profile/portrait,
inventory, bankroll, personal bets/analytics, rankings, authentication links,
and saved game data. Decide how delayed payment events and open wagers are
resolved before erasure. Define backup expiry and what, if anything, remains
anonymized for shared draw integrity or verified external obligations.

The owner's desired result is a full wipe of their account, not a hidden
analysis epoch reset. Any required exception needs evidence and explanation;
do not silently retain identifiable data under a generic accounting claim.

Blocks: account-erasure implementation/terms, payment/deletion interaction,
and applicable retention policy in Phases 02, 05, 07, and 09.

Answer:

### D00.12 — collectible name

Does the 160,000,000-credit item mean 'golf course', or is 'gold course' the
intended name? Keep the accepted price while clarifying the label.

Resolved on 18 October 2026.

Answer: Yes — a luxury golf course. Keep the price at 160,000,000 chips.

### D00.13 — source authority, eligibility, and preliminary data analysis

Choose which sources are playable in single-player and multiplayer, and
which may use purchased credits, count toward each leaderboard, or share
one wallet. The weekly-extraction instruction does not answer those choices.

Confirm the owner-controlled RNG source for multiplayer. Client RNG can
remain a standalone option, but separate client draws cannot produce one
authoritative shared result. Also decide whether multiple tables use a
common stream for each selected mode.

For weekly replay, agree the starting cursor/anchor, source-exhaustion rule,
and migration from 21,600 exported rows to exact calendar weeks. Record
physical-wheel versus generated provenance accurately. The source is already
public; a hidden new export does not reverse its advance predictability.

For the preliminary analysis, agree full-file versus weekly/segment tests,
sample independence/repeats, test family/significance, and a report format.
This answer records a requested future task, not completed analysis. It may
be commissioned as a separate read-only analysis before full Phase 04.

Blocks: shared-source configuration in Phase 03, feed workflow in Phase 04,
and source eligibility/statistical interpretation in Phases 07 and 08.

Answer:

### D00.14 — numerical limits

Supply minimum stake, per-bet/target and total-round caps, wallet maximum,
and package purchase limits. Confirm limits for called bets and double/repeat.
Use integer credits and verify maximum possible payouts and accumulated
balances. Include the accepted 5-billion-credit package/item in design tests.

Blocks: final credit-limit checks in Phases 02, 03, and 05, not the choice of
durable account IDs or the raw transaction/event schema.

Answer:

## Phase impact and readiness

| Phase | Changes required by the owner's answers |
| --- | --- |
| 01 | Phone-first targets; USD model; host/region/budget still to choose. |
| 02 | Preserve grant policy; model resettable profit/EV and full erasure. |
| 03 | Retain replenishment; six seats; launch-page source/Menu controls. |
| 04 | Continuous extraction and preliminary source analysis; no reshuffle. |
| 05 | Five regular USD packages plus a scheduled sale offer. |
| 06 | Nine priced collectibles; no resale/income/upkeep/transfer. |
| 07 | Three boards; net-profit formula and EV direction accepted. |
| 08 | EV normalization, reset boundaries, defensible bias evidence. |
| 09 | Last-settled-wager inactivity; confirmation/deletion, phone/load checks. |
| 10 | Jurisdiction/provider checks and production terms still required. |

Phase 00 status: ANSWERS RECORDED; DEFINITIONS STILL OPEN.

Resolved in follow-up: net profit, EV direction, the inactivity clock event,
and preservation of account/wealth during automatic record resets. Remaining
questions must not be used to reopen those accepted decisions.

Phase 01 status: READY FOR ITS QUESTIONNAIRE; NOT STARTED.

Before selecting or buying hosted infrastructure, supply host/budget/region
preferences and the relevant Phase 01 answers. Local infrastructure planning
does not need to wait for EV formulas or collectible spelling. Defer only
work whose behavior actually depends on an unresolved answer.

No application code, live charge, dataset analysis, cloud deployment, Git
commit, or push has been performed by this planning update.

## Evidence

- Owner answers: Q00.01 through Q00.14 in
  [the workbook](MULTIPLAYER_QNA_AND_PHASE_PLAYBOOK.md).
- [L1] [Existing frontend](../index.html), configuration near line 150 and
  `settle` near line 237, inspected 16 October 2026: starting bankroll
  10,000; replenishment 2,500; grant applied after a negative-net round when
  the post-settlement bankroll is at or below zero.
- [L2] [Current replay export](../real.html), metadata near line 5:
  declared output 21,600 at a 30-second interval. A seven-day schedule has
  7 * 24 * 60 * 60 / 30 = 20,160 results. Validate actual input content and
  week boundaries when implementing replay.
- [L3] [Input dataset](../assets/2m-rng.txt). Its presence/name alone is not
  proof of physical-wheel provenance or of any statistical bias conclusion.
- Package and collectible quantities above transcribe the owner's values;
  no prices, formula choices, jurisdiction conclusions, or approval states
  have been invented to fill unanswered fields.
- [R1] [Roulette Royale - Grand Casino, App Store](https://apps.apple.com/gb/app/roulette-royale-grand-casino/id443369563),
  developer description reviewed 16 October 2026. Public product description;
  not a jurisdictional ruling or disclosure of backend architecture.
- [R2] [Roulette Royale - Grand Casino, Google Play](https://play.google.com/store/apps/details?id=com.mw.rouletteroyale&hl=en),
  reviewed 16 October 2026. Used to identify a likely current listing for
  the owner's named reference, not to assume its private implementation.
