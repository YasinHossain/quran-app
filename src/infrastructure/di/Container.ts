import { IBookmarkRepository } from '@/src/domain/repositories/IBookmarkRepository';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';
import { IVerseRepository } from '@/src/domain/repositories/IVerseRepository';
import { BookmarkRepository } from '@/src/infrastructure/repositories/BookmarkRepository';
import { TafsirRepository } from '@/src/infrastructure/repositories/TafsirRepository';
import { VerseRepository } from '@/src/infrastructure/repositories/VerseRepository';

/**
 * Dependency Injection Container
 * Centralizes creation and management of repository instances
 */
class DIContainer {
  private static instance: DIContainer;
  private verseRepository: IVerseRepository | undefined;
  private bookmarkRepository: IBookmarkRepository | undefined;
  private tafsirRepository: ITafsirRepository | undefined;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Get verse repository instance (singleton)
   */
  getVerseRepository(): IVerseRepository {
    if (!this.verseRepository) {
      this.verseRepository = new VerseRepository();
    }
    return this.verseRepository;
  }

  /**
   * Get bookmark repository instance (singleton)
   */
  getBookmarkRepository(): IBookmarkRepository {
    if (!this.bookmarkRepository) {
      this.bookmarkRepository = new BookmarkRepository();
    }
    return this.bookmarkRepository;
  }

  /**
   * Get tafsir repository instance (singleton)
   */
  getTafsirRepository(): ITafsirRepository {
    if (!this.tafsirRepository) {
      this.tafsirRepository = new TafsirRepository();
    }
    return this.tafsirRepository;
  }

  /**
   * Reset all instances (useful for testing)
   */
  reset(): void {
    this.verseRepository = undefined;
    this.bookmarkRepository = undefined;
    this.tafsirRepository = undefined;
  }

  /**
   * Set custom repository implementations (useful for testing)
   */
  setVerseRepository(repository: IVerseRepository): void {
    this.verseRepository = repository;
  }

  setBookmarkRepository(repository: IBookmarkRepository): void {
    this.bookmarkRepository = repository;
  }

  setTafsirRepository(repository: ITafsirRepository): void {
    this.tafsirRepository = repository;
  }
}

export const container = DIContainer.getInstance();
