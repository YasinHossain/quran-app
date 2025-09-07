'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useCallback } from 'react';

import { responsiveClasses, touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import type { NavItem } from './types';

interface DesktopNavigationProps {
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}

export const DesktopNavigation = memo(function DesktopNavigation({
  navItems,
  onItemClick,
  className,
}: DesktopNavigationProps): React.JSX.Element {
  const pathname = usePathname();
  const handleClick = useCallback(
    (item: NavItem) => (e: React.MouseEvent) => onItemClick(item, e),
    [onItemClick]
  );

  return (
    <nav className={cn('flex items-center gap-4', responsiveClasses.nav, className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.isActive?.(pathname) ?? (item.href ? pathname === item.href : false);
        const itemClass = cn(
          'flex items-center gap-3 px-4 py-2 rounded-xl',
          'transition-all duration-200',
          touchClasses.focus,
          touchClasses.active,
          isActive
            ? 'bg-accent/10 text-accent'
            : 'text-muted hover:text-foreground hover:bg-interactive/50'
        );
        const content = (
          <>
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
          </>
        );
        return item.href ? (
          <Link key={item.id} href={item.href} onClick={handleClick(item)} className={itemClass}>
            {content}
          </Link>
        ) : (
          <button key={item.id} type="button" onClick={handleClick(item)} className={itemClass}>
            {content}
          </button>
        );
      })}
    </nav>
  );
});
