import {account,accountRequest,restoreAccount} from './account-api.js';
import {toggleWideView} from './wide-view.js';
import {parseRngFile} from './rng-import.js';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('en-US').format(n);
let key='',busy=false,offset=0,search='',users=[],status=null;
const request=(action,body={})=>accountRequest('admin-'+action,body,{'X-Atelier-Admin':key});
const notice=text=>$('notice').textContent=text;
async function run(work){
  if(busy)return;busy=true;const buttons=Array.from(document.querySelectorAll('button')).filter(b=>!b.disabled);buttons.forEach(b=>b.disabled=true);notice('');
  try{await work();}catch(e){notice(e.message);}finally{busy=false;buttons.filter(b=>b.isConnected).forEach(b=>b.disabled=false);}
}
function showCredentials(result){
  if(!result.credentials)return;
  $('privateResult').hidden=false;$('credentialResult').textContent=Object.entries(result.credentials).map(([k,v])=>`${k}: ${v}`).join('\n');notice(result.message);
}
async function refresh(){
  status=await request('status');
  const s=status.runtime;
  $('serverStatus').innerHTML=`<h3>${s.running?'● Running · accepting players':'■ Stopped · new wagers disabled'}</h3><p>${status.users} accounts · ${status.seats.length}/6 active seats · ${s.source==='recorded'?'Recorded replay':'Live server RNG'}</p>`;
  $('audit').innerHTML=status.audit.length?status.audit.map(a=>`<p class="small">${esc(new Date(a.created_at).toLocaleString())} · ${esc(a.actor)} · ${esc(a.action)} · ${esc(a.target)}</p>`).join(''):'<p>No operator actions yet.</p>';
  $('rngRows').innerHTML=status.datasets.map(d=>`<article><h3>${esc(d.name)}</h3><p>${money(d.count)} records · ${d.ready?'Ready':'Incomplete upload'}${s.datasetId===d.id?' · SELECTED':''}</p><div class="actions"><button data-rng="inspect" data-id="${d.id}">View / edit</button><button data-rng="select" data-id="${d.id}" ${d.ready?'':'disabled'}>Use / reset to record 1</button><button data-rng="export" data-id="${d.id}" ${d.ready?'':'disabled'}>Export</button><button data-rng="delete" data-id="${d.id}">Delete…</button></div></article>`).join('')||'<p>No imported databases yet.</p>';
}
async function loadUsers(){
  const data=await request('users',{offset,search});users=data.users;
  $('userRows').innerHTML=users.map(p=>`<tr><td><b>${esc(p.username)}</b><small>${esc(p.email)}</small></td><td>${money(p.balance)}</td><td>${money(p.wealth.total)}<small>${p.wealth.copies} collectibles</small></td><td>${[['edit','Edit'],['reset-records','Reset records…'],['reset-player','Reset player…'],['invite','Replace invitation…'],['delete','Delete…']].map(([a,label])=>`<button data-user="${a}" data-id="${p.id}">${label}</button>`).join('')}</td></tr>`).join('');
  $('previousUsers').hidden=!offset;$('nextUsers').hidden=!data.hasMore;
}
function tab(name){for(const id of ['server','users','rng'])$(id).hidden=id!==name;return name==='users'?loadUsers():refresh();}
await restoreAccount();
$('loginFields').hidden=!!account.player;
if(account.player)$('operatorIdentity').textContent=`Game account: ${account.player.username} · ${account.player.email}`;
$('operatorLogin').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));run(async()=>{
  if(!account.player){await accountRequest('connect',{email:data.email,invite:data.invite});await accountRequest('login',{email:data.email,password:data.password});}
  key=data.operatorKey;await refresh();e.target.reset();$('access').hidden=true;$('console').hidden=false;
});};
$('lock').onclick=()=>{key='';$('console').hidden=true;$('access').hidden=false;$('loginFields').hidden=!!account.player;$('privateResult').hidden=true;$('credentialResult').textContent='';notice('Controls locked.');};
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
  const help={edit:'Update the username or whole-chip balance. The email remains bound to the invitation.',delete:'Permanently deletes this account, wallet, collection, orders and raw records.', 'reset-records':'Restarts profit and analysis records. Chips and collectibles are preserved; historical raw records remain in their earlier record epoch.','reset-player':'Resets this player to 10,000 chips with an empty collection, no orders or Insights pass, and a new analysis record. The login account is preserved.',invite:'Issues a replacement private invitation and revokes previous invitation connections.'};
  $('userEditor').innerHTML=`<form class="confirmation"><h3>${esc(p.username)}</h3><p>${help[op]}</p>${op==='edit'?`<div class="fields"><label>Username<input name="username" value="${esc(p.username)}" pattern="[a-zA-Z0-9_]{3,24}" required></label><label>Chip balance<input name="balance" type="number" min="0" step="1" value="${p.balance}" required></label></div>`:op==='invite'?'':`<label>Type ${esc(p.username)} to confirm<input name="confirmation" autocomplete="off" required></label>`}<div class="actions"><button>Confirm ${esc(op)}</button><button type="button" data-cancel>Cancel</button></div></form>`;
  $('userEditor').querySelector('[data-cancel]').onclick=()=>{$('userEditor').innerHTML='';};
  $('userEditor').querySelector('form').onsubmit=e=>{e.preventDefault();const fields=Object.fromEntries(new FormData(e.target));run(async()=>{const r=await request('user',{operation:op,id:p.id,revision:p.revision,...fields,...(op==='edit'?{balance:Number(fields.balance)}:{})});$('userEditor').innerHTML='';notice(r.message);showCredentials(r);await loadUsers();});};
};
$('uploadRng').onsubmit=e=>{e.preventDefault();const fields=new FormData(e.target);run(async()=>{
  const file=fields.get('file');if(file.size>32*1024*1024)throw Error('The file exceeds 32 MB.');
  const ns=parseRngFile(await file.text()),created=await request('rng',{operation:'create',name:fields.get('name'),count:ns.length});
  for(let start=0;start<ns.length;start+=created.chunkSize){notice(`Importing ${money(Math.min(start+created.chunkSize,ns.length))} / ${money(ns.length)} records…`);await request('rng',{operation:'chunk',id:created.id,chunkIndex:start/created.chunkSize,numbers:ns.slice(start,start+created.chunkSize)});}
  await request('rng',{operation:'finish',id:created.id});e.target.reset();await refresh();notice('RNG database imported. Select it, then Start multiplayer to use it.');
});};
$('useCrypto').onclick=()=>run(async()=>{await request('rng',{operation:'source',id:null,startIndex:0});await refresh();notice('Live server RNG selected for the next full round.');});
const download=(name,text)=>{const url=URL.createObjectURL(new Blob([text],{type:'text/plain'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('rngRows').onclick=e=>{
  const b=e.target.closest('[data-rng]');if(!b||busy)return;const d=status.datasets.find(d=>d.id===b.dataset.id),op=b.dataset.rng;
  if(op==='select')return run(async()=>{const r=await request('rng',{operation:'source',id:d.id,startIndex:0});await refresh();notice(r.message);});
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
    <form id="seekRng" class="actions"><label>Start from record<input name="index" type="number" min="1" max="${d.count}" value="1" required></label><button>Select / reset playback</button></form>`;
    $('renameRng').onsubmit=e=>{e.preventDefault();run(async()=>{await request('rng',{operation:'rename',id:d.id,name:new FormData(e.target).get('name')});await refresh();notice('Database renamed.');});};
    $('editRng').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);run(async()=>{await request('rng',{operation:'edit',id:d.id,index:Number(f.get('index'))-1,number:Number(f.get('number'))});notice('Result saved. Reopen View / edit to refresh the preview.');});};
    $('seekRng').onsubmit=e=>{e.preventDefault();const index=Number(new FormData(e.target).get('index'))-1;run(async()=>{const r=await request('rng',{operation:'source',id:d.id,startIndex:index});await refresh();notice(r.message);});};
  });
};
