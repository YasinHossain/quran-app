import { Bookmark } from '@/src/domain/entities';

import { getStoredBookmarks, mapStoredToBookmark } from './storage';

const FOLDER_PREFIX = 'folder:';

export async function findFolders(userId: string): Promise<string[]> {
  const stored = getStoredBookmarks().filter((b) => b.userId === userId);
  const folders = new Set<string>();
  stored.forEach((b) => {
    b.tags.forEach((tag) => {
      if (tag.startsWith(FOLDER_PREFIX)) folders.add(tag.slice(FOLDER_PREFIX.length));
    });
  });
  return Array.from(folders).sort();
}

export async function findFolderWithBookmarks(
  userId: string,
  folderName: string
): Promise<Bookmark[]> {
  const tag = `${FOLDER_PREFIX}${folderName}`;
  return getStoredBookmarks()
    .filter((b) => b.userId === userId && b.tags.includes(tag))
    .map((b) => mapStoredToBookmark(b))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
