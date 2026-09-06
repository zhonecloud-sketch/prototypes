/**
SDG Globe Visualizer - Optimized Pure WebGL Implementation
Uses texture mapping for country colors and GPU picking for hit testing
*/
(function() {
'use strict';

// ============================================================
// CONSTANTS & CONFIGURATION
// ============================================================
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

let METRICS = [];

// Ocean color
const OCEAN_COLOR = { r: 0.118, g: 0.227, b: 0.373 }; // #1e3a5f

// ============================================================
// STATE
// ============================================================
const MAX_PHI = 60;
const MIN_PHI = -60;

const state = {
  geoData: null,
  rotation: [0, 20, 0],
  rotationMatrix: null,
  activeMetric: METRICS[0],
  selectedCountry: null,
  isPlaying: true,
  isDragging: false,
  lastPointer: null,
  dragStartPointer: null,
  metricDataMap: new Map(),
  
  canvas: null,
  gl: null,
  width: 0,
  height: 0,
  animationId: null,
  
  // WebGL resources
  globeProgram: null,
  borderProgram: null,
  highlightProgram: null,
  markerProgram: null,
  sphereBuffer: null,
  borderBuffer: null,
  highlightBuffer: null,
  capitalMarkerBuffer: null,
  capitalCoords: null,
  
  // Optimized sphere resolution (texture handles the detail)
  sphereLatSegments: 180,
  sphereLonSegments: 360,
  
  // Texture & Picking resources
  colorTexture: null,
  pickingCanvas: null,
  pickingCtx: null,
  renderableFeatures: [],
  
  // Highlight state
  hoveredFeature: null,
  
  // Extension support
  useUint32: false,
  
  // Computed values
  radius: 0,
  visualCenterY: 0
};

// ============================================================
// SHADER SOURCES
// ============================================================
const GLOBE_VERTEX_SHADER = `
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aUV;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec2 vUV;
varying vec3 vNormal;
void main() {
  vUV = aUV;
  vNormal = normalize(aPosition);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const GLOBE_FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUV;
varying vec3 vNormal;
uniform sampler2D uColorMap;
uniform vec3 uLightDirection;
uniform float uAmbient;
void main() {
  vec3 baseColor = texture2D(uColorMap, vUV).rgb;
  float diffuse = max(dot(vNormal, uLightDirection), 0.0);
  float light = uAmbient + (1.0 - uAmbient) * diffuse;
  vec3 finalColor = baseColor * light;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const BORDER_VERTEX_SHADER = `
precision mediump float;
attribute vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec3 vPosition;
void main() {
  vPosition = aPosition;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition * 1.002, 1.0);
}
`;

const BORDER_FRAGMENT_SHADER = `
precision mediump float;
varying vec3 vPosition;
uniform mat4 uModelViewMatrix;
void main() {
  vec3 viewPos = (uModelViewMatrix * vec4(vPosition, 1.0)).xyz;
  float facing = step(0.0, viewPos.z);
  vec3 borderColor = vec3(0.4, 0.6, 0.8);
  float alpha = facing * 1.0;
  if (alpha < 0.1) discard;
  gl_FragColor = vec4(borderColor, alpha);
}
`;

const HIGHLIGHT_VERTEX_SHADER = `
precision mediump float;
attribute vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec3 vPosition;
void main() {
  vPosition = aPosition;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition * 1.003, 1.0);
}
`;

const HIGHLIGHT_FRAGMENT_SHADER = `
precision mediump float;
varying vec3 vPosition;
uniform mat4 uModelViewMatrix;
uniform vec3 uHighlightColor;
void main() {
  vec3 viewPos = (uModelViewMatrix * vec4(vPosition, 1.0)).xyz;
  float facing = step(0.0, viewPos.z);
  float alpha = facing * 1.0;
  if (alpha < 0.1) discard;
  gl_FragColor = vec4(uHighlightColor, alpha);
}
`;

const MARKER_VERTEX_SHADER = `
precision mediump float;
attribute vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uPointSize;
varying vec3 vPosition;
void main() {
  vPosition = aPosition;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition * 1.005, 1.0);
  gl_PointSize = uPointSize;
}
`;

const MARKER_FRAGMENT_SHADER = `
precision mediump float;
varying vec3 vPosition;
uniform mat4 uModelViewMatrix;
uniform vec3 uMarkerColor;
float starShape(vec2 p, float size) {
  float angle = atan(p.y, p.x);
  float radius = length(p);
  float star = cos(5.0 * angle) * 0.5 + 0.5;
  float innerR = size * 0.4;
  float outerR = size;
  float r = mix(innerR, outerR, star);
  return radius - r;
}
void main() {
  vec3 viewPos = (uModelViewMatrix * vec4(vPosition, 1.0)).xyz;
  float facing = step(0.0, viewPos.z);
  if (facing < 0.5) discard;
  vec2 coord = gl_PointCoord - vec2(0.5);
  float starDist = starShape(coord, 0.4);
  if (starDist > 0.0) discard;
  vec3 color = vec3(1.0, 0.85, 0.2);
  gl_FragColor = vec4(color, 1.0);
}
`;

// ============================================================
// MATH UTILITIES
// ============================================================
function gridToGeographic(latIdx, lonIdx, latSegments, lonSegments) {
  const lat = 90 - (latIdx / latSegments) * 180;
  const lon = (lonIdx / lonSegments) * 360 - 180;
  return [lon, lat];
}

function sphericalToCartesian(lon, lat) {
  const theta = (90 - lat) / 180 * Math.PI;
  const phi = -(lon + 180) / 360 * 2 * Math.PI;
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  return [
    sinTheta * cosPhi,
    cosTheta,
    sinTheta * sinPhi
  ];
}

function cartesianToSpherical(x, y, z) {
  const lat = Math.asin(Math.max(-1, Math.min(1, y))) * RAD_TO_DEG;
  const phi = Math.atan2(z, x);
  let lon = -phi * RAD_TO_DEG - 180;
  if (lon < -180) lon += 360;
  if (lon > 180) lon -= 360;
  return [lon, lat];
}

function transposeMatrix(m) {
  return new Float32Array([
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  ]);
}

function applyMatrix(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14]
  ];
}

function unproject(screenX, screenY, rotationMatrix, cx, cy, radius) {
  const nx = (screenX - cx) / radius;
  const ny = -(screenY - cy) / radius;
  const r2 = nx * nx + ny * ny;
  if (r2 > 1) return null;
  const nz = Math.sqrt(1 - r2);
  const invMatrix = transposeMatrix(rotationMatrix);
  const [x, y, z] = applyMatrix(invMatrix, nx, ny, nz);
  return cartesianToSpherical(x, y, z);
}

function createIdentityMatrix() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

function multiplyMatrices(a, b) {
  const result = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i * 4 + j] =
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j];
    }
  }
  return result;
}

function createRotationMatrixX(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ]);
}

function createRotationMatrixY(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ]);
}

function createOrthographicMatrix(left, right, bottom, top, near, far) {
  return new Float32Array([
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, -2 / (far - near), 0,
    -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
  ]);
}

// ============================================================
// WEBGL UTILITIES
// ============================================================
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// ============================================================
// COLOR UTILITIES
// ============================================================
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.5, g: 0.5, b: 0.5 };
}

function interpolateColor(value, colorScale, domain) {
  const [min, max] = domain;
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const numColors = colorScale.length;
  const scaledPos = normalized * (numColors - 1);
  const index = Math.floor(scaledPos);
  const t = scaledPos - index;
  if (index >= numColors - 1) {
    return hexToRgb(colorScale[numColors - 1]);
  }
  const color1 = hexToRgb(colorScale[index]);
  const color2 = hexToRgb(colorScale[index + 1]);
  return {
    r: color1.r + (color2.r - color1.r) * t,
    g: color1.g + (color2.g - color1.g) * t,
    b: color1.b + (color2.b - color1.b) * t
  };
}

// ============================================================
// CANVAS RASTERIZATION & TEXTURE MAPPING
// ============================================================
function lonLatToCanvas(lon, lat, width, height) {
  return [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
}

function drawFeatureOnCanvas(ctx, feature, width, height) {
  const geometry = feature.geometry;
  if (!geometry) return;
  
  ctx.beginPath();
  const drawRings = (rings) => {
    const outer = rings[0];
    const [sx, sy] = lonLatToCanvas(outer[0][0], outer[0][1], width, height);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < outer.length; i++) {
      const [x, y] = lonLatToCanvas(outer[i][0], outer[i][1], width, height);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    for (let i = 1; i < rings.length; i++) {
      const hole = rings[i];
      const [hx, hy] = lonLatToCanvas(hole[0][0], hole[0][1], width, height);
      ctx.moveTo(hx, hy);
      for (let j = 1; j < hole.length; j++) {
        const [x, y] = lonLatToCanvas(hole[j][0], hole[j][1], width, height);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
  };

  if (geometry.type === 'Polygon') drawRings(geometry.coordinates);
  else if (geometry.type === 'MultiPolygon') {
    for (const poly of geometry.coordinates) drawRings(poly);
  }
  ctx.fill('evenodd');
}

function renderColorMapCanvas() {
  const width = 2048, height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = `rgb(${Math.round(OCEAN_COLOR.r*255)}, ${Math.round(OCEAN_COLOR.g*255)}, ${Math.round(OCEAN_COLOR.b*255)})`;
  ctx.fillRect(0, 0, width, height);
  
  for (const feature of state.geoData) {
    if (feature._isVirtual || !feature.geometry) continue;
    const id = feature.properties?.name || feature.id || '';
    const value = state.metricDataMap.get(id);
    let color = value !== undefined 
      ? interpolateColor(value, state.activeMetric.colorScale, state.activeMetric.domain)
      : hexToRgb('#334155');
      
    ctx.fillStyle = `rgb(${Math.round(color.r*255)}, ${Math.round(color.g*255)}, ${Math.round(color.b*255)})`;
    drawFeatureOnCanvas(ctx, feature, width, height);
  }
  return canvas;
}

function buildPickingMap() {
  const width = 2048, height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  state.renderableFeatures = [];
  let index = 1;
  for (const feature of state.geoData) {
    if (feature._isVirtual || !feature.geometry) continue;
    
    const r = (index >> 16) & 0xFF;
    const g = (index >> 8) & 0xFF;
    const b = index & 0xFF;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    drawFeatureOnCanvas(ctx, feature, width, height);
    
    state.renderableFeatures.push(feature);
    feature._pickingIndex = index;
    index++;
  }
  
  state.pickingCanvas = canvas;
  state.pickingCtx = ctx;
}

function updateGlobeTexture() {
  const { gl } = state;
  const colorCanvas = renderColorMapCanvas();
  
  if (!state.colorTexture) {
    state.colorTexture = gl.createTexture();
  }
  
  gl.bindTexture(gl.TEXTURE_2D, state.colorTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, colorCanvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function getFeatureAtLonLat(lon, lat) {
  if (!state.pickingCtx) return null;
  const px = Math.floor(((lon + 180) / 360) * state.pickingCanvas.width);
  const py = Math.floor(((90 - lat) / 180) * state.pickingCanvas.height);
  
  const cpx = Math.max(0, Math.min(state.pickingCanvas.width - 1, px));
  const cpy = Math.max(0, Math.min(state.pickingCanvas.height - 1, py));
  
  const pixel = state.pickingCtx.getImageData(cpx, cpy, 1, 1).data;
  const index = (pixel[0] << 16) | (pixel[1] << 8) | pixel[2];
  
  if (index === 0) return null;
  return state.renderableFeatures[index - 1];
}

// ============================================================
// GEOMETRY GENERATION
// ============================================================
function createSphereMesh(gl) {
  const { sphereLatSegments, sphereLonSegments } = state;
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let latIdx = 0; latIdx <= sphereLatSegments; latIdx++) {
    for (let lonIdx = 0; lonIdx <= sphereLonSegments; lonIdx++) {
      const [lon, lat] = gridToGeographic(latIdx, lonIdx, sphereLatSegments, sphereLonSegments);
      const [x, y, z] = sphericalToCartesian(lon, lat);
      
      vertices.push(x, y, z);
      uvs.push((lon + 180) / 360, (90 - lat) / 180);
    }
  }

  for (let latIdx = 0; latIdx < sphereLatSegments; latIdx++) {
    for (let lonIdx = 0; lonIdx < sphereLonSegments; lonIdx++) {
      const first = latIdx * (sphereLonSegments + 1) + lonIdx;
      const second = first + sphereLonSegments + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
  let indexType, indexArray;
  if (state.useUint32 && indices.length > 65535) {
    indexArray = new Uint32Array(indices);
    indexType = gl.UNSIGNED_INT;
  } else {
    indexArray = new Uint16Array(indices);
    indexType = gl.UNSIGNED_SHORT;
  }
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);

  return {
    posBuffer,
    uvBuffer,
    indexBuffer,
    indexCount: indices.length,
    indexType
  };
}

function createBorderLines(gl) {
  const { geoData } = state;
  if (!geoData) return null;
  const vertices = [];

  function addRing(ring) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [lon1, lat1] = ring[i];
      const [lon2, lat2] = ring[i + 1];
      const p1 = sphericalToCartesian(lon1, lat1);
      const p2 = sphericalToCartesian(lon2, lat2);
      vertices.push(p1[0], p1[1], p1[2]);
      vertices.push(p2[0], p2[1], p2[2]);
    }
  }

  function processGeometry(geometry) {
    if (!geometry) return;
    if (geometry.type === 'Polygon') {
      for (const ring of geometry.coordinates) addRing(ring);
    } else if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates) {
        for (const ring of polygon) addRing(ring);
      }
    }
  }

  for (const feature of geoData) {
    if (!feature._isVirtual) processGeometry(feature.geometry);
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return { buffer, vertexCount: vertices.length / 3 };
}

function createHighlightBorder(gl, feature) {
  if (!feature || !feature.geometry) return null;
  const vertices = [];

  function addRing(ring) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [lon1, lat1] = ring[i];
      const [lon2, lat2] = ring[i + 1];
      const p1 = sphericalToCartesian(lon1, lat1);
      const p2 = sphericalToCartesian(lon2, lat2);
      vertices.push(p1[0], p1[1], p1[2]);
      vertices.push(p2[0], p2[1], p2[2]);
    }
  }

  const geometry = feature.geometry;
  if (geometry.type === 'Polygon') {
    for (const ring of geometry.coordinates) addRing(ring);
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      for (const ring of polygon) addRing(ring);
    }
  }

  if (vertices.length === 0) return null;
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return { buffer, vertexCount: vertices.length / 3 };
}

function computeBoundingBox(feature) {
  let minLon = Infinity, maxLon = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  function processRing(ring) {
    for (const [lon, lat] of ring) {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }

  const geometry = feature.geometry;
  if (!geometry) return null;
  if (geometry.type === 'Polygon') {
    for (const ring of geometry.coordinates) processRing(ring);
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      for (const ring of polygon) processRing(ring);
    }
  }
  return { minLon, maxLon, minLat, maxLat };
}

// ============================================================
// RENDERING
// ============================================================
function render() {
  const { gl, width, height, globeProgram, sphereBuffer } = state;
  if (!gl || !globeProgram || !sphereBuffer || !state.colorTexture) return;

  gl.viewport(0, 0, width, height);
  gl.clearColor(0.06, 0.09, 0.16, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  const aspect = width / height;
  const isMobile = window.innerWidth < 768;
  const size = isMobile ? 2.4 : 1.2;

  let yOffset = 0;
  if (isMobile) {
    const header = document.querySelector('.header-panel');
    const footer = document.querySelector('.footer-controls');
    const canvas = state.canvas;
    if (header && footer && canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      const headerBottom = header.getBoundingClientRect().bottom - canvasRect.top;
      const footerTop = footer.getBoundingClientRect().top - canvasRect.top;
      const availableHeight = footerTop - headerBottom;
      const availableCenter = headerBottom + availableHeight / 2;
      const canvasCenter = height / 2;
      const pixelOffset = canvasCenter - availableCenter;
      yOffset = (pixelOffset / height) * (2 * size);
    }
  }

  const projectionMatrix = createOrthographicMatrix(
    -size * aspect, size * aspect,
    -size - yOffset, size - yOffset,
    -10, 10
  );

  const modelViewMatrix = state.rotationMatrix || createIdentityMatrix();

  // Draw Globe
  gl.useProgram(globeProgram);
  const gLoc = globeProgram.loc;
  gl.uniformMatrix4fv(gLoc.uProjectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(gLoc.uModelViewMatrix, false, modelViewMatrix);
  gl.uniform3fv(gLoc.uLightDirection, new Float32Array([0.5, 0.7, 1.0]));
  gl.uniform1f(gLoc.uAmbient, 0.4);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, state.colorTexture);
  gl.uniform1i(gLoc.uColorMap, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer.posBuffer);
  gl.enableVertexAttribArray(gLoc.aPosition);
  gl.vertexAttribPointer(gLoc.aPosition, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer.uvBuffer);
  gl.enableVertexAttribArray(gLoc.aUV);
  gl.vertexAttribPointer(gLoc.aUV, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBuffer.indexBuffer);
  gl.drawElements(gl.TRIANGLES, sphereBuffer.indexCount, sphereBuffer.indexType, 0);

  // Draw Borders
  if (state.borderProgram && state.borderBuffer) {
    gl.useProgram(state.borderProgram);
    const bLoc = state.borderProgram.loc;
    gl.uniformMatrix4fv(bLoc.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(bLoc.uModelViewMatrix, false, modelViewMatrix);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, state.borderBuffer.buffer);
    gl.enableVertexAttribArray(bLoc.aPosition);
    gl.vertexAttribPointer(bLoc.aPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.CULL_FACE);
    gl.drawArrays(gl.LINES, 0, state.borderBuffer.vertexCount);
    gl.disable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
  }

  // Draw Highlight
  if (state.highlightProgram && state.highlightBuffer) {
    gl.useProgram(state.highlightProgram);
    const hLoc = state.highlightProgram.loc;
    gl.uniformMatrix4fv(hLoc.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(hLoc.uModelViewMatrix, false, modelViewMatrix);
    gl.uniform3fv(hLoc.uHighlightColor, new Float32Array([1.0, 0.85, 0.2]));
    
    gl.bindBuffer(gl.ARRAY_BUFFER, state.highlightBuffer.buffer);
    gl.enableVertexAttribArray(hLoc.aPosition);
    gl.vertexAttribPointer(hLoc.aPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.CULL_FACE);
    gl.lineWidth(2.0);
    gl.drawArrays(gl.LINES, 0, state.highlightBuffer.vertexCount);
    gl.disable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
  }

  // Draw Capital Marker
  if (state.markerProgram && state.capitalMarkerBuffer) {
    gl.useProgram(state.markerProgram);
    const mLoc = state.markerProgram.loc;
    gl.uniformMatrix4fv(mLoc.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(mLoc.uModelViewMatrix, false, modelViewMatrix);
    gl.uniform3fv(mLoc.uMarkerColor, new Float32Array([1.0, 0.3, 0.1]));
    gl.uniform1f(mLoc.uPointSize, 16.0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, state.capitalMarkerBuffer.buffer);
    gl.enableVertexAttribArray(mLoc.aPosition);
    gl.vertexAttribPointer(mLoc.aPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.POINTS, 0, state.capitalMarkerBuffer.vertexCount);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
  }
}

// ============================================================
// ANIMATION
// ============================================================
let lastTime = 0;
function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  processPendingHover();

  if (state.isPlaying && !state.isDragging) {
    state.rotation[0] += 0.015 * delta;
    if (state.rotation[0] > 360) state.rotation[0] -= 360;
    updateRotationMatrix();
  }

  render();
  state.animationId = requestAnimationFrame(animate);
}

// ============================================================
// INTERACTION HANDLERS
// ============================================================
function handlePointerDown(e) {
  e.preventDefault();
  state.isDragging = true;
  const point = getPointerPosition(e);
  state.lastPointer = point;
  state.dragStartPointer = point;
}

function handlePointerMove(e) {
  const point = getPointerPosition(e);
  if (state.isDragging && state.lastPointer) {
    const dx = point.x - state.lastPointer.x;
    const dy = point.y - state.lastPointer.y;
    const sensitivity = 0.3;
    
    state.rotation[0] += dx * sensitivity;
    if (state.rotation[0] > 360) state.rotation[0] -= 360;
    if (state.rotation[0] < 0) state.rotation[0] += 360;
    
    state.rotation[1] = Math.max(MIN_PHI, Math.min(MAX_PHI, state.rotation[1] + dy * sensitivity));
    updateRotationMatrix();
    state.lastPointer = point;
  } else {
    throttledUpdateHover(point.x, point.y);
  }
}

function updateRotationMatrix() {
  const [lambda, phi, gamma] = state.rotation.map(d => d * DEG_TO_RAD);
  state.rotationMatrix = createIdentityMatrix();
  state.rotationMatrix = multiplyMatrices(createRotationMatrixX(phi), state.rotationMatrix);
  state.rotationMatrix = multiplyMatrices(createRotationMatrixY(lambda), state.rotationMatrix);
}

let lastHoverTime = 0;
let pendingHover = null;
function throttledUpdateHover(screenX, screenY) {
  const now = performance.now();
  if (now - lastHoverTime < 50) {
    pendingHover = { x: screenX, y: screenY };
    return;
  }
  lastHoverTime = now;
  pendingHover = null;
  updateHover(screenX, screenY);
}

function processPendingHover() {
  if (pendingHover && !state.isDragging) {
    const now = performance.now();
    if (now - lastHoverTime >= 50) {
      lastHoverTime = now;
      updateHover(pendingHover.x, pendingHover.y);
      pendingHover = null;
    }
  }
}

function updateHover(screenX, screenY) {
  const { width, height, radius, rotationMatrix, visualCenterY } = state;
  const cx = width / 2;
  const cy = visualCenterY ?? height / 2;

  const dx = screenX - cx;
  const dy = screenY - cy;
  if (dx * dx + dy * dy > radius * radius) {
    if (state.hoveredFeature) {
      state.hoveredFeature = null;
      updateHighlightBuffer(null);
      state.canvas.style.cursor = 'default';
    }
    return;
  }

  const coords = unproject(screenX, screenY, rotationMatrix, cx, cy, radius);
  if (!coords) {
    if (state.hoveredFeature) {
      state.hoveredFeature = null;
      updateHighlightBuffer(null);
      state.canvas.style.cursor = 'default';
    }
    return;
  }

  const [lon, lat] = coords;
  const found = getFeatureAtLonLat(lon, lat);

  const currentId = state.hoveredFeature?.id || state.hoveredFeature?.properties?.name;
  const newId = found?.id || found?.properties?.name;
  if (currentId !== newId) {
    state.hoveredFeature = found;
    updateHighlightBuffer(found);
    state.canvas.style.cursor = found ? 'pointer' : 'default';
  }
}

function updateHighlightBuffer(feature) {
  const { gl } = state;
  if (state.highlightBuffer) {
    gl.deleteBuffer(state.highlightBuffer.buffer);
    state.highlightBuffer = null;
  }
  if (feature && state.highlightProgram) {
    state.highlightBuffer = createHighlightBorder(gl, feature);
  }
}

function handlePointerUp(e) {
  if (state.isDragging && state.dragStartPointer) {
    const point = getPointerPosition(e);
    const dx = Math.abs(point.x - state.dragStartPointer.x);
    const dy = Math.abs(point.y - state.dragStartPointer.y);
    if (dx < 5 && dy < 5) {
      handleClick(point.x, point.y);
    }
  }
  state.isDragging = false;
  state.lastPointer = null;
  state.dragStartPointer = null;
}

function handlePointerLeave() {
  state.isDragging = false;
  state.lastPointer = null;
  state.dragStartPointer = null;
  if (state.hoveredFeature) {
    state.hoveredFeature = null;
    updateHighlightBuffer(null);
    state.canvas.style.cursor = 'default';
  }
}

function handleClick(screenX, screenY) {
  const { width, height, radius, rotationMatrix, visualCenterY } = state;
  const cx = width / 2;
  const cy = visualCenterY ?? height / 2;

  const dx = screenX - cx;
  const dy = screenY - cy;
  if (dx * dx + dy * dy > radius * radius) {
    closeCountryPanel();
    return;
  }

  const coords = unproject(screenX, screenY, rotationMatrix, cx, cy, radius);
  if (!coords) {
    closeCountryPanel();
    return;
  }

  const [lon, lat] = coords;
  const found = getFeatureAtLonLat(lon, lat);
  
  if (found) {
    selectCountry(found);
  } else {
    closeCountryPanel();
  }
}

function updateCapitalMarkerBuffer(countryName, featureId) {
  const { gl } = state;
  if (state.capitalMarkerBuffer) {
    gl.deleteBuffer(state.capitalMarkerBuffer.buffer);
    state.capitalMarkerBuffer = null;
  }
  state.capitalCoords = null;

  const capitalData = capitalCitiesDataLoaded ? 
    (capitalCitiesDataLoaded[countryName] || capitalCitiesDataLoaded[featureId]) : null;
  if (!capitalData || !state.markerProgram) return;

  state.capitalCoords = capitalData;
  const lat = capitalData.latitude;
  const lon = capitalData.longitude;
  const [x, y, z] = sphericalToCartesian(lon, lat);

  const positions = new Float32Array([x, y, z]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  state.capitalMarkerBuffer = { buffer: buffer, vertexCount: 1 };
}

function selectCountry(feature) {
  state.selectedCountry = feature;
  state.isPlaying = false;
  updatePlayButton();

  const countryName = feature.properties?.name || 'Unknown';
  const featureId = feature.id || '';
  updateCapitalMarkerBuffer(countryName, featureId);
  openCountryPanel(feature);
}

function openCountryPanel(feature) {
  const panel = document.getElementById('country-panel');
  const nameEl = document.getElementById('country-name');
  const metricLabel = document.getElementById('panel-metric-label');
  const metricDesc = document.getElementById('panel-metric-description');
  const scoreBar = document.getElementById('score-bar');
  const population = document.getElementById('stat-population');
  const rank = document.getElementById('stat-rank');
  const countryName = feature.properties?.name || 'Unknown';

  nameEl.textContent = countryName;
  metricLabel.textContent = state.activeMetric.label;
  metricDesc.textContent = state.activeMetric.panelDescription || '';

  const id = feature.properties?.name || feature.id || '';
  const value = state.metricDataMap.get(id);
  const { domain, colorScale } = state.activeMetric;

  let scorePercent = 50;
  if (value !== undefined) {
    scorePercent = ((value - domain[0]) / (domain[1] - domain[0])) * 100;
    scorePercent = Math.max(0, Math.min(100, scorePercent));
  }

  const colorIndex = Math.min(
    colorScale.length - 1,
    Math.floor((scorePercent / 100) * (colorScale.length - 1))
  );
  scoreBar.style.width = scorePercent.toFixed(0) + '%';
  scoreBar.style.backgroundColor = colorScale[colorIndex];

  let valueDisplay;
  if (value !== undefined && state.activeMetric.valueFormat) {
    const formattedValue = Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1);
    valueDisplay = state.activeMetric.valueFormat.replace('{value}', formattedValue);
  } else if (value !== undefined) {
    valueDisplay = value.toFixed(1);
  } else {
    valueDisplay = 'No data';
  }
  metricLabel.textContent = `${state.activeMetric.label}: ${valueDisplay}`;

  const metricId = state.activeMetric.id;
  const originalData = metricsData[metricId]?.originalData || [];
  const rankOrder = state.activeMetric.rankOrder || 'descending';
  const sortedCountries = [...originalData]
    .sort((a, b) => rankOrder === 'ascending' ? a.value - b.value : b.value - a.value);
  const totalCountries = sortedCountries.length;
  const rankIndex = sortedCountries.findIndex(entry => {
    if (entry.country === countryName || entry.country === id) return true;
    const aliases = metricsData[metricId]?.aliases?.[entry.country];
    return aliases && (aliases.includes(countryName) || aliases.includes(id));
  });
  const rankValue = rankIndex >= 0 ? rankIndex + 1 : '--';
  rank.textContent = rankIndex >= 0 ? `${rankValue}/${totalCountries}` : '--';

  const capitalData = capitalCitiesDataLoaded ? 
    (capitalCitiesDataLoaded[countryName] || capitalCitiesDataLoaded[id]) : null;
  const popData = capitalData?.population;

  if (popData !== undefined) {
    if (popData >= 1000) {
      population.textContent = (popData / 1000).toFixed(2) + 'B';
    } else if (popData >= 1) {
      population.textContent = popData.toFixed(1) + 'M';
    } else {
      population.textContent = (popData * 1000).toFixed(0) + 'K';
    }
  } else {
    population.textContent = 'N/A';
  }

  const capitalEl = document.getElementById('stat-capital');
  const coordsEl = document.getElementById('stat-coordinates');
  const sourceYearEl = document.getElementById('stat-source-year');

  if (capitalData) {
    capitalEl.textContent = capitalData.capital;
    const latDir = capitalData.latitude >= 0 ? 'N' : 'S';
    const lonDir = capitalData.longitude >= 0 ? 'E' : 'W';
    coordsEl.textContent = `${Math.abs(capitalData.latitude).toFixed(1)}°${latDir}, ${Math.abs(capitalData.longitude).toFixed(1)}°${lonDir}`;
  } else {
    capitalEl.textContent = 'N/A';
    coordsEl.textContent = 'N/A';
  }

  const yearMap = metricsData[metricId]?.yearMap || {};
  const sourceYear = yearMap[countryName] || yearMap[id];
  sourceYearEl.textContent = sourceYear !== undefined ? sourceYear : 'N/A';

  panel.classList.add('open');
}

function closeCountryPanel() {
  const panel = document.getElementById('country-panel');
  panel.classList.remove('open');
  state.selectedCountry = null;
  state.isPlaying = true;
  updatePlayButton();

  if (state.capitalMarkerBuffer) {
    state.gl.deleteBuffer(state.capitalMarkerBuffer.buffer);
    state.capitalMarkerBuffer = null;
  }
  state.capitalCoords = null;
}

function getPointerPosition(e) {
  const rect = state.canvas.getBoundingClientRect();
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  }
  if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX - rect.left, y: e.changedTouches[0].clientY - rect.top };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

// ============================================================
// UI MANAGEMENT
// ============================================================
function updateMetricButtons() {
  const container = document.getElementById('metric-buttons');
  if (!container) return;
  container.innerHTML = '';
  for (const metric of METRICS) {
    const btn = document.createElement('button');
    btn.className = 'metric-btn' + (state.activeMetric.id === metric.id ? ' active' : '');
    btn.textContent = metric.label;
    btn.addEventListener('click', () => {
      state.activeMetric = metric;
      generateMetricData();
      rebuildSphere();
      updateMetricButtons();
      updateLegend();
      updateHeader();
      if (state.selectedCountry) {
        openCountryPanel(state.selectedCountry);
      }
    });
    container.appendChild(btn);
  }
}

function updateLegend() {
  const container = document.getElementById('legend-gradient');
  const lowLabel = document.getElementById('legend-low');
  const highLabel = document.getElementById('legend-high');
  if (!container || !state.activeMetric) return;
  container.innerHTML = '';
  for (const color of state.activeMetric.colorScale) {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    container.appendChild(div);
  }
  if (lowLabel && highLabel) {
    lowLabel.textContent = state.activeMetric.legendLow || state.activeMetric.domain[0].toString();
    highLabel.textContent = state.activeMetric.legendHigh || state.activeMetric.domain[1].toString();
  }
}

function updateHeader() {
  const titleEl = document.getElementById('header-title');
  const descEl = document.getElementById('header-description');
  if (!titleEl || !descEl || !state.activeMetric) return;
  titleEl.textContent = state.activeMetric.title || state.activeMetric.label;
  descEl.textContent = state.activeMetric.headerDescription || '';
}

function updatePlayButton() {
  const btn = document.getElementById('play-btn');
  if (!btn) return;
  if (state.isPlaying) {
    btn.innerHTML = `<svg class="icon icon-filled" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect></svg>`;
  } else {
    btn.innerHTML = `<svg class="icon icon-filled" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="currentColor"></polygon></svg>`;
  }
}

// ============================================================
// COUNTRY LIST PANEL
// ============================================================
function openCountryList() {
  const panel = document.getElementById('country-list-panel');
  const backdrop = document.getElementById('country-list-backdrop');
  const searchInput = document.getElementById('country-search');
  if (panel && backdrop) {
    panel.classList.add('open');
    backdrop.classList.add('open');
    populateCountryList();
    setTimeout(() => { if (searchInput) searchInput.focus(); }, 300);
  }
}

function closeCountryList() {
  const panel = document.getElementById('country-list-panel');
  const backdrop = document.getElementById('country-list-backdrop');
  const searchInput = document.getElementById('country-search');
  if (panel && backdrop) {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    if (searchInput) searchInput.value = '';
  }
}

function populateCountryList(filter = '') {
  const listContainer = document.getElementById('country-list');
  if (!listContainer || !state.geoData) return;

  const countries = state.geoData
    .map(feature => {
      const name = feature.properties?.name || feature.id || '';
      const value = state.metricDataMap.get(name);
      return { name, value, feature };
    })
    .filter(c => c.name && c.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const filterLower = filter.toLowerCase();
  const filtered = filter ? countries.filter(c => c.name.toLowerCase().includes(filterLower)) : countries;

  if (filtered.length === 0) {
    listContainer.innerHTML = '<div class="country-list-empty">No countries found</div>';
    return;
  }

  listContainer.innerHTML = filtered.map(c => {
    let valueDisplay;
    if (c.value !== undefined && state.activeMetric.valueFormat) {
      const formattedValue = Number.isInteger(c.value) ? c.value.toLocaleString() : c.value.toFixed(1);
      const formatted = state.activeMetric.valueFormat.replace('{value}', formattedValue);
      valueDisplay = `<span class="country-list-item-value">${formatted}</span>`;
    } else if (c.value !== undefined) {
      valueDisplay = `<span class="country-list-item-value">${c.value.toFixed(1)}</span>`;
    } else {
      valueDisplay = '<span class="country-list-item-nodata">No data</span>';
    }
    return `<button class="country-list-item" data-country="${c.name}"><span class="country-list-item-name">${c.name}</span>${valueDisplay}</button>`;
  }).join('');

  listContainer.querySelectorAll('.country-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const countryName = item.dataset.country;
      selectCountryByName(countryName);
      closeCountryList();
    });
  });
}

function selectCountryByName(name) {
  if (!state.geoData) return;
  const feature = state.geoData.find(f => (f.properties?.name || f.id) === name);
  if (feature) {
    selectCountry(feature);
    rotateToCountry(feature);
  }
}

function rotateToCountry(feature) {
  const countryName = feature.properties?.name || feature.id || '';
  const capitalData = capitalCitiesDataLoaded ?
    (capitalCitiesDataLoaded[countryName] || capitalCitiesDataLoaded[feature.id]) : null;
  let centerLon, centerLat;

  if (capitalData) {
    centerLon = capitalData.longitude;
    centerLat = capitalData.latitude;
  } else {
    const bounds = computeBoundingBox(feature);
    if (!bounds) return;
    centerLon = (bounds.minLon + bounds.maxLon) / 2;
    centerLat = (bounds.minLat + bounds.maxLat) / 2;
  }

  state.rotation[0] = -centerLon + 90;
  if (state.rotation[0] > 360) state.rotation[0] -= 360;
  if (state.rotation[0] < 0) state.rotation[0] += 360;

  const isMobile = window.innerWidth < 768;
  let targetPhi = centerLat * 0.667;
  if (isMobile) targetPhi -= 20;
  state.rotation[1] = Math.max(MIN_PHI, Math.min(MAX_PHI, targetPhi));
  updateRotationMatrix();
}

function setupEventListeners() {
  const canvas = state.canvas;
  canvas.addEventListener('mousedown', handlePointerDown);
  canvas.addEventListener('mousemove', handlePointerMove);
  canvas.addEventListener('mouseup', handlePointerUp);
  canvas.addEventListener('mouseleave', handlePointerLeave);
  canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
  canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
  canvas.addEventListener('touchend', handlePointerUp, { passive: false });
  canvas.addEventListener('touchcancel', handlePointerLeave);

  const playBtn = document.getElementById('play-btn');
  if (playBtn) playBtn.addEventListener('click', () => { state.isPlaying = !state.isPlaying; updatePlayButton(); });

  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCountryPanel);

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetCamera);

  const listBtn = document.getElementById('list-btn');
  if (listBtn) listBtn.addEventListener('click', openCountryList);

  const closeListBtn = document.getElementById('close-list-btn');
  if (closeListBtn) closeListBtn.addEventListener('click', closeCountryList);

  const listBackdrop = document.getElementById('country-list-backdrop');
  if (listBackdrop) listBackdrop.addEventListener('click', closeCountryList);

  const searchInput = document.getElementById('country-search');
  if (searchInput) searchInput.addEventListener('input', (e) => { populateCountryList(e.target.value); });

  window.addEventListener('resize', handleResize);
}

function resetCamera() {
  state.rotation = [0, 20, 0];
  updateRotationMatrix();
}

function handleResize() {
  const canvas = state.canvas;
  const container = canvas.parentElement;
  state.width = container.clientWidth;
  state.height = container.clientHeight;
  canvas.width = state.width;
  canvas.height = state.height;

  const isMobile = window.innerWidth < 768;
  const size = isMobile ? 2.4 : 1.2;
  const aspect = state.width / state.height;
  state.radius = Math.min(state.width / (2 * size * aspect), state.height / (2 * size));

  if (isMobile) {
    const header = document.querySelector('.header-panel');
    const footer = document.querySelector('.footer-controls');
    if (header && footer && canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      const headerBottom = header.getBoundingClientRect().bottom - canvasRect.top;
      const footerTop = footer.getBoundingClientRect().top - canvasRect.top;
      state.visualCenterY = headerBottom + (footerTop - headerBottom) / 2;
    } else {
      state.visualCenterY = state.height / 2;
    }
  } else {
    state.visualCenterY = state.height / 2;
  }
}

// ============================================================
// DATA LOADING & INITIALIZATION
// ============================================================
let metricsData = {};
let capitalCitiesDataLoaded = null;

function generateMetricData() {
  state.metricDataMap.clear();
  if (!state.geoData || !state.activeMetric) return;
  const metricId = state.activeMetric.id;
  const metricData = metricsData[metricId];
  if (!metricData || !metricData.dataMap) return;

  for (const feature of state.geoData) {
    const countryName = feature.properties?.name || feature.id || '';
    const value = metricData.dataMap[countryName];
    if (value !== undefined) {
      state.metricDataMap.set(countryName, value);
      if (feature.id && feature.id !== countryName) {
        state.metricDataMap.set(feature.id, value);
      }
    }
  }
}

async function loadMetricFile(filename) {
  try {
    const response = await fetch(`resources/${filename}`);
    const json = await response.json();
    const metadata = json.metadata;
    const id = metadata.id;
    const dataMap = {};
    const yearMap = {};

    for (const entry of json.data) {
      dataMap[entry.country] = entry.value;
      if (entry.year !== undefined) yearMap[entry.country] = entry.year;
    }

    if (json.aliases) {
      for (const [mainName, aliasList] of Object.entries(json.aliases)) {
        const value = dataMap[mainName];
        const year = yearMap[mainName];
        if (value !== undefined) {
          for (const alias of aliasList) {
            dataMap[alias] = value;
            if (year !== undefined) yearMap[alias] = year;
          }
        }
      }
    }

    metricsData[id] = {
      dataMap, yearMap, metadata,
      originalData: json.data,
      aliases: json.aliases || {}
    };

    return {
      order: metadata.order || 999,
      id: metadata.id,
      label: metadata.label,
      title: metadata.title,
      headerDescription: metadata.displayHeaderText,
      panelDescription: metadata.displayPanelText,
      valueFormat: metadata.displayValueFormat,
      legendLow: metadata.displayLegendLow,
      legendHigh: metadata.displayLegendHigh,
      domain: metadata.range,
      rankOrder: metadata.rankOrder,
      colorScale: metadata.colorScale
    };
  } catch (error) {
    console.error(`Failed to load metric file ${filename}:`, error);
    return null;
  }
}

async function loadMetrics() {
  const metricFiles = ['metric-1.json', 'metric-2.json', 'metric-3.json'];
  METRICS = [];
  for (const filename of metricFiles) {
    const metric = await loadMetricFile(filename);
    if (metric) METRICS.push(metric);
  }
  METRICS.sort((a, b) => (a.order || 999) - (b.order || 999));
  if (METRICS.length > 0) state.activeMetric = METRICS[0];
}

async function loadCapitalCitiesData() {
  try {
    const response = await fetch('resources/capital-cities-data.json?v=' + Date.now());
    const data = await response.json();
    capitalCitiesDataLoaded = {};
    for (const entry of data.capitals) {
      capitalCitiesDataLoaded[entry.country] = {
        capital: entry.capital,
        latitude: entry.latitude,
        longitude: entry.longitude,
        population: entry.population
      };
    }
    return true;
  } catch (error) {
    console.warn('Failed to load capital cities JSON:', error);
    return false;
  }
}

function rebuildSphere() {
  const { gl } = state;
  if (!gl) return;
  if (state.sphereBuffer) {
    gl.deleteBuffer(state.sphereBuffer.posBuffer);
    gl.deleteBuffer(state.sphereBuffer.uvBuffer);
    gl.deleteBuffer(state.sphereBuffer.indexBuffer);
  }
  state.sphereBuffer = createSphereMesh(gl);
  updateGlobeTexture();
}

async function loadGeoData() {
  try {
    const response = await fetch(`resources/world.geojson?v=${Date.now()}`);
    const data = await response.json();
    state.geoData = data.features;
    for (const feature of state.geoData) {
      feature._bounds = computeBoundingBox(feature);
    }
    addVirtualCountries();
    generateMetricData();
  } catch (error) {
    console.error('Failed to load GeoJSON:', error);
  }
}

function addVirtualCountries() {
  if (!capitalCitiesDataLoaded) return;
  const existingNames = new Set(state.geoData.map(f => f.properties?.name || f.id));
  for (const countryName in capitalCitiesDataLoaded) {
    if (!existingNames.has(countryName)) {
      state.geoData.push({
        type: 'Feature',
        properties: { name: countryName },
        geometry: null,
        _isVirtual: true
      });
    }
  }
}

async function init() {
  state.canvas = document.getElementById('globe-canvas');
  state.gl = state.canvas.getContext('webgl', { antialias: true, depth: true, alpha: false });
  if (!state.gl) {
    console.error('WebGL not supported');
    return;
  }
  const gl = state.gl;

  const ext = gl.getExtension('OES_element_index_uint');
  state.useUint32 = !!ext;

  handleResize();
  updateRotationMatrix();

  state.globeProgram = createProgram(gl, GLOBE_VERTEX_SHADER, GLOBE_FRAGMENT_SHADER);
  state.borderProgram = createProgram(gl, BORDER_VERTEX_SHADER, BORDER_FRAGMENT_SHADER);
  state.highlightProgram = createProgram(gl, HIGHLIGHT_VERTEX_SHADER, HIGHLIGHT_FRAGMENT_SHADER);
  state.markerProgram = createProgram(gl, MARKER_VERTEX_SHADER, MARKER_FRAGMENT_SHADER);

  // Cache uniform and attribute locations
  if (state.globeProgram) {
    state.globeProgram.loc = {
      uProjectionMatrix: gl.getUniformLocation(state.globeProgram, 'uProjectionMatrix'),
      uModelViewMatrix: gl.getUniformLocation(state.globeProgram, 'uModelViewMatrix'),
      uLightDirection: gl.getUniformLocation(state.globeProgram, 'uLightDirection'),
      uAmbient: gl.getUniformLocation(state.globeProgram, 'uAmbient'),
      uColorMap: gl.getUniformLocation(state.globeProgram, 'uColorMap'),
      aPosition: gl.getAttribLocation(state.globeProgram, 'aPosition'),
      aUV: gl.getAttribLocation(state.globeProgram, 'aUV')
    };
  }
  if (state.borderProgram) {
    state.borderProgram.loc = {
      uProjectionMatrix: gl.getUniformLocation(state.borderProgram, 'uProjectionMatrix'),
      uModelViewMatrix: gl.getUniformLocation(state.borderProgram, 'uModelViewMatrix'),
      aPosition: gl.getAttribLocation(state.borderProgram, 'aPosition')
    };
  }
  if (state.highlightProgram) {
    state.highlightProgram.loc = {
      uProjectionMatrix: gl.getUniformLocation(state.highlightProgram, 'uProjectionMatrix'),
      uModelViewMatrix: gl.getUniformLocation(state.highlightProgram, 'uModelViewMatrix'),
      uHighlightColor: gl.getUniformLocation(state.highlightProgram, 'uHighlightColor'),
      aPosition: gl.getAttribLocation(state.highlightProgram, 'aPosition')
    };
  }
  if (state.markerProgram) {
    state.markerProgram.loc = {
      uProjectionMatrix: gl.getUniformLocation(state.markerProgram, 'uProjectionMatrix'),
      uModelViewMatrix: gl.getUniformLocation(state.markerProgram, 'uModelViewMatrix'),
      uMarkerColor: gl.getUniformLocation(state.markerProgram, 'uMarkerColor'),
      uPointSize: gl.getUniformLocation(state.markerProgram, 'uPointSize'),
      aPosition: gl.getAttribLocation(state.markerProgram, 'aPosition')
    };
  }

  await loadMetrics();
  await loadCapitalCitiesData();

  updateMetricButtons();
  updateLegend();
  updateHeader();
  updatePlayButton();
  setupEventListeners();

  await loadGeoData();
  
  // Build picking map for O(1) hit testing
  buildPickingMap();
  
  // Build sphere mesh and texture
  rebuildSphere();

  if (state.borderProgram) {
    state.borderBuffer = createBorderLines(gl);
  }

  requestAnimationFrame(animate);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();