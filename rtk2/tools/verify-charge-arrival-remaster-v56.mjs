// Run: node SCRIPT.mjs APP_ROOT NATIVE_VECTORS.json OUTPUT.json
import fs from 'node:fs';
import path from 'node:path';import {pathToFileURL} from 'node:url';
const app=path.resolve(process.argv[2]||new URL('../',import.meta.url).pathname);
const {act,direction,ambushCells,distance}=await import(pathToFileURL(path.join(app,'mjs/battle.mjs')));
const {ambushAnimations,combatAnimations}=await import(pathToFileURL(path.join(app,'mjs/battle-presentation.mjs')));
const vectors=JSON.parse(fs.readFileSync(process.argv[3]||path.join(app,'docs/native-charge-arrival-v56.json'))).cases.filter(v=>v.branch!=='occupation-ended'),results=[];
for(const v of vectors){
 const b={phase:'battle',side:'attack',selected:0,day:1,eventSerial:0,actionSerial:0,messages:[],events:[],terrain:Array(156).fill(0),fire:{},weather:'sunny',units:[],attacker:0,defender:1,rulers:{attack:99,defend:98},leaders:{attack:0,defend:2},palace:{q:12,r:11},food:{attack:10000,defend:10000}};
 const make=(id,side,p,soldiers=5000)=>({id,side,q:p[0],r:p[1],soldiers,weapons:soldiers,war:100,int:80,training:80,mobility:7,placed:true,ordered:false,routed:false,fled:false,captured:false});
 const u=make(0,'attack',v.start),target=make(1,'defend',v.target,v.branch==='occupation'?1:5000);b.units.push(u,target);const nativeDirection=[3,4,5,0,1,2][v.nativeDirection],dest=v.branch==='occupation'?target:direction(target.q,target.r,nativeDirection);
 for(let i=0;i<6;i++){const p=direction(dest.q,dest.r,i);if([u,target].some(x=>distance(x,p)===0))continue;const enemy=make(i+2,'defend',[p.q,p.r]);b.units.push(enemy);b.terrain[p.r*13+p.q]=1;}
 if(v.branch==='blocked')b.terrain[dest.r*13+dest.q]=3;
 const g={s:{battle:b,difficulty:1},int:()=>1,random:()=>v.branch==='failed-chance'?1:.5,isHuman:()=>false,officer:id=>({name:'General'+id}),ruler:id=>({name:'Ruler'+id})};
 if(v.branch==='failed-chance')u.war=0;
 const text=act(g,'charge',{unit:u.id,target:target.id});const actual=ambushAnimations(b,b.lastAction,id=>g.officer(id).name),expected=v.calls.filter(x=>x.ambusher),actualCells=actual.map(x=>{const e=b.units.find(z=>z.id===x.unit);return [e.q,e.r]}),pass=JSON.stringify(actualCells)===JSON.stringify(expected.map(x=>x.ambusher))&&JSON.stringify([u.q,u.r])===JSON.stringify(v.landing);
 results.push({branch:v.branch,start:v.start,nativeDirection:v.nativeDirection,landing:[u.q,u.r],expectedLanding:v.landing,nativeAmbushes:expected.map(x=>x.ambusher),actualAmbushes:actual.map(x=>{const e=b.units.find(z=>z.id===x.unit);return[e.q,e.r]}),pass,exchanges:b.lastAction.exchanges,queue:[...combatAnimations(b.lastAction),...actual].map(x=>x.type),moverFinalMen:u.soldiers});
}
fs.writeFileSync(process.argv[4]||'/tmp/charge-arrival-remaster-v56.json',JSON.stringify(results,null,2)+'\n');console.log(results.length,'cases',results.filter(x=>!x.pass).length,'failed');console.log(results.filter(x=>!x.pass));
if(results.some(row=>!row.pass))process.exitCode=1;
