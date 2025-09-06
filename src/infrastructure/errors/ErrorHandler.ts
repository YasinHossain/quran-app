/* eslint-disable max-lines */
/**
 * Centralized Error Handler
 *
 * Provides consistent error handling across the application.
 * Handles logging, user notifications, and error recovery strategies.
 */

import { ApplicationError, ErrorFactory, isApplicationError } from './ApplicationError';
import { logger } from '../monitoring/Logger';

/**
 * Error handling options
 */
export interface ErrorHandlerOptions {
  /** Whether to show user-friendly notifications */
  showUserNotification?: boolean;
  /** Whether to log the error */
  logError?: boolean;
  /** Whether to report error to monitoring service */
  reportError?: boolean;
  /** Additional context for error handling */
  context?: Record<string, unknown>;
  /** Fallback value to return */
  fallback?: unknown;
  /** Whether to rethrow the error after handling */
  rethrow?: boolean;
}

/**
 * Error notification interface
 */
export interface ErrorNotification {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

/**
 * Error handler callback types
 */
export type ErrorLogger = (error: ApplicationError, context?: Record<string, unknown>) => void;
export type ErrorReporter = (error: ApplicationError, context?: Record<string, unknown>) => void;
export type ErrorNotifier = (notification: ErrorNotification) => void;

/**
 * Global Error Handler Configuration
 */
class ErrorHandlerConfig {
  private logger?: ErrorLogger;
  private reporter?: ErrorReporter;
  private notifier?: ErrorNotifier;
  private retryCallback: () => void = () => {};
  private defaultOptions: Required<Omit<ErrorHandlerOptions, 'context' | 'fallback'>> = {
    showUserNotification: true,
    logError: true,
    reportError: true,
    rethrow: false,
  };

  setLogger(logger: ErrorLogger): void {
    this.logger = logger;
  }

  setReporter(reporter: ErrorReporter): void {
    this.reporter = reporter;
  }

  setNotifier(notifier: ErrorNotifier): void {
    this.notifier = notifier;
  }

  setRetryCallback(callback: () => void): void {
    this.retryCallback = callback;
  }

  setDefaultOptions(options: Partial<ErrorHandlerOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  getLogger(): ErrorLogger | undefined {
    return this.logger;
  }

  getReporter(): ErrorReporter | undefined {
    return this.reporter;
  }

  getNotifier(): ErrorNotifier | undefined {
    return this.notifier;
  }

  getRetryCallback(): () => void {
    return this.retryCallback;
  }

  getDefaultOptions(): Required<Omit<ErrorHandlerOptions, 'context' | 'fallback'>> {
    return this.defaultOptions;
  }
}

const errorHandlerConfig = new ErrorHandlerConfig();

/**
 * Main Error Handler Class
 */
export class ErrorHandler {
  /**
   * Configure global error handler
   */
  static configure({
    logger,
    reporter,
    notifier,
    defaultOptions,
    retryCallback,
  }: {
    logger?: ErrorLogger;
    reporter?: ErrorReporter;
    notifier?: ErrorNotifier;
    defaultOptions?: Partial<ErrorHandlerOptions>;
    retryCallback?: () => void;
  }): void {
    if (logger) errorHandlerConfig.setLogger(logger);
    if (reporter) errorHandlerConfig.setReporter(reporter);
    if (notifier) errorHandlerConfig.setNotifier(notifier);
    if (defaultOptions) errorHandlerConfig.setDefaultOptions(defaultOptions);
    if (retryCallback) errorHandlerConfig.setRetryCallback(retryCallback);
  }

  /**
   * Handle any error with full error processing pipeline
   */
  static async handle(error: unknown, options: ErrorHandlerOptions = {}): Promise<unknown> {
    const appError = isApplicationError(error)
      ? error
      : ErrorFactory.fromUnknownError(error, options.context);

    const finalOptions = {
      ...errorHandlerConfig.getDefaultOptions(),
      ...options,
    };

    // Log error
    if (finalOptions.logError) {
      const configuredLogger = errorHandlerConfig.getLogger();
      if (configuredLogger) {
        configuredLogger(appError, options.context);
      } else {
        logger.error('[ErrorHandler]', options.context, appError);
      }
    }

    // Report error to monitoring service
    if (finalOptions.reportError && appError.isOperational) {
      const reporter = errorHandlerConfig.getReporter();
      if (reporter) {
        try {
          reporter(appError, options.context);
        } catch (reportError) {
          logger.error('[ErrorHandler] Failed to report error', undefined, reportError as Error);
        }
      }
    }

    // Show user notification
    if (finalOptions.showUserNotification) {
      const notifier = errorHandlerConfig.getNotifier();
      if (notifier) {
        const notification = ErrorHandler.createNotification(appError);
        try {
          notifier(notification);
        } catch (notifyError) {
          logger.error(
            '[ErrorHandler] Failed to show notification',
            undefined,
            notifyError as Error
          );
        }
      }
    }

    // Rethrow if requested
    if (finalOptions.rethrow) {
      throw appError;
    }

    // Return fallback value
    return options.fallback;
  }

  /**
   * Handle error without throwing (safe wrapper)
   */
  static async handleSafe<T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions & { fallback: T }
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      return (await ErrorHandler.handle(error, { ...options, rethrow: false })) as T;
    }
  }

