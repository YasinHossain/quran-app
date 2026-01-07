/**
 * Comprehensive Search API
 *
 * Implements advanced search functionality including:
 * - Navigation detection (surah, ayah, juz, page)
 * - Verse text search with highlighting
 * - Surah name matching
 */

import { parseVerseKey } from '@/lib/utils/verse';

import { fetchWithTimeout } from './client';

// ============================================================================
// Search Modes
// ============================================================================

/**
 * Search mode determines how the API processes the query:
 * - Quick: Optimized for dropdown/autocomplete, favors navigation and exact matches
 * - Advanced: Full text search with partial matching for search results page
 */
export enum SearchMode {
  Quick = 'quick',
  Advanced = 'advanced',
}

// ============================================================================
// Types
// ============================================================================

const SEARCH_PROXY_ROUTE_PATH = '/api/proxy/search';
const QDC_SEARCH_BASE_URL = 'https://api.qurancdn.com/api/qdc';
// V4 API searches across ALL translations
const V4_SEARCH_BASE_URL = 'https://api.quran.com/api/v4';
const USE_QURAN_FOUNDATION_SEARCH =
  process.env['NEXT_PUBLIC_USE_QURAN_FOUNDATION_SEARCH'] === 'true';
const SEARCH_CACHE_TTL_MS = 30_000;
let memoizedSearchProxyBase: string | null | undefined;

type CachedSearchResult = {
  expiresAt: number;
  value: SearchResponse;
};

const quickSearchCache = new Map<string, CachedSearchResult>();
const quickSearchInFlight = new Map<string, Promise<SearchResponse>>();
const v4SearchCache = new Map<string, CachedSearchResult>();
const v4SearchInFlight = new Map<string, Promise<SearchResponse>>();

function normalizeQueryForCache(query: string): string {
  return query.trim();
}

function normalizeTranslationIdsForKey(translationIds: number[]): number[] {
  return Array.from(
    new Set(
      translationIds
        .map((id) => Number.parseInt(String(id), 10))
        .filter((id) => Number.isFinite(id))
    )
  ).sort((a, b) => a - b);
}

function buildQuickSearchCacheKey(
  query: string,
  perPage: number,
  translationIds: number[],
  mode: SearchMode
): string {
  const normalizedQuery = normalizeQueryForCache(query);
  const translationKey = normalizeTranslationIdsForKey(translationIds).join(',');
  const backendKey = USE_QURAN_FOUNDATION_SEARCH ? 'qfs' : 'public';
  return [backendKey, mode, perPage.toString(), translationKey, normalizedQuery].join('|');
}

function buildV4SearchCacheKey(query: string, size: number, page: number): string {
  const normalizedQuery = normalizeQueryForCache(query);
  return [normalizedQuery, size.toString(), page.toString()].join('|');
}

function getCachedSearchResult(
  cache: Map<string, CachedSearchResult>,
  key: string
): SearchResponse | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() >= cached.expiresAt) {
    cache.delete(key);
    return null;
  }
  return cached.value;
}

function setCachedSearchResult(
  cache: Map<string, CachedSearchResult>,
  key: string,
  value: SearchResponse
): void {
  cache.set(key, {
    value,
    expiresAt: Date.now() + SEARCH_CACHE_TTL_MS,
  });
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function normaliseOrigin(candidate?: string | null): string | null {
  if (!candidate) return null;
  const trimmed = candidate.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/$/, '');
  }
  return `https://${trimmed.replace(/\/$/, '')}`;
}

function resolveSearchBase(): string {
  if (typeof window !== 'undefined' && window.location) {
    return ensureTrailingSlash(`${window.location.origin}${SEARCH_PROXY_ROUTE_PATH}`);
  }

  if (memoizedSearchProxyBase !== undefined) {
    return memoizedSearchProxyBase ?? '';
  }

  const originCandidates: Array<string | null | undefined> = [
    process.env['INTERNAL_API_ORIGIN'],
    process.env['NEXT_PUBLIC_APP_ORIGIN'],
    process.env['APP_ORIGIN'],
    process.env['APP_URL'],
    process.env['SITE_URL'],
    process.env['NEXTAUTH_URL'],
    process.env['URL'],
    process.env['VERCEL_URL'],
    process.env['NEXT_PUBLIC_VERCEL_URL'],
  ];

  for (const candidate of originCandidates) {
    const origin = normaliseOrigin(candidate);
    if (origin) {
      memoizedSearchProxyBase = ensureTrailingSlash(`${origin}${SEARCH_PROXY_ROUTE_PATH}`);
      return memoizedSearchProxyBase;
    }
  }

  const port = process.env['PORT'] ?? '3000';
  memoizedSearchProxyBase = ensureTrailingSlash(
    `http://127.0.0.1:${port}${SEARCH_PROXY_ROUTE_PATH}`
  );
  return memoizedSearchProxyBase;
}

