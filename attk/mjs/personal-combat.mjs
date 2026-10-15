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

// 250F8/250AE: 32 one-tick waits, then 29396/581E: (20 >> 1)+1 ticks.
// BIOS PIT clock 1193182 Hz / 65536; measured with native sound disabled.
export const DUEL_TICK_MS=65536*1000/1193182;
export const DUEL_ROUND_MS=43*DUEL_TICK_MS;
export const personalCombatDuration=duel=>duel.rounds.length*DUEL_ROUND_MS;
export function personalCombatFrame(duel,elapsed){
 const round=Math.min(duel.rounds.length-1,Math.floor(Math.max(0,elapsed)/DUEL_ROUND_MS)),time=Math.max(0,elapsed)-round*DUEL_ROUND_MS;
 return {round:round+1,pose:Math.min(3,Math.floor(time/(8*DUEL_TICK_MS))),strength:time>=32*DUEL_TICK_MS?duel.rounds[round]:round?duel.rounds[round-1]:duel.initial};
}
