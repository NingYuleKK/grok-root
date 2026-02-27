# PROJECT_MAP

Last Updated: 2026-02-13
Purpose: Fast onboarding map for any agent/human to continue work without thread history.

## 1) Where To Start
1. `/Users/litch/Desktop/litchcodex/Litchi/AGENTS.md`
2. `/Users/litch/Desktop/litchcodex/Litchi/MEMORY.md`
3. `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-blog-program-single-source.md`

## 2) Product Area Map
- Blog app root:
  - `/Users/litch/Desktop/litchcodex/Litchi/03_Products/english-blog/`
- Key Astro app files:
  - routes: `src/pages/`
  - content: `src/content/`
  - layouts: `src/layouts/`
  - components: `src/components/`
  - config: `src/config/`
  - styles: `src/styles/`
- Rollback snapshot:
  - `/Users/litch/Desktop/litchcodex/Litchi/03_Products/english-blog/legacy-static/`

## 3) Issue Program (Week 2)
- Master plan:
  - `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-blog-program-single-source.md`
- Issues:
  - A spec: `docs/week2-issue-A-astro-migration-tags.md` (DONE)
  - A acceptance: `docs/week2-issue-A-acceptance-report.md`
  - B spec: `docs/week2-issue-B-ui-refresh-v1.md` (DONE)
  - B acceptance: `docs/week2-issue-B-acceptance-report.md`
  - C spec: `docs/week2-issue-C-newsletter-v1.md` (DONE)
  - C acceptance: `docs/week2-issue-C-acceptance-report.md`
  - D spec: `docs/week2-issue-D-comments-giscus.md` (DONE)
  - D acceptance: `docs/week2-issue-D-acceptance-report.md`
  - E spec: `docs/week2-issue-E-deploy-ready-v1.md` (DONE)
  - E acceptance: `docs/week2-issue-E-acceptance-report.md`
  - E runbook: `docs/deploy-blog-pages-v1.md`

## 4) Validation Commands
- Repo checks:
  - `cd /Users/litch/Desktop/litchcodex/Litchi && ./scripts/test.sh`
- Blog app checks (node-enabled machine):
  - `cd /Users/litch/Desktop/litchcodex/Litchi/03_Products/english-blog`
  - `npm run dev`
  - `npm run build`
  - `npm run preview`

## 5) Notification & Moderation Path
- Comments provider: giscus + GitHub Discussions
- Discussions path:
  - `https://github.com/NingYuleKK/grok-root/discussions`
- Moderation actions:
  - delete/hide/lock discussion from Discussions UI

## 6) Handoff Rule
At task end, always update:
1. `MEMORY.md` (Now/Decisions/TODO)
2. `docs/DECISIONS.md` (if technical direction changed)
3. `README.md` (if run/setup/deploy behavior changed)
4. corresponding issue spec/acceptance docs
