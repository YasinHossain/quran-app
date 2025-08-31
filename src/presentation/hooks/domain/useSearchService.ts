'use client';

import { useState, useCallback } from 'react';
import { SearchService } from '@/src/domain/services/SearchService';
import { Verse } from '@/src/domain/entities/Verse';
import { Surah } from '@/src/domain/entities/Surah';
import { Translation } from '@/src/domain/value-objects/Translation';
import { RevelationType } from '@/src/domain/entities/Surah';

interface UseSearchServiceProps {
  searchService: SearchService;
}

export interface SearchResults {
  verses: Verse[];
  surahs: Surah[];
  totalResults: number;
}

export const useSearchService = ({ searchService }: UseSearchServiceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResults>({
    verses: [],
    surahs: [],
    totalResults: 0,
  });

  const searchVerses = useCallback(
    async (
      query: string,
      options?: {
        limit?: number;
        offset?: number;
        includeTranslations?: boolean;
      }
    ): Promise<SearchResults> => {
      if (!query.trim()) {
        setResults({ verses: [], surahs: [], totalResults: 0 });
        return { verses: [], surahs: [], totalResults: 0 };
      }

      setIsLoading(true);
      setError(null);

      try {
        const verses = await searchService.searchVerses(query, {
          maxResults: options?.limit,
          offset: options?.offset,
        });

        const surahs = await searchService.searchSurahs(query);

        // Convert search results to domain entities for consistency
        const domainVerses = verses.map(
          (v) =>
            new Verse(
              String(v.id),
              v.surahId,
              v.ayahNumber,
              v.arabicText,
              v.uthmaniText,
              v.translation
                ? new Translation(
                    v.translation.resourceId,
                    v.translation.text,
                    v.translation.language
                  )
                : undefined
            )
        );

        const domainSurahs = surahs.map(
          (s) =>
            new Surah(
              s.id,
              s.name,
              s.arabicName,
              s.englishName,
              s.englishTranslation,
              s.numberOfAyahs,
              s.revelationType,
              s.revelationOrder,
              s.rukus
            )
        );

        const searchResults = {
          verses: domainVerses,
          surahs: domainSurahs,
          totalResults: domainVerses.length + domainSurahs.length,
        };

        setResults(searchResults);
        return searchResults;
      } catch (err) {
        const errorMessage = 'Failed to search verses';
        setError(errorMessage);
        setResults({ verses: [], surahs: [], totalResults: 0 });
        return { verses: [], surahs: [], totalResults: 0 };
      } finally {
        setIsLoading(false);
      }
    },
    [searchService]
  );

  const searchSurahs = useCallback(
    async (query: string): Promise<Surah[]> => {
      if (!query.trim()) {
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        const surahs = await searchService.searchSurahs(query);
        return surahs;
      } catch (err) {
        setError('Failed to search surahs');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [searchService]
  );

  const clearResults = useCallback(() => {
    setResults({ verses: [], surahs: [], totalResults: 0 });
    setError(null);
  }, []);

  return {
    searchVerses,
    searchSurahs,
    clearResults,
    results,
    isLoading,
    error,
  };
};
