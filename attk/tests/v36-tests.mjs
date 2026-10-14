import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {loadImage,createCanvas} from '@napi-rs/canvas';
import {eventFrame,HISTORY_YEARS} from '../mjs/events.mjs';
import {historyArtworkFile} from '../mjs/history-art.mjs';
import {paintAtlas} from '../mjs/artwork.mjs';
import {warReportText} from '../mjs/event-chronicle.mjs';
import {AudioBus} from '../mjs/audio.mjs';
let count=0;const test=async(name,fn)=>{await fn();console.log('PASS',name);count++;};
await test('Campaign summaries retain actual fates and omit empty categories and redundant cause',()=>{
 const s={settings:{names:'english'}},row={year:189,month:1,source:9,target:10,attacker:{name:'Cao Cao'},defender:{name:'Dong Zhuo'},status:'won',rulerResult:'free',losingOwner:1,losingRuler:1,rulerPresent:{defend:true},reason:'The opposing ruler was captured.',fates:[{officer:2,name:'Jia Xu',formerOwner:1,action:'recruit'},{officer:3,name:'Li Ru',formerOwner:1,action:'recruit'},{officer:4,name:'Hu Zhen',formerOwner:1,action:'free'}]};
 assert.equal(warReportText(s,row),'Jan 189 AD: Cao Cao #9 attacked Dong Zhuo #10. Won. The opposing ruler was set free. The opposing generals were recruited: Jia Xu, Li Ru. The opposing generals were set free — Hu Zhen.');
 row.fates.push({officer:5,name:'Niu Fu',formerOwner:1,action:'behead'});assert(warReportText(s,row).includes('beheaded — Niu Fu.'));row.fates.push({officer:6,name:'Xu Rong',formerOwner:1,action:'pending'});assert(warReportText(s,row).includes('Awaiting decisions — Xu Rong.'));assert.equal(row.reason,'The opposing ruler was captured.');
});
await test('Every historical scene is distinct, native high-resolution and uses the whole image',async()=>{
 const hashes=new Set();for(const year of [...HISTORY_YEARS,'Default']){
  const frame=eventFrame({kind:'history',historyYear:year}),file=historyArtworkFile(frame.atlas);assert(file);assert.equal(frame.cell,0);
  const im=await loadImage(file);assert.equal(im.width,1983);assert.equal(im.height,793);hashes.add(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
  const c=createCanvas(600,200);c.getBoundingClientRect=()=>({width:600,height:200});const rect=paintAtlas(c,im,1,1,0);assert.equal(rect.height,200);assert(Math.abs(rect.width/rect.height-im.width/im.height)<1e-9);assert(rect.x>0);assert.equal(rect.y,0);
 }assert.equal(hashes.size,16);assert.equal(historyArtworkFile('history1900'),null);assert.equal(historyArtworkFile('portraits'),null);
});
await test('Bad omen and gallop effects route through sound preferences and visibility',()=>{
 const oldAudio=globalThis.Audio,oldDocument=globalThis.document,media=[];
 globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};
 globalThis.Audio=class{constructor(src){this.src=src;this.plays=0;media.push(this);}play(){this.plays++;return Promise.resolve();}pause(){this.paused=true;}};
 try{const bus=new AudioBus();bus.setActive(true);bus.play('gallop');assert.equal(media.length,3);bus.unlock();
  for(const cue of ['flood','locust','typhoon','epidemic','uprising','meteor','death']){bus.playEvent({kind:'month',art:cue});const native={flood:2,locust:0,typhoon:2,epidemic:1,meteor:4};assert.equal(media.at(-1).src,'./assets/sounds/'+(cue in native?'native-effect-'+native[cue]+'.mp3?v=56':cue+'.mp3'));assert(fs.statSync('assets/sounds/'+cue+'.mp3').size>30000);}
  bus.play('gallop');assert.equal(media.at(-1).src,'./assets/sounds/audiomass-horse_gallop.mp3');const n=media.length;bus.configure({sound:false,music:true});bus.playEvent({art:'flood'});assert.equal(media.length,n);assert([...bus.effects].length===0);
  bus.configure({sound:true,music:false});document.hidden=true;bus.play('gallop');assert.equal(media.length,n);document.hidden=false;bus.setActive(false);bus.play('gallop');assert.equal(media.length,n);bus.destroy();
 }finally{globalThis.Audio=oldAudio;globalThis.document=oldDocument;}
});
console.log(`${count} v36 summary, full-resolution art and event-audio regression groups passed.`);
