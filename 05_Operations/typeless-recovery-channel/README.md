# Typeless Recovery Channel

Purpose: preserve and recover Litch's Typeless dictation history as a private, timestamped source layer for Root/Codex continuation.

This folder documents the recovery channel only. It must not contain raw Typeless transcript exports, audio files, personal chat bodies, or live app databases.

## Files

- `OFFICE_CO_TEACHER_TYPELESS_RECOVERY.md`: instructions for the Co-teacher running on the office computer.
- `HANDOVER.md`: durable handover for future Root/Codex sessions.
- `CASE_2026-06-15_HOME_MACHINE.md`: what happened on the home machine and what was verified.
- `COMMANDS.md`: reusable read-only commands for forensic backup and chronological-layer generation.

## Current Proven Path

1. Freeze Typeless retention settings before touching files.
2. Locate the app bundle id and local data folders.
3. Copy candidate files into `~/RootMemory/typeless_forensic_<timestamp>`.
4. Hash copied files and verify the copied database against the original.
5. Analyze schema only on the backup copy.
6. Generate chronological text layers from the backup copy.
7. Keep raw recovered artifacts outside git unless Litch explicitly approves a private storage route.

## Privacy Rule

Repo-safe: recovery method, schema notes, counts, checksums, path templates, and handover instructions.

Not repo-safe: raw `refined_text`, full JSONL exports, `.ogg` recordings, cookies, local browser stores, app databases, private chat bodies, credentials, or personal media.

