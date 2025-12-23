# Verse Loading & Virtualization Audit (quran-app vs quran.com vs quranmazid.com)

## Problem Statement

The current Surah reader in `quran-app` shows visual glitches during scrolling/loading (e.g., verse blocks overlapping as in the screenshot). The goal is to match the “smooth + correct” behavior seen on:

- `quran.com` (reference implementation; repo available locally in `/home/devcontainers/quran-com-frontend-next`)
- `quranmazid.com` (reference implementation; inspected via Chrome MCP)

This document captures how each site loads and renders verses, identifies likely causes of the current issue, and proposes a long-term plan to re-implement verse loading/rendering to match the reference UX.

## Desired UX (Define Up Front)

Before changing code, pick which “good” behavior you want to match:

1) **Stable scrollbar from the start (quran.com-style)**  
   The scrollbar represents the *full* surah immediately. Verses render as you scroll; not-yet-fetched verses show placeholders/skeletons.

2) **Scrollbar grows/shrinks as more content arrives (quranmazid-style as described)**  
   Load a small initial chunk very fast (e.g., 20 verses), then load the rest shortly after; scrollbar visibly changes as total content height increases.

Both can be “correct”. The implementation trade-offs differ.

## Reference 1: quran.com (Production + Codebase)

### What it uses

- **Virtualization library:** `react-virtuoso`
  - Live DOM confirms `data-virtuoso-scroller` exists.
  - Uses **window scrolling** (`useWindowScroll`).
- **Rendering model:** Virtualized list where only a small subset of verses exist in the DOM at any time.
- **Data model:** Total verse count is known early; verses are fetched incrementally (per API “page”), deduped, and cached.

### Code pointers (local repo: `/home/devcontainers/quran-com-frontend-next`)

- Virtualized translation view: `src/components/QuranReader/TranslationView/index.tsx`
  - `useWindowScroll`
  - `totalCount={versesCount + 1}`
  - `increaseViewportBy={1000}`
  - `initialItemCount={1}` (SSR support)
- Per-verse incremental fetch + dedupe-by-page: `src/components/QuranReader/TranslationView/TranslationViewVerse/hooks/useDedupedFetchVerse.ts`
  - Computes API `pageNumber` from `verseIdx` and `perPage`
  - Uses `useSWRImmutable(requestKey, verseFetcher)` to fetch only the needed page
  - Uses `fallbackData` for SSR/initial page
  - Writes results into a shared `apiPageToVersesMap`

### Why it stays visually correct

- `react-virtuoso` handles variable-height rows and dynamic measurement robustly.
- The list has a stable `totalCount` from the start, so the scroll range is stable.
- Placeholder/skeleton rows exist for verses not yet loaded (so layout stays consistent).
- Prefetch is driven by virtualization viewport expansion (`increaseViewportBy`) rather than only a bottom sentinel.

## Reference 2: quranmazid.com (Production via Chrome MCP)

### What it uses

- **Virtualization library:** `react-virtuoso`
  - Live DOM confirms `data-virtuoso-scroller` exists.
  - Uses **window scrolling** (Virtuoso scroller element has `overflow: visible` and large height).
- **Data model:** GraphQL supports both “full” and “paged” surah loading.
  - Endpoint observed: `POST https://quranmazid.com/api/v1/graphql`
  - The `Surah` query includes `limit` and `cursor` variables (so the UI can paginate when needed).
  - In our desktop capture, the response returned the full surah (`ayahsCount = 176` for surah 4).

### What this implies

- They pay a larger upfront data cost (big payload), but the UI stays simple: once the response is in memory, virtualization can render any verse immediately.
- Any “loads first ~20 then loads all” effect is likely a combination of SSR/hydration + client fetch timing, not a strict “paged API” approach.

## Current Implementation: quran-app

### Data fetching

- `app/(features)/surah/hooks/useInfiniteVerseLoader.fetcher.ts`
  - `VERSES_PER_PAGE = 20`
  - Uses SWR Infinite: sequential pagination
  - Prefetch logic exists, but scroll-prefetch only works when a scroll container with `overflow-y: auto` is found.
- `lib/api/verses/fetchers.ts`
  - Requests `words=true` and translations for every verse → payload per verse is not small.

### Rendering / virtualization

- Virtualization hook: `app/(features)/surah/hooks/useVerseListVirtualization.ts`
  - Uses `@tanstack/react-virtual` **`useWindowVirtualizer`**
  - `estimateSize = 320`, `overscan = 10`
  - Calls `virtualizer.measure()` only on mount / verse-length change
- Virtualized list positioning: `app/(features)/surah/components/SurahVerseListContent.tsx`
  - Manually positions items with `position: absolute` + nested `transform: translateY(...)`
  - Measures each item via `virtualizer.measureElement`

