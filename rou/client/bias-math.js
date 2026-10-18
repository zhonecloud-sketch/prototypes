// Mathematical kernel copied from ../bias_calc/index.html on 2026-10-18.
// Preserve calculator parity; UI safeguards live in insights-model.js.
function logGamma(x) {
  const g = 7;
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = C[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += C[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

function betacf(a, b, x) {
  const MAXIT = 300, EPS = 3e-12, FPMIN = 1e-300;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

function incBeta(a, b, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const logBt = logGamma(a + b) - logGamma(a) - logGamma(b)
              + a * Math.log(x) + b * Math.log(1 - x);
  const bt = Math.exp(logBt);
  if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
  return 1 - bt * betacf(b, a, 1 - x) / b;
}

function binomCDF(k, n, p) {
  if (k < 0) return 0;
  if (k >= n) return 1;
  if (p <= 0) return 1;
  if (p >= 1) return k >= n ? 1 : 0;
  return incBeta(n - k, k + 1, 1 - p);
}
function binomSF(k, n, p) {
  if (k <= 0) return 1;
  if (k > n) return 0;
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return incBeta(k, n - k + 1, p);
}
function twoSidedP(k, n, p0) {
  if (n === 0) return 1;
  const lower = binomCDF(k, n, p0);
  const upper = binomSF(k, n, p0);
  return Math.min(1, 2 * Math.min(lower, upper));
}

function criticalRegion(n, p0, alpha) {
  const target = alpha / 2;
  let cLow = -1;
  if (binomCDF(0, n, p0) <= target) {
    let lo = 0, hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      if (binomCDF(mid, n, p0) <= target) lo = mid; else hi = mid - 1;
    }
    cLow = lo;
  }
  let cHigh = n + 1;
  if (binomSF(n, n, p0) <= target) {
    let lo = 0, hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (binomSF(mid, n, p0) <= target) hi = mid; else lo = mid + 1;
    }
    cHigh = lo;
  }
  return [cLow, cHigh];
}

function exactPower(n, p1, p0, alpha) {
  const [cLow, cHigh] = criticalRegion(n, p0, alpha);
  let power = 0;
  if (cLow >= 0) power += binomCDF(cLow, n, p1);
  if (cHigh <= n) power += binomSF(cHigh, n, p1);
  return Math.min(1, power);
}

function requiredN(p1, p0, alpha, power) {
  if (Math.abs(p1 - p0) < 1e-12) return Infinity;
  const zA = 1.959963984540054, zB = 0.8416212335729143;
  const est = Math.pow(zA * Math.sqrt(p0 * (1 - p0)) + zB * Math.sqrt(p1 * (1 - p1)), 2) / Math.pow(p1 - p0, 2);
  let lo = Math.max(1, Math.floor(est * 0.3));
  let hi = Math.max(lo + 1, Math.ceil(est * 3));
  let guard = 0;
  while (exactPower(hi, p1, p0, alpha) < power && guard < 40) {
    hi *= 2; guard++;
    if (hi > 1e8) return Infinity;
  }
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (exactPower(mid, p1, p0, alpha) >= power) hi = mid; else lo = mid + 1;
  }
  return lo;
}

function betaQuantile(p, a, b) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  let lo = 0, hi = 1;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (incBeta(a, b, mid) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
export { twoSidedP, criticalRegion, exactPower, requiredN, incBeta, betaQuantile };
