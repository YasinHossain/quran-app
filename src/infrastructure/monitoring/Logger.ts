/**
 * Centralized Logging Service
 *
 * Provides structured logging with multiple transports and log levels.
 * Supports console, file, and remote logging based on configuration.
 */

import { LogLevel } from './types';
import { config } from '../../../config';
import { parseLogLevel, setupDefaultTransports, getSource } from './Logger.utils';

import type { ILoggerTransport, LogEntry } from './types';

/**
 * Log levels in order of severity
 */
// Types moved to './types' to avoid cycles

/**
 * Main Logger class
 */
export class Logger {
  private static instance: Logger;
  private transports: ILoggerTransport[] = [];
  private contextData: Record<string, unknown> = {};
  private minLevel: LogLevel;

  constructor() {
    this.minLevel = parseLogLevel(config.logging.level);
    setupDefaultTransports(this);
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
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: { ...this.contextData, ...context },
      error,
      source: getSource(),
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
  error(message: string | Error, context?: Record<string, unknown>, error?: Error): void {
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

    // Cleanup any transport resources if supported
    await Promise.allSettled(this.transports.map((t) => t.destroy?.()));

    this.transports = [];
  }
}

// Export singleton instances
export const logger = Logger.getInstance();

// Types already exported as interfaces above
