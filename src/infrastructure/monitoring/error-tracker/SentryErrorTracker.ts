import type { ApplicationError } from '../../errors';
import { logger } from '../Logger';
import { ConsoleErrorTracker } from './ConsoleErrorTracker';
import type { ErrorContext, IErrorTracker } from './types';

interface SentryLike {
  withScope: (callback: (scope: SentryScope) => void) => void;
  captureException: (error: Error) => void;
  captureMessage: (message: string, level?: string) => void;
  setUser: (user: { id?: string; email?: string; username?: string }) => void;
  setContext: (key: string, data: Record<string, unknown>) => void;
  addBreadcrumb: (breadcrumb: Record<string, unknown>) => void;
  flush: (timeout?: number) => Promise<boolean>;
}

interface SentryScope {
  setUser: (user: { id?: string }) => void;
  setLevel: (level: string) => void;
  setTag: (key: string, value: string) => void;
  setFingerprint: (fingerprint: string[]) => void;
  setContext: (key: string, data: Record<string, unknown>) => void;
}

export class SentryErrorTracker implements IErrorTracker {
  private isEnabled = false;
  private sentry: SentryLike | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Dynamically import Sentry if available
      this.sentry = (await import('@sentry/nextjs')) as SentryLike;
      this.isEnabled = true;

      logger.info('Sentry error tracker initialized');
    } catch {
      logger.warn('Sentry not available, falling back to console error tracking');
      this.isEnabled = false;
    }
  }

  captureError(error: Error | ApplicationError, context?: ErrorContext): void {
    if (!this.isEnabled || !this.sentry) {
      // Fallback to console
      new ConsoleErrorTracker().captureError(error, context);
      return;
    }

    this.sentry.withScope((scope: SentryScope) => {
      if (context) {
        if (context.userId) scope.setUser({ id: context.userId });
        if (context.level) scope.setLevel(context.level);
        if (context.tags) {
          Object.entries(context.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        if (context.fingerprint) scope.setFingerprint(context.fingerprint);
        if (context.component) scope.setTag('component', context.component);
        if (context.action) scope.setTag('action', context.action);
        if (context.metadata) {
          scope.setContext('metadata', context.metadata);
        }
      }

      this.sentry!.captureException(error);
    });
  }

  captureMessage(message: string, level = 'info', context?: ErrorContext): void {
    if (!this.isEnabled || !this.sentry) {
      // Fallback to console
      new ConsoleErrorTracker().captureMessage(message, level, context);
      return;
    }

    this.sentry.withScope((scope: SentryScope) => {
      if (context) {
        if (context.userId) scope.setUser({ id: context.userId });
        if (context.tags) {
          Object.entries(context.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        if (context.metadata) {
          scope.setContext('metadata', context.metadata);
        }
      }

      this.sentry!.captureMessage(message, level);
    });
  }

  setUser(user: { id?: string; email?: string; username?: string }): void {
    if (!this.isEnabled || !this.sentry) return;

    this.sentry.setUser(user);
  }

  setContext(key: string, data: Record<string, unknown>): void {
    if (!this.isEnabled || !this.sentry) return;

    this.sentry.setContext(key, data);
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: string;
    timestamp?: number;
    data?: Record<string, unknown>;
  }): void {
    if (!this.isEnabled || !this.sentry) return;

    this.sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'default',
      level: breadcrumb.level || 'info',
      timestamp: breadcrumb.timestamp || Date.now() / 1000,
      data: breadcrumb.data,
    });
  }

  async flush(): Promise<void> {
    if (!this.isEnabled || !this.sentry) return;

    try {
      await this.sentry.flush(5000); // 5 second timeout
    } catch (error) {
      logger.warn('Failed to flush Sentry errors:', error);
    }
  }
}
