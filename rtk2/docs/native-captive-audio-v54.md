# Native ruler-captive eligibility, service change and menu audio — v54

49 bounded witnesses PASS. Reproduction requires Python Unicorn and privately supplied original English main.exe; the script has no repository imports and unpacks the SHA-256-verified image in memory. No DOS executable bytes are exported.

```
PYTHONPATH=/path/to/unicorn python tools/verify-native-captive-audio-v54.py /private/main.exe native-captive-audio-v54.json
```

## Human captured rulers

Original human handler0xA212 prints DS:46A9 `1.Set free 2.Behead` and asks input range1..2. Twelve witnesses execute it with remaining province counts0/1/2 and captive realm hostility toward captor0/50/80/100. The menu is unchanged. Native owner lookup0x5280, owner-ID0x5256 and human-controller eligibility0xA0CC execute unchanged.

Two further witnesses retain full captive-list controller0xA2DE and native ruler detection0x55F8. Even when the former ruler owns zero provinces, this controller defers that ruler separately and calls the same two-choice menu. The special handler checks former realm state flag7&0x80 before prompting; that flag can force terminal handling, but it is not a province-count or hostility test. No native last-province Recruit menu was recovered.

The complete battle result entry0x8B82 calls captive-list controller0xA2DE at0x8BA9, then ruler-return handler0x9D50 at0x8BB4. Native ruler-release0x9FC6 chooses another eligible home via0x9F3E/0x9E9A; no home can send the ruler into exile via0x9F84. This release path retains their ruler identity, sets exile flag4 and clears prior territorial links; it does not recruit them into the captor faction. Full cross-war exile/faction cleanup is not dynamically witnessed in this bounded task.

The user's clarified instruction is native conformance. Therefore the remaster keeps Set free/Behead for captured rulers at zero/one/two provinces. No last-province ruler Recruit extension, ruler recruitment formula or hostility cutoff is introduced.

## Ordinary captured officers

After the human chooses Recruit, controller0xA2DE calls0xA0F8. It unconditionally sets service owner to the winning ruler, invokes service initializer0x5BFE and places the officer in the resolved winner province through0x5F9E. There is no acceptance roll, hostility read or shared-blood/loyalty100 protection gate on this captured-officer path. Three witnesses with former hostility0/80/100 all take the identical service-change path. Ownership-byte and old advisor removal remain native; service initialization and province linked-list changes are recorded boundary calls in those cases.

Twelve additional witnesses execute the actual native0x5BFE initialization and arithmetic. For an ordinary officer who is not a covert officer returning to their original patron:

```
new loyalty = 100
  - isqrt(abs(officer compatibility - new ruler leader compatibility)
          * floor(old loyalty / 2))
  - integer random 0..4
```

The old allegiance becomes the new ruler, service count becomes1, covert flag fields are cleared and an old advisor reference is removed. Only jitter RNG is controlled in these twelve cases; owner lookup, compatibility difference, integer square root and writes execute unchanged. Loyalty assignment is not an acceptance chance.

Governance recruiting an enemy officer has different protection predicates at0x12EA8, but those do not apply to this native human captive Recruit handler.

## AI ruler-release chance must not become recruitment chance

0xA196 computes:

```
release probability = floor((captive ruler CHA + 100
                             - captive realm hostility toward winner) / 2)
```

It tests that percentage, then also requires year<200. On success0xA212 calls release/home/exile handler0x9FC6. On failure it returns terminal handling to the controller. Seven witnesses distinguish this from recruitment, including CHA80 and hostility100 still yielding40% release probability, and CHA100/hostility100 yielding50%. There is no hard high-hostility cutoff in this release arithmetic.

This equation concerns release versus terminal handling by AI, not acceptance of recruitment. It must not be ported as ruler recruitment.

## Ordinary governance selection is silent

The actual own-key controller0x468A emits no original effect for ordinary1/2/Esc selection. Three witnesses retain it while bounding BIOS input and cursor rendering. Four additional witnesses retain actual numeric menu0x4888→0x47D2→0x4732→0x468A, including invalid4 then valid1 retry. They return valid selections without effect dispatch. Optional callback3530 is null, as in governance; that callback is a screen updater, not a key sound.

Use silence for ordinary governance buttons, selectors and order-menu selections. Do not treat effect10 as a generic keypress or opening cue.

### IDs10 and14 are result notifications

Two dispatcher witnesses prove explicit helper0x58E6 invokes effect10 and0x591E invokes14. Four further cases execute actual Recruit result routine0x162CE with positive/zero success and ruler/nonruler envoys:

- Success prints DS:7106 `Success!` and7110/712A joined-followers text, then calls0x591E→14.
- Refusal prints7144/715E does-not-care-to-join text, then calls0x58E6→10.

Generic native errors0x1309C — Not home province, No one can do that now, Not enough gold — likewise use0x58E6→10. Labels “input/wait opening” and “input/wait completion” in the old audio catalogue were misleading; these are separate explicit report cues, not sounds emitted by ordinary keyboard selection. Native cues can accompany specific successful/negative report contexts; this evidence does not justify adding them to every order indiscriminately.

## Hook and consequence limits

Every JSON case includes its own suppressed paths. Human captive menu cases bound portrait/text, select Free, record native effect7 and suppress release settlement9FC6 after proving its invocation. Full-list cases additionally suppress original governance music. Ordinary service-boundary cases record service/placement calls rather than mutating native province lists; actual service initializer cases independently execute those eligibility-independent owner/loyalty writes. AI-release cases control percentage roll. Input witnesses hook BIOS key/poll and cursor rendering; numeric range, retries and parser remain native. Result-audio cases record text arguments and effect dispatch while suppressing final timed message rendering.

Integration regressions should separately assert requested remaster last-province recruitment eligibility, hostile refusal, nonmutation on refusal, accepted-ruler demotion and former-faction retirement, removal of marriages/alliances/pending orders, save/load and human/spectator lifecycle. Native witnesses do not establish those newly added extension consequences.
