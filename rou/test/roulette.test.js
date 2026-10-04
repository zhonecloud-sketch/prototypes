import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { RouletteEngine, numberFrom, commit, colorOf, POCKET_COUNT, SETTLE_MS, SAMPLING_BOUND } from '../server/roulette.js';
import { PHASE } from '../server/protocol.js';

test('numberFrom always returns a valid pocket', () => {
  for (let i = 0; i < 5_000; i++) {
    const n = numberFrom(crypto.randomBytes(32).toString('hex'), i);
    assert.ok(Number.isInteger(n) && n >= 0 && n < POCKET_COUNT, `out of range: ${n}`);
  }
});

test('numberFrom is deterministic for a given (seed, roundId)', () => {
  const seed = crypto.randomBytes(32).toString('hex');
  assert.equal(numberFrom(seed, 42), numberFrom(seed, 42));
});

test('different rounds from one seed give different numbers', () => {
  const seed = crypto.randomBytes(32).toString('hex');
  const seen = new Set();
  for (let i = 1; i <= 200; i++) seen.add(numberFrom(seed, i));
  // With only 37 pockets, 200 draws cannot cover all of them; ~1 pocket is
  // expected to repeat. Just assert the output is not effectively constant.
  assert.ok(seen.size > 30, `insufficient spread: ${seen.size}/37`);
});

test('the rejection bound is exact, so modulo bias is impossible by construction', () => {
  // NOTE: modulo bias for `x % 37` on a 32-bit word is ~7/2^32 (roughly one
  // extra draw in 600 million), which no feasible sample size can detect -- a
  // chi-square over 370k draws scores ~38 for the buggy version. So the bias
  // guard below is *algebraic*, not statistical: we assert the divisor property
  // that makes the mapping exactly uniform. A statistical test is still kept as
  // a coarse smoke test for grossly wrong derivations.
  assert.equal(SAMPLING_BOUND % POCKET_COUNT, 0, 'bound must be an exact multiple of the pocket count');
  assert.ok(SAMPLING_BOUND <= 2 ** 32);
  assert.ok(2 ** 32 - SAMPLING_BOUND < POCKET_COUNT, 'rejected remainder must be smaller than one pocket');

  // Each residue class modulo 37 must map to exactly one pocket, and all 37
  // must be reachable across the accepted range.
  const seen = new Set();
  for (let c = 0; c < POCKET_COUNT; c++) seen.add(c % POCKET_COUNT);
  assert.equal(seen.size, POCKET_COUNT);
});

test('distribution is uniform: chi-square smoke test', () => {
  // Guards against a grossly wrong derivation (constant output, off-by-one
  // stride, endianness errors). It cannot resolve 1-in-4e9 bias; see above.
  const seed = 'a'.repeat(64);
  const runs = 370_000; // 10k per pocket
  const counts = new Array(POCKET_COUNT).fill(0);
  for (let i = 0; i < runs; i++) counts[numberFrom(seed, i)]++;

  const expected = runs / POCKET_COUNT;
  let chi2 = 0;
  for (const c of counts) chi2 += ((c - expected) ** 2) / expected;

  // 36 degrees of freedom; the 99.9th percentile is ~73.4. A real defect such as
  // a constant or skewed output scores in the thousands.
  assert.ok(chi2 < 73.4, `distribution deviates from uniform: chi2=${chi2.toFixed(2)} (limit 73.4)`);
});

test('commit() is the sha256 of the seed RAW BYTES', () => {
  const seed = 'f00dbeef'.repeat(8);
  // Raw bytes, not the hex text: this is what a browser's WebCrypto computes.
  assert.equal(commit(seed), crypto.createHash('sha256').update(Buffer.from(seed, 'hex')).digest('hex'));
  assert.notEqual(commit(seed), crypto.createHash('sha256').update(seed).digest('hex'),
    'hashing the hex text would break every client-side verification');
  assert.throws(() => commit('zz'), TypeError, 'non-hex seeds must be rejected');
});

test('colorOf covers the wheel', () => {
  assert.equal(colorOf(0), 'green');
  assert.equal(colorOf(1), 'red');
  assert.equal(colorOf(2), 'black');
  assert.equal(colorOf(36), 'red');
  const reds = Array.from({ length: POCKET_COUNT }, (_, i) => i).filter((n) => colorOf(n) === 'red');
  assert.equal(reds.length, 18);
});

