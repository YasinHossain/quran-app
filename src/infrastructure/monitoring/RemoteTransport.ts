import { LogLevel, type LogEntry, type ILoggerTransport, logger } from './Logger';

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
    } = {},
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ entries }),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Re-add failed entries to buffer for retry
        this.buffer.unshift(...entries);
        logger.warn(`Failed to send logs: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      // Re-add failed entries to buffer for retry
      this.buffer.unshift(...entries);
      logger.warn('Failed to send logs:', error as Error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}
