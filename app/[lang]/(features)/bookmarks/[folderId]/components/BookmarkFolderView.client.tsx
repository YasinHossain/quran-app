'use client';

import React from 'react';

import {
  BookmarkFolderMobileSidebar,
  BookmarkFolderDesktopWorkspace,
} from './BookmarkFolderViewParts.client';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Bookmark, Folder } from '@/types';

interface BookmarkFolderViewProps {
  bookmarks: Bookmark[];
  folder: Folder;
  isBookmarkSidebarOpen: boolean;
  onCloseSidebar: () => void;
  onBack: () => void;
  folderName: string;
  onOpenTranslationPanel: () => void;
  onCloseTranslationPanel: () => void;
  isTranslationPanelOpen: boolean;
  selectedTranslationName?: string | undefined;
  onOpenWordPanel: () => void;
  onCloseWordPanel: () => void;
  isWordPanelOpen: boolean;
  selectedWordLanguageName?: string | undefined;
  onSectionChange: (section: SectionId) => void;
}

export function BookmarkFolderView({
  bookmarks,
  folder,
  isBookmarkSidebarOpen,
  onCloseSidebar,
  onBack,
  folderName,
  onOpenTranslationPanel,
  onCloseTranslationPanel,
  isTranslationPanelOpen,
  selectedTranslationName,
  onOpenWordPanel,
  onCloseWordPanel,
  isWordPanelOpen,
  selectedWordLanguageName,
  onSectionChange,
}: BookmarkFolderViewProps): React.JSX.Element {
  return (
    <>
      <BookmarkFolderMobileSidebar
        isOpen={isBookmarkSidebarOpen}
        onClose={onCloseSidebar}
        onBack={onBack}
        onSectionChange={onSectionChange}
        bookmarks={bookmarks}
        folder={folder}
      />

      <BookmarkFolderDesktopWorkspace
        bookmarks={bookmarks}
        folder={folder}
        onBack={onBack}
        folderName={folderName}
        onOpenTranslationPanel={onOpenTranslationPanel}
        onCloseTranslationPanel={onCloseTranslationPanel}
        isTranslationPanelOpen={isTranslationPanelOpen}
        selectedTranslationName={selectedTranslationName}
        onOpenWordPanel={onOpenWordPanel}
        onCloseWordPanel={onCloseWordPanel}
        isWordPanelOpen={isWordPanelOpen}
        selectedWordLanguageName={selectedWordLanguageName}
        onSectionChange={onSectionChange}
      />
    </>
  );
}

// Desktop workspace composed from parts for readability
