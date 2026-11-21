import { unstable_cache } from 'next/cache';

import { apiFetch } from '@/lib/api/client';
import { toLanguageCode } from '@/lib/text/languageCodes';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { getChaptersServer } from './chapters';
import { toPrerenderedVerse, type TextOnlyApiVerse } from './prerenderedVerses';
import { getTafsirHtmlServer, getTafsirResourcesServer } from './tafsir';

import type { VerseCounts } from '@/app/shared/navigation/verseNavigation';
import type { Chapter, PrerenderedVerse } from '@/types';

/**
 * Data for the verse page (`/surah/[surahId]/[verseId]`): one verse as text (no words), the
 * language's default translations, and its default tafsir. Every fetch is cached and shared with
 * `generateMetadata`; the tafsir HTML cache is also shared with the tafsir page.
 */

export interface VersePageVerse extends PrerenderedVerse {
  /** Quran.com verse id (1–6236), used by the audio player and the context range. */
  id: number;
  /** Madani mushaf page and juz, as given by the API. */
  pageNumber: number | undefined;
  juzNumber: number | undefined;
}

type ApiVerse = TextOnlyApiVerse & { id: number; page_number?: number; juz_number?: number };

const toVersePageVerse = (verse: ApiVerse): VersePageVerse => ({
  id: verse.id,
  pageNumber: verse.page_number,
  juzNumber: verse.juz_number,
  ...toPrerenderedVerse(verse),
});

export interface VersePageTafsir {
  html: string;
  name: string | undefined;
  /** BCP 47 code of the tafsir text, when known. */
  languageCode: string | undefined;
}

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

/** Verse counts indexed by surah (index 0 is surah 1), from chapter data. */
export function toVerseCounts(
  chapters: ReadonlyArray<Pick<Chapter, 'id' | 'verses_count'>>
): VerseCounts {
  const counts: number[] = [];
  for (const chapter of chapters) counts[chapter.id - 1] = chapter.verses_count;
  return Array.from(counts, (count) => count ?? 0) as VerseCounts;
}

export async function getVerseCountsServer(): Promise<VerseCounts> {
  return toVerseCounts(await getChaptersServer());
}

/** Verses read around the current one on the verse page (same surah only). */
export const CONTEXT_VERSES_EACH_SIDE = 2;

const getVerseRangeCached = unstable_cache(
  async (
    surahId: number,
    fromVerseId: number,
    toVerseId: number,
    translationIdsKey: string
  ): Promise<VersePageVerse[]> => {
    // `from`/`to` are global verse ids; `by_chapter` keeps the range inside the surah.
    const data = await apiFetch<{ verses: ApiVerse[] }>(
      `verses/by_chapter/${surahId}`,
      {
        words: 'false',
        fields: 'text_uthmani',
        from: String(fromVerseId),
        to: String(toVerseId),
        per_page: String(toVerseId - fromVerseId + 1),
        ...(translationIdsKey
          ? { translations: translationIdsKey, translation_fields: 'resource_name,language_name' }
          : {}),
      },
      'Failed to fetch verse range'
    );
    return data.verses.map(toVersePageVerse);
  },
  ['verse-page:range:v3'],
  { revalidate: 86400, tags: ['verse-page-verse'] }
);

export interface VersePageVerses {
  /** The requested verse with every translation in `translationIds`, in that order. */
  verse: VersePageVerse;
  /** Up to `CONTEXT_VERSES_EACH_SIDE` verses on each side in the same surah, including `verse`. */
  context: VersePageVerse[];
}

/**
 * The verse and its neighbours in one cached range request (shared by `generateMetadata` and the
 * page). `globalVerseId` is the Quran.com verse id (1–6236), computed from chapter data, so the
 * range does not wait for a separate verse request. Throws when the verse cannot be loaded.
 */
export async function getVersePageVersesServer(input: {
  surahId: number;
  verseKey: string;
  globalVerseId: number;
  translationIds: ReadonlyArray<number>;
}): Promise<VersePageVerses> {
  const { surahId, verseKey, globalVerseId, translationIds } = input;
  const range = await getVerseRangeCached(
    surahId,
    Math.max(1, globalVerseId - CONTEXT_VERSES_EACH_SIDE),
    globalVerseId + CONTEXT_VERSES_EACH_SIDE,
    translationIds.join(',')
  );
  const order = new Map(translationIds.map((id, index) => [id, index]));
  const context = range.map((verse) => ({
    ...verse,
    translations: verse.translations
      .filter((translation) => order.has(translation.resourceId))
      .sort((a, b) => (order.get(a.resourceId) ?? 0) - (order.get(b.resourceId) ?? 0)),
  }));
  const verse = context.find((candidate) => candidate.verseKey === verseKey);
  if (!verse) throw new Error(`Verse ${verseKey} missing from its context range`);
  return { verse, context };
}

/** Tafsir HTML and attribution; `undefined` when it cannot be loaded (the page still renders). */
export async function getVersePageTafsirServer(
  verseKey: string,
  tafsirId: number
): Promise<VersePageTafsir | undefined> {
  const [html, resources] = await Promise.allSettled([
    getTafsirHtmlServer(verseKey, tafsirId),
    getTafsirResourcesServer(),
  ]);

  if (html.status === 'rejected') {
    logger.error(
      'Failed to fetch tafsir for verse page',
      { verseKey, tafsirId },
      normaliseError(html.reason)
    );
    return undefined;
  }

  const resource =
    resources.status === 'fulfilled' ? resources.value.find((t) => t.id === tafsirId) : undefined;
  return {
    html: html.value,
    name: resource?.name,
    languageCode: toLanguageCode(resource?.lang),
  };
}
