# Merge Readiness Report

Generated: `2026-01-19T21:19:59Z`  
Commit: `ad7156ca`  
Environment: Node `v20.19.5`, npm `10.8.2`

## Summary

- **Not merge-ready** (E2E blocked in this environment; Storybook + size-limit failing here).
- Full logs are saved under `codex-artifacts/`.

## Checks Run

### Formatting (Prettier)

- Command: `npx prettier --check .`
- Result: **PASS**
- Log: `codex-artifacts/prettier-check-after.log`

### Lint (ESLint)

- Command: `npm run lint`
- Result: **PASS with warnings** (0 errors; warnings remain from size/complexity rules)
- Log: `codex-artifacts/lint.log`

Notes:

- `npm run lint:ci` is stricter (`--max-warnings=0`) and would fail until warnings are addressed.
- GitHub workflows in `.github/workflows/*.yml` run `npm run lint` (not `lint:ci`).

### TypeScript

- Command: `npm run type-check`
- Result: **PASS**
- Log: `codex-artifacts/type-check.log`

### Unit/Integration Tests (Jest)

- Command: `npm run test:ci`
- Result: **PASS** (`164` suites passed, `1` skipped; `562` tests passed, `3` skipped)
- Log: `codex-artifacts/jest-ci.log`

### Build (Next.js)

- Command: `TMPDIR=/tmp npm run build`
- Result: **PASS**
- Notes:
  - Without `TMPDIR=/tmp`, the build fails with `EACCES` attempting to create a directory under `.../AppData/Local/Temp/...`.
- Log: `codex-artifacts/next-build.log`

### E2E (Playwright)

- Command: `npm run test:e2e`
- Result: **FAIL** in this environment (WebKit deps missing)
- Notes:
  - In Linux/WSL, Playwright gets past the Windows `TMPDIR`/Temp-path issue and the `webServer` starts normally.
  - This environment is missing native libraries required for Playwright WebKit; WebKit-based projects fail to launch until deps are installed.
  - Fix (WSL/Ubuntu): `npx playwright install` then `sudo npx playwright install-deps` (or `sudo npx playwright install --with-deps`).
  - Workaround (no sudo / no WebKit): run Chromium-only projects (e.g. `npm run test:e2e:chromium`).
- Logs:
  - `codex-artifacts/playwright-e2e.log` (temp/cache permission error from the older Windows environment)
  - `codex-artifacts/playwright-e2e-tmpdir.log` (webServer start failure from the older Windows environment)
  - `codex-artifacts/next-start-production.log` (port bind `EPERM` from the older Windows environment)

### Storybook

- Command: `HOME=/tmp CI=1 STORYBOOK_DISABLE_TELEMETRY=1 npm run storybook:build`
- Result: **FAIL**
- Error: `Cannot find module 'next/config'` from `@storybook/nextjs`
- Log: `codex-artifacts/storybook-build-ci.log`

### Size Limits

- Command: `TMPDIR=/tmp npm run size-limit`
- Result: **FAIL**
- Error: Chrome executable not found at `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`
- Log: `codex-artifacts/size-limit.log`

## What To Fix Before Merging to `master`

1. Run Playwright E2E in an environment that allows opening a local port for `next start` (and where Playwright temp/cache + browsers are available).
2. If you intend to use `npm run check` (or `lint:ci`), address the remaining ESLint warnings.
3. If Storybook is required in CI, address the `@storybook/nextjs` + Next.js compatibility issue (`next/config` resolution).
4. If `size-limit` is required, configure a valid Chrome/Chromium path for the environment running it (or adjust the preset to use an available browser).
