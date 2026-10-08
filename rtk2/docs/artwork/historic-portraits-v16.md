# Historical portrait revisions — v16

The new atlas is `assets/officers-historic-v16.webp`, loaded as `officersHistoric`. Fifteen canonical identities use new portraits; Xiahou Dun has two dated variants, for sixteen distinct cells. The other 337 historical identities retain their individual portraits. There are still **352 distinct historical officers and 352 distinct displayed portraits in each campaign year**. Custom officers retain their reserved portrait.

These are artistic reconstructions, not contemporary likenesses. Physical descriptions in the Records of the Three Kingdoms are sparse and may be rhetorical. Costume, colour, apparent age, facial geometry and hair are imagined unless a specific basis is listed. The fan, feather crest and elderly archer conventions are identified as later literary iconography. No original game bitmap was copied.

| Cell | Identity | Portrait basis and limits |
|---|---|---|
| 0 | Zhuge Liang | Scholar’s bearing; SGZ 35 records considerable height. White robes, silk scholar headcloth, narrow beard and feather fan are traditional literary/artistic conventions. |
| 1 | Zhao Yun | The annotated biography describes an imposing appearance. Silver armour, clean-shaven face and white plumes are artistic choices. |
| 2 | Liu Bei | Long earlobes reflect SGZ 32. The Zhang Yu anecdote in SGZ 42 explicitly describes him as beardless; the portrait is clean-shaven. Green robes and facial geometry are imagined. |
| 3 | Cao Cao | Alert expression, dark court clothing and short beard are an artistic reconstruction; no exact facial likeness is claimed. |
| 4 | Sun Quan | Broad jaw and dignified bearing draw on the Jiangbiao zhuan annotation in SGZ 47. Brown eyes and a subtle warm brown beard avoid presenting the novel’s green eyes/purple beard as a secure historical fact. |
| 5 | Xiahou Dun, from 198 | Closed scarred left eye, which is on the viewer’s right in this near-frontal portrait. His biography records losing the left eye against Lü Bu. The 198 cutoff follows the usual campaign chronology, not an injury event in the remaster. |
| 6 | Dian Wei | Strong neck/shoulders and paired ji reflect the recorded exceptional strength and paired halberds in SGZ 18. Facial hair and armour details are imagined. |
| 7 | Guan Yu | Long beard follows the historical description; green headcloth is conventional iconography. Skin is naturally warm rather than an asserted literally red face. |
| 8 | Zhang Fei | Broad face, heavy beard and fierce bearing are familiar literary iconography, not a verified biographical facial description. |
| 9 | Lü Bu | Athletic warrior with feathered helmet is an artistic/literary interpretation, not a documented surviving likeness. |
| 10 | Zhou Yu | Refined handsome bearing follows his SGZ 54 biography. Red/white clothes and armour are artistic choices. |
| 11 | Sima Yi | Mature strategist with narrow greying beard and scholar headcloth; exact features are imagined. |
| 12 | Huang Zhong | Weathered elderly archer is traditional iconography; white beard/age depiction is not asserted to be a surviving historical description. |
| 13 | Sun Ce | Handsome young warrior follows his SGZ 46 biography. Armour colours and hair are imagined. |
| 14 | Xu Chu | Broad, powerful build reflects his SGZ 18 description of large stature and waist. Facial hair and armour are imagined. |
| 15 | Xiahou Dun, before 198 | Same identity as cell 5, with both eyes intact. The portrait changes in 198 even in Fiction mode; this is a dated artwork convention and does not alter officer attributes. |

All placements use the same aspect-preserving atlas renderer, including province header, army comparison, captive cards and general selectors. Manifest entries in `officer-portrait-manifest.json` retain the previous atlas/cell for provenance and record the Xiahou Dun variants.

## Sources consulted on 2026-10-08

- Chen Shou, *Sanguozhi*, Liu Bei biography, translated by Stephen So: https://kongming.net/novel/sgz/liubei.php
- Chen Shou, *Sanguozhi*, SGZ 42, Zhang Yu anecdote: https://ctext.org/text.pl?if=en&node=603715&show=parallel (indexed passage; full-page retrieval was unavailable).
- Chen Shou, *Sanguozhi*, Zhuge Liang biography, translated by Jack Yuan: https://kongming.net/novel/sgz/zhugeliang.php
- Chen Shou with Pei Songzhi’s annotations, Zhao Yun biography, translated by Sonken: https://kongming.net/novel/sgz/zhaoyun.php
- Chen Shou, *Sanguozhi*, Xiahou Dun biography, translated by HolyMan: https://kongming.net/novel/sgz/xiahoudun.php
- Chen Shou, *Sanguozhi*, Dian Wei and Xu Chu biographies, translated by jiuwan: https://kongming.net/novel/sgz/dianwei.php and https://kongming.net/novel/sgz/xuchu.php
- Chen Shou, *Sanguozhi*, Sun Quan biography and Jiangbiao zhuan annotation: https://zh.wikisource.org/wiki/三國志/卷47
- Chen Shou, *Sanguozhi*, Zhou Yu biography, translated by Battleroyale: https://kongming.net/novel/sgz/zhouyu.php
- Chen Shou, *Sanguozhi*, Sun Ce biography, translated by Jack Yuan: https://kongming.net/novel/sgz/sunce.php
- Chen Shou, *Sanguozhi*, Guan Yu biography, translated by Sonken: https://kongming.net/novel/sgz/guanyu.php
- Luo Guanzhong, *Romance of the Three Kingdoms*, chapter 1, for later Guan Yu/Zhang Fei iconography: https://zh.wikisource.org/wiki/三國演義/第001回

