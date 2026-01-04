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
// Search Modes (matches quran.com implementation)
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
// V4 API searches across ALL translations (like quran.com)
const V4_SEARCH_BASE_URL = 'https://api.quran.com/api/v4';
const USE_QURAN_FOUNDATION_SEARCH =
  process.env['NEXT_PUBLIC_USE_QURAN_FOUNDATION_SEARCH'] === 'true';
let memoizedSearchProxyBase: string | null | undefined;

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

  return (bodyText ? (JSON.parse(bodyText) as T) : ({} as T));
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
  const translationsParam = (normalizedTranslationIds.length ? normalizedTranslationIds : [20]).join(
    ','
  );
  const qdcParams: Record<string, string> = {
    q: query.trim(),
    size: (mode === SearchMode.Quick ? perPage : size).toString(),
    page: page.toString(),
    translations: translationsParam,
    language: 'en',
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
    const translation = verse.translations?.[0];

    return {
      verseKey: verse.verse_key,
      verseId: verse.verse_id,
      surahNumber,
      verseNumber: ayahNumber,
      textArabic: arabicText,
      highlightedTranslation: translation?.text ?? '',
      translationName: translation?.resource_name ?? '',
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
// V4 API Search (searches across ALL translations like quran.com)
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
      .filter(w => w.char_type === 'word')
      .map(w => w.text)
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
      nextPage: data.search.current_page < data.search.total_pages ? data.search.current_page + 1 : null,
      totalPages: data.search.total_pages,
      totalRecords: data.search.total_results,
    },
  };
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
  const ayahMatch = trimmed.match(/^(\d{1,3})[:.\-](\d{1,3})$/);
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
        ...(result.isTransliteration !== undefined && { isTransliteration: result.isTransliteration }),
      }));

    const verses: SearchVerseResult[] = allResults
      .filter(isVerseResult)
      .map((result) => {
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
 * uses the same backend as quran.com which provides proper exact phrase matching.
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
  const fetchSize = 100;
  const [v4Result, qdcResult] = await Promise.allSettled([
    fetchV4Search(query, fetchSize),
    fetchQdcSearch(query, {
      size: perPage,
      perPage,
      page: 1,
      translationIds,
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
  const filteredVerses = filterAndSortByExactPhrase(v4Results.verses, query, perPage);

  // Merge: QDC navigation + preview verses
  return {
    navigation: qdcResults?.navigation ?? [],
    verses: filteredVerses,
    pagination: {
      ...v4Results.pagination,
      totalRecords: v4Results.pagination.totalRecords,
    },
  };
}

/**
 * Filter and sort verses to prioritize exact phrase matches.
 * 
 * This implements client-side exact phrase matching since the public APIs
 * only do basic word matching. It:
 * 1. Finds verses containing the EXACT phrase (consecutive words)
 * 2. If no exact matches, finds verses with ALL query words
 * 3. Falls back to verses with most query word matches
 */
function filterAndSortByExactPhrase(
  verses: SearchVerseResult[],
  query: string,
  maxResults: number
): SearchVerseResult[] {
  const normalizedQuery = normalizeForSearch(query);
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2); // Ignore short words like "of", "the"
  
  // Score each verse
  const scoredVerses = verses.map(verse => {
    const text = normalizeForSearch(verse.highlightedTranslation.replace(/<[^>]+>/g, ''));
    
    // Check for exact phrase match
    const hasExactPhrase = text.includes(normalizedQuery);
    
    // Count matched query words
    const matchedWords = queryWords.filter(word => text.includes(word)).length;
    const matchRatio = queryWords.length > 0 ? matchedWords / queryWords.length : 0;
    
    // Count highlights (API highlighting)
    const highlightCount = (verse.highlightedTranslation.match(/<em>/gi) || []).length;
    
    // Calculate score: exact match = 100, partial matches < 100
    let score = 0;
    if (hasExactPhrase) {
      score = 100 + highlightCount; // Exact phrase match is highest priority
    } else if (matchRatio === 1) {
      score = 80 + highlightCount; // All words present (but not consecutive)
    } else {
      score = matchRatio * 50 + highlightCount;
    }
    
    return { verse, score, hasExactPhrase, matchRatio };
  });
  
  // Sort by score (highest first)
  scoredVerses.sort((a, b) => b.score - a.score);
  
  // Return top results, prioritizing exact matches
  const exactMatches = scoredVerses.filter(s => s.hasExactPhrase);
  const partialMatches = scoredVerses.filter(s => !s.hasExactPhrase);
  
  // If we have exact matches, show those first
  const results: SearchVerseResult[] = [];
  
  // Add exact matches first (capped at maxResults)
  for (const s of exactMatches) {
    if (results.length >= maxResults) break;
    results.push(s.verse);
  }
  
  // Fill remaining slots with best partial matches
  for (const s of partialMatches) {
    if (results.length >= maxResults) break;
    results.push(s.verse);
  }
  
  return results;
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
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritics (accents)
    // Remove punctuation but keep letters from all scripts (Unicode property escapes)
    // This preserves Bangla, Arabic, Hebrew, etc.
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    const sortedPool = filterAndSortByExactPhrase(bestMatchPool.verses, query, bestMatchPool.verses.length);
    
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
