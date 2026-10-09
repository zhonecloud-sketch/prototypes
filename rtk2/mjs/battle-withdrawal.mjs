// main.exe 2cfbe: defeated field list, 25810 destinations, 25670 escape.
import {retreatOptions,withdrawUnit,unitOwner} from './battle.mjs?v=34';
export const defeatedUnits=g=>{const b=g.s.battle;return b?.outcome&&!b.abstractResolution?b.units.filter(u=>u.side!==b.outcome.winner&&!u.killed&&!u.fled&&!u.captured):[];};
function captureWithoutExit(g,u){const b=g.s.battle;u.captured=true;u.routed=true;u.capturedBy=b.outcome.winner==='attack'?b.attacker:b.defender;b.eventSerial=(b.eventSerial||0)+1;const text=u.soldiers===0?`${g.officer(u.id).name}: army depleted to 0; captured.`:`${g.officer(u.id).name} could not retreat — captured; no adjacent friendly or unoccupied province.`;b.events.unshift(text);b.events=b.events.slice(0,50);b.messages.push({serial:b.eventSerial,text,day:b.day});b.messages=b.messages.slice(-50);}
export function prepareDefeatedWithdrawal(g,autoHuman=false){
 for(const u of defeatedUnits(g)){const options=retreatOptions(g,u);if(!options.length||u.soldiers===0){captureWithoutExit(g,u);continue;}
  if(!autoHuman&&g.isHuman(unitOwner(g.s.battle,u)))continue;
  // 2574c prefers original province, then another same-owner neighbour.
  const owner=unitOwner(g.s.battle,u),destination=options.find(p=>p.id===u.origin)||options.find(p=>p.owner===owner)||options[g.int(0,options.length-1)];withdrawUnit(g,u,destination);
 }
}
export function decideDefeatedWithdrawal(g,id,province){
 const b=g.s.battle,u=defeatedUnits(g).find(u=>u.id===Number(id));if(!b?.awaitingResult||!b.resultReviewed||!u||!g.isHuman(unitOwner(b,u)))throw Error('No defeated general is awaiting your retreat decision.');
 const destination=retreatOptions(g,u).find(p=>p.id===Number(province));if(!destination)throw Error('Choose an adjacent friendly or unoccupied province.');
 const text=withdrawUnit(g,u,destination);prepareDefeatedWithdrawal(g);return text;
}
