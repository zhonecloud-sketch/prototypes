import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const previous={id:'previous',email:'previous@example.test',username:'Previous player',balance:12345};
const next={id:'next',email:'next@example.test',username:'Next player',balance:67890};
const reply=(data,status=200)=>({ok:status<400,status,json:async()=>data});
function deferred(){let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};}
function harness(send){
  const stored=new Map([['atelier.serverAccess.v1',JSON.stringify({clientId:crypto.randomUUID(),sessionToken:'previous-token'})]]),calls=[];
  const source=readFileSync(new URL('../client/account-api.js',import.meta.url),'utf8').replaceAll('export ','');
  const api=vm.runInNewContext(source+';({account,accountRequest,restoreAccount,storePlayer})',{
    location:{hostname:'localhost',origin:'http://localhost'},crypto,AbortSignal,DOMException,
    sessionStorage:{getItem:key=>stored.get(key),setItem:(key,value)=>stored.set(key,value)},
    document:{dispatchEvent(){}},CustomEvent:class{},
    fetch:async(url,options)=>{calls.push({action:url.split('/').at(-1),options});return send(calls.at(-1));}
  });
  return {...api,calls,credentials:()=>JSON.parse(stored.get('atelier.serverAccess.v1'))};
}

test('rejected login clears the previous identity and saved session',async()=>{
  const h=harness(()=>reply({error:'Email or password is incorrect.'},401));h.storePlayer(previous);
  await assert.rejects(h.accountRequest('login',{email:'wrong@example.test',password:'wrong'}),/Email or password is incorrect/);
  assert.equal(h.account.player,null);assert.equal(h.credentials().sessionToken,undefined);
  assert.equal(h.calls[0].options.headers.Authorization,undefined);
});

test('a delayed startup restore cannot sign the previous player in after a failed login',async()=>{
  const old=deferred(),h=harness(({action})=>action==='session'?old.promise:reply({error:'Email or password is incorrect.'},401));
  const restore=h.restoreAccount();
  await assert.rejects(h.accountRequest('login',{email:'wrong@example.test',password:'wrong'}),/incorrect/);
  old.resolve(reply({player:previous}));await restore;
  assert.equal(h.account.player,null);assert.equal(h.credentials().sessionToken,undefined);
});

test('a delayed old response cannot overwrite a successful login',async()=>{
  const old=deferred(),h=harness(({action})=>action==='session'?old.promise:reply({player:next,sessionToken:'next-token'}));
  const restore=h.restoreAccount();await h.accountRequest('login',{email:next.email,password:'correct'});
  old.resolve(reply({player:previous}));await restore;
  assert.equal(h.account.player.id,next.id);assert.equal(h.credentials().sessionToken,'next-token');
});

test('an expired old request cannot sign out a successful new login',async()=>{
  const old=deferred(),h=harness(({action})=>action==='room-poll'?old.promise:reply({player:next,sessionToken:'next-token'}));
  const poll=h.accountRequest('room-poll',{});const rejected=assert.rejects(poll,{name:'AbortError'});
  await h.accountRequest('login',{email:next.email,password:'correct'});
  old.resolve(reply({error:'Log in again.'},401));await rejected;
  assert.equal(h.account.player.id,next.id);assert.equal(h.credentials().sessionToken,'next-token');
});

test('an unsuccessful login connection cannot fall back to the previous account',async()=>{
  const h=harness(()=>{throw Error('Connection failed');});h.storePlayer(previous);
  await assert.rejects(h.accountRequest('login',{email:next.email,password:'correct'}),/Cannot connect/);
  assert.equal(h.account.player,null);assert.equal(h.credentials().sessionToken,undefined);
});

test('an anonymous session check during login cannot erase the newly authenticated account',async()=>{
  const login=deferred(),session=deferred(),h=harness(({action})=>action==='login'?login.promise:session.promise);
  const signingIn=h.accountRequest('login',{email:next.email,password:'correct'});
  const checking=h.accountRequest('session');const rejected=assert.rejects(checking,{name:'AbortError'});
  login.resolve(reply({player:next,sessionToken:'next-token'}));await signingIn;
  session.resolve(reply({player:null}));await rejected;
  assert.equal(h.account.player.id,next.id);assert.equal(h.credentials().sessionToken,'next-token');
});

test('an anonymous request rejection during login does not cancel the valid login',async()=>{
  const login=deferred(),h=harness(({action})=>action==='login'?login.promise:reply({error:'Log in again.'},401));
  const signingIn=h.accountRequest('login',{email:next.email,password:'correct'});
  await assert.rejects(h.accountRequest('room-poll',{}),/Log in again/);
  login.resolve(reply({player:next,sessionToken:'next-token'}));await signingIn;
  assert.equal(h.account.player.id,next.id);assert.equal(h.credentials().sessionToken,'next-token');
});

test('password-change validation errors preserve the signed-in player',async()=>{
  const h=harness(()=>reply({error:'Your current password is incorrect.'},400));h.storePlayer(previous);
  await assert.rejects(h.accountRequest('change-password',{currentPassword:'wrong',password:'new password'}),/current password/);
  assert.equal(h.account.player.id,previous.id);assert.equal(h.credentials().sessionToken,'previous-token');
});
