# Romance of the Three Kingdoms II — mobile raster remaster

A playable HTML5 / Canvas 2D strategy sandbox for phones in **landscape**. Portrait shows a rotate prompt. Fullscreen and orientation locking are attempted from a user gesture; unsupported browsers retain the prompt.

## Run

No build step is needed. Serve the package root over HTTP(S):

```sh
python3 -m http.server 8080 
```

Open `http://localhost:8080/rtk2/`. For a phone, use the server computer’s LAN address. ES modules and JSON/config requests require HTTP rather than opening the HTML as a local file.

The downloadable package has the application in `rtk2/` and libraries in its sibling `lib/`. Serve the package root and open `/rtk2/`.

## Launch and control

The first screen has **New Game**, **Load Game**, and **Quit**. New Game follows this sequence:

1. Choose one of six scenarios: 189, 194, 201, 208, 215 or 220.
2. Choose 0–12 human players. Later scenarios limit the count to their available active rulers.
3. For nonzero players, select one distinct ruler for each human, in order.
4. Choose AI intelligence: **Beginner**, **Medium**, or **Hard**.
5. Start Game.

Zero humans skips ruler selection and runs AI versus AI. The presets set intelligence to 25/60/90, aggression to 35/55/75, and source-formula difficulty to 1/2/3. HUD can tune these values during the campaign. Human players share the phone with handoff dialogs.

**Menu → Exit** or Esc returns to launch, saves a device checkpoint and stops audio/AI playback. Load Game accepts an external JSON campaign file; its optional device-checkpoint button restores the autosave, including an unfinished battle. Legacy version-one campaigns migrate automatically. Quit stops the game and attempts to close the tab; when the browser keeps it open, the closed-game screen lets the user close it or return to launch.

**Save Game** in the menu uses the browser's external file save dialog when available. Otherwise, or when the picker is restricted, it downloads a `.json` campaign file. **Load Game** uses a file input, with native open-picker support where available. Browsers cannot silently read arbitrary device paths, so paths are chosen through their file picker.

Pause AI and speed control automated turns. AI stops while a dialog/HUD is open or the page is hidden. Every active faction takes one turn before monthly upkeep, income, events and refreshed officer actions. A human controls the defending army when that battle is included in the selected Battle view.

## Original-style mobile display

The map occupies **40% of the screen width**, and the right pane occupies **60%**. There is no fixed top header. Month, year and season appear in the map’s upper-left corner, with Menu at the upper right. The current ruler’s home province blinks; controlled provinces have gold outlines. Reduced-motion settings replace blinking with a static highlight.

The right pane’s sections occupy **30% / 50% / 20%** of its height:

- **Top:** province name, ruler, trust and governor on the left, governor portrait on the right. HUD replaces the former settlement/readiness status. This section stays unchanged when navigating between province views.
- **Middle:** the event scene at the beginning of a turn; twelve attributes in Province View (Pop, Men, Generals, Free Gen, Gold, Food, Rate, Horses, Loy, Land, Flood, Forts); or the nineteen commands in Province Orders.
- **Bottom:** navigation to this month’s events across China, Province View and Province Orders. The event list highlights controlled provinces and marks the current capital with a star. Province Orders links back to Province Events and Province View. Monthly council review adds Next event / Begin monthly orders before commands become available.

Every faction turn starts on the China map at the current ruler’s home. **Rest** ends the faction’s turn after confirmation. The command grid contains **Rest, Move, Send, War, Milit, Person, Diplom, Spy, View, Cultiv, Flood, Reward, Give, Merch, Tax, Map, Deleg, Exile, Advice**. The detailed staged suborders, action gates and resource limits are listed in the v9 Province Orders table below.

Save Game, Load Game, Chronicle, checkpoint status, sound/music, help, settings and Exit are inside Menu. Portrait and event atlas cells are drawn with a single scale factor and centred letterboxing. This applies to turn, setup and dialog portraits, events and launch artwork; army sprites retain the source frame ratio as well.

All 352 distinct officers across the six scenarios have their own generated portrait. These are artistic interpretations, not authenticated historical likenesses. Twelve expanded event scenes accompany the original diplomacy, military/capture and council atlas. The HUD can preview diplomacy/messenger-detention artwork without changing the campaign; previews are marked and removed when loading saves. Actual prisoner/capture messages use the detention scene. A new diplomatic messenger-imprisonment decision system is not implemented by this UI update.

