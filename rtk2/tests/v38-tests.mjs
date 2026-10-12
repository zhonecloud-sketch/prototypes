import fs from 'node:fs';import assert from 'node:assert/strict';
import {Game,createCampaign,validateSave} from '../mjs/strategy.mjs';
import {acrossChinaChronology,provinceCurrentEvents} from '../mjs/event-chronicle.mjs';
import {AudioBus} from '../mjs/audio.mjs';
const scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrain=JSON.parse(fs.readFileSync('config/province-terrain.json'));
const fresh=()=>{const g=new Game(createCampaign(scenarios[0],[0]),{},terrain);g.s.monthlyReview=null;return g;};
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS',name);};
test('AI domestic reports survive short-log eviction, monthly rollover and reload; only one completed round is retained',()=>{
 const g=fresh();g.s.log=[];g.s.currentReports=[];g.s.player=1;g.random=()=>.99;const p=g.s.provinces.find(p=>p.owner===1),o=g.officer(p.governor);o.acted=false;p.land=50;const message=g.execute('develop',{province:p.id,officer:o.id,amount:100});
 assert(acrossChinaChronology(g).some(e=>e.text===message));assert(provinceCurrentEvents(g)[p.id-1].events.some(e=>e.text===message));
 for(let i=0;i<250;i++)g.record('Day '+(i%30+1)+': orders.','war');assert(!g.s.log.some(x=>x.text===message));assert(acrossChinaChronology(g).some(e=>e.text===message));
 g.endMonth();assert.equal(g.s.month,2);assert(acrossChinaChronology(g).some(e=>e.text===message&&e.month===1));assert(provinceCurrentEvents(g)[p.id-1].events.some(e=>e.text===message));
 const h=new Game(validateSave(g.s,scenarios,terrain),{},terrain);assert(acrossChinaChronology(h).some(e=>e.text===message));h.endMonth();assert(!acrossChinaChronology(h).some(e=>e.text===message));assert(!provinceCurrentEvents(h)[p.id-1].events.some(e=>e.text===message));assert(!JSON.stringify(h.s).includes(message));
});
test('A real AI governance action is logged nationally with its actual faction',()=>{const g=fresh();g.s.player=1;g.s.ai.aggression=0;for(let i=0;i<40&&!acrossChinaChronology(g).some(e=>e.ai);i++)g.aiStep();assert(acrossChinaChronology(g).some(e=>e.ai&&e.actor===1));});
test('Li Su treasure is national, raises loyalty to 100 and INT by the actual native capped gain',()=>{
 for(const roll of [0,.999]){const g=fresh();g.s.player=8;g.s.humanRulers=[8];const o=g.s.officers.find(x=>x.name==='Li Su'),p=g.s.provinces.find(p=>p.officers.includes(o.id)),before=o.int;g.s.spoils=[{owner:8,province:p.id,item:'heavenbook'}];g.random=()=>roll;const text=g.decideSpoils('protect',o.id);assert.equal(o.loyalty,100);assert.equal(o.int,before+(roll===0?5:9));assert(text.includes('INT +'+(o.int-before)));assert(acrossChinaChronology(g).some(e=>e.text===text));assert(!provinceCurrentEvents(g)[p.id-1].events.some(e=>e.text===text));const s=validateSave(g.s,scenarios,terrain);assert.equal(s.officers[o.id].int,o.int);assert.equal(s.items[0].gain,o.int-before);}
 const g=fresh(),o=g.officer(34);o.int=98;g.s.spoils=[{owner:0,province:9,item:'heavenbook'}];g.random=()=>.999;g.decideSpoils('protect',34);assert.equal(o.int,100);assert.equal(g.s.items[0].gain,2);
});
test('Outbound capture is checked; a released messenger travels back without capture or capture RNG',()=>{
 const g=fresh();g.s.humanRulers=g.s.rulers.map(r=>r.id);g.execute('diplomaticMission',{province:9,mode:'gift',target:3,officer:34,amount:100});g.random=()=>0;let captured=0;
 for(let i=0;i<60&&g.s.journey?.phase==='outbound';i++){if(g.s.journey.interception){captured++;assert(!g.journeyMotion);g.interceptJourney('free');}else if(g.s.journey.proposal)g.answerProposal(true);else g.advanceJourney();}
 assert(captured>0);assert.equal(g.s.journey.phase,'return');const seed=g.s.seed;g.random=()=>{throw Error('Return trip must not roll for interception');};for(let i=0;i<60&&g.s.journey;i++){g.advanceJourney();assert(!g.s.journey?.interception);}assert(!g.s.journey);assert.equal(g.s.seed,seed);
});
test('Gallop starts once for motion, stops for detention/rest, and respects mute/visibility',()=>{
 const oldAudio=globalThis.Audio,oldDocument=globalThis.document,media=[];globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};globalThis.Audio=class{constructor(src){this.src=src;media.push(this);}play(){this.played=true;return Promise.resolve();}pause(){this.paused=true;}};
 try{const bus=new AudioBus;bus.setActive(true);bus.unlock();bus.setCourierMoving(false);assert.equal(media.length,3);bus.setCourierMoving(true);const first=media.at(-1);assert.equal(first.src,'./assets/audiomass-horse_gallop.mp3');assert(first.loop);bus.setCourierMoving(true);assert.equal(media.length,4);bus.setCourierMoving(false);assert(first.paused);assert(!bus.courierEffect);bus.setCourierMoving(true);const second=media.at(-1);document.hidden=true;bus.sync();assert(second.paused);document.hidden=false;bus.setCourierMoving(false);bus.configure({sound:false});bus.setCourierMoving(true);assert(!bus.courierEffect);bus.destroy();}finally{globalThis.Audio=oldAudio;globalThis.document=oldDocument;}
});
console.log(`${count} v38 event, treasure, courier and audio regression groups passed.`);
