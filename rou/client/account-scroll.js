// Default view keeps the account inside the scaled, sometimes rotated frame.
// Handle its finger swipes in that frame's coordinates instead of relying on
// the browser to pan a transformed, nested scroll container.
export function installAccountScroll(page){
  const root=document.documentElement;
  let gesture=null,suppressClick=false;
  const nativeScroll=()=>!root.classList.contains('phone-layout')||!!document.fullscreenElement;
  page.addEventListener('touchstart',e=>{
    gesture=null;suppressClick=false;
    if(nativeScroll()||e.touches.length!==1)return;
    const content=e.target.closest('main');
    if(content?.parentElement!==page||content.scrollHeight<=content.clientHeight)return;
    const touch=e.touches[0],rotated=root.classList.contains('portrait-landscape'),rect=content.getBoundingClientRect();
    const scale=(rotated?rect.width:rect.height)/content.offsetHeight;
    if(!(scale>0))return;
    gesture={content,id:touch.identifier,x:touch.clientX,y:touch.clientY,top:content.scrollTop,rotated,scale,dragging:false};
  },{passive:true});
  page.addEventListener('touchmove',e=>{
    if(!gesture)return;
    if(nativeScroll()||e.touches.length!==1||!gesture.content.isConnected){gesture=null;return;}
    const touch=Array.from(e.touches).find(t=>t.identifier===gesture.id);
    if(!touch){gesture=null;return;}
    const delta=gesture.rotated?touch.clientX-gesture.x:gesture.y-touch.clientY;
    if(!gesture.dragging&&Math.abs(delta)<6)return;
    gesture.dragging=true;suppressClick=true;
    if(e.cancelable)e.preventDefault();
    const {content}=gesture;
    content.scrollTop=Math.max(0,Math.min(content.scrollHeight-content.clientHeight,gesture.top+delta/gesture.scale));
  },{passive:false});
  page.addEventListener('touchend',()=>{gesture=null;},{passive:true});
  page.addEventListener('touchcancel',()=>{gesture=null;suppressClick=false;},{passive:true});
  page.addEventListener('click',e=>{
    if(!suppressClick||e.detail===0||(e.pointerType&&e.pointerType!=='touch'))return;
    suppressClick=false;e.preventDefault();e.stopImmediatePropagation();
  },true);
}
