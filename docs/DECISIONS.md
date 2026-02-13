# Engineering Decisions

## 2026-02-09
- Adopt weekly shipping rhythm for 8 weeks.
- Standardize collaboration through `AGENTS.md`, issue template, and PR template.
- Keep workflow lightweight: small PRs, explicit acceptance criteria, minimal tests.

## 2026-02-10
- For Week 1 mini CLI, implement a Python command `trace hello` with text/json output.
- Use local command shim installation (`.local/bin/trace`) instead of pip package install, to stay reliable in restricted/sandboxed environments.
- Keep tests on Python stdlib `unittest` (3 core cases) to avoid extra dependency setup.

## 2026-02-12
- For Week 2 blog MVP, use a static site in `03_Products/english-blog/` to keep deployment simple and predictable.
- Include one migrated English article and a client-side subscribe form with validation as the minimum publishable content set.
- Add `scripts/blog-check.sh` and integrate it into `scripts/test.sh` so blog structure checks run in the default CI-like flow.
- Issue A migration decision: move blog to Astro with content collections (`blog`) and file-based routes for tags index/detail.
- Keep rollback path by preserving pre-Astro static MVP under `03_Products/english-blog/legacy-static/`.
- Configure deploy placeholders in Astro (`PUBLIC_SITE_URL`, `PUBLIC_BASE_PATH`) so ops can set site/base without code changes.
- Accept Issue A after runtime proof on node-enabled machine (`npm install`, `npm run dev`, `npm run build`, `npm run preview`).
- Issue B UI baseline decision: standardize typography, spacing scale, card/tag components, and nav active states across home/post/tags pages.
- Record visual conventions in `docs/blog-ui-guidelines-v1.md` to avoid style drift in future issues.
- Accept Issue B after runtime proof (`npm run dev`, `npm run build`) with confirmed tags-route non-regression.
- Consolidate Week 2 A-E requirements/progress into one source doc: `docs/week2-blog-program-single-source.md`.
- Issue C newsletter decision: implement provider-agnostic subscribe component with centralized config (`src/config/newsletter.ts`) and env-driven placeholders.
- Use redirect/placeholder modes to provide explicit user feedback without committing provider secrets.
- Accept Issue C after runtime proof (home/post form presence, invalid-email feedback, redirect mode success, build success).
- Issue D comments decision: use giscus (GitHub Discussions) with centralized config in `src/config/comments.ts` and env-driven setup.
- Keep fallback behavior explicit: when giscus config is missing, show a clear "not configured" message instead of failing silently.
- Accept Issue D after runtime proof: comments render/post/persist, notification path verified, and build success.
- Add `docs/PROJECT_MAP.md` as onboarding/cognitive map for cross-device and cross-agent continuation.
