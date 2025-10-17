# CURRENT GOAL — Three‑Column Layout Unification (Phase Plan)

This is the execution plan to make the site’s layout consistent, scalable, and accessible using a single three‑column system. It is designed for AI/automation to follow step‑by‑step and to be future‑proof for public scale.

Reference spec (must follow):
- docs/architecture/THREE_COLUMN_LAYOUT_GUIDE.md

Non‑goals:
- Do not add sidebars to pages that don’t need them (Home, Search for now).
- Do not use raw Tailwind colors; only semantic tokens.

## Phase 1 — Lock Reader Layout Everywhere

Goal
- Ensure Surah, Juz, and Page routes all render via the same Reader shell and desktop columns.

Tasks
- Verify `ReaderShell` usage:
  - Surah: `app/(features)/surah/[surahId]/page.tsx` → `SurahView` → `ReaderShell`
  - Juz: `app/(features)/juz/[juzId]/JuzClient.tsx` → `ReaderShell`
  - Page: `app/(features)/page/[pageId]/PageClient.tsx` → `ReaderShell`
- Confirm the app layout does not mount a global content sidebar.
- Confirm mobile overlays are used only under `lg:hidden`.

Acceptance
- Desktop shows border separators (no shadow) for left/right rails on Surah/Juz/Page.
- No content slides under a sidebar.
- Mobile shows overlays; desktop does not mount overlays.

Validate
- `rg -n "ReaderShell\(|ThreeColumnWorkspace" app/(features)/{surah,juz,page} -S`
- `rg -n "SurahListSidebar" app/(features)/layout.tsx` → should be absent
- `rg -n "lg:hidden" app/shared/reader/ReaderLayouts.tsx` → must wrap mobile overlays

## Phase 2 — Enforce Desktop vs Mobile Sidebar Behavior

Goal
- Prevent shadowed overlays on desktop and double‑mounted rails.

Tasks
- Ensure every overlay (`BaseSidebar`) is mounted in mobile contexts only:
  - Wrap overlay mounts in `lg:hidden`.
  - Avoid relying on `lg:translate-x-0` to force visibility on desktop.
- Columns on desktop must come from `ThreeColumnWorkspace` sidebars with borders.

Acceptance
- No overlay (`BaseSidebar`) is visible on desktop irrespective of internal classes.
- All desktop separators are borders (`border-border`), not shadows.

Validate
- `rg -n "BaseSidebar" app -S` → each usage has an enclosing `lg:hidden` parent or is route‑guarded for mobile only.
- Visual spot check on desktop for Surah/Juz/Page/Bookmarks/Tafsir detail.

## Phase 3 — Bookmarks Consistency

Goal
- Keep Bookmarks on `ThreeColumnWorkspace` and ensure mobile overlay is mobile‑only.

Tasks
- Verify `BookmarksLayout` uses `ThreeColumnWorkspace` and column tokens.
- Verify `BookmarksMobileSidebarOverlay` has `lg:hidden` overlay and consistent tokens.

Acceptance
- Desktop shows bordered left rail; mobile shows overlay only.

Validate
- `rg -n "ThreeColumnWorkspace|WorkspaceMain" app/(features)/bookmarks -S`
- `rg -n "lg:hidden" app/(features)/bookmarks/components/shared/layout/BookmarksMobileSidebarOverlay.tsx`

## Phase 4 — Tafsir Detail Consistency

Goal
- Ensure Tafsir verse page uses the same column and overlay rules.

Tasks
- Verify `app/(features)/tafsir/[surahId]/[ayahId]/page.tsx` uses `ThreeColumnWorkspace` for desktop and `SurahListSidebar`/`SettingsSidebar` inside `lg:hidden` for mobile.
- Optional: consider a `ReaderShell` variant for Tafsir to reduce duplication later.

Acceptance
- Desktop shows bordered rails; mobile overlays only.

Validate
- `rg -n "ThreeColumnWorkspace|WorkspaceMain|SurahListSidebar|SettingsSidebar" app/(features)/tafsir -S`

## Phase 5 — Index Pages (Optional Left Rail)

Goal
- Decide per page whether a left rail improves UX; otherwise keep center‑only.

Pages
- Juz Index: `app/(features)/juz/page.tsx`
- Tafsir Index: `app/(features)/tafsir/page.tsx`
- Home and Search remain center‑only for now.

Option A (Keep Center‑Only)
- No code changes; ensure center uses semantic tokens and adequate spacing.

Option B (Add Left Rail on Desktop)
- Wrap the page in `ThreeColumnWorkspace`.
- Provide `left={<SurahWorkspaceNavigation />}` for desktop.
- For mobile, either skip a left overlay or add it behind a toggle.

Acceptance
- Desktop separators via borders if left rail is added.
- No overlay mounted on desktop.

Validate
- `rg -n "ThreeColumnWorkspace" app/(features)/{juz,tafsir}/page.tsx -S`

## Phase 6 — Tokens, Offsets, and Z‑Index Hygiene

Goal
- Eliminate visual drift from inconsistent classes. Use semantic tokens everywhere.

Tasks
- Ensure columns use `bg-surface` and borders use `border-border`.
- Workspace root uses `bg-background text-foreground` and header‑aware padding.
- Remove raw color utilities in layout containers.

Acceptance
- All layout containers and rails use semantic tokens only.

Validate
- `rg -n "bg-\w|text-\w|border-\w" app/shared/reader app/(features) | rg -v "bg-background|bg-surface|text-foreground|text-muted|border-border|border-transparent"`

## Phase 7 — Tests and Visual Coverage

Goal
- Guard against regressions in separators, spacing, and overlay behavior.

Tasks
- Unit: assert workspace presence and `lg:hidden` overlays on reader routes.
- Integration: navigate Surah → Juz → Page → Tafsir → Bookmarks to ensure consistent borders and no overlap.
- Storybook: states for each archetype at desktop/mobile.

Acceptance
- Tests pass locally and in CI; visuals consistent.

Validate
- `npm run test` and manual visual checks.

## Definition of Done

- Reader (Surah/Juz/Page/Tafsir detail) show identical desktop column behavior with borders.
- Mobile overlays never render on desktop.
- Bookmarks rails align with the same rules.
- Index pages are either center‑only or use a left rail consistently.
- Semantic tokens are used across layout components.
- Tests and visual checks confirm no underlap or shadow separators on desktop.

## Guardrails

- Never mount `BaseSidebar` on desktop. Prefer to not render it at all rather than hide it.
- If a route requires a rail on desktop, render it through `ThreeColumnWorkspace` as a static column.
- Avoid one‑off spacing hacks. The shell’s header/safe‑area handling must be the single solution.
