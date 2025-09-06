'use client';
import { useMemo } from 'react';

import { Bookmark, Chapter, Folder } from '@/types';

import {
  addBookmarkToFolder,
  removeBookmarkFromFolder,
  updateBookmarkInFolders,
  findBookmarkInFolders,
  isVerseBookmarked,
} from '../bookmark-utils';
export interface BookmarkOperations {
  addBookmark(verseId: string, folderId?: string): void;
  removeBookmark(verseId: string, folderId: string): void;
  toggleBookmark(verseId: string, folderId?: string): void;
  updateBookmark(verseId: string, data: Partial<Bookmark>): void;
}
export default function useBookmarkOperations(
  folders: Folder[],
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>,
  pinned: Bookmark[],
  setPinned: React.Dispatch<React.SetStateAction<Bookmark[]>>,
  chapters: Chapter[],
  fetchMetadata: (verseId: string, chaptersList: Chapter[]) => void
): BookmarkOperations {
  return useMemo(() => {
    function addBookmark(verseId: string, folderId?: string) {
      if (folderId === 'pinned') {
        setPinned((p) =>
          p.some((b) => b.verseId === verseId) ? p : [...p, { verseId, createdAt: Date.now() }]
        );
        void fetchMetadata(verseId, chapters);
        return;
      }
      setFolders((p) => addBookmarkToFolder(p, verseId, folderId));
      void fetchMetadata(verseId, chapters);
    }
    function removeBookmark(verseId: string, folderId: string) {
      if (folderId === 'pinned') {
        setPinned((p) => p.filter((b) => b.verseId !== verseId));
        return;
      }
      setFolders((p) => removeBookmarkFromFolder(p, verseId, folderId));
    }
    function toggleBookmark(verseId: string, folderId?: string) {
      if (isVerseBookmarked(folders, verseId)) {
        const f = findBookmarkInFolders(folders, verseId);
        if (f) removeBookmark(verseId, f.folder.id);
      } else {
        addBookmark(verseId, folderId);
      }
    }
    function updateBookmark(verseId: string, data: Partial<Bookmark>) {
      setFolders((p) => updateBookmarkInFolders(p, verseId, data));
      setPinned((p) => p.map((b) => (b.verseId === verseId ? { ...b, ...data } : b)));
    }
    return { addBookmark, removeBookmark, toggleBookmark, updateBookmark };
  }, [folders, setFolders, pinned, setPinned, chapters, fetchMetadata]);
}
