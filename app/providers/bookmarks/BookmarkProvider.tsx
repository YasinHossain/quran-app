'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Folder, Bookmark, Chapter, MemorizationPlan } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';
import { getChapters } from '@/lib/api/chapters';
import { BookmarkContext } from './BookmarkContext';
import { BookmarkContextType } from './types';
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
import { getVerseById, getVerseByKey } from '@/lib/api/verses';

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

  const createFolder = useCallback((name: string, color?: string, icon?: string) => {
    const newFolder = createNewFolder(name, color, icon);
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
    [fetchBookmarkMetadata, chapters]
  );

  const removeBookmark = useCallback((verseId: string, folderId: string) => {
    if (folderId === 'pinned') {
      setPinnedVerses((prev) => prev.filter((b) => b.verseId !== verseId));
      return;
    }
    setFolders((prev) => removeBookmarkFromFolder(prev, verseId, folderId));
  }, []);

  const isBookmarked = useCallback(
    (verseId: string) => isVerseBookmarked(folders, verseId),
    [folders]
  );

  const findBookmark = useCallback(
    (verseId: string) => findBookmarkInFolders(folders, verseId),
    [folders]
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

  const updateBookmark = useCallback((verseId: string, data: Partial<Bookmark>) => {
    setFolders((prev) => updateBookmarkInFolders(prev, verseId, data));
    setPinnedVerses((prev) => prev.map((b) => (b.verseId === verseId ? { ...b, ...data } : b)));
  }, []);

  const bookmarkedVerses = useMemo(() => getAllBookmarkedVerses(folders), [folders]);

  const togglePinned = useCallback(
    (verseId: string) => {
      const isPinned = pinnedVerses.some((b) => b.verseId === verseId);
      if (isPinned) {
        removeBookmark(verseId, 'pinned');
      } else {
        addBookmark(verseId, 'pinned');
      }
    },
    [pinnedVerses, addBookmark, removeBookmark]
  );

  const isPinned = useCallback(
    (verseId: string) => pinnedVerses.some((b) => b.verseId === verseId),
    [pinnedVerses]
  );

  const setLastRead = useCallback((surahId: string, verseId: number) => {
    setLastReadState((prev) => ({ ...prev, [surahId]: verseId }));
  }, []);

  const addToMemorization = useCallback(
    (surahId: number, targetVerses?: number) => {
      const key = surahId.toString();
      if (memorization[key]) return;

      const plan = createMemorizationPlan(surahId, targetVerses || 10);
      setMemorizationState((prev) => ({ ...prev, [key]: plan }));
    },
    [memorization]
  );

  const createMemorizationPlanCallback = useCallback(
    (surahId: number, targetVerses: number, planName?: string) => {
      const key = surahId.toString();
      const plan = createMemorizationPlan(surahId, targetVerses, planName);
      setMemorizationState((prev) => ({ ...prev, [key]: plan }));
    },
    []
  );

  const updateMemorizationProgressCallback = useCallback(
    (surahId: number, completedVerses: number) => {
      setMemorizationState((prev) => updateMemorizationProgress(prev, surahId, completedVerses));
    },
    []
  );

  const removeFromMemorization = useCallback((surahId: number) => {
    const key = surahId.toString();
    setMemorizationState((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const value: BookmarkContextType = {
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
    chapters,
    memorization,
    addToMemorization,
    createMemorizationPlan: createMemorizationPlanCallback,
    updateMemorizationProgress: updateMemorizationProgressCallback,
    removeFromMemorization,
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};
