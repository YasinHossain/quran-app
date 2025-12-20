'use client';

import React from 'react';

import { BaseSidebar } from '@/app/shared/components/BaseSidebar';
import { ThreeColumnWorkspace, WorkspaceMain } from '@/app/shared/reader';
import { SettingsSidebar } from '@/app/shared/reader/settings/SettingsSidebar';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';

import { BookmarkFolderSidebarContent } from './BookmarkFolderSidebarContent';
import { BookmarkVersesContent } from './BookmarkVersesContent';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Bookmark, Folder } from '@/types';

export function BookmarkFolderMobileSidebar({
  isOpen,
  onClose,
  onBack,
  bookmarks,
  folder,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSectionChange: (section: SectionId) => void;
  bookmarks: Bookmark[];
  folder: Folder;
}): React.JSX.Element {
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      desktopBreakpoint="xl"
      aria-label="Folder details"
      className="xl:hidden"
    >
      <BookmarkFolderSidebarContent
        bookmarks={bookmarks}
        folder={folder}
        onBack={onBack}
        onClose={onClose}
      />
    </BaseSidebar>
  );
}

export function LeftBookmarksSidebar({
  bookmarks,
  folder,
  onBack,
}: {
  onSectionChange: (section: SectionId) => void;
  bookmarks: Bookmark[];
  folder: Folder;
  onBack: () => void;
}): React.JSX.Element {
  return <BookmarkFolderSidebarContent bookmarks={bookmarks} folder={folder} onBack={onBack} />;
}

export function CenterWorkspaceContent({
  onBack,
  folderName,
  bookmarks,
}: {
  onBack: () => void;
  folderName: string;
  bookmarks: Bookmark[];
}): React.JSX.Element {
  return (
    <WorkspaceMain data-slot="bookmarks-workspace-main" contentClassName="pb-6">
      <BookmarkVersesContent
        onNavigateToBookmarks={onBack}
        folderName={folderName}
        bookmarks={bookmarks}
      />
    </WorkspaceMain>
  );
}

export function RightSettingsPanel({
  isTranslationPanelOpen,
  onOpenTranslationPanel,
  onCloseTranslationPanel,
  isWordPanelOpen,
  onOpenWordPanel,
  onCloseWordPanel,
  selectedTranslationName,
  selectedWordLanguageName,
}: {
  isTranslationPanelOpen: boolean;
  onOpenTranslationPanel: () => void;
  onCloseTranslationPanel: () => void;
  isWordPanelOpen: boolean;
  onOpenWordPanel: () => void;
  onCloseWordPanel: () => void;
  selectedTranslationName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
}): React.JSX.Element {
  return (
    <SettingsSidebarContent
      readerTabsEnabled={false}
      selectedTranslationName={selectedTranslationName ?? ''}
      selectedWordLanguageName={selectedWordLanguageName ?? ''}
      onTranslationPanelOpen={onOpenTranslationPanel}
      onTranslationPanelClose={onCloseTranslationPanel}
      isTranslationPanelOpen={isTranslationPanelOpen}
      onWordLanguagePanelOpen={onOpenWordPanel}
      onWordLanguagePanelClose={onCloseWordPanel}
      isWordLanguagePanelOpen={isWordPanelOpen}
    />
  );
}

export interface PanelTogglesProps {
  isTranslationPanelOpen: boolean;
  isWordPanelOpen: boolean;
  selectedTranslationName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
  onOpenTranslationPanel: () => void;
  onCloseTranslationPanel: () => void;
  onOpenWordPanel: () => void;
  onCloseWordPanel: () => void;
}

export interface DesktopWorkspaceProps extends PanelTogglesProps {
  bookmarks: Bookmark[];
  folder: Folder;
  onBack: () => void;
  folderName: string;
  onSectionChange: (section: SectionId) => void;
}

export function BookmarkFolderDesktopWorkspace(props: DesktopWorkspaceProps): React.JSX.Element {
  return (
    <>
      <div className="lg:hidden">
        <SettingsSidebar
          pageType="bookmarks"
          readerTabsEnabled={false}
          selectedTranslationName={props.selectedTranslationName ?? ''}
          selectedWordLanguageName={props.selectedWordLanguageName ?? ''}
          onTranslationPanelOpen={props.onOpenTranslationPanel}
          onTranslationPanelClose={props.onCloseTranslationPanel}
          isTranslationPanelOpen={props.isTranslationPanelOpen}
          onWordLanguagePanelOpen={props.onOpenWordPanel}
          onWordLanguagePanelClose={props.onCloseWordPanel}
          isWordLanguagePanelOpen={props.isWordPanelOpen}
        />
      </div>
      <DesktopThreeColumn {...props} />
    </>
  );
}

export function DesktopThreeColumn(props: DesktopWorkspaceProps): React.JSX.Element {
  const settings: PanelTogglesProps = props;
  return (
    <ThreeColumnWorkspace
      left={
        <LeftBookmarksSidebar
          onSectionChange={props.onSectionChange}
          bookmarks={props.bookmarks}
          folder={props.folder}
          onBack={props.onBack}
        />
      }
      center={
        <CenterWorkspaceContent
          onBack={props.onBack}
          folderName={props.folderName}
          bookmarks={props.bookmarks}
        />
      }
      right={<RightSettingsPanel {...settings} />}
      leftContainerClassName="lg:pt-2"
    />
  );
}
