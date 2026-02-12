# Engineering Decisions

## 2026-02-09
- Adopt weekly shipping rhythm for 8 weeks.
- Standardize collaboration through `AGENTS.md`, issue template, and PR template.
- Keep workflow lightweight: small PRs, explicit acceptance criteria, minimal tests.

## 2026-02-10
- For Week 1 mini CLI, implement a Python command `trace hello` with text/json output.
- Use local command shim installation (`.local/bin/trace`) instead of pip package install, to stay reliable in restricted/sandboxed environments.
- Keep tests on Python stdlib `unittest` (3 core cases) to avoid extra dependency setup.
