#!/bin/sh
exec sh "$(dirname -- "$0")/start-game.sh" --lan "$@"
