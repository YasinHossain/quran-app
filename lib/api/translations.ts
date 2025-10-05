import { TranslationResource } from '@/types';

import { apiFetch } from './client';

interface ApiTranslationResource {
  id: number;
  name: string;
  language_name: string;
}

export async function getTranslations(): Promise<TranslationResource[]> {
  const data = await apiFetch<{ translations: ApiTranslationResource[] }>(
    'resources/translations',
    {},
    'Failed to fetch translations'
  );
  return data.translations.map((t) => ({
    id: t.id,
    name: t.name,
    lang: t.language_name,
  }));
}

export async function getWordTranslations(): Promise<TranslationResource[]> {
  const data = await apiFetch<{ translations: ApiTranslationResource[] }>(
    'resources/translations',
    { resource_type: 'word_by_word' },
    'Failed to fetch translations'
  );
  return data.translations.map((t) => ({
    id: t.id,
    name: t.name,
    lang: t.language_name,
  }));
}
