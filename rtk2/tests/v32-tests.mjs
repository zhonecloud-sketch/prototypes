import fs from 'node:fs';import assert from 'node:assert/strict';
import {Game,createCampaign,validateSave} from '../mjs/strategy.mjs';
import {combatPower,nativeCasualty,meleeExchange,equipmentPercent} from '../mjs/native-combat.mjs';
import {ENTRY_SLOTS,DEFENDER_ZONES,ATTACKER_ZONES} from '../mjs/original-deployment.mjs';
import {placementCells,spawnBattle,aiBattle,outcome,living,reinforcementOptions,direction} from '../mjs/battle.mjs';
import {provinceDirection} from '../mjs/geography.mjs';
import {acrossChinaChronology} from '../mjs/event-chronicle.mjs';
const scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrains=JSON.parse(fs.readFileSync('config/province-terrain.json'));
const fresh=(humans=[0])=>{const g=new Game(createCampaign(scenarios[0],humans,3),{},structuredClone(terrains));g.s.monthlyReview=null;g.s.settings.battleView='all';return g;};
let n=0;const test=(name,fn)=>{fn();n++;console.log('PASS',name);};
test('All 1300 isolated native vectors agree with production domestic, power and casualty arithmetic',()=>{
 const vectors=JSON.parse(fs.readFileSync('docs/native-equation-vectors-v32.json')),g=fresh();
 for(const v of vectors.development){g.s.difficulty=v.difficulty;for(const field of ['land','flood'])assert.equal(g.development({[field]:v.value},v,v.gold,field),v.gain);}
 for(const v of vectors.power)assert.equal(combatPower(v),v.power);
 for(const v of vectors.casualties)assert.equal(nativeCasualty(v.ownPower,v.otherPower,v.otherMen,v.palaceAssault?7:v.terrain,v.factor,v.random300,v.random30),v.loss);
 assert.equal(vectors.development.length+vectors.power.length+vectors.casualties.length,1300);
});
test('All 186 directed approaches in 41 provinces have exactly their native five cells; defenders use twenty',()=>{
 const g=fresh(),audit=JSON.parse(fs.readFileSync('docs/deployment-v32.json'));assert.equal(audit.approaches.length,186);
 for(const p of g.s.provinces){assert.equal(DEFENDER_ZONES[p.id-1].length,20);for(const source of p.neighbors){const entry=provinceDirection(p,g.province(source)),b={target:p.id,terrain:terrains[p.id-1],fire:{},units:[],entryDirection:entry};const actual=placementCells(b,'attack').map(c=>[c.q,c.r]);assert.deepEqual(actual,ATTACKER_ZONES[p.id-1][entry]);assert.deepEqual(actual,audit.approaches.find(a=>a.target===p.id&&a.source===source).slots);assert.equal(placementCells(b,'defend').length,20);}}
});
const unit=(side,soldiers=5000)=>({id:side==='attack'?0:1,side,placed:true,q:side==='attack'?6:7,r:6,soldiers,weapons:soldiers,training:100,war:80,morale:0,routed:false,fled:false,captured:false});
test('Water attacking palace pays native assault penalty; counterattack uses intact pre-exchange force',()=>{
 const a=unit('attack'),d=unit('defend');const hit=meleeExchange(a,d,4,6,()=>.5);
 assert.deepEqual(hit,{loss:75,reply:300,attackerWeapons:300,defenderWeapons:75});
 const land=meleeExchange(a,d,0,0,()=>.5);assert.equal(land.loss,150);assert.equal(land.reply,150);assert.equal(a.soldiers,5000);assert.equal(d.soldiers,5000);
});
test('A native single exchange can wipe 1000 weak men in water without a fixed 1000-man minimum',()=>{
 const strong={...unit('attack'),war:100,combatWarBonus:20},weak={...unit('defend',1000),war:0,training:0,weapons:0};
 assert.equal(meleeExchange(strong,weak,0,4,()=>.999).loss,1000);
 assert.equal(meleeExchange(unit('attack'),unit('defend'),0,0,()=>0).loss,1);
});
test('Equipment coverage and casualties update both armies; legacy morale alone cannot end a battle',()=>{
 assert.equal(equipmentPercent({soldiers:1000,weapons:300}),30);
 const b={units:[unit('attack'),unit('defend')],phase:'battle',food:{attack:1000,defend:1000},leaders:{attack:0,defend:1},rulers:{attack:0,defend:1},terrain:Array(156).fill(0),palace:{q:12,r:11}};
 assert.equal(outcome(b),null);assert.equal(living(b).length,2);
 b.food.defend=0;assert.equal(outcome(b).winner,'attack');assert.match(b.outcome.reason,/defending.*food/);assert.equal(b.units[1].soldiers,5000);
});
test('Cultiv and Flood use the same native gain, spend gold and saturate at100',()=>{
 for(const type of ['develop','flood']){const g=fresh(),p=g.province(9),o=g.officer(34),field=type==='develop'?'land':'flood';p[field]=99;p.gold=1000;Object.assign(o,{acted:false,int:100,charm:100});const gain=g.preview(type,9,o.id,100);g.execute(type,{province:9,officer:o.id,amount:100});assert.equal(p[field],99+gain);assert.equal(p.gold,900);assert(o.acted);assert.equal(g.development({[field]:100},o,100,field),0);}
});
test('All-battles spectator outcomes survive tactical-log eviction and save/load with a visible reason',()=>{
 for(const winner of ['attack','defend']){const g=fresh([]);g.invade({province:9,target:8,officers:[0,34],governor:33,food:20000});const b=g.s.battle;assert(g.battleDetailed());while(b.phase==='deployment')aiBattle(g);b.outcome={winner,reason:winner==='attack'?'The defending army exhausted its food.':'The attacking commander fled.'};g.resolveBattle();for(let i=0;i<200;i++)g.record(`Day ${i%30+1}: Defending army’s orders.`,'war');const rows=acrossChinaChronology(g).filter(x=>x.text.includes('attacked'));assert.equal(rows.length,1);assert(rows[0].text.includes(winner==='attack'?'Won.':'Defeated.'));assert(rows[0].text.includes(b.outcome.reason));const restored=new Game(validateSave(g.s,scenarios,g.terrains),{},g.terrains);assert(acrossChinaChronology(restored).some(x=>x.text===rows[0].text));}
});
test('An invading main contingent at five cannot pull extra units from its source or a friendly neighbor',()=>{
 const g=fresh(),p=g.province(9);while(p.officers.length<7){const q=g.s.provinces.find(q=>q.id!==9&&q.officers.length>1),id=q.officers.find(id=>id!==q.governor);q.officers=q.officers.filter(x=>x!==id);p.officers.push(id);Object.assign(g.officer(id),{owner:p.owner,soldiers:1000,acted:false});}g.normalize();g.invade({province:9,target:8,officers:p.officers.filter(id=>id!==p.governor).slice(0,5),food:20000});while(g.s.battle.phase==='deployment')aiBattle(g);assert.equal(reinforcementOptions(g,'attack').length,0);assert.equal(living(g.s.battle).filter(u=>u.side==='attack').length,5);
});
test('Old broad-zone deployment and unsupported morale routes migrate without altering a fighting army’s coordinates',()=>{
 const g=fresh();g.invade({province:9,target:8,officers:[0,34],governor:33,food:20000});while(g.s.battle.phase==='deployment')aiBattle(g);const raw=structuredClone(g.s),u=raw.battle.units[0];raw.battle.rulesVersion=5;u.morale=0;u.routed=true;const position=[u.q,u.r],restored=validateSave(raw,scenarios,g.terrains);assert.equal(restored.battle.rulesVersion,6);assert.equal(restored.battle.units[0].routed,false);assert.deepEqual([restored.battle.units[0].q,restored.battle.units[0].r],position);
});
console.log(`${n} v32 regression groups passed.`);
