import {COMBAT_DIVISORS} from './native-combat.mjs?v=56';
import {tilePoint,neighbors,TERRAIN} from './battle.mjs?v=56';
export const activeBattleUnit=(battle,unit)=>battle?.phase==='battle'&&!battle.outcome&&!battle.suspended&&battle.selected===unit.id&&unit.side===battle.side&&unit.placed&&!unit.ordered&&!unit.fled&&!unit.routed&&unit.soldiers>0;
// Native 0x250F8 alternates eight source/target flashes per exchange.
export const combatAnimationCycles=action=>8*(action?.type==='charge'?Math.max(1,Math.min(10,action.exchanges??10)):1);
export const combatAnimationCycleMs=action=>action?.type==='charge'?75:375;
const combatAttackMs=action=>combatAnimationCycleMs(action)*combatAnimationCycles(action);
export const combatAnimationDuration=action=>combatAttackMs(action)+(action?.type==='charge'?1300:action?.delay||0);
export function combatAnimationPhase(action,elapsed){
 const delay=action.type==='charge'?650:action.delay||0,attack=combatAttackMs(action),step=combatAnimationCycleMs(action),time=Math.max(0,Math.min(attack-1,elapsed-delay));
 return {phase:elapsed<delay?'march':elapsed<delay+attack?'attack':'return',cycle:Math.floor(time/step)+1,frame:Math.floor(time/(step/2))%2};
}
export function chargePosition(action,unit,elapsed){
 const from=action.combatUnits.find(u=>u.id===action.unit),target=action.combatUnits.find(u=>u.id===action.target),end=action.landing||from;
 if(unit.id!==action.unit)return {...tilePoint(unit.q,unit.r),walk:false};
 const attackEnd=650+combatAttackMs(action),a=elapsed<650?from:target,z=elapsed<650?target:end,t=Math.min(1,Math.max(0,elapsed<650?elapsed/650:(elapsed-attackEnd)/650));
 const start=tilePoint(a.q,a.r),finish=tilePoint(z.q,z.r);return {x:start.x+(finish.x-start.x)*t,z:start.z+(finish.z-start.z)*t,walk:elapsed<650||elapsed>=attackEnd&&(a.q!==z.q||a.r!==z.r)};
}
// The rule layer already records every ambush. Read those resolved events once;
// playback never rolls randomness, spends an order or applies another casualty.
// The native simultaneous handler flashes immediately before each actual strike.
export function combatAnimations(action){
 if(!['attack','charge','simultaneous'].includes(action?.type)||!action.combatUnits?.length)return [];
 if(action.type!=='simultaneous')return [action];
 const target=action.combatUnits.find(u=>u.id===action.target),attackers=action.combatUnits.filter(u=>u.id!==action.target);
 if(!target)return [action];
 return attackers.slice(0,action.exchanges??attackers.length).map(unit=>({...action,unit:unit.id,exchanges:1,combatUnits:[unit,target]}));
}
export function ambushAnimations(battle,action,officerName){
 if(!action?.messageSerial)return [];
 return (battle.messages||[]).filter(m=>m.serial>=action.messageSerial).flatMap(m=>{
  if(m.ambush)return [{type:'ambush',...m.ambush}];
  const unit=battle.units.find(u=>m.text.startsWith(officerName(u.id)+' ambushed '));
  return unit?[{type:'ambush',unit:unit.id,combatUnits:[{id:unit.id,q:unit.q,r:unit.r,side:unit.side,soldiers:unit.soldiers}]}]:[];
 });
}
export function battleOrderUnavailable(battle,unit,order){
 if(order==='view')return null;
 if(!unit)return 'Choose one of your units first.';
 if(unit.ordered)return 'This unit has already received its order today.';
 if(order==='fireball'&&battle.weather==='rain')return 'Fire attacks are impossible in rain.';
 return null;
}

export function battleStatusMessages(battle,serial,officerName,human,announceTurns=true){
 const turn=id=>({text:`${officerName(id)}’s turn`}),messages=[];
 const action=battle.lastAction;
 if(announceTurns&&action?.messageSerial>serial&&action.type!=='place')messages.push(turn(action.turnUnit??action.unit));
 const fresh=(battle.messages||[]).filter(m=>m.serial>serial),jointSummary=action?.type==='simultaneous'&&action.messageSerial>serial&&action.lossRows?.length&&fresh.some(m=>m.serial>=action.messageSerial&&m.text.includes('initiated a simultaneous attack'));
 if(jointSummary){
  const total=side=>action.lossRows.filter(row=>row.side===side).reduce((n,row)=>n+row.loss,0);
  messages.push({text:`Simultaneous attack: Attacker lost ${total('attack').toLocaleString()} men; Defender lost ${total('defend').toLocaleString()} men.`});
  for(const row of action.lossRows)messages.push({text:`${officerName(row.unit)}: ${row.loss.toLocaleString()} men lost (${row.side==='attack'?'attacker':'defender'}).`});
 }
 for(const m of fresh){if(announceTurns&&m.turnUnit!==undefined)messages.push(turn(m.turnUnit));if(jointSummary&&m.serial>=action.messageSerial&&m.text.includes('initiated a simultaneous attack'))continue;messages.push({text:m.text});}
 const u=battle.units.find(u=>u.id===battle.selected&&u.side===battle.side&&u.placed&&!u.ordered&&!u.fled&&!u.routed&&u.soldiers>0);
 if(announceTurns&&human&&u&&battle.phase==='battle'&&!battle.outcome&&!battle.suspended&&messages.at(-1)?.text===`${battle.side==='attack'?'Attacker':'Defender'}’s turn`)messages.push(turn(u.id));
 return messages;
}

export function tileCombatInfo(b,q,r){
 const terrain=b.terrain[r*13+q],coefficient=t=>(10/COMBAT_DIVISORS[t]).toFixed(2);
 const borders=neighbors(q,r).filter(c=>![3,9,99].includes(b.terrain[c.r*13+c.q])).map(c=>{const t=b.terrain[c.r*13+c.q];return `${c.q+1},${c.r+1} ${TERRAIN[t]}: enemy-loss coefficient ×${coefficient(t)}, own counterattack coefficient ×${t===6?'2.00':coefficient(terrain)}`;});
 return `From this ${TERRAIN[terrain]} to neighbouring tiles: ${borders.join('; ')}. Terrain coefficients apply before integer rounding and random losses; WAR, training and weapons also matter. Charge uses the same equation as Normal for each of 1–10 exchanges.${terrain===6?' Defending the palace uses ×0.50; attackers receive ×2.00 counterattack exposure.':''}`;
}
