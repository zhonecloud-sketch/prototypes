import fs from 'node:fs';
import {createCampaign,validateSave} from '../mjs/strategy.mjs';
import {AI_WEIGHTS} from '../mjs/ai-profile.mjs';
import {battleDailyFood} from '../mjs/war-provisions.mjs';
import {gameFor,enable,settle,buildTrainingEpisodes} from './ai-training-game.mjs';
const scenarios=JSON.parse(fs.readFileSync(new URL('../config/scenarios.json',import.meta.url))),terrains=JSON.parse(fs.readFileSync(new URL('../config/province-terrain.json',import.meta.url)));
const fraction=(value,needed)=>Math.max(0,Math.min(1,value/Math.max(1,needed))),month=s=>s.year*12+s.month-1;
const power=o=>o.soldiers*(.35+.35*o.training/100+.3*Math.min(1,o.weapons/Math.max(1,o.soldiers)))*(.5+o.war/100);

// Fixed supporting score: enough resources to expand safely, rather than hoarding.
export function conquestFeatures(g,owner){
 const own=g.s.provinces.filter(p=>p.owner===owner),r=g.ruler(owner),f={provinces:own.length,readiness:0,sustainability:0,production:0,stability:0};let fronts=0;
 for(const p of own){const officers=p.officers.map(id=>g.officer(id)),men=officers.reduce((n,o)=>n+o.soldiers,0),wages=officers.length*g.rules.wagePerOfficer+Math.floor(men/200),upkeep=Math.floor(men/g.rules.troopFoodDivisor),harvest=(7-g.s.month+12)%12||12,tax=(1-g.s.month+12)%12||12;
  f.sustainability+=Math.min(fraction(p.food,upkeep*harvest+1000),fraction(p.gold,wages*tax+100));
  f.production+=Math.min(fraction(p.population/g.rules.julyHarvestDivisor*(.3+p.land/100),upkeep*12+1000),fraction(p.population/g.rules.januaryTaxDivisor*(.5+p.loyalty/100),wages*12+100));
  f.stability+=Math.min(p.loyalty/100,officers.reduce((n,o)=>n+(o.id===r.leader?1:o.loyalty/100),0)/officers.length);
  const targets=p.neighbors.map(id=>g.province(id)).filter(q=>q.owner!==owner&&(q.owner===255||!r.alliances.includes(q.owner)));if(!targets.length)continue;
  fronts++;const army=officers.filter(o=>o.soldiers&&!o.sick&&!o.injured).sort((a,b)=>power(b)-power(a)).slice(0,Math.min(5,officers.length-1)),strength=army.reduce((n,o)=>n+power(o),0),fieldMen=army.reduce((n,o)=>n+o.soldiers,0),foodNeeded=Math.max(g.rules.ai.governance.minimumCarriedFood,battleDailyFood(fieldMen)*g.rules.ai.governance.warProvisionDays+1)+upkeep;
  f.readiness+=Math.max(...targets.map(q=>q.owner===255?(officers.length>1?Math.min(fraction(p.food,5000),fraction(p.gold,200)):0):Math.min(fraction(strength,q.officers.reduce((n,id)=>n+power(g.officer(id)),0)*1.6+1000),fraction(p.food,foodNeeded),fraction(p.gold,wages+100))));
 }
 for(const key of ['sustainability','production','stability'])f[key]/=Math.max(1,own.length);f.readiness/=Math.max(1,fronts);return f;
}
export function conquestScore({won,lost,elapsedMonths,horizon,before,after,shortageMonths,provincesLost,officersLost}){
 if(won)return 1000+100*(1-elapsedMonths/Math.max(1,horizon));if(lost)return -1000;
 return Math.max(-99,Math.min(99,60*after.provinces/41+10*(after.provinces-before.provinces)/41+10*after.readiness+10*after.sustainability+5*after.production+5*after.stability-Math.min(30,2*shortageMonths+2*provincesLost+.5*officersLost)));
}
export function conquestSummary(results){const wins=results.filter(r=>r.won),losses=results.filter(r=>r.lost);return {episodes:results.length,wins:wins.length,losses:losses.length,unfinished:results.length-wins.length-losses.length,successRate:wins.length/results.length,meanMonthsToVictory:wins.length?wins.reduce((n,r)=>n+r.elapsedMonths,0)/wins.length:null,meanCappedMonths:results.reduce((n,r)=>n+r.cappedMonths,0)/results.length,meanProvinces:results.reduce((n,r)=>n+r.metrics.provinces,0)/results.length,shortageMonths:results.reduce((n,r)=>n+r.shortageMonths,0),abstractBattles:results.reduce((n,r)=>n+r.abstractBattles,0),instantBattles:results.reduce((n,r)=>n+(r.instantBattles||0),0),detailedActions:results.reduce((n,r)=>n+r.detailedActions,0)};}
export function compareConquest(a,b){const x=conquestSummary(a.results),y=conquestSummary(b.results);return x.successRate-y.successRate||y.meanCappedMonths-x.meanCappedMonths||y.losses-y.losses||a.score-b.score;}
export function evaluateConquest(weights,episode){
 const state=structuredClone(episode.state);state.humanRulers=[];state.settings.battleView='personal';const g=gameFor(state),owner=episode.owner,start=month(g.s),until=start+episode.months,before=conquestFeatures(g,owner);enable(g,'governance',weights,owner);
 // This also guards against detailed actions accidentally introduced by future adapters.
 g.battleAction=()=>{throw Error('Detailed battlefield actions are disabled in governance conquest training.');};
 let steps=0,decisions=0,decisionMs=0,shortageMonths=0,provincesLost=0,officersLost=0,abstractBattles=0,instantBattles=0,lastBattle=g.s.lastBattle,previous=g.s.provinces.map(p=>p.owner),officerOwners=g.s.officers.map(o=>o.owner);
 g.reconcileControl();const budget=Math.max(6000,episode.months*1500);
 while(!g.s.campaignEnded&&!g.ruler(owner).extinct&&month(g.s)<until&&steps<budget){settle(g);if(g.s.battle&&g.battleDetailed())throw Error('Governance training entered a detailed battlefield.');const acting=g.s.player===owner&&!g.s.battle&&!g.s.journey,time=performance.now(),oldMonth=month(g.s);g.aiStep();if(acting){decisions++;decisionMs+=performance.now()-time;}steps++;
  if(g.s.lastBattle!==lastBattle){const b=g.s.lastBattle;if(b.resolution==='tactical'){if(b.day!==1||!['Every opposing unit fled.','The opposing army has no fighting soldiers.'].includes(b.reason))throw Error('Governance training resolved an unexpected tactical result; seed '+episode.seed);instantBattles++;}else abstractBattles++;lastBattle=b;}
  if(month(g.s)!==oldMonth)shortageMonths+=new Set((g.s.lastReport?.details||[]).filter(e=>previous[e.province-1]===owner&&/Rice shortage|cannot cover wages/.test(e.text)).map(e=>e.province)).size;
  for(const [i,p]of g.s.provinces.entries()){if(previous[i]===owner&&p.owner!==owner)provincesLost++;previous[i]=p.owner;}
  for(const [i,o]of g.s.officers.entries()){if(officerOwners[i]===owner&&o.owner!==owner)officersLost++;officerOwners[i]=o.owner;}
 }
 if(steps>=budget&&!g.s.campaignEnded&&!g.ruler(owner).extinct&&month(g.s)<until)throw Error('Governance conquest episode exceeded its step budget; seed '+episode.seed);
 const after=conquestFeatures(g,owner),won=!!(g.s.campaignEnded&&g.s.victor===owner&&after.provinces===41),lost=!!(g.ruler(owner).extinct||g.s.campaignEnded&&!won),elapsedMonths=won?(before.provinces===41?0:month(g.s)-start+1):month(g.s)-start,metrics={...after,soldiers:g.s.officers.filter(o=>o.owner===owner).reduce((n,o)=>n+o.soldiers,0),gold:g.s.provinces.filter(p=>p.owner===owner).reduce((n,p)=>n+p.gold,0),food:g.s.provinces.filter(p=>p.owner===owner).reduce((n,p)=>n+p.food,0)};
 return {seed:episode.seed,scenarioId:episode.state.scenarioId,stage:episode.stage,owner,initialProvinces:before.provinces,won,lost,elapsedMonths,horizon:episode.months,cappedMonths:won?elapsedMonths:episode.months+1,score:conquestScore({won,lost,elapsedMonths,horizon:episode.months,before,after,shortageMonths,provincesLost,officersLost}),metrics,shortageMonths,provincesLost,officersLost,abstractBattles,instantBattles,detailedActions:0,steps,decisions,meanDecisionMs:decisionMs/Math.max(1,decisions)};
}
export const CONQUEST_ADAPTER={weights:AI_WEIGHTS.governance,evaluate:evaluateConquest,compare:compareConquest};

