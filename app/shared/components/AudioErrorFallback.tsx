'use client';

import React from 'react';

interface AudioErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export function AudioErrorFallback({ error, resetError }: AudioErrorFallbackProps) {
  return (
    <div role="alert" className="bg-error/10 border border-error/20 rounded-lg p-3 mb-2">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-4 w-4 text-error" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 12V8l4-4v12l-4-4z"
            />
          </svg>
        </div>

        <div className="ml-2 flex-1">
          <p className="text-sm text-error">Audio playback failed</p>
          <p className="text-xs text-error mt-1">
            Check your internet connection or try a different reciter
          </p>
        </div>

        <button
          onClick={resetError}
          className="ml-2 text-xs bg-error/10 hover:bg-error/20 text-error px-2 py-1 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