Battles allocate **75% of the screen width** to the unobstructed battlefield and **25%** to a right panel. The battle panel uses **20% / 50% / 30%** of its height for province/date/weather/wind, the army comparison, and orders. The comparison always shows **defenders on the left** and **attackers on the right**, with a weather image and row labels between their commander portraits. It shows each ruler, commander, current soldiers, fighting generals / generals remaining in the side’s province, army rice and province treasury. These values update after casualties, inspections, reinforcements and army handoffs. Portraits and weather images preserve their source ratio.

The bottom section starts with **Move, Attack, Wait, View, Strategy, Flee**. Move replaces that list with **Normal move / Move enemy**; Attack replaces it with **Normal / Simultaneous / Fireball / Charge**. Back returns to the six orders. Wait acts immediately. View keeps the main order list and opens a unit selector: friendly inspection is free; every enemy inspection costs 100 gold. Strategy provides **Reinforce / Bribe** with a Back button. The lead general's Flee confirms defeat and whole-army withdrawal. Other generals choose an empty connected province; attackers can also choose their source province. Deployment uses a unit selector and Confirm placement in the bottom section.

Tap a friendly unit on the battlefield to select it; drag/pinch to explore. **Menu → Battle controls** also provides a unit selector, movement directions, target coordinates, personal challenge, Finish army orders and battle log. Menu provides a direct Finish army orders action as well. Menu and HUD are in the battle panel’s top section.

## Monthly council and events

Every new month resolves its events before faction orders. The event pane presents each report with **Next event / Begin monthly orders**. Human campaigns wait for review; AI-versus-AI campaigns advance reports automatically, with a minimum 1.2-second display. Review position, historical entries already shown, and spreading disasters are saved, so restoring a council resumes its current report without applying losses twice. Every report is also recorded in Chronicle.

The original manual's Game Flow section (pp. 45–47) supplies the categories: ageing and generals coming of age, recovery, loyalty changes and departures, free-general movement, locusts, floods, typhoons, epidemics, popular uprisings and governor rebellion. Birth years use scenario records. Hidden adults remain searchable; hidden officers aged sixteen become available in January. Old-age deaths begin at 65, with age-dependent probabilities; rulers pass to a serving historical heir when available or a selected loyal senior officer. The remaster selects that successor automatically.

Locusts and epidemics occur in spring/summer; floods and typhoons occur in summer (April–June). Dikes reduce flood/typhoon damage and likelihood. Locusts and epidemics can spread along the original fixed province connections in the following season. Locusts disappear by winter; epidemics expire after their annual cycle. Low popular loyalty, ruler trust and governor charm increase uprising risk. Very low governor loyalty can cause rebellion: the governor forms an AI realm in an unused ruler slot (up to sixteen total), and other generals follow or become unaffiliated. If every slot is occupied, the province becomes independent.

Dated **Historical chronicle** cards cover milestones from Dong Zhuo's control of the Han court through the emergence of Wei, Shu and Wu. They recount recorded history; campaign ownership and battle outcomes continue from play. Historical cards appear once per eligible year, at its first council, rather than claiming an exact historical month. A month with no exceptional events still has a council report. Random-event probabilities, loss amounts, mortality, succession and historic-card presentation are remaster rules; they are not recovered DOS event code. Existing wage, income, food and population formulas remain the remaster's economic rules.

## Sound and music

The game menu has independent **Sound effects** and **Music** switches. Both are enabled by default, saved in the campaign and remembered as preferences for new campaigns. Playback starts only after a start/load gesture. Disabling effects stops current effects without stopping music; disabling music leaves effects available. Audio stops on exit/quit and while the document is hidden.

Bundled MP3s include an original 48-second pentatonic, plucked-string instrumental loop and six synthesized effects for selection, orders, battle, fire, monthly council and messages. No remote media, recordings from the DOS game or third-party soundtrack are used. Browser playback control was tested with mocked audio objects; audible quality and physical device mute/autoplay behavior have not been evaluated.

## China and province maps

