'use client';

import React from 'react';

interface SidebarHeaderProps {
  folder: { id: string; name: string };
  bookmarkCount: number;
  onBack?: () => void;
}

const BackIcon = (): React.JSX.Element => (
  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const SidebarHeader = ({
  folder,
  bookmarkCount,
  onBack,
}: SidebarHeaderProps): React.JSX.Element => (
  <div className="p-4 border-b border-border">
    {onBack && (
      <div className="flex items-center mb-3">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-surface-hover transition-colors mr-3"
          aria-label="Back to bookmarks"
        >
          <BackIcon />
        </button>
        <span className="text-sm text-muted">Back to Folders</span>
      </div>
    )}
    <h2 className="text-lg font-semibold text-foreground truncate" title={folder.name}>
      {folder.name}
    </h2>
    <p className="text-sm text-muted mt-1">
      {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'}
    </p>
  </div>
);

