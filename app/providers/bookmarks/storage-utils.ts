import { getItem, setItem, removeItem } from '@/lib/utils/safeLocalStorage';
import { Folder, Bookmark, PlannerPlan, LastReadMap, LastReadEntry } from '@/types';

import {
  BOOKMARKS_STORAGE_KEY,
  OLD_BOOKMARKS_STORAGE_KEY,
  PINNED_STORAGE_KEY,
  LAST_READ_STORAGE_KEY,
  PLANNER_STORAGE_KEY,
  LEGACY_MEMORIZATION_STORAGE_KEY,
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

const normalizeLastReadEntry = (
  value: unknown,
  fallbackUpdatedAt: number
): LastReadEntry | null => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return {
      verseNumber: value,
      verseId: value,
      updatedAt: fallbackUpdatedAt,
    };
  }

  if (value && typeof value === 'object') {
    const maybeEntry = value as Partial<LastReadEntry> & { verseId?: unknown };

    const verseNumber =
      typeof maybeEntry.verseNumber === 'number' && Number.isFinite(maybeEntry.verseNumber)
        ? maybeEntry.verseNumber
        : typeof maybeEntry.verseId === 'number' && Number.isFinite(maybeEntry.verseId)
          ? maybeEntry.verseId
          : typeof maybeEntry.verseKey === 'string'
            ? Number(maybeEntry.verseKey.split(':')[1])
            : undefined;

    if (!verseNumber || Number.isNaN(verseNumber) || verseNumber <= 0) {
      return null;
    }

    const updatedAt =
      typeof maybeEntry.updatedAt === 'number' && Number.isFinite(maybeEntry.updatedAt)
        ? maybeEntry.updatedAt
        : fallbackUpdatedAt;

    const entry: LastReadEntry = {
      verseNumber,
      updatedAt,
      ...(typeof maybeEntry.verseKey === 'string' && maybeEntry.verseKey.length > 0
        ? { verseKey: maybeEntry.verseKey }
        : {}),
      ...(typeof maybeEntry.globalVerseId === 'number' && Number.isFinite(maybeEntry.globalVerseId)
        ? { globalVerseId: maybeEntry.globalVerseId }
        : {}),
      verseId: verseNumber,
    };

    return entry;
  }

  return null;
};

export const loadLastReadFromStorage = (): LastReadMap => {
  if (typeof window === 'undefined') return {};

  const savedLastRead = getItem(LAST_READ_STORAGE_KEY);
  if (savedLastRead) {
    try {
      const raw = JSON.parse(savedLastRead) as Record<string, unknown>;
      if (!raw || typeof raw !== 'object') {
        return {};
      }

      const entries = Object.entries(raw);
      const now = Date.now();

      return entries.reduce<LastReadMap>((acc, [surahId, value], index) => {
        const entry = normalizeLastReadEntry(value, now - index);
        if (entry) {
          acc[surahId] = entry;
        }
        return acc;
      }, {});
    } catch {
      return {};
    }
  }
  return {};
};

export const saveLastReadToStorage = (lastRead: LastReadMap): void => {
  if (typeof window !== 'undefined') {
    setItem(LAST_READ_STORAGE_KEY, JSON.stringify(lastRead));
  }
};

const normalizePlannerRecord = (input: unknown): Record<string, PlannerPlan> => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const entries = Object.entries(input as Record<string, PlannerPlan>);
  if (entries.length === 0) {
    return {};
  }

  return entries.reduce<Record<string, PlannerPlan>>((acc, [, value]) => {
    if (value && typeof value === 'object' && 'id' in value) {
      const plan = value as PlannerPlan;
      acc[plan.id] = plan;
    }
    return acc;
  }, {});
};

export const loadPlannerFromStorage = (): Record<string, PlannerPlan> => {
  if (typeof window === 'undefined') return {};

  const savedPlanner = getItem(PLANNER_STORAGE_KEY);
  if (savedPlanner) {
    try {
      return normalizePlannerRecord(JSON.parse(savedPlanner));
    } catch {
      return {};
    }
  }

  const legacy = getItem(LEGACY_MEMORIZATION_STORAGE_KEY);
  if (legacy) {
    try {
      const parsed = normalizePlannerRecord(JSON.parse(legacy));
      removeItem(LEGACY_MEMORIZATION_STORAGE_KEY);
      setItem(PLANNER_STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    } catch {
      return {};
    }
  }

  return {};
};

export const savePlannerToStorage = (planner: Record<string, PlannerPlan>): void => {
  if (typeof window !== 'undefined') {
    setItem(PLANNER_STORAGE_KEY, JSON.stringify(planner));
    removeItem(LEGACY_MEMORIZATION_STORAGE_KEY);
  }
};
