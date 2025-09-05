/**
 * Error Tracking Service
 *
 * Provides error tracking and monitoring capabilities.
 * Supports multiple providers (Sentry, custom endpoints) based on configuration.
 */

import { config } from '../../../config';
import { fetchWithTimeout } from '../../../lib/api/client';
import { ApplicationError, isApplicationError } from '../errors';
import { logger } from './Logger';

/**
 * Error context for tracking
 */
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  url?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  tags?: Record<string, string>;
  fingerprint?: string[];
  level?: 'fatal' | 'error' | 'warning' | 'info';
}

/**
 * Sentry-like interface for type safety
 */
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

/**
 * Error tracking provider interface
 */
export interface IErrorTracker {
  captureError(error: Error | ApplicationError, context?: ErrorContext): void;
  captureMessage(message: string, level?: string, context?: ErrorContext): void;
  setUser(user: { id?: string; email?: string; username?: string }): void;
  setContext(key: string, data: Record<string, unknown>): void;
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: string;
    timestamp?: number;
    data?: Record<string, unknown>;
  }): void;
  flush(): Promise<void>;
}

/**
 * Console error tracker (development/fallback)
 */
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

/**
 * Sentry error tracker implementation
 *
 * Note: This is a placeholder that would integrate with @sentry/nextjs
 * when the package is installed and configured.
 */
export class SentryErrorTracker implements IErrorTracker {
  private isEnabled: boolean = false;
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

      this.sentry.captureException(error);
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

      this.sentry.captureMessage(message, level);
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

/**
 * Remote error tracker for custom endpoints
 */
export class RemoteErrorTracker implements IErrorTracker {
  private endpoint: string;
  private apiKey?: string;
  private buffer: Array<{
    type: 'error' | 'message';
    data: unknown;
    timestamp: number;
  }> = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(endpoint: string, apiKey?: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;

    // Auto-flush every 30 seconds
    if (typeof window === 'undefined') {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, 30000);
    }
  }

  captureError(error: Error | ApplicationError, context?: ErrorContext): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...(isApplicationError(error)
        ? {
            code: error.code,
            statusCode: error.statusCode,
            isOperational: error.isOperational,
            context: error.context,
          }
        : {}),
      trackingContext: context,
    };

    this.buffer.push({
      type: 'error',
      data: errorData,
      timestamp: Date.now(),
    });

    // Flush immediately for fatal errors
    if (context?.level === 'fatal') {
      this.flush();
    }
  }

  captureMessage(message: string, level = 'info', context?: ErrorContext): void {
    this.buffer.push({
      type: 'message',
      data: {
        message,
        level,
        context,
      },
      timestamp: Date.now(),
    });
  }

  setUser(user: { id?: string; email?: string; username?: string }): void {
    // Store user context for future events
    this.buffer.push({
      type: 'message',
      data: {
        message: 'User context set',
        level: 'info',
        context: { user },
      },
      timestamp: Date.now(),
    });
  }

  setContext(key: string, data: Record<string, unknown>): void {
    // Store context for future events
    this.buffer.push({
      type: 'message',
      data: {
        message: `Context set: ${key}`,
        level: 'info',
        context: { [key]: data },
      },
      timestamp: Date.now(),
    });
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: string;
    timestamp?: number;
    data?: Record<string, unknown>;
  }): void {
    this.buffer.push({
      type: 'message',
      data: {
        message: `Breadcrumb: ${breadcrumb.message}`,
        level: 'info',
        context: { breadcrumb },
      },
      timestamp: Date.now(),
    });
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    try {
      await fetchWithTimeout(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ events }),
        errorPrefix: 'Failed to send error tracking data',
      });
    } catch (error) {
      logger.warn('Failed to send error tracking data', undefined, error as Error);
      // Re-add events to buffer for retry
      this.buffer.unshift(...events);
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

/**
 * Main Error Tracker Service
 */
export class ErrorTrackerService {
  private static instance: ErrorTrackerService;
  private tracker: IErrorTracker;
  private globalContext: Record<string, unknown> = {};
  private breadcrumbs: Array<unknown> = [];
  private maxBreadcrumbs = 100;

  constructor() {
    this.tracker = this.createTracker();
    this.setupGlobalHandlers();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ErrorTrackerService {
    if (!ErrorTrackerService.instance) {
      ErrorTrackerService.instance = new ErrorTrackerService();
    }
    return ErrorTrackerService.instance;
  }

  /**
   * Create appropriate error tracker based on configuration
   */
  private createTracker(): IErrorTracker {
    if (!config.features.enableErrorTracking) {
      return new ConsoleErrorTracker();
    }

    // Try Sentry first if configured
    if (config.monitoring.sentry?.dsn) {
      return new SentryErrorTracker();
    }

    // Try remote endpoint if configured
    const endpoint = process.env.ERROR_TRACKING_ENDPOINT;
    const apiKey = process.env.ERROR_TRACKING_API_KEY;
    if (endpoint) {
      return new RemoteErrorTracker(endpoint, apiKey);
    }

    // Fallback to console
    return new ConsoleErrorTracker();
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers(): void {
    if (typeof window === 'undefined') return;

    // Global error handler
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

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        component: 'global',
        action: 'unhandled_rejection',
      });
    });
  }

  /**
   * Capture an error
   */
  captureError(error: Error | ApplicationError, context?: ErrorContext): void {
    const enhancedContext: ErrorContext = {
      ...this.globalContext,
      ...context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    // Add recent breadcrumbs to context
    if (this.breadcrumbs.length > 0) {
      enhancedContext.metadata = {
        ...enhancedContext.metadata,
        breadcrumbs: this.breadcrumbs.slice(-10), // Last 10 breadcrumbs
      };
    }

    this.tracker.captureError(error, enhancedContext);

    // Add this error as a breadcrumb for future events
    this.addBreadcrumb({
      message: `Error: ${error.message}`,
      category: 'error',
      level: 'error',
      data: { error: error.constructor.name },
    });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level = 'info', context?: ErrorContext): void {
    const enhancedContext: ErrorContext = {
      ...this.globalContext,
      ...context,
    };

    this.tracker.captureMessage(message, level, enhancedContext);
  }

  /**
   * Set user context
   */
  setUser(user: { id?: string; email?: string; username?: string }): void {
    this.tracker.setUser(user);
    this.globalContext.userId = user.id;
  }

  /**
   * Set global context
   */
  setContext(key: string, data: Record<string, unknown>): void {
    this.tracker.setContext(key, data);
    this.globalContext[key] = data;
  }

  /**
   * Add breadcrumb
   */
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

    // Keep only recent breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }

    this.tracker.addBreadcrumb(enhancedBreadcrumb);
  }

  /**
   * Flush all pending events
   */
  async flush(): Promise<void> {
    await this.tracker.flush();
  }

  /**
   * Create error context helper
   */
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

// Export singleton instance
export const errorTracker = ErrorTrackerService.getInstance();

// Export types
export type { IErrorTracker, ErrorContext };
