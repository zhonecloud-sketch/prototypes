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
  const account={verificationMode:'screen',player:signedIn?{email:'owner@example.test',username:'Owner',balance:10000,profile:{items:[],orders:[]},wealth:{copies:0,itemValue:0,total:10000}}:null};
  const document={createElement:()=>page,getElementById:()=>({append(){}}),querySelectorAll:()=>[],addEventListener(){},
    documentElement:{classList:{add(){},remove(){}}}};
  const source=readFileSync(new URL('../client/account.js',import.meta.url),'utf8').replace(/^import .*\r?\n/gm,'').replaceAll('export ','');
  const mount=vm.runInNewContext(source+';mountAccount',{
    account,accountEmail:()=>'',restoreAccount(){},document,Intl,Date,
    COLLECTIBLES:[],CHIP_PACKS:[],INSIGHTS_PASS:{},installMobileEntry(){},installAccountScroll(){},refreshWideView(){},toggleWideView(){},
    createServerInsights:()=>({close(){},click(){},change(){}}),
    FormData:class{constructor(form){return new Map(Object.entries(form.values));}},
    accountRequest:async(action,body)=>{calls.push({action,body});if(['register','resend'].includes(action))return {challengeId:'challenge',testCode:'654321',message:'Enter the code shown below.'};return {player:account.player};}
  });
  const panel=mount({inGame:()=>false,opened(){},changed(){},authenticated(){}});
  function click(attributes){const button={dataset:{},hasAttribute:name=>Object.hasOwn(attributes,name)};
    for(const [name,value]of Object.entries(attributes))if(name.startsWith('data-'))button.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
    const event={target:{closest:()=>button}};for(const handler of events.get('click'))handler(event);}
  async function submit(values){const target={values,matches:selector=>selector==='[data-auth]'};
    for(const handler of events.get('submit'))handler({target,preventDefault(){}});await flush();}
  return {panel,page,account,calls,message,click,submit};
}

test('registration displays its code without filling the keypad automatically',async()=>{
  const h=harness();h.panel.open('register');assert.match(h.page.innerHTML,/Get security code/);
  await h.submit({email:'new@example.test',username:'NewPlayer',password:'long password 2026!',repeatPassword:'long password 2026!'});
  assert.match(h.page.innerHTML,/data-security-code>654321/);assert.match(h.page.innerHTML,/expires in 10 minutes/);
  assert.equal(h.page.querySelector('[name=code]').value,'');
  await h.submit({});assert.match(h.message.textContent,/six-digit security code shown above/);
  for(const digit of '654321')h.click({'data-digit':digit});await h.submit({});
  assert.equal(h.calls.at(-1).action,'verify');assert.equal(h.calls.at(-1).body.code,'654321');
});

test('signed-in password changes require current password and confirmation, without a code',async()=>{
  const h=harness(true);h.panel.open();h.click({'data-view':'change-password'});
  assert.match(h.page.innerHTML,/name="currentPassword"/);assert.match(h.page.innerHTML,/Confirm new password/);
  assert.doesNotMatch(h.page.innerHTML,/name="code"|data-resend|data-security-code|inbox|spam/);
  await h.submit({password:'new password 2026!',repeatPassword:'new password 2026!'});
  assert.match(h.message.textContent,/Enter your current password/);
  await h.submit({currentPassword:'old password 2026!',password:'new password 2026!',repeatPassword:'different password'});
  assert.match(h.message.textContent,/passwords do not match/);
  assert.equal(h.calls.filter(c=>c.action==='change-password').length,0);
  await h.submit({currentPassword:'old password 2026!',password:'new password 2026!',repeatPassword:'new password 2026!'});
  const sent=h.calls.at(-1);assert.equal(sent.action,'change-password');assert.equal(sent.body.currentPassword,'old password 2026!');
  assert.equal(sent.body.password,'new password 2026!');assert.equal(sent.body.code,undefined);assert.equal(sent.body.challengeId,undefined);
  assert.ok(h.account.player);assert.match(h.page.innerHTML,/Password changed/);
  h.click({'data-view':'change-password'});assert.doesNotMatch(h.page.innerHTML,/value="(?:old|new) password/);
});

test('requesting another code clears previously entered digits and shows the returned code',async()=>{
  const h=harness();h.panel.open('register');
  await h.submit({email:'new@example.test',username:'NewPlayer',password:'long password 2026!',repeatPassword:'long password 2026!'});
  h.click({'data-digit':'1'});h.click({'data-resend':''});await flush();
  assert.equal(h.calls.at(-1).action,'resend');assert.equal(h.page.querySelector('[name=code]').value,'');
  assert.match(h.page.innerHTML,/data-security-code>654321/);
});

test('signed-out users have no insecure recovery action',()=>{
  const h=harness();h.panel.open();assert.doesNotMatch(h.page.innerHTML,/Forgot password|data-view="recover"/);
});
