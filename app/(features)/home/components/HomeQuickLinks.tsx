'use client';

import Link from 'next/link';
import { memo, type ReactElement } from 'react';

import { BookmarkOutlineIcon, CalendarIcon, ClockIcon, PinIcon } from '@/app/shared/icons';

/**
 * Quick shortcut links to bookmark sections.
 * Placed below the Verse of the Day card on the home page.
 *
 * Design:
 * - 4 pill-shaped buttons, slightly larger than Surah shortcuts
 * - Icon + text, icon color matches "Al Qur'an" title (foreground)
 * - Desktop: single centered row
 * - Mobile: 2x2 grid or horizontal row
 */

const QUICK_LINKS = [
  { href: '/bookmarks/last-read', icon: ClockIcon, label: 'Recent' },
  { href: '/bookmarks/folders', icon: BookmarkOutlineIcon, label: 'Bookmarks' },
  { href: '/bookmarks/pinned', icon: PinIcon, label: 'Pinned' },
  { href: '/bookmarks/planner', icon: CalendarIcon, label: 'Planner' },
] as const;

interface HomeQuickLinksProps {
  className?: string;
}

export const HomeQuickLinks = memo(function HomeQuickLinks({
  className,
}: HomeQuickLinksProps): ReactElement {
  return (
    <div className={`w-full ${className ?? ''}`}>
      {/* 2x2 grid on mobile, single row on md+ */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:flex md:flex-wrap md:justify-center md:gap-3">
        {QUICK_LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="
              flex items-center justify-center gap-2
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
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
});
