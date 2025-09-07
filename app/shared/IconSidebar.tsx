// app/shared/Navigation.tsx - Simple unified navigation
'use client';
import Link from 'next/link';
import { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { cn } from '@/lib/utils/cn';

import { HomeIcon, BookmarkOutlineIcon, GridIcon } from './icons';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

export const Navigation = memo(function Navigation() {
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();

  const navItems = useMemo(
    (): NavItem[] => [
      { icon: HomeIcon, label: t('home'), href: '/' },
      { icon: GridIcon, label: t('all_surahs'), href: '/surah/1' },
      { icon: BookmarkOutlineIcon, label: t('bookmarks'), href: '/bookmarks' },
    ],
    [t]
  );

  const linkStyles = useMemo(
    () => "p-3 rounded-lg hover:bg-accent/10 text-foreground hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    []
  );

  const desktopStyle = useMemo(
    () => ({ height: 'calc(100vh - 4rem)' }),
    []
  );

  return (
    <>
      {/* Desktop: Left vertical sidebar */}
      <nav 
        className="hidden lg:block fixed left-0 top-16 w-16 bg-background border-r border-border z-50"
        style={desktopStyle}
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

      {/* Mobile: Bottom bar */}
      <nav
        className={cn(
          'lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          isHidden ? 'translate-y-full' : 'translate-y-0'
        )}
        aria-label="Primary navigation"
      >
        <div className="backdrop-blur-lg bg-surface/80 border-t border-border/20">
          <div className="px-4 py-2 pb-safe">
            <div className="flex items-center justify-around">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  className={cn(linkStyles, "flex flex-col items-center min-w-[48px] py-2")}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
});

// Export with legacy names for compatibility
export const NavigationSidebar = Navigation;
export const IconSidebar = Navigation;
