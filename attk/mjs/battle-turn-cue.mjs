// Transient presentation only: never changes orders, troops or saved battle state.
export function createBattleTurnCue({announce,highlight,frame=fn=>requestAnimationFrame(fn)}){
 let current=null,generation=0;
 const matches=(b,u)=>!!current&&current.battle===b&&current.side===b.side&&current.day===b.day&&current.unit===u?.id;
 return {begin(b,u,human){if(matches(b,u))return;const token=++generation;current={battle:b,side:b.side,day:b.day,unit:u.id,ready:false,highlighted:false};highlight(null);announce(u,human,()=>{if(token===generation&&matches(b,u))current.ready=true;});frame(()=>{if(token===generation&&matches(b,u)){current.highlighted=true;highlight(u.id);}});},ready(b,u){return matches(b,u)&&current.ready&&current.highlighted;},highlighted(b,u){return matches(b,u)&&current.highlighted;},clear(){generation++;current=null;highlight(null);}};
}