async function searchFetch<T>(
  params: Record<string, string>,
  errorPrefix = 'Search failed'
): Promise<T> {
  const base = resolveSearchBase();
  const url = new URL('v1/search', ensureTrailingSlash(base));
  if (Object.keys(params).length) {
    const search = new URLSearchParams(params).toString().replace(/%2C/g, ',');
    url.search = search;
  }

  const res = await fetchWithTimeout(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
    allowNonOk: true,
    errorPrefix,
  });

  const bodyText = await res.text();
  if (!res.ok) {
    let message = `${errorPrefix}: ${res.status} ${res.statusText}`;
    try {
      const payload = JSON.parse(bodyText) as { error?: string };
      if (payload?.error) {
        message = `${errorPrefix}: ${payload.error}`;
      }
    } catch {
      // ignore invalid JSON error bodies
    }
    throw new Error(message);
  }

  return bodyText ? (JSON.parse(bodyText) as T) : ({} as T);
}

async function qdcSearchFetch<T>(
  params: Record<string, string>,
  errorPrefix = 'Search failed'
): Promise<T> {
  const url = new URL('search', ensureTrailingSlash(QDC_SEARCH_BASE_URL));
  if (Object.keys(params).length) {
    const search = new URLSearchParams(params).toString().replace(/%2C/g, ',');
    url.search = search;
  }

  const res = await fetchWithTimeout(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
    errorPrefix,
  });

  return (await res.json()) as T;
}

function shouldFallbackToQdc(error: unknown): boolean {
  const message = error instanceof Error ? error.message : '';
  return (
    message.includes('Quran search gateway URL is not configured') ||
    message.includes('Quran search signature token is not configured') ||
    message.includes('Quran search internal client id is not configured') ||
    message.includes('Failed to reach Quran search service')
  );
}

export type SearchNavigationType =
  | 'surah'
  | 'ayah'
  | 'juz'
  | 'page'
  | 'search_page'
  | 'hizb'
  | 'rub_el_hizb'
  | 'range'
  | 'quran_range'
  | 'translation'
  | 'transliteration'
  | 'history';

export interface SearchNavigationResult {
  resultType: SearchNavigationType;
  key: string | number;
  name: string;
  isArabic?: boolean;
  isTransliteration?: boolean;
}

export interface SearchVerseResult {
  verseKey: string;
  verseId?: number | undefined;
  surahNumber: number;
  verseNumber: number;
  textArabic: string;
  highlightedTranslation: string;
  translationName: string;
}

export interface SearchResponse {
  navigation: SearchNavigationResult[];
  verses: SearchVerseResult[];
  pagination: {
    currentPage: number;
    nextPage: number | null;
    totalPages: number;
    totalRecords: number;
  };
}

// Raw API response types (Quran Foundation Search)
interface ApiSearchResultItem {
  key: string;
  result_type: SearchNavigationType;
  name: string;
  isArabic?: boolean;
  isTransliteration?: boolean;
}

