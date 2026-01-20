'use client';

import { memo } from 'react';

import { BookmarkIcon, BookmarkOutlineIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  showRemove: boolean;
  onClick: () => void;
}

export const BookmarkButton = memo(function BookmarkButton({
  isBookmarked,
  showRemove,
  onClick,
}: BookmarkButtonProps): React.JSX.Element {
  return (
    <button
      aria-label={showRemove ? 'Remove bookmark' : 'Bookmark'}
      title={showRemove ? 'Remove bookmark' : 'Bookmark'}
      onClick={onClick}
      className={cn(
        'p-1.5 rounded-full hover:bg-interactive-hover transition flex items-center justify-center',
        isBookmarked || showRemove ? 'text-accent' : 'hover:text-accent',
        touchClasses.target,
        touchClasses.focus
      )}
    >
      {isBookmarked || showRemove ? <BookmarkIcon size={18} /> : <BookmarkOutlineIcon size={18} />}
    </button>
  );
});
