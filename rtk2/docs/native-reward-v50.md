# Native Reward audit — v50

The supplied English `main.exe` permits a provincial governor to reward themselves. **Only the ruler is excluded from reward recipients.** A ruler does not have to travel to a governor's province for that governor to receive Gold, Horse or Writings.

This is established by executing the original reward entry, rather than assuming that the first officer in a province is always excluded.

| Rule | Native evidence | Remaster status |
|---|---|---|
| Ruler cannot be rewarded | Reward entry `0x18DD0` requests flags 5 at `0x18DF2`; builder `0x5D52` skips the first officer only if that officer is the ruler | Matches |
| Governor can reward themselves | In a province whose governor is not the ruler, the builder includes the governor; the full Gold, Horse and Writings paths apply the reward successfully with the ruler absent | Matches; retained |
| Reward spends the governor's monthly action | Entry checks the province's first serving officer; Gold, Horse and Writings call action helper `0x60D0` on that governor | Matches |
| Recipient need not have an unused monthly action | Reward list flags contain no available-officer filter; acted/recovering recipients remain in the native list | Matches |
| Writings use a present adviser and at least a two-point INT difference | `0x18A56` compares adviser INT with recipient INT + 1; increments recipient INT only if adviser is greater | Matches |
| Horse reward has the loyalty value of 100 gold | `0x1071E` changes amount zero to 100; Horse consumes one province horse | Matches |
| Horse reward grants personal mounted mobility | The inspected reward path only changes loyalty, province horse stock and governor action; it does not set a personal mount flag | Removed misleading advice. No new mount is granted by Reward Horse |
| Native AI reward gain | `0x1FCDD–0x1FCF0` adds another random bonus of **1 through difficulty**, after the ordinary gain | **Remaining difference:** remaster AI currently uses the human reward gain. Not changed in v50 |

Human Gold/Horse gain is `floor(governor CHA × reward value / 400) + random(0,1)`, capped at loyalty 100. Native AI adds a second bonus of `random(0,difficulty-1) + 1`. The original difficulty menu accepts 1–3 (`0x0C097–0x0C0B6`). The bounded AI witnesses cover all possible second-bonus values at each difficulty and both Gold/Horse paths.

The native AI recipient routine (`0x1FC0E`) also starts at the governor, skipping that officer only when the officer is the ruler. Native AI self reward is therefore allowed too.

The remaster deliberately prevents spending rewards on loyalty-100 recipients and prevents ineffective Writings. The native recipient list includes those officers, but the gain helper returns zero at loyalty 100. Exact native confirmation behaviour for zero-gain options is not asserted by this audit.

## Verification

`tools/verify-native-reward-v50.py` verifies the packed input SHA-256, unpacks it and runs the unchanged native instruction paths with Unicorn. Officer menu choices, confirmations, presentation and random draws are bounded hooks; they do not alter gold, horses, loyalty, INT, or action flags. The native list builder, governor eligibility check, gain arithmetic, stock deductions and action-mark helper run unmodified. The AI opportunity test is controlled to select a reward; recipient selection and gain run unmodified.

Result: **5 byte checks, 6 recipient-list cases, 6 complete human reward cases and 12 complete AI reward cases**. Output is in `native-reward-v50.json`.

`tests/v50-governance-tests.mjs` adds **6 remaster regression groups** covering self reward, absence of the ruler, all three reward kinds, monthly action limits, acted/recovering recipients, unavailable governors, ruler exclusion, atomic rejected orders, and the absence of invented personal horse equipment.

These are bounded executable witnesses, not a complete DOS gameplay session. They do not establish that every governance or AI rule matches the original.
