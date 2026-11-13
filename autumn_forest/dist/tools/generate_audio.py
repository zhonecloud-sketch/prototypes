"""Generate the original audio masters documented in dist/ASSETS.md.

Usage: python tools/generate_audio.py --output <master-dir> --ffmpeg <exe>
Requires numpy and scipy. Publication copies are credited separately with
Signature Studio; this script retains uncredited production masters.
"""
import argparse
import pathlib
import subprocess
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io.wavfile import write

RATE = 32000
DURATION = 64
rng = np.random.default_rng(4217)


def note(midi, duration, soft=False):
    t = np.arange(int(duration * RATE)) / RATE
    frequency = 440 * 2 ** ((midi - 69) / 12)
    if soft:
        signal = sum(np.sin(2*np.pi*frequency*k*t) / k**2
                     for k in range(1, 4))
        envelope = (1-np.exp(-t*1.5))*np.exp(-t*.24)
    else:
        signal = sum(np.sin(2*np.pi*frequency*k*t + .0004*k*t*t)
                     * np.exp(-t*k*.19) / k**1.7 for k in range(1, 7))
        envelope = (1-np.exp(-t*100))*np.exp(-t*.85)
    envelope *= np.minimum(1, (duration-t)*3)
    return signal * envelope


def place(out, signal, start, gain, pan):
    offset = int(start * RATE)
    count = min(len(signal), len(out)-offset)
    if count <= 0:
        return
    out[offset:offset+count, 0] += signal[:count]*gain*np.sqrt(1-pan)
    out[offset:offset+count, 1] += signal[:count]*gain*np.sqrt(pan)


def composition(root, progression, melody, step):
    out = np.zeros((RATE*DURATION, 2), np.float64)
    for bar in range(8):
        chord = [root+n for n in progression[bar % len(progression)]]
        start = bar*8
        for index, pitch in enumerate(chord):
            place(out, note(pitch-12, 9, True), start, .075, .3+index*.15)
        for beat in range(int(8/step)):
            pitch = chord[(beat+bar) % len(chord)]
            place(out, note(pitch, 4.5), start+beat*step+.1, .13,
                  .25+((beat+bar) % 5)*.12)
        for beat in range(3):
            pitch = root+12+melody[(bar*3+beat) % len(melody)]
            place(out, note(pitch, 5), start+.8+beat*2.3, .085, .55)
    # Quiet stereo echoes add space without a large convolution processor.
    dry = out.copy()
    for delay, gain in [(.23,.14),(.41,.11),(.73,.065),(1.1,.04)]:
        n = int(delay*RATE)
        out[n:] += dry[:-n, ::-1]*gain
    t = np.arange(len(out))/RATE
    out *= (np.minimum(1,t/2.5)*np.minimum(1,(DURATION-t)/4))[:,None]
    return out


def woodland():
    length = 64
    samples = RATE*length
    out = np.zeros((samples, 2), np.float64)
    t = np.arange(samples)/RATE
    # Let the browser shape gusts. This bed supplies unsteady foliage texture
    # at much shorter timescales than the gusts and lulls.
    common = rng.normal(0, 1, samples)
    for channel in range(2):
        noise = .68*common + .73*rng.normal(0, 1, samples)
        intervals = np.cumsum(rng.uniform(.035, .29, 600))
        detail = np.interp(t, intervals, rng.uniform(.5, 1.35, len(intervals)))
        for low, high, gain in [(130,390,.13),(390,1280,.29),(1500,4700,.23)]:
            band = sosfilt(butter(2, [low, high], 'bandpass', fs=RATE,
                                  output='sos'), noise)
            out[:,channel] += band*gain*detail
    # Short, softly panned contacts give nearby dry leaves a papery sound.
    start = .1
    while start < length:
        duration = rng.uniform(.045, .32)
        count = int(RATE*duration)
        lower = rng.uniform(690, 1950)
        signal = sosfilt(butter(2, [lower, lower+2300], 'bandpass', fs=RATE,
                                output='sos'), rng.normal(0, 1, count))
        position = np.linspace(0, 1, count)
        envelope = (1-np.exp(-position*30))*np.exp(-position*4)*(1-position)
        place(out, signal*envelope, start, rng.uniform(.03,.16),
              rng.uniform(.13,.87))
        start += rng.uniform(.018,.24)
    for start in [6.2,21.4,38.8,55.1]:
        for offset in [0,.21,.48]:
            duration = rng.uniform(.11,.19)
            tt = np.arange(int(duration*RATE))/RATE
            freq = rng.uniform(2050,2750)
            chirp = np.sin(2*np.pi*(freq*tt-1500*tt**2))
            place(out, chirp*np.sin(np.pi*tt/duration)**2, start+offset,
                  .021,.3 if start<30 else .7)
    # Blend the tail into the head, making the noise bed periodic.
    n=RATE*2
    blend=np.linspace(0,1,n)[:,None]
    out[:n]=out[:n]*blend+out[-n:]*(1-blend)
    return out[:-n]


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True,type=pathlib.Path)
    parser.add_argument('--ffmpeg',required=True)
    parser.add_argument('--woodland-only',action='store_true')
    args=parser.parse_args()
    args.output.mkdir(parents=True,exist_ok=True)
    scores=[
        ('amber-light',60,[[0,4,7],[5,9,12],[7,11,14],[0,4,9]],
         [7,4,2,0,4,9,7,2],1.5),
        ('birch-whispers',62,[[0,3,7],[5,9,12],[3,7,10],[7,10,14]],
         [0,7,10,7,3,5,2,0],2),
        ('last-gold',65,[[0,4,9],[7,11,14],[5,9,12],[0,4,7]],
         [4,7,9,7,2,4,0,2],1.75),
    ]
    audio=[] if args.woodland_only else [
        (name,composition(root,chords,melody,step))
        for name,root,chords,melody,step in scores]
    audio.append(('woodland',woodland()))
    for name,data in audio:
        peak=np.max(np.abs(data))
        data*=min(1,.72/peak)
        wav=args.output/(name+'.wav')
        write(wav,RATE,(data*32767).astype(np.int16))
        mp3=args.output/(name+'.mp3')
        subprocess.run([args.ffmpeg,'-y','-v','error','-i',str(wav),
                        '-codec:a','libmp3lame','-b:a','128k',str(mp3)],
                       check=True)
        print(f'{name}: {len(data)/RATE:.1f}s, peak {np.max(np.abs(data)):.3f}')


if __name__ == '__main__':
    main()
