'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { getChapters } from '@/lib/api/chapters';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { Folder, Bookmark, Chapter, MemorizationPlan } from '@/types';

import {
  findBookmarkInFolders,
  isVerseBookmarked,
  getAllBookmarkedVerses,
  updateBookmarkInFolders,
} from './bookmark-utils';
import useFolderOperations from './hooks/useFolderOperations';
import useBookmarkOperations from './hooks/useBookmarkOperations';
import useMemorizationOperations from './hooks/useMemorizationOperations';
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
export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<Record<string, number>>({});
  const [memorization, setMemorizationState] = useState<Record<string, MemorizationPlan>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    void getChapters()
      .then(setChapters)
      .catch(() => {});
    setFolders(loadBookmarksFromStorage());
    setPinnedVerses(loadPinnedFromStorage());
    setLastReadState(loadLastReadFromStorage());
    setMemorizationState(loadMemorizationFromStorage());
  }, []);

  useEffect(() => saveBookmarksToStorage(folders), [folders]);
  useEffect(() => savePinnedToStorage(pinnedVerses), [pinnedVerses]);
  useEffect(() => saveLastReadToStorage(lastRead), [lastRead]);
  useEffect(() => saveMemorizationToStorage(memorization), [memorization]);

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
    [settings.translationIds, settings.translationId, setFolders, setPinnedVerses]
  );

  const folderOps = useFolderOperations(setFolders);
  const bookmarkOps = useBookmarkOperations(
    folders,
    setFolders,
    pinnedVerses,
    setPinnedVerses,
    chapters,
    fetchBookmarkMetadata
  );
  const memorizationOps = useMemorizationOperations(memorization, setMemorizationState);

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
