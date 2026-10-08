import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {paintAtlas} from '../mjs/artwork.mjs';
const sheets={portraits:await loadImage('assets/portraits.webp'),events:await loadImage('assets/events.webp'),weather:await loadImage('assets/weather.webp'),disasters:await loadImage('assets/disasters.webp'),omens:await loadImage('assets/omens.webp'),stories:await loadImage('assets/stories.webp')};
const dest=process.env.RTK2_QA_ARTIFACT_DIR;if(dest)fs.mkdirSync(dest,{recursive:true});
for(const [key,image] of Object.entries(sheets))for(const [w,h] of [[100,120],[510,140],[145,190],[320,200],[720,280]]){
 const canvas=createCanvas(1,1);canvas.getBoundingClientRect=()=>({width:w,height:h});const columns=key==='portraits'?4:2,cell=key==='portraits'?0:2;
 const rect=paintAtlas(canvas,image,columns,columns,cell,2);
 assert(Math.abs(rect.width/rect.height-image.width/image.height)<1e-9,`${key} distorted in ${w}×${h}`);
 assert(rect.width<=canvas.width&&rect.height<=canvas.height);
 assert(Math.abs(rect.x*2+rect.width-canvas.width)<1e-9);assert(Math.abs(rect.y*2+rect.height-canvas.height)<1e-9);
 const ctx=canvas.getContext('2d'),pixel=(x,y)=>ctx.getImageData(x,y,1,1).data[3];
 assert.equal(pixel(Math.floor(canvas.width/2),Math.floor(canvas.height/2)),255);
 if(rect.x>2)assert.equal(pixel(0,Math.floor(canvas.height/2)),0);
 if(rect.y>2)assert.equal(pixel(Math.floor(canvas.width/2),0),0);
 if(dest)fs.writeFileSync(`${dest}/${key}-${w}x${h}.png`,canvas.toBuffer('image/png'));
}
console.log('PASS full portrait, event and weather atlas cells preserve their ratio in thirty wide and tall frames, with centred letterboxing');

const {createHash}=await import('node:crypto'),{OFFICER_ROSTER}=await import('../mjs/officer-roster.mjs'),{portraitFrame}=await import('../mjs/portraits.mjs');
const historicSheet=await loadImage('assets/officers-historic-v29.webp');
const officerSheets=await Promise.all(Array.from({length:22},(_,i)=>loadImage(`assets/officers${i}.webp`))),hashes=new Set;
for(const officer of OFFICER_ROSTER){const {atlas,cell}=portraitFrame(officer),im=atlas==='officersHistoric'?historicSheet:officerSheets[Number(atlas.slice(8))];assert(im);const canvas=createCanvas(1,1);canvas.getBoundingClientRect=()=>({width:93,height:51});const rect=paintAtlas(canvas,im,4,4,cell,2);assert(Math.abs(rect.width/rect.height-im.width/im.height)<1e-9);assert.equal(canvas.getContext('2d').getImageData(Math.floor(canvas.width/2),Math.floor(canvas.height/2),1,1).data[3],255);const face=createCanvas(128,128),ctx=face.getContext('2d'),w=im.width/4,h=im.height/4;ctx.drawImage(im,cell%4*w,Math.floor(cell/4)*h,w,h,0,0,128,128);const hash=createHash('sha256').update(ctx.getImageData(0,0,128,128).data).digest('hex');assert(!hashes.has(hash),`Duplicate face for ${officer.name}`);hashes.add(hash);}
assert.equal(hashes.size,352);console.log('PASS all 352 officer cells contain distinct raster images and retain their ratio in the battle portrait frame');

const v9={launch:[1,1],terrain:[4,2],army:[4,2],'china-relief':[1,1],capitals:[4,2]};
for(const [key,[columns,rows]] of Object.entries(v9)){
 const image=await loadImage(`assets/${key}-v9.webp`),alpha=key==='army'||key==='capitals',frames=new Set;
 for(let cell=0;cell<columns*rows;cell++)for(const [width,height] of [[115,51],[590,393]]){
  const canvas=createCanvas(1,1);canvas.getBoundingClientRect=()=>({width,height});const rect=paintAtlas(canvas,image,columns,rows,cell,1.5),ratio=image.width/columns/(image.height/rows);
  assert(Math.abs(rect.width/rect.height-ratio)<1e-9,`${key} frame ${cell} must scale uniformly`);
  const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;assert(pixels.some((v,i)=>i%4===3&&v>0),`${key} frame ${cell} must contain visible artwork`);
  if(alpha){const sw=image.width/columns,sh=image.height/rows,cellCanvas=createCanvas(96,96),ctx=cellCanvas.getContext('2d');ctx.drawImage(image,cell%columns*sw,Math.floor(cell/columns)*sh,sw,sh,0,0,96,96);const pixel=ctx.getImageData(0,0,96,96).data;assert(pixel.some((v,i)=>i%4===3&&v===0),`${key} retains transparency`);if(width===115)frames.add(createHash('sha256').update(pixel).digest('hex'));}
  if(dest&&cell===0)fs.writeFileSync(`${dest}/v9-${key}-${width}x${height}.png`,canvas.toBuffer('image/png'));
 }
 if(alpha)assert.equal(frames.size,8,`${key} cells are different poses/capitals`);
}
console.log('PASS five new full-dimension artworks and every formation/capital cell scale uniformly; all eight frames retain alpha and distinct content');

const courier=await loadImage('assets/courier.webp'),courierFrames=new Set;
for(let cell=0;cell<4;cell++){const canvas=createCanvas(1,1);canvas.getBoundingClientRect=()=>({width:170,height:95});const rect=paintAtlas(canvas,courier,4,1,cell,1.5);assert(Math.abs(rect.width/rect.height-courier.width/4/courier.height)<1e-9);const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;assert(pixels.some((v,i)=>i%4===3&&v>0));assert(pixels.some((v,i)=>i%4===3&&v===0));courierFrames.add(createHash('sha256').update(pixels).digest('hex'));}assert.equal(courierFrames.size,4);console.log('PASS four transparent mounted courier poses remain distinct and preserve the native frame ratio');
