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
 * Uthmani Arabic text, the selected translations and, when asked for, the Latin transliteration.
 */

type VerseGroup = 'by_chapter' | 'by_juz';

/** A word as returned with `words=true&word_fields=transliteration` (only the fields we read). */
export interface TransliterationApiWord {
  /** `word` for a real word; `end` for the end-of-verse number marker. */
  char_type_name?: string;
  transliteration?: { text?: string | null } | null;
}

export interface TextOnlyApiVerse {
  verse_key: string;
  text_uthmani?: string;
  words?: TransliterationApiWord[];
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

// The Quran API accepts a per_page well above its documented 50 (verified up to 600 on both
// api.qurancdn.com and api.quran.com), so the largest group (Juz 30, 564 verses) is one request.
// If an API ever clamps this, `total_pages` in the response still drives the follow-up pages.
const PER_PAGE = 600;
// Upper bound on pages, in case the API clamps per_page back to its documented 50 (564 / 50 = 12).
const MAX_PAGES = 20;

/**
 * Query parameters that add the Quran.com word-by-word Latin transliteration to a verse request.
 * The API returns the same English-script text whatever the `language` parameter. `word_fields`
 * only adds fields to the words' defaults, so this is the smallest word payload the API offers.
 */
export const TRANSLITERATION_QUERY = { words: 'true', word_fields: 'transliteration' } as const;

/**
 * The verse's Latin transliteration: the API's per-word transliterations joined with spaces, e.g.
 * `qul huwa l-lahu aḥadun`. Only real words (`char_type_name: "word"`) count, so the end-of-verse
 * marker is left out. Returns `undefined` when there are no words or any word lacks its text, so a
 * verse never shows a partial transliteration.
 */
export function joinWordTransliteration(
  words: ReadonlyArray<TransliterationApiWord> | undefined
): string | undefined {
  const parts: string[] = [];
  for (const word of words ?? []) {
    if (word.char_type_name !== 'word') continue;
    const text = word.transliteration?.text?.trim();
    if (!text) return undefined;
    parts.push(text);
  }
  return parts.length ? parts.join(' ') : undefined;
}

const FOOTNOTE_REGEX = /<sup\b[^>]*>[\s\S]*?<\/sup>/gi;
// The default Quran font (QPC Uthmani Hafs) has no glyph for U+06DF (small high rounded zero), so
// browsers draw a dotted circle in its place. The client reader strips it for this font too
// (`app/shared/VerseArabic.tsx`); keep the server-rendered text consistent with it.
const UNSUPPORTED_QPC_GLYPHS = /\u06DF/g;

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

export function toPrerenderedVerse(verse: TextOnlyApiVerse): PrerenderedVerse {
  const transliteration = joinWordTransliteration(verse.words);
  return {
    verseKey: verse.verse_key,
    arabic: (verse.text_uthmani ?? '').replace(UNSUPPORTED_QPC_GLYPHS, '').trim(),
    ...(transliteration ? { transliteration } : {}),
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
  query: Record<string, string>,
  page: number
): Promise<TextOnlyApiResponse> {
  return apiFetch<TextOnlyApiResponse>(
    `verses/${group}/${id}`,
    { ...query, per_page: String(PER_PAGE), page: String(page) },
    'Failed to fetch verse text'
  );
}

async function fetchAllVerseText(
  group: VerseGroup,
  id: string,
  translationIdsKey: string,
  transliteration: boolean
): Promise<PrerenderedVerse[]> {
  const query: Record<string, string> = {
    ...(transliteration ? TRANSLITERATION_QUERY : { words: 'false' }),
    fields: 'text_uthmani',
    ...(translationIdsKey
      ? { translations: translationIdsKey, translation_fields: 'resource_name,language_name' }
      : {}),
  };
  const first = await fetchTextPage(group, id, query, 1);
  const totalPages = Math.min(
    first.pagination?.total_pages ?? first.meta?.total_pages ?? 1,
    MAX_PAGES
  );

  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      fetchTextPage(group, id, query, index + 2)
    )
  );

  return [first, ...rest].flatMap((page) => page.verses).map(toPrerenderedVerse);
}

const getPrerenderedVersesCached = unstable_cache(
  async (group: VerseGroup, id: string, translationIdsKey: string, transliteration: boolean) =>
    fetchAllVerseText(group, id, translationIdsKey, transliteration),
  ['reader:prerendered-verses:v5'],
  { revalidate: 86400, tags: ['reader-prerendered-verses'] }
);

/**
 * Fetch every verse of a surah or juz as text, for server-rendered HTML. `transliteration` also
 * loads each verse's word-by-word Latin transliteration (a heavier request; only some surahs show
 * it). Returns `undefined` on failure so the page still renders the interactive reader.
 */
export async function getPrerenderedVersesServer(options: {
  group: VerseGroup;
  id: string;
  translationIds: number[];
  transliteration?: boolean;
}): Promise<PrerenderedVerse[] | undefined> {
  const transliteration = options.transliteration ?? false;
  const translationIdsKey = Array.from(new Set(options.translationIds))
    .filter((id) => Number.isFinite(id))
    .sort((a, b) => a - b)
    .join(',');

  try {
    return await getPrerenderedVersesCached(
      options.group,
      options.id,
      translationIdsKey,
      transliteration
    );
  } catch (error) {
    logger.error(
      'Failed to fetch prerendered verse text',
      { group: options.group, id: options.id, translationIdsKey },
      normaliseError(error)
    );
    return undefined;
  }
}
