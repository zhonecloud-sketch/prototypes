/* ============================================================
   CAREER HISTORY (GRAPHICAL) — Chong Boo Chean
   Self-contained Three.js visualisation.
   Hexagonal-tile Earth globe → unfolds into a hexagonal world
   map → career timeline (most recent → older) with company /
   customer markers and curved connection arcs.
   No external map data. No dependency on the parent page.
   ============================================================ */
(function () {
'use strict';
if (window.__CH_LOADED__) return;
window.__CH_LOADED__ = true;

/* ------------------------------------------------------------
   0. Boot guard — wait for <body>
------------------------------------------------------------ */
if (!document.body) {
  document.addEventListener('DOMContentLoaded', function () { boot(); });
} else {
  boot();
}
function boot() { main(); }

function main() {

/* ------------------------------------------------------------
   1. Career data (most recent → older). [lat, lon] pairs.
------------------------------------------------------------ */
const GLOBAL_HUBS = [
  { name: 'Intel hub · Hillsboro, USA',      lat: 45.52,  lon: -122.68 },
  { name: 'Intel hub · Austin, USA',         lat: 30.27,  lon: -97.74  },
  { name: 'Intel hub · Dublin, Ireland',     lat: 53.35,  lon: -6.26   },
  { name: 'Intel hub · Munich, Germany',     lat: 48.14,  lon: 11.58   },
  { name: 'Intel hub · Bangalore, India',    lat: 12.97,  lon: 77.59   },
  { name: 'Intel hub · Shanghai, China',     lat: 31.23,  lon: 121.47  },
  { name: 'Intel hub · Tokyo, Japan',        lat: 35.68,  lon: 139.69  },
  { name: 'Intel hub · Singapore',           lat: 1.35,   lon: 103.82  },
  { name: 'Intel hub · São Paulo, Brazil',   lat: -23.55, lon: -46.63  }
];

const CAREER = [
  {
    period: 'Dec 2025 → Present',
    job: 'System Software Development Engineer · Automation Lead',
    company: 'Intel Corporation',
    location: 'Penang, Malaysia',
    base: [5.42, 100.27],
    global: true,
    customers: [{ name: 'Global Intel customers · multiple locations' }]
  },
  {
    period: 'Jan 2022 → Dec 2025',
    job: 'Software Engineering Manager',
    company: 'Intel Corporation',
    location: 'Penang, Malaysia',
    base: [5.42, 100.27],
    global: true,
    customers: [{ name: 'Global Intel customers · multiple locations' }]
  },
  {
    period: 'Sep 2017 → Jan 2022',
    job: 'Manager — Functional Test · Functional Test Site Lead',
    company: 'Continental Automotive',
    location: 'Penang, Malaysia',
    base: [5.42, 100.27],
    customers: [
      { name: 'Toyota · Tokyo, Japan',                        lat: 35.68,  lon: 139.69 },
      { name: 'Volkswagen Group · Wolfsburg, Germany',        lat: 52.42,  lon: 10.78  },
      { name: 'Perodua · Kuala Lumpur, Malaysia',             lat: 3.14,   lon: 101.69 },
      { name: 'Suzuki · Hamamatsu, Japan',                    lat: 34.71,  lon: 137.73 }
    ]
  },
  {
    period: 'Mar 2011 → Jul 2017',
    job: 'Software Developer → Program Manager → Section Manager',
    company: 'Blaupunkt / Premium Sound Solutions',
    location: 'Penang, Malaysia',
    base: [5.42, 100.27],
    customers: [
      { name: 'Honda · New Delhi, India',                     lat: 28.61,  lon: 77.21  },
      { name: 'Proton · Kuala Lumpur, Malaysia',              lat: 3.14,   lon: 101.69 },
      { name: 'Volvo CE Korea · Seoul, South Korea',          lat: 37.57,  lon: 126.98 },
      { name: 'Renault Iran · Tehran, Iran',                  lat: 35.69,  lon: 51.39  },
      { name: 'ICL Japan · Tokyo, Japan',                     lat: 35.68,  lon: 139.69 },
      { name: 'Rockford US · Rockford, Illinois, USA',        lat: 42.27,  lon: -89.10 },
      { name: 'Iran System · Tehran, Iran',                   lat: 35.69,  lon: 51.39  },
      { name: 'Agco Fendt Germany · Marktoberdorf, Germany',  lat: 47.78,  lon: 10.62  },
      { name: 'Belarfonte Uruguay · Montevideo, Uruguay',     lat: -34.90, lon: -56.16 }
    ]
  },
  {
    period: 'Jul 2009 → Jul 2010',
    job: 'Project Manager — Software',
    company: 'Intel Corporation',
    location: 'Penang, Malaysia',
    base: [5.42, 100.27],
    customers: [{ name: 'SoC / Linux programmes · Penang, Malaysia', same: true }]
  },
  {
    period: 'Jul 2007 → Mar 2009',
    job: 'Operating Manager — Software',
    company: 'Agilent Technologies',
    location: 'Penang, Malaysia',
    base: [5.42, 100.27],
    customers: [
      { name: 'Nokia · Helsinki, Finland',                    lat: 60.17,  lon: 24.94  },
      { name: 'Jabil EMS · Penang, Malaysia',                 lat: 5.42,   lon: 100.27, same: true },
      { name: 'Rockwell · Milwaukee, Wisconsin, USA',         lat: 43.04,  lon: -87.91 }
    ]
  },
  {
    period: 'Nov 2005 → Jul 2007',
    job: 'Project Manager — Software',
    company: 'Bosch / Bosch–Blaupunkt',
    location: 'Penang, Malaysia',
    base: [5.42, 100.27],
    customers: [
      { name: 'GM Daewoo · Seoul, South Korea',               lat: 37.57,  lon: 126.98 },
      { name: 'Zao Volga · Moscow, Russia',                   lat: 55.76,  lon: 37.62  },
      { name: 'Nissan Britain · London, United Kingdom',      lat: 51.51,  lon: -0.13  },
      { name: 'GM Holden · Melbourne, Australia',             lat: -37.81, lon: 144.96 }
    ]
  },
  {
    period: '1995 → 2005',
    job: 'Foundations in engineering & education',
    company: 'Early Career & Academia',
    location: 'Malaysia / New Zealand',
    bases: [[3.14, 101.69], [-41.29, 174.78]],
    customers: [
      { name: 'Malaysia · Kuala Lumpur' },
      { name: 'New Zealand · Wellington' }
    ]
  }
];

/* ------------------------------------------------------------
   2. Stylised geography — approximate continental polygons
      [lon, lat]. Visual communication, not cartographic accuracy.
------------------------------------------------------------ */
const LAND_POLYS = [
  /* North America */
  [[-168,66],[-164,60],[-158,58],[-150,60],[-141,60],[-134,57],[-130,54],[-125,50],[-124,44],[-122,38],[-117,33],[-112,28],[-108,24],[-104,20],[-97,16],[-93,16],[-88,14],[-84,10],[-80,8],[-82,12],[-85,15],[-88,18],[-91,19],[-90,21],[-87,21],[-91,24],[-95,27],[-97,28],[-94,30],[-90,30],[-85,30],[-82,27],[-80,25],[-81,29],[-79,33],[-75,36],[-74,40],[-70,42],[-67,45],[-64,46],[-60,47],[-58,50],[-55,52],[-58,55],[-61,57],[-64,60],[-68,62],[-72,63],[-78,64],[-85,66],[-92,67],[-100,68],[-110,69],[-120,70],[-130,70],[-140,70],[-150,71],[-160,70],[-166,68]],
  /* Greenland */
  [[-57,64],[-53,60],[-45,60],[-39,62],[-32,66],[-25,69],[-20,72],[-20,76],[-28,80],[-40,83],[-52,82],[-58,79],[-62,76],[-63,72],[-60,68]],
  /* South America */
  [[-79,8],[-75,10],[-70,12],[-64,11],[-58,8],[-52,5],[-48,0],[-44,-2],[-39,-5],[-35,-8],[-36,-12],[-39,-15],[-41,-20],[-45,-24],[-49,-27],[-53,-32],[-57,-36],[-60,-39],[-64,-42],[-65,-46],[-68,-50],[-70,-54],[-73,-53],[-74,-48],[-73,-43],[-72,-38],[-71,-32],[-70,-25],[-70,-19],[-73,-15],[-76,-10],[-79,-5],[-81,0],[-79,4]],
  /* Africa */
  [[-6,35],[0,37],[8,37],[12,34],[18,32],[25,32],[31,31],[34,28],[36,23],[38,19],[41,15],[44,12],[48,12],[51,11],[48,6],[44,1],[41,-3],[40,-8],[38,-13],[35,-19],[33,-25],[29,-31],[24,-34],[19,-35],[17,-31],[15,-25],[13,-19],[12,-12],[11,-6],[9,-1],[9,3],[6,5],[1,6],[-4,6],[-9,5],[-13,8],[-16,11],[-17,15],[-17,20],[-15,24],[-11,28],[-8,32]],
  /* Eurasia mainland */
  [[-9,36],[-9,40],[-9,43],[-4,44],[-1,46],[2,49],[4,51],[7,53],[8,55],[13,55],[16,55],[19,56],[21,58],[22,60],[25,61],[28,63],[31,65],[33,66],[36,67],[40,67],[45,68],[50,69],[55,70],[62,70],[70,72],[80,73],[90,75],[100,76],[110,75],[120,73],[130,72],[140,71],[150,70],[160,70],[170,68],[176,66],[179,65],[178,63],[173,61],[168,60],[164,58],[162,54],[158,50],[152,46],[146,44],[140,42],[134,43],[131,42],[129,40],[127,37],[126,35],[124,37],[122,38],[120,36],[118,33],[122,31],[121,28],[116,23],[112,21],[109,18],[107,13],[105,9],[104,6],[104,2],[102,0],[100,2],[99,6],[97,12],[95,16],[92,20],[89,22],[86,20],[83,17],[80,12],[77,8],[74,12],[71,17],[68,22],[66,25],[62,25],[58,26],[55,25],[52,22],[49,19],[46,15],[43,12],[41,14],[39,18],[37,22],[35,26],[34,29],[33,31],[35,33],[35,36],[31,37],[27,37],[24,38],[21,38],[19,40],[16,41],[14,43],[11,44],[7,43],[4,42],[1,40],[-1,38],[-4,37]],
  /* Scandinavia */
  [[5,58],[5,61],[8,63],[12,65],[15,67],[18,69],[22,70],[26,71],[29,70],[30,68],[28,66],[25,65],[22,63],[19,61],[18,59],[16,57],[13,56],[10,57],[7,58]],
  /* Finland */
  [[21,59],[24,60],[27,60.5],[30,62],[29,65],[26,67],[24,66],[22,63],[20,61],[21,59]],
  /* Britain */
  [[-5,50],[-4,52],[-5,54],[-4,56],[-3,58],[-1,57],[0,55],[1,53],[1,51],[-2,50],[-4,50]],
  /* Ireland */
  [[-10,52],[-10,54],[-8,55],[-6,54],[-6,52],[-8,51]],
  /* Italy */
  [[7,44],[12,44],[14,42],[17,41],[16,38],[14,40],[12,42],[9,44]],
  /* Japan (widened arc) */
  [[129,31],[132,33],[135,34],[138,34.5],[140,35.5],[142,38],[144,41],[146,44],[145,45],[142,42],[140,38],[137,36],[133,34],[130,32]],
  /* Sumatra */
  [[94,5],[99,4],[103,0],[106,-4],[107,-6],[103,-5],[99,-1],[95,2],[94,5]],
  /* Borneo */
  [[109,1],[113,3],[117,2],[119,0],[117,-3],[113,-3],[110,-1],[109,1]],
  /* New Guinea */
  [[131,-1],[136,-2],[141,-3],[146,-6],[148,-9],[144,-9],[139,-8],[134,-6],[131,-3],[131,-1]],
  /* Philippines */
  [[120,18],[122,17],[123,14],[125,11],[123,9],[121,12],[120,15],[120,18]],
  /* Cuba */
  [[-84,22],[-80,23],[-75,20],[-78,20],[-82,21],[-84,22]],
  /* New Zealand — North Island */
  [[172,-34],[175,-36],[178,-38],[176,-40],[175,-41.5],[173,-41],[172,-39],[172,-36]],
  /* New Zealand — South Island */
  [[167,-44],[170,-42],[173,-41],[172,-44],[169,-47],[167,-46],[167,-44]],
  /* Madagascar */
  [[44,-12],[47,-13],[50,-16],[49,-20],[47,-24],[44,-25],[43,-21],[43,-16],[44,-12]],
  /* Iceland */
  [[-22,64],[-18,66],[-14,66],[-15,64],[-19,63],[-22,64]],
  /* Australia */
  [[113,-25],[116,-20],[122,-17],[127,-14],[131,-12],[136,-12],[139,-17],[142,-11],[146,-15],[149,-20],[153,-25],[153,-30],[150,-35],[146,-39],[141,-38],[137,-35],[132,-32],[126,-32],[121,-34],[116,-34],[114,-30],[113,-25]]
];
const ANT_LAT = -61;

function pointInPoly(lon, lat, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function isLand(lon, lat) {
  if (lat <= ANT_LAT) return true; /* Antarctica band */
  for (let p = 0; p < LAND_POLYS.length; p++) {
    if (pointInPoly(lon, lat, LAND_POLYS[p])) return true;
  }
  return false;
}

/* ------------------------------------------------------------
   3. Grid constants — equal-sized hexagonal tiles
------------------------------------------------------------ */
const R_GLOBE = 10;
const MAP_W   = 62;
const K       = MAP_W / 360;                 /* world units per degree */
const HEX     = 0.55;                        /* hex circumradius (spacing) */
const ROW_H   = Math.sqrt(3) * HEX;          /* vertical row step */
const COL_W   = 1.5 * HEX;                   /* horizontal column step */
const LAT_MIN = -62, LAT_MAX = 82;
const MAP_CY  = ((LAT_MIN + LAT_MAX) / 2) * K;
const FOV     = 45;

function ll2xy(lat, lon) { return { x: lon * K, y: lat * K }; }

/* Build the flat-map hex grid (identity of every tile is kept for the morph). */
const tiles = [];
(function buildGrid() {
  const qMax = Math.ceil((MAP_W / 2) / COL_W);
  for (let q = -qMax; q <= qMax; q++) {
    const x = q * COL_W;
    const lon = x / K;
    if (lon < -179 || lon > 179) continue;
    const yOff = (q & 1) ? ROW_H / 2 : 0;
    const rLo = Math.floor((LAT_MIN * K - yOff) / ROW_H) - 1;
    const rHi = Math.ceil((LAT_MAX * K - yOff) / ROW_H) + 1;
    for (let r = rLo; r <= rHi; r++) {
      const y = r * ROW_H + yOff;
      const lat = y / K;
      if (lat < LAT_MIN - 0.5 || lat > LAT_MAX + 0.5) continue;
      tiles.push({ x: x, y: y, lat: lat, lon: lon, land: isLand(lon, lat) });
    }
  }
})();
const N = tiles.length;
for (let i = 0; i < N; i++) {
  tiles[i].delay = 0.28 * ((tiles[i].x + MAP_W / 2) / MAP_W); /* west → east peel */
}

/* ------------------------------------------------------------
   4. HUD / DOM
------------------------------------------------------------ */
const STYLE = document.createElement('style');
STYLE.textContent = [
  'html,body{margin:0;padding:0;background:#04070d;overflow:hidden;overscroll-behavior:none;',
  '  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}',
  '#ch-root{position:fixed;inset:0;background:#04070d;color:#e8eef7;touch-action:none;',
  '  user-select:none;-webkit-user-select:none;overflow:hidden;}',
  '#ch-root canvas{position:absolute;inset:0;display:block;}',
  '.ch-vignette{position:absolute;inset:0;pointer-events:none;z-index:2;',
  '  background:radial-gradient(120% 90% at 50% 42%,rgba(4,7,13,0) 55%,rgba(2,4,8,.55) 100%);}',
  '.ch-top{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;align-items:flex-start;',
  '  justify-content:space-between;padding:18px 20px;pointer-events:none;}',
  '.ch-title{font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#eaf2ff;',
  '  text-shadow:0 1px 8px rgba(0,0,0,.6);}',
  '.ch-title b{color:#5fd4ff;font-weight:700;}',
  '.ch-sub{margin-top:5px;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:10.5px;',
  '  letter-spacing:.14em;text-transform:uppercase;color:#7f93ad;}',
  '.ch-home{pointer-events:auto;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;',
  '  letter-spacing:.1em;text-transform:uppercase;color:#9fb6d4;background:rgba(10,16,26,.6);',
  '  border:1px solid rgba(120,180,255,.22);border-radius:999px;padding:8px 14px;',
  '  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:all .2s;}',
  '.ch-home:hover{color:#fff;border-color:rgba(120,180,255,.55);}',
  '.ch-hint{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);z-index:5;',
  '  font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:10.5px;letter-spacing:.16em;',
  '  text-transform:uppercase;color:#7f93ad;background:rgba(8,13,22,.55);border:1px solid rgba(120,180,255,.14);',
  '  border-radius:999px;padding:8px 16px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
  '  pointer-events:none;white-space:nowrap;transition:opacity .5s;}',
  '.ch-card{position:absolute;left:22px;bottom:52px;z-index:6;width:min(400px,calc(100vw - 44px));',
  '  background:rgba(7,12,20,.8);border:1px solid rgba(120,180,255,.18);border-radius:16px;',
  '  padding:18px 20px 16px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
  '  box-shadow:0 18px 50px rgba(0,0,0,.5);opacity:0;transform:translateY(16px);',
  '  transition:opacity .5s ease,transform .5s ease;pointer-events:auto;}',
  '.ch-card.ch-show{opacity:1;transform:translateY(0);}',
  '.ch-card-body{transition:opacity .18s ease,transform .18s ease;}',
  '.ch-card.ch-hide .ch-card-body{opacity:0;transform:translateY(6px);}',
  '.ch-count{position:absolute;top:16px;right:18px;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;',
  '  font-size:11px;color:#5fd4ff;letter-spacing:.12em;}',
  '.ch-period{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:11px;color:#8fa7c4;',
  '  letter-spacing:.05em;margin-bottom:8px;padding-right:64px;}',
  '.ch-period b{color:#ffd08a;font-weight:600;}',
  '.ch-job{font-size:17px;line-height:1.3;font-weight:700;letter-spacing:-.01em;color:#f2f6fc;margin:0 0 8px;}',
  '.ch-co{font-size:13px;color:#5fd4ff;font-weight:600;margin-bottom:3px;}',
  '.ch-loc{font-size:12px;color:#93a7c0;margin-bottom:12px;}',
  '.ch-loc b{color:#c7d5e8;font-weight:600;}',
  '.ch-clabel{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:10px;letter-spacing:.18em;',
  '  text-transform:uppercase;color:#647b99;margin-bottom:7px;}',
  '.ch-customers{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:5px 14px;}',
  '.ch-customers li{font-size:12.5px;color:#b9c8dc;display:flex;align-items:center;gap:7px;line-height:1.45;}',
  '.ch-customers li i{width:6px;height:6px;border-radius:50%;background:#5fd4ff;flex:0 0 auto;',
  '  box-shadow:0 0 8px rgba(95,212,255,.8);font-style:normal;}',
  '.ch-customers li.ch-base i{background:#ffb454;box-shadow:0 0 8px rgba(255,180,84,.8);}',
  '.ch-note{margin-top:9px;font-size:11px;color:#647b99;font-style:italic;}',
  '.ch-bar{margin-top:14px;height:3px;border-radius:2px;background:rgba(120,180,255,.14);overflow:hidden;}',
  '.ch-bar div{height:100%;background:linear-gradient(90deg,#5fd4ff,#8fe3ff);border-radius:2px;',
  '  transition:width .5s ease;}',
  '.ch-end{position:absolute;inset:0;z-index:9;display:flex;flex-direction:column;align-items:center;',
  '  justify-content:center;gap:10px;background:rgba(4,7,13,.82);backdrop-filter:blur(10px);',
  '  -webkit-backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:opacity .6s;}',
  '.ch-end.ch-show{opacity:1;pointer-events:auto;}',
  '.ch-end h3{margin:0;font-size:20px;letter-spacing:.02em;color:#f2f6fc;}',
  '.ch-end p{margin:0;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:12px;',
  '  letter-spacing:.14em;text-transform:uppercase;color:#5fd4ff;}',
  '.ch-load{position:absolute;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;',
  '  background:#04070d;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:11px;',
  '  letter-spacing:.22em;text-transform:uppercase;color:#5f7793;transition:opacity .6s;}',
  '.ch-load.ch-gone{opacity:0;pointer-events:none;}',
  '@media (max-width:680px){',
  '  .ch-top{padding:14px 14px;}',
  '  .ch-title{font-size:11.5px;}',
  '  .ch-card{left:10px;right:10px;bottom:52px;width:auto;padding:15px 16px 13px;}',
  '  .ch-job{font-size:15px;}',
  '  .ch-customers{max-height:23vh;overflow-y:auto;}',
  '  .ch-hint{bottom:12px;font-size:9.5px;padding:7px 13px;}',
  '}'
].join('\n');
document.head.appendChild(STYLE);

const root = document.createElement('div');
root.id = 'ch-root';
root.innerHTML =
  '<div class="ch-vignette"></div>' +
  '<header class="ch-top">' +
    '<div><div class="ch-title">Career History <b>·</b> Graphical</div>' +
    '<div class="ch-sub">Most Recent → Older</div></div>' +
    '<button class="ch-home" type="button">← Profile</button>' +
  '</header>' +
  '<div class="ch-hint" id="chHint">Assembling hexagonal Earth…</div>' +
  '<aside class="ch-card" id="chCard" aria-live="polite"><div class="ch-card-body" id="chCardBody"></div></aside>' +
  '<div class="ch-end" id="chEnd"><h3>Career tour complete</h3><p>Returning to profile…</p></div>' +
  '<div class="ch-load" id="chLoad">Loading 3D engine…</div>';
document.body.appendChild(root);

const elHint = root.querySelector('#chHint');
const elCard = root.querySelector('#chCard');
const elCardBody = root.querySelector('#chCardBody');
const elEnd = root.querySelector('#chEnd');
const elLoad = root.querySelector('#chLoad');
root.querySelector('.ch-home').addEventListener('click', goProfile);

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function pad2(n) { return (n < 10 ? '0' : '') + n; }

function renderCard(i) {
  const j = CAREER[i];
  let html = '';
  html += '<div class="ch-count">' + pad2(i + 1) + ' / ' + pad2(CAREER.length) + '</div>';
  html += '<div class="ch-period">Service period: <b>' + esc(j.period) + '</b></div>';
  html += '<h2 class="ch-job">' + esc(j.job) + '</h2>';
  html += '<div class="ch-co">◆ ' + esc(j.company) + '</div>';
  html += '<div class="ch-loc">Company location · <b>' + esc(j.location) + '</b></div>';
  html += '<div class="ch-clabel">Customer whereabouts</div>';
  html += '<ul class="ch-customers">';
  if (j.bases) {
    for (let b = 0; b < j.bases.length; b++) {
      html += '<li class="ch-base"><i></i>' + esc(j.customers[b] ? j.customers[b].name : 'Base') + '</li>';
    }
  } else {
    for (let c = 0; c < j.customers.length; c++) {
      html += '<li><i></i>' + esc(j.customers[c].name) + '</li>';
    }
  }
  html += '</ul>';
  if (j.global) html += '<div class="ch-note">Global spread shown on map</div>';
  html += '<div class="ch-bar"><div style="width:' + (((i + 1) / CAREER.length) * 100) + '%"></div></div>';
  return html;
}

function swapCard(i) {
  elCard.classList.add('ch-hide');
  setTimeout(function () {
    elCardBody.innerHTML = renderCard(i);
    elCard.classList.remove('ch-hide');
    elCard.classList.add('ch-show');
  }, 180);
}

function goProfile() {
  elEnd.classList.add('ch-show');
  setTimeout(function () { window.location.href = 'index.html'; }, 1000);
}

/* ------------------------------------------------------------
   5. Load Three.js from CDN, then build the scene
------------------------------------------------------------ */
const CDNS = [
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
  'https://unpkg.com/three@0.160.0/build/three.module.js'
];
(async function () {
  let THREE = null;
  for (let i = 0; i < CDNS.length; i++) {
    try { THREE = await import(CDNS[i]); break; } catch (e) { /* try next */ }
  }
  if (!THREE) {
    elLoad.textContent = 'Could not load three.js — check your connection.';
    return;
  }
  try { initScene(THREE); }
  catch (err) {
    elLoad.textContent = 'WebGL initialisation failed on this device.';
  }
})();

/* ------------------------------------------------------------
   6. Scene
------------------------------------------------------------ */
function initScene(THREE) {

  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    elLoad.textContent = 'WebGL is not available on this device.';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  root.insertBefore(renderer.domElement, root.firstChild);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04070d);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 700);
  const vGlobeCam = new THREE.Vector3(0, 3.2, 26.5);
  camera.position.copy(vGlobeCam);
  camera.lookAt(0, 0, 0);

  /* Lights — keep land/ocean hues vivid; no fog (contrast safety). */
  scene.add(new THREE.HemisphereLight(0x8fb8e8, 0x0a1220, 1.0));
  const sun = new THREE.DirectionalLight(0xffffff, 0.75);
  sun.position.set(12, 18, 26);
  scene.add(sun);

  /* Starfield backdrop */
  (function stars() {
    const SN = 380, arr = new Float32Array(SN * 3);
    for (let i = 0; i < SN; i++) {
      const rr = 150 + Math.random() * 130;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = rr * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = rr * Math.cos(ph);
      arr[i * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const m = new THREE.PointsMaterial({ color: 0x4a6d94, size: 1.15, transparent: true,
      opacity: 0.55, sizeAttenuation: true, depthWrite: false });
    scene.add(new THREE.Points(g, m));
  })();

  /* Ocean bases: globe core sphere + flat map plane (crossfaded) */
  const baseGlobe = new THREE.Mesh(
    new THREE.SphereGeometry(R_GLOBE - 0.14, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0x06121f, transparent: true, opacity: 1 })
  );
  scene.add(baseGlobe);

  const MAP_H = (LAT_MAX - LAT_MIN) * K;
  const basePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP_W + 10, MAP_H + 10),
    new THREE.MeshBasicMaterial({ color: 0x07131f, transparent: true, opacity: 0 })
  );
  basePlane.position.set(0, MAP_CY, -0.34);
  scene.add(basePlane);

  /* ---------- Hex tile instanced mesh ---------- */
  const tileGeo = new THREE.CylinderGeometry(HEX * 0.9, HEX * 0.9, 0.3, 6);
  tileGeo.rotateX(Math.PI / 2);                 /* hexagon face in XY, depth along Z */
  const tileMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const mesh = new THREE.InstancedMesh(tileGeo, tileMat, N);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);

  /* Per-tile state */
  const gp = new Array(N);      /* globe position */
  const gq = new Array(N);      /* globe orientation */
  const mp = new Array(N);      /* flat-map position */
  const dummy = new THREE.Object3D();
  const UP = new THREE.Vector3(0, 1, 0);
  const Y_AXIS = new THREE.Vector3(0, 1, 0);

  /* Fibonacci sphere slots, then pair to tiles by sorted (lat, lon)
     so continents stay aligned between globe and map. */
  const slots = new Array(N);
  const GOLDEN = 2.399963229728653;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    const y = 1 - 2 * t;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * GOLDEN;
    const x = Math.cos(th) * rad, z = Math.sin(th) * rad;
    slots[i] = {
      lat: Math.asin(y) * 180 / Math.PI,
      lon: Math.atan2(x, z) * 180 / Math.PI,
      n: new THREE.Vector3(x, y, z)
    };
  }
  const tileOrder = tiles.map(function (_, i) { return i; })
    .sort(function (a, b) { return tiles[a].lat - tiles[b].lat || tiles[a].lon - tiles[b].lon; });
  const slotOrder = slots.map(function (_, i) { return i; })
    .sort(function (a, b) { return slots[a].lat - slots[b].lat || slots[a].lon - slots[b].lon; });

  const colOcean = new THREE.Color();
  const colLand = new THREE.Color();
  const east = new THREE.Vector3(), north = new THREE.Vector3(), basis = new THREE.Matrix4();

  for (let k = 0; k < N; k++) {
    const ti = tileOrder[k], si = slotOrder[k];
    const T = tiles[ti], S = slots[si];

    /* Globe transform */
    const n = S.n;
    gp[ti] = n.clone().multiplyScalar(R_GLOBE + (T.land ? 0.16 : 0));
    east.crossVectors(UP, n);
    if (east.lengthSq() < 1e-6) east.set(1, 0, 0);
    east.normalize();
    north.crossVectors(n, east).normalize();
    basis.makeBasis(east, north, n);
    gq[ti] = new THREE.Quaternion().setFromRotationMatrix(basis);

    /* Flat-map transform */
    mp[ti] = new THREE.Vector3(T.x, T.y, T.land ? 0.16 : 0);

    /* Colour: green/teal land vs blue ocean, slight per-tile variance */
    if (T.land) {
      colLand.setHSL(0.40 + Math.random() * 0.04, 0.58, 0.36 + Math.random() * 0.08);
      mesh.setColorAt(ti, colLand);
    } else {
      colOcean.setHSL(0.56 + Math.random() * 0.02, 0.62, 0.21 + Math.random() * 0.05);
      mesh.setColorAt(ti, colOcean);
    }

    /* Initial matrix (globe) */
    dummy.position.copy(gp[ti]);
    dummy.quaternion.copy(gq[ti]);
    dummy.updateMatrix();
    mesh.setMatrixAt(ti, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  /* ---------- FX root (markers + arcs) ---------- */
  const fxRoot = new THREE.Group();
  scene.add(fxRoot);
  let fxPivots = [], fxPulses = [], fxHalos = [], fxOrbit = null;

  function disposeFX() {
    fxRoot.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    fxRoot.clear();
    fxPivots = []; fxPulses = []; fxHalos = []; fxOrbit = null;
  }

  const AMBER = 0xffb454, CYAN = 0x5fd4ff;

  function makeBaseMarker(px, py) {
    const pivot = new THREE.Group();
    pivot.position.set(px, py, 0);
    const hex = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.14, 6),
      new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.35 }));
    hex.geometry.rotateX(Math.PI / 2); hex.position.z = 0.30;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.5, 8),
      new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.85 }));
    stem.geometry.rotateX(Math.PI / 2); stem.position.z = 1.0;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12),
      new THREE.MeshBasicMaterial({ color: AMBER }));
    head.position.z = 1.85;
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.86, 48),
      new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.5,
        side: THREE.DoubleSide, depthWrite: false }));
    halo.position.z = 0.36;
    pivot.add(hex, stem, head, halo);
    fxRoot.add(pivot);
    fxPivots.push(pivot);
    fxHalos.push({ mesh: halo, off: Math.random() });
    return pivot;
  }

  function makeCustomerMarker(px, py) {
    const pivot = new THREE.Group();
    pivot.position.set(px, py, 0);
    const hex = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.1, 6),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.28 }));
    hex.geometry.rotateX(Math.PI / 2); hex.position.z = 0.28;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 6),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.7 }));
    stem.geometry.rotateX(Math.PI / 2); stem.position.z = 0.7;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10),
      new THREE.MeshBasicMaterial({ color: CYAN }));
    head.position.z = 1.25;
    pivot.add(hex, stem, head);
    fxRoot.add(pivot);
    fxPivots.push(pivot);
    return pivot;
  }

  function makeArc(p0, p2, color) {
    const dx = p2.x - p0.x, dy = p2.y - p0.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.01) return null;
    const v0 = new THREE.Vector3(p0.x, p0.y, 0.42);
    const v2 = new THREE.Vector3(p2.x, p2.y, 0.42);
    const mid = new THREE.Vector3(
      (p0.x + p2.x) / 2 - dy / len * len * 0.14,
      (p0.y + p2.y) / 2 + dx / len * len * 0.14,
      0.5 + Math.min(9, len * 0.20)
    );
    const curve = new THREE.QuadraticBezierCurve3(v0, mid, v2);
    const pts = curve.getPoints(44);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: color, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false }));
    fxRoot.add(line);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xa8ecff, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false }));
    fxRoot.add(dot);
    fxPulses.push({ dot: dot, curve: curve, spd: 0.10 + Math.random() * 0.06, off: Math.random() });
    return curve;
  }

  function buildJobFX(i) {
    disposeFX();
    const j = CAREER[i];
    const framePts = [];

    if (j.bases) {
      /* Early career: two base locations linked together */
      for (let b = 0; b < j.bases.length; b++) {
        const p = ll2xy(j.bases[b][0], j.bases[b][1]);
        makeBaseMarker(p.x, p.y);
        framePts.push(p);
      }
      const a = ll2xy(j.bases[0][0], j.bases[0][1]);
      const b = ll2xy(j.bases[1][0], j.bases[1][1]);
      makeArc(a, b, AMBER);
      return framePts;
    }

    const base = ll2xy(j.base[0], j.base[1]);
    makeBaseMarker(base.x, base.y);
    framePts.push(base);

    const list = j.global ? GLOBAL_HUBS : j.customers;
    for (let c = 0; c < list.length; c++) {
      const cust = list[c];
      if (cust.same) {
        /* On-site programme: orbit ring around the company pin */
        fxOrbit = {
          cx: base.x, cy: base.y, r: 1.7,
          dot: (function () {
            const d = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8),
              new THREE.MeshBasicMaterial({ color: 0xffd08a, transparent: true, opacity: 0.95,
                blending: THREE.AdditiveBlending, depthWrite: false }));
            fxRoot.add(d);
            return d;
          })()
        };
        continue;
      }
      const cp = ll2xy(cust.lat, cust.lon);
      makeCustomerMarker(cp.x, cp.y);
      makeArc(base, cp, CYAN);
      framePts.push(cp);
    }
    return framePts;
  }

  /* ---------- Camera framing ---------- */
  let W = 1, H = 1, aspect = 1, dAll = 60;
  const camGoal = { x: 0, y: MAP_CY, d: 60 };
  let camX = 0, camY = MAP_CY, camD = 26.5;
  const tanV = Math.tan(FOV * Math.PI / 360);

  function resize() {
    W = root.clientWidth; H = root.clientHeight;
    aspect = W / Math.max(1, H);
    renderer.setSize(W, H);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const sx = MAP_W + 10, sy = MAP_H + 10;
    dAll = Math.max(sx / 2 / (tanV * aspect), sy / 2 / tanV) * 1.06;
    if (phase >= 2) frameJob(currentJob, false);
  }

  function framePoints(pts) {
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (let i = 0; i < pts.length; i++) {
      minX = Math.min(minX, pts[i].x); maxX = Math.max(maxX, pts[i].x);
      minY = Math.min(minY, pts[i].y); maxY = Math.max(maxY, pts[i].y);
    }
    const sx = Math.max(14, maxX - minX + 18);
    const sy = Math.max(10, maxY - minY + 14);
    let d = Math.max(sx / 2 / (tanV * aspect), sy / 2 / tanV) * 1.22;
    d = Math.min(d, dAll);
    d = Math.max(d, 15);
    const cx = (minX + maxX) / 2;
    let cy = (minY + maxY) / 2;
    if (aspect < 0.85) cy -= d * tanV * 0.20;   /* lift map above the card on portrait */
    return { x: cx, y: cy, d: d };
  }

  function frameJob(i, swap) {
    if (i == null) return;
    const pts = buildJobFX(i);
    const g = framePoints(pts);
    camGoal.x = g.x; camGoal.y = g.y; camGoal.d = g.d;
    if (swap) swapCard(i);
  }

  /* ---------- Career navigation ---------- */
  let phase = 0;               /* 0 globe spin · 1 morph · 2 map / nav */
  let navEnabled = false;
  let currentJob = 0;
  let locked = false;
  let accum = 0;

  const SPIN_END = 1.0;
  const MORPH_DUR = 1.28;

  function move(dir) {
    if (!navEnabled) return;
    if (locked) return;
    const next = currentJob + dir;
    if (next < 0) return;
    if (next >= CAREER.length) { goProfile(); return; }
    locked = true;
    setTimeout(function () { locked = false; }, 720);
    currentJob = next;
    frameJob(currentJob, true);
  }

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (!navEnabled) return;
    accum += e.deltaY;
    if (Math.abs(accum) < 26) return;
    const dir = accum > 0 ? 1 : -1;
    accum = 0;
    move(dir);
  }, { passive: false });

  let touchY = null;
  root.addEventListener('touchstart', function (e) {
    touchY = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (touchY == null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(dy) > 46) move(dy > 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { move(1); }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') { move(-1); }
  });

  /* ---------- Intro / morph ---------- */
  const clock = new THREE.Clock();
  let T = 0;
  const vTmp = new THREE.Vector3();
  const vSpin = new THREE.Vector3();
  const qTmp = new THREE.Quaternion();
  const Q_ID = new THREE.Quaternion();
  const easeIO = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const SPIN_TOTAL = REDUCED ? 0.15 : 0.55;
  let started = false;

  resize();
  window.addEventListener('resize', resize);

  elLoad.classList.add('ch-gone');

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    T += dt;

    /* --- Phase 0/1: globe spin + unfolding morph --- */
    if (phase < 2) {
      const g = easeIO(Math.min(1, Math.max(0, (T - SPIN_END) / MORPH_DUR)));
      let theta;
      if (T < SPIN_END) theta = SPIN_TOTAL * (T / SPIN_END);
      else theta = SPIN_TOTAL * (1 - g);

      for (let i = 0; i < N; i++) {
        const e = easeIO(Math.min(1, Math.max(0, (T - SPIN_END - tiles[i].delay) / 1.0)));
        vSpin.copy(gp[i]).applyAxisAngle(Y_AXIS, theta);
        vTmp.lerpVectors(vSpin, mp[i], e);
        qTmp.copy(gq[i]).slerp(Q_ID, e);
        dummy.position.copy(vTmp);
        dummy.quaternion.copy(qTmp);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      baseGlobe.material.opacity = 1 - g;
      basePlane.material.opacity = g;
      baseGlobe.visible = g < 0.999;

      /* Camera: globe view → full-map view */
      const vMapAll = framePoints([{ x: -MAP_W / 2, y: LAT_MIN * K }, { x: MAP_W / 2, y: LAT_MAX * K }]);
      camera.position.set(
        vGlobeCam.x + (vMapAll.x - vGlobeCam.x) * g,
        vGlobeCam.y + (vMapAll.y - vGlobeCam.y) * g,
        vGlobeCam.z + (vMapAll.d - vGlobeCam.z) * g
      );
      camera.lookAt(0, MAP_CY * g, 0);
      camX = camera.position.x; camY = MAP_CY; camD = camera.position.z;

      if (T >= SPIN_END + MORPH_DUR + 0.1) {
        phase = 2;
        navEnabled = true;
        currentJob = 0;
        frameJob(0, false);
        elCardBody.innerHTML = renderCard(0);
        elCard.classList.add('ch-show');
        elHint.textContent = 'Scroll to move through career';
      }
    }
    /* --- Phase 2: settled map, camera glides between jobs --- */
    else {
      const kk = 1 - Math.exp(-dt * 3.2);
      camX += (camGoal.x - camX) * kk;
      camY += (camGoal.y - camY) * kk;
      camD += (camGoal.d - camD) * kk;
      const amp = REDUCED ? 0 : Math.min(1, camD / 60) * 0.5;
      const swx = Math.sin(T * 0.12) * amp;
      const swy = Math.cos(T * 0.09) * amp * 0.7;
      camera.position.set(camX + swx, camY + swy, camD);
      camera.lookAt(camX + swx * 0.4, camY + swy * 0.4, 0);

      /* FX scale compensation so markers stay readable at any zoom */
      const m = THREE.MathUtils.clamp(camD / 30, 1, 4.6);
      for (let i = 0; i < fxPivots.length; i++) fxPivots[i].scale.setScalar(m);
      for (let i = 0; i < fxPulses.length; i++) {
        const p = fxPulses[i];
        const u = (T * p.spd + p.off) % 1;
        p.curve.getPoint(u, vTmp);
        p.dot.position.copy(vTmp);
        p.dot.scale.setScalar(m);
      }
      for (let i = 0; i < fxHalos.length; i++) {
        const h = fxHalos[i];
        const ph = (T * 0.55 + h.off) % 1;
        h.mesh.scale.setScalar(m * (1 + ph * 1.5));
        h.mesh.material.opacity = (1 - ph) * 0.5;
      }
      if (fxOrbit) {
        const a = T * 1.2;
        fxOrbit.dot.position.set(fxOrbit.cx + Math.cos(a) * fxOrbit.r,
                                   fxOrbit.cy + Math.sin(a) * fxOrbit.r, 1.2);
        fxOrbit.dot.scale.setScalar(m);
      }
    }

    renderer.render(scene, camera);
  }
  tick();
}

} /* main */
})();