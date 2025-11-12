'use client';

import React from 'react';

import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

interface BookmarksMobileSidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  children?: React.ReactNode;
  childrenTitle?: string | null;
  childrenContainerClassName?: string;
  childrenContentClassName?: string;
  showNavigation?: boolean;
}

export const BookmarksMobileSidebarOverlay = ({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  children,
  childrenTitle,
  childrenContainerClassName,
  childrenContentClassName,
  showNavigation,
}: BookmarksMobileSidebarOverlayProps): React.JSX.Element => (
  <BookmarksSidebar
    activeSection={activeSection}
    onSectionChange={onSectionChange}
    isOpen={isOpen}
    onClose={onClose}
    {...(childrenTitle !== undefined ? { childrenTitle } : {})}
    {...(childrenContainerClassName !== undefined ? { childrenContainerClassName } : {})}
    {...(childrenContentClassName !== undefined ? { childrenContentClassName } : {})}
    {...(showNavigation !== undefined ? { showNavigation } : {})}
  >
    {children}
  </BookmarksSidebar>
);
