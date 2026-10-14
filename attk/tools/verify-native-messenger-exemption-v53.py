from pathlib import Path
import sys,json
if len(sys.argv)!=3: raise SystemExit('Usage: python3 '+Path(__file__).name+' ORIGINAL_MAIN_EXE OUTPUT_JSON')
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in [89,90]:')[0].replace("Path(__file__).with_name('verify-original.py')","Path(__file__).with_name('verify-original.py')"))
SENDER=0x2b34;INTERCEPTOR=0x2b34+0x29;cases=[]
for mode in range(13):
 for destinationOwner in [1,2]:
  for jointOwner in [1,2]:
   expected=7<=mode<=11 and destinationOwner==1 or mode==1 and jointOwner==1
   def setup(u,w):
    w(0x3394,'H',SENDER);w(0xd478,'H',INTERCEPTOR);w(0xcea4,'H',0x9000);w(0xceac,'H',0x9100);w(0xce9a,'H',0x9200);w(0xce9c,'B',mode)
    w(0x9010,'B',destinationOwner);w(0x9110,'B',jointOwner);w(INTERCEPTOR+0xe,'B',50);w(0x9202,'B',0x02)
   u,seen,word,byte=run(0x11302,0x1130,[],setup,{})
   actual=u.reg_read(UC_X86_REG_AX)
   assert actual==expected and byte(INTERCEPTOR+0xe)==(53 if expected else 50) and byte(0x9202)==(0x22 if mode==8 and expected else 0x02)
   cases.append(dict(rule='Authentic exemption predicate retains original owner lookup and relation modifier',mode=mode,destinationOwner=destinationOwner,jointTargetOwner=jointOwner,exemption=bool(actual),interceptorHostility=byte(INTERCEPTOR+0xe),targetOfficerFlags=byte(0x9202)))
for mode in [0,1,7,8,9,10,11,12]:
 for allied in [0,1]:
  for targetMatches in [0,1]:
   expected=bool(allied and ((7<=mode<=11 or mode==1) and targetMatches))
   def setup(u,w):
    w(0x3394,'H',SENDER);w(0xd478,'H',INTERCEPTOR);w(0xcea4,'H',0x9000);w(0xceac,'H',0x9100);w(0xce9a,'H',0x9200);w(0xce9c,'B',mode)
    w(0x9010,'B',1 if targetMatches else 2);w(0x9110,'B',1 if targetMatches else 2);w(INTERCEPTOR+0xe,'B',50);w(SENDER+0xf,'B',50);w(INTERCEPTOR+6,'B',70);w(0x9202,'B',0x02);w(0xd472,'H',allied)
   # Escape/render follow-up bounded, but the authentic exemption predicate and
   # native owner-ID and capped modifiers execute with native structure addresses.
   u,seen,word,byte=run(0x11632,0x1130,[],setup,{0x545d8:zero,0x11448:lambda *a:1,0x54da:zero})
   assert byte(INTERCEPTOR+6)==(70 if expected or not allied else 65) and byte(SENDER+0xf)==(58 if allied else 60) and byte(INTERCEPTOR+0xe)==(53 if expected else 50)
   cases.append(dict(rule='Authentic imprisonment branch exempts allied trustminus5 only when mission targets interceptor',mode=mode,allied=bool(allied),targetMatches=bool(targetMatches),trustExempt=expected,interceptorTrust=byte(INTERCEPTOR+6),senderHostility=byte(SENDER+0xf),interceptorHostility=byte(INTERCEPTOR+0xe)))
Path('/workspace/scratch/7c8707393eee/messenger-exemption-v53.json').write_text(json.dumps(dict(originalSha256=original.EXPECTED,cases=cases,limits=['52 predicate cases execute native predicate, owner lookup, owner-ID and clamped hostility modifiers without hooks.','32 outer imprisonment cases keep authentic predicate and relation/trust arithmetic, but stub is-ruler test, escape decision and render follow-up.','Native officer flag0x20 side effect on mode8 is recorded; its broader meaning is outside this bounded audit.']),indent=2)+'\n')
print(len(cases),'native messenger exemption witnesses passed')
