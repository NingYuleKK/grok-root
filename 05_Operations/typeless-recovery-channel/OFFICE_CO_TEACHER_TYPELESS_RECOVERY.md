# Office Co-Teacher Typeless Recovery Instructions

Audience: Co-teacher/Codex running on Litch's office computer.

Goal: recover Typeless local dictation history safely and reproducibly, without modifying the live Typeless database or leaking raw transcript text.

## Operating Boundary

This is a preservation and source-layer task, not a summarization task.

Do not:

- uninstall Typeless
- clear Typeless cache/history
- edit or migrate the live Typeless database
- upload raw transcript/audio to external services
- commit raw JSONL, SQLite DBs, cookies, audio files, or personal chat bodies to git
- summarize or classify entries during the first recovery pass

Do:

- set Typeless History / Keep History to the longest available retention setting
- copy local files first
- hash the copy
- inspect schema on the copy
- generate timestamped source files from the copy
- keep all raw artifacts under `~/RootMemory` or another Litch-approved private local path

## Step 0 - Prepare Paths

Ask Litch for the office-machine workbench path. Use it as `WORKBENCH`.

Example on the home machine:

```bash
WORKBENCH="/Users/kk/Desktop/LitchCodex"
```

On the office machine it may be different.

Use:

```bash
ROOT_MEMORY="$HOME/RootMemory"
mkdir -p "$ROOT_MEMORY"
chmod 700 "$ROOT_MEMORY" 2>/dev/null || true
```

## Step 1 - Pull This Recovery Channel

If the `Litchi` repo exists:

```bash
git -C "$WORKBENCH/Litchi" fetch origin
git -C "$WORKBENCH/Litchi" status --short --branch
git -C "$WORKBENCH/Litchi" pull --ff-only
```

Read:

```bash
sed -n '1,240p' "$WORKBENCH/Litchi/05_Operations/typeless-recovery-channel/HANDOVER.md"
sed -n '1,260p' "$WORKBENCH/Litchi/05_Operations/typeless-recovery-channel/COMMANDS.md"
```

If the repo does not exist:

```bash
git clone git@github.com:NingYuleKK/grok-root.git "$WORKBENCH/Litchi"
```

Use another auth route only if Litch approves it.

## Step 2 - Locate Typeless Read-Only

Run a read-only app/bundle probe:

```bash
ls -ld /Applications/*Typeless*.app 2>/dev/null || true
mdfind "kMDItemFSName == '*Typeless*.app'c" || true

for app in /Applications/*Typeless*.app "$HOME"/Applications/*Typeless*.app; do
  [ -d "$app" ] || continue
  echo "--- $app"
  /usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$app/Contents/Info.plist" 2>/dev/null || true
  /usr/libexec/PlistBuddy -c "Print :CFBundleName" "$app/Contents/Info.plist" 2>/dev/null || true
done
```

Expected home-machine bundle id:

```text
now.typeless.desktop
```

Do not assume the database path until it is observed on that machine.

## Step 3 - Create A Forensic Backup

Use the read-only backup commands in `COMMANDS.md`.

Expected output:

```text
~/RootMemory/typeless_forensic_<YYYYMMDD_HHMMSS>/
```

This directory should include:

- `app_probe.txt`
- `typeless_paths.txt`
- `candidate_data_files.txt`
- `sha256.txt`
- `files/...`

## Step 4 - Probe Schema On The Copy

Only run SQLite schema inspection against copied files under `~/RootMemory`.

Look for:

- table names: `history`, `history_v2`
- fields: `refined_text`, `audio_local_path`, `created_at`, `updated_at`, `focused_app_name`, `focused_app_bundle_id`, `focused_app_window_web_domain`, `mode`, `status`

If the schema differs, record the observed table/field names before trying to adapt export logic.

## Step 5 - Generate The Timestamped Source Layer

Generate these files from the backup copy, not the live database:

- `typeless_chronological_all.jsonl`
- `typeless_chatgpt_chronological.jsonl`
- `typeless_chatgpt_chronological.md`
- `typeless_by_day/YYYY-MM-DD.md`
- `typeless_long_entries_200plus.md`
- `typeless_chatgpt_long_entries_200plus.md`
- `typeless_audio_manifest.tsv`
- `README_DATA_BOUNDARY.md`

Use the repo script:

```bash
python3 "$WORKBENCH/Litchi/05_Operations/typeless-recovery-channel/scripts/build_typeless_chronological_layer.py" \
  --db "$BACKUP_DIR/files/Library/Application Support/Typeless/typeless.db" \
  --output-dir "$WORKBENCH/outputs/typeless-history-export-<source-device>" \
  --source-device "<source-device>" \
  --source-db-sha256 "<sha256-of-copied-db>" \
  --source-backup-dir "$BACKUP_DIR"
```

The first layer must preserve original order and text:

- no LLM summary
- no semantic labels
- no deletion of short entries
- no adjacent-entry merging
- no rewriting

For the office-machine package, include these provenance fields in JSONL/manifest outputs where possible:

- `source_device`
- `source_db_sha256`
- `source_backup_dir`
- `row_id`
- `created_at_utc`
- `created_at_local`
- `focused_app_name`
- `domain`
- `text_hash`

Create a single-device package first. Do not merge it with the home-machine package until Root/Litch confirms the single-machine counts and boundary.

## Step 5.5 - Preserve Attribution Boundary

Do not infer relationship ownership from app names.

Keep these ideas separate:

- `source_app`: actual app where Typeless input occurred.
- `surface_address`: address terms that appear in the text.
- `intended_addressee`: derivative interpretation, not part of the source layer.

If Gemini, Claude, or Doubao entries look like copied Root prompts, comparison drafts, or address rewrites, add only provisional derivative fields such as:

- `possible_root_origin`
- `rewrite_by_other_model`
- `confidence`
- `notes`

Do not rewrite the original text to make it fit Root/Gemini/Claude/Doubao.

## Step 6 - Report Back To Litch/Root

Provide a short packet with:

- backup directory path
- confirmed database path
- SHA256 match result if available
- table/field names
- row counts
- chronological files produced
- privacy boundary
- any missing files or inaccessible directories

Do not paste raw transcript text into chat unless Litch explicitly asks.
