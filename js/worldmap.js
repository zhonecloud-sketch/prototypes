// Experience: dotted world map with work locations (amber), customer
// locations (cyan) and pulsing signal arcs between them. One instance is
// shared by all jobs; setJob() re-targets it and the camera flies over.
import * as THREE from '../lib/three.module.js';
import { clamp, damp, easeOutBack, easeOutCubic } from './util.js';

const DEG = 0.1;                       // world units per degree
const PITCH = THREE.MathUtils.degToRad(24);
const NEAR_DEG = 0.6;                  // customer within this many degrees of a work site = same place
const INSET_TOP = 66, INSET_BOTTOM = 30; // px covered by the title / legend overlays
const LABEL_GAP = 12;                  // px between a marker centre and its label edge

const LAND_VERT = /* glsl */`
  uniform float uWorldSize; uniform float uProjScale; uniform vec2 uCenter; uniform float uRadius;
  varying float vDim;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.2, uWorldSize * uProjScale / -mv.z);
    float d = distance(position.xy, uCenter) / uRadius;
    vDim = 1.0 - 0.6 * smoothstep(0.75, 1.7, d);
    gl_Position = projectionMatrix * mv;
  }`;
const LAND_FRAG = /* glsl */`
  uniform vec3 uColor; uniform float uOpacity; varying float vDim;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.7, 1.0, r);
    gl_FragColor = vec4(uColor, a * uOpacity * vDim);
    #include <colorspace_fragment>
  }`;

const ARC_VERT = /* glsl */`
  attribute float aT; attribute float aArc;
  uniform float uTime; uniform float uReveal; uniform float uHighlight; uniform float uPixelRatio; uniform float uPulse;
  varying float vA; varying float vHi;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float hi = abs(aArc - uHighlight) < 0.5 ? 1.0 : 0.0;
    float d = fract(aT - uTime * 0.26 + aArc * 0.173);
    float pulse = exp(-d * d * 90.0) * uPulse;
    float shown = step(aT, clamp(uReveal * 1.25 - aArc * 0.03, 0.0, 1.0));
    vA = shown * (0.3 + 0.4 * hi + pulse * (0.7 + 0.6 * hi));
    vHi = hi;
    gl_PointSize = (2.1 + 1.4 * hi + pulse * 3.2) * uPixelRatio;
    gl_Position = projectionMatrix * mv;
  }`;
const ARC_FRAG = /* glsl */`
  uniform vec3 uColor; varying float vA; varying float vHi;
  void main() {
    if (vA <= 0.002) discard;
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.45, 1.0, r);
    gl_FragColor = vec4(mix(uColor, vec3(1.0), vHi * 0.45), a * vA);
    #include <colorspace_fragment>
  }`;

const MARK_VERT = /* glsl */`
  attribute float aKind; attribute float aIndex;
  uniform float uPixelRatio; uniform float uAppear; uniform float uHighlight; uniform float uTime;
  varying float vKind; varying float vHi;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float hi = (aKind > 0.5 && abs(aIndex - uHighlight) < 0.5) ? 1.0 : 0.0;
    float base = aKind < 0.5 ? 19.0 : (aKind < 1.5 ? 10.5 : 24.0);
    float beat = hi > 0.5 ? 0.12 * sin(uTime * 5.0) : 0.0;
    gl_PointSize = base * uAppear * (1.0 + 0.4 * hi + beat) * uPixelRatio;
    vKind = aKind; vHi = hi;
    gl_Position = projectionMatrix * mv;
  }`;
const MARK_FRAG = /* glsl */`
  uniform vec3 uWork; uniform vec3 uCust;
  varying float vKind; varying float vHi;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a;
    if (vKind > 1.5) {
      a = smoothstep(0.6, 0.7, r) * (1.0 - smoothstep(0.82, 0.95, r)) * (0.75 + 0.25 * vHi);
    } else {
      float core = 1.0 - smoothstep(0.28, 0.46, r);
      float halo = 1.0 - r; halo *= halo * 0.5;
      a = core + halo;
    }
    vec3 c = mix(vKind < 0.5 ? uWork : uCust, vec3(1.0), vHi * 0.35);
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }`;

