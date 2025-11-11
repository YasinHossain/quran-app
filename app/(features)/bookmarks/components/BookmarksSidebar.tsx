'use client';

import React from 'react';

import { BaseSidebar } from '@/app/shared/components/BaseSidebar';

import { BookmarksContent } from './BookmarksContent';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

interface BookmarksSidebarProps {
  activeSection?: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
  children?: React.ReactNode;
  childrenTitle?: string | null;
  childrenContainerClassName?: string;
  childrenContentClassName?: string;
  showNavigation?: boolean;
  isOpen?: boolean;
  onClose?: (() => void) | undefined;
}

export const BookmarksSidebar = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  childrenTitle,
  childrenContainerClassName,
  childrenContentClassName,
  showNavigation,
  isOpen,
  onClose,
}: BookmarksSidebarProps): React.JSX.Element => {
  // If no isOpen/onClose provided, render content directly (for desktop sidebar)
  if (isOpen === undefined || onClose === undefined) {
    return (
      <BookmarksContent
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        childrenTitle={childrenTitle ?? null}
        {...(childrenContainerClassName !== undefined
          ? { childrenContainerClassName }
          : {})}
        {...(childrenContentClassName !== undefined
          ? { childrenContentClassName }
          : {})}
        {...(showNavigation !== undefined ? { showNavigation } : {})}
      >
        {children}
      </BookmarksContent>
    );
  }

  // Otherwise use BaseSidebar wrapper (for mobile overlay)
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      aria-label="Bookmarks navigation"
    >
      <BookmarksContent
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        childrenTitle={childrenTitle ?? null}
        {...(childrenContainerClassName !== undefined
          ? { childrenContainerClassName }
          : {})}
        {...(childrenContentClassName !== undefined
          ? { childrenContentClassName }
          : {})}
        {...(showNavigation !== undefined ? { showNavigation } : {})}
      >
        {children}
      </BookmarksContent>
    </BaseSidebar>
  );
};
