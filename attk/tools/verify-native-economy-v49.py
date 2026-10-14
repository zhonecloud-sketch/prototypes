"""Bounded 16-bit witnesses from the supplied English main.exe, not DOS gameplay.

Weapons maximum, weapons purchase arithmetic, treasury settlement and a successful
flight are run unchanged. UI, destination lookup, and officer-list presentation
have explicit bounded hooks. No arithmetic is replaced.
"""
import argparse, hashlib, importlib.util, json, struct
from pathlib import Path
from unicorn import Uc, UC_ARCH_X86, UC_MODE_16, UC_HOOK_CODE
from unicorn.x86_const import *

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('main_exe',type=Path)
parser.add_argument('output',type=Path)
parser.add_argument('--verifier',type=Path,default=Path(__file__).with_name('verify-original.py'))
args=parser.parse_args()
spec=importlib.util.spec_from_file_location('original',args.verifier)
original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
raw=args.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==original.EXPECTED
image=bytes(original.unpack(raw)[0]);DS=0x2fa60
assert image[0x08bc1:0x08bc6].hex()=='9a5c04c208' # unconditional native settlement call
assert image[0x1900e:0x19030].hex()=='8b46fe8b1e9a33294708b9102751b96400f7e1508b4606051400508bf09a8c009c04'

def write(u,at,fmt,*values):u.mem_write(DS+at,struct.pack('<'+fmt,*values))
def word(u,at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
def long(u,at):return struct.unpack('<I',u.mem_read(DS+at,4))[0]
def execute(start,setup,stop=0x60000,segment=None,hooks=None):
    u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,image)
    u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16)
    u.reg_write(UC_X86_REG_SP,0xfc00);u.reg_write(UC_X86_REG_BP,0xfe00)
    write(u,0xfc00,'HH',0,0x6000);setup(u)
    observed={'instructions':0,'hooked':[],'stopped':False}
    def hook(u,at,size,data):
        observed['instructions']+=1
        if at==stop:observed['stopped']=True;u.emu_stop();return
        if hooks and at in hooks:
            sp=u.reg_read(UC_X86_REG_SP);ip,cs=struct.unpack('<HH',u.mem_read(DS+sp,4))
            value=hooks[at](u,sp,observed);observed['hooked'].append(hex(at))
            u.reg_write(UC_X86_REG_AX,value);u.reg_write(UC_X86_REG_SP,sp+4)
            u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
    u.hook_add(UC_HOOK_CODE,hook)
    cs=segment if segment is not None else start//16
    u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,start-cs*16)
    u.emu_start(start,0x60001,count=100000)
    assert observed['stopped'],(hex(start),hex(u.reg_read(UC_X86_REG_CS)*16+u.reg_read(UC_X86_REG_IP)))
    return u,observed

zero=lambda u,sp,o:0
output={'sha256':original.EXPECTED,'weaponsMaximum':[],'weaponsPurchase':[],'settlement':[],'flight':[]}

