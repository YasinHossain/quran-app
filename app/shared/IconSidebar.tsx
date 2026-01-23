// app/shared/Navigation.tsx - Simple unified navigation
'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { cn } from '@/lib/utils/cn';

import { HomeIcon, BookmarkOutlineIcon, GridIcon } from './icons';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

// Desktop navigation component
const DesktopNavigation = memo(function DesktopNavigation({
  navItems,
  linkStyles,
  pathname,
  onPrefetch,
  prefetchEnabled,
}: {
  navItems: NavItem[];
  linkStyles: string;
  pathname: string;
  onPrefetch: (href: string) => void;
  prefetchEnabled: boolean;
}) {
  if (pathname === '/') {
    return null;
  }

  return (
    <nav
      className="fixed left-0 top-reader-header bottom-0 hidden w-16 bg-background z-[5] xl:block"
      aria-label="Primary navigation"
    >
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={prefetchEnabled}
            title={item.label}
            aria-label={item.label}
            className={linkStyles}
            onMouseEnter={() => onPrefetch(item.href)}
            onFocus={() => onPrefetch(item.href)}
            onTouchStart={() => onPrefetch(item.href)}
          >
            <item.icon className="h-6 w-6" />
          </Link>
        ))}
      </div>
    </nav>
  );
});

// Mobile navigation component
const MobileNavigation = memo(function MobileNavigation({
  navItems,
  isHidden,
  pathname,
  onPrefetch,
  prefetchEnabled,
}: {
  navItems: NavItem[];
  isHidden: boolean;
  pathname: string;
  onPrefetch: (href: string) => void;
  prefetchEnabled: boolean;
}) {
  return (
    <nav
      className={cn(
        'xl:hidden fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out',
        'backdrop-blur-lg bg-surface/8 backdrop-saturate-150',
        'shadow-[0_-10px_28px_-18px_rgb(var(--color-foreground)/0.14)]',
        isHidden ? 'translate-y-full' : 'translate-y-0'
      )}
      aria-label="Primary navigation"
      style={{
        transform: isHidden ? 'translateY(100%) translateZ(0)' : 'translateZ(0)',
        contain: 'layout style',
      }}
    >
      <div className="px-2 sm:px-4 py-2 pb-safe">
        <div className="flex items-center w-full">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : item.href === '/bookmarks/last-read'
                  ? pathname.startsWith('/bookmarks')
                  : pathname.startsWith('/surah') ||
                    pathname.startsWith('/juz') ||
                    pathname.startsWith('/page');

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={prefetchEnabled}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center min-w-0 py-2 px-1 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent gap-1',
                  isActive ? 'text-accent' : 'text-muted'
                )}
                onMouseEnter={() => onPrefetch(item.href)}
                onFocus={() => onPrefetch(item.href)}
                onTouchStart={() => onPrefetch(item.href)}
              >
                <div className="flex items-center justify-center h-6 w-6">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

export const Navigation = memo(function Navigation({
  pathnameOverride,
}: {
  pathnameOverride?: string;
}) {
  const rawPathname = usePathname();
  const pathname = pathnameOverride ?? rawPathname;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();
  const { lastRead } = useBookmarks();
  // Mobile nav only hides on scroll (isHidden), not when sidebar opens.
  // We handle sidebar blur via z-index (nav is z-30, sidebar overlay is z-40).
  const hideMobileNav = isHidden;

  const [readerHref, setReaderHref] = useState('/surah/1');
  const [prefetchEnabled] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.getAttribute('data-glass') !== 'off';
  });

  const searchString = useMemo(() => searchParams.toString(), [searchParams]);
  const currentHref = useMemo(
    () => (searchString ? `${pathname}?${searchString}` : pathname),
    [pathname, searchString]
  );

  const mostRecentSurahHref = useMemo(() => {
    const entries = Object.entries(lastRead ?? {});
    if (entries.length === 0) return null;

    const mostRecent = entries.reduce<{
      surahId: string;
      updatedAt: number;
      verseNumber: number;
    } | null>((acc, [surahId, entry]) => {
      if (!entry || typeof entry.updatedAt !== 'number' || typeof entry.verseNumber !== 'number') {
        return acc;
      }
      if (!acc || entry.updatedAt > acc.updatedAt) {
        return { surahId, updatedAt: entry.updatedAt, verseNumber: entry.verseNumber };
      }
      return acc;
    }, null);

    if (!mostRecent) return null;
    return buildSurahRoute(mostRecent.surahId, { startVerse: mostRecent.verseNumber });
  }, [lastRead]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('nav:last-reader-href');
    if (stored) {
      setReaderHref(stored);
      return;
    }
    if (mostRecentSurahHref) {
      setReaderHref(mostRecentSurahHref);
    }
  }, [mostRecentSurahHref]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReaderRoute =
      pathname.startsWith('/surah') || pathname.startsWith('/juz') || pathname.startsWith('/page');
    if (!isReaderRoute) return;

    window.localStorage.setItem('nav:last-reader-href', currentHref);
    setReaderHref(currentHref);
  }, [currentHref, pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname.startsWith('/surah/')) return;

    const match = pathname.match(/^\/surah\/(\d+)/);
    const surahId = match?.[1];
    if (!surahId) return;

    const entry = (lastRead as Record<string, { verseNumber?: number } | undefined>)[surahId];
    const verseNumber = entry?.verseNumber;
    if (typeof verseNumber !== 'number' || !Number.isFinite(verseNumber) || verseNumber <= 0) {
      return;
    }

    const href = buildSurahRoute(surahId, { startVerse: verseNumber });
    window.localStorage.setItem('nav:last-reader-href', href);
    setReaderHref(href);
  }, [lastRead, pathname]);

  const navItems = useMemo(
    (): NavItem[] => [
      { icon: HomeIcon, label: t('home'), href: '/' },
      { icon: GridIcon, label: t('surah_tab'), href: readerHref },
      { icon: BookmarkOutlineIcon, label: t('bookmarks'), href: '/bookmarks/last-read' },
    ],
    [readerHref, t]
  );

  const linkStyles = useMemo(
    () =>
      'p-3 rounded-lg hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    []
  );

  const prefetch = useCallback(
    (href: string) => {
      if (!prefetchEnabled) return;
      // Prefetch on intent for snappy "tab-like" navigation on mobile.
      // Ignore failures (e.g., during dev or if Next skips prefetch).
      try {
        router.prefetch(href);
      } catch {
        // no-op
      }
    },
    [prefetchEnabled, router]
  );

  useEffect(() => {
    if (!prefetchEnabled) return;
    // Warm the router cache for primary destinations so switching is near-instant.
    for (const item of navItems) {
      if (item.href !== pathname) {
        prefetch(item.href);
      }
    }
  }, [navItems, pathname, prefetch, prefetchEnabled]);

  return (
    <>
      <DesktopNavigation
        navItems={navItems}
        linkStyles={`${linkStyles} text-foreground hover:text-accent`}
        pathname={pathname}
        onPrefetch={prefetch}
        prefetchEnabled={prefetchEnabled}
      />
      <MobileNavigation
        navItems={navItems}
        isHidden={hideMobileNav}
        pathname={pathname}
        onPrefetch={prefetch}
        prefetchEnabled={prefetchEnabled}
      />
    </>
  );
});
