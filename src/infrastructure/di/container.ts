import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';
import { ITafsirRepository } from '../../domain/repositories/ITafsirRepository';
import { VerseRepository } from '../repositories/VerseRepository';
import { BookmarkRepository } from '../repositories/BookmarkRepository';
import { TafsirRepository } from '../repositories/TafsirRepository';

/**
 * Dependency Injection Container
 * Centralizes creation and management of repository instances
 */
class DIContainer {
  private static instance: DIContainer;
  private verseRepository?: IVerseRepository;
  private bookmarkRepository?: IBookmarkRepository;
  private tafsirRepository?: ITafsirRepository;

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
