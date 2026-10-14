# RTK2 development and delivery

The canonical delivery repository is `https://github.com/zhonecloud-sketch/prototypes.git`; game changes belong in `rtk2/`. Use the existing sibling `lib/` runtime and preserve unrelated prototypes.

For routine fixes, inspect the relevant code, implement the smallest change, add a corresponding behavioral regression for every reported bug, run affected checks, commit and push to the repository. Broaden validation when shared mechanics or observed failures require it. Record exceptional missing tests and their proposed solutions in `pending-test-case-design.md`.

Do not create or upload a ZIP, or prepare Library transfer helpers, unless the user explicitly requests a downloadable export. Do not create a duplicate Sites release unless requested. Normal future delivery uses GitHub after the first push is confirmed.

Do not run or renew AI training without explicit user instruction. Preserve existing profile identities; incompatible profiles fall back to Legacy after rule changes.

Raw DOS references `fmdrv.com`, `grpdata.dat`, `hexdata.dat`, `koei.bat`, `packdata.dat`, `rtk2.com` and their numbered copies stay outside source and releases. Local dependencies, Python caches, transfer helpers and generated delivery archives are ignored. Keep tracked native evidence archives, media, provenance and useful regression suites.

`SOURCE-COMMIT.txt` records the imported game source. Git history records subsequent GitHub changes. The current imported release is v56, with its validation in `verification-v56.json` and notes in `changes.md#record-fixes-v56`.

[Beginner local and Rust setup](rust-development-setup.md) explains the
recommended GitHub-first development workflow, macOS/Windows installs,
real browser validation and optional WebAssembly/Tauri learning steps.
