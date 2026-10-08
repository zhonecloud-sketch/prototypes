"""Original synthesized score and effects. Requires NumPy and ffmpeg."""
from pathlib import Path
import numpy as np,wave,subprocess
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets';OUT.mkdir(exist_ok=True)
SR=22050;rng=np.random.default_rng(204)
def write(name,data):
 data=np.asarray(data);data=data/max(1,np.max(np.abs(data))/0.88);data=np.column_stack((data,np.roll(data,127)*.98)) if data.ndim==1 else data
 temp=OUT/(name+'.wav')
 with wave.open(str(temp),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temp),'-codec:a','libmp3lame','-b:a','128k',str(OUT/(name+'.mp3'))],check=True);temp.unlink()
def pluck(freq,duration=3):
 t=np.arange(int(SR*duration))/SR;x=np.zeros_like(t)
 for h in range(1,11):x+=np.sin(2*np.pi*freq*h*(1+0.00025*h*h)*t+0.15*h)*np.exp(-t*(.8+.37*h))/h**1.5
 return x*(1-np.exp(-t*300))
N=SR*48;score=np.zeros(N);scale=[146.83,174.61,196,220,261.63,293.66,349.23,392]
melody=[0,3,4,5,3,2,1,3,0,2,3,4,2,1,0,0,3,4,6,5,4,3,2,4,5,3,2,1,3,2,0,0]
for cycle in range(2):
 for i,note in enumerate(melody):
  start=int((cycle*24+i*.75)*SR);sound=pluck(scale[note],3.5)*(.12 if i%4 else .15);idx=(start+np.arange(len(sound)))%N;score[idx]+=sound
 for i in range(8):
  start=int((cycle*24+i*3)*SR);sound=pluck(scale[0 if i%2==0 else 2]/2,5)*.08;score[(start+np.arange(len(sound)))%N]+=sound
# restrained bowed harmonic bed and short room reflections
for shift,gain in [(int(SR*.083),.12),(int(SR*.181),.08),(int(SR*.37),.05)]:score+=np.roll(score,shift)*gain
t=np.arange(N)/SR;score+=.017*np.sin(2*np.pi*146.83*t)*(.6+.4*np.sin(2*np.pi*t/24)**2)
# Crossfade the seam to prevent an abrupt looping boundary.
fade=SR;seam=np.linspace(0,1,fade);score[-fade:]=score[-fade:]*(1-seam)+score[:fade]*seam
write('council-music',score)
for name,duration in [('select',.14),('order',.7),('battle',.45),('fire',1.1),('month',1.5),('message',.65)]:
 t=np.arange(int(SR*duration))/SR;noise=rng.normal(0,1,len(t));env=np.exp(-t/(duration*.28));x=np.zeros_like(t)
 if name=='select':x=.15*np.sin(2*np.pi*750*t)*np.exp(-t*65)+.05*noise*np.exp(-t*100)
 if name=='order':x=.15*pluck(293.66,duration)+.08*pluck(392,duration)
 if name=='battle':
  for f in [980,1571,2130,3173]:x+=.06*np.sin(2*np.pi*f*t)*np.exp(-t*(8+f/400))
  x+=.07*noise*np.exp(-t*25)
 if name=='fire':x=np.convolve(noise,np.ones(35)/35,mode='same')*.7*np.sin(np.pi*t/duration)**1.5+.03*noise*(rng.random(len(t))>.998)
 if name=='month':x=.1*pluck(196,duration)+.1*pluck(293.66,duration)+.06*pluck(392,duration)
 if name=='message':x=.08*noise*np.exp(-t*9)*(np.sin(t*80)**2)+.07*pluck(220,duration)
 x[:100]*=np.linspace(0,1,100);x[-200:]*=np.linspace(1,0,200);write(name,x)
print('Created original 48-second instrumental loop and six effects.')
