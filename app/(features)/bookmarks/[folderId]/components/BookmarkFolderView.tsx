'use client';

import React from 'react';

import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';
import { BookmarksMobileSidebarOverlay } from '@/app/(features)/bookmarks/components/shared/layout/BookmarksMobileSidebarOverlay';
import { SurahWorkspaceSettings } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceSettings';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';

import { BookmarkFolderSidebarContent } from './BookmarkFolderSidebarContent';
import { BookmarkVersesContent } from './BookmarkVersesContent';
import { SettingsSidebar } from './SettingsSidebar';

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
      <BookmarksMobileSidebarOverlay
        isOpen={isBookmarkSidebarOpen}
        onClose={onCloseSidebar}
        activeSection="bookmarks"
        onSectionChange={onSectionChange}
        childrenTitle={null}
        childrenContainerClassName="mt-0 pt-0 border-t-0"
        childrenContentClassName="space-y-0"
        showNavigation={false}
      >
        <BookmarkFolderSidebarContent
          bookmarks={bookmarks}
          folder={folder}
          onBack={onBack}
          onClose={onCloseSidebar}
        />
      </BookmarksMobileSidebarOverlay>

      <div className="lg:hidden">
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
        left={
          <BookmarksSidebar
            activeSection="bookmarks"
            onSectionChange={onSectionChange}
            childrenTitle={null}
            childrenContainerClassName="mt-0 pt-0 border-t-0"
            childrenContentClassName="space-y-0"
            showNavigation={false}
          >
            <BookmarkFolderSidebarContent bookmarks={bookmarks} folder={folder} onBack={onBack} />
          </BookmarksSidebar>
        }
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
