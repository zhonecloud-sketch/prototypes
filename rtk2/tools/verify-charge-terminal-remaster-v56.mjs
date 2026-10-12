// Run: node SCRIPT.mjs APP_ROOT NATIVE_TERMINAL_VECTORS.json OUTPUT.json
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const app=path.resolve(process.argv[2]||new URL('../',import.meta.url).pathname),{act}=await import(pathToFileURL(path.join(app,'mjs/battle.mjs'))),{ambushAnimations}=await import(pathToFileURL(path.join(app,'mjs/battle-presentation.mjs')));
const vectors=JSON.parse(fs.readFileSync(process.argv[3]||path.join(app,'docs/native-charge-terminal-v56.json'))).cases,rows=[];
for(const v of vectors){
 const b={phase:'battle',side:'attack',selected:0,day:1,eventSerial:0,actionSerial:0,messages:[],events:[],terrain:Array(156).fill(0),fire:{},weather:'sunny',units:[],attacker:0,defender:1,rulers:{attack:99,defend:98},leaders:{attack:0,defend:v.targetCommander?1:2},palace:{q:12,r:11},food:{attack:10000,defend:10000}};
 const make=(id,side,p,soldiers=5000)=>({id,side,q:p[0],r:p[1],soldiers,weapons:soldiers,war:80,int:89,training:80,mobility:7,placed:true,ordered:false,routed:false,fled:false,captured:false});const u=make(0,'attack',v.start),target=make(1,'defend',v.target,1),hidden=make(2,'defend',v.jungle);target.war=0;target.training=0;b.units=[u,target,hidden];b.terrain[hidden.r*13+hidden.q]=1;
 const g={s:{battle:b,difficulty:1},int:()=>1,random:()=>0,isHuman:()=>false,officer:id=>({name:'General'+id}),ruler:id=>({name:'Ruler'+id})};act(g,'charge',{unit:u.id,target:target.id});const actual=ambushAnimations(b,b.lastAction,id=>g.officer(id).name).length,expected=v.calls.length;
 rows.push({targetCommander:v.targetCommander,start:v.start,nativeDirection:v.nativeDirection,expectedAmbushCount:expected,actualAmbushCount:actual,terminalOutcome:b.outcome,moverMen:u.soldiers,targetMen:target.soldiers,pass:actual===expected});
}
fs.writeFileSync(process.argv[4]||'/tmp/charge-terminal-remaster-v56.json',JSON.stringify(rows,null,2)+'\n');console.log(rows.length,'cases',rows.filter(x=>!x.pass).length,'mismatches');
if(rows.some(row=>!row.pass))process.exitCode=1;
