import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as THREE from '../../lib/three.module.js';

// Exercise app orchestration with actual Three.js scene objects. Only browser
// services and WebGL drawing are substituted; this is not a visual UI test.
async function boot(search = '', reduced = false, graphicsFailure = false) {
  const elements = new Map();
  const frames = new Map();
  let serial = 0, time = 1000, observer, renderer, reloads = 0;
  class Element {
    constructor() {
      this.listeners = new Map(); this.attributes = new Map();
      this.hidden = false; this.value = ''; this.textContent = '';
      this.style = { setProperty() {} };
    }
    addEventListener(type, callback) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(callback);
    }
    emit(type, extra = {}) {
      for (const callback of this.listeners.get(type) || []) {
        callback({ target: this, preventDefault() {}, ...extra });
      }
    }
    setAttribute(name, value) { this.attributes.set(name, value); }
    getAttribute(name) { return this.attributes.get(name); }
    focus() { document.activeElement = this; }
    prepend(child) { this.canvas = child; }
    closest() { return null; }
    setPointerCapture() {}
  }
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const match of html.matchAll(/id="([^"]+)"/g)) elements.set(match[1], new Element());
  const get = id => elements.get(id);
  get('viewport').clientWidth = 390; get('viewport').clientHeight = 650;
  get('editor').hidden = true; get('error').hidden = true;
  get('input-error').hidden = true; get('detail').value = '1800'; get('pace').value = '1';
  const textDraws = [];
  const document = Object.assign(new Element(), {
    hidden: false, documentElement: new Element(),
    getElementById: get, fonts: { load: async () => [] },
    createElement() {
      const canvas = { width: 1, height: 1 };
      const lines = [];
      const context = {
        measureText: text => ({ width: text.length * 65,
          actualBoundingBoxLeft: 0, actualBoundingBoxRight: text.length * 65 }),
        fillText: (text, x, y) => { lines.push(y); textDraws.push(text); },
        getImageData() {
          const data = new Uint8ClampedArray(canvas.width * canvas.height * 4);
          for (const baseline of lines) {
            for (let y = baseline - 15; y < baseline - 5; y++) {
              for (let x = 33; x < 47; x++) data[(y * canvas.width + x) * 4 + 3] = 255;
            }
          }
          return { data };
        }
      };
      canvas.getContext = () => context;
      return canvas;
    }
  });
  class Renderer {
    constructor() {
      if (graphicsFailure) throw new Error('No graphics context');
      this.domElement = new Element(); this.renders = 0; renderer = this;
    }
    setPixelRatio() {}
    setSize(width, height) { this.size = [width, height]; }
    render(scene, camera) {
      scene.updateMatrixWorld(true); camera.updateMatrixWorld(true);
      this.scene = scene; this.camera = camera; this.renders++;
    }
    dispose() { this.disposed = true; }
  }
  const media = Object.assign(new Element(), { matches: reduced });
  const window = Object.assign(new Element(), {
    innerHeight: 844, visualViewport: Object.assign(new Element(), { height: 844 })
  });
  const context = vm.createContext({
    document, window, location: { search, reload() { reloads++; } },
    matchMedia: () => media, devicePixelRatio: 3,
    ResizeObserver: class {
      constructor(callback) { observer = callback; }
      observe() { observer(); }
      disconnect() {}
    },
    requestAnimationFrame: callback => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: id => frames.delete(id),
    console: { error() {} }
  });
  const modules = new Map();
  async function moduleFor(name) {
    if (modules.has(name)) return modules.get(name);
    let module;
    if (name === 'three-loader.mjs') {
      module = new vm.SyntheticModule(['loadThree'], function () {
        this.setExport('loadThree', async () => ({ ...THREE, WebGLRenderer: Renderer }));
      }, { context });
    } else {
      module = new vm.SourceTextModule(await readFile(new URL(`../${name}`,
        import.meta.url), 'utf8'), { context, identifier: name });
    }
    modules.set(name, module);
    return module;
  }
  const app = await moduleFor('app.mjs');
  await app.link(specifier => moduleFor(specifier.replace('./', '')));
  await app.evaluate();
  const flush = () => new Promise(resolve => setImmediate(resolve));
  await flush();
  function advance(count = 200) {
    for (let i = 0; i < count && frames.size; i++) {
      time += 40;
      const callbacks = [...frames.values()]; frames.clear();
      callbacks.forEach(callback => callback(time));
    }
  }
  return { get, document, window, media, textDraws, frames, flush, advance,
    resize: () => observer(), renderer: () => renderer, reloads: () => reloads };
}

