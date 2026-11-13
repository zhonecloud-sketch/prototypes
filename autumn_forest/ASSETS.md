# Asset notes

Open `index.html` and select the information button to find these notes.
Expect a realistic forest with optional sound. Sound starts off. [1][2]

All visual and audio ingredients are original procedural work generated for
this project. There are no stock recordings, downloaded models, photographs,
external fonts or third-party textures. Sources below are the generating
code and the validation record. [1][3][4]

Generation specifications:

- Trees: "Create mixed-age maple and silver birch trees at peak autumn.
  Vary heights from young trees to tall canopy trees, and vary lean, crown
  width, branching height, asymmetry and spacing. Avoid rows and repeated
  crown patterns." [1]
- Trail: "Keep the stroll clear of low branches, twigs and saplings. Reserve
  a broad corridor with overhead clearance and make travel follow the
  ground at an easy walking pace. Generate gentle random bends and forest
  sections ahead of a continuous forward walk." [1]
- Leaves: "Build lobed orange, russet and gold maple leaves and oval yellow
  birch leaves. Add fallen leaves, fluttering foliage and drifting leaves.
  Time releases to the audible gusts. Use gravity, drag and lift so stronger
  gusts carry leaves across the trail. Update detail as the viewer walks." [1]
- Terrain and light: "Make uneven ground, a winding trail, dappled light,
  small plants, atmospheric perspective and distance-dependent blur. Keep
  the display realistic, with occasional fog under dim sunlight and clear
  air under strong sunlight." [1]
- Interface: "Use quiet editorial typography and dark glass controls. Keep
  pause and look controls compact; put scene and sound adjustments in a
  collapsible, scrollable drawer that fits narrow phones." [2][3]
- Favicon: "Make an ochre maple leaf on a dark woodland square." This is
  an original inline SVG. [2]

Original audio composition prompts, implemented with deterministic
synthesis rather than an audio-generation service: [4]

- `audio/amber-light.mp3`: "A quiet, warm major-key instrumental for a
  breezy autumn walk: softly struck piano-like notes, gentle plucked
  arpeggios, slow chords and spacious echoes; no drums or vocals."
- `audio/birch-whispers.mp3`: "A reflective minor-key woodland miniature,
  sparse bell-piano melody over soft sustained chords, unhurried and
  restful, with no percussion or voices."
- `audio/last-gold.mp3`: "A tender, hopeful major-key autumn piece, light
  arpeggios and a descending melody, rounded timbres and long quiet tails;
  complement the forest without dominating it."
- `audio/woodland.mp3`: "A seamless woodland bed of gentle gusting wind,
  dry leaves rustling in the canopy and occasional distant small birds.
  Keep the sound spacious, soft and calm, without footsteps or voices."

The three scores are 64 seconds each; the ambience loop is 46 seconds.
Published MP3 files have the embedded creator `zhone`, verified by Signature
Studio and checked again after decoding. [5]

These prompts document the specifications used to generate the code and
synthesis recipes. No third-party music or field recording is included.
Creative direction and creator credit: **zhone**. Implementation: **Codex**.
Retain these notes alongside the files when reusing the ingredients.

[1]: forest.js
[2]: index.html
[3]: style.css
[4]: tools/generate_audio.py
[5]: audio-validation.json
