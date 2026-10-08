// Range controls never summon a handset keyboard. The slider handles large changes;
// the step buttons preserve the order's exact integer unit, including at its bounds.
export function enhanceNumericControls(root){
 for(const input of root.querySelectorAll('input[type="number"],input[type="range"]')){
  if(input.type==='number'){input.type='range';input.removeAttribute('inputmode');}
  if(input._quantityControl){input._quantityControl.sync();continue;}
  input.classList.add('quantity-slider');
  const bar=document.createElement('div');bar.className='quantity-adjustment';
  const labelNode=document.querySelector(`label[for="${input.id}"]`),labelBase=labelNode?.childElementCount===0?labelNode.textContent.replace(/\s*\(\d+[–-]\d+\)\s*$/,''):null;
  const label=root.ownerDocument?.querySelector(`label[for="${input.id}"]`)?.textContent||document.querySelector(`label[for="${input.id}"]`)?.textContent||input.name||'Quantity';
  bar.setAttribute('role','group');bar.setAttribute('aria-label',label+' adjustment');
  const output=document.createElement('output');output.className='quantity-value';output.htmlFor=input.id;output.setAttribute('aria-live','polite');
  const make=(text,title)=>{const button=document.createElement('button');button.type='button';button.textContent=text;button.setAttribute('aria-label',title+' '+label);bar.append(button);return button;};
  const min=make('Min','Minimum'),down=make('−','Decrease');bar.append(output);const up=make('+','Increase'),max=make('Max','Maximum');input.after(bar);
  let timer=null,repeat=null,held=false,skipClick=false;
  const bounds=()=>({min:Number(input.min||0),max:Math.max(Number(input.min||0),Number(input.max||100)),step:Math.max(1,Number(input.step)||1)});
  const sync=()=>{const b=bounds(),value=Number(input.value),text=value.toLocaleString('en-GB');if(output.textContent!==text)output.textContent=text;if(labelBase!==null){const caption=labelBase+' ('+b.min.toLocaleString('en-GB')+'–'+b.max.toLocaleString('en-GB')+')';if(labelNode.textContent!==caption)labelNode.textContent=caption;}min.title='Minimum: '+b.min.toLocaleString('en-GB');max.title='Maximum: '+b.max.toLocaleString('en-GB');input.setAttribute('aria-valuetext',text);down.disabled=min.disabled=input.disabled||value<=b.min;up.disabled=max.disabled=input.disabled||value>=b.max;};
  const set=value=>{const b=bounds();input.value=String(Math.min(b.max,Math.max(b.min,value)));sync();input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));};
  const step=direction=>set(Number(input.value)+direction*bounds().step);
  const stop=()=>{clearTimeout(timer);clearInterval(repeat);timer=repeat=null;if(held)skipClick=true;held=false;};
  min.onclick=()=>set(bounds().min);max.onclick=()=>set(bounds().max);
  for(const [button,direction]of [[down,-1],[up,1]]){
   button.onclick=()=>{if(skipClick){skipClick=false;return;}step(direction);};
   button.onpointerdown=e=>{if(e.button!==undefined&&e.button!==0||button.disabled)return;skipClick=false;button.setPointerCapture?.(e.pointerId);timer=setTimeout(()=>{held=true;step(direction);repeat=setInterval(()=>{if(!input.isConnected){stop();return;}step(direction);},100);},400);};
   button.onpointerup=stop;button.onpointercancel=()=>{stop();skipClick=false;};button.onlostpointercapture=stop;button.onblur=stop;
  }
  input.addEventListener('input',sync);input.addEventListener('change',sync);
  const observer=new window.MutationObserver(sync);observer.observe(input,{attributes:true,attributeFilter:['min','max','step','disabled','value']});
  input._quantityControl={sync};sync();
 }
}

// Custom ruler names are the only remaining free text. A collapsible game-native
// letter pad preserves naming without opening the operating system keyboard.
export function enhanceTextControls(root){
 for(const input of root.querySelectorAll('input:not([type]),input[type="text"],input[type="search"]')){
  if(input.dataset.touchText==='true')continue;input.dataset.touchText='true';input.readOnly=true;input.setAttribute('inputmode','none');input.classList.add('touch-text-field');
  const pad=document.createElement('div');pad.className='name-letter-pad';pad.hidden=true;pad.setAttribute('role','group');pad.setAttribute('aria-label','Enter '+(input.id==='customFollower'?'follower':'ruler')+' name');input.after(pad);
  const change=text=>{input.value=text.slice(0,input.maxLength>0?input.maxLength:24);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));};
  for(const key of [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ','Space','⌫','Clear','Done']){const button=document.createElement('button');button.type='button';button.textContent=key;button.setAttribute('aria-label',key==='⌫'?'Delete last letter':key);button.onclick=()=>{if(key==='Done'){pad.hidden=true;return;}if(key==='Clear'){change('');return;}if(key==='⌫'){change(input.value.slice(0,-1));return;}const letter=key==='Space'?' ':input.value.length===0||input.value.endsWith(' ')?key:key.toLowerCase();change(input.value+letter);};pad.append(button);}
  input.addEventListener('click',()=>{for(const other of root.querySelectorAll('.name-letter-pad'))if(other!==pad)other.hidden=true;pad.hidden=!pad.hidden;});
 }
}
