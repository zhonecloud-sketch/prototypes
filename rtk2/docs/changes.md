# RTK2 Remastered — unified changes

This is the single development history through v56, consolidated from all 44 versioned Markdown/HTML reports and the differences audit available in this checkout. Earlier releases without a separate surviving report are covered only where the original audit records them; missing v1–v8 release notes have not been invented.

## Current v56 behavior and maintenance

The v56 findings below supersede conflicting earlier accounts, particularly captive recruitment, own-order versus simultaneous-assistance flags, concealed targeting, charge-arrival ambush cells, and audio routing. Historical training reports describe past experiments: this maintenance does not train, modify or replace any AI profile. Remaster council, battlefield and triumph BGM remain active. Normal/Simultaneous use the supplied sword clip, Charge the supplied cry, and moving messengers the supplied gallop. See [the current sound matrix](native_sound.md) and [test specification](test_spec.md).

Artwork, sound effects and music now live in `assets/artwork/`, `assets/sounds/` and `assets/music/`. Superseded working exports and inactive replacements are retired; assets required by retained regression tests remain. [The cleanup manifest](asset-manifest.json) records original Git blob identities, relocated files and reasons. Deleting files reduces the current checkout; old Git history remains recoverable and is not rewritten.

Only the history-art asset path changes a module covered by the existing engine fingerprint; its fingerprint was refreshed without training. The nine saved production profile files retain their bytes and original identities. As before, profiles whose original engine ID is incompatible fall back to Legacy rather than being silently relabeled.

Machine-readable native witnesses, register traces, artwork prompts, licence evidence and training measurements remain in their existing paths because they are test/provenance inputs, not duplicate release prose. No claim is made that the current native-derived edition is cleared for commercial sale; the v56 rights assessment is retained in full below.

## Record index

| Original report | Consolidated section |
| --- | --- |
| `docs/commercial-rights-audit-v56.md` | [commercial-rights-audit-v56.md](#record-commercial-rights-audit-v56) |
| `docs/fixes-v56.html` | [fixes-v56.html](#record-fixes-v56) |
| `docs/native-charge-arrival-v56.md` | [native-charge-arrival-v56.md](#record-native-charge-arrival-v56) |
| `docs/native-concealed-v56.md` | [native-concealed-v56.md](#record-native-concealed-v56) |
| `docs/native-settlement-v56.md` | [native-settlement-v56.md](#record-native-settlement-v56) |
| `docs/audio-licenses-v55.md` | [audio-licenses-v55.md](#record-audio-licenses-v55) |
| `docs/fixes-v55.html` | [fixes-v55.html](#record-fixes-v55) |
| `docs/fixes-v54.html` | [fixes-v54.html](#record-fixes-v54) |
| `docs/native-ai-joint-findings-v54.md` | [native-ai-joint-findings-v54.md](#record-native-ai-joint-findings-v54) |
| `docs/native-captive-audio-v54.md` | [native-captive-audio-v54.md](#record-native-captive-audio-v54) |
| `docs/native-joint-findings-v54.md` | [native-joint-findings-v54.md](#record-native-joint-findings-v54) |
| `docs/fixes-v53.html` | [fixes-v53.html](#record-fixes-v53) |
| `docs/messenger-native-v53-report.md` | [messenger-native-v53-report.md](#record-messenger-native-v53-report) |
| `docs/native-battle-audit-v53.md` | [native-battle-audit-v53.md](#record-native-battle-audit-v53) |
| `docs/fixes-v52.html` | [fixes-v52.html](#record-fixes-v52-html) |
| `docs/fixes-v52.md` | [fixes-v52.md](#record-fixes-v52) |
| `docs/native-turn-audit-v52.md` | [native-turn-audit-v52.md](#record-native-turn-audit-v52) |
| `docs/fixes-v50.html` | [fixes-v50.html](#record-fixes-v50-html) |
| `docs/fixes-v50.md` | [fixes-v50.md](#record-fixes-v50) |
| `docs/native-audio-v50.md` | [native-audio-v50.md](#record-native-audio-v50) |
| `docs/native-combat-v50.md` | [native-combat-v50.md](#record-native-combat-v50) |
| `docs/native-reward-v50.md` | [native-reward-v50.md](#record-native-reward-v50) |
| `docs/fixes-v49.html` | [fixes-v49.html](#record-fixes-v49-html) |
| `docs/fixes-v49.md` | [fixes-v49.md](#record-fixes-v49) |
| `docs/battle-presentation-v48.md` | [battle-presentation-v48.md](#record-battle-presentation-v48) |
| `docs/native-display-v47.md` | [native-display-v47.md](#record-native-display-v47) |
| `docs/ai-training-v45-results.html` | [ai-training-v45-results.html](#record-ai-training-v45-results-html) |
| `docs/ai-training-v45-results.md` | [ai-training-v45-results.md](#record-ai-training-v45-results) |
| `docs/ai-training-v44-results.html` | [ai-training-v44-results.html](#record-ai-training-v44-results-html) |
| `docs/ai-training-v44-results.md` | [ai-training-v44-results.md](#record-ai-training-v44-results) |
| `docs/native-turns-v43.md` | [native-turns-v43.md](#record-native-turns-v43) |
| `docs/native-fire-v42.md` | [native-fire-v42.md](#record-native-fire-v42) |
| `docs/artwork-v36.md` | [artwork-v36.md](#record-artwork-v36) |
| `docs/compulsory-retreat-v34.md` | [compulsory-retreat-v34.md](#record-compulsory-retreat-v34) |
| `docs/ai-ambush-proposal-v33.md` | [ai-ambush-proposal-v33.md](#record-ai-ambush-proposal-v33) |
| `docs/native-battle-v33.md` | [native-battle-v33.md](#record-native-battle-v33) |
| `docs/battle-equations-v32.md` | [battle-equations-v32.md](#record-battle-equations-v32) |
| `docs/artwork-v31.md` | [artwork-v31.md](#record-artwork-v31) |
| `docs/artwork-v30.md` | [artwork-v30.md](#record-artwork-v30) |
| `docs/artwork-v29.md` | [artwork-v29.md](#record-artwork-v29) |
| `docs/artwork-v28.md` | [artwork-v28.md](#record-artwork-v28) |
| `docs/artwork-v23.md` | [artwork-v23.md](#record-artwork-v23) |
| `docs/artwork/historic-portraits-v16.md` | [artwork/historic-portraits-v16.md](#record-artwork-historic-portraits-v16) |
| `docs/differences.md` | [differences.md](#record-differences) |


<a id="record-commercial-rights-audit-v56"></a>
## commercial-rights-audit-v56.md

Historical record from [`docs/commercial-rights-audit-v56.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/commercial-rights-audit-v56.md), original Git blob `06dd901ab20c0e10c519857d0a488ccc1a9c38e1`. Later records take precedence where findings changed.

### Commercial rights audit — RTK2 Remastered

Checked 12 October 2026. Read-only audit of v55 checkout `67c3f1191e625036c893be7d2c3d2421fa69285d`. This is a practical risk assessment, not a rights clearance or court determination. No content was replaced or deleted by this audit.

#### Answer

**Do not treat the current build as cleared for sale.** Without a licence from the relevant rights holders, selling or publicly distributing this build would very likely infringe rights in at least its directly recovered Koei audio. There are additional material data, source and branding issues. Hosting an unpackaged browser game does not remove copying/communication rights; charging money is not the only way infringement can occur.

Koei's published video/image rules permit a defined class of personal gameplay uploads, with limited video-platform advertising monetisation. They do **not** grant a licence to create, distribute or sell a replacement game. Koei publishes a licensing-business contact route; that is a possible route for an authorised remaster, not evidence that permission has been granted. [K1, K2]

Buying an original copy, owning the supplied files, calling the project unofficial, changing its title, using AI-created portraits, or excluding `main.exe` does not confer rights to distribute extracted/adapted content. There is no reliable percentage of changed content that clears the remainder. A faithful remaster and an independently authored Three Kingdoms strategy game are different commercial paths.

#### Concrete file groups and actions

Paths below are relative to the app root unless stated otherwise. Suggested replacement is for a separate commercial edition; it is **not** an instruction to silently discard the user's currently requested native-faithful build.

| File group | Verified provenance / current issue | Commercial action without Koei permission |
|---|---|---|
| `assets/music/native-music-0.mp3` through `native-music-20.mp3`; `assets/sounds/native-effect-0.mp3` through `native-effect-15.mp3` | All 21 music files and 16 effects exist. `mjs/audio.mjs` and `tools/extract-native-opl-v50.py` explicitly identify rendering from the original `main.exe` data through the supplied OPLDRV. Some effects still play; music is archived even though remaster BGM is active. A newly rendered performance does not clear the underlying composition. | Remove from the **commercial distribution**, including unused archive copies; replace remaining native effects with independently made or commercially licensed sounds. Remove their export/register-capture data from distributed extras if present. Changing encoding/instrumentation alone is insufficient. |
| `config/scenarios.json`; `mjs/future-officers.mjs`; extracted fields in `mjs/officer-roster.mjs` | Six scenario resource/ownership/officer/diplomacy lists deliberately match native data. `build-fidelity-data.py`/`build-service-records.py` import loyalty/personality/service/arrival data from Scenario/Taiki files. Individual historical names/dates are distinguishable from Koei's authored fictional ability scores, balancing values and selected/arranged scenario database. | Reauthor campaign setups, ratings, resources, arrival schedules and relationships from independent historical sources/design; retain independently verified historical facts. Do not merely transform the JSON layout or slightly offset every number. Audit roster selection/arrangement rather than asserting each name is proprietary. |
| `config/province-terrain.json`; `config/battlefield-paintings.json`; `assets/artwork/battlefields/province-01-v17.webp` through `province-41-v17.webp` | Docs record **6,396 cells** exactly matching `Hexdata.dat`. Painting manifest embeds those arrays; 41 newly generated paintings were made against those exact layout guides/fort-palace locations. New artwork is not a copied DOS bitmap, but intentionally reproduces authored tactical layouts. | Design new tactical maps, anchors and deployment/approach data independently, then repaint/register against those new layouts. Treat all duplicate terrain arrays in metadata/tests/package extras as part of the audit. Generic jungle/plain/palace concepts need not be removed. |
| Native 41-province topology/93 connections, original numbering and placement records in scenario/engine data | `docs/changes.md#record-differences` confirms native adjacency and province placement parity; not equivalent to independently sourced geographic facts. | Independently derive regions/links/locations from historical geography and game design. Historical place names and accurate geography may remain; original authored map abstraction needs review/replacement. `config/china-map.json` is separately sourced Natural Earth geography and has permissive public-domain terms. |
| `index.html`, `mjs/app.mjs`, outer `dist/index.html`, titles/descriptions, package/README/release/docs and marketing/domain identity | Product is titled **Romance of the Three Kingdoms II**, with “REMASTERED” and RTK2 identity. This suggests an association with Koei's game. No specific trademark registration search was completed. | Use an independently cleared game name/logo/presentation and avoid suggesting an authorised Koei remaster. Keep truthful historical/provenance statements where appropriate; an “unofficial” disclaimer is not a substitute for permission. Trademark/passing-off review is separate from copyright. |
| Runtime rule/AI implementations and tools, including `mjs/battle.mjs`, `mjs/engine.mjs`, `mjs/ai-*.mjs`, `tools/verify-*.py` and comparison docs | Native disassembly/source were used heavily. Upstream `JuQiang/Rotk2_Python` is pinned in the docs; visible upstream root/README shows no declared licence. Current docs already say no new licence is assigned to unlicensed upstream data. This audit did **not** establish which individual JavaScript instructions are source translations. | Trace origins and obtain permission for copied/translated upstream code or independently reimplement from a functional specification. Mere Python-to-JavaScript translation does not clear protected program expression. Document independent authorship. Do not ship original binaries, substantial disassembly/code passages or extractable proprietary media in developer extras. Functional equations/rules may be retained where independently implemented and legally reviewed; not every recovered constant is automatically copyrighted. |
| `assets/portraits*`, `assets/officers*`, `assets/events*`, army/terrain/event/history scenes and `docs/ARTWORK.md`/`docs/artwork/*` | Recorded prompts/provenance say built-in generation of new historical interpretations, not copied DOS bitmaps. Historical portraits use ancient descriptions/later traditional iconography. Battlefield layout derivation is the separate issue above. | No evidence in this bounded audit requires replacing every generated portrait. Review outputs/references for similarity to Koei-specific designs and maintain generation provenance; replace any tracing or distinctive imitation identified. New artwork does not clear unrelated extracted data/audio. |
| Original synthesised `assets/music/council-music.mp3`, `battle-music-v17.mp3`, `triumph-music.mp3`; `tools/build-audio.py`/other synthesiser builders | Builders describe original synthesized score/effects. This differs from the native rendered file group. | Preserve if provenance confirms independent compositions; avoid recreating Koei melodies. Full music authorship/listening audit was not performed. |
| Three v55 user-provided sounds | Separate Pixabay/Mixkit grants do not grant Koei rights. Existing `docs/changes.md#record-audio-licenses-v55` records the commercial end-product vs source-bundle distinction. | Retain in a finished game subject to their licences/evidence. Do not redistribute the Mixkit gallop with an editable source archive absent additional permission; provide an acquisition step or substitute source-redistribution-permitted audio. |
| `lib/js-yaml.js`, notices; `tools/native-opl/*` | js-yaml MIT notice retained. Optional native OPL tool includes LGPL-2.1 licence/source. These licences cover their software, not Koei content rendered with it. | Preserve notices and meet software distribution conditions. Optional tool source need not be shipped with a runtime-only commercial game; retaining it does not licence its media inputs. |

#### What can remain in an independently authored game

Historical Cao Cao/Liu Bei/Guan Yu identities, historical dates and places, the ancient Three Kingdoms setting, generic troop/equipment/training concepts, turn-based hex movement, simultaneous attacks, jungle concealment and functional mathematical rules are not owned merely because Koei used them. Malaysia's copyright framework excludes ideas, methods of operation and mathematical concepts **as such**; it protects program/art/music expression and qualifying original compilations. Independently write the code/presentation/data. Ancient source material is distinguishable from copyrighted modern translations, editions and artwork. [L1, L2, W1]

A exact-matching game's overall selection/arrangement and distinctive presentation can still require review even when individual elements are unprotected. Reverse-engineering/interoperability exceptions are limited and do not grant general remake or redistribution rights. Do not call this existing source retrospectively “clean room”; a genuine independent redevelopment process requires documented separation and review. Patent/contract/other jurisdictions' rules are outside this bounded audit.

#### Two practical routes

1. **Authorised remaster:** obtain a written licence covering executable remake/adaptation, original data/maps/audio, product name/branding, territories, platforms, distribution and monetisation; separately clear third-party inputs.
2. **Independent commercial game:** make a separate edition with the replacements above, licence/provenance inventory and rights-based package exclusions. Ask Malaysian IP counsel, and counsel for intended sales markets, to review the final concrete release. No checklist alone guarantees non-infringement.

The current gameplay repairs may continue as requested. No commercial-edition conversion, new name, map generation, mass deletion or outreach was performed.

#### Primary sources and citation references

- **K1:** Koei Tecmo official Video/Image Posting Guidelines: https://www.gamecity.ne.jp/info/videopolicy.html.
- **K2:** Koei Tecmo official Licensing Opportunities: https://www.gamecity.ne.jp/license/en/.
- **L1:** Malaysia Copyright Act 1987, current updated WIPO Lex text: https://www.wipo.int/wipolex/en/text/597931.
- **L2:** MyIPO Copyright Basic: https://www.myipo.gov.my/copyright-basic/.
- **T1:** MyIPO Malaysia Trademarks Act 2019 PDF: https://www.myipo.gov.my/wp-content/uploads/2025/02/ACT-815-TRADEMARKS-ACT-201.pdf.
- **W1:** WIPO Copyright Protection: https://www.wipo.int/en/web/copyright/protection.
- **U1:** Upstream creator's repository/README: https://github.com/JuQiang/Rotk2_Python.
- **U2:** GitHub official licensing guidance: https://docs.github.com/en/enterprise-cloud%40latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository.
- **G1:** Natural Earth official Terms: https://www.naturalearthdata.com/about/terms-of-use/.

Repository findings are source-audit evidence; the legal sources do not independently classify these specific files.



<a id="record-fixes-v56"></a>
## fixes-v56.html

Historical record from [`docs/fixes-v56.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v56.html), original Git blob `4a15d1e3134abf13a22935036650038c48d543a5`. Later records take precedence where findings changed.

[Play RTK2 Remastered](../)


### v56 — concealed charges, settlement and messenger sound


| Report | Verified result | 

| Concealed jungle Charge | Charge accepts an adjacent suspected jungle hex. A hidden identity is not exposed as a selectable target. Empty guessed Normal, Simultaneous or Charge spends the initiator’s daily order, preserves MP, and hands selection to the next ready general. | 

| Charge arrival ambush | Native checks three forward cells, not every neighboring jungle. Existing ongoing occupation/breakthrough ambushes and their animation queues pass 48 engine and 24 mounted raster cases. Fixed a related defect: capturing the defending commander ends battle and suppresses a further arrival ambush. All 24 actual native capture comparisons pass. | 

| Simultaneous status | One neutral summary gives Attacker and Defender totals, followed by each unit’s loss once. Capture notices follow this breakdown. Individual exchange arithmetic remains unchanged. | 

| Messenger sound | The exact audiomass-horse_gallop.mp3 now loops through the unlocked audio context. One movement clock controls the rider and sound; it stops after travel, interception, proposal, mute, background and exit. Gain rises from half to full without changing the MP3 bytes. HTML audio remains a fallback. | 

| Abstract defender retreat | Occupied friendly neighbors take priority; unclaimed neighbors remain the native fallback. Native escape uses WAR, INT, training, men, denominator and bonus RNG, with ruler/portrait and prior unclaimed escape modifiers. No eligible refuge means captivity without an escape roll. | 

| Ordinary captive recruitment | Main.exe human Recruit is unconditional, even at old loyalty90–100. Compatibility and old loyalty determine new loyalty after joining. AI recruits ordinary captives at INT+WAR≥70 and chooses Behead below70. Ruler captivity and recruiting a general still serving another ruler remain separate paths. | 

Every report has a named behavior regression. The supplied main.exe passes 190 new bounded executable witnesses. [Validation results](verification-v56.json) · [Bug-to-test ledger](bug-validation.md) · [Remaining native/device test designs](pending-test-case-design.md).


#### Why earlier checks missed these differences

The earlier concealed-attack checks covered Normal/Simultaneous but omitted Charge and next-ready selection after a miss. Charge-arrival checks covered ongoing arcs while bounding capture consequences, so they missed the commander’s terminal winner flag. Status tests checked damage sums and individual contributions without prohibiting duplicated perspective totals. Courier mocks allowed HTML playback and did not reproduce delayed autoplay denial. Abstract settlement and captive recruitment had retained remaster policies; the earlier ordinary-serving loyalty protection was incorrectly reused for captives. V56 now tests each of those observable boundaries. The specifically reported missing ongoing ambush still needs its failing position to distinguish a forward-arc trigger from side/rear adjacency.


#### Commercial rights

This native-faithful build is not cleared for sale. It still includes recovered Koei music/effects, adapted data/maps and RTK2 branding. Obtain written permission or create a separate independently authored commercial edition. Read the [file-by-file commercial rights review](changes.md#record-commercial-rights-audit-v56) and [third-party audio conditions](changes.md#record-audio-licenses-v55). Packaging or an unofficial disclaimer does not itself clear rights. The editable source ZIP is a private backup; the Mixkit recording must not be redistributed with source files without extra permission.

The original remaster BGM and older AI profile files are preserved. No AI training ran. Raw user-supplied DOS reference files remain outside the repository and packages. Real mobile autoplay, listening quality and exact original mixed consequence paths remain pending; these tests do not certify every original mechanism.


<a id="record-native-charge-arrival-v56"></a>
## native-charge-arrival-v56.md

Historical record from [`docs/native-charge-arrival-v56.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-charge-arrival-v56.md), original Git blob `fa985bf0cce50e477dbcbb643fcb656bf9cb08f9`. Later records take precedence where findings changed.

### v56 bounded charge-arrival audit

Original English `main.exe` SHA-256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are offsets in its unpacked image. The executable was kept outside the repository; no original executable/image bytes are exported by these witnesses.

#### Result

The reported missing overrun ambush could not be reproduced in the existing v55 rule-to-raster path with an ongoing battle. **48 native charge-controller cases**, **48 engine comparisons**, and **24 mounted raster queue cases** passed. Mere adjacency is insufficient under the original: only the three forward cells selected by the actual entry direction trigger automatic ambush. Changing this to every adjacent jungle enemy would introduce a new rule.

A separate terminal-arrival mismatch was confirmed with **24 additional native full-capture cases**: defeating the defending commander ends the battle before occupation's ambush check. Existing v55 `act` calls occupation ambush before checking its own outcome, so it can apply extra casualties/animation after a commander defeat has already ended the battle. This causes an excess ambush rather than the reported missing ambush.

#### Ongoing charge arrival

Original charge controller `0x26318` retains the initial direction (`bp+0xC`, native directions LL,D,LR,UL,U,UR, numbered 1–6 at entry). It computes the tile beyond the defender using actual offset-column geometry (`0x23BEA`). After combat:

- Defeated defender: `0x2644C` relocates the charging unit into the defeated target's hex using `0x225B8`; `0x23866` transfers occupancy. At `0x26482` the controller checks battle-ended flag DS:`B8D5`; only value255 reaches `0x24938` at `0x2649A`.
- Surviving defender: beyond tile must pass native terrain, bounds and occupancy predicates at `0x264C4–26501`, then the actor's WAR chance `0x589C`. Successful relocation occurs at `0x26516–2653E`; `0x2658F–265A5` invokes `0x24938` at that beyond tile with the unchanged charge direction.
- Blocked destination or failed WAR roll: actor remains at its origin; no arrival ambush is called.

Automatic trigger `0x24938` reads three direction entries from DS:`B5FE`, tests hostile occupied jungle with `0x239D6`, obtains the unit using `0x237EA`, skips the explicitly supplied unit pointer, and calls `0x247C6`. It does not require a unit's own daily order to remain available. It stops subsequent ambushes when the ambush casualty body signals terminal victim defeat.

The48 fixtures span occupation, successful breakthrough, failed chance and mountain-blocked breakthrough, each in six directions and both column parities. All six neighbours at the landing are populated where they do not overlap original actor/target; thus the tests include jungle units already adjacent at origin and jungle units that become newly adjacent. Current `ambushCells(chargeStart, landing)` produces **the exact same three ambusher cells in the same order**, not merely the same number. Confirmed negative branches produce no ambush.

Bounds: first48 native cases retain original charge controller/relocation/geometry/occupancy/hostile-jungle lookup, but hook exchange arithmetic/capture-result processing, RNG, drawing and ambush casualties. Their occupation comparisons are explicitly **ongoing-battle** cases, with a different surviving defender commander. They do not claim terminal capture fidelity; the separate24 cases below cover that consequence.

#### Terminal commander defeat

`native-charge-terminal-v56.py` retains the actual native melee handler `0x24C58`, both casualty/equipment equations, zero-men capture handling `0x24C2A → 0x25364`, and army linked-list removal `0x2514A`. It does not fabricate the battle-ended flag.

The target begins with one man/one weapon and low WAR/training; original damage exceeds its men. The same jungle ambusher exists one tile beyond the target. Two linked-list setups vary only the defending commander role:

- Target is an ordinary unit after the defending commander: capture removes this ordinary officer, DS:`B8D5` stays255; the actor occupies the target tile and that jungle unit ambushes.
- Target is the defending army's list head (commander), with another defender surviving behind it: the real removal branch at `0x251FE–25236` sets winner0/reason5 via `0x25138`. The charging actor still occupies the target tile, but `0x26482` bypasses the ambush. The surviving jungle unit does not attack.

Twelve direction/parity pairs execute each role:24 native cases. Renderer/text/pause, RNG and ambush casualty body are controlled. Commander identification, actual capture mutation, service/army-list removal, terminal winner/reason, occupation, geometry and jungle eligibility remain original. This proves the commander-defeat terminal exception; it does **not** establish that every remaster ruler/palace/food outcome can safely be treated as identical to this particular native path. A correction should respect confirmed terminal outcomes without claiming equivalence for unexamined branches.

#### Raster integration

`charge-arrival-raster-v56.mjs` instantiates the release's actual `createRasterWorld` under JSDOM/native Canvas and executes `act('charge')` after the world already exists. It calls `world.update` and advances the real frame queue. Twenty-four ongoing occupation/breakthrough cases cover all directions/parities.

Every case plays Charge first, followed by three separate Ambush animations. All three produce eight native-style cue cycles (24 ambush cues total), and `afterCombat` completes only after the whole queue. Playback leaves engine soldiers/equipment and RNG-call count unchanged. This reproduces the actual raster queue, not a constructed array comparison; it does not certify a complete app-button/dialog lifecycle, phone layout, browser throttling or physical sound/visibility perception.

#### Reproduction / integration designs

Native scripts are self-contained and accept `MAIN.EXE OUTPUT.json`; use optional Python Unicorn. Engine and raster scripts accept `APP_ROOT NATIVE_VECTORS.json OUTPUT.json`; raster optionally takes a fourth dependency-project directory (otherwise uses APP_ROOT devDependencies).

Required named regressions suggested for root implementation:

1. `BUG-56-03-CHARGE-BREAKTHROUGH-ARRIVAL-ARC`: all6 directions ×2 parities, exact native ambusher ordering, both origin-adjacent/newly-adjacent cells.
2. `BUG-56-03-CHARGE-OCCUPATION-ARRIVAL-ARC`: same matrix with an ordinary target and surviving distinct defender commander.
3. `BUG-56-03-OUTSIDE-FORWARD-ARC-NO-AMBUSH`: hostile jungle in each of the other3 neighbouring cells causes no damage/cue.
4. `BUG-56-03-FAILED-OR-BLOCKED-CHARGE-NO-ARRIVAL`: no displacement, no ambush.
5. `BUG-56-03-CHARGE-THEN-AMBUSH-QUEUE`: mounted actual raster, eight cues each, no repeated RNG/damage, completion after final ambush.
6. `BUG-56-03-COMMANDER-CAPTURE-ENDS-BEFORE-AMBUSH`: ordinary and commander target differ only by role; occupation retained, commander case suppresses later ambush.

No AI training ran. No repository files were edited by this audit.



<a id="record-native-concealed-v56"></a>
## native-concealed-v56.md

Historical record from [`docs/native-concealed-v56.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-concealed-v56.md), original Git blob `86200c0c67d4441a0a0688af05eed69631406833`. Later records take precedence where findings changed.

### v56 concealed-target / empty-hex native audit

Binary: user-supplied English main.exe, SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Original load-image offsets below refer to its unpacked image. The portable script unpacks in memory and writes witness JSON; it never copies executable bytes to a deliverable.

Run:

```
PYTHONPATH=<unicorn dependency directory> python tools/verify-native-concealed-v56.py <main.exe> <output.json>
```

**30 passing actual native witnesses:** 6 occupied-jungle dispatcher cases, 12 empty-cell dispatcher cases, 9 complete human command-controller cases and 3 friendly-jungle rejection cases.

#### Findings

1. **Charge is legal against a concealed enemy in adjacent jungle.** Human attack submenu `0x26980` selects mode 4; adjacent direction and actual occupancy lookup in `0x26804` reach dispatcher `0x265AE`, which calls the original Charge body `0x26318`. Revealed ready flags132 and concealed ready flags148 both reach the combat exchange at `0x24C58`. There is no jungle/concealment rejection in these paths. Normal (mode1) and Simultaneous (mode2) likewise reach their original handlers. The Simultaneous cases resolve two eligible participants with original adjacency/army lookup retained.

2. **A missed attack on an empty guessed hex spends the attacker's own daily command, including Charge.** The dispatcher tests the selected occupancy nibble, then calls `0x262C2` and prints its empty-target message. `0x262C2` writes DS `0xB8E2=1` at `0x2630F`. Actual human linked-list controller `0x226A0` sees the completed-command flag at `0x22730`, processes the end-of-order hook and advances to the next officer at `0x22740`. All three modes advance from actor9000 to next officer9200 exactly once. This is stronger than inspecting a cell's readiness bit in isolation.

3. **Empty misses do not spend mobility.** Each unit starts with7 MP and retains7. No combat exchange or casualty RNG is reached. A missed Normal/Simultaneous leaves the actor's cell ready-bit128 set; it nevertheless consumes the officer's own daily command through B8E2. This agrees with the earlier native linked-list/readiness audit: cell readiness and own-turn completion must not be conflated. The current remaster Normal/Simultaneous guessed miss already marks its initiator ordered and retains mobility; Charge must gain the same branch.

4. **Friendly occupancy is rejected, preserving the daily command and mobility.** Native hostile-side check `0x23A50` returnsfalse before dispatch. These fixtures place the target in the real friendly linked list, rather than merely changing its tile flag. No effect/flash/exchange is reached. An invalid friendly selection is different from a valid empty guessed attack.

5. **The empty dispatcher itself does not reject terrain.** Its direct probes return completed-command for empty plain0, jungle1, mountain3 and water4. These are boundary observations about `0x265AE`, not evidence that every such hex is offered by the full tactical interface. The complete human controller witnesses establish adjacent empty jungle only. They do not justify expanding the remaster's current deliberate suspected-jungle input policy to arbitrary empty terrain.

#### Surgical implementation recommendation

Allow the existing suspected adjacent jungle `q/r` targeting path to include Charge, preserving rejection of direct concealed enemy IDs. Resolve actual occupancy only after the command. If no enemy is there, consume only the initiator's daily command, retain its MP, produce an empty-hex miss cue/status, and run the normal one-time after-order burning/outcome processing. Reject friendly occupancy without spending an order. Do not add new casualty equations or reveal hidden unit positions when merely preparing the command.

Audit all UI/planner legality and raster targeting gates for the same `['attack','simultaneous']` omission; changing only battle.mjs leaves Charge inaccessible through the mounted interface. Native charge equations/overrun/landing are not replaced by this audit.

#### Required remaster integration cases

- `BUG56-01-CHARGE-CONCEALED-JUNGLE`: human `q/r` Charge on occupied hidden adjacent jungle resolves combat; command target selection offers the suspected hex without exposing the unit; direct concealed ID remains rejected.
- `BUG56-02-GUESSED-MISS-SPENDS-TURN`: Normal, Simultaneous and Charge on empty suspected jungle each set ordered/orderDay, retain MP, use no casualty RNG, resolve no exchanges and consume only initiator's own daily order. Simultaneous helpers retain their own daily orders.
- `BUG56-02-MISS-BURN-ONCE`: a burning initiator's missed guessed command performs exactly one normal after-order fire damage application; replay/animation does not resolve it again. This consequence is suppressed in the native controller witnesses and needs an engine integration fixture.
- `BUG56-01-FRIENDLY-GUESS-REJECTED`: suspected target containing a friendly unit rejects without modifying orderDay, MP, soldiers or RNG.

#### Hooks and limits

Native geometry, cell occupancy lookup, actual army linked lists, allegiance/same-side tests, submenu mode selection, normal/simultaneous/charge handler routing, own-command completion and daily linked-list progression execute unchanged. Keyboard characters/direction are controlled. Unit activation's native maximum helper is replaced by mathematically equivalent max(a,b). Graphics, UI delays/printing, generic key redraw and end-of-order fire/outcome processing are suppressed. Occupied cases replace combat casualties with terminal status1 without soldier mutation; these witnesses establish legal reachable exchanges, not damage equations, depletion/capture, breakthrough/occupation or audiovisual playback. Existing native damage witnesses and new remaster integration cases must supply those consequences. No complete DOS simulation or broad parity is claimed.



<a id="record-native-settlement-v56"></a>
## native-settlement-v56.md

Historical record from [`docs/native-settlement-v56.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-settlement-v56.md), original Git blob `80e78dceb636684da80cbf641cc1bff2233252e0`. Later records take precedence where findings changed.

### Native abstract settlement and ordinary captive recruitment — v56

88 executed witnesses PASS against the private English `main.exe`, SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Reproduce with:

```
PYTHONPATH=/path/to/unicorn python tools/verify-native-settlement-v56.py /private/main.exe native-settlement-v56.json
```

The portable script unpacks the original in memory, exports no executable bytes, has no repository imports, and asserts actual native ownership, loyalty and officer linked-list writes.

#### Report 6: auto-resolved defender retreat

This is a real remaster discrepancy. In v55 `strategy.mjs` `resolveBattle()` builds `emptyRetreats` and restricts defeated defender `lost()` settlement to those unclaimed candidates, even when occupied friendly provinces are adjacent.

The original abstract entry `0x21418` calls `0x20DAC`, whose losing-party loop calls `0x20CAE`. For the defending main party at DS `0xCB72`, mode2 calls neighbor selector `0x20C26`. That selector makes two passes over the original six directional neighbors:

1. First pass skips empty/unoccupied provinces and returns the first occupied province whose owner equals the defeated party ruler.
2. Only if no such occupied friendly neighbor exists, the second pass permits the first unclaimed neighbor. Hostile occupied provinces remain excluded.
3. No eligible neighbor returns null and the officer becomes a captive; there is no escape roll when no destination exists.

`0x20CAE` retains each officer's next link, chooses a destination, invokes escape predicate `0x20B8C`, and places successful escapees with native `0x5F9E`. Failed escapees enter the victorious party's captive list through `0x20AE8`. A successfully used unclaimed destination is marked via DS `0xCA98` and redraw `0x4F44`; the next escape predicate receives the native +50 bonus.

The escape predicate is separate from the remaster generic `captureChance()`:

```
D = 5 + randomInteger(0, 2)
N = WAR + INT + training + floor(men / 10) + randomInteger(0, 49)
threshold = floor(N / D)
if DS:CA98 != 0: threshold += 50
if officer is ruler OR portrait ID == 0xA3: threshold += 20
escape if randomInteger(0, 99) < threshold
```

The native threshold is not clamped to100. It naturally guarantees escape when above99. These are the actually executed arithmetic instructions, with controlled integer RNG; loyalty is absent from the escape equation. Do not confuse abstract escape with field compulsory retreat `0x25670`/`0x2574C`.

Twelve witnesses vary candidate order, friendly presence and success/failure. They retain owner lookup `0x529A`, empty predicate `0x55E2`, selector passes, escape arithmetic and actual province linked-list placement. Nine additional exact-predicate cases cover threshold endpoints, denominator/RNG endpoints, ruler+20, portrait0xA3+20 and prior-unclaimed+50. One no-refuge case captures with no escape RNG and preserves hostile rosters. Two further witnesses enter the complete `0x21418` controller, fixing combat outcome to attacker victory while retaining every abstract settlement call through `0x20DAC`/`0x20CAE`/`0x20C26`. The destination result and final abstract-result flags are asserted.

#### Report 7: loyalty>=90 captive recruitment

The premise that ordinary *captured* generals at loyalty90 must refuse is not supported by this main.exe. Captive recruitment and persuading an officer still serving another ruler are different operations.

The full ordinary captive-list controller `0xA2DE` reaches human menu `DS:46E5`, `1.Recruit 2.Set free 3.Behead`, and dispatches choice1 directly to `0xA0F8`. There is no acceptance percentage, old loyalty gate, shared-blood protection, hostility gate or charisma acceptance calculation on this path. It initializes the officer's new service via `0x5BFE` and places them with `0x5F9E`.

For a normal officer (not the separate covert return-to-patron branch), new loyalty is:

```
newLoyalty = 100
 - integerSquareRoot(abs(officerCompatibility - victoriousRulerLeaderCompatibility)
                     * floor(oldLoyalty / 2))
 - randomInteger(0, 4)
```

This is loyalty *after* unconditional joining, not an acceptance chance. Example oldloyalty100, compatibilitydifference100, jitter4 produces loyalty26. Oldloyalty90, same difference, jitter4 produces29. The native service initializer also sets service count1 and clears covert/service flags, and `0xA0F8` removes the former advisor reference.

The native AI controller also has no loyalty acceptance roll. `0xA2BE` tests INT+WAR: total>=70 selects Recruit; below70 selects Behead. (The remaster currently uses90, a refusal roll, and release fallback.) Captured rulers remain the distinct `0xA212` Set free/Behead handler and must not be added to this ordinary path.

64 full-controller cases vary human/AI ownership, oldloyalty0/90/99/100, compatibilitydifference0/100, jitter0/4 and INT+WAR69/70. Human Recruit always joins. AI decisions follow the70 boundary. Actual service owner, newloyalty, destination officer links and former-advisor removal are asserted. Actual integer square root/compatibility arithmetic executes. Only fixed menu input, rendering/music and random jitter are hooked; the AI terminal Behead call is recorded rather than destructive removal.

Governance recruiting a *serving* general does have loyalty100/shared-blood protection at `0x12EA8`, but those predicates do not apply here. Applying them to captives would create another divergence. The correct response to the user's requested native conformance is to remove the invented captive refusal equation, not invent a loyalty90 rejection.

#### Regression designs and bounded gaps

- `BUG-56-06 occupied friendly refuge before unclaimed`: mount an actual abstract attacker victory with both neighbors, successful controlled escape, assert defender general remains with original owner in friendly destination, and assert unclaimed neighbor owner and roster remain unchanged. Reverse candidate order; same friendly result. Ensure chronology says retreat rather than capture.
- `BUG-56-06 unclaimed native fallback`: remove occupied friendly destinations; assert successful escape uses unclaimed. With only hostile neighbors assert captivity without destination writes. Assert forced retreat does not reuse a reserved hostile war destination, and saved settlement roundtrips.
- `BUG-56-06 abstract escape equations`: replay native fixture RNG endpoints and resulting destination/capture lists; cover ruler+20 and first unclaimed escape+50 for the next officer. The modifiers are dynamically established by the exact-predicate witnesses; their sequential multi-officer settlement lifecycle still needs an integration sub-test.
- `BUG-56-07 captured ordinary recruits at loyalty90/99/100`: choose Recruit after abstract defeat, assert true acceptance for each, no acceptance RNG draw, exactly one jitter draw0..4, exact native newloyalty, formeradvisor removal and correct single province membership. Include compatibility0/100, former hostility100 and shared blood; none is a captive refusal gate. Verify save/load and war chronicle.
- `BUG-56-07 AI ordinary selection threshold`: INT+WAR69 vs70, high oldloyalty100; AI selects native Behead vs Recruit. Keep captured ruler menu unchanged.
- `BUG-56-07 serving general distinction`: the ordinary governance serving-general Recruit must continue to reject absolute loyalty100/shared family protection; captive changes must not weaken that separate operation.

Hook limits: original combat roster setup/build `0x20FB4` and fighting `0x21138` are fixed in the two full-entry cases, so those cases certify settlement, not abstract combat casualty coefficients. The original neighbor-coordinate enumerator `0x5C78` is replaced with candidate indices to isolate settlement selection; geography ordering is native first eligible among its direction enumeration and requires an integration mapping check. Redraw `0x4F44` and all portrait/text/music calls are suppressed. AI Behead `0x6062` is recorded, not executed; this audit certifies decision selection rather than beheading consequences. Complete ruler exile/faction retirement, covert return-to-patron initializer, serving-general Recruit equation and DOS UI remain outside this bounded witness set. The read-only native audit changed no runtime files. V56 integration is covered by tests/v56-tests.mjs; no AI training ran.



<a id="record-audio-licenses-v55"></a>
## audio-licenses-v55.md

Historical record from [`docs/audio-licenses-v55.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/audio-licenses-v55.md), original Git blob `8ff066f4ff6f21820d225962452f6ec4dccefca3`. Later records take precedence where findings changed.

### Supplied audio: commercial-use review

Checked 12 October 2026. This review covers these three sounds, not rights in the game's other content. The supplied MP3 bytes are unchanged. The user supplied download/edit provenance; original unedited downloads were not independently compared.

| Game use | Supplied recording | Source |
| --- | --- | --- |
| Normal / Simultaneous | freesound_community-sword-battle-jingle-loop-96983.mp3 | [Sword battle jingle loop, memnosis via freesound_community](https://pixabay.com/sound-effects/film-special-effects-sword-battle-jingle-loop-96983/) |
| Charge | audiomass-charge_scream.mp3 | [Army of Soldiers Battle Cry, JesusChristIsGod](https://pixabay.com/sound-effects/people-army-of-soldiers-battle-cry-322709/); user edited jesuschristisgod-army-of-soldiers-battle-cry-322709.mp3 in AudioMass |
| Moving messenger | audiomass-horse_gallop.mp3 | [Horse fast gallop in the dirt, Mixkit horse catalogue](https://mixkit.co/free-sound-effects/horse/); user edited mixkit-horse-fast-gallop-in-the-dirt-77.wav in AudioMass |

#### Pixabay

The two track pages identify the Pixabay Content License. [Binding terms, sections 5–6](https://pixabay.com/service/terms/) allow commercial use and editing without mandatory credit. Using these recordings as action sounds in a larger creative game is my application of that grant. An untouched sword recording can be used in that game; editing the individual audio file is not required.

Standalone audio redistribution is prohibited. A trim, volume change or format conversion alone does not establish a new creative work. Do not sell the MP3s separately or package them as a sound library. Keep the track links, actual download evidence and applicable licence for your records. Third-party rights remain the user's responsibility; the licence is not a guarantee of every uploader's rights. The charge listing labels the original AI-generated; no AI training was performed for this update.

#### Mixkit

The [Sound Effects Free License](https://mixkit.co/license/modal/sfxFree/) expressly permits commercial projects, modifications and distribution in video games as a larger end product. [Mixkit's FAQ](https://mixkit.co/free-sound-effects/) says credit is optional.

Redistribution alone, as stock, in tools/templates, or with source files is prohibited. Do not sell/share the editable source archive with this gallop; obtain separate permission or require recipients to source their own permitted copy. The supplied ZIP is your private project backup.

Packaged finished games qualify. I interpret browser runtime-file playback as integrated end-product use too; packaging alone is not decisive. An unpackaged developer/source bundle falls under the explicit restriction. [User Terms](https://mixkit.co/terms/), [Acceptable Use](https://help.elements.envato.com/hc/en-us/articles/31035788503321-Acceptable-Use-Policy) and [Fair Use](https://help.elements.envato.com/hc/en-us/articles/360000621743-Fair-Use-Policy) also apply; no exclusive ownership or rights-management registration is granted.

#### AudioMass

AudioMass is the editor, not the source recording licensor. Its [MIT licence](https://github.com/pkalogiros/AudioMass/blob/production/LICENSE) governs its software; its [official source documentation](https://github.com/pkalogiros/AudioMass/blob/production/src/about.html) notes separate bundled-library licences. This game ships the exported recordings and no editor/encoder code. I found no requirement there to license an exported MP3 under MIT, LGPL or to pay an export royalty. That is an interpretation of the software licence's scope; the original sound licences remain applicable.

Commercial sound permission does not itself clear the rest of this remaster for sale. Physical-device listening and loop-seam checks remain in [pending test designs](pending-test-case-design.md). No source files or software here grant ownership of these third-party recordings.



<a id="record-fixes-v55"></a>
## fixes-v55.html

Historical record from [`docs/fixes-v55.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v55.html), original Git blob `f42a4e39ede5ce753c9208c9119e8ae8bb7b8502`. Later records take precedence where findings changed.

[Play RTK2 Remastered](../)


### v55 — supplied battle and courier recordings


| Action | Playback | 

| Normal / Simultaneous | Supplied Pixabay sword recording, once per resolved animated exchange; once per order when no animation is available. Later flashes and re-observation do not replay it. | 

| Charge | Supplied AudioMass-edited Pixabay battle cry, once per order. Repeated charge flashes do not add the prior native combat sound. | 

| Messenger | Supplied AudioMass-edited Mixkit gallop loops during outward or return motion. Stationary, mute, hidden page and exit stop playback; repeated updates do not create duplicate loops. | 

The three uploaded MP3s are unchanged. Other battle/event cues and the original remaster BGM remain. No AI training ran.

Commercial use in a finished game is supported by the source licences. Standalone sound redistribution is prohibited. Mixkit additionally prohibits distribution with source files: this private source backup must not be sold/shared with that recording. Packaging alone does not decide whether a product qualifies as the finished game.

[Commercial-use findings and source links](changes.md#record-audio-licenses-v55) · [Media identity and decoding](audio-assets-v55.json) · [Validation](verification-v55.json) · [Bug-to-test ledger](bug-validation.md) · [Pending listening checks](pending-test-case-design.md)


<a id="record-fixes-v54"></a>
## fixes-v54.html

Historical record from [`docs/fixes-v54.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v54.html), original Git blob `f701a29ba9b64a9ec92e42b237d6ad6c95ed7c9e`. Later records take precedence where findings changed.

[Play RTK2 Remastered](../)


### v54 — deployment, turn sequence and native attack accounting


| Report | Verified result | 

| Captured defending ruler in the last province | Main.exe's human captive-ruler handler and full captive-list controller offer Set free / Behead at zero, one or two remaining provinces, including hostility100. Following your clarified instruction to conform to main.exe, Recruit remains unavailable. No ruler recruitment probability or hostility cutoff was invented. | 

| Simultaneous target losses | The target already lost the sum of every resolved attack. A real mismatch was helper order: the remaster followed roster insertion; main.exe executes the initiator, then helpers in LL,D,LR,UL,U,UR order around the target. This is corrected. Each hit uses the target's remaining men/weapons, so order matters. The status now shows each attacker's inflicted loss and the exact total, separately from each unit's own losses. | 

| Deployment information | The compact placement panel shows the selected general, men, weapons, training, WAR, INT and MP. A native dropdown switches units without adding a monthly or battle order. Information remains read-only and scrollable; Yes/No deployment controls remain available. | 

| Unit-turn sequence | The controller presents the general's turn first, enables their highlight on the following frame, performs the order, and then shows its impact. Automatic and manual AI steps wait for the turn announcement; human input arriving before the first highlight is deferred until it can be shown. The post-action queue no longer repeats the old general's turn. Pending presentation is cancelled when leaving/loading a campaign. | 

| Governance button sounds | Native ordinary keyboard/menu selections are silent. Events/Province/Orders, Rest/View and order menus therefore no longer play a generic click or opening cue. Effect10 is not a keypress cue: native refusal/error reports use it; effect14 is used by verified success feedback. Existing result/event audio is retained separately from silent navigation. Full governance result-context parity remains pending. | 


#### Example: Dong Zhuo and Lu Bu versus Cao Cao

A controlled original-equation fixture produces 11 + 172 = 183 target casualties. Each attacker's own casualties are counterattack losses and are different numbers. The simultaneous participant-count divisor applies to friendly retaliation; it is not a multiplier to add to each inflicted target loss. The engine retains the original casualty/equipment equations and stops when the target is defeated.


#### Verification and limits

Reported bugs have named behavioral tests and mounted-interface cases. Original executable witnesses preserve the relevant controller, geometry, casualty and equipment paths; hook boundaries are documented. Real handset layout and audible listening remain pending. See the verification record for final counts.

[Verification record](verification-v54.json) · [Bug-to-test ledger](bug-validation.md) · [Pending test designs](pending-test-case-design.md) · [Joint-attack findings](changes.md#record-native-joint-findings-v54) · [AI joint-attack findings](changes.md#record-native-ai-joint-findings-v54) · [Captive/audio findings](changes.md#record-native-captive-audio-v54)

No AI training or renewal ran. Older profiles keep their original rules identity and fall back to Legacy when incompatible. The original remaster music is retained. The supplied DOS reference binaries remain outside source and release packages.


<a id="record-native-ai-joint-findings-v54"></a>
## native-ai-joint-findings-v54.md

Historical record from [`docs/native-ai-joint-findings-v54.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-ai-joint-findings-v54.md), original Git blob `800905dc99e3abcc55b12c86a03147d604d9c8b2`. Later records take precedence where findings changed.

### v54 AI-hostile simultaneous attack follow-up

**All88 cases matched the corrected remaster** for target aggregate loss, each army's final soldiers/equipment, exchange count and casualty RNG consumption. This confirms applicability of the helper-order correction to AI-hostile grouped attacks on a human target, not only the human-command handler.

Native entry `0x27D9E` receives a selected target and its hex. It counts eligible surrounding friends, executes the initiator in its first pass, then scans remaining helpers in original **LL,D,LR,UL,U,UR** order. The linked-list/roster order does not change that geometric order. For each helper it calls unchanged exchange `0x24C58`. The resulting target state—remaining men and weapons—is used by the next exchange, and target losses equal the sum of actual capped losses from executed exchanges. A defeated target stops further exchanges; a defeated attacker does not prevent surviving helpers from contributing.

#### Coverage

- Three and four friendly attackers.
- Plain and palace target terrain.
- Equal combat power, mixed powers including Lu Bu's native portrait bonus, and low equipment coverage.
- Early defeated target and early defeated initiating attacker.
- Shuffled linked-list/roster order for three attackers and for four attackers surrounding a palace.
- Nonhuman target baseline.
- Human target classification with difficulty1,3 and5.

The original exchange adds **difficulty minus1** to the attacker-counterattack-loss divisor when the target is human and the attacker is AI. Each witness now records the effective divisor at `0x24C8A`, after native difficulty adjustment. For four attackers against a human target at difficulty5, it is8 (4+5-1). The target's own loss calculation still uses divisor1. The Node replay uses the corresponding current `isHuman` classification and difficulty; all final states and RNG call counts agree.

#### Bounded hooks and limits

The original AI grouped-handler geometry, true unit lookup, combat power, both casualty equations, proportional equipment equations, men/equipment mutation, native difficulty adjustment and terminal exchange branches execute unchanged. The witness never replaces the damage exchange or equipment helpers.

The AI's **strategic commander-risk grouping predicate** `0x2B7A8` is controlled as false, permitting all otherwise eligible adjacent friends. Therefore this validates the order and arithmetic **once that group is eligible**; it does not certify when the full original AI selects a target, includes/excludes a strategically protected commander, chooses an attack type or forms the attack. Those policy branches are outside this follow-up's scope.

Human ownership lookup `0x238FA` is controlled by fixture: only the target pointer is classified human in the human-target cases. This exercises native difficulty arithmetic without claiming reconstruction of every original human-controller/province ownership representation. DOS rendering/announcements are suppressed. Native depletion-clear instructions execute, while subsequent captive/officer/province bookkeeping is bypassed. Full capture settlement and whole-battle controller behavior require their separate existing integration checks.

No training ran. This evidence and its portable verifier are included in the release; the behavioral suite replays every vector with original and reversed unit rosters.

#### Reproduction

```sh
PYTHONPATH=/path/to/unicorn/dependencies python tools/verify-native-ai-joint-v54.py /path/to/main.exe /tmp/native-ai-joint-witness-v54.json --repo /path/to/rtk2
```

Input main.exe SHA256 must be `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Script and JSON contain no executable bytes.

#### Regression links to retain

`V54-02-HELPER-ORDER-INDEPENDENT-OF-UNIT-ARRAY`, `V54-02-TARGET-LOSS-EQUALS-EXCHANGE-SUM`, `V54-02-TARGET-EARLY-DEFEAT-STOPS`, `V54-02-ATTACKER-EARLY-DEFEAT-CONTINUES-HELPERS`, and a human-target difficulty subcase should remain executable in the behavioral suite. Any unsupported full AI grouping-policy claim belongs in pending-test-case design instead of being inferred from this bounded arithmetic evidence.



<a id="record-native-captive-audio-v54"></a>
## native-captive-audio-v54.md

Historical record from [`docs/native-captive-audio-v54.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-captive-audio-v54.md), original Git blob `5ec372470cfdbb024f57f7603151f25e0af49fa7`. Later records take precedence where findings changed.

### Native ruler-captive eligibility, service change and menu audio — v54

49 bounded witnesses PASS. Reproduction requires Python Unicorn and privately supplied original English main.exe; the script has no repository imports and unpacks the SHA-256-verified image in memory. No DOS executable bytes are exported.

```
PYTHONPATH=/path/to/unicorn python tools/verify-native-captive-audio-v54.py /private/main.exe native-captive-audio-v54.json
```

#### Human captured rulers

Original human handler0xA212 prints DS:46A9 `1.Set free 2.Behead` and asks input range1..2. Twelve witnesses execute it with remaining province counts0/1/2 and captive realm hostility toward captor0/50/80/100. The menu is unchanged. Native owner lookup0x5280, owner-ID0x5256 and human-controller eligibility0xA0CC execute unchanged.

Two further witnesses retain full captive-list controller0xA2DE and native ruler detection0x55F8. Even when the former ruler owns zero provinces, this controller defers that ruler separately and calls the same two-choice menu. The special handler checks former realm state flag7&0x80 before prompting; that flag can force terminal handling, but it is not a province-count or hostility test. No native last-province Recruit menu was recovered.

The complete battle result entry0x8B82 calls captive-list controller0xA2DE at0x8BA9, then ruler-return handler0x9D50 at0x8BB4. Native ruler-release0x9FC6 chooses another eligible home via0x9F3E/0x9E9A; no home can send the ruler into exile via0x9F84. This release path retains their ruler identity, sets exile flag4 and clears prior territorial links; it does not recruit them into the captor faction. Full cross-war exile/faction cleanup is not dynamically witnessed in this bounded task.

The user's clarified instruction is native conformance. Therefore the remaster keeps Set free/Behead for captured rulers at zero/one/two provinces. No last-province ruler Recruit extension, ruler recruitment formula or hostility cutoff is introduced.

#### Ordinary captured officers

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

#### AI ruler-release chance must not become recruitment chance

0xA196 computes:

```
release probability = floor((captive ruler CHA + 100
                             - captive realm hostility toward winner) / 2)
```

It tests that percentage, then also requires year<200. On success0xA212 calls release/home/exile handler0x9FC6. On failure it returns terminal handling to the controller. Seven witnesses distinguish this from recruitment, including CHA80 and hostility100 still yielding40% release probability, and CHA100/hostility100 yielding50%. There is no hard high-hostility cutoff in this release arithmetic.

This equation concerns release versus terminal handling by AI, not acceptance of recruitment. It must not be ported as ruler recruitment.

#### Ordinary governance selection is silent

The actual own-key controller0x468A emits no original effect for ordinary1/2/Esc selection. Three witnesses retain it while bounding BIOS input and cursor rendering. Four additional witnesses retain actual numeric menu0x4888→0x47D2→0x4732→0x468A, including invalid4 then valid1 retry. They return valid selections without effect dispatch. Optional callback3530 is null, as in governance; that callback is a screen updater, not a key sound.

Use silence for ordinary governance buttons, selectors and order-menu selections. Do not treat effect10 as a generic keypress or opening cue.

### IDs10 and14 are result notifications

Two dispatcher witnesses prove explicit helper0x58E6 invokes effect10 and0x591E invokes14. Four further cases execute actual Recruit result routine0x162CE with positive/zero success and ruler/nonruler envoys:

- Success prints DS:7106 `Success!` and7110/712A joined-followers text, then calls0x591E→14.
- Refusal prints7144/715E does-not-care-to-join text, then calls0x58E6→10.

Generic native errors0x1309C — Not home province, No one can do that now, Not enough gold — likewise use0x58E6→10. Labels “input/wait opening” and “input/wait completion” in the old audio catalogue were misleading; these are separate explicit report cues, not sounds emitted by ordinary keyboard selection. Native cues can accompany specific successful/negative report contexts; this evidence does not justify adding them to every order indiscriminately.

#### Hook and consequence limits

Every JSON case includes its own suppressed paths. Human captive menu cases bound portrait/text, select Free, record native effect7 and suppress release settlement9FC6 after proving its invocation. Full-list cases additionally suppress original governance music. Ordinary service-boundary cases record service/placement calls rather than mutating native province lists; actual service initializer cases independently execute those eligibility-independent owner/loyalty writes. AI-release cases control percentage roll. Input witnesses hook BIOS key/poll and cursor rendering; numeric range, retries and parser remain native. Result-audio cases record text arguments and effect dispatch while suppressing final timed message rendering.

Integration regressions should separately assert requested remaster last-province recruitment eligibility, hostile refusal, nonmutation on refusal, accepted-ruler demotion and former-faction retirement, removal of marriages/alliances/pending orders, save/load and human/spectator lifecycle. Native witnesses do not establish those newly added extension consequences.



<a id="record-native-joint-findings-v54"></a>
## native-joint-findings-v54.md

Historical record from [`docs/native-joint-findings-v54.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-joint-findings-v54.md), original Git blob `2639e0ba4eb75bc675e0cb45fc83e44385248a5f`. Later records take precedence where findings changed.

### v54 simultaneous attack casualty audit

Original SHA256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are unpacked-image offsets. The executable remains outside the repository.

Reproduce with optional Python Unicorn installed:

```sh
python native-joint-witness-v54.py /path/to/main.exe /tmp/native-joint-witness-v54.json --repo /path/to/rtk2
```

#### Result

The v53 remaster **already subtracts the sum of all executed participants' inflicted casualties** from the target. Twenty original-handler/actual-equation witnesses matched the current `act('simultaneous')` result for every surviving soldier count, equipment count, number of exchanges and casualty RNG calls. These cover two/three attackers, plain/palace targets, equal/mixed combat power, poor equipment, an early defeated target and an early defeated attacker. No dropped target-damage accumulation defect was found in these cases.

Example with two mixed-power attackers named Dong Zhuo and Lu Bu in the comparison fixture: Cao Cao loses11 in the first exchange and172 in the second, for183 total. With a third attacker inflicting6, the total is189. Each attacker's own losses are different numbers: they represent counterattack casualties, not the damage inflicted on Cao Cao. The current `lossRows` contains each army's own losses plus Cao Cao's aggregate losses; it does not explicitly display inflicted casualties per attacker. Showing both columns would make the arithmetic directly inspectable without changing damage rules.

One additional witness found a **helper ordering mismatch**, described below. This can alter exact totals, but is separate from summing or omitting contributions.

#### Original native execution

The human joint handler `0x26072` counts eligible units around the target at `0x260A0..0x260E6`. It executes the selected initiator in its first pass and other eligible surrounding units in the second pass. For each participant:

1. Load that participant's terrain into DS:B8DD; target terrain is DS:B8DE.
2. Call shared exchange `0x24C58` with participant pointer, target pointer and total participant count.
3. Call result redraw `0x24BAA`.
4. Stop if the shared exchange returns status0 (defender defeated), status2 (both defeated) or the global battle-ending condition. Status1 (current attacker defeated) still allows later helpers to attack.

The exchange calls original power `0x23702` for the participant and target, then native casualty `0x2375A` twice. Both calculations use the armies' **pre-exchange** men/equipment/power. Proportional equipment deductions occur before the men writes. Once the exchange completes, the next helper sees the target's **remaining** men and equipment. Target power is recomputed; it is not a cached initial target power.

The participant-count factor divides the casualty expression for **the attacker's own counterattack losses**. It is not a multiplier applied to each helper's damage against the target. Native difficulty can further adjust that factor in human/AI classification cases; this bounded suite fixes ownership classification as nonhuman on both sides.

Casualty random draws execute in this order for every exchange:

- Attacker own-loss roll in0..299, then an additional0..29 fallback only if its raw casualty expression is nonnegative.
- Target-loss roll in0..299, then an additional0..29 fallback only if its raw casualty expression is nonnegative.

Actual target losses are capped by remaining soldiers. An early-defeat witness has20 remaining defenders and native calculated loss677: actual loss is20, the handler stops, and later helpers cause no damage. The remaster matches that behavior. Summing uncapped theoretical losses would be wrong.

#### Genuine helper ordering mismatch

Original native directions around the target are `LL,D,LR,UL,U,UR`. The initiator always goes first; other helpers follow that geometric scan order. The remaster's `jointAttackers` sorts the initiator first, then preserves `b.units` insertion order for other helpers.

The21st witness intentionally reverses the two helpers' linked-list/insertion order. Original still executes pointers9000,9200,9100 according to their hexes. The remaster executes9000,9100,9200. Under the controlled replay the native target total is189 while current remaster total is304; casualty RNG consumption differs9 versus8 because swapping participants changes which fallback branches execute. This confirms an ordering mismatch, not failure to sum losses. Exact production totals depend on the game's random stream; those example values are deterministic witness values.

A surgical native-fidelity correction is to preserve initiator first and sort other helpers by direction from **target to helper**, using remaster direction indices `[3,4,5,0,1,2]`. Do not change `meleeExchange` or multiply damage again.

Regression names:

- `V54-02-TARGET-LOSS-EQUALS-EXCHANGE-SUM`: verify target before/after equals summed actual inflicted damage for2/3 participants.
- `V54-02-PER-ATTACKER-INFLICTED-AND-OWN-LOSS`: verify displayed inflicted/received figures correspond to each actual exchange.
- `V54-02-TARGET-EARLY-DEFEAT-STOPS`: cap actual loss by remaining men and suppress later exchanges.
- `V54-02-ATTACKER-EARLY-DEFEAT-CONTINUES-HELPERS`: later helpers still engage.
- `V54-02-PALACE-SEQUENTIAL-EQUIPMENT`: native special terrain and equipment updates remain compatible.
- `V54-02-HELPER-ORDER-INDEPENDENT-OF-UNIT-ARRAY`: reorder underlying units; native geometry still determines helper exchange order and seeded result.

#### Hooks and limits

The witness runs unchanged original joint eligibility, hex geometry, unit lookup, combat power, casualty equations, equipment equations, men/equipment mutations and joint terminal branches. It never hooks `0x24C58`, `0x23702`, `0x2375A`, `0x235A8` or equipment-percent helper `0x533E`.

RNG is replaced with controlled integer values, recorded with their requested bounds. Rendering, treasury/food counter UI and human-controller classification are bounded hooks. Depletion executes original soldier/equipment clearing instructions `0x25364..0x2537C`, then bypasses DOS captive/province/officer bookkeeping. The suite therefore does not certify downstream captivity settlement, human difficulty adjustment, secret pacts, whole-battle termination bookkeeping or DOS graphics. Those need separate integration tests or entries in pending-test-case design.

The Node comparison executes the current game `act` function, not a duplicate damage implementation. It reports each native exchange's pre/post state, native calculated loss, actual target loss and RNG interval in the JSON. Scripts neither run nor renew AI training and include no executable data.

#### Final v54 result

Helpers now scan LL,D,LR,UL,U,UR after the initiator, independent of roster insertion. All21 native/remaster cases match soldiers, weapons, RNG calls and exchange count, including the previously mismatched shuffled case. `exchangeRows` records actual inflicted and received casualties per resolved participant; the displayed target sum equals the actual aggregate. Native equations and early-stop behavior are unchanged. Reproduce with `python tools/verify-native-joint-v54.py /private/main.exe /tmp/joint-v54.json --repo /path/to/rtk2`.

#### AI-handler follow-up

The additional [AI audit](changes.md#record-native-ai-joint-findings-v54) executes 88 native grouped-attack cases, including human targets at difficulty 1/3/5, three/four attackers and shuffled rosters. All final soldiers, equipment, RNG and exchange counts match. Strategic commander-risk eligibility and target selection remain bounded separately; this is damage/order evidence once the group is eligible. `tests/v54-tests.mjs` replays all 109 human/AI arithmetic fixtures with both roster orders.



<a id="record-fixes-v53"></a>
## fixes-v53.html

Historical record from [`docs/fixes-v53.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v53.html), original Git blob `f2de96efda721bec1c6c88e29922c60a0f0505cd`. Later records take precedence where findings changed.

[Play RTK2 Remastered](../)


### v53 — native battle paths and messenger decisions

The original remaster governance, battlefield and victory music is retained. No AI training or renewal ran. Original DOS reference binaries remain outside source and release packages.


| Report | Result | 

| Tests and storage | Every reported bug has named behavior coverage or an explicit pending test design. Four redundant verification sub-tests and unused guide-generation material are removed; current assets and useful regression suites remain. Historical failure logs are incomplete, so lack of a log is not proof that a suite never caught a bug. | 

| Normal / Charge sound | Native main.exe uses effect13 for both. Charge now adds one synthetic crowd shout as a remaster presentation addition; each actual exchange retains its native hit cue. | 

| Defender simultaneous attack | Removed the palace-holding Normal override and intelligence gate in ordinary grouped melee selection. Fire/flight priorities remain. Helpers retain their own order status. | 

| Hidden AI jungle units | Map sprites, flags, labels, selection/reach overlays and normal move announcements use the human observer. AI turns cannot expose their own concealed positions. Surviving jungle units reconceal after transient combat cues. | 

| Forced-move ambush | Successful displacement now applies fire entry first, then the normal forward-arc ambush check using the target's old→new direction. The puller is skipped; displaced mobility and helper/target own orders are preserved. | 

| Repeated burning | Each successful ignition applies immediate fire damage again. Units below100 men perish; otherwise loss is a random integer below floor(men×5/100). The ignition probability now uses the original terrain and opposed-intelligence equation. Rain prevents ignition; cloudy weather has no independent multiplier. | 

| Governance effects | Mounted messenger movement now uses native11 instead of remaster gallop. Verified opening/completion/captive contexts use native10/14/7. Full native coverage is not certified: effect15, some event contexts and the PC-speaker fallback remain pending. | 

| Messenger decisions | Compact cards show sender ruler, original province, both directed hostility scores, alliance and interceptor trust. Buttons explain actual effects. Native transport passage lowers sender hostility3 and allied host trust rises3; standard imprisonment raises hostility10 or8 allied, with allied trust−5 for ordinary missions. Allied hostile missions directed at the interceptor instead preserve trust and raise reverse hostility3. | 

| Set free / return | Letting an intercepted messenger pass correctly continues delivery, then animates the whole return route without re-interception. Captured messengers released later now retain sender/source and animate a release-only return; the cancelled mission stays cancelled and cargo is not refunded. This ordinary-captive release is a documented remaster extension, not a verified original ordinary-captive animation. | 


#### Why the previous audit missed concealment and arrival ambush

The earlier forced-movement native witness replaced routine24938, the automatic ambush routine, with a zero-return stub. It verified displacement/MP while suppressing the consequential branch. The earlier jungle witness verified original concealment bits but did not mount the remaster display during an AI turn from the fixed human observer. The new integration tests cover those missing paths. Bounded witnesses are now documented with hook limits.


#### Native fire equation

Dry terrain base is [80,90,70,60,0,50,20] plus integer roll0–9; water cannot ignite. For an occupied tile, percent chance is min(100, floor((101−targetINT)×base/100) + floor(randomIntegerBelow(max(0,actorINT−targetINT))/2)). A zero-range random term is0. A roll0–99 must be below that chance. Reburning repeats ignition damage on each success; failure leaves the earlier fire unchanged.


#### Validation and limits

219 bounded native witnesses execute battle and messenger paths. Behavior tests cover both human sides, six pull directions and column parities, repeated fire, directed relationships, return/save transitions and sound routing. Mounted emulated DOM/Canvas tests exercise concealment and the compact messenger controls. 492 gameplay/data/art/audio groups and 79 mounted interface/layout groups pass. Real handset appearance and audible playback remain pending.

[Bug-to-test ledger](bug-validation.md) · [Pending test designs](pending-test-case-design.md) · [Native battle evidence](changes.md#record-native-battle-audit-v53) · [Native messenger evidence](changes.md#record-messenger-native-v53-report) · [Verification record](verification-v53.json)


<a id="record-messenger-native-v53-report"></a>
## messenger-native-v53-report.md

Historical record from [`docs/messenger-native-v53-report.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/messenger-native-v53-report.md), original Git blob `91b87e7dc8a67d73b61e4b92819aff4eda55d57b`. Later records take precedence where findings changed.

### Messenger and governance audio audit, v53

Evidence: SHA-256 verified English main.exe; offsets in unpacked native.bin, DS base 0x2FA60. Eleven bounded Unicorn cases in tools/verify-native-messenger-v53.py / docs/messenger-witness-v53.json passed. Reproduce with `python tools/verify-native-messenger-v53.py /outside-repository/main.exe /tmp/messenger-v53.json` and Python/Unicorn installed. No repository edits or AI training performed by this audit.

#### Native messenger sound

0x11E74 interpolates a mounted messenger segment and calls sprite routine 0x12F92 for each frame. The sprite routine tests sound/driver flags and dispatches original effect ID 11 at 0x13053. Witness with three interpolation steps captured [11,11,11]; sound off and driver absent captured none. Graphics and final sound dispatch are hooked; this proves routing, not waveform playback. Current remaster AudioBus.syncCourier uses custom gallop.mp3. Therefore answer to user 8a is currently remaster, not original. Native effect11 is already rendered/exported as native-effect-11.mp3; wire that while keeping requested remaster BGM.

#### Set free and route semantics

Original menus differ by mission context:

- Secret letter: DS:A8E7: Let letter pass / Seize letter / Imprison messenger. Let-pass (0x11C24 choice1) sets CA86=1 with no hostility/trust write. Seize (choice2) sets CA86=2 and increases sender hostility toward interceptor by5; in allied case trust−3 unless the special relationship helper exempted it.
- Transport: DS:A9D7: Seize / Set free / Imprison. Transport Set free (0x11D10 choice2, branch0x11D8E) sets CA86=0, lowers sender hostility toward interceptor by3, and increases interceptor trust by3 when allied. Witnesses retain original capped byte modifier functions and bounded owner-ID helper.
- Journey controller0x12398: Let-pass/status1 and transport-free/status0 BOTH continue outbound, resolve mission, then render every reversed segment via0x11E74. Tested source→middle→destination, mission, destination→middle→source. Interception encounters are not rechecked on the reverse loop. Earlier static inference that status1 aborts outward route was disproved by witness; the actual break threshold at0x12462 is>=2.
- Imprisonment attempt0x11632 raises sender→interceptor hostility by10 nonallied or8 allied. Allied interceptor trust falls5 except where special-mission predicate0x11302 exempts it. Eleven witnesses include forced escape after the relationship writes, so they occur before escape resolution. Current remaster Capture has none of these direct changes.
- Captured interception menu0x1158A uses Set free for ruler, Recruit for ordinary officers, versus Behead. This differs from remaster's generic captive panel, which lets ordinary captured messengers be set free. Native0x11528 joins ordinary officer to captor and current province; ruler Set free exits without joining. Do not claim a verified native ordinary-captive-release animated return from this evidence.

Current generic interceptJourney('free') leaves outbound active, clears interception and records allowed-to-continue. That is consistent with native continued delivery. Normal return journey later exists. After Capture, cancelJourney removes the journey; decideCaptive('free') makes a nonruler unclaimed, or teleports a ruler to another own province. No release route is saved or drawn. If user #10 concerns this case, it lacks an animation and sender/source history; preserve interception context and animate a release-only return without resolving the cancelled mission or paying cargo twice. Present that as an explicit remaster release flow unless a native ordinary-captive-return path is recovered.

#### Current consequences suitable for compact UI

interceptJourney current behavior, before any v53 fix:

- Set free: permits original mission to continue; no direct trust/hostility change.
- Capture: cancels mission; intercept province receives carried gold/food/horses (capped); sender has captive pending; no direct trust/hostility change. An AI interceptor may recruit/free immediately.
- Behead: same mission/cargo cancellation/seizure; officer permanently dies; interceptor trust−5. If messenger is sender's ruling officer and an heir succeeds, successor hostility toward killer becomes100. Extinction clears alliances where no heir remains.

Sender is g.ruler(j.owner), interceptor g.ruler(j.interception.owner). Their names must not be conflated. Display sender ruler, origin '#id name', interceptor ruler, sender→interceptor hostility0–100 (higher means worse), and alliance status. If room permits display both directed hostility values: they can differ, and exact native modifier changes sender's row. Trust belongs to each ruler, not bilateral relationship. Use short consequence hints on each button with mobile wrapped rows. No forecasts should claim Capture breaks an alliance or raises hostility unless mechanics actually add those writes.

#### Governance audio completeness

Native event effects0–7,9,12 have semantic mappings; event7 captive-prompt use is still missing because current kind 'prison' does not map. IDs10 opening and14 completion remain callable but UI uses custom select/order cues. ID11 courier uses custom gallop. ID15 has no verified gameplay caller. Custom governance train/trade/recruit/march/message/retreat/order all remain remaster semantic sounds; cannot claim full adoption of native gameplay routing. PC speaker fallback branches at0x5900 and0x5924 are not emulated. All16 exported OPL assets being present is distinct from fully wiring all verified contexts.

Normal attack and Charge both invoke shared native combat effect13 at0x250D7 within repeated animation. A separate shouting sound for Charge has not been verified from main.exe. Charge repeats actual exchanges and the same native effect; any crowd shout would be a documented presentation addition.

#### Tests needed

- Engine: letting intercepted envoy pass retains original mission and cargo, completes delivery once, shows reversed path, never intercepts return, saves/loads at every leg.
- Engine/native parity: transport Free sender hostility−3 clamp0, allied trust+3 clamp100, no reciprocal hostility write; secret-letter Let pass no direct relationship effect.
- Released-captive extension: restores or safely redirects sender service after capture→free; renders route home, no delivery and no cargo refund; home lost/owner extinct/no valid path handled explicitly; save/load midway; no multiple active journeys.
- Mounted UI: sender name plus directed hostility/alliance at interception and captive panel; 568×270/640×360 wrapping/clipping; Free followed by moving map sprite on each reverse segment and correct orientation; buttons' consequences match engine metadata.
- Audio: moving outbound and return segments use native11; stationary/intercepted/proposal/hidden/muted pages stop it; no duplicate loop; native10 opening/14 completion/7 captive cues in the actual mounted controller paths.
- Pending: effect15 original calling context needs dynamic original command coverage or original manual/gameplay capture; PC speaker fallback needs PIT/speaker trace capture and renderer, with native port instruction witness. Do not mislabel these fully adopted.

#### V53 follow-up: authentic allied hostile-mission exemption

84 further native witnesses execute11302 and its actual owner lookup/clamp, including32 complete imprisonment branches. For allied imprisonment, Recruit/Wolf/Betrayal/Forged destination-owner==interceptor or Joint attack-target-owner==interceptor exempts trust−5 and raises interceptor→sender hostility3; sender→interceptor still rises8. Nonallied never calls the predicate and rises10 with no reverse/trust change. Native mode8 is covert-agent recall/verification and has no current equivalent; its forced-exposure flag is not initial infiltration. Ordinary alliance/marriage/gift/threat and rival/infiltration do not qualify. `tools/verify-native-messenger-exemption-v53.py ORIGINAL_MAIN_EXE OUTPUT_JSON` reproduces the native evidence; source/data changes do not run training.



<a id="record-native-battle-audit-v53"></a>
## native-battle-audit-v53.md

Historical record from [`docs/native-battle-audit-v53.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-battle-audit-v53.md), original Git blob `c4cd61cfcf18ebc2acbe598f272a7f41f5ed2bc2`. Later records take precedence where findings changed.

### v53 bounded native battlefield audit

Original SHA256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.
Addresses below refer to the unpacked image. Executable stays outside the repository.

Reproduce with Python/Unicorn installed: `python tools/verify-native-battle-v53.py /outside-repository/main.exe /tmp/native-battle-v53.json`. Supply your own original executable; do not add it to the repository.

124 controlled native witnesses passed. They are executable branch witnesses rather than complete DOS/UI simulations. Each JSON case names its test and bounded hooks.

#### Defender normal versus simultaneous attack (#3)

Original AI attack selector `0x2B306` takes its ordinary melee fallback at `0x2B45A`: writes attack mode2 and calls `0x28020`, the wrapper around native joint handler `0x27D9E`. It does so for commanders and ordinary units, from palace or plain, without the remaster's smart-intelligence threshold. The base attack handler counts surrounding friends: one participant produces one normal exchange; multiple valid participants produce grouped exchanges with participant count as damage factor.

16 witnesses cover both army sides, commander/noncommander, palace/plain and difficulty1/5. The original adjacency predicate and original joint assembly execute; controlled target choice avoids claiming that all six target-ranking paths are native. The actor has exactly3000 men, intentionally keeping the optional charge branch out. Commander identity, strategic commander risk, the charge predicate, UI and casualty bodies are bounded hooks. Two friendly units receive two damage exchanges factor2.

Current remaster `ai-battle.mjs` explicitly returns normal attack when `holding` before checking joint; also only considers joint above `smartIntelligence`. Those are remaster choices, not native holding rules. Move joint selection ahead of ordinary normal fallback and remove the intelligence threshold for the base melee path. Preserve separately verified fire/flight priorities. Do not claim native always chooses joint: optional charge/fire branches and strategic commander-risk exclusions exist.

Named regression cases: `V53-03-PALACE-DEFENDER-JOINT`, `V53-03-LOW-INTELLIGENCE-JOINT`, `V53-03-SINGLE-ATTACKER-NORMAL`, `V53-03-ALREADY-ORDERED-SUPPORT`.

#### Jungle visibility during AI turns (#4)

Native unit redraw `0x24466` first checks jungle terrain. Jungle immediately sets cell bits0x90 and invokes terrain-only redraw `0x24648`, then returns. It does not consult active side or current controller. Eight witnesses show terrain-only redraw for both camp flags and all combinations of existing0x10/0x80 flags. No daily-order meaning is inferred from those display bits.

Combat flashing `0x250F8/0x250AE` draws generic marker `0x2361E`, rather than turning the army sprite visible. Normal/joint survivor redraw `0x24BAA` calls `0x24466`, so surviving jungle sprites become concealed again. The ambush routine clears0x80 on the ambusher but preserves preexisting concealment0x10. Moving transfers the low occupancy bits through `0x23866`, clears the old cell to fire-only, then redraws at the destination; jungle redraw hides again.

The remaster's `visibleUnit` defaults to `b.side`. If UI code uses that default while the AI is active, it sees the active AI's own units as friendly and displays their jungle positions. A fixed human observer perspective must govern renderer, HUD, hit testing and movement/selection overlays, with temporary combat markers separately managed. Engine AI querying its own side remains legitimate. The native does not establish the remaster's permanent reveal-after-attack list; action-specific concealment cases should validate persistent state versus temporary animation.

Named regression cases: `V53-04-HUMAN-ATTACKER-AI-JUNGLE-TURN`, `V53-04-HUMAN-DEFENDER-AI-JUNGLE-TURN`, `V53-04-HIDDEN-HUD-HITTEST`, `V53-04-JUNGLE-MOVE-REHIDE`, `V53-04-COMBAT-FLASH-DOES-NOT-PERSIST`.

#### Forced movement auto-ambush (#5)

Both the native human pull routine `0x25998` and AI pull routine `0x2D432` relocate the hostile unit into the puller's vacated hex, preserve that hostile unit's mobility, then compute direction from the hostile's old hex to its new hex using `0x24E00`. They call automatic ambush routine `0x24938`, passing the puller pointer as skip. The native three-cell forward arc and hostile jungle predicate therefore apply to the displaced enemy too. A successful forced move onto fire applies mode1 ignition damage before ambush and exits if that damage kills the unit.

Six witnesses exercise human/AI pull, zero/one/two forward jungle ambushers. They retain original eligibility, relocation, direction, skip-puller, forward arc and jungle eligibility; only RNG, drawing and ambush casualty body are hooked. The moved unit is attacked once per qualifying jungle unit. Current remaster `pullEnemy` changes position, resets reveal state and returns without calling `ambush` or applying burning-tile entry damage. This is a mechanics omission, not animation-only.

Named regression cases: `V53-05-HUMAN-PULL-ONE-AMBUSH`, `V53-05-AI-PULL-TWO-AMBUSHES`, `V53-05-PULL-ALL-DIRECTIONS-PARITIES`, `V53-05-PULL-OUTSIDE-ARC-NO-AMBUSH`, `V53-05-PULL-FIRE-ENTRY-THEN-AMBUSH`, `V53-05-PULLER-SKIPPED`.

#### Why the previous audits missed #4 and #5 (#6)

The earlier forced-movement witnesses in `verify-native-tactical-v49.py` replaced `0x24938` with a zero-return hook. They proved displacement and MP behavior while suppressing exactly the post-movement ambush branch reported here. No integrated native-to-remaster witness tested that consequence.

The earlier jungle witness proved that the native draw branch sets concealment bits, but did not exercise the remaster's renderer/HUD while `b.side` changes to the AI under a human observer. The missing cross-layer test let the UI use the AI's own visibility perspective. Bounded arithmetic and branch checks alone cannot establish full battle fidelity. Native witness limits should list every bypassed consequential branch and link to an integration regression or a pending test design.

#### Reburning already-burning occupied hex (#7)

Native ignition `0x266BC` unconditionally ORs fire0x20 and calls occupied-unit fire damage `0x24752` with mode1; there is no prior-fire test. Thus each successful hostile fireball re-applies ignition damage even if already burning. Ten witnesses cover initial/repeated fire at99/100/101/1000/9999 soldiers. Below100 soldiers the native immediately invokes fire death. Otherwise damage is a uniform integer in `0..floor(5*men/100)-1`, and equipment is deducted proportionally by the shared helper. This differs from post-order mode0 fire's30% loss bound. The remaster already reapplies mode1 casualties on successful reburn; preserving that behavior is necessary.

However the current remaster success probability differs from native. Native `0x24B2C` uses terrain-specific fire chances from DS:B36E: plain80, jungle90, hill70, mountain60, water0, castle50, palace20. Except water, add a random integer0..9. Rain always fails; sunny/fewclouds/cloudy have no separate probability multiplier in this branch. For occupied hexes, use:

`chance = min(100, floor((101 - target.INT) * terrainChance / 100) + floor(randomInteger(0 .. max(0, actor.INT-target.INT)-1) / 2))`

The zero-range random helper returns0. A second integer draw0..99 must be strictly less than chance. On unoccupied hexes the terrain chance is used directly (values are below100). 84 unchanged native equation witnesses cover7 terrain types,3 attacker/targetINT pairs and4 weathers. Current `.25 + actorINT/150` multiplied by weather is not that equation. Original mechanism/equation claim requires correcting targetINT and terrain handling too.

Named regression cases: `V53-07-REBURN-REPEATS-IGNITION`, `V53-07-REBURN-USES-REMAINING-MEN`, `V53-07-SUB100-FIRE-DEATH`, `V53-07-IGNITION-NOT-POSTORDER-30PERCENT`, `V53-07-TERRAIN-TARGET-INT-CHANCE`, `V53-07-RAIN-NO-IGNITION`.

#### Evidence limitations / pending designs

- Full native AI target ordering/strategic commander-risk policy is not reproduced by the16 priority witnesses. Extend the witness to run unhooked `0x2C166/0x27D1E` with varied occupied targets, army strengths and strategic state; retain user-observation tests separately.
- Full DOS screen capture after all9 battle orders is not available. Build deterministic human-observer integration cases for each order/animation transition and optionally compare emulator captures.
- Forced movement death/capture and weapon deduction are hooked in this bounded witness. Engine regressions must independently verify both fire and ambush equipment loss, fire death suppressing subsequent ambush, and unchanged forced-target mobility.
- Native fire chance was directly executed; this report does not certify unrelated wind-spread, extinguishing, weather-transition or AI fire target-choice rules.



<a id="record-fixes-v52-html"></a>
## fixes-v52.html

Historical record from [`docs/fixes-v52.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v52.html), original Git blob `d33ddb11b4c24731c045f3b2d0b655bbe3380cf4`. Later records take precedence where findings changed.

[Play RTK2 Remastered](../)


### RTK2 Remastered v52 — music, battle sound and daily orders

Governance and battlefield music use the original remaster recordings again, including the remaster victory fanfare. The extracted DOS music remains archived in the complete project.


| Report | Correction | 

| Governance music | Restored `assets/music/council-music.mp3`. Province changes keep that loop playing. | 

| Battlefield music | Restored `assets/music/battle-music-v17.mp3`; results use `assets/music/triumph-music.mp3`. | 

| Intermittent battle effects | A resolved attack plays its cue even if no animation is queued. The renderer catches up skipped cue boundaries, including Charge exchanges, and pauses cues under HUD. A shared Web Audio session caches effects and resumes from player input; HTML audio remains a fallback. Failed playback is reported instead of silently discarded. Combat volume is raised from 0.32 to 0.55 so attacks are clearer under the battle music. | 

| Human commander missing a turn | Being a simultaneous target, supporting another general, or automatically ambushing no longer spends that unit&#x27;s own daily order. The initiating general still uses one own order. | 

| Prior non-attack helper missing from simultaneous attack | This was a mechanics bug, not just a missing animation. All living friendly units adjacent to the target can support the attack, including units that already moved, waited or used Fireball. Damage, per-unit loss rows and sequential animations include them. Supporting preserves their prior own-order status; it does not give them an additional own order. | 


#### Why the previous interpretation was wrong

The earlier v50 audit interpreted cell bit 128 as a daily-order record. The original game&#x27;s human controller actually activates a linked list of officers and uses a separate initiating-command completion byte. The cell bit is also altered by jungle drawing and concealment. Clearing it during combat does not remove helpers, victims or ambushers from their own later activation.

**32 new bounded original-executable witnesses pass**, including full simultaneous eligibility, actual linked-list controller activation, sixteen post-simultaneous follow-ups and two post-ambush follow-ups. They supersede the earlier helper/target/ambusher readiness claims. See [native findings](changes.md#record-native-turn-audit-v52) and [witness results](native-turn-witness-v52.json).


#### Validation and limits

Focused checks cover Move/Wait/Fireball helpers, helper damage and animation, commander movement after an enemy simultaneous attack, automatic ambush, both first-side orders, restored music, shared audio decoding, silent animation omissions, duplicate prevention and late-audio cancellation. Mounted interface checks exercise every simultaneous participant&#x27;s sounds and losses, prior-order support, HUD pause, Fireball audio, and Charge with throttled rendering frames.

Run `npm test` and `npm run test:ui`. The [verification record](verification-v52.json) contains final results. Original-executable tests are bounded witnesses rather than a complete DOS playthrough. Physical browser/phone appearance and listening quality remain unverified.

**No AI training or renewal ran.** Older profiles retain their original rules identity and fall back to Legacy when incompatible. Original DOS reference binaries remain outside the repository and release package. All earlier completed UI, artwork and campaign changes are retained.


<a id="record-fixes-v52"></a>
## fixes-v52.md

Historical record from [`docs/fixes-v52.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v52.md), original Git blob `6fdb4d3d9969c282890083b44a53ba56049c1de3`. Later records take precedence where findings changed.

### RTK2 Remastered v52 — music, battle sound and daily orders

Governance and battlefield music use the original remaster recordings again, including the remaster victory fanfare. The extracted DOS music remains archived in the complete project.

| Report | Correction |
|---|---|
| Governance music | Restored `assets/music/council-music.mp3`. Province changes keep that loop playing. |
| Battlefield music | Restored `assets/music/battle-music-v17.mp3`; results use `assets/music/triumph-music.mp3`. |
| Intermittent battle effects | A resolved attack plays its cue even if no animation is queued. The renderer catches up skipped cue boundaries, including Charge exchanges, and pauses cues under HUD. A shared Web Audio session caches effects and resumes from player input; HTML audio remains a fallback. Failed playback is reported instead of silently discarded. Combat volume is raised from 0.32 to 0.55 so attacks are clearer under the battle music. |
| Human commander missing a turn | Being a simultaneous target, supporting another general, or automatically ambushing no longer spends that unit's own daily order. The initiating general still uses one own order. |
| Prior non-attack helper missing from simultaneous attack | This was a mechanics bug, not just a missing animation. All living friendly units adjacent to the target can support the attack, including units that already moved, waited or used Fireball. Damage, per-unit loss rows and sequential animations include them. Supporting preserves their prior own-order status; it does not give them an additional own order. |

#### Why the previous interpretation was wrong

The earlier v50 audit interpreted cell bit 128 as a daily-order record. The original game's human controller actually activates a linked list of officers and uses a separate initiating-command completion byte. The cell bit is also altered by jungle drawing and concealment. Clearing it during combat does not remove helpers, victims or ambushers from their own later activation.

**32 new bounded original-executable witnesses pass**, including full simultaneous eligibility, actual linked-list controller activation, sixteen post-simultaneous follow-ups and two post-ambush follow-ups. They supersede the earlier helper/target/ambusher readiness claims. See [native findings](changes.md#record-native-turn-audit-v52) and [witness results](native-turn-witness-v52.json).

#### Validation and limits

Focused checks cover Move/Wait/Fireball helpers, helper damage and animation, commander movement after an enemy simultaneous attack, automatic ambush, both first-side orders, restored music, shared audio decoding, silent animation omissions, duplicate prevention and late-audio cancellation. Mounted interface checks exercise every simultaneous participant's sounds and losses, prior-order support, HUD pause, Fireball audio, and Charge with throttled rendering frames.

Run `npm test` and `npm run test:ui`. The [verification record](verification-v52.json) contains final results. Original-executable tests are bounded witnesses rather than a complete DOS playthrough. Physical browser/phone appearance and listening quality remain unverified.

**No AI training or renewal ran.** Older profiles retain their original rules identity and fall back to Legacy when incompatible. Original DOS reference binaries remain outside the repository and release package. All earlier completed UI, artwork and campaign changes are retained.



<a id="record-native-turn-audit-v52"></a>
## native-turn-audit-v52.md

Historical record from [`docs/native-turn-audit-v52.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-turn-audit-v52.md), original Git blob `d87ac558de2630e9c4ca7677a4f225540b9a069a`. Later records take precedence where findings changed.

### Native simultaneous and daily orders audit

Verified against supplied English `main.exe` SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.

32 bounded witnesses pass. The project includes `tools/verify-native-turn-v52.py` and `docs/native-turn-witness-v52.json`. With Python Unicorn installed, reproduce using your private executable:

```sh
python tools/verify-native-turn-v52.py /private/main.exe /tmp/native-turn-witness-v52.json
```

No original executable is included in the project.

#### Findings

1. The native simultaneous handler accepts all adjacent friendly helpers regardless of whether the helper cell bit 128 is set. It passes ZERO as the filter argument at `0x260B4`. The adjacency/ownership predicate `0x249DC` checks bit 128 only when its fourth argument is nonzero (`0x24A3A`–`0x24A5C`). Eight full-handler witnesses with helper flags 1/129 and enemy flags 4/132/20/148 retain original geometry, ownership, unit lookup and eligibility. Every case performs two combat exchanges with factor 2 and two animation calls.
2. The original human controller `0x226A0` activates each linked officer once. It saves the next unit at `0x226C7`–`0x226C9`, performs native mobility activation `0x24A6E`, and advances to that saved next unit when the initiating command-completed byte `DS:B8E2` is set (`0x22730`–`0x22746`). Neither the helper nor the opposing target is removed from that sequence by simultaneous cell-flag clearing. Six controller witnesses cover cell flags 1/129/4/132/20/148 and activate both linked units; sixteen additional witnesses preserve actual simultaneous-result DS memory and then prove each helper or target receives its subsequent own activation.
3. The ambush routine clears cell bit 128 at `0x2484F`, but this does not spend the ambusher's later own daily order. Two witnesses execute native ambush for mover INT89 and INT90, preserve the resulting DS memory, then execute the original human controller. Both activate the ambusher normally. Their mobility is unchanged by the ambush.
4. Cell bit 128 cannot be interpreted as a permanent daily-order record. The native jungle drawing branch `0x244B5` ORs `0x90` into the cell and normal combat/ambush clear bit128. The native daily own-order controller is a separate linked-list mechanism driven by initiating command completion; the prior v50 report projected this presentation/concealment flag into `ordered` and `orderDay`, which created skipped turns.

#### Corrections proposed

- `jointAttackers`: include every living, placed friendly unit adjacent to target, including units that already moved, waited or completed another own order.
- The simultaneous initiator spends their own daily order through the existing finalization path. Helpers retain whatever own `ordered/orderDay` state they had before assistance. They can help more than once if later simultaneous orders reach their tile.
- Remove `friend.ordered=true;friend.orderDay=b.day` from simultaneous exchanges; keep ordinary attack initiator finalization.
- Remove `target.ordered=true;target.orderDay=b.day` from simultaneous completion.
- Remove `hidden.ordered=true;hidden.orderDay=b.day` from automatic ambush. Preserve casualty, reveal, event and animation behavior.
- Update error/advice text from "two ready friendly units" to "two adjacent friendly units" while retaining the requirement that the initiating unit still has its own order available.
- Replace old tests/docs asserting target/helper/ambusher own-order consumption; add regression coverage for prior Move/Wait helpers, helper-before-own-order, opposing commander attacked before their army turn, automatic ambush before own army turn, and both first-side orderings across day advancement.

#### Limits

These are bounded original-code witnesses, not a full DOS playthrough. Rendering, input and arithmetic/outcome hooks keep execution finite. Full simultaneous witnesses retain native participation decisions; human-controller witnesses retain native activation and linked-list order. The exact semantic name of cell bit128 is intentionally not asserted beyond verified concealment/rendering usage and independence from the own-order controller.



<a id="record-fixes-v50-html"></a>
## fixes-v50.html

Historical record from [`docs/fixes-v50.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v50.html), original Git blob `a1e07ddf83e2c6a0abfb7beeb08033cddbfa47a0`. Later records take precedence where findings changed.

**Superseded readiness interpretation:** [v52 restores remaster music and corrects helper, target and ambusher own orders.](changes.md#record-fixes-v52-html)

[Play RTK2 Remastered](../) · [AI training manual](ai-training-manual.html)


### RTK2 Remastered v50 — native rules, audio and War controls

Released 12 October 2026 (Asia/Kuala_Lumpur). Existing artwork, campaign features, portrait choices and earlier fixes are retained.


| Request | Result | 

| War governor choice | The replacement governor is selected from real officer portrait cards. The empty “Choose a governor” placeholder is a prompt, not a button. March remains unavailable until a required replacement is chosen. | 

| Redundant order buttons | Audited the shared choice-card builder and staged order flows. Empty placeholders no longer generate selectable cards. Break alliance appears only for an allied invasion target. Existing Back, Cancel and final confirmations retain their distinct purposes. This is not a claim that every possible UI sequence was visually inspected. | 

| Governance audio | Human orders and spectator AI council reports use order-specific cues. Monthly and historical events use the recovered native event mappings where established. Council music uses the original regional songs rendered through the supplied FM driver. | 

| Battlefield audio | Resolved human and AI actions share one observer. Combat audio follows animation cycles and separate ambushes. Charge sounds once per actual exchange; inspection and deployment do not replay an old combat cue. Native regional battlefield and victory/defeat tracks replace the earlier remaster themes; independent sound/music preferences remain available. | 

| Every original effect | All 16 dispatch entries, their native sequences/patches, known callers, and the music selector&#x27;s 21 accepted IDs are catalogued. The supplied FM driver renders all 21 embedded songs and all 16 effect patches. All 37 MP3s pass decoding, non-silence and complete-duration checks. Effect 15&#x27;s gameplay caller, exact full FM loop endpoints and original-hardware waveform equality remain unresolved; see the driver-backed report. | 

| Simultaneous losses | The report includes the initiating unit, every supporting unit and the defending target. Playback gives each participant a separate readable loss message; the saved battle record retains the complete result. | 

| Ambush animation | Each resolved ambush records both ambusher and victim. They receive separate eight-flash sequences, without applying additional casualties or randomness. The ambusher&#x27;s daily order is spent, with mobility unchanged, including when the victim anticipates the ambush. | 

| Jungle simultaneous attack | The original full handler permits jungle targets, including concealed ones. The mistaken restriction is removed. Select a suspected adjacent jungle hex with two ready friendly units; attacks at vacated positions miss. All participants’ loss reports and animations are retained. | 

| Retreat | Native local withdrawal checks precede ordinary AI attack/palace choices: very small forces and locally overwhelmed units may flee. A commander&#x27;s flight uses the existing whole-army withdrawal and capture resolver. Fire escape/stranded-fire behavior is included where witnessed. Hidden jungle positions are excluded from AI threat counts. | 

| Governor self reward | The premise does not match the supplied executable. Its full Reward command permits a provincial governor to reward themselves using Gold, Horse or Writings, without the ruler present. The governor spends their monthly action. Only the ruler is excluded as a recipient. Existing matching behaviour is retained. | 

| Horse reward advice | Removed the incorrect claim that a reward horse grants personal mounted mobility. It consumes province horse stock and raises loyalty. | 


#### Additional defects found and corrected

The complete native simultaneous handler accepts jungle targets with two adjacent attackers. The resumed release restores that feature after clarification: the earlier prohibition was a misunderstanding. Hidden movement remains concealed, so a suspected hex can be empty.

Normal attacks previously used five animation cycles; the native shared renderer repeats eight alternating flashes. Simultaneous attacks now flash each actual attacker/target pair in sequence, and Charge repeats eight flashes per actual resolved exchange (1–10), maintaining the existing march, overlap, landing and return presentation. Browser timing is a remaster choice; it is not an emulated DOS frame clock.

Simultaneous supporting officers spend an order only when they actually strike; unused helpers retain readiness when the target is defeated early. A target surviving the completed native simultaneous sequence also loses readiness. These rules are recorded in the native combat witness report.

The newly exercised retreat paths exposed a deferred-settlement checkpoint edge case. Retreat reservations must be checked against the correct active or suspended war, and retained until settlement. Details and regression coverage are in the combat note.


#### Remaining known differences and verification limits


- Native AI receives an additional Gold/Horse loyalty bonus of 1 through difficulty, beyond the ordinary human reward gain. The remaster still uses the human gain. This evidenced difference is documented rather than changing AI economics in this release.

- Native deployment uses priorities different from the remaster’s closest-palace policy (see native-turns-v43.md). The full native strategic whole-army withdrawal flags, path field and all tactics have not been reconstructed. The tested local retreat rules do not establish complete native AI parity.

- Native AI can inspect adjacent concealed jungle occupancy. The remaster deliberately retains the v49 human/AI visibility rule, so hidden movement cannot influence route planning or retreat threat counts.

- Abstract battles and expanded family options remain documented remaster systems. Governance conquest training keeps detailed battlefield orders disabled.

- The supplied executable witnesses run bounded unchanged instruction paths with controlled presentation/random hooks; they are not complete DOS gameplay sessions.

- Interface checks use an emulated DOM and native Canvas. Physical browser/handset rendering and audible comparison remain unverified.


#### Archived training examples — no automatic renewal

No AI training was run during this resumed update. Training requires an explicit user instruction, even when game rules change. Existing v50 examples below were produced before this instruction and retain their original rules identity. They are now incompatible; imports are rejected and saved campaigns safely fall back to Legacy. The previous v50 compatibility runs were intentionally small. Governance holdout score difference was +0.105 on two cases. Battlefield had four draws across two independent positions, with no decisive win. The backward conquest run completed none of three cases within one month; it averaged 20 provinces versus Legacy’s 21.7. Its report records zero detailed battlefield actions. These results do not establish stronger AI or faster full conquest. Legacy remains default.


- [Governance profile](../config/ai-profiles/governance-v50.json) · [report](ai-training-v50-governance.json)

- [Battlefield profile](../config/ai-profiles/battlefield-v50.json) · [report](ai-training-v50-battlefield.json)

- [Backward conquest profile](../config/ai-profiles/governance-conquest-v50.json) · [report](ai-training-v50-conquest.json)


#### Evidence and repeatable checks

The resumed full engine suite passed 465 groups before final native-media integration. Eight final audio groups passed after that integration. Final presentation checks passed 4 groups, followed by 70 mounted interface checks and 7 layout checks. Native verification passed 72 audio checks, 29 Reward checks/cases and 60 bounded combat witnesses. All 37 driver-rendered MP3 files decoded, contained sound and matched captured duration within 30 ms.


- [Driver-backed audio extraction](native-opl-driver-v50.json) · [derived FM register traces](native-opl-register-traces-v50.zip)

- [Native audio catalogue](changes.md#record-native-audio-v50) · [machine-readable audio witnesses](native-audio-v50.json)

- [Native Reward evidence](changes.md#record-native-reward-v50) · [Reward witnesses](native-reward-v50.json)

- [Native combat evidence](changes.md#record-native-combat-v50) · [combat witnesses](native-combat-v50.json)

- [Verification results](verification-v50.json)

- [Training manual](ai-training-manual.html)


Run `npm test` and `npm run test:ui` from the project&#x27;s `rtk2` directory. The native verification tools require the user&#x27;s supplied original `main.exe` and Python Unicorn. Existing examples from v49 remain archived and will safely fall back to Legacy under the changed fingerprint; v50 examples also retain their earlier fingerprint and are incompatible with this corrected release. Request a new training run explicitly when desired. Small compatibility-training reports do not establish stronger AI or lightning-speed full conquest.


<a id="record-fixes-v50"></a>
## fixes-v50.md

Historical record from [`docs/fixes-v50.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v50.md), original Git blob `d2ac74bcd12660a474894a9418eb222a8461c1e8`. Later records take precedence where findings changed.

**Current v52 correction:** [v52 findings](changes.md#record-fixes-v52-html) restore remaster music and supersede earlier claims that simultaneous helpers/targets or automatic ambushers spend their own daily orders. The original cell flags are independent of the native own-order controller.

### RTK2 Remastered v50 — native rules, audio and War controls

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

#### Additional defects found and corrected

The complete native simultaneous handler accepts jungle targets with two adjacent attackers. The resumed release restores that feature after clarification: the earlier prohibition was a misunderstanding. Hidden movement remains concealed, so a suspected hex can be empty.

Normal attacks previously used five animation cycles; the native shared renderer repeats eight alternating flashes. Simultaneous attacks now flash each actual attacker/target pair in sequence, and Charge repeats eight flashes per actual resolved exchange (1–10), maintaining the existing march, overlap, landing and return presentation. Browser timing is a remaster choice; it is not an emulated DOS frame clock.

Simultaneous supporting officers spend an order only when they actually strike; unused helpers retain readiness when the target is defeated early. A target surviving the completed native simultaneous sequence also loses readiness. These rules are recorded in the native combat witness report.

The newly exercised retreat paths exposed a deferred-settlement checkpoint edge case. Retreat reservations must be checked against the correct active or suspended war, and retained until settlement. Details and regression coverage are in the combat note.

#### Remaining known differences and verification limits

- Native AI receives an additional Gold/Horse loyalty bonus of 1 through difficulty, beyond the ordinary human reward gain. The remaster still uses the human gain. This evidenced difference is documented rather than changing AI economics in this release.
- Native deployment uses priorities different from the remaster’s closest-palace policy (see native-turns-v43.md). The full native strategic whole-army withdrawal flags, path field and all tactics have not been reconstructed. The tested local retreat rules do not establish complete native AI parity.
- Native AI can inspect adjacent concealed jungle occupancy. The remaster deliberately retains the v49 human/AI visibility rule, so hidden movement cannot influence route planning or retreat threat counts.
- Abstract battles and expanded family options remain documented remaster systems. Governance conquest training keeps detailed battlefield orders disabled.
- The supplied executable witnesses run bounded unchanged instruction paths with controlled presentation/random hooks; they are not complete DOS gameplay sessions.
- Interface checks use an emulated DOM and native Canvas. Physical browser/handset rendering and audible comparison remain unverified.

#### Archived training examples — no automatic renewal

No AI training was run during this resumed update. Training requires an explicit user instruction, even when game rules change. Existing v50 examples below were produced before this instruction and retain their original rules identity. They are now incompatible; imports are rejected and saved campaigns safely fall back to Legacy. The previous v50 compatibility runs were intentionally small. Governance holdout score difference was +0.105 on two cases. Battlefield had four draws across two independent positions, with no decisive win. The backward conquest run completed none of three cases within one month; it averaged 20 provinces versus Legacy’s 21.7. Its report records zero detailed battlefield actions. These results do not establish stronger AI or faster full conquest. Legacy remains default.

- [Governance profile](../config/ai-profiles/governance-v50.json) · [report](ai-training-v50-governance.json)
- [Battlefield profile](../config/ai-profiles/battlefield-v50.json) · [report](ai-training-v50-battlefield.json)
- [Backward conquest profile](../config/ai-profiles/governance-conquest-v50.json) · [report](ai-training-v50-conquest.json)

#### Evidence and repeatable checks

The resumed full engine suite passed 465 groups before final native-media integration. Eight final audio groups passed after that integration. Final presentation checks passed 4 groups, followed by 70 mounted interface checks and 7 layout checks. Native verification passed 72 audio checks, 29 Reward checks/cases and 60 bounded combat witnesses. All 37 driver-rendered MP3 files decoded, contained sound and matched captured duration within 30 ms.

- [Driver-backed audio extraction](native-opl-driver-v50.json) · [derived FM register traces](native-opl-register-traces-v50.zip)
- [Native audio catalogue](changes.md#record-native-audio-v50) · [machine-readable audio witnesses](native-audio-v50.json)
- [Native Reward evidence](changes.md#record-native-reward-v50) · [Reward witnesses](native-reward-v50.json)
- [Native combat evidence](changes.md#record-native-combat-v50) · [combat witnesses](native-combat-v50.json)
- [Verification results](verification-v50.json)
- [Training manual](ai-training-manual.html)

Run `npm test` and `npm run test:ui` from the project's `rtk2` directory. The native verification tools require the user's supplied original `main.exe` and Python Unicorn. Existing examples from v49 remain archived and will safely fall back to Legacy under the changed fingerprint; v50 examples also retain their earlier fingerprint and are incompatible with this corrected release. Request a new training run explicitly when desired. Small compatibility-training reports do not establish stronger AI or lightning-speed full conquest.



<a id="record-native-audio-v50"></a>
## native-audio-v50.md

Historical record from [`docs/native-audio-v50.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-audio-v50.md), original Git blob `a157ca27a98a851a70fa81dd606a40493ab705e1`. Later records take precedence where findings changed.

**Current v52 correction:** [v52 findings](changes.md#record-fixes-v52-html) restore remaster music and supersede earlier claims that simultaneous helpers/targets or automatic ambushers spend their own daily orders. The original cell flags are independent of the native own-order controller.

### V50 native audio audit and playback

The supplied English `main.exe` contains **16 effect entries**. All 16 were catalogued and their original dispatch routines and pitch/wait sequences were executed with a controlled external-driver boundary. **72 native checks pass.** This establishes the table, sequences, mute/driver fallbacks and music selection protocol; it does not establish how the original synthesizer sounded.

Source SHA-256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.
Unpacked load-image SHA-256: `5c3e45a5edb097c8719d65b1678784aaf8412258e2437a26bb89d4b249824506` (246,400 bytes).

#### Original effect inventory

Offsets are in the unpacked load image. The native data segment starts at `0x2FA60`. The effect-pointer table is `DS:3930`; sixteen 22-byte driver patches start at `DS:3970`. `0x73A0` checks the sound/driver flags and dispatches the selected entry. Numeric IDs are the original zero-based IDs, not inferred names.

| ID | Entry | Verified call-site use | Remaster routing |
|---|---|---|---|
| 0 | `0x70A0` | Locust: `0xF463→0xEA9C` | Locust events |
| 1 | `0x70C6` | Epidemic: `0xF520→0xEA9C` | Epidemic events |
| 2 | `0x70EC` | Typhoon and flood: `0xF341`, `0xF3F9` | Both events intentionally share this cue |
| 3 | `0x7112` | Popular riot: `0xED85` | Popular riot events |
| 4 | `0x7138` | Meteor/evil omen: `0xD555` | Meteor events |
| 5 | `0x715E` | Officer rebellion: `0xE902` | Rebellion events |
| 6 | `0x7198` | Settlement: `0x215C5`, `0x22452` | Settlement events |
| 7 | `0x71FC` | Betrayal/field status: `0x25056`; captive prompt: `0xA286` | Betrayal events; generic status remains distinct from actual combat |
| 8 | `0x7212` | Personal-combat result: `0x289E0` | Resolved personal-combat action |
| 9 | `0x7228` | Reinforcement arrival/request/return: `0x29D9C` callers print `DS:C166`, `C18B`, `C1AB`, `C1CF` | Reinforce orders and arrival messages |
| 10 | `0x724E` | Input/wait opening: `0x58F3` | Catalogue and callable cue; existing UI selection sound retained |
| 11 | `0x7274` | Three-frame sprite animation: `0x13053` | Catalogue and callable cue; movement has a separate remaster march cue |
| 12 | `0x72AE` | Yellow Turban attack: `0x21A90`, text `DS:B00D` | Yellow Turban reports |
| 13 | `0x72D4` | Combat exchange: `0x250D7`, called within native attack animation | Normal, Charge, Simultaneous and each Ambush animation |
| 14 | `0x72FA` | Input/wait completion: `0x5976` | Catalogue and callable cue; UI completion has a separate remaster cue |
| 15 | `0x737A` | Entry and sequence verified; no direct caller found in the static inventory | Callable only; gameplay meaning remains unresolved |

The evidence file [native-audio-v50.json](native-audio-v50.json) contains each patch's hash, every captured pitch/stop/wait command, the driver protocol and static far-call candidates. Static byte candidates are an inventory, not proof that every candidate is reachable code. Labels use surrounding native text and routines; no unsupported label is assigned to ID 15.

#### Supplied-driver recovery and remaining limits

The executable checks for an external **`OPLDRV`** driver (`DS:342A`). Music selection at `0x6F46` accepts IDs **0–20** and sends the driver a one-based song number. Province-dependent governance selection occurs at `0x599A`/`0x1B4AC` using `DS:3C4E`; battlefield selection at `0x59B4` adds five. Control, status, playback setting and transition wrappers are also identified.

The resumed update supplied `fmdrv.com`, which is the original **OPL-II Sound Driver Version 3.10** with the `OPLDRV` signature. Contrary to the earlier missing-song assumption, all 21 song streams are embedded in `main.exe` at `2DB9:0002` (`0x2DB92`); initialization at `0x69F0` passes that address to interrupt 66 command 0. The additional GRP/HEX/PACK data and launcher files are not required for these songs.

All **21 songs and 16 effects** were captured through the actual supplied driver: **169,674 YM3812 register writes**, using the native `1193182/4096 Hz` timer. Nuked-OPL3 renders them in OPL2 compatibility mode to 44.1 kHz mono MP3s. Gain adjustment and an 8 ms file-edge ramp make the exports usable in the browser; register values remain unchanged. The previous synthesized `native-effect-*` assets have been replaced with driver-rendered versions.

The original 72 checks above remain a **mocked driver-boundary audit**, not waveform verification. The separate [driver-backed evidence](native-opl-driver-v50.json) records all 37 MP3 hashes, durations, peaks and RMS levels. All 37 decode, contain audio, and match their captured durations within 30 ms. A truncated track was detected and re-encoded before publication; the reproduction renderer now checks a temporary encode before replacing a final asset.

Governance uses region IDs `[6,6,6,2,2,2,2,5,2,2,4,4,3,5]`; battlefield adds five. Native result tracks 15/16 play for victory/defeat from the active human participant's perspective, or the attacker's perspective when spectating. Dynasty destruction uses 14. All other recovered song IDs are included, but unknown call contexts are not guessed. `OPEN.EXE` was not supplied, so a native opening-screen song is not asserted.

Some songs stop naturally; others export until repeated melodic-channel state or a 180-second limit. Those are **playback windows**, not proven exact full FM loop endpoints. Browser council/battle playback repeats the exported window. The original effect 15's gameplay caller is still unresolved, although its patch and audio were recovered. Original hardware waveform identity, subjective listening quality and physical-phone playback remain unverified. Raw DOS reference files remain outside source, deployment and download packages.

#### Linkage corrections

The previous province-order flow executed orders without notifying the audio bus. It now calls `playOrder` only after successful execution. Training, hiring, trade, recruitment, movement and diplomacy receive distinct semantic cues; other successfully executed orders receive the completion cue. AI governance reports route from the same event mapper. Previews and failed orders do not trigger execution sounds.

Human, spectator AI and HUD single-step battle orders all pass through the same resolved-message observer. Its event-serial check avoids replaying an old attack when View, deployment confirmation/reset or End has not changed `lastAction`. Detailed combat sounds instead come from the renderer's animation callback: every queued ambush receives its own cue. Charge sounds once per actual exchange, rather than once per small flash. The audio observer never applies casualties, modifies rules or draws randomness.

Sound effects and music remain independent. Hiding the page stops all active effects and music; returning resumes the applicable background theme and a courier loop only if the courier is currently moving. Fast effects are bounded to eight overlapping bursts and never displace the courier loop. Exiting stops everything.

#### Reproduction and validation

The complete project includes the derived [register traces](native-opl-register-traces-v50.zip) and the renderer source with its LGPL-2.1-or-later licence under `tools/native-opl/`. No original executable, COM or DAT is included.

To reproduce audio from the supplied private originals, install Python Unicorn and NumPy and have a C compiler plus ffmpeg available:

```sh
python tools/extract-native-opl-v50.py /private/main.exe /private/fmdrv.com /tmp/native-capture
cc -O2 tools/native-opl/render.c tools/native-opl/opl3.c -o /tmp/native-opl-render
python tools/native-opl/render.py /tmp/native-capture /tmp/native-opl-render
node tests/audio-v50-tests.mjs
```

Alternatively unzip the derived register archive into `/tmp/native-capture` and run only the compiler/render steps; no DOS originals are needed for that route. The archived `build-native-audio-v50.py` synthesized fallback generator is not the source of the released native assets.

The eight audio regression groups cover every effect and song asset, native region/result routing, successful governance order sounds, event mappings, duplicate suppression, charge/ambush playback, separate mute controls, visibility cleanup, complete-duration/non-silent media evidence and asset hashes. Mounted UI tests also exercise a concealed-jungle simultaneous attack, its participant animations and every loss message.



<a id="record-native-combat-v50"></a>
## native-combat-v50.md

Historical record from [`docs/native-combat-v50.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-combat-v50.md), original Git blob `e11d36316a3a7af9e448ff8140010bb6f25a273a`. Later records take precedence where findings changed.

**Current v52 correction:** [v52 findings](changes.md#record-fixes-v52-html) restore remaster music and supersede earlier claims that simultaneous helpers/targets or automatic ambushers spend their own daily orders. The original cell flags are independent of the native own-order controller.

### Native combat audit — v50

The supplied English `main.exe` has SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are offsets in its unpacked load image. [native-combat-v50.json](native-combat-v50.json) records **60 executable bounded witnesses**; this count excludes static instruction inspection. The original executable is not distributed with the remaster.

#### Verified changes

| Mechanic | Original evidence | Remaster correction |
| --- | --- | --- |
| Simultaneous losses | `0x26072` calls the exchange routine for each participating unit, beginning with the initiating unit. | The result lists actual men lost by every participating general and the opposing general, including zero losses for unused helpers. |
| Simultaneous readiness | The completed native loop clears the target's ready bit. Attacker readiness is cleared when that attacker exchanges damage. | Completed simultaneous attacks spend the target's order too. Helpers that never strike retain their order. |
| Ambush readiness | `0x247C6` calls the flash renderer before resolving casualties, then clears the ambusher's ready bit at `0x2484F`. This also occurs when mover INT ≥90 prevents losses. Its mobility remains unchanged. | Ambush consumes the ambusher's daily order and retains MP. Structured message metadata preserves attacker and victim snapshots for animation, even when the victim is captured. |
| Repeated ambush | `0x24938` calls ambush for enemy jungle occupancy with flags 4 and132 alike. Its actual geometry, lookup, occupancy and ownership code execute in both witnesses. | An already-ordered enemy in the forward jungle arc can still ambush another entering unit. |
| Combat animation | Shared renderer `0x250F8` runs eight source/target cycles. `0x250AE` redraws each tile twice: source, source, target, target. Simultaneous and Charge call this renderer per actual combat exchange. | Normal and Ambush use eight alternating cycles. Simultaneous and Charge use eight cycles per actual exchange; visual playback never rolls combat damage again. |
| Local AI flight | `0x2B18A`/`0x2AB5E` contain low-men, adjacent-threat and trapped-fire withdrawal branches. The previous remaster policy never selected voluntary Flee. | Legacy and trained AI now choose voluntary flight on both army sides using the recovered local tests and existing escape/commander withdrawal settlement. |

The low-men branch withdraws attackers below 100 men; defenders below 100 use a 50% chance. The adjacent-threat branch requires men below `adjacent hostile count × (800 for commander, 500 otherwise)` and at least one adjacent hostile unit with more than three times the actor's men. A unit below 3000 men on fire can withdraw if it has no affordable dry neighbouring escape. The native province-exit check gates flight before these tests.

The remaster uses visible opponents for local threat assessment, preserving the intentional v49 restriction against AI knowledge of concealed locations. A commander withdraws through the existing whole-army Flee path; every remaining officer needs a legal retreat destination.

#### Jungle simultaneous attacks: requested difference

The original does **not** support the claimed blanket prohibition. The human dispatcher `0x265AE` accepts mode 2 against an occupied jungle tile and calls `0x26072`. Four additional witnesses execute the full simultaneous handler's original eligibility, geometry, lookup, occupancy and ownership predicates with two distinct attackers. Both Plain 0 and Jungle 1 targets, with revealed flags 132 and concealed flags 148, reach **two actual calls** to the combat exchange helper, each with factor 2. Each participant first receives its own call to the eight-cycle flash renderer; the recorded sequence is initiating attacker→target, then helper→target. Only rendering and exchange arithmetic are intercepted in these four cases.

The resumed v50 removes the mistaken jungle prohibition. Human, Legacy and planner legality accept simultaneous attacks into jungle. Human players can select a suspected adjacent jungle hex with two ready friendly units; concealed occupancy is resolved only after the order. A remembered hex can be attacked jointly, but moving to another concealed hex does not update the opponent’s memory. An empty suspected hex misses and spends the initiator’s order. Direct hidden-unit IDs remain unavailable, preserving the existing v49 visibility policy.

#### Retreat reservations

Enabling voluntary AI flight exposed a deferred-settlement defect: an officer could reserve a friendly retreat province, a different suspended war could capture it, and the first war's saved retreat became invalid. Ongoing-war guards now include recorded retreat destinations across invasion, movement, delegated and trained governance choices, rebellion events and subsequent flight destinations. Opposing owners cannot reuse a reserved destination; its recorded owner can.

This protects the remaster's existing deferred officer settlement. It does not establish the original DOS settlement timing. Six scenarios, each run for 6000 AI actions with strict checkpoints, pass after this correction.

#### Remaining differences and evidence limits

These witnesses establish the listed branches, not complete battlefield parity. Native strategic whole-army withdrawal decisions involving food and army-status flags (`0x279B6`, DS `0xB8D0`/`0xCAE7`) remain incompletely reconstructed. The local Flee implementation does not claim to reproduce those strategic decisions. Original advanced deployment priorities, compulsory post-defeat retreat integration, AI bribe choices and broader AI ordering remain separate audit work. Existing combat coefficient and capture witnesses retain their previously documented bounds.

The verifier uses controlled input, rendering, RNG and selected army-status hooks. Local threat witnesses use controlled adjacency/lookup; the new full jungle-handler and repeated-ambush witnesses retain those original predicates. No complete DOS playthrough or audible/device rendering check is implied.

#### Reproduction

From `dist/rtk2`, with optional Python `unicorn` installed:

```sh
python tools/verify-native-combat-v50.py /path/to/main.exe /tmp/native-combat-v50.json
node tests/v50-battle-tests.mjs
node tests/battle-tests.mjs
node tests/v48-tests.mjs
node tests/v49-tests.mjs
node tests/strategy-tests.mjs
```

The focused v50 suite covers named loss rows, initiator ordering and unused helper readiness, visible/concealed jungle attacks, insufficient-support rejection and vacated-hex misses, all 32 recorded local flight inputs, hidden threat fairness, flight on both sides, mutation-free trained previews, trapped fire and cross-war destination reservation. The bounded native witness breakdown is 2 ambush readiness, 2 repeated-ambush trigger, 1 flash sequence, 32 local flight, 1 simultaneous readiness, 16 fire/exit gates, 2 human simultaneous dispatch and 4 full simultaneous handlers.



<a id="record-native-reward-v50"></a>
## native-reward-v50.md

Historical record from [`docs/native-reward-v50.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-reward-v50.md), original Git blob `7d630b983cea042369a6f2c62507f764543a9dc2`. Later records take precedence where findings changed.

### Native Reward audit — v50

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

#### Verification

`tools/verify-native-reward-v50.py` verifies the packed input SHA-256, unpacks it and runs the unchanged native instruction paths with Unicorn. Officer menu choices, confirmations, presentation and random draws are bounded hooks; they do not alter gold, horses, loyalty, INT, or action flags. The native list builder, governor eligibility check, gain arithmetic, stock deductions and action-mark helper run unmodified. The AI opportunity test is controlled to select a reward; recipient selection and gain run unmodified.

Result: **5 byte checks, 6 recipient-list cases, 6 complete human reward cases and 12 complete AI reward cases**. Output is in `native-reward-v50.json`.

`tests/v50-governance-tests.mjs` adds **6 remaster regression groups** covering self reward, absence of the ruler, all three reward kinds, monthly action limits, acted/recovering recipients, unavailable governors, ruler exclusion, atomic rejected orders, and the absence of invented personal horse equipment.

These are bounded executable witnesses, not a complete DOS gameplay session. They do not establish that every governance or AI rule matches the original.



<a id="record-fixes-v49-html"></a>
## fixes-v49.html

Historical record from [`docs/fixes-v49.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v49.html), original Git blob `f9d3a9706128cce862a60b0c3b7c3ca7a1fa47b3`. Later records take precedence where findings changed.

[Return to game](../index.html)[AI training manual](ai-training-manual.html)[Markdown source](changes.md#record-fixes-v49)


### Version 49 fixes and verified rules


11 October 2026 · Romance of the Three Kingdoms II


This update addresses the twelve reported issues and retains the earlier mobile layout, Governor label, ownership colours, timed spectator triumphs, governance-only playback, ambush and charge animation fixes. Legacy AI remains the default. Previous saved campaigns remain supported; incompatible optional AI profiles fall back to Legacy until a current profile is imported.


#### 1. Advice uses numbers and explains their meaning


“Enemy loyalty is strong” and “Our officers are dependable” have been removed. Council advice now identifies the actual officer and loyalty score, explains how much remains before 100, and describes recruitment risk without implying that loyalty alone guarantees success or failure. Recruitment and intelligence advice point to the order&#x27;s estimated chance. Envoy ability, relationships, trust and protection can also affect eligibility or success.


Council text refreshes when circumstances change. Asking again does not reroll the monthly adviser-availability gate. Scouting alone does not lower loyalty; covert infiltration can affect it through its separate upkeep mechanics. War advice treats a numerical army advantage as an estimate rather than a guaranteed victory.


#### 2. What happens to invasion supplies?


The remaining attacker and defender field gold and food are deposited in the **battlefield province**, regardless of which side wins. A successful attacker therefore receives those remaining supplies in the conquered province. A defeated attacker does **not** get those field supplies refunded to the province it marched from. Provincial caps remain 30,000 gold and 3,000,000 food.


Surviving or captured generals retain their remaining soldiers, training and weapons according to their final fate and destination; these belong to the generals rather than a separate provincial weapons bank. Winning officers also receive the existing two-point training gain, based on their actual field training. Escaping generals carry their surviving troops and equipment, not a share of the army&#x27;s food and gold.


Native evidence: settlement is called unconditionally at `0x08BC1`, and `0x0907C` adds both field stores to the battlefield province. Flight at `0x25670` does not refund them. The remaster&#x27;s existing allied contingent refund and optional thank-you decision remain; the post-battle thank-you now draws from the supplies landed at the battlefield province.


#### 3. Portrait rules and custom choices


All 352 canonical officer identities have distinct portrait assignments and distinct rendered portrait crops. The rule uses canonical starting attributes, so training, books and temporary edits do not change a person&#x27;s face.


| Starting attributes | Portrait direction | 


| Only WAR exceeds 80 | Military attire: 武官 | 

| INT or CHARM exceeds 80, while WAR does not | Scholar or court attire: 文官 | 

| WAR and another attribute exceed 80 | Commander combining military and court cues | 

| No attribute exceeds 80 | An ordinary officer, with the strongest ability guiding attire where possible | 

| A recognisable historical identity | Its established historical appearance takes priority | 


Historical exceptions preserve Liu Bei&#x27;s ruler appearance, Zhao Yun&#x27;s white military look, and the established identities of Zhang Fei, Guan Yu, Cao Cao, Dong Zhuo, Ma Chao, Sun Jian, Sun Ce and Sun Quan. Tai Shi Ci receives an armoured archer portrait and Cao Pi a young court-ruler portrait. Face uniqueness takes priority over reusing one generic face for everyone in the same ability class. The minimal role remapping changes 74 non-iconic assignments rather than changing every existing face.


Create custom ruler offers **four male and four female portraits**. The choice persists in saves. The companion has a separate portrait, and naming a custom ruler after Cao Cao or another historical officer does not borrow that historical face. The ruler-selection silhouette tile and its location remain as requested.


#### 4. Alphabetical lists


Officer choice cards now sort A–Z by their English names. Recruit&#x27;s All, A–F, G–L, M–R and S–Z views retain that order. Its `#` view groups officers under their numbered province, sorts province groups alphabetically by province name, then sorts the officers within each group alphabetically. The province number is always shown.


The common choice renderer applies the same ordering to other officer and province lists, including movement, appointments and merchant selection. Province number display is a label choice, not a request for numerical sorting. Explicit **Data order**, which deliberately changes a province&#x27;s stored officer order, remains available.


#### 5. Give, Reward and other spending advice


Give advice now scans affordable amounts under the current actor and governor. It reports the maximum attainable popular loyalty and the **smallest food amount** achieving that capped result, rather than assuming one food. At popular loyalty 100 it advises spending nothing. The per-order food limit remains 10,000.


Gold Reward selects the recipient before the amount, then reports the cheapest amount attaining the best affordable loyalty result. The native gain uses the governor&#x27;s CHARM, with a random zero-or-one bonus, and a per-order limit of 100 gold. Advice distinguishes that range from a guaranteed gain and respects the cap of 100. A horse is offered as an alternative when available; Writings raise INT by one under their own eligibility rule and are not a loyalty reward. Fully loyal recipients are identified before money or horses are spent.


Cultivation and flood-control advice similarly report the best affordable capped improvement and smallest useful cost. Training advice excludes armies already at full training. Chance-based advice reports an estimate rather than promising success.


#### 6. Merchant weapons and interface


The original executable does **not** give an INT discount for weapon purchases. Both its human and AI buying branches use one gold per lot of 100 weapons. The maximum number of lots is:


`min(available gold, 100 − floor(current weapons / 100))`


Weapons cap at 10,000. The last partial lot still costs one gold: an officer with 9,999 weapons buys one additional weapon, not an impossible extra hundred. Different INT values produce the same native weapon price. Food trades retain their separate rice-price rule.


The merchant interface is retained: choosing the acting general, choosing the transaction and recipient, adjusting the amount while seeing its cost and effect, then confirming is easier to inspect and correct with Back than the original sequence of modal prompts. It also makes clear which general spends the monthly action. The preview now shows the actual weapon increase, including a partial final lot.


#### 7. Jungle information is shared fairly


A hidden enemy moving to a different jungle does not update the AI&#x27;s knowledge. Both Legacy and trained policies receive visible enemies and previously observed positions. A blind attack at the remembered jungle can miss if the enemy has left; the missed attempt still spends the order. Actual contact or combat can reveal the enemy. Merely standing adjacent does not reveal every jungle occupant.


This is an intentional fairness improvement: the native drawing routine conceals jungle units, but the native adjacent-attack selector can still read their actual occupancy. The remaster removes that native AI information advantage. It does not claim that the original executable already followed fair fog of war.


#### 8. Tile information and Charge


Tile information now compares the selected tile with its actual neighbouring passable terrains, including jungle, hill and water. It shows enemy-loss and counterattack coefficients, identifies the neighbours and explains how to read them, rather than always comparing with plain terrain. Unit power and random rolls still affect actual losses.


Normal attack and Charge use the **same per-exchange terrain and casualty equation**. Charge repeats that exchange one to ten times; it is not a separate flat terrain bonus. The native palace counterattack branch uses its own divisor. Existing charging march, overlap, repeated strike and return animations remain intact.


#### 9. Empty burning palace


An empty palace still matters. At the daily fire update, a palace that remains burning destroys **30% of the defender&#x27;s remaining field gold and food**, rounded down from the remaining 70%. This applies even without soldiers inside. Rain or extinction before that check prevents the loss. The native branch does not directly reduce provincial population, agriculture or a permanent palace statistic.


Native evidence: `0x22DFC` calls `0x22D76` after weather, extinction and spread processing. The attacking commander&#x27;s own end-of-order fire penalty remains separate.


#### 10. Move enemy: what to do


- Select your unit, then **Move → Move enemy**.

- Select an adjacent visible enemy. This selection costs **no mobility points**.

- Choose a highlighted destination for your own unit. Your unit pays its ordinary movement cost.

- The selected enemy may follow into your old tile: a 50% check succeeds when its INT is no greater than your unit&#x27;s INT. Palace occupants cannot be pulled. The enemy pays no mobility points, even when the attempt fails.


The persistent instruction changes after selection. Back or switching units clears that selection.


AI applies the original opportunistic pull after an ordinary move: it checks neighbours of the old tile in native order, considers strictly lower-INT enemies, excludes palace occupants, and rolls separately until one eligible enemy follows. It does not use a separate taunt-destination policy. Fair fog of war also applies to these choices. This verifies the native pull subroutine; it does not claim a complete reconstruction of every native pathfinding decision.


#### 11. Defenders return to the palace


When the palace is empty, dry and legally reachable, a ready defender prioritises returning there before an ordinary attack or pursuit. It can be a replacement guard rather than the commander who fled the fire. Fire escape still takes priority while a unit is burning. Legacy and trained policies use the same return rule, and AI highlighting selects the returning unit.


The native empty-palace goal is confirmed for three adjacent starting positions. The complete native route-field algorithm has not been reconstructed; the remaster uses its existing legal movement paths for farther returns.


#### 12. Historical events align with other events


Historical rows and their text now align left in Governance&#x27;s Events view, including rows with artwork. Expanded event paragraphs and the main event text also align left.


#### Training under the corrected rules


All three current profiles were actually retrained under the v49 rule fingerprint. Archived v44/v45 profiles retain their original identities; changing their label does not make them compatible.


| Profile | Independent holdout result | Interpretation | 


| [Governance progress](../config/ai-profiles/governance-v49.json) | Six episodes; mean score difference +10.004 against Legacy | Small exploratory sample | 

| [Battlefield](../config/ai-profiles/battlefield-v49.json) | Twelve paired-role episodes from six seeds; 1 wins, 0 losses, 11 draws; mean difference +0.648 | Many draws; no established superiority | 

| [Backward conquest](../config/ai-profiles/governance-conquest-v49.json) | Six cases across finish/expand/opening stages; aggregate difference −8.651 against Legacy and −1.588 against the previous weights reevaluated under v49 | Worse in this sample; remains experimental | 


The conquest curriculum continues working backward from all 41 provinces and uses abstract battle resolution, with **zero detailed battlefield actions**. Short finish and expansion exercises are separate from original-opening cases. No reliable lightning-speed full-campaign victory is established by these runs. Legacy stays selected until the player explicitly enables a trained profile.


Full reports: [governance](ai-training-v49-governance.json), [battlefield](ai-training-v49-battlefield.json), [conquest](ai-training-v49-conquest.json). [Archived warm-start weights and reproduction commands](ai-training-v49-warmstarts.json). Training instructions: [AI manual](ai-training-manual.html).


#### Verification and limits


The update includes 281 new native economy witnesses and 27 native tactical witnesses, with reproducible verifier scripts. Native arithmetic checks execute bounded original 16-bit branches; they are not a complete DOS playthrough. Earlier native-equation vectors remain in the package.


[Verification summary](verification-v49.json): 438 engine groups, 69 interface groups and 7 mobile CSS groups passed. Verification covers the full engine regression suite, unique rendered portrait crops, current-profile compatibility, interface flows with JSDOM and Canvas, and mobile CSS layout checks. Real browser and handset inspection was unavailable in this workspace. Consequently, these checks do not constitute a fresh physical-device screenshot review.


<a id="record-fixes-v49"></a>
## fixes-v49.md

Historical record from [`docs/fixes-v49.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/fixes-v49.md), original Git blob `21f3f225aa201e2491f23086856f942eb96ec4ae`. Later records take precedence where findings changed.

### Version 49 fixes and verified rules

11 October 2026 · Romance of the Three Kingdoms II

This update addresses the twelve reported issues and retains the earlier mobile layout, Governor label, ownership colours, timed spectator triumphs, governance-only playback, ambush and charge animation fixes. Legacy AI remains the default. Previous saved campaigns remain supported; incompatible optional AI profiles fall back to Legacy until a current profile is imported.

#### 1. Advice uses numbers and explains their meaning

“Enemy loyalty is strong” and “Our officers are dependable” have been removed. Council advice now identifies the actual officer and loyalty score, explains how much remains before 100, and describes recruitment risk without implying that loyalty alone guarantees success or failure. Recruitment and intelligence advice point to the order's estimated chance. Envoy ability, relationships, trust and protection can also affect eligibility or success.

Council text refreshes when circumstances change. Asking again does not reroll the monthly adviser-availability gate. Scouting alone does not lower loyalty; covert infiltration can affect it through its separate upkeep mechanics. War advice treats a numerical army advantage as an estimate rather than a guaranteed victory.

#### 2. What happens to invasion supplies?

The remaining attacker and defender field gold and food are deposited in the **battlefield province**, regardless of which side wins. A successful attacker therefore receives those remaining supplies in the conquered province. A defeated attacker does **not** get those field supplies refunded to the province it marched from. Provincial caps remain 30,000 gold and 3,000,000 food.

Surviving or captured generals retain their remaining soldiers, training and weapons according to their final fate and destination; these belong to the generals rather than a separate provincial weapons bank. Winning officers also receive the existing two-point training gain, based on their actual field training. Escaping generals carry their surviving troops and equipment, not a share of the army's food and gold.

Native evidence: settlement is called unconditionally at `0x08BC1`, and `0x0907C` adds both field stores to the battlefield province. Flight at `0x25670` does not refund them. The remaster's existing allied contingent refund and optional thank-you decision remain; the post-battle thank-you now draws from the supplies landed at the battlefield province.

#### 3. Portrait rules and custom choices

All 352 canonical officer identities have distinct portrait assignments and distinct rendered portrait crops. The rule uses canonical starting attributes, so training, books and temporary edits do not change a person's face.

| Starting attributes | Portrait direction |
| --- | --- |
| Only WAR exceeds 80 | Military attire: 武官 |
| INT or CHARM exceeds 80, while WAR does not | Scholar or court attire: 文官 |
| WAR and another attribute exceed 80 | Commander combining military and court cues |
| No attribute exceeds 80 | An ordinary officer, with the strongest ability guiding attire where possible |
| A recognisable historical identity | Its established historical appearance takes priority |

Historical exceptions preserve Liu Bei's ruler appearance, Zhao Yun's white military look, and the established identities of Zhang Fei, Guan Yu, Cao Cao, Dong Zhuo, Ma Chao, Sun Jian, Sun Ce and Sun Quan. Tai Shi Ci receives an armoured archer portrait and Cao Pi a young court-ruler portrait. Face uniqueness takes priority over reusing one generic face for everyone in the same ability class. The minimal role remapping changes 74 non-iconic assignments rather than changing every existing face.

Create custom ruler offers **four male and four female portraits**. The choice persists in saves. The companion has a separate portrait, and naming a custom ruler after Cao Cao or another historical officer does not borrow that historical face. The ruler-selection silhouette tile and its location remain as requested.

#### 4. Alphabetical lists

Officer choice cards now sort A–Z by their English names. Recruit's All, A–F, G–L, M–R and S–Z views retain that order. Its `#` view groups officers under their numbered province, sorts province groups alphabetically by province name, then sorts the officers within each group alphabetically. The province number is always shown.

The common choice renderer applies the same ordering to other officer and province lists, including movement, appointments and merchant selection. Province number display is a label choice, not a request for numerical sorting. Explicit **Data order**, which deliberately changes a province's stored officer order, remains available.

#### 5. Give, Reward and other spending advice

Give advice now scans affordable amounts under the current actor and governor. It reports the maximum attainable popular loyalty and the **smallest food amount** achieving that capped result, rather than assuming one food. At popular loyalty 100 it advises spending nothing. The per-order food limit remains 10,000.

Gold Reward selects the recipient before the amount, then reports the cheapest amount attaining the best affordable loyalty result. The native gain uses the governor's CHARM, with a random zero-or-one bonus, and a per-order limit of 100 gold. Advice distinguishes that range from a guaranteed gain and respects the cap of 100. A horse is offered as an alternative when available; Writings raise INT by one under their own eligibility rule and are not a loyalty reward. Fully loyal recipients are identified before money or horses are spent.

Cultivation and flood-control advice similarly report the best affordable capped improvement and smallest useful cost. Training advice excludes armies already at full training. Chance-based advice reports an estimate rather than promising success.

#### 6. Merchant weapons and interface

The original executable does **not** give an INT discount for weapon purchases. Both its human and AI buying branches use one gold per lot of 100 weapons. The maximum number of lots is:

`min(available gold, 100 − floor(current weapons / 100))`

Weapons cap at 10,000. The last partial lot still costs one gold: an officer with 9,999 weapons buys one additional weapon, not an impossible extra hundred. Different INT values produce the same native weapon price. Food trades retain their separate rice-price rule.

The merchant interface is retained: choosing the acting general, choosing the transaction and recipient, adjusting the amount while seeing its cost and effect, then confirming is easier to inspect and correct with Back than the original sequence of modal prompts. It also makes clear which general spends the monthly action. The preview now shows the actual weapon increase, including a partial final lot.

#### 7. Jungle information is shared fairly

A hidden enemy moving to a different jungle does not update the AI's knowledge. Both Legacy and trained policies receive visible enemies and previously observed positions. A blind attack at the remembered jungle can miss if the enemy has left; the missed attempt still spends the order. Actual contact or combat can reveal the enemy. Merely standing adjacent does not reveal every jungle occupant.

This is an intentional fairness improvement: the native drawing routine conceals jungle units, but the native adjacent-attack selector can still read their actual occupancy. The remaster removes that native AI information advantage. It does not claim that the original executable already followed fair fog of war.

#### 8. Tile information and Charge

Tile information now compares the selected tile with its actual neighbouring passable terrains, including jungle, hill and water. It shows enemy-loss and counterattack coefficients, identifies the neighbours and explains how to read them, rather than always comparing with plain terrain. Unit power and random rolls still affect actual losses.

Normal attack and Charge use the **same per-exchange terrain and casualty equation**. Charge repeats that exchange one to ten times; it is not a separate flat terrain bonus. The native palace counterattack branch uses its own divisor. Existing charging march, overlap, repeated strike and return animations remain intact.

#### 9. Empty burning palace

An empty palace still matters. At the daily fire update, a palace that remains burning destroys **30% of the defender's remaining field gold and food**, rounded down from the remaining 70%. This applies even without soldiers inside. Rain or extinction before that check prevents the loss. The native branch does not directly reduce provincial population, agriculture or a permanent palace statistic.

Native evidence: `0x22DFC` calls `0x22D76` after weather, extinction and spread processing. The attacking commander's own end-of-order fire penalty remains separate.

#### 10. Move enemy: what to do

1. Select your unit, then **Move → Move enemy**.
2. Select an adjacent visible enemy. This selection costs **no mobility points**.
3. Choose a highlighted destination for your own unit. Your unit pays its ordinary movement cost.
4. The selected enemy may follow into your old tile: a 50% check succeeds when its INT is no greater than your unit's INT. Palace occupants cannot be pulled. The enemy pays no mobility points, even when the attempt fails.

The persistent instruction changes after selection. Back or switching units clears that selection.

AI applies the original opportunistic pull after an ordinary move: it checks neighbours of the old tile in native order, considers strictly lower-INT enemies, excludes palace occupants, and rolls separately until one eligible enemy follows. It does not use a separate taunt-destination policy. Fair fog of war also applies to these choices. This verifies the native pull subroutine; it does not claim a complete reconstruction of every native pathfinding decision.

#### 11. Defenders return to the palace

When the palace is empty, dry and legally reachable, a ready defender prioritises returning there before an ordinary attack or pursuit. It can be a replacement guard rather than the commander who fled the fire. Fire escape still takes priority while a unit is burning. Legacy and trained policies use the same return rule, and AI highlighting selects the returning unit.

The native empty-palace goal is confirmed for three adjacent starting positions. The complete native route-field algorithm has not been reconstructed; the remaster uses its existing legal movement paths for farther returns.

#### 12. Historical events align with other events

Historical rows and their text now align left in Governance's Events view, including rows with artwork. Expanded event paragraphs and the main event text also align left.

#### Training under the corrected rules

All three current profiles were actually retrained under the v49 rule fingerprint. Archived v44/v45 profiles retain their original identities; changing their label does not make them compatible.

| Profile | Independent holdout result | Interpretation |
| --- | --- | --- |
| [Governance progress](../config/ai-profiles/governance-v49.json) | Six episodes; mean score difference +10.004 against Legacy | Small exploratory sample |
| [Battlefield](../config/ai-profiles/battlefield-v49.json) | Twelve paired-role episodes from six seeds; 1 wins, 0 losses, 11 draws; mean difference +0.648 | Many draws; no established superiority |
| [Backward conquest](../config/ai-profiles/governance-conquest-v49.json) | Six cases across finish/expand/opening stages; aggregate difference −8.651 against Legacy and −1.588 against the previous weights reevaluated under v49 | Worse in this sample; remains experimental |

The conquest curriculum continues working backward from all 41 provinces and uses abstract battle resolution, with **zero detailed battlefield actions**. Short finish and expansion exercises are separate from original-opening cases. No reliable lightning-speed full-campaign victory is established by these runs. Legacy stays selected until the player explicitly enables a trained profile.

Full reports: [governance](ai-training-v49-governance.json), [battlefield](ai-training-v49-battlefield.json), [conquest](ai-training-v49-conquest.json). [Archived warm-start weights and reproduction commands](ai-training-v49-warmstarts.json). Training instructions: [AI manual](ai-training-manual.html).

#### Verification and limits

The update includes 281 new native economy witnesses and 27 native tactical witnesses, with reproducible verifier scripts. Native arithmetic checks execute bounded original 16-bit branches; they are not a complete DOS playthrough. Earlier native-equation vectors remain in the package.

[Verification summary](verification-v49.json): 438 engine groups, 69 interface groups and 7 mobile CSS groups passed. Verification covers the full engine regression suite, unique rendered portrait crops, current-profile compatibility, interface flows with JSDOM and Canvas, and mobile CSS layout checks. Real browser and handset inspection was unavailable in this workspace. Consequently, these checks do not constitute a fresh physical-device screenshot review.



<a id="record-battle-presentation-v48"></a>
## battle-presentation-v48.md

Historical record from [`docs/battle-presentation-v48.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/battle-presentation-v48.md), original Git blob `a7c2c6c2cf7389fd42917ab93ee4b585da52f260`. Later records take precedence where findings changed.

### V48 governor, messages and battle presentation

The governor value was populated in v47 but the legacy `#governor { display:none }` rule still hid it. That rule and its obsolete short-screen variant have been removed. The existing shared font, font size and three-row province summary remain in place.

Battle-injury presentation keeps the general's name and expected recovery time. It omits the redundant zero-impact resource list. Stored events and recovery rules remain unchanged.

Spectator battle-result artwork and attacker/defender/province/commander-fate text close automatically at Game Speed. There is no Continue button in spectator mode. Human result reviews retain their Continue action. Durations are Slow 3 s, Normal 2 s, Fast 1 s and Very Fast 0.5 s. Backgrounding the page preserves unread time. Battlefield tile information expires at the same speeds for both controller modes; governance never displays it. Fort construction's requested location confirmation remains functional.

#### Multiple ambushes

`battle.mjs` already loops through the direction-dependent native forward arc and applies every eligible jungle ambush. The previous renderer overwrote all but the last visual cue. The renderer now reads the resolved, serial-numbered ambush messages from the current action and queues each animation separately. Movement reaches the destination before the first strike; subsequent strikes play in order. A routed victim stops further engine ambushes as before. Animation does not spend orders/mobility, modify casualties or consume randomness.

The existing native witness is `main.exe` SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Native `0x24938` loops over the three forward-arc cells and calls the occupied-hostile-jungle test and ambush exchange. See `native-battle-v33.md` for arithmetic and controlled executable vectors.

#### Charge movement

The supplied native charge routine `0x26318` calls the animation routine at `0x250F8` from `0x263D3`, with both drawing endpoints set to the defender's coordinates. This supports the overlapping-unit presentation. The existing terminal branches distinguish attacker defeat (`0x26438`), occupation of a defeated defender's tile (`0x2644C`) and a surviving defender's WAR-based breakthrough (`0x26503`). Those gameplay branches are unchanged.

The remaster adds a 650 ms approach march, retains its ten two-frame 600 ms charge attack cycles, and adds a 650 ms exit/return phase. During the strike phase the attacker occupies the defender's visual position and the defender's sprite, badge and flag are hidden. Successful occupation stays there; breakthrough marches onward to its resolved tile; an unsuccessful charge returns to its starting tile. These timings are remaster presentation choices, not a claim of exact DOS frame timing. Normal and simultaneous attack remain five cycles.

#### Validation and limits

`tests/v48-tests.mjs` checks two initially concealed ambushers in all six directions and both column parities, sequential native damage, separate animation cues, unchanged RNG/order costs, offset-hex charge paths and shortened injury text. Mounted interface checks verify actual message expiry, governor computed visibility, attacker overlap and separate ambush animation playback. Full gameplay and UI suites remain required before publication.

JSDOM and Canvas checks do not establish real-device layout or DOS gameplay parity. The engine fingerprint and existing trained policies are unchanged because this release changes presentation only. Earlier launch-screen and custom-ruler portrait changes remain included.



<a id="record-native-display-v47"></a>
## native-display-v47.md

Historical record from [`docs/native-display-v47.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-display-v47.md), original Git blob `3c7055b589ec69b2c9d57d8065d2fa527f657032`. Later records take precedence where findings changed.

### V47 original display reference

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



<a id="record-ai-training-v45-results-html"></a>
## ai-training-v45-results.html

Historical record from [`docs/ai-training-v45-results.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/ai-training-v45-results.html), original Git blob `cbfebcc4b003955ccca835978daac4100afb1fad`. Later records take precedence where findings changed.

[Return to game](../index.html)[Training manual](ai-training-manual.html)[V44 evaluation](changes.md#record-ai-training-v44-results-html)[Markdown source](changes.md#record-ai-training-v45-results)


### Governance conquest training · v45


11 October 2026 · Experimental profile · Legacy remains the default


The trainer now works backward from **sole ownership of all 41 provinces**: Finish, then Expand, then original Opening positions. Conquest success takes priority over completion time; capped supporting measurements reward sufficient commanders, combat strength, food, gold, production and loyalty. Actual losses and shortages reduce unfinished scores. Detailed battlefield decisions are disabled throughout training and evaluation.


This first bounded experiment won **5/6 synthetic Finish cases**, compared with 1/6 for Legacy and 5/6 for the preserved v44 profile. Mean time among those wins was 2.80 campaign months, versus 3.20 for v44. The new profile won **0/6 Expand cases and 0/6 original Opening cases** within the six-month deadline. These results do not establish reliable conquest from an original opening or faster training than the previous objective.


[Download the experimental governance profile](../config/ai-profiles/governance-conquest-v45.json) · [Full machine-readable report](ai-training-v45-governance.json) · [Training manual](ai-training-manual.html) · [Preserved v44 profile](../config/ai-profiles/governance-v44.json)


#### Independent evaluation


There are **18 starting cases**, six per stage, each evaluated with three fixed policies: **54 campaign runs**. These are paired comparisons on the same starts, not 54 independent cases. The six cases per stage cover all six original scenario families and existing variations. All opponents use Legacy. No weights change during this evaluation.


| 
Start | 
Policy | 
Wins / 6 | 
Eliminated | 
Unfinished | 
Win months | 
Capped months | 
Final provinces | 
Shortage province-months | 


| 
Finish · synthetic, 38 owned | 
Conquest v45 | 
5/6 | 
0 | 
1 | 
2.80 | 
3.50 | 
40.67 | 
16 | 


| 
Finish · synthetic, 38 owned | 
Legacy | 
1/6 | 
0 | 
5 | 
4.00 | 
6.50 | 
38.67 | 
89 | 


| 
Finish · synthetic, 38 owned | 
Governance v44 | 
5/6 | 
0 | 
1 | 
3.20 | 
3.83 | 
40.50 | 
21 | 


| 
Expand · synthetic, 24 owned | 
Conquest v45 | 
0/6 | 
0 | 
6 | 
— | 
7.00 | 
24.33 | 
78 | 


| 
Expand · synthetic, 24 owned | 
Legacy | 
0/6 | 
0 | 
6 | 
— | 
7.00 | 
23.00 | 
85 | 


| 
Expand · synthetic, 24 owned | 
Governance v44 | 
0/6 | 
0 | 
6 | 
— | 
7.00 | 
25.17 | 
80 | 


| 
Opening · original scenarios | 
Conquest v45 | 
0/6 | 
0 | 
6 | 
— | 
7.00 | 
17.33 | 
129 | 


| 
Opening · original scenarios | 
Legacy | 
0/6 | 
2 | 
4 | 
— | 
7.00 | 
8.17 | 
131 | 


| 
Opening · original scenarios | 
Governance v44 | 
0/6 | 
0 | 
6 | 
— | 
7.00 | 
12.67 | 
130 | 


“Win months” averages only completed victories. “Capped months” assigns every failed or unfinished case seven months, one beyond this run's six-month deadline, so early defeat never looks fast. Victory during the starting campaign month counts as one month. Final provinces includes unfinished campaigns. Shortages count province-months with rice or wage shortages; one campaign month may contribute several affected provinces. There is no conquest time to report for a policy with zero wins in a stage.


Finish and Expand are synthetic legal positions. They reassign ownership and existing generals, place spare generals at two fronts, adjust supplies, include bottleneck variants, and disable historical scripts. They demonstrate behavior at those positions, not that the policy built those realms from an opening. The Opening cases preserve the existing original scenarios and shortage variants. The full report includes per-case initial holdings, losses, resources and results rather than only an aggregate score.


The new profile's late-game win count matched v44, with a modest speed improvement in this small sample. In Expand, v44 retained more provinces on average (25.17) than v45 (24.33). The result therefore does not justify automatically replacing v44. With six cases per stage and 18 overall, no mean confidence interval is presented. Fresh, longer opening campaigns are needed to assess general conquest performance.


#### Training settings and reproducibility


The run started from the unchanged v44 governance weights. It used two practice cases per stage, three-month practice deadlines, two generations and three candidates per generation. Each stage retained its predecessors: 2, then 4, then 6 cumulative cases. Including each stage's initial evaluation, the search performed **84 practice episode evaluations**. Final evaluation used distinct seeds and six-month deadlines. The recorded run took 28.6 minutes on this shared runtime, including training and comparison.


Reproduce the settings from `dist/rtk2/`, choosing a new output directory:


node tools/train-governance.mjs --seed 11001 --holdout-seed 910001 --generations 2 --population 3 --episodes 2 --holdout-episodes 6 --months 3 --evaluation-months 6 --from config/ai-profiles/governance-v44.json --out training/governance-conquest-001
`
Practice covered two scenario families per stage; evaluation covered all six. The report records the seeds and engine fingerprint. The command uses the repository's original scenario files and checks the engine fingerprint before and after the run. Outcome measurements are reproducible with unchanged code; decision timing and total runtime depend on the machine. This is not an equal-budget comparison of backward training against the old training objective, so it does not prove improved training efficiency.


| 
Planner weight | 
Starting v44 | 
Conquest v45 | 


| 
territory | 
2.4057 | 
2.0203 | 


| 
officers | 
2.0000 | 
2.0000 | 


| 
army | 
1.5000 | 
1.5000 | 


| 
land | 
1.0000 | 
1.0000 | 


| 
flood | 
0.6000 | 
0.9276 | 


| 
loyalty | 
0.8000 | 
0.6257 | 


| 
gold | 
0.6014 | 
0.6403 | 


| 
food | 
2.0000 | 
2.7824 | 


| 
safety | 
3.0000 | 
5.1118 | 


The objective rewards useful, supplied armies rather than unlimited stockpiling. The existing planner still considers its existing legal candidates with two-order lookahead. Changing the objective does not add friendly supply transfer orders, deeper planning or other unsupported candidates. This scope can limit expansion even when supporting weights improve.


#### Governance-only battle resolution and validation


| 
Policy | 
Abstract battles | 
Immediate outcomes | 
Detailed orders | 
Mean governance decision | 


| 
Conquest v45 | 
2467 | 
19 | 
0 | 
68.16 ms | 


| 
Legacy | 
2592 | 
9 | 
0 | 
1.43 ms | 


| 
Governance v44 | 
2867 | 
4 | 
0 | 
62.44 ms | 


Battle counts cover all factions. Immediate outcomes include zero-soldier garrisons defeated before a battle mode starts; the game may label those records “tactical,” but no detailed orders execute. The guard rejects actual detailed battle decisions. Invasions, casualties, capture, food costs and ownership changes still use the existing abstract game rules.


Mean decision time weights each measured decision equally and includes the acting faction's existing step work. The new profile took slightly longer per decision than v44 and much longer than Legacy. Faster conquest in campaign months does not mean faster computation. This is a runtime comparison here, not a browser or handset performance measurement. Tactical battle strength and real-device behavior were not evaluated.


**408 regression checks and 58 mounted interface checks passed.** Checks include unchanged engine compatibility and v44 profiles, valid repeatable curriculum states, exact original Opening construction, strict all-41 victory, elimination handling, capped resource guidance, disabled detailed orders and safe profile import. Engine rules, original campaigns and existing battlefield training were preserved.


#### Try the profile


Before importing, select **Legacy for Governance globally and in any ruler overrides**. Then download the profile and choose **HUD → AI → Import profile**. Import preserves the selected policy; if Governance is already Trained, the new weights become active immediately. Inspect the profile, then choose Trained explicitly. Battlefield can remain Legacy. Use the same starting campaign when comparing with the preserved v44 profile; the HUD stores one imported profile per domain.


The experiment does not change active campaigns or player battle-view preferences. Legacy remains the default. Game download packaging remains deferred.


<a id="record-ai-training-v45-results"></a>
## ai-training-v45-results.md

Historical record from [`docs/ai-training-v45-results.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/ai-training-v45-results.md), original Git blob `e6305d09897143063ef1fd8be67eb58d54149461`. Later records take precedence where findings changed.

### Governance conquest training · v45

11 October 2026 · Experimental profile · Legacy remains the default

The trainer now works backward from **sole ownership of all 41 provinces**: Finish, then Expand, then original Opening positions. Conquest success takes priority over completion time; capped supporting measurements reward sufficient commanders, combat strength, food, gold, production and loyalty. Actual losses and shortages reduce unfinished scores. Detailed battlefield decisions are disabled throughout training and evaluation.

This first bounded experiment won **5/6 synthetic Finish cases**, compared with 1/6 for Legacy and 5/6 for the preserved v44 profile. Mean time among those wins was 2.80 campaign months, versus 3.20 for v44. The new profile won **0/6 Expand cases and 0/6 original Opening cases** within the six-month deadline. These results do not establish reliable conquest from an original opening or faster training than the previous objective.

[Download the experimental governance profile](../config/ai-profiles/governance-conquest-v45.json) · [Full machine-readable report](ai-training-v45-governance.json) · [Training manual](ai-training-manual.html) · [Preserved v44 profile](../config/ai-profiles/governance-v44.json)

#### Independent evaluation

There are **18 starting cases**, six per stage, each evaluated with three fixed policies: **54 campaign runs**. These are paired comparisons on the same starts, not 54 independent cases. The six cases per stage cover all six original scenario families and existing variations. All opponents use Legacy. No weights change during this evaluation.

| Start | Policy | Wins / 6 | Eliminated | Unfinished | Win months | Capped months | Final provinces | Shortage province-months |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Finish · synthetic, 38 owned | Conquest v45 | 5/6 | 0 | 1 | 2.80 | 3.50 | 40.67 | 16 |
| Finish · synthetic, 38 owned | Legacy | 1/6 | 0 | 5 | 4.00 | 6.50 | 38.67 | 89 |
| Finish · synthetic, 38 owned | Governance v44 | 5/6 | 0 | 1 | 3.20 | 3.83 | 40.50 | 21 |
| Expand · synthetic, 24 owned | Conquest v45 | 0/6 | 0 | 6 | — | 7.00 | 24.33 | 78 |
| Expand · synthetic, 24 owned | Legacy | 0/6 | 0 | 6 | — | 7.00 | 23.00 | 85 |
| Expand · synthetic, 24 owned | Governance v44 | 0/6 | 0 | 6 | — | 7.00 | 25.17 | 80 |
| Opening · original scenarios | Conquest v45 | 0/6 | 0 | 6 | — | 7.00 | 17.33 | 129 |
| Opening · original scenarios | Legacy | 0/6 | 2 | 4 | — | 7.00 | 8.17 | 131 |
| Opening · original scenarios | Governance v44 | 0/6 | 0 | 6 | — | 7.00 | 12.67 | 130 |

“Win months” averages only completed victories. “Capped months” assigns every failed or unfinished case seven months, one beyond this run's six-month deadline, so early defeat never looks fast. Victory during the starting campaign month counts as one month. Final provinces includes unfinished campaigns. Shortages count province-months with rice or wage shortages; one campaign month may contribute several affected provinces. There is no conquest time to report for a policy with zero wins in a stage.

Finish and Expand are synthetic legal positions. They reassign ownership and existing generals, place spare generals at two fronts, adjust supplies, include bottleneck variants, and disable historical scripts. They demonstrate behavior at those positions, not that the policy built those realms from an opening. The Opening cases preserve the existing original scenarios and shortage variants. The full report includes per-case initial holdings, losses, resources and results rather than only an aggregate score.

The new profile's late-game win count matched v44, with a modest speed improvement in this small sample. In Expand, v44 retained more provinces on average (25.17) than v45 (24.33). The result therefore does not justify automatically replacing v44. With six cases per stage and 18 overall, no mean confidence interval is presented. Fresh, longer opening campaigns are needed to assess general conquest performance.

#### Training settings and reproducibility

The run started from the unchanged v44 governance weights. It used two practice cases per stage, three-month practice deadlines, two generations and three candidates per generation. Each stage retained its predecessors: 2, then 4, then 6 cumulative cases. Including each stage's initial evaluation, the search performed **84 practice episode evaluations**. Final evaluation used distinct seeds and six-month deadlines. The recorded run took 28.6 minutes on this shared runtime, including training and comparison.

Reproduce the settings from `dist/rtk2/`, choosing a new output directory:

```sh
node tools/train-governance.mjs --seed 11001 --holdout-seed 910001 --generations 2 --population 3 --episodes 2 --holdout-episodes 6 --months 3 --evaluation-months 6 --from config/ai-profiles/governance-v44.json --out training/governance-conquest-001
```

Practice covered two scenario families per stage; evaluation covered all six. The report records the seeds and engine fingerprint. The command uses the repository's original scenario files and checks the engine fingerprint before and after the run. Outcome measurements are reproducible with unchanged code; decision timing and total runtime depend on the machine. This is not an equal-budget comparison of backward training against the old training objective, so it does not prove improved training efficiency.

| Planner weight | Starting v44 | Conquest v45 |
| --- | --- | --- |
| territory | 2.4057 | 2.0203 |
| officers | 2.0000 | 2.0000 |
| army | 1.5000 | 1.5000 |
| land | 1.0000 | 1.0000 |
| flood | 0.6000 | 0.9276 |
| loyalty | 0.8000 | 0.6257 |
| gold | 0.6014 | 0.6403 |
| food | 2.0000 | 2.7824 |
| safety | 3.0000 | 5.1118 |

The objective rewards useful, supplied armies rather than unlimited stockpiling. The existing planner still considers its existing legal candidates with two-order lookahead. Changing the objective does not add friendly supply transfer orders, deeper planning or other unsupported candidates. This scope can limit expansion even when supporting weights improve.

#### Governance-only battle resolution and validation

| Policy | Abstract battles | Immediate outcomes | Detailed orders | Mean governance decision |
| --- | --- | --- | --- | --- |
| Conquest v45 | 2467 | 19 | 0 | 68.16 ms |
| Legacy | 2592 | 9 | 0 | 1.43 ms |
| Governance v44 | 2867 | 4 | 0 | 62.44 ms |

Battle counts cover all factions. Immediate outcomes include zero-soldier garrisons defeated before a battle mode starts; the game may label those records “tactical,” but no detailed orders execute. The guard rejects actual detailed battle decisions. Invasions, casualties, capture, food costs and ownership changes still use the existing abstract game rules.

Mean decision time weights each measured decision equally and includes the acting faction's existing step work. The new profile took slightly longer per decision than v44 and much longer than Legacy. Faster conquest in campaign months does not mean faster computation. This is a runtime comparison here, not a browser or handset performance measurement. Tactical battle strength and real-device behavior were not evaluated.

**408 regression checks and 58 mounted interface checks passed.** Checks include unchanged engine compatibility and v44 profiles, valid repeatable curriculum states, exact original Opening construction, strict all-41 victory, elimination handling, capped resource guidance, disabled detailed orders and safe profile import. Engine rules, original campaigns and existing battlefield training were preserved.

#### Try the profile

Before importing, select **Legacy for Governance globally and in any ruler overrides**. Then download the profile and choose **HUD → AI → Import profile**. Import preserves the selected policy; if Governance is already Trained, the new weights become active immediately. Inspect the profile, then choose Trained explicitly. Battlefield can remain Legacy. Use the same starting campaign when comparing with the preserved v44 profile; the HUD stores one imported profile per domain.

The experiment does not change active campaigns or player battle-view preferences. Legacy remains the default. Game download packaging remains deferred.



<a id="record-ai-training-v44-results-html"></a>
## ai-training-v44-results.html

Historical record from [`docs/ai-training-v44-results.html`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/ai-training-v44-results.html), original Git blob `9e8bc2f73b743c1aaa40469fbc03203ae1c309f0`. Later records take precedence where findings changed.

[Return to game](../index.html)[Training manual](ai-training-manual.html)[Example evaluation](changes.md#record-ai-training-v44-results-html)[Markdown source](changes.md#record-ai-training-v44-results)


### V44 AI training evaluation


11 October 2026. These are experimental examples, not promoted replacements. Legacy remains the game&#x27;s default.


Both examples use one generation and two mutated candidates per generation, plus the initial candidate. Training retains the candidate with the best fixed outcome objective on its training set. Its holdout is evaluated afterward and never used to select weights. Both modes cover the six scenario families; generated governance cases control their first active ruler, while each battlefield position is tested in both roles against Legacy.


| Holdout measurement | Governance example | Battlefield example | 


| Independent starting seeds | 6 | 6 | 

| Episodes | 6 two-month campaign segments | 12 battles, paired attacker/defender roles | 

| Trained mean fixed objective | 30.059 | 4.687 | 

| Legacy mean fixed objective | 2.450 | 5.000 | 

| Trained minus Legacy | +27.609 | −0.313 | 

| Battle wins / losses / draws | Not the governance objective | Trained: 1 / 2 / 9; Legacy: 1 / 1 / 10 | 

| Battle score rate, draw = half | Not applicable | Trained: 45.8%; Legacy: 50.0% | 

| General superiority established? | No | No; this small holdout favors Legacy | 


The two domains use different objectives and scales; their numerical scores cannot be compared with each other. No mean confidence interval is reported with only six independent seeds. Paired battle roles share a position, so the report does not pretend there are twelve independent cases or present an ordinary per-match win-rate interval.


The governance training-set difference was +37.661. Its holdout improved on average, but one of the six cases worsened by 20.876 points. A separate fresh-seed, one-month CLI smoke comparison also worsened by 5.570 points. That smoke test verifies the benchmark workflow; a single case with a different horizon is not a strength estimate. Together these observations argue for testing more positions and horizons before enabling the policy broadly.


The battlefield training-set difference was −0.305 and its holdout difference was −0.313. The optimizer did not find a candidate stronger than Legacy in this bounded run. Nine draws suggest the generated cases need more varied, curated positions with actual contact, palace danger, fire and resource pressure. Do not increase search rounds and assume that alone will fix the evaluation coverage.


On this container, governance holdout mean decision times by episode ranged from about 97–200 ms for the trained policy and 0.7–1.9 ms for Legacy. Battlefield averaged about 38 ms per trained decision and 0.1 ms for Legacy across the holdout episodes. These are headless development measurements, not phone performance. Copied-state lookahead costs substantially more than the existing heuristics; shadow comparison adds that cost even when Legacy executes.


The full runs took about 344 seconds for governance and 430 seconds for battlefield. Reproduction can differ in elapsed time and floating-point timing fields. Outcomes, seeds and weights should reproduce with unchanged source and configuration.


#### Reproduce these examples


From `dist/rtk2/`, choose new output directories:


`node tools/train-ai.mjs --domain governance --seed 3001 --holdout-seed 900001 --generations 1 --population 2 --episodes 6 --holdout-episodes 6 --months 2 --out training/reproduce-v44-governance
node tools/train-ai.mjs --domain battlefield --seed 4001 --holdout-seed 950001 --generations 1 --population 2 --episodes 6 --holdout-episodes 6 --out training/reproduce-v44-battlefield`
The release copies give the profiles an “Experimental” display name. Their weights, IDs and holdout metrics are unchanged. The release reports include the matching rules fingerprint and profile ID for provenance.


- [Governance profile](../config/ai-profiles/governance-v44.json)

- [Battlefield profile](../config/ai-profiles/battlefield-v44.json)

- [Full governance results](ai-training-v44-governance.json)

- [Full battlefield results](ai-training-v44-battlefield.json)

- [Fresh-seed CLI smoke checks](ai-training-v44-smoke.json)


#### Verification and limits


Warm-start CLI testing also successfully retrained an obsolete-rules profile into a current compatible profile. Both governance and battlefield benchmark commands completed against fresh seeds.


The gameplay regression suite and fourteen AI-extension regression groups passed. They cover Legacy dispatch/state equivalence, no automatic activation, independent global/ruler choices, bounded imports, outdated-rules save fallback, no live RNG/order consumption during previews, food shortage response, joint officer/order selection, immediate palace victory, hidden-position/action-coordinate invariance, engine-only execution and paired-role uncertainty reporting.


Mounted HUD/raster checks cover profile loading, Legacy defaults, policy inheritance, stale-file rejection, read-only comparison and existing button dimensions alongside the earlier battle controls. This environment cannot verify a physical browser or handset; device performance and visual layout remain to be checked there. The manual is available as [readable HTML](ai-training-manual.html) and [Markdown](ai-training-manual.md).


These are simulated game outcomes against one opponent policy. They do not establish original-executable AI parity, long campaign strength, performance against human play, or a learned strategy for every order. Deployment, pending challenges and unsupported planner situations retain Legacy handling. Training and import do not change the underlying game rules.


<a id="record-ai-training-v44-results"></a>
## ai-training-v44-results.md

Historical record from [`docs/ai-training-v44-results.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/ai-training-v44-results.md), original Git blob `0aaacb361b1c0a4488b8ffe67c37e62b4b6c943d`. Later records take precedence where findings changed.

### V44 AI training evaluation

11 October 2026. These are experimental examples, not promoted replacements. Legacy remains the game's default.

Both examples use one generation and two mutated candidates per generation, plus the initial candidate. Training retains the candidate with the best fixed outcome objective on its training set. Its holdout is evaluated afterward and never used to select weights. Both modes cover the six scenario families; generated governance cases control their first active ruler, while each battlefield position is tested in both roles against Legacy.

| Holdout measurement | Governance example | Battlefield example |
| --- | --- | --- |
| Independent starting seeds | 6 | 6 |
| Episodes | 6 two-month campaign segments | 12 battles, paired attacker/defender roles |
| Trained mean fixed objective | 30.059 | 4.687 |
| Legacy mean fixed objective | 2.450 | 5.000 |
| Trained minus Legacy | +27.609 | −0.313 |
| Battle wins / losses / draws | Not the governance objective | Trained: 1 / 2 / 9; Legacy: 1 / 1 / 10 |
| Battle score rate, draw = half | Not applicable | Trained: 45.8%; Legacy: 50.0% |
| General superiority established? | No | No; this small holdout favors Legacy |

The two domains use different objectives and scales; their numerical scores cannot be compared with each other. No mean confidence interval is reported with only six independent seeds. Paired battle roles share a position, so the report does not pretend there are twelve independent cases or present an ordinary per-match win-rate interval.

The governance training-set difference was +37.661. Its holdout improved on average, but one of the six cases worsened by 20.876 points. A separate fresh-seed, one-month CLI smoke comparison also worsened by 5.570 points. That smoke test verifies the benchmark workflow; a single case with a different horizon is not a strength estimate. Together these observations argue for testing more positions and horizons before enabling the policy broadly.

The battlefield training-set difference was −0.305 and its holdout difference was −0.313. The optimizer did not find a candidate stronger than Legacy in this bounded run. Nine draws suggest the generated cases need more varied, curated positions with actual contact, palace danger, fire and resource pressure. Do not increase search rounds and assume that alone will fix the evaluation coverage.

On this container, governance holdout mean decision times by episode ranged from about 97–200 ms for the trained policy and 0.7–1.9 ms for Legacy. Battlefield averaged about 38 ms per trained decision and 0.1 ms for Legacy across the holdout episodes. These are headless development measurements, not phone performance. Copied-state lookahead costs substantially more than the existing heuristics; shadow comparison adds that cost even when Legacy executes.

The full runs took about 344 seconds for governance and 430 seconds for battlefield. Reproduction can differ in elapsed time and floating-point timing fields. Outcomes, seeds and weights should reproduce with unchanged source and configuration.

#### Reproduce these examples

From `dist/rtk2/`, choose new output directories:

```sh
node tools/train-ai.mjs --domain governance --seed 3001 --holdout-seed 900001 --generations 1 --population 2 --episodes 6 --holdout-episodes 6 --months 2 --out training/reproduce-v44-governance
node tools/train-ai.mjs --domain battlefield --seed 4001 --holdout-seed 950001 --generations 1 --population 2 --episodes 6 --holdout-episodes 6 --out training/reproduce-v44-battlefield
```

The release copies give the profiles an “Experimental” display name. Their weights, IDs and holdout metrics are unchanged. The release reports include the matching rules fingerprint and profile ID for provenance.

- [Governance profile](../config/ai-profiles/governance-v44.json)
- [Battlefield profile](../config/ai-profiles/battlefield-v44.json)
- [Full governance results](ai-training-v44-governance.json)
- [Full battlefield results](ai-training-v44-battlefield.json)
- [Fresh-seed CLI smoke checks](ai-training-v44-smoke.json)

#### Verification and limits

Warm-start CLI testing also successfully retrained an obsolete-rules profile into a current compatible profile. Both governance and battlefield benchmark commands completed against fresh seeds.

The gameplay regression suite and fourteen AI-extension regression groups passed. They cover Legacy dispatch/state equivalence, no automatic activation, independent global/ruler choices, bounded imports, outdated-rules save fallback, no live RNG/order consumption during previews, food shortage response, joint officer/order selection, immediate palace victory, hidden-position/action-coordinate invariance, engine-only execution and paired-role uncertainty reporting.

Mounted HUD/raster checks cover profile loading, Legacy defaults, policy inheritance, stale-file rejection, read-only comparison and existing button dimensions alongside the earlier battle controls. This environment cannot verify a physical browser or handset; device performance and visual layout remain to be checked there. The manual is available as [readable HTML](ai-training-manual.html) and [Markdown](ai-training-manual.md).

These are simulated game outcomes against one opponent policy. They do not establish original-executable AI parity, long campaign strength, performance against human play, or a learned strategy for every order. Deployment, pending challenges and unsupported planner situations retain Legacy handling. Training and import do not change the underlying game rules.



<a id="record-native-turns-v43"></a>
## native-turns-v43.md

Historical record from [`docs/native-turns-v43.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-turns-v43.md), original Git blob `62f1ee11fd50372ded7b07a99efbb728bf90ffe2`. Later records take precedence where findings changed.

### Battle turns, fire and movement — v43

These findings come from the supplied English `main.exe`. The nine controlled checks in [native-turns-v43.json](native-turns-v43.json) execute the original instructions in a bounded 16-bit emulator. The verifier checks the executable's SHA-256 first. This is evidence for the listed rules, not a complete DOS playthrough.

#### What changes when

| Event | Fire damage or movement rule |
| --- | --- |
| Successful fireball ignites a unit's tile | Immediate random loss below 5% of that unit's men. |
| A unit finishes an order and remains on fire | Random loss below 30%. Human and AI use the same rule. |
| Inspect a unit | No daily order spent; no fire check. |
| Army control changes | No extra blanket damage. AI orders may execute immediately after the handoff. |
| Finish army orders with unused units | Those units Wait; burning units receive their after-order check. |
| Rain begins at the day update | Clear fire before the spread update. Orders already completed under the previous weather retain their losses. |
| Move with 5 MP | Can cross plain (2 MP) then jungle (3 MP) in one order. Enemy contact or other movement restrictions can stop the path sooner. |
| Simultaneous attack | Units consume their order when they exchange damage; unused helpers remain ready. V50 also verifies that a completed simultaneous loop consumes the opposing unit's readiness. |

Damage can be zero. A burning unit with fewer than 100 men is killed by the original damage routine. Weapon losses use the integer armed percentage. Neither visual fire flicker nor repeated attack animation rolls damage again.

The original Move routine actually traversed `(6,4) → (6,5) → (6,6)` in the controlled plain/jungle case, spending all five MP. The remaster retains its existing multi-tile Move behavior and now writes total route costs on reachable human tiles.

#### Original AI deployment

The original has priorities rather than a single “closest to palace” rule:

1. Place the first defender in the empty palace.
2. With sufficient supplies, consider a forward position next to the palace, facing the approach. Troop strength and WAR affect whether the unit holds that position.
3. The fallback defender selector scans legal zone cells using a movement-cost field from the approach. Lower cost wins; a tied cost prefers the higher terrain code, with scan order resolving remaining ties.
4. Attacker placement uses a random available cell in the allowed approach zone.

The executable checks establish the empty-palace branch, a controlled cost-field/terrain tie, and a controlled attacker random choice. The cost field is supplied by a hook in the tie test; that test does **not** establish the entire native path-field calculation or advanced deployment sequence.

The remaster still uses its simpler closest-palace placement for both armies. Its first defender normally takes the palace, but the later deployment strategy is **not fully equivalent**. This verification request does not silently replace that policy with an incompletely reconstructed version.

#### Controls and visual checks

Deployment confirmation is at bottom right. **Yes** confirms a fully placed army. **No** clears only the current army's deployment so it can be placed again; the previously confirmed opposing army stays placed.

Friendly portraits open unit information immediately. Hostile portraits ask whether to spend **100 gold**; Yes charges once and opens the information, No returns without charging. Inspection preserves mobility and order flags. The extra View unit button has been removed from the portrait picker.

The gold active hex and blinking soldier sprite use the same selected AI actor as automatic HUD diagnostics. HUD's explicit unit picker can still preview another unit. Human movement highlights show total path costs in MP. Clicking a tile shows terrain type, movement cost and combat effects; a reachable tile still performs the selected Move order.

Terrain defence numbers compare the native melee casualty divisors with plain ground. For example, hill's divisor 12 versus plain's 10 gives about ×0.83 incoming losses before integer rounding. Damage depends on both armies' WAR, training, equipment and random draws too. Terrain has no separate flat attack bonus; the target's cover determines its losses. Palace assault uses a special divisor 5 for the attacker’s counterattack exposure.

Fire imagery is 50% opaque and continuously changes size until extinguished. The v50 audit supersedes the earlier animation counts: the native shared renderer uses **eight source/target cycles**; Simultaneous and Charge invoke it for each actual exchange. The remaster applies this to Normal, Simultaneous, Ambush and Charge. Status follows the animation. Visual playback does not resolve combat again. See [native-combat-v50.md](changes.md#record-native-combat-v50).

#### Captive-count investigation

No five-versus-three loss of decisions was reproduced. The regression scenario reports five captured generals, stores five pending decisions, preserves all five through save/load and lets the human resolve each one. The victory screen now names the captured generals and shows how many decisions await the winner. This makes a remaining discrepancy identifiable; no capture formula was changed without a reproduced defect.

#### Re-run the checks

From `dist/rtk2`, with optional Python `unicorn` installed:

```sh
python tools/verify-native-turns.py /path/to/main.exe /tmp/native-turns.json
node tests/v43-tests.mjs
npm test
npm run test:ui
```

Native entries: Move `0x25BA8`; fire arithmetic `0x24752`; after-order fire `0x2297C`/`0x22E58`; fireball ignition `0x2671A`; rain/fire update `0x22C68`; simultaneous friendly action-flag clearing `0x261C5`; deployment `0x26D58`. The native day update changes weather before its fire update at `0x23330`.

UI, input, lookup, combat-result, eligibility and selected cost-field hooks keep the native cases bounded. Physical handset rendering remains a separate device check. Other differences, including remaster fire lifetime/spread probabilities and advanced deployment, remain documented approximations.



<a id="record-native-fire-v42"></a>
## native-fire-v42.md

Historical record from [`docs/native-fire-v42.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-fire-v42.md), original Git blob `335a6d0f21f6afe060b7f47b81ff4686bf2f6b53`. Later records take precedence where findings changed.

### Fire escape and palace decisions — v42

A burning palace guard now considers escape before its ordinary “hold the palace” decision. The original executable does not always sacrifice an army to keep the palace occupied.

#### What the supplied executable establishes

`tools/verify-native-fire.py` runs the unchanged goal-selection branch at unpacked offset `0x2AD8A`. The twelve recorded cases (six situations in both opposing native army slots) are in [native-fire-v42.json](native-fire-v42.json). The verifier checks the supplied executable's SHA-256 before running it.

| Situation | Recovered priority | Remaster action |
| --- | --- | --- |
| Burning unit has more than 3,000 men; an adjacent enemy commander has fewer than 1,000 | Keep the current goal and target that commander | Normal attack from the current tile |
| Palace is empty, dry, and its terrain cost is affordable | Set the palace as the goal | Take an affordable dry neighbouring step toward it |
| A dry, unoccupied, affordable neighbour remains adjacent to the palace | Prefer that ground | Move one tile, retaining a position beside the palace |
| Another dry, unoccupied, affordable neighbour exists | Escape to dry ground | Move one tile |
| No such neighbour exists | Fall through to later native decisions | Wait; fire damage still applies normally |

Exactly **3,000** friendly soldiers and exactly **1,000** enemy soldiers do not meet the commander exception. The controlled native cases also show a burning palace unit choosing dry neighbouring ground. A nearby strong enemy does not establish a blanket “stay in fire to save the palace” rule in this branch.

#### Evidence and limits

The fire check at `0x2396A` reads bit `0x20` of the battlefield cell flags. The escape-cell check at `0x2C2F4` rejects unaffordable terrain, fire and occupied cells. `0x2BCDE` tries the palace and then ground neighbouring palace terrain; `0x2AC54` tries other neighbouring cells. The commander exception is at `0x2AE20–0x2AE85`.

These are bounded executable checks using Unicorn, with hooks for unit lookup, direction ordering and UI/mobility bookkeeping. They establish **goal priorities**, not a full DOS battle simulation. The remaster still uses its own route tie-breaking, visible-enemy information and legal action resolver. Waiting when escape is blocked is a remaster fallback; the complete later native attack/retreat branch has not been reproduced here.

To reproduce the native checks, install Python's optional `unicorn` package, then run from `dist/rtk2`:

```sh
python tools/verify-native-fire.py /path/to/main.exe /tmp/native-fire-check.json
node tests/v42-tests.mjs
```

The original executable remains a separate input and is not included in the game.



<a id="record-artwork-v36"></a>
## artwork-v36.md

Historical record from [`docs/artwork-v36.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/artwork-v36.md), original Git blob `6f3e3a3eb29e10640919b94e197ab5220c0b8881`. Later records take precedence where findings changed.

### V36 historical scenes and event sound

All 15 scheduled historical scenes now have individual image assets under `assets/history-v36/`. A sixteenth scene serves unknown historical entries. They are original generated paintings, not reconstructions of surviving likenesses.

Each WebP is natively **1983 × 793 pixels**. No enlargement or stretching was used when preparing these files. Compared with a v30 history-atlas cell (991.5 × 396.5), each replacement provides twice the width and height, or four times the pixels. The generation prompt requested 3840 × 1536; the actual generator output was 1983 × 793, so these are not claimed as 4K images.

The complete generation prompts and the historical correction applied to the 223 scene are in `artwork/history-generation-v36.json`. The shared renderer reads each standalone image as a whole scene, uses one proportional contain scale, and loads scenes on demand. Old history atlases remain only for existing regressions/provenance. Release asset hashes identify the active files.

| Year | Scene |
| --- | --- |
| 189 | Dong Zhuo controls the Han court |
| 190 | Coalition against Dong Zhuo |
| 192 | Wang Yun and Lü Bu's plot |
| 194 | Tao Qian entrusts Xu Province to Liu Bei |
| 197 | Yuan Shu proclaims himself emperor |
| 200 | Guandu / Wuchao |
| 207 | Visit to Zhuge Liang's cottage |
| 208 | Red Cliffs |
| 215 | Cao Cao at Hanzhong |
| 219 | Guan Yu's capture |
| 220 | Han abdication to Cao Pi |
| 221 | Liu Bei proclaims Shu Han |
| 222 | Lu Xun's counterattack at Yiling |
| 223 | Baidicheng deathbed council |
| 229 | Sun Quan's imperial proclamation |
| Fallback | Historical council and envoy |

`tools/build-event-audio.py` reproducibly creates eight original nonverbal synthesized effects: uneven four-hoof gallop clusters, flood water and distant distress textures, locust wing swarms, typhoon wind/rain, epidemic cough textures, uprising crowd/drums, meteor whoosh/gong, and a solemn death gong. These are synthesized textures, not sampled human or animal recordings. Sound effects respect the existing Sound toggle, playback unlock, app activity and document visibility. The music toggle remains separate. Existing message durations and mechanics are unchanged.

Validation includes whole-scene proportional rendering, distinct image hashes, native dimensions, compact war summaries, sound routing/muting, mounted order confirmation and Province-toggle flows, and mobile CSS checks. Browser and actual handset rendering/listening were unavailable in this environment; the generated scenes were visually inspected, but device audio and final on-phone layout still need direct checking.



<a id="record-compulsory-retreat-v34"></a>
## compulsory-retreat-v34.md

Historical record from [`docs/compulsory-retreat-v34.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/compulsory-retreat-v34.md), original Git blob `0fbb06d98f42e8b9d24f1dc1b23cdda77e04fe71`. Later records take precedence where findings changed.

### Compulsory field retreat — v34

Primary evidence is the supplied English main.exe, SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Addresses are unpacked load-image offsets. No native executable is included in the pack.

The loop at `0x2CFBE` traverses the defeated linked list. `0x2CFF2` calls `0x25810` to build legal adjacent unoccupied/same-owner provinces. Its no-destination branch at `0x2D0AE` calls the capture helper `0x25350`. The human branch prompts each officer for a province at `0x2D026–0x2D086`; the automatic branch at `0x2D08A` calls `0x2574C`. Both join at `0x2D09A` and call `0x25670` through `0x2D0A4`.

`0x25670` calls `0x25566`, so compulsory escape uses the same recovered horse flag, WAR, training, restored mobility, men, adjacent-hostile count, ruler/Lu Bu bonuses and random draws as voluntary Flee. It is not the former `90 − (INT + WAR)/3` capture equation. No legal exit means capture even with a horse. The V33 arithmetic vectors still apply unchanged.

`0x2574C` identifies the original province through `0x234D6`, searches for it or a same-owner destination first, then selects an unoccupied choice randomly if necessary. Destination order in the remaster uses the province's original neighbour list. Human decisions are validated before rolling; dispositions remain on units until final settlement and cannot be repeated or rerolled on save/load.

Implementation: `mjs/battle-withdrawal.mjs` owns the defeated-field workflow; `battle.mjs` supplies legal destinations and native flight; `strategy.mjs` retains the result and exposes pending human decisions; `app.mjs` presents a separate choice for each human-controlled survivor and plays status/result messages before governance. Headless tactical simulations choose automatically. Unwatched abstract wars retain their separate documented abstraction.

An integration test found governor rebellion recycling an exiled ruler's ID. Active roaming and captive rulers now reserve their slots, keeping saves valid without changing advisor logic.

Limitations: this ports the **defeated field-unit** workflow. Provincial non-field reserves still use the documented capture approximation. Native secret-pact branches, complete transfer/spoils bookkeeping and exact original presentation timing remain unreconstructed. The broader governance and tactical audit in differences.md still applies.

Verification: [118 frozen binary checks](original-v34-checks.json), the existing 812 controlled native cases, five compulsory-retreat integration checks and all 333 regression checks pass. The raster interface suite exercises the real result → individual destinations → escape messages → final result → governance sequence, including checkpoint restoration.



<a id="record-ai-ambush-proposal-v33"></a>
## ai-ambush-proposal-v33.md

Historical record from [`docs/ai-ambush-proposal-v33.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/ai-ambush-proposal-v33.md), original Git blob `7a088823e43c719d0ec99122600fcc70f58861f8`. Later records take precedence where findings changed.

### Defending AI ambush proposal — discussion only

No new battle AI policy is implemented in v33. The current policy remains in `mjs/ai-battle.mjs`; its knobs remain in `mjs/ai-parameters.mjs` and `config/ai-config.json`. Native automatic ambush is a rule in `mjs/battle.mjs`, independent of the tactical policy.

1. Predict several plausible attacker routes to the palace using the existing terrain-aware pathfinder. Mountains are impassable; water costs five; occupied cells and fire constrain the route. Consider routes around blockers rather than one shortest geometric line. Use visible enemy positions; do not read hidden enemy intentions.
2. For each jungle hex, score predicted movement steps `(from, to)` where that jungle occurs in `ambushCells(from, to)`. The native rule tests three forward hexes on entering a tile. Simply standing beside any route tile is insufficient. Weight routes by plausibility, expected losses, attacker strength and palace risk; INT ≥90 targets receive no ambush loss.
3. If already in a useful jungle, Wait. Otherwise choose the nearest reachable **useful** jungle, rather than the nearest jungle regardless of route. Keep the palace guard in place unless another officer can maintain the defence.
4. After an ambush, recalculate on the next legal defender activation. Ambush itself spends no order or mobility, but movement still needs an unused daily order and enough mobility. Do not grant a free move during the enemy's phase. Moving again into hostile adjacency may stop movement or expose the unit.
5. Reposition to a second interception jungle only if its predicted benefit exceeds staying, it is reachable without unsafe water/fire exposure, and the palace remains protected. Otherwise hold, attack a nearby threat, or retreat normally.

An expected-loss score can compare jungle candidates using the verified ambush equation averaged over its finite random rolls. The AI's route beliefs, risk weights and reposition policy are remaster strategy choices, not recovered original-game equations. Tuning should stay in the dedicated AI module/config; rule arithmetic and the advisor system should remain separate.

Suggested validation: north-to-south advance through the middle jungle; a mountain detour; equal routes on either side of a river; an INT-90 attacker; an occupied interception jungle; and an exhausted defender that ambushes but must wait until the next activation to reposition.



<a id="record-native-battle-v33"></a>
## native-battle-v33.md

Historical record from [`docs/native-battle-v33.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/native-battle-v33.md), original Git blob `7a210f1b929a08d8eee1830764cb0946ab163d59`. Later records take precedence where findings changed.

### Native battle and local governance verification — v33

The supplied English `main.exe` supersedes the Python reconstruction. Its SHA-256 is `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. All addresses below are **unpacked load-image offsets**, not packed-file offsets or relocated DOS addresses. No executable is distributed with this game.

#### Evidence and reproduction

`tools/verify-original.py <original-file-directory> docs/original-v33-checks.json` verifies 115 frozen byte witnesses, including the original captive menus, hostility write, local AI dispatch tables and ambush/flight paths. The supplied scenario file still gives Liu Bei exactly three officers in 189; that investigation remains closed.

Install optional Python `unicorn`, then run `python tools/verify-native-battle.py <main.exe> docs/native-battle-vectors-v33.json`. This runs **812 controlled native cases**: 240 ambush, 240 flight, 160 Train, 160 Give and 12 movement/ambush geometry cases. Arithmetic executes unchanged in a bounded 16-bit emulator; UI, ownership tests and random draws use controlled hooks. It does not run DOS or establish complete game parity. `node tests/v33-tests.mjs` compares the remaster to those recorded results. V32's separate 1,300 normal-melee/domestic cases remain valid.

#### Captured ruler

`0xA212` is the distinct ruler-captive handler. It displays `1.Set free 2.Behead` via the DS `0x46A9` string, then requests a choice in the range 1–2. The ordinary captive handler uses DS `0x46E5`, `1.Recruit 2.Set free 3.Behead`, and defers the ruler until after other captives. **No remaining-province count gate was found in that ruler menu**: v33 consequently prohibits ruler recruitment even when their realm is landless. This is stronger than the requested surviving-province restriction and follows the observed menu.

Execution at `0x9AFA` invokes ruler removal/succession; `0x9B81` writes 100 to the successor realm's hostility toward the killer and records the enemy. Existing clan-destruction and heir artwork/event handling is retained. If no successor exists, the clan destruction path applies.

#### Automatic ambush

`0x24938` checks three cells selected by the direction table at DS `0xB5FE`. These are hexes in the entering unit's forward arc, **not all eight surrounding square cells**. `0x239D6` tests for an occupied hostile jungle cell. `0x247C6` computes the ambush; `0x2488D` protects targets with INT ≥90. The v50 audit corrects the earlier readiness interpretation: an ambush spends the ambusher's daily order but retains mobility, even on INT90 evasion. An already-ordered unit can still ambush again. Movement, taunt and charge landing use the same trigger geometry. See [native-combat-v50.md](changes.md#record-native-combat-v50).

Let `P = 3 × (WAR + Lu Bu bonus 20) + training + min(100, floor(100 × weapons / men))`. For the moving unit's terrain divisor `T` from v32 and integer roll `R` in 0–299:

`raw = trunc(trunc(10 × (P_mover − P_ambusher − min(ambusher men, R)) / T) / D)`

`loss = min(mover men, 3 × (raw < 0 ? −raw : integer roll 1–30))`

`D` is difficulty when a human ambusher attacks an AI moving unit; otherwise 1. Weapons fall proportionally to pre-hit equipment percentage. No counterattack occurs. INT ≥90 consumes no loss RNG and takes zero loss. A zero-men victim leaves the field and emits a capture status. Native concealment flags, secret-pact distinctions and the complete surrounding tactical UI are not fully reconstructed.

#### Voluntary flight and commander withdrawal

`0x25566` first checks horse flag `0x40`: a horse guarantees escape. For other officers it restores mobility using native activation, then computes:

`chance = min(100, floor((10 × mobility + WAR + training + floor(men / 100)) / (adjacent hostile units + 2)) + ruler bonus 20 + Lu Bu bonus 20 + integer roll 0–9)`

A subsequent roll in 0–99 must be strictly less than chance. **INT is absent**. Native destination routine `0x25810` accepts adjacent same-owner or unoccupied provinces. A defender cannot flee into the hostile invading source, but can flee to another friendly neighbour. The remaster reserves empty destinations to prevent conflicting ownership across individual withdrawals/save-load.

Commander Flee confirms whole-army defeat (`0x2CE9C`/`0x2CF0F`), then each officer chooses a destination and attempts escape separately (`0x2CDEA`/`0x25670`). V33 implements this for voluntary withdrawal and reports success or capture. Zero destinations prevent a voluntary withdrawal. **Compulsory post-defeat retreats** (`0x2CFBE`) and AI destination selection (`0x2574C`) are distinct paths: their complete UI/settlement integration remains outstanding. The previous post-battle reserve capture approximation is explicitly not validated by these flight tests.

#### Train and Give

Train (`0x10FDE`) sums `floor(men / 100)` separately for every army with training below 100. `gain = floor(2 × trainer WAR / isqrt(1 + sum))`; the update at `0x1102E` applies to every officer, including zero-men officers, capped at 100. Fully trained armies do not dilute the denominator.

Give (`0x106A0`) uses **local governor CHA**, not a distant ruler:

`gain = floor(floor((governor CHA + acting officer CHA) / 2) × isqrt(food) / ((6 + difficulty) × isqrt(floor(population / 100)))) & 255`

The native helper returns 65535 for a zero denominator; its low byte is 255. An already fully loyal province cannot use Give. Numeric forecast values use this corrected arithmetic; advisor availability, cached monthly confidence and advice logic are unchanged.

#### Local governance priorities

`mjs/native-governance-priority.mjs` centralizes the recovered tables and retry logic; `mjs/ai-governance.mjs` invokes it after the existing strategic prelude. This is a port of **local dispatch ordering**, not a claim that every eligibility test or strategic action is native.

| Table / group | Native order |
| --- | --- |
| DS A2E6: military | Train, Hire, Reassign, Buy weapons |
| DS A2F6: personnel | Reward, Recruit free officers, Search, Teach writings |
| DS A306: domestic | Give, Cultiv, Flood, Sell food, Buy horses |
| DS A31A: policy 0 | Domestic, Personnel, Domestic, Military, Movement/supply |
| DS A31A: policy 1 | Domestic, Military, Movement/supply, Personnel, Military |
| DS A31A: policy 2 | Personnel, Domestic, Personnel, Military, Movement/supply |

The last domestic handler (`0x1FE68`) increments province byte +0x19 (horse inventory), costing 100 gold per horse; it is **not fort construction**. `0x1C26C` selects policy 0 for governor ambition <80 and random policy 1 or 2 otherwise. Group handlers choose a random start and advance cyclically until success: military tries `floor(difficulty / 2) + 2`; personnel/domestic try `difficulty + 1`. Domestic Cultiv/Flood eligibility and investment recovered at `0x2011C`/`0x2016A` use investment `floor(isqrt(gold)/2)` with a minimum of `4 × difficulty`, plus the native attribute-dependent chance.

Remaining work includes native strategic war/diplomacy prelude, actor sorting probabilities, complete eligibility/investment for other local orders, movement/supply internals, delegated-policy flag mapping, compulsory retreat UI, capture/recruit coefficients, duel equations, abstract combat and event scheduling. Existing human advisor behavior is intentionally preserved. The scope must not be described as all battle/governance mechanics matching DOS.

#### Release validation

All 328 regression checks (`npm test`) and the raster interface suite (`npm run test:ui`) pass. The interface suite covers delayed field-result playback, separate general/commander flight, commander flag marking, unchanged governance navigation, Hard spectator continuation, mounted messenger decisions and saved battle restoration. These are automated DOM/Canvas checks; physical handset appearance and audible music need device review.



<a id="record-battle-equations-v32"></a>
## battle-equations-v32.md

Historical record from [`docs/battle-equations-v32.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/battle-equations-v32.md), original Git blob `f8ef2e62042a03adc682e8a7bcded0eb50b267d4`. Later records take precedence where findings changed.

### V32: recovered domestic and battle equations

The supplied English `main.exe` supersedes the Python reconstruction. Addresses below are physical offsets in the unpacked executable, not offsets in its compressed on-disk representation. Executable SHA-256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.

These findings come from static control-flow inspection and bounded execution of unchanged arithmetic routines. They do not constitute a complete DOS playthrough. The test harness intercepts the original random-number helper with controlled rolls and executes no DOS services.

#### Cultiv and Flood

Both orders call the shared routine at `0x10750`. Cultiv passes Land (`0x107EC`, province byte `+0x16`); Flood passes flood protection (`0x107C6`, byte `+0x18`). Each uses the selected general's **INT and CHA**. WAR has no role in this recovered calculation.

Let `V` be the current attribute, `G` the gold spent (1–100), and `D` the difficulty (1–5). All square roots round down:

```text
A = INT + floor(CHA / 2)
B = floor((100 - floor(V / 2)) * G / 100)
C = floor(sqrt(B * A))
H = floor((D + 1) / 2)
gain = max(0, floor(sqrt(floor(C / H))) - D)
new attribute = min(100, V + gain)
```

The final subtraction is **D**, not H. The subtraction helper at `0x04A2C` saturates at zero. The former remaster formula followed the Python reconstruction's smaller subtraction; v32 fixes the order, preview, AI and delegated development together. Gold is spent and the chosen general uses their monthly action. An attribute already at 100 cannot improve.

#### Army power and equipment

The native officer record contains soldiers at word `+0x12`, weapons at word `+0x14`, and training at byte `+0x16`. The weapons word is not morale. Equipment coverage comes from `0x0533E`:

```text
E = min(100, floor(100 * weapons / soldiers))
P = 3 * (WAR + bonus) + training + E
```

Zero soldiers yields E = 100 in the native helper, but such units do not conduct melee. The power routine at `0x23702` gives **+20 WAR** when the native face word is `0xA3` (Lu Bu; zero-based portrait 162 in scenario data). No other portrait bonus is inferred here.

Soldier count does not multiply P. It limits casualties and the random opposing-men term. Thus twice as many soldiers is not twice the recovered normal-melee power.

#### Normal melee casualties

The signed-loss helper at `0x2375A` is called for both armies using their **pre-exchange** powers and soldier counts. For each army:

```text
R = random integer 0..299
raw = trunc(trunc(10 * (own P - opposing P - min(opposing men, R)) / T) / F)
loss = -raw, if raw < 0
loss = random integer 1..30, otherwise
loss = min(own men, loss)
```

`trunc` rounds toward zero, including negative values. Each army rolls separately. The divisors at `0x3ADD6` are:

| Terrain/context | T |
|---|---:|
| Plain | 10 |
| Jungle | 10 |
| Hill | 12 |
| Mountain | 10 (ordinary movement cannot enter) |
| Water | 8 |
| Fort | 15 |
| Palace | 20 |
| Acting unit assaulting the selected palace defender | 5 |

The palace branch at `0x23790` overrides the **acting unit's own casualty divisor** with 5. The defending unit retains its palace divisor of 20. A water attacker does not retain a water divisor of 8 in that particular assault branch.

Normal F = 1. Simultaneous attacks use the participating-unit count as the acting unit's own-loss factor; the defending unit's factor remains 1. The caller at `0x24C58` adds D−1 to the acting unit's factor when an AI unit attacks a human target. This difficulty benefit is not added to AI-versus-AI or human-versus-AI exchanges.

### Controlled examples

With equal powers, both armies at least 150 men, R = 150, and F = 1:

| Exchange | Acting army loses | Target army loses |
|---|---:|---:|
| Plain against plain | 150 | 150 |
| Water attacker against palace defender | 300 | 75 |

With different powers or random rolls, the losses need not follow that simple ratio. The corrected implementation includes these effects rather than imposing a fixed casualty percentage or always forcing the attacker to lose more.

A weak 1,000-man water unit **can** be annihilated by one strong melee exchange, including a sufficiently strong Lu Bu army with a high opposing random roll. There is no recovered fixed 1,000-man kill or minimum. Conversely, equal powers and R = 0 enter the 1–30 fallback, not a large guaranteed loss.

The weapon-loss helpers at `0x235A8` and `0x235C4` remove `floor(actual soldier losses * old E / 100)` weapons, bounded by the army's old weapon stock. V32 applies both soldiers and proportional equipment losses to both sides and preserves them through settlement.

#### Charge, morale and defeat

Charge's routine at `0x26399` selects **1–10 exchanges**, replacing the former remaster fixed three. Each exchange uses the corrected casualty calculation. A charge that reduces its target to zero occupies that target's tile immediately; it cannot then overcharge beyond that defeated target.

No melee morale subtraction or morale-at-ten rout appears in the recovered path. V32 removes that unsupported rout and morale contribution to tactical/abstract power. The legacy save field is preserved for compatibility; it is unused and omitted from battle inspection. This does not assert that every unrecovered strategy or event branch has been decoded.

A side can lose with thousands of ordinary soldiers remaining:

- Its food reaches zero: the native food checks at `0x22DBC` and `0x22DD0` end the battle immediately.
- Its commander is removed: commander outcome checks at `0x25207` and `0x2521F` do not require every other unit to be annihilated.
- A valid palace occupation or army withdrawal can end the battle.

The strategic Events summary now includes the recorded outcome reason and survives tactical-log eviction/save/load. Watched spectator battles return to Events. Without the affected save, no particular observed defeat can be attributed to one cause retrospectively.

#### Province deployment zones

The loader at `0x2709E` reads 156 terrain bytes for each province and the 156-byte zone block at `41 * 156 + provinceIndex * 156`. The predicate at `0x23992` checks that a chosen cell's zone equals the originating province number.

The audited original `Hexdata.dat` contains **41 maps, 186 directed neighboring approaches, five passable attacker cells per approach and twenty defender cells per province**. Several cells shift inward depending on the province; a uniform template per direction is insufficient. All explicit target/source coordinates are recorded in [deployment-v32.json](deployment-v32.json).

Resource reference commit: `99bdf5a1516e5b7d9ef8def4c935a11319e88bd9` of `https://github.com/JuQiang/Rotk2_Python`. Verify its local original resource with `python3 tools/verify-deployment.py /path/to/Hexdata.dat`.

No English-edition `Hexdata.dat` was supplied. These original resource bytes are from the pinned JuQiang repository's Chinese game resource; its terrain portion matches all current game terrain bytes. The supplied English executable confirms the loader and predicate, but cross-edition resource-byte identity remains unverified.

V32 uses these province-specific cells for placement, Province Map previews, AI deployment, reinforcement arrival and validation. Legacy deployment saves are migrated; already fighting armies retain their current positions.

#### Five-unit main invading army

Initial War selection uses the five-unit helper at `0x128A0`, called from `0x156E2`. The ongoing-war helper at `0x1F044` compares the sending ruler with the defender: defender list CB72 has capacity ten, main attacking list CB86 has capacity five, with existing and pending units deducted. Assignment is at `0x1EBD2`.

The tactical Reinforce menu at `0x2CCFC` is defender-only; an attacker reaches “Can't use that command!”. Thus the native evidence does **not** support adding five more ordinary units from another province belonging to the same attacking ruler. Such troops may fill vacancies in the five-unit main list. Allied attacking support remains a separate five-unit contingent in the remaster, with ten total field units.

The remaster's convenient attacker reinforcement button remains an extension to original monthly War dispatch. Its capacity now respects the main-list limit. Complete native allied scheduling and the initial defender selection UI remain untraced; the ten-unit field bound is not an unlimited defender claim.

#### Reproduce the arithmetic checks

From the game directory, with the supplied executable and scenario.dat available together in the original-files directory:

```sh
python3 tools/verify-original.py /path/to/original-files-directory /tmp/original-checks.json
python3 -m pip install unicorn
python3 tools/verify-native-equations.py /path/to/main.exe /tmp/native-vectors.json
node tests/v32-tests.mjs
```

The first command asserts 97 native byte checks. The second verification tool runs **1,300 bounded native cases**: 500 domestic, 100 power and 700 casualty vectors, each checked against a separate integer formula. The committed [native-equation-vectors-v32.json](native-equation-vectors-v32.json) allows production regression testing without distributing or executing `main.exe`. Randomness is controlled only for verification, not in normal gameplay.

Remaining approximations include hidden ambush triggers/context, challenge, capture/retreat probability, AI policy, abstract battle coefficients, and allied scheduling. The recovered normal-melee equation is not evidence that these other systems match the original.



<a id="record-artwork-v31"></a>
## artwork-v31.md

Historical record from [`docs/artwork-v31.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/artwork-v31.md), original Git blob `a7e283ccf60471e4a26b4fed4dc269d757123b0b`. Later records take precedence where findings changed.

### V31 ruler lifecycle artwork

Generated 2026-10-09 with ImageGen. These are two original historical illustrations, not copies of DOS graphics or authenticated portraits. Each output is one continuous 1983 × 793 RGB panorama (approximately 2.5:1), filling the event frame edge to edge. The game uses proportionate scaling. The PNG masters were encoded as WebP at quality 93 without resizing, cropping or stretching.

| Event | Runtime asset | Composition |
| --- | --- | --- |
| Clan destroyed | `assets/artwork/clan-destroyed-v31.webp` | Abandoned palace, empty throne, extinguished lamps, fallen banner, broken seal and departing retainers. |
| Heir vows vengeance | `assets/artwork/heir-vows-vengeance-v31.webp` | Funeral court, mourning heir receiving the seal before the deceased ruler's memorial, with grieving generals. |

Both images were visually reviewed as full-frame scenes with matching late-Han court materials, muted jade/ochre/vermilion colours and natural faces. They contain no gameplay UI or event captions. The renderer registers them as single-frame atlases; the event system selects them for clan extinction and attributed violent succession. `config/release.json` records their SHA-256 hashes together with all active enlarged v30 event art.

#### Clan-destroyed generation prompt

```text
Use case: historical-scene.
Asset type: late Han / Three Kingdoms strategy game event illustration.
Primary request: CLAN DESTROYED, a symbolic fall of a ruler's realm. Create exactly ONE continuous, single-scene, full-bleed panoramic historical Chinese painting.
Scene/backdrop: an abandoned late Han ceremonial palace courtyard at dusk, with carved dark wooden palace architecture, vermilion columns, worn stone paving and distant misty mountains.
Subject: an empty ceremonial throne on its dais, extinguished bronze lamps, a fallen torn vermilion banner with no lettering, and a broken jade royal seal in the foreground. A small group of defeated retainers in historical Chinese robes and worn armor quietly depart through the courtyard gate, backs turned or downcast natural human faces.
Style/medium: rich, finely detailed historical Chinese ink and painted illustration, cinematic narrative realism, natural human faces, convincing late Han clothing and architecture. Match the rich dark wooden courts, layered dramatic depth, restrained brush texture, fine garments, natural faces, and warm muted lighting of the supplied style description.
Composition/framing: exact 2.5:1 ultra-wide panorama, intended for an event canvas 500x200; render at 2560x1024 if possible. Show the entire scene edge to edge; no collage, contact sheet, panels, seams, frame, border, gutters, blank margins or vignette. The deserted throne remains the clear central narrative focus, with the broken seal visibly readable as an object and the departing retainers supporting the story.
Lighting/mood: subdued ochre dusk fading into jade-gray shadows, tragic quiet aftermath, thin mist and cold smoke from extinguished lamps.
Color palette: muted jade, ochre, vermilion, weathered gold, charcoal and warm brown.
Constraints: no readable lettering, no text, no titles, no UI, no watermark, no gore, no mutilation. This is one complete panorama, not a sheet of illustrations.
```

#### Heir-vows-vengeance generation prompt

```text
Use case: historical-scene.
Asset type: late Han / Three Kingdoms strategy game event illustration.
Primary request: HEIR VOWS VENGEANCE. Create exactly ONE continuous, single-scene, full-bleed panoramic historical Chinese painting.
Scene/backdrop: a late Han funeral court inside a grand ceremonial palace hall, carved dark wood, vermilion columns, bronze vessels, pale funeral streamers and soft incense smoke.
Subject: a mature adult heir, with a natural expressive Chinese face, receiving a jade royal seal from a grieving senior minister before his deceased father's plain memorial tablet. The heir wears dignified white mourning clothing, his jaw tense and eyes resolute and angry. Grieving veteran generals and retainers in historically appropriate robes and armor gather around him. The father's memorial tablet is clearly a funerary object but bears no readable letters. White mourning garments and funeral streamers establish the funeral setting. Imply a rival's threatening shadow in the distant architecture and atmosphere, without adding a separate portrait or supernatural figure.
Style/medium: rich, finely detailed historical Chinese ink and painted illustration, cinematic narrative realism, natural human faces, convincing late Han clothing and architecture. Match rich dark wooden courts, layered dramatic depth, restrained brush texture, fine garments, natural faces, and warm muted lighting.
Composition/framing: exact 2.5:1 ultra-wide panorama, intended for an event canvas 500x200; render at 2560x1024 if possible. One continuous composition, edge-to-edge painted environment. The seal handover and mature heir's face are the central readable focus, with the father's memorial and mourners supporting the narrative. No collage, contact sheet, panels, seams, frame, border, gutters, blank margins or vignette.
Lighting/mood: somber cinematic funeral light, muted warm ochre from bronze lamps and cool jade-gray shadows, grief turning into resolve.
Color palette: muted jade, ochre, restrained vermilion, ivory white, charcoal, warm brown and weathered gold.
Constraints: no readable lettering, no text, no titles, no UI, no watermark, no gore, no visible body. This is one complete panorama, not a sheet of illustrations.
```

The image model returned 1983 × 793 rather than the requested optional 2560 × 1024; the native output is retained. The artwork is symbolic and shared across rulers. The successor can be a loyal officer rather than the deceased ruler's literal son; the illustration does not alter kinship or succession rules.



<a id="record-artwork-v30"></a>
## artwork-v30.md

Historical record from [`docs/artwork-v30.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/artwork-v30.md), original Git blob `5d759b089c4bc355a74b23a7af1591be719a1d6f`. Later records take precedence where findings changed.

### V30 artwork

Built-in image generation edited the existing v29 atlases. All event scenes extend to the cell edges; no dark matte, stretching or scene cropping. Historical artwork is packed at 3966 × 1586 (4 × 4); disasters, omens and stories at 1983 × 793 (2 × 2). Each cell matches events.webp at 991.5 × 396.5. The generated wide scenes were inspected before and after packaging.

Liu Bei's edited third portrait cell uses a close bust like Cao Cao, retaining maturity and long earlobes. Only that cell is integrated into the previous atlas, preserving the other portrait compositions. Runtime paths:

- assets/artwork/officers-historic-v30.webp
- assets/artwork/history-v30.webp
- assets/artwork/disasters-v30.webp
- assets/artwork/omens-v30.webp
- assets/artwork/stories-v30.webp

#### Final prompt set

### history30

Use case: precise-object-edit. Edit target: historical illustration atlas, four columns and four rows, fifteen historical scenes plus final council scene. Extend each scene sideways to fill its entire rectangular cell edge to edge. The current dark blank margins are a packaging defect: replace ALL plain dark blank side strips with natural painted continuations of THAT cell's scene (architecture, landscape, sky, people where appropriate). Preserve every central character, face, story and row-major scene order. Maintain Liu Bei's mature identity and long earlobes. Each cell must have a wide landscape aspect ratio 2.5:1, overall atlas also 2.5:1. Sixteen separate wide scenes, straight aligned 4x4 grid; no gutters, no borders, no matte, no plain blank canvas. Painterly ancient Chinese historical game art. Do not crop away central story. Fill the entire canvas with scene artwork.

### disasters30

Use case: precise-object-edit. Edit target: 2 by 2 disaster illustration atlas. Extend each existing scene sideways to fill the entire cell, eliminating all dark blank margins. Top left locust famine, top right uprising, bottom left coastal typhoon, bottom right flood. Preserve the central subjects and their faces; outpaint appropriate fields, village, stormy coast and submerged town around them. Four wide landscape cells, each 2.5:1; overall canvas 2.5:1. Precise aligned 2x2 grid, no gutters, no borders, no matte or blank strips. Painterly ancient Chinese strategy game illustration. Artwork must fill every cell edge to edge.

### omens30

Use case: precise-object-edit. Edit target: 2x2 event atlas. Fill every dark blank side margin with natural painted continuation of that scene. Preserve central people, faces and story. Row-major scenes: epidemic care, comet omen, troop deployment, territory occupation. Each of four cells is wide 2.5:1 landscape; overall canvas 2.5:1. Exact 2x2 grid without gutters, borders, matte or blank strips. Painterly ancient Chinese game style. Edge-to-edge artwork; preserve composition and extend rather than stretch.

### stories30

Use case: precise-object-edit. Edit target: 2x2 event atlas. Fill every dark blank side margin with natural painted continuation of that scene. Preserve central people, faces and story. Row-major scenes: Xun Yu planning, officer mourning, Diaochan chain stratagem, Hua Tuo medical treatment. Each of four cells is wide 2.5:1 landscape; overall canvas 2.5:1. Exact 2x2 grid without gutters, borders, matte or blank strips. Painterly ancient Chinese game style. Edge-to-edge artwork; preserve composition and extend rather than stretch.

### portrait30

Use case: identity-preserve. Edit target: 4x4 general portrait atlas. Change ONLY Liu Bei, third cell of first row. Enlarge/reframe him to match the scale of the other portraits, especially Cao Cao immediately to his right: large head and shoulders, close bust, face occupies comparable portion of square cell, robe extends to the lower corners, no blank side strips. Preserve his mature dignified face, long earlobes, moustache and tapered grey beard, green/gold robe, jade background and crown. Keep all other fifteen cells pixel-composition and character identity unchanged. Keep square overall atlas, precisely aligned 4x4 grid, no borders or gutters. Do not make Liu Bei younger. No text.




<a id="record-artwork-v29"></a>
## artwork-v29.md

Historical record from [`docs/artwork-v29.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/artwork-v29.md), original Git blob `5afb227e2c078a44b732a2fc0e2f322c9c7d04d7`. Later records take precedence where findings changed.

### V29 artwork

Generated with the built-in image-generation tool, then proportionally packaged with Canvas. Existing assets remain as provenance. Runtime replacements:

- `https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/assets/liu-bei-v29.webp`: portrait master, generated at 1086 × 1448.
- `assets/artwork/officers-historic-v29.webp`: replaces only Liu Bei's third cell in the v16 atlas.
- `assets/artwork/history-v29.webp`: revised historical scenes, source 1254 × 1254, packaged 3966 × 1586.
- `assets/artwork/disasters-v29.webp`, `assets/artwork/omens-v29.webp`, `assets/artwork/stories-v29.webp`: existing artwork repackaged at 1983 × 793.

Portrait prompt specification: Create a mature Liu Bei, approximately 45–50 years old like the established Cao Cao portrait, dignified East Asian face, distinctive long pendulous earlobes, moustache and tapered beard with subtle grey, green and gold court robes and crown, dark jade background. Preserve the established painterly game portrait style. References: `officers-historic-v16.webp`, `history-v28.webp` and the user's attached image.

Historical edit specification: Preserve the four-by-four historical atlas and the other characters/scenes. Align Liu Bei in cells 3, 6, 11 and 13 (zero-based: Xu Province, three visits, Shu coronation, deathbed) with the new portrait's mature identity, long earlobes, moustache and beard. Maintain appropriate ageing and costumes for each scene. References: the existing atlas and new portrait.

The master portrait and edited atlas were visually reviewed together. Appearance is an illustrative interpretation; no authentic historical portrait is asserted. `tools/normalize-event-art.mjs` reproducibly contains each source cell on a dark matte at the aspect ratio and exact dimensions derived from `events.webp`; it neither stretches nor crops the art.



<a id="record-artwork-v28"></a>
## artwork-v28.md

Historical record from [`docs/artwork-v28.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/artwork-v28.md), original Git blob `6f93ad4ea4cd19d29e8bd0ee1ed885ca362ae50f`. Later records take precedence where findings changed.

### V28 historical event artwork

Generated with the built-in image-generation tool. `assets/artwork/history-v28.webp` is a 1254 × 1254, 4 × 4 atlas converted from the generated PNG without changing proportions. Cells 0–14 correspond to historical years 189, 190, 192, 194, 197, 200, 207, 208, 215, 219, 220, 221, 222, 223 and 229; cell 15 is an illustrated fallback. Paintings are artistic reconstructions of the game chronicles, not documentary likenesses. Runtime cropping uses equal fractional cell dimensions and centered proportional scaling.

#### Generation prompt

Create one game artwork sprite atlas: a perfectly regular 4-column by 4-row grid, sixteen equal square paintings, no gutters, no labels, no text, no interface or borders. Art style: elegant painterly historical Romance of the Three Kingdoms strategy game illustrations, clean detailed faces and Han dynasty buildings, warm parchment gold and jade tones, dramatic yet readable compositions. Each cell entirely independent, exact row-major order: 1 Dong Zhuo, imposing bearded warlord in ornate dark armor, controlling the Han emperor's court at Luoyang; 2 coalition lords gathering with burning Luoyang distant; 3 Wang Yun and Lu Bu conspiring against Dong Zhuo, palace candlelit scene no gore; 4 elderly Tao Qian entrusting Xu Province to Liu Bei; 5 Yuan Shu declaring himself emperor on extravagant throne; 6 Cao Cao at Guandu overseeing a raid on supply granaries; 7 Liu Bei with Guan Yu and Zhang Fei visiting Zhuge Liang at a quiet thatched cottage, feather fan; 8 Red Cliffs fleets burning on Yangtze under night sky; 9 Cao Cao taking mountain fortress Hanzhong; 10 Guan Yu in green robe surrounded at Jing Province riverside; 11 Cao Pi receiving Han emperor's abdication ceremonial scroll; 12 Liu Bei proclaiming Shu Han in Chengdu imperial hall; 13 Lu Xun overlooking a decisive fire counterattack at Yiling forest battlefield; 14 Zhuge Liang at Liu Bei's bedside at Baidicheng, solemn tasteful deathbed; 15 Sun Quan proclaiming Wu in grand hall; 16 Han dynasty council of scribes and envoys as universal historical fallback. Ensure exactly four rows and four columns, every painting fills its cell. All era-appropriate, no modern objects.



<a id="record-artwork-v23"></a>
## artwork-v23.md

Historical record from [`docs/artwork-v23.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/artwork-v23.md), original Git blob `6c335a326c2ad83e4b8d0effbc1df9b0a89ef89d`. Later records take precedence where findings changed.

### V23 army artwork

`assets/artwork/army-v23.webp` is an AI-generated transparent Han-era army formation sheet, converted from the generated PNG without changing its proportions. The requested layout was four columns by four rows: red marching, red attacking, blue marching and blue attacking. Formations use groups of soldiers, spears, armour and blank cloth banners. Names are overlaid at runtime so officer names remain accurate in both languages.

Production prompt: Create a transparent 4×4 sprite sheet of compact Han dynasty army formations, each containing 10–14 soldiers, viewed from an elevated isometric angle. Red clothes in the first two rows, blue clothes in the last two. Row 1 and 3 are marching frames; row 2 and 4 are attacking frames. Match the existing painted strategy game, use crisp readable silhouettes and clean separated cells, with blank banners and no letters or numbers.

The selected image is 1254×1254. The renderer samples only the first two columns for march and attack animations: later columns contain spear overlap across cell boundaries. An attempted gutter edit did not reliably remove this overlap and was not selected. The displayed sprites preserve aspect ratio. No officer portraits or battlefield paintings were replaced.



<a id="record-artwork-historic-portraits-v16"></a>
## artwork/historic-portraits-v16.md

Historical record from [`docs/artwork/historic-portraits-v16.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/artwork/historic-portraits-v16.md), original Git blob `7505441389f7fa3460dfc05088fa89178c585e94`. Later records take precedence where findings changed.

### Historical portrait revisions — v16

The new atlas is `assets/artwork/officers-historic-v16.webp`, loaded as `officersHistoric`. Fifteen canonical identities use new portraits; Xiahou Dun has two dated variants, for sixteen distinct cells. The other 337 historical identities retain their individual portraits. There are still **352 distinct historical officers and 352 distinct displayed portraits in each campaign year**. Custom officers retain their reserved portrait.

These are artistic reconstructions, not contemporary likenesses. Physical descriptions in the Records of the Three Kingdoms are sparse and may be rhetorical. Costume, colour, apparent age, facial geometry and hair are imagined unless a specific basis is listed. The fan, feather crest and elderly archer conventions are identified as later literary iconography. No original game bitmap was copied.

| Cell | Identity | Portrait basis and limits |
|---|---|---|
| 0 | Zhuge Liang | Scholar’s bearing; SGZ 35 records considerable height. White robes, silk scholar headcloth, narrow beard and feather fan are traditional literary/artistic conventions. |
| 1 | Zhao Yun | The annotated biography describes an imposing appearance. Silver armour, clean-shaven face and white plumes are artistic choices. |
| 2 | Liu Bei | Long earlobes reflect SGZ 32. The Zhang Yu anecdote in SGZ 42 explicitly describes him as beardless; the portrait is clean-shaven. Green robes and facial geometry are imagined. |
| 3 | Cao Cao | Alert expression, dark court clothing and short beard are an artistic reconstruction; no exact facial likeness is claimed. |
| 4 | Sun Quan | Broad jaw and dignified bearing draw on the Jiangbiao zhuan annotation in SGZ 47. Brown eyes and a subtle warm brown beard avoid presenting the novel’s green eyes/purple beard as a secure historical fact. |
| 5 | Xiahou Dun, from 198 | Closed scarred left eye, which is on the viewer’s right in this near-frontal portrait. His biography records losing the left eye against Lü Bu. The 198 cutoff follows the usual campaign chronology, not an injury event in the remaster. |
| 6 | Dian Wei | Strong neck/shoulders and paired ji reflect the recorded exceptional strength and paired halberds in SGZ 18. Facial hair and armour details are imagined. |
| 7 | Guan Yu | Long beard follows the historical description; green headcloth is conventional iconography. Skin is naturally warm rather than an asserted literally red face. |
| 8 | Zhang Fei | Broad face, heavy beard and fierce bearing are familiar literary iconography, not a verified biographical facial description. |
| 9 | Lü Bu | Athletic warrior with feathered helmet is an artistic/literary interpretation, not a documented surviving likeness. |
| 10 | Zhou Yu | Refined handsome bearing follows his SGZ 54 biography. Red/white clothes and armour are artistic choices. |
| 11 | Sima Yi | Mature strategist with narrow greying beard and scholar headcloth; exact features are imagined. |
| 12 | Huang Zhong | Weathered elderly archer is traditional iconography; white beard/age depiction is not asserted to be a surviving historical description. |
| 13 | Sun Ce | Handsome young warrior follows his SGZ 46 biography. Armour colours and hair are imagined. |
| 14 | Xu Chu | Broad, powerful build reflects his SGZ 18 description of large stature and waist. Facial hair and armour are imagined. |
| 15 | Xiahou Dun, before 198 | Same identity as cell 5, with both eyes intact. The portrait changes in 198 even in Fiction mode; this is a dated artwork convention and does not alter officer attributes. |

All placements use the same aspect-preserving atlas renderer, including province header, army comparison, captive cards and general selectors. Manifest entries in `officer-portrait-manifest.json` retain the previous atlas/cell for provenance and record the Xiahou Dun variants.

#### Sources consulted on 2026-10-08

- Chen Shou, *Sanguozhi*, Liu Bei biography, translated by Stephen So: https://kongming.net/novel/sgz/liubei.php
- Chen Shou, *Sanguozhi*, SGZ 42, Zhang Yu anecdote: https://ctext.org/text.pl?if=en&node=603715&show=parallel (indexed passage; full-page retrieval was unavailable).
- Chen Shou, *Sanguozhi*, Zhuge Liang biography, translated by Jack Yuan: https://kongming.net/novel/sgz/zhugeliang.php
- Chen Shou with Pei Songzhi’s annotations, Zhao Yun biography, translated by Sonken: https://kongming.net/novel/sgz/zhaoyun.php
- Chen Shou, *Sanguozhi*, Xiahou Dun biography, translated by HolyMan: https://kongming.net/novel/sgz/xiahoudun.php
- Chen Shou, *Sanguozhi*, Dian Wei and Xu Chu biographies, translated by jiuwan: https://kongming.net/novel/sgz/dianwei.php and https://kongming.net/novel/sgz/xuchu.php
- Chen Shou, *Sanguozhi*, Sun Quan biography and Jiangbiao zhuan annotation: https://zh.wikisource.org/wiki/三國志/卷47
- Chen Shou, *Sanguozhi*, Zhou Yu biography, translated by Battleroyale: https://kongming.net/novel/sgz/zhouyu.php
- Chen Shou, *Sanguozhi*, Sun Ce biography, translated by Jack Yuan: https://kongming.net/novel/sgz/sunce.php
- Chen Shou, *Sanguozhi*, Guan Yu biography, translated by Sonken: https://kongming.net/novel/sgz/guanyu.php
- Luo Guanzhong, *Romance of the Three Kingdoms*, chapter 1, for later Guan Yu/Zhang Fei iconography: https://zh.wikisource.org/wiki/三國演義/第001回

#### Production

Generated with the **built-in image generation tool**, one generation request. Requested 2048×2048; returned and retained a native **1254×1254 RGB** atlas. It is square and is sampled as sixteen equal proportional cells, with no upscaling or stretching. The generated shoulders reach some cell boundaries and Lü Bu’s crest reaches the top of its cell. Each cell remains distinct and the faces are readable at mobile sizes. Runtime WebP encoding uses quality 94. The selected output was copied to the project; no external image URL is needed during play.

Source PNG: `/workspace/scratch/7b6523318ea3/portraits-historic-v16.png`
Runtime asset: `/workspace/sites/rtk2-remastered/dist/rtk2/assets/artwork/officers-historic-v16.webp`

The complete final generation prompt and row/column manifest follow.

### Historic portrait atlas v16

Generated with the built-in image_gen tool in one generation call.

Requested output: 2048 × 2048 pixels; strict 4 × 4 layout; 512 × 512 cells; row-major slots.

Final saved output: 1254 × 1254 RGB, retained at the built-in tool's native resolution as directed. The atlas uses a four-by-four layout with nominal 313.5-pixel cells. Percentage crop rectangles preserve the intended equal-cell layout; a consumer requiring integer pixel crops should round shared boundaries consistently. The output has exactly 16 row-major portraits without labels or gutters. The shoulder edges reach the cell boundaries, and Lü Bu's crest reaches the top edge of its cell, so the requested all-side margins were not fully achieved. Slot 5 has its injured left eye closed on the viewer's right; slot 15 uses the matched identity with both eyes intact.

#### Slot manifest

| Slot | Row | Column | Identity | Crop rectangle as percentages x, y, width, height | Nominal native pixel rectangle |
| --- | --- | --- | --- | --- | --- |
| 0 | 1 | 1 | Zhuge Liang | 0%, 0%, 25%, 25% | 0, 0, 313.5, 313.5 |
| 1 | 1 | 2 | Zhao Yun | 25%, 0%, 25%, 25% | 313.5, 0, 313.5, 313.5 |
| 2 | 1 | 3 | Liu Bei | 50%, 0%, 25%, 25% | 627, 0, 313.5, 313.5 |
| 3 | 1 | 4 | Cao Cao | 75%, 0%, 25%, 25% | 940.5, 0, 313.5, 313.5 |
| 4 | 2 | 1 | Sun Quan | 0%, 25%, 25%, 25% | 0, 313.5, 313.5, 313.5 |
| 5 | 2 | 2 | Xiahou Dun — after injury | 25%, 25%, 25%, 25% | 313.5, 313.5, 313.5, 313.5 |
| 6 | 2 | 3 | Dian Wei | 50%, 25%, 25%, 25% | 627, 313.5, 313.5, 313.5 |
| 7 | 2 | 4 | Guan Yu | 75%, 25%, 25%, 25% | 940.5, 313.5, 313.5, 313.5 |
| 8 | 3 | 1 | Zhang Fei | 0%, 50%, 25%, 25% | 0, 627, 313.5, 313.5 |
| 9 | 3 | 2 | Lü Bu | 25%, 50%, 25%, 25% | 313.5, 627, 313.5, 313.5 |
| 10 | 3 | 3 | Zhou Yu | 50%, 50%, 25%, 25% | 627, 627, 313.5, 313.5 |
| 11 | 3 | 4 | Sima Yi | 75%, 50%, 25%, 25% | 940.5, 627, 313.5, 313.5 |
| 12 | 4 | 1 | Huang Zhong | 0%, 75%, 25%, 25% | 0, 940.5, 313.5, 313.5 |
| 13 | 4 | 2 | Sun Ce | 25%, 75%, 25%, 25% | 313.5, 940.5, 313.5, 313.5 |
| 14 | 4 | 3 | Xu Chu | 50%, 75%, 25%, 25% | 627, 940.5, 313.5, 313.5 |
| 15 | 4 | 4 | Xiahou Dun — before injury | 75%, 75%, 25%, 25% | 940.5, 940.5, 313.5, 313.5 |

#### Final generation prompt

```text
Use case: historical-scene
Asset type: strategy game character portrait atlas, one square bitmap texture.
Primary request: Generate exactly ONE 2048 x 2048 image, a strict 4-by-4 atlas of sixteen equal 512 x 512 square portrait cells. The cell boundaries are at x=512,1024,1536 and y=512,1024,1536. There must be NO drawn grid lines, NO gutters, NO borders and NO text. Each cell is an independent head-and-shoulders portrait against the same dark jade backdrop. No body parts, headgear, feathers, fans or weapons cross any cell boundary. Leave ample dark jade margin on all four sides of each portrait, including at the bottom. All faces consistently centered at the same height and scale; full heads including headgear and shoulder tops are contained in their own cells. Portraits should remain readily distinguishable at 64px thumbnail size.
Style/medium: Detailed hand-painted premium historic strategy game art with realistic East Asian faces. Late Han Chinese materials, robe shapes, cloth headwraps and lamellar armour. Rich restrained color, crisp facial details, subtle brush texture, directional soft illumination. Dignified nuanced expressions, no caricature. Uniform visual style and lighting across all cells.
Backdrop: Uniform deep dark jade, softly painterly with no scenery.
Composition: Exactly four rows and four columns, each cell has exactly one person, sixteen portraits total, fifteen identities because Xiahou Dun appears twice in matched before/after injury variants. Strictly follow this row-major slot manifest:

ROW 1
Slot 0, top-left: Zhuge Liang. Slim composed scholar, high forehead, neat mustache and long narrow black beard, silk scholar headcloth, white robe, white feather fan visible low on chest, never obscuring face. The feather fan and scholar headcloth are conventional literary iconography.
Slot 1: Zhao Yun. Majestic martial bearing, handsome realistic clean-shaven face. Silver-grey Han lamellar armour and Han helmet, white cloth and restrained blue accent.
Slot 2: Liu Bei. Calm benevolent face, clean-shaven, conspicuously long earlobes clearly visible on both ears. Green-gold Han robes and simple Han headgear that does not cover the ears.
Slot 3, top-right: Cao Cao. Sharp watchful expression, short dark beard and moustache, black-red Han court clothes and modest ceremonial Han hat. Imagined historical face, NO modern imperial dragon costume.

ROW 2
Slot 4: Sun Quan. Broad dignified jaw, warm brown beard with a subtle purple-brown tone, natural dark brown eyes, red-gold Han court clothing. NO green eyes.
Slot 5: Xiahou Dun AFTER eye injury. Rugged middle-aged general with short dark beard, dark Han lamellar armour, simple dark Han helmet. Mostly frontal face, scarred CLOSED LEFT eye, which is on the VIEWER'S RIGHT. His other eye is intact and open. No pirate patch. Remember this exact identity and clothes for slot 15.
Slot 6: Dian Wei. Extremely robust muscular neck and shoulders, very powerful build, rough short beard, iron Han lamellar armour. Two small ji polearm tips only glimpsed beside the outer lower shoulders, wholly inside cell and away from face.
Slot 7: Guan Yu. Noble stern bearing, magnificent very long flowing black beard contained in cell, green cloth Han headwrap, dark green Han robe/armour. Natural subtle warm East Asian skin, NOT bright red skin.

ROW 3
Slot 8: Zhang Fei. Broad fierce realistic face, bushy black beard, heavy dark Han armour. Artistic reconstruction with a clearly distinct face and build from Dian Wei and Xu Chu.
Slot 9: Lü Bu. Tall athletic warrior suggested by posture, elegant youthful fierce face, bronze Han helmet with a long feather crest gracefully contained within the upper cell margin, Han armour. Iconic literary crest.
Slot 10: Zhou Yu. Young handsome elegant general, refined clean-shaven East Asian face, red-white Han robe plus light armour.
Slot 11: Sima Yi. Lean mature strategist, penetrating composed eyes, narrow greying beard, dark scholar headcloth, blue-black Han robes.

ROW 4
Slot 12: Huang Zhong. Elder veteran, weathered face and white beard, bronze Han lamellar armour; a subtle bow glimpse low beside shoulder, fully within cell and away from face. Conventional elder-veteran iconography.
Slot 13: Sun Ce. Young handsome confident warrior, clean-shaven, red-bronze Han armour, realistic East Asian face distinctly different from Zhou Yu and Zhao Yun.
Slot 14: Xu Chu. Very broad stocky warrior, powerful thick neck and shoulders, short dark beard, heavy Han armour. Large waist implied by very broad torso, distinctly different face from Dian Wei and Zhang Fei.
Slot 15, bottom-right: Xiahou Dun BEFORE eye injury. The SAME face, beard, headgear, age, dark Han lamellar armour, pose, lighting and facial proportions as slot 5. Both eyes intact and open, no scars. This matched variant represents the same man before 198.

Constraints: Exactly 16 independent portraits in exactly 4 rows and 4 columns; every head and both shoulder tops fully contained with safe margins in its own equal square cell; no cross-cell overlap. Slot 5 scarred closed left eye is viewer-right, slot 15 both eyes intact. All people realistic East Asian, visibly distinct except matched Xiahou Dun identity variants. Late Han clothing, armour and headgear; artistic historical reconstructions with only the stated conventional iconography.
Avoid: any letters, Chinese characters, numbers, labels, signatures, captions, watermark, frame, grid, visible cell dividers, gutters, extra people, extra heads, weapons or fan covering faces, fantasy green eyes, vivid red skin, pirate eyepatch, modern or medieval European armour, Qing imperial dragon robes.
```




<a id="record-differences"></a>
## differences.md

Historical record from [`docs/differences.md`](https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/docs/differences.md), original Git blob `59f36c75d45215562e554511226f8b8da2fbad1f`. Later records take precedence where findings changed.

### RTK2 Remastered — differences from the original game

Initial audit: 2026-10-07 UTC; updated 2026-10-11 (Asia/Kuala_Lumpur)
Baseline audited: v10, commit `be59931216ad6a53f17b6fb7f9632aa8faab604a`
Latest implementation: v52. [Current fixes](changes.md#record-fixes-v52-html) restore remaster BGM, improve battle audio, and correct the previous cell-flag interpretation: simultaneous helpers/targets and automatic ambushers retain their own order; already-acted helpers participate. The complete downloadable project includes source, artwork, tests, optional trained policies and the shared YAML library.
Previous implementation: v35, commit `3c8a0af9135c8ec655146fbaa04534f3fe80c7cd`
Earlier implementation: v34, commit `3c7ebbc1725e53a46016b20e9a55465da935f413`
Earlier implementation: v33, commit `44db3fa70ecee13c75af583ca8e324e395b7cfff`
Earlier implementation: v32, commit `42544e46a69bdf4d5a33dcb1595e9859f41cd2e9`
Earlier implementation: v31, commit `ae1133ecdcbc5b8b9d7641bfe9776cf1f87af4d0`
Earlier implementation: v30, commit `c59646d5f52b72b94247db93f4a40ac7a0b42aca`
Earlier implementation: v29, commit `cbc1c275b19c8bce334de1285228e631e1d1e8eb`
Earlier implementation: v11, commit `4dde4a55523318fc085d494c0fe2da1db359b3b7`
Reference checkout: JuQiang/Rotk2_Python, commit `99bdf5a1516e5b7d9ef8def4c935a11319e88bd9`

The initial v10 audit was read-only. This completed audit incorporates the supplied DOS files and reconciles the v11/v12/v13/v14/v15/v16/v17/v18/v19/v20/v21 implementations against every finding below. Confirmed branch/data defects have been repaired where specified. Outstanding features, accepted user overrides, edition-specific evidence and unrecovered original formulas remain explicit. **This is a complete differences review, not a claim that all original-game mechanics have been reconstructed.**


#### V50 native rules and audio audit

[The v50 fixes note](changes.md#record-fixes-v50-html) supersedes earlier animation-cycle counts and ambusher readiness descriptions. It records per-unit simultaneous losses, simultaneous attacks on concealed jungle targets, local withdrawal rules, governor self-reward evidence and the complete audio dispatch catalogue, including supplied-driver audio extraction. See that note for remaining native AI differences and verification limits.

#### V49 governance, portraits and native tactical corrections

[The v49 fixes note](changes.md#record-fixes-v49-html) addresses the twelve latest reports, explains the verified rules, and links current training profiles and reports. It supersedes earlier descriptions of supply refunds, automatic adjacent jungle revelation, Move enemy, partial weapon lots and palace fire below; the older sections remain as implementation history. Every current profile is retrained under the v49 fingerprint; archived v44/v45 profiles remain incompatible.

Remaining field supplies land at the battlefield province on either outcome. Native weapons prices do not depend on INT. The daily burning-palace store penalty applies even when empty. Human enemy pulling follows actor movement with no selection or enemy MP cost; AI pulls opportunistically after ordinary movement. Native adjacent-attack AI can read hidden jungle occupancy; the remaster intentionally removes that advantage. The full original AI path field is still unreconstructed. Unique portraits, eight custom-ruler options, sorting, capped spending advice, actual neighbouring-tile effects and event alignment are detailed in the current note.



#### V44 optional AI training extensions

Legacy remains the default and its governance/battlefield policy logic is preserved. Optional numerical profiles rank existing legal officer/order pairs through copied-state simulations; they do not alter original combat/economy equations. HUD supports import, global/per-ruler selection, independent mode choices and read-only comparisons. The reusable offline optimizer and game adapters are described in [the beginner manual](ai-training-manual.md). Profiles are engine-fingerprint checked, and obsolete saved profiles revert to Legacy. Trained deployment/challenge, political and covert strategies remain limited; these are documented experimental extensions, not recovered original AI or proven general improvements. [The v44 evaluation note](changes.md#record-ai-training-v44-results) records paired holdout results.

#### v43 — fire timing, battlefield controls and native checks

Fireball ignition now applies the native mode-one loss (randomly below 5%); an acting unit remaining in fire receives mode-zero loss (randomly below 30%). Human and AI use the same resolver. View and a simple army handoff do not burn a unit. Finishing army orders explicitly makes unused units Wait, including their after-order fire check. Rain clears the fire map before day-end spread. V43 replaces the earlier end-of-day casualty check; there is no second universal daily fire charge.

Fire sprites have 50% opacity and continuous size flicker. Normal/Simultaneous animate all participants for five cycles, Charge for ten. Casualties and RNG are resolved once. The active AI selection, hex frame, blink and automatic HUD actor share `nextAIUnit`.

Deployment confirmation sits at bottom right with equal-size Yes/No controls; No resets the current army. Portrait inspection is immediate for friendly generals; enemies require a 100-gold Yes/No confirmation. The extra View unit button is removed. Reachable human movement cells show total route costs; tile taps show terrain, movement and combat effects without spending an additional order. Existing tap-to-move behavior is retained.

Nine bounded checks execute original movement, fire, rain, deployment branches and simultaneous action flags. Five mobility points traverse plain then jungle in the native Move routine. Simultaneous friendly participants spend their order. Original defender deployment has palace-first, forward-position and supply/strength branches; the remaster's nearest-palace deployment remains simplified. See [native evidence and limits](changes.md#record-native-turns-v43).

The reported five-captives/three-decisions mismatch was not reproduced. A regression case creates five captives, checks five pending decisions across save/load, and resolves all five. Victory now lists captured names and the pending count. No capture arithmetic was changed without a reproduced defect.

#### v42 — active orders, combat playback, fire and AI visibility

Completed orders select the next ready general. The interface also repairs missing/exhausted selections on load or render. View/cancel/close restores ordinary map selection; inspection preserves order flags and mobility. The reported loss of all available orders was a control/selection issue, not View spending teammates' turns.

Normal, Charge and simultaneous attacks retain the pre-combat participating units, including the target. All animate together for three 600 ms cycles. Casualties and RNG resolve once; status playback, further orders and AI steps wait for the visual sequence. HUD, dialogs and background visibility pause the sequence. Defeated targets remain visible during it, and Charge landing appears afterwards.

A generated transparent flame sprite overlays burning cells, with continuous opacity and size flicker until the fire map clears that cell. Rendering does not advance fire damage, spread or expiration. The asset and prompt are recorded in ARTWORK.md.

Burning units now apply recovered fire-goal priorities before ordinary palace holding. Twelve bounded native executable checks establish dry-palace/adjacent escape and the >3,000 versus <1,000 commander exception. The complete DOS AI and blocked-escape fallback remain unverified; see [native-fire-v42.md](changes.md#record-native-fire-v42).

Hidden-enemy occupancy/contact leaked into whole-map routing, reachable-cell previews and forest occupancy. These now use visible information. Actual movement can discover an enemy and stop or trigger the existing ambush. Adjacency itself reveals jungle enemies. Against adjacent jungle enemies, equal/better cover permits attack; water waits to bank mobility. This preference is a remaster policy. AI still reads visible enemies' attributes without the human inspection fee; this update removes hidden-position planning leaks, not every information asymmetry.

Validation includes full gameplay and mounted native-Canvas interface checks, three shared animation cycles and delayed status, HUD pause/resume, post-View controls, continuous flame draws/extinguishing, hidden-position invariance, and twelve controlled native fire-goal cases. Physical handset/browser rendering remains unverified. No downloadable package was created.

#### v41 — Fireball selection, placement and HUD closing

Successful and failed Fireball orders spend only the throwing general’s daily order. The reported problem was reproduced in the interface: Fireball targeting remained active after the throw, so tapping another friendly general tried to throw again with the exhausted general. Completed throws now return to normal selection, allowing teammates to use their remaining orders. Combat probabilities, turn flags and AI policy are unchanged.

Mobile placement now hides the generated general-card board together with its hidden selector, retaining the existing centered Confirm placement button. Unit selection remains available in Menu → Battle controls. This removes the overlapping and clipped cards shown in the supplied screenshot.

One AI action closes HUD before attempting a step and keeps AI paused afterward. If a human must act, the explanation appears in the game status text. Resume AI retains its existing automatic close and resumes scheduling; both buttons are checked for an actually hidden HUD. Runtime About and the release manifest identify v41; the changed app and stylesheet have fresh cache URLs.

Verification covers successful and failed throws, unchanged teammate order flags, selecting and ordering the next general, generated placement-card visibility, HUD closing on human and AI turns, and paused single-step behavior. Interface checks use the actual app in an emulated DOM with native Canvas. Browser and physical handset layout remain unverified. Downloadable packaging remains deferred.

#### v40 — compact battlefield status and turn announcements

Battle status now has natural text height, four-pixel vertical padding, no border, no radius and no shadow. Its top position is explicitly unset in battle mode, preventing the governance top anchor and battlefield bottom anchor from stretching it across a mobile screen. Results remain centered and also have no frame.

Confirming placement announces **Defender’s turn**. After both armies place their units, new combat follows defender → attacker each day, matching the KOEI NES booklet’s defender-first rule (PDF page 20). This is manual-based behavior, not a newly verified DOS-binary branch. Daily food/fire/weather processing and the 30-day suspension occur only after the second army completes the day. New wars retain this order when resumed next month. Mid-combat saves from earlier releases keep their existing attacker-first cycle to avoid discarding or repeating daily orders; older deployment saves use defender-first combat when confirmed.

Side switches announce **Defender’s turn** or **Attacker’s turn**, followed by the selected ready general for a human-controlled army. AI announcements use the general actually chosen by its policy. Each unit action, including automatic Wait on End turn and challenge responses, receives a general-turn announcement before action/casualty text. These status lines use the existing reading-speed/pause queue. Presentation does not execute another order or consume random numbers. Combat formulas and AI tactical choices are unchanged.

The repository root `AGENTS.md` contains the four requested coding sections. No downloadable pack was created; packaging remains deferred. Runtime About and the release manifest identify v40.

Verification covers defender-first deployment, once-per-day food/fire updates, 30 full days and resumption, legacy save/load, rejected orders, general/action message ordering, and mounted mobile controls/cascade. Browser and physical handset layout remain unverified; interface checks use the actual app in emulated DOM with native Canvas.

#### v39 — read-only HUD AI route and jungle inspection

HUD → AI adds **Planned path** and **Jungle scores**, with an optional inspected-unit selector and the existing centered command widths/heights. Cyan routes use `planBattleRoute` (including cover goals chosen by `tacticalPosition`); the affordable prefix is solid and later steps dashed. Forest numbers use the current weighted `ambushLaneScore` directly. Dotted gold paths show visible attackers' predicted approaches. Occupied/burning forests are marked ×; preferred cover receives a gold outline.

Inspection runs no order and consumes no campaign RNG. It is kept outside save state, remains visible after closing the paused HUD, refreshes after edits/single steps and clears on Resume AI or a new campaign. Placement, results and unwatched battles have no overlay. A route is an inspection preview, not a promise that movement will supersede an attack/challenge/fire action. Lane scores are proximity measures, not ambush chance or final position score; original directional ambush geometry and INT immunity remain unchanged.

The active AI/governance/combat/advisor rules are unchanged except uniform cache revision. The retired WebGL files removed in the workspace cleanup remain absent. Runtime About and `config/release.json` identify v39; artwork hashes and the 41 terrain guides remain unchanged. Downloadable packaging is deferred.

Verification: seven focused inspection groups cover immutable state/RNG, next-unit selection, middle-vs-off-route forests, hidden attackers, mountain detours, movement budgets, nonmovement priorities, unavailable phases and real canvas drawing. Mounted UI checks exercise both independent buttons, explicit unit selection, unchanged state/seed, paused full-field inspection and clearing on resume; mobile checks verify the existing shared dimensions, fonts and alignment. Physical handset layout remains unverified.

#### v38 — current report regression, messenger travel and mobile alignment

The published Sites version 37 contained runtime v36. This release makes the runtime and publication version agree at v38. Prior audit entries below remain historical evidence; this section supersedes v28/v35 treasure routing and strict current-calendar-month pruning.

| Requested correction | Implementation and evidence |
| --- | --- |
| AI reports missing from Across China | Ordinary AI actions were excluded by both the province filter and the type whitelist. Records now snapshot their acting faction and AI status. AI orders, diplomatic actions and mission outcomes appear nationally; local outcomes retain province cards. Old records without an actor use their known province owner as a fallback. |
| Reports disappear after AI turns | The 160-entry playback log could evict significant reports, and month rollover deleted the just-finished round before the player could review it. A separate current-report ledger retains meaningful records. At rollover, one completed-round snapshot replaces the previous snapshot. Events shows the ongoing round and latest completed round with their real dates; older rounds are removed, including from saves. Completed war summaries also survive this window. This is a current reporting window, not accumulated campaign history. |
| Missing/squashed map status | The China-map legend had an unclosed `div`, making the toast a child of a narrow legend. The status is now a direct child of the map, with its own width, wrapping and bounded overflow. |
| Route legend and colour boxes | Routes sit immediately above Province map / Ownership. Ownership swatches share one left anchor and no neutral-swatch indentation. |
| Courier size and route anchors | The map sprite is 20px high, exactly one quarter of the previous 80px. Interpolation uses the projected source/destination city anchors; a stale motion from another route leg cannot move the sprite. An intercepted courier stops at the intercept province. |
| Outbound versus return interception | Only outbound travel tests interception. Return travel consumes no interception RNG and cannot create another detention. The existing outbound probability remains an approximation; this release does not claim a newly recovered native capture equation. |
| Galloping | A single looping effect runs only during an actual 650ms map movement. It stops for an interception, arrival, idle travel prompt, mute, exit or hidden page. Opening, freeing or deciding a messenger does not start a gallop. Dialog courier art is stationary. Physical sound quality still requires listening on the user's device. |
| Mobile initial placement | Commander portraits, comparisons, weather/status and unit selectors are hidden during initial placement. The right pane keeps only Confirm placement. Legal hex placement and automatic next-unit selection remain unchanged. Normal battle information returns when placement ends. |
| HUD | AI / Officers / Province / Battle use four equal columns in one row, including on mobile. |
| Treasure loyalty and INT | Native treasure dispatcher `0xA860–0xA886` calls recipient handling for types 0–3. The confirmed award branch sets LOY to 100 at `0xA68E`. It obtains a random number below the table's bonus and adds five at `0xA695–0xA6A6`. Helper `0xA514` caps the actual stat gain to `100 − old stat`. Book of Heaven's native type/bonus record is `00 05` at `0x341BC`: INT +5…+9, capped at 100. Books, swords, charm treasures and treasure mounts now set loyalty to 100. The announced gain and possessions ledger store the actual gain. Existing possessions show the prior stored fixed bonus; no old save is retroactively given another stat increase or loyalty reset. Medical and seal side effects remain their existing implementations. |
| Treasure event routing | Named treasure awards, including Province 10 / Li Su / Book of Heaven, belong to Across China. They are removed from province cards. Plunder and ordinary local human diplomatic/mission reports remain local. |
| General / other order alignment | View → Generals has a shared six-column header/row grid: portrait, name, Position, INT, WAR, CHA. Long names wrap without shifting numeric columns. Related officer cards preserve a flexible content column and natural height. Existing shared choice-card and order-grid behavior remains in place. |

Native evidence: [original-v38-checks.json](original-v38-checks.json), [native-treasure-v38.json](native-treasure-v38.json), and `tools/verify-native-treasures.py`. The supplied binary passes 118 existing byte checks plus four new treasure checks. Optional Unicorn arithmetic execution is unavailable in this environment; new treasure arithmetic is established by static bytes/disassembly and remaster regression checks, not a claimed executed-DOS comparison. Original treasure acquisition probability, recipient AI, compatibility changes and messenger interception probabilities remain unverified.

Validation: **350 gameplay/data/artwork groups, 49 interface/layout groups, and 122 native byte checks pass.**

Regression coverage includes actual AI governance, log eviction, rollover, second-rollover deletion, save/load, Book of Heaven recipients and the 100 cap, outbound capture/return RNG, travel-only audio, mounted general grids, four HUD tabs and mobile deployment. Browser/physical handset and audible playback QA remain unverified; the interface suite mounts the actual app using emulated DOM and native Canvas.

#### V36 — event layout, confirmations, map captions, sound and historical artwork

This update changes presentation and confirmation controls. Native combat, governance, advising and AI equations remain as in v35; the four advising source files still match the preserved v33 hashes after cache-version normalization.

| Request | Implementation |
| --- | --- |
| Triumph/defeat Continue and ad-hoc actions | Dialog footer and comparable action rows use centred flex wrapping. Buttons have one fixed responsive width and the common command height; lone Continue is centred without stretching. Choice cards and command grids retain their own selection layout. |
| Across China cards | History thumbnails use a proportional panoramic frame; the clickable card grows with its image and wrapped text. Fixed mobile command height no longer clips card content. |
| Campaign text | Only nonempty recruited, released and beheaded lists appear. Redundant `Result: …` is omitted from the public summary. Actual cause remains in the war record, lastBattle and battlefield result. Pending decisions and allied captive outcomes remain visible. |
| Province toggle | Repeated Province taps switch between province attributes and the default Governance view. Active timed messages still finish at the selected speed before the resting image returns. |
| Order confirmation | Pure confirm steps show the question with Cancel / Back / Confirm order, without a duplicate Yes/No selector. Shared flow covers Reward, Hire, Move, Appoint, Dismiss, Tax, Healing, cancel alliance, court marriage and self-exile. Actual payload choices, such as taking all generals into exile, remain selectable. |
| China map captions | One left-aligned `Jan · 189AD · Spring 春` line. Two left-aligned legend rows, Your provinces and Unclaimed. China/city-count/tap instructions are hidden in China view; Province map retains identifying labels. |
| Messenger and bad omens | Smaller courier canvas, four-hoof galloping effect, and distinct flood, locust, typhoon, epidemic, uprising, meteor and death effects. Existing sound preferences and visibility rules apply. Effects are original synthesized nonverbal textures, not sampled recordings. |
| Historical scenes | All 15 scheduled scenes plus a fallback regenerated separately at native 1983×793, four times the pixels of the former atlas cell. They load on demand and preserve aspect ratio. Prompt set, actual dimensions and correction notes are in artwork-v36.md and artwork/history-generation-v36.json. All new images are in the versioned pack. |

Verification: engine/native regression suite, mounted-interface tests and mobile CSS/height-budget checks. Native Canvas verifies whole-scene rendering and asset dimensions. No browser/physical handset QA was available; the final phone layout and playback sound still need device inspection. This release does not claim unrecovered original-game formulas have been resolved.


#### V35 — mobile GUI, current-month events and screen dimming

This is a presentation and event-retention update. Native order, combat, advising and AI equations are unchanged. The existing battle stat-label font (Georgia/Times serif, `.75rem`) is now used throughout mobile battle, governance, HUD and decision dialogs, preserving colors, text alignment and established pane locations.

| Request | Implementation |
| --- | --- |
| Battle command size | Root commands, tactics, Strategy suborders, Back and End turn share a three-column grid and one responsive height. Seven root commands fit three rows without a command-area vertical scrollbar. Simultaneous has a discretionary wrap point on narrow screens. Deployment keeps its separate placement selector. |
| F/R | The abbreviated label replaces Field / Reserve. Values use `3/2`. Attacker counts living, placed original-province units / living, placed reinforcements from other provinces. Officers left at home and troops not yet placed are excluded. Defender retains field units / local reserves. Hover/accessibility text explains the different meanings. |
| Mobile imagery | Event, triumph and courier/dialog artwork receives viewport-bounded space. The shared `paintAtlas` renderer uses a single contain scale and centers the artwork, retaining its aspect ratio. Portraits and long selection cards remain content-sized; command buttons have the shared height. |
| Governance scene | The resting middle pane displays Governance (events atlas cell 3). Monthly review and active AI/order messages temporarily show their matching art, including when a detail/order screen was open. On timeout, the default scene or the intentionally selected details/orders returns. Province attributes and command screens retain their existing positions. |
| Across China | The heading is Current, not Chronology. Only current-month nationwide reports and campaign summaries are listed. Old completed logs/reports are pruned from checkpoints and imported saves. Ongoing war or pending captive reports carry their war IDs forward into the current month; history-trigger memory is retained to prevent duplicate scripted events. Province events remain current. The Menu entry is Current events. |
| Screen dimming | `Allow screen dimming` defaults off. The game requests the browser Screen Wake Lock while visible, releases it on Exit/pagehide/hidden state or when the option is enabled, and reacquires on visibility return or a later tap. Preference survives save/load; older saves default off. Unsupported/declined/device-released locks show their status in Menu. The browser/OS may deny this capability, especially under device power policies. |

Validation: **342 gameplay/data/artwork checks** pass, including nine new current-event, F/R and wake-lock regression groups. Emulated DOM/native-Canvas interface checks cover timed return to Governance, the mobile typography cascade, shared three-column tactical controls, Menu preference, event replay, triumph, diplomacy and courier decisions. Physical handset layout, actual device wake-lock permission and audible playback still require device verification; no browser QA capability was available in this session. Prior native-binary evidence remains applicable; no new original-game parity claim is made.

#### V34 — compulsory field retreat and exile slot protection

This supersedes v33's remaining compulsory **field-unit** withdrawal difference. Main.exe `0x2CFBE` processes each defeated officer, builds adjacent friendly/unoccupied destinations through `0x25810`, captures immediately if no destination exists, and otherwise calls the same `0x25670`/`0x25566` flight test as voluntary Flee. V34 uses this for the defeated field list on either side. Captured/killed/already-fled units are skipped, and dispositions cannot reroll on save/load or repeated result processing.

Humans see the win/defeat status while the map remains visible, then choose a retreat province for each surviving general. Success/capture messages play at Game Speed. Final status precedes settlement. AI selection follows `0x2574C`: prefer the original province if eligible, otherwise the first friendly neighbour, otherwise a random unoccupied choice. A horse does not bypass the requirement for a valid destination. Hidden abstract wars keep their separate existing resolution.

A long campaign found that governor rebellion could reuse the ruler ID of a roaming exile because it only checked provinces. The allocator now reserves active exile and captive-ruler IDs, preserving their leader/party identity. This fixes an invalid save checkpoint; it does not alter advising.

**Still open:** non-field provincial reserve capture, prisoner troop/resource spoils, secret-pact distinctions, full strategic/delegated AI and remaining governance/duel/recruit/abstract-battle equations. The comprehensive order audit below remains applicable. [V34 retreat evidence](changes.md#record-compulsory-retreat-v34). AI ambush changes remain discussion only.

#### V33 — captured rulers, automatic ambush, flight and battle presentation

This section supersedes earlier eight-cell ambush and voluntary-flight approximations. **115 native byte witnesses and 812 new controlled native cases** are included alongside v32's 1,300 arithmetic cases. The supplied English main.exe remains authoritative. [Native evidence and formulas](changes.md#record-native-battle-v33), [byte checks](original-v33-checks.json), [native vectors](native-battle-vectors-v33.json).

| Current request | V33 implementation / verification |
| --- | --- |
| 1. Captured ruler; heir and hatred | Ruler captivity offers Set free / Behead, never Recruit. The observed native ruler menu has no remaining-province gate, so this applies to landless rulers too. Execution retains the heir/clan event and 100 hostility toward the killer. Ordinary captives remain before the defeated commander. |
| 2. Commander star | Star is on the general's name flag. The label below the formation contains the soldier count alone. |
| 3. Battle HUD | Unit attributes, battle day/weather and army supplies are grouped in labeled sections. Adds training and both gold stores; their native capacities are enforced atomically. |
| 4. Automatic jungle ambush | Native three forward hexes trigger while an enemy moves/taunts/charges into range. Native triple loss, no retaliation, INT ≥90 immunity and human/AI difficulty factor replace the old generic strike. An already ordered jungle unit can ambush without spending mobility or another order. Concealment/secret-pact substates remain incomplete. |
| 5. Centered status | Battle messages and wind/status text are centered; final result is centered over the field. |
| 6. Flee / retreat | Voluntary general flight and commander whole-army withdrawal now use the verified native probability, horse guarantee and adjacent friendly/unoccupied destinations. Each unit chooses a destination and rolls separately. Compulsory post-defeat retreat/AI destination selection and reserve capture settlement are still outstanding; this is not full retreat parity. |
| 7. Governance priorities | Local military/personnel/domestic dispatch uses the native policy tables, governor ambition selection, random starting point and difficulty retry counts. Strategic war/diplomacy prelude, delegated ordering and parts of local eligibility/actor choice remain remaster policies. |
| 8. Governance mechanics / equations | Corrected Train's denominator and its zero-men update; Give now uses local governor CHA. Existing verified Cultiv/Flood, reward/merchant costs, recruitment protection and native imported attributes are retained. The full order audit below still contains untraced coefficients; complete native governance parity is not claimed. |
| 9. Advising mechanism | Availability/cache/topic/generic order-advice sources are preserved; the now-removed `advice-preservation-v33.json` recorded v32 hashes. Only numeric results change where native Train/Give arithmetic is corrected. |
| 10. Escape/capture status | Voluntary flight announces each general's successful destination or capture, and retains the battlefield during message playback. |
| 11. Zero-men unit | The formation disappears immediately; melee/charge/ambush report capture. Fire depletion reports death, as in the native burning-unit defeat path. Zero-men charge still occupies the defeated tile. |
| 12. Win status before governance | Watched battles retain their field and pause AI while action/outcome messages play at Game Speed. A centered Attacker/Defender won/defeated status precedes settlement and governance. Pending outcomes survive save/load. Unwatched battles still use immediate abstract resolution. |

**AI ambush brainstorming only:** [ai-ambush-proposal-v33.md](changes.md#record-ai-ambush-proposal-v33) proposes scoring useful jungle positions against terrain-aware predicted routes and the actual three-cell trigger arc. Reposition only on a legal defender activation, never as a free move during the enemy's turn. `ai-battle.mjs` has no new strategy changes in this release.

**Open native work:** compulsory retreat integration, strategic/delegated AI, exact order eligibility and all remaining audit coefficients, duel/capture/recruit formulas, abstract battle coefficients and historical/random event scheduling. A verified equation or dispatch table does not prove those surrounding systems. The current advisor mechanism remains deliberately unchanged.

#### V32 native domestic equations, melee and deployment audit

This section supersedes earlier approximations for **Cultiv, Flood, normal melee, charge strike count, simultaneous counterattack factors and deployment zones**. The supplied English `main.exe` remains authoritative. Native verification now includes **97 exact byte checks** and **1,300 isolated 16-bit arithmetic cases**: 500 domestic, 100 army-power and 700 casualty cases. The arithmetic routines execute unchanged in a bounded emulator; random calls are replaced with specified rolls. This does **not** execute DOS, emulate a complete battle or redistribute the executable. Evidence and reproduction commands: [battle-equations-v32.md](changes.md#record-battle-equations-v32), [original-v32-checks.json](original-v32-checks.json), [native-equation-vectors-v32.json](native-equation-vectors-v32.json).

| Request | Finding and change | Original evidence / boundary |
| --- | --- | --- |
| 1. Cultiv attribute and equation | **INT + floor(CHA / 2)** affects development. The existing equation incorrectly subtracted half the difficulty at the end; it now subtracts the **full difficulty** with a zero floor. Spending and final Land remain capped at 100. Advisor forecasts use the corrected equation and name both attributes. | Shared routine `0x10750`; cultivation wrapper `0x107EC`, province byte `+0x16`. Python subtracts half difficulty and conflicts with the supplied executable. |
| 2. Flood attribute and equation | The same equation, using current **Flood protection** instead of Land. INT and CHA both matter. This rating is protection, not flood damage. | Wrapper `0x107C6`, province byte `+0x18`, calls the same `0x10750`. |
| 3. All-battles result in Events | The independent war chronicle already held results, but spectator view returned to the turn artwork and every AI faction change reset an open Events pane. Completed watched spectator battles now open **Events**, and that pane persists during governance turns. Every completed summary records and displays its actual result reason. Full tactical-log eviction and save/load tests retain the result. | Remaster presentation repair; no claim of a newly recovered original logging equation. Summaries retain one row per war/month and captive outcomes. |
| 4. Flood in Province HUD | The editable field existed under **Dikes**. Its label is now **Flood protection**, range 0–100. Province attributes still show **Flood**. | Naming/visibility correction, not a new resource field. |
| 5. Attacker placement in all 41 provinces | Replaced broad edge strips with **the actual five province-specific slots for each of 186 directed connections**. Several maps shift individual slots inward; a single directional template is insufficient. Initial defenders use their 20 designated province-zone cells. Province Map highlights, AI, touch placement, reinforcements and validation share these zones. | Native `0x2709E` loads the 156-byte province zone map at resource offset `41 × 156 + provinceIndex × 156`; `0x23992` requires a cell's zone to equal the origin province number. [deployment-v32.json](deployment-v32.json) contains every approach and resource SHA. Zone bytes come from JuQiang's original `Hexdata.dat`; no English `Hexdata.dat` was supplied, so cross-edition byte identity is not asserted. Its 41 terrain maps match current terrain data exactly and every neighboring origin has five passable slots. |
| 6. 1,000 casualties in one melee | There is no fixed 1,000-man damage. Replaced the remaster's multiplicative soldier/War/training/morale damage and weak after-loss retaliation with the recovered **two-sided signed integer calculation**. A sufficiently disadvantaged 1,000-man army in water can legitimately be annihilated in one exchange. Losses are capped by men present. | Power `0x23702`; casualty helper `0x2375A`; normal caller `0x26216` → `0x24C58`. Both rolls use pre-exchange forces. Weapons are reduced proportionally on both sides. |
| 7. Water versus palace and morale | Both terrain divisors now participate. Assaulting a selected palace defender applies the native **divisor-5 penalty to the acting unit's own losses**; the palace defender retains its divisor 20. Equipment coverage, War and training determine power. **No morale loss or morale rout appears in this melee path**; the earlier percentage-morale model and automatic `morale ≤ 10` defeat were remaster inventions and are removed. Morale is retained only as an unused legacy save field; it is no longer shown in battle HUD/inspection or used by tactical/abstract power. | `0x23790` selects the assault penalty; divisor table at `0x3ADD6`: 10,10,12,10,8,15,20,5. Officer word `+0x14` is **weapons**, not morale. Percentage helper `0x0533E` measures weapons per soldier; `0x235A8`/`0x235C4` remove proportional weapons. This conclusion covers the recovered paths; it does not assert that every event/strategy branch has been decoded. |
| 8. Defender loses with troops remaining | One unsupported cause was commander morale routing; it is removed. Original food exhaustion is immediate even with men remaining. Commander defeat/capture, commander flight, ruler capture and palace occupation remain battle-ending conditions. Events now preserve the cause. Without the affected save, no single cause can be assigned to the reported occurrence. Legacy ongoing morale-only routes are repaired when the unit is alive, uncaptured and not fleeing; already settled defeats are not rewritten. | Food `0x22DBC`/`0x22DD0`; commander removal `0x25207` and `0x2521F`. Native result flags do not require all army soldiers to die. Duel/capture/flight probabilities remain approximations. |
| 9. Five initial attackers and remaining five | **Five main invading commanders** is confirmed. The ongoing-war capacity helper also caps the attacking main contingent at five, while a same-ruler defence branch has ten. It therefore does **not** permit ordinary same-ruler neighboring reinforcements to grow the main invasion to ten. Main reinforcement options now cap at five, exclude the original source, and use another connected friendly province to fill vacancies; allied invasion support is separately capped at five, total invading field ten. | Initial `0x128A0`; ongoing `0x1F044` tests ruler equality with the defending province, then chooses ten (`CB72`) or five (`CB86`) and subtracts field/pending troops. `0x1EBD2` assigns the attacking ruler/source to `CB86/CB88`. Tactical Reinforce at `0x2CCFC` calls the local reinforcement picker only for the defending role; attackers get “Can't use that command!”. The remaster retains a convenience tactical neighbor-reinforcement interface, with the corrected main quota; it does not reproduce the original monthly dispatch UI or exact allied arrival scheduling. Bribes/secret defections retain their separate ten-unit limit. |

The domestic gain is:

```text
V = current Land or Flood protection; G = gold (1–100); D = difficulty (1–5)
A = INT + floor(CHA / 2)
B = floor((100 - floor(V / 2)) × G / 100)
C = floor(sqrt(B × A))
H = floor((D + 1) / 2)
gain = max(0, floor(sqrt(floor(C / H))) - D)
new rating = min(100, V + gain)
```

Each successful order still uses the selected general's action and spends the selected gold. At 100 it cannot improve. Melee's full equation, examples, Lu Bu's recovered bonus, simultaneous factors and controlled native test method are in [battle-equations-v32.md](changes.md#record-battle-equations-v32). **Charge performs 1–10 exchanges**, replacing the old fixed three; defeating the target still occupies its tile immediately, without a surviving-target breakthrough.

V32 remaining combat list (updated by v33): challenge equations, compulsory post-defeat retreat/capture settlement, strategic AI, abstract auto-resolution coefficients, ally scheduling and the complete native initial-defender selection UI. V33 replaces the hidden-ambush arithmetic/trigger and voluntary-flight probabilities. The recovered normal-melee coefficients must not be interpreted as verification of those systems.

Validation: **315 gameplay/data/artwork groups, 45 emulated DOM/native-Canvas interface groups, 97 native byte checks and 1,300 bounded native arithmetic cases pass.** This includes the actual all-battles spectator scheduler returning to Events with a food-defeat reason, all 41 deployment maps/186 approaches, native casualty examples, charge occupation, five-unit main reinforcement limits and legacy-save migration. Full `npm test` and `npm run test:ui` exit successfully. Physical handset layout, audible playback and a complete DOS playthrough remain unverified.

#### V31 clan events, diplomatic audiences and battlefield review

This release addresses the nine requests of 9 October. The supplied English `main.exe` takes precedence over the Python recreation. Offsets below refer to its unpacked load image; the executable is inspected statically, not run or redistributed. [original-v31-checks.json](original-v31-checks.json) records 84 byte checks, verified against packed SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Unrecovered branches remain labelled below.

| Request | V31 behavior and evidence | Remaining difference or limit |
| --- | --- | --- |
| Clan destruction | A nationwide illustrated event names the retiring ruler's clan. It fires once after execution/death without an eligible surviving successor, diplomatic surrender, or loss of the last active realm without a roaming or captive ruler awaiting a decision. Native retirement `0x7ED4` invokes successor selection; its no-successor branch clears the ruler slot, decreases the active count, and announces the literal clan-destroyed message at `0x8065` (string at `0x33B01`). | Extinction is distinct from losing one province. Releasing a landless ruler into exile keeps their realm alive. Integration of all remaster retirement paths, including Threat, follows this shared lifecycle; the exact native Threat-to-retirement caller has not been separately established. |
| Death with a successor | A separate full-width funeral illustration accompanies succession after an attributed killing. The new ruler's hostility toward the killer is exactly 100, including after a human succession choice and save/load. Native execution `0x9B5C` invokes ruler removal, then its surviving-realm branch writes 100 at `0x9B81` to the killer's relation slot. Kin with an overlapping native blood mask rank first, with highest loyalty preferred (`0x7AAF`). | Hostility is directional; the killer's reciprocal relation is not forced to 100. Native non-kin affinity selection and succession loyalty adjustments are not fully recovered. Human players retain their successor choice. The same handling accepts explicit battle-death results, but ordinary zero-soldier defeat remains capture, not invented officer death. The native battle mortality roll has not been recovered and no random mortality equation is added here. |
| Map generation prompts | `battlefield-generation-prompts.md` (removed in v53) contains every original recorded prompt for all 41 existing paintings, the exact terrain rows and palace anchors. Its JSON companion and 41 semantic PNG guides make regeneration reproducible. `tools/export-map-prompts.py` rebuilds them from the recorded painting manifest and native grids. | Reference guides identify terrain precisely; a generative model still requires visual review to ensure its painted features remain aligned. No gameplay terrain or current painting is regenerated in this release. |
| Human governance responses | Incoming Alliance, Royal Marriage, Joint Invasion, Threat and Gift missions stop at arrival for Accept/Refuse. The recipient's answer decides the response without a success reroll. A joint proposal then has a separate troop/supply commitment decision. Pending audiences persist across saves and block AI progression and siege resumption. Spectator recipients auto-resolve. | This repairs skipped human consent. Existing remaster AI acceptance chances, messenger routing/interception probabilities and joint-support equations remain approximations. |
| Unit limits and reinforcement | A new invasion selects at most five commanders. Native helper `0x128A0` returns five; War passes that capacity to selection at `0x156E2`. Reinforcement `0x2CACC` counts the active field list, refuses at ten (`0x2CAEA`), and passes ten minus deployed count to the picker (`0x2CB06`). Remaster reinforcement on either side, including allied support, respects ten living field units; reserves stay in provinces. | Unlimited defenders are not supported by the recovered reinforcement limit. Remaster initial defence still automatically chooses up to ten eligible units with ruler/governor priority. The exact native human initial-defender picker and allied slot partition remain untraced. Ongoing-war helper `0x1F06E` has distinct ten/five capacities and subtracts already committed units; its full branch context is not reconstructed. Forty historical battle records is a remaster save bound, not permission for forty simultaneous units. |
| Army counters | “Defender 4/0” means four living generals in the field, zero generals remaining in that side's home province. “Attacker 5/5” means five in the field and five remaining in the invasion's source province. The display now says **F 4 · R 0** / **F 5 · R 5**, with a **Field / Reserve** label and full province identification in the accessible descriptions. | The reserve count describes the originating province, not every adjacent reinforcement source. Allied field generals contribute to Field; their remote province reserves do not inflate the main origin's Reserve count. |
| Defender jungle position | `mjs/ai-battle.mjs` now projects visible attackers' least-cost routes to the palace and scores forests on/adjacent to those lanes. Mountains, five-point water, active fires and attacker traffic influence the forecast. A defender can plan toward a middle-route forest beyond today's mobility instead of choosing a nearby off-route forest. The designated palace guard remains in place. | This is a remaster AI policy, not recovered DOS AI. Hidden attackers are not read. Route forecasts predict least-cost movement, not certainty about a human opponent's eventual route. See [ai-tuning.md](ai-tuning.md) for functions and the editable route weight. |
| Wind wording | Calm says **No wind**, once. Otherwise the display says **Wind · direction**. Native rendering `0x240A9` uses a no-wind sentinel or Wind plus one of six direction images; there is no independent displayed strength. Old saves' Breeze/Strong/Gale state is normalized, and remaster fire no longer gains two-/three-hex or flank spread from that invented strength. | The remaining 40% adjacent downwind spread probability, weather/fire-ignition chances and wind direction distribution are remaster equations. Removing the unsupported strength is not a claim that every fire-spread coefficient was recovered. |
| Enlarged artwork in pack | The previously inspected v30 ZIP already contains `officers-historic-v30.webp`, `history-v30.webp`, `disasters-v30.webp`, `omens-v30.webp` and `stories-v30.webp`, with source commit `c59646d5f52b72b94247db93f4a40ac7a0b42aca`. The new **rtk2-remastered-v31.zip** makes release identity explicit. `config/release.json` lists and hashes the five active v30 assets plus the two new v31 events; packaging verifies every listed byte. Menu → About displays v31. | V29 artwork remains archived for provenance and regression tests; opening an old asset is not the runtime selection. A stale downloaded ZIP or earlier deployed copy cannot be silently replaced on another device. The new versioned pack avoids filename ambiguity. |

Clan and heir artwork are separate 1983 × 793 full-bleed panoramas, matching the common event aspect ratio without distortion or blank side strips. They are registered for event playback, chronology and HUD previews. Exact generation prompts and provenance are in [artwork-v31.md](changes.md#record-artwork-v31).

The following earlier audit entries are superseded: C04's entirely unverified eligibility now has verified kin/loyalty preference; C05's missing ceremony now has the clan event; earlier independent wind-strength/fire-fanning descriptions no longer apply. Remaining original probabilities and branch limitations stay open rather than being presented as fully recovered mechanics.

Validation: **306 gameplay/data/artwork groups, 44 emulated DOM/native-Canvas interface groups, and 84 supplied-binary byte checks pass.** This includes 15,000 Hard/all-battles spectator actions across six scenarios, human incoming diplomatic audiences, saved succession with directional vengeance, actual-death lifecycle settlement, both reinforcement caps, route-lane forest selection, all 41 prompt/guide hashes and active artwork hashes. The complete `npm test` run exits successfully; `npm run test:ui` passes with the new human-response flow. Physical handset layout, audible playback and execution in the DOS game remain unverified.

#### V30 full-frame artwork and explicit province impacts

Liu Bei's portrait is reframed as a close bust with face/head scale comparable to Cao Cao. Only his cell is replaced; other portraits retain their compositions. All historical, disaster, omen and story illustrations were outpainted into wide scenes with no blank side canvas. Runtime assets use v30 filenames, and preserve the common event cell dimensions/aspect. The whole scene fills each cell, rather than fitting a square inside a matte. See [artwork-v30.md](changes.md#record-artwork-v30) for the exact prompts, paths and review.

Province event prose is English, without a leading province number or the Chinese event labels. Province IDs remain metadata and the numbered province list/detail headers still identify the location. This supersedes v28/v29's prefixes. Legacy presentation removes known labels and duplicate prefixes without inventing missing impact figures.

Every newly generated local monthly event records six signed impact fields: people, serving-garrison soldiers, stored gold, stored food, land and flood control. Reports show each field as lost, gained or unchanged, including zero effects. The delta is measured at the event, before unrelated growth or another disaster. Harvest, unpaid wages and rice shortages are reported for AI provinces too. Illness onset is a separate medical event, not just an eventual recovery; epidemic sickness and battle injuries record the officer, province and expected recovery time. Book recovery remains the accepted one-month remaster rule.

### Supplied English executable disaster equations

The unpacked dispatcher at `0xEE1A` selects locust, epidemic, flood and typhoon. Its percentage helper at `0x49CA`/`0x49F2` floors multiplication/division, and random upper bounds are exclusive. The following values are percentages **retained**, rather than percentages lost. `F` is flood control before damage, and each random range is an independent draw. Native population is stored in units of 100 people: retain the stated percentage of whole units, floor, then add one unit (100 people). The remaster retains its 3,000,000 population ceiling.

| Event | People retained | Soldiers retained | Stored gold | Stored food | Land retained | Flood control retained |
| --- | --- | --- | --- | --- | --- | --- |
| Locust | Unchanged | Unchanged | Unchanged | floor(old/2) + floor(old/100) × random 0–20 | 50–70% | Unchanged |
| Epidemic | 75–90%, then +100 | 80–85% per general | Unchanged | Unchanged | Unchanged | Unchanged |
| Flood | 75 + floor(F/5) + random 0–5%, then +100 | 70 + floor(F/4) + random 0–5% per general | Unchanged | Unchanged | 45 + floor(F/2) + random 0–5% | 75–90% |
| Typhoon | Unchanged | Unchanged | Unchanged | Unchanged | 60 + floor(F/3) + random 0–7% | 60–80% |
| Popular uprising | 60–80%, then +100 | 60–80% per general | 50–70% retained | Same direct store equation as locust | 50–70% | Unchanged |

Popular loyalty retains 70–90% for locust, 50–70% for epidemic, 60 + floor(F/3) + random 0–7% for flood, 90–99% for typhoon, and 10–30% for popular uprising. Locust/flood also update the food exchange rate to max(floor(old × 80/100), random integer 10–14). Epidemic assigns a random 0–3-month sickness period per affected serving general; zero means no sickness. A field-army province is excluded from the native disaster troop helper. The remaster also excludes officers currently deployed elsewhere. Popular-uprising population displaced into a connected province creates a separate positive refugee report, capped at province capacity.

These recovered branches replace the earlier remaster direct disaster losses: notably typhoon has no direct resource casualties, flood does not remove stored food, and locust does not directly remove stored gold. The native code modifies Land/Flood as shown; they are not merely missing text. The original DOS executable was inspected statically, not executed. [original-v30-checks.json](original-v30-checks.json) and `tools/verify-original.py` reproduce 75 byte checks, including the dispatcher, percentage helper, troop/sickness branches and rate floor. Every registered byte check is now asserted after the complete check table is constructed.

**Remaining approximations:** disaster occurrence timing, geography filters, spread, the persistent 25% famine income modifier, governor rebellion, officer ageing/health outside these branches, ordinary upkeep and special historical/stratagem probabilities remain remaster rules where native equations have not been recovered. Zero six-field impacts do not mean no officer health, loyalty, diplomatic or ownership effect; that effect remains in the prose. Older saves without impact ledgers retain their original facts; lost amounts are not reconstructed from today's province state.

Validation: 292 gameplay/data/artwork checks, 43 emulated DOM/native-Canvas interface groups and 75 supplied-binary byte checks pass. Coverage includes exact native retained percentages, zero resource losses, illness onset/recovery, battle injury onset, save-ledger validation, refugee gains and absence of matte strips at every event-cell edge. Physical handset layout, audible playback and DOS runtime execution remain unverified.

The stronger native event losses exposed a pre-existing reference defect when a rebellion reuses a retired ruler slot. Marriage links belonging to the retired identity are now cleared before replacing it, preserving valid checkpoints.

#### V29 commanders, allegiance and consistent artwork

War records now snapshot both commanders independently of the rulers who own their provinces. When the defeated commander is a subordinate, an unsuccessful invasion says “The attacking commander returned unharmed”; a governor-led defence says “The opposing commander was not captured.” Actual recruitment, release and execution override those fallback outcomes. A ruler's fate is separate when their presence and outcome are known. Commanders and governors remain in the generals lists. Older reports lacking commander identity use the commander wording when ruler presence was absent or unknown; missing identities are not invented. This supersedes v28's generic ruler-not-captured fallback.

Rice shortages, unpaid wages and harvest reports belong to numbered province Events, including recognised legacy messages. Monthly playback retains separate province details. Economic equations are unchanged.

Liu Bei's replacement portrait has a mature face, moustache, beard and distinctive long earlobes. The four historical scenes featuring him—Xu Province, the three visits, Shu coronation and deathbed—were edited against that same portrait and visually reviewed. These are consistent illustrative interpretations, not authenticated historical likenesses. All live event atlas cells now match `events.webp`: 991.5 × 396.5 pixels, ratio 1983:793. Two-by-two atlases are 1983 × 793; the four-by-four historical atlas is 3966 × 1586. Artwork is contained proportionally in a dark matte without stretching or cropping. See [artwork-v29.md](changes.md#record-artwork-v29).

### Native allegiance evidence

The supplied English `main.exe` supersedes the Python recreation. In its unpacked code, hostile recruitment helper `0x12EA8` checks shared blood at `0x12EE4` and loyalty exactly 100 at `0x12EEE`; either reaches the zero-result branch at `0x12F0E`. The helper has linked-list, battle-command and AI callers. Its preceding covert-allegiance branch is retained as a distinct exception. Scenario 189 Guan Yu and Zhang Fei both have LOY 100 and blood 0, so the loyalty gate explains their protection, rather than shared family blood. The verifier now passes 54 byte checks; [original-v29-checks.json](original-v29-checks.json) records offsets, hashes and limitations.

The remaster now applies that zero-chance gate to hostile recruitment and captive recruitment, retaining the former owner while prisoners are unaffiliated. Gold bonuses and minimum chance floors cannot override it. Battlefield bribery, secret betrayal pacts and coercive wolf/betrayal spies also respect allegiance protection; those extensions are consistent remaster safeguards, not claims to have recovered every native spy coefficient. Returning planted spies retain their exception, and captive rulers retain the separate ruler handling.

No permanent named-character “never recruit” attribute was established. Once loyalty falls below 100, or an officer becomes genuinely free, the verified hostile-service gate does not establish lifelong immunity. Existing service-year departure protection is separate. Full recruitment probabilities remain partly approximated; these changes do not retroactively undo officers already recruited in old saves.

Validation: 283 gameplay/data/artwork checks, 43 emulated DOM/native-Canvas interface groups and 54 supplied-binary byte checks. New coverage includes ruler/commander separation, legacy summaries, local supply reports, exact atlas dimensions, captive oath-brother refusal, gold-floor bypass prevention and battlefield bribery. Physical handset layout, audible playback and execution in the original DOS game remain unverified.

#### V28 event artwork, location and report corrections

Every one of the 15 scheduled historical chronicles now has its own generated illustration in `assets/artwork/history-v28.webp`. The historical year selects its atlas cell for monthly playback, saved reports, chronology thumbnails and timed replay; unknown historical cards have an illustrated fallback. Images preserve their aspect ratio. Clicking a national chronology entry opens the message and matching artwork. See [artwork-v28.md](changes.md#record-artwork-v28) for the prompt and cell order.

Province event titles and messages include the province number. Monthly rollover records each detail separately, rather than a combined “A new month begins” paragraph. Both provinces affected by simultaneous epidemics therefore retain distinct entries and map event markers. Old combined rollover logs are hidden in favour of the retained individual monthly details.

Treasure awards, plunder, local diplomatic replies, messenger departures and interceptions belong to their province’s current events. Routine “the victorious army protected the inhabitants” notices are omitted; if the same report contains a treasure award, that significant part remains. Horseback departure now names the messenger, source, destination and mission purpose: it is a messenger journey, not exile or a Move order. Older departure messages are clarified as messenger journeys where their destination/purpose was not stored.

One shared date formatter prevents duplicate long/short month prefixes. War records snapshot whether the defending ruler is in the province even when they have no fighting unit. Actual capture or return decisions take precedence. Old records without enough evidence no longer claim the ruler was “not personally present”; “not captured” describes the recorded outcome without inventing whereabouts. Governors, army commanders and other subordinate officers are grouped under generals; the ruler remains a separate fate.

This pass changes report presentation and metadata, not original capture equations or battle settlement rules. Seven new regression groups cover all historical illustrations, two epidemics, local report routing, duplicate dates, non-fighting ruler presence, the Yuan Shu/Sun Jian invasion and explicit messenger missions. Gameplay and Canvas/DOM interface suites passed; physical-device layout and audio were not reverified.

#### V27 strategic Events display

Events now separates **Across China (chronology)** from **Provinces (current)**. Wars have one dated summary per battle month, naming the original attacking and defending rulers and source/target province numbers. A suspended siege records “Extended to next month”; its following month has its own result. Completed summaries list recruited, released and beheaded opposing generals, and report the opposing or attacking ruler’s actual fate. Decisions still pending are explicitly marked. Failed recruitment attempts do not create duplicate outcomes. The initial v27 absence wording is superseded by the v28 correction above.

War history stores ruler/name snapshots and final captive dispositions independently of the short text log. Individual moves, Wait, weather, daily side changes, fire damage and refused-recruitment prompts no longer fill Events or the Menu chronology. Live tactical messages and their configured reading time remain available during battle. The retained strategic history normally keeps the latest 400 war-month records, protecting active and undecided records from eviction. Save validation checks report dates, province/ruler references and captive links.

The current province section lists all 41 numbered cities with their names and current ruler (or Unclaimed), right-aligned. It shows current-month local reports and orders, or “No event”; historical battles stay in the chronology. Controlled provinces and the current headquarters remain highlighted. Menu → Chronicle uses the same compact strategic entries and retains timed replay.

**Older saves:** known active or suspended battles can be migrated using their stored source, target and date. Completed battles in old text-only logs may lack their original source and final captive dispositions. Their remaining strategic result is retained; missing details are not invented. The richer summaries are recorded for newly resolved battles. This is a requested display/history improvement, not a claim of a newly recovered native battle formula.

Validation adds eight regression groups covering monthly continuation, all final captive actions, refused recruitment, ruler-name snapshots, defeated-ruler return, local province filtering, legacy migration and malformed save rejection. The interface harness checks both sections, all city labels and right-aligned rulers.

#### V26 order flows and original-game sequence audit

**Authority:** the supplied English `main.exe` takes precedence over JuQiang. This pass statically traces the reward routines and military recruitment capacity/costs in the unpacked image. Other rows below describe the current UI and compare the available Python command bodies and earlier native findings; they do **not** claim a DOS playthrough or complete recovery of every native command.

### Implemented fixes

- Events / Province / Orders stay in three equal columns in Turn, Province and Orders. A more-specific two-column CSS rule caused the wrapping despite the general three-column rule.
- Gold: amount (1–100, bounded by stock) → recipient and advice → named confirmation. Horse: recipient and advice → named confirmation, consumes one horse and **zero gold**. Writings: recipient and advice → confirmation, **zero gold**. No mutation occurs while selecting or cancelling.
- **Writings means adviser-led instruction**, not giving an inventory treasure. The present adviser must have INT strictly greater than pupil INT + 1; success adds one INT and no loyalty. Named treasure books and the medical book remain separate acquisition/spoils systems. A writing-type selection or rare-event prerequisite would misrepresent this command.
- Successful Gold/Horse/Writings uses the governor’s monthly action, including legacy Reward/Book entry points. The pupil’s old once-per-month study restriction was removed: the native routine uses the governor action and INT gap, not a pupil inventory/study flag. The existing study list remains a save-compatible record. Appointing another eligible governor can enable another instruction.
- Horse reward raises loyalty; this branch does not set a permanent mounted-general flag. Native treasure mounts remain distinct. Existing saved mount flags are preserved, because their original provenance cannot be inferred safely.
- Move: connected destination → multiple general cards and destination/team advice → gold with next-payroll estimate → food with estimate through the next July harvest payment → outgoing governor when needed / abandonment decision → final confirmation. Team advice considers popular loyalty, land, dikes, INT/CHA/WAR and personal loyalty, and follows the saved monthly advice gate. The province’s governor CHA controls rewards; selecting a high-CHA companion does not automatically give that benefit. Estimates include existing destination troops/generals and stores and use **the remaster’s current upkeep**, not a newly recovered native payroll formula. Events and subsequent orders can change consumption.
- Hire retains the original hundreds-of-men quantity and assignment pool, with an explicit hiring confirmation and live cost/capacity estimate. Omitting quantity would prevent choosing recruitment size. Actor attributes do not alter capacity or cost. Capacity now follows native upward rounding for a partial remaining army slot; excess unassigned recruits require the existing disband confirmation.
- Build fort: builder/advice → map hex → explicit confirmation. Cancelling spends nothing; confirming a legal hex costs 100 gold and returns to Orders. This is a **remaster command**; the original military submenu has Hire/Reassign/Train, so its fort price and map placement must not be labelled original-game mechanics.
- Governor appointment: province → candidate/advice → named confirmation, then show the appointed province. The ruler governs wherever present, including officer ID zero; nomination, normalization and save/load preserve that rule. Officer-detail appointment shortcuts now use the staged confirmation flow too. Self-appointment is a harmless UI allowance; Python disallows changing the governor of the ruler’s current province because its governor is already the ruler.

### Native reward and recruitment evidence

Offsets refer to the unpacked load image with SHA-256 `5c3e45a5edb097c8719d65b1678784aaf8412258e2437a26bb89d4b249824506`.

| Mechanic | Executable evidence | Result / conflict resolved |
|---|---|---|
| Gold/Horse loyalty | `0x1070c–0x1074e`; current governor pointer at province +2, CHA at officer +6; divide by `0x190` at `0x10742`; random bound two at `0x10729`; capped addition at `0x18ae2` | `min(100, old LOY + floor(governor CHA × value / 400) + random(0,1))`. Horse passes zero, converted to value 100 at `0x1071e`. Fully loyal recipients are rejected in the UI. |
| Small gift | The executable adds the random bonus after dividing; there is no Python-style rejection of a zero integer base | A small positive gold gift can produce 0 or 1 loyalty. The previous Python-based base-zero rejection is removed. Advisor shows the range and the minimum gold for a base gain of one. |
| Horse cost/action | `0x18b3e–0x18bc2`; governor action call at `0x18b9e`; horse-stock decrement at `0x18bad` | One horse, no gold deduction, governor action. No mounted status write appears in this branch. |
| Gold sequence/cost | Recipient selector at `0x18be0`, amount input at `0x18c13`, confirmation at `0x18c4c`, governor action then gold subtraction at `0x18c67` | Original order is **recipient → amount → confirmation**. Amount-first is the user-requested remaster override. Gold alone deducts its selected amount. |
| Writings | `0x18a28–0x18ae0`; adviser INT at `0x18a56`, pupil +1 comparison, confirmation at `0x18a8c`, governor action at `0x18a98`, pupil INT increment at `0x18aad`; adviser-presence gate at `0x18da0` | Adviser must be present and exceed pupil INT by at least two. Confirmation → INT +1; no gold, item inventory or writing-type input. |
| Hire quantity and actor | `0x15b94–0x15c87`: select officer, enter hundreds, mark that officer’s action, call the quantity-only resource routine at `0x15c00` | Hiring does not test the chosen actor’s INT/CHA/WAR. Reassignment follows hiring. Training is a separate order that does depend on WAR. |
| Hire capacity | `0x10ef6–0x10fde`: population reserve `500` hundreds, population-minus-soldier limit, food /100, gold /10, remaining army space | Maximum hundreds = minimum of those resource/population limits and `ceil(sum(max(0,10000 − army men))/100)`. Python rounds the final army-space quantity down; native upward rounding supersedes it. |
| Hire cost | `0x110d8–0x11115`: 10 × hundreds gold, −100 × hundreds food, −hundreds population field (native population is stored in hundreds) | Each hundred recruits consumes 10 gold, 100 food and 100 civilians. Adjacent native popular-loyalty adjustment exists at `0x11092–0x110d6`; its helpers are not yet fully reconciled with the remaster. Do not claim exact recruitment side effects or training redistribution parity. |

`original-v26-checks.json` contains **48 reproducible static byte checks**, including 13 new reward/hire checks. Run `python tools/verify-original.py INPUT_DIRECTORY OUTPUT_JSON` on the supplied original files. These are static checks, **not DOS execution**.

### All provincial orders: sequence comparison

“Reference” below means the checked Python command body unless a native offset is explicitly cited. The final button on ordinary forms is **Confirm order**; a separate named Yes/No screen is added where noted. Thus no resource is spent by merely choosing an officer or changing a slider.

| Order | Current sequence | Comparison / remaining difference |
|---|---|---|
| Rest | Complete this province’s orders, then next province/faction | Provincial completion/navigation is a remaster UI. Original end-order scheduling is not newly traced. |
| Move | Destination → party/advice → gold → food → outgoing governor/abandonment if needed → confirmation | `Command1` has destination → party → gold → food and governor choices. It also chooses the **destination governor when the ruler does not move**; remaster preserves an existing governor or uses the first arrival in an empty province. That destination-election step remains a difference. Supply/team forecasts and final review are additions. |
| Send | Destination → carrier → gold → food → send | `Command2` matches these prompt categories, but its implementation ends by printing the quantities and is incomplete. Actual carriage, interception and delivery use the remaster journey model; full native route/outcome parity remains unrecovered. |
| War | Enemy province + commanders → rice/gold and provisions estimate → remaining governor/advice if needed → March | Native invasion-food evidence is in V24. Commander/food selection is retained. Card-based assembly and review are remaster UI; complete native battle-planning prompt order is not newly recovered. |
| Milit / Hire | Hiring general/advice → hundreds → confirmation → allocations → finish/disband confirmation | Native quantity and costs verified above. Recruiting general attributes have no capacity multiplier. See outstanding recruitment popular-loyalty/training differences above. |
| Milit / Reassign | Acting general → change general → assigned men, repeatedly → finish → confirm disband if pool remains | `Command4` has a shared pool and remaining-men exit warning. Personal training redistribution remains an approximation. |
| Milit / Train | Trainer/advice → Confirm order | `Command4` uses trainer WAR and provincial troop strength. Native handling of already fully trained armies differs from summing all local troops in the current training estimate/equation and needs reconciliation. |
| Milit / Build fort | Builder/advice → hex → confirmation → Orders | Remaster addition; 100-gold price and plain/hill placement are not original verified rules. |
| Person / Recruit | Target → invitation method → envoy/advice → gold amount if needed → Confirm order | `Command5` includes target/province selection, willingness dialogue, method and envoy; current GUI omits the separate target-willingness dialogue. Method probability/cost and journey differences remain in P08/P09. |
| Person / Search | General/advice → Confirm order | `Command5.Find` chooses the searching general and calculates dialogue/likelihood. Remaster hidden/general discovery probabilities and monthly advice gate are not a recovered native dialogue algorithm. |
| Person / Governor | Owned province → candidate/advice → confirmation → view that province | Ruler automatically governs the ruler province. Python excludes local ruler province and provinces with one officer from reassignment. Remaster allows reaffirming the sole/ruler governor and adds confirmation. |
| Person / Advisor | Owned province → eligible candidate/advice → confirmation | `Command5` chooses province then eligible INT candidate. Current INT 80 threshold retained; confirmation is a UI addition. Adviser may be appointed remotely, but must be present for local advice/study. |
| Person / Dismiss | Local subordinate → dismissal/disband confirmation; or adviser → demotion confirmation | `Command5.FireOfficer` can select another owned province. Remote general dismissal is still absent; current dismissal is local. Adviser demotion remains separate and retains the general. |
| Diplom | Ruler → envoy/advice; Joint additionally chooses enemy province; Gift additionally allocates gold; Cancel selects ally and confirms | Main.exe two-messenger Rival Tigers evidence is separate below. Do not extrapolate that requirement to diplomacy: current diplomatic missions use one envoy. Full native diplomatic prompt sequences and probabilities are not newly traced; marriage-mode expansion is explicitly optional/remaster. |
| Spy | Infiltrate: province → loyal envoy; Rival Tigers: ruler A → ruler B → distinct envoy A → distinct envoy B; other plots: target general/governor → envoy; Verify/Withdraw: deployed spy | Two Rival Tigers envoys are native-verified at `0x17f6e`, `0x17f8b`, `0x180a8`, with two journeys. Other spy plot probabilities, concealment and return journeys remain partly approximate. |
| View | Other province → local free view / scout for foreign province; Generals; Summary 1/2; Territory; Data order | `Command8` supports the categories. City lists show number, name and ruler with A–Z/# sorting. Exact foreign scout action/cost, disclosure and availability are not newly native-verified; current foreign scouting records a survey without charging resources/action. |
| Cultiv | General/advice → 1–100 gold → Confirm order | `Command9_10_12` actor then amount with INT display and computed feedback. Current shared formula comparisons remain in existing P findings; final UI confirmation is additive. |
| Flood | General/advice → 1–100 gold → Confirm order | Same shared reference command structure; native rounding/feedback not newly traced. |
| Reward | Gold: amount → recipient/advice → confirm; Horse/Writings: recipient/advice → confirm | Native effects verified above. Gold amount-first is intentional. Inventory treasure-book gifting is not this command. |
| Give | General/advice → 1–10,000 food → Confirm order | `Command12` actor/CHA then amount. Relief formulas remain documented separately; current advice is based on the remaster equation. |
| Merch | Trade kind → acting general/advice → quantity; weapons additionally choose recipient → Confirm order | `Command13` chooses mode then trader then quantity. Original weapons equip the trading general; separate weapon recipient is a remaster allowance. Merchant stock/availability and integer trade costs remain as documented. |
| Tax | Governor availability/season gate → impose special tax Yes/No | `Command14` governor action and seasonal restrictions supported by prior audit. Current explicit loss warning is UI feedback. Exact collection RNG remains partially approximate. |
| Map | Province terrain and connected-province deployment edges | Read-only; constructed forts shown. Current painted battlefield and labelled edge presentation are visual remaster additions. |
| Deleg | Province → Self/Direct; Self additionally policy → supply destination → attack target → Confirm order | `Command16` selects province, rule, policy, optional supply and attack destinations and final Yes/No. Remaster “Do not send/attack” selections combine original Yes/No + destination prompts; does not claim exact delegated-AI parity. |
| Exile | Go into exile Yes/No → take all local generals Yes/No; exile orders Move/View/Settle/Rest, settlement confirmed | Matches the previously restored native prompt structure. Remaster exile-party storage, routing and ownership outcomes retain the documented outstanding differences. |
| Advice | Topic / Rumours / Healing; Healing confirmed | `Command18` has adviser and visitor-dependent dialogues. Current monthly order-capability ledger and numerical previews follow user-requested behaviour and remaster equations; complete native advisor accuracy/dialogue equations remain unrecovered. |

**Validation:** 258 gameplay/unit regression checks and 40 DOM/Canvas interface groups pass, including fort cancellation/confirmation/return, all three navigation states, zero-gold reward paths and ruler self-appointment. All 48 static native checks pass. Physical-handset layout/audio and DOS runtime execution remain untested.

The audit therefore records the remaining **destination governor election, remote dismissal, recruitment willingness dialogue, foreign scouting cost/action, weapons recipient, recruitment popular-loyalty and training details, and full diplomacy/spy/delegated-AI equations** rather than presenting them as already equivalent.

#### V25 epidemic naming, compact navigation and native battle costs

The plague event is now **瘟疫 · Epidemic**, including report titles retained in older saves. The normal navigation row contains three equally sized buttons: **Events, Province, Orders**, on every settled-province screen. The Messenger shortcut is removed: journey/interception decisions continue to appear automatically, and their results remain in Events/Chronicle. A pending captive decision can still be reopened through its separate Captives control. The province-heading dropdown (the “V” control) is removed; provinces remain selectable on the map and through View.

**Game Speed now controls both game advancement and all message queues:** Slow 3 seconds, Normal 2 seconds, Fast 1 second, Very Fast 0.5 seconds. The independent Message Speed selector is removed. Earlier saves migrate their old Game Speed labels to these exact durations; a conflicting independent Message Speed is overwritten. Opening controls still pauses active queued reading time. V23/V24 statements about independent speed settings are superseded by this change.

| Battle question | Supplied DOS executable evidence | Result |
|---|---|---|
| Is 30% fire loss correct? | Fire caller `0x22e58` passes mode zero to `0x24752`. At `0x24774`, zero selects a 30% bound; the percentage helper at `0x49f2` and random helper at `0x4b38` produce an integer strictly below that bound. The branch at `0x2475c` defeats burning units with fewer than 100 soldiers. | Removed fixed 30% damage, the mandatory 100-soldier loss and the unrelated 20-point morale reduction. Fire now loses a random integer from zero through `floor(men × 30 / 100) − 1`; below 100 men the unit is defeated. A loss near 30% is possible, but is not guaranteed each day. |
| Water movement | Native terrain-cost bytes at load-image `0x3b12c` (DS `0xb6cc`) are `2, 3, 3, 0, 5, 3, 3`; `0x25aa1` checks mobility and `0x25abd` subtracts the cost. | Water entry costs five; plain two; forest, hill, fort and palace three; mountains remain impassable. Pathfinding, highlights and actual moves use the same table. |
| New turn and Wait | Unit-entry routine `0x226ce` invokes `0x24a6e`: mobility becomes the maximum of existing mobility and `2 + floor(max(0, training − 1) / 20)`. Wait at `0x2262a` adds one only below six. Officer training is offset `0x16`; mobility is `0x17`. | Spent mobility restores to the native allowance when the side becomes active, including a resumed siege. Banked points carry forward. With training 0–20, a spent move restores two, then successive Waits produce three, four, five and six. High training gives a larger starting allowance; this is verified native behaviour. |

The earlier mounted +1 starting-mobility possession rule remains an explicitly documented remaster choice. The daily training allowance is a maximum/floor restoration, **not** a fresh addition every day, preventing repeated Wait from double-counting new-turn points. Implicit Wait from End turn uses the same six-point cap.

The campaign regression also exposed Tiger-and-Wolf forcing a rebellion in a province with an ongoing siege, invalidating its field-army ownership. That order now rejects a province whose origin/target troops remain committed, consistent with the existing war reservation rule. Exact native handling of that exceptional plot/war interaction remains unverified.

`original-v25-checks.json` records **35 static native byte checks**. These are disassembly checks, not execution in a DOS emulator. Dedicated V25 action tests cover spent Move → new-turn restoration → repeated Wait, actual five-point water entry, training thresholds, bounded fire casualties and unified save migration. Older test assertions and help text have been updated to the corrected rules. All 251 unit/campaign checks pass, including the six-scenario 15,000-action Hard/all-battles run (103 battle starts). All 37 DOM/Canvas interface checks pass. Physical-handset layout and audible playback remain unverified.

#### V24 report timing, food provisions and hidden battles

Council and AI governance reports now queue at the selected Message Speed (3 / 2 / 1 / 0.5 seconds), independently of Game Speed. AI advancement waits until playback finishes. Each report retains its event artwork; monthly playback and governance playback do not overlap. Changing speed retimes the active report, including paused reading time. Saved Message Speed now survives loading independently of Game Speed; the older base save validator had dropped it, causing a Very Fast game to reload at 0.5-second messages. Log comparisons use entry content so atomic order rollback does not duplicate old reports or skip new ones.

Spectator mode with “My ruler personally present” now resolves invasions by a separate equation path. It does not perform tactical movement, deployment, weather turns, challenges or action-message playback. Loaded and resumed hidden wars use the same resolver. All-battles viewing and eligible human ruler battles retain tactical combat. Display eligibility also governs the map, battle controls and audio, repairing the mixed China-map/battle-panel presentation in the supplied screenshots.

The DOS executable has separate abstract and tactical entry points: unpacked `0x21418` invokes abstract combat at `0x21138`; its loop at `0x213bb` performs six exchanges. Abstract food at `0x20a81` is `floor(ration men / 6) + 5` per exchange. The remaster now uses that structure and ration helper. **Abstract combat power, casualty coefficients and final probability remain remaster approximations; the exact native combat equations have not been fully recovered.**

| Food rule | Native evidence | V24 implementation |
|---|---|---|
| Daily tactical rations | `0x22e7b`: divide men by 30, then maximum with one | `max(1, floor(men / 30))` for each living army; replaces the previous higher remaster consumption. |
| Defending reserves | `0x22f4c` adds province reserve soldiers to field soldiers; linked-list sum at `0x245dc` reads soldier offset `0x12` | Defenders pay for deployed and undeployed troops in the defending province. Attacker home garrison is excluded. |
| Monthly invasion estimate | `0x1540c`: daily rations multiplied by 30 | War planning uses the same formula. For 10,000 men: 333 daily, 9,990 monthly. |
| Defending food | `0x1ec10` copies the province food stock | Full defending province food is available. Local reserves cannot contribute the same stock again when reinforcing. |
| AI invasion food | `0x1e18c`: five times selected men, divided by 2 or 4, plus random amount up to half the men | Native divisor branch is not fully traced. Remaster policy carries 75 days of actual troop rations plus one, at least 6,000 when available, capped by source stock. It refuses an invasion without a full month plus one. `warProvisionDays` is tunable. AI allies use the same plan. |

Zero food still causes immediate defeat; invasion food can range from zero to the available province stock, up to the native 3,000,000 stock cap. The 75-day AI reserve is a declared policy, not a recovered native equation. Casualties reduce later consumption; defending reserves increase it.

Suspended siege units remain reserved after monthly action resets. Their origin provinces cannot be invaded while their troops remain committed, and reserves cannot join two simultaneous fields. Failed AI orders mark the current state officer rather than a stale object restored by rollback, preventing repeated failed actions from stalling governance.

`tools/verify-original.py` now checks 29 native byte sequences; results are included in `original-v24-checks.json`. Evidence is static analysis of the supplied DOS executable, not an emulator playthrough. All unit/campaign suites pass, including ten new V24 groups and the 15,000-step six-scenario Hard/all-battles run. All 37 DOM/Canvas interface checks pass, including real-clock three-second governance playback at Very Fast Game Speed. These checks cover both food accounting paths, hidden battle loading/resumption, saved speed retention and active speed changes. Physical-handset rendering and audible playback have not been independently verified. Earlier V23 statements about unrecovered daily consumption are superseded by this section.

#### V23 message playback, AI tuning and DOS food evidence

Message Speed is independent of Game Speed: Slow 3 seconds, Normal 2 seconds, Fast 1 second and Very Fast 0.5 seconds. Battlefield messages queue in action order, name the initiating general and retain fire success/failure and simultaneous-attack results. AI waits for the displayed messages. Monthly reports play automatically before province navigation; the Begin monthly orders button is removed. Chronicle entries replay their message and corresponding artwork, then return to the game. Opening controls or hiding the page pauses active reading time; loading/exiting cancels stale playback. Legacy saves receive an appropriate message setting.

Battle AI is in `mjs/ai-battle.mjs`; monthly governance is in `mjs/ai-governance.mjs`, with political decisions in `mjs/ai-politics.mjs`. Main thresholds and probabilities are in `config/ai-config.json`, validated by `mjs/ai-parameters.mjs`. Defaults preserve v22 tactics. See [ai-tuning.md](ai-tuning.md). These are explicit policies, not recovered native AI formulas.

| Food question | Supplied DOS executable evidence | Implementation |
|---|---|---|
| Does zero food defeat either side immediately? | Unpacked offset `0x22dbc` checks the army's 32-bit food against one. The branch at `0x22dd0` assigns outcome 0/4 by side and calls the result setter at `0x25138`; there is no intervening morale check. Both codes map to “food has run out” at DS `0x4128`. | Immediate defeat at food ≤0, regardless of remaining men or morale. Removed an extra remaster starvation morale deduction that could obscure the reason. |
| How much invasion food can be carried? | `0x15449` reads the source province's 32-bit food and passes lower bound zero and upper bound the available stock to the numeric input. | Zero through all available source food; corrected the engine's unintended minimum of one. |
| Why does the HUD allow 3,000,000? | Stock clamp at `0x8fab` uses high word `0x002d` and low word `0xc6c0`, together decimal 3,000,000. | Province stock cap and invasion ceiling remain 3,000,000. The actual maximum is the province's available stock. |

These are static binary checks against the supplied `main.exe`, not an emulator playthrough. `tools/verify-original.py` now has 21 binary checks, including these branches. The unpacked image SHA-256 is `5c3e45a5edb097c8719d65b1678784aaf8412258e2437a26bb89d4b249824506`. Daily consumption and the monthly planning estimate remain documented remaster equations; this update does not claim to recover the original consumption formula.

Army artwork now depicts red attacking formations and blue defending formations. Each unit has its soldier count below, a gold commander star and the general's name on its flag. The selected sheet's first two march/attack frames are used to avoid spear bleed in unused cells. Hidden enemy flags are removed with hidden units. Existing 41 painted battlefields are retained.

Regression coverage includes exact playback durations and cancellation, AI configuration validation, both sides losing at zero food with high morale, invasion stock bounds, named battle action messages and save migration. Browser/physical-handset rendering and audio remain unverified independently of the DOM/Canvas checks.

#### V22 terrain tactics and apparent retreat audit

The AI never issued voluntary flee orders. Remaining soldiers do not prevent commander capture, morale routing, food exhaustion or palace occupation from ending a battle; these rules remain. Result text now distinguishes morale/capture losses from an army depleted to zero. Commanders previously accepted uncertain duels; all AI generals now accept only a guaranteed WAR advantage beyond the duel's ±10 rolls, and initiate challenges only beyond that margin.

Both sides now evaluate nearby jungle ambush positions and dry river banks against visible enemies. Defensive units protect the palace; its guard stays in place. Outnumbered attackers seek advantageous terrain, wait at most two consecutive days for an approach, then resume their objective. Strength considers men, WAR, training, morale and weapon coverage. Fire takes priority when outnumbered or defending the palace against multiple adjacent enemies, subject to weather and friendly-unit/palace wind-spread safety. Empty approach tiles may be ignited to obstruct an advance. Existing native ambush, water damage, fire chance and daily spread rules are unchanged. Fire is not guaranteed to succeed and wind can change later.

These tactical policies are remaster improvements, not claims of recovered DOS AI algorithms. Regression cases cover safe palace fire, rain, jungle, river banks, bounded attacker waiting, commander duels and honest routing reasons. Browser/handset layout limitations and the separately documented long-run suspended-war ownership issue remain.

#### V21 fixed army summary and separate defensive tactics

| Finding | Current behaviour | Evidence / limits |
|---|---|---|
| AI-versus-AI army information scrolls away | The comparison previously had `overflow:auto`, fixed minimum rows and a rebuilt subtree after every AI action. It now uses a non-scrolling, size-contained grid with rows scaled to its allotted height. Columns, statistic cells and weather canvas stay mounted while values, portraits and controller highlighting update in place. Scroll anchoring is disabled and the comparison stays at its top. | Same summary renderer is used in human/AI and AI/AI battles; the 75/25 layout and 20/50/30 section split remain. DOM regression retains the same summary nodes after multiple real scheduler actions and checks every updated army statistic. Physical handset/browser scrolling is not yet independently verified. |
| Sole defender abandons the palace | The sole defender is the palace guard. While holding it, they wait for attackers, attack adjacent threats without moving, and avoid Charge/breakthrough away from the garrison. An adjacent attacking commander that can be killed by a minimum-damage normal strike gets priority. An out-of-position guard returns toward the empty palace using terrain-aware routing. | Combat and victory formulas are unchanged. Normal attacks can finish the attacking commander while the defender remains in the palace. This is an explicit remaster tactical policy, not a reconstructed native AI equation. |
| Larger defending armies need distinct roles | The defender on the palace remains guard; if empty, the field commander is assigned to return. Other defenders intercept reachable enemies approaching the palace. A guard declines uncertain personal combat and challenges an attacking commander only when the WAR comparison guarantees victory under the existing ±10 duel rolls. | This preserves a garrison rather than sending every defender across the field. Reinforcements remain possible under the existing rules. Human orders are unaffected. |
| Attacker needs a different objective | Attackers continue terrain-aware advance toward the palace, engaging blockers. Adjacent palace guards take priority over unrelated weak neighbours; a guaranteed enemy-commander kill takes the highest priority. | Existing Charge, simultaneous attacks and fire remain available to attacking AI. Mountain detours and the battle-wide personal-challenge limit from v20 are preserved. |

V21 verification: **223 gameplay/data/artwork checks**, **35 emulated DOM/native-Canvas interface groups**, and Hard/all-battles spectator simulations totalling **15,000 actions across all six scenarios**. New cases cover every AI level's lone-garrison behaviour, adjacent attacks without charge displacement, commander kills, guard return, larger defensive formations, attacker objectives and safe personal challenges. The separate long-campaign suspended-war save issue recorded under v20 remains open.

#### V20 zero-player Hard / all-battles AI fixes

| Finding | Cause and correction | Verification / fidelity status |
|---|---|---|
| AI cannot detour around mountains | The old tactical AI ranked today's reachable hexes by straight-line distance and refused movement unless it became closer immediately. It could wait forever at a mountain wall even when a distant gap was reachable. Smart AI now plans a complete weighted path over passable hexes, then moves along the affordable prefix. It may move sideways or away from the target to reach a mountain gap. It approaches enemy contact when palace access is blocked. | Mountains/fire/occupied tiles remain impassable, original terrain costs remain unchanged, and enemy contact still ends movement. A route whose next tile exceeds current mobility causes Wait to bank mobility rather than an illegal move. A truly unreachable goal produces Wait. This is a remaster AI correction, not a recovered DOS AI algorithm. |
| Visible AI battle pauses on day one | AI challenge eligibility checked whether **this general** had challenged. The action executor correctly permits only **one challenge in the battle**. A second eligible general attempted another challenge after the first response, causing the scheduler to catch the rejection and pause. The AI now checks the same battle-wide unused-challenge condition as the executor. | Reproduced specifically in the second AI-to-AI battle on Hard (INT90/aggression75), Province 10 → 5, day one. The stored v19 checkpoint now advances beyond day one after save/load and in the actual UI scheduler without human orders. The existing one-challenge rule remains intact, including resumed battles. |
| Reserve entry eligibility | AI reserve candidates are checked against the actual reserve province's entry direction before requesting reinforcement. | Uses the existing action executor's legal-placement rule rather than the main army's approach as a proxy. |

V20 verification: **216 gameplay/data/artwork checks** and **34 emulated DOM/native-Canvas interface groups** pass. Dedicated zero-player Hard/all-battles runs exercise **15,000 actions across all six scenarios**, including 117 battle starts, valid checkpoints and repeated day-one progression. The original 17 static supplied-binary checks remain unchanged/applicable. Tests include a distant mountain gap requiring initially non-improving movement, sealed paths, fire/occupancy, defender contact and the saved second-battle failure. Physical handset layout, audible playback and DOS runtime execution remain unverified.

### Separate long-campaign save issue still open

An additional exploratory scenario-189 run (seed 1, AI INT90/aggression55, all battles, 7,000 actions) found a save-validation rejection after a reinforcement's origin province changed ruler while its captured, zero-soldier unit remained in a suspended war. The captured unit still records its former army owner, while the origin province has a new owner; `validateBattle` reports **Invalid battle officer**. This is distinct from the fixed day-one personal-challenge exception, and no patch to suspended-war custody/ownership has been made in v20. The 15,000-action verification above is six 2,500-action Hard/aggression75 runs, not a claim that indefinite autoplay or every later campaign checkpoint is verified.

#### V19 province selectors, monthly advice and fort placement

| Finding | Current behaviour | Fidelity status |
|---|---|---|
| Other-province A–Z/# picker | A–Z sorts by historical city name, with city number and ruler beside it; # sorts numerically and retains city name/ruler. Both list all eligible cities, rather than filtering labels beginning with # into empty alphabet groups. | UI correction; the original 41-sector graph and historical city labels are unchanged. |
| Missing city identity in orders | Move, Send/Transport, Appoint, Joint invasion, Infiltrate, View, Delegation/supply/attack, War, retreat and exile destinations display #number, city name and ruler (Unclaimed for empty provinces). Recruitment/hostile general choices and province-map approach choices include the same location context. Territory includes a ruler column; custom-ruler starting locations show name/number/Unclaimed. China-map city badges remain compact numbers as requested. | Presentation correction, without changing eligible targets. Alliance/delegation annotations remain attached to choices. |
| Advisor advice could be retried or depended on an INT80 cutoff | At campaign/month start, saved independent rolls are prepared for every ruler and supported order/suborder. Each advisor's INT is snapshotted for the month: INT80 gives an 80% chance per order, INT100 always qualifies, INT0 never qualifies. Unavailable advice says **“I need more info this month to estimate this order.”** Reopening, changing candidates/amounts, province, or save/load does not reroll. Eligible advice still evaluates the current candidate/amount. Midmonth INT changes take effect next month. The advisor must still be present in the province. Advice topics use the same saved gate. | Explicit user-requested remaster rule, not a claim that main.exe precomputes these decisions. Separate deterministic advice rolls do not consume combat/event RNG. Old saves acquire a ledger once; newly created rulers receive deterministic rolls for the same month. Original appointment still requires INT80. |
| Build Fort below monthly events | Removed from the events review and placed under **Province Orders → Milit → Build fort**. Choose a ready builder, then a legal plain/hill hex on the battlefield preview; placement can be cancelled. Costs remain 100 gold and the builder's action. | Fort construction is a tactical-map feature. Its remaster cost/legality remain as previously documented; Milit placement is the requested UI correction. |

AI bridge is **discussion only** in v19. Existing browser WebMCP tools still read/select/stage; no remote/local AI gameplay API or multiplayer server has been added.

#### V18 — governor election, province routes, messenger audit and launch visibility

| Request | Implementation / finding | Original-game evidence and limits |
|---|---|---|
| Governor when the ruler marches | War asks **Who will govern Province #N?** whenever the departing army includes the current governor. There is no preselected candidate. March requires a remaining officer; invalid choices consume no stores, action or RNG. A present advisor whose saved monthly governor-advice decision qualifies assesses each chosen candidate before confirmation: loyalty/defection/rebellion concern, CHA for rewards/recruitment, INT for development/flood control, troops and recovery/monthly-action limits. Without a qualified advisor, cards and a risk notice remain available. | The human player elects the governor; AI chooses among remaining officers by loyalty then CHA. Appointment does not itself spend the candidate’s action. Battle normalization/save/load preserves the election; when the ruler returns they resume governing. Advice is qualitative and uses remaster equations/conditions, not a recovered original defection percentage. |
| China ownership appeared to create extra neighbours | The old nearest-city Voronoi borders were illustrative and falsely implied playable adjacency. Ownership areas now have separating gaps; selecting a city highlights **only its fixed native connections**, draws their routes and supplies clickable numbered route buttons. Turning numbers off also hides route overlays. Historical city locations/names remain; terrain and ownership alone no longer define routes. | Province 9’s complete native neighbour list is **6, 7, 8, 10, 16, 17**. War in scenario 189 exposes enemy provinces **6, 7, 8, 10, 16**; Move exposes **17**, which is unoccupied. Province **18 is not connected** to 9. No movement/war rules or native links were changed to follow modern geography. The map is still an illustrated historical-seat map, not a reproduction of DOS sector boundaries. |
| Rival Tigers messenger count | **Two distinct messengers**, one per rival ruler, are correct. Prompts name the separate destinations. Save validation now enforces exactly two distinct assignments for Rival Tigers and exactly one for other courier missions. | Supplied `main.exe` static disassembly: `0x180a8` requires at least two available officers; calls at `0x17f6e` and `0x17f8b` select/store separate envoys through the same selector; `0x1803d` and `0x18086` dispatch separate journeys. The original manual also states different messengers are sent to each ruler. No Python Spy implementation exists in the inspected JuQiang checkout. Original binary supersedes it. |
| Other missions using two messengers | No other inspected province mission needs two. Alliance, Joint invasion, Marriage, Gift, Threaten, recruitment/transport escorts and single-target spy missions use one selected envoy; Cancel alliance has none. Infiltrate uses the selected infiltrator. | Joint invasion involves two realms, but that does not require two messengers from the initiating player. Allied reinforcements are a separate response. Original Rival Tigers resolves two outward legs separately; the remaster retains its combined success estimate and final effect after both destinations, so exact partial-success behaviour/equations remain a fidelity difference. |
| Launch scene blocked by menu | Keep the painting unflipped. The left-hand dark mountains carry title/seal above a compact menu. The right-hand armies, river and capital remain visible, without the former translucent/blurred menu panel. The repeated menu heading is hidden. Scenario setup retains a readable panel once New Game is selected. | Reuses `launch-v9.webp` unchanged and preserves its aspect ratio. No artwork regeneration or stretching. |

The binary verifier adds five reproducible Rival Tigers checks: **17 binary checks** in total, plus the closed three-officer Liu Bei 189 scenario check. These are static checks, not DOS execution. Source: supplied English `main.exe`; the matching published original manual (Spy / Rival Tigers) is available at https://www.digitpress.com/library/manuals/nes/Romance%20of%20the%20Three%20Kingdoms%20II.pdf .

#### V17 — army equipment, faster music, charge occupation, victory artwork and painted battlefields

The supplied **main.exe supersedes JuQiang wherever they conflict**. Its existing static verifier was rerun: twelve exact binary/scenario checks pass, including the separate charge occupation and surviving-defender breakthrough paths. This does not constitute a DOS execution trace. The closed finding that Liu Bei starts 189 with three officers is unchanged.

| Request | V17 implementation | Fidelity / limits |
|---|---|---|
| Weapons throughout army/economy/HUD | Army comparisons include total weapons and per-army armed coverage; general selection cards, the war council and unit inspection show equipment. Battle HUD edits the unit’s 0–10,000 weapons directly. Equipment carries into battle, reinforcement, saved/suspended wars and settlement. Merchant purchases cost **one gold per 100 weapons**, require a visiting merchant and consume the buyer’s monthly action; buyer and recipient may differ. Available gold and equipment capacity limit the quantity. Smart AI buys equipment below 80% coverage while retaining 100 gold. | The existing remaster attack multiplier is **0.65 + 0.35 × min(1, weapons/soldiers)**. Equipment above that unit’s soldier count adds no attack bonus. This is an explicitly approximate combat formula, not a newly recovered native equation. Weapons are durable stock: no invented monthly maintenance or casualty-based weapon destruction is added. Counterattack’s existing formula is unchanged. |
| Faster battlefield music | A newly composed **144 BPM** looping track replaces the previous 96 BPM battle loop. It has eighth-note zither, accented marching drums, brief rolls, horns/flute and restrained gong. Victory retains its separate fanfare. | Original synthesized composition; no copyrighted DOS recording or sample is copied. Music and effects retain independent switches. Physical handset playback still needs device verification. |
| Charge to zero occupies the target | The charge records the defender’s coordinate before damage and explicitly lands on that coordinate when the target reaches zero. It does not inspect or roll for the next hex in that branch. The occupation coordinate is retained in the final victory report when the charge ends the battle. All module imports and the entry stylesheet/script use the v17 release token to avoid mixing cached older modules with this release. | The zero-soldier branch already existed in the inspected v16 source; an incorrect landing could not be reproduced in the direct engine checks. V17 adds actual-button/field-label coverage and explicit landing diagnostics rather than claiming an unobserved native logic defect. Original charge’s terminal and breakthrough branches remain separate; the remaster’s damage exchanges are still approximate. |
| Missing victorious artwork | The triumph image is versioned and preloaded with the same loader used for other game art. The victory dialog draws that loaded image on an aspect-preserving canvas, rather than a separate late-loading HTML image. Continue still gates every captive decision, and the defeated commander remains last. | Repairs artwork delivery/presentation. The attached screenshot showed an open victory dialog with a broken image, not an absent victory decision state. |
| Abandon autotiling | **41 distinct complete paintings**, one per original province terrain guide, replace the terrain atlas and all battlefield autotiling/blending. Each painting is drawn once with one scale factor. Existing units, weather, fire and movement/deployment highlights sit above it. Existing city artwork marks **every original fort/palace coordinate and constructed fort** exactly, compensating for omitted or softened town details in the paintings. | Original 156-cell terrain arrays, passability, coordinates, palace anchors and fixed province connections remain the rules authority. Raw paintings may omit some town details; exact city overlays restore every gameplay landmark. Painterly borders are illustrations; no claim of pixel-perfect historical cartography is made. The manifest binds every painting to its province, dimensions, content hash and original terrain hash. |
| Visible End turn | A permanent **End turn** button sits below battle actions. It remains available after every unit has acted and in tactic submenus, without opening Menu. It ends the acting army’s daily orders; unused units Wait, the opposing army acts, and a completed defender turn advances the day and consumes food. | Preserves the existing battle turn/day rules. Initial placement retains its separate Confirm placement control; a pending personal challenge must be answered. Compact landscape keeps the turn button visible while order content can scroll. |
| Avoid the mobile keyboard | Every numerical order, allocation, supply, coordinate, custom ability and HUD field uses a slider plus **Min / − / value / + / Max**. The slider changes large quantities quickly; buttons adjust the field’s exact unit and repeat on hold. Bound changes update the controls and unavailable increments are disabled. Large choice lists use initial-letter filters instead of a keyboard search box. Custom names use a collapsible in-game letter pad, keeping system keyboard entry out of the game. | Slider units match the order: one man for reassignment, one hundred for Hire/weapons lots, one gold/food/day/ability point elsewhere. Engine validation remains authoritative. No number pad hides the landscape battlefield. |

**Validation:** final gameplay, asset and interface check results are recorded in the v17 README. The original binary checks, all 41 painting identities/ratios, attack effects of equipment, merchant costs, equipment save/settlement, terminal charge coordinates, real Charge action/label, persistent End turn, numeric bounds/hold-repeat and rendered triumph canvas are covered. Browser/DOM Canvas checks are emulated; physical handset interaction, audible playback and original DOS runtime execution are not claimed.

#### V16 — captive sequence, availability, typography, map controls and terrain blending (historical; terrain rendering superseded by V17)

The supplied **main.exe retains priority over JuQiang**. No new original-game formula or binary behavior is claimed in this presentation update. V15 and earlier sections remain dated history.

| Request | Current implementation | Fidelity / limits |
|---|---|---|
| Defeated commander last | Battle settlement queues the defeated field commander after every other captive from that battle, whether attackers or defenders win. Other captives retain their stable order. Triumph still precedes all captive decisions. | Uses the actual field commander, not simply any ruler/governor role. New settlement order survives save/load. |
| Grey unavailable orders, still explain | Invalid province orders and suborders use subdued grey styling while remaining clickable; clicking displays the relevant reason without spending resources or actions. Checks cover completed months, used/recovering generals, governor/ruler restrictions, seasonal Tax, visitors, rewards/study limits, merchants, resources and eligible destinations. Read-only View/Map remain available. Battle orders already spent for the day are also grey and clickable; Fireball explains rain. | Authority remains in the engine at execution. Non-player controls and empty form confirmation buttons retain their existing protection. Appointment/dismissal and deployed-spy inspection are not incorrectly blocked solely because local generals acted. |
| Consistent typography | One Georgia/serif family and shared body/control/metadata/heading sizes replace the mixed serif/system fonts and mismatched tiny text. Province Orders and China province numbers share **14px** text at the default browser size. Body text is 16px, secondary metadata 12px; larger titles use the shared heading scale. | Intentional remaster presentation; text sizes use rem units and follow browser font settings. |
| Hide map numbers | A **44×44** number toggle sits immediately below the 44×44 zoom-out button. It independently hides/reveals numbered city badges, stars and their connecting guide lines. City artwork remains selectable by tapping the map. | Works with Ownership on or off. The setting is checkpointed; older saves default to visible numbers. Province/battle detail numbers remain visible. |
| Historical portrait revision | Fifteen named officers receive new portraits, including every requested example. Xiahou Dun uses a both-eyes variant before 198 and a scarred-left-eye variant from 198. All province/battle/card/selector placements preserve aspect ratio. | Still 352 distinct historical portrait assignments per year. The atlas is an artistic reconstruction; recorded traits, literary conventions, sources and full generation prompt are documented in `artwork/historic-portraits-v16.md`. No surviving exact likeness is claimed. |
| Active battlefield unit blinks | The selected living, placed, unspent army on the acting side pulses between 46% and full opacity every 1.2 seconds, including its formation, side marker and label. It has a gold outline, stops pulsing after its order, and transfers when another unit is selected. | Suspended/finished/deployment battles and spent/enemy units do not blink. Reduced-motion preference keeps a static gold outline. |
| Seamless neighbouring terrain | Six-neighbour bitmask variants now use a normalized world-space terrain blend, including three-way corners. Repeated fields overlap with feathered edges instead of mirrored kaleidoscope patterns. Fort/palace illustrations blend only at their centres so their square grass background cannot overwrite coast/forest edges. | Uses the clean V15 artwork. Original terrain type, movement/fire rules, impassable cells, province maps and directional entry zones are unchanged. Visual coasts are softened; exact tile boundaries remain faintly visible for tactics. Cached blend kernels and tile canvases avoid repeated expensive painting. |

**V16 validation:** 199 gameplay/data/artwork checks and 27 DOM/Canvas interface groups pass. These include actual rendered map number visibility for both ownership states, grey-but-clickable monthly and battle orders, a changing active-unit opacity that stops after Wait, commander-last settlement for either winning side, portrait uniqueness/aspect ratios, and all six shared terrain edges/corners. Mobile-sized China and battlefield rasters were rendered and inspected. This is emulated interface/raster verification; physical handset touch/audio and original DOS execution remain outside these checks.

#### V15 — clean terrain, provisions, triumph, advisor forecasts and families

The supplied English **main.exe still supersedes JuQiang wherever they disagree**. V15 adds the following requested changes; the V14 and earlier sections below remain dated implementation history.

| Request | Current result | Fidelity / limits |
|---|---|---|
| Clean battlefield tiles | `https://github.com/zhonecloud-sketch/prototypes/blob/52c4d359dd5576b220b98c2a0329e34473e854bd/rtk2/assets/terrain-v15.webp` replaces the gritty V14 atlas. Bright grass, readable tree canopies, broad hill/mountain forms and clear blue water use the existing six-neighbour bitmask transitions. World-aligned fields are sampled across several hexes; connected terrain shares edges. Weather tints are lighter. | New illustrative art, not recovered DOS graphics. Original province terrain grids, impassable cells and deployment edges are retained. |
| War food estimate | War updates soldiers, daily food, estimated 30-day food and days covered as commanders/food change. | Matches the current battle rule exactly: **daily = ceil(total living field soldiers / 20); month = daily × 30**. Example: 20,000 men need 1,000 food/day or 30,000 for 30 days. Casualties reduce use; reinforcements increase it. This consumption equation remains a remaster rule. |
| Triumph before captives | A human winner sees an illustrated Victory screen, province number/name, reason, day and captive count. Continue then opens captive/treasure decisions. The pending victory survives checkpoints and prevents province, spoils or captive orders from bypassing it. | New presentation. AI-only victories keep the automatic simulation moving. |
| Battlefield music | Separate 40-second pentatonic battlefield loop, with drums, plucked strings, flute and horns. Victory plays a separate 18-second fanfare; the council theme resumes after Continue. | Original synthesized compositions, independent of Sound effects. Music mute, document visibility and exit stop playback. Audio routing/media were checked; audible quality and handset playback need user evaluation. |
| Advisor feedback | Reward Gold/Horse predicts capped loyalty gains, minimum useful gold, full loyalty and horse stock; Writings explains INT gain, required advisor difference and monthly study limits. Forecasts update while amounts change. Give, Cultivate/Flood, Train/Hire/Reassign, War, Move/Send, appointments, Tax and merchant orders have relevant guidance. Recruitment, diplomacy and spy probabilities retain their existing forecasts. | Requires an appointed advisor with INT 80+ present in the province. Forecasts use the implemented order equations and probabilities; the original advisor's complete prediction algorithm is not recovered. |
| Historic / Fiction selection | Both choices now have a visible gold selected state and `aria-pressed`; switching is saved into the new campaign. | Their handlers already existed. The defect was missing selected-button styling, not intended decorative controls. Historic keeps dated chronicle/state-history and named early-death windows; Fiction suppresses those while retaining ordinary aging/campaign events. Full DOS fiction stat/affinity changes remain unrecovered. |
| Family progression | Scenario setup offers **Original** or **Expanded** family rules independently of Historic/Fiction. New games default to Expanded; old campaigns retain Original unless enabled via Menu → Royal Family. | Expanded spouse/birth/age rules are explicitly a remaster extension, not an original-game claim. |

### Original marriage evidence and the expanded rules

Reinspection confirms native outgoing daughter-marriage partner writes at unpacked **0x10AD6** (`ruler+0x21`) and an incoming marriage link write at **0x10B85** (`ruler+0x20`). The previously confirmed proposal checks at **0x16F06** and **0x16F2C** still test the no-daughter flag and existing outgoing marriage. Receiving a marriage and offering the ruler's daughter are distinct links: receiving a spouse does not itself generate or replenish a daughter. The static audit has identified **no child birth schedule, numerical child ages, fertility attribute or growing family roster**. This does not claim DOS runtime emulation or prove every untraced branch absent. Reproduce the 12 exact binary checks with `python3 tools/verify-original.py ORIGINAL_FILE_FOLDER docs/original-v15-checks.json`; original binaries are not included in the game pack.

Expanded mode addresses the requested long-term family progression:

| Mechanic | Remaster rule |
|---|---|
| Spouse | One current spouse per ruler. An unmarried ruler can use **Diplom → Court marriage**, costing 100 gold and the ruler's monthly action, or receive another ruler's royal proposal. Court marriage is therefore an alternative to royal marriage. |
| Royal proposal | **Diplom → Royal marriage → unmarried receiving ruler → eligible child → messenger**. Princesses may marry male rulers, princes female rulers. Both receiving ruler and child must be at least 16. The existing mounted messenger/interception and diplomatic acceptance formula apply. Refusal does not consume the child; acceptance saves reciprocal family links. |
| Birth probability | All eligible married families share a **3% monthly probability** of an expected birth. No invented fertility score is assigned to each historical ruler. Both spouses must be 18+, the mother at most 45 and father at most 65; an ill, injured or captive ruler does not start an expected birth. These are gameplay constants, not demographic advice or recovered DOS equations. |
| Birth timing | Expected births are saved with a gender and due month, then occur after **nine months**. A **twelve-month cooldown after birth** prevents immediately starting another. Prince/princess gender uses the seeded campaign random generator with equal probability. |
| Age and availability | Children have a birth month, exact completed-year age, unmarried/married/widowed status and a one-time age-16 monthly report. Births also appear in the monthly council. |
| Viewing | **Menu → Royal Family**, **ruler detail → Royal Family**, or **Diplom → Royal Family** shows spouse, expected birth, princes/princesses, eligible count and every child's age/status. |
| Native daughter slot | Expanded mode seeds an age-18 princess only when the native gameplay daughter is available; an old outgoing marriage becomes the matching spouse link. This is a migration of the original abstract marriage slot, **not a historical genealogy**. Custom rulers begin with no children. |
| Succession / deaths | Family records are archived by reign, preserving marriages and genealogy when a parent dies or is displaced. A dead/displaced receiving ruler frees the royal spouse for remarriage. A new ruler begins a separate family. |
| Roster | Royal children are family records, not automatically officers or successors. The original 352 distinct officer roster is unchanged. Creating playable officers from children or dynastic succession is outside this change. |

The deterministic birth/family rules preserve checkpoints, use the game's seeded RNG and validate reciprocal spouse/child links. The original one-daughter model remains selectable. New family UI uses the game's themed buttons; no standard radio buttons or list boxes were introduced.

V15 validation: **192 gameplay checks** including 12 new V15 groups; 25 raster/interface groups; 12 original-binary checks; MP3 metadata/decoding; rendered battlefield review. Device screenshots and human listening remain distinct from mocked interface/audio checks. The refreshed package retains the V14 `rtk2/{mjs,assets,config,docs,tests,tools}` layout and excludes the already supplied shared `lib` folder.

#### V14 — requested controls, original-binary checks, terrain and folder layout

**Authority:** the user-supplied English `main.exe` supersedes JuQiang's implementation whenever they conflict. The Python reconstruction helps locate and interpret evidence; it cannot override the binary. NES-only manual rules remain edition-qualified. Explicit user changes continue to take precedence in this remaster.

| Request | V14 result | Evidence or limit |
|---|---|---|
| Northern influence areas | Provinces **1, 2, 3, 4 and 15** stop 12 projected map units north of their city, rather than extending to the map's top border. Other ownership polygons, city coordinates and game adjacency are unchanged. | Display-only cap; the colour regions remain a map abstraction. |
| Game Speed | **Menu → Game Speed → Slow, Normal, Fast, Very Fast**. Selection is saved. | No speed selector remains on the map. |
| Resume AI | The **Resume AI** button is inside HUD, on every tab. Opening HUD pauses AI; Resume closes HUD and continues playback. | Removed map and instruction-pane AI playback buttons. |
| Map switches | Province map/China map and Ownership on/off share **108 × 40 CSS-pixel** button dimensions. | Same rules apply to desktop and landscape mobile. |
| Charge occupation | A surviving charger whose target reaches **0 soldiers** moves directly onto the target's tile. This branch does not roll breakthrough chance or inspect the next tile. | The original terminal-defender branch updates the target coordinates and occupancy separately from breakthrough. |
| Surviving-defender breakthrough | The next tile must be on-map, passable and vacant. The chance now uses the attacker's **War / 100**, replacing a fixed 50%. | Native call at unpacked `0x26503` supplies officer byte `+5` (War) to the percentage helper. Other remaster combat damage/strike-count rules are still approximations. |
| Daughter status | Ruler details show **Daughters: 0 or 1** and **No daughter / Eligible for marriage / Married to [ruler]**. Marriage checks this availability. Receiving another ruler's daughter does not consume your own. | Native ruler `+7` bit `0x02` means no daughter; `+0x21` holds her marriage partner. This represents one tracked marriage daughter, not a historical family census. |
| Daughter birth and age | No daughter-birth event or daughter-age system was identified in the supplied DOS implementation. V14 does not invent either. Scenario flags supply initial availability; ruler replacement/death retires the affected marriage state. | There is no numerical marriage-age check in the native marriage path. All initial active rulers in the six supplied scenarios have the availability flag clear and marriage partner `0xFF`. |
| Liu Bei 189 | **Three generals: Liu Bei, Guan Yu and Zhang Fei. Closed.** | Directly verified against the supplied English scenario and Chinese reference; user confirmed closure. |
| Battlefield art | New generated **2048 × 1024** terrain atlas, square cells and preserved proportions. World-aligned grass, woods, hills, mountains and water textures join across tiles. Six-bit adjacency masks select soft terrain transitions and connected riverbanks. Fort/capital artwork stays on its terrain. | Original 41 terrain grids, six-direction geometry, passability and deployment rules are retained. This is a substantial rendering/artwork change. |
| Folder structure | Main files at `rtk2/`; tests, tools, modules, assets, documents and configuration in their named subfolders. **No shared library files are in the game ZIP.** | Extract beside the existing `prototypes/lib/` and upload `rtk2/` to the requested GitHub Pages path. |

To view your daughter status, open **Province Orders → View → Generals**, select your ruler, and read **Daughter**. The ruler's portrait opens the same detail when selected. **Diplom → Marriage** reports if you have no daughter or if she is already married. The original does not expose a daughter's numerical age, so there is no age to inspect; an available unmarried daughter is marriage-eligible.

The supplied binary was unpacked using its own backwards run-length encoding: **173 blocks, 246,400-byte load image**, SHA-256 `5c3e45a5edb097c8719d65b1678784aaf8412258e2437a26bb89d4b249824506`. Ten exact byte checks reproduce the selected charge/marriage branches, in addition to the scenario chain check. This is **static disassembly verification, not DOS runtime execution**. `original-v14-checks.json` records the checks; run `python tools/verify-original.py INPUT_DIRECTORY OUTPUT_JSON` with the original supplied files to reproduce them. Offsets in this V14 section refer to the unpacked load image; the older X01–X12 table refers to the packed file.

Original charge dispatch: attack menu at unpacked `0x26980` stores choices 1–4; the branch at `0x26652` calls charge at `0x26318` for choice 4. Combat status `0` denotes defender defeat, `1` attacker defeat, `2` both defeat, and `0xFF` continuing combat (`0x24BE0`). The terminal defender branch writes the attacker's target coordinates at `0x2644C` and swaps battlefield occupancy at `0x2645F`/`0x23866`; it then returns. The later `0x264C4` path computes the tile beyond the defender and performs the terrain/occupancy/War tests. The remaster explicitly treats **soldiers ≤ 0** as defeated, as requested. Native damage uses strict unsigned loss comparisons and a variable charge-strike count; exact equality/casualty arithmetic is not claimed to be emulated by the remaster.

Folder deployment mapping:

| URL/path | Contents |
|---|---|
| `prototypes/rtk2/` | `index.html`, `style.css`, `START-HERE.html`, launchers, package manifests and source-commit marker |
| `prototypes/rtk2/tests/` | All gameplay, artwork and DOM/Canvas test scripts |
| `prototypes/rtk2/tools/` | Data/art/audio generation, native-data verification, packaging and local-server tools |
| `prototypes/rtk2/mjs/` | Every game ES module |
| `prototypes/rtk2/assets/` | All game images and audio |
| `prototypes/rtk2/docs/` | This report, README, artwork provenance and licenses |
| `prototypes/rtk2/config/` | Scenarios, battlefield grids, geographic data and game rules YAML |
| `prototypes/lib/` | Existing `js-yaml.js`, `three-core.js`, `three.module.js`; **excluded from ZIP** |

The running Site contains a sibling shared-library directory for its own hosting. The requested ZIP contains only `rtk2/`. GitHub Pages publication itself is not claimed: no GitHub write connection is available in this session. The package is ready for the stated existing `prototypes` folder layout.

**V14 validation:** 180 gameplay/data/artwork checks, 25 DOM/Canvas UI groups and ten native-byte checks pass. Mobile-sized China/battle scenes were rendered using native Canvas and inspected. Physical handset/audio testing and original DOS runtime testing remain outside these checks.

#### V13 — remaining feature branches and final discrepancy status

The remaining audit entries have been reviewed against the final source. V13 implements the branch gaps below, preserving the user’s map, mobile layout, image-ratio, charge and restricted-retreat requirements. **Completion of this audit does not mean byte-for-byte original-game parity:** the exact executable algorithms and edition-dependent rules still listed below have not been recovered and are not presented as verified fixes.

| Finding | V13 implementation | Remaining distinction |
| --- | --- | --- |
| P03, messenger goods | Gold, food and recruitment horses are deducted at departure and saved as cargo. Bandits can steal part of a supply convoy; successful escorts deliver the remainder. Capturing/beheading an outward envoy seizes cargo once. Refused gifts return the offer. | Bandit/interception routes, travel duration and rates are remaster rules. Supply losses use a 2–12% per-link risk and a 10–40% cargo fraction. |
| P04, P19, P23 | Reassignment retains each general’s training; hiring dilutes increased allocations with the provincial weighted average. Foreign View selects a ready scout; no action is charged. Merchant weapons have a separate acting buyer and recipient. | Scout action cost and exact hired/reassigned training rules need an executable trace. |
| P13, P14 | A submitting ruler joins; individual subordinates can refuse and become free. Officers/resources/governors remain consistent. Diplomatic hostility changes preserve the existing directional difference rather than forcing equal relations. | Submission probabilities and reaction magnitudes remain custom. An emptied province becomes independent rather than retaining an invalid governor. |
| P15, B13 | A human ally accepts/refuses joint invasion and selects 1–5 adjacent ready commanders, carried food and gold. Battle Reinforce → Ask ally supports both armies with a saved mounted request and entry at the ally’s own approach. AI can request and answer support too. | Ten active units per side remain; no governor is abandoned. Refusal/noncompliance costs five trust. Exact DOS timing, allied control and compensation rules are unverified. Unused contributed stores return proportionally where an allied province survives. |
| P17, P26, E10 | Spies can abandon covert allegiance after enemy recruitment. Advice adds independently cached War/Officers/Spy/Visitors topics. Special visitors walk to an adjacent province or remain in place each month. | Spy defection uses the current enemy-service loyalty; original covert-loyalty representation is unknown. Advice accuracy remains an INT roll. Merchant economics and visitor probabilities remain unverified. |
| P25, E12 | Self rule now selects Full/Internal/Military/Personnel, a friendly supply destination and adjacent enemy attack target. Delegated generals use the ordinary costs; policy supplies and favorable attacks run at faction completion. Delegated provinces require return to Direct rule for manual orders. Province Rest completes that province and moves to the next direct province; the separate End turn still completes the faction. | Policies/scheduling are functional remaster heuristics, not recovered DOS AI. Delegated supply bookkeeping is immediate; the manual Send command uses the convoy journey. |
| B11, B16–B18 | Only the commander can bribe. One opening duel is allowed; defeating a stronger duellist grants one WAR. A noncommander fleeing through adjacent hostile control risks capture, based on INT/WAR. | WAR-80 threshold, day-one eligibility, five-percent refusal desertion and user-requested destinations remain. Flight risk is `clamp(45 − (INT+WAR)/5, 5, 40)%`; it is not a decoded DOS constant. |
| B23, possessions | Protect/plunder follows each attacking victory after captive decisions. Castle discoveries queue a recipient choice. Sixteen named reward entries include books, swords, princess rewards, mounts, a medical book and the hereditary seal; possessions persist and are visible in general detail. | The executable’s adjacent type/bonus bytes support the INT/WAR/CHA values below by static inference. Discovery probability (20%), global uniqueness, mounted +1 mobility and seal +10 trust are remaster choices. No initial native treasure-status import, complete treasure-transfer model or original seal victory logic is claimed. |
| Custom ruler/follower | The ruler-selection step can create one custom ruler and a loyal follower in an empty province, with name, sex, age and a 250-point ability budget. Both have stable appended IDs and survive save/load. The 352 historical identities are unchanged. | This replaces the DOS age/sex base-stat allocator and birthday prompts with a mobile form. Custom officers use the reserved portrait; they are outside the 352 unique historical portraits. |
| E05, E06, E08, E09 | Free/hidden officers now share January death checks; future/prisoner identities are protected. Natural disasters also affect unowned provinces. AI initiates the diplomatic/covert repertoire using real saved missions. Historic mode includes a state-eligible Tao Qian bequest to Liu Bei; Fiction skips it. | The bequest is a remaster script requiring both realms, not a verified DOS event. It does not kill Tao Qian. Complete historic scripts, native lifespans, economics and original ruler AI remain untraced. |

**Verification:** 175 gameplay checks and 24 DOM/Canvas interface groups pass. Added checks cover custom save identity, all delegation policies, provincial Rest, human allied consent, defensive support and deployment, cargo conservation/seizure/refusal, subordinate surrender refusal, unique item rewards, connected visitor movement, cached advice, conditioned history, AI mission dispatch, commander bribery, duel limits and flight capture. New interface flows cover custom creation/load, allied refusal and treasure recipient selection. Physical handset touch/audio and execution of either DOS binary remain untested.

### Static treasure-table evidence

Names and nearby type/value bytes were rechecked in the uploaded `main.exe` at `0x340FC`–`0x34260`. The type-to-stat interpretation is an **inference** from the adjacent labels and table structure, not a runtime trace. The matching remaster values are:

| Reward | Attribute/value |
| --- | --- |
| Meng De’s new treatise / Sun Tzu’s war manual / Book of Heaven | INT +8 / +10 / +5 |
| Luminous sword / Sword of Trust / Seven Stars Sword / Black Dragon Sword | WAR +8 / +8 / +5 / +10 |
| Princess Fu Rong / Da Qiao / Xiao Qiao / Chu Shi / Gong Yao | CHA +10 / +5 / +5 / +10 / +8 |
| The Red Hare / Black Lightning | Native type 3, value 0; remaster mounted starting mobility +1 |
| Hua Tuo’s medical book | Native type 4, value 0; requested one-month recovery |
| Hereditary seal | Native type 5, value 0; remaster trust +10 |

**Remaining fidelity differences:** precise arrival slot/month semantics; whole-realm versus local exile followers/resources and rebel encounters; original succession loyalty; combat/economic/capture/event probabilities; original historic/fiction affinity/stat behavior; complete conditional historical scripts and lifespans; initial/transfer treasure flags; court/imperial-capital logic; defender selection and DOS confirmation of the manual-based first-turn rule and five-attacker limits; exact deployment masks, seasonal salary/population scheduling and device behavior. None is relabelled “fixed.” The accepted overrides in section 8 remain intentional. This is the evidence-based boundary of the completed comparison.

**Complete portable game pack:** playable game, all art/audio, six scenarios and arrivals, local JavaScript libraries/licenses, source, tests, import/decode tools, this report, launchers and source commit. No build or internet connection is needed once extracted; Python serves the files locally. Development tests additionally need Node/npm. Original DOS executable and unmodified commercial resource files are not redistributed.

#### V12 reconciliation — retained release history

The three critical campaign defects are repaired: voluntary exile continues, every declared future-arrival record is represented, and unresolved warfare carries into the next strategic month. The fixes below are covered by state/checkpoint and DOM/Canvas regression checks. The older coverage tables remain labelled as baseline evidence rather than current omissions.

| Area | v12 result | Limits of original-game verification |
| --- | --- | --- |
| Future officers [D02/E11] | All **412 non-sentinel** records imported: **161 / 104 / 75 / 42 / 21 / 9** by scenario. Dates, province, source-slot byte, names, canonical identity, native attributes and portrait references are retained. Monthly activation checks dates and never duplicates or resurrects an identity. | `encodedYear + 1`, with activation at monthly review in the qualifying year, remains the documented remaster interpretation. Exact DOS month and the meaning of the reference/slot byte require a runtime trace. |
| Stable save identities | Initial 255 IDs stay fixed; missing future officers are appended. Maximum observed slot counts after all arrivals are **406 / 351 / 321 / 288 / 267 / 255**. A 512-slot validation bound accommodates this; the catalogue still has 352 distinct historical identities across all scenarios. | This deliberately avoids DOS pointer/slot reuse. Unnamed initial slots are retained; 406 slots is not a claim of 406 distinct officers. |
| Native service/personality [D03/D04] | Correct file base `0x16`; all 905 serving scenario instances now match native service bytes exactly, with zero discrepancies. Benevolence and blood word imported. Known old-offset service dates are repaired on save migration when still matching the faulty initial value. Family-mask overlap and ten years of service protect against the current low-loyalty departure roll. | Ten-year immunity and other loyalty calculations are remaster interpretations; DOS thresholds and recruitment effects are not verified. Existing changed service dates are preserved. |
| Exile [C01–C03] | Ready ruler → Yes/No → take all local generals Yes/No. Provinces become independent, but the human player continues with a saved party, existing troops, the home province's gold/food, and Move/View/Settle/Rest. Settlement requires confirmation and an empty province. Ongoing wars prevent abandonment. | “All” means generals in the ruler's current province; other provincial followers become free and their troops return to population. Original resource carriage, rebel encounters and the DOS Other/settings branch remain untraced. |
| Succession and completion [C04/C05/C07] | A human realm gets a saved successor choice. AI retains an automatic heir. A sole ruler can die; losing the last human realm ends play. Owning all 41 provinces produces a unification report. | Original succession loyalty adjustment and ceremonial artwork are not recreated. |
| Extended warfare [B01] | Day 30 suspends the battle; no default defender victory. Positions, losses, food, gold, orders and commanders persist; ruler succession updates realm references without replacing field commanders. Province orders and other factions proceed while field generals and besieged provinces are locked. Multiple suspended wars can coexist and resume after the following month's council. | No claim of the original monthly siege-supply or simultaneous-war scheduler. Battlefield engagement remains sequential. Calendar deaths and departures of committed field officers are deferred; omens persist until they leave the field, and political province changes are blocked during the siege. These are continuity safeguards, not verified DOS scheduling rules. |
| Battle rules [B06–B09/B12/B14/B18/B20] | Hostile adjacent control stops further normal movement. Jungle units are concealed from drawing/inspection until approached. Any lead commander defeat and food reaching zero end combat. Local defender reserves can reinforce. Invasions choose a separate field purse; enemy View and Bribe spend it. Stronger defeated opposition can improve winner WAR by one. Winning commander governs unless the ruler is present. | Existing six-direction costs, banked mobility and eight-position ambush follow the user's accepted remaster choices. Combat/capture/treasury-spoils formulas are not proven DOS formulas. |
| Province orders [P01/P02/P06/P08–P12/P16/P17/P22–P24/P28/P29] | Multiple-general Move, abandonment and outgoing governor choice; four recruitment methods with foreign subordinate targets and mounted journeys; remote ruler appointments; adviser-only demotion; dismissed officers hidden nearby; home diplomatic gates; refused gifts; directional daughter records; Spy Verify/Withdraw; base-zero gold reward rejection; acting merchant generals and source integer rounding; permanent constructed forts. | Method chances/costs, recall travel, fort cost/legality and exact original gift consequences remain approximations. Forts currently cost a stated **100 gold** and require an unused plain/hill hex. |
| Geography [H01/H02] | #17 is Xu county/許縣 before 221 and Xuchang thereafter. #25 becomes Jianye in 212. #33 is Chengdu, the inherited Yi ruler headquarters; #32 is represented by Jianwei at modern Leshan. “Headquarters” replaces ambiguous capital wording. | Representative seats are an accepted remaster abstraction. No owner, resource, original sector coordinate or adjacency was swapped. The remaining seat inventory is not a historical certification of all 41 assignments. |
| History mode [E04] | Historic/Fiction setup selection is saved. Fiction suppresses annual factual chronicle notices and named early-death windows; aging, health and state-eligible random stratagems remain. | Fictional affinity/stat randomization and original event eligibility rules remain untraced. |

**Validation:** 159 engine/strategy/battle/monthly/artwork/roster/province/decision/fidelity checks and 22 DOM/Canvas UI groups pass, including six-scenario simulations and the new Historic/Fiction → Exile → save/load → Move → Settle flow. Physical handset touch/audio and execution of either DOS binary were not tested.

**Full game pack:** includes the playable static game, all images and audio, scenarios and future-officer data, JavaScript dependencies/licenses, source, tests, decode/import tools, this report, Windows/macOS/Linux local-server launchers, and the exact source commit. Python is required for those launchers; Node/npm is only needed to run development checks. Open the extracted game through the local server, not directly as a disk HTML file. The pack does not redistribute the original DOS executable or unmodified commercial data/art.

**V12’s former feature backlog is reconciled in V13 above.** Exact executable rates, edition-qualified NES differences, arrival slot/month behavior, complete historical scripts and physical-handset behavior remain unverified. The accepted user overrides are preserved.

#### Supplied DOS data and v11 changelog (historical baseline)

### What the new files establish

The supplied lowercase files were read directly from their attached local paths. All three can be decoded using the layouts in the pinned Python reconstruction. Decoding is static; neither executable was run.

| File | Decoded role | Result |
| --- | --- | --- |
| `scenario.dat` | Six initial campaign blocks of `0x33AF` bytes; 255 officer slots, 41 province records and 16 ruler slots per block. | Six years: 189, 194, 201, 208, 215, 220. All 738 province serving/free/hidden chains and all 246 raw province records match the Chinese reference. Compared numeric fields of named officer records and ruler serving counts also match. |
| `taiki.dat` | Six-byte count header; 46-byte arrival records, with the officer payload beginning at record byte 3. | Declared counts 162/105/76/43/22/10, totaling 418 records including one date-`0xFF` sentinel per block. The non-name bytes of all 418 records match the Chinese reference. The file has an additional 92-byte tail containing two blank records, outside those declared blocks. Their runtime purpose has not been recovered. |
| `kaodata.dat` | 219 portrait records, 960 bytes each; three interleaved bit planes reconstruct 64 × 40 native palette pixels. | All 219 records are distinct. The reference renderer uses eight palette colours and expands a portrait to 64 × 80. Only record 29 (zero-based, Guan Yu's portrait when present) differs between the uploaded and Chinese files. |

Names are English in the supplied scenario/arrival files and encoded Chinese in the repository files. The byte differences—9,019 scenario bytes, 3,425 arrival bytes and 288 portrait bytes—do not demonstrate different starting statistics or province rosters. Native portrait indexes above 218 use the reconstruction's `Montage.dat` face assembly; that companion file was not supplied. **352 distinct officers does not mean 352 bitmap records in Kaodata.** The remaster's 352 unique illustrated portrait cells remain a separate artistic catalogue.

**Liu Bei in 189:** the uploaded English scenario independently contains Liu Bei, Guan Yu and Zhang Fei in province 4, with no initial free or hidden officers there. Both DOS data references and the remaster therefore start with **three** serving officers. His realm totals in the six supplied scenarios are **3 / 8 / 11 / 17 / 54 / 47**. **Investigation closed by the user: three is correct.** No additional officers will be inserted to reach seven.

The supplied files corroborated the original arrival/service defects. V12 repairs the catalogue, service offset and missing personality imports; unrecovered behavioral formulas remain distinct from those data fixes.

### Implemented in v11 — retained release history; see v12 reconciliation above

| Request | Current implementation | Remaining original-game uncertainty |
| --- | --- | --- |
| Terrain auto-tiling | A six-bit mask uses the exact tactical direction order. Terrain/mask variants are cached, matching neighbours suppress boundary contours, and different terrain edges draw transitions/shorelines. Original terrain cells and connections remain the rule data. | Exact original tile artwork is not being reproduced. |
| Battle captives | Recruit, Set free and Behead are separate decisions for every captured general, governor and ruler. No empty adjacent province means all defenders are captured. With one available, INT/WAR influence capture. Refused recruitment retains Free/Behead; execution removes the officer permanently. | The branch structure is supported by DOS prompts; the original numerical capture/recruitment formulas remain untraced. |
| Released ruler | A ruler with surviving territory returns there. A landless released ruler becomes a saved travelling party with Move, View, Settle and Rest; settlement requires an empty province and confirmation. | Voluntary Exile still dissolves the realm and has no “take all generals” choice. The captured-ruler continuation is not a full restoration of C01–C03. |
| Messenger travel | Diplomacy, spy missions and supply escorts have saved outward/return routes across fixed province links. A complete horse-and-rider gallop atlas animates our and AI journeys. Intercepting human rulers choose Set free, Capture or Behead; cancelled outward missions do not transfer the gift. | DOS route selection, travel timing, seizure of carried goods, interception chance and AI decision policy are not recovered. The new journey is measured in displayed route steps, not new strategic months. |
| General selection | Themed portrait cards show INT/WAR/CHA/LOY/TRAIN/MEN, highlight relevant abilities, and preserve the underlying order eligibility. A local INT-80+ adviser supplies success/failure estimates for recruitment/diplomacy/spy missions and expected domestic gains without consuming RNG. | Forecasts describe the remaster formulas; they do not establish the original adviser accuracy/dialogue algorithm. |
| China map | Cities are painted at the map's projected locations. All province labels are numbers. Mobile seal placement avoids collisions and draws a thin pointer when displaced. Ownership colour areas can be toggled and the preference is saved. Detail and battle headings include the province number. | Display colour regions are clipped Voronoi cells, not reconstructed original province boundaries. Historical naming issues H01/H02 remain. |
| GUI and rotation prompt | Visible stock selects/radios are replaced with illustrated bronze/parchment choice cards and diamond checks. The portrait-orientation screen contains an animated phone, game artwork and a numbered-map preview. | Browser-owned external file pickers remain platform controls. |
| Defeat control | After the captive decisions, a defeated human realm relinquishes control; remaining players continue. Losing the final human realm pauses with a campaign-ended report. | Human choice of successor and a dedicated unification ceremony remain absent. |

**Explicit remaster probabilities.** In this version, capture with an available empty retreat province is `clamp(90 − (INT + WAR) / 3, 10, 90)%`. Captive recruitment is `clamp(host CHA / 2 + victor trust / 3 − captive LOY / 3 + 25, 5, 95)%`. A non-allied province on a messenger route has interception risk `clamp(35 + hostility / 5 − (envoy INT + WAR) / 4, 5, 65)%`. These are implementation choices, not decoded DOS constants. Ally-owned and empty route provinces do not intercept; foreign destination provinces may intercept too. A captured AI envoy is resolved immediately by the AI's recruitment/release policy. Goods-loss and bandit events from [X05] are still absent.

The new tests cover no-escape capture, INT/WAR escape, each captive outcome, released-ruler continuation, defeat control, saved journeys, interception/cancellation, invalid route rejection, terrain masks, dense mobile seals and non-mutating adviser forecasts. The existing engine, battle, monthly, artwork, scenario, province-order and UI suites pass, including six-scenario campaign simulations. The UI suite renders Canvas artwork and exercises DOM controls at handset landscape sizes; it is not a physical-handset browser or audio test.

#### 1. Main findings

The original three critical gaps are repaired in v12. The most substantial outstanding feature gaps now concern delegation, allied support, items, custom rulers and state-changing historical scripts. Original probabilistic/economic/AI behavior is still insufficiently traced.

| Priority / status | Finding | Evidence |
| --- | --- | --- |
| Fixed v12 | Continuing exile, both confirmations and travelling-party orders. | Requested flow; DOS X01/X02; engine/UI/checkpoint tests. |
| Fixed v12 data coverage | All 412 non-sentinel future records represented. | Native file comparison; every scenario's arrival/save test. Exact month/slot reuse is still unverified. |
| Fixed v12 branch | Warfare suspends after day 30 and resumes next month. | DOS X06 continuation prompt; saved state and strategic rollover tests. |
| Fixed v12 | Service values and personality imports. | Byte-based import at file base 0x16; zero service discrepancies across 905 serving records. |
| P1 open | Full delegation, support consent, items/custom rulers, supply theft, threat followers and historical enactments. | Missing branches recorded individually below. |
| Unverified | Exact original formula/rates and platform-specific limits. | Python is incomplete; executables were examined statically, not run. |
| Corrected v12 labels | Xu/Xuchang, Moling/Jianye, representative Yi seats and headquarters wording. | Primary historical references and accepted representative-seat design. |
| Closed roster verification | Liu Bei starts 189 with three officers. | Liu Bei, Guan Yu and Zhang Fei; verified from the supplied native scenario. |

**Scope of “original.”** The repository targets a Chinese DOS release. The user's uploaded `main.exe` contains English menus/messages. The available KOEI instruction booklet is for NES. These are distinct reference inputs; NES-only evidence is explicitly marked and must not be silently treated as proof of an identical DOS rule.

I accessed both executables: the user's `main.exe` is a **256,625-byte DOS MZ executable**; the repository's `IDA/MAIN.EXE` is **293,228 bytes**. Their checksums differ. The uploaded file contains a packing-error message and has a different executable layout, so size alone cannot establish a gameplay-version difference. English versus Chinese message text does establish a localization difference. Headers, checksums, readable embedded prompts, companion data, and decoded Chinese glyphs were examined. No DOS emulator is installed here, so this audit does **not** claim an execution trace of either original binary.

References **X01–X12** below are readable strings at hexadecimal file offsets in the uploaded executable, listed in section 11. They independently support original menu branches and outcomes; a prompt alone does not recover eligibility checks, probabilities, costs, or prove every runtime path.

The Python repository is an incomplete reconstruction. Its README says battle logic and inter-ruler AI were not implemented. Some domestic functions also contain TODOs or apparent mistakes. A difference from that Python code is evidence to investigate, not automatically an original-game bug in the remaster.

#### 2. Starting scenarios and officer data

### D01 — Closed: Liu Bei starts 189 with three generals

The current 189 game starts Liu Bei in sector 4 with:

1. Liu Bei
2. Guan Yu
3. Zhang Fei

The original serving-officer chains in both the Chinese reference `Scenario.dat` and the newly uploaded English `scenario.dat` contain those three entries. Sector 4 has no initial hidden or free officers in that file. Comparing every province's serving, free, and hidden lists across all six scenarios found **zero list differences**.

The supplied English scenario and Chinese reference agree on the trio. The user has confirmed that three, rather than seven, is the correct 189 start and closed the investigation. `tools/verify-original.py` checks the supplied serving chain directly. No further edition reconciliation or roster enlargement is required.

### Verified initial serving counts

These counts include the ruler and cover the ruler's entire realm. A dash means that ruler is absent. These are matching DOS-file/remaster counts, not a claim that every original platform has these values.

| Ruler | 189 | 194 | 201 | 208 | 215 | 220 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Cao Cao | 9 | 21 | 44 | 65 | 66 | — |
| Cao Pi | — | — | — | — | — | 63 |
| Dong Zhuo | 16 | — | — | — | — | — |
| Gongsun Zan | 2 | 2 | — | — | — | — |
| Han Fu | 4 | — | — | — | — | — |
| Han Xuan | — | — | — | 4 | — | — |
| Jin Xuan | — | — | — | 2 | — | — |
| Kong Rong | 3 | 2 | — | — | — | — |
| Li Jue | — | 4 | — | — | — | — |
| Liu Bei | 3 | 8 | 11 | 17 | 54 | 47 |
| Liu Biao | 11 | 12 | 17 | — | — | — |
| Liu Du | — | — | — | 3 | — | — |
| Liu Yan | 12 | — | — | — | — | — |
| Liu Yao | 4 | 4 | — | — | — | — |
| Liu Zhang | — | 13 | 14 | 17 | — | — |
| Lü Bu | — | 11 | — | — | — | — |
| Ma Teng | 3 | 13 | 14 | 15 | — | — |
| Meng Huo | — | — | — | — | 8 | 8 |
| Sun Ce | — | 10 | — | — | — | — |
| Sun Jian | 7 | — | — | — | — | — |
| Sun Quan | — | — | 34 | 39 | 39 | 38 |
| Tao Qian | 6 | — | — | — | — | — |
| Wang Lang | 2 | — | — | — | — | — |
| Yang Feng | — | 2 | — | — | — | — |
| Yuan Shao | 17 | 21 | 21 | — | — | — |
| Yuan Shu | 8 | 8 | — | — | — | — |
| Zhang Lu | — | 8 | 8 | 8 | — | — |
| Zhao Fan | — | — | — | 3 | — | — |

### D02 — Fixed v12 catalogue coverage; exact DOS month/slot behavior unverified

The 352-entry portrait catalogue is a union of identities across scenarios. It does not make those identities available in every campaign where the original arrival tables introduce them.

The pre-v12 build script imported only ten globally new identities from `Taiki.dat`. It skipped most officers who are known from a later scenario but absent from an earlier one. The old monthly engine could not create absent records. V12 imports every declared non-sentinel record and appends stable IDs for absent identities; this baseline table records the repaired omission.

| Scenario | Non-sentinel arrival records | Represented pending arrivals | Already present by matching encoded name | Unrepresented records |
| --- | ---: | ---: | ---: | ---: |
| 189 | 161 | 10 | 1 | **150** |
| 194 | 104 | 8 | 1 | **95** |
| 201 | 75 | 9 | 0 | **66** |
| 208 | 42 | 9 | 0 | **33** |
| 215 | 21 | 9 | 0 | **12** |
| 220 | 9 | 9 | 0 | 0 |

Examples of records missing before v12 were Zhao Yun/Gan Ning/Ma Chao/Zhuge Liang in 189; Sima Yi/Xu Chu/Zhuge Liang/Sun Quan in 194; Huang Zhong/Fa Zheng in 201; and Deng Ai/Cao Rui/Gongsun Yuan in 215.

The table counts records, not necessarily unique people: duplicate-name identities and replacement records need individual handling. Each scenario block also ends with a `0xFF` date record, apparently a sentinel; those six records are excluded pending verification. The precise DOS arrival year/month conversion also needs a binary trace. Neither uncertainty changes the demonstrated absence of the listed officers.

**Implementation location:** `build-roster.py`, `config/scenarios.json`, and `monthly-events.mjs::lifecycle`. V12 now uses `future-officers.mjs`, `campaign-fidelity.mjs::processArrivals` and `tools/build-fidelity-data.py`. Original initial IDs remain stable; appended IDs replace unsafe slot reuse. No declared non-sentinel record is unrepresented.

### D03 — Fixed v12: native service years imported from the correct offset

`Officer.py::FromBuffer` reads byte `0x0C`; `Command8.py` displays that field in Summary 2. The old import initialized incorrect dates. V12 initializes and displays the native values; the discrepancy evidence below describes the repaired defect.

For example, Liu Bei, Guan Yu, and Zhang Fei have a source value of **1** in 189; the remaster initializes each to **10** service years.

The cause is identifiable in `tools/build-service-records.py`: it starts officer records at file offset **`0x20`**, but `MainMenu.SelectScenario` loads scenario bytes at buffer `0x42` and officers begin at buffer `0x58`. The correct file offset is **`0x16`**. The ten-byte displacement makes the script read the officer's **training byte `0x16`** as service byte `0x0C`. All pre-v12 serving service values matched that incorrect extraction. The corrected import has zero mismatches against all 905 native serving bytes. This is a confirmed import defect, independent of any uncertain loyalty formula.

| Scenario | Serving records with a different service value |
| --- | ---: |
| 189 | 107 |
| 194 | 139 |
| 201 | 163 |
| 208 | 173 |
| 215 | 167 |
| 220 | 156 |
| **Total scenario records** | **905** |

This total counts scenario instances, not 905 distinct officers. Service years should be corrected together with recruitment, transfers between rulers, and loyalty rules.

### D04 — Personality imports fixed; exact behavior still unverified

The remaster retains compatibility, virtue, and ambition. V12 also imports DOS benevolence at `0x08` and the blood word at `0x10`; earlier versions omitted them. For example, Sun Jian and Sun Ce share blood mask `0x0004`; Yuan Shao and Yuan Tan share `0x0008`.

Consequently, relationship-dependent behavior cannot be faithful merely by matching visible INT/WAR/CHA. V12 departure code protects shared blood-mask bits and ten years of service. This implements a family/service exception, with a remaster threshold rather than a recovered DOS threshold. NES comparison: relatives and long-serving officers are exempt [M25]. Exact DOS exceptions remain to be traced.

### D05 — One raw attribute is deliberately normalized

Guo Huai's 194 loyalty byte is **215** in the supplied file; the remaster clamps it to **100** and preserves the anomalous source value separately. This is a documented data normalization, not an unexplained loss of an officer.

The compared initial INT, WAR, CHA, virtue, ambition, owner, compatibility, soldiers, weapons, training, and birth fields otherwise match for native scenario records. This check does not authenticate every manually transcribed officer name or generated portrait.

#### 3. Exile, succession, and campaign completion

| ID | Original reference | Current implementation and consequence | Evidence / status |
| --- | --- | --- | --- |
| C01 | User: ruler ready → confirm exile → choose whether to take all generals; matching DOS prompts [X01]. | V12: both Yes/No confirmations; ready ruler required. A local party carries existing armies and home gold/food, relinquishes provinces and keeps human control. Ongoing wars block exile. | Fixed requested branch; original carriage/follower formulas remain untraced. |
| C02 | User and DOS menu [X02]: Move, View, Settle, Rest. | V12 voluntary and released-ruler exile share saved Move, View, Settle and Rest orders; they no longer terminate play simply because land is lost. | Fixed continuation; checkpoint and settlement tests. |
| C03 | User and DOS prompts [X02]: Move → destination; Settle → confirmation; View → province, generals, general list. | V12: connected destination selection, empty-province settlement confirmation, three View choices and local party resource state. DOS Other menu and rebel encounters remain absent. | Requested branches fixed; additional DOS roaming behavior remains open. |
| C04 | Successor-selection prompt [X03]; player choice [M14]. | V12: human realms choose a saved eligible successor. AI chooses an heir automatically. No original loyalty adjustment reconstructed. | Choice implemented; eligibility/loyalty details remain unverified. |
| C05 | Defeat without successor [M10/M14]. | V12: death no longer refuses a ruler without an heir; an extinct human realm relinquishes control and final-human defeat pauses the campaign. | Immortality defect fixed; original ceremonial behavior unverified. |
| C06 | DOS release/behead and exile messages [X04]; release may lead to exile [M24]. | V11 provides captive recruitment/release/execution. Released rulers return to surviving territory or continue as a landless roaming party. The original release resources/followers and exact rates remain unverified. | DOS prompts plus NES sequence description; `strategy.mjs::resolveBattle`. |
| C07 | DOS unification message [X03]; campaign objective [M10]. | V12: all 41 provinces under one ruler triggers a unification report. Final-human defeat has an ended-campaign report. | Victory/defeat state implemented; dedicated ceremony artwork absent. |

The DOS evidence independently supports exile as a continuing state: `Documents/ruler.txt` documents the wandering field at ruler offset `0x22`; `Ruler.py` permits a ruler without a home province. Decoded Chinese text at `DSBUF.DAT:0x853B` and `0x8548` contains the abandonment and follower confirmations. The uploaded English executable additionally contains the exact party question, roaming orders, settlement failure/success messages, and the three View choices [X01/X02]. Python command 17 is absent. The English menu also includes **Other** as a fifth choice; its settings branches need inspection. Exile-party Gold/Food/Generals labels and rebel encounters exist in the same message area, suggesting more roaming behavior than the minimum requested four orders; their resource and encounter rules remain untraced.

V12 Exile explicitly checks the ruler’s readiness. The ordinary home-governor invariant is also retained.

#### 4. Province orders

“Source comparison” below means the reconstructed DOS command, with the limitations noted in section 1.

| ID | Command / reference | Current difference | Status and location |
| --- | --- | --- | --- |
| P01 | Move: source supports multiple generals and abandonment confirmation. | V12 staged Move selects multiple generals; moving everyone requires abandonment confirmation. | Fixed branch; `fidelity-orders.moveParty`, themed multi-select UI. |
| P02 | Move: source asks for governor selection after governor/ruler relocation. | V12 asks who remains as governor when the governor departs. Incoming ruler governs the destination. | Fixed branch; province membership/governor tests. |
| P03 | Send: DOS escort/resource and stolen-goods messages [X05]. | V13 reserves cargo at departure, animates a saved escort, permits bandit losses and delivers the remainder. Captured diplomatic/recruitment cargo is seized once. Refused offers return. | Branch implemented; rates/travel are remaster rules, not recovered DOS formulas. |
| P04 | Hire/Reassign: source redistributes a provincial soldier pool. | V13 Reassign retains personal training. Increased hired allocations use a weighted provincial average including untrained hires; pool/disband confirmation persists. | Reassignment approximation removed; exact original training treatment still needs tracing. |
| P05 | Train: source uses integer square root in its denominator. | V12 uses the integer square-root denominator: WAR 90 / 10,000 men gives 18. Empty armies are still skipped. | Confirmed denominator defect fixed; empty-army training treatment remains a minor source difference. |
| P06 | Recruit: source offers special attention, horse, gold, letter, and enemy-province targeting. | V12 offers Special attention, Horse, Gold and Letter, with free or hostile subordinate targets and a saved mounted-envoy journey. | Branches implemented; exact method costs/outcomes remain unverified. |
| P07 | Recruit: source includes method/personality/difficulty-dependent calculations and adviser dialogue. | V12 chances depend on invitation ability, compatibility, trust, virtue, ambition, target loyalty and difficulty; advisor forecasts use the same formula. Loyalty remains bounded 40–100. | Remaster formulas, not proof of exact DOS recruitment/dialogue. |
| P08 | Appoint: source is ruler-only and selects an owned target province. | V12 ruler-present Appoint selects any owned province, then a local governor or INT-80+ advisor. Legacy shortcut gates also require the ruler. | Fixed remote/ruler-only branches. |
| P09 | Dismiss: source distinguishes officer dismissal and adviser demotion. | V12 Dismiss offers officer dismissal and advisor-only demotion while retaining service. The sole governor cannot be dismissed. | Demotion branch implemented; sole-governor handling remains protected. |
| P10 | Dismiss: source sends dismissed officers to a neighboring hidden list. | V12 sends a dismissed subordinate to a connected neighboring hidden list. | Source-style location branch implemented; original selection probability untraced. |
| P11 | Diplom: home-only alliance, joint invasion, marriage in NES reference [M17/M18]. | V12 enforces home gates for Alliance, Joint invasion, Marriage, Cancel and Threaten. Gifts may be sent from a subordinate province. | NES-qualified gate adopted; identical DOS eligibility not established. |
| P12 | Diplom: gift-refusal messages [X09]. | V12 gifts can be refused, consuming the envoy turn without changing recipient resources. | Refusal branch restored; exact original probability/cost consequence untraced. |
| P13 | Diplom: threats permit officer release [M18]. | V13 submitting ruler joins; subordinates independently join or refuse, becoming free and disbanding troops. Empty provinces become independent. | Refusal branch implemented; probability remains custom. |
| P14 | Diplom: DOS personality fields and directional hostility. | V13 applies equal deltas to existing directional hostility without forcing values equal. Personality/strength probabilities and magnitudes remain remaster calculations. | Directionality preserved; exact DOS reactions untraced. |
| P15 | Joint invasion. | V13 human allies accept/refuse and select up to five ready adjacent commanders, food and gold; plans persist until use. AI defaults to up to two units. Refusal/noncompliance lowers trust. | Consent/resources implemented; exact original limits and compensation unverified. |
| P16 | Marriage. | V12 daughterGivenTo and daughtersReceived are directional; receiving a daughter no longer consumes the receiver’s own daughter. Old reciprocal saves migrate. | V14 imports the native availability flag and exposes daughter/marriage status. Original mode has no ages or birth schedule. V15 adds optional Expanded spouses, children, births and age-16 eligibility as remaster rules; proposal success remains an approximate formula. |
| P17 | Spy: DOS Hide/Verify/Withdraw and enemy-defection messages [X08]. | V13 retains Hide/Verify/Withdraw and adds monthly risk of abandoning covert allegiance after enemy recruitment. Withdrawal still immediately returns home. | Defection branch implemented with a remaster rate; original allegiance data and return travel remain untraced. |
| P18 | Spy outcomes. | Rival Tigers, Tiger and Wolf, Betrayal, and Forged Letter exist, but use custom probabilities and fixed loyalty/hostility changes. Successful betrayal automatically flips sides at deployment. | Approximation; original timing and checks not recovered. Three-month pact duration is retained. |
| P19 | View: source selects a scout for foreign provinces. | V13 Other provinces selects a ready scout for foreign detail. Friendly detail is direct. The scout does not spend an action. | Actor restored; action cost unresolved in Python/DOS. Map/detail shortcuts remain read-only direct views. |
| P20 | Cultivate/Flood/Give: domestic formulas. | Core integer formulas and spending ranges match the reconstructed source. Each submission selects one actor; NES supports group selection [M16]. | Mostly matching DOS reconstruction; edition-specific UI difference. |
| P21 | Reward horse/writings: source prompts do not ask for gold. | V26 Gold alone costs gold; Horse costs one horse; Writings is adviser instruction with no inventory cost. All use the governor action. | Repaired against main.exe; prior gold-charge request is superseded by the latest user fixes. `Command11` versus rewards. |
| P22 | Small gold reward: source refuses when base gain is below one. | V26 follows main.exe: zero base gain can still receive the random 0/1 bonus. | Native supersedes the Python rejection; see V26 offsets. |
| P23 | Merchant: source selects an acting officer for each trade. | V13 selects a ready actor, charges their action, and separately selects the weapons recipient. | Actor and recipient branches implemented; original costs/rounding separately qualified. |
| P24 | Merchant integer rounding. | V12 buys with floor(amount/rate)+1; maxima prevent overdraft. Selling requires at least one exchange unit, so zero-income sales are rejected. | Reconstructed rounding restored with bounded-resource safety. |
| P25 | Delegation: DOS Full/Internal/Military/Personnel plus supply/attack targets [X07]. | V13 Self/Direct is followed by four authority policies, supply destination and attack target. Ordinary resource/action rules apply; delegated provinces block manual orders until recalled. | Menu/target branches implemented; delegated policy choices are remaster heuristics. |
| P26 | Advice: source war/officer/spy suggestions and rumor topics. | V13 General/War/Officers/Spy/Visitors topics cache distinct monthly advice. Visitors stay or move one connected province. Rumors still prioritize strong free/hidden talent. | More topic/movement branches; accuracy, rumor ranking and visitor probabilities remain approximate. |
| P27 | Tax: source basic formula. | Season gate, loyalty −10, trust −5, and basic draw ranges match. The remaster adds its own famine multiplier and explicitly consumes the governor's action. | Partial match; source has an unfinished governor-action TODO. |
| P28 | Ruler-only appointments versus ready-officer gates. | V12 appointments/dismissal enforce ruler presence. Reward/tax require governor readiness; delegation consumes ruler action. | Confirmed appointment/dismiss gates fixed; complete executable gate matrix still untraced. |
| P29 | Map/fort construction: DOS builder, tile selection, legality, and fort-count prompts [X10]. | V12 Map offers builder selection and hex placement. Constructed forts persist into terrain and saves; plain/hill required, current cost 100 gold, builder action consumed. Forts attribute shows map fort count. | Construction branch implemented; cost/legality/limits are explicit remaster choices. |

**Important reconstruction caveats:** `Command4` omits some food spending/bookkeeping and appears to subtract population on disbanding. `Command5` leaves enemy recruitment and adviser outcomes unfinished. `Command11` omits some resource accounting. `Command18` contains inconsistent adviser pointers/field usage. These omissions should not be restored as features.

#### 5. Battles

| ID | Original reference | Current implementation / difference | Evidence / status |
| --- | --- | --- | --- |
| B01 | DOS next-month continuation message [X06]; thirty-day boundary [M23]. | V12 preserves unresolved battles as suspended wars after day 30, permits other campaign orders/factions, and resumes after the next monthly council. Multiple pending wars are saved. | Continuation branch fixed; original siege-supply scheduler remains unverified. |
| B02 | Defender acts first [M20]. | V40 retains attacker-first placement and starts new combat with the defender. Allied units share their side’s turn; generals may act in any order. Earlier mid-combat saves retain their current cycle. | NES manual-based correction; DOS first-turn branch remains untraced. `spawnBattle/act('deploy')/advance`. |
| B03 | Attacker five; defender ten [M20]. | Up to ten active units on either side. Defense automatically selects the strongest ten troop-bearing officers with leader/governor preference, rather than player selection. | NES comparison; DOS limits still unverified. |
| B04 | Training-dependent mobility, maximum six [M20/M22]. | Every unit starts at two. Points persist and can accumulate to 1,000; training does not increase movement allowance. | Current rule is distinct. Earlier conversation may have authorized this model; preserve pending discussion. |
| B05 | Water costs five [M20]. | Water costs three, like forest/hill/fort/capital; plains cost two. Mountains are impassable. | NES comparison. Other terrain values require edition-specific verification. |
| B06 | Enemy proximity restricts movement [M21]. | V12 movement may enter a hostile-adjacent hex, then stops; paths cannot continue through enemy control. | Zone-of-control branch implemented; exact DOS mask untraced. |
| B07 | Forests conceal enemy troops [M21/M22]. | V12 jungle enemies are concealed in the battlefield and View until an opposing unit approaches. AI target lists use the same visibility rule. | Concealment implemented; scouting/reveal persistence and original distance unverified. |
| B08 | Commander loss ends battle [M20]. | V12 any designated army commander losing fighting status ends the battle, even when not the ruler. | Commander-defeat branch implemented. |
| B09 | Food exhaustion decides victory [M24], now confirmed in the supplied DOS binary at unpacked `0x22dbc`/`0x22dd0`. | Either battle-side food store reaching zero produces immediate defeat, without waiting for morale loss. | V23 adds exact byte checks; invasion carries zero through available province stock, capped at 3,000,000. Supply-use rates remain remaster constants. |
| B10 | Capture or elimination [M21/M24]. | Normal attacks mark every routed target captured, including morale routing. No elimination/death outcome from normal combat. | Current engine; exact DOS casualty distribution unverified. |
| B11 | Only commander bribes [M22]. | V13 only the designated army commander can offer bribes, spending the field purse. | NES branch adopted; exact DOS probability untraced. |
| B12 | Defender's local reserves [M22]. | V12 defender reserves in the attacked province can join as well as ready adjacent friendly reserves. | Local reserve omission repaired; limits/entry rules remain edition-qualified. |
| B13 | Defender requests allied assistance [M23]. | V13 either side Reinforce → Ask ally sends a saved mounted request; human ally selects/refuses ready adjacent formations and provisions. AI also requests/responds. Entry follows the contributing province’s direction. | Allied support branch implemented; exact DOS timing/control unverified. |
| B14 | DOS invasion carried gold/food [X05]. | V13 retains separate field purses, adds pledged allied food/gold and proportionate return of unused contributed stores. View/Bribe consume field gold. | Purse/contribution branches functional; original spoils/contribution accounting remains unverified. |
| B15 | Alliance attack automatically breaks alliance [M15/M17]. | Engine requires cancellation before an allied attack. V12 invasion shortcut invokes the same gated cancellation command and shared plan cleanup as Diplom. | Shortcut inconsistency fixed; NES automatic-break behavior still differs. |
| B16 | Own adjacent provinces; flight capture risk [M22]. | V13 preserves requested attack-origin/empty-neighbor destinations. A noncommander in adjacent hostile control risks INT/WAR-dependent capture. Commander flight confirms whole-army defeat. | Requested destinations preserved; original capture rate untraced. |
| B17 | Single opening duel [M21]. | V13 permits one day-one duel in the battle, requiring WAR 80+. Refusal still removes 5% of the opposing army. | Single-duel branch adopted; eligibility/refusal constants remain remaster choices. |
| B18 | DOS duel WAR increase [X12]; stronger opponent [M21]. | V13 a winning duellist gains one WAR only when defeating a stronger opponent, bounded at 100. Ordinary battlefield victories no longer grant the V12 blanket increase. | Trigger narrowed to a duel; exact DOS gain probability untraced. |
| B19 | DOS recruit/release/behead choices [X04]. | V11 queues Recruit/Set free/Behead for each captive and saves pending decisions. No empty adjacent province captures all defenders; otherwise INT/WAR affect capture. Original rates are not recovered. | Implemented branch structure; rates and spoils/follower details remain approximations. |
| B20 | Winning commander governs [M24]. | V12 victorious attacking commander governs unless the ruler is present. | Governor assignment branch fixed. |
| B21 | Tactical probabilities and supply formulas. | Damage, counterattacks, morale, daily rice, injuries, fire spread, bribes, and breakthrough probabilities are custom. Weather is independently rerolled each day with 43/27/15/15% probabilities. | Unverified approximation; Python `Command3` is a display prototype, not a combat reference. |
| B22 | Original approach sectors / deployment zones. | Correct province direction, but diagonal entry regions are broad L-shaped border zones and defenders may use all passable ground. Exact DOS allowed-cell masks were not recovered. | Direction verified; precise deployment eligibility remains unresolved. |
| B23 | DOS plunder, named treasure and recipient [X11]. | V13 Protect/Plunder and castle discovery/recipient choices persist after captive decisions. Sixteen named rewards have stored recipients and ability/horse/healing/seal effects. | Branch implemented; INT/WAR/CHA values supported by static table inference. Discovery, initial flags, transfers and seal rules still approximate or missing. |

### Requested tactical changes to preserve for discussion

The original manual describes charge breakthrough [M21], and the requested charge occupation/breakthrough behavior is present. V14 uses the original War-based breakthrough chance recovered from main.exe; the remaster’s three damage exchanges remain an approximation.

The earlier request restricts retreat destinations; it should not be silently replaced with the broader NES rule. Friendly View is free and hostile View costs 100 gold as requested; the NES booklet says 10 gold per view [M22], so that price is edition-dependent or an intentional override.

Eight-position grid ambush adjacency, the current mobility model, full army artwork, and the 75%/25% battle layout should be reviewed against previously accepted requirements before altering them.

#### 6. Calendar, events, economy, and AI

| ID | Original reference / evidence | Current difference |
| --- | --- | --- |
| E01 | Annual population growth; seasonal stipends [M11/M25]. | Population grows every month. Officers cost 3 gold/month plus troops/200; troops consume rice/3 monthly. These are configured remaster costs. |
| E02 | January/July income; source event categories. | Income uses simple population/loyalty/land factors, plus remaster famine reductions. Gold omits land, and harvest omits flood protection and popular loyalty. These formulas were not recovered from DOS. |
| E03 | Loyalty depends on trust/affinity [M25]. | Trust/affinity thresholds remain remaster constants. V12 adds shared blood-mask and ten-year service protection to low-loyalty departures. |
| E04 | Historical/fictional option in DOS `MainMenu.SelectHistory`. | V12 Historic/Fiction setup choice is saved. Fiction suppresses factual annual chronicle notices and named early-death windows; age/health and state-based stratagem eligibility remain. Original affinity/stat changes are not reconstructed. |
| E05 | Age/death data and historic/fictional behavior. | V13 serving/free/hidden officers share January age/named-window checks; future identities and prisoners are protected. Only nine named early-death windows are reconstructed. Complete native lifespans remain unverified. |
| E06 | Disaster categories [M25]. | V13 natural disasters also draw in unowned provinces. Owned-only political uprisings/rebellions retain governor eligibility. Regional filters and seasonal spread remain remaster constants; V30 replaces direct locust/epidemic/flood/typhoon and popular-uprising losses with recovered supplied-executable branches. |
| E07 | User's requested omens, stratagems, medical book. | Comet death chance is 45% next month; medical-book chance 7% monthly; tiger/wolf changes hostility; chain plot reduces all Dong Zhuo subordinates' loyalty by 20. These are implementations of the requested themes, not verified original event scripts. |
| E08 | Historical events with current-state conditions. | V13 Historic mode adds a Tao Qian → Liu Bei province/general bequest requiring both surviving realms and no Tao siege. It is skipped in Fiction and cannot repeat. Other annual notices remain factual chronicle text. Complete original state-changing scripts are not reconstructed. |
| E09 | Enemy AI: incomplete in Python reference. | V13 AI dispatches real alliance/gift/marriage/threat/joint proposals, recruitment and infiltration/rival/wolf/betrayal/forged-letter missions; tactics/priority/eligibility use heuristic personality and global intelligence/aggression. Original DOS AI is untraced. |
| E10 | Merchant/travelling advisers. | V13 special visitors remain or walk one fixed neighbor each month. Initial locations, monthly merchant 80% and bounded rice-price walk remain remaster choices. Original probabilities unverified. |
| E11 | Monthly officer arrival/recovery. | V12 schedules every declared non-sentinel Taiki record and preserves coming-of-age/recovery/Hua Tuo healing. Exact DOS arrival month/slot semantics remain unverified. |
| E12 | Province turn scheduling [M13]. | V13 Province Rest marks that province finished and selects the next directly ruled province. Delegated provinces cannot receive manual orders. Separate End turn runs delegation and completes the faction. Province order and cross-province browsing remain remaster choices. |

The spring/summer/autumn/winter grouping of January–March / April–June / July–September / October–December is consistent with the reconstructed DOS display convention. It is not flagged as a discrepancy merely because modern seasonal calendars differ.

#### 7. Province capitals and historical labels

Changing numbered regional sectors into historically named seats is acceptable under the user's rule. We should retain the original connectivity even when the drawn locations are changed.

### H01 — “Province,” “seat,” and “capital” are conflated

The original DOS parser names sectors by region and number. The remaster supplies a representative `seat`, assigns a modern longitude/latitude, and labels the ruler’s current home sector as headquarters in v12.

Many `seat` labels are actually commandery or regional names: Hedong, Longxi, Runan, Changsha, Jiangxia, Wuling, Kuaiji, Yuzhang, Hanzhong, Ba, Jianwei, Yuexi, Nanhai, Cangwu, Yulin, and Jiaozhi. They are not automatically the name of the commandery's administrative city. This is a terminology/mapping issue, not proof that every listed location is invalid.

The 41 sectors do not correspond one-to-one to 41 historical provinces or uniformly sized commanderies. A historical label should therefore specify what it represents, with a scenario-appropriate town when it is presented as a capital.

### H02 — Confirmed date-sensitive naming discrepancies

| Sector | Current behavior | Historical comparison | Status |
| --- | --- | --- | --- |
| 17 | V12 Xu county / 許縣 before 221; Xuchang / 許昌 from 221. | Xu county / 許縣 was renamed Xuchang under Cao Pi in 221, recorded in `Sanguozhi`, Wei book 2 [H-WEI]. | Fixed label; location unchanged. |
| 25 | V12 Moling becomes Jianye in **212**. | Wu book 2 records the move to Moling in Jian'an 16, then renaming in the following year, **212** [H-WU]. | One-year-early transition corrected. |
| 33 | V12 Chengdu; #32 represented by Jianwei at modern Leshan. Inherited Yi headquarters remains in sector 33. | Liu Zhang's surrender and Liu Bei's Yi base concern Chengdu [H-SHU]. | Representative-seat concern addressed; DOS graph/ownership/resources retained. It remains an abstraction. |
| All | Star follows ruler movement; “capital” means `ruler.home`. | A mobile ruler headquarters and the Han imperial capital are different concepts. | Accepted game abstraction if labelled clearly. No imperial-court-location system is implemented. |

V12 revises representative seats and uses “ruler’s headquarters” wording. The verified original ownership/resource/adjacency data remains unchanged.

### Current complete sector-to-seat mapping

This is an inventory, **not a historical certification of all 41 choices**. “Source region” follows the DOS region index; the remaster additionally retimes some regional names.

| Sector | Source region | Current representative seat |
| ---: | --- | --- |
| 1 | You | Xiangping 襄平 |
| 2 | You | Yuyang 漁陽 |
| 3 | You | Zhuo 涿 |
| 4 | Bing | Jinyang 晉陽 |
| 5 | Bing | Shangdang 上黨 |
| 6 | Ji | Ye 鄴 |
| 7 | Ji | Anping 安平 |
| 8 | Qing | Linzi 臨淄 |
| 9 | Yan | Chenliu 陳留 |
| 10 | Si | Luoyang 洛陽 |
| 11 | Si | Hedong 河東 |
| 12 | Yong | Chang'an 長安; shown under Sili before 213 |
| 13 | Yong | Longxi 隴西; shown under Liang before 213 |
| 14 | Liang | Jincheng 金城 |
| 15 | Liang | Wuwei 武威 |
| 16 | Xu | Xiapi 下邳 |
| 17 | Yu | Xu county 許縣 before 221; Xuchang 許昌 thereafter |
| 18 | Yu | Runan 汝南 |
| 19 | Jing | Wan 宛 |
| 20 | Jing | Xiangyang 襄陽 |
| 21 | Jing | Changsha 長沙 |
| 22 | Jing | Jiangxia 江夏 |
| 23 | Jing | Wuling 武陵 |
| 24 | Yang | Wu 吳 |
| 25 | Yang | Moling 秣陵; Jianye 建業 from 212 |
| 26 | Yang | Kuaiji 會稽 |
| 27 | Yang | Yuzhang 豫章 |
| 28 | Yang | Shouchun 壽春 |
| 29 | Yi | Hanzhong 漢中 |
| 30 | Yi | Zitong 梓潼 |
| 31 | Yi | Ba 巴 |
| 32 | Yi | Jianwei 犍為 (modern Leshan representative location) |
| 33 | Yi | Chengdu 成都 |
| 34 | Yi | Yuexi 越巂 |
| 35 | Yi | Dianchi 滇池 |
| 36 | Yi | Yongchang 永昌 |
| 37 | Jiao | Nanhai 南海 |
| 38 | Jiao | Cangwu 蒼梧 |
| 39 | Jiao | Hepu 合浦 |
| 40 | Jiao | Yulin 鬱林 |
| 41 | Jiao | Jiaozhi 交趾 |

Earlier Jiao-sector labels are displayed as “Jiaozhi circuit” before 203. Boundary/name dates beyond the specific findings above still require a full historical geography review. Capital art uses eight regional designs across 41 sectors; it is stylized rather than reconstructed architecture.

#### 8. Accepted redesigns and verified matches

These should not be treated as bugs merely because their appearance differs from DOS:

- Named historical seats, modern map artwork, unique illustrated portraits, army formations and animation, event images, and aspect-ratio-preserving scaling.
- Strategic 40%/60% panes, revised turn/province/order panels, battle 75%/25% panes, and mobile controls.
- Menu-based Save/Chronicle/Exit, JSON saves and checkpoints, accessible HTML controls, and HUD testing tools.
- The requested expanded event themes and weather illustrations.
- Previously requested charge and retreat behavior, subject to discussing the unverified probabilities and other combat rules.

Verified against the supplied DOS data:

| Area | Result |
| --- | --- |
| Six starting years | 189, 194, 201, 208, 215, 220. The source initialization advances its stored previous year to January; the remaster's January start is consistent. |
| Province officer lists | All 738 serving/free/hidden lists match, including list order. |
| Province resources and placement fields | Compared initial resources, population, owner, region, sector coordinates match across all six scenarios. |
| Ruler leader/home/adviser/trust | All compared starting links and trust values match. |
| Starting diplomacy | All compared alliance masks and directional hostility values match. |
| Province adjacency | All 41 neighbor sets match `Helper.GetNeighbor`: **93 undirected connections**. |
| Battlefield terrain | All **6,396 cells** match the first 41 × 156 bytes of `Hexdata.dat` exactly. |
| Basic cultivation/dikes/relief | Core reconstructed integer formulas and spending ranges retained. |
| Army limits | 10,000 soldiers and weapons per officer retained. |
| Tax | Basic source draw ranges and July–September restriction retained, with noted remaster additions. |
| Advice/healing eligibility | Local adviser and visiting Hua Tuo requirements exist; source-style topic/accuracy fidelity is incomplete. |

Unique generated portraits are verified as a catalogue feature, not proof of historically accurate faces or complete campaign availability. The identity transcription, including namesakes, deserves a separate visual/text audit against the encoded name glyphs.

#### 9. Additional unresolved fidelity areas

| Area | Current limitation / question to settle |
| --- | --- |
| New ruler creation | DOS `MainMenu.NewRuler` includes custom ruler/follower creation. V13 creates one custom ruler and follower in an empty province with saved identities; birthday/base-stat allocator/portrait customization remain simplified. |
| Playable factions | Original scenario-specific selection limits/custom-ruler slot differ from allowing every active remaster ruler. Decide which original edition/menu restrictions to preserve. |
| Historical versus fictional mode | V12 switch exists; precise DOS affinity/stat/lifespan/event behavior is not yet reproduced. |
| Illness and action legality | Current engine blocks all ready-officer actions while sick/injured. `Officer.CanAction` in Python explicitly leaves illness legality unresolved. |
| Special items | Original documentation records weapon/horse/book status bytes and changes such as Qinglong blade/Red Hare. V13 stores sixteen named rewards, applies ability/mount/medical/seal effects and recipient decisions. Exact discovery/transfer/initial-status behavior still needs DOS verification. |
| Messenger capture | Saved journeys and Set free/Capture/Behead decisions exist since v11. V13 adds reserved goods, bandits and seizure; original travel/interception/loss timing and rates remain unverified. |
| Advice accuracy | Current INT-based roll meets the user's intent conceptually. Python's pointer and field inconsistencies prevent treating its exact roll as authoritative. |
| Officer loyalty/recruitment | Native benevolence/blood are imported in v12; reconstructed probability helpers remain incomplete. Avoid matching an apparent Python bug. |
| Weather/fire | Four requested states and rain extinguishing are implemented. Exact original transition, ignition, spread, castle-supply destruction, and damage formulas remain unverified. |
| Concurrent/prolonged battles | V12 has strategic continuation, locked forces and saved concurrent suspended wars. Exact original reinforcement/supply scheduling remains unverified. |
| Original binary runtime | Need a DOS execution/disassembly trace for edition-specific limits, RNG, exile party resources, settlement legality, and arrival slot reuse. |
| Device behavior | Current audit is code/data focused; it does not establish real handset touch, layout, or audio fidelity. |

#### 10. Suggested discussion order

1. **Use the supplied English main.exe as the authoritative rules reference.** Liu Bei 189 is closed at three. Keep accepted historical/UI changes separate from rules fidelity.
2. **Restore campaign continuity:** exile party and commands, successor decisions, ruler release, defeat, and unification.
3. **Repair the officer lifecycle:** full Taiki arrivals, service years, blood relationships, and active-slot reuse.
4. **Restore extended warfare and settlements:** monthly continuation, defender/allied reserves, army purses, captured generals, and commander defeat.
5. **Complete original command branches and gates:** recruitment methods, remote ruler appointments, delegation policies, scout/merchant actors, spies, and diplomacy.
6. **Tune probabilities and economics only after evidence is recovered.** Apply date-aware geography labels and perform a full seat-name review without changing the verified original graph.

V12/V13 complete the confirmed continuity/data and the specified command branches. The remaining-fidelity inventory in the V13 reconciliation is the current discussion checklist; do not interpret prior baseline wording as a new omission.

#### 11. Evidence and reproducibility

### Primary inputs

- Current remaster checkout: `/workspace/sites/rtk2-remastered`, pinned revision above. Module names refer to its `dist` directory unless stated otherwise. Unchanged findings retain the v10 baseline; changed rows explicitly state v12/v13, with v11 release history labelled separately. Key inspected files: [engine](sandbox:/workspace/sites/rtk2-remastered/mjs/engine.mjs), [province rules](sandbox:/workspace/sites/rtk2-remastered/mjs/province-rules.mjs), [province UI](sandbox:/workspace/sites/rtk2-remastered/mjs/province-ui.mjs), [battle](sandbox:/workspace/sites/rtk2-remastered/mjs/battle.mjs), [strategy](sandbox:/workspace/sites/rtk2-remastered/mjs/strategy.mjs), [monthly events](sandbox:/workspace/sites/rtk2-remastered/mjs/monthly-events.mjs), [geography](sandbox:/workspace/sites/rtk2-remastered/mjs/geography.mjs), and [service-record builder](sandbox:/workspace/sites/rtk2-remastered/tools/build-service-records.py). The earlier [roster-building script](sandbox:/workspace/scratch/7b6523318ea3/build-roster.py) is in the local build workspace rather than the committed source; its output was checked against the committed scenarios and catalogue.
- Complete future/native import builder: `tools/build-fidelity-data.py` (requires the user-supplied files and pinned Chinese reference locally; source files are not bundled). V12/V13 tests include every arrival record, stable IDs, no resurrection, exile/save/settlement, successor choice, 30-day suspension/resumption, purses, commander/food defeat, recruitment methods, merchant rounding, forts, and historical labels. V13 adds `completion-tests.mjs` and themed custom/allied/treasure interface flows.
- New reproducible decoder: [decode-reference.py](sandbox:/workspace/sites/rtk2-remastered/tools/decode-reference.py), supporting `--chinese-reference` and optional native-pixel `--portrait-sheet`.
- [JuQiang/Rotk2_Python](https://github.com/JuQiang/Rotk2_Python), pinned revision above.
- [Reference source files](https://github.com/JuQiang/Rotk2_Python/tree/99bdf5a1516e5b7d9ef8def4c935a11319e88bd9/Src): `MainMenu.py`, `Data.py`, `Officer.py`, `Province.py`, `Ruler.py`, `Helper.py`, commands 1–5, 8–16, 18–19.
- User-uploaded English `main.exe`, 256,625 bytes, inspected statically; checksum and embedded-text offsets below. The newly supplied `scenario.dat`, `taiki.dat` and `kaodata.dat` were decoded and compared separately, as described in the update.
- [Reference binary/data](https://github.com/JuQiang/Rotk2_Python/tree/99bdf5a1516e5b7d9ef8def4c935a11319e88bd9/Resources) and [IDA executable](https://github.com/JuQiang/Rotk2_Python/tree/99bdf5a1516e5b7d9ef8def4c935a11319e88bd9/IDA).
- [Reverse-engineering notes](https://github.com/JuQiang/Rotk2_Python/tree/99bdf5a1516e5b7d9ef8def4c935a11319e88bd9/Documents), especially `ruler.txt`, `officer.txt`, `findings.txt`.
- [KOEI NES instruction booklet](https://www.digitpress.com/library/manuals/nes/Romance%20of%20the%20Three%20Kingdoms%20II.pdf). References M10–M25 mean **PDF page numbers**, not inferred printed numbers. Page images were checked against the PDF; tactical pages 22/23 were inspected visually.
- H-WEI: [Sanguozhi, Wei book 2, Wendi ji](https://ctext.org/text.pl?if=gb&node=602006), Xuchang renaming.
- H-WU: [Sanguozhi, Wu book 2, Wuzhu zhuan](https://ctext.org/text.pl?if=gb&node=603922&show=parallel), Moling/Jianye transition.
- H-SHU: [Sanguozhi, Shu book 2, Xianzhu zhuan](https://ctext.org/text.pl?if=gb&node=603400), Chengdu.
- Historical text pages were available through indexed primary-text passages; direct page fetches returned 403. These narrow historical findings should be rechecked against a readable edition during the geography pass.
- User's latest exile specification and earlier accepted remaster requirements.

### Binary checksums

| File | SHA-256 |
| --- | --- |
| User's English `main.exe` | `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8` |
| Repository `IDA/MAIN.EXE` | `1fefaf627e4342917fe845238949d8a782dd472e17308b573e47453d0e2ce522` |
| `Scenario.dat` | `2a32d696c013d5187bf49c0c89abe76e20e6d3f9da97d5e4c2408951b29cce7b` |
| `Taiki.dat` | `da54071d4fb26a8cc924e65b61c6e06a22054c673e4e00da2a80ef480545538d` |
| Uploaded `scenario.dat` | `ffe6ceccc35b0d72f6067385fecddd18483b60740fe8e3da521a4eb1b3af6cb1` |
| Uploaded `taiki.dat` | `5a70fbf2fa8306ceef3e121fd74aba189683fcc29d708b8dbb5de9251151dbea` |
| Uploaded `kaodata.dat` | `99fe6cdab78b8c444a224916ac5769c812db6a9f8a66aef93f205f11adbe2a5e` |
| `DSBUF.DAT` | `eb120b921466952e0a3b662afcd38f7c21db54cb3259d8376b5199ae0ca525a5` |

### Embedded English executable evidence

Offsets are absolute hexadecimal file offsets in the user's uploaded file, **not DOS memory addresses**. The excerpts can be reproduced by reading bytes or using `strings -a -t x main.exe`. Formatting-control bytes may precede or interrupt some messages. This is static message evidence, not a runtime test.

| Ref | Offset(s) | Embedded text / supported feature |
| --- | --- | --- |
| X01 | `0x38CDA`, `0x38CEA` | “Go into exile”; “Take all generals”. At `0x38CBB`, generals at war block abandonment. |
| X02 | `0x3A5CB`–`0x3A5F8`, `0x3A7D2`–`0x3A804`, `0x3A90C`–`0x3A99C` | Rest, settlement restriction/confirmation/success; View: this province, generals, list of generals; Move/View/Settle/Rest/Other roaming menu. Gold/Food/Generals labels start at `0x3A57A`; rebel encounters start at `0x3A819`. |
| X03 | `0x338B6`, `0x339D6` | “You unified China!”; successor-selection question. |
| X04 | `0x34051`, `0x3407D`, `0x340B9` | Exile message; Set free/Behead; Recruit/Set free/Behead. |
| X05 | `0x3627C`, `0x362D6`–`0x36335`, `0x36387`, `0x3642A`–`0x36474` | Abandonment; stolen goods/bandits/enemy goons; transport supervisor; invasion gold/food and one-month food requirement. |
| X06 | `0x3AF6B` | “To be continued next month...” |
| X07 | `0x38B37`–`0x38B93`, `0x38AEF`–`0x38B2C` | Four delegation policies; delegated invasion and supply destination prompts. |
| X08 | `0x378F9`, `0x37963`–`0x379D9`, `0x37A5A` | Spy withdrawal, enemy defection, verification, and Hide/Verify/Withdraw menu. |
| X09 | `0x36EA4`–`0x36ECF`, `0x36F7B`–`0x36F91` | Gift refusals; no daughters/already-married daughter restrictions. |
| X10 | `0x38A01`–`0x38AA2` | Fort position, forbidden position, count, and acting builder prompts. |
| X11 | `0x33E09`, `0x340FE`–`0x34260`, `0x34329`, `0x343FD` | Plunder; named books/weapons/mounts/medical book/seal and other rewards; recipient prompt; captured-castle find. |
| X12 | `0x3B5CC`–`0x3B5F4`, `0x34B69`, `0x34B76`, `0x34A87` | Duel WAR increase; History/Fiction setup; custom follower creation. |

These messages strengthen several findings previously supported only by reconstructed code or NES documentation. They do not resolve Liu Bei's roster, original numerical formulas, or battle unit limits.

### Comparison procedure

Each scenario is a `0x33AF`-byte block. The source loads it at buffer address `0x42`; officer addresses start at `0x58` with stride `0x2B`, province addresses at `0x2DC4` with stride `0x23`, and ruler addresses at `0x2B34` with stride `0x29`. Following each province's three linked-list pointers is necessary; filtering officer-owner bytes alone is not equivalent.

The six declared Taiki blocks contain 162/105/76/43/22/10 records. The 19,326-byte supplied file also has a 92-byte tail of two blank records, excluded from those blocks. Each record is `0x2E` bytes after the six-byte header; its officer payload starts at byte 3. Coverage was compared by encoded names, scenario membership, and pending arrival metadata, excluding date `0xFF`.

The initial v10 in-memory runtime probes reproduced exile ending the game, the 17-versus-18 training calculation, failure to conclude on capture of a non-ruler commander, and automatic defender victory after 30 completed days. Those initial probes changed no saved campaign or deployed runtime. V11/v12 change those implementations; current branch and checkpoint validations are described above.

This report covers every major current subsystem. It is not a claim to have exhaustively recovered every original executable branch or random-number formula.


#### V17 final validation

The complete release passes 203 gameplay/asset checks (`npm test`), 30 emulated DOM/native-Canvas interface groups (`npm run test:ui`), and 12 static original-binary checks. Actual Charge-button interaction verifies occupation of a zero-soldier defender’s hex and its on-field label; victory artwork renders before captive decisions. All 41 unique paintings were inspected together and the integrated battlefield/victory images inspected. Painterly geography remains approximate; the original terrain grids and exact fort/palace markers govern play. Physical handset layout, audible playback and original DOS execution remain unverified.

#### V18 final validation

The complete release passes **207 gameplay/data/artwork checks**, **31 emulated DOM/native-Canvas interface groups**, and **17 supplied-binary checks**. Governor election rejects missing/departing candidates atomically, preserves the chosen governor through battle save/load, and restores ruler governance after return. The actual War form leaves the election empty and refuses March until selection; candidate advice updates without spending RNG. Map route buttons/highlights share the native graph, including Province 9’s six connections and its single available Move destination in scenario 189. Two-messenger Rival Tigers saves enforce distinct assignments and correct destinations. Existing battle, courier, slider, victory and 41-painted-map checks still pass. Native Canvas China/battlefield art was inspected. Browser/physical handset layout, audible playback and DOS runtime execution remain unverified.

V19 verification: 211 gameplay/data/artwork checks, 33 emulated DOM/native-Canvas interface groups; the previous 17 supplied-binary checks remain applicable. Tests cover alphabetical/numeric province choices, stable monthly advice after retries/save/load, INT endpoints and rollover, legacy-save migration, malformed ledger rejection, and fort navigation. Real handset/browser layout and audible playback remain unverified.

#### V47 governor, ownership and battle-result presentation

Governor data remains the explicitly appointed officer, including ID zero. A
serving-officer fallback and full-width summary prevent a blank/clipped value;
HUD now uses the heading's reserved space. Ruler, Trust and Governor share fonts.

The original ruler colour lookup is recovered from the supplied executable.
Solid fills and borders are the averages of its original two-row patterns,
with 16 distinct ruler assignments. Number labels are white with black outlines.
Selection and headquarters use separate markers. See native-display-v47.md.

Every completed war record receives triumph artwork, both ruler names, province
number/name and the losing commander's recorded fate, for spectators and humans
in both battle-view modes. Human decisions produce a final-fate follow-up.
Review stamps survive save/load; combat and AI/training equations remain unchanged.
Earlier completed wars in saves without review stamps may be shown once.

Static executable verification and 418 gameplay checks pass. Mounted interface
checks cover all mode/outcome combinations; actual browser/handset visuals and
audible playback remain unverified.

#### V53 native battle and messenger corrections

See [v53 fixes](changes.md#record-fixes-v53), [bug-to-test ledger](bug-validation.md), [pending test designs](pending-test-case-design.md), [battle audit](changes.md#record-native-battle-audit-v53) and [messenger audit](changes.md#record-messenger-native-v53-report). These findings supersede earlier palace-holding Normal selection, cloudy-weather fire multipliers, permanent jungle sprite reveal and assertions of complete governance sound routing. Capture→ordinary-messenger release animation is a remaster extension; intercepted Let pass still delivers before returning. Map-guide generation material and its metadata-only checks were removed in v53; active province paintings and native grids remain. No AI training or profile renewal ran.

#### V54 deployment and native-conformance corrections

[V54 findings](changes.md#record-fixes-v54) supersede the earlier interpretation of native10 as an opening/keypress cue. Ordinary governance selections are silent; native10/14 are failure/success feedback in the verified contexts. Captured human rulers still get Set free/Behead after losing their last province, following the user's clarified native-conformance instruction. Simultaneous losses already summed correctly, but helper roster order did not match the original direction scan; that order is corrected and each inflicted contribution is now shown. Deployment fields are read-only and compact. A transient turn cue now precedes highlight/action instead of being queued after combat. No AI training ran.

#### V55 audio selection

Normal/Simultaneous now use the user's Pixabay sword recording; Charge uses the user's AudioMass-edited Pixabay cry once per order; courier motion uses the user's AudioMass-edited Mixkit gallop. This is an explicit user-selected departure from native sounds. Original remaster BGM and unrelated native effects are retained. See [audio rights](changes.md#record-audio-licenses-v55), [fixes](changes.md#record-fixes-v55) and [validation](verification-v55.json). No training ran.