### Layout/scroll assumptions (potentially conflicting)

- `app/(features)/surah/components/surah-view/useBodyOverflowHidden.ts`
  - On non-touch devices, sets `document.body.style.overflow = 'hidden'`
  - Comment says “scrolling happens in a designated container”
- `app/shared/reader/WorkspaceMain.tsx` + `app/globals.css`
  - Comments and CSS class `.workspace-main-scroll` imply **body/window scrolling**

This mismatch is a big red flag: if the Surah reader scrolls inside a container on desktop, then `useWindowVirtualizer` will calculate positions against the wrong scroll element.

## Likely Root Causes of the “Overlapping Verses” Glitch

These are ordered by how commonly they cause the exact symptom (items visually stacking/overlapping):

1) **Scroll container mismatch (window vs internal scroller)**  
   If the actual scrolling element is not `window`, `useWindowVirtualizer` will produce incorrect `start` values → items can collapse/overlap.

2) **Missing re-measure on dynamic height changes**  
   Verse heights change when:
   - Arabic/translation font sizes change
   - Translation set changes (0 → 1+ translations)
   - Fonts finish loading (layout shifts)
   - Container width changes (responsive wrapping)
   In `quran-app`, `virtualizer.measure()` is not tied to these settings changes, so cached sizes can become wrong.

3) **Manual absolute-positioning implementation risk**  
   The current renderer re-implements a tricky part of virtualization (item placement). It can work, but it is brittle compared to a battle-tested library like `react-virtuoso`.

## Recommendation (What To Build)

Because **both** reference sites use `react-virtuoso`, the most reliable path to “exactly like theirs” is:

### Recommended Direction: Switch Surah verse list to `react-virtuoso`

Benefits:

- Closest match to both references.
- Handles variable-height rows and remeasurement.
- Supports window scroll (`useWindowScroll`) and custom scroll parent (if you truly need internal scrolling).
- Makes “fetch-on-demand” and “prefetch ahead” patterns easier to implement cleanly.

## Proposed Target Designs (Choose One)

### Option A — Quran.com-style (Best for deep linking + stable scroll range)

- Determine total verse count up front (from chapter metadata).
- Render `Virtuoso` with `totalCount = totalVerses`.
- For verses not yet loaded: render skeleton placeholders.
- Fetch verse data **by API page** based on `verseIdx` → dedupe requests per page (same idea as quran.com’s `useDedupedFetchVerse`).
- Use `increaseViewportBy` to prefetch ahead of the viewport.

Best when:

- You need “jump to verse” to be instant and accurate.
- You want a stable scrollbar from the first paint.

### Option B — Quranmazid-style (Simplest data model)

- Fetch the whole surah in one request (e.g., `per_page=300`) after initial render.
- Use `Virtuoso` with `data = verses` once loaded.
- Optional: SSR/initial-load only first page, then client fetch full data.

Best when:

- Your API/server can handle large responses reliably.
- You prefer simpler UI logic over smaller payloads.

### Option C — Hybrid (Fast first chunk + background prefetch)

- Fetch page 1 (20 verses) immediately.
- Kick off background prefetch for the remaining pages right after first paint.
- While prefetch runs, `totalCount` can be:
  - full count (quran.com feel), or
  - loaded count (quranmazid “scrollbar changes” feel)

Best when:

- You want quick first paint, but also want “whole surah” available soon without a huge initial response.

## Long-Term Best Practice Recommendation

For “snappy on low-end devices” **and** “scales under heavy usage”, the best long-term approach is:

- **Option C (Hybrid) using Option A’s stable `totalCount` model**, plus **adaptive background prefetch**.

Why this is the most practical:

- **Fast first paint:** only fetch what’s needed to show the first screen.
- **Low-end friendly:** avoids forcing a big JSON payload + parse + memory spike on every navigation.
- **Scales better:** reduces average bandwidth per session vs always fetching the full surah; you only fetch more when the user stays/scrolls.
- **Still feels “quranmazid fast”:** because you can prefetch the rest quickly in the background on good connections, so fast-scrolling rarely hits unloaded gaps.

What “adaptive prefetch” means in practice:

- Always fetch **page 1** immediately.
- Immediately prefetch **page 2 (+ maybe page 3)** with low concurrency.
- Continue prefetching remaining pages **only if** conditions look good:
  - not Data Saver
  - not slow network
  - not low-memory pressure
  - user stays on the surah for > N ms (avoid wasted work on quick navigations)
- If the user deep-links to a far verse, **prioritize the required pages first** (your current `useTargetVersePreload` already points in this direction).

Why “fetch the whole surah” (Option B) is usually not the best default:

