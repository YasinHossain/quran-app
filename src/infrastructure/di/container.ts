/**
 * Dependency Injection Container Configuration
 *
 * Configures InversifyJS container with all application dependencies.
 * Implements IoC (Inversion of Control) pattern for clean architecture.
 *
 * @see https://inversify.io/
 */

import 'reflect-metadata';
import { Container } from 'inversify';

/**
 * Application IoC Container
 *
 * Configured with singleton scope by default for better performance
 * and to ensure single instances of services across the application.
 */
export const container = new Container({
  defaultScope: 'Singleton',
  autoBindInjectable: true,
  skipBaseClassChecks: true,
});

/**
 * Configure Repository Bindings
 *
 * These will be bound to concrete implementations once repositories are created.
 * For now, we're setting up the structure for future implementation.
 */
export function configureRepositories() {
  // Domain repositories will be bound here
  // container.bind<IVerseRepository>(TYPES.VerseRepository).to(VerseRepository);
  // container.bind<IBookmarkRepository>(TYPES.BookmarkRepository).to(BookmarkRepository);
  // container.bind<ITafsirRepository>(TYPES.TafsirRepository).to(TafsirRepository);
  // container.bind<IChapterRepository>(TYPES.ChapterRepository).to(ChapterRepository);
  // container.bind<IJuzRepository>(TYPES.JuzRepository).to(JuzRepository);
  // container.bind<ITranslationRepository>(TYPES.TranslationRepository).to(TranslationRepository);
}

/**
 * Configure Use Case Bindings
 *
 * Application layer use cases that orchestrate domain logic.
 */
export function configureUseCases() {
  // Use cases will be bound here
  // container.bind<GetVersesUseCase>(TYPES.GetVersesUseCase).to(GetVersesUseCase);
  // container.bind<GetVerseByKeyUseCase>(TYPES.GetVerseByKeyUseCase).to(GetVerseByKeyUseCase);
  // container.bind<SaveBookmarkUseCase>(TYPES.SaveBookmarkUseCase).to(SaveBookmarkUseCase);
  // container.bind<RemoveBookmarkUseCase>(TYPES.RemoveBookmarkUseCase).to(RemoveBookmarkUseCase);
  // container.bind<GetBookmarksUseCase>(TYPES.GetBookmarksUseCase).to(GetBookmarksUseCase);
  // container.bind<GetTafsirUseCase>(TYPES.GetTafsirUseCase).to(GetTafsirUseCase);
  // container.bind<SearchVersesUseCase>(TYPES.SearchVersesUseCase).to(SearchVersesUseCase);
  // container.bind<GetChaptersUseCase>(TYPES.GetChaptersUseCase).to(GetChaptersUseCase);
  // container.bind<GetJuzListUseCase>(TYPES.GetJuzListUseCase).to(GetJuzListUseCase);
  // container.bind<GetTranslationsUseCase>(TYPES.GetTranslationsUseCase).to(GetTranslationsUseCase);
}

/**
 * Configure Infrastructure Service Bindings
 *
 * External services, APIs, and infrastructure concerns.
 */
export function configureServices() {
  // Infrastructure services will be bound here
  // container.bind<IApiClient>(TYPES.ApiClient).to(ApiClient);
  // container.bind<ICacheService>(TYPES.CacheService).to(CacheService);
  // container.bind<ILoggerService>(TYPES.LoggerService).to(LoggerService);
  // container.bind<IStorageService>(TYPES.StorageService).to(StorageService);
  // container.bind<IAudioService>(TYPES.AudioService).to(AudioService);
  // container.bind<ISearchService>(TYPES.SearchService).to(SearchService);
}

/**
 * Configure External API Bindings
 *
 * Third-party API clients and integrations.
 */
export function configureExternalServices() {
  // External API clients will be bound here
  // container.bind<IQuranApiClient>(TYPES.QuranApiClient).to(QuranApiClient);
}

/**
 * Configure Monitoring & Analytics Bindings
 *
 * Error tracking, performance monitoring, and analytics services.
 */
export function configureMonitoring() {
  // Monitoring services will be bound here
  // container.bind<IErrorTracker>(TYPES.ErrorTracker).to(ErrorTracker);
  // container.bind<IPerformanceMonitor>(TYPES.PerformanceMonitor).to(PerformanceMonitor);
  // container.bind<IAnalyticsService>(TYPES.AnalyticsService).to(AnalyticsService);
}

/**
 * Initialize Dependency Injection Container
 *
 * Sets up all bindings and prepares the container for use.
 * Call this once at application startup.
 */
export function initializeContainer(): Container {
  // Configure all binding categories
  configureRepositories();
  configureUseCases();
  configureServices();
  configureExternalServices();
  configureMonitoring();

  return container;
}

/**
 * Container getter with lazy initialization
 *
 * Ensures container is initialized before first use.
 */
let isInitialized = false;

export function getContainer(): Container {
  if (!isInitialized) {
    initializeContainer();
    isInitialized = true;
  }
  return container;
}

/**
 * Reset container for testing
 *
 * Unbinds all services and resets initialization state.
 * Only use in test environments.
 */
export function resetContainer(): void {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('resetContainer should only be used in test environments');
  }

  container.unbindAll();
  isInitialized = false;
}
