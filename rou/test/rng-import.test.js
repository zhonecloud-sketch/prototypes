import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseRngFile} from '../client/rng-import.js';
test('operator import accepts the real archive and generated replay format',()=>{
  const ns=parseRngFile(readFileSync(new URL('../assets/2m-rng.txt',import.meta.url),'utf8'));
  assert.equal(ns.length,2000000);assert.deepEqual(ns.slice(0,4),[18,11,21,34]);
  assert.deepEqual(parseRngFile('<pre id="seed">seed: -1</pre><pre id="spins">000:00:00:00\t18\n000:00:00:30\t11</pre>'),[18,11]);
  assert.deepEqual(parseRngFile('[0,18,36]'),[0,18,36]);
});
test('invalid source numbers are rejected instead of filtered or coerced',()=>{
  for(const bad of ['0\n37','0\n-1','1.5','1abc','["1"]','{"numbers":[1]}','', '<script>1</script>'])assert.throws(()=>parseRngFile(bad));
});
