"""Package rtk2 exactly as deployed; optionally include its shared runtime library."""
from pathlib import Path
import argparse, subprocess, zipfile, json, hashlib
APP=Path(__file__).resolve().parents[1]
PRIVATE_DOS_PREFIXES=('fmdrv','grpdata','hexdata','koei','packdata','rtk2')
def private_dos(file):
    return file.suffix.lower() in ('.com','.dat','.bat') and any(file.stem.lower()==n or file.stem.lower().startswith(n+'(') for n in PRIVATE_DOS_PREFIXES)
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('output',type=Path);parser.add_argument('--include-shared',action='store_true',help='Include lib/js-yaml.js for a complete runnable download.');args=parser.parse_args()
    repo=next((p for p in [APP,*APP.parents] if (p/'.git').exists()),None)
    if repo:
        if subprocess.check_output(['git','status','--porcelain'],cwd=repo).strip():raise SystemExit('Commit the checked source before packaging.')
        commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
    else:commit=(APP/'SOURCE-COMMIT.txt').read_text().strip()
    output=args.output.resolve()
    if output.is_relative_to(repo or APP):raise SystemExit('Choose a destination outside the source checkout.')
    output.parent.mkdir(parents=True,exist_ok=True)
    release=json.loads((APP/'config/release.json').read_text())
    for asset in release['activeEventArt']:
        assert hashlib.sha256((APP/asset['file']).read_bytes()).hexdigest()==asset['sha256'],asset['file']
    shared=APP.parent/'lib/js-yaml.js'
    if args.include_shared and not shared.is_file():raise SystemExit('The complete download requires lib/js-yaml.js.')
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
        for file in sorted(APP.rglob('*')):
            if file.is_file() and not private_dos(file) and not any(p in ['node_modules','__pycache__','.git'] for p in file.relative_to(APP).parts):archive.write(file,'rtk2/'+file.relative_to(APP).as_posix())
        archive.writestr('rtk2/SOURCE-COMMIT.txt',commit+'\n')
        if args.include_shared:
            archive.write(shared,'lib/js-yaml.js')
            archive.writestr('rtk2/DOWNLOAD-README.txt','Unzip both rtk2/ and lib/ into the same folder. Install Python 3, then run rtk2/start-game.bat on Windows or sh rtk2/start-game.sh on macOS/Linux. The game opens at http://localhost:8080/rtk2/. Editable source, artwork, training profiles, reports and tests are included. Node.js is needed only for development and training, not to play.\n')
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        assert not any(private_dos(Path(n)) for n in archive.namelist())
        names=set(archive.namelist())
        assert {'rtk2/index.html','rtk2/mjs/battle.mjs','rtk2/docs/changes.md#record-differences','rtk2/tests/ui-tests.mjs','rtk2/config/scenarios.json','rtk2/start-game.bat','rtk2/tools/serve-game.py'}<=names
        assert all(n.startswith('rtk2/') or args.include_shared and n=='lib/js-yaml.js' for n in names)
        assert ('lib/js-yaml.js' in names)==args.include_shared
        assert not any(n.endswith(('three.module.js','three.core.js','three-core.js')) for n in names)
        if args.include_shared:assert archive.read('lib/js-yaml.js')==shared.read_bytes()
        assert 'rtk2/RELEASE.txt' in names
        assert json.loads(archive.read('rtk2/config/release.json'))['version']==release['version']
        for asset in release['activeEventArt']:
            assert hashlib.sha256(archive.read('rtk2/'+asset['file'])).hexdigest()==asset['sha256']
    print(f'{output}: {output.stat().st_size:,} bytes, {len(names)} files, source {commit}')
if __name__=='__main__':main()
