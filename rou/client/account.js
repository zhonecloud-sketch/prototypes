import { account,accountRequest,restoreAccount,accountEmail } from './account-api.js?v=20261022-perf';
import { COLLECTIBLES,CHIP_PACKS,INSIGHTS_PASS } from './catalogue.js';
import { toggleWideView,refreshWideView } from './wide-view.js?v=20261024-wide-proportions';
import { installMobileEntry } from './mobile-entry.js?v=20261020-public2';
import { installAccountScroll } from './account-scroll.js?v=20261024-touch-scroll';
import { createServerInsights } from './server-insights.js?v=20261024-insights-scroll';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('en-US').format(n||0),usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
export function mountAccount(api){
  const page=document.createElement('section');page.id='accountPage';page.inert=true;page.setAttribute('aria-label','Player account');
  document.getElementById('landscapeSurface').append(page);installMobileEntry();installAccountScroll(page);
  const insights=createServerInsights();
  let view='login',challenge='',message='',busy=false,checkout=null,codeValue='',opened=false;
  const draft={email:accountEmail()};
  const mode=()=>account.player?view:['verify','recover','reset','register'].includes(view)?view:'login';
  function status(text){message=text;const el=page.querySelector('[data-account-message]');if(el){el.textContent=text;el.hidden=!text;}}
  function resetScroll(){page.scrollTop=0;page.scrollLeft=0;const content=page.querySelector('main');if(content){content.scrollTop=0;content.scrollLeft=0;}}
  function close(){opened=false;insights.close();document.documentElement.classList.remove('account-open');page.inert=true;document.getElementById('login').inert=false;document.getElementById('app').inert=false;api.closed?.();}
  function open(next='account'){
    document.querySelectorAll('dialog[open]').forEach(d=>d.close());view=account.player?next:next==='register'?'register':'login';message='';checkout=null;opened=true;
    document.documentElement.classList.add('account-open');page.inert=false;document.getElementById('login').inert=true;document.getElementById('app').inert=true;api.opened();render();resetScroll();
    if(account.player){const before=JSON.stringify(account.player),openedView=view;accountRequest('session').then(()=>{if(opened&&view===openedView&&!busy&&JSON.stringify(account.player)!==before)render();}).catch(e=>{if(opened&&view===openedView)status(e.message);});}
  }
  const note=()=>`<p class="account-note account-error" data-account-message role="status" ${message?'':'hidden'}>${escape(message)}</p>`;
  const field=(name,label,type='text',extra='')=>`<label>${label}<input name="${name}" type="${type}" value="${escape(draft[name]||'')}" ${extra} required></label>`;
  const pass=()=>field('password',['reset','change-password-code'].includes(view)?'New password':'Password','password',`autocomplete="${view==='login'?'current-password':'new-password'}" minlength="${view==='login'?1:12}" maxlength="128"`);
  const verification=()=>`<label class="full">Security code<input name="code" class="account-code" readonly inputmode="none" aria-label="Security code" value="${codeValue}" maxlength="6"></label><div class="account-keypad full">${['1','2','3','4','5','6','7','8','9','0','⌫','Clear'].map(k=>`<button type="button" data-digit="${k}">${k}</button>`).join('')}</div>`;
  function authForm(){
    const m=mode();
    const titles={login:'Welcome back.',register:'Create your account.',verify:'Enter your code.',recover:'Recover your account.',reset:'Choose a new password.'};
    let fields='';
    if(['login','register','recover'].includes(m))fields=field('email','Email','email','autocomplete="email" maxlength="254"');
    if(m==='register')fields+=field('username','Username','text','autocomplete="nickname" minlength="3" maxlength="24"');
    if(['login','register','reset'].includes(m))fields+=pass();
    if(['register','reset'].includes(m))fields+=field('repeatPassword','Confirm password','password','autocomplete="new-password" minlength="12" maxlength="128"');
    if(['verify','reset'].includes(m))fields=verification()+fields;
    return `<div class="account-layout"><section class="account-welcome"><p class="eyebrow">YOUR ATELIER</p><h1>One account.<br>Your own collection.</h1><p>Play together, collect extraordinary things, and keep your chips safe on the server.</p><img src="assets/collectibles/watch.webp" alt="Luxury watch"></section><section class="account-form">
      <nav aria-label="Account access"><button data-view="login" aria-pressed="${m==='login'}">Sign in</button><button data-view="register" aria-pressed="${m==='register'}">New user</button></nav>
      <h1>${titles[m]}</h1>${['verify','reset'].includes(m)?'<p class="account-note">Check your email for your six-digit security code. It expires in 10 minutes.</p>':''}${note()}
      <form data-auth><div class="account-fields">${fields}</div>${['login','register','reset'].includes(m)?'<label class="account-check"><input type="checkbox" data-show-password>Show password</label>':''}
      <button class="primary" ${busy?'disabled':''}>${busy?'Please wait…':({login:'Sign in',register:'Send verification email',verify:'Verify and create account',recover:'Email security code',reset:'Update password'})[m]}</button></form>
      <div class="account-actions">${m==='login'?'<button data-view="recover">Forgot password?</button>':''}${['verify','reset'].includes(m)?'<button data-resend>Resend code</button>':''}</div>
      <button type="button" data-open-keyboard>On-screen keyboard</button><small>Virtual chips only · No cash-out or transfers</small></section></div>`;
  }
  function playerPage(){
    const p=account.player,wealth=p.wealth,profile=p.profile;
    const tabs=['account','collection','chips','orders','insights'];
    let content='';
    if(view==='account')content=`<div class="account-profile-grid"><section class="account-panel"><h2>${escape(p.username)}</h2><p>${escape(p.email)}</p><p>Your wealth includes every collectible copy.</p><button data-view="collection">View my collection →</button></section><section class="account-panel"><h2>Player controls</h2><div class="account-actions"><button data-view="change-password">Change password</button><button data-logout>Sign out</button><button data-logout-all>Sign out all devices</button><button data-view="delete">Delete account…</button></div><p>Use Multiplayer on launch to join the six-seat room. Guest play keeps its own bankroll.</p></section></div>`;
    if(['change-password','change-password-code'].includes(view))content=`<form data-auth class="account-form"><h2>Change your password.</h2><p>We’ll send a security code to ${escape(p.email)} to check it’s you.</p>${view==='change-password-code'?`<p>Enter the six-digit code from your email. It expires in 10 minutes.</p><div class="account-fields">${verification()+pass()+field('repeatPassword','Confirm new password','password','autocomplete="new-password" minlength="12" maxlength="128"')}</div><label class="account-check"><input type="checkbox" data-show-password>Show password</label>`:''}<button class="primary">${view==='change-password'?'Email security code':'Change password'}</button>${view==='change-password-code'?'<button type="button" data-resend>Resend code</button>':''}<p>Your other devices will be signed out. You’ll stay signed in here.</p></form>`;
    if(view==='collection')content=`<div class="account-collectibles">${COLLECTIBLES.map(item=>{const n=profile.items.filter(i=>i.id===item.id).length;return `<article><img src="${item.image}" alt="${escape(item.name)}"><div><h2>${item.name} <small>×${n}</small></h2><p>${money(item.price)} chips per copy</p><div class="account-actions"><button class="account-primary" data-buy-item="${item.id}">${n?'Buy another':'Add to collection'}</button>${n?`<button data-showcase="${item.id}" ${profile.showcase===item.id?'disabled':''}>${profile.showcase===item.id?'On display ✓':'Display'}</button>`:''}</div></div></article>`;}).join('')}</div>`;
    if(view==='chips')content=`<p class="account-note">Test payment only. No card details or real charges.</p><div class="account-pack-grid">${CHIP_PACKS.map(pack=>`<article class="account-panel"><h2>${money(pack.chips)}</h2><p>play chips</p><p>${usd(pack.cents)}</p><button data-buy-pack="${pack.id}">Get chips</button></article>`).join('')}</div>`;
    if(view==='orders')content=profile.orders.length?profile.orders.slice().reverse().map(o=>`<div class="account-order"><span>${escape(o.productId)}<br><small>${new Date(o.createdAt).toLocaleString()}</small></span><span>${usd(o.cents)} · ${escape(o.status)}</span>${o.status==='pending'?`<button data-resolve="${escape(o.id)}">Resolve test payment</button>`:''}</div>`).join(''):'<p>No orders yet.</p>';
    if(view==='insights')content='<div id="serverInsights" class="server-insights"></div>';
    if(view==='delete')content=`<form data-delete class="account-form"><h2>Delete this player account?</h2><p>This permanently deletes the server account, wallet, collectibles, orders and gameplay records.</p><div class="account-fields">${field('password','Current password','password','autocomplete="current-password"')}${field('confirmation','Type DELETE','text','pattern="DELETE"')}</div><button class="primary">Permanently delete account</button></form>`;
    if(checkout)content=`<section class="account-form"><h2>${escape(checkout.title)}</h2><p>${checkout.kind==='item'?`${money(checkout.price)} chips for one copy.`:`${usd(checkout.price)} · Simulated payment. No money is charged.`}</p><div class="account-actions">${(checkout.kind==='item'?['success']:checkout.kind==='pending'?['success','decline']:['success','decline','pending']).map(result=>`<button data-complete="${result}" class="${result==='success'?'account-primary':''}">${result==='success'?checkout.kind==='item'?'Confirm purchase':'Approve test payment':result==='decline'?'Decline':'Leave pending'}</button>`).join('')}<button data-cancel-checkout>Cancel</button></div></section>`;
    return `<h1>${checkout?'Checkout':view==='account'?`Welcome, ${escape(p.username)}.`:view==='collection'?'Your collection.':view==='chips'?'More room to play.':view==='orders'?'Your orders.':view==='insights'?'Understand your play.':'Your account.'}</h1><nav class="account-tabs">${tabs.map(t=>`<button data-view="${t}" aria-pressed="${view===t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</nav>${note()}<div class="account-wealth"><div><small>PLAY CHIPS</small><strong>${money(p.balance)}</strong></div><div><small>COLLECTIBLES · ${wealth.copies} COPIES</small><strong>${money(wealth.itemValue)}</strong></div><div><small>TOTAL WEALTH</small><strong>${money(wealth.total)}</strong></div></div>${content}`;
  }
  function render(){insights.close();page.innerHTML=`<header><span class="page-tools"><button class="account-back" data-back>← Back</button>${api.inGame() ? '<button data-account-game>Game room →</button>' : ''}</span><span class="wordmark">ATELIER</span><span class="page-tools"><button data-account-wide>Wide view ↗</button><button data-account-menu aria-label="Menu — return to launch" title="Menu">⚙</button></span></header><main>${account.player?playerPage():authForm()}</main>`;refreshWideView();if(opened&&account.player&&view==='insights'&&!checkout)insights.open(page.querySelector('#serverInsights'));}
  page.addEventListener('click',e=>{void insights.click(e);});
  page.addEventListener('change',e=>insights.change(e));
  page.addEventListener('input',e=>{if(e.target.name&&e.target.closest('[data-auth]'))draft[e.target.name]=e.target.value;});
  async function run(fn){if(busy)return;busy=true;status('');page.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();}catch(e){status(e.message);}finally{busy=false;if(opened){const values=Array.from(page.querySelectorAll('input')).map(e=>[e.name,e.value,e.checked]);render();for(const [name,value,checked] of values){const input=page.querySelector(`input[name="${name}"]`);if(input&&name&&name!=='code'){input.value=value;input.checked=checked;}}}}}
  page.addEventListener('submit',e=>{e.preventDefault();const values=Object.fromEntries(new FormData(e.target));
    if(e.target.matches('[data-delete]'))return run(async()=>{if(!api.canLeave())throw Error('Wait for your wager to settle first.');await accountRequest('delete-account',values);close();api.authenticated(null);});
    if(!e.target.matches('[data-auth]'))return;
    const current=mode();run(async()=>{
      Object.assign(draft,values);
      if(['verify','reset','change-password-code'].includes(current)&&!/^\d{6}$/.test(codeValue))throw Error('Enter the six-digit security code from your email.');
      if(['register','reset','change-password-code'].includes(current)&&values.password!==values.repeatPassword)throw Error('The passwords do not match.');
      const action=current==='reset'?'reset-password':current==='change-password'?'recover':current==='change-password-code'?'change-password':current;
      const result=await accountRequest(action,{...values,...(current==='change-password'?{email:account.player.email}:{}),code:codeValue,challengeId:challenge});
      if(['register','recover','change-password'].includes(current)){challenge=result.challengeId;codeValue='';draft.password=draft.repeatPassword='';view=current==='register'?'verify':current==='recover'?'reset':'change-password-code';message=result.message;}
      else if(current==='change-password-code'){view='account';challenge=codeValue='';draft.password=draft.repeatPassword='';message='Password changed. Your other devices have been signed out.';}
      else if(current==='reset'){view='login';challenge=codeValue='';draft.password=draft.repeatPassword='';message='Password updated. Sign in with your new password.';}
      else{draft.password='';draft.repeatPassword='';close();api.authenticated(account.player);}
    });
  });
  page.addEventListener('change',e=>{if(e.target.matches('[data-show-password]'))page.querySelectorAll('input[name=password],input[name=repeatPassword],input[name=invite]').forEach(input=>input.type=e.target.checked?'text':'password');});
  page.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||busy)return;
    if(b.hasAttribute('data-back')){if(checkout){checkout=null;render();}else if(account.player&&view!=='account'){view='account';render();}else close();}
    if(b.hasAttribute('data-account-menu')){close();api.openMenu();}
    if(b.hasAttribute('data-account-game')){close();api.returnToGame();}
    if(b.hasAttribute('data-account-wide'))toggleWideView().catch(()=>status('Use the browser fullscreen control on this device.'));
    if(b.dataset.view){view=b.dataset.view;checkout=null;message='';challenge=codeValue='';draft.password=draft.repeatPassword='';render();resetScroll();}
    if(b.hasAttribute('data-digit')){codeValue=b.dataset.digit==='Clear'?'':b.dataset.digit==='⌫'?codeValue.slice(0,-1):(codeValue+b.dataset.digit).slice(0,6);page.querySelector('[name=code]').value=codeValue;}
    if(b.hasAttribute('data-resend'))run(async()=>{const d=await accountRequest('resend',{challengeId:challenge});challenge=d.challengeId;codeValue='';message=d.message;});
    if(b.hasAttribute('data-logout')||b.hasAttribute('data-logout-all'))run(async()=>{if(!api.canLeave())throw Error('Wait for your wager to settle first.');await api.leaveRoom();await accountRequest(b.hasAttribute('data-logout-all')?'logout-all':'logout',{});close();api.authenticated(null);});
    if(b.dataset.buyItem){const item=COLLECTIBLES.find(i=>i.id===b.dataset.buyItem);checkout={kind:'item',id:item.id,title:item.name,price:item.price,requestId:crypto.randomUUID()};render();}
    if(b.dataset.buyPack){const pack=CHIP_PACKS.find(i=>i.id===b.dataset.buyPack)||INSIGHTS_PASS;checkout={kind:'payment',id:pack.id,title:pack.chips?`${money(pack.chips)} chips`:'30-day Insights test pass',price:pack.cents,requestId:crypto.randomUUID()};render();}
    if(b.dataset.resolve){const order=account.player.profile.orders.find(o=>o.id===b.dataset.resolve);checkout={kind:'pending',id:order.productId,title:'Pending test payment',price:order.cents,requestId:order.id};render();}
    if(b.hasAttribute('data-cancel-checkout')){checkout=null;render();}
    if(b.dataset.complete)run(async()=>{const c=checkout;await accountRequest(c.kind==='item'?'collectible':c.kind==='pending'?'complete-order':'purchase',{itemId:c.id,productId:c.id,requestId:c.requestId,result:b.dataset.complete});checkout=null;message=c.kind==='item'?'One copy added to your collection.':`Test payment ${b.dataset.complete}. No real charge.`;});
    if(b.dataset.showcase)run(async()=>{await accountRequest('showcase',{itemId:b.dataset.showcase});});
  });
  document.addEventListener('atelier-open-account',e=>open(e.detail||'account'));
  document.addEventListener('atelier-account',()=>api.changed(account.player));
  restoreAccount();return {open,close};
}
