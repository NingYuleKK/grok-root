#!/usr/bin/env bash
set -euo pipefail

echo "[test] running unit tests"
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=src python3 -m unittest discover -s tests -p 'test_*.py' -v
"$(dirname "$0")/blog-check.sh"
echo "[test] done"
