'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useBookmarkFolderData, useBookmarkFolderPanels } from './index';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

export type BookmarkFolderControllerReturn = {
  isBookmarkSidebarOpen: boolean;
  setBookmarkSidebarOpen: (open: boolean) => void;
  folder: import('@/types').Folder | undefined;
  bookmarks: import('@/types').Bookmark[];
  isTranslationPanelOpen: boolean;
  setIsTranslationPanelOpen: (open: boolean) => void;
  isWordPanelOpen: boolean;
  setIsWordPanelOpen: (open: boolean) => void;
  selectedTranslationName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
  handleNavigateToBookmarks: () => void;
  handleSectionChange: (section: SectionId) => void;
};

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
  handleSectionChange: (section: SectionId) => void;
} {
  const handleNavigateToBookmarks = (): void => {
    router.push('/bookmarks');
  };

  const handleSectionChange = (section: SectionId): void => {
    switch (section) {
      case 'pinned':
        router.push('/bookmarks/pinned');
        break;
      case 'last-read':
        router.push('/bookmarks/last-read');
        break;
      case 'planner':
        router.push('/bookmarks/planner');
        break;
      default:
        router.push('/bookmarks');
        break;
    }
  };

  return { handleNavigateToBookmarks, handleSectionChange };
}

export function useBookmarkFolderController(folderId: string): BookmarkFolderControllerReturn {
  logger.debug('BookmarkFolderClient rendering', { folderId });
  const router = useRouter();
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  const { folder, bookmarks } = useBookmarkFolderData({ folderId });
  const {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } = useBookmarkFolderPanels();

  useBodyOverflow();
  const { handleNavigateToBookmarks, handleSectionChange } = useNavigationHandler(router);

  return {
    isBookmarkSidebarOpen,
    setBookmarkSidebarOpen,
    folder,
    bookmarks,
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
    handleNavigateToBookmarks,
    handleSectionChange,
  } as const;
}
