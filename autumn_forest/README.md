# Autumn, alive

From this directory, run:

```powershell
python -m http.server 8765 --directory dist
```

Open <http://localhost:8765>. Expect a full-screen autumn forest with
Realistic and Watercolour buttons. Drag the scene or focus the canvas and
use the arrow keys to look around. The Breeze slider changes wind strength;
the pause button freezes the simulation. [1][2]

The exported copy in `C:\automation\prototypes\autumn_forest` also provides
`index.html` directly in that folder. It can be opened without a server.
Its `dist` directory preserves the exact static output used by Sites. [3]

## How it works

The renderer uses WebGL 2 directly, with no three.js or runtime dependencies.
Trunks and branches share a geometry buffer. Leaves use instancing, which
draws many copies of a shape using one graphics command. Distant leaves use
two triangles instead of fourteen. The whole frame uses five draw calls:
sky, solid geometry, near leaves, distant leaves and post-processing. [1]

The final pass uses a depth texture to blur distant scenery. The same pass
creates the watercolour mode with softened edges, colour quantization and
procedural paper grain. Wind and falling leaves run in the vertex shader.
Reduced-motion preferences start the scene paused; hidden tabs stop their
animation loop. Lost WebGL contexts trigger scene reinitialization. [1]

Rendering is capped at 1.6 device pixels per CSS pixel and approximately
1.5 million total pixels. If the measured frame rate drops below 34 fps,
resolution and foliage density decrease. Above 56 fps, resolution gradually
recovers. These are targets and adaptation rules, not a device guarantee. [1]

## Validation

```powershell
node --check forest.js
Get-Content validation.json
```

The syntax check should return exit code 0 without output. The JSON records
the browser, graphics hardware, tested screen sizes, frame rates and
interaction checks. In the Sites source checkout these files are in `dist`.
The recorded browser run had no JavaScript or WebGL errors. [4]

Both modes were checked at 320x568, 360x800, 390x844, 412x915, 430x932,
768x1024, 844x390 and 1440x900. Controls remained visible without horizontal
overflow or overlap. Pause/resume, the wind slider, keyboard/pointer input,
the notes dialog, reduced motion and context recovery passed. [4]

Testing used desktop Chrome with an NVIDIA RTX 3060 and mobile viewport
emulation. Measured frame rates were 179-240 fps; a six-times CPU slowdown
measured approximately 231 fps. CPU throttling does not simulate a mobile
GPU, memory bandwidth or thermal throttling. **30 fps on a physical
medium-tier phone has not been verified.** [4]

For the remaining device check, open the published Site on the target phone,
run each mode for at least one minute, rotate the phone and inspect the live
frame-rate reading in the information panel. Confirm at least 30 fps during
camera movement and sustained animation, including after the phone warms.

## Provenance

All geometry and visual effects are original procedural code. No external
assets are downloaded. Prompts and creator credit are in [ASSETS.md][5].
The application is a stylized real-time naturalistic rendering; no
photographic textures are used. [1][5]

[1]: dist/forest.js
[2]: dist/index.html
[3]: .openai/hosting.json
[4]: dist/validation.json
[5]: dist/ASSETS.md
