import { Folder, Bookmark, MemorizationPlan } from '@/types';
import { getItem, setItem, removeItem } from '@/lib/utils/safeLocalStorage';

import {
  BOOKMARKS_STORAGE_KEY,
  OLD_BOOKMARKS_STORAGE_KEY,
  PINNED_STORAGE_KEY,
  LAST_READ_STORAGE_KEY,
  MEMORIZATION_STORAGE_KEY,
} from './constants';

export const loadBookmarksFromStorage = (): Folder[] => {
  if (typeof window === 'undefined') return [];

  const savedFolders = getItem(BOOKMARKS_STORAGE_KEY);
  if (savedFolders) {
    try {
      return JSON.parse(savedFolders);
    } catch {
      return [];
    }
  }

  // Migration from old format
  const oldBookmarks = getItem(OLD_BOOKMARKS_STORAGE_KEY);
  if (oldBookmarks) {
    try {
      const verseIds: string[] = JSON.parse(oldBookmarks);
      if (Array.isArray(verseIds) && verseIds.every((id) => typeof id === 'string')) {
        const migratedFolder: Folder = {
          id:
            typeof globalThis.crypto !== 'undefined' &&
            typeof globalThis.crypto.randomUUID === 'function'
              ? globalThis.crypto.randomUUID()
              : `migrated-${Date.now()}`,
          name: 'Uncategorized',
          createdAt: Date.now(),
          bookmarks: verseIds.map((verseId) => ({
            verseId,
            createdAt: Date.now(),
          })),
        };
        removeItem(OLD_BOOKMARKS_STORAGE_KEY);
        return [migratedFolder];
      }
    } catch {
      return [];
    }
  }

  return [];
};

export const saveBookmarksToStorage = (folders: Folder[]): void => {
  if (typeof window !== 'undefined') {
    setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(folders));
  }
};

export const loadPinnedFromStorage = (): Bookmark[] => {
  if (typeof window === 'undefined') return [];

  const savedPinned = getItem(PINNED_STORAGE_KEY);
  if (savedPinned) {
    try {
      return JSON.parse(savedPinned);
    } catch {
      return [];
    }
  }
  return [];
};

export const savePinnedToStorage = (pinnedVerses: Bookmark[]): void => {
  if (typeof window !== 'undefined') {
    setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedVerses));
  }
};

export const loadLastReadFromStorage = (): Record<string, number> => {
  if (typeof window === 'undefined') return {};

  const savedLastRead = getItem(LAST_READ_STORAGE_KEY);
  if (savedLastRead) {
    try {
      return JSON.parse(savedLastRead);
    } catch {
      return {};
    }
  }
  return {};
};

export const saveLastReadToStorage = (lastRead: Record<string, number>): void => {
  if (typeof window !== 'undefined') {
    setItem(LAST_READ_STORAGE_KEY, JSON.stringify(lastRead));
  }
};

export const loadMemorizationFromStorage = (): Record<string, MemorizationPlan> => {
  if (typeof window === 'undefined') return {};

  const savedMemorization = getItem(MEMORIZATION_STORAGE_KEY);
  if (savedMemorization) {
    try {
      return JSON.parse(savedMemorization);
    } catch {
      return {};
    }
  }
  return {};
};

export const saveMemorizationToStorage = (memorization: Record<string, MemorizationPlan>): void => {
  if (typeof window !== 'undefined') {
    setItem(MEMORIZATION_STORAGE_KEY, JSON.stringify(memorization));
  }
};
