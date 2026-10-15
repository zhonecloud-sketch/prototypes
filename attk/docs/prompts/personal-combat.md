# Personal combat artwork prompts

Use the labeled prompt with the built-in image generator. These are the
canonical prompts for the original assets and four replacement frames.

Original output: three opaque panoramic scenes and one transparent 4 × 2
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

## Close combat replacement frames

Use the production prompt for frame 1, then the edit prompts for frames
2–4 with the generated frame 1 as the edit target. Inspect frame 1 before
editing. The runtime uses four opaque 1983 × 793 full-scene images. The
original sprite atlas above is retained only as historical provenance.

Expected sequence: high guard, low block, counterattack, reset. Each image
lasts three seconds; the game ends the loop when strength decides a result.
Source files, dimensions, conversion and hashes are in the manifest.

## close-1 — production

```text
Use case: historical-scene. Asset type: first of four full scene animation
frames for a Three Kingdoms strategy game personal combat event, landscape
1983x793 pixels, ratio 2.5:1. Show exactly two Chinese generals in close
mounted combat, both seated firmly in saddles on horses facing one another,
their long weapons crossing clearly at center. Defender on left in dark blue
lamellar armor, black beard, dark brown horse facing right; attacker on right
in red lamellar armor, short beard, chestnut horse facing left. Tight
cinematic side view, horses and riders fully readable, dusty battlefield
softly receding behind them, natural daylight. Crisp detailed realistic
historical painting, sharp armor and weapon edges, no motion blur, no haze
obscuring figures. This frame is the high crossed-weapons guard pose, ready
for a short back-and-forth exchange. Keep both horses close together with
weapons in physical contact. Fill the entire wide frame as one continuous
illustration, no panels, no text, no labels, no border, no watermark, no UI.
```

## close-2 — edit

```text
Use case: precise-object-edit. Edit target: supplied first combat frame.
Produce the second frame of this four-image close mounted duel, same 1983x793
wide full-scene composition. Change only weapon and forearm poses: the blue
defender on LEFT presses his long weapon downward in a forward strike; red
attacker on RIGHT lowers his weapon into a diagonal block. Their weapon shafts
visibly cross at chest height in center, lower than the original high guard.
Both generals remain seated on the SAME horses, same faces, same blue and red
armor, same horse positions, same camera, background, lighting and crisp
painting style. Maintain physical hand grips and exactly two weapons, no
additional limbs. No blur, no text, no UI, no panels.
```

## close-3 — edit

```text
Use case: precise-object-edit. Edit target: supplied first combat frame.
Produce the third frame of the four-image close mounted duel, same landscape
1983x793 full-scene composition. Change only weapons, arms and slight upper
torso poses: red attacker on RIGHT now counterattacks, pushing his long weapon
upward and leftward toward the blue defender. Blue defender on LEFT raises his
long weapon into a steep diagonal parry; the two weapon shafts cross clearly
in the center above the horses' ears. Make this visibly different from the
symmetric high guard: red rider leaning slightly forward, blue rider leaning
slightly back. Preserve same two men and faces, armor, capes, seated riding
positions, exact horse placement, camera, backdrop, daylight and crisp
historical painting. No motion blur, no text, no borders, no UI, no additional
people or weapons.
```

## close-4 — edit

```text
Use case: precise-object-edit. Edit target: supplied first combat frame.
Produce the fourth frame of the four-image close mounted duel, same landscape
1983x793 full-scene composition. Change only weapons and arms: blue rider on
LEFT draws back his long weapon, hands nearer his waist, blade angled upward
near center; red rider on RIGHT extends his long weapon forward, blade tilted
down-left, both weapon shafts meeting in a low crossed bind just over the
horses' foreheads. Both riders are resetting toward the initial high guard,
still seated, no winner, no falling or injured men. Preserve exact same two
faces, armor, capes, horse positions, camera, background and daylight. Crisp
realistic historical painting, sharp edges, no blur. Exactly two men, two
horses, two long weapons; no text, no UI, no panels.
```
