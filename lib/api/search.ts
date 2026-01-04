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
  if (process.env.NODE_ENV !== 'development') return false;
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
        isArabic: result.isArabic,
        isTransliteration: result.isTransliteration,
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
 * Uses Quick mode which prioritizes navigation results and exact matches.
 * This is what appears in the dropdown when typing.
 */
export async function quickSearch(
  query: string,
  options: {
    perPage?: number;
    translationIds?: number[];
  } = {}
): Promise<SearchResponse> {
  const { perPage = 10, translationIds = [20] } = options;
  return comprehensiveSearch(query, {
    perPage,
    translationIds,
    mode: SearchMode.Quick,
  });
}

/**
 * Advanced search for the search results page.
 * Uses Advanced mode with partial matching for comprehensive results.
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

  return comprehensiveSearch(query, {
    size,
    page,
    translationIds,
    mode: SearchMode.Advanced,
    exactMatchesOnly: false, // Include partial matches
  });
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
