import { loadThree } from './three-loader.mjs';
import { DEFAULT_MESSAGE, initialMessage, validateMessage, sampleMask, boundsOf, fitView,
  scatterTargets } from './formation.mjs';
import { ArticulatedCrowd } from './crowd.mjs';

const $ = id => document.getElementById(id);
const viewport = $('viewport');
const input = $('message');
const status = $('status');
const editor = $('editor');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const FONT = '700 120px "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
let crowd, renderer, scene, camera, resizeObserver;
let targetBounds, manualBounds;
let mode = 'formed', paused = false, autoFit = true;
let elevation = Math.PI * .39, azimuth = 0, zoom = 1;
let frame = 0, lastTime = 0, ready = false;
let composing = false, preparing = false;

input.value = initialMessage(location.search);
updateCount();

function setEditor(open) {
  editor.hidden = !open;
  $('edit-button').setAttribute('aria-expanded', String(open));
  if (open) input.focus({ preventScroll: true });
}

function updateCount() {
  $('text-count').textContent = `${Array.from(input.value).length} / 120`;
}

function inputError(message) {
  $('input-error').textContent = message;
  $('input-error').hidden = !message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
}

function setStatus() {
  status.textContent = paused ? 'Taking a breather'
    : crowd?.moving ? (mode === 'formed' ? 'Coming together…' : 'Making room to roam…')
      : mode === 'formed' ? 'Every person in place' : 'A little room to roam';
}

async function textTargets(value) {
  const message = validateMessage(value);
  await document.fonts.load(FONT, message);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Your browser could not prepare the text. Please try again.');
  const lines = message.split('\n');
  context.font = FONT;
  const metrics = lines.map(line => context.measureText(line));
  const width = Math.ceil(Math.max(...metrics.map(m => m.width
    + Math.max(0, -m.actualBoundingBoxLeft) + Math.max(0, m.actualBoundingBoxRight - m.width))));
  canvas.width = width + 64;
  canvas.height = lines.length * 162 + 48;
  context.font = FONT;
  context.fillStyle = '#000';
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  lines.forEach((line, index) => context.fillText(line, canvas.width / 2, 136 + index * 162));
  const mask = context.getImageData(0, 0, canvas.width, canvas.height);
  return { message, points: sampleMask(mask.data, canvas.width, canvas.height,
    Number($('detail').value)) };
}

function aspect() { return Math.max(1, viewport.clientWidth) / Math.max(1, viewport.clientHeight); }

function fitBounds() {
  const current = boundsOf(crowd.people);
  return {
    minX: Math.min(current.minX, targetBounds.minX),
    maxX: Math.max(current.maxX, targetBounds.maxX),
    minZ: Math.min(current.minZ, targetBounds.minZ),
    maxZ: Math.max(current.maxZ, targetBounds.maxZ)
  };
}

function updateCamera() {
  if (!ready) return;
  const ratio = aspect();
  const fit = fitView(autoFit ? fitBounds() : manualBounds, ratio, elevation, azimuth);
  const half = fit.halfHeight / zoom;
  camera.left = -half * ratio; camera.right = half * ratio;
  camera.top = half; camera.bottom = -half;
  camera.position.set(fit.x + Math.sin(azimuth) * Math.cos(elevation) * 600,
    1.1 + Math.sin(elevation) * 600,
    fit.z + Math.cos(azimuth) * Math.cos(elevation) * 600);
  camera.up.set(0, 1, 0);
  // A tiny tilt keeps the overhead camera's up vector unambiguous.
  camera.lookAt(fit.x, 1.1, fit.z);
  camera.updateProjectionMatrix();
}

function draw(now) {
  frame = 0;
  const delta = lastTime ? Math.min((now - lastTime) / 1000, .25) : 0;
  lastTime = now;
  const wasMoving = crowd.moving;
  if (crowd.moving && !paused) crowd.update(delta * Number($('pace').value));
  updateCamera();
  renderer.render(scene, camera);
  if (wasMoving && !crowd.moving) setStatus();
  if (crowd.moving && !paused && !document.hidden) requestDraw();
}

