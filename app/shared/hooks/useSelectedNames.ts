import { useMemo } from 'react';

import { LANGUAGE_CODES, toLanguageCode } from '@/lib/text/languageCodes';

import type { LanguageCode } from '@/lib/text/languageCodes';

interface UseSelectedNamesParams {
  readonly settings: { translationId: number; wordLang: string };
  readonly translationOptions: Array<{ id: number; name: string }>;
  readonly wordLanguageOptions: Array<{ name: string }>;
  readonly t: (key: string) => string;
}

interface UseSelectedNamesReturn {
  readonly selectedTranslationName: string;
  readonly selectedWordLanguageName: string;
}

export function useSelectedNames({
  settings,
  translationOptions,
  wordLanguageOptions,
  t,
}: UseSelectedNamesParams): UseSelectedNamesReturn {
  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation'),
    [settings.translationId, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(() => {
    const normalizedLang = toLanguageCode(settings.wordLang);
    if (!normalizedLang) {
      return t('select_word_translation');
    }

    return (
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] === normalizedLang
      )?.name || t('select_word_translation')
    );
  }, [settings.wordLang, wordLanguageOptions, t]);

  return { selectedTranslationName, selectedWordLanguageName };
}
