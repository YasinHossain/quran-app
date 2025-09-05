'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { getChapters } from '@/lib/api/chapters';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { Folder, Bookmark, Chapter, MemorizationPlan } from '@/types';

import {
  createNewFolder,
  findBookmarkInFolders,
  isVerseBookmarked,
  getAllBookmarkedVerses,
  addBookmarkToFolder,
  removeBookmarkFromFolder,
  updateBookmarkInFolders,
  createMemorizationPlan,
  updateMemorizationProgress,
} from './bookmark-utils';
import { BookmarkContext } from './BookmarkContext';
import {
  loadBookmarksFromStorage,
  saveBookmarksToStorage,
  loadPinnedFromStorage,
  savePinnedToStorage,
  loadLastReadFromStorage,
  saveLastReadToStorage,
  loadMemorizationFromStorage,
  saveMemorizationToStorage,
} from './storage-utils';
import { BookmarkContextType } from './types';

// Custom hook for folder operations
function useFolderOperations(
  folders: Folder[],
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
) {
  const createFolder = useCallback(
    (name: string, color?: string, icon?: string) => {
      const newFolder = createNewFolder(name, color, icon);
      setFolders((prev) => [...prev, newFolder]);
    },
    [setFolders]
  );

  const deleteFolder = useCallback(
    (folderId: string) => {
      setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
    },
    [setFolders]
  );

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
    [setFolders]
  );

  return { createFolder, deleteFolder, renameFolder };
}

// Custom hook for bookmark operations
function useBookmarkOperations(
  folders: Folder[],
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>,
  pinnedVerses: Bookmark[],
  setPinnedVerses: React.Dispatch<React.SetStateAction<Bookmark[]>>,
  chapters: Chapter[],
  fetchBookmarkMetadata: (verseId: string, chaptersList: Chapter[]) => void
) {
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
        void fetchBookmarkMetadata(verseId, chapters);
        return;
      }

      setFolders((prev) => addBookmarkToFolder(prev, verseId, folderId));
      void fetchBookmarkMetadata(verseId, chapters);
    },
    [fetchBookmarkMetadata, chapters, setFolders, setPinnedVerses]
  );

  const removeBookmark = useCallback(
    (verseId: string, folderId: string) => {
      if (folderId === 'pinned') {
        setPinnedVerses((prev) => prev.filter((b) => b.verseId !== verseId));
        return;
      }
      setFolders((prev) => removeBookmarkFromFolder(prev, verseId, folderId));
    },
    [setFolders, setPinnedVerses]
  );

  const toggleBookmark = useCallback(
    (verseId: string, folderId?: string) => {
      if (isVerseBookmarked(folders, verseId)) {
        const found = findBookmarkInFolders(folders, verseId);
        if (found) {
          removeBookmark(verseId, found.folder.id);
        }
      } else {
        addBookmark(verseId, folderId);
      }
    },
    [folders, addBookmark, removeBookmark]
  );

  const updateBookmark = useCallback(
    (verseId: string, data: Partial<Bookmark>) => {
      setFolders((prev) => updateBookmarkInFolders(prev, verseId, data));
      setPinnedVerses((prev) => prev.map((b) => (b.verseId === verseId ? { ...b, ...data } : b)));
    },
    [setFolders, setPinnedVerses]
  );

  return { addBookmark, removeBookmark, toggleBookmark, updateBookmark };
}

