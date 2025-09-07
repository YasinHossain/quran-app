'use client';

import React from 'react';

import { Bookmark } from '@/types';

interface ExpandedContentProps {
  isExpanded: boolean;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
}

export const ExpandedContent = ({
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
}: ExpandedContentProps): React.JSX.Element | null => {
  if (!isExpanded || !isCurrentFolder) return null;

  return (
    <div className="px-4 pb-3">
      <div className="border-t border-border pt-2">
        <p className="py-4 text-sm text-center text-muted">
          {folderBookmarks.length > 0
            ? `${folderBookmarks.length} verse${folderBookmarks.length !== 1 ? 's' : ''} • View in main area`
            : 'This folder is empty.'}
        </p>
      </div>
    </div>
  );
};
