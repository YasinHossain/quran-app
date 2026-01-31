'use client';

import React, { memo } from 'react';

interface FolderProgressProps {
  bookmarkCount: number;
}

export const FolderProgress = memo(function FolderProgress({
  bookmarkCount,
}: FolderProgressProps): React.JSX.Element {
  const width = bookmarkCount > 0 ? '100%' : '25%';
  return (
    <div>
      <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
          style={{ width }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>
          {bookmarkCount > 0 ? `Last added ${new Date().toLocaleDateString()}` : 'Empty folder'}
        </span>
      </div>
    </div>
  );
});
