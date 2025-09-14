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
    const fetchChaptersCandidate =
      (typeof (chaptersApi as any).getChapters === 'function'
        ? (chaptersApi as any).getChapters
        : (chaptersApi as any).default) || null;

    if (typeof fetchChaptersCandidate === 'function') {
      void (fetchChaptersCandidate as () => Promise<Chapter[]>)()
        .then((chs: Chapter[]) => setChapters(chs ?? []))
        .catch(() => {});
    }
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
