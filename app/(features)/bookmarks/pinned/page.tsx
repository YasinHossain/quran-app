'use client';

import React, { useCallback } from 'react';

import { useBookmarkFolderPanels } from '@/app/(features)/bookmarks/[folderId]/hooks';
import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';
import { SurahWorkspaceSettings } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceSettings';
import { usePrefetchSingleVerse } from '@/app/shared/hooks/useSingleVerse';

import { PinnedHeader, PinnedSettingsSidebar, PinnedVersesList } from './components';
import { usePinnedPage } from './hooks/usePinnedPage';

export default function PinnedAyahPage(): React.JSX.Element {
  const { bookmarks, isLoading, handleSectionChange } = usePinnedPage();
  const prefetchSingleVerse = usePrefetchSingleVerse();
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

  const verseTargets = React.useMemo(() => {
    if (!bookmarks.length) return [];
    return bookmarks
      .map((bookmark) => bookmark.verseKey ?? (bookmark.verseId ? String(bookmark.verseId) : null))
      .filter((value): value is string => Boolean(value));
  }, [bookmarks]);

  React.useEffect(() => {
    if (verseTargets.length === 0) return;
    void prefetchSingleVerse(verseTargets);
  }, [prefetchSingleVerse, verseTargets]);

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
        <PinnedVersesList bookmarks={bookmarks} isLoading={isLoading} />
      </BookmarksLayout>
    </>
  );
}
