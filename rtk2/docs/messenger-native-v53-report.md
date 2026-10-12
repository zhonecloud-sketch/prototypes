# Messenger and governance audio audit, v53

Evidence: SHA-256 verified English main.exe; offsets in unpacked native.bin, DS base 0x2FA60. Eleven bounded Unicorn cases in tools/verify-native-messenger-v53.py / docs/messenger-witness-v53.json passed. Reproduce with `python tools/verify-native-messenger-v53.py /outside-repository/main.exe /tmp/messenger-v53.json` and Python/Unicorn installed. No repository edits or AI training performed by this audit.

## Native messenger sound

0x11E74 interpolates a mounted messenger segment and calls sprite routine 0x12F92 for each frame. The sprite routine tests sound/driver flags and dispatches original effect ID 11 at 0x13053. Witness with three interpolation steps captured [11,11,11]; sound off and driver absent captured none. Graphics and final sound dispatch are hooked; this proves routing, not waveform playback. Current remaster AudioBus.syncCourier uses custom gallop.mp3. Therefore answer to user 8a is currently remaster, not original. Native effect11 is already rendered/exported as native-effect-11.mp3; wire that while keeping requested remaster BGM.

## Set free and route semantics

Original menus differ by mission context:

- Secret letter: DS:A8E7: Let letter pass / Seize letter / Imprison messenger. Let-pass (0x11C24 choice1) sets CA86=1 with no hostility/trust write. Seize (choice2) sets CA86=2 and increases sender hostility toward interceptor by5; in allied case trust−3 unless the special relationship helper exempted it.
- Transport: DS:A9D7: Seize / Set free / Imprison. Transport Set free (0x11D10 choice2, branch0x11D8E) sets CA86=0, lowers sender hostility toward interceptor by3, and increases interceptor trust by3 when allied. Witnesses retain original capped byte modifier functions and bounded owner-ID helper.
- Journey controller0x12398: Let-pass/status1 and transport-free/status0 BOTH continue outbound, resolve mission, then render every reversed segment via0x11E74. Tested source→middle→destination, mission, destination→middle→source. Interception encounters are not rechecked on the reverse loop. Earlier static inference that status1 aborts outward route was disproved by witness; the actual break threshold at0x12462 is>=2.
- Imprisonment attempt0x11632 raises sender→interceptor hostility by10 nonallied or8 allied. Allied interceptor trust falls5 except where special-mission predicate0x11302 exempts it. Eleven witnesses include forced escape after the relationship writes, so they occur before escape resolution. Current remaster Capture has none of these direct changes.
- Captured interception menu0x1158A uses Set free for ruler, Recruit for ordinary officers, versus Behead. This differs from remaster's generic captive panel, which lets ordinary captured messengers be set free. Native0x11528 joins ordinary officer to captor and current province; ruler Set free exits without joining. Do not claim a verified native ordinary-captive-release animated return from this evidence.

Current generic interceptJourney('free') leaves outbound active, clears interception and records allowed-to-continue. That is consistent with native continued delivery. Normal return journey later exists. After Capture, cancelJourney removes the journey; decideCaptive('free') makes a nonruler unclaimed, or teleports a ruler to another own province. No release route is saved or drawn. If user #10 concerns this case, it lacks an animation and sender/source history; preserve interception context and animate a release-only return without resolving the cancelled mission or paying cargo twice. Present that as an explicit remaster release flow unless a native ordinary-captive-return path is recovered.

## Current consequences suitable for compact UI

interceptJourney current behavior, before any v53 fix:

- Set free: permits original mission to continue; no direct trust/hostility change.
- Capture: cancels mission; intercept province receives carried gold/food/horses (capped); sender has captive pending; no direct trust/hostility change. An AI interceptor may recruit/free immediately.
- Behead: same mission/cargo cancellation/seizure; officer permanently dies; interceptor trust−5. If messenger is sender's ruling officer and an heir succeeds, successor hostility toward killer becomes100. Extinction clears alliances where no heir remains.

Sender is g.ruler(j.owner), interceptor g.ruler(j.interception.owner). Their names must not be conflated. Display sender ruler, origin '#id name', interceptor ruler, sender→interceptor hostility0–100 (higher means worse), and alliance status. If room permits display both directed hostility values: they can differ, and exact native modifier changes sender's row. Trust belongs to each ruler, not bilateral relationship. Use short consequence hints on each button with mobile wrapped rows. No forecasts should claim Capture breaks an alliance or raises hostility unless mechanics actually add those writes.

## Governance audio completeness

Native event effects0–7,9,12 have semantic mappings; event7 captive-prompt use is still missing because current kind 'prison' does not map. IDs10 opening and14 completion remain callable but UI uses custom select/order cues. ID11 courier uses custom gallop. ID15 has no verified gameplay caller. Custom governance train/trade/recruit/march/message/retreat/order all remain remaster semantic sounds; cannot claim full adoption of native gameplay routing. PC speaker fallback branches at0x5900 and0x5924 are not emulated. All16 exported OPL assets being present is distinct from fully wiring all verified contexts.

Normal attack and Charge both invoke shared native combat effect13 at0x250D7 within repeated animation. A separate shouting sound for Charge has not been verified from main.exe. Charge repeats actual exchanges and the same native effect; any crowd shout would be a documented presentation addition.

## Tests needed

- Engine: letting intercepted envoy pass retains original mission and cargo, completes delivery once, shows reversed path, never intercepts return, saves/loads at every leg.
- Engine/native parity: transport Free sender hostility−3 clamp0, allied trust+3 clamp100, no reciprocal hostility write; secret-letter Let pass no direct relationship effect.
- Released-captive extension: restores or safely redirects sender service after capture→free; renders route home, no delivery and no cargo refund; home lost/owner extinct/no valid path handled explicitly; save/load midway; no multiple active journeys.
- Mounted UI: sender name plus directed hostility/alliance at interception and captive panel; 568×270/640×360 wrapping/clipping; Free followed by moving map sprite on each reverse segment and correct orientation; buttons' consequences match engine metadata.
- Audio: moving outbound and return segments use native11; stationary/intercepted/proposal/hidden/muted pages stop it; no duplicate loop; native10 opening/14 completion/7 captive cues in the actual mounted controller paths.
- Pending: effect15 original calling context needs dynamic original command coverage or original manual/gameplay capture; PC speaker fallback needs PIT/speaker trace capture and renderer, with native port instruction witness. Do not mislabel these fully adopted.

## V53 follow-up: authentic allied hostile-mission exemption

84 further native witnesses execute11302 and its actual owner lookup/clamp, including32 complete imprisonment branches. For allied imprisonment, Recruit/Wolf/Betrayal/Forged destination-owner==interceptor or Joint attack-target-owner==interceptor exempts trust−5 and raises interceptor→sender hostility3; sender→interceptor still rises8. Nonallied never calls the predicate and rises10 with no reverse/trust change. Native mode8 is covert-agent recall/verification and has no current equivalent; its forced-exposure flag is not initial infiltration. Ordinary alliance/marriage/gift/threat and rival/infiltration do not qualify. `tools/verify-native-messenger-exemption-v53.py ORIGINAL_MAIN_EXE OUTPUT_JSON` reproduces the native evidence; source/data changes do not run training.
