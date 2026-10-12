"""Bounded v50 reward witnesses from the supplied English main.exe.

Runs the native candidate builder, reward arithmetic, action mark and deduction.
Officer-menu input, confirmation, presentation and random draws are controlled;
these hooks do not change officer or province stores. This is not DOS gameplay.
"""
import argparse, hashlib, importlib.util, json, struct
from pathlib import Path
from unicorn import Uc, UC_ARCH_X86, UC_MODE_16, UC_HOOK_CODE
from unicorn.x86_const import *
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==original.EXPECTED
image=bytes(original.unpack(raw)[0]);DS=0x2fa60
checks={'reward_uses_candidate_flags_5':(0x18df2,'b00550ff369a339a82039d05'),'candidate_skips_first_only_if_ruler_and_flag_4':(0x5d85,'539a4a00250583c4028bd88b46fc3907750af646080474048bd88b07'),'governor_action_bit_only':(0x60d0,'558bec8b5e06804f02015dcb'),'horse_deducts_stock':(0x18bad,'8b1e9a33fe4f19'),'gold_deducts_amount':(0x18c67,'8b46fc8b1e9a33294708')}
for name,(offset,value) in checks.items():assert image[offset:offset+len(bytes.fromhex(value))]==bytes.fromhex(value),name

def w(u,off,fmt,*v):u.mem_write(DS+off,struct.pack('<'+fmt,*v))
def read(u,off,fmt):return struct.unpack('<'+fmt,u.mem_read(DS+off,struct.calcsize('<'+fmt)))[0]
def execute(start,setup,args=(),hooks=None):
    u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,image);u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xfc00)
    w(u,0xfc00,'HH',0,0x6000)
    for i,value in enumerate(args):w(u,0xfc04+i*2,'H',value)
    setup(u);observed={'stopped':False,'hooks':[]}
    def hook(u,at,size,data):
        if at==0x60000:observed['stopped']=True;u.emu_stop();return
        if hooks and at in hooks:
            sp=u.reg_read(UC_X86_REG_SP);ip,cs=struct.unpack('<HH',u.mem_read(DS+sp,4));value=hooks[at](u,sp);observed['hooks'].append(hex(at));u.reg_write(UC_X86_REG_AX,value);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
    u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,(start//0x1000)*0x100);u.reg_write(UC_X86_REG_IP,start%0x1000);u.emu_start(start,0x60001,count=50000)
    assert observed['stopped'],hex(u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X86_REG_IP));return u,observed

def setup(u,home=False,acted=False,sick=False):
    # Native owner 0; the ruler's first-officer pointer is 0x9200.
    w(u,0x3394,'H',0x2b34);w(u,0x339a,'H',0x9000);w(u,0x2b34,'H',0x9200)
    w(u,0x9002,'H',0x9200 if home else 0x9100);w(u,0x9010,'B',0);w(u,0x9008,'H',500);w(u,0x9019,'B',3)
    w(u,0x9100,'H',0x9300);w(u,0x9200,'H',0x9300);w(u,0x9300,'H',0)
    for off in [0x9100,0x9200,0x9300]:
        w(u,off+2,'B',1 if acted else 0);w(u,off+3,'B',3 if sick else 0);w(u,off+6,'B',80);w(u,off+0xa,'B',0);w(u,off+0xb,'B',50)
    w(u,0x2b38,'H',0x9300);w(u,0x9304,'B',90);w(u,0x9104,'B',40);w(u,0x9204,'B',40)

output={'sha256':original.EXPECTED,'checks':{n:hex(o) for n,(o,_) in checks.items()},'candidates':[],'awards':[],'aiAwards':[]}
for home in [False,True]:
    for acted,sick in [(False,False),(True,False),(False,True)]:
        u,obs=execute(0x5d52,lambda u:setup(u,home,acted,sick),args=[0x9000,5]);count=u.reg_read(UC_X86_REG_AX)&255;entries=[read(u,0xceb2+2*i,'H') for i in range(count)]
        assert entries==([0x9300] if home else [0x9100,0x9300]);assert 0x9200 not in entries
        output['candidates'].append(dict(rulerPresent=home,recipientsAlreadyActed=acted,recipientsRecovering=sick,eligible=['subordinate'] if home else ['governor','subordinate']))

