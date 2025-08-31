'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { container } from '../../../shared/config/container';
import { TYPES } from '../../../shared/config/container';
import { ErrorTrackingService } from '../../../infrastructure/error-tracking/ErrorTrackingService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private errorTrackingService: ErrorTrackingService;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };

    try {
      this.errorTrackingService = container.get<ErrorTrackingService>(TYPES.ErrorTrackingService);
    } catch (error) {
      console.error('Failed to initialize error tracking service:', error);
      // Fallback to console logging
      this.errorTrackingService = {
        reportError: (error: Error, context?: any, severity?: any) => {
          console.error('Error boundary caught error:', error, context);
          return 'fallback_error_id';
        },
      } as ErrorTrackingService;
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.errorTrackingService.reportError(
      error,
      {
        component: 'ErrorBoundary',
        action: 'componentDidCatch',
        additionalData: {
          componentStack: errorInfo.componentStack,
          errorBoundary: true,
        },
      },
      'high'
    );

    this.setState({ errorId });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>

                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Something went wrong
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We encountered an unexpected error. Our team has been notified and is working on a
                  fix.
                </p>

                {this.state.errorId && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Error ID: {this.state.errorId}
                  </p>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Reload Page
                  </button>

                  <button
                    onClick={() =>
                      this.setState({ hasError: false, error: undefined, errorId: undefined })
                    }
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
