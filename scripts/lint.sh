#!/usr/bin/env bash
set -euo pipefail

echo "[lint] running syntax checks"
python3 -c "import ast, pathlib; [ast.parse(p.read_text(encoding='utf-8')) for p in pathlib.Path('src').rglob('*.py')]; [ast.parse(p.read_text(encoding='utf-8')) for p in pathlib.Path('tests').rglob('*.py')]; print('syntax ok')"
echo "[lint] done"
