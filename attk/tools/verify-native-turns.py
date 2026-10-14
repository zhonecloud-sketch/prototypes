"""Original movement, fire, deployment and simultaneous flags; optional Unicorn.
Arithmetic/branches run unchanged; controlled UI, input, eligibility and cost-field
hooks keep these cases bounded. Full deployment and DOS parity are not claimed.
"""
import argparse,hashlib,importlib.util,json,struct
from pathlib import Path
from unicorn import *
from unicorn.x86_const import *
p=argparse.ArgumentParser(description='Bounded native battle rule checks; UI/input/lookup hooks, no DOS simulation.');p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==original.EXPECTED
image=bytes(original.unpack(raw)[0]);DS=0x2fa60;out={'originalSha256':original.EXPECTED,'cases':[]}

def run(start,args,setup,hooks):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,image);u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xff00)
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack(fmt,*v))
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
 w(0xff00,'H'*(len(args)+2),0,0x6000,*args);setup(u,w)
 seen=[]
 def hook(u,at,size,data):
  if at==0x60000:u.emu_stop();return
  if at not in hooks:return
  sp=u.reg_read(UC_X86_REG_SP);ip,cs=struct.unpack('<2H',u.mem_read(DS+sp,4));v=hooks[at](u,w,word,sp,seen)
  u.reg_write(UC_X86_REG_AX,v or 0);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
 u.hook_add(UC_HOOK_CODE,hook);cs=0x258b if 0x258b0<=start<0x269c0 else 0x269c if 0x269c0<=start<0x277e0 else 0x228d if 0x228d0<=start<0x2333c else 0x2475;u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,start-cs*16);u.emu_start(start,0x60001,count=200000);assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),hex(u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X86_REG_IP)))
 return u,seen
zero=lambda *x:0

def setup(u,w):
 u.mem_write(DS+0xb9d0,bytes(156));u.mem_write(DS+0xba6c,bytes(156));w(0xb8e6,'H',0x9000);w(0x9012,'HHBB',5000,5000,80,5);w(0x9018,'B',0x64);w(0xb8df,'BB',6,4);w(0xb8d5,'B',255);w(0xb8d7,'BB',12,11);w(0xba6c+4*13+6,'B',129);w(0xb9d0+6*13+6,'B',1)
u,seen=run(0x25ba8,[0],setup,{0x258ce:lambda *x:2,0x24648:zero,0x24466:zero,0x23866:zero,0x238bc:zero,0x24938:zero})
assert list(u.mem_read(DS+0x9017,2))==[0,0x66]
out['cases'].append(dict(rule='Move',entry='0x25BA8',mobility=5,terrain=[0,1],start=[6,4],end=[6,6],remaining=0))
for mode in [0,1]:
 u,seen=run(0x24752,[0x9000,mode],setup,{0x4b38:lambda u,w,word,sp,seen:word(sp+4)//2,0x24466:zero})
 lost=5000-struct.unpack('<H',u.mem_read(DS+0x9012,2))[0];assert lost==[750,125][mode]
 out['cases'].append(dict(rule='Fire damage',entry='0x24752',mode=mode,men=5000,randomFraction=.5,loss=lost))
# Control only UI, lookup and combat resolution; the action-flag writes run unchanged.
def simultaneous(u,w):
 setup(u,w);w(0xb8df,'BB',6,6);w(0x9018,'B',0x66);w(0xba6c+7*13+6,'B',129);w(0xba6c+7*13+7,'B',129);w(0xba6c+6*13+7,'B',132)
def lookup(u,w,word,sp,seen):return 0x9000 if (word(sp+4)&255)==6 else 0x9100
u,seen=run(0x26072,[0x9200,7,6],simultaneous,{0x249dc:lambda u,w,word,sp,seen:int(word(sp+4)<2),0x237ea:lookup,0x250f8:zero,0x24c58:lambda *x:1,0x24baa:zero})
flags=[u.mem_read(DS+0xba6c+7*13+q,1)[0] for q in [6,7]];assert flags==[1,1]
out['cases'].append(dict(rule='Simultaneous friendly action flags',entry='0x26072',before=[129,129],after=flags))

def deploy(u,w):
 setup(u,w);u.mem_write(DS+0xba6c,bytes(156));w(0xb8d7,'BB',6,6);w(0xb9d0+6*13+6,'B',6)
u,seen=run(0x26d58,[0,0x9000,3],deploy,{})
assert u.mem_read(DS+0x9018,1)[0]==0x66
out['cases'].append(dict(rule='Empty palace first defender',entry='0x26D58',army=0,end=[6,6]))
def occupied(u,w):
 deploy(u,w);w(0xba6c+6*13+6,'B',1);u.mem_write(DS+0xb8fc,bytes([0x53,0x63,255]));u.mem_write(DS+0xcbce,bytes([250]*156));w(0xcbce+3*13+5,'B',3);w(0xcbce+3*13+6,'B',3);w(0xb9d0+3*13+6,'B',1);w(0xb8ca,'B',0)
u,seen=run(0x26d58,[0,0x9000,3],occupied,{})
assert u.mem_read(DS+0x9018,1)[0]==0x63
out['cases'].append(dict(rule='Defender placement cost-field tie prefers higher terrain code',entry='0x26D58',army=0,controlledCostField=True,end=[6,3]))
u,seen=run(0x26d58,[2,0x9000,3],occupied,{0x58ba:lambda *x:0})
assert u.mem_read(DS+0x9018,1)[0]==0x53
out['cases'].append(dict(rule='Attacker chooses controlled random legal zone cell',entry='0x26D58',army=2,randomIndex=0,end=[5,3]))
def rainy(u,w):
 setup(u,w);w(0xcaad,'B',3);w(0xba6c+4*13+6,'B',33)
u,seen=run(0x22c68,[],rainy,{0x237ea:zero,0x24648:zero})
assert u.mem_read(DS+0xba6c+4*13+6,1)[0]==1
out['cases'].append(dict(rule='Rain clears fire bit before spread',entry='0x22C68',before=33,after=1))
def burning(u,w):
 setup(u,w);w(0xba6c+4*13+6,'B',33)
u,seen=run(0x2297c,[],burning,{0x24752:lambda u,w,word,sp,seen:seen.append(dict(unit=word(sp+4),mode=word(sp+6))),0x2417c:zero,0x241da:zero})
assert seen==[dict(unit=0x9000,mode=0)]
out['cases'].append(dict(rule='After acting, burning unit uses mode zero',entry='0x2297C',calls=seen))
a.output.write_text(json.dumps(out,indent=2)+'\n');print(f"{len(out['cases'])} bounded native battle rule checks passed")