function requestDraw() {
  if (ready && !frame && !document.hidden) frame = requestAnimationFrame(draw);
}

function resize() {
  if (!renderer) return;
  renderer.setSize(Math.max(1, viewport.clientWidth), Math.max(1, viewport.clientHeight), false);
  autoFit = true;
  zoom = 1;
  requestDraw();
}

function move(points, nextMode) {
  targetBounds = boundsOf(points);
  crowd.setCount(points.length, aspect());
  mode = nextMode;
  crowd.moveTo(points, reducedMotion.matches ? 0 : 5.4);
  autoFit = true; zoom = 1; paused = false;
  lastTime = 0;
  $('pause-button').setAttribute('aria-pressed', 'false');
  $('pause-button').setAttribute('aria-label', 'Pause animation');
  $('pause-icon').innerHTML = '<path d="M8 5v14M16 5v14"/>';
  $('scatter-label').textContent = mode === 'formed' ? 'Scatter' : 'Gather';
  setStatus();
  $('people-count').textContent = points.length.toLocaleString();
  requestDraw();
}

async function formMessage(closeEditor = true) {
  if (!ready || composing || preparing) return;
  preparing = true;
  $('form-button').disabled = true;
  try {
    const result = await textTargets(input.value);
    inputError('');
    input.value = result.message;
    updateCount();
    $('message-description').textContent = result.message;
    viewport.setAttribute('aria-label', `A diverse crowd forming: ${result.message}. Drag to orbit and pinch to zoom.`);
    document.title = `${result.message.replace(/\n/g, ' · ')} — Gather`;
    move(result.points, 'formed');
    if (closeEditor) {
      setEditor(false);
      $('edit-button').focus({ preventScroll: true });
    }
  } catch (error) {
    setEditor(true);
    inputError(error.message);
  } finally {
    preparing = false;
    $('form-button').disabled = false;
  }
}

function showError(message) {
  ready = false;
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  $('loading').hidden = true;
  $('error').hidden = false;
  $('error-message').textContent = message;
  status.textContent = 'The crowd needs a moment';
  for (const id of ['scatter-button', 'fit-button', 'view-button', 'pause-button', 'form-button']) {
    $(id).disabled = true;
  }
}

