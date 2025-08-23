'use client';

import { Folder, Bookmark } from '@/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { getChapters } from '@/lib/api/chapters';

const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2'; // Use a new key for the new structure
const OLD_BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks'; // Old key for migration
const PINNED_STORAGE_KEY = 'quranAppPinnedVerses_v1';
const LAST_READ_STORAGE_KEY = 'quranAppLastRead_v1';

interface BookmarkContextType {
  folders: Folder[];
  createFolder: (name: string, color?: string, icon?: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string, color?: string, icon?: string) => void;
  addBookmark: (verseId: string, folderId?: string) => void;
  removeBookmark: (verseId: string, folderId: string) => void;
  isBookmarked: (verseId: string) => boolean;
  findBookmark: (verseId: string) => { folder: Folder; bookmark: Bookmark } | null;
  toggleBookmark: (verseId: string, folderId?: string) => void;
  updateBookmark: (verseId: string, data: Partial<Bookmark>) => void;
  bookmarkedVerses: string[];
  pinnedVerses: Bookmark[];
  togglePinned: (verseId: string) => void;
  isPinned: (verseId: string) => boolean;
  lastRead: Record<string, number>;
  setLastRead: (surahId: string, verseId: number) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<Record<string, number>>({});
  const { settings } = useSettings();

  // Load bookmarks from localStorage on mount and handle migration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFolders = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (savedFolders) {
        try {
          setFolders(JSON.parse(savedFolders));
        } catch {
          // Silent fail for localStorage parsing errors
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
          } catch {
            // Silent fail for bookmark migration errors
          }
        }
      }

      const savedPinned = localStorage.getItem(PINNED_STORAGE_KEY);
      if (savedPinned) {
        try {
          setPinnedVerses(JSON.parse(savedPinned));
        } catch {
          // Silent fail for parsing errors
        }
      }

      const savedLastRead = localStorage.getItem(LAST_READ_STORAGE_KEY);
      if (savedLastRead) {
        try {
          setLastReadState(JSON.parse(savedLastRead));
        } catch {
          // Silent fail for parsing errors
        }
      }
    }
  }, []);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(folders));
      } catch {
        // Silent fail for localStorage save errors
      }
    }
  }, [folders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedVerses));
      } catch {
        // Silent fail
      }
    }
  }, [pinnedVerses]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LAST_READ_STORAGE_KEY, JSON.stringify(lastRead));
      } catch {
        // Silent fail
      }
    }
  }, [lastRead]);

  const createFolder = useCallback((name: string, color?: string, icon?: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      createdAt: Date.now(),
      bookmarks: [],
      ...(color ? { color } : {}),
      ...(icon ? { icon } : {}),
    };
    setFolders((prev) => [...prev, newFolder]);
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  }, []);

  const renameFolder = useCallback(
    (folderId: string, newName: string, color?: string, icon?: string) => {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                name: newName,
                ...(color !== undefined ? { color } : {}),
                ...(icon !== undefined ? { icon } : {}),
              }
            : folder
        )
      );
    },
    []
  );

  const updateBookmark = useCallback((verseId: string, data: Partial<Bookmark>) => {
    setFolders((prev) =>
      prev.map((folder) => ({
        ...folder,
        bookmarks: folder.bookmarks.map((b) => (b.verseId === verseId ? { ...b, ...data } : b)),
      }))
    );
    setPinnedVerses((prev) => prev.map((b) => (b.verseId === verseId ? { ...b, ...data } : b)));
  }, []);

  const fetchBookmarkMetadata = useCallback(
    async (verseId: string) => {
      try {
        const translationId = settings.translationIds[0] || settings.translationId || 20;
        const isCompositeKey = /:/.test(verseId) || /[^0-9]/.test(verseId);
        const [verse, chapters] = await Promise.all([
          isCompositeKey
            ? getVerseByKey(verseId, translationId)
            : getVerseById(verseId, translationId),
          getChapters(),
        ]);
        const [surahIdStr] = verse.verse_key.split(':');
        const surahInfo = chapters.find((chapter) => chapter.id === parseInt(surahIdStr));
        updateBookmark(verseId, {
          verseKey: verse.verse_key,
          verseText: verse.text_uthmani,
          surahName: surahInfo?.name_simple || `Surah ${surahIdStr}`,
          translation: verse.translations?.[0]?.text,
          verseApiId: verse.id,
        });
      } catch {
        // Silent fail for metadata fetch errors
      }
    },
    [settings.translationIds, settings.translationId, updateBookmark]
  );

  const addBookmark = useCallback(
    (verseId: string, folderId?: string) => {
      if (folderId === 'pinned') {
        setPinnedVerses((prev) => {
          if (prev.some((b) => b.verseId === verseId)) {
            return prev;
          }
          const newBookmark: Bookmark = { verseId, createdAt: Date.now() };
          return [...prev, newBookmark];
        });
        void fetchBookmarkMetadata(verseId);
        return;
      }

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

      void fetchBookmarkMetadata(verseId);
    },
    [fetchBookmarkMetadata]
  );

  const removeBookmark = useCallback((verseId: string, folderId: string) => {
    if (folderId === 'pinned') {
      setPinnedVerses((prev) => prev.filter((b) => b.verseId !== verseId));
      return;
    }
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

  const togglePinned = useCallback(
    (verseId: string) => {
      setPinnedVerses((prev) => {
        const exists = prev.some((b) => b.verseId === verseId);
        if (exists) {
          return prev.filter((b) => b.verseId !== verseId);
        }
        const newBookmark: Bookmark = { verseId, createdAt: Date.now() };
        return [...prev, newBookmark];
      });
      void fetchBookmarkMetadata(verseId);
    },
    [fetchBookmarkMetadata]
  );

  const isPinned = useCallback(
    (verseId: string) => pinnedVerses.some((b) => b.verseId === verseId),
    [pinnedVerses]
  );

  const setLastRead = useCallback((surahId: string, verseId: number) => {
    setLastReadState((prev) => ({ ...prev, [surahId]: verseId }));
  }, []);

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
      updateBookmark,
      bookmarkedVerses,
      pinnedVerses,
      togglePinned,
      isPinned,
      lastRead,
      setLastRead,
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
      updateBookmark,
      bookmarkedVerses,
      pinnedVerses,
      togglePinned,
      isPinned,
      lastRead,
      setLastRead,
    ]
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
};
