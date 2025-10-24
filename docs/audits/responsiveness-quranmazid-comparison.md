# Responsiveness Audit — Quran Mazid (Bookmarks) vs This Project

This report summarizes how https://quranmazid.com/profile/bookmarks implements responsiveness, compares it to our current implementation, and lists targeted improvements to match their behavior where it benefits us.

## Summary

- Both apps are mobile‑first and token-driven. Quran Mazid leans on CSS variables, custom screen aliases (e.g., `tablet`, `laptop`, `desktop`) and a fluid grid using `repeat(auto-fill, minmax(...))`. Our project already uses tokens and a 3‑column workspace; our “last‑read” grid is fluid, but the folder grid uses fixed column counts per breakpoint.
- Quick wins for parity:
  - Switch the bookmarks folder grid to `auto-fill/minmax` (like our last‑read grid).
  - Optionally, unify horizontal padding using a `--padding-x` variable applied per breakpoint.
  - Optional parity: add screen aliases (`phone`, `tablet`, `laptop`, `desktop`) and direction-aware variants (`ltr:`, `rtl:`) if we target RTL locales.

---

## Quran Mazid — Key Findings

- Stack: Next.js (App Router), Tailwind-based utilities, semantic tokens.
- Viewport meta: `width=device-width, initial-scale=1`.
- Semantic tokens: classes like `bg-primary-bg`, `text-pure-color`, `border-border-color`, etc.
- Top-level layout:
  - Grid shell with sidebars via CSS variables, collapses via `max-desktop`/`max-laptop`.
  - Sticky/fixed header and sidebars sized by CSS variables (e.g., `--_top-nav-size`).
  - Direction-aware spacing (`ltr:`/`rtl:`) on larger screens.
- Bookmarks grid (folder cards):
  - Base: `grid grid-cols-1` on small screens.
  - Tablet and up: `grid-cols-[repeat(auto-fill,minmax(240px,1fr))]` with increased gaps.
  - Cards use `min-w-[240px]` to match the grid `minmax` constraint.
- Spacing: Section sets `[--padding-x:*]` per breakpoint; children containers use `px-[--padding-x]` so horizontal padding scales uniformly.
- Breakpoints observed in CSS assets: `360, 480, 768, 1024, 1440` (min-widths). Class variants used include `phone-sm`, `phone`, `tablet`, `laptop`, `desktop`, plus `max-laptop`/`max-desktop`.

Notes: Exact alias→value mapping is inferred from class usage and media queries. The concrete min-widths exist in CSS; aliases line up with common conventions (e.g., `tablet: 768`, `laptop: 1024`, `desktop: 1440`).

---

## Our Project — Current State

- Tailwind screens (standard): `xs: 475`, `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`.
  - Reference: `tailwind.config.mjs:7–13`.
- Three‑column workspace with safe‑area/header tokens and responsive sidebars.
  - Reference: `app/shared/reader/ThreeColumnWorkspace.tsx`, `app/shared/reader/WorkspaceMain.tsx:48–59`.
- Spacing: `WorkspaceMain` applies `px-4 sm:px-6 lg:px-8` by default; bookmarks layout overrides via `contentClassName`.
  - Reference: `app/shared/reader/WorkspaceMain.tsx:58` and `app/(features)/bookmarks/components/shared/BookmarksLayout.tsx:17–22`.
- Bookmarks folder grid: fixed column counts per breakpoint (step changes).
  - Reference: `app/(features)/bookmarks/components/FolderGrid.tsx:83`:
    - `grid grid-cols-1 ... sm:grid-cols-2 ... xl:grid-cols-3`.
- Last‑read grid: already uses the fluid approach (`auto-fill/minmax`).
  - Reference: `app/(features)/bookmarks/last-read/components/LastReadGrid.tsx:105`:
    - `grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]`.
- Utility available: `.grid-auto-fill { grid-template-columns: repeat(auto-fill, minmax(var(--min-col, 12rem), 1fr)); }`.
  - Reference: `app/globals.css:362–366`.

---

## Gap Analysis

- Grid behavior:
  - Theirs: fluid `auto-fill` grid with a stable `minmax` width (240px), natural wrapping across viewport sizes.
  - Ours: folder grid uses fixed column counts (`1/2/3`), which can leave awkward whitespace and produce step changes at breakpoints.

- Horizontal padding rhythm:
  - Theirs: `[--padding-x]` variable set per breakpoint; grids/sections apply `px-[--padding-x]` for consistent, inheritable spacing.
  - Ours: explicit padding classes per container (`px-4 sm:px-6 lg:px-8`). Works well, but inheritance via variable would reduce duplication and keep nested blocks aligned.

- Sidebar/layout collapse rules:
  - Theirs: uses `max-laptop`/`max-desktop` utilities to collapse columns and reposition fixed elements.
  - Ours: comparable collapse at `lg:` breakpoint in the workspace; behavior is equivalent in effect.

