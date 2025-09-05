/**
 * Dependency Injection Decorators
 *
 * Custom decorators for InversifyJS to simplify dependency injection usage.
 * Provides type-safe decorators for common DI patterns.
 *
 * @see https://inversify.io/
 */

import { inject, injectable, interfaces } from 'inversify';

import { TYPES, TypeKeys } from './types';

/**
 * Injectable decorator with automatic registration
 *
 * Marks a class as injectable and available for dependency injection.
 * Use this on all classes that will be injected as dependencies.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class UserService {
 *   // Implementation
 * }
 * ```
 */
export const Injectable = () => injectable();

/**
 * Type-safe inject decorator
 *
 * Injects a dependency using type-safe symbols from TYPES.
 *
 * @param typeKey - Key from TYPES object
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     @Inject('ApiClient') private apiClient: IApiClient,
 *     @Inject('LoggerService') private logger: ILoggerService
 *   ) {}
 * }
 * ```
 */
export const Inject = (typeKey: TypeKeys) => inject(TYPES[typeKey]);

/**
 * Named injection decorator
 *
 * Injects a named dependency when multiple implementations exist.
 *
 * @param typeKey - Key from TYPES object
 * @param name - Named identifier for the specific implementation
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class DataService {
 *   constructor(
 *     @InjectNamed('ApiClient', 'quran') private quranApi: IApiClient,
 *     @InjectNamed('ApiClient', 'tafsir') private tafsirApi: IApiClient
 *   ) {}
 * }
 * ```
 */
export const InjectNamed = (typeKey: TypeKeys, name: string) => {
  return inject(TYPES[typeKey]) && named(name);
};

/**
 * Import named decorator from inversify
 */
export { named } from 'inversify';

/**
 * Lazy injection decorator
 *
 * Injects a factory function that creates the dependency when called.
 * Useful for breaking circular dependencies or delaying expensive object creation.
 *
 * @param typeKey - Key from TYPES object
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CircularService {
 *   constructor(
 *     @LazyInject('OtherService') private getOtherService: () => IOtherService
 *   ) {}
 *
 *   someMethod() {
 *     const otherService = this.getOtherService();
 *     return otherService.doSomething();
 *   }
 * }
 * ```
 */
export const LazyInject = (typeKey: TypeKeys) => {
  return inject(TYPES[typeKey]) && lazyInject(TYPES[typeKey]);
};

/**
 * Import lazyInject from inversify
 */
export { lazyInject } from 'inversify';

/**
 * Optional injection decorator
 *
 * Injects a dependency that may or may not be available.
 * Returns undefined if the dependency cannot be resolved.
 *
 * @param typeKey - Key from TYPES object
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class FeatureService {
 *   constructor(
 *     @OptionalInject('AnalyticsService') private analytics?: IAnalyticsService
 *   ) {}
 *
 *   trackEvent(event: string) {
 *     this.analytics?.track(event);
 *   }
 * }
 * ```
 */
export const OptionalInject = (typeKey: TypeKeys) => {
  return inject(TYPES[typeKey]) && optional();
};

/**
 * Import optional decorator from inversify
 */
export { optional } from 'inversify';

/**
 * Multi-injection decorator
 *
 * Injects all implementations of a given interface as an array.
 * Useful for plugin architectures or when you need all implementations.
 *
 * @param typeKey - Key from TYPES object
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class PluginManager {
 *   constructor(
 *     @MultiInject('Plugin') private plugins: IPlugin[]
 *   ) {}
 *
 *   executeAll() {
 *     this.plugins.forEach(plugin => plugin.execute());
 *   }
 * }
 * ```
 */
export const MultiInject = (typeKey: TypeKeys) => {
  return multiInject(TYPES[typeKey]);
};

/**
 * Import multiInject from inversify
 */
export { multiInject } from 'inversify';

/**
 * Post construct decorator
 *
 * Marks a method to be called after dependency injection is complete.
 * Useful for initialization logic that requires injected dependencies.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class DatabaseService {
 *   constructor(
 *     @Inject('Config') private config: IConfig
 *   ) {}
 *
 *   @PostConstruct()
 *   async initialize() {
 *     await this.connect(this.config.database.url);
 *   }
 * }
 * ```
 */
export { postConstruct as PostConstruct } from 'inversify';

/**
 * Pre destroy decorator
 *
 * Marks a method to be called before the object is garbage collected.
 * Useful for cleanup logic like closing connections or clearing timers.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ConnectionService {
 *   private connection: Connection;
 *
 *   @PreDestroy()
 *   cleanup() {
 *     this.connection?.close();
 *   }
 * }
 * ```
 */
export { preDestroy as PreDestroy } from 'inversify';

/**
 * Factory injection types
 */
export type Factory<T> = () => T;
export type AsyncFactory<T> = () => Promise<T>;
export type FactoryWithArgs<T, Args extends unknown[]> = (...args: Args) => T;

/**
 * Factory decorator helper
 *
 * Creates a factory function for creating instances with parameters.
 *
 * @param typeKey - Key from TYPES object
 * @returns Factory decorator
 *
 * @example
 * ```typescript
 * container.bind<Factory<IService>>('ServiceFactory')
 *   .toFactory<IService>((context: interfaces.Context) => {
 *     return (param: string) => {
 *       const service = context.container.get<IService>(TYPES.Service);
 *       service.configure(param);
 *       return service;
 *     };
 *   });
 * ```
 */
export const createFactory = <T>(typeKey: TypeKeys): interfaces.FactoryCreator<T> => {
  return (context: interfaces.Context) => {
    return () => context.container.get<T>(TYPES[typeKey]);
  };
};
