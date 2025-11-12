'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbNavigationProps {
  onNavigateToBookmarks: () => void;
  folderName: string;
}

export const BreadcrumbNavigation = ({
  onNavigateToBookmarks,
  folderName,
}: BreadcrumbNavigationProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <nav
      className="flex items-center space-x-2 text-sm mb-6 hidden lg:flex"
      aria-label={t('bookmarks_breadcrumb_label')}
    >
      <button
        onClick={onNavigateToBookmarks}
        className="text-accent hover:text-accent-hover transition-colors"
      >
        {t('bookmarks')}
      </button>
      <span className="text-muted">/</span>
      <span className="text-foreground font-medium">{folderName}</span>
    </nav>
  );
};
