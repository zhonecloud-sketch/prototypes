from pathlib import Path
import argparse,hashlib,importlib.util,json,struct
from unicorn import Uc,UC_ARCH_X86,UC_MODE_16,UC_HOOK_CODE
from unicorn.x86_const import *
parser=argparse.ArgumentParser(description='Bounded native tactical witnesses; not a full DOS simulation.');parser.add_argument('main_exe',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
RAW=args.main_exe.read_bytes();IMAGE=bytes(original.unpack(RAW)[0]);DS=0x2fa60
assert hashlib.sha256(RAW).hexdigest()=='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
CASES=[]
def run(start,cs,args,setup,hooks=None,stop_at=None):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,IMAGE);u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xff00)
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
 def byte(at):return u.mem_read(DS+at,1)[0]
 w(0xff00,'H'*(len(args)+2),0,0x6000,*args);setup(u,w);seen=[];trace=[]
 def hook(u,at,size,data):
  trace.append(hex(at))
  if at==0x60000 or at==stop_at:u.emu_stop();return
  if at not in (hooks or {}):return
  sp=u.reg_read(UC_X86_REG_SP);ip,rcs=struct.unpack('<2H',u.mem_read(DS+sp,4));v=hooks[at](u,w,word,byte,sp,seen)
  u.reg_write(UC_X86_REG_AX,v or 0);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,rcs);u.reg_write(UC_X86_REG_IP,ip)
 u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,start-cs*16)
 try:u.emu_start(start,0x60001,count=50000)
 except Exception as e:raise RuntimeError((hex(start),trace[-30:])) from e
 assert u.reg_read(UC_X86_REG_CS)==0x6000 or (u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X86_REG_IP))==stop_at,(hex(start),trace[-25:])
 return u,seen,word,byte,trace
zero=lambda *a:0

def arena(u,w,actor=(6,4),enemy=(7,4),ai=90,ei=60,terrain=0):
 u.mem_write(DS+0xb9d0,bytes(156));u.mem_write(DS+0xba6c,bytes(156));u.mem_write(DS+0xcb72,bytes(40));u.mem_write(DS+0x9000,bytes(0x80));u.mem_write(DS+0x9100,bytes(0x80))
 w(0xcb76,'H',0x9000);w(0xcb8a,'H',0x9100);w(0xb8e6,'H',0x9000);w(0xb8df,'BB',*actor);w(0xb8d7,'BB',12,11);w(0xb8d5,'B',255)
 for ptr,(q,r),intel,flag,mp in [(0x9000,actor,ai,1,5),(0x9100,enemy,ei,4,7)]:w(ptr+4,'BB',intel,80);w(ptr+0x12,'HHBBB',5000,5000,80,mp,(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
 w(0xb9d0+enemy[1]*13+enemy[0],'B',terrain)

for ai,ei,terrain,roll in [(90,60,0,1),(60,60,0,1),(59,60,0,1),(90,60,6,1),(90,60,0,0)]:
 def setup(u,w):arena(u,w,ai=ai,ei=ei,terrain=terrain)
 def random(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255,'result':roll});return roll
 u,seen,word,byte,trace=run(0x25956,0x258b,[0x9100,7,4],setup,{0x589c:random})
 accepted=u.reg_read(UC_X86_REG_AX);assert accepted==int(ei<=ai and terrain!=6 and bool(roll))
 CASES.append(dict(rule='Human Move enemy eligibility',entry='0x25956',actorINT=ai,enemyINT=ei,enemyTerrain=terrain,accepted=bool(accepted),chanceCalls=seen))

def input_direction(u,w,word,byte,sp,seen):seen.append({'directionPrompt':word(sp+4),'showMobility':word(sp+6)});return 2
for roll in [0,1]:
 def random(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255,'result':roll});return roll
 u,seen,word,byte,trace=run(0x25ba8,0x258b,[3],arena,{0x258ce:input_direction,0x24466:zero,0x24648:zero,0x589c:random,0x2461a:zero,0x24938:zero,0x2486a:zero})
 assert byte(0x9018)==0x65 and byte(0x9017)==3 and byte(0x9117)==7
 assert byte(0x9118)==(0x64 if roll else 0x74)
 CASES.append(dict(rule='Human actor moves down and tries adjacent enemy pull',entry='0x25BA8',actorStart=[6,4],actorEnd=[6,5],actorMobilityBefore=5,actorMobilityAfter=byte(0x9017),enemyStart=[7,4],enemyEnd=[byte(0x9118)>>4,byte(0x9118)&15],enemyMobilityBefore=7,enemyMobilityAfter=byte(0x9117),calls=seen))

