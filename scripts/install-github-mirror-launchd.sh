#!/usr/bin/env bash
set -euo pipefail

# Install a daily launchd job for github-mirror-sync.sh.
# Default schedule: every day 09:00 local time.

HOUR="9"
MINUTE="0"
BASE_DIR="$HOME/.codex/github-mirror"
ACCOUNT=""
INCLUDE_ORGS="true"
SYNC_WIKIS="true"
LABEL="com.litch.github-mirror-sync"
PLIST_PATH="$HOME/Library/LaunchAgents/${LABEL}.plist"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_SYNC_SCRIPT="$SCRIPT_DIR/github-mirror-sync.sh"
INSTALL_BIN_DIR="$HOME/.codex/bin"
SYNC_SCRIPT="$INSTALL_BIN_DIR/github-mirror-sync.sh"

usage() {
  cat <<'EOF'
Usage:
  install-github-mirror-launchd.sh [options]

Options:
  --hour <0-23>         Run hour (default: 9)
  --minute <0-59>       Run minute (default: 0)
  --base <path>         Mirror base dir (default: ~/.codex/github-mirror)
  --account <login>     GitHub login (default: current gh auth user at runtime)
  --include-orgs <bool> true/false (default: true)
  --sync-wikis <bool>   true/false (default: true)
  -h, --help            Show help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --hour)
      HOUR="$2"
      shift 2
      ;;
    --minute)
      MINUTE="$2"
      shift 2
      ;;
    --base)
      BASE_DIR="$2"
      shift 2
      ;;
    --account)
      ACCOUNT="$2"
      shift 2
      ;;
    --include-orgs)
      INCLUDE_ORGS="$2"
      shift 2
      ;;
    --sync-wikis)
      SYNC_WIKIS="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ! -x "$SOURCE_SYNC_SCRIPT" ]]; then
  echo "Error: source sync script not executable: $SOURCE_SYNC_SCRIPT" >&2
  exit 1
fi

if [[ ! "$HOUR" =~ ^[0-9]+$ ]] || [[ "$HOUR" -lt 0 ]] || [[ "$HOUR" -gt 23 ]]; then
  echo "Error: --hour must be 0..23" >&2
  exit 1
fi

if [[ ! "$MINUTE" =~ ^[0-9]+$ ]] || [[ "$MINUTE" -lt 0 ]] || [[ "$MINUTE" -gt 59 ]]; then
  echo "Error: --minute must be 0..59" >&2
  exit 1
fi

mkdir -p "$HOME/Library/LaunchAgents"
mkdir -p "$INSTALL_BIN_DIR"
mkdir -p "$BASE_DIR/logs"

# Copy runtime script to a non-Desktop path so launchd can execute it without TCC Desktop restrictions.
cp "$SOURCE_SYNC_SCRIPT" "$SYNC_SCRIPT"
chmod +x "$SYNC_SCRIPT"

ARGS=( "$SYNC_SCRIPT" "--base" "$BASE_DIR" "--include-orgs" "$INCLUDE_ORGS" "--sync-wikis" "$SYNC_WIKIS" )
if [[ -n "$ACCOUNT" ]]; then
  ARGS+=( "--account" "$ACCOUNT" )
fi

SYNC_CMD="${ARGS[*]}"
STDOUT_LOG="$BASE_DIR/logs/${LABEL}.out.log"
STDERR_LOG="$BASE_DIR/logs/${LABEL}.err.log"

cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>-lc</string>
    <string>${SYNC_CMD}</string>
  </array>

  <key>RunAtLoad</key>
  <true/>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>${HOUR}</integer>
    <key>Minute</key>
    <integer>${MINUTE}</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>${STDOUT_LOG}</string>
  <key>StandardErrorPath</key>
  <string>${STDERR_LOG}</string>
</dict>
</plist>
EOF

# Reload service.
launchctl bootout "gui/$(id -u)/${LABEL}" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH"
launchctl enable "gui/$(id -u)/${LABEL}"
launchctl kickstart -k "gui/$(id -u)/${LABEL}" >/dev/null 2>&1 || true

echo "Installed daily sync job:"
echo "  label: $LABEL"
echo "  plist: $PLIST_PATH"
echo "  schedule: daily at $(printf '%02d:%02d' "$HOUR" "$MINUTE")"
echo "  stdout: $STDOUT_LOG"
echo "  stderr: $STDERR_LOG"
