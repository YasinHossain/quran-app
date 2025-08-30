'use client';

import { useState, useCallback } from 'react';
import { BookmarkService } from '@/src/domain/services/BookmarkService';
import { Bookmark } from '@/src/domain/entities/Bookmark';
import { BookmarkAlreadyExistsError, VerseNotFoundError } from '@/src/domain/errors/DomainErrors';

interface UseBookmarkServiceProps {
  bookmarkService: BookmarkService;
  userId: string;
}

export const useBookmarkService = ({ bookmarkService, userId }: UseBookmarkServiceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookmarkVerse = useCallback(
    async (
      surahId: number,
      ayahNumber: number,
      notes?: string,
      tags?: string[]
    ): Promise<Bookmark | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const bookmark = await bookmarkService.bookmarkVerse(
          userId,
          surahId,
          ayahNumber,
          notes,
          tags
        );
        return bookmark;
      } catch (err) {
        if (err instanceof BookmarkAlreadyExistsError) {
          setError('Verse is already bookmarked');
        } else if (err instanceof VerseNotFoundError) {
          setError('Verse not found');
        } else {
          setError('Failed to bookmark verse');
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [bookmarkService, userId]
  );

  const removeBookmark = useCallback(
    async (bookmarkId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const success = await bookmarkService.removeBookmark(bookmarkId);
        return success;
      } catch (err) {
        setError('Failed to remove bookmark');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bookmarkService]
  );

  const getUserBookmarks = useCallback(async (): Promise<Bookmark[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const bookmarks = await bookmarkService.getUserBookmarks(userId);
      return bookmarks;
    } catch (err) {
      setError('Failed to load bookmarks');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [bookmarkService, userId]);

  const isBookmarked = useCallback(
    async (surahId: number, ayahNumber: number): Promise<boolean> => {
      try {
        return await bookmarkService.isBookmarked(userId, surahId, ayahNumber);
      } catch (err) {
        return false;
      }
    },
    [bookmarkService, userId]
  );

  return {
    bookmarkVerse,
    removeBookmark,
    getUserBookmarks,
    isBookmarked,
    isLoading,
    error,
  };
};
