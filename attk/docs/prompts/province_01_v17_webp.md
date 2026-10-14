# province 01 v17 webp

Canonical saved prompts. Line wrapping preserves the recorded wording.
Historical variants remain labelled; a new generation is not guaranteed
to reproduce the original pixels or to grant commercial rights.

Recorded asset: `assets/artwork/battlefields/province-01-v17.webp`.

Recorded output: 1205 × 1305 pixels. Requested resolution,
when different, remains inside the original production prompt.

The original production prompt requires a semantic reference guide.
Exact terrain and registration are in [the painting manifest][maps].
The original guide PNGs, model version and seed are not archived here.
Text-only generation cannot guarantee exact cell alignment.

[maps]: ../../config/battlefield-paintings.json

## Complete copy-and-paste prompt

This expanded brief includes the recorded terrain and geometry. It is
the copy-and-paste version supplied in the conversation, not the
verbatim historical generation request.

```text
Use case: sketch-to-render.
Asset type: one complete battlefield background for a late Han China historical
strategy game.

Create ONE SINGLE full hand-painted battlefield landscape for province 1,
Xiangping. Use an exact overhead orthographic view, with no perspective tilt or
horizon. Use the portrait aspect ratio 1024:1109. The existing asset measures
1205 × 1305 pixels; match those output dimensions if supported without
stretching the composition.

LAYOUT AUTHORITY

Use the following terrain matrix as the semantic layout guide. It contains
exactly 12 rows and 13 columns. Read rows from top to bottom and columns from
left to right.

Terrain codes:
0 = open plains and fields
1 = dense jungle woodland
2 = low rolling hills
3 = rocky mountains
4 = river water
5 = small fortified town
6 = palace town

Terrain matrix:
0 0 0 0 1 1 1 3 3 2 2 2 3
0 1 0 0 0 0 2 2 2 2 3 3 2
0 0 0 1 0 2 3 3 3 6 3 3 2
0 0 0 0 0 3 3 0 2 2 2 3 2
1 0 1 0 2 3 2 5 2 3 2 3 1
0 1 0 0 2 3 2 0 3 1 1 1 1
3 0 0 1 2 2 2 0 1 0 1 1 1
3 1 0 0 2 1 1 0 0 0 1 1 1
3 0 0 0 1 0 0 0 0 1 1 4 4
0 0 0 0 0 0 0 0 0 4 4 4 4
0 0 0 0 0 4 4 4 4 4 4 4 4
0 0 0 4 4 4 4 4 4 4 4 4 4

SPATIAL REGISTRATION

The underlying layout uses flat-topped hexagons arranged in offset columns. This
geometry controls terrain placement but must not be visible in the finished
painting.

Use zero-based column q = 0 through 12 and row r = 0 through 11.

World-space cell centers:
x = (q − 6) × 1.5
z = (r − 5.5 + 0.5 × (q mod 2)) × √3

Each underlying hexagon has world-space radius 1.

World-space canvas bounds:
left = −10
top = −6√3
width = 20
height = 12.5√3

Normalized image coordinates, with the origin at the top-left:
u = (x + 10) / 20
v = (z + 6√3) / (12.5√3)

Place the palace town precisely at column 9, row 2:
u = 0.725, v = 0.24.

Place the small fortified town precisely at column 7, row 4:
u = 0.575, v = 0.40.

Preserve EVERY terrain cell center’s category and both town anchors’ exact
positions. Do not rearrange the terrain for a more attractive composition. Do
not mirror, rotate, crop or reinterpret the map.

VISUAL TREATMENT

Create a beautiful painterly strategy-game map with clean, readable natural
colors and no fog.

Use pale green for open plains and fields, dark green for dense jungle woodland,
ochre for low rolling hills, gray for rocky mountains, blue for river water,
restrained orange accents for the small fortified town and coral accents for the
palace town.

Replace blocky semantic boundaries with smooth, natural, continuous terrain
transitions while preserving the category at every cell center. Include crisp
fields, restrained forest and rock detail, clean rivers and historically
grounded late Han Chinese town architecture.

Create one continuous full landscape. Terrain must extend naturally across
neighboring cells rather than appearing as repeated tiles. The area outside the
hex footprint may remain dark green.

HARD CONSTRAINTS

Render terrain only where specified.
Do not invent additional water, towns, palaces or mountains.
Do not add roads, bridges or other major features that change the specified
geography.
No visible hexagons, grid lines, cell outlines or tile appearance.
No troops, generals, people, banners, UI, labels, text, numbers, borders, logos
or watermark.
No montage, atlas, separate panels, perspective camera, horizon or decorative
frame.

This is province 1 only. Follow only the terrain matrix and registration above.
```

Recorded sources:

- `Conversation:complete province-01 prompt`

## Original production prompt

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China
battlefield landscape from the attached semantic layout guide. Exact overhead
orthographic view, same 1024:1109 portrait aspect ratio and exact geographic
positioning. Guide colors: pale green = open plains/fields; dark green = dense
jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river
water; orange = small fortified town; coral = palace town; darkest = outside
footprint. Preserve EVERY terrain cell center's category and every city anchor's
exact position. Replace blocky color boundaries with smooth natural continuous
boundaries, crisp fields, restrained forest and rock detail, clean rivers.
Beautiful painterly strategy game map, clean readable natural colors, no fog.
Continuous full landscape, no visible hex geometry or outlines, no tile
appearance, no text, UI, units, labels, watermark. No invented additional water,
cities, or mountains. Render terrain only wherever specified. Outside-footprint
edge may remain dark green. Maintain attached map's unique geography. This is
province 1; follow only this province guide.
```

Recorded sources:

- `config/battlefield-paintings.json:maps[0].prompt`
