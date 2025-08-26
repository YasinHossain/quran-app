'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => (
  <div className="min-h-[50vh] flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center space-y-4">
      <div className="text-error-text">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted mt-2">{error.message || 'An unexpected error occurred'}</p>
      </div>
      <button
        onClick={resetError}
        className="btn btn-primary px-4 py-2 rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your error reporting service
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Hook for functional components to trigger error boundaries
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    setError(errorObj);
  }, []);

  return { handleError, resetError };
};

export default ErrorBoundary;
