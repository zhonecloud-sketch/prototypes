import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {battlefieldKey,battlefieldFile,paintingRect,paintBattlefield,BATTLEFIELD_BOUNDS} from '../mjs/battlefield-art.mjs';
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const manifest=JSON.parse(fs.readFileSync('config/battlefield-paintings.json'));
const terrains=JSON.parse(fs.readFileSync('config/province-terrain.json'));
assert.equal(manifest.maps.length,41);assert.deepEqual(manifest.maps.map(m=>m.province),Array.from({length:41},(_,i)=>i+1));
const hashes=new Set();
for(const map of manifest.maps){
 const bytes=fs.readFileSync(map.asset);assert.equal(sha(bytes),map.sha256);assert(!hashes.has(map.sha256));hashes.add(map.sha256);
 assert.deepEqual(map.terrain,terrains[map.province-1]);assert.equal(map.terrainSha256,sha(Buffer.from(terrains[map.province-1])));
 assert.equal(map.asset,'assets/'+battlefieldFile(map.province));assert.equal(battlefieldKey(map.province),'battlefield'+String(map.province).padStart(2,'0'));
 const image=await loadImage(bytes);assert.equal(image.width,map.width);assert.equal(image.height,map.height);assert(Math.abs(image.width/image.height-1024/1109)<.002);
 const screen=p=>({x:p.x*10+100,y:p.z*10+104}),rect=paintingRect(image,10,screen);
 assert(Math.abs(rect.width/rect.height-image.width/image.height)<1e-12);assert.equal(rect.x,0);assert.equal(rect.y,screen({x:0,z:BATTLEFIELD_BOUNDS.top}).y);
 const canvas=createCanvas(200,220),ctx=canvas.getContext('2d');paintBattlefield(ctx,image,10,screen);const pixels=ctx.getImageData(0,0,200,220).data;
 assert(pixels.some((v,i)=>i%4!==3&&v>70));
}
console.log('PASS all 41 unique paintings load, retain aspect ratio and match the original terrain identity and renderer registration');
const code=fs.readFileSync('mjs/raster-world.mjs','utf8');assert(!code.includes('createTerrainPainter'));assert(!code.includes('terrainVariant'));assert(code.includes('paintBattlefield'));
assert(!fs.existsSync('mjs/terrain-art.mjs'));
console.log('PASS battlefield rendering has no terrain autotiling or texture blending path');
const audio=fs.readFileSync('tools/build-battle-audio.py','utf8');assert(audio.includes('BATTLE_BPM=144'));assert(fs.statSync('assets/battle-music-v17.mp3').size>100000);assert(fs.statSync('assets/triumph-music.mp3').size>100000);
const victory=await loadImage('assets/triumph-v17.webp');assert.equal(victory.width/victory.height,16/9);
console.log('PASS the faster battlefield composition and separately preloaded victory artwork are present');
console.log('3 v17 asset and integration regression groups passed.');