function decodeMask(mask) {
  const { width: W, height: H } = mask;
  const bin = atob(mask.data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const land = (i, j) => { const k = i * W + j; return (bytes[k >> 3] >> (k & 7)) & 1; };
  const fine = [], coarse = [];
  for (let i = 0; i < H; i++) for (let j = 0; j < W; j++) if (land(i, j)) {
    fine.push((-180 + j + 0.5) * DEG, (90 - i - 0.5) * DEG, 0);
  }
  for (let i = 0; i < H; i += 2) for (let j = 0; j < W; j += 2) {
    const c = land(i, j) + land(i + 1, j) + land(i, j + 1) + land(i + 1, j + 1);
    if (c >= 2) coarse.push((-180 + j + 1) * DEG, (90 - i - 1) * DEG, 0);
  }
  return { fine: new Float32Array(fine), coarse: new Float32Array(coarse) };
}

const hasCoords = (p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lon);

export function createWorldMap({ canvas, host, labelsEl, landmask, reduced = false, onHighlight }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const dpr = renderer.getPixelRatio();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  const AMBER = new THREE.Color('#ffb547');
  const CYAN = new THREE.Color('#37d1ff');

  // --- land dots (two densities, crossfaded by zoom level)
  const { fine, coarse } = decodeMask(landmask);
  const makeLand = (arr, cellDeg) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const m = new THREE.ShaderMaterial({
      vertexShader: LAND_VERT, fragmentShader: LAND_FRAG,
      uniforms: {
        uWorldSize: { value: cellDeg * DEG * 0.5 }, uProjScale: { value: 1 },
        uCenter: { value: new THREE.Vector2() }, uRadius: { value: 5 },
        uColor: { value: new THREE.Color('#4b6389') }, uOpacity: { value: 0 },
      },
      transparent: true, depthWrite: false,
    });
    const pts = new THREE.Points(g, m);
    scene.add(pts);
    return { pts, m };
  };
  const landFine = makeLand(fine, 1);
  const landCoarse = makeLand(coarse, 2);

  // --- per-job objects
  const jobGroup = new THREE.Group();
  scene.add(jobGroup);
  const ringGeo = new THREE.RingGeometry(0.91, 1, 64);
  let rings = [];          // { mesh, phase, period, maxR, base }
  let arcMat = null, linkMat = null, markMat = null;
  let labels = [];         // { el, lon, lat }
  let custLabel = null;    // { el, customers: [...] }
  let cycle = [];          // customer indices eligible for highlight cycling
  let highlightIdx = -1, cycleTimer = 0, holdTimer = 0;
  let appear = 0, reveal = 0, since = 0, bump = 0;
  let hasJob = false;

  // --- camera framing
  let W = 1, H = 1;
  const view = { cx: 0, cy: 0, d: 30, hWorld: 20 };
  const target = { cx: 0, cy: 0, d: 30, hWorld: 20 };
  let framePts = [];

  function computeFrame(pts) {
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    for (const p of pts) { minLon = Math.min(minLon, p.lon); maxLon = Math.max(maxLon, p.lon); minLat = Math.min(minLat, p.lat); maxLat = Math.max(maxLat, p.lat); }
    if (!pts.length) { minLon = -20; maxLon = 140; minLat = -35; maxLat = 60; }
    let w = maxLon - minLon, h = maxLat - minLat;
    const padLon = Math.max(6, w * 0.14), padLat = Math.max(5, h * 0.22);
    minLon -= padLon; maxLon += padLon; minLat -= padLat; maxLat += padLat;
    w = maxLon - minLon; h = maxLat - minLat;
    const MINW = 52, MINH = 30;
    let cx = (minLon + maxLon) / 2, cy = (minLat + maxLat) / 2;
    w = Math.max(w, MINW); h = Math.max(h, MINH);
    const aspect = W / H;
    const safeH = Math.max(80, H - INSET_TOP - INSET_BOTTOM);
    const hWorld = Math.max(h * DEG * (H / safeH), (w * DEG) / aspect) * 1.08;
    const d = ((hWorld / 2) / tanHalf) * 0.94;
    // Centre the box within the safe area: look-at sits north of the box centre
    // by half the overlay imbalance so the content appears below the title.
    const shift = ((INSET_TOP - INSET_BOTTOM) / 2) * (hWorld / H);
    return { cx: cx * DEG, cy: cy * DEG + shift, d, hWorld };
  }

  function reframe() {
    if (!hasJob) return;
    Object.assign(target, computeFrame(framePts));
    for (const r of rings) r.maxR = r.rel * target.hWorld;
  }

  function resize() {
    W = host.clientWidth || 1;
    H = host.clientHeight || 1;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    const projScale = (H * dpr) / (2 * tanHalf);
    landFine.m.uniforms.uProjScale.value = projScale;
    landCoarse.m.uniforms.uProjScale.value = projScale;
    reframe();
  }

  function clearJob() {
    for (const child of [...jobGroup.children]) {
      jobGroup.remove(child);
      child.geometry?.dispose();
      if (child.material && child.material !== null) child.material.dispose();
    }
    rings = []; arcMat = linkMat = markMat = null;
    labelsEl.replaceChildren();
    labels = []; custLabel = null; cycle = [];
  }

  function addRing(origin, rel, period, phase, color, base) {
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(ringGeo, mat);
    mesh.position.set(origin.lon * DEG, origin.lat * DEG, 0.01);
    jobGroup.add(mesh);
    rings.push({ mesh, rel, period, phase, base, maxR: rel * target.hWorld });
  }

  function dottedPath(points, tAttr, arcIdx, outPos, outT, outArc) {
    for (let i = 0; i < points.length; i++) {
      outPos.push(points[i].x, points[i].y, points[i].z);
      outT.push(tAttr ? i / (points.length - 1) : 0);
      outArc.push(arcIdx);
    }
  }

  function makeDots(pos, ts, arcs, color, pulse) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1));
    g.setAttribute('aArc', new THREE.Float32BufferAttribute(arcs, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: ARC_VERT, fragmentShader: ARC_FRAG,
      uniforms: {
        uTime: { value: 0 }, uReveal: { value: 0 }, uHighlight: { value: -1 }, uPixelRatio: { value: dpr },
        uPulse: { value: pulse }, uColor: { value: color },
      },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    jobGroup.add(new THREE.Points(g, m));
    return m;
  }

  function makeLabel(text, cls) {
    const el = document.createElement('span');
    el.className = `map-label ${cls} is-hidden`;
    el.textContent = text;
    labelsEl.append(el);
    return el;
  }

  function setJob(job) {
    clearJob();
    hasJob = true;
    const loc = job.locations || {};
    const works = (loc.work || []).filter(hasCoords);
    const customers = loc.customers || [];
    const origin = works.find((w) => w.link) || works[0] || null;
    const isNear = (c) => works.some((w) => Math.abs(w.lat - c.lat) < NEAR_DEG && Math.abs(w.lon - c.lon) < NEAR_DEG);

    framePts = [...works];
    const markPos = [], markKind = [], markIdx = [];
    const arcPos = [], arcT = [], arcIdx = [];
    let globalReach = false;

    for (const w of works) {
      markPos.push(w.lon * DEG, w.lat * DEG, 0.02); markKind.push(0); markIdx.push(-1);
      if (!reduced) { addRing(w, 0.075, 2.6, 0, AMBER, 0.55); addRing(w, 0.075, 2.6, 0.5, AMBER, 0.55); }
      labels.push({ el: makeLabel(w.name || `${w.city}, ${w.country}`, 'work'), lon: w.lon, lat: w.lat });
    }

    customers.forEach((c, i) => {
      if (hasCoords(c)) {
        framePts.push(c);
        const same = c.same || isNear(c);
        markPos.push(c.lon * DEG, c.lat * DEG, 0.025); markKind.push(same ? 2 : 1); markIdx.push(i);
        cycle.push(i);
        if (!same && origin) {
          const a = new THREE.Vector3(origin.lon * DEG, origin.lat * DEG, 0);
          const b = new THREE.Vector3(c.lon * DEG, c.lat * DEG, 0);
          const dist = a.distanceTo(b);
          const mid = a.clone().add(b).multiplyScalar(0.5).setZ(clamp(dist * 0.22, 0.12, 2.6));
          const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
          dottedPath(curve.getPoints(Math.round(clamp(dist * 7, 14, 110))), true, i, arcPos, arcT, arcIdx);
        }
      } else if (c.same && origin) {
        markPos.push(origin.lon * DEG, origin.lat * DEG, 0.025); markKind.push(2); markIdx.push(i);
      } else {
        globalReach = true;
      }
    });

    if (arcPos.length) arcMat = makeDots(arcPos, arcT, arcIdx, CYAN, 1);

    // dotted links between work sites
    const linkPos = [], linkT = [], linkArc = [];
    for (const w of works) {
      if (!w.link) continue;
      for (const o of works) {
        if (o === w) continue;
        const a = new THREE.Vector3(w.lon * DEG, w.lat * DEG, 0.01), b = new THREE.Vector3(o.lon * DEG, o.lat * DEG, 0.01);
        const n = Math.round(clamp(a.distanceTo(b) * 5, 10, 80));
        const pts = [];
        for (let k = 0; k <= n; k++) pts.push(a.clone().lerp(b, k / n));
        dottedPath(pts, true, 0, linkPos, linkT, linkArc);
      }
    }
    if (linkPos.length) linkMat = makeDots(linkPos, linkT, linkArc, AMBER, 0.35);

    if (globalReach && origin && !reduced) {
      for (let k = 0; k < 3; k++) addRing(origin, 0.55, 4.4, k / 3, CYAN, 0.26);
    }

    if (markPos.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(markPos, 3));
      g.setAttribute('aKind', new THREE.Float32BufferAttribute(markKind, 1));
      g.setAttribute('aIndex', new THREE.Float32BufferAttribute(markIdx, 1));
      markMat = new THREE.ShaderMaterial({
        vertexShader: MARK_VERT, fragmentShader: MARK_FRAG,
        uniforms: {
          uPixelRatio: { value: dpr }, uAppear: { value: 0 }, uHighlight: { value: -1 }, uTime: { value: 0 },
          uWork: { value: AMBER }, uCust: { value: CYAN },
        },
        transparent: true, depthWrite: false, depthTest: false,
      });
      jobGroup.add(new THREE.Points(g, markMat));
    }

    if (cycle.length) custLabel = { el: makeLabel('', 'cust'), customers };

    appear = 0; reveal = 0; since = 0; bump = 1;
    highlightIdx = -1; cycleTimer = 1.4; holdTimer = 0;
    onHighlight?.(-1);
    reframe();
    if (view.d === 30 && view.cx === 0 && view.cy === 0) Object.assign(view, target, { d: target.d * 1.6 });
  }

  function highlight(i, hold = 8) {
    highlightIdx = i;
    holdTimer = hold;
    cycleTimer = 2.6;
    onHighlight?.(i);
  }

  const v3 = new THREE.Vector3();
  const obstacles = [];    // screen rects already claimed this frame (labels, markers)
  const overlap = (a, b) => {
    const w = Math.min(a.r, b.r) - Math.max(a.l, b.l), h = Math.min(a.b, b.b) - Math.max(a.t, b.t);
    return w > 0 && h > 0 ? w * h : 0;
  };
  function toScreen(lon, lat) {
    v3.set(lon * DEG, lat * DEG, 0.03).project(camera);
    return { x: (v3.x * 0.5 + 0.5) * W, y: (-v3.y * 0.5 + 0.5) * H, z: v3.z };
  }
  // Try the preferred side first, then flip / go sideways; pick the candidate
  // that least overlaps other labels, markers and the title / legend strips.
  function placeLabel(el, lon, lat, prefer) {
    const { x, y, z } = toScreen(lon, lat);
    const inside = z < 1 && x > -30 && x < W + 30 && y > 40 && y < H + 10;
    el.classList.toggle('is-hidden', !inside);
    if (!inside) return;
    if (!el._w) { el._w = el.offsetWidth; el._h = el.offsetHeight; } // cached until the text changes
    const w = el._w, h = el._h;
    const up = { l: x - w / 2, t: y - LABEL_GAP - h }, down = { l: x - w / 2, t: y + LABEL_GAP };
    const right = { l: x + LABEL_GAP + 2, t: y - h / 2 }, left = { l: x - LABEL_GAP - 2 - w, t: y - h / 2 };
    const zones = [{ l: 0, t: -1e3, r: W, b: INSET_TOP - 4 }, { l: 0, t: H - INSET_BOTTOM + 4, r: W, b: H + 1e3 }];
    let best = null, bestCost = Infinity;
    for (const c of prefer === 'up' ? [up, down, right, left] : [down, up, right, left]) {
      c.l = clamp(c.l, 4, Math.max(4, W - w - 4)); c.r = c.l + w; c.b = c.t + h;
      let cost = 0;
      for (const o of obstacles) cost += overlap(c, o);
      for (const zn of zones) cost += overlap(c, zn) * 0.6;
      if (cost < bestCost) { bestCost = cost; best = c; if (!cost) break; }
    }
    obstacles.push(best);
    el.style.transform = `translate(${best.l.toFixed(1)}px, ${best.t.toFixed(1)}px)`;
  }

  function render(dt, t) {
    if (!hasJob) return;
    since += dt;
    bump *= Math.exp(-dt * 2.4);
    const k = damp(3.2, dt);
    view.cx += (target.cx - view.cx) * k;
    view.cy += (target.cy - view.cy) * k;
    view.d += (target.d - view.d) * k;
    view.hWorld += (target.hWorld - view.hWorld) * k;

    const d = view.d * (1 + 0.45 * bump);
    const drift = reduced ? 0 : Math.sin(t * 0.21) * 0.012 * d;
    camera.position.set(view.cx + drift, view.cy - d * Math.sin(PITCH), d * Math.cos(PITCH));
    camera.lookAt(view.cx, view.cy, 0);

    // land density crossfade + focus vignette
    const useCoarse = view.hWorld > 8.5;
    const kf = damp(4, dt);
    landFine.m.uniforms.uOpacity.value += ((useCoarse ? 0 : 0.95) - landFine.m.uniforms.uOpacity.value) * kf;
    landCoarse.m.uniforms.uOpacity.value += ((useCoarse ? 0.95 : 0) - landCoarse.m.uniforms.uOpacity.value) * kf;
    for (const L of [landFine, landCoarse]) {
      L.m.uniforms.uCenter.value.set(view.cx, view.cy);
      L.m.uniforms.uRadius.value = view.hWorld * 0.75 * Math.max(1, camera.aspect * 0.8);
    }

    // entrance: markers pop, arcs draw
    appear = clamp((since - 0.25) / 0.7, 0, 1);
    reveal = clamp((since - 0.45) / 1.4, 0, 1);
    const appearEased = easeOutBack(appear);
    if (markMat) {
      markMat.uniforms.uAppear.value = appearEased;
      markMat.uniforms.uTime.value = t;
      markMat.uniforms.uHighlight.value = highlightIdx;
    }
    if (arcMat) {
      arcMat.uniforms.uTime.value = t;
      arcMat.uniforms.uReveal.value = easeOutCubic(reveal);
      arcMat.uniforms.uHighlight.value = highlightIdx;
    }
    if (linkMat) {
      linkMat.uniforms.uTime.value = t;
      linkMat.uniforms.uReveal.value = easeOutCubic(reveal);
    }
    for (const r of rings) {
      const f = ((t / r.period) + r.phase) % 1;
      r.mesh.scale.setScalar(Math.max(0.001, r.maxR * (0.12 + 0.88 * f)));
      r.mesh.material.opacity = (1 - f) * (1 - f) * r.base * appear;
    }

    // highlight cycling through customers
    if (cycle.length) {
      if (holdTimer > 0) holdTimer -= dt;
      else {
        cycleTimer -= dt;
        if (cycleTimer <= 0) {
          cycleTimer = 2.6;
          const pos = cycle.indexOf(highlightIdx);
          highlightIdx = cycle[(pos + 1) % cycle.length];
          onHighlight?.(highlightIdx);
        }
      }
    }

    // DOM labels: markers are obstacles too, so sideways labels never cover one
    obstacles.length = 0;
    const hc = custLabel?.customers[highlightIdx];
    for (const p of hc && hasCoords(hc) ? [...labels, hc] : labels) {
      const s = toScreen(p.lon, p.lat);
      obstacles.push({ l: s.x - 10, t: s.y - 10, r: s.x + 10, b: s.y + 10 });
    }
    for (const L of labels) placeLabel(L.el, L.lon, L.lat, 'up');
    if (custLabel) {
      if (hc && hasCoords(hc) && appear > 0.6) {
        const text = hc.name || `${hc.city}, ${hc.country}`;
        if (custLabel.el.textContent !== text) { custLabel.el.textContent = text; custLabel.el._w = 0; }
        placeLabel(custLabel.el, hc.lon, hc.lat, 'down');
      } else custLabel.el.classList.add('is-hidden');
    }

    renderer.render(scene, camera);
  }

  return { resize, render, setJob, highlight, renderer };
}