for ai,ei,terrain,roll in [(90,60,0,1),(60,60,0,1),(59,60,0,1),(90,60,6,1),(90,60,0,0)]:
 def setup(u,w):arena(u,w,actor=(6,5),enemy=(7,4),ai=ai,ei=ei,terrain=terrain);w(0xba6c+4*13+6,'B',0)
 def random(u,w,word,byte,sp,seen):seen.append({'chance':word(sp+4)&255,'result':roll});return roll
 u,seen,word,byte,trace=run(0x2d432,0x2d22,[6,4,6,5],setup,{0x24648:zero,0x24466:zero,0x589c:random,0x24938:zero})
 accepted=byte(0x9118)==0x64;assert accepted==int(ei<ai and terrain!=6 and bool(roll));assert byte(0x9117)==7
 CASES.append(dict(rule='AI opportunistic enemy pull after moving',entry='0x2D432',actorINT=ai,enemyINT=ei,enemyTerrain=terrain,enemyEnd=[byte(0x9118)>>4,byte(0x9118)&15],enemyMobilityAfter=byte(0x9117),pulled=accepted,chanceCalls=seen))

for actor in [(6,6),(7,5),(8,6)]:
 def setup(u,w):arena(u,w,actor=actor,enemy=(0,0));w(0xb8d7,'BB',7,6);w(0xb9d0+6*13+7,'B',6);w(0xb8d1,'B',0)
 u,seen,word,byte,trace=run(0x2a94a,0x2984,[0x9000,*actor],setup,{0x2444a:zero})
 assert [byte(0xb8db),byte(0xb8dc)]==[7,6]
 CASES.append(dict(rule='Native defender returns goal to empty palace',entry='0x2A94A',actorAt=list(actor),palace=[7,6],goal=[byte(0xb8db),byte(0xb8dc)],target=word(0xb8e4)))

def empty_palace(u,w):arena(u,w,actor=(6,4),enemy=(0,0));w(0xb9d0+6*13+7,'B',6);w(0xb8d7,'BB',7,6);u.mem_write(DS+0xe000,bytes([i%256 for i in range(512)]));w(0xca9a,'H',0xe000)
def emptylookup(u,w,word,byte,sp,seen):assert [word(sp+4),word(sp+6)]==[7,6];return 0
u,seen,word,byte,trace=run(0x266bc,0x258b,[7,6],empty_palace,{0x237ea:emptylookup,0x23488:zero,0x24648:zero})
assert byte(0xba6c+6*13+7)==32
assert bytes(u.mem_read(DS+0xe000,512))==bytes([i%256 for i in range(512)])
CASES.append(dict(rule='Burning unoccupied palace',entry='0x266BC',fireFlag=byte(0xba6c+6*13+7),provinceBytesUnchanged=512,menLoss=0))
# Native jungle draw conceals regardless of friendly adjacency.
for actor in [(6,4),(0,0)]:
 def setup(u,w):arena(u,w,actor=actor,enemy=(7,4),terrain=1)
 u,seen,word,byte,trace=run(0x24466,0x23c5,[0x9100],setup,{0x24648:zero})
 assert byte(0xba6c+4*13+7)==0x94
 CASES.append(dict(rule='Native jungle draw sets concealed/order flags irrespective of adjacency',entry='0x24466',actorAt=list(actor),enemyAt=[7,4],flagsBefore=4,flagsAfter=byte(0xba6c+4*13+7)))

