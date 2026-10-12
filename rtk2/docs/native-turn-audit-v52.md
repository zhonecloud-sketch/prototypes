# Native simultaneous and daily orders audit

Verified against supplied English `main.exe` SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.

32 bounded witnesses pass. The project includes `tools/verify-native-turn-v52.py` and `docs/native-turn-witness-v52.json`. With Python Unicorn installed, reproduce using your private executable:

```sh
python tools/verify-native-turn-v52.py /private/main.exe /tmp/native-turn-witness-v52.json
```

No original executable is included in the project.

## Findings

1. The native simultaneous handler accepts all adjacent friendly helpers regardless of whether the helper cell bit 128 is set. It passes ZERO as the filter argument at `0x260B4`. The adjacency/ownership predicate `0x249DC` checks bit 128 only when its fourth argument is nonzero (`0x24A3A`–`0x24A5C`). Eight full-handler witnesses with helper flags 1/129 and enemy flags 4/132/20/148 retain original geometry, ownership, unit lookup and eligibility. Every case performs two combat exchanges with factor 2 and two animation calls.
2. The original human controller `0x226A0` activates each linked officer once. It saves the next unit at `0x226C7`–`0x226C9`, performs native mobility activation `0x24A6E`, and advances to that saved next unit when the initiating command-completed byte `DS:B8E2` is set (`0x22730`–`0x22746`). Neither the helper nor the opposing target is removed from that sequence by simultaneous cell-flag clearing. Six controller witnesses cover cell flags 1/129/4/132/20/148 and activate both linked units; sixteen additional witnesses preserve actual simultaneous-result DS memory and then prove each helper or target receives its subsequent own activation.
3. The ambush routine clears cell bit 128 at `0x2484F`, but this does not spend the ambusher's later own daily order. Two witnesses execute native ambush for mover INT89 and INT90, preserve the resulting DS memory, then execute the original human controller. Both activate the ambusher normally. Their mobility is unchanged by the ambush.
4. Cell bit 128 cannot be interpreted as a permanent daily-order record. The native jungle drawing branch `0x244B5` ORs `0x90` into the cell and normal combat/ambush clear bit128. The native daily own-order controller is a separate linked-list mechanism driven by initiating command completion; the prior v50 report projected this presentation/concealment flag into `ordered` and `orderDay`, which created skipped turns.

## Corrections proposed

- `jointAttackers`: include every living, placed friendly unit adjacent to target, including units that already moved, waited or completed another own order.
- The simultaneous initiator spends their own daily order through the existing finalization path. Helpers retain whatever own `ordered/orderDay` state they had before assistance. They can help more than once if later simultaneous orders reach their tile.
- Remove `friend.ordered=true;friend.orderDay=b.day` from simultaneous exchanges; keep ordinary attack initiator finalization.
- Remove `target.ordered=true;target.orderDay=b.day` from simultaneous completion.
- Remove `hidden.ordered=true;hidden.orderDay=b.day` from automatic ambush. Preserve casualty, reveal, event and animation behavior.
- Update error/advice text from "two ready friendly units" to "two adjacent friendly units" while retaining the requirement that the initiating unit still has its own order available.
- Replace old tests/docs asserting target/helper/ambusher own-order consumption; add regression coverage for prior Move/Wait helpers, helper-before-own-order, opposing commander attacked before their army turn, automatic ambush before own army turn, and both first-side orderings across day advancement.

## Limits

These are bounded original-code witnesses, not a full DOS playthrough. Rendering, input and arithmetic/outcome hooks keep execution finite. Full simultaneous witnesses retain native participation decisions; human-controller witnesses retain native activation and linked-list order. The exact semantic name of cell bit128 is intentionally not asserted beyond verified concealment/rendering usage and independence from the own-order controller.
