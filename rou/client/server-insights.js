import {account,accountRequest} from './account-api.js?v=20261020-public2';
import {MODEL} from './insights-model.js';
import {INSIGHTS_PASS} from './catalogue.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n),pct=n=>(n*100).toFixed(2)+'%',signed=n=>(n<0?'−':'+')+money(Math.abs(n));
const sourceName=s=>s==='server-rng'?'Live server RNG':s==='legacy'?'Earlier records · source unrecorded':'Recorded replay · '+s.slice(7,15);
const titles={empty:'Your record starts with a wager.',insufficient:'More evidence is needed.',ordinary:'Within expected variation.',advantage:'Advantage signal.',inverted:'Inverted-advantage signal.'};
function chart(points){
  if(!points.length)return '<p>Your first settled wager starts this chart.</p>';
  const values=points.flatMap(p=>[p.actual,p.expected]),lo=Math.min(0,...values),hi=Math.max(0,...values),range=hi-lo||1,x=i=>12+i/Math.max(1,points.length-1)*736,y=n=>160-(n-lo)/range*144;
  return `<svg viewBox="0 0 760 185" role="img" aria-label="Actual and expected net results"><polyline points="${points.map((p,i)=>`${x(i)},${y(p.expected)}`).join(' ')}" fill="none" stroke="#ba9f63" stroke-dasharray="5 5" stroke-width="2"/><polyline points="${points.map((p,i)=>`${x(i)},${y(p.actual)}`).join(' ')}" fill="none" stroke="#8ec8b1" stroke-width="3"/><text x="12" y="182" fill="#a9b9b0" font-size="11">Record start</text><text x="748" y="182" text-anchor="end" fill="#a9b9b0" font-size="11">Latest wager</text></svg>`;
}
function details(r){
  const e=r.evaluation;
  return `<section class="club-chart"><div class="club-section-heading"><h2>Your record, in perspective.</h2><span>— Actual &nbsp; ⋯ Expected</span></div>${chart(r.curve)}</section>
    <div class="club-detail-grid"><section class="club-data-card"><h2>The evidence</h2><dl><div><dt>Two-sided p-value</dt><dd>${e.p?.toExponential(4)||'—'}</dd></div><div><dt>False-alarm threshold</dt><dd>${e.alpha}</dd></div><div><dt>95% Bayesian interval</dt><dd>${e.interval?e.interval.map(pct).join(' – '):'—'}</dd></div><div><dt>Descriptive risk score</dt><dd>${r.riskScore?.toFixed(2)??'—'}</dd></div><div><dt>Largest drawdown</dt><dd>${money(r.drawdown)} chips</dd></div></dl></section>
    <section class="club-data-card"><h2>Your bet mix</h2>${r.mix.map(m=>`<div class="club-mix-row"><span>${m.coverage}-pocket bets</span><strong>${money(m.stake)} staked</strong><small>${signed(m.returned-m.stake)} net</small></div>`).join('')||'<p>No settled wagers yet.</p>'}</section></div>
    <details class="club-details"><summary>Wheel patterns · numbers, outside groups and sectors</summary><p>These describe distinct draws on which you wagered. Holm-adjusted p-values cover 53 categories at this look.</p><div class="club-table-scroll"><table><thead><tr><th>Pattern</th><th>Hits</th><th>Fair</th><th>Observed</th><th>Adjusted p</th></tr></thead><tbody>${r.patterns.map(p=>`<tr><td>${esc(p.name)}</td><td>${money(p.wins)}</td><td>${pct(p.p0)}</td><td>${p.n?pct(p.wins/p.n):'—'}</td><td>${p.adjustedP.toPrecision(3)}</td></tr>`).join('')}</tbody></table></div></details><button data-insight-report>Download analysis report</button>`;
}
export function createServerInsights(){
  let root=null,worker=null,generation=0,job=0,loading=false,cache=null,source=null,pockets=null,mode='monitor',result=null,premium=false,resetting=false,lastRecord='',retryTimer=null;
  const active=()=>root?.isConnected&&document.documentElement.classList.contains('account-open');
  function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function paint(){
    if(!active()||!result)return;
    const r=result,e=r.evaluation,progress=e.required?Math.min(100,e.n/e.required*100):0;
    root.innerHTML=`<div class="club-record-heading"><span>Server wagers since last reset <strong>${new Date(cache.resetAt).toLocaleString()}</strong></span><button data-insight-refresh>Refresh</button></div>
      <div class="club-analysis-controls"><label>Source<select data-insight-source>${(r.sources.length?r.sources:['server-rng']).map(s=>`<option value="${esc(s)}" ${s===r.sourceId?'selected':''}>${esc(sourceName(s))}</option>`).join('')}</select></label><label>Bet profile<select data-insight-cohort>${(r.groups.length?r.groups:[{pockets:18,n:0}]).map(g=>`<option value="${g.pockets}" ${g.pockets===Math.round(e.p0*37)?'selected':''}>${g.pockets}/37 profitable pockets · ${money(g.n)} rounds</option>`).join('')}</select></label><label>Evaluation<select data-insight-mode><option value="monitor" ${mode==='monitor'?'selected':''}>Monitor · α 0.001</option><option value="snapshot" ${mode==='snapshot'?'selected':''}>Single evaluation · α 0.05</option></select></label></div>
      <section class="club-verdict ${e.status}" aria-live="polite"><p class="club-eyebrow">YOUR PERSONAL RECORD · ${mode==='monitor'?'PER-CHECK MONITOR':'SINGLE EVALUATION'}</p><h2>${e.status==='empty'&&r.wagered?'No eligible win-rate sample.':titles[e.status]}</h2><p>${e.status==='advantage'?'Your profitable-round rate is unusually high in this record.':e.status==='inverted'?'Your profitable-round rate is unusually low in this record. This is the inverted-advantage signal.':e.status==='empty'?(r.wagered?'These portfolios have no probabilistic net win to test. Their stakes and returns remain in the financial totals.':'Settle a wager to start your personal sample.'):'A signal requires both the calculator’s sample-size target and a p-value below the selected threshold.'}</p>
      <div class="club-sample-values"><div><small>ELIGIBLE ROUNDS</small><strong>${money(e.n)}</strong></div><div><small>MODEL REQUIRED N</small><strong>${e.required?money(e.required):e.n?'No finite target*':'—'}</strong></div><div><small>FAIR / OBSERVED WIN RATE</small><strong>${e.n?pct(e.p0):'—'} / ${e.observed===null?'—':pct(e.observed)}</strong></div></div>
      <div class="club-sample-track" role="progressbar" aria-label="Sample relative to calculator requirement" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress}%"></span></div><p class="club-small">${e.required?`${money(e.remaining)} additional eligible rounds at the current observed rate.`:e.n?'*No finite target within the calculator’s supported range.':'No fixed sample minimum is imposed.'} Required N changes with the observed effect. Detection power: 80%.</p></section>
      <div class="club-metrics"><div><small>ACTUAL NET RESULT</small><strong>${signed(r.net)}</strong><span>returns minus all stakes</span></div><div><small>THEORETICAL EXPECTED NET</small><strong>${signed(r.expected)}</strong><span>for your actual bet portfolios</span></div><div><small>ABOVE / BELOW EXPECTATION</small><strong>${signed(r.difference)}</strong><span>actual minus expected</span></div></div>
      <p class="club-small">${money(r.wagered)} settled wagered rounds in this source · ${money(r.distinctDraws)} distinct draws · ${money(r.repeatDraws)} replay duplicates excluded from inference. Purchases and collectibles do not count as roulette profit.</p>
      ${premium?details(r):`<section class="club-unlock"><div><h2>A closer look at your play.</h2><p>Unlock your actual-versus-expected chart, uncertainty, bet mix and wheel patterns with a 30-day Insights pass.</p><p class="club-small">$${(INSIGHTS_PASS.cents/100).toFixed(2)} · Simulated payment · No automatic renewal</p></div><button class="account-primary" data-buy-pack="${INSIGHTS_PASS.id}">Get Insights</button></section>`}
      <details class="club-details"><summary>How this evaluation works</summary><p>The same Bias Calculator equations determine required sample size, two-sided significance and the Bayesian interval. One round is one payoff portfolio; different probabilities of a net win are kept separate. The fair probability includes roulette’s zero.</p><p>These are observed-record signals. They do not establish lasting luck, future positive expected value, or a benefit from reversing bets. Repeated checks and selecting sources or bet profiles can produce chance signals; monitoring is not lifetime error control. Earlier records with no saved source are shown separately; replay duplication cannot be reconstructed for those records.</p></details>
      <div class="account-actions"><button data-insight-export>Export my raw records</button><button data-insight-reset>Start new record…</button></div>${resetting?'<div class="account-note">Restart profit and analysis from now? Your wealth, collectibles and pass stay unchanged. Earlier records remain archived on the server.<div class="account-actions"><button data-insight-confirm>Confirm reset</button><button data-insight-cancel>Cancel</button></div></div>':''}<p class="account-note account-error" data-insight-error hidden role="status"></p>`;
  }
  function evaluate(){
    if(!active()||!cache)return;
    if(!worker){worker=new Worker(new URL('./insights-worker.js?v=20261022-rooms',import.meta.url),{type:'module'});worker.onmessage=({data})=>{if(!active()||data.id!==job)return;if(data.error){error(data.error);return;}result=data.result;source=result.sourceId;pockets=Math.round(result.evaluation.p0*37);paint();};worker.onerror=()=>error('The analysis worker could not start. Reload Insights to try again.');}
    worker.postMessage({id:++job,server:true,owner:cache.owner,epoch:cache.epoch,records:cache.records,options:{sourceId:source||(cache.records.length?cache.records[0].sourceId||'legacy':'server-rng'),pockets,alpha:mode==='monitor'?MODEL.monitorAlpha:MODEL.alpha,power:MODEL.power}});
  }
  function error(message){if(!active())return;const el=root.querySelector('[data-insight-error]');if(el){el.textContent=message;el.hidden=false;}else root.innerHTML=`<p class="account-note account-error" role="status">${esc(message)}</p><button data-insight-refresh>Retry</button>`;}
  async function refresh(){
    if(!active()||loading||!account.player)return;loading=true;const token=generation,p=account.player,identity=p.id+':'+p.profile.epoch;
    clearTimeout(retryTimer);
    if(cache?.identity!==identity){cache=null;source=null;pockets=null;result=null;root.innerHTML='<p role="status">Reading your settled server wagers…</p>';}
    let cursor=cache?.cursor||0,until=cache?.complete===false?cache.until:undefined,records=cache?.records.slice()||[],epoch=p.profile.epoch;
    try{
      do{const data=await accountRequest('insights-records',{epoch,cursor,...(until===undefined?{}:{until})});if(!active()||token!==generation)return;records.push(...data.records);until=data.until;premium=data.premium;cursor=data.cursor;
        cache={identity,owner:p.id,epoch,resetAt:data.resetAt,cursor,until,complete:!data.nextCursor,records};
        if(!data.nextCursor)break;if(!result)root.innerHTML=`<p role="status">Loaded ${money(records.length)} saved rounds. Reading the rest of your record…</p>`;
      }while(true);evaluate();
    }catch(e){if(token===generation){const limited=e.message.startsWith('Too many attempts');error(limited?`Loaded ${money(records.length)} saved rounds. The server paused requests; continuing automatically in one minute.`:e.message);if(limited)retryTimer=setTimeout(()=>{if(token===generation)void refresh();},60000);}}finally{if(token===generation)loading=false;}
  }
  function open(element){root=element;generation++;loading=false;refresh();}
  function close(){clearTimeout(retryTimer);root=null;generation++;job++;loading=false;resetting=false;}
  async function click(e){
    const b=e.target.closest('button');if(!b||!active())return;
    if(b.hasAttribute('data-insight-refresh')){try{await accountRequest('session');if(result)paint();await refresh();}catch(e){error(e.message);}}
    if(b.hasAttribute('data-insight-reset')){resetting=true;paint();}
    if(b.hasAttribute('data-insight-cancel')){resetting=false;paint();}
    if(b.hasAttribute('data-insight-confirm')){b.disabled=true;try{await accountRequest('reset-insights',{confirmation:'RESET'});cache=null;resetting=false;await refresh();}catch(e){error(e.message);b.disabled=false;}}
    if(b.hasAttribute('data-insight-export')&&cache)download('atelier-server-records.json',JSON.stringify({schema:1,epoch:cache.epoch,resetAt:cache.resetAt,records:cache.records},null,2),'application/json');
    if(b.hasAttribute('data-insight-report')&&premium&&result)download('atelier-insights.md',`# Atelier personal play report\n\nSince reset: ${new Date(cache.resetAt).toISOString()}\nSource: ${sourceName(source)}\nModel: ${MODEL.version}\n\nStatus: ${result.evaluation.status}\nEligible rounds: ${result.evaluation.n}\nRequired N: ${result.evaluation.required??'No finite target'}\nObserved win rate: ${result.evaluation.observed}\nFair win rate: ${result.evaluation.p0}\nTwo-sided p: ${result.evaluation.p}\nAlpha: ${result.evaluation.alpha}\nPower: ${MODEL.power}\nActual net: ${result.net}\nExpected net: ${result.expected}\nDifference: ${result.difference}\n\nA per-check description of this record; no promise of persistent luck or future profit. Repeated checks remain exploratory.\n`,'text/markdown');
  }
  function change(e){if(e.target.matches('[data-insight-source]')){source=e.target.value;pockets=null;}else if(e.target.matches('[data-insight-cohort]'))pockets=Number(e.target.value);else if(e.target.matches('[data-insight-mode]'))mode=e.target.value;else return;evaluate();}
  document.addEventListener('atelier-account',()=>{if(!active())return;const p=account.player,w=p?.profile.game?.wager?.record,k=p&&`${p.id}:${p.profile.epoch}:${w?.roomId||1}:${w?.roundId||0}:${p.profile.insightsUntil}`;if(k!==lastRecord){lastRecord=k;void refresh();}});
  return {open,close,click,change};
}
