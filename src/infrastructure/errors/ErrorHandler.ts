/**
 * Centralized Error Handler
 *
 * Provides consistent error handling across the application.
 * Handles logging, user notifications, and error recovery strategies.
 */

import { ApplicationError } from '@/src/infrastructure/errors/ApplicationError';

import {
  errorHandlerConfig,
  type ErrorHandlerOptions,
  type ErrorLogger,
  type ErrorReporter,
  type ErrorNotifier,
} from './ErrorHandlerConfig';
import { logError, reportError } from './errorLogger';
import { mapError } from './errorMapper';
import { notifyError, setRetryCallback } from './errorNotifications';

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

  private static process(
    appError: ApplicationError,
    options: ErrorHandlerOptions,
    mode: 'sync' | 'async'
  ): void {
    if (options.logError) logError(appError, options);
    if (options.reportError) {
      if (mode === 'sync') {
        Promise.resolve().then(() => reportError(appError, options));
      } else {
        reportError(appError, options);
      }
    }
    if (options.showUserNotification) notifyError(appError);
  }

  /**
   * Handle any error with full error processing pipeline
   */
  static async handle(error: unknown, options: ErrorHandlerOptions = {}): Promise<unknown> {
    const appError = mapError(error, options.context);

    const finalOptions = {
      ...errorHandlerConfig.getDefaultOptions(),
      ...options,
    };

    ErrorHandler.process(appError, finalOptions, 'async');

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
    const appError = mapError(error, options.context);

    const finalOptions = {
      ...errorHandlerConfig.getDefaultOptions(),
      ...options,
    };

    ErrorHandler.process(appError, finalOptions, 'sync');

    if (finalOptions.rethrow) {
      throw appError;
    }

    return options.fallback;
  }
}
