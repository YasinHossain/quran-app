# Juz Navigation Simplification Plan

## Context

- Current Juz implementation (`app/(features)/juz/[juzId]`) behaves like a full reader: bespoke content layout, settings sidebar wrapper, audio player wiring, and infinite scroll.
- Product goal: sidebar/home cards for **Surah**, **Juz**, and **Page** should simply navigate the user into the existing reader experience (the same one used for Surah today) without duplicating reader logic.
- Visual design (cards, typography, layout) must remain unchanged; only the plumbing behind the taps/clicks should change.

## Objectives

1. Treat the Surah/Juz/Page cards/tabs purely as navigation controls.
2. Reuse an existing reader page (or a single shared reader shell) after navigation for all three entry points.
3. Remove Juz-specific reader components and state that are no longer needed once navigation is delegated.
4. Keep translation/word-language settings, audio controls, and infinite scroll logic centralized in the shared reader.

## Step-by-Step Guide

1. **Audit Current Entry Points**
   - Identify every Surah/Juz/Page card or tab (home screen cards, sidebar panels, mobile overlays).
   - Trace their onClick/onSelect handlers to see how they currently mount dedicated readers.

2. **Decide on the Destination Reader**
   - Confirm which page already provides the desired reader shell (likely `app/(features)/surah/[surahId]`).
   - If a neutral “reader wrapper” does not exist, extract one central component that can accept params (`surahId`, `juzId`, `pageNumber`) and render the existing experience.

3. **Update Navigation Handlers**
   - For every Surah card/tab (home + sidebar): ensure handlers call `router.push('/surah/${id}')`.
   - For Juz cards/tabs: change handlers to `router.push('/juz/${id}')` (or whatever route will use the shared reader).
   - For Page cards/tabs: same approach with `/page/${pageNumber}`.
   - Remove any inline rendering of reader components inside the home tabs or sidebar panels—navigation only.

4. **Simplify the Juz Route**
   - If `/juz/[juzId]` should now reuse the shared reader, replace its bespoke components with the shared reader component and the minimum data-loading hook required to fetch verses.
   - Delete or archive unused files such as `JuzSettings.tsx`, `JuzContent.tsx`, `JuzHeader.tsx`, etc., once you confirm nothing references them.

5. **Unify Settings & Player State**
   - Ensure translation/word-language state, audio playback, and infinite scroll live in the shared reader logic.
   - Remove duplicated state management from the Juz module that is no longer invoked.

6. **Sweep the UI for Regressions**
   - Verify that the tab/card UI still renders identically (no styling changes expected).
   - Navigate via each card to confirm you land in the reader with the correct section loaded.
   - Check audio controls, translation toggles, and scrolling work after the refactor.

7. **Clean Up Types and Tests**
   - Delete or update tests that were specific to the old Juz reader components.
   - Add integration tests (or update existing ones) to assert the navigation pushes the router and that the reader loads the right data.
   - Re-run `npm run type-check` and `npm run test` to ensure no leftover references remain.

## Suggested Commit Outline

- `refactor(juz): route navigation through shared reader`
- `refactor: remove unused juz reader components`
- `test: update navigation coverage for surah/juz/page tabs`

Keep commits small and reversible; follow the project’s Conventional Commit format.
