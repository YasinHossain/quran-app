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

const getTafsirResourcesServer = unstable_cache(
  async (): Promise<TafsirResourceResult[]> => {
    const repository = container.getTafsirRepository();
    const useCase = new GetTafsirResourcesUseCase(repository);
    const result = await useCase.execute();
    return result.tafsirs.map((t) => ({ id: t.id, name: t.displayName, lang: t.language }));
  },
  ['tafsir:resources:v1'],
  { revalidate: 3600, tags: ['tafsir-resources'] }
);

const getTafsirHtmlServer = unstable_cache(
  async (verseKey: string, tafsirId: number): Promise<string> => {
    const repository = container.getTafsirRepository();
    const useCase = new GetTafsirContentUseCase(repository);
    return useCase.execute(verseKey, tafsirId);
  },
  ['tafsir:html:v1'],
  { revalidate: 3600, tags: ['tafsir-html'] }
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
  { revalidate: 3600, tags: ['tafsir-verse'] }
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

  if (tafsirHtmlResult.status === 'rejected') {
    logger.error(
      'Failed to fetch tafsir HTML',
      { verseKey: options.verseKey, tafsirId: options.tafsirId },
      normaliseError(tafsirHtmlResult.reason)
    );
  }

  if (resourcesResult.status === 'rejected') {
    logger.error(
      'Failed to fetch tafsir resources',
      { verseKey: options.verseKey, tafsirId: options.tafsirId },
      normaliseError(resourcesResult.reason)
    );
  }

  const tafsirResource =
    resourcesResult.status === 'fulfilled'
      ? resourcesResult.value.find((t) => t.id === options.tafsirId)
      : undefined;

  return {
    verse: verseResult.value,
    tafsirHtml: tafsirHtmlResult.status === 'fulfilled' ? tafsirHtmlResult.value : '',
    tafsirResource,
  };
}
