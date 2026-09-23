// Signature Values: signal beacons assemble over a permanent compass chart;
// each value connects its relevant beacons to a central hub on scroll.
import * as THREE from '../lib/three.module.js';
import { clamp, damp, lerp, easeOutCubic, mulberry32, drawLabelCanvas, radialGlowCanvas } from './util.js';

export const VALUES_INTRO_WEIGHT = 0.16; // the muster begins during entry, not after the stage sticks

function drawSignalCanvas(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 768; canvas.height = 192;
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,.65)';
  ctx.beginPath(); ctx.arc(62, 96, 28, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(62, 77); ctx.lineTo(81, 96); ctx.lineTo(62, 115); ctx.lineTo(43, 96);
  ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(62, 96, 5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.4)';
  ctx.beginPath(); ctx.moveTo(92, 96); ctx.lineTo(122, 96); ctx.stroke();

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  let size = 60;
  do {
    ctx.font = `600 ${size}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    if (ctx.measureText(text).width <= 610 || size <= 36) break;
    size -= 2;
  } while (true);
  ctx.fillText(text, 138, 91);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillRect(138, 149, 590, 2);
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  ctx.fillRect(728, 145, 4, 10);
  return canvas;
}

export function createValues({ canvas, host, copyEl, components, values, reduced = false, onActive }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 0, 7);

  const rnd = mulberry32(2024);
  const colBase = new THREE.Color('#cfd9ea');
  const colDim = new THREE.Color('#55627a');
  const accents = values.map((v) => new THREE.Color(v.accent || '#37d1ff'));

  // --- transparent beacons, rather than boxed cards
  const tiles = components.map((c, i) => {
    const tex = new THREE.CanvasTexture(drawSignalCanvas(c.label));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, color: colBase.clone() });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), mat);
    scene.add(mesh);
    return {
      id: c.id, mesh, mat,
      cur: { x: 0, y: 0, z: -6, s: 0.5, o: 0, w: 0, h: 0 },
      grid: { x: 0, y: 0 },
      scatter: { x: 0, y: 0, z: -3 - rnd() * 4, seedX: rnd() * 2 - 1, seedY: rnd() * 2 - 1 },
      phase: rnd(),
    };
  });

  // --- hub (value number + glow) and spokes
  const hubTextures = values.map((v) => {
    const tex = new THREE.CanvasTexture(drawLabelCanvas({
      text: v.number || '', width: 256, height: 256, fill: 0, stroke: 0,
      font: '600 132px ui-monospace, "SF Mono", Consolas, monospace', letterSpacing: -6,
    }));
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
  const hubMat = new THREE.MeshBasicMaterial({ map: hubTextures[0], transparent: true, depthWrite: false, opacity: 0 });
  const hub = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hubMat);
  scene.add(hub);
  const glowTex = new THREE.CanvasTexture(radialGlowCanvas(128));
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const glow = new THREE.Sprite(glowMat);
  scene.add(glow);

  const MAX_SPOKES = 16;
  const spokePos = new Float32Array(MAX_SPOKES * 6);
  const spokeGeo = new THREE.BufferGeometry();
  spokeGeo.setAttribute('position', new THREE.BufferAttribute(spokePos, 3).setUsage(THREE.DynamicDrawUsage));
  spokeGeo.setDrawRange(0, 0);
  const spokeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const spokes = new THREE.LineSegments(spokeGeo, spokeMat);
  scene.add(spokes);

  // --- background dust for depth parallax
  {
    const n = 70, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (rnd() * 2 - 1) * 5; arr[i * 3 + 1] = (rnd() * 2 - 1) * 5; arr[i * 3 + 2] = -3 - rnd() * 5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 0.035, color: 0x7d8fb0, transparent: true, opacity: 0.55, depthWrite: false })));
  }

  // --- layout
  let W = 1, H = 1, halfW = 1, halfH = 1, tileW = 0.7, tileH = 0.35, focusW = 0.7, focusH = 0.35;
  const chartPos = { x: 0, y: 0 };
  const hubPos = { x: 0, y: 0.9, z: 1.2 };
  const orbit = { rx: 0.5, ry: 0.8, rz: 0.35 };

  function layout() {
    const aspect = W / H;
    halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    halfW = halfH * aspect;
    const landscape = aspect > 1 && H <= 520; // match the two-column CSS layout on short landscape screens
    const chartShare = landscape && H <= 380 ? 0.4 : 0.5;
    // Keep beacons inside the chart between the hint and the measured copy panel.
    const topF = Math.max(0.1, 100 / H);
    const botF = copyEl ? clamp(1 - copyEl.offsetHeight / H - 0.015, topF + 0.12, 0.7) : 0.55;
    const region = landscape
      ? { cx: -halfW * (1 - chartShare), cy: -halfH * 0.1, hw: halfW * chartShare * 0.92, hh: halfH * 0.7 }
      : { cx: 0, cy: halfH * (1 - topF - botF), hw: halfW * 0.92, hh: halfH * (botF - topF) };
    const n = tiles.length;
    // A short phone has room for five rows, not seven; focused labels grow separately.
    const cols = !landscape && (botF - topF) * H < 260 ? 3 : 2;
    const rows = Math.ceil(n / cols);
    const gapX = cols === 3 ? 0.07 : 0.1, gapY = 0.075;
    tileW = Math.min(landscape ? 2.2 : 1.08, (2 * region.hw - (cols - 1) * gapX) / cols);
    tileH = Math.min(tileW * 0.28, Math.max(0.09, (2 * region.hh - (rows - 1) * gapY) / rows));
    focusW = landscape ? tileW : Math.max(tileW, Math.min(1.03, (2 * region.hw - 0.1) / 2));
    focusH = Math.max(tileH, Math.min(focusW * 0.29, region.hh * 0.48));
    const gridW = cols * tileW + (cols - 1) * gapX;
    const gridH = rows * tileH + (rows - 1) * gapY;
    const lastCount = n - (rows - 1) * cols;
    tiles.forEach((tile, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const offset = r === rows - 1 ? ((cols - lastCount) * (tileW + gapX)) / 2 : 0;
      tile.grid.x = region.cx - gridW / 2 + tileW / 2 + c * (tileW + gapX) + offset;
      tile.grid.y = region.cy + gridH / 2 - tileH / 2 - r * (tileH + gapY);
      tile.scatter.x = region.cx + tile.scatter.seedX * halfW * 1.6;
      tile.scatter.y = region.cy + tile.scatter.seedY * halfH * 1.1;
    });
    chartPos.x = region.cx; chartPos.y = region.cy;
    // The hub is closer to the camera; compensate its X for perspective so
    // it still projects onto the centre of the compass in landscape.
    hubPos.x = chartPos.x * (camera.position.z - hubPos.z) / camera.position.z;
    hubPos.y = chartPos.y;
    // A broad orbit keeps long labels apart while the number sits above them.
    orbit.rx = clamp(region.hw - focusW * 0.52 - 0.03, 0.24, landscape ? 1.25 : 0.65);
    orbit.ry = clamp(region.hh - focusH * 0.65, 0.3, landscape ? 1.3 : 0.9);
    orbit.rz = 0.12;
    hub.scale.setScalar(Math.min(0.6, focusH * 1.7));
    glow.scale.setScalar(hub.scale.x * 3.2);
  }

  function resize() {
    W = host.clientWidth || 1;
    H = host.clientHeight || 1;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    layout();
  }

  // --- animation state
  let lastActive = -2;
  let hubFlash = 0;
  const tmpCol = new THREE.Color();

  function render(dt, t, progress, entry) {
    const N = values.length;
    const total = VALUES_INTRO_WEIGHT + N;
    const p = progress * total;
    let active = -1, introQ = 1;
    if (p < VALUES_INTRO_WEIGHT) introQ = Math.max(p / VALUES_INTRO_WEIGHT, clamp((entry - 0.04) / 0.86, 0, 1));
    else active = Math.min(N - 1, Math.floor(p - VALUES_INTRO_WEIGHT));

    if (active !== lastActive) {
      lastActive = active;
      hubFlash = reduced ? 0 : 1;
      if (active >= 0) hubMat.map = hubTextures[active];
      onActive?.(active);
    }
    hubFlash *= Math.exp(-dt * 3);

    const focusSet = active >= 0 ? new Set(values[active].components || []) : null;
    const accent = active >= 0 ? accents[active] : colBase;
    let M = 0;
    if (focusSet) for (const tile of tiles) if (focusSet.has(tile.id)) M++;
    let m = 0;
    const n = tiles.length;
    const spin = reduced ? 0 : t * 0.08 + progress * 0.45;
    const kFocus = reduced ? 1 : damp(5.5, dt);
    const kIntro = 1; // entry and muster follow the scroll, never a timer

    for (let i = 0; i < n; i++) {
      const tile = tiles[i];
      let tx, ty, tz, ts, to, col, k;
      if (focusSet && focusSet.has(tile.id)) {
        const phi = spin + (Math.PI * 2 * m) / M + Math.PI / 2; m++;
        tx = chartPos.x + orbit.rx * Math.cos(phi);
        ty = chartPos.y + orbit.ry * Math.sin(phi);
        tz = 0.2 - orbit.rz * Math.sin(phi);
        ts = 0.94; to = 1; col = accent; k = kFocus;
      } else if (focusSet) {
        tx = tile.grid.x; ty = tile.grid.y; tz = -1.5; ts = 0.76; to = 0.2; col = colDim; k = kFocus;
      } else {
        const li = clamp((introQ - (0.55 * i) / n) / 0.45, 0, 1);
        const e = easeOutCubic(li);
        tx = lerp(tile.scatter.x, tile.grid.x, e);
        ty = lerp(tile.scatter.y, tile.grid.y, e);
        tz = lerp(tile.scatter.z, 0, e);
        ts = lerp(0.4, 1, e); to = e * 0.92; col = colBase; k = kIntro;
      }
      const c = tile.cur;
      c.x += (tx - c.x) * k; c.y += (ty - c.y) * k; c.z += (tz - c.z) * k;
      c.s += (ts - c.s) * k; c.o += (to - c.o) * k;
      const focused = focusSet?.has(tile.id);
      c.w += ((focused ? focusW : tileW) - c.w) * k;
      c.h += ((focused ? focusH : tileH) - c.h) * k;
      tile.mesh.position.set(c.x, c.y, c.z);
      tile.mesh.scale.set((c.w / 2) * c.s, c.h * c.s, 1);
      tile.mesh.quaternion.copy(camera.quaternion);
      tile.mat.opacity = c.o;
      tile.mat.color.lerp(col, k);
    }

    // hub + spokes
    const hubTarget = focusSet ? 1 : 0;
    hubMat.opacity += (hubTarget - hubMat.opacity) * kFocus;
    hubMat.color.lerp(accent, kFocus);
    hub.position.set(hubPos.x, hubPos.y, hubPos.z);
    hub.quaternion.copy(camera.quaternion);
    glow.position.set(hubPos.x, hubPos.y, hubPos.z - 0.05);
    glowMat.color.copy(hubMat.color);
    glowMat.opacity = hubMat.opacity * (0.22 + (reduced ? 0 : 0.1 * Math.sin(t * 2.1)) + hubFlash * 0.5);
    let seg = 0;
    if (focusSet) {
      for (const tile of tiles) {
        if (!focusSet.has(tile.id) || seg >= MAX_SPOKES) continue;
        const o = seg * 6;
        spokePos[o] = hubPos.x; spokePos[o + 1] = hubPos.y; spokePos[o + 2] = hubPos.z;
        spokePos[o + 3] = tile.cur.x; spokePos[o + 4] = tile.cur.y; spokePos[o + 5] = tile.cur.z;
        seg++;
      }
    }
    spokeGeo.setDrawRange(0, seg * 2);
    spokeGeo.attributes.position.needsUpdate = true;
    spokeMat.color.copy(tmpCol.copy(accent).multiplyScalar(0.35));
    spokeMat.opacity = hubMat.opacity;

    // gentle camera sway
    if (!reduced) {
      camera.position.x = Math.sin(t * 0.23) * 0.1;
      camera.position.y = Math.cos(t * 0.19) * 0.06;
    }
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  return { resize, render, renderer };
}
