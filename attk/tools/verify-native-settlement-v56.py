"""Bounded English main.exe abstract retreat and captive service witnesses.
Run: PYTHONPATH=/path/to/unicorn python native-settlement-v56.py MAIN.EXE OUTPUT.json
No repo imports, no original bytes are exported. Each case describes suppressed paths.
"""
from pathlib import Path
import argparse,hashlib,json,struct,math
from unicorn import Uc,UC_ARCH_X86,UC_MODE_16,UC_HOOK_CODE
from unicorn.x86_const import *
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args();raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==EXPECTED
h=struct.unpack_from('<14H',raw);assert h[0]==0x5a4d and h[3]==0;packed=raw[h[4]*16:];stub=h[11]*16;assert packed[stub+14:stub+16]==b'RB';end=struct.unpack_from('<H',packed,stub+12)[0]*16
image=bytearray(end);src,dst=stub-1,end-1
while packed[src]==255:src-=1
while True:
 opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;assert count<=dst+1
 if opcode in [0xb0,0xb1]:image[dst-count+1:dst+1]=bytes([packed[src]])*count;src-=1
 elif opcode in [0xb2,0xb3]:assert count<=src+1;image[dst-count+1:dst+1]=packed[src-count+1:src+1];src-=count
 else:raise ValueError('Unsupported original packing')
 dst-=count
 if opcode&1:break
assert src==dst;image[:src+1]=packed[:src+1];IMAGE=bytes(image);DS=0x2fa60
cases=[]
def run(start,cs,args,setup,hooks):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,IMAGE)
 for reg,val in [(UC_X86_REG_DS,DS//16),(UC_X86_REG_SS,DS//16),(UC_X86_REG_SP,0xff00)]:u.reg_write(reg,val)
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
 def byte(at):return u.mem_read(DS+at,1)[0]
 w(0xff00,'H'*(len(args)+2),0,0x6000,*args);setup(u,w);seen=[];trace=[]
 def hook(u,at,size,data):
  trace.append(hex(at));
  if at==0x60000:u.emu_stop();return
  if at not in hooks:return
  sp=u.reg_read(UC_X86_REG_SP);ip,rcs=struct.unpack('<2H',u.mem_read(DS+sp,4));v=hooks[at](u,w,word,byte,sp,seen)
  u.reg_write(UC_X86_REG_AX,v or 0);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,rcs);u.reg_write(UC_X86_REG_IP,ip)
 u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,start-cs*16)
 try:u.emu_start(start,0x60001,count=100000)
 except Exception as e:raise RuntimeError(trace[-25:]) from e
 assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-25:]);return u,seen,word,byte
zero=lambda *a:0
WINNER=0x2b34;FORMER=0x2b34+0x29;PARTY=0x9000;LEADER=0x9300

# Retain actual neighbor selector, ownership/empty predicates and placement;
# only enumeration of supplied province candidates and success RNG are controlled.
P0=0x2dc4; P1=P0+0x23; P2=P1+0x23; TARGET=P2+0x23; OFF=0x9300; DUMMY=0x9400
def base(u,w):
 u.mem_write(DS+WINNER,bytes(0x29*16));u.mem_write(DS+P0,bytes(0x23*41))
 for i in range(41):w(P0+0x23*i+0x10,'BB',255,255)
 w(WINNER,'H',0x9200);w(FORMER,'H',0x9500);w(0x920a,'B',0);w(0x950a,'B',1)
 u.mem_write(DS+OFF,bytes(40));u.mem_write(DS+DUMMY,bytes(40));w(0xca98,'H',0);w(OFF,'H',0);w(OFF+0xa,'BB',1,90);w(OFF+4,'BB',80,80);w(OFF+0x16,'B',80);w(OFF+0x12,'H',1000)
 w(TARGET+0x10,'BB',1,255);w(TARGET+0x20,'BB',1,1);w(0xca9a,'H',TARGET)
 w(0x40e2,'H',WINNER);w(0x40e4,'H',FORMER);w(0x40e8,'H',0xcb72);w(0x40ea,'H',0xcb86)
 u.mem_write(DS+0xcb72,bytes(40));w(0xcb72,'HHHHH',FORMER,TARGET,OFF,0,0)
 w(0xcb86,'HHHHH',WINNER,P2,0,0,0)
 w(P2+0x10,'B',0);w(P2+2,'H',DUMMY);w(DUMMY,'H',0);w(DUMMY+0xa,'B',0)

