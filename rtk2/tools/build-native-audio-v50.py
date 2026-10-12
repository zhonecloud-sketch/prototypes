"""Original synthesized replacements following recovered main.exe effect pitch/wait sequences.
Historical fallback generator; the released native assets now come from extract-native-opl-v50.py.
Do not use this tool to regenerate the released driver-rendered assets.
Run verify-native-audio-v50.py first. Requires NumPy and ffmpeg.
"""
from pathlib import Path
import json,subprocess,tempfile,wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1];SR=22050
report=json.loads((ROOT/'docs/native-audio-v50.json').read_text())
def save(name,x):
 x=np.asarray(x);x*=.75/max(.75,float(np.max(np.abs(x))));fade=min(len(x)//3,round(.025*SR));x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
 with tempfile.TemporaryDirectory() as td:
  wav=Path(td)/'cue.wav'
  with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes())
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k',str(ROOT/'assets'/f'{name}.mp3')],check=True)

def voice(note,seconds,effect):
 t=np.arange(round(seconds*SR))/SR;freq=440*2**((note+24-69)/12);ratio=[1,1.5,2,2.5,3][effect%5]
 env=(1-np.exp(-t*150))*np.exp(-t*(3+effect%4))
 # Our own two-oscillator palette; does not infer undocumented driver patch fields.
 return .45*np.sin(2*np.pi*freq*t+(1.8+.13*effect)*np.sin(2*np.pi*freq*ratio*t)*np.exp(-t*8))*env
for effect in report['effects']:
 i=effect['id'];segments=[];pitch=36
 for command in effect['sequence']:
  if command.get('command')==6:pitch=command['argument']
  elif 'delayRoutine' in command:
   value=command['argument'];ticks=((value*6)>>1)+1 if command['delayRoutine']=='0x583c' else (value>>1)+1
   seconds=ticks/18.2065;segments.append(voice(pitch,seconds,i))
 # Two native effects remain keyed on until callers stop them; bounded browser replacements.
 if not segments:segments=[voice(pitch,.65,i)]
 save(f'native-effect-{i}',np.concatenate(segments));print('native-effect-'+str(i),round(sum(map(len,segments))/SR,3))
# Original remaster-only cues for governance and movement without a native-specific witness.
for name,notes in [('march',[31,31,33,31]),('train',[38,38,43]),('trade',[48,55,52]),('recruit',[43,48,55]),('retreat',[43,38,31])]:
 save(name,np.concatenate([voice(n,.13,5+j) for j,n in enumerate(notes)]));print(name)
