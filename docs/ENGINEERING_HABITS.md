# Engineering Habits

Last Updated: 2026-02-09
Owner: litch

## Core Principles
- Use GitHub as the single source of truth.
- Keep project memory in markdown, not in chat history.
- Prefer small, reversible, testable changes.
- Treat documentation update as part of delivery, not afterthought.

## Cross-Device Workflow
1. Start work: `git pull`
2. Implement one focused task
3. Update project memory/docs
4. End work: `git add` -> `git commit` -> `git push`

## Task-Level Habits
1. Write 3 acceptance criteria before coding.
2. One requirement maps to one Issue.
3. One Issue maps to one branch (`codex/*`).
4. Merge through PR with review and test evidence.

## Documentation Habits
- `MEMORY.md`: update at the end of every task (Now/Decisions/TODO).
- `AGENTS.md`: update when collaboration rules change.
- `README.md`: update when run/build/usage changes.
- `docs/DECISIONS.md`: record key technical decisions and tradeoffs.

## Weekly Cadence
- Do one weekly review to capture:
  - irreversible learning
  - high-cost-to-reverse decisions
  - top 5 lines needed if context is lost next week

## Trigger Phrases For Codex
- "任务结束后按 AGENTS 规则更新 MEMORY.md。"
- "按流程做一次文档同步。"
- "做本周工程习惯回顾并更新 docs。"

