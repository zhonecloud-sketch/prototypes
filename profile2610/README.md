# View and update profile2610

From `C:\automation\prototypes`, run:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000/profile2610/>. Keep the server running while
viewing the profile. The parent folder must be served because `index.html`
loads its YAML parser from `../lib/js-yaml.js`.

The expected page has a single-line name and three section links: Profile,
Value signatures, and Career & education. All three values and all career
records appear in the scroll flow. The career map follows the visible role.
No content requires opening a selector or an expansion control.

This static site uses `profile.yaml` for identity, summary, contact links,
navigation, section headings, evidence, career records, education, and footer
labels. These are read by `js/main.js`; the drawings in `js/scenes.js` contain
no profile copy. One font family and a shared size and colour scale are
defined in `style.css`.

To change the profile, edit `profile.yaml` and reload the page:

| YAML section | Visible content |
| --- | --- |
| `basics` | Full name, portrait, role, tagline, summary, location, contacts |
| `presentation` | Navigation, headings, instructions, footer, motion labels |
| `signatureValues` | Value names, statements, methods, metrics, evidence |
| `work` | Career roles, dates, sites, customers, highlights, tools |
| `education` | Qualifications and institutions |
| `meta.lastUpdated` | Update date in the footer |

Each value's `animation` selects its symbolic drawing: `technical`,
`optimisation`, or `people`. The drawing follows this key if the values are
reordered. Content labels can be changed independently. Career records appear
in YAML order. Coordinate fields determine their positions on the map.

The name is rendered verbatim from `basics.name`, without splitting or adding
punctuation. The renderer displays every entry in `basics.profiles`; no
network name is hard-coded. The footer motion control respects the device's
reduced-motion preference and can pause or resume the drawings.

## Provenance

| Content | Source |
| --- | --- |
| Identity, career, education, achievement metrics | Original YAML [1] |
| Portrait | Original image [2] |
| Geographic landmask | Original map data [3] |

[1]: ../profile2609/profile.yaml
[2]: ../profile2609/assets/cbc.jpg
[3]: ../profile2609/js/landmask.js

The 2011 Blaupunkt role names “Global Intel customers” in the original YAML.
That wording is preserved and should be confirmed. No quality award is named
in the source; the Optimisation evidence uses its documented delivery times,
test automation, and defect reductions.

After editing, check the desktop and narrow layouts. Confirm that the name
stays on one line, the section links work, and all values and career records
are visible. From this folder, also run:

```powershell
node --check js/main.js
node --check js/scenes.js
```

Both commands should exit successfully without diagnostic output. These
checks verify JavaScript syntax; the browser checks verify presentation.
