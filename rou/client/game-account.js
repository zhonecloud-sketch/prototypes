import { account } from './account-api.js?v=20261022-perf';
import { mountAccount } from './account.js?v=20261024-touch-scroll';
import { createMultiplayer } from './multiplayer.js?v=20261022-perf';
import { toggleWideView } from './wide-view.js';
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function installAccounts(api){
  const state=api.state;let snapshot=null,seenRecord=null,resultRefresh=null,seatKey='';
  const strip=document.createElement('div');strip.id='roomPlayers';strip.className='account-room-strip';strip.hidden=true;$('bettingView').prepend(strip);
  function launchInfo(){
    $('accountSignIn').textContent=account.player?`♙ ${account.player.username}`:'♙ Sign in';
    $('accountSignIn').setAttribute('aria-label',account.player?'View player information':'Sign in or create account');
    $('accountSignIn').title=account.player?.email||'';
    const name=account.player?.username||state.user?.name||'Guest';
    $('username').textContent=name;$('avatar').textContent=name[0].toUpperCase();
    $('username').title=account.player?.email||'Guest solo play';
    $('guestLogin').textContent=state.active&&state.user?.type!=='multiplayer'?'Return to table ↗':'Enter as Guest ↗';
    $('multiplayerLogin').textContent=multi.active?'Return to Multiplayer ↗':'Multiplayer ↗';
  }
  const multi=createMultiplayer({received(room,player){
    const betsBefore=JSON.stringify(state.round?.bets||[]),historyChanged=JSON.stringify(state.history)!==JSON.stringify(room.recent);
    snapshot=room;state.offset=room.serverTime-Date.now();
    if(state.user?.type!=='multiplayer')api.startSession({type:'multiplayer',sub:player.id,name:player.username},player.balance,null,room.recent,player.profile);
    state.source='multiplayer';state.balance=player.balance;state.club=player.profile;state.sessionNet=room.net||0;state.lastBets=room.lastBets;
    const current=room.round,wager=room.wager?.roundId===current.id&&(room.wager.roomId||1)===room.roomId?room.wager:null,elapsed=Date.now()+state.offset-current.start;
    const prior=state.round;api.engine()?.prime(current.id,current.start+20000,room.roomId);
    state.round={id:current.id,roomId:room.roomId,start:current.start,bets:wager?.bets||[],locked:elapsed>=20000,settled:!!wager?.settled,outcome:current.number,source:'multiplayer',available:true,late:false,returned:wager?.record?.returned||0,net:wager?.record?.net||0};
    if((prior?.id!==current.id||prior?.roomId!==room.roomId)){$('winner').classList.remove('visible');api.travel('table');}
    if(current.number!==null&&((prior?.id!==current.id||prior?.roomId!==room.roomId)||prior?.outcome===null)){api.engine()?.prepare(current.id,current.number,current.start+20000,room.roomId);api.travel('wheel');}
    const record=wager?.record;
    if(record&&`${room.roomId}:${record.roundId}`!==seenRecord){seenRecord=`${room.roomId}:${record.roundId}`;if(record.roundId===current.id){$('winnerNumber').textContent=record.number;$('winnerNumber').className='winner-disc '+api.color(record.number);$('winnerLabel').textContent=api.color(record.number).toUpperCase();$('payoutLabel').textContent=`Return ${api.money(record.returned)} · Net ${api.signed(record.net)}`;$('winner').classList.add('visible');}}
    if(historyChanged){state.history=room.recent;state.counts=Array(37).fill(0);for(const n of room.recent)state.counts[n]++;state.rounds=room.recent.length;}
    strip.hidden=false;const nextSeats=JSON.stringify(room.seats)+player.id;if(nextSeats!==seatKey){seatKey=nextSeats;strip.innerHTML=Array.from({length:6},(_,i)=>{const member=room.seats.find(s=>s.seat===i+1),name=member?escape(member.username):'Empty seat';return `<div class="room-seat ${member?.id===player.id?'self':member?'':'empty'}"><div class="room-player"><span class="room-portrait" aria-hidden="true">${member?escape(Array.from(member.username)[0].toUpperCase()):'♙'}</span><b title="${name}">${name}${member?.id===player.id?' · You':''}</b></div><span class="room-bankroll" aria-label="${member?`${name} bankroll ${api.money(member.balance)} chips`:'Waiting for a player'}"><strong>${member?api.money(member.balance):'—'}</strong>${member?'':' <small>OPEN SEAT</small>'}</span></div>`;}).join('');}
    $('headerSource').textContent='ROOM '+room.roomId;$('saveStatus').textContent='Multiplayer account';$('accountDetails').textContent=player.username+' · Multiplayer account · chips and records saved on the server';$('sourceSelect').disabled=true;if(betsBefore!==JSON.stringify(state.round.bets)||prior?.id!==current.id||prior?.roomId!==room.roomId)api.paintBets();api.paintMoney();if(historyChanged)api.paintHistory();launchInfo();tick();
  },updated:()=>{api.updateButtons();tick();},error:api.toast,disconnected(){api.launch();api.toast('Room connection lost. Choose Multiplayer to reconnect.');}});
  async function leave(){await multi.leave();strip.hidden=true;$('sourceSelect').disabled=false;launchInfo();}
  const panel=mountAccount({opened:api.pauseTravel,inGame:()=>state.active,openMenu:api.launch,returnToGame:api.returnToTable,canLeave:()=>!api.hasWagers(),leaveRoom:leave,changed(player){launchInfo();if(player&&state.user?.type==='multiplayer'&&state.user.sub===player.id){const changed=state.balance!==player.balance;state.balance=player.balance;state.club=player.profile;if(changed)api.paintMoney();}},authenticated(player){if(!player&&state.user?.type==='multiplayer'){state.active=false;state.user=null;state.round=null;strip.hidden=true;}api.launch();launchInfo();api.toast(player?`Welcome, ${player.username}. Choose Multiplayer to join the room.`:'Signed out.');}});
  $('accountSignIn').onclick=()=>panel.open('account');
  $('multiplayerLogin').onclick=async()=>{
    if(!account.player){panel.open('login');return;}
    if(multi.active){api.returnToTable();return;}
    if(api.hasWagers()&&state.user?.type!=='multiplayer'){api.toast('Wait for the current wager to settle before switching games.');return;}
    try{if(state.active&&state.user?.type!=='multiplayer'){await api.leaveSession();if(state.active)return;}if(await multi.join())api.returnToTable();}catch(e){api.toast(e.message);}
  };
  const solo=$('guestLogin').onclick;
  $('guestLogin').onclick=async()=>{if(state.user?.type==='multiplayer'){if(api.hasWagers()){api.toast('Wait for the current wager to settle first.');return;}try{await leave();await api.leaveSession();}catch(e){api.toast(e.message);return;}}solo();strip.hidden=true;launchInfo();};
  for(const id of ['googleLogin','connectGoogle']){const original=$(id).onclick;$(id).onclick=()=>{if(state.user?.type==='multiplayer'){api.toast('Leave the multiplayer table before switching to Google solo play.');return;}original();};}
  document.addEventListener('click',e=>{const entry=e.target.closest('[data-club-open]');if(account.player&&entry&&['collection','chips','insights'].includes(entry.dataset.clubOpen)){e.preventDefault();e.stopImmediatePropagation();panel.open(entry.dataset.clubOpen);}},true);
  function tick(){
    if(!snapshot||!state.round)return;const elapsed=Math.max(0,(Date.now()+state.offset-state.round.start)/1000),betting=elapsed<20,spinning=elapsed>=20&&elapsed<27,left=Math.max(0,Math.ceil((betting?20:spinning?27:30)-elapsed));
    state.round.locked=!betting;
    if(elapsed>=27&&resultRefresh!==`${snapshot.roomId}:${state.round.id}`&&multi.fresh&&!multi.busy){resultRefresh=`${snapshot.roomId}:${state.round.id}`;void multi.poll();}
    const time=new Date(Date.now()+state.offset+8*3600000);api.text('wallClock',[time.getUTCHours(),time.getUTCMinutes(),time.getUTCSeconds()].map(n=>String(n).padStart(2,'0')).join(':'));api.text('roundCode',state.round.id);api.text('motionLabel',betting?'SHARED TABLE':spinning?'SERVER DRAW · BALL IN PLAY':'RESULT CONFIRMED');
    for(const id of ['countdown','wheelTimer'])api.text(id,String(left).padStart(2,'0'));
    api.text('phaseLabel',snapshot.running===false?'SERVER STOPPED':!multi.fresh?'RECONNECTING':betting?'PLACE YOUR BETS':spinning?'NO MORE BETS':'ROUND COMPLETE');
    api.text('wheelPhase',betting?'BETTING OPEN':spinning?'BALL IN PLAY':'NEXT ROUND');api.text('wheelTitle','Roulette');api.text('wheelSubtitle','ROOM '+snapshot.roomId+' · ROUND '+state.round.id);
    $('progress').style.width=Math.max(0,(betting?(20-elapsed)/20:spinning?(27-elapsed)/7:(30-elapsed)/3)*100)+'%';
    api.text('motionCaption',betting?'Every player shares this draw.':spinning?'No more bets.':'Next betting window in '+left+' seconds.');
    if(elapsed>=27&&state.round.outcome!==null){const number=state.round.outcome;api.text('winnerNumber',number);$('winnerNumber').className='winner-disc '+api.color(number);api.text('winnerLabel',api.color(number).toUpperCase());api.text('payoutLabel',state.round.settled?`Return ${api.money(state.round.returned)} · Net ${api.signed(state.round.net)}`:state.round.bets.length?'Confirming server settlement…':'Watching this round');$('winner').classList.add('visible');}
    api.text('connectionStatus',snapshot.running===false?'Multiplayer stopped by developer · accepted wagers will settle':multi.busy?'Sending wager…':multi.fresh?(snapshot.source==='recorded'?(snapshot.feed?.repeated?'Connected · recorded replay · REPEATED DATA · pass '+snapshot.feed.cycle:'Connected · recorded replay · week '+(snapshot.feed?.week||1)):'Connected · previously accepted draw'):'Reconnecting · betting paused');
    api.text('roundMessage',state.round.settled?`Return ${api.money(state.round.returned)} · Net ${api.signed(state.round.net)}`:'');api.updateButtons();
  }
  function canBet(){return multi.active&&multi.fresh&&!multi.busy&&snapshot&&snapshot.running!==false&&Date.now()+state.offset<snapshot.round.start+20000;}
  function bet(operation,entries=[]){if(!canBet()){api.toast('Wait for the next open betting window.');return false;}multi.bet(operation,entries,state.round.id,snapshot.roomId).then(()=>api.sound('chip')).catch(e=>api.toast(e.message)).finally(()=>api.paintMoney());api.paintMoney();return true;}
  launchInfo();return {panel,multi,leave,tick,canBet,bet,launchInfo,toggleWideView};
}
