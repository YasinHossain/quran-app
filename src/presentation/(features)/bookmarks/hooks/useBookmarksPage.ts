import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/presentation/providers/BookmarkContext';
import { useModal } from '@/presentation/shared/hooks/useModal';
import type { SectionId } from '@/presentation/shared/ui/cards/BookmarkNavigationCard';
import { bookmarkService } from '@/application/BookmarkService';

export const useBookmarksPage = () => {
  const { folders } = useBookmarks();
  const modal = useModal();
  const [sortBy] = useState<'recent' | 'name-asc' | 'name-desc' | 'most-verses'>('recent');
  const router = useRouter();

  React.useEffect(() => {
    bookmarkService.lockBodyScroll();
    return () => {
      bookmarkService.unlockBodyScroll();
    };
  }, []);

  const filteredFolders = folders;

  const sortedFolders = useMemo(
    () => bookmarkService.getSortedFolders(filteredFolders, sortBy),
    [filteredFolders, sortBy]
  );

  const handleFolderSelect = (folderId: string) => {
    bookmarkService.navigateToFolder(router, folderId);
  };

  const handleSectionChange = (section: SectionId) => {
    bookmarkService.navigateToSection(router, section);
  };

  const handleVerseClick = (verseKey: string) => {
    bookmarkService.navigateToVerse(router, verseKey);
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
