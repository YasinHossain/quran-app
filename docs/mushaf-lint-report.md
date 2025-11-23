# Mushaf Lint Report

- Command: `npx eslint "app/(features)/surah/components/surah-view/MushafMain.tsx" "app/(features)/surah/hooks/mushafFontScale.ts" "app/(features)/surah/hooks/useMushafReadingView.ts" "app/(features)/surah/hooks/useQcfMushafFont.ts" "app/(features)/surah/components/panels/mushaf-panel/MushafPanel.tsx" "app/shared/reader/settings/MushafSettings.tsx"`
- Result: 7 warnings, 0 errors (latest run).

## Phased Fix Plan

### Phase 1 — Quick wins (low effort)
- [ ] app/(features)/surah/hooks/useQcfMushafFont.ts: 12:33 `max-lines-per-function` (52/50). Likely solved by extracting a small helper or trimming comments.

### Phase 2 — Targeted refactors (medium effort)
- [x] app/(features)/surah/components/surah-view/MushafMain.tsx: previously flagged arrow functions now lint-clean.
- [ ] app/(features)/surah/hooks/useMushafReadingView.ts:
  - 194:60 `complexity` (11/10) in an async arrow function.
  - 230:5 `max-lines-per-function` (60/50), `max-statements` (33/30), and 233:7 `complexity` (23/10) in an async arrow function.

### Phase 3 — Structural cleanups (higher effort)
- [x] app/(features)/surah/components/surah-view/MushafMain.tsx: `MushafMain` component and file length issues resolved.
- [ ] app/(features)/surah/hooks/useMushafReadingView.ts:
  - 129:8 `max-lines-per-function` for `useMushafReadingView` (197/50).
  - 139:1 `max-lines` for the file (307/120).
