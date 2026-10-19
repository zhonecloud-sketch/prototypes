export function refreshWideView() {
  const active=!!document.fullscreenElement;
  document.querySelectorAll('[data-wide-view],[data-account-wide],#wideView').forEach(button=>{
    const label=active?'Default view ↙':'Wide view ↗';
    button.hidden=false;if(button.textContent!==label)button.textContent=label;
    button.setAttribute('aria-pressed',String(active));
  });
}
export async function toggleWideView() {
  if(document.fullscreenElement){await document.exitFullscreen();screen.orientation?.unlock?.();}
  else {await document.documentElement.requestFullscreen();try{await screen.orientation?.lock?.('landscape');}catch{}}
  refreshWideView();
}
document.addEventListener('fullscreenchange',refreshWideView);
new MutationObserver(refreshWideView).observe(document.body,{childList:true,subtree:true});
