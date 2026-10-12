**Current v52 correction:** [v52 findings](fixes-v52.html) restore remaster music and supersede earlier claims that simultaneous helpers/targets or automatic ambushers spend their own daily orders. The original cell flags are independent of the native own-order controller.

# RTK2 Remastered v50 — native rules, audio and War controls

Released 12 October 2026 (Asia/Kuala_Lumpur). Existing artwork, campaign features, portrait choices and earlier fixes are retained.

| Request | Result |
|---|---|
| War governor choice | The replacement governor is selected from real officer portrait cards. The empty “Choose a governor” placeholder is a prompt, not a button. March remains unavailable until a required replacement is chosen. |
| Redundant order buttons | Audited the shared choice-card builder and staged order flows. Empty placeholders no longer generate selectable cards. Break alliance appears only for an allied invasion target. Existing Back, Cancel and final confirmations retain their distinct purposes. This is not a claim that every possible UI sequence was visually inspected. |
| Governance audio | Human orders and spectator AI council reports use order-specific cues. Monthly and historical events use the recovered native event mappings where established. Council music uses the original regional songs rendered through the supplied FM driver. |
| Battlefield audio | Resolved human and AI actions share one observer. Combat audio follows animation cycles and separate ambushes. Charge sounds once per actual exchange; inspection and deployment do not replay an old combat cue. Native regional battlefield and victory/defeat tracks replace the earlier remaster themes; independent sound/music preferences remain available. |
| Every original effect | All 16 dispatch entries, their native sequences/patches, known callers, and the music selector's 21 accepted IDs are catalogued. The supplied FM driver renders all 21 embedded songs and all 16 effect patches. All 37 MP3s pass decoding, non-silence and complete-duration checks. Effect 15's gameplay caller, exact full FM loop endpoints and original-hardware waveform equality remain unresolved; see the driver-backed report. |
| Simultaneous losses | The report includes the initiating unit, every supporting unit and the defending target. Playback gives each participant a separate readable loss message; the saved battle record retains the complete result. |
| Ambush animation | Each resolved ambush records both ambusher and victim. They receive separate eight-flash sequences, without applying additional casualties or randomness. The ambusher's daily order is spent, with mobility unchanged, including when the victim anticipates the ambush. |
| Jungle simultaneous attack | The original full handler permits jungle targets, including concealed ones. The mistaken restriction is removed. Select a suspected adjacent jungle hex with two ready friendly units; attacks at vacated positions miss. All participants’ loss reports and animations are retained. |
| Retreat | Native local withdrawal checks precede ordinary AI attack/palace choices: very small forces and locally overwhelmed units may flee. A commander's flight uses the existing whole-army withdrawal and capture resolver. Fire escape/stranded-fire behavior is included where witnessed. Hidden jungle positions are excluded from AI threat counts. |
| Governor self reward | The premise does not match the supplied executable. Its full Reward command permits a provincial governor to reward themselves using Gold, Horse or Writings, without the ruler present. The governor spends their monthly action. Only the ruler is excluded as a recipient. Existing matching behaviour is retained. |
| Horse reward advice | Removed the incorrect claim that a reward horse grants personal mounted mobility. It consumes province horse stock and raises loyalty. |

## Additional defects found and corrected

The complete native simultaneous handler accepts jungle targets with two adjacent attackers. The resumed release restores that feature after clarification: the earlier prohibition was a misunderstanding. Hidden movement remains concealed, so a suspected hex can be empty.

Normal attacks previously used five animation cycles; the native shared renderer repeats eight alternating flashes. Simultaneous attacks now flash each actual attacker/target pair in sequence, and Charge repeats eight flashes per actual resolved exchange (1–10), maintaining the existing march, overlap, landing and return presentation. Browser timing is a remaster choice; it is not an emulated DOS frame clock.

Simultaneous supporting officers spend an order only when they actually strike; unused helpers retain readiness when the target is defeated early. A target surviving the completed native simultaneous sequence also loses readiness. These rules are recorded in the native combat witness report.

The newly exercised retreat paths exposed a deferred-settlement checkpoint edge case. Retreat reservations must be checked against the correct active or suspended war, and retained until settlement. Details and regression coverage are in the combat note.

## Remaining known differences and verification limits

- Native AI receives an additional Gold/Horse loyalty bonus of 1 through difficulty, beyond the ordinary human reward gain. The remaster still uses the human gain. This evidenced difference is documented rather than changing AI economics in this release.
- Native deployment uses priorities different from the remaster’s closest-palace policy (see native-turns-v43.md). The full native strategic whole-army withdrawal flags, path field and all tactics have not been reconstructed. The tested local retreat rules do not establish complete native AI parity.
- Native AI can inspect adjacent concealed jungle occupancy. The remaster deliberately retains the v49 human/AI visibility rule, so hidden movement cannot influence route planning or retreat threat counts.
- Abstract battles and expanded family options remain documented remaster systems. Governance conquest training keeps detailed battlefield orders disabled.
- The supplied executable witnesses run bounded unchanged instruction paths with controlled presentation/random hooks; they are not complete DOS gameplay sessions.
- Interface checks use an emulated DOM and native Canvas. Physical browser/handset rendering and audible comparison remain unverified.

## Archived training examples — no automatic renewal

No AI training was run during this resumed update. Training requires an explicit user instruction, even when game rules change. Existing v50 examples below were produced before this instruction and retain their original rules identity. They are now incompatible; imports are rejected and saved campaigns safely fall back to Legacy. The previous v50 compatibility runs were intentionally small. Governance holdout score difference was +0.105 on two cases. Battlefield had four draws across two independent positions, with no decisive win. The backward conquest run completed none of three cases within one month; it averaged 20 provinces versus Legacy’s 21.7. Its report records zero detailed battlefield actions. These results do not establish stronger AI or faster full conquest. Legacy remains default.

- [Governance profile](../config/ai-profiles/governance-v50.json) · [report](ai-training-v50-governance.json)
- [Battlefield profile](../config/ai-profiles/battlefield-v50.json) · [report](ai-training-v50-battlefield.json)
- [Backward conquest profile](../config/ai-profiles/governance-conquest-v50.json) · [report](ai-training-v50-conquest.json)

## Evidence and repeatable checks

The resumed full engine suite passed 465 groups before final native-media integration. Eight final audio groups passed after that integration. Final presentation checks passed 4 groups, followed by 70 mounted interface checks and 7 layout checks. Native verification passed 72 audio checks, 29 Reward checks/cases and 60 bounded combat witnesses. All 37 driver-rendered MP3 files decoded, contained sound and matched captured duration within 30 ms.

- [Driver-backed audio extraction](native-opl-driver-v50.json) · [derived FM register traces](native-opl-register-traces-v50.zip)
- [Native audio catalogue](native-audio-v50.md) · [machine-readable audio witnesses](native-audio-v50.json)
- [Native Reward evidence](native-reward-v50.md) · [Reward witnesses](native-reward-v50.json)
- [Native combat evidence](native-combat-v50.md) · [combat witnesses](native-combat-v50.json)
- [Verification results](verification-v50.json)
- [Training manual](ai-training-manual.html)

Run `npm test` and `npm run test:ui` from the project's `rtk2` directory. The native verification tools require the user's supplied original `main.exe` and Python Unicorn. Existing examples from v49 remain archived and will safely fall back to Legacy under the changed fingerprint; v50 examples also retain their earlier fingerprint and are incompatible with this corrected release. Request a new training run explicitly when desired. Small compatibility-training reports do not establish stronger AI or lightning-speed full conquest.
