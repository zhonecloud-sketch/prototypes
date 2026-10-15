import {aiMode,AI_RULES_ID} from './ai-profile.mjs?v=56';
import {aiGovernance} from './ai-governance.mjs?v=58';
import {aiBattle,nextAIUnit} from './ai-battle.mjs?v=58';
import {planGovernance} from './ai-planner-governance.mjs?v=58';
import {planBattlefield,battlefieldObservation} from './ai-planner-battlefield.mjs?v=58';
import {forkAI,applyAIOrder,describeAIOrder} from './ai-simulation.mjs?v=56';
const cache=new WeakMap();
export function aiPlan(g,domain){const p=g.s.aiExtensions?.profiles[domain];if(!p||p.rulesId!==AI_RULES_ID||domain==='battlefield'&&!g.s.battle)return null;const stamp=JSON.stringify([domain,p,g.s.difficulty,g.s.ai,g.s.aiRulers,domain==='battlefield'?battlefieldObservation(g):g.s]),old=cache.get(g);if(old?.stamp===stamp)return old.plan;const plan=domain==='battlefield'?planBattlefield(g,p):planGovernance(g,p);cache.set(g,{stamp,plan});return plan;}
export function compareAI(g,domain){
 const plan=aiPlan(g,domain),legacy=forkAI(g),calls=[];for(const method of ['execute','invade','battleAction']){const run=legacy[method];legacy[method]=function(action,args){const result=run.call(this,action,args);if(result!==false)calls.push(method==='invade'?{domain:'governance',action:'attack',args:action}:{domain,action,args});return result;};}
 if(domain==='battlefield'){const b=legacy.s.battle;if(!b)return null;const before=b.actionSerial,side=b.side,day=b.day;aiBattle(legacy,legacy.aiFor(legacy.battleOwner()).intelligence);if(b.actionSerial>before)calls.push({domain,action:b.lastAction.type,args:{unit:b.lastAction.unit,target:b.lastAction.target,q:b.lastAction.q,r:b.lastAction.r}});else if(b.side!==side||b.day!==day||b.suspended)calls.push({domain,action:'end',args:{}});}else aiGovernance(legacy);
 return {domain,legacy:describeAIOrder(g,calls[0]),trained:describeAIOrder(g,plan?.order),reason:plan?.reason||'Import a compatible profile to compare.',alternatives:plan?.alternatives.map(o=>({text:describeAIOrder(g,o),score:o.score}))||[]};
}
export function runAIExtension(g,domain,intelligence){
 const trained=aiMode(g,domain)==='trained',shadow=g.s.aiExtensions?.shadow;
 if(shadow&&g.s.aiExtensions.profiles[domain]?.rulesId===AI_RULES_ID)try{g.aiComparison=compareAI(g,domain);}catch(error){g.aiComparison={domain,reason:error.message,alternatives:[]};}
 if(trained){const plan=aiPlan(g,domain);if(plan?.order){applyAIOrder(g,plan.order);g.aiComparison={...(shadow?g.aiComparison:{}),domain,trained:describeAIOrder(g,plan.order),reason:plan.reason,alternatives:plan.alternatives.map(o=>({text:describeAIOrder(g,o),score:o.score}))};return true;}}
 return domain==='governance'?aiGovernance(g):aiBattle(g,intelligence);
}
export function policyBattleUnit(g){if(aiMode(g,'battlefield')==='trained'&&g.s.battle?.phase==='battle'&&!g.s.battle.challenge){const id=aiPlan(g,'battlefield')?.order?.args.unit,u=g.s.battle.units.find(u=>u.id===id);if(u)return u;}return nextAIUnit(g);}