def direction_for(candidate_ids):
 def enum(u,w,word,byte,sp,seen):
  index=word(sp+8)&255;value=candidate_ids[index] if index<len(candidate_ids) else 255
  seen.append(dict(direction=index,provinceIndex=value));return value
 return enum
for candidate_order in [(0,1,2),(1,0,2),(0,2,1)]:
 for friendly in [True,False]:
  for success in [True,False]:
   def setup(u,w):
    base(u,w);w(P0+0x10,'B',255);w(P1+0x10,'B',1 if friendly else 2)
    w(P1+2,'H',0x9600);w(0x9600,'H',0);w(0x960a,'B',1 if friendly else 2)
   def random(u,w,word,byte,sp,seen):
    bound=word(sp+4);value=0 if bound!=100 or success else 99;seen.append(dict(randomBound=bound,value=value));return value
   # Defender army is party0 and victor party2. mode2 activates abstract neighbor choice.
   u,seen,word,byte=run(0x20cae,0x200d,[0xcb72,2],setup,{0x5c78:direction_for(candidate_order),0x4b38:random,0x4f44:zero})
   expected=P1 if friendly else P0
   actual=word(P1+2)==0x9600 and word(0x9600)==OFF if friendly else word(P0+2)==OFF
   assert (actual if success else word(0xcb8c)==OFF),(candidate_order,friendly,success,seen,word(0xcb8c),word(P0+2),word(0x9600))
   assert byte(OFF+0xa)==1 and byte(OFF+0xb)==90
   cases.append(dict(rule='Abstract defeated defender selects occupied own province before unclaimed; failed escape becomes captive',candidateOrder=candidate_order,friendlyPresent=friendly,escapeSuccess=success,selectedProvinceIndex=(expected-P0)//0x23,joinedDestination=bool(actual),captiveList=word(0xcb8c),events=seen,suppressed=['neighbor enumeration5C78 returns provided candidate indices; native two-pass owner/empty selection retained','random4B38 controlled to allow/refuse escape; probability arithmetic retained','province redraw4F44 suppressed; actual5F9E linked-list placement retained']))
# Complete abstract entry: combat outcome is fixed, original settlement remains.
for friendly in [True,False]:
 def setup(u,w):
  base(u,w);w(P0+0x10,'B',255);w(P1+0x10,'B',1 if friendly else 2);w(P1+2,'H',0x9600);w(0x9600,'H',0);w(0x960a,'B',1 if friendly else 2);w(0xcb67,'B',0)
 def random(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4),value=0));return 0
 u,seen,word,byte=run(0x21418,0x200d,[],setup,{0x20fb4:lambda *x:1,0x21138:zero,0x5c78:direction_for((0,1,2)),0x4b38:random,0x4f44:zero})
 assert (word(0x9600)==OFF if friendly else word(P0+2)==OFF) and word(0xcb76)==0 and byte(0xcb67)==128 and byte(0xcae7)==0
 cases.append(dict(rule='Full abstract entry21418 reaches real defeated defender selection and writes; supplied combat outcome only',friendlyPresent=friendly,selectedProvinceIndex=1 if friendly else 0,events=seen,suppressed=['combat roster/build20FB4 returns present and combat21138 outcome fixed attacker victory0','neighbor enumeration5C78 and RNG4B38 controlled','redraw4F44; actual21418→20DAC→20CAE→20C26 and5F9Ewrites retained']))
# Execute exact abstract escape equation at both sides of its threshold.
for denominatorRoll,bonusRoll,ruler,portrait,occupiedNew in [(0,0,False,False,False),(2,49,False,False,False),(0,0,True,False,False),(0,0,False,True,False),(0,0,False,False,True)]:
 threshold=(80+80+80+100+bonusRoll)//(5+denominatorRoll)+(20 if ruler or portrait else 0)+(50 if occupiedNew else 0)
 for finalRoll in ([threshold-1,threshold] if threshold<=99 else [99]):
  def setup(u,w):
   base(u,w);w(0xca98,'H',int(occupiedNew));w(FORMER,'H',OFF if ruler else 0x9500);w(OFF+0x1a,'H',0xa3 if portrait else 0)
  queue=[denominatorRoll,bonusRoll,finalRoll]
  def random(u,w,word,byte,sp,seen):value=queue.pop(0);seen.append(dict(randomBound=word(sp+4),value=value));return value
  u,seen,word,byte=run(0x20b8c,0x200d,[OFF],setup,{0x4b38:random})
  assert not queue and [e['randomBound'] for e in seen]==[3,50,100] and u.reg_read(UC_X86_REG_AX)==int(finalRoll<threshold)
  cases.append(dict(rule='Native abstract escape exact equation and ruler/portrait/unclaimed bonuses',denominatorRoll=denominatorRoll,bonusRoll=bonusRoll,ruler=ruler,portraitA3=portrait,priorUnclaimedEscape=occupiedNew,threshold=threshold,finalRoll=finalRoll,escaped=bool(u.reg_read(UC_X86_REG_AX)),events=seen,suppressed=['only random4B38 controlled; exact arithmetic, ruler identification55F8 and portrait comparison retained']))
