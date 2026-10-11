"""Bounded main.exe fire-goal checks; optional unicorn, no DOS/UI simulation.

Execute the recovered AI goal branch unchanged. Hooks control direction order,
unit lookup and UI/mobility bookkeeping. Movement/combat resolution is outside
this witness, so these checks establish priorities rather than full AI fidelity.
"""
import argparse, hashlib, importlib.util, json, struct
from pathlib import Path
from unicorn import Uc, UC_ARCH_X86, UC_MODE_16, UC_HOOK_CODE
from unicorn.x86_const import *

p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==original.EXPECTED
image=bytes(original.unpack(raw)[0]);DS=0x2fa60
cases=[
    dict(name='Burning palace with dry neighbouring ground',at=[6,6],palace=[6,6],men=5000,enemy=None,blocked=False),
    dict(name='Burning field beside an empty dry palace',at=[6,6],palace=[7,6],men=5000,enemy=None,blocked=False),
    dict(name='Burning palace with a weak adjacent enemy commander',at=[6,6],palace=[6,6],men=5000,enemy=dict(at=[7,6],men=999),blocked=False),
    dict(name='Exactly 3000 men do not take the commander exception',at=[6,6],palace=[6,6],men=3000,enemy=dict(at=[7,6],men=999),blocked=False),
    dict(name='Exactly 1000 enemy men do not take the exception',at=[6,6],palace=[6,6],men=5000,enemy=dict(at=[7,6],men=1000),blocked=False),
    dict(name='Burning palace with no dry affordable neighbour',at=[6,6],palace=[6,6],men=5000,enemy=None,blocked=True),
]
def run(case,camp):
    u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,image)
    u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xff00)
    def write(at,fmt,*values):u.mem_write(DS+at,struct.pack(fmt,*values))
    def word(at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
    q,r=case['at'];pq,pr=case['palace'];own=camp;enemy=2-own;own_flag=1 if own==0 else 4;enemy_flag=4 if own==0 else 1;write(0xff00,'4H',0,0x6000,own,0x9000)
    u.mem_write(DS+0xb9d0,bytes([0]*156));u.mem_write(DS+0xba6c,bytes([32 if case['blocked'] else 0]*156))
    write(0xb9d0+pr*13+pq,'B',6);write(0xba6c+r*13+q,'B',32+own_flag)
    write(0xb8d7,'BB',pq,pr);write(0xb8db,'BB',q,r);write(0xb8e4,'H',0)
    write(0x9012,'H',case['men']);write(0x9017,'BB',10,(q<<4)|r);write(0xcaae,'B',6)
    u.mem_write(DS+0xca8e,bytes(range(6)));write(0xcb76+own*10,'H',0x9000);write(0xcb76+enemy*10,'H',0x9100)
    if case['enemy']:
        eq,er=case['enemy']['at'];write(0xba6c+er*13+eq,'B',enemy_flag);write(0x9112,'H',case['enemy']['men']);write(0x9118,'B',(eq<<4)|er)
    reached_fallback=False
    def hook(u,at,size,data):
        nonlocal reached_fallback
        if at==0x60000:u.emu_stop();return
        if at==0x2af36:reached_fallback=True;u.emu_stop();return
        if at not in [0x539e,0x2461a,0x237ea]:return
        sp=u.reg_read(UC_X86_REG_SP);ip,cs=struct.unpack('<2H',u.mem_read(DS+sp,4))
        if at==0x237ea:
            cell=[word(sp+4)&255,word(sp+6)&255];value=0x9100 if case['enemy'] and cell==case['enemy']['at'] else 0x9000
        else:value=0
        u.reg_write(UC_X86_REG_AX,value);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
    u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,0x2984);u.reg_write(UC_X86_REG_IP,0x154a)
    u.emu_start(0x2ad8a,0x60001,count=100000)
    assert reached_fallback or u.reg_read(UC_X86_REG_CS)==0x6000
    goal=list(u.mem_read(DS+0xb8db,2));target=word(0xb8e4)
    if case['blocked']:assert reached_fallback
    elif case['enemy'] and case['men']>3000 and case['enemy']['men']<1000:assert goal==case['at'] and target==0x9100
    else:assert goal!=case['at'] and not target
    return dict(**case,nativeArmySlot=camp,goal=goal,target='enemy commander' if target else None,fireFallback=reached_fallback)

out=dict(originalSha256=original.EXPECTED,unpackedSha256=hashlib.sha256(image).hexdigest(),entry='0x2AD8A',cases=[run(case,camp) for camp in [0,2] for case in cases])
a.output.write_text(json.dumps(out,indent=2)+'\n');print(f"{len(out['cases'])} bounded native fire-goal checks passed")
