import {living} from './battle.mjs?v=32';

export function armySummary(game,battle,side){
 const province=game.province(side==='attack'?battle.source:battle.target);
 const units=living(battle).filter(unit=>unit.side===side);
 const deployed=new Set(battle.units.map(unit=>unit.id));
 const leader=battle.leaders[side]??units[0]?.id;
 return {side,province,ruler:game.ruler(side==='attack'?battle.attacker:battle.defender),leader:leader===undefined?null:game.officer(leader),men:units.reduce((sum,unit)=>sum+unit.soldiers,0),weapons:units.reduce((sum,unit)=>sum+unit.weapons,0),armedPercent:Math.floor(100*units.reduce((sum,unit)=>sum+Math.min(unit.weapons,unit.soldiers),0)/Math.max(1,units.reduce((sum,unit)=>sum+unit.soldiers,0))),generals:units.length,remaining:province.officers.filter(id=>!deployed.has(id)).length,food:battle.food[side],gold:battle.gold?.[side]??province.gold};
}
