'use client';

import Link from 'next/link';
import { memo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { usePrefetchSingleVerse } from '@/app/shared/hooks/useSingleVerse';
import { BookReaderIcon } from '@/app/shared/icons';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface TafsirLinkProps {
  verseKey: string;
}

export const TafsirLink = memo(function TafsirLink({
  verseKey,
}: TafsirLinkProps): React.JSX.Element {
  const prefetchVerse = usePrefetchSingleVerse();
  const { settings } = useSettings();

  const handlePrefetch = () => {
    // Prefetch verse data
    void prefetchVerse([verseKey]);

    // Prefetch first active tafsir content if available
    const firstTafsirId = settings.tafsirIds?.[0];
    if (firstTafsirId) {
      void getTafsirCached(verseKey, firstTafsirId);
    }
  };

  return (
    <Link
      href={`/tafsir/${verseKey.replace(':', '/')}`}
      prefetch={true}
      onMouseEnter={handlePrefetch}
      onClick={handlePrefetch}
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
