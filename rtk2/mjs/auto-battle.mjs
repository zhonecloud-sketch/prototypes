import {battleRationMen} from './war-provisions.mjs?v=29';
// Abstract combat deliberately has no hex placement, pathfinding, action messages or tactical AI.
// DOS has a separate aggregate resolver (0x21418 -> 0x21138), bounded by six exchanges.
// Attribute/fort/casualty coefficients below remain remaster approximations.
export const abstractArmyPower=(b,side,forts=0)=>b.units.filter(u=>u.side===side&&u.soldiers>0&&!u.routed&&!u.fled&&!u.captured).reduce((n,u)=>n+u.soldiers*(.5+u.war/100)*(.5+u.training/100)*(.5+u.morale/100)*(.65+.35*Math.min(1,u.weapons/Math.max(1,u.soldiers))),0)*(side==='defend'?1+forts/200:1);
const men=(b,side)=>b.units.filter(u=>u.side===side&&!u.routed&&!u.fled&&!u.captured).reduce((n,u)=>n+u.soldiers,0);
function casualties(b,side,loss){const units=b.units.filter(u=>u.side===side&&u.soldiers>0&&!u.routed&&!u.fled&&!u.captured),total=units.reduce((n,u)=>n+u.soldiers,0);let remaining=Math.min(total,Math.max(0,Math.floor(loss)));for(const [i,u]of units.entries()){const n=i===units.length-1?Math.min(u.soldiers,remaining):Math.min(u.soldiers,Math.floor(loss*u.soldiers/Math.max(1,total)),remaining);u.soldiers-=n;remaining-=n;}}
export function resolveAbstractBattle(game,b){
 const forts=game.province(b.target).castle;let rounds=0,decision=null;
 const supplies=()=>{for(const side of ['attack','defend'])if(b.food[side]===0)return {winner:side==='attack'?'defend':'attack',reason:'The opposing army has exhausted its food.'};return null;};
 decision=supplies();
 while(!decision&&rounds<6){
  const a=abstractArmyPower(b,'attack'),d=abstractArmyPower(b,'defend',forts),am=men(b,'attack'),dm=men(b,'defend');
  if(!am||!dm){decision={winner:am?'attack':'defend',reason:'The opposing army has no fighting soldiers.'};break;}
  rounds++;
  // Native automatic combat's ration helper divides total men by six, then adds five.
  for(const side of ['attack','defend'])b.food[side]=Math.max(0,b.food[side]-Math.floor(battleRationMen(game,b,side)/6)-5);
  decision=supplies();if(decision)break;
  const share=a/Math.max(1,a+d),jitter=.85+game.random()*.3;
  casualties(b,'attack',Math.max(1,am*(1-share)*.2*jitter));casualties(b,'defend',Math.max(1,dm*share*.2/jitter));
 }
 if(!decision){const a=abstractArmyPower(b,'attack'),d=abstractArmyPower(b,'defend',forts);decision={winner:game.random()<a/Math.max(1,a+d)?'attack':'defend',reason:'The armies’ strength decided the automatic battle.'};}
 b.abstractResolution={method:'equation',rounds};b.suspended=false;b.outcome=decision;return decision;
}
