# MEMORY

Last Updated: 2026-02-12
Owner: litch

## Now
- Goal: build engineering habits with an 8-week "vibe coding + shipping" plan.
- Current phase: Issue B accepted (UI refresh v1 complete), ready for Issue C newsletter integration.
- Weekly operating model:
  - Delivery track: one runnable/publishable/demoable output each week.
  - Learning track: one core engineering concept each week.
  - Habit track: same GitHub flow every week (Issue -> Branch -> PR -> Review -> Release).

## Decisions
- Use this file as the single collaboration memory for ongoing context.
- Keep entries short and operational; update after each weekly delivery.
- Prioritize "small scope, always runnable" over feature breadth.
- Maintain an explicit engineering habits playbook in `docs/ENGINEERING_HABITS.md`.
- Promote workflow hard constraints into `AGENTS.md`:
  - one requirement = one Issue
  - one Issue = one branch
  - PR must include acceptance criteria and test evidence
- Add weekly documentation review rule in `AGENTS.md` (`MEMORY.md` + `docs/DECISIONS.md`).
- Replace `AGENTS.md` with Collaboration Contract v1.0 for stable cross-device execution.
- Add human-side collaboration contract: `docs/engineering-collab-contract.md`.
- Add reusable prompt templates under `prompts/` (`start-task`, `end-task`, `weekly-review`).
- Week 1 CLI implementation note:
  - command: `trace hello` (text/json)
  - install method: local shim at `.local/bin/trace`
  - tests: stdlib `unittest` with 3 passing cases
- Week 2 blog MVP implementation note:
  - static blog root: `03_Products/english-blog/`
  - content: homepage + first English post
  - subscribe component: email validation + feedback message
  - verification: `scripts/blog-check.sh` integrated into `scripts/test.sh`
- Week 2 upgrade planning note:
  - define 5 sequential issues for Astro upgrade path (A: migration/tags, B: UI, C: newsletter, D: comments, E: deploy-ready)
  - execution rule remains one issue per branch/PR with runnable evidence
- Issue A implementation note:
  - Astro scaffold added in `03_Products/english-blog/` with content collections and tags routes
  - first post migrated to Markdown (`src/content/blog/week-2-workflow-beats-motivation.md`)
  - rollback path preserved at `03_Products/english-blog/legacy-static/`
  - runtime verification passed on node-enabled machine (`npm install`, `npm run dev`, `npm run build`, `npm run preview`)
  - acceptance evidence file: `docs/week2-issue-A-acceptance-report.md`
- Issue B implementation note:
  - unified layout updated (header/footer/nav active state + SEO meta)
  - typography/spacing/card/tag styles standardized in `src/styles/global.css`
  - UI conventions documented in `docs/blog-ui-guidelines-v1.md`
  - runtime verification passed on node-enabled machine (`npm run dev`, `npm run build`)
  - acceptance evidence file: `docs/week2-issue-B-acceptance-report.md`
- Add AGENTS startup checklist rule: each new task/window must print 5-line kickoff confirmation (memory read, goal, acceptance criteria, branch, close-out docs).
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
- [x] Week 1: ship mini CLI (install/run/test complete).
- [x] Week 2: ship English blog MVP + 1 migrated post + email subscribe component.
- [ ] Week 2 follow-up: bind custom domain and verify live site over HTTPS.
- [x] Issue A verification: run Astro `dev/build/preview` commands on node-enabled machine and attach evidence.
- [x] Issue B: UI refresh v1 (layout + typography + responsive).
- [x] Issue B verification: run Astro build on node-enabled machine and confirm no route regression.
- [ ] Issue C: newsletter subscription v1 (embed/plug-in).
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
- Engineering habits: `/Users/litch/Desktop/litchcodex/Litchi/docs/ENGINEERING_HABITS.md`
- Human collaboration contract: `/Users/litch/Desktop/litchcodex/Litchi/docs/engineering-collab-contract.md`
- Prompt templates: `/Users/litch/Desktop/litchcodex/Litchi/prompts/`
- Week 1 issue spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week1-hello-repo-issue.md`
- Week 2 issue spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-english-blog-issue.md`
- Week 2 issue A spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-A-astro-migration-tags.md`
- Week 2 issue A acceptance: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-A-acceptance-report.md`
- Week 2 issue B spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-B-ui-refresh-v1.md`
- Week 2 issue B acceptance: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-B-acceptance-report.md`
- Blog UI guidelines: `/Users/litch/Desktop/litchcodex/Litchi/docs/blog-ui-guidelines-v1.md`
- Week 2 issue C spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-C-newsletter-v1.md`
- Week 2 issue D spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-D-comments-giscus.md`
- Week 2 issue E spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-E-deploy-ready-v1.md`

## Glossary
- vibe coding: keep creative velocity, but inside engineering constraints.
- acceptance criteria: concrete checks defining "done."
- shipping: producing a runnable, testable, demonstrable output.
- MCP: tool/memory integration interface for Codex workflows.
