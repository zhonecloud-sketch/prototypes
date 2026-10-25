import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function harness(){
  let now=326000,callbacks,polls=0,visible=true;
  const nodes=new Map(),events=new Map(),travel=[],primes=[],prepares=[];
  const node=id=>{if(!nodes.has(id)){const classes=new Set();nodes.set(id,{textContent:'',style:{},hidden:false,
    classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},
    setAttribute(){},prepend(){},close(){}});}return nodes.get(id);};
  const player={id:'p',username:'Player',email:'p@example.test',balance:9975,profile:{}};
  const state={active:false,user:null,round:null,history:[],lastBets:[],counts:Array(37).fill(0)};
  const multi={active:true,fresh:true,busy:false,poll:async()=>{polls++;},leave:async()=>{},bet:async()=>{}};
  const engine={prime:(...x)=>primes.push(x),prepare:(...x)=>prepares.push(x)};
  const source=readFileSync(new URL('../client/game-account.js',import.meta.url),'utf8').replace(/^import .*\r?\n/gm,'').replaceAll('export ','');
  const install=vm.runInNewContext(source+';installAccounts',{
    account:{player},Date:class extends Date{static now(){return now;}},
    document:{hidden:false,createElement:()=>node('strip'),getElementById:node,addEventListener:(n,f)=>events.set(n,f),
      documentElement:{classList:{contains:()=>false}},querySelector:()=>null},
    mountAccount:()=>({open(){},close(){}}),toggleWideView(){},
    createMultiplayer(api){callbacks=api;return multi;}
  });
  const api={state,engine:()=>engine,resultVisible:()=>visible,text:(id,s)=>node(id).textContent=String(s),
    color:n=>n===0?'green':n===5?'red':'black',money:String,signed:n=>n>0?'+'+n:String(n),
    travel:to=>travel.push({to,at:now}),startSession(user,balance,pending,recent){Object.assign(state,{active:true,user,balance,round:null,history:recent});},
    paintBets(){},paintMoney(){},paintHistory(){},updateButtons(){},toast(){},sound(){},launch(){},
    pauseTravel(){},returnToTable(){travel.push({to:'table',at:now});},leaveSession(){},hasWagers:()=>!!state.round?.bets.length&&!state.round.settled};
  const installed=install(api);
  return {installed,state,multi,engine,travel,primes,prepares,node,events,
    get polls(){return polls;},time(t){now=t;installed.tick();},visible(value){visible=value;events.get('visibilitychange')?.();},
    receive(room){now=room.serverTime;callbacks.received(room,{...player,balance:room.wager?.settled?10000+room.wager.record.net:9975});}};
}
const bet={id:'red',amount:25,group:'g'};
function room(time,{number=5,settled=false,recordNumber=number,net=25,returned=50,round=10,wagerRound=10,bets=[bet]}={}){
  const record=settled?{roundId:wagerRound,roomId:1,number:recordNumber,bets,stake:25,returned,net,settledAt:wagerRound*30000+27000}:undefined;
  return {serverTime:time,roomId:1,running:true,source:'recorded',feed:{week:1},
    round:{id:round,start:round*30000,number},wager:{roundId:wagerRound,roomId:1,bets,settled,record},
    recent:settled?[recordNumber]:[],net:settled?net:0,lastBets:[bet],seats:[{seat:1,id:'p',username:'Player',balance:settled?10025:9975}]};
}

test('a late saved result is shown with net profit before returning to the next room round',()=>{
  const h=harness();h.receive(room(326000));h.time(327000);
  assert.match(h.node('payoutLabel').textContent,/Confirming/);
  h.receive(room(331000,{round:11,number:null,wagerRound:10,recordNumber:5,settled:true}));
  assert.equal(h.node('winner').classList.contains('visible'),true);
  assert.equal(h.node('winnerNumber').textContent,'5');
  assert.match(h.node('winnerLabel').textContent,/WIN/);
  assert.match(h.node('payoutLabel').textContent,/Net \+25/);
  assert.equal(h.state.round.id,11,'the live betting clock advances independently');
  assert.equal(h.installed.wheelRound.id,10,'the wheel retains the result being read');
  assert.ok(!h.primes.some(x=>x[0]===11),'the next path bank cannot erase the previous wheel');
  assert.equal(h.travel.at(-1).to,'wheel');
  h.time(333999);assert.equal(h.travel.at(-1).to,'wheel');
  h.time(334000);assert.equal(h.travel.at(-1).to,'table');
  assert.equal(h.state.round.id,11);
});

