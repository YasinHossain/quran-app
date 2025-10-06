# Three-Column Workspace Refactor Plan

This document proposes a shared, three-column "Three-Column Workspace" layout and supporting primitives for all reader-style pages (Surah, Tafsir, Bookmarks → Folder/Verses). The goal is to converge on one source of truth for layout, scrolling, and settings behavior while reusing verse presentation across features, reducing duplication and improving consistency and performance.

## Context & Pain Points

- Three logical columns across the app: left navigation (e.g., Surah list or Bookmarks), centered reader (Verses/Tafsir), right settings (translation, word language, reading).
- Each feature currently implements its own container/margins/offsets. This causes:
  - Repeated layout classes (e.g., manual `lg:ml-[...]`, `lg:mr-[...]`).
  - Inconsistent header offset and scroll behavior between routes.
  - Multiple wrappers that do the same thing (duplicated main containers, sidebars, and spacing logic).
  - Verse presentation (cards/lists) reimplemented per route with small variations.

## Goals

- Single, shared layout that defines the three-column reader workspace.
- Pluggable sidebars and center content so routes compose the same layout differently.
- One verse presentation primitive used everywhere with optional capabilities.
- Centralize layout tokens (sidebar widths, padding, header offsets) for consistency.
- Keep feature logic intact; this is a presentation and composition refactor, not a product redesign.
- Incremental adoption with minimal churn; existing routes continue to work during migration.

## Non-Goals

- Rewriting domain/application logic.
- Changing existing UX flows or adding new features.
- Replacing providers unless duplication forces it (e.g., `AudioProvider` ownership stays in feature layouts for now).

## Proposed Architecture

1) ThreeColumnWorkspace (shared layout shell)
- Location: `app/shared/reader/ThreeColumnWorkspace.tsx`.
- Responsibilities:
- Provide three slots: left, center, right. Each slot receives a React node.
  - Handle responsive behavior: overlays on mobile, three columns on desktop.
  - Apply consistent spacing/margins to center content to reserve space for fixed sidebars on large screens.
- Integrate with header visibility to compute vertical offsets (top paddings and heights) consistently.
  - Manage z-index and overlays for mobile sidebars (left and right), delegating animations to existing sidebar primitives.

2) WorkspaceMain (center column container)
- Location: `app/shared/reader/WorkspaceMain.tsx`.
- Responsibilities:
  - Own the scroll region for the reader content.
- Apply unified paddings based on header visibility and safe area insets.
- Reserve left/right space on desktop via semantic layout tokens (see Tokens below).

3) Sidebars as interchangeable modules
- Existing sidebars (e.g., `SurahListSidebar`, `BookmarksSidebar`, `SettingsSidebar`) plug into the left/right slots.
- The shared layout should not care which sidebar is mounted; it only enforces placement and behavior.
- Mobile overlays (open/close state) continue using existing contexts; the workspace simply renders them in the correct slot.

4) Verse presentation primitive
- Promote a single display primitive for a verse card/list item (e.g., `VerseCard`), consumed by Surah, Bookmarks, and Tafsir.
- Optional capabilities via props (e.g., show/hide tafsir link, bookmark action, context labels). Avoid forking the markup per route.
- Lists such as `SurahVerseList`, `BookmarkVerseList`, `TafsirVerseList` feed data and feature-specific controls into the same display primitive.

5) Controller layer alignment
- Reuse the existing reader controller hook(s) where possible (e.g., `useReaderView`, `useVerseListing`).
- Place shared controller hooks under `src/application/reader/` for clarity (wrapping data adapters in `src/infrastructure/` and entities/value objects in `src/domain/`).
- Each route composes: controller hook(s) → `ThreeColumnWorkspace` slots (left/main/right) → shared verse display primitive.

6) Tokens & theming
- Replace magic widths with semantic tokens (Tailwind/semantic CSS variables) so layout spacing lives in one place.
- Define tokens for:
  - Reader left sidebar width.
  - Reader right sidebar width.
  - Header height offsets (regular/hidden) and safe-area adjustments.
- Use these tokens in both the sidebars and the center container to keep margins/offsets in sync.

## Integration With Existing Building Blocks

- `BaseSidebar` and `useSidebarPositioning` remain the low-level positioning primitives for left/right sidebars. `ThreeColumnWorkspace` composes them and ensures matching horizontal space is reserved in the center on desktop.
- `HeaderVisibilityContext` remains the source of truth for header state. `ThreeColumnWorkspace` and `WorkspaceMain` consume it to compute vertical padding.
- `AudioProvider` remains at feature layout scope for now (e.g., `app/(features)/surah/layout.tsx`, `app/(features)/bookmarks/layout.tsx`). We can revisit after migration if duplication appears.
- `ReaderShell` may evolve into orchestration around `ThreeColumnWorkspace` or be split into controller vs. presenter components depending on complexity.
- Any direct layout utilities in feature folders should be migrated to shared tokens as part of cleanup.

