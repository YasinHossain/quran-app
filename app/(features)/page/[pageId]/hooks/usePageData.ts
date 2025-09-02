import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getSurahCoverUrl, getVersesByPage } from '@/lib/api';
import { buildAudioUrl } from '@/lib/audio/reciters';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import type { Track } from '@/app/shared/player/types';
import useVerseListing from '@/app/(features)/surah/hooks/useVerseListing';

interface UsePageDataOptions {
  pageId: string;
}

/**
 * Hook for managing page data including verses, translations, and audio tracks
 */
export function usePageData({ pageId }: UsePageDataOptions) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  const verseListingData = useVerseListing({
    id: pageId,
    lookup: getVersesByPage,
  });

  const { translationOptions, wordLanguageOptions, settings, activeVerse, reciter } =
    verseListingData;

  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation'),
    [settings.translationId, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(
    () =>
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
          settings.wordLang
      )?.name || t('select_word_translation'),
    [settings.wordLang, wordLanguageOptions, t]
  );

  // Load cover URL when active verse changes
  useEffect(() => {
    if (activeVerse) {
      const surahNumber = parseInt(activeVerse.verse_key.split(':')[0], 10);
      getSurahCoverUrl(surahNumber).then(setCoverUrl);
    }
  }, [activeVerse]);

  const track: Track | null = activeVerse
    ? {
        id: activeVerse.id.toString(),
        title: `Verse ${activeVerse.verse_key}`,
        artist: reciter.name,
        coverUrl: coverUrl || '',
        durationSec: 0,
        src: buildAudioUrl(activeVerse.verse_key, reciter.path),
      }
    : null;

  return {
    ...verseListingData,
    selectedTranslationName,
    selectedWordLanguageName,
    track,
    coverUrl,
  };
}
