'use client';

import React from 'react';

interface VerseErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  verseKey?: string;
}

export function VerseErrorFallback({ error, resetError, verseKey }: VerseErrorFallbackProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7l.01.01M12 7v5"
            />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Failed to load verse{verseKey ? ` ${verseKey}` : ''}
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            There was an error loading this verse. This could be due to a network issue or temporary
            server problem.
          </p>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={resetError}
              className="text-sm bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1.5 rounded-md transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
