import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {analyse,MODEL} from '../client/insights-model.js';

const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('high-refresh displays respect wheel budgets and covered pages do not render',()=>{
  const frame=index.match(/^function frame\(t\).*$/m)[0];
  const presentation=index.match(/^function wheelPresentation\(\).*$/m)[0];
  for(const [mode,limit] of [['preview',121],['full',301],['menu',0],['account',0],['statistics',0],['dialog',0],['hidden',0]]){
    let renders=0,ticks=0;
    const context={state:{active:true,round:{}},document:{hidden:mode==='hidden',documentElement:{classList:{contains:()=>mode==='account'}},querySelector:()=>mode==='dialog'},
      $:()=>({classList:{contains:c=>c==='hide'?mode==='menu':mode==='statistics'}}),wheelVisible:mode==='full',previewVisible:true,
      engine:{setPresentation(){},update(){renders++;}},lastRender:0,scrollTween:null,rafHandle:0,requestAnimationFrame(){},tick(){ticks++;}};
    const run=vm.runInNewContext(presentation+'\n'+frame+';frame',context);
    for(let t=0;t<=5000;t+=1000/240)run(t);
    assert.ok(renders<=limit,`${mode}: ${renders} renders`);
    if(limit)assert.ok(renders>=limit-3,`${mode}: animation must keep moving`);
    assert.equal(ticks,0,'animation must not start a second UI update loop');
  }
});

function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}
test('a pending poll never blocks a wager or overwrites its confirmed result',async()=>{
  const source=readFileSync(new URL('../client/multiplayer.js',import.meta.url),'utf8').replace(/^import .*\r?\n/,'').replaceAll('export ','');
  const pending=deferred(),wager=deferred(),received=[];let signal;
  const create=vm.runInNewContext(source+';createMultiplayer',{
    account:{player:{id:'p'}},crypto,Date,AbortController,setInterval:()=>1,clearInterval(){},
    accountRequest(action,body,headers,options){
      if(action==='room-poll'){signal=options.signal;return pending.promise;}
      if(action==='room-bet')return wager.promise;
      return Promise.resolve({room:'joined',player:{}});
    }
  });
  const multi=create({received:r=>received.push(r),error:e=>assert.fail(e),updated(){}});
  await multi.join();const poll=multi.poll();
  assert.equal(multi.busy,false,'refreshes must leave betting available');
  const bet=multi.bet('add',[{id:'red',amount:25}],10,1);
  assert.equal(signal.aborted,true);assert.equal(multi.busy,true);
  wager.resolve({room:'confirmed',player:{}});await bet;
  pending.resolve({room:'old poll',player:{}});await poll;
  assert.deepEqual(received,['joined','confirmed']);assert.equal(multi.busy,false);
});

test('cancelled responses cannot publish stale account balances',async()=>{
  const source=readFileSync(new URL('../client/account-api.js',import.meta.url),'utf8').replaceAll('export ','');
  const json=deferred();let notifications=0;
  const api=vm.runInNewContext(source+';({account,accountRequest})',{
    location:{hostname:'localhost',origin:'http://localhost'},sessionStorage:{getItem:()=>null,setItem(){}},
    crypto,AbortSignal,DOMException,CustomEvent:class{},document:{dispatchEvent(){notifications++;}},
    fetch:async()=>({ok:true,json:()=>json.promise})
  });
  const controller=new AbortController(),request=api.accountRequest('room-poll',{},{},{signal:controller.signal});
  await Promise.resolve();controller.abort();json.resolve({player:{id:'p',balance:1}});
  await assert.rejects(request,{name:'AbortError'});
  assert.equal(api.account.player,null);assert.equal(notifications,0);
});

test('Insights reuses unchanged analysis but recalculates filters and a reset epoch',async()=>{
  const source=readFileSync(new URL('../client/server-insights.js',import.meta.url),'utf8').replace(/^import .*\r?\n/gm,'').replaceAll('export ','').replaceAll('import.meta.url',"'https://example.test/client/server-insights.js'");
  const jobs=[],workers=[],player={id:'p',profile:{epoch:'first',insightsUntil:0}};
  const create=vm.runInNewContext(source+';createServerInsights',{
    account:{player},MODEL,INSIGHTS_PASS:{cents:490},URL,Date,Intl,setTimeout,clearTimeout,
    document:{documentElement:{classList:{contains:()=>true}},addEventListener(){}},
    Worker:class{constructor(){workers.push(this);}postMessage(data){jobs.push(data);}},
    accountRequest:async()=>({records:[],cursor:0,until:0,premium:false,resetAt:300001})
  });
  const root={isConnected:true,innerHTML:'',querySelector:()=>null},insights=create();
  insights.open(root);await new Promise(setImmediate);assert.equal(jobs.length,1);
  workers[0].onmessage({data:{id:jobs[0].id,result:analyse([])}});
  assert.match(root.innerHTML,/Your record starts with a wager/);
  insights.close();insights.open(root);await new Promise(setImmediate);
  assert.equal(jobs.length,1,'opening the same record must reuse its analysis');
  insights.change({target:{matches:s=>s==='[data-insight-mode]',value:'snapshot'}});
  assert.equal(jobs.length,2);assert.equal(jobs[1].options.alpha,MODEL.alpha);
  insights.close();player.profile.epoch='second';insights.open(root);await new Promise(setImmediate);
  assert.equal(jobs.length,3);assert.equal(jobs[2].epoch,'second');insights.close();
});
