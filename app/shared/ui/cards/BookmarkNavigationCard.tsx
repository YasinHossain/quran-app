'use client';
import type React from 'react';

import { BaseCard, BaseCardProps } from '../BaseCard';
import { cn } from '@/lib/utils/cn';
import { colors } from '../../design-system/card-tokens';

/**
 * BookmarkNavigationCard
 *
 * Specialized navigation card for bookmark sections (All Bookmarks, Pinned, etc.)
 * that maintains the current design while using the unified BaseCard system.
 */

// Valid bookmark section identifiers
export type SectionId = 'bookmarks' | 'pinned' | 'last-read' | 'memorization';

export interface BookmarkNavigationContent {
  id: SectionId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
}

interface BookmarkNavigationCardProps extends Omit<BaseCardProps, 'children'> {
  content: BookmarkNavigationContent;
  onSectionChange?: (sectionId: SectionId) => void;
}

// Map section IDs to URLs for smooth navigation
const routes: Record<SectionId, string> = {
  bookmarks: '/bookmarks',
  pinned: '/bookmarks/pinned',
  'last-read': '/bookmarks/last-read',
  memorization: '/bookmarks/memorization',
};

const getSectionHref = (sectionId: SectionId): string => routes[sectionId];

export const BookmarkNavigationCard = ({
  content,
  onSectionChange,
  isActive = false,
  className,
  onClick,
  ...props
}: BookmarkNavigationCardProps): JSX.Element => {
  const { id, icon: IconComponent, label, description } = content;

  const handleClick = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
    // Trigger section change before navigation for immediate feedback
    onSectionChange?.(id);
    if (onClick && typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={Boolean(isActive)}
      href={getSectionHref(id)}
      scroll={false}
      className={cn('items-center', className as string)}
      onClick={handleClick}
      {...props}
    >
      {/* Icon Badge */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 transition-colors duration-200',
          isActive
            ? 'bg-on-accent/20 text-on-accent'
            : `${colors.background.gradientBase} ${colors.text.accent} ${colors.background.gradientHover}`
        )}
      >
        <IconComponent size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 ml-3">
        <div
          className={cn(
            'font-semibold text-sm truncate transition-colors duration-200',
            isActive ? 'text-on-accent' : 'text-foreground group-hover:text-accent'
          )}
        >
          {label}
        </div>
        <div className="text-xs leading-tight truncate transition-colors duration-200">
          <span className={isActive ? colors.text.activeSecondary : 'text-muted'}>
            {description}
          </span>
        </div>
      </div>
    </BaseCard>
  );
};
