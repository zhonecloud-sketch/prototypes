import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as reference from './native-combat-reference.mjs';
import * as port from '../mjs/native-combat.mjs';
import {initializeRustKernel,rustKernelLoaded} from '../mjs/rust-kernel.mjs';
await initializeRustKernel(fs.readFileSync(new URL('../wasm/attk_engine.wasm',import.meta.url)));
assert(rustKernelLoaded());
let seed=0xA771,checks=0;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const integer=n=>Math.floor(random()*n);
const unit=()=>({soldiers:integer(10001),weapons:integer(10001),war:integer(101),
 training:integer(101),int:integer(101),mobility:integer(8),
 combatWarBonus:integer(2)*20,hasHorse:!!integer(2)});
function equal(name,args){
 assert.deepEqual(port[name](...args),reference[name](...args),name);
 checks++;
}
function exchange(name,args,values,extra=[]){
 const trace=()=>{let calls=0;return {random:()=>values[calls++%values.length],count:()=>calls};};
 const a=trace(),b=trace();
 const first=port[name](...args,a.random,...extra),second=reference[name](...args,b.random,...extra);
 assert.deepEqual(first,second,name);assert.equal(a.count(),b.count(),name+' RNG calls');
 checks+=2;
}
for(let i=0;i<10000;i++){
 const a=unit(),b=unit(),t=integer(8),factor=integer(3)+1;
 equal('equipmentPercent',[a]);equal('combatPower',[a]);
 equal('nativeCasualty',[integer(600),integer(600),b.soldiers,t,factor,integer(300),integer(30)]);
 equal('fleeChance',[a,integer(11),!!integer(2),integer(10)]);
 equal('trainingGain',[a,[a,b,{...unit(),training:100}]]);
 equal('giveFoodGain',[integer(3000001),integer(101),integer(101),integer(3000001),integer(4)]);
 const values=Array.from({length:8},()=>random());
 exchange('meleeExchange',[a,b,integer(7),integer(7)],values,[factor]);
 exchange('ambushExchange',[a,b,integer(7)],values,[factor]);
}
for(const soldiers of [0,1,99,100,10000])for(const weapons of [0,1,99,100,10000]){
 equal('equipmentPercent',[{soldiers,weapons}]);
}
for(const int of [89,90,100]){
 const a={...unit(),int,soldiers:5000},b={...unit(),soldiers:5000};
 exchange('ambushExchange',[a,b,1],[0,0.999999]);
}
for(let t=0;t<8;t++)for(const factor of [1,2,3])
 equal('nativeCasualty',[100,101,0,t,factor,0,29]);
// Reject wrong ABI before it can replace the live calculation kernel.
assert.equal(globalThis[Symbol.for('attk.rust.kernel.v1')].kernel_version(),1);
console.log('PASS Rust/WASM differential checks:',checks,'including RNG trace parity');
