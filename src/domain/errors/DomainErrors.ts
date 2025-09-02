/**
 * Base domain error class
 */
export abstract class DomainError extends Error {
  public readonly timestamp: Date;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
  }
}

/**
 * Error thrown when a bookmark already exists for a verse
 */
export class BookmarkAlreadyExistsError extends DomainError {
  constructor(userId: string, surahId: number, ayahNumber: number) {
    super(`Bookmark already exists for user ${userId} at verse ${surahId}:${ayahNumber}`);
  }
}

/**
 * Error thrown when a requested verse is not found
 */
export class VerseNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Verse not found: ${identifier}`);
  }
}

/**
 * Error thrown when a requested bookmark is not found
 */
export class BookmarkNotFoundError extends DomainError {
  constructor(bookmarkId: string) {
    super(`Bookmark not found: ${bookmarkId}`);
  }
}

/**
 * Error thrown when a requested Surah is not found
 */
export class SurahNotFoundError extends DomainError {
  constructor(surahId: number) {
    super(`Surah not found: ${surahId}`);
  }
}

/**
 * Error thrown when invalid pagination parameters are provided
 */
export class InvalidPaginationError extends DomainError {
  constructor(message: string) {
    super(`Invalid pagination: ${message}`);
  }
}

/**
 * Error thrown when invalid search criteria are provided
 */
export class InvalidSearchCriteriaError extends DomainError {
  constructor(message: string) {
    super(`Invalid search criteria: ${message}`);
  }
}

/**
 * Error thrown when unauthorized access is attempted
 */
export class UnauthorizedAccessError extends DomainError {
  constructor(message: string) {
    super(`Unauthorized access: ${message}`);
  }
}
