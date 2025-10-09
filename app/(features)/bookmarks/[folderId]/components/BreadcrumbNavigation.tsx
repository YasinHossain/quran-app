'use client';

import React from 'react';

interface BreadcrumbNavigationProps {
  onNavigateToBookmarks: () => void;
  folderName: string;
}

export const BreadcrumbNavigation = ({
  onNavigateToBookmarks,
  folderName,
}: BreadcrumbNavigationProps): React.JSX.Element => (
  <nav className="flex items-center space-x-2 text-sm mb-6 hidden lg:flex" aria-label="Breadcrumb">
    <button
      onClick={onNavigateToBookmarks}
      className="text-accent hover:text-accent-hover transition-colors"
    >
      Bookmarks
    </button>
    <span className="text-muted">/</span>
    <span className="text-foreground font-medium">{folderName}</span>
  </nav>
);
