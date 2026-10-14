"""v33 bounded native ambush, flight, Train and Give vectors (optional unicorn).
UI, ownership and random calls have controlled hooks; arithmetic runs unchanged.
This is not DOS execution or a full native battle simulation.
"""
import argparse, hashlib, importlib.util, json, math, random, struct
from pathlib import Path
from unicorn import Uc, UC_ARCH_X86, UC_MODE_16, UC_HOOK_CODE
from unicorn.x86_const import *
p=argparse.ArgumentParser(description=__doc__);p.add_argument('main_exe',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
spec=importlib.util.spec_from_file_location('original',Path(__file__).with_name('verify-original.py'));original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
raw=a.main_exe.read_bytes();assert hashlib.sha256(raw).hexdigest()==original.EXPECTED
image=bytes(original.unpack(raw)[0]);DS=0x2fa60
def write(u,at,fmt,*values):u.mem_write(DS+at,struct.pack(fmt,*values))
def execute(start,args,setup,rolls=(),hooks=None):
    u=Uc(UC_ARCH_X86,UC_MODE_16);u.mem_map(0,0x100000);u.mem_write(0,image)
    u.reg_write(UC_X86_REG_DS,DS//16);u.reg_write(UC_X86_REG_SS,DS//16);u.reg_write(UC_X86_REG_SP,0xff00)
    write(u,0xff00,'H'*(len(args)+2),0,0x6000,*args);setup(u);queue=list(rolls);observed={}
    def hook(u,at,size,data):
        if at==0x60000:u.emu_stop();return
        sp=u.reg_read(UC_X86_REG_SP)
        if at in [0x4b38,0x58ba]:
            ip,cs,bound=struct.unpack('<3H',u.mem_read(DS+sp,6));value=queue.pop(0)
            assert 0<=value<bound or bound==0,(at,value,bound)
        elif hooks and at in hooks:
            ip,cs=struct.unpack('<2H',u.mem_read(DS+sp,4));value=hooks[at](u,sp,observed)
        else:return
        u.reg_write(UC_X86_REG_AX,value);u.reg_write(UC_X86_REG_SP,sp+4);u.reg_write(UC_X86_REG_CS,cs);u.reg_write(UC_X86_REG_IP,ip)
    u.hook_add(UC_HOOK_CODE,hook);u.reg_write(UC_X86_REG_CS,start//16);u.reg_write(UC_X86_REG_IP,start%16)
    u.emu_start(start,0x60001,count=100000);assert u.reg_read(UC_X86_REG_CS)==0x6000
    return u,u.reg_read(UC_X86_REG_AX),observed
def unit(u,ptr,x):
    write(u,ptr+2,'BBB',64 if x.get('hasHorse') else 0,0,x.get('int',80));write(u,ptr+5,'BB',x['war'],x.get('charm',50))
    write(u,ptr+0x12,'HHBBBH',x['soldiers'],x['weapons'],x['training'],x.get('mobility',0),0x55,163 if x.get('combatWarBonus') else 100)
def readword(u,at):return struct.unpack('<H',u.mem_read(DS+at,2))[0]
rng=random.Random(33);out={'ambush':[],'flight':[],'training':[],'give':[],'geometry':[]}
zero=lambda u,sp,o:0
for i in range(240):
    mover=dict(soldiers=10000,weapons=rng.randrange(10001),war=rng.randrange(101),training=rng.randrange(101),int=[89,90,100][i%3]);ambusher=dict(soldiers=10000,weapons=rng.randrange(10001),war=rng.randrange(101),training=rng.randrange(101),combatWarBonus=20 if i%7==0 else 0)
    terrain=[0,1,2,4,5,6][i%6];D=1+i%5;human=i%2==0;R=rng.randrange(300);F=rng.randrange(30)
    def setup(u):
        unit(u,0x9000,mover);unit(u,0x9100,ambusher);write(u,0xb8e4,'H',0x9200);write(u,0xb9d0+70,'B',terrain);write(u,0x33b3,'B',D)
    def lookup(u,sp,o):return 0x9000 if readword(u,sp+4)&255==5 else 0x9100
    def humanhook(u,sp,o):return int(human and readword(u,sp+4)==0x9100)
    hooks={0x250f8:zero,0x237ea:lookup,0x238fa:humanhook,0x24466:zero,0x2417c:zero}
    u,_,_=execute(0x247c6,[5,5,6,5],setup,[R,F],hooks)
    loss=10000-readword(u,0x9012);weapons=mover['weapons']-readword(u,0x9014)
    out['ambush'].append(dict(mover=mover,ambusher=ambusher,terrain=terrain,factor=D if human else 1,random300=R,random30=F,loss=loss,weapons=weapons))
for i in range(240):
    x=dict(soldiers=rng.randrange(10001),weapons=0,training=rng.randrange(101),war=rng.randrange(101),mobility=rng.randrange(11),hasHorse=i%7==0,combatWarBonus=20 if i%9==0 else 0)
    enemies=i%7;ruler=i%3==0;R=rng.randrange(10);roll=rng.randrange(100)
    def setup(u):unit(u,0x9000,x)
    def probability(u,sp,o):
        chance=readword(u,sp+4);o['chance']=chance;return int(roll<chance)
    hooks={0x23532:lambda u,sp,o:enemies,0x55f8:lambda u,sp,o:int(ruler),0x589c:probability}
    u,result,observed=execute(0x25566,[0x9000],setup,[R],hooks)
    mobility=u.mem_read(DS+0x9017,1)[0];chance=100 if x['hasHorse'] else observed['chance']
    expected=100 if x['hasHorse'] else min(100,(10*mobility+x['war']+x['training']+x['soldiers']//100)//(enemies+2)+x['combatWarBonus']+(20 if ruler else 0)+R)
    assert chance==expected,(chance,expected,x)
    out['flight'].append(dict(unit=x,enemies=enemies,ruler=ruler,random10=R,roll100=roll,mobility=mobility,chance=chance,escaped=bool(result)))
for i in range(160):
    armies=[dict(soldiers=rng.randrange(10001),training=100 if j%3==0 else rng.randrange(100)) for j in range(1+i%10)];war=rng.randrange(101)
    def setup(u):
        write(u,0x339a,'H',0x9000);write(u,0x9002,'H',0x9100);write(u,0x9805,'B',war)
        for j,x in enumerate(armies):write(u,0x9100+48*j,'H',0x9100+48*(j+1) if j+1<len(armies) else 0);write(u,0x9112+48*j,'H',x['soldiers']);write(u,0x9116+48*j,'B',x['training'])
    _,gain,_=execute(0x10fde,[0x9800],setup)
    assert gain==2*war//math.isqrt(1+sum(x['soldiers']//100 for x in armies if x['training']!=100))
    out['training'].append(dict(war=war,armies=armies,gain=gain))
for i in range(160):
    population=100*(1+rng.randrange(30000));governor=rng.randrange(101);actor=rng.randrange(101);food=1+rng.randrange(10000);D=1+i%5
    def setup(u):write(u,0x339a,'H',0x9000);write(u,0x9002,'H',0x9100);write(u,0x900e,'H',population//100);write(u,0x9017,'B',50);write(u,0x9106,'B',governor);write(u,0x9206,'B',actor);write(u,0x33b3,'B',D)
    _,gain,_=execute(0x106a0,[0x9200,food],setup)
    gain&=255;assert gain==((governor+actor)//2*math.isqrt(food)//((6+D)*math.isqrt(population//100)))&255
    out['give'].append(dict(population=population,governorCharm=governor,officerCharm=actor,food=food,difficulty=D,gain=gain))
for q in [5,6]:
    for d in range(6):
        def setup(u):write(u,0x9000,'BB',q,5)
        u,_,_=execute(0x23bea,[0x9000,0x9001,d],setup)
        to=list(u.mem_read(DS+0x9000,2));_,direction,_=execute(0x24e00,[q,5,*to],lambda u:None)
        assert direction&255==d
        arcs=list(image[DS+0xb5fe+3*d:DS+0xb5fe+3*d+3]);cells=[]
        for direction in arcs:
            def setup(u):write(u,0x9000,'BB',*to)
            u,_,_=execute(0x23bea,[0x9000,0x9001,direction],setup);cells.append(list(u.mem_read(DS+0x9000,2)))
        out['geometry'].append(dict(fromCell=[q,5],toCell=to,nativeDirection=d,cells=cells))
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(out,separators=(',',':'))+'\n')
print(f'{sum(map(len,out.values()))} controlled native v33 vectors passed; arithmetic unchanged, bounded UI/RNG/ownership hooks')
