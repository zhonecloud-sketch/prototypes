# province 02 v17 webp

Canonical saved prompts. Line wrapping preserves the recorded wording.
Historical variants remain labelled; a new generation is not guaranteed
to reproduce the original pixels or to grant commercial rights.

Recorded asset: `assets/artwork/battlefields/province-02-v17.webp`.

Recorded output: 1205 × 1305 pixels. Requested resolution,
when different, remains inside the original production prompt.

The original production prompt requires a semantic reference guide.
Exact terrain and registration are in [the painting manifest][maps].
The original guide PNGs, model version and seed are not archived here.
Text-only generation cannot guarantee exact cell alignment.

[maps]: ../../config/battlefield-paintings.json

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
province 2; follow only this province guide.
```

Recorded sources:

- `config/battlefield-paintings.json:maps[1].prompt`
