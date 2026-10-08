// The supplied DOS game stores one daughter-availability flag, not ages or a birth schedule.
export const daughterStatus=r=>({count:r.hasDaughter===false?0:1,eligible:r.hasDaughter!==false&&r.daughterGivenTo===undefined,marriedTo:r.daughterGivenTo??null});
export function retireRulerFamily(s,r){
 if(s.familyMode==='expanded'&&r.family){
  const families=[...s.rulers.map(x=>x.family).filter(Boolean),...(s.familyArchives||[])];
  for(const family of families)for(const child of family.children)if(child.marriedTo===r.id&&child.marriedLeader===r.leader){child.marriedTo=null;child.marriedLeader=null;child.widowed=true;}
  s.familyArchives??=[];if(!s.familyArchives.some(f=>f.id===r.family.id))s.familyArchives.push({...r.family,pregnancy:null,retired:true});delete r.family;
 }
 for(const other of s.rulers){
  if(other.daughterGivenTo===r.id){delete other.daughterGivenTo;other.hasDaughter=false;}
  if(other.daughtersReceived)other.daughtersReceived=other.daughtersReceived.filter(id=>id!==r.id);
  delete other.marriedTo;
 }
 delete r.daughterGivenTo;r.daughtersReceived=[];r.hasDaughter=false;
}

