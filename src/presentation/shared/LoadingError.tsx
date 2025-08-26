import React from 'react';
import Spinner from './Spinner';

interface LoadingErrorProps {
  isLoading: boolean;
  error?: unknown;
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const LoadingError = ({
  isLoading,
  error,
  children,
  loadingFallback,
  errorFallback,
}: LoadingErrorProps) => {
  if (isLoading) {
    return (
      <>
        {loadingFallback ?? (
          <div className="flex justify-center p-4">
            <Spinner className="h-6 w-6" />
          </div>
        )}
      </>
    );
  }

  if (error) {
    return (
      <>
        {errorFallback ?? (
          <div className="p-4 text-center text-error">
            <p>Failed to load.</p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default LoadingError;