# Native adjacent target selector consults true occupancy even in concealed jungle.
for terrain in [0,1]:
 def setup(u,w):arena(u,w,terrain=terrain);w(0xba6c+4*13+7,'B',20 if terrain==1 else 4);w(0xcae7,'B',0);w(0x33b3,'B',1);u.mem_write(DS+0xca8e,bytes(range(6)))
 u,seen,word,byte,trace=run(0x2c166,0x2be0,[0x9000],setup,{0x539e:zero,0x2444a:zero,0x589c:lambda *a:1})
 assert word(0xb8e4)==0x9100
 CASES.append(dict(rule='Native AI target selector sees neighbouring jungle occupancy',entry='0x2C166',enemyTerrain=terrain,enemyFlags=byte(0xba6c+4*13+7),target=hex(word(0xb8e4))))

# Palace fire at daily check destroys 30% of defending treasury and food even empty.
for gold,food,burn in [(1000,20000,True),(1,1,True),(1,2,True),(999,12345,True),(1000,20000,False)]:
 def setup(u,w):
  empty_palace(u,w);w(0xcaa1,'H',gold);w(0xcaa5,'I',food);w(0xcaa3,'H',2000);w(0xcaa9,'I',30000)
  w(0xba6c+6*13+7,'B',32 if burn else 0)
 u,seen,word,byte,trace=run(0x22dfc,0x228d,[],setup,{0x2423c:zero,0x2420e:zero,0x25138:zero})
 fg=word(0xcaa1);ff=word(0xcaa5)+(word(0xcaa7)<<16)
 assert fg==(gold*70//100 if burn else gold) and ff==(food*70//100 if burn else food)
 assert word(0xcaa3)==2000 and word(0xcaa9)+(word(0xcaab)<<16)==30000
 CASES.append(dict(rule='Daily burning empty palace destroys defender stores',entry='0x22DFC/0x22D76',burning=burn,goldBefore=gold,goldAfter=fg,foodBefore=food,foodAfter=ff,attackerStoresUnchanged=True))

# Human selector before native Move spends no actor or enemy mobility.
def key_move_enemy(u,w,word,byte,sp,seen):return 50
def select_enemy(u,w,word,byte,sp,seen):seen.append(dict(directionPrompt=word(sp+4)&255,showMobility=word(sp+6),actorMobility=byte(0x9017),enemyMobility=byte(0x9117)));return 3
def normal_move_boundary(u,w,word,byte,sp,seen):seen.append(dict(nextRoutine='0x25BA8',selectedEnemyDirection=word(sp+4)&255,actorMobility=byte(0x9017),enemyMobility=byte(0x9117)));return 0
u,seen,word,byte,trace=run(0x25cf8,0x258b,[],arena,{0x24022:zero,0x45b0:zero,0x468a:key_move_enemy,0x258ce:select_enemy,0x25ba8:normal_move_boundary})
assert byte(0x9017)==5 and byte(0x9117)==7 and any(c.get('showMobility')==0 for c in seen)
CASES.append(dict(rule='Human Move enemy direction selection costs zero MP',entry='0x25CF8',actorMobilityUnchanged=5,enemyMobilityUnchanged=7,calls=seen))

OUT={'originalSha256':hashlib.sha256(RAW).hexdigest(),'unpackedSha256':hashlib.sha256(IMAGE).hexdigest(),'cases':CASES,'limits':['Bounded Unicorn branches with input/RNG/rendering hooks; full DOS simulation not claimed.','Defender witness establishes palace goal, not all path field and tactical target branches.','No province economy write occurs in empty-palace ignition branch; global food stores are separate from tile fire.']}
args.output.write_text(json.dumps(OUT,indent=2)+'\n');print(json.dumps(OUT,indent=2))
