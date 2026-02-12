# [feat] Issue D - Comments v1 via GitHub Discussions (giscus)

## Goal
- Add reader interaction on post pages with a manageable moderation surface via GitHub Discussions.

## Scope
- In scope:
  - giscus comments component
  - Mount comments on each post page
  - Centralized comments config (repo/category/mapping/theme)
  - Setup docs for Discussions + giscus
- Out of scope:
  - Self-hosted comments backend
  - Multi-provider comments abstraction

## Acceptance Criteria
- [ ] Post pages render comments container and load discussions after config is set.
- [ ] giscus config is centralized; no sensitive data is committed.
- [ ] Build passes; docs include full setup steps and caveats.

## Constraints
- Tech/runtime constraints:
  - Use official giscus script/component pattern compatible with Astro.
- Time/scope constraints:
  - Prioritize reliable setup over deep styling customization.

## Notes
- Related links:
  - `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-C-newsletter-v1.md`
- Additional context:
  - Record rationale and alternatives (utterances/disqus) in MEMORY/DECISIONS.

