'use client';

import Link from 'next/link';
import React from 'react';

import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import type { NavItem } from './types';

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  onItemClick: (item: NavItem, e: React.MouseEvent) => void;
}

export const NavigationItem = ({
  item,
  isActive,
  onItemClick,
}: NavigationItemProps): React.JSX.Element => {
  const Icon = item.icon;
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
};
