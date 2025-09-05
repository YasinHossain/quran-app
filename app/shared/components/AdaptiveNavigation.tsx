'use client';

import { IconHome, IconBook, IconBookmark } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useResponsiveState, responsiveClasses, touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';

import type { TablerIcon } from '@tabler/icons-react';
import React from 'react';

interface NavItem {
  id: string;
  icon: TablerIcon;
  label: string;
  href?: string;
  isActive?: (pathname: string) => boolean;
}

interface AdaptiveNavigationProps {
  onSurahJump?: () => void;
  className?: string;
}

/**
 * Unified navigation that adapts to all screen sizes
 * - Mobile: Bottom navigation with glass effect
 * - Tablet: Compact sidebar or bottom nav based on space
 * - Desktop: Full sidebar or top navigation
 */
export const AdaptiveNavigation = ({
  onSurahJump,
  className,
}: AdaptiveNavigationProps): React.JSX.Element => {
  const pathname = usePathname();
  const { breakpoint, variant } = useResponsiveState();

  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: IconHome,
      label: 'Home',
      href: '/',
      isActive: (path) => path === '/',
    },
    {
      id: 'surah',
      icon: IconBook,
      // Requirement: In mobile Surah page, this should navigate to verse page instead of opening sidebar.
      // Keep concise label; actual behavior handled in onItemClick below.
      label: breakpoint === 'mobile' ? 'Jump' : 'Jump to Surah',
      // Mark active on any surah path
      isActive: (path) => path.startsWith('/surah'),
      href: '/surah/1',
    },
    {
      id: 'bookmarks',
      icon: IconBookmark,
      label: 'Bookmarks',
      href: '/bookmarks',
      isActive: (path) => path.startsWith('/bookmarks'),
    },
  ];

  const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
    // New behavior:
    // - On Surah pages or Bookmark pages in mobile view, tapping "Jump" should navigate to the verse page (no sidebar).
    // - The Surah list sidebar trigger moves to the Verse page hamburger (handled elsewhere).
    if (item.id === 'surah') {
      const isOnSurahPage = pathname.startsWith('/surah/');
      const isOnBookmarkPage = pathname.startsWith('/bookmarks');
      const isMobile = breakpoint === 'mobile';
      if ((isOnSurahPage || isOnBookmarkPage) && isMobile) {
        // Allow default link navigation to verse page via href
        // Don't prevent default, let the Link handle the navigation
        return;
      }
      // For desktop or when not on surah/bookmark page, use the sidebar/selector
      if (onSurahJump) {
        e.preventDefault();
        onSurahJump();
      }
    }
  };

  // Don't show on home page
  const isHomePage = pathname === '/';
  if (isHomePage) return null;

  // Render based on current variant, not breakpoint
  switch (variant) {
    case 'compact':
      return (
        <MobileNavigation navItems={navItems} onItemClick={handleItemClick} className={className} />
      );

    case 'default':
      return (
        <TabletNavigation navItems={navItems} onItemClick={handleItemClick} className={className} />
      );

    case 'expanded':
      return (
        <DesktopNavigation
          navItems={navItems}
          onItemClick={handleItemClick}
          className={className}
        />
      );

    default:
      return (
        <MobileNavigation navItems={navItems} onItemClick={handleItemClick} className={className} />
      );
  }
};

/**
 * Mobile variant - bottom navigation
 */
const MobileNavigation = ({
  navItems,
  onItemClick,
  className,
}: {
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}): React.JSX.Element => {
  const pathname = usePathname();
  const { isHidden } = useHeaderVisibility();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out',
        isHidden ? 'translate-y-full' : 'translate-y-0',
        className
      )}
    >
      <div className="absolute inset-0 backdrop-blur-lg bg-surface/8 backdrop-saturate-150 border-t border-border/5" />

      <div className="relative px-4 pt-1.5 pb-safe pl-safe pr-safe">
        <div className="flex items-center justify-around w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.isActive?.(pathname) ?? (item.href ? pathname === item.href : false);

            const commonProps = {
              onClick: (e: React.MouseEvent) => onItemClick(item, e),
              className: cn(
                'relative flex flex-col items-center justify-center',
                'min-w-[48px] py-1.5 px-2 rounded-xl',
                'transition-all duration-200',
                touchClasses.target,
                touchClasses.gesture,
                touchClasses.focus,
                touchClasses.active,
                'hover:bg-muted/60'
              ),
            };

            const content = (
              <>
                <div className="relative z-10 mb-0.5">
                  <Icon
                    size={20}
                    className={cn(
                      'transition-all duration-200',
                      isActive ? 'text-foreground stroke-[2.5]' : 'text-muted stroke-[2]'
                    )}
                  />
                </div>

                <span
                  className={cn(
                    'text-xs font-medium transition-all duration-200',
                    isActive ? 'text-foreground' : 'text-muted'
                  )}
                >
                  {item.label}
                </span>
              </>
            );

            return item.href ? (
              <Link key={item.id} href={item.href} {...commonProps}>
                {content}
              </Link>
            ) : (
              <button key={item.id} type="button" {...commonProps}>
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

/**
 * Tablet variant - can be bottom nav or compact sidebar
 */
const TabletNavigation = ({
  navItems,
  onItemClick,
  className,
}: {
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}): React.JSX.Element => {
  // For now, use bottom navigation on tablets too
  // Can be enhanced to show sidebar based on screen ratio
  return <MobileNavigation navItems={navItems} onItemClick={onItemClick} className={className} />;
};

/**
 * Desktop variant - sidebar or top navigation
 */
const DesktopNavigation = ({
  navItems,
  onItemClick,
  className,
}: {
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}): React.JSX.Element => {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center gap-4', responsiveClasses.nav, className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.isActive?.(pathname) ?? (item.href ? pathname === item.href : false);

        const commonProps = {
          onClick: (e: React.MouseEvent) => onItemClick(item, e),
          className: cn(
            'flex items-center gap-3 px-4 py-2 rounded-xl',
            'transition-all duration-200',
            touchClasses.focus,
            touchClasses.active,
            isActive
              ? 'bg-accent/10 text-accent'
              : 'text-muted hover:text-foreground hover:bg-interactive/50'
          ),
        };

        const content = (
          <>
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
          </>
        );

        return item.href ? (
          <Link key={item.id} href={item.href} {...commonProps}>
            {content}
          </Link>
        ) : (
          <button key={item.id} type="button" {...commonProps}>
            {content}
          </button>
        );
      })}
    </nav>
  );
};
