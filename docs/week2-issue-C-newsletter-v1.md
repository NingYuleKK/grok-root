# [feat] Issue C - Newsletter Subscription v1 (Embed/Plug-in)

## Goal
- Add a practical newsletter subscription entry with a replaceable provider integration pattern.

## Scope
- In scope:
  - Subscribe component on homepage and post footer
  - Clear success/failure feedback
  - Centralized provider config (single component/config file)
- Out of scope:
  - Self-hosted mail infrastructure
  - Full subscriber CRM workflow

## Acceptance Criteria
- [x] Subscribe form appears and returns clear success/failure/redirect feedback.
- [x] Provider parameters are centralized (no scattered embed code).
- [x] No secrets committed; env/config placeholders documented (`.env.example` or config constants).

## Constraints
- Tech/runtime constraints:
  - Keep integration provider-agnostic for later replacement.
- Time/scope constraints:
  - Deliver thin integration layer first; deep analytics can follow later.

## Notes
- Related links:
  - `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-issue-B-ui-refresh-v1.md`
- Additional context:
  - README must include provider swap steps and configuration contract.
