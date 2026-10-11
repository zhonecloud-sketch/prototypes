# RTK2 maintenance handoff

Start with [the workspace guide](workspace-guide.md) and [the beginner AI editing guide](ai-editing-guide.md). The root README identifies the single editable checkout. Release archives and installed dependencies are reproducible outputs, not the source of truth.

Use the current Sites source repository, not a stale download, when starting another chat. Runtime release identity is in config/release.json; the pack includes SOURCE-COMMIT.txt. A fresh chat is a useful organisational choice, but the diagnosed v36 problems were code regressions, not evidence that context overflow caused them.

Events: mjs/event-chronicle.mjs owns filtering/current reporting windows; Game.record and Game.endMonth in mjs/strategy.mjs own attribution and rollover snapshots. s.log is the short playback queue; currentReports and lastRoundEvents are the review data. Do not derive current events solely from s.log or remove the last completed AI round before human review.

Courier: mjs/campaign-decisions.mjs owns outbound/return phases and detention. The map projects journeyMotion in mjs/raster-world.mjs; mjs/audio.mjs receives movement-only sound state from app.mjs. Opening/freeing a courier dialog is not a movement.

Treasures: mjs/campaign-completion.mjs applies native recipient/stat gains. View rows are built in mjs/province-ui.mjs and possessions in app.mjs. Do not apply the stored stat bonus twice on load.

Before publication run npm test and npm run test:ui from dist/rtk2. The v38 cases cover the reported regressions. Native byte evidence can be reproduced with the supplied original files using tools/verify-original.py and tools/verify-native-treasures.py. Optional native arithmetic needs Unicorn. Emulated UI tests do not replace physical handset or audible checks.

Use the Sites workflow helper to synchronise the tested commit and produce the deployment archive. Then run tools/package-source.py after the commit; it checks active artwork hashes and all 41 terrain guides. Preserve the Site identity and access configuration.
