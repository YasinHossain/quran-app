import { fetchWithTimeout } from '@/lib/api/client';

import { LogLevel, type LogEntry, type ILoggerTransport } from './types';

/**
 * Remote transport for sending logs to external services
 */
export class RemoteTransport implements ILoggerTransport {
  private buffer: LogEntry[] = [];
  private flushInterval: number;
  private endpoint: string;
  private apiKey?: string;
  private batchSize: number;
  private flushTimer?: NodeJS.Timeout;

  constructor(
    endpoint: string,
    options: {
      apiKey?: string;
      flushInterval?: number;
      batchSize?: number;
    } = {}
  ) {
    this.endpoint = endpoint;
    this.apiKey = options.apiKey;
    this.flushInterval = options.flushInterval || 10000; // 10 seconds
    this.batchSize = options.batchSize || 100;

    // Auto-flush on interval
    if (typeof window === 'undefined') {
      // Node.js environment
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.flushInterval);
    }
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry);

    // Flush immediately for errors, or when buffer is full
    if (entry.level >= LogLevel.ERROR || this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const entries = [...this.buffer];
    this.buffer = [];

    try {
      await fetchWithTimeout(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ entries }),
        errorPrefix: 'Failed to send logs',
      });
    } catch {
      // Re-add failed entries to buffer for retry
      this.buffer.unshift(...entries);
      // Unable to log the failure via central logger to avoid cycles
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}
