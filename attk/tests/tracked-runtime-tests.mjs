import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {verifyRuntime} from '../tools/runtime-files.mjs';

const files=['bin/attk-server.exe','wasm/attk_engine.wasm','RUNTIME-INFO.json'];
const tracked=execFileSync('git',['ls-files','--error-unmatch','--',...files],
 {encoding:'utf8'}).trim().split(/\r?\n/).sort();
assert.deepEqual(tracked,files.slice().sort());
const info=await verifyRuntime({expectedCommit:process.env.ATTK_BUILD_COMMIT});
for(const row of info.runtime){
 const blob=execFileSync('git',['hash-object','--',row.path],{encoding:'utf8'}).trim();
 assert.equal(blob,row.gitBlob,row.path);
}
console.log('PASS BUG-ATTK-03 fresh Git checkout tracks exact Windows executable/WASM bytes');
