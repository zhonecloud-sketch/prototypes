// Never persist a sentinel; browsers release it when the page loses visibility.
export function createScreenWakeLock({navigator,document,onChange=()=>{}}){
 let enabled=false,lock=null,pending=null;
 const visible=()=>document.visibilityState!=='hidden';
 const status=message=>onChange(message);
 async function sync(){
  if(!enabled||!visible()){
   if(lock){const old=lock;lock=null;await old.release().catch(()=>{});}
   status(enabled?'Screen awake resumes when the game is visible.':'Screen dimming allowed.');return;
  }
  if(!navigator?.wakeLock?.request){status('Screen wake lock is unavailable in this browser.');return;}
  if(lock&&!lock.released){status('Screen kept awake.');return;}
  if(pending)return pending;
  pending=(async()=>{try{
   const acquired=await navigator.wakeLock.request('screen');
   if(!enabled||!visible()){await acquired.release();return;}
   lock=acquired;acquired.addEventListener('release',()=>{if(lock===acquired){lock=null;status('Screen wake lock released by the device; tap to retry.');}});
   status('Screen kept awake.');
  }catch{status('Screen wake lock was declined; tap to retry.');}finally{pending=null;}})();
  return pending;
 }
 return {setEnabled(value){enabled=!!value;return sync();},get active(){return !!lock&&!lock.released;}};
}
