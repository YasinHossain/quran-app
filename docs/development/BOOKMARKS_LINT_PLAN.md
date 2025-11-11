# Bookmarks Feature Lint Fix Plan

Scope: only `app/(features)/bookmarks/**` warnings.

Goal: reduce warnings to zero in this feature folder without changing behavior.

How to use this plan:
- Work phase-by-phase. After each phase:
  - Run: `npm run lint -- "app/(features)/bookmarks"`
  - Optionally run focused tests: `npm run test -- app/.*/__tests__/Bookmarks.*`

---

## Phase 1 — Pinned: Import Hygiene

Files
- `app/(features)/bookmarks/pinned/components/PinnedItem.tsx`

Tasks
- Remove empty line inside an import group.
- Reorder imports so `@/app/(features)/bookmarks/hooks/useBookmarkVerse` appears before `@/app/(features)/surah/components/verse-card/useVerseCard`.

Acceptance
- No `import/order` warnings in `PinnedItem.tsx`.

---

## Phase 2 — Planner: DeletePlannerModal Size

Files
- `app/(features)/bookmarks/planner/components/DeletePlannerModal.tsx`

Tasks
- Import groups: add a blank line between groups.
- Split `DeletePlannerModal` into smaller parts:
  - `DeletePlannerModalHeader`
  - `DeletePlannerModalBody`
  - `useDeletePlannerHandlers` (confirm/cancel + data updates)
- Keep `DeletePlannerModal` ≤ 50 lines; file ≤ 150 lines.

Acceptance
- No `import/order`, `max-lines-per-function`, or `max-lines` warnings for this file.

Verify
- `npm run lint -- "app/(features)/bookmarks/planner/components/DeletePlannerModal.tsx"`

---

## Phase 3 — PlannerCard: Add Return Type

Files
- `app/(features)/bookmarks/planner/components/PlannerCard.tsx`

Tasks
- Add explicit return type for the flagged function at line ~71.

Acceptance
- No `@typescript-eslint/explicit-function-return-type` warning in this file.

Verify
- `npm run lint -- "app/(features)/bookmarks/planner/components/PlannerCard.tsx"`

---

## Phase 4 — buildPlannerGroupCard.ts: Break Up + Simplify

Files
- `app/(features)/bookmarks/planner/utils/buildPlannerGroupCard.ts`

Tasks
- Split long/complex arrow functions:
  - `normalizePlannerTargets(...)`
  - `deriveChapterGrouping(...)`
  - `computeProgressStats(...)`
  - `buildGroupCardHeader(...)`
  - `buildPlannerCardFromGrouping(...)`
- Remove unused `activeChapter`.
- Keep each function < 50 lines and complexity ≤ 10.
- Keep file under 200 lines (extract helpers to `plannerGroupCard.parts.ts` if needed).

Acceptance
- No `max-lines-per-function`, `complexity`, `no-unused-vars`, or `max-lines` warnings for this file.

Verify
- `npm run lint -- "app/(features)/bookmarks/planner/utils/buildPlannerGroupCard.ts"`

---

## Phase 5 — planGrouping.ts: Reduce Complexity

Files
- `app/(features)/bookmarks/planner/utils/planGrouping.ts`

Tasks
- Remove or use `stripChapterSuffix`.
- Break complex logic into helpers:
  - `parsePlanKey(...)`
  - `groupByChapterOrRange(...)`
  - `sortGroupsByChapter(...)`
  - `formatGroupLabel(...)`
- Add missing return types.
- Ensure each function ≤ 50 lines and complexity ≤ 10.

Acceptance
- No warnings in this file.

Verify
- `npm run lint -- "app/(features)/bookmarks/planner/utils/planGrouping.ts"`

---

## Phase 6 — plannerGroupCard.helpers.ts: Complexity

Files
- `app/(features)/bookmarks/planner/utils/plannerGroupCard.helpers.ts`

Tasks
- Extract nested branches into small helpers:
  - `isSingleChapter(...)`
  - `mergeProgress(...)`
  - `badgeForStatus(...)`
- Keep each helper ≤ 50 lines and complexity ≤ 10.

Acceptance
- No `complexity` warning remains for this file.

Verify
- `npm run lint -- "app/(features)/bookmarks/planner/utils/plannerGroupCard.helpers.ts"`

---

## Phase 7 — Pinned: DOM Prop Hygiene (Follow-Up)

Context
- Pinned tests previously logged an unknown DOM prop `contentClassName` (noise only).

Tasks
- Audit any wrapper that spreads props into native elements and ensure `contentClassName` is not forwarded to DOM.
- Candidates in the pinned flow:
  - `app/(features)/bookmarks/components/shared/BookmarksLayout.tsx`
  - Any wrapper between `BookmarksLayout` and `WorkspaceMain` that might spread props.

Acceptance
- Running `npm run test -- app/.*/__tests__/PinnedPage.test.tsx` logs no unknown DOM prop warnings.

---

## Phase 8 — Final Sweep (Bookmarks Only)

Tasks
- Run `npm run lint -- "app/(features)/bookmarks"`.
- Fix any remaining import ordering or unused vars.

Acceptance
- Zero warnings under `app/(features)/bookmarks/**`.

Verify
- `npm run lint -- "app/(features)/bookmarks"`

