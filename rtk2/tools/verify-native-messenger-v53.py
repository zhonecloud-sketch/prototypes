from pathlib import Path
import sys,json
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+' ORIGINAL_MAIN_EXE OUTPUT_JSON')
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in [89,90]:')[0].replace("Path(__file__).with_name('verify-original.py')","Path(__file__).with_name('verify-original.py')"))
results=[]
# Courier interpolation executes its actual sprite routine and sound dispatch.
for driver,sound in [(1,1),(1,0),(0,1)]:
 def setup(u,w):
  w(0x9000+0x1c,'HH',30,40);w(0x9100+0x1c,'HH',90,60)
  w(0xce96,'H',3);w(0x352c,'H',driver);w(0x33b4,'B',sound);w(0xcb6b,'B',0)
 def effect(u,w,word,byte,sp,seen):seen.append(word(sp+4)&255)
 u,seen,word,byte=run(0x11e74,0x1130,[0x9000,0x9100],setup,{0xffc:zero,0x452:zero,0x1627:zero,0x73a0:effect,0x581e:zero})
 assert seen==([11,11,11] if driver and sound else [])
 results.append(dict(rule='Native courier movement dispatches effect11 each interpolation frame',driver=driver,sound=sound,calls=seen))
# Execute original transport set-free branch, retaining native trust/hostility modifiers.
for alliance in [0,1]:
 def setup(u,w):
  w(0x3394,'H',0x9000);w(0xd478,'H',0x9100);w(0x9006,'B',60);w(0x9106,'B',70);w(0x900e,'B',50);w(0x910e,'B',50);w(0xd472,'H',alliance);w(0xca86,'B',99)
 u,seen,word,byte=run(0x11d10,0x1130,[2],setup,{0x5256:zero})
 assert byte(0xca86)==0 and byte(0x900e)==47 and byte(0x9106)==(73 if alliance else 70)
 results.append(dict(rule='Native transport Set free continues outbound and lowers sender hostility3; allied interceptor trust rises3',alliance=bool(alliance),routeStatus=byte(0xca86),senderHostility=byte(0x900e),interceptorTrust=byte(0x9106)))
# Original imprisonment attempt changes relations before the escape decision.
for alliance in [0,1]:
 def setup(u,w):
  w(0x3394,'H',0x9000);w(0xd478,'H',0x9100);w(0x900e,'B',50);w(0x9106,'B',70);w(0xd472,'H',alliance)
 u,seen,word,byte=run(0x11632,0x1130,[],setup,{0x5256:zero,0x11302:zero,0x545d8:zero,0x11448:lambda *a:1,0x54da:zero})
 assert byte(0x900e)==(58 if alliance else 60) and byte(0x9106)==(65 if alliance else 70)
 results.append(dict(rule='Native imprisonment attempt changes sender hostility8 allied10 nonallied and allied interceptor trustminus5 before escape',alliance=bool(alliance),senderHostility=byte(0x900e),interceptorTrust=byte(0x9106)))
# Original letter permission/seizure: outcome flags determine reverse-path transition.
for choice in [1,2]:
 def setup(u,w):
  w(0x3394,'H',0x9000);w(0xd478,'H',0x9100);w(0x900e,'B',50);w(0x9106,'B',70);w(0xd472,'H',0);w(0xca86,'B',99)
 u,seen,word,byte=run(0x11c24,0x1130,[choice],setup,{0x5256:zero,0x11b3c:zero})
 assert byte(0xca86)==choice
 results.append(dict(rule='Native secret-letter permission/seizure route outcomes differ',choice=choice,routeStatus=byte(0xca86),senderHostility=byte(0x900e)))
# Execute actual journey controller with a supplied three-province route.
for mode,status in [(0,1),(12,0)]:
 def setup(u,w):
  w(0x339a,'H',0x9000);w(0xcea4,'H',0x9200);w(0x33b6,'B',0);w(0xce9c,'B',mode)
 def route(u,w,word,byte,sp,seen):w(word(sp+4),'HHH',0x9000,0x9100,0x9200)
 def move(u,w,word,byte,sp,seen):seen.append(dict(fromProvince=hex(word(sp+4)),toProvince=hex(word(sp+6))))
 def encounter(u,w,word,byte,sp,seen):return int(word(sp+4)==0x9100)
 def choice(u,w,word,byte,sp,seen):w(0xca86,'B',status)
 def mission(u,w,word,byte,sp,seen):seen.append(dict(missionResolved=True));w(0xcea0,'B',0)
 u,seen,word,byte=run(0x12398,0x1130,[],setup,{0x522a:zero,0x122b2:route,0x11e74:move,0x1203e:encounter,0x536a:lambda *a:0x9100,0x5534:zero,0x11c82:choice,0x11dbe:choice,0x11b56:mission})
 expected=([dict(fromProvince='0x9000',toProvince='0x9100'),dict(fromProvince='0x9100',toProvince='0x9200'),dict(missionResolved=True),dict(fromProvince='0x9200',toProvince='0x9100'),dict(fromProvince='0x9100',toProvince='0x9000')])
 assert seen==expected,(mode,seen)
 results.append(dict(rule='Native controller renders release return with original segment routine; transport release first finishes outward route',mode=mode,status=status,events=seen))
Path('/workspace/scratch/7c8707393eee/messenger-witness-v53.json').write_text(json.dumps(dict(originalSha256=original.EXPECTED,cases=results,limits=['Courier routine retains actual sprite and interpolation instructions; graphics/waits/sound dispatcher are hooked, so no waveform proof.','Set-free branches retain actual byte-clamped trust and hostility arithmetic; owner-ID helper is bounded to0.','Journey controller retains original routing decisions and forward/reverse loops; route builder, interception decision, mission resolver and render calls are bounded hooks.']),indent=2)+'\n')
print(len(results),'messenger witnesses passed')
