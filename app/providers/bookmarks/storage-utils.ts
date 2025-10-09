import { getItem, setItem, removeItem } from '@/lib/utils/safeLocalStorage';
import { Folder, Bookmark, MemorizationPlan } from '@/types';

import {
  BOOKMARKS_STORAGE_KEY,
  OLD_BOOKMARKS_STORAGE_KEY,
  PINNED_STORAGE_KEY,
  LAST_READ_STORAGE_KEY,
  MEMORIZATION_STORAGE_KEY,
} from './constants';

const normalizeBookmark = (bookmark: Bookmark): Bookmark => ({
  ...bookmark,
  verseId: String((bookmark as Bookmark & { verseId: string | number }).verseId),
});

const normalizeFolders = (folders: Folder[]): Folder[] =>
  folders.map((folder) => ({
    ...folder,
    bookmarks: folder.bookmarks.map(normalizeBookmark),
  }));

export const loadBookmarksFromStorage = (): Folder[] => {
  if (typeof window === 'undefined') return [];

  const savedFolders = getItem(BOOKMARKS_STORAGE_KEY);
  if (savedFolders) {
    try {
      const parsed = JSON.parse(savedFolders) as Folder[];
      return Array.isArray(parsed) ? normalizeFolders(parsed) : [];
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
        return normalizeFolders([migratedFolder]);
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
      const parsed = JSON.parse(savedPinned) as Bookmark[];
      return Array.isArray(parsed) ? parsed.map(normalizeBookmark) : [];
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
