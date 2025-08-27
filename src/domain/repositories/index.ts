/**
 * Repository Interfaces Index
 *
 * Centralized exports for all repository interfaces.
 * These define the contracts for data persistence and retrieval.
 */

export type { IBookmarkRepository } from './IBookmarkRepository';

export type {
  IVerseRepository,
  VerseQuery,
  PaginationOptions,
  PaginatedResult,
} from './IVerseRepository';

export type { ISettingsRepository } from './ISettingsRepository';

export type { IAudioRepository } from './IAudioRepository';

export type { IThemeRepository } from './IThemeRepository';
