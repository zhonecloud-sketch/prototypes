import {hireCapacity} from './province-rules.mjs?v=44';
import {invasionFoodPlan} from './war-provisions.mjs?v=44';
import {forkAI,observationSeed,weighted,applyAIOrder} from './ai-simulation.mjs?v=44';
const power=o=>o.soldiers*(.35+.35*o.training/100+.3*Math.min(1,o.weapons/Math.max(1,o.soldiers)))*(.5+o.war/100);
const army=(g,p)=>p.officers.reduce((n,id)=>n+power(g.officer(id)),0);
export function governanceFeatures(g,owner=g.s.player){
 const own=g.s.provinces.filter(p=>p.owner===owner),f={territory:own.length,officers:0,army:0,land:0,flood:0,loyalty:0,gold:0,food:0,safety:0};
 for(const p of own){const officers=p.officers.map(id=>g.officer(id)),men=officers.reduce((n,o)=>n+o.soldiers,0),threat=Math.max(0,...p.neighbors.map(id=>g.province(id)).filter(q=>q.owner!==255&&q.owner!==owner&&!g.ruler(owner).alliances.includes(q.owner)).map(q=>army(g,q)));
  f.officers+=officers.length;f.army+=officers.reduce((n,o)=>n+power(o)/10000,0);f.land+=p.land/100*Math.sqrt(p.population/100000);f.flood+=p.flood/100;f.loyalty+=p.loyalty/100+officers.reduce((n,o)=>n+o.loyalty/500,0);f.gold+=Math.log1p(p.gold)/Math.log(30001);f.food+=Math.min(1,p.food/Math.max(10000,men*3));f.safety+=threat?Math.min(1,army(g,p)/(threat*1.2)):1;
 }return f;
}
export function governanceCandidates(g,weights){
 const candidates=[],owner=g.s.player,add=(action,args,hint)=>candidates.push({domain:'governance',action,args,hint});
 for(const p of g.s.provinces.filter(p=>p.owner===owner&&!g.s.provinceCompleted.includes(p.id)&&(!p.delegation||p.delegate==='manual'))){const ready=p.officers.map(id=>g.officer(id)).filter(o=>{try{g.ready(p,o.id);return true;}catch{return false;}}),men=p.officers.reduce((n,id)=>n+g.officer(id).soldiers,0),border=p.neighbors.some(id=>{const q=g.province(id);return q.owner!==255&&q.owner!==owner&&!g.ruler().alliances.includes(q.owner);});
  for(const o of ready){const args={province:p.id,officer:o.id};
   for(const action of ['develop','flood']){const field=action==='develop'?'land':'flood',amount=Math.min(100,Math.max(0,p.gold-100));if(p[field]<100&&amount>=10)add(action,{...args,amount},weights[field]*g.preview(action,p.id,o.id,amount)/100);}
   if(p.loyalty<95&&p.food>Math.max(5000,men*2)){const amount=Math.min(3000,p.food-Math.max(5000,men*2));add('relief',{...args,amount},weights.loyalty*g.preview('relief',p.id,o.id,amount)/100);}
   if(men&&p.officers.some(id=>g.officer(id).training<100))add('trainArmy',args,weights.army*men/10000*(100-o.training)/100*(.2+o.war/100)*(border?2:1));
   if(o.war>=45&&o.soldiers<7000&&p.food>men*2+10000){const hundreds=Math.min(10,Math.floor((7000-o.soldiers)/100),hireCapacity(g,p),Math.floor(Math.max(0,p.gold-100)/10),Math.floor((p.food-men*2-10000)/100));if(hundreds>0){const allocations=Object.fromEntries(p.officers.map(id=>[id,g.officer(id).soldiers]));allocations[o.id]+=hundreds*100;add('hireArmy',{...args,hundreds,allocations},weights.army*hundreds/100*(.5+o.war/100)*(border?2:1));}}
   if(p.merchant){const need=Math.max(10000,men*3)-p.food,buy=Math.min(10000,need,Math.max(0,p.gold-100)*p.ricePrice-1,3000000-p.food);if(buy>0)add('trade',{...args,mode:'buy',amount:buy},weights.food*buy/Math.max(10000,men*3));const target=p.officers.map(id=>g.officer(id)).sort((a,b)=>power(b)-power(a))[0],lots=target&&Math.min(Math.max(0,p.gold-100),Math.ceil(Math.max(0,target.soldiers-target.weapons)/100),Math.floor((10000-target.weapons)/100));if(lots>0)add('trade',{...args,mode:'arms',recipient:target.id,amount:lots},weights.army*lots/100*(border?2:1));}
   if(p.gold>=200)for(const id of [...p.unclaimed].sort((a,b)=>g.officer(b).war+g.officer(b).int-g.officer(a).war-g.officer(a).int).slice(0,2))add('recruit',{...args,target:id},weights.officers*g.recruitChance(p,o,g.officer(id))/100);
   if(p.officers.length>1&&o.id!==p.governor)for(const id of p.neighbors.filter(id=>g.province(id).owner===255))add('move',{...args,target:id,gold:Math.min(200,p.gold),food:Math.min(5000,p.food)},weights.territory);
  }
  if(ready.some(o=>o.id===p.governor))for(const o of p.officers.map(id=>g.officer(id)).filter(o=>o.id!==g.ruler().leader&&o.loyalty<95)){const amount=Math.min(100,Math.max(0,p.gold-100));if(amount>0)add('rewardGold',{province:p.id,officer:o.id,amount},weights.loyalty*(100-o.loyalty)/100);}
  const invaders=ready.filter(o=>o.soldiers>0).sort((a,b)=>power(b)-power(a)).slice(0,Math.min(5,p.officers.length-1)),strength=invaders.reduce((n,o)=>n+power(o),0),food=invasionFoodPlan(invaders.reduce((n,o)=>n+o.soldiers,0),p.food,g.rules.ai.governance);
  if(g.aiFor().aggression>0&&invaders.length&&food!==null)for(const target of p.neighbors.map(id=>g.province(id)).filter(q=>q.owner!==255&&q.owner!==owner&&!g.ruler().alliances.includes(q.owner)&&!g.s.wars.some(b=>[b.source,b.target].includes(q.id)))){const enemy=army(g,target);if(strength>enemy*(1.8-g.aiFor().aggression/200))add('attack',{province:p.id,target:target.id,officers:invaders.map(o=>o.id),food},weights.territory*(strength/Math.max(1,enemy)-1));}
 }return candidates.sort((a,b)=>b.hint-a.hint);
}
export function planGovernance(g,profile){
 if(g.s.battle||g.s.journey||g.s.triumph||g.s.successorDecisions.length||g.s.allyDecisions.length||g.s.spoils.length)return null;
 const weights=profile.weights,before=weighted(governanceFeatures(g),weights),seed=observationSeed({month:g.s.month,year:g.s.year,owner:g.s.player,provinces:g.s.provinces.map(p=>[p.owner,p.gold,p.food,p.land,p.flood,p.loyalty,p.officers.map(id=>{const o=g.officer(id);return [id,o.acted,o.int,o.war,o.charm,o.loyalty,o.soldiers,o.training,o.weapons];})])}),ranked=[];
 for(const order of governanceCandidates(g,weights).slice(0,10)){let score=0,valid=true;for(let sample=0;sample<2;sample++){const sim=forkAI(g,seed+sample*104729);try{applyAIOrder(sim,order);let value=weighted(governanceFeatures(sim,g.s.player),weights);if(!sim.s.battle&&!sim.s.journey){for(const next of governanceCandidates(sim,weights).slice(0,3)){const future=forkAI(sim);try{applyAIOrder(future,next);value=Math.max(value,.6*weighted(governanceFeatures(sim,g.s.player),weights)+.4*weighted(governanceFeatures(future,g.s.player),weights));}catch{}}}score+=value-before;}catch{valid=false;break;}}if(valid)ranked.push({...order,score:score/2});}
 ranked.sort((a,b)=>b.score-a.score);return ranked.length?{domain:'governance',order:ranked[0],alternatives:ranked.slice(0,3),reason:'Two-order lookahead across owned provinces; expected benefit after costs.'}:null;
}
