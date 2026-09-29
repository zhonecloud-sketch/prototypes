// Small shared helpers: math, formatting, DOM, canvas textures.

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
// Frame-rate independent smoothing factor for exponential approach.
export const damp = (rate, dt) => 1 - Math.exp(-rate * dt);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Deterministic PRNG so layouts are stable between reloads.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtDate(s) {
  if (s === null || s === undefined || s === '') return 'Present';
  const [y, m] = String(s).split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

function toMonths(s, fallback) {
  if (s === null || s === undefined || s === '') return fallback;
  const [y, m] = String(s).split('-').map(Number);
  return y * 12 + ((m || 1) - 1);
}

export function fmtDuration(start, end) {
  const now = new Date();
  const a = toMonths(start, 0);
  const b = toMonths(end, now.getFullYear() * 12 + now.getMonth()) + 1;
  const months = Math.max(1, b - a);
  const y = Math.floor(months / 12), m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
  if (m && y < 10) parts.push(`${m} mo${m > 1 ? 's' : ''}`);
  return parts.join(' ');
}

export function telHref(phone) {
  return 'tel:' + String(phone).replace(/[^\d+]/g, '');
}

// Tiny DOM builder. Text is always set via textContent (never innerHTML) for data.
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'svg') node.innerHTML = v; // static, trusted icon markup only
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

// Rounded-rect + centred label drawn to a canvas, for use as a THREE texture.
// Everything is drawn in white so the material colour can tint it.
export function drawLabelCanvas({
  text, width = 512, height = 256, font = '600 60px system-ui, sans-serif',
  radius = 40, fill = 0.07, stroke = 0.55, lineWidth = 3, letterSpacing = 0,
}) {
  const c = document.createElement('canvas');
  c.width = width; c.height = height;
  const ctx = c.getContext('2d');
  const inset = lineWidth;
  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  if (fill > 0 || stroke > 0) {
    rr(inset, inset, width - inset * 2, height - inset * 2, radius);
    if (fill > 0) { ctx.fillStyle = `rgba(255,255,255,${fill})`; ctx.fill(); }
    if (stroke > 0) { ctx.strokeStyle = `rgba(255,255,255,${stroke})`; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = font;
  if (letterSpacing && 'letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
  // Shrink to fit long labels.
  let size = parseInt(font.match(/(\d+)px/)?.[1] || '60', 10);
  const maxW = width - 60;
  while (ctx.measureText(text).width > maxW && size > 18) {
    size -= 2;
    ctx.font = font.replace(/\d+px/, `${size}px`);
  }
  ctx.fillText(text, width / 2, height / 2 + size * 0.04);
  return c;
}

export function radialGlowCanvas(size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}
