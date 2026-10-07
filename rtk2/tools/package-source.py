"""Build a portable source ZIP from the checked, committed game checkout."""
from pathlib import Path
import argparse
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
APP = 'dist' if (ROOT / 'dist').exists() else 'rtk2'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path, help='Destination .zip file')
    args = parser.parse_args()
    if (ROOT / '.git').exists():
        if subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT).strip():
            raise SystemExit('Commit the checked source before packaging.')
        commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    else:
        commit = (ROOT / 'SOURCE-COMMIT.txt').read_text().strip()
    output = args.output.resolve()
    if output.is_relative_to(ROOT):
        raise SystemExit('Choose a destination outside the source checkout.')
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for file in sorted((ROOT / APP).rglob('*')):
            if file.is_file():
                archive.write(file, 'rtk2/' + file.relative_to(ROOT / APP).as_posix())
        for name in ['three.module.js', 'three.core.js', 'js-yaml.js']:
            archive.write(ROOT / APP / name, 'lib/' + name)
        for name in ['README.md', 'ARTWORK.md', 'THREE-LICENSE.txt', 'YAML-LICENSE.txt',
                     'package.json', 'package-lock.json', 'tests.mjs', 'strategy-tests.mjs',
                     'battle-tests.mjs', 'province-tests.mjs', 'expansion-tests.mjs', 'monthly-tests.mjs', 'artwork-tests.mjs', 'ui-tests.mjs']:
            content = (ROOT / name).read_text()
            if name.endswith('.mjs') or name.endswith('.md'):
                content = content.replace('./dist/', './rtk2/').replace('dist/', 'rtk2/')
                content = content.replace('--directory dist', '')
                content = content.replace('Serve `dist` over HTTP(S)', 'Serve the package root over HTTP(S)')
                content = content.replace('Open `http://localhost:8080`.', 'Open `http://localhost:8080/rtk2/`.')
            archive.writestr(name, content)
        for file in sorted((ROOT / 'tools').glob('*.py')):
            archive.write(file, 'tools/' + file.name)
        archive.writestr('SOURCE-COMMIT.txt', commit + '\n')
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None, 'The source ZIP failed verification.'
        assert {'rtk2/index.html', 'rtk2/battle.mjs', 'lib/three.module.js',
                'lib/three.core.js', 'lib/js-yaml.js', 'SOURCE-COMMIT.txt'} <= set(archive.namelist())
    print(f'{output}: {output.stat().st_size:,} bytes, source {commit}')


if __name__ == '__main__':
    main()
