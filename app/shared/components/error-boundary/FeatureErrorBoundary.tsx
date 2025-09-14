'use client';

import React from 'react';

import { appLogger } from '@/app/shared/services/LoggingService';

import { ErrorBoundary, ErrorFallbackProps } from './ErrorBoundary';

interface FeatureErrorFallbackProps extends ErrorFallbackProps {
  featureName: string;
  description?: string;
}

/**
 * Feature-specific error fallback component
 */
function FeatureErrorFallback({
  error,
  resetError,
  featureName,
  description,
}: FeatureErrorFallbackProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {featureName} Feature Error
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{description || `There was an error loading the ${featureName} feature.`}</p>
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-1 text-xs">{error.stack}</pre>
              </details>
            )}
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                type="button"
                onClick={resetError}
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
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

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
}

/**
 * Feature-specific error boundary that provides isolated error handling for individual features
 */
export function FeatureErrorBoundary({
  children,
  featureName,
  description,
}: FeatureErrorBoundaryProps): React.JSX.Element {
  const handleError = (error: Error, errorInfo: React.ErrorInfo): void => {
    appLogger.error(
      `Feature error in ${featureName}`,
      {
        feature: featureName,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        type: 'feature_error',
      },
      error
    );

    // Track feature-specific error metrics
    appLogger.logPerformance('feature_error_rate', 1, 'count', {
      feature: featureName,
    });
  };

  const createFeatureFallback = (props: ErrorFallbackProps): React.JSX.Element => (
    <FeatureErrorFallback {...props} featureName={featureName} description={description} />
  );

  return (
    <ErrorBoundary fallback={createFeatureFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}

/**
 * Higher-order component for wrapping features with error boundaries
 */
export function withFeatureErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  featureName: string,
  description?: string
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <FeatureErrorBoundary featureName={featureName} description={description}>
      <Component {...props} />
    </FeatureErrorBoundary>
  );

  WrappedComponent.displayName = `withFeatureErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
