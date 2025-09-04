/**
 * Centralized Logging Service
 *
 * Provides structured logging with multiple transports and log levels.
 * Supports console, file, and remote logging based on configuration.
 */

import { config } from '../../../config';
import { ApplicationError } from '../errors';

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log entry structure
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error | ApplicationError;
  source?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

/**
 * Logger transport interface
 */
export interface ILoggerTransport {
  log(entry: LogEntry): void | Promise<void>;
  flush?(): void | Promise<void>;
}

/**
 * Console transport implementation
 */
export class ConsoleTransport implements ILoggerTransport {
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}]`;

    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const fullMessage = `${prefix} ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage, entry.error);
        break;
      case LogLevel.INFO:
        console.info(fullMessage, entry.error);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage, entry.error);
        break;
      case LogLevel.ERROR:
        console.error(fullMessage, entry.error);
        break;
    }
  }
}

/**
 * Memory transport for testing and debugging
 */
export class MemoryTransport implements ILoggerTransport {
  private entries: LogEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 1000) {
    this.maxEntries = maxEntries;
  }

  log(entry: LogEntry): void {
    this.entries.push(entry);

    // Keep only the most recent entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  flush(): void {
    // Memory transport doesn't need flushing
  }
}

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
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ entries }),
      });

      if (!response.ok) {
        // Re-add failed entries to buffer for retry
        this.buffer.unshift(...entries);
        console.error(`Failed to send logs: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      // Re-add failed entries to buffer for retry
      this.buffer.unshift(...entries);
      console.error('Failed to send logs:', error);
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
 * Main Logger class
 */
export class Logger {
  private static instance: Logger;
  private transports: ILoggerTransport[] = [];
  private contextData: Record<string, unknown> = {};
  private minLevel: LogLevel;

  constructor() {
    this.minLevel = this.parseLogLevel(config.logging.level);
    this.setupDefaultTransports();
  }

  /**
   * Get singleton logger instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Parse log level from string
   */
  private parseLogLevel(level: string): LogLevel {
    const levelMap: Record<string, LogLevel> = {
      debug: LogLevel.DEBUG,
      info: LogLevel.INFO,
      warn: LogLevel.WARN,
      error: LogLevel.ERROR,
    };
    return levelMap[level.toLowerCase()] ?? LogLevel.INFO;
  }

  /**
   * Setup default transports based on configuration
   */
  private setupDefaultTransports(): void {
    if (config.logging.enableConsole) {
      this.addTransport(new ConsoleTransport());
    }

    if (config.logging.enableRemote) {
      // Add remote transport if endpoint is configured
      const endpoint = process.env.LOG_ENDPOINT;
      const apiKey = process.env.LOG_API_KEY;

      if (endpoint) {
        this.addTransport(new RemoteTransport(endpoint, { apiKey }));
      }
    }
  }

  /**
   * Add a transport
   */
  addTransport(transport: ILoggerTransport): void {
    this.transports.push(transport);
  }

  /**
   * Remove a transport
   */
  removeTransport(transport: ILoggerTransport): void {
    const index = this.transports.indexOf(transport);
    if (index > -1) {
      this.transports.splice(index, 1);
    }
  }

  /**
   * Set global context data
   */
  setContext(context: Record<string, unknown>): void {
    this.contextData = { ...this.contextData, ...context };
  }

  /**
   * Clear global context data
   */
  clearContext(): void {
    this.contextData = {};
  }

  /**
   * Create child logger with additional context
   */
  child(context: Record<string, unknown>): Logger {
    const child = Object.create(this);
    child.contextData = { ...this.contextData, ...context };
    return child;
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error | ApplicationError
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: { ...this.contextData, ...context },
      error,
      source: this.getSource(),
    };

    // Send to all transports
    this.transports.forEach((transport) => {
      try {
        const result = transport.log(entry);
        // Handle async transports
        if (result instanceof Promise) {
          result.catch((err) => {
            console.error('Logger transport error:', err);
          });
        }
      } catch (err) {
        console.error('Logger transport error:', err);
      }
    });
  }

  /**
   * Get the source location (file and line) if available
   */
  private getSource(): string | undefined {
    if (typeof window !== 'undefined' && window.Error) {
      try {
        const stack = new Error().stack;
        if (stack) {
          const lines = stack.split('\n');
          // Find the first line that's not from this logger
          for (let i = 3; i < lines.length; i++) {
            const line = lines[i];
            if (line && !line.includes('Logger.ts') && !line.includes('console.')) {
              return line.trim();
            }
          }
        }
      } catch {
        // Ignore errors in source detection
      }
    }
    return undefined;
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Error level logging
   */
  error(
    message: string | Error | ApplicationError,
    context?: Record<string, unknown>,
    error?: Error | ApplicationError
  ): void {
    if (message instanceof Error) {
      this.log(LogLevel.ERROR, message.message, context, message);
    } else {
      this.log(LogLevel.ERROR, message as string, context, error);
    }
  }

  /**
   * Flush all transports
   */
  async flush(): Promise<void> {
    const flushPromises = this.transports.map((transport) => transport.flush?.()).filter(Boolean);

    await Promise.allSettled(flushPromises);
  }

  /**
   * Destroy logger and cleanup resources
   */
  async destroy(): Promise<void> {
    await this.flush();

    // Cleanup any transport resources
    this.transports.forEach((transport) => {
      if (transport instanceof RemoteTransport) {
        transport.destroy();
      }
    });

    this.transports = [];
  }
}

/**
 * Performance logging utility
 */
export class PerformanceLogger {
  private logger: Logger;
  private timers: Map<string, number> = new Map();

  constructor(logger?: Logger) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Start performance timer
   */
  start(operation: string): void {
    this.timers.set(operation, performance.now());
  }

  /**
   * End performance timer and log duration
   */
  end(operation: string, context?: Record<string, unknown>): number {
    const startTime = this.timers.get(operation);
    if (!startTime) {
      this.logger.warn(`Performance timer '${operation}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(operation);

    this.logger.info(`Performance: ${operation}`, {
      ...context,
      duration: `${duration.toFixed(2)}ms`,
      operation,
    });

    return duration;
  }

  /**
   * Measure async operation
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    this.start(operation);
    try {
      const result = await fn();
      this.end(operation, context);
      return result;
    } catch (error) {
      this.end(operation, { ...context, error: true });
      throw error;
    }
  }

  /**
   * Measure sync operation
   */
  measureSync<T>(operation: string, fn: () => T, context?: Record<string, unknown>): T {
    this.start(operation);
    try {
      const result = fn();
      this.end(operation, context);
      return result;
    } catch (error) {
      this.end(operation, { ...context, error: true });
      throw error;
    }
  }
}

// Export singleton instances
export const logger = Logger.getInstance();
export const perfLogger = new PerformanceLogger(logger);

// Types already exported as interfaces above
