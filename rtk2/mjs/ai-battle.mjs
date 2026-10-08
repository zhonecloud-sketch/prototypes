import {living,visibleUnit,neighbors,terrainCost,at,distance,weaponPower,direction,inside,WIND_CLOCKWISE,act,placementCells,jointAttackers,reinforcementOptions,reachable} from './battle.mjs?v=27';
import {provinceDirection} from './geography.mjs?v=27';
import {DEFAULT_AI} from './ai-parameters.mjs?v=27';
// Plan across the whole field, independent of today's mobility. Enemy contact
// ends a route, just as it does in reachable(); mountains, fire and occupied
// hexes cannot be crossed. This permits detours that initially increase distance.
export function planBattleRoute(b,u,enemies=living(b).filter(v=>v.side!==u.side&&v.placed&&visibleUnit(b,v,u.side)),goals=null){
 const start=u.r*13+u.q,occupied=new Set(living(b).filter(v=>v.placed&&v.id!==u.id).map(v=>v.r*13+v.q)),hostile=living(b).filter(v=>v.side!==u.side&&v.placed),contact=new Set(hostile.flatMap(v=>neighbors(v.q,v.r).map(p=>p.r*13+p.q))),costs=new Map([[start,0]]),paths=new Map([[start,[]]]),queue=[{q:u.q,r:u.r,cost:0}];
 while(queue.length){queue.sort((a,z)=>a.cost-z.cost||a.r*13+a.q-z.r*13-z.q);const n=queue.shift(),index=n.r*13+n.q;if(n.cost!==costs.get(index))continue;if(index!==start&&contact.has(index))continue;
  for(const next of neighbors(n.q,n.r)){const key=next.r*13+next.q,cost=n.cost+terrainCost(b.terrain[key]);if(!Number.isFinite(cost)||occupied.has(key)||b.fire[key]||cost>=(costs.get(key)??Infinity))continue;costs.set(key,cost);paths.set(key,[...paths.get(index),next]);queue.push({...next,cost});}
 }
 const best=goals=>goals.map(p=>({...p,cost:costs.get(p.r*13+p.q),path:paths.get(p.r*13+p.q)})).filter(p=>p.path?.length).sort((a,z)=>a.cost-z.cost||a.r*13+a.q-z.r*13-z.q)[0]||null;
 if(goals)return best(goals);
 if(u.side==='attack'){const palace=at(b,b.palace.q,b.palace.r),route=best(palace?neighbors(b.palace.q,b.palace.r):[b.palace]);if(route)return route;}
 return best(enemies.flatMap(v=>neighbors(v.q,v.r)));
}
// Separate objectives: invasion takes the palace; defence retains its garrison.
export function palaceGuard(b){const defenders=living(b).filter(u=>u.side==='defend'&&u.placed),occupant=at(b,b.palace.q,b.palace.r);return occupant?.side==='defend'?occupant:defenders.find(u=>u.id===b.leaders.defend)||defenders.sort((a,z)=>distance(a,b.palace)-distance(z,b.palace)||z.soldiers-a.soldiers)[0]||null;}
export function minimumStrikeLoss(b,u,target){const cover=[1,.72,.8,0,1.15,.6,.5][b.terrain[target.r*13+target.q]]??1,power=u.soldiers*(.4+u.war/100)*(.45+u.training/100)*(.4+u.morale/100)*weaponPower(u);return Math.min(target.soldiers,Math.max(30,Math.floor(power*.13*cover*.85)));}
export function aiAttackTarget(b,u,adjacent){return [...adjacent].sort((a,z)=>{
 const priority=v=>(v.id===b.leaders[v.side]&&minimumStrikeLoss(b,u,v)>=v.soldiers?100:0)+(u.side==='attack'&&distance(v,b.palace)===0?50:0)+(v.id===b.leaders[v.side]?10:0)+(b.terrain[v.r*13+v.q]===4?5:0);
 return priority(z)-priority(a)||a.soldiers-z.soldiers;
})[0];}
// Tactical policy uses only visible opponents and legal movement cells.
export const armyPower=u=>u.soldiers*(.4+u.war/100)*(.45+u.training/100)*(.4+u.morale/100)*weaponPower(u);
export function safeFireTarget(b,u,enemies){
 if(b.weather==='rain')return null;
 const friends=living(b).filter(v=>v.side===u.side&&v.placed),hazards=spot=>{
  const cells=[spot];if(b.wind&&b.windStrength)for(let n=1;n<=b.windStrength;n++){const next=direction(cells.at(-1).q,cells.at(-1).r,b.wind-1);if(!inside(next.q,next.r)||[3,4,9,99].includes(b.terrain[next.r*13+next.q]))break;cells.push(next);}
  if(b.wind&&b.windStrength>=2)for(const offset of [-1,1])cells.push(direction(spot.q,spot.r,WIND_CLOCKWISE[(WIND_CLOCKWISE.indexOf(b.wind-1)+offset+6)%6]));
  return cells;
 };
 const candidates=neighbors(u.q,u.r).filter(c=>inside(c.q,c.r)&&![3,4,9,99].includes(b.terrain[c.r*13+c.q])&&!b.fire[c.r*13+c.q]);
 return candidates.map(c=>{const cone=hazards(c);if(cone.some(x=>distance(x,b.palace)===0&&u.side==='defend'||friends.some(v=>distance(v,x)===0)))return null;const hits=enemies.filter(v=>cone.some(x=>distance(v,x)===0));let score=hits.reduce((n,v)=>n+v.soldiers,0);if(!hits.length&&enemies.some(v=>distance(v,c)<=2)&&distance(c,b.palace)<distance(u,b.palace))score=200;return {...c,score};}).filter(c=>c&&c.score>0).sort((a,z)=>z.score-a.score)[0]||null;
}
export function tacticalPosition(b,u,enemies,moves,weak,tuning=DEFAULT_AI.battle){
 if(!enemies.length)return null;
 const nearest=c=>Math.min(...enemies.map(v=>distance(c,v))),score=c=>{
  const tile=b.terrain[c.r*13+c.q];if(tile===4||b.fire[c.r*13+c.q])return -Infinity;
  const near=nearest(c);if(near>tuning.terrainSearchRadius)return -Infinity;
  const jungle=tile===1&&enemies.some(v=>distance(c,v)<=3),bank=neighbors(c.q,c.r).some(n=>inside(n.q,n.r)&&b.terrain[n.r*13+n.q]===4)&&enemies.some(v=>b.terrain[v.r*13+v.q]===4||distance(c,v)<=3);
  if(!jungle&&!bank)return -Infinity;
  // Do not send defenders away from the palace to seek remote cover.
  if(u.side==='defend'&&distance(c,b.palace)>distance(u,b.palace)+1)return -Infinity;
  return (jungle?tuning.jungleWeight:0)+(bank?tuning.riverBankWeight:0)+(tile===5?2:0)-Math.abs(near-2)*2-(weak&&near===1?5:0)-distance(u,c)*.2;
 };
 const current=score(u),best=moves.map(c=>({...c,score:score(c)})).sort((a,z)=>z.score-a.score)[0];
 if(best&&best.score>current+.5&&best.score>0)return best;
 // Attackers wait briefly for an ambush, then resume their objective to avoid indefinite camping.
 if(current>0&&(u.side==='defend'||b.day%tuning.ambushAdvanceEveryDays!==0))return {wait:true};return null;
}
export function aiBattle(game,intelligence=60){const b=game.s.battle,tuning=game.rules.ai?.battle??DEFAULT_AI.battle;if(b.challenge){const u=b.units.find(u=>u.id===b.challenge.challenger),v=b.units.find(u=>u.id===b.challenge.target);const guard=v.side==='defend'&&palaceGuard(b)?.id===v.id;return act(game,'challengeResponse',{accept:v.war>u.war+tuning.safeDuelWarMargin});}if(b.phase==='deployment'){const u=living(b).find(u=>u.side===b.side&&!u.placed);if(!u)return act(game,'deploy');const cells=placementCells(b,u.side,u).sort((a,z)=>distance(a,b.palace)-distance(z,b.palace));return act(game,'place',{unit:u.id,...cells[0]});}
 const units=living(b).filter(u=>u.side===b.side&&!u.ordered);if(!units.length)return act(game,'end');const u=units.sort((a,z)=>intelligence>=tuning.smartIntelligence?z.war-a.war:0)[0],enemies=living(b).filter(v=>v.side!==u.side&&v.placed&&visibleUnit(b,v,u.side)),adjacent=enemies.filter(v=>distance(u,v)===1),guard=u.side==='defend'&&palaceGuard(b)?.id===u.id,holding=guard&&distance(u,b.palace)===0;
 if(b.day===1&&intelligence>=tuning.expertIntelligence&&u.war>=b.challengeWar&&b.challengeIssued.length===0){const opponent=enemies.find(v=>guard?v.id===b.leaders.attack&&u.war>=v.war+tuning.safeDuelWarMargin:v.war<u.war-tuning.safeDuelWarMargin);if(opponent)return act(game,'challenge',{unit:u.id,target:opponent.id});}
 const ownPower=living(b).filter(v=>v.side===u.side).reduce((n,v)=>n+armyPower(v),0),enemyPower=enemies.reduce((n,v)=>n+armyPower(v),0),weak=ownPower<enemyPower*tuning.outnumberedPowerRatio;
 const fire=intelligence>=tuning.expertIntelligence&&u.int>=tuning.fireMinimumIntelligence&&(weak||holding&&adjacent.length>1)?safeFireTarget(b,u,enemies):null;
 if(fire&&!adjacent.some(v=>v.id===b.leaders[v.side]&&minimumStrikeLoss(b,u,v)>=v.soldiers))return act(game,'fireball',{unit:u.id,q:fire.q,r:fire.r});
 if(adjacent.length){const target=aiAttackTarget(b,u,adjacent);if(holding)return act(game,'attack',{unit:u.id,target:target.id});if(intelligence>=tuning.smartIntelligence&&jointAttackers(b,u,target).length>1)return act(game,'simultaneous',{unit:u.id,target:target.id});if(intelligence>=tuning.expertIntelligence&&!weak&&u.id!==b.leaders[u.side]&&u.soldiers>target.soldiers*tuning.chargeMenRatio)return act(game,'charge',{unit:u.id,target:target.id});return act(game,'attack',{unit:u.id,target:target.id});}
 const own=living(b).filter(v=>v.side===u.side).reduce((n,v)=>n+v.soldiers,0),hostile=enemies.reduce((n,v)=>n+v.soldiers,0);if(intelligence>=tuning.expertIntelligence&&own<hostile*tuning.reinforceMenRatio&&b.units.length<40&&living(b).filter(v=>v.side===u.side).length<10){const option=reinforcementOptions(game,u.side).filter(o=>placementCells(b,u.side,null,o.province===b.target?null:provinceDirection(game.province(b.target),game.province(o.province))).length).sort((a,z)=>z.soldiers-a.soldiers)[0];if(option&&placementCells(b,u.side).length)return act(game,'reinforce',{unit:u.id,...option,food:Math.min(option.food,tuning.reinforceFood,3000000-b.food[u.side])});}
 if(holding)return act(game,'wait',{unit:u.id});
 const moves=reachable(b,u);if(!guard&&intelligence<tuning.smartIntelligence&&moves.length)return act(game,'move',{unit:u.id,...moves[game.int(0,moves.length-1)]});
 if(!guard&&intelligence>=tuning.smartIntelligence&&(u.side==='defend'||weak)){const position=tacticalPosition(b,u,enemies,moves,weak,tuning);if(position?.wait)return act(game,'wait',{unit:u.id});if(position)return act(game,'move',{unit:u.id,...position});}
 const threats=u.side==='defend'?enemies.sort((a,z)=>distance(a,b.palace)-distance(z,b.palace)||(a.id===b.leaders.attack?-1:z.id===b.leaders.attack?1:0)):enemies;
 const route=guard?planBattleRoute(b,u,enemies,[b.palace]):u.side==='defend'?threats.map(v=>planBattleRoute(b,u,[v])).find(Boolean):planBattleRoute(b,u,enemies);if(route){let spent=0,last=null;for(const step of route.path){spent+=terrainCost(b.terrain[step.r*13+step.q]);if(spent>u.mobility)break;last=step;}const spot=last&&moves.find(p=>p.q===last.q&&p.r===last.r);if(spot)return act(game,'move',{unit:u.id,...spot});}return act(game,'wait',{unit:u.id});
}
