"""Statically decode supplied RTK2 DOS data, without modifying the inputs.

Usage: python3 tools/decode-reference.py INPUT_DIRECTORY OUTPUT_JSON
Optional --chinese-reference points to JuQiang/Rotk2_Python/Resources.
Portrait records decode to 64x40 native pixels; no portrait rescaling is applied.
"""
import argparse
import collections
import hashlib
import json
import struct
from pathlib import Path

FIELDS = {'int':4, 'war':5, 'charm':6, 'virtue':7, 'benevolence':8,
          'ambition':9, 'owner':10, 'loyalty':11, 'service':12,
          'spyOwner':13, 'spyProvince':14, 'compatibility':15,
          'training':22, 'birth':25}

def word(b, at):
    return struct.unpack_from('<H', b, at)[0]

def officer(b, index=None):
    result = {'id':index, 'name':b[28:41].split(b'\0')[0].decode('ascii', errors='replace')}
    result.update({name:b[offset] for name, offset in FIELDS.items()})
    result.update(blood=word(b,16), soldiers=word(b,18), weapons=word(b,20), portrait=word(b,26)-1)
    return result

def decode_scenario(data, index):
    block = data[index*0x33af:(index+1)*0x33af]
    buf = bytearray(0x3400)
    buf[0x42:0x42+len(block)] = block
    def chain(ptr):
        ids=[]
        while ptr:
            if ptr<0x58 or (ptr-0x58)%43 or (ptr-0x58)//43>254 or (ptr-0x58)//43 in ids:
                raise ValueError('Invalid officer chain')
            ids.append((ptr-0x58)//43)
            ptr=word(buf,ptr)
        return ids
    officers=[officer(buf[0x58+i*43:0x58+(i+1)*43],i) for i in range(255)]
    provinces=[]
    for i in range(41):
        start=0x2dc4+i*35
        provinces.append({'id':i+1,'serving':chain(word(buf,start+2)),
                          'free':chain(word(buf,start+4)), 'hidden':chain(word(buf,start+6)),
                          'gold':word(buf,start+8),'food':struct.unpack_from('<I',buf,start+10)[0],
                          'population':word(buf,start+14)*100,'owner':buf[start+16],
                          'raw':buf[start:start+35].hex()})
    rulers=[]
    for i in range(16):
        start=0x2b34+i*41
        ptr=word(buf,start)
        if not ptr:continue
        lead=(ptr-0x58)//43
        if not 0<=lead<255:continue
        rulers.append({'id':i,'leader':lead,'name':officers[lead]['name'],
                       'home':(word(buf,start+2)-0x2dc4)//35+1 if word(buf,start+2) else None,
                       'count':sum(len(p['serving']) for p in provinces if p['owner']==i)})
    return {'year':word(buf,0x44)+1,'officers':officers,'provinces':provinces,'rulers':rulers}

def portrait_pixels(data, index):
    """Return native 64x40 palette indexes; bit order matches GetSingleFace."""
    record=data[index*960:(index+1)*960]
    if len(record)!=960:raise ValueError('Invalid portrait index')
    return bytes(((record[i]>>bit)&1)*4+((record[i+1]>>bit)&1)*2+((record[i+2]>>bit)&1)
                 for i in range(0,960,3) for bit in range(7,-1,-1))

def portrait_sheet(data, output):
    from PIL import Image, ImageDraw
    palette=[(0,0,0),(85,255,85),(255,85,85),(255,255,85),
             (85,85,255),(85,255,255),(255,85,255),(255,255,255)]
    sheet=Image.new('RGB',(12*72,19*56),(18,18,18));draw=ImageDraw.Draw(sheet)
    for index in range(219):
        face=Image.new('RGB',(64,40));face.putdata([palette[i] for i in portrait_pixels(data,index)])
        x=index%12*72;y=index//12*56;sheet.paste(face,(x,y));draw.text((x,y+40),str(index),fill=(240,220,160))
    output.parent.mkdir(parents=True,exist_ok=True);sheet.save(output)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('inputs',type=Path)
    parser.add_argument('output',type=Path)
    parser.add_argument('--chinese-reference',type=Path)
    parser.add_argument('--portrait-sheet',type=Path,help='Optional native-pixel contact sheet (requires Pillow)')
    args=parser.parse_args()
    files={name:(args.inputs/name).read_bytes() for name in ['scenario.dat','taiki.dat','kaodata.dat']}
    assert len(files['scenario.dat'])==6*0x33af
    assert len(files['taiki.dat'])>=6+418*46
    assert len(files['kaodata.dat'])==219*960
    result={'files':{n:{'size':len(b),'sha256':hashlib.sha256(b).hexdigest()} for n,b in files.items()},
            'scenarios':[decode_scenario(files['scenario.dat'],i) for i in range(6)],
            'arrivalBlocks':[], 'arrivalTrailingBytes':len(files['taiki.dat'])-(6+418*46), 'portraits':{'count':219,'width':64,'height':40,'bytesPerRecord':960,
             'uniqueRecords':len({files['kaodata.dat'][i*960:(i+1)*960] for i in range(219)}),
             'encoding':'three interleaved 8-bit planes; 8 colours; RGB interpretation follows Helper.GetSingleFace'}}
    ranges=[(0,162),(162,267),(267,343),(343,386),(386,408),(408,418)]
    for start,end in ranges:
        records=[]
        for i in range(start,end):
            b=files['taiki.dat'][6+i*46:6+(i+1)*46]
            records.append({'record':i,'encodedYear':b[0],'referenceByte':b[1],
                            'province':b[2]+1,'sentinel':b[0]==255,'officer':officer(b[3:])})
        result['arrivalBlocks'].append(records)
    if args.chinese_reference:
        other={n:(args.chinese_reference/old).read_bytes() for n,old in [('scenario.dat','Scenario.dat'),('taiki.dat','Taiki.dat'),('kaodata.dat','Kaodata.dat')]}
        result['comparison']={'differentBytes':{n:sum(a!=b for a,b in zip(files[n],other[n])) for n in files},'scenarios':[]}
        for k,current in enumerate(result['scenarios']):
            old=decode_scenario(other['scenario.dat'],k);counts=collections.Counter()
            for i,(a,b) in enumerate(zip(current['officers'],old['officers'])):
                if not a['name']:continue
                for field in [*FIELDS,'blood','soldiers','weapons','portrait']:
                    if a[field]!=b[field]:counts[field]+=1
            lists=sum(p[key]!=q[key] for p,q in zip(current['provinces'],old['provinces']) for key in ['serving','free','hidden'])
            result['comparison']['scenarios'].append({'year':current['year'],'officerAttributeDifferences':dict(counts),'provinceListDifferences':lists,
                  'provinceRawDifferences':sum(p['raw']!=q['raw'] for p,q in zip(current['provinces'],old['provinces'])),
                  'rulerCountDifferences':sum(a['count']!=b['count'] for a,b in zip(current['rulers'],old['rulers']))})
        result['comparison']['arrivalNonNameRecordDifferences']=sum(files['taiki.dat'][6+i*46:6+i*46+31]+files['taiki.dat'][6+i*46+44:6+(i+1)*46] != other['taiki.dat'][6+i*46:6+i*46+31]+other['taiki.dat'][6+i*46+44:6+(i+1)*46] for i in range(418))
        result['comparison']['changedPortraitIndices']=[i for i in range(219) if files['kaodata.dat'][i*960:(i+1)*960]!=other['kaodata.dat'][i*960:(i+1)*960]]
    if args.portrait_sheet:portrait_sheet(files['kaodata.dat'],args.portrait_sheet)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print(json.dumps({'files':result['files'],'comparison':result.get('comparison'),'portraits':result['portraits']},indent=2))

if __name__=='__main__':main()
