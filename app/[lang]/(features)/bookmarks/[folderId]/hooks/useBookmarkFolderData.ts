import { useMemo } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';

import type { Bookmark, Folder } from '@/types';

interface UseBookmarkFolderDataParams {
  folderId: string;
}

export function useBookmarkFolderData({ folderId }: UseBookmarkFolderDataParams): {
  folder: Folder | undefined;
  bookmarks: Bookmark[];
} {
  const { folders } = useBookmarks();

  const folder = useMemo(() => folders.find((f) => f.id === folderId), [folders, folderId]);
  const bookmarks = useMemo(() => folder?.bookmarks || [], [folder]);

  return {
    folder,
    bookmarks,
  } as const;
}
