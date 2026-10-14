"""Bounded English main.exe captive and keyboard/audio witnesses.
Run: PYTHONPATH=/path/to/unicorn python native-captive-audio-v54.py MAIN.EXE OUTPUT.json
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
for surviving in [0,1,2]:
 for hostility in [0,50,80,100]:
  def setup(u,w):
   w(0x40e4,'H',FORMER);w(WINNER,'HH',0x9200,0);w(FORMER,'HH',LEADER,0);w(FORMER+7,'B',0);w(FORMER+0xe,'B',hostility);w(LEADER+0xa,'B',1)
   w(PARTY,'H',WINNER);w(PARTY+8,'H',0);w(0x3360,'B',1);w(0x352c,'H',1)
   for i in range(41):w(0x2dc4+i*0x23+0x10,'B',1 if i<surviving else 255)
  def printed(u,w,word,byte,sp,seen):seen.append(dict(textOffset=hex(word(sp+4))))
  def choice(u,w,word,byte,sp,seen):seen.append(dict(choiceRange=[word(sp+4),word(sp+6)]));return 1
  def release(u,w,word,byte,sp,seen):seen.append(dict(released=hex(word(sp+4))));return 0
  def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
  u,seen,word,byte=run(0xa212,0x9d5,[PARTY,LEADER],setup,{0x8cfc:zero,0x4de0:zero,0x45d8:printed,0x4888:choice,0x9fc6:release,0x73a0:effect})
  assert seen==[dict(textOffset='0x46a9'),dict(effect=7),dict(choiceRange=[1,2]),dict(released=hex(LEADER))],seen
  cases.append(dict(rule='Human captured ruler menu remains Set free/Behead independent of surviving province count and hostility',survivingProvinces=surviving,hostility=hostility,events=seen,suppressed=['portrait/text renderer','input return uses Set free1','release settlement9FC6: witness proves invocation only','effect dispatcher records cue7 without audio']))
# Full captive-list controller retains native ruler detection and separate menu.
for surviving in [0,1]:
 def setup(u,w):
  w(0x40e4,'H',FORMER);w(0x40e2,'H',WINNER);w(0x40ea,'H',0xcb86);w(0x40e8,'H',0xcb72)
  u.mem_write(DS+0xcb72,bytes(40));w(0xcb72,'H',WINNER);w(0xcb78,'H',LEADER)
  w(WINNER,'HH',0x9200,0);w(FORMER,'HH',LEADER,0);w(FORMER+7,'B',0);w(LEADER,'H',0);w(LEADER+0xa,'B',1);w(0x3360,'B',1);w(0x352c,'H',1)
  for i in range(41):w(0x2dc4+i*0x23+0x10,'B',1 if i<surviving else 255)
 def printed(u,w,word,byte,sp,seen):seen.append(dict(textOffset=hex(word(sp+4))))
 def choice(u,w,word,byte,sp,seen):seen.append(dict(choiceRange=[word(sp+4),word(sp+6)]));return 1
 def release(u,w,word,byte,sp,seen):seen.append(dict(released=hex(word(sp+4))));return 0
 def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
 u,seen,word,byte=run(0xa2de,0x9d5,[],setup,{0x598a:zero,0x8c26:zero,0x8cfc:zero,0x4de0:zero,0x45d8:printed,0x4888:choice,0x9fc6:release,0x73a0:effect})
 assert seen==[dict(textOffset='0x46a9'),dict(effect=7),dict(choiceRange=[1,2]),dict(released=hex(LEADER))],seen
 cases.append(dict(rule='Full native captive list defers ruler and uses special menu even with zero provinces',survivingProvinces=surviving,events=seen,suppressed=['governance music598A','portrait/text render8C26/8CFC/4DE0/45D8','input chooses release1','release consequence9FC6','sound dispatcher73A0 recorded']))
# Native ordinary captive join path has no acceptance roll or hostility threshold.
for hostility in [0,80,100]:
 def setup(u,w):
  w(0x40e8,'H',PARTY);w(0x40e2,'H',WINNER);w(0xca9a,'H',0x9400);w(LEADER+0xa,'B',1);w(FORMER+0xe,'B',hostility);w(FORMER+4,'H',LEADER)
  w(WINNER,'H',0x9200);w(0x9206,'B',80)
 def join(u,w,word,byte,sp,seen):seen.append(dict(joinRuler=hex(word(sp+6)),officer=hex(word(sp+4))));return 0
 def place(u,w,word,byte,sp,seen):seen.append(dict(placeProvince=hex(word(sp+4)),officer=hex(word(sp+6))));return 0
 u,seen,word,byte=run(0xa0f8,0x9d5,[LEADER,PARTY],setup,{0x5bfe:join,0x5f9e:place})
 assert seen==[dict(joinRuler=hex(WINNER),officer=hex(LEADER)),dict(placeProvince='0x9400',officer=hex(LEADER))]
 assert byte(LEADER+0xa)==0 and word(FORMER+4)==0
 cases.append(dict(rule='Ordinary captive Recruit transfers service without acceptance roll or hostility test',hostility=hostility,events=seen,suppressed=['service loyalty initialization5BFE recorded only','province linked-list mutation5F9E recorded only']))
# Actual service initialization computes loyalty, never an acceptance chance.
for oldLoyalty in [70,100]:
 for difference in [0,20,100]:
  for jitter in [0,4]:
   def setup(u,w):
    w(WINNER,'H',0x9200);w(FORMER+4,'H',LEADER);w(FORMER+0xe,'B',100)
    w(LEADER+2,'BB',0,0);w(LEADER+0xa,'BB',1,oldLoyalty);w(LEADER+0xf,'B',difference);w(0x920f,'B',0)
   def random(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4)&255,value=jitter));return jitter
   u,seen,word,byte=run(0x5bfe,0x59d,[LEADER,WINNER],setup,{0x58ba:random})
   expected=100-math.isqrt(difference*(oldLoyalty//2))-jitter
   assert byte(LEADER+0xa)==0 and byte(LEADER+0xb)==expected and byte(LEADER+0xc)==1 and word(FORMER+4)==0
   cases.append(dict(rule='Authentic ordinary captive service change assigns loyalty without hostility gate',oldLoyalty=oldLoyalty,compatibilityDifference=difference,jitter=jitter,newLoyalty=byte(LEADER+0xb),events=seen,suppressed=['random jitter58BA controlled; owner, compatibility, integer square root, loyalty writes and advisor removal retained']))
# Native A196 is an AI release decision, not a recruitment decision.
for charisma,hostility,year,roll in [(80,0,189,0),(80,100,189,39),(80,100,189,40),(0,100,189,0),(100,100,189,49),(100,100,189,50),(80,0,200,0)]:
 def setup(u,w):w(PARTY,'H',FORMER);w(0x40e4,'H',WINNER);w(FORMER+0xe,'B',hostility);w(LEADER+6,'B',charisma);w(0x44,'H',year);w(WINNER+0xf,'B',80)
 def chance(u,w,word,byte,sp,seen):prob=word(sp+4)&255;seen.append(dict(releaseChance=prob,roll=roll));return int(roll<prob)
 u,seen,word,byte=run(0xa196,0x9d5,[PARTY,LEADER],setup,{0x589c:chance})
 expected=int(not(roll<(charisma+100-hostility)//2 and year<200));assert u.reg_read(UC_X86_REG_AX)==expected
 cases.append(dict(rule='AI release decision permits positive chance even at100 hostility; no native high-hostility recruit cutoff',charisma=charisma,hostility=hostility,year=year,roll=roll,events=seen,declinesRelease=bool(expected),suppressed=['random percentage589C controlled at requested roll']))
# Pure original own-key input is silent; retain controller and bound BIOS/cursor.
for key in [0x31,0x32,0x1b]:
 def setup(u,w):w(0x3530,'HH',0,0)
 u,seen,word,byte=run(0x468a,0x3ef,[],setup,{0x42ac:zero,0x4924:zero,0x4618:zero,0x4646:lambda *a:1,0x75:lambda *a:key,0x73a0:lambda u,w,wo,by,sp,se:se.append(dict(effect=wo(sp+4)&255))})
 assert u.reg_read(UC_X86_REG_AX)==key and seen==[]
 cases.append(dict(rule='Original ordinary keyboard selection has no effect dispatch',key=key,effects=seen,suppressed=['cursor/text display','BIOS key/poll returns controlled key','optional callbacks3530 null']))
# Actual bounded numeric-menu reader retains its own keyboard controller.
for keys,expected in [([0x31,13],1),([0x32,13],2),([0x33,13],3),([0x34,13,0x31,13],1)]:
 queue=list(keys)
 def setup(u,w):w(0x3530,'HH',0,0);w(0x3432,'HH',0,0)
 def key(u,w,word,byte,sp,seen):return queue.pop(0)
 def printchar(u,w,word,byte,sp,seen):w(0x3432,'H',word(0x3432)+1)
 def erase(u,w,word,byte,sp,seen):w(0x3432,'H',word(0x3432)-1)
 def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
 u,seen,word,byte=run(0x4888,0x3ef,[1,3],setup,{0x4312:zero,0x444c:printchar,0x45f0:erase,0x42ac:zero,0x4924:zero,0x4618:zero,0x4646:lambda *a:1,0x75:key,0x73a0:effect})
 assert not queue and u.reg_read(UC_X86_REG_AX)==expected and seen==[]
 cases.append(dict(rule='Original valid and retry numeric-order selection is silent',keys=keys,result=expected,effects=seen,suppressed=['cursor/character rendering only','BIOS key/poll returns provided keys','callbacks3530 null']))
# Result notification helpers10/14 are separate from ordinary input.
for start,effect in [(0x58e6,10),(0x591e,14)]:
 def setup(u,w):w(0x352c,'H',1);w(0x33b4,'B',1)
 def dispatch(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
 u,seen,word,byte=run(start,0x57c,[],setup,{0x73a0:dispatch,0x58cc:zero})
 assert seen==[dict(effect=effect)]
 cases.append(dict(rule='Explicit result notification helper invokes native cue separately from key input',entry=hex(start),effects=seen,suppressed=['final message wait/style58CC','sound dispatch recorded without playback']))
# Actual Recruit result text selects failure10 versus success14.
for success in [0,1]:
 for rulerEnvoy in [0,1]:
  def setup(u,w):
   w(0xce9a,'H',LEADER);w(0xce9e,'H',0x9200 if rulerEnvoy else 0x9400);w(WINNER,'H',0x9200);w(0x920a,'B',0);w(0x940a,'B',0);w(0x352c,'H',1);w(0x33b4,'B',1)
  def text(u,w,word,byte,sp,seen):seen.append(dict(textArgument=hex(word(sp+6))))
  def effect(u,w,word,byte,sp,seen):seen.append(dict(effect=word(sp+4)&255))
  u,seen,word,byte=run(0x162ce,0x15d7,[success],setup,{0x56ce:text,0x56f6:text,0x13658:zero,0x73a0:effect,0x58cc:zero})
  assert seen[-1]==dict(effect=14 if success else 10)
  assert any(x.get('textArgument')==hex(0x7110 if rulerEnvoy else 0x712a) for x in seen) if success else any(x.get('textArgument')==hex(0x7144 if rulerEnvoy else 0x715e) for x in seen)
  cases.append(dict(rule='Native Recruit success message uses14 and refusal message10; neither is ordinary keypress sound',success=bool(success),rulerEnvoy=bool(rulerEnvoy),events=seen,suppressed=['text buffer append/display recorded','final timed message pause58CC','effect dispatch recorded without playback']))
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,unpackedSha256=hashlib.sha256(IMAGE).hexdigest(),cases=cases,count=len(cases)),indent=2)+'\n');print(len(cases),'native v54 captive/audio witnesses passed')
