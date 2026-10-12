import {planBattleRoute,palaceGuard,nextAIUnit,armyPower,projectedAttackRoutes,ambushLaneScore,tacticalPosition,fireEscapeOrder,palaceReturnOrder} from './ai-battle.mjs?v=54';
import {living,visibleUnit,reachable,terrainCost,distance,tilePoint,ownerFor} from './battle.mjs?v=54';
import {DEFAULT_AI} from './ai-parameters.mjs?v=54';

// Inspection only: never execute an order, write campaign state or consume RNG.
export function diagnosticUnits(game){
 const b=game.s.battle;
 return b?.phase==='battle'&&!b.outcome?living(b).filter(u=>u.placed):[];
}
export function battleAIDiagnostics(game,requested='auto'){
 const b=game.s.battle,units=diagnosticUnits(game);
 if(!units.length)return null;
 const tuning=game.rules.ai?.battle??DEFAULT_AI.battle;
 const intelligence=game.aiFor(ownerFor(b,b.side)).intelligence;
 const u=units.find(u=>requested!=='auto'&&u.id===Number(requested))??(game.battleAIUnit?.()??nextAIUnit(game,intelligence))??units.find(u=>u.side===b.side)??units[0];
 const enemies=units.filter(v=>v.side!==u.side&&visibleUnit(b,v,u.side));
 const smart=game.aiFor(ownerFor(b,u.side)).intelligence>=tuning.smartIntelligence;
 const guard=u.side==='defend'&&palaceGuard(b)?.id===u.id;
 const holding=guard&&distance(u,b.palace)===0;
 const ownPower=living(b).filter(v=>v.side===u.side).reduce((n,v)=>n+armyPower(v),0);
 const enemyPower=enemies.reduce((n,v)=>n+armyPower(v),0);
 const weak=ownPower<enemyPower*tuning.outnumberedPowerRatio;
 const moves=reachable(b,u);
 const adjacent=enemies.some(v=>distance(u,v)===1),escape=fireEscapeOrder(b,u,enemies),jungleWait=adjacent&&b.terrain[u.r*13+u.q]===4&&enemies.filter(v=>distance(u,v)===1).every(v=>b.terrain[v.r*13+v.q]===1);
 const position=!guard&&smart&&(u.side==='defend'||weak)?tacticalPosition(b,u,enemies,moves,weak,tuning):null;
 let route=null,goal=null,reason='Route preview; other orders can take priority.';
 if(escape){reason=escape.action==='move'?'Leaving fire for dry ground.':escape.action==='attack'?'Burning unit targets a weak enemy commander.':'No affordable dry neighbour; waiting in fire.';if(escape.action==='move')route=planBattleRoute(b,u,enemies,[escape]);}
 else if(palaceReturnOrder(b)?.unit===u.id){route=planBattleRoute(b,u,enemies,[b.palace]);reason='Return to the empty, dry palace before ordinary attacks.';}
 else if(jungleWait)reason='Water is worse cover than jungle; waiting for mobility.';
 else if(holding)reason='Palace guard holds position.';
 else if(adjacent)reason='Adjacent attack takes priority over movement.';
 else if(position?.wait){goal=position.ambushGoal??null;reason=goal?'Waiting for mobility toward preferred cover.':'Holding useful cover.';if(goal)route=planBattleRoute(b,u,enemies,[goal]);}
 else if(position){goal=position.ambushGoal??position;route=planBattleRoute(b,u,enemies,[goal]);reason='Preferred cover route; other orders can take priority.';}
 else if(guard)route=planBattleRoute(b,u,enemies,[b.palace]);
 else if(u.side==='defend'){
  const threats=[...enemies].sort((a,z)=>distance(a,b.palace)-distance(z,b.palace)||(a.id===b.leaders.attack?-1:z.id===b.leaders.attack?1:0));
  route=threats.map(v=>planBattleRoute(b,u,[v])).find(Boolean)??null;
 }else route=planBattleRoute(b,u,enemies);
 const affordable=[];let spent=0;
 for(const step of route?.path??[]){spent+=terrainCost(b.terrain[step.r*13+step.q]);if(spent>u.mobility)break;affordable.push({...step});}
 const end=affordable.at(-1);
 if(end&&!moves.some(c=>c.q===end.q&&c.r===end.r))affordable.length=0;
 if(!escape&&!jungleWait&&!route&&!holding&&!adjacent&&!position?.wait)reason='No legal route to the current objective.';
 if(u.ordered)reason='Daily order completed; route is a preview.';
 const attackers=units.filter(v=>v.side==='attack'&&visibleUnit(b,v,'defend'));
 const forecasts=projectedAttackRoutes(b,attackers);
 const occupied=new Set(units.filter(v=>v.id!==u.id&&visibleUnit(b,v,u.side)).map(v=>v.r*13+v.q));
 const jungles=b.terrain.flatMap((t,i)=>t===1?[{q:i%13,r:Math.floor(i/13),lane:ambushLaneScore({q:i%13,r:Math.floor(i/13)},forecasts),blocked:occupied.has(i)||!!b.fire[i]}]:[]);
 return {unit:{id:u.id,name:game.officer(u.id).name,side:u.side,q:u.q,r:u.r,mobility:u.mobility},route:route?{path:route.path.map(c=>({...c})),cost:route.cost}:null,affordable,goal:goal?{q:goal.q,r:goal.r}:null,reason,forecasts:forecasts.map(x=>({unit:{id:x.unit.id,q:x.unit.q,r:x.unit.r},path:x.path.map(c=>({...c}))})),jungles};
}

