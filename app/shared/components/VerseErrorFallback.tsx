'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface VerseErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  verseKey?: string;
}

export function VerseErrorFallback({
  resetError,
  verseKey,
}: VerseErrorFallbackProps): React.JSX.Element {
  const router = useRouter();

  return (
    <div role="alert" className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7l.01.01M12 7v5"
            />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-error">
            Failed to load verse{verseKey ? ` ${verseKey}` : ''}
          </h3>
          <p className="mt-1 text-sm text-error">
            There was an error loading this verse. This could be due to a network issue or temporary
            server problem.
          </p>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={resetError}
              className="text-sm bg-error/10 hover:bg-error/20 text-error px-3 py-1.5 rounded-md transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.refresh()}
              className="text-sm bg-surface hover:bg-surface-elevated text-foreground px-3 py-1.5 rounded-md transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
