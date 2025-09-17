/**
 * Presentation layer logging service
 * This service provides standardized logging for the app layer while abstracting infrastructure dependencies
 */

import { loggerAdapter } from '@/src/infrastructure/monitoring/LoggerAdapter';

/**
 * Standardized logging service for the app layer
 * Provides consistent logging interface with context awareness
 */
export class LoggingService {
  private static instance: LoggingService;

  private constructor() {}

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: Record<string, unknown>, error?: Error): void {
    loggerAdapter.info(this.formatMessage(message), this.enhanceContext(context), error);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    loggerAdapter.warn(this.formatMessage(message), this.enhanceContext(context), error);
  }

  /**
   * Log error messages
   */
  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    loggerAdapter.error(this.formatMessage(message), this.enhanceContext(context), error);
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (process.env.NODE_ENV === 'development') {
      loggerAdapter.debug(this.formatMessage(message), this.enhanceContext(context), error);
    }
  }

  /**
   * Log user interactions for analytics
   */
  logUserAction(action: string, feature: string, metadata?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, {
      feature,
      action,
      ...metadata,
      type: 'user_interaction',
    });
  }

  /**
   * Log performance metrics
   */
  logPerformance(
    metric: string,
    value: number,
    unit: string,
    context?: Record<string, unknown>
  ): void {
    this.info(`Performance metric: ${metric}`, {
      metric,
      value,
      unit,
      ...context,
      type: 'performance',
    });
  }

  /**
   * Log API calls and responses
   */
  logApiCall({
    method,
    url,
    status,
    duration,
    error,
  }: {
    method: string;
    url: string;
    status: number;
    duration?: number;
    error?: Error;
  }): void {
    const message = `API ${method} ${url} - ${status}`;
    const context = {
      method,
      url,
      status,
      duration,
      type: 'api_call',
    };

    if (status >= 400) {
      this.error(message, context, error);
      return;
    }

    this.info(message, context, error);
  }

  /**
   * Format message with consistent prefix
   */
  private formatMessage(message: string): string {
    return `[App] ${message}`;
  }

  /**
   * Enhance context with common app-level information
   */
  private enhanceContext(context?: Record<string, unknown>): Record<string, unknown> {
    return {
      layer: 'app',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      ...context,
    };
  }
}

// Export singleton instance
export const appLogger = LoggingService.getInstance();
