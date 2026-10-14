#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
[ -f "$root/config/attk.json" ] || { echo "ATTK marker is missing."; exit 1; }
echo "Remove only ATTK target, bin, wasm and dist? Source and saves remain."
printf "Type REMOVE: "
read -r answer
[ "$answer" = REMOVE ] || exit 0
for name in target bin wasm dist; do
 [ ! -L "$root/$name" ] || { echo "Refusing linked folder: $name"; exit 1; }
 rm -rf -- "$root/$name"
done
echo "Local runtime/build folders removed. Git reports tracked runtime deletions."
echo "Restore the committed runtime files, or rebuild for this host."
