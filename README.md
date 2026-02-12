# Litchi Workspace

This repository is the execution base for an 8-week "engineering + vibe coding" plan.

## Quick Start
1. Copy environment template:
   - `cp .env.example .env`
2. Install local trace command shim:
   - `./scripts/build.sh`
3. Run the command:
   - `.local/bin/trace hello`
   - `.local/bin/trace hello --format json`
4. Run checks:
   - `./scripts/all.sh`

## Project Conventions
- Workflow: Issue -> Branch -> PR -> Review -> Release
- Branch prefix: `codex/`
- Rules and collaboration contract: `AGENTS.md`
- Ongoing context and plan status: `MEMORY.md`

## Week 1 Deliverable: Hello Repo CLI
- Command: `trace hello`
- Purpose: print minimal project status for a runnable demo.
- Required output fields:
  - `project`
  - `message`
  - `timestamp`

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

## Development Commands
- Build + install package: `./scripts/build.sh`
- Run CLI (text): `.local/bin/trace hello`
- Run CLI (json): `.local/bin/trace hello --format json`
- Optional `trace` command style:
  - `PATH="$(pwd)/.local/bin:$PATH" trace hello`
- Run tests: `./scripts/test.sh`
