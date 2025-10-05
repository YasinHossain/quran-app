'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useBookmarkFolderData, useBookmarkFolderPanels } from './index';

export type BookmarkFolderControllerReturn = {
  isHidden: boolean;
  activeVerseId: string | undefined;
  isBookmarkSidebarOpen: boolean;
  setBookmarkSidebarOpen: (open: boolean) => void;
  folder: import('@/types').Folder | undefined;
  bookmarks: import('@/types').Bookmark[];
  verses: Verse[];
  loadingVerses: Set<string>;
  displayVerses: Verse[];
  isTranslationPanelOpen: boolean;
  setIsTranslationPanelOpen: (open: boolean) => void;
  isWordPanelOpen: boolean;
  setIsWordPanelOpen: (open: boolean) => void;
  selectedTranslationName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
  handleVerseSelect: (verseId: string) => void;
  handleNavigateToBookmarks: () => void;
};

import type { Verse } from '@/types';

// Helper function to filter verses based on active verse selection
function useFilteredVerses(verses: Verse[], activeVerseId: string | undefined): Verse[] {
  return useMemo(() => {
    if (!verses.length) return [];
    if (!activeVerseId) return verses;
    return verses.filter((v) => String(v.id) === activeVerseId);
  }, [verses, activeVerseId]);
}

// Helper function to manage body overflow
function useBodyOverflow(): void {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
}

// Helper function to create event handlers
function useEventHandlers(
  activeVerseId: string | undefined,
  setActiveVerseId: (id: string | undefined) => void,
  setBookmarkSidebarOpen: (open: boolean) => void,
  router: ReturnType<typeof useRouter>
): { handleVerseSelect: (verseId: string) => void; handleNavigateToBookmarks: () => void } {
  const handleVerseSelect = (verseId: string): void => {
    setActiveVerseId(verseId === activeVerseId ? undefined : verseId);
    setBookmarkSidebarOpen(false);
  };

  const handleNavigateToBookmarks = (): void => {
    router.push('/bookmarks');
  };

  return { handleVerseSelect, handleNavigateToBookmarks };
}

export function useBookmarkFolderController(folderId: string): BookmarkFolderControllerReturn {
  logger.debug('BookmarkFolderClient rendering', { folderId });
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const [activeVerseId, setActiveVerseId] = useState<string | undefined>(undefined);
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  const { folder, bookmarks, verses, loadingVerses } = useBookmarkFolderData({ folderId });
  const {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } = useBookmarkFolderPanels();

  useBodyOverflow();
  const displayVerses = useFilteredVerses(verses, activeVerseId);
  const { handleVerseSelect, handleNavigateToBookmarks } = useEventHandlers(
    activeVerseId,
    setActiveVerseId,
    setBookmarkSidebarOpen,
    router
  );

  return {
    isHidden,
    activeVerseId,
    isBookmarkSidebarOpen,
    setBookmarkSidebarOpen,
    folder,
    bookmarks,
    verses,
    loadingVerses,
    displayVerses,
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
    handleVerseSelect,
    handleNavigateToBookmarks,
  } as const;
}
