import {personalCombatFrame} from './personal-combat.mjs?v=60';
import {paintAtlas} from './artwork.mjs?v=57';

// Playback consumes only the recorded trace. It never mutates game state/RNG.
export function createPersonalCombatPresentation(root,assets,elapsed,chinese,roundMs){
 const panel=document.createElement('section');panel.id='personalCombat';panel.hidden=true;panel.setAttribute('aria-label','Personal combat');root.append(panel);let token=0;
 const title=document.createElement('h2'),canvas=document.createElement('canvas'),copy=document.createElement('p'),cards=document.createElement('div');canvas.className='personal-combat-art';cards.className='personal-combat-generals';copy.className='personal-combat-copy';panel.append(title,cards,canvas,copy);
 function hide(){token++;panel.hidden=true;}
 function show(item){
  hide();const combat=item.personalCombat;if(!combat)return;panel.hidden=false;panel.dataset.stage=combat.stage;copy.textContent=item.text;title.textContent={challenge:'Personal combat challenge',combat:'Personal combat',win:'Initiator victorious',loss:'Initiator defeated',draw:'Personal combat drawn'}[combat.stage];cards.replaceChildren();
  const nodes=combat.fighters.map(f=>{const card=document.createElement('div');card.className='personal-combat-general '+f.side;card.dataset.side=f.side;const label=document.createElement('small'),name=document.createElement('strong'),ruler=document.createElement('span'),counter=document.createElement('output'),bar=document.createElement('progress');label.textContent=f.side==='defend'?'Defender':'Attacker';name.textContent=chinese()?(f.zh||f.name):f.name;ruler.textContent=chinese()?(f.rulerZh||f.ruler):f.ruler;counter.textContent='WAR '+f.war;counter.setAttribute('aria-label',f.side+' combat strength');bar.max=Math.max(1,f.war);bar.value=f.war;bar.hidden=combat.stage!=='combat';card.append(label,name,ruler,counter,bar);cards.append(card);return {f,bar,counter};});
  if(combat.stage!=='combat'){const key='personalCombat'+(combat.stage==='draw'?'Challenge':combat.stage[0].toUpperCase()+combat.stage.slice(1));paintAtlas(canvas,assets[key],1,1,0,Math.min(globalThis.devicePixelRatio||1,2));return;}
  paintAtlas(canvas,assets.personalCombatClose1,1,1,0,Math.min(globalThis.devicePixelRatio||1,2));
  const generation=token,draw=()=>{if(generation!==token)return;const frame=personalCombatFrame(combat.duel,elapsed(),roundMs());
   for(const {f,bar,counter}of nodes){const value=frame.strength[f.side];counter.textContent=value+' / '+f.war;counter.dataset.strength=value;bar.value=value;}panel.dataset.round=frame.round;requestAnimationFrame(draw);};draw();
 }
 return {show,hide,destroy(){hide();panel.remove();}};
}