zero=lambda u,sp:0
for kind,menuChoice in [('gold',1),('horse',2),('writings',3)]:
    for roll in [0,1]:
        def selected(u,sp):
            assert read(u,sp+4,'H')==(1 if kind=='writings' else 5)
            assert read(u,0xceb2,'H')==0x9100 # native full entry rebuilt this reward list.
            return 0x9100
        def rng(u,sp):assert read(u,sp+4,'H')&255==2;return roll
        def number(u,sp):
            prompt=read(u,sp+4,'H');assert prompt in [0x87a2,0x875b];return menuChoice if prompt==0x87a2 else 40
        hooks={0x63c6:selected,0x4de0:zero,0x48a2:number,0x139c6:zero,0x102ea:lambda u,sp:1,0x58ba:rng,0x45d8:zero,0x45b0:zero,0x591e:zero,0x58e6:zero}
        u,obs=execute(0x18dd0,setup,hooks=hooks)
        loyalty=read(u,0x910b,'B');intelligence=read(u,0x9104,'B');gold=read(u,0x9008,'H');horses=read(u,0x9019,'B');acted=read(u,0x9102,'B')
        assert acted&1
        assert loyalty==({'gold':58+roll,'horse':70+roll,'writings':50}[kind]);assert intelligence==(41 if kind=='writings' else 40);assert gold==(460 if kind=='gold' else 500);assert horses==(2 if kind=='horse' else 3)
        assert read(u,0x9302,'B')==0 and read(u,0x9202,'B')==0
        output['awards'].append(dict(kind=kind,rulerPresent=False,recipient='governor',randomBonus=roll,loyaltyAfter=loyalty,intAfter=intelligence,goldAfter=gold,horsesAfter=horses,governorActed=True,rulerActed=False,advisorActed=False))
# Native AI selects the first low-loyalty governor (skipping only a ruler).
# Fixing the opportunity test controls policy choice, not eligibility or gain.
for difficulty in [1,2,3]:
    for bonusRoll in range(difficulty):
        for horse in [False,True]:
            draws=[]
            def aiSetup(u):setup(u);w(u,0x33b3,'B',difficulty);w(u,0x9019,'B',3 if horse else 0)
            def aiRng(u,sp):
                bound=read(u,sp+4,'H')&255;draws.append(bound)
                return 0 if len(draws)==1 else bonusRoll
            u,obs=execute(0x1fc80,aiSetup,hooks={0x589c:lambda u,sp:1,0x58ba:aiRng,0x1c06c:zero})
            assert draws==[2,difficulty], (difficulty,horse,draws,obs)
            loyalty=read(u,0x910b,'B');assert loyalty==71+bonusRoll
            assert read(u,0x9102,'B')&1 and not read(u,0x9202,'B')&1
            assert read(u,0x9008,'H')==(500 if horse else 400);assert read(u,0x9019,'B')==(2 if horse else 0)
            output['aiAwards'].append(dict(difficulty=difficulty,kind='horse' if horse else 'gold',recipient='governor',rulerPresent=False,ordinaryBonus=0,extraBonus=bonusRoll+1,loyaltyAfter=loyalty))
output['conclusions']=['A governor may receive gold, horse or writings in their own province without the ruler present.','The ruler is excluded from reward recipients; the current province governor spends the order.','Recipient action/recovery status is not filtered by the reward list, provided the governor can execute the order.','Native AI may select its governor and adds a second random bonus of 1..difficulty after the ordinary reward gain.','Reward Horse removes one province horse and grants the same loyalty value as 100 gold; the inspected path does not set a personal mount flag.']
output['limitations']=['Bounded witnesses control UI and RNG; they do not emulate complete DOS sessions.','Native recipient enumeration includes loyalty-100 officers; the gain helper returns zero for them. Remaster prevents spending at loyalty 100.','Writings UI can confirm an unsuccessful lesson; the remaster prevents lessons that cannot raise INT.']
a.output.write_text(json.dumps(output,indent=2)+'\n');print(f'{len(checks)} native byte checks, {len(output["candidates"])} candidate cases and {len(output["awards"])} reward cases and {len(output["aiAwards"])} AI reward cases passed.')
