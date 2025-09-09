'use client';

import { memo } from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface BottomSheetHeaderProps {
  verseKey: string;
  onClose: () => void;
}

export const BottomSheetHeader = memo(function BottomSheetHeader({
  verseKey,
  onClose,
}: BottomSheetHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
      <h2 className="text-lg font-semibold text-foreground">Verse {verseKey}</h2>
      <button
        onClick={onClose}
        className={cn(
          'p-2 rounded-full hover:bg-interactive transition-colors',
          touchClasses.target,
          touchClasses.gesture,
          touchClasses.focus
        )}
        aria-label="Close"
      >
        <CloseIcon size={20} className="text-muted" />
      </button>
    </div>
  );
});

