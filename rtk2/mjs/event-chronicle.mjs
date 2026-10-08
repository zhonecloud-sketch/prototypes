// Strategic history is independent of the short tactical playback queue.
export const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const snapshot=(g,id,leader)=>{const r=g.ruler(id),o=g.officer(leader??r.leader);return {id,name:o.name,zh:o.zh||o.name,leader:o.id};};
export function prepareWarHistory(s){s.warChronicle??=[];s.warSerial??=0;}
export function beginWarReport(g,b,date=g.s){
 prepareWarHistory(g.s);if(!b.chronicleWar)b.chronicleWar=++g.s.warSerial;
 let row=g.s.warChronicle.find(x=>x.war===b.chronicleWar&&x.year===date.year&&x.month===date.month);
 if(!row){row={war:b.chronicleWar,year:date.year,month:date.month,source:b.source,target:b.target,attacker:snapshot(g,b.attacker,b.rulers?.attack),defender:snapshot(g,b.defender,b.rulers?.defend),status:'ongoing',rulerResult:'pending',fates:[]};g.s.warChronicle.push(row);if(g.s.warChronicle.length>400){const active=new Set([...(g.s.wars||[]),...(g.s.battle?[g.s.battle]:[])].map(b=>b.chronicleWar));const latest=new Set([...active].map(id=>g.s.warChronicle.findLast(x=>x.war===id)));const i=g.s.warChronicle.findIndex(x=>!latest.has(x)&&x.status!=='ongoing'&&!x.fates.some(f=>f.action==='pending'));if(i>=0)g.s.warChronicle.splice(i,1);}}
 return row;
}
export function migrateActiveWarReports(g){
 for(const b of [...(g.s.wars||[]),...(g.s.battle?[g.s.battle]:[])])if(b.chronicleWar===undefined){const key=b.suspended?b.resumeMonth-1:g.s.year*12+g.s.month-1,date={year:Math.floor(key/12),month:key%12+1};const row=beginWarReport(g,b,date);if(b.suspended)row.status='extended';}
}
export function extendWarReport(g,b){beginWarReport(g,b).status='extended';}
export function finishWarReport(g,b,prisoners,decisions){
 const row=beginWarReport(g,b),won=b.outcome.winner==='attack',loser=won?b.defender:b.attacker,ruler=won?row.defender:row.attacker;
 row.status=won?'won':'defeated';row.losingOwner=loser;row.losingRuler=ruler.leader;
 row.rulerResult=prisoners.includes(ruler.leader)?'pending':b.units.some(u=>u.id===ruler.leader)||decisions.has(ruler.leader)?'returned':'absent';
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
 const opposition=row.status==='won'?'The opposing':'The attacking',ruler={pending:'ruler’s fate awaits a decision',free:'ruler was set free',behead:'ruler was beheaded',recruit:'ruler was recruited',returned:'ruler returned unharmed',absent:'ruler was not personally present'}[row.rulerResult];
 const generals=row.fates.filter(f=>f.formerOwner===row.losingOwner&&f.officer!==row.losingRuler),list=action=>[...new Set(generals.filter(f=>f.action===action).map(f=>officerName(s,f)))].join(', ')||'none';
 let text=prefix+(row.status==='won'?'Won. ':'Defeated. ')+opposition+' '+ruler+'. '+opposition+' generals were recruited — '+list('recruit')+'. '+opposition+' generals were set free — '+list('free')+'. '+opposition+' generals were beheaded — '+list('behead')+'.';
 const pending=generals.filter(f=>f.action==='pending');if(pending.length)text+=' Awaiting decisions — '+pending.map(f=>officerName(s,f)).join(', ')+'.';
 const allies=row.fates.filter(f=>f.formerOwner!==row.losingOwner);if(allies.length)text+=' Allied captives — '+allies.map(f=>officerName(s,f)+': '+({free:'set free',behead:'beheaded',recruit:'recruited',pending:'awaiting decision'}[f.action])).join(', ')+'.';
 return text;
}
const tactical=text=>/^(Day \d+:|Province \d+: extended warfare resumes)| (moved to \d+,\d+|waited without moving|threw a fireball|attacked:|lost \d+ soldiers to fire|initiated simultaneous|called .*reinforce this army)/.test(text);
const fateText=text=>/refused recruitment\. Decide whether|: (set free|beheaded|recruited with loyalty)/.test(text);
export function acrossChinaChronology(g){
 const s=g.s,rows=(s.warChronicle||[]).map((row,index)=>({year:row.year,month:row.month,text:warReportText(s,row),order:index+1000,event:{kind:'war',title:`#${row.target} · Campaign summary`,province:row.target,art:row.status==='won'?'occupation':'war'}}));
 // Old text logs cannot reliably recover source provinces or vanished captive decisions.
 for(const [index,item]of s.log.entries()){
  if(tactical(item.text)||fateText(item.text)||item.battleOutcome||item.warId!==undefined)continue;
  const event=item.event||{},province=item.province??event.province;
  if(item.type==='war'||item.type==='history'||item.type==='diplomacy'||item.type==='prison'||(item.type==='month'&&!province&&!item.text.startsWith('A new month begins.'))){rows.push({...item,event:{...event,text:item.text},order:999-index});}
 }
 const seen=new Set();return rows.sort((a,b)=>b.year-a.year||b.month-a.month||b.order-a.order).filter(row=>{const key=`${row.year}:${row.month}:${row.text}`;if(seen.has(key))return false;seen.add(key);return true;});
}
export function provinceCurrentEvents(g){
 const s=g.s,report=s.lastReport?.year===s.year&&s.lastReport.month===s.month?s.lastReport:null,items=[...(report?.details||[]),...s.log.filter(x=>x.year===s.year&&x.month===s.month&&['order','diplomacy','prison'].includes(x.type)&&!x.battleOutcome&&x.warId===undefined&&!/^Province \d+ finished its orders\./.test(x.text))];
 return s.provinces.map(p=>{const seen=new Set(),events=items.filter(x=>{const id=x.province??x.event?.province;const matches=id===p.id||(id==null&&x.text?.startsWith(p.name+':'));if(!matches||seen.has(x.text))return false;seen.add(x.text);return true;});return {province:p,events};});
}
export function validateWarHistory(s){
 prepareWarHistory(s);const bad=()=>{throw Error('Invalid campaign chronicle.');},ids=new Set(),names=o=>o&&Number.isInteger(o.id)&&s.rulers.some(r=>r.id===o.id)&&s.officers[o.leader]&&typeof o.name==='string'&&o.name.length<=100&&typeof o.zh==='string'&&o.zh.length<=100;
 if(!Number.isSafeInteger(s.warSerial)||s.warSerial<0||!Array.isArray(s.warChronicle)||s.warChronicle.length>420)bad();
 for(const x of s.warChronicle){const key=`${x.war}:${x.year}:${x.month}`;if(ids.has(key)||!Number.isSafeInteger(x.war)||x.war<1||x.war>s.warSerial||!Number.isInteger(x.year)||x.year<189||x.year>s.year||!Number.isInteger(x.month)||x.month<1||x.month>12||x.year*12+x.month>s.year*12+s.month||!s.provinces[x.source-1]||!s.provinces[x.target-1]||!names(x.attacker)||!names(x.defender)||!['ongoing','extended','won','defeated'].includes(x.status)||!['pending','returned','absent','free','behead','recruit'].includes(x.rulerResult)||!Array.isArray(x.fates)||x.fates.length>512)bad();ids.add(key);const officers=new Set();for(const f of x.fates){if(!s.officers[f.officer]||officers.has(f.officer)||!s.rulers.some(r=>r.id===f.formerOwner)||typeof f.name!=='string'||f.name.length>100||typeof f.zh!=='string'||f.zh.length>100||!['Ruler','Governor','General'].includes(f.role)||!['pending','recruit','free','behead'].includes(f.action))bad();officers.add(f.officer);}if(['won','defeated'].includes(x.status)&&(!s.rulers.some(r=>r.id===x.losingOwner)||!s.officers[x.losingRuler]))bad();}
 for(const b of [...(s.wars||[]),...(s.battle?[s.battle]:[])])if(b.chronicleWar!==undefined&&(!Number.isSafeInteger(b.chronicleWar)||!s.warChronicle.some(x=>x.war===b.chronicleWar&&x.source===b.source&&x.target===b.target)))bad();
 for(const c of s.captiveDecisions||[])if(c.warId!==undefined&&!s.warChronicle.some(x=>x.war===c.warId&&x.year===c.warYear&&x.month===c.warMonth&&x.fates.some(f=>f.officer===c.officer&&f.action==='pending')))bad();
}
