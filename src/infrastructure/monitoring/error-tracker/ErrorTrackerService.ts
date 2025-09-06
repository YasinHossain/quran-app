import { ConsoleErrorTracker } from './ConsoleErrorTracker';
import { RemoteErrorTracker } from './RemoteErrorTracker';
import { SentryErrorTracker } from './SentryErrorTracker';
import { config } from '../../../../config';

import type { ErrorContext, IErrorTracker } from './types';
import type { ApplicationError } from '../../errors';

export class ErrorTrackerService {
  private static instance: ErrorTrackerService;
  private tracker: IErrorTracker;
  private globalContext: Record<string, unknown> = {};
  private breadcrumbs: Array<unknown> = [];
  private maxBreadcrumbs = 100;

  private constructor() {
    this.tracker = this.createTracker();
    this.setupGlobalHandlers();
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

  private setupGlobalHandlers(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        component: 'global',
        action: 'unhandled_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        component: 'global',
        action: 'unhandled_rejection',
      });
    });
  }

  captureError(error: Error | ApplicationError, context?: ErrorContext): void {
    const enhancedContext: ErrorContext = {
      ...this.globalContext,
      ...context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    if (this.breadcrumbs.length > 0) {
      enhancedContext.metadata = {
        ...enhancedContext.metadata,
        breadcrumbs: this.breadcrumbs.slice(-10),
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

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: string;
    timestamp?: number;
    data?: Record<string, unknown>;
  }): void {
    const enhancedBreadcrumb = {
      timestamp: Date.now() / 1000,
      ...breadcrumb,
    };

    this.breadcrumbs.push(enhancedBreadcrumb);

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }

    this.tracker.addBreadcrumb(enhancedBreadcrumb);
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
