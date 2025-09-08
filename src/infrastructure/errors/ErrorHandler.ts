/**
 * Centralized Error Handler
 *
 * Provides consistent error handling across the application.
 * Handles logging, user notifications, and error recovery strategies.
 */

import { ApplicationError } from '@/src/infrastructure/errors/ApplicationError';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import {
  errorHandlerConfig,
  type ErrorHandlerOptions,
  type ErrorLogger,
  type ErrorReporter,
  type ErrorNotifier,
} from './ErrorHandlerConfig';
import { notifyError, setRetryCallback } from './errorNotifications';
import { ErrorFactory } from './factory';
import { isApplicationError } from './guards';

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

  private static strategyMap = {
    logError(appError: ApplicationError, options: ErrorHandlerOptions) {
      const configuredLogger = errorHandlerConfig.getLogger();
      if (configuredLogger) {
        configuredLogger(appError, options.context);
      } else {
        logger.error('[ErrorHandler]', options.context, appError);
      }
    },
    reportError(appError: ApplicationError, options: ErrorHandlerOptions) {
      if (!appError.isOperational) return;
      const reporter = errorHandlerConfig.getReporter();
      if (reporter) {
        const execute = (): void => {
          try {
            reporter(appError, options.context);
          } catch (reportError) {
            logger.error('[ErrorHandler] Failed to report error', undefined, reportError as Error);
          }
        };
        execute();
      }
    },
    showUserNotification(appError: ApplicationError) {
      notifyError(appError);
    },
  } as const;

  private static applyStrategies(
    appError: ApplicationError,
    options: ErrorHandlerOptions,
    mode: 'sync' | 'async'
  ): void {
    (Object.keys(ErrorHandler.strategyMap) as Array<keyof typeof ErrorHandler.strategyMap>).forEach(
      (key) => {
        if ((options as Record<string, boolean>)[key]) {
          const handler = ErrorHandler.strategyMap[key];
          if (key === 'reportError' && mode === 'sync') {
            Promise.resolve().then(() => handler(appError, options));
          } else {
            handler(appError, options);
          }
        }
      }
    );
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

    ErrorHandler.applyStrategies(appError, finalOptions, 'async');

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

    ErrorHandler.applyStrategies(appError, finalOptions, 'sync');

    if (finalOptions.rethrow) {
      throw appError;
    }

    return options.fallback;
  }
}