  /**
   * Handle error synchronously
   */
  static handleSync(error: unknown, options: ErrorHandlerOptions = {}): unknown {
    const appError = isApplicationError(error)
      ? error
      : ErrorFactory.fromUnknownError(error, options.context);

    const finalOptions = {
      ...errorHandlerConfig.getDefaultOptions(),
      ...options,
    };

    // Log error synchronously
    if (finalOptions.logError) {
      const configuredLogger = errorHandlerConfig.getLogger();
      if (configuredLogger) {
        configuredLogger(appError, options.context);
      } else {
        logger.error('[ErrorHandler]', options.context, appError);
      }
    }

    // Show user notification
    if (finalOptions.showUserNotification) {
      const notifier = errorHandlerConfig.getNotifier();
      if (notifier) {
        const notification = ErrorHandler.createNotification(appError);
        try {
          notifier(notification);
        } catch (notifyError) {
          logger.error(
            '[ErrorHandler] Failed to show notification',
            undefined,
            notifyError as Error
          );
        }
      }
    }

    // Report error asynchronously to avoid blocking
    if (finalOptions.reportError && appError.isOperational) {
      const reporter = errorHandlerConfig.getReporter();
      if (reporter) {
        // Fire and forget - don't block on error reporting
        Promise.resolve().then(() => {
          try {
            reporter(appError, options.context);
          } catch (reportError) {
            logger.error('[ErrorHandler] Failed to report error', undefined, reportError as Error);
          }
        });
      }
    }

    // Rethrow if requested
    if (finalOptions.rethrow) {
      throw appError;
    }

    // Return fallback value
    return options.fallback;
  }

  /**
   * Create user notification from error
   */
  static createNotification(error: ApplicationError): ErrorNotification {
    const baseNotification: ErrorNotification = {
      title: 'Error',
      message: error.getUserMessage(),
      type: 'error',
      duration: 5000,
    };

    // Customize notification based on error type
    switch (error.code) {
      case 'NETWORK_ERROR':
        return {
          ...baseNotification,
          title: 'Connection Error',
          actions: [
            {
              label: 'Retry',
              action: () => errorHandlerConfig.getRetryCallback()(),
            },
          ],
        };

      case 'VALIDATION_ERROR':
        return {
          ...baseNotification,
          title: 'Validation Error',
          type: 'warning',
          duration: 3000,
        };

      case 'AUTHENTICATION_ERROR':
        return {
          ...baseNotification,
          title: 'Authentication Required',
          actions: [
            {
              label: 'Sign In',
              action: () => {
                // Handle sign in redirect
                logger.info('Redirect to sign in');
              },
            },
          ],
        };

      case 'NOT_FOUND':
        return {
          ...baseNotification,
          title: 'Not Found',
          type: 'info',
          duration: 3000,
        };

      case 'RATE_LIMIT_ERROR':
        return {
          ...baseNotification,
          title: 'Rate Limit Exceeded',
          type: 'warning',
          duration: 8000,
        };

      case 'AUDIO_ERROR':
        return {
          ...baseNotification,
          title: 'Audio Error',
          actions: [
            {
              label: 'Try Again',
              action: () => {
                // Handle audio retry
                logger.info('Retry audio playback');
              },
            },
          ],
        };

      default:
        return baseNotification;
    }
  }

  /**
   * Create error boundary handler
   */
  static createBoundaryHandler(componentName: string) {
    return (error: Error, errorInfo: { componentStack: string }) => {
      const appError = ErrorFactory.fromUnknownError(error, {
        component: componentName,
        componentStack: errorInfo.componentStack,
      });

      ErrorHandler.handle(appError, {
        showUserNotification: true,
        logError: true,
        reportError: true,
        rethrow: false,
      });
    };
  }

  /**
   * Create promise rejection handler
   */
  static createUnhandledRejectionHandler() {
    return (event: PromiseRejectionEvent) => {
      const error = ErrorFactory.fromUnknownError(event.reason, {
        source: 'unhandledRejection',
        promise: event.promise,
      });

      ErrorHandler.handle(error, {
        showUserNotification: false, // Don't spam user with unhandled rejections
        logError: true,
        reportError: true,
        rethrow: false,
      });
    };
  }

  /**
   * Create global error handler
   */
  static createGlobalErrorHandler() {
    return (event: ErrorEvent) => {
      const error = ErrorFactory.fromUnknownError(event.error || new Error(event.message), {
        source: 'globalError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });

      ErrorHandler.handle(error, {
        showUserNotification: false, // Don't spam user with global errors
        logError: true,
        reportError: true,
        rethrow: false,
      });
    };
  }
}

/**
 * Error handling decorators
 */

/**
 * Method decorator for automatic error handling
 */
export function handleErrors(options: ErrorHandlerOptions = {}) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        return await ErrorHandler.handle(error, {
          ...options,
          context: {
            ...options.context,
            method: `${(target as { constructor: { name: string } }).constructor.name}.${propertyKey}`,
            args: args.length > 0 ? 'provided' : 'none',
          },
        });
      }
    };

    return descriptor;
  };
}

/**
 * Class decorator for error handling on all methods
 */
export function handleAllErrors(options: ErrorHandlerOptions = {}) {
  return function <T extends { new (...args: unknown[]): object }>(constructor: T) {
    const prototype = constructor.prototype;
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => name !== 'constructor' && typeof prototype[name] === 'function'
    );

    methodNames.forEach((methodName) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
      if (descriptor && descriptor.value) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: unknown[]) {
          try {
            return await originalMethod.apply(this, args);
          } catch (error) {
            return await ErrorHandler.handle(error, {
              ...options,
              context: {
                ...options.context,
                class: constructor.name,
                method: methodName,
              },
            });
          }
        };

        Object.defineProperty(prototype, methodName, descriptor);
      }
    });

    return constructor;
  };
}

// Export the configured handler instance
export { errorHandlerConfig as config };
