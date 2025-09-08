'use client';

import { getVersesByChapter } from '@/lib/api';

import { useSurahPanels, useVerseListing } from '../../hooks';

interface UseSurahViewReturn {
  verseListing: ReturnType<typeof useVerseListing>;
  panels: ReturnType<typeof useSurahPanels>;
}

export const useSurahView = (surahId: string): UseSurahViewReturn => {
  const verseListing = useVerseListing({
    id: surahId,
    lookup: ({ id, translationIds, page, perPage, wordLang }) =>
      getVersesByChapter({ id, translationIds, page, perPage, wordLang }),
  });
  const panels = useSurahPanels({
    translationOptions: verseListing.translationOptions,
    wordLanguageOptions: verseListing.wordLanguageOptions,
    settings: verseListing.settings,
  });

  return { verseListing, panels };
};
