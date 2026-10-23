import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {MODEL,analyse} from '../client/insights-model.js';
import {serverRecords} from '../client/server-records.js';

function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}
const flush=()=>new Promise(setImmediate);
const record=i=>({roundId:i,roomId:1,sourceId:'server-rng',drawKey:`server:1:${i}`,number:1,bets:[{id:'red',amount:25,nums:[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],gross:2}],stake:25,returned:50,net:25,settledAt:i*30000+27000});
function harness(request){
  const source=readFileSync(new URL('../client/server-insights.js',import.meta.url),'utf8').replace(/^import .*\r?\n/gm,'').replaceAll('export ','').replaceAll('import.meta.url',"'https://example.test/client/server-insights.js'");
  const events=new Map(),timers=new Map(),jobs=[];let timerId=0;
  const player={id:'p',username:'TestPlayer',profile:{epoch:'e',insightsUntil:0,game:{wager:null}}};
  const message={textContent:'',hidden:true},root={isConnected:true,innerHTML:'',querySelector:()=>message};
  const document={hidden:false,documentElement:{classList:{contains:()=>true}},addEventListener:(name,fn)=>events.set(name,fn)};
  const create=vm.runInNewContext(source+';createServerInsights',{
    account:{player},MODEL,INSIGHTS_PASS:{cents:490},URL,Date,Intl,document,
    setTimeout:(fn,ms)=>{timers.set(++timerId,{fn,ms});return timerId;},clearTimeout:id=>timers.delete(id),
    Worker:class{postMessage(data){jobs.push(data);queueMicrotask(()=>this.onmessage({data:{id:data.id,result:analyse(serverRecords(data.records,data.owner,data.epoch),data.options)}}));}},
    accountRequest:request
  });
  const insights=create();
  return {insights,root,player,jobs,timers,document,message,
    changed(i){player.profile.game.wager={record:{roundId:i,roomId:1}};events.get('atelier-account')();},
    visible(){events.get('visibilitychange')?.();}
  };
}
const page=(records,extra={})=>({records,cursor:records.length?records.at(-1).roundId:0,until:records.length?records.at(-1).roundId:0,premium:false,resetAt:1,nextCursor:null,...extra});

test('a very large difference stays descriptive until the alert checks pass',async()=>{
  for(const [n,wins,confirmed] of [[10,7,false],[2000,1400,true],[2000,600,true]]){
    const records=Array.from({length:n},(_,i)=>({...record(i+1),number:i<wins?1:2,returned:i<wins?50:0,net:i<wins?25:-25}));
    const h=harness(async()=>page(records));
    h.insights.open(h.root);await flush();
    assert.match(h.root.innerHTML,/<strong>Very large difference:<\/strong>/);
    if(confirmed)assert.match(h.root.innerHTML,/The sample-size and statistical checks also pass for this record/);
    else{
      assert.match(h.root.innerHTML,/Not enough rounds to tell yet/);
      assert.match(h.root.innerHTML,/There aren’t enough rounds to raise an alert yet/);
      assert.doesNotMatch(h.root.innerHTML,/class="club-verdict (advantage|inverted)"/);
    }
    h.insights.close();
  }
});

test('a settlement arriving during a record download is fetched before Insights goes idle',async()=>{
  const initial=deferred(),calls=[];
  const h=harness((action,body)=>{calls.push(body);return calls.length===1?initial.promise:Promise.resolve(page([record(2)],{cursor:2,until:2}));});
  h.insights.open(h.root);h.changed(2);
  initial.resolve(page([record(1)]));await flush();await flush();
  assert.equal(calls.length,2,'the settlement notification must queue a fresh snapshot');
  assert.equal(calls[1].cursor,1);assert.equal('until' in calls[1],false,'do not reuse the completed snapshot ceiling');
  assert.equal(h.jobs.at(-1).records.length,2);assert.match(h.root.innerHTML,/2 settled wagered rounds/);
  h.insights.close();
});

test('visible Insights periodically checks new records without rerunning unchanged analysis',async()=>{
  let calls=0;const h=harness(async()=>{calls++;return page(calls===1?[record(1)]:calls===3?[record(2)]:[],{cursor:calls<3?1:2,until:calls<3?1:2});});
  h.insights.open(h.root);await flush();assert.equal(h.jobs.length,1);
  assert.equal(h.timers.size,1,'an open report must have a bounded refresh fallback');
  let [id,timer]=[...h.timers][0];h.timers.delete(id);timer.fn();await flush();
  assert.equal(calls,2);assert.equal(h.jobs.length,1,'unchanged records must keep the cached worker result');
  [id,timer]=[...h.timers][0];h.timers.delete(id);timer.fn();await flush();
  assert.equal(h.jobs.length,2);assert.equal(h.jobs[1].records.length,2);
  h.document.hidden=true;[id,timer]=[...h.timers][0];h.timers.delete(id);timer.fn();await flush();
  assert.equal(calls,3,'a hidden tab must not poll the record endpoint');
  h.changed(3);await flush();assert.equal(calls,3,'settlement events must also respect hidden tabs');
  h.document.hidden=false;h.visible();await flush();assert.equal(calls,4);assert.equal(h.jobs.length,2);
  h.insights.close();assert.equal(h.timers.size,0);
});

test('settlements during pagination start one fresh snapshot after the original snapshot completes',async()=>{
  const second=deferred(),calls=[];
  const h=harness(async(action,body)=>{calls.push(body);if(calls.length===1)return page([record(1),record(2)],{cursor:2,until:3,nextCursor:2});if(calls.length===2)return second.promise;return page([record(4)],{cursor:4,until:4});});
  h.insights.open(h.root);await flush();assert.equal(calls.length,2);h.changed(3);h.changed(4);
  second.resolve(page([record(3)],{cursor:3,until:3}));await flush();await flush();
  assert.equal(calls.length,3);assert.equal(calls[1].until,3);
  assert.equal(calls[2].cursor,3);assert.equal('until' in calls[2],false);
  assert.deepEqual(Array.from(h.jobs.at(-1).records,r=>r.roundId),[1,2,3,4]);h.insights.close();
});

test('resetting during a download cannot publish records from the old epoch',async()=>{
  const old=deferred(),calls=[];
  const h=harness(async(action,body)=>{calls.push(body);return calls.length===1?old.promise:page([],{cursor:0,until:0});});
  h.insights.open(h.root);h.player.profile.epoch='new';h.changed(0);old.resolve(page([record(1)]));
  await flush();await flush();assert.equal(calls.length,2);assert.equal(calls[1].epoch,'new');
  assert.equal(calls[1].cursor,0);assert.equal(h.jobs.length,1);assert.equal(h.jobs[0].epoch,'new');
  assert.equal(h.jobs[0].records.length,0);h.insights.close();
});

test('a rate-limited refresh backs off even when another settlement is queued',async()=>{
  const response=deferred();let calls=0;
  const h=harness(()=>{calls++;return response.promise;});h.insights.open(h.root);h.changed(1);
  response.resolve(Promise.reject(Error('Too many attempts. Please wait.')));await flush();
  assert.equal(calls,1);assert.equal([...h.timers.values()][0].ms,60000);
  h.changed(2);h.visible();await flush();assert.equal(calls,1,'new events cannot bypass the backoff');h.insights.close();
});
