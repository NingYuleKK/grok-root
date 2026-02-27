# Week 2 Issue: English Blog MVP

## Goal
Ship a real English blog MVP that is locally runnable, publishable, and ready for domain binding.

## Scope
- In scope:
  - Static blog homepage
  - One migrated English post page
  - Email subscribe component with basic validation and success state
  - Deployment instructions for GitHub Pages + custom domain
- Out of scope:
  - Backend CMS
  - Paid email service integration
  - Multi-author workflow

## Acceptance Criteria
1. Local preview works and homepage + post page are navigable.
2. Blog contains at least one English post with readable layout on desktop/mobile.
3. Subscribe component validates email and shows clear user feedback.

## Risks and Rollback
- Risk: domain/DNS propagation can delay go-live.
- Rollback: keep GitHub Pages URL as temporary canonical link until DNS is stable.

