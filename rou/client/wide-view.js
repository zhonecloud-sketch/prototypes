export function refreshWideView() {
  const active=!!document.fullscreenElement;
  if(!active)document.documentElement.style.removeProperty('--default-desktop-scale');
  document.querySelectorAll('[data-wide-view],[data-account-wide],#wideView').forEach(button=>{
    const label=active?'Default view ↙':'Wide view ↗';
    button.hidden=false;if(button.textContent!==label)button.textContent=label;
    button.setAttribute('aria-pressed',String(active));
  });
}
export async function toggleWideView() {
  if(document.fullscreenElement){await document.exitFullscreen();screen.orientation?.unlock?.();}
  else {
    const root=document.documentElement;
    // Keep text and controls at their Default-view size; expand the game surface.
    if(root.classList.contains('phone-layout'))root.style.setProperty('--default-desktop-scale',getComputedStyle(root).getPropertyValue('--desktop-scale'));
    await root.requestFullscreen();try{await screen.orientation?.lock?.('landscape');}catch{}
  }
  refreshWideView();
}
document.addEventListener('fullscreenchange',refreshWideView);
new MutationObserver(refreshWideView).observe(document.body,{childList:true,subtree:true});
