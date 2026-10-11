# V47 original display reference

Reference: supplied English `main.exe`, SHA-256
`25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.
All offsets below refer to the unpacked load image; DS base is `0x2fa60`.

- Governor: `0x13965` reads the province's serving-head pointer at `+2`, adds
  `0x1c` to obtain the officer's name and prints `Governor: %s` with the string
  at DS:`627e`. The remaster's explicitly elected governor remains authoritative;
  the first serving officer is a display fallback only. Officer ID zero is valid.
- Ownership: the native map fill at `0x4fec` obtains the province's ruler,
  converts its pointer to the 0–15 ruler index and reads DS:`0048`. The table
  assigns pattern indices `3,6,10,1,4,5,11,8,0,15,2,14,12,9,13,7`.
- Each colour pattern has six bytes at DS:`3ad0 + index*6`: two rows of three
  bit planes. The graphics routine writes them to planes 0, 2 and 1. The colour
  palette installation at `0x4c0a` uses DS:`3484`.
- The remaster uses the average colour of each 8 × 2 native pattern, rounded
  to the nearest channel value, for solid badge fills and matching borders.
  All 16 averages are distinct. This preserves the original ruler assignment
  while adapting the original patterned fills to solid modern buttons; it is
  not a pixel-identical reproduction of the DOS graphics modes.
- China influence areas, city leaders and the two ownership legend swatches
  use the same palette. Selection/headquarters use outlines and markers rather
  than replacing the faction colour. Unclaimed provinces remain neutral grey.

Run `python3 tools/verify-native-display.py <main.exe> docs/native-display-v47.json`
to reproduce the static witness. No original executable or art is redistributed.

Battle results reuse the existing war chronology, including the original battle
participants captured before succession or execution changes a ruler's name.
Every completed battle is reviewed regardless of player mode or tactical-view
preference. A captured commander's pending decision is displayed honestly;
release, execution or recruitment updates trigger a follow-up review. Review
stamps are presentation state retained in saves. Combat and trained AI rules
are unchanged. Actual browser/handset visual inspection was unavailable.
