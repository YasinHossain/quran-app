# TypeScript Cleanup Plan

_Last updated: 2025-03-17_

## Snapshot
- `npx tsc --noEmit --pretty false` currently reports **510 errors** (captured on 2025-03-17).
- Errors span application code, tests, and tooling scripts; most stem from stricter typings introduced in the refactor branch.

## Recommended Fix Order
1. **Unblock compilation**: resolve missing React JSX types and restore Jest mocks so test helpers no longer crash **(Completed)**
2. **Address high-churn props/hooks**: align ref/`undefined` handling in bookmark and home components where contracts changed **(Completed)**
3. **Restore alias coverage**: ensure new path aliases (`@tests`, `@infra`, etc.) are mapped in `tsconfig.json` and `tests/setup/jest-resolver.mjs`.
4. **Normalize domain/test fixtures**: revisit helpers that now require explicit `undefined` typing or new value objects.
5. **Tidy tooling scripts**: update TypeScript configs or helper types under `tools/ai/*` and `tools/scripts/*`.
6. **Re-run `npm run type-check`** after each batch; once clean, run the full `npm run check` suite.

## Key Buckets & Notes

### 1. JSX namespace & layout updates
- Completed on 2025-03-17; ensure new files continue to import the React types they use.

### 2. Router mocks & jest helpers
- Router helpers updated to use `jest.fn()` (2025-03-17). Verify future changes keep mocks injectable before tests import them.

### 3. Ref/optional prop regressions **(Completed)**
- `app/(features)/bookmarks/components/SurahDropdown.tsx:45` and `.../SurahSelector.tsx:88` updated on 2025-03-17 to accept mutable refs and optional values safely (Completed).
- `app/(features)/home/components/PageTab.tsx:88-89` now handles `null` refs via explicit `RefObject<HTMLDivElement | null>` (2025-03-17) (Completed).
- Surah settings/translation panel hooks now accept nullable refs and stricter tab unions (Completed); outstanding issues remain in the tafsir/reader stack.

### 4. Home/Verse fixtures
- `app/(features)/home/__tests__/VerseOfDay.transition.test.tsx:48-91` passes `Verse | undefined`; either guard before invoking or accept optional values.
- `app/(features)/home/hooks/useVerseOfDay.ts:78` assigns a readonly array to a mutable field—clone via `Array.from()` or relax typing.

### 5. Language code assumptions
- `app/(features)/juz/[juzId]/JuzClient.tsx:17` and `app/(features)/page/[pageId]/hooks/usePageData.ts:30,37` treat strings as `LanguageCode`; align with the new type definition or convert.

### 6. Path alias resolution
- `tests/setup/setupTests.ts:10` fails to resolve `@tests/setup/msw/server`; confirm `tsconfig.json` paths and the new `tests/setup/jest-resolver.mjs` cover the alias.
- `tests/unit/infrastructure/monitoring/*.test.ts` cannot find `@infra/monitoring`; update path mappings or adjust imports.

### 7. Domain entity fixtures
- `tests/unit/domain/entities/Verse/test-utils.ts:11` and related helpers now require optional `translation` fields to include `undefined` explicitly.
- `tests/unit/domain/services/BookmarkImportService.import.test.ts:108-109` and `tests/unit/infrastructure/errors/ErrorHandler.actions1.test.ts:*` need null checks before dereferencing.

### 8. Tooling scripts
- `tools/ai/parser/*` and `tools/scripts/*` surface many `string | undefined` violations; normalize parsing defaults or tighten argument checks.
- `tools/ai/parser/tokens.ts:58` uses a regex flag unavailable under the current `tsconfig` target (ES2017). Consider raising the target or guarding usage.

## How to Use This Plan
- Work top-to-bottom; after each bucket, run `npm run type-check` to confirm progress.
- Keep a running tally of remaining errors by re-running `npx tsc --noEmit --pretty false` and noting the count of `error TS` lines.
- Once `type-check` is clean, follow with `npm run check` to catch lint/test regressions.

## Helpful Commands
- `npx tsc --noEmit --pretty false`
- `(Select-String -Path ts-errors.log -Pattern "error TS").Count`
- `npm run check`

