"""Portable bounded native simultaneous casualty witness.
Usage: PYTHONPATH=<unicorn-dependencies> python this.py main.exe output.json --repo <rtk2 root>
Runs original joint assembly, power, casualty, equipment, mutation and stop branches;
rendering/UI/DOS captive processing are suppressed. No AI training.
"""
import argparse,hashlib,json,struct,subprocess
from pathlib import Path
from unicorn import Uc,UC_ARCH_X86,UC_MODE_16,UC_HOOK_CODE
from unicorn.x86_const import *
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);p.add_argument('--repo',type=Path,required=True);a=p.parse_args()
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
 assert src==dst
 output[:src+1]=packed[:src+1]
 return bytes(output)
raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==EXPECTED;IMAGE=unpack(raw);DS=0x2fa60
BASE=dict(soldiers=5000,weapons=4000,war=70,int=70,training=70,combatWarBonus=0)
fixtures=[]
for count in [3,4]:
 for terrain in [0,6]:
  for power in ['equal','mixed','low-equipment','early-defender-zero','early-attacker-zero']:
   attackers=[dict(BASE,q=q,r=r) for q,r in [(6,7),(7,7),(8,7),(6,6)][:count]];defender=dict(BASE,q=7,r=6)
   if power=='mixed':
    for i,v in enumerate(attackers):v.update(war=[45,99,82,63][i],training=[30,85,60,90][i],weapons=[1000,5000,2500,3400][i],combatWarBonus=20 if i==1 else 0)
    defender.update(war=82,training=80,weapons=3300)
   elif power=='low-equipment':
    for i,v in enumerate(attackers):v.update(weapons=[25,1000,900,2700][i],war=[92,65,55,83][i])
    defender.update(weapons=17,war=51)
   elif power=='early-defender-zero':defender.update(soldiers=20,weapons=20,war=1,training=0);attackers[0].update(war=100,training=100,weapons=5000)
   elif power=='early-attacker-zero':attackers[0].update(soldiers=20,weapons=20,war=1,training=0);defender.update(war=100,training=100,weapons=5000)
   fixtures.append(dict(name=f'{count}-attackers-{terrain}-terrain-{power}',attackers=attackers,defender=defender,terrain=terrain,rollNumerators=[150,1,280,15,75,22,199,29,35,0,270,18]))

order_fixture=json.loads(json.dumps(next(f for f in fixtures if f['name']=='3-attackers-0-terrain-mixed')))
order_fixture.update(name='3-attackers-linked-order-differs-from-hex-order',orderAudit=True)
order_fixture['attackers']=[order_fixture['attackers'][0],order_fixture['attackers'][2],order_fixture['attackers'][1]]
fixtures.append(order_fixture)
order_four=json.loads(json.dumps(next(f for f in fixtures if f['name']=='4-attackers-6-terrain-mixed')))
order_four.update(name='4-attackers-palace-shuffled-roster',orderAudit=True)
order_four['attackers']=[order_four['attackers'][0],order_four['attackers'][3],order_four['attackers'][2],order_four['attackers'][1]]
fixtures.append(order_four)
expanded=[]
for f in fixtures:
 for human,difficulty in [(False,1),(True,1),(True,3),(True,5)]:
  v=json.loads(json.dumps(f));v.update(name=f['name']+f'-humanTarget{human}-difficulty{difficulty}',humanTarget=human,difficulty=difficulty);expanded.append(v)
fixtures=expanded

