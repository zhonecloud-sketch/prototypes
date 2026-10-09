# Compulsory field retreat — v34

Primary evidence is the supplied English main.exe, SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are unpacked load-image offsets. No native executable is included in the pack.

The loop at `0x2CFBE` traverses the defeated linked list. `0x2CFF2` calls `0x25810` to build legal adjacent unoccupied/same-owner provinces. Its no-destination branch at `0x2D0AE` calls the capture helper `0x25350`. The human branch prompts each officer for a province at `0x2D026–0x2D086`; the automatic branch at `0x2D08A` calls `0x2574C`. Both join at `0x2D09A` and call `0x25670` through `0x2D0A4`.

`0x25670` calls `0x25566`, so compulsory escape uses the same recovered horse flag, WAR, training, restored mobility, men, adjacent-hostile count, ruler/Lu Bu bonuses and random draws as voluntary Flee. It is not the former `90 − (INT + WAR)/3` capture equation. No legal exit means capture even with a horse. The V33 arithmetic vectors still apply unchanged.

`0x2574C` identifies the original province through `0x234D6`, searches for it or a same-owner destination first, then selects an unoccupied choice randomly if necessary. Destination order in the remaster uses the province's original neighbour list. Human decisions are validated before rolling; dispositions remain on units until final settlement and cannot be repeated or rerolled on save/load.

Implementation: `mjs/battle-withdrawal.mjs` owns the defeated-field workflow; `battle.mjs` supplies legal destinations and native flight; `strategy.mjs` retains the result and exposes pending human decisions; `app.mjs` presents a separate choice for each human-controlled survivor and plays status/result messages before governance. Headless tactical simulations choose automatically. Unwatched abstract wars retain their separate documented abstraction.

An integration test found governor rebellion recycling an exiled ruler's ID. Active roaming and captive rulers now reserve their slots, keeping saves valid without changing advisor logic.

Limitations: this ports the **defeated field-unit** workflow. Provincial non-field reserves still use the documented capture approximation. Native secret-pact branches, complete transfer/spoils bookkeeping and exact original presentation timing remain unreconstructed. The broader governance and tactical audit in differences.md still applies.

Verification: [118 frozen binary checks](original-v34-checks.json), the existing 812 controlled native cases, five compulsory-retreat integration checks and all 333 regression checks pass. The raster interface suite exercises the real result → individual destinations → escape messages → final result → governance sequence, including checkpoint restoration.
