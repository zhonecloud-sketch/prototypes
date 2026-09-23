// Entry point: load profile.yaml, build the DOM, wire the three scenes to scroll.
import { createHero } from './hero.js';
import { createValues, VALUES_INTRO_WEIGHT } from './values.js?v=20260923c';
import { createWorldMap } from './worldmap.js';
import { LANDMASK } from './landmask.js';
import { el, fmtDate, fmtDuration, telHref, clamp, prefersReducedMotion } from './util.js';

const VALUE_ACCENTS = ['#37d1ff', '#ffb547', '#b48cff', '#5ff2c6'];
const ICONS = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.25 1z"/>',
  pin: '<path d="M12 22s7-7.1 7-12a7 7 0 1 0-14 0c0 4.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
  linkedin: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4z"/>',
};
const icon = (name, extra = '') =>
  `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

const slug = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

// YAML items such as "- Innovation: video tearing detection" parse as one-key mappings.
const asText = (item) => {
  if (item === null || item === undefined) return '';
  if (typeof item !== 'object') return String(item);
  return Object.entries(item).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' · ');
};

async function loadProfile() {
  const res = await fetch('profile.yaml', { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return window.jsyaml.load(await res.text());
}

/* ------------------------------------------------------------ DOM builders */

function buildHero(basics) {
  const canvas = el('canvas');
  const photo = el('div', { class: 'hero-photo' }, el('img', { src: 'cbc.jpg', alt: basics.name, width: 600, height: 600, decoding: 'async' }));
  const tags = String(basics.tagline || '').split('·').map((s) => s.trim()).filter(Boolean);
  const summary = String(basics.summary || '').trim();
  const m = summary.match(/^(\d+\+?\s+years)/i);
  const summaryNodes = m ? [el('b', { text: m[1] }), summary.slice(m[1].length)] : [summary];
  const loc = basics.location ? [basics.location.city, basics.location.country].filter(Boolean).join(', ') : '';

  const contacts = [];
  if (basics.email) contacts.push(el('a', { class: 'contact', href: `mailto:${basics.email}`, svg: icon('mail') }, el('span', { text: basics.email })));
  if (basics.phone) contacts.push(el('a', { class: 'contact', href: telHref(basics.phone), svg: icon('phone') }, el('span', { text: basics.phone })));

  const links = (basics.profiles || []).map((p) => {
    const primary = /linkedin/i.test(p.network);
    return el('a', {
      class: `btn ${primary ? 'btn-primary' : 'btn-ghost'}`, href: p.url, target: '_blank', rel: 'noopener noreferrer',
      svg: icon(primary ? 'linkedin' : 'globe', primary ? 'fill' : ''),
    }, [el('span', {}, [p.network, p.handle ? el('small', { text: p.handle }) : null]), el('span', { svg: icon('arrow'), style: 'display:inline-flex' })]);
  });

  const section = el('section', { class: 'hero', 'aria-label': 'Introduction' }, [
    el('div', { class: 'hero-canvas', 'aria-hidden': 'true' }, canvas),
    el('div', { class: 'hero-inner' }, [
      photo,
      el('div', { class: 'hero-text' }, [
        el('h1', { class: 'hero-name', text: basics.name }),
        el('p', { class: 'hero-label', text: basics.label }),
        tags.length ? el('div', { class: 'hero-tags' }, tags.map((t) => el('span', { class: 'tag', text: t }))) : null,
        el('p', { class: 'hero-summary' }, summaryNodes),
        loc ? el('div', { class: 'hero-loc', svg: icon('pin') }, el('span', { text: loc })) : null,
        contacts.length ? el('div', { class: 'hero-contacts' }, contacts) : null,
        links.length ? el('div', { class: 'hero-links' }, links) : null,
      ]),
    ]),
    el('div', { class: 'scroll-cue', 'aria-hidden': 'true' }, ['Scroll', el('i')]),
  ]);
  return { section, canvas, canvasHost: section, photo };
}

function evidenceItem(text) {
  const parts = String(text).split(' — ');
  if (parts.length < 2) return el('li', { text });
  return el('li', {}, [el('b', { text: parts[0] }), parts.slice(1).join(' — ')]);
}

function buildValues(values) {
  const canvas = el('canvas');
  const progress = values.map(() => el('i'));
  const intro = el('div', { class: 'value-panel is-active' }, [
    el('div', { class: 'value-num', text: `${String(values.length).padStart(2, '0')} values` }),
    el('h3', { class: 'value-label', text: 'How the work gets done' }),
    el('p', { class: 'value-statement', text: 'Each signal is a part of the work. Scroll to see the connections behind every value light up.' }),
  ]);
  const panels = values.map((v, i) => el('div', { class: 'value-panel', style: `--accent:${v.accent}` }, [
    el('div', { class: 'value-num', text: v.number || String(i + 1).padStart(2, '0') }),
    el('h3', { class: 'value-label', text: v.label }),
    el('p', { class: 'value-statement', text: String(v.statement || '').trim() }),
    v.evidence?.length ? el('ul', { class: 'value-evidence' }, v.evidence.map((e) => evidenceItem(asText(e)))) : null,
  ]));
  const hint = el('p', { class: 'values-hint', text: 'Scroll to connect the signals' });
  const head = el('div', { class: 'values-head' }, [
    el('span', { class: 'eyebrow', text: 'Signature Values' }),
    el('div', { class: 'values-progress', 'aria-hidden': 'true' }, progress),
  ]);
  const copy = el('div', { class: 'values-copy' }, [intro, ...panels]);
  const stage = el('div', { class: 'values-stage' }, [
    el('div', { class: 'values-graphic', 'aria-hidden': 'true' }),
    el('div', { class: 'values-canvas', 'aria-hidden': 'true' }, canvas),
    head, hint,
    copy,
  ]);
  const section = el('section', { class: 'values', 'aria-label': 'Signature values' }, stage);
  const scrollUnits = (VALUES_INTRO_WEIGHT + values.length) * 90;
  section.style.height = `calc(100vh + ${scrollUnits}vh)`;
  section.style.height = `calc(100svh + ${scrollUnits}svh)`;

  let current = -2;
  const setActive = (i) => {
    if (i === current) return;
    current = i;
    stage.classList.toggle('is-focused', i >= 0);
    stage.style.setProperty('--accent', i >= 0 ? values[i].accent : '');
    intro.classList.toggle('is-active', i < 0);
    panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
    progress.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.style.setProperty('--accent', values[Math.max(0, i)]?.accent || ''); });
    head.style.setProperty('--accent', i >= 0 ? values[i].accent : '');
    hint.classList.toggle('is-hidden', i >= 0);
  };
  return { section, stage, canvas, canvasHost: stage, copy, setActive };
}

function chipList(items, cls = 'chip') {
  return items.map((s) => el('span', { class: cls, text: s }));
}

function buildJob(job, index, onCustomerTap) {
  const kind = String(job.kind || '');
  const dates = `${fmtDate(job.start)} — ${job.current ? 'Present' : fmtDate(job.end)}`;
  const loc = job.location ? [job.location.city, job.location.country].filter((s, i, a) => s && a.indexOf(s) === i).join(', ') : '';
  const attrs = Object.entries(job.attributes || {}).map(([key, vals]) =>
    el('div', { class: 'attr' }, [el('span', { class: 'attr-key', text: key }), ...chipList([].concat(vals || []).map(asText))]));
  const customers = (job.locations?.customers || []).map((c, i) => {
    const hasXY = Number.isFinite(c.lat) && Number.isFinite(c.lon);
    return el('button', {
      class: `chip chip-btn${c.same ? ' same' : ''}${hasXY ? '' : ' global'}`, type: 'button',
      dataset: { i: String(i) }, text: c.name || [c.city, c.country].filter(Boolean).join(', '),
      onclick: () => hasXY && onCustomerTap(index, i),
      'aria-label': `Highlight ${c.name || ''} on the map`,
    });
  });
  const card = el('article', { class: `job kind-${slug(kind)}`, dataset: { index: String(index) } }, [
    el('div', { class: 'job-head' }, [
      el('span', { class: 'kind', text: kind }),
      el('span', { class: 'job-dates' }, [el('b', { text: dates }), el('span', { text: fmtDuration(job.start, job.current ? null : job.end) })]),
    ]),
    el('h3', { class: 'job-company', text: job.company }),
    el('p', { class: 'job-position', text: job.position }),
    loc ? el('div', { class: 'job-meta' }, el('span', { svg: icon('pin') }, el('span', { text: loc }))) : null,
    job.highlights?.length ? el('ul', { class: 'job-highlights' }, job.highlights.map((h) => el('li', { text: asText(h) }))) : null,
    attrs.length ? el('div', { class: 'attrs' }, attrs) : null,
    customers.length ? el('div', { class: 'attrs' }, el('div', { class: 'attr customers' }, [el('span', { class: 'attr-key', text: 'Customers' }), ...customers])) : null,
    job.tags?.length ? el('div', { class: 'tags' }, job.tags.map((t) => el('span', { text: asText(t) }))) : null,
  ]);
  return { card, customerChips: customers };
}

function buildExperience(work, onCustomerTap) {
  const canvas = el('canvas');
  const labelsEl = el('div', { class: 'map-labels' });
  const titleKind = el('span', { class: 'eyebrow' });
  const titleCompany = el('strong');
  const titleYears = el('span', { class: 'map-years' });
  const indexEl = el('span', { class: 'map-index' });
  const legendGlobal = el('span', { class: 'global', text: 'Global customers', style: 'display:none' });
  const panel = el('div', { class: 'map-panel' }, [
    el('div', { class: 'map-canvas', 'aria-hidden': 'true' }, canvas),
    el('div', { class: 'map-overlay' }, [
      el('div', { class: 'map-title' }, [titleKind, titleCompany, titleYears]),
      indexEl,
      labelsEl,
      el('div', { class: 'map-legend', 'aria-hidden': 'true' }, [
        el('span', { class: 'work' }, [el('i'), 'Work']),
        el('span', { class: 'cust' }, [el('i'), 'Customer']),
        legendGlobal,
      ]),
    ]),
  ]);
  const jobs = work.map((job, i) => buildJob(job, i, onCustomerTap));
  const section = el('section', { class: 'experience', 'aria-label': 'Professional experience' }, [
    el('div', { class: 'section-head' }, [
      el('span', { class: 'eyebrow', text: `Professional Experience · ${work.length} roles` }),
      el('h2', { class: 'section-title', text: 'Where the work happened' }),
      el('p', { class: 'section-sub', text: 'Amber marks work sites, cyan marks customers. The map follows as you scroll through each role.' }),
    ]),
    panel,
    el('div', { class: 'timeline' }, jobs.map((j) => j.card)),
  ]);

  const setTitle = (job, i) => {
    titleKind.textContent = String(job.kind || '');
    titleCompany.textContent = job.company;
    titleYears.textContent = `${fmtDate(job.start)} — ${job.current ? 'Present' : fmtDate(job.end)}`;
    indexEl.textContent = `${i + 1} / ${work.length}`;
    panel.className = `map-panel kind-${slug(job.kind)}`;
    const hasGlobal = (job.locations?.customers || []).some((c) => !Number.isFinite(c.lat) && !c.same);
    legendGlobal.style.display = hasGlobal ? '' : 'none';
  };
  return { section, panel, canvas, canvasHost: panel, labelsEl, cards: jobs.map((j) => j.card), chips: jobs.map((j) => j.customerChips), setTitle };
}

function buildEducation(education) {
  if (!education?.length) return null;
  return el('section', { class: 'education', 'aria-label': 'Education' }, [
    el('div', { class: 'section-head', style: 'padding-left:0;padding-right:0' }, [
      el('span', { class: 'eyebrow', text: 'Education' }),
    ]),
    ...education.map((e) => el('div', { class: 'edu' }, [
      el('div', { class: 'job-head' }, [
        el('span', { class: 'kind', text: e.studyType || 'Degree' }),
        el('span', { class: 'job-dates' }, el('b', { text: `${fmtDate(e.start)} — ${fmtDate(e.end)}` })),
      ]),
      el('h3', { class: 'edu-inst', text: e.institution }),
      el('p', { class: 'edu-area', text: e.area }),
    ])),
  ]);
}

function buildFooter(meta, basics) {
  return el('footer', { class: 'footer' }, [
    `${basics.name} · profile.yaml`, meta?.lastUpdated ? el('span', { text: ` · updated ${meta.lastUpdated}` }) : '',
  ]);
}

function showNotice(err) {
  const app = document.getElementById('app');
  app.replaceChildren(el('div', { class: 'notice' }, [
    el('h2', { text: 'Could not load profile.yaml' }),
    el('p', { text: `${err?.message || err}` }),
    el('p', {}, ['This page fetches its content and ES modules, so it must be served over http(s). From this folder run ',
      el('code', { text: 'python -m http.server 8000' }), ' and open ', el('code', { text: 'http://localhost:8000/' }), '.']),
  ]));
}

/* ------------------------------------------------------------ boot */

async function main() {
  let data;
  try { data = await loadProfile(); } catch (err) { showNotice(err); return; }

  const basics = data.basics || {};
  const values = (data.signatureValues || []).map((v, i) => ({ ...v, accent: VALUE_ACCENTS[i % VALUE_ACCENTS.length] }));
  const work = data.work || [];
  let components = data.businessComponents || [];
  if (!components.length) {
    const ids = new Set(values.flatMap((v) => v.components || []));
    components = [...ids].map((id) => ({ id, label: id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }));
  }
  if (!components.length) components = values.map((v) => ({ id: v.id, label: v.shortLabel || v.label }));

  document.title = `${basics.name || 'Profile'} — ${basics.label || 'Digital Profile'}`;
  const reduced = prefersReducedMotion();

  const hero = buildHero(basics);
  const vals = buildValues(values);
  let map = null;
  let activeJob = -1;
  let scrollDirty = true;
  const exp = buildExperience(work, (jobIndex, customerIndex) => {
    if (jobIndex !== activeJob) setActiveJob(jobIndex);
    map?.highlight(customerIndex);
  });
  const edu = buildEducation(data.education);
  const app = document.getElementById('app');
  app.replaceChildren(hero.section, vals.section, exp.section, edu, buildFooter(data.meta, basics));
  app.removeAttribute('aria-busy');

  // --- scenes
  const heroScene = createHero({ canvas: hero.canvas, host: hero.canvasHost, photoEl: hero.photo, reduced });
  const valuesScene = createValues({ canvas: vals.canvas, host: vals.canvasHost, copyEl: vals.copy, components, values, reduced, onActive: vals.setActive });
  map = createWorldMap({
    canvas: exp.canvas, host: exp.canvasHost, labelsEl: exp.labelsEl, landmask: LANDMASK, reduced,
    onHighlight: (i) => {
      const chips = exp.chips[activeJob] || [];
      chips.forEach((c) => c.classList.toggle('is-active', Number(c.dataset.i) === i));
    },
  });

  function setActiveJob(i) {
    if (i === activeJob || !work[i]) return;
    activeJob = i;
    exp.cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    exp.setTitle(work[i], i);
    map.setJob(work[i]);
  }

  function updateActiveJob() {
    const pr = exp.panel.getBoundingClientRect();
    const line = pr.bottom + (window.innerHeight - pr.bottom) * 0.42;
    let idx = 0;
    for (let k = 0; k < exp.cards.length; k++) {
      if (exp.cards[k].getBoundingClientRect().top <= line) idx = k; else break;
    }
    setActiveJob(idx);
  }

  // --- sizing
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      if (e.target === hero.canvasHost) heroScene.resize();
      else if (e.target === vals.canvasHost) valuesScene.resize();
      else if (e.target === exp.canvasHost) map.resize();
    }
    scrollDirty = true;
  });
  ro.observe(hero.canvasHost); ro.observe(vals.canvasHost); ro.observe(exp.canvasHost);
  heroScene.resize(); valuesScene.resize(); map.resize();

  window.addEventListener('scroll', () => { scrollDirty = true; }, { passive: true });
  window.addEventListener('resize', () => { scrollDirty = true; }, { passive: true });

  // --- frame loop (each scene renders only while its section is near the viewport)
  let last = performance.now();
  const nearViewport = (r, vh) => r.bottom > -vh * 0.15 && r.top < vh * 1.15;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (document.hidden) return;
    const t = now / 1000;
    const vh = window.innerHeight;

    const heroR = hero.section.getBoundingClientRect();
    if (nearViewport(heroR, vh)) {
      heroScene.render(dt, t, clamp(-heroR.top / Math.max(1, heroR.height), 0, 1));
    }
    const valsR = vals.section.getBoundingClientRect();
    if (nearViewport(valsR, vh)) {
      const sr = vals.stage.getBoundingClientRect();
      const range = Math.max(1, valsR.height - sr.height);
      const progress = clamp(-valsR.top / range, 0, 1);
      // Reveal the beacons as the stage enters the viewport, before it sticks.
      const entry = clamp((vh - valsR.top) / vh, 0, 1);
      valuesScene.render(dt, t, progress, entry);
    }
    const expR = exp.section.getBoundingClientRect();
    if (nearViewport(expR, vh)) {
      if (scrollDirty) { updateActiveJob(); scrollDirty = false; }
      map.render(dt, t);
    }
  }
  requestAnimationFrame(frame);
}

main();
