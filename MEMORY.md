# MEMORY

Last Updated: 2026-02-09
Owner: litch

## Now
- Goal: build engineering habits with an 8-week "vibe coding + shipping" plan.
- Current phase: Day 0 completed; ready for Week 1 delivery.
- Weekly operating model:
  - Delivery track: one runnable/publishable/demoable output each week.
  - Learning track: one core engineering concept each week.
  - Habit track: same GitHub flow every week (Issue -> Branch -> PR -> Review -> Release).

## Decisions
- Use this file as the single collaboration memory for ongoing context.
- Keep entries short and operational; update after each weekly delivery.
- Prioritize "small scope, always runnable" over feature breadth.
- Enforce six vibe-coding guardrails:
  - Write 3 acceptance criteria before coding.
  - Make small, reversible changes.
  - Add minimal tests for every feature.
  - Never commit secrets; use `.env` and `.gitignore`.
  - Require Codex review on every PR.
  - Ship/release weekly (even tiny versions).

## TODO
- [x] Day 0: create template repo skeleton:
  - [x] `README.md`, `.gitignore`, `.env.example`, `docs/`, `scripts/`
  - [x] `AGENTS.md`
  - [x] `MEMORY.md`
- [x] Day 0: define GitHub ritual templates:
  - [x] Issue template with 3 acceptance criteria.
  - [x] PR template with test + release checklist.
- [ ] Week 1: ship mini CLI (install/run/test complete).
- [ ] Week 2: ship English blog MVP + 1 migrated post + email subscribe component.
- [ ] Week 3: ship conversation importer (jsonl/sqlite) + sample tests.
- [ ] Week 4: ship keyword search + date/tag/source filters.
- [ ] Week 5: ship summarizer with 5-level importance + auto MEMORY update.
- [ ] Week 6: ship one-command pipeline (import -> process -> report).
- [ ] Week 7: connect memory search/upsert via MCP.
- [ ] Week 8: release v0.1 + changelog + retrospective blog post.

## Links
- Workspace root: `/Users/litch/Desktop/litchcodex`
- Main work folder: `/Users/litch/Desktop/litchcodex/Litchi`
- This memory file: `/Users/litch/Desktop/litchcodex/Litchi/MEMORY.md`

## Glossary
- vibe coding: keep creative velocity, but inside engineering constraints.
- acceptance criteria: concrete checks defining "done."
- shipping: producing a runnable, testable, demonstrable output.
- MCP: tool/memory integration interface for Codex workflows.
