import {recruitMethodChance} from './fidelity-orders.mjs';
import {portraitFrame} from './portraits.mjs';
import {missionChance,spyChance} from './province-rules.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function relevantAttributes(purpose=''){
 if(/train|hire|reassign|invasion|commander|challenge|battle|retreat/i.test(purpose))return ['war','training','soldiers'];
 if(/recruit|diplom|reward|give|gift|marriage|alliance|threat/i.test(purpose))return ['charm','loyalty','int'];
 if(/cultiv|flood|spy|search|forged|bribe|advisor/i.test(purpose))return ['int','charm','war'];
 return ['int','war','charm'];
}
const labels={int:'INT',war:'WAR',charm:'CHA',loyalty:'LOY',training:'TRAIN',soldiers:'MEN'};
export function generalStats(o,purpose=''){
 const attrs=[...new Set([...relevantAttributes(purpose),'int','war','charm','loyalty','training','soldiers'])];
 return attrs.map(key=>`<span class="${relevantAttributes(purpose).includes(key)?'relevant-stat':''}">${labels[key]} <b>${Number(o[key]||0).toLocaleString('en-GB')}</b></span>`).join('');
}
export function orderInsight(g,purpose,officer,data={}){
 if(!g||officer===undefined)return '';const p=g.province(g.s.selected),r=g.ruler(p.owner===g.s.player?p.owner:g.s.player),advisor=r?.advisor===null?null:g.s.officers.find(o=>o.id===r?.advisor);
 if(!advisor||advisor.int<80||!p.officers.includes(advisor.id)||advisor.dead)return '';
 const o=g.officer(Number(officer));let chance=null,effect='';
 if(/^recruit/i.test(purpose)&&data.target!==undefined)chance=data.method?recruitMethodChance(g,p,o,g.officer(Number(data.target)),data.method):g.recruitChance(p,o,g.officer(Number(data.target)));
 else if(/search/i.test(purpose))chance=Math.max(0,Math.floor(o.int/3)+Math.floor(o.charm/2)-10);
 else if(/cultiv|flood/i.test(purpose)){const key=/cultiv/i.test(purpose)?'develop':'flood',amount=Number(data.amount||Math.min(100,p.gold));effect=`Expected improvement: +${g.preview(key,p.id,o.id,amount)}.`;}
 else if(/train/i.test(purpose)){const hundreds=p.officers.reduce((n,id)=>n+g.officer(id).soldiers/100,0);effect=`Expected training gain: +${Math.floor(2*o.war/Math.floor(Math.sqrt(Math.floor(hundreds)+1)))}.`;}
 else if(/diplom/i.test(purpose)&&data.target!==undefined){const mode=purpose.toLowerCase().split('·').at(-1).trim(),map={'joint invasion':'joint','cancel alliance':'cancel','threaten':'threat'};const target=g.ruler(Number(data.target));if(target&&mode!=='cancel alliance')chance=mode==='gift'?100:missionChance(g,p,o,target,map[mode]||mode);}
 else if(/spy/i.test(purpose)){const mode=({'infiltrate':'infiltrate','rival tigers':'rival','tiger and wolf':'wolf','betrayal':'betrayal','forged letter':'forged'})[purpose.toLowerCase().split('·').at(-1).trim()];if(mode==='infiltrate')chance=100;else if(data.target!==undefined){if(mode==='rival'){const a=g.ruler(Number(data.target)),b=g.ruler(Number(data.other)),second=g.s.officers[Number(data.second)];if(a&&b&&second)chance=spyChance(g,o,a,mode,second,b);else effect='Choose both messengers to assess the rival tigers plot.';}else{const target=g.s.officers[Number(data.target)];if(target)chance=spyChance(g,o,target,mode);}}else effect='Choose a target to assess the stratagem.';}
 else effect='Compare the highlighted abilities before issuing the order.';
 if(chance!==null)effect=`${chance>=70?'Favourable':chance>=45?'Uncertain':'Unfavourable'} · estimated ${Math.round(chance)}% chance. ${chance>=70?'I expect success.':chance<45?'I expect failure.':'The outcome is uncertain.'}`;
 return `<aside class="advisor-insight" role="status"><strong>${esc(advisor.name)} · INT ${advisor.int}</strong><span>${esc(effect)}</span></aside>`;
}
export function enhanceControls(root,g){
 for(const select of root.querySelectorAll('select')){
  if(select.dataset.themed==='true')continue;select.dataset.themed='true';select.classList.add('native-choice');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
  const board=document.createElement('div');board.className='choice-board';board.setAttribute('role','group');board.setAttribute('aria-label',select.getAttribute('aria-label')||select.previousElementSibling?.textContent||'Choose');select.after(board);
  const purpose=select.dataset.purpose||document.getElementById('dialogTitle')?.textContent||select.getAttribute('aria-label')||'',officerIds=['officer','allocationOfficer','battleUnit','battleQuickUnit','inspectTarget','challengeTarget','bribeTarget','reinforceOfficer'];
  const cards=[];for(const option of select.options){
   const btn=document.createElement('button');btn.type='button';btn.className='choice-tile';btn.dataset.value=option.value;btn.disabled=option.disabled||select.disabled;
   let o=null;if(g){const id=Number(option.dataset.officer??option.value.split(':').at(-1));const candidate=g.s.officers.find(o=>o.id===id);if(option.dataset.officer!==undefined||officerIds.includes(select.id)||candidate&&option.textContent.startsWith(candidate.name))o=candidate;}
   if(o){const live=g.s.battle?.units.find(u=>u.id===o.id),frame=portraitFrame(o);btn.classList.add('general-choice');btn.innerHTML=`<canvas data-atlas="${frame.atlas}" data-cell="${frame.cell}" class="choice-portrait" role="img" aria-label="${esc(o.name)}"></canvas><span class="choice-copy"><strong>${esc(option.textContent)}</strong><span class="general-stats">${generalStats({...o,...live},purpose)}</span></span>`;}
   else btn.textContent=option.textContent;
   const sync=()=>{for(const card of cards){const chosen=card.dataset.value===select.value;card.classList.toggle('chosen',chosen);card.setAttribute('aria-pressed',String(chosen));}};
   btn.onclick=()=>{select.value=option.value;sync();select.dispatchEvent(new Event('change',{bubbles:true}));};board.append(btn);cards.push(btn);
  }
  const sync=()=>{for(const card of cards){const chosen=card.dataset.value===select.value;card.classList.toggle('chosen',chosen);card.setAttribute('aria-pressed',String(chosen));card.disabled=select.disabled||select.options[Array.from(select.options).findIndex(o=>o.value===card.dataset.value)]?.disabled;}};
  select.addEventListener('change',sync);sync();
  if(cards.length>18){const filter=document.createElement('input');filter.type='search';filter.className='choice-search';filter.placeholder='Find by name or number';filter.setAttribute('aria-label','Filter choices');board.before(filter);filter.oninput=()=>{for(const card of cards)card.hidden=!card.textContent.toLowerCase().includes(filter.value.toLowerCase());};}
 }
}
