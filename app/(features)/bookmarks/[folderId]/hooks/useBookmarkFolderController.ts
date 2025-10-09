'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useBookmarkFolderData, useBookmarkFolderPanels } from './index';

export type BookmarkFolderControllerReturn = {
  isBookmarkSidebarOpen: boolean;
  setBookmarkSidebarOpen: (open: boolean) => void;
  folder: import('@/types').Folder | undefined;
  bookmarks: import('@/types').Bookmark[];
  verses: Verse[];
  loadingVerses: Set<string>;
  isTranslationPanelOpen: boolean;
  setIsTranslationPanelOpen: (open: boolean) => void;
  isWordPanelOpen: boolean;
  setIsWordPanelOpen: (open: boolean) => void;
  selectedTranslationName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
  handleNavigateToBookmarks: () => void;
};

import type { Verse } from '@/types';

// Helper function to manage body overflow
function useBodyOverflow(): void {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
}

// Helper function to create navigation handler
function useNavigationHandler(router: ReturnType<typeof useRouter>): {
  handleNavigateToBookmarks: () => void;
} {
  const handleNavigateToBookmarks = (): void => {
    router.push('/bookmarks');
  };

  return { handleNavigateToBookmarks };
}

export function useBookmarkFolderController(folderId: string): BookmarkFolderControllerReturn {
  logger.debug('BookmarkFolderClient rendering', { folderId });
  const router = useRouter();
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
  const { handleNavigateToBookmarks } = useNavigationHandler(router);

  return {
    isBookmarkSidebarOpen,
    setBookmarkSidebarOpen,
    folder,
    bookmarks,
    verses,
    loadingVerses,
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
    handleNavigateToBookmarks,
  } as const;
}
