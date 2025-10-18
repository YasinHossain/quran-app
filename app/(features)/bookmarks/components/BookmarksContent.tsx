'use client';

import React from 'react';

import { NavigationSection, ChildrenSection } from './bookmarks-content';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

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
  <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y">
    {showNavigation ? (
      <NavigationSection activeSection={activeSection} onSectionChange={onSectionChange} />
    ) : null}
    <ChildrenSection
      title={childrenTitle}
      containerClassName={childrenContainerClassName}
      contentClassName={childrenContentClassName}
    >
      {children}
    </ChildrenSection>
  </div>
);