The realm uses Natural Earth’s public-domain 1:50m physical coastline and major rivers. Each of the original 41 game sectors is anchored to a representative historical seat, with English/Chinese seat and circuit labels. Examples include Chenliu / 陳留, Luoyang / 洛陽, Chang’an / 長安, Xiangyang / 襄陽, and Chengdu / 成都. Moling changes to Jianye from 211; Jiaozhi circuit is used before 203; western circuit labels account for the earlier Sili/Liang names.

The 41 sectors preserve the original gameplay adjacency. They are **not a reconstruction of precise historical administrative boundaries**, whose jurisdictions changed and differed between rulers. The physical map does not draw modern political borders. The raster terrain artwork illustrates terrain types rather than measured elevation. Natural Earth’s physical geography is modern, rather than reconstructed ancient river courses.

Province map opens the original **13 × 12** tactical terrain layout with raster textures, with plain, jungle, hill, mountain, water, castle and palace hexes. These 41 grids were extracted from `Resources/S1` using the layout in `Src/Command3.py`. Original EGA artwork is not used.

## Tactical warfare

Combat rules complete the unfinished source war screen; they are a remaster design rather than an exact reconstruction of DOS combat.

The default **Battle view** is **My ruler personally present**. Detailed combat opens when a selected human ruler joins the invading commanders or is present in the defending province. Other battles, including fights in owned provinces away from the ruler, resolve automatically through the same tactical engine and produce a campaign report. **Menu → Battle view → All battles** permits observation and control of other human armies, and makes AI wars available for HUD inspection. This setting persists in saves.

The battlefield uses the original province’s **13 × 12 offset-column hex grid**. Movement and adjacent attacks have **six directions**: upper left, up, upper right, lower left, down and lower right. The direction pad, map highlights and coordinate picker all use the same hex geometry. The 41 terrain arrays are preserved exactly; mountains block movement and deployment.

**Deployment comes first.** Select each commander and tap a highlighted feasible hex, then confirm that army’s positions. Attackers must use passable hexes on the edge facing their source province, excluding the palace. The approach uses the original DOS sector coordinates and six fixed connections, rather than the remaster's geographic seat locations. A source to the lower right of the target enters on the target's lower-right edge. Diagonal entry areas occupy the corresponding half of a side and half of its adjacent top/bottom edge; vertical approaches use the top or bottom edge. If an approach has fewer legal hexes than commanders, send fewer commanders. Defenders may choose any free passable hex. Both armies finish deployment before day one. Unfinished placement is included in saves.

Each unit starts with **two mobility points** and has **one daily order**. Unused mobility carries forward. **Wait** keeps the unit in place and banks **one additional point**; finishing an army’s orders makes every unit without an order Wait once. Movement consumes the terrain cost along the chosen path. Inspection is available after an order and does not consume an order. A complete turn—orders from both armies—is **one day**. If day 30 ends unresolved, **the defender wins**; day 31 cannot begin.

| Terrain entered | Mobility cost |
|---|---:|
| Plain | 2 |
| Mountain | Impassable |
| Hill | 3 |
| Water | 3 |
| Jungle | 3 |
| Castle | 3 |
| Palace | 3 |

The six main commands have these options:

| Command | Options and behavior |
|---|---|
| **1. Move** | **Normal move** follows affordable six-direction steps; occupied and burning hexes block movement. **Move enemy** taunts a hostile general into a feasible hex closer to the issuing unit. Relative intelligence affects success; a successful lure spends the enemy’s mobility. |
| **2. Attack** | **Normal** strikes an adjacent enemy with retaliation. **Simultaneous** requires at least two ready friendly units beside the enemy and consumes their daily orders. **Fireball** tries to ignite adjacent dry ground. **Charge** makes up to three strikes with higher own losses, stopping if either unit is defeated. A surviving charger occupies an enemy's hex when its soldiers reach zero. If soldiers remain, it has a **50% chance** to land one hex beyond the enemy along the same hex direction. Landing requires an unoccupied, in-bounds, passable hex, costs no extra normal-move mobility, and can trigger an ambush or palace victory. A charger that is itself defeated cannot advance. |
| **3. Wait** | Remain in the same hex; add one mobility point. No movement is required. |
| **4. View** | Choose any battlefield unit. Friendly inspection is free; **every enemy inspection costs 100 gold** from the current army’s province treasury. Inspection does not spend the daily order. |
| **5. Strategy** | **Reinforce** calls a ready reserve commander with rice from a friendly province adjacent to the battlefield, leaving an officer behind to govern. Choose a feasible entry hex on the edge facing the reserve commander's home province. New arrivals start with two mobility and may act from their next army turn. **Bribe** spends an offer of at least 100 gold to try to recruit an enemy general; rulers cannot be bribed. Gold is spent even on refusal. |
| **6. Flee** | A normal general withdraws only that unit. The army commander must confirm; confirmation withdraws **the entire army** and concedes the battle. Cancel leaves every unit in place. |

