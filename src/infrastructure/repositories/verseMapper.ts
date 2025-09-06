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
  return new Translation(
    apiTranslation.id || 0,
    apiTranslation.resource_id,
    apiTranslation.text,
    'en'
  );
};

/**
 * Maps API verse objects to domain verse entities.
 */
export const mapApiVerseToDomain = (apiVerse: ApiVerse): Verse => {
  const translation = mapApiTranslation(apiVerse.translations?.[0]);

  return new Verse(
    apiVerse.verse_key,
    parseInt(apiVerse.verse_key.split(':')[0]),
    parseInt(apiVerse.verse_key.split(':')[1]),
    apiVerse.text_uthmani || '',
    apiVerse.text_uthmani || '',
    translation
  );
};
