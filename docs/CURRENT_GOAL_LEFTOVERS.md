# CURRENT GOAL — Three‑Column Unification Leftovers

This checklist tracks the remaining work to fully land the three‑column layout system consistently across the site. It is actionable, verifiable, and aligned with the master spec.

Reference spec (must follow):
- docs/architecture/THREE_COLUMN_LAYOUT_GUIDE.md

Out of scope for this checklist:
- Adding new sidebars to Home/Search
- Large refactors beyond the layout rules

## 1) Overlay Audit (Mobile‑Only)

Goal
- Ensure every overlay sidebar is mounted only on mobile and never on desktop.

What to check
- `SurahListSidebar` mounts only:
  - Reader mobile overlay: `app/shared/reader/ReaderLayouts.tsx` (wrapped by `lg:hidden`)
  - Tafsir mobile overlay: `app/(features)/tafsir/[surahId]/[ayahId]/page.tsx` inside `lg:hidden`
  - Not mounted globally (removed from `app/(features)/layout.tsx`)
- `SettingsSidebar` (reader)
  - Mounted as `mobileRight` in `ReaderLayouts.tsx` (`lg:hidden`)
  - Bookmarks folder and Tafsir pages: only inside `lg:hidden`
- Bookmarks overlays
  - `BookmarksMobileSidebarOverlay` ensures overlay/aside both have `lg:hidden`
  - `BookmarkFolderSidebar` (BaseSidebar variant) is only used via `Sidebar` inside `lg:hidden`

Commands
- `rg -n "SurahListSidebar\(|SettingsSidebar\(|BaseSidebar\(" app -S`
- Verify each usage is either:
  - Inside a parent with `lg:hidden`, or
  - A desktop column (not overlay) rendered via `ThreeColumnWorkspace`

Acceptance
- No overlay (BaseSidebar or custom overlay wrapper) is rendered on desktop.

## 2) Tokens, Offsets, and Borders

Goal
- Use semantic tokens and the workspace shell for all borders/offsets.

What to check
- Desktop columns use:
  - `lg:border-border`, `lg:bg-surface`
  - Left: `lg:border-r`; Right: `lg:border-l`
- Workspace root uses `bg-background text-foreground`, header-aware padding from `HeaderVisibilityContext`.
- No raw Tailwind color utilities in layout containers.

Commands
- `rg -n "ThreeColumnWorkspace|WorkspaceMain" app -S`
- `rg -n "bg-\\w|text-\\w|border-\\w" app/shared/reader app/(features) | rg -v "bg-background|bg-surface|text-foreground|text-muted|border-border|border-transparent"`

Acceptance
- All sidebars/columns rely on semantic tokens for colors and borders.
- No duplicated header spacing; the shell owns it.

## 3) README and Docs Clean‑up

Goal
- Remove references to the old global Surah sidebar and align guides with the new rules.

Files to update
- `app/(features)/page/README.md`
- `app/(features)/home/README.md`
- `app/(features)/surah/README.md`
- `app/(features)/juz/README.md`
- `app/(features)/bookmarks/README.md`
- `app/(features)/search/README.md`

What to change
- Replace “SurahListSidebar is supplied by the features layout” with “Sidebars are feature‑owned; reader pages use `ReaderShell`/`ThreeColumnWorkspace`, overlays are mobile‑only.”

Acceptance
- No README claims the app layout mounts content sidebars.

## 4) Tests and Visual Checks

Goal
- Ensure regressions in separators, spacing, and overlays are caught.

Tasks
- Run the suite: `npm run test`
- Manual desktop pass: Surah → Juz → Page → Tafsir detail → Bookmarks
  - Borders visible for desktop columns (no shadows)
  - No content underlaps sidebars
- Manual mobile pass: same pages
  - Overlays open/close correctly; no overlays on desktop

Acceptance
- Tests pass; manual checks confirm consistent borders and behavior.

## 5) Optional Decisions (Index Pages)

Goal
- Decide on desktop left rails for index pages.

Options
- Keep center‑only (no change): `app/(features)/juz/page.tsx`, `app/(features)/tafsir/page.tsx`
- Add desktop left rail using `ThreeColumnWorkspace` + `SurahWorkspaceNavigation`

Acceptance
- If rails added: desktop has bordered left column, no overlay mounted on desktop; mobile overlay optional.

## 6) Known Unrelated Type Error (Optional quick fix)

Context
- Type-check currently fails due to a bookmarks hook (`exactOptionalPropertyTypes`).

File
- `app/(features)/bookmarks/hooks/useBookmarkVerse.ts:115`

Suggestion
- Ensure `translations` is always an array (normalize undefined to `[]`) or widen the type locally.
- Keep the fix minimal and focused; do not change domain types unless required.

Acceptance
- `npm run type-check` passes.

## Definition of Done

- Reader routes (Surah/Juz/Page/Tafsir detail) share identical desktop border behavior; overlays are mobile‑only
- Bookmarks follows the same rules (desktop borders, mobile overlays only)
- Index pages are either center‑only or use a left rail consistently
- Semantic tokens used across layout containers
- Tests pass; manual checks show no shadow separators on desktop and no underlap

## Owner Notes

- This list assumes Home and Search remain center‑only for now
- Revisit Search later if adding faceted filters (desktop left rail + mobile overlay)
