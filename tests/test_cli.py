from __future__ import annotations

import io
import json
import unittest
from contextlib import redirect_stdout

from trace_cli.cli import build_status, main, status_to_text


class TraceCliTests(unittest.TestCase):
    def test_build_status_has_required_fields(self) -> None:
        status = build_status()
        self.assertIn("project", status)
        self.assertIn("message", status)
        self.assertIn("timestamp", status)
        self.assertEqual(status["project"], "Litchi")
        self.assertEqual(status["message"], "hello from litchi")

    def test_status_to_text_contains_core_lines(self) -> None:
        status = {
            "project": "Litchi",
            "message": "hello from litchi",
            "timestamp": "2026-02-10T00:00:00+00:00",
            "cwd": "/tmp",
            "git_branch": "main",
        }
        output = status_to_text(status)
        self.assertIn("project: Litchi", output)
        self.assertIn("message: hello from litchi", output)

    def test_main_hello_json_outputs_valid_json(self) -> None:
        buffer = io.StringIO()
        with redirect_stdout(buffer):
            code = main(["hello", "--format", "json"])

        self.assertEqual(code, 0)
        payload = json.loads(buffer.getvalue())
        self.assertEqual(payload["project"], "Litchi")
        self.assertEqual(payload["message"], "hello from litchi")
        self.assertIn("timestamp", payload)


if __name__ == "__main__":
    unittest.main()

