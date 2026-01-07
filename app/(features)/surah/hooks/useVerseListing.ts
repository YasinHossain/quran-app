import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useInfiniteVerseLoader } from '@/app/(features)/surah/hooks/useInfiniteVerseLoader';
import { useTranslationOptions } from '@/app/(features)/surah/hooks/useTranslationOptions';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import { VERSES_PER_PAGE } from './useInfiniteVerseLoader.fetcher';
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
import type { Verse } from '@/types';

const EMPTY_LOADER_STATE: {
  verses: Verse[];
  isLoading: boolean;
  isValidating: boolean;
  isReachingEnd: boolean;
} = {
  verses: [],
  isLoading: false,
  isValidating: false,
  isReachingEnd: true,
};

const parseVerseNumber = (verse: Verse): number | null => {
  if (typeof verse.verse_number === 'number' && Number.isFinite(verse.verse_number)) {
    return verse.verse_number;
  }

  const [, versePart] = verse.verse_key.split(':');
  const parsed = Number.parseInt(versePart ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const getPageNumberFromVerseNumber = (verseNumber: number, perPage: number): number =>
  Math.floor((verseNumber - 1) / perPage) + 1;

export function useVerseListing({
  id,
  resourceKind,
  totalVerses,
  lookup,
  initialVerses,
  initialVersesParams,
  initialVerseNumber,
}: UseVerseListingParams): UseVerseListingReturn {
  const errorState = useVerseListingErrorState();
  const settingsState = useSettings();
  const audio = useAudio();
  const translation = useTranslationOptions();

  const stableTranslationIds = useStableTranslationIds(settingsState.settings);
  const wordLang = settingsState.settings.wordLang;
  const tajweed = settingsState.settings.tajweed ?? false;
  const translationIds = useMemo(
    () =>
      stableTranslationIds
        .split(',')
        .filter((value) => value.length > 0)
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value)),
    [stableTranslationIds]
  );

  const mode: UseVerseListingReturn['mode'] =
    resourceKind === 'surah' && typeof totalVerses === 'number' && totalVerses > 0
      ? 'quran-com'
      : 'infinite';

  const canUseInitialVerses =
    mode === 'quran-com' &&
    Boolean(initialVerses?.length) &&
    Boolean(initialVersesParams) &&
    !tajweed &&
    initialVersesParams?.wordLang === wordLang &&
    stableTranslationIds ===
      (initialVersesParams?.translationIds ?? [])
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b)
        .join(',');

  const effectiveInitialVerses =
    mode === 'quran-com' ? (canUseInitialVerses ? initialVerses : undefined) : initialVerses;

  const infiniteLoaderParams: Parameters<typeof useInfiniteVerseLoader>[0] = {
    lookup,
    stableTranslationIds,
    wordLang,
    loadMoreRef: errorState.loadMoreRef,
    error: errorState.error,
    setError: errorState.handleLoaderError,
    ...(mode === 'infinite' && typeof initialVerseNumber === 'number' && initialVerseNumber > 0
      ? { targetVerseNumber: initialVerseNumber }
      : {}),
    ...(mode === 'infinite' && id !== undefined ? { id } : {}),
    tajweed,
  } as const;

  const infiniteLoaderState = useInfiniteVerseLoader(infiniteLoaderParams);
  const infiniteState =
    mode === 'infinite' && id !== undefined
      ? { ...EMPTY_LOADER_STATE, ...infiniteLoaderState }
      : EMPTY_LOADER_STATE;

  const [apiPageToVersesMap, setApiPageToVersesMap] = useState<Record<number, Verse[]>>(() =>
    effectiveInitialVerses?.length ? { 1: effectiveInitialVerses } : {}
  );
  const prefetchedPagesRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    prefetchedPagesRef.current.clear();
    if (mode !== 'quran-com') return;

    setApiPageToVersesMap(effectiveInitialVerses?.length ? { 1: effectiveInitialVerses } : {});
  }, [
    effectiveInitialVerses,
    mode,
    id,
    stableTranslationIds,
    wordLang,
    tajweed,
    lookup,
    translationIds,
  ]);

  const prefetchVersePage = useCallback(
    async (verseNumber: number): Promise<void> => {
      if (mode !== 'quran-com') return;
      if (!id) return;
      if (verseNumber <= 0) return;

      const pageNumber = getPageNumberFromVerseNumber(verseNumber, VERSES_PER_PAGE);
      if (apiPageToVersesMap[pageNumber]?.length) return;
      if (prefetchedPagesRef.current.has(pageNumber)) return;

      prefetchedPagesRef.current.add(pageNumber);

      try {
        const result = await lookup({
          id,
          translationIds,
          page: pageNumber,
          perPage: VERSES_PER_PAGE,
          wordLang,
          tajweed,
        });
        setApiPageToVersesMap((prev) => ({ ...prev, [pageNumber]: result.verses }));
      } catch (error) {
        prefetchedPagesRef.current.delete(pageNumber);
      }
    },
    [apiPageToVersesMap, id, lookup, mode, translationIds, wordLang, tajweed]
  );

  // Keep the next verse's page warm for audio next/auto-advance.
  useEffect(() => {
    if (mode !== 'quran-com') return;
    if (typeof totalVerses !== 'number' || totalVerses <= 0) return;
    if (!audio.activeVerse) return;

    const current = parseVerseNumber(audio.activeVerse);
    if (!current) return;

    const nextVerseNumber = current + 1;
    if (nextVerseNumber > totalVerses) return;

    void prefetchVersePage(nextVerseNumber);
  }, [audio.activeVerse, mode, prefetchVersePage, totalVerses]);

  const quranComLoadedVerses = useMemo(
    () => Object.values(apiPageToVersesMap).flat(),
    [apiPageToVersesMap]
  );

  const rawVerses =
    mode === 'quran-com'
      ? quranComLoadedVerses
      : resolveVerses(initialVerses, infiniteState.verses);

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

  const infiniteNavigation = useNavigationHandlers({
    verses,
    activeVerse: audio.activeVerse,
    setActiveVerse: audio.setActiveVerse,
    openPlayer: audio.openPlayer,
  });

  const getVerseByNumber = useCallback(
    (verseNumber: number): Verse | null => {
      if (verseNumber <= 0) return null;
      const pageNumber = getPageNumberFromVerseNumber(verseNumber, VERSES_PER_PAGE);
      const idxInPage = (verseNumber - 1) % VERSES_PER_PAGE;
      return apiPageToVersesMap[pageNumber]?.[idxInPage] ?? null;
    },
    [apiPageToVersesMap]
  );

  const handleNext = useCallback((): boolean => {
    if (mode !== 'quran-com') return infiniteNavigation.handleNext();
    if (typeof totalVerses !== 'number' || totalVerses <= 0) return false;
    if (!audio.activeVerse) return false;

    const current = parseVerseNumber(audio.activeVerse);
    if (!current) return false;

    const nextVerseNumber = current + 1;
    if (nextVerseNumber > totalVerses) return false;

    const nextVerse = getVerseByNumber(nextVerseNumber);
    if (!nextVerse) {
      void prefetchVersePage(nextVerseNumber);
      return false;
    }

    audio.setActiveVerse(nextVerse);
    audio.openPlayer();
    return true;
  }, [audio, getVerseByNumber, infiniteNavigation, mode, prefetchVersePage, totalVerses]);

  const handlePrev = useCallback((): boolean => {
    if (mode !== 'quran-com') return infiniteNavigation.handlePrev();
    if (!audio.activeVerse) return false;

    const current = parseVerseNumber(audio.activeVerse);
    if (!current) return false;

    const prevVerseNumber = current - 1;
    if (prevVerseNumber <= 0) return false;

    const prevVerse = getVerseByNumber(prevVerseNumber);
    if (!prevVerse) {
      void prefetchVersePage(prevVerseNumber);
      return false;
    }

    audio.setActiveVerse(prevVerse);
    audio.openPlayer();
    return true;
  }, [audio, getVerseByNumber, infiniteNavigation, mode, prefetchVersePage]);

  const isLoading =
    mode === 'quran-com'
      ? verses.length === 0 && !errorState.error && Boolean(id)
      : infiniteState.isLoading;

  return {
    mode,
    error: errorState.error,
    setError: errorState.handleLoaderError,
    isLoading,
    verses,
    isValidating: mode === 'quran-com' ? false : infiniteState.isValidating,
    isReachingEnd: mode === 'quran-com' ? true : infiniteState.isReachingEnd,
    loadMoreRef: errorState.loadMoreRef,
    ...(typeof totalVerses === 'number' ? { totalVerses } : {}),
    perPage: VERSES_PER_PAGE,
    apiPageToVersesMap,
    setApiPageToVersesMap,
    lookup,
    ...(id !== undefined ? { resourceId: id } : {}),
    translationIds,
    wordLang,
    ...(effectiveInitialVerses ? { initialVerses: effectiveInitialVerses } : {}),
    translationOptions: translation.translationOptions,
    wordLanguageOptions: translation.wordLanguageOptions,
    wordLanguageMap: translation.wordLanguageMap,
    settings: settingsState.settings,
    setSettings: settingsState.setSettings,
    activeVerse: audio.activeVerse,
    reciter: audio.reciter,
    isPlayerVisible: audio.isPlayerVisible,
    handleNext,
    handlePrev,
  };
}
