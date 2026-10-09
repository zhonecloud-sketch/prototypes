# V30 artwork

Built-in image generation edited the existing v29 atlases. All event scenes extend to the cell edges; no dark matte, stretching or scene cropping. Historical artwork is packed at 3966 × 1586 (4 × 4); disasters, omens and stories at 1983 × 793 (2 × 2). Each cell matches events.webp at 991.5 × 396.5. The generated wide scenes were inspected before and after packaging.

Liu Bei's edited third portrait cell uses a close bust like Cao Cao, retaining maturity and long earlobes. Only that cell is integrated into the previous atlas, preserving the other portrait compositions. Runtime paths:

- assets/officers-historic-v30.webp
- assets/history-v30.webp
- assets/disasters-v30.webp
- assets/omens-v30.webp
- assets/stories-v30.webp

## Final prompt set

### history30

Use case: precise-object-edit. Edit target: historical illustration atlas, four columns and four rows, fifteen historical scenes plus final council scene. Extend each scene sideways to fill its entire rectangular cell edge to edge. The current dark blank margins are a packaging defect: replace ALL plain dark blank side strips with natural painted continuations of THAT cell's scene (architecture, landscape, sky, people where appropriate). Preserve every central character, face, story and row-major scene order. Maintain Liu Bei's mature identity and long earlobes. Each cell must have a wide landscape aspect ratio 2.5:1, overall atlas also 2.5:1. Sixteen separate wide scenes, straight aligned 4x4 grid; no gutters, no borders, no matte, no plain blank canvas. Painterly ancient Chinese historical game art. Do not crop away central story. Fill the entire canvas with scene artwork.

### disasters30

Use case: precise-object-edit. Edit target: 2 by 2 disaster illustration atlas. Extend each existing scene sideways to fill the entire cell, eliminating all dark blank margins. Top left locust famine, top right uprising, bottom left coastal typhoon, bottom right flood. Preserve the central subjects and their faces; outpaint appropriate fields, village, stormy coast and submerged town around them. Four wide landscape cells, each 2.5:1; overall canvas 2.5:1. Precise aligned 2x2 grid, no gutters, no borders, no matte or blank strips. Painterly ancient Chinese strategy game illustration. Artwork must fill every cell edge to edge.

### omens30

Use case: precise-object-edit. Edit target: 2x2 event atlas. Fill every dark blank side margin with natural painted continuation of that scene. Preserve central people, faces and story. Row-major scenes: epidemic care, comet omen, troop deployment, territory occupation. Each of four cells is wide 2.5:1 landscape; overall canvas 2.5:1. Exact 2x2 grid without gutters, borders, matte or blank strips. Painterly ancient Chinese game style. Edge-to-edge artwork; preserve composition and extend rather than stretch.

### stories30

Use case: precise-object-edit. Edit target: 2x2 event atlas. Fill every dark blank side margin with natural painted continuation of that scene. Preserve central people, faces and story. Row-major scenes: Xun Yu planning, officer mourning, Diaochan chain stratagem, Hua Tuo medical treatment. Each of four cells is wide 2.5:1 landscape; overall canvas 2.5:1. Exact 2x2 grid without gutters, borders, matte or blank strips. Painterly ancient Chinese game style. Edge-to-edge artwork; preserve composition and extend rather than stretch.

### portrait30

Use case: identity-preserve. Edit target: 4x4 general portrait atlas. Change ONLY Liu Bei, third cell of first row. Enlarge/reframe him to match the scale of the other portraits, especially Cao Cao immediately to his right: large head and shoulders, close bust, face occupies comparable portion of square cell, robe extends to the lower corners, no blank side strips. Preserve his mature dignified face, long earlobes, moustache and tapered grey beard, green/gold robe, jade background and crown. Keep all other fifteen cells pixel-composition and character identity unchanged. Keep square overall atlas, precisely aligned 4x4 grid, no borders or gutters. Do not make Liu Bei younger. No text.

