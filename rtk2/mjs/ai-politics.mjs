import {DEFAULT_AI} from './ai-parameters.mjs?v=32';
// Heuristic coverage of the diplomatic and covert repertoire; not decoded DOS AI.
export function aiPolitics(g,p,ready,ai){
 const tuning=g.rules.ai?.governance??DEFAULT_AI.governance;
 if(!p.officers.includes(g.ruler().leader)||ai.intelligence<tuning.politicsMinimumIntelligence||g.random()>=tuning.politicsChance)return false;
 const envoy=[...ready].filter(o=>o.id!==g.ruler().leader).sort((a,b)=>b.int+b.charm-a.int-a.charm)[0];if(!envoy)return false;
 const me=g.ruler(),others=g.s.rulers.filter(r=>r.id!==me.id&&g.s.provinces.some(p=>p.owner===r.id)),allies=others.filter(r=>me.alliances.includes(r.id)),rivals=others.filter(r=>!me.alliances.includes(r.id));if(!others.length)return false;
 const leader=g.officer(me.leader),cursor=g.s.aiPoliticalCursor?.[me.id]??0;g.s.aiPoliticalCursor??={};g.s.aiPoliticalCursor[me.id]=(cursor+1)%11;
 const ordered=[...rivals].sort((a,b)=>(me.relations[a.id]??50)-(me.relations[b.id]??50)),target=ordered[0]??others[0],hostile=g.s.provinces.filter(q=>rivals.some(r=>r.id===q.owner)),subordinates=hostile.flatMap(q=>q.officers.map(id=>({o:g.officer(id),p:q}))).filter(x=>x.o.id!==g.ruler(x.p.owner).leader&&!g.s.wars.some(b=>b.units.some(u=>u.id===x.o.id))).sort((a,b)=>a.o.loyalty-b.o.loyalty),weak=subordinates[0];
 let args={province:p.id,officer:envoy.id},type='diplomaticMission';
 if(cursor===0&&rivals.length)args={...args,mode:'alliance',target:target.id};
 else if(cursor===1&&p.gold>=100)args={...args,mode:'gift',target:target.id,amount:100};
 else if(cursor===2&&g.s.familyMode==='expanded'){const partner=others.find(r=>r.family&&!r.family.spouse&&g.s.year-g.officer(r.leader).birth+1>=16&&eligibleRoyalChildren(g.s,me,r).length);if(!partner)return false;args={...args,mode:'marriage',target:partner.id,child:eligibleRoyalChildren(g.s,me,partner)[0].id};}
 else if(cursor===2&&g.s.familyMode!=='expanded'&&me.hasDaughter!==false&&me.daughterGivenTo===undefined)args={...args,mode:'marriage',target:target.id};
 else if(cursor===3&&leader.ambition>=60&&rivals.length)args={...args,mode:'threat',target:target.id};
 else if(cursor===4&&allies.length){const ally=allies[0],enemy=hostile.find(q=>q.neighbors.some(id=>g.province(id).owner===me.id)&&q.neighbors.some(id=>g.province(id).owner===ally.id)&&!ally.alliances.includes(q.owner));if(!enemy)return false;args={...args,mode:'joint',target:ally.id,enemy:enemy.id};}
 else if(cursor===5&&weak){type='recruitMethod';args={...args,target:weak.o.id,method:envoy.int>envoy.charm?'letter':'attention'};}
 else if(cursor===6&&weak){type='spyMission';args={...args,mode:'forged',target:weak.o.id};}
 else if(cursor===7&&weak){type='spyMission';args={...args,mode:'betrayal',target:weak.o.id};}
 else if(cursor===8){const governor=subordinates.find(x=>x.p.governor===x.o.id);if(!governor)return false;type='spyMission';args={...args,mode:'wolf',target:governor.o.id};}
 else if(cursor===9&&rivals.length>=2){const second=ready.find(o=>o.id!==envoy.id&&o.id!==me.leader);if(!second)return false;type='spyMission';args={...args,mode:'rival',target:rivals[0].id,other:rivals[1].id,second:second.id};}
 else if(cursor===10&&envoy.loyalty===100&&hostile.length&&p.officers.length>2){type='spyMission';args={...args,mode:'infiltrate',target:hostile[0].id};}
 else return false;
 try{g.execute(type,args);return true;}catch{return false;}
}
import {eligibleRoyalChildren} from './ruler-family.mjs?v=32';
