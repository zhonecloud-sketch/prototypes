import {hireCapacity} from './province-rules.mjs?v=22';
import {eligibleRoyalChildren} from './ruler-family.mjs?v=22';

// Read-only presentation checks. The engine remains the authority when an order executes.
export function orderUnavailable(g,p,id){
 if(['view','map','family'].includes(id))return null;
 const s=g.s,r=g.ruler(),home=p.officers.includes(r.leader);
 if(p.owner!==r.id||!g.isHuman())return 'Select your province during your faction’s orders turn.';
 if(s.monthlyReview)return 'Read this month’s council before issuing orders.';
 if(s.campaignEnded)return 'This campaign has ended.';
 if(s.provinceCompleted.includes(p.id))return 'This province has finished its orders this month.';
 if(p.delegation&&p.delegate!=='manual'&&!['delegate','delegateRealm'].includes(id))return 'Return this province to direct rule before issuing orders.';
 if(s.wars.some(b=>b.target===p.id))return 'This province is under siege.';
 const ready=id=>{try{g.ready(p,id);return null;}catch(error){return error.message;}};
 const available=p.officers.filter(id=>!ready(id)),none=available.length?null:'No general here is available to act this month.';
 if(['reward','tax','reward:gold','reward:horse','reward:writings','diplomacy:cancel'].includes(id)){const reason=ready(p.governor);if(reason)return reason;}
 if(['delegate','exile','diplomacy:court'].includes(id)){
  if(!home)return 'Issue this order where your ruler is staying.';
  const reason=ready(r.leader);if(reason)return reason;
 }
 if(id==='exile'&&s.wars.some(b=>[b.attacker,b.defender].includes(r.id)))return 'Withdraw from ongoing wars before going into exile.';
 if(id==='delegate'&&!s.provinces.some(q=>q.owner===r.id&&!q.officers.includes(r.leader)))return 'There is no other province to delegate.';
 if(id==='rest')return null;
 if(id==='advice'){const v=s.visitors;return (r.advisor!==null&&p.officers.includes(r.advisor))||[v?.scholar,v?.critic].includes(p.id)||(v?.huaTuo===p.id&&p.officers.some(id=>g.officer(id).sick||g.officer(id).injured))?null:'Advice needs your advisor here, rumours need Sima Hui or Xu Shao, and healing needs Hua Tuo and a recovering general.';}
 if(id==='tax')return p.taxed?'An extra tax has already been collected this month.':[7,8,9].includes(s.month)?'Extra tax is unavailable during July, August, and September.':null;
 if(id==='trade'&&!p.merchant)return 'No merchant is visiting this province this month.';
 if(id==='spy'&&!home)return 'Issue spy orders where your ruler is staying.';
 if(id==='advice:healing')return s.visitors?.huaTuo!==p.id?'Hua Tuo is not visiting this province.':!p.officers.some(id=>g.officer(id).sick||g.officer(id).injured)?'No general here needs healing.':null;
 if(id==='advice:rumours')return ![s.visitors?.scholar,s.visitors?.critic].includes(p.id)?'Sima Hui or Xu Shao must visit to share rumours.':null;
 if(id==='advice:advice')return r.advisor===null||!p.officers.includes(r.advisor)?'Your advisor must be in this province to give advice.':null;
 if(id.startsWith('diplomacy:')){
  const mode=id.split(':')[1],others=s.rulers.filter(q=>q.id!==r.id&&s.provinces.some(p=>p.owner===q.id));
  if(['alliance','joint','marriage','cancel','threat','court'].includes(mode)&&!home)return 'Issue this order where your ruler is staying.';
  if(['joint','cancel'].includes(mode)&&!others.some(q=>r.alliances.includes(q.id)))return 'You have no active ally for this order.';
  if(mode==='alliance'&&!others.some(q=>!r.alliances.includes(q.id)))return 'Every other active ruler is already allied with you.';
  if(mode==='marriage'){
   if(s.familyMode==='expanded'&&!eligibleRoyalChildren(s,r).length)return 'No unmarried royal child has reached age 16. View Royal Family for ages.';
   if(s.familyMode!=='expanded'&&(r.hasDaughter===false||r.daughterGivenTo!==undefined))return r.hasDaughter===false?'You have no daughters.':'Your daughter is already married.';
  }
  if(mode==='court'){if(r.family?.spouse)return 'Your ruler is already married.';if(s.year-g.officer(r.leader).birth+1<16)return 'Your ruler must be at least 16 to marry.';if(p.gold<100)return 'Court marriage requires 100 gold.';return null;}
  if(!others.length)return 'There is no other active ruler.';
  if(mode==='gift'&&p.gold<100)return 'A diplomatic gift requires at least 100 gold.';
  if(mode==='cancel')return null;
 }
 if(id==='reward'||id.startsWith('reward:')){
  if(p.gold<1)return 'This province has no gold to spend.';
  const targets=p.officers.map(id=>g.officer(id)).filter(o=>o.id!==r.leader);
  if(!targets.length)return 'There is no subordinate here to reward.';
  const gold=targets.some(o=>o.loyalty<100)&&Math.floor(g.officer(p.governor).charm*Math.min(100,p.gold)/400)>0;
  const horse=p.horses>0&&targets.some(o=>o.loyalty<100),advisor=r.advisor===null?null:g.officer(r.advisor),writings=advisor&&p.officers.includes(advisor.id)&&targets.some(o=>o.int+1<advisor.int&&!s.books.includes(o.id));
  if(id==='reward:horse'&&!horse)return p.horses<1?'This province has no horse to give.':'All subordinates are already fully loyal.';
  if(id==='reward:writings'&&!writings)return 'An advisor here must exceed an eligible pupil by at least two intelligence points; each pupil can study once a month.';
  if(id==='reward:gold'&&!gold)return 'No eligible subordinate can gain loyalty with the available gold.';
  if(id==='reward'&&!gold&&!horse&&!writings)return 'No subordinate here can benefit from a reward this month.';
  return null;
 }
 if(id==='personnel'&&home)return null;
 if(['personnel:appoint','personnel:dismiss'].includes(id))return home?null:'Only the ruler may appoint or dismiss officers.';
 if(['spy:verify','spy:withdraw'].includes(id))return s.officers.some(o=>o.spyFor===r.id&&!o.dead&&o.prisonerOf===undefined)?null:'There is no deployed spy to command.';
 if(id==='spy'&&home&&s.officers.some(o=>o.spyFor===r.id&&!o.dead&&o.prisonerOf===undefined))return null;
 if(none)return none;
 if(id==='military:fort')return p.gold<100?'Building a fort requires 100 gold.':null;
 if(['develop','flood'].includes(id)&&p.gold<1)return 'This province has no gold to spend.';
 if(id==='relief'&&p.food<1)return 'This province has no food to give.';
 if(['move','war'].includes(id)){
  const neighbors=p.neighbors.map(id=>g.province(id));
  if(id==='move'&&!neighbors.some(q=>[255,r.id].includes(q.owner)&&!s.wars.some(b=>b.target===q.id)))return 'No adjacent friendly or empty province is available.';
  if(id==='war'){
   if(!neighbors.some(q=>![255,r.id].includes(q.owner)&&!r.alliances.includes(q.owner)))return 'There is no adjacent enemy province you can invade.';
   if(p.officers.length<2||!available.some(id=>g.officer(id).soldiers>0))return 'Choose an available army and leave at least one general to govern.';
   if(p.food<1)return 'This province has no food to take to battle.';
  }
 }
 if(id==='transport'&&!s.provinces.some(q=>q.id!==p.id&&q.owner===r.id&&g.route(p.id,q.id)))return 'There is no connected friendly province to send supplies to.';
 if(id.startsWith('trade:')){
  if(!p.merchant)return 'No merchant is visiting this province this month.';
  const mode=id.split(':')[1];
  if(mode==='sell'&&(p.food<p.ricePrice||p.gold>=30000))return 'There is insufficient food to sell or the gold store is full.';
  if(mode==='buy'&&(p.gold*p.ricePrice<2||p.food>=3000000))return 'There is insufficient gold to buy food or the food store is full.';
  if(mode==='horse'&&(p.gold<100||p.horses>=100))return 'Buying a horse requires 100 gold and room in the horse stock.';
  if(mode==='arms'&&(!p.gold||p.officers.every(id=>g.officer(id).weapons>9900)))return 'There is no gold or space for 100 weapons.';
 }
 if(['enlist','military:hire'].includes(id)&&hireCapacity(g,p)<1)return 'Population, gold, food or army capacity is insufficient to hire 100 men.';
 if(['train','military:train'].includes(id))return !p.officers.some(id=>g.officer(id).soldiers)?'This province has no soldiers to train.':p.officers.every(id=>g.officer(id).training===100)?'The army is already fully trained.':null;
 if(id==='personnel:appoint'||id==='personnel:dismiss'){if(!home)return 'Only the ruler may appoint or dismiss officers.';}
 if(id==='spy:infiltrate'&&!available.some(id=>id!==r.leader&&g.officer(id).loyalty===100))return 'Infiltration needs an available subordinate with loyalty 100.';
 if(id==='spy:rival'&&available.length<2)return 'Rival tigers requires two different available messengers.';
 return null;
}
