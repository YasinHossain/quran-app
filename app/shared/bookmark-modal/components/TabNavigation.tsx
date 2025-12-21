'use client';

import { memo } from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface TabNavigationProps {
  activeTab: 'bookmark' | 'pin';
  onTabChange: (tab: 'bookmark' | 'pin') => void;
  verseKey?: string;
  onClose: () => void;
}

export const TabNavigation = memo(function TabNavigation({
  activeTab,
  onTabChange,
  verseKey = '',
  onClose,
}: TabNavigationProps): React.JSX.Element {
  const tabs = [
    { id: 'pin' as const, label: 'Pin Verse' },
    { id: 'bookmark' as const, label: 'Add to Folder' },
  ];

  return (
    <div className="px-3 py-4 relative">
      <div className="flex w-full items-start justify-center">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-semibold text-foreground">Add to Collections</h2>
          {verseKey && <p className="text-sm text-muted">Surah {verseKey}</p>}
        </div>
        <button
          onClick={onClose}
          className={cn(
            'absolute right-3 top-3 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center',
            touchClasses.focus
          )}
          aria-label="Close"
        >
          <CloseIcon size={18} className="text-muted" />
        </button>
      </div>

      <div className="mt-4 flex items-center p-1 rounded-full bg-interactive border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
              activeTab === tab.id
                ? 'bg-surface shadow text-foreground'
                : 'text-muted hover:text-foreground hover:bg-surface/30',
              touchClasses.focus
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
});
