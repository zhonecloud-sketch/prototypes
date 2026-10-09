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
 const observed=new Set(),paint=node=>{const key=node.dataset.atlas;if(!assets[key])return;paintAtlas(node,assets[key],['launch','triumph','clan','heir'].includes(key)?1:key==='courier'?4:key==='history'||key==='portraits'||key.startsWith('officers')?4:2,['launch','triumph','clan','heir'].includes(key)||key==='courier'?1:key==='history'||key==='portraits'||key.startsWith('officers')?4:2,Number(node.dataset.cell)||0,Math.min(globalThis.devicePixelRatio||1,2));};
 const observer=new ResizeObserver(entries=>{for(const entry of entries||[])paint(entry.target);});
 return {refresh(){for(const node of observed)if(!node.isConnected){observer.unobserve?.(node);observed.delete(node);}for(const node of document.querySelectorAll('canvas[data-atlas]')){paint(node);if(!observed.has(node)){observed.add(node);observer.observe(node);}}}};
}
