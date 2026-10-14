#!/bin/sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
if ! command -v cargo >/dev/null 2>&1; then
 echo "Cargo is missing. See docs/installation.md." >&2
 exit 1
fi
CARGO_TARGET_DIR="$PWD/target"
export CARGO_TARGET_DIR
cargo build --locked --release -p attk-server
cargo build --locked --release -p attk-engine --target wasm32-unknown-unknown
mkdir -p bin wasm
cp target/release/attk-server bin/attk-server
cp target/wasm32-unknown-unknown/release/attk_engine.wasm wasm/attk_engine.wasm
chmod +x bin/attk-server
echo "Build complete. Run sh start-game.sh."