## Constraints & Design Principles

- Preserve existing route-level feature flags and providers during migration.
- Avoid breaking changes to public APIs of verse components until Phase 5 when consolidation happens.
- Prevent large PRs; roll out gradually per route.
- Add Storybook stories and tests to validate the new layout shell in isolation before replacing feature implementations.
- Ensure token names describe the slot/purpose rather than pixels.

## Layout Behavior Overview

- Mobile: sidebars render as overlays/drawers. Center content occupies full width.
- Tablet: left sidebar may be docked; right settings might still be overlay.
- Desktop: three fixed columns with scrollable center.
- Header hides on scroll; layout must adjust top padding accordingly.
- Safe-area insets should be respected for iOS devices.

## Tokens (Initial Set)

- Reader left sidebar width (desktop).
- Reader right sidebar width (desktop).
- Header height (regular, hidden) with safe-area inset awareness.
- Center content paddings per breakpoint (mobile/desktop) in terms of tokens, not raw pixel values.

## Open Questions

- Should `AudioProvider` be elevated into `ReaderWorkspace`, or remain at feature layout scope to avoid double providers?
- Do we want separate contexts for left/right sidebars or unify them under a single workspace UI context?
- Should `ReaderShell` be adapted to use `ReaderWorkspace` internally or split into controller vs. presenter?

## Risks & Mitigations

- Risk: Subtle spacing regressions across routes. Mitigation: tokenize early, add storybook/visual checks for each route.
- Risk: Provider duplication or ordering issues. Mitigation: keep providers at feature layout for now; document ownership and evaluate later.
- Risk: Unclear ownership of open/close state. Mitigation: route components pass state down; `ReaderWorkspace` stays stateless regarding business logic.

## Rollout Strategy

- Guard the new layout with a light feature flag per route during migration.
- Migrate one route at a time (bookmarks → surah → tafsir), validating metrics and UX after each.
- Remove flag and legacy wrappers once all routes adopt the shared layout.

## Work Breakdown (High Level)

1) Add tokens for widths/offsets and document usage.
2) Implement `ThreeColumnWorkspace` and `WorkspaceMain` (slots, responsive behavior, header offsets).
3) Migrate bookmarks folder reader to shared layout.
4) Migrate surah reader to shared layout; simplify `SurahMain` to content presenter.
5) Migrate tafsir to shared layout; plug in panels/actions through composition.
6) Consolidate verse presentation via a single card primitive with optional props.
7) Cleanup: remove duplicate wrappers and magic spacing; standardize prop names and contexts.

## Micro-Phase Breakdown (Executable Steps)

Phase 0 - Prep (no behavioral change)
- Audit current layouts for hard-coded offsets and widths.
- Inventory verse presentation variants; confirm shared props shape.
- Identify existing contexts/providers that interact with layout.

Phase 0 - Tokens Prep (no UI changes) ✅
- 0.1 Add layout tokens in `tailwind.config.mjs` for left/right sidebar widths and header heights.
- 0.2 Add CSS vars for safe-area padding in `app/globals.css`.
- 0.3 Document token usage and mapping from current classes to tokens in this file.
- 0.4 Sanity check with a tiny demo snippet (storybook or scratch route) - no feature code touched.

Acceptance (Phase 0)
- Tokens compile; no visual/layout change on existing pages.
- Demo shows token values are available and usable.

### Phase 0 Token Reference

**Tailwind spacing tokens**
- `reader-sidebar-left` -> use `w-reader-sidebar-left` / `ml-reader-sidebar-left` to reserve the desktop left column (replaces `lg:w-[20.7rem]`).
- `reader-sidebar-right` -> use `w-reader-sidebar-right` / `mr-reader-sidebar-right` for the settings column (replaces `lg:w-80`).
- `reader-header` -> use `top-reader-header`, `mt-reader-header`, etc. whenever the fixed header height was encoded as `top-16` or `mt-16`.
- `reader-header-compact` -> combines with safe-area vars for mobile offsets that previously used `3.5rem` header values.

**CSS variables added in `app/globals.css`**
- `--reader-sidebar-width-left`, `--reader-sidebar-width-right` - source of truth for desktop sidebar widths.
- `--reader-header-height`, `--reader-header-height-compact`, `--reader-header-height-hidden` - header offsets for visible, compact, and hidden states.
- `--reader-safe-area-{top|right|bottom|left}` - raw safe-area insets with fallback to `0px`.
- `--reader-safe-padding-{top|right|bottom|left}` - precomputed `max()` helpers used by `.pt-safe`, `.pb-safe`, etc.

