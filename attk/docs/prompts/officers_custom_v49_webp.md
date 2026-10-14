# officers custom v49 webp

Canonical saved prompts. Line wrapping preserves the recorded wording.
Historical variants remain labelled; a new generation is not guaranteed
to reproduce the original pixels or to grant commercial rights.

## Initial generation

```text
Use case: historical-scene.
Asset type: one cohesive square character portrait atlas for the existing
Romance of the Three Kingdoms II remastered strategy game.
Primary request: Generate exactly ONE square 2048 x 2048 bitmap with a strict 4
COLUMNS by 4 ROWS atlas, exactly sixteen independent head-and-shoulder busts in
sixteen equal square cells. Use row-major slots 0-15 specified below. Each cell
is exactly one person, fully contained, same head scale and face height,
generous dark margin above all headgear and beside shoulders, upper chest
visible. No artwork crosses into a neighbouring cell. There are NO grid lines,
NO gutters, NO borders, NO text and NO labels. The sixteen adjacent square cells
are defined by composition only.
Style/medium: Rich realistic hand-painted premium historical strategy game
character art, detailed East Asian adult faces, subtly painterly rather than
photographic, similar to classic Three Kingdoms strategy-game officer portraits.
Crisp eyes and distinguishing facial geometry readable at 64px thumbnail size.
Shared dark jade and warm dark brown flat studio backdrop, warm soft directional
light, restrained earthly colours, late Han / Three Kingdoms cross-collared
robes, plain headcloths, restrained civil crowns and lamellar armour.
Historically inspired artistic interpretations, no claims of authentic
likenesses. NO modern fantasy or imperial dragon costumes. The women are adult,
dignified and commanding, similarly detailed realistic art to the men.
Composition/framing: Each bust faces mostly toward viewer, only slightly
three-quarter. All sixteen faces must be genuinely distinct, not merely
recolours of a single face. Vary age, cheekbones, jaw, eyebrows, noses, facial
hair, hair and costume as specified. Same portrait crop and visual scale for
male and female. Full head/headwear and shoulder tops inside each individual
cell with safety margins.

ROW 1, four distinct male player custom-ruler choices:
Slot 0, row1 column1: man approximately 30, angular narrow face, calm sharp dark
eyes, clean shaven, black folded civil headcloth, deep blue-green cross-collared
scholar robe, restrained composed strategist.
Slot 1, row1 column2: man approximately 35, square jaw, tanned skin, short neat
dark beard, dark iron Han helmet fully inside cell, iron lamellar cuirass with
rust cloth, confident martial commander.
Slot 2, row1 column3: man approximately 45, broad oval face, small composed dark
eyes, medium moustache and pointed beard, modest tall dark Han court crown,
burgundy and bronze formal robe, dignified ruler.
Slot 3, row1 column4: man approximately 25, high cheeks, warm medium skin, thick
straight eyebrows and clean-shaven face, simple topknot with brown silk band,
dark charcoal leather armour over muted cream robe, alert balanced leader.

ROW 2, four distinct female player custom-ruler choices:
Slot 4, row2 column1: woman approximately 28, oval face, perceptive dark eyes,
delicate straight brows, natural skin without heavy makeup, black hair gathered
in a tidy Han bun with small bronze pin, dark blue-green scholar robe,
intelligent composed leader.
Slot 5, row2 column2: woman approximately 35, strong square jaw, weathered warm
tan skin, bold eyebrows, black hair tied up under a restrained Han military
headcloth, charcoal lamellar shoulder armour over rust cross-collared tunic,
resolute martial leader.
Slot 6, row2 column3: woman approximately 40, broad poised face, calm slightly
narrow eyes, mature dignified bearing, high neat Han bun with modest dark bronze
ornament, maroon and ochre formal court robes with restrained gold trim, noble
ruler.
Slot 7, row2 column4: woman approximately 23, angular face and high cheekbones,
clear dark eyes, natural skin, black hair in a simple tied-back bun with tiny
jade hairpin, soft brown leather armour over muted jade robe, confident balanced
young leader.

ROW 3, four unique loyal companion/follower portraits, different people from
row1 and row2:
Slot 8, row3 column1: man approximately 27, rounded wide face, small eyebrow
scar, faint dark moustache, brown cloth military headwrap, plain aged brown
lamellar armour, loyal practical soldier.
Slot 9, row3 column2: man approximately 50, long narrow face, kindly penetrating
eyes, grey narrow beard and moustache, low black scholar cap, simple charcoal
and beige crossed robe, experienced civil adviser.
Slot 10, row3 column3: woman approximately 30, round face, steady expressive
eyes, simple black tied Han hair with no jewellery, plain bronze lamellar
cuirass over dark blue garment, dependable military follower.
Slot 11, row3 column4: woman approximately 48, narrow face, natural fine age
lines, sharp thoughtful dark eyes, black hair with a little grey pinned in a
modest bun, plain brown-grey civil robe, experienced administrator.

ROW 4, two named historical officers followed by two unused reserved portraits:
Slot 12, row4 column1: Taishi Ci (太史慈), artistic reconstruction of a strong
youthful-to-middleaged martial bowman. Approximately 32, broad athletic
shoulders, energetic dark eyes, strong angular East Asian face, distinct compact
dark moustache and short beard, bronze Han helmet with a restrained red tuft
contained within cell, dark bronze lamellar armour and muted red neck cloth. A
bow tip and arrow-quiver hint low beside outer shoulder, completely contained
and never obscuring face. Clearly a powerful warrior, NOT a civil scholar.
Slot 13, row4 column2: Cao Pi (曹丕), artistic reconstruction of a young adult
court prince and ruler. Approximately 28, youthful clean cheeks, refined narrow
East Asian face, alert dark eyes, small tidy dark moustache and slight chin
beard, modest black Han civil royal crown fully contained, deep black-blue and
maroon royal cross-collared robes with subtle gold trim. Youthful and formal,
NOT an elderly white-bearded helmeted warrior. NO imperial dragon robe.
Slot 14, row4 column3: reserved distinct man approximately 38, long rectangular
face, deep-set dark eyes, thick dark moustache with short boxed beard, plain
olive headwrap, dark jade robe with light leather shoulder guards, calm seasoned
officer.
Slot 15, row4 column4: reserved distinct woman approximately 33, heart-shaped
face, full dark eyebrows, warm dark eyes, black hair in low Han bun with a plain
wood pin, ochre and charcoal cross-collared robe, quietly assured officer.

Constraints: Exactly four rows and four columns, sixteen equal square cells,
exactly sixteen people. All headwear, faces, shoulders and accessories fit
inside their own cell. Constant deep dark jade/brown backgrounds. No cross-cell
overlap. Distinct face anatomy for all sixteen. Genuine male/female diversity
while coherent rendering style. Strong head+shoulders silhouette visible on
mobile.
Avoid: letters, numbers, Chinese characters, labels, signatures, watermarks,
captions, visible cell dividers, drawn borders, outer frame, decorative panels,
scenic background, extra heads or extra people, modern Western armour, medieval
European clothing, fantasy spikes, Qing dragon robes, erotic or glamour poses,
heavy modern makeup, anime, chibi, 3D render.
```

