import {replaceRemovedRuler} from './ruler-lifecycle.mjs?v=32';
import {recruitmentProtection} from './campaign-fidelity.mjs?v=32';
import {recordWarFate} from './event-chronicle.mjs?v=32';
import {retireRulerFamily} from './ruler-family.mjs?v=32';
import {clamp} from './engine.mjs?v=32';

export const captureChance=o=>clamp(90-(o.int+o.war)/3,10,90);
export function detachOfficer(g,id){for(const p of g.s.provinces)for(const key of ['officers','unclaimed','hidden'])p[key]=p[key].filter(x=>x!==id);for(const r of g.s.rulers)if(r.advisor===id)r.advisor=null;}
export function takeCaptive(g,id,owner,province,formerOwner,kind='battle',role='General'){
 const o=g.officer(id);detachOfficer(g,id);o.owner=255;o.prisonerOf=owner;o.acted=true;delete o.inTransit;
 g.province(province).unclaimed.push(id);g.s.captiveDecisions??=[];
 if(!g.s.captiveDecisions.some(c=>c.officer===id))g.s.captiveDecisions.push({officer:id,owner,province,formerOwner,kind,role});
}
export function decideCaptive(g,id,action){
 const c=g.s.captiveDecisions?.find(c=>c.officer===Number(id));if(!c)throw Error('This captive has already been decided.');
 if(!['recruit','free','behead'].includes(action))throw Error('Choose Recruit, Set free, or Behead.');
 const o=g.officer(c.officer),r=g.ruler(c.owner),p=g.province(c.province),isRuler=g.ruler(c.formerOwner)?.leader===o.id;
 if(action==='recruit'){
  if(c.recruitTried)throw Error('This captive has already refused recruitment.');c.recruitTried=true;
  const protection=isRuler?null:recruitmentProtection(g.s,o,c.formerOwner,c.owner),host=g.officer(p.governor??r.leader),chance=protection?0:clamp(host.charm/2+r.trust/3-o.loyalty/3+25,5,95);
  if(g.random()*100>=chance){g.record(`${o.name} refused recruitment. Decide whether to set them free or behead them.`,'prison',{battleOutcome:c.kind==='battle',warId:c.warId,province:c.province});return false;}
  detachOfficer(g,o.id);p.officers.push(o.id);o.owner=c.owner;o.loyalty=clamp(60-Math.floor(o.loyalty/3),20,60);o.serviceSince=g.s.year;replaceRemovedRuler(g,c.formerOwner,o.id,{reason:'entered another ruler’s service'});
 }else if(action==='behead'){
  detachOfficer(g,o.id);o.owner=255;o.soldiers=0;o.weapons=0;o.dead=true;o.deathYear=g.s.year;o.deathReason='execution';replaceRemovedRuler(g,c.formerOwner,o.id,{killer:c.owner,reason:'was beheaded'});r.trust=clamp(r.trust-5);
 }else{
  detachOfficer(g,o.id);o.owner=255;
  const home=g.s.provinces.find(q=>q.owner===c.formerOwner&&q.id!==c.province);
  if(isRuler&&home){home.officers.push(o.id);o.owner=c.formerOwner;home.governor=o.id;g.ruler(c.formerOwner).home=home.id;}
  else if(isRuler){g.s.roaming??=[];g.s.roaming=g.s.roaming.filter(x=>x.owner!==c.formerOwner);g.s.roaming.push({owner:c.formerOwner,province:p.id,officers:[o.id],gold:0,food:0});g.ruler(c.formerOwner).home=p.id;g.ruler(c.formerOwner).exiled=true;}
  else {const destination=p.neighbors.map(i=>g.province(i)).find(q=>q.owner===255)||p;destination.unclaimed.push(o.id);}
 }
 recordWarFate(g,c,action);delete o.prisonerOf;delete o.inTransit;g.s.captiveDecisions=g.s.captiveDecisions.filter(x=>x!==c);g.normalize();
 g.record(`${o.name}: ${action==='recruit'?'recruited with loyalty '+o.loyalty:action==='free'?'set free':'beheaded'}.`,'prison',{battleOutcome:c.kind==='battle',warId:c.warId,province:c.province});return true;
}
export function resolveAICaptives(g){for(const c of [...(g.s.captiveDecisions||[])])if(!g.isHuman(c.owner)){if(g.officer(c.officer).int+g.officer(c.officer).war>=90){if(!decideCaptive(g,c.officer,'recruit'))decideCaptive(g,c.officer,'free');}else decideCaptive(g,c.officer,'free');}}

