# Personal combat artwork prompts

Use the labeled prompt with the built-in image generator. These are the
canonical production prompts for the four personal combat assets.

Expected output: three opaque panoramic scenes and one transparent 4 × 2
mounted combat atlas. Runtime scenes are proportionally fitted to
1983 × 793 pixels; the atlas is fitted to 2048 × 1024 pixels. Names and
ruler affiliations are added by the UI.

The prompts describe the intended composition. Reusing a prompt does not
guarantee identical pixels or establish commercial rights. No original
DOS image was supplied. Generation used the built-in imagegen tool on
15 October 2026. Source hashes and conversion details are in the
[asset manifest][manifest].

## challenge — production

```text
Use case: historical-scene
Asset type: landscape personal-combat event illustration for a Three Kingdoms
strategy game.
Primary request: Two opposing late Han Chinese generals on horses face each
other across an open battlefield, one raising a spear to issue a personal combat
challenge; their armies and standards stand far behind. Both mounted figures
fully visible.
Style: naturalistic cinematic painted realism, detailed late Han lamellar armor,
Chinese horses and tack, muted jade, ochre, warm gold and earth tones, soft
atmospheric background; match existing realistic Three Kingdoms event paintings.
Composition: panoramic 2.5:1 landscape, requested 1983 by 793 pixels. Keep
figures and horses fully within the composition. This is one complete scene, no
panels.
Text: none. Names and ruler affiliations will be rendered by the game UI, not in
the image.
Avoid: captions, lettering, symbols resembling text, UI, borders, watermarks,
modern objects, fantasy effects, graphic violence.
```

## win — production

```text
Use case: historical-scene
Asset type: landscape personal-combat event illustration for a Three Kingdoms
strategy game.
Primary request: The initiating late Han Chinese general sits upright victorious
on his horse, holding his spear proudly, while the defeated opposing mounted
general has lowered his weapon and is being taken captive peacefully. Clear
victory without gore.
Style: naturalistic cinematic painted realism, detailed late Han lamellar armor,
Chinese horses and tack, muted jade, ochre, warm gold and earth tones, soft
atmospheric background; match existing realistic Three Kingdoms event paintings.
Composition: panoramic 2.5:1 landscape, requested 1983 by 793 pixels. Keep
figures and horses fully within the composition. This is one complete scene, no
panels.
Text: none. Names and ruler affiliations will be rendered by the game UI, not in
the image.
Avoid: captions, lettering, symbols resembling text, UI, borders, watermarks,
modern objects, fantasy effects, graphic violence.
```

## loss — production

```text
Use case: historical-scene
Asset type: landscape personal-combat event illustration for a Three Kingdoms
strategy game.
Primary request: The initiating late Han Chinese general sits subdued on his
horse with lowered weapon and shoulders, while the opposing mounted general
stands triumphant nearby and soldiers approach to take the initiator captive.
Clear defeat without injury or gore.
Style: naturalistic cinematic painted realism, detailed late Han lamellar armor,
Chinese horses and tack, muted jade, ochre, warm gold and earth tones, soft
atmospheric background; match existing realistic Three Kingdoms event paintings.
Composition: panoramic 2.5:1 landscape, requested 1983 by 793 pixels. Keep
figures and horses fully within the composition. This is one complete scene, no
panels.
Text: none. Names and ruler affiliations will be rendered by the game UI, not in
the image.
Avoid: captions, lettering, symbols resembling text, UI, borders, watermarks,
modern objects, fantasy effects, graphic violence.
```

## sprites — production

```text
Use case: historical-scene
Asset type: transparent sprite atlas for a mounted personal duel in a Three
Kingdoms strategy game.
Create one 2048 x 1024 RGBA PNG atlas, exactly four equal columns and two equal
rows, eight separate 512 x 512 cells. Transparent background including all space
around every figure. Each cell contains one complete late Han Chinese general
riding a horse, full horse, rider and weapon visible with ample empty padding,
consistent naturalistic painted realism, no text or grid borders. Top row: the
SAME blue-accented defending general on the SAME dark horse facing RIGHT in four
consecutive combat poses: ready with spear, horse advancing with spear drawn
back, spear thrust forward, recoil guard. Bottom row: the SAME red-accented
attacking general on the SAME brown horse facing LEFT, the same four successive
poses. Place each horse’s hooves at the same baseline and its body at the same
scale in all four poses. Keep each figure strictly inside its cell. Weapons may
not cross cell boundaries. Subtle controlled motions suitable for looping a
mounted duel. Late Han lamellar armor and period tack, no modern objects, no
fantasy effects, no shadows outside each isolated sprite, no scenery, no
captions, no watermark.
```

[manifest]: ../artwork/personal-combat-manifest.json
