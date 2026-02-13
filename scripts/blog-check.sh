#!/usr/bin/env bash
set -euo pipefail

BLOG_ROOT="03_Products/english-blog"

echo "[blog-check] checking Week 2 blog files"
test -f "$BLOG_ROOT/package.json"
test -f "$BLOG_ROOT/astro.config.mjs"
test -f "$BLOG_ROOT/src/pages/index.astro"
test -f "$BLOG_ROOT/src/pages/posts/[...slug].astro"
test -f "$BLOG_ROOT/src/pages/tags/index.astro"
test -f "$BLOG_ROOT/src/pages/tags/[tag].astro"
test -f "$BLOG_ROOT/src/content/config.ts"
test -f "$BLOG_ROOT/src/content/blog/week-2-workflow-beats-motivation.md"
test -f "$BLOG_ROOT/src/components/NewsletterForm.astro"
test -f "$BLOG_ROOT/src/components/GiscusComments.astro"
test -f "$BLOG_ROOT/src/config/newsletter.ts"
test -f "$BLOG_ROOT/src/config/comments.ts"
test -d "$BLOG_ROOT/legacy-static"

echo "[blog-check] checking required content markers"
grep -q '"dev": "astro dev"' "$BLOG_ROOT/package.json"
grep -q 'getCollection("blog")' "$BLOG_ROOT/src/pages/tags/index.astro"
grep -q "tags:" "$BLOG_ROOT/src/content/blog/week-2-workflow-beats-motivation.md"
grep -q "NewsletterForm" "$BLOG_ROOT/src/pages/index.astro"
grep -q "NewsletterForm" "$BLOG_ROOT/src/pages/posts/[...slug].astro"
grep -q "GiscusComments" "$BLOG_ROOT/src/pages/posts/[...slug].astro"
grep -q "PUBLIC_NEWSLETTER_ACTION_URL" "/Users/litch/Desktop/litchcodex/Litchi/.env.example"
grep -q "PUBLIC_GISCUS_REPO" "/Users/litch/Desktop/litchcodex/Litchi/.env.example"

echo "[blog-check] done"
