import { Folder, Bookmark, MemorizationPlan } from '@/types';

export const createNewFolder = (name: string, color?: string, icon?: string): Folder => ({
  id: crypto.randomUUID(),
  name,
  color,
  icon,
  createdAt: Date.now(),
  bookmarks: [],
});

export const findBookmarkInFolders = (
  folders: Folder[],
  verseId: string
): { folder: Folder; bookmark: Bookmark } | null => {
  for (const folder of folders) {
    const bookmark = folder.bookmarks.find((b) => b.verseId === verseId);
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
    folder.bookmarks.map((bookmark) => bookmark.verseId)
  );
  return [...new Set(allVerses)];
};

export const addBookmarkToFolder = (
  folders: Folder[],
  verseId: string,
  folderId?: string
): Folder[] => {
  if (isVerseBookmarked(folders, verseId)) {
    return folders;
  }

  const newBookmark: Bookmark = {
    verseId,
    createdAt: Date.now(),
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
  return folders.map((folder) =>
    folder.id === folderId
      ? {
          ...folder,
          bookmarks: folder.bookmarks.filter((b) => b.verseId !== verseId),
        }
      : folder
  );
};

export const updateBookmarkInFolders = (
  folders: Folder[],
  verseId: string,
  data: Partial<Bookmark>
): Folder[] => {
  return folders.map((folder) => ({
    ...folder,
    bookmarks: folder.bookmarks.map((bookmark) =>
      bookmark.verseId === verseId ? { ...bookmark, ...data } : bookmark
    ),
  }));
};

export const createMemorizationPlan = (
  surahId: number,
  targetVerses: number,
  planName?: string
): MemorizationPlan => ({
  id: crypto.randomUUID(),
  surahId,
  targetVerses,
  completedVerses: 0,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
  notes: planName || `Surah ${surahId} Plan`,
});

export const updateMemorizationProgress = (
  memorization: Record<string, MemorizationPlan>,
  surahId: number,
  completedVerses: number
): Record<string, MemorizationPlan> => {
  const key = surahId.toString();
  if (!memorization[key]) return memorization;

  return {
    ...memorization,
    [key]: {
      ...memorization[key],
      completedVerses,
      lastUpdated: Date.now(),
    },
  };
};
