# The Alignment Principle

From the repository's `prototypes` directory, run:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000/profile2610/>. Keep the server running while
viewing the profile. Serve the parent directory because the page uses the
existing YAML parser at `../lib/js-yaml.js`.

The expected result is a profile with three chapters: an ivory introduction,
a dark value-signature section, and a career atlas with academic achievement.
The terminal prints successful HTTP requests; exact log timestamps vary.

This is a static HTML, CSS, and JavaScript site. There is no install or build
step. Profile content is loaded from `profile.yaml`. Canvas draws the symbolic
animations without a 3D engine or external services. See `index.html`,
`js/main.js`, and `js/scenes.js` for the implementation.

Select a value to change the instrument drawing. Desktop scrolling also
selects the corresponding value. On narrow screens, the controls switch both
the drawing and the story. Select a career chapter to redraw its geographic
connections and show its details. The order controls reverse the career list.
The header's motion control pauses all animation. The initial state respects
the device's reduced-motion preference.

## Content provenance

| Content | Source |
| --- | --- |
| Identity and contact information | Original YAML [1], `basics` |
| Portrait | Original image [2] |
| Delivery and development evidence | Original YAML [1], `signatureValues` |
| Career dates, positions, locations, tools | Original YAML [1], `work` |
| Academic achievement | Original YAML [1], `education` |
| Geographic landmask | Original map data [3] |

[1]: ../profile2609/profile.yaml
[2]: ../profile2609/assets/cbc.jpg
[3]: ../profile2609/js/landmask.js

The new presentation integrates assisted exploration and rapid prototyping
into technical depth, delivery orchestration, and talent elevation. It does
not present AI as a separate value signature. Company names and timeframes
remain attached to the supporting achievements in `profile.yaml`.

The source's 2011 Blaupunkt entry names “Global Intel customers”. That wording
is preserved; confirm it before public release. Unspecified customer
locations are described as unspecified rather than placed on the atlas.

After editing, check both desktop and narrow layouts, select each value and
career entry, and exercise the motion control. JavaScript syntax can be
checked from this folder with:

```powershell
node --check js/main.js
node --check js/scenes.js
```

Both commands should exit successfully without diagnostic output. They
verify syntax; browser checks are still needed for layout and interaction.
