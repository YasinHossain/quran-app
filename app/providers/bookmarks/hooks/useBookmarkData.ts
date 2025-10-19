import { useEffect, useState } from 'react';

import {
  loadBookmarksFromStorage,
  saveBookmarksToStorage,
  loadPinnedFromStorage,
  savePinnedToStorage,
  loadLastReadFromStorage,
  saveLastReadToStorage,
  loadPlannerFromStorage,
  savePlannerToStorage,
} from '@/app/providers/bookmarks/storage-utils';
import * as chaptersApi from '@/lib/api/chapters';

import type { Folder, Bookmark, Chapter, PlannerPlan, LastReadMap } from '@/types';

function useStoredBookmarkState(): {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  pinnedVerses: Bookmark[];
  setPinnedVerses: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  lastRead: LastReadMap;
  setLastReadState: React.Dispatch<React.SetStateAction<LastReadMap>>;
  planner: Record<string, PlannerPlan>;
  setPlannerState: React.Dispatch<React.SetStateAction<Record<string, PlannerPlan>>>;
} {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pinnedVerses, setPinnedVerses] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<LastReadMap>({});
  const [planner, setPlannerState] = useState<Record<string, PlannerPlan>>({});

  useEffect(() => {
    const load = (): void => {
      setFolders(loadBookmarksFromStorage());
      setPinnedVerses(loadPinnedFromStorage());
      setLastReadState(loadLastReadFromStorage());
      setPlannerState(loadPlannerFromStorage());
    };
    load();
  }, []);

  useEffect(() => saveBookmarksToStorage(folders), [folders]);
  useEffect(() => savePinnedToStorage(pinnedVerses), [pinnedVerses]);
  useEffect(() => saveLastReadToStorage(lastRead), [lastRead]);
  useEffect(() => savePlannerToStorage(planner), [planner]);

  return {
    folders,
    setFolders,
    pinnedVerses,
    setPinnedVerses,
    lastRead,
    setLastReadState,
    planner,
    setPlannerState,
  } as const;
}

function getInitialChapters(): Chapter[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const injected = window.__TEST_BOOKMARK_CHAPTERS__;
  if (Array.isArray(injected)) {
    return injected;
  }

  return [];
}

function useChapters(): Chapter[] {
  const [chapters, setChapters] = useState<Chapter[]>(getInitialChapters);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    let isActive = true;

    const fetchChapters = async (): Promise<void> => {
      try {
        const result = await chaptersApi.getChapters();
        if (isActive && Array.isArray(result)) setChapters(result);
      } catch {
        // ignore fetch errors in tests
      }
    };

    void fetchChapters();

    return () => {
      isActive = false;
    };
  }, []);

  return chapters;
}

export function useBookmarkData(): {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  pinnedVerses: Bookmark[];
  setPinnedVerses: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  lastRead: LastReadMap;
  setLastReadState: React.Dispatch<React.SetStateAction<LastReadMap>>;
  planner: Record<string, PlannerPlan>;
  setPlannerState: React.Dispatch<React.SetStateAction<Record<string, PlannerPlan>>>;
  chapters: Chapter[];
} {
  const storedState = useStoredBookmarkState();
  const chapters = useChapters();

  return {
    ...storedState,
    chapters,
  } as const;
}
