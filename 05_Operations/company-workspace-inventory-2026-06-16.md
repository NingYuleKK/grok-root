# Company Workspace Inventory - 2026-06-16

Purpose: classify `/Users/litch/Desktop/litchcodex` after the OpenAI account disruption, without deleting or publishing raw local material.

This is the company-machine companion to the home-machine recovery notes from 2026-06-15. It records what was observed locally and what was copied into `Litchi` as source-only recovery snapshots.

## First Pass Actions

- Fast-forwarded `Litchi` from `3074a92` to `f5f6c07`, bringing in the home-machine recovery map, output inventory, company runbook, prototype snapshots, and mirror scripts.
- Preserved existing untracked files in `Litchi`: `CLAUDE.md` and `02_Experiments/conversation-asset-lab/input/conversations_sample.json`.
- Added source-only snapshots for company-machine local prototypes under `Litchi/02_Experiments/prototype-snapshots/`.
- Did not delete, reset, force-push, or publish raw local exports.

## Canonical Git Repositories

| Path | Remote | Observed state |
| --- | --- | --- |
| `Litchi` | `https://github.com/NingYuleKK/grok-root.git` | `main...origin/main`; untracked local `CLAUDE.md`, `conversation-asset-lab/input/conversations_sample.json`, plus this inventory/snapshot pass. |
| `Litchi_backup` | `https://github.com/NingYuleKK/grok-root.git` | `main...origin/main`, clean. |
| `noonpost` | `https://github.com/NingYuleKK/noonpost.git` | `codex/v12-gpt-image...origin/codex/v12-gpt-image`; untracked `Noonpost_V0.4_开发规范_(Spec).pdf`. |
| `picopico` | `https://github.com/NingYuleKK/picopedia.git` | `content/2026-06-operating-and-demo-update`; many untracked forecast/gross-margin docs plus `exports/` and `outputs/`. Treat as review-before-publish business material. |
| `picopico-inspiration` | `https://github.com/NingYuleKK/picopico-inspiration.git` | `main...origin/main`; substantial tracked source changes and tests plus new drizzle migrations. Inspect diff before any cleanup. |
| `litch-cortex` | `https://github.com/NingYuleKK/litch-cortex.git` | `main...origin/main`; untracked `.claude/` and `docs/v0.8-post-merge-qa.md`. |
| `litch-nexus` | `https://github.com/NingYuleKK/litch-nexus.git` | `codex/issue-1-side-by-side-comparison-view...origin/codex/issue-1-side-by-side-comparison-view`; untracked `CLAUDE.md`. |
| `litch-notes-jpm` | `https://github.com/NingYuleKK/litch-notes-jpm.git` | `main...origin/main`; untracked `CLAUDE.md`. |
| `rmbti` | `https://github.com/NingYuleKK/rmbti.git` | `feat/lite...origin/feat/lite`, clean. |

## Source Snapshots Added In `Litchi`

| Original path | Snapshot path | Exclusions |
| --- | --- | --- |
| `pico-anchor-rebirth-demo` | `Litchi/02_Experiments/prototype-snapshots/pico-anchor-rebirth-demo` | `node_modules`, `dist`, `public/generated`. |
| `dragon-pool-demo` | `Litchi/02_Experiments/prototype-snapshots/dragon-pool-demo` | `node_modules`, `dist`. |
| `gift-mining-demo` | `Litchi/02_Experiments/prototype-snapshots/gift-mining-demo` | None needed; source/test files only. |
| `co-visible-room` | `Litchi/02_Experiments/prototype-snapshots/co-visible-room` | `artifacts`. |
| `sacred-cube` | `Litchi/02_Experiments/prototype-snapshots/sacred-cube` | None needed; static source/test files only. |

## Local-Only Or Non-Repo Work Areas

| Path | Handling |
| --- | --- |
| `pico-anchor-rebirth-demo` | High-value PicoPico demo source now protected by snapshot; generated material images remain local. |
| `dragon-pool-demo` | Vite/React demo source now protected by snapshot; build output remains local. |
| `gift-mining-demo` | Small H5 demo source now protected by snapshot. |
| `co-visible-room` | Small room-state prototype source now protected by snapshot; verification image remains local. |
| `sacred-cube` | Static JS prototype source now protected by snapshot. |
| `furniture_install_plan` | Household coordination artifacts; keep local unless Litch asks to publish. |
| `pet-runs` | Generated pet/spritesheet runs; keep local unless packaging a specific pet. |
| `tmp` | Temporary work area; inspect before deleting. |
| `outputs` | Empty at scan time. |
| `node_modules` | Top-level dependency/cache folder; can be regenerated if not intentionally used. |

## Review-Before-Publish Material

- `picopico/exports/` and `picopico/outputs/` may contain raw or derived business data.
- `picopico` untracked forecast, gross-margin, cashflow, and operating docs should be reviewed for sensitivity before commit.
- `noonpost/Noonpost_V0.4_开发规范_(Spec).pdf` is an untracked spec artifact; confirm whether it belongs in repo before publishing.
- `Litchi/02_Experiments/conversation-asset-lab/input/conversations_sample.json` may contain conversation data; inspect before commit.
- `CLAUDE.md` files across repos may be local agent instructions; inspect before committing.

## Validation Run During This Pass

Sensitive-string scan was run across `02_Experiments/prototype-snapshots` and `05_Operations`. Matches were reviewed as false positives:

- the scan commands embedded in recovery docs
- demo reset/visual `token` wording in `pico-anchor-rebirth-demo`
- CSS `mask-image`
- package-lock references to `js-tokens`

Snapshot validation:

| Target | Command | Result |
| --- | --- | --- |
| `gift-mining-demo` snapshot | `npm test` | 7 tests passed. |
| `co-visible-room` snapshot | `npm test` | 1 test passed. |
| `sacred-cube` snapshot | `node sacred-cube.test.mjs` | 3 tests passed. |
| `dragon-pool-demo` original source | `npm test` | 1 file / 3 tests passed. Snapshot excludes `node_modules`, so test was run from the original directory. |
| `pico-anchor-rebirth-demo` original source | `npm test` | 2 files / 3 tests passed. Snapshot excludes `node_modules`, so test was run from the original directory. |

Recommended final scan before committing snapshots:

```bash
cd /Users/litch/Desktop/litchcodex/Litchi
rg -n "api[_-]?key|secret|token|password|BEGIN (RSA|OPENSSH|PRIVATE)|sk-[A-Za-z0-9]" 02_Experiments/prototype-snapshots 05_Operations
```

If dependencies are later installed inside the Vite snapshots, validate the copied directories directly:

```bash
cd /Users/litch/Desktop/litchcodex/Litchi/02_Experiments/prototype-snapshots/gift-mining-demo && npm test
cd /Users/litch/Desktop/litchcodex/Litchi/02_Experiments/prototype-snapshots/dragon-pool-demo && npm test
cd /Users/litch/Desktop/litchcodex/Litchi/02_Experiments/prototype-snapshots/co-visible-room && npm test
cd /Users/litch/Desktop/litchcodex/Litchi/02_Experiments/prototype-snapshots/sacred-cube && node sacred-cube.test.mjs
```

## Cleanup Boundary

Do not delete original folders yet. The safe next move is to run the sensitive-string scan, validate copied snapshots, inspect `picopico` and `picopico-inspiration` diffs separately, then commit only the safe inventory/snapshot material to `Litchi`.
