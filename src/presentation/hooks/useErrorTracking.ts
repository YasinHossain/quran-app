import { useCallback } from 'react';
import { useService } from '../providers/DIProvider';
import { TYPES } from '../../shared/config/container';
import {
  ErrorTrackingService,
  ErrorReport,
} from '../../infrastructure/error-tracking/ErrorTrackingService';

interface ErrorTrackingHook {
  reportError: (
    error: Error,
    context?: ErrorReport['context'],
    severity?: ErrorReport['severity']
  ) => string;

  reportCustomError: (
    name: string,
    message: string,
    context?: ErrorReport['context'],
    severity?: ErrorReport['severity']
  ) => string;

  reportUserError: (message: string, action: string, additionalData?: any) => string;
  reportApiError: (endpoint: string, error: Error, statusCode?: number) => string;
  reportValidationError: (field: string, value: any, rule: string) => string;
}

export const useErrorTracking = (): ErrorTrackingHook => {
  const errorTrackingService = useService<ErrorTrackingService>(TYPES.ErrorTrackingService);

  const reportError = useCallback(
    (error: Error, context?: ErrorReport['context'], severity?: ErrorReport['severity']) => {
      return errorTrackingService.reportError(error, context, severity);
    },
    [errorTrackingService]
  );

  const reportCustomError = useCallback(
    (
      name: string,
      message: string,
      context?: ErrorReport['context'],
      severity?: ErrorReport['severity']
    ) => {
      return errorTrackingService.reportCustomError(name, message, context, severity);
    },
    [errorTrackingService]
  );

  const reportUserError = useCallback(
    (message: string, action: string, additionalData?: any) => {
      return reportCustomError(
        'UserError',
        message,
        {
          action,
          additionalData,
        },
        'low'
      );
    },
    [reportCustomError]
  );

  const reportApiError = useCallback(
    (endpoint: string, error: Error, statusCode?: number) => {
      return reportError(
        error,
        {
          action: 'api_call',
          additionalData: {
            endpoint,
            statusCode,
            method: 'GET', // Could be enhanced to capture actual method
          },
        },
        statusCode && statusCode >= 500 ? 'high' : 'medium'
      );
    },
    [reportError]
  );

  const reportValidationError = useCallback(
    (field: string, value: any, rule: string) => {
      return reportCustomError(
        'ValidationError',
        `Validation failed for field '${field}' with rule '${rule}'`,
        {
          action: 'validation',
          additionalData: {
            field,
            value,
            rule,
          },
        },
        'low'
      );
    },
    [reportCustomError]
  );

  return {
    reportError,
    reportCustomError,
    reportUserError,
    reportApiError,
    reportValidationError,
  };
};

// Global error handler hook for unhandled errors and promise rejections
export const useGlobalErrorHandler = () => {
  const { reportError } = useErrorTracking();

  const setupGlobalErrorHandling = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Handle unhandled JavaScript errors
      const errorHandler = (event: ErrorEvent) => {
        reportError(
          new Error(event.message),
          {
            action: 'global_error',
            additionalData: {
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
            },
          },
          'high'
        );
      };

      // Handle unhandled promise rejections
      const rejectionHandler = (event: PromiseRejectionEvent) => {
        const error =
          event.reason instanceof Error ? event.reason : new Error(String(event.reason));
        reportError(
          error,
          {
            action: 'unhandled_promise_rejection',
            additionalData: {
              reason: event.reason,
            },
          },
          'high'
        );
      };

      window.addEventListener('error', errorHandler);
      window.addEventListener('unhandledrejection', rejectionHandler);

      // Return cleanup function
      return () => {
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', rejectionHandler);
      };
    }

    return () => {}; // No-op cleanup for server-side
  }, [reportError]);

  return { setupGlobalErrorHandling };
};