**Legacy utility mapping guidance**
| Current utility | Token-based replacement | Notes |
| --- | --- | --- |
| `lg:w-[20.7rem]` | `lg:w-reader-sidebar-left` | Also apply to matching `ml`/`mr` offsets. |
| `lg:w-80` | `lg:w-reader-sidebar-right` | Keeps right sidebar width consistent across routes. |
| `top-16` | `top-reader-header` | Works with `fixed`/`sticky` header-aware surfaces. |
| `h-[calc(100vh-4rem)]` | `h-[calc(100vh-var(--reader-header-height))]` | Use the header token inside `calc()` for vertical reservations. |
| `pt-[calc(3.5rem+env(safe-area-inset-top))]` | `pt-[calc(var(--reader-header-height-compact)+var(--reader-safe-area-top))]` | Keeps compact header + safe-area math centralized. |

Phase 1 - Workspace Skeleton (isolated)
- 1.1 Add `app/shared/reader/ThreeColumnWorkspace.tsx` (slots: `left`, `center`, `right`; no business logic/state).
- 1.2 Add `app/shared/reader/WorkspaceMain.tsx` (center scroll region; header-aware top padding; tokenized margins for left/right reservations).
- 1.3 Create Storybook stories for: left+center+right, center-only, left+center, center+right.
- 1.4 Add minimal unit tests for slot rendering and token classes.

Acceptance (Phase 1)
- Stories render expected compositions; snapshot/visual checks pass.
- Unit tests assert presence of tokenized classes and correct slot ordering.

Phase 2 - Bookmarks Folder Migration (behind flag)
- 2.1 Introduce feature flag (e.g., `NEXT_PUBLIC_THREE_COLUMN_WORKSPACE`) read in `app/(features)/bookmarks/[folderId]/BookmarkFolderClient.tsx`.
- 2.2 Add a thin adapter that renders existing content via `ThreeColumnWorkspace` when flag is on; else fall back.
- 2.3 Replace hardcoded margins in bookmarks reader with `WorkspaceMain` and tokens.
- 2.4 Verify desktop spacing, mobile overlays, header offset, and folder/verse selection.

Acceptance (Phase 2)
- With flag on: layout matches Surah spacing; no overlap with settings.
- With flag off: behavior unchanged from baseline.

Phase 3 - Surah Migration (behind same flag)
- 3.1 Wrap Surah center content with `WorkspaceMain`.
- 3.2 Compose `ThreeColumnWorkspace` with `SurahListSidebar` (left) and `SettingsSidebar` (right).
- 3.3 Trim `SurahMain` to presentation only (remove margins/offsets).
- 3.4 Confirm `AudioProvider` scope remains correct in `app/(features)/surah/layout.tsx`.

Acceptance (Phase 3)
- Surah view renders identically or improved; audio controls unaffected.
- No duplicate margins/offsets remain in Surah components.

Phase 4 - Tafsir Migration (behind flag)
- 4.1 Wrap tafsir center content with `WorkspaceMain`.
- 4.2 Compose `ThreeColumnWorkspace` (likely right sidebar only).
- 4.3 Confirm verse linking and tafsir panels function unchanged.

Acceptance (Phase 4)
- Tafsir content uses shared spacing; no regressions in navigation/panels.

Phase 5 - Verse Card Unification
- 5.1 Define a single display primitive for a verse card (optional affordances via props).
- 5.2 Migrate `BookmarkVerseList` to the primitive.
- 5.3 Migrate `SurahVerseList`, then tafsir lists; remove duplicate markup.

Acceptance (Phase 5)
- All verse lists use one primitive; visual diffs are intentional and prop-driven.

Phase 6 - Cleanup & Flag Removal
- 6.1 Replace magic margins (e.g., `lg:ml-[20.7rem]`, `lg:mr-[20.7rem]`) with tokens.
- 6.2 Remove legacy wrappers that only handled spacing.
- 6.3 Remove feature flag and dead code; update this doc to mark migration complete.

Acceptance (Phase 6)
- No references to magic spacing remain; flag is removed; CI/tests green.

## Per-PR Guardrails

- Scope: 1-3 files when possible; avoid cross-feature edits in one PR.
- Size: aim <300 lines changed per PR.
- Validation: run `npm run check`; manual verify targeted page on desktop/mobile.
- Accessibility: sidebar dialog roles/labels intact; focus management verified on mobile.

---

This plan allows incremental, low-risk consolidation of the three-column reader experience, improving consistency, testability, and long-term velocity without rewriting core feature logic.
