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
      <div className="flex-shrink-0">
        <span className="font-semibold text-accent text-sm">{verseKey}</span>
      </div>
      <button
        onClick={onOpen}
        className={cn(
          'p-1 rounded-full hover:bg-interactive transition-colors',
          touchClasses.target,
          touchClasses.gesture,
          touchClasses.focus
        )}
        aria-label="Open verse actions menu"
      >
        <EllipsisHIcon size={18} className="text-muted" />
      </button>
    </div>
  );
});

