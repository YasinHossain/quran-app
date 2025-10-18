import { Folder, Bookmark, Chapter, MemorizationPlan, LastReadMap } from '@/types';

export interface BookmarkContextType {
  folders: Folder[];
  createFolder: (name: string, color?: string, icon?: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string, color?: string, icon?: string) => void;
  addBookmark: (verseId: string, folderId?: string, metadata?: Partial<Bookmark>) => void;
  removeBookmark: (verseId: string, folderId: string) => void;
  isBookmarked: (verseId: string) => boolean;
  findBookmark: (verseId: string) => { folder: Folder; bookmark: Bookmark } | null;
  toggleBookmark: (verseId: string, folderId?: string, metadata?: Partial<Bookmark>) => void;
  updateBookmark: (verseId: string, data: Partial<Bookmark>) => void;
  bookmarkedVerses: string[];
  pinnedVerses: Bookmark[];
  togglePinned: (verseId: string, metadata?: Partial<Bookmark>) => void;
  isPinned: (verseId: string) => boolean;
  lastRead: LastReadMap;
  setLastRead: (surahId: string, verseNumber: number, verseKey?: string, globalVerseId?: number) => void;
  chapters: Chapter[];
  memorization: Record<string, MemorizationPlan>;
  addToMemorization: (surahId: number, targetVerses?: number) => void;
  createMemorizationPlan: (surahId: number, targetVerses: number, planName?: string) => void;
  updateMemorizationProgress: (surahId: number, completedVerses: number) => void;
  removeFromMemorization: (surahId: number) => void;
}
