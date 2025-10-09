'use client';

import { useCallback, useMemo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import { findBookmarkInFolders, isVerseBookmarked, getAllBookmarkedVerses } from './bookmark-utils';
import { BookmarkContext } from './BookmarkContext';
import { useBookmarkData } from './hooks/useBookmarkData';
import { useBookmarkMetadata } from './hooks/useBookmarkMetadata';
import useBookmarkOperations from './hooks/useBookmarkOperations';
import useFolderOperations from './hooks/useFolderOperations';
import useMemorizationOperations from './hooks/useMemorizationOperations';
import { usePinnedBookmarks } from './hooks/usePinnedBookmarks';

import type { BookmarkContextType } from './types';
import type { Bookmark, Folder } from '@/types';

export const BookmarkProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const value = useBookmarkProviderValue();
  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

function useBookmarkProviderValue(): BookmarkContextType {
  const {
    folders,
    setFolders,
    pinnedVerses,
    setPinnedVerses,
    lastRead,
    setLastReadState,
    memorization,
    setMemorizationState,
    chapters,
  } = useBookmarkData();
  const { settings } = useSettings();

  const fetchBookmarkMetadata = useBookmarkMetadata(settings, setFolders, setPinnedVerses);

  const folderOps = useFolderOperations(setFolders);
  const bookmarkOps = useBookmarkOperations({
    folders,
    setFolders,
    pinned: pinnedVerses,
    setPinned: setPinnedVerses,
    chapters,
    fetchMetadata: fetchBookmarkMetadata,
  });
  const memorizationOps = useMemorizationOperations(memorization, setMemorizationState);
  const helpers = useBookmarkHelpers(folders, pinnedVerses, bookmarkOps, setLastReadState);

  return useMemo(
    () => ({
      folders,
      pinnedVerses,
      ...folderOps,
      ...bookmarkOps,
      ...helpers,
      lastRead,
      chapters,
      memorization,
      ...memorizationOps,
    }),
    [
      folders,
      pinnedVerses,
      folderOps,
      bookmarkOps,
      helpers,
      lastRead,
      chapters,
      memorization,
      memorizationOps,
    ]
  );
}

function useBookmarkHelpers(
  folders: Folder[],
  pinnedVerses: Bookmark[],
  bookmarkOps: ReturnType<typeof useBookmarkOperations>,
  setLastReadState: ReturnType<typeof useBookmarkData>['setLastReadState']
): {
  isBookmarked: (verseId: string) => boolean;
  findBookmark: (verseId: string) => ReturnType<typeof findBookmarkInFolders>;
  bookmarkedVerses: string[];
  togglePinned: (verseId: string, metadata?: Partial<Bookmark>) => void;
  isPinned: (verseId: string) => boolean;
  setLastRead: (surahId: string, verseId: number) => void;
} {
  const isBookmarked = useCallback(
    (verseId: string) => isVerseBookmarked(folders, verseId),
    [folders]
  );

  const findBookmark = useCallback(
    (verseId: string) => findBookmarkInFolders(folders, verseId),
    [folders]
  );

  const bookmarkedVerses = useMemo(() => getAllBookmarkedVerses(folders), [folders]);
  const { togglePinned, isPinned } = usePinnedBookmarks(pinnedVerses, bookmarkOps);

  const setLastRead = useCallback(
    (surahId: string, verseId: number) => {
      setLastReadState((prev) => ({ ...prev, [surahId]: verseId }));
    },
    [setLastReadState]
  );

  return {
    isBookmarked,
    findBookmark,
    bookmarkedVerses,
    togglePinned,
    isPinned,
    setLastRead,
  } as const;
}
