import assert from 'node:assert/strict';
import {AudioBus} from '../mjs/audio.mjs';
const sword='freesound_community-sword-battle-jingle-loop-96983.mp3',charge='audiomass-charge_scream.mp3',horse='audiomass-horse_gallop.mp3';
const media=[],sources=[],chunks=new Map(),fetches=[],listeners=new Map();
globalThis.document={hidden:false,addEventListener(t,fn){listeners.set(t,fn);},removeEventListener(t){listeners.delete(t);}};
globalThis.Audio=class{constructor(src){this.src=src;this.paused=true;media.push(this);}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}};
globalThis.AudioContext=class{constructor(){this.state='suspended';this.destination={};}resume(){this.state='running';return Promise.resolve();}close(){return Promise.resolve();}decodeAudioData(data){return Promise.resolve({src:chunks.get(data)});}createGain(){return {gain:{value:0},connect(){},disconnect(){}};}createBufferSource(){const s={connect(){},disconnect(){},start(){sources.push(s);},stop(){this.stopped=true;this.onended?.();}};return s;}};
globalThis.fetch=async url=>{fetches.push(url);const data=new ArrayBuffer(4);chunks.set(data,url);return {ok:true,arrayBuffer:async()=>data};};
const flush=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};
let passed=0,failed=0;const test=async(name,fn)=>{const bus=new AudioBus();bus.unlock();bus.setActive(true);await flush();try{await fn(bus);passed++;console.log('PASS',name);}catch(e){failed++;console.error('FAIL',name,e.message);}finally{document.hidden=false;bus.destroy();}};
await test('BUG-55-01 Normal/Simultaneous use supplied sword file through fallback and every animated participant, without replay',async bus=>{
 for(const type of ['attack','simultaneous']){const b={lastAction:{type,sequence:1,messageSerial:1,combatUnits:[{id:1},{id:2}]},messages:[{serial:1,text:'Resolved'}]},before=sources.length;bus.playBattle(b,0,true);await flush();assert.equal(sources.length,before);for(let i=0;i<(type==='simultaneous'?3:1);i++){bus.playCombat(b.lastAction,1);await flush();assert(sources.at(-1).buffer.src.endsWith('/'+sword));const once=sources.length;for(let cycle=2;cycle<=8;cycle++)bus.playCombat(b.lastAction,cycle);await flush();assert.equal(sources.length,once);}const end=sources.length;bus.playBattle(b,0,true);await flush();assert.equal(sources.length,end);const fallback={lastAction:{type,sequence:1,messageSerial:1},messages:[{serial:1,text:'Resolved'}]};bus.playBattle(fallback,0,false);await flush();assert(sources.at(-1).buffer.src.endsWith('/'+sword));}
 assert.equal(fetches.filter(url=>url.endsWith('/'+sword)).length,1);
});
await test('BUG-55-02 supplied charge cry plays once per order; 80 charge flashes and re-observation add no old hits',async bus=>{
 for(const animated of [true,false]){const b={lastAction:{type:'charge',sequence:1,messageSerial:1,combatUnits:[{id:1},{id:2}],exchanges:10},messages:[{serial:1,text:'Charged'}]},before=sources.length;bus.playBattle(b,0,animated);await flush();assert.equal(sources.length,before+1);assert(sources.at(-1).buffer.src.endsWith('/'+charge));for(let cycle=1;cycle<=80;cycle++)bus.playCombat(b.lastAction,cycle);bus.playBattle(b,0,animated);await flush();assert.equal(sources.length,before+1);}
});
await test('BUG-55-03 supplied gallop loops only during outward/return movement and stops for stationary, mute, hide and exit',async bus=>{
 for(const leg of ['outbound','return']){bus.setCourierMoving(true);const a=bus.courierEffect;assert(a.src.endsWith('/'+horse),leg);assert(a.loop&&!a.paused);bus.setCourierMoving(true);assert.equal(bus.courierEffect,a);bus.playCombat({type:'attack'},1);await flush();assert.equal(bus.courierEffect,a);assert(!a.paused);bus.setCourierMoving(false);assert(a.paused&&!bus.courierEffect);}
 bus.setCourierMoving(true);const a=bus.courierEffect;bus.configure({sound:false,music:true});assert(a.paused&&!bus.courierEffect);bus.configure({sound:true,music:false});assert(bus.track.paused&&bus.courierEffect);document.hidden=true;listeners.get('visibilitychange')();assert(!bus.courierEffect);document.hidden=false;listeners.get('visibilitychange')();assert(bus.courierEffect);bus.stop();assert(!bus.courierEffect&&bus.effects.size===0);
});
await test('BUG-55-01/02 unrelated Ambush, Fireball, silent menus and original remaster BGM retain their routes',async bus=>{
 bus.playCombat({type:'ambush'},1);await flush();assert(sources.at(-1).buffer.src.includes('/native-effect-13.mp3'));bus.playBattle({lastAction:{type:'fireball',sequence:1,messageSerial:1},messages:[{serial:1,text:'Fireball failed'}]},0,true);await flush();assert(sources.at(-1).buffer.src.endsWith('/fire.mp3'));const n=sources.length;bus.play('select');await flush();assert.equal(sources.length,n);assert.equal(bus.tracks.council.src,'./assets/music/council-music.mp3');assert.equal(bus.tracks.battle.src,'./assets/music/battle-music-v17.mp3');assert.equal(bus.tracks.triumph.src,'./assets/music/triumph-music.mp3');
});
await test('Effect 9 uses supplied charge scream through every Web Audio entry point; effect 7 stays unchanged',async bus=>{
 const calls=[()=>bus.playNative(9),()=>bus.play('native-effect-9'),()=>bus.playEvent({kind:'reinforcement'}),()=>bus.playBattle({lastAction:{type:'reinforce',sequence:1,messageSerial:1},messages:[{serial:1,text:'Reinforcements'}]},0,true),()=>bus.playBattle({messages:[{serial:1,text:'Reinforcements have arrived'}]},0,true)];
 for(const call of calls){const before=sources.length;call();await flush();assert.equal(sources.length,before+1);assert(sources.at(-1).buffer.src.endsWith('/'+charge));}
 bus.playNative(7);await flush();assert(sources.at(-1).buffer.src.endsWith('/native-effect-7.mp3?v=56'));assert(!fetches.some(url=>url.includes('/native-effect-9.mp3')));
});
delete globalThis.AudioContext;
await test('Effect 9 replacement also uses HTML audio fallback without changing effect 7',async bus=>{
 for(const call of [()=>bus.playNative(9),()=>bus.playEvent({kind:'reinforcement'}),()=>bus.playBattle({lastAction:{type:'reinforce',sequence:1,messageSerial:1},messages:[{serial:1,text:'Reinforcements'}]},0,false)]){const before=media.length;call();assert.equal(media.length,before+1);assert(media.at(-1).src.endsWith('/'+charge));}
 bus.playEvent({kind:'prison'});assert(media.at(-1).src.endsWith('/native-effect-7.mp3?v=56'));
});
await test('BUG-55-01/02 supplied combat clips also route through HTML audio when Web Audio is unavailable',async bus=>{
 for(const [type,file]of [['attack',sword],['simultaneous',sword],['charge',charge]]){bus.playBattle({lastAction:{type,sequence:1,messageSerial:1},messages:[{serial:1,text:'Resolved'}]},0,false);await flush();assert(media.at(-1).src.endsWith('/'+file));}
});
console.log(passed+' v55 audio groups passed; '+failed+' failures.');if(failed)process.exitCode=1;
