from __future__ import annotations

import argparse
import json
import os
import subprocess
from datetime import datetime, timezone


def current_git_branch() -> str:
    try:
        proc = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        )
        return proc.stdout.strip()
    except Exception:
        return "unknown"


def build_status() -> dict[str, str]:
    return {
        "project": "Litchi",
        "message": "hello from litchi",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "cwd": os.getcwd(),
        "git_branch": current_git_branch(),
    }


def status_to_text(status: dict[str, str]) -> str:
    return "\n".join(
        [
            f"project: {status['project']}",
            f"message: {status['message']}",
            f"timestamp: {status['timestamp']}",
            f"cwd: {status['cwd']}",
            f"git_branch: {status['git_branch']}",
        ]
    )


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="trace", description="Trace utility CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)
    hello = subparsers.add_parser("hello", help="Print project status")
    hello.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        help="Output format",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = make_parser()
    args = parser.parse_args(argv)
    status = build_status()

    if args.command == "hello":
        if args.format == "json":
            print(json.dumps(status, ensure_ascii=True))
        else:
            print(status_to_text(status))
        return 0

    parser.error("unknown command")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())

