'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { BookmarkOutlineIcon, CalendarIcon, ClockIcon, PinIcon } from '@/app/shared/icons';

/**
 * Quick shortcut links to bookmark sections.
 * Placed below the Verse of the Day card on the home page.
 *
 * Design:
 * - 4 pill-shaped buttons, slightly larger than Surah shortcuts
 * - Icon + text, icon color matches "Al Quran" title (foreground)
 * - Desktop: single centered row
 * - Mobile: 2x2 grid or horizontal row
 */

const QUICK_LINKS = [
  { href: '/bookmarks/last-read', icon: ClockIcon, labelKey: 'home_quicklink_recent' },
  { href: '/bookmarks/folders', icon: BookmarkOutlineIcon, labelKey: 'home_quicklink_bookmarks' },
  { href: '/bookmarks/pinned', icon: PinIcon, labelKey: 'home_quicklink_pinned' },
  { href: '/bookmarks/planner', icon: CalendarIcon, labelKey: 'home_quicklink_planner' },
] as const;

interface HomeQuickLinksProps {
  className?: string;
}

export const HomeQuickLinks = memo(function HomeQuickLinks({
  className,
}: HomeQuickLinksProps): ReactElement {
  const { t } = useTranslation();
  const router = useRouter();

  const maxWidth = 'clamp(18rem, 80vw, 64rem)';

  // Prefetch handler for intent-based prefetching
  const prefetchRoute = useCallback(
    (href: string) => {
      try {
        router.prefetch(href);
      } catch {
        // Ignore prefetch errors
      }
    },
    [router]
  );

  // Warm cache on mount - prefetch all quick links immediately
  useEffect(() => {
    for (const link of QUICK_LINKS) {
      prefetchRoute(link.href);
    }
  }, [prefetchRoute]);

  return (
    <div className={`w-full mx-auto px-2 sm:px-3 lg:px-0 ${className ?? ''}`} style={{ maxWidth }}>
      {/* 2 columns by default, 4 columns on desktop */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 lg:gap-3">
        {QUICK_LINKS.map(({ href, icon: Icon, labelKey }) => (
          <Link
            key={href}
            href={href}
            prefetch={true}
            onMouseEnter={() => prefetchRoute(href)}
            onFocus={() => prefetchRoute(href)}
            onTouchStart={() => prefetchRoute(href)}
            className="
              w-full min-w-0 flex items-center justify-center gap-2
              min-h-[2.5rem] sm:min-h-[2.75rem] md:min-h-12
              px-4 sm:px-5 md:px-6
              py-2 sm:py-2.5 md:py-3
              rounded-full
              font-medium
              text-xs sm:text-sm md:text-base
              transition-all duration-200
              bg-surface-navigation text-foreground
              hover:bg-surface-navigation/90
              border border-border/30 dark:border-border/20
              shadow-sm hover:shadow-md
              active:scale-95
              touch-manipulation
            "
          >
            <Icon size={16} className="shrink-0 text-foreground" />
            <span className="min-w-0 truncate">{t(labelKey)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
});
