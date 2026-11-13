/* Original audio compositions and ambience; see ASSETS.md and tools/. */
(() => {
  'use strict';
  const tracks=[['amber-light','Amber light'],['birch-whispers','Birch whispers'],['last-gold','Last gold']];
  const ambience=new Audio(),music=new Audio();
  ambience.preload=music.preload='none';ambience.loop=true;
  ambience.volume=0;music.volume=.3;
  let ambientLevel=.45, windVolume=0, audioContext, windGain;
  let ambientOn=false,musicOn=false,track=0,ambientRequest=0,musicRequest=0;
  const status=document.getElementById('audio-status');
  function update(){
    for(const [id,on]of [['ambience',ambientOn],['music',musicOn]]){
      const button=document.getElementById(id);button.setAttribute('aria-pressed',String(on));
      button.querySelector('b').textContent=on?'On':'Off';
    }
    document.getElementById('track-name').textContent=tracks[track][1]+' · '+(track+1)+' / 3';
  }
  async function play(kind){
    const ambient=kind==='ambience',audio=ambient?ambience:music;
    const request=ambient?++ambientRequest:++musicRequest;
    if(!audio.src)audio.src=ambient?'audio/woodland.mp3':'audio/'+tracks[track][0]+'.mp3';
    try{
      if(ambient&&location.protocol!=='file:'&&window.AudioContext){
        if(!audioContext){
          audioContext=new AudioContext();
          windGain=audioContext.createGain();
          windGain.gain.value=windVolume;
          audioContext.createMediaElementSource(ambience).connect(windGain).connect(audioContext.destination);
          ambience.volume=1;
        }
        if(audioContext.state!=='running')audioContext.resume().catch(()=>{});
      }
      await audio.play();
      if(request!==(ambient?ambientRequest:musicRequest))return;
      if(!(ambient?ambientOn:musicOn)||document.hidden)audio.pause();
      else status.textContent=ambient?'A breeze through leaves, with distant birds.':'Playing '+tracks[track][1]+'. Three pieces rotate automatically.';
    }catch(error){
      if(request!==(ambient?ambientRequest:musicRequest))return;
      if(ambient)ambientOn=false;else musicOn=false;
      status.textContent='Sound could not start. Tap the sound switch to try again.';update();
    }
  }
  document.getElementById('ambience').onclick=()=>{
    ambientOn=!ambientOn;if(ambientOn)play('ambience');else{ambientRequest++;ambience.pause();}update();
  };
  document.getElementById('music').onclick=()=>{
    musicOn=!musicOn;if(musicOn)play('music');else{musicRequest++;music.pause();}update();
  };
  function next(){
    musicRequest++;music.pause();track=(track+1)%tracks.length;
    if(musicOn){music.src='audio/'+tracks[track][0]+'.mp3';if(!document.hidden)play('music');}
    else music.removeAttribute('src');
    update();
  }
  document.getElementById('next-track').onclick=next;
  music.onended=()=>{if(musicOn)next();};
  for(const [id,audio]of [['ambient-volume',ambience],['music-volume',music]]){
    document.getElementById(id).oninput=e=>{
      const level=Number(e.target.value);
      if(audio===ambience)ambientLevel=level;
      else audio.volume=level;
      document.getElementById(id+'-value').textContent=Math.round(level*100)+'%';
    };
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){ambientRequest++;musicRequest++;ambience.pause();music.pause();}
    else{if(ambientOn)play('ambience');if(musicOn)play('music');}
  });
  window.addEventListener('pagehide',()=>{ambience.pause();music.pause();});
  window.forestAudio={
    wind(breeze,sceneTime){
      // These are the same 12 s and 8 s gust cycles used in woodland.mp3.
      // Match the two-second loop splice before applying the breeze slider.
      const phase=ambientOn&&!ambience.paused?ambience.currentTime:sceneTime%46;
      const envelope=t=>.55+.2*Math.sin(t*Math.PI/6+.25)+.12*Math.sin(t*Math.PI/4);
      const gust=phase<2?envelope(phase)*(phase/2)+envelope(phase+46)*(1-phase/2):envelope(phase);
      const strength=breeze*(.43+.57*Math.max(0,Math.min(1,(gust-.23)/.64)));
      const volume=ambientLevel*breeze;
      if(Math.abs(windVolume-volume)>.0005||volume===0&&windVolume!==0){
        windVolume=volume;
        if(windGain)windGain.gain.setTargetAtTime(volume,audioContext.currentTime,.08);
        else ambience.volume=volume;
      }
      return strength;
    },
    reset(){ambientOn=musicOn=false;ambientRequest++;musicRequest++;ambience.pause();music.pause();track=0;
      music.removeAttribute('src');ambience.currentTime=0;
      for(const id of ['ambient-volume','music-volume']){const input=document.getElementById(id);input.value=input.defaultValue;input.dispatchEvent(new Event('input'));}
      status.textContent='Three original pieces rotate automatically.';update();},
    get state(){return {ambientOn,musicOn,track,ambientPlaying:!ambience.paused,musicPlaying:!music.paused,
      ambientTime:ambience.currentTime,musicTime:music.currentTime,ambientVolume:ambientLevel,windVolume,musicVolume:music.volume};}
  };
})();
