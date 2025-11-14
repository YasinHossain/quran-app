# Unused Code Cleanup Plan

Findings gathered from running `npx knip --no-progress` on this branch (see `/tmp/knip.log`). Each bullet lists the files flagged as unused plus the reason they can be safely removed. Work through them gradually and re-run Knip after each batch.

## 1. Surah Reader Settings Remnants ✅
- `app/(features)/surah/components/panels/arabic-font-panel/{ArabicFontSearch.tsx,ArabicFontSelectionList.tsx}`
- `app/(features)/surah/components/settings/{index.ts,SettingsHeader.tsx}`
- `app/(features)/surah/components/Verse.tsx`
Context: `ReaderShell` owns settings, tabs, and verse rendering. The redundant Surah-specific folder was removed, and the settings primitives now live under `app/shared/reader/settings` (re-exported via `app/(features)/surah/components`). No additional cleanup required.

## 2. Logging & DI Infrastructure ✅
Removed `app/shared/services/LoggingService.ts`, `src/infrastructure/monitoring/LoggerAdapter.ts`, and `src/infrastructure/di/{index.ts,types.ts}`. The dependency-injection experiment was abandoned, repositories are instantiated directly, and these adapters weren’t imported anywhere (`rg -n "LoggingService"` / `"infrastructure/di"`). Pruning them prevents TypeScript from complaining about missing DI dependencies.

## 3. App-Level Test Utils ✅
- Removed `app/testUtils/{contextTestUtils.tsx,performance/**/*,performanceTestUtils.tsx,providers.tsx,render.tsx}` plus the unused `app/(features)/surah/components/__tests__/SurahView/performance.test.tsx`.
Modern suites live in `tests/`, so deleting these legacy helpers (and their dependent test) eliminates dead code and the extra `isolatedModules` warnings.

## 4. Stale Assets & Configs ✅
Removed `public/{fallback-TKlxntsTqc2SatXGlPnvD.js,workbox-9a61f93b.js}` (Workbox artifacts), the duplicate `base-card.config.ts` at repo root, and the unused `config/env/config.ts`, `formatSurahSubtitle.ts`, and `lib/styles/patterns.ts`. Also deleted the abandoned `lighthouserc.js` since the `npm run lighthouse` script relies on CLI defaults.

## 5. AI & Template Tooling
- `scripts/ai-development-helper.ts` plus `scripts/ai-development-helper/{regen,sync,utils}.ts`
- `scripts/{architecture-compliance-check.mjs,reporter.ts,rules.ts,scanner.ts}`
- `templates/{ai-compliant/**,architecture/**}`
- `tools/ai/**`
- `tools/scripts/{generateFeature.ts,generate-component.mjs,generate-tokens.ts,migrate-tokens.mjs,validate-tokens.ts,fetchData.ts}`
All of these assets have been removed; recreate only if you decide to bring back the automation workflow.

## 6. Test Harness Debris
- `lib/__tests__/responsive/test-utils.ts`
- `tests/e2e/global-setup.ts`
- `tests/setup/jest-resolver.mjs`
Legacy configs from previous testing stacks; modern Playwright/Jest setups don’t reference them.

## Cleanup Workflow
1. Remove one category at a time (e.g., Surah settings).
2. Run `npx knip --no-progress` to ensure the list shrinks.
3. Validate with `npm run lint`, `npm run type-check`, and `npm run test`.
4. Repeat until the report stops flagging these files. EOF
