"""Bounded v38 treasure arithmetic from the supplied English executable.
Runs native award instructions with UI and RNG controlled; not a DOS simulation.
"""
import argparse,importlib.util,json,struct,hashlib
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
spec=importlib.util.spec_from_file_location('native',Path(__file__).with_name('verify-original.py'));native=importlib.util.module_from_spec(spec);spec.loader.exec_module(native)
data=a.main_exe.read_bytes();assert hashlib.sha256(data).hexdigest()==native.EXPECTED
image,_=native.unpack(data);DS=0x2fa60
checks={'treasure_sets_loyalty100':(0xa68e,'8b5efec6470b64'),'treasure_rng_plus5':(0xa695,'8b76088a4401509afa007c0583c4020405'),'treasure_capped_gain':(0xa52c,'03c13d64007e0fb064'),'heavenbook_native_record':(0x341bc,'0005426f6f6b206f662048656176656e')}
for name,(off,hexbytes) in checks.items():assert image[off:off+len(bytes.fromhex(hexbytes))]==bytes.fromhex(hexbytes),name
vectors=[]
try:
 from unicorn import Uc,UC_ARCH_X86,UC_MODE_16,UC_HOOK_CODE
 from unicorn.x86_const import *
except ImportError:
 a.output.write_text(json.dumps({'sha256':native.EXPECTED,'checks':{n:hex(o) for n,(o,_) in checks.items()},'arithmeticStatus':'Not run: optional unicorn dependency is unavailable.','limitations':['Static bytes and disassembly establish allegiance=100, random(0, bonus-1)+5 and cap=100.','Acquisition probability, recipient AI, compatibility change and messenger interception probability are not verified.']},indent=2)+'\n');print(f'{len(checks)} native byte checks passed; arithmetic execution unavailable.');raise SystemExit(0)
for stat in range(3):
 for old in [0,47,90,98,100]:
  for roll in range(5):
   u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,bytes(image));u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_BP,0xf000);u.reg_write(UC_X86_REG_SP,0xeff0);u.reg_write(UC_X86_REG_CS,0xa5e);u.reg_write(UC_X86_REG_IP,0xae)
   def w(off,fmt,*v):u.mem_write(DS+off,struct.pack(fmt,*v))
   w(0xeffe,'H',0x9000);w(0xf008,'H',0x9100);w(0xf00a,'H',stat);w(0x9004+stat,'B',old);w(0x900b,'B',75);w(0x9100,'BB',stat,5)
   def hook(u,address,size,data):
    if address==0xa6b8:u.emu_stop()
    if address==0x58ba:
     sp=u.reg_read(UC_X86_REG_SP);ip,cs,bound=struct.unpack('<3H',u.mem_read(DS+sp,6));assert bound==5;u.reg_write(UC_X86_REG_AX,roll);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
   u.hook_add(UC_HOOK_CODE,hook);u.emu_start(0xa68e,0xa6b9,count=10000)
   gain=u.mem_read(DS+0xeffc,1)[0];loyalty=u.mem_read(DS+0x900b,1)[0];assert gain==min(100-old,5+roll);assert loyalty==100;vectors.append({'stat':stat,'old':old,'roll':roll,'gain':gain,'loyalty':loyalty})
a.output.write_text(json.dumps({'sha256':native.EXPECTED,'checks':{n:hex(o) for n,(o,_) in checks.items()},'vectors':vectors,'limitations':['Snippet ends before stat-store and presentation helpers; gain and loyalty instructions are native.','Treasure acquisition probability, recipient AI, compatibility changes and return-trip interception probability are not established by these checks.']},indent=2)+'\n');print(f'{len(checks)} native byte checks and {len(vectors)} bounded treasure cases passed.')
