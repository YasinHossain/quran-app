# Three-Column Layout System — Final Guidelines

Authoritative guide for a consistent, scalable, and accessible three‑column layout across the app. This replaces ad‑hoc page layouts and prevents visual drift (shadow vs border), overlap, and spacing inconsistencies.

## Goals

- Consistent desktop columns and mobile overlays across reader pages and collections
- No global sidebars; rails are feature‑owned (reader, bookmarks, tafsir)
- No content underlapping sidebars; correct header/safe‑area handling
- Semantic tokens for colors/borders; no raw Tailwind colors
- Minimal duplication: a small set of reusable primitives and archetypes

## Core Primitives

- `app/shared/reader/ThreeColumnWorkspace.tsx`
  - Shell handling header offset, safe areas, desktop borders
  - Left column: `lg:w-reader-sidebar-left lg:border-r lg:border-border lg:bg-surface`
  - Right column: `lg:w-reader-sidebar-right lg:border-l lg:border-border lg:bg-surface`
- `app/shared/reader/WorkspaceMain.tsx`
  - Center content wrapper with unified paddings and responsive spacing
- `app/shared/components/BaseSidebar.tsx` (+ `sidebar/useSidebarPositioning.ts`)
  - Mobile overlay sidebars with `shadow-modal`; never mounted on desktop
  - Provide `role="dialog"`, `aria-modal`, and overlay dismissal
- `HeaderVisibilityContext`
  - Drives header‑aware top offsets via CSS variables and classes

## Universal Rules

- Desktop rails are static columns (borders), not overlays
- Mobile rails are overlays only and must be wrapped in `lg:hidden`
- Do not mount any overlay sidebar globally; all rails are feature‑owned
- Use semantic tokens only: `bg-background`, `bg-surface`, `text-foreground`, `border-border`
- Reserve rail widths via `lg:w-reader-sidebar-left/right`; center grows fluidly

## Route Archetypes

1. Reader pages (Surah, Juz, Page, Tafsir detail)

- Desktop:
  - Left: navigation (`SurahWorkspaceNavigation`)
  - Center: verses/tafsir content
  - Right: settings (`SettingsSidebarContent` configured per page)
- Mobile:
  - Left overlay: `SurahListSidebar`
  - Right overlay: `SettingsSidebar`
- Source of truth: `ReaderShell` (Surah/Juz/Page). Tafsir detail composes the same workspace pattern and can adopt a `ReaderShell` variant later.

2. Collections (Bookmarks and subroutes)

- Desktop:
  - Left: `BookmarksSidebar`
  - Center: lists/details
  - Right: optional contextual panel
- Mobile:
  - Left overlay via `BookmarksMobileSidebarOverlay`

3. Index/Explorer (Home, Search, Juz Index, Tafsir Index)

- Prefer center‑only with `WorkspaceMain` when no desktop rails are needed
- Optionally add a left rail (e.g., Surah navigation or search filters) on desktop using `ThreeColumnWorkspace`

## Do/Don’t

- Do: keep overlays mobile‑only (`lg:hidden`) and use borders on desktop
- Do: centralize rails in feature pages; never in global layout
- Do: use `WorkspaceMain` in the center to keep paddings consistent
- Don’t: render `BaseSidebar` on desktop or use `lg:translate-x-0` to force it
- Don’t: mix shadow separators and border separators across desktop
- Don’t: replicate header/safe‑area spacing; rely on the shell

## Accessibility

- Overlays have `role="dialog"` and `aria-modal`; backdrop click + Esc to close
- Manage focus when overlays open; ensure tabbable cycling stays inside dialog
- Respect safe‑areas and reduced motion preferences where applicable

## Performance

- Don’t mount overlays on desktop; keep mobile overlays unmounted when closed
- Avoid forced layout changes by relying on CSS variables for header offsets
- Keep infinite scroll, audio, and verse rendering within the center column

## Testing & QA

- Unit: assert presence of `ThreeColumnWorkspace` on pages that use columns; verify `lg:hidden` for overlays
- Integration: navigate across Surah → Juz → Page → Tafsir → Bookmarks and confirm
  - Desktop shows borders, no shadow separators
  - No content underlaps sidebars
- Visual/Storybook: provide stories for each archetype state (mobile/desktop)

## Migration Checklist (Per Route)

1. Identify archetype (Reader, Collection, Index)
2. Remove any globally mounted or page‑level fixed overlays on desktop
3. Wrap page content in `ThreeColumnWorkspace` if rails are needed
   - Provide `left` and/or `right` nodes (desktop rails)
   - Use `WorkspaceMain` for the center
4. Provide mobile overlays guarded by `lg:hidden`
5. Ensure colors/borders use semantic tokens; remove raw utilities
6. Validate header offset, safe‑area, and z‑index
7. Add tests/story for the route layout

## Current State (as of this change)

- Surah/Juz/Page: unified via `ReaderShell`
  - Files: `app/shared/reader/ReaderShell.tsx`, `app/shared/reader/ReaderLayouts.tsx`
- Page migration done
  - `app/(features)/page/[pageId]/page.tsx` → `PageClient` → `ReaderShell`
- Global overlay removed from features layout
  - `app/(features)/layout.tsx` no longer mounts `SurahListSidebar`
- Bookmarks: already on `ThreeColumnWorkspace` with mobile overlay
- Tafsir detail: uses `ThreeColumnWorkspace` and mobile overlays
- Home/Search: center‑only (no rails)

## Enforcing Consistency

- Code review: reject routes that mount `BaseSidebar` on desktop or mix borders/shadows on desktop
- Lint rule suggestions (optional):
  - Disallow `BaseSidebar` usage outside `lg:hidden` contexts
  - Disallow raw Tailwind color classes in `app/` and enforce semantic tokens

## File References (Key Entrypoints)

- `app/shared/reader/ThreeColumnWorkspace.tsx`
- `app/shared/reader/WorkspaceMain.tsx`
- `app/shared/reader/ReaderShell.tsx`
- `app/shared/components/BaseSidebar.tsx`
- `app/shared/components/sidebar/useSidebarPositioning.ts`
- `app/(features)/layout.tsx`
- `app/(features)/surah/components/surah-view/*`
- `app/(features)/page/[pageId]/PageClient.tsx`
- `app/(features)/juz/[juzId]/JuzClient.tsx`
- `app/(features)/bookmarks/components/shared/BookmarksLayout.tsx`
- `app/(features)/tafsir/[surahId]/[ayahId]/page.tsx`

## Appendix — Tokens & Variables

- Colors: `bg-background`, `bg-surface`, `text-foreground`, `border-border`, `text-muted`, etc.
- Sizes: `lg:w-reader-sidebar-left`, `lg:w-reader-sidebar-right`
- Offsets: `--reader-header-height`, `--reader-safe-area-top`, `top-reader-header`
- Spacing helpers: `pt-safe`, `pb-safe`

This document is the single source of truth for column/overlay behavior. Future routes must follow these rules to avoid regressions.
