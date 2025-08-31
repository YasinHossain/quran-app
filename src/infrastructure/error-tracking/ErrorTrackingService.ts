// import { injectable, inject } from 'inversify';
// import { TYPES } from '../../shared/config/container';
import { ILogger } from '../../domain/services/ILogger';
import { config } from '../../../config/env/config';

export interface ErrorReport {
  id: string;
  timestamp: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  context: {
    url?: string;
    userId?: string;
    userAgent?: string;
    component?: string;
    action?: string;
    additionalData?: Record<string, any>;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  environment: string;
  version: string;
}

export interface ErrorStats {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  recentErrors: ErrorReport[];
  topErrors: Array<{ error: string; count: number; lastSeen: string }>;
}

// // // @injectable()
export class ErrorTrackingService {
  private errorHistory: ErrorReport[] = [];
  private errorCounts: Map<string, { count: number; lastSeen: Date }> = new Map();
  private maxHistorySize = 1000;
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  reportError(
    error: Error,
    context: ErrorReport['context'] = {},
    severity: ErrorReport['severity'] = 'medium'
  ): string {
    const errorId = this.generateErrorId();

    const errorReport: ErrorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: {
        ...context,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
      severity,
      environment: config.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Store in local history
    this.storeError(errorReport);

    // Update error counts
    this.updateErrorCounts(error);

    // Log the error
    this.logger.error(`Error tracked [${errorId}]: ${error.message}`, {
      errorId,
      severity,
      context,
      stack: error.stack,
    });

    // In production, you might want to send to external error tracking service
    if (config.NODE_ENV === 'production') {
      this.sendToExternalService(errorReport);
    }

    return errorId;
  }

  reportCustomError(
    name: string,
    message: string,
    context: ErrorReport['context'] = {},
    severity: ErrorReport['severity'] = 'medium'
  ): string {
    const customError = new Error(message);
    customError.name = name;
    return this.reportError(customError, context, severity);
  }

  getErrorStats(): ErrorStats {
    const recentErrors = this.errorHistory.slice(-20).reverse(); // Most recent first

    const errorsByType: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};

    this.errorHistory.forEach((report) => {
      // Count by error type
      const errorType = report.error.name || 'Unknown';
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;

      // Count by severity
      errorsBySeverity[report.severity] = (errorsBySeverity[report.severity] || 0) + 1;
    });

    const topErrors = Array.from(this.errorCounts.entries())
      .map(([error, data]) => ({
        error,
        count: data.count,
        lastSeen: data.lastSeen.toISOString(),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors: this.errorHistory.length,
      errorsByType,
      errorsBySeverity,
      recentErrors,
      topErrors,
    };
  }

  clearErrorHistory(): void {
    this.errorHistory = [];
    this.errorCounts.clear();
    this.logger.info('Error history cleared');
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private storeError(errorReport: ErrorReport): void {
    this.errorHistory.push(errorReport);

    // Maintain maximum history size
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }
  }

  private updateErrorCounts(error: Error): void {
    const key = `${error.name}: ${error.message}`;
    const existing = this.errorCounts.get(key);

    if (existing) {
      existing.count++;
      existing.lastSeen = new Date();
    } else {
      this.errorCounts.set(key, { count: 1, lastSeen: new Date() });
    }
  }

  private sendToExternalService(errorReport: ErrorReport): void {
    // In a real application, you would send this to services like:
    // - Sentry
    // - Bugsnag
    // - LogRocket
    // - Rollbar
    // - Custom logging endpoint

    this.logger.debug('Would send error report to external service in production', {
      errorId: errorReport.id,
      service: 'external_error_tracking',
    });

    // Example: Send to a custom endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // }).catch(err => {
    //   this.logger.warn('Failed to send error to external service', err);
    // });
  }
}