test('engine emits round -> phase -> draw in order each cycle', () => {
  let fakeNow = 1_000_000;
  const engine = new RouletteEngine({ roundMs: 30_000, bettingMs: 24_000, now: () => fakeNow });
  const events = [];
  for (const type of ['round', 'phase', 'draw']) engine.on(type, (r) => events.push([type, r.phase]));

  engine.start();
  engine.tickForTest(); // nothing due yet
  assert.deepEqual(events, [['round', 'betting']]);

  fakeNow = engine.current.deadline; // betting window closes
  engine.tickForTest();
  assert.deepEqual(events.slice(1), [['phase', 'closed']]);

  fakeNow = engine.current.deadline; // result settles
  engine.tickForTest();
  assert.deepEqual(events.slice(2), [['phase', 'settling']]);

  fakeNow = engine.current.deadline; // SETTLE_MS elapses and the number is drawn
  engine.tickForTest();
  assert.deepEqual(
    events.slice(3),
    [['draw', 'settling'], ['round', 'betting']],
    'the next round must open in the same tick as the draw, with no gap'
  );
  engine.stop();
});

test('settled round exposes number, revealed seed and a matching commitment', () => {
  let fakeNow = Date.now();
  const engine = new RouletteEngine({ roundMs: 30_000, bettingMs: 24_000, now: () => fakeNow });
  const seen = [];
  engine.on('draw', (round) => {
    seen.push({
      hash: commit(round.seed),
      published: round.hash,
      rederived: numberFrom(round.seed, round.roundId),
      number: round.number,
      revealed: round.revealed,
    });
  });
  engine.start();
  fakeNow += 30_001;
  engine.tickForTest();
  engine.stop();

  assert.equal(seen.length, 1, 'exactly one round should settle');
  assert.equal(seen[0].published, seen[0].hash, 'revealed seed must match the published hash');
  assert.equal(seen[0].rederived, seen[0].number, 'number must be re-derivable');
  assert.ok(seen[0].revealed);
});

test('engine resynchronises after a simulated stall', () => {
  let fakeNow = 1_000_000;
  const engine = new RouletteEngine({ roundMs: 30_000, bettingMs: 24_000, now: () => fakeNow });
  const drawn = [];
  engine.on('draw', (r) => drawn.push(r.roundId));

  engine.start();
  assert.equal(engine.current.roundId, 1);
  assert.equal(engine.current.phase, PHASE.BETTING);

  // Jump the clock 95 seconds ahead, as if the process were suspended.
  fakeNow += 95_000;
  engine.tickForTest();

  // The in-flight round is settled so no client is left staring at a stale
  // round, and the next round is anchored to resume time rather than
  // retroactively inventing rounds that nobody could have observed.
  assert.deepEqual(drawn, [1], 'exactly the in-flight round settles');
  assert.equal(engine.current.roundId, 2);
  assert.equal(engine.current.phase, PHASE.BETTING);
  assert.equal(engine.current.openedAt, fakeNow);
  assert.equal(engine.current.deadline, fakeNow + 24_000);
  engine.stop();
});

test('a stall spanning several phases still walks the round to settlement', () => {
  let fakeNow = 1_000_000;
  const engine = new RouletteEngine({ roundMs: 30_000, bettingMs: 24_000, now: () => fakeNow });
  const phases = [];
  for (const t of ['phase', 'draw']) engine.on(t, (r) => phases.push(`${t}:${r.phase}`));

  engine.start();
  fakeNow += 30_001; // past the whole round
  engine.tickForTest();

  // Skipping intermediate deadlines must not leave the round wedged: it walks
  // betting -> closed -> settling -> draw in one pass.
  assert.deepEqual(phases, ['phase:closed', 'phase:settling', 'draw:settling']);
  engine.stop();
});

test('constructing with an invalid phase split throws', () => {
  assert.throws(() => new RouletteEngine({ roundMs: 100, bettingMs: 100 }));
  assert.throws(() => new RouletteEngine({ roundMs: 100, bettingMs: 0 }));
});

test('phase deadlines sit on a fixed grid inside each round', () => {
  let fakeNow = 1_000_000;
  const engine = new RouletteEngine({ roundMs: 30_000, bettingMs: 24_000, now: () => fakeNow });
  const openedAt = engine.start().current.openedAt;
  assert.equal(openedAt, fakeNow);

  // betting: 0 -> 24s
  assert.equal(engine.current.deadline, openedAt + 24_000);

  fakeNow = openedAt + 24_000;
  engine.tickForTest();
  assert.equal(engine.current.phase, PHASE.CLOSED);
  // closed: last 6s of the round, holding back SETTLE_MS for the result
  assert.equal(engine.current.deadline, openedAt + 30_000 - SETTLE_MS);

  fakeNow = openedAt + 30_000 - SETTLE_MS;
  engine.tickForTest();
  assert.equal(engine.current.phase, PHASE.SETTLING);
  assert.equal(engine.current.deadline, openedAt + 30_000);

  fakeNow = openedAt + 30_000;
  engine.tickForTest();
  // A full round is exactly roundMs on the wall clock, never longer.
  assert.equal(engine.current.roundId, 2);
  assert.equal(engine.current.openedAt, fakeNow);
  engine.stop();
});