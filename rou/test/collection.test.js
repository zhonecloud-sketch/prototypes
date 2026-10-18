import test from 'node:test';
import assert from 'node:assert/strict';
import { newProfile, restoreProfile, acquire, simulatePurchase, COLLECTIBLES } from '../client/catalogue.js';

test('collection purchase debits once, retains ownership and display after restore', () => {
  const initial=newProfile(100);
  assert.throws(()=>acquire(initial,10000,'watch'),/more play chips/);
  const purchased=acquire(initial,210000,'watch',200);
  assert.equal(purchased.balance,10000);
  assert.equal(purchased.profile.showcase,'watch');
  assert.equal(initial.items.length,0);
  assert.throws(()=>acquire(purchased.profile,210000,'watch'),/already yours/);
  assert.deepEqual(restoreProfile(JSON.parse(JSON.stringify(purchased.profile))),purchased.profile);
});

test('test checkout handles decline, pending completion and duplicate delivery', () => {
  const profile=newProfile();
  const declined=simulatePurchase(profile,10000,'chips-100k','declined','decline');
  assert.equal(declined.balance,10000);
  assert.equal(simulatePurchase(declined.profile,10000,'chips-100k','declined','success').balance,10000);
  const pending=simulatePurchase(declined.profile,10000,'chips-100k','pending','pending');
  assert.equal(pending.balance,10000);
  const completed=simulatePurchase(pending.profile,pending.balance,'chips-100k','pending','success');
  assert.equal(completed.balance,110000);
  const duplicate=simulatePurchase(completed.profile,completed.balance,'chips-100k','pending','success');
  assert.equal(duplicate.balance,110000);
  assert.equal(duplicate.profile.orders.length,2);
  assert.throws(()=>simulatePurchase(completed.profile,completed.balance,'chips-1m','pending','success'),/another product/);
});

test('large packs remain exact integers; overflow fails without changing the profile', () => {
  const profile=newProfile();
  const result=simulatePurchase(profile,10000,'chips-5b','large','success');
  assert.equal(result.balance,5000010000);
  assert.throws(()=>simulatePurchase(profile,Number.MAX_SAFE_INTEGER,'chips-100k','overflow','success'),/supported balance/);
  assert.equal(profile.orders.length,0);
  assert.equal(COLLECTIBLES.find(i=>i.id==='golf-course').price,160000000);
});

test('Insights pass extends from current expiry and duplicate delivery never extends twice', () => {
  const time=1700000000000, duration=30*86400000;
  const first=simulatePurchase(newProfile(time),10000,'insights-30d','a','success',time);
  assert.equal(first.balance,10000); assert.equal(first.profile.insightsUntil,time+duration);
  const second=simulatePurchase(first.profile,10000,'insights-30d','b','success',time+1000);
  assert.equal(second.profile.insightsUntil,time+2*duration);
  const duplicate=simulatePurchase(second.profile,10000,'insights-30d','b','success',time+2000);
  assert.equal(duplicate.profile.insightsUntil,second.profile.insightsUntil);
});
