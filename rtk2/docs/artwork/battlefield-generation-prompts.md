# All 41 battlefield generation prompts

The prompts below are the recorded v17 prompts, copied verbatim from config/battlefield-paintings.json. Attach the corresponding guide when generating each map. Guides are rebuilt from the original terrain arrays; painting geography must not change game rules.

Guide legend: pale green plains; dark green jungle; ochre hills; grey mountains; blue water; orange fort; coral palace; darkest outside footprint. Coordinates are zero-based (column q, row r), 13 columns × 12 rows, odd columns offset down by half a hex. Full guide canvas 1024 × 1109. Do not rotate, crop, shift anchors, invent terrain or stretch the result.

## #1 · Xiangping

Guide: [province-01.png](map-guides/province-01.png). Palace anchors: [(9, 2)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 1; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 00 01 01 01 03 03 02 02 02 03
00 01 00 00 00 00 02 02 02 02 03 03 02
00 00 00 01 00 02 03 03 03 06 03 03 02
00 00 00 00 00 03 03 00 02 02 02 03 02
01 00 01 00 02 03 02 05 02 03 02 03 01
00 01 00 00 02 03 02 00 03 01 01 01 01
03 00 00 01 02 02 02 00 01 00 01 01 01
03 01 00 00 02 01 01 00 00 00 01 01 01
03 00 00 00 01 00 00 00 00 01 01 04 04
00 00 00 00 00 00 00 00 00 04 04 04 04
00 00 00 00 00 04 04 04 04 04 04 04 04
00 00 00 04 04 04 04 04 04 04 04 04 04
```

## #2 · Yuyang

Guide: [province-02.png](map-guides/province-02.png). Palace anchors: [(3, 2)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 2; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 02 02 02 02 03 03 03 03 03 02 00 00
02 03 03 02 02 02 03 02 02 02 02 00 00
02 03 02 06 00 00 05 02 03 03 00 00 00
01 02 03 00 00 02 03 03 02 02 00 00 00
03 02 03 03 00 02 03 02 00 03 00 00 00
01 03 03 02 02 03 02 01 01 00 03 00 00
02 03 03 05 03 00 00 00 01 00 00 01 00
02 03 02 00 00 00 01 01 00 01 00 00 00
02 02 00 00 00 00 00 00 00 01 00 04 04
02 00 00 00 00 00 00 00 01 00 00 04 04
00 00 00 03 00 00 00 00 00 00 04 04 04
00 00 00 03 00 00 00 00 00 04 04 04 04
```

## #3 · Zhuo

Guide: [province-03.png](map-guides/province-03.png). Palace anchors: [(5, 4)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 3; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 03 02 03 03 00 00 02 02 02 02
03 03 03 02 03 02 03 05 00 02 02 02 02
03 03 02 03 03 00 00 03 03 02 03 03 02
02 03 02 03 00 00 00 02 03 03 02 03 02
02 02 03 00 00 06 00 02 03 00 02 00 00
03 03 03 02 00 00 00 00 03 00 00 01 00
03 02 03 05 03 00 02 03 05 00 00 01 01
03 02 00 00 03 05 03 03 00 00 00 00 01
02 00 00 02 03 00 02 02 00 00 00 00 00
02 00 00 02 02 00 00 00 00 00 00 00 04
00 00 00 03 02 00 00 00 03 00 00 04 04
00 00 03 00 00 00 00 00 03 00 00 04 04
```

## #4 · Jinyang

Guide: [province-04.png](map-guides/province-04.png). Palace anchors: [(5, 3)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 4; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 03 03 02 02 01 01 00 02 02 02
02 03 03 03 02 01 00 00 01 00 00 02 02
03 03 03 02 02 00 00 01 00 01 00 00 02
03 02 02 02 00 06 00 00 00 01 00 00 00
02 03 02 01 00 00 00 01 00 00 00 00 03
03 02 00 00 00 00 00 00 00 00 00 00 03
02 04 03 03 01 00 01 00 00 01 00 00 00
02 04 03 03 00 01 00 00 01 01 00 00 00
02 02 04 03 00 00 01 00 00 00 00 00 00
03 02 04 02 00 00 00 00 00 00 00 00 00
03 03 04 04 02 02 00 02 00 03 00 00 00
03 03 03 04 02 02 02 02 02 03 02 02 00
```

## #5 · Shangdang

Guide: [province-05.png](map-guides/province-05.png). Palace anchors: [(4, 4)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 5; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 04 00 02 02 02 02 02 03 02 02
03 03 03 04 03 03 02 02 02 00 00 04 04
03 03 00 00 04 01 03 04 02 04 04 02 02
03 02 02 00 04 04 02 02 04 02 02 00 02
03 03 02 00 06 04 00 03 02 03 02 00 00
03 03 02 00 00 04 05 00 03 02 00 03 03
03 03 00 04 04 00 00 03 00 00 00 02 03
03 01 01 04 01 02 02 02 03 00 00 00 02
02 01 04 01 01 00 03 02 03 02 00 00 00
01 04 04 01 00 00 00 02 02 02 00 02 03
04 01 01 00 00 02 00 00 00 03 00 02 02
01 03 03 03 02 02 02 02 00 03 00 00 02
```

## #6 · Ye

Guide: [province-06.png](map-guides/province-06.png). Palace anchors: [(5, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 6; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 03 04 04 04 04 04 04 04 04
00 00 00 00 04 00 00 00 00 00 04 04 04
00 00 00 04 04 05 00 00 00 01 04 04 04
03 00 00 04 03 00 03 01 01 04 04 00 04
03 03 05 04 00 00 00 04 04 00 00 00 00
00 04 00 04 00 04 04 00 01 01 00 00 00
04 00 04 04 04 06 00 00 01 00 00 01 00
00 04 04 01 00 00 00 00 00 00 01 01 01
04 00 01 01 01 00 01 00 05 00 00 00 00
00 00 00 00 00 04 04 04 00 04 00 04 04
04 04 04 04 04 04 04 04 04 04 04 04 04
04 04 04 04 04 00 00 00 04 03 04 00 00
```

## #7 · Anping

Guide: [province-07.png](map-guides/province-07.png). Palace anchors: [(5, 4)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 7; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 00 00 00 00 00 04 00 04 04
00 00 00 03 00 04 00 04 04 00 04 00 00
00 00 03 04 04 01 04 00 00 01 00 04 04
00 00 03 04 01 00 00 01 00 04 04 00 00
00 05 04 00 00 06 00 01 01 04 00 04 04
03 04 04 01 00 01 01 00 04 01 00 04 04
02 04 02 01 00 00 00 04 04 03 05 04 04
02 04 02 00 01 04 04 03 03 01 00 04 04
04 02 02 02 03 04 05 03 01 01 04 04 04
02 00 00 02 04 00 00 00 00 00 04 04 00
02 00 00 03 03 00 00 00 00 03 04 04 00
00 00 00 03 00 00 00 00 03 03 04 04 00
```

## #8 · Linzi

Guide: [province-08.png](map-guides/province-08.png). Palace anchors: [(6, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 8; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 00 00 04 00 04 04 04 04 04 04
00 04 04 04 04 04 04 04 04 04 04 04 04
04 04 04 04 04 00 04 01 01 01 04 04 04
04 01 01 00 00 00 00 04 01 04 04 01 04
01 00 00 01 01 04 04 00 04 01 01 02 00
02 02 00 04 04 00 06 00 00 02 02 03 02
04 04 04 01 00 01 00 01 00 03 02 02 02
02 03 01 03 00 00 00 00 03 01 02 01 01
02 02 03 00 05 03 00 03 05 00 00 01 04
03 00 00 00 00 03 03 00 00 00 00 04 04
00 00 00 02 02 02 02 00 00 00 00 04 04
00 00 02 03 03 03 03 00 00 00 04 04 04
```

## #9 · Chenliu

Guide: [province-09.png](map-guides/province-09.png). Palace anchors: [(5, 4)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 9; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 00 00 00 00 00 03 02 04 04
00 00 00 00 03 00 00 00 00 03 02 04 02
00 00 00 00 01 00 00 03 00 04 04 00 02
00 00 00 01 01 00 03 04 04 00 00 00 00
03 03 01 00 00 06 00 04 05 01 00 01 00
03 00 00 01 00 00 00 04 03 03 01 01 00
00 03 03 01 01 04 04 01 01 03 01 01 00
00 01 03 03 04 04 01 03 01 03 01 01 00
00 00 03 04 04 04 03 01 05 00 01 00 00
00 04 04 00 04 00 03 00 00 00 00 00 00
00 04 00 03 03 00 00 00 00 03 03 00 00
04 00 00 03 00 00 00 00 00 03 00 00 00
```

## #10 · Luoyang

Guide: [province-10.png](map-guides/province-10.png). Palace anchors: [(5, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 10; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 00 03 02 02 00 00 00 03 04 04 00
02 00 00 02 00 00 00 00 00 03 04 04 00
00 02 00 03 02 03 00 03 03 04 04 04 00
02 02 00 03 03 04 05 04 04 04 04 01 00
02 03 05 04 04 04 04 04 04 01 01 01 01
03 04 04 04 04 00 04 01 05 02 02 04 04
04 04 04 01 00 06 00 01 03 02 04 03 03
04 01 01 03 00 00 00 03 05 02 04 03 00
01 03 03 00 05 03 01 03 02 03 04 00 00
02 02 02 00 00 03 03 00 05 00 00 00 00
02 00 00 03 02 02 02 00 00 00 00 00 00
02 00 03 03 02 00 00 00 02 02 03 02 02
```

## #11 · Hedong

Guide: [province-11.png](map-guides/province-11.png). Palace anchors: [(4, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 11; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 02 02 02 02 02 03 02 00 04 04
03 02 03 03 02 02 02 00 02 04 04 04 04
03 02 02 03 00 00 00 04 04 04 04 02 02
03 02 01 00 03 05 04 04 04 03 03 02 02
03 02 01 00 00 04 04 04 03 00 00 01 01
03 02 01 00 06 04 04 03 03 00 01 01 01
03 03 05 04 04 04 03 00 00 01 01 01 01
04 04 04 04 04 05 00 00 00 01 01 01 01
04 04 04 03 00 00 00 00 01 01 01 00 00
00 00 03 00 00 00 00 00 01 00 00 00 00
02 02 00 03 03 00 00 00 00 03 00 00 00
02 02 02 03 02 02 02 02 00 03 00 00 00
```

## #12 · Chang'an

Guide: [province-12.png](map-guides/province-12.png). Palace anchors: [(6, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 12; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 03 03 02 02 02 02 04 04 00 00
03 03 03 02 02 03 02 00 02 04 04 04 04
03 02 02 03 03 00 03 05 02 03 04 04 04
03 02 03 02 00 00 00 03 03 04 04 03 03
02 03 02 00 00 03 03 03 04 03 00 03 03
02 03 03 03 05 04 04 04 04 03 00 00 03
02 03 03 04 04 00 06 03 02 02 05 03 00
02 02 03 04 03 00 00 01 01 01 03 03 02
02 04 04 03 03 05 00 01 01 00 03 03 02
04 00 00 00 00 00 03 00 00 00 00 02 02
02 02 00 03 00 02 02 02 03 03 02 02 02
02 02 02 03 02 02 02 02 02 03 02 02 02
```

## #13 · Longxi

Guide: [province-13.png](map-guides/province-13.png). Palace anchors: [(5, 3)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 13; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 03 01 01 01 03 03 02 02 02
00 00 00 03 03 01 01 00 00 00 00 00 02
00 00 00 00 01 00 00 00 00 05 02 02 02
02 02 00 03 03 06 00 03 03 04 04 04 04
04 04 02 02 04 04 04 04 04 03 02 03 03
02 02 04 02 05 03 03 05 03 01 00 01 03
03 02 04 04 02 02 02 00 00 00 00 00 00
03 03 02 02 04 00 00 01 00 00 01 00 03
03 03 03 04 04 00 01 00 01 00 00 00 03
03 04 04 03 03 02 00 00 00 00 00 02 02
03 04 03 03 03 02 02 02 00 03 00 02 02
04 03 03 03 02 02 02 02 02 03 02 02 02
```

## #14 · Jincheng

Guide: [province-14.png](map-guides/province-14.png). Palace anchors: [(6, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 14; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 02 02 02 02 02 02 02 02 01 01
03 02 02 02 02 02 02 03 02 00 00 01 01
03 02 02 02 02 02 03 00 00 00 01 01 01
03 03 02 03 05 03 03 00 00 01 01 04 04
03 03 03 00 00 00 00 00 00 04 04 04 04
03 02 00 00 00 00 06 00 00 04 04 01 01
02 01 00 00 00 00 00 00 00 04 04 04 01
01 01 01 01 01 04 00 00 01 01 04 04 01
01 01 01 04 04 04 04 04 01 04 04 04 03
04 04 04 04 04 00 04 04 04 04 04 02 02
04 04 04 01 01 01 00 00 04 00 04 04 04
01 01 01 01 01 01 01 01 00 00 00 02 02
```

## #15 · Wuwei

Guide: [province-15.png](map-guides/province-15.png). Palace anchors: [(1, 2)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 15; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 03 01 00 00 00 03 03 03 03 03
03 00 03 00 00 03 01 00 01 01 03 03 03
00 06 00 03 01 02 03 00 01 01 01 00 00
00 00 00 01 03 01 01 03 00 00 00 03 00
03 02 00 00 02 03 01 03 03 03 01 03 00
02 02 03 03 05 00 00 02 03 00 03 01 00
03 02 02 02 03 00 00 00 00 03 00 01 01
03 02 02 03 02 00 02 03 01 03 00 00 01
03 02 03 03 02 00 02 03 03 03 01 00 00
03 02 03 03 02 02 00 00 00 00 00 00 00
03 02 03 02 02 03 02 02 00 00 00 00 00
03 03 02 03 03 03 02 02 02 02 00 00 00
```

## #16 · Xiapi

Guide: [province-16.png](map-guides/province-16.png). Palace anchors: [(3, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 16; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 03 03 00 00 00 00 04 04 04
00 00 00 00 03 00 00 00 00 00 04 04 04
00 00 00 00 00 00 00 00 00 00 00 04 04
02 03 03 03 00 00 00 01 00 00 04 01 04
01 01 01 00 05 03 03 00 00 04 04 01 00
01 00 00 06 00 00 00 00 01 04 01 00 00
00 00 00 00 00 01 01 01 01 04 01 00 01
01 03 05 00 01 01 01 01 04 00 00 00 01
01 03 00 00 03 03 01 01 04 00 00 00 00
03 00 00 00 00 00 00 01 04 00 00 00 00
00 00 00 03 00 00 00 04 04 03 00 00 00
00 00 00 03 00 00 00 04 00 03 00 00 00
```

## #17 · Xuchang

Guide: [province-17.png](map-guides/province-17.png). Palace anchors: [(2, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 17; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 03 00 00 00 00 00 03 00 00
00 00 02 04 03 00 00 00 00 03 03 00 00
00 03 02 02 04 04 00 00 00 00 00 00 00
03 00 05 03 03 03 04 04 00 00 00 00 00
03 00 00 00 01 01 03 01 04 01 00 00 00
02 00 06 03 03 00 03 02 04 04 01 01 00
00 05 00 00 00 03 05 01 00 00 04 04 01
00 03 00 03 03 02 01 01 01 01 01 00 04
03 04 05 04 04 04 04 04 00 04 00 00 00
04 00 04 00 00 00 00 00 04 00 04 04 00
00 00 00 03 03 00 00 00 00 03 00 00 04
00 00 00 03 00 00 00 00 00 03 00 00 00
```

## #18 · Runan

Guide: [province-18.png](map-guides/province-18.png). Palace anchors: [(5, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 18; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 03 04 00 00 00 04 00 03 00 00 00
04 04 04 03 04 04 00 04 00 03 00 00 00
00 00 02 00 00 04 04 00 02 01 00 00 00
00 00 00 04 04 01 05 01 01 00 00 00 00
04 04 04 05 01 00 00 00 00 01 01 01 00
03 03 01 00 00 06 00 00 00 00 01 01 00
01 01 00 01 00 01 00 01 01 01 00 00 00
01 01 00 01 01 00 05 00 01 01 01 00 00
00 00 00 01 01 00 01 01 00 00 00 00 00
00 00 00 00 01 00 01 00 00 02 00 00 00
00 00 00 03 00 00 00 00 00 03 00 00 00
00 00 00 03 02 00 00 00 00 00 03 00 00
```

## #19 · Wan

Guide: [province-19.png](map-guides/province-19.png). Palace anchors: [(5, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 19; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 02 02 02 02 00 00 03 02 02 02
00 00 00 03 04 04 00 00 00 03 02 02 02
00 00 00 00 03 04 00 03 00 02 00 00 02
00 00 00 03 03 04 05 01 03 04 02 04 04
01 00 00 03 04 00 00 01 03 01 04 00 00
01 03 05 03 04 06 00 00 01 01 02 03 01
03 04 00 04 04 00 00 00 01 03 00 01 01
04 02 04 04 01 01 00 00 03 00 00 01 01
03 00 05 04 03 03 03 03 05 00 00 00 01
00 00 00 04 03 03 00 02 00 00 00 00 00
00 00 00 03 04 00 00 00 00 03 00 00 00
00 00 00 03 04 00 00 00 03 03 00 00 00
```

## #20 · Xiangyang

Guide: [province-20.png](map-guides/province-20.png). Palace anchors: [(8, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 20; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 03 02 02 02 02 02 03 02 00 00
02 02 02 03 03 02 02 02 02 03 00 04 04
02 02 00 00 03 02 02 03 00 00 00 04 00
03 02 00 00 02 03 03 03 03 03 04 00 00
03 00 00 03 03 00 03 00 00 04 04 01 01
03 03 05 00 00 04 00 00 06 04 01 01 01
03 04 04 04 04 03 04 04 04 03 03 01 01
04 00 00 03 05 00 03 03 00 03 03 03 01
00 03 03 00 00 03 03 02 05 00 03 02 02
02 02 02 00 00 00 03 02 00 00 00 00 03
02 02 02 03 03 02 00 02 00 03 00 00 00
02 02 02 03 02 02 02 02 02 03 00 00 00
```

## #21 · Changsha

Guide: [province-21.png](map-guides/province-21.png). Palace anchors: [(11, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 21; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 04 04 00 00 00 03 00 00 00
00 00 00 02 03 03 04 00 00 03 00 00 00
00 00 00 01 02 03 04 04 00 04 04 04 04
00 00 00 00 03 04 04 04 04 04 04 04 04
00 02 00 05 01 04 04 01 04 01 03 05 03
02 03 03 04 04 04 04 01 01 01 00 00 00
03 01 01 04 04 00 01 04 04 04 00 06 00
01 04 04 04 04 01 04 01 04 03 04 00 00
00 04 04 00 05 04 04 01 00 05 04 03 00
04 04 00 00 03 04 03 00 03 00 04 04 03
04 00 00 03 00 00 04 00 03 03 00 00 04
00 00 00 03 00 04 04 00 03 00 00 00 00
```

## #22 · Jiangxia

Guide: [province-22.png](map-guides/province-22.png). Palace anchors: [(7, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 22; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 03 00 00 00 00 00 03 03 00 00 00
00 00 03 03 00 00 00 00 03 00 00 00 00
00 00 00 01 00 01 00 01 01 01 00 00 00
00 00 00 01 01 01 01 01 01 01 01 01 00
04 04 01 04 01 01 01 00 01 01 01 01 01
01 01 04 01 04 04 00 06 00 01 01 01 01
02 02 01 00 01 04 00 00 00 00 01 03 02
02 03 03 05 00 04 00 00 00 05 03 02 02
03 00 00 00 04 05 00 03 03 00 00 00 02
02 02 00 04 04 00 03 00 00 00 00 00 00
02 02 04 02 02 00 00 00 00 03 00 00 00
02 02 02 03 03 03 00 00 00 03 00 00 00
```

## #23 · Wuling

Guide: [province-23.png](map-guides/province-23.png). Palace anchors: [(8, 7)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 23; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 00 04 00 00 03 03 02 02 02
04 04 00 03 00 04 00 00 03 00 02 02 02
00 00 04 00 04 00 00 00 00 00 00 02 02
00 01 04 00 04 04 00 00 00 00 00 01 03
01 04 04 00 00 04 01 00 00 00 01 01 03
04 01 00 02 02 04 01 03 05 03 00 01 01
01 01 00 02 04 01 01 00 00 00 01 01 01
01 00 00 01 04 01 01 00 06 00 00 02 00
01 00 00 00 01 01 03 03 00 03 03 02 02
00 00 00 00 00 00 00 00 03 00 00 02 02
00 00 00 03 00 03 00 00 00 03 00 02 02
00 00 00 03 03 00 00 00 00 03 02 02 02
```

## #24 · Wu

Guide: [province-24.png](map-guides/province-24.png). Palace anchors: [(10, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 24; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 00 00 00 00 00 00 01 01 04 04
00 00 00 03 01 01 01 01 00 04 04 04 04
00 00 00 01 03 01 01 04 04 04 04 04 04
03 03 00 00 01 00 04 04 04 05 01 01 04
03 00 00 00 00 04 04 04 01 00 00 00 04
00 01 01 00 01 04 04 00 00 00 06 00 04
00 01 00 01 01 04 04 01 05 00 00 01 04
00 01 00 00 01 04 04 01 01 00 05 01 04
00 03 01 00 01 04 04 00 00 01 01 04 04
00 00 00 01 01 04 04 00 01 04 04 04 04
00 00 00 03 04 04 04 00 00 04 01 01 04
00 00 00 03 04 04 00 00 00 04 01 01 04
```

## #25 · Moling

Guide: [province-25.png](map-guides/province-25.png). Palace anchors: [(10, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 25; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 04 04 00 00 00 04 00 00 04
00 00 00 03 04 04 00 00 00 04 00 00 04
00 00 00 04 04 04 00 00 00 04 00 04 04
00 00 00 04 04 03 00 05 03 04 01 00 04
00 00 04 04 04 03 03 04 04 00 01 04 04
00 00 04 04 03 00 03 02 02 00 00 04 04
00 03 04 04 01 01 00 00 00 00 06 00 04
03 04 04 04 01 01 00 01 00 00 00 00 04
04 04 04 00 01 00 00 00 00 01 01 04 04
04 00 00 00 00 00 00 00 00 01 01 04 04
00 00 00 03 00 00 00 00 00 00 00 04 04
00 00 00 03 03 00 00 00 00 00 03 03 04
```

## #26 · Kuaiji

Guide: [province-26.png](map-guides/province-26.png). Palace anchors: [(5, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 26; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 03 00 00 00 00 00 00 00 04
00 00 00 00 03 00 00 00 00 00 00 00 04
00 00 00 00 00 00 00 01 00 01 00 00 04
00 00 00 01 01 00 01 01 01 01 00 00 04
01 01 00 00 01 00 00 00 01 00 00 04 04
03 03 00 00 00 06 01 00 00 01 01 04 04
03 01 01 01 00 01 01 00 00 00 00 04 04
01 00 01 00 00 00 00 01 01 00 00 04 04
00 00 00 00 00 01 00 00 01 00 04 04 04
00 00 00 00 01 01 00 01 00 04 04 04 04
00 00 00 00 01 01 00 00 00 04 04 04 04
04 04 04 04 04 04 04 04 04 04 04 04 04
```

## #27 · Yuzhang

Guide: [province-27.png](map-guides/province-27.png). Palace anchors: [(2, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 27; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 00 03 00 00 00 00 03 00 00 00
04 04 00 00 03 03 00 00 00 03 00 00 00
04 04 04 04 00 03 00 00 00 03 00 04 04
03 03 04 04 04 04 05 04 03 04 04 04 04
03 00 01 01 04 04 04 04 04 04 04 00 00
01 00 00 00 01 00 04 00 04 00 00 01 01
01 00 06 00 00 00 00 00 00 03 01 03 02
03 05 00 03 00 03 03 03 05 00 03 03 02
00 00 03 03 05 00 01 01 00 00 00 00 02
00 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 03 03 00 00 00 00 03 00 00 00
00 00 00 03 00 00 00 00 00 03 00 00 00
```

## #28 · Shouchun

Guide: [province-28.png](map-guides/province-28.png). Palace anchors: [(1, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 28; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 03 03 00 00 00 00 00 03 00 00 00
00 00 00 03 00 00 00 00 00 03 00 00 00
00 00 00 01 01 00 00 00 03 01 00 00 00
00 00 00 00 01 00 00 00 01 01 00 03 03
01 00 00 00 00 01 01 00 00 00 00 01 02
00 00 00 01 01 00 00 00 00 00 00 01 01
00 06 00 00 00 01 00 00 00 00 00 03 01
00 00 00 03 01 03 04 04 01 01 03 04 03
02 04 04 04 03 04 04 04 01 04 04 04 04
04 04 04 04 04 04 04 04 04 04 04 00 04
04 00 00 02 04 04 04 04 04 02 00 00 00
00 00 00 03 00 00 00 00 00 03 00 00 00
```

## #29 · Hanzhong

Guide: [province-29.png](map-guides/province-29.png). Palace anchors: [(9, 4)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 29; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 03 02 02 02 02 03 03 02 02 02
02 02 02 02 02 02 02 00 02 00 02 04 04
00 00 00 00 00 00 00 00 00 04 04 02 02
03 03 03 03 05 03 03 03 04 03 03 03 03
03 02 02 00 00 02 00 00 03 06 00 02 03
03 03 02 00 04 04 01 01 00 00 00 03 03
03 04 03 00 02 04 01 03 02 02 03 04 03
00 04 05 03 03 04 05 00 03 03 03 04 02
00 04 00 02 02 04 00 02 02 02 02 04 00
00 00 04 00 00 04 00 00 02 00 00 04 02
02 00 04 03 00 00 04 00 03 03 04 02 02
02 02 04 03 02 02 04 02 03 03 04 02 02
```

## #30 · Zitong

Guide: [province-30.png](map-guides/province-30.png). Palace anchors: [(8, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 30; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 03 02 02 02 02 02 03 02 02 02
03 02 00 00 02 00 02 03 03 02 02 02 02
02 02 03 03 00 00 02 02 02 00 00 02 02
03 00 00 01 03 03 03 00 00 03 02 03 03
00 03 00 00 01 01 01 01 03 02 03 03 00
00 03 03 02 00 03 00 00 00 00 02 00 00
02 03 04 02 01 03 02 00 06 00 00 03 00
02 02 04 02 01 01 03 01 00 03 00 03 02
00 00 04 04 02 01 03 03 01 01 01 03 02
03 02 03 04 02 02 01 02 03 03 00 02 02
03 02 02 02 04 02 00 02 02 03 02 02 02
03 03 02 00 04 02 02 02 02 03 02 02 02
```

## #31 · Ba

Guide: [province-31.png](map-guides/province-31.png). Palace anchors: [(11, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 31; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 03 02 02 02 02 02 03 02 00 00
02 02 02 02 03 02 02 00 00 03 00 00 00
02 00 02 02 03 02 00 00 03 00 00 00 00
03 03 00 00 02 00 00 00 00 05 01 04 04
02 02 03 00 03 03 03 03 03 04 04 04 04
02 02 02 00 03 03 03 04 04 04 04 03 03
02 02 02 04 04 04 04 04 04 04 00 06 00
02 04 04 04 04 04 04 01 00 01 04 04 04
04 04 04 00 00 00 01 01 00 00 01 03 03
04 00 00 03 03 04 00 00 03 02 00 00 02
02 02 02 04 04 02 04 04 04 04 04 04 00
02 02 02 03 02 02 02 02 02 03 00 00 04
```

## #32 · Jianwei

Guide: [province-32.png](map-guides/province-32.png). Palace anchors: [(5, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 32; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 04 04 03 02 04 02 02 04 04 02 02
02 02 02 04 03 00 04 04 02 04 03 02 02
02 00 00 02 04 03 00 04 04 00 00 04 04
03 00 03 03 04 04 04 00 00 00 00 04 04
00 03 01 03 02 00 04 03 00 03 04 04 04
02 03 01 03 00 06 04 04 03 04 04 04 03
02 03 01 01 00 04 04 04 04 04 04 03 03
02 03 03 04 04 04 04 01 04 01 03 02 02
00 02 04 04 04 02 01 00 01 00 00 00 02
00 00 04 04 02 00 00 00 00 02 00 02 02
02 02 04 04 03 02 00 02 03 03 02 02 02
02 02 04 04 03 02 02 02 02 02 03 02 02
```

## #33 · Chengdu

Guide: [province-33.png](map-guides/province-33.png). Palace anchors: [(8, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 33; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 03 03 03 04 02 02 02 02 03 03 02 02
03 02 02 02 04 00 02 02 02 03 03 02 02
03 02 02 02 04 04 00 03 02 00 00 02 02
02 02 00 00 02 04 05 01 03 05 00 00 02
02 03 02 02 00 04 03 00 00 00 03 00 00
04 04 03 03 04 00 03 00 06 00 03 00 02
02 02 04 04 04 00 05 01 00 01 05 00 03
03 03 00 04 04 04 03 03 01 03 03 04 03
04 04 00 00 04 04 04 04 03 04 04 04 04
03 04 03 03 00 00 04 04 04 04 04 02 04
03 03 04 04 03 02 00 02 04 03 02 02 02
03 03 03 03 04 02 02 02 02 03 03 03 02
```

## #34 · Yuexi

Guide: [province-34.png](map-guides/province-34.png). Palace anchors: [(6, 7)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 34; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 04 04 03 02 02 02 02 02 03 02 02
02 02 04 04 03 00 02 02 02 02 03 02 02
04 04 04 04 00 02 00 00 00 02 02 00 02
04 04 04 04 01 01 02 02 00 00 00 00 02
03 05 00 04 01 01 03 03 02 02 00 03 02
03 00 04 03 01 03 00 00 03 01 01 03 03
00 03 04 05 00 00 00 00 03 00 02 03 03
00 03 04 04 02 00 06 00 00 03 05 00 02
00 00 03 04 03 03 00 03 03 00 00 02 00
02 02 03 04 00 00 03 02 02 00 02 02 00
02 02 02 04 00 02 00 00 00 03 02 02 02
02 02 04 03 02 02 02 02 02 03 02 02 02
```

## #35 · Dianchi

Guide: [province-35.png](map-guides/province-35.png). Palace anchors: [(3, 7)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 35; follow only this province guide.
```

Terrain rows, top to bottom:

```text
03 02 02 02 04 04 02 02 02 03 02 02 02
03 02 02 03 03 04 00 00 03 00 02 02 02
03 03 02 02 03 03 04 04 01 01 02 02 02
04 04 03 03 02 00 02 02 04 01 03 03 02
01 01 04 04 03 05 02 02 04 01 03 03 02
02 03 01 04 00 00 03 03 04 04 01 02 02
02 03 00 04 00 00 01 01 03 04 00 00 02
04 04 00 06 04 04 01 03 03 03 04 04 03
02 04 00 00 00 01 04 04 00 03 03 04 03
02 03 04 04 01 03 02 04 00 02 03 02 04
02 03 03 03 04 03 03 04 00 02 02 02 02
02 02 02 02 04 02 02 04 00 00 02 02 02
```

## #36 · Yongchang

Guide: [province-36.png](map-guides/province-36.png). Palace anchors: [(9, 8)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 36; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 04 03 02 02 02 02 02 03 03 00 00
02 04 04 02 03 00 02 00 00 00 03 00 02
04 00 00 00 03 00 00 03 00 00 00 02 02
03 03 00 05 03 01 00 03 01 01 00 02 02
03 03 03 00 00 03 01 01 03 02 00 02 03
03 03 03 00 03 03 03 05 00 00 00 03 03
03 00 01 03 01 02 01 01 03 03 00 00 03
00 03 01 03 01 01 01 01 01 00 03 03 00
03 01 01 01 03 03 03 03 00 06 00 03 02
02 02 02 02 01 01 00 00 00 00 00 03 02
02 03 03 03 02 02 02 02 02 02 02 03 02
03 03 03 03 03 03 03 03 03 03 03 03 03
```

## #37 · Nanhai

Guide: [province-37.png](map-guides/province-37.png). Palace anchors: [(9, 7)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 37; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 03 00 00 00 03 03 00 00 00
00 00 00 03 03 00 00 00 03 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00
03 03 00 00 00 00 00 01 00 01 00 00 00
03 00 00 00 01 01 00 01 01 01 00 01 01
00 03 03 00 01 00 00 00 01 00 00 01 04
03 04 04 04 00 00 00 00 00 00 00 04 04
04 00 03 03 04 04 04 04 00 06 00 04 04
00 00 00 00 05 04 00 04 04 04 00 04 04
00 00 00 00 00 01 04 04 00 00 04 04 04
00 04 00 00 01 04 01 04 00 00 04 04 04
04 04 04 04 04 04 04 04 04 04 04 04 04
```

## #38 · Cangwu

Guide: [province-38.png](map-guides/province-38.png). Palace anchors: [(4, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 38; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 03 02 02 00 00 00 03 00 00 00
02 02 02 03 02 00 00 00 03 00 00 04 04
02 02 02 00 01 00 00 01 00 04 04 00 00
03 03 02 00 00 00 01 04 04 01 01 00 00
03 02 00 00 00 00 01 04 01 00 00 00 00
02 01 00 04 06 04 04 00 00 00 00 00 00
01 04 04 01 04 01 01 00 00 01 01 00 04
04 00 01 00 01 00 00 01 01 00 00 04 04
00 00 00 00 01 00 00 00 00 04 04 04 04
00 00 00 00 00 04 00 00 04 04 04 04 04
00 00 00 04 00 04 04 04 04 04 04 04 04
04 04 04 04 04 04 04 04 04 04 04 04 04
```

## #39 · Hepu

Guide: [province-39.png](map-guides/province-39.png). Palace anchors: [(5, 4)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 39; follow only this province guide.
```

Terrain rows, top to bottom:

```text
00 00 00 03 00 00 00 00 00 03 00 00 00
00 00 00 03 03 00 00 00 00 03 00 04 04
00 00 00 00 00 00 00 00 00 04 04 00 00
03 03 00 01 00 00 00 00 00 04 00 00 00
04 04 04 04 00 06 01 01 01 04 01 00 01
01 01 01 00 04 04 04 04 04 01 01 04 04
00 00 00 01 00 00 00 00 01 00 00 04 04
00 00 01 00 00 00 00 00 00 01 04 04 04
00 00 00 00 00 01 01 01 00 00 04 04 04
00 00 00 00 00 04 04 00 00 00 01 01 04
00 00 00 04 04 04 04 04 01 01 00 04 04
04 04 04 04 04 04 04 04 04 04 04 04 04
```

## #40 · Yulin

Guide: [province-40.png](map-guides/province-40.png). Palace anchors: [(9, 6)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 40; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 03 02 02 02 02 02 02 03 00 00
02 02 02 03 02 00 00 00 00 03 03 00 00
02 00 02 00 00 00 00 00 00 01 00 00 00
00 00 00 01 00 01 00 01 01 00 00 00 00
02 03 00 00 01 00 00 01 00 00 00 01 00
03 02 03 00 00 00 00 00 01 01 01 01 01
02 01 01 01 01 00 00 00 00 06 01 01 01
02 01 01 00 00 01 01 00 00 00 01 01 01
02 01 00 00 01 00 00 00 00 01 01 03 03
00 00 00 01 00 00 00 01 00 00 00 00 03
00 00 00 03 03 00 00 01 01 04 04 04 04
00 00 00 03 00 00 00 04 04 03 00 00 00
```

## #41 · Jiaozhi

Guide: [province-41.png](map-guides/province-41.png). Palace anchors: [(5, 5)].

```text
Use case: sketch-to-render. Create exactly one full hand-painted late Han China battlefield landscape from the attached semantic layout guide. Exact overhead orthographic view, same 1024:1109 portrait aspect ratio and exact geographic positioning. Guide colors: pale green = open plains/fields; dark green = dense jungle woodland; ochre = low rolling hills; gray = rocky mountains; blue = river water; orange = small fortified town; coral = palace town; darkest = outside footprint. Preserve EVERY terrain cell center's category and every city anchor's exact position. Replace blocky color boundaries with smooth natural continuous boundaries, crisp fields, restrained forest and rock detail, clean rivers. Beautiful painterly strategy game map, clean readable natural colors, no fog. Continuous full landscape, no visible hex geometry or outlines, no tile appearance, no text, UI, units, labels, watermark. No invented additional water, cities, or mountains. Render terrain only wherever specified. Outside-footprint edge may remain dark green. Maintain attached map's unique geography. This is province 41; follow only this province guide.
```

Terrain rows, top to bottom:

```text
02 02 02 03 00 00 00 04 00 03 00 00 00
02 00 00 03 00 00 04 00 03 03 00 00 00
02 00 00 02 02 04 04 00 00 01 00 00 00
00 00 00 02 04 02 00 01 00 00 00 00 00
00 01 00 00 02 01 00 00 00 01 00 01 01
00 00 00 01 01 06 01 00 00 00 00 01 04
01 01 00 00 01 01 01 00 01 00 01 04 04
03 03 00 00 01 00 00 00 00 00 01 04 04
02 03 03 05 00 04 00 00 00 04 04 04 04
02 00 00 04 04 04 04 04 04 04 04 04 04
02 02 04 04 04 04 04 04 04 04 04 04 04
02 02 00 00 04 04 04 04 04 04 04 04 04
```