## Production

Generated with the **built-in image generation tool**, one generation request. Requested 2048×2048; returned and retained a native **1254×1254 RGB** atlas. It is square and is sampled as sixteen equal proportional cells, with no upscaling or stretching. The generated shoulders reach some cell boundaries and Lü Bu’s crest reaches the top of its cell. Each cell remains distinct and the faces are readable at mobile sizes. Runtime WebP encoding uses quality 94. The selected output was copied to the project; no external image URL is needed during play.

Source PNG: `/workspace/scratch/7b6523318ea3/portraits-historic-v16.png`
Runtime asset: `/workspace/sites/rtk2-remastered/dist/rtk2/assets/officers-historic-v16.webp`

The complete final generation prompt and row/column manifest follow.

# Historic portrait atlas v16

Generated with the built-in image_gen tool in one generation call.

Requested output: 2048 × 2048 pixels; strict 4 × 4 layout; 512 × 512 cells; row-major slots.

Final saved output: 1254 × 1254 RGB, retained at the built-in tool's native resolution as directed. The atlas uses a four-by-four layout with nominal 313.5-pixel cells. Percentage crop rectangles preserve the intended equal-cell layout; a consumer requiring integer pixel crops should round shared boundaries consistently. The output has exactly 16 row-major portraits without labels or gutters. The shoulder edges reach the cell boundaries, and Lü Bu's crest reaches the top edge of its cell, so the requested all-side margins were not fully achieved. Slot 5 has its injured left eye closed on the viewer's right; slot 15 uses the matched identity with both eyes intact.

## Slot manifest

| Slot | Row | Column | Identity | Crop rectangle as percentages x, y, width, height | Nominal native pixel rectangle |
| --- | --- | --- | --- | --- | --- |
| 0 | 1 | 1 | Zhuge Liang | 0%, 0%, 25%, 25% | 0, 0, 313.5, 313.5 |
| 1 | 1 | 2 | Zhao Yun | 25%, 0%, 25%, 25% | 313.5, 0, 313.5, 313.5 |
| 2 | 1 | 3 | Liu Bei | 50%, 0%, 25%, 25% | 627, 0, 313.5, 313.5 |
| 3 | 1 | 4 | Cao Cao | 75%, 0%, 25%, 25% | 940.5, 0, 313.5, 313.5 |
| 4 | 2 | 1 | Sun Quan | 0%, 25%, 25%, 25% | 0, 313.5, 313.5, 313.5 |
| 5 | 2 | 2 | Xiahou Dun — after injury | 25%, 25%, 25%, 25% | 313.5, 313.5, 313.5, 313.5 |
| 6 | 2 | 3 | Dian Wei | 50%, 25%, 25%, 25% | 627, 313.5, 313.5, 313.5 |
| 7 | 2 | 4 | Guan Yu | 75%, 25%, 25%, 25% | 940.5, 313.5, 313.5, 313.5 |
| 8 | 3 | 1 | Zhang Fei | 0%, 50%, 25%, 25% | 0, 627, 313.5, 313.5 |
| 9 | 3 | 2 | Lü Bu | 25%, 50%, 25%, 25% | 313.5, 627, 313.5, 313.5 |
| 10 | 3 | 3 | Zhou Yu | 50%, 50%, 25%, 25% | 627, 627, 313.5, 313.5 |
| 11 | 3 | 4 | Sima Yi | 75%, 50%, 25%, 25% | 940.5, 627, 313.5, 313.5 |
| 12 | 4 | 1 | Huang Zhong | 0%, 75%, 25%, 25% | 0, 940.5, 313.5, 313.5 |
| 13 | 4 | 2 | Sun Ce | 25%, 75%, 25%, 25% | 313.5, 940.5, 313.5, 313.5 |
| 14 | 4 | 3 | Xu Chu | 50%, 75%, 25%, 25% | 627, 940.5, 313.5, 313.5 |
| 15 | 4 | 4 | Xiahou Dun — before injury | 75%, 75%, 25%, 25% | 940.5, 940.5, 313.5, 313.5 |

## Final generation prompt

