"""Portable bounded main.exe concealed-target and empty-hex command witnesses.
Usage: PYTHONPATH=<unicorn> python native-concealed-v56.py main.exe output.json
Rendering, UI input and casualty resolution hooks are listed with every witness.
No source binary is copied, no AI training is run, no full DOS parity is claimed.
"""
import argparse,hashlib,json,struct
from pathlib import Path
from unicorn import Uc,UC_ARCH_X86,UC_MODE_16,UC_HOOK_CODE
from unicorn.x86_const import *
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
def unpack(data):
 h=struct.unpack_from('<14H',data);assert h[0]==0x5a4d and h[3]==0
 packed=data[h[4]*16:];stub=h[11]*16;assert packed[stub+14:stub+16]==b'RB'
 output=bytearray(struct.unpack_from('<H',packed,stub+12)[0]*16);src,dst=stub-1,len(output)-1
 while packed[src]==255:src-=1
 while True:
  opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert count<=dst+1
  if opcode in [0xb0,0xb1]:output[dst-count+1:dst+1]=bytes([packed[src]])*count;src-=1
  elif opcode in [0xb2,0xb3]:output[dst-count+1:dst+1]=packed[src-count+1:src+1];src-=count
  else:raise ValueError(opcode)
  dst-=count
  if opcode&1:break
 assert src==dst;output[:src+1]=packed[:src+1];return bytes(output)
raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60

def run(start,cs,args,setup,hooks):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,IMAGE);u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xff00)
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
 def byte(at):return u.mem_read(DS+at,1)[0]
 w(0xff00,'H'*(len(args)+2),0,0x6000,*args);setup(u,w);seen=[];trace=[]
 def hook(u,at,size,data):
  trace.append(hex(at))
  if at==0x60000:u.emu_stop();return
  if at not in hooks:return
  sp=u.reg_read(UC_X86_REG_SP);ip,rcs=struct.unpack('<2H',u.mem_read(DS+sp,4));v=hooks[at](u,w,word,byte,sp,seen)
  u.reg_write(UC_X86_REG_AX,v or 0);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,rcs);u.reg_write(UC_X86_REG_IP,ip)
 u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,start-cs*16)
 try:u.emu_start(start,0x60001,count=150000)
 except Exception as e:raise RuntimeError(trace[-30:]) from e
 assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-30:])
 return u,seen,word,byte
zero=lambda *a:0

