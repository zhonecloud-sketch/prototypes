export const REGIONS=[['Youzhou','幽州'],['Bingzhou','并州'],['Jizhou','冀州'],['Qingzhou','青州'],['Yanzhou','兗州'],['Sili','司隸'],['Yongzhou','雍州'],['Liangzhou','涼州'],['Xuzhou','徐州'],['Yuzhou','豫州'],['Jingzhou','荊州'],['Yangzhou','揚州'],['Yizhou','益州'],['Jiaozhou','交州']];
export function regionName(p,year=189){let index=p.region;if(p.id===12&&year<213)index=5;if(p.id===13&&year<213)index=7;if(p.region===13&&year<203)return ['Jiaozhi circuit','交趾部'];return REGIONS[index];}
export function provinceLabel(p,year=189,chinese=false){const region=regionName(p,year);const seat=p.id===25&&year>=211?(chinese?'建業':'Jianye'):(chinese?p.seatZh:p.seat);return chinese?`${seat} · ${region[1]}`:`${seat} · ${region[0]}`;}
export function applyGeography(state){for(const p of state.provinces){const region=regionName(p,state.year);p.name=p.id===25&&state.year>=211?'Jianye':p.seat||p.name;p.zh=(p.id===25&&state.year>=211?'建業':p.seatZh||p.zh.split(' · ')[0])+' · '+region[1];}}
export function project(lon,lat){return {x:(lon-111.5)*3.2,z:(33.5-lat)*3.7};}
export const pointFor=p=>p.geo?project(...p.geo):{x:(p.x-3.5)*12,z:(p.y-4)*11+(p.x%2)*5.5};
// Use the DOS sector coordinates, not the remaster's historical seat locations.
export function provinceDirection(from,to){
 if(!from.neighbors.includes(to.id))throw Error('These provinces are not connected in the original map.');
 const offsets=[[-1,(from.x&1)?0:-1],[0,-1],[1,(from.x&1)?0:-1],[-1,(from.x&1)?1:0],[0,1],[1,(from.x&1)?1:0]];
 const i=offsets.findIndex(([x,y])=>to.x===from.x+x&&to.y===from.y+y);
 if(i<0)throw Error('The original province connection has no direction.');
 return i;
}
export function insideLand(x,z,map){const lon=x/3.2+111.5,lat=33.5-z/3.7;for(const poly of map.land){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>lat)!==(yj>lat)&&lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)inside=!inside;}if(inside)return true;}return false;}
