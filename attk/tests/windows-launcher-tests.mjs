import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';

if(process.platform!=='win32')throw Error('Run this case on Windows CI.');
const source=process.cwd(),root=fs.mkdtempSync(path.join(os.tmpdir(),'attk launcher '));
const command=process.env.ComSpec||path.join(process.env.SystemRoot,'System32','cmd.exe');
const systemPath=path.join(process.env.SystemRoot,'System32');
const launcher=fs.readFileSync('start-game.bat');
const buildScript=fs.readFileSync('build.bat');
let cases=0;
function fixture(name,exe=false,wasm=false){
 const dir=path.join(root,name);
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'start-game.bat'),launcher);
 fs.writeFileSync(path.join(dir,'build.bat'),
  '@echo off\r\necho BUILD-TEST-ONLY\r\nexit /b 7\r\n');
 fs.writeFileSync(path.join(dir,'index.html'),fs.readFileSync('index.html'));
 if(exe){
  fs.mkdirSync(path.join(dir,'bin'));
  fs.copyFileSync('bin/attk-server.exe',path.join(dir,'bin/attk-server.exe'));
 }
 if(wasm){
  fs.mkdirSync(path.join(dir,'wasm'));
  fs.copyFileSync('wasm/attk_engine.wasm',path.join(dir,'wasm/attk_engine.wasm'));
 }
 return dir;
}
function environment(dir){
 return {...process.env,PATH:systemPath,USERPROFILE:path.join(dir,'empty profile'),
  ATTK_NO_PAUSE:'1'};
}
function invoke(dir,env=environment(dir),script='start-game.bat'){
 const result=spawnSync(command,['/d','/c',script],{cwd:dir,env,encoding:'utf8',timeout:10000});
 if(result.error)throw result.error;
 return {...result,text:result.stdout+result.stderr};
}
function pass(label){cases++;console.log('PASS BUG-ATTK-02',label);}

try{
 for(const [name,exe,wasm,missing] of [
  ['source only',false,false,['bin\\attk-server.exe','wasm\\attk_engine.wasm']],
  ['missing wasm',true,false,['wasm\\attk_engine.wasm']],
  ['missing server',false,true,['bin\\attk-server.exe']],
 ]){
  const dir=fixture(name,exe,wasm),result=invoke(dir);
  assert.equal(result.status,2,result.text);
  for(const file of missing)assert(result.text.includes('Missing: '+file),result.text);
  assert(result.text.includes('To play without installing Rust:'),result.text);
  assert(result.text.includes('attk-windows-x64-runtime'),result.text);
  assert(result.text.includes('extra extracted archive folder'),result.text);
  assert(!result.text.includes('BUILD-TEST-ONLY'));
  pass(name+' identifies missing outputs and the compiler-free route');
 }
 const nested=fixture('nested extraction');
 fs.mkdirSync(path.join(nested,'attk-windows-x64-runtime','bin'),{recursive:true});
 fs.copyFileSync('bin/attk-server.exe',
  path.join(nested,'attk-windows-x64-runtime','bin','attk-server.exe'));
 assert.equal(invoke(nested).status,2);
 pass('nested extraction does not count as an installed runtime');

 const cached=fixture('cached Cargo');
 const cargoDir=path.join(environment(cached).USERPROFILE,'.cargo','bin');
 fs.mkdirSync(cargoDir,{recursive:true});
 fs.writeFileSync(path.join(cargoDir,'cargo.exe'),'fixture sentinel');
 const cachedResult=invoke(cached);
 assert.equal(cachedResult.status,1,cachedResult.text);
 assert(cachedResult.text.includes('BUILD-TEST-ONLY'),cachedResult.text);
 pass('Rust installed in the default profile location reaches the build');

 const onPath=fixture('Cargo on PATH'),stub=path.join(onPath,'compiler');
 fs.mkdirSync(stub);
 fs.writeFileSync(path.join(stub,'cargo.cmd'),'@echo off\r\nexit /b 0\r\n');
 const pathResult=invoke(onPath,{...environment(onPath),PATH:stub+';'+systemPath});
 assert.equal(pathResult.status,1,pathResult.text);
 assert(pathResult.text.includes('BUILD-TEST-ONLY'));
 pass('Cargo on PATH retains source-build fallback');

 const noCompiler=fixture('explicit build without Cargo');
 fs.writeFileSync(path.join(noCompiler,'build.bat'),buildScript);
 const explicit=invoke(noCompiler,environment(noCompiler),'build.bat');
 assert.equal(explicit.status,2,explicit.text);
 assert(explicit.text.includes('prebuilt Windows runtime'));
 pass('explicit build explains its compiler requirement');

 const installed=fixture('installed runtime',true,true);
 const child=spawn(command,['/d','/c','start-game.bat --port 0 --no-open'],
  {cwd:installed,env:environment(installed),stdio:['ignore','pipe','pipe']});
 const stop=()=>spawnSync('taskkill',['/PID',String(child.pid),'/T','/F']);
 let output='',error='';
 child.stderr.on('data',b=>error+=b);
 try{
  const base=await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error('Launcher timeout: '+error+output)),15000);
   child.once('error',e=>{clearTimeout(timer);reject(e);});
   child.once('exit',code=>{clearTimeout(timer);reject(Error('Early exit '+code+': '+error+output));});
   child.stdout.on('data',b=>{output+=b;const m=output.match(/Rust server: (http:\/\/[^\s]+)\/index.html/);
    if(m){clearTimeout(timer);resolve(m[1]);}});
  });
  const data=await new Promise((resolve,reject)=>{
   http.get(base+'/health',res=>{let text='';res.on('data',b=>text+=b);
    res.on('end',()=>resolve({status:res.statusCode,text}));}).on('error',reject);
  });
  assert.equal(data.status,200);
  assert.equal(JSON.parse(data.text).runtime,'rust');
  assert(!output.includes('BUILD-TEST-ONLY'));
  pass('prebuilt runtime launches with no Cargo on PATH or in the profile');
 }finally{stop();}
}finally{
 fs.rmSync(root,{recursive:true,force:true,maxRetries:10,retryDelay:100});
}
console.log('PASS Windows launcher regression cases:',cases);
