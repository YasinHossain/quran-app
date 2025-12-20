'use client';

import React from 'react';

import { BarsIcon, BookmarkIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

export interface HeaderTitleSectionProps {
  title: string;
  showMenuButton: boolean;
  onSidebarToggle?: (() => void) | undefined;
}

export const HeaderTitleSection = ({
  title,
  showMenuButton,
  onSidebarToggle,
}: HeaderTitleSectionProps): React.JSX.Element => (
  <div className="flex items-center gap-3 min-w-0 flex-1">
    {showMenuButton && onSidebarToggle && (
      <button
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-accent transition-colors flex items-center justify-center flex-shrink-0"
      >
        <BarsIcon size={18} />
      </button>
    )}
    <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
      <BookmarkIcon size={20} className="text-on-accent" />
    </div>
    <div className="min-w-0 -mt-1">
      <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
      <p className="text-xs text-muted -mt-0.5">Organize your favorite verses</p>
    </div>
  </div>
);
