import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {Game,createCampaign,validateSave} from '../mjs/strategy.mjs';
import {orderUnavailable} from '../mjs/order-availability.mjs';
import {activeBattleUnit,battleOrderUnavailable} from '../mjs/battle-presentation.mjs';
import {HISTORIC_PORTRAITS,portraitFrame} from '../mjs/portraits.mjs';
import {OFFICER_ROSTER} from '../mjs/officer-roster.mjs';
import {tilePoint,direction} from '../mjs/battle.mjs';
const scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrains=JSON.parse(fs.readFileSync('config/province-terrain.json'));
const fresh=()=>{const g=new Game(createCampaign(scenarios[0],[0]),{},terrains);g.s.monthlyReview=null;g.s.settings.battleView='all';g.random=()=>.5;return g;};
let count=0;const test=(label,fn)=>{fn();count++;console.log('PASS',label);};
test('Captured field commander is last for either winning side and remains last after saving',()=>{
 for(const winner of ['attack','defend']){
  const g=fresh();g.invade({province:9,target:8,governor:33,officers:[0,34],food:30000,gold:500});g.s.humanRulers.push(g.s.battle.defender);const b=g.s.battle,loser=winner==='attack'?'defend':'attack',leader=b.leaders[loser];
  if(winner==='defend')for(const u of b.units.filter(u=>u.side==='attack'))u.captured=true;
  b.outcome={winner,reason:'Enemy commander defeated'};g.resolveBattle();const owner=winner==='attack'?b.attacker:b.defender,queue=g.s.captiveDecisions.filter(c=>c.owner===owner);assert(queue.length>1);assert.equal(queue.at(-1).officer,leader);assert.equal(g.s.lastBattle.captured.at(-1),leader);
  const saved=validateSave(g.s,scenarios,terrains);assert.equal(saved.captiveDecisions.filter(c=>c.owner===owner).at(-1).officer,leader);
 }
});
test('Monthly order availability accounts for governor, ruler, season, visitors, and ready officers without changing the campaign',()=>{
 const g=fresh(),p=g.province(9);const before=JSON.stringify(g.s);assert.equal(orderUnavailable(g,p,'develop'),null);assert.equal(JSON.stringify(g.s),before);
 g.officer(p.governor).acted=true;assert.match(orderUnavailable(g,p,'reward'),/already acted/);assert.match(orderUnavailable(g,p,'tax'),/already acted/);assert.match(orderUnavailable(g,p,'exile'),/already acted/);assert.equal(orderUnavailable(g,p,'develop'),null);g.officer(p.governor).acted=false;
 g.s.month=7;assert.match(orderUnavailable(g,p,'tax'),/July/);g.s.month=1;p.merchant=false;assert.match(orderUnavailable(g,p,'trade'),/merchant/);
 for(const id of p.officers)g.officer(id).acted=true;assert.match(orderUnavailable(g,p,'develop'),/available/);assert.equal(orderUnavailable(g,p,'view'),null);assert.equal(orderUnavailable(g,p,'map'),null);assert.equal(orderUnavailable(g,p,'rest'),null);
 g.s.provinceCompleted.push(p.id);assert.match(orderUnavailable(g,p,'develop'),/finished/);
});
test('Map numbers default on in old saves and persist independently of ownership',()=>{
 const g=fresh();assert.equal(validateSave(g.s,scenarios,terrains).settings.showNumbers,true);
 for(const ownership of [false,true]){g.s.settings.ownership=ownership;g.s.settings.showNumbers=false;const s=validateSave(g.s,scenarios,terrains);assert.equal(s.settings.showNumbers,false);assert.equal(s.settings.ownership,ownership);}
});
test('Only the selected living, unspent unit on the acting side blinks; unavailable tactics explain why',()=>{
 const b={phase:'battle',side:'attack',selected:4,weather:'rain'},u={id:4,side:'attack',placed:true,ordered:false,soldiers:500};assert(activeBattleUnit(b,u));
 for(const patch of [{id:5},{side:'defend'},{ordered:true},{soldiers:0},{routed:true},{fled:true},{placed:false}])assert(!activeBattleUnit(b,{...u,...patch}));
 assert(!activeBattleUnit({...b,phase:'deployment'},u));assert(!activeBattleUnit({...b,outcome:{winner:'attack'}},u));assert.match(battleOrderUnavailable(b,{...u,ordered:true},'wait'),/already/);assert.match(battleOrderUnavailable(b,u,'fireball'),/rain/);assert.equal(battleOrderUnavailable(b,{...u,ordered:true},'view'),null);
});
test('Fifteen historical identity overrides retain 352 unique assignments and date the Xiahou Dun eye injury',()=>{
 const seen=new Set(OFFICER_ROSTER.map(o=>JSON.stringify(portraitFrame(o,189))));assert.equal(seen.size,352);
 for(const name of HISTORIC_PORTRAITS){const officer=OFFICER_ROSTER.find(o=>o.name===name);assert(officer);assert.equal(portraitFrame(officer).atlas,'officersHistoric');}
 const dun=OFFICER_ROSTER.find(o=>o.name==='Xiahou Dun');assert.equal(portraitFrame(dun,197).cell,15);assert.equal(portraitFrame(dun,198).cell,5);
});
console.log(`${count} v16 regression groups passed.`);
