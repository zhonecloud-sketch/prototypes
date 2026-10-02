import test from 'node:test';
import assert from 'node:assert/strict';
import { BetLedger, totalStaked } from '../server/ledger.js';

const ledger = (opts) => new BetLedger({ startingBalance: 1000, maxStake: 100, ...opts });

test('a new player starts with the configured balance', () => {
  assert.equal(ledger().balanceOf('p1'), 1000);
});

test('placing a bet debits the stake immediately', () => {
  const l = ledger();
  const res = l.place('p1', 1, { kind: 'straight', selection: 17, stake: 100 });
  assert.equal(res.ok, true);
  assert.equal(res.balance, 900, 'stake must be held, not merely recorded');
  assert.equal(res.total, 100);
  assert.deepEqual(l.betsFor('p1', 1), [{ kind: 'straight', selection: 17, stake: 100 }]);
});

test('funds cannot be double-committed across bets', () => {
  const l = ledger({ startingBalance: 100 });
  assert.equal(l.place('p1', 1, { kind: 'straight', selection: 1, stake: 60 }).ok, true);
  const second = l.place('p1', 1, { kind: 'straight', selection: 2, stake: 60 });
  assert.equal(second.ok, false, 'the second bet must be refused');
  assert.equal(second.reason, 'insufficient_funds');
  assert.equal(l.balanceOf('p1'), 40);
});

test('a winning straight returns 36x gross and nets the right amount', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'straight', selection: 17, stake: 10 });
  const [result] = l.settle(1, 17);
  assert.equal(result.staked, 10);
  assert.equal(result.returned, 360);
  assert.equal(result.net, 350, 'net is profit, excluding the returned stake');
  assert.equal(result.balance, 1350, '1000 - 10 staked + 360 returned');
  assert.equal(result.winners.length, 1);
});

test('a losing bet costs the stake and nothing more', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'straight', selection: 17, stake: 10 });
  const [result] = l.settle(1, 18);
  assert.equal(result.returned, 0);
  assert.equal(result.net, -10);
  assert.equal(result.balance, 990);
  assert.equal(result.winners.length, 0);
});

test('settling clears the round so it cannot pay twice', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'red', stake: 10 });
  l.settle(1, 5);
  const second = l.settle(1, 5);
  assert.equal(second.length, 0, 'a settled round must not pay again');
  assert.equal(l.balanceOf('p1'), 1010);
});

test('multiple bets accumulate and settle together', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'straight', selection: 5, stake: 10 });
  l.place('p1', 1, { kind: 'red', stake: 20 });
  l.place('p1', 1, { kind: 'dozen', selection: 0, stake: 5 });
  // 5 is red, in the 1st dozen (1-12), and a straight hit.
  const [result] = l.settle(1, 5);
  assert.equal(result.staked, 35);
  assert.equal(result.returned, 360 + 40 + 15, 'straight 35:1, red 1:1, dozen 2:1 (gross)');
  assert.equal(result.balance, 1000 - 35 + 415);
  assert.equal(result.winners.length, 3);
});

test('a player with no bets is not settled', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'red', stake: 10 });
  const results = l.settle(1, 5);
  assert.equal(results.length, 1, 'only players with money at risk are reported');
  assert.equal(results[0].playerId, 'p1');
});

test('ZERO settles every outside bet as a loss', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'red', stake: 10 });
  l.place('p1', 1, { kind: 'even', stake: 10 });
  l.place('p1', 1, { kind: 'straight', selection: 0, stake: 10 });
  const [result] = l.settle(1, 0);
  assert.equal(result.returned, 360, 'only the straight on 0 pays');
  assert.equal(result.net, 360 - 30);
});

test('refundPlayerRound returns one player\'s stake for an abandoned round', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'red', stake: 100 });
  assert.equal(l.balanceOf('p1'), 900);
  const refunded = l.refundPlayerRound('p1', 1);
  assert.equal(refunded, 100, 'the refund amount is reported');
  assert.equal(l.balanceOf('p1'), 1000, 'an unsettled round must refund in full');
  assert.equal(l.betsFor('p1', 1).length, 0);
  assert.equal(l.refundPlayerRound('p1', 1), 0, 'a second refund is a no-op');
});

test('refunding one player leaves other players\' bets intact', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'red', stake: 100 });
  l.place('p2', 1, { kind: 'black', stake: 50 });
  l.refundPlayerRound('p1', 1);
  assert.equal(l.balanceOf('p1'), 1000);
  assert.equal(l.balanceOf('p2'), 950, 'p2 keeps their stake until settlement');
  assert.equal(l.betsFor('p2', 1).length, 1);
});

test('refunding an unknown player or round is safe', () => {
  const l = ledger();
  assert.equal(l.refundPlayerRound('nobody', 1), 0);
  l.place('p1', 1, { kind: 'red', stake: 10 });
  assert.equal(l.refundPlayerRound('p1', 999), 0, 'a round with no bets refunds nothing');
  assert.equal(l.balanceOf('p1'), 990, 'the live bet must survive');
});

test('bets on different rounds are tracked separately', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'red', stake: 10 });
  l.place('p1', 2, { kind: 'black', stake: 20 });
  assert.deepEqual(l.pendingRounds(), [1, 2]);
  assert.equal(l.balanceOf('p1'), 970);

  const [r1] = l.settle(1, 5); // red wins
  assert.equal(r1.balance, 990);
  assert.deepEqual(l.pendingRounds(), [2], 'settling round 1 must not touch round 2');
});

test('players are isolated from each other', () => {
  const l = ledger();
  l.place('p1', 1, { kind: 'straight', selection: 1, stake: 1000 });
  assert.equal(l.balanceOf('p2'), 1000, 'p2 must be unaffected by p1 going all-in');
  const results = l.settle(1, 2);
  assert.equal(results.length, 0, 'p2 placed no bets, so it must not be settled');
  assert.equal(l.balanceOf('p2'), 1000, 'p2 balance is untouched');
});

test('totalStaked sums a bet list', () => {
  assert.equal(totalStaked([{ stake: 10 }, { stake: 25 }, { stake: 5 }]), 40);
  assert.equal(totalStaked([]), 0);
});