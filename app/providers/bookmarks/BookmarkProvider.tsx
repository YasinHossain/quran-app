'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import { findBookmarkInFolders, isVerseBookmarked, getAllBookmarkedVerses } from './bookmark-utils';
import { BookmarkContext } from './BookmarkContext';
import { useBookmarkData } from './hooks/useBookmarkData';
import { useBookmarkMetadata } from './hooks/useBookmarkMetadata';
import { useBookmarkOperations } from './hooks/useBookmarkOperations';
import { useFolderOperations } from './hooks/useFolderOperations';
import { usePinnedBookmarks } from './hooks/usePinnedBookmarks';
import { usePlannerOperations } from './hooks/usePlannerOperations';

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
    planner,
    setPlannerState,
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
  const plannerOps = usePlannerOperations(planner, setPlannerState);
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
      planner,
      ...plannerOps,
    }),
    [
      folders,
      pinnedVerses,
      folderOps,
      bookmarkOps,
      helpers,
      lastRead,
      chapters,
      planner,
      plannerOps,
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
  setLastRead: (
    surahId: string,
    verseNumber: number,
    verseKey?: string,
    globalVerseId?: number
  ) => void;
  removeLastRead: (surahId: string) => void;
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

  const lastReadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingLastReadRef = useRef<{
    surahId: string;
    verseNumber: number;
    verseKey?: string;
    globalVerseId?: number;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (lastReadTimeoutRef.current) {
        clearTimeout(lastReadTimeoutRef.current);
        lastReadTimeoutRef.current = null;
      }
      pendingLastReadRef.current = null;
    };
  }, []);

  const flushLastRead = useCallback(() => {
    const pending = pendingLastReadRef.current;
    if (!pending) return;
    pendingLastReadRef.current = null;

    setLastReadState((prev) => {
      const current = prev[pending.surahId];
      if (
        current &&
        current.verseNumber === pending.verseNumber &&
        current.verseKey === pending.verseKey &&
        current.globalVerseId === pending.globalVerseId
      ) {
        return prev;
      }

      const updated = {
        ...prev,
        [pending.surahId]: {
          verseNumber: pending.verseNumber,
          verseId: pending.verseNumber,
          ...(typeof pending.verseKey === 'string' ? { verseKey: pending.verseKey } : {}),
          ...(typeof pending.globalVerseId === 'number'
            ? { globalVerseId: pending.globalVerseId }
            : {}),
          updatedAt: Date.now(),
        },
      };

      // Limit to 5 most recent entries
      const entries = Object.entries(updated);
      if (entries.length <= 5) {
        return updated;
      }

      // Sort by updatedAt (most recent first) and keep only top 5
      const sorted = entries.sort(([, a], [, b]) => b.updatedAt - a.updatedAt);
      const limited = sorted.slice(0, 5);

      return Object.fromEntries(limited);
    });
  }, [setLastReadState]);

  const setLastRead = useCallback(
    (surahId: string, verseNumber: number, verseKey?: string, globalVerseId?: number) => {
      // Debounce last-read writes to avoid scroll jank (IntersectionObserver can fire rapidly).
      pendingLastReadRef.current = {
        surahId,
        verseNumber,
        ...(typeof verseKey === 'string' ? { verseKey } : {}),
        ...(typeof globalVerseId === 'number' ? { globalVerseId } : {}),
      };

      if (lastReadTimeoutRef.current) {
        return;
      }

      lastReadTimeoutRef.current = setTimeout(() => {
        lastReadTimeoutRef.current = null;
        flushLastRead();
      }, 200);
    },
    [flushLastRead]
  );

  const removeLastRead = useCallback(
    (surahId: string) => {
      setLastReadState((prev) => {
        const next = { ...prev };
        delete next[surahId];
        return next;
      });
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
    removeLastRead,
  } as const;
}
