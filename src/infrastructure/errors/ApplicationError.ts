/* eslint-disable max-lines */
/**
 * Application Error Classes
 *
 * Centralized error handling with custom error types for different scenarios.
 * Provides structured error information for better debugging and user experience.
 */

/**
 * Base Application Error
 *
 * All custom application errors should extend from this base class.
 * Provides consistent error structure and metadata.
 */
export class ApplicationError extends Error {
  public readonly timestamp: Date;
  public readonly stackTrace?: string;

  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: Error
  ) {
    super(message);

    // Maintain proper stack trace for V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.stackTrace = this.stack;
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      cause: this.cause?.message,
      stack: this.stackTrace,
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    // Override in subclasses for user-specific messages
    return this.message;
  }
}

/**
 * Validation Error
 *
 * Thrown when user input or data validation fails.
 */
export class ValidationError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'VALIDATION_ERROR', 400, true, context, cause);
  }

  getUserMessage(): string {
    return 'Please check your input and try again.';
  }
}

/**
 * Authentication Error
 *
 * Thrown when user authentication fails.
 */
export class AuthenticationError extends ApplicationError {
  constructor(
    message: string = 'Authentication required',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'AUTHENTICATION_ERROR', 401, true, context, cause);
  }

  getUserMessage(): string {
    return 'Please sign in to continue.';
  }
}

/**
 * Authorization Error
 *
 * Thrown when user lacks permissions for an action.
 */
export class AuthorizationError extends ApplicationError {
  constructor(
    message: string = 'Insufficient permissions',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'AUTHORIZATION_ERROR', 403, true, context, cause);
  }

  getUserMessage(): string {
    return 'You do not have permission to perform this action.';
  }
}

/**
 * Not Found Error
 *
 * Thrown when a requested resource is not found.
 */
export class NotFoundError extends ApplicationError {
  constructor(resource: string, context?: Record<string, unknown>, cause?: Error) {
    const message = `${resource} not found`;
    super(message, 'NOT_FOUND', 404, true, { resource, ...context }, cause);
  }

  getUserMessage(): string {
    const resource = this.context?.resource || 'Resource';
    return `${resource} could not be found.`;
  }
}

/**
 * Conflict Error
 *
 * Thrown when a resource conflict occurs (e.g., duplicate entries).
 */
export class ConflictError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CONFLICT_ERROR', 409, true, context, cause);
  }

  getUserMessage(): string {
    return 'This action conflicts with existing data.';
  }
}

/**
 * Network Error
 *
 * Thrown when network or API communication fails.
 */
export class NetworkError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'NETWORK_ERROR', 503, true, context, cause);
  }

  getUserMessage(): string {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
}

/**
 * API Error
 *
 * Thrown when external API calls fail with specific error responses.
 */
export class ApiError extends ApplicationError {
  constructor(
    message: string,
    public readonly endpoint: string,
    statusCode: number = 500,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'API_ERROR', statusCode, true, { endpoint, ...context }, cause);
  }

  getUserMessage(): string {
    if (this.statusCode >= 400 && this.statusCode < 500) {
      return 'There was an issue with your request. Please try again.';
    }
    return 'The service is temporarily unavailable. Please try again later.';
  }
}

/**
 * Rate Limit Error
 *
 * Thrown when API rate limits are exceeded.
 */
export class RateLimitError extends ApplicationError {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, true, { retryAfter, ...context }, cause);
  }

  getUserMessage(): string {
    const waitTime = this.retryAfter ? ` Please wait ${this.retryAfter} seconds.` : '';
    return `Too many requests.${waitTime}`;
  }
}

/**
 * Storage Error
 *
 * Thrown when local storage operations fail.
 */
export class StorageError extends ApplicationError {
  constructor(
    message: string,
    public readonly storageType: 'localStorage' | 'indexedDB' | 'memory',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'STORAGE_ERROR', 500, true, { storageType, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Failed to save data locally. Please try again.';
  }
}

/**
 * Cache Error
 *
 * Thrown when cache operations fail.
 */
export class CacheError extends ApplicationError {
  constructor(
    message: string,
    public readonly operation: 'get' | 'set' | 'delete' | 'clear',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'CACHE_ERROR', 500, true, { operation, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Cache operation failed. This may affect performance but functionality should continue.';
  }
}

/**
 * Audio Error
 *
 * Thrown when audio playback fails.
 */
export class AudioError extends ApplicationError {
  constructor(
    message: string,
    public readonly audioUrl?: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'AUDIO_ERROR', 500, true, { audioUrl, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Audio playback failed. Please check your connection and try again.';
  }
}

/**
 * Configuration Error
 *
 * Thrown when application configuration is invalid.
 * This is typically a programming error, not user error.
 */
export class ConfigurationError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CONFIGURATION_ERROR', 500, false, context, cause);
  }

  getUserMessage(): string {
    return 'Application configuration error. Please contact support.';
  }
}

/**
 * Feature Not Available Error
 *
 * Thrown when a requested feature is not available (e.g., due to feature flags).
 */
export class FeatureNotAvailableError extends ApplicationError {
  constructor(featureName: string, context?: Record<string, unknown>, cause?: Error) {
    const message = `Feature '${featureName}' is not available`;
    super(message, 'FEATURE_NOT_AVAILABLE', 503, true, { featureName, ...context }, cause);
  }

  getUserMessage(): string {
    return 'This feature is currently unavailable.';
  }
}

/**
 * Timeout Error
 *
 * Thrown when operations exceed timeout limits.
 */
export class TimeoutError extends ApplicationError {
  constructor(
    message: string,
    public readonly timeoutMs: number,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'TIMEOUT_ERROR', 408, true, { timeoutMs, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Operation timed out. Please try again.';
  }
}

/**
 * Error Type Guards
 */
export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

/**
 * Error Factory Functions
 */
export const ErrorFactory = {
  /**
   * Create appropriate error from HTTP response
   */
  fromHttpStatus(
    status: number,
    message: string,
    context?: Record<string, unknown>
  ): ApplicationError {
    switch (true) {
      case status === 400:
        return new ValidationError(message, context);
      case status === 401:
        return new AuthenticationError(message, context);
      case status === 403:
        return new AuthorizationError(message, context);
      case status === 404:
        return new NotFoundError(message || 'Resource', context);
      case status === 409:
        return new ConflictError(message, context);
      case status === 429:
        return new RateLimitError(message, undefined, context);
      case status >= 500:
        return new ApiError(message, context?.endpoint || 'unknown', status, context);
      default:
        return new ApplicationError(message, 'HTTP_ERROR', status, true, context);
    }
  },

  /**
   * Create error from network failure
   */
  fromNetworkFailure(message: string, endpoint?: string, cause?: Error): NetworkError {
    return new NetworkError(message, { endpoint }, cause);
  },

  /**
   * Create error from unknown error
   */
  fromUnknownError(error: unknown, context?: Record<string, unknown>): ApplicationError {
    if (isApplicationError(error)) {
      return error;
    }

    const message = error?.message || 'Unknown error occurred';
    const cause = error instanceof Error ? error : undefined;

    return new ApplicationError(message, 'UNKNOWN_ERROR', 500, false, context, cause);
  },
};
