from pathlib import Path
import json,struct,subprocess,wave,hashlib,sys
import numpy as np
ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).parent
RENDERER=Path(sys.argv[2]) if len(sys.argv)>2 else ROOT/'render'
for path in sorted(ROOT.glob('native-*.json')):
 d=json.loads(path.read_text());name=d['name'];writes=d['writes'];n=round(d['seconds']*44100)
 tmp=ROOT/(name+'.regbin');pcm=ROOT/(name+'.pcm');wav=ROOT/(name+'.wav');mp3=ROOT/(name+'.mp3');encoded=ROOT/(name+'.encoding.mp3')
 with tmp.open('wb') as f:
  f.write(struct.pack('<I',len(writes)))
  for t,r,v in writes:f.write(struct.pack('<IHB',t,r,v))
 subprocess.run([str(RENDERER),str(tmp),str(pcm),str(n)],check=True)
 x=np.fromfile(pcm,dtype='<i2').astype(np.float64);peak=np.max(np.abs(x));rms=np.sqrt(np.mean(x*x));assert peak>100,(name,peak)
 # Gain-normalise for browser listening; preserve the original instrument balance and modulation.
 gain=min(8,22000/max(peak,1));x*=gain
 # Apply only a brief click-prevention ramp at file boundaries.
 fade=min(len(x)//3,round(.008*44100));x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
 with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(44100);w.writeframes(np.clip(x,-32768,32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','128k',str(encoded)],check=True)
 decoded=subprocess.run(['ffmpeg','-v','error','-i',str(encoded),'-f','s16le','-ac','1','-ar','44100','-'],check=True,capture_output=True).stdout
 assert abs(len(decoded)/2/44100-d['seconds'])<.03,(name,len(decoded)/2/44100,d['seconds'])
 encoded.replace(mp3)
 print(name,'peak',round(peak),'rms',round(rms),'sha256',hashlib.sha256(mp3.read_bytes()).hexdigest(),flush=True)
 tmp.unlink();pcm.unlink()
