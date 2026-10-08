// Strategic history is independent of the short tactical playback queue.
export const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
import {presentEvent} from './events.mjs?v=28';
const snapshot=(g,id,leader)=>{const r=g.ruler(id),o=g.officer(leader??r.leader);return {id,name:o.name,zh:o.zh||o.name,leader:o.id};};
export function prepareWarHistory(s){s.warChronicle??=[];s.warSerial??=0;}
export function beginWarReport(g,b,date=g.s){
 prepareWarHistory(g.s);if(!b.chronicleWar)b.chronicleWar=++g.s.warSerial;
 let row=g.s.warChronicle.find(x=>x.war===b.chronicleWar&&x.year===date.year&&x.month===date.month);
 if(!row){row={war:b.chronicleWar,year:date.year,month:date.month,source:b.source,target:b.target,attacker:snapshot(g,b.attacker,b.rulers?.attack),defender:snapshot(g,b.defender,b.rulers?.defend),status:'ongoing',rulerResult:'pending',rulerPresent:{attack:b.units.some(u=>u.side==='attack'&&u.id===(b.rulers?.attack??g.ruler(b.attacker).leader)),defend:g.province(b.target).officers.includes(b.rulers?.defend??g.ruler(b.defender).leader)||b.units.some(u=>u.side==='defend'&&u.id===(b.rulers?.defend??g.ruler(b.defender).leader))},fates:[]};g.s.warChronicle.push(row);if(g.s.warChronicle.length>400){const active=new Set([...(g.s.wars||[]),...(g.s.battle?[g.s.battle]:[])].map(b=>b.chronicleWar));const latest=new Set([...active].map(id=>g.s.warChronicle.findLast(x=>x.war===id)));const i=g.s.warChronicle.findIndex(x=>!latest.has(x)&&x.status!=='ongoing'&&!x.fates.some(f=>f.action==='pending'));if(i>=0)g.s.warChronicle.splice(i,1);}}
 return row;
}
export function migrateActiveWarReports(g){
 for(const b of [...(g.s.wars||[]),...(g.s.battle?[g.s.battle]:[])])if(b.chronicleWar===undefined){const key=b.suspended?b.resumeMonth-1:g.s.year*12+g.s.month-1,date={year:Math.floor(key/12),month:key%12+1};const row=beginWarReport(g,b,date);if(b.suspended)row.status='extended';}
}
export function extendWarReport(g,b){beginWarReport(g,b).status='extended';}
export function finishWarReport(g,b,prisoners,decisions){
 const row=beginWarReport(g,b),won=b.outcome.winner==='attack',loser=won?b.defender:b.attacker,ruler=won?row.defender:row.attacker;
 row.status=won?'won':'defeated';row.losingOwner=loser;row.losingRuler=ruler.leader;
 row.rulerResult=prisoners.includes(ruler.leader)?'pending':b.units.some(u=>u.id===ruler.leader)||decisions.has(ruler.leader)||row.rulerPresent?.[won?'defend':'attack']?'returned':'absent';
 for(const c of g.s.captiveDecisions.filter(c=>prisoners.includes(c.officer))){c.warId=b.chronicleWar;c.warYear=row.year;c.warMonth=row.month;const o=g.officer(c.officer);row.fates.push({officer:o.id,name:o.name,zh:o.zh||o.name,role:c.role||'General',formerOwner:c.formerOwner,action:'pending'});}
 return row;
}
export function recordWarFate(g,c,action){
 if(c.warId===undefined)return;const row=g.s.warChronicle?.find(x=>x.war===c.warId&&x.year===c.warYear&&x.month===c.warMonth),fate=row?.fates.find(x=>x.officer===c.officer);if(!fate)return;
 fate.action=action;if(fate.officer===row.losingRuler)row.rulerResult=action;
}
const officerName=(s,o)=>s.settings.names==='chinese'?(o.zh||o.name):o.name;
export function warReportText(s,row){
 const prefix=`${MONTHS[row.month-1]} ${row.year} AD: ${officerName(s,row.attacker)} #${row.source} attacked ${officerName(s,row.defender)} #${row.target}. `;
 if(row.status==='extended')return prefix+'Extended to next month.';
 if(row.status==='ongoing')return prefix+'In progress.';
 const opposition=row.status==='won'?'The opposing':'The attacking',ruler={pending:'ruler’s fate awaits a decision',free:'ruler was set free',behead:'ruler was beheaded',recruit:'ruler was recruited',returned:'ruler returned unharmed',absent:'ruler was not captured'}[row.rulerResult];
 const generals=row.fates.filter(f=>f.formerOwner===row.losingOwner&&f.officer!==row.losingRuler),list=action=>[...new Set(generals.filter(f=>f.action===action).map(f=>officerName(s,f)))].join(', ')||'none';
 let text=prefix+(row.status==='won'?'Won. ':'Defeated. ')+opposition+' '+ruler+'. '+opposition+' generals were recruited — '+list('recruit')+'. '+opposition+' generals were set free — '+list('free')+'. '+opposition+' generals were beheaded — '+list('behead')+'.';
 const pending=generals.filter(f=>f.action==='pending');if(pending.length)text+=' Awaiting decisions — '+pending.map(f=>officerName(s,f)).join(', ')+'.';
 const allies=row.fates.filter(f=>f.formerOwner!==row.losingOwner);if(allies.length)text+=' Allied captives — '+allies.map(f=>officerName(s,f)+': '+({free:'set free',behead:'beheaded',recruit:'recruited',pending:'awaiting decision'}[f.action])).join(', ')+'.';
 return text;
}
const tactical=text=>/^(Day \d+:|Province \d+: extended warfare resumes)| (moved to \d+,\d+|waited without moving|threw a fireball|attacked:|lost \d+ soldiers to fire|initiated simultaneous|called .*reinforce this army)/.test(text);
const fateText=text=>/refused recruitment\. Decide whether|: (set free|beheaded|recruited with loyalty)/.test(text);
const insignificant=text=>/^Province \d+ finished its orders\.|^A new month begins\.|^Messengers report no exceptional events/.test(text);
const cleanLocal=text=>text.replace(/departed from Province (\d+) on horseback\./g,'departed from Province $1 on horseback as a messenger.').replace(/The victorious army protected the inhabitants\.\s*/g,'').trim().replace(/^(Province \d+:\s*)$/,'');
export function eventProvinceIds(g,item){
 if(item.type==='history'||item.kind==='history'||item.event?.kind==='history')return [];
 const explicit=item.province??item.event?.province;if(Number.isInteger(explicit)&&g.s.provinces[explicit-1])return [explicit];
 const text=item.text||'',ids=new Set();for(const match of text.matchAll(/(?:Province\s+|#)(\d{1,2})\b/g))if(g.s.provinces[Number(match[1])-1])ids.add(Number(match[1]));
 for(const p of g.s.provinces)if(text.startsWith(p.name+':')||text.includes('struck '+p.name+'.'))ids.add(p.id);
 return [...ids];
}
const strategicBattle=item=>item.type==='war'&&/ won\.|battle continues next month|invad|War declared/.test(item.text);
const datedPrefix=/^(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) \d{3,4} AD:\s*)+/i;
export function datedEventText(item){return `${MONTHS[item.month-1]} ${item.year} AD: `+item.text.replace(datedPrefix,'');}
export function acrossChinaChronology(g){
 const s=g.s,rows=(s.warChronicle||[]).map((row,index)=>({year:row.year,month:row.month,text:warReportText(s,row),order:index+1000,event:{kind:'war',title:`#${row.target} · Campaign summary`,province:row.target,art:row.status==='won'?'occupation':'war'}}));
 // Only strategic nationwide history belongs here; local diplomatic, treasure and mission reports live under their province.
 for(const [index,item]of s.log.entries()){
  if(tactical(item.text)||fateText(item.text)||insignificant(item.text)||!cleanLocal(item.text)||item.battleOutcome||item.warId!==undefined)continue;
  if(eventProvinceIds(g,item).length&&!strategicBattle(item))continue;
  if(['war','history','diplomacy','prison','month'].includes(item.type)){const event=presentEvent(g,{kind:item.type,title:item.type==='history'?`Historical chronicle · ${item.year}`:'Across China',...item.event,text:item.text,historyYear:item.type==='history'?item.year:item.event?.historyYear});rows.push({...item,event,order:999-index});}
 }
 const seen=new Set();return rows.sort((a,b)=>b.year-a.year||b.month-a.month||b.order-a.order).filter(row=>{const key=datedEventText(row);if(seen.has(key))return false;seen.add(key);return true;});
}
export function provinceCurrentEvents(g){
 const s=g.s,report=s.lastReport?.year===s.year&&s.lastReport.month===s.month?s.lastReport:null,items=[...(report?.details||[]),...s.log.filter(x=>x.year===s.year&&x.month===s.month&&['order','war','diplomacy','prison','month'].includes(x.type)&&!x.battleOutcome&&x.warId===undefined&&!strategicBattle(x))];
 return s.provinces.map(p=>{const seen=new Set(),events=[];for(const x of items){if(tactical(x.text)||fateText(x.text)||insignificant(x.text)||!eventProvinceIds(g,x).includes(p.id))continue;const text=cleanLocal(x.text);if(!text||seen.has(text))continue;seen.add(text);events.push(presentEvent(g,{kind:x.kind||x.type,...x.event,...x,text,province:p.id}));}return {province:p,events};});
}
export function validateWarHistory(s){
 prepareWarHistory(s);const bad=()=>{throw Error('Invalid campaign chronicle.');},ids=new Set(),names=o=>o&&Number.isInteger(o.id)&&s.rulers.some(r=>r.id===o.id)&&s.officers[o.leader]&&typeof o.name==='string'&&o.name.length<=100&&typeof o.zh==='string'&&o.zh.length<=100;
 if(!Number.isSafeInteger(s.warSerial)||s.warSerial<0||!Array.isArray(s.warChronicle)||s.warChronicle.length>420)bad();
 for(const x of s.warChronicle){if(x.rulerPresent!==undefined&&(!x.rulerPresent||typeof x.rulerPresent.attack!=='boolean'||typeof x.rulerPresent.defend!=='boolean'))bad();const key=`${x.war}:${x.year}:${x.month}`;if(ids.has(key)||!Number.isSafeInteger(x.war)||x.war<1||x.war>s.warSerial||!Number.isInteger(x.year)||x.year<189||x.year>s.year||!Number.isInteger(x.month)||x.month<1||x.month>12||x.year*12+x.month>s.year*12+s.month||!s.provinces[x.source-1]||!s.provinces[x.target-1]||!names(x.attacker)||!names(x.defender)||!['ongoing','extended','won','defeated'].includes(x.status)||!['pending','returned','absent','free','behead','recruit'].includes(x.rulerResult)||!Array.isArray(x.fates)||x.fates.length>512)bad();ids.add(key);const officers=new Set();for(const f of x.fates){if(!s.officers[f.officer]||officers.has(f.officer)||!s.rulers.some(r=>r.id===f.formerOwner)||typeof f.name!=='string'||f.name.length>100||typeof f.zh!=='string'||f.zh.length>100||!['Ruler','Governor','General'].includes(f.role)||!['pending','recruit','free','behead'].includes(f.action))bad();officers.add(f.officer);}if(['won','defeated'].includes(x.status)&&(!s.rulers.some(r=>r.id===x.losingOwner)||!s.officers[x.losingRuler]))bad();}
 for(const b of [...(s.wars||[]),...(s.battle?[s.battle]:[])])if(b.chronicleWar!==undefined&&(!Number.isSafeInteger(b.chronicleWar)||!s.warChronicle.some(x=>x.war===b.chronicleWar&&x.source===b.source&&x.target===b.target)))bad();
 for(const c of s.captiveDecisions||[])if(c.warId!==undefined&&!s.warChronicle.some(x=>x.war===c.warId&&x.year===c.warYear&&x.month===c.warMonth&&x.fates.some(f=>f.officer===c.officer&&f.action==='pending')))bad();
}
