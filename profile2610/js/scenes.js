import { LANDMASK } from './landmask.js';

const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const copper = '#c99b75';
const pale = '#b7cbc0';
const green = '#739b8b';

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
function text(ctx, label, x, y, color, size = 9, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${size}px Consolas, monospace`;
  ctx.textAlign = align;
  ctx.fillText(label, x, y);
}
function cross(ctx, x, y, color, size = 4) {
  line(ctx, [[x - size, y], [x + size, y]], color);
  line(ctx, [[x, y - size], [x, y + size]], color);
}
function trace(ctx, fn, color, width = 1, count = 120) {
  const points = [];
  for (let i = 0; i <= count; i++) points.push(fn(i / count));
  line(ctx, points, color, width);
}

// Each canvas is an intentionally symbolic technical drawing, not simulated
// hardware. All profile claims and locations stay in profile.yaml.
export function createScenes({ hero, value, atlas, paused: initialPaused }) {
  let paused = initialPaused;
  let activeValue = 0;
  let job = null;
  let time = 0;
  let last = 0;
  let frameId = 0;
  let jobTime = 0;
  let valueTime = 0;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const states = [hero, value, atlas].map((canvas) => ({
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
    circle(ctx, 0, 0, r * 1.14, '#c4c9b9');
    circle(ctx, 0, 0, r * 1.19, '#d6d6c9');
    for (let i = 0; i < 120; i++) {
      const angle = i * TAU / 120;
      const inner = r * (i % 10 === 0 ? 1.065 : 1.105);
      line(ctx, [[Math.cos(angle) * inner, Math.sin(angle) * inner],
        [Math.cos(angle) * r * 1.14, Math.sin(angle) * r * 1.14]],
      i % 10 === 0 ? '#9fa995' : '#c4c9b9', .7);
    }
    ctx.setLineDash([2, 6]);
    line(ctx, [[-r * 1.3, 0], [r * 1.3, 0]], '#b7beb0', .7);
    line(ctx, [[0, -r * 1.26], [0, r * 1.26]], '#b7beb0', .7);
    ctx.setLineDash([]);
    const colors = ['#9b5939', '#294c47', '#758979'];
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
      circle(ctx, px, py, 6, colors[group]);
      ctx.restore();
    }
    circle(ctx, 0, 0, 19, '#f2efe7', true);
    circle(ctx, 0, 0, 19, '#9b5939');
    cross(ctx, 0, 0, '#9b5939', 5);
    text(ctx, 'E', 0, -r * 1.32, '#6d7969', 9, 'center');
    text(ctx, 'D', r * 1.32, 3, '#6d7969', 9, 'center');
    text(ctx, 'P', 0, r * 1.37, '#6d7969', 9, 'center');
    ctx.restore();
  }

  function drawValue({ ctx, width: w, height: h }) {
    ctx.clearRect(0, 0, w, h);
    const pad = w * .1;
    const top = h * .17;
    const bottom = h * .82;
    ctx.globalAlpha = .45;
    for (let x = pad; x <= w - pad; x += 25) {
      for (let y = top; y <= bottom; y += 25) circle(ctx, x, y, .65, '#789185', true);
    }
    ctx.globalAlpha = 1;
    cross(ctx, pad - 12, top - 12, '#627e70');
    cross(ctx, w - pad + 12, bottom + 12, '#627e70');
    const progress = paused ? 1 : clamp((time - valueTime) / 1.3, 0, 1);
    ctx.save();
    ctx.globalAlpha = .4 + .6 * progress;
    if (activeValue === 0) {
      const x0 = pad, x1 = w - pad;
      const cy = h * .49;
      for (let i = 0; i < 11; i++) {
        const signal = (u) => {
          const amplitude = Math.pow(1 - u, 2.3) * h * .26;
          return [mix(x0, x1, u), cy + (i - 5) * 2.4 +
            Math.sin(u * TAU * 1.55 + time * .45 + i * .22) * amplitude];
        };
        trace(ctx, signal, i === 5 ? copper : '#74978a', i === 5 ? 1.5 : .7);
        const t = (time * .16 + i * .087) % 1;
        const point = signal(t);
        circle(ctx, point[0], point[1], i === 5 ? 3 : 1.5, i === 5 ? copper : pale, true);
      }
      ctx.setLineDash([3, 5]);
      line(ctx, [[w * .69, top], [w * .69, bottom]], '#698c7b');
      ctx.setLineDash([]);
      text(ctx, 'EXPLORE', pad, h * .91, '#a1b8aa');
      text(ctx, 'VERIFY', w * .69, h * .91, copper, 9, 'center');
      text(ctx, 'DELIVER', w - pad, h * .91, '#a1b8aa', 9, 'right');
      text(ctx, 'FROM UNCERTAINTY TO WORKING SYSTEM', pad, h * .1, '#a1b8aa', 9);
    } else if (activeValue === 1) {
      const lanes = ['CUSTOMER', 'ENGINEERING', 'VALIDATION', 'OPERATIONS'];
      const start = pad + 8;
      const end = w - pad;
      for (let i = 0; i < 4; i++) {
        const y = mix(top + 40, bottom - 30, i / 3);
        text(ctx, lanes[i], start, y - 13, '#a1b8aa', 8);
        line(ctx, [[start, y], [end, y]], '#607d70', .7);
        const gateX = [start + (end - start) * .19, start + (end - start) * .48, start + (end - start) * .8];
        for (let gate = 0; gate < 3; gate++) {
          const x = gateX[gate];
          ctx.fillStyle = '#152e2f';
          ctx.fillRect(x - 4, y - 4, 8, 8);
          ctx.strokeStyle = gate === 2 ? copper : '#96b3a2';
          ctx.strokeRect(x - 4, y - 4, 8, 8);
          if (i < 3 && gate === 2) {
            line(ctx, [[x, y + 5], [x, mix(top + 40, bottom - 30, (i + 1) / 3) - 5]], copper, .8);
          }
        }
        const flow = (time * .12 + (i < 2 ? .13 * i : .05 * i)) % 1;
        circle(ctx, mix(start, end, flow), y, 3, copper, true);
      }
      text(ctx, 'SEPARATE DISCIPLINES. SHARED MILESTONES.', pad, h * .1, '#a1b8aa', 9);
      text(ctx, 'ALIGN', start, h * .94, '#a1b8aa');
      text(ctx, 'INTEGRATE', w * .5, h * .94, '#a1b8aa', 9, 'center');
      text(ctx, 'RELEASE', end, h * .94, copper, 9, 'right');
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
          trace(ctx, branch, level === 1 ? copper : '#83a592', level === 1 ? 1.4 : 1);
          const flow = (time * .28 - level * .24 + i * .06 + 10) % 1;
          const point = branch(flow);
          circle(ctx, point[0], point[1], 2, pale, true);
        });
      }
      positions.forEach((level, n) => level.forEach((point) => {
        circle(ctx, point.x, point.y, n === 0 ? 9 : 4, '#152e2f', true);
        circle(ctx, point.x, point.y, n === 0 ? 9 : 4, n === 0 ? copper : pale);
      }));
      text(ctx, 'CAPABILITY THAT MULTIPLIES', pad, h * .1, '#a1b8aa', 9);
      text(ctx, 'COACHING → OWNERSHIP → LEADERSHIP', w / 2, h * .94, copper, 9, 'center');
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
      ctx.fillStyle = '#acb7a6';
      ctx.fillRect(x, y, pointSize, pointSize);
    }
    ctx.setLineDash([2, 5]);
    for (const lat of [-30, 0, 30, 60]) {
      line(ctx, [project(-170, lat), project(170, lat)], '#c5cbbb', .5);
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
      trace(ctx, (u) => route(u * reveal), '#a46d48', .8, 60);
      const travel = ((time * .17 + i * .13) % 1) * reveal;
      const point = route(travel);
      circle(ctx, point[0], point[1], 1.8, '#a46d48', true);
    });
    customers.forEach((place) => {
      const [x, y] = project(place.lon, place.lat);
      circle(ctx, x, y, 2.2, '#9b5939', true);
    });
    origins.forEach((place) => {
      const [x, y] = project(place.lon, place.lat);
      circle(ctx, x, y, 3, '#24483e', true);
      circle(ctx, x, y, 6, '#567e66');
    });
    const [px, py] = start;
    text(ctx, origin.city?.toUpperCase() || 'WORK SITE', px + 10, py + 17, '#315647', 8);
    if (!customers.length) {
      text(ctx, 'GLOBAL CUSTOMER LOCATIONS UNSPECIFIED', 18, h - 15, '#697c6b', 8);
    }
  }

  const draws = [drawHero, drawValue, drawAtlas];
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
    setValue(next) { activeValue = next; valueTime = time; schedule(); },
    setJob(next) { job = next; jobTime = time; schedule(); },
  };
}
