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
      <h2 className="text-lg font-semibold text-foreground">Surah {verseKey}</h2>
      <button
        onClick={onClose}
        className={cn(
          'p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center',
          touchClasses.gesture,
          touchClasses.focus
        )}
        aria-label="Close"
      >
        <CloseIcon size={18} className="text-muted" />
      </button>
    </div>
  );
});
