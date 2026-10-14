# 223 webp

Canonical saved prompts. Line wrapping preserves the recorded wording.
Historical variants remain labelled; a new generation is not guaranteed
to reproduce the original pixels or to grant commercial rights.

Recorded asset: `assets/artwork/history-v36/223.webp`.

Recorded output: 1983 × 793 pixels. Requested resolution,
when different, remains inside the original production prompt.

## Original production prompt

```text
Use case: historical-scene. Asset type: standalone full-screen historical event
painting for a Three Kingdoms strategy game. Create ONE SINGLE highly detailed
ultra-high-resolution 3840 x 1536 wide panoramic painting. Edge-to-edge, no
grid, no montage, no blank margins, no borders, no text, no watermark. Style:
polished realistic painterly historical strategy-game art, sharply resolved
faces, fine fabric and lamellar armor, jade green, aged gold, vermilion and deep
navy, atmospheric natural lighting. Eastern Han/Three Kingdoms era China, no
modern objects. Strong readable foreground characters and detailed landscape or
architectural depth. Scene: Baidicheng, AD 223. Tasteful solemn deathbed
council. Aged Liu Bei, distinctive long earlobes, greying dark beard, cream-jade
silk robes and familiar broad composed face, rests reclining on an ornate couch,
entrusting the young heir to Zhuge Liang beside him. Zhuge Liang scholar cap,
white robe and feather fan, deeply respectful. Soft lantern light, delicate
carved wooden room, distant mountain view. No gore, no medical machines.
```

Recorded sources:

- `docs/artwork/history-generation-v36.json:[13].prompt`

Generation metadata: [history_v36_index.json](history_v36_index.json).

## Historical correction edit

Supply the existing source image described in the prompt. This edit
brief is not a standalone replacement for that image.

```text
Edit this historical Baidicheng deathbed painting. Preserve the panoramic aspect
ratio, high resolution, edge-to-edge painterly detail, architecture, light and
aged Liu Bei on the couch with long earlobes. Correct two historical details:
replace the small child beside Liu Bei with Liu Shan as a 16-year-old adolescent
prince of near-adult height and face, wearing a dark green ceremonial robe;
replace the green-robed long-bearded warrior in the rear left and the rough
bearded warrior behind the couch with ordinary Shu civilian court officials in
restrained grey-blue scholar robes and black court caps. Guan Yu and Zhang Fei
had already died and must not appear in this 223 AD scene. Keep Zhuge Liang at
the bedside with his scholar hat and white robe. No text, no blank edges, no
gore.
```

Recorded sources:

- `docs/artwork/history-generation-v36.json:[13].correctionPrompt`

Generation metadata: [history_v36_index.json](history_v36_index.json).
