import { Verse as ApiVerse } from '../../../types';
import { Verse } from '../../domain/entities';
import { Translation } from '../../domain/value-objects/Translation';

/**
 * Maps API translation objects to domain Translation.
 */
export const mapApiTranslation = (
  apiTranslation?: ApiVerse['translations'][0]
): Translation | undefined => {
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
  const translation = mapApiTranslation(apiVerse.translations?.[0]);

  return new Verse({
    id: apiVerse.verse_key,
    surahId: parseInt(apiVerse.verse_key.split(':')[0]),
    ayahNumber: parseInt(apiVerse.verse_key.split(':')[1]),
    arabicText: apiVerse.text_uthmani || '',
    uthmaniText: apiVerse.text_uthmani || '',
    translation,
  });
};