// Custom hook for memorization operations
function useMemorizationOperations(
  memorization: Record<string, MemorizationPlan>,
  setMemorizationState: React.Dispatch<React.SetStateAction<Record<string, MemorizationPlan>>>
) {
  const addToMemorization = useCallback(
    (surahId: number, targetVerses?: number) => {
      const key = surahId.toString();
      if (memorization[key]) return;

      const plan = createMemorizationPlan(surahId, targetVerses || 10);
      setMemorizationState((prev) => ({ ...prev, [key]: plan }));
    },
    [memorization, setMemorizationState]
  );

  const createMemorizationPlanCallback = useCallback(
    (surahId: number, targetVerses: number, planName?: string) => {
      const key = surahId.toString();
      const plan = createMemorizationPlan(surahId, targetVerses, planName);
      setMemorizationState((prev) => ({ ...prev, [key]: plan }));
    },
    [setMemorizationState]
  );

  const updateMemorizationProgressCallback = useCallback(
    (surahId: number, completedVerses: number) => {
      setMemorizationState((prev) => updateMemorizationProgress(prev, surahId, completedVerses));
    },
    [setMemorizationState]
  );

  const removeFromMemorization = useCallback(
    (surahId: number) => {
      const key = surahId.toString();
      setMemorizationState((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    },
    [setMemorizationState]
  );

  return {
    addToMemorization,
    createMemorizationPlan: createMemorizationPlanCallback,
    updateMemorizationProgress: updateMemorizationProgressCallback,
    removeFromMemorization,
  };
}

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<Record<string, number>>({});
  const [memorization, setMemorizationState] = useState<Record<string, MemorizationPlan>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { settings } = useSettings();

  // Load data on mount
  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch(() => {});

    setFolders(loadBookmarksFromStorage());
    setPinnedVerses(loadPinnedFromStorage());
    setLastReadState(loadLastReadFromStorage());
    setMemorizationState(loadMemorizationFromStorage());
  }, []);

  // Save data when state changes
  useEffect(() => {
    saveBookmarksToStorage(folders);
  }, [folders]);

  useEffect(() => {
    savePinnedToStorage(pinnedVerses);
  }, [pinnedVerses]);

  useEffect(() => {
    saveLastReadToStorage(lastRead);
  }, [lastRead]);

  useEffect(() => {
    saveMemorizationToStorage(memorization);
  }, [memorization]);

  const fetchBookmarkMetadata = useCallback(
    async (verseId: string, chaptersList: Chapter[]) => {
      try {
        const translationId = settings.translationIds[0] || settings.translationId || 20;
        const isCompositeKey = /:/.test(verseId) || /[^0-9]/.test(verseId);
        const verse = await (isCompositeKey
          ? getVerseByKey(verseId, translationId)
          : getVerseById(verseId, translationId));
        const [surahIdStr] = verse.verse_key.split(':');
        const surahInfo = chaptersList.find((chapter) => chapter.id === parseInt(surahIdStr));

        const metadata = {
          verseKey: verse.verse_key,
          verseText: verse.text_uthmani,
          surahName: surahInfo?.name_simple || `Surah ${surahIdStr}`,
          translation: verse.translations?.[0]?.text,
          verseApiId: verse.id,
        };

        setFolders((prev) => updateBookmarkInFolders(prev, verseId, metadata));
        setPinnedVerses((prev) =>
          prev.map((b) => (b.verseId === verseId ? { ...b, ...metadata } : b))
        );
      } catch {
        // Silent fail for metadata fetch errors
      }
    },
    [settings.translationIds, settings.translationId]
  );

  // Use custom hooks to organize operations
  const folderOps = useFolderOperations(folders, setFolders);
  const bookmarkOps = useBookmarkOperations(
    folders,
    setFolders,
    pinnedVerses,
    setPinnedVerses,
    chapters,
    fetchBookmarkMetadata
  );
  const memorizationOps = useMemorizationOperations(memorization, setMemorizationState);

  // Simple derived values and remaining callbacks
  const isBookmarked = useCallback(
    (verseId: string) => isVerseBookmarked(folders, verseId),
    [folders]
  );

  const findBookmark = useCallback(
    (verseId: string) => findBookmarkInFolders(folders, verseId),
    [folders]
  );

  const bookmarkedVerses = useMemo(() => getAllBookmarkedVerses(folders), [folders]);

  const togglePinned = useCallback(
    (verseId: string) => {
      const isPinned = pinnedVerses.some((b) => b.verseId === verseId);
      if (isPinned) {
        bookmarkOps.removeBookmark(verseId, 'pinned');
      } else {
        bookmarkOps.addBookmark(verseId, 'pinned');
      }
    },
    [pinnedVerses, bookmarkOps]
  );

  const isPinned = useCallback(
    (verseId: string) => pinnedVerses.some((b) => b.verseId === verseId),
    [pinnedVerses]
  );

  const setLastRead = useCallback((surahId: string, verseId: number) => {
    setLastReadState((prev) => ({ ...prev, [surahId]: verseId }));
  }, []);

  const value: BookmarkContextType = {
    folders,
    ...folderOps,
    ...bookmarkOps,
    isBookmarked,
    findBookmark,
    bookmarkedVerses,
    pinnedVerses,
    togglePinned,
    isPinned,
    lastRead,
    setLastRead,
    chapters,
    memorization,
    ...memorizationOps,
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};
