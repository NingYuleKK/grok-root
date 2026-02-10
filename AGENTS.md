# Collaboration Contract (Root x Litch x Codex) - v1.0

## Mission
This repo prioritizes: predictable delivery, traceable decisions, and safe iteration.

## Hard Rules (non-negotiable)
1. Single source of truth: treat GitHub repo state as truth. Do not rely on chat/session memory.
2. Start by reading: before any work, read `MEMORY.md` and relevant docs in `/docs`.
3. One task = one branch: no mixed changes across unrelated issues.
4. No secrets: never commit `.env` or credentials. Only update `.env.example` when needed.
5. Close the loop: every task ends with updating `MEMORY.md` (Now/Decisions/TODO) in the same change set.

## Workflow (default)
When user gives a request:
1. Convert it into an Issue spec:
   - Goal
   - Scope (in/out)
   - 3 acceptance criteria
   - Risks and rollback note (if applicable)
2. Propose an execution plan (small steps).
3. Create branch name suggestion: `codex/<short-slug>`.
4. Implement in small commits, keep it runnable.
5. Provide proof:
   - commands run
   - outputs or screenshot references
6. Open PR content using `PULL_REQUEST_TEMPLATE.md`.
7. Self-review: list risks and edge cases.
8. After merge, propose Release notes (v0.0.x) and next steps.

## File Map
- `/Users/litch/Desktop/litchcodex/Litchi/MEMORY.md`: current state (Now/Decisions/TODO).
- `/Users/litch/Desktop/litchcodex/Litchi/docs/DECISIONS.md`: key decisions and tradeoffs.
- `/Users/litch/Desktop/litchcodex/Litchi/docs/ENGINEERING_HABITS.md`: operating habits and cadence.
- `/Users/litch/Desktop/litchcodex/Litchi/docs/engineering-collab-contract.md`: human-side collaboration contract.
- `/Users/litch/Desktop/litchcodex/Litchi/scripts/`: runnable workflow scripts.
- `/Users/litch/Desktop/litchcodex/Litchi/.env.example`: environment variable contract.

## Definition of Done
A task is done only if:
- Acceptance criteria are met (explicitly checked).
- Minimal tests or runnable proof is provided.
- Docs are updated (`README` if setup changed; `MEMORY.md` always).
- No unsafe changes (secrets, uncontrolled refactors).

## Communication Style
- Plan first, then execute.
- If uncertain, ask or inspect the repo. Do not guess.
- Prefer concise checklists and explicit file diffs.
