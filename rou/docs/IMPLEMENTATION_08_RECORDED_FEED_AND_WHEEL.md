# Recorded multiplayer feed and wheel motion

Updated: 22 October 2026.

## Use and expected behaviour

- Choose Multiplayer after signing in. Every room uses consecutive values
  from `assets/2m-rng.txt`. No new multiplayer draw uses a random fallback.
- The shared calendar begins Sunday 18 October 2026, 00:00 GMT+8.
  Each 30-second slot advances one record. Each week contains 20,160 slots.
  Sunday changes the displayed weekly window without restarting playback.
- The archive loops after 2,000,000 slots, including when that happens
  during a week. The connection status then says `REPEATED DATA` and shows
  the archive pass. The operator console shows the current record and week.
- `real.html` displays the current calendar week. Its small browser worker
  updates that window on load and at Sunday rollover. A game already in
  progress buffers the complete numeric archive once, so it needs no new
  download at the weekly boundary.
- Start/Stop controls admissions and new wagers. The source calendar keeps
  advancing while stopped. Previously accepted draws remain immutable and
  settle normally. Restarting does not seek back to an earlier record.
- Imported operator datasets remain available for inspection and CRUD.
  They cannot replace, seek or reset the pinned multiplayer archive.

## Reason for the change

The previous server default used generated random results. Its optional
recorded source depended on a separately selected database and playback
start position. The new Rust build includes the same validated numeric
bytes used by the frontend. It determines the source position directly
from the shared calendar and persists each draw before use.

The numeric SHA-256 is:

`526465480d0a78a03a5222985ca19b68d75bae43386c9a60a68f191b558745ef`

The hash covers one byte per result, independent of text newline encoding.
Run `node tools/prepare-recorded-feed.mjs` from the roulette directory after
an intentional source update. It validates all two million entries and
generates both the weekly HTML and the Rust data files. Replacing this
archive changes its analysis source identity and requires a new release.

The old ball path contained a late interpolation towards the selected
pocket. The replacement prepares a bank of physical launch trials during
betting, in a dedicated worker. A trial receives no desired result: its
actual resting pocket determines its index in the bank. When the server
reveals the result, the client selects the matching launch path. The
rendered deflector and pocket triangles are also the collision geometry.
The approach ramp now matches the ball clearance at the pocket lip.

Accepted paths include deflector and pocket-wall contacts and must settle
inside a recess. Samples transfer as numeric buffers; rendering only
interpolates neighbouring positions. There is no final curve towards the
chosen pocket or a separate snap into its resting position.

Server polls can change the estimated clock offset. A monotonic visual
clock now absorbs small corrections gradually, preventing those updates
from briefly rewinding the animation. Authoritative wager deadlines and
settlement remain on the server clock.

## Implications and verification

- This is recorded playback. Historical results and future source values
  are available in the published archive; this is an entertainment feed.
- Draw identity uses the archive hash and original record index. A later
  pass or another room cannot inflate the statistical sample by counting
  the same source draw twice. All actual financial chip results remain.
- A player who joins during a spin may see the wheel before the matching
  ball path is ready. A worker failure leaves the official textual result
  available; the client never changes a result to match an animation.
- The frontend suite passes 100 tests. Physical tests cover all 37 pockets
  in six different motions, including both directions, final continuity
  and settled recess positions. The Rust parity suite passes 16 checks;
  the additional Rust integration suite passes 9, including week rollover,
  looping, repeated identities and accepted-draw preservation.
- Browser QA used the local frontend with the actual Rust Wasm service.
  The recorded source loaded all two million entries. One measured full
  spin rendered 416 frames in seven seconds, with zero main-thread tasks
  of 50 ms or longer and a maximum observed frame gap of 41.8 ms. Its
  37-path preparation completed in 4.27 seconds during betting. These are
  desktop observations, not a real-phone performance guarantee.

Frontend: GitHub Pages. Backend and persistent account data: Sites.
No database migration or change to payment behaviour is required.
