import fs from 'node:fs';
import assert from 'node:assert/strict';
// Inspect the actual delivered PE, including delayed imports. No SDK tool needed.
const data=fs.readFileSync('bin/attk-server.exe');
assert.equal(data.readUInt16LE(0),0x5a4d,'DOS header');
const pe=data.readUInt32LE(0x3c);
assert.equal(data.readUInt32LE(pe),0x4550,'PE signature');
const count=data.readUInt16LE(pe+6),size=data.readUInt16LE(pe+20),optional=pe+24;
const magic=data.readUInt16LE(optional);
assert([0x10b,0x20b].includes(magic),'PE optional header');
const directories=optional+(magic===0x20b?112:96),sections=optional+size;
function offset(rva){
 if(rva<data.readUInt32LE(optional+60))return rva;
 for(let i=0;i<count;i++){
  const base=sections+i*40,virtual=data.readUInt32LE(base+12);
  const span=Math.max(data.readUInt32LE(base+8),data.readUInt32LE(base+16));
  if(rva>=virtual&&rva<virtual+span)return data.readUInt32LE(base+20)+rva-virtual;
 }
 throw Error('Unmapped PE RVA '+rva);
}
function name(rva){
 const begin=offset(rva),end=data.indexOf(0,begin);
 assert(end>=begin&&end<begin+512,'Bounded DLL name');
 return data.toString('ascii',begin,end);
}
const imports=[];
const normal=data.readUInt32LE(directories+8);
if(normal)for(let p=offset(normal);data.readUInt32LE(p+12);p+=20){
 assert(p+20<=data.length,'Import descriptor bounds');
 imports.push(name(data.readUInt32LE(p+12)));
}
const delay=data.readUInt32LE(directories+13*8);
if(delay)for(let p=offset(delay);data.readUInt32LE(p+4);p+=32){
 assert(p+32<=data.length,'Delay descriptor bounds');
 assert(data.readUInt32LE(p)&1,'Delayed import names must use RVA');
 imports.push(name(data.readUInt32LE(p+4)));
}
assert(imports.length>0,'Expected Windows system imports');
const externalCRT=imports.filter(n=>/^(vcruntime|msvcp|msvcr|ucrtbase|api-ms-win-crt)/i.test(n));
assert.deepEqual(externalCRT,[],'Windows test package must include its C runtime');
console.log('PASS Windows executable has no external C-runtime DLL prerequisite:',imports.join(', '));
