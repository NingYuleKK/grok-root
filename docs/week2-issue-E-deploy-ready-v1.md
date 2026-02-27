# [feat] Issue E - Deploy-ready v1 (GitHub Pages + Custom Domain Notes)

Status: DONE + accepted

## Goal
- Make the blog deployment operationally clear so ops can launch and maintain it reliably.

## Scope
- In scope:
  - Deployment docs for GitHub Pages/custom domain
  - Astro `site/base` guidance
  - Optional GitHub Actions workflow for pages deploy
  - Release routine (tag/changelog notes)
- Out of scope:
  - Provider-specific infra automation beyond current ops requirements

## Acceptance Criteria
- [x] `npm run build` and `npm run preview` work with documented steps.
- [x] Deployment docs cover `site/base`, output dir, and domain handoff points.
- [x] If Actions are used, workflow file is present and documented for ops enablement.

## Constraints
- Tech/runtime constraints:
  - Keep secrets/config outside repo; only placeholders and docs in repo.
- Time/scope constraints:
  - Deliver deploy-ready docs first; deep ops automation can be a later issue.

## Notes
- Related links:
  - `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-D-comments-giscus.md`
- Additional context:
  - Define release cadence after main merges (tag format + changelog minimum).
  - Implementation docs/workflow for Issue E:
    - `/Users/litch/Desktop/litchcodex/Litchi/docs/deploy-blog-pages-v1.md`
    - `/Users/litch/Desktop/litchcodex/Litchi/.github/workflows/blog-pages.yml`
