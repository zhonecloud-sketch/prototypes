import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Game,createCampaign,validateSave,activeRulers} from '../mjs/strategy.mjs';
import {terrainMask,terrainVariant,ownershipCells,ownershipNorth,layoutCityBadges} from '../mjs/terrain-mask.mjs';
import {pointFor} from '../mjs/geography.mjs';
import {realmRoute} from '../mjs/campaign-decisions.mjs';
import {orderInsight,relevantAttributes} from '../mjs/game-ui.mjs';
const scenarios=JSON.parse(fs.readFileSync(new URL('../config/scenarios.json',import.meta.url))),terrain=JSON.parse(fs.readFileSync(new URL('../config/province-terrain.json',import.meta.url)));
const fresh=()=>{const g=new Game(createCampaign(scenarios[0],[0]),{},structuredClone(terrain));g.s.monthlyReview=null;return g;};
const check=g=>assert(validateSave(g.s,scenarios,terrain));
let checks=0;const test=(name,fn)=>{fn();checks++;console.log('PASS',name);};
function win(empty=false,strong=false){const g=fresh(),target=g.province(8),source=g.province(9),former=target.owner,ids=[...target.officers];
 if(empty){const p=g.province(target.neighbors.find(id=>id!==source.id));for(const id of p.officers){g.officer(id).owner=255;p.unclaimed.push(id);}p.officers=[];p.owner=255;p.governor=null;g.normalize();}
 for(const p of target.neighbors.map(id=>g.province(id)))if(p.owner===255&&!empty){const id=source.officers.find(id=>id!==0);source.officers=source.officers.filter(x=>x!==id);p.officers=[id];p.owner=0;p.governor=id;}
 for(const id of ids){g.officer(id).int=strong?100:0;g.officer(id).war=strong?100:0;}
 g.random=()=>.5;g.invade({province:9,target:8,officers:[0],food:10000});g.s.battle.outcome={winner:'attack',reason:'Palace occupied'};g.resolveBattle();return {g,former,ids};
}
test('No empty adjacent province captures every defending officer, including ruler/governor; checkpoint retains decisions',()=>{
 const {g,ids}=win();assert.deepEqual(new Set(g.s.captiveDecisions.map(c=>c.officer)),new Set(ids));assert(g.s.captiveDecisions.some(c=>c.role==='Ruler'));assert.equal(g.s.battle,null);assert.throws(()=>g.finishFactionTurn(),/captives/);
 const restored=new Game(validateSave(g.s,scenarios,terrain),{},terrain);assert.deepEqual(restored.s.captiveDecisions,g.s.captiveDecisions);check(restored);
});
test('With an empty escape province, high INT/WAR can escape and low attributes increase capture',()=>{
 const strong=win(true,true),weak=win(true,false);assert.equal(strong.g.s.captiveDecisions.length,0);assert.equal(weak.g.s.captiveDecisions.length,weak.ids.length);
 assert(strong.ids.every(id=>strong.g.s.provinces.some(p=>p.id!==8&&p.officers.includes(id))));check(strong.g);check(weak.g);
});
test('Recruitment refusal leaves a choice; beheading removes an officer permanently and decisions cannot repeat',()=>{
 const {g,ids}=win(),id=ids.find(id=>g.s.captiveDecisions.find(c=>c.officer===id).role!=='Ruler');g.random=()=>.999;assert.equal(g.decideCaptive(id,'recruit'),false);assert(g.officer(id).prisonerOf!==undefined);assert.throws(()=>g.decideCaptive(id,'recruit'),/already refused/);
 assert(g.decideCaptive(id,'behead'));assert(g.officer(id).dead);assert(!g.s.provinces.some(p=>['officers','hidden','unclaimed'].some(k=>p[k].includes(id))));assert.throws(()=>g.decideCaptive(id,'free'),/already/);check(g);
});
test('Recruiting a captured ruler replaces its surviving realm leader without invalidating saves',()=>{
 const {g}=win();const c=g.s.captiveDecisions.find(c=>c.role==='Ruler');g.random=()=>0;g.decideCaptive(c.officer,'recruit');assert.equal(g.officer(c.officer).owner,0);check(g);
});
test('A released landless ruler continues in exile, moves through connected provinces and settles',()=>{
 const {g,former}=win();g.s.humanRulers.push(former);for(const c of [...g.s.captiveDecisions])g.decideCaptive(c.officer,'free');const party=g.s.roaming.find(p=>p.owner===former);assert(party);assert(activeRulers(g.s).some(r=>r.id===former));check(g);
 g.s.player=former;g.s.selected=party.province;const empty=g.s.provinces.find(p=>p.owner===255);assert(empty);for(const id of realmRoute(g,party.province,empty.id).slice(1))g.roam('move',id);g.roam('settle');assert.equal(g.province(empty.id).owner,former);assert.equal(g.roaming(),undefined);check(g);
});
test('Defeated human realms relinquish control after decisions; the last human gets a clear ended campaign',()=>{
 for(const last of [false,true]){const {g,former}=win();g.s.humanRulers=last?[former]:[0,former];g.s.player=former;const c=g.s.captiveDecisions.find(c=>c.role==='Ruler');g.decideCaptive(c.officer,'behead');for(const next of [...g.s.captiveDecisions])g.decideCaptive(next.officer,'free');assert(!g.s.humanRulers.includes(former));if(last){assert(g.s.campaignEnded&&g.s.paused);assert.equal(g.aiStep(),false);}else{assert(!g.s.campaignEnded);assert.notEqual(g.s.player,former);}check(g);}
});
function trip(){const g=fresh();g.random=()=>0;const target=g.ruler(3),route=realmRoute(g,9,target.home);g.s.humanRulers=[...new Set([0,...route.map(id=>g.province(id).owner).filter(id=>id!==255)])];return g;}
test('A dispatched gift has no early effect, blocks extra orders and resumes after save/load',()=>{
 const g=trip(),gold=g.province(9).gold,other=g.province(g.ruler(3).home).gold,seed=g.s.seed;g.execute('diplomaticMission',{province:9,mode:'gift',target:3,officer:34,amount:100});assert(g.s.journey);assert.equal(g.province(9).gold,gold-100);assert.equal(g.province(g.ruler(3).home).gold,other);assert.equal(g.s.seed,seed);assert(g.officer(34).acted&&g.officer(34).inTransit);assert.throws(()=>g.execute('develop',{province:9,officer:33,amount:10}),/journey/);
 const loaded=new Game(validateSave(g.s,scenarios,terrain),{},terrain);loaded.random=()=>0;let steps=0;while(loaded.s.journey){if(loaded.s.journey.interception)loaded.interceptJourney('free');else loaded.advanceJourney();assert(++steps<150);check(loaded);}assert.equal(loaded.province(9).gold,gold-100);assert.equal(loaded.province(loaded.ruler(3).home).gold,other+100);assert(!loaded.officer(34).inTransit);check(loaded);
});
test('Intercepted envoy can be captured or beheaded; cancelled missions transfer no gift and clear transit',()=>{
 for(const choice of ['capture','behead']){const g=trip(),gold=g.province(9).gold;g.execute('diplomaticMission',{province:9,mode:'gift',target:3,officer:34,amount:100});for(let n=0;n<40&&!g.s.journey.interception;n++)g.advanceJourney();assert(g.s.journey.interception);g.interceptJourney(choice);assert.equal(g.s.journey,null);assert.equal(g.province(9).gold,gold-100);assert(!g.officer(34).inTransit);if(choice==='behead')assert(g.officer(34).dead);else assert(g.s.captiveDecisions.some(c=>c.officer===34));check(g);}
});
test('Invalid dispatch and invalid saved route reject atomically',()=>{
 const g=trip(),before=JSON.stringify(g.s);assert.throws(()=>g.execute('diplomaticMission',{province:9,mode:'gift',target:3,officer:34,amount:99}));assert.equal(JSON.stringify(g.s),before);g.execute('diplomaticMission',{province:9,mode:'gift',target:3,officer:34,amount:100});const broken=structuredClone(g.s);broken.journey.legs[0].route=[9,41];assert.throws(()=>validateSave(broken,scenarios,terrain),/route/);
});
test('Six-direction masks distinguish connected terrain and ownership polygons meet without overlapping',()=>{
 const tiles=Array(156).fill(4);assert.equal(terrainMask(tiles,6,6),63);tiles[5*13+6]=0;assert.equal(terrainMask(tiles,6,6),61);assert.notEqual(terrainVariant(tiles,6,6).key,terrainVariant(tiles,7,6).key);assert.equal(terrainVariant(tiles,6,6).edges.length,1);
 const cells=ownershipCells([{x:-10,z:0},{x:10,z:0}],[-20,-20,20,20]);assert(cells[0].every(p=>p.x<=.000001));assert(cells[1].every(p=>p.x>=-.000001));
});
test('Numbered city seals remain distinct in dense mobile China views',()=>{
 for(const [width,height] of [[340.8,393],[266.8,375]]){const scale=Math.min(width/144,(height-24)/130)*.92,cs=Math.max(9,Math.min(24,scale*3.2))*1.65,anchors=scenarios[0].provinces.map(p=>{const a=pointFor(p);return {id:p.id,x:width/2+a.x*scale,y:height/2+(a.z-7)*scale-cs*.55};}),labels=[...layoutCityBadges(anchors,width,height).values()];assert.equal(labels.length,41);for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++)assert(Math.abs(labels[i].x-labels[j].x)>=24||Math.abs(labels[i].y-labels[j].y)>=24,'Province seals overlap');}
});
test('Relevant abilities and local intelligent-advisor forecasts do not consume RNG',()=>{
 const g=fresh();g.ruler().advisor=33;g.officer(33).int=95;const seed=g.s.seed;assert(orderInsight(g,'Cultivate',34).includes('Expected improvement'));assert(orderInsight(g,'Recruit',34,{target:g.province(9).unclaimed[0]??40}).includes('chance'));assert.equal(g.s.seed,seed);assert(relevantAttributes('Train').includes('war'));assert(orderInsight(g,'Spy · Forged letter',34,{target:40}).includes('chance'));assert.equal(g.s.seed,seed);g.ruler().advisor=null;assert.equal(orderInsight(g,'Search',34),'');
});
test('Northern ownership caps lower provinces 1,2,3,4,15 without moving cities or changing other sectors',()=>{const points=scenarios[0].provinces.map(p=>({...pointFor(p),id:p.id})),cells=ownershipCells(points),plain=ownershipCells(points.map(({x,z})=>({x,z})));for(let i=0;i<41;i++){if([1,2,3,4,15].includes(i+1)){assert(cells[i].length>=3);assert(cells[i].every(v=>v.z>=ownershipNorth(points[i])-1e-8));assert(cells[i].some(v=>Math.abs(v.z-ownershipNorth(points[i]))<1e-8));}else assert.deepEqual(cells[i],plain[i]);}});
console.log(checks+' campaign decision, travel and terrain checks passed.');
