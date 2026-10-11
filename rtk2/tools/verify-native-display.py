"""Verify governor text and derive solid ownership colours from supplied main.exe.

No DOS execution or original assets are distributed. The solid colours are
nearest (ties-to-even) means of each native 8 x 2 map pattern.
"""
import argparse, hashlib, importlib.util, json
from pathlib import Path

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('main_exe',type=Path)
parser.add_argument('output',type=Path)
args=parser.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'))
original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
data=args.main_exe.read_bytes();assert hashlib.sha256(data).hexdigest()==original.EXPECTED
image,_=original.unpack(data);ds=0x2fa60
assert image[0x13965:0x13965+20].hex()=='8b5e068b4702051c0050b87e62509ae806ef0383'
assert image[ds+0x627e:ds+0x627e+20]==b'\x1bC1\x01Governor: \x1bC0\x01%s'
assert image[0x4fec:0x4fec+41].hex()=='ff76069a4a00250583c402509a0600250583c4028ad82aff8a8748002ae48bc8d1e003c1d1e005d03a'
assert image[0x4c0a:0x4c0a+8].hex()=='b88434509aed0000'
indexes=list(image[ds+0x48:ds+0x58]);assert sorted(indexes)==list(range(16))
registers=list(image[ds+0x3484:ds+0x3484+16]);assert registers==[0,17,18,19,20,21,22,23,16,17,18,19,20,21,22,23]
def rgb(register):
    return (170*((register>>2)&1)+85*((register>>5)&1),
            170*((register>>1)&1)+85*((register>>4)&1),
            170*(register&1)+85*((register>>3)&1))
rows=[]
for owner,index in enumerate(indexes):
    pattern=image[ds+0x3ad0+index*6:ds+0x3ad0+(index+1)*6]
    # The fill routine writes these three bytes to VGA planes 0, 2, 1.
    pixels=[rgb(registers[sum(((pattern[row*3+k]>>bit)&1)<<(0 if k==0 else 2 if k==1 else 1) for k in range(3))]) for row in range(2) for bit in range(7,-1,-1)]
    mean=tuple(round(sum(pixel[k] for pixel in pixels)/16) for k in range(3))
    rows.append({'owner':owner,'patternIndex':index,'solidColor':'#'+bytes(mean).hex()})
assert len({row['solidColor'] for row in rows})==16
args.output.write_text(json.dumps({'sha256':original.EXPECTED,'governor':'Province serving-head pointer +2, officer name +28; formatted Governor: %s.','ownerLookup':'DS:0048, fill patterns DS:3ad0, palette DS:3484, planes 0/2/1','colors':rows},indent=2)+'\n')
print('PASS native governor formatter, ruler-index lookup and 16 distinct solid ownership colours')
