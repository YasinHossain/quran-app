'use client';

import React from 'react';

import { Folder } from '@/types';

interface FolderPreviewProps {
  folder: Folder;
}

export const FolderPreview = ({ folder }: FolderPreviewProps): React.JSX.Element => (
  <div className="bg-surface-hover rounded-xl p-4 mb-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
        {folder.icon ? (
          <span className="text-lg">{folder.icon}</span>
        ) : (
          <svg
            className="w-4 h-4 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        )}
      </div>
      <div>
        <div className="font-semibold text-foreground">{folder.name}</div>
        <div className="text-sm text-muted">
          {folder.bookmarks.length} verse{folder.bookmarks.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  </div>
);
