#!/usr/bin/env python3
"""Build a timestamped Typeless source layer from a forensic backup DB.

The script does not summarize, classify, merge, deduplicate, or rewrite source
text. It preserves per-row provenance for single-device and later merged
packages.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import sqlite3
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo


CHATGPT_APP_NAMES = {"ChatGPT", "ChatGPT Atlas"}
CHATGPT_BUNDLE_IDS = {"com.openai.chat", "com.openai.atlas"}
CHATGPT_DOMAINS = {"chatgpt.com"}


JSON_FIELDS = [
    "source_device",
    "source_db_sha256",
    "source_backup_dir",
    "row_id",
    "id",
    "text_hash",
    "text_sha256",
    "record_sha256",
    "created_at_utc",
    "created_at_local",
    "created_at",
    "updated_at",
    "focused_app_name",
    "domain",
    "focused_app_bundle_id",
    "focused_app_window_web_domain",
    "mode",
    "status",
    "audio_local_path",
    "refined_text",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", required=True, type=Path, help="Copied Typeless SQLite DB, never the live DB.")
    parser.add_argument("--output-dir", required=True, type=Path, help="Private output directory.")
    parser.add_argument("--source-device", required=True, help="Stable device label, e.g. home-mac-2026-06-15.")
    parser.add_argument("--source-db-sha256", required=True, help="SHA256 of copied source DB.")
    parser.add_argument("--source-backup-dir", required=True, help="Forensic backup directory path.")
    parser.add_argument("--timezone", default="America/Los_Angeles", help="Local timezone for Markdown grouping.")
    return parser.parse_args()


def parse_utc(value: str) -> datetime:
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def is_chatgpt(row: dict[str, str | None]) -> bool:
    return (
        (row.get("focused_app_name") in CHATGPT_APP_NAMES)
        or (row.get("focused_app_bundle_id") in CHATGPT_BUNDLE_IDS)
        or (row.get("focused_app_window_web_domain") in CHATGPT_DOMAINS)
    )


def app_label(row: dict[str, str | None]) -> str:
    app = row.get("focused_app_name") or ""
    domain = row.get("focused_app_window_web_domain") or ""
    if app and domain:
        return f"{app} / {domain}"
    return app or domain or "unknown"


def load_rows(args: argparse.Namespace, local_tz: ZoneInfo) -> list[dict[str, str | None]]:
    conn = sqlite3.connect(f"file:{args.db}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    query = """
        SELECT
            v.id,
            v.created_at,
            v.updated_at,
            h.focused_app_name,
            h.focused_app_bundle_id,
            h.focused_app_window_web_domain,
            v.mode,
            v.status,
            v.audio_local_path,
            v.refined_text
        FROM history_v2 v
        LEFT JOIN history h ON h.id = v.id
        WHERE v.refined_text IS NOT NULL
          AND trim(v.refined_text) != ''
        ORDER BY v.created_at ASC, v.id ASC
    """
    rows: list[dict[str, str | None]] = []
    for item in conn.execute(query):
        row = dict(item)
        text = row.get("refined_text") or ""
        created_at = row.get("created_at") or ""
        created_utc = parse_utc(created_at)
        text_hash = sha256_text(text)
        record_sha = sha256_text(
            json.dumps(
                {
                    "source_device": args.source_device,
                    "row_id": row.get("id"),
                    "created_at_utc": created_at,
                    "audio_local_path": row.get("audio_local_path"),
                    "refined_text": text,
                },
                ensure_ascii=False,
                sort_keys=True,
                separators=(",", ":"),
            )
        )
        row.update(
            {
                "source_device": args.source_device,
                "source_db_sha256": args.source_db_sha256,
                "source_backup_dir": args.source_backup_dir,
                "row_id": row.get("id"),
                "text_hash": text_hash,
                "text_sha256": text_hash,
                "record_sha256": record_sha,
                "created_at_utc": created_at,
                "created_at_local": created_utc.astimezone(local_tz).isoformat(timespec="seconds"),
                "domain": row.get("focused_app_window_web_domain"),
            }
        )
        rows.append(row)
    return rows


def local_day(row: dict[str, str | None]) -> str:
    return (row.get("created_at_local") or "")[:10]


def json_projection(row: dict[str, str | None]) -> dict[str, str | None]:
    return {field: row.get(field) for field in JSON_FIELDS}


def write_jsonl(path: Path, rows: list[dict[str, str | None]]) -> None:
    with path.open("w", encoding="utf-8") as fh:
        for row in rows:
            fh.write(json.dumps(json_projection(row), ensure_ascii=False) + "\n")


def write_md(path: Path, rows: list[dict[str, str | None]], title: str, source_note: str) -> None:
    with path.open("w", encoding="utf-8") as fh:
        fh.write(f"# {title}\n\n")
        fh.write(source_note.rstrip() + "\n\n")
        current_day = None
        for row in rows:
            day = local_day(row)
            if day != current_day:
                current_day = day
                fh.write(f"\n# {day}\n\n")
            fh.write(
                f"[{row.get('created_at_utc')} / {row.get('created_at_local')}] "
                f"[{app_label(row)}] [row_id: {row.get('row_id')}] [text_hash: {row.get('text_hash')}]\n"
            )
            fh.write((row.get("refined_text") or "").rstrip() + "\n\n")


def write_by_day(output_dir: Path, rows: list[dict[str, str | None]]) -> None:
    by_day_dir = output_dir / "typeless_by_day"
    if by_day_dir.exists():
        shutil.rmtree(by_day_dir)
    by_day_dir.mkdir(parents=True, exist_ok=True)
    grouped: dict[str, list[dict[str, str | None]]] = defaultdict(list)
    for row in rows:
        grouped[local_day(row)].append(row)
    for day, day_rows in sorted(grouped.items()):
        write_md(
            by_day_dir / f"{day}.md",
            day_rows,
            f"Typeless ChatGPT Chronological - {day}",
            "Boundary: ChatGPT / ChatGPT Atlas / chatgpt.com only. No summary or rewrite.",
        )


def write_audio_manifest(path: Path, rows: list[dict[str, str | None]]) -> None:
    fields = [
        "source_device",
        "source_db_sha256",
        "source_backup_dir",
        "row_id",
        "text_hash",
        "created_at_utc",
        "created_at_local",
        "is_chatgpt",
        "source_app",
        "domain",
        "mode",
        "status",
        "audio_local_path",
    ]
    with path.open("w", encoding="utf-8") as fh:
        fh.write("\t".join(fields) + "\n")
        for row in rows:
            values = {
                **row,
                "is_chatgpt": "true" if is_chatgpt(row) else "false",
                "source_app": row.get("focused_app_name") or "",
            }
            fh.write("\t".join(str(values.get(field) or "") for field in fields) + "\n")


def write_boundary_readme(path: Path, args: argparse.Namespace, rows: list[dict[str, str | None]], chatgpt_rows: list[dict[str, str | None]]) -> None:
    global_long = [row for row in rows if len(row.get("refined_text") or "") >= 200]
    chatgpt_long = [row for row in chatgpt_rows if len(row.get("refined_text") or "") >= 200]
    with path.open("w", encoding="utf-8") as fh:
        fh.write("# README Data Boundary\n\n")
        fh.write("This folder contains a timestamped Typeless source layer generated from a forensic backup copy, not from the live Typeless database.\n\n")
        fh.write(f"- Source device: `{args.source_device}`\n")
        fh.write(f"- Source DB: `{args.db}`\n")
        fh.write(f"- Source DB SHA256: `{args.source_db_sha256}`\n")
        fh.write(f"- Source backup dir: `{args.source_backup_dir}`\n\n")
        fh.write("## Boundary\n\n")
        fh.write("`refined_text` is Typeless polished dictation output. It is not guaranteed to be verbatim raw speech.\n\n")
        fh.write("The original voice material should be recovered later, if needed, by re-transcribing the local `.ogg` files referenced in `audio_local_path`.\n\n")
        fh.write("This layer does not perform LLM summarization, theme labeling, semantic rewriting, deduplication, or adjacent-entry merging.\n\n")
        fh.write("Typeless recovery preserves source surface, not final relationship attribution. Do not infer `intended_addressee` from app name alone.\n\n")
        fh.write("## Row Counts\n\n")
        fh.write(f"- All exportable text rows: {len(rows)}\n")
        fh.write(f"- ChatGPT / ChatGPT Atlas / chatgpt.com rows: {len(chatgpt_rows)}\n")
        fh.write(f"- Global long entries with `len(refined_text) >= 200`: {len(global_long)}\n")
        fh.write(f"- ChatGPT-only long entries with `len(refined_text) >= 200`: {len(chatgpt_long)}\n")
        fh.write(f"- Audio manifest rows: {len(rows)}\n\n")
        fh.write("## Long Entry Files\n\n")
        fh.write("- `typeless_long_entries_200plus.md` is global and may include non-ChatGPT sources.\n")
        fh.write("- `typeless_chatgpt_long_entries_200plus.md` is the high-confidence ChatGPT / ChatGPT Atlas / chatgpt.com subset.\n")


def main() -> None:
    args = parse_args()
    if not args.db.exists():
        raise FileNotFoundError(args.db)
    actual_sha = file_sha256(args.db)
    if actual_sha != args.source_db_sha256:
        raise ValueError(f"source DB sha mismatch: expected {args.source_db_sha256}, got {actual_sha}")

    local_tz = ZoneInfo(args.timezone)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    rows = load_rows(args, local_tz)
    chatgpt_rows = [row for row in rows if is_chatgpt(row)]
    global_long = [row for row in rows if len(row.get("refined_text") or "") >= 200]
    chatgpt_long = [row for row in chatgpt_rows if len(row.get("refined_text") or "") >= 200]

    write_jsonl(args.output_dir / "typeless_chronological_all.jsonl", rows)
    write_jsonl(args.output_dir / "typeless_chatgpt_chronological.jsonl", chatgpt_rows)
    write_md(
        args.output_dir / "typeless_chatgpt_chronological.md",
        chatgpt_rows,
        "Typeless ChatGPT Chronological",
        "Boundary: ChatGPT / ChatGPT Atlas / chatgpt.com only. No summary or rewrite.",
    )
    write_by_day(args.output_dir, chatgpt_rows)
    write_md(
        args.output_dir / "typeless_long_entries_200plus.md",
        global_long,
        "Typeless Global Long Entries 200 Plus",
        "Boundary: global long entries from all source apps. Not Root main-line only.",
    )
    write_md(
        args.output_dir / "typeless_chatgpt_long_entries_200plus.md",
        chatgpt_long,
        "Typeless ChatGPT Long Entries 200 Plus",
        "Boundary: ChatGPT / ChatGPT Atlas / chatgpt.com only. High-confidence Root main-timeline subset.",
    )
    write_audio_manifest(args.output_dir / "typeless_audio_manifest.tsv", rows)
    write_boundary_readme(args.output_dir / "README_DATA_BOUNDARY.md", args, rows, chatgpt_rows)

    print(f"all_rows={len(rows)}")
    print(f"chatgpt_rows={len(chatgpt_rows)}")
    print(f"global_long_rows_200plus={len(global_long)}")
    print(f"chatgpt_long_rows_200plus={len(chatgpt_long)}")
    print(f"by_day_files={len(list((args.output_dir / 'typeless_by_day').glob('*.md')))}")


if __name__ == "__main__":
    main()
