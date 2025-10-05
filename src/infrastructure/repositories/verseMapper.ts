import { Verse } from '@/src/domain/entities';
import { Translation } from '@/src/domain/value-objects/Translation';
import { Verse as ApiVerse } from '@/types';

/**
 * Maps API translation objects to domain Translation.
 */
type ApiTranslationItem = NonNullable<ApiVerse['translations']>[number];

export const mapApiTranslation = (apiTranslation?: ApiTranslationItem): Translation | undefined => {
  if (!apiTranslation) return undefined;
  return new Translation({
    id: apiTranslation.id || 0,
    resourceId: apiTranslation.resource_id,
    text: apiTranslation.text,
    languageCode: 'en',
  });
};

/**
 * Maps API verse objects to domain verse entities.
 */
export const mapApiVerseToDomain = (apiVerse: ApiVerse): Verse => {
  const firstTranslation = apiVerse.translations?.[0];
  const translation = firstTranslation ? mapApiTranslation(firstTranslation) : undefined;

  return new Verse({
    id: apiVerse.verse_key,
    surahId: parseInt(apiVerse.verse_key.split(':')[0] ?? '0'),
    ayahNumber: parseInt(apiVerse.verse_key.split(':')[1] ?? '0'),
    arabicText: apiVerse.text_uthmani || '',
    uthmaniText: apiVerse.text_uthmani || '',
    ...(translation ? { translation } : {}),
  });
};
