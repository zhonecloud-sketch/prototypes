// Supplied English main.exe: 23702 (power), 2375a (signed loss), 235a8
// (proportional weapon loss). Both casualties use the pre-exchange armies.
export const COMBAT_DIVISORS=[10,10,12,10,8,15,20,5];
export const equipmentPercent=u=>u.soldiers===0?100:Math.min(100,Math.floor(100*u.weapons/u.soldiers));
export const combatPower=u=>3*(u.war+(u.combatWarBonus||0))+u.training+equipmentPercent(u);
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
