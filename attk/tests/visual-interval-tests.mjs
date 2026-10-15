import assert from 'node:assert/strict';
import {act,ambushCells} from '../mjs/battle.mjs';
import {battleStatusMessages,battleMessageDuration,ambushAnimations,combatAnimationDuration,combatAnimationPhase} from '../mjs/battle-presentation.mjs';
import {VISUAL_INTERVAL,MESSAGE_SPEEDS,createMessagePlayer} from '../mjs/message-playback.mjs';

function fixture(){
 const unit=(id,side,q,r,soldiers=5000)=>({id,side,originalSide:side,q,r,soldiers,weapons:soldiers,war:100,int:80,training:80,mobility:7,placed:true,ordered:false,routed:false,fled:false,captured:false});
 const u=unit(0,'attack',6,5),v=unit(1,'defend',6,6),reserve=unit(2,'defend',0,0),b={phase:'battle',side:'attack',selected:0,target:1,day:1,eventSerial:0,actionSerial:0,messages:[],events:[],terrain:Array(156).fill(0),fire:{},weather:'sunny',units:[u,v,reserve],attacker:0,defender:1,rulers:{attack:99,defend:98},leaders:{attack:0,defend:2},palace:{q:12,r:11},food:{attack:10000,defend:10000}};
 let calls=0;const g={s:{battle:b,difficulty:1},int:()=>1,random:()=>{calls++;return .5;},isHuman:()=>false,officer:id=>({name:'General'+id}),ruler:id=>({name:'Ruler'+id})};return {g,b,u,v,reserve,calls:()=>calls};
}
const timed=items=>{for(const [speed]of MESSAGE_SPEEDS)for(const item of items)assert.equal(battleMessageDuration(item,{speed}),VISUAL_INTERVAL,item.text);};

