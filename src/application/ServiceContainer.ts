/**
 * Service Container
 * 
 * Dependency injection container for application services.
 * Provides singleton instances of services with proper dependency injection.
 */

import { BookmarkService } from './services/BookmarkService';
import { BookmarkRepository } from '../infrastructure/repositories/BookmarkRepository';
import { VerseRepository } from '../infrastructure/repositories/VerseRepository';

export class ServiceContainer {
  private static instance: ServiceContainer | null = null;
  
  private _bookmarkService: BookmarkService | null = null;
  private _bookmarkRepository: BookmarkRepository | null = null;
  private _verseRepository: VerseRepository | null = null;

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  // Repository instances (singletons)
  get bookmarkRepository(): BookmarkRepository {
    if (!this._bookmarkRepository) {
      this._bookmarkRepository = new BookmarkRepository();
    }
    return this._bookmarkRepository;
  }

  get verseRepository(): VerseRepository {
    if (!this._verseRepository) {
      this._verseRepository = new VerseRepository();
    }
    return this._verseRepository;
  }

  // Service instances (singletons)
  get bookmarkService(): BookmarkService {
    if (!this._bookmarkService) {
      this._bookmarkService = new BookmarkService(
        this.bookmarkRepository,
        this.verseRepository,
        {
          defaultTranslationId: 20,
          fetchMetadataByDefault: true
        }
      );
    }
    return this._bookmarkService;
  }

  // Method to reset all services (useful for testing)
  reset(): void {
    this._bookmarkService = null;
    this._bookmarkRepository = null;
    this._verseRepository = null;
  }
}

// Convenience function to get services
export const getServices = () => ServiceContainer.getInstance();