'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { BarsIcon, BookmarkIcon } from '@/app/shared/icons';

export interface HeaderTitleSectionProps {
  title: string;
  showMenuButton: boolean;
  onSidebarToggle?: (() => void) | undefined;
}

export const HeaderTitleSection = ({
  title,
  showMenuButton,
  onSidebarToggle,
}: HeaderTitleSectionProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 min-w-0 flex-1">
      {showMenuButton && onSidebarToggle && (
        <button
          onClick={onSidebarToggle}
          aria-label={t('toggle_sidebar')}
          className="p-1.5 rounded-full hover:bg-interactive-hover hover:text-accent transition-colors flex items-center justify-center flex-shrink-0"
        >
          <BarsIcon size={18} />
        </button>
      )}
      <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
        <BookmarkIcon size={20} className="text-on-accent" />
      </div>
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        <p className="text-xs text-muted">{t('bookmarks_header_tagline')}</p>
      </div>
    </div>
  );
};
