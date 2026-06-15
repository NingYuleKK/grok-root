# Case - 2026-06-15 Home Machine Typeless Recovery

Machine context:

```text
/Users/kk/Desktop/LitchCodex
```

This file records results only. It intentionally excludes raw transcript text.

## What Triggered The Recovery

Litch identified Typeless as an additional voice-input channel for talking to GPT/Root. Root recommended treating Typeless as a local black-box recovery target because public docs indicate history is stored on-device, and retention settings may control how long local transcripts remain visible.

The recovery objective was to preserve local Typeless history before any cleanup, reinstall, cache clear, or retention rollover.

## What Was Confirmed

Typeless app:

```text
/Applications/Typeless.app
```

Bundle id:

```text
now.typeless.desktop
```

Primary local data directory:

```text
~/Library/Application Support/Typeless
```

Primary database:

```text
~/Library/Application Support/Typeless/typeless.db
```

Forensic backup:

```text
/Users/kk/RootMemory/typeless_forensic_20260615_092034
```

Backup database:

```text
/Users/kk/RootMemory/typeless_forensic_20260615_092034/files/Library/Application Support/Typeless/typeless.db
```

## Integrity Result

Original DB SHA256 and backup DB SHA256 matched:

```text
d320847328dd72bcbead0edac6eb8b619224d99ec10ee1eb2e0b27f0c82c46bb
```

Snapshot counts:

- Typeless-related path count: 25
- Candidate data file count: 120
- Copied/hash file count: 116
- Missing/un-copied candidate count: 3

The 3 missing copies were app framework `Versions/Current` pointers, not history data.

## Schema Result

Confirmed tables:

```text
history
history_v2
__drizzle_migrations
```

Important fields:

```text
refined_text
audio_local_path
created_at
updated_at
focused_app_name
focused_app_bundle_id
focused_app_window_web_domain
mode
status
```

Retention setting observed in copied settings:

```text
historyDurationSeconds: -1
```

This appears to be the longest/no-time-limit retention setting.

## Timestamped Source Layer Result

Private output directory:

```text
/Users/kk/Desktop/LitchCodex/outputs/typeless-history-export
```

Generated files:

- `typeless_chronological_all.jsonl`
- `typeless_chatgpt_chronological.jsonl`
- `typeless_chatgpt_chronological.md`
- `typeless_by_day/YYYY-MM-DD.md`
- `typeless_long_entries_200plus.md`
- `typeless_audio_manifest.tsv`
- `README_DATA_BOUNDARY.md`

Validation:

- All exportable text rows: 1886
- ChatGPT / ChatGPT Atlas / chatgpt.com rows: 1127
- Long entries with `len(refined_text) >= 200`: 203
- Day files: 49
- JSONL files parsed successfully.
- JSONL files were sorted by `created_at`.
- New ChatGPT chronological JSONL had the same 1127 IDs as the earlier ChatGPT-focused export.

## Data Boundary

`refined_text` is Typeless polished dictation output, not guaranteed verbatim raw speech.

Raw speech can be recovered later by re-transcribing the local `.ogg` files referenced by `audio_local_path`.

No raw transcript text, audio, cookies, app database, or personal chat body is committed into this repo.

## Outcome

The Typeless recovery channel is now proven on one Mac and documented for reuse on the office computer or future machines.

The next meaningful derivative layer is a Root/Cortex recovery pass over the private chronological files, not further probing of the live Typeless app.

