'use client';

import React from 'react';

import { Folder } from '@/types';

interface WarningMessageProps {
  folder: Folder;
}

export const WarningMessage = ({ folder }: WarningMessageProps): React.JSX.Element | null => {
  if (folder.bookmarks.length === 0) return null;

  return (
    <div role="alert" className="bg-error/10 border border-error/20 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 text-error flex-shrink-0 mt-0.5">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-error text-sm mb-1">
            Warning: Contains bookmarked verses
          </p>
          <p className="text-error text-sm">
            This folder contains{' '}
            <strong>
              {folder.bookmarks.length} bookmarked verse
              {folder.bookmarks.length !== 1 ? 's' : ''}
            </strong>
            . All bookmarks will be permanently deleted and cannot be recovered.
          </p>
        </div>
      </div>
    </div>
  );
};
