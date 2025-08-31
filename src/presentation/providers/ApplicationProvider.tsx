'use client';

import React, { ReactNode, useEffect } from 'react';
import { DIProvider } from './DIProvider';
import { ErrorBoundary } from '../components/error-boundary/ErrorBoundary';
import { useGlobalErrorHandler } from '../hooks/useErrorTracking';

interface ApplicationProviderProps {
  children: ReactNode;
}

// Global error setup component
const GlobalErrorSetup: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setupGlobalErrorHandling } = useGlobalErrorHandler();

  useEffect(() => {
    const cleanup = setupGlobalErrorHandling();
    return cleanup;
  }, [setupGlobalErrorHandling]);

  return <>{children}</>;
};

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <DIProvider>
        <GlobalErrorSetup>{children}</GlobalErrorSetup>
      </DIProvider>
    </ErrorBoundary>
  );
};
