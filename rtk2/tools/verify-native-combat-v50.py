from pathlib import Path
import argparse,hashlib,importlib.util,struct,json
from unicorn import *
from unicorn.x86_const import *
parser=argparse.ArgumentParser(description='Bounded v50 combat animation, action-readiness and local AI flight witnesses.');parser.add_argument('main_exe',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
RAW=args.main_exe.read_bytes();assert hashlib.sha256(RAW).hexdigest()==original.EXPECTED;IMAGE=bytes(original.unpack(RAW)[0]);DS=0x2fa60
cases=[]
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
 try:u.emu_start(start,0x60001,count=50000)
 except Exception as e:raise RuntimeError(trace[-30:]) from e
 assert u.reg_read(UC_X86_REG_CS)==0x6000,(hex(start),trace[-30:])
 return u,seen,word,byte
zero=lambda *a:0

def arena(u,w):
 u.mem_write(DS+0xb9d0,bytes(156));u.mem_write(DS+0xba6c,bytes(156));u.mem_write(DS+0xcb72,bytes(40));u.mem_write(DS+0x9000,bytes(0x100));u.mem_write(DS+0x9100,bytes(0x100));u.mem_write(DS+0x9200,bytes(0x100))
 w(0x352c,'H',0);w(0xcb76,'H',0x9000);w(0xcb8a,'H',0x9100);w(0xb8e6,'H',0x9000);w(0xb8df,'BB',6,4);w(0xb8d7,'BB',12,11);w(0xb8d5,'B',255)
 for ptr,(q,r),flag in [(0x9000,(6,4),129),(0x9100,(7,4),132),(0x9200,(7,5),132)]:w(ptr+4,'BB',89,80);w(ptr+0x12,'HHBBB',5000,5000,80,7,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)

def lookup(u,w,word,byte,sp,seen):return 0x9000 if word(sp+4)&255==6 else 0x9100
for intel in [89,90]:
 def setup(u,w):arena(u,w);w(0x9004,'B',intel);w(0xb9d0+4*13+7,'B',1)
 def animate(u,w,word,byte,sp,seen):seen.append({'flash':[word(sp+4)&255,word(sp+6)&255,word(sp+8)&255,word(sp+10)&255]})
 u,seen,word,byte=run(0x247c6,0x2475,[6,4,7,4],setup,{0x250f8:animate,0x237ea:lookup,0x238fa:zero,0x24466:zero,0x2417c:zero,0x4b38:lambda *a:0})
 assert byte(0xba6c+4*13+7)==4 and byte(0x9117)==7 and seen==[{'flash':[6,4,7,4]}]
 cases.append(dict(rule='Ambush spends ambusher readiness before casualty even INT90 evasion',entry='0x247C6',moverINT=intel,ambusherFlagsBefore=132,ambusherFlagsAfter=byte(0xba6c+4*13+7),ambusherMPAfter=byte(0x9117),calls=seen))
for ambusherFlags in [4,132]:
 def setup(u,w):
  arena(u,w);w(0xb9d0+4*13+7,'B',1);w(0xba6c+4*13+7,'B',ambusherFlags);w(0x9000,'H',0);w(0x9100,'H',0)
 def intercept(u,w,word,byte,sp,seen):seen.append([word(sp+4)&255,word(sp+6)&255,word(sp+8)&255,word(sp+10)&255]);return 0
 u,seen,word,byte=run(0x24938,0x2475,[1,6,4,0],setup,{0x247c6:intercept})
 assert seen==[[6,4,7,4]],(ambusherFlags,seen)
 cases.append(dict(rule='Native forward ambush trigger does not require unused daily order',entry='0x24938/0x239D6',ambusherFlags=ambusherFlags,calls=seen))
# Shared flash renderer: 8 source/target cycles, with a double redraw per tile.
def frame(u,w,word,byte,sp,seen):seen.append([byte(0xb8df),byte(0xb8e0)])
u,seen,word,byte=run(0x250f8,0x24aa,[6,4,7,4],arena,{0x2361e:frame,0x6ebe:zero})
assert seen==sum(([[6,4]]*2+[[7,4]]*2 for _ in range(8)),[])
cases.append(dict(rule='Shared combat flash sequence',entry='0x250F8/0x250AE',cycles=8,tileFrames=seen))
# AI flight predicate keeps original local threat calculation while stubbing
# strategic situation/lookup/exit hooks. Both attacker and defender branches.
for side in [0,1,2,3]:
 for men,enemy,leader,roll,expected in [(99,100,False,1,True),(99,100,False,0,False),(99,100,True,0,False),(499,1500,False,1,True),(500,1501,False,1,False),(799,2400,True,1,True),(800,2401,True,1,False),(499,1497,False,1,False)]:
  def setup(u,w):arena(u,w);w(0x9012,'H',men);w(0x9112,'H',enemy);w(0xb8d0,'BBBB',0,0,0,0)
  def chance(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255});return roll
  def eligibility(u,w,word,byte,sp,seen):return int((word(sp+4)&255)==5)
  hooks={0x25810:zero,0x2444a:lambda *a:int(leader),0x23532:lambda *a:1,0x23834:lambda *a:4 if side>=2 else 1,0x589c:chance,0x249dc:eligibility,0x237ea:lambda *a:0x9100,0x2396a:zero,0x2bdc0:zero,0x2bdd4:zero}
  u,seen,word,byte=run(0x2b18a,0x2984,[0x9000,side],setup,hooks)
  expected=expected or men<100 and side>=2;result=bool(u.reg_read(UC_X86_REG_AX));assert result==expected,(side,men,enemy,leader,roll,result)
  cases.append(dict(rule='Native AI local flight decision',entry='0x2B18A/0x2AB5E',side=side,men=men,adjacentEnemyMen=enemy,commander=leader,randomSuccess=roll,withdraw=result,calls=seen))
