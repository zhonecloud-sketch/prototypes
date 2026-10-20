import { account } from './account-api.js';
import { mountAccount } from './account.js';
import { createMultiplayer } from './multiplayer.js';
import { toggleWideView } from './wide-view.js';
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function installAccounts(api){
  const state=api.state;let snapshot=null,seenRecord=null;
  const strip=document.createElement('div');strip.id='roomPlayers';strip.className='account-room-strip';strip.hidden=true;$('bettingView').prepend(strip);
  function launchInfo(){
    $('accountSignIn').textContent=account.player?`♙ ${account.player.username}`:'♙ Sign in';
    $('accountSignIn').setAttribute('aria-label',account.player?'View player information':'Sign in or create account');
    $('guestLogin').textContent=state.active&&state.user?.type!=='multiplayer'?'Return to table ↗':'Enter as Guest ↗';
    $('multiplayerLogin').textContent=multi.active?'Return to Multiplayer ↗':'Multiplayer ↗';
  }
  const multi=createMultiplayer({received(room,player){
    snapshot=room;state.offset=room.serverTime-Date.now();
    if(state.user?.type!=='multiplayer')api.startSession({type:'multiplayer',sub:player.id,name:player.username},player.balance,null,room.recent,player.profile);
    state.source='multiplayer';state.balance=player.balance;state.club=player.profile;state.sessionNet=room.net||0;state.lastBets=room.lastBets;
    const current=room.round,wager=room.wager?.roundId===current.id?room.wager:null,elapsed=Date.now()+state.offset-current.start;
    const prior=state.round;
    state.round={id:current.id,start:current.start,bets:wager?.bets||[],locked:elapsed>=20000,settled:!!wager?.settled,outcome:current.number,source:'multiplayer',available:true,late:false,returned:wager?.record?.returned||0,net:wager?.record?.net||0};
    if(prior?.id!==current.id){$('winner').classList.remove('visible');api.travel('table');}
    if(current.number!==null&&(prior?.id!==current.id||prior?.outcome===null)){api.engine()?.prepare(current.id,current.number,current.start+20000);api.travel('wheel');}
    const record=room.wager?.record;
    if(record&&record.roundId!==seenRecord){seenRecord=record.roundId;if(record.roundId===current.id){$('winnerNumber').textContent=record.number;$('winnerNumber').className='winner-disc '+api.color(record.number);$('winnerLabel').textContent=api.color(record.number).toUpperCase();$('payoutLabel').textContent=`Return ${api.money(record.returned)} · Net ${api.signed(record.net)}`;$('winner').classList.add('visible');}}
    state.history=room.recent;state.counts=Array(37).fill(0);for(const n of room.recent)state.counts[n]++;state.rounds=room.recent.length;
    strip.hidden=false;strip.innerHTML=Array.from({length:6},(_,i)=>{const member=room.seats.find(s=>s.seat===i+1);return `<div class="room-seat ${member?.id===player.id?'self':member?'':'empty'}"><b>${member?escape(member.username):'Empty seat'}${member?.id===player.id?' · You':''}</b><span>${member?'At the table':'Waiting for a player'}</span></div>`;}).join('');
    $('headerSource').textContent='SHARED ROOM';$('saveStatus').textContent='Server account';$('accountDetails').textContent=player.username+' · Multiplayer account · chips and records saved on the server';$('sourceSelect').disabled=true;api.paintBets();api.paintMoney();api.paintHistory();launchInfo();tick();
  },error:api.toast,disconnected(){api.launch();api.toast('Room connection lost. Choose Multiplayer to reconnect.');}});
  async function leave(){await multi.leave();strip.hidden=true;$('sourceSelect').disabled=false;launchInfo();}
  const panel=mountAccount({canLeave:()=>!api.hasWagers(),leaveRoom:leave,changed(player){launchInfo();if(player&&state.user?.type==='multiplayer'&&state.user.sub===player.id){state.balance=player.balance;state.club=player.profile;api.paintMoney();}},authenticated(player){if(!player&&state.user?.type==='multiplayer'){state.active=false;state.user=null;state.round=null;strip.hidden=true;}api.launch();launchInfo();api.toast(player?`Welcome, ${player.username}. Choose Multiplayer to join the room.`:'Signed out.');}});
  $('accountSignIn').onclick=()=>panel.open('account');
  $('multiplayerLogin').onclick=async()=>{
    if(!account.player){panel.open('login');return;}
    if(multi.active){api.returnToTable();return;}
    if(api.hasWagers()&&state.user?.type!=='multiplayer'){api.toast('Wait for the current wager to settle before switching games.');return;}
    try{if(state.active&&state.user?.type!=='multiplayer'){await api.leaveSession();if(state.active)return;}if(await multi.join())api.returnToTable();}catch(e){api.toast(e.message);}
  };
  const solo=$('guestLogin').onclick;
  $('guestLogin').onclick=async()=>{if(state.user?.type==='multiplayer'){if(api.hasWagers()){api.toast('Wait for the current wager to settle first.');return;}try{await leave();await api.leaveSession();}catch(e){api.toast(e.message);return;}}solo();strip.hidden=true;};
  for(const id of ['googleLogin','connectGoogle']){const original=$(id).onclick;$(id).onclick=()=>{if(state.user?.type==='multiplayer'){api.toast('Leave the multiplayer table before switching to Google solo play.');return;}original();};}
  document.addEventListener('click',e=>{const entry=e.target.closest('[data-club-open]');if(account.player&&entry&&['collection','chips'].includes(entry.dataset.clubOpen)){e.preventDefault();e.stopImmediatePropagation();panel.open(entry.dataset.clubOpen);}},true);
  function tick(){
    if(!snapshot||!state.round)return;const elapsed=Math.max(0,(Date.now()+state.offset-state.round.start)/1000),betting=elapsed<20,spinning=elapsed>=20&&elapsed<27,left=Math.max(0,Math.ceil((betting?20:spinning?27:30)-elapsed));
    state.round.locked=!betting;
    const time=new Date(Date.now()+state.offset+8*3600000);$('wallClock').textContent=[time.getUTCHours(),time.getUTCMinutes(),time.getUTCSeconds()].map(n=>String(n).padStart(2,'0')).join(':');$('roundCode').textContent=state.round.id;$('motionLabel').textContent=betting?'SHARED TABLE':spinning?'SERVER DRAW · BALL IN PLAY':'RESULT CONFIRMED';
    for(const id of ['countdown','wheelTimer'])$(id).textContent=String(left).padStart(2,'0');
    $('phaseLabel').textContent=snapshot.running===false?'SERVER STOPPED':!multi.fresh?'RECONNECTING':betting?'PLACE YOUR BETS':spinning?'NO MORE BETS':'ROUND COMPLETE';
    $('wheelPhase').textContent=betting?'BETTING OPEN':spinning?'BALL IN PLAY':'NEXT ROUND';$('wheelTitle').textContent='Roulette';$('wheelSubtitle').textContent='SHARED ROOM · ROUND '+state.round.id;
    $('progress').style.width=Math.max(0,(betting?(20-elapsed)/20:spinning?(27-elapsed)/7:(30-elapsed)/3)*100)+'%';
    $('motionCaption').textContent=betting?'Every player shares this draw.':spinning?'No more bets.':'Next betting window in '+left+' seconds.';
    if(elapsed>=27&&state.round.outcome!==null){const number=state.round.outcome;$('winnerNumber').textContent=number;$('winnerNumber').className='winner-disc '+api.color(number);$('winnerLabel').textContent=api.color(number).toUpperCase();$('payoutLabel').textContent=state.round.settled?`Return ${api.money(state.round.returned)} · Net ${api.signed(state.round.net)}`:state.round.bets.length?'Confirming server settlement…':'Watching this round';$('winner').classList.add('visible');}
    $('connectionStatus').textContent=snapshot.running===false?'Multiplayer stopped by developer · accepted wagers will settle':multi.fresh?(snapshot.source==='recorded'?'Connected · recorded replay source':'Connected · live server RNG'):'Reconnecting · betting paused';
    $('roundMessage').textContent=state.round.settled?`Return ${api.money(state.round.returned)} · Net ${api.signed(state.round.net)}`:'';api.updateButtons();
  }
  function canBet(){return multi.active&&multi.fresh&&!multi.busy&&snapshot&&snapshot.running!==false&&Date.now()+state.offset<snapshot.round.start+20000;}
  function bet(operation,entries=[]){if(!canBet()){api.toast('Wait for the next open betting window.');return false;}multi.bet(operation,entries,state.round.id).then(()=>api.sound('chip')).catch(e=>api.toast(e.message)).finally(()=>api.paintMoney());api.paintMoney();return true;}
  launchInfo();return {panel,multi,leave,tick,canBet,bet,launchInfo,toggleWideView};
}
