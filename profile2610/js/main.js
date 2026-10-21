import { createScenes } from './scenes.js';

const escape = (text) => String(text ?? '').replace(/[&<>"']/g,
  (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const asText = (item) => typeof item === 'object' && item !== null
  ? Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(' · ')
  : String(item ?? '');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const date = (value) => {
  if (!value) return 'Present';
  const [year, month] = String(value).split('-');
  return month ? `${months[Number(month) - 1]} ${year}` : year;
};

async function main() {
  const response = await fetch('profile.yaml');
  if (!response.ok) throw new Error(`Profile request returned ${response.status}.`);
  const profile = window.jsyaml.load(await response.text());
  const { basics, signatureValues: values, work, education } = profile;
  const linkedIn = basics.profiles.find((item) => item.network === 'LinkedIn');
  const app = document.querySelector('#main');
  document.title = `${basics.name} — The Alignment Principle`;
  app.innerHTML = `
    <section class="hero" id="hero" aria-labelledby="hero-name">
      <div class="hero-main">
        <div class="hero-copy">
          <p class="eyebrow"><span class="chapter">01 /</span>${escape(basics.label)}</p>
          <h1 id="hero-name">${escape(basics.name.split(' ')[0])} <span>${escape(basics.name.split(' ').slice(1).join(' '))}.</span></h1>
          <p class="hero-motto">Engineering depth.<br><em>Human impact.</em></p>
          <p class="hero-description">${escape(basics.summary)}</p>
          <div class="hero-actions">
            <a class="primary-link" href="#values">Explore the value signatures <span class="arrow" aria-hidden="true">↘</span></a>
            <a class="text-link" href="${escape(linkedIn.url)}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="hero-study">
          <div class="study-top"><span>FIG. 01 — THE ALIGNMENT PRINCIPLE</span><span>ENGINEERING / PEOPLE / DELIVERY</span></div>
          <div class="hero-figure"><canvas id="hero-canvas" role="img" aria-label="Three finely drawn signal paths align at a shared focal point, symbolising engineering, delivery, and people."></canvas></div>
          <div class="study-person">
            <img class="portrait" src="assets/cbc.jpg" alt="${escape(basics.name)}" width="62" height="70">
            <div><p>Hands-on in the detail.<br>Accountable for the outcome.</p><small>${escape(basics.location.city)} · ${escape(basics.location.country)}</small></div>
          </div>
        </div>
      </div>
      <div class="hero-foot">
        <div class="industry-line"><strong>20+ <span style="font: 10px var(--mono)">YEARS IN ENGINEERING</span></strong><span>Semiconductor</span><i></i><span>Automotive</span><i></i><span>Test & measurement</span></div>
        <a href="#values" class="scroll-link">THREE STRENGTHS. ONE DIRECTION. <span aria-hidden="true">↓</span></a>
      </div>
    </section>

    <section class="values" id="values" aria-labelledby="values-title">
      <div class="section-intro">
        <div><p class="eyebrow"><span class="chapter">02 /</span> Value signatures</p><h2 id="values-title">Where depth<br>becomes impact.</h2></div>
        <p>Sound technical judgement, coordinated execution, and people who grow with the work. Three strengths that reinforce each other.</p>
      </div>
      <div class="values-body">
        <div class="instrument">
          <div class="instrument-tabs" aria-label="Choose a value signature">
            ${values.map((value, i) => `<button type="button" class="instrument-tab" data-value="${i}" aria-controls="value-${escape(value.id)}" aria-pressed="${i === 0}">${value.number} ${escape(value.shortLabel)}</button>`).join('')}
          </div>
          <div class="instrument-canvas"><canvas id="value-canvas" role="img" aria-label="Signal paths converge, synchronise, and branch to illustrate technical depth, delivery orchestration, and talent elevation."></canvas></div>
          <div class="instrument-readout"><span class="instrument-label" id="instrument-label">${escape(values[0].diagramLabel)}</span><span class="instrument-count" id="instrument-count">01 / 03</span></div>
          <p class="instrument-note" id="instrument-note">${escape(values[0].diagramNote)}</p>
        </div>
        <div class="value-stories">
          ${values.map((value, i) => `
          <article class="value-article" id="value-${escape(value.id)}" data-value-index="${i}" aria-labelledby="value-heading-${i}">
            <div class="value-kicker"><span class="number">${value.number}</span>${escape(value.label)}</div>
            <h3 id="value-heading-${i}">${escape(value.title)}</h3>
            <p class="value-statement">${escape(value.statement)}</p>
            <p class="method">${escape(value.method)}</p>
            <ul class="evidence">${value.evidence.map((item) => `<li><strong>${escape(item.metric)}</strong><div><small>${escape(item.source)}</small><p>${escape(item.text)}</p></div></li>`).join('')}</ul>
            <p class="evidence-more">${escape(value.more)}</p>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="career" id="career" aria-labelledby="career-title">
      <div class="section-intro">
        <div><p class="eyebrow"><span class="chapter">03 /</span> Career & academic achievement</p><h2 id="career-title">A career built<br>across boundaries.</h2></div>
        <p>From software and systems to programs, sites, and teams. Each chapter adds another perspective to the same engineering practice.</p>
      </div>
      <div class="career-controls"><p>${work.length} CHAPTERS / SELECT TO EXPLORE</p><div class="order-toggle" aria-label="Career order"><button type="button" data-order="recent" aria-pressed="true">Recent first</button><button type="button" data-order="earliest" aria-pressed="false">From the start</button></div></div>
      <div class="career-grid">
        <div class="career-chapters"><div class="career-intro"><p>Rooted in Penang.<br>Connected to a wider world.</p><small>Select a career chapter. The atlas traces its work locations and named customer connections.</small></div><div class="career-list" aria-label="Career chapters" id="career-list"></div></div>
        <div class="career-panel" id="career-panel"><div class="atlas"><div class="atlas-caption"><span>FIELD NOTES / GLOBAL CONNECTIONS</span><span id="atlas-year">2025 — PRESENT</span></div><canvas id="atlas-canvas" role="img" aria-label="Career atlas showing the selected role's work sites and named customer locations."></canvas></div><div class="atlas-legend"><span>Work location</span><span>Named customer</span></div><article class="job-detail" id="job-detail" aria-label="Selected career chapter" aria-live="polite" aria-atomic="true"></article></div>
      </div>
      <div class="education" id="education">
        <div class="education-heading"><div class="education-symbol" aria-hidden="true"><i></i><i></i><i></i></div><div><p class="eyebrow">The foundation</p><h3>Academic achievement</h3></div></div>
        <div>${education.map((item) => `<small>${escape(item.start)} — ${escape(item.end)} / ${escape(item.studyType).toUpperCase()}</small><h3>${escape(item.institution)}</h3><p>${escape(item.area)}</p>`).join('')}</div>
      </div>
    </section>
    <footer class="closing"><div class="closing-inner"><div class="closing-top"><h2>Good work starts<br>with a conversation.</h2><div class="contact-links"><a href="mailto:${escape(basics.email)}">${escape(basics.email)} ↗</a><a href="tel:${escape(basics.phone.replace(/[^+\d]/g, ''))}">${escape(basics.phone)}</a><a href="${escape(linkedIn.url)}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div><div class="footer-line"><span>${escape(basics.name)} / ${escape(basics.location.city)}, ${escape(basics.location.country)}</span><span>THE ALIGNMENT PRINCIPLE <span aria-hidden="true">—</span> DEPTH · DELIVERY · DEVELOPMENT</span><a href="#hero">Back to the beginning ↑</a></div></div></footer>`;
  app.removeAttribute('aria-busy');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  const scenes = createScenes({
    hero: document.querySelector('#hero-canvas'),
    value: document.querySelector('#value-canvas'),
    atlas: document.querySelector('#atlas-canvas'),
    paused,
  });
  const motionButton = document.querySelector('#motion-toggle');
  function setPaused(next) {
    paused = next;
    document.documentElement.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations');
    motionButton.querySelector('.motion-label').textContent = paused ? 'Motion off' : 'Motion on';
    motionButton.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    scenes.setPaused(paused);
  }
  setPaused(paused);
  motionButton.addEventListener('click', () => setPaused(!paused));
  reducedMotion.addEventListener('change', (event) => setPaused(event.matches));

  let activeValue = -1;
  function setValue(index) {
    if (index === activeValue) return;
    activeValue = index;
    scenes.setValue(index);
    document.querySelectorAll('.instrument-tab').forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
    });
    document.querySelectorAll('.value-article').forEach((article, i) => {
      article.classList.toggle('is-active', i === index);
    });
    document.querySelector('#instrument-label').textContent = values[index].diagramLabel;
    document.querySelector('#instrument-count').textContent = `${values[index].number} / 03`;
    document.querySelector('#instrument-note').textContent = values[index].diagramNote;
  }
  setValue(0);
  document.querySelectorAll('.instrument-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.value);
      setValue(index);
      if (window.innerWidth > 760) {
        document.querySelector(`#value-${values[index].id}`).scrollIntoView({
          behavior: paused ? 'instant' : 'smooth', block: 'start',
        });
      }
    });
  });
  let scrollPending = false;
  function updateScroll() {
    scrollPending = false;
    const target = window.innerHeight * .5;
    const stories = [...document.querySelectorAll('.value-article')];
    if (window.innerWidth > 760) {
      let nearest = 0;
      let distance = Infinity;
      stories.forEach((story, i) => {
        const rect = story.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height * .5 - target);
        if (nextDistance < distance) { distance = nextDistance; nearest = i; }
      });
      setValue(nearest);
    }
    const sectionIds = ['hero', 'values', 'career'];
    let activeSection = 0;
    sectionIds.forEach((id, i) => {
      if (document.getElementById(id).getBoundingClientRect().top < window.innerHeight * .4) activeSection = i;
    });
    document.querySelectorAll('.nav-link').forEach((link, i) => {
      link.classList.toggle('is-active', i === activeSection);
      if (i === activeSection) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });

  let activeJob = 0;
  let order = 'recent';
  const list = document.querySelector('#career-list');
  const detail = document.querySelector('#job-detail');
  function renderList() {
    const ordered = work.map((job, index) => ({ job, index }));
    if (order === 'earliest') ordered.reverse();
    list.innerHTML = ordered.map(({ job, index }) => `
      <button class="role-button" type="button" data-job="${index}" aria-controls="job-detail" aria-pressed="${index === activeJob}">
        <span class="role-year">${escape(job.start.slice(0, 4))}</span>
        <span><span class="role-company">${escape(job.company)}</span><span class="role-title">${escape(job.position)}</span></span>
        <span class="role-arrow" aria-hidden="true">↗</span>
      </button>`).join('');
  }
  function selectJob(index) {
    activeJob = index;
    const job = work[index];
    const attrs = [...new Set(Object.values(job.attributes || {}).flat().map(asText))];
    const workLocations = (job.locations?.work || []).map((location) => location.name);
    const customers = (job.locations?.customers || []).map((location) => location.name);
    detail.innerHTML = `
      <p class="eyebrow">${String(index + 1).padStart(2, '0')} / ${escape(job.kind)}</p>
      <h3>${escape(job.company)}</h3>
      <p class="job-position">${escape(job.position)}</p>
      <p class="job-dates">${date(job.start)} — ${job.current ? 'Present' : date(job.end)}<br>${escape(workLocations.join(' · '))}</p>
      <ul class="job-highlights">${(job.highlights || []).map((item) => `<li>${escape(asText(item))}</li>`).join('')}</ul>
      ${attrs.length ? `<div class="job-attributes" aria-label="Tools, products, and practices">${attrs.map((item) => `<span>${escape(item)}</span>`).join('')}</div>` : ''}
      ${customers.length ? `<p class="job-locations"><b>CUSTOMER CONNECTIONS</b>${customers.map(escape).join(' / ')}</p>` : ''}`;
    detail.classList.remove('is-entering');
    void detail.offsetWidth;
    detail.classList.add('is-entering');
    document.querySelectorAll('.role-button').forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.job) === index));
    });
    document.querySelector('#atlas-year').textContent = `${job.start.slice(0, 4)} — ${job.current ? 'PRESENT' : job.end.slice(0, 4)}`;
    scenes.setJob(job);
  }
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-job]');
    if (!button) return;
    selectJob(Number(button.dataset.job));
    if (window.innerWidth <= 760) document.querySelector('#career-panel').scrollIntoView({
      behavior: paused ? 'instant' : 'smooth', block: 'start',
    });
    else if (document.querySelector('.atlas').getBoundingClientRect().top < 110) {
      document.querySelector('.career-grid').scrollIntoView({
        behavior: paused ? 'instant' : 'smooth', block: 'start',
      });
    }
  });
  document.querySelectorAll('[data-order]').forEach((button) => {
    button.addEventListener('click', () => {
      order = button.dataset.order;
      document.querySelectorAll('[data-order]').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      renderList();
    });
  });
  renderList();
  selectJob(0);
  updateScroll();
}

main().catch((error) => {
  document.querySelector('#main').removeAttribute('aria-busy');
  document.querySelector('#main').innerHTML = `<div class="notice"><h1>The profile could not load.</h1><p>${escape(error.message)}</p><p>Serve the prototypes folder with <code>python -m http.server 8000</code>, then open <a href="http://localhost:8000/profile2610/">localhost:8000/profile2610/</a>.</p></div>`;
  console.error(error);
});
