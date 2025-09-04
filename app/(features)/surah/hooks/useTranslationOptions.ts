import { useMemo } from 'react';
import useSWR from 'swr';
import { getTranslations, getWordTranslations } from '@/lib/api';
import { WORD_LANGUAGE_LABELS } from '@/lib/text/wordLanguages';
import type { TranslationResource } from '@/types';

export interface WordLanguageOption {
  name: string;
  id: number;
}

export function useTranslationOptions() {
  const { data: translationOptionsData } = useSWR<TranslationResource[]>(
    'translations',
    getTranslations
  );
  const translationOptions = useMemo(() => translationOptionsData || [], [translationOptionsData]);

  const { data: wordTranslationOptionsData } = useSWR('wordTranslations', getWordTranslations);
  const wordLanguageMap = useMemo(() => {
    const map: Record<string, number> = {};
    (wordTranslationOptionsData || []).forEach((o) => {
      const name = o.lang.toLowerCase();
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
        .map((name) => ({ name: WORD_LANGUAGE_LABELS[name], id: wordLanguageMap[name] })),
    [wordLanguageMap]
  );

  return { translationOptions, wordLanguageOptions, wordLanguageMap } as const;
}
