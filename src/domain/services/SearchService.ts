import { Verse } from '../entities/Verse';
import { Surah } from '../entities/Surah';
import { IVerseRepository, VerseSearchOptions } from '../repositories/IVerseRepository';
import { ISurahRepository, SurahSearchOptions } from '../repositories/ISurahRepository';

/**
 * Search result for verses
 */
export interface VerseSearchResult {
  verse: Verse;
  relevanceScore: number;
  matchedText: string;
  highlightedText?: string;
}

/**
 * Search result for Surahs
 */
export interface SurahSearchResult {
  surah: Surah;
  relevanceScore: number;
  matchedField: 'name' | 'arabicName' | 'englishName' | 'translation';
}

/**
 * Combined search results
 */
export interface CombinedSearchResults {
  verses: VerseSearchResult[];
  surahs: SurahSearchResult[];
  totalResults: number;
  searchTime: number;
}

/**
 * Search suggestions
 */
export interface SearchSuggestion {
  type: 'verse' | 'surah' | 'topic';
  text: string;
  description?: string;
  action?: string;
}

/**
 * Domain service for search-related business operations.
 * Provides intelligent search capabilities across verses and surahs.
 */
export class SearchService {
  constructor(
    private readonly verseRepository: IVerseRepository,
    private readonly surahRepository: ISurahRepository
  ) {}

  /**
   * Performs comprehensive search across verses and surahs
   */
  async search(
    query: string,
    options: {
      includeVerses?: boolean;
      includeSurahs?: boolean;
      translationIds?: number[];
      maxResults?: number;
      offset?: number;
    } = {}
  ): Promise<CombinedSearchResults> {
    const startTime = Date.now();

    const {
      includeVerses = true,
      includeSurahs = true,
      translationIds = [],
      maxResults = 50,
      offset = 0,
    } = options;

    const [verseResults, surahResults] = await Promise.all([
      includeVerses ? this.searchVerses(query, { translationIds, maxResults, offset }) : [],
      includeSurahs ? this.searchSurahs(query, { maxResults }) : [],
    ]);

    const searchTime = Date.now() - startTime;

    return {
      verses: verseResults,
      surahs: surahResults,
      totalResults: verseResults.length + surahResults.length,
      searchTime,
    };
  }

  /**
   * Searches specifically in verses
   */
  async searchVerses(
    query: string,
    options: {
      translationIds?: number[];
      maxResults?: number;
      offset?: number;
      surahId?: number;
    } = {}
  ): Promise<VerseSearchResult[]> {
    const searchOptions: VerseSearchOptions = {
      query,
      limit: options.maxResults || 50,
      offset: options.offset || 0,
      includeTranslations: true,
    };

    if (options.translationIds && options.translationIds.length > 0) {
      // Search in specific translations - this would need repository support
      const verses = await this.verseRepository.findWithTranslation(
        options.translationIds,
        options.surahId,
        searchOptions.limit,
        searchOptions.offset
      );

      return verses
        .filter((verse) => this.matchesQuery(verse, query))
        .map((verse) => this.createVerseSearchResult(verse, query));
    } else {
      // Search in Arabic text and all translations
      const verses = await this.verseRepository.search(searchOptions);

      return verses.map((verse) => this.createVerseSearchResult(verse, query));
    }
  }

  /**
   * Searches specifically in Surahs
   */
  async searchSurahs(
    query: string,
    options: {
      maxResults?: number;
      language?: 'en' | 'ar';
    } = {}
  ): Promise<SurahSearchResult[]> {
    const searchOptions: SurahSearchOptions = {
      query,
      language: options.language,
      limit: options.maxResults || 20,
    };

    const surahs = await this.surahRepository.search(searchOptions);

    return surahs.map((surah) => this.createSurahSearchResult(surah, query));
  }

