import {retireRulerFamily} from './ruler-family.mjs?v=32';
// Native succession prefers the most loyal officer sharing the deceased's blood mask.
export function successorCandidates(g,owner,old){
 const ids=g.s.provinces.filter(p=>p.owner===owner).flatMap(p=>p.officers).filter(id=>id!==old.id&&!g.officer(id).dead&&g.officer(id).prisonerOf===undefined);
 return [...new Set(ids)].sort((a,b)=>{const x=g.officer(a),z=g.officer(b),kin=o=>old.blood>0&&(o.blood&old.blood)!==0;return Number(kin(z))-Number(kin(x))||z.loyalty-x.loyalty||z.charm+z.int-x.charm-x.int||a-b;});
}
export function lifecycleEvent(g,title,text,art,context={},report=null){
 const e={kind:'month',title,text,art,nationwide:true,...context};
 if(report){report.events.push(text);report.details.push(e);}
 else{g.record(text,'month',{nationwide:true,...context});Object.assign(g.s.lastEvent,e);g.s.log[0].event={...e};}
 return e;
}
export function endRealm(g,r,reason,report=null){
 if(!r||r.extinct)return false;const name=r.name;r.extinct=true;r.extinctionReason=reason;r.advisor=null;
 retireRulerFamily(g.s,r);for(const other of g.s.rulers)other.alliances=other.alliances.filter(id=>id!==r.id);r.alliances=[];
 g.s.jointPlans=(g.s.jointPlans||[]).filter(x=>x.ruler!==r.id&&x.ally!==r.id);
 g.s.successorDecisions=(g.s.successorDecisions||[]).filter(x=>x.owner!==r.id);
 lifecycleEvent(g,'A clan has been destroyed',`${name}'s clan has been destroyed. ${reason}`,'clan',{realm:r.id,officer:r.leader},report);return true;
}
export function replaceRemovedRuler(g,owner,id,{killer=null,reason='died',report=null}={}){
 const r=g.ruler(owner),old=g.officer(id);if(!r||r.leader!==id)return false;
 const ids=successorCandidates(g,owner,old);retireRulerFamily(g.s,r);
 if(!ids.length){endRealm(g,r,`${old.name} ${reason}; no successor remained.`,report);return false;}
 if(old.dead){r.succession??=[];if(!r.succession.includes(id))r.succession.push(id);}
 else{r.displacedLeaders??=[];if(!r.displacedLeaders.includes(id))r.displacedLeaders.push(id);old.formerRuler=owner;old.formerRulers??=[];if(!old.formerRulers.includes(owner))old.formerRulers.push(owner);}
 const next=g.officer(ids[0]),p=g.s.provinces.find(p=>p.owner===owner&&p.officers.includes(next.id));r.leader=next.id;r.name=next.name;r.zh=next.zh;r.home=p.id;p.governor=next.id;if(r.advisor===next.id)r.advisor=null;
 if(killer!==null&&g.ruler(killer)&&killer!==owner){r.relations[killer]=100;r.enemy=killer;}
 if(g.isHuman?.(owner)){g.s.successorDecisions??=[];if(!g.s.successorDecisions.some(x=>x.owner===owner))g.s.successorDecisions.push({owner,old:id,name:old.name,candidates:ids,killer,reason});}
 const vengeance=killer!==null&&g.ruler(killer)&&killer!==owner;
 lifecycleEvent(g,vengeance?'An heir vows vengeance':'A new ruler',`${old.name} ${reason}. ${next.name} succeeded as ruler.${vengeance?` Hostility toward ${g.ruler(killer).name}, responsible for ${old.name}'s death, is 100%.`:''}${g.isHuman?.(owner)?' Choose the next ruler at the succession council.':''}`,vengeance?'heir':'death',{realm:owner,officer:next.id,killer,province:p.id},report);return true;
}
export function checkRealmDestruction(g){
 for(const r of g.s.rulers){if(r.extinct||!r.realmWasActive)continue;
  if(g.s.provinces.some(p=>p.owner===r.id)||(g.s.roaming||[]).some(p=>p.owner===r.id)||g.s.captiveDecisions.some(c=>c.formerOwner===r.id&&c.officer===r.leader))continue;
  endRealm(g,r,r.surrenderedTo!==undefined?`${r.name} surrendered their realm.`:'The realm has no remaining province or roaming ruler.');
 }
}
