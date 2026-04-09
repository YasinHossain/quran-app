import { unstable_cache } from 'next/cache';

import { getJuz, getVersesByJuz } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { Verse } from '@/types';

export interface JuzInitialDataServerResult {
  totalVerses?: number | undefined;
  initialVerses?: Verse[] | undefined;
}

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

const getJuzInitialDataCached = unstable_cache(
  async (
    juzId: string,
    translationIdsKey: string,
    wordLang: LanguageCode,
    perPage: number
  ): Promise<JuzInitialDataServerResult> => {
    const translationIds = translationIdsKey
      .split(',')
      .map((id) => Number.parseInt(id, 10))
      .filter((id) => Number.isFinite(id));

    const [juzResult, versesResult] = await Promise.allSettled([
      getJuz(juzId),
      getVersesByJuz({
        id: juzId,
        translationIds: translationIds.length ? translationIds : [20],
        page: 1,
        perPage,
        wordLang,
      }),
    ]);

    const result: JuzInitialDataServerResult = {};

    if (juzResult.status === 'fulfilled') {
      result.totalVerses = juzResult.value.verses_count;
    } else {
      logger.error(
        'Failed to fetch juz metadata',
        { juzId, wordLang },
        normaliseError(juzResult.reason)
      );
    }

    if (versesResult.status === 'fulfilled') {
      result.initialVerses = versesResult.value.verses;
    } else {
      logger.error(
        'Failed to fetch initial juz verses',
        { juzId, wordLang, perPage, translationIdsKey },
        normaliseError(versesResult.reason)
      );
    }

    return result;
  },
  ['juz:initial:v1'],
  { revalidate: 3600, tags: ['juz-initial'] }
);

export async function getJuzInitialDataServer(options: {
  juzId: string;
  translationIds: number[];
  wordLang: LanguageCode;
  perPage?: number | undefined;
}): Promise<JuzInitialDataServerResult> {
  const perPage = options.perPage ?? 20;
  const translationIdsKey =
    Array.from(new Set(options.translationIds))
      .filter((id) => Number.isFinite(id))
      .sort((a, b) => a - b)
      .join(',') || '20';

  return getJuzInitialDataCached(options.juzId, translationIdsKey, options.wordLang, perPage);
}
