#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit 1
PORT="${1:-8080}"
echo "BINKSFILMS V2 → http://localhost:$PORT"
python3 -m http.server "$PORT"