On **day one**, an unused general with **War 80+** may call a **personal challenge**. The opposing player or AI accepts or refuses. Refusal removes **5% of the responding army’s soldiers** through desertion. Accepted combat compares War with a random ±10 modifier; the losing general is captured. Both accepting duellists use their daily order. Capturing the opposing ruler ends the battle. The initial War threshold, duel resolution and desertion fraction are remaster defaults; **HUD → Battle** can tune the challenge threshold from 0–100.

Weather uses **Clear, Few clouds, Cloudy and Rain**, with matching images. Rain immediately clears the whole fire map and prevents ignition. Burning units lose **30% of their remaining soldiers**, with a minimum of 100 capped by available soldiers, and 20 morale after each completed day. Wind has six directions and calm/breeze/strong/gale strength. Strong wind can spread fire two hexes downwind with flank spread; gales can spread it three hexes with more aggressive probabilities. Map edges never wrap. Weather, ignition, casualties, taunts and bribery probabilities are remaster implementations, not recovered DOS code.

A unit already in **jungle** automatically ambushes a hostile unit arriving at **any of the eight surrounding grid positions**. This explicitly requested trigger is separate from the six legal hex movement/attack directions. Each step of a path is checked, including successful enemy lures; each jungle unit ambushes once per hostile movement without spending mobility or its daily order. A defeated mover stops immediately.

Win by **capturing the opposing ruler**, **occupying the palace**, **exhausting the enemy’s fighting soldiers**, or making **every enemy unit flee**. Palace occupation wins immediately; it does not require a separate siege. Rice is consumed once per complete day at `ceil(living troops / 20)` per army. Shortage costs 15 morale; units rout at morale ≤10 or zero troops.

Surviving commanders retain casualties and gain training. Unused invading rice returns to origin; remaining defending rice stays in the target. Victorious invaders occupy the province. Captured generals become prisoners; defeated defenders with a friendly adjacent refuge retreat there. Reserve commanders and bribed generals settle according to their final allegiance and battle result, with officer lists and governor/capital/adviser references repaired consistently. AI uses the same deployment, mobility, combat, reinforcement and province-order rules.

Legacy square-grid battle checkpoints migrate to the hex rules, starting mobility at two and relocating any blocked mountain positions to nearby passable hexes. New saves validate their terrain against the original province array and their approach against the original connection. All-edge deployment saves migrate to directional placement: units on the wrong approach become unplaced and must be placed again. Battles already in combat retain their positions.

## Testing HUD

**HUD** opens a live panel and pauses AI. Changes are explicit and bounded; rejected edits restore the full prior state. Close & resume AI restarts automation. One AI action advances one automated order or tactical action; when a battle is outside the selected view, it resolves the entire battle and records its result.

| Tab | Editable values |
|---|---|
| AI | Global defaults or individual ruler overrides: intelligence 0–100, aggression 0–100. Intelligence changes commander choices, economic priorities, invasion risk and battlefield movement. Aggression changes invasion chance and military preparation; 0 suppresses invasions. |
| Officers | Intelligence, war, charm, loyalty, training, troops, weapons, compatibility, virtue, ambition, monthly action status. |
| Province | Gold, rice, population, land, dikes, loyalty, castle, horses, rice price, ruler, merchant, reset monthly actions. Ownership edits also update serving officers and governor references. |
| Battle | Unit troops, morale, mobility, War, Intelligence and daily order status; day, challenge threshold, six-direction wind and its strength, weather and both armies’ rice. Routing edits can resolve the battle immediately. |

