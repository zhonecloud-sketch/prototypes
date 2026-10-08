import {enhanceNumericControls,enhanceTextControls} from './numeric-controls.mjs?v=17';
import {recruitMethodChance} from './fidelity-orders.mjs?v=17';
import {portraitFrame} from './portraits.mjs?v=17';
import {missionChance,spyChance} from './province-rules.mjs?v=17';
import {hireCapacity} from './province-rules.mjs?v=17';
import {warProvisions} from './war-provisions.mjs?v=17';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function relevantAttributes(purpose=''){
 if(/train|hire|reassign|invasion|commander|challenge|battle|retreat/i.test(purpose))return ['war','training','soldiers','weapons'];
 if(/recruit|diplom|reward|give|gift|marriage|alliance|threat/i.test(purpose))return ['charm','loyalty','int'];
 if(/cultiv|flood|spy|search|forged|bribe|advisor/i.test(purpose))return ['int','charm','war'];
 return ['int','war','charm'];
}
const labels={int:'INT',war:'WAR',charm:'CHA',loyalty:'LOY',training:'TRAIN',soldiers:'MEN',weapons:'WEAPONS'};
export function generalStats(o,purpose=''){
 const attrs=[...new Set([...relevantAttributes(purpose),'int','war','charm','loyalty','training','soldiers','weapons'])];
 return attrs.map(key=>`<span class="${relevantAttributes(purpose).includes(key)?'relevant-stat':''}">${labels[key]} <b>${Number(o[key]||0).toLocaleString('en-GB')}</b></span>`).join('');
}
export function orderInsight(g,purpose,officer,data={}){
 if(!g||officer===undefined)return '';const p=g.province(g.s.selected),r=g.ruler(p.owner===g.s.player?p.owner:g.s.player),advisor=r?.advisor===null?null:g.s.officers.find(o=>o.id===r?.advisor);
 if(!advisor||advisor.int<80||!p.officers.includes(advisor.id)||advisor.dead)return '';
 const o=g.officer(Number(officer));let chance=null,effect='';
 if(/^recruit/i.test(purpose)&&data.target!==undefined)chance=data.method?recruitMethodChance(g,p,o,g.officer(Number(data.target)),data.method):g.recruitChance(p,o,g.officer(Number(data.target)));
 else if(/search/i.test(purpose))chance=Math.max(0,Math.floor(o.int/3)+Math.floor(o.charm/2)-10);
 else if(/reward|writings/i.test(purpose)){
  const amount=Number(data.amount??1),governor=g.officer(p.governor),horse=/horse/i.test(purpose),writings=/writings/i.test(purpose);
  if(o.id===r.leader)effect='The ruler cannot reward themselves.';
  else if(writings)effect=o.int+1>=advisor.int?'The recipient needs at least two fewer INT points than me.':g.s.books.includes(o.id)?'This general has already studied this month.':`Writings raise ${o.name}’s INT ${o.int} → ${o.int+1}. Cost: ${amount} gold; loyalty is unchanged.`;
  else if(o.loyalty===100)effect=`${o.name} is fully loyal. Save the gold for another general.`;
  else if(horse&&p.horses<1)effect='There is no horse in this province to give.';
  else {const gain=Math.floor(governor.charm*(horse?100:amount)/400),low=Math.min(100-o.loyalty,gain),high=Math.min(100-o.loyalty,gain+1),minimum=Math.ceil(400/Math.max(1,governor.charm));effect=!horse&&gain===0?`This amount cannot raise loyalty. Offer at least ${minimum} gold (governor CHA ${governor.charm}).`:`${o.name}’s loyalty ${o.loyalty} → ${o.loyalty+low}–${o.loyalty+high} (+${low}–${high}). ${horse?'Uses one horse and ':''}Costs ${amount} gold. ${o.loyalty<60?'Rewarding this general should be a priority.':o.loyalty>=90?'A small reward should suffice.':'This reward will improve retention.'}`;}
 }
 else if(/cultiv|flood/i.test(purpose)){const key=/cultiv/i.test(purpose)?'develop':'flood',amount=Number(data.amount??Math.min(100,p.gold));effect=`Expected improvement: +${g.preview(key,p.id,o.id,amount)}. Cost: ${amount} gold.${p[key==='develop'?'land':'flood']===100?' This attribute is already at its maximum.':''}`;}
 else if(/give|relief/i.test(purpose)){const amount=Number(data.amount??1),gain=g.preview('relief',p.id,o.id,amount);effect=`Popular loyalty ${p.loyalty} → ${p.loyalty+gain} (+${gain}). Costs ${amount.toLocaleString()} food.${gain===0?' Increase the food amount to improve loyalty.':''}`;}
 else if(/hire/i.test(purpose)){const hundreds=Number(data.hundreds??1);effect=`${hundreds*100} recruits cost ${hundreds*10} gold and ${hundreds*100} food. Current capacity: ${hireCapacity(g,p)} hundreds. Allocate all recruited men before leaving.`;}
 else if(/reassign/i.test(purpose))effect='Reassignment conserves soldiers. Unallocated men will be disbanded only after confirmation.';
 else if(/war|invasion/i.test(purpose)&&data.officers){const men=data.officers.reduce((n,id)=>n+g.officer(id).soldiers,0),stores=warProvisions(men,Number(data.food??0)),enemy=g.province(Number(data.target)),hostile=enemy.officers.reduce((n,id)=>n+g.officer(id).soldiers,0);effect=`${men.toLocaleString()} men face ${hostile.toLocaleString()} defenders. ${stores.days<30?'Take more food for a full month.':'Food covers a full month at this strength.'} Terrain, training and enemy reserves can change the outcome.`;}
 else if(/train/i.test(purpose)){const hundreds=p.officers.reduce((n,id)=>n+g.officer(id).soldiers/100,0);effect=`Expected training gain: +${Math.floor(2*o.war/Math.floor(Math.sqrt(Math.floor(hundreds)+1)))}.`;}
 else if(/diplom/i.test(purpose)&&data.target!==undefined){const mode=purpose.toLowerCase().split('·').at(-1).trim(),map={'joint invasion':'joint','cancel alliance':'cancel','threaten':'threat'};const target=g.ruler(Number(data.target));if(target&&mode!=='cancel alliance')chance=mode==='gift'?100:missionChance(g,p,o,target,map[mode]||mode);}
 else if(/spy/i.test(purpose)){const mode=({'infiltrate':'infiltrate','rival tigers':'rival','tiger and wolf':'wolf','betrayal':'betrayal','forged letter':'forged'})[purpose.toLowerCase().split('·').at(-1).trim()];if(mode==='infiltrate')chance=100;else if(data.target!==undefined){if(mode==='rival'){const a=g.ruler(Number(data.target)),b=g.ruler(Number(data.other)),second=g.s.officers[Number(data.second)];if(a&&b&&second)chance=spyChance(g,o,a,mode,second,b);else effect='Choose both messengers to assess the rival tigers plot.';}else{const target=g.s.officers[Number(data.target)];if(target)chance=spyChance(g,o,target,mode);}}else effect='Choose a target to assess the stratagem.';}
 else if(/move/i.test(purpose))effect=`Moving takes this general’s army and monthly action. Carry ${Number(data.gold??0).toLocaleString()} gold and ${Number(data.food??0).toLocaleString()} food. Keep a governor behind unless you intend to abandon the province.`;
 else if(/send|transport/i.test(purpose))effect='The escort stays here after delivery. Supplies need a connected route; a hostile interception may prevent delivery.';
 else if(/appoint/i.test(purpose))effect=/advisor/i.test(purpose)?`INT ${o.int}: ${o.int>=80?'qualified to serve as advisor':'at least 80 INT is required'}. Keep the advisor in the province where you need predictions.`:`${o.name} will govern the selected province; their CHA influences rewards and their abilities influence delegated orders.`;
 else if(/tax/i.test(purpose))effect='This consumes the governor’s action. Popular loyalty falls by 10 and ruler trust by 5. Extra tax is unavailable in July, August and September.';
 else if(/merch/i.test(purpose)){const amount=Number(data.amount??1);effect=data.mode==='buy'?`Buy ${amount.toLocaleString()} food for ${Math.floor(amount/p.ricePrice)+1} gold.`:data.mode==='sell'?`Sell ${amount.toLocaleString()} food for ${Math.floor(amount/p.ricePrice)} gold.`:data.mode==='horse'?`Buy ${amount} horses for ${amount*100} gold.`:data.mode==='arms'?`Buy ${amount*100} weapons for ${amount} gold; the selected recipient gets the equipment.`:`Current food price: ${p.ricePrice} food / gold. Choose a quantity to assess the trade.`;}
 else effect='The highlighted abilities belong to the selected general. I cannot reliably predict this order’s outcome.';
 if(chance!==null)effect=`${chance>=70?'Favourable':chance>=45?'Uncertain':'Unfavourable'} · estimated ${Math.round(chance)}% chance. ${chance>=70?'I expect success.':chance<45?'I expect failure.':'The outcome is uncertain.'}`;
 return `<aside class="advisor-insight" role="status"><strong>${esc(advisor.name)} · INT ${advisor.int}</strong><span>${esc(effect)}</span></aside>`;
}
export function enhanceControls(root,g){
 enhanceNumericControls(root);enhanceTextControls(root);
 for(const select of root.querySelectorAll('select')){
  if(select.dataset.themed==='true')continue;select.dataset.themed='true';select.classList.add('native-choice');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
  const board=document.createElement('div');board.className='choice-board';board.setAttribute('role','group');board.setAttribute('aria-label',select.getAttribute('aria-label')||select.previousElementSibling?.textContent||'Choose');select.after(board);
  const purpose=select.dataset.purpose||document.getElementById('dialogTitle')?.textContent||select.getAttribute('aria-label')||'',officerIds=['officer','allocationOfficer','battleUnit','battleQuickUnit','inspectTarget','challengeTarget','bribeTarget','reinforceOfficer'];
  const cards=[];for(const option of select.options){
   const btn=document.createElement('button');btn.type='button';btn.className='choice-tile';btn.dataset.value=option.value;btn.disabled=option.disabled||select.disabled;
   let o=null;if(g){const id=Number(option.dataset.officer??option.value.split(':').at(-1));const candidate=g.s.officers.find(o=>o.id===id);if(option.dataset.officer!==undefined||officerIds.includes(select.id)||candidate&&option.textContent.startsWith(candidate.name))o=candidate;}
   if(o){const live=g.s.battle?.units.find(u=>u.id===o.id),frame=portraitFrame(o,g.s.year);btn.classList.add('general-choice');btn.innerHTML=`<canvas data-atlas="${frame.atlas}" data-cell="${frame.cell}" class="choice-portrait" role="img" aria-label="${esc(o.name)}"></canvas><span class="choice-copy"><strong>${esc(option.textContent)}</strong><span class="general-stats">${generalStats({...o,...live},purpose)}</span></span>`;}
   else btn.textContent=option.textContent;
   const sync=()=>{for(const card of cards){const chosen=card.dataset.value===select.value;card.classList.toggle('chosen',chosen);card.setAttribute('aria-pressed',String(chosen));}};
   btn.onclick=()=>{select.value=option.value;sync();select.dispatchEvent(new Event('change',{bubbles:true}));};board.append(btn);cards.push(btn);
  }
  const sync=()=>{for(const card of cards){const chosen=card.dataset.value===select.value;card.classList.toggle('chosen',chosen);card.setAttribute('aria-pressed',String(chosen));card.disabled=select.disabled||select.options[Array.from(select.options).findIndex(o=>o.value===card.dataset.value)]?.disabled;}};
  select.addEventListener('change',sync);sync();
  if(cards.length>18){const filter=document.createElement('div');filter.className='choice-initials';filter.setAttribute('role','group');filter.setAttribute('aria-label','Filter names by initial');for(const [label,pattern]of [['All',null],['A–F',/^[a-f]/i],['G–L',/^[g-l]/i],['M–R',/^[m-r]/i],['S–Z',/^[s-z]/i],['#',/^[^a-z]/i]]){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>{for(const card of cards){const text=card.querySelector('strong')?.textContent||card.textContent;card.hidden=pattern?!pattern.test(text.trim()):false;}for(const other of filter.children)other.setAttribute('aria-pressed',String(other===button));};filter.append(button);}board.before(filter);}
 }
}
