import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Chapter, LastReadMap } from '@/types';

export interface UseLastReadPageReturn {
  lastRead: LastReadMap;
  chapters: Chapter[];
  handleSectionChange: (section: SectionId) => void;
  removeLastRead: (surahId: string) => void;
}

export const useLastReadPage = (): UseLastReadPageReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const { lastRead, chapters, removeLastRead } = useBookmarks();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return (): void => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSectionChange = (section: SectionId): void => {
    const locale = getLocaleFromPathname(pathname) ?? 'en';
    if (section === 'bookmarks') {
      router.push(localizeHref('/bookmarks/folders', locale));
    } else if (section === 'pinned') {
      router.push(localizeHref('/bookmarks/pinned', locale));
    } else if (section === 'planner') {
      router.push(localizeHref('/bookmarks/planner', locale));
    } else {
      router.push(localizeHref('/bookmarks/last-read', locale));
    }
  };

  return {
    lastRead,
    chapters,
    handleSectionChange,
    removeLastRead,
  };
};
