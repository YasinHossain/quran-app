import { useMemo } from 'react';
import useSWR from 'swr';

import { initialTranslationsData } from '@/app/(features)/surah/components/panels/translation-panel/translationPanel.data';
import { getTranslations, getWordTranslations } from '@/lib/api';
import { WORD_LANGUAGE_LABELS } from '@/lib/text/wordLanguages';

import type { TranslationResource } from '@/types';

export interface WordLanguageOption {
  name: string;
  id: number;
}

export interface UseTranslationOptionsReturn {
  translationOptions: TranslationResource[];
  wordLanguageOptions: WordLanguageOption[];
  wordLanguageMap: Record<string, number>;
  resourceLanguagesMap: Record<number, string>;
}

const FALLBACK_WORD_TRANSLATIONS: TranslationResource[] = [
  { id: 85, name: 'Word-by-word (English)', lang: 'English' },
  { id: 13, name: 'Word-by-word (Bangla)', lang: 'Bengali' },
  { id: 54, name: 'Word-by-word (Urdu)', lang: 'Urdu' },
  { id: 158, name: 'Word-by-word (Hindi)', lang: 'Hindi' },
  { id: 45, name: 'Word-by-word (Bahasa Indonesia)', lang: 'Indonesian' },
  { id: 46, name: 'Word-by-word (Persian)', lang: 'Persian' },
  { id: 38, name: 'Word-by-word (Turkish)', lang: 'Turkish' },
  { id: 50, name: 'Word-by-word (Tamil)', lang: 'Tamil' },
];

export function useTranslationOptions(options?: { enabled?: boolean }): UseTranslationOptionsReturn {
  const enabled = options?.enabled ?? true;

  const swrTranslations = useSWR<TranslationResource[]>('translations', getTranslations, {
    fallbackData: initialTranslationsData,
    isPaused: () => !enabled,
  });
  const translationOptionsData = swrTranslations?.data;
  const translationOptions = useMemo(() => translationOptionsData || [], [translationOptionsData]);

  const swrWord = useSWR<TranslationResource[]>('wordTranslations', getWordTranslations, {
    fallbackData: FALLBACK_WORD_TRANSLATIONS,
    isPaused: () => !enabled,
  });
  const wordTranslationOptionsData = swrWord?.data;
  const wordLanguageMap = useMemo(() => {
    const map: Record<string, number> = {};
    (wordTranslationOptionsData || []).forEach((o) => {
      const name = String(o.lang ?? '').toLowerCase();
      if (!map[name]) {
        map[name] = o.id;
      }
    });
    return map;
  }, [wordTranslationOptionsData]);

  const wordLanguageOptions: WordLanguageOption[] = useMemo(
    () =>
      Object.keys(wordLanguageMap)
        .filter((name) => WORD_LANGUAGE_LABELS[name])
        .map((name) => ({ name: WORD_LANGUAGE_LABELS[name]!, id: wordLanguageMap[name]! })),
    [wordLanguageMap]
  );

  const resourceLanguagesMap = useMemo(() => {
    const map: Record<number, string> = {};
    (translationOptions || []).forEach((t) => {
      map[t.id] = t.lang;
    });
    return map;
  }, [translationOptions]);

  return {
    translationOptions,
    wordLanguageOptions,
    wordLanguageMap,
    resourceLanguagesMap,
  } as const;
}
