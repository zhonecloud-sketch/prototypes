import { scatterTargets, spatialOrder } from './formation.mjs';

const SHIRTS = [0xd76349, 0x39796e, 0x455e87, 0xd8a443, 0x8972a6,
  0xd19b8d, 0x69844c, 0xe5ddd0, 0x3c5355];
const SKIN = [0xf0c9a5, 0xd9a373, 0xbe8157, 0x955e40, 0x70442f, 0xe9b499];
const HAIR = [0x282522, 0x49342a, 0x8b6042, 0xc8b592, 0xb2aaa0];
const TROUSERS = [0x364b50, 0x414356, 0x69574a, 0x7d887c];
const choose = array => array[Math.floor(Math.random() * array.length)];

export class ArticulatedCrowd {
  constructor(THREE, scene) {
    this.THREE = THREE;
    this.scene = scene;
    this.people = [];
    this.moving = false;
    this.elapsed = 0;
    this.time = 0;
    this.geometries = {
      box: new THREE.BoxGeometry(1, 1, 1),
      sphere: new THREE.SphereGeometry(1, 6, 4),
      cylinder: new THREE.CylinderGeometry(1, 1, 1, 6),
      cap: new THREE.SphereGeometry(1, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.58),
      shadow: new THREE.CircleGeometry(0.34, 8).rotateX(-Math.PI / 2)
    };
    this.material = new THREE.MeshLambertMaterial();
    this.shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x52604a, transparent: true, opacity: 0.12, depthWrite: false
    });
    this.slots = [];
    this.meshes = {};
    this.root = new THREE.Object3D();
    this.root.rotation.order = 'YXZ';
    this.color = new THREE.Color();
    this.shadowMatrix = new THREE.Matrix4();
    this.makeRig();
    this.rigNodes = [];
    this.root.traverse(node => this.rigNodes.push(node));
  }

  makeRig() {
    const T = this.THREE;
    const node = (parent, x, y, z) => {
      const joint = new T.Object3D();
      joint.position.set(x, y, z);
      parent.add(joint);
      return joint;
    };
    const part = (parent, shape, color, x, y, z, sx, sy, sz) => {
      const object = node(parent, x, y, z);
      object.scale.set(sx, sy, sz);
      this.slots.push({ node: object, shape, color });
      return object;
    };
    this.torso = part(this.root, 'box', 'shirt', 0, 1.09, 0, .44, .53, .25);
    part(this.root, 'box', 'trousers', 0, .76, 0, .36, .18, .23);
    part(this.root, 'sphere', 'skin', 0, 1.40, 0, .08, .1, .08);
    this.head = node(this.root, 0, 1.63, 0);
    part(this.head, 'sphere', 'skin', 0, 0, 0, .19, .22, .18);
    this.hair = part(this.head, 'cap', 'hair', 0, .02, -.015, .202, .22, .197);
    this.bun = part(this.head, 'sphere', 'hair', 0, .16, -.12, .001, .001, .001);
    for (const side of [-1, 1]) {
      part(this.head, 'sphere', 'eyes', side * .065, .02, .164, .023, .025, .017);
    }
    this.arms = [];
    this.legs = [];
    for (const side of [-1, 1]) {
      const shoulder = node(this.root, side * .27, 1.32, 0);
      part(shoulder, 'sphere', 'shirt', 0, 0, 0, .085, .085, .085);
      part(shoulder, 'cylinder', 'shirt', 0, -.125, 0, .065, .25, .065);
      const elbow = node(shoulder, 0, -.25, 0);
      part(elbow, 'sphere', 'skin', 0, 0, 0, .067, .067, .067);
      part(elbow, 'cylinder', 'skin', 0, -.125, 0, .052, .25, .052);
      const wrist = node(elbow, 0, -.25, 0);
      part(wrist, 'sphere', 'skin', 0, 0, 0, .052, .052, .052);
      part(wrist, 'box', 'skin', 0, -.065, 0, .10, .13, .09);
      this.arms.push({ shoulder, elbow, wrist, side });

      const hip = node(this.root, side * .115, .71, 0);
      part(hip, 'sphere', 'trousers', 0, 0, 0, .085, .085, .085);
      part(hip, 'cylinder', 'trousers', 0, -.15, 0, .082, .30, .082);
      const knee = node(hip, 0, -.30, 0);
      part(knee, 'sphere', 'trousers', 0, 0, 0, .075, .075, .075);
      part(knee, 'cylinder', 'trousers', 0, -.15, 0, .064, .30, .064);
      const ankle = node(knee, 0, -.30, 0);
      part(ankle, 'sphere', 'skin', 0, 0, 0, .052, .052, .052);
      part(ankle, 'box', 'shoes', 0, -.055, .05, .15, .10, .26);
      this.legs.push({ hip, knee, ankle, side });
    }
    this.slotCounts = {};
    for (const slot of this.slots) {
      slot.offset = this.slotCounts[slot.shape] || 0;
      this.slotCounts[slot.shape] = slot.offset + 1;
    }
  }

  setCount(count, aspect) {
    if (count === this.people.length) return;
    for (const mesh of Object.values(this.meshes)) {
      this.scene.remove(mesh);
      mesh.dispose();
    }
    this.meshes = {};
    const starts = scatterTargets(count, aspect);
    this.people = Array.from({ length: count }, (_, i) => this.people[i] || {
      x: starts[i].x, z: starts[i].z, yaw: Math.random() * Math.PI * 2,
      height: .86 + Math.random() * .22, width: .88 + Math.random() * .25,
      phase: Math.random() * Math.PI * 2, hairStyle: Math.floor(Math.random() * 4),
      walkSpeed: 1.1 + Math.random() * .25, speed: 0, gait: 0, stridePhase: 0,
      idleGesture: Math.random() < .3,
      colors: { shirt: choose(SHIRTS), skin: choose(SKIN), hair: choose(HAIR),
        trousers: choose(TROUSERS), shoes: 0x303832, eyes: 0x282723 }
    });
    for (const [shape, geometry] of Object.entries(this.geometries)) {
      const slots = shape === 'shadow' ? 1 : this.slotCounts[shape];
      const mesh = new this.THREE.InstancedMesh(geometry,
        shape === 'shadow' ? this.shadowMaterial : this.material, count * slots);
      mesh.instanceMatrix.setUsage(this.THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      this.meshes[shape] = mesh;
      this.scene.add(mesh);
    }
    for (let i = 0; i < count; i++) {
      for (const slot of this.slots) {
        this.color.setHex(this.people[i].colors[slot.color]);
        this.meshes[slot.shape].setColorAt(i * this.slotCounts[slot.shape] + slot.offset, this.color);
      }
    }
  }

  moveTo(targets, immediate = false) {
    const peopleOrder = spatialOrder(this.people);
    const targetOrder = spatialOrder(targets);
    for (let i = 0; i < this.people.length; i++) {
      const p = this.people[peopleOrder[i]];
      const target = targets[targetOrder[i]];
      p.toX = target.x; p.toZ = target.z;
      p.heading = Math.atan2(p.toX - p.x, p.toZ - p.z);
      p.delay = (i % 17) / 17 * .55;
    }
    this.elapsed = 0;
    this.moving = true;
    if (immediate) this.finish();
    else this.update(0);
  }

  finish() {
    for (const p of this.people) {
      p.x = p.toX; p.z = p.toZ;
      p.speed = 0; p.gait = 0; p.yaw = 0;
    }
    this.update(0, 1, false);
  }

  update(delta, pace = 1, idle = true) {
    this.elapsed += delta;
    this.time += delta;
    let moving = false;
    for (let i = 0; i < this.people.length; i++) {
      const p = this.people[i];
      const dx = p.toX - p.x, dz = p.toZ - p.z;
      const distance = Math.hypot(dx, dz);
      const activeDelta = Math.min(delta, Math.max(0, this.elapsed - p.delay));
      const maxSpeed = p.walkSpeed * pace;
      const acceleration = 3 * Math.max(1, pace, p.speed / p.walkSpeed);
      const desiredSpeed = Math.min(maxSpeed, Math.sqrt(2 * acceleration * distance));
      p.speed += Math.sign(desiredSpeed - p.speed)
        * Math.min(Math.abs(desiredSpeed - p.speed), acceleration * activeDelta);
      const travel = Math.min(distance, p.speed * activeDelta);
      if (distance <= travel || distance < .003) {
        p.x = p.toX; p.z = p.toZ; p.speed = 0;
      } else {
        p.x += dx / distance * travel;
        p.z += dz / distance * travel;
        moving = true;
      }
      const runBlend = Math.max(0, Math.min(1, (p.speed / p.height - 1.6)));
      const run = runBlend * runBlend * (3 - 2 * runBlend);
      const strideLength = Math.max((1.2 + run * 1.6) * p.height, p.speed / 2);
      p.stridePhase += travel / strideLength * Math.PI * 2;
      const gait = Math.min(1, p.speed / .65);
      p.gait += (gait - p.gait) * (1 - Math.exp(-delta * 9));
      const stride = Math.sin(p.stridePhase + p.phase) * p.gait;
      const idleAmount = idle ? 1 - p.gait : 0;
      const breath = Math.sin(this.time * 1.4 + p.phase) * .02 * idleAmount;
      const sway = Math.sin(this.time * .7 + p.phase) * idleAmount;
      const gestureTime = (this.time + p.phase * 1.5) % 12;
      const gesture = p.idleGesture && gestureTime > 2 && gestureTime < 5
        ? Math.sin((gestureTime - 2) / 3 * Math.PI) ** 2 * idleAmount : 0;
      const targetYaw = distance > .5 ? p.heading : 0;
      const turn = Math.atan2(Math.sin(targetYaw - p.yaw), Math.cos(targetYaw - p.yaw));
      p.yaw += turn * (1 - Math.exp(-delta * 5));
      // Walking keeps a stance foot planted; running adds a flight phase.
      const hipSwing = .5 + run * .3;
      const idleLean = p.speed === 0 ? sway * .055 : 0;
      this.root.position.set(p.x,
        (-.6 * (1 - Math.cos(stride * hipSwing))
          + Math.abs(Math.sin(idleLean)) * .19) * p.height, p.z);
      this.root.rotation.set(run * .16, p.yaw, idleLean);
      this.root.scale.setScalar(p.height);
      this.torso.scale.x = .44 * p.width;
      this.torso.scale.y = .53 * (1 + breath);
      this.torso.rotation.z = sway * .025;
      this.head.rotation.set(sway * .07,
        Math.sin(this.time * .45 + p.phase) * .25 * idleAmount, 0);
      this.hair.scale.set(.202 * (p.hairStyle === 1 ? 1.15 : 1),
        p.hairStyle === 2 ? .29 : .22, .197);
      this.bun.scale.setScalar(p.hairStyle === 3 ? .095 : .001);
      for (const arm of this.arms) {
        const wave = arm.side === (p.phase < Math.PI ? -1 : 1) ? gesture : 0;
        arm.shoulder.rotation.set(stride * arm.side * (.45 + run * .3)
          + sway * .045 - wave * .25, 0, arm.side * (.09 + breath + wave * 1.4));
        arm.elbow.rotation.x = -.16 - run * .7
          - Math.max(0, stride * arm.side) * .55 + sway * .06 - wave * .8;
        arm.wrist.rotation.x = stride * .05 + sway * .06
          + wave * Math.sin(this.time * 9 + p.phase) * .35;
      }
      for (const leg of this.legs) {
        const swing = stride * leg.side;
        leg.hip.rotation.x = -swing * hipSwing;
        leg.knee.rotation.x = Math.max(0, swing) * (1.2 + run * .4) + run * .15;
        leg.ankle.rotation.x = -leg.hip.rotation.x - leg.knee.rotation.x;
      }
      this.root.updateMatrixWorld(true);
      if (run > 0) {
        let lowestSole = Infinity;
        for (const leg of this.legs) {
          const m = leg.ankle.children[1].matrixWorld.elements;
          lowestSole = Math.min(lowestSole,
            m[13] - (Math.abs(m[1]) + Math.abs(m[5]) + Math.abs(m[9])) / 2);
        }
        const flight = Math.max(0, Math.sin(p.stridePhase * 2 + p.phase * 2)) ** 2 * .16;
        const lift = ((.005 + flight) * p.height - lowestSole) * run;
        this.root.position.y += lift;
        this.root.updateMatrix();
        for (const node of this.rigNodes) node.matrixWorld.elements[13] += lift;
      }
      for (const slot of this.slots) {
        this.meshes[slot.shape].setMatrixAt(i * this.slotCounts[slot.shape] + slot.offset,
          slot.node.matrixWorld);
      }
      this.shadowMatrix.makeScale(p.height, 1, p.height);
      this.shadowMatrix.setPosition(p.x, .008, p.z);
      this.meshes.shadow.setMatrixAt(i, this.shadowMatrix);
    }
    for (const mesh of Object.values(this.meshes)) mesh.instanceMatrix.needsUpdate = true;
    this.moving = moving;
    return moving;
  }

  dispose() {
    for (const mesh of Object.values(this.meshes)) {
      this.scene.remove(mesh);
      mesh.dispose();
    }
    for (const geometry of Object.values(this.geometries)) geometry.dispose();
    this.material.dispose();
    this.shadowMaterial.dispose();
  }
}
