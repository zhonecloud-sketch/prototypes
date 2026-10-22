import {BallSimulation} from './wheel-physics.js';
export const SAMPLE_RATE=240,STRIDE=5;
export function settled(trace){
  return trace.local[1]>-.08&&trace.local[1]<-.035&&trace.distance<.008&&
    Math.hypot(trace.local[0],trace.local[2])>2.30&&Math.hypot(trace.local[0],trace.local[2])<2.54&&
    trace.impacts.some(e=>e.type==='deflector')&&trace.impacts.some(e=>e.type==='pocket-wall');
}
export function pack(trace){
  const points=new Float32Array(trace.points.length*STRIDE);
  trace.points.forEach((p,i)=>points.set([p.r*Math.cos(p.theta),p.y,p.r*Math.sin(p.theta),p.omega,p.phase==='free'?0:p.phase==='entry'?1:2],i*STRIDE));
  return {index:trace.index,points,impacts:trace.impacts,restLocal:trace.local,sampleRate:SAMPLE_RATE,stride:STRIDE};
}
// Trial releases never receive a requested result. Only a settled physical
// landing determines which pocket a candidate is stored against.
export async function buildPathBank(geometry,motion,{onPath=()=>{},cancelled=()=>false,pause=()=>new Promise(r=>setTimeout(r,0)),limit=1800}={}){
  const simulation=new BallSimulation(geometry,motion),found=new Set(),start=performance.now();let attempts=0;
  for(;attempts<limit&&found.size<37&&!cancelled();attempts++){
    const theta=motion.visualSeed/4294967296*Math.PI*2+attempts*2.399963229728653;
    const omega=-motion.direction*(6.3+(attempts%11)*.055),release=2.05+(attempts%7)*.015;
    const trace=simulation.traceBall(theta,omega,release,7);
    if(!found.has(trace.index)&&settled(trace)){found.add(trace.index);onPath(pack(trace));}
    if(attempts%4===3)await pause();
  }
  return {attempts,count:found.size,ms:performance.now()-start};
}
