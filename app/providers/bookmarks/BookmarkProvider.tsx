'use client';

import { useCallback, useEffect, useState } from 'react';
import { Folder, Bookmark, Chapter, MemorizationPlan } from '@/types';
import { BookmarkContext } from './BookmarkContext';
import { BookmarkContextType } from './types';
import { useBookmarkService } from '@/src/application/hooks/useBookmarkService';
import { getServices } from '@/src/application/ServiceContainer';

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the clean architecture service instead of local state
  const bookmarkServiceHook = useBookmarkService();

  // Get service instances for additional operations
  const services = getServices();

  // Legacy state for features not yet migrated to clean architecture
  const [lastRead, setLastReadState] = useState<Record<string, number>>({});
  const [memorization, setMemorizationState] = useState<Record<string, MemorizationPlan>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Load initial data
  useEffect(() => {
    // Load bookmark data through clean architecture service
    bookmarkServiceHook.refreshData();

    // Load chapters (TODO: move to separate service)
    import('@/lib/api/chapters').then(({ getChapters }) => {
      getChapters()
        .then(setChapters)
        .catch(() => {});
    });
  }, [bookmarkServiceHook]);

  // ✅ CLEAN: Metadata fetching now handled by BookmarkService
  const refreshBookmarkMetadata = useCallback(
    async (verseId: string) => {
      try {
        await services.bookmarkService.refreshBookmarkMetadata(verseId);
        await bookmarkServiceHook.refreshData(); // Refresh UI state
      } catch (error) {
        console.warn('Failed to refresh bookmark metadata:', error);
      }
    },
    [services.bookmarkService, bookmarkServiceHook]
  );

  // ✅ CLEAN: Folder operations now use BookmarkService
  const createFolder = useCallback(
    async (name: string, color?: string, icon?: string) => {
      try {
        await bookmarkServiceHook.createFolder(name, { color, icon });
      } catch (error) {
        console.error('Failed to create folder:', error);
        throw error;
      }
    },
    [bookmarkServiceHook]
  );

  const deleteFolder = useCallback(
    async (folderId: string) => {
      try {
        await bookmarkServiceHook.deleteFolder(folderId);
      } catch (error) {
        console.error('Failed to delete folder:', error);
        throw error;
      }
    },
    [bookmarkServiceHook]
  );

  const renameFolder = useCallback(
    async (folderId: string, newName: string, color?: string, icon?: string) => {
      try {
        await bookmarkServiceHook.renameFolder(folderId, newName);
        if (color !== undefined || icon !== undefined) {
          await services.bookmarkService.updateFolderCustomization(folderId, { color, icon });
          await bookmarkServiceHook.refreshData();
        }
      } catch (error) {
        console.error('Failed to rename folder:', error);
        throw error;
      }
    },
    [bookmarkServiceHook, services.bookmarkService]
  );

  // ✅ CLEAN: Bookmark operations use BookmarkService
  const addBookmark = useCallback(
    async (verseId: string, folderId?: string) => {
      try {
        if (folderId === 'pinned') {
          await bookmarkServiceHook.togglePinned(verseId);
        } else {
          await bookmarkServiceHook.addBookmark(verseId, folderId);
        }
      } catch (error) {
        console.error('Failed to add bookmark:', error);
        throw error;
      }
    },
    [bookmarkServiceHook]
  );

  const removeBookmark = useCallback(
    async (verseId: string, folderId: string) => {
      try {
        if (folderId === 'pinned') {
          await bookmarkServiceHook.togglePinned(verseId);
        } else {
          await bookmarkServiceHook.removeBookmark(verseId, folderId);
        }
      } catch (error) {
        console.error('Failed to remove bookmark:', error);
        throw error;
      }
    },
    [bookmarkServiceHook]
  );

  // ✅ CLEAN: All bookmark queries use BookmarkService
  const isBookmarked = useCallback(
    async (verseId: string) => {
      return await bookmarkServiceHook.isBookmarked(verseId);
    },
    [bookmarkServiceHook]
  );

  const findBookmark = useCallback(
    async (verseId: string) => {
      return await services.bookmarkService.findBookmarkLocation(verseId);
    },
    [services.bookmarkService]
  );

  const toggleBookmark = useCallback(
    async (verseId: string, folderId?: string) => {
      try {
        return await bookmarkServiceHook.toggleBookmark(verseId, folderId);
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
        throw error;
      }
    },
    [bookmarkServiceHook]
  );

  const updateBookmark = useCallback(
    async (verseId: string, data: Partial<Bookmark>) => {
      try {
        // This operation is now handled internally by BookmarkService
        await refreshBookmarkMetadata(verseId);
      } catch (error) {
        console.error('Failed to update bookmark:', error);
        throw error;
      }
    },
    [refreshBookmarkMetadata]
  );

  // ✅ CLEAN: Use service data instead of computed values
  const bookmarkedVerses = bookmarkServiceHook.folders.flatMap((f) => f.bookmarks || []);

  const togglePinned = useCallback(
    async (verseId: string) => {
      try {
        return await bookmarkServiceHook.togglePinned(verseId);
      } catch (error) {
        console.error('Failed to toggle pinned:', error);
        throw error;
      }
    },
    [bookmarkServiceHook]
  );

  const isPinned = useCallback(
    async (verseId: string) => {
      return await bookmarkServiceHook.isPinned(verseId);
    },
    [bookmarkServiceHook]
  );

  // Legacy features (TODO: migrate to clean architecture)
  const setLastRead = useCallback((surahId: string, verseId: number) => {
    setLastReadState((prev) => ({ ...prev, [surahId]: verseId }));
  }, []);

  const addToMemorization = useCallback(
    async (surahId: number, targetVerses?: number) => {
      // TODO: Create MemorizationService and migrate this logic
      const key = surahId.toString();
      if (memorization[key]) return;

      const { createMemorizationPlan } = await import('./bookmark-utils');
      const plan = createMemorizationPlan(surahId, targetVerses || 10);
      setMemorizationState((prev) => ({ ...prev, [key]: plan }));
    },
    [memorization]
  );

  const createMemorizationPlanCallback = useCallback(
    async (surahId: number, targetVerses: number, planName?: string) => {
      // TODO: Create MemorizationService and migrate this logic
      const key = surahId.toString();
      const { createMemorizationPlan } = await import('./bookmark-utils');
      const plan = createMemorizationPlan(surahId, targetVerses, planName);
      setMemorizationState((prev) => ({ ...prev, [key]: plan }));
    },
    []
  );

  const updateMemorizationProgressCallback = useCallback(
    async (surahId: number, completedVerses: number) => {
      // TODO: Create MemorizationService and migrate this logic
      const { updateMemorizationProgress } = await import('./bookmark-utils');
      setMemorizationState((prev) => updateMemorizationProgress(prev, surahId, completedVerses));
    },
    []
  );

  const removeFromMemorization = useCallback((surahId: number) => {
    // TODO: Create MemorizationService and migrate this logic
    const key = surahId.toString();
    setMemorizationState((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  // ✅ CLEAN: Context now uses clean architecture services
  const value: BookmarkContextType = {
    // Use clean service data
    folders: bookmarkServiceHook.folders,
    pinnedVerses: bookmarkServiceHook.pinnedVerses,
    bookmarkedVerses,

    // Use clean service methods
    createFolder,
    deleteFolder,
    renameFolder,
    addBookmark,
    removeBookmark,
    isBookmarked,
    findBookmark,
    toggleBookmark,
    updateBookmark,
    togglePinned,
    isPinned,

    // Legacy data (TODO: migrate to services)
    lastRead,
    setLastRead,
    chapters,
    memorization,
    addToMemorization,
    createMemorizationPlan: createMemorizationPlanCallback,
    updateMemorizationProgress: updateMemorizationProgressCallback,
    removeFromMemorization,
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};
