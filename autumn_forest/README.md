# Autumn, alive

From this directory, run:

```powershell
python -m http.server 8765 --directory dist
```

Open <http://localhost:8765>. Expect an automatic stroll through a realistic
maple and birch woodland. Drag or use arrow keys to look around. Pause stroll
stops travel while the forest keeps moving. The upward arrow looks along
the trail again. Open Scene for the additional controls. [1][2]

The exported `index.html` in this folder also opens directly without a
server. `dist` preserves the exact static output deployed by Sites. [3]

## Scene and navigation

Trees mix young, middle-height and tall specimens, with irregular spacing,
lean, crown width and branch placement. Each trunk widens into an uneven
root flare that follows the terrain and tapers below the soil. [1][8]

The default pace is 0.85 metres per second. The camera follows a randomly
seeded forward trail at 1.72 metres above the ground. Smoothed bends keep
the route heading within a span of 80 degrees. A 3.6-metre-wide corridor
excludes low branches and keeps trunks and saplings outside the route. [1]

Scene controls adjust walking pace, breeze, sunlight, fog in dim light,
distant blur, drifting leaves and foliage animation. Fog varies with time
and distance under dim light and clears as sunlight strengthens. The
drawer starts closed, scrolls
internally and occupies at most 52% of a portrait phone's height. Escape,
the close button or the Scene button closes it. [1][2][4]

Reduced-motion preferences start both walking and foliage paused. Hidden
tabs stop rendering. Context restoration rebuilds the renderer. [1]

## Audio

Enable nature ambience or music separately under Scene. Both start off, and
no audio files are requested until enabled. Volume controls are independent.
Three original 64-second instrumental pieces rotate automatically. Next
advances the music. The 62-second woodland bed supplies leaf rustle and air
noise. Runtime gusts vary in strength, duration and spacing. Their shared
envelope controls the sound, canopy motion and leaf release. Stronger wind
adds more low-mid sound through Web Audio where available. Gravity settles
leaves in calm air, while drag and lift carry them sideways or upward in
stronger gusts. Hidden tabs pause sound and reset stops it. [1][5][6][8]

Audio masters are synthesized by `dist/tools/generate_audio.py`, using NumPy,
SciPy and FFmpeg. The running website needs none of these dependencies.
Signature Studio verified `zhone` in each published MP3's creator tag. [7]

## Rendering and performance

The application uses WebGL 2 directly, without three.js or a runtime package.
It draws sky, solid geometry, nearby and distant leaves, and a depth-aware
blur. The renderer holds six 24-metre forest sections. It prepares four
ahead of the current one and releases the buffers for sections that fall
more than one section behind. Leaf detail follows the walker. [1]

Rendering is capped at 1.6 device pixels per CSS pixel and approximately
1.5 million pixels. Measured rates below 34 fps reduce resolution and leaf
count; rates above 56 fps gradually restore quality. [1]

## Verification

```powershell
node --check forest.js
node --check audio.js
Get-Content validation.json
Get-Content audio-validation.json
```

Syntax checks should exit successfully without output. The JSON reports
record viewport, route, interaction and audio checks, plus decoding and
creator metadata for the audio. The reports identify the actual test
hardware. [6][7]

Browser tests use desktop Chrome and an NVIDIA RTX 3060 with mobile viewport
emulation. They do not establish performance on a mobile GPU or account for
thermal throttling. **30 fps on a physical medium-tier phone remains
unverified.** [6]

For that remaining check, run the published Site on the target phone for
several minutes, enable both audio layers, open and close settings, rotate
the phone and inspect the information panel's live frame rate. Confirm at
least 30 fps throughout travel, including after the phone warms up.

All visual and audio generation prompts are in [ASSETS.md][8]. Keep these
notes with the exported ingredients when reusing the project.

[1]: dist/forest.js
[2]: dist/index.html
[3]: .openai/hosting.json
[4]: dist/style.css
[5]: dist/audio.js
[6]: dist/validation.json
[7]: dist/audio-validation.json
[8]: dist/ASSETS.md
