'use client';

import React from 'react';

import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
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
  onClose?: () => void;
}

export const BookmarksContent = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  childrenTitle,
  childrenContainerClassName,
  childrenContentClassName,
  showNavigation = true,
  onClose,
}: BookmarksContentProps): React.JSX.Element => (
  <div className="relative flex flex-1 min-h-0 flex-col bg-background text-foreground">
    <SidebarHeader
      title="Bookmarks"
      titleClassName="text-mobile-lg font-semibold text-content-primary"
      className="relative z-10 shadow-none xl:hidden"
      showCloseButton
      {...(onClose ? { onClose } : {})}
      forceVisible
    />

    <div className="flex-1 overflow-hidden flex flex-col">
      {showNavigation ? (
        <div>
          <NavigationSection activeSection={activeSection} onSectionChange={onSectionChange} />
        </div>
      ) : null}

      <div
        className="flex-1 min-h-0 overflow-y-auto touch-pan-y"
        // Reserve scroll gutter so edge-to-edge dividers reach the sidebar edge.
        style={{ scrollbarGutter: 'stable' }}
      >
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
    </div>
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
  <nav className="px-2 sm:px-3 pt-3 sm:pt-4 pb-4">
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
    <div className={cn('pt-4 px-2 sm:px-3', containerClassName)}>
      {heading !== null ? (
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
          {heading}
        </div>
      ) : null}
      <div className={cn('space-y-1', contentClassName)}>{children}</div>
    </div>
  );
};
