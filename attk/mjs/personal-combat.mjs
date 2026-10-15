import {VISUAL_INTERVAL} from './message-playback.mjs?v=58';
// Ordinary main.exe duel: 293AA bounds, 29304 counters and ten-round stop.
// Counters are duel strength, not permanent WAR or soldiers. Native side 0
// is defender; both damage calls occur even after the first reaches zero.
// Native 4B38 returns zero without advancing RNG for bounds below two.
export function resolvePersonalCombat(defender,attacker,random,compromised=false){
 const initial={defend:defender.war,attack:attacker.war},strength={...initial},rounds=[];
 const weakerBound=20-Math.max(1,Math.floor(Math.abs(initial.defend-initial.attack)/5));
 const bounds=compromised?{defend:Math.floor(initial.defend/10),attack:Math.floor(initial.attack/10)}:{defend:initial.defend<initial.attack?20:weakerBound,attack:initial.attack>=initial.defend?weakerBound:20};
 let loser=null;
 for(let round=0;round<10;round++){
  for(const side of ['defend','attack'])strength[side]=Math.max(0,strength[side]-(bounds[side]<2?0:Math.floor(random()*bounds[side])));
  rounds.push({...strength});
  if(strength.defend===0||strength.attack===0){loser=strength.defend===0&&strength.attack===0?null:strength.defend===0?'defend':'attack';break;}
 }
 return {initial,bounds,rounds,loser,winner:loser?(loser==='defend'?'attack':'defend'):null};
}

// Presentation clocks are independent of the recorded combat calculation.
export const personalCombatDuration=(duel,roundMs)=>duel.rounds.length*roundMs;
export function personalCombatFrame(duel,elapsed,roundMs){
 const completed=Math.min(duel.rounds.length,Math.floor(Math.max(0,elapsed)/roundMs));
 return {round:Math.min(duel.rounds.length,completed+1),pose:Math.floor(Math.max(0,elapsed)/VISUAL_INTERVAL)%4,strength:completed?duel.rounds[completed-1]:duel.initial};
}
