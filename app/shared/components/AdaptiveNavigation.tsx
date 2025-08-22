'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconHome, IconBook, IconBookmark } from '@tabler/icons-react';
import type { TablerIcon } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useResponsiveState, responsiveClasses, touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';

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
const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({ onSurahJump, className }) => {
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
      label: breakpoint === 'mobile' ? 'Jump' : 'Jump to Surah',
      isActive: (path) => path.startsWith('/surah'),
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
    if (item.id === 'surah' && onSurahJump) {
      e.preventDefault();
      onSurahJump();
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
const MobileNavigation: React.FC<{
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}> = ({ navItems, onItemClick, className }) => {
  const pathname = usePathname();

  return (
    <nav className={cn('fixed bottom-0 left-0 right-0 z-50', className)}>
      <div className="absolute inset-0 bg-surface-glass/95 backdrop-blur-xl border-t border-border/20" />

      <div className="relative px-2 pt-2 pb-safe pl-safe pr-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.isActive?.(pathname) ?? (item.href ? pathname === item.href : false);

            const commonProps = {
              key: item.id,
              onClick: (e: React.MouseEvent) => onItemClick(item, e),
              className: cn(
                'relative flex flex-col items-center justify-center',
                'min-w-[60px] py-2 px-3 rounded-2xl',
                'transition-all duration-200',
                touchClasses.target,
                touchClasses.gesture,
                touchClasses.focus,
                touchClasses.active,
                'hover:bg-interactive/50'
              ),
            };

            const content = (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-accent/10 rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="relative z-10 mb-1">
                  <Icon
                    size={24}
                    className={cn(
                      'transition-all duration-200',
                      isActive ? 'text-accent stroke-[2.5]' : 'text-muted stroke-[2]'
                    )}
                  />
                </div>

                <span
                  className={cn(
                    'text-xs font-medium transition-all duration-200',
                    isActive ? 'text-accent' : 'text-muted'
                  )}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full"
                    transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            );

            return item.href ? (
              <Link href={item.href} {...commonProps}>
                {content}
              </Link>
            ) : (
              <button type="button" {...commonProps}>
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
const TabletNavigation: React.FC<{
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}> = ({ navItems, onItemClick, className }) => {
  // For now, use bottom navigation on tablets too
  // Can be enhanced to show sidebar based on screen ratio
  return <MobileNavigation navItems={navItems} onItemClick={onItemClick} className={className} />;
};

/**
 * Desktop variant - sidebar or top navigation
 */
const DesktopNavigation: React.FC<{
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}> = ({ navItems, onItemClick, className }) => {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center gap-4', responsiveClasses.nav, className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.isActive?.(pathname) ?? (item.href ? pathname === item.href : false);

        const commonProps = {
          key: item.id,
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
          <Link href={item.href} {...commonProps}>
            {content}
          </Link>
        ) : (
          <button type="button" {...commonProps}>
            {content}
          </button>
        );
      })}
    </nav>
  );
};

export default AdaptiveNavigation;
