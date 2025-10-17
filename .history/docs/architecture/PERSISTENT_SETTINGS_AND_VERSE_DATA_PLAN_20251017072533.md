# Persistent Settings & Verse Data — Long‑Term Plan

This document proposes a durable, project‑wide approach to make “settings → verse card rendering” consistent across all pages (Surah, Tafsir, Bookmarks, Pinned, Search, etc.).

It focuses on a single source of truth for settings and a unified data layer so that multiple translations, word‑by‑word content, and other preferences persist everywhere without divergence.

## Summary

- Problem: Pages fetch verse payloads differently. Some request all selected translations and words; others fetch only one translation and no words. Result: Verse cards look/function differently even though components and settings are shared.
- Goal: Consistent verse payloads everywhere based on the user’s settings (translationIds, wordLang, showByWords, tajweed, font sizes), with minimal duplication.
- Approach: Centralize single‑verse fetching; standardize SWR keys/requests; keep `SettingsContext` as the single source of truth; reuse `ReaderVerseCard` and `SettingsSidebar` across all features.

## Architecture Principles

- One source of truth for settings: `SettingsContext` with localStorage persistence.
- One way to fetch verses for lists: `useVerseListing` + `getVersesByChapter/Juz/Page`.
- One way to fetch single verses: a new `useSingleVerse` hook that reads `SettingsContext` and guarantees a complete payload (translations + words).
- Normalization only in one place: `lib/api/verses/normalize.ts`.
- Stable caching keys include every setting that changes the payload (e.g., translationIds, wordLang).

## Current State (as of now)

- Shared Components
  - Verse UI: `ReaderVerseCard` and `VerseArabic` (consistent visuals/behavior)
  - Settings UI: `SettingsSidebar` and panel components (consistent UI)
- Settings: Provided by `SettingsContext` with debounced localStorage persistence.
- Inconsistency source: some pages don’t request all selected translations or word‑by‑word data.

## Target State

- Every page displays verses using payloads that honor:
  - `translationIds` (array, ordered)
  - `wordLang` (word‑by‑word language)
  - `words=true` with `word_fields=text_uthmani`
  - `fields=text_uthmani,audio`
- The same verse renders the same way anywhere for the same settings.

## Data Layer Design

1) List Endpoints (already good)

- Continue using `getVersesByChapter/Juz/Page` with:
  - `translations`: comma‑separated `translationIds`
  - `word_translation_language`: `wordLang`
  - `words=true`, `word_fields=text_uthmani`
  - `fields=text_uthmani,audio`
- Consumed by: `useVerseListing`

2) Single Verse (new standard)

- Introduce `useSingleVerse(verseIdOrKey: string)` that:
  - Reads `translationIds` and `wordLang` from `SettingsContext`.
  - Calls centralized fetchers `getVerseById/getVerseByKey` that accept `number | number[]` and `wordLang`.
  - Always requests a complete payload (translations + words + audio) for parity with list views.
  - Exposes SWR state (`data`, `error`, `isLoading`) and returns a normalized `Verse`.

3) Normalization

- Keep normalization in `lib/api/verses/normalize.ts`.
- Ensure `Word` items include Uthmani text and a property keyed by `wordLang`.

4) Caching

- For single‑verse fetches (bookmarks/pinned), continue to use a small LRU cache keyed by:
  - `verseKeyOrId-translationIdsJoined-wordLang`
- SWR keys for verse data must include `translationIds` (joined) and `wordLang`.

## Page Integration Plan

1) Surah / Juz / Page

- Already powered by `useVerseListing`; verify keys include `translationIds` and `wordLang`.
- No change expected beyond minor key stabilization (if needed).

2) Tafsir

- Replace any single‑translation calls with `translationIds`.
- Fetch verse via `getVersesByChapter(..., perPage=1)` or `useSingleVerse` if refactoring.
- Continue fetching tafsir content via use‑case; no changes to tafsir repository needed.

3) Bookmarks (Folders)

- Replace direct single‑translation fetch with `useSingleVerse` or call the centralized `getVerseWithCache` using `translationIds` and `wordLang`.
- Ensure verse payload includes `words` so word‑by‑word rendering and hover/tooltips are consistent.

4) Pinned Verses

- Same as Bookmarks; use `useSingleVerse` or updated `getVerseWithCache`.

5) Search / Last‑Read / Memorization (if/when implemented)

