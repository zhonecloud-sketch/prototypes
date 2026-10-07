"""Import native service/personality fields and every declared future-arrival record.
Names use the canonical catalogue, matched to encoded Chinese reference names.
No original binary is redistributed in the generated game data.
"""
import argparse,json,struct
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('scenario_dat',type=Path);p.add_argument('taiki_dat',type=Path);p.add_argument('chinese_scenario_dat',type=Path);p.add_argument('chinese_taiki_dat',type=Path)
a=p.parse_args();root=Path(__file__).resolve().parents[1];app=root/('dist' if (root/'dist').exists() else 'rtk2')
ss=json.loads((app/'scenarios.json').read_text());sd=a.scenario_dat.read_bytes();cs=a.chinese_scenario_dat.read_bytes();td=a.taiki_dat.read_bytes();ct=a.chinese_taiki_dat.read_bytes()
roster=json.loads((app/'officer-roster.mjs').read_text().split('export const OFFICER_ROSTER=')[1].split(';')[0]);names={};byname={o['name']:o for o in roster}
for n,s in enumerate(ss):
 for o in s['officers']:
  off=n*0x33af+0x16+o['id']*43;b=sd[off:off+43];ch=cs[off:off+43]
  if o.get('pendingArrival'):continue
  if o['name']!='Unnamed':names[(ch[28:41].split(b'\0')[0].hex(),ch[25])]=roster[o['rosterId']]
  o['benevolence']=b[8];o['blood']=struct.unpack_from('<H',b,16)[0]
  if o['owner']!=255:o['serviceSince']=s['year']-max(1,b[12])+1
extra={'aa4b988b':'Bao Xin','98d9a5c3':'Jiang Wei','a6abaad2':'Liu Shan','9b30a0f3':'Sun Deng','93b29cea9b50':'Sima Shi','a7f9a3b5a7f7':'Zhuge Dan','93b29cea996b':'Sima Zhao','ab95a2c3':'Zhong Hui','9e399e94':'Cao Shuang','9b3096ce':'Sun He'}
counts=list(td[:6]);offset=6;out=[]
for n,count in enumerate(counts):
 rows=[]
 for i in range(count):
  rec=td[offset:offset+46];ch=ct[offset:offset+46];offset+=46
  assert rec[:31]==ch[:31] and rec[44:]==ch[44:]
  if rec[0]==255:continue
  b=rec[3:];c=ch[3:];raw=c[28:41].split(b'\0')[0].hex();english=b[28:41].split(b'\0')[0].decode('ascii');english={'Han Kai':'Huan Kai','Quan Zong':'Quan Cong','Fei Wei':'Fei Yi'}.get(english,english);ident=names.get((raw,c[25])) or next((x for x in roster if x['name']==english and x['birth']==c[25]),None) or byname.get(extra.get(raw))
  assert ident is not None,(n,i,raw,c[25]);assert rec[2]<41
  rows.append(dict(record=i,appearanceYear=rec[0]+1,arrivalProvince=rec[2]+1,sourceSlot=rec[1],name=ident['name'],zh=ident['zh'],rosterId=ident['id'],birth=ident['birth'],int=b[4],war=b[5],charm=b[6],virtue=b[7],benevolence=b[8],ambition=b[9],loyalty=min(100,b[11]),compatibility=b[15],blood=struct.unpack_from('<H',b,16)[0],portrait=struct.unpack_from('<H',b,26)[0]-1))
 out.append(rows)
(app/'scenarios.json').write_text(json.dumps(ss,ensure_ascii=False,separators=(',',':')))
(app/'future-officers.mjs').write_text('// Complete non-sentinel Taiki records. Source slot is retained as evidence, not reused at runtime.\nexport const FUTURE_OFFICERS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
print('Future records:',[len(x) for x in out],'total',sum(map(len,out)))
