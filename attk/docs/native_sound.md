# Native sound and v56 playback

This document separates verified `main.exe` callers, recovered media, and the remaster's current routing. It is based on the supplied English executable, not a claim that every original sound situation has been recovered. Source SHA-256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`; unpacked 246,400-byte image: `5c3e45a5edb097c8719d65b1678784aaf8412258e2437a26bb89d4b249824506`.

## Effect inventory

IDs below are zero-based. Files are `assets/sounds/native-effect-N.mp3`. `DS` begins at load-image offset `0x2FA60`; pointers are at `DS:3930`, driver patches at `DS:3970`, dispatch at `0x73A0`. “Callable” means the API can play the cue; it does not mean normal gameplay invokes it.

| ID / entry | Verified original situation and caller | Current remaster situation |
| --- | --- | --- |
| 0 / 70A0 | Locust; F463 → EA9C | Locust event, native 0. |
| 1 / 70C6 | Epidemic; F520 → EA9C | Epidemic event, native 1. |
| 2 / 70EC | Typhoon and flood; F341 / F3F9 | Both events share native 2. |
| 3 / 7112 | Popular riot; ED85 | Riot events and matching popular-uprising report text, native 3. |
| 4 / 7138 | Meteor / evil omen; D555 | Meteor event, native 4. |
| 5 / 715E | Officer rebellion; E902 | Rebellion events and matching rebellion report text, native 5. |
| 6 / 7198 | Settle province; 215C5 / 22452 | Settlement events and matching settlement text, native 6. |
| 7 / 71FC | Betrayal / field status at 25056; captive prompt at A286 | Betrayal and prison/captive presentation, native 7. |
| 8 / 7212 | Personal-combat result; 289E0 | Challenge action / duel event, native 8. Routing does not prove identical native result timing. |
| 9 / 7228 | Reinforcement arrival/request/return; 29D9C; text DS:C166, C18B, C1AB, C1CF | Reinforce action and reinforcement event, native 9. |
| 10 / 724E | Input/wait opening at 58F3; v54 captive result traces also identify refusal feedback | Retained and explicitly callable. Ordinary button/selector clicks are silent; the generic order mapper does not implement a separate native refusal cue. |
| 11 / 7274 | Sprite animation at 13053; v53 courier witness identifies native messenger travel cue 11 | Retained and callable. Messenger travel is overridden by the supplied horse recording. March movement uses remaster march.mp3. |
| 12 / 72AE | Yellow Turban attack; 21A90, text DS:B00D | Reports containing Yellow Turban attack text, native 12. |
| 13 / 72D4 | Combat exchange at 250D7 / 250DA during native attack animation | Ambush uses native 13. Normal/Simultaneous and Charge use the user-selected replacement clips below. |
| 14 / 72FA | Input/wait completion at 5976; v54 captive traces identify successful-result feedback | Successful governance orders and order/council/diplomacy/message/treasure/marriage/birth event categories use native 14. This broad mapper is not evidence that every original order used it. |
| 15 / 737A | Entry, patch and pitch/wait sequence verified; direct gameplay caller unresolved | Retained and callable, without an automatic gameplay route. |

Original call-site evidence: [native audio catalogue](native-audio-v50.json), [courier witness](messenger-witness-v53.json), [captive sound witness](native-captive-audio-v54.json). The historical reports, including superseded routing statements, are preserved in [changes.md](changes.md).

## Music inventory

Files are `assets/music/native-music-N.mp3`. All 21 IDs (0–20) are valid at native selector `0x6F46`, which sends the driver ID + 1. Song streams are embedded at `2DB9:0002` (`0x2DB92`); initialization `0x69F0` passes them to interrupt 66 command 0. Governance selectors `0x599A` / `0x1B4AC` read `DS:3C4E`; battlefield selector `0x59B4` adds five.

| Native ID | Verified original situation | Zero-based province region indices | v56 use |
| --- | --- | --- | --- |
| 0 | Caller context unresolved | — | Reference/test media only |
| 1 | Static candidate C48C; surrounding gameplay context not verified | — | Reference/test media only |
| 2 | Governance region music; also static candidate 6B2B | 3, 4, 5, 6, 8, 9 | Reference/test media only |
| 3 | Governance region music | 12 | Reference/test media only |
| 4 | Governance region music | 10, 11 | Reference/test media only |
| 5 | Governance region music | 7, 13 | Reference/test media only |
| 6 | Governance region music | 0, 1, 2 | Reference/test media only |
| 7 | Battlefield counterpart of 2 | 3, 4, 5, 6, 8, 9 | Reference/test media only |
| 8 | Battlefield counterpart of 3 | 12 | Reference/test media only |
| 9 | Battlefield counterpart of 4 | 10, 11 | Reference/test media only |
| 10 | Battlefield counterpart of 5 | 7, 13 | Reference/test media only |
| 11 | Battlefield counterpart of 6 | 0, 1, 2 | Reference/test media only |
| 12 | Static candidate 78AD; meaning unresolved | — | Reference/test media only |
| 13 | Caller context unresolved | — | Reference/test media only |
| 14 | Dynasty/clan destruction; candidate 7F07 | — | Reference/test media only |
| 15 | Victory result, relative to active human participant; attacker perspective when spectating | — | Reference/test media only |
| 16 | Defeat result, same perspective; candidate 8AFF | — | Reference/test media only |
| 17 | Caller context unresolved | — | Reference/test media only |
| 18 | Static candidate 1E694; meaning unresolved | — | Reference/test media only |
| 19 | Static candidates 99AB / 1E600; meaning unresolved | — | Reference/test media only |
| 20 | Caller context unresolved | — | Reference/test media only |

