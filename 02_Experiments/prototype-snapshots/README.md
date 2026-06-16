# Prototype Snapshots

This folder keeps small source snapshots of high-value prototypes that originally lived in Litch's local Codex workbenches.

The original folders remain untouched. These snapshots exist so the concepts survive account, workspace, or local-folder disruption through the `Litchi` GitHub repo.

## Snapshots

| Snapshot | Original path | Run command |
| --- | --- | --- |
| `qin-breath-theatre` | `/Users/kk/Desktop/LitchCodex/outputs/qin-breath-theatre` | `cd 02_Experiments/prototype-snapshots/qin-breath-theatre && python3 -m http.server 4196` |
| `bach-voice-theatre-v02` | `/Users/kk/Desktop/LitchCodex/outputs/bach-voice-theatre-v02` | `cd 02_Experiments/prototype-snapshots/bach-voice-theatre-v02 && python3 -m http.server 4182` |
| `electron-cloud-visualizer` | `/Users/kk/Desktop/LitchCodex/electron-cloud` | `cd 02_Experiments/prototype-snapshots/electron-cloud-visualizer && npm install && npm run dev` |
| `pico-anchor-rebirth-demo` | `/Users/litch/Desktop/litchcodex/pico-anchor-rebirth-demo` | `cd 02_Experiments/prototype-snapshots/pico-anchor-rebirth-demo && npm install && npm run dev` |
| `gift-mining-demo` | `/Users/litch/Desktop/litchcodex/gift-mining-demo` | `cd 02_Experiments/prototype-snapshots/gift-mining-demo && npm install && npm test` |
| `dragon-pool-demo` | `/Users/litch/Desktop/litchcodex/dragon-pool-demo` | `cd 02_Experiments/prototype-snapshots/dragon-pool-demo && npm install && npm test` |
| `co-visible-room` | `/Users/litch/Desktop/litchcodex/co-visible-room` | `cd 02_Experiments/prototype-snapshots/co-visible-room && npm install && npm test` |
| `sacred-cube` | `/Users/litch/Desktop/litchcodex/sacred-cube` | `cd 02_Experiments/prototype-snapshots/sacred-cube && node sacred-cube.test.mjs` |

## Rules

- Keep only source files and handoff docs here.
- Do not copy `.git`, generated caches, build output, screenshots, localStorage dumps, or private business data.
- If a prototype becomes active again, promote it into its own repository or a named product folder before major development.
