/**
 * Base class for all domain-specific errors.
 * Provides common error properties and behavior.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts the error to a plain object for serialization
   */
  toPlainObject() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      cause: this.cause?.message,
      stack: this.stack,
    };
  }
}

/**
 * Error thrown when a verse is not found
 */
export class VerseNotFoundError extends DomainError {
  readonly code = 'VERSE_NOT_FOUND';
  readonly statusCode = 404;

  constructor(surahId: number, ayahNumber: number, cause?: Error) {
    super(`Verse ${surahId}:${ayahNumber} not found`, cause);
  }
}

/**
 * Error thrown when a Surah is not found
 */
export class SurahNotFoundError extends DomainError {
  readonly code = 'SURAH_NOT_FOUND';
  readonly statusCode = 404;

  constructor(surahId: number, cause?: Error) {
    super(`Surah ${surahId} not found`, cause);
  }
}

/**
 * Error thrown when a bookmark is not found
 */
export class BookmarkNotFoundError extends DomainError {
  readonly code = 'BOOKMARK_NOT_FOUND';
  readonly statusCode = 404;

  constructor(bookmarkId: string, cause?: Error) {
    super(`Bookmark ${bookmarkId} not found`, cause);
  }
}

/**
 * Error thrown when attempting to create a bookmark that already exists
 */
export class BookmarkAlreadyExistsError extends DomainError {
  readonly code = 'BOOKMARK_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when invalid verse reference is provided
 */
export class InvalidVerseReferenceError extends DomainError {
  readonly code = 'INVALID_VERSE_REFERENCE';
  readonly statusCode = 400;

  constructor(reference: string, cause?: Error) {
    super(`Invalid verse reference: ${reference}`, cause);
  }
}

/**
 * Error thrown when invalid Surah ID is provided
 */
export class InvalidSurahIdError extends DomainError {
  readonly code = 'INVALID_SURAH_ID';
  readonly statusCode = 400;

  constructor(surahId: number, cause?: Error) {
    super(`Invalid Surah ID: ${surahId}. Must be between 1 and 114.`, cause);
  }
}

/**
 * Error thrown when invalid Ayah number is provided
 */
export class InvalidAyahNumberError extends DomainError {
  readonly code = 'INVALID_AYAH_NUMBER';
  readonly statusCode = 400;

  constructor(ayahNumber: number, maxAyah: number, cause?: Error) {
    super(`Invalid Ayah number: ${ayahNumber}. Must be between 1 and ${maxAyah}.`, cause);
  }
}

/**
 * Error thrown when translation is not found
 */
export class TranslationNotFoundError extends DomainError {
  readonly code = 'TRANSLATION_NOT_FOUND';
  readonly statusCode = 404;

  constructor(translationId: number, cause?: Error) {
    super(`Translation ${translationId} not found`, cause);
  }
}

/**
 * Error thrown when audio is not found
 */
export class AudioNotFoundError extends DomainError {
  readonly code = 'AUDIO_NOT_FOUND';
  readonly statusCode = 404;

  constructor(verseId: string, reciterId: string, cause?: Error) {
    super(`Audio not found for verse ${verseId} with reciter ${reciterId}`, cause);
  }
}

/**
 * Error thrown when user is not authorized for an operation
 */
export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;

  constructor(message: string = 'Unauthorized operation', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when user is forbidden from performing an operation
 */
export class ForbiddenError extends DomainError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;

  constructor(message: string = 'Forbidden operation', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(field: string, value: any, reason: string, cause?: Error) {
    super(`Validation failed for field '${field}' with value '${value}': ${reason}`, cause);
  }
}

/**
 * Error thrown when business rules are violated
 */
export class BusinessRuleViolationError extends DomainError {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  readonly statusCode = 422;

  constructor(rule: string, details?: string, cause?: Error) {
    const message = details ? `${rule}: ${details}` : rule;
    super(`Business rule violation: ${message}`, cause);
  }
}

/**
 * Error thrown when external service is unavailable
 */
export class ServiceUnavailableError extends DomainError {
  readonly code = 'SERVICE_UNAVAILABLE';
  readonly statusCode = 503;

  constructor(service: string, cause?: Error) {
    super(`Service ${service} is currently unavailable`, cause);
  }
}

/**
 * Error thrown when rate limiting is exceeded
 */
export class RateLimitExceededError extends DomainError {
  readonly code = 'RATE_LIMIT_EXCEEDED';
  readonly statusCode = 429;

  constructor(limit: number, window: string, cause?: Error) {
    super(`Rate limit exceeded: ${limit} requests per ${window}`, cause);
  }
}

/**
 * Error thrown when data is corrupted
 */
export class DataCorruptionError extends DomainError {
  readonly code = 'DATA_CORRUPTION';
  readonly statusCode = 500;

  constructor(entity: string, id: string, cause?: Error) {
    super(`Data corruption detected for ${entity} with ID ${id}`, cause);
  }
}

/**
 * Error thrown when concurrent modification conflicts occur
 */
export class ConcurrencyConflictError extends DomainError {
  readonly code = 'CONCURRENCY_CONFLICT';
  readonly statusCode = 409;

  constructor(entity: string, id: string, cause?: Error) {
    super(`Concurrency conflict for ${entity} with ID ${id}`, cause);
  }
}

/**
 * Type guard to check if an error is a domain error
 */
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}

/**
 * Type guard to check if an error is a specific domain error type
 */
export function isErrorOfType<T extends DomainError>(
  error: unknown,
  ErrorClass: new (...args: any[]) => T
): error is T {
  return error instanceof ErrorClass;
}
