'use client';

import React from 'react';

import { SettingsSidebar } from '@/app/(features)/surah/components';

import { MainContent } from './MainContent';
import { BookmarkFolderSidebar } from '../../components/BookmarkFolderSidebar';

import type { Bookmark, Folder, Verse } from '@/types';

interface BookmarkFolderViewProps {
  bookmarks: Bookmark[];
  folder: Folder;
  isBookmarkSidebarOpen: boolean;
  onCloseSidebar: () => void;
  onVerseSelect: (verseId: string) => void;
  onBack: () => void;
  isHidden: boolean;
  folderName: string;
  activeVerseId?: string;
  verses: Verse[];
  displayVerses: Verse[];
  loadingVerses: Set<string>;
  onOpenTranslationPanel: () => void;
  onCloseTranslationPanel: () => void;
  isTranslationPanelOpen: boolean;
  selectedTranslationName?: string;
  onOpenWordPanel: () => void;
  onCloseWordPanel: () => void;
  isWordPanelOpen: boolean;
  selectedWordLanguageName?: string;
}

export function BookmarkFolderView({
  bookmarks,
  folder,
  isBookmarkSidebarOpen,
  onCloseSidebar,
  onVerseSelect,
  onBack,
  isHidden,
  folderName,
  activeVerseId,
  verses,
  displayVerses,
  loadingVerses,
  onOpenTranslationPanel,
  onCloseTranslationPanel,
  isTranslationPanelOpen,
  selectedTranslationName,
  onOpenWordPanel,
  onCloseWordPanel,
  isWordPanelOpen,
  selectedWordLanguageName,
}: BookmarkFolderViewProps): React.JSX.Element {
  return (
    <>
      <BookmarkFolderSidebar
        bookmarks={bookmarks}
        folder={folder}
        {...(activeVerseId && { activeVerseId })}
        onVerseSelect={onVerseSelect}
        onBack={onBack}
        isOpen={isBookmarkSidebarOpen}
        onClose={onCloseSidebar}
      />

      <MainContent
        isHidden={isHidden}
        folderName={folderName}
        activeVerseId={activeVerseId}
        verses={verses}
        displayVerses={displayVerses}
        loadingVerses={loadingVerses}
        onNavigateToBookmarks={onBack}
      />

      <SettingsSidebar
        onTranslationPanelOpen={onOpenTranslationPanel}
        onWordLanguagePanelOpen={onOpenWordPanel}
        onReadingPanelOpen={() => {}}
        selectedTranslationName={selectedTranslationName}
        selectedWordLanguageName={selectedWordLanguageName}
        isTranslationPanelOpen={isTranslationPanelOpen}
        onTranslationPanelClose={onCloseTranslationPanel}
        isWordLanguagePanelOpen={isWordPanelOpen}
        onWordLanguagePanelClose={onCloseWordPanel}
      />
    </>
  );
}