// Optional remaster rules. These are deliberately separate from DOS family flags.
export const FAMILY_RULES={marriageAge:16,birthAge:18,monthlyChance:.03,gestation:9,cooldown:12,courtCost:100};
const now=s=>s.year*12+s.month-1;
export const childAge=(s,child)=>Math.floor((now(s)-child.birthMonth)/12);
export const rulerSex=(s,r)=>s.officers[r.leader].sex==='female'?'female':'male';
const active=(s,r)=>s.provinces.some(p=>p.owner===r.id)||(s.roaming||[]).some(p=>p.owner===r.id);
const families=s=>[...s.rulers.map(r=>r.family).filter(Boolean),...(s.familyArchives||[])];
function newFamily(s,r){
 s.familySequence=(s.familySequence||0)+1;
 const family={id:`r${r.id}-o${r.leader}-g${s.familySequence}`,owner:r.id,leader:r.leader,spouse:null,children:[],nextChild:1,pregnancy:null,cooldownUntil:0};
 // The DOS slot is a gameplay daughter, not a claim about historical genealogy.
 if(r.hasDaughter!==false&&!s.officers[r.leader].custom){family.children.push({id:family.id+'-c1',name:'Princess of '+r.name,sex:'female',birthMonth:now(s)-18*12,marriedTo:null,marriedLeader:null,eligibleNotified:true,nativeSlot:true});family.nextChild=2;}
 return family;
}
export function initializeRoyalFamilies(s){
 s.familyMode??='original';if(s.familyMode!=='expanded')return;
 s.familyArchives??=[];
 for(const r of s.rulers)if(!r.family&&active(s,r)&&!s.officers[r.leader].dead)r.family=newFamily(s,r);
 if(s.familyMigration===1)return;
 // Existing directional marriage saves become reciprocal spouse/child records once.
 for(const source of s.rulers){const target=s.rulers.find(r=>r.id===source.daughterGivenTo),child=source.family?.children[0];if(!child||!target?.family||target.family.spouse)continue;
  child.marriedTo=target.id;child.marriedLeader=target.leader;
  target.family.spouse={kind:'royal',name:child.name,sex:child.sex,birthMonth:child.birthMonth,sourceFamily:source.family.id,child:child.id,since:now(s)};
 }
 s.familyMigration=1;
}
export function eligibleRoyalChildren(s,r,target=null){
 if(s.familyMode!=='expanded'||!r.family)return [];
 return r.family.children.filter(c=>c.marriedTo===null&&childAge(s,c)>=16&&(!target||c.sex!==rulerSex(s,target)));
}
export function checkRoyalProposal(g,source,target,id){
 initializeRoyalFamilies(g.s);
 if(!target.family||target.family.spouse)throw Error('Choose an unmarried ruler.');
 if(g.s.year-g.officer(target.leader).birth+1<16)throw Error('The receiving ruler must be at least 16.');
 const child=eligibleRoyalChildren(g.s,source,target).find(c=>c.id===id);
 if(!child)throw Error('Choose an unmarried child aged 16 or older: princess for a male ruler, prince for a female ruler.');
 return child;
}
export function acceptRoyalProposal(g,source,target,id){
 const child=checkRoyalProposal(g,source,target,id);child.marriedTo=target.id;child.marriedLeader=target.leader;
 target.family.spouse={kind:'royal',name:child.name,sex:child.sex,birthMonth:child.birthMonth,sourceFamily:source.family.id,child:child.id,since:now(g.s)};
 return `${child.name} married ${target.name}.`;
}
export function courtMarriage(g,p){
 if(g.s.familyMode!=='expanded')throw Error('Court marriage requires Expanded family rules.');
 initializeRoyalFamilies(g.s);const r=g.ruler(),o=g.ready(p,r.leader);
 if(!r.family||r.family.spouse)throw Error('This ruler is already married.');
 if(g.s.year-o.birth+1<16)throw Error('The ruler must be at least 16 to marry.');
 if(p.gold<100)throw Error('Court marriage needs 100 gold.');
 r.family.spouse={kind:'court',name:'Consort of '+r.name,sex:rulerSex(g.s,r)==='male'?'female':'male',birthMonth:now(g.s)-25*12,sourceFamily:null,child:null,since:now(g.s)};
 p.gold-=100;o.acted=true;return `${r.name} married a court consort. The ceremony cost 100 gold.`;
}
export function royalFamilyUpkeep(g,report){
 if(g.s.familyMode!=='expanded')return;initializeRoyalFamilies(g.s);const stamp=now(g.s);
 const add=(r,title,text)=>{const event={kind:'month',art:'council',title,text,province:r.home,officer:r.leader};report.details.push(event);report.events.push(text);};
 for(const r of g.s.rulers.filter(r=>active(g.s,r)&&!g.officer(r.leader).dead)){
  const f=r.family;if(!f)continue;
  for(const c of f.children)if(!c.eligibleNotified&&childAge(g.s,c)>=16){c.eligibleNotified=true;add(r,'Royal child comes of age',`${c.name} is 16 and eligible for royal marriage.`);}
  if(f.pregnancy){
   if(stamp>=f.pregnancy.due){const sex=f.pregnancy.sex,index=f.nextChild++,name=`${sex==='female'?'Princess':'Prince'} ${index} of ${r.name}`;f.children.push({id:f.id+'-c'+index,name,sex,birthMonth:stamp,marriedTo:null,marriedLeader:null,eligibleNotified:false});f.pregnancy=null;f.cooldownUntil=stamp+12;add(r,'A royal child is born',`${r.name}’s family welcomed ${name}. The child will be eligible for marriage at 16.`);}
   continue;
  }
  if(!f.spouse||f.children.length>=64||stamp<f.cooldownUntil)continue;
  const age=g.s.year-g.officer(r.leader).birth+1,spouseAge=childAge(g.s,f.spouse),femaleAge=rulerSex(g.s,r)==='female'?age:spouseAge,maleAge=rulerSex(g.s,r)==='male'?age:spouseAge;
  if(femaleAge<18||femaleAge>45||maleAge<18||maleAge>65||g.officer(r.leader).sick||g.officer(r.leader).injured||g.officer(r.leader).prisonerOf!==undefined)continue;
  if(g.random()<FAMILY_RULES.monthlyChance)f.pregnancy={due:stamp+9,sex:g.random()<.5?'female':'male'};
 }
}
export function validateRoyalFamilies(s){
 s.familyMode??='original';if(!['original','expanded'].includes(s.familyMode))throw Error('Invalid family rules.');
 if(s.familyMode==='original')return;initializeRoyalFamilies(s);
 if(!Array.isArray(s.familyArchives)||s.familyArchives.length>512||s.familyMigration!==1||!Number.isSafeInteger(s.familySequence)||s.familySequence<1||s.familySequence>10000)throw Error('Invalid family history.');
 const all=families(s),ids=new Set(),children=new Map(),stamp=now(s),integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 for(const f of all){
  const identity=typeof f.id==='string'?f.id.match(/^r(\d+)-o(\d+)-g(\d+)$/):null;
  if(!identity||Number(identity[1])!==f.owner||Number(identity[2])!==f.leader||!integer(Number(identity[3]),1,s.familySequence)||ids.has(f.id)||!s.rulers.some(r=>r.id===f.owner)||!s.officers[f.leader]||!Array.isArray(f.children)||f.children.length>64||!integer(f.nextChild,1,10000)||!integer(f.cooldownUntil,0,stamp+24))throw Error('Invalid royal family.');ids.add(f.id);
  if(f.pregnancy&&(!integer(f.pregnancy.due,stamp,stamp+9)||!['female','male'].includes(f.pregnancy.sex)||!f.spouse))throw Error('Invalid expected royal birth.');
  if(f.spouse&&(!['court','royal'].includes(f.spouse.kind)||typeof f.spouse.name!=='string'||f.spouse.name.length>120||!['female','male'].includes(f.spouse.sex)||!integer(f.spouse.birthMonth,0,stamp-16*12)||!integer(f.spouse.since,0,stamp)))throw Error('Invalid royal spouse.');
  for(const c of f.children){const index=typeof c.id==='string'&&c.id.startsWith(f.id+'-c')?Number(c.id.slice((f.id+'-c').length)):NaN;if(!integer(index,1,f.nextChild-1)||children.has(c.id)||typeof c.name!=='string'||c.name.length>120||!['female','male'].includes(c.sex)||!integer(c.birthMonth,0,stamp)||typeof c.eligibleNotified!=='boolean'||c.marriedTo!==null&&!s.rulers.some(r=>r.id===c.marriedTo)||c.marriedTo!==null&&!s.officers[c.marriedLeader])throw Error('Invalid royal child.');children.set(c.id,{f,c});}
 }
 for(const r of s.rulers)if(r.family&&(r.family.owner!==r.id||r.family.leader!==r.leader||r.family.retired))throw Error('Royal family belongs to a former ruler.');
 for(const f of all){
  const spouse=f.spouse;
  if(spouse?.kind==='royal'){const record=children.get(spouse.child);if(!record||record.f.id!==spouse.sourceFamily||record.c.sex!==spouse.sex||record.c.birthMonth!==spouse.birthMonth)throw Error('Invalid royal marriage link.');}
  for(const c of f.children)if(c.marriedTo!==null){const target=s.rulers.find(r=>r.id===c.marriedTo),sp=target?.family?.spouse;if(target?.leader!==c.marriedLeader||sp?.child!==c.id||sp.sourceFamily!==f.id||childAge(s,c)<16||c.sex===rulerSex(s,target))throw Error('Invalid married royal child.');}
 }
}
