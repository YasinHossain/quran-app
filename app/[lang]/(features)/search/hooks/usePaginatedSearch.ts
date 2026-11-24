'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { advancedSearch, type SearchVerseResult } from '@/lib/api/search';
import { getVerseByKey } from '@/lib/api/verses';
import { estimateVerseTotal } from '@/lib/utils/searchTotals';

import type { Verse } from '@/types';

const PAGE_SIZE = 10;

interface VerseWithHighlight extends Verse {
  highlightedTranslation: string;
}

export type { VerseWithHighlight };

interface PaginatedSearchState {
  verses: VerseWithHighlight[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UsePaginatedSearchReturn extends PaginatedSearchState {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

/**
 * Hook for paginated search results with full verse data.
 * Fetches search results first, then enriches with full verse data for display.
 */
export function usePaginatedSearch(query: string): UsePaginatedSearchReturn {
  const { settings } = useSettings();
  const requestIdRef = useRef(0);
  const [state, setState] = useState<PaginatedSearchState>({
    verses: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch full verse data for search results
  const fetchVerseDetails = useCallback(
    async (searchResults: SearchVerseResult[]): Promise<VerseWithHighlight[]> => {
      const translationIds = settings.translationIds?.length ? settings.translationIds : [20]; // Default to Sahih International

      const versePromises = searchResults.map(async (result) => {
        try {
          const fullVerse = await getVerseByKey(
            result.verseKey,
            translationIds,
            'en',
            settings.tajweed ?? false
          );
          return {
            ...fullVerse,
            highlightedTranslation: result.highlightedTranslation,
          };
        } catch (error) {
          console.error(`Failed to fetch verse ${result.verseKey}:`, error);
          // Return a minimal verse object with search data
          return {
            id: result.verseId ?? 0,
            verse_key: result.verseKey,
            text_uthmani: result.textArabic,
            translations: [
              {
                resource_id: 20,
                resource_name: result.translationName,
                text: result.highlightedTranslation,
              },
            ],
            highlightedTranslation: result.highlightedTranslation,
          } as VerseWithHighlight;
        }
      });

      return Promise.all(versePromises);
    },
    [settings.translationIds, settings.tajweed]
  );

  // Fetch search results for a specific page
  const fetchPage = useCallback(
    async (page: number, isPageChange = false) => {
      const requestId = ++requestIdRef.current;
      if (!query.trim()) {
        setState({
          verses: [],
          isLoading: false,
          isLoadingMore: false,
          error: null,
          currentPage: 1,
          totalPages: 0,
          totalResults: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: !isPageChange,
        isLoadingMore: isPageChange,
        error: null,
      }));

      try {
        // Get search results from API
        const searchResponse = await advancedSearch(query, {
          page,
          size: PAGE_SIZE,
          translationIds: settings.translationIds?.length ? settings.translationIds : [20],
        });

        if (requestId !== requestIdRef.current) return;

        // Fetch full verse data for each result
        const fullVerses = await fetchVerseDetails(searchResponse.verses);
        if (requestId !== requestIdRef.current) return;

        const totalResults = estimateVerseTotal({
          totalPages: searchResponse.pagination.totalPages,
          pageSize: PAGE_SIZE,
          reportedTotal: searchResponse.pagination.totalRecords,
          currentPage: page,
          currentPageCount: searchResponse.verses.length,
        });

        setState({
          verses: fullVerses,
          isLoading: false,
          isLoadingMore: false,
          error: null,
          currentPage: page,
          totalPages: searchResponse.pagination.totalPages,
          totalResults,
          hasNextPage: searchResponse.pagination.nextPage !== null,
          hasPrevPage: page > 1,
        });
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        console.error('Search error:', error);
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to load search results. Please try again.';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isLoadingMore: false,
          error: message,
        }));
      }
    },
    [query, settings.translationIds, fetchVerseDetails]
  );

  // Initial fetch when query changes
  useEffect(() => {
    fetchPage(1, false);
  }, [query, fetchPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= state.totalPages) {
        fetchPage(page, true);
      }
    },
    [state.totalPages, fetchPage]
  );

  const goToNextPage = useCallback(() => {
    if (state.hasNextPage) {
      goToPage(state.currentPage + 1);
    }
  }, [state.hasNextPage, state.currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (state.hasPrevPage) {
      goToPage(state.currentPage - 1);
    }
  }, [state.hasPrevPage, state.currentPage, goToPage]);

  return {
    ...state,
    goToPage,
    goToNextPage,
    goToPrevPage,
  };
}
