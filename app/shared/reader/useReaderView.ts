'use client';

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
}

export const useReaderView = ({
  resourceId,
  lookup,
  initialVerses,
}: UseReaderViewParams): UseReaderViewReturn => {
  const verseListing = useVerseListing({
    id: resourceId,
    lookup,
    ...(initialVerses ? { initialVerses } : {}),
  });

  const panels = useSurahPanels({
    translationOptions: verseListing.translationOptions,
    wordLanguageOptions: verseListing.wordLanguageOptions,
    settings: verseListing.settings,
  });

  return { verseListing, panels };
};
