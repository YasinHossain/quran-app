'use client';

import Link from 'next/link';
import { memo } from 'react';

import { BookReaderIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface NavigateToVerseLinkProps {
  onNavigateToVerse?: () => void;
}

export const NavigateToVerseLink = memo(function NavigateToVerseLink({
  onNavigateToVerse,
}: NavigateToVerseLinkProps): React.JSX.Element | null {
  if (!onNavigateToVerse) return null;

  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onNavigateToVerse();
      }}
      aria-label="Go to verse"
      title="Go to verse"
      className={cn(
        'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
        touchClasses.focus
      )}
    >
      <BookReaderIcon size={18} />
    </Link>
  );
});