def simultaneous(u,w):
 arena(u,w);w(0xb8df,'BB',6,6);w(0x9018,'B',0x66);w(0xba6c+7*13+6,'B',129);w(0xba6c+7*13+7,'B',129);w(0xba6c+6*13+7,'B',132)
def eligibility(u,w,word,byte,sp,seen):return int(word(sp+4)<2)
u,seen,word,byte=run(0x26072,0x258b,[0x9200,7,6],simultaneous,{0x249dc:eligibility,0x237ea:lookup,0x250f8:zero,0x24c58:lambda *a:255,0x24baa:zero})
assert byte(0xba6c+6*13+7)==4 and [byte(0xba6c+7*13+q) for q in [6,7]]==[1,1]
cases.append(dict(rule='Completed simultaneous attack spends attacker and target readiness',entry='0x26072',attackerFlagsBefore=[129,129],attackerFlagsAfter=[byte(0xba6c+7*13+q) for q in [6,7]],enemyFlagsBefore=132,enemyFlagsAfter=byte(0xba6c+6*13+7)))
for side in [0,1,2,3]:
 for men,fire,trapped,noExit,expected in [(2999,True,True,False,True),(3000,True,True,False,False),(2999,True,False,False,False),(99,False,True,True,False)]:
  def setup(u,w):arena(u,w);w(0x9012,'H',men);w(0xb8d0,'BBBB',0,0,0,0);w(0xcae7,'B',0)
  hooks={0x25810:lambda *a:int(noExit),0x2ab5e:zero,0x2444a:zero,0x2bde0:zero,0x2396a:lambda *a:int(fire),0x2c350:lambda *a:int(trapped)}
  u,seen,word,byte=run(0x2b18a,0x2984,[0x9000,side],setup,hooks)
  result=bool(u.reg_read(UC_X86_REG_AX));assert result==expected,(side,men,fire,trapped,noExit,result)
  cases.append(dict(rule='Native AI trapped fire / no province exit flight gate',entry='0x2B18A',side=side,men=men,burning=fire,noAffordableHex=trapped,noProvinceExit=noExit,withdraw=result))
for terrain in [0,1]:
 def setup(u,w):arena(u,w);w(0xb8d6,'B',2);w(0xb9d0+4*13+7,'B',terrain)
 def dispatch(u,w,word,byte,sp,seen):seen.append(dict(routine='0x26072',target=hex(word(sp+4)),q=word(sp+6)&255,r=word(sp+8)&255))
 u,seen,word,byte=run(0x265ae,0x258b,[7,4,3,1],setup,{0x26072:dispatch,0x24f4c:zero})
 assert seen==[dict(routine='0x26072',target='0x9100',q=7,r=4)] and u.reg_read(UC_X86_REG_AX)==1
 cases.append(dict(rule='Native human simultaneous dispatcher accepts occupied jungle as well as plain',entry='0x265AE',terrain=terrain,mode=2,accepted=True,calls=seen))
for terrain in [0,1]:
 for enemyFlags in [132,148]:
  flashes=[]
  def setup(u,w):
   arena(u,w);w(0xb8df,'BB',6,7);w(0x9000,'H',0x9100);w(0x9100,'H',0);w(0x9200,'H',0);w(0xcb76,'H',0x9000);w(0xcb8a,'H',0x9200);u.mem_write(DS+0xba6c,bytes(156))
   for ptr,(q,r),flag in [(0x9000,(6,7),129),(0x9100,(7,7),129),(0x9200,(7,6),enemyFlags)]:w(ptr+0x18,'B',(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
   w(0xb9d0+6*13+7,'B',terrain);w(0x33b3,'B',1)
  def exchange(u,w,word,byte,sp,seen):seen.append(dict(attacker=hex(word(sp+4)),defender=hex(word(sp+6)),factor=word(sp+8)));return 255
  def animate(u,w,word,byte,sp,seen):flashes.append([word(sp+4)&255,word(sp+6)&255,word(sp+8)&255,word(sp+10)&255])
  u,seen,word,byte=run(0x26072,0x258b,[0x9200,7,6],setup,{0x250f8:animate,0x24c58:exchange,0x24baa:zero})
  assert seen==[dict(attacker='0x9000',defender='0x9200',factor=2),dict(attacker='0x9100',defender='0x9200',factor=2)],seen
  assert flashes==[[6,7,7,6],[7,7,7,6]],flashes
  cases.append(dict(rule='Native simultaneous handler performs both exchanges against jungle target',entry='0x26072',terrain=terrain,enemyFlags=enemyFlags,actualEligibilityAndLookup=True,calls=seen,flashCalls=flashes))
args.output.write_text(json.dumps({'originalSha256':hashlib.sha256(RAW).hexdigest(),'cases':cases,'limits':['Bounded Unicorn branches with controlled input, rendering, occupancy, army status and RNG hooks; no full DOS simulation.','Flight witnesses establish local low-men threat and fire branches; original strategic whole-army withdrawal flags remain untraced.','The remaster intentionally excludes concealed hostile positions from AI threat assessment.']},indent=2)+'\n');print(len(cases),'bounded witnesses passed')
