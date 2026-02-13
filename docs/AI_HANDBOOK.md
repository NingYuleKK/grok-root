# AI Assistant Handbook: English Blog Project

**Version:** 1.0  
**Date:** 2026-02-13  
**Author:** Manus

## 1. Introduction

This document is the complete technical handbook for the **English Blog project**. Any AI assistant (Manus, Codex, or others) should read this file first to understand the project.

**Your primary directive: Read this document and the referenced files before taking any action.**

---

## 2. Project Overview

- **Project Name:** English Blog
- **Goal:** Build and maintain a modern personal blog for Litch
- **Live URL:** https://ningyulekk.github.io/grok-root/
- **Repository:** git@github.com:NingYuleKK/grok-root.git
- **Working Directory:** `/03_Products/english-blog`

### Core Features

| Feature | Description | Key Files |
|:--------|:------------|:----------|
| Static Site | Built with Astro | `astro.config.mjs`, `src/pages/` |
| Tags | Post organization | `src/pages/tags/[tag].astro` |
| Newsletter | Subscription form | `src/config/newsletter.ts`, `src/components/NewsletterForm.astro` |
| Comments | giscus integration | `src/config/comments.ts`, `src/components/GiscusComments.astro` |
| Auto Deploy | GitHub Pages | `.github/workflows/blog-pages.yml` |

---

## 3. Onboarding for New AI Instance

### Step 1: Clone Repository (if needed)

```bash
git clone git@github.com:NingYuleKK/grok-root.git
cd grok-root
```

### Step 2: Read Core Documents (in order)

1. `docs/AI_HANDBOOK.md` (this file)
2. `docs/PROJECT_MAP.md`
3. `docs/week2-blog-program-single-source.md`
4. `MEMORY.md` and `docs/DECISIONS.md`

### Step 3: Set Up Environment

```bash
cd 03_Products/english-blog
npm install
```

### Step 4: Run Dev Server

```bash
npm run dev
```

Site available at: http://localhost:4321

---

## 4. Development Workflow

1. **Branch:** Create feature branch (e.g., `feature/add-search`)
2. **Develop:** Implement features
3. **Document:** Update `MEMORY.md`, `DECISIONS.md`, issue specs
4. **Commit:** Use Conventional Commits (e.g., `feat(blog): add search`)
5. **Push:** Push feature branch
6. **PR:** Create Pull Request to `main`
7. **Merge:** After review, merge PR
8. **Deploy:** Auto-deploys via GitHub Actions

---

## 5. Key Configuration Files

### Environment Variables (`.env`)

```bash
# Newsletter
PUBLIC_NEWSLETTER_MODE=redirect
PUBLIC_NEWSLETTER_ACTION_URL=https://example.com/subscribe

# Comments (giscus)
PUBLIC_GISCUS_REPO=NingYuleKK/grok-root
PUBLIC_GISCUS_REPO_ID=R_kgDOQlkKrw
PUBLIC_GISCUS_CATEGORY=General
PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOQlkKr84C2WKM
```

### Deployment Workflow

Located at `.github/workflows/blog-pages.yml`
- Triggers on push to `main`
- Builds and deploys to GitHub Pages

---

## 6. Common Tasks

### Write New Post

1. Create `.md` file in `03_Products/english-blog/posts/`
2. Add frontmatter (title, date, tags, author)
3. Write content in Markdown
4. Preview with `npm run dev`
5. Commit and push

### Test Build

```bash
npm run build
npm run preview
```

---

## 7. Troubleshooting

### `npm install` fails

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Deployment fails

Check GitHub Actions tab for logs

### Comments not showing

Verify `.env` has correct giscus config

---

## 8. File Structure

```
grok-root/
├── 03_Products/english-blog/
│   ├── posts/              # Blog posts
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── config/         # Config files
│   │   ├── pages/          # Routes
│   │   └── styles/         # CSS
│   ├── .env                # Local env vars
│   └── package.json
├── docs/                   # Documentation
│   ├── AI_HANDBOOK.md      # This file
│   ├── USER_MANUAL.md
│   ├── PROJECT_MAP.md
│   └── week2-blog-program-single-source.md
├── MEMORY.md
└── .github/workflows/
```

---

## 9. Important Notes

- Always read latest `MEMORY.md` and `DECISIONS.md`
- Document your work
- Follow "single source of truth" principle
- Respect user's engineering habits

---

## 10. Contact & Escalation

If you encounter an issue you cannot resolve:
1. Document the problem clearly in `MEMORY.md`
2. Inform the user (Litch) with a summary and your attempted solutions
3. Wait for further instructions

---

**End of AI Assistant Handbook**
