import {buildPathBank} from './wheel-path-bank.js';
let generation=0,geometry;
self.onmessage=async({data})=>{
  if(data.kind==='geometry'){geometry=data.geometry;return;}
  const mine=++generation;
  if(data.kind==='cancel')return;
  try{
    const stats=await buildPathBank(geometry,data.motion,{
      cancelled:()=>mine!==generation,
      onPath:path=>{if(mine===generation)self.postMessage({key:data.key,path},[path.points.buffer]);}
    });
    if(mine===generation)self.postMessage({key:data.key,stats});
  }catch(error){if(mine===generation)self.postMessage({key:data.key,error:error.message});}
};
