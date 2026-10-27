import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as THREE from '../../lib/three.module.js';
import { DEFAULT_MESSAGE, initialMessage, validateMessage, sampleMask,
  boundsOf, fitView, scatterTargets } from '../formation.mjs';
import { ArticulatedCrowd } from '../crowd.mjs';

test('default and raw URL greetings preserve the required lines', () => {
  assert.equal(initialMessage(''), 'Happy 2027');
  assert.equal(initialMessage('?'), DEFAULT_MESSAGE);
  assert.equal(initialMessage('?Chong%20Boo%20Chean%20and%20Family'),
    'Chong Boo Chean and Family\nHappy 2027');
  assert.equal(initialMessage('?%E6%96%B0%E5%B9%B4%E5%BF%AB%E4%B9%90'),
    '新年快乐\nHappy 2027');
  assert.equal(initialMessage('?A+%26+B'), 'A & B\nHappy 2027');
  assert.equal(initialMessage('?%E0%A4'), DEFAULT_MESSAGE);
  assert.equal(initialMessage('?%20%0A'), DEFAULT_MESSAGE);
});

test('validation retains Unicode and explicit lines without silent truncation', () => {
  assert.equal(validateMessage('  我是锺武正\r\nHappy 2027 '),
    '我是锺武正\nHappy 2027');
  assert.throws(() => validateMessage(' \u200b\n'), /Add a message/);
  assert.throws(() => validateMessage('a\nb\nc\nd'), /three lines/);
  assert.throws(() => validateMessage('新'.repeat(121)), /120 characters/);
});

function raster(width, height, predicate) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (predicate(x, y)) data[(y * width + x) * 4 + 3] = 255;
    }
  }
  return data;
}

test('sampling is bounded, repeatable, separated, and retains narrow strokes', () => {
  const mask = raster(160, 100, (x, y) =>
    (x >= 10 && x < 16 && y > 10 && y < 90)
    || (x > 10 && x < 145 && y >= 45 && y < 51)
    || (x >= 140 && x < 146 && y > 10 && y < 90));
  for (const budget of [90, 300, 900, 1800]) {
    const points = sampleMask(mask, 160, 100, budget);
    assert.ok(points.length > 10 && points.length <= budget);
    assert.deepEqual(sampleMask(mask, 160, 100, budget), points);
    const keys = new Set(points.map(p => `${p.x.toFixed(6)}:${p.z.toFixed(6)}`));
    assert.equal(keys.size, points.length);
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        assert.ok(Math.hypot(points[i].x - points[j].x,
          points[i].z - points[j].z) >= .91999);
      }
    }
    assert.ok(points.some(p => p.x < -5));
    assert.ok(points.some(p => p.x > 5));
  }
  assert.throws(() => sampleMask(new Uint8ClampedArray(64), 4, 4, 900),
    /no visible characters/);
  const tiny = raster(10, 10, (x, y) => x === 5 && y === 5);
  assert.equal(sampleMask(tiny, 10, 10, 1800).length, 1);
});

test('all bounding-box corners fit portrait, landscape, rotated and top views', () => {
  const bounds = { minX: -100, maxX: 130, minZ: -34, maxZ: 49 };
  for (const [width, height] of [[320, 568], [360, 800], [390, 844],
    [430, 932], [844, 390], [1440, 750], [320, 120]]) {
    for (const elevation of [.45, Math.PI * .39, Math.PI / 2 - .001]) {
      for (const azimuth of [0, .9, 2.4]) {
        const aspect = width / height;
        const fit = fitView(bounds, aspect, elevation, azimuth);
        const camera = new THREE.OrthographicCamera(-fit.halfHeight * aspect,
          fit.halfHeight * aspect, fit.halfHeight, -fit.halfHeight, .1, 1600);
        camera.position.set(fit.x + Math.sin(azimuth) * Math.cos(elevation) * 600,
          1.1 + Math.sin(elevation) * 600,
          fit.z + Math.cos(azimuth) * Math.cos(elevation) * 600);
        camera.lookAt(fit.x, 1.1, fit.z);
        camera.updateMatrixWorld(true);
        for (const x of [bounds.minX, bounds.maxX]) {
          for (const z of [bounds.minZ, bounds.maxZ]) {
            for (const y of [0, 2.2]) {
              const projected = new THREE.Vector3(x, y, z).project(camera);
              assert.ok(Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1,
                `${width}x${height}, elevation ${elevation}, yaw ${azimuth}`);
            }
          }
        }
      }
    }
  }
});

