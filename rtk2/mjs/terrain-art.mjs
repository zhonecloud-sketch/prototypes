import {terrainVariant} from './terrain-mask.mjs';
import {tilePoint} from './battle.mjs';

const SIZE=256,RADIUS=128,NORMALS=[7*Math.PI/6,3*Math.PI/2,11*Math.PI/6,5*Math.PI/6,Math.PI/2,Math.PI/6];
const textureKind=kind=>kind===5||kind===6?0:kind;
const outside=kind=>kind===9||kind===99||kind===undefined;
export function createTerrainPainter(atlas){
 const cache=new Map(),textures=new Map();
 function canvas(size){const c=document.createElement('canvas');c.width=c.height=size;return c;}
 function texture(kind){
  if(textures.has(kind))return textures.get(kind);
  const c=canvas(512),ctx=c.getContext('2d'),sw=atlas.width/4,sh=atlas.height/2,index=textureKind(kind);
  // Mirrored repeats join without a colour seam. Both source and destination cells are square.
  for(let y=0;y<2;y++)for(let x=0;x<2;x++){ctx.save();ctx.translate(x?512:0,y?512:0);ctx.scale(x?-1:1,y?-1:1);ctx.drawImage(atlas,index%4*sw,Math.floor(index/4)*sh,sw,sh,0,0,256,256);ctx.restore();}
  textures.set(kind,c);return c;
 }
 function paintTexture(ctx,kind,origin){
  ctx.save();ctx.translate(128-origin.x,128-origin.z);ctx.fillStyle=ctx.createPattern(texture(kind).getContext('2d').canvas,'repeat');ctx.fillRect(origin.x-128,origin.z-128,256,256);ctx.restore();
 }
 function tile(tiles,q,r){
  const variant=terrainVariant(tiles,q,r),key=variant.key+':'+q+','+r;
  if(cache.has(key))return cache.get(key);
  const c=canvas(SIZE),ctx=c.getContext('2d'),point=tilePoint(q,r),origin={x:point.x*128,z:point.z*128},kind=textureKind(variant.kind);
  paintTexture(ctx,kind,origin);
  // A six-bit mask removes transitions inside connected terrain. Different neighbours blend
  // at the shared edge, using world-aligned sampling rather than one repeated picture per hex.
  for(const d of variant.edges){
   const neighbor=variant.neighbors[d];if(outside(neighbor)||textureKind(neighbor)===kind)continue;
   const layer=canvas(SIZE),lc=layer.getContext('2d'),angle=NORMALS[d],nx=Math.cos(angle),ny=Math.sin(angle),edge=RADIUS*Math.cos(Math.PI/6),depth=kind===4||neighbor===4?27:48;
   paintTexture(lc,neighbor,origin);
   const mask=lc.createLinearGradient(128+nx*(edge-depth),128+ny*(edge-depth),128+nx*edge,128+ny*edge);
   mask.addColorStop(0,'#0000');mask.addColorStop(.55,'#00000020');mask.addColorStop(1,'#00000080');
   lc.globalCompositeOperation='destination-in';lc.fillStyle=mask;lc.fillRect(0,0,SIZE,SIZE);ctx.drawImage(layer,0,0);
   if(kind===4){
    // Banks follow only non-water neighbours; river interiors have no decorative outlines.
    const a=angle-Math.PI/6,b=angle+Math.PI/6,inset=RADIUS-9;
    ctx.beginPath();ctx.moveTo(128+Math.cos(a)*inset,128+Math.sin(a)*inset);ctx.quadraticCurveTo(128+nx*(edge-12),128+ny*(edge-12),128+Math.cos(b)*inset,128+Math.sin(b)*inset);
    ctx.strokeStyle='#c1b88b80';ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle='#bed5ca70';ctx.lineWidth=1.5;ctx.stroke();
   }
  }
  if(variant.kind===5||variant.kind===6){const sw=atlas.width/4,sh=atlas.height/2;ctx.drawImage(atlas,variant.kind%4*sw,Math.floor(variant.kind/4)*sh,sw,sh,0,0,256,256);}
  cache.set(key,c);return c;
 }
 return {tile,get size(){return cache.size;}};
}
