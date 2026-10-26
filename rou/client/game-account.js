import { account } from './account-api.js?v=20261026-login-isolation';
import { mountAccount } from './account.js?v=20261026-login-isolation';
import { createMultiplayer } from './multiplayer.js?v=20261026-login-isolation';
import { toggleWideView } from './wide-view.js?v=20261024-wide-proportions';
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function resultPresentation(){
  // The shared betting clock may advance before this wheel's settlement arrives.
  let round=null,latest=null,visibleMs=0,lastVisible=null,landed=false,dismissed=false;
  const same=(a,b)=>a&&b&&a.id===b.id&&a.roomId===b.roomId;
  const pending=()=>!!round?.bets.length&&!round.settled;
  function reset(){round=latest=null;visibleMs=0;lastVisible=null;landed=false;dismissed=false;}
  function receive(next,wager){
    latest=next;
    if(!round)round={...next};
    else if(same(round,next))round={...next,outcome:next.outcome??round.outcome,
      ...(round.record&&!next.record?{record:round.record,settled:true,returned:round.returned,net:round.net}:{} )};
    const record=wager?.record;
    if(wager?.settled&&record&&record.roundId===round.id&&(record.roomId||wager.roomId||1)===round.roomId){
      round={...round,bets:wager.bets||record.bets||round.bets,outcome:record.number,
        settled:true,record,returned:record.returned,net:record.net};
    }
  }
  function tick(serverTime,visualTime,visible){
    const local=Date.now();if(round)round.locked=serverTime>=round.start+20000;landed=!!round&&Math.min(serverTime,visualTime)>=round.start+27000;
    // A manually dismissed wheel may stop rendering, but settlement must finish.
    const ready=!!round&&(landed||dismissed&&serverTime>=round.start+27000)&&round.outcome!==null&&!pending();
    // Count reading time only while the completed result is on screen.
    if(ready&&visible){if(lastVisible!==null)visibleMs+=Math.max(0,local-lastVisible);lastVisible=local;}
    else lastVisible=null;
    if(latest&&!same(round,latest)&&(!round.bets.length&&round.outcome===null||ready&&(dismissed||visibleMs>=3000))){
      round={...latest};visibleMs=0;lastVisible=null;landed=false;dismissed=false;return true;
    }
    return false;
  }
  return {receive,tick,reset,dismiss(){dismissed=true;},pause(){lastVisible=null;},get round(){return round;},get landed(){return landed;},
    get pending(){return pending();},get previousPending(){return pending()&&!same(round,latest);}};
}
export function installAccounts(api){
  const state=api.state,presentation=resultPresentation();let snapshot=null,resultRequest=null,nextResultRefresh=0,seatKey='',wheelKey='',preparedKey='',wantWheel=false;
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
    if(state.user?.type!=='multiplayer'||state.user.sub!==player.id){presentation.reset();wheelKey=preparedKey='';wantWheel=false;api.startSession({type:'multiplayer',sub:player.id,name:player.username},player.balance,null,room.recent,player.profile);}
    state.source='multiplayer';state.balance=player.balance;state.club=player.profile;state.sessionNet=room.net||0;state.lastBets=room.lastBets;
    const current=room.round,wager=room.wager?.roundId===current.id&&(room.wager.roomId||1)===room.roomId?room.wager:null,elapsed=Date.now()+state.offset-current.start;
    const prior=state.round;
    state.round={id:current.id,roomId:room.roomId,start:current.start,bets:wager?.bets||[],locked:elapsed>=20000,settled:!!wager?.settled,outcome:current.number??null,source:'multiplayer',available:true,late:false,record:wager?.record,returned:wager?.record?.returned||0,net:wager?.record?.net||0};
    presentation.receive(state.round,room.wager);syncWheel();
    if(historyChanged){state.history=room.recent;state.counts=Array(37).fill(0);for(const n of room.recent)state.counts[n]++;state.rounds=room.recent.length;}
    strip.hidden=false;const nextSeats=JSON.stringify(room.seats)+player.id;if(nextSeats!==seatKey){seatKey=nextSeats;strip.innerHTML=Array.from({length:6},(_,i)=>{const member=room.seats.find(s=>s.seat===i+1),name=member?escape(member.username):'Empty seat';return `<div class="room-seat ${member?.id===player.id?'self':member?'':'empty'}"><div class="room-player"><span class="room-portrait" aria-hidden="true">${member?escape(Array.from(member.username)[0].toUpperCase()):'♙'}</span><b title="${name}">${name}${member?.id===player.id?' · You':''}</b></div><span class="room-bankroll" aria-label="${member?`${name} bankroll ${api.money(member.balance)} chips`:'Waiting for a player'}"><strong>${member?api.money(member.balance):'—'}</strong>${member?'':' <small>OPEN SEAT</small>'}</span></div>`;}).join('');}
    $('headerSource').textContent='ROOM '+room.roomId;$('saveStatus').textContent='Multiplayer account';$('accountDetails').textContent=player.username+' · Multiplayer account · chips and records saved on the server';$('sourceSelect').disabled=true;if(betsBefore!==JSON.stringify(state.round.bets)||prior?.id!==current.id||prior?.roomId!==room.roomId)api.paintBets();api.paintMoney();if(historyChanged)api.paintHistory();launchInfo();tick();
  },updated:()=>{api.updateButtons();tick();},error:api.toast,disconnected(){api.launch();api.toast('Room connection lost. Choose Multiplayer to reconnect.');}});
  async function leave(){await multi.leave();snapshot=null;presentation.reset();wheelKey=preparedKey='';wantWheel=false;strip.hidden=true;$('sourceSelect').disabled=false;launchInfo();}
  const panel=mountAccount({opened:api.pauseTravel,inGame:()=>state.active,openMenu:api.launch,returnToGame,canLeave:()=>!api.hasWagers(),leaveRoom:leave,changed(player){launchInfo();if(player&&state.user?.type==='multiplayer'&&state.user.sub===player.id){const changed=state.balance!==player.balance;state.balance=player.balance;state.club=player.profile;if(changed)api.paintMoney();}},authenticated(player){if(!player&&state.user?.type==='multiplayer'){state.active=false;state.user=null;state.round=null;strip.hidden=true;}api.launch();launchInfo();api.toast(player?`Welcome, ${player.username}. Choose Multiplayer to join the room.`:'Signed out.');}});
  $('accountSignIn').onclick=()=>panel.open('account');
  $('multiplayerLogin').onclick=async()=>{
    if(!account.player){panel.open('login');return;}
    if(multi.active){returnToGame();return;}
    if(api.hasWagers()&&state.user?.type!=='multiplayer'){api.toast('Wait for the current wager to settle before switching games.');return;}
    try{if(state.active&&state.user?.type!=='multiplayer'){await api.leaveSession();if(state.active)return;}if(await multi.join())returnToGame();}catch(e){api.toast(e.message);}
  };
  const solo=$('guestLogin').onclick;
  $('guestLogin').onclick=async()=>{if(state.user?.type==='multiplayer'){if(api.hasWagers()){api.toast('Wait for the current wager to settle first.');return;}try{await leave();await api.leaveSession();}catch(e){api.toast(e.message);return;}}solo();strip.hidden=true;launchInfo();};
  for(const id of ['googleLogin','connectGoogle']){const original=$(id).onclick;$(id).onclick=()=>{if(state.user?.type==='multiplayer'){api.toast('Leave the multiplayer table before switching to Google solo play.');return;}original();};}
  document.addEventListener('click',e=>{const entry=e.target.closest('[data-club-open]');if(account.player&&entry&&['collection','chips','insights'].includes(entry.dataset.clubOpen)){e.preventDefault();e.stopImmediatePropagation();panel.open(entry.dataset.clubOpen);}},true);
  document.addEventListener('visibilitychange',()=>presentation.pause());
  function returnToGame(){api.returnToTable();const r=presentation.round;if(state.user?.type==='multiplayer'&&r&&Date.now()+state.offset>=r.start+20000){wantWheel=true;showWheel();}}
  function showWheel(){if(wantWheel&&(api.canAutoTravel?api.canAutoTravel():!document.hidden)){wantWheel=false;api.travel('wheel');}}
  function syncWheel(){
    const r=presentation.round;if(!r)return;const key=`${r.roomId}:${r.id}`,time=Date.now()+state.offset;
    if(key!==wheelKey){wheelKey=key;preparedKey='';wantWheel=false;$('winner').classList.remove('visible');api.engine()?.prime(r.id,r.start+20000,r.roomId);if(time<r.start+20000)api.travel('table');}
    if(r.outcome!==null&&preparedKey!==key+':'+r.outcome){preparedKey=key+':'+r.outcome;api.engine()?.prepare(r.id,r.outcome,r.start+20000,r.roomId);if(time>=r.start+20000)wantWheel=true;}
    showWheel();
  }
  function tick(){
    if(!snapshot||!state.round||!presentation.round)return;showWheel();const elapsed=Math.max(0,(Date.now()+state.offset-state.round.start)/1000),betting=elapsed<20,spinning=elapsed>=20&&elapsed<27,left=Math.max(0,Math.ceil((betting?20:spinning?27:30)-elapsed));
    state.round.locked=!betting;
    const serverTime=Date.now()+state.offset,visible=api.resultVisible?api.resultVisible():!document.hidden;
    if(presentation.tick(serverTime,api.engine()?.visualClock??serverTime,visible))syncWheel();
    const wheel=presentation.round,wheelElapsed=(serverTime-wheel.start)/1000,landed=presentation.landed,confirmed=landed&&wheel.outcome!==null&&!presentation.pending;
    if(wheelElapsed>=27&&presentation.pending&&multi.active&&multi.fresh&&!multi.busy&&!resultRequest&&Date.now()>=nextResultRefresh){
      nextResultRefresh=Date.now()+1000;resultRequest=Promise.resolve(multi.poll()).finally(()=>{resultRequest=null;nextResultRefresh=Date.now()+1000;});
    }
    const time=new Date(serverTime+8*3600000);api.text('wallClock',[time.getUTCHours(),time.getUTCMinutes(),time.getUTCSeconds()].map(n=>String(n).padStart(2,'0')).join(':'));api.text('roundCode',state.round.id);
    api.text('countdown',String(left).padStart(2,'0'));api.text('wheelTimer',String(Math.max(0,Math.ceil((wheelElapsed<20?20:wheelElapsed<27?27:30)-wheelElapsed))).padStart(2,'0'));
    api.text('phaseLabel',snapshot.running===false?'SERVER STOPPED':!multi.fresh?'RECONNECTING':presentation.previousPending?'CONFIRMING RESULT':betting?'PLACE YOUR BETS':spinning?'NO MORE BETS':'ROUND COMPLETE');
    api.text('wheelPhase',wheelElapsed<20?'BETTING OPEN':wheelElapsed<27?'BALL IN PLAY':confirmed?'RESULT':'CONFIRMING RESULT');api.text('wheelTitle','Roulette');api.text('wheelSubtitle','ROOM '+wheel.roomId+' · ROUND '+wheel.id);
    $('progress').style.width=Math.max(0,(betting?(20-elapsed)/20:spinning?(27-elapsed)/7:(30-elapsed)/3)*100)+'%';
    api.text('motionLabel',wheelElapsed<20?'SHARED TABLE':wheelElapsed<27?'SERVER DRAW · BALL IN PLAY':confirmed?'RESULT CONFIRMED':'CONFIRMING RESULT');
    api.text('motionCaption',wheelElapsed<20?'Every player shares this draw.':wheelElapsed<27?'No more bets.':confirmed?'Result confirmed. Returning to the table shortly.':'Waiting for the server to save your result…');
    if(landed&&wheel.outcome!==null){const number=wheel.outcome;api.text('winnerNumber',number);$('winnerNumber').className='winner-disc '+api.color(number);
      const status=presentation.pending?'SETTLING':!wheel.bets.length?'WINNING NUMBER':wheel.net>0?'WIN':wheel.net<0?'LOSS':'BREAK EVEN';
      api.text('winnerLabel',api.color(number).toUpperCase()+' · '+status);api.text('payoutLabel',presentation.pending?'Confirming server settlement…':wheel.bets.length?`Return ${api.money(wheel.returned)} · Net ${api.signed(wheel.net)}`:'Watching this round');$('winner').classList.add('visible');}
    api.text('connectionStatus',snapshot.running===false?'Multiplayer stopped by developer · accepted wagers will settle':multi.busy?'Sending wager…':multi.fresh?(snapshot.source==='recorded'?(snapshot.feed?.repeated?'Connected · recorded replay · REPEATED DATA · pass '+snapshot.feed.cycle:'Connected · recorded replay · week '+(snapshot.feed?.week||1)):'Connected · previously accepted draw'):'Reconnecting · betting paused');
    api.text('roundMessage',confirmed&&wheel.bets.length?`Return ${api.money(wheel.returned)} · Net ${api.signed(wheel.net)}`:'');api.updateButtons();
  }
  function canBet(){return multi.active&&multi.fresh&&!multi.busy&&!presentation.previousPending&&snapshot&&snapshot.running!==false&&Date.now()+state.offset<snapshot.round.start+20000;}
  function bet(operation,entries=[]){if(!canBet()){api.toast('Wait for the next open betting window.');return false;}multi.bet(operation,entries,state.round.id,snapshot.roomId).then(()=>api.sound('chip')).catch(e=>api.toast(e.message)).finally(()=>api.paintMoney());api.paintMoney();return true;}
  launchInfo();return {panel,multi,leave,tick,canBet,bet,launchInfo,toggleWideView,backToTable(){presentation.dismiss();wantWheel=false;},get wheelRound(){return presentation.round;},get pendingSettlement(){return presentation.pending;}};
}
