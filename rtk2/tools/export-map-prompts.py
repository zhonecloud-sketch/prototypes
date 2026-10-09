"""Export all 41 recorded painting prompts with exact, reproducible terrain guides.
Run from any folder: python tools/export-map-prompts.py. Requires Pillow.
These guides are diagrams of game data, not replacement battlefield artwork.
"""
import hashlib, json, math
from pathlib import Path
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[1]
COLORS={0:'#bed6a4',1:'#28563b',2:'#b39052',3:'#747a78',4:'#5389a4',5:'#df8d48',6:'#e98477',9:'#152b22',99:'#152b22'}
def main():
    manifest=json.loads((ROOT/'config/battlefield-paintings.json').read_text())
    terrains=json.loads((ROOT/'config/province-terrain.json').read_text())
    out=ROOT/'docs/artwork/map-guides';out.mkdir(parents=True,exist_ok=True)
    records=[];sections=['# All 41 battlefield generation prompts\n\nThe prompts below are the recorded v17 prompts, copied verbatim from config/battlefield-paintings.json. Attach the corresponding guide when generating each map. Guides are rebuilt from the original terrain arrays; painting geography must not change game rules.\n\nGuide legend: pale green plains; dark green jungle; ochre hills; grey mountains; blue water; orange fort; coral palace; darkest outside footprint. Coordinates are zero-based (column q, row r), 13 columns × 12 rows, odd columns offset down by half a hex. Full guide canvas 1024 × 1109. Do not rotate, crop, shift anchors, invent terrain or stretch the result.\n']
    for m in manifest['maps']:
        pid=m['province'];grid=terrains[pid-1];assert grid==m['terrain']
        image=Image.new('RGB',(1024,1109),COLORS[99]);draw=ImageDraw.Draw(image)
        for i,t in enumerate(grid):
            q,r=i%13,i//13;x=(q-6)*1.5;z=(r-5.5+(q%2)*.5)*math.sqrt(3)
            points=[((x+math.cos(k*math.pi/3)+10)/20*1024,(z+math.sin(k*math.pi/3)+6*math.sqrt(3))/(12.5*math.sqrt(3))*1109) for k in range(6)]
            draw.polygon(points,fill=COLORS[t])
        guide=out/f'province-{pid:02d}.png';image.save(guide)
        record={k:m[k] for k in ['province','name','asset','terrainSha256','terrain','prompt']};record['guide']=guide.relative_to(ROOT/'docs/artwork').as_posix();record['guideSha256']=hashlib.sha256(guide.read_bytes()).hexdigest();records.append(record)
        palace=[(i%13,i//13) for i,t in enumerate(grid) if t==6]
        sections.append(f"## #{pid} · {m['name']}\n\nGuide: [province-{pid:02d}.png](map-guides/province-{pid:02d}.png). Palace anchors: {palace}.\n\n```text\n{m['prompt']}\n```\n\nTerrain rows, top to bottom:\n\n```text\n"+'\n'.join(' '.join(f'{t:02d}' for t in grid[r*13:(r+1)*13]) for r in range(12))+'\n```\n')
    (ROOT/'docs/artwork/battlefield-generation-prompts.md').write_text('\n'.join(sections))
    (ROOT/'docs/artwork/battlefield-generation-prompts.json').write_text(json.dumps({'version':31,'guideSize':[1024,1109],'maps':records},ensure_ascii=False,indent=2)+'\n')
    print('Exported 41 original prompts, 41 terrain guides and exact grids.')
if __name__=='__main__':main()
