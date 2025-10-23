# Performance Tuning — Faster Dev Boot & First Page Load

This guide documents the performance bottlenecks observed and the concrete fixes to speed up:

- Cold dev server startup after reboot
- First load (home/bookmarks) taking ~10 seconds

It focuses on safe, incremental changes with clear file pointers.

## Summary of Root Causes

- Framer Motion is pulled into the initial client bundle via shared card primitives and multiple pages/components, increasing initial JS and compilation cost.
  - `app/shared/ui/BaseCard.tsx`
  - `app/shared/ui/base-card/renderers.tsx`
  - `app/shared/ui/base-card.config.ts` (folder/bookmark variants use framer)
  - Bookmarks pages and components import `framer-motion` directly

- First visit triggers a network fetch for chapters with a high default timeout (10s). When the API is slow/unreachable, the UI waits for the full timeout.
  - `lib/api/client.ts` (default timeout 10000 ms)
  - `app/shared/navigation/hooks/useSurahNavigationData.ts` (uses `getChapters` with SWR)

- Non‑critical modals are bundled eagerly with the grid, and they also import framer-motion.
  - `app/(features)/bookmarks/components/FolderGrid.tsx`

Fonts and i18n are reasonable as configured (display swap; moderate JSON), so the highest ROI changes are animation and network behavior.

## Quick Wins (Apply First)

1) Switch folder/bookmark cards to CSS animations

- Edit `app/shared/ui/base-card.config.ts`:
  - Change `ANIMATION_CONFIGS.folder` and `ANIMATION_CONFIGS.bookmark` from `type: 'framer'` to `type: 'css'` and keep simple transitions in `css.hover`.
- This avoids framer for the busiest card type in bookmarks.

2) Remove simple framer wrappers in bookmarks

- Replace `motion.div` usages that do simple fades/translates with CSS transitions.
  - `app/(features)/bookmarks/page.tsx`
  - `app/(features)/bookmarks/components/FolderGrid.tsx`
  - `app/(features)/bookmarks/planner/components/PlannerCard.tsx`

3) Lower the first-visit chapters fetch timeout

- Edit `lib/api/client.ts` default timeout to ~4000 ms:
  - `fetchWithTimeout(..., { timeout: 4000 })` or set the default `timeout = 4000`.
- Optional: expose `NEXT_PUBLIC_QURAN_API_TIMEOUT` and read it for local tweaking.

4) Lazy-load heavy modals in FolderGrid

- Convert `FolderSettingsModal` and `DeleteFolderModal` to dynamic imports so they don’t land in the initial grid chunk.
  - `app/(features)/bookmarks/components/FolderGrid.tsx`
  - `const DeleteFolderModal = dynamic(() => import('./DeleteFolderModal'))`
  - `const FolderSettingsModal = dynamic(() => import('./FolderSettingsModal'))`

## Medium Wins (Next Pass)

5) Avoid always importing framer from BaseCard

- Today, `BaseCard` re-exports both CSS and framer renderers via `renderers.tsx`, which pulls `framer-motion` even when you select a CSS animation.
  - `app/shared/ui/BaseCard.tsx`
  - `app/shared/ui/base-card/renderers.tsx`

Recommended approach:

- Import `renderCSS` directly in `BaseCard`.
- Load the motion renderer only when needed (e.g., a separate `AnimatedBaseCard` or a small internal dynamic import triggered when `animationConfig.type === 'framer'`).

Example sketch:

```ts
// app/shared/ui/BaseCard.tsx
import { renderCSS } from './base-card/renderers.css-renderer';
import { useBaseCard } from './base-card.utils';

export const BaseCard = memo((props: BaseCardProps) => {
  const { animationConfig, commonProps } = useBaseCard(props);
  if (animationConfig.type !== 'framer') return renderCSS(commonProps);
  // Lazy load framer renderer only when needed
  const Framer = require('./base-card/renderers.motion');
  return Framer.renderFramerMotion({ ...commonProps, animationConfig });
});
```

This reduces initial bundle size for screens that don’t need framer.

6) Provide initial cached chapter data (optional UX polish)

- If you want zero perceived stall on first home visit, add minimal fallback data (a tiny JSON of chapter metadata) and pass it to `useSurahNavigationData({ initialChapters })`.
  - Keep SWR enabled to revalidate in the background.

## Nice-to-Haves

- Add `<link rel="preconnect">` for `https://api.qurancdn.com` and Google Fonts in `app/layout.tsx` `<head>` to cut a round-trip.
- Keep PWA disabled in dev (already handled by `next-pwa` config and client SW unregister in `ClientProviders`).
- Audit other top-level framer imports across shared navigation/modals and convert simple transitions to CSS.

## File Pointers Checklist

- `app/shared/ui/base-card.config.ts` — switch folder/bookmark animations to CSS.
- `app/(features)/bookmarks/page.tsx` — remove `framer-motion` for simple fades.
- `app/(features)/bookmarks/components/FolderGrid.tsx` — remove grid-level `framer-motion` wrappers; lazy-load modals.
- `app/(features)/bookmarks/planner/components/PlannerCard.tsx` — remove `framer-motion` if only static styling.
- `lib/api/client.ts` — reduce default timeout from 10000 to ~4000 ms.
- `app/shared/ui/BaseCard.tsx` and `app/shared/ui/base-card/renderers.tsx` — de-couple framer import path.

## Measuring Improvements

- Cold dev boot: measure time from `npm run dev` to first compile ready.
- First-load TTI: open home page in a fresh browser profile, record time-to-interactive and network waterfall.
- Compare bundle analysis before/after (Next.js analyze or `next build` + stats) focusing on framer-motion presence in initial chunks.

## Expected Outcomes

- Dev server: faster initial compile (fewer framer-dependent files in graph).
- First load: quicker render or graceful fallback instead of 10s stall; interactive sooner due to smaller initial JS and lower network timeout.

## Rollout Order

1) CSS animations for folder/bookmark; lower fetch timeout; lazy-load modals.
2) Remove simple framer wrappers in bookmarks pages.
3) De-couple framer imports in `BaseCard`.
4) Optional initial data / preconnect hints.

