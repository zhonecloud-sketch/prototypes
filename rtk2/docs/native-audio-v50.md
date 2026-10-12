**Current v52 correction:** [v52 findings](fixes-v52.html) restore remaster music and supersede earlier claims that simultaneous helpers/targets or automatic ambushers spend their own daily orders. The original cell flags are independent of the native own-order controller.

# V50 native audio audit and playback

The supplied English `main.exe` contains **16 effect entries**. All 16 were catalogued and their original dispatch routines and pitch/wait sequences were executed with a controlled external-driver boundary. **72 native checks pass.** This establishes the table, sequences, mute/driver fallbacks and music selection protocol; it does not establish how the original synthesizer sounded.

Source SHA-256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.
Unpacked load-image SHA-256: `5c3e45a5edb097c8719d65b1678784aaf8412258e2437a26bb89d4b249824506` (246,400 bytes).

## Original effect inventory

Offsets are in the unpacked load image. The native data segment starts at `0x2FA60`. The effect-pointer table is `DS:3930`; sixteen 22-byte driver patches start at `DS:3970`. `0x73A0` checks the sound/driver flags and dispatches the selected entry. Numeric IDs are the original zero-based IDs, not inferred names.

| ID | Entry | Verified call-site use | Remaster routing |
|---|---|---|---|
| 0 | `0x70A0` | Locust: `0xF463→0xEA9C` | Locust events |
| 1 | `0x70C6` | Epidemic: `0xF520→0xEA9C` | Epidemic events |
| 2 | `0x70EC` | Typhoon and flood: `0xF341`, `0xF3F9` | Both events intentionally share this cue |
| 3 | `0x7112` | Popular riot: `0xED85` | Popular riot events |
| 4 | `0x7138` | Meteor/evil omen: `0xD555` | Meteor events |
| 5 | `0x715E` | Officer rebellion: `0xE902` | Rebellion events |
| 6 | `0x7198` | Settlement: `0x215C5`, `0x22452` | Settlement events |
| 7 | `0x71FC` | Betrayal/field status: `0x25056`; captive prompt: `0xA286` | Betrayal events; generic status remains distinct from actual combat |
| 8 | `0x7212` | Personal-combat result: `0x289E0` | Resolved personal-combat action |
| 9 | `0x7228` | Reinforcement arrival/request/return: `0x29D9C` callers print `DS:C166`, `C18B`, `C1AB`, `C1CF` | Reinforce orders and arrival messages |
| 10 | `0x724E` | Input/wait opening: `0x58F3` | Catalogue and callable cue; existing UI selection sound retained |
| 11 | `0x7274` | Three-frame sprite animation: `0x13053` | Catalogue and callable cue; movement has a separate remaster march cue |
| 12 | `0x72AE` | Yellow Turban attack: `0x21A90`, text `DS:B00D` | Yellow Turban reports |
| 13 | `0x72D4` | Combat exchange: `0x250D7`, called within native attack animation | Normal, Charge, Simultaneous and each Ambush animation |
| 14 | `0x72FA` | Input/wait completion: `0x5976` | Catalogue and callable cue; UI completion has a separate remaster cue |
| 15 | `0x737A` | Entry and sequence verified; no direct caller found in the static inventory | Callable only; gameplay meaning remains unresolved |

The evidence file [native-audio-v50.json](native-audio-v50.json) contains each patch's hash, every captured pitch/stop/wait command, the driver protocol and static far-call candidates. Static byte candidates are an inventory, not proof that every candidate is reachable code. Labels use surrounding native text and routines; no unsupported label is assigned to ID 15.

## Supplied-driver recovery and remaining limits

The executable checks for an external **`OPLDRV`** driver (`DS:342A`). Music selection at `0x6F46` accepts IDs **0–20** and sends the driver a one-based song number. Province-dependent governance selection occurs at `0x599A`/`0x1B4AC` using `DS:3C4E`; battlefield selection at `0x59B4` adds five. Control, status, playback setting and transition wrappers are also identified.

