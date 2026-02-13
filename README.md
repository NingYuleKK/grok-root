# Litchi Workspace

This repository is the execution base for an 8-week "engineering + vibe coding" plan.

## Quick Start
1. Copy environment template:
   - `cp .env.example .env`
2. Ensure local runtime:
   - `python3` for repository scripts
   - `node` + `npm` for Astro blog workflow
3. Install local trace command shim:
   - `./scripts/build.sh`
4. Run the command:
   - `.local/bin/trace hello`
   - `.local/bin/trace hello --format json`
5. Run checks:
   - `./scripts/all.sh`

## Project Conventions
- Workflow: Issue -> Branch -> PR -> Review -> Release
- Branch prefix: `codex/`
- Rules and collaboration contract: `AGENTS.md`
- Ongoing context and plan status: `MEMORY.md`

## Why This Workflow Exists
- Issue: force clarity before implementation (goal/scope/acceptance).
- Branch: isolate one task, reduce accidental side effects.
- PR: create reviewable proof (what changed + how validated).
- Review: catch risks before merge.
- Release: turn "done in code" into "available to use."

## Week 1 Deliverable: Hello Repo CLI
- Command: `trace hello`
- Purpose: print minimal project status for a runnable demo.
- Required output fields:
  - `project`
  - `message`
  - `timestamp`

## Week 2 Deliverable: English Blog (Astro Migration in Progress)
- Blog root: `03_Products/english-blog/`
- Astro routes:
  - Home: `src/pages/index.astro`
  - Post detail: `src/pages/posts/[...slug].astro`
  - Tags index: `src/pages/tags/index.astro`
  - Tag detail: `src/pages/tags/[tag].astro`
- Blog content collection:
  - Config: `src/content/config.ts`
  - First migrated post: `src/content/blog/week-2-workflow-beats-motivation.md`
- Rollback safety:
  - Legacy static MVP preserved in `03_Products/english-blog/legacy-static/`
- UI baseline conventions:
  - `docs/blog-ui-guidelines-v1.md`
- Newsletter integration (Issue C):
  - Component: `src/components/NewsletterForm.astro`
  - Config: `src/config/newsletter.ts`

## Scripts
- `./scripts/lint.sh`
- `./scripts/test.sh`
- `./scripts/build.sh`
- `./scripts/all.sh`

## Repository Structure
- `00_Inbox/` incoming ideas and notes
- `01_Research/` research material
- `02_Experiments/` prototypes and exploratory builds
- `03_Products/` production-facing artifacts
- `04_Assets/` shared assets
- `05_Operations/` operational docs/process
- `06_Archive/` archived materials
- `docs/` lightweight design decisions and engineering notes

## Development Commands
- Build + install package: `./scripts/build.sh`
- Run CLI (text): `.local/bin/trace hello`
- Run CLI (json): `.local/bin/trace hello --format json`
- Optional `trace` command style:
  - `PATH="$(pwd)/.local/bin:$PATH" trace hello`
- Run tests: `./scripts/test.sh`

## Blog Commands
- Validate blog MVP artifacts: `./scripts/blog-check.sh`
- Astro local development:
  - `cd 03_Products/english-blog`
  - `npm install`
  - `npm run dev`
- Astro production build:
  - `npm run build`
  - `npm run preview`

## Newsletter Setup (Issue C)
1. Configure placeholders in `.env` (do not commit secrets):
   - `PUBLIC_NEWSLETTER_PROVIDER`
   - `PUBLIC_NEWSLETTER_MODE`
   - `PUBLIC_NEWSLETTER_ACTION_URL`
   - `PUBLIC_NEWSLETTER_SOURCE`
2. For production provider redirect mode:
   - set `PUBLIC_NEWSLETTER_MODE=redirect`
   - set `PUBLIC_NEWSLETTER_ACTION_URL=<provider_form_endpoint>`
3. For local/dev placeholder mode:
   - keep `PUBLIC_NEWSLETTER_MODE=placeholder`
   - component shows explicit "not configured" feedback
4. Provider replacement rule:
   - update only `src/config/newsletter.ts` and env placeholders, not page files.

## Comments Setup (Issue D: giscus)
1. Prerequisites (GitHub):
   - Enable GitHub Discussions for your repository.
   - Create/select a Discussions category for blog comments.
2. Configure giscus values in `.env`:
   - `PUBLIC_GISCUS_REPO` (e.g. `owner/repo`)
   - `PUBLIC_GISCUS_REPO_ID`
   - `PUBLIC_GISCUS_CATEGORY`
   - `PUBLIC_GISCUS_CATEGORY_ID`
   - Optional mapping/theme/lang options from `.env.example`
3. Comments mounting:
   - component: `src/components/GiscusComments.astro`
   - config: `src/config/comments.ts`
   - mounted on post pages: `src/pages/posts/[...slug].astro`
4. Behavior notes:
   - If config is incomplete, page shows a clear "not configured" notice.
   - No secrets are required; keep values in deploy/runtime env.

## Deploy Blog (GitHub Pages + Custom Domain)
1. Set Astro deploy variables before build (ops-managed):
   - `PUBLIC_SITE_URL` (for example: `https://blog.yourdomain.com`)
   - `PUBLIC_BASE_PATH` (normally `/` for custom domain, or repo subpath for project pages)
2. Push repository to GitHub main branch.
3. Build static output from `03_Products/english-blog` (`npm run build`), output directory is `dist/`.
4. In repository settings, enable GitHub Pages with the chosen publish strategy (manual artifact or CI workflow in later issue).
5. Add your domain in GitHub Pages custom domain field.
6. In your DNS provider, create records:
   - `CNAME` for `www` to `<your-github-username>.github.io`
   - `A`/`ALIAS` for apex domain as required by your provider
7. Verify domain status in GitHub Pages and test both desktop/mobile.
