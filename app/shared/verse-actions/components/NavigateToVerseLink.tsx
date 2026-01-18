'use client';

import Link from 'next/link';
import { memo } from 'react';

import { GoToIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface NavigateToVerseLinkProps {
  onNavigateToVerse?: () => void;
  href?: string;
}

export const NavigateToVerseLink = memo(function NavigateToVerseLink({
  onNavigateToVerse,
  href,
}: NavigateToVerseLinkProps): React.JSX.Element | null {
  if (!onNavigateToVerse && !href) return null;

  const finalHref = href || '#';
  const shouldPrefetch = !!href;

  const handleClick = (e: React.MouseEvent): void => {
    if (!href && onNavigateToVerse) {
      e.preventDefault();
      onNavigateToVerse();
    }
  };

  return (
    <Link
      href={finalHref}
      prefetch={shouldPrefetch}
      onClick={handleClick}
      aria-label="Go to verse"
      title="Go to verse"
      className={cn(
        'p-1.5 rounded-full hover:bg-interactive-hover hover:text-accent transition flex items-center justify-center',
        touchClasses.focus
      )}
    >
      <GoToIcon size={18} />
    </Link>
  );
});
