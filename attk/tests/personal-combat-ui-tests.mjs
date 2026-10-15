import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {setTimeout as settle} from 'node:timers/promises';
import {JSDOM} from 'jsdom';
import {createCanvas,Image as RasterImage} from '@napi-rs/canvas';
import {Game,createCampaign} from '../mjs/strategy.mjs';
import {aiBattle} from '../mjs/battle.mjs';
import {VISUAL_INTERVAL} from '../mjs/message-playback.mjs';
import {createPersonalCombatPresentation} from '../mjs/personal-combat-ui.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const tmp=fs.mkdtempSync(path.join(root,'node_modules/pc-ui-'));
for(const folder of ['mjs','config'])fs.cpSync(path.join(root,folder),path.join(tmp,folder),{recursive:true});
fs.writeFileSync(path.join(tmp,'package.json'),'{}');
const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://attk.test',pretendToBeVisual:true,runScripts:'outside-only'}),win=dom.window;
for(const key of ['window','document','localStorage','HTMLElement','HTMLCanvasElement','FormData','Blob','Event','MouseEvent','AbortController'])globalThis[key]=key==='window'?win:win[key];
win.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
win.HTMLDialogElement.prototype.close=function(){this.open=false;};
const closeWindow=win.close.bind(win);win.close=()=>{};
globalThis.screen={orientation:{lock:async()=>{}}};
globalThis.devicePixelRatio=1;
globalThis.ResizeObserver=class{constructor(fn){this.fn=fn;}observe(node){this.fn([{target:node}]);}disconnect(){}unobserve(){}};
globalThis.Audio=class{constructor(){this.paused=true;}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}};
const images=[];globalThis.Image=class extends RasterImage{constructor(){super();images.push(this);}set src(value){this.file=value;super.src=path.join(root,String(value).replace(/^\.\//,''));}};
let viewport={width:640,height:360};
win.Element.prototype.getBoundingClientRect=function(){const width=this.id==='world'||this.id==='scene'||this.classList.contains('personal-combat-art')?viewport.width*.75:viewport.width*.25,height=this.classList.contains('personal-combat-art')?viewport.height-120:viewport.height;return {width,height,left:0,top:0,right:width,bottom:height};};
for(const key of ['width','height']){const descriptor=Object.getOwnPropertyDescriptor(win.HTMLCanvasElement.prototype,key);Object.defineProperty(win.HTMLCanvasElement.prototype,key,{...descriptor,set(value){descriptor.set.call(this,value);if(this._canvas)this._canvas[key]=Number(value);}});}
win.HTMLCanvasElement.prototype.getContext=function(){this._canvas??=createCanvas(this.width,this.height);return this._canvas.getContext('2d');};
for(const file of ['style.css','attk.css']){const style=document.createElement('style');style.textContent=fs.readFileSync(path.join(root,file),'utf8');document.head.append(style);}
win.eval(fs.readFileSync(path.join(root,'vendor/js-yaml.js'),'utf8'));globalThis.jsyaml=win.jsyaml;
const append=document.head.append.bind(document.head);document.head.append=(...nodes)=>{append(...nodes);for(const node of nodes)if(node.tagName==='SCRIPT')setImmediate(()=>node.onload?.());};
document.modelContext={registerTool(){}};
globalThis.fetch=async url=>{const file=path.join(root,String(url).replace(/^\.\//,''));return {ok:fs.existsSync(file),json:async()=>JSON.parse(fs.readFileSync(file)),text:async()=>fs.readFileSync(file,'utf8')};};
let now=0,nextTimer=0;const timers=new Map();
globalThis.performance={now:()=>now};
globalThis.setTimeout=(fn,delay=0)=>{const id=++nextTimer;timers.set(id,{fn,at:now+Math.max(1,delay)});return id;};
globalThis.clearTimeout=id=>timers.delete(id);
globalThis.setInterval=(fn,ms)=>{const id=++nextTimer,tick=()=>{fn();timers.set(id,{fn:tick,at:now+ms});};timers.set(id,{fn:tick,at:now+ms});return id;};
globalThis.clearInterval=globalThis.clearTimeout;
globalThis.requestAnimationFrame=fn=>setTimeout(()=>fn(now),16);
async function advance(ms){const end=now+ms;for(;;){const entry=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!entry)break;timers.delete(entry[0]);now=entry[1].at;entry[1].fn();await Promise.resolve();}now=end;await new Promise(setImmediate);}
async function until(fn,limit=5000){for(let elapsed=0;!fn()&&elapsed<limit;elapsed+=16){await advance(16);await settle(2);}assert(fn(),'Timed out waiting for mounted UI: '+document.querySelector('#loadStatus').textContent+' '+JSON.stringify(images.filter(im=>!im.width).map(im=>im.file)));}
const click=selector=>{const node=document.querySelector(selector);assert(node,'Missing '+selector);assert(!node.disabled,'Disabled '+selector);node.click();};
const state=()=>win.rtk2.state;
await import(pathToFileURL(path.join(tmp,'mjs/app.mjs')).href);
await until(()=>!!win.rtk2,180000);
for(const key of ['Challenge','Win','Loss']){const im=images.find(im=>im.file==='./assets/artwork/personal-combat-'+key.toLowerCase()+'.webp');assert.deepEqual([im.width,im.height],[1983,793]);}for(let i=1;i<=4;i++){const im=images.find(im=>im.file.endsWith('personal-combat-close-'+i+'.webp'));assert.deepEqual([im.width,im.height],[1983,793]);}assert(!images.some(im=>im.file.endsWith('personal-combat-sprites.webp')));
const scenarios=JSON.parse(fs.readFileSync(path.join(root,'config/scenarios.json'))),terrains=JSON.parse(fs.readFileSync(path.join(root,'config/province-terrain.json')));
function fixture(){const g=new Game(createCampaign(scenarios[0],[0]),{},structuredClone(terrains));g.s.monthlyReview=null;g.s.settings.battleView='all';g.s.paused=true;g.s.speed=g.s.settings.messageSpeed=500;for(const o of g.s.officers)o.ambition=0;g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000});const b=g.s.battle;g.s.humanRulers=[b.attacker,b.defender];while(!(b.side==='defend'&&b.units.every(u=>u.placed)))aiBattle(g);return g;}
async function load(g){const before=state(),payload=JSON.stringify(g.s);win.showOpenFilePicker=async()=>[{getFile:async()=>({name:'duel.json',size:payload.length,text:async()=>payload})}];click('#loadGame');click('#readSave');await until(()=>state()&&state()!==before);}
function leave(){click('#battleMenu');click('#exitGame');}
let groups=0;
try{
 for(const side of ['defend','attack']){
  await load(fixture());click('#confirmDeployment');await advance(510);assert(document.querySelector('#offerPersonalCombat'),'No post-deployment human offer');assert.equal(state().battle.openingChallenge.side,'defend');
  if(side==='attack'){click('#declinePersonalCombat');if(document.querySelector('#acceptArmy'))click('#acceptArmy');await advance(510);assert.equal(state().battle.openingChallenge.side,'attack');}
  const b=state().battle,u=b.units.find(u=>u.side===side&&u.id!==b.leaders[side]);u.war=20;document.querySelector('#duelInitiator').value=u.id;click('#offerPersonalCombat');
  if(document.querySelector('#acceptArmy'))click('#acceptArmy');
  await advance(32);assert.equal(document.querySelector('#personalCombat').dataset.stage,'challenge');assert(document.querySelector('#personalCombat').textContent.includes(state().rulers.find(r=>r.id===b.attacker).name));
  assert.equal(document.querySelectorAll('.personal-combat-general')[0].dataset.side,'defend');assert.equal(document.querySelectorAll('.personal-combat-general')[1].dataset.side,'attack');
  await advance(VISUAL_INTERVAL-64);assert(!document.querySelector('#personalCombat').hidden);await advance(64);assert(document.querySelector('#personalCombat').hidden);assert(document.querySelector('#duelResponder'));click('#refuseChallenge');if(document.querySelector('#acceptArmy'))click('#acceptArmy');await advance(1010);assert.equal(b.phase,'battle');leave();await advance(32);groups++;console.log('PASS mounted human '+side+' initiates after deployment, including WAR 20 and affiliations');
 }
 for(const wins of [true,false]){
  const g=fixture(),b=g.s.battle;while(!b.openingChallenge)aiBattle(g);g.battleAction('openingChallenge',{accept:false});const u=b.units.find(u=>u.side==='attack'&&u.id!==b.leaders.attack),v=b.units.find(u=>u.side==='defend'&&u.id!==b.leaders.defend);u.war=wins?100:30;v.war=wins?30:100;g.battleAction('openingChallenge',{accept:true,unit:u.id});await load(g);document.querySelector('#duelResponder').value=v.id;click('#acceptChallenge');if(document.querySelector('#acceptArmy'))click('#acceptArmy');await advance(32);
  const live=state().battle,combat=live.messages.findLast(m=>m.personalCombat?.stage==='combat').personalCombat.duel;assert.equal(document.querySelector('#personalCombat').dataset.stage,'combat');const before=JSON.stringify(live.units),seed=state().seed;
  await advance(500);for(const card of document.querySelectorAll('.personal-combat-general'))assert.equal(Number(card.querySelector('output').dataset.strength),combat.rounds[0][card.dataset.side]);
  document.querySelector('#battleMenu').click();const frozen=document.querySelector('.personal-combat-general output').textContent;await advance(10000);assert.equal(document.querySelector('.personal-combat-general output').textContent,frozen);click('#menuClose');
  await advance(combat.rounds.length*500-500);assert.equal(document.querySelector('#personalCombat').dataset.stage,wins?'win':'loss');assert.equal(JSON.stringify(live.units),before);assert.equal(state().seed,seed);
  for(const size of [{width:568,height:270},{width:640,height:360},{width:844,height:390}]){viewport=size;assert.equal(win.getComputedStyle(document.querySelector('#personalCombat')).overflow,'auto');}
  await advance(VISUAL_INTERVAL-100);assert(!document.querySelector('#personalCombat').hidden);await advance(100);assert(document.querySelector('#personalCombat').hidden);assert(document.querySelector('#toast').textContent.includes('was captured'));await advance(VISUAL_INTERVAL);leave();await advance(32);groups++;console.log('PASS mounted native counters, pause, initiator '+(wins?'win':'loss')+' scene and unchanged state/RNG');
 }
 {
  let elapsed=0;const assets=Object.fromEntries(images.filter(im=>/personal-combat-close-[1-4]/.test(im.file)).map(im=>['personalCombatClose'+im.file.match(/close-(\d)/)[1],im])),duel={initial:{defend:100,attack:100},rounds:Array.from({length:10},(_,i)=>({defend:99-i,attack:98-i}))},fighters=['defend','attack'].map((side,id)=>({side,id,name:side,ruler:side+' ruler',war:100})),presentation=createPersonalCombatPresentation(document.querySelector('#world'),assets,()=>elapsed,()=>false,()=>2000),pixels=new Set();
  presentation.show({text:'Crossed weapons',personalCombat:{stage:'combat',duel,fighters}});
  for(const [time,pose]of [[0,0],[2999,0],[3000,1],[6000,2],[9000,3],[12000,0]]){elapsed=time;await advance(16);const panel=document.querySelector('#personalCombat'),canvas=panel.querySelector('canvas');assert.equal(Number(panel.dataset.pose),pose);assert.equal(Number(panel.querySelector('output').dataset.strength),time<2000?100:duel.rounds[Math.floor(time/2000)-1].defend);pixels.add(canvas._canvas.toBuffer('image/png').toString('base64'));}
  assert.equal(pixels.size,4);presentation.destroy();groups++;console.log('PASS four distinct full-scene frames loop every 3 seconds while counters advance every 2 seconds');
 }
 console.log(`${groups} mounted personal-combat groups passed.`);
}finally{closeWindow();timers.clear();}
