"""Package rtk2 exactly as deployed; shared ../lib files are excluded."""
from pathlib import Path
import argparse, subprocess, zipfile
APP=Path(__file__).resolve().parents[1]
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('output',type=Path);args=parser.parse_args()
    repo=next((p for p in [APP,*APP.parents] if (p/'.git').exists()),None)
    if repo:
        if subprocess.check_output(['git','status','--porcelain'],cwd=repo).strip():raise SystemExit('Commit the checked source before packaging.')
        commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
    else:commit=(APP/'SOURCE-COMMIT.txt').read_text().strip()
    output=args.output.resolve()
    if output.is_relative_to(repo or APP):raise SystemExit('Choose a destination outside the source checkout.')
    output.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
        for file in sorted(APP.rglob('*')):
            if file.is_file() and not any(p in ['node_modules','__pycache__','.git'] for p in file.relative_to(APP).parts):archive.write(file,'rtk2/'+file.relative_to(APP).as_posix())
        archive.writestr('rtk2/SOURCE-COMMIT.txt',commit+'\n')
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        names=set(archive.namelist())
        assert {'rtk2/index.html','rtk2/mjs/battle.mjs','rtk2/docs/differences.md','rtk2/tests/ui-tests.mjs','rtk2/config/scenarios.json','rtk2/start-game.bat','rtk2/tools/serve-game.py'}<=names
        assert all(n.startswith('rtk2/') for n in names)
        assert not any(n.endswith(('three.module.js','three.core.js','three-core.js','js-yaml.js')) for n in names)
    print(f'{output}: {output.stat().st_size:,} bytes, {len(names)} files, source {commit}')
if __name__=='__main__':main()
