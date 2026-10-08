# RTK2 Remastered — differences from the original game

Initial audit: 2026-10-07 UTC; updated 2026-10-08 (Asia/Kuala_Lumpur)
Baseline audited: v10, commit `be59931216ad6a53f17b6fb7f9632aa8faab604a`
Latest implementation: v18; exact packaged source SHA is recorded in `SOURCE-COMMIT.txt` in the game pack.
Previous implementation: v17, commit `ec52ca3b55588edb401720790332fac636f32314`
Earlier implementation: v11, commit `4dde4a55523318fc085d494c0fe2da1db359b3b7`
Reference checkout: JuQiang/Rotk2_Python, commit `99bdf5a1516e5b7d9ef8def4c935a11319e88bd9`

The initial v10 audit was read-only. This completed audit incorporates the supplied DOS files and reconciles the v11/v12/v13/v14/v15/v16/v17/v18 implementations against every finding below. Confirmed branch/data defects have been repaired where specified. Outstanding features, accepted user overrides, edition-specific evidence and unrecovered original formulas remain explicit. **This is a complete differences review, not a claim that all original-game mechanics have been reconstructed.**

## V18 — governor election, province routes, messenger audit and launch visibility

| Request | Implementation / finding | Original-game evidence and limits |
|---|---|---|
| Governor when the ruler marches | War asks **Who will govern Province #N?** whenever the departing army includes the current governor. There is no preselected candidate. March requires a remaining officer; invalid choices consume no stores, action or RNG. An advisor with INT 80+ in the source province assesses each chosen candidate before confirmation: loyalty/defection/rebellion concern, CHA for rewards/recruitment, INT for development/flood control, troops and recovery/monthly-action limits. Without a qualified advisor, cards and a risk notice remain available. | The human player elects the governor; AI chooses among remaining officers by loyalty then CHA. Appointment does not itself spend the candidate’s action. Battle normalization/save/load preserves the election; when the ruler returns they resume governing. Advice is qualitative and uses remaster equations/conditions, not a recovered original defection percentage. |
| China ownership appeared to create extra neighbours | The old nearest-city Voronoi borders were illustrative and falsely implied playable adjacency. Ownership areas now have separating gaps; selecting a city highlights **only its fixed native connections**, draws their routes and supplies clickable numbered route buttons. Turning numbers off also hides route overlays. Historical city locations/names remain; terrain and ownership alone no longer define routes. | Province 9’s complete native neighbour list is **6, 7, 8, 10, 16, 17**. War in scenario 189 exposes enemy provinces **6, 7, 8, 10, 16**; Move exposes **17**, which is unoccupied. Province **18 is not connected** to 9. No movement/war rules or native links were changed to follow modern geography. The map is still an illustrated historical-seat map, not a reproduction of DOS sector boundaries. |
| Rival Tigers messenger count | **Two distinct messengers**, one per rival ruler, are correct. Prompts name the separate destinations. Save validation now enforces exactly two distinct assignments for Rival Tigers and exactly one for other courier missions. | Supplied `main.exe` static disassembly: `0x180a8` requires at least two available officers; calls at `0x17f6e` and `0x17f8b` select/store separate envoys through the same selector; `0x1803d` and `0x18086` dispatch separate journeys. The original manual also states different messengers are sent to each ruler. No Python Spy implementation exists in the inspected JuQiang checkout. Original binary supersedes it. |
| Other missions using two messengers | No other inspected province mission needs two. Alliance, Joint invasion, Marriage, Gift, Threaten, recruitment/transport escorts and single-target spy missions use one selected envoy; Cancel alliance has none. Infiltrate uses the selected infiltrator. | Joint invasion involves two realms, but that does not require two messengers from the initiating player. Allied reinforcements are a separate response. Original Rival Tigers resolves two outward legs separately; the remaster retains its combined success estimate and final effect after both destinations, so exact partial-success behaviour/equations remain a fidelity difference. |
| Launch scene blocked by menu | Keep the painting unflipped. The left-hand dark mountains carry title/seal above a compact menu. The right-hand armies, river and capital remain visible, without the former translucent/blurred menu panel. The repeated menu heading is hidden. Scenario setup retains a readable panel once New Game is selected. | Reuses `launch-v9.webp` unchanged and preserves its aspect ratio. No artwork regeneration or stretching. |

