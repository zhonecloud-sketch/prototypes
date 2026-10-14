from pathlib import Path
import sys,json
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+' ORIGINAL_MAIN_EXE OUTPUT_JSON')
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in [89,90]:')[0].replace("Path(__file__).with_name('verify-original.py')","Path(__file__).with_name('verify-original.py')"))
results=[]
for side in [0,2]:
 for leader in [False,True]:
  for palace in [False,True]:
   for difficulty in [1,5]:
    def setup(u,w):
     arena(u,w);w(0x9012,'H',3000);w(0x33b3,'B',difficulty);w(0xb8df,'BB',6,7);w(0xb8e4,'H',0x9200)
     w(0x9000,'H',0x9100);w(0x9100,'H',0);w(0x9200,'H',0);w(0xcb76,'H',0x9000 if side==0 else 0x9200);w(0xcb8a,'H',0x9000 if side==2 else 0x9200)
     u.mem_write(DS+0xba6c,bytes(156))
     for ptr,(q,r),flag in [(0x9000,(6,7),129 if side==0 else 132),(0x9100,(7,7),1 if side==0 else 4),(0x9200,(7,6),4 if side==0 else 1)]:w(ptr+0x18,'B',(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
     w(0xb9d0+7*13+6,'B',6 if palace else 0)
    def target(u,w,word,byte,sp,seen):w(0xb8e4,'H',0x9200)
    def exchange(u,w,word,byte,sp,seen):seen.append(dict(attacker=hex(word(sp+4)),defender=hex(word(sp+6)),factor=word(sp+8)));return 255
    hooks={0x2c166:target,0x2444a:lambda *a:int(leader),0x2bea8:zero,0x2c3b2:zero,0x24e6c:zero,0x24f4c:zero,0x24de0:zero,0x250f8:zero,0x24c58:exchange,0x24baa:zero,0x2b7a8:zero,0x581e:zero,0x24022:zero,0x45b0:zero,0x45d8:zero,0x24de0:zero}
    u,seen,word,byte=run(0x2b306,0x2984,[0x9000,6,7],setup,hooks)
    assert byte(0xb8d6)==2,(side,leader,palace,difficulty,seen,byte(0xb8d6))
    assert seen==[dict(attacker='0x9000',defender='0x9200',factor=2),dict(attacker='0x9100',defender='0x9200',factor=2)],seen
    results.append(dict(test='AI-JOINT-PALACE-PRIORITY',nativeSide=side,commander=leader,sourcePalace=palace,difficulty=difficulty,selectedMode=2,exchangeCalls=seen,limits='Target selection, leader identity, charge predicate and strategic commander-risk predicate controlled; original attack selection, original adjacency and original joint exchange assembly execute unchanged.'))
# Original jungle redraw: no side / active-side exception in the renderer.
for sideflag in [1,4]:
 for before in [0,16,128,144]:
  def setup(u,w):arena(u,w);w(0xb9d0+4*13+7,'B',1);w(0xba6c+4*13+7,'B',sideflag|before)
  def redraw(u,w,word,byte,sp,seen):seen.append(dict(terrainOnly=[word(sp+4)&255,word(sp+6)&255]))
  u,seen,word,byte=run(0x24466,0x23c5,[0x9100],setup,{0x24648:redraw})
  assert seen==[dict(terrainOnly=[7,4])] and byte(0xba6c+4*13+7)==sideflag|144
  results.append(dict(test='JUNGLE-DRAW-NO-TURN-EXCEPTION',ownSideFlag=sideflag,flagsBefore=sideflag|before,flagsAfter=byte(0xba6c+4*13+7),calls=seen,limits='Executes original draw branch; establishes terrain-only redraw in jungle, not complete visibility state machine.'))
# Repeat ignition executes native damage even when the tile is already burning.
for men in [99,100,101,1000,9999]:
 for burning in [False,True]:
  def setup(u,w):arena(u,w);w(0x9112,'H',men);w(0xba6c+4*13+7,'B',4|(32 if burning else 0))
  def rng(u,w,word,byte,sp,seen):seen.append(dict(randomBound=word(sp+4)));return max(0,word(sp+4)-1)
  def depletion(u,w,word,byte,sp,seen):seen.append(dict(fireDeath=hex(word(sp+4))));return 0
  u,seen,word,byte=run(0x266bc,0x258b,[7,4],setup,{0x23488:lambda *a:2,0x24648:zero,0x4b38:rng,0x22cf0:depletion,0x235a8:zero,0x235c4:zero,0x24466:zero})
  loss=men if men<100 else men-word(0x9112);expected=men if men<100 else max(0,men*5//100-1)
  assert loss==expected,(men,burning,seen,loss,expected)
  results.append(dict(test='FIRE-REIGNITE-NATIVE-5PERCENT',menBefore=men,alreadyBurning=burning,loss=loss,menAfter=0 if men<100 else word(0x9112),flagsAfter=byte(0xba6c+4*13+7),calls=seen,limits='Ignition + immediate native casualty arithmetic run unchanged; rendering, death processing, proportional weapon mutation and RNG are hooked.'))
# Native fireball chance: actual terrain/weather/intelligence equation, RNG controlled.
for terrain in [0,1,2,3,4,5,6]:
 for actorINT,targetINT in [(60,60),(90,60),(60,90)]:
  for weather in [0,1,2,3]:
   draws=[]
   def setup(u,w):arena(u,w);w(0x9004,'B',actorINT);w(0x9104,'B',targetINT);w(0xb9d0+4*13+7,'B',terrain);w(0xcaad,'B',weather)
   def rng(u,w,word,byte,sp,seen):draws.append(word(sp+4));return max(0,word(sp+4)-1)
   def chance(u,w,word,byte,sp,seen):seen.append(dict(chance=word(sp+4)&255));return 1
   u,seen,word,byte=run(0x24b2c,0x24aa,[7,4],setup,{0x4b38:rng,0x589c:chance})
   base=[80,90,70,60,0,50,20][terrain]+(0 if terrain==4 else 9)
   expected=None if weather==3 or base==0 else min(100,(101-targetINT)*base//100+max(0,actorINT-targetINT-1)//2)
   assert seen==([] if expected is None else [dict(chance=expected)]),(terrain,actorINT,targetINT,weather,seen,expected)
   results.append(dict(test='FIRE-CHANCE-NATIVE-TERRAIN-INT-WEATHER',terrain=terrain,actorINT=actorINT,targetINT=targetINT,weather=weather,chance=expected,rngBounds=draws))
for controller in ['human','AI']:
 for ambushers in [0,1,2]:
  def setup(u,w):
   arena(u,w);w(0x9004,'B',90);w(0x9104,'B',60);w(0x9018,'B',0x65);w(0xb8df,'BB',6,4);w(0x9000,'H',0x9200 if ambushers else 0);w(0x9100,'H',0);w(0x9200,'H',0x9300 if ambushers==2 else 0)
   u.mem_write(DS+0x9300,bytes(0x80));u.mem_write(DS+0xba6c,bytes(156));w(0xba6c+5*13+6,'B',1);w(0xba6c+4*13+7,'B',4)
   for index,ptr,(q,r) in [(1,0x9200,(5,3)),(2,0x9300,(6,3))]:
    w(ptr+0x18,'B',(q<<4)|r);w(0xb9d0+r*13+q,'B',1);w(0xba6c+r*13+q,'B',1 if ambushers>=index else 0)
  def ambushed(u,w,word,byte,sp,seen):seen.append(dict(victim=[word(sp+4)&255,word(sp+6)&255],ambusher=[word(sp+8)&255,word(sp+10)&255]));return 0
  hooks={0x24648:zero,0x24466:zero,0x589c:lambda *a:1,0x247c6:ambushed}
  start,cs,inputs=(0x25998,0x258b,[3]) if controller=='human' else (0x2d432,0x2d22,[6,4,6,5])
  u,seen,word,byte=run(start,cs,inputs,setup,hooks)
  assert byte(0x9118)==0x64 and byte(0x9117)==7
  assert seen==[dict(victim=[6,4],ambusher=p) for p in ([[5,3]] if ambushers==1 else [[5,3],[6,3]] if ambushers==2 else [])],(controller,ambushers,seen)
  results.append(dict(test='PULL-ENEMY-AUTOAMBUSH',controller=controller,oldEnemyHex=[7,4],newEnemyHex=[6,4],enemyMobilityUnchanged=7,ambushers=ambushers,calls=seen,limits='Actual original pull eligibility, relocation, movement direction, skip-puller, forward arc and jungle checks run unchanged; RNG, render and ambush casualty body hooked.'))
Path('/workspace/scratch/7c8707393eee/native-battle-witness-v53.json').write_text(json.dumps(dict(originalSha256=original.EXPECTED,cases=results),indent=2)+'\n')
print(len(results),'native v53 witnesses passed')
