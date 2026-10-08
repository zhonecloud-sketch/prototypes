import {direction} from './battle.mjs?v=18';

// Six bits use the same direction ordering as movement and deployment.
export function terrainMask(tiles,q,r){
 const kind=tiles[r*13+q];let mask=0;
 for(let d=0;d<6;d++){const n=direction(q,r,d);if(n.q>=0&&n.q<13&&n.r>=0&&n.r<12&&tiles[n.r*13+n.q]===kind)mask|=1<<d;}
 return mask;
}
export function terrainEdges(mask){return Array.from({length:6},(_,d)=>d).filter(d=>!(mask&(1<<d)));}
export function terrainVariant(tiles,q,r){const kind=tiles[r*13+q],mask=terrainMask(tiles,q,r),neighbors=Array.from({length:6},(_,d)=>{const n=direction(q,r,d);return n.q>=0&&n.q<13&&n.r>=0&&n.r<12?tiles[n.r*13+n.q]:99;});return {kind,mask,neighbors,key:kind+':'+mask+':'+neighbors.join(','),edges:terrainEdges(mask)};}
export const NORTHERN_PROVINCES=[1,2,3,4,15];
export const ownershipNorth=p=>NORTHERN_PROVINCES.includes(p.id)?p.z-12:null;

// A clipped Voronoi cell assigns the visible land around each city to its owner.
export function ownershipCells(points,bounds=[-72,-64,72,80]){
 const [l,t,r,b]=bounds;
 return points.map(p=>{let poly=[{x:l,z:t},{x:r,z:t},{x:r,z:b},{x:l,z:b}];
  for(const other of points){if(other===p)continue;const dx=other.x-p.x,dz=other.z-p.z,k=(other.x*other.x+other.z*other.z-p.x*p.x-p.z*p.z)/2;const next=[];
   for(let i=0;i<poly.length;i++){const a=poly[i],v=poly[(i+1)%poly.length],fa=a.x*dx+a.z*dz-k,fv=v.x*dx+v.z*dz-k;if(fa<=0)next.push(a);if((fa<=0)!==(fv<=0)){const u=fa/(fa-fv);next.push({x:a.x+(v.x-a.x)*u,z:a.z+(v.z-a.z)*u});}}
   poly=next;if(!poly.length)break;
  }
  const north=ownershipNorth(p);if(north!==null){const next=[];for(let i=0;i<poly.length;i++){const a=poly[i],v=poly[(i+1)%poly.length];if(a.z>=north)next.push(a);if((a.z>=north)!==(v.z>=north)){const u=(north-a.z)/(v.z-a.z);next.push({x:a.x+(v.x-a.x)*u,z:north});}}poly=next;}return poly;
 });
}

// Keep every numbered seal visible. Leaders retain the exact city location.
export function layoutCityBadges(anchors,width,height,size=22){
 const placed=[],result=new Map(),step=size+3,pad=size/2+3;
 const overlaps=(a,b)=>Math.abs(a.x-b.x)<size+2&&Math.abs(a.y-b.y)<size+2;
 const reserved=[{left:0,top:0,right:118,bottom:86},{left:width-70,top:0,right:width,bottom:54}];
 for(const anchor of [...anchors].sort((a,b)=>(b.priority||0)-(a.priority||0)||a.id-b.id)){
  let best=null;
  for(let dy=-7;dy<=3;dy++)for(let dx=-7;dx<=7;dx++){
   const p={x:Math.max(pad,Math.min(width-pad,anchor.x+dx*step)),y:Math.max(pad,Math.min(height-76,anchor.y+dy*step))};
   if(placed.some(q=>overlaps(p,q))||reserved.some(r=>p.x+size/2>r.left&&p.x-size/2<r.right&&p.y+size/2>r.top&&p.y-size/2<r.bottom))continue;
   const cost=(p.x-anchor.x)**2+(p.y-anchor.y)**2+(dy>0?1200:0);
   if(!best||cost<best.cost)best={...p,cost};
  }
  const p=best||{x:anchor.x,y:anchor.y};placed.push(p);result.set(anchor.id,p);
 }return result;
}
