"""v32 native formula regression vectors. RNG calls are replaced with controlled rolls; all arithmetic instructions run unchanged."""
import sys,struct,json,random,importlib.util,argparse
from pathlib import Path
from unicorn import Uc,UC_ARCH_X86,UC_MODE_16,UC_HOOK_CODE
from unicorn.x86_const import *
parser=argparse.ArgumentParser(description='Isolated 16-bit native domestic/combat calculations; requires optional unicorn package. No DOS OS or game execution.');parser.add_argument('main_exe',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
module=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(module);module.loader.exec_module(original)
import hashlib
data=args.main_exe.read_bytes();assert hashlib.sha256(data).hexdigest()==original.EXPECTED
image,_=original.unpack(data);image=bytes(image)
DS=0x2fa60
def run(start,args,setup,rolls=[]):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,image)
 u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xff00)
 u.mem_write(DS+0xff00,struct.pack('<'+'H'*(len(args)+2),0,0x6000,*args))
 setup(u);queue=list(rolls)
 def hook(u,address,size,data):
  if address==0x60000:u.emu_stop()
  if address in [0x4b38,0x58ba]:
   sp=u.reg_read(UC_X86_REG_SP);ip,cs,bound=struct.unpack('<3H',u.mem_read(DS+sp,6));value=queue.pop(0) if queue else 0
   assert 0<=value<bound or bound==0,(value,bound)
   u.reg_write(UC_X86_REG_AX,value);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
 u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,start//16);u.reg_write(UC_X86_REG_IP,start%16)
 u.emu_start(start,0x60001,count=100000);assert u.reg_read(UC_X86_REG_CS)==0x6000
 return u.reg_read(UC_X86_REG_AX)&0xff if start==0x10750 else u.reg_read(UC_X86_REG_AX)
def write(u,at,fmt,*v):u.mem_write(DS+at,struct.pack(fmt,*v))
results={'development':[],'casualties':[],'power':[]}
rng=random.Random(32)
for i in range(500):
 I=rng.randrange(101);C=rng.randrange(101);gold=rng.randrange(1,101);value=rng.randrange(100);D=rng.randrange(1,6)
 def init(u):write(u,0x9004,'BBB',I,50,C);write(u,0x33b3,'B',D)
 out=run(0x10750,[0x9000,gold,value],init)
 import math
 expected=max(0,math.isqrt(math.isqrt(((100-value//2)*gold//100)*(I+C//2))//((D+1)//2))-D)
 assert out==expected,(out,expected,I,C,gold,value,D)
 results['development'].append(dict(int=I,charm=C,gold=gold,value=value,difficulty=D,gain=out))
for terrain in range(7):
 for special in [False,True]:
  for i in range(50):
   own=rng.randrange(501);other=rng.randrange(501);men=rng.randrange(1,10001);R=rng.randrange(300);fallback=rng.randrange(30);factor=rng.randrange(1,6)
   def init(u):
    write(u,0x9100+0x12,'H',men);write(u,0xb8e4,'H',0x9100 if special else 0x9000);write(u,0x9118,'B',0x11);write(u,0xb9d0+14,'B',6 if special else 0)
   result=run(0x2375a,[own,other,terrain,factor,0x9100],init,[R,fallback]);result=result-65536 if result>=32768 else result
   divisor=[10,10,12,10,8,15,20,5][7 if special else terrain]
   raw=int(int((own-other-min(men,R))*10/divisor)/factor);expected=raw if raw<0 else -fallback-1
   assert result==expected,(result,expected)
   results['casualties'].append(dict(ownPower=own,otherPower=other,otherMen=men,terrain=terrain,palaceAssault=special,factor=factor,random300=R,random30=fallback,loss=-result))
for i in range(100):
 men=rng.randrange(1,10001);arms=rng.randrange(10001);training=rng.randrange(101);war=rng.randrange(101);face=163 if i%2 else 100
 def init(u):write(u,0x9005,'B',war);write(u,0x9012,'HHB',men,arms,training);write(u,0x901a,'H',face)
 out=run(0x23702,[0x9000],init);expected=3*(war+(20 if face==163 else 0))+training+min(100,arms*100//men)
 assert out==expected,(out,expected)
 results['power'].append(dict(soldiers=men,weapons=arms,training=training,war=war,combatWarBonus=20 if face==163 else 0,power=out))
args.output.write_text(json.dumps(results,separators=(',',':'))+'\n')
print('1300 isolated native equation vectors passed (controlled RNG hooks, no DOS runtime)')
