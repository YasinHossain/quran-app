import { Folder, Bookmark, MemorizationPlan } from '@/domain/entities';

export const createFolder = (name: string, color?: string, icon?: string): Folder => ({
  id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  color,
  icon,
  createdAt: Date.now(),
  bookmarks: [],
});

export const findBookmark = (
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
  return findBookmark(folders, verseId) !== null;
};

export const getAllBookmarkedVerses = (folders: Folder[]): string[] => {
  const allVerses = folders.flatMap((folder) =>
    folder.bookmarks.map((bookmark) => bookmark.verseId)
  );
  return [...new Set(allVerses)];
};

export const addBookmark = (
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
      defaultFolder = createFolder('Uncategorized');
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

export const removeBookmark = (
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

export const updateBookmark = (
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
  id: `memorization-${surahId}-${Date.now()}`,
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
export const getSortedFolders = (
  folders: Folder[],
  sortBy: 'recent' | 'name-asc' | 'name-desc' | 'most-verses'
): Folder[] => {
  const items = [...folders];
  switch (sortBy) {
    case 'name-asc':
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return items.sort((a, b) => b.name.localeCompare(a.name));
    case 'most-verses':
      return items.sort((a, b) => b.bookmarks.length - a.bookmarks.length);
    case 'recent':
    default:
      return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
};
export const deleteFolder = (folders: Folder[], folderId: string): Folder[] =>
  folders.filter((f) => f.id !== folderId);

export const renameFolder = (
  folders: Folder[],
  folderId: string,
  newName: string,
  color?: string,
  icon?: string
): Folder[] =>
  folders.map((f) =>
    f.id === folderId ? { ...f, name: newName, color, icon } : f
  );
