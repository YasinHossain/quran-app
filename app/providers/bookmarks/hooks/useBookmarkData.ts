import { useEffect, useState } from 'react';

import {
  loadBookmarksFromStorage,
  saveBookmarksToStorage,
  loadPinnedFromStorage,
  savePinnedToStorage,
  loadLastReadFromStorage,
  saveLastReadToStorage,
  loadMemorizationFromStorage,
  saveMemorizationToStorage,
} from '@/app/providers/bookmarks/storage-utils';
import * as chaptersApi from '@/lib/api/chapters';

import type { Folder, Bookmark, Chapter, MemorizationPlan } from '@/types';

function useStoredBookmarkState(): {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  pinnedVerses: Bookmark[];
  setPinnedVerses: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  lastRead: Record<string, number>;
  setLastReadState: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  memorization: Record<string, MemorizationPlan>;
  setMemorizationState: React.Dispatch<
    React.SetStateAction<Record<string, MemorizationPlan>>
  >;
} {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<Record<string, number>>({});
  const [memorization, setMemorizationState] = useState<Record<string, MemorizationPlan>>({});

  useEffect(() => {
    const load = (): void => {
      setFolders(loadBookmarksFromStorage());
      setPinnedVerses(loadPinnedFromStorage());
      setLastReadState(loadLastReadFromStorage());
      setMemorizationState(loadMemorizationFromStorage());
    };
    load();
  }, []);

  useEffect(() => saveBookmarksToStorage(folders), [folders]);
  useEffect(() => savePinnedToStorage(pinnedVerses), [pinnedVerses]);
  useEffect(() => saveLastReadToStorage(lastRead), [lastRead]);
  useEffect(() => saveMemorizationToStorage(memorization), [memorization]);

  return {
    folders,
    setFolders,
    pinnedVerses,
    setPinnedVerses,
    lastRead,
    setLastReadState,
    memorization,
    setMemorizationState,
  } as const;
}

function useChapters(): Chapter[] {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchChapters = async (): Promise<void> => {
      try {
        const result = await chaptersApi.getChapters();
        if (Array.isArray(result)) setChapters(result);
      } catch {
        // ignore fetch errors in tests
      }
    };

    void fetchChapters();
  }, []);

  return chapters;
}

export function useBookmarkData(): {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  pinnedVerses: Bookmark[];
  setPinnedVerses: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  lastRead: Record<string, number>;
  setLastReadState: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  memorization: Record<string, MemorizationPlan>;
  setMemorizationState: React.Dispatch<React.SetStateAction<Record<string, MemorizationPlan>>>;
  chapters: Chapter[];
} {
  const storedState = useStoredBookmarkState();
  const chapters = useChapters();

  return {
    ...storedState,
    chapters,
  } as const;
}