# No adjacent friendly or unclaimed destination: capture without an escape roll.
def setup(u,w):
 base(u,w);w(P0+0x10,'B',2);w(P0+2,'H',0x9600);w(0x960a,'B',2);w(P1+0x10,'B',2);w(P1+2,'H',0x9700);w(0x970a,'B',2)
def noRng(u,w,word,byte,sp,seen):raise AssertionError('No destination must not roll escape')
u,seen,word,byte=run(0x20cae,0x200d,[0xcb72,2],setup,{0x5c78:direction_for((0,1,2)),0x4b38:noRng,0x58ba:zero})
assert word(0xcb8c)==OFF and word(P0+2)==0x9600 and word(P1+2)==0x9700,(word(0xcb8c),seen)
cases.append(dict(rule='No abstract refuge captures without escape RNG',events=seen,suppressed=['candidate enumeration5C78; captive injury duration58BA fixed0; native capture list20AE8 retained']))
# Full native ordinary captive controller, including real loyalty initialization and placement.
for human in [True,False]:
 for oldLoyalty in [0,90,99,100]:
  for difference in [0,100]:
   for jitter in [0,4]:
    for strength in [69,70]:
     def setup(u,w):
      base(u,w);u.mem_write(DS+0xcb72,bytes(40));w(0xcb72,'HHHHH',WINNER,P2,0,OFF,0);w(0x40e8,'H',0xcb72);w(0x40ea,'H',0xcb86)
      w(0xca9a,'H',P2);w(0x3360,'BB',1 if human else 0,0);w(OFF+0xa,'BB',1,oldLoyalty);w(OFF+4,'BB',strength,0);w(OFF+0xf,'B',difference);w(0x920f,'B',0);w(FORMER+4,'H',OFF)
     def menu(u,w,word,byte,sp,seen):seen.append(dict(inputRange=[word(sp+4),word(sp+6)],choice=1));return 1
     def random(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4)&255,value=jitter));return jitter
     def terminal(u,w,word,byte,sp,seen):seen.append(dict(beheaded=word(sp+4)));return 0
     u,seen,word,byte=run(0xa2de,0x9d5,[],setup,{0x598a:zero,0x8c26:zero,0x8cfc:zero,0x4de0:zero,0x45d8:zero,0x4888:menu,0x58ba:random,0x6062:terminal})
     joins=human or strength>=70;expected=100-math.isqrt(difference*(oldLoyalty//2))-jitter
     if joins:assert byte(OFF+0xa)==0 and byte(OFF+0xb)==expected and word(DUMMY)==OFF and word(FORMER+4)==0,(human,oldLoyalty,difference,jitter,strength,seen,byte(OFF+0xa),word(DUMMY))
     else:assert byte(OFF+0xa)==1 and seen==[dict(beheaded=OFF)]
     cases.append(dict(rule='Full native ordinary captive Recruit is unconditional for human; AI recruits at INT+WAR>=70 otherwise beheads',human=human,oldLoyalty=oldLoyalty,compatibilityDifference=difference,jitter=jitter,intPlusWar=strength,recruited=joins,newLoyalty=byte(OFF+0xb),events=seen,suppressed=['music598A and render8C26/8CFC/4DE0/45D8','human menu4888 chooses Recruit1','loyalty jitter58BA controlled; native owner/initializer/integer-square-root/5F9Eplacement retained','terminal6062 recorded instead of removing officer']))
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,unpackedSha256=hashlib.sha256(IMAGE).hexdigest(),cases=cases,count=len(cases)),indent=2)+'\n');print(len(cases),'native settlement v56 witnesses passed')
