# PicoPico Sensitive Assets Inventory - 2026-06-16

Purpose: classify the untracked `picopico` management/forecast artifacts on the company machine without publishing raw business data by accident.

Workspace: `/Users/litch/Desktop/litchcodex/picopico`

Branch observed:

```text
content/2026-06-operating-and-demo-update
```

## Git Status At Scan Time

Untracked paths:

```text
README 2.md
content/context/cashflow-margin-operating-model.md
docs/cashflow-july-input-checklist-2026.md
docs/cashflow-model-acceptance-2026-06.md
docs/cashflow-model-scope-and-metric-calibration-2026-06.md
docs/gmv-forecast-output-structure-v2-2026-06-08.md
docs/gmv-forecast-output-structure-v2-2026-06-08.zh.md
docs/gross-margin-management-brief-2026-06.md
docs/monthly-operating-cost-regression-summary-2026-06.md
exports/
outputs/
```

## Publishability Classification

| Path | Classification | Reason |
| --- | --- | --- |
| `content/context/cashflow-margin-operating-model.md` | Review before publish | Management-facing synthesis with cashflow, margin, settlement, and liquidity assumptions. It has useful PicoPedia value but contains sensitive operating thresholds. |
| `docs/cashflow-july-input-checklist-2026.md` | Review before publish | Operational input checklist with cash timing, payout, and liquidity assumptions. Good internal artifact, not public by default. |
| `docs/cashflow-model-acceptance-2026-06.md` | Review before publish | Cashflow model acceptance note with concrete cash pressure numbers and role boundaries. Internal management layer. |
| `docs/cashflow-model-scope-and-metric-calibration-2026-06.md` | Review before publish |口径 and calibration bridge for GMV / flow / cash / margin. Safe only after deliberate redaction or internal-public boundary confirmation. |
| `docs/gmv-forecast-output-structure-v2-2026-06-08.md` | Likely publishable as internal context | Mostly structural model design. Check whether examples or source fields reveal sensitive assumptions before committing. |
| `docs/gmv-forecast-output-structure-v2-2026-06-08.zh.md` | Likely publishable as internal context | Chinese-facing version of the structural model design. Preserve exact Chinese wording if committed. |
| `docs/gross-margin-management-brief-2026-06.md` | Review before publish | Meeting brief with scenario margin bands and business assumptions. Useful but sensitive. |
| `docs/monthly-operating-cost-regression-summary-2026-06.md` | Do not publish without Litch review | Derived from a local workbook under Downloads and contains month-by-month cost figures. |
| `exports/` | Do not publish by default | Rendered GMV rolling forecast HTML/PDF. Treat as derived management output. |
| `outputs/forecasting/2026-05-28_gmv_v0` | Do not publish by default | Forecast CSVs and model profiles; may contain raw/derived actuals. |
| `outputs/forecasting/2026-05-28_gmv_v1` | Do not publish by default | Future calendar CSV; inspect before reuse. |
| `outputs/gmv_forecast_v2_2026-06-08` | Do not publish by default | Workbook, source data JSON, formula diagnostics, and rendered workbook screenshots. High-value recovery asset, but not public-safe by default. |
| `README 2.md` | Low-risk but stale | Older context-base README pointing to paths that may no longer exist. Do not commit without reconciling current repo structure. |

## Sensitive Scan

Ran a high-level credential scan excluding `node_modules`, `.next`, and `out`.

Result: no real credentials were observed. Matches were expected false positives from auth source code, test tokens, documentation placeholders, and package names such as `js-tokens`.

## Recovery Rule

Do not move these artifacts into `Litchi` snapshots. The safe preservation layer is this inventory plus the original local files.

If the next step is to publish into `picopico`, use this order:

1. Commit only structural/explanatory docs first, probably the GMV output-structure docs.
2. Keep workbook/source-data/rendered forecast outputs local unless Litch explicitly approves internal publication.
3. For management briefs, create redacted/public-safe copies rather than committing the raw working drafts.
4. Add `.gitignore` rules for raw `exports/` and `outputs/` if the repo should never stage them accidentally.

## Suggested Next Action

Create a `picopico` branch or commit that only adds safe explanatory docs after Litch confirms the intended audience:

```text
internal PicoPedia context only
team-shareable but not public
public-safe knowledge base
```