The resumed update supplied `fmdrv.com`, which is the original **OPL-II Sound Driver Version 3.10** with the `OPLDRV` signature. Contrary to the earlier missing-song assumption, all 21 song streams are embedded in `main.exe` at `2DB9:0002` (`0x2DB92`); initialization at `0x69F0` passes that address to interrupt 66 command 0. The additional GRP/HEX/PACK data and launcher files are not required for these songs.

All **21 songs and 16 effects** were captured through the actual supplied driver: **169,674 YM3812 register writes**, using the native `1193182/4096 Hz` timer. Nuked-OPL3 renders them in OPL2 compatibility mode to 44.1 kHz mono MP3s. Gain adjustment and an 8 ms file-edge ramp make the exports usable in the browser; register values remain unchanged. The previous synthesized `native-effect-*` assets have been replaced with driver-rendered versions.

The original 72 checks above remain a **mocked driver-boundary audit**, not waveform verification. The separate [driver-backed evidence](native-opl-driver-v50.json) records all 37 MP3 hashes, durations, peaks and RMS levels. All 37 decode, contain audio, and match their captured durations within 30 ms. A truncated track was detected and re-encoded before publication; the reproduction renderer now checks a temporary encode before replacing a final asset.

Governance uses region IDs `[6,6,6,2,2,2,2,5,2,2,4,4,3,5]`; battlefield adds five. Native result tracks 15/16 play for victory/defeat from the active human participant's perspective, or the attacker's perspective when spectating. Dynasty destruction uses 14. All other recovered song IDs are included, but unknown call contexts are not guessed. `OPEN.EXE` was not supplied, so a native opening-screen song is not asserted.

Some songs stop naturally; others export until repeated melodic-channel state or a 180-second limit. Those are **playback windows**, not proven exact full FM loop endpoints. Browser council/battle playback repeats the exported window. The original effect 15's gameplay caller is still unresolved, although its patch and audio were recovered. Original hardware waveform identity, subjective listening quality and physical-phone playback remain unverified. Raw DOS reference files remain outside source, deployment and download packages.

## Linkage corrections

The previous province-order flow executed orders without notifying the audio bus. It now calls `playOrder` only after successful execution. Training, hiring, trade, recruitment, movement and diplomacy receive distinct semantic cues; other successfully executed orders receive the completion cue. AI governance reports route from the same event mapper. Previews and failed orders do not trigger execution sounds.

Human, spectator AI and HUD single-step battle orders all pass through the same resolved-message observer. Its event-serial check avoids replaying an old attack when View, deployment confirmation/reset or End has not changed `lastAction`. Detailed combat sounds instead come from the renderer's animation callback: every queued ambush receives its own cue. Charge sounds once per actual exchange, rather than once per small flash. The audio observer never applies casualties, modifies rules or draws randomness.

Sound effects and music remain independent. Hiding the page stops all active effects and music; returning resumes the applicable background theme and a courier loop only if the courier is currently moving. Fast effects are bounded to eight overlapping bursts and never displace the courier loop. Exiting stops everything.

## Reproduction and validation

The complete project includes the derived [register traces](native-opl-register-traces-v50.zip) and the renderer source with its LGPL-2.1-or-later licence under `tools/native-opl/`. No original executable, COM or DAT is included.

To reproduce audio from the supplied private originals, install Python Unicorn and NumPy and have a C compiler plus ffmpeg available:

```sh
python tools/extract-native-opl-v50.py /private/main.exe /private/fmdrv.com /tmp/native-capture
cc -O2 tools/native-opl/render.c tools/native-opl/opl3.c -o /tmp/native-opl-render
python tools/native-opl/render.py /tmp/native-capture /tmp/native-opl-render
node tests/audio-v50-tests.mjs
```

Alternatively unzip the derived register archive into `/tmp/native-capture` and run only the compiler/render steps; no DOS originals are needed for that route. The archived `build-native-audio-v50.py` synthesized fallback generator is not the source of the released native assets.

The eight audio regression groups cover every effect and song asset, native region/result routing, successful governance order sounds, event mappings, duplicate suppression, charge/ambush playback, separate mute controls, visibility cleanup, complete-duration/non-silent media evidence and asset hashes. Mounted UI tests also exercise a concealed-jungle simultaneous attack, its participant animations and every loss message.
