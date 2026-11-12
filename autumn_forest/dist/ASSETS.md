# Asset notes

Open `index.html`, then select the information button to reach these notes.
The forest should appear without downloading any external assets. [1]

All visual assets are generated procedurally by original code. No stock
images, downloaded models, third-party textures, external fonts, audio,
or image-generation services are used. [1][2][3]

Generation specifications for each original ingredient:

- Trees and branches: "Create tapered, branching 3D maple and birch trees,
  with varied heights, white birch bark and darker maple bark." [1]
- Canopy and leaf litter: "Build orange, russet and gold maple leaves, oval
  yellow birch leaves, and a leaf-strewn woodland floor. Use instanced
  geometry and simpler distant foliage." [1]
- Terrain and vegetation: "Make an uneven woodland floor with a winding
  open trail, dappled light, grasses and small saplings." [1]
- Animation: "Give the forest life with coherent canopy wind, leaf flutter,
  tumbling leaves and subtle camera drift. Include pause and breeze
  controls." [1]
- Light and distance blur: "Use warm atmospheric perspective, depth-aware
  far blur, translucent-looking leaves and gentle light shafts through the
  canopy." [1]
- Watercolour: "Transform the same 3D forest into a warm watercolour using
  pigment steps, softened edges, slight colour bleed and paper grain." [1]
- Leaf favicon: "Make a simple ochre maple leaf on a dark woodland square."
  The favicon is an original inline SVG. [2]
- Interface: "Frame the woodland with quiet editorial typography, cream
  text and compact dark glass controls that fit mobile screens." [2][3]

These prompts document the creative specifications used while generating
the code; they are not claims of separate image-model calls. Geometry uses
a fixed pseudorandom seed so the forest is reproducible. [1]

The user's original creative brief was:

> make a realistic 3D maple and birch forest at peak autumn, with trees and
> some nice animation, goal is to build a forest that has life to it. apply
> blur to faraway objects. Add a switch to toggle between realistic and
> watercolour views.

Additional constraints: raw WebGL without three.js; HTML5 output; Sites
workflow; export to `C:\automation\prototypes\autumn_forest`; Git push;
mobile dimensions; target at least 30 fps on medium-tier mobile phones.
Source: the user request in this chat.

Creative direction and creator credit: **zhone**. Implementation: **Codex**.
The next step for reuse is to keep these notes alongside the HTML files.

[1]: forest.js
[2]: index.html
[3]: style.css
