'use client';

import { MUSHAF_OPTIONS } from '@/data/mushaf/options';
import { useSurahPanels, useVerseListing } from '@/app/(features)/surah/hooks';

import type { UseVerseListingParams } from '@/app/(features)/surah/hooks/useVerseListing';

type UseReaderViewReturn = {
  verseListing: ReturnType<typeof useVerseListing>;
  panels: ReturnType<typeof useSurahPanels>;
};

interface UseReaderViewParams {
  resourceId: string;
  lookup: UseVerseListingParams['lookup'];
  initialVerses?: UseVerseListingParams['initialVerses'];
  initialVerseNumber?: number | undefined;
}

export const useReaderView = ({
  resourceId,
  lookup,
  initialVerses,
  initialVerseNumber,
}: UseReaderViewParams): UseReaderViewReturn => {
  const verseListing = useVerseListing({
    id: resourceId,
    lookup,
    ...(initialVerses ? { initialVerses } : {}),
    ...(typeof initialVerseNumber === 'number' ? { initialVerseNumber } : {}),
  });

  const panels = useSurahPanels({
    translationOptions: verseListing.translationOptions,
    wordLanguageOptions: verseListing.wordLanguageOptions,
    settings: verseListing.settings,
    setSettings: verseListing.setSettings,
    mushafOptions: MUSHAF_OPTIONS,
  });

  return { verseListing, panels };
};
