'use client';

import React from 'react';

import { ErrorBoundary } from './ErrorBoundary';

import type { ErrorFallbackProps } from './ErrorBoundary';

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
): React.ComponentType<P> {
  const WrappedComponent = (props: P): React.JSX.Element => {
    if (fallback) {
      return (
        <ErrorBoundary fallback={fallback}>
          <Component {...props} />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
