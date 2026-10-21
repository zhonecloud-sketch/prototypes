import { createScenes } from './scenes.js';

const escape = (text) => String(text ?? '').replace(/[&<>"']/g,
  (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const asText = (item) => typeof item === 'object' && item !== null
  ? Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(' · ')
  : String(item ?? '');
const date = (value) => {
  if (!value) return '';
  if (!String(value).includes('-')) return String(value);
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`));
};

async function main() {
  const response = await fetch('profile.yaml', { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Profile request returned ${response.status}.`);
  const profile = window.jsyaml.load(await response.text());
  const { basics, presentation: ui, signatureValues: values,
    work = [], education = [], meta } = profile;
  const location = [basics.location?.city, basics.location?.country]
    .filter(Boolean).join(', ');
  const dates = (job) => `${date(job.start)} — ${job.current
    ? ui.career.present : date(job.end)}`;
  const contactLinks = [
    basics.email ? `<a href="mailto:${escape(basics.email)}">${escape(basics.email)}</a>` : '',
    basics.phone ? `<a href="tel:${escape(basics.phone.replace(/[^+\d]/g, ''))}">${escape(basics.phone)}</a>` : '',
    ...(basics.profiles || []).map((link) => `<a href="${escape(link.url)}"
      target="_blank" rel="noopener noreferrer">${escape(link.network)} <span aria-hidden="true">↗</span></a>`),
  ].join('');

  document.title = `${basics.name} — ${basics.label}`;
  document.querySelector('meta[name="description"]').content = basics.summary;
  document.querySelector('#header').innerHTML = `
    <nav aria-label="${escape(ui.navigationLabel)}">
      ${ui.navigation.map((item, i) => `<a class="nav-link${i === 0 ? ' is-active' : ''}"
        href="#${escape(item.section)}"${i === 0 ? ' aria-current="location"' : ''}>
        ${escape(item.label)}</a>`).join('')}
    </nav>`;

  const app = document.querySelector('#main');
  app.innerHTML = `
    <section class="hero" id="hero" aria-labelledby="hero-name">
      <div class="hero-copy">
        ${basics.image ? `<img class="portrait" src="${escape(basics.image)}"
          alt="${escape(basics.name)}" width="112" height="112">` : ''}
        <h1 id="hero-name">${escape(basics.name)}</h1>
        <p class="hero-label">${escape(basics.label)}</p>
        ${basics.tagline ? `<p class="hero-tagline">${escape(basics.tagline)}</p>` : ''}
        <p class="hero-summary">${escape(basics.summary)}</p>
        <p class="location">${escape(location)}</p>
        <div class="contact-links">${contactLinks}</div>
      </div>
      <div class="hero-art" aria-hidden="true"><canvas id="hero-canvas"></canvas></div>
      <a class="scroll-link" href="#values">${escape(ui.hero.continueLabel)} <span aria-hidden="true">↓</span></a>
    </section>

    <section class="values section" id="values" aria-labelledby="values-title">
      <div class="section-head"><h2 id="values-title">${escape(ui.values.title)}</h2>
        <p>${escape(ui.values.description)}</p></div>
      ${values.map((value, i) => `<article class="value-row" id="value-${escape(value.id)}"
        aria-labelledby="value-heading-${i}">
        <div class="value-copy">
          <span class="section-number">${escape(value.number)}</span>
          <h3 id="value-heading-${i}">${escape(value.label)}</h3>
          <p class="value-statement">${escape(value.statement)}</p>
          ${value.method ? `<p class="method">${escape(value.method)}</p>` : ''}
          <ul class="evidence">${(value.evidence || []).map((item) => `
            <li>${item.metric ? `<strong class="evidence-metric">${escape(item.metric)}</strong>` : ''}
              <div><p class="evidence-title">${escape(item.title)}</p>
                <p>${escape(item.text)}</p><span class="evidence-source">${escape(item.source)}</span></div></li>`).join('')}</ul>
          ${value.more ? `<p class="evidence-more">${escape(value.more)}</p>` : ''}
        </div>
        <figure class="value-figure" aria-hidden="true">
          <canvas class="value-canvas" data-animation="${escape(value.animation)}"></canvas>
        </figure>
      </article>`).join('')}
    </section>

    <section class="career section" id="career" aria-labelledby="career-title">
      <div class="section-head"><h2 id="career-title">${escape(ui.career.title)}</h2>
        <p>${escape(ui.career.description)}</p></div>
      <div class="career-grid">
        <aside class="atlas-panel" aria-label="${escape(ui.career.mapTitle)}">
          <p class="atlas-title" id="atlas-company"></p><p class="atlas-dates" id="atlas-years"></p>
          <div class="atlas"><canvas id="atlas-canvas" aria-hidden="true"></canvas></div>
          <div class="atlas-legend"><span>${escape(ui.career.workLegend)}</span><span>${escape(ui.career.customerLegend)}</span></div>
          <p class="atlas-note" id="atlas-note"></p>
        </aside>
        <div class="career-history">
          ${work.map((job, i) => {
            const attributes = Object.values(job.attributes || {}).flat().map(asText);
            const customers = (job.locations?.customers || []).map((place) => place.name);
            const sites = (job.locations?.work || []).map((place) => place.name);
            return `<article class="job" id="${escape(job.id)}" data-job="${i}"
              aria-labelledby="job-title-${i}">
              <p class="job-dates">${escape(dates(job))}</p>
              <h3 id="job-title-${i}">${escape(job.company)}</h3>
              <p class="job-position">${escape(job.position)}</p>
              <p class="job-sites">${escape(sites.join(' · '))}</p>
              <ul class="job-highlights">${(job.highlights || []).map((item) => `<li>${escape(asText(item))}</li>`).join('')}</ul>
              ${attributes.length ? `<div class="job-attributes" aria-label="${escape(ui.career.toolsLabel)}">${attributes.map((item) => `<span>${escape(item)}</span>`).join('')}</div>` : ''}
              ${customers.length ? `<p class="job-customers"><span>${escape(ui.career.customerLabel)}</span>${escape(customers.join(' / '))}</p>` : ''}
            </article>`;
          }).join('')}
        </div>
      </div>
      ${education.length ? `<section class="education" aria-labelledby="education-title">
        <h2 id="education-title">${escape(ui.education.title)}</h2>
        ${education.map((item) => `<article><p class="job-dates">${escape(item.start)} — ${escape(item.end)}</p>
          <h3>${escape(item.institution)}</h3><p>${escape(item.studyType)} · ${escape(item.area)}</p></article>`).join('')}
      </section>` : ''}
    </section>
    <footer class="footer"><p>${escape(basics.name)} · ${escape(location)}
      ${meta.lastUpdated ? `<span>${escape(ui.footer.updatedLabel)} ${escape(meta.lastUpdated)}</span>` : ''}</p>
      <div class="footer-controls"><a href="#hero">${escape(ui.footer.backLabel)} ↑</a>
      <button id="motion-toggle" type="button" aria-pressed="false"></button></div></footer>`;
  app.removeAttribute('aria-busy');

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  const scenes = createScenes({
    hero: document.querySelector('#hero-canvas'),
    values: [...document.querySelectorAll('.value-canvas')],
    atlas: document.querySelector('#atlas-canvas'), paused,
  });
  const motionButton = document.querySelector('#motion-toggle');
  function setPaused(next) {
    paused = next;
    document.documentElement.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = paused ? ui.motion.resume : ui.motion.pause;
    scenes.setPaused(paused);
  }
  setPaused(paused);
  motionButton.addEventListener('click', () => setPaused(!paused));
  reducedMotion.addEventListener('change', (event) => setPaused(event.matches));

  let activeJob = -1;
  function setJob(index) {
    if (index === activeJob || !work[index]) return;
    activeJob = index;
    const job = work[index];
    document.querySelector('#atlas-company').textContent = job.company;
    document.querySelector('#atlas-years').textContent = dates(job);
    document.querySelector('#atlas-note').textContent =
      (job.locations?.customers || []).some((place) => Number.isFinite(place.lat))
        ? ui.career.mapNote : ui.career.unspecifiedLocations;
    document.querySelectorAll('.job').forEach((article, i) => {
      article.classList.toggle('is-active', i === index);
    });
    scenes.setJob(job);
  }
  const jobs = [...document.querySelectorAll('.job')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  let scrollPending = false;
  function updateScroll() {
    scrollPending = false;
    let sectionIndex = 0;
    ui.navigation.forEach((item, i) => {
      if (document.getElementById(item.section).getBoundingClientRect().top < innerHeight * .35) sectionIndex = i;
    });
    navLinks.forEach((link, i) => {
      link.classList.toggle('is-active', i === sectionIndex);
      if (i === sectionIndex) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const mapBottom = document.querySelector('.atlas-panel').getBoundingClientRect().bottom;
    const readingLine = innerWidth <= 760 ? mapBottom + 100 : innerHeight * .45;
    let index = 0;
    jobs.forEach((article, i) => {
      if (article.getBoundingClientRect().top <= readingLine) index = i;
    });
    setJob(index);
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  // Resolve section links after the YAML-built content exists.
  document.getElementById(location.hash.slice(1))?.scrollIntoView({
    behavior: 'instant', block: 'start',
  });
  updateScroll();
}

main().catch((error) => {
  document.querySelector('#main').removeAttribute('aria-busy');
  document.querySelector('#main').innerHTML = `<div class="notice"><h1>The profile could not load.</h1><p>${escape(error.message)}</p><p>Serve the prototypes folder with <code>python -m http.server 8000</code>, then open <a href="http://localhost:8000/profile2610/">localhost:8000/profile2610/</a>.</p></div>`;
  console.error(error);
});
