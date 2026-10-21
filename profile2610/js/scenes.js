import { LANDMASK } from './landmask.js';

const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

function line(ctx, points, color, width = 1) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function circle(ctx, x, y, radius, color, fill = false) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  if (fill) { ctx.fillStyle = color; ctx.fill(); }
  else { ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke(); }
}
function trace(ctx, fn, color, width = 1, count = 120) {
  const points = [];
  for (let i = 0; i <= count; i++) points.push(fn(i / count));
  line(ctx, points, color, width);
}

// Each canvas is an intentionally symbolic technical drawing, not simulated
// hardware. All profile claims and locations stay in profile.yaml.
export function createScenes({ hero, values, atlas, paused: initialPaused }) {
  const style = getComputedStyle(document.documentElement);
  const surface = style.getPropertyValue('--surface').trim();
  const ink = style.getPropertyValue('--ink').trim();
  const copper = style.getPropertyValue('--accent').trim();
  const secondary = style.getPropertyValue('--secondary').trim();
  const grid = style.getPropertyValue('--line').trim();
  let paused = initialPaused;
  let job = null;
  let time = 0;
  let last = 0;
  let frameId = 0;
  let jobTime = 0;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const states = [hero, ...values, atlas].map((canvas) => ({
    canvas, ctx: canvas.getContext('2d'), width: 1, height: 1, visible: false,
  }));
  const bytes = Uint8Array.from(atob(LANDMASK.data), (char) => char.charCodeAt(0));
  const land = [];
  for (let row = 0; row < LANDMASK.height; row += 2) {
    for (let col = 0; col < LANDMASK.width; col += 2) {
      const bit = row * LANDMASK.width + col;
      if ((bytes[bit >> 3] >> (bit & 7)) & 1) land.push([col - 180, 90 - row]);
    }
  }

  function drawHero({ ctx, width: w, height: h }) {
    const cx = w * .5 + pointer.x * 5;
    const cy = h * .49 + pointer.y * 5;
    const r = Math.min(w * .37, h * .39);
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(cx, cy);
    // The graticule is stationary; the three bundles gently come into phase.
    circle(ctx, 0, 0, r * 1.14, grid);
    circle(ctx, 0, 0, r * 1.19, grid);
    for (let i = 0; i < 120; i++) {
      const angle = i * TAU / 120;
      const inner = r * (i % 10 === 0 ? 1.065 : 1.105);
      line(ctx, [[Math.cos(angle) * inner, Math.sin(angle) * inner],
        [Math.cos(angle) * r * 1.14, Math.sin(angle) * r * 1.14]],
      i % 10 === 0 ? secondary : grid, .7);
    }
    const colors = [copper, ink, secondary];
    for (let group = 0; group < 3; group++) {
      ctx.save();
      const angle = -.48 + group * 1.047 + Math.sin(time * .14) * .055;
      ctx.rotate(angle);
      for (let layer = 0; layer < 19; layer++) {
        const spread = layer / 18;
        const phase = Math.sin(time * .25 + group * .7) * .09;
        const rx = r * (.84 + spread * .12);
        const ry = r * (.2 + spread * .2);
        ctx.globalAlpha = .25 + spread * .27;
        trace(ctx, (u) => {
          const a = u * TAU;
          return [Math.cos(a) * rx,
            Math.sin(a) * ry + Math.sin(a * 3 + phase) * r * .055];
        }, colors[group], .7, 160);
      }
      ctx.globalAlpha = 1;
      const u = (time * .025 + group / 3) % 1;
      const angleOnPath = u * TAU;
      const px = Math.cos(angleOnPath) * r * .96;
      const py = Math.sin(angleOnPath) * r * .4 +
        Math.sin(angleOnPath * 3 + Math.sin(time * .25 + group * .7) * .09) * r * .055;
      circle(ctx, px, py, 3, colors[group], true);
      ctx.restore();
    }
    circle(ctx, 0, 0, 5, copper, true);
    ctx.restore();
  }

  function drawValue({ canvas, ctx, width: w, height: h }) {
    ctx.clearRect(0, 0, w, h);
    const pad = w * .1;
    const top = h * .17;
    const bottom = h * .82;
    ctx.globalAlpha = .45;
    for (let x = pad; x <= w - pad; x += 25) {
      for (let y = top; y <= bottom; y += 25) circle(ctx, x, y, .65, secondary, true);
    }
    ctx.globalAlpha = 1;
    ctx.save();
    if (canvas.dataset.animation === 'technical') {
      // Two signal studies echo the two video-detection innovations.
      for (let channel = 0; channel < 2; channel++) {
        const cy = h * (.34 + channel * .32);
        for (let row = 0; row < 5; row++) {
          trace(ctx, (u) => {
            const offset = channel === 0
              ? Math.sin(u * TAU * 3 + row * .6) * 7
              : (u > .43 && u < .55 ? 13 : 0);
            return [mix(pad, w - pad, u), cy + (row - 2) * 7 + offset];
          }, row === 2 ? copper : secondary, row === 2 ? 1.4 : .7);
        }
        const scan = (time * .14 + channel * .35) % 1;
        const x = mix(pad, w - pad, scan);
        line(ctx, [[x, cy - 30], [x, cy + 30]], copper);
        circle(ctx, x, cy, 3, copper, true);
      }
    } else if (canvas.dataset.animation === 'optimisation') {
      const x0 = pad, x1 = w - pad;
      const cy = h * .49;
      for (let i = 0; i < 11; i++) {
        const signal = (u) => {
          const amplitude = Math.pow(1 - u, 2.3) * h * .26;
          return [mix(x0, x1, u), cy + (i - 5) * 2.4 +
            Math.sin(u * TAU * 1.55 + time * .45 + i * .22) * amplitude];
        };
        trace(ctx, signal, i === 5 ? copper : secondary, i === 5 ? 1.5 : .7);
        const t = (time * .16 + i * .087) % 1;
        const point = signal(t);
        circle(ctx, point[0], point[1], i === 5 ? 3 : 1.5, i === 5 ? copper : ink, true);
      }
      ctx.setLineDash([3, 5]);
      line(ctx, [[w * .69, top], [w * .69, bottom]], secondary);
      ctx.setLineDash([]);
    } else {
      const levels = [1, 2, 4, 8];
      const positions = levels.map((count, level) => Array.from({ length: count }, (_, i) => ({
        x: mix(pad, w - pad, (i + .5) / count),
        y: mix(bottom - 10, top + 40, level / 3),
      })));
      for (let level = 1; level < positions.length; level++) {
        positions[level].forEach((end, i) => {
          const start = positions[level - 1][Math.floor(i / 2)];
          const branch = (u) => {
            const ease = u * u * (3 - 2 * u);
            return [mix(start.x, end.x, ease), mix(start.y, end.y, u)];
          };
          trace(ctx, branch, level === 1 ? copper : secondary, level === 1 ? 1.4 : 1);
          const flow = (time * .28 - level * .24 + i * .06 + 10) % 1;
          const point = branch(flow);
          circle(ctx, point[0], point[1], 2, ink, true);
        });
      }
      positions.forEach((level, n) => level.forEach((point) => {
        circle(ctx, point.x, point.y, n === 0 ? 9 : 4, surface, true);
        circle(ctx, point.x, point.y, n === 0 ? 9 : 4, n === 0 ? copper : secondary);
      }));
    }
    ctx.restore();
  }

  function drawAtlas({ ctx, width: w, height: h }) {
    ctx.clearRect(0, 0, w, h);
    const scale = Math.min((w - 38) / 360, (h - 66) / 150);
    const project = (lon, lat) => [w / 2 + lon * scale, h * .57 - lat * scale];
    const pointSize = Math.max(.7, scale * .55);
    // Natural Earth landmask copied from the reference; no invented geography.
    for (const [lon, lat] of land) {
      if (lat < -58 || lat > 80) continue;
      const [x, y] = project(lon, lat);
      ctx.fillStyle = secondary;
      ctx.globalAlpha = .5;
      ctx.fillRect(x, y, pointSize, pointSize);
    }
    ctx.globalAlpha = 1;
    ctx.setLineDash([2, 5]);
    for (const lat of [-30, 0, 30, 60]) {
      line(ctx, [project(-170, lat), project(170, lat)], grid, .5);
    }
    ctx.setLineDash([]);
    if (!job) return;
    const hasCoords = (place) => Number.isFinite(place.lat) && Number.isFinite(place.lon);
    const origins = (job.locations?.work || []).filter(hasCoords);
    const customers = (job.locations?.customers || []).filter(hasCoords);
    const origin = origins[0];
    if (!origin) return;
    const reveal = paused ? 1 : clamp((time - jobTime) / 1.3, 0, 1);
    const start = project(origin.lon, origin.lat);
    const targets = [...origins.slice(1), ...customers];
    targets.forEach((place, i) => {
      const end = project(place.lon, place.lat);
      const dx = end[0] - start[0], dy = end[1] - start[1];
      const distance = Math.hypot(dx, dy);
      if (distance < 2) return;
      const curve = Math.min(60, distance * .25);
      const route = (u) => [mix(start[0], end[0], u),
        mix(start[1], end[1], u) - Math.sin(u * Math.PI) * curve];
      trace(ctx, (u) => route(u * reveal), copper, .8, 60);
      const travel = ((time * .17 + i * .13) % 1) * reveal;
      const point = route(travel);
      circle(ctx, point[0], point[1], 1.8, copper, true);
    });
    customers.forEach((place) => {
      const [x, y] = project(place.lon, place.lat);
      circle(ctx, x, y, 2.2, copper, true);
    });
    origins.forEach((place) => {
      const [x, y] = project(place.lon, place.lat);
      circle(ctx, x, y, 3, ink, true);
      circle(ctx, x, y, 6, secondary);
    });
  }

  const draws = [drawHero, ...values.map(() => drawValue), drawAtlas];
  function schedule() {
    if (!frameId && !document.hidden) frameId = requestAnimationFrame(frame);
  }
  function frame(now) {
    frameId = 0;
    const dt = last ? Math.min((now - last) / 1000, .05) : 0;
    last = now;
    if (!paused) {
      time += dt;
      pointer.x = mix(pointer.x, pointer.targetX, .035);
      pointer.y = mix(pointer.y, pointer.targetY, .035);
    }
    states.forEach((state, i) => {
      if (state.visible && state.ctx) draws[i](state);
    });
    if (!paused && states.some((state) => state.visible)) schedule();
  }
  const resize = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const state = states.find((item) => item.canvas === entry.target);
      if (!state) continue;
      state.width = entry.contentRect.width;
      state.height = entry.contentRect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      state.canvas.width = Math.round(state.width * ratio);
      state.canvas.height = Math.round(state.height * ratio);
      state.ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    schedule();
  });
  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const state = states.find((item) => item.canvas === entry.target);
      if (state) state.visible = entry.isIntersecting;
    }
    last = 0;
    schedule();
  }, { rootMargin: '80px' });
  states.forEach((state) => { resize.observe(state.canvas); visibility.observe(state.canvas); });
  hero.addEventListener('pointermove', (event) => {
    if (paused) return;
    const rect = hero.getBoundingClientRect();
    pointer.targetX = (event.clientX - rect.left) / rect.width - .5;
    pointer.targetY = (event.clientY - rect.top) / rect.height - .5;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
    else { last = 0; schedule(); }
  });

  return {
    setPaused(next) { paused = next; last = 0; schedule(); },
    setJob(next) { job = next; jobTime = time; schedule(); },
  };
}