- Standardize on `useSingleVerse` for detail cards and `useVerseListing` for lists.

## Hook API (Proposed)

```ts
// app/shared/hooks/useSingleVerse.ts
export interface UseSingleVerseOptions {
  idOrKey: string;         // e.g., "262" or "2:255"
  suspense?: boolean;
}

export interface UseSingleVerseReturn {
  verse: Verse | undefined;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;      // revalidate
}

export function useSingleVerse(opts: UseSingleVerseOptions): UseSingleVerseReturn
```

Behavior:

- Reads `translationIds` and `wordLang` from `SettingsContext`.
- Generates a stable SWR key: `['single-verse', idOrKey, translationIds.join(','), wordLang]`.
- Uses `getVerseByKey` when key looks composite, otherwise resolves with ID (with the same logic we use today for inferred keys).

## SWR Key Standards

- Include every setting that affects the verse payload:
  - Joined `translationIds` string
  - `wordLang`
  - (Optionally) `tajweed` is UI‑only, not a fetch param.

Examples:

- List: `['verses', 'surah', surahId, translationIds.join(','), wordLang, page]`
- Single: `['single-verse', idOrKey, translationIds.join(','), wordLang]`

## Settings Consistency

- Continue to use `SettingsContext` for:
  - `translationIds`, `translationFontSize`
  - `wordLang`, `wordTranslationId`, `showByWords`
  - `arabicFontFace`, `arabicFontSize`, `tajweed`
- Persist via `usePersistentSettings` (already debounced).

## UI Consistency

- Keep `ReaderVerseCard` and `VerseArabic` as the canonical rendering for verses.
- Do not fork visual components per page. Instead, ensure data parity.
- Keep `SettingsSidebar` shared across pages; bind its toggle state via `UIStateContext`.

## Performance Considerations

- Single‑verse pages fetching words:
  - Recommended default: include `words=true` so word‑by‑word and hover tooltips are available consistently.
  - If bandwidth becomes a concern, we can conditionally fetch words only when `showByWords` is enabled. Trade‑off: hover tooltips may be missing when `showByWords` is off.
- Use the small LRU cache for bookmarks/pinned pages to avoid duplicate requests when scrolling lists.
- Keep pagination and infinite loading logic only in `useVerseListing`.

## Testing Strategy

- Unit
  - `useSingleVerse`: keys, fallbacks (ID vs key), error states.
  - `verseCache`: LRU behavior and key composition.
  - `normalizeVerse`: word mapping across languages.
- Integration
  - Changing translations in the settings sidebar propagates to:
    - Surah/Tafsir/Bookmarks/Pinned cards (multiple translations visible)
    - Word‑by‑word toggles reflect on all pages
  - Audio controls unaffected by data changes.

## Migration Plan (Incremental)

1) Add `useSingleVerse` hook.
2) Switch Tafsir to use `translationIds` (done) or `useSingleVerse`.
3) Update Bookmarks and Pinned to use `useSingleVerse` (or the updated cache helpers that now accept `translationIds`/`wordLang`).
4) Standardize SWR keys across pages.
5) Add tests for the new hook and updated consumers.
6) (Optional) Migrate any remaining single‑verse usages to the hook.

## Risks & Mitigations

- Risk: Increased payload size from `words=true` for single verses.
  - Mitigation: Conditional words fetch or rely on LRU cache. Monitor network.
- Risk: Cache key explosion due to many translation combinations.
  - Mitigation: Small LRU cap; most users won’t exceed a few combinations.
- Risk: Regressions in tests.
  - Mitigation: Cover `useSingleVerse` with mocks; snapshot multiple translations render.

## Observability

- Log/trace verse fetch errors (already use the project logger).
- Add simple counters for single‑verse cache hits/misses (optional).

## Acceptance Criteria

- Multiple translations and word‑by‑word display work consistently on:
  - Surah/Juz/Page lists
  - Tafsir page
  - Bookmarks folder
  - Pinned verses
- Changing settings updates the above without page reloads.

## Phased Implementation Roadmap

This roadmap breaks work into small, verifiable phases suitable for step‑by‑step automation.

### Phase 1 — Unify Fetch Contracts (foundation)

- [x] Ensure single‑verse fetchers accept arrays and word language:
  - `lib/api/verses/extras.ts`: `getVerseById(id, translationIds, wordLang)` and `getVerseByKey(key, translationIds, wordLang)` now join IDs and request words/audio (see `lib/api/__tests__/verse-by-id.test.ts`).
