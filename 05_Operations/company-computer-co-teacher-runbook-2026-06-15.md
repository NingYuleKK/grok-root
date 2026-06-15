# Company Computer Co-Teacher Runbook - 2026-06-15

Audience: Co-teacher/Codex running on Litch's company computer.

Goal: repeat the home-machine recovery cleanup safely: preserve important local context, push durable maps to GitHub, and avoid deleting or publishing sensitive material by accident.

## Operating Principle

This is a preservation pass, not a cleanup sprint.

Do not delete, reset, force-push, or publish raw local artifacts during the first pass. First make the machine inspectable and recoverable.

## Step 0 - Confirm Identity And Workspace

Ask Litch for the local workbench path if it is not obvious. On the home machine it was:

```bash
/Users/kk/Desktop/LitchCodex
```

On the company computer it may differ. Use the actual company-machine path below as `WORKBENCH`.

```bash
pwd
find "$WORKBENCH" -maxdepth 2 -name .git -type d | sort
```

Check GitHub access:

```bash
gh auth status
git -C "$WORKBENCH/Litchi" remote -v
```

If `gh` is missing or unauthenticated, ask Litch before installing or logging in.

## Step 1 - Pull The Recovery Brain First

If `Litchi` exists:

```bash
git -C "$WORKBENCH/Litchi" fetch origin
git -C "$WORKBENCH/Litchi" status --short --branch
git -C "$WORKBENCH/Litchi" pull --ff-only
```

Read these files before acting:

```bash
sed -n '1,240p' "$WORKBENCH/Litchi/05_Operations/local-workspace-recovery-map-2026-06-15.md"
sed -n '1,220p' "$WORKBENCH/Litchi/05_Operations/top-level-workspace-inventory-2026-06-15.md"
sed -n '1,220p' "$WORKBENCH/Litchi/05_Operations/outputs-inventory-2026-06-15.md"
```

If `Litchi` does not exist, clone it first:

```bash
git clone git@github.com:NingYuleKK/grok-root.git "$WORKBENCH/Litchi"
```

Use HTTPS only if SSH auth is not available and Litch approves the auth route.

## Step 2 - Create A Company-Machine Inventory

Do a read-only scan:

```bash
find "$WORKBENCH" -maxdepth 1 -mindepth 1 -type d -print | sort
find "$WORKBENCH" -maxdepth 3 -name .git -type d -print | sort
du -sh "$WORKBENCH"/* "$WORKBENCH"/.[!.]* 2>/dev/null | sort -h
find "$WORKBENCH" -maxdepth 2 -type f \( -name package.json -o -name README.md -o -name HANDOVER.md -o -name AGENTS.md \) -print | sort
```

For each git repo discovered:

```bash
git -C "<repo-path>" status --short --branch
git -C "<repo-path>" remote -v
```

Write a new company-machine inventory in `Litchi/05_Operations/`, for example:

```text
company-workspace-inventory-YYYY-MM-DD.md
```

Record:

- canonical git repositories and their branch/status
- worktrees
- local-only prototypes or source projects
- generated caches and build outputs
- business-derived exports that need review before publishing
- any local stashes created during this pass

## Step 3 - Handle Dirty Repos Conservatively

For each dirty repo:

1. Inspect the diff.
2. Decide whether it is real source work, generated metadata drift, or cache/build output.
3. Do not discard user changes.

Useful commands:

```bash
git -C "<repo-path>" diff --stat
git -C "<repo-path>" diff -- <file>
git -C "<repo-path>" log --oneline --left-right --cherry-pick HEAD...@{upstream}
```

If the dirty change is likely generated noise but you want a reversible clean worktree:

```bash
git -C "<repo-path>" stash push -m "wip <short reason> YYYY-MM-DD" -- <file>
```

If the repo is behind upstream and clean:

```bash
git -C "<repo-path>" pull --ff-only
```

If local commits exist and upstream moved:

