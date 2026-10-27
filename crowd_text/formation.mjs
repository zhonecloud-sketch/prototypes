export const DEFAULT_MESSAGE = 'Happy 2027';

export function initialMessage(search) {
  if (!search || search === '?') return DEFAULT_MESSAGE;
  try {
    const greeting = decodeURIComponent(search.slice(1).replace(/\+/g, ' '))
      .replace(/\s+/gu, ' ').trim();
    return greeting ? `${greeting}\n${DEFAULT_MESSAGE}` : DEFAULT_MESSAGE;
  } catch {
    return DEFAULT_MESSAGE;
  }
}

export function validateMessage(value) {
  const lines = value.replace(/\r\n?/g, '\n').split('\n');
  if (!value.replace(/[\s\u200b-\u200d\ufeff]/gu, '')) {
    throw new Error('Add a message before gathering the crowd.');
  }
  if (lines.length > 3) throw new Error('Keep your message to three lines.');
  if (Array.from(value).length > 120) {
    throw new Error('Keep your message to 120 characters.');
  }
  return lines.map(line => line.trim()).join('\n').trim();
}

// A single grid gives every target a separate, consistently spaced place.
// Cell coverage preserves strokes instead of selecting random lit pixels.
export function sampleMask(data, width, height, budget) {
  let minX = width, minY = height, maxX = -1, maxY = -1;
  let ink = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < 96) continue;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      ink++;
    }
  }
  if (!ink) throw new Error('This message has no visible characters. Try different text.');
  function cells(step) {
    const points = [];
    for (let y = minY; y <= maxY; y += step) {
      for (let x = minX; x <= maxX; x += step) {
        let coverage = 0;
        const bottom = Math.min(y + step, height);
        const right = Math.min(x + step, width);
        for (let py = y; py < bottom; py++) {
          for (let px = x; px < right; px++) {
            if (data[(py * width + px) * 4 + 3] >= 96) coverage++;
          }
        }
        if (coverage >= Math.max(1, step * step * 0.12)) {
          points.push({ x: x + step / 2, z: y + step / 2 });
        }
      }
    }
    return points;
  }
  let step = Math.max(1, Math.floor(Math.sqrt(ink / budget)));
  let points = cells(step);
  while (points.length > budget) points = cells(++step);
  if (!points.length) throw new Error('This text is too fine to form. Try fewer characters.');
  const scale = 0.92 / step;
  const centerX = (minX + maxX + 1) / 2;
  const centerY = (minY + maxY + 1) / 2;
  return points.map(p => ({ x: (p.x - centerX) * scale, z: (p.z - centerY) * scale }));
}

export function boundsOf(points) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }
  return { minX: minX - 1, maxX: maxX + 1, minZ: minZ - 1, maxZ: maxZ + 1 };
}

export function fitView(bounds, aspect, elevation, azimuth = 0) {
  const width = bounds.maxX - bounds.minX;
  const depth = bounds.maxZ - bounds.minZ;
  const projectedWidth = width * Math.abs(Math.cos(azimuth))
    + depth * Math.abs(Math.sin(azimuth));
  const projectedHeight = (width * Math.abs(Math.sin(azimuth))
    + depth * Math.abs(Math.cos(azimuth))) * Math.sin(elevation)
    + 2.2 * Math.cos(elevation);
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    z: (bounds.minZ + bounds.maxZ) / 2,
    halfHeight: Math.max(projectedHeight / 2, projectedWidth / (2 * aspect), 3) * 1.16
  };
}

export function scatterTargets(count, aspect) {
  const ratio = Math.max(0.65, Math.min(1.8, aspect));
  const columns = Math.ceil(Math.sqrt(count * ratio));
  const rows = Math.ceil(count / columns);
  return Array.from({ length: count }, (_, i) => ({
    x: (i % columns - (columns - 1) / 2 + (Math.random() - 0.5) * 0.6) * 1.75,
    z: (Math.floor(i / columns) - (rows - 1) / 2 + (Math.random() - 0.5) * 0.6) * 1.75
  }));
}

export function spatialOrder(points) {
  const bounds = boundsOf(points);
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const depth = Math.max(1, bounds.maxZ - bounds.minZ);
  function key(p) {
    const x = Math.floor((p.x - bounds.minX) / width * 1023);
    const z = Math.floor((p.z - bounds.minZ) / depth * 1023);
    let code = 0;
    for (let bit = 0; bit < 10; bit++) {
      code |= ((x >> bit) & 1) << (bit * 2);
      code |= ((z >> bit) & 1) << (bit * 2 + 1);
    }
    return code;
  }
  return points.map((p, index) => ({ index, key: key(p) }))
    .sort((a, b) => a.key - b.key).map(p => p.index);
}
