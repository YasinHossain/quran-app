'use client';

import Link from 'next/link';
import { memo } from 'react';

import { VerseActionItem } from '@/app/shared/verse-actions/types';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface ActionListProps {
  actions: VerseActionItem[];
  onClose: () => void;
}

export const ActionList = memo(function ActionList({
  actions,
  onClose,
}: ActionListProps): React.JSX.Element {
  return (
    <div className="flex-1 overflow-y-auto p-4 pb-8">
      <div className="space-y-2">
        {actions.map((action) =>
          action.href ? (
            <Link
              key={action.label}
              href={action.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-4 p-4 rounded-2xl transition-all duration-200',
                'hover:bg-interactive active:bg-interactive',
                touchClasses.target,
                touchClasses.gesture,
                touchClasses.focus,
                touchClasses.active,
                action.active && 'bg-accent/10 text-accent'
              )}
            >
              <div className="flex-shrink-0">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ) : (
            <button
              key={action.label}
              onClick={action.onClick}
              className={cn(
                'flex w-full items-center gap-4 p-4 rounded-2xl transition-all duration-200',
                'hover:bg-interactive active:bg-interactive',
                touchClasses.target,
                touchClasses.gesture,
                touchClasses.focus,
                touchClasses.active,
                action.active && 'bg-accent/10 text-accent'
              )}
            >
              <div className="flex-shrink-0">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
});
