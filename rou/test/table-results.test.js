import test from 'node:test';
import assert from 'node:assert/strict';
import {createTableResults} from '../client/table-results.js';

function harness({ids=['a','b','c'],viewer='a'}={}){
  let visible=false,reduced=false,placements=0;
  const make=()=>({textContent:'',dataset:{},style:{},children:[],attrs:{},
    classList:{values:new Set(),add(x){this.values.add(x);},remove(x){this.values.delete(x);},contains(x){return this.values.has(x);}},
    setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},
    appendChild(e){this.children.push(e);e.parent=this;},remove(){if(this.parent)this.parent.children=this.parent.children.filter(e=>e!==this);},
    getBoundingClientRect:()=>({left:20,top:20,width:40,height:20}),
    querySelector:()=>({animate(){placements++;}})});
  const body=make(),wallet=make(),extraWallet=make(),seats=ids.map((id,i)=>Object.assign(make(),{dataset:{roomBankroll:id},parentElement:make(),getBoundingClientRect:()=>({left:100+i*120,top:40,width:60,height:20})})),svgs=[make(),make()],cells=new Map();
  for(const n of [0,5])for(const [i,selector]of [`[data-bet="n:${n}"]`,`[data-track-number="${n}"]`].entries()){
    const text=make();text.attrs={x:String(50+n),y:'30'};
    const cell=make();cell.ownerSVGElement=svgs[i];cell.querySelector=()=>text;cells.set(selector,cell);
  }
  const doc={body,getElementById:()=>wallet,createElement:make,createElementNS:make,
    querySelector:selector=>cells.get(selector),querySelectorAll(selector){
      if(selector==='[data-wallet-balance]')return [extraWallet];
      if(selector==='[data-room-bankroll]')return seats;
      if(selector==='.table-dolly')return svgs.flatMap(s=>s.children);
      if(selector==='.bet-target.hit,.track-cell.hit')return [...cells.values()].filter(c=>c.classList.contains('hit'));
      return [];
    }};
  const fx=createTableResults({doc,visible:()=>visible,reduceMotion:()=>reduced,later(){}});
  const payout={roomId:1,roundId:10,number:5,returned:50,net:25};
  const room=(paid=false)=>({roomId:1,seats:ids.map((id,i)=>({id,username:'Player '+id,balance:i===0?(paid?125:75):i===1?(paid?250:200):100,payout:paid&&i<2?payout:null}))});
  const receive=r=>fx.receive(r,{id:viewer,balance:r.seats.find(s=>s.id===viewer)?.balance??10000});
  return {fx,doc,wallet,extraWallet,seats,room,receive,body,cells,
    visible(v){visible=v;},reduced(v){reduced=v;},get placements(){return placements;},
    result(number=5){fx.result({id:10,roomId:1,outcome:number});},get chips(){return body.children.length;}};
}

test('confirmed returns wait for the table, then animate all recipients and their figures together',()=>{
  const h=harness(),snapshot=h.room(true),saved=structuredClone(snapshot);
  h.receive(h.room());h.receive(snapshot);h.result();h.fx.tick(100);
  assert.equal(h.chips,0);assert.equal(h.wallet.textContent,'75');assert.equal(h.seats[1].textContent,'200');
  assert.equal(h.placements,0,'the dolly drop must not finish off screen');
  assert.match(h.seats[1].parentElement.attrs['aria-label'],/bankroll 250 chips/);
  h.visible(true);h.fx.tick(200);
  assert.equal(h.placements,2);
  assert.equal(h.chips,18,'one stream goes to each winning seat, with no extra wallet stream');
  assert.equal(h.wallet.textContent,'75');assert.equal(h.extraWallet.textContent,'75');
  h.fx.tick(950);assert.ok(Number(h.wallet.textContent)>75&&Number(h.wallet.textContent)<125);
  assert.ok(Number(h.seats[1].textContent)>200&&Number(h.seats[1].textContent)<250);
  assert.equal(h.seats[2].textContent,'100','losers receive no invented payout');
  h.fx.tick(1700);assert.equal(h.wallet.textContent,'125');assert.equal(h.seats[0].textContent,'125');assert.equal(h.seats[1].textContent,'250');
  assert.deepEqual(snapshot,saved,'animation cannot change the server wallet or wager data');
});

test('repeated polls neither restart a payout nor mistake a refund or purchase for winnings',()=>{
  const h=harness();h.visible(true);h.receive(h.room());h.receive(h.room(true));h.result();h.fx.tick(0);
  h.fx.tick(500);const midway=h.wallet.textContent;h.receive(h.room(true));
  assert.equal(h.wallet.textContent,midway);h.fx.tick(1500);
  h.receive(h.room(true));h.result();h.fx.tick(2000);assert.equal(h.chips,18);
  const purchase=h.room(true);purchase.seats[0].balance=1125;h.receive(purchase);h.fx.tick(3000);
  assert.equal(h.wallet.textContent,'1125');assert.equal(h.chips,18);
});

test('joining after settlement shows the current balances without replaying historical payouts',()=>{
  const h=harness();h.visible(true);h.receive(h.room(true));h.result();h.fx.tick(0);h.fx.tick(2000);
  assert.equal(h.chips,0);assert.equal(h.wallet.textContent,'125');
});

