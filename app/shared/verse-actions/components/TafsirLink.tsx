'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { usePrefetchSingleVerse } from '@/app/shared/hooks/useSingleVerse';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { BookReaderIcon } from '@/app/shared/icons';
import { setTafsirReturnFromVerseKey } from '@/app/shared/navigation/tafsirReturn';
import { touchClasses } from '@/lib/responsive';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { cn } from '@/lib/utils/cn';

interface TafsirLinkProps {
  verseKey: string;
}

export const TafsirLink = memo(function TafsirLink({
  verseKey,
}: TafsirLinkProps): React.JSX.Element {
  const router = useRouter();
  const rawPathname = usePathname();
  const locale = getLocaleFromPathname(rawPathname) ?? 'en';
  const href = localizeHref(`/tafsir/${verseKey.replace(':', '/')}`, locale);
  const prefetchVerse = usePrefetchSingleVerse();
  const { settings } = useSettings();
  const firstTafsirId = settings.tafsirIds?.[0];

  const handlePrefetch = useCallback(() => {
    // Prefetch the route on intent (instead of letting Next prefetch every verse link).
    try {
      void Promise.resolve(router.prefetch(href)).catch(() => {});
    } catch {
      // Ignore prefetch errors (e.g. dev / unsupported environments).
    }

    // Prefetch verse data
    void prefetchVerse([verseKey]).catch(() => {});

    // Prefetch first active tafsir content if available
    if (firstTafsirId) {
      void getTafsirCached(verseKey, firstTafsirId).catch(() => {});
    }
  }, [firstTafsirId, href, prefetchVerse, router, verseKey]);

  const handleClick = useCallback(() => {
    // Ensure "Back" from tafsir returns to the verse the user came from,
    // even if they navigate between tafsir verses before returning.
    setTafsirReturnFromVerseKey(verseKey);
    handlePrefetch();
  }, [handlePrefetch, verseKey]);

  return (
    <Link
      href={href}
      // Avoid prefetching *every* verse action link; we prefetch on intent above.
      prefetch={false}
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
      onClick={handleClick}
      aria-label="View tafsir"
      title="Tafsir"
      className={cn(
        'p-1.5 rounded-full hover:bg-interactive-hover hover:text-accent transition flex items-center justify-center',
        touchClasses.target,
        touchClasses.focus
      )}
    >
      <BookReaderIcon size={18} />
    </Link>
  );
});
