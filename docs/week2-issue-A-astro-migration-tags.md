# [feat] Issue A - Migrate Blog to Astro + Native Tags

## Goal
- Migrate the current static HTML blog MVP into an Astro static blog that can scale for long-term writing.
- Enable native tags with automatic tag index and per-tag listing pages.

## Scope
- In scope:
  - Astro project initialization under blog workspace
  - Content collections for blog posts (Markdown)
  - Post detail pages
  - Tags index page and tag detail pages
  - Base layout and migration of the first post into Markdown
  - README updates for `dev/build/preview`
- Out of scope:
  - Deep visual redesign (reserved for Issue B)
  - Newsletter backend integration
  - Comments system integration

## Acceptance Criteria
- [x] `npm install && npm run dev` works; home/post/tags index/tags detail pages are accessible.
- [x] Adding one Markdown post file with frontmatter `tags` updates tags pages automatically.
- [x] `npm run build` succeeds and README documents `dev/build/preview` commands.

## Constraints
- Tech/runtime constraints:
  - Keep rollback path by preserving current static MVP until Astro migration is validated.
  - Do not commit secrets; deployment values remain configurable.
- Time/scope constraints:
  - Ship minimal but complete routing and content workflow first.

## Notes
- Related links:
  - `/Users/litch/Desktop/litchcodex/Litchi/03_Products/english-blog/`
  - `/Users/litch/Desktop/litchcodex/Litchi/docs/week2-english-blog-issue.md`
- Additional context:
  - Reserve `site/base` config placeholders for GitHub Pages + custom domain ops handoff.
