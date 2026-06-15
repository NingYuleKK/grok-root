# Commands - Typeless Recovery Channel

These commands are templates for a local Mac recovery pass. They are designed to be read-only against the live Typeless data and to analyze only copied files.

Set this first:

```bash
ROOT_MEMORY="$HOME/RootMemory"
mkdir -p "$ROOT_MEMORY"
chmod 700 "$ROOT_MEMORY" 2>/dev/null || true
```

## 1. Forensic Backup

```bash
bash <<'BASH'
set -uo pipefail

BACKUP="$HOME/RootMemory/typeless_forensic_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP/files"
chmod 700 "$HOME/RootMemory" "$BACKUP" "$BACKUP/files" 2>/dev/null || true

{
  echo "== Typeless app bundle =="
  ls -ld /Applications/*Typeless*.app 2>/dev/null || true
  mdfind "kMDItemFSName == '*Typeless*.app'c" || true

  echo "== Bundle identifiers =="
  shopt -s nullglob
  apps=(/Applications/*Typeless*.app "$HOME"/Applications/*Typeless*.app)
  for app in "${apps[@]}"; do
    [ -d "$app" ] || continue
    echo "--- $app"
    /usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$app/Contents/Info.plist" 2>/dev/null || true
    /usr/libexec/PlistBuddy -c "Print :CFBundleName" "$app/Contents/Info.plist" 2>/dev/null || true
  done
} | tee "$BACKUP/app_probe.txt"

find "$HOME/Library" \
  \( -iname "*typeless*" -o -iname "*simply*" \) \
  -print 2>/dev/null | tee "$BACKUP/typeless_paths.txt" >/dev/null || true

for root in "$HOME/Library/Application Support" "$HOME/Library/Containers" "$HOME/Library/Group Containers" "$HOME/Library/Caches" "$HOME/Library/WebKit"; do
  [ -d "$root" ] || continue
  find "$root" \
    \( -iname "*.sqlite" -o -iname "*.sqlite3" -o -iname "*.db" -o -iname "*.json" -o -iname "*.log" -o -iname "*.ldb" -o -iname "CURRENT" -o -iname "MANIFEST*" \) \
    -print 2>/dev/null || true
done | grep -iE "typeless|simply|voice|dictat|transcri" | tee "$BACKUP/candidate_data_files.txt" >/dev/null || true

while IFS= read -r f; do
  [ -e "$f" ] || continue
  dest="$BACKUP/files/${f#$HOME/}"
  mkdir -p "$(dirname "$dest")"
  cp -a "$f" "$dest" 2>/dev/null || true
done < "$BACKUP/candidate_data_files.txt"

find "$BACKUP/files" -type f -print0 2>/dev/null | xargs -0 shasum -a 256 > "$BACKUP/sha256.txt" || true

printf 'Backup at: %s\n' "$BACKUP"
printf 'Path count: '; wc -l < "$BACKUP/typeless_paths.txt"
printf 'Candidate file count: '; wc -l < "$BACKUP/candidate_data_files.txt"
printf 'Copied file count: '; find "$BACKUP/files" -type f 2>/dev/null | wc -l
printf 'Backup size: '; du -sh "$BACKUP" | awk '{print $1}'
BASH
```

## 2. SQLite Schema Probe On Backup

Replace `BACKUP_DIR` with the directory printed above.

```bash
BACKUP_DIR="$HOME/RootMemory/typeless_forensic_REPLACE_ME"

find "$BACKUP_DIR/files" -type f \( -iname "*.sqlite" -o -iname "*.sqlite3" -o -iname "*.db" \) -print | while read -r db; do
  echo "===== $db ====="
  sqlite3 "$db" ".tables" 2>/dev/null || true
  sqlite3 "$db" "SELECT name, sql FROM sqlite_master WHERE type='table';" 2>/dev/null | head -200 || true
done > "$BACKUP_DIR/sqlite_schema_probe.txt"

rg -i "history|transcript|dictation|text|content|created_at|updated_at|app|window|context|prompt|result" \
  "$BACKUP_DIR/sqlite_schema_probe.txt" || true
```

## 3. Verify Primary DB Hash

After identifying the copied `typeless.db`:

```bash
ORIGINAL_DB="$HOME/Library/Application Support/Typeless/typeless.db"
BACKUP_DB="$BACKUP_DIR/files/Library/Application Support/Typeless/typeless.db"

shasum -a 256 "$ORIGINAL_DB" "$BACKUP_DB"
```

The hashes should match if the live database did not change during copying.

## 4. Export Timestamped Layer

Use the repo script, but keep outputs outside git:

```bash
python3 "$WORKBENCH/Litchi/05_Operations/typeless-recovery-channel/scripts/build_typeless_chronological_layer.py" \
  --db "$BACKUP_DIR/files/Library/Application Support/Typeless/typeless.db" \
  --output-dir "$WORKBENCH/outputs/typeless-history-export-<source-device>" \
  --source-device "<source-device>" \
  --source-db-sha256 "<sha256-of-copied-db>" \
  --source-backup-dir "$BACKUP_DIR"
```

Expected output set:

- `typeless_chronological_all.jsonl`
- `typeless_chatgpt_chronological.jsonl`
- `typeless_chatgpt_chronological.md`
- `typeless_by_day/YYYY-MM-DD.md`
- `typeless_long_entries_200plus.md`
- `typeless_chatgpt_long_entries_200plus.md`
- `typeless_audio_manifest.tsv`
- `README_DATA_BOUNDARY.md`

If adapting manually, preserve these rules:

- query from backup DB only
- order by `created_at ASC`
- keep short entries
- do not merge adjacent rows
- do not summarize
- include `audio_local_path`
- include both UTC and local timestamps in Markdown

For multi-device recovery, add these fields to JSONL/manifest outputs before merging:

- `source_device`
- `source_db_sha256`
- `source_backup_dir`
- `row_id`
- `created_at_utc`
- `created_at_local`
- `focused_app_name`
- `domain`
- `text_hash`

Do not deduplicate merged packages by text alone. Preserve duplicate indexes and produce a conflict table for duplicate/similar text across devices.

## 5. Attribution Boundary For Derivative Layers

Use app context as provenance, not as relationship truth.

Recommended derivative fields:

- `source_app`: actual app where Typeless input occurred.
- `surface_address`: address terms present in the text.
- `possible_root_origin`: `true` only when the item may have originated as a Root prompt copied into another app.
- `rewrite_by_other_model`: `true` only when another model/app appears to have changed address terms.
- `confidence`: `low`, `medium`, or `high`.
- `notes`: concise provenance note.

Do not rewrite original text. Do not set `intended_addressee` from `focused_app_name` alone.