def arena(u,w):
 for offset,length in [(0xb9d0,156),(0xba6c,156),(0xcb72,40),(0x9000,0x80),(0x9100,0x80),(0x9200,0x80)]:u.mem_write(DS+offset,bytes(length))
 w(0x352c,'H',0);w(0xcb76,'H',0x9000);w(0xcb8a,'H',0x9100);w(0xb8e6,'H',0x9000);w(0xb8df,'BB',6,4);w(0xb8d7,'BB',12,11);w(0xb8d5,'B',255);w(0xb8e2,'B',0);w(0x33b3,'B',1)
 for ptr,(q,r),flag in [(0x9000,(6,4),129),(0x9100,(7,4),148),(0x9200,(7,5),129)]:w(ptr+4,'BB',70,70);w(ptr+0x12,'HHBBB',5000,4000,80,7,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
 w(0x9000,'H',0x9200);w(0xb9d0+4*13+7,'B',1)

def flash(u,w,word,byte,sp,seen):seen.append(dict(kind='flash',source=[word(sp+4)&255,word(sp+6)&255],target=[word(sp+8)&255,word(sp+10)&255]))
def exchange(u,w,word,byte,sp,seen):seen.append(dict(kind='exchange',attacker=hex(word(sp+4)),defender=hex(word(sp+6)),factor=word(sp+8)));return 1
UI={0x24022:zero,0x45b0:zero,0x458a:zero,0x466c:zero,0x4888:zero,0x581e:zero,0x24466:zero,0x24f4c:zero,0x2417c:zero,0x2420e:zero,0x241ba:zero,0x4b38:zero,0x24baa:zero,0x2603e:zero}
results=[]
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
 for flags in [132,148]:
  def setup(u,w):arena(u,w);w(0xb8d6,'B',mode);w(0xba6c+4*13+7,'B',flags)
  u,seen,word,byte=run(0x265ae,0x258b,[7,4,3,0],setup,dict(UI)|{0x250f8:flash,0x24c58:exchange})
  calls=[x for x in seen if x['kind']=='exchange'];assert len(calls)==(2 if mode==2 else 1),(mode,flags,seen)
  assert u.reg_read(UC_X86_REG_AX)==1 and byte(0xb8e2)==1 and byte(0x9017)==7
  results.append(dict(test='CONCEALED-JUNGLE-'+name.upper(),entry='0x265AE',mode=mode,targetTerrain=1,targetFlags=flags,accepted=True,dailyOrderComplete=bool(byte(0xb8e2)),mobilityAfter=byte(0x9017),calls=seen,hooks=['Combat flashes/UI/redraw intercepted','Combat casualty body returns terminal status1 without mutating soldiers','RNG controlled zero','Native occupancy lookup, hostile-side predicate, controller dispatch and handler branches retained']))
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
 for terrain in [0,1,3,4]:
  def setup(u,w):arena(u,w);w(0xb8d6,'B',mode);w(0xba6c+4*13+7,'B',0);w(0x9118,'B',0x84);w(0xb9d0+4*13+7,'B',terrain)
  u,seen,word,byte=run(0x265ae,0x258b,[7,4,3,0],setup,dict(UI)|{0x250f8:flash,0x24c58:exchange})
  assert not any(x['kind']=='exchange' for x in seen) and byte(0xb8e2)==1 and byte(0x9017)==7 and byte(0xba6c+4*13+6)==129
  results.append(dict(test='EMPTY-HEX-'+name.upper(),entry='0x265AE',mode=mode,targetTerrain=terrain,accepted=True,dailyOrderComplete=True,mobilityAfter=byte(0x9017),initiatorCellFlagsAfter=byte(0xba6c+4*13+6),calls=seen,hooks=['Combat flashes/UI intercepted; charge actor redraw intercepted','No casualty or RNG helper reached','Native empty-cell and dailyOrderComplete write retained'],limits=['This dispatcher accepts empty cells irrespective of terrain; legality of hypothetical input preceding this dispatcher is separately witnessed for an adjacent jungle cell.']))
# Execute the actual human daily controller, attack submenu, geometry, occupancy
# lookup and dispatcher. Empty attempts advance once to the next army officer.
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
 for flags in [0,132,148]:
  activated=[];keys=[]
  def setup(u,w):
   arena(u,w);w(0xba6c+4*13+7,'B',flags)
   if not flags:w(0x9118,'B',0x84)
   w(0xb1aa+0x32*4,'HH',0x26980-0x258b0,0x258b)
  def input(u,w,word,byte,sp,seen):
   # Saved return CS distinguishes daily menu from native attack submenu.
   if word(sp+2)==0x2257:activated.append(hex(word(0xb8e6)));keys.append('army-command');return 0x32
   keys.append('attack-mode');return 0x30+mode
  def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
  hooks=dict(UI)|{0x24262:zero,0x24274:zero,0x468a:input,0x444c:zero,0x2297c:zero,0x57ac:maximum,0x25fde:lambda *a:3,0x250f8:flash,0x24c58:exchange}
  u,seen,word,byte=run(0x226a0,0x2257,[0x9000],setup,hooks)
  assert activated==['0x9000','0x9200'] and byte(0x9017)==7 and byte(0x9217)==7,(mode,activated,keys,seen)
  calls=[x for x in seen if x['kind']=='exchange'];assert len(calls)==((2 if mode==2 else 1) if flags else 0),(mode,flags,calls)
  results.append(dict(test=('OCCUPIED' if flags else 'EMPTY')+'-JUNGLE-'+name.upper()+'-ADVANCES-HUMAN-CONTROLLER',entry='0x226A0 ->0x26980 ->0x26804 ->0x265AE',mode=mode,targetTerrain=1,targetFlags=flags,activatedUnits=activated,keyboardStages=keys,mobilityAfter=[byte(0x9017),byte(0x9217)],calls=seen,hooks=['Keyboard characters and adjacent direction input controlled','Rendering, generic key redraw, end-of-order fire/outcome processing suppressed','Native activation mobility maximum uses equivalent max helper','Original attack submenu, geometry, occupancy, allegiance/same-side checks, dispatch and linked-list progression retained','Occupied case casualty helper returns terminal status1 without soldier mutation'],limits=['After-order fire processing is suppressed; remaster integration must separately cover burning miss fire casualties exactly once.','Occupied controller witnesses demonstrate reachable command/exchange, not casualty consequences.']))
# Friendly occupancy is rejected by the native hostile-side predicate, retaining
# the daily order and mobility. This is distinct from a concealed empty miss.
for mode,name in [(1,'Normal'),(2,'Simultaneous'),(4,'Charge')]:
 def setup(u,w):
  arena(u,w);w(0xb8d6,'B',mode);w(0xba6c+4*13+7,'B',129);w(0x9200,'H',0x9100);w(0xcb8a,'H',0)
 u,seen,word,byte=run(0x265ae,0x258b,[7,4,3,0],setup,dict(UI)|{0x250f8:flash,0x24c58:exchange})
 assert u.reg_read(UC_X86_REG_AX)==0 and byte(0xb8e2)==0 and byte(0x9017)==7 and not seen
 results.append(dict(test='FRIENDLY-JUNGLE-'+name.upper()+'-REJECTED',entry='0x265AE',mode=mode,targetTerrain=1,targetFlags=129,accepted=False,dailyOrderComplete=False,mobilityAfter=7,calls=seen,hooks=['Same UI/combat hooks as preceding dispatcher probes; none reached','Actual native lookup and hostile-side predicate retained']))
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results,limits=['No full DOS simulation; graphics/sound not played','Combat consequence details suppressed in occupied-target legality cases; use existing native joint/casualty witnesses for equations','Empty-terrain dispatcher probes do not establish broad game input policy for visible empty ground']),indent=2)+'\n');print(len(results),'native concealed/empty target witnesses passed')
