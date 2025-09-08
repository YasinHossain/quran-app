/**
 * Centralized Logging Service
 *
 * Provides structured logging with multiple transports and log levels.
 * Supports console, file, and remote logging based on configuration.
 */

import { config } from '@/config';

import {
  setContext as setContextHelper,
  clearContext as clearContextHelper,
  child as childHelper,
} from './Logger.context';
import {
  addTransport as addTransportHelper,
  removeTransport as removeTransportHelper,
  flush as flushTransports,
  destroy as destroyTransports,
} from './Logger.transports';
import { parseLogLevel, setupDefaultTransports, getSource } from './Logger.utils';
import { LogLevel } from './types';

import type { ILoggerTransport, LogEntry } from './types';
// Types moved to './types' to avoid cycles

export class Logger {
  private static instance: Logger;
  private transports: ILoggerTransport[] = [];
  private contextData: Record<string, unknown> = {};
  private minLevel: LogLevel;

  constructor() {
    this.minLevel = parseLogLevel(config.logging.level);
    setupDefaultTransports(this);
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  addTransport(transport: ILoggerTransport): void {
    addTransportHelper(this.transports, transport);
  }

  removeTransport(transport: ILoggerTransport): void {
    removeTransportHelper(this.transports, transport);
  }

  setContext(context: Record<string, unknown>): void {
    this.contextData = setContextHelper(this.contextData, context);
  }

  clearContext(): void {
    this.contextData = clearContextHelper();
  }

  child(context: Record<string, unknown>): Logger {
    return childHelper(this, this.contextData, context);
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

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
          result.catch(() => {
            // Swallow transport errors to prevent recursive logging
          });
        }
      } catch {
        // Swallow transport errors to prevent recursive logging
      }
    });
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string | Error, context?: Record<string, unknown>, error?: Error): void {
    if (message instanceof Error) {
      this.log(LogLevel.ERROR, message.message, context, message);
    } else {
      this.log(LogLevel.ERROR, message as string, context, error);
    }
  }

  async flush(): Promise<void> {
    await flushTransports(this.transports);
  }

  async destroy(): Promise<void> {
    await destroyTransports(this.transports);
    this.transports = [];
  }
}

// Export singleton instances
export const logger = Logger.getInstance();

// Types already exported as interfaces above
