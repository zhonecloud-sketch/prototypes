# Rooms and personal Insights

Open [Developer controls][admin], unlock with an authorised game account
and the separate operator key, then choose **Server → Maximum game rooms**.
Save a number from 1 to the displayed server allowance. Open [the game][game],
sign in and choose **Multiplayer** to join an available seat. Choose
**Insights** for the personal record since the last reset.

## Expected behaviour

- Each room has six seats, including the current player.
- Seats are filled in room order. The seventh player starts room 2; sixty
  concurrent players occupy ten rooms. Empty rooms disappear when their
  seats expire. The current default allowance and room limit are ten.
- At the limit, another player receives a clear full-capacity message.
  Rejoining preserves an existing seat. Accepted, unsettled wagers retain
  their room through short connection interruptions.
- The admin page shows occupied rooms and their players. Lowering the
  limit is rejected while a room above the proposed limit has players or
  an accepted wager. Existing games are never silently evicted.
- All rooms follow the recorded dataset on the common 30-second clock.
  The player-facing source name is **Live replay**; it plays saved draws,
  rather than generating new random numbers. Player cards expose usernames,
  bankrolls
  and showcases within that room, without exposing email addresses.

## Capacity setting

The Rust service reads `ROOM_CAPACITY_LIMIT` from its deployment settings.
Its default is 10 rooms. A deployment may configure 1–100 rooms after
capacity testing; the admin setting cannot exceed that allowance. The
allowance is an operating configuration, not an automatic measurement of
available CPU, database throughput, storage or account quotas.

Sixty clients polling every two seconds generate roughly 30 room requests
per second, in addition to betting and account requests. Cloudflare's
[D1 limits][d1] and [Workers limits][workers] apply to the underlying hosted
services. The local sixty-player test proves allocation and isolation; it
does not certify sustained hosted throughput or daily quota availability.
Observe latency, errors and usage before increasing the deployment allowance.

Source: `sites-server/rust/src/room.rs`, `rust/src/admin.rs`, and
`test/rust-rooms-insights.test.mjs` in the Sites source repository.

## Personal analysis

The server returns only the authenticated player's settled wagers from
their current reset epoch. Indexed, snapshot-based pagination reads the
whole record, beyond the recent 222-spin display. While the page remains
open, later settlements are fetched incrementally. Analysis runs in a
browser worker using the existing Bias Calculator kernel.

The report identifies the multiplayer player and shows the saved-wager
count, latest settlement time and last successful record check. The
account's username is separate from its play mode. The game header labels
the session **Multiplayer account**.

The account screen stays inside the original mobile game frame, which owns
its size, scaling and portrait fallback. The header is a fixed flex row;
the remaining content area scrolls vertically in both Default and Wide
view. Images, selects and chart grids cannot expand its width, and tab
changes reset both scroll axes of the content area. In mobile Default view,
single-finger swipes scroll this area using the frame's scale and rotation.
Taps and pinch zoom remain available; Wide view uses native scrolling.
Source: `client/account.js`, `client/account-scroll.js` and
`client/account.css`.

Settlement notifications trigger record refreshes. If a notification arrives
while a snapshot is downloading, the client finishes that snapshot and then
requests a new one from its last cursor. It does not discard the notification
or keep the completed snapshot's old ceiling. A visible report also checks
every ten seconds and when the tab becomes visible again. Closing Insights
stops these checks; hidden tabs do not request records. Rate limits trigger a
one-minute backoff. These checks reuse the previous analysis when the data
and filters are unchanged.

The server stores raw multiplayer wagers and settles their payouts. The
browser worker calculates sample sizes, advantage or inverted-advantage
signals, expected values, uncertainty, patterns and charts. The server does
not run the Bias Calculator model. Raw records remain on the server between
visits; only new records need to be downloaded within an open session.

Only settled wagers count towards a player's personal advantage sample.
Watching another spin without wagering does not increase that sample. A
source or bet-profile filter can also leave the eligible count unchanged
while the overall saved-wager count grows. A verdict may remain the same
even as its underlying sample and result figures update.

The free summary shows the observed-record signal, eligible sample size,
fixed-effect round target, observed versus fair profitable-round
rates, actual net result and theoretical expected net result. An active
30-day Insights pass adds the chart, uncertainty, bet mix, source patterns
and downloadable analysis report. Payments remain clearly simulated.
Players can export their own raw records without buying a pass.

One settled round is one payoff portfolio. For each possible wheel number,
the actual bet amounts and gross payouts determine whether the entire
round would make a net profit. If K of the 37 outcomes are profitable, the
fair comparison probability is K/37. Different probabilities are analysed
separately. Zero is included; an even-money roulette bet is not a true
50:50 event.

