# Top-Level Workspace Inventory - 2026-06-15

Purpose: classify `/Users/kk/Desktop/LitchCodex` top-level folders after recovery cleanup, without deleting original material.

## Canonical Git Repositories

| Path | Status |
| --- | --- |
| `Litchi` | Clean and pushed to `origin/main`. |
| `noonpost` | Clean and aligned to `origin/feature/v02-depth`; one local stash preserves `package-lock.json` metadata drift. |
| `noonpost-v07-acceptance` | Clean git worktree of `noonpost`, aligned to `origin/feature/sketch-album`. |
| `rmbti` | Clean and aligned to `origin/main`. |
| `litch-grokking-objects` | Clean and aligned to `origin/main`. |
| `outputs/hamster-gift-chest-demo` | Clean standalone repo with GitHub remote. |

## Source Snapshots Now Protected In `Litchi`

| Original path | Snapshot path |
| --- | --- |
| `outputs/qin-breath-theatre` | `Litchi/02_Experiments/prototype-snapshots/qin-breath-theatre` |
| `outputs/bach-voice-theatre-v02` | `Litchi/02_Experiments/prototype-snapshots/bach-voice-theatre-v02` |
| `electron-cloud` | `Litchi/02_Experiments/prototype-snapshots/electron-cloud-visualizer` |

## Cache / Regenerable / Review Before Publishing

| Path | Handling |
| --- | --- |
| `.codex-deps` | Local dependency cache; can be rebuilt. |
| `github-mirror` | Local GitHub mirror cache; regenerate with mirror scripts. |
| `electron-cloud/node_modules`, `electron-cloud/dist`, `electron-cloud/artifacts` | Excluded from snapshot; rebuild from source. |
| `outputs/picopico_anchor_analysis`, `outputs/picopico_live_month_comparison` | Business-derived analysis outputs; review with Litch before publishing. |
| `pet-runs`, `hatch-runs` | Generated pet/spritesheet run outputs; keep local unless a specific pet needs packaging/publishing. |

## Current Cleanup Boundary

No original folders were deleted or moved. The cleanup only added Git-protected snapshots and inventories in `Litchi`.