test('URL boot draws exactly the two requested lines and stops when settled', async () => {
  const app = await boot('?Chong%20Boo%20Chean%20and%20Family');
  assert.deepEqual(app.textDraws, ['Chong Boo Chean and Family', 'Happy 2027']);
  assert.equal(app.get('message-description').textContent,
    'Chong Boo Chean and Family\nHappy 2027');
  assert.equal(app.get('error').hidden, true);
  app.advance();
  assert.equal(app.get('status').textContent, 'Every person in place');
  assert.equal(app.frames.size, 0);
});

test('editor preserves Chinese composition, reports invalid input, and forms valid text', async () => {
  const app = await boot();
  app.advance();
  app.get('edit-button').emit('click');
  assert.equal(app.get('editor').hidden, false);
  assert.equal(app.get('edit-button').getAttribute('aria-expanded'), 'true');
  app.get('message').value = '新年快乐\nHappy 2027';
  app.get('message').emit('compositionstart');
  app.get('editor').emit('submit');
  await app.flush();
  assert.equal(app.get('message-description').textContent, 'Happy 2027');
  app.get('message').emit('compositionend');
  app.get('editor').emit('submit');
  await app.flush();
  assert.equal(app.get('message-description').textContent, '新年快乐\nHappy 2027');
  assert.equal(app.get('editor').hidden, true);
  app.get('message').value = '   ';
  app.get('editor').emit('submit');
  await app.flush();
  assert.equal(app.get('input-error').hidden, false);
  assert.match(app.get('input-error').textContent, /Add a message/);
  assert.equal(app.get('message-description').textContent, '新年快乐\nHappy 2027');
});

test('scatter, gather, pause, background, history restoration, and resize remain usable', async () => {
  const app = await boot();
  app.advance();
  app.get('scatter-button').emit('click');
  app.advance(5);
  assert.equal(app.get('scatter-label').textContent, 'Gather');
  app.get('pause-button').emit('click');
  app.advance();
  assert.equal(app.get('status').textContent, 'Taking a breather');
  assert.equal(app.frames.size, 0);
  app.get('pause-button').emit('click');
  app.advance(5);
  app.document.hidden = true;
  app.document.emit('visibilitychange');
  assert.equal(app.frames.size, 0);
  app.document.hidden = false;
  app.document.emit('visibilitychange');
  app.advance();
  assert.equal(app.get('status').textContent, 'A little room to roam');
  app.get('viewport').clientWidth = 844; app.get('viewport').clientHeight = 220;
  app.resize(); app.advance();
  assert.deepEqual(app.renderer().size, [844, 220]);
  app.get('view-button').emit('click'); app.advance();
  assert.equal(app.get('view-label').textContent, 'Top');
  app.window.emit('pagehide', { persisted: true });
  assert.equal(app.renderer().disposed, undefined);
  app.window.emit('pageshow', { persisted: true }); app.advance();
  app.get('scatter-button').emit('click');
  await app.flush(); app.advance();
  assert.equal(app.get('scatter-label').textContent, 'Scatter');
  assert.equal(app.get('status').textContent, 'Every person in place');
});

test('reduced motion settles immediately and graphics failure offers recovery', async () => {
  const reduced = await boot('', true);
  reduced.advance();
  assert.equal(reduced.get('status').textContent, 'Every person in place');
  assert.equal(reduced.frames.size, 0);
  const failed = await boot('', false, true);
  assert.equal(failed.get('error').hidden, false);
  assert.equal(failed.get('loading').hidden, true);
  assert.match(failed.get('error-message').textContent, /WebGL 2/);
  failed.get('retry').emit('click');
  assert.equal(failed.reloads(), 1);
});

test('an oversized URL stays editable while the default crowd still starts', async () => {
  const app = await boot(`?${'x'.repeat(130)}`);
  app.advance();
  assert.equal(app.get('editor').hidden, false);
  assert.match(app.get('input-error').textContent, /120 characters/);
  assert.equal(app.get('message-description').textContent, 'Happy 2027');
  assert.equal(app.get('error').hidden, true);
});