for intelligence in [0,40,80,100]:
    for equipment in [0,1,50,9900,9951,9999,10000]:
        for gold in [0,1,5,100,30000]:
            def setup(u):
                write(u,0x339a,'H',0x9100);write(u,0x9108,'H',gold)
                write(u,0x9004,'B',intelligence);write(u,0x9014,'H',equipment)
                write(u,0xfe06,'H',0x9000);u.reg_write(UC_X86_REG_BX,0x9000)
            u,observed=execute(0x18fce,setup,stop=0x18fea)
            maximum=u.reg_read(UC_X86_REG_AX)
            assert maximum==min(gold,100-equipment//100)
            output['weaponsMaximum'].append(dict(intelligence=intelligence,weapons=equipment,gold=gold,maximumLots=maximum))
            if equipment==10000 or gold==0:continue
            for lots in sorted(set([1,maximum])):
                def setup(u):
                    write(u,0x339a,'H',0x9100);write(u,0x9108,'H',gold)
                    write(u,0x9004,'B',intelligence);write(u,0x9012,'HH',5000,equipment)
                    write(u,0xfdfe,'H',lots);write(u,0xfe06,'H',0x9000)
                u,observed=execute(0x1900e,setup,stop=0x1905b,hooks={0x45d8:zero,0x591e:zero})
                actualGold=word(u,0x9108);actualWeapons=word(u,0x9014)
                assert actualGold==gold-lots and actualWeapons==min(10000,equipment+100*lots)
                output['weaponsPurchase'].append(dict(intelligence=intelligence,weaponsBefore=equipment,goldBefore=gold,lots=lots,goldAfter=actualGold,weaponsAfter=actualWeapons))

for winner,status in [('attack',1),('defend',5)]:
    for attackGold,defendGold,attackFood,defendFood in [(500,700,20000,30000),(20000,22000,2000000,2200000),(0,1,0,1)]:
        def setup(u):
            write(u,0xca9a,'H',0x9000);write(u,0xcb67,'B',status)
            write(u,0xcaa1,'HHII',defendGold,attackGold,defendFood,attackFood)
            write(u,0x9108,'HI',1234,56789)
            write(u,0x9008,'HI',111,222)
        u,observed=execute(0x907c,setup,segment=0x8c2)
        provinceGold=word(u,0x9008);provinceFood=long(u,0x900a)
        assert provinceGold==min(30000,attackGold+defendGold)
        assert provinceFood==min(3000000,attackFood+defendFood)
        assert word(u,0x9108)==1234 and long(u,0x910a)==56789
        output['settlement'].append(dict(winner=winner,status=status,attackGold=attackGold,defendGold=defendGold,attackFood=attackFood,defendFood=defendFood,battlefieldProvinceGold=provinceGold,battlefieldProvinceFood=provinceFood,sourceGold=1234,sourceFood=56789))

# The successful native flight branch transfers the officer, not field stores.
# Horse guarantees the unchanged 0x25566 success branch; field/list UI hooks are
# bounded and do not read or alter any food/gold values.
for fieldCode in [1,4,255]:
    stores=struct.pack('<HHII',700,500,30000,20000)
    def setup(u):
        write(u,0xfc00,'HHHHH',0,0x6000,0x9000,9,fieldCode)
        write(u,0x9000,'H',0);write(u,0x9402,'H',0)
        write(u,0x9002,'B',64);write(u,0x9012,'HH',5000,4900)
        u.mem_write(DS+0xcaa1,stores)
        write(u,0x9108,'HI',1234,56789);write(u,0x9408,'HI',777,88888)
    hooks={0x52c6:lambda u,sp,o:0x9400,0x5280:lambda u,sp,o:0x9300,0x55f8:zero,0x54b2:lambda u,sp,o:1,0x2514a:zero,0x2532e:zero,0x2417c:zero,0x241ba:zero}
    u,observed=execute(0x25670,setup,segment=0x2556,hooks=hooks)
    assert bytes(u.mem_read(DS+0xcaa1,12))==stores
    assert word(u,0x9108)==1234 and long(u,0x910a)==56789
    assert word(u,0x9408)==777 and long(u,0x940a)==88888
    assert word(u,0x9012)==5000 and word(u,0x9014)==4900
    assert word(u,0x9402)==0x9000
    output['flight'].append(dict(fieldCode=fieldCode,fieldStoresUnchanged=True,sourceStoresUnchanged=True,destinationStoresUnchanged=True,officerMovedToDestination=True,soldiers=5000,weapons=4900,hooks=observed['hooked']))

output['witnesses']={
 'weaponsMaximum':{'offset':'0x18FCE','equation':'min(gold, 100 - floor(weapons / 100))'},
 'weaponsPurchase':{'offset':'0x1900E','equation':'gold -= lots; weapons = min(10000, weapons + 100 * lots); INT is not read'},
 'settlementCaller':{'offset':'0x08BC1','meaning':'unconditional call to 0x0907C after native outcome/captive processing'},
 'settlement':{'offset':'0x0907C','equation':'battlefield province gets both remaining field stores; gold cap 30000, food cap 3000000'},
 'flight':{'offset':'0x25670','meaning':'successful flight transfers officer with soldiers/equipment, with no field gold/food refund'},
 'setup':{'offset':'0x1EBD2–0x1EC1A','meaning':'attacker CAA3 gold / CAA9:CAAB food; defender CAA1 gold / CAA5:CAA7 food'}
}
args.output.parent.mkdir(parents=True,exist_ok=True)
args.output.write_text(json.dumps(output,separators=(',',':'))+'\n')
print(f"PASS {sum(len(output[k]) for k in ['weaponsMaximum','weaponsPurchase','settlement','flight'])} native economy witnesses; bounded UI hooks, no arithmetic replaced")
