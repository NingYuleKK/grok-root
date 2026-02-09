#!/usr/bin/env bash
set -euo pipefail

echo "[all] running lint -> test -> build"
"$(dirname "$0")/lint.sh"
"$(dirname "$0")/test.sh"
"$(dirname "$0")/build.sh"
echo "[all] done"

