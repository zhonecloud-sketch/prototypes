/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SOLAR SYSTEM EXPLORER  –  Creative Three.js Visualisation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Planet textures : mercury/venus/earth/mars/jupiter/saturn/uranus/neptune/sun -texture.jpg
 *  Background      : space-hero-background.png
 *
 *  DESIGN NOTES
 *  ────────────
 *  • Planet radii and orbit distances are **artistically scaled** so that
 *    every planet is visible at once without absurd zoom levels.
 *    Comments next to each value state the real metric and the reason for
 *    the chosen artistic value.
 *
 *  • Orbital angular speeds are **strictly proportional** to real-world
 *    values (ω ∝ 1 / T_sidereal).  The ratios are calculated from the
 *    actual sidereal orbital periods published by NASA.
 *
 *  • Atmospheres are added as a translucent outer shell (THREE.BackSide)
 *    on every planet that possesses a significant atmosphere in reality:
 *      Venus, Earth, Mars (thin), Jupiter, Saturn, Uranus, Neptune.
 *    Mercury has no atmosphere.
 *
 *  • Eccentricities and orbital inclinations are accurate.
 */

// ─────────────────────────── bootstrap ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const app = new SolarSystemApp();
    app.boot();
});

// ═══════════════════════════════════════════════════════════════════════════
//  Main application class
// ═══════════════════════════════════════════════════════════════════════════
class SolarSystemApp {

