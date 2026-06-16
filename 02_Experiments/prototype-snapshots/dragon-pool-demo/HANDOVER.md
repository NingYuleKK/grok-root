# Dragon Pool Demo Handover

Last updated: 2026-04-27

## What Exists

- Vite + React + TypeScript single page demo.
- Rule module at `src/dragonPool.ts`.
- Rule tests at `src/dragonPool.test.ts`.
- Main UI at `src/App.tsx`.
- Visual styling and reveal animations at `src/styles.css`.

## Product Notes

- The demo intentionally avoids rewards, probabilities, pools of money, spin mechanics, and lottery language.
- The core feeling is public room momentum: contribution messages, rising heat, tense progress states, and a shared reveal.
- The most important product question is whether 60%-90% progress creates “快了，快点亮了”的 pressure.

## Verification

- `npm test`: passing, 3 tests.
- `npm run build`: passing.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Local dev server confirmed HTTP 200 at `http://localhost:5176/`.

## Next Iteration Ideas

- Add an auto-simulate mode to mimic multiple users sending gifts while litch observes the room mood.
- Add two visual variants: sweeter “撒糖局” and stronger “夜场高燃局”.
- Tune threshold and gift values after watching whether users feel collective progress or individual spending.
