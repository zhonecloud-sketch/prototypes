import {living} from './battle.mjs?v=60';

export function armySummary(game,battle,side){
 const province=game.province(side==='attack'?battle.source:battle.target);
 const units=living(battle).filter(unit=>unit.side===side);
 const deployed=new Set(battle.units.map(unit=>unit.id));
 const leader=battle.leaders[side]??units[0]?.id;
 return {side,province,ruler:game.ruler(side==='attack'?battle.attacker:battle.defender),leader:leader===undefined?null:game.officer(leader),men:units.reduce((sum,unit)=>sum+unit.soldiers,0),weapons:units.reduce((sum,unit)=>sum+unit.weapons,0),armedPercent:Math.floor(100*units.reduce((sum,unit)=>sum+Math.min(unit.weapons,unit.soldiers),0)/Math.max(1,units.reduce((sum,unit)=>sum+unit.soldiers,0))),generals:side==='attack'?units.filter(u=>u.placed&&u.origin===battle.source).length:units.length,remaining:side==='attack'?units.filter(u=>u.placed&&u.origin!==battle.source).length:province.officers.filter(id=>!deployed.has(id)).length,food:battle.food[side],gold:battle.gold?.[side]??province.gold};
}

const resultStamp=row=>`${row.war}:${row.status}:${row.commanderResult??'absent'}`;
export function pendingBattleResult(game){
 const reviewed=Array.isArray(game.s.battleResultReviews)?game.s.battleResultReviews:[];
 return game.s.warChronicle?.find(row=>['won','defeated'].includes(row.status)&&!reviewed.includes(resultStamp(row)))||null;
}
export function reviewBattleResult(game,row){
 if(!row)return;
 const active=new Set((game.s.warChronicle||[]).map(resultStamp));
 game.s.battleResultReviews=[...(Array.isArray(game.s.battleResultReviews)?game.s.battleResultReviews:[]),resultStamp(row)].filter((stamp,i,list)=>active.has(stamp)&&list.indexOf(stamp)===i).slice(-400);
}
export function triumphBattleResult(game){
 const t=game.s.triumph;
 return t?game.s.warChronicle?.findLast(row=>row.target===t.province&&['won','defeated'].includes(row.status))||null:null;
}
export function battleResultCopy(game,row){
 const person=o=>game.s.settings.names==='chinese'?(o?.zh||o?.name):o?.name;
 const won=row.status==='won',side=won?'defend':'attack',commander=row.commanders?.[side],fate=row.commanderResult??'absent';
 const disposition={pending:'was captured; a decision is pending',killed:'was killed in battle',free:'was released',behead:'was executed',recruit:'was recruited by the victor',returned:'survived and was not captured',absent:'was not captured; no further fate is recorded'}[fate]||'has no recorded fate';
 return {title:won?'Attack victorious':'Attack defeated',outcome:`Attacker ${person(row.attacker)} ${won?'defeated':'lost to'} defender ${person(row.defender)}.`,commander:`Losing commander ${person(commander)||'unrecorded'} ${disposition}.`};
}
