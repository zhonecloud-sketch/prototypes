import {account,accountRequest,restoreAccount} from './account-api.js?v=20261022-perf';
import {toggleWideView} from './wide-view.js';
import {parseRngFile} from './rng-import.js';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('en-US').format(n);
let key='',busy=false,offset=0,search='',users=[],status=null;
const request=(action,body={})=>accountRequest('admin-'+action,body,{'X-Atelier-Admin':key});
const notice=text=>$('notice').textContent=text;
async function run(work,message='Working…'){
  if(busy)return;busy=true;const buttons=Array.from(document.querySelectorAll('button')).filter(b=>!b.disabled);buttons.forEach(b=>b.disabled=true);notice(message);$('operatorLogin').setAttribute('aria-busy','true');
  try{await work();if($('notice').textContent===message)notice('Ready.');}catch(e){notice(e.message);$('notice').scrollIntoView({block:'nearest'});}finally{busy=false;buttons.filter(b=>b.isConnected).forEach(b=>b.disabled=false);$('operatorLogin').setAttribute('aria-busy','false');showIdentity();}
}
function showCredentials(result){
  if(!result.credentials)return;
  $('privateResult').hidden=false;$('credentialResult').textContent=Object.entries(result.credentials).filter(([k])=>k!=='invite').map(([k,v])=>`${k}: ${v}`).join('\n');notice(result.message);
}
async function refresh(){
  status=await request('status');
  const s=status.runtime;
  $('serverStatus').innerHTML=`<h3>${s.running?'● Running · accepting players':'■ Stopped · new wagers disabled'}</h3><p>${status.users} accounts · ${status.seats.length}/${s.maxRooms*6} online players · ${status.rooms.length}/${s.maxRooms} active rooms · ${s.source==='recorded'?'Live replay':'Previously accepted draw'}</p><p>${s.feed?`2m-rng.txt · week ${s.feed.week} · record ${money(s.feed.record)} / ${money(s.feed.count)} · ${s.feed.repeated?'REPEATED DATA · pass '+s.feed.cycle:'first pass'}`:''}</p>`;
  const capacity=$('roomCapacity').elements.maxRooms;capacity.max=s.capacityLimit;capacity.value=s.maxRooms;
  $('roomCapacityNote').textContent=`Each room seats 6 players. Server allowance: ${s.capacityLimit} rooms / ${s.capacityLimit*6} players. This is a configured operating allowance, not an automatic hardware measurement. Empty rooms close automatically. Occupied rooms are preserved when changing limits.`;
  $('roomRows').innerHTML=status.rooms.map(r=>`<article><h3>Room ${r.roomId}</h3><p>${r.players}/6 players</p><p class="small">${status.seats.filter(p=>p.roomId===r.roomId).map(p=>esc(p.username)).join(' · ')}</p></article>`).join('')||'<p>No occupied rooms. Rooms open as players join.</p>';
  $('audit').innerHTML=status.audit.length?status.audit.map(a=>`<p class="small">${esc(new Date(a.created_at).toLocaleString())} · ${esc(a.actor)} · ${esc(a.action)} · ${esc(a.target)}</p>`).join(''):'<p>No operator actions yet.</p>';
  $('rngRows').innerHTML=status.datasets.map(d=>`<article><h3>${esc(d.name)}</h3><p>${money(d.count)} records · ${d.ready?'Ready':'Incomplete upload'}${s.datasetId===d.id?' · SELECTED':''}</p><div class="actions"><button data-rng="inspect" data-id="${d.id}">View / edit</button><button data-rng="export" data-id="${d.id}" ${d.ready?'':'disabled'}>Export</button><button data-rng="delete" data-id="${d.id}">Delete…</button></div></article>`).join('')||'<p>No imported databases yet.</p>';
}
async function loadUsers(){
  const data=await request('users',{offset,search});users=data.users;
  $('userRows').innerHTML=users.map(p=>`<tr><td><b>${esc(p.username)}</b><small>${esc(p.email)}</small></td><td>${money(p.balance)}</td><td>${money(p.wealth.total)}<small>${p.wealth.copies} collectibles</small></td><td>${[['edit','Edit'],['reset-records','Reset records…'],['reset-player','Reset player…'],['delete','Delete…']].map(([a,label])=>`<button data-user="${a}" data-id="${p.id}">${label}</button>`).join('')}</td></tr>`).join('');
  $('previousUsers').hidden=!offset;$('nextUsers').hidden=!data.hasMore;
}
function tab(name){for(const id of ['server','users','rng'])$(id).hidden=id!==name;return name==='users'?loadUsers():refresh();}
function showIdentity(){
  const player=account.player;$('loginFields').hidden=!!player;$('switchOperator').hidden=!player;
  for(const input of $('loginFields').querySelectorAll('input')){input.required=!player;input.disabled=!!player;}
  $('operatorIdentity').textContent=player?`Game account: ${player.username} · ${player.email}. Enter the separate private operator key to continue.`:'Enter your game email, game password and private operator key. The game password and operator key are separate credentials.';
}
$('operatorLogin').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));run(async()=>{
  if(!account.player){await accountRequest('login',{email:data.email.trim(),password:data.password});$('operatorLogin').elements.password.value='';showIdentity();}
  notice('Checking operator account and key…');key=data.operatorKey.trim();
  try{await refresh();}catch(e){key='';throw e;}
  e.target.reset();$('access').hidden=true;$('console').hidden=false;notice('Developer controls unlocked.');
},account.player?'Checking operator account and key…':'Signing in to your game account…');};
$('switchOperator').onclick=()=>run(async()=>{key='';await accountRequest('logout',{});$('operatorLogin').reset();showIdentity();notice('Enter the game account you want to use.');});
$('roomCapacity').onsubmit=e=>{e.preventDefault();run(async()=>{await request('capacity',{maxRooms:Number(e.target.elements.maxRooms.value)});await refresh();notice('Room limit saved. New rooms open automatically within this limit.');});};
$('lock').onclick=()=>{key='';$('console').hidden=true;$('access').hidden=false;showIdentity();$('privateResult').hidden=true;$('credentialResult').textContent='';notice('Controls locked.');};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>run(()=>tab(b.dataset.tab)));
document.querySelector('[data-wide-view]').onclick=()=>toggleWideView().catch(()=>notice('Fullscreen is unavailable in this browser.'));
document.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>run(async()=>{await request('server',{command:b.dataset.command});await refresh();notice(b.dataset.command==='start'?'Multiplayer started. It remains available until Stop.':'Multiplayer stopped. Existing accepted wagers will settle.');}));
$('refreshStatus').onclick=$('refreshRng').onclick=()=>run(refresh);
$('searchUsers').onsubmit=e=>{e.preventDefault();search=new FormData(e.target).get('search');offset=0;run(loadUsers);};
$('previousUsers').onclick=()=>run(async()=>{offset=Math.max(0,offset-50);await loadUsers();});
$('nextUsers').onclick=()=>run(async()=>{offset+=50;await loadUsers();});
$('addUser').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));run(async()=>{const r=await request('user',{operation:'add',...data});showCredentials(r);await loadUsers();e.target.reset();});};
$('dismissCredentials').onclick=()=>{$('privateResult').hidden=true;$('credentialResult').textContent='';};
$('userRows').onclick=e=>{
  const b=e.target.closest('[data-user]');if(!b||busy)return;const p=users.find(p=>p.id===b.dataset.id),op=b.dataset.user;
  const help={edit:'Update the username or whole-chip balance. The email remains the account login address.',delete:'Permanently deletes this account, wallet, collection, orders and raw records.', 'reset-records':'Restarts profit and analysis records. Chips and collectibles are preserved; historical raw records remain in their earlier record epoch.','reset-player':'Resets this player to 10,000 chips with an empty collection, no orders or Insights pass, and a new analysis record. The login account is preserved.'};
  $('userEditor').innerHTML=`<form class="confirmation"><h3>${esc(p.username)}</h3><p>${help[op]}</p>${op==='edit'?`<div class="fields"><label>Username<input name="username" value="${esc(p.username)}" minlength="3" maxlength="24" required></label><label>Chip balance<input name="balance" type="number" min="0" step="1" value="${p.balance}" required></label></div>`:`<label>Type ${esc(p.username)} to confirm<input name="confirmation" autocomplete="off" required></label>`}<div class="actions"><button>Confirm ${esc(op)}</button><button type="button" data-cancel>Cancel</button></div></form>`;
  $('userEditor').querySelector('[data-cancel]').onclick=()=>{$('userEditor').innerHTML='';};
  $('userEditor').querySelector('form').onsubmit=e=>{e.preventDefault();const fields=Object.fromEntries(new FormData(e.target));run(async()=>{const r=await request('user',{operation:op,id:p.id,revision:p.revision,...fields,...(op==='edit'?{balance:Number(fields.balance)}:{})});$('userEditor').innerHTML='';notice(r.message);showCredentials(r);await loadUsers();});};
};
$('uploadRng').onsubmit=e=>{e.preventDefault();const fields=new FormData(e.target);run(async()=>{
  const file=fields.get('file');if(file.size>32*1024*1024)throw Error('The file exceeds 32 MB.');
  const ns=parseRngFile(await file.text()),created=await request('rng',{operation:'create',name:fields.get('name'),count:ns.length});
  for(let start=0;start<ns.length;start+=created.chunkSize){notice(`Importing ${money(Math.min(start+created.chunkSize,ns.length))} / ${money(ns.length)} records…`);await request('rng',{operation:'chunk',id:created.id,chunkIndex:start/created.chunkSize,numbers:ns.slice(start,start+created.chunkSize)});}
  await request('rng',{operation:'finish',id:created.id});e.target.reset();await refresh();notice('RNG database imported for inspection. Multiplayer continues to use 2m-rng.txt.');
});};

