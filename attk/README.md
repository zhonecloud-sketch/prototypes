# A Tale of the Three Kingdoms

ATTK is an independent sibling of the v56 RTK2 project.

On Windows, a current Git checkout includes the compiled runtime. Run
`start-game.bat`; it starts the Rust server and opens the browser at
`http://127.0.0.1:8765/index.html`. Cargo is unnecessary for playing.

The tracked runtime files are `bin/attk-server.exe`,
`wasm/attk_engine.wasm` and `RUNTIME-INFO.json`. After Rust source changes,
validated builds refresh these files in main automatically. Provenance
records the build source commit, source fingerprint and binary hashes.

On macOS/Linux, install a matching prebuilt host server or build locally,
then run `start-game.command` or `sh start-game.sh`. The committed Windows
executable does not run natively on those operating systems.

[Installation and removal](docs/installation.md) covers both routes,
iOS/Android browser testing and all development dependencies.
[Test specification](docs/attk-test-spec.md) records automated coverage.

Combat arithmetic uses compiled Rust WebAssembly. The campaign,
AI scheduling, animations, saves, audio and compact GUI remain JavaScript.
This is an incremental Rust version, not a full game-engine rewrite.

Direct file loading of index.html is unsupported; use the HTTP launcher.
