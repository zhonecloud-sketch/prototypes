from pathlib import Path
import sys,json
source=Path(__file__).with_name('verify-native-combat-v50.py').read_text()
exec(source.split('for intel in [89,90]:')[0])
results=[]
simulations=[]
for helperFlags in [1,129]:
 for enemyFlags in [4,132,20,148]:
  flashes=[]
  def setup(u,w):
   arena(u,w);w(0xb8df,'BB',6,7);w(0x9000,'H',0x9100);w(0x9100,'H',0);w(0x9200,'H',0);w(0xcb76,'H',0x9000);w(0xcb8a,'H',0x9200);u.mem_write(DS+0xba6c,bytes(156))
   for ptr,(q,r),flag in [(0x9000,(6,7),129),(0x9100,(7,7),helperFlags),(0x9200,(7,6),enemyFlags)]:w(ptr+0x18,'B',(q<<4)|r);w(0xba6c+r*13+q,'B',flag)
   w(0xb9d0+6*13+7,'B',1);w(0x33b3,'B',1)
  def exchange(u,w,word,byte,sp,seen):seen.append(dict(attacker=hex(word(sp+4)),defender=hex(word(sp+6)),factor=word(sp+8)));return 255
  def animate(u,w,word,byte,sp,seen):flashes.append([word(sp+4)&255,word(sp+6)&255,word(sp+8)&255,word(sp+10)&255])
  u,seen,word,byte=run(0x26072,0x258b,[0x9200,7,6],setup,{0x250f8:animate,0x24c58:exchange,0x24baa:zero})
  assert seen==[dict(attacker='0x9000',defender='0x9200',factor=2),dict(attacker='0x9100',defender='0x9200',factor=2)]
  simulations.append((helperFlags,enemyFlags,bytes(u.mem_read(DS,0xf000))))
  results.append(dict(rule='Full native simultaneous ignores helper and target cell bit128 in eligibility',helperFlagsBefore=helperFlags,enemyFlagsBefore=enemyFlags,helperFlagsAfter=byte(0xba6c+7*13+7),enemyFlagsAfter=byte(0xba6c+6*13+7),calls=seen,flashes=flashes))
# Native human controller processes its linked list exactly once; neither cell
# bit128 nor prior helper exchanges remove a live unit from that sequence.
for unitFlags in [1,129,4,132,20,148]:
 def setup(u,w):
  arena(u,w);w(0x9000,'H',0x9100);w(0x9100,'H',0);w(0xba6c+4*13+6,'B',unitFlags);w(0xba6c+4*13+7,'B',unitFlags)
  w(0xb8e2,'B',0);w(0xb1aa+0x32*4,'HH',0x10,0x6000)
 def input(u,w,word,byte,sp,seen):seen.append(hex(word(0xb8e6)));return 0x32
 def order(u,w,word,byte,sp,seen):w(0xb8e2,'B',1);return 0
 def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
 u,seen,word,byte=run(0x226a0,0x2257,[0x9000],setup,{0x24262:zero,0x24274:zero,0x468a:input,0x444c:zero,0x2297c:zero,0x24022:zero,0x60010:order,0x57ac:maximum})
 assert seen==['0x9000','0x9100'],(unitFlags,seen)
 results.append(dict(rule='Native human own daily order follows linked-list activation independently of cell bit128',cellFlags=unitFlags,actualController='0x226A0',activatedUnits=seen))
# Preserve each actual simultaneous result, then activate that helper or
# defender in the original human own-order controller.
for helperFlags,enemyFlags,memory in simulations:
 for role,ptr in [('helper',0x9100),('target',0x9200)]:
  def followup(u,w):
   u.mem_write(DS,memory);w(ptr,'H',0);w(0xb8e2,'B',0);w(0xb1aa+0x32*4,'HH',0x10,0x6000)
  def input(u,w,word,byte,sp,seen):seen.append(hex(word(0xb8e6)));return 0x32
  def order(u,w,word,byte,sp,seen):w(0xb8e2,'B',1);return 0
  def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
  u,seen,word,byte=run(0x226a0,0x2257,[ptr],followup,{0x24262:zero,0x24274:zero,0x468a:input,0x444c:zero,0x2297c:zero,0x24022:zero,0x60010:order,0x57ac:maximum})
  assert seen==[hex(ptr)]
  results.append(dict(rule='Native simultaneous participant retains later own army activation',role=role,helperFlagsBefore=helperFlags,enemyFlagsBefore=enemyFlags,activatedUnits=seen))
# Ambush clears cell bit128 but does not remove the ambusher from their
# later human army activation. Use the actual resulting native DS memory.
for intel in [89,90]:
 def setup(u,w):arena(u,w);w(0x9004,'B',intel);w(0xb9d0+4*13+7,'B',1)
 native,seen,word,byte=run(0x247c6,0x2475,[6,4,7,4],setup,{0x250f8:zero,0x237ea:lookup,0x238fa:zero,0x24466:zero,0x2417c:zero,0x4b38:zero})
 assert byte(0xba6c+4*13+7)==4
 def followup(u,w):
  u.mem_write(DS,bytes(native.mem_read(DS,0xf000)));w(0x9100,'H',0);w(0xb8e2,'B',0);w(0xb1aa+0x32*4,'HH',0x10,0x6000)
 def input(u,w,word,byte,sp,seen):seen.append(hex(word(0xb8e6)));return 0x32
 def order(u,w,word,byte,sp,seen):w(0xb8e2,'B',1);return 0
 def maximum(u,w,word,byte,sp,seen):return max(word(sp+4),word(sp+6))
 u,seen,word,byte=run(0x226a0,0x2257,[0x9100],followup,{0x24262:zero,0x24274:zero,0x468a:input,0x444c:zero,0x2297c:zero,0x24022:zero,0x60010:order,0x57ac:maximum})
 assert seen==['0x9100']
 results.append(dict(rule='Native ambusher retains later own army activation',moverINT=intel,ambusherFlagsAfterAmbush=4,activatedUnits=seen))
args.output.write_text(json.dumps(dict(originalSha256=original.EXPECTED,cases=results,limits=['Original geometry, ownership, lookup and eligibility are retained in simultaneous witnesses; only rendering and exchange arithmetic are intercepted.','Human controller witness retains original activation and linked-list iteration; input, rendering, command body and outcome checks are bounded hooks.']),indent=2)+'\n')
print(len(results),'bounded native v52 witnesses passed')
