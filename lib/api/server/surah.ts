import { unstable_cache } from 'next/cache';

import { getVersesByChapter } from '@/lib/api/verses/fetchers';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import type { LanguageCode } from '@/lib/text/languageCodes';
import type { Verse } from '@/types';

import { getChapterServer } from './chapters';

export interface SurahInitialDataServerResult {
  totalVerses?: number | undefined;
  initialVerses?: Verse[] | undefined;
}

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

const getSurahInitialDataCached = unstable_cache(
  async (
    surahId: string,
    translationIdsKey: string,
    wordLang: LanguageCode,
    perPage: number
  ): Promise<SurahInitialDataServerResult> => {
    const surahNumber = Number.parseInt(surahId, 10);
    const canFetchMetadata = Number.isFinite(surahNumber) && surahNumber > 0;

    const translationIds = translationIdsKey
      .split(',')
      .map((id) => Number.parseInt(id, 10))
      .filter((id) => Number.isFinite(id));

    // Upstream failures throw so neither this data cache nor the ISR page stores a degraded result.
    const [chapterResult, versesResult] = await Promise.allSettled([
      canFetchMetadata ? getChapterServer(surahNumber) : Promise.resolve(undefined),
      getVersesByChapter({
        id: surahId,
        translationIds,
        page: 1,
        perPage,
        wordLang,
      }),
    ]);

    if (chapterResult.status === 'rejected') {
      const error = normaliseError(chapterResult.reason);
      logger.error('Failed to fetch chapter metadata', { surahId, wordLang }, error);
      throw error;
    }
    if (versesResult.status === 'rejected') {
      const error = normaliseError(versesResult.reason);
      logger.error(
        'Failed to fetch initial verses',
        { surahId, wordLang, perPage, translationIdsKey },
        error
      );
      throw error;
    }
    if (canFetchMetadata && !chapterResult.value) {
      throw new Error(`Chapter ${surahId} missing from chapter data`);
    }
    if (versesResult.value.verses.length === 0) {
      throw new Error(`No verses returned for surah ${surahId}`);
    }

    const result: SurahInitialDataServerResult = { initialVerses: versesResult.value.verses };
    if (chapterResult.value) result.totalVerses = chapterResult.value.verses_count;
    return result;
  },
  ['surah:initial:v2'],
  { revalidate: 86400, tags: ['surah-initial'] }
);

export async function getSurahInitialDataServer(options: {
  surahId: string;
  translationIds: number[];
  wordLang: LanguageCode;
  perPage?: number | undefined;
}): Promise<SurahInitialDataServerResult> {
  const perPage = options.perPage ?? 20;
  const translationIdsKey = Array.from(new Set(options.translationIds))
    .filter((id) => Number.isFinite(id))
    .sort((a, b) => a - b)
    // An empty key is a real choice (Arabic UI: no translation line), not "use the default".
    .join(',');

  return getSurahInitialDataCached(options.surahId, translationIdsKey, options.wordLang, perPage);
}
