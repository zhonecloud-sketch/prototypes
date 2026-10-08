import {clamp} from './engine.mjs?v=20';
import {detachOfficer} from './campaign-decisions.mjs?v=20';
export const FIDELITY_ORDERS=new Set(['moveParty','appointRealm','demoteAdvisor','recruitMethod','spyControl','buildFort']);
const home=(g,p)=>{if(!p.officers.includes(g.ruler().leader))throw Error('Issue this order where your ruler is staying.');};
export function recruitMethodChance(g,p,envoy,target,method){
 const ability=method==='letter'?envoy.int:method==='horse'?envoy.war:envoy.charm,loyalty=target.owner===255?0:target.loyalty/2;
 return clamp(g.recruitChance(p,envoy,target)+(ability-envoy.charm)/3-(target.virtue??50)/10+(target.ambition??50)/20-loyalty-(g.s.difficulty-1)*5,5,95);
}
export function fidelityOrder(g,type,args){const old=JSON.parse(JSON.stringify(g.s));try{
 const p=g.owned(args.province),r=g.ruler();let text='';
 if(type==='buildFort'){const o=g.ready(p,args.officer),q=Number(args.q),row=Number(args.r),tile=row*13+q;if(!Number.isInteger(q)||!Number.isInteger(row)||q<0||q>=13||row<0||row>=12||![0,2].includes(g.terrains[p.id-1]?.[tile])||(p.forts||[]).includes(tile))throw Error('Build a fort on an unused plain or hill hex.');if(p.gold<100)throw Error('A fort costs 100 gold.');p.gold-=100;o.acted=true;p.forts??=[];p.forts.push(tile);text=`${o.name} built a fort at ${q+1},${row+1} in Province ${p.id}.`;
 }else if(type==='moveParty'){
  const dest=g.province(args.target),ids=(args.officers||[args.officer]).map(Number);
  if(!ids.length||new Set(ids).size!==ids.length||!p.neighbors.includes(dest.id)||![255,r.id].includes(dest.owner))throw Error('Choose generals and a connected friendly or empty province.');
  const men=ids.map(id=>g.ready(p,id)),remaining=p.officers.filter(id=>!ids.includes(id));
  if(!remaining.length&&args.abandon!==true)throw Error('Confirm abandoning this province.');
  const governor=ids.includes(p.governor)&&remaining.length?Number(args.governor):p.governor;
  if(remaining.length&&!remaining.includes(governor))throw Error('Choose the governor who will remain.');
  const gold=g.amount(args.gold,p.gold,0),food=g.amount(args.food,p.food,0);if(dest.gold+gold>30000||dest.food+food>3000000)throw Error('The destination storage would overflow.');
  p.gold-=gold;p.food-=food;dest.gold+=gold;dest.food+=food;p.officers=remaining;p.governor=remaining.length?governor:null;if(!remaining.length)p.owner=255;
  dest.owner=r.id;dest.officers.push(...ids);for(const o of men)o.acted=true;
  if(ids.includes(r.leader)){dest.governor=r.leader;r.home=dest.id;}else if(dest.governor===null)dest.governor=ids[0];
  text=`${men.map(o=>o.name).join(', ')} moved to Province ${dest.id} with ${gold} gold and ${food} food.${remaining.length?'':' Province '+p.id+' was abandoned.'}`;
 }else if(type==='appointRealm'){
  home(g,p);const dest=g.owned(args.target),o=g.officer(args.officer);
  if(!dest.officers.includes(o.id))throw Error('Choose a general serving in the target province.');
  if(args.role==='governor'){if(dest.officers.includes(r.leader)&&o.id!==r.leader)throw Error('The ruler governs their own province.');dest.governor=o.id;}
  else if(args.role==='advisor'){if(o.id===r.leader||o.int<80)throw Error('An advisor needs intelligence 80 or above.');r.advisor=o.id;}
  else throw Error('Choose Governor or Advisor.');text=`${o.name} was appointed ${args.role} in Province ${dest.id}.`;
 }else if(type==='demoteAdvisor'){
  home(g,p);if(r.advisor===null)throw Error('No advisor has been appointed.');text=`${g.officer(r.advisor).name} was demoted and remains in service.`;r.advisor=null;
 }else if(type==='recruitMethod'){
  const envoy=g.ready(p,args.officer),target=g.officer(args.target),dest=g.s.provinces.find(q=>q.unclaimed.includes(target.id)||q.officers.includes(target.id));
  if((g.s.wars||[]).some(b=>b.units.some(u=>u.id===target.id)))throw Error('This general is committed to an ongoing battle.');if(!dest||target.dead||target.prisonerOf!==undefined||target.owner===r.id||target.id===g.ruler(target.owner)?.leader)throw Error('Choose a free or hostile subordinate general.');
  const method=args.method;if(!['attention','horse','gold','letter'].includes(method))throw Error('Choose a recruitment method.');
  let gold=0;if(method==='gold')gold=g.amount(args.amount,p.gold,100);if(method==='horse'&&p.horses<1)throw Error('No horse is available.');
  const chance=recruitMethodChance(g,p,envoy,target,method);if(method==='horse')p.horses--;p.gold-=gold;envoy.acted=true;
  if(g.random()*100<clamp(chance+(method==='gold'?Math.floor(Math.sqrt(gold)/3):0),5,95)){
   detachOfficer(g,target.id);target.owner=r.id;target.loyalty=clamp(100-Math.floor(Math.sqrt(Math.max(0,target.loyalty/2)*Math.abs(target.compatibility-g.officer(r.leader).compatibility))),40,100);target.serviceSince=g.s.year;target.acted=true;p.officers.push(target.id);if(method==='horse')target.hasHorse=true;text=`${target.name} accepted ${envoy.name}'s ${method==='attention'?'special attention':method} invitation.`;
  }else text=`${target.name} refused ${envoy.name}'s invitation.`;
 }else if(type==='spyControl'){
  home(g,p);const o=g.officer(args.officer);if(o.spyFor!==r.id||o.dead||o.prisonerOf!==undefined)throw Error('Choose one of your deployed spies.');
  if(args.mode==='withdraw'){detachOfficer(g,o.id);o.owner=r.id;p.officers.push(o.id);o.acted=true;delete o.spyFor;delete o.betrayalFor;text=`${o.name} withdrew and returned to Province ${p.id}.`;}
  else if(args.mode==='verify'){const loc=g.s.provinces.find(q=>['officers','unclaimed','hidden'].some(k=>q[k].includes(o.id)));text=`${o.name}: Province ${loc?.id??'unknown'}, ${o.owner===255?'hidden as a free general':'serving '+g.ruler(o.owner)?.name}, loyalty ${o.loyalty}.`;}
  else throw Error('Choose Verify or Withdraw.');
 }
 g.normalize();return g.record(text);
 }catch(e){g.s=old;throw e;}}