- It can be great on high-end devices/Wi‑Fi, but on low-end devices it risks:
  - slower time-to-first-verse due to payload size and JS parse time
  - higher memory usage and GC pauses
- It increases bandwidth per user and can amplify costs/limits (especially since you’re using a shared external API).

## Adaptive “Low-End Mode” (Matches Your Observation on quranmazid.com)

You observed that quranmazid.com changes behavior on very low-tier devices: it shows fewer verses (e.g., 5) and requires explicit Next/Prev navigation.

That’s not “virtualization vs not virtualization” — it’s a **policy switch**:

- Reduce work per screen (DOM nodes, images, font shaping, layout).
- Reduce data per request and memory pressure.
- Avoid long scroll sessions that can trigger jank/GC on weak devices.

### Recommendation: Build a Lite Mode in quran-app

Keep the default hybrid model for most users, but add a **Lite Mode** that can be auto-enabled for constrained devices (no user-facing toggle required).

Lite Mode behavior:

- `perPage` drops from `20` → `5` (or `10`) for verse fetches.
- Disable background “prefetch the whole surah”.
- Prefer explicit controls:
  - “Next” / “Previous” page buttons, or
  - a “Load next 5” button (still scrollable, but user-driven).
- Optional additional payload cuts (big wins):
  - disable `words=true` until the user turns on Word-by-Word
  - delay translation HTML fetch until needed

Lite Mode detection signals (web platform):

- `navigator.connection?.saveData === true`
- `navigator.connection?.effectiveType` is `2g` / `slow-2g`
- `navigator.deviceMemory` is `<= 2`
- `navigator.hardwareConcurrency` is low (e.g., `<= 4`)

## Implementation Plan for quran-app (No Code Yet)

### Phase 0 — Decide the exact target UX

- Choose Option A / B / C.
- Define acceptance criteria:
  - No overlapping verse blocks at any font size.
  - Smooth scroll (no big jank spikes) on Surah 2 and Surah 4.
  - Deep link to verse (`/surah/4?startVerse=120`) lands correctly.

### Phase 1 — Confirm the current scroll model (critical)

In the Surah reader view on desktop:

- Verify whether scrolling updates `window.scrollY`.
  - If yes → window scroll model (like quran.com) is viable.
  - If no → identify the scroll container element and its selector.

This decision determines whether we use:

- `Virtuoso useWindowScroll`, or
- `Virtuoso customScrollParent`, or
- `@tanstack/react-virtual useVirtualizer` bound to the container.

### Phase 2 — Build a new verse list renderer behind a feature flag

- Add a new component (example name): `app/(features)/surah/components/VirtualizedSurahVerseList.tsx`
- Use `react-virtuoso` and keep the current list as fallback.
- Ensure:
  - Stable keys: `itemKey={(index) => verseKeyOrId}`
  - Skeleton placeholder for missing verse data (Option A/C)
  - `increaseViewportBy` tuned (start with 1000–1200px like quran.com)

### Phase 3 — Refactor data loading to match the chosen option

Option A (recommended):

- Implement “page map” caching like quran.com:
  - `pageNumber = Math.floor(index / perPage) + 1`
  - `verseIdxInPage = index % perPage`
  - Fetch pages via SWR keyed by `[surahId, translationIds, wordLang, pageNumber]`
- Populate a shared store/map so multiple verse rows don’t refetch the same page.

Option B:

- Add a single-shot “fetch full surah” path (per_page=300).
- Consider using a worker/web streaming if payload becomes too large.

Option C:

- Combine sequential paging + background prefetch (parallelize page requests after first paint).

### Phase 4 — Make height changes always safe

- On any setting changes that affect layout (font size, translations toggle, width breakpoints):
  - Trigger list re-measure / refresh.
  - In `react-virtuoso`, this is typically handled automatically, but verify with:
    - font load completion
    - translation count change
    - responsive wrap changes

### Phase 5 — Scroll-to-verse + navigation parity

- Ensure the new list supports:
  - initial scroll to verse (query param)
  - “next/prev verse” (audio player integration)
  - maintaining scroll position when more data arrives (no jump)

### Phase 6 — Verification & performance checks

- Test long surahs (2, 4) with:
  - default settings
  - large Arabic font size
  - multiple translations enabled
- Measure:
  - initial render time
  - scroll jank (subjective + simple perf trace)
  - number of network requests and payload size

## Open Questions (Answer These Before We Implement)

1) Which UX do you want: **Option A (quran.com)** or **Option B/C (quranmazid-like)**?
2) On desktop in your app, does the Surah reader scroll the **window** or a **container**?
3) Do you want “jump to verse” to work instantly for deep links (requires totalCount known early)?
