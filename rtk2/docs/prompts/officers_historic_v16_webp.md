# officers historic v16 webp

Canonical saved prompts. Line wrapping preserves the recorded wording.
Historical variants remain labelled; a new generation is not guaranteed
to reproduce the original pixels or to grant commercial rights.

## Original production prompt

```text
Use case: historical-scene
Asset type: strategy game character portrait atlas, one square bitmap texture.
Primary request: Generate exactly ONE 2048 x 2048 image, a strict 4-by-4 atlas
of sixteen equal 512 x 512 square portrait cells. The cell boundaries are at
x=512,1024,1536 and y=512,1024,1536. There must be NO drawn grid lines, NO
gutters, NO borders and NO text. Each cell is an independent head-and-shoulders
portrait against the same dark jade backdrop. No body parts, headgear, feathers,
fans or weapons cross any cell boundary. Leave ample dark jade margin on all
four sides of each portrait, including at the bottom. All faces consistently
centered at the same height and scale; full heads including headgear and
shoulder tops are contained in their own cells. Portraits should remain readily
distinguishable at 64px thumbnail size.
Style/medium: Detailed hand-painted premium historic strategy game art with
realistic East Asian faces. Late Han Chinese materials, robe shapes, cloth
headwraps and lamellar armour. Rich restrained color, crisp facial details,
subtle brush texture, directional soft illumination. Dignified nuanced
expressions, no caricature. Uniform visual style and lighting across all cells.
Backdrop: Uniform deep dark jade, softly painterly with no scenery.
Composition: Exactly four rows and four columns, each cell has exactly one
person, sixteen portraits total, fifteen identities because Xiahou Dun appears
twice in matched before/after injury variants. Strictly follow this row-major
slot manifest:

ROW 1
Slot 0, top-left: Zhuge Liang. Slim composed scholar, high forehead, neat
mustache and long narrow black beard, silk scholar headcloth, white robe, white
feather fan visible low on chest, never obscuring face. The feather fan and
scholar headcloth are conventional literary iconography.
Slot 1: Zhao Yun. Majestic martial bearing, handsome realistic clean-shaven
face. Silver-grey Han lamellar armour and Han helmet, white cloth and restrained
blue accent.
Slot 2: Liu Bei. Calm benevolent face, clean-shaven, conspicuously long earlobes
clearly visible on both ears. Green-gold Han robes and simple Han headgear that
does not cover the ears.
Slot 3, top-right: Cao Cao. Sharp watchful expression, short dark beard and
moustache, black-red Han court clothes and modest ceremonial Han hat. Imagined
historical face, NO modern imperial dragon costume.

ROW 2
Slot 4: Sun Quan. Broad dignified jaw, warm brown beard with a subtle
purple-brown tone, natural dark brown eyes, red-gold Han court clothing. NO
green eyes.
Slot 5: Xiahou Dun AFTER eye injury. Rugged middle-aged general with short dark
beard, dark Han lamellar armour, simple dark Han helmet. Mostly frontal face,
scarred CLOSED LEFT eye, which is on the VIEWER'S RIGHT. His other eye is intact
and open. No pirate patch. Remember this exact identity and clothes for slot 15.
Slot 6: Dian Wei. Extremely robust muscular neck and shoulders, very powerful
build, rough short beard, iron Han lamellar armour. Two small ji polearm tips
only glimpsed beside the outer lower shoulders, wholly inside cell and away from
face.
Slot 7: Guan Yu. Noble stern bearing, magnificent very long flowing black beard
contained in cell, green cloth Han headwrap, dark green Han robe/armour. Natural
subtle warm East Asian skin, NOT bright red skin.

ROW 3
Slot 8: Zhang Fei. Broad fierce realistic face, bushy black beard, heavy dark
Han armour. Artistic reconstruction with a clearly distinct face and build from
Dian Wei and Xu Chu.
Slot 9: Lü Bu. Tall athletic warrior suggested by posture, elegant youthful
fierce face, bronze Han helmet with a long feather crest gracefully contained
within the upper cell margin, Han armour. Iconic literary crest.
Slot 10: Zhou Yu. Young handsome elegant general, refined clean-shaven East
Asian face, red-white Han robe plus light armour.
Slot 11: Sima Yi. Lean mature strategist, penetrating composed eyes, narrow
greying beard, dark scholar headcloth, blue-black Han robes.

ROW 4
Slot 12: Huang Zhong. Elder veteran, weathered face and white beard, bronze Han
lamellar armour; a subtle bow glimpse low beside shoulder, fully within cell and
away from face. Conventional elder-veteran iconography.
Slot 13: Sun Ce. Young handsome confident warrior, clean-shaven, red-bronze Han
armour, realistic East Asian face distinctly different from Zhou Yu and Zhao
Yun.
Slot 14: Xu Chu. Very broad stocky warrior, powerful thick neck and shoulders,
short dark beard, heavy Han armour. Large waist implied by very broad torso,
distinctly different face from Dian Wei and Zhang Fei.
Slot 15, bottom-right: Xiahou Dun BEFORE eye injury. The SAME face, beard,
headgear, age, dark Han lamellar armour, pose, lighting and facial proportions
as slot 5. Both eyes intact and open, no scars. This matched variant represents
the same man before 198.

Constraints: Exactly 16 independent portraits in exactly 4 rows and 4 columns;
every head and both shoulder tops fully contained with safe margins in its own
equal square cell; no cross-cell overlap. Slot 5 scarred closed left eye is
viewer-right, slot 15 both eyes intact. All people realistic East Asian, visibly
distinct except matched Xiahou Dun identity variants. Late Han clothing, armour
and headgear; artistic historical reconstructions with only the stated
conventional iconography.
Avoid: any letters, Chinese characters, numbers, labels, signatures, captions,
watermark, frame, grid, visible cell dividers, gutters, extra people, extra
heads, weapons or fan covering faces, fantasy green eyes, vivid red skin, pirate
eyepatch, modern or medieval European armour, Qing imperial dragon robes.
```

Recorded sources:

- `docs/changes.md:officers_historic_v16_webp`
