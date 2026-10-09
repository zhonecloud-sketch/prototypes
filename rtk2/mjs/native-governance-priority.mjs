// main.exe DS:A2E6/A2F6/A306/A31A; local order dispatch only.
// Strategic war/diplomacy prelude and eligibility adapters remain documented remaster policies.
export const NATIVE_GROUPS={
 military:['trainArmy','hireArmy','reassignArmy','buyWeapons'],
 personnel:['reward','recruit','search','rewardWritings'],
 domestic:['relief','develop','flood','sellFood','buyHorses']
};
export const NATIVE_POLICIES=[
 ['domestic','personnel','domestic','military','movement'],
 ['domestic','military','movement','personnel','military'],
 ['personnel','domestic','personnel','military','movement']
];
export const nativePolicy=(ambition,random)=>ambition>=80?1+Math.floor(random()*2):0;
export function nativeGroupOrders(group,difficulty,random){
 const list=NATIVE_GROUPS[group],start=Math.floor(random()*list.length),count=group==='military'?Math.floor(difficulty/2)+2:difficulty+1;
 return Array.from({length:count},(_,i)=>list[(start+i)%list.length]);
}
export function runNativePriority(policy,difficulty,random,attempt){
 for(const group of NATIVE_POLICIES[policy]){
  if(group==='movement'){if(attempt(group))return true;continue;}
  for(const order of nativeGroupOrders(group,difficulty,random))if(attempt(order))return true;
 }
 return false;
}
