'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { ErrorFallbackProps } from './ErrorBoundary';

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const router = useRouter();
  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-surface rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-foreground">Something went wrong</h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted mb-4">
            We encountered an unexpected error. You can try refreshing the page or go back to
            continue reading.
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-foreground mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs bg-interactive p-2 rounded overflow-auto max-h-32">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={resetError}
            className="flex-1 bg-accent hover:bg-accent-hover text-on-accent font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 bg-interactive hover:bg-interactive-hover text-foreground font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
