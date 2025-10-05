/**
 * Error Infrastructure Module
 *
 * Centralized exports for all error handling functionality.
 * Provides clean imports for error classes and utilities.
 */

// Error classes
export { ApplicationError } from './ApplicationError';
export * from './types';
export { ErrorFactory } from './factory';

// Type guards
export {
  isApplicationError,
  isNetworkError,
  isValidationError,
  isAuthenticationError,
  isNotFoundError,
  isRateLimitError,
} from './guards';

// Error handler
export { ErrorHandler } from './ErrorHandler';
export {
  errorHandlerConfig,
  type ErrorHandlerOptions,
  type ErrorLogger,
  type ErrorReporter,
  type ErrorNotifier,
} from './ErrorHandlerConfig';
export { type ErrorNotification } from './errorNotifications';
