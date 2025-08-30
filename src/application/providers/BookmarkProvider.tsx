'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { Bookmark } from '@/src/domain/entities/Bookmark';
import { useDomainServices } from './DomainServiceProvider';
import { useBookmarkService } from '@/src/presentation/hooks/domain/useBookmarkService';

interface BookmarkContextValue {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  bookmarkVerse: (
    surahId: number,
    ayahNumber: number,
    notes?: string,
    tags?: string[]
  ) => Promise<boolean>;
  removeBookmark: (bookmarkId: string) => Promise<boolean>;
  isBookmarked: (surahId: number, ayahNumber: number) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

interface BookmarkProviderProps {
  userId: string;
  children: ReactNode;
}

export const BookmarkProvider = ({ userId, children }: BookmarkProviderProps) => {
  const { bookmarkService } = useDomainServices();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const {
    bookmarkVerse: domainBookmarkVerse,
    removeBookmark: domainRemoveBookmark,
    getUserBookmarks,
    isBookmarked,
    isLoading,
    error,
  } = useBookmarkService({ bookmarkService, userId });

  const refreshBookmarks = useCallback(async () => {
    const userBookmarks = await getUserBookmarks();
    setBookmarks(userBookmarks);
  }, [getUserBookmarks]);

  const bookmarkVerse = useCallback(
    async (
      surahId: number,
      ayahNumber: number,
      notes?: string,
      tags?: string[]
    ): Promise<boolean> => {
      const bookmark = await domainBookmarkVerse(surahId, ayahNumber, notes, tags);
      if (bookmark) {
        setBookmarks((prev) => [...prev, bookmark]);
        return true;
      }
      return false;
    },
    [domainBookmarkVerse]
  );

  const removeBookmark = useCallback(
    async (bookmarkId: string): Promise<boolean> => {
      const success = await domainRemoveBookmark(bookmarkId);
      if (success) {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
        return true;
      }
      return false;
    },
    [domainRemoveBookmark]
  );

  // Load bookmarks on mount
  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  const value: BookmarkContextValue = {
    bookmarks,
    isLoading,
    error,
    bookmarkVerse,
    removeBookmark,
    isBookmarked,
    refreshBookmarks,
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

export const useBookmarks = (): BookmarkContextValue => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
