'use client';

import React, { memo, useCallback } from 'react';

import { colors } from '@/app/shared/design-system/card-tokens';
import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';
import { cn } from '@/lib/utils/cn';

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

interface IconBadgeProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
}

const IconBadge = memo(function IconBadge({
  icon: IconComponent,
  isActive,
}: IconBadgeProps): React.JSX.Element {
  return (
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
  );
});

const useNavigationClick = (
  id: SectionId,
  onSectionChange?: (sectionId: SectionId) => void,
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>
): React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement> =>
  useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      onSectionChange?.(id);
      onClick?.(e);
    },
    [id, onSectionChange, onClick]
  );

export const BookmarkNavigationCard = memo(function BookmarkNavigationCard({
  content,
  onSectionChange,
  isActive = false,
  className,
  onClick,
  ...props
}: BookmarkNavigationCardProps): React.JSX.Element {
  const { id, icon, label, description } = content;
  const activeState = Boolean(isActive);
  const handleClick = useNavigationClick(id, onSectionChange, onClick);

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={activeState}
      href={getSectionHref(id)}
      scroll={false}
      className={cn('items-center', className as string)}
      onClick={handleClick}
      {...props}
    >
      <IconBadge icon={icon} isActive={activeState} />
      <div className="flex-1 min-w-0 ml-3">
        <div
          className={cn(
            'font-semibold text-sm truncate transition-colors duration-200',
            activeState ? 'text-on-accent' : 'text-foreground group-hover:text-accent'
          )}
        >
          {label}
        </div>
        <div className="text-xs leading-tight truncate transition-colors duration-200">
          <span className={activeState ? colors.text.activeSecondary : 'text-muted'}>
            {description}
          </span>
        </div>
      </div>
    </BaseCard>
  );
});
