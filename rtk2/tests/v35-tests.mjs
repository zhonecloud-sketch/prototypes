import fs from 'node:fs';import assert from 'node:assert/strict';
import {Game,createCampaign,validateSave} from '../mjs/strategy.mjs';
import {armySummary} from '../mjs/battle-summary.mjs';
import {newUnit,aiBattle} from '../mjs/battle.mjs';
import {acrossChinaChronology,prunePastEvents,extendWarReport,validateWarHistory} from '../mjs/event-chronicle.mjs';
import {eventFor,eventFrame} from '../mjs/events.mjs';
import {createScreenWakeLock} from '../mjs/screen-wake-lock.mjs';
const scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrains=JSON.parse(fs.readFileSync('config/province-terrain.json'));
const fresh=()=>{const g=new Game(createCampaign(scenarios[0],[0]),{},terrains);g.s.monthlyReview=null;g.s.settings.battleView='all';return g;};
let count=0;async function test(name,fn){await fn();count++;console.log('PASS',name);}
await test('Attacker F/R counts original deployed units and arrived outside reinforcements only',()=>{
 const g=fresh();g.invade({province:9,target:8,officers:[0,34],governor:33,food:20000});const b=g.s.battle;
 assert.equal(armySummary(g,b,'attack').generals,0);assert.equal(armySummary(g,b,'attack').remaining,0);
 while(b.phase==='deployment')aiBattle(g);
 const outside=g.province(9).neighbors.map(id=>g.province(id)).find(p=>p.id!==8&&p.officers.length);
 const arrived=newUnit(g,outside.officers[0],'attack',outside.id);arrived.placed=true;b.units.push(arrived);
 const enRoute=newUnit(g,outside.officers[1]??outside.officers[0],'attack',outside.id);b.units.push(enRoute);
 let info=armySummary(g,b,'attack');assert.equal(info.generals,2);assert.equal(info.remaining,1);
 arrived.fled=true;info=armySummary(g,b,'attack');assert.equal(info.remaining,0);
 const reserves=g.province(9).officers.filter(id=>!b.units.some(u=>u.id===id));assert(reserves.length);assert.equal(info.remaining,0);
});
await test('Defender F/R retains field units and undeployed local reserves',()=>{
 const g=fresh();g.invade({province:9,target:8,officers:[0],governor:33,food:20000});const b=g.s.battle,info=armySummary(g,b,'defend');
 assert.equal(info.generals,b.units.filter(u=>u.side==='defend').length);assert.equal(info.remaining,g.province(8).officers.filter(id=>!b.units.some(u=>u.id===id)).length);
});
await test('Governance art restores instead of displaying an expired last event; previews and monthly events still work',()=>{
 const g=fresh();g.s.lastEvent={kind:'prison',title:'Old interception',text:'Yesterday'};
 assert.equal(eventFor(g).title,'Governance');assert.deepEqual(eventFrame(eventFor(g)),{atlas:'events',cell:3});
 g.s.eventPreview={kind:'war',title:'Preview',text:'Test'};assert.equal(eventFor(g).preview,true);delete g.s.eventPreview;
 g.s.monthlyReview={index:0};g.s.lastReport={details:[{kind:'history',title:'Historical event',text:'Current'}]};assert.equal(eventFor(g).kind,'history');
});
await test('Past nationwide and local logs are removed from checkpoints; current reports survive reload',()=>{
 const g=fresh();g.record('Old history','history');g.s.month=2;g.record('Current history','history');
 assert(g.s.log.every(x=>x.month===2));assert(acrossChinaChronology(g).every(x=>x.month===2));
 g.s.log.push({year:189,month:1,type:'history',text:'Legacy history'});
 const loaded=validateSave(g.s,scenarios,terrains);assert(loaded.log.every(x=>x.month===2));assert(loaded.log.some(x=>x.text==='Current history'));
});
await test('Extended wars carry current report and valid war ID into the next month without saving old history',()=>{
 const g=fresh();g.invade({province:9,target:8,officers:[0],governor:33,food:20000});const b=g.s.battle;extendWarReport(g,b);const war=b.chronicleWar;
 g.s.month=2;prunePastEvents(g.s);assert.equal(g.s.warChronicle.length,1);assert.equal(g.s.warChronicle[0].war,war);assert.equal(g.s.warChronicle[0].month,2);validateWarHistory(g.s);
 g.s.battle=null;g.s.month=3;prunePastEvents(g.s);assert.equal(g.s.warChronicle.length,0);
});
await test('Dimming is disabled by default and explicit Menu preference survives save/load',()=>{
 const g=fresh();assert.equal(g.s.settings.allowScreenDimming,false);g.s.settings.allowScreenDimming=true;assert.equal(validateSave(g.s,scenarios,terrains).settings.allowScreenDimming,true);
 delete g.s.settings.allowScreenDimming;assert.equal(validateSave(g.s,scenarios,terrains).settings.allowScreenDimming,false);
});
await test('Wake lock coalesces requests, releases when dimming is enabled and reacquires after visibility loss',async()=>{
 const document={visibilityState:'visible'},locks=[],messages=[];let requests=0;
 const navigator={wakeLock:{async request(type){assert.equal(type,'screen');requests++;const lock={released:false,listener:null,addEventListener(_,fn){this.listener=fn;},async release(){this.released=true;this.listener?.();}};locks.push(lock);return lock;}}};
 const wake=createScreenWakeLock({navigator,document,onChange:x=>messages.push(x)});
 await Promise.all([wake.setEnabled(true),wake.setEnabled(true)]);assert.equal(requests,1);assert(wake.active);
 document.visibilityState='hidden';await wake.setEnabled(true);assert(locks[0].released);assert(!wake.active);
 document.visibilityState='visible';await wake.setEnabled(true);assert.equal(requests,2);assert(wake.active);
 await wake.setEnabled(false);assert(locks[1].released);assert(!wake.active);assert.equal(messages.at(-1),'Screen dimming allowed.');
});
await test('A pending wake request is released if game exits before it resolves',async()=>{
 let resolve;const lock={released:false,async release(){this.released=true;},addEventListener(){}};
 const wake=createScreenWakeLock({navigator:{wakeLock:{request:()=>new Promise(r=>resolve=r)}},document:{visibilityState:'visible'}});
 const request=wake.setEnabled(true);await wake.setEnabled(false);resolve(lock);await request;assert(lock.released);assert(!wake.active);
});
await test('Unsupported or refused wake locks fail gracefully and permit a later gesture retry',async()=>{
 const messages=[],document={visibilityState:'visible'};const unsupported=createScreenWakeLock({navigator:{},document,onChange:x=>messages.push(x)});await unsupported.setEnabled(true);assert(!unsupported.active);assert(messages.at(-1).includes('unavailable'));
 let requests=0;const wake=createScreenWakeLock({navigator:{wakeLock:{async request(){requests++;throw Error('Battery saver');}}},document,onChange:x=>messages.push(x)});
 await wake.setEnabled(true);await wake.setEnabled(true);assert.equal(requests,2);assert(messages.at(-1).includes('declined'));
});
console.log(`${count} v35 mobile and current-event regression groups passed.`);
