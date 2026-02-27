# Week 1 Issue: Hello Repo CLI

## Goal
Ship a minimal CLI command `trace hello` that prints repository status information.

## Scope
- In scope:
  - Python-based CLI with subcommand `hello`
  - Installable via local command shim (`.local/bin/trace`)
  - Minimal automated tests
  - README usage and test instructions
- Out of scope:
  - Complex plugin architecture
  - External service integration
  - Advanced logging/config system

## Acceptance Criteria
1. Running `trace hello` succeeds and prints a structured status output.
2. Output includes at least: `project`, `message`, and `timestamp`.
3. Test command passes with at least 3 test cases covering core behavior.

## Risks and Rollback
- Risk: local environment may miss Python packaging tools.
- Rollback: revert CLI files and keep Day 0 docs/scripts baseline.
