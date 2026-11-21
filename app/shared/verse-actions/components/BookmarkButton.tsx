'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  // Same wording as the verse actions menu (the button opens the pin/bookmark dialog).
  const label = showRemove ? t('remove_bookmark') : t('pin_or_bookmark');
  return (
    <button
      aria-label={label}
      title={label}
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
