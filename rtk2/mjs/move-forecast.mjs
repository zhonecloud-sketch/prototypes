import {canAdvise,ADVICE_UNAVAILABLE} from './monthly-advice.mjs?v=34';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function moveForecast(g,source,destination,ids){
 const officers=[...new Set([...destination.officers,...ids])].map(id=>g.officer(Number(id))),soldiers=officers.reduce((sum,o)=>sum+o.soldiers,0);
 const payroll=officers.length*g.rules.wagePerOfficer+Math.floor(soldiers/200),monthlyFood=Math.floor(soldiers/g.rules.troopFoodDivisor),months=(7-g.s.month+12)%12||12,food=monthlyFood*months;
 return {payroll,monthlyFood,months,food,goldNeeded:Math.max(0,payroll-destination.gold),foodNeeded:Math.max(0,food-destination.food)};
}
export function moveTeamInsight(g,source,destination,ids){
 const ruler=g.ruler(),advisor=ruler.advisor===null?null:g.officer(ruler.advisor);if(!advisor||!source.officers.includes(advisor.id)||advisor.dead)return '<p class="notice">No adviser is here. Review INT for land/dikes, CHA for relief/rewards, WAR for training and LOY for retention.</p>';
 const header=`<aside class="advisor-insight"><strong>${esc(advisor.name)} · INT ${advisor.int}</strong>`;
 if(!canAdvise(g.s,ruler,advisor,'Move'))return header+`<span>${ADVICE_UNAVAILABLE}</span></aside>`;
 const team=[...new Set([...destination.officers,...ids])].map(id=>g.officer(Number(id))),best=attribute=>team.length?[...team].sort((a,b)=>b[attribute]-a[attribute])[0]:null;
 let advice=`#${destination.id} · ${destination.name}: popular LOY ${destination.loyalty}, land ${destination.land}, flood protection ${destination.flood}. `;
 if(!team.length)advice+='Select generals to assess the proposed team.';
 else {const charm=best('charm'),intel=best('int'),war=best('war');advice+=`Best CHA: ${charm.name} (${charm.charm}) for relief/recruitment${destination.loyalty<60?'; popular loyalty needs attention':''}. Best INT: ${intel.name} (${intel.int}) for land and dikes${destination.land<60||destination.flood<60?'; development/protection needs attention':''}. Best WAR: ${war.name} (${war.war}) for training. ${team.some(o=>o.loyalty<60)?'Low-loyalty generals risk enemy persuasion; take gold for rewards. ':''}Reward gains use the destination governor’s CHA, not the highest CHA automatically. ${ids.includes(source.governor)&&source.officers.some(id=>!ids.includes(id))?'Choose a reliable governor for the province you leave behind.':''}`;}
 return header+`<span>${esc(advice)}</span></aside>`;
}
