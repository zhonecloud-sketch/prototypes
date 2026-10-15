# Reported-bug validation contract (v53 onward)

Every reported bug receives a named behavioral test or sub-test. Exceptional cases must have a pending design with the missing fixture/environment and a concrete solution. A test must exercise the behavior and observe an outcome, rather than merely count a generated report or hash implementation text. A passing bounded native witness is evidence for its executed paths only. It must identify hooked consequential paths and link those paths to integration tests or pending designs.

The v52 source was tested before the v53 implementation: eight reproductions failed and the existing intercepted-let-pass/return behavior passed. Reproductions and fixes are in `tests/v53-tests.mjs`; runtime sound paths are in `tests/audio-v53-tests.mjs`; mounted controls and Canvas are in `tests/ui-tests.mjs`.

| Report | Corresponding behavior case / observed result |
| --- | --- |
| 53 feature 1: every bug needs coverage | This ledger and root AGENTS.md require named behavioral coverage; exceptions are listed in pending-test-case-design.md. This is a maintenance requirement, not a game mechanic. |
| 53-01 validation value/storage | Removed four metadata/source-hash/guide-only sub-tests and the unused map-guide verification generator, JSON, Markdown, 41 guide PNGs and advice hash file. Active paintings and native terrain/deployment tests remain. Artifact packaging is exercised before each release. Complete historical failure logs do not exist, so useful mixed suites cannot be classified as “never caught a bug.” |
| 53-02 Normal versus Charge audio | audio-v53: Charge produces one distinct shout, retains native13 hits, and does not duplicate on re-observation. Normal has no crowd shout. audio-v52 + mounted existing combat tests cover each participant, Fireball and throttled Charge exchanges. Listening quality is pending. |
| 53-03 Defender choosing Normal instead of Simultaneous | v53: palace defender/commander at low and medium intelligence resolves grouped attacks; helpers keep their own orders. Single-attacker ordinary attacks remain covered by battle-tests. Native AI witnesses run joint assembly for both camps, palace/plain, commander/ordinary and difficulty1/5. |
| 53-04 AI jungle visibility | v53: both active army phases use the human observer; jungle survivors reconceal; changing human side changes the observer. Mounted UI checks human attackers and defenders for absent hostile sprites/labels/flags. Renderer filters selection/reach overlays; normal move announcements no longer publish concealed coordinates. Explicit debug HUD is an inspector, not fog-of-war UI. |
| 53-05 Forced arrival ambush | v53: human and AI pulls, six direction arcs, even/odd columns, preserved enemy MP/helper orders, fire entry before ambush and fire death suppressing ambush. Mounted existing double-ambush tests prove structured events produce queued animations without repeated damage. |
| 53-06 Prior audit omissions | changes.md#record-native-battle-audit-v53 identifies the old ambush stub and missing human-observer UI transition. Cases53-04/05 cover the formerly skipped consequence paths. This finding is an audit correction, not a separate gameplay change. |
| 53-07 Burning an already-burning unit | v53: successful second ignition reduces men again; failed ignition preserves prior fire and men; 84 executed native terrain/INT/weather vectors and mountain-fire checkpoints are compared against the engine equation. Existing v43 tests cover ignition/order fire and weapon deduction. |
| 53-08 Governance audio | v53: order completion native14 and captive native7. audio-v53: moving outward/back uses native11 and stops when stationary, muted, hidden or destroyed. Mounted controller verifies native10 opening and native11 return motion. Unresolved native sound contexts and speaker fallback remain pending. |
| 53-09 Messenger context and choices | v53: directed hostility, allied trust, letter passage, delivery once and return without interceptions. Mounted interception/captive cards show sender ruler, origin, directed hostility/alliance and actual button effects; wrapping/auto-height footer is checked. Allied hostile-mission exemption is covered: sender hostility+8, reverse hostility+3, host trust unchanged. |
| 53-10 Set-free return | v53: intercepted Let pass delivers once and follows every reverse edge; capture→release restores sender service and runs a release-only return without delivery/refund; save/load midway, lost-home redirection and forged outbound return rejection. Mounted controls play the moving return and native11. Ordinary-captive release animation is a remaster extension; native ordinary-captive menu does not establish this exact path. |
| 52-01/02 restored governance/battle music | audio-v52 asserts the original remaster recordings and stable loops. |
| 52-03 intermittent battlefield effects | audio-v52 covers absent animation fallback, each animated hit, both Fireball outcomes, shared decode, suspended-context resume, mute/hide cancellation and error visibility; mounted tests cover every participant and throttled rendering. |
| 52-04 human commander missing turn | v52 tests issue a later Move after enemy Simultaneous and verify both first-side order sequences, ambush and helper readiness. |
| 52-05 prior non-attack helper excluded | v52 Move/Wait/Fireball sub-cases verify helper damage, sequential animation, preserved completed own order and rejection of an extra order. |
| Earlier concealed simultaneous-target report | v50-battle tests issue visible and blind jungle simultaneous attacks and validate losses/participants, misses and readiness; display reconcealment is additionally checked by53-04. |