    constructor() {

        // Three.js core
        this.scene    = null;
        this.camera   = null;
        this.renderer = null;

        // Collections
        this.planetObjects = [];   // array of { group, mesh, data, tiltPivot, atmo }
        this.orbitLines    = [];
        this.labels        = [];
        this.sunMesh       = null;

        // Camera orbit controls (manual spherical)
        this.cam = {
            distance : 120,
            theta    : -0.15,        // horizontal angle
            phi      : 0.40,         // vertical angle  (0 = horizon, π/2 = top)
            dragging : false,
            lastX    : 0,
            lastY    : 0,
            pinchDist: 0,
            target   : new THREE.Vector3(0, 0, 0)
        };

        // State
        this.speed          = 1.0;
        this.paused         = false;
        this.focusedPlanet  = null;   // ref into planetObjects[]
        this.autoRotate     = true;
        this.animating      = false;
        this.animId         = 0;

        // Loaded textures keyed by planet name
        this.textures = {};

        // ─────────────────────────────────────────────────────────────────
        //  ASTRONOMICAL DATA
        //
        //  Orbital angular-speed ratios are **exact** relative to Earth = 1.
        //  Formula:  ωRatio = T_earth / T_planet
        //
        //  Sources: NASA Planetary Fact Sheets
        //    Mercury  T = 87.969 d   → 365.256 / 87.969  = 4.1521
        //    Venus    T = 224.701 d  → 365.256 / 224.701 = 1.6254
        //    Earth    T = 365.256 d  → 1.0000
        //    Mars     T = 686.980 d  → 365.256 / 686.980 = 0.5317
        //    Jupiter  T = 4332.59 d  → 365.256 / 4332.59 = 0.08432
        //    Saturn   T = 10759.22 d → 365.256 / 10759.22= 0.03394
        //    Uranus   T = 30688.5 d  → 365.256 / 30688.5 = 0.01190
        //    Neptune  T = 60182 d    → 365.256 / 60182   = 0.006069
        // ─────────────────────────────────────────────────────────────────

        /**
         * BASE_ORBIT_SPEED is multiplied by ωRatio to get each planet's
         * angular speed per frame.  Adjust this single value to make the
         * whole system faster or slower without breaking the ratios.
         */
        this.BASE_ORBIT_SPEED = 0.002;

        /**
         * AU_SCALE – how many scene-units equal 1 AU.
         * Real AU distances would place Neptune ~600× farther than Mercury.
         * We compress the scale so everything fits on screen while still
         * respecting the *relative ordering* and giving outer planets room.
         */
        this.AU_SCALE = 50;

        this.planetData = {

            mercury: {
                name: 'Mercury',

                // Real radius: 2 440 km  (0.38× Earth).
                // Artistic: 0.6 – enlarged ~1.6× so the smallest planet is
                // still easily visible and clickable on mobile screens.
                radius: 0.6,

                // ── Orbit ──
                // Real semi-major axis: 0.387 AU.  Kept close to real value;
                // inner planets need no compression.
                semiMajorAxis: 0.387,
                eccentricity: 0.2056,    // highest eccentricity of any planet
                inclination: 7.005,      // degrees from the ecliptic
                lonAscNode: 48.331,      // Ω – longitude of ascending node (°)

                // ── Rotation ──
                axialTilt: 0.034,        // degrees – virtually zero tilt
                rotDir: 1,               // prograde
                // Real rotation period: 58.65 Earth days – very slow.
                // Artistic spin is faster so the texture visually rotates.
                rotSpeed: 0.003,

                // ── Orbital angular-speed ratio (STRICT) ──
                omegaRatio: 4.1521,

                // ── Atmosphere ──
                // Mercury has no significant atmosphere (exosphere only).
                hasAtmosphere: false,

                // ── Rings ──
                hasRings: false,

                // ── Info card ──
                color: '#b0a090',
                description: 'The smallest planet and closest to the Sun.  Its nearly non-existent axial tilt (0.034°) means it has no seasons.  Despite being closest to the Sun it is not the hottest – that title belongs to Venus.',
                distance: '57.9 million km (0.387 AU)',
                diameter: '4 879 km',
                orbitPeriod: '88 Earth days',
                rotPeriod: '58.6 Earth days',
                tiltInfo: '0.034°'
            },

            venus: {
                name: 'Venus',

                // Real radius: 6 052 km (0.95× Earth).
                // Artistic: 1.1 – slight enlargement for visual parity with Earth.
                radius: 1.1,

                semiMajorAxis: 0.723,
                eccentricity: 0.0068,    // most circular orbit in the solar system
                inclination: 3.395,
                lonAscNode: 76.680,

                axialTilt: 177.36,       // nearly upside-down → retrograde spin
                rotDir: -1,              // RETROGRADE rotation
                rotSpeed: 0.001,         // real rotation: 243 days – extremely slow

                omegaRatio: 1.6254,

                // Thick CO₂ / sulphuric-acid atmosphere – yellowish haze.
                hasAtmosphere: true,
                atmoColor: 0xddaa44,
                atmoOpacity: 0.35,

                hasRings: false,

                color: '#daa520',
                description: 'Venus spins backwards (retrograde) and is nearly upside-down with a 177.4° tilt.  The Sun rises in the west.  A single Venus "day" (243 Earth days) is longer than its year (225 days).',
                distance: '108.2 million km (0.723 AU)',
                diameter: '12 104 km',
                orbitPeriod: '225 Earth days',
                rotPeriod: '243 Earth days (retrograde)',
                tiltInfo: '177.36° – upside-down'
            },

            earth: {
                name: 'Earth',

                // Real radius: 6 371 km.  Artistic: 1.2 – baseline reference,
                // slightly above 1.0 so the cloud-wrapped sphere looks substantial.
                radius: 1.2,

                semiMajorAxis: 1.000,    // 1 AU by definition
                eccentricity: 0.0167,
                inclination: 0.0,        // ecliptic reference plane
                lonAscNode: 0.0,

                axialTilt: 23.44,        // the tilt that gives us seasons
                rotDir: 1,
                rotSpeed: 0.02,

                omegaRatio: 1.0000,

                // Nitrogen / oxygen atmosphere – pale blue glow.
                hasAtmosphere: true,
                atmoColor: 0x88bbff,
                atmoOpacity: 0.25,

                hasRings: false,

                color: '#4488dd',
                description: 'Our home world.  Its 23.4° axial tilt creates the familiar cycle of seasons.  The only known planet with liquid surface water and life.',
                distance: '149.6 million km (1.0 AU)',
                diameter: '12 756 km',
                orbitPeriod: '365.25 days',
                rotPeriod: '23 h 56 min',
                tiltInfo: '23.44° – causes seasons'
            },

            mars: {
                name: 'Mars',

                // Real radius: 3 390 km (0.53× Earth).
                // Artistic: 0.8 – enlarged so the Red Planet is comfortably
                // visible next to Earth.
                radius: 0.8,

                semiMajorAxis: 1.524,
                eccentricity: 0.0934,
                inclination: 1.848,
                lonAscNode: 49.558,

                axialTilt: 25.19,        // similar to Earth → has seasons
                rotDir: 1,
                rotSpeed: 0.019,         // ~24.6 h rotation – almost Earth-like

                omegaRatio: 0.5317,

                // Thin CO₂ atmosphere – dusty orange-pink.
                hasAtmosphere: true,
                atmoColor: 0xdd8866,
                atmoOpacity: 0.12,       // thin atmosphere → low opacity

                hasRings: false,

                color: '#c25a3c',
                description: 'The Red Planet has seasons similar to Earth thanks to its 25.2° tilt, though each season lasts nearly twice as long.  Its thin atmosphere is mostly CO₂.',
                distance: '227.9 million km (1.524 AU)',
                diameter: '6 792 km',
                orbitPeriod: '687 Earth days',
                rotPeriod: '24 h 37 min',
                tiltInfo: '25.19° – Earth-like seasons'
            },

            jupiter: {
                name: 'Jupiter',

                // Real radius: 69 911 km (11.2× Earth).
                // Artistic: 4.5 – dramatically shrunk from 11.2× to keep the
                // inner planets visible, but still the largest sphere on screen.
                radius: 4.5,

                // Real semi-major axis: 5.203 AU.
                // Artistic: 4.8 AU – pulled slightly inward to reduce the
                // visual gap between Mars and Jupiter (the asteroid belt void).
                semiMajorAxis: 4.8,
                eccentricity: 0.0489,
                inclination: 1.303,
                lonAscNode: 100.464,

                axialTilt: 3.13,         // almost upright – very mild seasons
                rotDir: 1,
                rotSpeed: 0.045,         // 9.9 h – fastest rotation in the SS

                omegaRatio: 0.08432,

                // Thick H₂/He atmosphere with ammonia clouds – warm gold.
                hasAtmosphere: true,
                atmoColor: 0xeecc66,
                atmoOpacity: 0.20,

                hasRings: true,
                ringInner: 5.5,
                ringOuter: 8.0,
                ringOpacity: 0.12,       // Jupiter's ring is very faint

                color: '#c88b3a',
                description: 'The solar system\'s giant.  Despite being 11× Earth\'s diameter it spins in just 9.9 hours, the fastest rotation of any planet.  Its faint ring was discovered by Voyager 1.',
                distance: '778.5 million km (5.203 AU)',
                diameter: '142 984 km',
                orbitPeriod: '11.86 Earth years',
                rotPeriod: '9 h 56 min',
                tiltInfo: '3.13° – nearly upright'
            },

            saturn: {
                name: 'Saturn',

                // Real radius: 58 232 km (9.45× Earth).
                // Artistic: 3.8 – shrunk similarly to Jupiter; still the
                // second-largest body in the scene.
                radius: 3.8,

                // Real semi-major axis: 9.537 AU.
                // Artistic: 7.8 AU – compressed to keep the whole system
                // visible without extreme zoom-out.
                semiMajorAxis: 7.8,
                eccentricity: 0.0565,
                inclination: 2.489,
                lonAscNode: 113.665,

                axialTilt: 26.73,        // tilted rings put on a great show
                rotDir: 1,
                rotSpeed: 0.042,         // 10.7 h rotation

                omegaRatio: 0.03394,

                // H₂/He atmosphere – pale yellow.
                hasAtmosphere: true,
                atmoColor: 0xf0e0a0,
                atmoOpacity: 0.18,

                hasRings: true,
                ringInner: 5.0,
                ringOuter: 10.5,
                ringOpacity: 0.75,       // Saturn's iconic bright rings

                color: '#e8d48b',
                description: 'Famous for its spectacular ring system, which is made mostly of ice particles.  The 26.7° tilt means the ring orientation changes dramatically over its 29-year orbit.',
                distance: '1.43 billion km (9.537 AU)',
                diameter: '120 536 km',
                orbitPeriod: '29.46 Earth years',
                rotPeriod: '10 h 42 min',
                tiltInfo: '26.73°'
            },

            uranus: {
                name: 'Uranus',

                // Real radius: 25 362 km (4.0× Earth).
                // Artistic: 2.2 – slightly reduced so it doesn't rival
                // Jupiter/Saturn on screen, preserving visual hierarchy.
                radius: 2.2,

                // Real semi-major axis: 19.189 AU.
                // Artistic: 10.6 AU – heavily compressed; at true scale
                // Uranus would be off-screen for most camera distances.
                semiMajorAxis: 10.6,
                eccentricity: 0.0463,
                inclination: 0.773,
                lonAscNode: 74.006,

                axialTilt: 97.77,        // rotates nearly on its SIDE
                rotDir: -1,              // classified retrograde due to >90° tilt
                rotSpeed: 0.028,         // 17.2 h rotation

                omegaRatio: 0.01190,

                // H₂/He/methane atmosphere – cyan / aqua hue from methane.
                hasAtmosphere: true,
                atmoColor: 0x80eeee,
                atmoOpacity: 0.22,

                hasRings: true,
                ringInner: 3.0,
                ringOuter: 4.8,
                ringOpacity: 0.15,       // faint dark rings

                color: '#70d6d0',
                description: 'Uranus rolls around the Sun almost on its side (97.8° tilt).  Each pole gets 42 continuous years of sunlight then 42 years of darkness.  Its blue-green colour comes from methane in the atmosphere.',
                distance: '2.87 billion km (19.19 AU)',
                diameter: '51 118 km',
                orbitPeriod: '84 Earth years',
                rotPeriod: '17 h 14 min (retrograde)',
                tiltInfo: '97.77° – rotates on its side'
            },

            neptune: {
                name: 'Neptune',

                // Real radius: 24 622 km (3.88× Earth).
                // Artistic: 2.1 – similar to Uranus; the two ice giants
                // appear close in size, matching reality.
                radius: 2.1,

                // Real semi-major axis: 30.07 AU.
                // Artistic: 13.4 AU – compressed to fit within the scene's
                // comfortable zoom range while still being the outermost planet.
                semiMajorAxis: 13.4,
                eccentricity: 0.0095,    // nearly circular orbit
                inclination: 1.770,
                lonAscNode: 131.784,

                axialTilt: 28.32,        // Earth-like tilt, but 40-year seasons
                rotDir: 1,
                rotSpeed: 0.03,          // 16.1 h rotation

                omegaRatio: 0.006069,

                // H₂/He/methane atmosphere – deep vivid blue.
                hasAtmosphere: true,
                atmoColor: 0x4466dd,
                atmoOpacity: 0.28,

                hasRings: true,
                ringInner: 3.0,
                ringOuter: 4.2,
                ringOpacity: 0.10,       // extremely faint rings

                color: '#3355cc',
                description: 'The most distant planet.  Despite an Earth-like 28.3° tilt, seasons last over 40 years each.  Neptune has the fastest winds in the solar system – up to 2 100 km/h.',
                distance: '4.50 billion km (30.07 AU)',
                diameter: '49 528 km',
                orbitPeriod: '165 Earth years',
                rotPeriod: '16 h 6 min',
                tiltInfo: '28.32° – 40-year seasons'
            }
        };
    }

