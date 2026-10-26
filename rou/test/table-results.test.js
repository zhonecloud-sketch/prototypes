import test from 'node:test';
import assert from 'node:assert/strict';
import {createTableResults} from '../client/table-results.js';

function harness(){
  let visible=false,reduced=false,placements=0;
  const make=()=>({textContent:'',dataset:{},style:{},children:[],attrs:{},
    classList:{values:new Set(),add(x){this.values.add(x);},remove(x){this.values.delete(x);},contains(x){return this.values.has(x);}},
    setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},
    appendChild(e){this.children.push(e);e.parent=this;},remove(){if(this.parent)this.parent.children=this.parent.children.filter(e=>e!==this);},
    getBoundingClientRect:()=>({left:20,top:20,width:40,height:20}),
    querySelector:()=>({animate(){placements++;}})});
  const body=make(),wallet=make(),extraWallet=make(),seats=['a','b','c'].map(id=>Object.assign(make(),{dataset:{roomBankroll:id},parentElement:make()})),svgs=[make(),make()],cells=new Map();
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
  const payout={roomId:1,roundId:10,number:5,returned:50};
  const room=(paid=false)=>({roomId:1,seats:[{id:'a',balance:paid?125:75,payout:paid?payout:null},{id:'b',balance:paid?250:200,payout:paid?payout:null},{id:'c',balance:100,payout:null}]});
  const receive=r=>fx.receive(r,{id:'a',balance:r.seats[0].balance});
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
  assert.equal(h.chips,27,'streams go to both winning seats and the current player wallet');
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
  h.receive(h.room(true));h.result();h.fx.tick(2000);assert.equal(h.chips,27);
  const purchase=h.room(true);purchase.seats[0].balance=1125;h.receive(purchase);h.fx.tick(3000);
  assert.equal(h.wallet.textContent,'1125');assert.equal(h.chips,27);
});

test('joining after settlement shows the current balances without replaying historical payouts',()=>{
  const h=harness();h.visible(true);h.receive(h.room(true));h.result();h.fx.tick(0);h.fx.tick(2000);
  assert.equal(h.chips,0);assert.equal(h.wallet.textContent,'125');
});

test('a late settlement animates only after its winning number has been presented',()=>{
  const h=harness();h.visible(true);h.receive(h.room());h.receive(h.room(true));h.fx.tick(0);
  assert.equal(h.chips,0);h.result();h.fx.tick(100);assert.equal(h.chips,27);
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