- [x] Update any callers to provide `translationIds` + `wordLang` (Bookmarks UI/provider hooks, verse repositories, home fallback verse).
- [x] Standardize normalization (`normalizeVerse`) with `wordLang` (no additional changes required after audit).
- [x] Confirm Tafsir uses `translationIds` when fetching page=ayah, perPage=1 (already satisfied in `app/(features)/tafsir/hooks/useTafsirVerseData.ts`).

Deliverable: all single‑verse payloads can include multiple translations + words. ✅

### Phase 2 — Add `useSingleVerse` and Adopt It

- [ ] Implement `app/shared/hooks/useSingleVerse.ts`:
  - Reads `translationIds`, `wordLang` from `SettingsContext`.
  - Infers key vs id and fetches via unified fetchers.
  - SWR key: `['single-verse', idOrKey, translationIds.join(','), wordLang]`.
- [ ] Replace ad‑hoc single verse loads in:
  - Bookmarks (folder): `app/(features)/bookmarks/[folderId]/hooks/*`
  - Pinned: `app/(features)/bookmarks/pinned/hooks/*`
  - (Optional) Tafsir: use the hook instead of list‑API with perPage=1.

Deliverable: one standard path for single‑verse fetching across features.

### Phase 3 — SWR & Prefetch Optimization

- [ ] Global SWR config (dedup and revalidate strategies): `app/providers/ClientProviders.tsx` or a SWRConfig provider.
- [ ] Prefetch neighbors:
  - Tafsir: prefetch `ayahId ± 1` when user stops scrolling/reading.
  - Surah list: prefetch next page when nearing end (already partly handled by infinite loader).
- [ ] Virtualize long lists if needed (evaluate current perf first).

Deliverable: reduced duplicate requests and smoother navigation.

### Phase 4 — Server/Edge Caching (optional, for traffic scale)

- [ ] Introduce Next.js Route Handlers as a caching proxy for Quran API endpoints used by the app.
- [ ] Key cache by `path | translationIds | wordLang`; add short TTL + ETag support.
- [ ] Centralize fetchers to hit the proxy first (feature‑flagged for rollout).

Deliverable: predictable, CDN‑friendly caching with consistent request shapes.

### Phase 5 — Observability & Tests

- [ ] Instrument hit/miss for verse LRU cache and log slow requests.
- [ ] Unit tests:
  - `useSingleVerse` hook: keys, id/key inference, error propagation.
  - `verseCache` LRU keys include `translationIds` + `wordLang`.
- [ ] Integration tests:
  - Changing settings updates Tafsir/Bookmarks/Pinned to show multiple translations and words.
  - Audio controls unaffected.

Deliverable: confidence in behavior and performance under variation.

### Phase 6 — Cleanup & Docs

- [ ] Remove dead code paths for single‑verse fetching.
- [ ] Ensure Storybook states cover single vs list cards with multiple translations and words.
- [ ] Finalize this doc with implementation references and lessons learned.

Deliverable: lean codebase with clear docs and consistent UX.

## Immediate Next Steps (Actionable)

- [ ] Implement `useSingleVerse` hook in `app/shared/hooks/useSingleVerse.ts`.
- [ ] Migrate Bookmarks/Pinned to `useSingleVerse`.
- [ ] Add SWRConfig with `dedupingInterval` and `revalidateOnFocus=false` (tune as needed).
- [ ] Add tests for `useSingleVerse` and verify multiple translations in Tafsir/Bookmarks/Pinned.

## Optional

These items are beneficial at scale or for further polish, but not required to fix current inconsistencies. Tackle them when metrics or user feedback justify.

- SWR global config tuning: set `dedupingInterval` and `revalidateOnFocus=false` for reader views.
- Prefetch neighbors:
  - Tafsir: prefetch `ayahId ± 1` when the user pauses or navigates.
  - Surah list: prefetch the next page as the user nears the end.
- Server/Edge caching via Next.js Route Handlers:
  - Cache key includes `path | translationIds | wordLang`; add short TTL and ETag support.
  - Feature‑flag rollout; centralize fetchers to hit proxy first.
- List virtualization for large lists if you observe FPS drops on low‑end devices.
- Lightweight observability: instrument verse LRU cache hit/miss and log slow requests.