The binary verifier adds five reproducible Rival Tigers checks: **17 binary checks** in total, plus the closed three-officer Liu Bei 189 scenario check. These are static checks, not DOS execution. Source: supplied English `main.exe`; the matching published original manual (Spy / Rival Tigers) is available at https://www.digitpress.com/library/manuals/nes/Romance%20of%20the%20Three%20Kingdoms%20II.pdf .

## V17 — army equipment, faster music, charge occupation, victory artwork and painted battlefields

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

## V16 — captive sequence, availability, typography, map controls and terrain blending (historical; terrain rendering superseded by V17)

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

## V15 — clean terrain, provisions, triumph, advisor forecasts and families

The supplied English **main.exe still supersedes JuQiang wherever they disagree**. V15 adds the following requested changes; the V14 and earlier sections below remain dated implementation history.

| Request | Current result | Fidelity / limits |
|---|---|---|
| Clean battlefield tiles | `assets/terrain-v15.webp` replaces the gritty V14 atlas. Bright grass, readable tree canopies, broad hill/mountain forms and clear blue water use the existing six-neighbour bitmask transitions. World-aligned fields are sampled across several hexes; connected terrain shares edges. Weather tints are lighter. | New illustrative art, not recovered DOS graphics. Original province terrain grids, impassable cells and deployment edges are retained. |
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

## V14 — requested controls, original-binary checks, terrain and folder layout

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

## V13 — remaining feature branches and final discrepancy status

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

**Remaining fidelity differences:** precise arrival slot/month semantics; whole-realm versus local exile followers/resources and rebel encounters; original succession loyalty; combat/economic/capture/event probabilities; original historic/fiction affinity/stat behavior; complete conditional historical scripts and lifespans; initial/transfer treasure flags; court/imperial-capital logic; defender selection/first-turn and five-attacker limits that are established for NES but not this DOS binary; exact deployment masks, seasonal salary/population scheduling and device behavior. None is relabelled “fixed.” The accepted overrides in section 8 remain intentional. This is the evidence-based boundary of the completed comparison.

**Complete portable game pack:** playable game, all art/audio, six scenarios and arrivals, local JavaScript libraries/licenses, source, tests, import/decode tools, this report, launchers and source commit. No build or internet connection is needed once extracted; Python serves the files locally. Development tests additionally need Node/npm. Original DOS executable and unmodified commercial resource files are not redistributed.

## V12 reconciliation — retained release history

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

## Supplied DOS data and v11 changelog (historical baseline)

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

## 1. Main findings

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

## 2. Starting scenarios and officer data

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

## 3. Exile, succession, and campaign completion

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

## 4. Province orders

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
| P21 | Reward horse/writings: source prompts do not ask for gold. | All three rewards charge an additional chosen 1–100 gold; horse also consumes stock. Writings are once per recipient/month. | Difference from source; earlier user requested a gold amount for these branches, so discuss before reversing it. `Command11` versus rewards. |
| P22 | Small gold reward: source refuses when base gain is below one. | V12 rejects a gold reward whose integer base loyalty gain is zero, before charging resources. | Confirmed source check restored. |
| P23 | Merchant: source selects an acting officer for each trade. | V13 selects a ready actor, charges their action, and separately selects the weapons recipient. | Actor and recipient branches implemented; original costs/rounding separately qualified. |
| P24 | Merchant integer rounding. | V12 buys with floor(amount/rate)+1; maxima prevent overdraft. Selling requires at least one exchange unit, so zero-income sales are rejected. | Reconstructed rounding restored with bounded-resource safety. |
| P25 | Delegation: DOS Full/Internal/Military/Personnel plus supply/attack targets [X07]. | V13 Self/Direct is followed by four authority policies, supply destination and attack target. Ordinary resource/action rules apply; delegated provinces block manual orders until recalled. | Menu/target branches implemented; delegated policy choices are remaster heuristics. |
| P26 | Advice: source war/officer/spy suggestions and rumor topics. | V13 General/War/Officers/Spy/Visitors topics cache distinct monthly advice. Visitors stay or move one connected province. Rumors still prioritize strong free/hidden talent. | More topic/movement branches; accuracy, rumor ranking and visitor probabilities remain approximate. |
| P27 | Tax: source basic formula. | Season gate, loyalty −10, trust −5, and basic draw ranges match. The remaster adds its own famine multiplier and explicitly consumes the governor's action. | Partial match; source has an unfinished governor-action TODO. |
| P28 | Ruler-only appointments versus ready-officer gates. | V12 appointments/dismissal enforce ruler presence. Reward/tax require governor readiness; delegation consumes ruler action. | Confirmed appointment/dismiss gates fixed; complete executable gate matrix still untraced. |
| P29 | Map/fort construction: DOS builder, tile selection, legality, and fort-count prompts [X10]. | V12 Map offers builder selection and hex placement. Constructed forts persist into terrain and saves; plain/hill required, current cost 100 gold, builder action consumed. Forts attribute shows map fort count. | Construction branch implemented; cost/legality/limits are explicit remaster choices. |

