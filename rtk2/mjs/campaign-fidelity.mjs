import {zeroImpact,withImpact} from './event-impact.mjs?v=32';
import {FUTURE_OFFICERS} from './future-officers.mjs?v=32';
export const arrivalRecords=s=>FUTURE_OFFICERS[s.scenarioId??s.id]||[];
export function processArrivals(g,report){
 const s=g.s;s.arrivalsDone??=[];
 for(const record of arrivalRecords(s)){
  if(record.appearanceYear>s.year||s.arrivalsDone.includes(record.record))continue;
  let o=s.officers.find(x=>x.rosterId===record.rosterId);
  // An existing or deceased identity must never be duplicated or resurrected.
  if(o&&!o.pendingArrival){s.arrivalsDone.push(record.record);continue;}
  if(!o){o={...record,id:s.officers.length,owner:255,soldiers:0,weapons:0,training:0,acted:false,sick:false};s.officers.push(o);}
  else Object.assign(o,record,{pendingArrival:false});
  o.pendingArrival=false;s.arrivalsDone.push(record.record);
  const p=g.province(record.arrivalProvince);if(!p.unclaimed.includes(o.id))p.unclaimed.push(o.id);
  const impact=zeroImpact(),text=withImpact(`${o.name} arrived in ${p.name}.`,impact);
  report.events.push(text);report.details.push({kind:'month',title:'A new general arrives',text,province:p.id,officer:o.id,art:'council',impact});
 }
}
export function validateFidelity(s){
 if(s.nativeImportVersion!==undefined&&s.nativeImportVersion!==2)throw Error('Invalid native import version.');s.arrivalsDone??=[];const records=arrivalRecords(s);
 if(!Array.isArray(s.arrivalsDone)||new Set(s.arrivalsDone).size!==s.arrivalsDone.length||s.arrivalsDone.some(id=>!records.some(r=>r.record===id)))throw Error('Invalid future arrival ledger.');
 if(s.historyMode===undefined)s.historyMode='historic';if(!['historic','fiction'].includes(s.historyMode))throw Error('Invalid history mode.');
 for(const o of s.officers){for(const [k,max] of [['benevolence',100],['blood',65535]])if(o[k]!==undefined&&(!Number.isInteger(o[k])||o[k]<0||o[k]>max))throw Error('Invalid officer personality.');}
}
export const protectedService=(s,o,r)=>o.blood>0&&(o.blood&s.officers[r.leader].blood)!==0||s.year-(o.serviceSince??s.year)>=10;
export function chooseSuccessor(g,owner,id){
 const pending=(g.s.successorDecisions||[]).find(x=>x.owner===Number(owner));
 if(!pending||!pending.candidates.includes(Number(id)))throw Error('Choose an eligible successor.');
 const r=g.ruler(Number(owner)),next=g.officer(Number(id)),p=g.s.provinces.find(p=>p.owner===r.id&&p.officers.includes(next.id));
 if(!p||next.dead)throw Error('This successor no longer serves the realm.');
 if(pending.killer!==null&&pending.killer!==undefined){r.relations[pending.killer]=100;r.enemy=pending.killer;}
 r.leader=next.id;r.name=next.name;r.zh=next.zh;r.home=p.id;p.governor=next.id;if(r.advisor===next.id)r.advisor=null;
 g.s.successorDecisions=g.s.successorDecisions.filter(x=>x!==pending);g.normalize();g.record(`${next.name} was chosen to succeed ${pending.name}.${pending.killer!==null&&pending.killer!==undefined?' Hostility toward '+g.ruler(pending.killer).name+' is 100%.':''}`,'month',{nationwide:true});Object.assign(g.s.lastEvent,{art:pending.killer!==null&&pending.killer!==undefined?'heir':'death',nationwide:true});g.s.log[0].event={...g.s.lastEvent};return g.s.lastEvent.text;
}
export function validateSuccessors(s){
 s.successorDecisions??=[];
 if(!Array.isArray(s.successorDecisions)||s.successorDecisions.length>16||new Set(s.successorDecisions.map(x=>x.owner)).size!==s.successorDecisions.length)throw Error('Invalid succession choices.');
 for(const x of s.successorDecisions)if(!s.rulers.some(r=>r.id===x.owner)||!s.officers[x.old]?.dead||typeof x.name!=='string'||!Array.isArray(x.candidates)||!x.candidates.length||new Set(x.candidates).size!==x.candidates.length||x.candidates.some(id=>s.officers[id]?.owner!==x.owner||s.officers[id]?.dead))throw Error('Invalid successor candidates.');
}

export function provinceTerrain(p,base){const tiles=[...base];for(const i of p.forts||[])tiles[i]=5;return tiles;}
export function validateForts(s,terrains){for(const p of s.provinces){p.forts??=[];if(!Array.isArray(p.forts)||p.forts.length>156||new Set(p.forts).size!==p.forts.length||p.forts.some(i=>!Number.isInteger(i)||i<0||i>=156||terrains[p.id-1]&&![0,2].includes(terrains[p.id-1][i])))throw Error('Invalid constructed fort.');}}

// Native hostile-recruit gate at 0x12ee4–0x12f0e; free recruitment uses a separate branch.
export function recruitmentProtection(s,o,formerOwner=o.owner,requester=null){
 const r=s.rulers.find(r=>r.id===formerOwner);if(!r||formerOwner===255||o.id===r.leader||o.spyFor===requester)return null;
 const leader=s.officers[r.leader];if(o.blood>0&&leader&&(o.blood&leader.blood)!==0)return 'shared family allegiance';
 return o.loyalty===100?'absolute loyalty':null;
}
