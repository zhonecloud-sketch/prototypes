import { COLLECTIBLES, CHIP_PACKS, INSIGHTS_PASS, collectionWealth } from './catalogue.js';
import { openMultiplayer } from './multiplayer.js?v=20261022-perf';
import { makeRecord, MODEL } from './insights-model.js?v=20261023-insights-gaps';
import { saveRecord, readRecords } from './insights-records.js';

const money = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const usd = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents/100);
const pct = n => `${(100*n).toFixed(2)}%`;
const reviewDescription = mode => mode === 'monitor' ? 'Choose ongoing review for regular checks. Alpha 0.001: imagine 1,000 separate sets of results from a fair wheel, each checked once. Roughly one set could look unusually lucky or unlucky just by chance and raise a false alert.' : 'Choose a one-time check for a single look at your results. Alpha 0.05: imagine 20 separate sets of results from a fair wheel, each checked once. Roughly one set could look unusually lucky or unlucky just by chance and raise a false alert.';
const signed = n => `${n < 0 ? '−' : '+'}${money(Math.abs(n))}`;
const signedDecimal = n => `${n < 0 ? '−' : '+'}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Math.abs(n))}`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const date = n => new Date(n).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const compact = n => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export function mountClub(api) {
  const dialog = document.createElement('dialog');
  dialog.id = 'clubDialog'; dialog.setAttribute('aria-labelledby', 'clubTitle');
  document.body.append(dialog);
  const confirmation = document.createElement('dialog');
  confirmation.id = 'clubConfirm'; confirmation.setAttribute('aria-labelledby', 'clubConfirmTitle');
  document.body.append(confirmation);
  let page = 'collection', tab = 'collection', onlyOwned = false, sourceId = 'rng', pockets = 18;
  let mode = 'monitor', power = MODEL.power, worker, requestId = 0, latest = null, recordError = '';
  let pendingWrite = Promise.resolve(), busy = false;
  const feedHashes = new WeakMap();
  const profile = () => api.profile();
  const user = () => api.user();
  const premium = () => (profile()?.insightsUntil || 0) > Date.now();
  const status = message => {
    const el = dialog.querySelector('#clubNotice');
    if (el) { el.textContent = message; el.hidden = !message; }
  };

  function frame(title, subtitle, content) {
    dialog.innerHTML = `<div class="club-shell">
      <header class="club-header"><button class="club-back" data-club="close">${page === 'insights' && user() ? '← Game room' : '← Back'}</button><span class="club-wordmark">ATELIER</span><span class="page-tools"><button data-wide-view>Wide view ↗</button><button data-launch-menu aria-label="Menu — return to launch" title="Menu">⚙</button></span><button class="club-wallet" data-club="chips"><span data-club-wallet>${money(api.balance())}</span> <small>PLAY CHIPS</small> <b>+</b></button></header>
      <main class="club-main"><div class="club-heading"><div><p class="club-eyebrow">${page === 'insights' ? 'YOUR PERSONAL RECORD' : 'THE ATELIER COLLECTION'}</p><h1 id="clubTitle">${title}</h1><p>${subtitle}</p></div><span class="club-preview-label">LOCAL PREVIEW</span></div>
      <p id="clubNotice" class="club-notice" role="status" hidden></p>${content}
      <footer class="club-footer">Virtual collectibles · No cash-out or transfers<br>Collection saved with your bankroll. Personal analysis is stored on this device.</footer></main></div>`;
  }

  function shop() {
    page = 'collection';
    const owned = new Set(profile()?.items.map(i => i.id) || []);
    const wealth = collectionWealth(profile(), api.balance());
    const nav = `<nav class="club-tabs" aria-label="Shop sections"><button data-club="collection" aria-pressed="${tab === 'collection'}">Collection</button><button data-club="chips" aria-pressed="${tab === 'chips'}">Chips</button></nav>`;
    let content;
    if (tab === 'collection') {
      const items = COLLECTIBLES.filter(c => !onlyOwned || owned.has(c.id));
      content = `${nav}<div class="club-collection-toolbar"><span>${wealth.copies} items · ${owned.size}/${COLLECTIBLES.length} styles · Wealth ${compact(wealth.total)} chips</span><button data-club="owned" aria-pressed="${onlyOwned}">${onlyOwned ? 'Show all collectibles' : 'My collection'}</button></div>
        <div class="club-grid">${items.map(item => `<article class="club-item">
          <button class="club-art" data-club="detail" data-id="${item.id}" aria-label="View ${item.name}"><img src="${item.image}" alt="${item.name}" width="1536" height="1024" loading="lazy" decoding="async">${owned.has(item.id) ? `<span class="club-owned">OWNED ×${profile().items.filter(i => i.id === item.id).length}</span>` : ''}</button>
          <div class="club-item-copy"><p class="club-eyebrow">${item.category}</p><h2>${item.name}</h2><p>${item.description}</p><div class="club-item-bottom"><span>${compact(item.price)} <small>CHIPS</small></span><button data-club="detail" data-id="${item.id}">${owned.has(item.id) ? 'View / buy another ↗' : 'View item ↗'}</button></div></div></article>`).join('')}</div>
        ${!items.length ? '<div class="club-empty"><h2>Your collection starts here.</h2><p>Choose a piece you would like to make your own.</p><button class="club-primary" data-club="owned">Explore the collection</button></div>' : ''}`;
    } else {
      content = `${nav}<div class="club-banner"><div><p class="club-eyebrow">A LITTLE MORE ROOM TO PLAY</p><h2>Build your collection.</h2><p>Optional play-chip packs for the table and the things you love.</p></div><img src="assets/collectibles/watch.webp" alt="Gold and platinum luxury watch" width="1536" height="1024"></div>
        <p class="club-simulator-note">Log in to Multiplayer to purchase. Test payments are processed by the server; no real card details or money are used.</p>
        <div class="club-packs">${CHIP_PACKS.map((p, i) => `<article class="club-pack"><div class="club-chip-illustration" aria-hidden="true">${i+1}</div><h2>${compact(p.chips)}</h2><p>play chips</p><strong>${usd(p.cents)}</strong><button class="club-primary" data-club="checkout" data-id="${p.id}" >Log in to purchase</button></article>`).join('')}</div>
        <div class="club-insights-offer"><div><p class="club-eyebrow">A CLOSER LOOK AT YOUR PLAY</p><h2>Atelier Insights</h2><p>Your full record since reset. Understand your results, sample size and playing style.</p></div><button data-club="insights">Explore Insights →</button></div>
        <details class="club-details"><summary>Test order history</summary>${orders()}</details>`;
    }
    frame('A collection of your own.', 'Small details. Extraordinary destinations. All earned or collected with play chips.', content);
  }

  function orders() {
    const history = profile()?.orders || [];
    if (!history.length) return '<p>No test orders yet.</p>';
    return `<ul class="club-orders">${history.slice(-20).reverse().map(o => `<li><span>${escape(o.productId)}<small>${date(o.createdAt)} · ${escape(o.status)} · simulated</small></span><span>${usd(o.cents)}</span></li>`).join('')}</ul>`;
  }

  function confirm(title, text, actionText, action, image = null, extra = '') {
    confirmation.innerHTML = `<div class="club-confirm-content">${image ? `<img src="${image}" alt="" width="1536" height="1024">` : ''}<div><div class="page-tools"><button data-wide-view>Wide view ↗</button><button data-launch-menu aria-label="Menu — return to launch" title="Menu">⚙</button></div><p class="club-eyebrow">ATELIER</p><h2 id="clubConfirmTitle">${title}</h2><p>${text}</p>${extra}<p id="clubConfirmError" class="club-notice" hidden role="alert"></p><div class="club-confirm-actions"><button id="clubCancel">Back</button><button id="clubAccept" class="club-primary">${actionText}</button></div></div></div>`;
    confirmation.querySelector('#clubCancel').onclick = () => confirmation.close();
    confirmation.querySelector('#clubAccept').onclick = async () => {
      if (busy) return;
      busy = true; confirmation.querySelector('#clubAccept').disabled = true;
      try { await action(); confirmation.close(); }
      catch (error) { const el = confirmation.querySelector('#clubConfirmError'); el.hidden = false; el.textContent = error.message; }
      finally { busy = false; confirmation.querySelector('#clubAccept').disabled = false; }
    };
    confirmation.showModal();
  }

  function itemDetail(id) {
    const item = COLLECTIBLES.find(c => c.id === id);
    if (!item) return;
    const count = profile()?.items.filter(i => i.id === id).length || 0;
    confirm(item.name, `${item.description} ${money(item.price)} play chips per copy. ${count ? `You own ${count} on this solo profile. ` : ''}Log in to Multiplayer to buy copies for your server collection.`,
      'Open Multiplayer', () => openMultiplayer('collection'), item.image);
  }

  function checkout(id) {
    openMultiplayer(id === INSIGHTS_PASS.id ? 'insights' : 'chips');
  }

  function insights() {
    page = 'insights';
    const p = profile();
    frame('Understand your play.', 'Your results, their expected odds, and the strength of the evidence.',
      `<div class="club-record-heading"><span>Since last reset <strong>${p ? date(p.resetAt) : 'Start a record by entering the table'}</strong></span><button data-club="recent">Recent 222 spins ↗</button></div>
      <div class="club-analysis-controls"><label>Source<select id="clubSource"><option value="rng">Random draws · solo play</option></select></label><label>Bet profile<select id="clubCohort"><option value="18">18 profitable pockets / 37</option></select></label><label>Evaluation<select id="clubMode" aria-describedby="clubModeHelp"><option value="monitor" ${mode === 'monitor' ? 'selected' : ''}>Ongoing review · stricter</option><option value="snapshot" ${mode === 'snapshot' ? 'selected' : ''}>One-time check · more sensitive</option></select></label></div>
      <p class="club-small" id="clubModeHelp">${reviewDescription(mode)}</p>
      <div id="clubAnalysis" aria-live="polite"><div class="club-empty">${p ? 'Reading your current record…' : 'Enter as a guest or sign in to begin a personal record.'}</div></div>
      <details class="club-details"><summary>How this review works</summary><p>We compare how often your settled bets made a profit with the usual odds for those bets. An alert needs a win rate at least 5 percentage points above or below the usual odds, a long enough record, and clear statistical evidence. The round target uses this fixed 5-point difference.</p><label class="club-field">Statistical check’s detection goal (%)<input id="clubPower" type="number" min="1" max="99" step="1" value="${Math.round(power*100)}"></label><p>The round target is planned around a real, steady 5-point difference. At the default 80% goal, the statistical check aims to spot that difference in about 8 out of 10 separate records once enough rounds are counted; it could miss it in about 2 out of 10. An alert also needs your recorded win rate to reach the 5-point gap, so fewer records may raise an alert. This is not an 80% chance of winning or a guarantee about your record.</p><p>Alpha controls how cautious the check is about false alerts. At 0.001, the benchmark is roughly one false alert in 1,000 separate fair-wheel records checked once each. At 0.05, it is roughly one in 20. This does not mean a flagged conclusion has only a 1-in-1,000 chance of being wrong. Rechecking the same record or trying several bet profiles can produce more false alerts.</p><p>Each round counts once, even if you placed several bets. Bets with different chances of winning are reviewed separately. Repeated saved draws count once in the win-rate check; all settled stakes and returns still count in your financial totals.</p><p>A smaller observed gap does not raise an alert, even with a very long record. A gap of 10 percentage points or more is described as a “Very large difference”. That describes its size; it still needs the same sample-size and statistical checks before raising an alert. Past results do not predict future spins or promise future profit.</p></details>
      <div class="club-record-actions"><button data-club="export">Export my raw record</button><button data-club="reset" ${!p ? 'disabled' : ''}>Reset analysis record</button></div>`);
    dialog.querySelector('#clubMode').onchange = e => { mode = e.target.value; dialog.querySelector('#clubModeHelp').textContent = reviewDescription(mode); refreshAnalysis(); };
    dialog.querySelector('#clubSource').onchange = e => { sourceId = e.target.value; pockets = null; refreshAnalysis(); };
    dialog.querySelector('#clubCohort').onchange = e => { pockets = Number(e.target.value); refreshAnalysis(); };
    dialog.querySelector('#clubPower').onchange = e => {
      const value = Number(e.target.value)/100;
      if (!(value >= 0.01 && value <= 0.99)) { e.target.value = Math.round(power*100); return; }
      power = value; refreshAnalysis();
    };
    if (p) refreshAnalysis();
  }

  async function refreshAnalysis() {
    const owner = user()?.sub, epoch = profile()?.epoch, id = ++requestId;
    if (!owner || !epoch) return;
    try {
      await pendingWrite;
      const records = await readRecords(owner, epoch);
      if (id !== requestId || page !== 'insights' || !dialog.open || profile()?.epoch !== epoch) return;
      if (!worker) {
        worker = new Worker(new URL('./insights-worker.js?v=20261023-insights-gaps', import.meta.url), { type: 'module' });
        worker.onmessage = ({ data }) => {
          if (data.id !== requestId || page !== 'insights' || !dialog.open) return;
          if (data.error) { status(data.error); return; }
          latest = data.result; paintAnalysis(latest);
        };
        worker.onerror = () => status('The analysis worker could not start. Reload to try again.');
      }
      if (!records.some(r => r.sourceId === sourceId) && records.length) sourceId = records[0].sourceId;
      worker.postMessage({ id, records, options: { sourceId, pockets, alpha: mode === 'monitor' ? MODEL.monitorAlpha : MODEL.alpha, power } });
      if (recordError) status(recordError);
    } catch (error) { status(error.message); dialog.querySelector('#clubAnalysis').textContent = 'Analysis is unavailable until the saved record can be read.'; }
  }

  function chart(points) {
    if (!points.length) return '<div class="club-empty">Your first settled wager will start this chart.</div>';
    const values = points.flatMap(p => [p.actual, p.expected]), low = Math.min(0, ...values), high = Math.max(0, ...values), range = high-low || 1;
    const x = i => 18 + i/Math.max(1, points.length-1)*744, y = n => 174-(n-low)/range*148;
    return `<svg viewBox="0 0 780 210" role="img" aria-label="Actual and expected net result since reset"><line x1="18" y1="${y(0)}" x2="762" y2="${y(0)}" stroke="#ffffff20"/><polyline points="${points.map((p,i)=>`${x(i)},${y(p.expected)}`).join(' ')}" fill="none" stroke="#ba9f63" stroke-width="2" stroke-dasharray="5 5"/><polyline points="${points.map((p,i)=>`${x(i)},${y(p.actual)}`).join(' ')}" fill="none" stroke="#8ec8b1" stroke-width="3"/><text x="18" y="202" fill="#a9b9b0" font-size="11">Record start</text><text x="762" y="202" text-anchor="end" fill="#a9b9b0" font-size="11">Latest wager</text></svg>`;
  }

  function paintAnalysis(result) {
    const e = result.evaluation, p = profile();
    const sourceSelect = dialog.querySelector('#clubSource');
    const sources = result.sources.length ? result.sources : ['rng'];
    sourceSelect.innerHTML = sources.map(s => `<option value="${escape(s)}">${s === 'rng' ? 'Random draws · solo play' : `Live replay · ${escape(s.slice(7,15))}`}</option>`).join('');
    sourceSelect.value = result.sourceId;
    const cohort = dialog.querySelector('#clubCohort');
    cohort.innerHTML = (result.groups.length ? result.groups : [{pockets:18,n:0}]).map(g => `<option value="${g.pockets}">${g.pockets} profitable pockets / 37 · ${money(g.n)} rounds</option>`).join('');
    cohort.value = String(Math.round(e.p0*37)); pockets = Number(cohort.value);
    const titles = { empty: 'Your record starts with a settled bet.', insufficient: 'Not enough rounds to tell yet.', ordinary: 'No clear pattern stands out.', advantage: 'More wins than expected.', inverted: 'Fewer wins than expected.' };
    if (e.status === 'empty' && result.wagered) titles.empty = 'These bets have no win rate to compare.';
    if (e.n && !e.meetsEffectThreshold) titles.ordinary = 'Small difference from the usual odds.';
    const explanation = e.status === 'advantage' ? 'You had winning rounds more often than the usual odds suggest in this record. This doesn’t predict your next spin.' : e.status === 'inverted' ? 'You had winning rounds less often than the usual odds suggest in this record. This doesn’t predict your next spin.' : e.status === 'empty' ? (result.wagered ? 'These bet combinations have no win rate we can compare. Your stakes and returns still count in your totals.' : 'Your settled bets will appear here, beyond the recent-spin display.') : !e.meetsEffectThreshold ? 'Your win rate is less than 5 percentage points from the usual odds, so it does not meet the alert threshold. This does not prove the wheel is fair.' : e.status === 'ordinary' ? 'So far, these results don’t stand out from the usual ups and downs of roulette.' : 'We need more matching rounds before deciding whether this difference is unusual.';
    const progress = e.required ? Math.min(100, e.n/e.required*100) : 0;
    dialog.querySelector('#clubAnalysis').innerHTML = `<section class="club-verdict ${e.status}"><p class="club-eyebrow">YOUR PERSONAL RECORD · ${mode === 'monitor' ? 'ONGOING REVIEW' : 'ONE-TIME CHECK'}</p><h2>${titles[e.status]}</h2><p>${explanation}</p>
      ${e.veryLargeGap ? `<p class="club-small"><strong>Very large difference:</strong> Your win rate is at least 10 percentage points ${e.gap < 0 ? "below" : "above"} the usual odds. ${!e.ready ? "There aren’t enough rounds to raise an alert yet." : e.status === "advantage" || e.status === "inverted" ? "The sample-size and statistical checks also pass for this record." : "The statistical check does not support an alert yet."}</p>` : ""}
      <div class="club-sample-values"><div><small>ROUNDS COUNTED</small><strong>${money(e.n)}</strong></div><div><small>ROUND TARGET · 5-POINT GAP</small><strong>${e.required ? money(e.required) : e.n ? 'No estimate yet' : '—'}</strong></div><div><small>USUAL / YOUR WIN RATE</small><strong>${pct(e.p0)} / ${e.observed === null ? '—' : pct(e.observed)}</strong></div></div>
      <p class="club-small"><strong>5-point rule:</strong> An alert needs a win rate at least 5 percentage points above or below the usual odds, enough rounds, and clear statistical evidence.${e.n ? ` For these bets: ${[e.lowerTarget === null ? null : `${pct(e.lowerTarget)} or lower`, e.upperTarget === null ? null : `${pct(e.upperTarget)} or higher`].filter(Boolean).join(" / ")}. Your current gap: ${(Math.abs(e.gap)*100).toFixed(2)} points ${e.gap < 0 ? "below" : "above"} the usual odds.` : ""}</p>
      <div class="club-sample-track" role="progressbar" aria-label="Rounds counted compared with the fixed five-point target" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress}%"></span></div>
      <p class="club-small">${e.required ? (e.remaining ? `About ${money(e.remaining)} more matching rounds to reach the planned target.` : "Your record has reached the planned round target.") : "A round target will appear once there are settled bets to compare."} The target uses a fixed 5-point difference. It stays the same for the same bet profile and review settings.</p>
      <p class="club-small">${money(result.wagered)} total wagered rounds · ${money(result.distinctDraws)} distinct observed draws · since ${date(p.resetAt)}${result.repeatDraws ? ` · ${money(result.repeatDraws)} replay duplicates excluded from inference` : ''}</p></section>
      <div class="club-metrics"><div><small>NET RESULT</small><strong>${signed(result.net)}</strong><span>play chips</span></div><div><small>EXPECTED RESULT</small><strong>${signedDecimal(result.expected)}</strong><span>for your actual stakes</span></div><div><small>DIFFERENCE</small><strong>${signedDecimal(result.difference)}</strong><span>above or below expectation</span></div></div>
      ${premium() ? `<div class="club-paid-label">Insights preview active until ${date(p.insightsUntil)}</div><section class="club-chart"><div class="club-section-heading"><h2>Your record, in perspective.</h2><span>— Actual &nbsp; ⋯ Expected</span></div>${chart(result.curve)}</section>
      <div class="club-detail-grid"><section class="club-data-card"><h2>The evidence</h2><dl><div><dt>Two-sided p-value</dt><dd>${e.p?.toExponential(4) || '—'}</dd></div><div><dt>False-alarm threshold</dt><dd>${e.alpha}</dd></div><div><dt>Statistical check’s detection goal</dt><dd>${pct(e.power)}</dd></div><div><dt>95% Bayesian interval</dt><dd>${e.interval ? e.interval.map(pct).join(' – ') : '—'}</dd></div><div><dt>Descriptive risk score</dt><dd>${result.riskScore?.toFixed(2) ?? '—'}</dd></div><div><dt>Largest drawdown</dt><dd>${money(result.drawdown)} chips</dd></div></dl><p class="club-small">The interval assumes a stable probability and the calculator's Beta(1,1) prior. A signal describes this record; it does not establish permanent luck or future profit.</p></section>
      <section class="club-data-card"><h2>Your bet mix</h2>${result.mix.length ? result.mix.map(m => `<div class="club-mix-row"><span>${m.coverage === 1 ? 'Straight bets' : `${m.coverage}-number coverage`}</span><strong>${money(m.stake)} staked</strong><small>${signed(m.returned-m.stake)} net</small></div>`).join('') : '<p>No settled wagers yet.</p>'}</section></div>
      <details class="club-details"><summary>Wheel patterns · pockets, outside groups and sectors</summary><p>These use the distinct draws observed on this device since reset, including rounds you watched without betting. They describe the source, rather than the player. Adjusted p-values use Holm correction across 53 categories at this look; repeated looks remain exploratory.</p><div class="club-table-scroll"><table><thead><tr><th>Pattern</th><th>Hits</th><th>Expected</th><th>Observed</th><th>Adjusted p</th></tr></thead><tbody>${result.patterns.map(s => `<tr><td>${s.name}</td><td>${money(s.wins)}</td><td>${pct(s.p0)}</td><td>${s.n ? pct(s.wins/s.n) : '—'}</td><td>${s.adjustedP.toPrecision(3)}</td></tr>`).join('')}</tbody></table></div></details>
      <button class="club-primary" data-club="report">Download analysis report</button>` : `<section class="club-unlock"><div><p class="club-eyebrow">GO A LITTLE DEEPER</p><h2>Your play has a story.</h2><p>Explore your bet mix, actual versus expected results, uncertainty and wheel-sector patterns. Ordinary results deserve a clear explanation too.</p><p class="club-small">One 30-day pass · ${usd(INSIGHTS_PASS.cents)} test price · No automatic renewal</p></div><button class="club-primary" data-club="checkout" data-id="${INSIGHTS_PASS.id}" >Log in to purchase Insights</button></section>`}`;
  }

  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type })), a = document.createElement('a');
    a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function exportRecords() {
    if (!profile()) throw new Error('Enter the table to start a record.');
    await pendingWrite;
    const records = await readRecords(user().sub, profile().epoch);
    download('atelier-record.json', JSON.stringify({ schema: 1, resetAt: profile().resetAt, model: MODEL.version, coverage: 'Local device observations only', records }, null, 2), 'application/json');
  }

  function report() {
    if (!premium() || !latest) return;
    const e = latest.evaluation;
    const text = `# Atelier personal play report\n\nSince reset: ${new Date(profile().resetAt).toISOString()}\nSource: ${latest.sourceId}\nCoverage: local device observations only.\n\n## Results\n\n- Wagered rounds: ${latest.wagered}\n- Net: ${latest.net} chips\n- Expected: ${latest.expected} chips\n- Difference: ${latest.difference} chips\n- Eligible rounds in selected probability profile: ${e.n}\n- Fair win probability: ${e.p0}\n- Minimum observed gap: 5 percentage points (0.05)\n- Observed gap: ${e.gap}\n- Gap description: ${e.veryLargeGap ? "Very large difference" : e.meetsEffectThreshold ? "At least 5 percentage points" : "Small difference from the usual odds"}\n- Lower win-rate threshold: ${e.lowerTarget ?? "Not possible"}\n- Upper win-rate threshold: ${e.upperTarget ?? "Not possible"}\n- Observed win rate: ${e.observed ?? 'No sample'}\n- Fixed 5-point round target: ${e.required ?? 'No finite target within supported range'}\n- Two-sided p: ${e.p ?? 'No sample'}\n- False-alarm cutoff for this check: ${pct(e.alpha)}\n- Statistical-check power goal at a 5-point difference: ${pct(e.power)}\n- Attained statistical-check power at the planned target: ${e.attainedPower ?? "No sample"}\n- Model status: ${e.status}\n\nPlan: p1 = p0 +/- 0.05, using feasible directions only; the shared round target covers both.\nAlert: abs(observed - fair) >= 0.05 AND rounds >= target AND two-sided p < alpha.\nThe power goal applies to the statistical check, before the observed-gap filter.\nPer-check evaluation; repeated looks and selected profiles can create chance\nalerts. No permanent luck, positive future EV, or lifetime error-control\nclaim is made. Purchases and grants do not enter roulette profit.\n`;
    download('atelier-insights.md', text, 'text/markdown');
  }

  function updateShowcase() {
    const item = COLLECTIBLES.find(c => c.id === profile()?.showcase);
    const badge = document.querySelector('#clubShowcase');
    if (badge) { badge.innerHTML = item ? `<img src="${item.image}" alt="${item.name}">` : '◇'; badge.title = item ? `Your showcase: ${item.name}` : 'Your collection'; }
    document.querySelectorAll('[data-club-wallet]').forEach(el => { el.textContent = money(api.balance()); });
  }

  dialog.addEventListener('click', async event => {
    const button = event.target.closest('[data-club]');
    if (!button) return;
    try {
      const action = button.dataset.club, id = button.dataset.id;
      if (action === 'close') { dialog.close(); if (page === 'insights' && user()) api.returnToGame(); }
      if (action === 'collection' || action === 'chips') { tab = action; shop(); }
      if (action === 'owned') { onlyOwned = !onlyOwned; shop(); }
      if (action === 'detail') itemDetail(id);
      if (action === 'showcase') { const next = structuredClone(profile()); next.showcase = id; api.commit(next, api.balance()); updateShowcase(); shop(); }
      if (action === 'checkout') checkout(id);
      if (action === 'complete') { const order = profile().orders.find(o => o.id === id); if (order) checkout(order.productId, id); }
      if (action === 'insights') insights();
      if (action === 'recent') { dialog.close(); api.returnToGame(); api.showStatistics(); }
      if (action === 'export') await exportRecords();
      if (action === 'report') report();
      if (action === 'reset') confirm('Start a fresh record?', 'Your current profit, EV and analysis view will restart. Your chips, collection and Insights access stay with you. Earlier records remain in this device’s archive; this is not account deletion.', 'Reset my record', async () => {
        if (api.hasWagers()) throw new Error('Wait for your outstanding wager to settle before resetting.');
        await pendingWrite;
        const next = structuredClone(profile()); next.epoch = crypto.randomUUID(); next.resetAt = Date.now();
        api.commit(next, api.balance()); latest = null; insights();
      });
    } catch (error) { status(error.message); }
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-club-open]');
    if (button) open(button.dataset.clubOpen);
  });

  function open(destination = 'collection') {
    if (user()?.type === 'multiplayer') { openMultiplayer(destination); return; }
    if (!dialog.open) dialog.showModal();
    if (destination === 'insights') insights();
    else { tab = destination === 'chips' ? 'chips' : 'collection'; shop(); }
    dialog.scrollTop = 0;
  }

  async function sourceFor(round, feed) {
    if (round.source !== 'real') return { sourceId: 'rng', drawKey: `rng:${round.id}` };
    if (!feed || round.row === null) return { sourceId: 'replay:unidentified', drawKey: `unidentified:${round.id}` };
    if (!feedHashes.has(feed) && !feed.autoWeekly) feedHashes.set(feed, crypto.subtle.digest('SHA-256', feed.numbers).then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('')));
    const hash = feed.autoWeekly ? feed.archiveHash : await feedHashes.get(feed);
    return { sourceId: `replay:${hash}`, drawKey: `${hash}:${round.row}` };
  }

  return {
    open, update: updateShowcase,
    settled(round, definitions, feed) {
      if (!user() || !profile() || round.outcome === null) return;
      const owner = user().sub, epoch = profile().epoch;
      const copy = { ...round, bets: round.bets.map(b => ({ ...b })) };
      const bets = copy.bets.map(b => ({ ...b, ...definitions.get(b.id) }));
      pendingWrite = pendingWrite.then(async () => {
        const source = await sourceFor(copy, feed);
        const record = makeRecord({ owner, epoch, round: copy, bets, ...source });
        if (record) await saveRecord(record);
      }).catch(error => { recordError = error.message; api.toast(`${error.message} The history may be incomplete.`); });
      pendingWrite.then(() => { updateShowcase(); if (dialog.open && page === 'insights') refreshAnalysis(); });
    },
  };
}
