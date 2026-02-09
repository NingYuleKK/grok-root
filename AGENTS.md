# AGENTS.md

## Purpose
This repo is run with a "product brain + vibe coding" style, but engineering quality is mandatory.
Every change should stay small, testable, and shippable.

## Operating Tracks
- Delivery track: ship one runnable/publishable/demoable output each week.
- Learning track: focus on one core engineering concept per week.
- Habit track: always follow the same GitHub workflow:
  - Issue -> Branch -> PR -> Review -> Release

## Vibe Coding Guardrails
1. Write 3 acceptance criteria before coding.
2. Keep scope small; every commit should be reversible.
3. Add minimal tests for every feature (at least 3 sample cases).
4. Never commit secrets (`.env`, `.env.example`, `.gitignore` required).
5. Every PR must include a Codex review pass.
6. Ship once per week (release or deployment), even if tiny.

## Collaboration Rules For Agents
- Read `/Users/litch/Desktop/litchcodex/Litchi/MEMORY.md` before making changes.
- If requirements are unclear, propose a minimal version first and ship it.
- Prioritize working code and clear docs over abstract architecture.
- Avoid large refactors unless explicitly requested.
- Document key decisions in `docs/` and update `MEMORY.md`.
- At the end of every task, always update `MEMORY.md` (Now/Decisions/TODO) in the same change set.

## Definition of Done (Per Task)
- Acceptance criteria are explicitly checked in PR.
- Changes are runnable locally.
- Minimal tests are added or updated.
- README/docs are updated when behavior changes.
- Rollback plan is included for risky changes.

## Branch & PR Convention
- One issue per branch.
- Branch prefix: `codex/`.
- PR title format: `[type] short description`
  - `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
