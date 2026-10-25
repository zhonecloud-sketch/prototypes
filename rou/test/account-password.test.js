import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const flush=()=>new Promise(setImmediate);
function harness(signedIn=false){
  const events=new Map(),calls=[],message={textContent:'',hidden:true},code={name:'code',value:''};
  const page={innerHTML:'',setAttribute(){},addEventListener(name,fn){const handlers=events.get(name)||[];handlers.push(fn);events.set(name,handlers);},
    querySelector:selector=>selector==='[name=code]'||selector==='input[name="code"]'?code:selector==='[data-account-message]'?message:null,
    querySelectorAll:selector=>selector==='input'&&page.innerHTML.includes('name="code"')?[code]:[]};
  let markup='';Object.defineProperty(page,'innerHTML',{get:()=>markup,set(value){markup=value;code.value=value.match(/aria-label="Security code" value="([^"]*)"/)?.[1]||'';}});
  const account={emailMode:'email',player:signedIn?{email:'owner@example.test',username:'Owner',balance:10000,profile:{items:[],orders:[]},wealth:{copies:0,itemValue:0,total:10000}}:null};
  const document={createElement:()=>page,getElementById:()=>({append(){}}),querySelectorAll:()=>[],addEventListener(){},
    documentElement:{classList:{add(){},remove(){}}}};
  const source=readFileSync(new URL('../client/account.js',import.meta.url),'utf8').replace(/^import .*\r?\n/gm,'').replaceAll('export ','');
  const mount=vm.runInNewContext(source+';mountAccount',{
    account,accountEmail:()=>'',restoreAccount(){},document,Intl,Date,
    COLLECTIBLES:[],CHIP_PACKS:[],INSIGHTS_PASS:{},installMobileEntry(){},installAccountScroll(){},refreshWideView(){},toggleWideView(){},
    createServerInsights:()=>({close(){},click(){},change(){}}),
    FormData:class{constructor(form){return new Map(Object.entries(form.values));}},
    accountRequest:async(action,body)=>{calls.push({action,body});if(['register','recover','resend'].includes(action))return {challengeId:'challenge',testCode:'654321',message:'Check your email.'};return {player:account.player};}
  });
  const panel=mount({inGame:()=>false,opened(){},changed(){},authenticated(){}});
  function click(attributes){const button={dataset:{},hasAttribute:name=>Object.hasOwn(attributes,name)};
    for(const [name,value]of Object.entries(attributes))if(name.startsWith('data-'))button.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
    const event={target:{closest:()=>button}};for(const handler of events.get('click'))handler(event);}
  async function submit(values){const target={values,matches:selector=>selector==='[data-auth]'};
    for(const handler of events.get('submit'))handler({target,preventDefault(){}});await flush();}
  return {panel,page,account,calls,message,click,submit};
}

test('registration directs the player to email and never renders a returned test code',async()=>{
  const h=harness();h.panel.open('register');
  assert.match(h.page.innerHTML,/Send verification email/);
  await h.submit({email:'new@example.test',username:'NewPlayer',password:'long password 2026!',repeatPassword:'long password 2026!'});
  assert.match(h.page.innerHTML,/Check your email for your six-digit security code/);
  assert.doesNotMatch(h.page.innerHTML,/654321|TEST INBOX|codes appear on screen/);
});

test('signed-in password change verifies email, confirms the password and stays signed in',async()=>{
  const h=harness(true);h.panel.open();h.click({'data-view':'change-password'});
  assert.match(h.page.innerHTML,/owner@example.test/);
  await h.submit({email:'attacker@example.test'});
  assert.equal(h.calls.at(-1).action,'recover');assert.equal(h.calls.at(-1).body.email,'owner@example.test');
  assert.match(h.page.innerHTML,/Confirm new password/);assert.doesNotMatch(h.page.innerHTML,/654321/);
  for(const digit of '123456')h.click({'data-digit':digit});
  await h.submit({password:'new password 2026!',repeatPassword:'different password'});
  assert.match(h.message.textContent,/passwords do not match/);
  assert.equal(h.calls.filter(c=>c.action==='change-password').length,0);
  await h.submit({password:'new password 2026!',repeatPassword:'new password 2026!'});
  assert.equal(h.calls.at(-1).action,'change-password');
  assert.equal(h.calls.at(-1).body.code,'123456');assert.equal(h.calls.at(-1).body.challengeId,'challenge');
  assert.ok(h.account.player);assert.match(h.page.innerHTML,/Password changed/);
});

test('resending a security code clears digits from the previous email',async()=>{
  const h=harness(true);h.panel.open();h.click({'data-view':'change-password'});await h.submit({});
  h.click({'data-digit':'1'});h.click({'data-resend':''});await flush();
  assert.match(h.page.innerHTML,/aria-label="Security code" value=""/);
  assert.equal(h.page.querySelector('[name=code]').value,'');
  assert.doesNotMatch(h.page.innerHTML,/654321/);
});
