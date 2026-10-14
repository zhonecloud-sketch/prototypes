# terrain v15 webp

Canonical saved prompts. Line wrapping preserves the recorded wording.
Historical variants remain labelled; a new generation is not guaranteed
to reproduce the original pixels or to grant commercial rights.

Recorded asset: `terrain-v15.webp`.

Recorded output: 2048 × 1024 pixels. Requested resolution,
when different, remains inside the original production prompt.

## Original production prompt

```text
Use case: stylized-concept
Asset type: production battlefield terrain texture atlas for a Han-era top-down
strategy game.
Primary request: Create exactly a 2:1 landscape image, 2048 x 1024 pixels. The
entire canvas is an exact regular grid of four columns and two rows, containing
eight equal square fields of 512 x 512 pixels each. Every field reaches all four
edges of its square. No spacing, borders, frames or outlines between fields.
Grid order, left to right:
Top row, column 1: clean bright jade and olive grassland; broad smooth organic
color patches.
Top row, column 2: stylized emerald forest tree canopies seen straight from
above; rounded attractive clean overlapping canopy masses, clearly a forest.
Top row, column 3: smooth pale green rolling hills; broad gently shaded landform
bands with a readable hills material.
Top row, column 4: clean blue-grey sculpted rocky mountain ridges seen straight
from above; strong large angular ridge forms, restrained smooth shading.
Bottom row, column 1: calm clear azure water with broad gentle ripples, clean
open water filling every edge.
Bottom row, column 2: clean grass field with one small traditional Han Chinese
fort placed precisely at the square's centre; fort occupies about one quarter of
the field width, leaving broad seamless grass around it.
Bottom row, column 3: clean grass field with one small traditional Chinese
walled city or capital placed precisely at the square's centre; compact walls
and palace rooftops occupying about one third of the field width, leaving broad
seamless grass around it.
Bottom row, column 4: clean golden dry grass; broad smooth organic patches.
Style/medium: top-down orthographic strategy-game illustrations, soft clean
shapes, deliberate restrained detail, attractive vibrant readable material
differences. Each tile must read at small game scale.
Materials/textures: broad smooth painterly material fields with low frequency
detail only. Terrain reaches edges naturally and is suitable for bitmask
autoblending. Grass backgrounds of the fort and capital exactly match the
jade/olive grassland tile palette and surface treatment.
Lighting/mood: uniform flat soft daylight across all eight tiles; gentle broad
shading; no dark vignette.
Constraints: The eight fields MUST be equal squares in an exact 4-by-2
arrangement on a 2:1 canvas. No gutters, margin or border. No hex outlines. No
labels, text, numbers, UI, troops or isolated showcase objects. No floating
islands. No blank backgrounds. Fort and city remain small and centred.
Avoid: speckles, grain, gritty/dirty/grunge surface, noise, high-frequency
microtexture, dark corners, decorative frames, strong cast shadows.
```

Recorded sources:

- `docs/artwork/v15-prompts.json:assets[0].prompt`

Generation metadata: [legacy_v15_index.json](legacy_v15_index.json).

## Historical summary brief

```text
clean top-down Han-era strategy terrain, broad jade/olive grass, rounded emerald
forest canopies, smooth pale green hills, blue-grey mountain ridges; clear azure
water, compact fort, walled capital and golden grass in exact row-major 4 × 2
squares. Restrained readable detail, flat soft daylight, edge-to-edge seamless
material fields; no gritty/grunge/noisy texture, hex outlines, UI, troops or
labels.
```

Recorded sources:

- `docs/ARTWORK.md:V15 terrain summary`
