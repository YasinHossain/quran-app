import { useMemo, useRef, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import { useInfiniteVerseLoader } from './useInfiniteVerseLoader';
import { useTranslationOptions } from './useTranslationOptions';
import { useNavigationHandlers } from './verse-listing/useNavigationHandlers';
import { getStableTranslationIds } from './verse-listing/utils';

export type {
  UseVerseListingReturn,
  LookupOptions,
  LookupFn,
  UseVerseListingParams,
} from './verse-listing/types';
import type { UseVerseListingParams, UseVerseListingReturn } from './verse-listing/types';

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

  const stableTranslationIds = useMemo(
    () => getStableTranslationIds(settings.translationIds, settings.translationId),
    [settings.translationIds, settings.translationId]
  );

  const { verses, isLoading, isValidating, isReachingEnd } = useInfiniteVerseLoader({
    ...(id !== undefined ? { id } : {}),
    lookup,
    stableTranslationIds,
    wordLang: settings.wordLang,
    loadMoreRef,
    error,
    setError: (e: string) => setError(e),
  });

  const { handleNext, handlePrev } = useNavigationHandlers({
    verses,
    activeVerse,
    setActiveVerse,
    openPlayer,
  });

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