```text
Use case: historical-scene
Asset type: strategy game character portrait atlas, one square bitmap texture.
Primary request: Generate exactly ONE 2048 x 2048 image, a strict 4-by-4 atlas of sixteen equal 512 x 512 square portrait cells. The cell boundaries are at x=512,1024,1536 and y=512,1024,1536. There must be NO drawn grid lines, NO gutters, NO borders and NO text. Each cell is an independent head-and-shoulders portrait against the same dark jade backdrop. No body parts, headgear, feathers, fans or weapons cross any cell boundary. Leave ample dark jade margin on all four sides of each portrait, including at the bottom. All faces consistently centered at the same height and scale; full heads including headgear and shoulder tops are contained in their own cells. Portraits should remain readily distinguishable at 64px thumbnail size.
Style/medium: Detailed hand-painted premium historic strategy game art with realistic East Asian faces. Late Han Chinese materials, robe shapes, cloth headwraps and lamellar armour. Rich restrained color, crisp facial details, subtle brush texture, directional soft illumination. Dignified nuanced expressions, no caricature. Uniform visual style and lighting across all cells.
Backdrop: Uniform deep dark jade, softly painterly with no scenery.
Composition: Exactly four rows and four columns, each cell has exactly one person, sixteen portraits total, fifteen identities because Xiahou Dun appears twice in matched before/after injury variants. Strictly follow this row-major slot manifest:

ROW 1
Slot 0, top-left: Zhuge Liang. Slim composed scholar, high forehead, neat mustache and long narrow black beard, silk scholar headcloth, white robe, white feather fan visible low on chest, never obscuring face. The feather fan and scholar headcloth are conventional literary iconography.
Slot 1: Zhao Yun. Majestic martial bearing, handsome realistic clean-shaven face. Silver-grey Han lamellar armour and Han helmet, white cloth and restrained blue accent.
Slot 2: Liu Bei. Calm benevolent face, clean-shaven, conspicuously long earlobes clearly visible on both ears. Green-gold Han robes and simple Han headgear that does not cover the ears.
Slot 3, top-right: Cao Cao. Sharp watchful expression, short dark beard and moustache, black-red Han court clothes and modest ceremonial Han hat. Imagined historical face, NO modern imperial dragon costume.

ROW 2
Slot 4: Sun Quan. Broad dignified jaw, warm brown beard with a subtle purple-brown tone, natural dark brown eyes, red-gold Han court clothing. NO green eyes.
Slot 5: Xiahou Dun AFTER eye injury. Rugged middle-aged general with short dark beard, dark Han lamellar armour, simple dark Han helmet. Mostly frontal face, scarred CLOSED LEFT eye, which is on the VIEWER'S RIGHT. His other eye is intact and open. No pirate patch. Remember this exact identity and clothes for slot 15.
Slot 6: Dian Wei. Extremely robust muscular neck and shoulders, very powerful build, rough short beard, iron Han lamellar armour. Two small ji polearm tips only glimpsed beside the outer lower shoulders, wholly inside cell and away from face.
Slot 7: Guan Yu. Noble stern bearing, magnificent very long flowing black beard contained in cell, green cloth Han headwrap, dark green Han robe/armour. Natural subtle warm East Asian skin, NOT bright red skin.

ROW 3
Slot 8: Zhang Fei. Broad fierce realistic face, bushy black beard, heavy dark Han armour. Artistic reconstruction with a clearly distinct face and build from Dian Wei and Xu Chu.
Slot 9: Lü Bu. Tall athletic warrior suggested by posture, elegant youthful fierce face, bronze Han helmet with a long feather crest gracefully contained within the upper cell margin, Han armour. Iconic literary crest.
Slot 10: Zhou Yu. Young handsome elegant general, refined clean-shaven East Asian face, red-white Han robe plus light armour.
Slot 11: Sima Yi. Lean mature strategist, penetrating composed eyes, narrow greying beard, dark scholar headcloth, blue-black Han robes.

ROW 4
Slot 12: Huang Zhong. Elder veteran, weathered face and white beard, bronze Han lamellar armour; a subtle bow glimpse low beside shoulder, fully within cell and away from face. Conventional elder-veteran iconography.
Slot 13: Sun Ce. Young handsome confident warrior, clean-shaven, red-bronze Han armour, realistic East Asian face distinctly different from Zhou Yu and Zhao Yun.
Slot 14: Xu Chu. Very broad stocky warrior, powerful thick neck and shoulders, short dark beard, heavy Han armour. Large waist implied by very broad torso, distinctly different face from Dian Wei and Zhang Fei.
Slot 15, bottom-right: Xiahou Dun BEFORE eye injury. The SAME face, beard, headgear, age, dark Han lamellar armour, pose, lighting and facial proportions as slot 5. Both eyes intact and open, no scars. This matched variant represents the same man before 198.

Constraints: Exactly 16 independent portraits in exactly 4 rows and 4 columns; every head and both shoulder tops fully contained with safe margins in its own equal square cell; no cross-cell overlap. Slot 5 scarred closed left eye is viewer-right, slot 15 both eyes intact. All people realistic East Asian, visibly distinct except matched Xiahou Dun identity variants. Late Han clothing, armour and headgear; artistic historical reconstructions with only the stated conventional iconography.
Avoid: any letters, Chinese characters, numbers, labels, signatures, captions, watermark, frame, grid, visible cell dividers, gutters, extra people, extra heads, weapons or fan covering faces, fantasy green eyes, vivid red skin, pirate eyepatch, modern or medieval European armour, Qing imperial dragon robes.
```

