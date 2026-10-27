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
    this.duration = 0;
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
    this.color = new THREE.Color();
    this.shadowMatrix = new THREE.Matrix4();
    this.makeRig();
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
    part(this.root, 'sphere', 'skin', 0, 1.63, 0, .19, .22, .18);
    this.hair = part(this.root, 'cap', 'hair', 0, 1.65, -.015, .202, .22, .197);
    this.bun = part(this.root, 'sphere', 'hair', 0, 1.79, -.12, .001, .001, .001);
    for (const side of [-1, 1]) {
      part(this.root, 'sphere', 'eyes', side * .065, 1.65, .164, .023, .025, .017);
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

  moveTo(targets, duration) {
    const peopleOrder = spatialOrder(this.people);
    const targetOrder = spatialOrder(targets);
    for (let i = 0; i < this.people.length; i++) {
      const p = this.people[peopleOrder[i]];
      const target = targets[targetOrder[i]];
      p.fromX = p.x; p.fromZ = p.z;
      p.toX = target.x; p.toZ = target.z;
      p.distance = Math.hypot(p.toX - p.x, p.toZ - p.z);
      p.heading = Math.atan2(p.toX - p.x, p.toZ - p.z);
      p.delay = (i % 17) / 17 * .55;
    }
    this.elapsed = 0;
    this.duration = duration;
    this.moving = true;
    this.update(0);
  }

  update(delta) {
    this.elapsed += delta;
    let moving = false;
    for (let i = 0; i < this.people.length; i++) {
      const p = this.people[i];
      const t = this.duration === 0 ? 1
        : Math.max(0, Math.min(1, (this.elapsed - p.delay) / this.duration));
      const ease = t * t * (3 - 2 * t);
      p.x = p.fromX + (p.toX - p.fromX) * ease;
      p.z = p.fromZ + (p.toZ - p.fromZ) * ease;
      if (t < 1) moving = true;
      const amount = Math.min(1, p.distance / 8) * Math.sin(Math.PI * t);
      const stride = Math.sin(this.elapsed * 11 + p.phase) * amount;
      const targetYaw = t > .93 ? 0 : p.heading;
      const turn = Math.atan2(Math.sin(targetYaw - p.yaw), Math.cos(targetYaw - p.yaw));
      p.yaw += turn * Math.min(1, delta * 9);
      if (t === 1) p.yaw = 0;
      this.root.position.set(p.x, Math.abs(stride) * .045, p.z);
      this.root.rotation.y = p.yaw;
      this.root.scale.setScalar(p.height);
      this.torso.scale.x = .44 * p.width;
      this.hair.scale.set(.202 * (p.hairStyle === 1 ? 1.15 : 1),
        p.hairStyle === 2 ? .29 : .22, .197);
      this.bun.scale.setScalar(p.hairStyle === 3 ? .095 : .001);
      for (const arm of this.arms) {
        arm.shoulder.rotation.set(stride * arm.side * .65, 0, arm.side * .09);
        arm.elbow.rotation.x = -.16 - Math.max(0, stride * arm.side) * .8;
        arm.wrist.rotation.x = Math.sin(this.elapsed * 11 + p.phase) * .08 * amount;
      }
      for (const leg of this.legs) {
        const swing = stride * leg.side;
        leg.hip.rotation.x = -swing * .55;
        leg.knee.rotation.x = Math.max(0, swing) * .95;
        leg.ankle.rotation.x = swing * .15;
      }
      this.root.updateMatrixWorld(true);
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
