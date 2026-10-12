import fs from 'node:fs';import assert from 'node:assert/strict';
import {Game,createCampaign} from '../mjs/strategy.mjs';
import {aiBattle,ambushCells,direction,distance,visibleUnit,act,tilePoint} from '../mjs/battle.mjs';
import {ambushExchange} from '../mjs/native-combat.mjs';
import {ambushAnimations,chargePosition,combatAnimationPhase,combatAnimationDuration} from '../mjs/battle-presentation.mjs';
import {presentEvent} from '../mjs/events.mjs';
const scenarios=JSON.parse(fs.readFileSync(new URL('../config/scenarios.json',import.meta.url))),terrains=JSON.parse(fs.readFileSync(new URL('../config/province-terrain.json',import.meta.url)));
function arena(){const g=new Game(createCampaign(scenarios[0],[0]),{},structuredClone(terrains));g.s.settings.battleView='all';g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000});while(g.s.battle.phase==='deployment')aiBattle(g,60);const b=g.s.battle,u=b.units.find(u=>u.id===0),f=b.units.find(u=>u.id===34),enemies=b.units.filter(u=>u.side==='defend');b.units=[u,f,...enemies.slice(0,2)];b.side='attack';b.selected=u.id;b.terrain=Array(156).fill(0);b.terrain[155]=6;b.palace={q:12,r:11};b.weather='sunny';b.fire={};for(const v of b.units)Object.assign(v,{soldiers:10000,weapons:10000,war:80,int:80,training:20,mobility:10,placed:true,ordered:false,routed:false,fled:false,morale:100});Object.assign(f,{q:0,r:0});g.random=()=>.5;return {g,b,u,enemies:enemies.slice(0,2)};}
for(const q of [5,6])for(let d=0;d<6;d++){
 const {g,b,u,enemies}=arena(),from={q,r:5},to=direction(q,5,d),cells=ambushCells(from,to).filter(p=>distance(from,p)>1);assert(cells.length>=2);Object.assign(u,from);enemies.forEach((v,i)=>{Object.assign(v,cells[i]);b.terrain[v.r*13+v.q]=1;assert.equal(visibleUnit(b,v),false);});
 const expected={...u};for(const enemy of enemies){const hit=ambushExchange(expected,enemy,0,()=>.5);expected.soldiers-=hit.loss;expected.weapons-=hit.weapons;}
 act(g,'move',{unit:u.id,...to});assert.equal(u.soldiers,expected.soldiers);assert.equal(u.weapons,expected.weapons);const animations=ambushAnimations(b,b.lastAction,id=>g.officer(id).name);assert.equal(animations.length,2);assert.deepEqual(new Set(animations.map(a=>a.unit)),new Set(enemies.map(v=>v.id)));assert(enemies.every(v=>!v.ordered&&v.mobility===10));
 const state=JSON.stringify(g.s),seed=g.s.seed;for(const a of animations){assert.equal(combatAnimationDuration(a),3000);combatAnimationPhase(a,300);}assert.equal(JSON.stringify(g.s),state);assert.equal(g.s.seed,seed);
}
console.log('PASS two concealed jungle enemies both apply native ambush loss and produce separate animations in all six directions and both column parities');
for(const from of [{q:6,r:4},{q:7,r:4}])for(let d=0;d<6;d++){
 const target=direction(from.q,from.r,d),action={type:'charge',unit:1,target:2,combatUnits:[{id:1,...from},{id:2,...target}],landing:{...from}};
 assert.equal(combatAnimationDuration(action),7300);assert.deepEqual(chargePosition(action,{id:1},0),{...tilePoint(from.q,from.r),walk:true});const middle=chargePosition(action,{id:1},325),a=tilePoint(from.q,from.r),z=tilePoint(target.q,target.r);assert.equal(middle.x,(a.x+z.x)/2);assert.equal(middle.z,(a.z+z.z)/2);
 for(let cycle=0;cycle<80;cycle++){assert.equal(combatAnimationPhase(action,650+cycle*75).cycle,cycle+1);assert.equal(combatAnimationPhase(action,688+cycle*75).frame,1);assert.deepEqual(chargePosition(action,{id:1},650+cycle*75),{...z,walk:false});}
 assert.deepEqual(chargePosition(action,{id:1},7300),{...a,walk:true});action.landing={...target};assert.deepEqual(chargePosition(action,{id:1},7300),{...z,walk:false});action.landing=direction(target.q,target.r,d);assert.deepEqual(chargePosition(action,{id:1},7300),{...tilePoint(action.landing.q,action.landing.r),walk:true});
}
console.log('PASS charge marches through offset hexes, plays eight flashes per charge exchange on the defender tile, returns on failure and follows resolved occupation or breakthrough');
{
 const {g,b,u,enemies}=arena(),target=enemies[0];Object.assign(u,{q:6,r:4,war:0});Object.assign(target,{q:7,r:4,war:0});Object.assign(enemies[1],{q:0,r:11});act(g,'charge',{unit:u.id,target:target.id});assert(target.soldiers>0&&u.soldiers>0);assert.deepEqual({q:u.q,r:u.r},{q:6,r:4});assert(!b.lastChargeLanding);const action={...b.lastAction,landing:{q:u.q,r:u.r}};assert.deepEqual(chargePosition(action,u,7300),{...tilePoint(6,4),walk:true});
}
console.log('PASS a real failed charge retains its source tile and its animation returns to that same tile');
const g=new Game(createCampaign(scenarios[0],[0]),{},terrains),injury={kind:'month',art:'medical',title:'Battle injury · Chenliu',province:9,text:'Cao Hong was injured in battle. Recovery expected in 3 months. Impact: people 0 unchanged; soldiers 0 unchanged; gold 0 unchanged; food 0 unchanged; land 0 unchanged; flood control 0 unchanged.',impact:{people:0,soldiers:0,gold:0,food:0,land:0,flood:0}};
const before=JSON.stringify(injury);assert.equal(presentEvent(g,injury).text,'Cao Hong was injured in battle. Recovery expected in 3 months.');assert.equal(JSON.stringify(injury),before);assert(presentEvent(g,{...injury,art:'flood',title:'Flood'}).text.includes('Impact:'));
console.log('PASS injury presentation keeps recovery information and removes redundant zero impacts without changing the saved event');
