import assert from 'node:assert/strict';
import {createCanvas} from '@napi-rs/canvas';
import {battleAIDiagnostics,diagnosticUnits,drawAIDiagnostics} from '../mjs/ai-diagnostics.mjs';
import {tilePoint,terrainCost,distance} from '../mjs/battle.mjs';
import {DEFAULT_AI} from '../mjs/ai-parameters.mjs';

function fixture(){
 const terrain=Array(156).fill(0);terrain[11*13+6]=6;terrain[5*13+6]=1;terrain[5*13+1]=1;
 for(let r=1;r<11;r++){terrain[r*13+3]=3;terrain[r*13+9]=3;}
 const unit=(id,side,q,r,soldiers,war=70)=>({id,side,q,r,soldiers,war,weapons:soldiers,training:80,int:60,mobility:6,placed:true,ordered:false});
 const b={phase:'battle',side:'defend',attacker:0,defender:1,units:[unit(1,'attack',6,0,5000),unit(2,'attack',7,0,5000),unit(3,'defend',6,7,2000,90),unit(4,'defend',6,11,3000)],terrain,fire:{},palace:{q:6,r:11},leaders:{attack:1,defend:4},day:2};
 return {s:{battle:b,seed:42},rules:{ai:structuredClone(DEFAULT_AI)},aiFor:()=>({intelligence:60}),officer:id=>({id,name:'General '+id}),random:()=>{throw Error('Inspection must not consume RNG');}};
}
let n=0;const test=(name,fn)=>{fn();n++;console.log('PASS',name);};
test('Inspection chooses the next eligible unit and preserves campaign bytes and RNG',()=>{
 const g=fixture(),before=JSON.stringify(g.s),d=battleAIDiagnostics(g);assert.equal(d.unit.id,3);assert.equal(JSON.stringify(g.s),before);
 g.s.battle.units[2].ordered=true;assert.equal(battleAIDiagnostics(g).unit.id,4);assert.equal(battleAIDiagnostics(g,'1').unit.id,1);
});
test('Jungle diagnostics use real weighted lanes and mark the preferred middle forest',()=>{
 const d=battleAIDiagnostics(fixture(),3),middle=d.jungles.find(c=>c.q===6&&c.r===5),off=d.jungles.find(c=>c.q===1&&c.r===5);
 assert(middle.lane>.6);assert.equal(off.lane,0);assert.deepEqual(d.goal,{q:6,r:5});assert(d.route.path.length);assert(d.affordable.length<=d.route.path.length);
});
test('Hidden invaders cannot appear in forest forecasts or inflate lane scores',()=>{
 const g=fixture(),u=g.s.battle.units[1];u.q=11;u.r=0;g.s.battle.terrain[u.r*13+u.q]=1;
 const d=battleAIDiagnostics(g,3);assert.deepEqual(d.forecasts.map(x=>x.unit.id),[1]);
});
test('Route overlay follows a distant mountain gap and highlights only affordable hexes',()=>{
 const g=fixture(),b=g.s.battle;b.side='attack';b.terrain=Array(156).fill(0);b.palace={q:10,r:2};b.terrain[2*13+10]=6;
 Object.assign(b.units[0],{q:3,r:4});Object.assign(b.units[1],{q:2,r:0});Object.assign(b.units[2],{q:11,r:8});Object.assign(b.units[3],b.palace);
 for(let r=0;r<11;r++)b.terrain[r*13+5]=3;
 const d=battleAIDiagnostics(g,1);assert(d.route);assert(d.route.path.some(c=>c.q===5&&c.r===11));assert(d.route.path.every(c=>b.terrain[c.r*13+c.q]!==3));
 assert(d.route.path.length>d.affordable.length);assert(d.affordable.reduce((n,c)=>n+terrainCost(b.terrain[c.r*13+c.q]),0)<=6);
});
test('Palace holding and adjacent attacks are described instead of claiming a move',()=>{
 const g=fixture();let d=battleAIDiagnostics(g,4);assert.equal(d.route,null);assert.match(d.reason,/Palace guard/);
 Object.assign(g.s.battle.units[0],{q:6,r:6});assert.equal(distance(g.s.battle.units[0],g.s.battle.units[2]),1);
 d=battleAIDiagnostics(g,3);assert.equal(d.route,null);assert.match(d.reason,/Adjacent attack/);
});
test('Inspection is unavailable during placement/results, and blocked forests remain identified',()=>{
 const g=fixture();g.s.battle.fire[5*13+6]=2;assert(battleAIDiagnostics(g,3).jungles.find(c=>c.q===6&&c.r===5).blocked);
 g.s.battle.phase='deployment';assert.deepEqual(diagnosticUnits(g),[]);assert.equal(battleAIDiagnostics(g),null);
 g.s.battle.phase='battle';g.s.battle.outcome={winner:'attack'};assert.equal(battleAIDiagnostics(g),null);
});
test('Real canvas draws independent overlays at landscape sizes without changing diagnostic data',()=>{
 const d=battleAIDiagnostics(fixture(),3),before=JSON.stringify(d);
 for(const [width,height]of [[640,393],[426,270],[1100,700]])for(const [showPaths,showJungles]of [[true,false],[false,true],[true,true]]){
  const canvas=createCanvas(width,height),ctx=canvas.getContext('2d'),scale=Math.min((width-32)/20,(height-62)/22),screen=p=>({x:width/2+p.x*scale,y:height/2+p.z*scale});
  drawAIDiagnostics(ctx,{...d,showPaths,showJungles},{screen,scale,width,height});assert(canvas.toBuffer('image/png').length>1000);
 }
 assert.equal(JSON.stringify(d),before);
});
console.log(`${n} v39 AI inspection groups passed.`);
