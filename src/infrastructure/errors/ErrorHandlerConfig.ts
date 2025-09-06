import { ApplicationError } from './ApplicationError';

import type { ErrorNotification } from './errorNotifications';

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

  getDefaultOptions(): Required<Omit<ErrorHandlerOptions, 'context' | 'fallback'>> {
    return this.defaultOptions;
  }
}

export const errorHandlerConfig = new ErrorHandlerConfig();
