'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Verse } from '@/src/domain/entities/Verse';
import { Translation } from '@/src/domain/value-objects/Translation';

interface UseVerseListingWithDomainProps {
  surahId: number;
  pageSize?: number;
  enabledTranslations?: string[];
  enabledTafsirs?: string[];
}

interface VerseListingState {
  verses: Verse[];
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  isLoadingMore: boolean;
}

export const useVerseListingWithDomain = ({
  surahId,
  pageSize = 10,
  enabledTranslations = [],
  enabledTafsirs = [],
}: UseVerseListingWithDomainProps) => {
  const [state, setState] = useState<VerseListingState>({
    verses: [],
    isLoading: true,
    error: null,
    hasNextPage: true,
    isLoadingMore: false,
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Create domain entities from API data
  const createVerseEntity = useCallback(
    (apiVerse: any): Verse => {
      const translation = apiVerse.translations?.[0]
        ? new Translation(
            apiVerse.translations[0].resource_id,
            apiVerse.translations[0].text,
            'en' // TODO: detect language properly
          )
        : undefined;

      return new Verse(
        String(apiVerse.id),
        surahId,
        apiVerse.verse_number,
        apiVerse.text_uthmani,
        apiVerse.text_uthmani, // Same for now
        translation
      );
    },
    [surahId]
  );

  // Load verses from API and convert to domain entities
  const loadVerses = useCallback(
    async (page: number, append = false) => {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: !append,
          isLoadingMore: append,
          error: null,
        }));

        // Simulate API call - replace with actual implementation
        const response = await fetch(
          `/api/verses?surah=${surahId}&page=${page}&limit=${pageSize}&translations=${enabledTranslations.join(',')}&tafsirs=${enabledTafsirs.join(',')}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const domainVerses = data.verses.map(createVerseEntity);

        setState((prev) => ({
          ...prev,
          verses: append ? [...prev.verses, ...domainVerses] : domainVerses,
          isLoading: false,
          isLoadingMore: false,
          hasNextPage: domainVerses.length === pageSize,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load verses',
          isLoading: false,
          isLoadingMore: false,
        }));
      }
    },
    [surahId, pageSize, enabledTranslations, enabledTafsirs, createVerseEntity]
  );

  // Load more verses
  const loadMore = useCallback(() => {
    if (!state.hasNextPage || state.isLoadingMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadVerses(nextPage, true);
  }, [currentPage, state.hasNextPage, state.isLoadingMore, loadVerses]);

  // Reload from beginning
  const reload = useCallback(() => {
    setCurrentPage(1);
    loadVerses(1, false);
  }, [loadVerses]);

  // Load initial verses
  useEffect(() => {
    loadVerses(1, false);
  }, [loadVerses]);

  // Memoize results to prevent unnecessary rerenders
  const results = useMemo(
    () => ({
      verses: state.verses,
      isLoading: state.isLoading,
      error: state.error,
      hasNextPage: state.hasNextPage,
      isLoadingMore: state.isLoadingMore,
      loadMore,
      reload,
      totalLoaded: state.verses.length,
    }),
    [state, loadMore, reload]
  );

  return results;
};
