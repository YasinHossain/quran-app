'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Bookmark } from '@/types';

interface UsePinnedPageReturn {
  bookmarks: Bookmark[];
  isLoading: boolean;
  handleSectionChange: (section: SectionId) => void;
}

export const usePinnedPage = (): UsePinnedPageReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const { pinnedVerses, chapters } = useBookmarks();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const isLoading = pinnedVerses.length > 0 && chapters.length === 0;

  const handleSectionChange = (section: SectionId): void => {
    const locale = getLocaleFromPathname(pathname) ?? 'en';
    if (section === 'bookmarks') {
      router.push(localizeHref('/bookmarks/folders', locale));
    } else if (section === 'last-read') {
      router.push(localizeHref('/bookmarks/last-read', locale));
    } else if (section === 'planner') {
      router.push(localizeHref('/bookmarks/planner', locale));
    } else {
      router.push(localizeHref('/bookmarks/pinned', locale));
    }
  };

  return {
    bookmarks: pinnedVerses,
    isLoading,
    handleSectionChange,
  };
};
