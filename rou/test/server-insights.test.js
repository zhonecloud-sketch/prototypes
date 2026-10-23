import test from 'node:test';
import assert from 'node:assert/strict';
import {serverRecords} from '../client/server-records.js';
import {analyse} from '../client/insights-model.js';
const red={id:'red',amount:25,nums:[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],gross:2};
function record(i,win,extra={}){return {roundId:i,roomId:1,sourceId:'server-rng',drawKey:'server:1:'+i,number:win?1:2,bets:[red],stake:25,returned:win?50:0,net:win?25:-25,settledAt:i*30000+27000,...extra};}
test('server wagers use the fixed five-point target for both 70% and 30% signals',()=>{
  for(const [wins,status] of [[1400,'advantage'],[600,'inverted']]){
    const records=serverRecords(Array.from({length:2000},(_,i)=>record(i,i<wins)),'player','epoch');
    const r=analyse(records,{sourceId:'server-rng'});
    assert.equal(r.evaluation.status,status);assert.ok(r.evaluation.n>=r.evaluation.required);assert.ok(r.evaluation.p<.001);
    assert.equal(r.evaluation.p0,18/37);assert.equal(r.net,wins*50-2000*25);assert.ok(Math.abs(r.expected+2000*25/37)<1e-8);
  }
});
test('a small unlucky sample cannot be labelled inverted advantage',()=>{
  const r=analyse(serverRecords(Array.from({length:10},(_,i)=>record(i,i<3)),'p','e'),{sourceId:'server-rng'});
  assert.equal(r.evaluation.status,'insufficient');assert.ok(r.evaluation.required>10);
});
test('replay duplicates are excluded across rooms, while all financial losses remain',()=>{
  const a=record(1,false,{sourceId:'replay:dataset',drawKey:'replay:dataset:0'}),b={...a,roundId:2,roomId:2};
  const r=analyse(serverRecords([a,b],'p','e'),{sourceId:'replay:dataset'});
  assert.equal(r.wagered,2);assert.equal(r.net,-50);assert.equal(r.evaluation.n,1);assert.equal(r.repeatDraws,1);
});
test('legacy sources stay separate, and a settlement mismatch fails visibly',()=>{
  const old=record(1,true);delete old.sourceId;delete old.drawKey;
  const records=serverRecords([old,record(2,true)],'p','e');assert.equal(records[0].sourceId,'legacy');
  assert.equal(analyse(records,{sourceId:'server-rng'}).wagered,1);
  assert.throws(()=>serverRecords([record(1,true,{returned:999})],'p','e'),/settlement/);
});
