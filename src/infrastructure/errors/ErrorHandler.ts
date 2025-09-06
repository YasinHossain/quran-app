/**
 * Centralized Error Handler
 *
 * Provides consistent error handling across the application.
 * Handles logging, user notifications, and error recovery strategies.
 */

import { ApplicationError } from './ApplicationError';
import { ErrorFactory } from './factory';
import { isApplicationError } from './guards';
import { logger } from '../monitoring/Logger';
import {
  errorHandlerConfig,
  type ErrorHandlerOptions,
  type ErrorLogger,
  type ErrorReporter,
  type ErrorNotifier,
} from './ErrorHandlerConfig';
import { createNotification, setRetryCallback } from './notifications';

/**
 * Main Error Handler Class
 */
export class ErrorHandler {
  /**
   * Configure global error handler
   */
  static configure({
    logger: log,
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
    if (log) errorHandlerConfig.setLogger(log);
    if (reporter) errorHandlerConfig.setReporter(reporter);
    if (notifier) errorHandlerConfig.setNotifier(notifier);
    if (defaultOptions) errorHandlerConfig.setDefaultOptions(defaultOptions);
    if (retryCallback) setRetryCallback(retryCallback);
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

    if (finalOptions.logError) {
      const configuredLogger = errorHandlerConfig.getLogger();
      if (configuredLogger) {
        configuredLogger(appError, options.context);
      } else {
        logger.error('[ErrorHandler]', options.context, appError);
      }
    }

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

    if (finalOptions.showUserNotification) {
      const notifier = errorHandlerConfig.getNotifier();
      if (notifier) {
        const notification = createNotification(appError);
        try {
          notifier(notification);
        } catch (notifyError) {
          logger.error('[ErrorHandler] Failed to show notification', undefined, notifyError as Error);
        }
      }
    }

    if (finalOptions.rethrow) {
      throw appError;
    }

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

    if (finalOptions.logError) {
      const configuredLogger = errorHandlerConfig.getLogger();
      if (configuredLogger) {
        configuredLogger(appError, options.context);
      } else {
        logger.error('[ErrorHandler]', options.context, appError);
      }
    }

    if (finalOptions.showUserNotification) {
      const notifier = errorHandlerConfig.getNotifier();
      if (notifier) {
        const notification = createNotification(appError);
        try {
          notifier(notification);
        } catch (notifyError) {
          logger.error('[ErrorHandler] Failed to show notification', undefined, notifyError as Error);
        }
      }
    }

    if (finalOptions.reportError && appError.isOperational) {
      const reporter = errorHandlerConfig.getReporter();
      if (reporter) {
        Promise.resolve().then(() => {
          try {
            reporter(appError, options.context);
          } catch (reportError) {
            logger.error('[ErrorHandler] Failed to report error', undefined, reportError as Error);
          }
        });
      }
    }

    if (finalOptions.rethrow) {
      throw appError;
    }

    return options.fallback;
  }
}
