'use client';

import { IconBook, IconBookmark, IconHome } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

import { useResponsiveState } from '@/lib/responsive';

import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { TabletNavigation } from './TabletNavigation';

import type { NavItem } from './types';

interface AdaptiveNavigationProps {
  onSurahJump?: () => void;
  className?: string;
}

const navItemsFor = (breakpoint: string): NavItem[] => [
  {
    id: 'home',
    icon: IconHome,
    label: 'Home',
    href: '/',
    isActive: (path: string) => path === '/',
  },
  {
    id: 'surah',
    icon: IconBook,
    label: breakpoint === 'mobile' ? 'Jump' : 'Jump to Surah',
    isActive: (path: string) => path.startsWith('/surah'),
    href: '/surah/1',
  },
  {
    id: 'bookmarks',
    icon: IconBookmark,
    label: 'Bookmarks',
    href: '/bookmarks',
    isActive: (path: string) => path.startsWith('/bookmarks'),
  },
];

export const AdaptiveNavigation = memo(function AdaptiveNavigation({
  onSurahJump,
  className,
}: AdaptiveNavigationProps): React.JSX.Element | null {
  const pathname = usePathname();
  const { breakpoint, variant } = useResponsiveState();
  const navItems = React.useMemo(() => navItemsFor(breakpoint), [breakpoint]);

  const handleItemClick = React.useCallback(
    (item: NavItem, e: React.MouseEvent) => {
      if (item.id === 'surah') {
        const isOnSurahPage = pathname.startsWith('/surah/');
        const isOnBookmarkPage = pathname.startsWith('/bookmarks');
        const isMobile = breakpoint === 'mobile';
        if ((isOnSurahPage || isOnBookmarkPage) && isMobile) return;
        if (onSurahJump) {
          e.preventDefault();
          onSurahJump();
        }
      }
    },
    [onSurahJump, pathname, breakpoint]
  );

  if (pathname === '/') return null;

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
});