During battle, campaign officer/province edits are blocked; use the Battle tab to edit the active units and stores consistently. To give an empty sector to a ruler, it must have at least one available/hidden officer to assign as governor.

## Dependencies and rendering

**All active gameplay graphics are 2D raster.** Canvas 2D draws the geographic coastline/rivers, raster terrain tiles, cities, army sprites and effects. Portraits and event scenes are raster images. Army movement and attacks select frames from an eight-frame painted sprite sheet. Functional controls remain accessible HTML. No WebGL or THREE renderer is loaded by the current app; the earlier THREE modules/libraries remain in the source for reference.

Optimized WebP atlases are used at runtime. The original four PNG atlases are retained alongside their WebP copies. The expanded portrait/event/weather set is distributed as full-dimension WebP atlases. Low/balanced/high raster resolution caps device pixel ratio at 1/1.5/2. Province animation targets 30 fps and stops when hidden. Static China frames redraw only when needed. Art prompts and assignments are recorded in `ARTWORK.md`.

YAML configuration still tries `../lib/js-yaml.js`, its pinned js-yaml 4.1.0 CDN, then the bundled copy. The original THREE 0.180.0 and js-yaml library copies remain in the download's sibling `lib/` directory. No build step is needed.

Historical monthly cards, disasters, named officer deaths, ruler succession, comet omens, stratagems and recovery events run in the campaign. Humans play hotseat; network multiplayer is not included. Engine and DOM/file/audio flows were checked in an emulated DOM; raster scenes were rendered with a real Canvas 2D implementation and visually inspected. **A real browser, physical handset layout/touch behavior and audible playback still require device verification.**

Feature-detected browser WebMCP tools read the same live campaign, select a province and stage a domestic order for human review; they never spend resources automatically.

## Source mechanics

