'use client';

import React from 'react';

import { BookmarkFolderSidebarPanel } from '@/app/(features)/bookmarks/components/BookmarkFolderSidebar';
import { SurahWorkspaceSettings } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceSettings';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';

import { BookmarkVersesContent } from './BookmarkVersesContent';
import { SettingsSidebar } from './SettingsSidebar';
import { Sidebar } from './Sidebar';

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
}: BookmarkFolderViewProps): React.JSX.Element {
  const surahWorkspaceSettingsProps = {
    isTranslationPanelOpen,
    onTranslationPanelOpen: onOpenTranslationPanel,
    onTranslationPanelClose: onCloseTranslationPanel,
    isWordLanguagePanelOpen: isWordPanelOpen,
    onWordLanguagePanelOpen: onOpenWordPanel,
    onWordLanguagePanelClose: onCloseWordPanel,
    ...(selectedTranslationName !== undefined ? { selectedTranslationName } : {}),
    ...(selectedWordLanguageName !== undefined ? { selectedWordLanguageName } : {}),
  };

  return (
    <>
      <div className="lg:hidden">
        <Sidebar
          bookmarks={bookmarks}
          folder={folder}
          onBack={onBack}
          isOpen={isBookmarkSidebarOpen}
          onClose={onCloseSidebar}
        />

        <SettingsSidebar
          onTranslationPanelOpen={onOpenTranslationPanel}
          onWordLanguagePanelOpen={onOpenWordPanel}
          onReadingPanelOpen={() => {}}
          selectedTranslationName={selectedTranslationName}
          selectedWordLanguageName={selectedWordLanguageName}
          isTranslationPanelOpen={isTranslationPanelOpen}
          onTranslationPanelClose={onCloseTranslationPanel}
          isWordPanelOpen={isWordPanelOpen}
          onWordPanelClose={onCloseWordPanel}
        />
      </div>

      <ThreeColumnWorkspace
        left={<BookmarkFolderSidebarPanel bookmarks={bookmarks} folder={folder} onBack={onBack} />}
        center={
          <WorkspaceMain data-slot="bookmarks-workspace-main" contentClassName="pb-6">
            <BookmarkVersesContent
              onNavigateToBookmarks={onBack}
              folderName={folderName}
              bookmarks={bookmarks}
            />
          </WorkspaceMain>
        }
        right={<SurahWorkspaceSettings {...surahWorkspaceSettingsProps} />}
      />
    </>
  );
}