def run(fixture):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,IMAGE);u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xff00)
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
 ptrs=[0x9000+i*0x100 for i in range(len(fixture['attackers']))];defptr=0x9400;allptrs=ptrs+[defptr]
 def stats(ptr):return dict(soldiers=word(ptr+0x12),weapons=word(ptr+0x14))
 def snapshot():return {hex(ptr):stats(ptr) for ptr in allptrs}
 u.mem_write(DS+0xb9d0,bytes(156));u.mem_write(DS+0xba6c,bytes(156));u.mem_write(DS+0xcb72,bytes(40));w(0xcb76,'H',ptrs[0]);w(0xcb8a,'H',defptr);w(0xb8e6,'H',ptrs[0]);w(0xb8e4,'H',defptr);w(0xb8df,'BB',6,7);w(0xb8d7,'BB',12,11);w(0xb8d5,'B',255);w(0xb8d6,'B',2);w(0x33b3,'B',fixture['difficulty']);w(0x352c,'H',0)
 for i,(ptr,v) in enumerate(zip(allptrs,fixture['attackers']+[fixture['defender']])):
  u.mem_write(DS+ptr,bytes(0x80));w(ptr,'H',ptrs[i+1] if i+1<len(ptrs) else 0);w(ptr+4,'BB',v['int'],v['war']);w(ptr+0x12,'HHBBB',v['soldiers'],v['weapons'],v['training'],7,(v['q']<<4)|v['r']);w(ptr+0x1a,'H',163 if v['combatWarBonus'] else 100);w(0xba6c+v['r']*13+v['q'],'B',129 if ptr!=defptr else 132)
 w(0xb9d0+6*13+7,'B',fixture['terrain']);w(0xff00,'5H',0,0x6000,defptr,7,6)
 rng=[];exchanges=[];trace=[]
 suppressed={0x250f8:'combat flashing',0x24466:'unit redraw',0x238fa:'controlled human target ownership',0x2b7a8:'strategic commander-risk grouping predicate',0x24de0:'attack ownership announcement',0x2c3b2:'attack type announcement',0x24e6c:'pact UI prelude',0x24f4c:'postcombat relationship UI',0x2417c:'treasury UI',0x2420e:'food UI',0x241ba:'food counters UI',0x2541e:'capture announcement'}
 def return_hook(value):
  sp=u.reg_read(UC_X86_REG_SP);ip,cs=struct.unpack('<2H',u.mem_read(DS+sp,4));u.reg_write(UC_X86_REG_AX,value);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
 def hook(u,at,size,data):
  trace.append(hex(at))
  if at==0x60000:u.emu_stop();return
  if at==0x24c58:
   sp=u.reg_read(UC_X86_REG_SP);exchanges.append(dict(attacker=hex(word(sp+4)),defender=hex(word(sp+6)),factor=word(sp+8),before=snapshot(),rngStart=len(rng)));return
  if at==0x24c8a:
   exchanges[-1]['effectiveAttackerLossDivisor']=word(u.reg_read(UC_X86_REG_BP)+10);return
  if at==0x27f8f:
   x=exchanges[-1];x.update(after=snapshot(),status=u.reg_read(UC_X86_REG_AX)&255,rngEnd=len(rng),nativeCalculatedAttackerLoss=word(0xb8c6),nativeCalculatedTargetLoss=word(0xb8c8));return
  if at==0x2537f:
   # Execute native depletion clear at25364..2537C, bypass DOS captivity bookkeeping.
   u.reg_write(UC_X86_REG_IP,0x25419-u.reg_read(UC_X86_REG_CS)*16);return
  if at==0x4b38:
   sp=u.reg_read(UC_X86_REG_SP);bound=word(sp+4);numerator=fixture['rollNumerators'][len(rng)%len(fixture['rollNumerators'])];value=numerator%bound if bound else 0;rng.append(dict(bound=bound,value=value));return_hook(value);return
  if at==0x238fa:return_hook(int(fixture['humanTarget'] and word(u.reg_read(UC_X86_REG_SP)+4)==defptr));return
  if at in suppressed:return_hook(0)
 u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,0x277e);u.reg_write(UC_X86_REG_IP,0x27d9e-0x277e0)
 try:u.emu_start(0x27d9e,0x60001,count=100000)
 except Exception as err:raise RuntimeError(f'{fixture["name"]}: {trace[-30:]}') from err
 assert u.reg_read(UC_X86_REG_CS)==0x6000,trace[-30:]
 final=snapshot();targetloss=fixture['defender']['soldiers']-final[hex(defptr)]['soldiers'];parts=[x['before'][hex(defptr)]['soldiers']-x['after'][hex(defptr)]['soldiers'] for x in exchanges]
 assert targetloss==sum(parts)
 for i,x in enumerate(exchanges):
  assert x['factor']==len(ptrs)
  assert x['effectiveAttackerLossDivisor']==len(ptrs)+(fixture['difficulty']-1 if fixture['humanTarget'] else 0)
  if i:assert x['before'][hex(defptr)]==exchanges[i-1]['after'][hex(defptr)]
  x['actualTargetLoss']=parts[i]
 return dict(**fixture,ptrs=[hex(v) for v in ptrs],targetPtr=hex(defptr),exchanges=exchanges,rng=rng,final=final,targetLoss=targetloss,targetLossSum=parts,hooks=suppressed,limits=['Original AI grouped handler geometry, lookup, power, casualty/equipment equations, state mutations and terminal stop branches execute unchanged.','AI target selection and strategic commander-risk inclusion are outside scope; grouping-risk predicate is controlled as false (all adjacent friends eligible). Native human ownership hook classifies only target as human when fixture specifies; actual difficulty arithmetic executes unchanged.','Capture path executes original soldier/equipment clearing then bypasses province/officer/captive bookkeeping; rendering is hooked.'])
