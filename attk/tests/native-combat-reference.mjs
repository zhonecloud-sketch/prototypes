// Supplied English main.exe: 23702 (power), 2375a (signed loss), 235a8
// (proportional weapon loss). Both casualties use the pre-exchange armies.
export const COMBAT_DIVISORS=[10,10,12,10,8,15,20,5];
export const equipmentPercent=u=>u.soldiers===0?100:Math.min(100,Math.floor(100*u.weapons/u.soldiers));
export const combatPower=u=>3*(u.war+(u.combatWarBonus||0))+u.training+equipmentPercent(u);
// main.exe 247c6: INT >=90 evades; no counterattack or ambusher order cost.
export function ambushExchange(mover,ambusher,terrain,random,factor=1){
 let loss=0;if(mover.int<90){const raw=Math.trunc(Math.trunc(10*(combatPower(mover)-combatPower(ambusher)-Math.min(ambusher.soldiers,Math.floor(random()*300)))/COMBAT_DIVISORS[terrain])/factor);loss=Math.min(mover.soldiers,3*(raw<0?-raw:Math.floor(random()*30)+1));}
 return {loss,weapons:Math.min(mover.weapons,Math.floor(loss*equipmentPercent(mover)/100))};
}
// 25566: horse bit 0x40, Lu Bu portrait 0xa3 (one based), ruler bonus.
export const fleeChance=(u,enemies,ruler,random10=0)=>u.hasHorse?100:Math.min(100,Math.floor((u.war+u.training+Math.floor(u.soldiers/100)+10*u.mobility)/(enemies+2))+(u.combatWarBonus?20:0)+(ruler?20:0)+random10);
// 10fde: floor each untrained army separately, then integer square root.
export const trainingGain=(officer,armies)=>Math.floor(2*officer.war/Math.floor(Math.sqrt(1+armies.filter(u=>u.training!==100).reduce((n,u)=>n+Math.floor(u.soldiers/100),0))));
// 106a0: the local governor's CHA, not the ruler in another province.
export function giveFoodGain(population,governorCharm,officerCharm,food,difficulty){const divisor=(6+difficulty)*Math.floor(Math.sqrt(Math.floor(population/100)));return divisor===0?255:Math.floor(Math.floor((governorCharm+officerCharm)/2)*Math.floor(Math.sqrt(food))/divisor)&255;}
export function nativeCasualty(ownPower,otherPower,otherMen,terrain,factor,random300,random30){
 const raw=Math.trunc(Math.trunc(10*(ownPower-otherPower-Math.min(otherMen,random300))/COMBAT_DIVISORS[terrain])/factor);
 return raw<0?-raw:random30+1;
}
export function meleeExchange(attacker,defender,attackerTerrain,defenderTerrain,random,attackFactor=1,palaceAssault=defenderTerrain===6){
 const a=combatPower(attacker),d=combatPower(defender),roll=(n)=>Math.floor(random()*n);
 const loss=(own,other,men,terrain,factor)=>{
  const r=roll(300),raw=Math.trunc(Math.trunc(10*(own-other-Math.min(men,r))/COMBAT_DIVISORS[terrain])/factor);
  return raw<0?-raw:roll(30)+1;
 };
 const reply=Math.min(attacker.soldiers,loss(a,d,defender.soldiers,palaceAssault?7:attackerTerrain,attackFactor));
 const killed=Math.min(defender.soldiers,loss(d,a,attacker.soldiers,defenderTerrain,1));
 return {loss:killed,reply,attackerWeapons:Math.min(attacker.weapons,Math.floor(reply*equipmentPercent(attacker)/100)),defenderWeapons:Math.min(defender.weapons,Math.floor(killed*equipmentPercent(defender)/100))};
}
