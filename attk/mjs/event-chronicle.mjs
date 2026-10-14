// Strategic history is independent of the short tactical playback queue.
export const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
import {presentEvent} from './events.mjs?v=56';
const commander=(g,id)=>{const o=g.officer(id);return {id:o.id,name:o.name,zh:o.zh||o.name};};
const snapshot=(g,id,leader)=>{const r=g.ruler(id),o=g.officer(leader??r.leader);return {id,name:o.name,zh:o.zh||o.name,leader:o.id};};
export function prepareWarHistory(s){s.warChronicle??=[];s.warSerial??=0;}
// Current-month reports only. Active battles and pending decisions carry their
// report forward so save validation and captive outcomes keep the same war ID.
export function prunePastEvents(s){
 const current=x=>x.year===s.year&&x.month===s.month;
 s.log=(s.log||[]).filter(current);s.currentReports=(s.currentReports||[]).filter(current);if(s.lastRoundEvents&&s.lastRoundEvents.year*12+s.lastRoundEvents.month!==s.year*12+s.month-1)delete s.lastRoundEvents;
 const required=new Set([...(s.wars||[]),...(s.battle?[s.battle]:[]),...(s.captiveDecisions||[]).map(c=>({chronicleWar:c.warId}))].map(b=>b.chronicleWar).filter(id=>id!==undefined));
 const rows=s.warChronicle||[],kept=rows.filter(current);
 for(const war of required){
  let row=kept.find(x=>x.war===war);
  if(!row){row=rows.findLast(x=>x.war===war);if(!row)continue;row.year=s.year;row.month=s.month;if(['ongoing','extended'].includes(row.status))row.status='ongoing';kept.push(row);}
  for(const c of s.captiveDecisions||[])if(c.warId===war){c.warYear=s.year;c.warMonth=s.month;}
 }
 s.warChronicle=kept;
 if(s.lastReport&&!current(s.lastReport))s.lastReport=null;
 if(s.lastEvent&&!s.log.some(x=>x.text===s.lastEvent.text)&&!s.monthlyReview)delete s.lastEvent;
}
// The short animation log stays bounded at 160. Reports have their own ledger,
// so AI orders and battles cannot evict meaningful events before human review.
export const reportWorthy=item=>!tactical(item.text)&&!fateText(item.text)&&!insignificant(item.text)&&!!cleanLocal(item.text)&&item.type!=='cheat';
export function validateCurrentReports(s){
 const valid=x=>x&&Number.isInteger(x.year)&&Number.isInteger(x.month)&&x.month>=1&&x.month<=12&&typeof x.text==='string'&&x.text.length<=6000&&['order','war','history','diplomacy','prison','month'].includes(x.type);
 const list=rows=>Array.isArray(rows)&&rows.length<=8192&&rows.every(valid);
 s.currentReports??=[];if(!list(s.currentReports))throw Error('Invalid current event reports.');
 if(s.lastRoundEvents){const r=s.lastRoundEvents;if(!Number.isInteger(r.year)||!Number.isInteger(r.month)||r.year*12+r.month!==s.year*12+s.month-1||!list(r.log)||!Array.isArray(r.wars)||r.wars.length>420||r.wars.some(x=>typeof x.text!=='string'||x.text.length>6000||!x.event))throw Error('Invalid completed-round reports.');}
}
export function completeEventRound(g){
 const s=g.s,seen=new Set(),log=[...(s.currentReports||[]),...s.log].filter(x=>x.year===s.year&&x.month===s.month&&reportWorthy(x)).filter(x=>{const key=x.type+':'+x.text;if(seen.has(key))return false;seen.add(key);return true;});
 const wars=(s.warChronicle||[]).filter(x=>x.year===s.year&&x.month===s.month&&['won','defeated'].includes(x.status)&&!x.fates.some(f=>f.action==='pending')).map(x=>({year:x.year,month:x.month,war:x.war,text:warReportText(s,x),event:{kind:'war',title:'Campaign summary',province:x.target,art:x.status==='won'?'occupation':'war'}}));
 return {year:s.year,month:s.month,log:structuredClone(log),wars};
}
const reportItems=s=>[...(s.currentReports||[]),...(s.lastRoundEvents?.log||[]),...s.log];
const treasureAward=item=>/received .+; (?:INT|WAR|CHARM|CHA|TRUST|MEDICAL|mounted mobility) \+\d+/i.test(item.text||'');
const nationalLocal=(g,item)=>treasureAward(item)||(['order','war','diplomacy','prison'].includes(item.type)&&(item.ai===true||item.ai===undefined&&eventProvinceIds(g,item).some(id=>g.province(id).owner!==255&&!g.isHuman(g.province(id).owner))));
export function beginWarReport(g,b,date=g.s){
 prepareWarHistory(g.s);prunePastEvents(g.s);if(!b.chronicleWar)b.chronicleWar=++g.s.warSerial;
 let row=g.s.warChronicle.find(x=>x.war===b.chronicleWar&&x.year===date.year&&x.month===date.month);
 if(!row){row={war:b.chronicleWar,year:date.year,month:date.month,source:b.source,target:b.target,attacker:snapshot(g,b.attacker,b.rulers?.attack),defender:snapshot(g,b.defender,b.rulers?.defend),commanders:{attack:commander(g,b.leaders?.attack??b.units.find(u=>u.side==='attack')?.id??g.ruler(b.attacker).leader),defend:commander(g,b.leaders?.defend??g.province(b.target).governor??g.ruler(b.defender).leader)},status:'ongoing',rulerResult:'pending',rulerPresent:{attack:b.units.some(u=>u.side==='attack'&&u.id===(b.rulers?.attack??g.ruler(b.attacker).leader)),defend:g.province(b.target).officers.includes(b.rulers?.defend??g.ruler(b.defender).leader)||b.units.some(u=>u.side==='defend'&&u.id===(b.rulers?.defend??g.ruler(b.defender).leader))},fates:[]};g.s.warChronicle.push(row);if(g.s.warChronicle.length>400){const active=new Set([...(g.s.wars||[]),...(g.s.battle?[g.s.battle]:[])].map(b=>b.chronicleWar));const latest=new Set([...active].map(id=>g.s.warChronicle.findLast(x=>x.war===id)));const i=g.s.warChronicle.findIndex(x=>!latest.has(x)&&x.status!=='ongoing'&&!x.fates.some(f=>f.action==='pending'));if(i>=0)g.s.warChronicle.splice(i,1);}}
 return row;
}
export function migrateActiveWarReports(g){
 for(const b of [...(g.s.wars||[]),...(g.s.battle?[g.s.battle]:[])])if(b.chronicleWar===undefined){const key=b.suspended?b.resumeMonth-1:g.s.year*12+g.s.month-1,date={year:Math.floor(key/12),month:key%12+1};const row=beginWarReport(g,b,date);if(b.suspended)row.status='extended';}
}
export function extendWarReport(g,b){beginWarReport(g,b).status='extended';}
export function finishWarReport(g,b,prisoners,decisions){
 const row=beginWarReport(g,b),won=b.outcome.winner==='attack',loser=won?b.defender:b.attacker,ruler=won?row.defender:row.attacker;
 row.status=won?'won':'defeated';row.reason=b.outcome.reason;row.finishedDay=b.day;row.losingOwner=loser;row.losingRuler=ruler.leader;row.losingCommander=row.commanders?.[won?'defend':'attack']?.id??b.leaders?.[won?'defend':'attack'];if(row.losingCommander!==undefined)row.commanderResult=prisoners.includes(row.losingCommander)?'pending':decisions.has(row.losingCommander)?'returned':'absent';
 row.rulerResult=prisoners.includes(ruler.leader)?'pending':b.units.some(u=>u.id===ruler.leader)||decisions.has(ruler.leader)||row.rulerPresent?.[won?'defend':'attack']?'returned':'absent';
 if(b.units.some(u=>u.id===ruler.leader&&u.killed))row.rulerResult='killed';if(b.units.some(u=>u.id===row.losingCommander&&u.killed))row.commanderResult='killed';
 for(const c of g.s.captiveDecisions.filter(c=>prisoners.includes(c.officer))){c.warId=b.chronicleWar;c.warYear=row.year;c.warMonth=row.month;const o=g.officer(c.officer);row.fates.push({officer:o.id,name:o.name,zh:o.zh||o.name,role:c.role||'General',formerOwner:c.formerOwner,action:'pending'});}
 return row;
}
export function recordWarFate(g,c,action){
 if(c.warId===undefined)return;const row=g.s.warChronicle?.find(x=>x.war===c.warId&&x.year===c.warYear&&x.month===c.warMonth),fate=row?.fates.find(x=>x.officer===c.officer);if(!fate)return;
 fate.action=action;if(fate.officer===row.losingRuler)row.rulerResult=action;if(fate.officer===row.losingCommander)row.commanderResult=action;
}
const officerName=(s,o)=>s.settings.names==='chinese'?(o.zh||o.name):o.name;
export function warReportText(s,row){
 const prefix=`${MONTHS[row.month-1]} ${row.year} AD: ${officerName(s,row.attacker)} #${row.source} attacked ${officerName(s,row.defender)} #${row.target}. `;
 if(row.status==='extended')return prefix+'Extended to next month.';
 if(row.status==='ongoing')return prefix+'In progress.';
 const side=row.status==='won'?'defend':'attack',opposition=row.status==='won'?'The opposing':'The attacking',isRuler=row.commanders?row.commanders[side]?.id===row.losingRuler:row.rulerResult!=='absent'&&row.rulerPresent?.[side]!==false,label=isRuler?'ruler':'commander',result=isRuler?row.rulerResult:row.commanderResult??row.fates.find(f=>f.officer===row.losingCommander)?.action??'absent';
 const disposition=(label,result)=>({killed:label+' was killed in battle',pending:label+'’s fate awaits a decision',free:label+' was set free',behead:label+' was beheaded',recruit:label+' was recruited',returned:label+(label==='commander'&&row.status==='won'?' was not captured':' returned unharmed'),absent:label+(label==='commander'&&row.status==='defeated'?' returned unharmed':' was not captured')})[result];
 const ruler=disposition(label,result);
 const generals=row.fates.filter(f=>f.formerOwner===row.losingOwner&&f.officer!==row.losingRuler),list=action=>[...new Set(generals.filter(f=>f.action===action).map(f=>officerName(s,f)))].join(', ');
 let text=prefix+(row.status==='won'?'Won. ':'Defeated. ')+opposition+' '+ruler+'.';
 for(const [action,verb,separator]of [['recruit','recruited',': '],['free','set free',' — '],['behead','beheaded',' — ']]){const names=list(action);if(names)text+=' '+opposition+' generals were '+verb+separator+names+'.';}
 if(!isRuler&&(row.rulerPresent?.[side]&&row.rulerResult==='returned'||['pending','free','behead','recruit'].includes(row.rulerResult)))text+=' '+opposition+' '+disposition('ruler',row.rulerResult)+'.';
 const pending=generals.filter(f=>f.action==='pending');if(pending.length)text+=' Awaiting decisions — '+pending.map(f=>officerName(s,f)).join(', ')+'.';
 const allies=row.fates.filter(f=>f.formerOwner!==row.losingOwner);if(allies.length)text+=' Allied captives — '+allies.map(f=>officerName(s,f)+': '+({free:'set free',behead:'beheaded',recruit:'recruited',pending:'awaiting decision'}[f.action])).join(', ')+'.';
 return text;
}
const tactical=text=>/^(Day \d+:|Province \d+: extended warfare resumes)| (moved to \d+,\d+|waited without moving|threw a fireball|attacked:|lost \d+ soldiers to fire|initiated simultaneous|called .*reinforce this army)/.test(text);
const fateText=text=>/refused recruitment\. Decide whether|: (set free|beheaded|recruited with loyalty)/.test(text);
const insignificant=text=>/^Province \d+ finished its orders\.|^A new month begins\.|^Messengers report no exceptional events/.test(text);
const cleanLocal=text=>text.replace(/departed from Province (\d+) on horseback\./g,'departed from Province $1 on horseback as a messenger.').replace(/The victorious army protected the inhabitants\.\s*/g,'').trim().replace(/^(Province \d+:\s*)$/,'');
export function eventProvinceIds(g,item){
 if(item.nationwide||item.event?.nationwide)return [];
 if(item.type==='history'||item.kind==='history'||item.event?.kind==='history')return [];
 const explicit=item.province??item.event?.province;if(Number.isInteger(explicit)&&g.s.provinces[explicit-1])return [explicit];
 const text=item.text||'',ids=new Set();for(const match of text.matchAll(/(?:Province\s+|#)(\d{1,2})\b/g))if(g.s.provinces[Number(match[1])-1])ids.add(Number(match[1]));
 for(const p of g.s.provinces)if(text.startsWith(p.name+':')||text.includes('struck '+p.name+'.')||text.startsWith('Rice shortage in '+p.name+'.')||text.startsWith(p.name+' cannot cover wages;')||text.startsWith(p.name+' harvested '))ids.add(p.id);
 return [...ids];
}
const strategicBattle=item=>item.type==='war'&&/ won\.|battle continues next month|invad|War declared/.test(item.text);
const datedPrefix=/^(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) \d{3,4} AD:\s*)+/i;
export function datedEventText(item){return `${MONTHS[item.month-1]} ${item.year} AD: `+item.text.replace(datedPrefix,'');}
export function acrossChinaChronology(g){
 const s=g.s,rows=(s.warChronicle||[]).filter(row=>row.year===s.year&&row.month===s.month).map((row,index)=>({year:row.year,month:row.month,text:warReportText(s,row),order:index+1000,event:{kind:'war',title:`#${row.target} · Campaign summary`,province:row.target,art:row.status==='won'?'occupation':'war'}}));
 // AI actions and named treasure awards join the national current report. Local disasters also retain province cards.
 for(const [index,item]of reportItems(s).entries()){
  if((item.year!==s.year||item.month!==s.month)&&!(item.year===s.lastRoundEvents?.year&&item.month===s.lastRoundEvents?.month))continue;
  if(tactical(item.text)||fateText(item.text)||insignificant(item.text)||!cleanLocal(item.text)||item.battleOutcome||item.warId!==undefined)continue;
  if(eventProvinceIds(g,item).length&&!strategicBattle(item)&&!nationalLocal(g,item))continue;
  if(['war','history','diplomacy','prison','month'].includes(item.type)||nationalLocal(g,item)){const event=presentEvent(g,{kind:item.type,title:item.type==='history'?`Historical chronicle · ${item.year}`:'Across China',...item.event,text:item.text,historyYear:item.type==='history'?item.year:item.event?.historyYear});rows.push({...item,event,order:999-index});}
 }
 for(const row of s.lastRoundEvents?.wars||[])if(!(s.warChronicle||[]).some(x=>x.war===row.war))rows.push({...row,order:0});
 const seen=new Set();return rows.sort((a,b)=>b.year-a.year||b.month-a.month||b.order-a.order).filter(row=>{const key=datedEventText(row);if(seen.has(key))return false;seen.add(key);return true;});
}
export function provinceCurrentEvents(g){
 const s=g.s,report=s.lastReport?.year===s.year&&s.lastReport.month===s.month?s.lastReport:null,items=[...(report?.details||[]),...reportItems(s).filter(x=>['order','war','diplomacy','prison','month'].includes(x.type)&&!x.battleOutcome&&x.warId===undefined&&!strategicBattle(x)&&!treasureAward(x))];
 return s.provinces.map(p=>{const seen=new Set(),events=[];for(const x of items){if(tactical(x.text)||fateText(x.text)||insignificant(x.text)||!eventProvinceIds(g,x).includes(p.id))continue;const text=cleanLocal(x.text);if(!text||seen.has(text))continue;seen.add(text);events.push(presentEvent(g,{kind:x.kind||x.type,...x.event,...x,text,province:p.id}));}return {province:p,events};});
}
export function validateWarHistory(s){
 prepareWarHistory(s);const bad=()=>{throw Error('Invalid campaign chronicle.');},ids=new Set(),names=o=>o&&Number.isInteger(o.id)&&s.rulers.some(r=>r.id===o.id)&&s.officers[o.leader]&&typeof o.name==='string'&&o.name.length<=100&&typeof o.zh==='string'&&o.zh.length<=100;
 if(!Number.isSafeInteger(s.warSerial)||s.warSerial<0||!Array.isArray(s.warChronicle)||s.warChronicle.length>420)bad();
 for(const x of s.warChronicle){if(x.reason!==undefined&&(typeof x.reason!=='string'||x.reason.length>1000))bad();if(x.finishedDay!==undefined&&(!Number.isInteger(x.finishedDay)||x.finishedDay<1||x.finishedDay>30))bad();if(x.commanders&&(['attack','defend'].some(side=>{const c=x.commanders[side];return !c||!Number.isInteger(c.id)||!s.officers[c.id]||typeof c.name!=='string'||typeof c.zh!=='string'||c.name.length>100||c.zh.length>100;})))bad();if(x.commanderResult!==undefined&&(!Number.isInteger(x.losingCommander)||!s.officers[x.losingCommander]||!['pending','returned','absent','free','behead','recruit','killed'].includes(x.commanderResult)))bad();if(x.rulerPresent!==undefined&&(!x.rulerPresent||typeof x.rulerPresent.attack!=='boolean'||typeof x.rulerPresent.defend!=='boolean'))bad();const key=`${x.war}:${x.year}:${x.month}`;if(ids.has(key)||!Number.isSafeInteger(x.war)||x.war<1||x.war>s.warSerial||!Number.isInteger(x.year)||x.year<189||x.year>s.year||!Number.isInteger(x.month)||x.month<1||x.month>12||x.year*12+x.month>s.year*12+s.month||!s.provinces[x.source-1]||!s.provinces[x.target-1]||!names(x.attacker)||!names(x.defender)||!['ongoing','extended','won','defeated'].includes(x.status)||!['pending','returned','absent','free','behead','recruit','killed'].includes(x.rulerResult)||!Array.isArray(x.fates)||x.fates.length>512)bad();ids.add(key);const officers=new Set();for(const f of x.fates){if(!s.officers[f.officer]||officers.has(f.officer)||!s.rulers.some(r=>r.id===f.formerOwner)||typeof f.name!=='string'||f.name.length>100||typeof f.zh!=='string'||f.zh.length>100||!['Ruler','Governor','General'].includes(f.role)||!['pending','recruit','free','behead'].includes(f.action))bad();officers.add(f.officer);}if(['won','defeated'].includes(x.status)&&(!s.rulers.some(r=>r.id===x.losingOwner)||!s.officers[x.losingRuler]))bad();}
 for(const b of [...(s.wars||[]),...(s.battle?[s.battle]:[])])if(b.chronicleWar!==undefined&&(!Number.isSafeInteger(b.chronicleWar)||!s.warChronicle.some(x=>x.war===b.chronicleWar&&x.source===b.source&&x.target===b.target)))bad();
 for(const c of s.captiveDecisions||[])if(c.warId!==undefined&&!s.warChronicle.some(x=>x.war===c.warId&&x.year===c.warYear&&x.month===c.warMonth&&x.fates.some(f=>f.officer===c.officer&&f.action==='pending')))bad();
}
