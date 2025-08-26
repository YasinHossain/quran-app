'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Folder, Bookmark, Chapter, MemorizationPlan } from '@/domain/entities';
import { useSettings } from '@/presentation/providers/SettingsContext';
import { getChapters } from '@/lib/api/chapters';
import { BookmarkContext } from './BookmarkContext';
import type { BookmarkContextType } from './types';
import {
  loadLastReadFromStorage,
  saveLastReadToStorage,
  loadMemorizationFromStorage,
  saveMemorizationToStorage,
} from '@/infrastructure/bookmarks/storage-utils';
import { bookmarkService } from '@/application/BookmarkService';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { updateMemorizationProgress, createMemorizationPlan } from '@/domain/usecases/bookmark';

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<Record<string, number>>({});
  const [memorization, setMemorizationState] = useState<Record<string, MemorizationPlan>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { settings } = useSettings();

  // Load data on mount
  useEffect(() => {
    getChapters().then(setChapters).catch(() => {});
    const { folders: loadedFolders, pinned } = bookmarkService.load();
    setFolders(loadedFolders);
    setPinnedVerses(pinned);
    setLastReadState(loadLastReadFromStorage());
    setMemorizationState(loadMemorizationFromStorage());
  }, []);

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

        setFolders((prev) => bookmarkService.updateBookmark(prev, verseId, metadata));
        setPinnedVerses((prev) =>
          prev.map((b) => (b.verseId === verseId ? { ...b, ...metadata } : b))
        );
      } catch {
        // Silent fail for metadata fetch errors
      }
    },
    [settings.translationIds, settings.translationId]
  );

  const createFolder = useCallback(
    (name: string, color?: string, icon?: string) => {
      setFolders((prev) => bookmarkService.createFolder(prev, name, color, icon));
    },
    []
  );

  const deleteFolder = useCallback((folderId: string) => {
    setFolders((prev) => bookmarkService.deleteFolder(prev, folderId));
  }, []);

  const renameFolder = useCallback(
    (folderId: string, newName: string, color?: string, icon?: string) => {
      setFolders((prev) => bookmarkService.renameFolder(prev, folderId, newName, color, icon));
    },
    []
  );

  const addBookmark = useCallback(
    (verseId: string, folderId?: string) => {
      if (folderId === 'pinned') {
        setPinnedVerses((prev) => bookmarkService.togglePinned(prev, verseId));
        void fetchBookmarkMetadata(verseId, chapters);
        return;
      }
      setFolders((prev) => bookmarkService.addBookmark(prev, verseId, folderId));
      void fetchBookmarkMetadata(verseId, chapters);
    },
    [fetchBookmarkMetadata, chapters]
  );

  const removeBookmark = useCallback(
    (verseId: string, folderId: string) => {
      if (folderId === 'pinned') {
        setPinnedVerses((prev) => bookmarkService.togglePinned(prev, verseId));
        return;
      }
      setFolders((prev) => bookmarkService.removeBookmark(prev, verseId, folderId));
    },
    []
  );

  const isBookmarked = useCallback(
    (verseId: string) => bookmarkService.findBookmark(folders, verseId) !== null,
    [folders]
  );

  const findBookmark = useCallback(
    (verseId: string) => bookmarkService.findBookmark(folders, verseId),
    [folders]
  );

  const toggleBookmark = useCallback(
    (verseId: string, folderId?: string) => {
      if (bookmarkService.findBookmark(folders, verseId)) {
        const found = bookmarkService.findBookmark(folders, verseId);
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
    setFolders((prev) => bookmarkService.updateBookmark(prev, verseId, data));
    setPinnedVerses((prev) => prev.map((b) => (b.verseId === verseId ? { ...b, ...data } : b)));
  }, []);

  const bookmarkedVerses = useMemo(
    () => Array.from(new Set(folders.flatMap((f) => f.bookmarks.map((b) => b.verseId)))),
    [folders]
  );

  const togglePinned = useCallback(
    (verseId: string) => {
      setPinnedVerses((prev) => bookmarkService.togglePinned(prev, verseId));
    },
    []
  );

  const isPinned = useCallback(
    (verseId: string) => bookmarkService.isPinned(pinnedVerses, verseId),
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
