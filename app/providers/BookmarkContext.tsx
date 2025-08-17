'use client';

import { Folder, Bookmark } from '@/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2'; // Use a new key for the new structure
const OLD_BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks'; // Old key for migration

interface BookmarkContextType {
  folders: Folder[];
  createFolder: (name: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string) => void;
  addBookmark: (verseId: string, folderId?: string) => void;
  removeBookmark: (verseId: string, folderId: string) => void;
  isBookmarked: (verseId: string) => boolean;
  findBookmark: (verseId: string) => { folder: Folder; bookmark: Bookmark } | null;
  toggleBookmark: (verseId: string, folderId?: string) => void;
  bookmarkedVerses: string[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);

  // Load bookmarks from localStorage on mount and handle migration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFolders = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (savedFolders) {
        try {
          setFolders(JSON.parse(savedFolders));
        } catch (error) {
          console.error('Error parsing bookmarks from localStorage:', error);
        }
      } else {
        // Migration from old format
        const oldBookmarks = localStorage.getItem(OLD_BOOKMARKS_STORAGE_KEY);
        if (oldBookmarks) {
          try {
            const verseIds: string[] = JSON.parse(oldBookmarks);
            if (Array.isArray(verseIds) && verseIds.every((id) => typeof id === 'string')) {
              const migratedFolder: Folder = {
                id: `migrated-${Date.now()}`,
                name: 'Uncategorized',
                createdAt: Date.now(),
                bookmarks: verseIds.map((verseId) => ({
                  verseId,
                  createdAt: Date.now(),
                })),
              };
              setFolders([migratedFolder]);
              localStorage.removeItem(OLD_BOOKMARKS_STORAGE_KEY); // Clean up old data
            }
          } catch (error) {
            console.error('Error migrating old bookmarks:', error);
          }
        }
      }
    }
  }, []);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(folders));
      } catch (error) {
        console.error('Error saving bookmarks to localStorage:', error);
      }
    }
  }, [folders]);

  const createFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      createdAt: Date.now(),
      bookmarks: [],
    };
    setFolders((prev) => [...prev, newFolder]);
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  }, []);

  const renameFolder = useCallback((folderId: string, newName: string) => {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === folderId ? { ...folder, name: newName } : folder))
    );
  }, []);

  const addBookmark = useCallback((verseId: string, folderId?: string) => {
    setFolders((prev) => {
      let targetFolderId = folderId;

      // If no folderId is provided, use the first folder or create a default one
      if (!targetFolderId) {
        if (prev.length > 0) {
          targetFolderId = prev[0].id;
        } else {
          const defaultFolder: Folder = {
            id: `folder-${Date.now()}`,
            name: 'Uncategorized',
            createdAt: Date.now(),
            bookmarks: [],
          };
          prev = [defaultFolder];
          targetFolderId = defaultFolder.id;
        }
      }

      return prev.map((folder) => {
        if (folder.id === targetFolderId) {
          // Avoid adding duplicate bookmarks
          if (folder.bookmarks.some((b) => b.verseId === verseId)) {
            return folder;
          }
          const newBookmark: Bookmark = { verseId, createdAt: Date.now() };
          return { ...folder, bookmarks: [...folder.bookmarks, newBookmark] };
        }
        return folder;
      });
    });
  }, []);

  const removeBookmark = useCallback((verseId: string, folderId: string) => {
    setFolders((prev) =>
      prev.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            bookmarks: folder.bookmarks.filter((b) => b.verseId !== verseId),
          };
        }
        return folder;
      })
    );
  }, []);

  const isBookmarked = useCallback(
    (verseId: string) => {
      return folders.some((folder) => folder.bookmarks.some((b) => b.verseId === verseId));
    },
    [folders]
  );

  const findBookmark = useCallback(
    (verseId: string): { folder: Folder; bookmark: Bookmark } | null => {
      for (const folder of folders) {
        const bookmark = folder.bookmarks.find((b) => b.verseId === verseId);
        if (bookmark) {
          return { folder, bookmark };
        }
      }
      return null;
    },
    [folders]
  );

  const toggleBookmark = useCallback(
    (verseId: string, folderId?: string) => {
      const existing = findBookmark(verseId);
      if (existing) {
        removeBookmark(verseId, existing.folder.id);
      } else {
        addBookmark(verseId, folderId);
      }
    },
    [findBookmark, removeBookmark, addBookmark]
  );

  const bookmarkedVerses = useMemo(
    () => folders.flatMap((f) => f.bookmarks.map((b) => b.verseId)),
    [folders]
  );

  const value = useMemo(
    () => ({
      folders,
      createFolder,
      deleteFolder,
      renameFolder,
      addBookmark,
      removeBookmark,
      isBookmarked,
      findBookmark,
      toggleBookmark,
      bookmarkedVerses,
    }),
    [
      folders,
      createFolder,
      deleteFolder,
      renameFolder,
      addBookmark,
      removeBookmark,
      isBookmarked,
      findBookmark,
      toggleBookmark,
      bookmarkedVerses,
    ]
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
};
