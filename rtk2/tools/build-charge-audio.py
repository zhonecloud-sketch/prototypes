"""Reproducible synthetic army shout; remaster presentation, not native effect13."""
from pathlib import Path
import numpy as np
import wave, tempfile, subprocess
RATE=44100
rng=np.random.default_rng(53)
signal=np.zeros(int(RATE*1.2))
for voice in range(28):
    n=int(RATE*rng.uniform(.45,.72));t=np.arange(n)/RATE
    f=rng.uniform(90,175)*(1+.05*np.sin(t*15));phase=2*np.pi*np.cumsum(f)/RATE
    # A shouted open vowel, voiced harmonics shaped by three vocal formants.
    sound=np.zeros(n)
    for harmonic in range(1,45):
        hz=harmonic*np.mean(f)
        weight=sum(np.exp(-.5*((hz-center)/width)**2) for center,width in [(730,160),(1200,230),(2500,350)])/(harmonic**.45)
        sound+=weight*np.sin(phase*harmonic+rng.uniform(-.1,.1))
    envelope=np.minimum(1,t/.035)*np.minimum(1,(t[-1]-t)/.16)
    sound=(sound+.15*rng.standard_normal(n))*envelope
    offset=int(RATE*rng.uniform(0,.28));signal[offset:offset+n]+=sound
signal=.78*signal/max(abs(signal))
with tempfile.TemporaryDirectory() as tmp:
    wav=Path(tmp)/'shout.wav'
    with wave.open(str(wav),'wb') as out:
        out.setnchannels(1);out.setsampwidth(2);out.setframerate(RATE);out.writeframes((signal*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k',str(Path(__file__).resolve().parents[1]/'assets/charge-shout.mp3')],check=True)
