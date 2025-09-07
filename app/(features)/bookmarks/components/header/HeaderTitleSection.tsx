'use client';

import React from 'react';

import { BarsIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

export interface HeaderTitleSectionProps {
  title: string;
  stats?: { folders: number; verses: number };
  showMenuButton: boolean;
  onSidebarToggle?: () => void;
}

export const HeaderTitleSection = ({
  title,
  stats,
  showMenuButton,
  onSidebarToggle,
}: HeaderTitleSectionProps): React.JSX.Element => (
  <div className="flex items-center gap-3 min-w-0 flex-1">
    {showMenuButton && onSidebarToggle && (
      <Button
        variant="icon-round"
        size="icon"
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
        className="hover:shadow-sm transition-shadow flex-shrink-0"
      >
        <BarsIcon size={18} />
      </Button>
    )}
    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">{title}</h1>
      <p className="text-sm text-muted">
        Organize your favorite verses
        {stats && (
          <span className="ml-2 text-xs bg-surface px-2 py-1 rounded-md">
            {stats.folders} folders • {stats.verses} verses
          </span>
        )}
      </p>
    </div>
  </div>
);
