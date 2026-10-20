// Local-only, disposable preview. Test invitations never reach hosted config.
import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync,readdirSync,createReadStream,statSync } from 'node:fs';
import { resolve,extname,sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createService } from '../sites-server/lib/service.mjs';
import { digest,passwordHash } from '../sites-server/lib/security.mjs';
import { newProfile } from '../client/catalogue.js';
const root=fileURLToPath(new URL('../',import.meta.url)),sqlite=new DatabaseSync(':memory:');
sqlite.exec('PRAGMA foreign_keys=ON');
for(const name of readdirSync(root+'sites-server/drizzle').filter(n=>n.endsWith('.sql')).sort())sqlite.exec(readFileSync(root+'sites-server/drizzle/'+name,'utf8'));
const db={prepare(sql){return {bind(...values){const q=sqlite.prepare(sql);return {async first(){return q.get(...values)||null;},async all(){return {results:q.all(...values)};},async run(){return {meta:q.run(...values)};},rawrun(){return {meta:q.run(...values)};}};}};},async batch(statements){sqlite.exec('BEGIN');try{const result=statements.map(s=>s.rawrun());sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
for(const [email,username] of [['alice@example.test','QA_Alice'],['bob@example.test','QA_Bob']])sqlite.prepare('INSERT INTO players (id,email,username,username_key,password,verified_at,created_at,balance,profile,revision) VALUES (?,?,?,?,?,?,?,?,?,0)').run(crypto.randomUUID(),email,username,username.toLowerCase(),await passwordHash('Local QA account 2026!'),Date.now(),Date.now(),10000,JSON.stringify(newProfile()));
const origin='http://127.0.0.1:8768',service=createService(db,{EMAIL_MODE:'test',FRONTEND_ORIGIN:origin,ADMIN_EMAILS:'alice@example.test',ADMIN_KEY_HASH:digest('local-operator'),TEST_INVITES:JSON.stringify({'alice@example.test':digest('local-alice'),'bob@example.test':digest('local-bob')})});
http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,origin);
    if(url.pathname.startsWith('/api/account/')){
      const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>32768)throw Error('Request too large');chunks.push(chunk);}
      const result=await service(new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})}));
      res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));return;
    }
    const relative=decodeURIComponent(url.pathname.replace(/^\/rou\//,''))||'index.html',path=resolve(root,relative);
    if(!path.startsWith(resolve(root)+sep)||!statSync(path).isFile()){res.writeHead(404);res.end();return;}
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'})[extname(path)]||'text/plain');
    if(relative==='index.html'&&url.searchParams.has('phone')){res.end(readFileSync(path,'utf8').replace('</head>',`<script>Object.defineProperty(navigator,'userAgent',{value:'Atelier local iPhone layout preview'});</script></head>`));return;}
    createReadStream(path).pipe(res);
  }catch(error){res.writeHead(500);res.end(error.message);}
}).listen(8768,'127.0.0.1',()=>console.log('Local account/game preview: '+origin+'/rou/'));
