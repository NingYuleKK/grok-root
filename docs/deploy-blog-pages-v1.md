# Deploy Runbook v1 - Astro Blog on GitHub Pages

Last Updated: 2026-02-13
Owner: litch
Applies To: `03_Products/english-blog`

## 1) Build Contract
- Astro config source: `03_Products/english-blog/astro.config.mjs`
- Required env:
  - `PUBLIC_SITE_URL`
  - `PUBLIC_BASE_PATH`
- Output directory: `03_Products/english-blog/dist`

`PUBLIC_BASE_PATH` examples:
- custom domain or user pages: `/`
- project pages: `/<repo>/`

## 2) Local Verification (before release)
1. `cd /Users/kk/Desktop/litchcodex/Litchi/03_Products/english-blog`
2. `npm install`
3. `npm run build`
4. `npm run preview`

Expected result:
- Build succeeds with `dist/` generated.
- Preview server starts without route errors.

## 3) GitHub Pages Delivery Options
### Option A (recommended): GitHub Actions
- Workflow file: `/Users/kk/Desktop/litchcodex/Litchi/.github/workflows/blog-pages.yml`
- Trigger:
  - push to `main` with changes under `03_Products/english-blog/**`
  - manual `workflow_dispatch`
- Required repository variables:
  - `PUBLIC_SITE_URL`
  - `PUBLIC_BASE_PATH`

### Option B: manual artifact deploy
1. Build locally to produce `dist/`.
2. Upload/publish `dist/` through your chosen Pages manual path.
3. Keep the same env contract (`PUBLIC_SITE_URL`, `PUBLIC_BASE_PATH`).

## 4) Custom Domain Handoff
1. In GitHub Pages settings, set the custom domain.
2. In DNS provider:
   - set `CNAME` for `www` to `<github-user>.github.io`
   - set `A`/`ALIAS` for apex domain as required by provider docs
3. Wait for DNS propagation and certificate issuance.
4. Validate:
   - `https://<domain>` opens
   - no mixed-content warnings
   - key pages load: home, post, tags

## 5) Release Routine (minimum)
1. Merge PR to `main`.
2. Add tag: `v0.0.x`.
3. Changelog minimum entries:
   - what changed
   - ops action needed (if any)
   - verification commands used
