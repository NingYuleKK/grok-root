# Outputs Inventory - 2026-06-15

Purpose: classify `/Users/kk/Desktop/LitchCodex/outputs` without deleting or moving the original folders.

## Promoted To Git Backup

These now have source snapshots in `Litchi/02_Experiments/prototype-snapshots/`.

| Output | Status | Notes |
| --- | --- | --- |
| `qin-breath-theatre` | Snapshot copied | High-value guqin prototype; original had no git. |
| `bach-voice-theatre-v02` | Snapshot copied | Local git repo with no remote; snapshot protects source in `Litchi`. |

## Already Git-Protected

| Output | Status | Notes |
| --- | --- | --- |
| `hamster-gift-chest-demo` | Separate git repo, clean | Remote: `NingYuleKK/picopico-treasure-box-demo`. |

## Keep Local / Review Before Publishing

These appear to contain analysis outputs or business-derived artifacts. Do not push raw files without review.

| Output | Reason |
| --- | --- |
| `picopico_anchor_analysis` | Workbook, CSV/TSV summaries, verification screenshots. |
| `picopico_live_month_comparison` | Workbook, CSV/TSV summaries, verification screenshots. |

## Lightweight One-Off Artifacts

Keep until Litch decides whether they matter; no urgent git promotion needed.

| Output | Notes |
| --- | --- |
| `kaaba-mode` | Static mode prototype plus desktop/mobile verification images. |
| `najaf-mode` | Static mode prototype plus desktop/mobile verification images. |
| `picopico_concept_flashcards` | Single-page concept card prototype plus verification images. |
| `spiritual-nomad-geometry-pipeline.md` | Standalone note. |
| `swiss-roll-manifold.svg` | Standalone visual artifact. |

## Cleanup Rule

Do not delete the original `outputs/` folders until:

1. `Litchi` has pushed the snapshot and inventory commit.
2. Any sensitive analysis output has been reviewed by Litch before publication.
3. Active prototypes have either their own repo or a clear product destination.
