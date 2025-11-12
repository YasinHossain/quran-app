'use client';

import React from 'react';

const useRevealClasses = (): string => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3';
};

export const LoadingFallback = (): React.JSX.Element => {
  const revealClasses = useRevealClasses();

  return (
    <div
      className={`mb-6 rounded-xl border border-border bg-surface p-6 transition-all duration-300 ease-out ${revealClasses}`}
    >
      <div className="animate-pulse">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-surface-hover"></div>
          <div className="h-3 w-20 rounded bg-surface-hover"></div>
        </div>
        <div className="space-y-3">
          <div className="h-6 rounded bg-surface-hover"></div>
          <div className="h-4 w-3/4 rounded bg-surface-hover"></div>
        </div>
      </div>
    </div>
  );
};

interface ErrorFallbackProps {
  error: unknown;
  verseId: string;
}

export const ErrorFallback = ({ error, verseId }: ErrorFallbackProps): React.JSX.Element => {
  const revealClasses = useRevealClasses();

  return (
    <div
      role="alert"
      className={`mb-6 rounded-xl border border-error/20 bg-surface p-6 transition-all duration-300 ease-out ${revealClasses}`}
    >
      <div className="text-center text-error">
        <p>Failed to load verse: {String(error)}</p>
        <p className="mt-2 text-sm text-muted">Verse ID: {verseId}</p>
      </div>
    </div>
  );
};
