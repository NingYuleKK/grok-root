# English Blog: User Manual

**Version:** 1.0  
**Date:** 2026-02-13

*This is your personal guide to managing and editing your blog. Keep it handy!*

---

## 1. Viewing Your Blog

*You have two ways to see your blog.*

### Live Website (Public)

- **URL:** [https://ningyulekk.github.io/grok-root/](https://ningyulekk.github.io/grok-root/)
- **What it is:** This is the official, live version of your blog that anyone on the internet can see.
- **Updates:** It automatically updates about 1-2 minutes after you push changes to the `main` branch on GitHub.

### Local Preview (For Editing)

- **How to start:** Open your terminal and run these commands:
  ```bash
  cd ~/Desktop/LitchCodex/Litchi/03_Products/english-blog
  npm run dev
  ```
- **URL:** [http://localhost:4321](http://localhost:4321)
- **What it is:** A private copy of your blog running on your computer. When you save a file, the browser will instantly refresh to show your changes. Use this for writing and editing.

---

## 2. How to Write & Edit Posts

*Your articles are just simple text files.*

### Step 1: Find the Posts Folder

All your articles are located in this folder:

```
~/Desktop/LitchCodex/Litchi/03_Products/english-blog/posts/
```

### Step 2: Create or Edit a File

- **To write a new post:** Create a new file in the `posts` folder. The filename should be descriptive and end with `.md` (e.g., `my-new-adventure.md`).
- **To edit an existing post:** Simply open the `.md` file for that post.
- **Recommended Editor:** You can use any text editor you like, such as VS Code, Obsidian, or Typora.

### Step 3: Write in Markdown

At the top of each file, you need a "frontmatter" section to define the title, date, and tags.

```markdown
---
author: Litch
title: "My New Post Title"
pubDate: "2026-02-14"
tags: ["life", "thoughts"]
---

## This is a Heading

This is a paragraph. You can write your content here using Markdown.

- This is a list item.
- Another list item.
```

---

## 3. The Publishing Workflow (3 Simple Steps)

*Follow these steps every time you finish writing or making changes.*

### Step 1: Preview Your Changes

Run the local preview (`npm run dev`) to make sure everything looks perfect.

### Step 2: Commit Your Work

Open your terminal and run these commands from the main project folder (`Litchi`):

```bash
# Go to the main project directory
cd ~/Desktop/LitchCodex/Litchi

# Add all your changes
git add .

# Commit them with a message
git commit -m "docs: add a new post about my adventure"
```

### Step 3: Push to GitHub

This final step publishes your changes to the world.

```bash
git push
```

**That's it!** Wait 1-2 minutes, and your live website will be updated.

---

## 4. Collaborating with AI (Requesting Features)

*If you want to change the blog's design, add a new feature (like a search bar), or fix a bug, just ask your AI assistant.*

### The "Magic" Onboarding Prompt

If you ever start a new chat with Manus (or any other AI), give it this prompt to get it up to speed instantly:

> "Please read the project handbook at `docs/AI_HANDBOOK.md` to get started."

This tells the AI everything it needs to know to help you effectively.

---

## 5. Quick Reference: Common Commands

| Task | Command |
|:-----|:--------|
| Start local preview | `cd ~/Desktop/LitchCodex/Litchi/03_Products/english-blog && npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Commit changes | `git add . && git commit -m "your message"` |
| Push to GitHub | `git push` |
| Pull latest changes | `git pull` |

---

## 6. Troubleshooting

### My local preview won't start

**Solution:** Make sure you've installed dependencies first.

```bash
cd ~/Desktop/LitchCodex/Litchi/03_Products/english-blog
npm install
npm run dev
```

### My changes aren't showing on the live site

**Solution:** Check these things:
1. Did you push to GitHub? (`git push`)
2. Did you push to the `main` branch? (Check with `git branch`)
3. Wait 1-2 minutes for GitHub Actions to deploy.
4. Check the Actions tab on GitHub to see if the deployment succeeded.

### I forgot my Git commands

**Solution:** Refer to the table in Section 5, or just ask your AI assistant!

---

## 7. Need Help?

- **For technical issues:** Ask your AI assistant (Manus or Codex) for help. Give them the onboarding prompt from Section 4.
- **For Git issues:** Check `MEMORY.md` in the project root for historical context.
- **For design questions:** Refer to `docs/DECISIONS.md` to see why certain choices were made.

---

**Happy blogging!** 🎉

**End of User Manual**
