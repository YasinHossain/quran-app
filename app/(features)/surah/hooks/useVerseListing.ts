import { useMemo } from 'react';

import { useInfiniteVerseLoader } from '@/app/(features)/surah/hooks/useInfiniteVerseLoader';
import { useTranslationOptions } from '@/app/(features)/surah/hooks/useTranslationOptions';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import {
  resolveVerses,
  useStableTranslationIds,
  useVerseListingErrorState,
} from './verse-listing/internal';
import { useNavigationHandlers } from './verse-listing/useNavigationHandlers';

export type {
  UseVerseListingReturn,
  LookupOptions,
  LookupFn,
  UseVerseListingParams,
} from './verse-listing/types';
import type { UseVerseListingParams, UseVerseListingReturn } from './verse-listing/types';

const EMPTY_LOADER_STATE: {
  verses: UseVerseListingReturn['verses'];
  isLoading: boolean;
  isValidating: boolean;
  isReachingEnd: boolean;
} = {
  verses: [],
  isLoading: false,
  isValidating: false,
  isReachingEnd: true,
};

interface CreateVerseListingResultParams {
  error: string | null;
  settings: UseVerseListingReturn['settings'];
  setSettings: UseVerseListingReturn['setSettings'];
  loadMoreRef: UseVerseListingReturn['loadMoreRef'];
  translationOptions: UseVerseListingReturn['translationOptions'];
  wordLanguageOptions: UseVerseListingReturn['wordLanguageOptions'];
  wordLanguageMap: UseVerseListingReturn['wordLanguageMap'];
  audio: Pick<ReturnType<typeof useAudio>, 'activeVerse' | 'reciter' | 'isPlayerVisible'>;
  loaderState: ReturnType<typeof useInfiniteVerseLoader>;
  navigation: ReturnType<typeof useNavigationHandlers>;
  verses: UseVerseListingReturn['verses'];
}

function createVerseListingResult({
  error,
  settings,
  setSettings,
  loadMoreRef,
  translationOptions,
  wordLanguageOptions,
  wordLanguageMap,
  audio,
  loaderState,
  navigation,
  verses,
}: CreateVerseListingResultParams): UseVerseListingReturn {
  return {
    error,
    isLoading: loaderState.isLoading,
    verses,
    isValidating: loaderState.isValidating,
    isReachingEnd: loaderState.isReachingEnd,
    loadMoreRef,
    translationOptions,
    wordLanguageOptions,
    wordLanguageMap,
    settings,
    setSettings,
    activeVerse: audio.activeVerse,
    reciter: audio.reciter,
    isPlayerVisible: audio.isPlayerVisible,
    handleNext: navigation.handleNext,
    handlePrev: navigation.handlePrev,
  };
}

export function useVerseListing({
  id,
  lookup,
  initialVerses,
  initialVerseNumber,
}: UseVerseListingParams): UseVerseListingReturn {
  const errorState = useVerseListingErrorState();
  const settingsState = useSettings();
  const audio = useAudio();
  const translation = useTranslationOptions();
  const stableTranslationIds = useStableTranslationIds(settingsState.settings);

  const infiniteLoaderParams: Parameters<typeof useInfiniteVerseLoader>[0] = {
    lookup,
    stableTranslationIds,
    wordLang: settingsState.settings.wordLang,
    loadMoreRef: errorState.loadMoreRef,
    error: errorState.error,
    setError: errorState.handleLoaderError,
    ...(typeof initialVerseNumber === 'number' && initialVerseNumber > 0
      ? { targetVerseNumber: initialVerseNumber }
      : {}),
    ...(id !== undefined ? { id } : {}),
  } as const;

  const infiniteLoaderState = useInfiniteVerseLoader(infiniteLoaderParams);

  const loaderState =
    id !== undefined ? { ...EMPTY_LOADER_STATE, ...infiniteLoaderState } : EMPTY_LOADER_STATE;

  const rawVerses = resolveVerses(initialVerses, loaderState.verses);

  const verses = useMemo(() => {
    if (!translation.translationOptions.length) {
      return rawVerses;
    }
    const resourceMap = new Map(translation.translationOptions.map((t) => [t.id, t.name]));
    return rawVerses.map((verse) => {
      if (!verse.translations) {
        return verse;
      }
      return {
        ...verse,
        translations: verse.translations.map((t) => {
          const resourceName = resourceMap.get(t.resource_id) ?? t.resource_name;
          return {
            ...t,
            ...(resourceName ? { resource_name: resourceName } : {}),
          };
        }),
      };
    });
  }, [rawVerses, translation.translationOptions]);
  const navigation = useNavigationHandlers({
    verses,
    activeVerse: audio.activeVerse,
    setActiveVerse: audio.setActiveVerse,
    openPlayer: audio.openPlayer,
  });

  return createVerseListingResult({
    error: errorState.error,
    settings: settingsState.settings,
    setSettings: settingsState.setSettings,
    loadMoreRef: errorState.loadMoreRef,
    translationOptions: translation.translationOptions,
    wordLanguageOptions: translation.wordLanguageOptions,
    wordLanguageMap: translation.wordLanguageMap,
    audio,
    loaderState,
    navigation,
    verses,
  });
}
