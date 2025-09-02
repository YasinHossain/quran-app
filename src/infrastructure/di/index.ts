/**
 * Dependency Injection Module
 *
 * Centralized export for all dependency injection functionality.
 * Provides clean imports for the rest of the application.
 *
 * @example
 * ```typescript
 * import { container, Injectable, Inject, TYPES } from '@/infrastructure/di';
 *
 * @Injectable()
 * export class MyService {
 *   constructor(
 *     @Inject('ApiClient') private apiClient: IApiClient
 *   ) {}
 * }
 * ```
 */

// Container and initialization
export {
  container,
  getContainer,
  initializeContainer,
  resetContainer,
  configureRepositories,
  configureUseCases,
  configureServices,
  configureExternalServices,
  configureMonitoring,
} from './container';

// Type symbols and types
export { TYPES, type DITypes, type TypeKeys, type TypeSymbol } from './types';

// Decorators and utilities
export {
  Injectable,
  Inject,
  InjectNamed,
  LazyInject,
  OptionalInject,
  MultiInject,
  PostConstruct,
  PreDestroy,
  named,
  optional,
  lazyInject,
  multiInject,
  postConstruct,
  preDestroy,
  createFactory,
  type Factory,
  type AsyncFactory,
  type FactoryWithArgs,
} from './decorators';

// Re-export core inversify types that might be useful
export type { Container, interfaces } from 'inversify';
