/**
 * Comprehensive Search API
 *
 * Implements advanced search functionality including:
 * - Navigation detection (surah, ayah, juz, page)
 * - Verse text search with highlighting
 * - Surah name matching
 */

import { apiFetch } from './client';

// ============================================================================
// Types
// ============================================================================

export type SearchNavigationType = 'surah' | 'ayah' | 'juz' | 'page' | 'search_page';

export interface SearchNavigationResult {
  resultType: SearchNavigationType;
  key: string | number;
  name: string;
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

// Raw API response types
interface ApiNavigationResult {
  result_type: string;
  name: string;
  key: string | number;
}

interface ApiWord {
  char_type: string;
  text: string;
}

interface ApiTranslation {
  text: string;
  resource_id: number;
  resource_name: string;
  language_name: string;
}

interface ApiVerseResult {
  verse_key: string;
  verse_id?: number;
  words: ApiWord[];
  translations: ApiTranslation[];
}

interface ApiSearchResponse {
  result: {
    navigation: ApiNavigationResult[];
    verses: ApiVerseResult[];
  };
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
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
    page?: number;
    translationId?: number;
    language?: string;
  } = {}
): Promise<SearchResponse> {
  const { size = 10, page = 1, translationId = 20, language = 'en' } = options;

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
    const data = await apiFetch<ApiSearchResponse>(
      'search',
      {
        q: query.trim(),
        size: size.toString(),
        page: page.toString(),
        translations: translationId.toString(),
        language,
      },
      'Search failed'
    );

    // Transform navigation results
    const navigation: SearchNavigationResult[] = data.result.navigation.map((nav) => ({
      resultType: nav.result_type as SearchNavigationType,
      key: nav.key,
      name: nav.name,
    }));

    // Transform verse results
    const verses: SearchVerseResult[] = data.result.verses.map((verse) => {
      const [surah, verseNum] = verse.verse_key.split(':').map(Number);
      const arabicText = verse.words
        .filter((w) => w.char_type === 'word')
        .map((w) => w.text)
        .join(' ');
      const translation = verse.translations[0];

      return {
        verseKey: verse.verse_key,
        verseId: verse.verse_id,
        surahNumber: surah!,
        verseNumber: verseNum!,
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
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

/**
 * Quick search for autocomplete/dropdown - returns limited results faster.
 */
export async function quickSearch(
  query: string,
  translationId = 20
): Promise<SearchResponse> {
  return comprehensiveSearch(query, { size: 20, translationId });
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
