"""Run isolated forward versus side/rear jungle witnesses in main.exe.

Usage: python tools/verify-native-charge-surroundings.py MAIN.EXE OUTPUT.json
Expected: 48 isolated witnesses pass, in addition to the baseline harness.
Reuses its verified unpacker and bounded native charge-controller runner.
"""
import argparse
import json
import runpy
import sys
import tempfile
from pathlib import Path

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('main_exe', type=Path)
p.add_argument('output', type=Path)
a = p.parse_args()
prior = sys.argv
try:
    with tempfile.TemporaryDirectory(prefix='attk-native-surroundings-',
                                     dir=a.output.parent.resolve()) as tmp:
        script = Path(__file__).with_name('verify-native-charge-arrival-v56.py')
        sys.argv = [str(script), str(a.main_exe), str(Path(tmp) / 'baseline.json')]
        base = runpy.run_path(str(script))
finally:
    sys.argv = prior
run, arena, adjacent, DS = [base[k] for k in ['run', 'arena', 'adjacent', 'DS']]
zero = lambda *args: 0
rows = []
for branch in ['occupation', 'breakthrough']:
    for q in [6, 7]:
        for d in range(6):
            origin = (q, 5)
            target = adjacent(origin, d)
            dest = target if branch == 'occupation' else adjacent(target, d)
            forward = [adjacent(dest, n) for n in
                       base['IMAGE'][DS + 0xb5fe + d * 3:DS + 0xb5fe + d * 3 + 3]]
            around = [adjacent(dest, n) for n in range(6)
                      if adjacent(dest, n) not in [origin, target]]
            for layout in ['forward-pair', 'side-rear-pair']:
                jungles = [cell for cell in around
                           if (cell in forward) == (layout == 'forward-pair')][:2]
                assert len(jungles) == 2

                def setup(u, w):
                    arena(u, w)
                    u.mem_write(DS + 0x9000, bytes(0x300))
                    u.mem_write(DS + 0xba6c, bytes(156))
                    u.mem_write(DS + 0xb9d0, bytes(156))
                    w(0xcb76, 'H', 0x9000)
                    w(0xcb8a, 'H', 0x9100)
                    w(0xb8df, 'BB', *origin)
                    w(0xb8e6, 'H', 0x9000)
                    w(0xb8d5, 'B', 255)
                    units = [(0x9000, origin, 129), (0x9100, target, 132),
                             (0x9200, jungles[0], 148), (0x9220, jungles[1], 148)]
                    for ptr, cell, flags in units:
                        w(ptr + 4, 'BB', 80, 100)
                        w(ptr + 0x12, 'HHBBB', 5000, 5000, 80, 7,
                          (cell[0] << 4) | cell[1])
                        w(0xba6c + cell[1] * 13 + cell[0], 'B', flags)
                    w(0x9100, 'H', 0x9200)
                    w(0x9200, 'H', 0x9220)
                    for cell in jungles:
                        w(0xb9d0 + cell[1] * 13 + cell[0], 'B', 1)

                def exchange(u, w, word, byte, sp, seen):
                    if branch == 'occupation':
                        w(0x9112, 'H', 0)
                        w(0xba6c + target[1] * 13 + target[0], 'B', 0)
                        w(0xcb8a, 'H', 0x9200)
                        return 0
                    return 255

                def ambushed(u, w, word, byte, sp, seen):
                    seen.append([word(sp + 8) & 255, word(sp + 10) & 255])
                    return 0

                hooks = {at: zero for at in [0x4b38, 0x57ba, 0x581e, 0x24648,
                                           0x24466, 0x250f8, 0x2603e]}
                hooks.update({0x24c58: exchange, 0x589c: lambda *args: 1,
                              0x247c6: ambushed})
                u, seen, word, byte = run(0x26318, 0x258b,
                                         [0x9100, *target, d + 1], setup, hooks)
                landing = [byte(0x9018) >> 4, byte(0x9018) & 15]
                expected = [list(cell) for cell in jungles] if layout == 'forward-pair' else []
                assert landing == list(dest), (branch, layout, landing, dest)
                assert sorted(seen) == sorted(expected), (branch, d, layout, seen)
                rows.append(dict(branch=branch, layout=layout, start=origin,
                                 target=target, landing=landing, jungles=jungles,
                                 nativeDirection=d, nativeAmbushes=seen, pass_=True))
a.output.write_text(json.dumps(dict(originalSHA256=base['EXPECTED'], cases=rows,
    limits='Native full charge relocation, occupancy, jungle/hostile eligibility '
           'and three-entry scan at 24938 execute. Rendering, RNG and casualty '
           'bodies are controlled; this does not establish physical DOS timing.'),
    indent=2) + '\n', encoding='utf-8')
print(len(rows), 'isolated native surrounding-jungle witnesses passed')