**Important reconstruction caveats:** `Command4` omits some food spending/bookkeeping and appears to subtract population on disbanding. `Command5` leaves enemy recruitment and adviser outcomes unfinished. `Command11` omits some resource accounting. `Command18` contains inconsistent adviser pointers/field usage. These omissions should not be restored as features.

## 5. Battles

| ID | Original reference | Current implementation / difference | Evidence / status |
| --- | --- | --- | --- |
| B01 | DOS next-month continuation message [X06]; thirty-day boundary [M23]. | V12 preserves unresolved battles as suspended wars after day 30, permits other campaign orders/factions, and resumes after the next monthly council. Multiple pending wars are saved. | Continuation branch fixed; original siege-supply scheduler remains unverified. |
| B02 | Defender acts first [M20]. | Attackers deploy first and receive the first combat turn. Allied units share their side's turn; generals may act in any order. | NES comparison; `spawnBattle/act('deploy')/advance`. |
| B03 | Attacker five; defender ten [M20]. | Up to ten active units on either side. Defense automatically selects the strongest ten troop-bearing officers with leader/governor preference, rather than player selection. | NES comparison; DOS limits still unverified. |
| B04 | Training-dependent mobility, maximum six [M20/M22]. | Every unit starts at two. Points persist and can accumulate to 1,000; training does not increase movement allowance. | Current rule is distinct. Earlier conversation may have authorized this model; preserve pending discussion. |
| B05 | Water costs five [M20]. | Water costs three, like forest/hill/fort/capital; plains cost two. Mountains are impassable. | NES comparison. Other terrain values require edition-specific verification. |
| B06 | Enemy proximity restricts movement [M21]. | V12 movement may enter a hostile-adjacent hex, then stops; paths cannot continue through enemy control. | Zone-of-control branch implemented; exact DOS mask untraced. |
| B07 | Forests conceal enemy troops [M21/M22]. | V12 jungle enemies are concealed in the battlefield and View until an opposing unit approaches. AI target lists use the same visibility rule. | Concealment implemented; scouting/reveal persistence and original distance unverified. |
| B08 | Commander loss ends battle [M20]. | V12 any designated army commander losing fighting status ends the battle, even when not the ruler. | Commander-defeat branch implemented. |
| B09 | Food exhaustion decides victory [M24]. | V12 a battle-side food store reaching zero produces immediate defeat. | Food-exhaustion branch implemented; supply-use rates remain remaster constants. |
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

## 6. Calendar, events, economy, and AI

