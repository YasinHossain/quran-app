// app/shared/Navigation.tsx - Simple unified navigation
'use client';
import Link from 'next/link';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

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
}: {
  navItems: NavItem[];
  linkStyles: string;
}) {
  return (
    <nav
      className="fixed left-0 top-reader-header bottom-0 hidden w-16 bg-background z-50 lg:block"
      aria-label="Primary navigation"
    >
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            aria-label={item.label}
            className={linkStyles}
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
  linkStyles,
  isHidden,
  pathname,
}: {
  navItems: NavItem[];
  linkStyles: string;
  isHidden: boolean;
  pathname: string;
}) {
  return (
    <nav
      className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        'backdrop-blur-lg bg-surface/8 backdrop-saturate-150',
        'shadow-[0_-10px_28px_-18px_rgb(var(--color-foreground)/0.14)]',
        isHidden ? 'translate-y-full' : 'translate-y-0'
      )}
      aria-label="Primary navigation"
    >
      <div className="px-4 py-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : item.href === '/bookmarks'
                  ? pathname.startsWith('/bookmarks')
                  : pathname.startsWith('/surah') ||
                  pathname.startsWith('/juz') ||
                  pathname.startsWith('/page');

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  linkStyles,
                  'flex flex-col items-center min-w-[48px] py-2',
                  isActive ? 'text-accent' : 'text-muted'
                )}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

export const Navigation = memo(function Navigation() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();
  const hideMobileNav = isHidden;

  const navItems = useMemo(
    (): NavItem[] => [
      { icon: HomeIcon, label: t('home'), href: '/' },
      { icon: GridIcon, label: t('all_surahs'), href: '/surah/1' },
      { icon: BookmarkOutlineIcon, label: t('bookmarks'), href: '/bookmarks' },
    ],
    [t]
  );

  const linkStyles = useMemo(
    () =>
      'p-3 rounded-lg hover:bg-accent/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    []
  );

  return (
    <>
      <DesktopNavigation navItems={navItems} linkStyles={`${linkStyles} text-foreground hover:text-accent`} />
      <MobileNavigation navItems={navItems} linkStyles={linkStyles} isHidden={hideMobileNav} pathname={pathname} />
    </>
  );
});

// Export with legacy names for compatibility
export const NavigationSidebar = Navigation;
export const IconSidebar = Navigation;
