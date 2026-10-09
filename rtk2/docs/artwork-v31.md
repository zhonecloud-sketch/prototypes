# V31 ruler lifecycle artwork

Generated 2026-10-09 with ImageGen. These are two original historical illustrations, not copies of DOS graphics or authenticated portraits. Each output is one continuous 1983 × 793 RGB panorama (approximately 2.5:1), filling the event frame edge to edge. The game uses proportionate scaling. The PNG masters were encoded as WebP at quality 93 without resizing, cropping or stretching.

| Event | Runtime asset | Composition |
| --- | --- | --- |
| Clan destroyed | `assets/clan-destroyed-v31.webp` | Abandoned palace, empty throne, extinguished lamps, fallen banner, broken seal and departing retainers. |
| Heir vows vengeance | `assets/heir-vows-vengeance-v31.webp` | Funeral court, mourning heir receiving the seal before the deceased ruler's memorial, with grieving generals. |

Both images were visually reviewed as full-frame scenes with matching late-Han court materials, muted jade/ochre/vermilion colours and natural faces. They contain no gameplay UI or event captions. The renderer registers them as single-frame atlases; the event system selects them for clan extinction and attributed violent succession. `config/release.json` records their SHA-256 hashes together with all active enlarged v30 event art.

## Clan-destroyed generation prompt

```text
Use case: historical-scene.
Asset type: late Han / Three Kingdoms strategy game event illustration.
Primary request: CLAN DESTROYED, a symbolic fall of a ruler's realm. Create exactly ONE continuous, single-scene, full-bleed panoramic historical Chinese painting.
Scene/backdrop: an abandoned late Han ceremonial palace courtyard at dusk, with carved dark wooden palace architecture, vermilion columns, worn stone paving and distant misty mountains.
Subject: an empty ceremonial throne on its dais, extinguished bronze lamps, a fallen torn vermilion banner with no lettering, and a broken jade royal seal in the foreground. A small group of defeated retainers in historical Chinese robes and worn armor quietly depart through the courtyard gate, backs turned or downcast natural human faces.
Style/medium: rich, finely detailed historical Chinese ink and painted illustration, cinematic narrative realism, natural human faces, convincing late Han clothing and architecture. Match the rich dark wooden courts, layered dramatic depth, restrained brush texture, fine garments, natural faces, and warm muted lighting of the supplied style description.
Composition/framing: exact 2.5:1 ultra-wide panorama, intended for an event canvas 500x200; render at 2560x1024 if possible. Show the entire scene edge to edge; no collage, contact sheet, panels, seams, frame, border, gutters, blank margins or vignette. The deserted throne remains the clear central narrative focus, with the broken seal visibly readable as an object and the departing retainers supporting the story.
Lighting/mood: subdued ochre dusk fading into jade-gray shadows, tragic quiet aftermath, thin mist and cold smoke from extinguished lamps.
Color palette: muted jade, ochre, vermilion, weathered gold, charcoal and warm brown.
Constraints: no readable lettering, no text, no titles, no UI, no watermark, no gore, no mutilation. This is one complete panorama, not a sheet of illustrations.
```

## Heir-vows-vengeance generation prompt

```text
Use case: historical-scene.
Asset type: late Han / Three Kingdoms strategy game event illustration.
Primary request: HEIR VOWS VENGEANCE. Create exactly ONE continuous, single-scene, full-bleed panoramic historical Chinese painting.
Scene/backdrop: a late Han funeral court inside a grand ceremonial palace hall, carved dark wood, vermilion columns, bronze vessels, pale funeral streamers and soft incense smoke.
Subject: a mature adult heir, with a natural expressive Chinese face, receiving a jade royal seal from a grieving senior minister before his deceased father's plain memorial tablet. The heir wears dignified white mourning clothing, his jaw tense and eyes resolute and angry. Grieving veteran generals and retainers in historically appropriate robes and armor gather around him. The father's memorial tablet is clearly a funerary object but bears no readable letters. White mourning garments and funeral streamers establish the funeral setting. Imply a rival's threatening shadow in the distant architecture and atmosphere, without adding a separate portrait or supernatural figure.
Style/medium: rich, finely detailed historical Chinese ink and painted illustration, cinematic narrative realism, natural human faces, convincing late Han clothing and architecture. Match rich dark wooden courts, layered dramatic depth, restrained brush texture, fine garments, natural faces, and warm muted lighting.
Composition/framing: exact 2.5:1 ultra-wide panorama, intended for an event canvas 500x200; render at 2560x1024 if possible. One continuous composition, edge-to-edge painted environment. The seal handover and mature heir's face are the central readable focus, with the father's memorial and mourners supporting the narrative. No collage, contact sheet, panels, seams, frame, border, gutters, blank margins or vignette.
Lighting/mood: somber cinematic funeral light, muted warm ochre from bronze lamps and cool jade-gray shadows, grief turning into resolve.
Color palette: muted jade, ochre, restrained vermilion, ivory white, charcoal, warm brown and weathered gold.
Constraints: no readable lettering, no text, no titles, no UI, no watermark, no gore, no visible body. This is one complete panorama, not a sheet of illustrations.
```

The image model returned 1983 × 793 rather than the requested optional 2560 × 1024; the native output is retained. The artwork is symbolic and shared across rulers. The successor can be a loyal officer rather than the deceased ruler's literal son; the illustration does not alter kinship or succession rules.
