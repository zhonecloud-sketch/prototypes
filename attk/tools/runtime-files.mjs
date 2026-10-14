import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const wanted=['bin/attk-server.exe','wasm/attk_engine.wasm'];
const sources=['Cargo.toml','Cargo.lock','rust-toolchain.toml','build.bat',
 'rust/engine/Cargo.toml','rust/engine/src/lib.rs',
 'rust/server/Cargo.toml','rust/server/src/main.rs',
 'mjs/rust-kernel.mjs','mjs/native-combat.mjs'];
const digest=(algorithm,...parts)=>{
 const hash=crypto.createHash(algorithm);
 for(const part of parts)hash.update(part);
 return hash.digest('hex');
};
export function sourceFingerprint(){
 const parts=sources.slice().sort().flatMap(file=>[
  file+'\n',fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n')
 ]);
 return digest('sha256',...parts);
}
export async function verifyRuntime({record=false,expectedCommit}={}){
 const location=path.join(root,'RUNTIME-INFO.json');
 const info=JSON.parse(fs.readFileSync(location,'utf8'));
 assert.equal(info.platform,'attk-windows-x64');
 assert.equal(info.rust,'1.90.0');
 assert.match(info.commit,/^[a-f0-9]{40}$/);
 if(expectedCommit)assert.equal(info.commit,expectedCommit,'Build source commit');
 assert.equal(info.runtime.length,2);
 assert.deepEqual(info.runtime.map(row=>row.path).sort(),wanted.slice().sort());
 for(const row of info.runtime){
  const data=fs.readFileSync(path.join(root,row.path));
  assert.equal(data.length,row.bytes,row.path+' size');
  assert.equal(digest('sha256',data),row.sha256,row.path+' SHA-256');
  const blob=digest('sha1','blob '+data.length+'\0',data);
  if(record)row.gitBlob=blob;
  else assert.equal(row.gitBlob,blob,row.path+' Git blob');
 }
 const fingerprint=sourceFingerprint();
 if(record)info.sourceFingerprint=fingerprint;
 else assert.equal(info.sourceFingerprint,fingerprint,'Stale compiled inputs');
 const wasm=fs.readFileSync(path.join(root,'wasm/attk_engine.wasm'));
 assert.equal((await WebAssembly.instantiate(wasm,{})).instance.exports.kernel_version(),1);
 if(record){
  // A docs-only build must not generate another provenance-only commit.
  let baseline;
  try{
   const value=execFileSync('git',['show','HEAD:attk/RUNTIME-INFO.json'],
    {cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']});
   baseline=JSON.parse(value);
  }catch(error){
   if(error.status!==128)throw error;
  }
  const unchanged=baseline?.sourceFingerprint===fingerprint&&
   wanted.every(file=>{
    const old=baseline.runtime.find(row=>row.path===file);
    const fresh=info.runtime.find(row=>row.path===file);
    return old?.bytes===fresh.bytes&&old.sha256===fresh.sha256&&
     old.gitBlob===fresh.gitBlob;
   });
  if(unchanged){
   fs.writeFileSync(location,JSON.stringify(baseline,null,2)+'\n');
   return baseline;
  }
  fs.writeFileSync(location,JSON.stringify(info,null,2)+'\n');
 }
 return info;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const info=await verifyRuntime({
  record:process.argv.includes('--record'),
  expectedCommit:process.env.ATTK_BUILD_COMMIT
 });
 console.log('PASS verified Windows runtime files:',JSON.stringify(info));
}
