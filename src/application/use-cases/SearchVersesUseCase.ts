import { injectable, inject } from 'inversify';
import { TYPES } from '../../shared/config/container';
import { SearchService } from '../../domain/services/SearchService';
import { Verse } from '../../domain/entities/Verse';
import { Surah } from '../../domain/entities/Surah';

export interface SearchVersesParams {
  query: string;
  limit?: number;
  offset?: number;
  searchType?: 'verse' | 'surah' | 'both';
}

export interface SearchVersesResult {
  verses: Verse[];
  surahs: Surah[];
  totalResults: number;
  hasMore: boolean;
}

// // @injectable()
export class SearchVersesUseCase {
  constructor() // @inject(TYPES.SearchService) private searchService: SearchService
  {}

  async execute(params: SearchVersesParams): Promise<SearchVersesResult> {
    const { query, limit = 20, offset = 0, searchType = 'both' } = params;

    let verses: Verse[] = [];
    let surahs: Surah[] = [];

    if (searchType === 'verse' || searchType === 'both') {
      const verseResults = await this.searchService.searchVerses(query, {
        limit,
        offset,
        includeTranslation: true,
      });
      verses = verseResults.verses;
    }

    if (searchType === 'surah' || searchType === 'both') {
      const surahResults = await this.searchService.searchSurahs(query, {
        limit: Math.floor(limit / 2), // Split limit between verses and surahs
        offset: Math.floor(offset / 2),
      });
      surahs = surahResults.surahs;
    }

    const totalResults = verses.length + surahs.length;
    const hasMore = totalResults === limit; // Simple heuristic

    return {
      verses,
      surahs,
      totalResults,
      hasMore,
    };
  }
}