test('the result waits for the rendered ball to finish, then stays visible for three seconds',()=>{
  const h=harness();h.receive(room(326000));h.engine.visualClock=326950;
  h.receive(room(327000,{settled:true}));
  assert.equal(h.node('winner').classList.contains('visible'),false);
  h.engine.visualClock=327000;h.time(327100);
  assert.equal(h.node('winner').classList.contains('visible'),true);
  h.receive(room(330000,{round:11,number:null,settled:true,recordNumber:5}));
  assert.equal(h.installed.wheelRound.id,10);
  h.time(330099);assert.equal(h.installed.wheelRound.id,10);
  h.time(330100);assert.equal(h.installed.wheelRound.id,11);
  assert.equal(h.travel.at(-1).to,'table');
});

test('a missing settlement cannot reset the wheel or permit overwriting the old wager',()=>{
  const h=harness();h.receive(room(326000));h.time(327000);
  h.receive(room(331000,{round:11,number:null}));
  h.time(336000);
  assert.equal(h.installed.wheelRound.id,10);
  assert.equal(h.installed.pendingSettlement,true);
  assert.equal(h.installed.canBet(),false);
  assert.match(h.node('payoutLabel').textContent,/Confirming/);
  assert.ok(!h.primes.some(x=>x[0]===11));
  const wrong=room(336100,{round:11,number:null,recordNumber:5,settled:true});wrong.wager.record.roomId=2;
  h.receive(wrong);assert.equal(h.installed.pendingSettlement,true,'another room cannot confirm this result');
});

test('zero and losing net profit are preserved when the draw itself arrives late',()=>{
  const h=harness();h.receive(room(326000,{number:null}));h.time(327000);
  h.receive(room(331000,{round:11,number:null,settled:true,recordNumber:0,returned:0,net:-25}));
  assert.equal(h.node('winnerNumber').textContent,'0');
  assert.match(h.node('winnerLabel').textContent,/GREEN.*LOSS/);
  assert.match(h.node('payoutLabel').textContent,/Return 0.*Net -25/);
  assert.equal(h.state.balance,9975);
  assert.ok(h.prepares.some(x=>x[0]===10&&x[1]===0));
  h.time(334000);assert.equal(h.travel.at(-1).to,'table');
});

test('a hidden result does not spend its reading time in a background tab or panel',()=>{
  const h=harness();h.receive(room(327000,{settled:true}));h.time(328000);
  h.visible(false);h.receive(room(331000,{round:11,number:null,settled:true,recordNumber:5}));h.time(340000);
  assert.equal(h.installed.wheelRound.id,10);
  h.visible(true);h.time(340000);h.time(341999);
  assert.equal(h.installed.wheelRound.id,10);
  h.time(342000);assert.equal(h.installed.wheelRound.id,11);
});

test('Back to table during a spin does not block the next automatic wheel transition',()=>{
  const h=harness();h.receive(room(326000));h.engine.visualClock=326000;
  h.installed.backToTable?.();h.visible(false);
  h.receive(room(327000,{settled:true}));
  h.receive(room(331000,{round:11,number:null,settled:true,recordNumber:5}));
  assert.equal(h.installed.wheelRound.id,11,'an intentionally dismissed wheel must release the next round');
  h.receive(room(350000,{round:11,number:0,settled:true,recordNumber:5}));
  assert.equal(h.travel.at(-1).to,'wheel');
  assert.ok(h.prepares.some(x=>x[0]===11&&x[1]===0));
});

