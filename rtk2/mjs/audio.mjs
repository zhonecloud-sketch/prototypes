export class AudioBus{
 constructor(){this.unlocked=false;this.sound=true;this.music=true;this.active=false;this.effects=new Set();this.theme='council';this.tracks=Object.fromEntries(['council','battle','triumph'].map(theme=>{const a=new Audio(`./assets/${theme==='battle'?'battle-music-v17':theme+'-music'}.mp3`);a.loop=theme!=='triumph';a.volume=theme==='battle'?.24:.3;a.preload='auto';return [theme,a];}));this.track=this.tracks.council;this.notice=null;this.courierMoving=false;this.courierEffect=null;this.onVisibility=()=>this.sync();document.addEventListener('visibilitychange',this.onVisibility);}
 configure(settings){this.sound=settings.sound!==false;this.music=settings.music!==false;if(!this.sound)for(const a of this.effects){a.pause();this.effects.delete(a);}this.sync();}
 unlock(){this.unlocked=true;this.sync();}
 setActive(active){this.active=active;this.sync();}
 setTheme(theme){if(!this.tracks[theme])theme='council';if(theme===this.theme)return;this.track.pause();this.track.currentTime=0;this.theme=theme;this.track=this.tracks[theme];this.track.currentTime=0;this.sync();}
 sync(){if(this.active&&this.music&&this.unlocked&&!document.hidden){const p=this.track.play();p?.catch(()=>{this.notice?.('Tap Music in the menu to allow playback.');});}else this.track.pause();this.syncCourier();}
 setCourierMoving(moving){this.courierMoving=!!moving;this.syncCourier();}
 syncCourier(){const active=this.courierMoving&&this.sound&&this.active&&this.unlocked&&!document.hidden;if(!active){if(this.courierEffect){this.courierEffect.pause();this.effects.delete(this.courierEffect);this.courierEffect=null;}return;}if(this.courierEffect)return;const a=new Audio('./assets/gallop.mp3');a.loop=true;a.volume=.5;this.courierEffect=a;this.effects.add(a);a.play()?.catch(()=>{this.effects.delete(a);if(this.courierEffect===a)this.courierEffect=null;});}
 play(name='select'){if(!this.sound||!this.unlocked||!this.active||document.hidden)return;const allowed=['select','order','battle','fire','month','message','gallop','flood','locust','typhoon','epidemic','uprising','meteor','death'];if(!allowed.includes(name))name='select';const a=new Audio(`./assets/${name}.mp3`);a.volume=name==='battle'?.4:.5;this.effects.add(a);a.onended=()=>this.effects.delete(a);a.onerror=()=>this.effects.delete(a);a.play()?.catch(()=>this.effects.delete(a));}
 playEvent(event){if(!event)return;const name=({flood:'flood',locust:'locust',typhoon:'typhoon',epidemic:'epidemic',uprising:'uprising',meteor:'meteor',death:'death',clan:'death'})[event.art||event.kind];if(name)this.play(name);}
 stop(){this.courierMoving=false;this.active=false;this.sync();for(const a of this.effects)a.pause();this.effects.clear();}
 destroy(){this.stop();document.removeEventListener('visibilitychange',this.onVisibility);}
}
