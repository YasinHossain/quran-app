import { injectable } from 'inversify';
import { ILogger, LogLevel } from '../../domain/services/ILogger';
import { config } from '../../../config/env/config';

interface LogEntry {
  level: string;
  timestamp: string;
  message: string;
  data?: any;
  error?: Error;
  context?: Record<string, any>;
}

// // @injectable()
export class ConsoleLogger implements ILogger {
  private logLevel: LogLevel;
  private context: Record<string, any> = {};

  constructor() {
    this.logLevel = this.getLogLevelFromConfig();
  }

  private getLogLevelFromConfig(): LogLevel {
    const configLevel = config.LOG_LEVEL.toLowerCase();
    switch (configLevel) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'info':
        return LogLevel.INFO;
      case 'warn':
        return LogLevel.WARN;
      case 'error':
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return config.ENABLE_CONSOLE_LOGGING && this.logLevel <= level;
  }

  private formatLogEntry(level: string, message: string, data?: any, error?: Error): LogEntry {
    return {
      level,
      timestamp: new Date().toISOString(),
      message,
      data: data || undefined,
      error: error || undefined,
      context: Object.keys(this.context).length > 0 ? { ...this.context } : undefined,
    };
  }

  private outputLog(entry: LogEntry, consoleMethod: (...args: any[]) => void): void {
    if (config.NODE_ENV === 'development') {
      // Pretty formatted output for development
      const contextStr = entry.context
        ? ` [${Object.entries(entry.context)
            .map(([k, v]) => `${k}=${v}`)
            .join(', ')}]`
        : '';
      consoleMethod(
        `[${entry.level}] ${entry.timestamp}${contextStr}: ${entry.message}`,
        entry.data || '',
        entry.error || ''
      );
    } else {
      // JSON structured output for production
      consoleMethod(JSON.stringify(entry));
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.formatLogEntry('INFO', message, data);
      this.outputLog(entry, console.log);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.formatLogEntry('WARN', message, data);
      this.outputLog(entry, console.warn);
    }
  }

  error(message: string, error?: Error | any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.formatLogEntry('ERROR', message, undefined, error);
      this.outputLog(entry, console.error);
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.formatLogEntry('DEBUG', message, data);
      this.outputLog(entry, console.debug);
    }
  }

  // Additional methods for structured logging
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  addContext(key: string, value: any): void {
    this.context[key] = value;
  }

  removeContext(key: string): void {
    delete this.context[key];
  }

  clearContext(): void {
    this.context = {};
  }

  // Specialized logging methods for Quran app
  logUserAction(action: string, data?: any): void {
    this.addContext('type', 'user_action');
    this.info(`User action: ${action}`, data);
    this.removeContext('type');
  }

  logApiCall(endpoint: string, method: string, duration?: number): void {
    this.addContext('type', 'api_call');
    this.info(`API ${method} ${endpoint}`, { duration: duration ? `${duration}ms` : undefined });
    this.removeContext('type');
  }

  logPerformance(operation: string, duration: number): void {
    this.addContext('type', 'performance');
    this.info(`Performance: ${operation}`, { duration: `${duration}ms` });
    this.removeContext('type');
  }

  logCacheOperation(operation: string, key: string, hit: boolean = false): void {
    this.addContext('type', 'cache');
    this.debug(`Cache ${operation}: ${key}`, { hit });
    this.removeContext('type');
  }
}
