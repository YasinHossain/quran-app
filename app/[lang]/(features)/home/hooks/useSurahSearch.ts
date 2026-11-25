import { useMemo } from 'react';

import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { foldSearchCase } from '@/lib/text/foldSearchCase';

import type { Chapter } from '@/types';

type UseSurahSearchResult = {
  filteredChapters: ReadonlyArray<Chapter>;
  isLoading: boolean;
  isEmpty: boolean;
};

export function useSurahSearch(
  searchQuery: string,
  initialChapters?: ReadonlyArray<Chapter>
): UseSurahSearchResult {
  // Pass initialChapters to prevent client-side fetch when data is available
  const options = initialChapters ? { initialChapters: [...initialChapters] } : {};
  const { chapters, isLoading } = useSurahNavigationData(options);

  const filteredChapters = useMemo<ReadonlyArray<Chapter>>(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return chapters;
    }

    const normalizedQuery = foldSearchCase(trimmedQuery);

    return chapters.filter((chapter) => {
      const translation = chapter.translated_name?.name ?? '';
      return (
        foldSearchCase(chapter.name_simple).includes(normalizedQuery) ||
        foldSearchCase(translation).includes(normalizedQuery) ||
        chapter.name_arabic.includes(trimmedQuery) ||
        chapter.id.toString().includes(normalizedQuery)
      );
    });
  }, [chapters, searchQuery]);

  const loading = Boolean(isLoading && chapters.length === 0);
  const isEmpty = !loading && filteredChapters.length === 0;

  return { filteredChapters, isLoading: loading, isEmpty } as const;
}
