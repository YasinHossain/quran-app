'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useSidebar } from '@/app/providers/SidebarContext';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useBookmarkFolderData, useBookmarkFolderPanels } from './index';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
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

// Helper function to create navigation handler
function useNavigationHandler(
  router: ReturnType<typeof useRouter>,
  setBookmarkSidebarOpen: (open: boolean) => void,
  locale: UiLanguageCode
): {
  handleNavigateToBookmarks: () => void;
  handleSectionChange: (section: SectionId) => void;
} {
  const handleNavigateToBookmarks = (): void => {
    setBookmarkSidebarOpen(false);
    router.push(localizeHref('/bookmarks/folders', locale));
  };

  const handleSectionChange = (section: SectionId): void => {
    setBookmarkSidebarOpen(false);
    switch (section) {
      case 'pinned':
        router.push(localizeHref('/bookmarks/pinned', locale));
        break;
      case 'last-read':
        router.push(localizeHref('/bookmarks/last-read', locale));
        break;
      case 'planner':
        router.push(localizeHref('/bookmarks/planner', locale));
        break;
      default:
        router.push(localizeHref('/bookmarks', locale));
        break;
    }
  };

  return { handleNavigateToBookmarks, handleSectionChange };
}

export function useBookmarkFolderController(folderId: string): BookmarkFolderControllerReturn {
  logger.debug('BookmarkFolderClient rendering', { folderId });
  const router = useRouter();
  const pathname = usePathname();
  const locale = (getLocaleFromPathname(pathname) ?? 'en') as UiLanguageCode;
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

  const { handleNavigateToBookmarks, handleSectionChange } = useNavigationHandler(
    router,
    setBookmarkSidebarOpen,
    locale
  );

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
