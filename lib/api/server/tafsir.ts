import { unstable_cache } from 'next/cache';

import { getVerseByKey } from '@/lib/api/verses';
import { GetTafsirContentUseCase } from '@/src/application/use-cases/GetTafsirContent';
import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { container } from '@/src/infrastructure/di/Container';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { TafsirResource, Verse } from '@/types';

type TafsirResourceResult = { id: number; name: string; lang: string };

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

export const getTafsirResourcesServer = unstable_cache(
  async (): Promise<TafsirResourceResult[]> => {
    const repository = container.getTafsirRepository();
    const useCase = new GetTafsirResourcesUseCase(repository);
    const result = await useCase.execute();
    // An empty list means every source failed; throw so it is not cached (attribution needs it).
    if (result.tafsirs.length === 0) throw new Error('No tafsir resources available');
    return result.tafsirs.map((t) => ({ id: t.id, name: t.displayName, lang: t.language }));
  },
  ['tafsir:resources:v1'],
  { revalidate: 86400, tags: ['tafsir-resources'] }
);

export const getTafsirHtmlServer = unstable_cache(
  async (verseKey: string, tafsirId: number): Promise<string> => {
    const repository = container.getTafsirRepository();
    const useCase = new GetTafsirContentUseCase(repository);
    return useCase.execute(verseKey, tafsirId);
  },
  ['tafsir:html:v1'],
  { revalidate: 86400, tags: ['tafsir-html'] }
);

const getVerseByKeyServer = unstable_cache(
  async (
    verseKey: string,
    translationIdsKey: string,
    wordLang: LanguageCode,
    tajweed: boolean
  ): Promise<Verse> => {
    const translationIds = translationIdsKey
      .split(',')
      .map((id) => Number.parseInt(id, 10))
      .filter((id) => Number.isFinite(id));

    return getVerseByKey(verseKey, translationIds, wordLang, tajweed);
  },
  ['tafsir:verse:v1'],
  { revalidate: 86400, tags: ['tafsir-verse'] }
);

export async function getTafsirVersePageDataServer(options: {
  verseKey: string;
  tafsirId: number;
  translationIds: number[];
  wordLang: LanguageCode;
  tajweed?: boolean | undefined;
}): Promise<{
  verse: Verse;
  tafsirHtml: string;
  tafsirResource: TafsirResource | undefined;
}> {
  const translationIdsKey = options.translationIds.join(',');
  const tajweed = options.tajweed ?? false;

  const [verseResult, tafsirHtmlResult, resourcesResult] = await Promise.allSettled([
    getVerseByKeyServer(options.verseKey, translationIdsKey, options.wordLang, tajweed),
    getTafsirHtmlServer(options.verseKey, options.tafsirId),
    getTafsirResourcesServer(),
  ]);

  if (verseResult.status !== 'fulfilled') {
    throw normaliseError(verseResult.reason);
  }

  // Any upstream failure throws so the cached (ISR) tafsir page is never stored without its text
  // or attribution; the last good version keeps being served instead.
  if (tafsirHtmlResult.status === 'rejected') {
    const error = normaliseError(tafsirHtmlResult.reason);
    logger.error(
      'Failed to fetch tafsir HTML',
      { verseKey: options.verseKey, tafsirId: options.tafsirId },
      error
    );
    throw error;
  }

  if (resourcesResult.status === 'rejected') {
    const error = normaliseError(resourcesResult.reason);
    logger.error(
      'Failed to fetch tafsir resources',
      { verseKey: options.verseKey, tafsirId: options.tafsirId },
      error
    );
    throw error;
  }

  return {
    verse: verseResult.value,
    tafsirHtml: tafsirHtmlResult.value,
    tafsirResource: resourcesResult.value.find((t) => t.id === options.tafsirId),
  };
}
