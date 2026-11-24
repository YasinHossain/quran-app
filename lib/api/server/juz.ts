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
        translationIds,
        page: 1,
        perPage,
        wordLang,
      }),
    ]);

    // Upstream failures throw so neither this data cache nor the ISR page stores a degraded result.
    if (juzResult.status === 'rejected') {
      const error = normaliseError(juzResult.reason);
      logger.error('Failed to fetch juz metadata', { juzId, wordLang }, error);
      throw error;
    }
    if (versesResult.status === 'rejected') {
      const error = normaliseError(versesResult.reason);
      logger.error(
        'Failed to fetch initial juz verses',
        { juzId, wordLang, perPage, translationIdsKey },
        error
      );
      throw error;
    }
    if (versesResult.value.verses.length === 0) {
      throw new Error(`No verses returned for juz ${juzId}`);
    }

    return {
      totalVerses: juzResult.value.verses_count,
      initialVerses: versesResult.value.verses,
    };
  },
  ['juz:initial:v2'],
  { revalidate: 86400, tags: ['juz-initial'] }
);

export async function getJuzInitialDataServer(options: {
  juzId: string;
  translationIds: number[];
  wordLang: LanguageCode;
  perPage?: number | undefined;
}): Promise<JuzInitialDataServerResult> {
  const perPage = options.perPage ?? 20;
  const translationIdsKey = Array.from(new Set(options.translationIds))
    .filter((id) => Number.isFinite(id))
    .sort((a, b) => a - b)
    // An empty key is a real choice (Arabic UI: no translation line), not "use the default".
    .join(',');

  return getJuzInitialDataCached(options.juzId, translationIdsKey, options.wordLang, perPage);
}