for(const role of ['ruler','commander','general']){
 const {g,b,u,v}=fixture();v.soldiers=v.weapons=1;if(role==='ruler')b.rulers.defend=v.id;if(role==='commander')b.leaders.defend=v.id;
 act(g,'attack',{unit:u.id,target:v.id});assert(v.captured);const items=battleStatusMessages(b,0,id=>'General'+id,false,false),capture=items.filter(m=>m.text.includes('captured by'));assert.equal(capture.length,1);assert(capture[0].visualInterval);timed(capture);
}
console.log('PASS ruler, commander and general capture notices last 3 seconds at every Game Speed');
{
 const {g,b,u,v}=fixture();Object.assign(b,{challengeIssued:[],challengeWar:80,openingComplete:false});act(g,'challenge',{unit:u.id,target:v.id});const item=battleStatusMessages(b,0,id=>'General'+id,false,false)[0];assert.equal(item.personalCombat.stage,'challenge');assert.deepEqual(item.personalCombat.fighters.map(f=>f.side),['defend','attack']);timed([item]);
}
console.log('PASS legacy saved battles also display a three-second personal challenge card');
for(const success of [true,false]){
 const {g,b,u,v}=fixture();u.int=v.int=0;let draws=0;g.random=()=>{draws++;return success?.5:.999;};const before=v.soldiers;
 act(g,'fireball',{unit:u.id,q:v.q,r:v.r});const items=battleStatusMessages(b,0,id=>'General'+id,false,false);assert(items[0].text.includes(success?'success':'failed'));assert(items[0].visualInterval);timed(items.filter(m=>m.visualInterval));
 if(success){assert.equal(draws,3);assert.equal(v.soldiers,before-125);assert(items[1].text.includes('125 soldiers'));assert(items[1].visualInterval);}else{assert.equal(v.soldiers,before);assert.equal(items.length,1);assert.equal(draws,2);}
}
console.log('PASS fireball success/failure precedes loss impact; each waits 3 seconds without extra RNG');
{
 const {g,b,u,v,reserve}=fixture();const forest=ambushCells(u,{q:6,r:7}).find(p=>p.q!==v.q||p.r!==v.r);Object.assign(reserve,forest);b.terrain[reserve.r*13+reserve.q]=1;g.random=()=>0;
 act(g,'charge',{unit:u.id,target:v.id});const before=JSON.stringify(b),animations=ambushAnimations(b,b.lastAction,id=>'General'+id);assert(animations.length);assert(animations.every(a=>a.afterCharge));
 for(const [speed]of MESSAGE_SPEEDS)for(const a of animations){assert.equal(combatAnimationDuration(a,{speed}),speed);assert.equal(combatAnimationPhase(a,speed-1,{speed}).phase,'attack');assert.equal(combatAnimationPhase(a,speed,{speed}).phase,'return');assert.equal(combatAnimationPhase(a,speed-1,{speed}).cycle,8);}
 assert.equal(JSON.stringify(b),before);assert.equal(combatAnimationDuration({type:'ambush'}),3000);
}
console.log('PASS charge landing queues resolved ambushes with eight flashes over Game Speed');
{
 let now=0,at,callback,shown=[];const clock={now:()=>now,setTimeout:(fn,ms)=>{callback=fn;at=now+ms;return 1;},clearTimeout:()=>{callback=null;}},state={speed:500},player=createMessagePlayer({clock,duration:item=>battleMessageDuration(item,state),show:item=>shown.push(item.text)});
 for(const text of ['attempt','impact','capture'])player.enqueue({text,visualInterval:true});assert.equal(at,3000);now=1000;state.speed=3000;player.retime();assert.equal(at,3000);now=2000;player.pause();now=12000;player.resume();assert.equal(at,13000);now=at;callback();assert.deepEqual(shown,['attempt','impact']);assert.equal(at,16000);now=at;callback();assert.deepEqual(shown,['attempt','impact','capture']);assert.equal(at,19000);player.clear();assert(!callback);
}
console.log('PASS shared interval survives Game Speed changes, pause and sequential notices');
for(const action of ['attack','charge','simultaneous','ambush','fire','refusal']){
 const {g,b,u,v,reserve,calls}=fixture();
 if(action==='simultaneous')Object.assign(reserve,{side:'attack',q:5,r:6});
 if(action==='ambush'){Object.assign(v,{q:6,r:7});b.terrain[v.r*13+v.q]=1;act(g,'move',{unit:u.id,q:6,r:6});}
 else if(action==='fire'){b.fire[u.r*13+u.q]=3;act(g,'wait',{unit:u.id});}
 else if(action==='refusal'){b.challenge={challenger:u.id,target:v.id};act(g,'challengeResponse',{accept:false});}
 else act(g,action,{unit:u.id,target:v.id});
 const before=JSON.stringify(b),draws=calls(),items=battleStatusMessages(b,0,id=>'General'+id,false,false),losses=items.filter(m=>/enemy losses|own losses|men lost|soldiers to fire|ambushed|deserted/i.test(m.text));assert(losses.length,action);timed(losses);assert.equal(JSON.stringify(b),before);assert.equal(calls(),draws);
}
console.log('PASS real Normal/Charge/Simultaneous, ambush, post-order fire and refusal loss reports use visual interval');
{
 const {b}=fixture(),losses=['General0 lost 2 training.','General0: weapons losses 12.','General0: 0 men lost.'],ordinary=['Training is now 80.','General0 has 3000 men, 80 training and 2900 weapons.','General0 inspected for 100 gold.'];b.messages=[...losses,...ordinary].map((text,i)=>({serial:i+1,text}));
 const before=JSON.stringify(b),items=battleStatusMessages(b,0,id=>'General'+id,false,false);timed(items.slice(0,losses.length));assert.equal(JSON.stringify(b),before);
 for(const [speed]of MESSAGE_SPEEDS){for(const item of items.slice(losses.length))assert.equal(battleMessageDuration(item,{speed}),speed,item.text);let now=0,callback,at;const shown=[],clock={now:()=>now,setTimeout:(fn,ms)=>{callback=fn;at=now+ms;return 1;},clearTimeout:()=>{callback=null;}},player=createMessagePlayer({clock,duration:item=>battleMessageDuration(item,{speed}),show:item=>shown.push(item.text)});for(const item of items.slice(0,losses.length))player.enqueue(item);for(let i=0;i<losses.length;i++){assert.equal(at,(i+1)*VISUAL_INTERVAL);now=at-1;assert.equal(shown.length,i+1);now=at;callback();}assert(!player.busy);}
}
console.log('PASS men/training/weapons loss messages each last exactly 3 seconds; ordinary stat messages retain Game Speed');
