import { TranslationResource } from '@/types';
import { apiFetch } from './client';

export async function getTranslations(): Promise<TranslationResource[]> {
  const data = await apiFetch<{ translations: TranslationResource[] }>(
    'resources/translations',
    {},
    'Failed to fetch translations'
  );
  return data.translations as TranslationResource[];
}

export async function getWordTranslations(): Promise<TranslationResource[]> {
  const data = await apiFetch<{ translations: TranslationResource[] }>(
    'resources/translations',
    { resource_type: 'word_by_word' },
    'Failed to fetch translations'
  );
  return data.translations as TranslationResource[];
}
