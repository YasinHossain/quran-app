import { unstable_cache } from 'next/cache';

import { apiFetch } from '@/lib/api/client';
import { toLanguageCode } from '@/lib/text/languageCodes';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { PrerenderedVerse } from '@/types';

/**
 * Lightweight, text-only verse data for the reader's full-text section.
 *
 * The interactive reader still loads full verses (words, audio, etc.) page by page on the
 * client. This fetch only returns what crawlers and no-JS readers need: the verse key, the
 * Uthmani Arabic text and the selected translations.
 */

type VerseGroup = 'by_chapter' | 'by_juz';

interface TextOnlyApiVerse {
  verse_key: string;
  text_uthmani?: string;
  translations?: Array<{
    resource_id: number;
    text: string;
    resource_name?: string;
    language_name?: string;
  }>;
}

interface TextOnlyApiResponse {
  verses: TextOnlyApiVerse[];
  pagination?: { total_pages?: number };
  meta?: { total_pages?: number };
}

// 50 is the documented per_page maximum on the public Quran.com API.
const PER_PAGE = 50;
// Upper bound on pages: the largest group (Juz 30, 564 verses) needs 12.
const MAX_PAGES = 20;

const FOOTNOTE_REGEX = /<sup\b[^>]*>[\s\S]*?<\/sup>/gi;

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

function toPrerenderedVerse(verse: TextOnlyApiVerse): PrerenderedVerse {
  return {
    verseKey: verse.verse_key,
    arabic: (verse.text_uthmani ?? '').trim(),
    translations: (verse.translations ?? []).map((translation) => ({
      resourceId: translation.resource_id,
      // Footnote markers point at notes we do not render here; drop them so the text reads cleanly.
      html: sanitizeHtml(translation.text.replace(FOOTNOTE_REGEX, '')).trim(),
      ...(translation.resource_name ? { resourceName: translation.resource_name } : {}),
      ...(toLanguageCode(translation.language_name)
        ? { languageCode: toLanguageCode(translation.language_name) }
        : {}),
    })),
  };
}

function fetchTextPage(
  group: VerseGroup,
  id: string,
  translationIdsKey: string,
  page: number
): Promise<TextOnlyApiResponse> {
  return apiFetch<TextOnlyApiResponse>(
    `verses/${group}/${id}`,
    {
      words: 'false',
      fields: 'text_uthmani',
      ...(translationIdsKey
        ? { translations: translationIdsKey, translation_fields: 'resource_name,language_name' }
        : {}),
      per_page: String(PER_PAGE),
      page: String(page),
    },
    'Failed to fetch verse text'
  );
}

async function fetchAllVerseText(
  group: VerseGroup,
  id: string,
  translationIdsKey: string
): Promise<PrerenderedVerse[]> {
  const first = await fetchTextPage(group, id, translationIdsKey, 1);
  const totalPages = Math.min(
    first.pagination?.total_pages ?? first.meta?.total_pages ?? 1,
    MAX_PAGES
  );

  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      fetchTextPage(group, id, translationIdsKey, index + 2)
    )
  );

  return [first, ...rest].flatMap((page) => page.verses).map(toPrerenderedVerse);
}

const getPrerenderedVersesCached = unstable_cache(
  async (group: VerseGroup, id: string, translationIdsKey: string) =>
    fetchAllVerseText(group, id, translationIdsKey),
  ['reader:prerendered-verses:v2'],
  { revalidate: 3600, tags: ['reader-prerendered-verses'] }
);

/**
 * Fetch every verse of a surah or juz as text, for server-rendered HTML.
 * Returns `undefined` on failure so the page still renders the interactive reader.
 */
export async function getPrerenderedVersesServer(options: {
  group: VerseGroup;
  id: string;
  translationIds: number[];
}): Promise<PrerenderedVerse[] | undefined> {
  const translationIdsKey = Array.from(new Set(options.translationIds))
    .filter((id) => Number.isFinite(id))
    .sort((a, b) => a - b)
    .join(',');

  try {
    return await getPrerenderedVersesCached(options.group, options.id, translationIdsKey);
  } catch (error) {
    logger.error(
      'Failed to fetch prerendered verse text',
      { group: options.group, id: options.id, translationIdsKey },
      normaliseError(error)
    );
    return undefined;
  }
}
