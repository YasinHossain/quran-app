/**
 * Error Infrastructure Module
 *
 * Centralized exports for all error handling functionality.
 * Provides clean imports for error classes and utilities.
 */

// Error classes
export {
  ApplicationError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  NetworkError,
  ApiError,
  RateLimitError,
  StorageError,
  CacheError,
  AudioError,
  ConfigurationError,
  FeatureNotAvailableError,
  TimeoutError,
  ErrorFactory,
} from './ApplicationError';

// Type guards
export {
  isApplicationError,
  isNetworkError,
  isValidationError,
  isAuthenticationError,
  isNotFoundError,
  isRateLimitError,
} from './ApplicationError';

// Error handler
export {
  ErrorHandler,
  handleErrors,
  handleAllErrors,
  config as errorHandlerConfig,
  type ErrorHandlerOptions,
  type ErrorNotification,
  type ErrorLogger,
  type ErrorReporter,
  type ErrorNotifier,
} from './ErrorHandler';
