# Week 2 Blog Program - Single Source of Truth

Last Updated: 2026-02-13
Owner: litch
Execution Model: one issue -> one branch (`codex/*`) -> one PR -> evidence -> memory/docs update

## Program Goal
Upgrade the English blog MVP into a long-term Astro-based writing system with:
1. Better UI baseline
2. Native tags
3. Newsletter subscription
4. Reader comments
5. Deploy-ready handoff for ops

## Current Status
- Issue A: DONE + accepted
- Issue B: DONE + accepted
- Issue C: DONE + accepted
- Issue D: DONE + accepted
- Issue E: DONE + accepted

## Issue A - Migrate to Astro + Native Tags
Status: DONE
Spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-A-astro-migration-tags.md`
Acceptance: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-A-acceptance-report.md`

Goal:
- Migrate static MVP to Astro with Markdown content collections and native tags pages.

Acceptance Criteria:
- `npm install && npm run dev` works with home/post/tags routes.
- Markdown + frontmatter tags updates tags pages automatically.
- `npm run build` succeeds and README documents `dev/build/preview`.

Delivered:
- Astro structure and routes
- content collection + first migrated post
- rollback path in `legacy-static/`

## Issue B - UI Refresh v1
Status: DONE
Spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-B-ui-refresh-v1.md`
Acceptance: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-B-acceptance-report.md`
UI Guidelines: `/Users/litch/Desktop/litchcodex/Litchi/docs/blog-ui-guidelines-v1.md`

Goal:
- Unify layout/typography/spacing/navigation for desktop and mobile readability.

Acceptance Criteria:
- Clear mobile + desktop readability
- Visual consistency across home/post/tags pages
- Issue A tags/routes remain intact; build passes

Delivered:
- unified layout and style tokens
- responsive baseline and nav states
- documented UI conventions

## Issue C - Newsletter Subscription v1
Status: DONE
Spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-C-newsletter-v1.md`
Acceptance: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-C-acceptance-report.md`

Goal:
- Add replaceable newsletter subscribe integration (embed/plug-in first).

Acceptance Criteria:
- Visible subscribe form with explicit success/failure/redirect feedback
- Provider params centralized in one component/config
- No secrets committed; placeholders documented

## Issue D - Comments v1 via giscus
Status: DONE
Spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-D-comments-giscus.md`
Acceptance: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-D-acceptance-report.md`

Goal:
- Add post-level reader interaction using GitHub Discussions (giscus).

Acceptance Criteria:
- Comments container renders and loads once config is set
- Config centralized (repo/category/mapping)
- Build passes with clear setup docs

## Issue E - Deploy-ready v1
Status: DONE + accepted
Spec: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-E-deploy-ready-v1.md`
Acceptance: `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-E-acceptance-report.md`

Goal:
- Produce ops-ready deployment path for GitHub Pages + custom domain.

Acceptance Criteria:
- `npm run build` and `npm run preview` pass with documented steps
- Docs cover `site/base`, output dir, and domain handoff
- Optional Pages workflow documented if enabled

Delivered (current):
- deployment runbook: `docs/deploy-blog-pages-v1.md`
- optional pages workflow: `.github/workflows/blog-pages.yml`
- root README deploy section upgraded for ops handoff
- runtime verification completed on node-enabled environment (`npm install`, `npm run build`, `npm run preview`)

## Handoff Protocol (Cross-Device / Cross-Agent)
At task start:
1. Read `AGENTS.md`
2. Read `MEMORY.md`
3. Read `docs/PROJECT_MAP.md`
4. Read this file
5. Open active issue spec

At task end:
1. Update issue status/evidence docs
2. Update `MEMORY.md` (Now/Decisions/TODO)
3. Update `docs/DECISIONS.md` and `README.md` if behavior/process changed
4. Commit + push