  /**
   * Searches for verses by reference (e.g., "2:255", "Al-Baqarah 255")
   */
  async searchByReference(reference: string): Promise<Verse | null> {
    // Try to parse as verse key (e.g., "2:255")
    const verseKeyMatch = reference.match(/^(\d+):(\d+)$/);
    if (verseKeyMatch) {
      const surahId = parseInt(verseKeyMatch[1], 10);
      const ayahNumber = parseInt(verseKeyMatch[2], 10);
      return await this.verseRepository.findBySurahAndAyah(surahId, ayahNumber);
    }

    // Try to parse as Surah name + verse number
    const surahVerseMatch = reference.match(/^(.+?)\s+(\d+)$/);
    if (surahVerseMatch) {
      const surahName = surahVerseMatch[1].trim();
      const ayahNumber = parseInt(surahVerseMatch[2], 10);

      // Find Surah by name
      const surahs = await this.surahRepository.findByName(surahName);
      if (surahs.length > 0) {
        return await this.verseRepository.findBySurahAndAyah(surahs[0].id, ayahNumber);
      }
    }

    return null;
  }

  /**
   * Gets search suggestions based on partial query
   */
  async getSearchSuggestions(partialQuery: string): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];

    if (partialQuery.length < 2) return suggestions;

    // Verse reference suggestions
    const verseRefMatch = partialQuery.match(/^(\d+):?(\d*)$/);
    if (verseRefMatch) {
      const surahId = parseInt(verseRefMatch[1], 10);
      if (surahId >= 1 && surahId <= 114) {
        const surah = await this.surahRepository.findById(surahId);
        if (surah) {
          suggestions.push({
            type: 'surah',
            text: `${surahId}:1`,
            description: `First verse of ${surah.englishName}`,
            action: 'navigate',
          });

          if (verseRefMatch[2] && parseInt(verseRefMatch[2], 10) <= surah.numberOfAyahs) {
            suggestions.push({
              type: 'verse',
              text: `${surahId}:${verseRefMatch[2]}`,
              description: `${surah.englishName} verse ${verseRefMatch[2]}`,
              action: 'navigate',
            });
          }
        }
      }
    }

    // Surah name suggestions
    const surahs = await this.surahRepository.search({
      query: partialQuery,
      limit: 5,
    });

    surahs.forEach((surah) => {
      suggestions.push({
        type: 'surah',
        text: surah.englishName,
        description: `${surah.arabicName} (${surah.numberOfAyahs} verses)`,
        action: 'navigate',
      });
    });

    // Topic suggestions based on common search terms
    const topicSuggestions = this.getTopicSuggestions(partialQuery);
    suggestions.push(...topicSuggestions);

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }

  /**
   * Finds similar verses based on content
   */
  async findSimilarVerses(verse: Verse, limit: number = 5): Promise<Verse[]> {
    // This is a simplified implementation
    // In a real system, you'd use semantic search or NLP techniques

    const keywords = this.extractKeywords(verse.arabicText);
    if (keywords.length === 0) return [];

    const searchResults = await Promise.all(
      keywords.slice(0, 3).map((keyword) =>
        this.verseRepository.search({
          query: keyword,
          limit: 10,
        })
      )
    );

    const allVerses = searchResults.flat();
    const uniqueVerses = allVerses.filter(
      (v, index, arr) => arr.findIndex((other) => other.id === v.id) === index && v.id !== verse.id
    );

    return uniqueVerses.slice(0, limit);
  }

  /**
   * Advanced search with filters
   */
  async advancedSearch(options: {
    query?: string;
    surahIds?: number[];
    revelationType?: 'makki' | 'madani';
    translationIds?: number[];
    hasAudio?: boolean;
    verseRange?: { start: string; end: string };
    maxResults?: number;
  }): Promise<VerseSearchResult[]> {
    let verses: Verse[] = [];

    if (options.surahIds && options.surahIds.length > 0) {
      // Search within specific surahs
      const surahVerses = await Promise.all(
        options.surahIds.map((surahId) => this.verseRepository.findBySurah(surahId, true))
      );
      verses = surahVerses.flat();
    } else if (options.revelationType) {
      // Search by revelation type
      verses = await this.verseRepository.findByRevelationType(
        options.revelationType,
        options.maxResults
      );
    } else {
      // General search
      verses = await this.verseRepository.search({
        query: options.query,
        limit: options.maxResults || 100,
        includeTranslations: true,
      });
    }

    // Apply additional filters
    if (options.query && verses.length > 0) {
      verses = verses.filter((verse) => this.matchesQuery(verse, options.query!));
    }

    // Convert to search results
    return verses.map((verse) => this.createVerseSearchResult(verse, options.query || ''));
  }

  /**
   * Creates a verse search result with relevance scoring
   */
  private createVerseSearchResult(verse: Verse, query: string): VerseSearchResult {
    let relevanceScore = 0;
    let matchedText = '';

    // Check Arabic text match
    if (verse.arabicText.includes(query)) {
      relevanceScore += 10;
      matchedText = verse.arabicText;
    }

    // Check translation match
    if (verse.translation && verse.translation.contains(query)) {
      relevanceScore += 8;
      if (!matchedText) matchedText = verse.translation.text;
    }

    // Default relevance if no direct match
    if (relevanceScore === 0) {
      relevanceScore = 1;
      matchedText = verse.arabicText;
    }

    return {
      verse,
      relevanceScore,
      matchedText,
      highlightedText: this.highlightText(matchedText, query),
    };
  }

  /**
   * Creates a Surah search result with relevance scoring
   */
  private createSurahSearchResult(surah: Surah, query: string): SurahSearchResult {
    let relevanceScore = 0;
    let matchedField: 'name' | 'arabicName' | 'englishName' | 'translation' = 'name';

    const lowerQuery = query.toLowerCase();

    if (surah.englishName.toLowerCase().includes(lowerQuery)) {
      relevanceScore += 10;
      matchedField = 'englishName';
    } else if (surah.name.toLowerCase().includes(lowerQuery)) {
      relevanceScore += 8;
      matchedField = 'name';
    } else if (surah.arabicName.includes(query)) {
      relevanceScore += 8;
      matchedField = 'arabicName';
    } else if (surah.englishTranslation.toLowerCase().includes(lowerQuery)) {
      relevanceScore += 6;
      matchedField = 'translation';
    } else {
      relevanceScore = 1;
    }

    return {
      surah,
      relevanceScore,
      matchedField,
    };
  }

  /**
   * Checks if a verse matches a query
   */
  private matchesQuery(verse: Verse, query: string): boolean {
    const lowerQuery = query.toLowerCase();

    return (
      verse.arabicText.toLowerCase().includes(lowerQuery) ||
      verse.uthmaniText.toLowerCase().includes(lowerQuery) ||
      (verse.translation?.text.toLowerCase().includes(lowerQuery) ?? false)
    );
  }

  /**
   * Highlights matching text in search results
   */
  private highlightText(text: string, query: string): string {
    if (!query || query.trim().length === 0) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Extracts keywords from Arabic text for similarity search
   */
  private extractKeywords(arabicText: string): string[] {
    // This is a very simplified keyword extraction
    // In a real system, you'd use Arabic NLP libraries
    const words = arabicText.split(/\s+/).filter((word) => word.length > 2);
    return words.slice(0, 5); // Return first 5 words as keywords
  }

  /**
   * Gets topic-based search suggestions
   */
  private getTopicSuggestions(query: string): SearchSuggestion[] {
    const topics: Record<string, string> = {
      prayer: 'Verses about prayer and worship',
      forgiveness: "Verses about Allah's forgiveness",
      paradise: 'Verses describing paradise',
      charity: 'Verses about giving charity',
      patience: 'Verses about patience and perseverance',
      guidance: 'Verses about divine guidance',
      mercy: "Verses about Allah's mercy",
      knowledge: 'Verses about seeking knowledge',
    };

    const matchingTopics: SearchSuggestion[] = [];

    Object.entries(topics).forEach(([topic, description]) => {
      if (topic.toLowerCase().includes(query.toLowerCase())) {
        matchingTopics.push({
          type: 'topic',
          text: topic,
          description,
          action: 'search',
        });
      }
    });

    return matchingTopics;
  }
}
