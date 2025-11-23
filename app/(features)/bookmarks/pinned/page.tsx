'use client';

import React, { useCallback } from 'react';

import { useBookmarkFolderPanels } from '@/app/(features)/bookmarks/[folderId]/hooks';
import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';
import { SettingsSidebar } from '@/app/shared/reader/settings/SettingsSidebar';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';
import { usePrefetchSingleVerse } from '@/app/shared/hooks/useSingleVerse';

import { PinnedHeader, PinnedVersesList } from './components';
import { usePinnedPage } from './hooks/usePinnedPage';

export default function PinnedAyahPage(): React.JSX.Element {
  const { bookmarks, isLoading, handleSectionChange } = usePinnedPage();
  const prefetchSingleVerse = usePrefetchSingleVerse();
  const panel = usePinnedPanelToggles();
  usePrefetchPinnedVerses(bookmarks, prefetchSingleVerse);

  return (
    <>
      <div className="lg:hidden">
        <SettingsSidebar
          pageType="bookmarks"
          readerTabsEnabled={false}
          selectedTranslationName={panel.selectedTranslationName ?? ''}
          selectedWordLanguageName={panel.selectedWordLanguageName ?? ''}
          onTranslationPanelOpen={panel.handleTranslationPanelOpen}
          onTranslationPanelClose={panel.handleTranslationPanelClose}
          isTranslationPanelOpen={panel.isTranslationPanelOpen}
          onWordLanguagePanelOpen={panel.handleWordPanelOpen}
          onWordLanguagePanelClose={panel.handleWordPanelClose}
          isWordLanguagePanelOpen={panel.isWordPanelOpen}
        />
      </div>

      <BookmarksLayout
        activeSection="pinned"
        onSectionChange={handleSectionChange}
        rightSidebar={
          <SettingsSidebarContent
            readerTabsEnabled={false}
            selectedTranslationName={panel.selectedTranslationName ?? ''}
            selectedWordLanguageName={panel.selectedWordLanguageName ?? ''}
            onTranslationPanelOpen={panel.handleTranslationPanelOpen}
            onTranslationPanelClose={panel.handleTranslationPanelClose}
            isTranslationPanelOpen={panel.isTranslationPanelOpen}
            onWordLanguagePanelOpen={panel.handleWordPanelOpen}
            onWordLanguagePanelClose={panel.handleWordPanelClose}
            isWordLanguagePanelOpen={panel.isWordPanelOpen}
          />
        }
      >
        <PinnedHeader />
        <PinnedVersesList bookmarks={bookmarks} isLoading={isLoading} />
      </BookmarksLayout>
    </>
  );
}

function usePinnedPanelToggles(): {
  isTranslationPanelOpen: boolean;
  isWordPanelOpen: boolean;
  selectedTranslationName?: string;
  selectedWordLanguageName?: string;
  handleTranslationPanelOpen: () => void;
  handleTranslationPanelClose: () => void;
  handleWordPanelOpen: () => void;
  handleWordPanelClose: () => void;
} {
  const {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } = useBookmarkFolderPanels();

  const handleTranslationPanelOpen = useCallback(
    () => setIsTranslationPanelOpen(true),
    [setIsTranslationPanelOpen]
  );
  const handleTranslationPanelClose = useCallback(
    () => setIsTranslationPanelOpen(false),
    [setIsTranslationPanelOpen]
  );
  const handleWordPanelOpen = useCallback(() => setIsWordPanelOpen(true), [setIsWordPanelOpen]);
  const handleWordPanelClose = useCallback(() => setIsWordPanelOpen(false), [setIsWordPanelOpen]);

  return {
    isTranslationPanelOpen,
    isWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
    handleTranslationPanelOpen,
    handleTranslationPanelClose,
    handleWordPanelOpen,
    handleWordPanelClose,
  };
}

function usePrefetchPinnedVerses(
  bookmarks: Array<{ verseKey?: string; verseId: string }>,
  prefetchSingleVerse: (targets: string[]) => Promise<void>
): void {
  const verseTargets = React.useMemo(() => {
    if (!bookmarks.length) return [] as string[];
    return bookmarks
      .map((bookmark) => bookmark.verseKey ?? (bookmark.verseId ? String(bookmark.verseId) : null))
      .filter((value): value is string => Boolean(value));
  }, [bookmarks]);

  React.useEffect(() => {
    if (verseTargets.length === 0) return;
    void prefetchSingleVerse(verseTargets);
  }, [prefetchSingleVerse, verseTargets]);
}
