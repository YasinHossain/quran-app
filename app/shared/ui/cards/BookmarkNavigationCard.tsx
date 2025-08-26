'use client';

import React from 'react';
import { BaseCard, BaseCardProps } from '../BaseCard';
import { cn } from '@/lib/utils/cn';

/**
 * BookmarkNavigationCard
 *
 * Specialized navigation card for bookmark sections (All Bookmarks, Pinned, etc.)
 * that maintains the current design while using the unified BaseCard system.
 */

interface BookmarkNavigationContent {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
}

interface BookmarkNavigationCardProps extends Omit<BaseCardProps, 'children'> {
  content: BookmarkNavigationContent;
  onSectionChange?: (sectionId: string) => void;
}

// Map section IDs to URLs for smooth navigation
const getSectionHref = (sectionId: string): string => {
  switch (sectionId) {
    case 'bookmarks':
      return '/bookmarks';
    case 'pinned':
      return '/bookmarks/pinned';
    case 'last-read':
      return '/bookmarks/last-read';
    case 'memorization':
      return '/bookmarks/memorization';
    default:
      return '/bookmarks';
  }
};

export const BookmarkNavigationCard: React.FC<BookmarkNavigationCardProps> = ({
  content,
  onSectionChange,
  isActive = false,
  className,
  onClick,
  ...props
}) => {
  const { id, icon: IconComponent, label, description } = content;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement | HTMLDivElement> = (e) => {
    // Trigger section change before navigation for immediate feedback
    onSectionChange?.(id);
    onClick?.(e);
  };

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={isActive}
      href={getSectionHref(id)}
      scroll={false}
      className={cn('items-center', className)}
      onClick={handleClick}
      {...props}
    >
      {/* Icon Badge */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 transition-colors duration-200',
          isActive ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent group-hover:bg-accent/15'
        )}
      >
        <IconComponent size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 ml-3">
        <div
          className={cn(
            'font-semibold text-sm truncate transition-colors duration-200',
            isActive ? 'text-white' : 'text-foreground group-hover:text-accent'
          )}
        >
          {label}
        </div>
        <div className="text-xs leading-tight truncate transition-colors duration-200">
          <span className={isActive ? 'text-white/70' : 'text-muted'}>{description}</span>
        </div>
      </div>
    </BaseCard>
  );
};
