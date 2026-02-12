# Blog UI Guidelines v1

Scope: Issue B baseline for Astro blog pages.

## Typography
- Headings: `"Space Grotesk", "Trebuchet MS", sans-serif`
- Body: `"Source Serif 4", Georgia, serif`
- Body line-height: `1.65`

## Spacing Scale
- `--space-1`: `0.5rem`
- `--space-2`: `0.8rem`
- `--space-3`: `1.2rem`
- `--space-4`: `1.8rem`
- `--space-5`: `2.6rem`

## Core Components
- `.post-item`: list-card container on homepage/tags detail
- `.post`: full article container
- `.tag`: reusable tag chip
- `.lede`: readable lead paragraph style
- `.section-block`: vertical section rhythm

## Responsive Rules
- Mobile breakpoint: `680px`
- Header switches to vertical stack on mobile
- Card padding reduces on small screens

## Navigation States
- Active nav item uses `aria-current="page"` with accent underline.
- Keep nav labels minimal (`Home`, `Tags`) for clarity.

