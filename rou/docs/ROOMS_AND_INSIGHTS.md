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
- Each room has its own live random draw. Recorded replay rooms follow
  the selected dataset's sequence on the common 30-second clock. Their
  source is labelled as replay. Player cards expose usernames, bankrolls
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
calculator-required sample size, observed versus fair profitable-round
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

A signal requires both the calculator's required N and a two-sided p-value
below the selected threshold. Defaults match the existing app: monitoring
alpha 0.001, single-evaluation alpha 0.05, and detection power 80%. Required
N changes with the observed effect. “Inverted advantage” describes an
unusually low profitable-round rate in this record. Neither direction
establishes persistent luck, future positive EV or a benefit from reversing
bets. Repeated checks and selecting profiles remain exploratory.

Actual net equals all returns minus all stakes. Expected net is calculated
from the full round payoff, including overlapping bets and losing outcomes.
Purchases, gifts and collectible values do not count as roulette profit.
Repeated replay draw keys are excluded from statistical sample counts;
their actual stakes and returns remain in financial totals. Older records
without saved source metadata are kept in a separate legacy group. Their
original source and replay duplication cannot be reconstructed reliably.

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
- Calculator parity, both advantage directions, insufficient samples,
  replay duplicate handling and server settlement validation.

For a disposable local visual example, run
`node tools/preview-integration.mjs --insights-fixture`. The local Alice
account has 400 generated wager records with a 30% profitable-round rate.
This fixture is never imported into the hosted app or real player records.

[admin]: https://zhonecloud-sketch.github.io/prototypes/rou/admin.html
[game]: https://zhonecloud-sketch.github.io/prototypes/rou/
[d1]: https://developers.cloudflare.com/d1/platform/limits/
[workers]: https://developers.cloudflare.com/workers/platform/limits/
