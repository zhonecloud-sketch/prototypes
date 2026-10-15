import {canAdvise,ADVICE_UNAVAILABLE} from './monthly-advice.mjs?v=56';
import {provinceLabel} from './province-choice.mjs?v=56';
import {enhanceNumericControls,enhanceTextControls} from './numeric-controls.mjs?v=56';
import {recruitMethodChance} from './fidelity-orders.mjs?v=56';
import {portraitFrame} from './portraits.mjs?v=56';
import {missionChance,spyChance} from './province-rules.mjs?v=60';
import {hireCapacity} from './province-rules.mjs?v=60';
import {warProvisions} from './war-provisions.mjs?v=56';
import {trainingGain} from './native-combat.mjs?v=56';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function relevantAttributes(purpose=''){
 if(/governor/i.test(purpose))return ['loyalty','charm','int','war'];
 if(/train|hire|reassign|invasion|commander|challenge|battle|retreat/i.test(purpose))return ['war','training','soldiers','weapons'];
 if(/recruit|diplom|reward|give|gift|marriage|alliance|threat/i.test(purpose))return ['charm','loyalty','int'];
 if(/cultiv|flood|spy|search|forged|bribe|advisor/i.test(purpose))return ['int','charm','war'];
 return ['int','war','charm'];
}
const labels={int:'INT',war:'WAR',charm:'CHA',loyalty:'LOY',training:'TRAIN',soldiers:'MEN',weapons:'WEAPONS'};
// Find the least expenditure giving the best capped result in one order.
// Exhaustive integer evaluation also respects the native Give byte arithmetic.
export function bestOrderSpend(g,purpose,officer){
 const p=g.province(g.s.selected),o=g.officer(Number(officer)),key=/give|relief/i.test(purpose)?'relief':/cultiv|develop/i.test(purpose)?'develop':/flood/i.test(purpose)?'flood':'reward',max=Math.max(0,Math.min(key==='relief'?10000:100,key==='relief'?p.food:p.gold));
 let amount=0,gain=0;for(let n=1;n<=max;n++){const next=g.preview(key,p.id,o.id,n);if(next>gain){amount=n;gain=next;}}if(key==='reward'&&amount===0&&max>0&&o.loyalty<100)amount=1;return {amount,gain,max,key};
}
export function generalStats(o,purpose=''){
 const attrs=[...new Set([...relevantAttributes(purpose),'int','war','charm','loyalty','training','soldiers','weapons'])];
 return attrs.map(key=>`<span class="${relevantAttributes(purpose).includes(key)?'relevant-stat':''}">${labels[key]} <b>${Number(o[key]||0).toLocaleString('en-GB')}</b></span>`).join('');
}
export function orderInsight(g,purpose,officer,data={}){
 if(!g||officer===undefined)return '';const p=g.province(g.s.selected),r=g.ruler(p.owner===g.s.player?p.owner:g.s.player),advisor=r?.advisor===null?null:g.s.officers.find(o=>o.id===r?.advisor);
 if(!advisor||!p.officers.includes(advisor.id)||advisor.dead)return '';
 if(!canAdvise(g.s,r,advisor,purpose,data))return `<aside class="advisor-insight" role="status"><strong>${esc(advisor.name)} · INT ${advisor.int}</strong><span>${ADVICE_UNAVAILABLE}</span></aside>`;
 const o=g.officer(Number(officer));let chance=null,effect='';
 if(/^recruit/i.test(purpose)&&data.target!==undefined)chance=data.method?recruitMethodChance(g,p,o,g.officer(Number(data.target)),data.method):g.recruitChance(p,o,g.officer(Number(data.target)));
 else if(/search/i.test(purpose))chance=Math.max(0,Math.floor(o.int/3)+Math.floor(o.charm/2)-10);
 else if(/governor/i.test(purpose)){effect=`${o.name} · LOY ${o.loyalty}, CHA ${o.charm}, INT ${o.int}, WAR ${o.war}. ${o.loyalty<60?'High defection/rebellion risk: reward this general before entrusting the province.':o.loyalty<90?'Loyalty is below 90; enemy persuasion remains a concern. Consider a reward.':'Strong loyalty reduces concern about enemy persuasion, but does not guarantee loyalty.'} ${o.charm>=80?'Strong CHA supports rewards and recruitment.':'CHA limits the effectiveness of rewards and recruitment.'} ${o.int>=80?'Strong INT supports development and flood control.':'Lower INT limits development and flood control.'} ${o.soldiers<1000?'Few troops remain under this candidate; the province may be vulnerable to attack.':''} ${o.sick||o.injured?'This candidate is recovering and cannot act yet.':o.acted?'This candidate has already acted this month.':''}`;}
 else if(/reward|writings/i.test(purpose)){
  const best=bestOrderSpend(g,purpose,o.id),amount=Number(data.amount??best.amount),governor=g.officer(p.governor),horse=/horse/i.test(purpose),writings=/writings/i.test(purpose);
  if(o.id===r.leader)effect='The ruler cannot reward themselves.';
  else if(writings)effect=o.int+1>=advisor.int?'The recipient needs at least two fewer INT points than me.':`Writings raise ${o.name}’s INT ${o.int} → ${o.int+1}. No gold or inventory book is consumed; loyalty is unchanged.`;
  else if(o.loyalty===100)effect=`${o.name} already has loyalty 100. Use no gold or horse; choose another general. Writings improve INT rather than loyalty.`;
  else if(horse&&p.horses<1)effect='There is no horse in this province to give.';
  else {const gain=Math.floor(governor.charm*(horse?100:amount)/400),low=Math.min(100-o.loyalty,gain),high=Math.min(100-o.loyalty,gain+1),maximum=Math.min(100,o.loyalty+best.gain+1);effect=`${o.name}’s loyalty ${o.loyalty} → ${o.loyalty+low}–${o.loyalty+high} (+${low}–${high}). ${horse?'Uses one horse; no gold is consumed.':`Costs ${amount} gold. Best affordable result this order: loyalty ${o.loyalty+best.gain}–${maximum}, using ${best.amount||Math.min(1,best.max)} gold${best.gain===0?' (base gain is zero; a +1 random bonus is possible)':''}. ${amount>best.amount&&best.amount>0?'Use the smaller recommended amount for the same capped base gain.':''} ${p.horses>0?'One horse is an alternative worth a 100-gold reward; this gift raises loyalty only.':''}`} Loyalty gains use governor CHA ${governor.charm}; the bonus is random.`;}
 }
 else if(/cultiv|flood/i.test(purpose)){const best=bestOrderSpend(g,purpose,o.id),amount=Number(data.amount??best.amount),field=best.key==='develop'?'land':'flood';effect=`${field==='land'?'Land development':'Flood protection'} ${p[field]} → ${p[field]+g.preview(best.key,p.id,o.id,amount)}. Cost: ${amount} gold. Best affordable result this order: ${p[field]+best.gain}, using ${best.amount} gold. INT ${o.int} and CHA ${o.charm} affect this order.${p[field]===100?' Already at maximum; spend nothing and choose another order.':amount>best.amount?' A smaller amount achieves the same maximum improvement.':''}`;}
 else if(/give|relief/i.test(purpose)){const best=bestOrderSpend(g,purpose,o.id),amount=Number(data.amount??best.amount),gain=g.preview('relief',p.id,o.id,amount);effect=`Popular loyalty ${p.loyalty} → ${p.loyalty+gain} (+${gain}). Costs ${amount.toLocaleString()} food. Best affordable result this order under ${o.name}: loyalty ${p.loyalty+best.gain}, using ${best.amount.toLocaleString()} food.${p.loyalty===100?' Already at maximum; give no food.':best.gain===0?' No affordable amount improves loyalty; save the food.':amount>best.amount?' Use the smaller recommended amount for the same maximum loyalty.':''}`;}
 else if(/fort/i.test(purpose))effect='Choose an empty plain or hill hex. Building costs 100 gold and uses this general’s monthly action.';
 else if(/hire/i.test(purpose)){const hundreds=Number(data.hundreds??1);effect=`${hundreds*100} recruits cost ${hundreds*10} gold and ${hundreds*100} food. Current capacity: ${hireCapacity(g,p)} hundreds. The hiring general’s abilities do not change recruitment capacity or cost. Allocate all recruited men before leaving.`;}
 else if(/reassign/i.test(purpose))effect='Reassignment conserves soldiers. Unallocated men will be disbanded only after confirmation.';
 else if(/war|invasion/i.test(purpose)&&data.officers){const men=data.officers.reduce((n,id)=>n+g.officer(id).soldiers,0),stores=warProvisions(men,Number(data.food??0)),enemy=g.province(Number(data.target)),hostile=enemy.officers.reduce((n,id)=>n+g.officer(id).soldiers,0);effect=`${men.toLocaleString()} men face ${hostile.toLocaleString()} defenders. ${stores.days<30?'Take more food for a full month.':'Food covers a full month at this strength.'} Terrain, training and enemy reserves can change the outcome.`;}
 else if(/train/i.test(purpose)){const armies=p.officers.map(id=>g.officer(id)),gain=trainingGain(o,armies);effect=armies.every(v=>v.training===100)?'Every army is already trained to 100; choose another order.':`Training increases by up to ${gain}, capped at 100 for each army. Already fully trained armies do not reduce the gain.`;}
 else if(/diplom/i.test(purpose)&&data.target!==undefined){const mode=purpose.toLowerCase().split('·').at(-1).trim(),map={'joint invasion':'joint','cancel alliance':'cancel','threaten':'threat'};const target=g.ruler(Number(data.target));if(target&&mode!=='cancel alliance')chance=mode==='gift'?100:missionChance(g,p,o,target,map[mode]||mode);}
 else if(/spy/i.test(purpose)){const mode=({'infiltrate':'infiltrate','rival tigers':'rival','tiger and wolf':'wolf','betrayal':'betrayal','forged letter':'forged'})[purpose.toLowerCase().split('·').at(-1).trim()];if(mode==='infiltrate')chance=100;else if(data.target!==undefined){if(mode==='rival'){const a=g.ruler(Number(data.target)),b=g.ruler(Number(data.other)),second=g.s.officers[Number(data.second)];if(a&&b&&second)chance=spyChance(g,o,a,mode,second,b);else effect='Choose both messengers to assess the rival tigers plot.';}else{const target=g.s.officers[Number(data.target)];if(target)chance=spyChance(g,o,target,mode);}}else effect='Choose a target to assess the stratagem.';}
 else if(/move/i.test(purpose))effect=`Moving takes this general’s army and monthly action. Carry ${Number(data.gold??0).toLocaleString()} gold and ${Number(data.food??0).toLocaleString()} food. Keep a governor behind unless you intend to abandon the province.`;
 else if(/send|transport/i.test(purpose))effect='The escort stays here after delivery. Supplies need a connected route; a hostile interception may prevent delivery.';
 else if(/appoint/i.test(purpose))effect=/advisor/i.test(purpose)?`INT ${o.int}: ${o.int>=80?'qualified to serve as advisor':'at least 80 INT is required'}. Keep the advisor in the province where you need predictions.`:`${o.name} will govern the selected province; their CHA influences rewards and their abilities influence delegated orders.`;
 else if(/tax/i.test(purpose))effect='This consumes the governor’s action. Popular loyalty falls by 10 and ruler trust by 5. Extra tax is unavailable in July, August and September.';
 else if(/merch/i.test(purpose)){const amount=Number(data.amount??1);effect=data.mode==='buy'?`Buy ${amount.toLocaleString()} food for ${Math.floor(amount/p.ricePrice)+1} gold.`:data.mode==='sell'?`Sell ${amount.toLocaleString()} food for ${Math.floor(amount/p.ricePrice)} gold.`:data.mode==='horse'?`Buy ${amount} horses for ${amount*100} gold.`:data.mode==='arms'?`Buy ${Math.min(10000-g.officer(Number(data.recipient??o.id)).weapons,amount*100)} weapons for ${amount} gold. Native price: 100 weapons per gold, capped at 10,000; INT does not change it.`:`Current food price: ${p.ricePrice} food / gold. Choose a quantity to assess the trade.`;}
 else effect='The highlighted abilities belong to the selected general. I cannot reliably predict this order’s outcome.';
 if(chance!==null)effect=`Estimated ${Math.round(chance)}% chance of success. ${chance===100?'This estimates the mission result; eligibility and travel hazards are separate.':chance===0?'This target is protected or ineligible.':'Success is not guaranteed; the mission may fail.'}`;
 return `<aside class="advisor-insight" role="status"><strong>${esc(advisor.name)} · INT ${advisor.int}</strong><span>${esc(effect)}</span></aside>`;
}
export function enhanceControls(root,g){
 enhanceNumericControls(root);enhanceTextControls(root);
 for(const select of root.querySelectorAll('select')){
  if(select.dataset.themed==='true'||['duelInitiator','duelResponder'].includes(select.id)||select.id==='battleQuickUnit'&&select.closest('#deploymentDetails'))continue;select.dataset.themed='true';select.classList.add('native-choice');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
  const board=document.createElement('div');board.className='choice-board';board.setAttribute('role','group');board.setAttribute('aria-label',select.getAttribute('aria-label')||select.previousElementSibling?.textContent||'Choose');select.after(board);
  const purpose=select.dataset.purpose||document.getElementById('dialogTitle')?.textContent||select.getAttribute('aria-label')||'',officerIds=['officer','allocationOfficer','battleUnit','battleQuickUnit','inspectTarget','challengeTarget','bribeTarget','reinforceOfficer'];
  const cards=[];for(const option of select.options){
   if(option.value==='')continue; // Empty placeholders are prompts, not selectable actions.
   const btn=document.createElement('button');btn.type='button';btn.className='choice-tile';btn.dataset.value=option.value;btn.disabled=option.disabled||select.disabled;
   const locationId=option.dataset.province===undefined?null:Number(option.dataset.province),provinceId=option.dataset.officer!==undefined?null:option.dataset.province!==undefined?Number(option.dataset.province):(['enemyProvince','retreatProvince','spyProv','exileDestination','hudEntity'].includes(select.id)&& (select.id!=='hudEntity'||document.getElementById('hudKind')?.value==='province')?Number(option.value):null),province=g&&provinceId!==null?g.s.provinces.find(p=>p.id===provinceId):null;
   if(province){btn.dataset.province=province.id;const label=provinceLabel(g,province);btn.dataset.provinceSuffix=option.textContent.startsWith(label)?option.textContent.slice(label.length):'';option.textContent=label+btn.dataset.provinceSuffix;}
   let o=null;if(g&&!province){const id=Number(option.dataset.officer??option.value.split(':').at(-1));const candidate=g.s.officers.find(o=>o.id===id);if(option.dataset.officer!==undefined||officerIds.includes(select.id)||candidate&&option.textContent.startsWith(candidate.name))o=candidate;}
   if(o){btn.dataset.officer=o.id;btn.dataset.sortName=o.name;const location=locationId??g.s.provinces.find(p=>[...p.officers,...p.unclaimed].includes(o.id))?.id;if(location!==undefined&&location!==null)btn.dataset.location=location;const live=g.s.battle?.units.find(u=>u.id===o.id),frame=portraitFrame(o,g.s.year);btn.classList.add('general-choice');btn.innerHTML=`<canvas data-atlas="${frame.atlas}" data-cell="${frame.cell}" class="choice-portrait" role="img" aria-label="${esc(o.name)}"></canvas><span class="choice-copy"><strong>${esc(option.textContent)}</strong><span class="general-stats">${generalStats({...o,...live},purpose)}</span></span>`;}
   else btn.textContent=option.textContent;
   const sync=()=>{for(const card of cards){const chosen=card.dataset.value===select.value;card.classList.toggle('chosen',chosen);card.setAttribute('aria-pressed',String(chosen));}};
   btn.onclick=()=>{select.value=option.value;sync();select.dispatchEvent(new Event('change',{bubbles:true}));};board.append(btn);cards.push(btn);
  }
  const sync=()=>{for(const card of cards){const chosen=card.dataset.value===select.value;card.classList.toggle('chosen',chosen);card.setAttribute('aria-pressed',String(chosen));card.disabled=select.disabled||select.options[Array.from(select.options).findIndex(o=>o.value===card.dataset.value)]?.disabled;}};
  select.addEventListener('change',sync);sync();
  const nameOrder=(a,b)=>(a.dataset.sortName||a.textContent).localeCompare(b.dataset.sortName||b.textContent,'en',{sensitivity:'base'})||Number(a.dataset.value)-Number(b.dataset.value);
  const provinceOrder=(a,b,key='province')=>{const pa=g.s.provinces.find(p=>p.id===Number(a.dataset[key])),pb=g.s.provinces.find(p=>p.id===Number(b.dataset[key]));return !pa?-1:!pb?1:pa.name.localeCompare(pb.name,'en')||nameOrder(a,b);};
  if(cards.some(card=>card.dataset.officer!==undefined)){
   cards.sort(nameOrder);for(const card of cards)board.append(card);
   if(cards.length>18||select.id==='orderValue'&&cards.some(card=>card.dataset.location!==undefined)){
    const filter=document.createElement('div');filter.className='choice-initials';filter.setAttribute('role','group');filter.setAttribute('aria-label','Filter generals or order by province');
    for(const [label,pattern]of [['All',null],['A–F',/^[a-f]/i],['G–L',/^[g-l]/i],['M–R',/^[m-r]/i],['S–Z',/^[s-z]/i],['#',null]]){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>{cards.sort(label==='#'?(a,b)=>provinceOrder(a,b,'location'):nameOrder);for(const card of cards){card.hidden=pattern?!pattern.test(card.dataset.sortName||''):false;board.append(card);}for(const other of filter.children)other.setAttribute('aria-pressed',String(other===button));};filter.append(button);}board.before(filter);filter.children[0].click();
   }
  }else if(cards.some(card=>card.dataset.province!==undefined)){
   const modes=document.createElement('div');modes.className='choice-initials';modes.setAttribute('role','group');modes.setAttribute('aria-label','Province labels; both ordered by name');
   for(const mode of ['A–Z','#']){const button=document.createElement('button');button.type='button';button.textContent=mode;button.onclick=()=>{cards.sort(provinceOrder);for(const card of cards){const q=g.s.provinces.find(p=>p.id===Number(card.dataset.province));if(q)card.textContent=provinceLabel(g,q,mode==='A–Z')+(card.dataset.provinceSuffix||'');card.hidden=false;board.append(card);}for(const other of modes.children)other.setAttribute('aria-pressed',String(other===button));};modes.append(button);}board.before(modes);modes.children[1].click();
  }
 }
}