test('a manual return still waits for settlement and applies only to that wheel',()=>{
  const h=harness();h.receive(room(326000));
  h.installed.backToTable?.();h.visible(false);h.engine.visualClock=326000;
  h.receive(room(331000,{round:11,number:null}));
  assert.equal(h.installed.wheelRound.id,10);
  assert.equal(h.installed.pendingSettlement,true);
  assert.equal(h.installed.canBet(),false);
  h.receive(room(351000,{round:11,number:0,recordNumber:5,settled:true}));
  assert.equal(h.installed.wheelRound.id,11);
  assert.equal(h.installed.pendingSettlement,false);
  h.engine.visualClock=357000;
  h.receive(room(357000,{round:11,wagerRound:11,number:0,settled:true,net:-25,returned:0}));
  h.receive(room(361000,{round:12,wagerRound:11,number:null,recordNumber:0,settled:true,net:-25,returned:0}));
  assert.equal(h.installed.wheelRound.id,11,'the next result retains its own reading time');
  h.visible(true);h.time(361000);h.time(364000);
  assert.equal(h.installed.wheelRound.id,12);
});

test('Back to table cancels the active slide and notifies multiplayer presentation',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const handler=html.split("$('backToTable').onclick=")[1].split(";$('classicTab')")[0];
  for(const type of ['multiplayer','guest']){
    let dismissed=0,scrolled;
    const tween=vm.runInNewContext(`const handler=${handler};handler();scrollTween`,{
      scrollTween:{from:0,to:100},state:{user:{type}},gameAccounts:{backToTable(){dismissed++;}},
      prefs:{reduceMotion:false},viewportScrollTo:(...args)=>scrolled=args
    });
    assert.equal(tween,null);
    assert.equal(dismissed,type==='multiplayer'?1:0);
    assert.deepEqual(scrolled,[0,'smooth']);
  }
});

test('spectators and break-even wagers display meaningful results without inventing profit',()=>{
  const watcher=harness();watcher.receive(room(327000,{number:0,bets:[]}));
  assert.equal(watcher.node('winnerNumber').textContent,'0');
  assert.match(watcher.node('winnerLabel').textContent,/WINNING NUMBER/);
  assert.equal(watcher.node('payoutLabel').textContent,'Watching this round');
  assert.equal(watcher.polls,0);
  const even=harness();even.receive(room(327000,{settled:true,returned:25,net:0}));
  assert.match(even.node('winnerLabel').textContent,/BREAK EVEN/);
  assert.match(even.node('payoutLabel').textContent,/Net 0/);
});

test('a stale empty draw does not erase a number already received for the same wheel',()=>{
  const h=harness();h.receive(room(326000));h.receive(room(327000,{number:null}));
  assert.equal(h.installed.wheelRound.outcome,5);
  assert.equal(h.node('winnerNumber').textContent,'5');
  assert.match(h.node('winnerLabel').textContent,/SETTLING/);
});

test('a pre-settlement request can finish without preventing a fresh confirmation request',async()=>{
  const h=harness();h.receive(room(326000));let resolve,calls=0;
  h.multi.poll=()=>{calls++;return calls===1?new Promise(r=>resolve=r):Promise.resolve();};
  h.time(327000);h.time(327100);assert.equal(calls,1);
  resolve();await new Promise(setImmediate);
  h.time(328099);assert.equal(calls,1);
  h.time(328100);assert.equal(calls,2,'a stale in-flight poll cannot consume the only settlement refresh');
});

test('leaving clears the retained result and subsequent ticks are harmless',async()=>{
  const h=harness();h.receive(room(327000,{settled:true}));await h.installed.leave();
  h.time(331000);assert.equal(h.installed.wheelRound,null);
  assert.equal(h.installed.pendingSettlement,false);
});

test('joining during a spin reveals the wheel after the launch screen closes',async()=>{
  const h=harness();h.multi.active=false;
  h.multi.join=async()=>{h.multi.active=true;h.receive(room(326000));return true;};
  await h.node('multiplayerLogin').onclick();
  assert.equal(h.travel.at(-1).to,'wheel','returning from launch cannot cancel the in-progress wheel');
});

test('the animation frame renders the retained wheel instead of the newer live round',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8'),frame=html.match(/^function frame\(t\).*$/m)[0];
  let rendered;
  const shown={id:10},live={id:11};
  const run=vm.runInNewContext(frame+';frame',{
    state:{user:{type:'multiplayer'},round:live},gameAccounts:{wheelRound:shown},
    rafHandle:0,requestAnimationFrame(){},scrollTween:null,wheelPresentation:()=> 'full',
    engine:{setPresentation(){},update(t,r){rendered=r;}},lastRender:0,previewVisible:false
  });
  run(100);assert.equal(rendered,shown);
});
