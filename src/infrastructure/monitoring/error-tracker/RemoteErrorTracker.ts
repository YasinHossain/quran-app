import { formatError } from './formatError';
import { sendEvents, type TrackerEvent } from './sendEvents';
import { createTransport, type Transport } from './transport';

import type { ErrorContext, IErrorTracker } from './types';
import type { ApplicationError } from '@/src/infrastructure/errors';

export class RemoteErrorTracker implements IErrorTracker {
  private transport: Transport;
  private buffer: TrackerEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(endpoint: string, apiKey?: string) {
    this.transport = createTransport(endpoint, apiKey);

    // Auto-flush every 30 seconds
    if (typeof window === 'undefined') {
      this.flushTimer = setInterval(() => {
        void this.flush();
      }, 30000);
    }
  }

  captureError(error: Error | ApplicationError, context?: ErrorContext): void {
    this.buffer.push({
      type: 'error',
      data: formatError(error, context),
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
      await sendEvents(this.transport, events);
    } catch {
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
