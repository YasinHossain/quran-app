'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { ErrorActions } from './ErrorActions';
import { ErrorDetails } from './ErrorDetails';
import { ErrorIcon } from './ErrorIcon';

import type { ErrorFallbackProps } from './ErrorBoundary';

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps): React.JSX.Element {
  const router = useRouter();
  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-surface rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <ErrorIcon />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-foreground">Something went wrong</h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted mb-4">
            We encountered an unexpected error. You can try refreshing the page or go back to
            continue reading.
          </p>
          <ErrorDetails error={error} />
        </div>

        <ErrorActions onTryAgain={resetError} onGoHome={handleGoHome} />
      </div>
    </div>
  );
}
