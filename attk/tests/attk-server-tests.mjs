import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const exe=process.platform==='win32'?'bin/attk-server.exe':'bin/attk-server';
const child=spawn(path.resolve(exe),['--root',process.cwd(),'--port','0'],{stdio:['ignore','pipe','pipe']});
let output='',errors='';
child.stderr.on('data',b=>errors+=b);
const url=await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>{child.kill();reject(Error('Server startup timeout: '+errors));},15000);
 child.once('error',e=>{clearTimeout(timer);reject(e);});
 child.once('exit',code=>{clearTimeout(timer);reject(Error('Server exited '+code+': '+errors));});
 child.stdout.on('data',b=>{
  output+=b;const match=output.match(/Rust server: (http:\/\/[^\s]+)\/index.html/);
  if(match){clearTimeout(timer);resolve(match[1]);}
 });
});
function request(target,headers={},method='GET'){
 return new Promise((resolve,reject)=>{
  const req=http.request(url,{path:target,method,headers},res=>{
   const chunks=[];res.on('data',b=>chunks.push(b));res.on('end',()=>resolve({status:res.statusCode,
    headers:res.headers,body:Buffer.concat(chunks)}));
  });req.on('error',reject);req.end();
 });
}
try{
 const health=await request('/health');assert.equal(health.status,200);
 assert.equal(JSON.parse(health.body).runtime,'rust');
 for(const p of ['/', '/index.html']){
  const res=await request(p);assert.equal(res.status,200);
  assert(res.body.toString().includes('<title>A Tale of the Three Kingdoms</title>'));
 }
 const wasm=await request('/wasm/attk_engine.wasm');
 assert.equal(wasm.headers['content-type'],'application/wasm');
 assert.equal((await WebAssembly.instantiate(wasm.body,{})).instance.exports.kernel_version(),1);
 for(const p of ['/Cargo.toml','/rust/server/src/main.rs','/%2e%2e/index.html',
  '/assets/%2e%2e/Cargo.toml','/config/x%00.json','/assets/%5c..%5cCargo.toml'])
  assert.equal((await request(p)).status,404,p);
 assert.equal((await request('/index.html',{},'POST')).status,405);
 const head=await request('/index.html',{},'HEAD');
 assert.equal(head.status,200);assert.equal(head.body.length,0);
 assert(Number(head.headers['content-length'])>0);
 const file='/assets/music/council-music.mp3';
 const first=await request(file,{Range:'bytes=0-1'});
 assert.equal(first.status,206);assert.equal(first.body.length,2);
 assert.deepEqual(first.body,fs.readFileSync('.'+file).subarray(0,2));
 assert.equal((await request(file,{Range:'bytes=999999999-'})).status,416);
 assert.equal((await request('/vendor/js-yaml.js')).status,200);
 const partial=await request('/wasm/attk_engine.wasm',{Range:'bytes=-4'});
 assert.deepEqual(partial.body,wasm.body.subarray(-4));
 console.log('PASS real Rust HTTP startup, WASM MIME, assets, source isolation and audio ranges');
}finally{child.kill();}
