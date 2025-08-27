/**
 * React Hook: useBookmarkService
 * 
 * Provides access to BookmarkService with React integration.
 * This replaces the need for the existing BookmarkContext/Provider pattern.
 */

import { useState, useCallback } from 'react';
import { BookmarkService } from '../services/BookmarkService';
import { getServices } from '../ServiceContainer';
import { Bookmark, Folder } from '../../domain/entities';

export interface UseBookmarkServiceResult {
  // State
  folders: Folder[];
  pinnedVerses: Bookmark[];
  loading: boolean;
  error: string | null;

  // Bookmark operations
  addBookmark: (verseId: string, folderId?: string) => Promise<void>;
  removeBookmark: (verseId: string, folderId?: string) => Promise<void>;
  toggleBookmark: (verseId: string, folderId?: string) => Promise<'added' | 'removed'>;
  isBookmarked: (verseId: string) => Promise<boolean>;

  // Folder operations
  createFolder: (name: string, customization?: any) => Promise<Folder>;
  deleteFolder: (folderId: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;

  // Pinned operations
  togglePinned: (verseId: string) => Promise<'pinned' | 'unpinned'>;
  isPinned: (verseId: string) => Promise<boolean>;

  // Utility
  refreshData: () => Promise<void>;
  searchBookmarks: (query: string) => Promise<{ folder: Folder; bookmark: Bookmark }[]>;
}

export function useBookmarkService(): UseBookmarkServiceResult {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookmarkService: BookmarkService = getServices().bookmarkService;

  // Load initial data
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [foldersData, pinnedData] = await Promise.all([
        bookmarkService.getFolders(),
        bookmarkService.getPinnedVerses()
      ]);
      
      setFolders(foldersData);
      setPinnedVerses(pinnedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookmark data');
    } finally {
      setLoading(false);
    }
  }, [bookmarkService]);

  // Bookmark operations
  const addBookmark = useCallback(async (verseId: string, folderId?: string) => {
    try {
      setError(null);
      await bookmarkService.addBookmark(verseId, { folderId });
      await refreshData(); // Refresh to get updated state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark');
      throw err;
    }
  }, [bookmarkService, refreshData]);

  const removeBookmark = useCallback(async (verseId: string, folderId?: string) => {
    try {
      setError(null);
      await bookmarkService.removeBookmark(verseId, folderId);
      await refreshData(); // Refresh to get updated state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove bookmark');
      throw err;
    }
  }, [bookmarkService, refreshData]);

  const toggleBookmark = useCallback(async (verseId: string, folderId?: string) => {
    try {
      setError(null);
      const result = await bookmarkService.toggleBookmark(verseId, folderId);
      await refreshData(); // Refresh to get updated state
      return result.action;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle bookmark');
      throw err;
    }
  }, [bookmarkService, refreshData]);

  const isBookmarked = useCallback(async (verseId: string) => {
    try {
      return await bookmarkService.isBookmarked(verseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check bookmark status');
      return false;
    }
  }, [bookmarkService]);

  // Folder operations
  const createFolder = useCallback(async (name: string, customization?: any) => {
    try {
      setError(null);
      const result = await bookmarkService.createFolder(name, customization);
      await refreshData(); // Refresh to get updated state
      return result.folder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
      throw err;
    }
  }, [bookmarkService, refreshData]);

  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      setError(null);
      await bookmarkService.deleteFolder(folderId);
      await refreshData(); // Refresh to get updated state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete folder');
      throw err;
    }
  }, [bookmarkService, refreshData]);

  const renameFolder = useCallback(async (folderId: string, newName: string) => {
    try {
      setError(null);
      await bookmarkService.renameFolder(folderId, newName);
      await refreshData(); // Refresh to get updated state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename folder');
      throw err;
    }
  }, [bookmarkService, refreshData]);

  // Pinned operations
  const togglePinned = useCallback(async (verseId: string) => {
    try {
      setError(null);
      const result = await bookmarkService.togglePinned(verseId);
      await refreshData(); // Refresh to get updated state
      return result.action;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle pinned');
      throw err;
    }
  }, [bookmarkService, refreshData]);

  const isPinned = useCallback(async (verseId: string) => {
    try {
      return await bookmarkService.isPinned(verseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check pinned status');
      return false;
    }
  }, [bookmarkService]);

  // Search
  const searchBookmarks = useCallback(async (query: string) => {
    try {
      setError(null);
      return await bookmarkService.searchBookmarks(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search bookmarks');
      return [];
    }
  }, [bookmarkService]);

  return {
    // State
    folders,
    pinnedVerses,
    loading,
    error,

    // Operations
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    createFolder,
    deleteFolder,
    renameFolder,
    togglePinned,
    isPinned,
    refreshData,
    searchBookmarks
  };
}