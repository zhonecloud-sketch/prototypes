// main.exe's complete 16-entry effect table is catalogued in docs/native-audio-v50.json.
// Native music/effects are rendered from main.exe data through the supplied OPLDRV.
// User-selected sword/charge/courier recordings override their gameplay cues in v55.
export const NATIVE_EFFECT_COUNT=16;
export const NATIVE_MUSIC_COUNT=21;
// Native DS:3C4E, indexed by province region; battlefield adds five.
const regionMusic=[6,6,6,2,2,2,2,5,2,2,4,4,3,5];
export const nativeMusicFor=(theme,region,won=true)=>{if(theme==='triumph')return won?15:16;if(theme==='clan')return 14;const id=regionMusic[region]??2;return theme==='battle'?id+5:id;};
const customEffects=['order','fire','month','message','gallop','flood','locust','typhoon','epidemic','uprising','meteor','death','march','train','trade','recruit','retreat','charge-shout','sword-attack'];
const nativeName=id=>`native-effect-${id}`;
// User-supplied v55 recordings are kept byte-for-byte; native reference media remains archived.
const replacementFiles={'native-effect-9':'audiomass-charge_scream.mp3','sword-attack':'freesound_community-sword-battle-jingle-loop-96983.mp3','charge-shout':'audiomass-charge_scream.mp3',gallop:'audiomass-horse_gallop.mp3'};
const effectSource=name=>`./assets/sounds/${replacementFiles[name]||name+'.mp3'}${name.startsWith('native-effect-')&&!replacementFiles[name]?'?v=56':''}`;
export function orderSound(type,args={}){
 return nativeName(14);
}
export function eventSound(event){
 if(!event)return null;const kind=event.art||event.kind,text=event.text||'';
 if(kind==='prison')return nativeName(7);
 if(['order','council','diplomacy','message','treasure','marriage','birth'].includes(kind))return nativeName(14);
 if(typeof event.order==='string')return orderSound(event.order,event.args);
 // The original flood and typhoon deliberately share effect #2.
 const mapped={locust:0,epidemic:1,typhoon:2,flood:2,riot:3,meteor:4,rebellion:5,settlement:6,betrayal:7,duel:8,reinforcement:9};
 if(Object.hasOwn(mapped,kind))return nativeName(mapped[kind]);
 if(kind==='death'||kind==='clan')return 'death';
 if(/Yellow Turban|Yellow Turbans/.test(text))return nativeName(12);
 if(/started a rebellion|rebelled against|overthrown|overthrew/.test(text))return nativeName(5);
 if(/people are rioting|popular uprising/.test(text))return nativeName(3);
 if(/settled in|settled .*Province|settled .*province/.test(text))return nativeName(6);
 if(/switched sides|betrayed/.test(text))return nativeName(7);
 if(/joined your followers|joined .*service|recruited/.test(text))return 'recruit';
 if(['history','historic','treasure','marriage','birth','diplomacy','message'].includes(kind))return 'message';
 if(kind==='uprising')return 'uprising';
 if(['order','council'].includes(kind)){
  if(/train(?:ed|ing)|hired .*troops|soldiers hired|enlisted|recruited .*soldiers/i.test(text))return 'train';
  if(/bought|purchased|sold .*rice|sold .*food|sold .*weapons|merchant/i.test(text))return 'trade';
  if(/moved to|transferred|invaded|marched/i.test(text))return 'march';
  if(/recruit|found .*officer|found .*general|search(?:ed|ing) .*talent/i.test(text))return 'recruit';
  if(/alliance|treaty|diploma|messenger|spy|espionage|advi(?:ce|sed)/i.test(text))return 'message';
  if(/exile|withdraw|retreat/i.test(text))return 'retreat';
  return 'order';
 }
 return null;
}
export function battleSound(action){
 if(!action)return null;
 if(['fire','fireball'].includes(action.type))return 'fire';
 if(action.type==='reinforce')return nativeName(9);
 if(['move','moveEnemy','place','deploy'].includes(action.type))return 'march';
 if(['withdraw','withdrawArmy','retreat','flee'].includes(action.type))return 'retreat';
 if(['attack','simultaneous'].includes(action.type))return 'sword-attack';
 if(action.type==='charge')return 'charge-shout';
 if(action.type==='ambush')return nativeName(13);
 if(action.type==='challenge')return nativeName(8);
 if(['bribe','view'].includes(action.type))return 'message';
 return 'order';
}
export class AudioBus{
 constructor(){this.unlocked=false;this.sound=true;this.music=true;this.active=false;this.effects=new Set();this.theme='council';this.battlePlayed=new WeakMap();this.context=null;this.buffers=new Map();this.audioError=null;this.tracks=Object.fromEntries(['council','battle','triumph'].map(theme=>{const a=new Audio(theme==='council'?'./assets/music/council-music.mp3':theme==='battle'?'./assets/music/battle-music-v17.mp3':'./assets/music/triumph-music.mp3');a.loop=theme!=='triumph';a.volume=theme==='battle'?.24:.3;a.preload='auto';return [theme,a];}));this.track=this.tracks.council;this.notice=null;this.courierMoving=false;this.courierEffect=null;this.onVisibility=()=>this.sync();document.addEventListener('visibilitychange',this.onVisibility);this.onGesture=()=>{if(this.active&&this.sound)this.unlock();};document.addEventListener('pointerdown',this.onGesture,{passive:true});}
 configure(settings){this.sound=settings.sound!==false;this.music=settings.music!==false;this.sync();}
 unlock(){this.unlocked=true;const Context=globalThis.AudioContext||globalThis.webkitAudioContext;if(!this.context&&Context)try{this.context=new Context();}catch{}if(this.context){if(this.context.state==='suspended')this.context.resume()?.catch(()=>{});for(const name of ['sword-attack','charge-shout',nativeName(13),'fire','march','gallop'])this.loadEffect(name).catch(()=>{});}this.sync();}
 loadEffect(name){if(!this.buffers.has(name)){const promise=fetch(effectSource(name)).then(r=>{if(!r.ok)throw Error('Sound file could not load.');return r.arrayBuffer();}).then(data=>this.context.decodeAudioData(data));this.buffers.set(name,promise);promise.catch(()=>this.buffers.delete(name));}return this.buffers.get(name);}
 reportError(error){if(!this.audioError)this.notice?.('Sound playback failed. Tap Sound in the game menu to retry.');this.audioError=error?.name||error?.message||'Playback failed';}
 playBuffer(name,volume,loop=false){const context=this.context,a={src:effectSource(name),loop,paused:false,source:null,pause(){this.paused=true;try{this.source?.stop();}catch{}}};this.effects.add(a);Promise.all([this.loadEffect(name),context.state==='suspended'?context.resume():Promise.resolve()]).then(([buffer])=>{if(a.paused||!this.effects.has(a)||!this.active||!this.sound||document.hidden)return;const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=loop;gain.gain.value=volume;source.connect(gain);gain.connect(context.destination);a.source=source;source.onended=()=>{this.effects.delete(a);source.disconnect();gain.disconnect();};source.start();this.audioError=null;}).catch(error=>{this.effects.delete(a);if(this.courierEffect===a)this.courierEffect=null;if(!a.paused)this.reportError(error);});return a;}
 setActive(active){this.active=active;this.sync();}
 setTheme(theme){if(!this.tracks[theme])theme='council';if(theme===this.theme)return;this.track.pause();this.track.currentTime=0;this.theme=theme;this.track=this.tracks[theme];this.track.currentTime=0;this.sync();}
 sync(){if(this.active&&this.music&&this.unlocked&&!document.hidden){const p=this.track.play();p?.catch(()=>{this.notice?.('Tap Music in the menu to allow playback.');});}else this.track.pause();if(!this.active||!this.sound||document.hidden){for(const a of this.effects)a.pause();this.effects.clear();this.courierEffect=null;}this.syncCourier();}
 setCourierMoving(moving){this.courierMoving=!!moving;this.syncCourier();}
 syncCourier(){const active=this.courierMoving&&this.sound&&this.active&&this.unlocked&&!document.hidden;if(!active){if(this.courierEffect){this.courierEffect.pause();this.effects.delete(this.courierEffect);this.courierEffect=null;}return;}if(this.courierEffect)return;if(this.context){this.courierEffect=this.playBuffer('gallop',1,true);return;}const a=new Audio(effectSource('gallop'));a.loop=true;a.volume=1;this.courierEffect=a;this.effects.add(a);a.play()?.catch(error=>{this.effects.delete(a);if(this.courierEffect===a)this.courierEffect=null;if(this.active&&this.sound&&!document.hidden)this.reportError(error);});}
 play(name='select'){
  if(name==='select')return; // Native ordinary key/menu selection is silent.
  if(!this.sound||!this.unlocked||!this.active||document.hidden)return;
  if(!customEffects.includes(name)&&!Array.from({length:NATIVE_EFFECT_COUNT},(_,id)=>nativeName(id)).includes(name))return;
  // Keep fast simultaneous/charge playback bounded, without interrupting courier motion.
  const bursts=[...this.effects].filter(a=>a!==this.courierEffect);if(bursts.length>=8){bursts[0].pause();this.effects.delete(bursts[0]);}
  const volume=name==='sword-attack'?.35:name==='native-effect-13'?.55:name==='battle'?.4:.5;if(this.context)return this.playBuffer(name,volume);const a=new Audio(effectSource(name));a.preload='auto';a.volume=volume;this.effects.add(a);a.onended=()=>this.effects.delete(a);a.onerror=()=>{const current=this.effects.delete(a);if(current&&this.active&&this.sound&&!document.hidden)this.reportError(Error('Sound file could not load.'));};a.play()?.catch(error=>{const current=this.effects.delete(a);if(current&&this.active&&this.sound&&!document.hidden)this.reportError(error);});return a;
 }
 playNative(id){if(Number.isInteger(id)&&id>=0&&id<NATIVE_EFFECT_COUNT)return this.play(nativeName(id));}
 playOrder(type,args){return this.play(orderSound(type,args));}
 playEvent(event){const name=eventSound(event);if(name)return this.play(name);}
 playBattle(battle,serial=0,animated=false){
  if(!battle)return;const old=this.battlePlayed.get(battle)||{sequence:null,eventSerial:0},fresh=(battle.messages||[]).filter(m=>m.serial>Math.max(serial,old.eventSerial));
  if(!fresh.length)return;const action=battle.lastAction,newAction=action&&action.sequence!==old.sequence&&(action.messageSerial? action.messageSerial>serial : fresh.some(m=>/ deployed at /.test(m.text)));
  this.battlePlayed.set(battle,{sequence:action?.sequence??old.sequence,eventSerial:Math.max(...fresh.map(m=>m.serial))});
  // These cues come from the animation callback for each resolved exchange and
  // queued ambush. The observer covers orders that have no combat animation.
  if(newAction){if(action.type==='charge')return this.play('charge-shout');if(animated&&['attack','charge','simultaneous','ambush'].includes(action.type)&&action.combatUnits?.length)return;const sound=battleSound(action);if(sound)return this.play(sound);}
  // View, reset deployment, confirm deployment and End use messages without
  // changing lastAction. Do not replay the previous attack or movement cue.
  const text=fresh.map(m=>m.text).join(' ');
  if(/reinforcements have arrived|requested reinforcements|returned with reinforcements/i.test(text))return this.playNative(9);
  if(/inspected|bribed|refused|reinforcement request/.test(text))return this.play('message');
  if(/fled|withdrew|withdraw|deserted/.test(text))return this.play('retreat');
  if(/burned|caught fire/.test(text))return this.play('fire');
  return this.play('order');
 }
 playCombat(action,cycle=1){
  if(!['attack','charge','simultaneous','ambush'].includes(action?.type))return;
  // Charge's single cry is dispatched by the order observer, not each flash.
  if(action.type==='charge'||['attack','simultaneous'].includes(action.type)&&cycle!==1)return;
  return this.play(battleSound(action));
 }
 stop(){this.courierMoving=false;this.active=false;this.sync();for(const a of this.effects)a.pause();this.effects.clear();}
 destroy(){this.stop();document.removeEventListener('visibilitychange',this.onVisibility);document.removeEventListener('pointerdown',this.onGesture);this.context?.close()?.catch(()=>{});}
}
