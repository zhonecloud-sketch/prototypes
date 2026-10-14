"""Catalogue and execute all 16 native effect sequences against a mocked OPLDRV boundary.
No DOS/synthesizer or sound-driver waveform parity is claimed. Original bytes stay private.
Requires Unicorn. Supply the original packed English executable as the first argument.
"""
from pathlib import Path
import argparse, hashlib, importlib.util, json, struct
from unicorn import Uc, UC_ARCH_X86, UC_MODE_16, UC_HOOK_CODE
from unicorn.x86_const import *
p=argparse.ArgumentParser();p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==original.EXPECTED
image=bytes(original.unpack(raw)[0]);DS=0x2fa60
assert image[DS+0x342a:DS+0x3431]==b'OPLDRV\x00'
labels=['Locust','Epidemic','Typhoon / flood','Popular riot','Meteor / evil omen','Officer rebellion','Settle province','Betrayal / field status / captive prompt','Personal combat result','Reinforcements arrival / request / return','Input / wait opening cue','Army sprite animation cue','Yellow Turban attack','Combat exchange','Input / wait completion cue','Unresolved use; no direct call found']

def run(start,arg,sound=True,driver=True,music=True):
 u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,image)
 for reg,val in [(UC_X86_REG_DS,DS//16),(UC_X86_REG_SS,DS//16),(UC_X86_REG_SP,0xff00),(UC_X86_REG_CS,0x6eb),(UC_X86_REG_IP,start-0x6eb0)]:u.reg_write(reg,val)
 def w(at,fmt,*v):u.mem_write(DS+at,struct.pack('<'+fmt,*v))
 def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
 w(0xff00,'HHH',0,0x6000,arg);w(0x352c,'H',int(driver));w(0x33b4,'B',int(sound)|(int(music)<<1));seen=[]
 def hook(u,at,size,data):
  if at==0x60000:u.emu_stop();return
  if at not in [0x3750,0x583c,0x581e]:return
  sp=u.reg_read(UC_X86_REG_SP);ip,cs=struct.unpack('<HH',u.mem_read(DS+sp,4))
  if at==0x3750:
   assert word(sp+4)==0x66;packet=word(sp+6);op=u.mem_read(DS+packet+1,1)[0];item={'command':op,'argument':u.mem_read(DS+packet,1)[0]}
   if op==5:item['patchOffset']=hex(word(packet+6))
   if op==8:item['transition']=u.mem_read(DS+packet+6,1)[0]
   seen.append(item)
   if op==3:w(packet,'B',0)
  else:seen.append({'delayRoutine':hex(at),'argument':word(sp+4)&255})
  u.reg_write(UC_X86_REG_AX,0);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
 u.hook_add(UC_HOOK_CODE,hook);u.emu_start(start,0x60001,count=50000)
 assert u.reg_read(UC_X86_REG_CS)==0x6000
 return seen

entries=[];checks=[]
for i in range(16):
 off,seg=struct.unpack_from('<HH',image,DS+0x3930+i*4);patch=image[DS+0x3970+i*22:DS+0x3970+(i+1)*22]
 calls=run(0x73a0,i);assert calls[0]['command']==5 and calls[0]['patchOffset']==hex(0x3970+i*22)
 assert any(c.get('command')==6 for c in calls)
 entries.append({'id':i,'use':labels[i],'entry':hex(seg*16+off),'patchOffset':hex(0x3970+i*22),'patchSha256':hashlib.sha256(patch).hexdigest(),'sequence':calls})
 checks.append({'rule':'Every native effect dispatches its own patch and pitch sequence','id':i})
 for sound,driver in [(False,True),(True,False)]:
  calls=run(0x73a0,i,sound=sound,driver=driver);assert not any('command' in c for c in calls)
  checks.append({'rule':'Muted or absent-driver effect is a timed silent fallback','id':i,'sound':sound,'driver':driver})
for i in range(22):
 calls=run(0x6f46,i);play=[c for c in calls if c.get('command')==1]
 assert play==([{'command':1,'argument':i+1}] if i<21 else [])
 checks.append({'rule':'Music ID range and one-based driver translation','id':i,'accepted':i<21})
for sound,driver,music in [(True,True,False),(True,False,True)]:
 assert not any(c.get('command')==1 for c in run(0x6f46,2,sound,driver,music));checks.append({'rule':'Music independently gated','driver':driver,'music':music})
# Literal far-call candidates are an inventory, not proof every byte is reachable code.
wrappers={0x6ebe:'speaker wait',0x6eea:'driver control',0x6f14:'driver status',0x6f46:'music selection',0x6fb0:'playback setting',0x6fda:'music transition',0x7034:'load effect patch',0x705a:'effect pitch',0x7080:'effect stop',0x73a0:'effect dispatch'}
refs=[]
for at in range(DS-4):
 if image[at]!=0x9a:continue
 off,seg=struct.unpack_from('<HH',image,at+1);target=seg*16+off
 if target in wrappers:refs.append({'at':hex(at),'entry':hex(target),'kind':wrappers[target],'precedingBytes':image[max(0,at-8):at].hex()})
out={'originalSha256':original.EXPECTED,'unpackedSha256':hashlib.sha256(image).hexdigest(),'imageBytes':len(image),'driverSignature':'OPLDRV','effectCount':16,'musicAcceptedIds':list(range(21)),'effects':entries,'staticFarCallCandidates':refs,'checks':checks,'checkCount':len(checks),'limits':['External OPLDRV and original song data are absent; no original waveforms or BGM melodies were recovered.','Driver interrupt and waits are hooked; the native dispatch and effect sequences execute unchanged.','Effect labels come from call-site strings and controlled native routines; ID15 use remains unresolved.','Static far-call candidates can include data and are not an exhaustive dynamically reachable call graph.']}
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({'effects':len(entries),'checks':len(checks),'originalSha256':out['originalSha256'],'unpackedSha256':out['unpackedSha256']}))