- Direction-awareness:
  - Theirs: applies `ltr:`/`rtl:` for left/right paddings on large screens.
  - Ours: no direction-aware variants detected. Only needed if we ship RTL.

- Screen aliases:
  - Theirs: readable aliases (`tablet`, `laptop`, `desktop`, etc.) improving semantic clarity.
  - Ours: default Tailwind names; functional but less domain-specific.

---

## Recommendations (Actionable)

1) Make the folder grid fluid (match last‑read + theirs)

- Change the container class in `app/(features)/bookmarks/components/FolderGrid.tsx:83` from:

  ```tsx
  grid grid-cols-1 gap-4 transition-opacity duration-300 ease-out sm:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8
  ```

  To Option A (inline minmax):

  ```tsx
  grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4 md:gap-6 transition-opacity duration-300 ease-out
  ```

  Or Option B (use shared utility):

  ```tsx
  grid w-full auto-rows-fr grid-auto-fill gap-4 md:gap-6 transition-opacity duration-300 ease-out
  ```

  With Option B, set a custom minimum where needed:

  ```tsx
  <div className="grid w-full auto-rows-fr grid-auto-fill gap-4 md:gap-6 ..." style={{ ['--min-col' as any]: '15rem' }}>
  ```

  Notes:
  - Pick `15rem` (~240px) for parity with Quran Mazid.
  - Keep `auto-rows-fr` for uniform card heights per row.

2) Align horizontal padding via a variable (optional but recommended)

- Pattern (mirrors theirs): define `[--padding-x]` on a parent by breakpoint and apply `px-[--padding-x]` to children containers.
- Example for bookmarks center area at `app/(features)/bookmarks/components/shared/BookmarksLayout.tsx`:
  - Current `contentClassName`: `gap-4 pb-12 sm:gap-6 px-2 sm:px-4 lg:px-6`.
  - Suggested:

    ```tsx
    // On a wrapper (e.g., WorkspaceMain content wrapper or a parent div)
    className="[--padding-x:0.5rem] sm:[--padding-x:1rem] lg:[--padding-x:1.5rem]"

    // Then use
    contentClassName="gap-4 pb-12 sm:gap-6 px-[--padding-x]"
    ```

  Benefits:
  - Inheritable, uniform horizontal rhythm across nested grids/sections.
  - Fewer duplicated `px-*` class edits when adjusting spacing.

3) Add readable screen aliases (optional)

- If desired for parity/clarity, add semantic aliases alongside existing screens in `tailwind.config.mjs:7–13`:

  ```js
  theme: {
    screens: {
      xs: '475px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px',
      phone: '480px', tablet: '768px', laptop: '1024px', desktop: '1440px',
    },
  }
  ```

  Tailwind’s `max-*` variants will then allow `max-laptop:*` style rules (e.g., `max-laptop:grid-cols-1`).

4) Direction-aware variants (only if we support RTL)

- Introduce `rtl:`/`ltr:` for paddings/absolute positioning near sidebars or action buttons where left/right differs by direction.

5) Verify via tests and manual checks

- Tests: Use the provided viewport helpers at `app/testUtils/responsiveTestUtils/viewport.ts` (tablet: 768, desktop: 1024) to assert layout at key widths.
- Manual: Confirm folder grid column count increases fluidly and spacing matches at 360/480/768/1024/1280/1440.

---

## Evidence & References

- Remote page
  - Grid container class includes `tablet:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]` and `px-[--padding-x]`; computed desktop padding was 36px and 4 columns visible (1192px content width).
  - Section class sets `[--padding-x:15px] tablet:[--padding-x:24px] desktop:[--padding-x:36px]`.
  - Breakpoints observed in CSS: `360, 480, 768, 1024, 1440` (min-widths); class aliases used: `phone-sm`, `phone`, `tablet`, `laptop`, `desktop`, plus `max-*` variants.

- Our project
  - Tailwind screens: `tailwind.config.mjs:7–13`.
  - Workspace padding: `app/shared/reader/WorkspaceMain.tsx:58`.
  - Bookmarks layout content class: `app/(features)/bookmarks/components/shared/BookmarksLayout.tsx:17–22`.
  - Folder grid fixed columns: `app/(features)/bookmarks/components/FolderGrid.tsx:83`.
  - Last‑read grid fluid columns: `app/(features)/bookmarks/last-read/components/LastReadGrid.tsx:105`.
  - Shared utility: `app/globals.css:362–366` (`.grid-auto-fill`).

---

## Implementation Plan (suggested order)

1. Convert folder grid to `auto-fill/minmax` (Option A or B).
2. Adopt `[--padding-x]` for bookmarks center content.
3. Optionally define screen aliases and (if needed) add `rtl:`/`ltr:` utilities where direction matters.
4. Validate at 480/768/1024/1280/1440px and adjust `--min-col` to align with card design.