Static far-call byte matches are candidates, not proof that every match is reachable code. Dynamic candidates 8177 (DS:40D4), 1E72B and 1E7B2 need further caller analysis. No opening-screen music is attributed because `OPEN.EXE` was not supplied.

**No native-music file is played by v56's AudioBus.** The `nativeMusicFor` helper preserves and tests the original mapping, but the runtime track constructor loads only the following original remaster compositions. Region changes do not switch the remaster governance/battle tracks.

| File under assets/music/ | Current situation | Behavior |
| --- | --- | --- |
| council-music.mp3 | Governance/council theme; default and unrecognized-theme fallback, including clan | Loop |
| battle-music-v17.mp3 | Battlefield theme | Loop |
| triumph-music.mp3 | Remaster result/triumph presentation when selected | Play once; not separate native victory/defeat songs |

## User-selected and remaster effects

All files below live in `assets/sounds/`. The supplied three MP3s retain their original bytes and hashes from [audio-assets-v55.json](audio-assets-v55.json).

| Situation | File / routing | Trigger and limits |
| --- | --- | --- |
| Normal and Simultaneous | freesound_community-sword-battle-jingle-loop-96983.mp3 | One cue per animated exchange on cycle 1, later flash cycles silent; one observer fallback when animation is unavailable. |
| Charge | audiomass-charge_scream.mp3 | One cry per resolved charge order, not per flash. |
| Messenger outward/return travel | audiomass-horse_gallop.mp3 | Movement-only loop governed by the same courier clock as the rider; unlocked Web Audio, gain 1; HTML Audio fallback. Stops at arrival, interception/proposal, mute, hidden page and exit. |
| Fire / Fireball | fire.mp3 | Action cue, including failed fireball; fallback burnt/caught-fire reports. |
| Move / Move enemy / placement / deployment | march.mp3 | Resolved movement action. |
| Withdraw / retreat / flee | retreat.mp3 | Resolved withdrawal action. |
| Bribe / View; inspection and relevant dialogue fallback | message.mp3 | Resolved action/message. |
| Other battlefield actions / deployment reset | order.mp3 | Generic action/status fallback. |
| Month transition | month.mp3 | Application end-turn transition cue. |
| Officer death / clan event | death.mp3 | Event mapper. |
| Explicit uprising event | uprising.mp3 | Event mapper; riot/text branches can instead select native 3. |
| Recruitment success text | recruit.mp3 | Fallback only when earlier event-category routing does not take precedence. |
| Simple Events/Province/Orders/Rest/View button or selector click | Silent | play('select') returns without loading audio. Order execution has its own feedback. |

The event mapper returns native 14 before its later semantic train/trade/march/message branches for order/council events. Consequently those later branches do not prove that all governance sounds are fully adopted from `main.exe`. `train.mp3`, `trade.mp3`, legacy disaster MP3s and earlier test artwork are retained because existing test/API contracts still reference them; review their value using [test_spec.md](test_spec.md) before removing that coverage.

## Evidence, validation and unresolved work

All 21 songs and 16 effects were captured through supplied OPL-II Sound Driver Version 3.10 (`OPLDRV`): 169,674 YM3812 writes at `1193182/4096 Hz`, rendered with Nuked-OPL3 in OPL2 compatibility mode as 44.1 kHz mono exports. [Driver-backed provenance](native-opl-driver-v50.json) records 37 byte counts, SHA-256 values, duration/peak/RMS checks; [register traces](native-opl-register-traces-v50.zip) remain available. The 72 dispatch checks in the catalogue mock the driver boundary and are separate from waveform/export verification.

The audio-v50/v52/v53/v55/v56 suites test dispatch, export hashes, playback deduplication, overlapping effects, courier timing/cancellation and mute/visibility. The v56 UI suite mounts the app and checks sound/animation integration. They do not prove physical-phone audibility, original hardware waveform identity or subjective balance.

Unresolved original callers (effect 15 and music contexts listed above), exact native loop endpoints, native-versus-remaster challenge/result timing and branch-specific governance feedback remain pending. Do not assign guessed labels or claim complete native adoption. Original song exports use bounded capture windows, not established original FM loop boundaries. Sound and music settings are independent; hidden pages and exit stop playback. These limitations and proposed native/emulator and physical-device checks are also recorded in [pending-test-case-design.md](pending-test-case-design.md).

## Rights and provenance

Moving or retaining an asset does not grant permission to sell it. Native-derived media retains the Koei rights concern. The user's replacements retain the Pixabay/Mixkit provenance, AudioMass edit history and standalone redistribution limitations documented in [the consolidated audio licensing assessment](changes.md#record-audio-licenses-v55) and [commercial rights audit](changes.md#record-commercial-rights-audit-v56). This maintenance does not alter those conclusions.
