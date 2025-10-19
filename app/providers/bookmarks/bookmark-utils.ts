import { Folder, Bookmark, PlannerPlan } from '@/types';

const generateId = (): string => {
  if (typeof globalThis !== 'undefined') {
    const cryptoGlobal = globalThis as typeof globalThis & { crypto?: Crypto };
    const cryptoApi = cryptoGlobal.crypto;

    if (cryptoApi) {
      const ensuredCrypto = cryptoApi;

      if (typeof ensuredCrypto.randomUUID === 'function') {
        return ensuredCrypto.randomUUID();
      }

      if (typeof ensuredCrypto.getRandomValues === 'function') {
        const bytes = ensuredCrypto.getRandomValues(new Uint8Array(16)) as Uint8Array;
        const sixth = bytes[6] ?? 0;
        const eighth = bytes[8] ?? 0;
        bytes[6] = (sixth & 0x0f) | 0x40;
        bytes[8] = (eighth & 0x3f) | 0x80;
        const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      }
    }
  }

  const randomSuffix = Math.random().toString(16).slice(2);
  return `id-${Date.now()}-${randomSuffix}`;
};

const normalizeVerseId = (id: string | number): string => String(id);

const matchesVerseId = (bookmark: Bookmark, verseId: string | number): boolean =>
  normalizeVerseId(bookmark.verseId) === normalizeVerseId(verseId);

export const createNewFolder = (name: string, color?: string, icon?: string): Folder => {
  const base: Folder = {
    id: generateId(),
    name,
    createdAt: Date.now(),
    bookmarks: [],
  };

  if (color !== undefined) {
    base.color = color;
  }

  if (icon !== undefined) {
    base.icon = icon;
  }

  return base;
};

export const findBookmarkInFolders = (
  folders: Folder[],
  verseId: string
): { folder: Folder; bookmark: Bookmark } | null => {
  for (const folder of folders) {
    const bookmark = folder.bookmarks.find((b) => matchesVerseId(b, verseId));
    if (bookmark) {
      return { folder, bookmark };
    }
  }
  return null;
};

export const isVerseBookmarked = (folders: Folder[], verseId: string): boolean => {
  return findBookmarkInFolders(folders, verseId) !== null;
};

export const getAllBookmarkedVerses = (folders: Folder[]): string[] => {
  const allVerses = folders.flatMap((folder) =>
    folder.bookmarks.map((bookmark) => normalizeVerseId(bookmark.verseId))
  );
  return [...new Set(allVerses)];
};

export const addBookmarkToFolder = (
  folders: Folder[],
  verseId: string,
  folderId?: string,
  metadata: Partial<Bookmark> = {}
): Folder[] => {
  const normalizedVerseId = normalizeVerseId(verseId);
  if (isVerseBookmarked(folders, verseId)) {
    return folders;
  }

  const newBookmark: Bookmark = {
    verseId: normalizedVerseId,
    createdAt: Date.now(),
    ...metadata,
  };

  let targetFolderId = folderId;
  if (!targetFolderId) {
    let defaultFolder = folders.find((f) => f.name === 'Uncategorized');
    if (!defaultFolder) {
      defaultFolder = createNewFolder('Uncategorized');
      folders = [defaultFolder, ...folders];
    }
    targetFolderId = defaultFolder.id;
  }

  return folders.map((folder) =>
    folder.id === targetFolderId
      ? { ...folder, bookmarks: [...folder.bookmarks, newBookmark] }
      : folder
  );
};

export const removeBookmarkFromFolder = (
  folders: Folder[],
  verseId: string,
  folderId: string
): Folder[] => {
  const normalizedVerseId = normalizeVerseId(verseId);
  return folders.map((folder) =>
    folder.id === folderId
      ? {
          ...folder,
          bookmarks: folder.bookmarks.filter((b) => !matchesVerseId(b, normalizedVerseId)),
        }
      : folder
  );
};

export const updateBookmarkInFolders = (
  folders: Folder[],
  verseId: string,
  data: Partial<Bookmark>
): Folder[] => {
  const normalizedVerseId = normalizeVerseId(verseId);
  return folders.map((folder) => ({
    ...folder,
    bookmarks: folder.bookmarks.map((bookmark) =>
      matchesVerseId(bookmark, normalizedVerseId) ? { ...bookmark, ...data } : bookmark
    ),
  }));
};

export const createPlannerPlan = (
  surahId: number,
  targetVerses: number,
  planName?: string
): PlannerPlan => ({
  id: generateId(),
  surahId,
  targetVerses,
  completedVerses: 0,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
  notes: planName || `Surah ${surahId} Plan`,
});

export const updatePlannerProgress = (
  planner: Record<string, PlannerPlan>,
  surahId: number,
  completedVerses: number
): Record<string, PlannerPlan> => {
  const key = surahId.toString();
  if (!planner[key]) return planner;

  return {
    ...planner,
    [key]: {
      ...planner[key],
      completedVerses,
      lastUpdated: Date.now(),
    },
  };
};
