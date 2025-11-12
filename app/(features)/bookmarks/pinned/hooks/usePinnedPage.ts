'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Bookmark } from '@/types';

interface UsePinnedPageReturn {
  bookmarks: Bookmark[];
  isLoading: boolean;
  handleSectionChange: (section: SectionId) => void;
}

export const usePinnedPage = (): UsePinnedPageReturn => {
  const router = useRouter();
  const { pinnedVerses, chapters } = useBookmarks();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const isLoading = pinnedVerses.length > 0 && chapters.length === 0;

  const handleSectionChange = (section: SectionId): void => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else if (section === 'planner') {
      router.push('/bookmarks/planner');
    } else {
      router.push('/bookmarks/pinned');
    }
  };

  return {
    bookmarks: pinnedVerses,
    isLoading,
    handleSectionChange,
  };
};