// Synthetic legal start states for practice only. Original openings are untouched.
export function backwardScenario(template,ownedCount,index=0){
 const s=structuredClone(template),owner=s.rulers[0].id,foe=s.rulers[1],home=s.rulers[0].home,remaining=41-ownedCount,queue=[foe.home],region=[];
 while(queue.length&&region.length<remaining){const id=queue.shift();if(id===home||region.includes(id))continue;region.push(id);queue.push(...s.provinces[id-1].neighbors.filter(id=>!region.includes(id)&&id!==home).sort((a,b)=>index%2?b-a:a-b));}
 if(region.length!==remaining)throw Error('Could not construct a connected backward curriculum.');const neutral=region.at(-1),hostile=new Set(region.slice(0,-1)),refuge=s.provinces[home-1];
 for(const p of s.provinces){p.owner=hostile.has(p.id)?foe.id:p.id===neutral?255:owner;p.delegate='manual';if(p.owner===255){refuge.officers.push(...p.officers);p.officers=[];p.governor=null;}else for(const id of p.officers){s.officers[id].owner=p.owner;s.officers[id].loyalty=Math.max(70,s.officers[id].loyalty);}}
 // Place the two rulers in their own capitals after the ownership reassignment.
 for(const r of s.rulers.slice(0,2)){for(const p of s.provinces)p.officers=p.officers.filter(id=>id!==r.leader);s.provinces[r.home-1].officers.unshift(r.leader);s.officers[r.leader].owner=r.id;}
 for(const id of refuge.officers)s.officers[id].owner=owner;
 const leaders=new Set(s.rulers.slice(0,2).map(r=>r.leader));
 for(const p of s.provinces.filter(p=>p.owner!==255)){
  if(!p.officers.length){const donor=s.provinces.filter(q=>q.owner===p.owner&&q.officers.length>1).sort((a,b)=>b.officers.length-a.officers.length)[0],id=donor?.officers.find(id=>!leaders.has(id));if(id===undefined)throw Error('Backward curriculum needs more serving generals.');donor.officers=donor.officers.filter(n=>n!==id);p.officers.push(id);}
  p.governor=p.officers.find(id=>leaders.has(id))??p.officers[0];
  const men=p.officers.reduce((n,id)=>n+s.officers[id].soldiers,0);p.gold=Math.max(p.gold,500);p.food=Math.max(p.food,men*2+10000);
 }
 // Put spare existing generals at two fronts; single-governor provinces cannot invade.
 const fronts=s.provinces.filter(p=>p.owner===owner&&p.neighbors.some(id=>s.provinces[id-1].owner!==owner)).sort((a,b)=>b.officers.length-a.officers.length).slice(0,2);
 for(const p of fronts)while(p.officers.length<3){const donor=s.provinces.filter(q=>q.owner===owner&&q.id!==p.id&&q.officers.length>1).flatMap(q=>q.officers.filter(id=>id!==q.governor&&!leaders.has(id)).map(id=>({q,id}))).sort((a,b)=>power(s.officers[b.id])-power(s.officers[a.id]))[0];if(!donor)break;donor.q.officers=donor.q.officers.filter(id=>id!==donor.id);p.officers.push(donor.id);p.food=Math.max(p.food,p.officers.reduce((n,id)=>n+s.officers[id].soldiers,0)*3+10000);}
 if(index%3===1&&fronts[0])fronts[0].food=5000;if(index%3===2&&fronts[0]){fronts[0].gold=200;fronts[0].loyalty=45;}
 for(const p of s.provinces.filter(p=>p.owner===owner&&p.id!==home&&p.neighbors.every(id=>s.provinces[id-1].owner===owner))){p.delegate='domestic';p.delegation={policy:'internal',supply:0,attack:0};}
 for(const p of s.provinces.filter(p=>p.owner!==255))if(!p.officers.includes(p.governor))p.governor=p.officers[0];
 for(const r of s.rulers){r.alliances=[];if(r.advisor!==null&&s.officers[r.advisor].owner!==r.id)r.advisor=null;}
 return s;
}
export function buildConquestEpisodes({stage='opening',seed,count,months=6,saves=[]}){
 if(!['finish','expand','opening'].includes(stage))throw Error('Choose finish, expand or opening curriculum.');
 if(saves.length||stage==='opening')return buildTrainingEpisodes('governance',{seed,count,months,saves}).map(e=>({...e,stage:saves.length?'saved':stage}));
 return Array.from({length:count},(_,i)=>{const template=backwardScenario(scenarios[i%scenarios.length],stage==='finish'?38:24,i),state=createCampaign(template,[]);state.seed=(seed+i*104729)>>>0;delete state.monthlyAdvice;state.ai={intelligence:90,aggression:55};state.historyMode='fiction';state.familyMode='expanded';const g=gameFor(state);g.s.monthlyReview=null;const checked=validateSave(g.s,scenarios,terrains);return {state:checked,owner:checked.player,seed:state.seed,months,stage};});
}
