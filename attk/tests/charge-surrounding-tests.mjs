import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createCanvas} from '@napi-rs/canvas';
import {act} from '../mjs/battle.mjs';
import {ambushAnimations} from '../mjs/battle-presentation.mjs';
import {createRasterWorld} from '../mjs/raster-world.mjs';
const dom=new JSDOM('<div id="world"><canvas id="scene"></canvas><div id="labels"></div></div>',{pretendToBeVisual:true});globalThis.document=dom.window.document;globalThis.ResizeObserver=class{constructor(fn){this.fn=fn;}observe(){this.fn();}disconnect(){}};globalThis.devicePixelRatio=1;globalThis.matchMedia=()=>({matches:false});
dom.window.HTMLCanvasElement.prototype.getContext=function(){this.backing??=createCanvas(this.width,this.height);return this.backing.getContext('2d');};
const parent=document.querySelector('#world'),canvas=document.querySelector('#scene');parent.getBoundingClientRect=()=>({width:640,height:360});canvas.getContext=()=>createCanvas(640,360).getContext('2d');const im=createCanvas(64,64),assets={relief:im,army:im,capitals:im,battlefield01:im};let groups=0;
function fixture(branch,side='attack'){
 const enemy=side==='attack'?'defend':'attack',make=(id,side,q,r,soldiers=5000)=>({id,side,q,r,soldiers,weapons:soldiers,war:100,int:80,training:80,mobility:7,placed:true,ordered:false,routed:false,fled:false,captured:false}),u=make(0,side,branch==='occupation'?5:6,4),target=make(1,enemy,branch==='occupation'?4:5,branch==='occupation'?5:4,branch==='occupation'?1:5000),one=make(2,enemy,5,5),two=make(3,enemy,4,4),b={phase:'battle',side,selected:0,target:1,day:1,eventSerial:0,actionSerial:0,messages:[],events:[],terrain:Array(156).fill(0),fire:{},weather:'sunny',units:[u,target,one,two],attacker:0,defender:1,rulers:{attack:99,defend:98},leaders:{[side]:0,[enemy]:3},palace:{q:12,r:11},food:{attack:10000,defend:10000}};b.terrain[5*13+5]=b.terrain[4*13+4]=1;
 let draws=0;const g={s:{battle:b,difficulty:1,provinces:[],settings:{quality:'low'},paused:false,selected:1},int:()=>1,random:()=>{draws++;return .5;},isHuman:()=>false,battleHuman:()=>false,province:()=>({id:1}),officer:id=>({name:'General'+id}),ruler:id=>({name:'Ruler'+id})};return {g,b,u,target,one,two,draws:()=>draws};
}
for(const side of ['attack','defend'])for(const branch of ['occupation','breakthrough'])for(const speed of [500,1000,2000,3000]){
 let time=0,frames=[];globalThis.performance={now:()=>time};globalThis.requestAnimationFrame=fn=>frames.push(fn);const f=fixture(branch,side);f.g.s.speed=speed;const cues=[],seen=[],world=createRasterWorld(canvas,document.querySelector('#labels'),f.g,{land:[],rivers:[]},[],assets,'province',()=>{},()=>{},{onCombatCue:(a,cycle)=>cues.push([a.type,a.unit,cycle])});
 act(f.g,'charge',{unit:0,target:1});assert.deepEqual([f.u.q,f.u.r],[4,5]);assert.equal(f.b.lastChargeLanding.kind,branch);assert.deepEqual(f.b.messages.filter(m=>m.ambush).map(m=>m.ambush.unit),[3,2]);assert(f.one.soldiers===5000&&f.two.soldiers===5000);assert(f.u.soldiers<5000);assert(!f.one.ordered&&!f.two.ordered);const state=JSON.stringify(f.b.units),draws=f.draws();world.update();let done=false;world.afterCombat(()=>{done=true;});
 while(!done&&time<12000){time+=40;const todo=frames;frames=[];for(const fn of todo)fn(time);const a=world.stats.combatAnimation;if(a&&(seen.at(-1)?.unit!==a.units[0]||seen.at(-1)?.type!==a.type))seen.push({type:a.type,unit:a.units[0],started:time});}
 assert(done);assert.deepEqual(seen.map(a=>[a.type,a.unit]),[['charge',0],['ambush',3],['ambush',2]]);assert.equal(cues.filter(a=>a[0]==='ambush').length,16);for(let i=1;i<seen.length;i++)assert(Math.abs((seen[i+1]?.started??time)-seen[i].started-speed)<=40);assert.equal(JSON.stringify(f.b.units),state);assert.equal(f.draws(),draws);world.destroy();groups++;
}
console.log('PASS '+groups+' literal two-jungle engine/Canvas queues: both camps, both landings, all speeds, 16 cues, no replayed casualties/RNG');
for(const control of ['friendly','plain','empty','failed-breakthrough','captured-mover','target-in-jungle']){
 const f=fixture(control==='captured-mover'?'occupation':'breakthrough');if(control==='friendly')f.one.side=f.two.side=f.u.side;if(control==='plain')f.b.terrain.fill(0);if(control==='empty')f.b.units=f.b.units.slice(0,2);if(control==='failed-breakthrough')f.u.war=0;if(control==='captured-mover'){f.u.soldiers=f.u.weapons=400;f.one.soldiers=f.one.weapons=f.two.soldiers=f.two.weapons=10000;}if(control==='target-in-jungle')f.b.terrain[f.target.r*13+f.target.q]=1;
 act(f.g,'charge',control==='target-in-jungle'?{unit:0,q:f.target.q,r:f.target.r}:{unit:0,target:1});const ambushes=ambushAnimations(f.b,f.b.lastAction,id=>'General'+id);if(control==='captured-mover'){assert(f.u.captured);assert.equal(ambushes.length,1);}else assert.equal(ambushes.length,control==='target-in-jungle'?3:0,control);
}
console.log('PASS friendly/plain/empty/failed landing controls, surviving jungle target and early stop when the mover is captured');dom.window.close();
