/**
 * Server-side lists of the translation and reciter resources the site offers, built on the same
 * API clients as the settings panels. Used by the About / Sources page. Tafsir resources come
 * from `getTafsirResourcesServer`.
 */

import { unstable_cache } from 'next/cache';

import { getTranslations } from '@/lib/api/translations';
import { getQdcAudioReciters } from '@/lib/audio/qdcAudio';

import type { TranslationResource } from '@/types';

export interface ReciterResource {
  id: number;
  name: string;
  style?: string;
}

export const getTranslationResourcesServer = unstable_cache(
  async (): Promise<TranslationResource[]> => getTranslations(),
  ['translation:resources:v1'],
  { revalidate: 86400, tags: ['translation-resources'] }
);

export const getReciterResourcesServer = unstable_cache(
  async (language: string): Promise<ReciterResource[]> => {
    const reciters = await getQdcAudioReciters(language);
    return reciters.map((reciter) => {
      const style = reciter.style?.name;
      return {
        id: reciter.id,
        name: reciter.translated_name?.name || reciter.name,
        ...(style ? { style } : {}),
      };
    });
  },
  ['reciter:resources:v1'],
  { revalidate: 86400, tags: ['reciter-resources'] }
);