## Validation cleanup decision

Removed material occupies 1,158,957 bytes before the small removed test bodies. No retained archive proves that every old script never failed; whole scripts mix arithmetic, save, runtime and fixture checks. Removing them all would erase regression coverage rather than satisfy the new rule. The deleted sub-cases asserted generated metadata counts, generation-guide consistency or old source hashes, not the reported gameplay. The guide PNGs are not gameplay assets. Their removal reduces the current checkout and future release payload; old Git commits still retain recovery history.

Retained all 41 active paintings, native map/deployment verifiers, decoded-audio corruption/duration checks (which detected incomplete rendered effects), native arithmetic vectors and reported-bug fixtures. Test scripts are small compared with runtime art/audio.

## V54 reported bugs and native-conformance clarification

| Report | Named test / observable outcome |
| --- | --- |
| BUG-54-01 captive ruler eligibility | `v54-tests`: zero/one/two provinces × hostility0/50/80/100 retains Set free/Behead and rejects forged Recruit without mutating state.49 native captive/audio witnesses include the real human menu and full ruler-detection/list controller. The user clarified native conformance after evidence showed no last-province Recruit option; no extension was added. |
| BUG-54-02 simultaneous loss sum | `v54-tests`: replay21 human-handler and88 AI-handler original fixtures, then shuffle every roster; compare every soldier/equipment count, native RNG use, early-stop and exchange count. The displayed per-attacker inflicted rows sum to the actual target aggregate. The old helper-list order failed a three-attacker shuffle. The existing casualty equation was already correct; the new geometrical order restores exact sequential outcomes. |
| BUG-54-03 placement information | `v54-ui-tests`: mounted deployment panel shows selected general and live Men/Weapons/Train/WAR/INT/MP; switching units updates fields without changing any unit statistics. Native compact selector is visible and the summary scrolls. The v53 controller reproduction failed for missing summary. |
| BUG-54-04 turn presentation | `v54-tests`: deterministic cue stages prove announcement precedes highlight, AI waits for announcement completion, and stale frames are cancelled. `v54-ui-tests`: mounted AI step has unchanged battle serial during the announcement, executes once, then displays impact; immediate human Wait after selecting another unit is deferred until its turn/highlight and is executed once. The v53 controller reproduction lacked a pre-action announcement. Existing UI checks now await the intended presentation instead of asserting the old post-order turn label. |
| BUG-54-05 button audio | `v54-tests`: plain selector cue emits no audio while explicit native feedback remains available. `v54-ui-tests`: real Events/Province/Orders, Rest/View and military menus do not play a selection/opening sound. The v53 controller failed this same interaction sequence. Native468A/4888 input witnesses confirm silence, including invalid numeric retry; actual result162CE confirms success14/refusal10. |

The native journal in this release contains21 human joint-attack comparisons,88 AI joint-attack comparisons and49 captive/audio witnesses (158 total). AI cases cover human-target difficulty1/3/5, plain/palace, three/four attackers, mixed power and early defeat. Original image SHA-256 is verified. Reports specify hooked rendering and consequence boundaries; data inventories alone do not replace the behavioral tests above.

## V55 user-selected audio overrides

