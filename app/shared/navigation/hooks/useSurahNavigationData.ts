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
  initialChapters?: Chapter[];
}

interface SurahNavigationData {
  chapters: Chapter[];
  surahs: Surah[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useSurahNavigationData(
  options: UseSurahNavigationDataOptions = {}
): SurahNavigationData {
  const { initialChapters } = options;
  const swrConfig = initialChapters ? { fallbackData: initialChapters } : undefined;
  const { data, error, isLoading } = useSWR(CHAPTERS_KEY, getChapters, swrConfig);

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
