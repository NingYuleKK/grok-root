# Electron Cloud Visualizer Snapshot

Source snapshot copied from `/Users/kk/Desktop/LitchCodex/electron-cloud`.

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run build
npm run verify:visual
```

Validation at snapshot time:

- `node --check src/main.js`
- `node --check scripts/verify-visual.mjs`
- Original source directory passed `npm run build`

## Snapshot Scope

Included:

- `index.html`
- `package.json`
- `package-lock.json`
- `src/`
- `scripts/verify-visual.mjs`

Excluded:

- `node_modules/`
- `dist/`
- `artifacts/`

The excluded folders are generated/runtime material and can be rebuilt from the source snapshot.
