# RTK2 Remastered v52 — music, battle sound and daily orders

Governance and battlefield music use the original remaster recordings again, including the remaster victory fanfare. The extracted DOS music remains archived in the complete project.

| Report | Correction |
|---|---|
| Governance music | Restored `assets/council-music.mp3`. Province changes keep that loop playing. |
| Battlefield music | Restored `assets/battle-music-v17.mp3`; results use `assets/triumph-music.mp3`. |
| Intermittent battle effects | A resolved attack plays its cue even if no animation is queued. The renderer catches up skipped cue boundaries, including Charge exchanges, and pauses cues under HUD. A shared Web Audio session caches effects and resumes from player input; HTML audio remains a fallback. Failed playback is reported instead of silently discarded. Combat volume is raised from 0.32 to 0.55 so attacks are clearer under the battle music. |
| Human commander missing a turn | Being a simultaneous target, supporting another general, or automatically ambushing no longer spends that unit's own daily order. The initiating general still uses one own order. |
| Prior non-attack helper missing from simultaneous attack | This was a mechanics bug, not just a missing animation. All living friendly units adjacent to the target can support the attack, including units that already moved, waited or used Fireball. Damage, per-unit loss rows and sequential animations include them. Supporting preserves their prior own-order status; it does not give them an additional own order. |

## Why the previous interpretation was wrong

The earlier v50 audit interpreted cell bit 128 as a daily-order record. The original game's human controller actually activates a linked list of officers and uses a separate initiating-command completion byte. The cell bit is also altered by jungle drawing and concealment. Clearing it during combat does not remove helpers, victims or ambushers from their own later activation.

**32 new bounded original-executable witnesses pass**, including full simultaneous eligibility, actual linked-list controller activation, sixteen post-simultaneous follow-ups and two post-ambush follow-ups. They supersede the earlier helper/target/ambusher readiness claims. See [native findings](native-turn-audit-v52.md) and [witness results](native-turn-witness-v52.json).

## Validation and limits

Focused checks cover Move/Wait/Fireball helpers, helper damage and animation, commander movement after an enemy simultaneous attack, automatic ambush, both first-side orders, restored music, shared audio decoding, silent animation omissions, duplicate prevention and late-audio cancellation. Mounted interface checks exercise every simultaneous participant's sounds and losses, prior-order support, HUD pause, Fireball audio, and Charge with throttled rendering frames.

Run `npm test` and `npm run test:ui`. The [verification record](verification-v52.json) contains final results. Original-executable tests are bounded witnesses rather than a complete DOS playthrough. Physical browser/phone appearance and listening quality remain unverified.

**No AI training or renewal ran.** Older profiles retain their original rules identity and fall back to Legacy when incompatible. Original DOS reference binaries remain outside the repository and release package. All earlier completed UI, artwork and campaign changes are retained.
