/* Original audio compositions and ambience; see ASSETS.md and tools/. */
(() => {
  'use strict';
  const tracks=[['amber-light','Amber light'],['birch-whispers','Birch whispers'],['last-gold','Last gold']];
  const ambience=new Audio(),music=new Audio();
  ambience.preload=music.preload='none';ambience.loop=true;
  ambience.volume=.45;music.volume=.3;
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
    document.getElementById(id).oninput=e=>{audio.volume=Number(e.target.value);
      document.getElementById(id+'-value').textContent=Math.round(audio.volume*100)+'%';};
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){ambientRequest++;musicRequest++;ambience.pause();music.pause();}
    else{if(ambientOn)play('ambience');if(musicOn)play('music');}
  });
  window.addEventListener('pagehide',()=>{ambience.pause();music.pause();});
  window.forestAudio={
    reset(){ambientOn=musicOn=false;ambientRequest++;musicRequest++;ambience.pause();music.pause();track=0;
      music.removeAttribute('src');ambience.currentTime=0;
      for(const id of ['ambient-volume','music-volume']){const input=document.getElementById(id);input.value=input.defaultValue;input.dispatchEvent(new Event('input'));}
      status.textContent='Three original pieces rotate automatically.';update();},
    get state(){return {ambientOn,musicOn,track,ambientPlaying:!ambience.paused,musicPlaying:!music.paused,
      ambientTime:ambience.currentTime,musicTime:music.currentTime,ambientVolume:ambience.volume,musicVolume:music.volume};}
  };
})();
