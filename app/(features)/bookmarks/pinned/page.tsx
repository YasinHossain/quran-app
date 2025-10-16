'use client';

import React, { useCallback } from 'react';

import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';
import { useBookmarkFolderPanels } from '@/app/(features)/bookmarks/[folderId]/hooks';
import { SurahWorkspaceSettings } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceSettings';

import { PinnedHeader, PinnedSettingsSidebar, PinnedVersesList } from './components';
import { usePinnedPage } from './hooks/usePinnedPage';

export default function PinnedAyahPage(): React.JSX.Element {
  const { entries, isLoading, error, handleSectionChange } = usePinnedPage();
  const {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } = useBookmarkFolderPanels();

  const handleTranslationPanelOpen = useCallback(() => {
    setIsTranslationPanelOpen(true);
  }, [setIsTranslationPanelOpen]);

  const handleTranslationPanelClose = useCallback(() => {
    setIsTranslationPanelOpen(false);
  }, [setIsTranslationPanelOpen]);

  const handleWordPanelOpen = useCallback(() => {
    setIsWordPanelOpen(true);
  }, [setIsWordPanelOpen]);

  const handleWordPanelClose = useCallback(() => {
    setIsWordPanelOpen(false);
  }, [setIsWordPanelOpen]);

  return (
    <>
      <div className="lg:hidden">
        <PinnedSettingsSidebar
          onTranslationPanelOpen={handleTranslationPanelOpen}
          onTranslationPanelClose={handleTranslationPanelClose}
          onWordLanguagePanelOpen={handleWordPanelOpen}
          onWordPanelClose={handleWordPanelClose}
          selectedTranslationName={selectedTranslationName}
          selectedWordLanguageName={selectedWordLanguageName}
          isTranslationPanelOpen={isTranslationPanelOpen}
          isWordPanelOpen={isWordPanelOpen}
        />
      </div>

      <BookmarksLayout
        activeSection="pinned"
        onSectionChange={handleSectionChange}
        rightSidebar={
          <SurahWorkspaceSettings
            selectedTranslationName={selectedTranslationName}
            selectedWordLanguageName={selectedWordLanguageName}
            isTranslationPanelOpen={isTranslationPanelOpen}
            onTranslationPanelOpen={handleTranslationPanelOpen}
            onTranslationPanelClose={handleTranslationPanelClose}
            isWordLanguagePanelOpen={isWordPanelOpen}
            onWordLanguagePanelOpen={handleWordPanelOpen}
            onWordLanguagePanelClose={handleWordPanelClose}
          />
        }
      >
        <PinnedHeader />
        <PinnedVersesList entries={entries} isLoading={isLoading} error={error} />
      </BookmarksLayout>
    </>
  );
}
