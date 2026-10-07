"""Recover Summary 2 years-in-service from Scenario.dat officer byte 0x0c."""
import argparse
import json
from pathlib import Path
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('scenario_dat', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
app = root / ('dist' if (root / 'dist').exists() else 'rtk2')
scenarios = json.loads((app / 'scenarios.json').read_text())
data = args.scenario_dat.read_bytes()
assert len(data) >= 6 * 0x33af
for index, scenario in enumerate(scenarios):
    for officer in scenario['officers']:
        years = data[index * 0x33af + 0x16 + officer['id'] * 43 + 12]
        if officer['owner'] != 255:
            officer['serviceSince'] = scenario['year'] - max(1, years) + 1
(app / 'scenarios.json').write_text(json.dumps(scenarios, ensure_ascii=False, separators=(',', ':')))
print('Recovered service records for all six scenarios.')
