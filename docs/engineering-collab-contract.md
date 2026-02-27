# Engineering Collaboration Contract (Litch) - v1.0

## My Role Split
- I act as PM: define goal/scope/acceptance.
- I act as TL: guard quality bar, safety, and release discipline.
- Codex acts as Dev + QA assistant: implement + self-check + document updates.

## Before Starting Any Task (2 minutes)
1. Confirm repo is up to date: pull latest main.
2. Read `MEMORY.md` (Now/Decisions/TODO).
3. State the task in one sentence.
4. Write 3 acceptance criteria (even rough).

## During Work (keep it small)
- One Issue at a time.
- One branch per Issue.
- Prefer small PRs that can be merged safely.
- If changes feel big, split into 2 Issues.

## Evidence Rules
Every PR must include:
- How to run
- What changed
- Proof (command output / screenshot / deployed link)

## Decision Hygiene
Anything that changes direction goes into `DECISIONS.md`:
- tech choice
- architecture choice
- data format choice
- deployment choice

## End of Task Checklist
- Update `MEMORY.md` in same change set.
- PR created with acceptance checks.
- Review done (Codex + me).
- Merge + Release notes (even short).
- Add next TODO if discovered.

## Weekly "Condense" Ritual (15 minutes)
- What became irreversible this week?
- What decision saved time or caused pain?
- What should future-me know in 5 lines?
Update `MEMORY.md` + `DECISIONS.md`.

