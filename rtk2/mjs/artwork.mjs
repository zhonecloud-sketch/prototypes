import {historyArtworkFile} from './history-art.mjs?v=54';
// Draw an atlas cell with one scale factor, centred in its available frame.
export function containRect(sourceWidth, sourceHeight, width, height) {
 const scale=Math.min(width/sourceWidth,height/sourceHeight);
 const w=sourceWidth*scale,h=sourceHeight*scale;
 return {x:(width-w)/2,y:(height-h)/2,width:w,height:h};
}
export function paintAtlas(canvas, image, columns, rows, cell, pixelRatio=1) {
 const frame=canvas.getBoundingClientRect(),width=Math.max(1,frame.width),height=Math.max(1,frame.height);
 canvas.width=Math.round(width*pixelRatio);canvas.height=Math.round(height*pixelRatio);
 const ctx=canvas.getContext('2d'),sw=image.width/columns,sh=image.height/rows;
 const rect=containRect(sw,sh,canvas.width,canvas.height);
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(image,cell%columns*sw,Math.floor(cell/columns)*sh,sw,sh,rect.x,rect.y,rect.width,rect.height);
 return rect;
}
export function createArtwork(assets) {
 const observed=new Set(),pending=new Set(),recent=[];
 const paint=node=>{
  const key=node.dataset.atlas,file=historyArtworkFile(key);
  if(file&&!assets[key]&&!pending.has(key)){
   pending.add(key);const image=new Image();
   image.onload=()=>{pending.delete(key);assets[key]=image;recent.push(key);while(recent.length>4){const old=recent.shift();if(![...observed].some(n=>n.isConnected&&n.dataset.atlas===old))delete assets[old];}for(const n of document.querySelectorAll('canvas[data-atlas]'))if(n.dataset.atlas===key)paint(n);};
   image.onerror=()=>{pending.delete(key);};image.src=file;
  }
  if(!assets[key])return;
  const single=['launch','triumph','clan','heir'].includes(key)||!!file;
  const columns=single?1:key==='courier'?4:key==='history'||key==='portraits'||key.startsWith('officers')?4:2;
  const rows=single||key==='courier'?1:key==='history'||key==='portraits'||key.startsWith('officers')?4:2;
  paintAtlas(node,assets[key],columns,rows,Number(node.dataset.cell)||0,Math.min(globalThis.devicePixelRatio||1,2));
 };
 const observer=new ResizeObserver(entries=>{for(const entry of entries||[])paint(entry.target);});
 return {refresh(){for(const node of observed)if(!node.isConnected){observer.unobserve?.(node);observed.delete(node);}for(const node of document.querySelectorAll('canvas[data-atlas]')){paint(node);if(!observed.has(node)){observed.add(node);observer.observe(node);}}}};
}