test('scatter has distinct positions and fits the measured bounds', () => {
  const points = scatterTargets(1800, .46);
  assert.equal(points.length, 1800);
  const bounds = boundsOf(points);
  assert.ok(points.every(p => p.x > bounds.minX && p.x < bounds.maxX
    && p.z > bounds.minZ && p.z < bounds.maxZ));
  assert.equal(new Set(points.map(p => `${p.x}:${p.z}`)).size, points.length);
});

test('arm and leg joints bend, retain segment length, and settle exactly', () => {
  const crowd = new ArticulatedCrowd(THREE, new THREE.Scene());
  crowd.setCount(1, .46);
  crowd.people[0].phase = .3;
  crowd.moveTo([{ x: 10, z: 10 }]);
  crowd.update(1.3);
  for (const arm of crowd.arms) {
    assert.equal(arm.elbow.parent, arm.shoulder);
    assert.equal(arm.wrist.parent, arm.elbow);
    assert.ok(Math.abs(arm.elbow.rotation.x) > .1);
    const a = arm.shoulder.getWorldPosition(new THREE.Vector3());
    const b = arm.elbow.getWorldPosition(new THREE.Vector3());
    const c = arm.wrist.getWorldPosition(new THREE.Vector3());
    assert.ok(Math.abs(a.distanceTo(b) - .25 * crowd.people[0].height) < 1e-8);
    assert.ok(Math.abs(b.distanceTo(c) - .25 * crowd.people[0].height) < 1e-8);
  }
  assert.ok(crowd.legs.some(leg => leg.knee.rotation.x > .05));
  for (const leg of crowd.legs) {
    assert.equal(leg.knee.parent, leg.hip);
    assert.equal(leg.ankle.parent, leg.knee);
  }
  for (let i = 0; i < 3000 && crowd.moving; i++) crowd.update(1 / 60);
  assert.equal(crowd.moving, false);
  assert.equal(crowd.people[0].x, 10);
  assert.equal(crowd.people[0].z, 10);
  for (const mesh of Object.values(crowd.meshes)) {
    assert.ok(mesh.instanceMatrix.array.every(Number.isFinite));
  }
  crowd.moveTo([{ x: -5, z: 7 }], true);
  assert.equal(crowd.moving, false);
  assert.equal(crowd.people[0].x, -5);
  crowd.dispose();
});

test('walking speed stays bounded and short trips arrive before long trips', () => {
  const crowd = new ArticulatedCrowd(THREE, new THREE.Scene());
  crowd.setCount(2, 1);
  crowd.people.forEach((p, i) => {
    p.x = 0; p.z = i * 10; p.height = 1; p.walkSpeed = 1.2;
  });
  crowd.moveTo([{ x: 2, z: 0 }, { x: 20, z: 10 }]);
  const arrival = [null, null];
  for (let tick = 1; tick <= 2400 && crowd.moving; tick++) {
    const previous = crowd.people.map(p => ({ x: p.x, z: p.z }));
    crowd.update(1 / 60, 1.8);
    crowd.people.forEach((p, i) => {
      const speed = Math.hypot(p.x - previous[i].x, p.z - previous[i].z) * 60;
      assert.ok(speed <= 1.65001, `Walking speed was ${speed}`);
      if (p.x === p.toX && p.z === p.toZ && arrival[i] === null) arrival[i] = tick / 60;
    });
  }
  assert.equal(crowd.moving, false);
  assert.ok(Math.abs(arrival[0] - arrival[1]) > 5);
  crowd.dispose();
});

