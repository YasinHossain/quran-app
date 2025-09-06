import { fetchWithTimeout } from '../../../../lib/api/client';
import { isApplicationError } from '../../errors';
import { logger } from '../Logger';

import type { ErrorContext, IErrorTracker } from './types';
import type { ApplicationError } from '../../errors';

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
      void this.flush();
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
    void this.flush();
  }
}
