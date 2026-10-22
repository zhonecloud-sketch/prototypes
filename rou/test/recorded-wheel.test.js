import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import * as T from '../../lib/three.core.js';
import {FEED_ANCHOR,INTERVAL,WEEK,PER_WEEK,position,parseArchive,weeklyHtml} from '../client/recorded-feed.js';
import {buildPathBank,STRIDE} from '../client/wheel-path-bank.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const ORDER=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const Wheel=vm.runInNewContext(html.slice(html.indexOf('class RouletteWheel{'),html.indexOf('\nasync function importTimed'))+';RouletteWheel',{
  ORDER,TAU:Math.PI*2,RED:new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]),SPIN_SECONDS:7,
  clamp:(n,a,b)=>Math.min(b,Math.max(a,n)),now:()=>clock
});
let clock=10000;
function renderedGeometry(){
  const wheel=Object.create(Wheel.prototype);Object.assign(wheel,{T,materials:[],scene:new T.Scene(),rotor:new T.Group(),woodTexture:()=>null,numberTexture:()=>null});
  wheel.scene.add(wheel.rotor);wheel.buildWheel();return wheel.serializeColliders();
}

test('the weekly feed uses consecutive archive entries at Sunday and exhaustion',()=>{
  const numbers=parseArchive(readFileSync(new URL('../assets/2m-rng.txt',import.meta.url),'utf8'));
  const hash=createHash('sha256').update(numbers).digest('hex');
  assert.equal(hash,'526465480d0a78a03a5222985ca19b68d75bae43386c9a60a68f191b558745ef');
  assert.deepEqual(Buffer.from(numbers),readFileSync(new URL('../sites-server/rust/data/2m-rng.bin',import.meta.url)));
  assert.equal(position(FEED_ANCHOR+WEEK-INTERVAL,numbers.length).index,PER_WEEK-1);
  assert.equal(position(FEED_ANCHOR+WEEK,numbers.length).index,PER_WEEK);
  const last=position(FEED_ANCHOR+(numbers.length-1)*INTERVAL,numbers.length),next=position(FEED_ANCHOR+numbers.length*INTERVAL,numbers.length);
  assert.equal(last.index,numbers.length-1);assert.equal(last.cycle,0);assert.equal(next.index,0);assert.equal(next.cycle,1);
  const output=weeklyHtml(numbers,hash,FEED_ANCHOR+WEEK);
  assert.match(output,/data-start-record="20161"/);assert.match(output,new RegExp('000:00:00:00\\t'+numbers[PER_WEEK]+'\\n'));
  assert.throws(()=>parseArchive('0\n37',2));assert.throws(()=>parseArchive('0\n1\n2',2));assert.throws(()=>parseArchive('0',2));
});

test('animation clock remains forward and smooth across polling corrections',()=>{
  const wheel=Object.create(Wheel.prototype);wheel.lastTime=0;
  clock=10000;assert.equal(wheel.visualTime(0),10000);
  clock=10016;assert.equal(wheel.visualTime(16),10016);
  clock-=350;let previous=wheel.visualClock;
  for(let t=32;t<=1000;t+=16){clock+=16;const next=wheel.visualTime(t);assert.ok(next-previous>=15.19&&next-previous<=16.81);previous=next;}
  clock=80000;assert.equal(wheel.visualTime(70000),80000,'returning from a hidden tab resumes the current round');
});

test('release trials naturally settle in every rendered pocket in both directions',async t=>{
  const geometry=renderedGeometry();
  assert.equal(geometry.pockets.length,37);assert.equal(geometry.deflectors.length,12);
  for(let i=0;i<6;i++){
    const direction=i%2?-1:1,motion={start:i*1.31,startVelocity:-direction*.24,travel:direction*(6.4+i),ramp:.35,cruiseVelocity:direction*.24,direction,visualSeed:i*123456789};
    motion.peakVelocity=(2*motion.travel-motion.ramp*motion.startVelocity-(7-motion.ramp)*motion.cruiseVelocity)/7;
    const paths=new Map(),stats=await buildPathBank(geometry,motion,{pause:async()=>{},onPath:path=>paths.set(path.index,path)});
    assert.equal(paths.size,37,JSON.stringify(stats));t.diagnostic(JSON.stringify(stats));
    for(const [index,path] of paths){
      assert.equal(path.points.length,1681*STRIDE);assert.ok(path.impacts.some(e=>e.type==='deflector'));assert.ok(path.impacts.some(e=>e.type==='pocket-wall'));
      const last=path.points.length-STRIDE,angle=motion.start+motion.travel,c=Math.cos(angle),s=Math.sin(angle),[x,y,z]=path.restLocal;
      assert.ok(Math.hypot(path.points[last]-(x*c-z*s),path.points[last+1]-y,path.points[last+2]-(x*s+z*c))<1e-5,'rest position must join the last physical sample');
      const localAngle=Math.atan2(z,x),actual=((Math.round((localAngle+Math.PI/2)/(Math.PI*2/37))%37)+37)%37;
      assert.equal(actual,index,'the measured resting pocket labels the path');
      assert.ok(y>-.08&&y<-.035,'the ball rests inside the rendered recess');
      for(let j=STRIDE;j<path.points.length;j+=STRIDE)assert.ok(Math.hypot(path.points[j]-path.points[j-STRIDE],path.points[j+1]-path.points[j-STRIDE+1],path.points[j+2]-path.points[j-STRIDE+2])<.13,'no late snap between samples');
    }
  }
});
