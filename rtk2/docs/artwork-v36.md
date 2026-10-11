# V36 historical scenes and event sound

All 15 scheduled historical scenes now have individual image assets under `assets/history-v36/`. A sixteenth scene serves unknown historical entries. They are original generated paintings, not reconstructions of surviving likenesses.

Each WebP is natively **1983 × 793 pixels**. No enlargement or stretching was used when preparing these files. Compared with a v30 history-atlas cell (991.5 × 396.5), each replacement provides twice the width and height, or four times the pixels. The generation prompt requested 3840 × 1536; the actual generator output was 1983 × 793, so these are not claimed as 4K images.

The complete generation prompts and the historical correction applied to the 223 scene are in `artwork/history-generation-v36.json`. The shared renderer reads each standalone image as a whole scene, uses one proportional contain scale, and loads scenes on demand. Old history atlases remain only for existing regressions/provenance. Release asset hashes identify the active files.

| Year | Scene |
| --- | --- |
| 189 | Dong Zhuo controls the Han court |
| 190 | Coalition against Dong Zhuo |
| 192 | Wang Yun and Lü Bu's plot |
| 194 | Tao Qian entrusts Xu Province to Liu Bei |
| 197 | Yuan Shu proclaims himself emperor |
| 200 | Guandu / Wuchao |
| 207 | Visit to Zhuge Liang's cottage |
| 208 | Red Cliffs |
| 215 | Cao Cao at Hanzhong |
| 219 | Guan Yu's capture |
| 220 | Han abdication to Cao Pi |
| 221 | Liu Bei proclaims Shu Han |
| 222 | Lu Xun's counterattack at Yiling |
| 223 | Baidicheng deathbed council |
| 229 | Sun Quan's imperial proclamation |
| Fallback | Historical council and envoy |

`tools/build-event-audio.py` reproducibly creates eight original nonverbal synthesized effects: uneven four-hoof gallop clusters, flood water and distant distress textures, locust wing swarms, typhoon wind/rain, epidemic cough textures, uprising crowd/drums, meteor whoosh/gong, and a solemn death gong. These are synthesized textures, not sampled human or animal recordings. Sound effects respect the existing Sound toggle, playback unlock, app activity and document visibility. The music toggle remains separate. Existing message durations and mechanics are unchanged.

Validation includes whole-scene proportional rendering, distinct image hashes, native dimensions, compact war summaries, sound routing/muting, mounted order confirmation and Province-toggle flows, and mobile CSS checks. Browser and actual handset rendering/listening were unavailable in this environment; the generated scenes were visually inspected, but device audio and final on-phone layout still need direct checking.
