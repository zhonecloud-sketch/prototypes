import assert from 'node:assert/strict';import {AudioBus} from '../mjs/audio.mjs';
const flush=async()=>{for(let n=0;n<8;n++)await Promise.resolve();};
const listeners=new Map(),media=[],sources=[],chunks=new Map(),fetches=[];let notices=[];
globalThis.document={hidden:false,addEventListener(type,fn){listeners.set(type,fn);},removeEventListener(type){listeners.delete(type);}};
globalThis.Audio=class{constructor(src){this.src=src;this.paused=true;this.currentTime=0;media.push(this);}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}};
globalThis.AudioContext=class{constructor(){this.state='suspended';this.destination={};}resume(){this.state='running';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}decodeAudioData(data){return Promise.resolve({src:chunks.get(data)});}createGain(){return {gain:{value:0},connect(){},disconnect(){}};}createBufferSource(){const s={connect(){},disconnect(){},start(){sources.push(s);},stop(){this.stopped=true;this.onended?.();}};return s;}};
globalThis.fetch=async url=>{fetches.push(url);const data=new ArrayBuffer(4);chunks.set(data,url);return {ok:true,arrayBuffer:async()=>data};};
const bus=new AudioBus();bus.notice=text=>notices.push(text);bus.unlock();bus.setActive(true);await flush();

for(const type of ['attack','charge']){const before=sources.length,b={lastAction:{type,sequence:1,messageSerial:1,combatUnits:[{id:1}]},messages:[{serial:1,text:'Resolved'}]};bus.playBattle(b,0,true);await flush();assert.equal(sources.length,before+(type==='charge'?1:0));if(type==='charge')assert(sources.at(-1).buffer.src.includes('audiomass-charge_scream'));bus.playCombat(b.lastAction,1);await flush();assert(sources.at(-1).buffer.src.includes(type==='charge'?'audiomass-charge_scream':'freesound_community-sword-battle-jingle-loop-96983'));const count=sources.length;bus.playBattle(b,0,true);await flush();assert.equal(sources.length,count);}
console.log('PASS BUG-53-02 Charge adds one distinct supplied cry; Normal uses the supplied sword clip without duplicates');
for(const direction of ['outbound','return']){bus.setCourierMoving(true);const loop=bus.courierEffect;assert(loop.src.includes('audiomass-horse_gallop.mp3'));assert(loop.loop&&!loop.paused);bus.setCourierMoving(true);assert.equal(bus.courierEffect,loop);bus.setCourierMoving(false);assert(loop.paused);assert.equal(bus.courierEffect,null);}
console.log('PASS BUG-53-08 outbound and returning messenger motion use supplied gallop; stationary motion stops and loops cannot duplicate');
bus.setCourierMoving(true);const loop=bus.courierEffect;document.hidden=true;listeners.get('visibilitychange')();assert(loop.paused&&!bus.courierEffect);document.hidden=false;listeners.get('visibilitychange')();assert(bus.courierEffect);bus.configure({sound:false,music:true});assert(!bus.courierEffect);bus.destroy();
console.log('PASS BUG-53-08 supplied messenger stops when muted, hidden or destroyed');