export function drawAIDiagnostics(ctx,data,{screen,scale,width,height,fontSize='12px'}){
 if(!data||width<32||height<32)return;
 const point=c=>screen(tilePoint(c.q,c.r));
 const polygon=c=>{const p=point(c);ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3,x=p.x+Math.cos(a)*scale,y=p.y+Math.sin(a)*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();return p;};
 const line=(from,to,color,dashed=false)=>{
  const a=point(from),z=point(to);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(z.x,z.y);ctx.strokeStyle='#071915d9';ctx.lineWidth=5;ctx.setLineDash(dashed?[5,4]:[]);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.stroke();
  const angle=Math.atan2(z.y-a.y,z.x-a.x),tip={x:a.x+(z.x-a.x)*.72,y:a.y+(z.y-a.y)*.72},s=Math.max(4,Math.min(7,scale*.35));
  ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.lineTo(tip.x-s*Math.cos(angle-.6),tip.y-s*Math.sin(angle-.6));ctx.lineTo(tip.x-s*Math.cos(angle+.6),tip.y-s*Math.sin(angle+.6));ctx.closePath();ctx.fillStyle=color;ctx.fill();
 };
 ctx.save();ctx.font=`600 ${fontSize} Georgia, serif`;ctx.textAlign='center';ctx.textBaseline='middle';
 if(data.showJungles){
  for(const f of data.forecasts){let previous=f.unit;for(const step of f.path){const a=point(previous),z=point(step);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(z.x,z.y);ctx.strokeStyle='#f3d27999';ctx.lineWidth=1.5;ctx.setLineDash([3,5]);ctx.stroke();previous=step;}ctx.setLineDash([]);}
  for(const c of data.jungles){const p=polygon(c);ctx.fillStyle=c.blocked?'#59676180':c.lane===0?'#1838319c':`rgba(40,180,132,${.28+c.lane*.5})`;ctx.fill();ctx.strokeStyle=c.blocked?'#929c9680':c.lane===0?'#b5c8bc80':'#a7f5ce';ctx.lineWidth=1;ctx.stroke();
   const label=c.blocked?'×':c.lane.toFixed(2),w=ctx.measureText(label).width+4;ctx.fillStyle='#10221deb';ctx.fillRect(p.x-w/2,p.y-7,w,14);ctx.fillStyle=c.blocked?'#d0d4cd':c.lane===0?'#d6ded3':'#f1fff3';ctx.fillText(label,p.x,p.y);
  }
 }
 if(data.showPaths&&data.route){let previous=data.unit;for(const [i,step]of data.route.path.entries()){line(previous,step,i<data.affordable.length?'#6de6f3':'#bfdce3',i>=data.affordable.length);previous=step;}}
 const start=polygon(data.unit);ctx.strokeStyle='#6de6f3';ctx.lineWidth=2;ctx.stroke();
 if(data.goal){polygon(data.goal);ctx.strokeStyle='#ffe290';ctx.lineWidth=2.5;ctx.stroke();}
 const lines=[];
 if(data.showPaths)lines.push('Cyan: inspected route · dashed: later');
 if(data.showJungles)lines.push('Jungle: lane 0–1 · × blocked · gold: cover');
 if(data.showJungles)lines.push('Dotted gold: visible attacker forecasts');
 const lineHeight=18,w=Math.min(width-16,Math.max(...lines.map(t=>ctx.measureText(t).width),0)+16),x=width-w-8,y=height-lines.length*lineHeight-14;
 ctx.fillStyle='#10221deb';ctx.fillRect(x,y,w,lines.length*lineHeight+8);ctx.textAlign='right';ctx.fillStyle='#f1ead8';
 for(const [i,text]of lines.entries())ctx.fillText(text,width-16,y+13+i*lineHeight,w-16);
 ctx.restore();
}
