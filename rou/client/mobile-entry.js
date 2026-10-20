import {editEntry} from './entry-model.js?v=20261020-public2';
// Extends attk/mjs/numeric-controls.mjs's game-native letter pad.
// Buttons and a text output avoid opening the operating system keyboard.
export function installMobileEntry(){
  if(document.getElementById('mobileEntry'))return;
  const dialog=document.createElement('dialog');dialog.id='mobileEntry';dialog.setAttribute('aria-label','On-screen keyboard');document.body.append(dialog);
  let original=null,value='',caret=0,upper=false,symbols=false,reveal=false;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields=input=>Array.from((input.form||input.closest('dialog')||document).querySelectorAll('input,select')).filter(e=>!e.disabled&&!e.readOnly&&!e.hidden&&!['checkbox','radio','file','range','hidden','button','submit'].includes(e.type)&&e.getBoundingClientRect().width);
  function close(){dialog.close();dialog.innerHTML='';original=null;value='';caret=0;}
  function apply(next=false){
    if(!original?.isConnected){close();return;}
    const input=original,list=fields(input),following=list[list.indexOf(input)+1];
    input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close();
    if(next&&following)open(following);
  }
  function display(){
    const chars=Array.from(value),hide=original.type==='password'&&!reveal;
    const text=xs=>escape(hide?'•'.repeat(xs.length):xs.join(''));
    dialog.querySelector('[data-entry-value]').innerHTML=text(chars.slice(0,caret))+'<span class="entry-caret" aria-hidden="true">│</span>'+text(chars.slice(caret));
    dialog.querySelector('[data-count]').textContent=`${chars.length} characters`;
  }
  function change(key){({value,caret}=editEntry(value,caret,key,original.maxLength>0?original.maxLength:254));display();}
  function keys(){
    const rows=symbols?['1234567890','!@#$%^&*()','-_+=[]{}\\|',`;:'",.<>/?`,'`~']:['1234567890','qwertyuiop','asdfghjkl',"zxcvbnm@._-'"];
    dialog.querySelector('.entry-keys').innerHTML=rows.map(row=>`<div class="entry-row">${Array.from(row).map(c=>`<button type="button" data-character="${escape(upper?c.toUpperCase():c)}">${escape(upper?c.toUpperCase():c)}</button>`).join('')}</div>`).join('');
    dialog.querySelector('[data-key=Shift]').setAttribute('aria-pressed',String(upper));
    dialog.querySelector('[data-key=Symbols]').textContent=symbols?'ABC':'#+=';
  }
  function open(input){
    original=input;value=input.value;caret=Array.from(value).length;upper=false;symbols=input.type==='number';reveal=false;
    const label=input.labels?.[0]?.childNodes?.[0]?.textContent?.trim()||input.getAttribute('aria-label')||'Enter value';
    dialog.innerHTML=`<header><strong>${escape(label)}</strong><span data-count></span><button type="button" data-key="Cancel">Cancel</button><button type="button" data-key="Next">Next →</button><button type="button" data-key="Done">Done ✓</button></header><div class="entry-content"></div>`;
    const content=dialog.querySelector('.entry-content');
    if(input.tagName==='SELECT'){
      content.innerHTML=Array.from(input.options).map(o=>`<button type="button" data-value="${escape(o.value)}" ${o.disabled?'disabled':''}>${escape(o.text)}${o.selected?' ✓':''}</button>`).join('');
    }else{
      content.innerHTML=`<div class="entry-display"><output data-entry-value aria-label="${escape(label)} value"></output>${input.type==='password'?'<button type="button" data-key="Show">Show</button>':''}</div><div class="entry-keys"></div><footer><button type="button" data-key="Shift" aria-label="Uppercase letters">⇧</button><button type="button" data-key="Symbols">#+=</button><button type="button" data-key="Space">Space</button><button type="button" data-key="Left" aria-label="Move cursor left">←</button><button type="button" data-key="Right" aria-label="Move cursor right">→</button><button type="button" data-key="Backspace" aria-label="Delete previous character">⌫</button><button type="button" data-key="Clear">Clear</button></footer>`;
      keys();display();
    }
    if(!dialog.open)dialog.showModal();
    dialog.querySelector('button')?.focus({preventScroll:true});
  }
  dialog.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||!original)return;
    if(b.hasAttribute('data-value')){value=b.dataset.value;apply();return;}
    if(b.hasAttribute('data-character')){change(b.dataset.character);return;}
    const key=b.dataset.key;
    if(key==='Cancel')close();else if(key==='Done'||key==='Next')apply(key==='Next');
    else if(key==='Shift'){upper=!upper;keys();}
    else if(key==='Symbols'){symbols=!symbols;keys();}
    else if(key==='Show'){reveal=!reveal;b.textContent=reveal?'Hide':'Show';display();}
    else if(key)change(key);
  });
  dialog.addEventListener('keydown',e=>{
    if(!original||original.tagName==='SELECT')return;
    if(e.key==='Escape'){e.preventDefault();close();return;}
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.key==='Enter'){e.preventDefault();apply();return;}
    const key={ArrowLeft:'Left',ArrowRight:'Right',Backspace:'Backspace',Delete:'Delete'}[e.key];
    if(key||Array.from(e.key).length===1){e.preventDefault();change(key||e.key);}
  });
  dialog.addEventListener('paste',e=>{if(original&&original.tagName!=='SELECT'){e.preventDefault();change(e.clipboardData.getData('text'));}});
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  document.addEventListener('pointerdown',e=>{
    if(!(matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)))return;
    const input=e.target.closest('input,select');
    if(!input||input.closest('#mobileEntry')||input.disabled||input.readOnly||['checkbox','radio','file','range','hidden','button','submit'].includes(input.type))return;
    e.preventDefault();open(input);
  },true);
  document.addEventListener('click',e=>{if(e.target.closest('[data-open-keyboard]')){const first=document.querySelector('#accountPage input:not([readonly])');if(first)open(first);}});
}
