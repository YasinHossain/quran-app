'use client';

import Link from 'next/link';
import { memo } from 'react';

import { BookReaderIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface TafsirLinkProps {
  verseKey: string;
}

export const TafsirLink = memo(function TafsirLink({
  verseKey,
}: TafsirLinkProps): React.JSX.Element {
  return (
    <Link
      href={`/tafsir/${verseKey.replace(':', '/')}`}
      aria-label="View tafsir"
      title="Tafsir"
      className={cn(
        'p-1.5 rounded-full hover:bg-interactive-hover hover:text-accent transition flex items-center justify-center',
        touchClasses.focus
      )}
    >
      <BookReaderIcon size={18} />
    </Link>
  );
});
