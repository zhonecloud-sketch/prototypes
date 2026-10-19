// Keep the active field and navigation above the native keyboard. This editor
// is outside the rotated game surface so keyboard coordinates stay native.
export function installMobileEntry(){
  const dialog=document.createElement('dialog');dialog.id='mobileEntry';document.body.append(dialog);
  let original=null;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const resize=()=>dialog.style.setProperty('--entry-height',`${visualViewport?.height||innerHeight}px`);
  visualViewport?.addEventListener('resize',resize);resize();
  function apply(){if(!original)return;const input=dialog.querySelector('input');if(input){original.value=input.value;original.dispatchEvent(new Event('input',{bubbles:true}));original.dispatchEvent(new Event('change',{bubbles:true}));}dialog.close();}
  function open(input){
    original=input;const label=input.labels?.[0]?.childNodes?.[0]?.textContent?.trim()||input.getAttribute('aria-label')||'Enter value';
    dialog.innerHTML=`<header><strong>${escape(label)}</strong><button type="button" data-cancel>Cancel</button></header><div class="entry-content"></div><footer><button type="button" data-next>Next field →</button><button type="button" data-done>Done ✓</button></footer>`;
    const content=dialog.querySelector('.entry-content');
    if(input.tagName==='SELECT'){
      dialog.querySelector('footer').hidden=true;
      content.innerHTML=Array.from(input.options).map(o=>`<button type="button" data-value="${escape(o.value)}" ${o.disabled?'disabled':''}>${escape(o.text)}${o.selected?' ✓':''}</button>`).join('');
      content.onclick=e=>{const b=e.target.closest('[data-value]');if(b){input.value=b.dataset.value;input.dispatchEvent(new Event('change',{bubbles:true}));dialog.close();}};
    }else{
      const edit=input.cloneNode(false);edit.removeAttribute('id');edit.removeAttribute('name');edit.removeAttribute('readonly');edit.value=input.value;edit.setAttribute('aria-label',label);edit.autofocus=true;content.append(edit);
      edit.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply();}});
    }
    dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.querySelector('[data-done]').onclick=apply;
    dialog.querySelector('[data-next]').onclick=()=>{const list=Array.from((input.form||input.closest('dialog')||document).querySelectorAll('input,select')).filter(e=>!e.disabled&&!e.readOnly&&!e.hidden&&!['checkbox','hidden','file','radio'].includes(e.type)&&e.getBoundingClientRect().width);const next=list[list.indexOf(input)+1];apply();if(next)open(next);};
    resize();dialog.showModal();dialog.querySelector('input')?.focus();
  }
  document.addEventListener('pointerdown',e=>{
    if(!(matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)))return;
    const input=e.target.closest('input,select');
    if(!input||input.closest('#mobileEntry')||input.disabled||input.readOnly||['checkbox','radio','file','range','hidden','button','submit'].includes(input.type))return;
    e.preventDefault();open(input);
  },true);
}
