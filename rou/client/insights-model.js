import { twoSidedP, requiredN, exactPower, incBeta, betaQuantile } from './bias-math.js';

export const MODEL = Object.freeze({ version: 'insights-gap-labels-2026-10-23', alpha: 0.05, monitorAlpha: 0.001, power: 0.8, minimumEffect: 0.05, veryLargeEffect: 0.10 });
const MAX_PLAN = 100_000_000;

function fixedEffectPlan(p0, alpha, power) {
  // Five percentage points, not five percent of the fair win probability.
  const targets = [p0 - MODEL.minimumEffect, p0 + MODEL.minimumEffect].filter(p => p >= 0 && p <= 1);
  let required = Math.max(...targets.map(p1 => requiredN(p1, p0, alpha, power)));
  if (!Number.isSafeInteger(required) || required > MAX_PLAN) return { required: null, attainedPower: null };
  let attainedPower = Math.min(...targets.map(p1 => exactPower(required, p1, p0, alpha)));
  // Exact binomial power has discrete steps. Verify both directions at the
  // shared target instead of assuming the larger directional N covers both.
  while (attainedPower < power && required < MAX_PLAN) {
    required++;
    attainedPower = Math.min(...targets.map(p1 => exactPower(required, p1, p0, alpha)));
  }
  return attainedPower >= power ? { required, attainedPower } : { required: null, attainedPower: null };
}

export function evaluateBinomial(wins, n, p0, { alpha = MODEL.monitorAlpha, power = MODEL.power } = {}) {
  if (!Number.isSafeInteger(n) || n < 0 || !Number.isSafeInteger(wins) || wins < 0 || wins > n ||
      !(p0 > 0 && p0 < 1) || !(alpha >= 0.000001 && alpha <= 0.5) || !(power >= 0.01 && power <= 0.99)) {
    throw new Error('Invalid Bias Calculator inputs.');
  }
  const minimumEffect = MODEL.minimumEffect;
  const lowerTarget = p0 >= minimumEffect ? p0 - minimumEffect : null;
  const upperTarget = p0 <= 1 - minimumEffect ? p0 + minimumEffect : null;
  const thresholds = { minimumEffect, lowerTarget, upperTarget };
  if (!n) return { n: 0, wins: 0, p0, alpha, power, ...thresholds, observed: null, gap: null, meetsEffectThreshold: false, veryLargeGap: false, required: null, remaining: null, status: 'empty', ready: false };
  const observed = wins / n;
  const gap = observed - p0;
  // Only absorb floating-point roundoff at the inclusive five-point boundary.
  const meetsEffectThreshold = Math.abs(gap) + 4 * Number.EPSILON >= minimumEffect;
  const veryLargeGap = Math.abs(gap) + 4 * Number.EPSILON >= MODEL.veryLargeEffect;
  const { required, attainedPower } = fixedEffectPlan(p0, alpha, power);
  const p = twoSidedP(wins, n, p0);
  const ready = required !== null && n >= required;
  const status = !meetsEffectThreshold ? 'ordinary' : !ready ? 'insufficient' : p < alpha ? (gap > 0 ? 'advantage' : 'inverted') : 'ordinary';
  const a = wins + 1, b = n - wins + 1;
  return {
    n, wins, p0, observed, alpha, power, p, ready, status, ...thresholds, gap, meetsEffectThreshold, veryLargeGap,
    required, planningLimit: MAX_PLAN, remaining: required !== null ? Math.max(0, required - n) : null,
    attainedPower,
    interval: [betaQuantile(0.025, a, b), betaQuantile(0.975, a, b)],
    probabilityAbove: 1 - incBeta(a, b, p0), probabilityBelow: incBeta(a, b, p0),
  };
}

export function makeRecord({ owner, epoch, round, bets, sourceId, drawKey }) {
  if (!Number.isInteger(round.outcome) || round.outcome < 0 || round.outcome > 36) return null;
  const stake = bets.reduce((s, b) => s + b.amount, 0);
  const gross = Array.from({ length: 37 }, (_, j) => bets.reduce((s, b) => s + (b.nums.includes(j) ? b.amount * b.gross : 0), 0));
  if (!Number.isSafeInteger(stake) || gross.some(v => !Number.isSafeInteger(v))) throw new Error('Invalid recorded payoff.');
  const expected = gross.reduce((s, v) => s + v, 0) / 37 - stake;
  const variance = gross.reduce((s, v) => s + (v - stake - expected) ** 2, 0) / 37;
  return {
    id: `${owner}:${sourceId}:${round.id}`, scope: `${owner}:${epoch}`, owner, epoch,
    settledAt: round.start + 27_000, roundId: round.id, sourceId, drawKey,
    outcome: round.outcome, stake, returned: gross[round.outcome],
    net: gross[round.outcome] - stake, expected, variance,
    winningPockets: gross.filter(v => v > stake).length,
    bets: bets.map(({ id, label, amount, nums, gross: payout }) => ({ id, label, amount, nums, gross: payout })),
  };
}