```bash
git -C "<repo-path>" fetch origin
git -C "<repo-path>" rebase @{upstream}
```

If rebase conflicts reveal that upstream already superseded the local change, stop and reason from the current diff. Do not force it through just to preserve an outdated patch.

## Step 4 - Validate Active Repos

Use each repo's own scripts. Typical commands from the home-machine cleanup:

```bash
# noonpost
npm run check
npm test

# rmbti
node --check src/app.js
node src/engine.test.js

# static prototypes
node --check app.js
```

Record what was actually run in the company inventory. If a test cannot run because dependencies are missing, say so and ask Litch before installing.

## Step 5 - Snapshot Local-Only Source Projects

Only snapshot small source projects that matter and are not already protected by their own remote.

Good snapshot candidates:

- static prototypes with `index.html`, `styles.css`, `app.js`, `HANDOVER.md`
- small Vite/Three demos with `src/`, `scripts/`, `package.json`, `package-lock.json`

Do not snapshot:

- `node_modules`
- `dist`, `.next`, `.vercel`
- screenshots and generated verification artifacts unless they are the actual deliverable
- raw business CSV/XLSX exports
- private chat bodies, credentials, personal photos, or local browser/session data

Home-machine snapshot destination:

```text
Litchi/02_Experiments/prototype-snapshots/
```

On the company machine, use the same folder if appropriate and add a README entry with:

- original path
- run command
- validation command
- excluded generated folders

Run a quick sensitive-string scan before committing:

```bash
rg -n "api[_-]?key|secret|token|password|BEGIN (RSA|OPENSSH|PRIVATE)|sk-[A-Za-z0-9]" \
  "$WORKBENCH/Litchi/02_Experiments/prototype-snapshots" \
  "$WORKBENCH/Litchi/05_Operations"
```

Expect package names such as `js-tokens` to be false positives; inspect before acting.

## Step 6 - Push The Recovery Notes

Commit only the inventory/runbook/snapshot files that are safe to publish.

```bash
git -C "$WORKBENCH/Litchi" status --short --branch
git -C "$WORKBENCH/Litchi" diff --stat
git -C "$WORKBENCH/Litchi" add 05_Operations 02_Experiments/prototype-snapshots
git -C "$WORKBENCH/Litchi" commit -m "Add company workspace recovery inventory"
git -C "$WORKBENCH/Litchi" push
```

If push is rejected because the remote moved:

```bash
git -C "$WORKBENCH/Litchi" fetch origin
git -C "$WORKBENCH/Litchi" rebase origin/main
git -C "$WORKBENCH/Litchi" push
```

Never force-push recovery notes unless Litch explicitly asks and understands the risk.

## Step 7 - Optional Mirror Safety Net

After the inventory is pushed, run or install the GitHub mirror only if Litch wants a local mirror on the company computer.

Manual sync:

```bash
"$WORKBENCH/Litchi/scripts/github-mirror-sync.sh" --base "$WORKBENCH/github-mirror"
```

Daily launchd sync on macOS:

```bash
"$WORKBENCH/Litchi/scripts/install-github-mirror-launchd.sh"
```

The mirror is a cache, not the canonical source of truth. Canonical work should still be committed and pushed in its own repo.

## Step 8 - Stop Before Destructive Cleanup

Before deleting or archiving old partitions, produce a list for Litch:

```text
Safe to delete/regenerate:
- ...

Keep local:
- ...

Need Litch review before publishing/deleting:
- ...
```

Wait for Litch's explicit approval before deleting nontrivial folders.

## Home-Machine Reference Outcome

The home-machine cleanup ended with these durable commits in `Litchi`:

- `5891492 Update workspace cleanup status`
- `28a2ef1 Archive prototype output snapshots`
- `9ba0f8d Document top-level workspace partitions`

Use these as examples of the expected style: small inventories, source snapshots only, explicit validation notes, and no destructive cleanup in the same pass.
