'use client';

import React from 'react';

import { BookmarkIcon, PinIcon, ClockIcon, CalendarIcon } from '@/app/shared/icons';
import { BookmarkNavigationCard } from '@/app/shared/ui/cards';
import { cn } from '@/lib/utils/cn';

import type {
  BookmarkNavigationContent,
  SectionId,
} from '@/app/shared/ui/cards/BookmarkNavigationCard';

interface BookmarksContentProps {
  activeSection?: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
  children?: React.ReactNode;
  childrenTitle?: string | null;
  childrenContainerClassName?: string;
  childrenContentClassName?: string;
  showNavigation?: boolean;
}

export const BookmarksContent = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  childrenTitle,
  childrenContainerClassName,
  childrenContentClassName,
  showNavigation = true,
}: BookmarksContentProps): React.JSX.Element => (
  <div
    className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y"
    // Reserve scroll gutter so edge-to-edge dividers reach the sidebar edge.
    style={{ scrollbarGutter: 'stable' }}
  >
    {showNavigation ? (
      <NavigationSection activeSection={activeSection} onSectionChange={onSectionChange} />
    ) : null}
    <ChildrenSection
      {...(childrenTitle !== undefined ? { title: childrenTitle } : {})}
      {...(childrenContainerClassName !== undefined
        ? { containerClassName: childrenContainerClassName }
        : {})}
      {...(childrenContentClassName !== undefined
        ? { contentClassName: childrenContentClassName }
        : {})}
    >
      {children}
    </ChildrenSection>
  </div>
);

const NAVIGATION_SECTIONS: BookmarkNavigationContent[] = [
  { id: 'bookmarks', icon: BookmarkIcon, label: 'All Bookmarks', description: 'Manage folders' },
  { id: 'pinned', icon: PinIcon, label: 'Pinned Verses', description: 'Quick access' },
  { id: 'last-read', icon: ClockIcon, label: 'Recent', description: 'Last visited' },
  {
    id: 'planner',
    icon: CalendarIcon,
    label: 'Planner',
    description: 'Track progress',
  },
];

const NavigationSection = ({
  activeSection,
  onSectionChange,
}: {
  activeSection: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
}): React.JSX.Element => (
  <nav className="mb-6">
    <div className="space-y-2">
      {NAVIGATION_SECTIONS.map((section) => (
        <NavigationItem
          key={section.id}
          section={section}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      ))}
    </div>
  </nav>
);

const NavigationItem = ({
  section,
  activeSection,
  onSectionChange,
}: {
  section: BookmarkNavigationContent;
  activeSection: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
}): React.JSX.Element => (
  <BookmarkNavigationCard
    content={section}
    isActive={activeSection === section.id}
    {...(onSectionChange && { onSectionChange })}
  />
);

const ChildrenSection = ({
  children,
  title,
  containerClassName,
  contentClassName,
}: {
  children?: React.ReactNode;
  title?: string | null;
  containerClassName?: string;
  contentClassName?: string;
}): React.JSX.Element | null => {
  if (!children) return null;

  const heading = title === undefined ? 'More' : title;

  return (
    <div className={cn('mt-6 pt-4 border-t border-border', containerClassName)}>
      {heading !== null ? (
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
          {heading}
        </div>
      ) : null}
      <div className={cn('space-y-1', contentClassName)}>{children}</div>
    </div>
  );
};