    // ═════════════════════════════════════════════════════════════════════
    //  BOOT
    // ═════════════════════════════════════════════════════════════════════
    boot() {
        this._initRenderer();
        this._loadTextures(() => {
            this._buildSun();
            this._buildPlanets();
            this._setupLights();
            this._bindUI();
            this._bindCamera();
            this._tick();

            // Dismiss loader
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
                setTimeout(() => document.getElementById('welcome').classList.add('show'), 600);
            }, 1800);
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    //  RENDERER & SCENE
    // ═════════════════════════════════════════════════════════════════════
    _initRenderer() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            8000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.getElementById('scene-container').appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    //  TEXTURE LOADER
    // ═════════════════════════════════════════════════════════════════════
    _loadTextures(onReady) {
        const loader = new THREE.TextureLoader();
        const names  = ['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
        let loaded   = 0;

        names.forEach(n => {
            loader.load(
                `./${n}-texture.jpg`,
                tex => {
                    tex.wrapS = THREE.RepeatWrapping;
                    tex.wrapT = THREE.ClampToEdgeWrapping;
                    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                    this.textures[n] = tex;
                    if (++loaded === names.length) onReady();
                },
                undefined,
                () => {
                    console.warn(`Texture ${n}-texture.jpg not found – using fallback`);
                    this.textures[n] = null;
                    if (++loaded === names.length) onReady();
                }
            );
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    //  SUN
    // ═════════════════════════════════════════════════════════════════════
    _buildSun() {
        // Real Sun radius ≈ 696 000 km (109× Earth).
        // Artistic: 10 scene-units – small enough not to swallow Mercury's
        // orbit, large enough to be an imposing golden sphere.
        const R = 10;
        const geo = new THREE.SphereGeometry(R, 64, 64);
        const mat = new THREE.MeshBasicMaterial({
            map: this.textures.sun,
            color: this.textures.sun ? 0xffffff : 0xffcc00
        });
        this.sunMesh = new THREE.Mesh(geo, mat);
        this.scene.add(this.sunMesh);

        // ── Glow layers ──
        // Three concentric translucent spheres simulate coronal glow.
        [
            { r: R * 1.08, o: 0.38, c: 0xffaa00 },
            { r: R * 1.18, o: 0.18, c: 0xff7700 },
            { r: R * 1.30, o: 0.08, c: 0xff4400 }
        ].forEach(g => {
            const gm = new THREE.SphereGeometry(g.r, 32, 32);
            const gmat = new THREE.MeshBasicMaterial({
                color: g.c, transparent: true, opacity: g.o
            });
            this.sunMesh.add(new THREE.Mesh(gm, gmat));
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    //  PLANETS
    // ═════════════════════════════════════════════════════════════════════
    _buildPlanets() {
        const seg = 48; // sphere segments – good balance of quality vs perf

        Object.entries(this.planetData).forEach(([key, d]) => {
            // ── Group hierarchy ──
            // planetGroup  → positioned at orbital location each frame
            //   └─ tiltPivot  → rotated by axialTilt around Z
            //       ├─ planetMesh
            //       ├─ atmosphere (if any)
            //       └─ rings (if any)
            //   └─ label sprite

            const group     = new THREE.Group();
            const tiltPivot = new THREE.Group();

            // Planet mesh
            const geo  = new THREE.SphereGeometry(d.radius, seg, seg);
            const mat  = new THREE.MeshStandardMaterial({
                map: this.textures[key],
                color: this.textures[key] ? 0xffffff : d.color,
                roughness: 0.85,
                metalness: 0.05
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            tiltPivot.add(mesh);

            // ── Axial tilt ──
            // Applied as a Z-rotation on the tiltPivot so the planet's
            // north pole leans at the correct angle.
            tiltPivot.rotation.z = d.axialTilt * Math.PI / 180;

            // ── Atmosphere shell ──
            let atmo = null;
            if (d.hasAtmosphere) {
                atmo = this._makeAtmosphere(d);
                tiltPivot.add(atmo);
            }

            // ── Rings ──
            if (d.hasRings) {
                const ring = this._makeRings(d);
                tiltPivot.add(ring);
            }

            group.add(tiltPivot);

            // ── Label ──
            const label = this._makeLabel(d.name);
            label.position.y = d.radius + 2.5;
            group.add(label);

            // Random initial true-anomaly so planets don't all start aligned
            const startAngle = Math.random() * Math.PI * 2;

            // Store everything we need per frame
            const entry = {
                key, group, mesh, tiltPivot, atmo, label,
                data: d,
                trueAnomaly: startAngle
            };
            this.planetObjects.push(entry);

            // Position the group at its initial orbital location
            const pos = this._orbitPosition(d, startAngle);
            group.position.copy(pos);
            this.scene.add(group);

            // Draw the elliptical orbit path
            this._drawOrbit(d);
        });
    }

    // ─── Atmosphere helper ───────────────────────────────────────────────
    /**
     * Creates a translucent sphere slightly larger than the planet,
     * rendered on THREE.BackSide so it glows around the edges.
     */
    _makeAtmosphere(d) {
        // Atmosphere radius is 8 % larger than the planet body.
        const geo = new THREE.SphereGeometry(d.radius * 1.08, 40, 40);
        const mat = new THREE.MeshBasicMaterial({
            color: d.atmoColor,
            transparent: true,
            opacity: d.atmoOpacity,
            side: THREE.BackSide      // only inner face visible → rim glow
        });
        const m = new THREE.Mesh(geo, mat);
        m.userData.isAtmosphere = true;
        return m;
    }

    // ─── Ring helper ─────────────────────────────────────────────────────
    _makeRings(d) {
        const geo = new THREE.RingGeometry(d.ringInner, d.ringOuter, 96);

        // Procedurally-generated ring texture (canvas gradient)
        const cvs = document.createElement('canvas');
        cvs.width = 512; cvs.height = 64;
        const ctx = cvs.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 512, 0);
        grad.addColorStop(0,    'rgba(200,190,170, 0.05)');
        grad.addColorStop(0.15, 'rgba(190,170,140, 0.85)');
        grad.addColorStop(0.35, 'rgba(170,150,120, 0.55)');
        grad.addColorStop(0.55, 'rgba(180,165,135, 0.80)');
        grad.addColorStop(0.80, 'rgba(170,150,120, 0.60)');
        grad.addColorStop(1,    'rgba(200,190,170, 0.05)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 64);

        // Fine grain lines for ring gaps (like Cassini division)
        for (let i = 0; i < 120; i++) {
            ctx.fillStyle = `rgba(60,50,40,${Math.random() * 0.35})`;
            ctx.fillRect(Math.random() * 512, 0, 1, 64);
        }

        const tex = new THREE.CanvasTexture(cvs);

        // Fix UV mapping to radial distance
        const pos = geo.attributes.position;
        const uv  = geo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i), y = pos.getY(i);
            const dist = Math.sqrt(x * x + y * y);
            uv.setXY(i, (dist - d.ringInner) / (d.ringOuter - d.ringInner), 0.5);
        }

        const mat = new THREE.MeshBasicMaterial({
            map: tex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: d.ringOpacity
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.x = Math.PI / 2;  // lie flat relative to planet equator
        return ring;
    }

    // ─── Label sprite ────────────────────────────────────────────────────
    _makeLabel(text) {
        const cvs = document.createElement('canvas');
        cvs.width = 256; cvs.height = 64;
        const ctx = cvs.getContext('2d');

        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.roundRect?.(8, 8, 240, 48, 12);
        ctx.fill?.() || ctx.fillRect(0, 0, 256, 64);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 32);

        const tex = new THREE.CanvasTexture(cvs);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const spr = new THREE.Sprite(mat);
        spr.scale.set(5, 1.25, 1);
        spr.userData.isLabel = true;
        return spr;
    }

    // ═════════════════════════════════════════════════════════════════════
    //  ORBITAL MECHANICS
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Compute 3-D position on an elliptical orbit.
     *
     * Uses the polar equation of an ellipse with one focus at the origin:
     *     r = a(1 − e²) / (1 + e·cos θ)
     *
     * Then rotates from the orbital plane into ecliptic coordinates using
     *   Ω  – longitude of ascending node  (rotation about Y / ecliptic pole)
     *   i  – inclination                   (tilt of orbital plane)
     */
    _orbitPosition(d, theta) {
        const a = d.semiMajorAxis * this.AU_SCALE;
        const e = d.eccentricity;

        // Radial distance from Sun (focus) at true anomaly θ
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));

        // Position in the flat orbital plane
        const xFlat = r * Math.cos(theta);
        const yFlat = r * Math.sin(theta);

        // Convert angles to radians
        const i     = (d.inclination || 0) * Math.PI / 180;
        const omega = (d.lonAscNode  || 0) * Math.PI / 180;

        const cO = Math.cos(omega), sO = Math.sin(omega);
        const cI = Math.cos(i),     sI = Math.sin(i);

        // Standard 3-D orbital-plane → ecliptic rotation
        // XZ = ecliptic plane, Y = ecliptic north
        const x =  cO * xFlat - sO * cI * yFlat;
        const z =  sO * xFlat + cO * cI * yFlat;
        const y =  sI * yFlat;

        return new THREE.Vector3(x, y, z);
    }

    // ─── Orbit line ──────────────────────────────────────────────────────
    _drawOrbit(d) {
        const pts = [];
        const N   = 256;
        for (let i = 0; i <= N; i++) {
            pts.push(this._orbitPosition(d, (i / N) * Math.PI * 2));
        }
        const geo  = new THREE.BufferGeometry().setFromPoints(pts);
        const mat  = new THREE.LineBasicMaterial({
            color: 0x556688, transparent: true, opacity: 0.35
        });
        const line = new THREE.Line(geo, mat);
        line.userData.isOrbit = true;
        this.orbitLines.push(line);
        this.scene.add(line);
    }

    // ═════════════════════════════════════════════════════════════════════
    //  LIGHTING
    // ═════════════════════════════════════════════════════════════════════
    _setupLights() {
        // Very dim ambient so the dark side of planets isn't pure black
        this.scene.add(new THREE.AmbientLight(0x303040, 0.25));

        // Point light at the Sun – illuminates all planets from the centre
        const sun = new THREE.PointLight(0xffffff, 1.8, 3000, 1);
        sun.position.set(0, 0, 0);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        this.scene.add(sun);

        // Faint blue fill light from "behind" so silhouettes aren't invisible
        const fill = new THREE.DirectionalLight(0x334466, 0.12);
        fill.position.set(-200, 80, -100);
        this.scene.add(fill);
    }

    // ═════════════════════════════════════════════════════════════════════
    //  CAMERA   (manual spherical orbit around a target point)
    // ═════════════════════════════════════════════════════════════════════
    _bindCamera() {
        const el = this.renderer.domElement;

        // ── Mouse ──
        el.addEventListener('mousedown', e => {
            this.cam.dragging = true;
            this.cam.lastX = e.clientX;
            this.cam.lastY = e.clientY;
            this.animating = false;
        });
        el.addEventListener('mousemove', e => {
            if (!this.cam.dragging) return;
            this.cam.theta += (e.clientX - this.cam.lastX) * 0.008;
            this.cam.phi   += (e.clientY - this.cam.lastY) * 0.008;
            this.cam.phi    = Math.max(-Math.PI/2 + 0.05, Math.min(Math.PI/2 - 0.05, this.cam.phi));
            this.cam.lastX  = e.clientX;
            this.cam.lastY  = e.clientY;
        });
        el.addEventListener('mouseup',    () => this.cam.dragging = false);
        el.addEventListener('mouseleave', () => this.cam.dragging = false);

        // ── Scroll wheel ──
        el.addEventListener('wheel', e => {
            e.preventDefault();
            this.animating = false;
            this.cam.distance *= 1 + e.deltaY * 0.001;
            this.cam.distance  = Math.max(8, Math.min(3000, this.cam.distance));
        }, { passive: false });

        // ── Touch ──
        let t0x = 0, t0y = 0;
        el.addEventListener('touchstart', e => {
            if (e.target !== el) return;
            e.preventDefault();
            this.animating = false;
            if (e.touches.length === 1) {
                this.cam.dragging = true;
                t0x = e.touches[0].clientX;
                t0y = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                this.cam.pinchDist = this._pinch(e);
            }
        }, { passive: false });

        el.addEventListener('touchmove', e => {
            if (e.target !== el) return;
            e.preventDefault();
            if (e.touches.length === 1 && this.cam.dragging) {
                const dx = e.touches[0].clientX - t0x;
                const dy = e.touches[0].clientY - t0y;
                this.cam.theta += dx * 0.008;
                this.cam.phi   += dy * 0.008;
                this.cam.phi    = Math.max(-Math.PI/2 + 0.05, Math.min(Math.PI/2 - 0.05, this.cam.phi));
                t0x = e.touches[0].clientX;
                t0y = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const d = this._pinch(e);
                if (this.cam.pinchDist > 0) {
                    this.cam.distance *= this.cam.pinchDist / d;
                    this.cam.distance  = Math.max(8, Math.min(3000, this.cam.distance));
                }
                this.cam.pinchDist = d;
            }
        }, { passive: false });

        el.addEventListener('touchend', e => {
            if (e.target !== el) return;
            e.preventDefault();
            this.cam.dragging  = false;
            this.cam.pinchDist = 0;
        }, { passive: false });

        // ── Click / tap to select planet ──
        el.addEventListener('click', e => this._pickPlanet(e.clientX, e.clientY));
    }

    _pinch(e) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // ═════════════════════════════════════════════════════════════════════
    //  RAY-PICK  (planet selection via click / tap)
    // ═════════════════════════════════════════════════════════════════════
    _pickPlanet(sx, sy) {
        const mouse = new THREE.Vector2(
            (sx / window.innerWidth)  *  2 - 1,
           -(sy / window.innerHeight) *  2 + 1
        );
        const ray = new THREE.Raycaster();
        ray.setFromCamera(mouse, this.camera);

        const meshes = this.planetObjects.map(p => p.mesh);
        const hits   = ray.intersectObjects(meshes);
        if (hits.length) {
            const entry = this.planetObjects.find(p => p.mesh === hits[0].object);
            if (entry) this._selectPlanet(entry);
        }
    }

    // ═════════════════════════════════════════════════════════════════════
    //  UI BINDINGS
    // ═════════════════════════════════════════════════════════════════════
    _bindUI() {
        const $ = id => document.getElementById(id);

        // Welcome
        $('btn-start').addEventListener('click', () =>
            $('welcome').classList.remove('show'));

        // ── Drawer ──
        const drawer = $('drawer');
        $('fab-menu').addEventListener('click', e => {
            e.stopPropagation();
            drawer.classList.toggle('open');
            $('speed-bar').classList.remove('open');
        });
        document.querySelectorAll('.drawer-item').forEach(item => {
            item.addEventListener('click', () => {
                const key = item.dataset.key;
                const entry = this.planetObjects.find(p => p.key === key);
                if (entry) this._selectPlanet(entry);
                drawer.classList.remove('open');
            });
        });

        // ── Info sheet ──
        $('fab-info').addEventListener('click', e => {
            e.stopPropagation();
            $('info-sheet').classList.toggle('open');
        });

        // ── Home / reset ──
        $('fab-home').addEventListener('click', e => {
            e.stopPropagation();
            this._resetView();
        });

        // ── Zoom ──
        $('fab-zin').addEventListener('click', e => {
            e.stopPropagation();
            this.animating = false;
            this.cam.distance *= 0.75;
            this.cam.distance = Math.max(8, this.cam.distance);
        });
        $('fab-zout').addEventListener('click', e => {
            e.stopPropagation();
            this.cam.distance *= 1.35;
            this.cam.distance = Math.min(3000, this.cam.distance);
        });

        // ── Speed bar ──
        $('fab-speed').addEventListener('click', e => {
            e.stopPropagation();
            $('speed-bar').classList.toggle('open');
            drawer.classList.remove('open');
        });
        $('close-speed').addEventListener('click', () =>
            $('speed-bar').classList.remove('open'));
        $('speed-slider').addEventListener('input', e => {
            this.speed = parseFloat(e.target.value);
            $('speed-val').textContent = this.speed.toFixed(1) + '×';
        });

        // Close panels on outside tap
        document.addEventListener('click', e => {
            if (!e.target.closest('.planet-drawer') && !e.target.closest('#fab-menu'))
                drawer.classList.remove('open');
            if (!e.target.closest('.speed-bar') && !e.target.closest('#fab-speed'))
                $('speed-bar').classList.remove('open');
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    //  SELECT / FOCUS PLANET
    // ═════════════════════════════════════════════════════════════════════
    _selectPlanet(entry) {
        this.focusedPlanet = entry;

        // Highlight drawer item
        document.querySelectorAll('.drawer-item').forEach(el => {
            el.classList.toggle('active', el.dataset.key === entry.key);
        });

        // Fill info sheet
        const d = entry.data;
        const t = id => document.getElementById(id);
        t('info-name').textContent = d.name;
        t('info-desc').textContent = d.description;
        t('info-dist').textContent = d.distance;
        t('info-diam').textContent = d.diameter;
        t('info-orbit').textContent = d.orbitPeriod;
        t('info-rot').textContent  = d.rotPeriod;
        t('info-tilt').textContent = d.tiltInfo;

        // Show info FAB
        document.getElementById('fab-info').style.display = 'flex';
        // Hide info sheet (user opens with fab)
        document.getElementById('info-sheet').classList.remove('open');

        // Animate camera toward planet
        this._flyTo(entry);
    }

    _flyTo(entry) {
        const d = entry.data;
        const fov = this.camera.fov * Math.PI / 180;

        // Determine a comfortable viewing distance that fits the planet
        // (and its rings, if prominent) in the viewport.
        const hasVisibleRings = d.hasRings && d.ringOpacity >= 0.4;
        const extent = hasVisibleRings ? Math.max(d.ringOuter, d.radius) : d.radius;
        const idealDist = Math.max((extent / Math.tan(fov / 2)) * 1.6, 14);

        const targetDist = idealDist;
        this.animating = true;
        this.animId++;
        const myId = this.animId;

        const step = () => {
            if (this.animId !== myId) return;
            this.cam.distance += (targetDist - this.cam.distance) * 0.12;
            if (Math.abs(this.cam.distance - targetDist) < 0.3) {
                this.cam.distance = targetDist;
                this.animating = false;
            } else {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    _resetView() {
        this.focusedPlanet = null;
        document.getElementById('fab-info').style.display = 'none';
        document.getElementById('info-sheet').classList.remove('open');
        document.querySelectorAll('.drawer-item').forEach(el => el.classList.remove('active'));

        this.cam.target.set(0, 0, 0);

        const tgtDist  = 120;
        const tgtTheta = -0.15;
        const tgtPhi   = 0.40;

        this.animating = true;
        this.animId++;
        const myId = this.animId;

        const step = () => {
            if (this.animId !== myId) return;
            this.cam.distance += (tgtDist  - this.cam.distance) * 0.10;
            this.cam.theta    += (tgtTheta - this.cam.theta)    * 0.10;
            this.cam.phi      += (tgtPhi   - this.cam.phi)      * 0.10;
            if (Math.abs(this.cam.distance - tgtDist) > 0.5) {
                requestAnimationFrame(step);
            } else {
                this.animating = false;
            }
        };
        requestAnimationFrame(step);
    }

    // ═════════════════════════════════════════════════════════════════════
    //  ANIMATION LOOP
    // ═════════════════════════════════════════════════════════════════════
    _tick() {
        requestAnimationFrame(() => this._tick());

        // ── Update orbits & rotations ──
        if (!this.paused) {
            this.planetObjects.forEach(p => {
                // Advance true anomaly (orbital position).
                // The angular step is BASE_ORBIT_SPEED × ωRatio × user speed.
                // Because ωRatio is strictly derived from real orbital periods,
                // relative speeds are astronomically accurate.
                p.trueAnomaly -= this.BASE_ORBIT_SPEED * p.data.omegaRatio * this.speed;

                // Recompute 3-D position on the elliptical orbit
                p.group.position.copy(this._orbitPosition(p.data, p.trueAnomaly));

                // Spin planet on its axis.
                // rotDir is +1 (prograde) or -1 (retrograde, e.g. Venus / Uranus).
                p.mesh.rotation.y += p.data.rotSpeed * p.data.rotDir * this.speed;
            });

            // Slow Sun rotation (differential rotation ~25 days at equator)
            if (this.sunMesh) this.sunMesh.rotation.y += 0.001 * this.speed;
        }

        // ── Camera target follows focused planet ──
        if (this.focusedPlanet) {
            const target = this.focusedPlanet.group.position;
            this.cam.target.lerp(target, 0.12);
        }

        // ── Auto-rotate camera when idle ──
        if (this.autoRotate && !this.cam.dragging) {
            this.cam.theta += 0.0015;
        }

        // ── Place camera on spherical shell around target ──
        const d   = this.cam.distance;
        const th  = this.cam.theta;
        const ph  = this.cam.phi;
        const tgt = this.cam.target;

        this.camera.position.set(
            tgt.x + Math.cos(th) * Math.cos(ph) * d,
            tgt.y + Math.sin(ph) * d,
            tgt.z + Math.sin(th) * Math.cos(ph) * d
        );
        this.camera.lookAt(tgt);

        this.renderer.render(this.scene, this.camera);
    }
}
