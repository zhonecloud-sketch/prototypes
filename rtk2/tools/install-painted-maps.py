"""Encode all 41 generated paintings without resizing or altering their artwork.
Usage: python tools/install-painted-maps.py /absolute/path/to/generated-map-folder
Requires Pillow. The input folder contains province-NN.png and manifest.json.
"""
from pathlib import Path
import argparse, hashlib, json
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
def sha(data):return hashlib.sha256(data).hexdigest()
def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sources',type=Path);args=parser.parse_args()
    inputs=json.loads((args.sources/'manifest.json').read_text())
    assert len(inputs)==41 and {r['province'] for r in inputs}==set(range(1,42)), 'All 41 original maps are required.'
    terrains=json.loads((ROOT/'config/province-terrain.json').read_text())
    provinces=json.loads((ROOT/'config/scenarios.json').read_text())[0]['provinces']
    output=ROOT/'assets/battlefields';output.mkdir(parents=True,exist_ok=True)
    records=[];hashes=set()
    for record in sorted(inputs,key=lambda r:r['province']):
        number=record['province'];source=args.sources/f'province-{number:02d}.png'
        with Image.open(source) as image:
            assert abs(image.width/image.height-1024/1109)<.002, f'Province {number}: artwork registration aspect is incorrect.'
            # Format conversion only: preserve every source pixel's position and aspect.
            final=output/f'province-{number:02d}-v17.webp'
            image.convert('RGB').save(final,'WEBP',quality=88,method=6)
            digest=sha(final.read_bytes());assert digest not in hashes,'Repeated province painting';hashes.add(digest)
            grid=terrains[number-1]
            records.append({'province':number,'name':provinces[number-1]['seat'],
                'asset':final.relative_to(ROOT).as_posix(),'width':image.width,'height':image.height,
                'sha256':digest,'sourceSha256':sha(source.read_bytes()),
                'terrainSha256':sha(bytes(grid)),'terrain':grid,'prompt':record['prompt']})
    manifest={'version':17,'generation':'Built-in image generation: one complete painting per original terrain guide.',
        'registration':{'guideWidth':1024,'guideHeight':1109,'worldLeft':-10,'worldTop':-6*3**.5,'worldWidth':20,'worldHeight':12.5*3**.5},
        'maps':records}
    (ROOT/'config/battlefield-paintings.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(f'Installed {len(records)} distinct province paintings; original terrain arrays are unchanged.')
if __name__=='__main__':main()