Inspected [JuQiang/Rotk2_Python](https://github.com/JuQiang/Rotk2_Python) at `99bdf5a1516e5b7d9ef8def4c935a11319e88bd9`.

The six scenario datasets, 255 officer slots, original 41 sectors, troops and attributes come from `Scenario.dat` and the source data classes. Province adjacency follows `Helper.GetNeighbor`. Cultivation/dikes and relief retain integer formulas in `Command9_10_12`. Rewards, teaching, merchant costs and extra taxation follow Commands 11, 13 and 14, with transactions/action limits completed. Recruitment retains compatibility/charm/trust concepts with a bounded probability model. Hire capacity and province-wide training now use Command4; advisor accuracy and visitor restrictions use Command18. Movement, transport, diplomatic/spy probabilities, delegation, monthly simulation, full faction AI and tactical rules complete the unfinished systems as explicit remaster implementations. `game-config.yaml` configures domestic monthly rules.

Guo Huai’s 194 reserve record has source loyalty 215; playable loyalty is clamped to 100 with `sourceLoyalty: 215` retained. The supplied DOS `main.exe` was inspected as an MZ executable and not executed. No original images/audio or executable are distributed for display.

## Verify

```sh
node tests.mjs
node strategy-tests.mjs
node battle-tests.mjs
node monthly-tests.mjs
node expansion-tests.mjs
node artwork-tests.mjs
node --check rtk2/app.mjs
node --check rtk2/strategy.mjs
node --check rtk2/battle.mjs
node --check rtk2/raster-world.mjs
node --check rtk2/audio.mjs
```

The 15 engine checks cover domestic formulas, transactions, all scenarios/rulers, save invariants and ten-year monthly simulations. The 15 strategy checks cover player setup, legacy migration, faction ordering, observable AI controls, battle save validation, movement, damage, retreat/capture, atomic HUD edits, human defense, portrait coverage, audio/event save persistence, animation cues and **6,000 AI actions per scenario** with checkpoint validation.

Forty-three battle checks cover hex geometry, all 41 original terrain arrays, deployment/checkpoints, terrain costs and persistent mobility, charges and simultaneous attacks, enemy lures, paid inspection, challenge response and captured rulers, commander/individual flight, palace occupation, the 30-day cutoff, six-direction winds, correct flanks and aggressive spread, rain, all eight ambush positions and movement paths, reinforcement/bribe settlement, viewing defaults, automated campaigns, and legacy migration, directional approaches, charge occupancy, breakthrough blocking and landing effects. Twelve monthly-event checks cover council sequencing and saves, one-time effects, historical cards, age/arrival rules, succession, disaster losses/spread, imprisoned generals, rebellion and invalid event saves.

For emulated interface and actual raster drawing checks (Node 24+):

```sh
npm install
node ui-tests.mjs
```

These check the ordered launch, twelve-player/era limits, domestic forms, portrait/event frames, independent audio toggles, external save/open, menu-only checkpoint/save/Chronicle, monthly council review/resume, deployment and battle checkpoint flows, both human armies’ deployment, all six command menus, paid inspection, mobility and weather HUD edits, challenge response handoffs/desertion, actual reinforcement/rice transfer, confirmed/cancelled commander withdrawal, raster drawing, WebMCP, Esc, Quit and zero-human automation. They do not replace real-device tests.

## Credits and geography sources

Romance of the Three Kingdoms II is a Koei title. This is an independent prototype, not an official Koei release. THREE.js and js-yaml retain MIT licenses in accompanying files. The inspected upstream project declares no license; no new license is assigned to its game data.

Physical data: [Natural Earth land](https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-land/), [rivers](https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-rivers-lake-centerlines/), [public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/). Historical circuit naming cross-checked against the public-domain [Book of the Later Han, Treatise 18](https://zh.wikisource.org/wiki/後漢書/卷118). Representative seat locations are a remaster layer, not data reverse-engineered from the original game. `tools/build-geography.py` rebuilds the geographic JSON from downloaded Natural Earth GeoJSON with Shapely. Supply a directory containing `land.geojson` and `rivers.geojson`: `python tools/build-geography.py /path/to/natural-earth`.

`tools/build-audio.py` regenerates the original sound set with NumPy and ffmpeg. Generated artwork was made with the built-in image-generation tool; original and optimized assets are in `rtk2/assets/`.

Battle reference: [Koei RTK2 NES instruction booklet](https://www.digitpress.com/library/manuals/nes/Romance%20of%20the%20Three%20Kingdoms%20II.pdf), pp. 40–54: deployment, six-direction movement/attacks, enemy taunts, personal challenges, commander flight, Wait, reinforcement, bribery and the 100-gold enemy inspection. The requested two-point starting mobility and terrain costs take precedence over the manual’s mobility defaults. Province terrain comes from the DOS source resources.

Monthly-event reference: the same Koei RTK II manual, Game Flow pp. 45–47. Historical chronicle narratives are concise original summaries of its World of Romance of the Three Kingdoms section, pp. 53–64, plus the scenario era descriptions.

## Expanded campaign events, retreats and roster

Strategy contains Reinforce and Bribe. A lead general’s Flee asks for confirmation of defeat and withdraws the army. Other generals must choose the attacker’s source province (attackers only) or an unoccupied province connected to the attacked province. An empty destination is reserved against the other army until settlement; save files preserve the choice. Settlement transfers the surviving general and soldiers and establishes a governor there.

The four battle states are Clear, Few clouds, Cloudy and Rain, each with matching artwork. Clear gives the best ignition probability; few clouds and cloudy reduce it. Rain blocks ignition and clears all existing fire. Six-direction wind and strength continue to govern spread. Older Stormy saves migrate to Cloudy without changing their wind or troop positions.

| Event | Campaign behavior |
| --- | --- |
| 蝗蟲 · Locusts | Food and gold losses; gold/food income reduced by 25% for one year; seasonal swarm spread. |
| 揭竿而起 · Uprising | Population, supplies, troops and popular loyalty fall. |
| 天眼 / 風颱 · Typhoon | Random occurrences limited to Yang and Jiao regions; land, dikes and loyalty fall. |
| 房子泡湯了 · Flood | Random occurrences limited to the Yellow River regions; dikes mitigate losses. |
| COVID-189 · Plague | Population, popular loyalty and troops fall; officers can become sick. |
| 看！有流星！快許願！ · Comet | A named officer receives an omen, with a chance of actual death next month. |
| 出兵戰爭 · War | Actual invasions show the troop-deployment scene. |
| 佔地為王 · Occupation | Actual settlement/conquest changes ownership and shows the occupation scene. |
| 驅虎吞狼 · Tiger/wolf plan | Eligible Xun Yu serving Cao Cao raises hostility between two neighbouring rival realms. |
| 名聞天下的某某某領便當去了 · Officer death | Removes the named officer, repairs governor/adviser references and handles succession. Early-death windows include Sun Jian and Sun Ce. |
| 大家的最愛 / 連環計 · Chain stratagem | Eligible Wang Yun and Lü Bu in Dong Zhuo’s service trigger subordinate loyalty loss. |
| 華佗の医学書 (青囊書) · Medical book | The recipient heals sickness or injury in one month instead of three. Severe battle losses can cause injury. |

These event categories and effects follow the requested original-game behavior. Random chances, losses and stratagem eligibility are explicit remaster rules; they are not claimed to reproduce unrecovered DOS formulas. The introductory council can include random special events. Later monthly councils resolve health, age, future arrivals, disasters and special events before orders.

`officer-roster.mjs` records exactly 352 distinct identities across all six scenarios, including the future-arrival records recovered from upstream `Taiki.dat`. Spelling aliases are unified; Zhang Yi, Zhang Xiu, Zhang Heng and Liu Yan namesakes retain distinct identities. The 194 Yu Jin record is corrected from the earlier Yue Jin transcription. The unavailable Sun Liang reserve sentinel is excluded from the playable roster. Future arrival dates and province references are preserved on officers; they cannot be found before entering the campaign. Each identity has its own generated portrait cell, consistently used across scenarios. Numeric campaign slots remain unchanged, and older saves restore newly added future records into their formerly unused slots.

The seventeen expansion checks cover explicit retreat destinations and atomic failures, reservation/restoration/settlement, defender restrictions, weather/fire differences and old-weather migration, famine expiry, regional disasters, one-vs-three-month recovery, comet/death/succession, stratagem eligibility, all 352 identities and unique portrait assignments, dated future arrivals, and occupation-event artwork persistence. Artwork checks compare every portrait’s pixel hash and verify uniform scaling in landscape and portrait display frames.

## Province Orders and graphics update (v9)

The launch has a new cinematic Han campaign illustration. Eight detailed terrain cells replace the earlier battlefield textures. Every army sprite is a formation of roughly two dozen soldiers with standards; four marching poses and four attack poses animate movement and combat. Defender formations face the opposite direction, and allied support has a gold affiliation marker. China uses new relief artwork clipped to the data-based land outlines, with original river geometry and eight regional capital illustrations for all 41 seats. Geographic seat positions, gameplay connections, and province terrain arrays are unchanged. The relief is illustrative, not a surveyed elevation map. Every raster uses one scale factor: launch/portraits/events are contained and letterboxed, terrain is uniformly scaled behind the hex clip, and army/capital frames retain their native cell ratio.

| Order | Flow and behavior |
| --- | --- |
| Advice | **Advice / Rumours / Healing**. Advice requires the advisor in the current province and rolls once per province/month against INT; high INT gives useful, accurate supply, talent, loyalty, flood and invasion observations. Rumours require Sima Hui or Xu Shao visiting locally; healing requires Hua Tuo and restores all sick/injured officers here. Three travelling visitors select different provinces each month. |
| Move | **Move where → Move whom → gold 0..available → food 0..available**. Friendly/independent adjacent destinations; leave a governor and respect destination storage. |
| Milit | **Hire / Reassign / Train**. Hire chooses the officer then 1..maximum hundreds of men, costing 10 gold and 100 food/population per hundred. Capacity retains the source 50,000 civilian reserve. Hire and Reassign use the same shared allocation pool, with up to 10,000 men per officer. Reduce a commander's assignment to free men, then assign them elsewhere. Finish, Close, or Esc with unassigned men requires explicit disbanding confirmation; the men return to population. Train selects an instructor and improves all local armies using the source formula. |
| Person | **Recruit / Search / Appoint / Dismiss**; Appoint branches to Governor / Advisor. Dismiss frees a subordinate and disbands their army; it cannot dismiss the ruler or the last governor. |
| Diplom | **Alliance / Joint invasion / Marriage / Gift / Cancel alliance / Threaten**. Select the target first, then an envoy. Joint invasion requires a current ally and a target bordering both realms, then an envoy; the plan lasts one month and brings up to two ready allied formations from their own connected province edge. Surviving support returns to its realm, with proportionate gold/food payment on victory. Marriage uses one daughter per ruler. Gift is 100..available gold. Cancellation lists current allies, voids joint plans and requires the ruler present. Threaten also requires the ruler present; acceptance transfers the rival territory. |
| Spy | **Infiltrate / Rival tigers / Tiger and wolf / Betrayal / Forged letter**, issued where the ruler is staying. Infiltration sends a fully loyal subordinate as a free general; enemy recruitment lets them undermine subordinate loyalty and return to your side in battle. Rival tigers uses two rulers and two messengers. Tiger and wolf can turn an enemy governor into an independent ruler. Betrayal creates a three-month battle defection pact. Forged letters reduce subordinate loyalty. |
| View | **Other provinces / Generals / Summary 1 / Summary 2 / Territory / Data order**. Summary 1 contains rank, loyalty and abilities; Summary 2 contains source years in service, training, arms, weapons and men. Service years advance with the calendar; recruitment starts a new service record. Territory lists your provinces and marks self-rule with `*`. Data order sorts local officers by a chosen attribute while keeping ruler/governor first and preserving IDs. |
| Cultiv / Flood / Give | Select who will act, then gold 1..100 for cultivation/dikes or food 1..10,000 for relief, bounded by the province's resources. |
| Reward | Requires a ready governor. **Gold / Horse / Writings → recipient → gold 1..100**. Gold/horse improve loyalty; horse also uses stock, and writings use a local advisor at least two INT points above the pupil, once per pupil/month. All three charge the requested gold amount; this requested writings fee is a remaster change from source free teaching. |
| Merch | Available only with a visiting merchant. **Sell food / Buy food / Buy horses / Buy weapons**, quantity 1..resource/storage maximum. Weapons select their recipient first and are purchased in hundreds. Rice trades retain the province's price and integer rounding. |
| Tax | Requires a ready governor. **Impose special tax? Yes / No**. Confirmation consumes the governor's action; original repeat/summer restrictions and loyalty/trust penalties remain. |
| Map | Shows the selected province's original battlefield with one button for every fixed connected province. Selecting a neighbour highlights its legal attacking deployment edge in gold; top province information stays unchanged. |
| Deleg | Only a ready ruler present may choose **send orders where → Self rule / Direct rule** for another own province. Self rule performs domestic development at faction end; the ruler's own province stays direct. |
| Exile | Only the ruler present, with a ready governor, may confirm **self-exile**. This dissolves their realm into independent provinces and releases officers/soldiers. With no remaining human ruler, the campaign pauses and ends; another hotseat human can continue. Subordinate dismissal is under Person. |

Domestic source formulas and manual order structure are retained where recovered. Diplomatic/spy success, alliance support limits/payments, event chances, health visits, and self-exile settlement are documented remaster rules rather than claimed byte-for-byte DOS behavior. The [official Koei instruction booklet](https://www.digitpress.com/library/manuals/nes/Romance%20of%20the%20Three%20Kingdoms%20II.pdf) supplies the View/Army/Diplom/Spy command structure and pact durations; Commands4/8/11/18 in the inspected upstream supply allocation, summaries, reward and advice/visitor behavior.

Run `npm test` for the engine, strategy, battle, monthly, expanded-art/roster and 22 new province-order checks; run `npm run test:ui` for the emulated menu and native Canvas integration checks. The new checks exercise shared-pool conservation and disband confirmation, all-army training, governor gates, advice/visitors, reciprocal diplomacy, joint support and atomic invasion failure, infiltration/loyalty, timed betrayal, governor rebellion, delegation, exile and malformed saves. Raster checks cover every new formation/capital frame, distinct poses, alpha, and uniform scaling. Real handset/browser layout and audible playback still require device verification.

The follow-up hardens order continuity and saved battles: reassignment must finish before changing provinces or staging a different order; joint invasions exclude allies of either partner and new alliances cancel conflicting plans; personal units cannot override deployment directions, remote reinforcement origins or allegiance flags in a save; self-exile prevents AI/faction restart while preserving Menu → Exit. Targeted regression checks cover these cases alongside the existing bribery and allied-support restoration checks.
