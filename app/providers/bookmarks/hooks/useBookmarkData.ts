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
import { getChapters } from '@/lib/api/chapters';

import type { Folder, Bookmark, Chapter, MemorizationPlan } from '@/types';

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
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<Record<string, number>>({});
  const [memorization, setMemorizationState] = useState<Record<string, MemorizationPlan>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);

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

  return {
    folders,
    setFolders,
    pinnedVerses,
    setPinnedVerses,
    lastRead,
    setLastReadState,
    memorization,
    setMemorizationState,
    chapters,
  } as const;
}
