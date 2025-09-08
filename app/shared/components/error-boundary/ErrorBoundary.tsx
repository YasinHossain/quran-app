'use client';

import React from 'react';

import { ErrorHandler } from '@/src/infrastructure/errors';

import { DefaultErrorFallback } from './DefaultErrorFallback';

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ hasError: true, error, errorInfo });
    this.props.onError?.(error, errorInfo);

    ErrorHandler.handle(error, {
      context: { errorInfo },
      showUserNotification: false,
    });
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export function ErrorBoundary(props: ErrorBoundaryProps): React.JSX.Element {
  return <ErrorBoundaryClass {...props} />;
}
export { DefaultErrorFallback } from './DefaultErrorFallback';
export { useErrorHandler } from './useErrorHandler';
