import { COLLECTIBLES, CHIP_PACKS, INSIGHTS_PASS, collectionWealth } from './catalogue.js';
import { openMultiplayer } from './multiplayer.js?v=20261022-perf';
import { makeRecord, MODEL } from './insights-model.js';
import { saveRecord, readRecords } from './insights-records.js';

const money = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const usd = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents/100);
const pct = n => `${(100*n).toFixed(2)}%`;
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
      <div class="club-analysis-controls"><label>Source<select id="clubSource"><option value="rng">Client RNG · local play</option></select></label><label>Bet profile<select id="clubCohort"><option value="18">18 profitable pockets / 37</option></select></label><label>Evaluation<select id="clubMode"><option value="monitor" ${mode === 'monitor' ? 'selected' : ''}>Monitor · α 0.001</option><option value="snapshot" ${mode === 'snapshot' ? 'selected' : ''}>Single evaluation · α 0.05</option></select></label></div>
      <div id="clubAnalysis" aria-live="polite"><div class="club-empty">${p ? 'Reading your current record…' : 'Enter as a guest or sign in to begin a personal record.'}</div></div>
      <details class="club-details"><summary>Bias Calculator model and sample size</summary><p>The mathematical functions are copied from your Bias Calculator. Required N uses the observed profitable-round rate, the exact fair probability for this bet profile, the selected α and the desired power.</p><p>A signal needs both N ≥ required N and p &lt; α. The estimate changes as results accumulate. It is an observed-effect planning reference, not a guarantee of persistent luck or future profit.</p><label class="club-field">Detection power<input id="clubPower" type="number" min="0.01" max="0.99" step="0.01" value="${power}"></label><p>Default power: 80%. Monitoring uses the calculator's per-check α = 0.001; single evaluation uses α = 0.05. Repeated looks and selection across bet profiles can produce chance alerts. These per-check signals are not lifetime confirmations.</p><p>Only rounds with the same probability of a net win are combined. Several bets on one round form one payoff portfolio. Replay duplicates are excluded from statistical sample counts. The full record's financial totals still include every settled wager.</p><p>Very small observed differences can require more than the supported 100-million-record planning range; no arbitrary fallback sample count is substituted.</p></details>
      <div class="club-record-actions"><button data-club="export">Export my raw record</button><button data-club="reset" ${!p ? 'disabled' : ''}>Reset analysis record</button></div>`);
    dialog.querySelector('#clubMode').onchange = e => { mode = e.target.value; refreshAnalysis(); };
    dialog.querySelector('#clubSource').onchange = e => { sourceId = e.target.value; pockets = null; refreshAnalysis(); };
    dialog.querySelector('#clubCohort').onchange = e => { pockets = Number(e.target.value); refreshAnalysis(); };
    dialog.querySelector('#clubPower').onchange = e => {
      const value = Number(e.target.value);
      if (!(value >= 0.01 && value <= 0.99)) { e.target.value = power; return; }
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
        worker = new Worker(new URL('./insights-worker.js', import.meta.url), { type: 'module' });
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
    sourceSelect.innerHTML = sources.map(s => `<option value="${escape(s)}">${s === 'rng' ? 'Client RNG · local play' : `Recorded replay · ${escape(s.slice(7,15))}`}</option>`).join('');
    sourceSelect.value = result.sourceId;
    const cohort = dialog.querySelector('#clubCohort');
    cohort.innerHTML = (result.groups.length ? result.groups : [{pockets:18,n:0}]).map(g => `<option value="${g.pockets}">${g.pockets} profitable pockets / 37 · ${money(g.n)} rounds</option>`).join('');
    cohort.value = String(Math.round(e.p0*37)); pockets = Number(cohort.value);
    const titles = { empty: 'Your record starts with a wager.', insufficient: 'More evidence is needed.', ordinary: 'Within expected variation.', advantage: 'Advantage signal.', inverted: 'Inverted-advantage signal.' };
    if (e.status === 'empty' && result.wagered) titles.empty = 'No eligible win-rate sample.';
    const explanation = e.status === 'advantage' ? 'Your profitable-round rate is unusually high under this calculator evaluation.' : e.status === 'inverted' ? 'Your profitable-round rate is unusually low under this calculator evaluation.' : e.status === 'empty' ? (result.wagered ? 'These bet combinations have no eligible net-win probability to test. Their stakes and returns remain in your financial totals.' : 'Every settled wager from this record will be included, beyond the recent-spin display.') : 'The current record does not meet both the calculator’s sample requirement and significance threshold.';
    const progress = e.required ? Math.min(100, e.n/e.required*100) : 0;
    dialog.querySelector('#clubAnalysis').innerHTML = `<section class="club-verdict ${e.status}"><p class="club-eyebrow">${mode === 'monitor' ? 'CONTINUOUS REVIEW · PER-CHECK RESULT' : 'SINGLE-EVALUATION RESULT'}</p><h2>${titles[e.status]}</h2><p>${explanation}</p>
      <div class="club-sample-values"><div><small>ELIGIBLE ROUNDS</small><strong>${money(e.n)}</strong></div><div><small>MODEL REQUIRED N</small><strong>${e.required ? money(e.required) : e.n ? 'No finite target*' : '—'}</strong></div><div><small>FAIR / OBSERVED</small><strong>${pct(e.p0)} / ${e.observed === null ? '—' : pct(e.observed)}</strong></div></div>
      <div class="club-sample-track" role="progressbar" aria-label="Records relative to calculator sample requirement" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress}%"></span></div>
      <p class="club-small">${e.required ? `${e.remaining ? `${money(e.remaining)} additional eligible rounds at the current observed rate.` : 'The current sample meets the model’s requirement.'} Required N changes with the observed effect.` : e.n ? '*The observed difference is zero, too small, or outside the supported planning range.' : 'No fixed minimum is imposed. The Bias Calculator determines the required sample.'}</p>
      <p class="club-small">${money(result.wagered)} total wagered rounds · ${money(result.distinctDraws)} distinct observed draws · since ${date(p.resetAt)}${result.repeatDraws ? ` · ${money(result.repeatDraws)} replay duplicates excluded from inference` : ''}</p></section>
      <div class="club-metrics"><div><small>NET RESULT</small><strong>${signed(result.net)}</strong><span>play chips</span></div><div><small>EXPECTED RESULT</small><strong>${signedDecimal(result.expected)}</strong><span>for your actual stakes</span></div><div><small>DIFFERENCE</small><strong>${signedDecimal(result.difference)}</strong><span>above or below expectation</span></div></div>
      ${premium() ? `<div class="club-paid-label">Insights preview active until ${date(p.insightsUntil)}</div><section class="club-chart"><div class="club-section-heading"><h2>Your record, in perspective.</h2><span>— Actual &nbsp; ⋯ Expected</span></div>${chart(result.curve)}</section>
      <div class="club-detail-grid"><section class="club-data-card"><h2>The evidence</h2><dl><div><dt>Two-sided p-value</dt><dd>${e.p?.toExponential(4) || '—'}</dd></div><div><dt>False-alarm threshold</dt><dd>${e.alpha}</dd></div><div><dt>Detection power target</dt><dd>${pct(e.power)}</dd></div><div><dt>95% Bayesian interval</dt><dd>${e.interval ? e.interval.map(pct).join(' – ') : '—'}</dd></div><div><dt>Descriptive risk score</dt><dd>${result.riskScore?.toFixed(2) ?? '—'}</dd></div><div><dt>Largest drawdown</dt><dd>${money(result.drawdown)} chips</dd></div></dl><p class="club-small">The interval assumes a stable probability and the calculator's Beta(1,1) prior. A signal describes this record; it does not establish permanent luck or future profit.</p></section>
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
    const text = `# Atelier personal play report\n\nSince reset: ${new Date(profile().resetAt).toISOString()}\nSource: ${latest.sourceId}\nCoverage: local device observations only.\n\n## Results\n\n- Wagered rounds: ${latest.wagered}\n- Net: ${latest.net} chips\n- Expected: ${latest.expected} chips\n- Difference: ${latest.difference} chips\n- Eligible rounds in selected probability profile: ${e.n}\n- Fair win probability: ${e.p0}\n- Observed win rate: ${e.observed ?? 'No sample'}\n- Calculator required N: ${e.required ?? 'No finite target within supported range'}\n- Two-sided p: ${e.p ?? 'No sample'}\n- Alpha: ${e.alpha}\n- Power target: ${e.power}\n- Model status: ${e.status}\n\nRequired N is the Bias Calculator's observed-effect planning calculation.\nPer-check evaluation; repeated looks and selected profiles can create chance\nalerts. No permanent luck, positive future EV, or lifetime error-control\nclaim is made. Purchases and grants do not enter roulette profit.\n`;
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
    if (!feedHashes.has(feed)) feedHashes.set(feed, crypto.subtle.digest('SHA-256', feed.numbers).then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('')));
    const hash = await feedHashes.get(feed);
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
