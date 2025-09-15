import { useMemo } from 'react';
import useSWR from 'swr';

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
}

export function useTranslationOptions(): UseTranslationOptionsReturn {
  const swrTranslations = useSWR<TranslationResource[]>('translations', getTranslations);
  const translationOptionsData = swrTranslations?.data;
  const translationOptions = useMemo(() => translationOptionsData || [], [translationOptionsData]);

  const swrWord = useSWR<TranslationResource[]>('wordTranslations', getWordTranslations);
  const wordTranslationOptionsData = swrWord?.data;
  const wordLanguageMap = useMemo(() => {
    const map: Record<string, number> = {};
    (wordTranslationOptionsData || []).forEach((o) => {
      const raw = o?.lang ?? o?.language_name ?? '';
      const name = String(raw).toLowerCase();
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

  return { translationOptions, wordLanguageOptions, wordLanguageMap } as const;
}
