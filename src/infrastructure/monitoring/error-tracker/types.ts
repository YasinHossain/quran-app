import type { ApplicationError } from '../../errors';

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