const RED = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
export const PATTERNS = [
  ...Array.from({ length: 37 }, (_, n) => ({ name: `Number ${n}`, nums: [n] })),
  { name: 'Red', nums: RED }, { name: 'Black', nums: Array.from({ length: 36 }, (_, i) => i + 1).filter(n => !RED.includes(n)) },
  { name: 'Odd', nums: Array.from({ length: 18 }, (_, i) => 2*i+1) },
  { name: 'Even', nums: Array.from({ length: 18 }, (_, i) => 2*i+2) },
  { name: 'Low', nums: Array.from({ length: 18 }, (_, i) => i+1) },
  { name: 'High', nums: Array.from({ length: 18 }, (_, i) => i+19) },
  ...Array.from({ length: 3 }, (_, i) => ({ name: `Dozen ${i+1}`, nums: Array.from({ length: 12 }, (_, j) => 12*i+j+1) })),
  ...Array.from({ length: 3 }, (_, i) => ({ name: `Column ${i+1}`, nums: Array.from({ length: 12 }, (_, j) => 3*j+i+1) })),
  { name: 'Voisins du zéro', nums: [0,2,3,4,7,12,15,18,19,21,22,25,26,28,29,32,35] },
  { name: 'Tiers du cylindre', nums: [5,8,10,11,13,16,23,24,27,30,33,36] },
  { name: 'Orphelins', nums: [1,6,9,14,17,20,31,34] },
  { name: 'Jeu zéro', nums: [0,3,12,15,26,32,35] },
];

export function analyse(records, { sourceId = 'rng', pockets = null, alpha = MODEL.monitorAlpha, power = MODEL.power } = {}) {
  const selected = records.filter(r => r.sourceId === sourceId).sort((a, b) => a.settledAt - b.settledAt);
  const cohorts = new Map(), seen = new Set(), counts = Array(37).fill(0), mix = new Map();
  let stake = 0, returned = 0, expected = 0, variance = 0, wagered = 0, repeatDraws = 0, peak = 0, drawdown = 0;
  const curve = [];
  for (const r of selected) {
    if (r.stake) {
      stake += r.stake; returned += r.returned; expected += r.expected; variance += r.variance; wagered++;
      const net = returned - stake; peak = Math.max(peak, net); drawdown = Math.max(drawdown, peak - net);
      curve.push({ actual: net, expected });
      for (const b of r.bets) {
        const key = b.nums.length;
        const entry = mix.get(key) || { coverage: key, stake: 0, returned: 0 };
        entry.stake += b.amount; entry.returned += b.nums.includes(r.outcome) ? b.amount * b.gross : 0;
        mix.set(key, entry);
      }
    }
    if (seen.has(r.drawKey)) { repeatDraws++; continue; }
    seen.add(r.drawKey); counts[r.outcome]++;
    if (r.stake && r.winningPockets > 0 && r.winningPockets < 37) {
      const c = cohorts.get(r.winningPockets) || { pockets: r.winningPockets, n: 0, wins: 0 };
      c.n++; if (r.net > 0) c.wins++; cohorts.set(c.pockets, c);
    }
  }
  const groups = [...cohorts.values()].sort((a, b) => b.n - a.n);
  const chosen = cohorts.get(Number(pockets)) || cohorts.get(18) || groups[0];
  const evaluation = evaluateBinomial(chosen?.wins || 0, chosen?.n || 0, (chosen?.pockets || 18)/37, { alpha, power });
  const patterns = PATTERNS.map(p => {
    const wins = p.nums.reduce((s, n) => s + counts[n], 0);
    return { name: p.name, size: p.nums.length, wins, n: seen.size, p0: p.nums.length/37, p: twoSidedP(wins, seen.size, p.nums.length/37) };
  });
  const sorted = [...patterns].sort((a, b) => a.p - b.p);
  let adjusted = 0;
  sorted.forEach((p, i) => { adjusted = Math.max(adjusted, Math.min(1, p.p * (patterns.length - i))); p.adjustedP = adjusted; });
  return {
    sourceId, sources: [...new Set(records.map(r => r.sourceId))], groups, evaluation,
    stake, returned, net: returned - stake, expected, difference: returned - stake - expected,
    riskScore: variance > 0 ? (returned - stake - expected)/Math.sqrt(variance) : null,
    wagered, distinctDraws: seen.size, repeatDraws, drawdown,
    curve: curve.filter((_, i) => i % Math.max(1, Math.ceil(curve.length/80)) === 0 || i === curve.length-1),
    mix: [...mix.values()].sort((a, b) => b.stake - a.stake), patterns,
  };
}
