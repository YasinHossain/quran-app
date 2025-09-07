import { useMemo, useRef, useState, useCallback } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import { useInfiniteVerseLoader } from './useInfiniteVerseLoader';
import { useTranslationOptions } from './useTranslationOptions';

import type { Verse } from '@/types';

export interface UseVerseListingReturn {
  error: string | null;
  isLoading: boolean;
  verses: Verse[];
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  translationOptions: { id: number; name: string; lang: string }[];
  wordLanguageOptions: { name: string; id: number }[];
  wordLanguageMap: Record<string, number>;
  settings: ReturnType<typeof useSettings>['settings'];
  setSettings: ReturnType<typeof useSettings>['setSettings'];
  activeVerse: ReturnType<typeof useAudio>['activeVerse'];
  reciter: ReturnType<typeof useAudio>['reciter'];
  isPlayerVisible: ReturnType<typeof useAudio>['isPlayerVisible'];
  handleNext: () => boolean;
  handlePrev: () => boolean;
}

export interface LookupOptions {
  id: string;
  translationIds: number | number[];
  page: number;
  perPage: number;
  wordLang: string;
}

export type LookupFn = (options: LookupOptions) => Promise<{ verses: Verse[]; totalPages: number }>;

interface UseVerseListingParams {
  /** Surah or resource ID */
  id?: string;
  /** Function to fetch verses */
  lookup: LookupFn;
}

/**
 * Hook for managing verse listing with infinite scroll, audio controls, and settings.
 * Handles verse fetching, translation management, and audio player integration.
 */
export function useVerseListing({ id, lookup }: UseVerseListingParams): UseVerseListingReturn {
  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { activeVerse, setActiveVerse, reciter, isPlayerVisible, openPlayer } = useAudio();
  const { translationOptions, wordLanguageOptions, wordLanguageMap } = useTranslationOptions();

  // Stabilize the translation IDs for SWR key to prevent unnecessary re-fetches
  const stableTranslationIds = useMemo(() => {
    const ids = settings.translationIds || [settings.translationId];
    // Filter out any undefined/null values and ensure we have valid IDs
    const validIds = ids.filter((tid) => tid && typeof tid === 'number');
    return validIds.length > 0 ? validIds.sort((a, b) => a - b).join(',') : '20'; // Default to Sahih International
  }, [settings.translationIds, settings.translationId]);

  const { verses, isLoading, isValidating, isReachingEnd } = useInfiniteVerseLoader({
    ...(id !== undefined ? { id } : {}),
    lookup,
    stableTranslationIds,
    wordLang: settings.wordLang,
    loadMoreRef,
    error,
    setError: (e: string) => setError(e),
  });

  const handleNext = useCallback((): boolean => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex < verses.length - 1) {
      setActiveVerse(verses[currentIndex + 1]!);
      openPlayer();
      return true;
    }
    return false;
  }, [activeVerse, verses, setActiveVerse, openPlayer]);

  const handlePrev = useCallback((): boolean => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex > 0) {
      setActiveVerse(verses[currentIndex - 1]!);
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
