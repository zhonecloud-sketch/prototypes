"""Verify all 41 original terrain/zone maps against the committed deployment audit."""
from pathlib import Path
import argparse, hashlib, json

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('hexdata', type=Path)
args = parser.parse_args()
app = Path(__file__).resolve().parents[1]
data = args.hexdata.read_bytes()
audit = json.loads((app / 'docs/deployment-v32.json').read_text())
assert hashlib.sha256(data).hexdigest() == audit['resourceSha256'], 'Different resource edition or bytes'
terrain = json.loads((app / 'config/province-terrain.json').read_text())
provinces = json.loads((app / 'config/scenarios.json').read_text())[0]['provinces']
assert len(terrain) == len(provinces) == 41
expected = {}
for p in provinces:
    start = (p['id'] - 1) * 156
    assert list(data[start:start + 156]) == terrain[p['id'] - 1], p['id']
    zones = data[41 * 156 + start:41 * 156 + start + 156]
    assert sum(z == p['id'] for z in zones) == 20, p['id']
    for source in p['neighbors']:
        cells = [[i % 13, i // 13] for i, zone in enumerate(zones) if zone == source]
        assert len(cells) == 5, (p['id'], source)
        assert all(terrain[p['id'] - 1][r * 13 + q] not in [3, 9, 99] for q, r in cells)
        expected[(p['id'], source)] = cells
actual = {(a['target'], a['source']): a['slots'] for a in audit['approaches']}
assert expected == actual and len(actual) == 186
print('41 terrain/defender-zone maps and 186 five-cell attacker approaches match original Hexdata.dat.')
