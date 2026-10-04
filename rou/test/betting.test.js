import test from 'node:test';
import assert from 'node:assert/strict';
import {
  covers, coverage, oddsFor, returnFor, houseEdge, validateBet, colorOf, POCKET_COUNT,
} from '../server/betting.js';

test('straight bets cover exactly one pocket', () => {
  for (let n = 0; n < POCKET_COUNT; n++) {
    assert.equal(covers('straight', n, n), true, `straight on ${n} must cover itself`);
    for (let m = 0; m < POCKET_COUNT; m++) {
      if (m !== n) assert.equal(covers('straight', n, m), false, `straight on ${n} must not cover ${m}`);
    }
  }
});

test('dozens cover 12 numbers each and exclude zero', () => {
  const hit = (d) => Array.from({ length: POCKET_COUNT }, (_, n) => n).filter((n) => covers('dozen', d, n));
  assert.deepEqual(hit(0), Array.from({ length: 12 }, (_, i) => i + 1));
  assert.deepEqual(hit(1), Array.from({ length: 12 }, (_, i) => i + 13));
  assert.deepEqual(hit(2), Array.from({ length: 12 }, (_, i) => i + 25));
});

test('columns cover 12 numbers each and exclude zero', () => {
  const hit = (c) => Array.from({ length: POCKET_COUNT }, (_, n) => n).filter((n) => covers('column', c, n));
  assert.deepEqual(hit(0), Array.from({ length: 12 }, (_, i) => 1 + i * 3));
  assert.deepEqual(hit(1), Array.from({ length: 12 }, (_, i) => 2 + i * 3));
  assert.deepEqual(hit(2), Array.from({ length: 12 }, (_, i) => 3 + i * 3));
  for (const c of [0, 1, 2]) assert.ok(!hit(c).includes(0));
});

test('ZERO LOSES EVERY OUTSIDE BET -- this is the house edge', () => {
  // The single rule players most often misremember. If any of these pass, the
  // even-money bets have been given away.
  for (const kind of ['dozen', 'column', 'low', 'high', 'odd', 'even', 'red', 'black']) {
    const selection = (kind === 'dozen' || kind === 'column') ? 0 : undefined;
    assert.equal(covers(kind, selection, 0), false, `${kind} must not cover 0`);
    assert.equal(returnFor(kind, selection, 100, 0), 0, `${kind} must return nothing on 0`);
  }
});

test('low/high split at 18/19 and exclude zero', () => {
  assert.equal(covers('low', undefined, 1), true);
  assert.equal(covers('low', undefined, 18), true);
  assert.equal(covers('low', undefined, 19), false);
  assert.equal(covers('high', undefined, 19), true);
  assert.equal(covers('high', undefined, 36), true);
  assert.equal(covers('high', undefined, 18), false);
});

test('odd/even exclude zero', () => {
  assert.equal(covers('odd', undefined, 3), true);
  assert.equal(covers('odd', undefined, 4), false);
  assert.equal(covers('even', undefined, 4), true);
  assert.equal(covers('even', undefined, 3), false);
  // 0 is mathematically even but must NOT pay as even in roulette.
  assert.equal(covers('even', undefined, 0), false);
});

test('red and black partition 1-36 exactly, excluding zero', () => {
  for (let n = 1; n < POCKET_COUNT; n++) {
    const isRed = covers('red', undefined, n);
    const isBlack = covers('black', undefined, n);
    assert.notEqual(isRed, isBlack, `${n} must be exactly one of red/black`);
  }
  assert.equal(covers('red', undefined, 0), false);
  assert.equal(covers('black', undefined, 0), false);
  assert.equal(colorOf(0), 'green');
});
test('coverage counts are 1 / 12 / 18 and sum to the wheel', () => {
  assert.equal(coverage('straight'), 1);
  assert.equal(coverage('dozen'), 12);
  assert.equal(coverage('column'), 12);
  assert.equal(coverage('low') + coverage('high'), 36, 'low + high must cover 1-36 exactly');
});

test('payouts are gross returns, and losers get zero not negative', () => {
  assert.equal(returnFor('straight', 17, 10, 17), 360, 'straight pays 35:1 plus stake');
  assert.equal(returnFor('straight', 17, 10, 18), 0, 'a losing bet returns nothing');
  assert.equal(returnFor('dozen', 0, 10, 5), 30, 'dozen pays 2:1 plus stake');
  assert.equal(returnFor('red', undefined, 10, 5), 20, 'even money pays 1:1 plus stake');
  assert.equal(returnFor('even', undefined, 10, 4), 20);
});

test('odds match the paytable', () => {
  assert.equal(oddsFor('straight'), 35);
  assert.equal(oddsFor('dozen'), 2);
  assert.equal(oddsFor('column'), 2);
  for (const k of ['low', 'high', 'odd', 'even', 'red', 'black']) assert.equal(oddsFor(k), 1);
});

test('house edge is identical (2.70%) on every bet type -- European single zero', () => {
  // A well-known property of the single-zero wheel. If this drifts, a payout
  // table typo has changed the economics of the game.
  const edges = ['straight', 'dozen', 'column', 'low', 'high', 'odd', 'even', 'red', 'black'].map(houseEdge);
  for (const e of edges) assert.ok(Math.abs(e - 0.027027027) < 1e-6, `edge drifted: ${e}`);
});

test('every bet type has a defined coverage and odds', () => {
  for (const kind of ['straight', 'dozen', 'column', 'low', 'high', 'odd', 'even', 'red', 'black']) {
    assert.ok(coverage(kind) > 0, `${kind} must cover something`);
    assert.ok(oddsFor(kind) > 0, `${kind} must pay something`);
  }
  assert.equal(coverage('nonsense'), 0);
  assert.equal(oddsFor('nonsense'), 0);
});

test('covers() rejects numbers off the wheel', () => {
  for (const bad of [-1, 37, 100, 1.5, NaN, undefined, '7']) {
    assert.equal(covers('straight', 0, bad), false, `${bad} is not a pocket`);
    assert.equal(covers('low', undefined, bad), false);
  }
});

test('validateBet accepts legal bets and names the reason for illegal ones', () => {
  const rich = { balance: 1000, maxStake: 1000 };
  assert.equal(validateBet({ kind: 'straight', selection: 0, stake: 10 }, rich), null);
  assert.equal(validateBet({ kind: 'red', stake: 10 }, rich), null);
  assert.equal(validateBet({ kind: 'dozen', selection: 2, stake: 5 }, rich), null);

  assert.equal(validateBet({ kind: 'nope', stake: 10 }, rich), 'unknown_bet');
  assert.equal(validateBet({ kind: 'straight', selection: 0, stake: 0 }, rich), 'below_minimum');
  assert.equal(validateBet({ kind: 'straight', selection: 0, stake: 1001 }, rich), 'above_maximum');
  assert.equal(validateBet({ kind: 'straight', selection: 0, stake: 2000 }, { balance: 100, maxStake: 3000 }), 'insufficient_funds');
  assert.equal(validateBet({ kind: 'straight', selection: 0, stake: 1.5 }, rich), 'bad_stake');
  assert.equal(validateBet({ kind: 'straight', selection: 37, stake: 10 }, rich), 'bad_selection');
  assert.equal(validateBet({ kind: 'dozen', selection: 3, stake: 10 }, rich), 'bad_selection');
  assert.equal(validateBet({ kind: 'red', selection: 'x', stake: 10 }, rich), 'bad_selection');
});