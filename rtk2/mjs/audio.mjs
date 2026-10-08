export class AudioBus{
 constructor(){this.unlocked=false;this.sound=true;this.music=true;this.active=false;this.effects=new Set();this.track=new Audio('./assets/council-music.mp3');this.track.loop=true;this.track.volume=.3;this.track.preload='auto';this.notice=null;this.onVisibility=()=>this.sync();document.addEventListener('visibilitychange',this.onVisibility);}
 configure(settings){this.sound=settings.sound!==false;this.music=settings.music!==false;if(!this.sound)for(const a of this.effects){a.pause();this.effects.delete(a);}this.sync();}
 unlock(){this.unlocked=true;this.sync();}
 setActive(active){this.active=active;this.sync();}
 sync(){if(this.active&&this.music&&this.unlocked&&!document.hidden){const p=this.track.play();p?.catch(()=>{this.notice?.('Tap Music in the menu to allow playback.');});}else this.track.pause();}
 play(name='select'){if(!this.sound||!this.unlocked||!this.active||document.hidden)return;const allowed=['select','order','battle','fire','month','message'];if(!allowed.includes(name))name='select';const a=new Audio(`./assets/${name}.mp3`);a.volume=name==='battle'?.4:.5;this.effects.add(a);a.onended=()=>this.effects.delete(a);a.onerror=()=>this.effects.delete(a);a.play()?.catch(()=>this.effects.delete(a));}
 stop(){this.active=false;this.sync();for(const a of this.effects)a.pause();this.effects.clear();}
 destroy(){this.stop();document.removeEventListener('visibilitychange',this.onVisibility);}
}