test('a late settlement animates only after its winning number has been presented',()=>{
  const h=harness();h.visible(true);h.receive(h.room());h.receive(h.room(true));h.fx.tick(0);
  assert.equal(h.chips,0);h.result();h.fx.tick(100);assert.equal(h.chips,18);
});

test('zero gets a dolly on both layouts, and repeated ticks do not replace it',()=>{
  const h=harness();h.receive(h.room());h.result(0);
  const markers=h.doc.querySelectorAll('.table-dolly');assert.equal(markers.length,2);assert.equal(h.placements,0);
  h.visible(true);h.fx.tick(0);assert.equal(h.placements,2);
  assert.ok(markers.every(m=>m.attrs['aria-label']==='Winning number 0'));
  h.result(0);assert.equal(h.placements,2);assert.equal(h.doc.querySelectorAll('.table-dolly')[0],markers[0]);
  h.fx.clear();assert.equal(h.doc.querySelectorAll('.table-dolly').length,0);
});

test('reduced motion keeps the result and exact balances without chip flights or counter animation',()=>{
  const h=harness();h.reduced(true);h.visible(true);h.receive(h.room());h.receive(h.room(true));h.result();h.fx.tick(0);
  assert.equal(h.wallet.textContent,'125');assert.equal(h.seats[1].textContent,'250');
  assert.equal(h.chips,0);assert.equal(h.placements,0);assert.equal(h.doc.querySelectorAll('.table-dolly').length,2);
});

test('spending during a credit animation cannot display a negative bankroll or change its final value',()=>{
  const h=harness();h.visible(true);h.receive(h.room());h.receive(h.room(true));h.result();h.fx.tick(0);
  const spent=h.room(true);spent.seats[0].balance=20;h.receive(spent);
  assert.ok(Number(h.wallet.textContent)>=0);h.fx.tick(1500);assert.equal(h.wallet.textContent,'20');
});

test('changing rooms clears pending credits, counters and chips from the previous room',()=>{
  const h=harness();h.visible(true);h.receive(h.room());h.receive(h.room(true));h.result();h.fx.tick(0);
  h.receive({roomId:2,seats:[{id:'a',balance:500,payout:null}]});h.fx.tick(2000);
  assert.equal(h.chips,0);assert.equal(h.wallet.textContent,'500');assert.equal(h.doc.querySelectorAll('.table-dolly').length,0);
});

const endPoint=chip=>{
  const value=name=>Number(chip.style.cssText.match(new RegExp('(?:^|;)'+name+':([-0-9.]+)px'))[1]);
  return {x:value('left')+value('--dx'),y:value('top')+value('--dy')};
};

test('all six winners get exactly six distinct seat flows, from every player perspective',()=>{
  const ids=['a','b','c','d','e','f'];
  for(const viewer of ids){
    const h=harness({ids,viewer}),before=h.room(),after=structuredClone(before);
    for(const s of after.seats){s.balance+=50;s.payout={roomId:1,roundId:10,number:5,returned:50,net:25};}
    h.visible(true);h.receive(before);h.receive(after);h.result();h.fx.tick(0);
    assert.equal(h.chips,54,viewer+': exactly six streams of nine chips');
    for(const id of ids){
      const stream=h.body.children.filter(c=>c.dataset.payoutRecipient===id);assert.equal(stream.length,9,id);
      const target=h.seats.find(s=>s.dataset.roomBankroll===id).getBoundingClientRect();
      for(const chip of stream)assert.deepEqual(endPoint(chip),{x:target.left+target.width/2,y:target.top+target.height/2});
    }
  }
});

test('a spectating player sees every winner flow and receives no chips or bankroll increase',()=>{
  const h=harness({viewer:'c'});h.visible(true);h.receive(h.room());h.receive(h.room(true));h.result();h.fx.tick(0);
  assert.equal(h.chips,18);assert.deepEqual([...new Set(h.body.children.map(c=>c.dataset.payoutRecipient))].sort(),['a','b']);
  h.fx.tick(1500);assert.equal(h.wallet.textContent,'100');assert.equal(h.seats[2].textContent,'100');
});

test('partial returns on a losing round and break-even returns do not create winner flows',()=>{
  for(const net of [-15,0]){
    const h=harness(),after=h.room(true);after.seats[2].balance+=10;after.seats[2].payout={roomId:1,roundId:10,number:5,returned:10,net};
    h.visible(true);h.receive(h.room());h.receive(after);h.result();h.fx.tick(0);
    assert.equal(h.chips,18);assert.equal(h.body.children.some(c=>c.dataset.payoutRecipient==='c'),false);
    assert.equal(h.seats[2].textContent,'110','non-winning returns still update the actual balance');
  }
});

test('solo play retains its single flow to the player wallet',()=>{
  const h=harness();h.visible(true);h.fx.solo({id:10,outcome:5,bets:[{id:'red',amount:25}],returned:50,net:25},125);h.fx.tick(0);
  assert.equal(h.chips,9);assert.ok(h.body.children.every(c=>c.dataset.payoutRecipient==='solo'));
});
