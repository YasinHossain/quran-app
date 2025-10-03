import { useMemo } from 'react';
import useSWR from 'swr';

import { getChapters } from '@/lib/api';

import type { Chapter, Surah } from '@/types';

const CHAPTERS_KEY = 'chapters';

function mapChapterToSurah(chapter: Chapter): Surah {
  return {
    number: chapter.id,
    name: chapter.name_simple,
    arabicName: chapter.name_arabic,
    verses: chapter.verses_count,
    meaning: chapter.translated_name?.name ?? '',
  };
}

interface UseSurahNavigationDataOptions {
  initialChapters?: ReadonlyArray<Chapter>;
}

interface SurahNavigationData {
  chapters: ReadonlyArray<Chapter>;
  surahs: ReadonlyArray<Surah>;
  isLoading: boolean;
  error: Error | undefined;
}

export function useSurahNavigationData(
  options: UseSurahNavigationDataOptions = {}
): SurahNavigationData {
  const { initialChapters } = options;
  const { data, error, isLoading } = useSWR(CHAPTERS_KEY, getChapters, {
    fallbackData: initialChapters,
  });

  const chapters = useMemo(() => data ?? initialChapters ?? [], [data, initialChapters]);
  const surahs = useMemo(() => chapters.map(mapChapterToSurah), [chapters]);
  const loading = Boolean(isLoading && chapters.length === 0);

  return {
    chapters,
    surahs,
    isLoading: loading,
    error: error as Error | undefined,
  };
}

export { mapChapterToSurah };
