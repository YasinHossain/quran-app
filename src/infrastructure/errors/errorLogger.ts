import { ApplicationError } from '@/src/infrastructure/errors/ApplicationError';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { formatError } from './errorFormatter';
import {
  errorHandlerConfig,
  type ErrorHandlerOptions,
  type ErrorReporter,
} from './ErrorHandlerConfig';

function safelyReport(
  reporter: ErrorReporter,
  appError: ApplicationError,
  options: ErrorHandlerOptions
): void {
  try {
    reporter(appError, options.context);
  } catch (reportError) {
    logger.error('[ErrorHandler] Failed to report error', undefined, reportError as Error);
  }
}

export function logError(appError: ApplicationError, options: ErrorHandlerOptions): void {
  const configuredLogger = errorHandlerConfig.getLogger();
  if (configuredLogger) {
    configuredLogger(appError, options.context);
  } else {
    logger.error(formatError(appError), options.context, appError);
  }
}

export function reportError(appError: ApplicationError, options: ErrorHandlerOptions): void {
  if (!appError.isOperational) return;
  const reporter = errorHandlerConfig.getReporter();
  if (reporter) {
    safelyReport(reporter, appError, options);
  }
}