The v55 routes supersede native13 for Normal/Simultaneous, the synthetic charge shout/native charge hits, and native11 for courier motion. Those native assets remain reference material. Four audio reproductions failed against v54; the unrelated-cue/BGM guard passed. Dedicated `v55-ui-tests` use isolated saved fixtures and wait for actual command/animation completion. The unrelated legacy full-UI suite remains incomplete in this environment because of fixed100ms challenge/presentation assumptions; its proposed clock-isolation redesign is documented in pending-test-case-design.md.

| Report | Named behavior / outcome |
| --- | --- |
| BUG-55-01 Normal / Simultaneous recording | `audio-v55-tests`: exact supplied sword URL through Web Audio and HTML fallback; every animated participant uses it once, cycles2–8 do not repeat it, re-observation does not replay, decode is cached. Mounted UI verifies one clip per Normal hit and each Simultaneous participant, with unchanged damage/RNG. |
| BUG-55-02 Charge recording | `audio-v55-tests`: supplied cry exactly once for animated and fallback orders; 80 charge flashes and re-observation add no old native hits. Isolated mounted Charge executes once and plays one cry. |
| BUG-55-03 Messenger gallop | `audio-v55-tests`: supplied loop for outward/return motion; repeated motion updates do not duplicate; unrelated combat does not interrupt it; stationary/mute/hidden/exit stop it. Mounted captured-messenger Set free still visibly returns and plays the supplied gallop. |

All three uploads were copied byte-for-byte and completely decoded with ffmpeg; identities, duration and levels are in `audio-assets-v55.json`. Actual listening and loop-seam evaluation are pending. Licence interpretation is documented in `changes.md#record-audio-licenses-v55`, not certified by automated tests. No training ran.

## V56 concealed charges, settlement and courier regression evidence

The six initial v56 groups failed on v55 (concealed Charge, empty-miss handoff, terminal arrival ambush, duplicate joint status, captive loyalty initializer and legacy captive retry). The Web Audio courier reproduction failed four groups on the v55 module while its HTML fallback guard passed. Earlier acceptance/refusal expectations in decisions/v27/v29 tests are replaced by the executed native captive behavior; serving-general absolute loyalty/shared-family tests are retained. Cache-identity expectations now match v56.

| Report | Named behavior / observable result |
| --- | --- |
| BUG-56-01 concealed jungle Charge | `tests/v56-tests.mjs`: coordinate Charge hits the concealed enemy; direct hidden-ID/friendly guesses reject atomically without order/MP/RNG. `tests/v56-ui-tests.mjs`: actual mounted Charge selection and hex controls succeed while enemy label stays hidden. Native265AE accepts Charge mode4 for concealed and revealed enemies. |
| BUG-56-02 mistaken concealed attack | `v56-tests`: empty Normal/Simultaneous/Charge spends only initiator daily order, keeps MP and men, uses no casualty RNG, selects next ready officer. Burning miss applies post-order fire exactly once; valid actual-map save/load keeps the spent order. Native daily226A0→26980→26804→265AE advances the officer list after all three misses. |
| BUG-56-03 Charge arrival ambush | `v56-tests` invokes actual-engine comparison tools for48 continuing branches and24 native captured-target/commander branches. Prior v55 fails12 commander cases by adding an ambush after terminal capture. `verify-charge-arrival-raster-v56.mjs` executes24 actual Canvas queues: Charge then three forward ambushes, eight cues each, with no repeated gameplay RNG/casualties. Side/rear jungle is not an original trigger. Continuing-path missing ambush was not reproduced. |
| BUG-56-04 simultaneous duplicate status | `v56-tests`: both initiating camps get one neutral both-camp total and each individual once; terminal capture notices follow the breakdown, and later status cannot replay the old summary. Mounted UI records actual toast transitions and checks the same sequence. Existing109 native joint damage vectors continue to assert sums/order/early stopping. |
| BUG-56-05 messenger missing gallop | `audio-v56-tests`: exact horse MP3 loops in unlocked Web Audio while HTML horse autoplay is denied; correct650ms movement clock, cancellation during decode, retry after fetch error, HTML fallback and mute/background/destroy. Mounted capture→Set free→return records renderer moving states and exactly one corresponding Web Audio loop per step; expiry stops each source. No physical listening claim. |
| BUG-56-06 abstract retreat | `v56-tests`: actual resolveBattle prioritizes occupied friendly over empty neighbors in either candidate ordering, leaves unclaimed roster unchanged, records returned commander and roundtrips save. Native unclaimed fallback and sequential+50 keep escapees with original realm; no refuge skips escape draws. Nine threshold/RNG endpoint vectors execute production escape helper. Native88 settlement/captive witnesses include12 destination cases,2 complete abstract controller entries,9 equation cases,1 no refuge and64 captive choices. |
| BUG-56-07 captive recruitment | `v56-tests`:64 human/AI native vectors match acceptance, INT+WAR69/70 choices, exact new loyalty and one jitter/no refusal draw, including old loyalty90/99/100, former hostility100, ownership and former-advisor cleanup. Legacy refused ordinary captive is recruitable. Updatedv29 retains serving-general immunity and separately confirms Guan Yu/Zhang Fei captive acceptance. Ruler menu remains separately tested. |

