import { ConsoleErrorTracker } from './ConsoleErrorTracker';
import { RemoteErrorTracker } from './RemoteErrorTracker';
import { SentryErrorTracker } from './SentryErrorTracker';
import { addBreadcrumb as recordBreadcrumb, getBreadcrumbs, setupGlobalHandlers } from './utils';
import { config } from '../../../../config';

import type { ErrorContext, IErrorTracker } from './types';
import type { ApplicationError } from '../../errors';

export class ErrorTrackerService {
  private static instance: ErrorTrackerService;
  private tracker: IErrorTracker;
  private globalContext: Record<string, unknown> = {};
  private constructor() {
    this.tracker = this.createTracker();
    setupGlobalHandlers(this.captureError.bind(this));
  }

  static getInstance(): ErrorTrackerService {
    if (!ErrorTrackerService.instance) {
      ErrorTrackerService.instance = new ErrorTrackerService();
    }
    return ErrorTrackerService.instance;
  }

  private createTracker(): IErrorTracker {
    if (!config.features.enableErrorTracking) {
      return new ConsoleErrorTracker();
    }

    if (config.monitoring.sentry?.dsn) {
      return new SentryErrorTracker();
    }

    const endpoint = process.env.ERROR_TRACKING_ENDPOINT;
    const apiKey = process.env.ERROR_TRACKING_API_KEY;
    if (endpoint) {
      return new RemoteErrorTracker(endpoint, apiKey);
    }

    return new ConsoleErrorTracker();
  }

  captureError(error: Error | ApplicationError, context?: ErrorContext): void {
    const enhancedContext: ErrorContext = {
      ...this.globalContext,
      ...context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    const breadcrumbs = getBreadcrumbs();
    if (breadcrumbs.length > 0) {
      enhancedContext.metadata = {
        ...enhancedContext.metadata,
        breadcrumbs,
      };
    }

    this.tracker.captureError(error, enhancedContext);

    this.addBreadcrumb({
      message: `Error: ${error.message}`,
      category: 'error',
      level: 'error',
      data: { error: error.constructor.name },
    });
  }

  captureMessage(message: string, level = 'info', context?: ErrorContext): void {
    const enhancedContext: ErrorContext = {
      ...this.globalContext,
      ...context,
    };

    this.tracker.captureMessage(message, level, enhancedContext);
  }

  setUser(user: { id?: string; email?: string; username?: string }): void {
    this.tracker.setUser(user);
    this.globalContext.userId = user.id;
  }

  setContext(key: string, data: Record<string, unknown>): void {
    this.tracker.setContext(key, data);
    this.globalContext[key] = data;
  }

  addBreadcrumb(breadcrumb: Parameters<IErrorTracker['addBreadcrumb']>[0]): void {
    recordBreadcrumb(this.tracker, breadcrumb);
  }

  async flush(): Promise<void> {
    await this.tracker.flush();
  }

  createContext(
    component?: string,
    action?: string,
    metadata?: Record<string, unknown>
  ): ErrorContext {
    return {
      component,
      action,
      metadata,
      ...this.globalContext,
    };
  }
}

export const errorTracker = ErrorTrackerService.getInstance();

export type { IErrorTracker, ErrorContext } from './types';
