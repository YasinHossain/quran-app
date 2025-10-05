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

// Container
export { container } from './Container';

// Type symbols and types
export { TYPES, type DITypes, type TypeKeys, type TypeSymbol } from './types';

// Decorators and utilities
export {
  Injectable,
  Inject,
  InjectNamed,
  OptionalInject,
  MultiInject,
  PostConstruct,
  PreDestroy,
  named,
  optional,
  multiInject,
  postConstruct,
  preDestroy,
} from './decorators';

// Note: We avoid re-exporting inversify internals to prevent version coupling
