import {replaceRemovedRuler} from './ruler-lifecycle.mjs?v=32';
import {zeroImpact,provinceSnapshot,provinceImpact,withImpact,cleanEventLanguage} from './event-impact.mjs?v=32';
import {retireRulerFamily} from './ruler-family.mjs?v=32';
import {processArrivals,protectedService} from './campaign-fidelity.mjs?v=32';
// Event categories and seasons follow the RTK II manual, Game Flow pp. 45–47.
// Disaster timing/spread remain remaster rules; four loss branches use the supplied DOS formulas (v30).
export const EVENT_TYPES=['locust','uprising','typhoon','flood','epidemic','meteor','war','occupation','tiger','death','chain','medical','council','history','clan','heir'];
export const monthNumber=s=>s.year*12+s.month-1;
export const incomeFactor=(s,p)=>p.famineUntil>=monthNumber(s)?.75:1;
export const floodRegion=p=>[1,2,3,4,5,6,7,9].includes(p.region);
export const typhoonRegion=p=>[11,13].includes(p.region);
const bound=(n,a=0,z=100)=>Math.max(a,Math.min(z,n));
export const HISTORY=[
 [189,'The Han court under Dong Zhuo','Dong Zhuo took control of the Han court at Luoyang. Rival lords began gathering against him.'],
 [190,'The coalition against Dong Zhuo','Regional lords joined a coalition against Dong Zhuo. The court was moved west to Chang’an, and Luoyang was burned.'],
 [192,'The fall of Dong Zhuo','In recorded history, Wang Yun and Lü Bu conspired against Dong Zhuo. His death was followed by renewed fighting over the Han court.'],
 [194,'Liu Bei and Xu Province','Tao Qian entrusted Xu Province to Liu Bei. Cao Cao and Lü Bu fought for control in the north.'],
 [197,'Yuan Shu claims the imperial title','Yuan Shu proclaimed himself emperor. Rival lords rejected his claim, and his position weakened.'],
 [200,'The battle of Guandu','Cao Cao defeated Yuan Shao at Guandu after a decisive attack on his supplies. The balance of power in northern China changed.'],
 [207,'Three visits to Zhuge Liang','Liu Bei visited Zhuge Liang and gained a new adviser. Their plan sought a secure base and an alliance against Cao Cao.'],
 [208,'The battle of Red Cliffs','Sun Quan and Liu Bei allied against Cao Cao. Their victory at Red Cliffs checked Cao Cao’s advance along the Yangtze.'],
 [215,'Three powers contend','Cao Cao took Hanzhong while Liu Bei held Yi Province. Rival northern, western and southeastern powers consolidated their positions.'],
 [219,'The struggle for Jing Province','Liu Bei secured Hanzhong. Guan Yu’s northern campaign ended with the loss of Jing Province to Sun Quan.'],
 [220,'The end of the Han','Cao Pi succeeded Cao Cao and received the Han emperor’s abdication. Wei was established; the rival realms endured.'],
 [221,'Liu Bei proclaims Shu Han','Liu Bei proclaimed himself emperor in Chengdu, continuing the claim to the Han dynasty.'],
 [222,'The battle of Yiling','Liu Bei’s campaign against Wu ended in defeat at Yiling. Lu Xun’s counterattack broke the invading army.'],
 [223,'The death of Liu Bei','Liu Bei died at Baidicheng. Zhuge Liang helped govern Shu under the new ruler.'],
 [229,'Sun Quan proclaims Wu','Sun Quan proclaimed himself emperor of Wu. Three competing dynasties now held the principal regions of China.']
];
const add=(report,title,text,province=null,officer=null,kind='month',art='council',impact=null)=>{
 title=cleanEventLanguage(title);text=cleanEventLanguage(text);if(province!==null&&kind==='month'){impact??=zeroImpact();text=withImpact(text,impact);}
 const detail={kind,title,text,province,officer,art,...(impact?{impact}: {})};report.details.push(detail);report.events.push(text);return detail;
};
const percent=(n,rate)=>Math.floor(n*rate/100);
const nativeRandom=(game,n)=>Math.min(n-1,Math.floor(game.random()*n));
function disasterTroops(game,p,base,{sickness=false,range=6}={}){const sick=[];if([...(game.s.wars||[]),...(game.s.battle?[game.s.battle]:[])].some(b=>b.target===p.id))return sick;for(const id of p.officers){if((game.s.wars||[]).some(b=>b.units.some(u=>u.id===id)))continue;const o=game.officer(id);o.soldiers=percent(o.soldiers,base+nativeRandom(game,range));if(sickness){const months=nativeRandom(game,4);const wasSick=o.sick;o.sick=months>0;o.illMonths=months>0?(o.medicalBook?1:months):o.injured?o.illMonths:0;if(o.sick&&!wasSick)sick.push({o,recovered:false});else if(!o.sick&&wasSick)sick.push({o,recovered:true});}}return sick;}
export function disaster(game,p,type,report){
 const titles={locust:'Locust swarm',flood:'Flood',typhoon:'Typhoon',epidemic:'Epidemic',uprising:'Popular uprising',rebellion:'Governor rebellion'};
 const before=provinceSnapshot(game,p),oldLoyalty=p.loyalty,oldRate=p.ricePrice,sick=[];let refugees=null;let extra='';
 if(type==='locust'){p.loyalty=percent(p.loyalty,70+nativeRandom(game,21));p.land=percent(p.land,50+nativeRandom(game,21));p.food=Math.floor(p.food/2)+Math.floor(p.food/100)*nativeRandom(game,21);p.famineUntil=monthNumber(game.s)+12;extra=' Famine reduces gold and food income by 25% for one year.';}
 else if(type==='epidemic'){p.loyalty=percent(p.loyalty,50+nativeRandom(game,21));p.population=Math.min(3000000,(percent(Math.floor(p.population/100),75+nativeRandom(game,16))+1)*100);sick.push(...disasterTroops(game,p,80,{sickness:true}));}
 else if(type==='flood'){const control=p.flood;disasterTroops(game,p,70+Math.floor(control/4));p.population=Math.min(3000000,(percent(Math.floor(p.population/100),75+Math.floor(control/5)+nativeRandom(game,6))+1)*100);p.loyalty=percent(p.loyalty,60+Math.floor(control/3)+nativeRandom(game,8));p.land=percent(p.land,45+Math.floor(control/2)+nativeRandom(game,6));p.flood=percent(control,75+nativeRandom(game,16));}
 else if(type==='typhoon'){const control=p.flood;p.loyalty=percent(p.loyalty,90+nativeRandom(game,10));p.land=percent(p.land,60+Math.floor(control/3)+nativeRandom(game,8));p.flood=percent(control,60+nativeRandom(game,21));}
 else if(type==='uprising'){p.loyalty=percent(p.loyalty,10+nativeRandom(game,21));p.land=percent(p.land,50+nativeRandom(game,21));p.gold=percent(p.gold,50+nativeRandom(game,21));p.food=Math.floor(p.food/2)+Math.floor(p.food/100)*nativeRandom(game,21);disasterTroops(game,p,60,{range:21});p.population=Math.min(3000000,(percent(Math.floor(p.population/100),60+nativeRandom(game,21))+1)*100);if(p.neighbors.length&&before.people>p.population){const destination=game.province(p.neighbors[nativeRandom(game,p.neighbors.length)]),previous=provinceSnapshot(game,destination);destination.population=Math.min(3000000,destination.population+before.people-p.population);refugees={destination,previous};}}
 else if(type==='rebellion'){
  const ids=[...p.officers],governor=p.governor,oldOwner=p.owner,general=game.officer(governor);
  let slot=Array.from({length:16},(_,i)=>i).find(id=>!game.s.rulers.some(r=>r.id===id));
  if(slot===undefined)slot=game.s.rulers.find(r=>!game.s.provinces.some(q=>q.owner===r.id)&&!game.s.humanRulers?.includes(r.id))?.id;
  const retired=slot===undefined?null:game.s.rulers.find(r=>r.id===slot);if(retired)retireRulerFamily(game.s,retired);
  p.officers=[];p.owner=slot??255;p.governor=slot===undefined?null:governor;
  for(const id of ids){const o=game.officer(id),follows=slot!==undefined&&(id===governor||o.loyalty<70);o.owner=follows?slot:255;if(follows){p.officers.push(id);o.loyalty=id===governor?100:60;}else p.unclaimed.push(id);}
  for(const r of game.s.rulers){if(ids.includes(r.advisor))r.advisor=null;if(slot!==undefined)r.alliances=r.alliances.filter(id=>id!==slot);}
  if(slot!==undefined){const rebel={id:slot,realmWasActive:true,founder:governor,leader:governor,name:general.name,zh:general.zh,home:p.id,advisor:null,hasDaughter:false,trust:30,relations:Object.fromEntries(Array.from({length:16},(_,i)=>[i,i===oldOwner?100:60])),alliances:[]},index=game.s.rulers.findIndex(r=>r.id===slot);if(index<0)game.s.rulers.push(rebel);else game.s.rulers[index]=rebel;extra=` ${general.name} seized the province and became its ruler. Other generals followed the rebellion or became unaffiliated.`;}
  else extra=` ${general.name} broke allegiance. The province is independent; its officers are unaffiliated.`;
 }
 if(['locust','flood'].includes(type))p.ricePrice=Math.max(percent(p.ricePrice,80),10+nativeRandom(game,5));
 add(report,`${titles[type]} · ${p.name}`,`${titles[type]} struck ${p.name}.${extra} Popular loyalty ${p.loyalty-oldLoyalty}; food exchange rate ${p.ricePrice-oldRate}.`,p.id,p.governor,'month',type==='rebellion'?'uprising':type,provinceImpact(game,p,before));
 for(const {o,recovered} of sick)add(report,(recovered?'Health recovery':'Illness')+' · '+p.name,recovered?`${o.name} recovered in ${p.name}.`:`${o.name} fell ill in ${p.name}. Recovery expected in ${o.illMonths} month${o.illMonths===1?'':'s'}.`,p.id,o.id,'month','medical');
 if(refugees)add(report,'Refugees arrive · '+refugees.destination.name,`Refugees from ${p.name} arrived in ${refugees.destination.name}.`,refugees.destination.id,null,'month','uprising',provinceImpact(game,refugees.destination,refugees.previous));
 if(['locust','epidemic'].includes(type)&&!game.s.monthlyState.disasters.some(d=>d.province===p.id&&d.type===type)){
  const season=game.s.year*4+Math.floor((game.s.month-1)/3);
  game.s.monthlyState.disasters.push({province:p.id,type,born:season,lastSpread:season});
 }
}
export const EARLY_DEATHS={'Sun Jian':[192,199],'Sun Ce':[200,205],'Zhou Yu':[210,215],'Lu Meng':[219,219],'Guo Jia':[207,207],'Xun Yu':[212,215],'Zhuge Liang':[234,238],'Yuan Shao':[202,205],'Xun You':[214,218]};
export function officerDeath(game,id,report,cause='after illness'){
 if([...(game.s.wars||[]),...(game.s.battle?[game.s.battle]:[])].some(b=>b.units.some(u=>u.id===id)))return false;
 const o=game.officer(id),p=game.s.provinces.find(p=>['officers','unclaimed','hidden'].some(k=>p[k].includes(id)));if(!p||o.dead)return false;const r=game.ruler(p.owner),before=provinceSnapshot(game,p);
 if(id===r?.leader)retireRulerFamily(game.s,r);
 const wasRuler=id===r?.leader;
 for(const key of ['officers','unclaimed','hidden'])p[key]=p[key].filter(n=>n!==id);o.owner=255;o.soldiers=0;o.dead=true;o.sick=false;o.injured=false;o.illMonths=0;
 if(wasRuler)replaceRemovedRuler(game,r.id,id,{reason:'died '+cause,report});
 if(r?.advisor===id)r.advisor=null;if(p.governor===id)p.governor=p.officers[0]??null;if(!p.officers.length)p.owner=255;
 add(report,`名聞天下的${o.zh||o.name}領便當去了 · ${o.name} has died`,`${o.name} died ${cause}.`,p.id,id,'month','death',provinceImpact(game,p,before));return true;
}
export function triggerEvent(game,type,report,{officer=null}={}){
 const s=game.s,active=s.provinces.flatMap(p=>p.officers.map(id=>({p,o:game.officer(id)}))).filter(({o})=>!o.dead);
 if(type==='meteor'){
  const options=active.filter(({o,p})=>p.officers.length>1||o.id!==game.ruler(p.owner)?.leader);if(!options.length)return false;
  const choice=options.find(({o})=>o.id===officer)||options.find(({o})=>EARLY_DEATHS[o.name]&&s.year>=EARLY_DEATHS[o.name][0]-1)||options[game.int(0,options.length-1)];
  s.monthlyState.omens??=[];if(s.monthlyState.omens.some(x=>x.officer===choice.o.id))return false;s.monthlyState.omens.push({officer:choice.o.id,due:monthNumber(s)+1});
  add(report,'看！有流星！快許願！ · Meteor omen',`A comet crossed the sky above ${choice.p.name}. Court astrologers associate the omen with ${choice.o.name}; their fate will be known next month.`,choice.p.id,choice.o.id,'month','meteor');return true;
 }
 if(type==='medical'){
  const choices=active.filter(({o})=>!o.medicalBook),choice=choices.find(({o})=>o.id===officer)||choices.find(({o})=>o.sick||o.injured)||choices[game.int(0,Math.max(0,choices.length-1))];if(!choice)return false;
  choice.o.medicalBook=true;if(choice.o.sick||choice.o.injured)choice.o.illMonths=1;
  add(report,'華佗の医学書 (青囊書) · Hua Tuo’s medical book',`${choice.o.name} received the Qing Nang Shu. Illness or injury now heals in one month instead of three.`,choice.p.id,choice.o.id,'month','medical');return true;
 }
 if(type==='tiger'){
  const x=active.find(({o,p})=>o.name==='Xun Yu'&&game.ruler(p.owner)?.name==='Cao Cao'),rivals=x?game.province(x.p.id).neighbors.map(id=>game.province(id)).filter(p=>p.owner!==255&&p.owner!==x.p.owner):[];
  const factions=[...new Set(rivals.map(p=>p.owner))];if(!x||factions.length<2)return false;const a=game.ruler(factions[0]),b=game.ruler(factions[1]);a.relations[b.id]=bound((a.relations[b.id]??50)+20);b.relations[a.id]=bound((b.relations[a.id]??50)+20);
  add(report,'驅虎吞狼 · Drive the tiger to swallow the wolf',`Xun Yu’s plan turned ${a.name} and ${b.name} against each other. Their mutual hostility is now ${a.relations[b.id]} / ${b.relations[a.id]}.`,x.p.id,x.o.id,'month','tiger');return true;
 }
 if(type==='chain'){
  const dong=active.find(({o})=>o.name==='Dong Zhuo'),lu=active.find(({o,p})=>o.name==='Lu Bu'&&dong&&p.owner===dong.p.owner),wang=active.find(({o,p})=>o.name==='Wang Yun'&&dong&&p.owner===dong.p.owner);if(!dong||!lu||!wang)return false;
  for(const {o,p} of active)if(p.owner===dong.p.owner&&o.id!==dong.o.id)o.loyalty=bound(o.loyalty-20);
  add(report,'大家的最愛 / 連環計 · Diaochan’s chain stratagem',`Wang Yun and Diaochan sowed distrust between Dong Zhuo and Lü Bu. Subordinate loyalty in Dong Zhuo’s realm fell by 20.`,dong.p.id,lu.o.id,'month','chain');return true;
 }
 return false;
}
function lifecycle(game,report){
 processArrivals(game,report);
 for(const omen of game.s.monthlyState.omens||[])if(omen.due<=monthNumber(game.s)){if((game.s.wars||[]).some(b=>b.units.some(u=>u.id===omen.officer)))omen.due=monthNumber(game.s)+1;else if(game.random()<.45)officerDeath(game,omen.officer,report,'following the comet omen');}
 game.s.monthlyState.omens=(game.s.monthlyState.omens||[]).filter(x=>x.due>monthNumber(game.s));
 for(const o of game.s.officers)if(!o.dead&&(o.sick||o.injured)){
  o.illMonths=Math.max(0,Math.min(o.illMonths??(o.medicalBook?1:3),o.medicalBook?1:3)-1);
  if(!o.illMonths){o.sick=false;o.injured=false;const p=game.s.provinces.find(p=>[...p.officers,...p.unclaimed,...p.hidden].includes(o.id));add(report,'Health recovery',`${o.name} recovered${o.medicalBook?' with Hua Tuo’s medical book':''}.`,p?.id??null,o.id,'month','medical');}
 }
 for(const p of game.s.provinces){
  for(const id of [...p.hidden]){const o=game.officer(id);if(o.name&&o.name!=='Unnamed'&&game.s.month===1&&o.birth>0&&game.s.year-o.birth+1===16){p.hidden=p.hidden.filter(n=>n!==id);p.unclaimed.push(id);add(report,'A new general comes of age',`${o.name} is now available in ${p.name}.`,p.id,id);}}
  for(const id of [...p.officers]){
   const o=game.officer(id);if((game.s.wars||[]).some(b=>b.units.some(u=>u.id===id)))continue;const r=game.ruler(p.owner),age=game.s.year-o.birth+1;
   const early=game.s.historyMode==='fiction'?null:EARLY_DEATHS[o.name];
   if(game.s.month===1&&((early&&game.s.year>=early[0]&&game.s.year<=early[1]&&game.random()<(game.s.year===early[1]?1:.3))||(age>=65&&o.birth>0&&game.random()<Math.min(.6,(age-64)/100)))){if(officerDeath(game,id,report,early?'after falling ill':'of old age'))continue;}
   if(id!==r?.leader){
    const leader=game.officer(r.leader),affinity=1-Math.min(1,Math.abs(o.compatibility-leader.compatibility)/128);
    if(r.trust>=70&&affinity>.5)o.loyalty=bound(o.loyalty+1);else if(r.trust<40||affinity<.2)o.loyalty=bound(o.loyalty-1);
    if(!protectedService(game.s,o,r)&&o.loyalty<25&&p.officers.length>1&&game.random()<(25-o.loyalty)/250){const before=provinceSnapshot(game,p);p.officers=p.officers.filter(n=>n!==id);p.unclaimed.push(id);o.owner=255;if(p.governor===id)p.governor=p.officers[0];if(r.advisor===id)r.advisor=null;add(report,'A general leaves service',`${o.name} left ${r.name} and became unaffiliated in ${p.name}.`,p.id,id,'month','council',provinceImpact(game,p,before));}
   }
  }
 }
 if(game.s.month===1)for(const p of game.s.provinces)for(const id of [...p.unclaimed,...p.hidden]){const o=game.officer(id),age=game.s.year-o.birth+1,early=game.s.historyMode==='fiction'?null:EARLY_DEATHS[o.name];if(o.pendingArrival||o.dead||o.prisonerOf!==undefined)continue;if((early&&game.s.year>=early[0]&&game.s.year<=early[1]&&game.random()<(game.s.year===early[1]?1:.3))||(age>=65&&o.birth>0&&game.random()<Math.min(.6,(age-64)/100)))officerDeath(game,id,report,early?'after falling ill':'of old age');}
 // Free generals can wander along the original province connections.
 const moves=[];for(const p of game.s.provinces)for(const id of p.unclaimed){const o=game.officer(id);if(o.prisonerOf===undefined&&!o.dead&&p.neighbors.length&&game.random()<.04)moves.push({id,from:p,to:game.province(p.neighbors[game.int(0,p.neighbors.length-1)])});}
 for(const {id,from,to}of moves){from.unclaimed=from.unclaimed.filter(n=>n!==id);to.unclaimed.push(id);add(report,'A wandering general arrives',`${game.officer(id).name} travelled from ${from.name} to ${to.name}.`,to.id,id);}
}
export function runMonthlyEvents(game,report,{initial=false}={}){
 const s=game.s,key=`${s.year}-${s.month}`;
 s.monthlyState??={applied:null,history:[],disasters:[]};report.details??=[];
 if(s.monthlyState.applied===key)return report;
 s.monthlyState.applied=key;
 const history=HISTORY.find(([year])=>year===s.year);
 if(s.historyMode!=='fiction'&&history&&!s.monthlyState.history.includes(s.year)&&(initial||s.month===1)){
  s.monthlyState.history.push(s.year);add(report,`Historical chronicle · ${s.year} · ${history[1]}`,history[2],null,null,'history','history').historyYear=s.year;
 }
 if(!initial){
  if(s.month===1)add(report,'A new year begins','Generals grow a year older. Young officers come of age, and population and tax rolls are renewed.');lifecycle(game,report);
  const season=s.year*4+Math.floor((s.month-1)/3),spread=[];
  s.monthlyState.disasters=s.monthlyState.disasters.filter(d=>d.type==='locust'?s.month<=9&&season-d.born<=2:season-d.born<=3);
  for(const d of s.monthlyState.disasters)if(season>d.lastSpread){d.lastSpread=season;for(const id of game.province(d.province).neighbors)if(game.random()<.25&&!s.monthlyState.disasters.some(x=>x.type===d.type&&x.province===id))spread.push({province:id,type:d.type});}
  const hit=new Set();for(const d of spread){if(hit.has(d.province))continue;hit.add(d.province);disaster(game,game.province(d.province),d.type,report);}
  for(const p of s.provinces){if(hit.has(p.id))continue;
   const ruler=game.ruler(p.owner),governor=p.governor===null?null:game.officer(p.governor),chance=game.random();let type=null;
   if(s.month<=6&&chance<.018)type=game.random()<.5?'locust':'epidemic';
   else if(s.month>=4&&s.month<=6&&chance<.018+(game.rules.floodChance??.12)*(1-p.flood/100))type=typhoonRegion(p)&&(!floodRegion(p)||game.random()>=.8)?'typhoon':floodRegion(p)?'flood':null;
   else if(ruler&&governor&&!(s.wars||[]).some(b=>b.target===p.id)&&p.loyalty<35&&ruler.trust<50&&governor.charm<70&&chance<(35-p.loyalty)/350)type='uprising';
   else if(ruler&&governor&&!(s.wars||[]).some(b=>[b.source,b.target].includes(p.id))&&governor.id!==ruler.leader&&governor.loyalty<20&&chance<(20-governor.loyalty)/500)type='rebellion';
   if(type)disaster(game,p,type,report);
  }
 }
 const special=s.monthlyState.special??=[];
 for(const [type,chance] of [['meteor',.08],['medical',.07],['tiger',.06],['chain',.025]])if((!['tiger','chain'].includes(type)||!special.includes(type))&&game.random()<chance){if(triggerEvent(game,type,report)&&['tiger','chain'].includes(type))special.push(type);}
 // Economic/upkeep reports are also part of the monthly council.
 const detailed=new Set(report.details.map(e=>e.text));for(const text of report.events)if(!detailed.has(text))report.details.push({kind:'month',title:'Monthly council',text,province:null,officer:null});
 if(!report.details.length)add(report,'Monthly council','Messengers report no exceptional events this month. The realm is ready for orders.');
 report.year=s.year;report.month=s.month;s.lastReport=report;s.monthlyReview={year:s.year,month:s.month,index:0};
 return report;
}
export function validateMonthlyState(s){
 for(const e of [s.lastEvent,...(s.lastReport?.details||[]),...(s.log||[]),...(s.log||[]).map(e=>e.event)])if(e)for(const key of ['title','text'])if(typeof e[key]==='string')e[key]=e[key].replaceAll('COVID-189','瘟疫 · Epidemic');
 s.monthlyState??={applied:null,history:[],disasters:[]};const m=s.monthlyState;
 if((m.applied!==null&&typeof m.applied!=='string')||!Array.isArray(m.history)||m.history.length>100||m.history.some(y=>!Number.isInteger(y)||y<189||y>999)||!Array.isArray(m.disasters)||m.disasters.length>82)throw Error('Invalid monthly event state.');
 m.omens??=[];m.special??=[];if(!Array.isArray(m.omens)||m.omens.length>255||m.omens.some(x=>!Number.isInteger(x.officer)||!s.officers[x.officer]||!Number.isInteger(x.due)||x.due<0)||!Array.isArray(m.special)||m.special.some(x=>!['tiger','chain'].includes(x))||new Set(m.special).size!==m.special.length)throw Error('Invalid special event state.');
 for(const o of s.officers){if(o.illMonths!==undefined&&(!Number.isInteger(o.illMonths)||o.illMonths<0||o.illMonths>3))throw Error('Invalid recovery period.');for(const key of ['medicalBook','injured','pendingArrival','sick','dead'])if(o[key]!==undefined&&typeof o[key]!=='boolean')throw Error('Invalid officer health or arrival state.');}
 for(const p of s.provinces)if(p.famineUntil!==undefined&&(!Number.isInteger(p.famineUntil)||p.famineUntil<0||p.famineUntil>12011))throw Error('Invalid famine duration.');
 for(const d of m.disasters)if(!['locust','epidemic'].includes(d.type)||!s.provinces[d.province-1]||!Number.isInteger(d.born)||!Number.isInteger(d.lastSpread)||d.lastSpread<d.born)throw Error('Invalid active disaster.');
 for(const e of s.lastReport?.details||[])if(e.impact&&(typeof e.impact!=='object'||['people','soldiers','gold','food','land','flood'].some(k=>!Number.isSafeInteger(e.impact[k])||Math.abs(e.impact[k])>6000000)))throw Error('Invalid event impact.');
 if(s.lastReport?.details){if(!Array.isArray(s.lastReport.details)||s.lastReport.details.length>600)throw Error('Invalid monthly report.');for(const e of s.lastReport.details)if(!['month','history'].includes(e.kind)||typeof e.title!=='string'||typeof e.text!=='string'||e.title.length>200||e.text.length>3000||(e.art!==undefined&&!EVENT_TYPES.includes(e.art)))throw Error('Invalid monthly event.');}
 if(s.monthlyReview&&(!Number.isInteger(s.monthlyReview.index)||s.monthlyReview.index<0||!s.lastReport?.details||s.monthlyReview.index>=s.lastReport.details.length||s.monthlyReview.year!==s.year||s.monthlyReview.month!==s.month||s.lastReport.year!==s.year||s.lastReport.month!==s.month))throw Error('Invalid monthly council position.');
}
