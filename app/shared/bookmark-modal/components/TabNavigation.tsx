'use client';

import { motion } from 'framer-motion';
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
    { id: 'pin' as const, label: 'Pin Verse', description: 'Quick access' },
    { id: 'bookmark' as const, label: 'Add to Folder', description: 'Organize & save' },
  ];

  return (
    <div className="px-6 py-4">
      <div className="relative flex w-full items-start justify-center">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-semibold text-foreground">Add to Collections</h2>
          {verseKey && <p className="text-sm text-muted">Verse {verseKey}</p>}
        </div>
        <button
          onClick={onClose}
          className={cn(
            'absolute right-0 top-0 p-2 rounded-full hover:bg-interactive transition-colors',
            touchClasses.target,
            touchClasses.focus
          )}
          aria-label="Close"
        >
          <CloseIcon size={20} className="text-muted" />
        </button>
      </div>

      <div className="mt-4 flex bg-surface-secondary rounded-2xl p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
              activeTab === tab.id ? 'text-accent' : 'text-muted hover:text-foreground',
              touchClasses.target,
              touchClasses.focus
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-accent/10 rounded-xl border border-accent/20"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <div className="relative">
              <div>{tab.label}</div>
              <div className="text-xs opacity-75">{tab.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});
