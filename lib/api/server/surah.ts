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

    const [chapterResult, versesResult] = await Promise.allSettled([
      canFetchMetadata ? getChapterServer(surahNumber) : Promise.resolve(undefined),
      getVersesByChapter({
        id: surahId,
        translationIds: translationIds.length ? translationIds : [20],
        page: 1,
        perPage,
        wordLang,
      }),
    ]);

    const result: SurahInitialDataServerResult = {};

    if (chapterResult.status === 'fulfilled' && chapterResult.value) {
      result.totalVerses = chapterResult.value.verses_count;
    } else if (chapterResult.status === 'rejected') {
      logger.error(
        'Failed to fetch chapter metadata',
        { surahId, wordLang },
        normaliseError(chapterResult.reason)
      );
    }

    if (versesResult.status === 'fulfilled') {
      result.initialVerses = versesResult.value.verses;
    } else {
      logger.error(
        'Failed to fetch initial verses',
        { surahId, wordLang, perPage, translationIdsKey },
        normaliseError(versesResult.reason)
      );
    }

    return result;
  },
  ['surah:initial:v1'],
  { revalidate: 3600, tags: ['surah-initial'] }
);

export async function getSurahInitialDataServer(options: {
  surahId: string;
  translationIds: number[];
  wordLang: LanguageCode;
  perPage?: number | undefined;
}): Promise<SurahInitialDataServerResult> {
  const perPage = options.perPage ?? 20;
  const translationIdsKey =
    Array.from(new Set(options.translationIds))
      .filter((id) => Number.isFinite(id))
      .sort((a, b) => a - b)
      .join(',') || '20';

  return getSurahInitialDataCached(options.surahId, translationIdsKey, options.wordLang, perPage);
}

