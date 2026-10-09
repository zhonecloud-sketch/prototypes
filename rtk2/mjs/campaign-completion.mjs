import {endRealm} from './ruler-lifecycle.mjs?v=34';
import {invasionFoodPlan} from './war-provisions.mjs?v=34';
import {clamp} from './engine.mjs?v=34';
import {detachOfficer,realmRoute} from './campaign-decisions.mjs?v=34';
import {newUnit,placementCells,living,ownerFor} from './battle.mjs?v=34';
import {provinceDirection} from './geography.mjs?v=34';
import {hireCapacity} from './province-rules.mjs?v=34';
export const ITEMS=[
 {id:'mengde',name:"Meng De's new treatise",stat:'int',bonus:8},
 {id:'artofwar',name:"Sun Tzu's war manual",stat:'int',bonus:10},
 {id:'heavenbook',name:'Book of Heaven',stat:'int',bonus:5},
 {id:'luminous',name:'Luminous sword',stat:'war',bonus:8},
 {id:'trustsword',name:'Sword of Trust',stat:'war',bonus:8},
 {id:'sevenstars',name:'Seven Stars Sword',stat:'war',bonus:5},
 {id:'blackdragon',name:'Black Dragon Sword',stat:'war',bonus:10},
 {id:'furong',name:'Princess Fu Rong',stat:'charm',bonus:10},
 {id:'daqiao',name:'Princess Da Qiao',stat:'charm',bonus:5},
 {id:'xiaoqiao',name:'Princess Xiao Qiao',stat:'charm',bonus:5},
 {id:'chushi',name:'Princess Chu Shi',stat:'charm',bonus:10},
 {id:'gongyao',name:'Princess Gong Yao',stat:'charm',bonus:8},
 {id:'redhare',name:'The Red Hare',stat:'mobility',bonus:1},
 {id:'blacklightning',name:'Black Lightning',stat:'mobility',bonus:1},
 {id:'medical',name:"Hua Tuo's medical book",stat:'medical',bonus:1},
 {id:'seal',name:'Hereditary seal',stat:'trust',bonus:10}
];
export function queueSpoils(g,b){
 if(b.outcome.winner!=='attack')return;g.s.spoils??=[];
 let item=null;if(g.random()<.2){const found=new Set([...(g.s.items||[]).map(x=>x.item),...(g.s.spoils||[]).map(x=>x.item)]);const choices=ITEMS.filter(x=>!found.has(x.id));item=choices.length?choices[g.int(0,choices.length-1)].id:null;}
 g.s.spoils.push({owner:b.attacker,province:b.target,item});resolveAISpoils(g);
}
export function decideSpoils(g,mode,officer){
 const x=g.s.spoils?.[0];if(!x||!['protect','plunder'].includes(mode))throw Error('Choose Protect or Plunder.');const p=g.province(x.province),r=g.ruler(x.owner);
 if(x.item&&!p.officers.includes(Number(officer)))throw Error('Choose a serving general to receive the treasure.');
 let text='The victorious army protected the inhabitants.';
 if(mode==='plunder'){const gold=Math.min(500,Math.floor(p.population/1000),30000-p.gold),food=Math.min(20000,Math.floor(p.population/20),3000000-p.food);p.gold+=gold;p.food+=food;p.loyalty=clamp(p.loyalty-20);r.trust=clamp(r.trust-10);text=`The army plundered ${gold} gold and ${food} food. Popular loyalty fell by 20; trust fell by 10.`;}
 else{p.loyalty=clamp(p.loyalty+5);r.trust=clamp(r.trust+1);}
 if(x.item){const item=ITEMS.find(i=>i.id===x.item),o=g.officer(Number(officer));g.s.items??=[];g.s.items.push({item:item.id,officer:o.id});if(item.stat==='trust')r.trust=clamp(r.trust+item.bonus);else if(['war','int','charm'].includes(item.stat))o[item.stat]=clamp(o[item.stat]+item.bonus);else if(item.stat==='medical'){o.medicalBook=true;if(o.sick||o.injured)o.illMonths=1;}else o.hasHorse=true;text+=` ${o.name} received ${item.name}${item.stat==='mobility'?'; mounted mobility +1':`; ${item.stat.toUpperCase()} +${item.bonus}`} .`;}
 g.s.spoils.shift();return g.record(`Province ${p.id}: ${text}`,'war');
}
export function resolveAISpoils(g){while(g.s.spoils?.length&&!g.isHuman(g.s.spoils[0].owner)){const x=g.s.spoils[0],p=g.province(x.province);decideSpoils(g,g.officer(g.ruler(x.owner).leader).benevolence>=50?'protect':'plunder',p.governor);}}
export function configureDelegation(g,args){
 const p=g.owned(args.province),r=g.ruler();if(!p.officers.includes(r.leader))throw Error('Delegate from the ruler’s province.');const o=g.ready(p,r.leader),target=g.owned(args.target);if(target.id===p.id)throw Error('The ruler’s province remains under direct rule.');
 if(!['self','direct'].includes(args.mode))throw Error('Choose Self rule or Direct rule.');const policy=args.policy??'internal',supply=Number(args.supply||0),attack=Number(args.attack||0);
 if(args.mode==='self'){if(!['full','internal','military','personnel'].includes(policy))throw Error('Choose a delegation policy.');if(supply&&(supply===target.id||g.province(supply).owner!==r.id||!g.route(target.id,supply)))throw Error('Supply destination must have a friendly connected route.');if(attack&&(!target.neighbors.includes(attack)||[255,r.id].includes(g.province(attack).owner)||r.alliances.includes(g.province(attack).owner)))throw Error('Choose a connected hostile attack target.');target.delegate='domestic';target.delegation={policy,supply,attack};}
 else{target.delegate='manual';delete target.delegation;}o.acted=true;return g.record(`Province ${target.id}: ${args.mode==='direct'?'direct rule':policy+' authority'+(supply?'; supplies to #'+supply:'')+(attack?'; attack #'+attack:'')}.`);
}
export function runDelegated(g,owner){
 const saved=g.s.player;g.s.player=owner;try{for(const p of g.s.provinces.filter(p=>p.owner===owner&&p.delegation&&p.delegate!=='manual')){
 const d=p.delegation;let ready=p.officers.map(id=>g.officer(id)).filter(o=>{try{g.ready(p,o.id);return true;}catch{return false;}}).sort((a,b)=>b.int-a.int);
 if(d.attack&&['full','military'].includes(d.policy)&&g.province(d.attack).owner!==255&&g.province(d.attack).owner!==owner&&!g.ruler().alliances.includes(g.province(d.attack).owner)&&!g.s.wars.some(b=>[b.source,b.target].includes(p.id)||[b.source,b.target,...b.units.map(u=>u.origin)].includes(d.attack))){
  const army=ready.filter(o=>o.soldiers>0).sort((a,b)=>b.war-a.war).slice(0,Math.min(5,p.officers.length-1)),men=army.reduce((n,o)=>n+o.soldiers,0),enemy=g.province(d.attack).officers.reduce((n,id)=>n+g.officer(id).soldiers,0);
  const carried=invasionFoodPlan(men,p.food,g.rules.ai?.governance);if(army.length&&men>enemy*1.3&&carried!==null){g.invade({province:p.id,target:d.attack,officers:army.map(o=>o.id),food:carried,gold:Math.min(p.gold,1000)});if(g.s.battle||g.s.spoils.length||g.s.captiveDecisions.length)return false;}
 }
 if(d.supply&&ready.length&&g.province(d.supply).owner===owner&&g.route(p.id,d.supply)&&(p.gold>500||p.food>30000)){
  const dest=g.province(d.supply),o=ready.shift(),gold=Math.min(Math.max(0,p.gold-500),30000-dest.gold),food=Math.min(Math.max(0,p.food-30000),3000000-dest.food);if(gold||food){p.gold-=gold;p.food-=food;dest.gold+=gold;dest.food+=food;o.acted=true;g.record(`Province ${p.id}: delegated supplies ${gold} gold / ${food} food reached #${dest.id}.`);}
 }
 for(const o of ready){if(o.acted)continue;try{
  if(['full','personnel'].includes(d.policy)&&p.unclaimed.length&&p.gold>=100)g.applyMission('recruit',{province:p.id,officer:o.id,target:p.unclaimed[0]});
  else if(['full','personnel'].includes(d.policy)&&p.hidden.length)g.applyMission('search',{province:p.id,officer:o.id});
  else if(['full','military'].includes(d.policy)&&o.soldiers<3000&&hireCapacity(g,p)>0){const hundreds=Math.min(5,hireCapacity(g,p),Math.floor((10000-o.soldiers)/100)),alloc=Object.fromEntries(p.officers.map(id=>[id,g.officer(id).soldiers]));alloc[o.id]+=hundreds*100;g.applyMission('hireArmy',{province:p.id,officer:o.id,hundreds,allocations:alloc});}
  else if(['full','military'].includes(d.policy)&&o.soldiers&&o.training<90)g.applyMission('trainArmy',{province:p.id,officer:o.id});
  else if(['full','internal'].includes(d.policy)&&p.loyalty<75&&p.food>=3000)g.applyMission('relief',{province:p.id,officer:o.id,amount:3000});
  else if(['full','internal'].includes(d.policy)&&p.gold>=100&&(p.land<100||p.flood<100))g.applyMission(p.land<p.flood?'develop':'flood',{province:p.id,officer:o.id,amount:100});
 }catch{} }
 }}finally{g.s.player=saved;}return true;
}
export function surrenderRealm(g,target,envoy){
 const me=g.ruler(),old=target.id,refused=[];for(const p of g.s.provinces.filter(p=>p.owner===old)){
 p.owner=me.id;const ids=[...p.officers];p.officers=[];for(const id of ids){const o=g.officer(id),chance=id===target.leader?100:clamp(100-o.loyalty/2+(envoy.charm+me.trust)/4-(o.virtue??50)/5,10,95);
 if(g.random()*100<chance){o.owner=me.id;o.loyalty=clamp(o.loyalty,40,80);o.serviceSince=g.s.year;p.officers.push(id);}
 else{o.owner=255;p.unclaimed.push(id);p.population=Math.min(3000000,p.population+o.soldiers);o.soldiers=0;o.weapons=0;refused.push(o.name);}}
 p.governor=p.officers[0]??null;if(!p.officers.length)p.owner=255;
 }for(const r of g.s.rulers)r.alliances=r.alliances.filter(id=>id!==old);target.alliances=[];target.advisor=null;target.surrenderedTo=me.id;target.displacedLeaders??=[];g.officer(target.leader).formerRuler=old;g.s.jointPlans=g.s.jointPlans.filter(x=>![x.ally,x.ruler].includes(old));endRealm(g,target,`${target.name} surrendered to ${me.name}'s diplomatic threat.`);return `${target.name} submitted. ${refused.length?refused.join(', ')+' refused service and became free generals.':'Their followers joined your realm.'}`;
}
export function askJointConsent(g,me,ally,enemy){
 g.s.allyDecisions??=[];g.s.allyDecisions.push({kind:'joint',owner:ally.id,requester:me.id,province:enemy.id});return `${ally.name} is considering the joint invasion request.`;
}
export function supportCandidates(g,x){return g.province(x.province).neighbors.flatMap(id=>{const p=g.province(id);return p.owner===x.owner&&p.officers.length>1?p.officers.filter(id=>!g.officer(id).acted&&!g.officer(id).sick&&!g.officer(id).injured&&g.officer(id).soldiers&&!g.s.battle?.units.some(u=>u.id===id)&&!g.s.wars.some(b=>b.units.some(u=>u.id===id))).map(id=>({id,province:p.id})):[];});}
export function answerAlly(g,accept,args={}){
 const x=g.s.allyDecisions?.[0];if(!x)throw Error('No allied request is pending.');const ally=g.ruler(x.owner),requester=g.ruler(x.requester);if(typeof accept!=='boolean')throw Error('Accept or refuse this request.');
 if(!accept){ally.trust=clamp(ally.trust-5);requester.relations[ally.id]=clamp((requester.relations[ally.id]??50)+10);g.s.allyDecisions.shift();return g.record(`${ally.name} refused allied support; trust fell by 5.`,'diplomacy');}
 const ids=(args.officers||[]).map(Number),available=supportCandidates(g,x);if(!ids.length||ids.length>5||new Set(ids).size!==ids.length||ids.some(id=>!available.some(y=>y.id===id)))throw Error('Choose 1–5 available allied commanders.');
 const sources=[...new Set(ids.map(id=>available.find(y=>y.id===id).province))];if(sources.some(id=>g.province(id).officers.filter(id=>!ids.includes(id)&&!g.s.battle?.units.some(u=>u.id===id)).length<1))throw Error('Leave a governor in every contributing province.');
 const food=Number(args.food??0),gold=Number(args.gold??0),home=g.province(sources[0]);g.amount(food,home.food,0);g.amount(gold,home.gold,0);
 if(x.kind==='joint'){
  if(!g.ruler(x.requester).alliances.includes(x.owner)||g.province(x.province).owner===255||[x.requester,x.owner].includes(g.province(x.province).owner))throw Error('The joint invasion is no longer valid.');
  g.s.jointPlans=g.s.jointPlans.filter(p=>p.ruler!==x.requester||p.enemy!==x.province);g.s.jointPlans.push({ruler:x.requester,ally:x.owner,enemy:x.province,expires:g.s.year*12+g.s.month,officers:ids,food,gold,supplyProvince:home.id});
 }else{
  const b=g.s.battle;if(!b||b.target!==x.province||ownerFor(b,x.side)!==x.requester)throw Error('This battle is no longer awaiting support.');if(x.side==='attack'&&living(b).filter(u=>u.side===x.side&&u.allyOwner!==undefined&&!u.betrayed).length+ids.length>5)throw Error('The allied invading contingent has room for five units.');if(living(b).filter(u=>u.side===x.side).length+ids.length>10)throw Error('A battlefield side has room for ten units.');
  const additions=[];for(const id of ids){const origin=available.find(y=>y.id===id).province,entry=provinceDirection(g.province(b.target),g.province(origin)),spot=placementCells({...b,units:[...b.units,...additions]},x.side,null,entry)[0];if(!spot)throw Error('This approach has no vacant entry hex.');additions.push({...newUnit(g,id,x.side,origin),...spot,placed:true,allyOwner:x.owner,entryDirection:entry});}
  if(b.food[x.side]+food>3000000||b.gold[x.side]+gold>30000)throw Error('The field stores would overflow.');home.food-=food;home.gold-=gold;b.food[x.side]+=food;b.gold[x.side]+=gold;b.initialStores??={attack:{gold:b.gold.attack-(x.side==='attack'?gold:0),food:b.food.attack-(x.side==='attack'?food:0)},defend:{gold:b.gold.defend-(x.side==='defend'?gold:0),food:b.food.defend-(x.side==='defend'?food:0)}};b.initialStores[x.side].gold+=gold;b.initialStores[x.side].food+=food;b.contributions??=[];b.contributions.push({owner:x.owner,province:home.id,side:x.side,gold,food});b.units.push(...additions);for(const id of ids)g.officer(id).acted=true;
 }
 g.s.allyDecisions.shift();return g.record(`${ally.name} agreed to send ${ids.length} commanders with ${food} food and ${gold} gold.`,'diplomacy');
}
export function requestBattleAlly(g,allyId){
 const b=g.s.battle;if(!b||b.outcome||g.s.allyDecisions.length)throw Error('No battle can request help now.');const owner=ownerFor(b,b.side),ally=g.ruler(Number(allyId));if(!ally||!g.ruler(owner).alliances.includes(ally.id)||ally.alliances.includes(ownerFor(b,b.side==='attack'?'defend':'attack'))||b.supportAsked?.includes(ally.id))throw Error('Choose an available ally who is not allied to the opponent.');
 const x={kind:'battle',owner:ally.id,requester:owner,province:b.target,side:b.side,route:realmRoute(g,b.target,ally.home),index:0};if(!supportCandidates(g,x).length)throw Error('This ally has no ready adjacent reserves.');b.supportAsked??=[];b.supportAsked.push(ally.id);g.s.allyDecisions.push(x);return g.record(`A mounted messenger asks ${ally.name} for help at Province ${b.target}.`,'diplomacy');
}
export function aiAlly(g){const x=g.s.allyDecisions?.[0];if(!x||g.isHuman(x.owner))return false;if(x.route&&x.index<x.route.length-1){x.index++;return true;}const available=supportCandidates(g,x),ids=available.slice(0,Math.min(2,Math.max(0,10-(g.s.battle?living(g.s.battle).filter(u=>u.side===x.side).length:0)))).map(o=>o.id),p=available[0]&&g.province(available[0].province),food=invasionFoodPlan(ids.reduce((n,id)=>n+g.officer(id).soldiers,0),p?.food??0,g.rules.ai?.governance);try{answerAlly(g,ids.length>0&&food!==null&&g.random()*100<(g.ruler(x.owner).trust+50)/2,{officers:ids,food:food??0,gold:0});}catch{answerAlly(g,false);}return true;}
export function createCustomRuler(s,args){
 const p=s.provinces[Number(args.province)-1];if(!p||p.owner!==255)throw Error('Choose an empty starting province.');if(s.customOfficers?.length)throw Error('Only one custom ruler and follower can be created.');const id=Array.from({length:16},(_,i)=>i).find(id=>!s.rulers.some(r=>r.id===id));if(id===undefined)throw Error('No ruler slot is available.');
 const specs=[{name:args.name,age:Number(args.age??25),sex:args.sex??'male',int:Number(args.int??70),war:Number(args.war??70),charm:Number(args.charm??70)},{name:args.follower||'Companion',age:25,sex:'male',int:60,war:60,charm:60}];
 for(const spec of specs)if(typeof spec.name!=='string'||!spec.name.trim()||spec.name.trim().length>12||!Number.isInteger(spec.age)||spec.age<1||spec.age>99||!['male','female'].includes(spec.sex)||['int','war','charm'].some(k=>!Number.isInteger(spec[k])||spec[k]<1||spec[k]>100))throw Error('Use a name of 1–12 characters, age 1–99, and abilities 1–100.');if(specs[0].int+specs[0].war+specs[0].charm>250)throw Error('The ruler has 250 total ability points.');
 const ids=[];s.customOfficers=[];for(const spec of specs){const oid=s.officers.length,o={...spec,name:spec.name.trim(),id:oid,zh:spec.name.trim(),birth:s.year-spec.age+1,owner:id,loyalty:100,training:50,soldiers:1000,weapons:1000,acted:false,sick:false,compatibility:75,virtue:70,benevolence:70,ambition:50,blood:32768,serviceSince:s.year,custom:true};s.officers.push(o);s.customOfficers.push({...o});p.officers.push(oid);ids.push(oid);}
 p.owner=id;p.governor=ids[0];p.gold=Math.max(1000,p.gold);p.food=Math.max(20000,p.food);p.delegate='manual';const r={id,leader:ids[0],founder:ids[0],name:specs[0].name.trim(),zh:specs[0].name.trim(),home:p.id,trust:70,advisor:null,alliances:[],relations:Object.fromEntries(s.rulers.map(r=>[r.id,50])),custom:true};for(const other of s.rulers)other.relations[id]=50;s.rulers.push(r);return id;
}
export function conditionalHistory(g,report){
 const s=g.s;if(s.historyMode==='fiction')return;s.historyScripts??=[];const key=`${s.year}:taoqian`;
 if(s.year===194&&!s.historyScripts.includes(key)){
 const tao=s.rulers.find(r=>r.name==='Tao Qian'),liu=s.rulers.find(r=>r.name==='Liu Bei');if(!tao||!liu||!s.provinces.some(p=>p.owner===liu.id)||!s.provinces.some(p=>p.owner===tao.id)||s.wars.some(b=>[b.attacker,b.defender].includes(tao.id)))return;
 // The bequest requires Tao Qian and Liu Bei to still rule their own realms.
 const provinces=s.provinces.filter(p=>p.owner===tao.id);for(const p of provinces){p.owner=liu.id;for(const id of p.officers){g.officer(id).owner=liu.id;g.officer(id).serviceSince=s.year;}}
 s.historyScripts.push(key);tao.surrenderedTo=liu.id;tao.advisor=null;for(const r of s.rulers)r.alliances=r.alliances.filter(id=>id!==tao.id);tao.alliances=[];const text=`Tao Qian entrusted Provinces ${provinces.map(p=>p.id).join(', ')} to Liu Bei. Their surviving generals entered his service.`;report.events.push(text);report.details.push({kind:'history',title:'Tao Qian’s bequest',text,province:provinces[0].id,officer:liu.leader,art:'occupation'});
 }
}
export function validateCompletion(s){
 const owners=new Set(s.rulers.map(r=>r.id));s.spoils??=[];s.items??=[];s.allyDecisions??=[];s.provinceCompleted??=[];s.historyScripts??=[];
 if(!Array.isArray(s.spoils)||s.spoils.length>41||s.spoils.some(x=>!owners.has(x.owner)||s.provinces[x.province-1]?.owner!==x.owner||x.item!==null&&!ITEMS.some(i=>i.id===x.item)))throw Error('Invalid battle spoils.');
 if(!Array.isArray(s.items)||s.items.length>ITEMS.length||new Set(s.items.map(x=>x.item)).size!==s.items.length||s.items.some(x=>!ITEMS.some(i=>i.id===x.item)||!s.officers[x.officer]))throw Error('Invalid treasure inventory.');
 const treasures=[...s.items.map(x=>x.item),...s.spoils.filter(x=>x.item).map(x=>x.item)];if(new Set(treasures).size!==treasures.length)throw Error('Duplicate treasure reward.');
 if(!Array.isArray(s.allyDecisions)||s.allyDecisions.length>16)throw Error('Invalid allied decisions.');for(const x of s.allyDecisions){if(!owners.has(x.owner)||!owners.has(x.requester)||x.owner===x.requester||!s.provinces[x.province-1]||!['joint','battle'].includes(x.kind)||!s.rulers.find(r=>r.id===x.requester).alliances.includes(x.owner))throw Error('Invalid allied request.');if(x.kind==='battle'){if(!s.battle||s.battle.target!==x.province||ownerFor(s.battle,x.side)!==x.requester||!Array.isArray(x.route)||!Number.isInteger(x.index)||x.index<0||x.index>=x.route.length)throw Error('Invalid support messenger.');for(let i=0;i<x.route.length;i++)if(!s.provinces[x.route[i]-1]||i&&!s.provinces[x.route[i-1]-1].neighbors.includes(x.route[i]))throw Error('Invalid support route.');}}
 if(!Array.isArray(s.provinceCompleted)||new Set(s.provinceCompleted).size!==s.provinceCompleted.length||s.provinceCompleted.some(id=>!s.provinces[id-1]))throw Error('Invalid province turn completion.');
 if(!Array.isArray(s.historyScripts)||s.historyScripts.length>100||s.historyScripts.some(x=>typeof x!=='string'||x.length>80))throw Error('Invalid historical scripts.');
 for(const p of s.provinces)if(p.delegation){const d=p.delegation;if(!['full','internal','military','personnel'].includes(d.policy)||![d.supply,d.attack].every(id=>Number.isInteger(id)&&id>=0&&id<=41)||d.supply===p.id||d.attack&&!p.neighbors.includes(d.attack))throw Error('Invalid delegation targets.');}
 if(s.customOfficers){if(!Array.isArray(s.customOfficers)||s.customOfficers.length!==2||s.customOfficers.some(o=>!s.officers[o.id]?.custom||typeof o.name!=='string'||!o.name.trim()||o.name.length>12||!Number.isInteger(o.birth)||o.birth<90||o.birth>s.year||['int','war','charm'].some(k=>!Number.isInteger(o[k])||o[k]<1||o[k]>100)))throw Error('Invalid custom officers.');}
}
export function refundAlliedStores(g,b){
 const remaining={attack:{gold:b.gold.attack,food:b.food.attack},defend:{gold:b.gold.defend,food:b.food.defend}};
 for(const c of b.contributions||[]){const p=g.s.provinces.find(p=>p.owner===c.owner&&p.id===c.province)||g.s.provinces.find(p=>p.owner===c.owner);if(!p)continue;for(const k of ['gold','food']){const max=k==='gold'?30000:3000000,share=Math.min(b[k][c.side],Math.floor(remaining[c.side][k]*c[k]/Math.max(1,b.initialStores?.[c.side]?.[k]??remaining[c.side][k])),max-p[k]);p[k]+=share;b[k][c.side]-=share;}}
}