results=[run(f) for f in fixtures]
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results),indent=2)+'\n')
print(len(results),'native AI grouped casualty witnesses passed')
# Execute the current game action with exactly the recorded native casualty RNG.
node_source=r'''
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const {act}=await import(pathToFileURL(path.join(process.argv[1],'mjs/battle.mjs'))),results=JSON.parse(fs.readFileSync(0,'utf8'));
const output=[];
for(const fixture of results){
 const attackers=fixture.attackers.map((v,i)=>({...v,id:i+1,side:'attack',placed:true,routed:false,fled:false,captured:false,ordered:false,mobility:7,orderDay:0})),defender={...fixture.defender,id:10,side:'defend',placed:true,routed:false,fled:false,captured:false,ordered:false,mobility:7,orderDay:0},units=[...attackers,defender];
 const b={side:'attack',phase:'battle',attacker:0,defender:1,day:1,terrain:Array(156).fill(0),palace:fixture.terrain===6?{q:7,r:6}:{q:12,r:11},fire:{},weather:'sunny',units,selected:1,rulers:{attack:null,defend:null},leaders:{attack:null,defend:null},food:{attack:100000,defend:100000},gold:{attack:0,defend:0},events:[],messages:[],eventSerial:0,actionSerial:0};b.terrain[6*13+7]=fixture.terrain;let rngIndex=0;
 const g={s:{battle:b,difficulty:fixture.difficulty},isHuman:owner=>fixture.humanTarget&&owner===1,officer:id=>({name: id===10?'Cao Cao':id===1?'Dong Zhuo':id===2?'Lu Bu':'Third attacker'}),ruler:id=>({name:'Realm '+id}),random:()=>{const draw=fixture.rng[rngIndex++];if(!draw)throw Error('More RNG requested than native:'+fixture.name);return draw.bound?(draw.value+.01)/draw.bound:0;}};
 const text=act(g,'simultaneous',{unit:1,target:10}),final=Object.fromEntries([...attackers.map((u,i)=>[fixture.ptrs[i],{soldiers:u.soldiers,weapons:u.weapons}]),[fixture.targetPtr,{soldiers:defender.soldiers,weapons:defender.weapons}]]);
 output.push({name:fixture.name,final,targetLoss:fixture.defender.soldiers-defender.soldiers,exchanges:b.lastAction.exchanges,lossRows:b.lastAction.lossRows,rngUsed:rngIndex,text});
}
process.stdout.write(JSON.stringify(output));
'''
node_run=subprocess.run(['node','--input-type=module','-e',node_source,str(a.repo.resolve())],input=json.dumps(results),text=True,capture_output=True,check=True)
node_results=json.loads(node_run.stdout)
for native,current in zip(results,node_results):
 native['remaster']=current;native['nativeRemasterSoldiersMatch']=all(current['final'][p]['soldiers']==native['final'][p]['soldiers'] for p in native['final']);native['nativeRemasterWeaponsMatch']=all(current['final'][p]['weapons']==native['final'][p]['weapons'] for p in native['final']);native['nativeRemasterRngCountMatch']=current['rngUsed']==len(native['rng']);native['nativeRemasterExchangeCountMatch']=current['exchanges']==len(native['exchanges'])
 assert native['targetLoss']==current['targetLoss'],native['name']
 assert native['nativeRemasterSoldiersMatch'],native['name']
 assert native['nativeRemasterWeaponsMatch'],native['name']
 assert native['nativeRemasterRngCountMatch'],native['name']
 assert native['nativeRemasterExchangeCountMatch'],native['name']
a.output.write_text(json.dumps(dict(originalSha256=EXPECTED,cases=results),indent=2)+'\n')
print(len(results),'native AI/remaster casualty, equipment, RNG and exchange counts matched, including shuffled rosters and human-target difficulty')
