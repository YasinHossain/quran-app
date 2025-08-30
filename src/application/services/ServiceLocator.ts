import { BookmarkService } from '@/src/domain/services/BookmarkService';
import { SearchService } from '@/src/domain/services/SearchService';
import { ReadingProgressService } from '@/src/domain/services/ReadingProgressService';
import type { IBookmarkRepository } from '@/src/domain/repositories/IBookmarkRepository';
import type { IVerseRepository } from '@/src/domain/repositories/IVerseRepository';
import type { ISurahRepository } from '@/src/domain/repositories/ISurahRepository';

/**
 * Service Locator for managing domain service instances
 * This will be replaced with proper DI in Phase 5
 */
export class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  configure(repositories: {
    bookmarkRepository: IBookmarkRepository;
    verseRepository: IVerseRepository;
    surahRepository: ISurahRepository;
  }) {
    // Initialize domain services with repositories
    const bookmarkService = new BookmarkService(
      repositories.bookmarkRepository,
      repositories.verseRepository
    );

    const searchService = new SearchService(
      repositories.verseRepository,
      repositories.surahRepository
    );

    const readingProgressService = new ReadingProgressService(
      repositories.verseRepository,
      repositories.surahRepository
    );

    // Register services
    this.services.set('BookmarkService', bookmarkService);
    this.services.set('SearchService', searchService);
    this.services.set('ReadingProgressService', readingProgressService);
  }

  getBookmarkService(): BookmarkService {
    const service = this.services.get('BookmarkService');
    if (!service) {
      throw new Error('BookmarkService not configured. Call configure() first.');
    }
    return service;
  }

  getSearchService(): SearchService {
    const service = this.services.get('SearchService');
    if (!service) {
      throw new Error('SearchService not configured. Call configure() first.');
    }
    return service;
  }

  getReadingProgressService(): ReadingProgressService {
    const service = this.services.get('ReadingProgressService');
    if (!service) {
      throw new Error('ReadingProgressService not configured. Call configure() first.');
    }
    return service;
  }

  getAllServices() {
    return {
      bookmarkService: this.getBookmarkService(),
      searchService: this.getSearchService(),
      readingProgressService: this.getReadingProgressService(),
    };
  }
}