| ID | Original reference / evidence | Current difference |
| --- | --- | --- |
| E01 | Annual population growth; seasonal stipends [M11/M25]. | Population grows every month. Officers cost 3 gold/month plus troops/200; troops consume rice/3 monthly. These are configured remaster costs. |
| E02 | January/July income; source event categories. | Income uses simple population/loyalty/land factors, plus remaster famine reductions. Gold omits land, and harvest omits flood protection and popular loyalty. These formulas were not recovered from DOS. |
| E03 | Loyalty depends on trust/affinity [M25]. | Trust/affinity thresholds remain remaster constants. V12 adds shared blood-mask and ten-year service protection to low-loyalty departures. |
| E04 | Historical/fictional option in DOS `MainMenu.SelectHistory`. | V12 Historic/Fiction setup choice is saved. Fiction suppresses factual annual chronicle notices and named early-death windows; age/health and state-based stratagem eligibility remain. Original affinity/stat changes are not reconstructed. |
| E05 | Age/death data and historic/fictional behavior. | V13 serving/free/hidden officers share January age/named-window checks; future identities and prisoners are protected. Only nine named early-death windows are reconstructed. Complete native lifespans remain unverified. |
| E06 | Disaster categories [M25]. | V13 natural disasters also draw in unowned provinces. Owned-only political uprisings/rebellions retain governor eligibility. Regional filters, seasonal spread and losses remain remaster constants. |
| E07 | User's requested omens, stratagems, medical book. | Comet death chance is 45% next month; medical-book chance 7% monthly; tiger/wolf changes hostility; chain plot reduces all Dong Zhuo subordinates' loyalty by 20. These are implementations of the requested themes, not verified original event scripts. |
| E08 | Historical events with current-state conditions. | V13 Historic mode adds a Tao Qian → Liu Bei province/general bequest requiring both surviving realms and no Tao siege. It is skipped in Fiction and cannot repeat. Other annual notices remain factual chronicle text. Complete original state-changing scripts are not reconstructed. |
| E09 | Enemy AI: incomplete in Python reference. | V13 AI dispatches real alliance/gift/marriage/threat/joint proposals, recruitment and infiltration/rival/wolf/betrayal/forged-letter missions; tactics/priority/eligibility use heuristic personality and global intelligence/aggression. Original DOS AI is untraced. |
| E10 | Merchant/travelling advisers. | V13 special visitors remain or walk one fixed neighbor each month. Initial locations, monthly merchant 80% and bounded rice-price walk remain remaster choices. Original probabilities unverified. |
| E11 | Monthly officer arrival/recovery. | V12 schedules every declared non-sentinel Taiki record and preserves coming-of-age/recovery/Hua Tuo healing. Exact DOS arrival month/slot semantics remain unverified. |
| E12 | Province turn scheduling [M13]. | V13 Province Rest marks that province finished and selects the next directly ruled province. Delegated provinces cannot receive manual orders. Separate End turn runs delegation and completes the faction. Province order and cross-province browsing remain remaster choices. |

The spring/summer/autumn/winter grouping of January–March / April–June / July–September / October–December is consistent with the reconstructed DOS display convention. It is not flagged as a discrepancy merely because modern seasonal calendars differ.

## 7. Province capitals and historical labels

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

## 8. Accepted redesigns and verified matches

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

## 9. Additional unresolved fidelity areas

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

## 10. Suggested discussion order

1. **Use the supplied English main.exe as the authoritative rules reference.** Liu Bei 189 is closed at three. Keep accepted historical/UI changes separate from rules fidelity.
2. **Restore campaign continuity:** exile party and commands, successor decisions, ruler release, defeat, and unification.
3. **Repair the officer lifecycle:** full Taiki arrivals, service years, blood relationships, and active-slot reuse.
4. **Restore extended warfare and settlements:** monthly continuation, defender/allied reserves, army purses, captured generals, and commander defeat.
5. **Complete original command branches and gates:** recruitment methods, remote ruler appointments, delegation policies, scout/merchant actors, spies, and diplomacy.
6. **Tune probabilities and economics only after evidence is recovered.** Apply date-aware geography labels and perform a full seat-name review without changing the verified original graph.

V12/V13 complete the confirmed continuity/data and the specified command branches. The remaining-fidelity inventory in the V13 reconciliation is the current discussion checklist; do not interpret prior baseline wording as a new omission.

## 11. Evidence and reproducibility

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


## V17 final validation

The complete release passes 203 gameplay/asset checks (`npm test`), 30 emulated DOM/native-Canvas interface groups (`npm run test:ui`), and 12 static original-binary checks. Actual Charge-button interaction verifies occupation of a zero-soldier defender’s hex and its on-field label; victory artwork renders before captive decisions. All 41 unique paintings were inspected together and the integrated battlefield/victory images inspected. Painterly geography remains approximate; the original terrain grids and exact fort/palace markers govern play. Physical handset layout, audible playback and original DOS execution remain unverified.

## V18 final validation

The complete release passes **207 gameplay/data/artwork checks**, **31 emulated DOM/native-Canvas interface groups**, and **17 supplied-binary checks**. Governor election rejects missing/departing candidates atomically, preserves the chosen governor through battle save/load, and restores ruler governance after return. The actual War form leaves the election empty and refuses March until selection; candidate advice updates without spending RNG. Map route buttons/highlights share the native graph, including Province 9’s six connections and its single available Move destination in scenario 189. Two-messenger Rival Tigers saves enforce distinct assignments and correct destinations. Existing battle, courier, slider, victory and 41-painted-map checks still pass. Native Canvas China/battlefield art was inspected. Browser/physical handset layout, audible playback and DOS runtime execution remain unverified.
