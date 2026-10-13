import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
import {loadRasterAssets} from '../mjs/raster-world.mjs';import {HISTORY_YEARS,historyArtworkFile} from '../mjs/history-art.mjs';import {AudioBus} from '../mjs/audio.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/asset-manifest.json')));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const exists=p=>assert(fs.existsSync(path.join(root,p)),p);
for(const row of manifest.relocated){exists(row.to);assert(!fs.existsSync(path.join(root,row.from)),row.from);const data=fs.readFileSync(path.join(root,row.to));assert.equal(data.length,row.bytes,row.to);const blob=crypto.createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');assert.equal(blob,row.gitBlob,row.to);}
for(const row of manifest.retired)assert(!fs.existsSync(path.join(root,row.path)),row.path);
const media=walk(path.join(root,'assets')).map(p=>path.relative(root,p).replaceAll(path.sep,'/')).sort();assert.deepEqual(media,manifest.relocated.map(r=>r.to).sort());assert(media.every(p=>/^assets\/(artwork|sounds|music)\//.test(p)));
assert.equal(manifest.totals.retiredBytes,manifest.retired.reduce((n,r)=>n+r.bytes,0));assert.equal(manifest.totals.relocatedFiles,manifest.relocated.length);
console.log('PASS retired media absent; all retained artwork/audio grouped and byte-identical to original Git blobs');
const requests=[];globalThis.Image=class{set src(value){requests.push(value);queueMicrotask(()=>this.onload());}};await loadRasterAssets();
for(const year of HISTORY_YEARS)requests.push(historyArtworkFile('history'+year));requests.push(historyArtworkFile('historyDefault'));
for(const url of requests)exists(url.replace(/^\.\//,''));assert(requests.some(p=>p.includes('battlefields/province-41-v17.webp')));assert.equal(requests.filter(p=>p.includes('battlefields/')).length,41);
console.log('PASS real raster loader and all standalone history scenes resolve grouped artwork paths');
globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};const audio=[];globalThis.Audio=class{constructor(src){this.src=src;audio.push(src);}play(){return Promise.resolve();}pause(){}};
const bus=new AudioBus();bus.unlock();bus.setActive(true);for(let id=0;id<16;id++)bus.playNative(id);for(const cue of ['order','fire','month','message','gallop','flood','locust','typhoon','epidemic','uprising','meteor','death','march','train','trade','recruit','retreat','charge-shout','sword-attack'])bus.play(cue);
const count=audio.length;bus.play('select');bus.play('battle');assert.equal(audio.length,count);bus.destroy();for(const url of audio)exists(url.replace(/^\.\//,'').split('?')[0]);assert(audio.some(u=>u.includes('/music/council-music.mp3')));assert(audio.some(u=>u.includes('/sounds/audiomass-horse_gallop.mp3')));
console.log('PASS real AudioBus music, native cue IDs and supported custom effects resolve; silent retired cues request no file');
for(const dir of ['mjs','tests','tools','config'])for(const file of walk(path.join(root,dir)).filter(p=>/\.(mjs|py|json|yaml)$/.test(p)&&!p.endsWith('generate-test-spec.mjs'))){const text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/(?:\.\.\/|\.\/)?assets\/[A-Za-z0-9_./-]+\.(?:webp|png|svg|mp3)/g)){const logical=match[0].replace(/^(?:\.\.\/|\.\/)/,'');if(file.endsWith('build-charge-audio.py')&&logical.endsWith('/charge-shout.mp3'))continue; // Historical generator output, not an input.
exists(logical);}}
const release=JSON.parse(fs.readFileSync(path.join(root,'config/release.json')));const checkRefs=v=>{if(typeof v==='string'&&/^(?:assets|docs)\//.test(v))exists(v.split('#')[0]);else if(Array.isArray(v))v.forEach(checkRefs);else if(v&&typeof v==='object')Object.values(v).forEach(checkRefs);};checkRefs(release);
console.log('PASS concrete source media URLs and release pointers resolve after relocation');
const changes=fs.readFileSync(path.join(root,'docs/changes.md'),'utf8'),anchors=[...changes.matchAll(/<a id="([^"]+)"><\/a>/g)].map(m=>m[1]);assert.equal(anchors.length,new Set(anchors).size);
for(const file of walk(path.join(root,'docs')))assert(!/v\d+[^/]*\.(md|html)$/.test(file),file);
assert(changes.includes('original Git blob'));assert(changes.includes('record-fixes-v56'));exists('docs/native_sound.md');exists('docs/test_spec.md');
console.log('PASS one consolidated version history, unique record anchors and current sound/test documentation');