Native witness sources: `tools/verify-native-concealed-v56.py`, `verify-native-charge-arrival-v56.py`, `verify-native-charge-terminal-v56.py`, `verify-native-settlement-v56.py`. Original executable SHA256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`; the executable itself is not packaged. Their JSON and notes list hooked input/render/casualty/geometry boundaries. 190 witnesses are bounded execution evidence, not complete DOS-game certification. Commercial licence findings are source research rather than test assertions.

## Personal combat follow-up

PC-01 through PC-04 now have deployment, native arithmetic, mounted UI and
actual browser regressions. See [the case mapping and commands][pc-cases].
The original executable contributes 106 bounded witnesses. Physical phone
and sound-enabled DOS hardware timing limits remain explicit there.

[pc-cases]: personal-combat.md

## Visual interval follow-up

Run `node tests/visual-interval-tests.mjs` and the combat UI commands in
[the personal combat note][pc-cases]. Expected: all interval, combat and
mounted UI groups pass. The renderer command there runs 96 cases.

- VI-01: one 3000 ms constant; fixed events survive speed changes and pause.
  Evidence: `visual-interval-tests.mjs`, queue and duration assertions.
- VI-02: challenge card lasts three seconds for either human side.
  Evidence: `personal-combat-ui-tests.mjs`, deployment/challenge cases.
- VI-03: four distinct full scenes loop every three seconds; counters use
  Game Speed and the result ends playback immediately. Evidence:
  `personal-combat-tests.mjs` and the mounted four-frame pixel checks.
- VI-04: initiator win/loss card and subsequent capture notice each last
  three seconds. Evidence: both mounted outcome sequences.
- VI-05: charge landing ambushes use Game Speed with eight flashes each.
  Evidence: `verify-charge-arrival-raster-v56.mjs`, 96 actual Canvas queues.
- VI-06: ruler, commander and general capture notices use three seconds.
  Evidence: `visual-interval-tests.mjs`, three real engine capture cases.
- VI-07: fireball success/failure precedes the ignition loss report; each
  uses three seconds. Evidence: `visual-interval-tests.mjs` and
  `v23-tests.mjs`, successful/failed orders and event serial ordering.

Physical phone verification remains pending as described in the note.

## Loss notices and sound follow-up

Run `node tests/visual-interval-tests.mjs`,
`node tests/audio-v55-tests.mjs` and
`npm run test:battle-feedback:browser`. Expected: all groups pass.

- FB-01: effect 7 replacement is a suggestion only. Existing prison and
  betrayal routing remains covered by the audio tests. Candidate and
  generator evidence: [sound note][feedback-sound].
- FB-02: effect 9 uses the supplied charge scream for direct calls,
  reinforcement events/actions and message fallback. Evidence:
  `audio-v50-tests.mjs`, `audio-v55-tests.mjs` and the browser decode check.
- FB-03: men/training/weapons losses use `VISUAL_INTERVAL`, including
  generated simultaneous totals and individual rows, normal/charge,
  ambush, fire and desertion. Evidence: `visual-interval-tests.mjs`,
  real engine messages, training/weapons fixtures, negative controls and
  queue transitions at all four speeds. The browser checks an actual
  loss toast at 500 ms Game Speed lasts three seconds.

The training-loss fixture tests message presentation; it does not claim
that combat reduces training. Physical-phone listening remains pending.

[feedback-sound]: native_sound.md#effect-9-replacement
