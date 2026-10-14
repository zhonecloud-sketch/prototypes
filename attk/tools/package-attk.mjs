import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const name=process.argv[2];
if(!name||!/^[a-z0-9-]+$/.test(name))throw Error('Pass a platform package name.');
const root=process.cwd(),output=path.join(root,'dist',name,'attk');
fs.mkdirSync(output,{recursive:true});
const ignored=new Set(['node_modules','target','dist','.git','bin','wasm']);
for(const entry of fs.readdirSync(root,{withFileTypes:true})){
 if(ignored.has(entry.name))continue;
 fs.cpSync(path.join(root,entry.name),path.join(output,entry.name),{recursive:true});
}
for(const dir of ['bin','wasm'])fs.cpSync(path.join(root,dir),path.join(output,dir),{recursive:true});
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const rows=walk(output).map(file=>({path:path.relative(output,file).split(path.sep).join('/'),
 bytes:fs.statSync(file).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}));
const report={platform:name,commit:process.env.GITHUB_SHA||null,rust:'1.90.0',
 engine:'Rust WASM arithmetic with JavaScript campaign/UI',totalBytes:rows.reduce((n,r)=>n+r.bytes,0),
 files:rows};
fs.writeFileSync(path.join(output,'BUILD-INFO.json'),JSON.stringify(report,null,2)+'\n');
const summary=rows.filter(r=>/^bin\/|^wasm\//.test(r.path));
console.log(JSON.stringify({platform:name,totalBytes:report.totalBytes,runtime:summary},null,2));
