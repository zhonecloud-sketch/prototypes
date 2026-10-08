export const MESSAGE_SPEEDS=[[3000,'Slow'],[2000,'Normal'],[1000,'Fast'],[500,'Very Fast']];
export const messageDuration=state=>MESSAGE_SPEEDS.some(([n])=>n===state?.settings?.messageSpeed)?state.settings.messageSpeed:2000;
// One queue owns one timer. Pausing retains unread time; cancellation invalidates stale callbacks.
export function createMessagePlayer({show,hide=()=>{},duration=()=>2000,onIdle=()=>{},clock={now:()=>performance.now(),setTimeout:(fn,ms)=>setTimeout(fn,ms),clearTimeout:id=>clearTimeout(id)}}){
 let queue=[],current=null,timer=null,remaining=0,total=0,started=0,paused=false,generation=0;
 const cancel=()=>{if(timer!==null)clock.clearTimeout(timer);timer=null;generation++;};
 const arm=()=>{if(!current||paused||timer!==null)return;started=clock.now();const token=++generation;timer=clock.setTimeout(()=>{if(token!==generation)return;timer=null;const item=current;current=null;hide(item);item.onDone?.();next();},remaining);};
 const next=()=>{if(current||!queue.length){if(!current&&!queue.length)onIdle();return;}current=queue.shift();total=remaining=duration();show(current);arm();};
 return {enqueue(item){queue.push(typeof item==='string'?{text:item}:item);next();},pause(){if(paused)return;paused=true;if(timer!==null)remaining=Math.max(0,remaining-(clock.now()-started));cancel();},resume(){paused=false;arm();},clear(){cancel();queue=[];if(current)hide(current);current=null;},retime(){if(!current)return;const elapsed=total-remaining+(timer!==null?clock.now()-started:0);cancel();total=duration();remaining=Math.max(0,total-elapsed);arm();},get busy(){return !!current||queue.length>0;},get active(){return current;}};
}

// Atomic order rejection can replace state with a clone. Compare log content, not object identity.
export function newLogEntries(before,after){
 const key=x=>JSON.stringify([x.year,x.month,x.turn,x.type,x.text]),counts=new Map;
 for(const x of before)counts.set(key(x),(counts.get(key(x))||0)+1);
 return after.filter(x=>{const k=key(x),n=counts.get(k)||0;if(n){counts.set(k,n-1);return false;}return true;}).reverse();
}
