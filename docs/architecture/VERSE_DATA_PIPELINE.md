# Shared Verse Data Pipeline — Refactor Plan

Goal: ensure every surface that renders `ReaderVerseCard` (Surah, Tafsir, bookmarks, pinned, folders, etc.) uses the same data and caching pipeline so user settings (word-by-word, Mushaf mode, font sizes) behave consistently and optimizations land once.

## Phase 0 — Current State (for reference)
- Surah/Tafsir routes use `useVerseListing`, which hydrates full verse payloads (words, translations, settings context) and drives the reader experience.
- Bookmarks/folder/pinned screens fetch trimmed verse payloads via feature-specific helpers (`useBookmarkFolderPanels`, `useSingleVerse`, etc.). These payloads omit word-level data, so features like word-by-word rendering or Mushaf toggles are unavailable.
- Settings sidebar is centralized, but the data feeding verse cards is not.

## Phase 1 — Shared Verse Fetcher
1. Extract the data-fetching logic inside `useVerseListing` into a composable hook (e.g., `useReaderVerses`) that can be configured per consumer.
   - Input: array of resource IDs (surah, bookmark verse keys, etc.), pagination options, word-language settings.
   - Output: standard verse objects (matching the ones `ReaderVerseCard` expects) plus loaders/error states.
2. Keep `useVerseListing` as a thin wrapper that pipes Surah-specific props (infinite scroll, navigation) into `useReaderVerses`.
3. Expose the hook via a module under `app/shared/reader/hooks/` so non-Surah features can import it without touching Surah-specific files.

## Phase 2 — Bookmarks/Pinned Adoption
1. Update bookmarks/folder/pinned pages to call `useReaderVerses` instead of their custom fetchers.
   - Start with pinned verses (always a finite list) to validate the API.
   - Then switch folder/bookmark lists, enabling pagination/lazy-loading for large collections.
2. Pass the returned verse objects directly to `ReaderVerseCard` so word-by-word settings and Mushaf toggles work automatically.
3. Delete the redundant `useBookmarkFolderPanels` data-fetching pieces, keeping only panel state (modal open/close).

## Phase 3 — Pagination & Performance
1. Enhance `useReaderVerses` with pagination controls:
   - Support page size, lazy-loading callbacks, and caches keyed by verse IDs.
   - Allow consumers to choose between “load all immediately” (small pinned lists) vs. “virtualized lazy load” (large folders).
2. Add memoized caching (via SWR/React Query) to avoid refetching when the same verse is requested from multiple pages (e.g., pinned + last-read).
3. Expose options for “partial payload” if future perf needs arise (e.g., translation-only mode), but keep word data enabled by default.

## Phase 4 — Cleanup & Observability
1. Remove any leftover feature-specific verse fetchers once all consumers use the shared hook.
2. Document the new pipeline in `docs/architecture/VERSE_DATA_PIPELINE.md` (this file) and link it from `MUSHAF_READER_UX.md`.
3. Add telemetry or logging hooks to the shared loader to track payload sizes and latency, ensuring low-end devices stay performant.

## Expected Outcomes
- Consistent reader behavior (word-by-word, Mushaf toggles, font sizes) across every page that shows verses.
- One place to optimize network usage and caching.
- Easier future changes: adding a new reader feature requires updating the shared pipeline once instead of touching bookmarks, pinned, Surah, etc. separately.
