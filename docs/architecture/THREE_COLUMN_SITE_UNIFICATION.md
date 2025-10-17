# Three-Column Site-Wide Unification

Note: This document is superseded by `docs/architecture/THREE_COLUMN_LAYOUT_GUIDE.md`, which serves as the single source of truth. This file remains for historical context and quick overview.

This plan extends the reader unification to the entire website so Surah, Juz, Page, Tafsir, Bookmarks, Search, and other feature pages share a consistent three‑column layout philosophy.

See also: docs/architecture/READER_LAYOUT_UNIFICATION.md

## Objectives

- Consistent column structure, spacing, and theming on desktop across all major routes.
- Overlay sidebars exist only on mobile. Desktop always uses static columns with borders.
- No content overlaps or slides under sidebars; header offsets are unified.
- Reusable primitives and a small set of page archetypes to keep code simple.

## Primitives

- `ThreeColumnWorkspace` (container): Owns header/safe‑area offsets and desktop column borders (left/right).
- `WorkspaceMain` (center content): Hosts the feature’s main content area with consistent paddings.
- `BaseSidebar` + `SidebarOverlay` (mobile): Provides accessible overlays with `shadow-modal` and `aria-modal`.
- `SurahWorkspaceNavigation`, `SurahWorkspaceSettings`: Reader‑specific sidebars.
- `BookmarksSidebar`: Bookmarks left rail.

## Column Tokens

- Desktop columns: `lg:border-border`, `lg:bg-surface`, left uses `lg:border-r`, right uses `lg:border-l`.
- Workspace root: `bg-background text-foreground` with header-aware top padding.
- Mobile overlay: uses `shadow-modal`, never mounted on desktop (`lg:hidden`).

## Page Archetypes

1) Reader (Surah, Juz, Page, Tafsir detail)
- Left (desktop): `SurahWorkspaceNavigation`
- Center: verses or tafsir content
- Right (desktop): settings (`SurahWorkspaceSettings` or `TafsirWorkspaceSettings`)
- Mobile overlays: `SurahListSidebar` (left) + `SettingsSidebar` (right)
- Source of truth: `ReaderShell` for Surah/Juz/Page; Tafsir detail composes the same workspace manually today (can migrate to a `ReaderShell` variant later)

2) Collections (Bookmarks and subroutes)
- Left (desktop): `BookmarksSidebar`
- Center: folder grids, verse lists, or details
- Right (desktop): optional contextual panel (filters, details)
- Mobile overlays: `BookmarksMobileSidebarOverlay` for the left panel; optional right overlay for filters (future)

3) Index/Explorer (Home, Search, Juz Index, Tafsir Index)
- Option A (Preferred): Use `ThreeColumnWorkspace` with a left rail that matches the domain:
  - Home: minimal left (e.g., quick-links nav), right blank
  - Search: left = faceted filters, right blank (or details)
  - Juz Index: left = `SurahWorkspaceNavigation`, right blank
  - Tafsir Index: left = `SurahWorkspaceNavigation`, right blank
- Option B (Minimal): Use `ThreeColumnWorkspace` without sidebars (center‑only), preserving header/safe‑area offsets and spacing. Mobile behaviors unchanged.

## Route Mapping

- Surah: already unified via `SurahView` → `ReaderShell`
- Juz: already unified via `JuzClient` → `ReaderShell`
- Page: migrated to `PageClient` → `ReaderShell`
- Tafsir detail: uses `ThreeColumnWorkspace` + mobile overlays (left/right). Optionally migrate to a `ReaderShell` variant.
- Bookmarks (root, pinned, memorization, last‑read, folder): already use `ThreeColumnWorkspace`.
- Home: migrate to `ThreeColumnWorkspace` (center‑only) or left = quick links.
- Search: migrate to `ThreeColumnWorkspace`; left = filters overlay on mobile, static on desktop.
- Juz Index: migrate to `ThreeColumnWorkspace`; left = `SurahWorkspaceNavigation`.
- Tafsir Index: migrate to `ThreeColumnWorkspace`; left = `SurahWorkspaceNavigation`.

## Implementation Plan

1) Baseline
- Keep `Header` + `Navigation` in `app/(features)/layout.tsx`.
- Do not render any content sidebars globally; features control their own rails.

2) Reader
- Completed per READER_LAYOUT_UNIFICATION: Surah/Juz/Page unified under `ReaderShell`; Tafsir detail already uses the same container.

3) Bookmarks
- Already aligned via `BookmarksLayout` → `ThreeColumnWorkspace`.
- Ensure mobile overlay is wrapped in `lg:hidden`.

4) Index/Explorer migrations
- Home: Wrap `HomePage` inside `ThreeColumnWorkspace` (center only). Maintain the same content paddings via `WorkspaceMain` props.
- Search: Wrap `SearchContent` inside `ThreeColumnWorkspace`. Implement a left filters panel:
  - Desktop: static left column with filters
  - Mobile: `BaseSidebar` overlay for filters
- Juz Index / Tafsir Index: Wrap index lists in `ThreeColumnWorkspace` with left = `SurahWorkspaceNavigation`.

5) Shared styling and tokens
- Ensure all columns use semantic tokens (`border-border`, `bg-surface`, `text-foreground`).
- Remove any residual route‑specific border/shadow classes from content to avoid duplication with the workspace container.

6) Accessibility & Behavior
- Overlays: ensure `role="dialog"`, focus management, and `aria-modal`.
- Header offsets: continue using `HeaderVisibilityContext` in workspace containers.

## Acceptance Criteria

- Desktop: all listed routes render inside `ThreeColumnWorkspace`; separators are borders, not shadows.
- Mobile: sidebars appear only as overlays; no overlay is mounted on desktop.
- Content never sits under a sidebar; header offset is visually consistent.
- Navigation (left rail on desktop, bottom on mobile) remains consistent and does not conflict with sidebars.

## Testing

- Unit: render Home, Search, Juz Index, Tafsir Index, and assert `ThreeColumnWorkspace` exists; verify `lg:hidden` for overlays.
- Integration: navigate across Surah → Juz → Page → Tafsir → Bookmarks → Search and assert column separators and spacing remain consistent.
- Visual: Storybook examples for each archetype with desktop and mobile states.

## Risks & Mitigations

- Over‑templating low‑complexity pages: use center‑only workspace to keep markup light.
- Filter/left‑rail complexity for Search: ship minimal center‑only first, then add filters.
- Documentation drift: update feature READMEs to reflect feature‑managed sidebars, not global.

## Follow‑ups

- Create `FeatureWorkspace` wrapper that composes `ThreeColumnWorkspace` + `WorkspaceMain` for quick adoption.
- Refactor Tafsir detail to a `ReaderShell` variant to reduce duplication.
- Update app/(features) READMEs that state the SurahListSidebar comes from the features layout (it no longer does).
