'use client';

import React from 'react';

import { usePrefetchSingleVerse } from '@/app/shared/hooks/useSingleVerse';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { BookmarkFolderView } from './components/BookmarkFolderView.client';
import { FolderNotFound } from './components/FolderNotFound';
import { useBookmarkFolderController } from './hooks/useBookmarkFolderController';

interface BookmarkFolderClientProps {
  folderId: string;
}

// Presentational view extracted to reduce function/file size

/**
 * Client component for displaying bookmark folder contents with sidebar navigation.
 * Handles folder data loading, verse display, and panel management.
 */
export function BookmarkFolderClient({ folderId }: BookmarkFolderClientProps): React.JSX.Element {
  logger.debug('BookmarkFolderClient rendering', { folderId });
  const controller = useBookmarkFolderController(folderId);

  if (!controller.folder) {
    return <FolderNotFound />;
  }

  // Prefetch first 20 bookmarks to mitigate waterfall loading
  const prefetch = usePrefetchSingleVerse();

  React.useEffect(() => {
    const targets = controller.bookmarks
      .slice(0, 20)
      .map((b) => (b.verseKey ? String(b.verseKey) : b.verseId ? String(b.verseId) : null));

    if (targets.length > 0) {
      void prefetch(targets);
    }
  }, [controller.bookmarks, prefetch]);

  return (
    <BookmarkFolderView
      bookmarks={controller.bookmarks}
      folder={controller.folder}
      isBookmarkSidebarOpen={controller.isBookmarkSidebarOpen}
      onCloseSidebar={() => controller.setBookmarkSidebarOpen(false)}
      onBack={controller.handleNavigateToBookmarks}
      folderName={controller.folder.name}
      onOpenTranslationPanel={() => controller.setIsTranslationPanelOpen(true)}
      onCloseTranslationPanel={() => controller.setIsTranslationPanelOpen(false)}
      isTranslationPanelOpen={controller.isTranslationPanelOpen}
      selectedTranslationName={controller.selectedTranslationName}
      onOpenWordPanel={() => controller.setIsWordPanelOpen(true)}
      onCloseWordPanel={() => controller.setIsWordPanelOpen(false)}
      isWordPanelOpen={controller.isWordPanelOpen}
      selectedWordLanguageName={controller.selectedWordLanguageName}
      onSectionChange={controller.handleSectionChange}
    />
  );
}
