"""Bounded native v56 charge-arrival witnesses; no original bytes are exported.
Run: python SCRIPT.py /outside/repository/main.exe /tmp/results.json
Requires Unicorn; self-contained unpacker, no repository imports.
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

results=[]
DIRS=[(-1,0,1),(0,1,1),(1,0,1),(-1,-1,0),(0,-1,-1),(1,-1,0)]
def adjacent(p,d):
 dq,e,o=DIRS[d];q,r=p;return(q+dq,r+(o if q&1 else e))
for q in [6,7]:
 for d in range(6):
  for commander in [False,True]:
   origin=(q,5);target=adjacent(origin,d);hidden=adjacent(target,d)
   def setup(u,w):
    arena(u,w);u.mem_write(DS+0xba6c,bytes(156));u.mem_write(DS+0xb9d0,bytes(156));w(0x9000,'H',0);w(0x9100,'H',0x9200 if commander else 0);w(0x9200,'H',0 if commander else 0x9100)
    w(0xcb8a,'H',0x9100 if commander else 0x9200);w(0x9112,'HH',1,1);w(0x9105,'B',0);w(0x9116,'B',0);w(0x9212,'HH',5000,5000);w(0xb8df,'BB',*origin)
    for ptr,p,flags in [(0x9000,origin,129),(0x9100,target,132),(0x9200,hidden,148)]:w(ptr+0x18,'B',(p[0]<<4)|p[1]);w(0xba6c+p[1]*13+p[0],'B',flags)
    w(0xb9d0+hidden[1]*13+hidden[0],'B',1);w(0xb8d5,'B',255);w(0xb8d6,'B',1)
   def ambushed(u,w,word,byte,sp,seen):seen.append(dict(ambushVictim=[word(sp+4)&255,word(sp+6)&255],ambusher=[word(sp+8)&255,word(sp+10)&255]));return 0
   def capture(u,w,word,byte,sp,seen):seen.append(dict(captureMessage=hex(word(sp+4))));return 0
   hooks={0x4b38:zero,0x57ba:zero,0x581e:zero,0x24648:zero,0x24466:zero,0x250f8:zero,0x2603e:zero,0x247c6:ambushed,0x23ff2:zero,0x3f58:zero,0x25056:zero,0x2417c:zero,0x242aa:zero,0x241f2:zero,0x2415e:zero,0x241ba:zero,0x24022:zero,0x45b0:zero,0x45d8:zero}
   u,seen,word,byte=run(0x26318,0x258b,[0x9100,*target,d+1],setup,hooks)
   assert byte(0xb8d5)==(0 if commander else 255);assert len(seen)==(0 if commander else 1);assert word(0x9112)==0
   results.append(dict(start=origin,target=target,jungle=hidden,nativeDirection=d,test='FULL-CHARGE-CAPTURE-TERMINAL-GATE',targetCommander=commander,winner=byte(0xb8d5),reason=byte(0xcb67),actorFinal=[byte(0x9018)>>4,byte(0x9018)&15],targetFinalMen=word(0x9112),targetFinalHex=hex(byte(0x9118)),calls=seen))
print(len(results),'passed');a.output.write_text(json.dumps(dict(originalSHA256=EXPECTED,cases=results,limits='Unchanged native full charge controller, both casualty/equipment equations, zero-men capture, service removal, army linked-list commander recognition, terminal winner/reason writes, occupation and jungle eligibility execute. Only native RNG, drawing/text/pause, and ambush casualty body are controlled. No UI, strategic AI target selection or recruit outcome claim.'),indent=2)+'\n')
