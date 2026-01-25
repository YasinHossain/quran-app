import { useCallback, useEffect, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { usePrefetchSingleVerse, useSingleVerse } from '@/app/shared/hooks/useSingleVerse';
import { useSettings } from '@/app/providers/SettingsContext';
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

export const useTafsirVerseData = (
  surahId: string,
  ayahId: string,
  initial?: {
    verse?: VerseType | undefined;
    tafsirHtml?: string | undefined;
    tafsirResource?: { id: number; name: string; lang: string } | undefined;
  }
): UseTafsirVerseDataReturn => {
  const { mutate } = useSWRConfig();
  const { settings } = useSettings();
  const { translationOptions, selectedTranslationName } = useTranslationOptions();
  const { tafsirResource, selectedTafsirName } = useTafsirOptions();
  const { wordLanguageOptions, wordLanguageMap, selectedWordLanguageName, resetWordSettings } =
    useWordTranslations();
  const { prev, next, navigate, currentSurah } = useVerseNavigation(surahId, ayahId);

  const verseKey = surahId && ayahId ? `${surahId}:${ayahId}` : '';
  const { verse } = useSingleVerse({
    idOrKey: verseKey,
    ...(initial?.verse ? { initialVerse: initial.verse } : {}),
  });

  const repository = useMemo(() => container.getTafsirRepository(), []);
  const tafsirUseCase = useMemo(() => new GetTafsirContentUseCase(repository), [repository]);

  const prefetchSingleVerse = usePrefetchSingleVerse();

  const activeTafsirId = settings.tafsirIds?.[0];
  const initialTafsirId = initial?.tafsirResource?.id;
  const initialVerseKey = initial?.verse?.verse_key;
  const effectiveTafsirResource =
    tafsirResource ??
    (typeof activeTafsirId === 'number' && initialTafsirId === activeTafsirId
      ? initial?.tafsirResource
      : undefined);

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
      if (!activeTafsirId) return;
      await Promise.all(
        keys.map((key) =>
          mutate(
            ['tafsir', key, activeTafsirId],
            () => tafsirUseCase.execute(key, activeTafsirId),
            { populateCache: true, revalidate: false }
          ).catch(() => {})
        )
      );
    },
    [activeTafsirId, mutate, tafsirUseCase]
  );

  const { data: tafsirHtml } = useSWR(
    verse && activeTafsirId ? ['tafsir', verse.verse_key, activeTafsirId] : null,
    ([, key, id]) => tafsirUseCase.execute(key as string, id as number),
    {
      ...(initial?.tafsirHtml &&
      initialTafsirId === activeTafsirId &&
      typeof initialVerseKey === 'string' &&
      verseKey === initialVerseKey
        ? { fallbackData: initial.tafsirHtml }
        : {}),
    }
  );

  useEffect(() => {
    if (!verse?.verse_key || neighborKeys.length === 0) return;

    const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const schedule = (work: () => void) => {
      const idleCallback = (window as unknown as { requestIdleCallback?: unknown }).requestIdleCallback;
      if (typeof idleCallback === 'function') {
        const handle = (idleCallback as (cb: () => void, options?: { timeout: number }) => number)(
          work,
          { timeout: PREFETCH_IDLE_DELAY_MS * 4 }
        );
        const cancelIdle = (window as unknown as { cancelIdleCallback?: unknown }).cancelIdleCallback;
        if (typeof cancelIdle === 'function') {
          return () => (cancelIdle as (id: number) => void)(handle);
        }
        return () => {};
      }
      const timer = window.setTimeout(work, PREFETCH_IDLE_DELAY_MS);
      return () => window.clearTimeout(timer);
    };

    const cancel = schedule(() => {
      void prefetchSingleVerse(neighborKeys);
      void prefetchTafsir(neighborKeys);
    });

    return cancel;
  }, [neighborKeys, prefetchSingleVerse, prefetchTafsir, verse?.verse_key]);

  return {
    verse,
    tafsirHtml,
    tafsirResource: effectiveTafsirResource,
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
