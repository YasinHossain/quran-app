import { useCallback, useEffect, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { usePrefetchSingleVerse, useSingleVerse } from '@/app/shared/hooks/useSingleVerse';
import { GetTafsirContentUseCase } from '@/src/application/use-cases/GetTafsirContent';
import { container } from '@/src/infrastructure/di/Container';
import { Surah, Verse as VerseType } from '@/types';

import { useTafsirOptions } from './useTafsirOptions';
import { useTranslationOptions } from './useTranslationOptions';
import { useVerseNavigation } from './useVerseNavigation';
import { useWordTranslations } from './useWordTranslations';

interface UseTafsirVerseDataReturn {
  verse: VerseType | undefined;
  tafsirHtml: string | undefined;
  tafsirResource: { id: number; name: string; lang: string } | undefined;
  translationOptions: { id: number; name: string; lang: string }[];
  wordLanguageOptions: { name: string; id: number }[];
  wordLanguageMap: Record<string, number>;
  selectedTranslationName: string;
  selectedTafsirName: string;
  selectedWordLanguageName: string;
  prev: { surahId: string; ayahId: number } | null;
  next: { surahId: string; ayahId: number } | null;
  navigate: (target: { surahId: string; ayahId: number } | null) => void;
  currentSurah: Surah | undefined;
  resetWordSettings: () => void;
}

const PREFETCH_IDLE_DELAY_MS = 400;

export const useTafsirVerseData = (surahId: string, ayahId: string): UseTafsirVerseDataReturn => {
  const { mutate } = useSWRConfig();
  const { translationOptions, selectedTranslationName } = useTranslationOptions();
  const { tafsirResource, selectedTafsirName } = useTafsirOptions();
  const { wordLanguageOptions, wordLanguageMap, selectedWordLanguageName, resetWordSettings } =
    useWordTranslations();
  const { prev, next, navigate, currentSurah } = useVerseNavigation(surahId, ayahId);

  const verseKey = surahId && ayahId ? `${surahId}:${ayahId}` : '';
  const { verse } = useSingleVerse({ idOrKey: verseKey });

  const repository = container.getTafsirRepository();
  const tafsirUseCase = useMemo(() => new GetTafsirContentUseCase(repository), [repository]);

  const prefetchSingleVerse = usePrefetchSingleVerse();

  const neighborKeys = useMemo(() => {
    const keys: string[] = [];
    if (prev) {
      keys.push(`${prev.surahId}:${prev.ayahId}`);
    }
    if (next) {
      keys.push(`${next.surahId}:${next.ayahId}`);
    }
    return keys;
  }, [prev, next]);

  const prefetchTafsir = useCallback(
    async (keys: string[]) => {
      if (!tafsirResource) return;
      await Promise.all(
        keys.map((key) =>
          mutate(
            ['tafsir', key, tafsirResource.id],
            () => tafsirUseCase.execute(key, tafsirResource.id),
            { populateCache: true, revalidate: false }
          ).catch(() => {})
        )
      );
    },
    [mutate, tafsirResource, tafsirUseCase]
  );

  const { data: tafsirHtml } = useSWR(
    verse && tafsirResource ? ['tafsir', verse.verse_key, tafsirResource.id] : null,
    ([, key, id]) => tafsirUseCase.execute(key as string, id as number)
  );

  useEffect(() => {
    if (!verse?.verse_key || neighborKeys.length === 0) return;

    const timer = window.setTimeout(() => {
      void prefetchSingleVerse(neighborKeys);
      void prefetchTafsir(neighborKeys);
    }, PREFETCH_IDLE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [neighborKeys, prefetchSingleVerse, prefetchTafsir, verse?.verse_key]);

  return {
    verse,
    tafsirHtml,
    tafsirResource,
    translationOptions,
    wordLanguageOptions,
    wordLanguageMap,
    selectedTranslationName,
    selectedTafsirName,
    selectedWordLanguageName,
    prev,
    next,
    navigate,
    currentSurah,
    resetWordSettings,
  };
};
