# terrain v9 webp

Canonical saved prompts. Line wrapping preserves the recorded wording.
Historical variants remain labelled; a new generation is not guaranteed
to reproduce the original pixels or to grant commercial rights.

## Original production prompt

```text
Use case: historical-scene.
Asset type: final opaque terrain texture atlas for a premium late Han mobile
strategy game, exactly 2048 x 1024 pixels, exactly four equal columns and two
equal rows, eight square 512 x 512 cells.
Primary request: detailed naturalistic painted 2D terrain textures viewed
straight down in orthographic overhead projection, with each square cell a
self-contained distinct terrain type, fully occupying its cell. The strict
row-major order is: top row cell 1 grassy plains, cell 2 dense forest, cell 3
foothills, cell 4 rocky mountains; bottom row cell 1 river water and natural
banks, cell 2 earthen timber fort, cell 3 late Han walled city, cell 4 rice
paddies.
Grid layout: the canvas is partitioned mathematically into four columns of
identical width and two rows of identical height. Each terrain stays completely
inside its own equal square cell. No visible grid lines, no gutters, no
separators and no borders. Cell boundaries are only changes between terrain
textures. All eight cells have precisely the same size.
Style/medium: richly detailed naturalistic hand-painted historical 2D game
artwork, premium finish, coherent with detailed late Han portrait art and dark
jade and aged gold UI. Terrain must remain distinguishable when cropped into
small hexes, with clear characteristic shapes and distinct colors.
Composition/framing: strictly top-down overhead orthographic in every cell,
absolutely no isometric or oblique camera. Plains use warm fresh grass; forest
uses dense dark jade green foliage; foothills use rolling olive and earth forms;
mountains use rugged gray stone; river uses blue jade water with banks; fort
uses brown earthen walls and timber; city uses dense pale walls and charcoal
tiled roofs; paddies use wet green agricultural grids and narrow bunds.
Lighting/mood: consistent soft daylight, local relief shading rather than
dramatic cast shadows.
Constraints: no actual hex outlines; no modern structures; eight clearly
separate textures; no content crosses cell boundaries.
Avoid: UI, labels, letters, text, captions, coordinates, numbers, decorative
borders, watermark, roads linking panels, isometric miniatures, cartoon icons,
3D plastic look.
```

Recorded sources:

- `docs/artwork/graphics-v9-prompts.json:[1].prompt`
- `docs/artwork/graphics-v9-manifest.json:assets[1].prompt`

Generation metadata: [graphics_v9_index.json](graphics_v9_index.json).
