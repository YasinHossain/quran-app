/**
 * Dependency Injection Module
 *
 * Centralized export for the lightweight container used across the app.
 * Provides clean imports for repositories and shared services.
 *
 * @example
 * ```typescript
 * import { container } from '@/infrastructure/di';
 *
 * const verseRepository = container.getVerseRepository();
 * ```
 */

export { container } from './Container';
export { TYPES, type DITypes, type TypeKeys, type TypeSymbol } from './types';
