#!/bin/sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
if [ ! -f bin/attk-server ] || [ ! -f wasm/attk_engine.wasm ]; then
 sh build.sh
fi
chmod +x bin/attk-server
exec ./bin/attk-server --root "$PWD" --open "$@"
