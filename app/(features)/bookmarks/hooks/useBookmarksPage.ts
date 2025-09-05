import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useModal } from '@/app/shared/hooks/useModal';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

export const useBookmarksPage = () => {
  const { folders } = useBookmarks();
  const modal = useModal();
  const [sortBy] = useState<'recent' | 'name-asc' | 'name-desc' | 'most-verses'>('recent');
  const router = useRouter();

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const filteredFolders = folders;

  const sortedFolders = useMemo(() => {
    const items = [...filteredFolders];
    switch (sortBy) {
      case 'name-asc':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case 'most-verses':
        return items.sort((a, b) => b.bookmarks.length - a.bookmarks.length);
      case 'recent':
      default:
        return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
  }, [filteredFolders, sortBy]);

  const handleFolderSelect = (folderId: string) => {
    router.push(`/bookmarks/${folderId}`);
  };

  const handleSectionChange = (section: SectionId) => {
    if (section === 'pinned') {
      router.push('/bookmarks/pinned');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else if (section === 'memorization') {
      router.push('/bookmarks/memorization');
    } else {
      router.push('/bookmarks');
    }
  };

  const handleVerseClick = (verseKey: string) => {
    const [surahId] = verseKey.split(':');
    router.push(`/surah/${surahId}#verse-${verseKey}`);
  };

  return {
    folders,
    sortedFolders,
    modal,
    handleFolderSelect,
    handleSectionChange,
    handleVerseClick,
  };
};
