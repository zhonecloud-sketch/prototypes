import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { evaluateBinomial, makeRecord, analyse, PATTERNS } from '../client/insights-model.js';
import { twoSidedP, requiredN, betaQuantile } from '../client/bias-math.js';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual-expected) <= tolerance, `${actual} != ${expected}`);
const red = { id:'red', label:'Red', amount:25, gross:2, nums:[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36] };
const record = (id, outcome, bets = [red], sourceId = 'rng', drawKey = `${sourceId}:${id}`) => makeRecord({owner:'test',epoch:'current',round:{id,start:id*30000,outcome},bets,sourceId,drawKey});

test('calculator kernel retains exact source parity', () => {
  const source = readFileSync(new URL('../../bias_calc/index.html', import.meta.url), 'utf8');
  const kernel = readFileSync(new URL('../client/bias-math.js', import.meta.url), 'utf8');
  const body = kernel.slice(kernel.indexOf('function logGamma'), kernel.indexOf('export {')).trim();
  assert.ok(source.replaceAll('\r\n','\n').includes(body.replaceAll('\r\n','\n')));
  const context = vm.createContext({Math});
  vm.runInContext(body, context);
  for (const [wins,n,p0] of [[3,10,.5],[30,100,.5],[30,100,18/37],[300,1000,18/37],[7,100,1/37],[0,10,18/37],[10,10,18/37]]) {
    for (const alpha of [.05,.001]) {
      close(twoSidedP(wins,n,p0),context.twoSidedP(wins,n,p0),0);
      assert.equal(evaluateBinomial(wins,n,p0,{alpha}).required,context.requiredN(wins/n,p0,alpha,.8));
    }
  }
});

test('binomial tails and Beta interval match independently calculated reference values', () => {
  close(twoSidedP(3,10,.5),.34375);
  close(twoSidedP(30,100,.5),.0000785013964559,1e-12);
  close(twoSidedP(30,100,18/37),.000231644791679,1e-12);
  close(betaQuantile(.025,31,71),.21897873,1e-8);
  close(betaQuantile(.975,31,71),.39614713,1e-8);
});

test('model gates both sample size and significance, in either direction', () => {
  const short = evaluateBinomial(3,10,.5);
  assert.equal(short.status,'insufficient');
  assert.ok(short.required > short.n);
  const lowHundred=evaluateBinomial(30,100,.5);
  assert.ok(lowHundred.p < lowHundred.alpha);
  assert.equal(lowHundred.required,107);
  assert.equal(lowHundred.status,'insufficient');
  assert.equal(evaluateBinomial(30,100,18/37).required,123);
  assert.equal(evaluateBinomial(300,1000,.5).status,'inverted');
  assert.equal(evaluateBinomial(700,1000,.5).status,'advantage');
  assert.ok(requiredN(.3,.5,.001,.8) > requiredN(.3,.5,.05,.8));
  assert.equal(evaluateBinomial(50,100,.5).required,null);
  assert.equal(evaluateBinomial(0,0,.5).status,'empty');
  assert.equal(evaluateBinomial(499999,1000000,.5).required,null);
  assert.throws(()=>evaluateBinomial(11,10,.5));
});

test('portfolio EV includes losing stakes and within-round correlation', () => {
  const win=record(1,1), loss=record(2,0);
  assert.equal(win.net,25); assert.equal(loss.net,-25);
  close(win.expected,-25/37);
  assert.equal(win.winningPockets,18);
  const black = {...red,id:'black',nums:Array.from({length:36},(_,i)=>i+1).filter(n=>!red.nums.includes(n))};
  const hedged=record(3,1,[red,black]);
  close(hedged.expected,-50/37);
  assert.equal(hedged.winningPockets,0);
  assert.equal(hedged.net,0);
  close(hedged.variance,2500*36/(37*37));
  const analysed=analyse([win,loss,hedged]);
  assert.equal(analysed.stake,100);
  assert.equal(analysed.net,0);
  assert.equal(analysed.evaluation.n,2);
  assert.equal(analysed.evaluation.p0,18/37);
});

test('different win probabilities stay separate and replay copies cannot inflate evidence', () => {
  const straight={id:'n:1',label:'1',amount:25,gross:36,nums:[1]};
  const records=[record(1,1),record(2,1,[straight]),record(3,1,[red],'replay:abc','row:1'),record(4,1,[red],'replay:abc','row:1')];
  const rng=analyse(records);
  assert.equal(rng.groups.length,2); assert.equal(rng.evaluation.n,1);
  assert.equal(analyse(records,{pockets:1}).evaluation.p0,1/37);
  const replay=analyse(records,{sourceId:'replay:abc'});
  assert.equal(replay.wagered,2); assert.equal(replay.net,50);
  assert.equal(replay.evaluation.n,1); assert.equal(replay.distinctDraws,1);
  assert.equal(replay.repeatDraws,1);
});

test('record length exceeds 222 and wheel scan corrects all 53 categories', () => {
  const results=analyse(Array.from({length:500},(_,i)=>record(i,i%37)));
  assert.equal(results.wagered,500); assert.equal(results.evaluation.n,500);
  assert.equal(PATTERNS.length,53);
  for (const pattern of results.patterns) assert.ok(pattern.adjustedP>=pattern.p && pattern.adjustedP<=1);
  assert.equal(results.curve.at(-1).actual,results.net);
});

test('empty and watched-only records have no invented player sample', () => {
  assert.equal(analyse([]).evaluation.status,'empty');
  const result=analyse([record(1,4,[])]);
  assert.equal(result.distinctDraws,1);
  assert.equal(result.wagered,0); assert.equal(result.evaluation.n,0);
});
