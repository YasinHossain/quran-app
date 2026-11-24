import type { Verse } from '@/types';

const FALLBACK_TRANSLATION_ID = 20;

export function resolveVerseTranslation(
  verse: Verse,
  preferredTranslationId?: number | null
): string | undefined {
  const translations = verse.translations ?? [];

  if (typeof preferredTranslationId === 'number') {
    const preferred = translations.find((t) => t.resource_id === preferredTranslationId)?.text;
    if (preferred) return preferred;
  }

  const fallback = translations.find((t) => t.resource_id === FALLBACK_TRANSLATION_ID)?.text;
  return fallback ?? translations[0]?.text;
}