const download=(name,text)=>{const url=URL.createObjectURL(new Blob([text],{type:'text/plain'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('rngRows').onclick=e=>{
  const b=e.target.closest('[data-rng]');if(!b||busy)return;const d=status.datasets.find(d=>d.id===b.dataset.id),op=b.dataset.rng;

  if(op==='export')return run(async()=>{const chunks=[];for(let i=0;i<Math.ceil(d.count/4000);i++){const r=await request('rng-read',{id:d.id,chunkIndex:i});chunks.push(r.numbers.join('\n'));notice(`Exporting ${money(Math.min((i+1)*4000,d.count))} / ${money(d.count)} records…`);}download(d.name.replace(/[^\w-]/g,'_')+'.txt',chunks.join('\n'));notice('Export prepared.');});
  if(op==='delete'){
    $('rngEditor').innerHTML=`<form class="confirmation"><p>Permanently delete ${esc(d.name)} and all its numbers?</p><label>Type the database name<input name="confirmation" required></label><button>Delete database</button></form>`;
    $('rngEditor').querySelector('form').onsubmit=e=>{e.preventDefault();const confirmation=new FormData(e.target).get('confirmation');run(async()=>{await request('rng',{operation:'delete',id:d.id,confirmation});$('rngEditor').innerHTML='';await refresh();notice('Database deleted.');});};return;
  }
  run(async()=>{
    const data=await request('rng-read',{id:d.id,chunkIndex:0});
    $('rngEditor').innerHTML=`<h3>${esc(d.name)} · first ${Math.min(60,data.numbers.length)} records</h3><div class="record-grid">${data.numbers.slice(0,60).map((n,i)=>`<span>${i+1}: <b>${n}</b></span>`).join('')}</div>
    <form id="renameRng" class="actions"><input name="name" aria-label="Database name" value="${esc(d.name)}" maxlength="120" required><button>Rename</button></form>
    <form id="editRng"><div class="fields"><label>Record position (1–${d.count})<input name="index" type="number" min="1" max="${d.count}" required></label><label>Result (0–36)<input name="number" type="number" min="0" max="36" required></label></div><button>Save result</button></form>
`;
    $('renameRng').onsubmit=e=>{e.preventDefault();run(async()=>{await request('rng',{operation:'rename',id:d.id,name:new FormData(e.target).get('name')});await refresh();notice('Database renamed.');});};
    $('editRng').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);run(async()=>{await request('rng',{operation:'edit',id:d.id,index:Number(f.get('index'))-1,number:Number(f.get('number'))});notice('Result saved. Reopen View / edit to refresh the preview.');});};

  });
};
await restoreAccount();showIdentity();$('unlockControls').disabled=false;$('unlockControls').textContent='Unlock developer controls';notice('Ready. Sign in with your game account and the separate operator key.');
