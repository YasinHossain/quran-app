import { useMemo, useRef, useState } from 'react';

import { useInfiniteVerseLoader } from '@/app/(features)/surah/hooks/useInfiniteVerseLoader';
import { useTranslationOptions } from '@/app/(features)/surah/hooks/useTranslationOptions';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import { useNavigationHandlers } from './verse-listing/useNavigationHandlers';
import { getStableTranslationIds } from './verse-listing/utils';
import type { LookupFn, UseVerseListingParams, UseVerseListingReturn } from './verse-listing/types';

import type { Settings, Verse } from '@/types';

export type {
  UseVerseListingReturn,
  LookupOptions,
  LookupFn,
  UseVerseListingParams,
} from './verse-listing/types';

function useTranslationData(): {
  translationOptions: unknown[];
  wordLanguageOptions: unknown[];
  wordLanguageMap: Record<string, unknown>;
} {
  const {
    translationOptions = [],
    wordLanguageOptions = [],
    wordLanguageMap = {},
  } = (useTranslationOptions() as
    | {
        translationOptions?: unknown[];
        wordLanguageOptions?: unknown[];
        wordLanguageMap?: Record<string, unknown>;
      }
    | undefined) ?? {};

  return { translationOptions, wordLanguageOptions, wordLanguageMap };
}

function useStableIds(settings: Settings): string {
  return useMemo(
    () => getStableTranslationIds(settings.translationIds, settings.translationId),
    [settings.translationIds, settings.translationId]
  );
}

interface VerseParams {
  id: UseVerseListingParams['id'];
  lookup: LookupFn;
  stableTranslationIds: string;
  wordLang: string;
  loadMoreRef: React.MutableRefObject<HTMLDivElement | null>;
  error: string | null;
  setError: (e: string) => void;
}

function useVerses({
  id,
  lookup,
  stableTranslationIds,
  wordLang,
  loadMoreRef,
  error,
  setError,
}: VerseParams): {
  verses?: Verse[];
  isLoading?: boolean;
  isValidating?: boolean;
  isReachingEnd?: boolean;
} {
  return (
    (useInfiniteVerseLoader({
      ...(id !== undefined ? { id } : {}),
      lookup,
      stableTranslationIds,
      wordLang,
      loadMoreRef,
      error,
      setError,
    }) as
      | {
          verses?: Verse[];
          isLoading?: boolean;
          isValidating?: boolean;
          isReachingEnd?: boolean;
        }
      | undefined) ?? {}
  );
}

/**
 * Hook for managing verse listing with infinite scroll, audio controls, and settings.
 * Handles verse fetching, translation management, and audio player integration.
 */
export function useVerseListing({
  id,
  lookup,
  initialVerses,
}: UseVerseListingParams): UseVerseListingReturn {
  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { activeVerse, setActiveVerse, reciter, isPlayerVisible, openPlayer } = useAudio();
  const { translationOptions, wordLanguageOptions, wordLanguageMap } = useTranslationData();
  const stableTranslationIds = useStableIds(settings);
  const {
    verses = [],
    isLoading = false,
    isValidating = false,
    isReachingEnd = false,
  } = useVerses({
    id,
    lookup,
    stableTranslationIds,
    wordLang: settings.wordLang,
    loadMoreRef,
    error,
    setError,
  });
  const versesList = initialVerses && initialVerses.length ? initialVerses : verses;
  const navigation = useNavigationHandlers({
    verses: versesList,
    activeVerse,
    setActiveVerse,
    openPlayer,
  });
  return {
    error,
    isLoading,
    verses: versesList,
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
    ...navigation,
  } as const;
}