interface ApiSearchResponse {
  result: {
    navigation: ApiSearchResultItem[];
    verses: ApiSearchResultItem[];
  };
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

interface QdcApiNavigationResult {
  result_type: string;
  name: string;
  key: string | number;
}

interface QdcApiWord {
  char_type: string;
  text: string;
}

interface QdcApiTranslation {
  text: string;
  resource_id: number;
  resource_name: string;
  language_name: string;
}

interface QdcApiVerseResult {
  verse_key: string;
  verse_id?: number;
  words?: QdcApiWord[];
  translations?: QdcApiTranslation[];
}

interface QdcApiSearchResponse {
  result: {
    navigation: QdcApiNavigationResult[];
    verses: QdcApiVerseResult[];
  };
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

async function fetchQdcSearch(
  query: string,
  {
    size,
    perPage,
    page,
    translationIds,
    mode,
  }: {
    size: number;
    perPage: number;
    page: number;
    translationIds: number[];
    mode: SearchMode;
  }
): Promise<SearchResponse> {
  const normalizedTranslationIds = Array.from(
    new Set(
      translationIds
        .map((id) => Number.parseInt(String(id), 10))
        .filter((id) => Number.isFinite(id))
    )
  );
  const translationsParam = (
    normalizedTranslationIds.length ? normalizedTranslationIds : [20]
  ).join(',');
  const qdcParams: Record<string, string> = {
    q: query.trim(),
    size: (mode === SearchMode.Quick ? perPage : size).toString(),
    page: page.toString(),
    translations: translationsParam,
    // Don't force language - let API auto-detect from query (Arabic, English, Bangla, etc.)
  };

  const data = await qdcSearchFetch<QdcApiSearchResponse>(qdcParams, 'Search failed');

  const navigation: SearchNavigationResult[] = data.result.navigation.map((nav) => ({
    resultType: nav.result_type as SearchNavigationType,
    key: nav.key,
    name: nav.name,
  }));

  const verses: SearchVerseResult[] = data.result.verses.map((verse) => {
    const { surahNumber, ayahNumber } = parseVerseKey(verse.verse_key);
    const arabicText = (verse.words ?? [])
      .filter((w) => w.char_type === 'word')
      .map((w) => w.text)
      .join(' ');

    // PICK BEST TRANSLATION
    // Instead of just taking the first one, look for the one that matches our query!
    const translations = verse.translations ?? [];
    let bestTranslation = translations[0];

    if (query && translations.length > 1) {
      const normalizedQuery = normalizeForSearch(query);
      const exactMatch = translations.find((t) =>
        normalizeForSearch(t.text).includes(normalizedQuery)
      );
      if (exactMatch) {
        bestTranslation = exactMatch;
      }
    }

    return {
      verseKey: verse.verse_key,
      verseId: verse.verse_id,
      surahNumber,
      verseNumber: ayahNumber,
      textArabic: arabicText,
      highlightedTranslation: bestTranslation?.text ?? '',
      translationName: bestTranslation?.resource_name ?? '',
    };
  });

  return {
    navigation,
    verses,
    pagination: {
      currentPage: data.pagination.current_page,
      nextPage: data.pagination.next_page,
      totalPages: data.pagination.total_pages,
      totalRecords: data.pagination.total_records,
    },
  };
}

// ============================================================================
// V4 API Search (searches across ALL translations)
// ============================================================================

interface V4ApiTranslation {
  text: string;
  resource_id: number;
  name: string;
  language_name: string;
}

interface V4ApiWord {
  char_type: string;
  text: string;
}

interface V4ApiSearchResult {
  verse_key: string;
  verse_id: number;
  text: string;
  highlighted: string | null;
  words: V4ApiWord[];
  translations: V4ApiTranslation[];
}

interface V4ApiSearchResponse {
  search: {
    query: string;
    total_results: number;
    current_page: number;
    total_pages: number;
    results: V4ApiSearchResult[];
  };
}

/**
 * Fetch search results from V4 API.
 * This API searches across ALL translations (not just one),
 * which enables finding exact phrase matches that may only exist
 * in certain translations (e.g., "Book of Allah" in Yusuf Ali).
 *
 * The V4 API automatically detects the query language and returns
 * translations in that language. So if you search in Bangla, you
 * get Bangla results; if you search in English, you get English results.
 */
async function fetchV4Search(
  query: string,
  size: number = 10,
  page: number = 1
): Promise<SearchResponse> {
  const cacheKey = buildV4SearchCacheKey(query, size, page);
  const cached = getCachedSearchResult(v4SearchCache, cacheKey);
  if (cached) return cached;

  const inFlight = v4SearchInFlight.get(cacheKey);
  if (inFlight) return inFlight;

  const request = (async (): Promise<SearchResponse> => {
    const url = new URL('search', ensureTrailingSlash(V4_SEARCH_BASE_URL));
    url.searchParams.set('q', query.trim());
    url.searchParams.set('size', size.toString());
    url.searchParams.set('page', page.toString());
    // Don't force language - let API auto-detect from query

    const res = await fetchWithTimeout(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      errorPrefix: 'V4 Search failed',
    });

    const data = (await res.json()) as V4ApiSearchResponse;

    // V4 API doesn't return navigation results, just verses
    const navigation: SearchNavigationResult[] = [];

    const verses: SearchVerseResult[] = data.search.results.map((result) => {
      const { surahNumber, ayahNumber } = parseVerseKey(result.verse_key);

      // Get Arabic text from words
      const arabicText = result.words
        .filter((w) => w.char_type === 'word')
        .map((w) => w.text)
        .join(' ');

      // Get the first translation - the API returns the best matching one
      // based on the query language
      const translation = result.translations?.[0];

      return {
        verseKey: result.verse_key,
        verseId: result.verse_id,
        surahNumber,
        verseNumber: ayahNumber,
        textArabic: arabicText || result.text,
        highlightedTranslation: translation?.text ?? '',
        translationName: translation?.name ?? '',
      };
    });

    return {
      navigation,
      verses,
      pagination: {
        currentPage: data.search.current_page,
        nextPage:
          data.search.current_page < data.search.total_pages ? data.search.current_page + 1 : null,
        totalPages: data.search.total_pages,
        totalRecords: data.search.total_results,
      },
    };
  })();