A signal requires all three: an observed gap of at least **5 percentage
points**, the planned round target, and a two-sided p-value below the
selected threshold. This is an absolute gap, not a relative 5% change.
At a fair win rate of 14/37 (37.84%), eligible observed rates are at or below
32.84%, or at or above 42.84% (rounded for display). A 36.67% rate is only
1.17 points lower and cannot raise a personal alert, even with a tiny
p-value. Smaller gaps show a descriptive result without declaring fairness.
Gaps of at least **10 percentage points** also show **Very large difference**
in solo and multiplayer Insights and their reports. This describes magnitude
in either direction, including the exact ten-point boundary. It does not
change the five-point sample-size plan or bypass the statistical check. A
short record still says there are not enough rounds to raise an alert.
**Ongoing review · stricter** uses alpha 0.001;
**One-time check · more sensitive** uses alpha 0.05. Descriptions explain when
to choose each mode. These are per-check false-alarm settings, rather than
win probabilities. For a single planned check of results that follow the
usual odds, alpha 0.001 is a false-alert benchmark of no more than about 1
in 1,000 checks; alpha 0.05 corresponds to about 1 in 20. A false alert is
ordinary random variation being flagged as unusual. These benchmarks do
not give the chance that an individual flagged conclusion is wrong.
Repeated checking and selecting bet profiles can increase the overall
false-alert risk. See the [NIST significance-level definition][alpha].
The player explanation uses separate fair-wheel records checked once each.
Each record is assessed on its own; an alert does not require a second
extreme record, and the number of false alerts is not a fixed quota.
The default statistical-check power remains 80%, with a fixed planning
effect of 0.05. The round target covers both feasible directions and stays
fixed for the same fair probability, alpha and power. At 14/37, alpha 0.001
and power 0.80, it is 1,652 rounds; alpha 0.05 gives 773 rounds. These values
come from `evaluateBinomial` and its regression tests.

The 80% goal means the statistical check aims to detect a real, steady
five-point difference in about 8 out of 10 separate records at the planned
target. It may miss it in about 2 out of 10. The additional observed-gap
filter can suppress statistically significant results; 80% is **not** the
power of the combined alert rule. In particular, at a true gap of exactly
five points, the observed gap can fall on either side of that boundary.
See [NIST's definition of statistical power][power]. The solo review's
adjustable goal is displayed as a percentage. “Inverted advantage” describes
an unusually low profitable-round rate in this record. Neither direction
establishes persistent luck, future positive EV or a benefit from reversing
bets. Repeated checks and selecting profiles remain exploratory.

The current planning and alert equations are:

```text
p0 = profitable pockets / 37
p_hat = winning rounds / eligible rounds
d = 0.05
A = {p0 - d, p0 + d} intersect [0, 1]
N_start = max(requiredN(p1, p0, alpha, power) for p1 in A)
N_plan = first N >= N_start with exactPower(N, p1, p0, alpha) >= power
         for every p1 in A
p_two = min(1, 2 * min(P[X <= wins], P[X >= wins])), X ~ Binomial(N, p0)
alert = (abs(p_hat - p0) >= d) AND (N >= N_plan) AND (p_two < alpha)
direction = sign(p_hat - p0)
very_large_description = abs(p_hat - p0) >= 0.10
```

The calculator's exact-tail kernel is unchanged. Its discrete sample-size
search provides a starting target; the wrapper checks power in both
directions at the shared target and advances if needed. Impossible
alternatives are omitted rather than clamped. The result is a planning
target, not a proven global minimum across all discrete sample sizes.
The alert tests departure from the fair probability and filters the
observed gap. It does not establish that the true gap is at least five
points. The 95% Bayesian interval remains a separate descriptive interval;
it does not replace the alpha 0.001 or 0.05 test.

Actual net equals all returns minus all stakes. Expected net is calculated
from the full round payoff, including overlapping bets and losing outcomes.
Purchases, gifts and collectible values do not count as roulette profit.
Repeated replay draw keys are excluded from statistical sample counts;
their actual stakes and returns remain in financial totals. Source IDs and
duplicate detection keys retain their original format; **Live replay** changes
only the displayed name.

The owner-requested cleanup on 23 October 2026 removed 94 wager records with
no saved source and 70 old server-RNG wagers across current and archived
epochs. All 31 recorded-draw wagers and the total player balance were
preserved. The one-time migration records before/after counts under the
`retired-history-cleanup-20261023` key in `runtime_state` and adds an operator
audit entry. It does not delete immutable room draws, wallets or profiles.
Source: `sites-server/drizzle/0004_prune-retired-wager-history.sql` and the
hosted cleanup audit. This is an explicitly requested data cleanup, rather
than a schema change; later migrations must not re-run this deletion.

**Start new record** requires confirmation and refuses an unsettled wager.
It changes the player's current analysis epoch while preserving bankroll,
collectibles and pass access. Historical raw records remain archived on
the server. The new report uses only the new epoch.

Source: `client/insights-model.js`, `bias-math.js`, `server-records.js`,
`server-insights.js`, `test/insights-live.test.js`, and
`sites-server/rust/src/insights.rs`.

## Validation

From `C:/automation/prototypes/rou`, run `npm test`. From `sites-server`,
run `npm run test:rust` after building the Rust module. The suites cover:

- Sixty concurrent joins, ten rooms, capacity rejection and seat reuse.
- Room-scoped seats, independent draws and bankroll settlement.
- Operator authorisation, allowance enforcement and safe limit changes.
- Database work bounded to at most fifty statements for full-room
  settlement in the tested no-contention case.
- Current-epoch ownership, pagination, reset safety and wallet preservation.
- Calculator parity, fixed five-point planning, inclusive gap boundaries,
  small-gap suppression, both advantage directions, insufficient samples,
  replay duplicate handling and server settlement validation.

For a disposable local visual example, run
`node tools/preview-integration.mjs --insights-fixture`. The local Alice
account has 400 generated wager records with a 30% profitable-round rate.
This fixture is never imported into the hosted app or real player records.

[admin]: https://zhonecloud-sketch.github.io/prototypes/rou/admin.html
[game]: https://zhonecloud-sketch.github.io/prototypes/rou/
[d1]: https://developers.cloudflare.com/d1/platform/limits/
[workers]: https://developers.cloudflare.com/workers/platform/limits/
[alpha]: https://csrc.nist.gov/glossary/term/level_of_significance_a
[power]: https://www.nist.gov/glossary-term/44886
