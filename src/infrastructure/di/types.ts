/**
 * Dependency Injection Types
 *
 * Defines symbolic identifiers for dependency injection container bindings.
 * Used with InversifyJS to maintain type safety and avoid string-based dependencies.
 *
 * @see https://inversify.io/
 */

export const TYPES = {
  // Domain Repositories
  VerseRepository: Symbol.for('VerseRepository'),
  BookmarkRepository: Symbol.for('BookmarkRepository'),
  TafsirRepository: Symbol.for('TafsirRepository'),
  ChapterRepository: Symbol.for('ChapterRepository'),
  JuzRepository: Symbol.for('JuzRepository'),
  TranslationRepository: Symbol.for('TranslationRepository'),

  // Application Use Cases
  GetVersesUseCase: Symbol.for('GetVersesUseCase'),
  GetVerseByKeyUseCase: Symbol.for('GetVerseByKeyUseCase'),
  SaveBookmarkUseCase: Symbol.for('SaveBookmarkUseCase'),
  RemoveBookmarkUseCase: Symbol.for('RemoveBookmarkUseCase'),
  GetBookmarksUseCase: Symbol.for('GetBookmarksUseCase'),
  GetTafsirUseCase: Symbol.for('GetTafsirUseCase'),
  SearchVersesUseCase: Symbol.for('SearchVersesUseCase'),
  GetChaptersUseCase: Symbol.for('GetChaptersUseCase'),
  GetJuzListUseCase: Symbol.for('GetJuzListUseCase'),
  GetTranslationsUseCase: Symbol.for('GetTranslationsUseCase'),

  // Infrastructure Services
  ApiClient: Symbol.for('ApiClient'),
  CacheService: Symbol.for('CacheService'),
  LoggerService: Symbol.for('LoggerService'),
  StorageService: Symbol.for('StorageService'),
  AudioService: Symbol.for('AudioService'),
  SearchService: Symbol.for('SearchService'),

  // Configuration
  Config: Symbol.for('Config'),

  // External APIs
  QuranApiClient: Symbol.for('QuranApiClient'),

  // Monitoring & Analytics
  ErrorTracker: Symbol.for('ErrorTracker'),
  PerformanceMonitor: Symbol.for('PerformanceMonitor'),
  AnalyticsService: Symbol.for('AnalyticsService'),
} as const;

/**
 * Type-safe keys for dependency injection types
 */
export type DITypes = typeof TYPES;

/**
 * Helper type to extract the symbol type from TYPES
 */
export type TypeKeys = keyof DITypes;

/**
 * Helper type to get the symbol value for a given type key
 */
export type TypeSymbol<K extends TypeKeys> = DITypes[K];
