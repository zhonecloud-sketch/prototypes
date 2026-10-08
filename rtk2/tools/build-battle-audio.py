"""Compose the remaster's original battlefield loop and victory fanfare.
NumPy synthesis: pentatonic zither, breathy flute, horns, low war drums and gong.
No samples or recordings from the DOS game are used. Requires NumPy and ffmpeg.
"""
from pathlib import Path
import subprocess, wave
import numpy as np

ROOT=Path(__file__).resolve().parents[1]; SR=44100
rng=np.random.default_rng(1515)
def hz(midi):return 440*2**((midi-69)/12)
def voice(midi,duration,kind):
    t=np.arange(round(duration*SR))/SR;f=hz(midi)
    if kind=='zither':
        x=sum(np.sin(2*np.pi*f*h*t+.11*h)*np.exp(-t*(1.6+h*.32))/h**1.8 for h in range(1,9))
        env=1-np.exp(-t*350)
    else:
        phase=2*np.pi*f*t+.027*np.sin(2*np.pi*5.2*t)
        if kind=='flute':x=np.sin(phase)+.16*np.sin(phase*2)+.045*np.sin(phase*3)
        else:x=sum(np.sin(phase*h)/h**2.1 for h in range(1,7))
        env=(1-np.exp(-t*18))*np.minimum(1,np.maximum(0,(duration-t)/.2))
    return x*env
def drum(duration=.5,high=False):
    t=np.arange(round(duration*SR))/SR
    phase=2*np.pi*(58*t+26*(1-np.exp(-t*19))/19)
    noise=rng.normal(0,1,len(t));soft=np.convolve(noise,np.ones(40)/40,mode='same')
    return (.8*np.sin(phase)*np.exp(-t*8)+soft*(.8 if high else .24)*np.exp(-t*18))*(1-np.exp(-t*600))
def gong(duration=4):
    t=np.arange(round(duration*SR))/SR
    x=sum(np.sin(2*np.pi*f*t)*np.exp(-t*(.75+i*.16))/(1+i*.45) for i,f in enumerate([123,197,266,361,487,648,823]))
    return x*(1-np.exp(-t*120))*.18
def add(score,sound,start,gain=1,loop=False):
    index=round(start*SR)+np.arange(len(sound))
    if loop:np.add.at(score,index%len(score),sound*gain)
    else:
        keep=index<len(score);score[index[keep]]+=sound[keep]*gain
def save(name,score,loop=False):
    # Short stereo room reflections, gentle soft saturation, consistent music loudness.
    channels=[]
    for offset in [.071,.113]:
        delay=round(offset*SR);echo=np.roll(score,delay) if loop else np.concatenate((np.zeros(delay),score[:-delay]))
        x=np.tanh((score+echo*.12)*.8);channels.append(x)
    data=np.column_stack(channels);data*=.8/max(.8,np.max(np.abs(data)))
    if not loop:
        fade=round(.8*SR);data[-fade:]*=np.linspace(1,0,fade)[:,None]
    out=ROOT/'assets';temp=out/(name+'.wav')
    with wave.open(str(temp),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((data*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temp),'-codec:a','libmp3lame','-b:a','160k',str(out/(name+'.mp3'))],check=True)
    temp.unlink();print(name,round(len(score)/SR,2),'seconds','peak',round(float(np.max(np.abs(data))),3))

# V17: 144 BPM, rhythmic eighth-note zither and accented marching drums.
BATTLE_BPM=144
beat=60/BATTLE_BPM;score=np.zeros(round(128*beat*SR))
motif=[62,65,67,69,67,65,62,60,62,67,69,72,69,67,65,62]
for bar in range(32):
    root=[38,36,33,43][(bar//4)%4]
    add(score,voice(root,beat*3.8,'horn'),bar*4*beat,.11,True)
    for n in range(8):
        at=(bar*4+n*.5)*beat
        add(score,voice(motif[(bar*8+n)%16]-12,.8,'zither'),at,.17 if n%2==0 else .10,True)
        if n%2==0:add(score,drum(.3,high=n==4),at,.43 if n in [0,4] else .23,True)
        elif n in [3,7]:add(score,drum(.18,high=True),at,.12,True)
    for n in range(4):
        add(score,voice(motif[(bar*4+n)%16],beat*.9,'flute' if bar%8<4 else 'horn'),(bar*4+n)*beat,.13,True)
    if bar%8==7:
        for n in range(4):add(score,drum(.2,high=True),(bar*4+3+n*.25)*beat,.14+n*.03,True)
for at in [0,32*beat,64*beat,96*beat]:add(score,gong(2.5),at,.22,True)
save('battle-music-v17',score,True)

beat=.5;score=np.zeros(18*SR);melody=[62,66,69,74,73,69,66,69,74,78,81,78,76,74,69,74]
for i,note in enumerate(melody):
    at=i*beat;add(score,voice(note,.85 if i!=15 else 3,'horn'),at,.3)
    add(score,voice(note+12,1.7,'zither'),at+.025,.11)
for bar in range(4):
    root=[50,55,57,50][bar]
    for note in [root,root+7,root+12]:add(score,voice(note,3,'horn'),bar*2,.11)
for i in range(18):add(score,drum(high=i%4==2),i*.5,.28 if i%2==0 else .12)
add(score,gong(5),0,.6);add(score,gong(6),8,.7)
for note in [50,57,62,66,69,74]:add(score,voice(note,6,'horn'),8,.09)
save('triumph-music',score)
