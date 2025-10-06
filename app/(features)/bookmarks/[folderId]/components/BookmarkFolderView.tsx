'use client';

import React from 'react';

import { MainContent } from './MainContent';
import { SettingsSidebar } from './SettingsSidebar';
import { Sidebar } from './Sidebar';
import { BookmarkVersesContent } from './BookmarkVersesContent';

import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';

import type { Bookmark, Folder, Verse } from '@/types';

interface SidebarProps {
  bookmarks: Bookmark[];
  folder: Folder;
  isBookmarkSidebarOpen: boolean;
  onCloseSidebar: () => void;
  onVerseSelect: (verseId: string) => void;
  onBack: () => void;
  activeVerseId?: string | undefined;
}

interface MainContentProps {
  isHidden: boolean;
  folderName: string;
  activeVerseId?: string | undefined;
  verses: Verse[];
  displayVerses: Verse[];
  loadingVerses: Set<string>;
  onBack: () => void;
}

interface SettingsProps {
  onOpenTranslationPanel: () => void;
  onCloseTranslationPanel: () => void;
  isTranslationPanelOpen: boolean;
  selectedTranslationName?: string | undefined;
  onOpenWordPanel: () => void;
  onCloseWordPanel: () => void;
  isWordPanelOpen: boolean;
  selectedWordLanguageName?: string | undefined;
}

interface BookmarkFolderViewProps extends SidebarProps, MainContentProps, SettingsProps {
  layout?: 'legacy' | 'workspace';
}

const renderSidebar = (sidebarProps: SidebarProps): React.JSX.Element => (
  <Sidebar
    bookmarks={sidebarProps.bookmarks}
    folder={sidebarProps.folder}
    {...(sidebarProps.activeVerseId && { activeVerseId: sidebarProps.activeVerseId })}
    onVerseSelect={sidebarProps.onVerseSelect}
    onBack={sidebarProps.onBack}
    isOpen={sidebarProps.isBookmarkSidebarOpen}
    onClose={sidebarProps.onCloseSidebar}
  />
);

const renderMainContent = (mainProps: MainContentProps): React.JSX.Element => (
  <MainContent
    isHidden={mainProps.isHidden}
    folderName={mainProps.folderName}
    activeVerseId={mainProps.activeVerseId}
    verses={mainProps.verses}
    displayVerses={mainProps.displayVerses}
    loadingVerses={mainProps.loadingVerses}
    onNavigateToBookmarks={mainProps.onBack}
  />
);

const renderWorkspaceMain = (mainProps: MainContentProps): React.JSX.Element => (
  <WorkspaceMain
    reserveLeftSpace
    reserveRightSpace
    data-slot="bookmarks-workspace-main"
    contentClassName="pb-6"
  >
    <BookmarkVersesContent
      onNavigateToBookmarks={mainProps.onBack}
      folderName={mainProps.folderName}
      activeVerseId={mainProps.activeVerseId}
      verses={mainProps.verses}
      displayVerses={mainProps.displayVerses}
      loadingVerses={mainProps.loadingVerses}
    />
  </WorkspaceMain>
);

const renderSettingsSidebar = (settingsProps: SettingsProps): React.JSX.Element => (
  <SettingsSidebar
    onTranslationPanelOpen={settingsProps.onOpenTranslationPanel}
    onWordLanguagePanelOpen={settingsProps.onOpenWordPanel}
    onReadingPanelOpen={() => {}}
    selectedTranslationName={settingsProps.selectedTranslationName}
    selectedWordLanguageName={settingsProps.selectedWordLanguageName}
    isTranslationPanelOpen={settingsProps.isTranslationPanelOpen}
    onTranslationPanelClose={settingsProps.onCloseTranslationPanel}
    isWordPanelOpen={settingsProps.isWordPanelOpen}
    onWordPanelClose={settingsProps.onCloseWordPanel}
  />
);

export function BookmarkFolderView({ layout = 'legacy', ...props }: BookmarkFolderViewProps): React.JSX.Element {
  if (layout === 'workspace') {
    return (
      <>
        {renderSidebar(props)}
        {renderSettingsSidebar(props)}
        <ThreeColumnWorkspace center={renderWorkspaceMain(props)} />
      </>
    );
  }

  return (
    <>
      {renderSidebar(props)}
      {renderMainContent(props)}
      {renderSettingsSidebar(props)}
    </>
  );
}
