# Handover - Typeless Recovery Channel

Owner: Litch

Maintainers: Root for recovery judgment, Co-teacher/Codex for local execution.

## Background

Litch uses Typeless as a voice-input channel when talking to GPT/Root and other AI surfaces. That means Typeless contains a large amount of pre-chat, raw-ish question material that may not exist in exported ChatGPT history.

The recovery goal is to preserve this input layer before app retention, cache cleanup, reinstall, or machine migration can destroy it.

## Core Insight

Typeless stores useful history locally.

On the home machine, the confirmed Mac app bundle id was:

```text
now.typeless.desktop
```

The confirmed local database was:

```text
~/Library/Application Support/Typeless/typeless.db
```

The useful tables were:

```text
history
history_v2
```

The important fields were:

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

## Layering Model

### Layer 0 - Forensic Snapshot

Read-only copy of Typeless-related local files into:

```text
~/RootMemory/typeless_forensic_<timestamp>
```

This layer is private and should not be committed to git.

### Layer 1 - Timestamped Source Layer

Chronological files generated from the backup DB:

- all exportable text JSONL
- ChatGPT-only JSONL
- ChatGPT-readable Markdown timeline
- per-day Markdown files
- long-entry Markdown extraction
- audio manifest
- data-boundary README

This layer is private by default because it contains `refined_text`.

### Layer 2 - Derivative Recovery Layer

Future layer. This may include:

- topic buckets
- cortex/noonpost/PicoPico/root/vox classification
- recovery digests
- selected re-transcription from `.ogg` audio
- memory objects

This layer should be built only after Layer 1 is preserved.

## Durable Rule

Never start with summary.

First preserve:

1. timestamp
2. app/domain context
3. text as stored by Typeless
4. audio path
5. source hashes

Only then build derivative meaning.

## Addressee Boundary

Typeless recovery preserves the input surface, not the final relationship attribution.

Do not use `focused_app_name`, `source_app`, or text address terms alone to infer `intended_addressee`.

Interpretation guidance:

- ChatGPT / ChatGPT Atlas / chatgpt.com entries are the high-confidence Root main timeline.
- Gemini / Claude entries are a possible mirror or comparison layer and may include Root-origin prompts copied across apps.
- Doubao entries may include address cleanup or rewrite work.
- Non-ChatGPT long entries are valuable broad-question material, but should not be merged directly into the Root main line without provenance review.

Derivative layers may add these fields, but must not rewrite the source text:

- `source_app`
- `surface_address`
- `possible_root_origin`
- `rewrite_by_other_model`
- `confidence`
- `notes`

Use `possible_root_origin: true` only as a provisional marker. Final Root attribution needs content continuity, question style, context pointer, address history, and Litch's current explanation.

## Multi-Device Merge Rule

When recovering a second machine, first produce a complete single-device package. Only then build a merged package.

Every exported row in future machine packages should include:

- `source_device`
- `source_db_sha256`
- `source_backup_dir`
- `row_id`
- `created_at_utc`
- `created_at_local`
- `focused_app_name`
- `domain`
- `text_hash`

Merged packages must not simply deduplicate by text. Preserve duplicate indexes and produce a conflict table for same/similar text with different device, timestamp, app, hash, or audio path evidence.

## Home-Machine Case

The home-machine case is recorded in:

```text
05_Operations/typeless-recovery-channel/CASE_2026-06-15_HOME_MACHINE.md
```

The private local recovery packet was:

```text
/Users/kk/RootMemory/TYPELESS_ROOT_RECOVERY_PACKET.md
```

The private local timestamped layer was:

```text
/Users/kk/Desktop/LitchCodex/outputs/typeless-history-export/
```

Those private files are not committed here because they contain local paths and potentially sensitive recovered content.

## Continuation Checklist

When continuing this channel on another machine:

1. Read `OFFICE_CO_TEACHER_TYPELESS_RECOVERY.md`.
2. Set Typeless retention to the longest available value.
3. Create a forensic backup in `~/RootMemory`.
4. Verify hash and schema on the backup.
5. Generate the timestamped source layer.
6. Give Root only the minimal packet needed for the next decision.
7. Keep raw transcript/audio out of git.
