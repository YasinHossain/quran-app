# Lint Warning Remediation Plan

Use this plan sequentially. Each phase is self-contained; finish one before moving to the next.

---

## Phase 1 – Core Hook Cleanup

### Goals

- Refactor pp/(features)/bookmarks/hooks/useBookmarkVerse.ts to satisfy:
  - max-lines-per-function (hook currently 121 lines)
  - complexity warnings (functions ≥ 11)
  - max-lines for the file (230 lines > 120)

### Guidance

1. Extract helper utilities (e.g., identifier normalization, fallback builders) into dedicated functions or modules.
2. Keep the main hook focused on wiring SWR + bookmark syncing.
3. Ensure each helper remains below the complexity threshold (≤10) and limit the hook to ≤50 lines if feasible.

### Acceptance

- ESLint reports no warnings for this file.
- Unit tests touching bookmark hooks still pass.

---

## Phase 2 – Planner UI Components

### Targets

- pp/(features)/bookmarks/components/PlannerGrid.tsx
- pp/(features)/bookmarks/planner/components/DeletePlannerModal.tsx
- pp/(features)/bookmarks/planner/components/PlannerCard.tsx
- pp/(features)/bookmarks/planner/components/PlannerProgressSection.tsx
- pp/(features)/bookmarks/planner/utils/buildPlannerGroupCard.ts

### Actions

1. Split each large component into smaller subcomponents (header, card body, status badges, etc.).
2. For the utilities file, move each helper into its own module or keep them in the same file but under 200 lines, with per-function length/compexity under thresholds.
3. Re-run lint to verify all planner-related warnings are gone.

### Acceptance

- No max-lines-\* or complexity warnings remain for planner files.
- Planner UI behavior unchanged (spot-check create/delete flows).

---

## Phase 3 – Bookmark Verse Rendering

### Targets

- pp/(features)/bookmarks/components/BookmarkVerseList.tsx
- pp/(features)/bookmarks/components/bookmark-verse-sidebar/VerseItem.tsx
- pp/(features)/bookmarks/components/shared/folder/FolderItem.tsx

### Actions

1. Extract small components for list headers, empty state, and list items.
2. Move logic-heavy blocks (e.g., animated cards, remove buttons) into helper components/hooks.
3. Keep each arrow function ≤50 lines, complexity ≤10.

### Acceptance

- Lint warnings for files above are gone.
- Virtualized list continues to render correctly.

---

## Phase 4 – Pinned & Last-Read Pages

### Targets

- pp/(features)/bookmarks/pinned/components/PinnedVersesList.tsx
- pp/(features)/bookmarks/pinned/page.tsx
- pp/(features)/bookmarks/last-read/components/LastReadGrid.tsx
- pp/(features)/bookmarks/last-read/components/LastReadCard.tsx

### Actions

1. For each page, extract layout chunks (header, stats, empty state) into subcomponents.
2. Reduce complexity by moving branching logic into helper functions.
3. Ensure file length warnings are cleared.

### Acceptance

- No lint warnings remain for these files.
- Pinned/Last-read pages behave as before.

---

## Phase 5 – Miscellaneous Cleanup

### Remaining Items

- pp/(features)/bookmarks/[folderId]/**tests**/BookmarkFolderClient.test.tsx (missing return type)
- pp/(features)/bookmarks/[folderId]/components/BookmarkFolderView.tsx
- pp/(features)/bookmarks/components/BookmarksSidebar.tsx
- pp/(features)/bookmarks/components/CreatePlannerModal.tsx
- pp/(features)/bookmarks/components/RenameFolderModal.tsx
- pp/(features)/bookmarks/components/shared/BookmarkListComponents.tsx (unused ackLabel)
- Any other lingering warnings (check latest
  pm run lint output)

### Actions

1. Add explicit return types to tests/helpers.
2. Break up remaining oversized components.
3. Remove unused vars.

### Acceptance

- pm run lint produces **zero** warnings.
- Spot-check affected UIs/tests.

---

## Phase 6 – Regression Sweep

### Actions

1. Re-run
   pm run lint,
   pm run type-check, and the Jest suite.
2. Verify planner, bookmarks, and pinned flows manually (smoke test).
3. Document key refactors in the PR description.

### Acceptance

- All commands pass locally.
- No ESLint warnings remain.
- QA checklist updated if needed.
