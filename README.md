# Litchi Workspace

This repository is the execution base for an 8-week "engineering + vibe coding" plan.

## Quick Start
1. Copy environment template:
   - `cp .env.example .env`
2. Run all baseline checks:
   - `./scripts/all.sh`

## Project Conventions
- Workflow: Issue -> Branch -> PR -> Review -> Release
- Branch prefix: `codex/`
- Rules and collaboration contract: `AGENTS.md`
- Ongoing context and plan status: `MEMORY.md`

## Scripts
- `./scripts/lint.sh`
- `./scripts/test.sh`
- `./scripts/build.sh`
- `./scripts/all.sh`

## Repository Structure
- `00_Inbox/` incoming ideas and notes
- `01_Research/` research material
- `02_Experiments/` prototypes and exploratory builds
- `03_Products/` production-facing artifacts
- `04_Assets/` shared assets
- `05_Operations/` operational docs/process
- `06_Archive/` archived materials
- `docs/` lightweight design decisions and engineering notes

