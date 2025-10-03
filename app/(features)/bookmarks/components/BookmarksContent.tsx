'use client';

import React, { useState } from 'react';

import { NavigationSection, FolderSection, ChildrenSection } from './bookmarks-content';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Folder } from '@/types/bookmark';

interface BookmarksContentProps {
  activeSection?: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
  children?: React.ReactNode;
  folders?: Folder[];
  onVerseClick?: ((verseKey: string) => void) | undefined;
}

export const BookmarksContent = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  folders = [],
  onVerseClick,
}: BookmarksContentProps): React.JSX.Element => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolderExpansion = (folderId: string): void => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y">
      <NavigationSection activeSection={activeSection} onSectionChange={onSectionChange} />
      <FolderSection
        folders={folders}
        expandedFolders={expandedFolders}
        toggleFolderExpansion={toggleFolderExpansion}
        onVerseClick={onVerseClick}
      />
      <ChildrenSection>{children}</ChildrenSection>
    </div>
  );
};
