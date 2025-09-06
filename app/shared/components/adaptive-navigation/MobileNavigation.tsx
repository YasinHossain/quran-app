'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { cn } from '@/lib/utils/cn';

import { NavigationItem } from './NavigationItem';

import type { NavItem } from './types';

interface MobileNavigationProps {
  navItems: NavItem[];
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
  className?: string;
}

export const MobileNavigation = ({
  navItems,
  onItemClick,
  className,
}: MobileNavigationProps): React.JSX.Element => {
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
            const active =
              item.isActive?.(pathname) ?? (item.href ? pathname === item.href : false);
            return (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={active}
                onItemClick={onItemClick}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};
