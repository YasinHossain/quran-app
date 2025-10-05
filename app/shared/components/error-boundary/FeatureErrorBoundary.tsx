'use client';

import React from 'react';

import { appLogger } from '@/app/shared/services/LoggingService';

import { ErrorBoundary, ErrorFallbackProps } from './ErrorBoundary';

interface FeatureErrorFallbackProps extends ErrorFallbackProps {
  featureName: string;
  description?: string | null;
}

interface FeatureErrorContentProps {
  description: string;
  error: Error | null;
  featureName: string;
  onRetry: () => void;
  showDetails: boolean;
}

const FeatureErrorContent = ({
  description,
  error,
  featureName,
  onRetry,
  showDetails,
}: FeatureErrorContentProps): React.JSX.Element => (
  <div className="rounded-lg border border-status-error/20 bg-status-error/10 p-6">
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-status-error/20">
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-status-error"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            fillRule="evenodd"
          />
        </svg>
      </span>
      <div className="space-y-3 text-sm">
        <div>
          <h3 className="text-base font-semibold text-status-error">{featureName} Feature Error</h3>
          <p className="mt-1 text-content-secondary">{description}</p>
        </div>
        {showDetails && error && (
          <details className="text-content-secondary">
            <summary className="cursor-pointer font-medium text-foreground">Error details</summary>
            <pre className="mt-1 max-h-48 overflow-auto rounded bg-surface p-3 text-xs text-content-secondary">
              {error.stack}
            </pre>
          </details>
        )}
        <div>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-status-error px-3 py-2 text-on-accent transition-colors hover:bg-status-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-error focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Feature-specific error fallback component
 */
function FeatureErrorFallback({
  error,
  resetError,
  featureName,
  description,
}: FeatureErrorFallbackProps): React.JSX.Element {
  const fallbackDescription =
    description ?? `There was an error loading the ${featureName} feature.`;
  const showDetails = process.env.NODE_ENV === 'development' && Boolean(error);

  return (
    <FeatureErrorContent
      description={fallbackDescription}
      error={error}
      featureName={featureName}
      onRetry={resetError}
      showDetails={showDetails}
    />
  );
}

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName: string;
  description?: string | null;
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
    <FeatureErrorFallback {...props} featureName={featureName} description={description ?? null} />
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
    <FeatureErrorBoundary featureName={featureName} description={description ?? null}>
      <Component {...props} />
    </FeatureErrorBoundary>
  );

  WrappedComponent.displayName = `withFeatureErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
