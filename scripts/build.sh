#!/usr/bin/env bash
set -euo pipefail

echo "[build] installing local trace command shim"
mkdir -p .local/bin
cat > .local/bin/trace <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PYTHONPATH="$REPO_ROOT/src" exec python3 -m trace_cli.cli "$@"
EOF
chmod +x .local/bin/trace
echo "[build] done"