Recorded sources:

- `docs/artwork/v49-generation-prompts.json:initialPrompt`

Generation metadata:
[custom_portraits_v49_index.json](custom_portraits_v49_index.json).

## Framing edit

Supply the existing source image described in the prompt. This edit
brief is not a standalone replacement for that image.

```text
Edit the provided image, preserving exactly the same 4-by-4 equal-cell portrait
atlas, all sixteen distinct facial identities, male/female assignments,
costumes, painterly realistic style, flat dark jade/brown backgrounds and
row-major positions. Change only the within-cell framing: zoom every bust out
slightly and leave ample dark safe margin ABOVE the complete headgear or hair in
every cell, especially the first row. Reconstruct the small missing top of the
black court crown in row1 column3 and contain the red helmet crest of row1
column2. Every full head, helmet, crown, topknot and plume must fit clearly
within its own square with at least a narrow visible dark margin on all sides.
Shoulder tops and upper chest still visible, faces still a consistent size and
height across all sixteen cells. Keep the exact same identities, expressions and
arrangement, no other creative changes. Exactly sixteen cells in four rows and
four columns. No visible grid lines, no gutters, no borders, no text, labels or
watermark. Preserve Taishi Ci bowman in row4 column1 and youthful Cao Pi in row4
column2.
```

Recorded sources:

- `docs/artwork/v49-generation-prompts.json:framingEditPrompt`

Generation metadata:
[custom_portraits_v49_index.json](custom_portraits_v49_index.json).
