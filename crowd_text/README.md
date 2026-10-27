```powershell
cd C:\automation\prototypes
python -m http.server 8000
```

Open `http://localhost:8000/crowd_text/index.html`. The crowd automatically
forms `Happy 2027`. Open the following path to form the name on the first
line and the greeting on the second:

```text
/crowd_text/index.html?Chong%20Boo%20Chean%20and%20Family

Chong Boo Chean and Family
Happy 2027
```

Serve the parent directory so `../lib/three.module.js` and its companion
`three.core.js` are accessible. Local import is attempted first; failure
loads Three.js 0.186.0 from jsDelivr. See `three-loader.mjs:1`.

Tap Message to edit English or Chinese text, choose the crowd detail, and
adjust the pace. Form message closes the editor and gathers the crowd.
Scatter / Gather changes the arrangement. Drag to orbit, pinch or use the
mouse wheel to zoom, and tap Fit to see everyone. The view button switches
between angled and overhead views. Pause freezes the movement. See
`index.html:33` and `app.mjs` for the controls and event handlers.

Run the checks from this directory:

```powershell
node --experimental-vm-modules --test tests/*.test.mjs
```

Expected output ends with zero failures. The checks cover URL greetings,
Unicode validation, point spacing, camera projection, limb joints, resource
cleanup, local/CDN loading, and browser event flows with substitute browser
services. They use the actual local Three.js math and scene objects, without
requiring a graphics context. The module flag allows the loader test to
simulate failed imports; see `tests/app.test.mjs` and `tests/flows.test.mjs`.

The app separates text geometry (`formation.mjs`), the reusable articulated
rig (`crowd.mjs`), dependency loading (`three-loader.mjs`), and browser UI
orchestration (`app.mjs`). Five instanced meshes share geometry across all
people. Explicit line breaks are retained, so a long URL greeting remains
on one line and is fitted to the available width. See `crowd.mjs:14` and
`formation.mjs:3`.

After automated checks, verify the appearance and touch controls on Android
and iPhone, including portrait, landscape, the open keyboard, and Chinese
messages. Automated math checks do not establish real-device frame rates.
