import type { Bookmark, Folder, MemorizationPlan } from '@/domain/entities';
import { BookmarkStorageRepository } from '@/infrastructure/bookmarks/BookmarkStorageRepository';
import { PinnedStorageRepository } from '@/infrastructure/bookmarks/PinnedStorageRepository';
import { LastReadStorageRepository } from '@/infrastructure/bookmarks/LastReadStorageRepository';
import { MemorizationStorageRepository } from '@/infrastructure/bookmarks/MemorizationStorageRepository';
import type { BookmarkRepository } from '@/domain/repositories/BookmarkRepository';
import type { PinnedRepository } from '@/domain/repositories/PinnedRepository';
import type { LastReadRepository } from '@/domain/repositories/LastReadRepository';
import type { MemorizationRepository } from '@/domain/repositories/MemorizationRepository';
import {
  addBookmark,
  removeBookmark,
  updateBookmark,
  createFolder as createFolderUseCase,
  deleteFolder as deleteFolderUseCase,
  renameFolder as renameFolderUseCase,
  findBookmark,
  getSortedFolders,
  createMemorizationPlan as createMemorizationPlanUseCase,
  updateMemorizationProgress as updateMemorizationProgressUseCase,
} from '@/domain/usecases/bookmark';

export class BookmarkService {
  constructor(
    private bookmarkRepo: BookmarkRepository,
    private pinnedRepo: PinnedRepository,
    private lastReadRepo: LastReadRepository,
    private memorizationRepo: MemorizationRepository
  ) {}

  load() {
    return {
      folders: this.bookmarkRepo.load(),
      pinned: this.pinnedRepo.load(),
    };
  }

  createFolder(
    folders: Folder[],
    name: string,
    color?: string,
    icon?: string
  ): Folder[] {
    const updated = [...folders, createFolderUseCase(name, color, icon)];
    this.bookmarkRepo.save(updated);
    return updated;
  }

  deleteFolder(folders: Folder[], folderId: string): Folder[] {
    const updated = deleteFolderUseCase(folders, folderId);
    this.bookmarkRepo.save(updated);
    return updated;
  }

  renameFolder(
    folders: Folder[],
    folderId: string,
    newName: string,
    color?: string,
    icon?: string
  ): Folder[] {
    const updated = renameFolderUseCase(folders, folderId, newName, color, icon);
    this.bookmarkRepo.save(updated);
    return updated;
  }

  addBookmark(
    folders: Folder[],
    verseId: string,
    folderId?: string
  ): Folder[] {
    const updated = addBookmark(folders, verseId, folderId);
    this.bookmarkRepo.save(updated);
    return updated;
  }

  removeBookmark(
    folders: Folder[],
    verseId: string,
    folderId: string
  ): Folder[] {
    const updated = removeBookmark(folders, verseId, folderId);
    this.bookmarkRepo.save(updated);
    return updated;
  }

  updateBookmark(
    folders: Folder[],
    verseId: string,
    data: Partial<Bookmark>
  ): Folder[] {
    const updated = updateBookmark(folders, verseId, data);
    this.bookmarkRepo.save(updated);
    return updated;
  }

  findBookmark(folders: Folder[], verseId: string) {
    return findBookmark(folders, verseId);
  }

  getSortedFolders(
    folders: Folder[],
    sortBy: 'recent' | 'name-asc' | 'name-desc' | 'most-verses'
  ) {
    return getSortedFolders(folders, sortBy);
  }

  togglePinned(pinned: Bookmark[], verseId: string): Bookmark[] {
    const exists = pinned.some((b) => b.verseId === verseId);
    const updated = exists
      ? pinned.filter((b) => b.verseId !== verseId)
      : [...pinned, { verseId, createdAt: Date.now() }];
    this.pinnedRepo.save(updated);
    return updated;
  }

  isPinned(pinned: Bookmark[], verseId: string): boolean {
    return pinned.some((b) => b.verseId === verseId);
  }

  loadLastRead(): Record<string, number> {
    return this.lastReadRepo.load();
  }

  setLastRead(
    lastRead: Record<string, number>,
    surahId: string,
    verseId: number
  ): Record<string, number> {
    const updated = { ...lastRead, [surahId]: verseId };
    this.lastReadRepo.save(updated);
    return updated;
  }

  loadMemorization(): Record<string, MemorizationPlan> {
    return this.memorizationRepo.load();
  }

  createMemorizationPlan(
    memorization: Record<string, MemorizationPlan>,
    surahId: number,
    targetVerses: number,
    planName?: string
  ): Record<string, MemorizationPlan> {
    const plan = createMemorizationPlanUseCase(
      surahId,
      targetVerses,
      planName
    );
    const key = surahId.toString();
    const updated = { ...memorization, [key]: plan };
    this.memorizationRepo.save(updated);
    return updated;
  }

  updateMemorizationProgress(
    memorization: Record<string, MemorizationPlan>,
    surahId: number,
    completedVerses: number
  ): Record<string, MemorizationPlan> {
    const updated = updateMemorizationProgressUseCase(
      memorization,
      surahId,
      completedVerses
    );
    this.memorizationRepo.save(updated);
    return updated;
  }

  removeMemorizationPlan(
    memorization: Record<string, MemorizationPlan>,
    surahId: number
  ): Record<string, MemorizationPlan> {
    const key = surahId.toString();
    const updated = { ...memorization };
    delete updated[key];
    this.memorizationRepo.save(updated);
    return updated;
  }

  lockBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  unlockBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  navigateToFolder(router: { push: (path: string) => void }, folderId: string) {
    router.push(`/bookmarks/${folderId}`);
  }

  navigateToSection(router: { push: (path: string) => void }, section: string) {
    if (section === 'pinned') {
      router.push('/bookmarks/pinned');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else if (section === 'memorization') {
      router.push('/bookmarks/memorization');
    } else {
      router.push('/bookmarks');
    }
  }

  navigateToVerse(router: { push: (path: string) => void }, verseKey: string) {
    const [surahId] = verseKey.split(':');
    router.push(`/surah/${surahId}#verse-${verseKey}`);
  }
}

export const bookmarkService = new BookmarkService(
  new BookmarkStorageRepository(),
  new PinnedStorageRepository(),
  new LastReadStorageRepository(),
  new MemorizationStorageRepository()
);