function setupGestures() {
  const pointers = new Map();
  let pinchDistance = 0;
  viewport.addEventListener('pointerdown', event => {
    if (!ready || event.target.closest('button')) return;
    viewport.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    manualBounds = fitBounds(); autoFit = false;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  viewport.addEventListener('pointermove', event => {
    if (!ready || !pointers.has(event.pointerId)) return;
    const previous = pointers.get(event.pointerId);
    const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      azimuth -= dx * .007;
      elevation = Math.max(.45, Math.min(Math.PI / 2 - .001, elevation + dy * .005));
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDistance > 0) zoom = Math.max(.55, Math.min(10, zoom * distance / pinchDistance));
      pinchDistance = distance;
    }
    requestDraw();
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    viewport.addEventListener(type, event => { pointers.delete(event.pointerId); pinchDistance = 0; });
  }
  viewport.addEventListener('wheel', event => {
    if (!ready) return;
    event.preventDefault();
    manualBounds = autoFit ? fitBounds() : manualBounds; autoFit = false;
    zoom = Math.max(.55, Math.min(10, zoom * Math.exp(-event.deltaY * .001)));
    requestDraw();
  }, { passive: false });
}

$('edit-button').addEventListener('click', () => setEditor(editor.hidden));
$('editor').addEventListener('submit', event => { event.preventDefault(); formMessage(); });
input.addEventListener('compositionstart', () => { composing = true; });
input.addEventListener('compositionend', () => { composing = false; updateCount(); });
input.addEventListener('input', () => { updateCount(); inputError(''); });
input.addEventListener('keydown', event => {
  if (event.key === 'Escape') { setEditor(false); $('edit-button').focus(); }
});
$('pace').addEventListener('input', () => {
  const value = Number($('pace').value);
  $('pace-label').textContent = value < .9 ? 'Gentle' : value > 1.3 ? 'Lively' : 'Easy';
});
$('scatter-button').addEventListener('click', () => {
  if (!ready || preparing) return;
  if (mode === 'scattered') formMessage(false);
  else move(scatterTargets(crowd.people.length, aspect()), 'scattered');
});
$('fit-button').addEventListener('click', () => { autoFit = true; zoom = 1; requestDraw(); });
$('view-button').addEventListener('click', () => {
  const overhead = elevation < 1.5;
  elevation = overhead ? Math.PI / 2 - .001 : Math.PI * .39;
  azimuth = 0; autoFit = true; zoom = 1;
  $('view-label').textContent = overhead ? 'Top' : '3D';
  $('view-button').setAttribute('aria-label', overhead ? 'Switch to angled view' : 'Switch to overhead view');
  requestDraw();
});
$('pause-button').addEventListener('click', () => {
  paused = !paused;
  lastTime = 0;
  $('pause-button').setAttribute('aria-pressed', String(paused));
  $('pause-button').setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
  $('pause-icon').innerHTML = paused ? '<path d="m8 5 11 7-11 7V5Z"/>' : '<path d="M8 5v14M16 5v14"/>';
  setStatus(); requestDraw();
});
$('retry').addEventListener('click', () => location.reload());
document.addEventListener('visibilitychange', () => {
  lastTime = 0;
  if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
  else requestDraw();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches && ready && crowd.moving) { crowd.duration = 0; crowd.update(0); setStatus(); requestDraw(); }
});
function viewportHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.visualViewport?.height || window.innerHeight}px`);
}
window.visualViewport?.addEventListener('resize', viewportHeight);
window.addEventListener('resize', viewportHeight);
viewportHeight();

async function start() {
  try {
    const T = await loadThree();
    scene = new T.Scene();
    scene.background = new T.Color(0xf5f4ee);
    camera = new T.OrthographicCamera(-10, 10, 10, -10, .1, 1600);
    renderer = new T.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    viewport.prepend(renderer.domElement);
    scene.add(new T.HemisphereLight(0xffffff, 0x899880, 2.4));
    const light = new T.DirectionalLight(0xfff2dd, 2.2);
    light.position.set(-60, 100, 50);
    scene.add(light);
    const grid = new T.GridHelper(2000, 250, 0xc7cdbb, 0xc7cdbb);
    grid.material.transparent = true;
    grid.material.opacity = .20;
    scene.add(grid);
    crowd = new ArticulatedCrowd(T, scene);
    ready = true;
    let startingMessage = input.value;
    try {
      validateMessage(startingMessage);
    } catch (error) {
      startingMessage = DEFAULT_MESSAGE;
      setEditor(true);
      inputError(error.message);
    }
    const result = await textTargets(startingMessage);
    $('message-description').textContent = result.message;
    viewport.setAttribute('aria-label', `A diverse crowd forming: ${result.message}. Drag to orbit and pinch to zoom.`);
    document.title = `${result.message.replace(/\n/g, ' · ')} — Gather`;
    move(result.points, 'formed');
    $('loading').hidden = true;
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);
    resize();
    setupGestures();
    renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      showError('The graphics connection was interrupted. Tap Try again to restart.');
    });
    window.addEventListener('pagehide', event => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (event.persisted) return;
      resizeObserver.disconnect();
      crowd.dispose();
      grid.geometry.dispose(); grid.material.dispose();
      renderer.dispose();
    });
    window.addEventListener('pageshow', event => {
      if (event.persisted) { lastTime = 0; resize(); }
    });
  } catch (error) {
    console.error('Gather could not start:', error);
    showError('Check your connection and use a browser with WebGL 2 enabled. Then tap Try again.');
  }
}

start();