  v4SearchInFlight.set(cacheKey, request);

  try {
    const result = await request;
    setCachedSearchResult(v4SearchCache, cacheKey, result);
    return result;
  } finally {
    v4SearchInFlight.delete(cacheKey);
  }
}

// ============================================================================
// Query Parsing
// ============================================================================

interface ParsedQuery {
  type: 'navigation' | 'text';
  navigationType?: SearchNavigationType;
  value?: string | number;
  surah?: number;
  verse?: number;
}

/**
 * Parse user query to detect navigation patterns like:
 * - "2:255" -> ayah navigation
 * - "juz 1" or "juz1" -> juz navigation
 * - "page 50" -> page navigation
 * - "yasin" or "36" -> surah search
 */
function parseQuery(query: string): ParsedQuery {
  const trimmed = query.trim().toLowerCase();

  // Ayah pattern: "2:255" or "2-255" or "2.255"
  const ayahMatch = trimmed.match(/^(\d{1,3})[:.-](\d{1,3})$/);
  if (ayahMatch) {
    return {
      type: 'navigation',
      navigationType: 'ayah',
      surah: parseInt(ayahMatch[1]!, 10),
      verse: parseInt(ayahMatch[2]!, 10),
    };
  }

  // Juz pattern: "juz 1", "juz1", "juz 30"
  const juzMatch = trimmed.match(/^juz\s*(\d{1,2})$/);
  if (juzMatch) {
    return {
      type: 'navigation',
      navigationType: 'juz',
      value: parseInt(juzMatch[1]!, 10),
    };
  }

  // Page pattern: "page 50", "page50", "p 50", "p50"
  const pageMatch = trimmed.match(/^(?:page|p)\s*(\d{1,3})$/);
  if (pageMatch) {
    return {
      type: 'navigation',
      navigationType: 'page',
      value: parseInt(pageMatch[1]!, 10),
    };
  }

  // Surah number only: "36", "1", "114"
  const surahNumberMatch = trimmed.match(/^(\d{1,3})$/);
  if (surahNumberMatch) {
    const num = parseInt(surahNumberMatch[1]!, 10);
    if (num >= 1 && num <= 114) {
      return {
        type: 'navigation',
        navigationType: 'surah',
        value: num,
      };
    }
  }

  // Default: text search
  return { type: 'text' };
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Perform a comprehensive search using the API.
 *
 * @param query - Search query string
 * @param options - Search options
 * @returns Search results including navigation and verse matches
 */
export async function comprehensiveSearch(
  query: string,
  options: {
    size?: number;
    perPage?: number;
    page?: number;
    translationIds?: number[];
    mode?: SearchMode;
    exactMatchesOnly?: boolean;
  } = {}
): Promise<SearchResponse> {
  const {
    size = 10,
    perPage = 10,
    page = 1,
    translationIds = [20],
    mode = SearchMode.Quick,
    exactMatchesOnly = false,
  } = options;

  if (!query.trim()) {
    return {
      navigation: [],
      verses: [],
      pagination: {
        currentPage: 1,
        nextPage: null,
        totalPages: 0,
        totalRecords: 0,
      },
    };
  }

  if (!USE_QURAN_FOUNDATION_SEARCH) {
    return fetchQdcSearch(query, {
      size,
      perPage,
      page,
      translationIds,
      mode,
    });
  }

  try {
    const normalizedTranslationIds = Array.from(
      new Set(
        translationIds
          .map((id) => Number.parseInt(String(id), 10))
          .filter((id) => Number.isFinite(id))
      )
    );

    const params: Record<string, string> = {
      mode,
      query: query.trim(),
      get_text: '1',
      highlight: '1',
      translation_ids: (normalizedTranslationIds.length ? normalizedTranslationIds : [20]).join(
        ','
      ),
    };

    if (mode === SearchMode.Quick) {
      params['per_page'] = perPage.toString();
    }

    if (mode === SearchMode.Advanced) {
      params['size'] = size.toString();
      params['page'] = page.toString();
      params['exact_matches_only'] = exactMatchesOnly ? '1' : '0';
    }

    const data = await searchFetch<ApiSearchResponse>(params, 'Search failed');

    const navigationResults = data.result?.navigation ?? [];
    const verseResults = data.result?.verses ?? [];
    const allResults = [...navigationResults, ...verseResults];
    const isVerseResult = (result: ApiSearchResultItem): boolean =>
      result.result_type === 'ayah' ||
      result.result_type === 'translation' ||
      result.result_type === 'transliteration';

    const navigation: SearchNavigationResult[] = allResults
      .filter((result) => !isVerseResult(result))
      .map((result) => ({
        resultType: result.result_type,
        key: result.key,
        name: result.name,
        ...(result.isArabic !== undefined && { isArabic: result.isArabic }),
        ...(result.isTransliteration !== undefined && {
          isTransliteration: result.isTransliteration,
        }),
      }));

    const verses: SearchVerseResult[] = allResults.filter(isVerseResult).map((result) => {
      const verseKey = String(result.key);
      const { surahNumber, ayahNumber } = parseVerseKey(verseKey);

      return {
        verseKey,
        verseId: undefined,
        surahNumber,
        verseNumber: ayahNumber,
        textArabic: '',
        highlightedTranslation: result.name,
        translationName: '',
      };
    });

    return {
      navigation,
      verses,
      pagination: {
        currentPage: data.pagination.current_page,
        nextPage: data.pagination.next_page,
        totalPages: data.pagination.total_pages,
        totalRecords: data.pagination.total_records,
      },
    };
  } catch (error) {
    if (shouldFallbackToQdc(error)) {
      return fetchQdcSearch(query, {
        size,
        perPage,
        page,
        translationIds,
        mode,
      });
    }
    console.error('Search error:', error);
    throw error;
  }
}

/**
 * Quick search for autocomplete/dropdown.
 *
 * When Quran Foundation Search is enabled (via NEXT_PUBLIC_USE_QURAN_FOUNDATION_SEARCH=true),
 * uses the same backend which provides proper exact phrase matching.
 *
 * When not enabled, uses public APIs with client-side exact phrase sorting
 * to keep the preview relevant.
 */
export async function quickSearch(
  query: string,
  options: {
    perPage?: number;
    translationIds?: number[];
  } = {}
): Promise<SearchResponse> {
  const { perPage = 10, translationIds = [20] } = options;
  const cacheKey = buildQuickSearchCacheKey(query, perPage, translationIds, SearchMode.Quick);
  const cached = getCachedSearchResult(quickSearchCache, cacheKey);
  if (cached) return cached;

  const inFlight = quickSearchInFlight.get(cacheKey);
  if (inFlight) return inFlight;

  const request = (async (): Promise<SearchResponse> => {
    // If Quran Foundation Search is enabled, use it for proper exact phrase matching
    if (USE_QURAN_FOUNDATION_SEARCH) {
      return comprehensiveSearch(query, {
        perPage,
        translationIds,
        mode: SearchMode.Quick,
      });
    }

    // Fallback: Use public APIs with client-side phrase matching workaround
    // Fetch a larger pool to prioritize exact phrase matches
    // QUICK WIN: Increased from 100 to 150 for better coverage
    const fetchSize = 150;

    // SMART SEARCH: Keep the user's selected translation, but ALSO search
    // popular English translations to maximize finding exact phrase matches.
    // (If query is English-like)
    const expandedTranslationIds = [...translationIds];
    const isEnglish = /^[a-zA-Z0-9\s\p{P}]+$/u.test(query);
    if (isEnglish) {
      // Add The Clear Quran (131), Abdel Haleem (85), Yusuf Ali (22), Saheeh (20)
      const popularIds = [131, 85, 22, 20];
      for (const id of popularIds) {
        if (!expandedTranslationIds.includes(id)) {
          expandedTranslationIds.push(id);
        }
      }
    }

    const [v4Result, qdcResult] = await Promise.allSettled([
      fetchV4Search(query, fetchSize),
      fetchQdcSearch(query, {
        size: perPage,
        perPage,
        page: 1,
        translationIds: expandedTranslationIds, // Use expanded list
        mode: SearchMode.Quick,
      }),
    ]);

    const v4Results = v4Result.status === 'fulfilled' ? v4Result.value : null;
    const qdcResults = qdcResult.status === 'fulfilled' ? qdcResult.value : null;

    if (v4Result.status === 'rejected') {
      console.error('Quick search V4 error:', v4Result.reason);
    }

    if (qdcResult.status === 'rejected') {
      console.error('Quick search QDC error:', qdcResult.reason);
    }

    if (!v4Results && qdcResults) {
      return qdcResults;
    }

    if (!v4Results) {
      console.error('Quick search failed for both V4 and QDC.', {
        v4Error: v4Result.status === 'rejected' ? v4Result.reason : null,
        qdcError: qdcResult.status === 'rejected' ? qdcResult.reason : null,
      });
      throw new Error('Quick search failed for both V4 and QDC');
    }

    // Filter and sort to prioritize exact phrase matches
    // Merge V4 results with QDC results (which now include best translations)
    const combinedVerses = [...v4Results.verses];
    if (qdcResults?.verses) {
      // Add QDC verses if not already in V4 list
      // Note: QDC verses are often BETTER because we explicitly fetched the
      // best matching translation text! We should actually prefer them if duplicates exist.
      for (const v of qdcResults.verses) {
        const existingIdx = combinedVerses.findIndex((cv) => cv.verseKey === v.verseKey);
        if (existingIdx !== -1) {
          // If the QDC result has a better match (exact phrase), replace the V4 one
          if (normalizeForSearch(v.highlightedTranslation).includes(normalizeForSearch(query))) {
            combinedVerses[existingIdx] = v;
          }
        } else {
          combinedVerses.push(v);
        }
      }
    }

    const filteredVerses = filterAndSortByExactPhrase(combinedVerses, query, perPage);

    // Merge: QDC navigation + preview verses
    return {
      navigation: qdcResults?.navigation ?? [],
      verses: filteredVerses,
      pagination: {
        ...v4Results.pagination,
        totalRecords: v4Results.pagination.totalRecords,
      },
    };
  })();

  quickSearchInFlight.set(cacheKey, request);

  try {
    const result = await request;
    setCachedSearchResult(quickSearchCache, cacheKey, result);
    return result;
  } finally {
    quickSearchInFlight.delete(cacheKey);
  }
}

/**
 * Enhanced search scoring with multiple relevance signals.
 *
 * QUICK WINS implemented:
 * 1. N-gram matching (2-word, 3-word consecutive matches)
 * 2. Position weighting (phrase at start of verse scores higher)
 * 3. Word proximity scoring (words closer together score higher)
 * 4. Keeps ALL words for phrase matching (including "of", "the")
 * 5. Word order sensitivity (preserves query word order importance)
 * 6. Substring matching for partial word matches
 */
function filterAndSortByExactPhrase(
  verses: SearchVerseResult[],
  query: string,
  maxResults: number
): SearchVerseResult[] {
  const normalizedQuery = normalizeForSearch(query);

  // Keep ALL words for exact phrase matching (don't filter short words)
  const allQueryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);
  // Filter for individual word matching (skip very short words)
  const significantWords = allQueryWords.filter((w) => w.length > 2);

  // Generate n-grams (2-word and 3-word consecutive phrases)
  const bigrams = generateNgrams(allQueryWords, 2);
  const trigrams = generateNgrams(allQueryWords, 3);

  // Score each verse with enhanced algorithm
  const scoredVerses = verses.map((verse) => {
    const rawText = verse.highlightedTranslation.replace(/<[^>]+>/g, '');
    const text = normalizeForSearch(rawText);
    const textWords = text.split(/\s+/);

    // === SCORING COMPONENTS ===

    // 1. EXACT PHRASE MATCH (highest priority)
    const hasExactPhrase = text.includes(normalizedQuery);
    const exactPhraseScore = hasExactPhrase ? 1000 : 0;

    // 2. POSITION BONUS (phrase appears near start of verse)
    let positionScore = 0;
    if (hasExactPhrase) {
      const position = text.indexOf(normalizedQuery);
      const relativePosition = position / text.length;
      // Score higher if phrase is at the beginning (0-25% = full bonus)
      positionScore = Math.max(0, 100 * (1 - relativePosition * 2));
    }

    // 3. N-GRAM MATCHING (partial consecutive word matches)
    let ngramScore = 0;
    // Trigram matches (3 consecutive words) = 150 points each
    for (const trigram of trigrams) {
      if (text.includes(trigram)) ngramScore += 150;
    }
    // Bigram matches (2 consecutive words) = 75 points each
    for (const bigram of bigrams) {
      if (text.includes(bigram)) ngramScore += 75;
    }

    // 4. WORD PROXIMITY SCORING (how close are matched words to each other?)
    let proximityScore = 0;
    if (significantWords.length >= 2) {
      const wordPositions: number[] = [];
      for (const word of significantWords) {
        const idx = textWords.findIndex((tw) => tw.includes(word) || word.includes(tw));
        if (idx !== -1) wordPositions.push(idx);
      }
      if (wordPositions.length >= 2) {
        wordPositions.sort((a, b) => a - b);
        // Calculate average distance between matched words
        let totalDistance = 0;
        for (let i = 1; i < wordPositions.length; i++) {
          totalDistance += wordPositions[i]! - wordPositions[i - 1]!;
        }
        const avgDistance = totalDistance / (wordPositions.length - 1);
        // Lower distance = higher score (max 100 when words are adjacent)
        proximityScore = Math.max(0, 100 - avgDistance * 10);
      }
    }

    // 5. WORD MATCH RATIO
    const matchedSignificantWords = significantWords.filter((word) =>
      textWords.some((tw) => tw.includes(word) || word.includes(tw))
    ).length;
    const matchRatio =
      significantWords.length > 0 ? matchedSignificantWords / significantWords.length : 0;
    const matchRatioScore = matchRatio * 200; // Up to 200 points for all words matching

    // 6. WORD ORDER PRESERVATION
    let orderScore = 0;
    if (matchedSignificantWords >= 2) {
      const positions = significantWords
        .map((word) => textWords.findIndex((tw) => tw.includes(word) || word.includes(tw)))
        .filter((pos) => pos !== -1);

      // Check if positions are in ascending order (same as query)
      let inOrder = true;
      for (let i = 1; i < positions.length; i++) {
        if (positions[i]! <= positions[i - 1]!) {
          inOrder = false;
          break;
        }
      }
      orderScore = inOrder ? 50 : 0;
    }

    // 7. API HIGHLIGHT BONUS (trust the API's relevance signals)
    const highlightCount = (verse.highlightedTranslation.match(/<em>/gi) || []).length;
    const highlightScore = highlightCount * 10;

    // 8. FULL WORD MATCH BONUS (not just substring)
    let fullWordMatchScore = 0;
    for (const word of significantWords) {
      if (textWords.includes(word)) fullWordMatchScore += 25;
    }

    // === COMBINE ALL SCORES ===
    const totalScore =
      exactPhraseScore +
      positionScore +
      ngramScore +
      proximityScore +
      matchRatioScore +
      orderScore +
      highlightScore +
      fullWordMatchScore;

    return {
      verse,
      score: totalScore,
      hasExactPhrase,
      matchRatio,
      // Debug info (can be removed in production)
      _debug: {
        exactPhraseScore,
        positionScore,
        ngramScore,
        proximityScore,
        matchRatioScore,
        orderScore,
        highlightScore,
        fullWordMatchScore,
      },
    };
  });

  // Sort by total score (highest first)
  scoredVerses.sort((a, b) => b.score - a.score);

  // Return top results
  return scoredVerses.slice(0, maxResults).map((s) => s.verse);
}

/**
 * Generate n-grams (consecutive word sequences) from word array.
 * Example: ["book", "of", "Allah"] with n=2 -> ["book of", "of Allah"]
 */
function generateNgrams(words: string[], n: number): string[] {
  if (words.length < n) return [];
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/**
 * Normalize text for search comparison.
 * Handles all scripts (Latin, Bangla, Arabic, etc.)
 * - Converts to lowercase
 * - Removes diacritics (for Latin scripts)
 * - Removes punctuation while preserving letters from all scripts
 * - Normalizes whitespace
 */
function normalizeForSearch(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritics (accents)
      // Remove punctuation but keep letters from all scripts (Unicode property escapes)
      // This preserves Bangla, Arabic, Hebrew, etc.
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Advanced search for the search results page.
 *
 * When Quran Foundation Search is enabled, uses their proper exact phrase matching.
 * When not enabled, uses V4 API with client-side exact phrase filtering.
 *
 * This is what appears on the /search page after pressing Enter.
 */
export async function advancedSearch(
  query: string,
  options: {
    page?: number;
    size?: number;
    translationIds?: number[];
  } = {}
): Promise<SearchResponse> {
  const { page = 1, size = 10, translationIds = [20] } = options;

  // If Quran Foundation Search is enabled, use it for proper exact phrase matching
  if (USE_QURAN_FOUNDATION_SEARCH) {
    return comprehensiveSearch(query, {
      size,
      page,
      translationIds,
      mode: SearchMode.Advanced,
      exactMatchesOnly: false, // Include partial matches
    });
  }

  // Fallback: Use V4 API with client-side exact phrase filtering
  try {
    // Cap at 50 to prevent API timeout. This serves as our "Best Match" pool.
    const sortWindowSize = 50;

    // 1. Fetch the "Best Match" pool (first 50 results)
    // We always want to check the top 50 global results to see if any are exact matches
    const bestMatchPool = await fetchV4Search(query, sortWindowSize, 1);

    // 2. Sort the pool by exact phrase match
    const sortedPool = filterAndSortByExactPhrase(
      bestMatchPool.verses,
      query,
      bestMatchPool.verses.length
    );

    // 3. Determine which results to return
    let versesToReturn: SearchVerseResult[] = [];
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    // If the requested page falls strictly within our sorted pool, use the sorted results
    if (endIndex <= sortedPool.length) {
      versesToReturn = sortedPool.slice(startIndex, endIndex);
    } else {
      // PRO TIP: The user is asking for page 6+ (results 51+).
      // Our sorted pool only has top 50.
      // At this depth, we abandon "Best Match" sorting and return standard API pagination.
      // We fetch the specific page requested.
      const standardPage = await fetchV4Search(query, size, page);
      versesToReturn = standardPage.verses;
    }

    // Get navigation results from QDC API (only needed for page 1 usually, but cheap to fetch)
    const qdcResults = await fetchQdcSearch(query, {
      size: 5,
      perPage: 5,
      page: 1,
      translationIds,
      mode: SearchMode.Quick,
    });

    return {
      navigation: qdcResults.navigation,
      verses: versesToReturn,
      pagination: {
        currentPage: page,
        nextPage: page < bestMatchPool.pagination.totalPages ? page + 1 : null,
        totalPages: bestMatchPool.pagination.totalPages,
        totalRecords: bestMatchPool.pagination.totalRecords, // Use REAL total from API
      },
    };
  } catch (error) {
    console.error('Advanced search error, falling back to QDC:', error);
    // Fallback to comprehensiveSearch which uses QDC
    return comprehensiveSearch(query, {
      size,
      page,
      translationIds,
      mode: SearchMode.Advanced,
      exactMatchesOnly: false,
    });
  }
}

/**
 * Analyze query and return parsed navigation intent.
 * Useful for client-side quick navigation before API call.
 */
export function analyzeQuery(query: string): ParsedQuery {
  return parseQuery(query);
}

/**
 * Build URL for search results page.
 */
export function buildSearchUrl(query: string, page = 1): string {
  const params = new URLSearchParams({ query: query.trim() });
  if (page > 1) params.set('page', page.toString());
  return `/search?${params.toString()}`;
}
