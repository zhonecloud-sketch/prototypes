# V29 artwork

Generated with the built-in image-generation tool, then proportionally packaged with Canvas. Existing assets remain as provenance. Runtime replacements:

- `assets/liu-bei-v29.webp`: portrait master, generated at 1086 × 1448.
- `assets/officers-historic-v29.webp`: replaces only Liu Bei's third cell in the v16 atlas.
- `assets/history-v29.webp`: revised historical scenes, source 1254 × 1254, packaged 3966 × 1586.
- `assets/disasters-v29.webp`, `assets/omens-v29.webp`, `assets/stories-v29.webp`: existing artwork repackaged at 1983 × 793.

Portrait prompt specification: Create a mature Liu Bei, approximately 45–50 years old like the established Cao Cao portrait, dignified East Asian face, distinctive long pendulous earlobes, moustache and tapered beard with subtle grey, green and gold court robes and crown, dark jade background. Preserve the established painterly game portrait style. References: `officers-historic-v16.webp`, `history-v28.webp` and the user's attached image.

Historical edit specification: Preserve the four-by-four historical atlas and the other characters/scenes. Align Liu Bei in cells 3, 6, 11 and 13 (zero-based: Xu Province, three visits, Shu coronation, deathbed) with the new portrait's mature identity, long earlobes, moustache and beard. Maintain appropriate ageing and costumes for each scene. References: the existing atlas and new portrait.

The master portrait and edited atlas were visually reviewed together. Appearance is an illustrative interpretation; no authentic historical portrait is asserted. `tools/normalize-event-art.mjs` reproducibly contains each source cell on a dark matte at the aspect ratio and exact dimensions derived from `events.webp`; it neither stretches nor crops the art.
