'use client';

import { memo } from 'react';

import { EllipsisHIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface VerseActionTriggerProps {
  verseKey: string;
  onOpen: () => void;
  className?: string;
}

export const VerseActionTrigger = memo(function VerseActionTrigger({
  verseKey,
  onOpen,
  className = '',
}: VerseActionTriggerProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex-shrink-0 pl-1">
        <span className="font-semibold text-accent text-sm">{verseKey}</span>
      </div>
      <button
        onClick={onOpen}
        className={cn(
          'p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors -mr-2 group flex items-center justify-center',
          touchClasses.gesture,
          touchClasses.focus
        )}
        aria-label="Open verse actions menu"
      >
        <EllipsisHIcon size={18} className="text-muted group-hover:text-accent transition-colors" />
      </button>
    </div>
  );
});
