"""Create original nonverbal event effects. Requires NumPy and ffmpeg.
No sampled recordings or spoken words. Deterministic synthesis, gentle fades.
"""
from pathlib import Path
import numpy as np
import subprocess, tempfile, wave
SR=44100
rng=np.random.default_rng(36)
root=Path(__file__).resolve().parents[1]
def noise(n): return rng.normal(0,1,n)
def lowpass(x,width): return np.convolve(x,np.ones(width)/width,mode='same')
def cue(name,duration):
 t=np.arange(int(SR*duration))/SR
 x=np.zeros_like(t)
 if name=='gallop':
  # Uneven four-hoof clusters, with alternating resonant clops and earth thuds.
  for cycle in np.arange(0,duration,.48):
   for j,offset in enumerate([0,.075,.18,.27]):
    at=cycle+offset;k=int(at*SR);n=min(int(.11*SR),len(t)-k)
    if n<=0:continue
    u=np.arange(n)/SR;env=np.exp(-u*55)
    x[k:k+n]+=(.7*np.sin(2*np.pi*(130+j*22)*u)+.35*noise(n)+.5*np.sin(2*np.pi*65*u))*env
  x+=.04*lowpass(noise(len(t)),30)
 elif name in ('flood','typhoon'):
  x=.4*lowpass(noise(len(t)),16)+.12*noise(len(t))*(.6+.4*np.sin(2*np.pi*.6*t))
  if name=='typhoon':x+=.3*lowpass(noise(len(t)),170)*(1+.5*np.sin(2*np.pi*.4*t))
  else:
   # Layered vowel-like distant distress cries, no language or intelligible words.
   for start,pitch in [(0.2,185),(.65,235),(1.1,155),(1.65,260),(2.15,205)]:
    u=t-start;env=np.where((u>0)&(u<.8),np.sin(np.pi*np.clip(u,0,.8)/.8)**2,0)
    x+=.15*env*(np.sin(2*np.pi*pitch*u+2*np.sin(2*np.pi*3*u))+.35*np.sin(2*np.pi*3*pitch*u))
 elif name=='locust':
  # A dense wing swarm with independent beat frequencies and a rising buzz.
  for freq in [97,123,147,181,211,267,313,377]:x+=.08*np.sin(2*np.pi*freq*t+.5*np.sin(2*np.pi*3.7*t))*(.65+.35*np.sin(2*np.pi*(freq/23)*t))
  x+=.13*noise(len(t))*(.6+.4*np.sin(2*np.pi*37*t))
 elif name=='epidemic':
  x=.12*lowpass(noise(len(t)),45)+.16*np.sin(2*np.pi*92*t)*np.exp(-t/2)
  for start in [.6,.87,1.7,1.93]:x+=.3*noise(len(t))*np.exp(-np.maximum(t-start,0)*25)*(t>=start)
 elif name=='uprising':
  x=.15*lowpass(noise(len(t)),22)
  for start in np.arange(0,duration,.45):
   u=np.maximum(t-start,0);x+=.4*np.sin(2*np.pi*75*u)*np.exp(-u*18)*(t>=start)
  x+=.15*np.sin(2*np.pi*190*t+4*np.sin(2*np.pi*.7*t))*(np.sin(np.pi*t/duration)**2)
 else:
  x=.4*np.sin(2*np.pi*73*t)*np.exp(-t/1.8)+.18*np.sin(2*np.pi*181*t)*np.exp(-t/1.2)+.16*np.sin(2*np.pi*257*t)*np.exp(-t/1.5)
  if name=='meteor':x+=.2*lowpass(noise(len(t)),9)*np.sin(np.pi*t/duration)**2
 fade=np.minimum(1,t/.08)*np.minimum(1,(duration-t)/.25);x*=fade
 x=x/max(1,np.max(np.abs(x)))*.8
 with tempfile.TemporaryDirectory() as tmp:
  wav=Path(tmp)/'cue.wav'
  with wave.open(str(wav),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((x*32767).astype('<i2').tobytes())
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','128k',str(root/'assets'/f'{name}.mp3')],check=True)
for name in ['gallop','flood','locust','typhoon','epidemic','uprising','meteor','death']:cue(name,2.4 if name=='gallop' else 3)
