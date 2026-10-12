from pathlib import Path
import sys,struct,json,math,hashlib
from unicorn import *
from unicorn.x86_const import *
BASE=0x70000;DSEG=0x7000;SSEG=0x8000;STOP=0x90000
import argparse,importlib.util
parser=argparse.ArgumentParser(description='Execute original RTK2 OPLDRV and export timed YM3812 writes. Raw originals are read from supplied private paths only.')
parser.add_argument('main_exe',type=Path);parser.add_argument('fmdrv_com',type=Path);parser.add_argument('output',type=Path)
parser.add_argument('--inventory',type=Path,default=Path(__file__).resolve().parents[1]/'docs'/'native-audio-v50.json')
parser.add_argument('--unpacked',action='store_true',help='first path is already the verified main.exe load image')
args=parser.parse_args()
raw=args.main_exe.read_bytes()
if args.unpacked:IMAGE=raw
else:
 spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original);IMAGE=bytes(original.unpack(raw)[0])
DRIVER=args.fmdrv_com.read_bytes()
assert b'OPLDRV' in DRIVER and b'OPL-II Sound Driver' in DRIVER, 'Unsupported driver'
OUT=args.output;OUT.mkdir(parents=True,exist_ok=True)

HZ=1193182/4096
class Player:
 def __init__(self):
  self.u=Uc(UC_ARCH_X86,UC_MODE_16);self.u.mem_map(0,0x100000);self.u.mem_write(0,IMAGE);self.u.mem_write(BASE+0x100,DRIVER);self.u.mem_write(BASE+0x114,b'\xff');self.u.mem_write(BASE+0x39e,struct.pack('<HH',0,0x9000));self.time=0;self.events=[];self.regs={};self.calls=0
  def hook(u,addr,size,data):
   if addr==STOP:u.emu_stop();return
   if addr==BASE+0x580:
    ax=u.reg_read(UC_X86_REG_AX);r=ax>>8;v=ax&255;self.events.append([round(self.time*44100),r,v]);self.regs[r]=v
    sp=u.reg_read(UC_X86_REG_SP);ss=u.reg_read(UC_X86_REG_SS)*16;ip=struct.unpack('<H',u.mem_read(ss+sp,2))[0];u.reg_write(UC_X86_REG_SP,sp+2);u.reg_write(UC_X86_REG_IP,ip)
  self.u.hook_add(UC_HOOK_CODE,hook,begin=STOP,end=STOP)
  self.u.hook_add(UC_HOOK_CODE,hook,begin=BASE+0x580,end=BASE+0x580)
  self.near(0x11d9)
  self.command(0,0x2db9,2)
 def invoke(self,entry,stack,ax=0,ds=DSEG,dx=0):
  u=self.u
  for r,v in [(UC_X86_REG_CS,DSEG),(UC_X86_REG_IP,entry),(UC_X86_REG_SS,SSEG),(UC_X86_REG_SP,0xff00),(UC_X86_REG_AX,ax),(UC_X86_REG_DS,ds),(UC_X86_REG_ES,DSEG),(UC_X86_REG_DX,dx),(UC_X86_REG_EFLAGS,2)]:u.reg_write(r,v)
  u.mem_write(SSEG*16+0xff00,stack)
  u.emu_start(BASE+entry,STOP+1,count=300000)
  assert u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X86_REG_IP)==STOP,(hex(entry),hex(u.reg_read(UC_X86_REG_IP)))
 def near(self,entry):
  # near ret lands in driver trampoline which performs a far jump to STOP
  self.u.mem_write(BASE+0x1500,b'\xea\x00\x00\x00\x90')
  self.invoke(entry,struct.pack('<H',0x1500))
 def command(self,op,ds=DSEG,dx=0,arg=0):self.invoke(0x12e,struct.pack('<HH',0,0x9000),ax=(op<<8)|arg,ds=ds,dx=dx)
 def tick(self):
  self.time+=1/HZ;self.invoke(0x85a,struct.pack('<HHH',0,0x9000,2))
 def wait(self,seconds):
  target=self.time+seconds
  while self.time+1/HZ<=target:self.tick()
 def state(self):return bytes(self.u.mem_read(BASE+0x3aa,4*0x2e))
 def save(self,name,seconds,loop=None):
  data={'name':name,'sampleRate':44100,'timerHz':HZ,'seconds':seconds,'loopSamples':None,'playbackLimit':'Native register capture; looping streams bounded to 180 seconds. A repeated melodic-channel state can end a capture window, but is not asserted as an exact original full FM loop endpoint.','writes':self.events}
  (OUT/(name+'.json')).write_text(json.dumps(data,separators=(',',':')))
  print(name,round(seconds,3),len(self.events),'notes',sum(1 for _,r,v in self.events if 0xb0<=r<=0xb8 and v&32),flush=True)
  return data
if __name__=='__main__':
 report=json.loads(args.inventory.read_text());assert hashlib.sha256(IMAGE).hexdigest()==report['unpackedSha256'];manifest={'driverSha256':hashlib.sha256(DRIVER).hexdigest(),'sourceSha256':hashlib.sha256(IMAGE).hexdigest(),'music':[],'effects':[]}
 for sid in range(21):
  p=Player();p.command(1,arg=sid+1);p.command(4,arg=1);seen={};loop=None;seconds=0
  # Bound the export at recurring melodic-channel state, natural termination or 180s.
  # This is a playback window, not proof of exact original full FM loop boundaries.
  for j in range(round(HZ*180)):
   p.tick()
   if j%10==0:
    state=p.state()
    if state in seen and j-seen[state]>round(HZ*5):loop=[round(seen[state]/HZ*44100),round(j/HZ*44100)];break
    seen.setdefault(state,j)
   if not p.u.mem_read(BASE+0x4f5,1)[0]:break
  seconds=p.time;d=p.save('native-music-'+str(sid),seconds,loop);manifest['music'].append({k:d[k] for k in ['name','seconds','loopSamples']})
 for effect in report['effects']:
  p=Player();i=effect['id']
  for cmd in effect['sequence']:
   op=cmd.get('command')
   if op==5:p.command(5,0x2fa6,int(effect['patchOffset'],16))
   elif op==6:p.command(6,dx=cmd['argument'])
   elif op==7:p.command(7)
   elif 'delayRoutine' in cmd:
    value=cmd['argument'];ticks=((value*6)>>1)+1 if cmd['delayRoutine']=='0x583c' else (value>>1)+1;p.wait(ticks/(1193182/65536))
  if p.time<.1:p.wait(.65);p.command(7)
  p.wait(.2);d=p.save('native-effect-'+str(i),p.time);manifest['effects'].append({'name':d['name'],'seconds':d['seconds']})
 (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
