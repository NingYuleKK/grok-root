# Local Workspace Recovery Map - 2026-06-15

Purpose: preserve the working map for `/Users/kk/Desktop/LitchCodex` after the OpenAI account disruption, without committing private chat bodies, raw business data, local build caches, or bulky generated dependencies.

## Workspace Shape

`/Users/kk/Desktop/LitchCodex` is a local workbench, not a single git repository.

Tracked repositories inside the workbench:

| Path | Remote | Current state at scan time |
| --- | --- | --- |
| `Litchi` | `git@github.com:NingYuleKK/grok-root.git` | `main`, with local docs/mirror-sync updates before this recovery commit |
| `noonpost` | GitHub `NingYuleKK/noonpost` | `review-pr13`, behind `origin/feature/v02-depth` by 2 commits, local `package-lock.json` modified |
| `noonpost-v07-acceptance` | Git worktree of `noonpost` | `feature/sketch-album`, clean |
| `rmbti` | GitHub remote configured | `main`, local `src/app.js` and `src/styles.css` modified |
| `litch-grokking-objects` | GitHub remote configured | `main`, clean |
| `outputs/hamster-gift-chest-demo` | `https://github.com/NingYuleKK/picopico-treasure-box-demo.git` | `main`, clean |
| `outputs/bach-voice-theatre-v02` | no remote configured | `continuation/bach-voice-theatre-v02`, clean local git repo |

Non-repo or local-only work areas worth preserving by reference:

| Path | Why it matters | Handling |
| --- | --- | --- |
| `outputs/qin-breath-theatre` | Guqin/Qin Breath Theatre prototype with `HANDOVER.md` | Package or promote if it becomes a continuing project |
| `outputs/picopico_concept_flashcards` | PicoPico concept-card HTML prototype with verification screenshots | Keep as output artifact unless continued |
| `outputs/najaf-mode` and `outputs/kaaba-mode` | Route/mode prototypes with desktop/mobile verification images | Archive or promote only if reused |
| `outputs/picopico_anchor_analysis` | Analysis workbook and verification images | Keep local; do not push raw/derived business data without review |
| `github-mirror` | Local mirror of GitHub repos | Regenerate from GitHub; do not treat as source of truth |
| `electron-cloud`, `.codex-deps`, `node_modules`, `dist`, `.next`, `.vercel` | Runtime/build/cache material | Do not commit as recovery data |

## Recovery Priorities

1. Keep `Litchi` as the durable operating map for Co-teacher/root handoff, engineering habits, and recovery notes.
2. Keep project source in its own repo (`noonpost`, `rmbti`, `litch-grokking-objects`, standalone output repos).
3. Use `outputs/` for isolated experiments, then promote only the experiments that need future work.
4. Keep the GitHub mirror as a convenience cache, not as the only copy of important work.
5. Avoid pushing raw private chat text, raw finance/business exports, credentials, generated caches, or personal media.

## GitHub Mirror Safety Net

Two helper scripts are intended to make GitHub recoverability less fragile:

- `scripts/github-mirror-sync.sh`: incrementally mirrors accessible personal/org GitHub repos.
- `scripts/install-github-mirror-launchd.sh`: installs a daily macOS `launchd` job that runs the mirror sync outside Desktop TCC restrictions.

Default mirror targets:

- Manual script default: `/Users/kk/Desktop/LitchCodex/github-mirror`
- Launchd installer default: `$HOME/.codex/github-mirror`

The mirror is useful for disaster recovery and code search, but each canonical project should still be committed and pushed in its own repo.

## Cleanup Recommendation

Do not delete old partitions yet. First sort them into three buckets:

1. `active`: `Litchi`, `noonpost`, `noonpost-v07-acceptance`, `litch-grokking-objects`.
2. `watch`: `rmbti`, `outputs/qin-breath-theatre`, `outputs/bach-voice-theatre-v02`, `outputs/hamster-gift-chest-demo`.
3. `cache/archive`: `github-mirror`, `electron-cloud`, generated `dist`, `.next`, `node_modules`, and one-off analysis output folders.

Suggested next actions:

1. Commit and push this recovery map plus the safe Litchi mirror-sync/docs updates.
2. Review and either commit or intentionally discard the local changes in `noonpost` and `rmbti`.
3. Decide whether `outputs/qin-breath-theatre` should become its own repo or be copied into `Litchi/02_Experiments`.
4. Keep the old workbench intact until the mirror and active repos have a confirmed successful push.

## Follow-Up Cleanup - 2026-06-15

- `rmbti` was fetched and aligned to `origin/main` at `a687ea2`; the earlier local share-card/layout drift was superseded by remote commits that already moved sharing to a pure Canvas path and removed the `html2canvas` dependency. Local validation passed with `node --check src/app.js` and `node src/engine.test.js`.
- `noonpost` was fast-forwarded from `d6270e4` to `d44cf27` on `review-pr13...origin/feature/v02-depth`. Validation passed with `npm run check` and `npm test` (`121` tests).
- The pre-cleanup `noonpost/package-lock.json` metadata-only drift is preserved as a local stash named `wip package-lock metadata drift 2026-06-15`; it touched only `package-lock.json`.
- Correct `rmbti` HTTP preview root is the repository root with URL `/src/index.html`; serving `src/` directly makes `../assets/...` paths look broken.
- `outputs/qin-breath-theatre` and `outputs/bach-voice-theatre-v02` were copied into `02_Experiments/prototype-snapshots/` as source snapshots; `05_Operations/outputs-inventory-2026-06-15.md` records which outputs are git-protected, local-only, or sensitive review-before-publish artifacts.
