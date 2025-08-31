import { Container } from 'inversify';
import 'reflect-metadata';

// Domain Services - Temporarily commented for testing
// import { BookmarkService } from '../../domain/services/BookmarkService';
// import { SearchService } from '../../domain/services/SearchService';
// import { ReadingProgressService } from '../../domain/services/ReadingProgressService';

// Repository Interfaces - Temporarily commented for testing
// import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
// import { ISurahRepository } from '../../domain/repositories/ISurahRepository';
// import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';

// Infrastructure Implementations - Temporarily commented for testing
// import { VerseRepository } from '../../infrastructure/repositories/VerseRepository';
// import { SurahRepository } from '../../infrastructure/repositories/SurahRepository';
// import { BookmarkRepository } from '../../infrastructure/repositories/BookmarkRepository';

// API Client
import { QuranApiClient } from '../../infrastructure/api/QuranApiClient';
import { FetchHttpClient } from '../../infrastructure/http/FetchHttpClient';

// Cache
import { ICache } from '../../domain/repositories/ICache';
import { LocalStorageCache } from '../../infrastructure/cache/LocalStorageCache';

// Use Cases - Commented out temporarily for testing
// import { ReadVerseUseCase } from '../../application/use-cases/ReadVerseUseCase';
// import { BookmarkVerseUseCase } from '../../application/use-cases/BookmarkVerseUseCase';
// import { SearchVersesUseCase } from '../../application/use-cases/SearchVersesUseCase';

// Logging
import { ILogger } from '../../domain/services/ILogger';
import { ConsoleLogger } from '../../infrastructure/logging/ConsoleLogger';

// Monitoring
import { HealthCheckService } from '../../infrastructure/monitoring/HealthCheckService';

// Error Tracking
import { ErrorTrackingService } from '../../infrastructure/error-tracking/ErrorTrackingService';

// Types for DI container
export const TYPES = {
  // Domain Services - Temporarily commented for testing
  // BookmarkService: Symbol.for('BookmarkService'),
  // SearchService: Symbol.for('SearchService'),
  // ReadingProgressService: Symbol.for('ReadingProgressService'),

  // Repositories - Temporarily commented for testing
  // IVerseRepository: Symbol.for('IVerseRepository'),
  // ISurahRepository: Symbol.for('ISurahRepository'),
  // IBookmarkRepository: Symbol.for('IBookmarkRepository'),

  // Infrastructure
  QuranApiClient: Symbol.for('QuranApiClient'),
  ICache: Symbol.for('ICache'),
  ILogger: Symbol.for('ILogger'),
  HealthCheckService: Symbol.for('HealthCheckService'),
  ErrorTrackingService: Symbol.for('ErrorTrackingService'),

  // Use Cases - Commented out temporarily
  // ReadVerseUseCase: Symbol.for('ReadVerseUseCase'),
  // BookmarkVerseUseCase: Symbol.for('BookmarkVerseUseCase'),
  // SearchVersesUseCase: Symbol.for('SearchVersesUseCase'),
};

const container = new Container();

// Configure bindings - Basic setup for testing
container.bind<ILogger>(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();

container.bind<ICache>(TYPES.ICache).to(LocalStorageCache).inSingletonScope();

container
  .bind<QuranApiClient>(TYPES.QuranApiClient)
  .toConstantValue(
    new QuranApiClient(
      process.env.NEXT_PUBLIC_API_URL || 'https://api.quran.com/api/v4',
      new FetchHttpClient()
    )
  );

// Repository bindings - Temporarily commented for testing
// container.bind<IVerseRepository>(TYPES.IVerseRepository).to(VerseRepository).inSingletonScope();
// container.bind<ISurahRepository>(TYPES.ISurahRepository).to(SurahRepository).inSingletonScope();
// container.bind<IBookmarkRepository>(TYPES.IBookmarkRepository).to(BookmarkRepository).inSingletonScope();

// Domain service bindings - Temporarily commented for testing
// container.bind<BookmarkService>(TYPES.BookmarkService).to(BookmarkService).inSingletonScope();
// container.bind<SearchService>(TYPES.SearchService).to(SearchService).inSingletonScope();
// container.bind<ReadingProgressService>(TYPES.ReadingProgressService).to(ReadingProgressService).inSingletonScope();

// Use case bindings - Commented out temporarily
// container.bind<ReadVerseUseCase>(TYPES.ReadVerseUseCase).to(ReadVerseUseCase);
// container.bind<BookmarkVerseUseCase>(TYPES.BookmarkVerseUseCase).to(BookmarkVerseUseCase);
// container.bind<SearchVersesUseCase>(TYPES.SearchVersesUseCase).to(SearchVersesUseCase);

// Monitoring bindings - manual instantiation without DI
container
  .bind<HealthCheckService>(TYPES.HealthCheckService)
  .toConstantValue(
    new HealthCheckService(
      container.get<ICache>(TYPES.ICache),
      container.get<ILogger>(TYPES.ILogger)
    )
  );

// Error tracking bindings - manual instantiation without DI
container
  .bind<ErrorTrackingService>(TYPES.ErrorTrackingService)
  .toConstantValue(new ErrorTrackingService(container.get<ILogger>(TYPES.ILogger)));

export { container };
