#!/usr/bin/env bash
set -euo pipefail

echo "[all] running build -> lint -> test"
"$(dirname "$0")/build.sh"
"$(dirname "$0")/lint.sh"
"$(dirname "$0")/test.sh"
echo "[all] done"
