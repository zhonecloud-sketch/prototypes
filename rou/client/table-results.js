// Presentation only: every balance and chip return comes from the settled game.
export function createTableResults({formatMoney=String,visible=()=>true,reduceMotion=()=>false,doc=document,later=setTimeout}={}){
  const balances=new Map(),seen=new Map(),pending=new Map(),active=new Map(),chips=new Set();
  let roomId=null,playerId='solo',wallet=0,readyKey='',dollyKey='',dollyPending=false;
  const key=p=>`${p.roomId}:${p.roundId}`;
  const valid=p=>p&&Number.isSafeInteger(p.roundId)&&Number.isInteger(p.number)&&p.number>=0&&p.number<=36&&Number.isSafeInteger(p.returned)&&p.returned>0&&Number.isSafeInteger(p.net)&&p.net>0;
  const wallets=()=>[doc.getElementById('balance'),...doc.querySelectorAll('[data-wallet-balance]')].filter(Boolean);
  const targets=id=>[...doc.querySelectorAll('[data-room-bankroll]')].filter(e=>e.dataset.roomBankroll===id).concat(id===playerId?wallets():[]);
  function amount(id,value){return Math.max(0,active.get(id)?.value??(pending.has(id)?value-pending.get(id).returned:value));}
  function paint(id){const value=balances.get(id)??wallet;for(const el of targets(id))el.textContent=formatMoney(amount(id,value));}
  function update(id,value){
    const old=balances.get(id);balances.set(id,value);
    const moving=active.get(id);
    if(moving&&old!==undefined&&old!==value){const delta=value-old;moving.from+=delta;moving.to=value;moving.value+=delta;}
    if(pending.has(id))pending.get(id).balance=value;
  }
  function clear(){
    doc.querySelectorAll('.table-dolly').forEach(e=>e.remove());
    doc.querySelectorAll('.bet-target.hit,.track-cell.hit').forEach(e=>e.classList.remove('hit'));
    dollyKey='';dollyPending=false;
  }
  function reset(){
    clear();for(const chip of chips)chip.remove();chips.clear();
    balances.clear();seen.clear();pending.clear();active.clear();roomId=null;readyKey='';playerId='solo';
  }
  function result(round){
    const number=round.outcome??round.number;if(!Number.isInteger(number)||number<0||number>36)return;
    readyKey=key({roomId:round.roomId??0,roundId:round.id??round.roundId});
    for(const [id,p] of pending)if(p.roomId===(round.roomId??0)&&p.roundId<(round.id??round.roundId)){pending.delete(id);paint(id);}
    if(dollyKey===readyKey)return;
    clear();dollyKey=readyKey;
    for(const [layout,selector] of [`[data-bet="n:${number}"]`,`[data-track-number="${number}"]`].entries()){
      const cell=doc.querySelector(selector),text=cell?.querySelector('text'),svg=cell?.ownerSVGElement;
      if(!text||!svg)continue;
      cell.classList.add('hit');
      const marker=doc.createElementNS('http://www.w3.org/2000/svg','g');
      marker.setAttribute('class','table-dolly');marker.setAttribute('role','img');marker.setAttribute('aria-label',`Winning number ${number}`);
      marker.setAttribute('transform',`translate(${Number(text.getAttribute('x'))},${Number(text.getAttribute('y'))+6})`);
      // Acrylic ball-top dolly, based on casino equipment:
      // https://shopcasinoquest.com/products/roulette-dolly
      const glass=`dolly-${layout}`;
      marker.innerHTML=`<defs>
        <linearGradient id="${glass}-body"><stop stop-color="#e8fbff" stop-opacity=".7"/><stop offset=".12" stop-color="#fff" stop-opacity=".18"/><stop offset=".4" stop-color="#d6f1ee" stop-opacity=".04"/><stop offset=".72" stop-color="#0b2723" stop-opacity=".26"/><stop offset=".9" stop-color="#e8fbff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity=".75"/></linearGradient>
        <linearGradient id="${glass}-rim"><stop stop-color="#f4ffff" stop-opacity=".8"/><stop offset=".3" stop-color="#cde9e6" stop-opacity=".2"/><stop offset=".65" stop-color="#193c35" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
        <radialGradient id="${glass}-ball" cx="32%" cy="25%" r="76%"><stop stop-color="#fff" stop-opacity=".75"/><stop offset=".3" stop-color="#efffff" stop-opacity=".18"/><stop offset=".65" stop-color="#d8efed" stop-opacity=".05"/><stop offset=".88" stop-color="#12372e" stop-opacity=".42"/><stop offset="1" stop-color="#dff6f6" stop-opacity=".8"/></radialGradient>
      </defs>
      <ellipse cx="2" cy="10" rx="12" ry="4" fill="#000" opacity=".25"/>
      <g class="dolly-body" stroke="#e4f7f6" stroke-opacity=".65" stroke-width=".65">
        <path d="M-10-10A10 3 0 0 1 10-10V8A10 3 0 0 1-10 8Z" fill="url(#${glass}-body)"/>
        <ellipse cy="8" rx="10" ry="3" fill="url(#${glass}-rim)"/>
        <ellipse cy="-10" rx="10" ry="3" fill="url(#${glass}-rim)"/>
        <path d="M-7-10Q-2-14-4-19H4Q2-14 7-10Q0-6-7-10Z" fill="url(#${glass}-body)"/>
        <circle cy="-25" r="10.5" fill="url(#${glass}-ball)"/>
        <path d="M-7-29Q-3-35 4-32M-7-7V4" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M7-6V5M-7 7Q0 10 7 7" fill="none" stroke="#f4ffff" stroke-opacity=".45"/>
        <ellipse cx="-4.5" cy="-29.5" rx="1.6" ry="1" fill="#fff" fill-opacity=".8" stroke="none"/>
      </g>`;
      svg.appendChild(marker);
    }
    dollyPending=!reduceMotion();
  }
  function receive(room,player){
    const nextRoom=room.roomId||1;
    if(roomId!==nextRoom||playerId!==player.id){reset();roomId=nextRoom;playerId=player.id;}
    wallet=player.balance;
    const present=new Set();
    for(const seat of room.seats){
      const id=seat.id;present.add(id);const known=balances.has(id),p=seat.payout;
      if(valid(p)&&p.roomId===nextRoom&&seen.get(id)!==key(p)){
        seen.set(id,key(p));
        if(known){active.delete(id);pending.set(id,{...p,balance:seat.balance});}
      }
      update(id,seat.balance);paint(id);
      for(const el of targets(id))if(el.dataset.roomBankroll===id)el.parentElement?.setAttribute('aria-label',`${seat.username} bankroll ${formatMoney(seat.balance)} chips`);
    }
    for(const id of balances.keys())if(!present.has(id)){balances.delete(id);seen.delete(id);pending.delete(id);active.delete(id);}
    paintWallet(wallet);
  }
  function paintWallet(value){
    wallet=value;
    if(balances.has(playerId))update(playerId,value);
    for(const el of wallets())el.textContent=formatMoney(amount(playerId,value));
  }
  function solo(round,balance){
    if(roomId!==0){reset();roomId=0;playerId='solo';}
    const p={roomId:0,roundId:round.id,number:round.outcome,returned:round.returned,net:round.net,balance};
    if(round.bets.length&&valid(p)&&seen.get(playerId)!==key(p)){seen.set(playerId,key(p));pending.set(playerId,p);}
    update(playerId,balance);wallet=balance;result({...round,roomId:0});paint(playerId);
  }
  function fly(to,id){
    const source=[...doc.querySelectorAll('.table-dolly')].find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;});
    if(!source)return;
    const from=source.getBoundingClientRect(),end=to.getBoundingClientRect();
    if(!end.width||!end.height)return;
    for(let i=0;i<9;i++){
      const el=doc.createElement('i');el.className='coin-fx table-payout-chip';el.setAttribute('aria-hidden','true');el.dataset.payoutRecipient=id;
      const x=from.left+from.width/2+(i-4)*3,y=from.top+from.height/2;
      el.style.cssText=`left:${x}px;top:${y}px;--dx:${end.left+end.width/2-x}px;--dy:${end.top+end.height/2-y}px;--delay:${i*.04}s`;
      chips.add(el);doc.body.appendChild(el);later(()=>{el.remove();chips.delete(el);},2200);
    }
  }
  function tick(time){
    if((!pending.size&&!active.size&&!dollyPending)||!visible())return;
    if(dollyPending){
      dollyPending=false;
      if(!reduceMotion())for(const marker of doc.querySelectorAll('.table-dolly'))marker.querySelector('.dolly-body')?.animate?.([{transform:'translateY(-25px)',opacity:0},{transform:'translateY(2px)',opacity:1,offset:.75},{transform:'translateY(0)',opacity:1}],{duration:550,easing:'ease-out'});
    }
    for(const [id,p] of pending){
      if(key(p)!==readyKey)continue;
      pending.delete(id);
      if(reduceMotion()){paint(id);continue;}
      const list=targets(id);if(!list.length)continue;
      active.set(id,{from:p.balance-p.returned,to:p.balance,value:p.balance-p.returned,start:time});
      for(const target of list){target.classList.remove('win-flash');void target.offsetWidth;target.classList.add('win-flash');}
      // Multiplayer has exactly one shared flow per winning seat for every viewer.
      const destination=roomId===0?wallets()[0]:list.find(e=>e.dataset.roomBankroll===id);
      if(destination)fly(destination,id);
    }
    for(const [id,a] of active){
      const t=Math.max(0,Math.min(1,(time-a.start)/1500));a.value=Math.round(a.from+(a.to-a.from)*(1-(1-t)**3));
      if(t===1)active.delete(id);paint(id);
    }
  }
  return {receive,result,paintWallet,solo,tick,clear,reset};
}