test('walking retains a planted foot and advances its gait with actual travel', () => {
  const crowd = new ArticulatedCrowd(THREE, new THREE.Scene());
  crowd.setCount(1, 1);
  const person = crowd.people[0];
  person.x = 0; person.z = 0; person.height = 1; person.phase = .3;
  crowd.moveTo([{ x: 0, z: 20 }]);
  for (let i = 0; i < 180; i++) {
    const z = person.z, phase = person.stridePhase;
    crowd.update(1 / 60);
    assert.ok(Math.abs((person.stridePhase - phase)
      - (person.z - z) / 1.2 * Math.PI * 2) < 1e-8);
    const soles = crowd.legs.map(leg => new THREE.Vector3(0, -.5, 0)
      .applyMatrix4(leg.ankle.children[1].matrixWorld).y);
    assert.ok(Math.min(...soles) >= -.00001, `Foot below the floor: ${soles}`);
    assert.ok(Math.min(...soles) < .006, `Both feet off the floor: ${soles}`);
  }
  crowd.dispose();
});

test('idle breathing and head movement preserve targets and respect reduced motion', () => {
  const crowd = new ArticulatedCrowd(THREE, new THREE.Scene());
  crowd.setCount(2, 1);
  crowd.people[0].phase = 0; crowd.people[1].phase = Math.PI / 2;
  crowd.moveTo([{ x: 0, z: 0 }, { x: 2, z: 0 }], true);
  const anchors = crowd.people.map(p => ({ x: p.x, z: p.z }));
  const before = crowd.meshes.sphere.instanceMatrix.array.slice();
  crowd.update(1);
  assert.notDeepEqual(crowd.meshes.sphere.instanceMatrix.array, before);
  for (let i = 0; i < 300; i++) crowd.update(1 / 30);
  assert.deepEqual(crowd.people.map(p => ({ x: p.x, z: p.z })), anchors);
  assert.equal(crowd.moving, false);
  crowd.update(0, 1, false);
  const still = crowd.meshes.sphere.instanceMatrix.array.slice();
  crowd.update(1, 1, false);
  assert.deepEqual(crowd.meshes.sphere.instanceMatrix.array, still);
  crowd.dispose();
});

test('resizing preserves people and disposes meshes; final cleanup releases shared assets', () => {
  const scene = new THREE.Scene();
  const crowd = new ArticulatedCrowd(THREE, scene);
  let geometries = 0, materials = 0, meshes = 0;
  Object.values(crowd.geometries).forEach(g => g.addEventListener('dispose', () => geometries++));
  crowd.material.addEventListener('dispose', () => materials++);
  crowd.shadowMaterial.addEventListener('dispose', () => materials++);
  crowd.setCount(100, .46);
  const person = crowd.people[0];
  Object.values(crowd.meshes).forEach(m => m.addEventListener('dispose', () => meshes++));
  crowd.setCount(150, .46);
  assert.equal(crowd.people[0], person);
  assert.equal(meshes, 5);
  assert.equal(geometries, 0);
  assert.equal(scene.children.length, 5);
  assert.ok(new Set(crowd.people.map(p => p.colors.skin)).size > 1);
  assert.ok(new Set(crowd.people.map(p => p.colors.shirt)).size > 1);
  assert.ok(new Set(crowd.people.map(p => p.hairStyle)).size > 1);
  crowd.dispose();
  assert.equal(geometries, 5);
  assert.equal(materials, 2);
  assert.equal(scene.children.length, 0);
});

test('loader uses local Three first, then a matching CDN, and reports total failure', async () => {
  const source = await readFile(new URL('../three-loader.mjs', import.meta.url), 'utf8');
  for (const failures of [0, 1, 2]) {
    const calls = [];
    const context = vm.createContext({});
    const module = new vm.SourceTextModule(source, {
      context,
      importModuleDynamically: async path => {
        calls.push(path);
        if (calls.length <= failures) throw new Error('Network failure');
        const dependency = new vm.SyntheticModule(['REVISION'], function () {
          this.setExport('REVISION', '186');
        }, { context });
        await dependency.link(() => {});
        await dependency.evaluate();
        return dependency;
      }
    });
    await module.link(() => {});
    await module.evaluate();
    if (failures === 2) await assert.rejects(module.namespace.loadThree(), /Network failure/);
    else assert.equal((await module.namespace.loadThree()).REVISION, '186');
    assert.equal(calls[0], '../lib/three.module.js');
    if (failures) assert.equal(calls[1],
      'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js');
  }
});
