import type { ApplicationError } from '../../errors';
import { logger } from '../Logger';
import type { ErrorContext, IErrorTracker } from './types';

export class ConsoleErrorTracker implements IErrorTracker {
  captureError(error: Error | ApplicationError, context?: ErrorContext): void {
    logger.error('[ErrorTracker] Error captured:', context, error);
  }

  captureMessage(message: string, level = 'info', context?: ErrorContext): void {
    const logLevel = level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'info';
    if (logLevel === 'error') {
      logger.error(`[ErrorTracker] Message: ${message}`, context);
    } else if (logLevel === 'warn') {
      logger.warn(`[ErrorTracker] Message: ${message}`, context);
    } else {
      logger.info(`[ErrorTracker] Message: ${message}`, context);
    }
  }

  setUser(user: { id?: string; email?: string; username?: string }): void {
    logger.debug('[ErrorTracker] User set:', { user });
  }

  setContext(key: string, data: Record<string, unknown>): void {
    logger.debug('[ErrorTracker] Context set:', { key, data });
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: string;
    timestamp?: number;
    data?: Record<string, unknown>;
  }): void {
    logger.debug('[ErrorTracker] Breadcrumb added:', { breadcrumb });
  }

  async flush(): Promise<void> {
    // No-op for console tracker
  }
}
