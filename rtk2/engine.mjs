import {runMonthlyEvents,incomeFactor} from './monthly-events.mjs';
export const SAVE_VERSION=1;
export const LIMITS={gold:30000,food:3000000,horses:100,soldiers:10000,weapons:10000};
export const clamp=(x,min=0,max=100)=>Math.max(min,Math.min(max,x));
export const DEFAULT_RULES={wagePerOfficer:3,troopFoodDivisor:3,januaryTaxDivisor:200,julyHarvestDivisor:5,populationGrowth:.002,floodChance:.12};
const clone=x=>JSON.parse(JSON.stringify(x));
export function createCampaign(scenario,player=0,difficulty=2){
 if(!scenario.rulers.some(r=>r.id===player&&scenario.provinces.some(p=>p.owner===player)))throw Error('Choose a ruler with a province.');
 const s=clone(scenario);return {...s,version:SAVE_VERSION,scenarioId:scenario.id,player,difficulty,selected:s.rulers.find(r=>r.id===player).home,seed:Date.now()>>>0,turn:1,log:[],books:[],settings:{quality:'balanced',names:'english'},lastReport:null};
}
export class Game{
 constructor(state,rules={}){this.s=state;this.rules={...DEFAULT_RULES,...rules};}
 province(id){const p=this.s.provinces.find(p=>p.id===Number(id));if(!p)throw Error('Province does not exist.');return p;}
 officer(id){const o=this.s.officers.find(o=>o.id===Number(id));if(!o)throw Error('Officer does not exist.');return o;}
 ruler(id=this.s.player){return this.s.rulers.find(r=>r.id===id);}
 random(){let t=this.s.seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);this.s.seed>>>=0;return ((t^t>>>14)>>>0)/4294967296;}
 int(min,max){return min+Math.floor(this.random()*(max-min+1));}
 owned(id){const p=this.province(id);if(p.owner!==this.s.player)throw Error('Issue orders from one of your own provinces.');return p;}
 ready(p,id){const o=this.officer(id);if(!p.officers.includes(o.id))throw Error('That officer is not serving here.');if(o.acted)throw Error('That officer has already acted this month.');if(o.sick||o.injured)throw Error('That officer is recovering from illness or injury.');return o;}
 amount(value,max,min=1){const n=Number(value);if(!Number.isSafeInteger(n)||n<min||n>max)throw Error(`Choose a whole number from ${min} to ${Math.max(min,max)}.`);return n;}
 spend(p,field,n){if(p[field]<n)throw Error(`Not enough ${field==='food'?'rice':field}.`);p[field]-=n;}
 record(text,type='order'){this.s.log.unshift({month:this.s.month,year:this.s.year,turn:this.s.turn,text,type});this.s.log=this.s.log.slice(0,160);return text;}
 development(p,o,amount,field){const value=p[field];if(value>=100)return 0;const v1=Math.floor(Math.sqrt(Math.floor((100-Math.floor(value/2))*amount/100)*(Math.floor(o.charm/2)+o.int)));const d=Math.floor((this.s.difficulty+1)/2);return Math.max(0,Math.floor(Math.sqrt(Math.floor(v1/d)))-d);}
 relief(p,o,amount){const leader=this.officer(this.ruler(p.owner).leader);return Math.floor(Math.floor(Math.sqrt(amount))*Math.floor((leader.charm+o.charm)/2)/((6+this.s.difficulty)*Math.floor(Math.sqrt(p.population/100))));}
 preview(type,pid,oid,amount=100){const p=this.province(pid),o=this.officer(oid);if(type==='develop'||type==='flood')return Math.min(100-p[type==='develop'?'land':'flood'],this.development(p,o,amount,type==='develop'?'land':'flood'));if(type==='relief')return Math.min(100-p.loyalty,this.relief(p,o,amount));if(type==='reward')return Math.min(100-o.loyalty,Math.floor(this.officer(p.governor).charm*amount/400));return 0;}
 route(source,target){const visited=new Set([source]);const q=[[source]];while(q.length){const path=q.shift();if(path.at(-1)===target)return path;for(const id of this.province(path.at(-1)).neighbors){if(!visited.has(id)&&this.province(id).owner===this.s.player){visited.add(id);q.push([...path,id]);}}}return null;}
 recruitChance(p,o,target){const compatibility=120-Math.floor(Math.abs(o.compatibility-target.compatibility)/2)-5;return clamp(Math.floor(compatibility*.45+o.charm*.3+this.ruler().trust*.2),10,95);}
 execute(type,args={}){
 const p=this.owned(args.province);let o,amount,text;const a=Number(args.officer);
 if(['develop','flood','relief','search','recruit','move','transport','diplomacy','enlist','train','fortify'].includes(type))o=this.ready(p,a);
 if(type==='develop'||type==='flood'){
  const field=type==='develop'?'land':'flood';if(p[field]===100)throw Error('This province is already fully developed.');amount=this.amount(args.amount,Math.min(100,p.gold));const before=p[field];const gain=this.development(p,o,amount,field);this.spend(p,'gold',amount);p[field]=clamp(before+gain);o.acted=true;text=`${o.name} ${type==='develop'?'cultivated the land':'reinforced the dikes'}. ${type==='develop'?'Land':'Flood protection'} ${before} → ${p[field]}.`;
 }else if(type==='relief'){
  if(p.loyalty===100)throw Error('The people already have full loyalty.');amount=this.amount(args.amount,Math.min(10000,p.food));const gain=this.relief(p,o,amount);const before=p.loyalty;this.spend(p,'food',amount);p.loyalty=clamp(before+gain);o.acted=true;text=`${o.name} distributed ${amount.toLocaleString()} rice. Loyalty ${before} → ${p.loyalty}.`;
 }else if(type==='reward'){
  if(!p.officers.includes(a))throw Error('Choose an officer serving here.');o=this.officer(a);if(o.id===this.ruler().leader)throw Error('The ruler cannot reward themselves.');if(o.loyalty===100)throw Error('This officer is already fully loyal.');amount=this.amount(args.amount,Math.min(p.gold,100));const before=o.loyalty;this.spend(p,'gold',amount);o.loyalty=clamp(before+Math.floor(this.officer(p.governor).charm*amount/400)+this.int(0,1));text=`${o.name} received ${amount} gold. Loyalty ${before} → ${o.loyalty}.`;
 }else if(type==='book'){
  if(!p.officers.includes(a))throw Error('Choose an officer serving here.');o=this.officer(a);const advisor=this.s.officers.find(x=>x.id===this.ruler().advisor);if(!advisor||!p.officers.includes(advisor.id))throw Error('Your adviser must be present.');if(o.int+1>=advisor.int)throw Error('Your adviser cannot improve this officer’s intelligence.');if(this.s.books.includes(a))throw Error('This officer has studied this month.');o.int++;this.s.books.push(a);text=`${o.name} studied with ${advisor.name}. Intelligence is now ${o.int}.`;
 }else if(type==='search'){
  const chance=Math.max(0,Math.floor(o.int/3)+Math.floor(o.charm/2)-this.int(0,20));o.acted=true;
  if(p.hidden.length&&this.random()*100<chance){const id=p.hidden.splice(this.int(0,p.hidden.length-1),1)[0];p.unclaimed.push(id);text=`${o.name} found ${this.officer(id).name}, who is now available for recruitment.`;}else text=`${o.name} searched ${p.name}. No new talent was found this month.`;
 }else if(type==='recruit'){
  const target=this.officer(args.target);if(!p.unclaimed.includes(target.id))throw Error('Choose an available unaffiliated officer.');if(p.gold<100)throw Error('Recruitment needs 100 gold.');const chance=this.recruitChance(p,o,target);this.spend(p,'gold',100);o.acted=true;
  if(this.random()*100<chance){p.unclaimed=p.unclaimed.filter(id=>id!==target.id);p.officers.push(target.id);target.owner=this.s.player;target.serviceSince=this.s.year;target.loyalty=clamp(100-Math.floor(Math.sqrt(Math.floor(target.loyalty/2)*Math.abs(target.compatibility-this.officer(this.ruler().leader).compatibility)))-this.int(0,5),40,100);target.acted=true;text=`${target.name} accepted ${o.name}’s invitation and joined your realm.`;}else text=`${target.name} declined the invitation. ${o.name} may try again next month.`;
 }else if(type==='trade'){
  if(!p.merchant)throw Error('No merchant is visiting this province.');const mode=args.mode;
  if(mode==='buy'){amount=this.amount(args.amount,Math.min(p.gold*p.ricePrice,LIMITS.food-p.food));const cost=Math.ceil(amount/p.ricePrice);this.spend(p,'gold',cost);p.food+=amount;text=`Bought ${amount.toLocaleString()} rice for ${cost} gold.`;}
  else if(mode==='sell'){amount=this.amount(args.amount,Math.min(p.food,(LIMITS.gold-p.gold)*p.ricePrice),1);const earned=Math.floor(amount/p.ricePrice);p.food-=amount;p.gold+=earned;text=`Sold ${amount.toLocaleString()} rice for ${earned} gold.`;}
  else if(mode==='horse'){amount=this.amount(args.amount,Math.min(Math.floor(p.gold/100),100-p.horses));this.spend(p,'gold',amount*100);p.horses+=amount;text=`Bought ${amount} ${amount===1?'horse':'horses'} for ${amount*100} gold.`;}
  else if(mode==='arms'){o=this.officer(a);if(!p.officers.includes(a))throw Error('Choose a serving officer.');amount=this.amount(args.amount,Math.min(p.gold,Math.floor((10000-o.weapons)/100)));this.spend(p,'gold',amount);o.weapons+=amount*100;text=`Purchased ${amount*100} weapons for ${o.name}.`;}
  else throw Error('Choose a trade.');
 }else if(type==='tax'){
  if(p.taxed)throw Error('An extra tax has already been collected this month.');if([7,8,9].includes(this.s.month))throw Error('Extra tax is unavailable during July, August, and September.');this.ready(p,p.governor);const factor=Math.max(7,Math.floor(Math.floor(Math.sqrt(p.population/100))/10))+this.ruler().trust+p.loyalty;const gold=Math.floor(factor*this.int(1,901)/200*incomeFactor(this.s,p)),food=Math.floor((this.int(0,45001)+5000)*factor/200*incomeFactor(this.s,p));p.gold=Math.min(30000,p.gold+gold);p.food=Math.min(3000000,p.food+food);p.loyalty=clamp(p.loyalty-10);this.ruler().trust=clamp(this.ruler().trust-5);p.taxed=true;this.officer(p.governor).acted=true;text=`Extra tax collected ${gold} gold and ${food.toLocaleString()} rice. People’s loyalty −10; ruler’s trust −5.`;
 }else if(type==='move'){
  const target=this.province(args.target);if(!p.neighbors.includes(target.id)||![255,this.s.player].includes(target.owner))throw Error('Move to an adjacent friendly or unclaimed province.');if(p.officers.length<2)throw Error('At least one officer must remain to govern this province.');const gold=this.amount(args.gold,p.gold,0),food=this.amount(args.food,p.food,0);if(target.gold+gold>30000||target.food+food>3000000)throw Error('The destination’s storage would overflow.');p.gold-=gold;p.food-=food;target.gold+=gold;target.food+=food;p.officers=p.officers.filter(id=>id!==o.id);target.officers.push(o.id);target.owner=this.s.player;o.acted=true;if(target.governor===null)target.governor=o.id;if(p.governor===o.id)p.governor=p.officers[0];if(o.id===this.ruler().leader)this.ruler().home=target.id;text=`${o.name} moved to ${target.name} with ${gold} gold and ${food.toLocaleString()} rice.`;
 }else if(type==='transport'){
  const target=this.owned(args.target);if(target.id===p.id)throw Error('Choose another province.');const path=this.route(p.id,target.id);if(!path)throw Error('A connected route through your provinces is required.');const gold=this.amount(args.gold,p.gold,0),food=this.amount(args.food,p.food,0);if(!gold&&!food)throw Error('Send some gold or rice.');if(target.gold+gold>30000||target.food+food>3000000)throw Error('The destination’s storage would overflow.');p.gold-=gold;p.food-=food;target.gold+=gold;target.food+=food;o.acted=true;text=`${o.name} delivered ${gold} gold and ${food.toLocaleString()} rice to ${target.name}.`;
 }else if(type==='governor'){
  o=this.officer(a);if(!p.officers.includes(a))throw Error('Choose a serving officer.');if(p.officers.includes(this.ruler().leader)&&a!==this.ruler().leader)throw Error('The ruler governs their own province.');p.governor=a;text=`${o.name} is now governor of ${p.name}.`;
 }else if(type==='advisor'){
  o=this.officer(a);if(!p.officers.includes(a)||o.id===this.ruler().leader||o.int<80)throw Error('An adviser needs at least 80 intelligence and must serve your realm.');this.ruler().advisor=a;text=`${o.name} was appointed adviser.`;
 }else if(type==='delegate'){
  if(!['manual','domestic','people'].includes(args.mode))throw Error('Choose a delegation policy.');p.delegate=args.mode;text=`${p.name}: ${args.mode==='manual'?'direct control':args.mode==='domestic'?'domestic development delegated':'people’s welfare delegated'}.`;
 }else if(type==='diplomacy'){
  const target=this.s.rulers.find(r=>r.id===Number(args.target));if(!target||target.id===this.s.player)throw Error('Choose another ruler.');const me=this.ruler();amount=this.amount(args.amount,Math.min(p.gold,500),10);this.spend(p,'gold',amount);o.acted=true;const before=me.relations[target.id]??100;const change=Math.floor(Math.sqrt(amount)*(o.charm/30));me.relations[target.id]=clamp(before-change);target.relations[me.id]=me.relations[target.id];text=`${o.name} sent ${amount} gold to ${target.name}. Hostility ${before} → ${me.relations[target.id]}.`;if(args.mode==='alliance'&&me.relations[target.id]<=30&&!me.alliances.includes(target.id)){me.alliances.push(target.id);target.alliances.push(me.id);text+=` An alliance was agreed.`;}else if(args.mode==='alliance'&&!me.alliances.includes(target.id))text+=' Relations must improve further before an alliance.';
 }else if(type==='enlist'){
  amount=this.amount(args.amount,Math.min(10000-o.soldiers,Math.floor(p.gold/10)*100,Math.floor(p.food/100)*100,Math.floor(p.population/20/100)*100),100);if(amount%100)throw Error('Enlist in groups of 100.');this.spend(p,'gold',amount/10);this.spend(p,'food',amount);p.population-=amount;o.soldiers+=amount;o.training=Math.max(0,o.training-10);o.acted=true;text=`${o.name} enlisted ${amount} soldiers. Monthly rice upkeep increases.`;
 }else if(type==='train'){
  if(!o.soldiers)throw Error('This officer has no soldiers.');if(o.training>=100)throw Error('These soldiers are fully trained.');o.training=clamp(o.training+Math.floor(o.war/10)+this.int(1,5));o.acted=true;text=`${o.name} trained the garrison. Training is now ${o.training}.`;
 }else if(type==='exile'){
  if(!p.officers.includes(a))throw Error('Choose a general serving in this province.');
  if(a===this.ruler().leader)throw Error('The ruler cannot be exiled.');
  if(p.officers.length<2)throw Error('At least one officer must remain to govern.');
  o=this.officer(a);p.officers=p.officers.filter(id=>id!==a);p.unclaimed.push(a);p.population=Math.min(3000000,p.population+o.soldiers);o.soldiers=0;o.weapons=0;o.owner=255;o.acted=true;
  if(p.governor===a)p.governor=p.officers[0];if(this.ruler().advisor===a)this.ruler().advisor=null;
  text=`${o.name} was dismissed from service and is now a free general in ${p.name}.`;
 }else if(type==='fortify'){
  if(p.castle>=100)throw Error('The castle is fully fortified.');amount=this.amount(args.amount,Math.min(p.gold,100));this.spend(p,'gold',amount);p.castle=clamp(p.castle+Math.floor(Math.sqrt(amount*o.int)/8));o.acted=true;text=`${o.name} repaired the walls. Fortification is now ${p.castle}.`;
 }else throw Error('That order is not available.');
 return this.record(`${p.name}: ${text}`);
 }
 endMonth(){
  const report={gold:0,food:0,events:[],month:this.s.month,year:this.s.year};
  // Delegation uses the same formulas and costs as player orders.
  for(const p of this.s.provinces.filter(p=>p.owner===this.s.player&&p.delegate!=='manual'))for(const id of p.officers){const o=this.officer(id);if(o.acted)continue;if(p.delegate==='people'&&p.loyalty<90&&p.food>5000){const spend=Math.min(3000,p.food);p.loyalty=clamp(p.loyalty+this.relief(p,o,spend));p.food-=spend;o.acted=true;}else if(p.gold>=100){const f=p.land<p.flood?'land':'flood';if(p[f]<95){p[f]=clamp(p[f]+this.development(p,o,100,f));p.gold-=100;o.acted=true;}}}
  this.s.month++;this.s.turn++;if(this.s.month>12){this.s.month=1;this.s.year++;}
  for(const p of this.s.provinces){p.taxed=false;if(p.owner===255)continue;const own=p.owner===this.s.player,r=this.ruler(p.owner);const soldiers=p.officers.reduce((n,id)=>n+this.officer(id).soldiers,0);const wages=p.officers.length*this.rules.wagePerOfficer+Math.floor(soldiers/200);const rice=Math.floor(soldiers/this.rules.troopFoodDivisor);const beforeGold=p.gold,beforeFood=p.food;p.gold=Math.max(0,p.gold-wages);p.food=Math.max(0,p.food-rice);
   if(this.s.month===1)p.gold=Math.min(30000,p.gold+Math.floor(p.population/this.rules.januaryTaxDivisor*(.5+p.loyalty/100)*incomeFactor(this.s,p)));
   if(this.s.month===7){const harvest=Math.floor(p.population/this.rules.julyHarvestDivisor*(.3+p.land/100)*incomeFactor(this.s,p));p.food=Math.min(3000000,p.food+harvest);if(own)report.events.push(`${p.name} harvested ${harvest.toLocaleString()} rice.`);}
   if(beforeGold<wages){for(const id of p.officers){const o=this.officer(id);if(o.id!==r?.leader)o.loyalty=clamp(o.loyalty-3);}if(own)report.events.push(`${p.name} cannot cover wages; officer loyalty fell.`);}
   if(beforeFood<rice){p.loyalty=clamp(p.loyalty-8);p.population=Math.floor(p.population*.99);for(const id of p.officers)this.officer(id).soldiers=Math.floor(this.officer(id).soldiers*.95);if(own)report.events.push(`Rice shortage in ${p.name}. Population and garrison declined.`);}

   p.population=Math.min(3000000,Math.floor(p.population*(1+this.rules.populationGrowth*(p.loyalty/100))));p.ricePrice=clamp(p.ricePrice+this.int(-2,2),15,120);p.merchant=this.random()<.8;
   // Peaceful rival development is a remaster addition, with no territorial attacks.
   if(this.s.version===1&&!own&&p.gold>=100&&p.officers.length){const o=this.officer(p.governor);const f=p.land<p.flood?'land':'flood';p[f]=clamp(p[f]+this.development(p,o,100,f));p.gold-=100;}
   if(own){report.gold+=p.gold-beforeGold;report.food+=p.food-beforeFood;}
  }
  for(const o of this.s.officers)o.acted=false;this.s.books=[];report.year=this.s.year;report.month=this.s.month;runMonthlyEvents(this,report);this.s.lastReport=report;this.record(`A new month begins. ${report.events.length?report.events.join(' '):'The realm is at peace.'}`,'month');return report;
 }
}
export function validateSave(raw,scenarios){
 if(!raw||raw.version!==SAVE_VERSION||!scenarios[raw.scenarioId])throw Error('This is not a compatible RTK2 save.');
 if(!Array.isArray(raw.provinces)||raw.provinces.length!==41||!Array.isArray(raw.officers)||raw.officers.length!==255||!Array.isArray(raw.rulers))throw Error('Save data is incomplete.');
 const template=scenarios[raw.scenarioId];const validOwners=new Set([...template.rulers.map(r=>r.id),...raw.rulers.map(r=>r.id),255]);
 if(!raw.rulers.some(r=>r.id===raw.player)||!Number.isInteger(raw.month)||raw.month<1||raw.month>12||!Number.isInteger(raw.year)||raw.year<189||raw.year>999||![1,2,3].includes(raw.difficulty))throw Error('Invalid campaign settings.');
 const seen=new Set();for(let i=0;i<41;i++){const p=raw.provinces[i];if(p.id!==i+1||!validOwners.has(p.owner))throw Error('Invalid province.');for(const [field,max] of Object.entries({gold:30000,food:3000000,population:3000000,land:100,loyalty:100,flood:100,castle:100,horses:100,ricePrice:120}))if(!Number.isSafeInteger(p[field])||p[field]<0||p[field]>max)throw Error('Invalid province resources.');if(p.ricePrice<1)throw Error('Invalid rice price.');for(const list of ['officers','unclaimed','hidden']){if(!Array.isArray(p[list]))throw Error('Invalid officer lists.');for(const id of p[list]){if(!Number.isInteger(id)||id<0||id>254||seen.has(id))throw Error('Duplicate or invalid officer.');seen.add(id);}}if(p.owner!==255&&(!p.officers.length||!p.officers.includes(p.governor)))throw Error('Invalid governor.');if(p.officers.some(id=>raw.officers[id]?.owner!==p.owner))throw Error('Officer ownership mismatch.');p.neighbors=template.provinces[i].neighbors;p.x=template.provinces[i].x;p.y=template.provinces[i].y;p.name=template.provinces[i].name;p.zh=template.provinces[i].zh;p.region=template.provinces[i].region;if(!['manual','domestic','people'].includes(p.delegate))p.delegate='manual';}
 for(let i=0;i<255;i++){const o=raw.officers[i];if(o.id!==i)throw Error('Invalid officer identity.');for(const f of ['int','war','charm','loyalty','training'])if(!Number.isInteger(o[f])||o[f]<0||o[f]>100)throw Error('Invalid officer attributes.');for(const f of ['soldiers','weapons'])if(!Number.isInteger(o[f])||o[f]<0||o[f]>10000)throw Error('Invalid garrison.');const t=template.officers[i];if(t.pendingArrival&&o.name==='Unnamed'&&!seen.has(i))Object.assign(o,clone(t));o.name=t.name;o.zh=t.zh;o.rosterId=t.rosterId;if(o.owner!==255&&o.serviceSince===undefined)o.serviceSince=t.serviceSince??raw.year;if(t.pendingArrival){o.appearanceYear=t.appearanceYear;o.arrivalProvince=t.arrivalProvince;o.pendingArrival=!seen.has(i)&&!o.dead;}else delete o.pendingArrival;}
 if(raw.rulers.length<template.rulers.length||raw.rulers.length>16||new Set(raw.rulers.map(r=>r.id)).size!==raw.rulers.length)throw Error('Invalid ruler list.');
 for(const r of raw.rulers){const t=template.rulers.find(t=>t.id===r.id),founded=Number.isInteger(r.founder)&&!!raw.officers[r.founder];if(!Number.isInteger(r.id)||r.id<0||r.id>15||!Number.isInteger(r.leader)||!raw.officers[r.leader]||(!t&&!founded)||(!founded&&r.leader!==t.leader&&!r.succession?.includes(t.leader))||(founded&&r.leader!==r.founder&&!r.succession?.includes(r.founder))||!Number.isInteger(r.trust)||r.trust<0||r.trust>100||!Array.isArray(r.alliances)||!r.relations||Object.values(r.relations).some(v=>!Number.isInteger(v)||v<0||v>100))throw Error('Invalid ruler data.');if(r.succession&&(!Array.isArray(r.succession)||r.succession.length>255||new Set(r.succession).size!==r.succession.length||r.succession.some(id=>!Number.isInteger(id)||!raw.officers[id]?.dead)))throw Error('Invalid ruler succession.');r.name=raw.officers[r.leader].name;r.zh=raw.officers[r.leader].zh;if(r.advisor!==null&&(!Number.isInteger(r.advisor)||raw.officers[r.advisor]?.owner!==r.id))throw Error('Invalid adviser.');}
 if(!Number.isInteger(raw.seed)||!Number.isInteger(raw.turn)||raw.turn<1||!raw.provinces.some(p=>p.id===raw.selected)||!Array.isArray(raw.books))throw Error('Invalid campaign state.');raw.log=Array.isArray(raw.log)?raw.log.filter(v=>typeof v.text==='string').slice(0,160):[];raw.settings={quality:['low','balanced','high'].includes(raw.settings?.quality)?raw.settings.quality:'balanced',names:raw.settings?.names==='chinese'?'chinese':'english'};return raw;
}
