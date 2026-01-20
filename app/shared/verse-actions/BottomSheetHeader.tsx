'use client';

import { memo } from 'react';

import { surahImageMap } from '@/app/(features)/surah/lib/surahImageMap';
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
  const getTitle = () => {
    const chapterId = Number(verseKey.split(':')[0]);
    const fileName = surahImageMap[chapterId];
    if (fileName) {
      const name = fileName.replace('.svg', '').replace(/ \(surah\)$/i, '');
      return `${name} ${verseKey}`;
    }
    return `Surah ${verseKey}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
      <h2 className="text-lg font-semibold text-foreground">{getTitle()}</h2>
      <button
        onClick={onClose}
        className={cn(
          'p-1.5 rounded-full hover:bg-interactive-hover transition-colors flex items-center justify-center',
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
