import { DEFAULT_MUSHAF_ID } from '@/data/mushaf/options';
import { apiFetch } from '@/lib/api/client';

import { mapReadingViewVerseToMushafVerse, type ReadingViewApiVerse } from './mapReadingViewTypes';

import type { MushafVerse } from '@/types';

const API_MUSHAF_FALLBACK_ID = 2; // Madani V1 layout
const API_MUSHAF_MAP: Record<string, number> = {
  [DEFAULT_MUSHAF_ID]: 2,
  'qcf-madani-v2': 1,
  'qpc-uthmani-hafs': 5,
  'unicode-indopak-16': 7,
};

const WORD_FIELDS = [
  'verse_key',
  'verse_id',
  'page_number',
  'line_number',
  'location',
  'text_uthmani',
  'text_indopak',
  'code_v1',
  'code_v2',
  'char_type_name',
];

const resolveApiMushafId = (id?: string): number =>
  API_MUSHAF_MAP[id ?? DEFAULT_MUSHAF_ID] ?? API_MUSHAF_FALLBACK_ID;

export interface ReadingViewRequestParams {
  /**
   * Mushaf page number to load.
   */
  pageNumber: number;

  /**
   * Identifier of the mushaf layout / script (e.g. "qcf-madani-v1").
   */
  mushafId: string;

  /**
   * Optional reciter identifier for future audio integrations.
   */
  reciterId?: number;

  /**
   * Word-by-word locale code (e.g. "en", "ur").
   */
  wordByWordLocale?: string;

  /**
   * Optional comma-separated list of translation resource IDs.
   */
  translationIds?: string;
}

interface ReadingViewApiResponse {
  verses: ReadingViewApiVerse[];
}

/**
 * Fetch Mushaf data for a single page from the Quran.com reading view API and
 * map the result into {@link MushafVerse} structures.
 */
export const getReadingViewPage = async ({
  pageNumber,
  mushafId,
  reciterId,
  wordByWordLocale,
  translationIds,
}: ReadingViewRequestParams): Promise<MushafVerse[]> => {
  const params: Record<string, string> = {
    words: 'true',
    per_page: 'all',
    filter_page_words: 'true',
    word_fields: WORD_FIELDS.join(','),
    fields: 'chapter_id,hizb_number,text_uthmani',
    mushaf: String(resolveApiMushafId(mushafId)),
  };

  if (wordByWordLocale) {
    params['word_translation_language'] = wordByWordLocale;
  }

  if (translationIds) {
    params['translations'] = translationIds;
  }

  if (typeof reciterId === 'number') {
    params['reciter'] = String(reciterId);
  }

  const data = await apiFetch<ReadingViewApiResponse>(
    `verses/by_page/${pageNumber}`,
    params,
    'Failed to fetch reading view page'
  );

  return data.verses.map(mapReadingViewVerseToMushafVerse);
};
