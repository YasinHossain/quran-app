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
  const contentProps = buildBookmarksContentProps({
    activeSection,
    onSectionChange,
    childrenTitle,
    childrenContainerClassName,
    childrenContentClassName,
    showNavigation,
  });
  const renderedContent = <BookmarksContent {...contentProps}>{children}</BookmarksContent>;

  // If no isOpen/onClose provided, render content directly (for desktop sidebar)
  if (isOpen === undefined || onClose === undefined) {
    return renderedContent;
  }

  // Otherwise use BaseSidebar wrapper (for mobile overlay)
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      aria-label="Bookmarks navigation"
    >
      {renderedContent}
    </BaseSidebar>
  );
};

const buildBookmarksContentProps = ({
  activeSection,
  onSectionChange,
  childrenTitle,
  childrenContainerClassName,
  childrenContentClassName,
  showNavigation,
}: Pick<
  BookmarksSidebarProps,
  | 'activeSection'
  | 'onSectionChange'
  | 'childrenTitle'
  | 'childrenContainerClassName'
  | 'childrenContentClassName'
  | 'showNavigation'
>): React.ComponentProps<typeof BookmarksContent> => {
  const contentProps: React.ComponentProps<typeof BookmarksContent> = {
    activeSection,
    onSectionChange,
    childrenTitle: childrenTitle ?? null,
  };

  if (childrenContainerClassName !== undefined) {
    contentProps.childrenContainerClassName = childrenContainerClassName;
  }

  if (childrenContentClassName !== undefined) {
    contentProps.childrenContentClassName = childrenContentClassName;
  }

  if (showNavigation !== undefined) {
    contentProps.showNavigation = showNavigation;
  }

  return contentProps;
};
