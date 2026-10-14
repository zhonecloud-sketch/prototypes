# A Tale of the Three Kingdoms

ATTK is an independent sibling of the v56 RTK2 project.

Run `start-game.bat` on Windows, `start-game.command` on macOS, or
`sh start-game.sh` on Linux. The compiled Rust server opens the browser
at `http://127.0.0.1:8765/index.html`.

[Installation and removal](docs/installation.md) covers prebuilt packages,
source builds, iOS/Android testing and every installed dependency.
[Test specification](docs/attk-test-spec.md) records automated coverage.

The combat arithmetic uses compiled Rust WebAssembly. The campaign,
AI scheduling, animations, saves, audio and compact GUI remain JavaScript.
This is an incremental Rust version, not a full game-engine rewrite.

A source checkout needs `build.bat` or `sh build.sh` once. A prebuilt
platform artifact needs no Rust installation. Direct `file://` loading
of index.html is unsupported; the launcher serves that file over HTTP.
