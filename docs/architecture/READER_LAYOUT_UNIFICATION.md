# Reader Layout Unification Plan

Note: This document is superseded by `docs/architecture/THREE_COLUMN_LAYOUT_GUIDE.md`, which serves as the single source of truth. This file remains for historical context.

This document describes the plan to standardize all reader-like views (Surah, Juz, Page) on a single, consistent three‑column workspace. The goal is to eliminate visual drift (shadow vs border), z‑index overlap, and spacing inconsistencies between routes.

## Summary

- Single source of truth for reader pages: `ReaderShell` + `ThreeColumnWorkspace`.
- Desktop: left and right columns are static with borders (`border-border`) and `bg-surface`.
- Mobile: sidebars use the overlay pattern (`BaseSidebar`) with an overlay and subtle shadow.
- Remove globally mounted, fixed left overlay from the app layout so it cannot overlap or diverge from the reader layout.

## Motivation (Problems Today)

- Global overlay sidebar (shadow) coexists with the reader’s desktop columns (border), causing inconsistent separation.
- Fixed overlay can sit “above” main content (content slides underneath) on some routes.
- Different routes (Juz/Page/Surah) render different sidebar variants leading to subtle UI deltas.

## Scope

- Unify Surah (`/surah/[surahId]`), Juz (`/juz/[juzId]`), and Page (`/page/[pageId]`) on the same layout and sidebar behavior.
- Keep Bookmarks on its own `ThreeColumnWorkspace` (already aligned).
- Out of scope: unrelated styling refactors, typography changes, or component rewrites not impacting layout consistency.

## Design Decisions

- Source of truth: `app/shared/reader/ReaderShell.tsx` orchestrates:
  - Main content via `SurahMain`
  - Desktop left column via `SurahWorkspaceNavigation`
  - Desktop right column via `SurahWorkspaceSettings`
  - Mobile overlays via `SurahListSidebar` (left) and `SurahSettings` (right)
  - Audio via `SurahAudio`
- Container: `app/shared/reader/ThreeColumnWorkspace.tsx` handles header offsets, safe areas, and desktop borders.
- Overlay use is mobile-only: `ReaderLayouts.tsx` mounts mobile overlays inside a `lg:hidden` wrapper so they cannot show on desktop.
- Remove app-wide overlay sidebar from `app/(features)/layout.tsx`.

## Route Mapping

- Surah: `app/(features)/surah/[surahId]/page.tsx` → `SurahView` → `ReaderShell`
- Juz: `app/(features)/juz/[juzId]/JuzClient.tsx` → `ReaderShell`
- Page: `app/(features)/page/[pageId]/PageClient.tsx` → `ReaderShell` (migrated)

## Visual + Theming Rules

- Desktop columns:
  - Left: `lg:border-r lg:border-border lg:bg-surface`
  - Right: `lg:border-l lg:border-border lg:bg-surface`
- Mobile overlays:
  - Use `BaseSidebar` and `SidebarOverlay`, keep `shadow-modal` for the floating effect.
  - Hide on desktop by rendering inside a `lg:hidden` container (see `ReaderLayouts.tsx`).
- Backgrounds: workspace root uses `bg-background`, columns use `bg-surface`.
- Tokens: use semantic tokens (`border-border`, `bg-surface`, `text-foreground`). Avoid raw Tailwind colors.

## Accessibility & Behavior

- Header-aware offsets via `HeaderVisibilityContext` ensure correct `top` and `padding-top` regardless of scroll state.
- Overlays have `role="dialog"` and `aria-modal` state; keyboard focus should remain trapped inside overlays.
- Audio controls persist consistently across reader routes.

## Implementation Checklist

1) Remove global overlay sidebar from app layout
- File: `app/(features)/layout.tsx`
- Change: Stop rendering `SurahListSidebar` globally. Keep only `Header` and `Navigation`.

2) Ensure reader routes render `ReaderShell`
- Surah already uses `SurahView` → `ReaderShell`: `app/(features)/surah/components/SurahView.client.tsx`
- Juz uses `JuzClient` → `ReaderShell`: `app/(features)/juz/[juzId]/JuzClient.tsx`
- Page now uses `PageClient` → `ReaderShell`: `app/(features)/page/[pageId]/PageClient.tsx`

3) Keep mobile overlays mobile-only
- File: `app/shared/reader/ReaderLayouts.tsx`
- Behavior: `mobileLeft` and `mobileRight` wrapped in a `lg:hidden` container.

4) Desktop borders are owned by the workspace container
- File: `app/shared/reader/ThreeColumnWorkspace.tsx`
- Left column: `lg:border-r lg:border-border lg:bg-surface`
- Right column: `lg:border-l lg:border-border lg:bg-surface`

5) Overlay styling is owned by the overlay component
- File: `app/shared/components/sidebar/useSidebarPositioning.ts`
- Overlay adds `shadow-modal`; consider avoiding any `lg:translate-x-0` defaults unless rendered inside `lg:hidden`.

## Acceptance Criteria

- On desktop, Surah, Juz, and Page show identical column separators (borders) and spacing.
- No content sits underneath a sidebar on any reader route.
- On mobile, overlays appear with a subtle shadow and hide correctly; desktop never shows overlays.
- The `Header` and bottom/left navigation are present and don’t collide with sidebars.

## Testing Plan

- Unit
  - Render Surah/Juz/Page and assert `ThreeColumnWorkspace` is present.
  - Verify `ReaderLayouts` mounts `mobileLeft/mobileRight` only under `lg:hidden`.
- Integration
  - Navigate between Surah → Juz → Page and assert class differences do not occur (no `shadow-modal` on desktop).
  - Assert content area width does not change when opening/closing overlays on mobile.
- Visual/Storybook
  - Add/verify stories for `ThreeColumnWorkspace` and `ReaderShell` showing Surah/Juz/Page.
- E2E (optional)
  - From navigation, visit each reader route; confirm no overlap and consistent borders.

## Performance Considerations

- No additional renders on desktop; overlays aren’t mounted there.
- Infinite scroll and audio behavior unchanged.
- Avoid layout thrash: keep header offsets and safe areas in CSS variables as implemented.

## Risks & Mitigations

- Residual overlays: ensure no stray `BaseSidebar` is mounted globally.
- Z‑index conflicts: overlays use higher z‑index; desktop columns don’t need elevated z‑index.
- Theming drift: rely exclusively on semantic tokens to avoid subtle color differences.

## Rollback Strategy

- If necessary, re-enable the global overlay for non-reader routes only, but keep it excluded for reader routes.
- Revert Page to its previous local layout if needed (not recommended).

## Owner & Follow-ups

- Owner: Reader/UX team
- Follow-ups:
  - Audit for any remaining places where a fixed overlay is mounted on desktop.
  - Add visual regression snapshots for separators and spacing.

## Reference Files

- `app/(features)/layout.tsx`
- `app/shared/reader/ReaderShell.tsx`
- `app/shared/reader/ReaderLayouts.tsx`
- `app/shared/reader/ThreeColumnWorkspace.tsx`
- `app/(features)/surah/components/SurahView.client.tsx`
- `app/(features)/juz/[juzId]/JuzClient.tsx`
- `app/(features)/page/[pageId]/PageClient.tsx`
- `app/shared/components/sidebar/useSidebarPositioning.ts`
