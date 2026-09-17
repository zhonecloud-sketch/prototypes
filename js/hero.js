// Hero: constellation of drifting nodes + proximity links.
// Nodes are kept out of an exclusion disc so the graph frames the photo.
import * as THREE from '../lib/three.module.js';
import { clamp, damp, mulberry32 } from './util.js';

const POINT_VERT = /* glsl */`
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uProjScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.72 + 0.28 * sin(uTime * 1.4 + aPhase);
    gl_PointSize = max(1.5, aSize * tw * uProjScale / -mv.z);
    vAlpha = 0.55 + 0.45 * tw;
    vColor = aColor;
    gl_Position = projectionMatrix * mv;
  }`;

const POINT_FRAG = /* glsl */`
  uniform float uFade;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float core = 1.0 - smoothstep(0.22, 0.55, r);
    float halo = 1.0 - r; halo *= halo * 0.32;
    gl_FragColor = vec4(vColor, (core + halo) * vAlpha * uFade);
    #include <colorspace_fragment>
  }`;

export function createHero({ canvas, host, photoEl, reduced = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  const group = new THREE.Group();
  scene.add(group);

  const cyan = new THREE.Color('#37d1ff');
  const white = new THREE.Color('#dff3ff');
  const amber = new THREE.Color('#ffb547');

  const DEPTH = 2.4;
  const LINK_DIST = 1.55;
  const MAX_LINKS_PER_NODE = 4;
  const MAX_SEGMENTS = 1200;
  const speedScale = reduced ? 0.15 : 1;

  let W = 1, H = 1, halfW = 5, halfH = 5, N = 0;
  let pos, vel, points, pointGeo, pointMat, lines, lineGeo, linePos, lineCol;
  const excl = { x: 0, y: 0, r: 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let fade = 1;
  let built = { w: 0, h: 0 };

  function disposeGraph() {
    if (points) { group.remove(points); pointGeo.dispose(); pointMat.dispose(); }
    if (lines) { group.remove(lines); lineGeo.dispose(); lines.material.dispose(); }
    points = lines = null;
  }

  function build() {
    disposeGraph();
    const rnd = mulberry32(1337);
    N = Math.round(clamp((W * H) / 2600, 90, 210));
    pos = new Float32Array(N * 3);
    vel = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const phase = new Float32Array(N);
    const colors = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (rnd() * 2 - 1) * halfW * 1.1;
      pos[i * 3 + 1] = (rnd() * 2 - 1) * halfH * 1.1;
      pos[i * 3 + 2] = (rnd() * 2 - 1) * DEPTH;
      const a = rnd() * Math.PI * 2, s = (0.06 + rnd() * 0.16) * speedScale;
      vel[i * 3] = Math.cos(a) * s;
      vel[i * 3 + 1] = Math.sin(a) * s;
      vel[i * 3 + 2] = (rnd() - 0.5) * 0.04 * speedScale;
      const hub = rnd() < 0.08;
      sizes[i] = hub ? 0.16 + rnd() * 0.06 : 0.05 + rnd() * 0.06;
      phase[i] = rnd() * Math.PI * 2;
      const c = hub ? amber : (rnd() < 0.55 ? cyan : white);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    pointGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    pointGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    pointGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    pointMat = new THREE.ShaderMaterial({
      vertexShader: POINT_VERT, fragmentShader: POINT_FRAG,
      uniforms: { uTime: { value: 0 }, uProjScale: { value: 1 }, uFade: { value: 1 } },
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    });
    points = new THREE.Points(pointGeo, pointMat);
    group.add(points);

    linePos = new Float32Array(MAX_SEGMENTS * 6);
    lineCol = new Float32Array(MAX_SEGMENTS * 6);
    lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setDrawRange(0, 0);
    lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    }));
    group.add(lines);
    built = { w: W, h: H };
  }

  function updateExclusion() {
    if (!photoEl) return;
    const hr = host.getBoundingClientRect();
    const pr = photoEl.getBoundingClientRect();
    if (!pr.width || !hr.width) return;
    const cx = (pr.left + pr.width / 2 - hr.left) / hr.width;
    const cy = (pr.top + pr.height / 2 - hr.top) / hr.height;
    excl.x = (cx - 0.5) * 2 * halfW;
    excl.y = -(cy - 0.5) * 2 * halfH;
    excl.r = (pr.width / hr.width) * halfW * 1.55;
  }

  function resize() {
    W = host.clientWidth || 1;
    H = host.clientHeight || 1;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    halfW = halfH * camera.aspect;
    updateExclusion();
    const grow = Math.abs(W - built.w) / (built.w || 1) > 0.15 || Math.abs(H - built.h) / (built.h || 1) > 0.15;
    if (!points || grow) build();
    if (pointMat) pointMat.uniforms.uProjScale.value = (H * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  }

  function step(dt) {
    const bx = halfW * 1.12, by = halfH * 1.12;
    const r2 = excl.r * excl.r;
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      let x = pos[k] + vel[k] * dt, y = pos[k + 1] + vel[k + 1] * dt, z = pos[k + 2] + vel[k + 2] * dt;
      if (x > bx) x = -bx; else if (x < -bx) x = bx;
      if (y > by) y = -by; else if (y < -by) y = by;
      if (z > DEPTH || z < -DEPTH) vel[k + 2] *= -1;
      // Push nodes gently out of the photo disc (z = 0 plane projection).
      const dx = x - excl.x, dy = y - excl.y, d2 = dx * dx + dy * dy;
      if (r2 > 0 && d2 < r2) {
        const d = Math.sqrt(d2) || 1e-4, f = (excl.r - d) / excl.r;
        const push = f * 2.2 * dt;
        x += (dx / d) * push; y += (dy / d) * push;
        vel[k] += (dx / d) * push * 0.8; vel[k + 1] += (dy / d) * push * 0.8;
      }
      // Keep speeds bounded so pushed nodes settle again.
      const sp = Math.hypot(vel[k], vel[k + 1]);
      const maxSp = 0.32 * speedScale + 0.02;
      if (sp > maxSp) { vel[k] *= maxSp / sp; vel[k + 1] *= maxSp / sp; }
      pos[k] = x; pos[k + 1] = y; pos[k + 2] = z;
    }
    pointGeo.attributes.position.needsUpdate = true;

    // Proximity links (O(N²) on ≤210 nodes is cheap).
    const linkCount = new Uint8Array(N);
    let seg = 0;
    const ld2 = LINK_DIST * LINK_DIST;
    outer: for (let i = 0; i < N; i++) {
      if (linkCount[i] >= MAX_LINKS_PER_NODE) continue;
      const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];
      for (let j = i + 1; j < N; j++) {
        if (linkCount[j] >= MAX_LINKS_PER_NODE) continue;
        const dx = pos[j * 3] - ix, dy = pos[j * 3 + 1] - iy, dz = pos[j * 3 + 2] - iz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > ld2) continue;
        const a = (1 - Math.sqrt(d2) / LINK_DIST);
        const alpha = a * a * 0.62 * fade;
        const o = seg * 6;
        linePos[o] = ix; linePos[o + 1] = iy; linePos[o + 2] = iz;
        linePos[o + 3] = pos[j * 3]; linePos[o + 4] = pos[j * 3 + 1]; linePos[o + 5] = pos[j * 3 + 2];
        for (let q = 0; q < 2; q++) {
          lineCol[o + q * 3] = cyan.r * alpha; lineCol[o + q * 3 + 1] = cyan.g * alpha; lineCol[o + q * 3 + 2] = cyan.b * alpha;
        }
        linkCount[i]++; linkCount[j]++;
        if (++seg >= MAX_SEGMENTS) break outer;
        if (linkCount[i] >= MAX_LINKS_PER_NODE) break;
      }
    }
    lineGeo.setDrawRange(0, seg * 2);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
  }

  function onPointer(e) {
    const hr = host.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    pointer.tx = clamp(((p.clientX - hr.left) / hr.width) * 2 - 1, -1, 1);
    pointer.ty = clamp(((p.clientY - hr.top) / hr.height) * 2 - 1, -1, 1);
  }
  host.addEventListener('pointermove', onPointer, { passive: true });
  host.addEventListener('touchmove', onPointer, { passive: true });
  host.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; }, { passive: true });

  let frames = 0;
  function render(dt, t, scroll = 0) {
    if (!points) return;
    if ((frames++ & 31) === 0) updateExclusion(); // photo may reflow after fonts/images load
    fade = 1 - clamp(scroll * 1.4, 0, 1);
    step(dt);
    const k = damp(3, dt);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    const sway = reduced ? 0 : Math.sin(t * 0.18) * 0.05;
    group.rotation.y = pointer.x * 0.14 + sway;
    group.rotation.x = -pointer.y * 0.1 + (reduced ? 0 : Math.cos(t * 0.15) * 0.03);
    camera.position.y = -scroll * 2.2;
    pointMat.uniforms.uTime.value = t;
    pointMat.uniforms.uFade.value = fade;
    renderer.render(scene, camera);
  }

  return { resize, render, renderer };
}
