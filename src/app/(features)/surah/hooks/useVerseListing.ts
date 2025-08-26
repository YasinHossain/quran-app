import { useMemo, useRef, useState, useCallback } from 'react';
import { useSettings } from '@/presentation/providers/SettingsContext';
import { useAudio } from '@/presentation/shared/player/context/AudioContext';
import type { Verse } from '@/types';
import useTranslationOptions from './useTranslationOptions';
import useInfiniteVerseLoader from './useInfiniteVerseLoader';

export interface LookupFn {
  (
    id: string,
    translationIds: number | number[],
    page: number,
    perPage: number,
    wordLang: string
  ): Promise<{ verses: Verse[]; totalPages: number }>;
}

interface UseVerseListingParams {
  id?: string;
  lookup: LookupFn;
}

export function useVerseListing({ id, lookup }: UseVerseListingParams) {
  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { activeVerse, setActiveVerse, reciter, isPlayerVisible, openPlayer } = useAudio();
  const { translationOptions, wordLanguageOptions, wordLanguageMap } = useTranslationOptions();

  // Stabilize the translation IDs for SWR key to prevent unnecessary re-fetches
  const stableTranslationIds = useMemo(() => {
    const ids = settings.translationIds || [settings.translationId];
    // Filter out any undefined/null values and ensure we have valid IDs
    const validIds = ids.filter((id) => id && typeof id === 'number');
    return validIds.length > 0 ? validIds.sort((a, b) => a - b).join(',') : '20'; // Default to Sahih International
  }, [settings.translationIds, settings.translationId]);

  const { verses, isLoading, isValidating, isReachingEnd } = useInfiniteVerseLoader({
    id,
    lookup,
    stableTranslationIds,
    wordLang: settings.wordLang,
    loadMoreRef,
    error,
    setError: (e: string) => setError(e),
  });

  const handleNext = useCallback(() => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex < verses.length - 1) {
      setActiveVerse(verses[currentIndex + 1]);
      openPlayer();
      return true;
    }
    return false;
  }, [activeVerse, verses, setActiveVerse, openPlayer]);

  const handlePrev = useCallback(() => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex > 0) {
      setActiveVerse(verses[currentIndex - 1]);
      openPlayer();
      return true;
    }
    return false;
  }, [activeVerse, verses, setActiveVerse, openPlayer]);

  return {
    error,
    isLoading,
    verses,
    isValidating,
    isReachingEnd,
    loadMoreRef,
    translationOptions,
    wordLanguageOptions,
    wordLanguageMap,
    settings,
    setSettings,
    activeVerse,
    reciter,
    isPlayerVisible,
    handleNext,
    handlePrev,
  } as const;
}

export default useVerseListing;
