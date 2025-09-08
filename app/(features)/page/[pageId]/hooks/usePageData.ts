// no react hooks needed here; composed from shared hooks
import { useTranslation } from 'react-i18next';

import { useVerseListing } from '@/app/(features)/surah/hooks/useVerseListing';
import { useCoverAndTrack } from '@/app/shared/hooks/useCoverAndTrack';
import { useSelectedNames } from '@/app/shared/hooks/useSelectedNames';
import { getVersesByPage } from '@/lib/api';

import type { UseVerseListingReturn } from '@/app/(features)/surah/hooks/useVerseListing';
import type { Track } from '@/app/shared/player/types';

interface UsePageDataOptions {
  pageId: string;
}

/**
 * Hook for managing page data including verses, translations, and audio tracks
 */
export function usePageData({ pageId }: UsePageDataOptions): UseVerseListingReturn & {
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  track: Track | null;
  coverUrl: string | null;
} {
  const { t } = useTranslation();

  const verseListingData = useVerseListing({
    id: pageId,
    lookup: ({ id, translationIds, page, perPage, wordLang }) =>
      getVersesByPage(id, translationIds, page, perPage, wordLang),
  });

  const { translationOptions, wordLanguageOptions, settings, activeVerse, reciter } =
    verseListingData;

  const { selectedTranslationName, selectedWordLanguageName } = useSelectedNames({
    settings,
    translationOptions,
    wordLanguageOptions,
    t,
  });

  const { coverUrl, track } = useCoverAndTrack(activeVerse, reciter);

  return {
    ...verseListingData,
    selectedTranslationName,
    selectedWordLanguageName,
    track,
    coverUrl,
  };
}
