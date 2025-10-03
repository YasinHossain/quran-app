# Navigation Optimization & Standardization Plan

## Overview

With the reader experience unified through `ReaderShell`, the next goal is to standardize how navigation targets are defined and consumed. This plan outlines incremental steps to organize URL generation, click handlers, shared data sources, UI layout helpers, and test coverage.

## Phase 1: Centralize Navigation Targets

1. **Introduce route helpers**
   - Create `app/shared/navigation/routes.ts` exporting strongly-typed helpers (`buildSurahRoute`, `buildJuzRoute`, `buildPageRoute`).
   - Each helper accepts the minimal identifier (number or string) and returns the canonical path string, ensuring URL encoding where needed.
2. **Update callsites**
   - Replace hard-coded strings in home cards (`SurahCard`, `JuzTab`, `PageTab`), sidebar components (`app/shared/surah-sidebar`), and bottom sheet handlers with the helpers.
   - Extend `StandardNavigationCard` props to accept either a ready-made `href` or an identifier + route builder to reduce repeated glue logic.
3. **Add unit tests**
   - Cover the new helpers to validate formatting and guard against leading slashes or query mistakes.

## Phase 2: Unify Navigation Handlers

1. **Create `useNavigationTargets` hook**
   - Location: `app/shared/navigation/hooks/useNavigationTargets.ts`.
   - Responsibilities: expose memoized callbacks for surah/juz/page navigation that internally use the route helpers and Next.js router.
2. **Adopt hook in UI layers**
   - Sidebar (`Juz.tsx`, `Page.tsx`, `Surah.tsx`) should rely on the hook instead of inlining `router.push` and state tracking.
   - Bottom sheet handlers (`useBottomSheetHandlers`) should delegate to the hook, simplifying testing.
   - Consider returning both `href` and `onNavigate` so components can decide between anchor and imperative navigation.
3. **Testing strategy**
   - Add hook tests with a mocked router to confirm the right paths are pushed.
   - Update existing component tests to assert they call the abstracted callbacks, reducing duplication of router mocks.

## Phase 3: Standardize Data Sources

1. **Single source for Juz/Page listings**
   - Extend `useSurahListFilters` (or add a new selector hook) so both home tabs and sidebar tabs consume the same memoized datasets.
   - Remove direct `juz.json` imports from UI components, letting the hook fetch or reuse cached data.
2. **Progressive enhancement**
   - Accept initial SSR data from `SurahListSidebar` props to avoid regressions.
   - Defer data loading differences (static JSON vs API) to the hook implementation, keeping components declarative.
3. **Validation**
   - Ensure TypeScript typings align across home and sidebar components.
   - Update tests to mock the shared hook rather than the JSON files.

## Phase 4: Shared Layout Utilities

1. **Create a reusable grid wrapper**
   - Add `CardGrid` component (e.g., `app/shared/ui/CardGrid.tsx`) encapsulating the common responsive grid classes used in home tabs and any future panels.
   - Support props for column counts or spacing tokens if designers adjust the layout.
2. **Refactor consumers**
   - Replace repeated `<div className="grid ...">` blocks with the new component in `JuzTab`, `PageTab`, and related home/side panels.
3. **Documentation**
   - Update `STYLING.md` or the design system docs to reference the shared grid pattern so future components adopt it out of the box.

## Phase 5: Strengthen Tests & Docs

1. **ReaderShell smoke test**
   - Add a dedicated test verifying `ReaderShell` wires verse listing, settings, and audio props correctly when given a stub lookup function.
2. **Integration tests**
   - Enhance `JuzPage.test.tsx` and add a parallel `PagePage.test.tsx` to ensure the navigation flow renders verses and uses the route helpers.
3. **Developer documentation**
   - Expand this plan into `docs/architecture/navigation.md` (or similar) once work is complete, explaining the navigation stack, shared hooks, and where to add new entry points.

## Suggested Sequencing

1. Phase 1 (route helpers) – low risk and enables later phases.
2. Phase 2 (navigation hook) – reduces duplication.
3. Phase 3 (data sources) – required before any API or design changes.
4. Phase 4 (layout utilities) – keep UI consistent after data refactor.
5. Phase 5 (tests/docs) – finalize with confidence and context for new contributors.

Work through phases sequentially, committing after each phase to keep changes reviewable.