export function realmRoute(g,from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const path=queue.shift(),last=path.at(-1);if(last===to)return path;for(const id of g.province(last).neighbors)if(!seen.has(id)){seen.add(id);queue.push([...path,id]);}}throw Error('No route connects these provinces.');}
function destination(g,type,args){if(type==='recruitMethod')return g.s.provinces.find(p=>p.officers.includes(Number(args.target))||p.unclaimed.includes(Number(args.target)))?.id;if(type==='transport')return g.province(args.target).id;if(type==='diplomaticMission')return g.ruler(Number(args.target)).home;if(args.mode==='rival')return g.ruler(Number(args.target)).home;if(args.mode==='infiltrate')return g.province(args.target).id;return g.s.provinces.find(p=>p.officers.includes(Number(args.target)))?.id;}
export function dispatchJourney(g,type,args){
 if(g.s.journey)throw Error('Finish the messenger journey first.');
 const before=g.s;g.s=JSON.parse(JSON.stringify(before));try{g.applyMission(type,args);}finally{g.s=before;}
 const from=Number(args.province),owner=g.s.player,to=destination(g,type,args),ids=[Number(args.officer),...(args.mode==='rival'?[Number(args.second)]:[])];
 const legs=ids.map((id,i)=>({officer:id,route:type==='transport'?g.route(from,to):realmRoute(g,from,i?g.ruler(Number(args.other)).home:to),index:0}));
 for(const id of ids){const o=g.officer(id);o.acted=true;o.inTransit=true;}
 const cargo={gold:0,food:0,horses:0};const source=g.province(from);if(type==='transport'){cargo.gold=Number(args.gold);cargo.food=Number(args.food);}else if(type==='diplomaticMission'&&args.mode==='gift'||type==='recruitMethod'&&args.method==='gold')cargo.gold=Number(args.amount);else if(type==='recruitMethod'&&args.method==='horse')cargo.horses=1;source.gold-=cargo.gold;source.food-=cargo.food;source.horses-=cargo.horses;
 g.s.journey={cargo,type,args:JSON.parse(JSON.stringify(args)),owner,source:from,legs,leg:0,phase:'outbound',interception:null,visited:[]};
 const purpose=type==='diplomaticMission'?({joint:'joint invasion proposal',marriage:'royal marriage proposal',alliance:'alliance proposal',gift:'diplomatic gift',threat:'surrender demand'}[args.mode]||'diplomatic mission'):type==='spyMission'?'spy mission':type==='transport'?'supply delivery':'recruitment mission';return g.record(`${ids.map(id=>g.officer(id).name).join(' and ')} rode from #${from} ${g.province(from).name} to ${legs.map(leg=>'#'+leg.route.at(-1)+' '+g.province(leg.route.at(-1)).name).join(' and ')} as messengers for ${purpose}.`,'diplomacy',{province:from});
}
function cancelJourney(g,text,province=g.s.journey?.source){const j=g.s.journey;for(const leg of j.legs){const o=g.officer(leg.officer);delete o.inTransit;o.acted=true;}g.s.journey=null;g.normalize();g.record(text,'prison',{province});}
export function interceptJourney(g,choice){
 const j=g.s.journey,c=j?.interception;if(!c)throw Error('No messenger is intercepted.');if(!['free','capture','behead'].includes(choice))throw Error('Choose Set free, Capture, or Behead.');
 const o=g.officer(c.officer);if(choice==='free'){j.interception=null;g.record(`${g.ruler(c.owner).name} allowed ${o.name} to continue.`,'diplomacy',{province:c.province});return;}
 if(j.phase==='outbound'&&j.cargo){const source=g.province(c.province);source.gold=Math.min(30000,source.gold+j.cargo.gold);source.food=Math.min(3000000,source.food+j.cargo.food);source.horses=Math.min(100,source.horses+j.cargo.horses);j.cargo={gold:0,food:0,horses:0};}
 takeCaptive(g,o.id,c.owner,c.province,j.owner,'messenger',o.id===g.ruler(j.owner).leader?'Ruler':'Messenger');
 if(choice==='behead')decideCaptive(g,o.id,'behead');cancelJourney(g,`${o.name} was ${choice==='behead'?'beheaded':'captured'} in Province ${c.province}. The mission was cancelled.`,c.province);resolveAICaptives(g);
}
export function advanceJourney(g){
 const j=g.s.journey;if(!j)return false;if(j.interception||j.proposal)return false;const leg=j.legs[j.leg];
 if(leg.index<leg.route.length-1){
  const from=leg.route[leg.index],to=leg.route[++leg.index],p=g.province(to),o=g.officer(leg.officer);g.journeyMotion={from,to,start:performance.now()};j.visited.push(to);if(j.type==='transport'&&j.phase==='outbound'&&j.cargo&&(j.cargo.gold||j.cargo.food)&&g.random()*100<clamp(12-(o.int+o.war)/25,2,12)){const fraction=.1+g.random()*.3,lostGold=Math.ceil(j.cargo.gold*fraction),lostFood=Math.ceil(j.cargo.food*fraction);j.cargo.gold-=lostGold;j.cargo.food-=lostFood;j.losses??={gold:0,food:0};j.losses.gold+=lostGold;j.losses.food+=lostFood;g.record(`Bandits attacked ${o.name}'s convoy: ${lostGold} gold and ${lostFood} food were stolen.`,'prison');}
  if(p.owner!==255&&p.owner!==j.owner&&!g.ruler(j.owner).alliances.includes(p.owner)){
   const hostility=g.ruler(p.owner).relations[j.owner]??50,risk=clamp(35+hostility/5-(o.int+o.war)/4,5,65);
   if(g.random()*100<risk){j.interception={owner:p.owner,province:to,officer:o.id};if(!g.isHuman(p.owner))interceptJourney(g,g.random()*100<(g.ruler(p.owner).trust+o.charm)/2?'free':'capture');}
  }return true;
 }
 if(j.leg<j.legs.length-1){j.leg++;return true;}
 if(j.phase==='outbound'){
  if(j.type==='diplomaticMission'&&['alliance','marriage','joint','threat','gift'].includes(j.args.mode)&&g.isHuman(Number(j.args.target))){
   j.proposal={owner:Number(j.args.target),mode:j.args.mode};g.record(`${g.ruler(j.owner).name}'s ${j.args.mode==='joint'?'joint invasion':j.args.mode==='marriage'?'royal marriage':j.args.mode} proposal arrived. ${g.ruler(j.proposal.owner).name} must respond.`,'diplomacy',{province:g.ruler(j.proposal.owner).home});return true;
  }
  return deliverJourney(g);
 }
 for(const leg of j.legs)delete g.officer(leg.officer).inTransit;g.s.journey=null;g.record(j.result||'The messenger returned.','diplomacy');return true;
}
function deliverJourney(g){
 const j=g.s.journey,leg=j.legs[j.leg];
 for(const leg of j.legs){const o=g.officer(leg.officer);o.acted=false;delete o.inTransit;}
  const player=g.s.player;g.s.player=j.owner;const source=g.province(j.source);if(j.cargo){for(const k of ['gold','food','horses'])source[k]+=j.cargo[k];if(j.type==='transport'){j.args.gold=j.cargo.gold;j.args.food=j.cargo.food;}j.cargo=null;}
  try{j.result=g.applyMission(j.type,j.args);j.delivered=true;}catch(e){j.result='Mission could not be completed: '+e.message;for(const leg of j.legs)g.officer(leg.officer).acted=true;}finally{g.s.player=player;}
  // An infiltrator stays at the destination after successfully entering service.
  if(j.type==='spyMission'&&j.args.mode==='infiltrate'&&g.officer(leg.officer).spyFor===j.owner){g.s.journey=null;return true;}
  j.phase='return';j.leg=0;for(const leg of j.legs){leg.route.reverse();leg.index=0;g.officer(leg.officer).inTransit=true;}return true;
}
export function answerProposal(g,accept){
 const j=g.s.journey;if(!j?.proposal||!g.isHuman(j.proposal.owner))throw Error('No human diplomatic audience is waiting.');if(typeof accept!=='boolean')throw Error('Accept or refuse the proposal.');
 g.missionAnswer=accept;try{delete j.proposal;return deliverJourney(g);}finally{delete g.missionAnswer;}
}
export function validateDecisions(s){
 s.captiveDecisions??=[];s.roaming??=[];s.journey??=null;const owners=new Set(s.rulers.map(r=>r.id)),ids=new Set();
 if(!Array.isArray(s.captiveDecisions)||s.captiveDecisions.length>255)throw Error('Invalid captive decisions.');
 for(const c of s.captiveDecisions){if(!s.officers[c.officer]||ids.has(c.officer)||!owners.has(c.owner)||!owners.has(c.formerOwner)||!s.provinces[c.province-1]||s.officers[c.officer].prisonerOf!==c.owner)throw Error('Invalid captive.');ids.add(c.officer);}
 if(!Array.isArray(s.roaming)||s.roaming.length>16||new Set(s.roaming.map(p=>p.owner)).size!==s.roaming.length)throw Error('Invalid roaming parties.');
 for(const p of s.roaming){if(!Number.isInteger(p.gold)||p.gold<0||p.gold>30000||!Number.isInteger(p.food)||p.food<0||p.food>3000000)throw Error('Invalid exile supplies.');if(!owners.has(p.owner)||!s.provinces[p.province-1]||!Array.isArray(p.officers)||!p.officers.includes(s.rulers.find(r=>r.id===p.owner).leader)||p.officers.some(id=>!s.officers[id]||s.officers[id].dead||ids.has(id)))throw Error('Invalid roaming party.');for(const id of p.officers){if(s.provinces.some(q=>['officers','unclaimed','hidden'].some(k=>q[k].includes(id))))throw Error('Roaming officer duplicated.');ids.add(id);}}
 if(s.journey){const j=s.journey;if(!owners.has(j.owner)||!['diplomaticMission','spyMission','transport','recruitMethod'].includes(j.type)||!Array.isArray(j.legs)||!j.legs.length||j.legs.length>2||!Number.isInteger(j.leg)||!j.legs[j.leg]||!['outbound','return'].includes(j.phase)||Number(j.args?.province)!==j.source||!s.provinces[j.source-1])throw Error('Invalid messenger journey.');
  if(j.legs.length!==(j.type==='spyMission'&&j.args.mode==='rival'?2:1)||new Set(j.legs.map(leg=>leg.officer)).size!==j.legs.length||j.legs[0].officer!==Number(j.args.officer)||j.legs.length===2&&j.legs[1].officer!==Number(j.args.second))throw Error('Invalid messenger assignments.');
  for(const leg of j.legs){if(!s.officers[leg.officer]||!Array.isArray(leg.route)||!leg.route.length||leg.route.length>41||!Number.isInteger(leg.index)||leg.index<0||leg.index>=leg.route.length)throw Error('Invalid messenger route.');for(let i=0;i<leg.route.length;i++){const p=s.provinces[leg.route[i]-1];if(!p||i&&!s.provinces[leg.route[i-1]-1].neighbors.includes(p.id))throw Error('Invalid messenger route edge.');}}
  if(j.proposal&&(!['alliance','marriage','joint','threat','gift'].includes(j.proposal.mode)||j.type!=='diplomaticMission'||j.proposal.mode!==j.args.mode||j.proposal.owner!==Number(j.args.target)||!s.humanRulers.includes(j.proposal.owner)||j.phase!=='outbound'||j.leg!==j.legs.length-1||j.legs.some(leg=>leg.index!==leg.route.length-1)||j.interception))throw Error('Invalid diplomatic audience.');
  if(j.cargo&&(['gold','food','horses'].some(k=>!Number.isInteger(j.cargo[k])||j.cargo[k]<0||j.cargo[k]>(k==='food'?3000000:k==='gold'?30000:100))))throw Error('Invalid messenger cargo.');
  if(j.interception&&(!owners.has(j.interception.owner)||j.interception.owner===j.owner||s.provinces[j.interception.province-1]?.owner!==j.interception.owner||j.interception.province!==j.legs[j.leg].route[j.legs[j.leg].index]||j.interception.officer!==j.legs[j.leg].officer))throw Error('Invalid interception.');
 }
}
